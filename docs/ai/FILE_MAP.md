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
│   ├── SWAGGER_OPENAPI_RUNTIME_ACCEPTANCE.md
│   └── SURVIVAL_MONTHS_SIMULATION_RUNTIME_ACCEPTANCE.md
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
│   └── types/
├── health/
│   ├── health.module.ts
│   └── health.controller.ts
├── infrastructure/
│   ├── config/
│   ├── hash/
│   └── jwt/
├── simulation/
│   ├── simulation.module.ts
│   ├── simulation.controller.ts
│   ├── simulation.service.ts
│   ├── simulation-calculator.service.ts
│   ├── constants/
│   │   └── survival-months.definition.ts
│   ├── dto/
│   │   ├── survival-months-run-request.dto.ts
│   │   └── simulation-response.dto.ts
│   └── openapi/
│       └── simulation-openapi.decorators.ts
├── user/
│   ├── user.module.ts
│   ├── user.service.ts
│   └── dto/
└── workspace/
    ├── workspace.module.ts
    ├── workspace.controller.ts
    ├── workspace.service.ts
    ├── workspace-canvas.service.ts
    ├── workspace-canvas-writer.service.ts
    ├── openapi/
    ├── constants/
    ├── dto/
    ├── mappers/
    ├── types/
    └── validators/
```

## Seed (`fincraft-lab-api/prisma/seed`)

```text
prisma/
├── schema.prisma
├── seed.ts
└── seed/
    ├── content/
    │   └── simulations.ts
    └── steps/
        └── seed-simulations.ts
```
