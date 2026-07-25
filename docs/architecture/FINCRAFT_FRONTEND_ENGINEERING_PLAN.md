# FinCraft Lab — Frontend Engineering & Component Decomposition Plan

## Purpose

Define how the FinCraft Lab frontend will be structured before implementation begins.

Goals:

- Keep files small, readable, and easy to audit.
- Prevent 300–500 line “god components”.
- Separate visual primitives, domain components, feature logic, API logic, and route composition.
- Make AI-generated code inspectable and easy to refactor.
- Preserve the FinCraft Lab design direction instead of drifting into generic AI-generated UI.

---

## 0. Package Version Policy

All frontend packages must use the latest stable compatible version at install/update time.

- **Latest stable**: the `latest` dist-tag on npm at execution time.
- **Prereleases forbidden**: alpha, beta, rc, canary, next, experimental are not permitted without explicit Owner authorization.
- **Compatibility probe required for majors**: install → `pnpm peers check` → typecheck → lint → source-limits → Next.js build → production runtime. Revert and report `BLOCKED_COMPATIBILITY_EXCEPTION_REQUIRED` if any gate fails.
- **Node runtime**: Active LTS channel only. Do not switch to Current.
- **`@types/node`**: must align to actual runtime major (e.g. Node 24 LTS → `@types/node@^24`).
- **Lockfile**: all resolved versions recorded in `package.json` and `pnpm-lock.yaml`. No floating upgrades.
- **Upgrades only in bounded tasks**: every upgrade is authorized, probed, and committed independently.

---

## 1. Core Rule: Break by Responsibility


A frontend file must have one clear responsibility.

A file should not simultaneously:

- fetch data;
- manage form state;
- own complex business rules;
- render multiple independent UI regions;
- manage modal state;
- map API data;
- format domain values;
- contain a large JSX tree.

When two or more of these responsibilities appear together, split the file before continuing.

A page composes sections. A section composes components. A component renders one interaction or visual responsibility. A hook owns one stateful behaviour. An API file calls one backend resource family. A schema validates one form or feature payload.

---

## 2. Frontend File Size Policy

These limits apply to maintained source files. Generated files and third-party code are excluded.

| File type | Preferred | Review required | Hard limit |
|---|---:|---:|---:|
| Route `page.tsx` | ≤120 | >160 | 220 |
| Layout | ≤120 | >160 | 220 |
| Feature component | ≤140 | >180 | 240 |
| Complex interactive component | ≤180 | >220 | 280 |
| Hook | ≤100 | >130 | 180 |
| API adapter | ≤100 | >130 | 180 |
| Mapper | ≤100 | >130 | 180 |
| Zod schema / DTO types | ≤100 | >130 | 180 |
| Utility file | ≤100 | >130 | 180 |
| Zustand store | ≤140 | >180 | 240 |
| Test file | ≤180 | >240 | 300 |

### Hard rule

No maintained frontend source file may exceed **300 lines**.

A file approaching 250 lines must be reviewed for decomposition before more code is added.

A 400–500 line frontend file is an architecture defect, not a normal implementation state.

---

## 3. Function and JSX Limits

- Preferred function length: **≤30 lines**
- Review required: **>45 lines**
- Hard limit: **60 lines**
- Preferred JSX return block: **≤60 lines**
- Review required: **>80 lines**
- Hard limit: **120 lines**

When JSX exceeds the review threshold, split by visible region or interaction.

Bad:

```tsx
export function LabPage() {
  // fetch
  // selection state
  // drag state
  // modal state
  // 250 lines of JSX
}
```

Good:

```tsx
export function LabPage() {
  return (
    <LabShell>
      <KnowledgeVault />
      <CraftCanvas />
      <DiscoveryPanel />
    </LabShell>
  );
}
```

---

## 4. Folder Architecture

```text
src/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── (app)/
│   ├── admin/
│   └── dev/
├── components/
│   ├── ui/
│   └── brand/
├── features/
│   ├── auth/
│   ├── pet/
│   ├── elements/
│   ├── craft/
│   ├── workspace/
│   ├── canvas/
│   ├── discovery/
│   ├── graph/
│   ├── simulation/
│   └── admin-content/
├── lib/
│   ├── api/
│   ├── auth/
│   ├── query/
│   ├── env/
│   └── utils/
├── hooks/
├── styles/
└── types/
```

---

## 5. Layer Responsibilities

### `src/app`

Owns route definition, route-level loading/error boundaries, layouts, metadata, server-side route protection, and feature composition.

It must not contain large feature implementations, API mapping logic, complex forms, reusable domain UI, or canvas algorithms.

### `src/components/ui`

Contains shadcn/ui primitives and low-level accessible UI.

Examples: Button, Input, Dialog, Sheet, Tabs, Tooltip, Skeleton.

Rules:

- no FinCraft business logic;
- no feature API imports;
- no feature store imports;
- minimal branding beyond shared tokens.

### `src/components/brand`

Contains reusable FinCraft-specific UI.

Examples:

- `FinCraftLogo`
- `MochiGuide`
- `ElementBadge`
- `ElementIcon`
- `CraftEquation`
- `EducationDisclaimer`
- `DiscoveryStatus`
- `SimulationInsightCard`

It may know FinCraft domain language, but it must not own feature fetching.

### `src/features`

Each feature owns its components, hooks, API adapters, schemas, mappers, feature-local types, and feature-local stores.

Recommended shape:

```text
features/craft/
├── components/
│   ├── craft-composer.tsx
│   ├── craft-input-slot.tsx
│   ├── craft-result-card.tsx
│   └── no-recipe-state.tsx
├── hooks/
│   └── use-craft-mutation.ts
├── api/
│   └── craft.api.ts
├── schemas/
│   └── craft.schema.ts
├── mappers/
│   └── craft.mapper.ts
└── types/
    └── craft.types.ts
```

Do not create empty directories in advance.

### `src/lib`

Contains cross-cutting infrastructure such as the typed fetch client, API error normalization, authentication cookie helpers, TanStack Query setup, environment parsing, and generic utilities.

It must not contain feature UI.

---

## 6. Import Boundary Rules

Allowed direction:

```text
app
↓
features
↓
brand
↓
ui
```

Cross-cutting infrastructure:

```text
app / features
→ lib
```

Forbidden:

- `ui` importing `brand`;
- `ui` importing any feature;
- one feature importing another feature’s private component;
- `lib` importing feature UI;
- circular feature imports;
- app routes importing deep private files when a feature entry component exists.

---

## 7. Server and Client Component Strategy

Default to **Server Components**.

Use `"use client"` only when a component needs browser events, local interactive state, hooks, browser APIs, React Flow, Zustand, TanStack Query client hooks, or React Hook Form.

Do not mark an entire page as Client Component because one button is interactive.

Keep Client Components as low in the tree as practical.

---

## 8. State Ownership

| State type | Owner |
|---|---|
| Backend server data | Server Component or TanStack Query |
| Form values | React Hook Form + Zod |
| Canvas selection and viewport | Zustand |
| Modal/open state | Local component state |
| Shareable filters | URL search params |
| Authentication token | HttpOnly cookie |
| Design theme tokens | CSS variables |
| Static marketing content | Server Component |

Do not duplicate the same server data in TanStack Query, Zustand, and local state.

---

## 9. API Structure

Use typed native `fetch`, not Axios.

Recommended:

```text
src/lib/api/
├── api-client.ts
├── api-error.ts
├── api-response.ts
└── endpoints.ts
```

Feature adapters:

```text
src/features/elements/api/elements.api.ts
src/features/workspace/api/workspace.api.ts
src/features/simulation/api/simulation.api.ts
```

Rules:

- the API client handles transport concerns only;
- feature API files know endpoint paths and payload types;
- UI components do not call `fetch` directly;
- components do not parse backend error payloads;
- mappers convert API responses to UI view models when needed.

---

## 10. Component Split Triggers

Split a component when any of these is true:

1. It renders two independent visual regions.
2. It has more than three unrelated pieces of state.
3. It has more than two effects with different purposes.
4. It fetches data and also contains a large presentation tree.
5. It contains repeated markup.
6. It has more than one form.
7. It contains multiple dialogs or sheets.
8. It requires more than one feature store.
9. Its props describe unrelated responsibilities.
10. Its name contains `And`, `WithEverything`, `Full`, or `Complete`.
11. It crosses the review line limit.
12. A reviewer cannot explain the file in one sentence.

---

## 11. Page Decomposition Examples

### Lab Canvas

```text
LabPage
└── LabScreen
    ├── LabToolbar
    ├── KnowledgeVault
    │   ├── ElementSearch
    │   ├── ElementCategoryList
    │   └── DraggableElementItem
    ├── CraftCanvas
    │   ├── CanvasViewport
    │   ├── ElementNode
    │   ├── DiscoveryNode
    │   ├── CanvasControls
    │   └── CanvasEmptyState
    └── DiscoveryPanel
        ├── DiscoveryHeader
        ├── DiscoveryStory
        ├── RealLesson
        ├── TradeoffGrid
        └── SuggestedCombos
```

### Simulation

```text
SimulationPage
└── SimulationScreen
    ├── ScenarioHeader
    ├── SimulationInputPanel
    │   ├── MoneyInput
    │   ├── PercentageInput
    │   └── TimeHorizonInput
    ├── SimulationResults
    │   ├── ResultChart
    │   ├── ResultSummary
    │   └── TimelineMilestones
    └── InsightPanel
        ├── RiskMeter
        ├── KeyLesson
        ├── HiddenRisk
        └── SuggestedChange
```

### Admin Content

```text
AdminElementsPage
└── AdminElementsScreen
    ├── AdminPageHeader
    ├── ElementFilters
    ├── ElementTable
    ├── ElementEditorSheet
    └── DiscoveryDetailEditor
```

---

## 12. Design System Integration

The design system must be built before product pages.

Required tokens:

- colour;
- typography;
- spacing;
- radius;
- shadow;
- motion;
- z-index;
- responsive breakpoints.

Required component states:

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

Rules:

- no arbitrary one-off colours;
- no repeated magic spacing values;
- no unique radius per page;
- no unreviewed gradients;
- no fake metrics;
- no excessive card nesting;
- no mascot decoration without purpose.

---

## 13. shadcn/ui Rules

- Install only components required by the current bounded task.
- Do not use `add --all`.
- Keep primitive files in `src/components/ui`.
- Do not place feature business logic inside shadcn primitives.
- Build FinCraft-specific wrappers in `src/components/brand`.
- Modify shadcn source only when the change belongs to the shared primitive.
- Prefer variants over copying the same component into multiple features.

---

## 14. TasteSkill Usage

TasteSkill is a design-review guardrail, not the project authority.

Priority order:

```text
AGENTS.md
→ FinCraft frontend skill
→ FinCraft design system
→ Frontend system design
→ TasteSkill
→ Page-specific task prompt
```

TasteSkill must not override accessibility, FinCraft colour semantics, Mochi rules, backend-supported MVP scope, mobile usability, or performance constraints.

---

## 15. Anti-AI-Slop Rules

Reject or refactor UI that relies on:

- every section inside a floating card;
- excessive pills;
- decorative gradients without semantic purpose;
- fake users, fake growth figures, or fake activity;
- mascot in every section;
- repeated oversized orange CTA;
- generic SaaS dashboard composition;
- random emoji for controls;
- mixed icon libraries;
- arbitrary shadows;
- identical layouts across unrelated pages;
- meaningless sparkle decoration;
- text that claims unavailable functionality.

Each page must have a clear information hierarchy and one primary action.

---

## 16. Refactor-First Gate

Before adding new behaviour to a file above its review threshold:

1. stop;
2. identify responsibilities;
3. extract the safest independent unit;
4. preserve behaviour;
5. run quality checks;
6. continue only after the file returns below the threshold.

Do not postpone obvious decomposition until later cleanup.

---

## 17. AI Agent Workflow

Every frontend implementation task must follow:

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

Before implementation, the agent must state:

- task objective;
- page or feature scope;
- existing files read;
- component tree;
- files to create;
- files to modify;
- state ownership;
- API endpoints used;
- client/server boundaries;
- expected line counts;
- deferred items.

After implementation, the agent must report:

- actual changed files;
- actual line counts;
- components extracted;
- largest maintained file;
- Client Components created;
- API calls added;
- design tokens used;
- responsive states verified;
- accessibility checks;
- TypeScript result;
- ESLint result;
- Build result;
- tests;
- worktree status;
- commit and push status.

---

## 18. Verification Gates

Minimum gates for each frontend checkpoint:

```text
TypeScript diagnostics: 0
ESLint errors: 0
ESLint warnings: 0
Next build: PASS
No unexpected files
No secret exposure
No file above hard limit
No function above hard limit
No route-level god component
No broad "use client" boundary
```

---

## 19. Initial Implementation Sequence

1. Freeze product route contract.
2. Freeze design system.
3. Freeze frontend system design.
4. Scaffold Next.js.
5. Configure Tailwind and tokens.
6. Configure shadcn/ui.
7. Install TasteSkill project-locally.
8. Create `/dev/design-system`.
9. Build app shells.
10. Implement Auth vertical slice.
11. Implement Pet profile.
12. Implement Workspace list.
13. Implement Craft Canvas.
14. Implement Discovery Detail.
15. Implement Graph View.
16. Implement Simulation.
17. Implement Admin Content.
18. Add static Plans page.
19. Defer Community and Payment.

---

## Decision

The FinCraft Lab frontend must be designed for auditability, not only visual polish.

> **Break large UI by responsibility before it becomes difficult to understand, test, or safely modify.**
