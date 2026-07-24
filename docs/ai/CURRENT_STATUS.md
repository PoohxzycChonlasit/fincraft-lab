# CURRENT_STATUS.md — FinCraft Lab Verified Status

## Current Verified State

- **Date**: 2026-07-24
- **Backend Stack**: NestJS + PostgreSQL + Prisma 7.8
- **Latest Task**: `P10_SIMULATION_API_1B_IMPLEMENT_SURVIVAL_MONTHS_001`
- **Swagger Status**: Closed & Fully Verified (16 operations / 12 unique paths)
- **Simulation Status**: Survival Months (`survival-months`) Implemented & Verified End-to-End
- **Simulation Endpoints**:
  1. `GET /simulations` (200 OK)
  2. `GET /simulations/:simulationId` (200 OK)
  3. `POST /simulations/:simulationId/runs` (201 Created)
- **Prisma Schema Migration**: `NONE` (0 migrations executed; 0 schema changes required)
- **Seed Present**: 1 Simulation master record (`survival-months`) linked to Element `emergency-fund`
- **Runtime Acceptance**: `EXECUTED=44`, `PASSED=44`, `FAILED=0`, `DEFERRED=0` (`COMPILED_NEST_APP_MODULE_REAL_POSTGRESQL`)
- **AI & Recommendation Safety**: No AI text generation, market data, or financial recommendations
- **Worktree**: Clean (Pending Local Checkpoint Commit)
- **Next Recommended Task**: `P10_SIMULATION_API_1C_POST_COMMIT_AUDIT_001`

---

## Survival Months Simulation Implementation (`P10_SIMULATION_API_1B`)

- **Selected MVP Simulation**: `survival-months` (Survival Months / จำนวนเดือนที่เงินสำรองรองรับค่าใช้จ่าย)
- **Contract Artifact**: [`docs/ai/plans/SURVIVAL_MONTHS_SIMULATION_API_CONTRACT.md`](file:///C:/devnest%20101/single-project/fincraft-lab/docs/ai/plans/SURVIVAL_MONTHS_SIMULATION_API_CONTRACT.md)
- **Frozen Contract Marker**: `FROZEN_SURVIVAL_MONTHS_SIMULATION_API_CONTRACT_V1`
- **Evidence Artifact**: [`docs/ai/evidence/SURVIVAL_MONTHS_SIMULATION_RUNTIME_ACCEPTANCE.md`](file:///C:/devnest%20101/single-project/fincraft-lab/docs/ai/evidence/SURVIVAL_MONTHS_SIMULATION_RUNTIME_ACCEPTANCE.md)
- **Implementation Summary**:
  1. **Typed Definition**: `src/simulation/constants/survival-months.definition.ts` contains immutable educational metadata, input definitions, formula, assumptions, limitations, source (CFPB), and disclaimer.
  2. **Deterministic Calculator**: `SimulationCalculatorService` uses BigInt minor-unit arithmetic (1 unit = 100 minor units) with `ROUND_HALF_UP` rounding.
  3. **Fail-Closed Service**: `SimulationService` validates ACTIVE user status, checks code registry, and persists complete historical snapshot in `SimulationRun`.
  4. **Protected Controller**: `SimulationController` handles routes with `@CurrentUser()`, `ParseUUIDPipe`, `ValidationPipe` whitelist rejection of `userId` in body, and `{ data: result }` response envelope.
  5. **Swagger Documentation**: Operations tagged under `Simulations` with Bearer security. Total OpenAPI inventory updated to 16 operations across 12 unique paths.
  6. **Idempotent Seed**: `prisma/seed/steps/seed-simulations.ts` seeds `survival-months` linked to `emergency-fund`.
  7. **Runtime Verification**: 44/44 frozen matrix scenarios verified against compiled `AppModule` on real local PostgreSQL.

---

## Static Quality Gates

- `tsc --noEmit -p tsconfig.json`: **PASSED (exit 0, 0 diagnostics)**
- `eslint`: **PASSED (exit 0, 0 errors, 0 warnings)**
- `nest build`: **PASSED (exit 0)**
- `jest --runInBand`: **PASSED (1 suite / 3 tests)**
- `jest --config ./test/jest-e2e.json`: **PASSED (1 suite / 2 tests)**

---

## Architectural & File Size Ceilings

- **Root-MCS Policy Enforced**: Primary `simulation.module.ts`, `simulation.controller.ts`, `simulation.service.ts`, `simulation-calculator.service.ts` remain strictly at feature root `src/simulation/`.
- **Controller Line Ceilings**: `simulation.controller.ts` is 63 lines (preferred <= 150, hard <= 200).
- **Service & Source Ceilings**: `simulation.service.ts` is 154 lines (preferred <= 250). All source files remain strictly below 400 physical lines. All methods remain below 100 physical lines.
