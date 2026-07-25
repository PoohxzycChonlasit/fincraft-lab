# GEMINI.md — Gemini Adapter for FinCraft Lab

This file is a **thin adapter** for Gemini only. It is not a source of rules.

## Before starting any task

1. Read [`AGENTS.md`](AGENTS.md) in full first — it is the true canonical rule file.
2. Read [`docs/ai/CURRENT_STATUS.md`](docs/ai/CURRENT_STATUS.md) for the latest verified status.
3. Follow the skill: [FinCraft Lab — Literal Fakebuck-Aligned Stepwise Development Skill v4](.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md)
   (and for all frontend tasks, also follow [FinCraft Lab Frontend Engineering Skill](.agents/skills/fincraft-frontend-engineering/SKILL.md)).

## Gemini-specific operational directives

- **Model Guidance**: Use Gemini Flash with **Standard or Medium thinking only**. Never use High thinking by default unless explicitly instructed by the owner.
- **Bounded Focus**: Perform exactly one bounded task per step. Do not scaffold future modules or refactor unrelated files.
- **Literal Fakebuck Auth Service Boundaries**: Follow the approved Auth architecture (`AuthController` -> `AuthService` -> `UserService`, `BcryptService`, `AccessTokenService`). `UserService` hashes passwords on create via `BcryptService`. `AuthService` compares passwords on login via `BcryptService`.
- **Simple, Direct Coding Style**: Prefer direct methods over advanced select constants or derived payload types. Use generated Prisma model types (`User`) and inline `omit: { passwordHash: true }`.
- **Ordinary Features**: Ordinary CRUD features (e.g. `ElementCategoriesService`) continue using `PrismaService` directly.
- **Explicit Return Contracts**: Use explicit DTO/class return types on public controller and service methods. Controller wraps responses in `{ data: result }`.
- **Strict TypeScript**: Preserve strict mode. Never introduce `any`, `as any`, `as unknown as T` to silence errors, `@ts-ignore`, or undocumented `@ts-expect-error`.
- **Targeted Reading**: Read only the files needed for the current step; do not scan the whole repository without a concrete reason.
- **Safety & Verification**: Stop after verification and local commit. Never run destructive commands or push to remote without an explicit instruction from the owner.

## Do not do this in this file

Do not copy rules from `AGENTS.md`, `SKILL.md`, or `docs/ai/*` into this file. To add a rule, edit `AGENTS.md` or `docs/ai/CODING_RULES.md` instead.
