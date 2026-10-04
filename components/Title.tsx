import { Fragment } from "react";
import { siteConfig } from "@/config/site";

export default function Title() {
  const words = siteConfig.nameMl.split(" ");

  return (
    <h1
      aria-label={siteConfig.name}
      className="pointer-events-none absolute inset-x-0 z-10 px-4 text-center"
      style={{ top: "var(--title-top)" }}
    >
      <span
        lang="ml"
        aria-hidden="true"
        className="title-shadow block font-ml font-extrabold leading-[1.15] text-cream"
        style={{
          fontSize: "calc(clamp(2.6rem, 6.4vw, 9rem) * var(--title-scale))",
          transform: "translateY(-50%)",
        }}
      >
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 ? " " : null}
            <span className="inline-block whitespace-nowrap">{word}</span>
          </Fragment>
        ))}
      </span>
    </h1>
  );
}
