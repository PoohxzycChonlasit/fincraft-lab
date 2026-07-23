# Canvas Graph Snapshot API Implementation Plan

- **TASK_ID**: `P9_WORKSPACE_GRAPH_API_1A_FIX_CANVAS_SNAPSHOT_CONTRACT_001`
- **MARKER**: `FROZEN_CANVAS_SNAPSHOT_API_CONTRACT_V1`
- **STATUS**: FROZEN CONTRACT & IMPLEMENTATION PLAN (CORRECTED)
- **CORRECTION HISTORY**:
  - `P9_WORKSPACE_GRAPH_API_1A_FREEZE_CANVAS_SNAPSHOT_CONTRACT_001` (Initial contract freeze)
  - `P9_WORKSPACE_GRAPH_API_1A_FIX_CANVAS_SNAPSHOT_CONTRACT_001` (Corrected element display, timestamp exclusions, valueData/label limits, ID collision 409, directed duplicate edge tuple rules, aligned element error mapping, and WorkspaceCanvasService boundary)
- **PROJECT ROOT**: `C:\devnest 101\single-project\fincraft-lab`
- **BACKEND ROOT**: `C:\devnest 101\single-project\fincraft-lab\fincraft-lab-api`

---

## 1. Executive Summary & Objective

The FinCraft Lab Canvas allows users to visually arrange financial Elements into interactive discovery graphs. Rather than exposing granular Node and Edge CRUD endpoints during MVP, the Canvas API persists and restores the complete graph structure via an atomic **Canvas Snapshot API**:

1. `GET /workspaces/:workspaceId/canvas` — Loads all persisted `WorkspaceNode` and `WorkspaceEdge` records for an owned Workspace, returning public Element display data for historical canvas rendering.
2. `PUT /workspaces/:workspaceId/canvas` — Atomically replaces the entire persisted Canvas graph with a new snapshot in one database transaction.

This document freezes the exact contract, validation rules, error behavior, database transaction ordering, service boundaries, and runtime acceptance plan before source code implementation begins.

---

## 2. Actual Prisma Schema Observations

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

### Key Schema Compatibility Confirmation
Client-supplied UUID v4 values for `WorkspaceNode.id` and `WorkspaceEdge.id` are 100% compatible with Prisma `@default(uuid()) @db.Uuid`. This enables the frontend client to generate node and edge UUIDs locally and submit matching `sourceNodeId` and `targetNodeId` references within a single snapshot payload without temporary ID mappings.

---

## 3. Contract Scope

### In Scope
- `GET /workspaces/:workspaceId/canvas` — Retrieve current Canvas graph snapshot with embedded public Element display objects.
- `PUT /workspaces/:workspaceId/canvas` — Atomic snapshot replacement.

### Out of Scope (Explicitly Deferred)
- Individual Node CRUD endpoints (`POST/PATCH/DELETE /nodes`).
- Individual Edge CRUD endpoints (`POST/PATCH/DELETE /edges`).
- Autosave scheduling, debounce, or retry orchestration (handled by frontend).
- Undo / redo state tracking.
- Canvas versioning or audit history.
- Collaboration, WebSockets, or realtime cursors.
- Canvas templates or simulation execution.

---

## 4. Authentication, User Status & Ownership Isolation

- **Authentication**: Both routes are protected by the global `AuthGuard`. User ID is extracted exclusively from JWT claims (`user.sub`).
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

## 6. Public Response & Timestamp Contract

### Node & Edge Timestamps Excluded
Because `PUT /canvas` uses delete-and-recreate replacement semantics, `WorkspaceNode.createdAt`, `WorkspaceNode.updatedAt`, and `WorkspaceEdge.createdAt` are **excluded** from the public Canvas API.

`Workspace.updatedAt` serves as the single canonical Canvas save timestamp:
- `GET /canvas`: Returns current `Workspace.updatedAt` ISO-8601 string without mutating it.
- `PUT /canvas`: Returns committed `Workspace.updatedAt` ISO-8601 string updated inside the transaction.

### Historical Element Display Object
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

- **Historical Read Preservation**: `GET /canvas` returns this Element display object even if the persisted Element or its Category later becomes inactive. Historical workspaces remain readable and renderable. `GET` does not reapply current availability filters to persisted nodes.
- **Exclusions**: `status`, `categoryId`, Category status, relation arrays, `DiscoveryDetail`, and `UserElement` records are **not exposed**.
- Element deletion remains protected by the database `onDelete: Restrict` relation.

### Response Shape (HTTP 200 OK)
```json
{
  "data": {
    "workspaceId": "d25ae2dd-151a-4712-ae31-3ef5a59efcf6",
    "updatedAt": "2026-07-23T10:00:00.000Z",
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
    "updatedAt": "2026-07-23T10:00:00.000Z",
    "nodes": [],
    "edges": []
  }
}
```

---

## 7. PUT Replacement Contract & Payload Limits

### Replacement Semantics
- `PUT /canvas` replaces the complete graph state.
- Existing `WorkspaceEdge` and `WorkspaceNode` records not present in the request are deleted.
- Empty arrays `{ "nodes": [], "edges": [] }` clear the canvas completely and update `Workspace.updatedAt`.

### Payload Safety & Size Limits
- `MAX_CANVAS_NODES = 100` (Safety limit for school MVP frontend rendering)
- `MAX_CANVAS_EDGES = 200` (Safety limit for school MVP graph complexity)
- `MAX_NODE_VALUE_DATA_BYTES = 4096` (Serialized UTF-8 bytes per node `valueData`)
- `MAX_CANVAS_EDGE_LABEL_LENGTH = 100` (Max characters for edge label)

### Request Shape
```json
{
  "nodes": [
    {
      "id": "e43adfa0-2039-4670-a48e-0b92dc278f57",
      "elementId": "a1111111-1111-4111-a111-111111111111",
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
```

---

## 8. Node Validation & Value Data Contract

### Node Input Rules
1. `id`: Required valid UUID v4. Duplicate node IDs in payload -> `400 Bad Request`.
2. `elementId`: Required valid UUID v4.
3. `positionX`, `positionY`: Required finite numbers (`Number.isFinite()`). Non-finite (e.g. `NaN`, `Infinity`, string) -> `400 Bad Request`.
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

## 9. Edge Validation & Graph Integrity Rules

### Edge Input Rules
1. `id`: Required valid UUID v4. Duplicate edge IDs in payload -> `400 Bad Request`.
2. `sourceNodeId`: Required valid UUID v4. Must exist in submitted `nodes` array -> `400 Bad Request` (`"Source node '<sourceNodeId>' does not exist in canvas snapshot"`).
3. `targetNodeId`: Required valid UUID v4. Must exist in submitted `nodes` array -> `400 Bad Request` (`"Target node '<targetNodeId>' does not exist in canvas snapshot"`).
4. `label`: Required string.
   - Safe trim when string. Empty string `""` represents an unlabeled edge.
   - Length > 100 chars -> `400 Bad Request` (`"label exceeds maximum length (100)"`).
   - Null or non-string -> `400 Bad Request` (`"label must be a string"`).

### Directed Graph Duplicate Rules
- **Directed Graph**: Edge `A -> B` is distinct from `B -> A`. Reversing direction is allowed.
- **Self-Edges**: Forbidden (`sourceNodeId === targetNodeId`). Self-edge -> `400 Bad Request` (`"Self-connecting edges are not allowed"`).
- **Parallel Edges**: Allowed ONLY when normalized labels differ.
- **Duplicate Tuple**: `sourceNodeId + targetNodeId + normalizedLabel` duplicate inside payload -> `400 Bad Request` (`"Duplicate edge connection in canvas snapshot"`).

---

## 10. Global Client-ID Collision Rule

Client-generated UUID v4 IDs for Nodes and Edges are validated inside the transaction against existing database rows:

1. Requested Node IDs currently belonging to **another Workspace** -> `409 Conflict` (`"Canvas identifier conflict"`).
2. Requested Edge IDs currently belonging to **another Workspace** -> `409 Conflict` (`"Canvas identifier conflict"`).
3. Node or Edge IDs already belonging to the **current Workspace** ARE allowed (since the snapshot replaces the current workspace graph).
4. Raw Prisma `P2002` errors are caught and reclassified safely to `409 Conflict`. Zero external tenant data leaked.

---

## 11. Transaction & Race Boundary Sequence

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
10. Fetch updated Workspace to retrieve canonical updatedAt ISO timestamp.
11. Return committed CanvasSnapshotResponse ordered deterministically (id ASC).
```

### Rollback Guarantee
If node creation, edge creation, foreign key check, or validation fails, all graph mutations and the `Workspace.updatedAt` timestamp change roll back 100%.

---

## 12. Complete Aligned Error Matrix

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

## 13. Service Boundary & Proposed Source Map

To preserve thin controllers and maintain files under 300 physical lines, Canvas snapshot operations will be handled by a dedicated `WorkspaceCanvasService`:

### Proposed Source Map
- `src/workspace/workspace-canvas.service.ts` (~220 lines) — Owns `getCanvasSnapshot`, `saveCanvasSnapshot`, graph integrity, Element availability checks, and Prisma transaction replacement.
- `src/workspace/dto/workspace-node-input.dto.ts` (~30 lines) — DTO for node input validation.
- `src/workspace/dto/workspace-edge-input.dto.ts` (~25 lines) — DTO for edge input validation.
- `src/workspace/dto/save-canvas-snapshot.dto.ts` (~20 lines) — DTO for top-level snapshot request.
- `src/workspace/types/canvas-snapshot-response.type.ts` (~30 lines) — Public response types with embedded Element display object.
- `src/workspace/workspace.controller.ts` (Modifies ~25 lines) — Exposes `GET /:workspaceId/canvas` and `PUT /:workspaceId/canvas`.
- `src/workspace/workspace.module.ts` (Modifies ~5 lines) — Adds `WorkspaceCanvasService` to `providers`.

No new `GraphModule` is created. `WorkspaceService` remains focused on metadata CRUD.

---

## 14. Runtime Acceptance Plan (44 Scenarios)

The future implementation will be verified against a 44-scenario live HTTP/PostgreSQL suite compiled through `nest build`:

- **Auth & User Status (Scenarios 1-5)**: No token 401, malformed token 401, missing user 401, inactive/banned user 403.
- **Ownership Privacy (Scenarios 6-9)**: Missing vs non-owned workspace GET/PUT return identical 404.
- **GET Canvas & Historical Read (Scenarios 10-15)**: Empty canvas 200 with `[]`; active workspace snapshot 200; deterministic ordering (`id ASC`); historical GET returns Element display data for inactive Element / inactive Category; zero DB writes; archived workspace GET returns 200.
- **PUT Replacement (Scenarios 16-22)**: 1-node save 200; multi-node/edge save 200; replace removes omitted nodes/edges; empty snapshot `{ nodes: [], edges: [] }` clears canvas; `Workspace.updatedAt` updates on save; failed save leaves `updatedAt` unchanged; archived workspace PUT returns 409 Conflict.
- **Node Validation & Value Data (Scenarios 23-30)**: Missing/null nodes array 400; duplicate node ID 400; non-finite coordinates 400; null valueData 400; array valueData 400; primitive valueData 400; valueData > 4096 bytes 400; valueData default `{}`.
- **Element Availability Alignment (Scenarios 31-34)**: Non-existent Element 404 `"Element not found"`; inactive Element 400 `"Element is not active"`; inactive Category 400 `"Element category is not active"`; locked non-starter 403 `"Element is not unlocked by user"`.
- **Edge Validation & Directed Tuples (Scenarios 35-39)**: Missing/null edges array 400; duplicate edge ID 400; dangling sourceNodeId 400; dangling targetNodeId 400; self-edge 400; non-string label 400; duplicate directed edge tuple 400; reversed edge direction allowed; parallel edges with different labels allowed.
- **ID Collisions & Concurrent Race (Scenarios 40-42)**: Node ID collision with another workspace 409; Edge ID collision with another workspace 409; concurrent archive vs PUT rollback test.
- **Regression (Scenarios 43-44)**: Existing Workspace metadata CRUD, Health, Auth, Craft, and Elements routes unchanged.

### Execution Status in Planning Phase
- **Scenarios Executed**: 0 (Contract planning phase only)
- **PostgreSQL Endpoint Acceptance**: `NOT_RUN / PLANNED`
- **Postman/Newman Status**: `NOT_RUN / PENDING`

---

## 15. Success Criteria

- Contract frozen under marker `FROZEN_CANVAS_SNAPSHOT_API_CONTRACT_V1`.
- All 12 correction requirements incorporated in `CANVAS_SNAPSHOT_API_PLAN.md`.
- Zero source files created during planning phase.
- Zero Prisma, migration, or database changes during planning phase.
- Ready for implementation phase `P9_WORKSPACE_GRAPH_API_1B_IMPLEMENT_CANVAS_SNAPSHOT_001`.
