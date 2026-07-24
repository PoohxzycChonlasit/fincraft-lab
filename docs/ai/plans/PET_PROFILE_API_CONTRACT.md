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
- **Cardinality**: `ONE_USER_ONE_PET`
- **Pet Uniqueness**: `PET_USER_UNIQUENESS: DATABASE_ENFORCED` (`Pet.userId` has `@unique` in Prisma schema).

---

## 3. Avatar Strategy

- **Strategy**: `STORED_AVATAR_URL_WITHOUT_REMOTE_FETCH`
- **Behavior**:
  - `avatarUrl` is stored as an optional string in the database (`String?`).
  - Supports preset relative paths (e.g., `/assets/pets/cat-default.png`) or valid external image URLs.
  - The backend strictly stores and returns the string provided by the user.
  - **No Remote Fetch**: The backend MUST NOT initiate HTTP requests to fetch, download, or validate remote avatar URLs.
  - **No Upload / AI**: File uploads (multipart/base64), cloud storage (S3/Cloudinary), and AI image generation are deferred.

---

## 4. API Surface

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

## 5. DTO & Validation Specifications

### CreatePetDto (`POST /pets`)

```typescript
export class CreatePetDto {
  @ApiProperty({ example: 'Luna', description: 'Pet display name (1-50 chars)' })
  @IsDefined()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @MinLength(1)
  @MaxLength(50)
  name!: string;

  @ApiProperty({ enum: PetSpecies, example: PetSpecies.CAT, description: 'Pet species' })
  @IsDefined()
  @IsEnum(PetSpecies)
  species!: PetSpecies;

  @ApiPropertyOptional({ example: '/assets/pets/cat-luna.png', description: 'Avatar URL or preset path' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Curious and cautious with savings', description: 'Personality summary' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @MaxLength(200)
  personality?: string;

  @ApiPropertyOptional({ example: 'Build a 6-month emergency fund', description: 'Financial learning objective' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @MaxLength(200)
  learningGoal?: string;
}
```

### UpdatePetDto (`PATCH /pets/me`)

All fields are optional. At least one field must be provided (empty object `{}` returns `HTTP 400 Bad Request`).

```typescript
export class UpdatePetDto {
  @ApiPropertyOptional({ example: 'Luna Star', description: 'Updated Pet display name (1-50 chars)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ enum: PetSpecies, example: PetSpecies.DOG, description: 'Updated Pet species' })
  @IsOptional()
  @IsEnum(PetSpecies)
  species?: PetSpecies;

  @ApiPropertyOptional({ example: '/assets/pets/dog-luna.png', description: 'Updated avatar URL or preset path' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Energetic and focused on budgeting', description: 'Updated personality summary' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @MaxLength(200)
  personality?: string;

  @ApiPropertyOptional({ example: 'Understand interest rates and debt payoff', description: 'Updated learning objective' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @MaxLength(200)
  learningGoal?: string;
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

  @ApiProperty({ example: '/assets/pets/cat-luna.png', nullable: true, description: 'Avatar URL or preset path' })
  avatarUrl!: string | null;

  @ApiProperty({ example: 'Curious and cautious with savings', nullable: true, description: 'Personality summary' })
  personality!: string | null;

  @ApiProperty({ example: 'Build a 6-month emergency fund', nullable: true, description: 'Financial learning objective' })
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

## 6. Security, Ownership & Error Matrix

### User Security & Ownership
- All endpoints require an authenticated `ACTIVE` user via JWT Bearer access-token (`req.user.userId` / `user.sub`).
- `userId` is strictly derived from JWT context and MUST NOT be accepted from Params, Query, or Body.
- `forbidNonWhitelisted: true` in `ValidationPipe` rejects any attempt to supply `userId`, `id`, `createdAt`, or unexpected fields with `HTTP 400 Bad Request`.
- Responses MUST NOT leak `userId`, `passwordHash`, or raw `User` relations.

### HTTP Status Error Matrix

| Status Code | Scenario | Message |
| :--- | :--- | :--- |
| `200 OK` | Successful `GET /pets/me` or `PATCH /pets/me` | Payload in `{ "data": ... }` |
| `201 Created` | Successful `POST /pets` | Payload in `{ "data": ... }` |
| `400 Bad Request` | Validation failure (missing name/species, min/max length, bad enum, extra properties, empty PATCH object) | Validation error details |
| `401 Unauthorized` | Missing or invalid Bearer access token, or user account not found | `"User account not found"` / `"Unauthorized"` |
| `403 Forbidden` | User account status is `INACTIVE` or `BANNED` | `"User account is disabled"` |
| `404 Not Found` | `GET /pets/me` or `PATCH /pets/me` when user has no Pet profile | `"Pet profile not found"` |
| `409 Conflict` | `POST /pets` when user already has a Pet profile | `"Pet profile already exists"` |
| `500 Internal Error` | Unexpected database failure | `"Internal server error"` |

---

## 7. Swagger OpenAPI Specification

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

## 8. Future NestJS Architecture & File Structure

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

## 9. Future Runtime Acceptance Matrix (45 Scenarios)

### CREATE (`POST /pets`) — 8 Scenarios
1. Authenticated ACTIVE user creates a valid Pet (returns 201 Created with `{ "data": ... }`).
2. `userId` is strictly derived from JWT token.
3. Response excludes `userId` and `passwordHash`.
4. `name` is required, trimmed, length 1–50.
5. `species` is required, must be valid `PetSpecies` enum (`CAT`, `DOG`, `RABBIT`, `TURTLE`, `BIRD`).
6. Passing `id` or `userId` in body returns HTTP 400 Bad Request.
7. Unknown property returns HTTP 400 Bad Request.
8. Duplicate `POST /pets` when user already has a Pet returns HTTP 409 Conflict ("Pet profile already exists") without creating a duplicate row.

### READ (`GET /pets/me`) — 6 Scenarios
9. Authenticated owner retrieves own Pet profile (returns 200 OK).
10. `GET /pets/me` returns HTTP 404 Not Found ("Pet profile not found") when user has no Pet.
11. User can only read their own Pet profile (ownership strictly scoped to JWT payload).
12. Timestamps (`createdAt`, `updatedAt`) are formatted as ISO-8601 strings.
13. Response envelope matches `{ "data": { id, name, species, avatarUrl, personality, learningGoal, createdAt, updatedAt } }`.
14. Raw User relation and passwordHash absent from response.

### UPDATE (`PATCH /pets/me`) — 10 Scenarios
15. Owner updates single editable field (e.g. `name`).
16. Owner updates multiple editable fields (e.g. `personality`, `learningGoal`).
17. Successful update returns 200 OK with updated profile in `{ "data": ... }`.
18. `PATCH /pets/me` returns HTTP 404 Not Found ("Pet profile not found") when no Pet profile exists.
19. Attempting to update `userId` in body returns HTTP 400 Bad Request.
20. Attempting to update `id` in body returns HTTP 400 Bad Request.
21. Attempting to update system-managed fields returns HTTP 400 Bad Request.
22. Unknown property returns HTTP 400 Bad Request.
23. Empty PATCH body (`{}`) returns HTTP 400 Bad Request ("At least one editable field must be provided").
24. Invalid property value creates zero database mutation.

### AUTH AND USER STATUS — 4 Scenarios
25. Missing Bearer JWT access token returns HTTP 401 Unauthorized.
26. Invalid/malformed Bearer JWT access token returns HTTP 401 Unauthorized.
27. Inactive user (`UserStatus.INACTIVE`) returns HTTP 403 Forbidden ("User account is disabled").
28. Banned user (`UserStatus.BANNED`) returns HTTP 403 Forbidden ("User account is disabled").

### PERSISTENCE — 7 Scenarios
29. Valid creation creates exactly 1 record in `pets` table.
30. Repeated reads create 0 additional records.
31. Valid update mutates only specified columns in `pets` table.
32. Failed update leaves existing database row unchanged.
33. `createdAt` remains unchanged after update.
34. `updatedAt` is updated automatically by Prisma `@updatedAt`.
35. `Pet.userId` uniqueness is enforced at database level.

### NON-INTERFERENCE — 5 Scenarios
36. No `Element` row created or mutated.
37. No `UserElement` row created or mutated.
38. No `DiscoveryEvent` row created or mutated.
39. No `Workspace`, `WorkspaceNode`, or `WorkspaceEdge` row created or mutated.
40. No `SimulationRun` row created or mutated.

### SWAGGER AND REGRESSION — 5 Scenarios
41. Swagger OpenAPI document contains 3 Pet operations under `Pets` tag.
42. All 3 Pet operations require `access-token` Bearer security.
43. All 16 existing OpenAPI operations remain functional.
44. `/auth/register` and `/auth/login` remain public.
45. `passwordHash` remains absent across all OpenAPI schemas.

Total Scenarios: 45 (1 to 45 consecutively numbered without gaps or duplicates).

---

## 10. Implementation Sequence for Task P11_1B

1. Create DTOs: `CreatePetDto`, `UpdatePetDto`, `PetResponseDto`, `PetEnvelopeDto` in `src/pet/dto/`.
2. Create `pet-openapi.decorators.ts` in `src/pet/openapi/`.
3. Create `PetService` in `src/pet/pet.service.ts` (validate ACTIVE user, CRUD logic, 404/409 checks).
4. Create `PetController` in `src/pet/pet.controller.ts` with route decorators.
5. Create `PetModule` in `src/pet/pet.module.ts` and import into `AppModule`.
6. Add `Pets` tag to `src/openapi/setup-swagger.ts`.
7. Compile and run 45-scenario compiled PostgreSQL acceptance runner.
8. Execute Quality Gates (`tsc`, `eslint`, `build`, `unit`, `e2e`).
9. Update `SURVIVAL_MONTHS_SIMULATION_RUNTIME_ACCEPTANCE.md` / create `PET_PROFILE_RUNTIME_ACCEPTANCE.md`, `CURRENT_STATUS.md`, and `FILE_MAP.md`.
10. Commit locally.

---

## 11. Final Readiness Verdict

- **Contract Completeness**: Complete (All 26 sections defined).
- **Prisma Schema Fit**: `DIRECT_FIT` (0 migrations required).
- **Cardinality**: `ONE_USER_ONE_PET` (Database enforced).
- **Avatar Strategy**: `STORED_AVATAR_URL_WITHOUT_REMOTE_FETCH` (No remote fetch / upload).
- **API Surface**: `GET /pets/me`, `POST /pets`, `PATCH /pets/me`.
- **Status**: FROZEN AND APPROVED FOR IMPLEMENTATION.
