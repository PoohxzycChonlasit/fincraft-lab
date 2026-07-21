# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P3B.2)

- **Git root**: `C:/devnest 101/single-project/fincraft-lab` (no nested git repositories inside `fincraft-lab-api` or `fincraft-lab-web`)
- **P0 starting checkpoint**: `34117a1` — "P0: scaffold NestJS backend foundation in fincraft-lab-api"
- **Shared agent documentation checkpoint**: `8b2bb9a` / `4b403b1` — AI documentation added and standardized to English
- **P1 checkpoint**: `a17d7f4` — "feat: add backend health endpoint"
- **P2A checkpoint**: `22483f9` — "chore: add Prisma PostgreSQL dependencies"
- **P3A checkpoint**: `9a1939f` — "feat: add FinCraft MVP Prisma foundation"
- **P3B.1 checkpoint**: `809e4b5` — "chore: add initial FinCraft MVP migration"
- **P3B.2 checkpoint**: "docs: record initial MVP migration application" (see git log)

### Backend (`fincraft-lab-api`)

- **Prisma canonical schema**: `prisma/schema.prisma` contains exactly the approved **15 MVP models** and **12 enums**.
- **Initial Migration applied locally**: Migration `prisma/migrations/20260721123912_init_mvp_schema` applied to local PostgreSQL database `fincraft_lab` via `prisma migrate deploy`.
- **Database tables verified**: Exactly 15 application tables exist in PostgreSQL (`users`, `pets`, `element_categories`, `elements`, `discovery_details`, `element_relationships`, `craft_recipes`, `craft_recipe_inputs`, `user_elements`, `discovery_events`, `workspaces`, `workspace_nodes`, `workspace_edges`, `simulations`, `simulation_runs`). All 15 application tables have 0 rows (empty tables).
- **Prisma System table verified**: `_prisma_migrations` table exists with exactly 1 successful migration row (`finished_at IS NOT NULL`). 0 pending migrations.
- **PostgreSQL Enum types verified**: Exactly 12 enum types exist in the `public` schema.
- **No application CRUD exists yet**: Application controllers, services, DTOs, and business logic have not been implemented yet.
- **Prisma Client canonical path**: Generated at `fincraft-lab-api/src/database/generated/prisma` and git-ignored (`.gitignore` line 44). `PrismaService` imports from `./generated/prisma/client`.
- **Database connection & SELECT 1 verified**: `PrismaService` extends `PrismaClient` with `@prisma/adapter-pg`, connects to local `fincraft_lab` database, and executes `SELECT 1` during module initialization.
- **`GET /health` verified**: Returns `200 OK` with JSON payload `{ status: "ok", service: "fincraft-lab-api", timestamp }`.

### Frontend (`fincraft-lab-web`)

- Empty, not yet initialized (out of scope).

## Build/Lint/Test — run status

- `pnpm build` — passed
- `pnpm lint` — 0 errors, 1 pre-existing warning in `main.ts` (`@typescript-eslint/no-floating-promises`)
- `pnpm test` — 3/3 unit tests passed (HealthController status, service name, ISO timestamp)
- `pnpm test:e2e` — 2/2 e2e tests passed (`GET /health` -> 200, `GET /` -> 404) via Node VM modules
- Live runtime NestJS boot — passed (`GET /health` -> 200)

## Active Project Rule: No Automatic Unit Spec Generation

Unit spec files are not generated automatically (`--no-spec` for Nest CLI generators, no hand-created unit specs without explicit instruction).

## Next Bounded Step

```text
P4A — Plan ElementCategory CRUD without implementing code.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
