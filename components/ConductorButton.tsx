"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { callConductor } from "@/lib/conductor";
import { isTypingTarget } from "@/lib/dom";
import { useVolume } from "@/hooks/useVolume";

type Props = {
  /** URLs of the conductor clips found in public/sfx. May be empty. */
  clips: string[];
};

export default function ConductorButton({ clips }: Props) {
  const [volume] = useVolume();
  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);

  const call = useCallback(async () => {
    if (speakingRef.current) return;
    speakingRef.current = true;
    setSpeaking(true);
    try {
      await callConductor(clips, volume);
    } finally {
      speakingRef.current = false;
      setSpeaking(false);
    }
  }, [clips, volume]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "c" || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      void call();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [call]);

  return (
    <div className="group/tip fixed left-4 top-1/2 z-20 -translate-y-1/2 sm:left-7">
      <button
        type="button"
        onClick={() => void call()}
        aria-label="Conductor call"
        aria-keyshortcuts="C"
        aria-pressed={speaking}
        className="grid size-11 place-items-center rounded-full border border-cream/20 bg-deep-brown/45 text-cream shadow-lg backdrop-blur-md transition hover:bg-deep-brown/65 active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`size-5 ${speaking ? "conductor-speak" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10v4a1 1 0 0 0 1 1h3l9 4.5V4.5L7 9H4a1 1 0 0 0-1 1z" />
          <path d="M19.5 9.5a3.5 3.5 0 0 1 0 5" />
          <path d="M7 15l1.2 4.2a1 1 0 0 0 1 .8h1.3a.8.8 0 0 0 .8-1L10.5 16.5" />
        </svg>
      </button>
      <span
        lang="ml"
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-ml text-[10px] leading-none text-cream/80"
      >
        റൈറ്റ്
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-cream/15 bg-deep-brown/70 px-3 py-1.5 text-xs text-cream opacity-0 shadow-lg backdrop-blur-md transition group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 max-sm:hidden"
      >
        Conductor call (C)
      </span>
    </div>
  );
}
