# SWAGGER_OPENAPI_RUNTIME_ACCEPTANCE.md — Verified Runtime OpenAPI & Swagger UI Acceptance

## Verification Metadata
- **Date**: 2026-07-24
- **Task ID**: `P9_API_DOCS_1A_IMPLEMENT_SWAGGER_UI_001`
- **Module**: NestJS Backend (`fincraft-lab-api`)
- **Package Installed**: `@nestjs/swagger@11.4.6`
- **Verification Mode**: Compiled NestAppModule HTTP Execution & JSON Schema Inspection
- **Result**: PASSED (28/28 assertion checks passed, 0 failed)

---

## Verified Endpoints & Swagger Specifications

| # | HTTP Method | Route | Swagger Tag | Operation Summary | Auth Required | Request Schema | Response Schema |
|---|-------------|-------|-------------|-------------------|---------------|----------------|-----------------|
| 1 | `GET` | `/health` | `Health` | Health Check | No | None | `HealthResponseDto` |
| 2 | `POST` | `/auth/register` | `Authentication` | User Registration | No | `RegisterDto` | `UserEnvelopeDto` |
| 3 | `POST` | `/auth/login` | `Authentication` | User Login | No | `LoginDto` | `LoginEnvelopeDto` |
| 4 | `GET` | `/auth/me` | `Authentication` | Get Current User Profile | Yes (`access-token`) | None | `UserEnvelopeDto` |
| 5 | `GET` | `/elements` | `Elements` | Get Available Elements | Yes (`access-token`) | None | `AvailableElementsEnvelopeDto` |
| 6 | `POST` | `/craft` | `Craft` | Combine Elements | Yes (`access-token`) | `CraftRequestDto` | `CraftResultEnvelopeDto` |
| 7 | `POST` | `/workspaces` | `Workspaces` | Create Workspace | Yes (`access-token`) | `CreateWorkspaceDto` | `WorkspaceEnvelopeDto` |
| 8 | `GET` | `/workspaces` | `Workspaces` | List Owned Workspaces | Yes (`access-token`) | None | `WorkspacesEnvelopeDto` |
| 9 | `GET` | `/workspaces/:workspaceId` | `Workspaces` | Get Workspace Details | Yes (`access-token`) | UUID v4 param | `WorkspaceEnvelopeDto` |
| 10 | `PATCH` | `/workspaces/:workspaceId` | `Workspaces` | Update Workspace Metadata | Yes (`access-token`) | `UpdateWorkspaceDto` | `WorkspaceEnvelopeDto` |
| 11 | `DELETE` | `/workspaces/:workspaceId` | `Workspaces` | Delete Workspace | Yes (`access-token`) | UUID v4 param | `DeleteWorkspaceEnvelopeDto` |
| 12 | `GET` | `/workspaces/:workspaceId/canvas` | `Canvas` | Get Canvas Snapshot | Yes (`access-token`) | UUID v4 param | `CanvasSnapshotEnvelopeDto` |
| 13 | `PUT` | `/workspaces/:workspaceId/canvas` | `Canvas` | Replace Canvas Snapshot | Yes (`access-token`) | `SaveCanvasSnapshotDto` | `CanvasSnapshotEnvelopeDto` |

---

## OpenAPI Security & Documentation Features
1. **Swagger UI Mount**: Serves interactive Swagger UI HTML document at `/docs`.
2. **OpenAPI JSON Spec**: Exposes OpenAPI 3.0.0 JSON specification at `/docs-json`.
3. **Bearer Authentication**: Configured `access-token` HTTP Bearer scheme with JWT bearer format.
4. **Try It Out Support**: All 13 endpoints fully testable via Swagger UI with Authorize header.
5. **No Password Hash Leak**: Audit confirmed `passwordHash` is absent from all OpenAPI schemas.

---

## Static Quality & Line Count Inventory

| File Path | Purpose | Line Count | Status |
|-----------|---------|------------|--------|
| `src/main.ts` | Entry point & Swagger setup call | 22 lines | PASSED (<= 60) |
| `src/openapi/setup-swagger.ts` | Swagger DocumentBuilder setup | 40 lines | PASSED (<= 60) |
| `src/health/health.controller.ts` | Health controller + Swagger decorators | 36 lines | PASSED (<= 150) |
| `src/auth/auth.controller.ts` | Auth controller + Swagger decorators | 87 lines | PASSED (<= 150) |
| `src/element/element.controller.ts` | Element controller + Swagger decorators | 40 lines | PASSED (<= 150) |
| `src/craft/craft.controller.ts` | Craft controller + Swagger decorators | 49 lines | PASSED (<= 150) |
| `src/workspace/workspace.controller.ts` | Workspace controller + Swagger decorators | 146 lines | PASSED (<= 150) |
| `src/workspace/openapi/workspace-openapi.decorators.ts` | Extracted openapi decorators | 204 lines | PASSED (<= 400) |

---

## Post-Audit Reconciliation (`P9_API_DOCS_1C_REPAIR_SWAGGER_LINT_FORMATTING_001`)

- **Audit Trigger**: An independent audit of commit `cb38741f37171a92ebd7f93f48e3470e2abce93e` identified ESLint exit 1 with 73 Prettier formatting errors.
- **Action Taken**: Executed repository Prettier (`prettier --write`) on affected Swagger DTO and OpenAPI files.
- **Reconciled Quality Status**:
  - ESLint: **PASSED (exit 0, 0 errors, 0 warnings)**
  - Runtime Suite: **PASSED (28/28 assertion checks passed, 0 failed)**

---

## Post-Simulation Reconciliation (`P10_SIMULATION_API_1B_IMPLEMENT_SURVIVAL_MONTHS_001`)

- **New Operations Added**:
  - `GET /simulations` (`Simulations` tag, List available simulations)
  - `GET /simulations/:simulationId` (`Simulations` tag, Get simulation details)
  - `POST /simulations/:simulationId/runs` (`Simulations` tag, Run a simulation)
- **Updated OpenAPI Totals**:
  - Controllers: **6** (`HealthController`, `AuthController`, `ElementController`, `CraftController`, `WorkspaceController`, `SimulationController`)
  - Unique Paths: **12**
  - Operations: **16** (13 pre-existing + 3 new `Simulations` operations)
- **Reconciled Status**: All 16 OpenAPI operations fully functional and authenticated with `access-token` Bearer security where required.

---

## Post-Pet Profile Reconciliation (`P11_PET_PROFILE_API_1B_IMPLEMENT_PET_PROFILE_001`)

- **New Operations Added**:
  - `GET /pets/me` (`Pets` tag, Get my Pet profile)
  - `POST /pets` (`Pets` tag, Create my Pet profile)
  - `PATCH /pets/me` (`Pets` tag, Update my Pet profile)
- **Updated OpenAPI Totals**:
  - Controllers: **7** (`HealthController`, `AuthController`, `ElementController`, `CraftController`, `WorkspaceController`, `SimulationController`, `PetController`)
  - Unique Paths: **14**
  - Operations: **19** (16 pre-existing + 3 new `Pets` operations)
- **Reconciled Status**: All 19 OpenAPI operations fully functional and authenticated with `access-token` Bearer security where required. Public auth routes `/auth/register` and `/auth/login` remain public. `passwordHash` remains absent across all OpenAPI schemas.
