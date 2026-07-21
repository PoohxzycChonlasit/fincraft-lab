# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P3A)

- **Git root**: `C:/devnest 101/single-project/fincraft-lab` (no nested git repositories inside `fincraft-lab-api` or `fincraft-lab-web`)
- **P0 starting checkpoint**: `34117a1` — "P0: scaffold NestJS backend foundation in fincraft-lab-api"
- **Shared agent documentation checkpoint**: `8b2bb9a` / `4b403b1` — AI documentation added and standardized to English
- **P1 checkpoint**: `a17d7f4` — "feat: add backend health endpoint"
- **P2A checkpoint**: `22483f9` — "chore: add Prisma PostgreSQL dependencies"
- **P3A checkpoint**: "feat: add FinCraft MVP Prisma foundation" (see git log)

### Backend (`fincraft-lab-api`)

- **Prisma canonical schema**: `prisma/schema.prisma` contains exactly the approved **15 MVP models** (User, Pet, ElementCategory, Element, DiscoveryDetail, ElementRelationship, CraftRecipe, CraftRecipeInput, UserElement, DiscoveryEvent, Workspace, WorkspaceNode, WorkspaceEdge, Simulation, SimulationRun) and **12 enums** (UserRole, UserStatus, PetSpecies, ActiveStatus, ElementType, ContentStatus, RealityLevel, SafetyLabel, RelationshipStrength, CraftRuleType, DiscoveryResultStatus, WorkspaceStatus).
- **Prisma Client canonical path**: Generated at `fincraft-lab-api/src/database/generated/prisma` and git-ignored (`.gitignore` line 44). `PrismaService` imports from `./generated/prisma/client`.
- **PostgreSQL Database created**: The local development database `fincraft_lab` exists on PostgreSQL.
- **Database authentication & SELECT 1 verified**: `PrismaService` extends `PrismaClient` with `@prisma/adapter-pg`, connects to `fincraft_lab`, and executes `SELECT 1` during module initialization (`OnModuleInit`).
- **No database table or migration exists yet**: `fincraft_lab` database has zero public tables (`TABLE_COUNT: 0`). No migration files exist.
- **`DatabaseModule` integrated**: Exported `PrismaService` and imported globally by `AppModule`.
- **E2E Test VM-modules fix**: `test/jest-e2e.json` maps relative `.js` imports (`moduleNameMapper`), and `package.json` configures `"test:e2e": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js --config ./test/jest-e2e.json"`.
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
P3B — Create the first Prisma migration for the approved 15-model MVP schema, without implementing CRUD yet.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
