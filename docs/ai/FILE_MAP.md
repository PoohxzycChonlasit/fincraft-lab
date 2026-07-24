# FILE_MAP.md — Repository File Structure

## Documentation & Plans (`docs/ai`)

```text
docs/ai/
├── AGENTS.md (in root)
├── GEMINI.md (in root)
├── CODING_RULES.md
├── CURRENT_STATUS.md
├── FILE_MAP.md
├── PROJECT_CONTEXT.md
├── STEPWISE_WORKFLOW.md
├── evidence/
│   └── SWAGGER_OPENAPI_RUNTIME_ACCEPTANCE.md
└── plans/
    └── SURVIVAL_MONTHS_SIMULATION_API_CONTRACT.md
```

## Backend (`fincraft-lab-api/src`)

```text
src/
├── app.module.ts
├── main.ts
├── openapi/
│   └── setup-swagger.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── decorators/
│   ├── dto/
│   │   ├── register.dto.ts
│   │   ├── login.dto.ts
│   │   └── login-response.dto.ts
│   ├── guards/
│   └── types/
├── common/
│   ├── constants/
│   └── craft/
├── craft/
│   ├── craft.module.ts
│   ├── craft.controller.ts
│   ├── craft.service.ts
│   ├── dto/
│   │   ├── craft-request.dto.ts
│   │   └── craft-response.dto.ts
│   ├── helpers/
│   ├── mappers/
│   ├── parsers/
│   └── types/
├── database/
│   ├── database.module.ts
│   ├── prisma.service.ts
│   └── generated/
├── element/
│   ├── element.module.ts
│   ├── element.controller.ts
│   ├── element.service.ts
│   ├── dto/
│   │   └── available-element-response.dto.ts
│   └── types/
├── health/
│   ├── health.module.ts
│   └── health.controller.ts
├── infrastructure/
│   ├── config/
│   ├── hash/
│   └── jwt/
├── user/
│   ├── user.module.ts
│   ├── user.service.ts
│   └── dto/
│       └── user-response.dto.ts
└── workspace/
    ├── workspace.module.ts
    ├── workspace.controller.ts
    ├── workspace.service.ts
    ├── workspace-canvas.service.ts
    ├── workspace-canvas-writer.service.ts
    ├── openapi/
    │   └── workspace-openapi.decorators.ts
    ├── constants/
    │   └── workspace.constants.ts
    ├── dto/
    │   ├── create-workspace.dto.ts
    │   ├── update-workspace.dto.ts
    │   ├── workspace-node-input.dto.ts
    │   ├── workspace-edge-input.dto.ts
    │   ├── save-canvas-snapshot.dto.ts
    │   ├── workspace-response.dto.ts
    │   └── canvas-snapshot-response.dto.ts
    ├── mappers/
    │   └── workspace-canvas.mapper.ts
    ├── types/
    │   ├── workspace-response.type.ts
    │   └── canvas-snapshot-response.type.ts
    └── validators/
        └── workspace-canvas.validator.ts
```
