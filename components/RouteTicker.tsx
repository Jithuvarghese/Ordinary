import { siteConfig } from "@/config/site";

/** LED-style destination board that scrolls the configured route names. */
export default function RouteTicker() {
  if (siteConfig.routes.length === 0) return null;
  const text = siteConfig.routes.join("   •   ").toUpperCase();

  return (
    <div
      role="marquee"
      aria-label={`Route: ${siteConfig.routes.join(", ")}`}
      className="absolute left-4 top-[calc(max(1rem,env(safe-area-inset-top))+2.75rem)] z-10 w-[min(11rem,38vw)] overflow-hidden rounded-[3px] border border-black/60 bg-black/70 px-2 py-0.5 shadow-inner sm:left-7 sm:top-14 sm:w-56"
    >
      <div className="led-scroll whitespace-nowrap font-mono text-[11px] font-bold tracking-[0.18em] text-[#ff4a2e] sm:text-xs" aria-hidden="true">
        <span className="pr-12">{text}</span>
        <span className="pr-12">{text}</span>
      </div>
    </div>
  );
}
