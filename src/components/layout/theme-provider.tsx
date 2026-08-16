"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "dark" | "light";

const KEY = "bixx.theme";

type ThemeContextValue = { theme: Theme; toggle: () => void };

const ThemeContext = createContext<ThemeContextValue>({ theme: "dark", toggle: () => {} });

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    const next: Theme = stored === "light" ? "light" : "dark";
    setTheme(next);
    apply(next);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggle: () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        window.localStorage.setItem(KEY, next);
        apply(next);
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
