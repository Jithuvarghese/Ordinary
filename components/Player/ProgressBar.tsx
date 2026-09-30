"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { formatDuration } from "@/lib/format";

type Props = {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  disabled?: boolean;
};

export default function ProgressBar({ currentTime, duration, onSeek, disabled }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragTime, setDragTime] = useState<number | null>(null);

  const hasDuration = duration > 0;
  const shown = dragTime ?? Math.min(currentTime, duration || currentTime);
  const ratio = hasDuration ? Math.min(1, Math.max(0, shown / duration)) : 0;
  const inactive = disabled || !hasDuration;

  const timeAt = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * duration;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (inactive || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragTime(timeAt(e.clientX));
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragTime === null) return;
    setDragTime(timeAt(e.clientX));
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (dragTime === null) return;
    const time = timeAt(e.clientX);
    setDragTime(null);
    onSeek(time);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (inactive) return;
    const steps: Record<string, number> = {
      ArrowRight: 5,
      ArrowUp: 5,
      ArrowLeft: -5,
      ArrowDown: -5,
      PageUp: duration / 10,
      PageDown: -duration / 10,
    };
    let target: number | null = null;
    if (e.key in steps) target = currentTime + steps[e.key];
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = Math.max(0, duration - 1);
    if (target === null) return;
    e.preventDefault();
    onSeek(Math.min(duration, Math.max(0, target)));
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <div
        ref={trackRef}
        role="slider"
        tabIndex={inactive ? -1 : 0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(shown)}
        aria-valuetext={`${formatDuration(shown)} of ${formatDuration(duration)}`}
        aria-disabled={inactive || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={() => setDragTime(null)}
        onKeyDown={onKeyDown}
        className="group relative -my-1.5 flex h-4 cursor-pointer touch-none items-center rounded-full aria-disabled:cursor-default"
      >
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-cream/20">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-cream"
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
        <div
          className="absolute size-2.5 -translate-x-1/2 rounded-full bg-cream opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ left: `${ratio * 100}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="text-[11px] font-medium tabular-nums text-cream/75 sm:text-xs" aria-hidden="true">
        {formatDuration(shown)} / {formatDuration(duration)}
      </div>
    </div>
  );
}
