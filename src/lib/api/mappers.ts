import type { BetResponse, EventStatus, Market, Outcome, ProfileResponse, SportEvent } from "./types";

type Raw = Record<string, any>;

const SPORT_NAMES: Record<string, string> = {
  "1": "NFL",
  "2": "NBA",
  "3": "MLB",
  "4": "NHL",
  "5": "College football",
  "6": "College basketball",
  "7": "CFL",
  "8": "WNBA",
  "10": "MLS",
  "11": "MMA",
  "14": "Football",
  "16": "Formula 1",
  "18": "Tennis",
  "19": "Football",
  "26": "Cricket",
  "39": "Tennis",
};

const pick = <T,>(source: Raw | undefined, keys: string[], fallback: T): T => {
  const hit = keys.map((key) => source?.[key]).find((value) => value != null);
  return (hit as T) ?? fallback;
};

const teamName = (value: unknown): string =>
  typeof value === "string" ? value : pick(value as Raw, ["name", "shortName"], "");

const toStatus = (raw: Raw): EventStatus => {
  const value = pick<number | string>(raw, ["eventStatus", "status", "state"], 0);
  if (typeof value === "number") {
    if (value === 1 || value === 8) return "LIVE";
    if (value >= 2) return "SETTLED";
    return "PRE_MATCH";
  }
  const label = String(value).toUpperCase();
  if (label.includes("LIVE") || label.includes("PLAY")) return "LIVE";
  if (label.includes("END") || label.includes("SETTLED") || label.includes("FINAL")) return "SETTLED";
  return "PRE_MATCH";
};

const specialBetValue = (marketTypeId: number, name: string, handicap?: string | null) => {
  if (!handicap) return "";
  const line = String(handicap).replace(/^\+/, "");
  if (marketTypeId === 2) return `hcp=${line}`;
  if (marketTypeId === 3) {
    const side = name.toLowerCase().includes("under") ? "under" : "over";
    return `${side}=${line.replace(/^[+-]/, "")}`;
  }
  return "";
};

const tidy = (value: string) => value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();

const looksLikeFixture = (value: string, home: string, away: string) => {
  const lower = value.toLowerCase();
  const mentionsTeam =
    (home.length > 1 && lower.includes(home.toLowerCase())) ||
    (away.length > 1 && lower.includes(away.toLowerCase()));
  return /\bat\b|\bvs\.?\b/.test(lower) && mentionsTeam;
};

const tournamentFromEventName = (eventName: string, home: string, away: string) => {
  const cleaned = tidy(eventName).replace(/\s*-\s*\d{4}-\d{2}-\d{2}T.*$/, "");
  const head = (cleaned.split(":")[0] ?? cleaned).trim();
  if (!head || looksLikeFixture(head, home, away)) return "";
  const name = (head.split(/\s-\sRound\b/i)[0] ?? head).split(" - ")[0]?.trim() ?? "";
  if (!name || looksLikeFixture(name, home, away)) return "";
  return name;
};

const tournamentFromSeason = (seasonType: string) => {
  const value = tidy(seasonType);
  if (!value || /^regular season$/i.test(value)) return "";
  if (/laliga|la liga/i.test(value)) return "La Liga";
  if (/premier league/i.test(value)) return "Premier League";
  if (/serie a/i.test(value)) return "Serie A";
  if (/bundesliga/i.test(value)) return "Bundesliga";
  if (/ligue 1/i.test(value)) return "Ligue 1";
  if (/^\d{4}/.test(value) && value.length < 14) return "";
  return value;
};

const tournamentFromLeague = (value: string) => {
  const text = tidy(value);
  if (!text || /^\d{4}\s*\/\s*\d{4}/.test(text)) return "";
  return text;
};

const resolveCompetition = (raw: Raw, homeTeam: Raw | undefined, awayTeam: Raw | undefined, home: string, away: string, sportName: string) => {
  const listed = tidy(String(pick(raw, ["tournament", "competition", "league"], "") || ""));
  const parsed = tournamentFromEventName(pick(raw, ["eventName"], ""), home, away);
  const season = tournamentFromSeason(pick(raw, ["seasonType"], ""));
  const league = tournamentFromLeague(
    pick(homeTeam, ["leagueName"], "") || pick(awayTeam, ["leagueName"], ""),
  );
  const main = parsed || listed || season || league || sportName;
  if (parsed && listed && parsed.toLowerCase() !== listed.toLowerCase()) {
    return `${listed}, ${parsed}`;
  }
  return main;
};

const toOutcome = (raw: Raw, marketTypeId: number): Outcome | null => {
  const prices = pick<Raw[]>(raw, ["prices"], []);
  const price = prices[0];
  if (!price) return null;
  const name = pick(raw, ["name", "label"], "");
  const handicap = pick<string | null>(price, ["handicapValue"], null);
  return {
    id: String(pick(price, ["priceId", "id"], pick(raw, ["participantId", "id"], ""))),
    label: handicap ? `${name} ${handicap}` : name,
    price: Number(pick(price, ["odds", "price", "value"], 0)),
    suspended: Boolean(pick(price, ["closedAt"], null)),
    teamId: Number(pick(raw, ["rundownId", "teamId", "participantId"], 0)),
    specialBetValue: specialBetValue(marketTypeId, name, handicap),
  };
};

const toMarket = (raw: Raw): Market => {
  const typeId = Number(pick(raw, ["marketTypeId", "market_id"], 1));
  const participants = pick<Raw[]>(raw, ["participants", "prices", "outcomes", "selections"], []);
  return {
    id: String(pick(raw, ["marketRundownId", "id", "marketId"], typeId)),
    name: pick(raw, ["name", "marketName", "type"], "Market"),
    typeId,
    outcomes: participants.map((item) => toOutcome(item, typeId)).filter((item): item is Outcome => item != null),
  };
};

export function toEvent(raw: Raw): SportEvent {
  const teams = pick<Raw[]>(raw, ["teams", "participants"], []);
  const homeTeam = teams.find((team) => Number(team.isHome) === 1) ?? teams[0];
  const awayTeam = teams.find((team) => Number(team.isAway) === 1) ?? teams[1];
  const markets = pick<Raw[]>(raw, ["markets"], []).map(toMarket);
  const score = pick<Raw | undefined>(raw, ["score"], undefined);
  const sportId = String(pick(raw, ["sportId", "sportKey", "sport"], "other"));
  const sportName = SPORT_NAMES[sportId] ?? pick(raw, ["sportName", "sport"], `Sport ${sportId}`);
  const home = teamName(pick(raw, ["homeTeam", "home"], homeTeam));
  const away = teamName(pick(raw, ["awayTeam", "away"], awayTeam));

  return {
    id: String(pick(raw, ["eventId", "id"], "")),
    sportId,
    sportName,
    competition: resolveCompetition(raw, homeTeam, awayTeam, home, away, sportName),
    home,
    away,
    startTime: pick(raw, ["eventDate", "startTime", "startsAt", "commenceTime"], new Date().toISOString()),
    status: toStatus(raw),
    minute: pick<number | undefined>(score ?? raw, ["gameClock", "minute", "clock"], undefined),
    score: score
      ? {
          home: Number(pick(score, ["scoreHome", "home", "homeScore"], 0)),
          away: Number(pick(score, ["scoreAway", "away", "awayScore"], 0)),
        }
      : undefined,
    marketCount: Number(pick(raw, ["marketCount", "totalMarkets"], markets.length)),
    markets,
  };
}

const BET_STATUS: Record<number, string> = {
  0: "Pending",
  1: "Open",
  2: "Won",
  3: "Lost",
  4: "Void",
};

export function toBet(raw: Raw): BetResponse {
  const slips = pick<Raw[]>(raw, ["slips"], []);
  const status = pick(raw, ["status"], "");
  return {
    id: String(pick(raw, ["betId", "id"], "")),
    stake: Number(pick(raw, ["stake"], 0)),
    totalOdds: Number(pick(raw, ["totalOdds"], 0)),
    potentialPayout: Number(pick(raw, ["possibleWin", "potentialPayout"], 0)),
    status: typeof status === "number" ? (BET_STATUS[status] ?? String(status)) : String(status),
    createdAt: pick(raw, ["createdAt"], ""),
    slips: slips.map((slip) => ({
      eventName: pick(slip, ["eventId", "eventName"], ""),
      marketName: pick(slip, ["marketName"], ""),
      priceName: pick(slip, ["participantName", "priceName"], ""),
      odds: Number(pick(slip, ["odds"], 0)),
    })),
  };
}

export function toProfile(raw: Raw): ProfileResponse {
  return {
    id: String(pick(raw, ["profileId", "id"], "")),
    firstName: pick(raw, ["firstName", "first_name"], undefined),
    lastName: pick(raw, ["lastName", "last_name"], undefined),
    phoneNumber: pick(raw, ["phoneNumber", "phone_number"], undefined),
    email: pick(raw, ["email"], undefined),
    balance: pick(raw, ["balance"], undefined),
    currency: pick(raw, ["currency"], undefined),
  };
}

export const unwrapList = <T,>(payload: T[] | { content?: T[]; data?: T[]; items?: T[] }): T[] =>
  Array.isArray(payload) ? payload : (payload.content ?? payload.data ?? payload.items ?? []);

export const unwrapOne = <T extends object>(payload: T | { data: T }): T =>
  payload && typeof payload === "object" && "data" in payload && !("eventId" in payload)
    ? (payload as { data: T }).data
    : (payload as T);
