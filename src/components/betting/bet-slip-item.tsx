"use client";

import { odds } from "@/lib/format";
import { useBetSlip } from "@/store/bet-slip";
import type { Selection } from "@/lib/api/types";

export function BetSlipItem({ selection }: { selection: Selection }) {
  const remove = useBetSlip((state) => state.remove);

  return (
    <li className="border-b border-line px-3 py-2.5 last:border-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold">{selection.outcomeLabel}</p>
        <div className="flex items-center gap-2">
          <span className="odds-figure text-[13px] font-bold text-gold">
            {odds(selection.price)}
          </span>
          <button
            type="button"
            onClick={() => remove(selection.outcomeId)}
            aria-label={`Remove ${selection.outcomeLabel}`}
            className="h-5 w-5 rounded text-dim hover:bg-raise hover:text-ink"
          >
            x
          </button>
        </div>
      </div>
      <p className="truncate text-[11px] text-dim">{selection.marketName}</p>
      <p className="truncate text-[11px] text-dim">{selection.eventName}</p>
    </li>
  );
}
