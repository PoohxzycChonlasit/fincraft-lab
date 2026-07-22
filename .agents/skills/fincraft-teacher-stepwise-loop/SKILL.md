# FinCraft Lab — Teacher-Aligned Stepwise Development Skill v2

## Purpose

Use this skill when building **FinCraft Lab** with AI agents.

The skill exists to ensure that the project is developed:

- one bounded step at a time;
- in the teacher-aligned coding style learned from the teacher's Fakebook/Fakebuck projects;
- with explanation before implementation;
- with evidence after implementation;
- without scaffolding entire modules in advance;
- without introducing unnecessary architectural abstractions.

This skill applies to both workspace locations:

```text
C:\devnest 101\single-project\fincraft-lab\fincraft-lab-api
C:\devnest 101\single-project\fincraft-lab\fincraft-lab-web
```

## Source of Truth — read this first

This file describes **only the stepwise execution method** (how to run one loop per function or endpoint) and teacher-aligned coding style guidelines. It is not the canonical rule file.

Before using this skill, read in order:

1. `AGENTS.md` at the project root — canonical rules for every AI tool
2. `docs/ai/CURRENT_STATUS.md` — latest verified state (do not trust memory)
3. `docs/ai/PROJECT_CONTEXT.md` — product context
4. `docs/ai/CODING_RULES.md` — full coding rules (this file summarizes operational rules)

If anything in this file appears to conflict with `AGENTS.md`, `AGENTS.md` takes precedence.

---

## Operating Mode

Default mode:

```text
STEPWISE_LEARNING_LOOP
```

Each loop may implement only one of the following:

- one function;
- one endpoint;
- one validation rule;
- one database relation;
- one UI interaction;
- one direct test or verification script for the current step.

Do not implement an entire feature module in one loop unless the owner explicitly requests it.

---

## Current Project Baseline

The repository is fully initialized with NestJS, PostgreSQL, Prisma (15-model MVP schema migrated), and a completed Backend Auth MVP at commit `cd910c6`:

- `POST /auth/register` (email normalization, bcrypt password hash, ConflictException mapping)
- `POST /auth/login` (JWT access token issuance, generic 401 Unauthorized)
- Global `AuthGuard` (`APP_GUARD`) with `@Public()` decorator bypass
- `GET /auth/me` with `@CurrentUser()` parameter decorator and database status recheck
- Typed `@Roles()` decorator (`USER`, `ADMIN`, `SUPER_ADMIN`) and global `RolesGuard` (`APP_GUARD`)

The current next step is:

```text
P5_SEED_1_PLAN_CORE_CONTENT_001 — Plan core seed infrastructure and Submission Seed v1 content set (Plan-only task).
```

---

## Teacher-Aligned Coding Style Guidelines

Future code must match the owner's teacher-led Fakebook/Fakebuck coding style while remaining specific to FinCraft Lab.

### A. Teacher-Aligned Controller Style

Controllers must:

- remain thin (normally 3–12 lines per method);
- use descriptive DTO parameter names;
- have explicit public return types;
- preserve the FinCraft `{ data: ... }` response envelope;
- receive validated DTOs or parsed parameters from NestJS Pipes;
- call exactly one relevant service method and return its result;
- contain no Prisma queries;
- contain no bcrypt or JWT logic;
- contain no business logic;
- avoid unnecessary try/catch blocks.

Conceptual Example:

```ts
@Get()
async findAll(): Promise<{ data: ElementCategoryResponse[] }> {
  const categories = await this.elementCategoriesService.findAll();
  return { data: categories };
}
```

### B. Teacher-Aligned Service Style

Services must:

- use simple, top-to-bottom linear execution flows;
- use `PrismaService` directly via NestJS Dependency Injection;
- keep one public service method per use case (normally 5–35 lines; explain or split if over 40 lines);
- use early exceptions (guard clauses) rather than deep nesting;
- use explicit safe Prisma `select` clauses where needed;
- use named constants for meaningful financial or simulation thresholds;
- create private helper methods only for repeated, security-sensitive, or difficult-to-read logic;
- avoid repository layers;
- avoid use-case classes;
- avoid command buses, CQRS, and generic base service classes;
- avoid splitting code only to make a file look shorter.

File Size Limits:

- Target maintained source file length: below 300 lines.
- Hard limit for manually maintained files: 500 physical lines (start considering extraction at ~400 lines).
- Generated Prisma files, lockfiles, framework files, and migration SQL are exempt.

### C. DTO and Response Style

Request DTOs:

- belong in `dto/`;
- use `class-validator` and `class-transformer` decorators;
- normalize values only when required (e.g., trim and lowercase emails, trim display names);
- never trim passwords;
- never accept server-controlled fields (`id`, `role`, `status`, `createdAt`, `updatedAt`).

Public Endpoints and Responses:

- use explicit TypeScript response types/contracts (placed in `types/` when shared);
- avoid creating unnecessary DTO files for trivial return shapes;
- preserve the FinCraft `{ data: ... }` response envelope;
- never return sensitive fields (e.g., `passwordHash`);
- `Date` objects are used internally, and standard ISO strings cross the JSON wire boundary.

### D. TypeScript Policy

Strict TypeScript remains mandatory across the entire codebase.

Forbidden:

- `any` or `as any`;
- `as unknown as T` used to silence type errors;
- `@ts-ignore`;
- undocumented `@ts-expect-error`;
- unsafe non-null assertions (`!`) on untrusted data;
- custom string enums duplicating generated Prisma enums.

Required:

- explicit public return types for controller and service methods;
- generated Prisma enums (`UserRole`, `UserStatus`, `ElementType`, etc.) and types;
- runtime type validation at HTTP, JWT, environment, and file boundaries;
- runtime classes when NestJS decorator metadata (`emitDecoratorMetadata` + `isolatedModules`) requires a runtime value.

### E. Security Complexity Exception

Security, data-integrity, and core infrastructure files may remain more verbose when required for safety:

- JWT configuration and signing;
- `AuthGuard` token verification and claim checks;
- `RolesGuard` metadata and permission evaluation;
- Password hashing and verification;
- Prisma unique error mapping (`P2002`);
- Seed validation and hash verification;
- Transaction safety in Craft and Simulation operations.

Do not delete necessary security or integrity checks merely to make code visually shorter.

### F. Abstraction Policy

Do NOT introduce abstractions merely because Fakebuck or another project has them:

- `BcryptService` or `HashModule`
- `AccessTokenService`
- Custom JWT wrapper infrastructure
- Repository interfaces or pattern classes
- Generic base controllers or base services
- Global `@types` Express augmentation
- CQRS, event buses, microservices

Create an abstraction ONLY when:

1. real behavior is reused across multiple feature modules;
2. readability limits (500 physical lines) are exceeded;
3. it isolates a volatile third-party integration;
4. the owner explicitly approves it.

Do not refactor completed Auth code (`POST /auth/register`, `POST /auth/login`, `AuthGuard`, `RolesGuard`, `GET /auth/me`) merely to resemble Fakebuck. Apply the new style to future code and perform targeted cleanup only when a touched file genuinely needs it.

### G. Frontend Style

When frontend development begins (`fincraft-lab-web`):

- Next.js App Router;
- Server Components by default;
- Client Components only for interactive UI (e.g., Canvas, forms);
- Page files compose layout sections; feature logic lives outside page files;
- Native `fetch` through a small API helper;
- Zod and React Hook Form for form handling;
- Explicit loading, empty, success, and error states;
- No global state library until proven necessary;
- Functional submission UI before implementing advanced animations.

### H. Seed Infrastructure & Content Style

Expected directory structure:

```text
prisma/
├── seed.ts
└── seed/
    ├── content/
    ├── steps/
    ├── seed-manifest.ts
    ├── seed-utils.ts
    └── verify-seed.ts
```

Rules:

- `seed.ts` is a small entry-point runner;
- Content is split cleanly by financial domain;
- Validate foreign key references before writing;
- Use stable, predictable slugs;
- Use canonical recipe hashes for Craft combinations;
- Perform idempotent upserts (`upsert` / `findUnique` + `create`);
- Use Prisma transactions for related records;
- Do not seed core user activity records;
- Optional local-only demo profile;
- Never commit passwords or credentials to Git;
- Document explicit sources, assumptions, safety labels, and limitations;
- Include no misleading financial claims (**Education Only, Simulation Only**).

---

## NestJS Generator Policy — No Automatic Unit Specs

- Run every `nest g ...` generator with `--no-spec`.
- Do not hand-create a `*.spec.ts` file unless the owner explicitly requests a unit test in that step.
- Never delete existing spec files or e2e test files.
- Verification is accomplished through `prisma validate`, `pnpm build`, `pnpm lint`, direct runtime verification scripts, database checks, and existing E2E tests.
- Temporary verification scripts must be deleted before committing.

---

## Stepwise Learning Loop

Every implementation step must follow this exact loop:

### 1. Observe

Before changing files:

- confirm the repository path and working directory;
- inspect git status (`git status --short`, `git log -1 --oneline`);
- inspect only files relevant to the current step;
- if unexpected uncommitted changes exist, stop and report — do not overwrite.

### 2. Explain

Before writing code, explain in Thai:

- objective;
- why the step matters;
- scope;
- out-of-scope;
- files to create or modify;
- request flow;
- expected success case & error cases;
- risks.

### 3. Implement

Implement only the current bounded step:

- create/modify only files required for this step;
- do not scaffold future feature modules;
- do not install unrelated packages;
- do not refactor completed code unless touched and approved;
- use `--no-spec` on Nest CLI generators.

### 4. Verify

Perform static and runtime verification:

- `prisma validate`
- `pnpm build`
- `pnpm lint`
- `pnpm test` & `pnpm test:e2e`
- Search changed files for unsafe type casts (`any`, `as any`, `as unknown`, `@ts-ignore`)
- Run a temporary untracked verification script for live runtime testing
- Clean up test data and remove temporary verification scripts before committing.

### 5. Teach Back

Explain to the owner in Thai:

- what files were touched and created;
- how the logic flows top-to-bottom;
- how it connects to existing modules;
- key design decisions.

### 6. Checkpoint

Create one local Git commit:

- stage only authorized tracked files;
- use a descriptive commit message (`feat: ...`, `fix: ...`, `docs: ...`);
- do not push to remote unless explicitly instructed.

### 7. Stop

Recommend exactly one next bounded step, then stop and wait for owner approval. Never continue automatically.

---

## Project Execution Sequence

```text
Backend Auth MVP Complete (Commit cd910c6)
  │
  ▼
P5_SEED_1_PLAN_CORE_CONTENT_001 (Current Next Step — Plan-only task)
  │
  ▼
Implement Seed Infrastructure
  │
  ▼
Seed Core Content Set
  │
  ▼
ElementCategory & Element Read APIs
  │
  ▼
Admin CRUD Endpoints
  │
  ▼
Craft Recipe & Discovery Engines (POST /craft)
  │
  ▼
User Discoveries & Knowledge Graph
  │
  ▼
Basic Simulation Engine & Runs
  │
  ▼
Frontend App Router Submission Flow
  │
  ▼
Final Presentation & Verification
```
