# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (checked during P0.5, updated during P1 and P2A/P2B.1)

- **Git root**: `C:/devnest 101/single-project/fincraft-lab` (no nested git repositories inside `fincraft-lab-api` or `fincraft-lab-web`)
- **P0 starting checkpoint**: `34117a1` — "P0: scaffold NestJS backend foundation in fincraft-lab-api"
- **Shared agent documentation checkpoint**: `8b2bb9a` / `4b403b1` — AI documentation added and standardized to English
- **P1 checkpoint**: `a17d7f4` — "feat: add backend health endpoint"
- **P2A checkpoint**: `22483f9` — "chore: add Prisma PostgreSQL dependencies"
- **P2B.1 checkpoint**: "chore: initialize Prisma project structure" (see git log for the exact SHA)
- **Worktree before the P2B.1 task**: an unrelated, unexpected uncommitted change to `fincraft-lab-api/tsconfig.json` was found and restored to HEAD under explicit owner authorization before P2A began; clean at the start of every task since

### Backend (`fincraft-lab-api`)

- `package.json` verified directly: `"packageManager": "pnpm@11.15.1"` (unchanged since P0)
- **Prisma is installed** (P2A): `@nestjs/config@4.0.4`, `@prisma/client@7.8.0`, `@prisma/adapter-pg@7.8.0`, `pg@8.22.0`, `dotenv@17.4.2` as production dependencies; `prisma@7.8.0`, `@types/pg` as dev dependencies. Existing NestJS package versions were not changed.
- **Prisma project structure is initialized** (P2B.1): `prisma/schema.prisma` (generator + datasource only, no models), `prisma.config.ts` (loads `DATABASE_URL` via `env()` from `prisma/config`, `dotenv/config`), `.env.example` (placeholder only)
- **`prisma format`, `prisma validate`, `prisma generate` all pass.** The generated client exists locally at `fincraft-lab-api/src/generated/prisma/` and is git-ignored (added to the root `.gitignore`, scoped to that exact path only).
- **No database connection has been attempted.** `.env` (git-ignored, local only) holds a placeholder `postgresql://USERNAME:PASSWORD@localhost:5432/fincraft_lab?schema=public` — syntactically valid so Prisma's config/format/validate/generate commands can run, not a real credential.
- **No Prisma model, enum, or migration exists yet.**
- The NestJS application remains CommonJS — `moduleFormat = "cjs"` was used in the Prisma generator block specifically so no ESM conversion, import rewrite, or Jest config change was needed.
- `src/` now contains: `main.ts`, `app.module.ts`, and the `health/` feature folder (`health.module.ts`, `health.controller.ts`, `health.service.ts`, `health.controller.spec.ts`)
- The generated Hello World files (`app.controller.ts`, `app.controller.spec.ts`, `app.service.ts`) were removed after the Health feature's tests passed
- **`GET /health` exists and is verified working** — see below
- **`GET /` now returns 404** (the generated root route was removed along with `AppController`)
- **No other feature folders exist yet**
- **PostgreSQL is not configured**

### GET /health — verified behavior (P1)

- Request flow: `HTTP Request → main.ts → AppModule → HealthModule → HealthController → HealthService → JSON Response`
- Verified directly with a real server boot (tracked PID, not a broad process, per process-safety rules) and `Invoke-WebRequest`:
  - `GET /health` → `200` with body `{"status":"ok","service":"fincraft-lab-api","timestamp":"<ISO-8601>"}`
  - `GET /` → `404`
- Does not access a database (confirmed by reading `health.service.ts` directly — it only builds an object from `new Date().toISOString()`)

### Frontend (`fincraft-lab-web`)

- Verified directly with `ls`: **empty**, not yet initialized

### AI documentation

- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `docs/ai/*`, and `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md` exist and are committed at `8b2bb9a`.
- All AI documentation is standardized in English as of this task.

## Build/Lint/Test — run status

Rerun directly during P2B.1, after Prisma initialization (schema, config, `.env.example`, generated client):

- `pnpm build` — passed
- `pnpm lint` — 0 errors, 1 pre-existing warning in `main.ts` (`@typescript-eslint/no-floating-promises`, unchanged since P0)
- `pnpm test` — 3/3 unit tests passed
- `pnpm test:e2e` — 2/2 e2e tests passed (`GET /health` → 200; `GET /` → 404)
- Health endpoint code was not touched during P2A or P2B.1

## Next Bounded Step

```text
P2B.2 — Configure a real PostgreSQL development connection and create the bounded PrismaService/DatabaseModule integration, without adding all FinCraft models.
```

Do not skip this step to work on authentication or any FinCraft feature folder first.

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Full project step sequence → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md` (Initial Project Sequence section)
