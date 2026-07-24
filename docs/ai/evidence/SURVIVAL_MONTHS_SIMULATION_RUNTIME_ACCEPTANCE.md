# Survival Months Simulation Runtime Acceptance Evidence

This document records the compiled PostgreSQL runtime acceptance evidence for the Survival Months MVP Simulation (`survival-months`), verified against the frozen contract `FROZEN_SURVIVAL_MONTHS_SIMULATION_API_CONTRACT_V1`.

## Baseline & Identity

- **Starting Commit**: `187781bd2254553d19f38528b2c5c4a2e0224b80`
- **Database Key**: `Simulation.simulationType = "survival-months"`
- **Public Slug**: `slug = "survival-months"`
- **Linked Element**: `emergency-fund` (Starter Element #7)
- **Status**: `ActiveStatus.ACTIVE`
- **Database Migrations**: 0 (No Prisma schema changes made)

## Endpoint Inventory

1. `GET /simulations` — Protected, returns active supported simulation summaries ordered by `name ASC`, then `id ASC`.
2. `GET /simulations/:simulationId` — Protected, returns full simulation details including educational metadata, input definitions, formula explanation, assumptions, limitations, source, and disclaimer.
3. `POST /simulations/:simulationId/runs` — Protected, executes deterministic calculation and persists immutable `SimulationRun`.

## Calculation Engine & Formatting

- **Arithmetic**: Minor-unit integer arithmetic using BigInt (`fundMinor`, `expenseMinor`).
- **Rounding Algorithm**: `ROUND_HALF_UP` on minor-unit division for `survivalMonths`.
- **Whole Months Covered**: `Math.floor(fundMinor / expenseMinor)`.
- **Remaining Amount**: `(fundMinor - (wholeMonthsCovered * expenseMinor)) / 100` formatted to 2 decimals.

### Calculation Verification Examples

- **Example A (30,000.00 / 10,000.00)**: `survivalMonths: "3.00"`, `wholeMonthsCovered: 3`, `remainingAmount: "0.00"`
- **Example B (25,000.00 / 10,000.00)**: `survivalMonths: "2.50"`, `wholeMonthsCovered: 2`, `remainingAmount: "5000.00"`
- **Example C (0.00 / 10,000.00)**: `survivalMonths: "0.00"`, `wholeMonthsCovered: 0`, `remainingAmount: "0.00"`
- **Example D (10,000.00 / 3,000.00)**: `survivalMonths: "3.33"`, `wholeMonthsCovered: 3`, `remainingAmount: "1000.00"`
- **Half-Up Boundary (1,005.00 / 200.00)**: `survivalMonths: "5.03"`, `wholeMonthsCovered: 5`, `remainingAmount: "5.00"`

## Persisted Snapshot Format

- **Inputs JSON Snapshot**:
  ```json
  {
    "emergencyFund": "25000.00",
    "essentialMonthlyExpenses": "10000.00"
  }
  ```
- **Outputs JSON Snapshot**:
  ```json
  {
    "calculationVersion": "survival-months-v1",
    "result": {
      "survivalMonths": "2.50",
      "wholeMonthsCovered": 2,
      "remainingAmount": "5000.00"
    },
    "statementEn": "Under the entered values and stated assumptions, the emergency fund covers approximately 2.50 months of essential monthly expenses.",
    "statementTh": "ภายใต้ตัวเลขและสมมติฐานที่กรอก เงินสำรองรองรับค่าใช้จ่ายจำเป็นได้ประมาณ 2.50 เดือน",
    "assumptions": [
      "Essential monthly expenses remain constant.",
      "No new income is earned during the period.",
      "No investment returns, yields, or interest are included.",
      "No inflation adjustments are applied.",
      "No unexpected extra emergency costs occur.",
      "Both monetary inputs use the same currency unit.",
      "The result is a mathematical estimate, not a forecast."
    ],
    "limitations": [
      "Actual monthly expenses may fluctuate.",
      "Unplanned emergencies can create additional outlays.",
      "Income may resume earlier or later than expected.",
      "Inflation reduces purchasing power over time.",
      "Taxes, debt interest, and asset liquidity are not modeled.",
      "The simulation does not determine if a user is financially safe.",
      "The result is not individualized financial advice."
    ],
    "disclaimer": "Education and simulation only. Not financial advice.",
    "sources": [
      {
        title: "An Essential Guide to Building an Emergency Fund",
        publisher: "Consumer Financial Protection Bureau (CFPB)",
        url: "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/",
        accessedAt: "2026-07-24"
      }
    ]
  }
  ```

## Compiled Runtime Acceptance Summary

```text
EXECUTED=44
PASSED=44
FAILED=0
DEFERRED=0
MODE=COMPILED_NEST_APP_MODULE_REAL_POSTGRESQL
```

### 44-Scenario Verification Results

1. **List & Detail (Scenarios 1-7)**: PASS (Seeded active simulation returned, sorted by `name ASC` then `id ASC`, inactive simulations excluded, full detail payload validated, missing IDs return 404 `"Simulation not found"`, inactive IDs return 404 `"Simulation not found"`, missing JWT returns 401 Unauthorized).
2. **Valid Calculations (Scenarios 8-18)**: PASS (Examples A, B, C, D, Half-up boundary, two-decimal string formatting, distinct run IDs, 2-decimal string input snapshots, `ROUND_HALF_UP` algorithm, neutral statements with values, assumptions & limitations verified).
3. **Invalid Input Validation (Scenarios 19-28)**: PASS (Missing inputs, negative inputs, zero expenses, > 2 decimal places, non-number strings, nulls, extra properties including `userId`, and technical max overflow all return HTTP 400 Bad Request).
4. **Persistence (Scenarios 29-37)**: PASS (Exactly 1 run row created per valid request, authenticated JWT `userId` stored, normalized string inputs, complete JSON outputs, version string, validation/404 failures create 0 run records, historical snapshot immutability verified).
5. **Security & Response (Scenarios 38-44)**: PASS (`userId` in body rejected, `userId` excluded from response DTOs, internal config excluded, `passwordHash` absent, Swagger OpenAPI contains 3 Simulation operations with Bearer security, all 16 OpenAPI operations / 12 paths fully functional).

## Quality Gates Verification

| Gate | Command | Exit Code | Result |
| :--- | :--- | :--- | :--- |
| **1. TypeScript** | `node ./node_modules/typescript/bin/tsc --noEmit -p tsconfig.json` | 0 | 0 errors |
| **2. ESLint** | `node ./node_modules/eslint/bin/eslint.js "{src,apps,libs,test}/**/*.ts"` | 0 | 0 errors, 0 warnings |
| **3. Nest Build** | `node ./node_modules/@nestjs/cli/bin/nest.js build` | 0 | Build successful |
| **4. Unit Tests** | `node ./node_modules/jest/bin/jest.js --runInBand` | 0 | 1 suite / 3 tests passed |
| **5. E2E Tests** | `node --experimental-vm-modules ./node_modules/jest/bin/jest.js --config ./test/jest-e2e.json --runInBand` | 0 | 1 suite / 2 tests passed |

## File Size Audit

- `src/simulation/simulation.controller.ts`: 63 lines (target <= 150)
- `src/simulation/simulation.service.ts`: 154 lines (target <= 250)
- `src/simulation/simulation-calculator.service.ts`: 49 lines (target <= 250)
- `src/simulation/simulation.module.ts`: 12 lines (target <= 60)
- `src/simulation/constants/survival-months.definition.ts`: 81 lines
- `src/simulation/openapi/simulation-openapi.decorators.ts`: 89 lines
- `src/simulation/dto/survival-months-run-request.dto.ts`: 32 lines
- `src/simulation/dto/simulation-response.dto.ts`: 238 lines (target <= 250)

All source files are strictly under the 400 physical line hard limit. All methods are under the 100 physical line hard limit.

## External Tooling & Safety Compliance

- **Prisma Migrations**: 0 created
- **Postman/Newman**: NOT_PERFORMED
- **Manual Swagger Try it out**: NOT_PERFORMED
