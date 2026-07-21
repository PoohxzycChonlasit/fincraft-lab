# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (checked during P0.5 — TASK_ID: P0_5_SHARED_AI_AGENT_FOUNDATION_001, updated during P0_5_ENGLISH_AGENT_DOCUMENTATION_CORRECTION_001)

- **Git root**: `C:/devnest 101/single-project/fincraft-lab` (no nested git repositories inside `fincraft-lab-api` or `fincraft-lab-web`)
- **P0 starting checkpoint**: `34117a1` — "P0: scaffold NestJS backend foundation in fincraft-lab-api"
- **Shared agent documentation checkpoint**: `8b2bb9a` — "docs(ai): add shared agent workflow and coding rules"
- **Worktree before this English-correction task**: clean

### Backend (`fincraft-lab-api`)

- `package.json` verified directly: `"packageManager": "pnpm@11.15.1"`
- `dependencies`: only `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs`
- **Prisma is not installed** (confirmed by reading the file directly)
- `src/` contains only the 5 generated baseline files: `main.ts`, `app.module.ts`, `app.controller.ts`, `app.service.ts`, `app.controller.spec.ts`
- **`GET /health` does not exist** (confirmed by reading `src/` directly — no module or route beyond the root `AppController`)
- **No feature folders exist yet**
- **PostgreSQL is not configured**

### Frontend (`fincraft-lab-web`)

- Verified directly with `ls`: **empty**, not yet initialized

### AI documentation

- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `docs/ai/*`, and `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md` exist and are committed at `8b2bb9a`.
- All AI documentation is standardized in English as of this task.

## Build/Lint/Test — run status

Results for `pnpm build`, `pnpm lint`, `pnpm test`, and a real app boot (`GET /` → `200 Hello World!`) were **reported during the P0 task** (all passed; lint had 1 pre-existing warning from the generated template, not an error).

**The P0.5 documentation tasks are docs-only — these commands were not rerun.** The results above are "reported, not rerun" and must be re-verified before being used as evidence in a step that touches the backend directly.

## Next Bounded Step

```text
P1 — Implement GET /health as one bounded teacher-style backend function.
```

Do not skip this step to work on Prisma, authentication, or any other feature folder first.

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Full project step sequence → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md` (Initial Project Sequence section)
