# Canvas Snapshot API Compiled Runtime Acceptance Report

- **Task ID**: `P9_WORKSPACE_GRAPH_API_1B_IMPLEMENT_CANVAS_SNAPSHOT_001` / `P9_WORKSPACE_GRAPH_API_1D_FINAL_CANVAS_MAINTAINABILITY_REPAIR_001`
- **Execution Date**: `2026-07-24`
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
2. **Service Boundaries & Maintainability Split**: Canvas operations are owned by `WorkspaceCanvasService` (`src/workspace/workspace-canvas.service.ts` — 343 physical lines), supported by pure helper `WorkspaceCanvasValidation` (`workspace-canvas.validation.ts` — 183 physical lines) and `WorkspaceCanvasMapper` (`workspace-canvas.mapper.ts` — 62 physical lines). All maintained source files remain strictly under 500 physical lines.
3. **Timestamp Semantics**: Reads and writes expose `workspaceUpdatedAt` reflecting `Workspace.updatedAt`. Node and Edge records do not maintain timestamp columns.
4. **Historical Renderability**: `GET /workspaces/:workspaceId/canvas` joins current master `Element` display metadata (`id`, `name`, `slug`, `emoji`, `iconUrl`, `elementType`, `isStarter`) without filtering inactive status, allowing archived or old canvases containing inactive elements to render cleanly.
5. **Atomic Replacement**: `PUT` atomically replaces the graph inside a single Prisma `$transaction` after checking element availability, global node/edge ID collisions against other workspaces (`409 Conflict`), and payload limits.
6. **Worktree Cleanliness & Exact Lint Warning**: Untracked `fincraft-lab.rar` archive relocated to `C:\devnest 101\single-project\_archives\fincraft-lab.rar`. The single pre-existing non-mutating lint warning in `src/main.ts:20:1` is `@typescript-eslint/no-floating-promises` (`Promises must be awaited...`).

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
- **Scenario 16**: Canvas read reflects current Element display metadata [PASSED]
- **Scenario 17**: Inactive Element remains renderable through `GET /canvas` [PASSED]
- **Scenario 18**: Inactive Category remains renderable through `GET /canvas` [PASSED]
- **Scenario 19**: `GET /canvas` embeds public `element` display object (`id`, `name`, `slug`, `emoji`, `iconUrl`, `elementType`, `isStarter`) [PASSED]

### PUT Canvas Graph Replacement & Atomicity (Scenarios 20–26)
- **Scenario 20**: `PUT` 1-node snapshot replaces graph and returns updated `workspaceUpdatedAt` [PASSED]
- **Scenario 21**: `PUT` multi-node & edge snapshot replaces graph successfully [PASSED]
- **Scenario 22**: `PUT` replacement removes omitted nodes and edges [PASSED]
- **Scenario 23**: `PUT` empty snapshot clears canvas graph [PASSED]
- **Scenario 24**: Successful `PUT` updates `workspaceUpdatedAt` [PASSED]
- **Scenario 25**: Failed `PUT` (invalid UUID) leaves `workspaceUpdatedAt` unchanged [PASSED]
- **Scenario 26**: `PUT` on `ARCHIVED` workspace returns `409 Conflict` (`"Workspace is archived"`) [PASSED]

### Two-Layer Payload Limits (Scenarios 27–31)
- **Scenario 27**: Valid payload below 512 KB reaches Canvas endpoint [PASSED]
- **Scenario 28**: Payload safely below 512 KB boundary is accepted [PASSED]
- **Scenario 29**: Payload > 512 KB and <= 1 MB returns `400 Bad Request` (`"Canvas snapshot payload is too large"`) [PASSED]
- **Scenario 30**: Payload > 1 MB returns framework `413 Payload Too Large` [PASSED]
- **Scenario 31**: Existing non-Canvas JSON endpoint works under 1 MB framework body parser configuration [PASSED]

### Node & ValueData Structure Validation (Scenarios 32–39)
- **Scenario 32**: Missing/null `nodes` array returns `400 Bad Request` [PASSED]
- **Scenario 33**: Duplicate node ID in payload returns `400 Bad Request` (`"Duplicate node ID '<id>' in snapshot"`) [PASSED]
- **Scenario 34**: Non-finite coordinates return `400 Bad Request` [PASSED]
- **Scenario 35**: Null `valueData` returns `400 Bad Request` (`"valueData must be a plain object"`) [PASSED]
- **Scenario 36**: Array `valueData` returns `400 Bad Request` (`"valueData must be a plain object"`) [PASSED]
- **Scenario 37**: Primitive `valueData` returns `400 Bad Request` (`"valueData must be a plain object"`) [PASSED]
- **Scenario 38**: `valueData` > 4096 bytes returns `400 Bad Request` (`"valueData exceeds maximum size limit (4096 bytes)"`) [PASSED]
- **Scenario 39**: Omitted `valueData` defaults to `{}` [PASSED]

### Element Availability Validation (Scenarios 40–43)
- **Scenario 40**: Unknown Element ID returns `404 Not Found` (`"Element not found"`) [PASSED]
- **Scenario 41**: Inactive Element returns `400 Bad Request` (`"Element is not active"`) [PASSED]
- **Scenario 42**: Element in inactive Category returns `400 Bad Request` (`"Element category is not active"`) [PASSED]
- **Scenario 43**: Locked Non-Starter Element returns `403 Forbidden` (`"Element is not unlocked by user"`) [PASSED]

### Edge & Graph Structure Validation (Scenarios 44–47)
- **Scenario 44**: Duplicate edge ID in payload returns `400 Bad Request` (`"Duplicate edge ID '<id>' in snapshot"`) [PASSED]
- **Scenario 45**: Dangling `sourceNodeId` / `targetNodeId` returns `400 Bad Request` [PASSED]
- **Scenario 46**: Self-connecting edge returns `400 Bad Request` (`"Self-connecting edges are not allowed"`) [PASSED]
- **Scenario 47**: Duplicate directed tuple returns `400 Bad Request` (`"Duplicate edge connection in canvas snapshot"`) [PASSED]

### Global Identifier Collisions & Non-Regression (Scenarios 48–50)
- **Scenario 48**: Node ID collision with another workspace returns `409 Conflict` (`"Canvas identifier conflict"`) [PASSED]
- **Scenario 49**: Edge ID collision with another workspace returns `409 Conflict` (`"Canvas identifier conflict"`) [PASSED]
- **Scenario 50**: Existing endpoints remain functional across `/health`, `/auth/me`, `/elements`, `/workspaces` [PASSED]

---

## 3. Compiled NestJS Acceptance Execution Logs

```text
[PASS] Scenario 1: Unauthenticated GET returns 401
[PASS] Scenario 2: Malformed Bearer GET returns 401
[PASS] Scenario 3: Missing User GET returns 401
[PASS] Scenario 4: Inactive User GET returns 403
[PASS] Scenario 5: Inactive User PUT returns 403
[PASS] Scenario 6: Non-existent Workspace GET returns 404
[PASS] Scenario 7: Non-owned Workspace GET returns 404
[PASS] Scenario 8: Non-existent Workspace PUT returns 404
[PASS] Scenario 9: Non-owned Workspace PUT returns 404
[PASS] Scenario 10: GET canvas exposes workspaceUpdatedAt
[PASS] Scenario 11: GET canvas causes 0 timestamp writes
[PASS] Scenario 12: Workspace PATCH updates workspaceUpdatedAt
[PASS] Scenario 13: GET canvas for empty workspace returns empty arrays
[PASS] Scenario 14: GET canvas returns active snapshot with id ASC ordering
[PASS] Scenario 14b: PUT 2-node snapshot created successfully
[PASS] Scenario 15: GET canvas for ARCHIVED workspace returns 200
[PASS] Scenario 16: Canvas read reflects current Element display metadata
[PASS] Scenario 17: Inactive Element remains renderable via GET
[PASS] Scenario 18: Inactive Category remains renderable via GET
[PASS] Scenario 19: Canvas read embeds public element display object
[PASS] Scenario 20: PUT 1-node snapshot succeeds
[PASS] Scenario 21: PUT multi-node & edge snapshot succeeds
[PASS] Scenario 22: PUT replacement removes omitted nodes and edges
[PASS] Scenario 23: PUT empty snapshot clears canvas graph
[PASS] Scenario 24: Successful PUT updates workspaceUpdatedAt
[PASS] Scenario 25: Failed PUT leaves workspaceUpdatedAt unchanged
[PASS] Scenario 25b: DB timestamp untouched on failed PUT
[PASS] Scenario 26: PUT on ARCHIVED workspace returns 409
[PASS] Scenario 27: Valid payload below 512 KB succeeds
[PASS] Scenario 28: Payload safely below 512 KB boundary succeeds
[PASS] Scenario 29: Payload > 512 KB and <= 1 MB returns 400
[PASS] Scenario 30: Payload > 1 MB returns framework 413
[PASS] Scenario 31: Existing non-Canvas endpoint works under 1 MB parser
[PASS] Scenario 32: Missing nodes array returns 400
[PASS] Scenario 33: Duplicate Node ID in payload returns 400
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
[PASS] Scenario 47b: Reversed direction and parallel edges with different labels succeed
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
