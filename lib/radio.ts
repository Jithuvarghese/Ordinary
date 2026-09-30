import type { Song } from "@/lib/songs";
import { isPlaceholder } from "@/lib/songs";

/** Radio mode needs every song to have a real duration so the schedule is identical for everyone. */
export function isRadioReady(songs: readonly Song[]): boolean {
  return songs.length > 0 && songs.every((s) => s.duration > 0 && !isPlaceholder(s));
}

/** Which song should be on air at `nowMs`, and how far into it. The playlist loops forever. */
export function radioNow(songs: readonly Song[], nowMs: number): { index: number; offset: number } {
  const total = songs.reduce((sum, s) => sum + s.duration, 0);
  let t = (nowMs / 1000) % total;
  for (let index = 0; index < songs.length; index++) {
    if (t < songs[index].duration) return { index, offset: t };
    t -= songs[index].duration;
  }
  return { index: 0, offset: 0 };
}
