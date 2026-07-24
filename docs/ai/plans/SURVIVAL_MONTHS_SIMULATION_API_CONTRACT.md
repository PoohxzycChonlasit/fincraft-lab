# SURVIVAL_MONTHS_SIMULATION_API_CONTRACT.md — FinCraft Lab MVP Simulation Contract

FROZEN_SURVIVAL_MONTHS_SIMULATION_API_CONTRACT_V1

## 1. Scope

This contract freezes the exact technical specification for the first FinCraft Lab MVP Simulation:

- **Public Simulation Slug**: `survival-months`
- **Database Canonical Key**: `Simulation.simulationType = "survival-months"`
- **English Name**: Survival Months
- **Thai Name**: จำนวนเดือนที่เงินสำรองรองรับค่าใช้จ่าย
- **Concept**: Emergency Fund + Job Loss = Survival Months
- **Purpose**: Estimate how many months an emergency fund could cover essential monthly expenses under explicit fixed user-supplied assumptions.

The contract covers:
- REST API Surface (`GET /simulations`, `GET /simulations/:simulationId`, `POST /simulations/:simulationId/runs`)
- Request DTO & Input Validation Rules
- Response Envelope DTOs
- Exact Calculation Formula, Minor-Unit Integer Precision & Rounding Rules
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

## 4. Prisma Analysis & Storage Fit Matrix

An inspection of `prisma/schema.prisma` confirms that all database operations fit into existing models `Simulation` and `SimulationRun` without database migration or column addition.

### 4.1 Master Metadata Storage Strategy (`CODE_REGISTRY_FIT`)

- **`Simulation.description`**: Defined as plain text educational description (`DIRECT_FIT_AS_TEXT`). It is NEVER parsed as JSON or used for structured storage.
- **Typed Code Registry**: Structured educational metadata is provided by a feature-local TypeScript definition (`src/simulation/constants/survival-months.definition.ts`).
- **Code Registry Responsibilities**: Owns the public slug (`survival-months`), Thai name (`จำนวนเดือนที่เงินสำรองรองรับค่าใช้จ่าย`), summary, input definitions, formula explanation, calculation version (`survival-months-v1`), assumptions, limitations, authoritative source metadata, and disclaimer.
- **Database Column Myth**: No database column named `slug` exists in `Simulation`. The public response field `slug` maps directly from `simulation.simulationType`.

### 4.2 Field-by-Field Prisma Fit Matrix

| Contract Field | Existing Model | Existing Field | Prisma Type | Nullable | Classification | Gap / Notes | Recommended Action |
|---|---|---|---|---|---|---|---|
| Simulation ID | `Simulation` | `id` | `String` (UUID) | No | `DIRECT_FIT` | None | Use directly |
| Public Slug | `Simulation` | `simulationType` | `String` | No (Unique) | `DIRECT_FIT` | Value: `"survival-months"`, exposed as `slug` | Map `slug = simulationType` |
| English Name | `Simulation` | `name` | `String` | No | `DIRECT_FIT` | Value: `"Survival Months"` | Use directly |
| Plain Text Description | `Simulation` | `description` | `String` | No | `DIRECT_FIT_AS_TEXT` | Plain text educational description | Use directly as plain text |
| Active Status | `Simulation` | `status` | `ActiveStatus` | No | `DIRECT_FIT` | Enum: `ACTIVE`, `INACTIVE` | Use directly |
| Linked Element ID | `Simulation` | `linkedElementId` | `String` | Yes | `DIRECT_FIT` | Optional link to Element | Link to supported Element |
| Run ID | `SimulationRun` | `id` | `String` (UUID) | No | `DIRECT_FIT` | None | Generated automatically |
| User ID | `SimulationRun` | `userId` | `String` (UUID) | No | `DIRECT_FIT` | Foreign key to `User` | Derived from Bearer JWT |
| Simulation ID | `SimulationRun` | `simulationId` | `String` (UUID) | No | `DIRECT_FIT` | Foreign key to `Simulation` | Required URL param |
| Input Snapshot | `SimulationRun` | `inputs` | `Json` | No | `JSON_FIT` | Stores normalized input snapshot (`emergencyFund`, `essentialMonthlyExpenses`) | Immutable JSON object |
| Output Snapshot | `SimulationRun` | `outputs` | `Json` | No | `JSON_FIT` | Stores complete historical calculation result, neutral statements, assumptions, limitations, disclaimer, calculationVersion, sources | Immutable JSON object |
| Run Created Time | `SimulationRun` | `createdAt` | `DateTime` | No | `DIRECT_FIT` | Default `@default(now())` | Generated automatically |
| Thai Name | Code Registry | N/A | Code Constant | N/A | `CODE_REGISTRY_FIT` | Owned by code definition | Map from registry |
| Input Definitions | Code Registry | N/A | Code Constant | N/A | `CODE_REGISTRY_FIT` | Owned by code definition | Map from registry |
| Formula Explanation | Code Registry | N/A | Code Constant | N/A | `CODE_REGISTRY_FIT` | Owned by code definition | Map from registry |
| Assumptions | Code Registry | N/A | Code Constant | N/A | `CODE_REGISTRY_FIT` | Owned by code definition | Map from registry |
| Limitations | Code Registry | N/A | Code Constant | N/A | `CODE_REGISTRY_FIT` | Owned by code definition | Map from registry |
| Sources | Code Registry | N/A | Code Constant | N/A | `CODE_REGISTRY_FIT` | Owned by code definition | Map from registry |
| Disclaimer | Code Registry | N/A | Code Constant | N/A | `CODE_REGISTRY_FIT` | Owned by code definition | Map from registry |
| Calculation Version| Code Registry | N/A | Code Constant | N/A | `CODE_REGISTRY_FIT` | Owned by code definition | Map from registry |
| Neutral Statements | Derived | N/A | Runtime String | N/A | `DERIVED` | Formatted at calculation time | Store in `outputs` JSON |
| Numeric Results | Derived | N/A | Runtime Types | N/A | `DERIVED` | Formatted at calculation time | Store in `outputs` JSON |
| Database `slug` col | N/A | N/A | N/A | N/A | `NOT_SUPPORTED` | No `slug` column exists | Do not query database for `slug` |
| JSON in description | N/A | N/A | N/A | N/A | `NOT_SUPPORTED` | `description` is plain text | Do not parse `description` as JSON |

**Verdict**: **0 schema migration required for MVP**.

---

## 5. Supported Simulation Registry & Fail-Closed Behavior

The MVP backend uses a fail-closed registry pattern:
1. The code registry contains exactly one supported simulation slug: `"survival-months"`.
2. `GET /simulations`: Queries database for `status = ACTIVE` records AND filters to those whose `simulationType` is present in the code registry. Database records with unsupported `simulationType` are NOT exposed.
3. `GET /simulations/:simulationId`: Requires BOTH a database record with `status = ACTIVE` AND a matching code registry definition.
4. `POST /simulations/:simulationId/runs`: Requires BOTH a database record with `status = ACTIVE` AND a matching code registry definition.
5. **Fail-Closed 404 Response**: Any request targeting a missing, `INACTIVE`, or unsupported Simulation ID MUST return `HTTP 404 Not Found` with message `"Simulation not found"`.

---

## 6. Exact HTTP Endpoint Contract

All endpoints are protected by `JwtAuthGuard` and require an `ACTIVE` authenticated user.

### 6.1 GET /simulations
- **Description**: List all supported ACTIVE Simulation templates.
- **Auth**: Protected (`access-token` HTTP Bearer JWT).
- **Query Params**: None.
- **Success Response**: `200 OK` with `{ "data": [ SimulationSummaryResponseDto ] }`.
- **Deterministic Ordering**: Ordered by `name ASC`, then `id ASC`.

### 6.2 GET /simulations/:simulationId
- **Description**: Get public educational metadata for a specific supported ACTIVE Simulation.
- **Auth**: Protected (`access-token` HTTP Bearer JWT).
- **Params**: `simulationId` (UUID v4 format).
- **Success Response**: `200 OK` with `{ "data": SimulationDetailResponseDto }`.
- **Error Behavior**:
  - Malformed UUID v4 -> `400 Bad Request` (`simulationId must be a valid UUID v4`)
  - Missing, `INACTIVE`, or unsupported Simulation -> `404 Not Found` (`Simulation not found`)

### 6.3 POST /simulations/:simulationId/runs
- **Description**: Validate input, execute deterministic calculation, persist immutable `SimulationRun`, and return result.
- **Auth**: Protected (`access-token` HTTP Bearer JWT).
- **Params**: `simulationId` (UUID v4 format).
- **Request Body**: `SurvivalMonthsRunRequestDto`.
- **Success Response**: `201 Created` with `{ "data": SimulationRunResponseDto }`.
- **Error Behavior**:
  - Missing or invalid JWT -> `401 Unauthorized`
  - Inactive User -> `401 Unauthorized`
  - Malformed UUID v4 -> `400 Bad Request` (`simulationId must be a valid UUID v4`)
  - Validation failure -> `400 Bad Request`
  - Missing, `INACTIVE`, or unsupported Simulation -> `404 Not Found` (`Simulation not found`)
  - No 409 Conflict behavior exists for this endpoint.

---

## 7. Request DTO Contract & User ID Security

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
   - **Decimal Constraint**: Maximum 2 decimal places. Inputs with > 2 decimal places MUST be REJECTED with `400 Bad Request`.
   - **Disallowed**: `NaN`, `Infinity`, `-Infinity`, `null`, `undefined`, boolean, string, array, object.

2. `essentialMonthlyExpenses`
   - **Required**: Yes
   - **Type**: Number (numeric, finite)
   - **Constraint**: `@GreaterThanZero` (`> 0`), `@Max(100000000.00)`
   - **Decimal Constraint**: Maximum 2 decimal places. Inputs with > 2 decimal places MUST be REJECTED with `400 Bad Request`.
   - **Disallowed**: `0`, negative values, `NaN`, `Infinity`, `-Infinity`, `null`, `undefined`, boolean, string, array, object.

### User ID Security & ValidationPipe Rules
- **JWT Source Only**: `userId` is NEVER accepted from the request body. The authenticated user ID comes exclusively from the JWT payload (`req.user.userId`).
- **Strict Property Rejection**: Global `ValidationPipe` is configured with `whitelist: true` and `forbidNonWhitelisted: true`.
- **Extra `userId` Property**: If a client sends a `userId` property in the request body, it is **REJECTED** immediately with `HTTP 400 Bad Request` (`property userId should not exist`). It is NEVER ignored or silently stripped.

### Technical Maximum & Anti-Abuse Bound
- **Technical Maximum**: `100,000,000.00` (100 Million monetary units).
- **Maximum Minor Units**: `10,000,000,000` (10 Billion minor units, where 1 monetary unit = 100 minor units).
- **Safe-Integer Justification**: `10,000,000,000` is far below JavaScript `Number.MAX_SAFE_INTEGER` (`9,007,199,254,740,991`), guaranteeing exact integer arithmetic without precision loss.
- **Anti-Abuse Purpose**: Technical precision and anti-abuse bound only; not financial advice.

---

## 8. Response DTO Contracts

### 8.1 `SimulationSummaryResponseDto`
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

### 8.2 `SimulationDetailResponseDto`
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
      "title": "An Essential Guide to Building an Emergency Fund",
      "publisher": "Consumer Financial Protection Bureau (CFPB)",
      "url": "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/",
      "accessedAt": "2026-07-24"
    }
  ],
  "disclaimer": "Education and simulation only. Not financial advice.",
  "calculationVersion": "survival-months-v1",
  "isActive": true
}
```

### 8.3 `SimulationRunResponseDto` (Envelope: `{ "data": ... }`)
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
    "sources": [
      {
        "title": "An Essential Guide to Building an Emergency Fund",
        "publisher": "Consumer Financial Protection Bureau (CFPB)",
        "url": "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/",
        "accessedAt": "2026-07-24"
      }
    ],
    "calculationVersion": "survival-months-v1",
    "createdAt": "2026-07-24T11:15:00.000Z"
  }
}
```

---

## 9. Authoritative Decimal Arithmetic & Rounding Algorithm

### Minor Units Definition
For this contract, 1 public monetary unit contains 100 minor units.
Inputs are normalized to integer minor units before calculation to eliminate binary floating-point inaccuracy:
- $\text{fundMinor} = \text{Math.round}(\text{emergencyFund} \times 100)$
- $\text{expenseMinor} = \text{Math.round}(\text{essentialMonthlyExpenses} \times 100)$

### Authoritative Formulas
1. **Whole Months Covered**:
   $$\text{wholeMonthsCovered} = \left\lfloor \frac{\text{fundMinor}}{\text{expenseMinor}} \right\rfloor$$

2. **Remaining Minor Units**:
   $$\text{remainingMinor} = \text{fundMinor} - (\text{wholeMonthsCovered} \times \text{expenseMinor})$$
   $$\text{remainingAmount} = \left(\frac{\text{remainingMinor}}{100}\right).\text{toFixed}(2)$$

3. **Survival Hundredths (`ROUND_HALF_UP`)**:
   $$\text{survivalHundredths} = \left\lfloor \frac{(\text{fundMinor} \times 200) + \text{expenseMinor}}{\text{expenseMinor} \times 2} \right\rfloor$$
   $$\text{survivalMonths} = \left(\frac{\text{survivalHundredths}}{100}\right).\text{toFixed}(2)$$

---

## 10. Formula Verification Examples

### Example A: Clean Division
- `emergencyFund`: `30000.00` (`fundMinor = 3000000`)
- `essentialMonthlyExpenses`: `10000.00` (`expenseMinor = 1000000`)
- **Calculations**:
  - `wholeMonthsCovered`: `floor(3000000 / 1000000)` = `3`
  - `remainingMinor`: `3000000 - (3 * 1000000)` = `0` -> `"0.00"`
  - `survivalHundredths`: `floor((600000000 + 1000000) / 2000000)` = `300` -> `"3.00"`
- **Output**: `survivalMonths: "3.00"`, `wholeMonthsCovered: 3`, `remainingAmount: "0.00"`

### Example B: Fractional Ratio
- `emergencyFund`: `25000.00` (`fundMinor = 2500000`)
- `essentialMonthlyExpenses`: `10000.00` (`expenseMinor = 1000000`)
- **Calculations**:
  - `wholeMonthsCovered`: `floor(2500000 / 1000000)` = `2`
  - `remainingMinor`: `2500000 - (2 * 1000000)` = `500000` -> `"5000.00"`
  - `survivalHundredths`: `floor((500000000 + 1000000) / 2000000)` = `250` -> `"2.50"`
- **Output**: `survivalMonths: "2.50"`, `wholeMonthsCovered: 2`, `remainingAmount: "5000.00"`

### Example C: Zero Emergency Fund
- `emergencyFund`: `0.00` (`fundMinor = 0`)
- `essentialMonthlyExpenses`: `10000.00` (`expenseMinor = 1000000`)
- **Output**: `survivalMonths: "0.00"`, `wholeMonthsCovered: 0`, `remainingAmount: "0.00"`

### Example D: Repeating Decimal Division
- `emergencyFund`: `10000.00` (`fundMinor = 1000000`)
- `essentialMonthlyExpenses`: `3000.00` (`expenseMinor = 300000`)
- **Calculations**:
  - `wholeMonthsCovered`: `floor(1000000 / 300000)` = `3`
  - `remainingMinor`: `1000000 - (3 * 300000)` = `100000` -> `"1000.00"`
  - `survivalHundredths`: `floor((200000000 + 300000) / 600000)` = `floor(200300000 / 600000)` = `333` -> `"3.33"`
- **Output**: `survivalMonths: "3.33"`, `wholeMonthsCovered: 3`, `remainingAmount: "1000.00"`

### Example E: Explicit Half-Up Boundary (0.025 -> 0.03)
- `emergencyFund`: `1005.00` (`fundMinor = 100500`)
- `essentialMonthlyExpenses`: `200.00` (`expenseMinor = 20000`)
- **Calculations**:
  - `100500 / 20000` = `5.025`
  - `wholeMonthsCovered`: `floor(100500 / 20000)` = `5`
  - `remainingMinor`: `100500 - (5 * 20000)` = `500` -> `"5.00"`
  - `survivalHundredths`: `floor((20100000 + 20000) / 40000)` = `floor(20120000 / 40000)` = `503` -> `"5.03"` (`ROUND_HALF_UP`)
- **Output**: `survivalMonths: "5.03"`, `wholeMonthsCovered: 5`, `remainingAmount: "5.00"`

---

## 11. Educational Neutral Wording Rules

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

## 12. Authoritative Educational Source Metadata

The simulation detail and run output MUST include exact authoritative educational source metadata:

```json
[
  {
    "title": "An Essential Guide to Building an Emergency Fund",
    "publisher": "Consumer Financial Protection Bureau (CFPB)",
    "url": "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/",
    "accessedAt": "2026-07-24"
  }
]
```

- **Purpose**: Provides official educational context only.
- **Rule**: Must NOT be presented as personalized financial advice or as the origin of a universal recommended emergency-fund amount.

---

## 13. Persistence Contract

When `POST /simulations/:simulationId/runs` is invoked:
1. `userId` is taken from `req.user.userId` (authenticated JWT).
2. `simulationId` is verified against database and code registry.
3. An immutable snapshot record is created in `SimulationRun`:
   - `userId`: `req.user.userId`
   - `simulationId`: `simulation.id`
   - `inputs`: Normalized DTO `{"emergencyFund": "25000.00", "essentialMonthlyExpenses": "10000.00"}`
   - `outputs`: Complete historical snapshot (`calculationVersion`, `result`, `statementEn`, `statementTh`, `assumptions`, `limitations`, `disclaimer`, `sources`).
4. **Historical Immutability**: Future edits to the code definition MUST NOT mutate or reinterpret existing `SimulationRun` records.
5. **Idempotency**: Repeated identical requests create separate `SimulationRun` records with unique UUIDs and `createdAt` timestamps.
6. **No Side Effects**: Executing a run does NOT alter User level, unlock Elements, create DiscoveryEvents, or mutate Workspaces.

---

## 14. Authorization & Privacy

- `GET /simulations`, `GET /simulations/:simulationId`, `POST /simulations/:simulationId/runs` are all protected by JWT.
- `userId` CANNOT be passed in request headers or body.
- No endpoint exposes private run records of other users.

---

## 15. Error Matrix

| HTTP Status | Condition | Message / Details |
|---|---|---|
| `401 Unauthorized` | Missing or invalid Bearer JWT | `Unauthorized` |
| `401 Unauthorized` | User status is `INACTIVE` or `BANNED` | `User account is not active` |
| `400 Bad Request` | Malformed UUID v4 parameter | `simulationId must be a valid UUID v4` |
| `400 Bad Request` | Missing required field | `emergencyFund must be a number` |
| `400 Bad Request` | Non-numeric or non-finite value | `emergencyFund must be a finite number` |
| `400 Bad Request` | `emergencyFund < 0` | `emergencyFund must not be less than 0` |
| `400 Bad Request` | `essentialMonthlyExpenses <= 0` | `essentialMonthlyExpenses must be greater than 0` |
| `400 Bad Request` | Input exceeds 2 decimal places | `emergencyFund must not have more than 2 decimal places` |
| `400 Bad Request` | Input exceeds technical max `100000000.00` | `emergencyFund must not exceed 100000000.00` |
| `400 Bad Request` | Extra property in body (e.g. `userId`, `extraField`) | `property userId should not exist` |
| `404 Not Found` | Simulation ID does not exist | `Simulation not found` |
| `404 Not Found` | Simulation status is `INACTIVE` | `Simulation not found` |
| `404 Not Found` | Simulation `simulationType` is unsupported | `Simulation not found` |
| `500 Internal Error`| Database/server unexpected failure | `Internal server error` |

---

## 16. Seed Contract

A single seed master record for `Simulation` will be seeded using existing Prisma fields in `prisma/seed/content/simulations.ts`:

```typescript
export const SURVIVAL_MONTHS_SIMULATION_SEED_DATA = {
  simulationType: 'survival-months',
  name: 'Survival Months',
  description: 'Calculates runway in months by dividing total emergency savings by essential monthly living costs.',
  status: 'ACTIVE',
  linkedElementSlug: 'emergency-fund', // resolved to linkedElementId dynamically during seed
};
```

---

## 17. Swagger OpenAPI Contract

- **Tag**: `Simulations`
- **Security Scheme**: `access-token` (HTTP Bearer JWT)
- **DTO Schemas**:
  - `SurvivalMonthsRunRequestDto`
  - `SimulationSummaryResponseDto`
  - `SimulationDetailResponseDto`
  - `SimulationRunResponseDto`
  - Envelope DTOs (`SimulationsEnvelopeDto`, `SimulationDetailEnvelopeDto`, `SimulationRunEnvelopeDto`)

---

## 18. Future NestJS Feature Structure

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
│   ├── simulation.constants.ts
│   └── survival-months.definition.ts
├── types/
│   └── simulation-result.type.ts
└── validators/
    └── decimal-precision.validator.ts
```

---

## 19. Scenarios Runtime Acceptance Matrix (44 Scenarios)

### List & Detail (Scenarios 1-7)
1. `GET /simulations` with valid JWT returns array containing ACTIVE `survival-months`.
2. `GET /simulations` array is ordered deterministically by `name ASC`, then `id ASC`.
3. `GET /simulations` excludes INACTIVE or unsupported simulations.
4. `GET /simulations/:simulationId` with valid ID returns full detail object.
5. `GET /simulations/:simulationId` with non-existent UUID returns 404 (`Simulation not found`).
6. `GET /simulations/:simulationId` with INACTIVE or unsupported simulation returns same 404 (`Simulation not found`).
7. `GET /simulations` without JWT returns 401 Unauthorized.

### Valid Calculations (Scenarios 8-18)
8. `POST .../runs` with `30000` & `10000` returns `survivalMonths: "3.00"`, `wholeMonthsCovered: 3`, `remainingAmount: "0.00"`.
9. `POST .../runs` with `25000` & `10000` returns `survivalMonths: "2.50"`, `wholeMonthsCovered: 2`, `remainingAmount: "5000.00"`.
10. `POST .../runs` with `0` & `10000` returns `survivalMonths: "0.00"`, `wholeMonthsCovered: 0`, `remainingAmount: "0.00"`.
11. `POST .../runs` with `10000` & `3000` returns `survivalMonths: "3.33"`, `wholeMonthsCovered: 3`, `remainingAmount: "1000.00"`.
12. `POST .../runs` with `1005.00` & `200.00` returns `survivalMonths: "5.03"` (`ROUND_HALF_UP`), `wholeMonthsCovered: 5`, `remainingAmount: "5.00"`.
13. Repeated identical run creates distinct `SimulationRun` with unique UUID.
14. Returned input snapshot formats numbers to 2-decimal strings (`"25000.00"`).
15. Result uses frozen `ROUND_HALF_UP` rounding mode on minor units.
16. Neutral statement contains formatted calculation value (`"2.50"`).
17. Response includes frozen `assumptions` and `limitations` arrays from code registry.
18. Response includes `calculationVersion: "survival-months-v1"`.

### Invalid Input Validation (Scenarios 19-28)
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

### Persistence Verification (Scenarios 29-37)
29. Valid run creates exactly 1 record in `SimulationRun`.
30. Persisted run `userId` matches authenticated JWT user ID.
31. Normalized input snapshot is stored in `SimulationRun.inputs`.
32. Complete historical output snapshot is stored in `SimulationRun.outputs`.
33. `calculationVersion` is stored in `SimulationRun.outputs`.
34. Validation failure creates 0 records in `SimulationRun`.
35. Non-existent, inactive, or unsupported simulation ID creates 0 records in `SimulationRun`.
36. Persistence failure rolls back transaction without partial record.
37. Modifying Simulation code definition does not alter historical `SimulationRun` snapshots.

### Security & Response Integrity (Scenarios 38-44)
38. Passing `userId` in body is REJECTED by ValidationPipe with 400 Bad Request.
39. Response DTO excludes `userId`.
40. Response DTO excludes internal admin config.
41. Response DTO excludes `passwordHash`.
42. Swagger OpenAPI contains 3 simulation endpoints under `Simulations` tag.
43. Public simulation endpoints require `access-token` Bearer security.
44. Existing Swagger routes (`/health`, `/auth/*`, `/elements`, `/craft`, `/workspaces/*`) remain fully functional.

---

## 20. Implementation Sequence for Future Task (`P10_1B`)

1. Request & Response DTOs + Validation Pipe Validators
2. Typed code definition (`survival-months.definition.ts`) + Seed Data module
3. Deterministic `SimulationCalculatorService` (minor unit integer arithmetic + `ROUND_HALF_UP`)
4. `SimulationService` (Fail-closed Registry + Persistence)
5. `SimulationController` with Swagger decorators
6. Integration into `SimulationModule` and `AppModule`
7. Compiled NestAppModule Runtime Acceptance Verification (44/44 passed)
8. Static Quality Gates (`tsc`, `eslint`, `build`, `unit`, `e2e`)
9. Post-commit audit

---

## 21. Frozen Decisions

- **Public Slug**: `survival-months` (mapped from `simulation.simulationType`)
- **Master Storage**: Database master + Typed Code Definition (`CODE_REGISTRY_FIT`)
- **Description**: Plain text educational description (`DIRECT_FIT_AS_TEXT`)
- **Formula**: `survivalMonths = emergencyFund / essentialMonthlyExpenses`
- **Rounding Mode**: `ROUND_HALF_UP` on integer minor units (2 decimal places)
- **Technical Max**: `100,000,000.00` (`10,000,000,000` minor units, safely below `MAX_SAFE_INTEGER`)
- **Extra `userId` Property**: REJECTED with 400 Bad Request
- **Prisma Schema Changes**: `NONE` (0 migrations)
- **AI/LLM Usage**: `0%` (Deterministic only)
- **Advice Terms**: Strictly prohibited

---

## 22. Open Questions

- None. All 10 reconciliation items have been 100% resolved and frozen.

---

## 23. Final Readiness Verdict

**SAFE_TO_IMPLEMENT_SIMULATION**: **YES**  
The contract is complete, fully reconciled, internally consistent, and ready for implementation in task `P10_SIMULATION_API_1B_IMPLEMENT_SURVIVAL_MONTHS_001`.
