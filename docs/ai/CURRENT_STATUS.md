# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P4_AUTH_3_IMPLEMENT_AUTH_GUARD)

- **Git root**: `C:/devnest 101/single-project/fincraft-lab` (no nested git repositories inside `fincraft-lab-api` or `fincraft-lab-web`)
- **P0 starting checkpoint**: `34117a1` — "P0: scaffold NestJS backend foundation in fincraft-lab-api"
- **Shared agent documentation checkpoint**: `8b2bb9a` / `4b403b1` — AI documentation added and standardized to English
- **P1 checkpoint**: `a17d7f4` — "feat: add backend health endpoint"
- **P2A checkpoint**: `22483f9` — "chore: add Prisma PostgreSQL dependencies"
- **P3A checkpoint**: `9a1939f` — "feat: add FinCraft MVP Prisma foundation"
- **P3B.1 checkpoint**: `809e4b5` — "chore: add initial FinCraft MVP migration"
- **P3B.2 checkpoint**: `a49dff9` — "docs: record initial MVP migration application"
- **P4A checkpoint**: `6193f03` — "docs: plan ElementCategory CRUD"
- **P4_AUTH_1 checkpoint**: `bf46ed2` — "feat: add user registration endpoint"
- **P4_AUTH_2 checkpoint**: `29de3de` — "feat: add user login endpoint"
- **P4_AUTH_3 checkpoint**: "feat: add global JWT auth guard" (see git log)

### Backend (`fincraft-lab-api`)

- **Global AuthGuard Implemented**: `AuthGuard` registered globally as `APP_GUARD` in `AuthModule`. All application routes protected by default unless marked with `@Public()`.
- **Public Routes Configured**: `@Public()` decorator applied to `POST /auth/register`, `POST /auth/login`, and `GET /health`. Reflector `getAllAndOverride` checks handler and controller class metadata.
- **Bearer Extraction & Verification**: Reads `Authorization` header safely (requires `Bearer <token>`). Verifies token asynchronously using `JwtService.verifyAsync`. Throws generic `UnauthorizedException('Invalid or missing authentication token')` for all token failures (missing header, basic scheme, empty token, malformed JWT, wrong signature, expired token).
- **Runtime Payload Validation**: `sub` validated as non-empty string; `email` validated as non-empty string; `role` validated as valid `UserRole` enum (`USER`, `ADMIN`, `SUPER_ADMIN`) using TypeScript type guard. Optional `iat` and `exp` validated as numbers. Validated payload attached to `request.user`. Zero unsafe TypeScript casts (`any`, `as any`, `as unknown`, `@ts-ignore`).
- **Guard Isolation & Live Nest Verification Verified**: All 11 guard isolation tests passed 100%. Live application verified: Register (201), Login (200), Health (200), unmapped route (404), test user cleanup (exact UUID deleted, ending user count restored to 0).
- **Out of Scope**: `GET /auth/me`, `@CurrentUser()` decorator, and `RolesGuard` not implemented in this task. Full HTTP proof of a protected route will occur in the next bounded `GET /auth/me` task.

### Frontend (`fincraft-lab-web`)

- Empty, not yet initialized (out of scope).

## Build/Lint/Test — run status

- `pnpm build` — passed
- `pnpm lint` — 0 errors, 1 pre-existing warning in `main.ts` (`@typescript-eslint/no-floating-promises`)
- `pnpm test` — 3/3 unit tests passed (HealthController status, service name, ISO timestamp)
- `pnpm test:e2e` — 2/2 e2e tests passed (`GET /health` -> 200, `GET /` -> 404) via Node VM modules
- Search for unsafe casts (`any`, `as any`, `as unknown`, `@ts-ignore`) in `src/auth/` — 0 matches
- 11 Guard Isolation unit tests & Live Nest Runtime Verification — passed

## Active Project Rule: No Automatic Unit Spec Generation

Unit spec files are not generated automatically (`--no-spec` for Nest CLI generators, no hand-created unit specs without explicit instruction).

## Next Bounded Step

```text
P4_AUTH_4_IMPLEMENT_ME_001 — Implement only GET /auth/me and a typed CurrentUser decorator.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
