"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { money, odds } from "@/lib/format";
import { useBets } from "@/hooks/use-account";
import { useIsAuthenticated } from "@/store/auth";

export default function BetsPage() {
  const authenticated = useIsAuthenticated();
  const { data, isLoading } = useBets();

  if (!authenticated) {
    return (
      <p className="rounded-lg border border-line bg-panel px-4 py-8 text-center text-sm text-dim">
        <Link href="/login" className="text-gold">
          Log in
        </Link>{" "}
        to see your bets.
      </p>
    );
  }

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My bets</CardTitle>
      </CardHeader>
      {(data ?? []).map((bet) => (
        <div key={bet.id} className="border-b border-line px-4 py-3 last:border-0">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold">
              {bet.slips?.length ?? 1} pick{(bet.slips?.length ?? 1) > 1 ? "s" : ""}
            </span>
            <span className="text-[11px] uppercase tracking-wide text-dim">{bet.status}</span>
          </div>
          <p className="mt-1 text-[12px] text-dim">
            Stake {money(bet.stake)} at {odds(bet.totalOdds)} returns{" "}
            <span className="text-gold">{money(bet.potentialPayout)}</span>
          </p>
        </div>
      ))}
      {(data ?? []).length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-dim">
          No bets yet.
        </p>
      ) : null}
    </Card>
  );
}
