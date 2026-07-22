# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P4_AUTH_1)

- **Git root**: `C:/devnest 101/single-project/fincraft-lab` (no nested git repositories inside `fincraft-lab-api` or `fincraft-lab-web`)
- **P0 starting checkpoint**: `34117a1` — "P0: scaffold NestJS backend foundation in fincraft-lab-api"
- **Shared agent documentation checkpoint**: `8b2bb9a` / `4b403b1` — AI documentation added and standardized to English
- **P1 checkpoint**: `a17d7f4` — "feat: add backend health endpoint"
- **P2A checkpoint**: `22483f9` — "chore: add Prisma PostgreSQL dependencies"
- **P3A checkpoint**: `9a1939f` — "feat: add FinCraft MVP Prisma foundation"
- **P3B.1 checkpoint**: `809e4b5` — "chore: add initial FinCraft MVP migration"
- **P3B.2 checkpoint**: `a49dff9` — "docs: record initial MVP migration application"
- **P4A checkpoint**: `6193f03` — "docs: plan ElementCategory CRUD"
- **P4_AUTH_1 checkpoint**: "feat: add user registration endpoint" (see git log)

### Backend (`fincraft-lab-api`)

- **POST /auth/register implemented and verified**: `AuthModule`, `AuthController`, `AuthService`, and `RegisterDto` created without `.spec.ts` files (`--no-spec`).
- **Input Validation & Normalization**: `email` is trimmed and lowercased; `displayName` is trimmed (min 1, max 100); `password` min 8, max 72 (untrimmed). Global `ValidationPipe` configured with `transform: true`, `whitelist: true`, `forbidNonWhitelisted: true`. Invalid inputs and unknown properties (e.g., `role: "SUPER_ADMIN"`) yield `400 Bad Request`.
- **Password Hashing**: Passwords hashed asynchronously using `bcrypt` with `BCRYPT_SALT_ROUNDS = 12`. Plaintext passwords and hashes are never logged or exposed.
- **Duplicate Handling**: Race-safe duplicate email check catches Prisma `P2002` unique constraint error and returns `409 Conflict`.
- **Safe Response Envelope**: Returns `201 Created` with payload `{ "data": { id, email, displayName, avatarUrl: null, role: "USER", status: "ACTIVE", createdAt, updatedAt } }`. Does not return `password`, `passwordHash`, or `token`.
- **No JWT Issued**: JWT generation, AuthGuard, and Login remain out of scope for this step.
- **Database Security & Cleanup Verified**: Test user was created, verified for bcrypt matching and normalized email storage, and cleaned up cleanly by exact UUID. Total `users` table row count restored to 0.
- **`GET /health` verified**: Returns `200 OK` with JSON payload `{ status: "ok", service: "fincraft-lab-api", timestamp }`.

### Frontend (`fincraft-lab-web`)

- Empty, not yet initialized (out of scope).

## Build/Lint/Test — run status

- `pnpm build` — passed
- `pnpm lint` — 0 errors, 1 pre-existing warning in `main.ts` (`@typescript-eslint/no-floating-promises`)
- `pnpm test` — 3/3 unit tests passed (HealthController status, service name, ISO timestamp)
- `pnpm test:e2e` — 2/2 e2e tests passed (`GET /health` -> 200, `GET /` -> 404) via Node VM modules
- Live runtime NestJS boot — passed (`GET /health` -> 200, `POST /auth/register` -> 201/409/400 verified)

## Active Project Rule: No Automatic Unit Spec Generation

Unit spec files are not generated automatically (`--no-spec` for Nest CLI generators, no hand-created unit specs without explicit instruction).

## Next Bounded Step

```text
P4_AUTH_2_IMPLEMENT_LOGIN_001 — Implement only POST /auth/login with password verification and access JWT issuance.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
