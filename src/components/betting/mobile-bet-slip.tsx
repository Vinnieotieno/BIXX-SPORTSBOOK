"use client";

import { useEffect, useState } from "react";
import { BetSlip } from "./bet-slip";
import { money } from "@/lib/format";
import { totalOdds, useBetSlip } from "@/store/bet-slip";

export function MobileBetSlip() {
  const selections = useBetSlip((state) => state.selections);
  const stake = useBetSlip((state) => state.stake);
  const [open, setOpen] = useState(false);
  const count = selections.length;
  const payout = totalOdds(selections) * stake;

  useEffect(() => {
    if (count === 0) setOpen(false);
  }, [count]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-header px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-left text-white"
      >
        <span>
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-white/70">
            Bet slip
          </span>
          <span className="text-sm font-bold">
            {count === 0 ? "Tap odds to add a pick" : `${count} pick${count === 1 ? "" : "s"}`}
          </span>
        </span>
        <span className="flex items-center gap-3">
          {count > 0 ? (
            <span className="text-right">
              <span className="block text-[11px] text-white/70">To return</span>
              <span className="odds-figure text-sm font-black text-gold">{money(payout)}</span>
            </span>
          ) : null}
          <span className="rounded-full bg-gold px-3 py-1.5 text-[12px] font-bold text-gold-ink">
            {count > 0 ? "View slip" : "Open"}
          </span>
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            aria-label="Close bet slip"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-panel pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="mx-auto h-1 w-10 rounded-full bg-line" />
            </div>
            <div className="flex items-center justify-between px-4 py-2">
              <p className="text-sm font-bold">Bet slip</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[13px] font-semibold text-dim"
              >
                Close
              </button>
            </div>
            <BetSlip />
          </div>
        </div>
      ) : null}
    </div>
  );
}
