# FROZEN_CRAFT_API_CONTRACT_V1

## Goal & Scope

This document specifies the frozen contract for **Craft API V1** (`POST /craft`) in **FinCraft Lab**.

Crafting is the core discovery mechanism of FinCraft Lab. Authenticated users combine two financial Elements (e.g. `income` + `expense`) to produce a new Discovery Element or receive a `NO_RECIPE` outcome.

This is a documentation-only specification task. No application source code, NestJS modules, controllers, services, DTOs, schema migrations, or database modifications are performed in this task.

---

## Actual Schema Contract Analysis

Analysis of the 15-model Prisma 7.8 schema (`prisma/schema.prisma`):

| Model | Key Fields & Types | Unique Constraints | Relation / Foreign Key | Nullability | Invariant Owner |
|---|---|---|---|---|---|
| **User** | `id` (UUID), `role` (`UserRole`), `status` (`UserStatus`) | `@unique email` | `userElements`, `discoveryEvents` | All non-null | PostgreSQL / AuthGuard |
| **Element** | `id` (UUID), `slug` (String), `isStarter` (Boolean), `status` (`ContentStatus`) | `@unique slug` | `category`, `discoveryDetail`, `craftRecipeInputs`, `producedRecipes` | `iconUrl` nullable | PostgreSQL / Prisma |
| **DiscoveryDetail**| `id` (UUID), `elementId` (UUID), `shortDescription`, `realLesson`, `realityLevel`, `safetyLabel`, `sources` (Json) | `@unique elementId` | `element` | `example`, `possibleBenefit`, `possibleTradeoff`, `hiddenRisk`, `worksWhen`, `becomesDifficultWhen`, `whatChangesOutcome` nullable | PostgreSQL / Content Seed |
| **CraftRecipe** | `id` (UUID), `outputElementId` (UUID), `inputHash` (String), `ruleType` (`CraftRuleType`), `status` (`ContentStatus`) | `@unique inputHash` | `outputElement`, `inputs`, `discoveryEvents` | All non-null | PostgreSQL / Shared Helper |
| **CraftRecipeInput**| `id` (UUID), `recipeId` (UUID), `elementId` (UUID), `inputOrder` (Int) | `@@unique([recipeId, inputOrder])` | `recipe`, `element` | All non-null | PostgreSQL / Seed Validation |
| **UserElement** | `id` (UUID), `userId` (UUID), `elementId` (UUID), `isFavorite` (Boolean), `unlockedAt` (DateTime) | `@@unique([userId, elementId])` | `user`, `element` | `lastViewedAt` nullable | PostgreSQL / CraftService |
| **DiscoveryEvent**| `id` (UUID), `userId` (UUID), `recipeId` (UUID?), `resultElementId` (UUID?), `inputElementIds` (Json), `resultStatus` (`DiscoveryResultStatus`), `discoveredAt` (DateTime) | None | `user`, `recipe`, `resultElement` | `recipeId`, `resultElementId` nullable | PostgreSQL / CraftService |

### Schema Capability for NO_RECIPE DiscoveryEvent

Inspection of `DiscoveryEvent` and `DiscoveryResultStatus` confirms full native support for `NO_RECIPE`:
- `recipeId`: `null` (Schema permits nullable `recipeId String? @db.Uuid`)
- `resultElementId`: `null` (Schema permits nullable `resultElementId String? @db.Uuid`)
- `inputElementIds`: `[elementIdA, elementIdB]` (JSON array of the two input UUIDs)
- `resultStatus`: `DiscoveryResultStatus.NO_RECIPE` (`DiscoveryResultStatus` enum contains `SUCCESS`, `NO_RECIPE`, `BLOCKED`, `ERROR`)
- `discoveredAt`: `now()`

**Conclusion**: Zero schema changes are required. `DiscoveryEvent` natively records all successful, rediscovery, and `NO_RECIPE` Craft attempts.

---

## Endpoint Decision

- **Route**: `POST /craft`
- **Authentication**: Required (`Bearer <JWT>` token via `AuthGuard`)
- **Success HTTP Status**: `200 OK` for all valid Craft attempts (including `DISCOVERY` and `NO_RECIPE`)
- **Error HTTP Statuses**: `400 Bad Request` (Validation errors), `401 Unauthorized` (Invalid/missing token), `403 Forbidden` (Input not owned/available), `404 Not Found` (Unknown element), `500 Internal Server Error` (Unexpected database/system failure)

---

## Request Contract & DTO

### Request Body (`CraftRequestDto`)

```json
{
  "inputElementIds": [
    "e3b0c442-98fc-11ee-b9d1-0242ac120002",
    "f4c1d553-98fc-11ee-b9d1-0242ac120003"
  ]
}
```

### Validation Rules
1. `inputElementIds` must be an Array.
2. `inputElementIds.length` must equal exactly 2 (`@ArrayMinSize(2)`, `@ArrayMaxSize(2)`).
3. Each item must be a valid UUID string (`@IsUUID('4', { each: true })`).
4. The two IDs must be distinct (`inputElementIds[0] !== inputElementIds[1]`). Self-crafting is rejected with `400 Bad Request`.
5. Order-independent: Client sends any order; backend normalizes using SHA-256 helper `calculateCraftInputHash`.
6. Client **cannot** send `inputHash`, `outputElementId`, `recipeId`, or `userId`. `userId` is extracted securely from the verified Access Token (`@CurrentUser()`).

---

## Input Availability Policy (Option A)

Following the approved product design:

1. **Starter Elements** (`isStarter: true`, `status: ACTIVE`):
   - Globally available to all authenticated users.
   - No `UserElement` record is required in database for a Starter Element to be used as a craft input.
2. **Discovery Elements** (`isStarter: false`, `status: ACTIVE`):
   - Requires an active `UserElement` row for the authenticated user (`userId === currentUserId` AND `elementId === inputElementId`).
   - If user does not own a non-Starter Element, the request is rejected with `403 Forbidden` ("Input Element is not unlocked by user").
3. **Inactive or Unknown Elements**:
   - If an Element ID does not exist in `elements` table: `404 Not Found`.
   - If an Element has `status !== ContentStatus.ACTIVE`: `400 Bad Request` ("Input Element is not active").

---

## Recipe Lookup Policy

1. Extract `inputElementIdA` and `inputElementIdB` from DTO.
2. Call pure shared helper `calculateCraftInputHash(inputElementIdA, inputElementIdB)` from `src/common/craft/calculate-craft-input-hash.ts`.
3. Query `CraftRecipe` from database by `@unique inputHash`:
   - Filter `ruleType === CraftRuleType.COMMUTATIVE`
   - Filter `status === ContentStatus.ACTIVE`
   - Include `outputElement` and its attached `discoveryDetail`
4. If no matching `CraftRecipe` exists (or recipe is inactive/non-commutative):
   - Result is `NO_RECIPE`.
   - No internal recipe data, hidden status, or recipe existence is leaked.

---

## Outcome & Response Contract

Discriminated union response wrapped in standard `{ data: ... }` envelope:

### 1. New Discovery Response (`isNewDiscovery: true`) — `200 OK`

```json
{
  "data": {
    "outcome": "DISCOVERY",
    "isNewDiscovery": true,
    "element": {
      "id": "a1b2c3d4-0000-0000-0000-000000000001",
      "name": "Cash Flow",
      "slug": "cash-flow",
      "iconUrl": null,
      "emoji": "💸",
      "elementType": "CONCEPT",
      "isStarter": false
    },
    "detail": {
      "shortDescription": "Money moving in and out of your financial life over time.",
      "realLesson": "Positive cash flow gives you flexibility; negative cash flow creates pressure regardless of income size.",
      "example": "Earning 40,000 THB and spending 32,000 THB leaves +8,000 THB monthly cash flow.",
      "possibleBenefit": "Builds buffer for savings and emergency response.",
      "possibleTradeoff": "Requires ongoing tracking and adjustment.",
      "hiddenRisk": "Ignoring small daily leaks that silently drain net cash flow.",
      "worksWhen": "Income exceeds necessary and discretionary expenses consistently.",
      "becomesDifficultWhen": "Fixed obligations consume most of income.",
      "whatChangesOutcome": "Reducing recurring leaks or increasing income streams.",
      "realityLevel": "GROUNDED",
      "safetyLabel": "EDUCATION_ONLY",
      "sources": [
        {
          "title": "Cash Flow Management Basics",
          "organization": "Bank of Thailand",
          "url": "https://www.bot.or.th/th/satang-story/financial-planning/cash-flow.html"
        }
      ]
    }
  }
}
```

### 2. Rediscovery Response (`isNewDiscovery: false`) — `200 OK`

Returned when the user crafts a valid recipe whose output Element they already unlocked previously:

```json
{
  "data": {
    "outcome": "DISCOVERY",
    "isNewDiscovery": false,
    "element": {
      "id": "a1b2c3d4-0000-0000-0000-000000000001",
      "name": "Cash Flow",
      "slug": "cash-flow",
      "iconUrl": null,
      "emoji": "💸",
      "elementType": "CONCEPT",
      "isStarter": false
    },
    "detail": {
      "shortDescription": "Money moving in and out of your financial life over time.",
      "realLesson": "Positive cash flow gives you flexibility; negative cash flow creates pressure regardless of income size.",
      "example": "Earning 40,000 THB and spending 32,000 THB leaves +8,000 THB monthly cash flow.",
      "possibleBenefit": "Builds buffer for savings and emergency response.",
      "possibleTradeoff": "Requires ongoing tracking and adjustment.",
      "hiddenRisk": "Ignoring small daily leaks that silently drain net cash flow.",
      "worksWhen": "Income exceeds necessary and discretionary expenses consistently.",
      "becomesDifficultWhen": "Fixed obligations consume most of income.",
      "whatChangesOutcome": "Reducing recurring leaks or increasing income streams.",
      "realityLevel": "GROUNDED",
      "safetyLabel": "EDUCATION_ONLY",
      "sources": [
        {
          "title": "Cash Flow Management Basics",
          "organization": "Bank of Thailand",
          "url": "https://www.bot.or.th/th/satang-story/financial-planning/cash-flow.html"
        }
      ]
    }
  }
}
```

### 3. No Recipe Response — `200 OK`

Returned when two valid inputs produce no active recipe:

```json
{
  "data": {
    "outcome": "NO_RECIPE"
  }
}
```

---

## Rediscovery & Concurrency Policy

### Rediscovery Policy
- `UserElement` table with `@@unique([userId, elementId])` is the single source of truth for ownership.
- First time unlocking an Output Element: `UserElement` row is created, `isNewDiscovery` is `true`.
- Second or subsequent craft of an owned Output Element: No new `UserElement` row is created, `isNewDiscovery` is `false`.
- A `DiscoveryEvent` with `resultStatus: SUCCESS` is recorded for every valid attempt (both new discovery and rediscovery).

### Concurrency Policy
- If a user sends two concurrent Craft requests that produce the same Output Element:
  - Database constraint `@@unique([userId, elementId])` guarantees exactly one transaction successfully inserts the `UserElement` row (`isNewDiscovery: true`).
  - The concurrent transaction catches unique collision error (Prisma `P2002`), handles it safely, and returns `isNewDiscovery: false`.
  - Both requests complete with `200 OK` and record their own `DiscoveryEvent`.

---

## Discovery Event Logging Policy

Every valid Craft request produces exactly one `DiscoveryEvent` within the transaction:

1. **DISCOVERY (First Discovery & Rediscovery)**:
   - `userId`: `currentUserId`
   - `recipeId`: `recipe.id`
   - `resultElementId`: `recipe.outputElementId`
   - `inputElementIds`: `[inputElementIdA, inputElementIdB]`
   - `resultStatus`: `DiscoveryResultStatus.SUCCESS`
   - `discoveredAt`: `now()`

2. **NO_RECIPE**:
   - `userId`: `currentUserId`
   - `recipeId`: `null`
   - `resultElementId`: `null`
   - `inputElementIds`: `[inputElementIdA, inputElementIdB]`
   - `resultStatus`: `DiscoveryResultStatus.NO_RECIPE`
   - `discoveredAt`: `now()`

3. **Invalid / Unauthorized Requests (400, 401, 403, 404)**:
   - No `DiscoveryEvent` is recorded (prevents database spam from invalid requests).

---

## Transaction Boundary

All database operations for a Craft request run inside a single Prisma transaction (`prisma.$transaction`):

1. Verify input availability in DB (read).
2. Calculate hash & query `CraftRecipe` (read).
3. If `NO_RECIPE`:
   - Create `DiscoveryEvent` (`resultStatus: NO_RECIPE`).
   - Commit transaction.
   - Return `{ data: { outcome: "NO_RECIPE" } }`.
4. If `DISCOVERY`:
   - Upsert / Create `UserElement` (`userId`, `outputElementId`).
   - Create `DiscoveryEvent` (`resultStatus: SUCCESS`, `recipeId`, `resultElementId`).
   - Commit transaction.
   - Return `{ data: { outcome: "DISCOVERY", isNewDiscovery, element, detail } }`.
5. If any step fails or throws an unhandled error:
   - Entire transaction rolls back (no partial `UserElement` or orphan `DiscoveryEvent`).

---

## Complete Error Contract Table

| HTTP Status | Error Code / Type | Condition / Trigger | Message / Response Envelope |
|---|---|---|---|
| **400** | `BAD_REQUEST` | Body missing or not JSON | `{ "statusCode": 400, "message": "Invalid request body" }` |
| **400** | `BAD_REQUEST` | `inputElementIds` not an array or length !== 2 | `{ "statusCode": 400, "message": "inputElementIds must contain exactly two element IDs" }` |
| **400** | `BAD_REQUEST` | Items in `inputElementIds` are not valid UUIDs | `{ "statusCode": 400, "message": "Each inputElementId must be a valid UUID" }` |
| **400** | `BAD_REQUEST` | `inputElementIds[0] === inputElementIds[1]` | `{ "statusCode": 400, "message": "Input element IDs must be distinct" }` |
| **400** | `BAD_REQUEST` | Input Element `status !== ContentStatus.ACTIVE` | `{ "statusCode": 400, "message": "Input element is not active" }` |
| **401** | `UNAUTHORIZED` | Missing or invalid `Authorization: Bearer <JWT>` header | `{ "statusCode": 401, "message": "Invalid or missing authentication token" }` |
| **403** | `FORBIDDEN` | Authenticated user is `BANNED` or `INACTIVE` | `{ "statusCode": 403, "message": "User account is disabled" }` |
| **403** | `FORBIDDEN` | Non-Starter input Element not unlocked by user | `{ "statusCode": 403, "message": "Input element is not unlocked by user" }` |
| **404** | `NOT_FOUND` | Input Element ID does not exist in database | `{ "statusCode": 404, "message": "Element not found" }` |
| **200** | Success Union | Valid pair produces no recipe | `{ "data": { "outcome": "NO_RECIPE" } }` |
| **200** | Success Union | Valid pair produces output | `{ "data": { "outcome": "DISCOVERY", "isNewDiscovery": boolean, "element": {}, "detail": {} } }` |
| **500** | `INTERNAL_SERVER_ERROR` | Unexpected DB/system error | `{ "statusCode": 500, "message": "Internal server error" }` |

---

## Controller & Service Responsibilities

### `CraftController` (`src/craft/craft.controller.ts`)
- Route: `POST /craft`
- Security: `@UseGuards(AuthGuard)`
- Parameters: `@CurrentUser() user: AccessTokenPayload`, `@Body() dto: CraftRequestDto`
- Responsibility: HTTP request handling, DTO validation parsing, delegating to `CraftService.craft(user.sub, dto)`, returning `{ data: result }`.

### `CraftService` (`src/craft/craft.service.ts`)
- Injectable NestJS service.
- Imports `calculateCraftInputHash` from `src/common/craft/calculate-craft-input-hash.ts`.
- Responsibility:
  1. Validate input availability for `userId`.
  2. Call `calculateCraftInputHash(idA, idB)`.
  3. Execute Prisma `$transaction`:
     - Query `CraftRecipe`.
     - Process `NO_RECIPE` vs `DISCOVERY`.
     - Manage `UserElement` creation (`isNewDiscovery`).
     - Record `DiscoveryEvent`.
  4. Transform and map output entity to public DTO contract.

---

## 16-Scenario Acceptance Matrix

| # | Scenario | Request Inputs | HTTP Status | Response Outcome | UserElement Effect | DiscoveryEvent Effect | Transaction Result |
|---|---|---|---|---|---|---|---|
| 1 | New Discovery | 2 unlocked inputs, valid recipe | 200 OK | `DISCOVERY` (`isNewDiscovery: true`) | Created 1 row | Created 1 row (`SUCCESS`) | Committed |
| 2 | Rediscovery | 2 unlocked inputs, already owned output | 200 OK | `DISCOVERY` (`isNewDiscovery: false`) | Unchanged | Created 1 row (`SUCCESS`) | Committed |
| 3 | Reversed Input Order | Inputs reversed `[B, A]` | 200 OK | Same outcome as `[A, B]` | Same as `[A, B]` | Created 1 row (`SUCCESS`) | Committed |
| 4 | Valid Pair, No Recipe | 2 unlocked inputs, no recipe | 200 OK | `NO_RECIPE` | Unchanged | Created 1 row (`NO_RECIPE`) | Committed |
| 5 | Duplicate Input IDs | `[A, A]` | 400 Bad Request | Error DTO | Unchanged | None | None |
| 6 | Invalid UUID Format | `["abc", "def"]` | 400 Bad Request | Error DTO | Unchanged | None | None |
| 7 | Array Size !== 2 | `["uuid1"]` or 3 UUIDs | 400 Bad Request | Error DTO | Unchanged | None | None |
| 8 | Unknown Input Element | Non-existent UUID | 404 Not Found | Error DTO | Unchanged | None | None |
| 9 | Inactive Input Element | `status: INACTIVE` | 400 Bad Request | Error DTO | Unchanged | None | None |
| 10 | Non-Starter Not Owned | User lacks `UserElement` | 403 Forbidden | Error DTO | Unchanged | None | None |
| 11 | Inactive Recipe | Recipe `status: INACTIVE` | 200 OK | `NO_RECIPE` | Unchanged | Created 1 row (`NO_RECIPE`) | Committed |
| 12 | Unauthenticated | Missing / invalid JWT | 401 Unauthorized | Error DTO | Unchanged | None | None |
| 13 | Concurrent Discovery | 2 requests race same discovery | Both 200 OK | 1 true, 1 false | Exactly 1 row created | 2 rows created (`SUCCESS`) | Both Committed |
| 14 | Event Log Failure | DB error on `DiscoveryEvent` | 500 Internal Error | Error DTO | Rolled back | Rolled back | Rolled back |
| 15 | Missing Output Detail | Recipe output missing detail | 500 Internal Error | Error DTO | Rolled back | Rolled back | Rolled back |
| 16 | User Account Disabled | User status `BANNED` | 403 Forbidden | Error DTO | Unchanged | None | None |

---

## Safety & Educational Rules

- **Education & Simulation Only**: Response metadata includes `safetyLabel: EDUCATION_ONLY` and `realityLevel: GROUNDED`.
- **Not Financial Advice**: No financial recommendations, buy/sell advice, price predictions, or commercial advice are generated.
- **Privacy & Security**: Response excludes internal database keys (`inputHash`, `recipeId`), password hashes, and private user details.
