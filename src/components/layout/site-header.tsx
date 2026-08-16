"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { money } from "@/lib/format";
import { useProfile } from "@/hooks/use-account";
import { logout, useIsAuthenticated } from "@/store/auth";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const params = useSearchParams();
  const inPlay = params.get("view") === "in-play";
  const authenticated = useIsAuthenticated();
  const { data: profile } = useProfile();

  const items = [
    { href: "/", label: "All Sports", active: pathname === "/" && !inPlay },
    { href: "/?view=in-play", label: "In-Play", active: pathname === "/" && inPlay },
    { href: "/bets", label: "My Bets", active: pathname.startsWith("/bets") },
  ];

  return (
    <header className="z-30 shrink-0 bg-header text-white">
      <div className="flex h-14 items-center gap-6 px-4">
        <Link href="/" className="flex items-baseline gap-0.5">
          <span className="text-[22px] font-black tracking-tight text-gold">bixx</span>
        </Link>

        <nav className="hidden h-full items-center md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-full items-center px-4 text-[13px] font-semibold text-white/85 hover:text-white",
                item.active && "text-white",
              )}
            >
              {item.label}
              {item.active ? (
                <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-accent" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {authenticated ? (
            <>
              <span className="odds-figure hidden text-[13px] font-bold text-gold sm:inline">
                {money(profile?.balance ?? 0)}
              </span>
              <Link
                href="/wallet"
                className="rounded-full bg-gold px-4 py-1.5 text-[13px] font-bold text-gold-ink"
              >
                Deposit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-white/15 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-white/25"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-full border border-gold px-4 py-1.5 text-[13px] font-bold text-gold hover:bg-gold hover:text-gold-ink"
              >
                Join
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-white/15 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-white/25"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
