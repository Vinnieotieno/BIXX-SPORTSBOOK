import { OddsButton } from "./odds-button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { lineUpOutcomes, shortOddsLabel, toneForOutcome } from "@/lib/odds-tone";
import { toSelection } from "@/lib/selection";
import type { SportEvent } from "@/lib/api/types";

export function MarketList({ event }: { event: SportEvent }) {
  return (
    <div className="space-y-3">
      {event.markets.map((market) => {
        const outcomes = lineUpOutcomes(market.outcomes, event.home, event.away);
        return (
          <Card key={market.id}>
            <CardHeader>
              <CardTitle>{market.name}</CardTitle>
            </CardHeader>
            <div className="grid gap-1.5 p-3 sm:grid-cols-3">
              {outcomes.map((outcome, index) => {
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
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
