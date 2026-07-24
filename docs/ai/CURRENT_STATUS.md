# CURRENT_STATUS.md — FinCraft Lab Verified Status

## Current Verified State

- **Date**: 2026-07-24
- **Backend Stack**: NestJS + PostgreSQL + Prisma 7.8
- **Latest Task**: `P11_PET_PROFILE_API_1A1_REPAIR_CONTRACT_001`
- **Swagger Status**: Closed & Fully Verified (16 current operations / 12 unique paths; 19 expected operations after Pet implementation)
- **Simulation Status**: Survival Months (`survival-months`) Closed & Fully Verified
- **Pet Profile Status**: Contract Reconciled & Frozen (`FROZEN_PET_PROFILE_API_CONTRACT_V1`)
- **Pet Source Implementation**: `NONE` (Contract reconciliation task only)
- **Pet Database Seed**: `NONE` (Pets are user-created via API)
- **Prisma Schema Migration**: `NONE` (0 migrations executed; 0 schema changes required)
- **Exact Cardinality**: `ONE_USER_ONE_PET`
- **Exact Schema-Fit Verdict**: `DIRECT_FIT` (all fields exist in `Pet` model)
- **Exact Avatar Strategy**: `STORED_HTTPS_AVATAR_URL_WITHOUT_REMOTE_FETCH` (HTTPS protocol required, no remote fetch, no file upload)
- **Exact Nullable-Field Semantics**: Omitted vs explicit `null` vs whitespace-only strings reconciled
- **Exact Auth Behavior**: Reused directly from `AuthGuard` (401) and `validateUser` (401 for missing user, 403 for INACTIVE/BANNED)
- **Worktree**: Clean (Pending Local Checkpoint Commit)
- **Next Recommended Task**: `P11_PET_PROFILE_API_1B_IMPLEMENT_PET_PROFILE_001`

---

## Pet Profile Contract Reconciliation (`P11_PET_PROFILE_API_1A1`)

- **Contract Artifact**: [`docs/ai/plans/PET_PROFILE_API_CONTRACT.md`](file:///C:/devnest%20101/single-project/fincraft-lab/docs/ai/plans/PET_PROFILE_API_CONTRACT.md)
- **Frozen Contract Marker**: `FROZEN_PET_PROFILE_API_CONTRACT_V1`
- **Reconciliation Highlights**:
  1. **Product Role**: Personal profile guide & financial companion (1 Pet per User, persistent across sessions).
  2. **Schema Fit**: `DIRECT_FIT` for all fields (`id`, `userId`, `name`, `species`, `avatarUrl`, `personality`, `learningGoal`, `createdAt`, `updatedAt`). 0 Prisma migrations required.
  3. **Cardinality & Concurrency**: `ONE_USER_ONE_PET`. Enforced at database level via `Pet.userId` `@unique` constraint. Friendly service pre-check + Prisma P2002 unique constraint mapping to `HTTP 409 Conflict` ("Pet profile already exists").
  4. **Avatar Strategy**: `STORED_HTTPS_AVATAR_URL_WITHOUT_REMOTE_FETCH`. Requires absolute HTTPS URL format (max 2048 chars). Rejects HTTP, data:, file:, javascript:, and whitespace-only strings with `HTTP 400 Bad Request`. Backend stores string only, performing NO remote requests or file downloads. Explicit `null` on PATCH clears `avatarUrl`. Omitted `avatarUrl` on PATCH preserves existing DB value.
  5. **Nullable Field Semantics**:
     - `avatarUrl`, `personality`, `learningGoal`: On Create, omitted/null stores `null`; valid string stores trimmed value; whitespace-only returns 400. On Patch, omitted preserves existing value; explicit `null` clears to `null`; valid string replaces value; whitespace-only returns 400.
     - `name`: Required on Create, optional on Patch; null/whitespace-only returns 400; trimmed length 1–50.
     - `species`: Required on Create, optional on Patch; null returns 400; must match `PetSpecies` enum (`CAT`, `DOG`, `RABBIT`, `TURTLE`, `BIRD`).
  6. **Auth Status Behavior**: Reused directly from project source:
     - Missing / Invalid JWT: `AuthGuard` throws `UnauthorizedException('Invalid or missing authentication token')` (401).
     - User missing in DB: Service throws `UnauthorizedException('User account not found')` (401).
     - INACTIVE / BANNED User: Service throws `ForbiddenException('User account is disabled')` (403).
  7. **Endpoints & Empty PATCH**:
     - `GET /pets/me` (200 OK / 404 Not Found)
     - `POST /pets` (201 Created / 409 Conflict)
     - `PATCH /pets/me` (200 OK / 404 Not Found / 400 Bad Request on empty body `{}` with message "At least one editable field must be provided")
  8. **Security & Ownership**: All endpoints protected by Bearer JWT (`access-token`). `userId` derived strictly from JWT payload. Body `userId` or `id` injection rejected by `ValidationPipe`.
  9. **Response Envelope**: Wrapped in `{ "data": { id, name, species, avatarUrl, personality, learningGoal, createdAt, updatedAt } }`. `userId` and `passwordHash` strictly excluded.
  10. **Reconciled Runtime Acceptance Matrix**: 50 numbered scenarios frozen for future execution.

---

## Survival Months Simulation Status (`P10_SIMULATION_API`)

- **Status**: Closed (All audit checks passed with commit `d3ed8cbac67aa335997c0457c927ee366e84ae32`)
- **Endpoints**: `GET /simulations`, `GET /simulations/:id`, `POST /simulations/:id/runs`
- **Runtime Acceptance**: `EXECUTED=44`, `PASSED=44`, `FAILED=0`, `DEFERRED=0`

---

## Static Quality Gates

- `tsc --noEmit -p tsconfig.json`: **PASSED (exit 0, 0 diagnostics)**
- `eslint`: **PASSED (exit 0, 0 errors, 0 warnings)**
- `nest build`: **PASSED (exit 0)**
- `jest --runInBand`: **PASSED (1 suite / 3 tests)**
- `jest --config ./test/jest-e2e.json`: **PASSED (1 suite / 2 tests)**
