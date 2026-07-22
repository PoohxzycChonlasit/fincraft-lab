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

Target length for maintained source files: **below 300 lines**.

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

## D. Teacher-Style Frontend

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

## F. NestJS No-Spec Policy

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

## G. Literal Teacher-Aligned Readability & Service Boundaries

To ensure code matches the owner's teacher-led Fakebook/Fakebuck learning style, code must follow literal teacher-aligned service boundaries:

1. **Auth Service Boundaries**:
   - `AuthService` coordinates register, login, and current-user flows. It does not directly handle database access, bcrypt hashing, or JWT signing.
   - `UserService` (`src/user/user.service.ts`) owns user database persistence, hashes passwords on create via `BcryptService`, and maps Prisma `P2002` duplicate email errors.
   - `BcryptService` (`src/infrastructure/hash/bcrypt.service.ts`) owns password hashing (salt rounds 12) and comparison.
   - `AccessTokenService` (`src/infrastructure/jwt/access-token.service.ts`) owns JWT token signing.
2. **Simple, Direct Methods over Type Machinery**:
   - Prefer direct, readable methods over advanced reusable type machinery (such as exported Prisma `select` constants, `satisfies Prisma.UserSelect`, or complex derived payload types).
   - Use generated Prisma model types (`User`) and inline `omit: { passwordHash: true }`.
3. **Ordinary Feature Services (CRUD)**:
   - Feature services for standard CRUD operations (such as `ElementCategoriesService`) continue using `PrismaService` directly.
   - Do NOT create repository layers, persistence adapter interfaces, or generic base services for normal CRUD features.
4. **Thin Controllers**: Controllers validate HTTP inputs, delegate to the service layer, and wrap results in `{ data: result }`. Methods are typically 3–12 lines long.
5. **Explicit Return Types**: All public controller methods and public service methods must declare explicit return types (e.g., `UserResponseDto`, `LoginResponseDto`).
6. **Minimal Abstraction**: Create helper abstractions only when real logic is reused, file line limits (500 physical lines) are approached, or third-party APIs are isolated.
7. **Security Complexity Exception**: Files handling security, cryptography, JWT signing, guard evaluation, Prisma unique error mapping (`P2002`), seed validation, and transaction safety may remain more detailed when required for safety. Necessary safety checks must never be deleted to shorten code.
8. **No Copying Another Repository File-for-File**: Do not copy teacher code blindly. Preserve FinCraft-specific models, routes, financial safety rules, response envelopes (`{ data: ... }`), and Craft/Simulation behaviors.

## Related documents

- Stepwise workflow → [`STEPWISE_WORKFLOW.md`](STEPWISE_WORKFLOW.md)
- The skill used to execute this in practice → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
