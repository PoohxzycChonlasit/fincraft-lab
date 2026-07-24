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

## B. File Size Limit & Modern NestJS Policy

Every maintained source file must remain below **400 physical lines**.

Preferred limits by file category:
- `module`: <= 60 lines (hard <= 100 lines)
- `controller`: <= 150 lines (hard <= 200 lines)
- `service`: <= 250 lines
- `validator`: <= 200 lines
- `mapper`: <= 150 lines
- `DTO / type`: <= 150 lines

Review thresholds:
- Any maintained source file above 250 physical lines.
- Any method above 40–60 lines.

A service between 250–399 lines must be explicitly reviewed for responsibility separation (e.g. extracting validators, mappers, or policies). Passing the 400-line hard ceiling does not mean a file fully complies with preferred targets. Do not game line limits through compressed formatting or multi-statement lines.

Exceptions (do not count toward the limit, and do not edit purely to shorten):
- generated Prisma clients;
- lockfiles;
- generated framework files;
- generated migration SQL;
- third-party or vendor files.

Tests should also stay below 400 lines where practical, and should be split by behavior when they become hard to read.

## C. Modern NestJS Structure and Readability Policy

### Primary Goal
- The codebase must remain readable by a student learning the project.
- Prefer small, cohesive, feature-local files over monolithic NestJS modules, controllers, or services.
- Optimize for clear responsibility, discoverability, and predictable folder structure.

### Feature Folder Structure
For a non-trivial NestJS feature, use:
```text
src/<feature>/
  <feature>.module.ts (at feature root)
  controllers/
  services/
  dto/
  validators/
  mappers/
  policies/
  constants/
  types/
```
Rules:
- Feature module remains at feature root.
- Create only folders actually used; do not create empty folders.
- Do not use broad generic folders such as `utils/`, `helpers/`, `shared/` unless genuinely reused across multiple features.
- Do not use `index.ts` barrel files that obscure the implementation location.

### Responsibility Rules
- **Controllers**: Receive HTTP input, use pipes/decorators, call feature services, return public response envelope (`{ data: result }`). Must not contain Prisma queries, transaction logic, business validation, manual JWT parsing, or database model mapping.
- **Services**: Orchestrate access checks, database operations, transactions, and feature workflows.
- **Pure Helpers**: Extract pure domain/payload validation to `validators/`, database response mapping to `mappers/`, authorization rules to `policies/`, domain constants to `constants/`, contracts to `types/`. Pure validators and mappers must normally be plain functions, not dependency-injected providers.

### Modern TypeScript & NestJS Practices
- Use: strict TypeScript, constructor injection, private readonly dependencies, type-only imports, explicit public response types, class-validator DTOs, named domain constants, explicit Prisma select, composition over inheritance, async/await, small domain-specific functions.
- Do not use: `any`, `as any`, `as unknown`, `@ts-ignore`, `@ts-expect-error`, `BaseService` or `BaseController` abstractions, generic repositories without demonstrated reuse, unnecessary CQRS/event buses, raw Prisma models as HTTP responses, generic `utils.ts` or `helpers.ts` dumping grounds, `index.ts` barrel files, `forwardRef` to conceal poor boundaries, or one-method-per-file mechanical splitting.

## D. Teacher-Style Backend

Feature-based organization following the Modern NestJS Structure:

```text
src/<feature>/
├── <feature>.module.ts
├── controllers/
│   └── <feature>.controller.ts
├── services/
│   └── <feature>.service.ts
├── dto/
└── types/
```

Rules:
- Controller receives HTTP input, delegates to the Service layer, and wraps results in `{ data: result }`.
- Controller stays thin.
- Business logic lives in the Service layer.
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
- minimal Role Guard (`RolesGuard`);
- Craft transaction;
- duplicate recipe protection;
- rediscovery handling;
- simulation calculation service;
- direct tests for critical behavior.

## E. Teacher-Style Frontend

Use the Next.js App Router.

Preferred structure:

```text
src/
├── app/
├── components/
│   ├── features/
│   ├── layout/
│   └── shared/
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

## F. Scope and Learning Rules

- One bounded step at a time.
- One function or endpoint per step.
- Always explain before writing code.
- Always name the files that will be read or changed.
- Never scaffold future features in advance.
- Never modify unrelated code.
- Never perform broad refactors while implementing a feature.
- Stop after the current function.
- Wait for owner review before moving to the next step.

## G. NestJS No-Spec Policy

The owner has decided that unit spec files are no longer generated automatically. This is a scope decision, not a reduction in verification.

1. **Do not automatically generate unit spec files.**
2. Every NestJS generator that can create a test file must be run with `--no-spec`:

   ```text
   nest g controller element-category --no-spec
   nest g service element-category --no-spec
   nest g resource element-category --no-spec
   ```

3. A module generator normally does not create a spec file already — do not add an artificial one.
4. Do not manually create `*.controller.spec.ts`, `*.service.spec.ts`, `*.provider.spec.ts`, or `*.resolver.spec.ts` unless the owner explicitly requests a unit test for that bounded task.
5. Never delete an existing test merely because automatic spec generation is now disabled.
6. Existing E2E verification (e.g. `test/app.e2e-spec.ts`) may remain, and may be updated when a feature directly requires it.
7. When a step produces no new unit spec, verify with the smallest relevant evidence instead:
   - build;
   - lint;
   - Prisma format/validate/generate (when relevant);
   - runtime HTTP verification;
   - database connection verification (when relevant);
   - existing E2E tests;
   - diff inspection.
8. **This rule disables automatic unit-spec generation only — it never means "no verification is needed."** Never claim a step is done without real evidence.

## H. Non-Mutating Lint Policy

1. `pnpm lint` is a **non-mutating verification gate** (runs `eslint "{src,apps,libs,test}/**/*.ts"` without `--fix`).
2. `pnpm lint:fix` is the explicit, opt-in source-changing command (runs `eslint "{src,apps,libs,test}/**/*.ts" --fix`).
3. Read-only audits and automated hard-gate checks must run `pnpm lint`, never `pnpm lint:fix`.
4. Hard-gate verification runs must finish with zero unexpected tracked changes in the worktree.

## Related documents

- Stepwise workflow → [`STEPWISE_WORKFLOW.md`](STEPWISE_WORKFLOW.md)
- The skill used to execute this in practice → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
