# Craft API Runtime Acceptance Report

- **TASK_ID**: `P6_CRAFT_API_9A_POSTMAN_RUNTIME_ACCEPTANCE_001`
- **COMMIT**: `b87e45ebee2164f3275a0f43c79c52d6c3335395`
- **TIMESTAMP**: 2026-07-23T14:53:00+07:00
- **ENVIRONMENT**: Local Node.js + NestJS HTTP Server
- **DATABASE**: Local PostgreSQL (`DATABASE_URL`)
- **BACKEND PORT**: 3000 (`http://localhost:3000`)
- **STATUS**: PASS (WITH DEFERRED EVENT ROLLBACK)

---

## 1. Scenario Results Matrix

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

---

## 2. PostgreSQL Row Counts & Data Integrity

- **Pre-Test State**: `Users`: 0, `UserElements`: 0, `DiscoveryEvents`: 0, `CraftRecipes`: 22, `Elements`: 36, `DiscoveryDetails`: 36
- **Post-Test State**: `Users`: 2 (Isolated Test Accounts), `UserElements`: 2, `DiscoveryEvents`: 6
- **Test User 1 (`f74df612-a7d5-4541-ba6a-cde98c56bb7b`)**:
  - `UserElements`: 1 (`Net Cash Flow`)
  - `DiscoveryEvents`: 5 (2 `NO_RECIPE`, 3 `SUCCESS`)
- **Test User 2 (`Concurrent User`)**:
  - `UserElements`: 1 (`Net Cash Flow`)
  - `DiscoveryEvents`: 2 (`SUCCESS`)
- **Unrelated Master Data**: 0 modifications to `Elements`, `CraftRecipes`, or `DiscoveryDetails`.

---

## 3. Concurrency & Race Condition Verification

- `Promise.all` executed 2 simultaneous HTTP `POST /craft` requests for the same recipe output element for a clean test user.
- Both HTTP requests succeeded with HTTP 200 OK without raw `P2002` constraint errors or HTTP 500 status.
- Response 1 returned `isNewDiscovery: true`.
- Response 2 returned `isNewDiscovery: false`.
- PostgreSQL database confirmed exactly **1 `UserElement`** created and **2 `SUCCESS` `DiscoveryEvents`** recorded.

---

## 4. Preservation Policy

- Policy: `PRESERVE_TEST_EVIDENCE`
- The 2 test user accounts and their associated `UserElement` and `DiscoveryEvent` rows remain preserved in local PostgreSQL development database for demonstration and audit evidence.
