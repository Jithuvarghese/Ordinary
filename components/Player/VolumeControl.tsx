"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  volume: number;
  onChange: (volume: number) => void;
};

function SpeakerIcon({ volume }: { volume: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      {volume === 0 ? (
        <path d="m16 9.5 5 5m0-5-5 5" />
      ) : (
        <>
          <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
          {volume > 50 ? <path d="M18.2 6.6a7.6 7.6 0 0 1 0 10.8" /> : null}
        </>
      )}
    </svg>
  );
}

export default function VolumeControl({ volume, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Close the popover when tapping anywhere else (touch devices have no hover).
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="group/volume relative shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`Volume ${volume}%`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="grid size-9 place-items-center rounded-full text-cream/85 transition hover:bg-cream/10 hover:text-cream"
      >
        <SpeakerIcon volume={volume} />
      </button>

      <div
        id={panelId}
        data-open={open}
        className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 rounded-full border border-cream/15 bg-maroon/70 px-3 py-2 shadow-lg backdrop-blur-xl transition data-[open=false]:pointer-events-none data-[open=false]:translate-y-1 data-[open=false]:opacity-0 group-focus-within/volume:pointer-events-auto group-focus-within/volume:translate-y-0 group-focus-within/volume:opacity-100"
      >
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={volume}
          aria-label="Volume"
          onChange={(e) => onChange(Number(e.target.value))}
          className="volume-range block h-4 w-28 cursor-pointer"
          style={{ "--fill": `${volume}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
