# Pet Profile API Contract

This document freezes the exact MVP API contract for the **Pet Profile** feature in FinCraft Lab.

FROZEN MARKER: `FROZEN_PET_PROFILE_API_CONTRACT_V1`

---

## 1. Scope & Product Role

### Product Role
The **Pet** serves as the user's personal financial guide and visual companion in FinCraft Lab.
- **One User, One Pet**: Each active user may create and own exactly one Pet profile (`ONE_USER_ONE_PET`).
- **Personal Companion**: The Pet represents the user's learning journey, personality, and focus goal inside the lab.
- **Session Persistence**: Saved in PostgreSQL database and persistent across user sessions.

### Out of Scope (Explicitly Deferred)
- **Crafting Engine**: Pet is NOT a Craft recipe input or produced element.
- **Simulations**: Pet does NOT alter financial calculation outputs or simulation rules.
- **Discovery**: Pet does NOT unlock elements or trigger DiscoveryEvents.
- **Workspace/Canvas**: Pet does NOT mutate workspace nodes or edges.
- **AI Behavior**: No AI text generation, automated chat, or autonomous behavior in MVP.
- **Image Generation / Upload**: No multipart file upload, base64 encoding, remote image fetching, or AI image generation.
- **Progression / Gamification**: No XP, leveling, mood, hunger, items, currency, or evolution in MVP.
- **Social / Public Lookup**: Pet profiles are private to the owning authenticated user.

---

## 2. Prisma Model Analysis

From `prisma/schema.prisma`:

```prisma
enum PetSpecies {
  CAT
  DOG
  RABBIT
  TURTLE
  BIRD

  @@map("pet_species")
}

model Pet {
  id           String     @id @default(uuid()) @db.Uuid
  userId       String     @unique @map("user_id") @db.Uuid
  name         String
  species      PetSpecies
  avatarUrl    String?    @map("avatar_url")
  personality  String?
  learningGoal String?    @map("learning_goal")
  createdAt    DateTime   @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt    DateTime   @updatedAt @map("updated_at") @db.Timestamptz(6)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("pets")
}
```

### Field Ownership & Classification Matrix

| Prisma Field | Database Type | Nullable | Default | Unique | User Writable | System Managed | Public Response |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | NO | `uuid()` | YES (PK) | NO | YES | YES |
| `userId` | `UUID` | NO | None | YES (FK) | NO | YES | NO |
| `name` | `String` | NO | None | NO | YES | NO | YES |
| `species` | `PetSpecies` (Enum) | NO | None | NO | YES | NO | YES |
| `avatarUrl` | `String?` | YES | `null` | NO | YES | NO | YES |
| `personality` | `String?` | YES | `null` | NO | YES | NO | YES |
| `learningGoal` | `String?` | YES | `null` | NO | YES | NO | YES |
| `createdAt` | `Timestamptz(6)` | NO | `now()` | NO | NO | YES | YES |
| `updatedAt` | `Timestamptz(6)` | NO | `updatedAt` | NO | NO | NO (Auto) | YES |

### Schema Fit & Uniqueness Verdict
- **Prisma Schema Fit**: `DIRECT_FIT` for all fields.
- **PRISMA_SCHEMA_CHANGE_REQUIRED**: `NO` (0 Prisma migrations required).
- **MIGRATION_REQUIRED**: `NO`
- **Cardinality**: `ONE_USER_ONE_PET`
- **Pet Uniqueness**: `PET_USER_UNIQUENESS: DATABASE_ENFORCED` (`Pet.userId` has `@unique` constraint in Prisma schema).
- **Concurrent Duplicate Mapping**: `CONCURRENT_DUPLICATE_MAPPING: REQUIRED` (Prisma P2002 unique constraint violation mapped to HTTP 409 Conflict).

---

## 3. Avatar Strategy

- **Strategy**: `STORED_HTTPS_AVATAR_URL_WITHOUT_REMOTE_FETCH`
- **Validation Rules for `avatarUrl`**:
  - Optional on Create (`POST /pets`); optional on Patch (`PATCH /pets/me`).
  - Allowed types: `string` or `null` where permitted.
  - String inputs are trimmed before validation.
  - Maximum length: 2048 characters.
  - Require a syntactically valid absolute URL starting with `https://` (`HTTPS` protocol only).
  - Reject `http://` (HTTP).
  - Reject `data:` (data URLs / base64 images).
  - Reject `file:` (local file paths).
  - Reject `javascript:` (script execution URLs).
  - Reject empty or whitespace-only strings (returns `HTTP 400 Bad Request`).
  - **No Remote Fetch**: Backend stores the string in DB (`avatarUrl` column) only. Backend performs NO remote HTTP request, NO file download, NO image-content inspection, and NO moderation or safety guarantee.
  - On `PATCH /pets/me`: Passing explicit `null` (`"avatarUrl": null`) clears `avatarUrl` to `null` in DB.
  - On `PATCH /pets/me`: Omitting `avatarUrl` preserves the existing `avatarUrl` value in DB.

---

## 4. Nullable Field Semantics & Input Rules

### `avatarUrl`, `personality`, `learningGoal`
- **CREATE (`POST /pets`)**:
  - Omitted: store `null`.
  - Explicit `null`: store `null`.
  - Valid non-empty string: store normalized trimmed value.
  - Empty or whitespace-only string: `HTTP 400 Bad Request`.
- **PATCH (`PATCH /pets/me`)**:
  - Omitted: preserve existing DB value.
  - Explicit `null`: clear field to `null` in DB.
  - Valid non-empty string: replace with normalized trimmed value.
  - Empty or whitespace-only string: `HTTP 400 Bad Request`.

### `name`
- Required on Create (`POST /pets`); optional on Patch (`PATCH /pets/me`).
- Explicit `null` is REJECTED (`HTTP 400 Bad Request`).
- Trimmed before validation.
- Whitespace-only string is REJECTED (`HTTP 400 Bad Request`).
- Length: 1 to 50 characters after trimming.

### `species`
- Required on Create (`POST /pets`); optional on Patch (`PATCH /pets/me`).
- Explicit `null` is REJECTED (`HTTP 400 Bad Request`).
- Must match `PetSpecies` enum exactly (`CAT`, `DOG`, `RABBIT`, `TURTLE`, `BIRD`).

---

## 5. API Surface

| Method | Path | Auth Required | Success Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/pets/me` | Yes (`access-token`) | `200 OK` | Get authenticated user's Pet profile |
| `POST` | `/pets` | Yes (`access-token`) | `201 Created` | Create authenticated user's first Pet profile |
| `PATCH` | `/pets/me` | Yes (`access-token`) | `200 OK` | Update authenticated user's existing Pet profile |

### Deferred Endpoints
- `DELETE /pets/me`: DEFERRED (Pet identity is persistent; cascading deletion handled on account deletion via `onDelete: Cascade`).
- `GET /pets`: DEFERRED (No public directory).
- `GET /pets/:petId` / `PATCH /pets/:petId`: DEFERRED (Ownership is derived strictly from JWT, route uses `/pets/me`).

---

## 6. DTO & Validation Specifications

### CreatePetDto (`POST /pets`)

```typescript
export class CreatePetDto {
  @ApiProperty({ example: 'Luna', description: 'Pet display name (1-50 chars)' })
  @IsDefined()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(1)
  @MaxLength(50)
  name!: string;

  @ApiProperty({ enum: PetSpecies, example: PetSpecies.CAT, description: 'Pet species' })
  @IsDefined()
  @IsEnum(PetSpecies)
  species!: PetSpecies;

  @ApiPropertyOptional({ example: 'https://example.com/pets/cat.png', description: 'HTTPS avatar URL' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(2048)
  @Matches(/^https:\/\//, { message: 'avatarUrl must be a valid HTTPS URL' })
  @IsUrl({ protocols: ['https'], require_protocol: true })
  avatarUrl?: string | null;

  @ApiPropertyOptional({ example: 'Curious and cautious with savings', description: 'Personality summary' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(200)
  personality?: string | null;

  @ApiPropertyOptional({ example: 'Build a 6-month emergency fund', description: 'Financial learning objective' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(200)
  learningGoal?: string | null;
}
```

### UpdatePetDto (`PATCH /pets/me`)

All fields are optional. At least one field must be provided (empty object `{}` returns `HTTP 400 Bad Request`).

```typescript
export class UpdatePetDto {
  @ApiPropertyOptional({ example: 'Luna Star', description: 'Updated Pet display name (1-50 chars)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ enum: PetSpecies, example: PetSpecies.DOG, description: 'Updated Pet species' })
  @IsOptional()
  @IsEnum(PetSpecies)
  species?: PetSpecies;

  @ApiPropertyOptional({ example: 'https://example.com/pets/dog.png', description: 'Updated HTTPS avatar URL or null to clear' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(2048)
  @Matches(/^https:\/\//, { message: 'avatarUrl must be a valid HTTPS URL' })
  @IsUrl({ protocols: ['https'], require_protocol: true })
  avatarUrl?: string | null;

  @ApiPropertyOptional({ example: 'Energetic and focused on budgeting', description: 'Updated personality summary or null to clear' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(200)
  personality?: string | null;

  @ApiPropertyOptional({ example: 'Understand interest rates and debt payoff', description: 'Updated learning objective or null to clear' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(200)
  learningGoal?: string | null;
}
```

### Public Response DTOs

```typescript
export class PetResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Pet UUID v4' })
  id!: string;

  @ApiProperty({ example: 'Luna', description: 'Pet display name' })
  name!: string;

  @ApiProperty({ enum: PetSpecies, example: PetSpecies.CAT, description: 'Pet species' })
  species!: PetSpecies;

  @ApiProperty({ example: 'https://example.com/pets/cat.png', nullable: true, description: 'HTTPS avatar URL or null' })
  avatarUrl!: string | null;

  @ApiProperty({ example: 'Curious and cautious with savings', nullable: true, description: 'Personality summary or null' })
  personality!: string | null;

  @ApiProperty({ example: 'Build a 6-month emergency fund', nullable: true, description: 'Financial learning objective or null' })
  learningGoal!: string | null;

  @ApiProperty({ example: '2026-07-24T12:00:00.000Z', description: 'ISO-8601 creation timestamp' })
  createdAt!: string;

  @ApiProperty({ example: '2026-07-24T12:00:00.000Z', description: 'ISO-8601 update timestamp' })
  updatedAt!: string;
}

export class PetEnvelopeDto {
  @ApiProperty({ type: PetResponseDto, description: 'Pet profile payload' })
  data!: PetResponseDto;
}
```

---

## 7. Security, Ownership & Error Matrix

### User Security & Ownership
- All endpoints require an authenticated `ACTIVE` user via JWT Bearer access-token (`req.user.userId` / `user.sub`).
- `userId` is strictly derived from JWT context and MUST NOT be accepted from Params, Query, or Body.
- `forbidNonWhitelisted: true` in `ValidationPipe` rejects any attempt to supply `userId`, `id`, `ownerId`, `createdAt`, `updatedAt`, or unexpected fields with `HTTP 400 Bad Request`.
- Responses MUST NOT leak `userId`, `passwordHash`, or raw `User` relations.

### Authentication & Authorization Source Behavior
Reused directly from current project implementation (`AuthGuard` & `validateUser` pattern):
- **Missing JWT**: `AuthGuard` throws `UnauthorizedException('Invalid or missing authentication token')` -> `HTTP 401 Unauthorized`.
- **Invalid JWT**: `AuthGuard` throws `UnauthorizedException('Invalid or missing authentication token')` -> `HTTP 401 Unauthorized`.
- **Missing User in DB**: `validateUser` throws `UnauthorizedException('User account not found')` -> `HTTP 401 Unauthorized`.
- **INACTIVE User**: `validateUser` throws `ForbiddenException('User account is disabled')` -> `HTTP 403 Forbidden`.
- **BANNED User**: `validateUser` throws `ForbiddenException('User account is disabled')` -> `HTTP 403 Forbidden`.

### HTTP Status Error Matrix

| Status Code | Scenario | Message |
| :--- | :--- | :--- |
| `200 OK` | Successful `GET /pets/me` or `PATCH /pets/me` | Payload in `{ "data": ... }` |
| `201 Created` | Successful `POST /pets` | Payload in `{ "data": ... }` |
| `400 Bad Request` | Validation failure (missing name/species, min/max length, non-HTTPS URL, bad enum, extra properties, empty PATCH object) | Validation error details or `"At least one editable field must be provided"` |
| `401 Unauthorized` | Missing or invalid Bearer access token, or user account not found | `"Invalid or missing authentication token"` / `"User account not found"` |
| `403 Forbidden` | User account status is `INACTIVE` or `BANNED` | `"User account is disabled"` |
| `404 Not Found` | `GET /pets/me` or `PATCH /pets/me` when user has no Pet profile | `"Pet profile not found"` |
| `409 Conflict` | `POST /pets` when user already has a Pet profile (pre-check or DB race condition) | `"Pet profile already exists"` |
| `500 Internal Error` | Unexpected database failure | `"Internal server error"` |

---

## 8. Duplicate & Concurrency Handling

1. **Friendly Service Pre-check**:
   `prisma.pet.findUnique({ where: { userId } })` -> If existing Pet is found, throw `ConflictException('Pet profile already exists')` -> `HTTP 409 Conflict`.
2. **Concurrent Database Conflict Mapping**:
   Catch Prisma unique constraint violation code `P2002` on `Pet.userId` -> map safely to `ConflictException('Pet profile already exists')` -> `HTTP 409 Conflict`.
3. **No Database Leaks**: No raw Prisma error codes (`P2002`), constraint names (`pets_user_id_key`), database messages, or stack traces escape in public HTTP responses.

---

## 9. Swagger OpenAPI Specification

- **Tag**: `Pets` ("User personal pet guide profile management")
- **Security**: `access-token` (Bearer JWT)
- **Operations (3)**:
  1. `GET /pets/me`: Get my Pet profile
  2. `POST /pets`: Create my Pet profile
  3. `PATCH /pets/me`: Update my Pet profile
- **Expected OpenAPI Totals After Implementation**:
  - Controllers: **7**
  - Unique Paths: **14**
  - Total Operations: **19**

---

## 10. Future NestJS Architecture & File Structure

Feature Root Policy (`src/pet/`):
```text
src/pet/
├── pet.module.ts
├── pet.controller.ts
├── pet.service.ts
├── dto/
│   ├── create-pet.dto.ts
│   ├── update-pet.dto.ts
│   └── pet-response.dto.ts
├── openapi/
│   └── pet-openapi.decorators.ts
└── mappers/
    └── pet-response.mapper.ts
```

- Primary `pet.module.ts`, `pet.controller.ts`, `pet.service.ts` MUST stay at feature root `src/pet/`.
- No `controllers/` or `services/` subdirectories.
- No `index.ts` barrel files.

---

## 11. Reconciled Future Runtime Acceptance Matrix (50 Scenarios)

### CREATE (`POST /pets`) — 9 Scenarios
1. Authenticated ACTIVE user creates a valid Pet (returns 201 Created with `{ "data": ... }`).
2. `userId` is strictly derived from JWT token.
3. Response excludes `userId` and `passwordHash`.
4. `name` is required, trimmed, length 1–50 (whitespace-only returns 400 Bad Request).
5. `species` is required, must be valid `PetSpecies` enum (`CAT`, `DOG`, `RABBIT`, `TURTLE`, `BIRD`).
6. `avatarUrl` accepts syntactically valid HTTPS URL (non-HTTPS, HTTP, file:, data:, or malformed URL returns 400 Bad Request).
7. Passing `id` or `userId` in body returns HTTP 400 Bad Request.
8. Unknown property returns HTTP 400 Bad Request.
9. Duplicate `POST /pets` when user already has a Pet returns HTTP 409 Conflict ("Pet profile already exists") via pre-check or concurrent DB race mapping without creating a duplicate row.

### READ (`GET /pets/me`) — 6 Scenarios
10. Authenticated owner retrieves own Pet profile (returns 200 OK).
11. `GET /pets/me` returns HTTP 404 Not Found ("Pet profile not found") when user has no Pet.
12. User can only read their own Pet profile (ownership strictly scoped to JWT payload).
13. Timestamps (`createdAt`, `updatedAt`) are formatted as ISO-8601 strings.
14. Response envelope matches `{ "data": { id, name, species, avatarUrl, personality, learningGoal, createdAt, updatedAt } }`.
15. Raw User relation and passwordHash absent from response.

### UPDATE (`PATCH /pets/me`) — 13 Scenarios
16. Owner updates single editable field (e.g. `name`).
17. Owner updates multiple editable fields (e.g. `personality`, `learningGoal`).
18. Explicit `null` on nullable field (`avatarUrl`, `personality`, `learningGoal`) clears field to `null` in DB.
19. Omitted field on PATCH leaves existing DB value unchanged.
20. Successful update returns 200 OK with updated profile in `{ "data": ... }`.
21. `PATCH /pets/me` returns HTTP 404 Not Found ("Pet profile not found") when no Pet profile exists.
22. Attempting to update `userId` in body returns HTTP 400 Bad Request.
23. Attempting to update `id` in body returns HTTP 400 Bad Request.
24. Attempting to update system-managed fields returns HTTP 400 Bad Request.
25. Unknown property returns HTTP 400 Bad Request.
26. Empty PATCH body (`{}`) returns HTTP 400 Bad Request ("At least one editable field must be provided").
27. Non-HTTPS or whitespace-only avatarUrl on PATCH returns HTTP 400 Bad Request.
28. Failed PATCH (e.g. validation error) leaves existing database row completely unchanged.

### AUTH AND USER STATUS — 5 Scenarios
29. Missing Bearer JWT access token returns HTTP 401 Unauthorized ("Invalid or missing authentication token").
30. Invalid/malformed Bearer JWT access token returns HTTP 401 Unauthorized ("Invalid or missing authentication token").
31. User no longer exists in DB returns HTTP 401 Unauthorized ("User account not found").
32. Inactive user (`UserStatus.INACTIVE`) returns HTTP 403 Forbidden ("User account is disabled").
33. Banned user (`UserStatus.BANNED`) returns HTTP 403 Forbidden ("User account is disabled").

### PERSISTENCE — 7 Scenarios
34. Valid creation creates exactly 1 record in `pets` table.
35. Repeated reads create 0 additional records.
36. Valid update mutates only specified columns in `pets` table.
37. Failed update leaves existing database row unchanged.
38. `createdAt` remains unchanged after update.
39. `updatedAt` is updated automatically by Prisma `@updatedAt`.
40. `Pet.userId` uniqueness is enforced at database level.

### NON-INTERFERENCE — 5 Scenarios
41. No `Element` row created or mutated.
42. No `UserElement` row created or mutated.
43. No `DiscoveryEvent` row created or mutated.
44. No `Workspace`, `WorkspaceNode`, or `WorkspaceEdge` row created or mutated.
45. No `SimulationRun` row created or mutated.

### SWAGGER AND REGRESSION — 5 Scenarios
46. Swagger OpenAPI document contains 3 Pet operations under `Pets` tag.
47. All 3 Pet operations require `access-token` Bearer security.
48. All 16 existing OpenAPI operations remain functional.
49. `/auth/register` and `/auth/login` remain public.
50. `passwordHash` remains absent across all OpenAPI schemas.

Total Scenarios: 50 (1 to 50 consecutively numbered without gaps or duplicates).

---

## 12. Implementation Sequence for Task P11_1B

1. Create DTOs: `CreatePetDto`, `UpdatePetDto`, `PetResponseDto`, `PetEnvelopeDto` in `src/pet/dto/`.
2. Create `pet-openapi.decorators.ts` in `src/pet/openapi/`.
3. Create `PetService` in `src/pet/pet.service.ts` (validate ACTIVE user, CRUD logic, 404/409 checks, P2002 race mapping).
4. Create `PetController` in `src/pet/pet.controller.ts` with route decorators.
5. Create `PetModule` in `src/pet/pet.module.ts` and import into `AppModule`.
6. Add `Pets` tag to `src/openapi/setup-swagger.ts`.
7. Compile and run 50-scenario compiled PostgreSQL acceptance runner.
8. Execute Quality Gates (`tsc`, `eslint`, `build`, `unit`, `e2e`).
9. Create `PET_PROFILE_RUNTIME_ACCEPTANCE.md`, update `CURRENT_STATUS.md` and `FILE_MAP.md`.
10. Commit locally.

---

## 13. Final Readiness Verdict

- **Contract Completeness**: Complete (All 13 sections reconciled).
- **Prisma Schema Fit**: `DIRECT_FIT` (0 migrations required).
- **Cardinality**: `ONE_USER_ONE_PET` (Database enforced).
- **Avatar Strategy**: `STORED_HTTPS_AVATAR_URL_WITHOUT_REMOTE_FETCH`.
- **Nullable Field Semantics**: Reconciled (omitted vs explicit null vs whitespace).
- **Auth Behavior**: Reconciled with existing project source (`AuthGuard` & `validateUser`).
- **Concurrent Duplicate Mapping**: Reconciled (pre-check + Prisma P2002 unique constraint mapping).
- **API Surface**: `GET /pets/me`, `POST /pets`, `PATCH /pets/me`.
- **Status**: FROZEN AND RECONCILED FOR IMPLEMENTATION.
