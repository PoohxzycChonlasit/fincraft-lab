---
name: fincraft-frontend-engineering
description: Use for every FinCraft Lab frontend planning, implementation, refactor, review, and verification task. Enforces small single-purpose files, component decomposition, Server/Client boundaries, design-system rules, anti-AI-slop checks, typed API usage, and evidence-based completion.
---
# FinCraft Lab Frontend Engineering Skill

## Use this skill for
- Next.js routes and layouts
- React components
- shadcn/ui and Tailwind
- Design System work
- TasteSkill review
- Forms and API integration
- Auth, Pet, Canvas, Graph, Simulation, Admin Content
- Frontend refactoring and review

Do not modify the NestJS backend unless the task explicitly authorizes it.

---

## 1. Product direction

FinCraft Lab is a Financial Literacy Discovery Lab.
The UI must be:
- a friendly learning laboratory;
- trustworthy and educational;
- playful but not childish;
- polished but not generic SaaS;
- visually expressive without becoming noisy.

The Craft Canvas is the primary product.
Mochi is a guide, not a Craft Recipe input.
All financial content is educational and simulation-only.

## 1A. Canonical visual and Discovery Web guardrails

Every future visual or UI task must follow the approved contracts:

- Use **FinCraft Tactile Discovery Lab** as the visual direction.
- Keep normal reading surfaces flat. Earn dimensional treatment only for interactive, selected, pressed, drag, inset, and floating states.
- Use editorial/detail borrowing for learning content and limited modular borrowing inside Craft/Canvas relationship encoding.
- Treat Kigen as a reference for control anatomy and token discipline only; do not copy its layout, branding, navigation, content, or exact components.
- Use the approved signature language: Specimen Element Tile, Recessed Craft Bay, Orange Discovery Stamp, Financial Learning Tape, Mochi Lab Note, and Discovery Web Connection Language.
- Reject 3D, WebGL, particles, animated graph edges, continuous force simulation, perpetual layout, continuously animated gradients, large blur layers, video backgrounds, and decorative infinite motion.
- Graph experiences must provide a synchronized semantic relationship list as the canonical accessible representation; graph canvas is an enhancement.
- Keep canonical knowledge, recipe provenance, personal discovery, and workspace layers visibly and semantically distinct.
- Filter undiscovered data server-side. Hidden names, relationships, outputs, ingredients, topology, counts, and identities must be absent from payload, DOM, accessibility text, search suggestions, URLs, filter counts, and errors.
- Do not invent Graph DTOs, hardcode Graph records, create permanent Graph mocks, query Prisma, or derive recipes in client logic.
- Do not install React Flow or another graph/layout package without a separately authorized bounded package task.
- Treat initial graph budgets as unverified until future profiling proves real-content performance.

Canonical details live in `docs/architecture/FRONTEND_VISUAL_AND_DISCOVERY_WEB_DECISION.md`, `docs/architecture/FRONTEND_ROUTE_CONTRACT.md`, `docs/architecture/FRONTEND_SYSTEM_DESIGN.md`, and `docs/design/FINCRAFT_DESIGN_DIRECTION.md`. Do not duplicate the full research documents in this Skill.

---

## 2. Canonical stack

Use:
- Next.js App Router
- TypeScript strict
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- React Hook Form + Zod
- TanStack Query
- Zustand for Canvas state
- React Flow for future bounded Canvas and Graph Client islands, only after a separately authorized package task
- Recharts for Simulation
- typed native `fetch`
- `next/image`
- TasteSkill as a visual review guardrail

Do not add another major UI framework.
Do not add Axios without explicit justification.
Install only packages needed by the current bounded task.
Do not run shadcn `add --all`.

### Package version policy

All packages must use the latest stable compatible version at install/update time (`latest` dist-tag on npm).

- Prereleases (alpha, beta, rc, canary, next, experimental) are forbidden without explicit Owner authorization.
- Before keeping a newer major, probe: install → `pnpm peers check` → typecheck → lint → source-limits → build → runtime.
- If any gate fails due to the package, revert and report `BLOCKED_COMPATIBILITY_EXCEPTION_REQUIRED`.
- Node runtime: use latest patch in the Active LTS channel. Do not switch to Current.
- `@types/node` must match the actual runtime major (Node 24 → `@types/node@^24`).
- Resolved versions must be recorded in `package.json` and `pnpm-lock.yaml`. No floating upgrades.
- Upgrades occur only in authorized bounded tasks.

---

## 3. Core rule: Break by Responsibility

> Break large UI before it becomes a bug, review problem, or maintenance trap.

A maintained file must have one clear responsibility.
Do not combine fetching, mapping, form validation, business logic, multiple UI regions, modal logic, and large JSX in one file.

Use this hierarchy:
```text
Page
→ Feature screen
→ Section
→ Component
→ Primitive
```

Hooks own stateful behaviour.
API files own endpoint calls.
Mappers own transformation.
Schemas own validation.

---

## 4. File-size policy

Generated and third-party files are excluded.

| File | Preferred | Review | Hard |
|---|---:|---:|---:|
| `page.tsx` / layout | 120 | 160 | 220 |
| Feature component | 140 | 180 | 240 |
| Complex interactive component | 180 | 220 | 280 |
| Hook / API / mapper / schema | 100 | 130 | 180 |
| Zustand store | 140 | 180 | 240 |
| Test | 180 | 240 | 300 |

Absolute maintained-source limit: **300 lines**.
A 400–500 line frontend source file is forbidden.
Refactor before adding behaviour to a file already above its review threshold.

Function limits:
- preferred: 30 lines;
- review: over 45;
- hard: 60.

JSX return limits:
- preferred: 60 lines;
- review: over 80;
- hard: 120.

---

## 5. Required architecture

```text
src/
├── app/
├── components/
│   ├── ui/
│   └── brand/
├── features/
├── lib/
├── hooks/
├── styles/
└── types/
```

### `app`
Routes, layouts, metadata, loading/error boundaries, route protection, and feature composition only.
No large feature implementation in route files.

### `components/ui`
Generic shadcn and accessible primitives only.
No FinCraft business logic, feature API, or feature store imports.

### `components/brand`
Reusable FinCraft-specific visuals such as:
- `FinCraftLogo`
- `MochiGuide`
- `ElementBadge`
- `CraftEquation`
- `EducationDisclaimer`
- `DiscoveryStatus`
- `SimulationInsightCard`

No feature fetching.

### `features`
Each feature owns its components, hooks, API adapter, schemas, mappers, types, and stores.
Create only directories required by the current task.

### `lib`
Cross-cutting infrastructure only: API client, auth helpers, query setup, env validation, and generic utilities.

---

## 6. Import boundaries

Allowed:
```text
app → features → brand → ui
app/features → lib
```

Forbidden:
- `ui` importing `brand` or features;
- `brand` importing feature internals;
- feature A importing private files from feature B;
- `lib` importing feature UI;
- circular dependencies.

Move genuinely shared code to `brand`, `lib`, or an explicit shared module.

---

## 7. Server and Client Components

Default to Server Components.
Use `"use client"` only for:
- local interactive state;
- event handlers;
- effects or browser APIs;
- React Flow;
- Zustand;
- TanStack Query client hooks;
- React Hook Form.

Do not mark a full page Client Component because one child is interactive.
Keep Client boundaries low and narrow.

---

## 8. State ownership

| State | Owner |
|---|---|
| Backend data | Server Component or TanStack Query |
| Form values | React Hook Form + Zod |
| Canvas viewport/selection | Zustand |
| Local UI state | Component state |
| Shareable filters | URL search params |
| Token | HttpOnly cookie |
| Design values | CSS variables |

Do not duplicate the same server data in Query cache, Zustand, and local state.

---

## 9. API rules

Use typed native `fetch`.
Components must not call `fetch` directly.

Use:
```text
lib/api/api-client.ts
features/<feature>/api/<feature>.api.ts
```

Shared API client owns transport concerns.
Feature API adapters own paths and DTO types.
Mappers convert API responses when the UI needs a view model.
Do not expose JWTs to normal client JavaScript when HttpOnly cookies are available.

---

## 10. Mandatory split triggers

Refactor when any trigger is true:
1. Two independent visual regions.
2. More than three unrelated state values.
3. More than two unrelated effects.
4. Fetching plus a large presentation tree.
5. Repeated JSX.
6. Multiple forms.
7. Multiple dialogs or sheets.
8. Multiple stores.
9. Props cover unrelated concerns.
10. File name contains `And`, `Full`, `Complete`, or `Everything`.
11. File crosses its review threshold.
12. The file cannot be explained in one sentence.

---

## 11. Design-system rules

Use tokens for colour, typography, spacing, radius, shadow, motion, z-index, and breakpoints.

Components must cover relevant states:
- default;
- hover;
- focus-visible;
- active;
- selected;
- disabled;
- loading;
- error;
- success;
- empty.

Do not use arbitrary one-off values when a token exists.
Teal is the main trust/action family.
Orange is reserved for Craft, Discovery, and high-priority product moments.

---

## 12. shadcn/ui rules

- Install only components needed now.
- Keep primitives in `components/ui`.
- Put FinCraft wrappers in `components/brand`.
- No business logic inside primitives.
- Prefer variants and composition over copied components.

---

## 13. TasteSkill and anti-AI-slop

Priority:
```text
AGENTS.md
→ this skill
→ FinCraft Design System
→ Frontend System Design
→ TasteSkill
→ task prompt
```

TasteSkill cannot override accessibility, product scope, FinCraft colour semantics, Mochi rules, responsive behaviour, or backend reality.

Reject or refactor:
- cards nested inside cards;
- excessive pills;
- random gradients;
- fake metrics or activity;
- mascot decoration everywhere;
- repeated giant CTA buttons;
- generic SaaS dashboards;
- random emoji controls;
- mixed icon libraries;
- arbitrary shadows;
- meaningless sparkles;
- identical layouts for unrelated pages;
- UI claims for unsupported features.

Each page needs one clear hierarchy and one primary action.

---

## 14. Responsive and accessibility rules

Design mobile and desktop together. Do not shrink desktop layouts blindly.
Define desktop, tablet, mobile, overflow, panel, and navigation behaviour for every screen.

Examples:
- Knowledge Vault becomes a Sheet on mobile.
- Discovery Detail becomes a Sheet or bottom panel.
- Canvas controls remain touch-accessible.
- Simulation inputs stack before results.

Required accessibility:
- semantic HTML;
- keyboard support;
- visible focus;
- labelled controls;
- no colour-only meaning;
- sufficient contrast;
- approximately 44 px touch targets;
- reduced-motion support;
- correct image alt behaviour.

---

## 15. Image and Mochi rules

Use `next/image`.
Use controlled Mochi assets.
Mochi appears only for onboarding, guidance, empty states, discovery success, simulation explanation, or safety reminders.
Do not add Mochi to every card or page corner.
Do not generate inconsistent mascot poses during implementation tasks.

---

## 16. Refactor-first procedure

When a file crosses the review threshold:
1. stop adding features;
2. list responsibilities;
3. extract the smallest independent unit;
4. preserve behaviour;
5. run quality checks;
6. continue after the file returns below threshold.

Do not postpone known decomposition.

---

## 17. Required agent workflow

Use exactly:
```text
Observe
→ Explain
→ Component Map
→ File Plan
→ Implement
→ Verify
→ Refactor Check
→ Teach Back
→ Checkpoint
→ Stop
```

Before edits, the agent must state:
```text
TASK_ID:
OBJECTIVE:
ROUTE_OR_FEATURE:
BACKEND_ENDPOINTS:
COMPONENT_TREE:
FILES_TO_CREATE:
FILES_TO_MODIFY:
RESPONSIBILITY_PER_FILE:
SERVER_COMPONENTS:
CLIENT_COMPONENTS:
STATE_OWNERSHIP:
EXPECTED_LINE_COUNTS:
RESPONSIVE_PLAN:
ACCESSIBILITY_PLAN:
OUT_OF_SCOPE:
SUCCESS_CRITERIA:
```

Do not implement before the component map and file plan are coherent.

---

## 18. Verification gates

Minimum checkpoint gates:
```text
TypeScript diagnostics: 0
ESLint errors: 0
ESLint warnings: 0
Next build: PASS
No unexpected files
No secret exposure
No file above 300 lines
No function above 60 lines
No JSX return above 120 lines
No route-level god component
No broad "use client" boundary
```

Feature-specific verification must match the feature contract.

---

## 19. Final capsule

After work, report:
```text
TASK_ID:
STATUS: PASS | PASS_WITH_FIXES | BLOCKED | FAIL
SCOPE:
- Changed files:
- Unexpected files:
ARCHITECTURE:
- Component tree:
- Server Components:
- Client Components:
- API calls:
- State ownership:
- Import violations:
FILE_SIZE:
- Largest changed file:
- Largest line count:
- Review-threshold violations:
- Hard-limit violations:
- Functions above limit:
- JSX above limit:
- Refactors performed:
DESIGN_SYSTEM:
- Tokens used:
- Arbitrary values:
- shadcn components:
- Brand components:
- TasteSkill review:
- Anti-AI-slop gate:
RESPONSIVE:
- Desktop:
- Tablet:
- Mobile:
- Overflow:
ACCESSIBILITY:
- Keyboard:
- Focus:
- Labels:
- Contrast:
- Reduced motion:
- Images:
QUALITY:
- TypeScript:
- ESLint:
- Build:
- Tests:
- Runtime verification:
GIT:
- HEAD:
- Worktree:
- Commit:
- Push:
SAFE_TO_CONTINUE:
NEXT_RECOMMENDED_STEP:
STOPPED_BEFORE_NEXT_TASK: YES
```

---

## 20. Acceptance

Return `PASS` only when scope, architecture, line limits, TypeScript, ESLint, build, responsive behaviour, accessibility, backend alignment, and Git authorization all pass.
Return `PASS_WITH_FIXES` only for bounded non-blocking cleanup.
Return `BLOCKED` when prerequisites or contracts are missing.
Return `FAIL` when behaviour, architecture, safety, or quality gates fail.

The frontend is not accepted merely because it looks good. It must remain understandable, decomposed, typed, accessible, responsive, testable, and safe for future AI-assisted modification.
