"use client";

import Link from "next/link";
import { BetSlipItem } from "./bet-slip-item";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { money, odds } from "@/lib/format";
import { useBetSlip } from "@/store/bet-slip";
import { usePlaceBet } from "@/hooks/use-place-bet";

export function BetSlip() {
  const { selections, stake, setStake, clear } = useBetSlip();
  const bet = usePlaceBet();

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Bet slip ({selections.length})</CardTitle>
        {selections.length > 0 ? (
          <button type="button" onClick={clear} className="text-[11px] text-dim hover:text-ink">
            Clear all
          </button>
        ) : null}
      </CardHeader>

      {selections.length === 0 ? (
        <p className="px-4 py-10 text-center text-[13px] text-dim">
          Tap any odds to start building a bet.
        </p>
      ) : (
        <>
          <ul>
            {selections.map((selection) => (
              <BetSlipItem key={selection.outcomeId} selection={selection} />
            ))}
          </ul>

          <div className="space-y-3 border-t border-line bg-panel-2 p-3">
            <Input
              type="number"
              min={20}
              inputMode="decimal"
              value={stake}
              onChange={(event) => setStake(Number(event.target.value))}
              aria-label="Stake amount in Kenyan shillings"
            />
            <dl className="space-y-1 text-[12px]">
              <div className="flex justify-between text-dim">
                <dt>Total odds</dt>
                <dd className="odds-figure text-ink">{odds(bet.odds)}</dd>
              </div>
              <div className="flex justify-between text-dim">
                <dt>Potential payout</dt>
                <dd className="odds-figure font-bold text-gold">{money(bet.payout)}</dd>
              </div>
            </dl>
            {bet.authenticated ? (
              <Button className="w-full" disabled={!bet.canSubmit} onClick={() => bet.mutate()}>
                {bet.isPending ? "Placing bet" : "Place bet"}
              </Button>
            ) : (
              <Button className="w-full" asChild>
                <Link href="/login">Log in to place bet</Link>
              </Button>
            )}
            {bet.isError ? (
              <p className="text-[11px] text-live">
                {bet.error instanceof Error ? bet.error.message : "Bet failed. Check your balance."}
              </p>
            ) : null}
          </div>
        </>
      )}
    </Card>
  );
}
