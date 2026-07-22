# FinCraft Lab — Fakebuck-Aligned Stepwise Development Skill v3

## Purpose

Use this skill when building **FinCraft Lab** with AI agents.

The skill exists to ensure that the project is developed:

- one bounded step at a time;
- in the teacher-aligned coding shape modeled after the teacher's Fakebook/Fakebuck projects;
- with explanation before implementation;
- with evidence after implementation;
- without scaffolding entire modules in advance;
- with explicit service boundaries and minimal unnecessary abstractions.

This skill applies to both workspace locations:

```text
C:\devnest 101\single-project\fincraft-lab\fincraft-lab-api
C:\devnest 101\single-project\fincraft-lab\fincraft-lab-web
```

## Source of Truth — read this first

This file describes **only the stepwise execution method** (how to run one loop per function or endpoint) and teacher-aligned coding guidelines. It is not the canonical rule file.

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

- one function or service method;
- one endpoint;
- one validation rule or DTO;
- one database relation;
- one UI interaction;
- one direct test or verification script for the current step.

Do not implement an entire feature module in one loop unless the owner explicitly requests it.

---

## Current Project Baseline

The repository is fully initialized with NestJS, PostgreSQL, Prisma (15-model MVP schema migrated), Backend Auth MVP complete, and Core Seed Infrastructure (8 Element Categories seeded) at commit `d807255`.

### Superceded Rules Notice

Skill v3 explicitly supersedes the following previous rules:
- *Old rule superceded*: "AuthService must directly handle PrismaService, bcrypt, and JwtService in a single file."
- *Old rule superceded*: "Do not add BcryptService, HashModule, or AccessTokenService under any circumstances."
- *Old rule superceded*: "Completed Auth must not be refactored to resemble Fakebuck."

Skill v3 approves and mandates the teacher's Fakebuck service-boundary architecture for Authentication.

---

## Teacher-Aligned Service Boundary Architecture

### A. Auth Feature Service Boundaries

Authentication combines user persistence, password cryptography, and access token issuance. To mirror the owner's Fakebuck project, Auth logic is structured into dedicated, single-responsibility services:

```text
AuthController
└── AuthService (Coordinator)
    ├── UserService (src/user/)
    ├── BcryptService (src/infrastructure/hash/)
    └── AccessTokenService (src/infrastructure/jwt/)
```

1. **`AuthService` (Coordinator)**:
   - Coordinates `register`, `login`, and `getCurrentUser` flows.
   - Evaluates credential validity, user active status, and composes feature responses.
   - **Does NOT directly import**: `PrismaService`, Prisma error classes, `bcrypt`, `JwtService`, or `ConfigService`.

2. **`UserService` (`src/user/user.service.ts`)**:
   - Owns user creation, user queries by ID or email via `PrismaService`, safe Prisma `select` clauses, and Prisma `P2002` duplicate email conflict mapping.
   - Exposes clean methods: `createUser()`, `getUserByEmail()`, `getUserById()`.
   - **Does NOT import**: `bcrypt`, `JwtService`, or `ConfigService`.

3. **`BcryptService` (`src/infrastructure/hash/bcrypt.service.ts`)**:
   - Encapsulates password cryptography using `bcrypt` (12 salt rounds).
   - Exposes: `hash(plain: string): Promise<string>` and `compare(plain: string, hashed: string): Promise<boolean>`.
   - Directly injected into `AuthService`.

4. **`AccessTokenService` (`src/infrastructure/jwt/access-token.service.ts`)**:
   - Encapsulates JWT access token signing (`signToken(payload)`).
   - Injected into `AuthService`. `AccessTokenModule` manages `JwtModule.registerAsync` and exports `JwtModule`/`JwtService` for both `AccessTokenService` and `AuthGuard`.

### B. Ordinary Feature Services (CRUD)

- Features that are standard CRUD operations (such as `ElementCategoriesService`, `ElementsService`) continue to use `PrismaService` directly inside their respective feature services.
- **Do NOT create custom repository interfaces, persistence adapter layers, or generic base controllers** for ordinary CRUD modules.

### C. Envelope Convention & DTOs

- **Envelope Convention**:
  - `Service` methods return raw feature objects or DTO instances.
  - `Controller` wraps service results in the FinCraft `{ data: result }` envelope.
  - Explicit return types are required on all public controller and service methods.
- **DTO Structure**:
  - `src/auth/dto/`: `register.dto.ts`, `login.dto.ts`, `login-response.dto.ts`.
  - `src/user/dto/`: `user-response.dto.ts`.
  - Register and `GET /auth/me` endpoints reuse `UserResponseDto`.
  - `passwordHash` is never exposed in response DTOs or wire responses.

---

## TypeScript & Code Quality Rules

Strict TypeScript is mandatory across all files:

Forbidden:
- `any` or `as any`
- `as unknown as T` used to silence type errors
- `@ts-ignore`
- undocumented `@ts-expect-error`
- unsafe non-null assertions (`!`) on untrusted data
- duplicate string enums replacing generated Prisma enums

Required:
- explicit return types on public controller and service methods;
- generated Prisma enums (`UserRole`, `UserStatus`, etc.);
- runtime validation at HTTP, JWT, environment, and file boundaries;
- runtime classes when NestJS decorator metadata (`emitDecoratorMetadata` + `isolatedModules`) requires a runtime constructor.

---

## NestJS Generator Policy — No Automatic Unit Specs

- Run every `nest g ...` generator with `--no-spec`.
- Do not hand-create a `*.spec.ts` file unless the owner explicitly requests a unit test in that step.
- Never delete existing spec files or e2e test files.
- Verification is accomplished through `prisma validate`, `pnpm build`, `pnpm lint`, direct runtime verification scripts, database checks, and existing E2E tests.

---

## Stepwise Learning Loop

Every implementation step must follow this exact loop:

1. **Observe**: Confirm working directory and git status (`git status --short`, `git log -1 --oneline`). Inspect relevant files only.
2. **Explain**: Explain in Thai (objective, scope, out-of-scope, files to touch, request flow, success/error cases, risks).
3. **Implement**: Implement only the current bounded step. Use `--no-spec` on Nest CLI generators.
4. **Verify**: Perform static checks (`build`, `lint`, `test`, `test:e2e`) and live runtime verification scripts. Clean up temporary scripts before committing.
5. **Teach Back**: Explain the changes and code flow to the owner in Thai.
6. **Checkpoint**: Create one local Git commit (`git commit -m "..."`). Do not push unless instructed.
7. **Stop**: Recommend exactly one next bounded step, then stop and wait for owner approval.

---

## Project Execution Sequence

```text
Backend Auth MVP & Seed Categories Complete (Commit d807255)
  │
  ▼
P4_AUTH_6_ALIGN_SKILL_AND_PLAN_FAKEBUCK_REFACTOR_001 (Current Documentation & Plan Step)
  │
  ▼
P4_AUTH_7_IMPLEMENT_USER_SERVICE_EXTRACTION_001 (Phase A: UserModule & UserService)
  │
  ▼
P4_AUTH_8_IMPLEMENT_HASH_AND_JWT_INFRASTRUCTURE_001 (Phase B: HashModule & AccessTokenModule)
  │
  ▼
P4_AUTH_9_REFACTOR_AUTH_SERVICE_AND_DTOS_001 (Phase C & D: AuthService refactor, DTOs & Verification)
  │
  ▼
P5_SEED_3_IMPLEMENT_ELEMENTS_AND_DETAILS_001 (Resume Content Seeding)
```
