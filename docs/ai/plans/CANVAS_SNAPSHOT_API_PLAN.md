# Canvas Graph Snapshot API Implementation Plan

- **TASK_ID**: `P9_WORKSPACE_GRAPH_API_1A_FREEZE_CANVAS_SNAPSHOT_CONTRACT_001`
- **MARKER**: `FROZEN_CANVAS_SNAPSHOT_API_CONTRACT_V1`
- **STATUS**: FROZEN CONTRACT & IMPLEMENTATION PLAN
- **PROJECT ROOT**: `C:\devnest 101\single-project\fincraft-lab`
- **BACKEND ROOT**: `C:\devnest 101\single-project\fincraft-lab\fincraft-lab-api`

---

## 1. Executive Summary & Objective

The FinCraft Lab Canvas allows users to visually arrange financial Elements into interactive discovery graphs. Rather than exposing granular Node and Edge CRUD endpoints during MVP, the Canvas API persists and restores the complete graph structure via an atomic **Canvas Snapshot API**:

1. `GET /workspaces/:workspaceId/canvas` — Loads all persisted `WorkspaceNode` and `WorkspaceEdge` records for an owned Workspace.
2. `PUT /workspaces/:workspaceId/canvas` — Atomically replaces the entire persisted Canvas graph with a new snapshot in one database transaction.

This document freezes the exact contract, validation rules, error behavior, database transaction ordering, and runtime acceptance plan before source code implementation begins.

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
- `GET /workspaces/:workspaceId/canvas` — Retrieve current Canvas graph.
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

## 6. GET Snapshot Contract

`GET /workspaces/:workspaceId/canvas`

### Rules
- Param `:workspaceId` must be a valid UUID v4 (validated via `ParseUUIDPipe`).
- Returns full Canvas graph (`nodes` and `edges`) for the owned workspace.
- Deterministic ordering:
  - `nodes`: ordered by `createdAt ASC`, `id ASC`.
  - `edges`: ordered by `createdAt ASC`, `id ASC`.
- Zero database writes; does not mutate `Workspace.updatedAt`.

### Response Shape (HTTP 200 OK)
```json
{
  "data": {
    "workspaceId": "d25ae2dd-151a-4712-ae31-3ef5a59efcf6",
    "nodes": [
      {
        "id": "e43adfa0-2039-4670-a48e-0b92dc278f57",
        "elementId": "a1111111-1111-4111-a111-111111111111",
        "positionX": 150.5,
        "positionY": 200.0,
        "valueData": { "amount": 5000 },
        "createdAt": "2026-07-23T10:00:00.000Z",
        "updatedAt": "2026-07-23T10:00:00.000Z"
      }
    ],
    "edges": [
      {
        "id": "f5555555-5555-4555-a555-555555555555",
        "sourceNodeId": "e43adfa0-2039-4670-a48e-0b92dc278f57",
        "targetNodeId": "e43adfa0-2039-4670-a48e-0b92dc278f58",
        "label": "FLOWS_TO",
        "createdAt": "2026-07-23T10:00:00.000Z"
      }
    ]
  }
}
```

### Empty Canvas Response (HTTP 200 OK)
```json
{
  "data": {
    "workspaceId": "d25ae2dd-151a-4712-ae31-3ef5a59efcf6",
    "nodes": [],
    "edges": []
  }
}
```

---

## 7. PUT Snapshot Replacement Contract

`PUT /workspaces/:workspaceId/canvas`

### Replacement Semantics
- Request describes the complete desired Canvas state.
- Existing `WorkspaceEdge` and `WorkspaceNode` records not in the request are deleted.
- Submitted `nodes` and `edges` become the new complete graph.

### Payload Limits (MVP Safety Bounds)
- `MAX_CANVAS_NODES = 100`
- `MAX_CANVAS_EDGES = 200`
- `MAX_EDGE_LABEL_LENGTH = 50`

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

## 8. Node Validation & Element Availability Rules

### Node Input Validation
1. `id`: Required valid UUID v4. Duplicate node IDs in payload -> `400 Bad Request`.
2. `elementId`: Required valid UUID v4.
3. `positionX`, `positionY`: Required finite numbers (`Number.isFinite()`). Non-finite (e.g. `NaN`, `Infinity`, string) -> `400 Bad Request`.
4. `valueData`: Required non-null object (`typeof === 'object' && !Array.isArray()`). Default `{}` if omitted.

### Element Availability Domain Rule
Nodes submitted during `PUT /canvas` must reference an Element currently available to the User:
- `Element.status = 'ACTIVE'`
- `ElementCategory.status = 'ACTIVE'`
- Element is either a **Starter Element** (`isStarter = true`) OR unlocked by the User via `UserElement` (`userId = user.sub`).
- If any submitted node references an unavailable/locked/inactive Element -> `400 Bad Request` (`"Element '<elementId>' is not available for workspace canvas"`).

### Historical Read Policy (GET vs PUT)
- **READ (GET)**: Returns all persisted nodes regardless of whether master content status later changes to `INACTIVE`. Historical workspaces remain viewable.
- **WRITE (PUT)**: Validates current availability for all submitted nodes at save time.

---

## 9. Edge Validation & Graph Integrity Rules

### Edge Input Validation
1. `id`: Required valid UUID v4. Duplicate edge IDs in payload -> `400 Bad Request`.
2. `sourceNodeId`: Required valid UUID v4. Must exist in submitted `nodes` array -> `400 Bad Request` (`"Source node '<sourceNodeId>' does not exist in canvas snapshot"`).
3. `targetNodeId`: Required valid UUID v4. Must exist in submitted `nodes` array -> `400 Bad Request` (`"Target node '<targetNodeId>' does not exist in canvas snapshot"`).
4. `label`: Required string (trimmed, non-empty, max 50 chars).

### Structural Graph Integrity
- **Self-Edges**: Forbidden (`sourceNodeId === targetNodeId`). Self-edge -> `400 Bad Request` (`"Self-connecting edges are not allowed"`).
- **Parallel Edges**: Allowed (multiple edges between same nodes with different labels e.g. `"FLOWS_TO"`, `"DEPENDS_ON"`).
- **Cross-Workspace References**: Impossible by contract because source/target node IDs must exist within the submitted snapshot array.

---

## 10. Atomic Database Transaction Sequence

All database mutations occur inside a single Prisma `$transaction`:

```text
1. Validate User status (ACTIVE required).
2. Validate owned Workspace existence (throw 404 if missing/non-owned).
3. Validate Workspace status (throw 409 if ARCHIVED).
4. Validate schema & payload limits (nodes <= 100, edges <= 200).
5. Validate graph integrity (duplicate IDs, dangling edges, self-edges).
6. Validate Element availability for all submitted elementIds.
7. Execute Prisma $transaction:
   a. prisma.workspaceEdge.deleteMany({ where: { workspaceId } })
   b. prisma.workspaceNode.deleteMany({ where: { workspaceId } })
   c. prisma.workspaceNode.createMany({ data: newNodesWithWorkspaceId })
   d. prisma.workspaceEdge.createMany({ data: newEdgesWithWorkspaceId })
   e. prisma.workspace.update({ where: { id: workspaceId }, data: { updatedAt: new Date() } })
8. Return committed CanvasSnapshotResponse with ISO-8601 timestamps.
```

### Rollback Guarantee
If node creation, edge creation, foreign key check, or connection fails, the transaction rolls back 100%. No partial node or edge records remain.

---

## 11. Complete Error Matrix

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
| Unavailable / locked Element ID | 400 | `"Element '<elementId>' is not available for workspace canvas"` |
| Non-finite coordinate (`NaN`) | 400 | `"positionX must be a finite number"` |
| Dangling edge (`sourceNodeId` not in nodes) | 400 | `"Source node '<sourceNodeId>' does not exist in canvas snapshot"` |
| Self-edge (`sourceNodeId == targetNodeId`) | 400 | `"Self-connecting edges are not allowed"` |

---

## 12. Proposed Source Structure & File Boundaries

To maintain small, focused files (under 300 physical lines per file), the Canvas functionality will be integrated into the existing `src/workspace/` feature module:

### New Files to Create in Implementation Phase
- `src/workspace/dto/workspace-node-input.dto.ts` (~25 lines)
- `src/workspace/dto/workspace-edge-input.dto.ts` (~25 lines)
- `src/workspace/dto/save-canvas-snapshot.dto.ts` (~20 lines)
- `src/workspace/types/canvas-snapshot-response.type.ts` (~25 lines)

### Modifications in Implementation Phase
- `src/workspace/workspace.controller.ts` (Add `GET /:workspaceId/canvas` and `PUT /:workspaceId/canvas`)
- `src/workspace/workspace.service.ts` (Add `getCanvasSnapshot` and `saveCanvasSnapshot` methods)

---

## 13. Runtime Acceptance Plan (40 Scenarios)

The future implementation will be verified against a 40-scenario live HTTP/PostgreSQL suite compiled through `nest build`:

- **Auth & User Status (Scenarios 1-5)**: No token 401, malformed token 401, missing user 401, inactive/banned user 403.
- **Ownership Privacy (Scenarios 6-9)**: Missing vs non-owned workspace GET/PUT return identical 404.
- **GET Canvas (Scenarios 10-13)**: Empty canvas returns empty arrays; active workspace snapshot returns deterministic nodes/edges; zero DB writes; archived workspace GET returns 200.
- **PUT Replacement (Scenarios 14-20)**: Create 1-node, multi-node/edge; replace removes omitted nodes/edges; empty snapshot `{ nodes: [], edges: [] }` clears canvas; `Workspace.updatedAt` updates on save; archived workspace PUT returns 409 Conflict.
- **Node Validation (Scenarios 21-28)**: Missing/null nodes array 400; duplicate node ID 400; non-finite coordinates 400; non-object valueData 400; unavailable/locked Element 400.
- **Edge Validation (Scenarios 29-34)**: Missing/null edges array 400; duplicate edge ID 400; dangling sourceNodeId 400; dangling targetNodeId 400; self-edge 400; blank label 400.
- **Atomicity & Bounds (Scenarios 35-37)**: Over 100 nodes / 200 edges 400; transactional rollback on error (zero partial writes); unrelated tables unchanged.
- **Regression (Scenarios 38-40)**: Health 200, Auth/me 401, Craft 401, Elements 401, Workspace metadata CRUD unchanged.

---

## 14. Success Criteria

- Contract frozen under marker `FROZEN_CANVAS_SNAPSHOT_API_CONTRACT_V1`.
- Zero source files created during planning phase.
- Zero Prisma, migration, or database changes during planning phase.
- Ready for implementation phase `P9_WORKSPACE_GRAPH_API_1B_IMPLEMENT_CANVAS_SNAPSHOT_001`.
