# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P5_SEED_6B_IMPLEMENT_DISCOVERY_DETAILS_BATCH_A)

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
- **P5_SEED_2 checkpoint**: `d807255` — "feat: add core seed infrastructure and categories"
- **P4_AUTH_6 checkpoint**: `709594a` — "docs: plan Fakebuck-aligned auth refactor"
- **P4_AUTH_7 checkpoint**: `fe30daa` — "refactor: extract user persistence from auth"
- **P4_AUTH_8 checkpoint**: `b611466` — "refactor: align auth code with Fakebuck style"
- **P5_SEED_3 checkpoint**: `7b08d86` — "feat: seed starter financial elements"
- **P5_SEED_4 checkpoint**: `6a682bc` — "feat: seed discovery financial elements"
- **P5_SEED_5A checkpoint**: `0d0ff43` — "docs: freeze starter element detail content"
- **P5_SEED_5A3 checkpoint**: `d5751bb` — "docs: repair starter detail sources"
- **P5_SEED_5A3_WORDING checkpoint**: `ffaafb2` — "docs: adjust starter detail source verification wording"
- **P5_SEED_5B checkpoint**: `66d2325` — "feat: seed starter element details"
- **P5_SEED_6A checkpoint**: `337d066` — "docs: freeze discovery detail batch a content"
- **P5_SEED_6B checkpoint**: "feat: seed discovery detail batch a" (see git log)

### Backend (`fincraft-lab-api`) — Submission Seed v1 (Discovery Details Batch A Implemented)

- **Starter Details Seeded**: Exactly 14 DiscoveryDetail records targeting all 14 Starter Elements seeded in PostgreSQL database (`FROZEN_STARTER_ELEMENT_DETAILS_SOURCE_VERIFIED_V2`).
- **Discovery Details Batch A Seeded**: Exactly 11 DiscoveryDetail records targeting Batch A Discovery Elements (sortOrder 15-25) seeded in PostgreSQL database (`FROZEN_DISCOVERY_DETAILS_BATCH_A_SOURCE_VERIFIED_V1`).
- **Total DiscoveryDetail Database Rows**: Exactly 25 rows in PostgreSQL database (14 Starter Element Details + 11 Batch A Discovery Element Details + 0 Batch B Discovery Element Details).
- **Source Counts (Batch A)**: 13 source objects across 11 Discovery Details, pointing to 7 unique URLs (`VERIFIED_SPECIFIC_PAGE`: 2, `VERIFIED_PUBLICATION`: 1, `VERIFIED_GENERAL_HUB`: 4). Reported separately from Starter Details sources.
- **Seeded Elements Table**: Exactly 36 Elements in PostgreSQL database (14 Starter Elements + 22 Discovery Elements).
- **Seeded Categories Table**: Exactly 8 Element Categories in PostgreSQL database.
- **Protected Tables Verified**: Protected table count deltas (`currentCount - initialCount === 0`) verified for 8 protected tables (`users`, `pets`, `userElements`, `discoveryEvents`, `workspaces`, `workspaceNodes`, `workspaceEdges`, `simulationRuns`). All deltas equal 0 (`delta = 0`).
- **Literal Fakebuck Auth Architecture**: Intact (`UserService`, `BcryptService`, `AccessTokenService`).

### Frontend (`fincraft-lab-web`)

- Empty, not yet initialized (out of scope).

## Build/Lint/Test — run status

- `pnpm build` — passed
- `pnpm lint` — 0 errors, 1 pre-existing warning in `main.ts` (`@typescript-eslint/no-floating-promises`)
- `pnpm test` — 3/3 unit tests passed
- `pnpm test:e2e` — 2/2 e2e tests passed
- `tsc --noEmit` — passed (0 errors)
- `prisma validate` — passed (schema valid)
- Search for unsafe casts (`any`, `as any`, `as unknown`, `@ts-ignore`) in `src/` and `prisma/seed/` — 0 matches

## Active Project Rule: No Automatic Unit Spec Generation

Unit spec files are not generated automatically (`--no-spec` for Nest CLI generators, no hand-created unit specs without explicit instruction).

## Next Bounded Step

```text
P5_SEED_7A_RESEARCH_AND_FREEZE_DISCOVERY_DETAILS_BATCH_B_001 — Research, draft, validate, source-verify, and freeze DiscoveryDetail content for the remaining eleven Discovery Elements in Batch B (sortOrder 26 through 36) in CORE_CONTENT_SEED_PLAN.md.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Core Content Seed Plan → [`plans/CORE_CONTENT_SEED_PLAN.md`](plans/CORE_CONTENT_SEED_PLAN.md)
- Auth Fakebuck Refactor Plan → [`plans/AUTH_FAKEBUCK_STYLE_REFACTOR_PLAN.md`](plans/AUTH_FAKEBUCK_STYLE_REFACTOR_PLAN.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
