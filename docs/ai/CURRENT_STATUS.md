# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P5_SEED_7B_IMPLEMENT_DISCOVERY_DETAILS_BATCH_B)

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
- **P5_SEED_6B checkpoint**: `f6c944f` — "feat: seed discovery detail batch a"
- **P5_SEED_6C checkpoint**: audit passed (Post-commit audit PASS)
- **P5_SEED_7A checkpoint**: `b338b98` — "docs: freeze discovery detail batch b content"
- **P5_SEED_7A2 audit**: PASS_WITH_DOC_FIXES (Single broken URL identified)
- **P5_SEED_7A3 repair**: `157f788` — "docs: repair discovery detail batch b source"
- **P5_SEED_7A4 audit**: PASS (Read-only verification of Batch B source repair)
- **P5_SEED_7B checkpoint**: `6b223c1` — "feat: seed discovery detail batch b"
- **P5_SEED_7C audit**: PASS (Read-only post-commit audit of Batch B seed commit)
- **P5_SEED_8A checkpoint**: `b746d79` — "docs: freeze core craft recipe plan"
- **P5_SEED_8B audit**: PASS (Read-only post-commit audit of Core Craft Recipe V1 plan)
- **P5_SEED_8C checkpoint**: "feat: seed core craft recipes"

### Backend (`fincraft-lab-api`) — Submission Seed v1 (Core Craft Recipes Seeded)

- **Categories Seeded**: Exactly 8 ElementCategory records in PostgreSQL database.
- **Elements Seeded**: Exactly 36 Element records (14 Starter + 22 Discovery) in PostgreSQL database.
- **Discovery Details Seeded**: Exactly 36 DiscoveryDetail records (14 Starter + 11 Batch A + 11 Batch B) in PostgreSQL database.
- **Core Craft Recipes Seeded**: Exactly 22 CraftRecipe records targeting all 22 Discovery Elements seeded in PostgreSQL database (`FROZEN_CORE_CRAFT_RECIPES_VALIDATED_V1`).
- **Core Craft Recipe Inputs Seeded**: Exactly 44 CraftRecipeInput records (2 distinct inputs per Recipe) seeded in PostgreSQL database.
- **Shared Craft Input Identity Helper**: `src/common/craft/calculate-craft-input-hash.ts` (SHA-256 canonical hash helper).
- **Idempotency Verified**: Executed `prisma db seed` twice; Recipe IDs and Input IDs remained 100% stable across runs (0 deltas).
- **Protected Tables Verified**: Protected table count deltas (`currentCount - initialCount === 0`) verified for 8 protected tables (`users`, `pets`, `userElements`, `discoveryEvents`, `workspaces`, `workspaceNodes`, `workspaceEdges`, `simulationRuns`). All deltas equal 0 (`delta = 0`).
- **Non-Recipe Content Tables**: `element_relationships` count = 0, `simulations` count = 0.
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
P5_SEED_8D_POST_COMMIT_CORE_CRAFT_RECIPE_SEED_AUDIT_001 — Independent read-only audit of commit "feat: seed core craft recipes" extending the seed chain.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Full coding rules → [`CODING_RULES.md`](CODING_RULES.md)
- Canonical Core Content Seed Plan → [`plans/CORE_CONTENT_SEED_PLAN.md`](plans/CORE_CONTENT_SEED_PLAN.md)
- Auth Fakebuck Refactor Plan → [`plans/AUTH_FAKEBUCK_STYLE_REFACTOR_PLAN.md`](plans/AUTH_FAKEBUCK_STYLE_REFACTOR_PLAN.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`

