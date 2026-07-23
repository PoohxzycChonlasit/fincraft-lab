# Workspace Metadata CRUD API Runtime Acceptance Report

- **TASK_ID**: `P8_WORKSPACE_API_1B_IMPLEMENT_WORKSPACE_CRUD_001`
- **COMMIT**: `2e5fa53f85a09a96cdc455dc372e86294ab15046` (Implementation)
- **TIMESTAMP**: 2026-07-23T17:24:10+07:00
- **ENVIRONMENT**: Local Node.js + NestJS HTTP Application Test Suite
- **DATABASE**: Local PostgreSQL (`DATABASE_URL`)
- **BACKEND PORT**: 3000 (`http://localhost:3000`)
- **CLASSIFICATION**:
  - Runtime HTTP / PostgreSQL Acceptance: **PASS**
  - Postman / Newman Acceptance: **PENDING**

---

## 1. Execution Method & Tooling Status

- **Postman Collection Execution**: `NOT_RUN`
- **Newman CLI Execution**: `NOT_RUN` (Newman CLI was unavailable in the tested environment)
- **Live HTTP Test Suite**: `RUN` (28 live HTTP scenarios executed against NestJS HTTP application)
- **Live HTTP Scenarios Executed**: 28
- **Live HTTP Scenarios Passed**: 28 (100% pass rate across all 28 scenarios)
- **Live HTTP Scenarios Failed**: 0
- **Postman Acceptance Status**: `PENDING` (Requires explicit Newman or Postman Desktop execution when CLI is available)

---

## 2. Scenario Results Matrix (28 Scenarios)

| Scenario | Group | Request Details | Expected HTTP | Actual HTTP | DB Side Effects & Verification | Result |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: |
| **1** | Auth | `GET /workspaces` (No Authorization) | 401 | 401 | 0 DB writes | PASS |
| **2** | Auth | `GET /workspaces` (Malformed token) | 401 | 401 | 0 DB writes | PASS |
| **3** | Auth | `GET /workspaces` (Non-existent user sub) | 401 | 401 | `"User account not found"`; 0 writes | PASS |
| **4** | Auth | `GET /workspaces` (INACTIVE User) | 403 | 403 | `"User account is disabled"`; 0 writes | PASS |
| **5** | Auth | `GET /workspaces` (BANNED User) | 403 | 403 | `"User account is disabled"`; 0 writes | PASS |
| **6** | Create | `POST /workspaces` (`name: "  My First Lab Workspace  "`) | 201 | 201 | Trimmed name `"My First Lab Workspace"`; 1 row created | PASS |
| **7** | Create | `POST /workspaces` (Default status check) | 201 | 201 | `status = ACTIVE` | PASS |
| **8** | Create | `POST /workspaces` (`status: "ACTIVE"` in body) | 400 | 400 | Extra field rejected (`forbidNonWhitelisted`); 0 writes | PASS |
| **9** | Create | `POST /workspaces` (`name: "   "`) | 400 | 400 | Blank name rejected (`IsNotEmpty`); 0 writes | PASS |
| **10** | Create | `POST /workspaces` (`name: 12345`) | 400 | 400 | Non-string rejected (`IsString`), HTTP 400 (not 500) | PASS |
| **11** | Create | `POST /workspaces` (`userId` in body) | 400 | 400 | Extra field rejected; 0 writes | PASS |
| **12** | List | `GET /workspaces` (Active user with 0 workspaces) | 200 | 200 | Returns `{ "data": [] }`; 0 writes | PASS |
| **13** | List | `GET /workspaces` (ACTIVE + ARCHIVED workspaces) | 200 | 200 | Returns all 3 owned workspaces (ACTIVE & ARCHIVED) | PASS |
| **14** | List | `GET /workspaces` (Other user's workspace check) | 200 | 200 | Excludes User 2's workspace (`leakedOtherWs = false`) | PASS |
| **15** | List | `GET /workspaces` (Ordering validation) | 200 | 200 | Deterministically ordered (`updatedAt DESC`, `createdAt DESC`, `id ASC`) | PASS |
| **16** | Get One | `GET /workspaces/:id` (Owned ACTIVE workspace) | 200 | 200 | Returns metadata for owned active workspace | PASS |
| **17** | Get One | `GET /workspaces/:id` (Owned ARCHIVED workspace) | 200 | 200 | Returns metadata for owned archived workspace | PASS |
| **18** | Get One | `GET /workspaces/:id` (Missing vs Non-owned workspace) | 404 | 404 | Identical 404 `"Workspace not found"` (zero existence leakage) | PASS |
| **19** | Patch | `PATCH /workspaces/:id` (`name: "  Renamed Lab Workspace  "`) | 200 | 200 | Safely trimmed name; ISO-8601 string dates returned | PASS |
| **20** | Patch | `PATCH /workspaces/:id` (`status: ACTIVE -> ARCHIVED -> ACTIVE`) | 200 | 200 | Status updated to `ARCHIVED` then back to `ACTIVE` | PASS |
| **21** | Patch | `PATCH /workspaces/:id` (Empty body `{}`) | 400 | 400 | Rejected with `"At least one field must be provided for update"` | PASS |
| **22** | Patch | `PATCH /workspaces/:id` (`name: null` / `extraField`) | 400 | 400 | Rejected with HTTP 400 | PASS |
| **23** | Patch | `PATCH /workspaces/:id` (Non-owned workspace) | 404 | 404 | `"Workspace not found"`; original row untouched | PASS |
| **24** | Delete | `DELETE /workspaces/:id` (Owned workspace) | 200 | 200 | Hard-deleted workspace row; returns `{ "data": { "id" } }` | PASS |
| **25** | Delete | `DELETE /workspaces/:id` (Cascade check) | 200 | 200 | PostgreSQL `onDelete: Cascade` deleted dependent Nodes and Edges | PASS |
| **26** | Delete | `DELETE /workspaces/:id` (Missing vs Non-owned workspace) | 404 | 404 | Identical 404 `"Workspace not found"` (zero existence leakage) | PASS |
| **27** | Audit | Public response shape audit | 200 | 200 | Exact public keys (`id`, `name`, `status`, `createdAt`, `updatedAt`); 0 internal metadata leaked | PASS |
| **28** | Regression | Health, Auth, Craft, Elements regression | 200/401 | 200/401 | Health 200, Auth/me 401, Craft NoToken 401, Elements NoToken 401 | PASS |

---

## 3. Database Reconciliation & Cascade Verification

- **Baseline Preserved Rows**: `Users`: 2, `UserElements`: 2, `DiscoveryEvents`: 7, `CraftRecipes`: 22, `Elements`: 36, `DiscoveryDetails`: 36
- **Endpoint Writes**:
  - `POST`: Created exactly 1 `Workspace` row per call.
  - `GET` list / getOne: **0 Writes**.
  - `PATCH`: Updated exactly 1 owned `Workspace` row.
  - `DELETE`: Hard-deleted 1 owned `Workspace` row + cascaded DB deletion of dependent `WorkspaceNode` and `WorkspaceEdge` rows.
- **Test Setup/Cleanup**: Synthetic test users (`ws-active1-*`, `ws-active2-*`, `ws-inactive-*`, `ws-banned-*`) and their associated workspaces/nodes/edges created during test execution were safely cleaned up in a `finally` block; original database baseline intact.

---

## 4. Preservation Policy

- Policy: `PRESERVE_TEST_EVIDENCE`
- The 2 test user accounts (`f74df612-a7d5-4541-ba6a-cde98c56bb7b` and `c4a51e82-d8b9-4a1e-8e3d-9f20e8b15a63`) and their associated `UserElement` and `DiscoveryEvent` rows remain preserved in local PostgreSQL development database for demonstration and audit evidence.
