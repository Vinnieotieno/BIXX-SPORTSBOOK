import { cn } from "@/lib/utils";
import type { SportEvent } from "@/lib/api/types";

export function LiveBadge({ minute }: { minute?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-1 rounded bg-live px-1.5 py-0.5 text-[10px] font-black tracking-wide text-white">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" />
        LIVE
      </span>
      {minute != null && minute > 0 ? (
        <span className="odds-figure text-[11px] font-bold text-accent">{minute}&apos;</span>
      ) : null}
    </span>
  );
}

export function MatchScore({
  event,
  size = "row",
}: {
  event: SportEvent;
  size?: "row" | "hero";
}) {
  const live = event.status === "LIVE";
  const raw = event.score;
  const score = live
    ? (raw ?? { home: 0, away: 0 })
    : raw && (raw.home !== 0 || raw.away !== 0)
      ? raw
      : null;
  const hero = size === "hero";

  if (hero) {
    return (
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1">
        <p className="truncate text-[22px] font-semibold tracking-tight sm:text-[26px]">{event.home}</p>
        <p
          className={cn(
            "odds-figure min-w-8 text-right font-semibold tabular-nums",
            live ? "text-2xl text-accent" : "text-2xl text-ink",
          )}
        >
          {score ? score.home : ""}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-dim">vs</p>
        <span />
        <p className="truncate text-[22px] font-semibold tracking-tight sm:text-[26px]">{event.away}</p>
        <p
          className={cn(
            "odds-figure min-w-8 text-right font-semibold tabular-nums",
            live ? "text-2xl text-accent" : "text-2xl text-ink",
          )}
        >
          {score ? score.away : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5">
      <p className="truncate text-[13px] font-semibold">{event.home}</p>
      <p className={cn("odds-figure min-w-8 text-right text-sm font-black tabular-nums", live ? "text-accent" : "text-ink")}>
        {score ? score.home : ""}
      </p>
      <p className="truncate text-[13px] font-semibold">{event.away}</p>
      <p className={cn("odds-figure min-w-8 text-right text-sm font-black tabular-nums", live ? "text-accent" : "text-ink")}>
        {score ? score.away : ""}
      </p>
    </div>
  );
}
