# Workspace Metadata CRUD API Plan & Frozen Contract

- **TASK_ID**: `P8_WORKSPACE_API_1A_FREEZE_WORKSPACE_CRUD_CONTRACT_001`
- **CORRECTION_HISTORY**: `P8_WORKSPACE_API_1A_FIX_WORKSPACE_CRUD_CONTRACT_001`
- **CONTRACT_MARKER**: `FROZEN_WORKSPACE_METADATA_CRUD_API_CONTRACT_V1`
- **STATUS**: FROZEN_PLANNING
- **EXPECTED STARTING COMMIT**: `a769f32def14bcb2fb322f729c9b807b444cd688`
- **PROJECT ROOT**: `C:\devnest 101\single-project\fincraft-lab`
- **BACKEND ROOT**: `C:\devnest 101\single-project\fincraft-lab\fincraft-lab-api`

---

## 1. Problem Statement & Context

FinCraft Lab users need to create, list, view, update, and delete their saved Canvas Workspaces. A Workspace serves as the container for their crafted Canvas elements, nodes, and edges.

This contract covers **Workspace metadata CRUD operations only** (`id`, `name`, `status`, `createdAt`, `updatedAt`). Persistence and manipulation of `WorkspaceNode` and `WorkspaceEdge` rows remain out of scope for this task and will be specified in a subsequent stage.

---

## 2. Actual Prisma Schema Observations

From `prisma/schema.prisma` (Model 11 `Workspace`):

```prisma
model Workspace {
  id        String          @id @default(uuid()) @db.Uuid
  userId    String          @map("user_id") @db.Uuid
  name      String
  status    WorkspaceStatus @default(ACTIVE)
  createdAt DateTime        @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt DateTime        @updatedAt @map("updated_at") @db.Timestamptz(6)

  user  User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  nodes WorkspaceNode[]
  edges WorkspaceEdge[]

  @@index([userId, status])
  @@map("workspaces")
}

enum WorkspaceStatus {
  ACTIVE
  ARCHIVED
}
```

Key Observations:
- **Primary Key**: `id` (UUID v4).
- **Owner Relationship**: `userId` foreign key referencing `User.id` with `onDelete: Cascade`.
- **Dependent Relations**: `nodes` (`WorkspaceNode`) and `edges` (`WorkspaceEdge`) both declare `onDelete: Cascade` referencing `Workspace.id`. Deleting a `Workspace` automatically cascades in PostgreSQL to delete all dependent nodes and edges.
- **Uniqueness**: No `@unique` constraint exists on `name` or `[userId, name]`. Duplicate workspace names per user are allowed. No HTTP 409 unique conflict is possible.

---

## 3. Frozen API Contract Specification

### 3.1 Authentication & User Status Rules

- **Global Guard**: All routes protected by existing global `AuthGuard`.
- **User ID Source**: Extracted exclusively from JWT payload `user.sub` via `@CurrentUser() user: AccessTokenPayload`. Client MUST NOT supply `userId` in body, query, or params.
- **User Status Enforcement**: Aligned with `CraftService` and `ElementService`:
  - Missing authenticated User -> `HTTP 401 Unauthorized` (`"User account not found"`).
  - `ACTIVE` User -> Access granted.
  - `INACTIVE` User -> `HTTP 403 Forbidden` (`"User account is disabled"`).
  - `BANNED` User -> `HTTP 403 Forbidden` (`"User account is disabled"`).
  - Unauthenticated / Invalid JWT -> `HTTP 401 Unauthorized`.

### 3.2 Ownership & Privacy Policy

- Users may only access or mutate Workspaces where `userId == authenticatedUserId`.
- Requesting `GET`, `PATCH`, or `DELETE` for a `workspaceId` that does not exist OR belongs to another user MUST return `HTTP 404 Not Found` with exact message `"Workspace not found"` (never leaks workspace existence).
- Ownership MUST be enforced at the mutation boundary. If a preliminary check is performed before mutation, any race condition resulting in a missing row MUST safely resolve to the same `"Workspace not found"` 404 response.

---

## 4. Route Table & HTTP Contracts

| Operation | Method & Route | Request Body | Success HTTP | Response Envelope |
| :--- | :--- | :--- | :--- | :--- |
| **Create** | `POST /workspaces` | `CreateWorkspaceDto` (`name` only) | `201 Created` | `{ "data": WorkspaceResponse }` |
| **List** | `GET /workspaces` | None | `200 OK` | `{ "data": WorkspaceResponse[] }` |
| **Get One** | `GET /workspaces/:workspaceId` | None | `200 OK` | `{ "data": WorkspaceResponse }` |
| **Update** | `PATCH /workspaces/:workspaceId` | `UpdateWorkspaceDto` (`name?`, `status?`) | `200 OK` | `{ "data": WorkspaceResponse }` |
| **Delete** | `DELETE /workspaces/:workspaceId` | None | `200 OK` | `{ "data": { "id": "uuid" } }` |

---

## 5. DTO Specifications & Validation Rules

### 5.1 CreateWorkspaceDto (`POST /workspaces`)

```ts
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export const MAX_WORKSPACE_NAME_LENGTH = 100;

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_WORKSPACE_NAME_LENGTH)
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  name: string;
}
```

- `name`: Required string, safely trimmed. Length after trimming: 1 to 100 characters.
- **No Status in POST**: Client MUST NOT send `status` in `POST /workspaces`. `status` is system-defaulted to `ACTIVE` by Prisma.
- Client-supplied `status`, `userId`, `id`, `createdAt`, `updatedAt`, `nodes`, `edges`, or extra fields are rejected with `HTTP 400 Bad Request` by `ValidationPipe` (`forbidNonWhitelisted: true`).

### 5.2 UpdateWorkspaceDto (`PATCH /workspaces/:workspaceId`)

```ts
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { WorkspaceStatus } from '../../database/generated/prisma/client';

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_WORKSPACE_NAME_LENGTH)
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsOptional()
  @IsEnum(WorkspaceStatus)
  status?: WorkspaceStatus;
}
```

- Editable fields: `name` (optional string, 1-100 chars safely trimmed), `status` (optional `WorkspaceStatus` enum: `ACTIVE` or `ARCHIVED`).
- **Empty Body Protection**: Optional decorators alone do not reject an empty object `{}`. Implementation MUST perform an explicit check (e.g. `if (!dto || Object.keys(dto).length === 0)`) throwing `BadRequestException('At least one field must be provided for update')` (`HTTP 400`).
- `null` values or extra forbidden fields (`userId`, `id`, timestamps, relations) produce `HTTP 400 Bad Request`.

### 5.3 Safe String Normalization Rule

- Transformation `@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))` ensures `.trim()` is called ONLY when the input is a string.
- Non-string inputs (numbers, booleans, arrays, objects) remain untouched by transform and trigger `@IsString()` validation failure (`HTTP 400 Bad Request`), preventing internal `TypeError` (500) crashes.
- Named constant `MAX_WORKSPACE_NAME_LENGTH = 100` defined once in DTO/constants layer.

---

## 6. Public Response Shape & Date Serialization

### 6.1 Public Workspace Response Interface (`WorkspaceResponse`)

```ts
import { WorkspaceStatus } from '../../database/generated/prisma/client';

export interface WorkspaceResponse {
  id: string;
  name: string;
  status: WorkspaceStatus;
  createdAt: string; // ISO-8601 string
  updatedAt: string; // ISO-8601 string
}
```

### 6.2 Explicit Mapping & Date Serialization

Services/Controllers MUST explicitly map Prisma models to `WorkspaceResponse` by serializing Date objects to ISO-8601 strings:
- `createdAt`: `workspace.createdAt.toISOString()`
- `updatedAt`: `workspace.updatedAt.toISOString()`

Never return raw Prisma model instances directly.

### 6.3 Public Response Example

```json
{
  "data": {
    "id": "e4b9a123-5d67-4e92-81f1-28a6f43702b1",
    "name": "My Financial Discovery Lab",
    "status": "ACTIVE",
    "createdAt": "2026-07-23T16:50:00.000Z",
    "updatedAt": "2026-07-23T16:50:00.000Z"
  }
}
```

### 6.4 Privacy & Internal Field Exclusions

Excludes: `userId`, `user` object, `nodes` array, `edges` array, and internal Prisma metadata.

---

## 7. List Semantics & Operational Rules

- **List Scope (`GET /workspaces`)**:
  - Returns ALL Workspaces owned by the authenticated user regardless of status (`ACTIVE` and `ARCHIVED` records included).
  - No status query filter in MVP.
  - Operations `GET /workspaces/:id`, `PATCH /workspaces/:id`, and `DELETE /workspaces/:id` also fully support owned `ARCHIVED` Workspaces.
- **Deterministic Ordering**: `orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }]` (most recently updated first).
- **Empty List**: An active user with 0 workspaces receives `{ "data": [] }` with `HTTP 200 OK`.
- **Param Validation**: `:workspaceId` MUST be a valid v4 UUID. Invalid format produces `HTTP 400 Bad Request`.
- **Delete Operation (`DELETE /workspaces/:workspaceId`)**:
  - Hard delete of owned workspace record + automatic DB cascade for dependent `WorkspaceNode` and `WorkspaceEdge` rows.
  - Response: `HTTP 200 OK` with `{ "data": { "id": "uuid" } }`.

---

## 8. Error Matrix

| Scenario | HTTP Status | Exception / Response |
| :--- | :--- | :--- |
| Missing / Invalid Token | 401 | `UnauthorizedException` |
| Missing Authenticated User | 401 | `UnauthorizedException('User account not found')` |
| `INACTIVE` / `BANNED` User | 403 | `ForbiddenException('User account is disabled')` |
| Invalid `:workspaceId` UUID | 400 | `BadRequestException('Validation failed (uuid is expected)')` |
| Create with `status` field | 400 | `BadRequestException('property status should not exist')` |
| Invalid / Empty Create `name` | 400 | `BadRequestException` |
| Non-String Create `name` | 400 | `BadRequestException('name must be a string')` |
| Empty PATCH Body `{}` | 400 | `BadRequestException('At least one field must be provided for update')` |
| `null` or Extra Field in PATCH | 400 | `BadRequestException` |
| Non-Existent / Non-Owned Workspace | 404 | `NotFoundException('Workspace not found')` |
| Database Failure | 500 | `InternalServerErrorException` |

---

## 9. Proposed File Map (`src/workspace/`)

```text
src/workspace/
├── workspace.controller.ts            # HTTP Controller for 5 endpoints
├── workspace.service.ts               # Business logic & Prisma queries
├── workspace.module.ts                # NestJS feature module importing DatabaseModule
├── dto/
│   ├── create-workspace.dto.ts        # Validation DTO for POST /workspaces (name only)
│   └── update-workspace.dto.ts        # Validation DTO for PATCH /workspaces/:id
└── types/
    └── workspace-response.type.ts     # Public TypeScript response interfaces
```

---

## 10. Future Runtime Acceptance Plan (28 Scenarios)

- **Planned Scenarios**: 28 exact scenarios
- **Executed in Planning Task**: 0
- **PostgreSQL Endpoint Acceptance Status**: `NOT_RUN / PLANNED`
- **Postman/Newman Status**: `NOT_RUN / PENDING`

### Scenario Matrix (28 Scenarios)

1. No token -> `HTTP 401 Unauthorized`.
2. Malformed token -> `HTTP 401 Unauthorized`.
3. Missing authenticated User -> `HTTP 401 Unauthorized` (`"User account not found"`).
4. `INACTIVE` User -> `HTTP 403 Forbidden` (`"User account is disabled"`).
5. `BANNED` User -> `HTTP 403 Forbidden` (`"User account is disabled"`).
6. Valid create -> `HTTP 201 Created` and exactly 1 row created.
7. Create defaults status to `ACTIVE`.
8. Create with `status` field -> `HTTP 400 Bad Request` and 0 writes.
9. Invalid/blank create name -> `HTTP 400 Bad Request` and 0 writes.
10. Non-string create name -> `HTTP 400 Bad Request` (not 500).
11. Extra create field `userId` -> `HTTP 400 Bad Request`.
12. Empty list -> `HTTP 200 OK` with `{ "data": [] }`.
13. List returns owned `ACTIVE` and `ARCHIVED` records.
14. List excludes another User's records.
15. List ordering is deterministic (`updatedAt DESC`, `createdAt DESC`, `id ASC`).
16. Get owned `ACTIVE` Workspace -> `HTTP 200 OK`.
17. Get owned `ARCHIVED` Workspace -> `HTTP 200 OK`.
18. Missing/non-owned get -> `HTTP 404 Not Found` (`"Workspace not found"`).
19. Patch name -> `HTTP 200 OK` with ISO-8601 string dates.
20. Patch status from `ACTIVE` to `ARCHIVED` and back -> `HTTP 200 OK`.
21. Empty patch body `{}` -> `HTTP 400 Bad Request`.
22. Extra or `null` patch field -> `HTTP 400 Bad Request`.
23. Patch non-owned Workspace -> `HTTP 404 Not Found` and 0 writes.
24. Delete owned Workspace -> `HTTP 200 OK` with `{ "data": { "id": "uuid" } }`.
25. Delete owned Workspace cascades to delete dependent `WorkspaceNode` and `WorkspaceEdge` rows.
26. Delete missing/non-owned Workspace -> `HTTP 404 Not Found`.
27. Public fields only (zero internal metadata leaked).
28. Existing `/health`, `/auth/me`, `POST /craft`, and `GET /elements` routes unchanged.

---

## 11. Explicit Out of Scope

- `WorkspaceNode` CRUD / position saving.
- `WorkspaceEdge` CRUD / connection saving.
- Full Canvas snapshot save / loading.
- Autosave, undo/redo, drag positioning.
- Workspace sharing, collaboration, templates, public workspaces.
- Realtime WebSockets, community features, AI generation.
