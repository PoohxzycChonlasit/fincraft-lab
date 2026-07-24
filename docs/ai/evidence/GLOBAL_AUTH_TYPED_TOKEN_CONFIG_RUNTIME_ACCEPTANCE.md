# GLOBAL_AUTH_TYPED_TOKEN_CONFIG_RUNTIME_ACCEPTANCE.md — Global Auth & Typed Token Config Acceptance Evidence

---

## 1. Overview & Architectural Summary

- **Feature**: Global AuthGuard Refactor & Typed Access Token Configuration
- **Task ID**: `P12A_GLOBAL_AUTH_AND_TYPED_TOKEN_CONFIG_001`
- **Backend Stack**: NestJS + PostgreSQL + Prisma 7.8
- **Refactoring Changes**:
  1. **Global Auth Guard Policy**: Registered `{ provide: APP_GUARD, useClass: AuthGuard }` in `AppModule`. Default security policy is now "deny by default" — all Controller routes are protected automatically.
  2. **Public Operations**: Applied `@Public()` decorator to exactly 3 public business operations:
     - `GET /health`
     - `POST /auth/register`
     - `POST /auth/login`
  3. **Protected Operations**: All remaining 21 operations are automatically protected by global `AuthGuard`. Removed redundant route-level `@UseGuards(AuthGuard)` from `PetController`, `WorkspaceController`, and `AdminContentController`.
  4. **Typed Environment Configuration**: Created `src/config/env.validation.ts` with `EnvVariable` type and `validateEnv` validator function. Configured `ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnv })`.
  5. **Typed AccessTokenService**: Injected `ConfigService<EnvVariable, true>` into `AccessTokenService` to dynamically source `ACCESS_TOKEN_SECRET` and `ACCESS_TOKEN_EXPIRES_IN` for token signing and verification. Simplified `AccessTokenModule` to `JwtModule.register({})`.
- **API Surface Inventory**: 24 Operations across 17 Unique Paths (8 Controllers)
- **Acceptance Matrix Results**: **40/40 PASSED (0 FAILED, 0 DEFERRED)**
- **Static Quality Gates**: All 5 Gates PASSED (tsc exit 0, eslint exit 0, build exit 0, unit exit 0, e2e exit 0)

---

## 2. In-Scope Endpoints & Security Policy Inventory

| Route Path | Method | Access Strategy | Guards Applied | OpenAPI Bearer Scheme |
| :--- | :--- | :--- | :--- | :--- |
| `/health` | `GET` | Public (`@Public()`) | Global `AuthGuard` (bypassed) | None |
| `/auth/register` | `POST` | Public (`@Public()`) | Global `AuthGuard` (bypassed) | None |
| `/auth/login` | `POST` | Public (`@Public()`) | Global `AuthGuard` (bypassed) | None |
| `/auth/me` | `GET` | Protected | Global `AuthGuard` | `access-token` |
| `/elements` | `GET` | Protected | Global `AuthGuard` | `access-token` |
| `/craft` | `POST` | Protected | Global `AuthGuard` | `access-token` |
| `/workspaces` | `POST` | Protected | Global `AuthGuard` | `access-token` |
| `/workspaces` | `GET` | Protected | Global `AuthGuard` | `access-token` |
| `/workspaces/:workspaceId` | `GET` | Protected | Global `AuthGuard` | `access-token` |
| `/workspaces/:workspaceId` | `PATCH` | Protected | Global `AuthGuard` | `access-token` |
| `/workspaces/:workspaceId` | `DELETE` | Protected | Global `AuthGuard` | `access-token` |
| `/workspaces/:workspaceId/canvas` | `GET` | Protected | Global `AuthGuard` | `access-token` |
| `/workspaces/:workspaceId/canvas` | `PUT` | Protected | Global `AuthGuard` | `access-token` |
| `/simulations` | `GET` | Protected | Global `AuthGuard` | `access-token` |
| `/simulations/:simulationId` | `GET` | Protected | Global `AuthGuard` | `access-token` |
| `/simulations/:simulationId/runs` | `POST` | Protected | Global `AuthGuard` | `access-token` |
| `/pets/me` | `GET` | Protected | Global `AuthGuard` | `access-token` |
| `/pets` | `POST` | Protected | Global `AuthGuard` | `access-token` |
| `/pets/me` | `PATCH` | Protected | Global `AuthGuard` | `access-token` |
| `/admin/elements` | `GET` | Protected + Role | Global `AuthGuard` + `RolesGuard` | `access-token` |
| `/admin/elements/:elementId` | `GET` | Protected + Role | Global `AuthGuard` + `RolesGuard` | `access-token` |
| `/admin/elements` | `POST` | Protected + Role | Global `AuthGuard` + `RolesGuard` | `access-token` |
| `/admin/elements/:elementId` | `PATCH` | Protected + Role | Global `AuthGuard` + `RolesGuard` | `access-token` |
| `/admin/elements/:elementId/detail` | `PUT` | Protected + Role | Global `AuthGuard` + `RolesGuard` | `access-token` |

---

## 3. Compiled PostgreSQL 40-Scenario Acceptance Results

```text
=== GLOBAL AUTH & TYPED TOKEN CONFIG 40-SCENARIO ACCEPTANCE RUNNER ===
[PASS] Scenario 1: GET /health without token reaches success 200
[PASS] Scenario 2: POST /auth/register without token is not rejected by AuthGuard (returns 400 validation error)
[PASS] Scenario 3: POST /auth/login without token is not rejected by AuthGuard (reaches auth behavior)
[PASS] Scenario 4: GET /health with malformed Authorization header remains public 200
[PASS] Scenario 5: POST /auth/login with malformed Authorization header remains public (reaches auth behavior)
[PASS] Scenario 6: GET /auth/me without token returns 401 Invalid or missing authentication token
[PASS] Scenario 7: GET /elements without token returns 401 Invalid or missing authentication token
[PASS] Scenario 8: POST /craft without token returns 401 Invalid or missing authentication token
[PASS] Scenario 9: POST /workspaces without token returns 401 Invalid or missing authentication token
[PASS] Scenario 10: GET /workspaces without token returns 401 Invalid or missing authentication token
[PASS] Scenario 11: GET /workspaces/:workspaceId without token returns 401 Invalid or missing authentication token
[PASS] Scenario 12: PATCH /workspaces/:workspaceId without token returns 401 Invalid or missing authentication token
[PASS] Scenario 13: DELETE /workspaces/:workspaceId without token returns 401 Invalid or missing authentication token
[PASS] Scenario 14: GET /workspaces/:workspaceId/canvas without token returns 401 Invalid or missing authentication token
[PASS] Scenario 15: PUT /workspaces/:workspaceId/canvas without token returns 401 Invalid or missing authentication token
[PASS] Scenario 16: GET /simulations without token returns 401 Invalid or missing authentication token
[PASS] Scenario 17: GET /simulations/:simulationId without token returns 401 Invalid or missing authentication token
[PASS] Scenario 18: POST /simulations/:simulationId/runs without token returns 401 Invalid or missing authentication token
[PASS] Scenario 19: GET /pets/me without token returns 401 Invalid or missing authentication token
[PASS] Scenario 20: POST /pets without token returns 401 Invalid or missing authentication token
[PASS] Scenario 21: PATCH /pets/me without token returns 401 Invalid or missing authentication token
[PASS] Scenario 22: GET /admin/elements without token returns 401 Invalid or missing authentication token
[PASS] Scenario 23: GET /admin/elements/:elementId without token returns 401 Invalid or missing authentication token
[PASS] Scenario 24: POST /admin/elements without token returns 401 Invalid or missing authentication token
[PASS] Scenario 25: PATCH /admin/elements/:elementId without token returns 401 Invalid or missing authentication token
[PASS] Scenario 26: PUT /admin/elements/:elementId/detail without token returns 401 Invalid or missing authentication token
[PASS] Scenario 27: Valid ACTIVE USER token can access GET /auth/me (200)
[PASS] Scenario 28: Valid ACTIVE USER token can access GET /elements (200)
[PASS] Scenario 29: ACTIVE USER receives 403 Insufficient permissions on Admin Content
[PASS] Scenario 30: ACTIVE ADMIN can access Admin Content GET /admin/elements (200)
[PASS] Scenario 31: ACTIVE SUPER_ADMIN can access Admin Content GET /admin/elements (200)
[PASS] Scenario 32: INACTIVE account receives 403 User account is disabled on Service-validated route
[PASS] Scenario 33: BANNED account receives 403 User account is disabled on Service-validated route
[PASS] Scenario 34: Valid token for missing DB user receives 401 User account not found on Service-validated route
[PASS] Scenario 35: AccessTokenService signs and verifies expected typed payload
[PASS] Scenario 36: Token lifetime matches ACCESS_TOKEN_EXPIRES_IN (expected 900s, got 900s)
[PASS] Scenario 37: Malformed or invalid-signature token receives 401 Invalid or missing authentication token
[PASS] Scenario 38: Application configuration fails closed when ACCESS_TOKEN_SECRET is missing
[PASS] Scenario 39: Application configuration fails closed when ACCESS_TOKEN_EXPIRES_IN is missing/malformed
[PASS] Scenario 40: Compiled OpenAPI and source policy verify 8 controllers, 24 ops, 17 paths, 3 public ops, 21 protected ops, APP_GUARD=1, route AuthGuard=0, 0 passwordHash leak
==========================================
MODE=COMPILED_NEST_APP_MODULE_REAL_POSTGRESQL
EXECUTED=40
PASSED=40
FAILED=0
DEFERRED=0
==========================================
```

---

## 4. Static Quality Gate Results

1. **TypeScript Verification**:
   - Command: `corepack pnpm@11.15.1 exec tsc --noEmit -p tsconfig.json`
   - Result: **PASSED (exit code 0, 0 diagnostics)**
2. **ESLint Verification**:
   - Command: `corepack pnpm@11.15.1 exec eslint "{src,apps,libs,test}/**/*.ts"`
   - Result: **PASSED (exit code 0, 0 errors, 0 warnings)**
3. **Build Verification**:
   - Command: `corepack pnpm@11.15.1 run build`
   - Result: **PASSED (exit code 0)**
4. **Unit Test Suite**:
   - Command: `corepack pnpm@11.15.1 exec jest --runInBand`
   - Result: **PASSED (1 suite / 3 tests passed)**
5. **E2E Test Suite**:
   - Command: `node --experimental-vm-modules ./node_modules/jest/bin/jest.js --config ./test/jest-e2e.json --runInBand`
   - Result: **PASSED (1 suite / 2 tests passed)**

---

## 5. File Size & Line Count Ceilings

| File Path | Physical Line Count | Longest Method | Status |
| :--- | :--- | :--- | :--- |
| `src/app.module.ts` | 38 | N/A | PASSED (< 60) |
| `src/config/env.validation.ts` | 35 | `validateEnv` (26 lines) | PASSED (< 200) |
| `src/auth/decorators/public.decorator.ts` | 5 | N/A | PASSED (< 60) |
| `src/auth/guards/auth.guard.ts` | 121 | `canActivate` (84 lines) | PASSED (< 150) |
| `src/infrastructure/jwt/access-token.service.ts` | 38 | `sign` (12 lines) | PASSED (< 100) |
| `src/infrastructure/jwt/access-token.module.ts` | 10 | N/A | PASSED (< 60) |
| `src/auth/auth.module.ts` | 17 | N/A | PASSED (< 60) |
| `src/auth/auth.controller.ts` | 95 | `register` (7 lines) | PASSED (< 150) |
| `src/health/health.controller.ts` | 49 | `getHealth` (3 lines) | PASSED (< 150) |
| `src/pet/pet.controller.ts` | 59 | `getMyPet` (6 lines) | PASSED (< 150) |
| `src/workspace/workspace.controller.ts` | 143 | `createWorkspace` (9 lines) | PASSED (< 150) |
| `src/admin-content/admin-content.controller.ts` | 122 | `getAdminElements` (15 lines) | PASSED (< 150) |
