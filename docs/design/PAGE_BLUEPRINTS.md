# FinCraft Lab — Page Blueprints

## Blueprint Principles

Every page blueprint defines:
1. **Information Hierarchy**: Primary visual focus and secondary support regions.
2. **Primary Action**: The single main interactive goal of the screen.
3. **Component Tree**: Decomposition into small, single-purpose components.
4. **Server / Client Boundaries**: Clear separation between Server rendering and Client islands.
5. **Backend Data Dependencies**: Required endpoints.
6. **Responsive Collapse Strategy**: Layout adjustments across desktop, tablet, and mobile.
7. **States**: Loading, Empty, Error, and Accessibility provisions.

---

## 1. Home Page (`/`)

- **Information Hierarchy**: Hero banner → Concept Discovery Preview → Safety Disclaimer → Features → Footer.
- **Primary Action**: "Start Discovering" (Navigates to `/register` or `/workspaces`).
- **Component Tree**:
  ```text
  HomePage (Server Component)
  ├── MarketingHeader (Server Component)
  │   ├── FinCraftLogo (Brand)
  │   └── NavLinks (Client Component - Mobile Drawer)
  ├── HeroSection (Server Component)
  │   ├── HeroTitle & Subtitle (Server)
  │   └── PrimaryCTAButton (Client - Routing)
  ├── ConceptPreviewGrid (Server Component)
  │   └── CategoryCard (Brand)
  ├── EducationDisclaimerBanner (Brand - Static)
  └── MarketingFooter (Server Component)
  ```
- **Server/Client Boundaries**: Page and layout are Server Components. Only mobile drawer toggle and CTA navigation buttons use `"use client"`.
- **Backend Data**: `GET /health` (optional telemetry).
- **Responsive Collapse**: 3-column category grid on desktop → 1-column stack on mobile.
- **Accessibility**: Heading hierarchy (H1 → H2), high contrast hero text.

---

## 2. Demo Sandbox (`/demo`)

- **Information Hierarchy**: Demo Header → 3-Panel Lab Layout (Vault, Canvas, Discovery Preview).
- **Primary Action**: Drag & Combine 2 Starter Elements on Sandbox Canvas.
- **Component Tree**:
  ```text
  DemoPage (Server Component)
  └── DemoScreen (Client Component)
      ├── DemoHeader (Brand)
      ├── SandboxVault (Client)
      │   └── StarterElementItem (Brand)
      ├── SandboxCanvas (Client - React Flow)
      └── SandboxDiscoveryPanel (Client)
  ```
- **Server/Client Boundaries**: Sandbox interactive screen uses `"use client"`.
- **Backend Data**: None (Local mock starter data).
- **Responsive Collapse**: Desktop 3-panel split → Mobile 3-tab switcher (Vault / Canvas / Details).

---

## 3. Login Page (`/login`)

- **Information Hierarchy**: Header Branding → Auth Form Card → Footer Help Link.
- **Primary Action**: "Log In" Button.
- **Component Tree**:
  ```text
  LoginPage (Server Component)
  └── AuthCard (Brand Component)
      ├── AuthHeader (Brand)
      └── LoginForm (Client Component - RHF + Zod)
          ├── FormFields (UI Input, Label)
          └── SubmitButton (UI Button)
  ```
- **Server/Client Boundaries**: `LoginPage` is Server Component; `LoginForm` is Client Component.
- **Backend Data**: `POST /auth/login`.

---

## 4. Register Page (`/register`)

- **Information Hierarchy**: Welcome Title → Account Registration Form → Mochi Welcome Tip.
- **Primary Action**: "Create Free Account" Button.
- **Component Tree**:
  ```text
  RegisterPage (Server Component)
  └── AuthCard (Brand)
      ├── RegisterForm (Client Component - RHF + Zod)
      └── MochiGuide (Brand - Onboarding pose)
  ```
- **Server/Client Boundaries**: `RegisterForm` is Client Component.
- **Backend Data**: `POST /auth/register`.

---

## 5. Pet Setup & Profile (`/pet/setup`, `/pet`)

- **Information Hierarchy**: Companion Title → Species Selection Grid → Personality & Goal Form → Save CTA.
- **Primary Action**: "Confirm Pet Companion" Button.
- **Component Tree**:
  ```text
  PetSetupPage (Server Component)
  └── PetSetupScreen (Client Component)
      ├── SpeciesGrid (Client)
      │   └── SpeciesCard (Brand)
      └── PetForm (Client - RHF + Zod)
  ```
- **Backend Data**: `GET /pet`, `POST /pet`, `PATCH /pet`.

---

## 6. Workspace List (`/workspaces`)

- **Information Hierarchy**: Header & Action Bar → Workspace Card Grid → Create Modal.
- **Primary Action**: "Create New Workspace" Button.
- **Component Tree**:
  ```text
  WorkspacesPage (Server Component)
  ├── PageHeader (Server)
  │   └── CreateWorkspaceButton (Client)
  └── WorkspaceGrid (Server / Client)
      ├── WorkspaceCard (Client - Dropdown Menu)
      └── EmptyLabState (Brand - when zero workspaces exist)
  ```
- **Backend Data**: `GET /workspaces`, `POST /workspaces`, `DELETE /workspaces/[id]`.

---

## 7. Craft Lab Workspace (`/workspaces/[workspaceId]`)

- **Structure Contract**: `Knowledge Vault` → `Craft Canvas` → `Discovery Detail`.
- **Information Hierarchy**: Lab Toolbar → Left: Knowledge Vault → Center: Craft Canvas → Right: Discovery Detail Inspector.
- **Primary Action**: Combine two elements on Canvas to discover new concept.
- **Component Tree**:
  ```text
  CraftLabPage (Server Component)
  └── LabScreen (Client Component - Zustand Store)
      ├── LabToolbar (Client)
      │   ├── WorkspaceTitle (Client)
      │   └── CraftButton (Client)
      ├── KnowledgeVault (Client)
      │   ├── ElementCategoryFilter (Client)
      │   └── VaultElementList (Client)
      ├── CraftCanvas (Client - React Flow)
      │   ├── CanvasViewport (Client)
      │   ├── ElementCanvasNode (Client)
      │   └── CanvasEmptyState (Brand)
      └── DiscoveryPanel (Client - Slide-over Drawer)
          ├── DiscoveryHeader (Brand)
          ├── RealLesson (Client)
          └── TradeoffCard (Brand)
  ```
- **Server/Client Boundaries**: Page is Server Component; `LabScreen` and child canvas components are Client Components.
- **Backend Data**: `GET /workspaces/[id]`, `GET /elements/unlocked`, `POST /craft`.
- **Responsive Collapse**: Desktop 3-panel split view → Mobile full-screen Canvas with Knowledge Vault bottom sheet and Discovery Detail sliding sheet.
- **Constraint Rule**: Mochi is an educational guide ONLY; Mochi MUST NOT be a Recipe input on the Canvas.

---

## 8. Discovery Detail (`/discovery/[elementId]`)

- **Information Hierarchy**: Element Header Badge → Short Description → Real-World Lesson → Trade-offs & Hidden Risks → Safety Disclaimer.
- **Primary Action**: "Explore Related Craft Recipes".
- **Component Tree**:
  ```text
  DiscoveryDetailPage (Server Component)
  ├── DetailHeader (Server)
  │   ├── ElementBadge (Brand)
  │   └── ElementTitle (Server)
  ├── LessonSection (Server)
  ├── TradeoffGrid (Brand Component)
  │   ├── PossibleBenefitCard (Brand)
  │   ├── PossibleTradeoffCard (Brand)
  │   └── HiddenRiskCard (Brand)
  └── EducationDisclaimer (Brand)
  ```
- **Backend Data**: Supporting Element/detail/relationship read APIs are required but are not implemented in the inspected controllers.
- **Relationship Panel**: Show Made From, Can Lead To, Related Concepts, Trade-offs, Appears In My Workspaces, and Discovery History only from known, authorized data. The text/list representation is primary.
- **Concept Orbit**: Optional bounded depth-one enhancement after the supporting read API exists; it never replaces the article or relationship list.
- **Spoiler-safe states**: Loading shows article/list skeletons; empty states state that no known connection is available; errors keep the article and retry the relationship panel without naming hidden data.
- **Mobile**: Relationship list appears before Orbit. Details use a bottom sheet and filters use a separate sheet without stacking sheets.
- **Accessibility**: Each relation exposes direction, label, target, source/explanation where available, and canonical/personal status without relying on colour.

---

## 9. My Discovery Web (`/graph`)

- **Information Hierarchy**: Mode Header → Relationship List → Optional Bounded Graph Canvas → Node Inspector.
- **Primary Action**: Select a known concept and inspect its relationship meaning.
- **Component Tree**:
  ```text
  GraphPage (Server Component)
  └── DiscoveryWebScreen (Server composition)
      ├── GraphLayerLegend (Server/Brand)
      ├── RelationshipList (Server - canonical accessible view)
      ├── DiscoveryWebCanvas (Client - future bounded 2D island)
      └── DiscoveryWebInspector (Client - selection/details)
  ```
- **Backend Data**: Supporting graph read API is not implemented in the inspected controllers. Do not invent a DTO or permanent mock.

---

### My Discovery Web contract additions

- **Classification**: `MVP_SUPPORTING_FEATURE`; implementation readiness `BLOCKED_BY_READ_API`.
- **Information hierarchy**: Mode header -> relationship list -> optional bounded graph canvas -> inspector.
- **Canonical representation**: The synchronized text/list view is primary. Graph rendering is an enhancement and must never be the only way to access relationship meaning.
- **Data scope**: Starter and unlocked known content only. Canonical knowledge, recipe provenance, personal discovery, and workspace layers remain separate.
- **Spoiler-safe loading**: Render a static list-first skeleton and plain progress text; never use a force-directed initialization spinner or fake nodes.
- **Spoiler-safe empty/error**: Show known starter guidance or a known-concepts list with retry. Never expose hidden names, outputs, ingredients, topology, counts, or identities through the DOM, accessibility text, URL, filters, or errors.
- **Desktop**: Bounded 2D graph/list view with static positions, compact filters, selected-node inspector, and a synchronized semantic list.
- **Mobile**: Depth-one local view, graph/list toggle, 44px controls, filters in a separate sheet, and selected-node details in a bottom sheet. Do not stack sheets.
- **Performance**: Initial 24/36 desktop and 12/18 mobile; maximum 56/96 desktop and 28/44 mobile. Layout runs only after structural changes or explicit re-layout. No 3D/WebGL, continuous force, animated edges, or idle CPU work.
- **Component boundary**: The route stays a Server Component. RelationshipList and spoiler-safe states are Server Components; a future DiscoveryWebCanvas is a bounded Client Component island after a separately authorized package task.

## 10. Workspace Connections

- **Purpose**: Personal arrangement and user-authored links inside the existing workspace domain.
- **Terminology**: Use Workspace Connections, Personal, or My link. Internal code may use graph/canvas terminology when technically necessary.
- **Data boundary**: Use the existing WorkspaceNode/WorkspaceEdge canvas snapshot. Do not merge workspace edges into canonical knowledge relationships.
- **Responsive behavior**: Preserve the existing Vault -> Canvas -> Detail contract and provide touch-accessible controls plus a semantic node/link list on mobile.
- **Status**: Existing workspace domain; not a separate canonical Discovery Web route.

## 11. Explore Map (Post-MVP)

- **Purpose**: Future category-level exploration without revealing unknown Element names, recipes, or topology.
- **Status**: `POST_MVP`; no route or Product UI is authorized by this blueprint update.
- **Future rule**: Category/list structure remains primary, and any protected Admin preview must never share the user payload.

## 12. Financial Simulation (`/simulation`)

- **Structure Contract**: `Inputs` → `Results` → `Timeline` → `Insights`.
- **Information Hierarchy**: Scenario Header → Input Sliders → Recharts Result Chart → Timeline Milestones → Insight Takeaways.
- **Primary Action**: Adjust Input Sliders to recalculate timeline projection.
- **Component Tree**:
  ```text
  SimulationPage (Server Component)
  └── SimulationScreen (Client Component)
      ├── SimulationInputPanel (Client)
      │   ├── CashReserveSlider (Client)
      │   └── MonthlyExpenseSlider (Client)
      ├── SimulationResultsPanel (Client)
      │   ├── ResultSummary (Client)
      │   └── SimulationChart (Client - Recharts)
      └── InsightPanel (Client)
          ├── SurvivalMilestoneCard (Brand)
          └── SimulationInsightCard (Brand)
  ```
- **Backend Data**: `GET /simulations`, `POST /simulations/[id]/run`.

---

## 13. Profile Page (`/profile`)

- **Information Hierarchy**: User Avatar & Info → Learning Progress Stats → Account Settings Form.
- **Primary Action**: "Save Profile Changes".
- **Component Tree**:
  ```text
  ProfilePage (Server Component)
  ├── UserHeader (Server)
  └── ProfileForm (Client Component - RHF + Zod)
  ```
- **Backend Data**: `GET /auth/me`, `PATCH /user/profile`.

---

## 14. Admin Elements Management (`/admin/elements`)

- **Information Hierarchy**: Admin Bar → Filter Controls → Element Data Table → Edit Sheet.
- **Primary Action**: "Create New Element" / "Edit Discovery Detail".
- **Component Tree**:
  ```text
  AdminElementsPage (Server Component)
  └── AdminElementsScreen (Client Component)
      ├── FilterBar (Client)
      ├── AdminElementTable (Client - Data Table)
      └── ElementEditorSheet (Client)
  ```
- **Backend Data**: `GET /admin/elements`, `POST /admin/elements`, `PATCH /admin/elements/[id]`, `PUT /admin/elements/[id]/detail`.

---

## 15. Static Plans Page (`/plans`)

- **Information Hierarchy**: Header → Pricing Plan Grid → Tier Features → FAQ Accordion.
- **Primary Action**: Static "Current Plan (Free)" badge / Mock Upgrade interest button.
- **Component Tree**:
  ```text
  PlansPage (Server Component - Static)
  ├── PlanHeader (Server)
  ├── PlanGrid (Server)
  │   └── PlanCard (Server)
  └── FAQAccordion (Client - Primitive)
  ```
- **Backend Data**: None (Static UI contract).
