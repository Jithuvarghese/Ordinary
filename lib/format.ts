const clockFormatters = new Map<string, Intl.DateTimeFormat>();

/** "10:42 pm" style clock in the given time zone. */
export function formatClock(date: Date, timeZone: string): string {
  let formatter = clockFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    });
    clockFormatters.set(timeZone, formatter);
  }
  return formatter.format(date).replace(/ |\s/g, " ").toLowerCase();
}

/** Seconds to "m:ss" (or "h:mm:ss" for long tracks). */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const s = Math.floor(totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = String(s % 60).padStart(2, "0");
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}
