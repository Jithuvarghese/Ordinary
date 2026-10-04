import { siteConfig } from "@/config/site";

export default function Credit() {
  return (
    <p className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.35rem)] z-20 text-center text-[10px] leading-none tracking-wide text-cream/60 [text-shadow:0_1px_6px_rgb(20_6_4/0.7)] sm:text-[11px]">
      {siteConfig.credit.label}{" "}
      <a
        href={siteConfig.credit.url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm font-medium text-cream/80 underline decoration-cream/30 underline-offset-2 transition hover:text-cream hover:decoration-cream/70"
      >
        {siteConfig.credit.name}
      </a>
    </p>
  );
}
