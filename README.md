# Bixx Sportsbook

Next.js 15 App Router front end for the Bixx gateway, in TypeScript with
Tailwind v4 and shadcn-style primitives.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

`NEXT_PUBLIC_API_BASE_URL` defaults to `https://api.bixx.co.ke`. Paths are
appended as `/api/...`, so the value must not include a trailing slash.

## Gateway routes in use

| Route | Where it is called |
| --- | --- |
| `GET /api/events/all` | lobby, sport pages, sidebar counts |
| `GET /api/events/{eventId}` | event detail markets |
| `POST /api/bet/create` | bet slip submit |
| `GET /api/bet/all` | my bets |
| `POST /api/auth/login` `register` `verify-account` | auth pages |
| `POST /api/auth/refresh` | automatic, on any 401 |
| `GET /api/profile/me` | header balance, wallet |
| `POST /api/wallet/deposit-chapa` | wallet deposit |

All of them live in `src/lib/api/endpoints.ts`.

## Field mapping

I could not read the expanded schema bodies, so `src/lib/api/mappers.ts`
normalises `EventResponse`, `MarketResponse`, `PriceResponse` and
`ScoreResponse` into the view model using a `pick` helper that accepts several
likely key names per field. Once you confirm the real property names, replace
the alias arrays with the single correct key. Nothing outside that file needs
to change.

`BetRequest` is sent as `{ stake, slips: [{ eventId, marketId, priceId, odds }] }`.
Correct the shape in `src/lib/api/types.ts` if the gateway differs.

## Auth

Tokens are held in `localStorage` by `src/lib/api/token.ts`. Every request
attaches the bearer token; a 401 triggers one refresh attempt against
`/api/auth/refresh` and replays the original request, then clears the session
if the refresh also fails.

## Structure

- `src/app` lobby, sport, event, login, register, verify, bets, wallet
- `src/components/betting` odds buttons, event rows, bet slip
- `src/components/layout` header, sidebar, shell, query provider
- `src/store/bet-slip.ts` selections, one per market
- `src/hooks` React Query wrappers with live polling
