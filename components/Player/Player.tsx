"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";
import { useMediaSession } from "@/hooks/useMediaSession";
import { useVolume } from "@/hooks/useVolume";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import { isRadioReady } from "@/lib/radio";
import { songs } from "@/lib/songs";
import Controls from "./Controls";
import Cover from "./Cover";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName) ||
    target.getAttribute("role") === "slider"
  );
}

const radio = siteConfig.radioMode && isRadioReady(songs);

export default function Player() {
  const [volume, setVolume] = useVolume();
  const { status, actions, containerRef } = useYouTubePlayer(songs, { volume, radio });
  const { song, playing, loading, started, currentTime, duration, error } = status;

  useMediaSession({ song, playing, started, currentTime, duration, handlers: actions });

  // Space toggles playback unless focus is somewhere that uses the key itself.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      actions.toggle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [actions]);

  if (!song) return null;

  return (
    <section
      aria-label="Music player"
      className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:pb-8"
    >
      {/* The YouTube iframe lives off-screen; only its audio is used. */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] top-0 size-[200px] overflow-hidden opacity-0"
      />

      <p className="sr-only" aria-live="polite">
        {started && !error ? `Now playing: ${song.title} by ${song.artist}` : ""}
      </p>

      <div className="glass flex w-full max-w-[600px] items-center gap-3 rounded-[2rem] py-2.5 pl-2.5 pr-2 sm:gap-4 sm:rounded-full sm:py-3 sm:pl-3 sm:pr-4">
        <Cover song={song} playing={playing} />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div key={song.id} className="fade-in min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-cream sm:text-base" title={song.title}>
              {song.title}
            </p>
            <p className="truncate text-xs leading-tight text-cream/70 sm:text-[13px]">
              {error ?? song.artist}
            </p>
          </div>
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={actions.seek} />
        </div>

        <Controls
          playing={playing}
          loading={loading}
          emphasise={!started}
          onToggle={actions.toggle}
          onPrevious={actions.previous}
          onNext={actions.next}
        />

        <div className="hidden sm:block">
          <VolumeControl volume={volume} onChange={setVolume} />
        </div>
      </div>
    </section>
  );
}
