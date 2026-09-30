"use client";

import Image from "next/image";
import { useState } from "react";
import { coverSrc, type Song } from "@/lib/songs";

function BusDisc() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true" className="h-full w-full">
      <circle cx="36" cy="36" r="36" fill="var(--color-hot-red)" />
      <circle cx="36" cy="36" r="30" fill="none" stroke="#fff3e0" strokeOpacity=".12" />
      <circle cx="36" cy="36" r="24" fill="none" stroke="#fff3e0" strokeOpacity=".1" />
      <g fill="none" stroke="#fff3e0" strokeWidth="1.8" strokeLinejoin="round">
        <rect x="22" y="17" width="28" height="30" rx="5" />
        <path d="M22 35h28M26 23h20v8H26z" />
        <path d="M27 47v4M45 47v4" strokeLinecap="round" />
      </g>
      <circle cx="28" cy="41" r="1.6" fill="#fff3e0" />
      <circle cx="44" cy="41" r="1.6" fill="#fff3e0" />
    </svg>
  );
}

export default function Cover({ song, playing }: { song: Song; playing: boolean }) {
  const src = coverSrc(song);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = src !== null && failedSrc !== src;

  return (
    <div
      className="vinyl relative size-14 shrink-0 overflow-hidden rounded-full bg-deep-brown shadow-[0_4px_18px_rgb(0_0_0/0.35)] ring-1 ring-cream/20 sm:size-[72px]"
      data-playing={playing}
    >
      <div key={song.id} className="fade-in absolute inset-0">
        {showImage ? (
          <Image
            src={src}
            alt=""
            fill
            sizes="72px"
            className="object-cover"
            onError={() => setFailedSrc(src)}
          />
        ) : (
          <BusDisc />
        )}
      </div>
      {/* Grooves and the centre hole make it read as a record. */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,transparent_0_3px,rgb(0_0_0/0.08)_3px_4px)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-deep-brown ring-2 ring-cream/40" />
    </div>
  );
}
