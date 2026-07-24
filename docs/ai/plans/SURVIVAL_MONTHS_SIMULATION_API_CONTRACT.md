# SURVIVAL_MONTHS_SIMULATION_API_CONTRACT.md — FinCraft Lab MVP Simulation Contract

FROZEN_SURVIVAL_MONTHS_SIMULATION_API_CONTRACT_V1

## 1. Scope

This contract freezes the exact technical specification for the first FinCraft Lab MVP Simulation:

- **Simulation Slug**: `survival-months`
- **English Name**: Survival Months
- **Thai Name**: จำนวนเดือนที่เงินสำรองรองรับค่าใช้จ่าย
- **Concept**: Emergency Fund + Job Loss = Survival Months
- **Purpose**: Estimate how many months an emergency fund could cover essential monthly expenses under explicit fixed user-supplied assumptions.

The contract covers:
- REST API Surface (`GET /simulations`, `GET /simulations/:simulationId`, `POST /simulations/:simulationId/runs`)
- Request DTO & Input Validation Rules
- Response Envelope DTOs
- Exact Calculation Formula, Decimal Precision & Rounding Rules
- Educational Neutral Result Wording & Prohibited Terminology
- Authoritative Educational Source Metadata
- Immutable Persistence Model & Prisma Schema Mapping
- Security, Authorization & Privacy Rules
- Error Matrix
- Seed Data Contract
- Swagger OpenAPI Documentation Contract
- Future NestJS Feature File Structure
- 44 Scenarios Runtime Acceptance Matrix

---

## 2. Out of Scope

The following features and simulations are explicitly out of scope for this MVP contract:
- Debt Spiral Simulation
- Food Cost Pressure Simulation
- Saving Plan / Goal Progress Simulation
- Investment Return / Asset Yield Simulation
- Compound Interest Calculator
- Inflation Projection Engine
- Budget Optimizer / Auto-allocation Advisor
- Financial Risk Score / Credit Rating Engine
- AI-Generated Simulations / LLM Recommendations
- `GET /simulation-runs` or `GET /simulation-runs/:runId`
- `PATCH` / `DELETE` operations on Simulation Runs
- Admin management endpoints for Simulations
- Public / Unauthenticated Simulation Execution
- Automatic Element unlocking or Workspace/Canvas Graph mutation from Simulation runs

---

## 3. User Story

> **As an** authenticated student/user of FinCraft Lab,  
> **I want to** run the Survival Months simulation by entering my current emergency fund and essential monthly expenses,  
> **So that** I can understand mathematically how many months my fund can cover essential outlays during a sudden job loss scenario under clear, neutral educational assumptions without receiving financial advice or speculative predictions.

---

## 4. Existing Prisma Analysis & Fit Matrix

An inspection of `prisma/schema.prisma` confirms that the required data structures fit into existing models `Simulation` and `SimulationRun` without database migration.

### Field-by-Field Prisma Fit Matrix

| Contract Field | Existing Prisma Model | Existing Prisma Field | Prisma Type | Nullable | Classification | Gap / Notes | Recommended Action |
|---|---|---|---|---|---|---|---|
| Simulation ID | `Simulation` | `id` | `String` (UUID) | No | `DIRECT_FIT` | None | Use directly |
| Simulation Slug | `Simulation` | `simulationType` | `String` | No (Unique) | `DIRECT_FIT` | Value: `"survival-months"` | Use directly |
| English Name | `Simulation` | `name` | `String` | No | `DIRECT_FIT` | Value: `"Survival Months"` | Use directly |
| Description & Master Metadata | `Simulation` | `description` | `String` | No | `JSON_FIT` / `DIRECT_FIT` | Holds JSON or structured text metadata (`thaiName`, `summary`, `sources`, `disclaimer`) | Store structured metadata in `description` or parse cleanly |
| Active Status | `Simulation` | `status` | `ActiveStatus` | No | `DIRECT_FIT` | Enum: `ACTIVE`, `INACTIVE` | Use directly |
| Linked Element ID | `Simulation` | `linkedElementId` | `String` | Yes | `DIRECT_FIT` | Optional link to Element | Link to `Emergency Fund` element |
| Run ID | `SimulationRun` | `id` | `String` (UUID) | No | `DIRECT_FIT` | None | Generated automatically |
| User ID | `SimulationRun` | `userId` | `String` (UUID) | No | `DIRECT_FIT` | Foreign key to `User` | Derived from Bearer JWT |
| Simulation ID | `SimulationRun` | `simulationId` | `String` (UUID) | No | `DIRECT_FIT` | Foreign key to `Simulation` | Required URL param |
| Input Snapshot | `SimulationRun` | `inputs` | `Json` | No | `JSON_FIT` | Stores normalized DTO (`emergencyFund`, `essentialMonthlyExpenses`) | Immutable JSON object |
| Output Snapshot | `SimulationRun` | `outputs` | `Json` | No | `JSON_FIT` | Stores calculation result, neutral statements, assumptions, limitations, disclaimer, calculationVersion, sources | Immutable JSON object |
| Run Created Time | `SimulationRun` | `createdAt` | `DateTime` | No | `DIRECT_FIT` | Default `@default(now())` | Generated automatically |

**Verdict**: **DIRECT_FIT** & **JSON_FIT** (0 schema migration required for MVP).

---

## 5. Endpoint Contract

All endpoints are protected by `JwtAuthGuard` and require an `ACTIVE` authenticated user.

### 5.1 GET /simulations
- **Description**: List all available ACTIVE Simulation templates.
- **Auth**: Protected (`access-token` HTTP Bearer JWT).
- **Query Params**: None.
- **Ordering**: Deterministic by `name ASC`.
- **Response**: `200 OK` with `{ "data": [ SimulationSummaryResponseDto ] }`.

### 5.2 GET /simulations/:simulationId
- **Description**: Get public educational metadata for a specific ACTIVE Simulation.
- **Auth**: Protected (`access-token` HTTP Bearer JWT).
- **Params**: `simulationId` (UUID v4 format).
- **Response**: `200 OK` with `{ "data": SimulationDetailResponseDto }`.
- **Error Behavior**: Missing or `INACTIVE` Simulation returns `404 Not Found` (`Simulation not found`).

### 5.3 POST /simulations/:simulationId/runs
- **Description**: Validate input, execute deterministic calculation, persist immutable `SimulationRun`, and return result.
- **Auth**: Protected (`access-token` HTTP Bearer JWT).
- **Params**: `simulationId` (UUID v4 format).
- **Request Body**: `SurvivalMonthsRunRequestDto`.
- **Response**: `201 Created` with `{ "data": SimulationRunResponseDto }`.
- **Error Behavior**:
  - Missing/invalid JWT -> `401 Unauthorized`
  - Inactive User -> `401 Unauthorized`
  - Validation failure -> `400 Bad Request`
  - Missing/INACTIVE Simulation -> `404 Not Found`

---

## 6. Request DTO Contract

### Class: `SurvivalMonthsRunRequestDto`

```json
{
  "emergencyFund": 25000,
  "essentialMonthlyExpenses": 10000
}
```

### Field Validation Rules

1. `emergencyFund`
   - **Required**: Yes
   - **Type**: Number (numeric, finite)
   - **Constraint**: `@Min(0)`, `@Max(100000000.00)`
   - **Decimal Constraint**: Maximum 2 decimal places (e.g. `25000` or `25000.50`). Inputs with > 2 decimal places (e.g. `25000.555`) MUST be rejected with `400 Bad Request`.
   - **Disallowed**: `NaN`, `Infinity`, `-Infinity`, `null`, `undefined`, boolean, string, array, object.

2. `essentialMonthlyExpenses`
   - **Required**: Yes
   - **Type**: Number (numeric, finite)
   - **Constraint**: `@GreaterThanZero` (`> 0`), `@Max(100000000.00)`
   - **Decimal Constraint**: Maximum 2 decimal places. Inputs with > 2 decimal places MUST be rejected with `400 Bad Request`.
   - **Disallowed**: `0`, negative values, `NaN`, `Infinity`, `-Infinity`, `null`, `undefined`, boolean, string, array, object.

### Technical Maximum & Anti-Abuse Bound
- **Technical Maximum**: `100,000,000.00` (100 Million currency units).
- **Justification**: Prevents integer overflow in minor-unit cent calculations (`100M * 100 = 10 Billion cents`, safely within JavaScript `Number.MAX_SAFE_INTEGER = 9,007,199,254,740,991`), protects against anti-abuse payload spamming, and eliminates floating-point precision degradation without providing financial advice.

### Global Validation Pipe Settings
- `whitelist: true`
- `forbidNonWhitelisted: true`
- Extra unexpected properties in payload trigger immediate `400 Bad Request`.

---

## 7. Response DTO Contract

### 7.1 `SimulationSummaryResponseDto`
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "slug": "survival-months",
  "name": "Survival Months",
  "thaiName": "จำนวนเดือนที่เงินสำรองรองรับค่าใช้จ่าย",
  "summary": "Estimates how many months an emergency fund covers essential expenses during job loss.",
  "isActive": true
}
```

### 7.2 `SimulationDetailResponseDto`
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "slug": "survival-months",
  "name": "Survival Months",
  "thaiName": "จำนวนเดือนที่เงินสำรองรองรับค่าใช้จ่าย",
  "summary": "Estimates how many months an emergency fund covers essential expenses during job loss.",
  "description": "Calculates runway in months by dividing total emergency savings by essential monthly living costs.",
  "inputDefinitions": [
    {
      "field": "emergencyFund",
      "labelEn": "Emergency Fund",
      "labelTh": "เงินสำรองฉุกเฉิน",
      "description": "Total liquid cash reserved for emergencies."
    },
    {
      "field": "essentialMonthlyExpenses",
      "labelEn": "Essential Monthly Expenses",
      "labelTh": "ค่าใช้จ่ายจำเป็นต่อเดือน",
      "description": "Mandatory monthly living costs (food, housing, utilities)."
    }
  ],
  "formulaExplanation": "survivalMonths = emergencyFund / essentialMonthlyExpenses",
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
  "sources": [
    {
      "title": "Emergency Financial Kit & Guidelines",
      "publisher": "Consumer Financial Protection Bureau (CFPB)",
      "url": "https://www.consumerfinance.gov/consumer-tools/educator-resources/your-money-your-goals/",
      "accessedAt": "2026-07-24"
    }
  ],
  "disclaimer": "Education and simulation only. Not financial advice.",
  "calculationVersion": "survival-months-v1",
  "isActive": true
}
```

### 7.3 `SimulationRunResponseDto` (Envelope: `{ "data": ... }`)
```json
{
  "data": {
    "runId": "c3d4e5f6-a7b8-9012-cdef-34567890abcd",
    "simulation": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "slug": "survival-months",
      "name": "Survival Months"
    },
    "input": {
      "emergencyFund": "25000.00",
      "essentialMonthlyExpenses": "10000.00"
    },
    "result": {
      "survivalMonths": "2.50",
      "wholeMonthsCovered": 2,
      "remainingAmount": "5000.00",
      "statementEn": "Under the entered values and stated assumptions, the emergency fund covers approximately 2.50 months of essential monthly expenses.",
      "statementTh": "ภายใต้ตัวเลขและสมมติฐานที่กรอก เงินสำรองรองรับค่าใช้จ่ายจำเป็นได้ประมาณ 2.50 เดือน"
    },
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
    "calculationVersion": "survival-months-v1",
    "createdAt": "2026-07-24T11:15:00.000Z"
  }
}
```

---

## 8. Formula & Calculation Rules

### Calculation Version
`survival-months-v1`

### Mathematical Definitions
Let $E$ = `emergencyFund` (cents = $E \times 100$)  
Let $M$ = `essentialMonthlyExpenses` (cents = $M \times 100$)

1. **Exact Unrounded Ratio**:
   $$\text{survivalMonthsRaw} = \frac{E}{M}$$

2. **Whole Months Covered**:
   $$\text{wholeMonthsCovered} = \lfloor \text{survivalMonthsRaw} \rfloor = \text{Math.floor}\left(\frac{E}{M}\right)$$

3. **Remaining Amount**:
   $$\text{remainingAmount} = E - (\text{wholeMonthsCovered} \times M)$$

4. **Public Formatted Output**:
   - `survivalMonths`: Fixed 2-decimal string rounded using **`ROUND_HALF_UP`** (e.g. `2.50`, `3.33`).
   - `wholeMonthsCovered`: Integer (e.g. `2`, `3`).
   - `remainingAmount`: Fixed 2-decimal string formatted from remaining cents (e.g. `"5000.00"`, `"1000.00"`).

### Decimal Precision & Rounding Mode
- **Arithmetic Mode**: Integer minor-unit arithmetic (converting currency to cents: `amount * 100`) to guarantee zero binary floating-point representation errors.
- **Rounding Mode**: **`ROUND_HALF_UP`** for `survivalMonths` division output.
- **No Silent Rounding on Input**: Inputs with > 2 decimal places are rejected with HTTP 400.

---

## 9. Formula Verification Examples

### Example A: Clean Division
- `emergencyFund`: `30000.00`
- `essentialMonthlyExpenses`: `10000.00`
- **Calculations**:
  - `30000 / 10000` = `3.0`
  - `floor(3.0)` = `3`
  - `30000 - (3 * 10000)` = `0.00`
- **Output**:
  - `survivalMonths`: `"3.00"`
  - `wholeMonthsCovered`: `3`
  - `remainingAmount`: `"0.00"`

### Example B: Fractional Ratio
- `emergencyFund`: `25000.00`
- `essentialMonthlyExpenses`: `10000.00`
- **Calculations**:
  - `25000 / 10000` = `2.5`
  - `floor(2.5)` = `2`
  - `25000 - (2 * 10000)` = `5000.00`
- **Output**:
  - `survivalMonths`: `"2.50"`
  - `wholeMonthsCovered`: `2`
  - `remainingAmount`: `"5000.00"`

### Example C: Zero Emergency Fund
- `emergencyFund`: `0.00`
- `essentialMonthlyExpenses`: `10000.00`
- **Calculations**:
  - `0 / 10000` = `0.0`
  - `floor(0.0)` = `0`
  - `0 - (0 * 10000)` = `0.00`
- **Output**:
  - `survivalMonths`: `"0.00"`
  - `wholeMonthsCovered`: `0`
  - `remainingAmount`: `"0.00"`

### Example D: Repeating Decimal Division
- `emergencyFund`: `10000.00`
- `essentialMonthlyExpenses`: `3000.00`
- **Calculations**:
  - `10000 / 3000` = `3.333333...`
  - `ROUND_HALF_UP(3.333333..., 2)` = `"3.33"`
  - `floor(3.333333...)` = `3`
  - `10000 - (3 * 3000)` = `1000.00`
- **Output**:
  - `survivalMonths`: `"3.33"`
  - `wholeMonthsCovered`: `3`
  - `remainingAmount`: `"1000.00"`

---

## 10. Educational Neutral Wording Rules

The API output MUST remain 100% neutral and educational.

### Approved Template Wording
- **English**: `"Under the entered values and stated assumptions, the emergency fund covers approximately {survivalMonths} months of essential monthly expenses."`
- **Thai**: `"ภายใต้ตัวเลขและสมมติฐานที่กรอก เงินสำรองรองรับค่าใช้จ่ายจำเป็นได้ประมาณ {survivalMonths} เดือน"`

### Prohibited Terminology (Strictly Forbidden)
The API MUST NEVER include any of the following judgmental or advice terms:
- `safe` / `unsafe`
- `enough` / `insufficient`
- `recommended` / `should save` / `should invest`
- `good` / `bad`
- `financially secure` / `vulnerable`
- `guaranteed` / `forecast`

---

## 11. Authoritative Educational Sources

The simulation metadata MUST link to recognized educational sources:

```json
[
  {
    "title": "Emergency Financial Kit & Guidelines",
    "publisher": "Consumer Financial Protection Bureau (CFPB)",
    "url": "https://www.consumerfinance.gov/consumer-tools/educator-resources/your-money-your-goals/",
    "accessedAt": "2026-07-24"
  }
]
```

---

## 12. Persistence Contract

When `POST /simulations/:simulationId/runs` is invoked:
1. `userId` is taken from `req.user.userId` (authenticated JWT).
2. `simulationId` is verified against `Simulation` table.
3. An immutable snapshot record is created in `SimulationRun`:
   - `userId`: `req.user.userId`
   - `simulationId`: `simulation.id`
   - `inputs`: Normalized DTO `{"emergencyFund": "25000.00", "essentialMonthlyExpenses": "10000.00"}`
   - `outputs`: Calculated result object, statements, assumptions, limitations, disclaimer, sources, calculationVersion.
4. **Idempotency**: Repeated identical requests create separate `SimulationRun` records with unique UUIDs and `createdAt` timestamps.
5. **No Side Effects**: Executing a run does NOT alter User level, unlock Elements, create DiscoveryEvents, or mutate Workspaces.

---

## 13. Authorization & Privacy

- `GET /simulations`, `GET /simulations/:simulationId`, `POST /simulations/:simulationId/runs` are all protected by JWT.
- `userId` CANNOT be passed in request headers or body.
- No endpoint exposes private run records of other users.

---

## 14. Error Matrix

| HTTP Status | Condition | Message / Details |
|---|---|---|
| `401 Unauthorized` | Missing or invalid Bearer JWT | `Unauthorized` |
| `401 Unauthorized` | User status is `INACTIVE` or `BANNED` | `User account is not active` |
| `400 Bad Request` | Missing required field | `emergencyFund must be a number` |
| `400 Bad Request` | Non-numeric or non-finite value | `emergencyFund must be a finite number` |
| `400 Bad Request` | `emergencyFund < 0` | `emergencyFund must not be less than 0` |
| `400 Bad Request` | `essentialMonthlyExpenses <= 0` | `essentialMonthlyExpenses must be greater than 0` |
| `400 Bad Request` | Input exceeds 2 decimal places | `emergencyFund must not have more than 2 decimal places` |
| `400 Bad Request` | Input exceeds technical max `100000000.00` | `emergencyFund must not exceed 100000000.00` |
| `400 Bad Request` | Unexpected extra body property | `property extraField should not exist` |
| `404 Not Found` | Simulation ID does not exist | `Simulation not found` |
| `404 Not Found` | Simulation status is `INACTIVE` | `Simulation not found` |
| `500 Internal Error`| Database/server unexpected failure | `Internal server error` |

---

## 15. Seed Contract

A single seed master record for `Simulation` will be seeded in `prisma/seed/content/simulations.ts`:

```typescript
export const SURVIVAL_MONTHS_SIMULATION_SEED_DATA = {
  slug: 'survival-months',
  name: 'Survival Months',
  thaiName: 'จำนวนเดือนที่เงินสำรองรองรับค่าใช้จ่าย',
  description: 'Estimates how many months an emergency fund covers essential expenses during job loss.',
  status: 'ACTIVE',
  linkedElementSlug: 'emergency-fund', // resolved to linkedElementId dynamically during seed
};
```

---

## 16. Swagger OpenAPI Contract

- **Tag**: `Simulations`
- **Security Scheme**: `access-token` (HTTP Bearer JWT)
- **DTO Schemas**:
  - `SurvivalMonthsRunRequestDto`
  - `SimulationSummaryResponseDto`
  - `SimulationDetailResponseDto`
  - `SimulationRunResponseDto`
  - Envelope DTOs (`SimulationsEnvelopeDto`, `SimulationDetailEnvelopeDto`, `SimulationRunEnvelopeDto`)

---

## 17. Future NestJS Feature Structure

```text
src/simulation/
├── simulation.module.ts
├── simulation.controller.ts
├── simulation.service.ts
├── simulation-calculator.service.ts
├── dto/
│   ├── survival-months-run-request.dto.ts
│   ├── simulation-summary-response.dto.ts
│   ├── simulation-detail-response.dto.ts
│   └── simulation-run-response.dto.ts
├── openapi/
│   └── simulation-openapi.decorators.ts
├── constants/
│   └── simulation.constants.ts
├── types/
│   └── simulation-result.type.ts
└── validators/
    └── decimal-precision.validator.ts
```

---

## 18. Scenarios Runtime Acceptance Matrix (44 Scenarios)

### List & Detail (1-7)
1. `GET /simulations` with valid JWT returns array containing ACTIVE `survival-months`.
2. `GET /simulations` array is ordered deterministically by `name ASC`.
3. `GET /simulations` excludes INACTIVE simulations.
4. `GET /simulations/:simulationId` with valid ID returns full detail object.
5. `GET /simulations/:simulationId` with non-existent UUID returns 404 (`Simulation not found`).
6. `GET /simulations/:simulationId` with INACTIVE simulation returns same 404 (`Simulation not found`).
7. `GET /simulations` without JWT returns 401 Unauthorized.

### Valid Calculations (8-18)
8. `POST .../runs` with `30000` & `10000` returns `survivalMonths: "3.00"`, `wholeMonthsCovered: 3`, `remainingAmount: "0.00"`.
9. `POST .../runs` with `25000` & `10000` returns `survivalMonths: "2.50"`, `wholeMonthsCovered: 2`, `remainingAmount: "5000.00"`.
10. `POST .../runs` with `0` & `10000` returns `survivalMonths: "0.00"`, `wholeMonthsCovered: 0`, `remainingAmount: "0.00"`.
11. `POST .../runs` with `10000` & `3000` returns `survivalMonths: "3.33"`, `wholeMonthsCovered: 3`, `remainingAmount: "1000.00"`.
12. `POST .../runs` with `25000.50` & `10000.25` calculates correct 2-decimal rounded result.
13. Repeated identical run creates distinct `SimulationRun` with unique UUID.
14. Returned input snapshot formats numbers to 2-decimal strings (`"25000.00"`).
15. Result uses frozen `ROUND_HALF_UP` rounding mode.
16. Neutral statement contains formatted calculation value (`"2.50"`).
17. Response includes frozen `assumptions` and `limitations` arrays.
18. Response includes `calculationVersion: "survival-months-v1"`.

### Invalid Input Validation (19-28)
19. Missing `emergencyFund` returns 400 Bad Request.
20. Missing `essentialMonthlyExpenses` returns 400 Bad Request.
21. Negative `emergencyFund` (`-100`) returns 400 Bad Request.
22. Zero `essentialMonthlyExpenses` (`0`) returns 400 Bad Request.
23. Negative `essentialMonthlyExpenses` (`-500`) returns 400 Bad Request.
24. Inputs with > 2 decimal places (`25000.555`) returns 400 Bad Request.
25. Non-numeric inputs (`"twenty thousand"`) returns 400 Bad Request.
26. Null values (`null`) returns 400 Bad Request.
27. Unexpected extra body field (`foo: "bar"`) returns 400 Bad Request.
28. Input exceeding technical max (`100000001.00`) returns 400 Bad Request.

### Persistence Verification (29-37)
29. Valid run creates exactly 1 record in `SimulationRun`.
30. Persisted run `userId` matches authenticated JWT user ID.
31. Normalized input snapshot is stored in `SimulationRun.inputs`.
32. Output snapshot is stored in `SimulationRun.outputs`.
33. `calculationVersion` is stored in `SimulationRun.outputs`.
34. Validation failure creates 0 records in `SimulationRun`.
35. Non-existent simulation ID creates 0 records in `SimulationRun`.
36. Persistence failure rolls back transaction without partial record.
37. Modifying Simulation master metadata does not alter historical `SimulationRun` snapshots.

### Security & Response Integrity (38-44)
38. Passing `userId` in body is stripped or rejected by ValidationPipe.
39. Response DTO excludes `userId`.
40. Response DTO excludes internal admin config.
41. Response DTO excludes `passwordHash`.
42. Swagger OpenAPI contains 3 simulation endpoints under `Simulations` tag.
43. Public simulation endpoints require `access-token` Bearer security.
44. Existing Swagger routes (`/health`, `/auth/*`, `/elements`, `/craft`, `/workspaces/*`) remain fully functional.

---

## 19. Implementation Sequence for Future Task (`P10_1B`)

1. Request & Response DTOs + Validation Pipe Validators
2. Seed Data module for `survival-months` Simulation master record
3. Deterministic `SimulationCalculatorService` (integer cent arithmetic + `ROUND_HALF_UP`)
4. `SimulationService` (CRUD + Persistence)
5. `SimulationController` with Swagger decorators
6. Integration into `SimulationModule` and `AppModule`
7. Compiled NestAppModule Runtime Acceptance Verification (44/44 passed)
8. Static Quality Gates (`tsc`, `eslint`, `build`, `unit`, `e2e`)
9. Post-commit audit

---

## 20. Frozen Decisions

- **Slug**: `survival-months`
- **Formula**: `survivalMonths = emergencyFund / essentialMonthlyExpenses`
- **Rounding Mode**: `ROUND_HALF_UP` to 2 decimal places
- **Arithmetic Engine**: Minor unit integer arithmetic (cents)
- **Technical Max**: `100,000,000.00`
- **Prisma Schema Changes**: `NONE` (0 migrations)
- **AI/LLM Usage**: `0%` (Deterministic only)
- **Advice Terms**: Strictly prohibited

---

## 21. Open Questions

- None. All requirements, validations, formulas, formulas examples, rounding modes, error matrices, and schema mappings have been 100% resolved and frozen.

---

## 22. Final Readiness Verdict

**SAFE_TO_IMPLEMENT_SIMULATION**: **YES**  
The contract is complete, fully specified, internally consistent, and ready for implementation in task `P10_SIMULATION_API_1B_IMPLEMENT_SURVIVAL_MONTHS_001`.
