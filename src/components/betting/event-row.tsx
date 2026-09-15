import Link from "next/link";
import { LiveBadge, MatchScore } from "./live-badge";
import { ODDS_COL, OneXTwoGrid } from "./odds-button";
import { kickoffTime } from "@/lib/format";
import { extraMarketCount, matchWinnerMarket } from "@/lib/markets";
import { oneXTwoSlots } from "@/lib/odds-tone";
import type { SportEvent } from "@/lib/api/types";

export function EventRow({ event }: { event: SportEvent }) {
  const market = matchWinnerMarket(event);
  const slots = oneXTwoSlots(market?.outcomes ?? [], event.home, event.away);
  const extra = extraMarketCount(event);
  const isLive = event.status === "LIVE";

  return (
    <article className="border-b border-line px-3 py-2.5 last:border-0">
      <p className="mb-1.5 truncate text-[11px] font-medium text-dim">{event.competition}</p>
      <div className="flex items-center gap-3">
        <div className="w-[4.75rem] shrink-0">
          {isLive ? (
            <LiveBadge minute={event.minute} />
          ) : (
            <span className="odds-figure text-[13px] font-bold">{kickoffTime(event.startTime)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/event/${event.id}`} className="block hover:opacity-90">
            <MatchScore event={event} />
          </Link>
          <Link
            href={`/event/${event.id}#more-markets`}
            aria-label={`View ${extra} other markets`}
            className="mt-1 inline-flex items-center text-[12px] font-bold text-accent hover:underline"
          >
            +{extra}
          </Link>
        </div>
        <div className={ODDS_COL}>
          <OneXTwoGrid slots={slots} event={event} market={market} />
        </div>
      </div>
    </article>
  );
}
