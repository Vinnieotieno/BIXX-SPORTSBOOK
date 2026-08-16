"use client";

import { useSyncExternalStore } from "react";
import { clearTokens, getAccessToken } from "@/lib/api/token";

const subscribe = (onChange: () => void) => {
  window.addEventListener("bixx.auth", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("bixx.auth", onChange);
    window.removeEventListener("storage", onChange);
  };
};

export function useIsAuthenticated() {
  return useSyncExternalStore(
    subscribe,
    () => Boolean(getAccessToken()),
    () => false,
  );
}

export const logout = clearTokens;
