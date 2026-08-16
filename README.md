
## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```


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



## Structure

- `src/app` lobby, sport, event, login, register, verify, bets, wallet
- `src/components/betting` odds buttons, event rows, bet slip
- `src/components/layout` header, sidebar, shell, query provider
- `src/store/bet-slip.ts` selections, one per market
- `src/hooks` React Query wrappers with live polling
