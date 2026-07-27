# FinCraft Design System V2 — Canonical Decision Record

## Executive Summary

- **Status:** APPROVED CANONICAL DECISION RECORD
- **Date:** 2026-07-27 (Asia/Bangkok)
- **Task ID:** `P13_FRONTEND_FOUNDATION_1D4_OWNER_DESIGN_SYSTEM_V2_DECISION_001`
- **Research Basis:** Supported by research documents `docs/research/DESIGN_SYSTEM_V2_GAP_ANALYSIS.md`, `LIQUID_MATERIAL_AND_LIFTED_SURFACE_RESEARCH.md`, `DARK_MODE_THEME_AND_ACCESSIBILITY_RESEARCH.md`, and `DESIGN_SYSTEM_V2_OPTIONS_AND_RECOMMENDATION.md`.
- **Decision Scope:** Freeze Owner-approved Design System V2 direction, theme architecture, material policies, and implementation sequence.

```text
===================================================================================
REQUIRED FORMAL CONTRACT STATEMENTS
===================================================================================
SELECTED DIRECTION:        FinCraft Paper-and-Glass Hybrid
CANONICAL STATUS:          Direction and principles frozen.
FINAL LIGHT/DARK HEX VALUES: Not frozen. (Candidate values require contrast prototype)
WCAG CONFORMANCE:          Not yet evaluated. (Designed toward WCAG 2.2 Level AA)
PRODUCT UI AUTHORIZATION:  Not granted by this decision.
===================================================================================
```

---

## Owner Decisions Summary

The Owner has formally reviewed the research capsule and selected **Option C: FinCraft Paper-and-Glass Hybrid** as the canonical Design System V2 direction.

```text
+---------------------------------------------------------------------------------------------------+
| OWNER DECISION DOMAIN      | APPROVED CANONICAL POLICY                                            |
+----------------------------+----------------------------------------------------------------------+
| Visual Direction           | OPTION_C_FINCRAFT_PAPER_AND_GLASS_HYBRID                            |
| Theme Modes                | LIGHT_DARK_SYSTEM (light | dark | system)                             |
| Theme Persistence          | COOKIE_AUTHORITATIVE ('fincraft_theme')                              |
| LocalStorage Theme Auth    | NO — LocalStorage is not a second source of truth                     |
| Content Material           | OPAQUE_WARM_PAPER_LIKE (Solid 100% reading content)                  |
| Grouped Learning Surfaces  | OPAQUE_BY_DEFAULT (Solid 100% wells, inputs, lists)                  |
| Interactive Controls       | LIFTED_TACTILE_MATERIAL (Top specular highlight + dual-tone stroke)  |
| Translucency Policy        | BOUNDED_FLOATING_AND_OVERLAY_ROLES_ONLY (Floating tool islands only) |
| Graph Nodes                | OPAQUE_BY_DEFAULT                                                    |
| Simulation Data & Charts   | OPAQUE_BY_DEFAULT                                                    |
| Admin Data Tables          | OPAQUE_BY_DEFAULT                                                    |
| Touch Target Standard      | 44x44_CSS_PX_FINCRAFT_PREFERRED_TARGET                               |
| WCAG AA Target Size Ref.   | 24x24_CSS_PX_WITH_DOCUMENTED_EXCEPTIONS (Level AA Baseline)          |
| Dark Palette Hex Values    | CANDIDATE_ONLY_UNTIL_CONTRAST_PROTOTYPE                              |
| Apple Boundary             | GENERAL_PRINCIPLES_REFERENCE_ONLY (Quality & depth hierarchy only)  |
| Kigen Boundary             | VISUAL_QUALITY_REFERENCE_ONLY (Control anatomy & label rhythm only)  |
+---------------------------------------------------------------------------------------------------+
```

---

## Canonical Visual Direction: Paper-and-Glass Hybrid

FinCraft Design System V2 synthesizes **editorial reading legibility** with **tactile tool sophistication**:

1. **Flat Paper Reading Surfaces (90% of UI):** Educational lessons, trade-off explanations, financial disclaimers, data tables, and input forms use solid 100% opaque surfaces (`surface-flat`, `surface-card`, `surface-inset`). This guarantees maximum text contrast, high legibility, zero backdrop-filter rendering overhead, and crisp reading across desktop and mobile devices.
2. **Lifted Glass Control Islands (10% of UI):** Interactive toolbars, floating inspectors, popovers, sheet drawers, and Craft Canvas controls use tactile, lifted material surfaces (`surface-resting`, `surface-raised`, `surface-floating`). Floating tool panels earn subtle translucency (`background/92%` + `backdrop-filter: blur(8px)`) paired with dual-tone borders and static top inner specular highlights (`--highlight-inner`).

---

## Canonical Material & Surface Elevation Policy

FinCraft V2 freezes 7 explicit Surface Elevation Roles and 6 Edge Roles:

```text
+---------------------------------------------------------------------------------------------------------------------------------------+
| SURFACE ROLE     | PURPOSE                  | TRANSLUCENCY POLICY          | BORDER & INNER HIGHLIGHT     | SHADOW & ELEVATION     |
+------------------+--------------------------+------------------------------+------------------------------+------------------------+
| 1. Canvas        | Root lab background      | Solid Opaque [100%]          | None                         | None (0px)             |
| 2. Content       | Reading cards, documents | Solid Opaque [100%]          | var(--border-subtle)         | None / Flat            |
| 3. Grouped       | Sub-panels, list wells   | Solid Opaque [100%]          | var(--border-subtle)         | Inset 0 1px 2px rgb... |
| 4. Lifted        | Standard interactive card| Solid Opaque [100%]          | Dual-tone + Top Highlight    | var(--shadow-resting)  |
| 5. Selected      | Active node / craft item | Solid Opaque [100%]          | var(--border-selected)       | var(--shadow-raised)   |
| 6. Floating      | Inspector, popover, menu | Bounded Translucent [92%]    | var(--border-interactive)    | var(--shadow-floating) |
| 7. Overlay       | Dialogs, sheet drawers   | Bounded Translucent [96%]    | var(--border-interactive)    | 0 20px 30px -10px ...  |
+---------------------------------------------------------------------------------------------------------------------------------------+
```

### Translucency Boundary
- Translucency and backdrop blur (`backdrop-filter`) are permitted **ONLY on Bounded Floating (`surface-floating`) and Overlay (`surface-overlay`) roles**.
- Content, learning articles, inputs, graph nodes, simulation data, and admin tables **MUST remain solid opaque by default**.
- If a browser does not support `backdrop-filter` or `@media (prefers-reduced-transparency: reduce)` is active, floating surfaces automatically revert to 100% solid color fills (`var(--surface-card)`).

---

## Canonical Theme Architecture & Source of Truth

```text
+-----------------------------------------------------------------------------------+
| PREFERENCE VALUES          | light | dark | system                                |
| AUTHORITATIVE PERSISTENCE  | Cookie ('fincraft_theme')                            |
| SERVER BOUNDARY            | Next.js RootLayout inspects cookie via cookies()     |
| SYSTEM MODE RESOLUTION     | Client resolves prefers-color-scheme via <head> script|
| DUAL-PERSISTENCE BAN       | LocalStorage is NOT a second source of truth         |
+-----------------------------------------------------------------------------------+
```

- **Cookie Authority:** The `fincraft_theme` cookie is the sole authoritative persistence store. Because Next.js App Router renders on the server, reading the cookie during SSR allows RootLayout to output initial HTML with the correct `.dark` class, eliminating white flash (FOUC).
- **System Mode:** When preference is `system`, the server outputs neutral baseline HTML, and an inline script in `<head>` evaluates `window.matchMedia('(prefers-color-scheme: dark)')` synchronously before first DOM paint.
- **Implementation Deferred:** Final JavaScript code, exact cookie security flags, and client switcher hooks are deferred to the dedicated Theme Implementation task (`P13_FRONTEND_FOUNDATION_1D5`).

---

## 5-Layer Token Architecture

FinCraft V2 freezes a strict 5-Layer Token Architecture:

```text
Layer 1: Primitive Tokens  (--color-teal-600: #0D9488, --color-stone-900: #1C1917)
  │
  ▼
Layer 2: Semantic Tokens   (--color-action-primary, --color-text-primary)
  │
  ▼
Layer 3: Material/Surface  (--surface-resting, --surface-floating, --border-subtle)
  │
  ▼
Layer 4: Component Tokens  (--button-primary-bg, --card-background)
  │
  ▼
Layer 5: Component State   (--button-primary-hover-bg, --card-border-selected)
```

**Rule:** Product components MUST NOT use raw Layer 1 Primitive colors directly when an approved Layer 2 or Layer 3 Semantic Token exists. Candidate Dark Mode hex values remain research-only until verified by a contrast prototype.

---

## Accessibility & Target Size Policy

1. **FinCraft Primary Touch Target:** **44×44 CSS px preferred minimum** for primary interactive controls.
2. **WCAG Baseline Reference:** WCAG 2.2 SC 2.5.8 Target Size (Minimum) Level AA specifies **24×24 CSS px** (subject to documented spacing exceptions). The 44×44px target is a FinCraft product preference (aligning with Level AAA Enhanced guidelines), not the WCAG AA threshold.
3. **Accessibility Target:** Designed toward **W3C WCAG 2.2 Level AA**.
4. **Conformance Claim:** Conformance is **NOT YET EVALUATED**. Conformance can only be claimed after manual and automated testing on implemented components.

---

## Performance Boundaries

- **No WebGL, Three.js, or 3D engines.**
- **No canvas refraction or dynamic shaders.**
- **No full-page backdrop blur filters.**
- **No continuous material animations or glowing edge loops.**
- **No scroll-bound GPU effects.**
- **No background decoration timers.**
- Interaction feedback must be finite, event-driven (150ms fast, 250ms normal, 350ms slow), and fully functional under reduced motion (`@media (prefers-reduced-motion: reduce)`).

---

## Approved Implementation Sequence

To maintain architectural integrity, future Design System V2 work must follow this exact order:

```text
1. TOKEN_CONTRACT (P13_FRONTEND_FOUNDATION_1D5)
   - Define CSS variables for Light and Dark candidate pairs in globals.css.
   - Implement Cookie-authoritative theme switcher helper.

2. DESIGN_SYSTEM_LAB_THEME_AND_MATERIAL_PROTOTYPE (P13_FRONTEND_FOUNDATION_1D6)
   - Refactor /dev/design-system to render Light, Dark, and System modes.
   - Demonstrate Lifted Glass controls, dual-tone borders, and top specular highlights.

3. CONTRAST_ACCESSIBILITY_AND_PERFORMANCE_VALIDATION (P13_FRONTEND_FOUNDATION_1D7)
   - Perform empirical contrast measurements across all 11 color pairs.
   - Validate keyboard focus, touch targets, and browser profiling. Freeze final dark hex values.

4. SIGNATURE_COMPONENT_RECONCILIATION (P13_FRONTEND_FOUNDATION_1D8)
   - Reconcile Element Tile, Craft Bay, Discovery Stamp, Learning Tape, and Mochi Note.

5. PRODUCT_SHELL (P13_FRONTEND_FOUNDATION_1E1)
   - Build accessible Root Navigation and App Shell layout.

6. PRODUCT_PAGES (Phase 2+)
   - Begin Auth, Workspace, Craft Canvas, Discovery Detail, Simulation, and Admin UI.
```

---

## Rejected Alternatives

- **Full-page Neumorphism:** Rejected due to poor contrast, unreadable text bounds, and skeuomorphic visual noise.
- **Pure Translucent Glass Everywhere (Option B):** Rejected due to high mobile GPU rendering cost, background contrast risks on reading content, and battery drain.
- **LocalStorage Theme Authority:** Rejected due to SSR hydration mismatches and FOUC white flashes in Next.js App Router.
- **3D / WebGL Refraction Effects:** Permanently banned due to bundle weight, accessibility barriers, and mobile performance degradation.
