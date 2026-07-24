# FinCraft Lab — Literal Fakebuck-Aligned Stepwise Development Skill v4

## Purpose

Use this skill when building **FinCraft Lab** with AI agents.

The skill exists to ensure that the project is developed:

- one bounded step at a time;
- in the literal teacher-aligned coding shape modeled after the teacher's Fakebook/Fakebuck projects;
- with explanation before implementation;
- with evidence after implementation;
- without scaffolding entire modules in advance;
- with explicit service boundaries and minimal unnecessary abstractions;
- following the Modern NestJS Structure and Readability Policy.

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

## Modern NestJS Structure and Readability Policy

Full detail lives in [`docs/ai/CODING_RULES.md`](file:///C:/devnest%20101/single-project/fincraft-lab/docs/ai/CODING_RULES.md).

### Feature Folder Structure
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

### File Size Limits
- Module preferred <= 60 lines (hard <= 100)
- Controller preferred <= 150 lines (hard <= 200)
- Service preferred <= 250 lines
- Validator preferred <= 200 lines
- Mapper preferred <= 150 lines
- DTO / Type preferred <= 150 lines
- Review threshold: > 250 physical lines for source files; > 40–60 lines for methods
- Hard limit: every maintained source file must remain below 400 physical lines.

---

## Permanent Skill v4 Rules — Literal Teacher Coding Style

1. **Teacher Reference Code is Primary**: When the owner supplies or refers to teacher-written reference code (Fakebook/Fakebuck), its visible coding shape is the primary style reference.
2. **Simple, Direct Methods over Type Machinery**: Prefer direct, readable methods over advanced reusable type machinery (such as exported Prisma `select` constants, `satisfies Prisma.UserSelect`, or complex derived payload types).
3. **Generated Models & Inline Omit**: Prefer generated Prisma model types (`User`) and inline `omit: { passwordHash: true }` for simple methods.
4. **Internal Input Types**: Define real shared internal service inputs in a small `types/` folder (e.g., `src/user/types/user.type.ts` exporting `UserCreateInput`). Do not call internal inputs DTOs.
5. **Cross-Cutting Concern Services**:
   - `BcryptService` (`src/infrastructure/hash/`) encapsulates password hashing (salt rounds 12) & comparison.
   - `AccessTokenService` (`src/infrastructure/jwt/`) encapsulates JWT signing.
6. **Ordinary CRUD Feature Services**: Feature services for standard CRUD operations (such as `ElementCategoriesService`) continue using `PrismaService` directly.
7. **Prohibited Layers**: Do NOT create custom repository interfaces, persistence adapter layers, generic base services, CQRS, or mapper services unless extracted as a pure helper under a feature folder.
8. **Envelope Convention**:
   - `Service` methods return feature data objects (`UserResponseDto`, `LoginResponseDto`, `User`).
   - `Controller` wraps service results in `{ data: result }`.
   - Explicit return types are required on all public controller and service methods.
9. **Security & Behavior Invariants**: Preserve project-specific security rules, response envelopes (`{ data: ... }`), and domain invariants even when matching the teacher's coding shape.
10. **Public Client Exports Only**: Do not import private/internal generated Prisma paths.

---

## Teacher-Aligned Service Boundary Architecture

```text
AuthController
└── AuthService (Coordinator)
    ├── UserService (src/user/) ──► BcryptService & PrismaService
    ├── BcryptService (src/infrastructure/hash/) ──► bcrypt (12 salt rounds)
    └── AccessTokenService (src/infrastructure/jwt/) ──► JwtService
```

### Folder Structure

```text
src/
├── auth/
│   ├── dto/
│   │   ├── login-response.dto.ts
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── roles.guard.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── user/
│   ├── dto/
│   │   └── user-response.dto.ts
│   ├── types/
│   │   └── user.type.ts
│   ├── user.module.ts
│   └── user.service.ts
└── infrastructure/
    ├── hash/
    │   ├── bcrypt.service.ts
    │   └── hash.module.ts
    └── jwt/
        ├── access-token.service.ts
        └── access-token.module.ts
```

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
