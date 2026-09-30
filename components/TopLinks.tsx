import { siteConfig } from "@/config/site";

const links = [
  { label: "Spotify", short: "Spotify", href: siteConfig.links.spotify },
  { label: "YT Music", short: "YTM", href: siteConfig.links.ytMusic },
];

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="size-2.5 shrink-0 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" />
    </svg>
  );
}

export default function TopLinks() {
  return (
    <nav aria-label="Listen elsewhere" className="flex items-center gap-3 sm:gap-5">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 rounded-sm text-sm font-medium text-cream/90 transition-colors hover:text-cream sm:text-base"
        >
          <span className="sm:hidden" aria-hidden="true">
            {link.short}
          </span>
          <span className="hidden sm:inline" aria-hidden="true">
            {link.label}
          </span>
          <span className="sr-only">{link.label} (opens in a new tab)</span>
          <ArrowUpRight />
        </a>
      ))}
    </nav>
  );
}
