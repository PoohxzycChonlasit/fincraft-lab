# CURRENT_STATUS.md — FinCraft Lab Verified Status

## Current Verified State

- **Date**: 2026-07-24
- **Backend Stack**: NestJS + PostgreSQL + Prisma 7.8
- **Latest Task**: `P10_SIMULATION_API_1A1_REPAIR_SURVIVAL_MONTHS_CONTRACT_001`
- **Swagger Status**: Closed & Fully Verified
- **Simulation Status**: Survival Months (`survival-months`) Contract Fully Reconciled & Frozen (`FROZEN_SURVIVAL_MONTHS_SIMULATION_API_CONTRACT_V1`)
- **Simulation Source Implementation**: `NONE` (Contract reconciliation only)
- **Prisma Schema Migration**: `NONE` (0 migrations executed; 0 schema changes required)
- **Seed Written**: `NONE` (Contract frozen for future seeding)
- **Worktree**: Clean (Pending Local Checkpoint Commit)
- **Next Recommended Task**: `P10_SIMULATION_API_1B_IMPLEMENT_SURVIVAL_MONTHS_001`

---

## Survival Months Contract Reconciliation (`P10_SIMULATION_API_1A1`)

- **Selected MVP Simulation**: `survival-months` (Survival Months / จำนวนเดือนที่เงินสำรองรองรับค่าใช้จ่าย)
- **Contract Artifact**: [`docs/ai/plans/SURVIVAL_MONTHS_SIMULATION_API_CONTRACT.md`](file:///C:/devnest%20101/single-project/fincraft-lab/docs/ai/plans/SURVIVAL_MONTHS_SIMULATION_API_CONTRACT.md)
- **Frozen Contract Marker**: `FROZEN_SURVIVAL_MONTHS_SIMULATION_API_CONTRACT_V1`
- **Reconciliation Highlights**:
  1. **Master Metadata Storage**: `Simulation.description` is plain educational text (`DIRECT_FIT_AS_TEXT`). Structured metadata is owned by a typed code registry (`src/simulation/constants/survival-months.definition.ts` / `CODE_REGISTRY_FIT`). No JSON in `description` or new Prisma column.
  2. **Database/Public Identity**: Database key `Simulation.simulationType = "survival-months"`, public response field `slug = simulationType`. No database `slug` column exists.
  3. **Supported Registry & 404 Behavior**: Fail-closed pattern requiring both active DB record and code registry match. Missing/inactive/unsupported simulations return `HTTP 404` (`Simulation not found`).
  4. **Exact HTTP Contract**: `GET /simulations` (200 OK, `name ASC, id ASC`), `GET /simulations/:simulationId` (200 OK), `POST /simulations/:simulationId/runs` (201 Created). Envelope `{ "data": ... }`. Malformed UUID v4 returns 400.
  5. **User ID Security**: `userId` in request body is **REJECTED** with HTTP 400 (`property userId should not exist`) by ValidationPipe. Authenticated user ID comes strictly from JWT.
  6. **Minor-Unit Arithmetic**: Calculated using minor units (1 unit = 100 minor units). Max input `100,000,000.00` (10 Billion minor units, safely below `MAX_SAFE_INTEGER`).
  7. **Rounding Algorithm**: Executable `ROUND_HALF_UP` on minor-unit division for `survivalMonths`. Half-up boundary example verified (`1005.00 / 200.00 -> 5.03`).
  8. **Immutable Snapshot**: `SimulationRun.inputs` and `outputs` store full historical snapshot. Future code definition edits do not alter past run snapshots.
  9. **Authoritative Source**: Official CFPB emergency fund guide metadata.
  10. **Acceptance Matrix**: Reconciled to exactly 44 numbered scenarios (7 List/Detail, 11 Calculation, 10 Validation, 9 Persistence, 7 Security).

---

## Swagger UI & OpenAPI Implementation (`P9_API_DOCS`)

- **Status**: Closed (All lint formatting errors repaired, 28/28 acceptance assertions passed)
- **Package Installed**: `@nestjs/swagger@11.4.6`
- **Swagger UI Path**: `http://localhost:3000/docs`
- **OpenAPI Spec Path**: `http://localhost:3000/docs-json`
- **Security Scheme**: `access-token` (HTTP Bearer JWT)
- **Documented Endpoints**: 13 total endpoints across Health, Auth, Elements, Craft, Workspaces, and Canvas tags.

---

## Static Quality Gates

- `tsc --noEmit -p tsconfig.json`: PASSED (exit 0, 0 diagnostics)
- `eslint`: PASSED (exit 0, 0 errors, 0 warnings)
- `nest build`: PASSED (exit 0)
- `jest --runInBand`: PASSED (1 suite / 3 tests)
- `jest --config ./test/jest-e2e.json`: PASSED (1 suite / 2 tests)

---

## Architectural Refactoring & Modern NestJS Compliance

- **Root-MCS Policy Enforced**: Primary Module/Controller/Service files remain strictly at feature root.
- **Controller Line Ceilings**: All Controllers <= 150 lines.
- **Service & Source Ceilings**: All maintained source files remain strictly below 400 physical lines.
