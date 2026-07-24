# Pet Profile Runtime Acceptance Report

This document records the compiled PostgreSQL runtime acceptance execution and verification for the **Pet Profile API** implementation in FinCraft Lab.

---

## 1. Task Metadata

- **Task ID**: `P11_PET_PROFILE_API_1B_IMPLEMENT_PET_PROFILE_001`
- **Execution Date**: 2026-07-24
- **Backend Stack**: NestJS + PostgreSQL + Prisma 7.8
- **Frozen Contract Marker**: `FROZEN_PET_PROFILE_API_CONTRACT_V1`
- **Candidate Commit**: Pending Local Checkpoint Commit
- **Cardinality**: `ONE_USER_ONE_PET`
- **Avatar Strategy**: `STORED_HTTPS_AVATAR_URL_WITHOUT_REMOTE_FETCH`
- **Database Schema Change**: `NONE` (0 migrations required)
- **Database Seed Modification**: `NONE` (0 Pet seed rows created)

---

## 2. API Endpoint Inventory

| Method | Route | Security | Status Code | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/pets/me` | `access-token` | `200 OK` / `404 Not Found` | Retrieve authenticated user's Pet profile |
| `POST` | `/pets` | `access-token` | `201 Created` / `409 Conflict` | Create authenticated user's first Pet profile |
| `PATCH` | `/pets/me` | `access-token` | `200 OK` / `404 Not Found` / `400 Bad Request` | Update authenticated user's Pet profile |

---

## 3. Reconciled 50-Scenario Acceptance Matrix Execution

```text
==========================================
EXECUTED=50
PASSED=50
FAILED=0
DEFERRED=0
MODE=COMPILED_NEST_APP_MODULE_REAL_POSTGRESQL
==========================================
```

### Breakdown by Category

| Category | Scenarios Range | Total | Passed | Failed | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CREATE (`POST /pets`)** | 1 to 9 | 9 | 9 | 0 | PASSED |
| **READ (`GET /pets/me`)** | 10 to 15 | 6 | 6 | 0 | PASSED |
| **UPDATE (`PATCH /pets/me`)** | 16 to 28 | 13 | 13 | 0 | PASSED |
| **AUTH AND USER STATUS** | 29 to 33 | 5 | 5 | 0 | PASSED |
| **PERSISTENCE** | 34 to 40 | 7 | 7 | 0 | PASSED |
| **NON-INTERFERENCE** | 41 to 45 | 5 | 5 | 0 | PASSED |
| **SWAGGER AND REGRESSION** | 46 to 50 | 5 | 5 | 0 | PASSED |
| **TOTAL** | **1 to 50** | **50** | **50** | **0** | **PASSED** |

---

## 4. Key Verification Findings

1. **One-User-One-Pet & Concurrency**:
   - Pre-check in `PetService` catches existing Pet profiles and returns `HTTP 409 Conflict` ("Pet profile already exists").
   - Database `@unique` constraint on `Pet.userId` catches concurrent race conditions (Prisma P2002) and maps to `HTTP 409 Conflict`.
2. **HTTPS Avatar Validation**:
   - `IsHttpsUrl` custom validator enforces syntactically valid absolute URLs with `https:` protocol (max 2048 chars).
   - Rejects HTTP (`http://`), data:, file:, javascript:, and whitespace-only strings with `HTTP 400 Bad Request`.
   - Backend stores normalized string in DB only; performs zero remote requests, downloads, or content inspection.
3. **Nullable Field Semantics**:
   - On `POST /pets`, omitted/null `avatarUrl`, `personality`, `learningGoal` store `null`.
   - On `PATCH /pets/me`, explicit `null` clears field to `null` in DB; omitted field preserves existing DB value.
   - Empty PATCH body `{}` returns `HTTP 400 Bad Request` ("At least one editable field must be provided").
4. **Security & Ownership**:
   - `userId` is strictly derived from JWT payload (`user.sub`).
   - `ValidationPipe` with `forbidNonWhitelisted: true` rejects body `userId`, `id`, `ownerId`, `createdAt`, `updatedAt`, or extra properties with `HTTP 400 Bad Request`.
   - Inactive/banned users (`UserStatus.INACTIVE` / `UserStatus.BANNED`) return `HTTP 403 Forbidden` ("User account is disabled").
5. **Non-Interference**:
   - 0 Element, UserElement, DiscoveryEvent, Workspace, Canvas, or SimulationRun rows created or mutated.
   - 0 AI, market data, or financial advice generated.

---

## 5. Static Quality Gates Evidence

- **TypeScript (`tsc --noEmit -p tsconfig.json`)**: Exit `0` (0 diagnostics)
- **ESLint (`eslint "{src,apps,libs,test}/**/*.ts"`)**: Exit `0` (0 errors, 0 warnings)
- **Build (`nest build`)**: Exit `0`
- **Unit Tests (`jest --runInBand`)**: Exit `0` (1 suite / 3 tests passed)
- **E2E Tests (`jest-e2e.json`)**: Exit `0` (1 suite / 2 tests passed)

---

## 6. Document Updates & Cleanup Verification

- `docs/ai/evidence/SWAGGER_OPENAPI_RUNTIME_ACCEPTANCE.md`: Appended 19-operation API inventory reconciliation.
- `docs/ai/CURRENT_STATUS.md`: Updated status for task `P11_1B` completion.
- `docs/ai/FILE_MAP.md`: Updated directory map for `src/pet/`.
- Temporary acceptance runner created, executed, verified, deleted, and dist rebuilt.
- Task-owned PostgreSQL test records cleaned up in database.

---

## 7. Manual Testing & Postman Policy

- `MANUAL_TRY_IT_OUT: NOT_PERFORMED`
- `POSTMAN_NEWMAN: NOT_REQUIRED`

---

## 8. Post-Audit P2002 Target Check Repair (`P11_PET_PROFILE_API_1C1_REPAIR_P2002_TARGET_CHECK_001`)

- **Date**: 2026-07-24
- **Audit Defect**: `P11_PET_PROFILE_API_1C_POST_COMMIT_AUDIT_001` identified that `handleDuplicateError` mapped any Prisma `P2002` error without verifying `meta.target`.
- **Repaired File**: `src/pet/pet.service.ts`
- **Repaired Methods**: `handleDuplicateError`, `isPetUserIdConflict`
- **Observed Prisma 7.8 `meta` Shape**:
  `meta: { modelName: 'Pet', driverAdapterError: { cause: { constraint: { fields: ['user_id'] }, originalMessage: 'duplicate key value violates unique constraint "pets_user_id_key"' } } }`
- **Accepted Exact Ownership Identifiers**: `'user_id'`, `'userId'`, `'pets_user_id_key'`, or `driverAdapterError.cause.constraint.fields` containing `'user_id'` / `'userId'`.
- **Focused Verification Cases**:
  1. Real duplicate `Pet.userId` conflict -> mapped to `HTTP 409 Conflict` ("Pet profile already exists") [PASSED]
  2. Synthetic P2002 with unrelated target (`target: ['unrelated_field']`) -> original error rethrown, NOT mapped [PASSED]
  3. P2002 with missing target metadata -> original error rethrown, NOT mapped [PASSED]
  4. Non-P2002 error (e.g. `P2003`) -> original error rethrown, NOT mapped [PASSED]
  5. Friendly pre-check -> returns `HTTP 409 Conflict` ("Pet profile already exists") [PASSED]
- **Static Quality Gates**:
  - `tsc`: PASSED (exit 0)
  - `eslint`: PASSED (exit 0, 0 errors/warnings)
  - `nest build`: PASSED (exit 0)
  - `jest unit`: PASSED (1 suite / 3 tests)
  - `jest e2e`: PASSED (1 suite / 2 tests)
- **Database / Schema Status**: 0 schema changes, 0 migrations executed, 0 seed files modified. Task-owned test records cleaned up.
