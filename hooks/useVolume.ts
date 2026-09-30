"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "limited-stop:volume";
const DEFAULT_VOLUME = 80;

const listeners = new Set<() => void>();

function read(): number {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) return DEFAULT_VOLUME;
    const value = Number(raw);
    return Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : DEFAULT_VOLUME;
  } catch {
    return DEFAULT_VOLUME;
  }
}

let current: number | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => (current ??= read());
const getServerSnapshot = () => DEFAULT_VOLUME;

/** Volume (0-100), the only thing persisted in localStorage. */
export function useVolume(): [number, (volume: number) => void] {
  const volume = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setVolume = useCallback((next: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(next)));
    current = clamped;
    try {
      window.localStorage.setItem(KEY, String(clamped));
    } catch {
      // Storage can be unavailable (private mode); the session still works.
    }
    listeners.forEach((l) => l());
  }, []);

  return [volume, setVolume];
}
