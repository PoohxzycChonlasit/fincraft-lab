# FinCraft Lab — Frontend System Design

## System Architecture Overview

The FinCraft Lab frontend is built using Next.js App Router (React 19) with strict TypeScript, Tailwind CSS v4, shadcn/ui, and specialized domain libraries.

The application enforces Server Components by default, restricting Client Component boundaries (`"use client"`) to small, interactive islands.

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
| Interactive Canvas | React Flow (`@xyflow/react`) | Craft Canvas and Knowledge Graph rendering |
| Data Visualization | Recharts | Simulation charts and financial projections |
| HTTP Transport | Native `fetch` | Typed wrapper, no Axios |
| Image Optimization | `next/image` | Configured domains, mandatory alt attributes |
| Visual Review | TasteSkill | Supplemental visual guardrail |

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
| Design Theme Tokens | CSS Variables | Root CSS token definitions |

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
