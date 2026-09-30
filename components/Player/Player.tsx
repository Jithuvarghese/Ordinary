"use client";

import { useState } from "react";
import { songs } from "@/lib/songs";
import Controls from "./Controls";
import Cover from "./Cover";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";

export default function Player() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const song = songs[index];
  const count = songs.length;

  if (!song) return null;

  return (
    <section
      aria-label="Music player"
      className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:pb-8"
    >
      <div className="glass flex w-full max-w-[600px] items-center gap-3 rounded-[2rem] py-2.5 pl-2.5 pr-2 sm:gap-4 sm:rounded-full sm:py-3 sm:pl-3 sm:pr-4">
        <Cover song={song} playing={playing} />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div key={song.id} className="fade-in min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-cream sm:text-base" title={song.title}>
              {song.title}
            </p>
            <p className="truncate text-xs leading-tight text-cream/70 sm:text-[13px]">{song.artist}</p>
          </div>
          <ProgressBar currentTime={0} duration={song.duration} onSeek={() => {}} />
        </div>

        <Controls
          playing={playing}
          emphasise={!playing}
          onToggle={() => setPlaying((p) => !p)}
          onPrevious={() => setIndex((i) => (i - 1 + count) % count)}
          onNext={() => setIndex((i) => (i + 1) % count)}
        />

        <div className="hidden sm:block">
          <VolumeControl volume={volume} onChange={setVolume} />
        </div>
      </div>
    </section>
  );
}
