# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P5_SEED_2_IMPLEMENT_INFRASTRUCTURE_AND_CATEGORIES)

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
- **P5_SEED_1 checkpoint**: `66851c0` — "docs: plan core content seed"
- **P5_SEED_2 checkpoint**: "feat: add core seed infrastructure and categories" (see git log)

### Backend (`fincraft-lab-api`) — Seed Infrastructure & Category Slice Complete

- **Seed Infrastructure Implemented**: Small runner `prisma/seed.ts`, standalone Prisma Client `prisma/seed/seed-client.ts` using `@prisma/adapter-pg`, manifest `seed-manifest.ts`, pre-write validator `validate-seed.ts`, post-seed verifier `verify-seed.ts`. Seed command configured in `prisma.config.ts` (`migrations.seed = "tsx prisma/seed.ts"`).
- **Eight Planned Categories Seeded**: 8 Element Categories (`Money Flow`, `Saving & Financial Safety`, `Debt & Credit`, `Cost of Living`, `Financial Behavior`, `Life Events & Risk`, `Planning Tools`, `Digital Financial Safety`) seeded via idempotent upserts matching unique `name`.
- **Rerun Idempotency Verified**: Executed `prisma db seed` twice against PostgreSQL:
  - First run: Seeded 8 Categories (verified 8/8).
  - Second run: Verified exactly 8 Categories total, 0 duplicates, IDs remained stable.
- **In-Memory Pre-Write Validation Verified**: Duplicate category name fixture correctly rejected in memory before initiating database writes.
- **Protected User/Activity Tables Intact**: Counts for `users` (0), `pets` (0), `user_elements` (0), `discovery_events` (0), `workspaces` (0), `workspace_nodes` (0), `workspace_edges` (0), `simulation_runs` (0) remained 0. No user data created.
- **Remaining Content Datasets Unimplemented**: Elements, Discovery Details, Craft Recipes, Recipe Inputs, Relationships, and Simulations are planned in `CORE_CONTENT_SEED_PLAN.md` but not yet seeded.

### Frontend (`fincraft-lab-web`)

- Empty, not yet initialized (out of scope).

## Build/Lint/Test — run status

- `pnpm build` — passed
- `pnpm lint` — 0 errors, 1 pre-existing warning in `main.ts` (`@typescript-eslint/no-floating-promises`)
- `pnpm test` — 3/3 unit tests passed (HealthController status, service name, ISO timestamp)
- `pnpm test:e2e` — 2/2 e2e tests passed (`GET /health` -> 200, `GET /` -> 404) via Node VM modules
- Search for unsafe casts (`any`, `as any`, `as unknown`, `@ts-ignore`) in `prisma/seed/` — 0 matches
- Seed executed twice & verified — passed

## Active Project Rule: No Automatic Unit Spec Generation

Unit spec files are not generated automatically (`--no-spec` for Nest CLI generators, no hand-created unit specs without explicit instruction).

## Next Bounded Step

```text
P5_SEED_3_IMPLEMENT_ELEMENTS_AND_DETAILS_001 — Implement Elements (14 Starter, 22 Discovery) and 36 Discovery Details seed content steps.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Submission Seed v1 Plan → [`plans/CORE_CONTENT_SEED_PLAN.md`](plans/CORE_CONTENT_SEED_PLAN.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
