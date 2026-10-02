"use client";

import { useEffect } from "react";
import { coverSrc, type Song } from "@/lib/songs";

type Handlers = {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
};

type Options = {
  song: Song | undefined;
  playing: boolean;
  started: boolean;
  currentTime: number;
  duration: number;
  handlers: Handlers;
};

/** Lock-screen, headphone and notification-shade controls. */
export function useMediaSession({ song, playing, started, currentTime, duration, handlers }: Options) {
  const supported = typeof navigator !== "undefined" && "mediaSession" in navigator;

  useEffect(() => {
    if (!supported || !song || !started) return;
    const cover = coverSrc(song);
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: "Ordinary",
      artwork: cover
        ? [{ src: new URL(cover, window.location.origin).href, sizes: "480x360", type: "image/jpeg" }]
        : [],
    });
  }, [supported, song, started]);

  useEffect(() => {
    if (!supported || !started) return;
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }, [supported, playing, started]);

  useEffect(() => {
    if (!supported || !started || !(duration > 0)) return;
    try {
      navigator.mediaSession.setPositionState({
        duration,
        position: Math.min(Math.max(0, currentTime), duration),
        playbackRate: 1,
      });
    } catch {
      // Some browsers reject inconsistent values while a track is loading.
    }
  }, [supported, started, currentTime, duration]);

  const { play, pause, next, previous, seek } = handlers;
  useEffect(() => {
    if (!supported) return;
    const session = navigator.mediaSession;
    const set = (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      try {
        session.setActionHandler(action, handler);
      } catch {
        // Action not supported by this browser.
      }
    };
    set("play", play);
    set("pause", pause);
    set("nexttrack", next);
    set("previoustrack", previous);
    set("seekto", (d) => {
      if (typeof d.seekTime === "number") seek(d.seekTime);
    });
    return () => {
      (["play", "pause", "nexttrack", "previoustrack", "seekto"] as const).forEach((a) => set(a, null));
    };
  }, [supported, play, pause, next, previous, seek]);
}
