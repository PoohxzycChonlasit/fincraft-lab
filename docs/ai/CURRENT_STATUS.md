# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P4_AUTH_4_IMPLEMENT_ME)

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
- **P4_AUTH_3 checkpoint**: `5c01639` — "feat: add global JWT auth guard"
- **P4_AUTH_4 checkpoint**: "feat: add current user endpoint" (see git log)

### Backend (`fincraft-lab-api`)

- **GET /auth/me Implemented & Protected**: `GET /auth/me` implemented in `AuthController` and protected by the global `AuthGuard`. Reads validated token payload via custom `@CurrentUser()` parameter decorator.
- **Typed `@CurrentUser()` Decorator**: Created via Nest `createParamDecorator` in `src/auth/decorators/current-user.decorator.ts`. Reads `request.user` and returns typed `AccessTokenPayload`. Throws `UnauthorizedException('Authentication session is no longer valid')` if `request.user` is missing. Zero unsafe casts (`any`, `as any`, `as unknown`, `@ts-ignore`).
- **Database User & Status Re-verification**: `AuthService.getCurrentUser(userId)` queries the user from PostgreSQL by `id` using Prisma `select`. Re-verifies that `user.status === UserStatus.ACTIVE`. Returns generic `UnauthorizedException('Authentication session is no longer valid')` for missing, deleted, inactive, or banned users without disclosing user status.
- **Safe Response Envelope**: `GET /auth/me` returns `200 OK` with payload `{ "data": { id, email, displayName, avatarUrl, role, status, createdAt, updatedAt } }`. Excludes `passwordHash` at query time via Prisma `select`. Does not issue a new access token.
- **Live Runtime & Stale Token Verification Passed**: Live tests verified: `GET /auth/me` without token -> 401; Basic scheme -> 401; malformed token -> 401; wrong signature -> 401; valid token -> 200 (valid payload returned); public endpoints (`/health` -> 200, `/auth/register` -> 201, `/auth/login` -> 200) remain intact; deleted user with old valid token -> 401 (`'Authentication session is no longer valid'`). Test user cleanup verified (0 ending rows).
- **Out of Scope**: `@Roles()` decorator and `RolesGuard` not implemented in this task.

### Frontend (`fincraft-lab-web`)

- Empty, not yet initialized (out of scope).

## Build/Lint/Test — run status

- `pnpm build` — passed
- `pnpm lint` — 0 errors, 1 pre-existing warning in `main.ts` (`@typescript-eslint/no-floating-promises`)
- `pnpm test` — 3/3 unit tests passed (HealthController status, service name, ISO timestamp)
- `pnpm test:e2e` — 2/2 e2e tests passed (`GET /health` -> 200, `GET /` -> 404) via Node VM modules
- Search for unsafe casts (`any`, `as any`, `as unknown`, `@ts-ignore`) in `src/auth/` — 0 matches
- Live Runtime & Stale Token Re-verification — passed

## Active Project Rule: No Automatic Unit Spec Generation

Unit spec files are not generated automatically (`--no-spec` for Nest CLI generators, no hand-created unit specs without explicit instruction).

## Next Bounded Step

```text
P4_AUTH_5_IMPLEMENT_ROLES_GUARD_001 — Implement only @Roles() decorator and a global RolesGuard.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
