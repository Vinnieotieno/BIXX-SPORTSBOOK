import type { Market, SportEvent } from "@/lib/api/types";

const WINNER_NAME = /moneyline|1\s*x\s*2|match result|winner/i;

export function isMatchWinnerMarket(market: Market) {
  return market.typeId === 1 || WINNER_NAME.test(market.name);
}

export function matchWinnerMarket(event: SportEvent): Market | undefined {
  return event.markets.find(isMatchWinnerMarket) ?? event.markets[0];
}

export function extraMarkets(event: SportEvent): Market[] {
  const primary = matchWinnerMarket(event);
  return event.markets.filter((market) => market !== primary);
}

export function extraMarketCount(event: SportEvent) {
  const listed = extraMarkets(event).length;
  if (event.marketCount > event.markets.length) {
    return Math.max(0, event.marketCount - 1);
  }
  return listed;
}

export function displayMarketName(market: Market) {
  if (isMatchWinnerMarket(market)) return "1X2";
  if (market.typeId === 2 || /handicap|spread/i.test(market.name)) return "Handicap";
  if (market.typeId === 3 || /total/i.test(market.name)) return "Over / Under";
  return market.name;
}
