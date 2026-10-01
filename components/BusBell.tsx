"use client";

import { useCallback, useEffect, useState } from "react";
import { ringBell } from "@/lib/bell";
import { isTypingTarget } from "@/lib/dom";
import { useVolume } from "@/hooks/useVolume";

export default function BusBell() {
  const [volume] = useVolume();
  const [ringing, setRinging] = useState(false);

  const ring = useCallback(() => {
    ringBell(volume / 100);
    setRinging(true);
    window.setTimeout(() => setRinging(false), 600);
  }, [volume]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "b" || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      ring();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [ring]);

  return (
    <button
      type="button"
      onClick={ring}
      aria-label="Ring the bus bell"
      aria-keyshortcuts="B"
      title="Ring the bell (B)"
      className="fixed right-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-cream/20 bg-deep-brown/45 text-cream shadow-lg backdrop-blur-md transition hover:bg-deep-brown/65 active:scale-95 sm:right-7"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`size-5 origin-top ${ringing ? "bell-swing" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
        <path d="M10 20.5a2 2 0 0 0 4 0" />
      </svg>
    </button>
  );
}
