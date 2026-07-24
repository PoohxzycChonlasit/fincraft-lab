# FILE_MAP.md — Repository File Structure

## Backend (`fincraft-lab-api/src`)

```text
src/
├── app.module.ts
├── main.ts
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
│   ├── health.controller.ts
│   └── health.controller.spec.ts
├── infrastructure/
│   ├── config/
│   ├── hash/
│   └── jwt/
├── user/
│   ├── user.module.ts
│   └── user.service.ts
└── workspace/
    ├── workspace.module.ts
    ├── workspace.controller.ts
    ├── workspace.service.ts
    ├── workspace-canvas.service.ts
    ├── workspace-canvas-writer.service.ts
    ├── constants/
    │   └── workspace.constants.ts
    ├── dto/
    │   ├── create-workspace.dto.ts
    │   ├── update-workspace.dto.ts
    │   ├── workspace-node-input.dto.ts
    │   ├── workspace-edge-input.dto.ts
    │   └── save-canvas-snapshot.dto.ts
    ├── mappers/
    │   └── workspace-canvas.mapper.ts
    ├── types/
    │   ├── workspace-response.type.ts
    │   └── canvas-snapshot-response.type.ts
    └── validators/
        └── workspace-canvas.validator.ts
```
