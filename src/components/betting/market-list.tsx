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
      <CardHeader className="px-4">
        <CardTitle>{displayMarketName(market)}</CardTitle>
      </CardHeader>
      <div className={cn("grid gap-2 p-4", columns)}>
        {outcomes.map((outcome) => (
          <OddsButton
            key={outcome.id}
            size="lg"
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
    <div className="space-y-3">
      {primary ? (
        <Card>
          <CardHeader className="px-4">
            <div>
              <CardTitle>1X2</CardTitle>
              <p className="mt-0.5 text-[12px] text-dim">Pick the match winner. Draw is locked when a winner is required.</p>
            </div>
          </CardHeader>
          <div className="p-4">
            <OneXTwoGrid slots={slots} event={event} market={primary} size="lg" />
          </div>
        </Card>
      ) : null}

      {others.length > 0 ? (
        <div id="more-markets" className="scroll-mt-24 space-y-3">
          <div className="flex items-end justify-between px-1">
            <h2 className="text-[18px] font-semibold tracking-tight">More markets</h2>
            <p className="text-[12px] text-dim">{others.length} available</p>
          </div>
          {others.map((market) => (
            <OtherMarket key={market.id} event={event} market={market} />
          ))}
        </div>
      ) : (
        <div id="more-markets" className="scroll-mt-24" />
      )}
    </div>
  );
}
