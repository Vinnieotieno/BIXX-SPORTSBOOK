"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BetSlip } from "@/components/betting/bet-slip";
import { MobileBetSlip } from "@/components/betting/mobile-bet-slip";
import { SportSidebar } from "./sport-sidebar";
import { AuthBackdrop } from "@/components/auth/auth-backdrop";

const AUTH_PATHS = new Set(["/login", "/register", "/verify"]);

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = AUTH_PATHS.has(pathname);

  if (auth) {
    return (
      <div className="relative min-h-0 flex-1">
        <AuthBackdrop />
        <Link
          href="/"
          aria-label="Back home"
          className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-header px-4 py-2 text-[13px] font-semibold text-white shadow-lg hover:bg-header/90"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </Link>
        <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto px-4 py-8">
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[272px_minmax(0,1fr)_300px]">
        <aside className="hidden min-h-0 overflow-y-auto border-r border-line bg-panel lg:block">
          <SportSidebar />
        </aside>
        <main className="min-h-0 min-w-0 overflow-y-auto px-3 pb-24 lg:px-4 lg:pb-3">{children}</main>
        <aside className="hidden min-h-0 overflow-y-auto border-l border-line bg-panel p-3 lg:block">
          <BetSlip />
        </aside>
      </div>
      <MobileBetSlip />
    </>
  );
}
