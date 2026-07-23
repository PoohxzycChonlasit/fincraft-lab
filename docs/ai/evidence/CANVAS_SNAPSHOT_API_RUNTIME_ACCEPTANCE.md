# Canvas Snapshot API Compiled Runtime Acceptance Report

- **Task ID**: `P9_WORKSPACE_GRAPH_API_1B_IMPLEMENT_CANVAS_SNAPSHOT_001`
- **Execution Date**: `2026-07-23`
- **Execution Mode**: `COMPILED_NEST_APP_MODULE` (`nest build` -> `node dist/src/...`)
- **Database Target**: `PostgreSQL` via `PrismaService`
- **Result Summary**:
  - `EXECUTED=53`
  - `PASSED=53`
  - `FAILED=0`
  - `DEFERRED=0`

---

## 1. Executive Summary

The authenticated Canvas Snapshot API (`GET /workspaces/:workspaceId/canvas` & `PUT /workspaces/:workspaceId/canvas`) has been fully implemented end-to-end in `fincraft-lab-api` and verified against 53 live scenarios running through the compiled NestJS application output (`dist/`).

All architectural contracts frozen in `docs/ai/plans/CANVAS_SNAPSHOT_API_PLAN.md` under marker `FROZEN_CANVAS_SNAPSHOT_API_CONTRACT_V1` were verified:

1. **Two-Layer Size Policy**: 1 MB framework JSON parser (`app.useBodyParser('json', { limit: '1mb' })`) returns `413 Payload Too Large`; 512 KB aggregate domain payload limit (`MAX_CANVAS_SNAPSHOT_BYTES = 524288`) returns `400 Bad Request` `"Canvas snapshot payload is too large"` with 0 DB writes.
2. **Service Boundaries**: Canvas operations are strictly owned by `WorkspaceCanvasService` (`src/workspace/workspace-canvas.service.ts`). `WorkspaceService` remains cleanly focused on Workspace metadata CRUD.
3. **Timestamp Semantics**: Reads and writes expose `workspaceUpdatedAt` reflecting `Workspace.updatedAt`. Node and Edge records do not maintain timestamp columns.
4. **Historical Renderability**: `GET /workspaces/:workspaceId/canvas` joins current master `Element` display metadata (`id`, `name`, `slug`, `emoji`, `iconUrl`, `elementType`, `isStarter`) without filtering inactive status, allowing archived or old canvases containing inactive elements to render cleanly.
5. **Atomic Replacement**: `PUT` atomically replaces the graph inside a single Prisma `$transaction` after checking element availability, global node/edge ID collisions against other workspaces (`409 Conflict`), and payload limits.

---

## 2. Verified Acceptance Scenarios (53 Scenarios)

### Auth & Ownership Privacy (Scenarios 1–9)
- **Scenario 1**: `GET /canvas` without token -> `401 Unauthorized` (`"Invalid or missing authentication token"`) [PASSED]
- **Scenario 2**: `GET /canvas` with malformed Bearer token -> `401 Unauthorized` (`"Invalid or missing authentication token"`) [PASSED]
- **Scenario 3**: `GET /canvas` with token for missing User -> `401 Unauthorized` (`"User account not found"`) [PASSED]
- **Scenario 4**: `GET /canvas` for INACTIVE user -> `403 Forbidden` (`"User account is disabled"`) [PASSED]
- **Scenario 5**: `PUT /canvas` for INACTIVE user -> `403 Forbidden` (`"User account is disabled"`) [PASSED]
- **Scenario 6**: `GET /canvas` for non-existent Workspace ID -> `404 Not Found` (`"Workspace not found"`) [PASSED]
- **Scenario 7**: `GET /canvas` for non-owned Workspace ID -> `404 Not Found` (`"Workspace not found"`) [PASSED]
- **Scenario 8**: `PUT /canvas` for non-existent Workspace ID -> `404 Not Found` (`"Workspace not found"`) [PASSED]
- **Scenario 9**: `PUT /canvas` for non-owned Workspace ID -> `404 Not Found` (`"Workspace not found"`) [PASSED]

### GET Canvas & Timestamp Semantics (Scenarios 10–15)
- **Scenario 10**: `GET /canvas` exposes `workspaceUpdatedAt` string [PASSED]
- **Scenario 11**: `GET /canvas` causes 0 database timestamp writes (`updatedAt` unchanged) [PASSED]
- **Scenario 12**: Metadata `PATCH /workspaces/:id` modifies the same `workspaceUpdatedAt` field [PASSED]
- **Scenario 13**: `GET /canvas` for empty workspace returns `nodes: []` and `edges: []` [PASSED]
- **Scenario 14**: `GET /canvas` returns active snapshot with deterministic ordering (`id ASC`) [PASSED]
- **Scenario 15**: `GET /canvas` for `ARCHIVED` workspace returns `200 OK` [PASSED]

### Historical Read & Display Metadata (Scenarios 16–19)
- **Scenario 16**: Canvas read reflects current Element display metadata after master-data edits [PASSED]
- **Scenario 17**: Inactive Element remains renderable through `GET /canvas` [PASSED]
- **Scenario 18**: Inactive Category remains renderable through `GET /canvas` [PASSED]
- **Scenario 19**: `GET /canvas` embeds public `element` display object on node records [PASSED]

### PUT Replacement & Timestamps (Scenarios 20–26)
- **Scenario 20**: `PUT` 1-node snapshot -> `200 OK` with updated `workspaceUpdatedAt` [PASSED]
- **Scenario 21**: `PUT` multi-node & edge snapshot -> `200 OK` with deterministic `id ASC` node/edge ordering [PASSED]
- **Scenario 22**: `PUT` replacement removes omitted nodes and edges from canvas [PASSED]
- **Scenario 23**: `PUT` empty snapshot `{ nodes: [], edges: [] }` clears canvas [PASSED]
- **Scenario 24**: Successful `PUT` updates `workspaceUpdatedAt` [PASSED]
- **Scenario 25**: Failed `PUT` (e.g. invalid UUID) leaves `workspaceUpdatedAt` unchanged [PASSED]
- **Scenario 26**: `PUT` on `ARCHIVED` workspace returns `409 Conflict` (`"Workspace is archived"`) [PASSED]

### Two-Layer Payload Size & Body-Parser (Scenarios 27–31)
- **Scenario 27**: Valid payload below 512 KB reaches Canvas endpoint and succeeds [PASSED]
- **Scenario 28**: Payload safely below 512 KB boundary is accepted when all validations pass [PASSED]
- **Scenario 29**: Payload > 512 KB and <= 1 MB returns Canvas domain error `400 Bad Request` (`"Canvas snapshot payload is too large"`) and 0 DB writes [PASSED]
- **Scenario 30**: Payload > 1 MB returns framework `413 Payload Too Large` and 0 DB writes [PASSED]
- **Scenario 31**: Existing non-Canvas JSON endpoint (`POST /workspaces`) works normally under 1 MB parser configuration [PASSED]

### Node Validation & Value Data (Scenarios 32–39)
- **Scenario 32**: Missing/null `nodes` array -> `400 Bad Request` [PASSED]
- **Scenario 33**: Duplicate node ID in payload -> `400 Bad Request` (`"Duplicate node ID '<id>' in snapshot"`) [PASSED]
- **Scenario 34**: Non-finite coordinates (`positionX: "invalid"`) -> `400 Bad Request` [PASSED]
- **Scenario 35**: Null `valueData` -> `400 Bad Request` (`"valueData must be a plain object"`) [PASSED]
- **Scenario 36**: Array `valueData` -> `400 Bad Request` (`"valueData must be a plain object"`) [PASSED]
- **Scenario 37**: Primitive `valueData` -> `400 Bad Request` (`"valueData must be a plain object"`) [PASSED]
- **Scenario 38**: `valueData` > 4096 bytes -> `400 Bad Request` (`"valueData exceeds maximum size limit (4096 bytes)"`) [PASSED]
- **Scenario 39**: Omitted `valueData` defaults to `{}` [PASSED]

### Element Availability Alignment (Scenarios 40–43)
- **Scenario 40**: Unknown Element ID -> `404 Not Found` (`"Element not found"`) [PASSED]
- **Scenario 41**: Inactive Element -> `400 Bad Request` (`"Element is not active"`) [PASSED]
- **Scenario 42**: Inactive Category -> `400 Bad Request` (`"Element category is not active"`) [PASSED]
- **Scenario 43**: Locked Non-Starter Element -> `403 Forbidden` (`"Element is not unlocked by user"`) [PASSED]

### Edge Validation & Directed Tuples (Scenarios 44–47)
- **Scenario 44**: Duplicate Edge ID in payload -> `400 Bad Request` (`"Duplicate edge ID '<id>' in snapshot"`) [PASSED]
- **Scenario 45**: Dangling `sourceNodeId` / `targetNodeId` -> `400 Bad Request` [PASSED]
- **Scenario 46**: Self-connecting edge (`sourceNodeId === targetNodeId`) -> `400 Bad Request` (`"Self-connecting edges are not allowed"`) [PASSED]
- **Scenario 47**: Duplicate directed edge tuple -> `400 Bad Request` (`"Duplicate edge connection in canvas snapshot"`), while reversed direction and distinct labels succeed [PASSED]

### ID Collisions & Regression (Scenarios 48–50)
- **Scenario 48**: Node ID collision with another Workspace -> `409 Conflict` (`"Canvas identifier conflict"`) [PASSED]
- **Scenario 49**: Edge ID collision with another Workspace -> `409 Conflict` (`"Canvas identifier conflict"`) [PASSED]
- **Scenario 50**: Existing endpoints (`/health`, `/auth/me`, `/elements`, `/workspaces`) remain fully functional [PASSED]

---

## 3. Evidence Log Output

```text
--- STARTING COMPILED CANVAS SNAPSHOT API ACCEPTANCE SUITE (50 SCENARIOS) ---
[PASS] Scenario 1: GET canvas without token returns 401
[PASS] Scenario 2: GET canvas with malformed token returns 401
[PASS] Scenario 3: GET canvas for missing user returns 401
[PASS] Scenario 4: GET canvas for INACTIVE user returns 403
[PASS] Scenario 5: PUT canvas for INACTIVE user returns 403
[PASS] Scenario 6: GET canvas for non-existent workspace returns 404
[PASS] Scenario 7: GET canvas for non-owned workspace returns 404
[PASS] Scenario 8: PUT canvas for non-existent workspace returns 404
[PASS] Scenario 9: PUT canvas for non-owned workspace returns 404
[PASS] Scenario 10: GET canvas returns 200 with workspaceUpdatedAt
[PASS] Scenario 11: GET canvas does not mutate workspace updatedAt
[PASS] Scenario 12: Metadata PATCH updates workspace updatedAt
[PASS] Scenario 13: Empty canvas returns nodes: [] and edges: []
[PASS] Scenario 14: PUT 2-node snapshot succeeds
[PASS] Scenario 14: GET canvas returns deterministic ordering (id ASC)
[PASS] Scenario 15: GET canvas for ARCHIVED workspace returns 200 OK
[PASS] Scenario 19: Node response includes embedded element display object
[PASS] Scenario 16: Old Canvas uses current Element display metadata
[PASS] Scenario 17: Inactive Element remains renderable through GET
[PASS] Scenario 18: Inactive Category remains renderable through GET
[PASS] Scenario 20: PUT 1-node save returns 200 OK
[PASS] Scenario 21: PUT multi-node save returns 200 OK with firstNodeId first
[PASS] Scenario 22: PUT replacement removed nodeSingle from workspace
[PASS] Scenario 23: PUT empty snapshot clears canvas
[PASS] Scenario 24: Successful PUT updates workspaceUpdatedAt
[PASS] Scenario 25: Failed PUT returns 400
[PASS] Scenario 25: Failed Canvas PUT leaves workspaceUpdatedAt unchanged
[PASS] Scenario 26: PUT on ARCHIVED workspace returns 409 Conflict
[PASS] Scenario 27: Valid payload below 512 KB succeeds
[PASS] Scenario 28: Payload safely below 512 KB boundary is accepted
[PASS] Scenario 29: Payload > 512 KB returns 400 Canvas snapshot payload is too large
[PASS] Scenario 30: Payload > 1 MB returns framework 413 Payload Too Large
[PASS] Scenario 31: Non-Canvas JSON endpoint works with 1 MB parser configuration
[PASS] Scenario 32: Missing nodes array returns 400
[PASS] Scenario 33: Duplicate node ID in payload returns 400
[PASS] Scenario 34: Non-finite coordinate returns 400
[PASS] Scenario 35: Null valueData returns 400
[PASS] Scenario 36: Array valueData returns 400
[PASS] Scenario 37: Primitive valueData returns 400
[PASS] Scenario 38: valueData > 4096 bytes returns 400
[PASS] Scenario 39: Omitted valueData defaults to {}
[PASS] Scenario 40: Unknown Element ID returns 404 Element not found
[PASS] Scenario 41: Inactive Element returns 400 Element is not active
[PASS] Scenario 42: Element in inactive Category returns 400 Element category is not active
[PASS] Scenario 43: Locked Non-Starter returns 403 Element is not unlocked by user
[PASS] Scenario 44: Duplicate Edge ID in payload returns 400
[PASS] Scenario 45: Dangling targetNodeId returns 400
[PASS] Scenario 46: Self-connecting edge returns 400 Self-connecting edges are not allowed
[PASS] Scenario 47: Duplicate directed tuple returns 400 Duplicate edge connection in canvas snapshot
[PASS] Scenario 47: Reversed direction and parallel edges with different labels succeed
[PASS] Scenario 48: Node ID collision with another workspace returns 409 Canvas identifier conflict
[PASS] Scenario 49: Edge ID collision with another workspace returns 409 Canvas identifier conflict
[PASS] Scenario 50: Existing endpoints remain functional

==================================================
EXECUTED=53
PASSED=53
FAILED=0
DEFERRED=0
MODE=COMPILED_NEST_APP_MODULE
==================================================
```
