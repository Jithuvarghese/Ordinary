import CyclingText from "@/components/CyclingText";
import { siteConfig } from "@/config/site";

export default function Title() {
  return (
    <h1
      aria-label={siteConfig.name}
      className="pointer-events-none absolute inset-x-0 z-10 px-4 text-center"
      style={{ top: "var(--title-top)" }}
    >
      <CyclingText
        ml={siteConfig.nameMl}
        en={siteConfig.name}
        className="title-shadow whitespace-nowrap font-extrabold leading-[1.15] text-cream"
        style={{
          fontSize: "calc(clamp(2.6rem, 6.4vw, 9rem) * var(--title-scale))",
          transform: "translateY(-50%)",
        }}
      />
    </h1>
  );
}
