export type Outcome = {
  id: string;
  label: string;
  price: number;
  suspended?: boolean;
  teamId: number;
  specialBetValue: string;
};

export type Market = { id: string; name: string; typeId: number; outcomes: Outcome[] };

export type EventStatus = "PRE_MATCH" | "LIVE" | "SETTLED";

export type SportEvent = {
  id: string;
  sportId: string;
  sportName: string;
  competition: string;
  home: string;
  away: string;
  startTime: string;
  status: EventStatus;
  minute?: number;
  score?: { home: number; away: number };
  marketCount: number;
  markets: Market[];
};

export type Selection = {
  eventId: string;
  eventName: string;
  sportId: number;
  teamId: number;
  marketId: string;
  marketTypeId: number;
  marketName: string;
  outcomeId: string;
  outcomeLabel: string;
  price: number;
  specialBetValue: string;
};

export type SlipRequest = {
  event_id: string;
  sport_id: number;
  team_id: number;
  market_id: number;
  market_name: string;
  participant_name: string;
  odds: number;
  special_bet_value: string;
};

export type BetRequest = { stake: number; slips: SlipRequest[]; is_bonus: number };

export type BetResponse = {
  id: string;
  stake: number;
  totalOdds: number;
  potentialPayout: number;
  status: string;
  createdAt: string;
  slips?: { eventName?: string; marketName?: string; priceName?: string; odds: number }[];
};

export type LoginRequest = { phone_number: string; password: string };

export type RegisterRequest = LoginRequest & { email: string; confirm_password: string };

export type VerifyRequest = { phone_number: string; verification_code: string };

export type LoginResponse = { accessToken: string; refreshToken?: string };

export type RegisterResponse = {
  message?: string;
  verificationCode?: string;
  verification_code?: string;
};

export type VerificationResponse = { message?: string };

export type AuthResult = LoginResponse & RegisterResponse & VerificationResponse;

export type ProfileResponse = {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  balance?: number;
  currency?: string;
};

export type DepositRequest = {
  amount: number;
  email: string;
  "first-name": string;
  "last-name": string;
  phone_number: string;
};

export type DepositResponse = { checkoutUrl?: string; trxRef?: string; status?: string };
