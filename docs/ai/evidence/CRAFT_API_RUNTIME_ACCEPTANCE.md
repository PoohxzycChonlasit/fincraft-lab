# Craft API Runtime Acceptance Report

- **TASK_ID**: `P6_CRAFT_API_9C_CORRECT_RUNTIME_EVIDENCE_001`
- **COMMIT**: `2318a050f33c1a3e02f128ded0af456d5cd8235b` (Reconciled)
- **TIMESTAMP**: 2026-07-23T15:05:00+07:00
- **ENVIRONMENT**: Local Node.js + NestJS HTTP Application Test Suite
- **DATABASE**: Local PostgreSQL (`DATABASE_URL`)
- **BACKEND PORT**: 3000 (`http://localhost:3000`)
- **CLASSIFICATION**:
  - Runtime HTTP / PostgreSQL Acceptance: **PASS_WITH_DEFERRED_ROLLBACK**
  - Postman / Newman Acceptance: **PENDING**
  - Evidence Reconciliation: **CORRECTED**

---

## 1. Execution Method & Tooling Status

- **Postman Collection Execution**: `NOT_RUN`
- **Newman CLI Execution**: `NOT_RUN` (Newman CLI was unavailable in the tested environment)
- **Live HTTP Test Suite**: `RUN` (22 HTTP scenarios executed against live NestJS HTTP application)
- **Scenarios Executed**: 22
- **Scenarios Passed**: 21 Passed, 1 Deferred (`C2 Inactive Element`)
- **Postman Acceptance Status**: `PENDING` (Requires explicit Newman or Postman Desktop execution when CLI is available)

---

## 2. Scenario Results Matrix

| Scenario Group | Scenario | Request Details | Expected HTTP | Actual HTTP | Database Side Effects | Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A. Route & Auth** | A1 | `POST /craft` (No Authorization) | 401 | 401 | 0 UserElements, 0 DiscoveryEvents | PASS |
| | A2 | `POST /craft` (Bad Token) | 401 | 401 | 0 UserElements, 0 DiscoveryEvents | PASS |
| | A3 | `GET /craft` | 404 | 404 | 0 UserElements, 0 DiscoveryEvents | PASS |
| **B. DTO Validation** | B1 | `{}` (Empty Body) | 400 | 400 | 0 UserElements, 0 DiscoveryEvents | PASS |
| | B2 | `{ wrongField: [] }` | 400 | 400 | 0 UserElements, 0 DiscoveryEvents | PASS |
| | B3 | `{ inputElementIds: "not-array" }` | 400 | 400 | 0 UserElements, 0 DiscoveryEvents | PASS |
| | B4 | 1 UUID in array | 400 | 400 | 0 UserElements, 0 DiscoveryEvents | PASS |
| | B5 | 3 UUIDs in array | 400 | 400 | 0 UserElements, 0 DiscoveryEvents | PASS |
| | B6 | Duplicate UUIDs in array | 400 | 400 | 0 UserElements, 0 DiscoveryEvents | PASS |
| | B7 | Invalid UUID strings | 400 | 400 | 0 UserElements, 0 DiscoveryEvents | PASS |
| | B8 | Injected extra field (`userId`) | 400 | 400 | 0 UserElements, 0 DiscoveryEvents | PASS |
| **C. Element Access** | C1 | Unknown v4 UUID | 404 | 404 | 0 UserElements, 0 DiscoveryEvents | PASS |
| | C2 | Inactive Element | 400 | N/A | 0 UserElements, 0 DiscoveryEvents | DEFERRED_NOT_AVAILABLE |
| | C3 | Locked non-Starter Element | 403 | 403 | 0 UserElements, 0 DiscoveryEvents | PASS |
| **D. NO_RECIPE** | D1 | Forward Starter Pair (No Recipe) | 200 | 200 | 1 `NO_RECIPE` DiscoveryEvent | PASS |
| | D2 | Reversed Starter Pair (No Recipe) | 200 | 200 | 1 `NO_RECIPE` DiscoveryEvent | PASS |
| **E. First Discovery** | E1 | Forward Starter Pair (Recipe Match) | 200 | 200 | 1 `UserElement`, 1 `SUCCESS` Event (`isNewDiscovery: true`) | PASS |
| **F. Rediscovery** | F1 | Forward Same Pair | 200 | 200 | 1 `SUCCESS` Event (`isNewDiscovery: false`), 0 extra `UserElement` | PASS |
| | F2 | Reversed Same Pair | 200 | 200 | 1 `SUCCESS` Event (`isNewDiscovery: false`), 0 extra `UserElement` | PASS |
| **G. Leakage Audit** | G | Exposing public element/detail fields | 200 | 200 | 0 Internal Metadata Leaked (`passwordHash`, `userId`, `recipeId`, etc.) | PASS |
| **H. User Status** | H1 | INACTIVE User status | 403 | 403 | 0 UserElements, 0 DiscoveryEvents | PASS |
| | H2 | BANNED User status | 403 | 403 | 0 UserElements, 0 DiscoveryEvents | PASS |
| **J. Concurrency** | J | `Promise.all` Overlap First Discovery | 200 / 200 | 200 / 200 | Exactly 1 `UserElement`, 2 `SUCCESS` Events (1 `isNewDiscovery: true`, 1 `false`) | PASS |

> *Note on Scenario C2*: All 36 seeded Elements in PostgreSQL have `status = 'ACTIVE'`. No inactive element exists in standard seed data; C2 is correctly classified as `DEFERRED_NOT_AVAILABLE`.

---

## 3. PostgreSQL Database Reconciliation & Preserved Users

- **Initial Baseline**: `Users`: 0, `UserElements`: 0, `DiscoveryEvents`: 0, `CraftRecipes`: 22, `Elements`: 36, `DiscoveryDetails`: 36
- **Final Preserved Evidence**: `Users`: 2, `UserElements`: 2, `DiscoveryEvents`: 7
  - `SUCCESS` Events: 5
  - `NO_RECIPE` Events: 2
  - Duplicate `UserElements`: 0

> *Reconciliation Note on Event Count*: The original task console log printed an intermediate count of 6 prior to scenario J completion. Database reconciliation confirms the true aggregate total is **7 DiscoveryEvents** across the 2 test users.

### Detailed User Breakdown

1. **Runtime Test User 1**:
   - **User ID**: `f74df612-a7d5-4541-ba6a-cde98c56bb7b`
   - **Email Identifier**: `runtime-craft-user-1721715000@fincraft.lab`
   - **Status**: `ACTIVE`
   - **UserElements**: 1 (`Net Cash Flow` - `6a8ae571-2411-4052-af4d-0055f3fb68e2`)
   - **DiscoveryEvents Total**: 5
     - `SUCCESS`: 3 (E1 First Discovery, F1 Rediscovery, F2 Reverse Rediscovery)
     - `NO_RECIPE`: 2 (D1 Forward, D2 Reverse)

2. **Runtime Test User 2 (Concurrency User)**:
   - **User ID**: Dedicated UUID generated for Scenario J
   - **Email Identifier**: `runtime-craft-user2-1721715000@fincraft.lab`
   - **Status**: `ACTIVE`
   - **UserElements**: 1 (`Net Cash Flow` - `6a8ae571-2411-4052-af4d-0055f3fb68e2`)
   - **DiscoveryEvents Total**: 2
     - `SUCCESS`: 2 (Promise.all Concurrent Request 1 & Request 2)
     - `NO_RECIPE`: 0

---

## 4. Concurrency & Rollback Status

- **Concurrency Verification**: `Promise.all` executed 2 simultaneous HTTP `POST /craft` requests for the same recipe output element for User 2. Both requests returned HTTP `200 OK` (one with `isNewDiscovery: true` and one with `isNewDiscovery: false`). Database confirmed exactly **1 `UserElement`** created and **2 `SUCCESS` `DiscoveryEvents`** recorded without raw `P2002` constraint errors or HTTP 500 status.
- **Rollback Status**: Real PostgreSQL fault injection is `DEFERRED` (no targeted event-write failure injected to avoid modifying production source or schema). Deterministic transaction rollback evidence remains verified in unit/integration test suites.

---

## 5. Preservation Policy

- Policy: `PRESERVE_TEST_EVIDENCE`
- The 2 test user accounts and their associated `UserElement` and `DiscoveryEvent` rows remain preserved in local PostgreSQL development database for demonstration and audit evidence.
