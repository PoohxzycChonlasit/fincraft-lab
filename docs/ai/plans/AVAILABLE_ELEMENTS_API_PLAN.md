# Available Elements Read API Plan & Frozen Contract

- **TASK_ID**: `P7_ELEMENT_API_1A_FIX_AVAILABLE_ELEMENTS_CONTRACT_001`
- **CONTRACT_MARKER**: `FROZEN_AVAILABLE_ELEMENTS_READ_API_CONTRACT_V1`
- **STATUS**: FROZEN_PLANNING (CORRECTED)
- **EXPECTED STARTING COMMIT**: `18a7e95c915d6a06b14cc2fb911c81dfb40b7f74`
- **PROJECT ROOT**: `C:\devnest 101\single-project\fincraft-lab`
- **BACKEND ROOT**: `C:\devnest 101\single-project\fincraft-lab\fincraft-lab-api`
- **POSTGRESQL ACCEPTANCE**: `PLANNED / NOT_EXECUTED_IN_THIS_CONTRACT_TASK`

---

## Revision & Correction History

- **v1.0 (Initial Freeze)**: `P7_ELEMENT_API_1A_FREEZE_AVAILABLE_ELEMENTS_READ_CONTRACT_001` (`18a7e95c915d6a06b14cc2fb911c81dfb40b7f74`).
- **v1.1 (Correction)**: `P7_ELEMENT_API_1A_FIX_AVAILABLE_ELEMENTS_CONTRACT_001`. Corrected disabled User error message (`User account is disabled`), added Category status filter rule (`category.status = ACTIVE`), clarified deterministic category-first ordering semantics, updated Seed Starter facts (14 Starters in standard seed), removed special master-data 500 error wording, and explicitly marked PostgreSQL endpoint runtime acceptance as planned/not executed in contract planning task.

---

## 1. Problem Statement & Canvas Requirement

The FinCraft Lab Canvas requires an authenticated read endpoint to load all Elements currently available to the active User. The returned palette will populate the user's Element Inventory on the Crafting Canvas, allowing them to drag and combine elements to discover new financial concepts.

Available Elements consist strictly of:
1. **Active Starter Elements in Active Categories**: Globally available to every active user (`Element.isStarter = true` AND `Element.status = ContentStatus.ACTIVE` AND `Element.category.status = ActiveStatus.ACTIVE`). Under the standard project Seed, the User receives every active Starter Element (14 Starters across active categories).
2. **Active Discovered Elements in Active Categories**: Non-starter elements unlocked by the authenticated user (`Element.isStarter = false` AND `Element.status = ContentStatus.ACTIVE` AND `Element.category.status = ActiveStatus.ACTIVE` AND referenced by `UserElement` with `userId = authenticatedUserId`).

---

## 2. Frozen API Contract Specification

### 2.1 Route & Authentication

- **HTTP Method**: `GET`
- **Route Path**: `/elements`
- **Authentication**: Protected by global `AuthGuard`.
- **User ID Source**: Extracted exclusively from JWT payload `user.sub` via `@CurrentUser() user: AccessTokenPayload`.
- **Param Restrictions**: Client MUST NOT pass `userId` via Query, Params, or Body.

### 2.2 User Status Authorization

Aligned with frozen Craft Auth contract:
- `ACTIVE` User Status: Granted access -> Returns `HTTP 200 OK`.
- `INACTIVE` User Status: Denied -> Returns `HTTP 403 Forbidden` (`User account is disabled`).
- `BANNED` User Status: Denied -> Returns `HTTP 403 Forbidden` (`User account is disabled`).
- Missing / Invalid JWT: Denied -> Returns `HTTP 401 Unauthorized`.

---

## 3. Availability Rules & Query Responsibilities

The service layer must query Prisma using an OR condition or combined query that enforces:

1. **Starter Inclusion**: `Element.isStarter == true` AND `Element.status == ContentStatus.ACTIVE` AND `Element.category.status == ActiveStatus.ACTIVE`.
2. **Discovered Inclusion**: `Element.isStarter == false` AND `Element.status == ContentStatus.ACTIVE` AND `Element.category.status == ActiveStatus.ACTIVE` AND `Element.userElements` contains a record with `userId == authenticatedUserId`.
3. **Inactive Element Exclusion**: Any Element with `Element.status != ContentStatus.ACTIVE` MUST be excluded, regardless of starter status or `UserElement` rows.
4. **Inactive Category Exclusion**: Any Element whose Category has `category.status != ActiveStatus.ACTIVE` MUST be excluded, even if the Element itself is active or unlocked.
5. **Other-User Isolation**: `UserElement` rows belonging to other users MUST NOT grant access to non-starter elements for the current user.
6. **Deduplication**: The result set MUST NOT contain duplicate elements under any circumstance.

---

## 4. Response Shape & Envelope

### 4.1 Response Envelope

Controller wraps service result in standard `{ data: ... }` envelope:

```json
{
  "data": [
    {
      "id": "6a8ae571-2411-4052-af4d-0055f3fb68e2",
      "name": "Net Cash Flow",
      "slug": "net-cash-flow",
      "emoji": "💵",
      "iconUrl": null,
      "elementType": "CONCEPT",
      "isStarter": false,
      "category": {
        "id": "b3e21a44-5d67-4e92-81f1-28a6f43702b1",
        "name": "Cash Flow & Liquidity",
        "sortOrder": 1
      }
    }
  ]
}
```

### 4.2 Field Exposure & Privacy Exclusions

- **Exposed Public Fields**:
  - `id`: String (UUID)
  - `name`: String
  - `slug`: String
  - `emoji`: String
  - `iconUrl`: String | null
  - `elementType`: `ElementType` enum string (`BASE`, `CONCEPT`, `BEHAVIOR`, `RISK`, `SCENARIO`, `TOOL`, `DISCOVERY`)
  - `isStarter`: Boolean
  - `category`: Public Category object:
    - `id`: String (UUID)
    - `name`: String
    - `sortOrder`: Number
- **Excluded Private & Internal Metadata**:
  - `status` (internal `ContentStatus` enum)
  - `categoryId` (raw foreign key replaced by public `category` object)
  - `createdAt`, `updatedAt`
  - `discoveryDetail`, `userElements`, `craftRecipeInputs`, `producedRecipes`

---

## 5. Deterministic Ordering Semantics

To ensure consistent layout on the frontend Canvas, the result array MUST be deterministically sorted in Prisma / Database:

1. **Category `sortOrder` ASC**: Categories are ordered first by their category `sortOrder`.
2. **Element `isStarter` DESC**: Within each Category, Starter Elements appear before non-Starter (discovered) Elements.
3. **Element `name` ASC**: Within each group (Starter vs non-Starter within a Category), Elements are sorted alphabetically by name.

---

## 6. Empty State, Error Behavior & Zero-Write Guarantee

- **Empty State**: An active user receives all active Starter Elements in active Categories. If no available Elements exist in database, returns `{ "data": [] }` with `HTTP 200 OK` (missing starter data does not produce a special 500 error).
- **Database Query Errors**: Unhandled database infrastructure failures produce standard `HTTP 500 Internal Server Error`.
- **Zero-Write Guarantee**: `GET /elements` MUST perform zero database mutations. No `UserElement` writes, no `DiscoveryEvent` writes, no workspace writes, and no `lastViewedAt` updates.

---

## 7. Error Matrix

| Scenario | HTTP Status | Exception / Response |
| :--- | :--- | :--- |
| Missing / Invalid Token | 401 | `UnauthorizedException` |
| `INACTIVE` User Account | 403 | `ForbiddenException('User account is disabled')` |
| `BANNED` User Account | 403 | `ForbiddenException('User account is disabled')` |
| Unhandled Database Error | 500 | `InternalServerErrorException` |

---

## 8. Proposed File Map & Implementation Sequence

### 8.1 Proposed Feature Structure (`src/element/`)

```text
src/element/
├── element.controller.ts                   # Thin HTTP Controller (GET /elements)
├── element.service.ts                      # Business logic & Prisma read query
├── element.module.ts                       # NestJS feature module importing DatabaseModule
└── types/
    └── available-element-response.type.ts  # Explicit TypeScript response interfaces
```

### 8.2 Architectural Boundaries

- **Controller**: `ElementController` receives `@CurrentUser() user`, checks user status via `UserService` or `ElementService`, calls `elementService.getAvailableElements(user.sub)`, and wraps response as `{ data: result }`.
- **Service**: `ElementService` queries `PrismaService.element.findMany` with OR condition (`isStarter` OR `userElements` match) plus `status = ACTIVE` and `category: { status: ACTIVE }`, returning mapped public `AvailableElementResponse[]`.
- **Module**: `ElementModule` wires `DatabaseModule` & `UserModule` (if needed for user status validation), declares `ElementController`, and provides `ElementService`. Does NOT export `ElementService` unless an external consumer requires it.

---

## 9. Future Runtime Acceptance Scenarios (P7_ELEMENT_API_1B / 1C)

1. **Unauthenticated** -> `HTTP 401 Unauthorized`.
2. **ACTIVE New User** -> Active Starters from active Categories only (`HTTP 200 OK`).
3. **ACTIVE User with Unlocked Active Non-Starter** -> Starters + that specific element included (`HTTP 200 OK`).
4. **Other User's Unlocked Element** -> Excluded from current user's response (`HTTP 200 OK`).
5. **Inactive Element** -> Excluded even if `isStarter = true` or `UserElement` exists (`HTTP 200 OK`).
6. **Element in Inactive Category** -> Excluded even if `Element.status = ACTIVE` or `UserElement` exists (`HTTP 200 OK`).
7. **INACTIVE User** -> `HTTP 403 Forbidden` (`User account is disabled`).
8. **BANNED User** -> `HTTP 403 Forbidden` (`User account is disabled`).
9. **Deterministic Category-First Ordering** -> Sorted by `category.sortOrder ASC`, `isStarter DESC`, `name ASC`.
10. **Public Leakage Audit** -> Zero `categoryId`, `status`, or internal metadata exposed.
11. **Zero-Write Verification** -> DB row counts unchanged before and after `GET /elements`.
12. **Existing Auth & Craft Behavior Unchanged** -> Intact.

---

## 10. Explicit Out of Scope

- Element creation / update / deletion (Admin CRUD).
- DiscoveryDetail deep lesson endpoint (`GET /elements/:id/detail`).
- Craft recipe listing or recipe hints.
- Search, filtering by category, or pagination.
- Workspace state / canvas node positioning.
- Simulation / community / AI generation.
