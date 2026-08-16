import { request } from "./client";
import { toBet, toEvent, toProfile, unwrapList, unwrapOne } from "./mappers";
import type {
  AuthResult,
  BetRequest,
  BetResponse,
  DepositRequest,
  DepositResponse,
  LoginRequest,
  ProfileResponse,
  RegisterRequest,
  SportEvent,
  VerifyRequest,
} from "./types";

export const getEvents = async (): Promise<SportEvent[]> =>
  unwrapList(await request<Record<string, unknown>[] | { data: Record<string, unknown>[] }>("/api/events/all?limit=50")).map(
    toEvent,
  );

export const getEvent = async (eventId: string): Promise<SportEvent> =>
  toEvent(unwrapOne(await request<Record<string, unknown>>(`/api/events/${eventId}`)));

export const getBets = async (): Promise<BetResponse[]> =>
  unwrapList(await request<Record<string, unknown>[] | { data: Record<string, unknown>[] }>("/api/bet/all")).map(toBet);

export const getBet = async (betId: string) =>
  toBet(unwrapOne(await request<Record<string, unknown>>(`/api/bet/${betId}`)));

export const createBet = async (body: BetRequest) =>
  toBet(
    unwrapOne(
      await request<Record<string, unknown>>("/api/bet/create", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    ),
  );

export const login = (body: LoginRequest) =>
  request<AuthResult>("/api/auth/login", { method: "POST", body: JSON.stringify(body) });

export const register = (body: RegisterRequest) =>
  request<AuthResult>("/api/auth/register", { method: "POST", body: JSON.stringify(body) });

export const verifyAccount = (body: VerifyRequest) =>
  request<AuthResult>("/api/auth/verify-account", { method: "POST", body: JSON.stringify(body) });

export const getProfile = async (): Promise<ProfileResponse> =>
  toProfile(await request<Record<string, unknown>>("/api/profile/me"));

export const depositChapa = (body: DepositRequest) =>
  request<DepositResponse>("/api/wallet/deposit-chapa", {
    method: "POST",
    body: JSON.stringify(body),
  });
