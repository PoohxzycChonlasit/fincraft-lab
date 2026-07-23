# FROZEN_CRAFT_SERVICE_IMPLEMENTATION_PLAN_V1

## Goal & Scope

This document specifies the frozen implementation plan for **CraftService V1** in **FinCraft Lab** to back the frozen `POST /craft` contract.

Crafting is the core discovery mechanism of FinCraft Lab. Authenticated users combine two financial Elements (e.g. `income` + `expense`) to produce a new Discovery Element or receive a `NO_RECIPE` outcome.

This planning task is documentation-only. No application source code, NestJS modules, controllers, services, DTOs, schema migrations, or database modifications are performed in this task.

---

## Actual Schema & Code Contracts Analysis

Analysis of relevant models from `prisma/schema.prisma`:

| Model | Primary/Unique Constraints | Relevant Fields & Types | Role in CraftService |
|---|---|---|---|
| **User** | `@id id` (UUID), `@unique email` | `status` (`UserStatus`: `ACTIVE`, `INACTIVE`, `BANNED`) | User account active state verification |
| **Element** | `@id id` (UUID), `@unique slug` | `isStarter` (Boolean), `status` (`ContentStatus`: `ACTIVE`, etc.), `name`, `emoji`, `elementType` | Input existence, status, starter check & Output payload mapping |
| **DiscoveryDetail** | `@id id` (UUID), `@unique elementId` | `shortDescription`, `realLesson`, `example`, `possibleBenefit`, `possibleTradeoff`, `hiddenRisk`, `worksWhen`, `becomesDifficultWhen`, `whatChangesOutcome`, `realityLevel`, `safetyLabel`, `sources` (Json) | Output discovery detail payload mapping & runtime source parsing |
| **CraftRecipe** | `@id id` (UUID), `@unique inputHash` | `outputElementId` (UUID), `ruleType` (`CraftRuleType`), `status` (`ContentStatus`) | Recipe lookup by input hash & active state check |
| **UserElement** | `@id id` (UUID), `@@unique([userId, elementId])` | `userId` (UUID), `elementId` (UUID), `unlockedAt` (DateTime) | Non-starter input ownership check & output unlock state (`isNewDiscovery`) |
| **DiscoveryEvent** | `@id id` (UUID), `@@index([userId, discoveredAt])` | `userId` (UUID), `recipeId` (UUID?), `resultElementId` (UUID?), `inputElementIds` (Json), `resultStatus` (`DiscoveryResultStatus`), `discoveredAt` (DateTime) | Audit log for every valid craft attempt (`SUCCESS` / `NO_RECIPE`) |

---

## Service Boundaries & Method Signature

`CraftService` will be an `@Injectable()` service residing in `src/craft/craft.service.ts`.

### Public Method Signature

```typescript
export class CraftService {
  constructor(private readonly prisma: PrismaService) {}

  async craft(
    userId: string,
    dto: CraftRequestDto,
  ): Promise<CraftResult>
}
```

- **Input Parameters**:
  - `userId`: `string` (Verified user UUID extracted via `@CurrentUser()` decorator from JWT payload).
  - `dto`: `CraftRequestDto` (Validated DTO containing `inputElementIds` array of 2 distinct UUID v4 strings).
- **Return Type**: `Promise<CraftResult>` (Explicit discriminated union type from `src/craft/types/craft-response.type.ts`).

---

## Exact Step-by-Step Execution Boundary

The plan enforces one strict execution boundary sequence across all requests:

### BEFORE TRANSACTION:
1. **DTO Validation**: Validated prior to service entry (`CraftRequestDto`: exactly 2 distinct UUID v4s).
2. **Input Hash Calculation**: Call `calculateCraftInputHash(dto.inputElementIds[0], dto.inputElementIds[1])` to generate `canonicalElementIds` (`[id1, id2]`) and SHA-256 `inputHash`.
3. **User Status Verification**: Query `User` by `userId`. Throw `UnauthorizedException('User account not found')` (401) if missing; throw `ForbiddenException('User account is disabled')` (403) if `status` is `INACTIVE` or `BANNED`.
4. **Input Element Resolution**: Query `Element` table where `id` in `dto.inputElementIds`. Throw `NotFoundException('Element not found')` (404) if count !== 2; throw `BadRequestException('Input element is not active')` (400) if any `status !== ContentStatus.ACTIVE`.
5. **Input Availability Verification**: For non-Starter inputs (`isStarter === false`), query `UserElement` where `userId === userId` AND `elementId` in `nonStarterElementIds`. Throw `ForbiddenException('Input element is not unlocked by user')` (403) if returned count !== non-Starter inputs length. (Starter elements are globally available).
6. **Recipe & Output Invariant Lookup**: Query `CraftRecipe` by `@unique inputHash` with relation `outputElement` including `discoveryDetail`.
   - If no matching active commutative recipe exists (`recipe === null` or `ruleType !== COMMUTATIVE` or `status !== ACTIVE`): Flag outcome as `NO_RECIPE`.
   - If matching active commutative recipe exists: Verify `outputElement.status === ContentStatus.ACTIVE`, `outputElement.isStarter === false`, `outputElement.discoveryDetail !== null`, and parse `discoveryDetail.sources` via `parseCraftSources()`. Throw `InternalServerErrorException('Invalid output element or discovery detail configuration')` (500) if any invariant fails.

### INSIDE TRANSACTION (`prisma.$transaction(async (tx) => ...)`):
7. **NO_RECIPE Outcome**:
   - Create `DiscoveryEvent` (`userId`, `recipeId: null`, `resultElementId: null`, `inputElementIds: canonicalElementIds`, `resultStatus: DiscoveryResultStatus.NO_RECIPE`, `discoveredAt: new Date()`).
   - Commit transaction.
8. **DISCOVERY Outcome**:
   - Call `tx.userElement.findUnique({ where: { userId_elementId: { userId, elementId: outputElement.id } } })`.
   - If `UserElement` exists: Set `isNewDiscovery = false`.
   - If `UserElement` does not exist: Call `tx.userElement.create({ data: { userId, elementId: outputElement.id, unlockedAt: new Date() } })` and set `isNewDiscovery = true`.
   - Create `DiscoveryEvent` (`userId`, `recipeId: recipe.id`, `resultElementId: outputElement.id`, `inputElementIds: canonicalElementIds`, `resultStatus: DiscoveryResultStatus.SUCCESS`, `discoveredAt: new Date()`).
   - Commit transaction.

### AFTER COMMIT:
9. **Response Mapping**: Map Prisma entity data to `CraftResult` (`CraftDiscoveryResult` or `CraftNoRecipeResult`). Controller envelope `{ data: result }` remains outside `CraftService`.

*Content Consistency Note*: Master content tables (`Element`, `CraftRecipe`, `DiscoveryDetail`) are assumed stable during single-request execution. Write atomicity strictly covers `UserElement` and `DiscoveryEvent`.

---

## Technical Decisions & Concurrency Strategy

### 1. User Status Policy
- `AuthGuard` verifies JWT signature and payload claims but does not query PostgreSQL.
- `CraftService` queries `User` status during request execution:
  - Missing user: Throws `UnauthorizedException('User account not found')` (401).
  - `user.status === UserStatus.INACTIVE / BANNED`: Throws `ForbiddenException('User account is disabled')` (403).

### 2. Runtime Sources Parser
- Pure helper function `parseCraftSources(rawSources: unknown): CraftSourceResponse[]` located in `src/craft/parsers/craft-sources.parser.ts`.
- Validates:
  - `rawSources` is an Array.
  - Each item is a non-null Object with non-empty string properties `title`, `organization`, `url`.
  - Rejects missing fields, non-string types, empty strings, or extra fields by throwing an Error (mapped to 500 Internal Server Error).

### 3. Concurrency Strategy (`@@unique([userId, elementId])`)
- **First Unlock & Rediscovery Strategy**:
  1. Inside interactive `$transaction`, call `tx.userElement.findUnique({ where: { userId_elementId: { userId, elementId: outputElement.id } } })`.
  2. If row exists: Set `isNewDiscovery = false`, create `SUCCESS` `DiscoveryEvent`.
  3. If row is missing: Attempt `tx.userElement.create(...)`, set `isNewDiscovery = true`, create `SUCCESS` `DiscoveryEvent`.
  4. If `tx.userElement.create` encounters a concurrent unique collision:
     - The current PostgreSQL transaction block aborts (`25P02`). Do not continue inside that transaction block.
     - Catch the error outside `$transaction` and pass through a narrow P2002 classifier.
     - Start **1 fresh `$transaction` retry**.
  5. On retry, `tx.userElement.findUnique` finds the existing `UserElement` row created by the winning request, sets `isNewDiscovery = false`, and successfully records the second `DiscoveryEvent`.
  6. Maximum fresh transaction retries: **1**.
  7. Prisma `upsert` is **prohibited** for `isNewDiscovery` boolean determination.

### 4. Narrow P2002 Classification
Retry is permitted **only** when all of the following conditions are true:
- Error is an instance of `Prisma.PrismaClientKnownRequestError` imported from `src/database/generated/prisma/client`.
- `error.code === 'P2002'`.
- `error.meta?.target` (or error metadata) identifies the `UserElement` composite unique constraint (`userId` + `elementId`).
- The failed operation occurred on the `tx.userElement.create` path.

*Unrelated P2002 Errors*: Unrelated unique constraint failures (if any) are not retried and propagate directly as unexpected database failures (500).

---

## Planned Implementation Files

| File Path | Target Physical Lines | Purpose / Responsibility |
|---|---|---|
| `src/craft/craft.service.ts` | ~200 - 250 lines | Core business logic, status checks, recipe lookup, transaction management & retry wrapper |
| `src/craft/parsers/craft-sources.parser.ts` | ~30 - 45 lines | Pure runtime validator for `DiscoveryDetail.sources` Json |
| `src/craft/mappers/craft-response.mapper.ts` | ~40 - 60 lines | Pure DTO transformation mapping Prisma entities to `CraftResult` |

*Prohibited Patterns*: No repository layers, no CQRS, no generic base services, no event buses, and no new external dependencies.

---

## Error Mapping Matrix

| Cause / Scenario | Exception Class | HTTP Code | Public Message Envelope |
|---|---|---|---|
| Malformed DTO / Non-UUID | `BadRequestException` | 400 | Class-validator standard response |
| Duplicate input IDs | `BadRequestException` | 400 | `"inputElementIds must contain unique values"` |
| Input Element `status !== ACTIVE` | `BadRequestException` | 400 | `"Input element is not active"` |
| JWT token missing / invalid | `UnauthorizedException` | 401 | `"Invalid or missing authentication token"` |
| User account missing in DB | `UnauthorizedException` | 401 | `"User account not found"` |
| User `status === INACTIVE / BANNED` | `ForbiddenException` | 403 | `"User account is disabled"` |
| Non-Starter input not unlocked | `ForbiddenException` | 403 | `"Input element is not unlocked by user"` |
| Input Element ID not found | `NotFoundException` | 404 | `"Element not found"` |
| Valid pair, no active recipe | None | 200 | `{ "data": { "outcome": "NO_RECIPE" } }` |
| Valid pair, active recipe | None | 200 | `{ "data": { "outcome": "DISCOVERY", "isNewDiscovery": boolean, ... } }` |
| Corrupt Detail / DB Failure | `InternalServerErrorException` | 500 | `"Internal server error"` |

---

## Project No-Spec Testing Policy Compliance

In strict compliance with project rules defined in `AGENTS.md` and `SKILL.md`:

1. **No Spec File Creation**: No new `*.spec.ts` files may be generated or hand-created without explicit owner authorization. All Nest CLI generators must be executed with `--no-spec`.
2. **No Automatic Spec Generation**: A general prompt directive for thorough testing does not authorize creating unit spec files.
3. **Authorized Evidence Verification Methods**:
   - **Temporary Untracked TypeScript Scripts**: Used for bounded service verification. Scripts must avoid unsafe type casts/suppressions, must be deleted before commit, and must remain untracked.
   - **Existing E2E Test (`test/app.e2e-spec.ts`)**: Used for endpoint-level integration testing when authorized.
   - **Postman Runtime Acceptance**: Used for HTTP API contract verification.
   - **Read-Only Database Effect Verification**: Used for verifying database state changes (`UserElement` & `DiscoveryEvent` counts).
   - **Bounded Parallel Verification Script**: Used specifically for simulating concurrent request races.

---

## Postman Runtime Acceptance Deliverable

### Bounded Deliverable Task
Future Task: `P6_CRAFT_API_POSTMAN_RUNTIME_ACCEPTANCE_001`

This task will execute only after:
- Craft sources parser passes audit;
- Craft mapper passes audit;
- CraftService passes audit;
- CraftModule and CraftController pass audit;
- `POST /craft` passes post-commit audit.

### Readiness Policy (`craftReady`)
- `craftReady = false` in local environment prior to endpoint completion.
- `craftReady = true` in local Postman Environment only after `POST /craft` passes all implementation audits.

### Postman Artifacts
The Postman task will update or verify:
- `FinCraft_Lab_Postman_Collection_v1.json`
- `FinCraft_Lab_Local.postman_environment.json`
- `FinCraft_Lab_Postman_Test_Guide_v1.md`
- `FinCraft_Lab_Postman_Setup_and_Test_Checklist.xlsx` (when maintained as project evidence).

### Postman UUID & Security Policy
- **UUID Policy**: Endpoint accepts UUIDs. Real Element UUIDs are populated dynamically in local Postman Environment via a read-only local script or future `GET /elements` endpoint. Committed Collection artifacts must contain zero real database UUIDs (only non-existent UUID fixtures like `"00000000-0000-0000-0000-000000000000"` for negative tests). Real UUIDs are never copied into frozen application source constants.
- **Security Policy**: Committed Postman files must never contain `DATABASE_URL`, JWT secret keys, real user passwords, or production tokens. `accessToken` is acquired dynamically by Login requests in the local environment.

### 20 Postman Runtime Acceptance Scenarios

| # | Scenario | HTTP Status | Response Outcome | UserElement Effect | DiscoveryEvent Effect | Leak Prevention |
|---|---|---|---|---|---|---|
| 1 | First Discovery | 200 OK | `DISCOVERY` (`isNewDiscovery: true`) | +1 row | +1 row (`SUCCESS`) | Verified |
| 2 | Rediscovery | 200 OK | `DISCOVERY` (`isNewDiscovery: false`) | Unchanged | +1 row (`SUCCESS`) | Verified |
| 3 | Reverse Input Order | 200 OK | `DISCOVERY` (same as `[A, B]`) | Same as `[A, B]` | +1 row (`SUCCESS`) | Verified |
| 4 | Valid Pair, No Recipe | 200 OK | `NO_RECIPE` | Unchanged | +1 row (`NO_RECIPE`) | Verified |
| 5 | Duplicate Input IDs | 400 Bad Request | Error envelope | Unchanged | None | Verified |
| 6 | Invalid UUID | 400 Bad Request | Error envelope | Unchanged | None | Verified |
| 7 | Missing inputElementIds | 400 Bad Request | Error envelope | Unchanged | None | Verified |
| 8 | Extra Internal Field | 400 Bad Request | Error envelope | Unchanged | None | Verified |
| 9 | Missing Bearer Token | 401 Unauthorized | Error envelope | Unchanged | None | Verified |
| 10 | Unknown Element ID | 404 Not Found | Error envelope | Unchanged | None | Verified |
| 11 | Inactive Input Element | 400 Bad Request | Error envelope | Unchanged | None | Verified |
| 12 | Unavailable Non-Starter | 403 Forbidden | Error envelope | Unchanged | None | Verified |
| 13 | Inactive Craft Recipe | 200 OK | `NO_RECIPE` | Unchanged | +1 row (`NO_RECIPE`) | Verified |
| 14 | INACTIVE User Account | 403 Forbidden | Error envelope | Unchanged | None | Verified |
| 15 | BANNED User Account | 403 Forbidden | Error envelope | Unchanged | None | Verified |
| 16 | Internal Field Leak Check | 200 OK | `DISCOVERY` / `NO_RECIPE` | Standard | Standard | Excludes recipeId, inputHash, userId, etc. |
| 17 | UserElement Effect | 200 OK | `DISCOVERY` | Verified +1 row | Verified +1 row | Verified |
| 18 | DiscoveryEvent Effect | 200 OK | `DISCOVERY` / `NO_RECIPE` | Verified | Verified event status & inputElementIds | Verified |
| 19 | Transaction Rollback | 500 Internal Error | Error envelope | Rolled back (0 added) | Rolled back (0 added) | Verified |
| 20 | Concurrent Discovery Race | Both 200 OK | 1 true, 1 false | Exactly +1 row | Exactly +2 rows (`SUCCESS`) | Verified |

### Postman Concurrency & DB Effect Policies
- **Concurrency Policy**: Standard sequential Collection Runner is insufficient to prove race conditions. Scenario 20 requires a parallel-capable runner or bounded parallel script executing simultaneous requests. Exactly 1 request receives `isNewDiscovery: true`, competing requests receive `isNewDiscovery: false`, exactly 1 `UserElement` row is created, and both log `DiscoveryEvent`.
- **Database Effects Policy**: Post-test verification queries verify row counts, `resultStatus`, canonical `inputElementIds`, `recipeId`/`resultElementId` nullability for `NO_RECIPE`, absence of duplicate `UserElement` rows, and transaction rollback on error. Database rows are never manually mutated to force tests to pass; test fixtures for inactive/banned states are managed via approved test-data tasks or Admin APIs.

---

## Verification Plan

### Non-Mutating Verification
1. Type Checking: `corepack pnpm@11.15.1 exec tsc --noEmit -p tsconfig.json`
2. Linting: `corepack pnpm@11.15.1 run lint`
3. Git Status & Diff Check:
   - `git status --short`
   - `git diff --stat`

Expected altered files:
- `docs/ai/plans/CRAFT_SERVICE_IMPLEMENTATION_PLAN.md`
- `docs/ai/CURRENT_STATUS.md`
- `docs/ai/FILE_MAP.md`
