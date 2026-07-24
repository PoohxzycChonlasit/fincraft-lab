# ADMIN_CONTENT_API_CONTRACT.md — Frozen Admin Content API Contract (v1 MVP)

FROZEN MARKER:
FROZEN_ADMIN_CONTENT_API_CONTRACT_V1

---

## 1. Scope & Objectives

### 1.1 Objective
Freeze the exact API, data mapping, authorization, validation, error handling, Swagger, and acceptance contract for the **Admin Content API** (`/admin/elements`).

The Admin Content API empowers administrators (`ADMIN`, `SUPER_ADMIN`) to manage the educational discovery catalogue of FinCraft Lab, including:
- Element master content management;
- DiscoveryDetail educational content management;
- Element content status & activation/deactivation management.

### 1.2 In-Scope Endpoints (5 Operations / 3 Paths)
1. `GET /admin/elements` — List all Element master records for Admin (includes active, inactive, pending, rejected).
2. `GET /admin/elements/:elementId` — Retrieve one Element master record with category and DiscoveryDetail.
3. `POST /admin/elements` — Create a new Element master record.
4. `PATCH /admin/elements/:elementId` — Update editable fields of an Element master record (including status/activation).
5. `PUT /admin/elements/:elementId/detail` — Create or replace (idempotent upsert) the 1-to-1 `DiscoveryDetail` educational content for an Element.

### 1.3 Out-of-Scope & Explicitly Deferred
- Hard deletion (`DELETE /admin/elements/:elementId`) — DEFERRED due to foreign key restrictions (`producedRecipes`, `craftRecipeInputs`, `userElements`, `workspaceNodes`, `simulations`). Status deactivation (`status = INACTIVE`) is used instead.
- ElementCategory CRUD (`/admin/categories`) — DEFERRED.
- CraftRecipe CRUD (`/admin/recipes`) — DEFERRED.
- Simulation CRUD (`/admin/simulations`) — DEFERRED.
- User/Role Administration (`/admin/users`) — DEFERRED.
- Bulk CSV/JSON import or export — DEFERRED.
- AI text generation or remote image downloading — DEFERRED.

---

## 2. Authorization & Security Contract

### 2.1 Allowed Roles
- `ADMIN`
- `SUPER_ADMIN`

### 2.2 Denied Role
- `USER` (HTTP `403 Forbidden` with message `"Insufficient permissions"`)

### 2.3 Auth Evaluation Order
Every `/admin/elements` endpoint is protected by:
```ts
@ApiTags('Admin Content')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/elements')
```

1. **`AuthGuard`**: Extracts JWT from `Authorization: Bearer <token>`.
   - Missing or invalid JWT -> `HTTP 401 Unauthorized` (`"Invalid or missing authentication token"`).
2. **User Status Check (`validateUser`)**: Validates user exists in database and `status === UserStatus.ACTIVE`.
   - Missing User in DB -> `HTTP 401 Unauthorized` (`"User account not found"`).
   - INACTIVE or BANNED status -> `HTTP 403 Forbidden` (`"User account is disabled"`).
3. **`RolesGuard`**: Checks `@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)` against `request.user.role`.
   - Role `USER` -> `HTTP 403 Forbidden` (`"Insufficient permissions"`).

---

## 3. Prisma Analysis & Schema-Fit Verdict

### 3.1 Schema-Fit Classification
- `PRISMA_SCHEMA_CHANGE_REQUIRED`: `NO`
- `MIGRATION_REQUIRED`: `NO`
- Overall Schema Fit: `DIRECT_FIT`

All requested features (Element creation, editing, activation/deactivation via `ContentStatus`, and DiscoveryDetail 1-to-1 upsert) map directly to existing Prisma models without schema or migration changes.

### 3.2 Element Model Field Ownership Matrix

| Field | Database Type | Nullable | Default | Unique | Admin Create | Admin Update | System Managed | Public Response |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | UUID v4 | No | `uuid()` | Yes (PK) | Rejected | Rejected | Yes | Included |
| `categoryId` | UUID v4 | No | None | No | Required | Optional | No | Included |
| `name` | String | No | None | No | Required | Optional | No | Included |
| `slug` | String | No | None | Yes | Required | **IMMUTABLE** | No | Included |
| `iconUrl` | String? | Yes | `null` | No | Optional | Optional | No | Included |
| `emoji` | String | No | None | No | Required | Optional | No | Included |
| `elementType` | `ElementType` | No | None | No | Required | Optional | No | Included |
| `isStarter` | Boolean | No | `false` | No | Optional | Optional | No | Included |
| `status` | `ContentStatus`| No | `PENDING`| No | Optional | Optional | No | Included |
| `createdAt` | Timestamptz | No | `now()` | No | Rejected | Rejected | Yes | Included |
| `updatedAt` | Timestamptz | No | `updatedAt`| No | Rejected | Rejected | Yes | Included |

### 3.3 DiscoveryDetail Model Field Ownership Matrix

| Field | Database Type | Nullable | Default | Unique | Admin PUT | System Managed | Public Response |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | UUID v4 | No | `uuid()` | Yes (PK) | Rejected | Yes | Included |
| `elementId` | UUID v4 | No | None | Yes (FK) | Route Param | Yes | Included |
| `shortDescription` | String | No | None | No | Required | No | Included |
| `realLesson` | String | No | None | No | Required | No | Included |
| `example` | String? | Yes | `null` | No | Optional | No | Included |
| `possibleBenefit` | String? | Yes | `null` | No | Optional | No | Included |
| `possibleTradeoff` | String? | Yes | `null` | No | Optional | No | Included |
| `hiddenRisk` | String? | Yes | `null` | No | Optional | No | Included |
| `worksWhen` | String? | Yes | `null` | No | Optional | No | Included |
| `becomesDifficultWhen` | String? | Yes | `null` | No | Optional | No | Included |
| `whatChangesOutcome` | String? | Yes | `null` | No | Optional | No | Included |
| `realityLevel` | `RealityLevel`| No | None | No | Required | No | Included |
| `safetyLabel` | `SafetyLabel` | No | None | No | Required | No | Included |
| `sources` | Json | No | None | No | Required (Array) | No | Included |
| `createdAt` | Timestamptz | No | `now()` | No | Rejected | Yes | Included |
| `updatedAt` | Timestamptz | No | `updatedAt`| No | Rejected | Yes | Included |

---

## 4. Endpoint Specifications

### 4.1 `GET /admin/elements`
- **Purpose**: Retrieve full list of Element master records for Admin management.
- **Query Parameters**:
  - `status` (`ContentStatus`, optional) — Filter by status (`PENDING`, `ACTIVE`, `INACTIVE`, `REJECTED`).
  - `elementType` (`ElementType`, optional) — Filter by type (`BASE`, `CONCEPT`, `BEHAVIOR`, `RISK`, `SCENARIO`, `TOOL`, `DISCOVERY`).
  - `categoryId` (UUID v4, optional) — Filter by category UUID.
- **Ordering**: Deterministic by `createdAt DESC`.
- **Response**: `200 OK`
  ```json
  {
    "data": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "categoryId": "c1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Earned Income",
        "slug": "income",
        "iconUrl": "https://example.com/icons/income.png",
        "emoji": "💵",
        "elementType": "BASE",
        "isStarter": true,
        "status": "ACTIVE",
        "createdAt": "2026-07-24T12:00:00.000Z",
        "updatedAt": "2026-07-24T12:00:00.000Z"
      }
    ]
  }
  ```

### 4.2 `GET /admin/elements/:elementId`
- **Purpose**: Retrieve single Element master record with details for Admin.
- **Route Parameter**: `elementId` (UUID v4) -> If malformed, `HTTP 400 Bad Request`.
- **Response**: `200 OK`
  ```json
  {
    "data": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "categoryId": "c1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "categoryName": "Money Flow",
      "name": "Earned Income",
      "slug": "income",
      "iconUrl": "https://example.com/icons/income.png",
      "emoji": "💵",
      "elementType": "BASE",
      "isStarter": true,
      "status": "ACTIVE",
      "createdAt": "2026-07-24T12:00:00.000Z",
      "updatedAt": "2026-07-24T12:00:00.000Z",
      "discoveryDetail": {
        "id": "d1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "elementId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "shortDescription": "Regular inflows of money earned through labor...",
        "realLesson": "Earned income forms the top-line foundation...",
        "example": "A salaried worker receives THB 30,000 monthly...",
        "possibleBenefit": "Provides predictable cash inflows...",
        "possibleTradeoff": "Requires ongoing commitment of time...",
        "hiddenRisk": "Over-relying on a single income stream...",
        "worksWhen": "Employment conditions are stable...",
        "becomesDifficultWhen": "Macroeconomic recessions occur...",
        "whatChangesOutcome": "Market demand for skills...",
        "realityLevel": "GROUNDED",
        "safetyLabel": "EDUCATION_ONLY",
        "sources": [
          {
            "title": "Bank of Thailand Financial Literacy",
            "organization": "Bank of Thailand",
            "url": "https://www.bot.or.th/financial-literacy"
          }
        ],
        "createdAt": "2026-07-24T12:00:00.000Z",
        "updatedAt": "2026-07-24T12:00:00.000Z"
      }
    }
  }
  ```
- **Error**: `404 Not Found` (`"Element not found"`).

### 4.3 `POST /admin/elements`
- **Purpose**: Create a new Element master record.
- **Request Body (`CreateElementDto`)**:
  - `name`: String, 1-100 chars, trimmed, required.
  - `slug`: String, 1-100 chars, trimmed, lowercase, kebab-case, required (**IMMUTABLE AFTER CREATE**).
  - `categoryId`: String, UUID v4, required (must reference existing `ElementCategory`).
  - `emoji`: String, 1-10 chars, trimmed, required.
  - `elementType`: Enum (`ElementType`), required.
  - `isStarter`: Boolean, optional (default `false`).
  - `status`: Enum (`ContentStatus`), optional (default `PENDING`).
  - `iconUrl`: String?, optional, HTTPS URL (max 2048 chars) or null.
- **Slug Normalization**: Trimmed and lowercased before validation and persistence.
- **Validation**:
  - Missing `categoryId` in DB -> `HTTP 404 Not Found` (`"Element category not found"`).
  - Duplicate `slug` pre-check -> `HTTP 409 Conflict` (`"Element slug already exists"`).
  - Database `@unique` constraint violation on `slug` (Prisma P2002 target `slug`) -> `HTTP 409 Conflict` (`"Element slug already exists"`).
- **Response**: `201 Created`

### 4.4 `PATCH /admin/elements/:elementId`
- **Purpose**: Update editable fields of an Element master record (including status activation/deactivation).
- **Request Body (`UpdateElementDto`)**:
  - All fields optional (`name`, `categoryId`, `emoji`, `elementType`, `isStarter`, `status`, `iconUrl`).
  - `slug`: **IMMUTABLE** (Rejected if present with `HTTP 400 Bad Request` `"slug cannot be updated"`).
- **Validation Rules**:
  - Empty body `{}` -> `HTTP 400 Bad Request` (`"At least one editable field must be provided"`).
  - `name: null` or `name: ""` -> `HTTP 400 Bad Request` (`"Pet name cannot be null"` / `"Element name cannot be null"`).
  - `categoryId` not found in DB -> `HTTP 404 Not Found` (`"Element category not found"`).
  - `elementId` not found in DB -> `HTTP 404 Not Found` (`"Element not found"`).
- **Response**: `200 OK`

### 4.5 `PUT /admin/elements/:elementId/detail`
- **Purpose**: Idempotent create or replace (upsert) of 1-to-1 `DiscoveryDetail` educational content for an Element.
- **Request Body (`UpsertDiscoveryDetailDto`)**:
  - `shortDescription`: String, 1-500 chars, trimmed, required.
  - `realLesson`: String, 1-2000 chars, trimmed, required.
  - `example`: String?, max 2000 chars, trimmed, optional/nullable.
  - `possibleBenefit`: String?, max 2000 chars, trimmed, optional/nullable.
  - `possibleTradeoff`: String?, max 2000 chars, trimmed, optional/nullable.
  - `hiddenRisk`: String?, max 2000 chars, trimmed, optional/nullable.
  - `worksWhen`: String?, max 2000 chars, trimmed, optional/nullable.
  - `becomesDifficultWhen`: String?, max 2000 chars, trimmed, optional/nullable.
  - `whatChangesOutcome`: String?, max 2000 chars, trimmed, optional/nullable.
  - `realityLevel`: Enum (`RealityLevel`), required.
  - `safetyLabel`: Enum (`SafetyLabel`), required.
  - `sources`: Array of `{ title: string, organization: string, url: string }`, required. `url` must be syntactically valid absolute HTTPS URL (max 2048 chars).
- **Validation & Execution**:
  - Checks Element exists -> If absent, `HTTP 404 Not Found` (`"Element not found"`).
  - Uses `prisma.discoveryDetail.upsert({ where: { elementId }, create: { ... }, update: { ... } })`.
- **Response**: `200 OK`

---

## 5. Educational Safety & Source Validation

1. **Educational Only Disclaimer**:
   All educational detail responses enforce standard project disclaimers:
   `SafetyLabel.EDUCATION_ONLY`, `SafetyLabel.SIMULATION_ONLY`, `SafetyLabel.NOT_FINANCIAL_ADVICE`.
2. **HTTPS Source URL Validation**:
   - `sources` array items must contain valid absolute URLs starting with `https://`.
   - Rejects `http://`, `data:`, `file:`, `javascript:`, and malformed URLs with `HTTP 400 Bad Request`.
   - Backend performs NO fetch, HTTP request, file download, or AI text moderation.

---

## 6. Error Response Matrix

| Status Code | Reason / Condition | Error Message Payload |
| :--- | :--- | :--- |
| `400 Bad Request` | Missing required field / Invalid enum / Empty PATCH body `{}` / `slug` supplied in PATCH / Malformed HTTPS source URL | `{ "message": "At least one editable field must be provided" }` |
| `401 Unauthorized` | Missing/invalid JWT or user not found | `{ "message": "Invalid or missing authentication token" }` |
| `403 Forbidden` | User status INACTIVE/BANNED or role is `USER` | `{ "message": "Insufficient permissions" }` / `{ "message": "User account is disabled" }` |
| `404 Not Found` | Element or Category not found | `{ "message": "Element not found" }` / `{ "message": "Element category not found" }` |
| `409 Conflict` | Duplicate Element slug pre-check or P2002 unique constraint | `{ "message": "Element slug already exists" }` |

---

## 7. Future NestJS Directory Structure

```text
src/admin-content/
  admin-content.module.ts
  admin-content.controller.ts
  admin-content.service.ts
  dto/
    create-element.dto.ts
    update-element.dto.ts
    upsert-discovery-detail.dto.ts
    element-admin-response.dto.ts
  mappers/
    element-admin-response.mapper.ts
  openapi/
    admin-content-openapi.decorators.ts
```

- Primary files (`admin-content.module.ts`, `admin-content.controller.ts`, `admin-content.service.ts`) remain at feature root `src/admin-content/`.
- No `controllers/` directory, no `services/` directory, no `index.ts` barrel files.

---

## 8. Numbered Future Runtime Acceptance Matrix (50 Scenarios)

```text
AUTHORIZATION (Scenarios 1-8):
1.  ADMIN user with valid JWT receives 200/201 on Admin Content routes.
2.  SUPER_ADMIN user with valid JWT receives 200/201 on Admin Content routes.
3.  USER role with valid JWT receives 403 Forbidden ("Insufficient permissions").
4.  Missing Authorization header returns 401 Unauthorized.
5.  Malformed Bearer JWT returns 401 Unauthorized.
6.  User ID in JWT not found in database returns 401 Unauthorized.
7.  INACTIVE user account returns 403 Forbidden ("User account is disabled").
8.  BANNED user account returns 403 Forbidden ("User account is disabled").

LIST ELEMENTS (Scenarios 9-13):
9.  GET /admin/elements returns 200 with full array of elements.
10. GET /admin/elements includes PENDING, ACTIVE, INACTIVE, and REJECTED elements.
11. GET /admin/elements filter by status=ACTIVE returns only active elements.
12. GET /admin/elements filter by elementType=BASE returns only BASE elements.
13. GET /admin/elements list response is deterministically sorted by createdAt DESC.

GET ELEMENT DETAIL (Scenarios 14-18):
14. GET /admin/elements/:elementId returns 200 with Element and DiscoveryDetail.
15. GET /admin/elements/:elementId for non-existent UUID returns 404 Not Found.
16. GET /admin/elements/:elementId with invalid UUID string returns 400 Bad Request.
17. GET /admin/elements/:elementId includes categoryName and categoryId.
18. GET /admin/elements/:elementId with missing DiscoveryDetail returns detail as null.

CREATE ELEMENT (Scenarios 19-27):
19. POST /admin/elements with valid payload creates Element and returns 201 Created.
20. POST /admin/elements with trimmed slug and name stores normalized values.
21. POST /admin/elements with duplicate slug pre-check returns 409 Conflict.
22. POST /admin/elements concurrent duplicate slug P2002 returns 409 Conflict.
23. POST /admin/elements with non-existent categoryId returns 404 Not Found.
24. POST /admin/elements with missing required fields (name, slug, emoji) returns 400.
25. POST /admin/elements with invalid elementType enum returns 400 Bad Request.
26. POST /admin/elements with forbidden extra property returns 400 Bad Request.
27. POST /admin/elements creates Element without modifying UserElement or DiscoveryEvent.

UPDATE ELEMENT (Scenarios 28-36):
28. PATCH /admin/elements/:elementId with valid fields updates Element and returns 200.
29. PATCH /admin/elements/:elementId updating status to INACTIVE deactivates Element.
30. PATCH /admin/elements/:elementId updating status to ACTIVE activates Element.
31. PATCH /admin/elements/:elementId with empty body {} returns 400 Bad Request.
32. PATCH /admin/elements/:elementId with slug in body returns 400 Bad Request.
33. PATCH /admin/elements/:elementId with null name returns 400 Bad Request.
34. PATCH /admin/elements/:elementId for non-existent elementId returns 404 Not Found.
35. PATCH /admin/elements/:elementId with non-existent categoryId returns 404 Not Found.
36. Failed PATCH leaves existing Element row in database 100% unchanged.

PUT DISCOVERY DETAIL (Scenarios 37-45):
37. PUT /admin/elements/:elementId/detail on Element without detail creates DiscoveryDetail (200).
38. PUT /admin/elements/:elementId/detail on Element with existing detail replaces DiscoveryDetail (200).
39. PUT /admin/elements/:elementId/detail with non-existent elementId returns 404 Not Found.
40. PUT /admin/elements/:elementId/detail with missing required fields returns 400 Bad Request.
41. PUT /admin/elements/:elementId/detail with invalid HTTPS source URL returns 400 Bad Request.
42. PUT /admin/elements/:elementId/detail with javascript: source URL returns 400 Bad Request.
43. PUT /admin/elements/:elementId/detail validates realityLevel and safetyLabel enums.
44. Repeated PUT /admin/elements/:elementId/detail leaves exactly 1 DiscoveryDetail row in DB.
45. Failed PUT /admin/elements/:elementId/detail leaves previous DiscoveryDetail 100% unchanged.

NON-INTERFERENCE & REGRESSION (Scenarios 46-50):
46. Admin operations create 0 UserElement, 0 WorkspaceNode, or 0 SimulationRun rows.
47. Admin operations perform zero external HTTP requests, downloads, or AI calls.
48. Swagger GET /docs returns 200 with Admin Content operations documented.
49. Swagger GET /docs-json returns valid OpenAPI JSON with 24 total operations across 17 paths.
50. OpenAPI documentation excludes passwordHash and internal relations.
```

---

## 9. Implementation Sequence for Future Task (`P12_1B`)

1. Verify `RolesGuard` (`src/auth/guards/roles.guard.ts`) and `@Roles` decorator (`src/auth/decorators/roles.decorator.ts`).
2. Create DTOs under `src/admin-content/dto/` (`create-element.dto.ts`, `update-element.dto.ts`, `upsert-discovery-detail.dto.ts`, `element-admin-response.dto.ts`).
3. Create mapper under `src/admin-content/mappers/element-admin-response.mapper.ts`.
4. Create OpenAPI helpers under `src/admin-content/openapi/admin-content-openapi.decorators.ts`.
5. Create `AdminContentService` under `src/admin-content/admin-content.service.ts`.
6. Create `AdminContentController` under `src/admin-content/admin-content.controller.ts`.
7. Create `AdminContentModule` under `src/admin-content/admin-content.module.ts` and register in `AppModule` and `setupSwagger`.
8. Run compiled PostgreSQL 50-scenario acceptance runner and verify quality gates.
9. Perform read-only post-commit audit.
