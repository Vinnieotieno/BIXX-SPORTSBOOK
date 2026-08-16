import type { Market, Outcome, Selection, SportEvent } from "@/lib/api/types";

export function toSelection(event: SportEvent, market: Market, outcome: Outcome): Selection {
  return {
    eventId: event.id,
    eventName: `${event.home} vs ${event.away}`,
    sportId: Number(event.sportId),
    teamId: outcome.teamId,
    marketId: market.id,
    marketTypeId: market.typeId,
    marketName: market.name,
    outcomeId: outcome.id,
    outcomeLabel: outcome.label,
    price: outcome.price,
    specialBetValue: outcome.specialBetValue,
  };
}
