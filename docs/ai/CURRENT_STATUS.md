# CURRENT_STATUS.md — FinCraft Lab Verified Status

## Current Verified State

- **Date**: 2026-07-24
- **Backend Stack**: NestJS + PostgreSQL + Prisma 7.8
- **Latest Task**: `P11_PET_PROFILE_API_1A_FREEZE_CONTRACT_001`
- **Swagger Status**: Closed & Fully Verified (16 current operations / 12 unique paths; 19 expected operations after Pet implementation)
- **Simulation Status**: Survival Months (`survival-months`) Closed & Fully Verified
- **Pet Profile Status**: Contract Reconciled & Frozen (`FROZEN_PET_PROFILE_API_CONTRACT_V1`)
- **Pet Source Implementation**: `NONE` (Contract freeze task only)
- **Pet Database Seed**: `NONE` (Pets are user-created via API)
- **Prisma Schema Migration**: `NONE` (0 migrations executed; 0 schema changes required)
- **Exact Cardinality**: `ONE_USER_ONE_PET`
- **Exact Schema-Fit Verdict**: `DIRECT_FIT` (all fields exist in `Pet` model)
- **Exact Avatar Strategy**: `STORED_AVATAR_URL_WITHOUT_REMOTE_FETCH` (no remote fetch / no upload)
- **Worktree**: Clean (Pending Local Checkpoint Commit)
- **Next Recommended Task**: `P11_PET_PROFILE_API_1B_IMPLEMENT_PET_PROFILE_001`

---

## Pet Profile Contract Freeze (`P11_PET_PROFILE_API_1A`)

- **Contract Artifact**: [`docs/ai/plans/PET_PROFILE_API_CONTRACT.md`](file:///C:/devnest%20101/single-project/fincraft-lab/docs/ai/plans/PET_PROFILE_API_CONTRACT.md)
- **Frozen Contract Marker**: `FROZEN_PET_PROFILE_API_CONTRACT_V1`
- **Contract Highlights**:
  1. **Product Role**: Personal profile guide & financial companion (1 Pet per User, persistent across sessions).
  2. **Schema Fit**: `DIRECT_FIT` for all fields (`id`, `userId`, `name`, `species`, `avatarUrl`, `personality`, `learningGoal`, `createdAt`, `updatedAt`). 0 Prisma migrations required.
  3. **Cardinality**: `ONE_USER_ONE_PET`. Enforced at database level via `Pet.userId` `@unique` constraint.
  4. **Avatar Strategy**: `STORED_AVATAR_URL_WITHOUT_REMOTE_FETCH`. Stores optional avatar URL or preset string. No remote HTTP fetching, file uploads, or AI image generation.
  5. **Endpoints**:
     - `GET /pets/me` (200 OK / 404 Not Found)
     - `POST /pets` (201 Created / 409 Conflict if Pet profile already exists)
     - `PATCH /pets/me` (200 OK / 404 Not Found / 400 Bad Request on empty body `{}`)
  6. **Security & Ownership**: All endpoints protected by Bearer JWT (`access-token`). `userId` derived strictly from JWT payload. Body `userId` or `id` injection rejected by `ValidationPipe`.
  7. **Response Envelope**: Wrapped in `{ "data": { id, name, species, avatarUrl, personality, learningGoal, createdAt, updatedAt } }`. `userId` and `passwordHash` strictly excluded.
  8. **Deferred Endpoints**: `DELETE /pets/me`, `GET /pets`, `GET /pets/:petId`, `PATCH /pets/:petId`, Admin CRUD, image uploads, AI features.
  9. **Runtime Acceptance Matrix**: 45 numbered scenarios frozen for future execution.

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
