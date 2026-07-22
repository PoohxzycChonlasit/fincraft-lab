# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P5_SEED_1_PLAN_CORE_CONTENT_001)

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
- **P4_AUTH_5 checkpoint**: `cd910c6` — "feat: add role-based authorization guard"
- **P5_PREP checkpoint**: `8451344` — "docs: align AI agents with teacher coding style"
- **P5_SEED_1 checkpoint**: "docs: plan core content seed" (see git log)

### Backend (`fincraft-lab-api`) — Backend Auth MVP Complete & Seed Planned

- **Auth MVP Complete**: Registration, Login, JWT access tokens, global `AuthGuard`, `@Public()`, `GET /auth/me`, `@CurrentUser()`, `@Roles()`, and global `RolesGuard` are 100% complete and verified.
- **Submission Seed v1 Planned**: `docs/ai/plans/CORE_CONTENT_SEED_PLAN.md` created. Defines 8 Categories, 36 Elements (14 Starter, 22 Discovery), 36 Discovery Details, 48 Craft Recipes, 96 Recipe Inputs, 24 Element Relationships, and 2 Simulations.
- **No Application Code or DB Writes**: No source code, Prisma schema, migrations, or database rows were modified in this plan step.

### Frontend (`fincraft-lab-web`)

- Empty, not yet initialized (out of scope).

## Build/Lint/Test — run status

- `pnpm build` — passed
- `pnpm lint` — 0 errors, 1 pre-existing warning in `main.ts` (`@typescript-eslint/no-floating-promises`)
- `pnpm test` — 3/3 unit tests passed (HealthController status, service name, ISO timestamp)
- `pnpm test:e2e` — 2/2 e2e tests passed (`GET /health` -> 200, `GET /` -> 404) via Node VM modules
- Search for unsafe casts (`any`, `as any`, `as unknown`, `@ts-ignore`) in `src/auth/` — 0 matches

## Active Project Rule: No Automatic Unit Spec Generation

Unit spec files are not generated automatically (`--no-spec` for Nest CLI generators, no hand-created unit specs without explicit instruction).

## Next Bounded Step

```text
P5_SEED_2_IMPLEMENT_INFRASTRUCTURE_001 — Implement only the Seed runner, manifest, utility types, and pre-write validation framework without adding the full content dataset yet.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Submission Seed v1 Plan → [`plans/CORE_CONTENT_SEED_PLAN.md`](plans/CORE_CONTENT_SEED_PLAN.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
