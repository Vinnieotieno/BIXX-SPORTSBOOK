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

  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_auto] items-center", hero ? "gap-x-6 gap-y-2" : "gap-x-3 gap-y-0.5")}>
      <p className={cn("truncate font-semibold", hero ? "text-xl" : "text-[13px]")}>{event.home}</p>
      <p
        className={cn(
          "odds-figure min-w-8 text-right font-black tabular-nums",
          hero ? "text-3xl" : "text-sm",
          live ? "text-accent" : "text-ink",
        )}
      >
        {score ? score.home : ""}
      </p>
      <p className={cn("truncate font-semibold", hero ? "text-xl" : "text-[13px]")}>{event.away}</p>
      <p
        className={cn(
          "odds-figure min-w-8 text-right font-black tabular-nums",
          hero ? "text-3xl" : "text-sm",
          live ? "text-accent" : "text-ink",
        )}
      >
        {score ? score.away : ""}
      </p>
    </div>
  );
}
