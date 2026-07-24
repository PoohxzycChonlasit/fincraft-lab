# CURRENT_STATUS.md — FinCraft Lab Verified Status

## Current Verified State

- **Date**: 2026-07-24
- **Backend Stack**: NestJS + PostgreSQL + Prisma 7.8
- **Latest Task**: `P10_SIMULATION_API_1A_FREEZE_SURVIVAL_MONTHS_CONTRACT_001`
- **Swagger Status**: Closed & Fully Verified
- **Simulation Status**: Survival Months (`survival-months`) Contract Frozen (`FROZEN_SURVIVAL_MONTHS_SIMULATION_API_CONTRACT_V1`)
- **Simulation Source Implementation**: `NONE` (Plan & contract freeze only)
- **Prisma Schema Migration**: `NONE` (0 migrations executed; DIRECT_FIT & JSON_FIT schema verdict)
- **Seed Written**: `NONE` (Contract frozen for future seeding)
- **Worktree**: Clean (Pending Local Checkpoint Commit)
- **Next Recommended Task**: `P10_SIMULATION_API_1B_IMPLEMENT_SURVIVAL_MONTHS_001`

---

## Survival Months Simulation API Contract (`P10_SIMULATION_API_1A`)

- **Selected MVP Simulation**: `survival-months` (Survival Months / จำนวนเดือนที่เงินสำรองรองรับค่าใช้จ่าย)
- **Concept**: Emergency Fund + Job Loss = Survival Months
- **Contract Artifact**: [`docs/ai/plans/SURVIVAL_MONTHS_SIMULATION_API_CONTRACT.md`](file:///C:/devnest%20101/single-project/fincraft-lab/docs/ai/plans/SURVIVAL_MONTHS_SIMULATION_API_CONTRACT.md)
- **Frozen Contract Marker**: `FROZEN_SURVIVAL_MONTHS_SIMULATION_API_CONTRACT_V1`
- **Endpoints Frozen**:
  - `GET /simulations` (List active simulation templates)
  - `GET /simulations/:simulationId` (Get active simulation detail & educational metadata)
  - `POST /simulations/:simulationId/runs` (Execute calculation & persist immutable run)
- **Formula & Rounding**: `survivalMonths = emergencyFund / essentialMonthlyExpenses`, integer cent arithmetic, `ROUND_HALF_UP` 2-decimal mode.
- **Safety & Wording**: 100% neutral educational statement; advice/judgmental terms prohibited.
- **Prisma Schema Fit Verdict**:
  - `Simulation` and `SimulationRun` models fully accommodate all requirements.
  - Classification: `DIRECT_FIT` & `JSON_FIT`
  - Schema Change Required: `NONE` (0 migrations)

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
