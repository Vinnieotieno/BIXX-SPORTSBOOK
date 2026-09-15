"use client";

import { cn } from "@/lib/utils";
import { odds as formatOdds } from "@/lib/format";
import { toSelection } from "@/lib/selection";
import { useBetSlip } from "@/store/bet-slip";
import type { OddsSlot, OddsTone } from "@/lib/odds-tone";
import type { Market, Selection, SportEvent } from "@/lib/api/types";

const TONE: Record<OddsTone, string> = {
  home: "bg-odds-home text-odds-home-ink hover:brightness-110",
  draw: "bg-odds-draw text-odds-draw-ink hover:brightness-110",
  away: "bg-odds-away text-odds-away-ink hover:brightness-110",
  neutral: "bg-raise text-ink hover:bg-line",
};

type OddsButtonProps = {
  selection?: Selection | null;
  suspended?: boolean;
  tone?: OddsTone;
  caption?: string;
  size?: "md" | "lg";
};

export function OddsButton({
  selection,
  suspended,
  tone = "neutral",
  caption,
  size = "md",
}: OddsButtonProps) {
  const toggle = useBetSlip((state) => state.toggle);
  const active = useBetSlip((state) =>
    selection ? state.selections.some((item) => item.outcomeId === selection.outcomeId) : false,
  );
  const tall = size === "lg";

  if (!selection) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl bg-raise/70 text-dim",
          tall ? "min-h-[4.25rem] px-2 py-2" : "min-h-11",
        )}
        aria-label={`${caption ?? "X"} not available`}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider">{caption ?? "X"}</span>
        <span className={cn("odds-figure font-extrabold", tall ? "text-[15px]" : "text-[13px]")}>-</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={suspended}
      onClick={() => toggle(selection)}
      aria-pressed={active}
      title={selection.outcomeLabel}
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-xl px-1 py-1 transition",
        tall ? "min-h-[4.25rem]" : "min-h-11",
        active ? "bg-gold text-gold-ink ring-1 ring-gold" : TONE[tone],
        suspended && "cursor-not-allowed opacity-40",
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
        {caption ?? selection.outcomeLabel}
      </span>
      <span className={cn("odds-figure font-extrabold", tall ? "text-[16px]" : "text-[13px]")}>
        {suspended ? "-" : formatOdds(selection.price)}
      </span>
    </button>
  );
}

export function OddsSlotButton({
  slot,
  event,
  market,
  size = "md",
}: {
  slot: OddsSlot;
  event: SportEvent;
  market?: Market;
  size?: "md" | "lg";
}) {
  const selection = slot.outcome && market ? toSelection(event, market, slot.outcome) : null;
  return (
    <OddsButton
      selection={selection}
      suspended={slot.outcome?.suspended}
      tone={slot.tone}
      caption={slot.caption}
      size={size}
    />
  );
}

export function OneXTwoGrid({
  slots,
  event,
  market,
  size = "md",
}: {
  slots: OddsSlot[];
  event: SportEvent;
  market?: Market;
  size?: "md" | "lg";
}) {
  return (
    <div className={cn("grid w-full grid-cols-3", size === "lg" ? "gap-2" : "gap-1")}>
      {slots.map((slot) => (
        <OddsSlotButton
          key={slot.outcome?.id ?? slot.caption}
          slot={slot}
          event={event}
          market={market}
          size={size}
        />
      ))}
    </div>
  );
}

export const ODDS_COL = "w-[10.5rem] shrink-0 sm:w-[13.5rem]";
