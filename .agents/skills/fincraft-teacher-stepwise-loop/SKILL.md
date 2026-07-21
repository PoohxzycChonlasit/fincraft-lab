# FinCraft Lab — Teacher-Style Stepwise Loop Skill

## Purpose

Use this skill when building **FinCraft Lab** with AI agents.

The skill exists to ensure that the project is developed:

- one bounded step at a time;
- in the coding style learned from the teacher's Fakebook projects;
- with explanation before implementation;
- with evidence after implementation;
- without scaffolding the entire system in advance;
- without introducing architecture that has not been taught or required.

This skill applies to both repositories:

```text
C:\devnest 101\single-project\fincraft-lab\fincraft-lab-api
C:\devnest 101\single-project\fincraft-lab\fincraft-lab-web
```

## Source of Truth — read this first

This file describes **only the stepwise execution method** (how to run one loop, per function or endpoint). It is not the canonical rule file.

Before using this skill, read in order:

1. `AGENTS.md` at the project root — canonical rules for every AI tool
2. `docs/ai/CURRENT_STATUS.md` — latest verified state (do not trust memory)
3. `docs/ai/PROJECT_CONTEXT.md` — product context
4. `docs/ai/CODING_RULES.md` — full coding rules (this file only summarizes)

If anything in this file appears to conflict with `AGENTS.md`, `AGENTS.md` wins.

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
- one direct test for the current function.

Do not implement an entire feature module in one loop unless the owner explicitly requests it.

---

## Teacher-Style Baseline (summary only)

Full rules live in `docs/ai/CODING_RULES.md` (sections C and D). Quick reminder for use during a loop:

- **Backend**: organize by feature (`src/<feature>/`), controllers stay thin, business logic and Prisma queries live in the service, no repository layer, DTOs use `class-validator`, UUID primary keys.
- **Frontend**: Next.js App Router, Server Components by default, Client Components only for interactive UI (Canvas included), business logic never lives in page components.

Do not re-derive or copy the full rule lists here — read `docs/ai/CODING_RULES.md` when detail is needed.

---

## FinCraft-Specific Required Extensions

The teacher's sample project does not contain every FinCraft requirement.

The following additions are allowed because they are direct product requirements:

- `USER`, `ADMIN`, and `SUPER_ADMIN` roles;
- minimal role guards;
- Canvas Client Components;
- Craft transactions;
- duplicate recipe protection;
- rediscovery handling;
- Knowledge Graph responses;
- simulation calculation services;
- direct tests for Craft and Simulation behavior.

Do not introduce generic RBAC tables, CQRS, event buses, microservices, or repository abstractions.

---

## NestJS Generator Policy — No Automatic Unit Specs

Full policy lives in `docs/ai/CODING_RULES.md` (section F) — this is the operational reminder for use during a loop:

- Run every `nest g ...` generator that can create a test file with `--no-spec`.
- Do not hand-create a `*.spec.ts` file unless the owner explicitly asks for a unit test in the current bounded step.
- Never delete an existing spec or the E2E test file for this reason alone.
- This does not reduce verification — see "4. Verify" below for what evidence to use instead.

---

## Stepwise Learning Loop

Every implementation step must follow this exact loop. Full description of each stage lives in `docs/ai/STEPWISE_WORKFLOW.md` — this section keeps the actionable checklist.

### 1. Observe

Before changing files:

- confirm the repository path;
- inspect only files relevant to the current step;
- display current Git status if Git exists;
- identify existing patterns that the new function must follow;
- do not scan the entire repository without a concrete reason;
- if unexpected uncommitted changes exist, stop and report — do not overwrite.

### 2. Explain

Before writing code, explain in Thai:

- objective;
- why the step matters;
- scope;
- out-of-scope;
- files that will be read;
- files that may be created or modified;
- request flow;
- expected success case;
- expected error case;
- risks.

The owner must be able to understand how the function works before implementation starts.

### 3. Implement

Implement only the current bounded step.

Rules:

- create only files required by the current step;
- do not create future feature folders;
- do not install unrelated packages;
- do not refactor unrelated code;
- do not rename unrelated files;
- preserve the existing teacher-style structure;
- prefer the simplest implementation that satisfies the current requirement;
- use `--no-spec` on any Nest CLI generator run; do not hand-create a unit spec unless the owner explicitly requested one for this step.

### 4. Verify

Run only the smallest useful verification. A step with no new unit spec is not unverified — use whichever of these actually applies:

- compile or type-check the touched area;
- build and lint;
- Prisma format/validate/generate, when relevant;
- call the endpoint manually when relevant;
- verify both success and error behavior;
- run the existing E2E test when it covers the change;
- inspect the diff;
- confirm no unrelated files changed.

Never claim success without evidence.

### 5. Teach Back

After verification, explain:

- what each changed file does;
- how the files call one another;
- the full request flow;
- what data enters;
- what data is stored;
- what response leaves;
- what error can happen;
- what the owner should remember.

Use a compact flow such as:

```text
Request
→ Controller
→ DTO / Pipe
→ Service
→ Prisma
→ PostgreSQL
→ Response
```

### 6. Checkpoint

End every loop with:

```text
STEP_RESULT:
STATUS:
FILES_CHANGED:
VERIFICATION:
WHAT_WAS_LEARNED:
NEXT_RECOMMENDED_STEP:
STOPPED_BEFORE_NEXT_STEP: YES
```

Create one semantic local commit only when verification has passed and the owner has authorized it. Never push without explicit owner instruction.

### 7. Stop

Stop after the current step.

Do not automatically continue to the next function.

---

## Scope Control

### Allowed in one loop

Examples:

- create `GET /health`;
- connect Prisma to PostgreSQL;
- create one Prisma model;
- create `GET /element-categories`;
- create `POST /element-categories`;
- create one DTO;
- create one direct test;
- connect one frontend page to one backend endpoint.

### Not allowed in one loop

Examples:

- generate all 15 ERD models at once;
- create all feature folders;
- implement full authentication;
- implement all CRUD endpoints;
- build the entire Canvas;
- build all simulations;
- create frontend and backend for multiple modules together;
- install a large package set for future use.

---

## Runtime Safety and Data Rules (summary)

Full hard safety rules live in `AGENTS.md`. Quick reminders relevant to this skill:

- Never delete or overwrite existing owner files without explicit approval.
- Never modify the Fakebook teacher repositories.
- Never run destructive database or migration commands without approval.
- Never commit secrets or store plain-text passwords.
- Never hard-delete shared master data such as Elements or Craft Recipes in the MVP — use status fields for deactivation instead.

---

## FinCraft Data Behavior

### Existing Element

If Craft produces an Element that already exists:

- return the existing Element;
- do not create a duplicate Element;
- create `user_elements` only if the user has not unlocked it;
- create a discovery event for every Craft attempt;
- return whether the result is new for that user.

### Recipe Duplicate

For commutative recipes:

```text
Income + Expense
Expense + Income
```

must resolve to the same canonical input hash. NestJS creates the hash; PostgreSQL enforces uniqueness.

### Simulation

- formulas live in NestJS;
- inputs and outputs may be stored in `simulation_runs`;
- simulation runs are historical records and must not be edited;
- assumptions must be shown to users even when they are defined in code.

---

## Evidence Standard

A step is complete only when the agent provides direct evidence such as:

- command output;
- passing direct test;
- HTTP response;
- Prisma query result;
- type-check result;
- diff summary.

The agent must distinguish: observed fact, inference, recommendation, unresolved question.

---

## Required Response Before Coding

```text
CURRENT STEP:
OBJECTIVE:
WHY IT MATTERS:
SCOPE:
OUT OF SCOPE:
FILES TO READ:
FILES TO CREATE OR MODIFY:
REQUEST FLOW:
RISKS:
VERIFICATION PLAN:
WAITING FOR IMPLEMENTATION APPROVAL:
```

If the owner has already explicitly requested implementation, replace the final line with:

```text
IMPLEMENTATION AUTHORIZED: YES
```

---

## Required Response After Coding

```text
STEP_RESULT:
STATUS: PASS | FAIL | BLOCKED

FILES_CHANGED:
- path
- path

HOW THE FILES CONNECT:
1.
2.
3.

VERIFICATION:
- command:
- result:

SUCCESS CASE:
ERROR CASE:

WHAT WAS LEARNED:

NEXT RECOMMENDED STEP:

STOPPED_BEFORE_NEXT_STEP: YES
```

---

## Initial Project Sequence

Follow this order unless the owner changes it:

```text
STEP 0  — Initialize NestJS backend only              [DONE — commit 34117a1]
STEP 1  — Explain generated NestJS files               [DONE]
STEP 2  — Add GET /health                              ← next bounded step (P1)
STEP 3  — Connect Prisma and PostgreSQL
STEP 4  — Create the first Prisma model only
STEP 5  — GET /element-categories
STEP 6  — GET /element-categories/:id
STEP 7  — POST /element-categories
STEP 8  — PATCH /element-categories/:id
STEP 9  — Authentication foundation
STEP 10 — Elements
STEP 11 — Craft Recipe
STEP 12 — Craft action
STEP 13 — Workspace
STEP 14 — One Simulation
STEP 15 — Connect the first frontend page
```

Do not jump ahead because a later feature appears more interesting.

---

## Current Next Step

Verified baseline (see `docs/ai/CURRENT_STATUS.md` for full evidence):

- P0 backend foundation is complete and committed at `34117a1`.
- `fincraft-lab-api` runs, builds, lints, and tests pass.
- Prisma is not installed. PostgreSQL is not configured.
- `GET /health` does not exist yet.
- `fincraft-lab-web` remains empty and out of scope until its own step.

The next bounded step is:

```text
STEP 2 — Implement GET /health as one bounded teacher-style backend function
in fincraft-lab-api.
```

This step must not:

- install Prisma or configure PostgreSQL;
- create authentication;
- initialize the frontend;
- install unrelated packages;
- implement any endpoint beyond `GET /health`.

After implementation, verify and teach back what each changed file does, then stop.
