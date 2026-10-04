"use client";

import type { CSSProperties } from "react";
import { useLanguageCycle } from "@/hooks/useLanguageCycle";

type Props = {
  ml: string;
  en: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Shows the Malayalam text, then crossfades to English and back. Both texts share one
 * grid cell so the box keeps the size of the larger one. Decorative: give the parent
 * its own accessible name.
 */
export default function CyclingText({ ml, en, className = "", style }: Props) {
  const lang = useLanguageCycle();
  const fade = "col-start-1 row-start-1 transition-opacity duration-1000 motion-reduce:transition-none";

  return (
    <span aria-hidden="true" className={`grid ${className}`} style={style}>
      <span lang="ml" className={`${fade} font-ml ${lang === "ml" ? "opacity-100" : "opacity-0"}`}>
        {ml}
      </span>
      <span lang="en" className={`${fade} font-sans ${lang === "en" ? "opacity-100" : "opacity-0"}`}>
        {en}
      </span>
    </span>
  );
}
