---
name: fincraft-teacher-stepwise-loop
description: Strict Teacher-aligned stepwise development loop for FinCraft Lab. Perform exactly one bounded step at a time, explain before editing, verify with real evidence, write literal NestJS/Next.js code without over-engineering, teach back to the owner, create a local commit, and stop for approval.
---

# FinCraft Lab — Teacher-Aligned Stepwise Loop Skill

This skill defines the mandatory operational workflow for developing **FinCraft Lab**.

---

## Canonical Rules Hierarchy

1. **`AGENTS.md`** — Single canonical source of truth for all rules.
2. **`SKILL.md`** (this file) — Operational execution loop and teacher-aligned coding directives.
3. **`docs/ai/CODING_RULES.md`** — Full coding standards, file limits, and architecture details.
4. **`docs/ai/CURRENT_STATUS.md`** — Latest verified project status.

If any instructions conflict, follow `AGENTS.md` first.

---

## Modern NestJS Root-MCS Policy

For every NestJS feature, **always keep these three primary files at the feature root**:
```text
src/<feature>/
  <feature>.module.ts
  <feature>.controller.ts
  <feature>.service.ts
```
Do **not** move these three files into `controllers/` or `services/`.

Supporting folders may be created under `src/<feature>/` only when needed:
```text
src/<feature>/
  dto/
  types/
  validators/
  mappers/
  constants/
  policies/
```
Additional feature-specific services should also remain at the feature root by default, e.g.:
- `workspace-canvas.service.ts`
- `workspace-canvas-writer.service.ts`

Do not create empty folders or `index.ts` barrel files.

---

## File and Method Size Policy

- **Hard file ceiling**: 400 physical lines for all maintained source files.
- **Hard method ceiling**: 100 physical lines for all maintained methods.
- Service review threshold: > 250 physical lines.
- Method review threshold: > 40–60 physical lines.

---

## The 7-Step Development Loop

Every single task must execute these 7 steps in exact order:

```text
Observe → Explain → Implement → Verify → Teach Back → Checkpoint → Stop
```

### 1. Observe
Inspect git status, branch, and current source files using `run_command` or `view_file`.

### 2. Explain (in Thai)
Before touching any file, explain to the owner in Thai:
- CURRENT STEP / OBJECTIVE
- STARTING COMMIT & WORKTREE
- FILES TO TOUCH / CREATE / DELETE
- RISKS & OUT OF SCOPE

### 3. Implement
Modify or create only the authorized files for the single bounded step.

### 4. Verify
Run static analysis (`tsc`, `lint`, `build`) and runtime verification (`test`, `test:e2e`, compiled acceptance scripts).

### 5. Teach Back (in Thai)
Explain to the owner in Thai what was changed, how the code works, and key design decisions.

### 6. Checkpoint
Execute git stage and commit locally (`git add -A; git commit -m "..."`). Never push unless explicitly instructed.

### 7. Stop
Recommend the next bounded step and stop execution. Wait for owner approval.
