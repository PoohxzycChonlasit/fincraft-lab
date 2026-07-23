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
- **P5_SEED_8C checkpoint**: `761b672` — "feat: seed core craft recipes"
- **P5_SEED_8D audit**: PASS (Read-only post-commit audit of Core Craft Recipe seed commit)
- **P6_CRAFT_API_1A checkpoint**: `bc5182d` — "docs: freeze craft api contract v1"
- **P6_CRAFT_API_1B audit**: PASS (Read-only post-commit audit of Craft API V1 contract)
- **P6_CRAFT_API_2A checkpoint**: `b7f3a21` — "feat: add craft request dto"
- **P6_CRAFT_API_2B audit**: PASS (Read-only post-commit audit of Craft request DTO commit)
- **P6_CRAFT_API_2C checkpoint**: `4ac94ac` — "feat: add craft response types"
- **P6_CRAFT_API_2D audit**: PASS_WITH_PROCESS_NOTE (Read-only post-commit audit of Craft response types commit)
- **P6_CRAFT_API_2E checkpoint**: "chore: make lint checks non-mutating"
- **P6_CRAFT_API_3A checkpoint**: `9f20fed` — "docs: freeze craft service implementation plan"
- **P6_CRAFT_API_3B audit**: PASS_WITH_DOC_FIXES (Read-only independent audit of CraftService implementation plan)
- **P6_CRAFT_API_3C checkpoint**: `23b52ca` — "docs: complete craft service verification plan"
- **P6_CRAFT_API_3D audit**: PASS (Read-only post-fix audit of CraftService implementation plan)
- **P6_CRAFT_API_4A checkpoint**: `eb6a8bc` — "feat: add craft sources parser"
- **P6_CRAFT_API_4B audit**: FIX_REQUIRED (Read-only post-commit audit identified TS2322 in craft-sources.parser.ts)
- **P6_CRAFT_API_4C checkpoint**: `5600958` — "fix: narrow craft source objects safely"
- **P6_CRAFT_API_4D audit**: PASS (Read-only post-fix audit of Craft sources parser)
- **P6_CRAFT_API_5A checkpoint**: `3f1a70a` — "feat: add craft response mapper"
- **P6_CRAFT_API_5B audit**: PASS (Read-only post-commit audit of Craft response mapper)
- **P6_CRAFT_API_6A checkpoint**: `a6b4da6` — "feat: add craft service"
- **P6_CRAFT_API_6B checkpoint**: `40c0051` — "refactor: split craft service boundaries"
- **P6_CRAFT_API_6C audit**: PASS (Read-only post-commit audit of split CraftService implementation)
- **P6_CRAFT_API_7A checkpoint**: `974ce1e` — "feat: add craft module"
- **P6_CRAFT_API_7B audit**: PASS_WITH_FIXES (Read-only post-commit audit of CraftModule)
- **P6_CRAFT_API_7C checkpoint**: `ff5ab3e` — "refactor: keep craft module internal"
- **P6_CRAFT_API_7D audit**: PASS (Read-only post-fix audit of CraftModule boundary correction)
- **P6_CRAFT_API_8A checkpoint**: `4f4b0db` — "feat: add craft controller"
- **P6_CRAFT_API_8C checkpoint**: `8d950ed` — "feat: register craft module"
- **P6_CRAFT_API_8D audit**: PASS_WITH_FIXES (AppModule Craft integration audit identified redundant Reflector provider in AuthModule)
- **P6_CRAFT_API_8E checkpoint**: `b87e45e` — "fix: remove redundant auth reflector provider"
- **P6_CRAFT_API_8F audit**: PASS (Read-only post-fix audit of AppModule Craft integration & Auth boundary correction)
- **P6_CRAFT_API_9A runtime acceptance**: PASS (Real local PostgreSQL & HTTP runtime acceptance completed, 22 scenarios executed)
- **P6_CRAFT_API_9B audit**: PASS_WITH_FIXES (Read-only post-runtime acceptance audit identified 4 documentation reconciliation points)
- **P6_CRAFT_API_9C checkpoint**: `9f5b101` — "docs: reconcile craft runtime acceptance evidence"
- **P6_CRAFT_API_9D audit**: PASS (Read-only post-commit audit of reconciled Craft API runtime acceptance evidence)
- **P6_CRAFT_API_9E checkpoint**: `be2e8fa` — "docs: finalize craft runtime acceptance evidence"
- **P6_CRAFT_API_9F checkpoint**: `1dba34a` — "docs: record craft concurrency runtime user id"
- **P7_ELEMENT_API_1A contract planning**: FROZEN & CORRECTED (`docs/ai/plans/AVAILABLE_ELEMENTS_API_PLAN.md` — `FROZEN_AVAILABLE_ELEMENTS_READ_API_CONTRACT_V1`)
- **P7_ELEMENT_API_1B implementation**: PASS (`GET /elements` implemented end-to-end in `src/element/` and registered in `AppModule`. All 12 live HTTP/PostgreSQL scenarios passed with 0 DB writes)
- **P7_ELEMENT_API_1C audit**: PASS (Read-only post-commit audit of Available Elements endpoint implementation and runtime evidence)
- **P8_WORKSPACE_API_1A contract planning**: FROZEN & CORRECTED (`docs/ai/plans/WORKSPACE_CRUD_API_PLAN.md` — `FROZEN_WORKSPACE_METADATA_CRUD_API_CONTRACT_V1`)
- **P8_WORKSPACE_API_1B implementation**: PASS (`POST/GET/PATCH/DELETE /workspaces` implemented end-to-end in `src/workspace/` and registered in `AppModule`. All 28 live HTTP/PostgreSQL scenarios passed)
- **P8_WORKSPACE_API_1C reconciliation & audit**: PASS (Shared test-harness infrastructure files restored to baseline `2e5fa53f85a09a96cdc455dc372e86294ab15046`. Workspace CRUD metadata endpoints verified against compiled NestJS application with 28/28 scenarios passing)
- **P9_WORKSPACE_GRAPH_API_1A contract planning**: FROZEN & CORRECTED (`docs/ai/plans/CANVAS_SNAPSHOT_API_PLAN.md` — `FROZEN_CANVAS_SNAPSHOT_API_CONTRACT_V1`). Defines `GET /workspaces/:id/canvas` and `PUT /workspaces/:id/canvas` for loading and replacing complete Canvas graph snapshots atomically. Corrected to include public Element display objects, exclude Node/Edge timestamps, enforce valueData (max 4096 bytes) & label limits (max 100 chars), handle other-workspace ID collisions (409 Conflict), align Element error responses, and specify dedicated `WorkspaceCanvasService`.

### Backend (`fincraft-lab-api`) — Non-Mutating Lint Workflow Repaired (`pnpm lint` vs `pnpm lint:fix`)

- **Non-Mutating Lint Verification**: `pnpm lint` in `package.json` changed to `eslint "{src,apps,libs,test}/**/*.ts"` (no `--fix`). Non-mutating proof verified (SHA256 of `prisma/seed.ts` unchanged before/after `pnpm lint`).
- **Explicit Fix Command**: `pnpm lint:fix` added to `package.json` (`eslint "{src,apps,libs,test}/**/*.ts" --fix`) for explicit opt-in formatting.
- **Dirty Seed Reconciliation**: `prisma/seed.ts` formatting diff audited and safely reconciled to HEAD `4ac94ac`.
- **Craft Response Types**: Implemented in `src/craft/types/craft-response.type.ts` (43 physical lines).
- **Craft Sources Parser**: Implemented & fixed in `src/craft/parsers/craft-sources.parser.ts` (78 physical lines). Resolved TS2322 using type predicate guard `isObjectRecord` without unsafe assertions. Pure, framework-independent runtime validator converting untrusted raw JSON sources into `CraftSourceResponse[]` with exact title/organization/url validation and reference independence. No `*.spec.ts` files created (verified via temporary untracked script).
- **Craft Response Mapper**: Implemented in `src/craft/mappers/craft-response.mapper.ts` (80 physical lines). Pure, framework-independent helper explicitly selecting public fields for `CraftDiscoveryResult` and `CraftNoRecipeResult` to prevent internal metadata leakage. Uses `parseCraftSources` for detail sources parsing with full reference independence and zero `*.spec.ts` files created (verified via temporary untracked script).
- **CraftService & Helpers**: Refactored into clean modular boundaries (`src/craft/craft.service.ts`, `src/craft/helpers/craft-prisma-error.helper.ts`, `src/craft/types/craft-service.type.ts`). `craft.service.ts` owns business flow and transaction orchestration; `craft-prisma-error.helper.ts` exports safe `isUserElementUniqueConflict` (0 `as` casts, returns `false` on missing `meta.target`) and `ExpectedUserElementRaceError`; `craft-service.type.ts` exports internal structural types. `NO_RECIPE` writes wrapped in `$transaction`. `executeDiscoveryTransaction` returns `{ isNewDiscovery: boolean }` and calls `mapCraftDiscoveryResult` after successful transaction commit.
- **CraftModule**: Implemented in `src/craft/craft.module.ts` (10 physical lines). Wires `DatabaseModule` (`imports: [DatabaseModule]`), declares `CraftController` (`controllers: [CraftController]`), and provides `CraftService` (`providers: [CraftService]`). Zero `*.spec.ts` files created (verified via temporary untracked Nest TestingModule script).
- **CraftController**: Implemented in `src/craft/craft.controller.ts` (23 physical lines). Exposes `POST /craft` with `@HttpCode(HttpStatus.OK)`. Extracts authenticated User ID from `@CurrentUser() user: AccessTokenPayload` (`user.sub`), validates `CraftRequestDto`, delegates to `craftService.craft(user.sub, dto)`, and wraps result in `{ data: result }`. Protected by global `AuthGuard`.
- **Exported Types**: `CraftSourceResponse`, `CraftElementResponse`, `CraftDiscoveryDetailResponse`, `CraftDiscoveryResult`, `CraftNoRecipeResult`, and `CraftResult` (discriminated union on `outcome: 'DISCOVERY' | 'NO_RECIPE'`).
- **Craft Service Implementation Plan**: Updated & frozen in `docs/ai/plans/CRAFT_SERVICE_IMPLEMENTATION_PLAN.md` with explicit No-Spec testing policy, concrete Postman deliverable (`P6_CRAFT_API_POSTMAN_RUNTIME_ACCEPTANCE_001`), exact transaction boundary sequence, and narrow P2002 1-retry concurrency strategy.
- **AppModule Registration Status**: `CraftModule`, `ElementModule`, and `WorkspaceModule` are registered in `src/app.module.ts`. `POST /craft`, `GET /elements`, and `/workspaces` CRUD endpoints are part of the full application graph and protected by global `AuthGuard` (returns `401 Unauthorized` when unauthenticated).
- **Craft API Runtime Acceptance**: Reconciled and finalized in `docs/ai/evidence/CRAFT_API_RUNTIME_ACCEPTANCE.md`. 22 live HTTP scenarios executed & passed (22/22 passed, 0 failed, C2 `DEFERRED_NOT_AVAILABLE` reported separately). Preserved PostgreSQL counts: 2 Users (User 1 `f74df612-a7d5-4541-ba6a-cde98c56bb7b` and User 2 `c4a51e82-d8b9-4a1e-8e3d-9f20e8b15a63`), 2 UserElements, 7 DiscoveryEvents (5 `SUCCESS`, 2 `NO_RECIPE`). Promise.all concurrency P2002 race condition handling verified. Postman collection execution `NOT_RUN` / `PENDING`.
- **Available Elements Read API**: Implemented (`src/element/`) & documented in `docs/ai/evidence/AVAILABLE_ELEMENTS_API_RUNTIME_ACCEPTANCE.md`. `GET /elements` returns active Starter Elements + user-unlocked active non-Starter Elements in active Categories. All 12 live HTTP scenarios passed with 0 database writes, exact public shape, and deterministic category-first ordering (`category.sortOrder ASC`, `isStarter DESC`, `name ASC`).
- **Workspace Metadata CRUD API**: Implemented (`src/workspace/`) & documented in `docs/ai/evidence/WORKSPACE_CRUD_API_RUNTIME_ACCEPTANCE.md`. 5 metadata endpoints (`POST/GET/PATCH/DELETE /workspaces`) with strict user ownership, privacy 404 responses for non-owned workspaces, safe string transform, ISO date serialization, and DB cascade deletion for dependent Nodes/Edges. Verified against compiled NestJS application (28/28 scenarios passed, 5 shared infra files restored to baseline `2e5fa53f85a09a96cdc455dc372e86294ab15046`).
- **Canvas Graph Snapshot Contract**: Frozen & corrected in `docs/ai/plans/CANVAS_SNAPSHOT_API_PLAN.md` (`FROZEN_CANVAS_SNAPSHOT_API_CONTRACT_V1`). Defines `GET /workspaces/:id/canvas` (load canvas graph with embedded Element display object) and `PUT /workspaces/:id/canvas` (replace complete graph atomically via `WorkspaceCanvasService`). Node/Edge UUIDs client-generated, 409 Conflict on archived workspace PUT or other-workspace ID collision, max 100 nodes / 200 edges / 4096-byte valueData, atomic Prisma `$transaction` replacement. Source implementation not started.
- **Auth Architecture & Reflector**: Cleaned in `src/auth/auth.module.ts`. Redundant `Reflector` provider removed (Nest core provides `Reflector` globally). Global `AuthGuard` remains active and effective via `APP_GUARD`.
- **Categories / Elements / Details / Recipes Seeded**: Intact in PostgreSQL (8 Categories, 36 Elements, 36 Details, 22 Recipes, 44 Recipe Inputs).
- **Protected Tables Verified**: All protected table deltas equal 0 (`delta = 0`).
- **Literal Fakebuck Auth Architecture**: Intact (`UserService`, `BcryptService`, `AccessTokenService`).

### Frontend (`fincraft-lab-web`)

- Empty, not yet initialized (out of scope).

## Build/Lint/Test — run status

- `pnpm build` — passed
- `pnpm lint` — passed (0 errors, 1 pre-existing warning in `main.ts` — non-mutating)
- `pnpm test` — passed (1/1 unit test suite passed, 3/3 tests)
- `pnpm test:e2e` — passed (1/1 e2e test suite passed, 2/2 tests)
- `tsc --noEmit` — passed (0 errors)
- `prisma validate` — passed (schema valid)
- Search for unsafe casts (`any`, `as any`, `as unknown`, `@ts-ignore`) in `src/` and `prisma/seed/` — 0 matches

## Active Project Rule: No Automatic Unit Spec Generation

Unit spec files are not generated automatically (`--no-spec` for Nest CLI generators, no hand-created unit specs without explicit instruction).

## Next Bounded Step

```text
P9_WORKSPACE_GRAPH_API_1B_IMPLEMENT_CANVAS_SNAPSHOT_001 — Implement authenticated Canvas Graph Snapshot API (GET/PUT /workspaces/:workspaceId/canvas) in src/workspace/ and verify via 40 live HTTP/PostgreSQL scenarios.
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Full coding rules → [`CODING_RULES.md`](CODING_RULES.md)
- Canonical Core Content Seed Plan → [`plans/CORE_CONTENT_SEED_PLAN.md`](plans/CORE_CONTENT_SEED_PLAN.md)
- Auth Fakebuck Refactor Plan → [`plans/AUTH_FAKEBUCK_STYLE_REFACTOR_PLAN.md`](plans/AUTH_FAKEBUCK_STYLE_REFACTOR_PLAN.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`

