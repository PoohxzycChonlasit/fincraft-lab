# FinCraft Design System V2 — Dark Mode, Theme & Accessibility Research

## Executive Summary

- **Task ID:** `P13_FRONTEND_FOUNDATION_1D3B_DESIGN_SYSTEM_V2_RESEARCH_ACCURACY_AND_DECISION_READINESS_REPAIR_001`
- **Status:** RESEARCH AND THEME ARCHITECTURE PROPOSAL ONLY
- **Date:** 2026-07-27 (Asia/Bangkok)
- **Baseline HEAD:** `f9434d5391cc829a9358fcd36863675fbd8d8507`
- **Scope:** Bounded research document repair only. Zero source code changes; zero package installations; zero Product UI work.

This document defines the architecture for complete **Light, Dark, and System theme management** and accessibility compliance for FinCraft Design System V2. 

FinCraft is a light-first educational product, but modern UI standards and user accessibility require robust Dark Mode support. The theme system must operate seamlessly in Next.js App Router, eliminating the "Flash of Unstyled/Wrong Content" (FOUC), supporting OS media queries (`prefers-color-scheme`), and adhering to strict W3C WCAG 2.2 Level AA contrast requirements.

---

## Theme Architecture & Resolution Pipeline

### 1. Theme Preference Values
- `light`: Explicit Light mode override.
- `dark`: Explicit Dark mode override.
- `system`: Tracks operating system preference via `@media (prefers-color-scheme: dark | light)`.

### 2. Single Authoritative Persistence (Cookie-Authoritative)
To eliminate dual-authority bugs and competing state values, **Cookie (`fincraft_theme`) is established as the SINGLE AUTHORITATIVE PERSISTENCE STORE**.

```text
+-----------------------------------------------------------------------------------+
| RESOLUTION STEP  | SOURCE                       | RESULTING THEME MODE            |
+------------------+------------------------------+---------------------------------+
| Step 1           | Cookie ('fincraft_theme')    | If 'light' or 'dark' -> Apply   |
|                  | (Inspected on Next.js Server)| If 'system' or NULL -> Go to 2  |
+------------------+------------------------------+---------------------------------+
| Step 2           | Browser OS Preference        | If matches 'dark' -> Apply Dark |
|                  | (prefers-color-scheme)       | If matches 'light' -> Apply Light|
+------------------+------------------------------+---------------------------------+
| Step 3           | Application Default          | Fallback -> Light Mode          |
+-----------------------------------------------------------------------------------+
```

- **Why LocalStorage is Excluded:** `localStorage` cannot be read on the server during Next.js SSR. Relying on `localStorage` alongside cookies introduces competing sources of truth, leading to hydration mismatches and FOUC. Using Cookie as the sole store guarantees both server and client agree on theme state.

---

## Safe Next.js SSR & Anti-FOUC (No-Flash) Hydration Architecture

To prevent a white flash when a dark-mode user reloads a page rendered by Next.js App Router, FinCraft proposes a **Coherent 2-Tier Hydration Pattern**:

```text
+-----------------------------------------------------------------------------------+
| TIER 1: SERVER RENDERING (Next.js RootLayout)                                     |
| - Reads 'fincraft_theme' cookie via next/headers cookies().                       |
| - If cookie is 'dark', injects class="dark" and style="color-scheme: dark"        |
|   directly into initial <html> server response.                                  |
| - If cookie is 'system' or NULL, server renders baseline HTML WITHOUT forcing     |
|   an incorrect server guess. System awareness is handled by Tier 2.               |
+-----------------------------------------------------------------------------------+
| TIER 2: CLIENT HYDRATION & INLINE HEAD SCRIPT                                     |
| - When preference is 'system', an inline blocking script in <head> evaluates       |
|   window.matchMedia('(prefers-color-scheme: dark)') before DOM paint, toggling     |
|   the .dark class synchronously.                                                  |
| - Client theme switcher updates the document <html> class and sets the            |
|   'fincraft_theme' Cookie simultaneously.                                         |
+-----------------------------------------------------------------------------------+
```

### Key Hydration Rules
1. **Initial HTML Integrity:** Server HTML must NOT claim a resolved system appearance that the server cannot know.
2. **Inline Script Boundary:** An inline blocking script is recommended strictly when preference is `system` or cookie is absent, applying `.dark` before first paint. `suppressHydrationWarning` is NOT used as a primary solution; hydration structure must match.
3. **No-JS Fallback:** Native CSS uses `@media (prefers-color-scheme: dark)` overrides so that if JavaScript is disabled, the browser automatically applies Dark Mode CSS variables.
4. **Native Form Control Adaptation:** Setting `color-scheme: light dark` on `html` ensures browser scrollbars, form inputs, native selects, and date pickers automatically render dark chrome matching the app theme.
5. **Browser Chrome Hints:** `<meta name="theme-color" content="#FAFAF9" media="(prefers-color-scheme: light)">` and `<meta name="theme-color" content="#0C0A09" media="(prefers-color-scheme: dark)">` keep mobile browser header bars synchronized.

---

## Layered Token Architecture (5-Layer System)

FinCraft V2 organizes design tokens into 5 strict layers. **Components are forbidden from referencing Layer 1 Primitives directly when a Layer 2 or Layer 3 Semantic Token exists.**

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

---

## Candidate Dark Mode Values & Required Contrast Matrix

The proposed Dark Mode hex values (e.g. `#0C0A09`, `#1C1917`) are explicitly designated as **CANDIDATE EXPLORATION VALUES ONLY**. They are NOT canonical and NOT implementation-ready. They require empirical contrast measurement on an active prototype before freezing.

### Required Pre-Freeze Contrast Validation Matrix

Before freezing Dark Mode tokens, a contrast prototype must measure and verify WCAG 2.2 AA compliance across all 11 critical pairs:

```text
+-------------------------------------------------------------------------------------------------------------------+
| #  | CONTRAST PAIR COVERAGE | CANDIDATE LIGHT VALUE    | CANDIDATE DARK VALUE     | REQ. CONTRAST | TARGET STATUS   |
+----+------------------------+--------------------------+--------------------------+---------------+-----------------+
| 1  | Primary Text           | #1C1917 on #FFFFFF       | #F5F5F4 on #1C1917       | 4.5:1 (AA)    | Candidate Pair  |
| 2  | Secondary & Muted Text | #44403C on #FFFFFF       | #D6D3D1 on #1C1917       | 4.5:1 (AA)    | Candidate Pair  |
| 3  | Teal Interactive Content| #0D9488 on #FFFFFF      | #14B8A6 on #1C1917       | 4.5:1 (AA)    | Candidate Pair  |
| 4  | Orange Discovery Content| #EA580C on #FFFFFF      | #F97316 on #1C1917       | 4.5:1 (AA)    | Candidate Pair  |
| 5  | Danger / Error Content | #DC2626 on #FEF2F2       | #EF4444 on #2A1212       | 4.5:1 (AA)    | Candidate Pair  |
| 6  | Focus Ring vs Surface  | #0D9488 outline          | #14B8A6 outline          | 3.0:1 Non-txt | Candidate Pair  |
| 7  | Control Boundaries     | oklch(0.922 0 0)         | oklch(1 0 0 / 12%)       | 3.0:1 Non-txt | Candidate Pair  |
| 8  | Disabled Content       | #A8A29E on #F5F5F4       | #78716C on #262320       | 3.0:1 (Excep) | Candidate Pair  |
| 9  | Selected State Edge    | #EA580C on #FFFFFF       | #F97316 on #2E2A26       | 3.0:1 Non-txt | Candidate Pair  |
| 10 | Graph Relationship Line| #0D9488 stroke           | #14B8A6 stroke           | 3.0:1 Non-txt | Candidate Pair  |
| 11 | Chart & Data Colors    | Teal/Orange/Red lines    | Adjusted Dark line values| 3.0:1 Non-txt | Candidate Pair  |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## Target Size & Accessibility Conformance Target

- **WCAG 2.2 Target Size Distinction:**
  - **WCAG 2.2 SC 2.5.8 (Level AA Minimum):** 24×24 CSS px minimum for pointer targets.
  - **WCAG 2.2 SC 2.5.5 (Level AAA Enhanced):** 44×44 CSS px minimum.
  - **FinCraft Standard:** 44×44 CSS px is a **FinCraft product preference**, NOT the WCAG AA threshold.
- **ACCESSIBILITY TARGET:** Designed toward **W3C WCAG 2.2 Level AA**.
- **CONFORMANCE STATUS:** Conformance is **NOT YET EVALUATED** or verified. Conformance can only be evaluated after implementation on active rendered components.

---

## Accessibility & Special OS Modes

FinCraft V2 defines explicit CSS handling for four special operating system modes:

1. **Reduced Motion (`@media (prefers-reduced-motion: reduce)`):**
   - Removes CSS `transition-duration` and `animation` keyframes.
   - Slide-over sheets and modal dialogs appear instantly without sliding/scaling.
   - Graph layout changes snap directly to target positions.
2. **Reduced Transparency (`@media (prefers-reduced-transparency: reduce)`):**
   - All `backdrop-filter` properties are disabled (`backdrop-filter: none !important`).
   - Semi-opaque surfaces convert to 100% solid color fills (`var(--surface-card)`).
3. **High Contrast / Forced Colors (`@media (forced-colors: active)`):**
   - Custom box-shadows and gradients are disabled by browser. Components use system colors (`CanvasText`, `Canvas`). Borders are forced to `1px solid CanvasText`.
4. **Print Mode (`@media print`):**
   - Forces light background (`#FFFFFF`) and dark text (`#000000`) for educational content. Hides navigation bars, sliders, and action buttons.

---

## Domain-Specific Dark Mode Rules

1. **Recharts & Financial Simulation Charts:**
   - Gridlines use low-contrast dark strokes (`oklch(1 0 0 / 10%)`).
   - Line projections use adjusted dark-mode values (`Teal 400` `#2DD4BF`, `Red 400` `#F87171`).
2. **Graph Nodes & Discovery Web Edges:**
   - **No Neon Glow:** Graph edges in dark mode do NOT use neon glow effects. Edges use clean, solid `oklch(1 0 0 / 25%)` lines.
   - Selected nodes use a 2px `Orange 500` stroke without blur artifacts.
3. **Disclaimers & Trade-off Warnings:**
   - High-risk warnings in dark mode use dark warm amber backgrounds (`#291E09`) with high-contrast text (`#FDE68A`) and amber borders (`#78350F`).

---

## Authoritative Research Sources

1. **Next.js App Router Documentation — Building Your Application (Rendering):**
   - Publisher: Vercel / Next.js Team
   - URL: `https://nextjs.org/docs/app/building-your-application/rendering`
   - Access Date: 2026-07-27
   - Supports: Server Component rendering boundaries, hydration safety, and cookie inspection patterns.

2. **MDN Web Docs — prefers-color-scheme & HTTP Cookies:**
   - Publisher: Mozilla Developer Network
   - URL: `https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme`
   - Access Date: 2026-07-27
   - Supports: `@media (prefers-color-scheme)` media query resolution and cookie-based theme persistence.

3. **W3C WCAG 2.2 Guidelines:**
   - Publisher: World Wide Web Consortium (W3C)
   - URL: `https://www.w3.org/TR/WCAG22/`
   - Access Date: 2026-07-27
   - Supports: Contrast Ratio SC 1.4.3 (4.5:1), Non-Text Contrast SC 1.4.11 (3.0:1), Target Size SC 2.5.8 (24px AA) and SC 2.5.5 (44px AAA).
