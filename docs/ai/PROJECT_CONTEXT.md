# PROJECT_CONTEXT.md — Product and Architecture Context for FinCraft Lab

This document describes "what this project is" in a stable way (it does not change often) — unlike [`CURRENT_STATUS.md`](CURRENT_STATUS.md), which describes the state right now.

## Product

**FinCraft Lab** — Financial Literacy Discovery Lab

## Purpose

Users learn finance by:

- combining (Crafting) Elements together;
- discovering new Concepts;
- reading lessons grounded in the real world;
- connecting ideas on a Canvas;
- testing measurable outcomes through Simulations.

## Safety — critical constraints that always apply

- **Education Only**
- **Simulation Only**
- **Not Financial Advice**
- No real trading connections.
- No real market connections.
- No payment gateway in the presented MVP.
- No guaranteed profit.
- No price prediction.

## Technology Stack

- Next.js (Frontend, App Router)
- NestJS (Backend)
- PostgreSQL
- Prisma (not installed yet — see [`CURRENT_STATUS.md`](CURRENT_STATUS.md))
- pnpm (the only allowed package manager)
- User roles: `USER` / `ADMIN` / `SUPER_ADMIN`

## Main Data Domains

Planned core data model (not all created yet — see the actual state in `CURRENT_STATUS.md` and `FILE_MAP.md`):

1. `users`
2. `pets`
3. `element_categories`
4. `elements`
5. `discovery_details`
6. `element_relationships`
7. `craft_recipes`
8. `craft_recipe_inputs`
9. `user_elements`
10. `discovery_events`
11. `workspaces`
12. `workspace_nodes`
13. `workspace_edges`
14. `simulations`
15. `simulation_runs`

## Core Behavior Rules

- `Element` is shared master data (shared across all users).
- Rediscovery (crafting something that already exists) returns the existing Element; it never creates a duplicate.
- `user_elements` records only the first unlock per user.
- `discovery_events` records every Craft attempt, whether new or repeated.
- `input_hash` prevents duplicate Recipes.
- **Knowledge Relationship** and **Craft Recipe** are different concepts — never conflate them.
- All Simulation formulas live in NestJS (backend).
- `simulation_runs` stores historical inputs and outputs and must never be edited afterward.
- Financial claims must have a source or a clearly documented assumption.

## Deferred Modules (not built in this phase)

- Community
- Real subscription/payment
- Full Google Login
- Notifications
- Advanced Futures simulation
- Runtime AI image generation
- Full production operations

## Related documents

- Detailed coding rules → [`CODING_RULES.md`](CODING_RULES.md)
- Stepwise workflow → [`STEPWISE_WORKFLOW.md`](STEPWISE_WORKFLOW.md)
- Latest verified status → [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- Files that currently exist → [`FILE_MAP.md`](FILE_MAP.md)
