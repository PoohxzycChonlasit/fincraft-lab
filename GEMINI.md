# GEMINI.md — Gemini Adapter for FinCraft Lab

This file is a **thin adapter** for Gemini only. It is not a source of rules.

## Before starting any task

1. Read [`AGENTS.md`](AGENTS.md) in full first — it is the true canonical rule file.
2. Read [`docs/ai/CURRENT_STATUS.md`](docs/ai/CURRENT_STATUS.md) for the latest status.
3. Follow the skill: `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
   (use it as the operational guide for the stepwise loop, even though Gemini does not have a Skill-tool mechanism like Claude Code).

## Gemini-specific rules

- Read only the files needed for the current step; do not scan the whole repository without a concrete reason.
- Never run destructive commands or push without an explicit instruction from the owner.
- If Gemini's tools or permission model differ from Claude Code's, defer to the Hard Safety Rules in `AGENTS.md` as the authority.

## Do not do this in this file

Do not copy rules from `AGENTS.md` or `docs/ai/*` into this file. To add a rule, edit `AGENTS.md` or `docs/ai/CODING_RULES.md` instead.
