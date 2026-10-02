"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ringBell } from "@/lib/bell";

export const TIMER_OPTIONS = [0, 15, 30, 60] as const;
export type TimerMinutes = (typeof TIMER_OPTIONS)[number];
export type MessageState = "hidden" | "shown" | "leaving";

const FADE_MS = 5000;
const FADE_STEP_MS = 50;
const LEAVE_MS = 500;

type Options = {
  playing: boolean;
  /** Saved volume setting (0-100); the fade starts from here and returns to it. */
  volume: number;
  pause: () => void;
  setOutputVolume: (volume: number) => void;
  restoreVolume: () => void;
};

/**
 * Sleep timer. The end time is an absolute timestamp so it stays correct in
 * background tabs. When it passes: bell, a 5 second volume fade, pause, then a
 * thank-you message that stays until the user plays again or taps it.
 */
export function useLastStopTimer({ playing, volume, pause, setOutputVolume, restoreVolume }: Options) {
  const [minutes, setMinutes] = useState<TimerMinutes>(0);
  const [remaining, setRemaining] = useState(0);
  const [message, setMessage] = useState<MessageState>("hidden");

  const endAtRef = useRef<number | null>(null);
  const fadeRef = useRef<number | null>(null);
  const leaveRef = useRef<number | null>(null);
  const messageRef = useRef<MessageState>("hidden");
  const latest = useRef({ playing, volume, pause, setOutputVolume, restoreVolume });

  useEffect(() => {
    latest.current = { playing, volume, pause, setOutputVolume, restoreVolume };
  }, [playing, volume, pause, setOutputVolume, restoreVolume]);

  const updateMessage = useCallback((next: MessageState) => {
    messageRef.current = next;
    setMessage(next);
  }, []);

  /** Stops a running fade and puts the volume back. Returns true if a fade was running. */
  const cancelFade = useCallback(() => {
    if (fadeRef.current === null) return false;
    window.clearInterval(fadeRef.current);
    fadeRef.current = null;
    latest.current.restoreVolume();
    return true;
  }, []);

  const dismissMessage = useCallback(() => {
    if (messageRef.current !== "shown") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      updateMessage("hidden");
      return;
    }
    updateMessage("leaving");
    leaveRef.current = window.setTimeout(() => updateMessage("hidden"), LEAVE_MS);
  }, [updateMessage]);

  const showMessage = useCallback(() => {
    if (leaveRef.current !== null) window.clearTimeout(leaveRef.current);
    leaveRef.current = null;
    updateMessage("shown");
  }, [updateMessage]);

  const startFade = useCallback(() => {
    const from = latest.current.volume;
    const startedAt = Date.now();
    fadeRef.current = window.setInterval(() => {
      const t = Math.min(1, (Date.now() - startedAt) / FADE_MS);
      // Cosine ease: gentle at both ends.
      latest.current.setOutputVolume(Math.round(from * 0.5 * (1 + Math.cos(Math.PI * t))));
      if (t < 1) return;
      if (fadeRef.current !== null) window.clearInterval(fadeRef.current);
      fadeRef.current = null;
      latest.current.pause();
      latest.current.restoreVolume();
      showMessage();
    }, FADE_STEP_MS);
  }, [showMessage]);

  const check = useCallback(() => {
    const endAt = endAtRef.current;
    if (endAt === null) return;
    const left = endAt - Date.now();
    if (left > 0) {
      setRemaining(Math.ceil(left / 60000));
      return;
    }
    endAtRef.current = null;
    setMinutes(0);
    setRemaining(0);
    if (!latest.current.playing) {
      showMessage();
      return;
    }
    ringBell();
    startFade();
  }, [showMessage, startFade]);

  const select = useCallback(
    (next: TimerMinutes) => {
      cancelFade();
      endAtRef.current = next > 0 ? Date.now() + next * 60000 : null;
      setMinutes(next);
      setRemaining(next);
    },
    [cancelFade],
  );

  // Short interval plus a check when the tab becomes visible again.
  useEffect(() => {
    if (minutes === 0) return;
    const id = window.setInterval(check, 1000);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", check);
    };
  }, [minutes, check]);

  useEffect(
    () => () => {
      if (fadeRef.current !== null) window.clearInterval(fadeRef.current);
      if (leaveRef.current !== null) window.clearTimeout(leaveRef.current);
    },
    [],
  );

  return { minutes, remaining, message, select, cancelFade, dismissMessage };
}
