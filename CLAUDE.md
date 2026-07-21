# CLAUDE.md — Claude Code Adapter for FinCraft Lab

This file is a **thin adapter** for Claude Code only. It is not a source of rules.

## Before starting any task

1. Read [`AGENTS.md`](AGENTS.md) in full first — it is the true canonical rule file.
2. Read [`docs/ai/CURRENT_STATUS.md`](docs/ai/CURRENT_STATUS.md) for the latest status.
3. Follow the skill: `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
   (invoke it via Claude Code's Skill tool when working in a stepwise loop).

## Claude Code-specific rules

- Use the permission mode set by the owner for that session; do not change it yourself.
- Never use `--dangerously-skip-permissions` unless the owner explicitly instructs it in that session.
- Use the model/effort the owner specifies per prompt (e.g. `sonnet` as default, `opus` as fallback).
- Read only the files needed for the current step; do not scan the whole repository without a concrete reason.

## Do not do this in this file

Do not copy rules from `AGENTS.md` or `docs/ai/*` into this file. To add a rule, edit `AGENTS.md` or `docs/ai/CODING_RULES.md` instead.
