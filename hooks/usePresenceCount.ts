"use client";

import { useEffect, useState } from "react";
import { migrateKey } from "@/lib/storage";
import { getSupabase } from "@/lib/supabase";

const CHANNEL = "onboard";
const KEY_STORAGE = "ordinary:presence-key";
const LEGACY_KEY_STORAGE = "limited-stop:presence-key";

let warned = false;

/** Random per-tab key; carries no personal data. */
function tabKey(): string {
  try {
    migrateKey(window.sessionStorage, LEGACY_KEY_STORAGE, KEY_STORAGE);
    const existing = window.sessionStorage.getItem(KEY_STORAGE);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.sessionStorage.setItem(KEY_STORAGE, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

/**
 * Number of people with the site open right now.
 * Falls back to 1 (just this visitor) when Supabase is not configured.
 * The data source lives entirely in this hook, so it can be swapped later.
 */
export function usePresenceCount(): number {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      if (process.env.NODE_ENV !== "production" && !warned) {
        warned = true;
        console.warn(
          "[presence] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (or _PUBLISHABLE_KEY) are not set; showing 1 onboard.",
        );
      }
      return;
    }

    const channel = supabase.channel(CHANNEL, { config: { presence: { key: tabKey() } } });

    channel
      .on("presence", { event: "sync" }, () => {
        setCount(Math.max(1, Object.keys(channel.presenceState()).length));
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") void channel.track({ t: Date.now() });
      });

    const leave = () => {
      void channel.untrack();
      void supabase.removeChannel(channel);
    };
    window.addEventListener("pagehide", leave);

    return () => {
      window.removeEventListener("pagehide", leave);
      void supabase.removeChannel(channel);
    };
  }, []);

  return count;
}
