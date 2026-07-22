# AGENTS.md — Canonical Rules for All AI Agents in FinCraft Lab

## What this file is

`AGENTS.md` is the **single canonical source of truth** for every AI agent working on FinCraft Lab — Claude Code, Gemini, ChatGPT, Codex, or any future tool.

Other files such as `CLAUDE.md` and `GEMINI.md` are **thin adapters** that point back to this file. They must not duplicate or contradict the rules defined here.

If any other file conflicts with `AGENTS.md`, `AGENTS.md` always takes precedence.

## How to start a task (for every AI tool)

Before starting any work in this repository, follow this order every time:

1. Read this file (`AGENTS.md`) in full.
2. Read [`docs/ai/CURRENT_STATUS.md`](docs/ai/CURRENT_STATUS.md) for the latest verified state.
3. Read [`docs/ai/PROJECT_CONTEXT.md`](docs/ai/PROJECT_CONTEXT.md) to understand the product.
4. Follow the Stepwise Loop described in `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`.
5. Never trust a remembered status — verify with git and the actual files before relying on any prior state.

## What this project is

Short summary — full detail in [`docs/ai/PROJECT_CONTEXT.md`](docs/ai/PROJECT_CONTEXT.md).

- **FinCraft Lab** is a Financial Literacy Discovery Lab for learning finance by combining Elements, discovering Concepts, and running Simulations.
- This is a learning project (school personal project) — **Education Only, Simulation Only, Not Financial Advice**.
- Backend: NestJS + PostgreSQL + Prisma 7.8 (PostgreSQL connected through PrismaService, approved 15-model MVP schema migrated).
- Frontend: Next.js App Router.
- Package manager: **pnpm only**.

## Coding Rules (summary — full detail in docs/ai/CODING_RULES.md)

Full detail lives in [`docs/ai/CODING_RULES.md`](docs/ai/CODING_RULES.md). This section only summarizes the most important rules:

1. **No hardcoding** of secrets, URLs, ports, credentials, or values that belong in configuration — see CODING_RULES.md for the allowed exceptions.
2. **Manually maintained files must not exceed 500 physical lines.** Start considering a split once a file reaches roughly 400 lines.
3. **Backend is organized by feature** — controllers stay thin, business logic and Prisma queries live in services, no repository layer.
4. **Frontend uses the Next.js App Router** — Server Components by default, Client Components only where interactivity is required.
5. **Work one function or endpoint at a time** — do not scaffold an entire module in a single step unless the owner explicitly requests it.
6. **Every step must be explained before implementation, and verified with real evidence before it is considered done.**
7. **No automatic unit spec generation.** Every NestJS generator that can create a `*.spec.ts` file must be run with `--no-spec`, and no `*.spec.ts` file should be hand-created unless the owner explicitly asks for a unit test in that step. This does not reduce verification — see [`docs/ai/CODING_RULES.md`](docs/ai/CODING_RULES.md) for the full policy and required evidence instead.

## Stepwise Workflow (summary — full detail in docs/ai/STEPWISE_WORKFLOW.md and SKILL.md)

Every development step must follow this loop:

```text
Observe → Explain → Implement → Verify → Teach Back → Checkpoint → Stop
```

- **Observe** — inspect the repository and git state before starting.
- **Explain** — describe the objective, scope, out-of-scope, files to touch, and risks before writing code.
- **Implement** — do only the one bounded step; no unrelated refactors or future scaffolding.
- **Verify** — require real evidence (build, test, curl, diff); never claim success without it.
- **Teach Back** — explain the changed files and how they connect, for the owner's learning.
- **Checkpoint** — create a single local commit only once authorized and verified; never push without an explicit instruction.
- **Stop** — recommend exactly one next bounded step, then stop and wait for approval. Never continue automatically.

The detailed operational method for working one function at a time lives in:
`.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`

## Hard Safety Rules (always apply, regardless of the task)

- Never modify `C:\devnest 101\workshop-01\fakebook` or any teacher repository.
- Never create a nested Git repository inside `fincraft-lab-api` or `fincraft-lab-web` — Git exists only at the single root `fincraft-lab/.git`.
- Never push to a remote without an explicit instruction from the owner.
- Never delete owner files without authorization.
- Never run destructive commands (e.g. database reset, force push, hard-deleting master data) without explicit authorization.
- Never commit secrets or credentials.
- Never build a large AI governance system (no manifest system, no receipt system, no multi-layer state machine, no autonomous multi-hour loop, no agent hierarchy).

## Talking to the owner

This file, its adapters, and `docs/ai/*` must be written in English. The owner may communicate in Thai. Respond in Thai when teaching or explaining directly to the owner, unless the current task explicitly requests English.

## Current status

The latest verified status lives in [`docs/ai/CURRENT_STATUS.md`](docs/ai/CURRENT_STATUS.md) — **never trust a remembered status; check this file or the actual git state before starting any task.**

## File map

The current file structure is listed in [`docs/ai/FILE_MAP.md`](docs/ai/FILE_MAP.md).

## Why this structure exists

This project will be developed by multiple AI tools (Claude, Gemini, ChatGPT, Codex). Without one canonical source of rules, each tool could interpret instructions differently, create oversized files, use patterns the owner has not learned, or work beyond the requested scope. This structure is deliberately **as thin as necessary** for a personal learning project — not a large AI operating system with manifests, receipts, and multi-layer state machines.
