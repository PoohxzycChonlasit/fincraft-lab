# STEPWISE_WORKFLOW.md — Lifecycle of Each Bounded Step

This document describes the lifecycle of one development step (a bounded step) in detail. For the practical, skill-mode execution guide, see `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`.

## The full loop

```text
Observe → Explain → Implement → Verify → Teach Back → Checkpoint → Stop
```

### 1. Observe

- Confirm the repository path and Git state.
- Read only the files relevant to the current step.
- Identify the existing patterns the new function must follow.
- If unexpected uncommitted changes exist, stop and report them — never overwrite.

### 2. Explain

Before writing code, explain:

- objective;
- why this step matters;
- scope / out-of-scope;
- files to be read / created / modified;
- request flow;
- risks;
- verification plan.

The owner must understand how this function works before implementation begins.

### 3. Implement

- Do only the current bounded step.
- Create only the files this step requires.
- Never create feature folders in advance.
- Never install unrelated packages.
- Never refactor or rename unrelated files.
- Preserve the existing teacher-style structure.
- Choose the simplest implementation that satisfies the current requirement.

### 4. Verify

Run only the smallest useful checks:

- compile / type-check the touched area;
- run the direct test for the current behavior;
- call the endpoint directly when relevant;
- verify both the success case and the error case;
- inspect the diff;
- confirm no unrelated files changed.

Never claim success without evidence.

### 5. Teach Back

After verification passes, explain:

- what each changed file does;
- how the files call one another;
- the full request flow;
- what data enters, where it is stored, what response leaves, and what errors can occur;
- what the owner should remember.

Standard flow diagram when relevant to backend work:

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

- Create a single local commit only once authorized and verified.
- Never push without an explicit instruction from the owner.

### 7. Stop

- Recommend exactly one next bounded step.
- Never continue automatically.
- Always wait for owner approval before moving to the next step.

## Evidence Standard

A step is only "done" when there is direct evidence, such as:

- command output;
- a passing direct test;
- an actual HTTP response;
- a Prisma query result;
- a type-check result;
- a diff summary.

Always distinguish between: observed fact, inference, recommendation, and unresolved question.

## Related documents

- Detailed coding rules → [`CODING_RULES.md`](CODING_RULES.md)
- Current status → [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- The practical skill version, including protocol templates → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
