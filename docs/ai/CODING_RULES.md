# CODING_RULES.md — Coding and File Maintenance Rules

This document is the full detail behind [`AGENTS.md`](../../AGENTS.md) (which only has a short summary).

## A. No Hardcoding

Never hardcode:

- secrets, API keys, passwords, database credentials;
- environment-specific URLs;
- backend ports repeated across multiple places in the source code;
- frontend API origins repeated across multiple places in the source code;
- machine-specific absolute paths in application code;
- deployment-specific values;
- duplicated financial constants;
- unexplained simulation thresholds;
- repeated UI values that belong in shared configuration.

Use instead, as appropriate:

- environment variables;
- validated configuration;
- constants / enums;
- typed configuration objects;
- database content managed by an Admin;
- simulation definition modules;
- shared design tokens.

**Do not over-interpret this rule** — the following may remain explicit in code when they are stable domain rules:

- enum members;
- HTTP status codes;
- route names;
- fixed role names (`USER`, `ADMIN`, `SUPER_ADMIN`);
- one-off UI labels;
- mathematically defined, fixed formulas;
- test fixture values;
- safe defaults that are documented and not environment-specific.

Do not create a configuration layer purely to avoid every literal value.

## B. File Size Limit

Manually maintained source files must remain at or below **500 physical lines**.

This includes: `.ts`, `.tsx`, `.js`, `.jsx`, and manually maintained Prisma schema files.

At approximately 400 lines:

- inspect whether responsibilities in the file are starting to mix;
- propose a small extraction before the file exceeds 500 lines;
- preserve behavior while splitting.

Exceptions (do not count toward the limit, and do not edit purely to shorten):

- generated Prisma clients;
- lockfiles;
- generated framework files;
- generated migration SQL;
- third-party or vendor files.

Tests should also stay below 500 lines where practical, and should be split by behavior when they become hard to read.

## C. Teacher-Style Backend

Feature-based organization:

```text
src/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── dto/
└── types/
```

Rules:

- Controller receives HTTP input and calls the Service only.
- Controller stays thin.
- Business logic lives in the Service.
- Prisma queries live in the Service.
- Use NestJS dependency injection directly.
- Use DTOs with `class-validator` for request bodies.
- Use NestJS Pipes for path parameters.
- Use built-in NestJS exceptions.
- Use camelCase in Prisma code, and `@map`/`@@map` to translate to snake_case in the database.
- Use UUID as the primary key for every FinCraft table.
- Use `Date` internally, and ISO strings across the JSON response boundary.
- **Do not create a Repository layer.**
- Do not add CQRS, event buses, microservices, or generic domain frameworks without an approved requirement.

FinCraft-specific extensions that are allowed (because they are direct product requirements):

- `USER` / `ADMIN` / `SUPER_ADMIN`;
- minimal Role Guard;
- Craft transaction;
- duplicate recipe protection;
- rediscovery handling;
- simulation calculation service;
- direct tests for critical behavior.

## D. Teacher-Style Frontend

Use the Next.js App Router.

Preferred structure:

```text
src/
├── app/
├── components/
│   ├── features/
│   ├── layout/
│   ├── shared/
│   └── ui/
└── lib/
    ├── api/
    ├── actions/
    ├── schemas/
    └── types/
```

Rules:

- Server Components by default.
- Client Components only for interactive UI.
- Canvas is allowed to be a Client Component.
- Page files focus on routing and composition only.
- Use Server Actions for mutations when appropriate.
- Use Zod + React Hook Form for forms.
- API calls stay in the API layer (`lib/api`) only.
- Never put business logic in page components.
- Never do client-side fetching without a clear interactive reason.

## E. Scope and Learning Rules

- One bounded step at a time.
- One function or endpoint per step.
- Always explain before writing code.
- Always name the files that will be read or changed.
- Never scaffold future features in advance.
- Never modify unrelated code.
- Never perform broad refactors while implementing a feature.
- Stop after the current function.
- Wait for owner review before moving to the next step.

## Related documents

- Stepwise workflow → [`STEPWISE_WORKFLOW.md`](STEPWISE_WORKFLOW.md)
- The skill used to execute this in practice → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
