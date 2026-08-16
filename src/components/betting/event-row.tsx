import Link from "next/link";
import { LiveBadge, MatchScore } from "./live-badge";
import { OddsButton } from "./odds-button";
import { kickoff } from "@/lib/format";
import { lineUpOutcomes, shortOddsLabel, toneForOutcome } from "@/lib/odds-tone";
import { toSelection } from "@/lib/selection";
import type { SportEvent } from "@/lib/api/types";

export function EventRow({ event }: { event: SportEvent }) {
  const market = event.markets[0];
  const isLive = event.status === "LIVE";
  const outcomes = market ? lineUpOutcomes(market.outcomes, event.home, event.away) : [];

  return (
    <article className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line px-3 py-2.5 last:border-0 sm:grid-cols-[minmax(0,1fr)_252px]">
      <Link href={`/event/${event.id}`} className="min-w-0 hover:opacity-90">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-dim">
          {isLive ? <LiveBadge minute={event.minute} /> : <span>{kickoff(event.startTime)}</span>}
          <span className="truncate">{event.competition}</span>
        </div>
        <MatchScore event={event} />
      </Link>

      <div className="grid w-[252px] grid-cols-3 gap-1">
        {market
          ? outcomes.map((outcome, index) => {
              const tone = toneForOutcome(outcome.label, index, outcomes.length);
              return (
                <OddsButton
                  key={outcome.id}
                  suspended={outcome.suspended}
                  tone={tone}
                  caption={shortOddsLabel(tone, outcome.label, outcomes.length)}
                  selection={toSelection(event, market, outcome)}
                />
              );
            })
          : null}
      </div>
    </article>
  );
}
