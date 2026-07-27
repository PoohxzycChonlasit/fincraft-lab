# FinCraft Lab — Frontend System Design

## System Architecture Overview

The FinCraft Lab frontend is built using Next.js App Router (React 19) with strict TypeScript, Tailwind CSS v4, shadcn/ui, and specialized domain libraries.

The application enforces Server Components by default, restricting Client Component boundaries (`"use client"`) to small, interactive islands.

Visual design is governed by **FinCraft Design System V2 (Paper-and-Glass Hybrid)** (`docs/architecture/FRONTEND_DESIGN_SYSTEM_V2_DECISION.md`), combining 100% opaque reading surfaces with translucent floating tool islands and Cookie-authoritative Light/Dark/System theme resolution.

---

## Canonical Stack & Boundaries

| Concern | Technology / Library | Policy & Constraints |
|---|---|---|
| Framework | Next.js App Router | React 19, Server Components default |
| Type System | TypeScript | Strict mode enabled, zero `any` or `@ts-ignore` |
| Styling | Tailwind CSS v4 | CSS variables for tokens, no inline magic values |
| UI Primitives | shadcn/ui | Radix UI primitives, localized in `src/components/ui` |
| Icons | Lucide React | Single icon library across entire project |
| Form Validation | React Hook Form + Zod | Strict schema validation before API submission |
| Server State | TanStack Query | Caching, invalidation, loading/error states |
| Canvas State | Zustand | Local workspace canvas node/viewport state |
| Interactive Canvas | React Flow (`@xyflow/react`) | Future bounded Client island for Craft/Discovery graph rendering; no package install in this contract task |
| Data Visualization | Recharts | Simulation charts and financial projections |
| HTTP Transport | Native `fetch` | Typed wrapper, no Axios |
| Image Optimization | `next/image` | Configured domains, mandatory alt attributes |
| Design System V2 | Paper-and-Glass Hybrid | 7 surface roles, Cookie-authoritative theme persistence, WCAG 2.2 AA target |
| Visual Review | TasteSkill | Supplemental future guardrail; not installed or used in this contract task |

### Package Version Policy

All packages use the latest stable compatible version at install/update time (`latest` dist-tag on npm).
Prereleases are forbidden without explicit Owner authorization.
Major-version upgrades require a compatibility probe (peers check → typecheck → lint → source-limits → build → runtime) before acceptance.
Revert and report `BLOCKED_COMPATIBILITY_EXCEPTION_REQUIRED` if any gate fails.
Node runtime: Active LTS channel only. `@types/node` must align to the actual runtime major.
All resolved versions are recorded in `package.json` and `pnpm-lock.yaml`. No floating upgrades.
Upgrades occur only in authorized bounded tasks.

---

## Folder Architecture & Import Boundaries

```text
src/
├── app/                  # Routes, layouts, route handlers, server metadata
│   ├── (marketing)/      # Public landing, demo, plans
│   ├── (auth)/           # Login, register
│   ├── (app)/            # Workspaces, pet, graph, simulation, profile
│   └── admin/            # Protected admin content management
├── components/
│   ├── ui/               # Generic shadcn primitives (Button, Input, Dialog)
│   └── brand/            # Reusable FinCraft UI (Logo, Mochi, CraftEquation)
├── features/             # Feature domain modules (components, api, hooks, schemas, types)
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
├── lib/                  # Cross-cutting infrastructure (api-client, query, env, auth-cookies)
├── hooks/                # Global custom hooks
├── styles/               # Global CSS, Tailwind v4 theme configuration
└── types/                # Global type definitions
```

### Import Boundary Rules

```text
app
 ↓
features
 ↓
brand
 ↓
ui
```

Infrastructure Layer: `app` / `features` → `lib`.

### Forbidden Imports
- `ui` must NEVER import `brand` or `features`.
- `brand` must NEVER import feature internals.
- A feature module must NEVER import private internal files from another feature module.
- `lib` must NEVER import feature UI.
- No circular dependencies across any directory.

---

## State Ownership Matrix

| State Type | State Owner | Management Strategy |
|---|---|---|
| Server Data | Server Components / TanStack Query | HTTP fetch, query key invalidation |
| Form Input Values | React Hook Form + Zod | Local form state, client validation |
| Canvas Node & Viewport | Zustand (`useCanvasStore`) | Transient canvas dragging, node positioning |
| Modal & Sheet Open State | Local Component State (`useState`) | Component-scoped open/close boolean |
| Active Filters & Tabs | URL Search Params (`useSearchParams`) | Shareable, bookmarkable URL state |
| Auth Access Token | HttpOnly Cookie + Next Server Boundary | Secure cookie transport, no `localStorage` |
| Active Theme Preference | Cookie (`fincraft_theme`) + CSS Variables | Cookie-authoritative for SSR, RootLayout server inspection, inline `<head>` script for system mode. No `localStorage` authority |

---

## HTTP Transport & API Client Architecture

All backend requests use a unified, typed native `fetch` client located at `src/lib/api/api-client.ts`.

### Transport Characteristics
1. **Response Envelope**: Backend returns `{ data: T }`. The API client automatically unwraps or types this envelope.
2. **Error Normalization**: Non-2xx HTTP responses parse backend error responses into an `ApiError` instance with `statusCode`, `message`, and validation `errors`.
3. **Authentication**: Auth tokens are attached via HttpOnly cookie or Bearer Authorization header at the Next.js server boundary. JWT access tokens are NEVER stored in browser `localStorage`.

### Endpoint Adapters Structure
```text
src/features/elements/api/elements.api.ts
src/features/craft/api/craft.api.ts
src/features/workspace/api/workspace.api.ts
```

UI components do NOT invoke raw `fetch` directly. They consume feature-level API adapters or TanStack Query hooks.

---

## Server & Client Component Strategy

1. **Server Component Default**: All `page.tsx` files and major layout sections are Server Components.
2. **Bounded Client Components**: Add `"use client"` ONLY to leaf components or isolated interactive islands that require:
   - Interactive events (`onClick`, `onDragEnd`);
   - Form controls (React Hook Form);
   - React Flow canvas instance;
   - Zustand store hooks;
   - Browser APIs (`window`, `localStorage` if needed).

---

## File Size & Decomposition Contract

| Target File Type | Preferred Line Count | Review Threshold | Hard Line Ceiling |
|---|---:|---:|---:|
| Route `page.tsx` / Layout | ≤ 120 lines | > 160 lines | 220 lines |
| Feature Component | ≤ 140 lines | > 180 lines | 240 lines |
| Complex Interactive Component | ≤ 180 lines | > 220 lines | 280 lines |
| Hook / API / Mapper / Schema | ≤ 100 lines | > 130 lines | 180 lines |
| Zustand Store | ≤ 140 lines | > 180 lines | 240 lines |
| Maintained Test File | ≤ 180 lines | > 240 lines | 300 lines |

### Hard Ceilings
- **Absolute Maintained File Limit**: **300 physical lines**. Any maintained file approaching 250 lines must be reviewed and refactored before adding features.
- **Function Ceiling**: Preferred ≤ 30 lines; Hard limit: 60 lines.
- **JSX Return Ceiling**: Preferred ≤ 60 lines; Hard limit: 120 lines.

---

## Error & Loading Boundaries

Every main app feature route defines:
1. `loading.tsx`: Skeleton loader for initial Server Component streaming.
2. `error.tsx`: React error boundary providing a friendly error message and reset action.
3. `not-found.tsx`: 404 page when a resource (e.g. element or workspace ID) does not exist.

## Discovery Web architecture contract

The Discovery Web is a supporting feature. Craft remains the primary product interaction. The user-facing route `/graph` is **My Discovery Web**, classified as `MVP_SUPPORTING_FEATURE` and `BLOCKED_BY_READ_API` until a bounded graph read contract exists.

### Data layers

Keep these layers separate in API mapping, state, visual language, and accessibility text:

1. **Canonical knowledge:** reviewed/admin-authored `ElementRelationship` content with source and explanation; never user-editable.
2. **Recipe provenance:** `CraftRecipe` and `CraftRecipeInput`; input points to output and never means real-world causality.
3. **Personal discovery:** `UserElement` and `DiscoveryEvent`; progress and history, not universal truth.
4. **Workspace:** `WorkspaceNode` and `WorkspaceEdge`; user arrangement and My link data, labelled Personal and never merged into canonical truth.

The existing 15-model ERD is sufficient for proposed MVP derivation. No new model or enum is introduced by this contract.

### Route and rendering boundaries

- `page.tsx` and route composition remain Server Components by default.
- A future React Flow graph is a bounded Client Component island only after a separately authorized package task.
- The text relationship panel and ordered relationship list are the canonical accessible representation; graph rendering is an enhancement.
- Graph payloads must be spoiler-filtered server-side. Undiscovered names, relationships, outputs, ingredients, topology, counts, and identities must be absent from payload, DOM, accessibility text, search suggestions, URLs, filter counts, and error messages.
- Canonical data remains Server Component/API or TanStack Query data. Viewport and selection are transient client state and must not become a second source of truth.
- There are no permanent frontend Graph mocks, client-side recipe derivations, Prisma queries, or guessed Graph DTOs.
- Workspace Connections stays inside the existing workspace route/domain and uses the existing canvas snapshot authority; it is not canonical relationship mutation.

### Relationship and list contract

The approved future relationship families are `CRAFTED_FROM` recipe provenance, `SUPPORTS`, `REDUCES`, `TRADE_OFF_WITH`, and `RELATED_TO` canonical relationships, plus `PERSONAL_LINK`. `CAUSES` is deferred. The UI uses “Crafts into”, “Made from”, and “May reduce” where those readings apply, with source/explanation and Personal markers where required.

Discovery Detail is list-first and may contain Made From, Can Lead To, Related Concepts, Trade-offs, Appears In My Workspaces, and Discovery History. Concept Orbit is a bounded depth-one enhancement. On mobile, list precedes Orbit, details use a bottom sheet, filters use a separate sheet, and sheets are not stacked.

### Performance and layout contract

- Rendering is 2D only; no Three.js, WebGL, 3D, particles, animated edges, continuous force simulation, perpetual layout calculation, continuously animated gradients, large blur layers, video backgrounds, or decorative infinite loops.
- Positions remain static between structural changes. Layout runs only after load, expand, collapse, filter, mode change, or explicit re-layout.
- Nodes, edge types, options, and callbacks are memoized where stable; components subscribe to narrow state selectors.
- Concept Orbit starts at depth one with deterministic radial placement and no new layout package.
- Dagre is optional only after a separately authorized, evidence-based package task.
- Initial unverified budgets are 24/36 desktop and 12/18 mobile for My Discovery Web, with maxima of 56/96 desktop and 28/44 mobile. Concept Orbit defaults to one focus plus up to eight desktop neighbours or five mobile neighbours. The Workspace backend limit remains 100 nodes/200 edges.
- Budgets are product starting points, not measured guarantees. Future implementation must profile real content before treating them as proven.
- Reduced-motion mode removes non-essential movement and leaves all graph/list meaning available in text.

### Component and file decomposition

Future graph code follows responsibility boundaries:

```text
features/graph/
├── api/              # typed read adapters after backend contract exists
├── components/       # list, canvas island, inspector, legend
├── mappers/          # authorized DTO to view model mapping
├── policies/         # spoiler and layer visibility rules
├── types/            # feature-local graph contracts
└── hooks/            # bounded client interaction state only
```

The route composes these pieces; it does not own fetching, spoiler filtering, graph layout, or a large presentation tree. The accessible list and graph share the same filtered view model.
