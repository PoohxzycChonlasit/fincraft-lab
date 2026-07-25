# FinCraft Lab — Frontend Route Contract

## Purpose
Define the canonical route contract, access levels, layout boundaries, backend endpoint mappings, loading/empty/error states, responsive behaviors, and MVP status for all FinCraft Lab web application routes.

---

## Route Overview & Access Policy

| Proposed URL | Route Name | Access Level | Layout Boundary | MVP Status |
|---|---|---|---|---|
| `/` | Home | Public | Marketing Layout | Implemented MVP |
| `/demo` | Demo / Sandbox | Public | Marketing Layout | Implemented MVP |
| `/login` | Login | Public | Auth Layout | Implemented MVP |
| `/register` | Register | Public | Auth Layout | Implemented MVP |
| `/plans` | Pricing / Plans | Public | Marketing Layout | Static / Mock Only |
| `/pet/setup` | Pet Initial Setup | Protected (User) | App Layout | Implemented MVP |
| `/pet` | Pet Profile | Protected (User) | App Layout | Implemented MVP |
| `/workspaces` | Workspace List | Protected (User) | App Layout | Implemented MVP |
| `/workspaces/[workspaceId]` | Craft Lab Workspace | Protected (User) | Fullscreen Lab Layout | Implemented MVP |
| `/discovery/[elementId]` | Discovery Detail | Protected (User) | App Layout | Implemented MVP |
| `/graph` | Knowledge Graph View | Protected (User) | Fullscreen Lab Layout | Implemented MVP |
| `/simulation` | Financial Simulation | Protected (User) | App Layout | Implemented MVP |
| `/profile` | User Account Profile | Protected (User) | App Layout | Implemented MVP |
| `/admin/elements` | Admin Elements Management | Protected (Admin) | Admin Layout | Implemented MVP |
| `/admin/elements/[elementId]` | Admin Element Editor | Protected (Admin) | Admin Layout | Implemented MVP |
| `/admin/elements/[elementId]/detail` | Admin Discovery Detail Editor | Protected (Admin) | Admin Layout | Implemented MVP |
| `/community/*` | Community & Social Feed | Deferred | N/A | Deferred (Post-MVP) |
| `/checkout` | Payment & Subscription Checkout | Out of Scope | N/A | Out of Scope |

---

## Detailed Route Specifications

### 1. Home (`/`)
- **Purpose**: Marketing landing page introducing FinCraft Lab, core concept discovery, educational disclaimers, and primary call to action.
- **Access Level**: Public
- **Layout**: Marketing Layout (Header navigation, Footer, EducationDisclaimer banner)
- **Backend Endpoints**: `GET /health` (status indicator), static marketing copy.
- **Data Dependencies**: Public service health status.
- **Loading State**: Skeleton hero banner and category preview cards.
- **Empty State**: N/A (Static marketing content).
- **Error State**: Non-blocking toast if health check fails; fallback to static presentation.
- **Desktop Behavior**: Full-width hero section, interactive category grid, feature highlights, single prominent "Start Discovering" CTA.
- **Mobile Behavior**: Single-column stacked sections, collapsible navigation drawer, full-width touch CTA.
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: Live user count telemetry, social proof feeds.

### 2. Demo (`/demo`)
- **Purpose**: Interactive sandbox allowing guest visitors to experience starter element crafting without creating an account.
- **Access Level**: Public
- **Layout**: Marketing Layout
- **Backend Endpoints**: `GET /health` (no account creation required). Local state / mock starter elements.
- **Data Dependencies**: Starter element definitions (Income, Expense, Savings, Debt).
- **Loading State**: Canvas loading skeleton.
- **Empty State**: Empty Canvas state with "Drag two elements together" guidance.
- **Error State**: Local error banner with reset button.
- **Desktop Behavior**: 3-column interactive layout (Vault, Canvas, Discovery Drawer).
- **Mobile Behavior**: Single active panel with tab switcher (Vault / Canvas / Discovery Sheet).
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: Cloud saving of guest recipes.

### 3. Login (`/login`)
- **Purpose**: Authenticate existing users via email and password credentials.
- **Access Level**: Public (Redirects to `/workspaces` if already authenticated)
- **Layout**: Auth Layout (Centered card, minimal background laboratory branding)
- **Backend Endpoints**: `POST /auth/login`
- **Data Dependencies**: Form credentials (email, password).
- **Loading State**: Form submit button spinner and disabled input fields.
- **Empty State**: Clean form input fields with inline client validation.
- **Error State**: Alert message for invalid credentials (HTTP 401) or disabled account (HTTP 403).
- **Desktop Behavior**: Centered auth card with Mochi educational tip on the side.
- **Mobile Behavior**: Full-width mobile form card with sticky submit button.
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: OAuth 2.0 social logins, magic links.

### 4. Register (`/register`)
- **Purpose**: Register a new user account with email, password, and display name.
- **Access Level**: Public (Redirects to `/workspaces` if already authenticated)
- **Layout**: Auth Layout
- **Backend Endpoints**: `POST /auth/register`
- **Data Dependencies**: Registration form inputs.
- **Loading State**: Submit button loading spinner.
- **Empty State**: Clean registration form.
- **Error State**: Field-level inline errors (e.g. email already registered HTTP 409).
- **Desktop Behavior**: 2-column layout (Registration form + Mochi welcome visual).
- **Mobile Behavior**: Stacked single-column registration form.
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: Email verification workflow.

### 5. Plans (`/plans`)
- **Purpose**: Educational overview of free vs premium feature tiers.
- **Access Level**: Public
- **Layout**: Marketing Layout
- **Backend Endpoints**: None (Static UI contract only).
- **Data Dependencies**: Static plan comparison data.
- **Loading State**: N/A
- **Empty State**: N/A
- **Error State**: N/A
- **Desktop Behavior**: 3-tier pricing card comparison table with static "Current Plan (Free)" badge.
- **Mobile Behavior**: Vertical stack of plan cards with active tab selector.
- **MVP Status**: Static / Mock Only (No payment processing).
- **Deferred Behavior**: Stripe checkout integration, subscription billing portal.

### 6. Pet Setup & Profile (`/pet/setup`, `/pet`)
- **Purpose**: Setup learning pet companion (name, species, goal) and view companion status.
- **Access Level**: Protected (User)
- **Layout**: App Layout (App Header, Sidebar)
- **Backend Endpoints**: `GET /pet`, `POST /pet`, `PATCH /pet`
- **Data Dependencies**: Authenticated user identity, Pet entity.
- **Loading State**: Pet avatar and profile skeleton.
- **Empty State**: Onboarding setup prompt when no pet exists.
- **Error State**: Toast error on save failure with retry.
- **Desktop Behavior**: Interactive pet selection grid + personality customization panel.
- **Mobile Behavior**: Stepper form with full-width species selection cards.
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: Pet accessories shop, pet hunger/happiness decay algorithms.

### 7. Workspace List (`/workspaces`)
- **Purpose**: View, create, rename, and archive user financial discovery workspaces.
- **Access Level**: Protected (User)
- **Layout**: App Layout
- **Backend Endpoints**: `GET /workspaces`, `POST /workspaces`, `PATCH /workspaces/[id]`, `DELETE /workspaces/[id]`
- **Data Dependencies**: User workspace list.
- **Loading State**: Workspace card grid skeletons (3x2).
- **Empty State**: `EmptyLabState` component with "Create Your First Workspace" action.
- **Error State**: Full-page error boundary with retry button.
- **Desktop Behavior**: 3-column grid of workspace cards with dropdown actions.
- **Mobile Behavior**: Single-column card list with bottom sheet action menu.
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: Collaborative workspace sharing, multi-user real-time editing.

### 8. Craft Lab Workspace (`/workspaces/[workspaceId]`)
- **Purpose**: Core interactive Crafting Canvas where users drag elements from Knowledge Vault onto Canvas, combine inputs to discover new concepts, and view Discovery Details.
- **Access Level**: Protected (User)
- **Layout**: Fullscreen Lab Layout (Maximized workspace, collapsible panels)
- **Backend Endpoints**: `GET /workspaces/[id]`, `GET /elements/unlocked`, `POST /craft`, `POST /workspaces/[id]/nodes`, `PUT /workspaces/[id]/nodes/[nodeId]`
- **Data Dependencies**: Workspace canvas nodes/edges, unlocked user elements, recipe combinations.
- **Loading State**: Fullscreen canvas spinner with Mochi tips.
- **Empty State**: Canvas placeholder with drop target indicators.
- **Error State**: Non-blocking toast notification if craft recipe produces no match (HTTP 400/404).
- **Desktop Behavior**: Left panel (Knowledge Vault search & elements), Center (Interactive React Flow Canvas), Right panel (Discovery Detail inspector).
- **Mobile Behavior**: Full-width Canvas with bottom sheet for Knowledge Vault and sliding drawer for Discovery Details.
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: Multi-select bulk node grouping, custom canvas background themes.

### 9. Discovery Detail (`/discovery/[elementId]`)
- **Purpose**: Deep-dive educational view for unlocked financial elements showing real-world lessons, trade-offs, hidden risks, reality level, and safety disclaimers.
- **Access Level**: Protected (User)
- **Layout**: App Layout
- **Backend Endpoints**: `GET /elements/[elementId]/detail`, `GET /elements/[elementId]`
- **Data Dependencies**: DiscoveryDetail entity, Element relationships.
- **Loading State**: Detail article skeleton loader.
- **Empty State**: Locked state card with hint on how to discover this element.
- **Error State**: HTTP 404 element not found card with link back to Knowledge Vault.
- **Desktop Behavior**: 2-column layout (Left: Element badge, category, short desc, safety label; Right: Structured trade-offs, works when/difficult when, sources).
- **Mobile Behavior**: Single-column scrolling article view with sticky table of contents header.
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: Community user discussions, user ratings on difficulty.

### 10. Knowledge Graph View (`/graph`)
- **Purpose**: Visualize interconnected relationships between unlocked financial concepts, base elements, and risks.
- **Access Level**: Protected (User)
- **Layout**: Fullscreen Lab Layout
- **Backend Endpoints**: `GET /elements/graph`, `GET /elements/unlocked`
- **Data Dependencies**: Element relationships graph nodes and links.
- **Loading State**: Force-directed graph physics initialization spinner.
- **Empty State**: Graph empty state encouraging element discovery in Craft Lab.
- **Error State**: Graph rendering fallback alert.
- **Desktop Behavior**: Interactive React Flow graph with zoom/pan controls, category filter pills, node click detail preview.
- **Mobile Behavior**: Touch-optimized graph canvas with bottom node summary sheet.
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: 3D graph visualization, custom node color overrides.

### 11. Financial Simulation (`/simulation`)
- **Purpose**: Run financial scenarios (e.g. Emergency Fund Survival Months) by adjusting input parameters and visualizing timeline outcomes, risks, and insights.
- **Access Level**: Protected (User)
- **Layout**: App Layout
- **Backend Endpoints**: `GET /simulations`, `POST /simulations/[id]/run`
- **Data Dependencies**: Simulation master config, user input parameters.
- **Loading State**: Chart calculation shimmer and calculation spinner.
- **Empty State**: Default initial input parameter values pre-populated.
- **Error State**: Input validation error summary above slider controls.
- **Desktop Behavior**: 2-column layout (Left: Input controls panel; Right: Recharts timeline, milestone indicators, key lessons, risk meter).
- **Mobile Behavior**: Tabbed layout (Tab 1: Inputs, Tab 2: Results & Chart, Tab 3: Insights).
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: Monte Carlo stochastic simulations, export PDF reports.

### 12. User Profile (`/profile`)
- **Purpose**: Manage account details, display name, avatar, view unlocked discovery statistics, and security options.
- **Access Level**: Protected (User)
- **Layout**: App Layout
- **Backend Endpoints**: `GET /auth/me`, `PATCH /user/profile`
- **Data Dependencies**: User account profile, discovery progress stats.
- **Loading State**: Profile form skeleton.
- **Empty State**: N/A
- **Error State**: Profile update error toast.
- **Desktop Behavior**: Side tabs for Profile, Learning Stats, Security.
- **Mobile Behavior**: Vertical stacked sections.
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: Two-factor authentication (2FA).

### 13. Admin Elements Management (`/admin/elements`, `/admin/elements/[elementId]`)
- **Purpose**: Admin content management interface for reviewing, creating, updating elements, and editing Discovery Details.
- **Access Level**: Protected (Admin / Super Admin)
- **Layout**: Admin Layout (Sidebar with admin badge, restricted navigation)
- **Backend Endpoints**: `GET /admin/elements`, `GET /admin/elements/[id]`, `POST /admin/elements`, `PATCH /admin/elements/[id]`, `PUT /admin/elements/[id]/detail`
- **Data Dependencies**: Admin element list, ContentStatus filters.
- **Loading State**: Admin data table skeleton loader.
- **Empty State**: No elements matching selected status filter.
- **Error State**: Forbidden HTTP 403 banner for non-admin accounts.
- **Desktop Behavior**: Filter bar, paginated data table with status badges, side sheet editor.
- **Mobile Behavior**: Warning banner recommending desktop viewport for admin operations.
- **MVP Status**: Implemented MVP
- **Deferred Behavior**: Bulk CSV import/export, automated AI content translation.

---

## Explicit Scope Boundaries

### Deferred Features (Post-MVP)
- Community feed, user posts, recipe likes, comments, user follows, creator profiles, community challenges.
- Real-time multiplayer canvas collaboration.

### Out of Scope Features
- Payment gateway integration, credit card processing, subscription billing APIs.
- Real financial advice, live bank account connections (Plaid/Yodlee), actual investment execution.
