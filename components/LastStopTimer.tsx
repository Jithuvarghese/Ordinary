"use client";

import { useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { TIMER_OPTIONS, type TimerMinutes } from "@/hooks/useLastStopTimer";

const LABELS: Record<TimerMinutes, string> = { 0: "Off", 15: "15 min", 30: "30 min", 60: "1 Hr" };

type Props = {
  minutes: TimerMinutes;
  remaining: number;
  onSelect: (minutes: TimerMinutes) => void;
};

export default function LastStopTimer({ minutes, remaining, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedRef = useRef(minutes);
  const menuId = useId();
  const hintId = useId();
  const running = minutes > 0;

  useEffect(() => {
    selectedRef.current = minutes;
  }, [minutes]);

  // Focus the selected option when the menu opens.
  useEffect(() => {
    if (open) itemRefs.current[TIMER_OPTIONS.indexOf(selectedRef.current)]?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (value: TimerMinutes) => {
    onSelect(value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = itemRefs.current;
    const index = items.findIndex((el) => el === document.activeElement);
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (index + 1) % items.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else if (e.key === "Tab") setOpen(false);
    if (next >= 0) {
      e.preventDefault();
      items[next]?.focus();
    }
  };

  return (
    <div ref={rootRef} className="fixed right-4 top-1/2 z-20 -translate-y-1/2 sm:right-7">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={siteConfig.lastStopLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-describedby={running ? hintId : undefined}
        title={siteConfig.lastStopLabel}
        className={`grid size-11 place-items-center rounded-full border border-cream/20 bg-deep-brown/45 text-cream shadow-lg backdrop-blur-md transition hover:bg-deep-brown/65 active:scale-95 ${
          running ? "stop-glow" : ""
        }`}
      >
        <span className="flex flex-col items-center gap-0.5">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={running ? "size-4" : "size-5"}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="3" width="14" height="9" rx="2" />
            <path d="M12 12v9M8.5 21h7M9 7.5h6" />
          </svg>
          {running ? (
            <span aria-hidden="true" className="led-digit text-[10px] font-bold leading-none tabular-nums">
              {remaining}
            </span>
          ) : null}
        </span>
      </button>

      {running ? (
        <span id={hintId} className="sr-only">
          {`${remaining} min left`}
        </span>
      ) : null}

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={siteConfig.lastStopLabel}
          onKeyDown={onMenuKeyDown}
          className="glass popover-in absolute right-full top-1/2 mr-3 flex w-32 -translate-y-1/2 flex-col gap-1 rounded-2xl p-1.5"
        >
          {TIMER_OPTIONS.map((value, i) => {
            const selected = value === minutes;
            return (
              <button
                key={value}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(value)}
                className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                  selected
                    ? "bg-cream/20 font-semibold text-cream"
                    : "text-cream/75 hover:bg-cream/10 hover:text-cream"
                }`}
              >
                {LABELS[value]}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
