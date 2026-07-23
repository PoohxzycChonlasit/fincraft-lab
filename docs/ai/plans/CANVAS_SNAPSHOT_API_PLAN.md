# Canvas Graph Snapshot API Implementation Plan

- **TASK_ID**: `P9_WORKSPACE_GRAPH_API_1A_FINAL_CANVAS_CONTRACT_RECONCILIATION_001`
- **MARKER**: `FROZEN_CANVAS_SNAPSHOT_API_CONTRACT_V1`
- **STATUS**: FROZEN CONTRACT & IMPLEMENTATION PLAN (FINAL RECONCILED)
- **CORRECTION HISTORY**:
  - `P9_WORKSPACE_GRAPH_API_1A_FREEZE_CANVAS_SNAPSHOT_CONTRACT_001` (Initial contract freeze)
  - `P9_WORKSPACE_GRAPH_API_1A_FIX_CANVAS_SNAPSHOT_CONTRACT_001` (Corrected element display, timestamp exclusions, valueData/label limits, ID collision 409, directed duplicate edge tuple rules, aligned element error mapping, and WorkspaceCanvasService boundary)
  - `P9_WORKSPACE_GRAPH_API_1A_FINAL_CANVAS_CONTRACT_RECONCILIATION_001` (Reconciled workspaceUpdatedAt semantics, current Element master display semantics, MAX_CANVAS_SNAPSHOT_BYTES total payload ceiling, and authorized NestJS body-parser 1 MB limit)
- **PROJECT ROOT**: `C:\devnest 101\single-project\fincraft-lab`
- **BACKEND ROOT**: `C:\devnest 101\single-project\fincraft-lab\fincraft-lab-api`

---

## 1. Executive Summary & Objective

The FinCraft Lab Canvas allows users to visually arrange financial Elements into interactive discovery graphs. Rather than exposing granular Node and Edge CRUD endpoints during MVP, the Canvas API persists and restores the complete graph structure via an atomic **Canvas Snapshot API**:

1. `GET /workspaces/:workspaceId/canvas` — Loads all persisted `WorkspaceNode` and `WorkspaceEdge` records for an owned Workspace, embedding current public Element display metadata.
2. `PUT /workspaces/:workspaceId/canvas` — Atomically replaces the entire persisted Canvas graph with a new snapshot in one database transaction.

This document freezes the exact contract, validation rules, error behavior, database transaction ordering, service boundaries, body-parser requirements, and runtime acceptance plan before source code implementation begins.

---

## 2. Actual Prisma Schema & Application Configuration Observations

### Database Schema
Inspection of `prisma/schema.prisma` confirms the exact model definitions:

- **Model 11 `Workspace`**:
  - `id`: `String @id @default(uuid()) @db.Uuid`
  - `userId`: `String @map("user_id") @db.Uuid`
  - `name`: `String`
  - `status`: `WorkspaceStatus` enum (`ACTIVE` | `ARCHIVED`)
  - `createdAt`: `DateTime @default(now())`
  - `updatedAt`: `DateTime @updatedAt`

- **Model 12 `WorkspaceNode`**:
  - `id`: `String @id @default(uuid()) @db.Uuid`
  - `workspaceId`: `String @map("workspace_id") @db.Uuid` (`onDelete: Cascade`)
  - `elementId`: `String @map("element_id") @db.Uuid` (`onDelete: Restrict`)
  - `positionX`: `Float @map("position_x")`
  - `positionY`: `Float @map("position_y")`
  - `valueData`: `Json @map("value_data")`
  - `createdAt`: `DateTime @default(now())`
  - `updatedAt`: `DateTime @updatedAt`

- **Model 13 `WorkspaceEdge`**:
  - `id`: `String @id @default(uuid()) @db.Uuid`
  - `workspaceId`: `String @map("workspace_id") @db.Uuid` (`onDelete: Cascade`)
  - `sourceNodeId`: `String @map("source_node_id") @db.Uuid` (`onDelete: Cascade`)
  - `targetNodeId`: `String @map("target_node_id") @db.Uuid` (`onDelete: Cascade`)
  - `label`: `String`
  - `createdAt`: `DateTime @default(now())`

### Application HTTP Body-Parser Setup
Inspection of `src/main.ts` reveals:
- NestJS uses Express as its default HTTP platform.
- Express body-parser defaults to a 100 KB ceiling (`100kb` / 102,400 bytes).
- No custom body-parser ceiling is currently configured in `src/main.ts`.

---

## 3. Contract Scope

### In Scope
- `GET /workspaces/:workspaceId/canvas` — Retrieve current Canvas graph snapshot.
- `PUT /workspaces/:workspaceId/canvas` — Atomic snapshot replacement.

### Out of Scope (Explicitly Deferred)
- Individual Node CRUD endpoints (`POST/PATCH/DELETE /nodes`).
- Individual Edge CRUD endpoints (`POST/PATCH/DELETE /edges`).
- Autosave scheduling, debounce, or retry orchestration (handled by frontend).
- Undo / redo state tracking.
- Canvas versioning or audit history.
- Dedicated `canvasUpdatedAt` schema field.
- Immutable historical Element display snapshot.
- Collaboration, WebSockets, or realtime cursors.
- Canvas templates or simulation execution.

---

## 4. Authentication, User Status & Ownership Isolation

- **Authentication**: Both routes are protected by global `AuthGuard`. User ID is extracted exclusively from JWT claims (`user.sub`).
- **User Status Policy**:
  - Missing authenticated User -> `401 Unauthorized` (`"User account not found"`).
  - `INACTIVE` or `BANNED` User -> `403 Forbidden` (`"User account is disabled"`).
- **Ownership & Privacy Policy**:
  - Missing or non-owned Workspace -> `404 Not Found` (`"Workspace not found"`).
  - Zero existence leakage: Non-owned workspaces return identical 404 error messages.

---

## 5. Archived Workspace Policy

- **GET Snapshot (`GET /canvas`)**:
  - Owned `ACTIVE` Workspace -> Allowed (HTTP 200).
  - Owned `ARCHIVED` Workspace -> Allowed (HTTP 200 as read-only historical canvas).
- **PUT Snapshot (`PUT /canvas`)**:
  - Owned `ACTIVE` Workspace -> Allowed (HTTP 200).
  - Owned `ARCHIVED` Workspace -> **Rejected** with `HTTP 409 Conflict` (`"Workspace is archived"`).
- **Resuming Editing**:
  - User must first `PATCH /workspaces/:workspaceId` with `{ status: "ACTIVE" }`.
  - Once active, `PUT /workspaces/:workspaceId/canvas` is permitted.

---

## 6. Timestamp Semantics (`workspaceUpdatedAt`)

The Prisma `Workspace` model contains a single `updatedAt` timestamp field. This field is modified by both:
- Metadata `PATCH /workspaces/:workspaceId` operations
- Successful Canvas `PUT /workspaces/:workspaceId/canvas` operations

Because it is shared between metadata and graph mutations, it is not an exclusive Canvas save timestamp.

### Rules for `workspaceUpdatedAt`
- Public response field name: `workspaceUpdatedAt: string` (ISO-8601 string).
- `GET /canvas`: Returns `Workspace.updatedAt` as `workspaceUpdatedAt` without database writes or timestamp mutation.
- `PUT /canvas`: Updates `Workspace.updatedAt` inside the transaction and returns the committed value as `workspaceUpdatedAt`.
- Failed `PUT /canvas`: Leaves `Workspace.updatedAt` unchanged.
- `PATCH /workspaces/:workspaceId`: Modifies the exact same `Workspace.updatedAt` field.
- Node/Edge timestamps (`createdAt`/`updatedAt`) are excluded from public responses.

---

## 7. Public Element Display Semantics

`GET` and `PUT` responses embed a public Element display object inside each Node:

```typescript
export interface CanvasElementDisplayResponse {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  iconUrl: string | null;
  elementType: ElementType;
  isStarter: boolean;
}
```

### Display Semantics & Historical Read Wording
- **Stored Reference**: `WorkspaceNode` stores `elementId` foreign key only.
- **Current Master Join**: `GET /canvas` joins the current `Element` master-data row.
- **Active Filter Excluded**: `GET /canvas` does not filter `Element` or `Category` by current active status. Inactive historical references remain renderable.
- **Current Display Metadata Definition**: The embedded `element` object represents **current public display metadata**, NOT an immutable snapshot captured when the Node was saved.
- **Consequences**:
  - Later Element name changes in master data appear when reading old Workspaces.
  - Later emoji or iconUrl changes in master data appear when reading old Workspaces.
  - Old presentation values are not preserved immutably.
- **Exclusions**: `status`, `categoryId`, Category status, relation arrays, `DiscoveryDetail`, and `UserElement` records are **not exposed**.
- Element deletion remains protected by the foreign-key `onDelete: Restrict` relation.

---

## 8. Public Response Shape

### Response Shape (HTTP 200 OK)
```json
{
  "data": {
    "workspaceId": "d25ae2dd-151a-4712-ae31-3ef5a59efcf6",
    "workspaceUpdatedAt": "2026-07-23T10:00:00.000Z",
    "nodes": [
      {
        "id": "e43adfa0-2039-4670-a48e-0b92dc278f57",
        "elementId": "a1111111-1111-4111-a111-111111111111",
        "element": {
          "id": "a1111111-1111-4111-a111-111111111111",
          "name": "Money",
          "slug": "money",
          "emoji": "💵",
          "iconUrl": null,
          "elementType": "BASE",
          "isStarter": true
        },
        "positionX": 150.5,
        "positionY": 200.0,
        "valueData": { "amount": 5000 }
      }
    ],
    "edges": [
      {
        "id": "f5555555-5555-4555-a555-555555555555",
        "sourceNodeId": "e43adfa0-2039-4670-a48e-0b92dc278f57",
        "targetNodeId": "e43adfa0-2039-4670-a48e-0b92dc278f58",
        "label": "FLOWS_TO"
      }
    ]
  }
}
```

### Deterministic Ordering
For both `GET` and `PUT` responses:
- `nodes`: ordered by `id ASC`
- `edges`: ordered by `id ASC`

### Empty Canvas Response (HTTP 200 OK)
```json
{
  "data": {
    "workspaceId": "d25ae2dd-151a-4712-ae31-3ef5a59efcf6",
    "workspaceUpdatedAt": "2026-07-23T10:00:00.000Z",
    "nodes": [],
    "edges": []
  }
}
```

---

## 9. Total Request Payload Contract & Body-Parser Limits

### Named Limits Constants
- `MAX_CANVAS_NODES = 100` (Safety limit for school MVP frontend rendering)
- `MAX_CANVAS_EDGES = 200` (Safety limit for school MVP graph complexity)
- `MAX_NODE_VALUE_DATA_BYTES = 4096` (Serialized UTF-8 bytes per node `valueData`)
- `MAX_CANVAS_EDGE_LABEL_LENGTH = 100` (Max characters for edge label)
- `MAX_CANVAS_SNAPSHOT_BYTES = 524288` (512 KB total serialized UTF-8 payload ceiling)

### Rationale & Headroom Calculation
- 100 nodes x 4096 max valueData bytes = 409,600 bytes (~400 KB).
- Adding 100 node metadata objects (~20 KB) + 200 edge objects (~30 KB) yields a theoretical max raw JSON payload of ~460 KB.
- `MAX_CANVAS_SNAPSHOT_BYTES = 524288` (512 KB) provides headroom above max theoretical payload (~460 KB) while establishing a strict ceiling against memory exhaustion.

### Total Payload Validation Behavior
- Compute UTF-8 serialized byte size of normalized snapshot request body.
- If payload size > `MAX_CANVAS_SNAPSHOT_BYTES` (512 KB) -> `HTTP 400 Bad Request`.
- Exact error message: `"Canvas snapshot payload is too large"`.
- Validation occurs before any database write. Failed validation causes 0 DB writes.

### Framework Body-Parser Decision (Option B Authorized)
Express default body-parser ceiling is 100 KB (`100kb`). Because `MAX_CANVAS_SNAPSHOT_BYTES` (512 KB) exceeds 100 KB, Option B is explicitly authorized:
- During implementation phase (`P9_WORKSPACE_GRAPH_API_1B`), `src/main.ts` will configure Express body-parser with `express.json({ limit: '1mb' })`.
- This change is an application-wide configuration change in `src/main.ts`.
- Limited to 1 MB (`1mb` / 1,048,576 bytes) to comfortably accommodate the 512 KB Canvas limit without exposing the application to denial-of-service vulnerabilities.
- Full regression testing across all endpoints (`/auth`, `/craft`, `/elements`, `/workspaces`) will be conducted.

---

## 10. Node & Value Data Rules

### Node Input Rules
1. `id`: Required valid UUID v4. Duplicate node IDs in payload -> `400 Bad Request`.
2. `elementId`: Required valid UUID v4.
3. `positionX`, `positionY`: Required finite numbers (`Number.isFinite()`). Non-finite -> `400 Bad Request`.
4. `valueData`: Optional plain JSON object (`Record<string, unknown>`).
   - Default: `{}` if omitted.
   - Rejects null, arrays, or primitive values -> `400 Bad Request` (`"valueData must be a plain object"`).
   - Serialized JSON UTF-8 size > 4096 bytes -> `400 Bad Request` (`"valueData exceeds maximum size limit (4096 bytes)"`).
5. Multiple nodes MAY reference the same `elementId` as long as node `id`s are distinct.

### Element Availability Alignment
During `PUT /canvas`, every submitted `elementId` is validated against established domain rules:
1. `Element` exists in database. If missing -> `404 Not Found` (`"Element not found"`).
2. `Element.status === ContentStatus.ACTIVE`. If inactive -> `400 Bad Request` (`"Element is not active"`).
3. `ElementCategory.status === ActiveStatus.ACTIVE`. If category inactive -> `400 Bad Request` (`"Element category is not active"`).
4. Unlocked check: Element is a Starter Element (`isStarter === true`) OR unlocked by user via `UserElement` (`userId = user.sub`). If locked non-starter -> `403 Forbidden` (`"Element is not unlocked by user"`).

---

## 11. Edge & Directed Graph Rules

### Edge Input Rules
1. `id`: Required valid UUID v4. Duplicate edge IDs in payload -> `400 Bad Request`.
2. `sourceNodeId`: Required valid UUID v4. Must exist in submitted `nodes` array -> `400 Bad Request` (`"Source node '<sourceNodeId>' does not exist in canvas snapshot"`).
3. `targetNodeId`: Required valid UUID v4. Must exist in submitted `nodes` array -> `400 Bad Request` (`"Target node '<targetNodeId>' does not exist in canvas snapshot"`).
4. `label`: Required string (safe trim). Empty string `""` represents unlabeled edge. Length > 100 -> `400 Bad Request` (`"label exceeds maximum length (100)"`). Null/non-string -> `400 Bad Request` (`"label must be a string"`).

### Directed Graph Duplicate Rules
- **Directed Graph**: `A -> B` is distinct from `B -> A`.
- **Self-Edges**: Forbidden (`sourceNodeId === targetNodeId` -> `400 Bad Request` `"Self-connecting edges are not allowed"`).
- **Parallel Edges**: Allowed ONLY when normalized labels differ.
- **Duplicate Tuple**: `sourceNodeId + targetNodeId + normalizedLabel` duplicate -> `400 Bad Request` (`"Duplicate edge connection in canvas snapshot"`).

---

## 12. Global Client-ID Collision Rule

Client-generated UUID v4 IDs for Nodes and Edges are validated inside the transaction against existing database rows:
1. Requested Node IDs belonging to **another Workspace** -> `409 Conflict` (`"Canvas identifier conflict"`).
2. Requested Edge IDs belonging to **another Workspace** -> `409 Conflict` (`"Canvas identifier conflict"`).
3. Node or Edge IDs belonging to the **current Workspace** ARE allowed (replaced during snapshot PUT).
4. Raw Prisma `P2002` reclassified safely to `409 Conflict`. Zero external tenant data leaked.

---

## 13. Transaction & Race Boundary Sequence

All ownership-sensitive, status-sensitive, and database-sensitive operations execute inside a single Prisma interactive `$transaction`:

```text
1. Begin Prisma $transaction.
2. Read owned Workspace by id + userId.
   - If missing/non-owned -> throw 404 "Workspace not found".
   - If ARCHIVED -> throw 409 "Workspace is archived".
3. Claim & lock editable Workspace through atomic mutation:
   prisma.workspace.updateMany({
     where: { id: workspaceId, userId, status: 'ACTIVE' },
     data: { updatedAt: new Date() },
   })
   - If updated count === 0 -> reclassify safely as 404 or 409.
4. Read and validate Element availability for all submitted elementIds inside transaction:
   - Check status, category status, starter status, and UserElement unlocks.
   - Throw exact aligned exceptions (404 "Element not found", 400 "Element is not active", 400 "Element category is not active", 403 "Element is not unlocked by user").
5. Check global Node/Edge ID collisions against other workspaces inside transaction.
   - Throw 409 "Canvas identifier conflict" if collision detected.
6. Delete existing WorkspaceEdges:
   prisma.workspaceEdge.deleteMany({ where: { workspaceId } })
7. Delete existing WorkspaceNodes:
   prisma.workspaceNode.deleteMany({ where: { workspaceId } })
8. Create requested WorkspaceNodes (with embedded valueData):
   prisma.workspaceNode.createMany({ data: newNodesWithWorkspaceId })
9. Create requested WorkspaceEdges:
   prisma.workspaceEdge.createMany({ data: newEdgesWithWorkspaceId })
10. Fetch updated Workspace to retrieve committed workspaceUpdatedAt ISO timestamp.
11. Return committed CanvasSnapshotResponse ordered deterministically (id ASC).
```

### Rollback Guarantee
If node creation, edge creation, foreign key check, or validation fails, all graph mutations and the `Workspace.updatedAt` timestamp change roll back 100%.

---

## 14. Complete Aligned Error Matrix

| Condition | HTTP Code | Error Message |
| :--- | :---: | :--- |
| Missing Authorization header | 401 | `"Invalid or missing authentication token"` |
| Malformed Bearer token | 401 | `"Invalid or missing authentication token"` |
| Non-existent user `sub` | 401 | `"User account not found"` |
| `INACTIVE` / `BANNED` user | 403 | `"User account is disabled"` |
| Invalid `:workspaceId` UUID | 400 | `"Validation failed (uuid is expected)"` |
| Non-existent / non-owned workspace | 404 | `"Workspace not found"` |
| `PUT` on `ARCHIVED` workspace | 409 | `"Workspace is archived"` |
| Missing `nodes` array in body | 400 | `"nodes must be an array"` |
| Missing `edges` array in body | 400 | `"edges must be an array"` |
| Total body > 512 KB | 400 | `"Canvas snapshot payload is too large"` |
| Exceeds 100 nodes / 200 edges | 400 | `"Canvas exceeds maximum node limit (100)"` / `"Canvas exceeds maximum edge limit (200)"` |
| Duplicate node ID in payload | 400 | `"Duplicate node ID '<id>' in snapshot"` |
| Duplicate edge ID in payload | 400 | `"Duplicate edge ID '<id>' in snapshot"` |
| Non-existent Element ID | 404 | `"Element not found"` |
| Inactive Element | 400 | `"Element is not active"` |
| Inactive Category | 400 | `"Element category is not active"` |
| Locked Non-Starter Element | 403 | `"Element is not unlocked by user"` |
| Non-finite coordinate (`NaN`) | 400 | `"positionX must be a finite number"` |
| Non-object `valueData` | 400 | `"valueData must be a plain object"` |
| `valueData` > 4096 bytes | 400 | `"valueData exceeds maximum size limit (4096 bytes)"` |
| Non-string `label` | 400 | `"label must be a string"` |
| `label` > 100 chars | 400 | `"label exceeds maximum length (100)"` |
| Dangling edge (`sourceNodeId` not in nodes) | 400 | `"Source node '<sourceNodeId>' does not exist in canvas snapshot"` |
| Self-edge (`sourceNodeId == targetNodeId`) | 400 | `"Self-connecting edges are not allowed"` |
| Duplicate directed edge tuple | 400 | `"Duplicate edge connection in canvas snapshot"` |
| Node/Edge ID collision with other workspace | 409 | `"Canvas identifier conflict"` |

---

## 15. Service Boundary & Proposed Source Map

To preserve thin controllers and maintain files under 300 physical lines, Canvas snapshot operations will be handled by a dedicated `WorkspaceCanvasService`:

### Proposed Source Map
- `src/workspace/workspace-canvas.service.ts` (~220 lines) — Owns `getCanvasSnapshot`, `saveCanvasSnapshot`, graph integrity, Element availability checks, and Prisma transaction replacement.
- `src/workspace/dto/workspace-node-input.dto.ts` (~30 lines) — DTO for node input validation.
- `src/workspace/dto/workspace-edge-input.dto.ts` (~25 lines) — DTO for edge input validation.
- `src/workspace/dto/save-canvas-snapshot.dto.ts` (~20 lines) — DTO for top-level snapshot request.
- `src/workspace/types/canvas-snapshot-response.type.ts` (~30 lines) — Public response types with embedded Element display object.
- `src/workspace/workspace.controller.ts` (Modifies ~25 lines) — Exposes `GET /:workspaceId/canvas` and `PUT /:workspaceId/canvas`.
- `src/workspace/workspace.module.ts` (Modifies ~5 lines) — Adds `WorkspaceCanvasService` to `providers`.
- `src/main.ts` (Modifies ~2 lines) — Configures `express.json({ limit: '1mb' })`.

No new `GraphModule` is created. `WorkspaceService` remains focused on metadata CRUD.

---

## 16. Runtime Acceptance Plan (48 Scenarios)

The future implementation will be verified against a 48-scenario live HTTP/PostgreSQL suite compiled through `nest build`:

- **Auth & User Status (Scenarios 1-5)**: No token 401, malformed token 401, missing user 401, inactive/banned user 403.
- **Ownership Privacy (Scenarios 6-9)**: Missing vs non-owned workspace GET/PUT return identical 404.
- **GET Canvas & Timestamp Semantics (Scenarios 10-15)**: GET exposes `workspaceUpdatedAt`; GET causes 0 timestamp writes; metadata PATCH changes same `workspaceUpdatedAt` field; GET returns empty arrays `[]` for empty canvas; active snapshot 200; deterministic ordering (`id ASC`).
- **Historical Read & Display Metadata (Scenarios 16-19)**: Old Canvas uses current Element name/emoji/icon after master-data edits; inactive Element remains renderable through GET; inactive Category remains renderable through GET; archived workspace GET returns 200.
- **PUT Replacement & Timestamps (Scenarios 20-26)**: 1-node save 200; multi-node/edge save 200; replace removes omitted nodes/edges; empty snapshot `{ nodes: [], edges: [] }` clears canvas; successful Canvas PUT changes `workspaceUpdatedAt`; failed Canvas PUT leaves `workspaceUpdatedAt` unchanged; archived workspace PUT returns 409 Conflict.
- **Payload Size & Limits (Scenarios 27-29)**: Payload exactly within 512 KB (`MAX_CANVAS_SNAPSHOT_BYTES`) accepted; payload > 512 KB returns 400 (`"Canvas snapshot payload is too large"`) and 0 writes; Express body-parser ceiling (1 MB in `main.ts`) accepts valid 512 KB payload without 413.
- **Node Validation & Value Data (Scenarios 30-36)**: Missing/null nodes array 400; duplicate node ID 400; non-finite coordinates 400; null valueData 400; array valueData 400; primitive valueData 400; valueData > 4096 bytes 400; valueData default `{}`.
- **Element Availability Alignment (Scenarios 37-40)**: Non-existent Element 404 `"Element not found"`; inactive Element 400 `"Element is not active"`; inactive Category 400 `"Element category is not active"`; locked non-starter 403 `"Element is not unlocked by user"`.
- **Edge Validation & Directed Tuples (Scenarios 41-44)**: Missing/null edges array 400; duplicate edge ID 400; dangling sourceNodeId 400; dangling targetNodeId 400; self-edge 400; non-string label 400; duplicate directed edge tuple 400; reversed edge direction allowed; parallel edges with different labels allowed.
- **ID Collisions & Concurrent Race (Scenarios 45-46)**: Node ID collision with another workspace 409; Edge ID collision with another workspace 409; concurrent archive vs PUT rollback test.
- **Regression (Scenarios 47-48)**: Existing Workspace metadata CRUD, Health, Auth, Craft, and Elements routes unchanged.

### Execution Status in Planning Phase
- **Scenarios Executed**: 0 (Contract planning phase only)
- **PostgreSQL Endpoint Acceptance**: `NOT_RUN / PLANNED`
- **Postman/Newman Status**: `NOT_RUN / PENDING`

---

## 17. Success Criteria

- Contract frozen under marker `FROZEN_CANVAS_SNAPSHOT_API_CONTRACT_V1`.
- All 3 final reconciliation items incorporated in `CANVAS_SNAPSHOT_API_PLAN.md`.
- Zero source files created during planning phase.
- Zero Prisma, migration, or database changes during planning phase.
- Ready for implementation phase `P9_WORKSPACE_GRAPH_API_1B_IMPLEMENT_CANVAS_SNAPSHOT_001`.
