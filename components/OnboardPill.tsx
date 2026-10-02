"use client";

import { siteConfig } from "@/config/site";
import { usePresenceCount } from "@/hooks/usePresenceCount";

export default function OnboardPill() {
  const count = usePresenceCount();

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-deep-brown/45 px-3 py-1.5 text-[13px] font-medium sm:px-3.5 sm:text-[15px] text-cream shadow-lg backdrop-blur-md"
    >
      <span className="relative flex size-2">
        <span className="pulse-dot absolute inline-flex size-full rounded-full bg-emerald-400" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
      </span>
      <span className="tabular-nums">
        <span key={count} className="tick inline-block">
          {count}
        </span>{" "}
        {count === 1 ? siteConfig.passengerLabel.one : siteConfig.passengerLabel.other}
      </span>
    </div>
  );
}
