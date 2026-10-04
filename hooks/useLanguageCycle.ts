"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

export type Lang = "ml" | "en";

/** Alternates between Malayalam and English on a fixed interval, starting with Malayalam. */
export function useLanguageCycle(): Lang {
  const [lang, setLang] = useState<Lang>("ml");

  useEffect(() => {
    const id = window.setInterval(() => setLang((l) => (l === "ml" ? "en" : "ml")), siteConfig.languageSwapMs);
    return () => window.clearInterval(id);
  }, []);

  return lang;
}
