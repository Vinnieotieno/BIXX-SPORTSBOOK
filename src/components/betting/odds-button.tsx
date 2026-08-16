"use client";

import { cn } from "@/lib/utils";
import { odds as formatOdds } from "@/lib/format";
import { useBetSlip } from "@/store/bet-slip";
import type { OddsTone } from "@/lib/odds-tone";
import type { Selection } from "@/lib/api/types";

const TONE: Record<OddsTone, string> = {
  home: "bg-odds-home text-odds-home-ink hover:brightness-110",
  draw: "bg-odds-draw text-odds-draw-ink hover:brightness-110",
  away: "bg-odds-away text-odds-away-ink hover:brightness-110",
  neutral: "bg-raise text-ink hover:bg-line",
};

type OddsButtonProps = {
  selection: Selection;
  suspended?: boolean;
  tone?: OddsTone;
  caption?: string;
};

export function OddsButton({ selection, suspended, tone = "neutral", caption }: OddsButtonProps) {
  const toggle = useBetSlip((state) => state.toggle);
  const active = useBetSlip((state) =>
    state.selections.some((s) => s.outcomeId === selection.outcomeId),
  );

  return (
    <button
      type="button"
      disabled={suspended}
      onClick={() => toggle(selection)}
      aria-pressed={active}
      title={selection.outcomeLabel}
      className={cn(
        "flex min-h-11 flex-col items-center justify-center rounded-md px-1 py-1 transition",
        active ? "bg-gold text-gold-ink ring-1 ring-gold" : TONE[tone],
        suspended && "cursor-not-allowed opacity-40",
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
        {caption ?? selection.outcomeLabel}
      </span>
      <span className="odds-figure text-[13px] font-extrabold">
        {suspended ? "-" : formatOdds(selection.price)}
      </span>
    </button>
  );
}
