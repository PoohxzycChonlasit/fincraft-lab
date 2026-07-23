# Workspace Metadata CRUD API Plan & Frozen Contract

- **TASK_ID**: `P8_WORKSPACE_API_1A_FREEZE_WORKSPACE_CRUD_CONTRACT_001`
- **CONTRACT_MARKER**: `FROZEN_WORKSPACE_METADATA_CRUD_API_CONTRACT_V1`
- **STATUS**: FROZEN_PLANNING
- **EXPECTED STARTING COMMIT**: `2acfba1932e9692b0826697e58a1bd0577b9ff5f`
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
- **Dependent Relations**: `nodes` (`WorkspaceNode`) and `edges` (`WorkspaceEdge`) both declare `onDelete: Cascade` referencing `Workspace.id`. Deleting a `Workspace` automatically cascades to delete all dependent nodes and edges.
- **Uniqueness**: No `@unique` constraint exists on `name` or `[userId, name]`. Duplicate workspace names per user are allowed. No HTTP 409 unique conflict is possible.

---

## 3. Frozen API Contract Specification

### 3.1 Authentication & Authorization Rules

- **Global Guard**: All routes protected by existing global `AuthGuard`.
- **User ID Source**: Extracted exclusively from JWT payload `user.sub` via `@CurrentUser() user: AccessTokenPayload`.
- **User Status Enforcement**:
  - `ACTIVE` User -> Access granted.
  - `INACTIVE` User -> `HTTP 403 Forbidden` (`User account is disabled`).
  - `BANNED` User -> `HTTP 403 Forbidden` (`User account is disabled`).
  - Unauthenticated / Invalid JWT -> `HTTP 401 Unauthorized`.
- **Ownership Policy**: Users may only access or mutate Workspaces where `userId == authenticatedUserId`.
- **Non-Owned / Missing Workspace Privacy**: Requesting `GET`, `PATCH`, or `DELETE` for a `workspaceId` that does not exist OR belongs to another user MUST return `HTTP 404 Not Found` (does not leak whether the workspace exists for another user).

---

## 4. Route Table & HTTP Contracts

| Operation | Method & Route | Request Body | Success HTTP | Response Envelope |
| :--- | :--- | :--- | :--- | :--- |
| **Create** | `POST /workspaces` | `CreateWorkspaceDto` | `201 Created` | `{ "data": WorkspaceResponse }` |
| **List** | `GET /workspaces` | None | `200 OK` | `{ "data": WorkspaceResponse[] }` |
| **Get One** | `GET /workspaces/:workspaceId` | None | `200 OK` | `{ "data": WorkspaceResponse }` |
| **Update** | `PATCH /workspaces/:workspaceId` | `UpdateWorkspaceDto` | `200 OK` | `{ "data": WorkspaceResponse }` |
| **Delete** | `DELETE /workspaces/:workspaceId` | None | `200 OK` | `{ "data": { "id": "uuid" } }` |

---

## 5. DTO Specifications & Request Contracts

### 5.1 CreateWorkspaceDto (`POST /workspaces`)

```ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { WorkspaceStatus } from '../../database/generated/prisma/client';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsOptional()
  @IsEnum(WorkspaceStatus)
  status?: WorkspaceStatus;
}
```

- `name`: Required, string, trimmed, min 1 char, max 100 chars.
- `status`: Optional, `WorkspaceStatus` (`ACTIVE` | `ARCHIVED`). Defaults to `ACTIVE` if omitted.
- Forbidden fields: `id`, `userId`, `createdAt`, `updatedAt`, `nodes`, `edges` (rejected by `ValidationPipe` `forbidNonWhitelisted: true`).

### 5.2 UpdateWorkspaceDto (`PATCH /workspaces/:workspaceId`)

```ts
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { WorkspaceStatus } from '../../database/generated/prisma/client';

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsOptional()
  @IsEnum(WorkspaceStatus)
  status?: WorkspaceStatus;
}
```

- Requires at least 1 valid field provided in PATCH body (empty body `{}` throws `HTTP 400 Bad Request`).
- Forbidden fields: `id`, `userId`, `createdAt`, `updatedAt`, `nodes`, `edges`.

---

## 6. Public Response Shape & Privacy Exclusions

### 6.1 Workspace Response Interface (`WorkspaceResponse`)

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

### 6.2 Public JSON Example

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

### 6.3 Privacy & Metadata Exclusions

The public response MUST NEVER expose:
- `userId` (internal owner foreign key)
- `user` object (User metadata)
- `nodes` array (out of scope for metadata CRUD)
- `edges` array (out of scope for metadata CRUD)

---

## 7. Operational Details & Ordering

- **List Query (`GET /workspaces`)**:
  - Filter: `where: { userId, status: { in: [WorkspaceStatus.ACTIVE, WorkspaceStatus.ARCHIVED] } }` (returns all workspaces owned by the user).
  - Deterministic Ordering: `orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }]` (most recently updated workspaces first).
  - Empty List: An active user with 0 workspaces receives `{ "data": [] }` with `HTTP 200 OK`.
- **Param Validation**: `:workspaceId` route parameter MUST be validated as a valid v4 UUID string using `ParseUUIDPipe` or `IsUUID`. Invalid UUID format produces `HTTP 400 Bad Request`.
- **Delete Operation (`DELETE /workspaces/:workspaceId`)**:
  - Performs hard delete of the workspace record.
  - Cascades via PostgreSQL `onDelete: Cascade` to remove all associated `WorkspaceNode` and `WorkspaceEdge` rows.
  - Response: `HTTP 200 OK` with `{ "data": { "id": "e4b9a123-5d67-4e92-81f1-28a6f43702b1" } }`.

---

## 8. Error Matrix

| Scenario | HTTP Status | Exception / Response |
| :--- | :--- | :--- |
| Missing / Invalid Token | 401 | `UnauthorizedException` |
| `INACTIVE` / `BANNED` User | 403 | `ForbiddenException('User account is disabled')` |
| Invalid `:workspaceId` UUID | 400 | `BadRequestException('Validation failed (uuid is expected)')` |
| Invalid DTO Body (e.g. empty name) | 400 | `BadRequestException` (Validation pipe error array) |
| Empty PATCH Body `{}` | 400 | `BadRequestException('At least one field must be provided for update')` |
| Extra Forbidden Body Field | 400 | `BadRequestException('property extraField should not exist')` |
| Non-Existent / Non-Owned Workspace | 404 | `NotFoundException('Workspace not found')` |
| Database Connection Error | 500 | `InternalServerErrorException` |

---

## 9. Database Mutation Guarantees

| Route | Database Mutations Performed |
| :--- | :--- |
| `POST /workspaces` | Creates **exactly 1** `Workspace` row for authenticated `userId`. |
| `GET /workspaces` | **0 Writes** (`SELECT` only). |
| `GET /workspaces/:workspaceId` | **0 Writes** (`SELECT` only). |
| `PATCH /workspaces/:workspaceId` | Updates **exactly 1** owned `Workspace` row. |
| `DELETE /workspaces/:workspaceId` | Deletes **exactly 1** owned `Workspace` row (+ dependent Nodes/Edges via DB cascade). |

No operation may create or update `UserElement`, `DiscoveryEvent`, `CraftRecipe`, `Element`, or unrelated `User` records.

---

## 10. Proposed File Map & Implementation Boundaries

### Proposed Directory Structure (`src/workspace/`)

```text
src/workspace/
├── workspace.controller.ts            # HTTP Controller handling 5 CRUD endpoints
├── workspace.service.ts               # Business logic & Prisma queries
├── workspace.module.ts                # NestJS feature module importing DatabaseModule
├── dto/
│   ├── create-workspace.dto.ts        # Validation DTO for POST /workspaces
│   └── update-workspace.dto.ts        # Validation DTO for PATCH /workspaces/:id
└── types/
    └── workspace-response.type.ts     # Explicit TypeScript response interfaces
```

---

## 11. Future Runtime Acceptance Scenarios (P8_WORKSPACE_API_1B / 1C)

1. **Unauthenticated Access** -> `POST/GET/PATCH/DELETE` without JWT returns `HTTP 401 Unauthorized`.
2. **Disabled User** -> `INACTIVE` or `BANNED` user account returns `HTTP 403 Forbidden` (`"User account is disabled"`).
3. **Create Workspace** -> `POST /workspaces` with valid name returns `HTTP 201 Created` and creates 1 row.
4. **Invalid Create Request** -> Empty name or extra fields return `HTTP 400 Bad Request` (0 DB writes).
5. **List Workspaces (Empty)** -> User with 0 workspaces receives `HTTP 200 OK` with `{ "data": [] }`.
6. **List Workspaces (Multiple)** -> Returns only authenticated user's workspaces, sorted by `updatedAt DESC`.
7. **Get Workspace (Owned)** -> `GET /workspaces/:id` returns metadata for owned workspace (`HTTP 200 OK`).
8. **Get Workspace (Other User / Missing)** -> `GET /workspaces/:id` for non-owned or fake UUID returns `HTTP 404 Not Found`.
9. **Patch Workspace (Owned)** -> `PATCH /workspaces/:id` updates name/status (`HTTP 200 OK`).
10. **Patch Workspace (Empty / Invalid Body)** -> `{}` or invalid fields return `HTTP 400 Bad Request`.
11. **Patch Workspace (Other User / Missing)** -> Returns `HTTP 404 Not Found`.
12. **Delete Workspace (Owned)** -> `DELETE /workspaces/:id` returns `HTTP 200 OK` and deletes row + dependent nodes/edges.
13. **Delete Workspace (Other User / Missing)** -> Returns `HTTP 404 Not Found`.
14. **Zero Unintended Mutations** -> No `UserElement`, `DiscoveryEvent`, or unrelated tables modified.
15. **Route Regressions** -> Existing `/health`, `/auth/me`, `POST /craft`, and `GET /elements` remain intact.

---

## 12. Explicit Out of Scope

- `WorkspaceNode` CRUD / position saving.
- `WorkspaceEdge` CRUD / connection saving.
- Full Canvas snapshot save / loading.
- Autosave, undo/redo, drag positioning.
- Workspace sharing, collaboration, templates, public workspaces.
- Realtime WebSockets, community features, AI generation.
