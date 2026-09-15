import { OddsButton, OneXTwoGrid } from "./odds-button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { displayMarketName, extraMarkets, matchWinnerMarket } from "@/lib/markets";
import { lineUpOutcomes, oneXTwoSlots } from "@/lib/odds-tone";
import { toSelection } from "@/lib/selection";
import { cn } from "@/lib/utils";
import type { Market, SportEvent } from "@/lib/api/types";

function OtherMarket({ event, market }: { event: SportEvent; market: Market }) {
  const outcomes = lineUpOutcomes(market.outcomes, event.home, event.away);
  const columns = outcomes.length <= 1 ? "grid-cols-1" : outcomes.length === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="normal-case tracking-normal">{displayMarketName(market)}</CardTitle>
      </CardHeader>
      <div className={cn("grid gap-1.5 p-3", columns)}>
        {outcomes.map((outcome) => (
          <OddsButton
            key={outcome.id}
            suspended={outcome.suspended}
            tone="neutral"
            caption={outcome.label}
            selection={toSelection(event, market, outcome)}
          />
        ))}
      </div>
    </Card>
  );
}

export function MarketList({ event }: { event: SportEvent }) {
  const primary = matchWinnerMarket(event);
  const others = extraMarkets(event);
  const slots = oneXTwoSlots(primary?.outcomes ?? [], event.home, event.away);

  return (
    <div className="space-y-2">
      {primary ? (
        <Card>
          <CardHeader>
            <CardTitle className="normal-case tracking-normal">1X2</CardTitle>
          </CardHeader>
          <div className="p-3">
            <OneXTwoGrid slots={slots} event={event} market={primary} />
          </div>
        </Card>
      ) : null}

      <div id="more-markets" className="scroll-mt-24 space-y-2">
        {others.length === 0 ? (
          <p className="rounded-xl bg-panel px-4 py-6 text-center text-sm text-dim">
            No other markets for this match.
          </p>
        ) : (
          others.map((market) => <OtherMarket key={market.id} event={event} market={market} />)
        )}
      </div>
    </div>
  );
}
