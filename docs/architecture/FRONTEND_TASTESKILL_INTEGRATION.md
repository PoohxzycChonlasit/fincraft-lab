# FinCraft TasteSkill Integration

## Status and purpose

- **Status:** APPROVED PROJECT-LOCAL ADVISORY SNAPSHOT
- **Task ID:** `P13_FRONTEND_FOUNDATION_1C2_TASTESKILL_PROJECT_LOCAL_INTEGRATION_001`
- **Purpose:** improve design-review quality without defining the FinCraft brand or authorizing implementation.
- **Selected variant:** `design-taste-frontend-v1` from `skills/taste-skill-v1/SKILL.md`.
- **Rejected variants:** default `design-taste-frontend` v2 (experimental) and `gpt-taste` (stronger motion/layout direction conflicts with FinCraft).

## Provenance and license

| Item | Value |
| --- | --- |
| Repository | `https://github.com/Leonxlnx/taste-skill.git` |
| Commit | `e988add20dab0fa97d7a76781c48961c8184288e` |
| Commit date | 2026-07-23T18:01:24+02:00 |
| Source / vendor paths | `skills/taste-skill-v1/SKILL.md` / `.agents/vendor/taste-skill/design-taste-frontend-v1/SKILL.md` |
| SHA-256 | `B7D3715C36C93CE1AC44C60586DD7974A2C2C094AFF06C3A72B736314E60D8AC` (both copies) |
| License | MIT, copyright (c) 2026 Leonxlnx |

MIT allows redistribution, modification, commercial use, and sublicensing.
The copyright and permission notice are required in copies or substantial
portions, so the exact upstream `LICENSE` is vendored alongside the snapshot.
No source disclosure is required. No license ambiguity was found.

## Authority and trigger

Authority is: `AGENTS.md` → FinCraft frontend skill → canonical architecture
and design contracts → FinCraft adapter → vendored TasteSkill → task prompt.
FinCraft always wins conflicts.

Load the adapter for authorized visual design, layout, styling, component
appearance, and page composition. Do not load it for backend, database,
docs-only, dependency-only, or configuration-only tasks. Its presence is not
Product UI authorization.

TasteSkill improves design review quality. It does not define the FinCraft
brand, authorize implementation, install runtime dependencies, or override
canonical product, architecture, safety, or performance contracts.

## Conflict matrix

| Upstream topic | Classification | FinCraft result |
| --- | --- | --- |
| Hierarchy, spacing, responsive collapse, loading/empty/error states, labels, transform/opacity performance | COMPATIBLE | Apply when consistent with tokens and accessibility. |
| Anti-slop: avoid generic cards/pills, fake metrics, generic names, glow, gradient text, emoji controls | COMPATIBLE | Apply with FinCraft content and controlled Lucide/shadcn choices. |
| RSC default and isolated client interactivity | COMPATIBLE | Keep FinCraft's lower Client boundaries. |
| Variance 8, motion 6, density 4; asymmetric/heroes, bento and three-card bans | FINCRAFT_OVERRIDE | Use controlled-moderate variance and task-specific FinCraft composition. |
| Typography, Inter ban, mandated alternate fonts, serif rules | FINCRAFT_OVERRIDE | Use FinCraft token fonts and approved editorial exceptions. |
| One accent, palette, purple ban, dark-mode direction | FINCRAFT_OVERRIDE | Preserve teal trust, orange discovery, category colours, and light-first design. |
| Cards, shadows, glass, liquid glass, radii, docking, pills | FINCRAFT_OVERRIDE | Normal content stays flat; depth is only earned interactively. |
| Icon library and external placeholder/image advice | FINCRAFT_OVERRIDE | Use installed approved icons and controlled `next/image` assets only. |
| Package-install commands and framework/component-library assumptions | PROHIBITED | No installation or framework choice is authorized by TasteSkill. |
| Framer Motion, GSAP, springs, stagger, parallax, magnetic/cursor/scroll effects, loops | PROHIBITED | Only finite event-driven motion within FinCraft budgets and reduced motion. |
| 3D tilt, Three.js, WebGL, particles, video, animated gradients/graph edges, force layouts | PROHIBITED | 2D static graph with synchronized semantic list only. |
| Fake names, avatars, numbers, testimonials, social proof, invented content or permanent mocks | PROHIBITED | Use only backed product data and content. |
| Destructive commands and autonomous Git actions | NOT_APPLICABLE | Governed solely by FinCraft and task authorization. |

## Boundaries and maintenance

The vendor snapshot is unmodified and hash-verified; the adapter contains the
FinCraft-specific constraints. No upstream code executes, no package installs,
and no temporary checkout path is persisted.

Update only in a separately authorized task that re-resolves provenance,
reviews license and conflicts, verifies hashes, and updates this document.
Review if v2 becomes officially stable, the Owner authorizes experimental v2,
canonical frontend rules change materially, or upstream reports a security or
licensing concern. Roll back by removing the vendor, adapter, integration
references, and this document in one authorized reversal commit.

Deferred: whether a future stable v2 can meet FinCraft's authority, motion,
performance, package, and accessibility boundaries.
