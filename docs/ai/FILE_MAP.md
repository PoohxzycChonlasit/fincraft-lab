# FILE_MAP.md — Project Structure & Key File Map

This document lists key project files and their purpose.

## Root directory structure

```text
fincraft-lab/
├── AGENTS.md                  # Canonical rules for all AI tools (ALWAYS READ FIRST)
├── GEMINI.md                  # Gemini adapter (points to AGENTS.md)
├── CLAUDE.md                  # Claude adapter (points to AGENTS.md)
├── .agents/skills/            # Agent skills directory
│   └── fincraft-teacher-stepwise-loop/SKILL.md
├── docs/ai/                   # Shared AI documentation
│   ├── CURRENT_STATUS.md      # Latest verified state
│   ├── FILE_MAP.md            # This file
│   ├── PROJECT_CONTEXT.md     # Product context
│   ├── CODING_RULES.md        # Comprehensive coding rules
│   ├── STEPWISE_WORKFLOW.md   # Stepwise development rules
│   ├── plans/                 # Architectural plans
│   │   ├── CORE_CONTENT_SEED_PLAN.md # Seed plan
│   │   ├── CRAFT_API_PLAN.md  # Frozen Craft API V1 contract plan (POST /craft)
│   │   ├── CRAFT_SERVICE_IMPLEMENTATION_PLAN.md # Frozen CraftService implementation plan
│   │   ├── AVAILABLE_ELEMENTS_API_PLAN.md # Available Elements API plan
│   │   ├── WORKSPACE_CRUD_API_PLAN.md # Workspace Metadata CRUD API plan
│   │   ├── CANVAS_SNAPSHOT_API_PLAN.md # Canvas Graph Snapshot API plan
│   │   └── AUTH_FAKEBUCK_STYLE_REFACTOR_PLAN.md # Auth refactor plan
│   └── evidence/              # Verification & acceptance evidence
│       ├── CRAFT_API_RUNTIME_ACCEPTANCE.md # Runtime acceptance report for POST /craft
│       ├── AVAILABLE_ELEMENTS_API_RUNTIME_ACCEPTANCE.md # Runtime acceptance report for GET /elements
│       ├── WORKSPACE_CRUD_API_RUNTIME_ACCEPTANCE.md # Runtime acceptance report for /workspaces CRUD
│       └── CANVAS_SNAPSHOT_API_RUNTIME_ACCEPTANCE.md # Runtime acceptance report for /workspaces/:workspaceId/canvas GET/PUT
├── fincraft-lab-api/          # NestJS backend root
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma 7.8 schema (PostgreSQL)
│   │   ├── seed.ts            # Seed main runner script
│   │   └── seed/              # Seed helpers, content & step modules
│   ├── src/
│   │   ├── main.ts            # App entry point (1 MB framework JSON parser configured)
│   │   ├── app.module.ts      # Root module
│   │   ├── craft/             # Craft feature module (POST /craft)
│   │   ├── element/           # Element read feature module (GET /elements)
│   │   ├── workspace/         # Workspace feature module (CRUD & Canvas snapshot endpoints)
│   │   │   ├── workspace.module.ts # Feature module at root
│   │   │   ├── controllers/
│   │   │   │   └── workspace.controller.ts # Workspace & Canvas snapshot controller
│   │   │   ├── services/
│   │   │   │   ├── workspace.service.ts # Workspace metadata CRUD service (145 lines)
│   │   │   │   └── workspace-canvas.service.ts # Canvas snapshot GET & PUT orchestration service (306 lines)
│   │   │   ├── validators/
│   │   │   │   └── workspace-canvas.validator.ts # Pure Canvas graph & payload validator (156 lines)
│   │   │   ├── mappers/
│   │   │   │   └── workspace-canvas.mapper.ts # Pure Canvas snapshot response mapper (72 lines)
│   │   │   ├── constants/
│   │   │   │   └── workspace.constants.ts # Named domain constants & limits
│   │   │   ├── dto/
│   │   │   │   ├── create-workspace.dto.ts
│   │   │   │   ├── update-workspace.dto.ts
│   │   │   │   ├── workspace-node-input.dto.ts
│   │   │   │   ├── workspace-edge-input.dto.ts
│   │   │   │   └── save-canvas-snapshot.dto.ts
│   │   │   └── types/
│   │   │       ├── workspace-response.type.ts
│   │   │       └── canvas-snapshot-response.type.ts
│   │   ├── database/          # Prisma database module & service
│   │   ├── auth/              # Auth module (register, login, me endpoints)
│   │   ├── user/              # User persistence service
│   │   ├── bcrypt/            # Password hashing service
│   │   ├── infrastructure/    # JWT access token service
│   │   └── health/            # Health check endpoint
│   └── test/                  # E2E tests
└── fincraft-lab-web/          # Next.js frontend root (not yet initialized)
```

## Key file responsibilities

- `AGENTS.md` — Single canonical source of truth for all AI tools.
- `fincraft-lab-api/src/workspace/services/workspace-canvas.service.ts` — Owns Canvas Snapshot `getSnapshot` (read-only current master element display metadata join) and `saveSnapshot` (atomic Prisma `$transaction` graph replacement, status/ownership check, element availability check, global ID collision check).
- `fincraft-lab-api/src/workspace/validators/workspace-canvas.validator.ts` — Pure helper owning aggregate 512 KB payload size validation, node/edge collection count limit checks, node valueData structure/limit checks, self-edge checks, dangling node checks, and duplicate directed edge tuple checks.
- `fincraft-lab-api/src/workspace/mappers/workspace-canvas.mapper.ts` — Pure helper owning response construction and element public display object mapping.
- `fincraft-lab-api/src/workspace/services/workspace.service.ts` — Owns Workspace metadata CRUD (`createWorkspace`, `getWorkspaces`, `getWorkspace`, `updateWorkspace`, `deleteWorkspace`).
- `fincraft-lab-api/src/workspace/controllers/workspace.controller.ts` — Thin authenticated HTTP controller exposing `/workspaces` CRUD and `/workspaces/:workspaceId/canvas` GET/PUT.
- `docs/ai/evidence/CANVAS_SNAPSHOT_API_RUNTIME_ACCEPTANCE.md` — Compiled runtime acceptance report verifying 53 live scenarios against NestJS application output.
