# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P4_AUTH_2_TYPESCRIPT_CONFIG_FIX)

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
- **P4_AUTH_2 checkpoint**: "feat: add user login endpoint" (amended with numeric JWT expiration & type-safe startup validation)

### Backend (`fincraft-lab-api`)

- **POST /auth/login implemented and verified**: `LoginDto`, `AuthModule`, `AuthController`, and `AuthService` updated with `@nestjs/jwt`.
- **Numeric JWT Expiration & Startup Validation**: Expiration configured via numeric `JWT_ACCESS_EXPIRES_IN_SECONDS` (default `900`). In `AuthModule`, `expiresInSeconds` is validated as a positive safe integer using `Number.isSafeInteger()`. Rejects invalid configuration at startup with clear exception (`'JWT_ACCESS_EXPIRES_IN_SECONDS must be a positive integer'`). No unsafe casts (`as any`, `as unknown`, `@ts-ignore`) are used anywhere in the codebase.
- **Credential Verification & Generic Response**: `email` is normalized (trim, lowercase); `password` is compared asynchronously using `bcrypt.compare`. Both wrong password and nonexistent email return identical generic `401 Unauthorized` (`'Invalid email or password'`). Non-ACTIVE users yield `401 Unauthorized` (`'Account is not active'`).
- **JWT Access Token Issuance**: Signed asynchronously using `@nestjs/jwt` (`JwtModule.registerAsync`) and `ConfigService` (`JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES_IN_SECONDS`). Token payload contains exactly `{ sub: user.id, email: user.email, role: user.role }`. Does not contain `passwordHash`, `status`, or private data. Verified token lifetime `exp - iat = 900` seconds.
- **Safe Response Envelope**: Returns `200 OK` with payload `{ "data": { "user": { id, email, displayName, avatarUrl: null, role: "USER", status: "ACTIVE", createdAt, updatedAt }, "accessToken": "..." } }`. Does not contain `password` or `passwordHash`.
- **Database Security & Cleanup Verified**: Test user created via `POST /auth/register`, verified via `POST /auth/login` and JWT claim verification, and deleted by exact UUID. Total `users` table row count restored to 0.
- **`GET /health` verified**: Returns `200 OK` with JSON payload `{ status: "ok", service: "fincraft-lab-api", timestamp }`.

### Frontend (`fincraft-lab-web`)

- Empty, not yet initialized (out of scope).

## Build/Lint/Test — run status

- `pnpm build` — passed
- `pnpm lint` — 0 errors, 1 pre-existing warning in `main.ts` (`@typescript-eslint/no-floating-promises`)
- `pnpm test` — 3/3 unit tests passed (HealthController status, service name, ISO timestamp)
- `pnpm test:e2e` — 2/2 e2e tests passed (`GET /health` -> 200, `GET /` -> 404) via Node VM modules
- Search for unsafe casts (`as any`, `as unknown`, `@ts-ignore`) in `src/auth/` — 0 matches
- Live runtime NestJS boot & invalid config rejection — passed

## Active Project Rule: No Automatic Unit Spec Generation

Unit spec files are not generated automatically (`--no-spec` for Nest CLI generators, no hand-created unit specs without explicit instruction).

## Next Bounded Step

```text
P4_AUTH_3_IMPLEMENT_AUTH_GUARD_001 — Implement AuthGuard for JWT access token verification.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
