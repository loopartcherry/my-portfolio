"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "lang";

export type Lang = "zh" | "en";

function readStoredLang(): Lang {
  if (typeof window === "undefined") return "zh";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "zh" || v === "en") return v;
  } catch {}
  return "zh";
}

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "zh",
  setLang: () => {},
});

export const useLang = () => useContext(LangContext);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLangState(readStoredLang());
    setMounted(true);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  const value = mounted ? { lang, setLang } : { lang: "zh" as Lang, setLang };
  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}
