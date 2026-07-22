# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P4_AUTH_5_IMPLEMENT_ROLES_GUARD)

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
- **P4_AUTH_4 checkpoint**: `8661f8d` — "feat: add current user endpoint"
- **P4_AUTH_5 checkpoint**: "feat: add role-based authorization guard" (see git log)

### Backend (`fincraft-lab-api`) — Backend Auth MVP Complete

- **Typed `@Roles()` Decorator**: Created in `src/auth/decorators/roles.decorator.ts`. Exports `ROLES_KEY = 'roles'` and accepts typed `UserRole` enum values (`USER`, `ADMIN`, `SUPER_ADMIN`). Arbitrary string roles are rejected by TypeScript compiler.
- **Global `RolesGuard` Implemented & Registered**: Created in `src/auth/guards/roles.guard.ts`. Registered as global `APP_GUARD` in `AuthModule` immediately after `AuthGuard`.
- **Guard Execution Order**: `AuthGuard` executes first (verifying JWT and attaching `request.user`), followed by `RolesGuard` (checking required roles in `request.user.role`).
- **RolesGuard Behavior**:
  - Missing or empty `@Roles()` metadata: Returns `true` (unrestricted access).
  - Missing `request.user` on role-restricted route: Throws `UnauthorizedException('Authentication session is no longer valid')` (HTTP 401).
  - Authenticated user with insufficient role: Throws `ForbiddenException('Insufficient permissions')` (HTTP 403).
  - Authenticated user with allowed role: Returns `true` (HTTP 200).
  - Handler-level metadata overrides controller-level metadata via `Reflector.getAllAndOverride`.
  - Does NOT query the database or re-verify JWT.
- **Isolation Tests Verified**: 12/12 isolation tests passed via temporary untracked script (No roles, Empty roles, USER allowed, USER denied ADMIN -> 403, ADMIN allowed, SUPER_ADMIN allowed, Multiple roles, Missing request.user -> 401, Handler metadata, Controller metadata, Handler override).
- **Live Regression Verification Passed**: `GET /health` -> 200, `POST /auth/register` -> 201, `POST /auth/login` -> 200, `GET /auth/me` without token -> 401, `GET /auth/me` with valid USER token -> 200 (routes without `@Roles` metadata remain accessible to any authenticated user). Test user cleanup verified (0 ending rows).
- **Backend Auth MVP Complete**: Registration, Login, JWT issuing & verification, Global `AuthGuard`, `@Public()`, `GET /auth/me`, `@CurrentUser()`, `@Roles()`, and Global `RolesGuard` are 100% complete and verified. No Admin endpoints created yet.

### Frontend (`fincraft-lab-web`)

- Empty, not yet initialized (out of scope).

## Build/Lint/Test — run status

- `pnpm build` — passed
- `pnpm lint` — 0 errors, 1 pre-existing warning in `main.ts` (`@typescript-eslint/no-floating-promises`)
- `pnpm test` — 3/3 unit tests passed (HealthController status, service name, ISO timestamp)
- `pnpm test:e2e` — 2/2 e2e tests passed (`GET /health` -> 200, `GET /` -> 404) via Node VM modules
- Search for unsafe casts (`any`, `as any`, `as unknown`, `@ts-ignore`) in `src/auth/` — 0 matches
- 12/12 RolesGuard isolation tests — passed
- Live Runtime Regression Verification — passed

## Active Project Rule: No Automatic Unit Spec Generation

Unit spec files are not generated automatically (`--no-spec` for Nest CLI generators, no hand-created unit specs without explicit instruction).

## Next Bounded Step

```text
P5_SEED_1_PLAN_CORE_CONTENT_001 — Plan the core seed infrastructure and Submission Seed v1 content set before implementation.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
