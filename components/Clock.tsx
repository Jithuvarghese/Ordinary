"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";
import { formatClock } from "@/lib/format";

// One shared timer that notifies subscribers only when the minute changes.
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
let lastMinute = currentMinute();

function currentMinute() {
  return Math.floor(Date.now() / 60_000);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    timer = setInterval(() => {
      const minute = currentMinute();
      if (minute !== lastMinute) {
        lastMinute = minute;
        listeners.forEach((l) => l());
      }
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => currentMinute();
const getServerSnapshot = () => null;

export default function Clock() {
  const minute = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const date = minute === null ? null : new Date(minute * 60_000);

  return (
    <time
      dateTime={date?.toISOString()}
      className="min-w-[4.5rem] whitespace-nowrap text-sm font-medium tabular-nums tracking-wide text-cream sm:text-base"
    >
      {date ? formatClock(date, siteConfig.timeZone) : " "}
    </time>
  );
}
