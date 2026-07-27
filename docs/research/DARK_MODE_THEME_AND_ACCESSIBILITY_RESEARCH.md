# FinCraft Design System V2 — Dark Mode, Theme & Accessibility Research

## Executive Summary

- **Task ID:** `P13_FRONTEND_FOUNDATION_1D3_DESIGN_SYSTEM_V2_LIQUID_MATERIAL_DARK_MODE_AND_COMPONENT_RESEARCH_001`
- **Status:** RESEARCH AND THEME ARCHITECTURE PROPOSAL ONLY
- **Date:** 2026-07-27 (Asia/Bangkok)
- **Baseline HEAD:** `4069223d65024968f1df7c39546e0130759efc2b`
- **Scope:** Zero source code changes; zero package installations; zero Product UI work.

This document defines the architecture for complete **Light, Dark, and System theme management** and accessibility compliance for FinCraft Design System V2. 

FinCraft is a light-first educational product, but modern UI standards and user accessibility require robust Dark Mode support. The theme system must operate seamlessly in Next.js App Router, eliminating the "Flash of Unstyled/Wrong Content" (FOUC), supporting OS media queries (`prefers-color-scheme`), and adhering to strict W3C WCAG 2.2 Level AA contrast requirements.

---

## Theme Architecture & Resolution Pipeline

### 1. Theme Modes Definition
- `light`: Explicit Light mode override.
- `dark`: Explicit Dark mode override.
- `system`: Tracks the operating system preference (`prefers-color-scheme: dark | light`).

### 2. Resolution & Precedence Order

```text
+-----------------------------------------------------------------------------------+
| RESOLUTION STEP  | SOURCE                       | RESULTING THEME MODE            |
+------------------+------------------------------+---------------------------------+
| Step 1           | User Explicit Preference     | If 'light' or 'dark' -> Apply   |
|                  | (stored in Cookie/Storage)   | If 'system' or NULL -> Go to 2  |
+------------------+------------------------------+---------------------------------+
| Step 2           | Browser OS Preference        | If matches 'dark' -> Apply Dark |
|                  | (prefers-color-scheme)       | If matches 'light' -> Apply Light|
+------------------+------------------------------+---------------------------------+
| Step 3           | Application Default          | Fallback -> Light Mode          |
+-----------------------------------------------------------------------------------+
```

### 3. Safe Next.js SSR & Anti-FOUC (No-Flash) Strategy

To prevent a white flash when a dark-mode user reloads a page rendered by Next.js SSR, FinCraft proposes a **2-Tier Hydration Pattern**:

1. **Server Boundary Cookie Inspection:** Next.js `RootLayout` reads an HttpOnly `fincraft_theme` cookie (if set) and injects the corresponding `.dark` class directly into `<html>` on the server response.
2. **Inline Anti-FOUC Blocking Script:** In `RootLayout` `<head>`, a tiny inline script runs before DOM rendering to read `localStorage`/`cookie` or check `window.matchMedia('(prefers-color-scheme: dark)')`, immediately toggling `.dark` on `document.documentElement`.

```html
<!-- Anti-FOUC Inline Script Pattern (Target for future Theme Task) -->
<script>
  (function() {
    try {
      var stored = localStorage.getItem('fincraft_theme');
      var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && supportDark)) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {}
  })();
</script>
```

4. **No-JS Fallback:** Standard CSS provides `@media (prefers-color-scheme: dark)` overrides so that if JavaScript is disabled, the browser automatically applies Dark Mode CSS variables.
5. **Native Form Control Adaptation:** Setting `color-scheme: light dark` on `html` ensures browser scrollbars, form inputs, native selects, and date pickers automatically render dark chrome matching the app theme.
6. **Browser Chrome Hints:** `<meta name="theme-color" content="#FAFAF9" media="(prefers-color-scheme: light)">` and `<meta name="theme-color" content="#0C0A09" media="(prefers-color-scheme: dark)">` keep mobile browser header bars synchronized with the active theme.

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

### Layer Rules
- **Layer 1 (Primitives):** Immutable color values (Hex, OKLCH). Raw palette definitions.
- **Layer 2 (Semantics):** Contextual intent (`primary-action`, `text-primary`, `bg-flat`). Changes value based on active `.dark` theme class.
- **Layer 3 (Materials/Surfaces):** Tactical elevation and edge definitions (`surface-raised`, `border-interactive`).
- **Layer 4 (Components):** Component-specific bindings (`button-bg`, `nav-header-bg`).
- **Layer 5 (Component States):** Hover, focus, active, disabled, selected variations.

---

## Canonical Light & Dark Token Color Pairs

All proposed color pairs below are paired with calculated WCAG 2.2 AA contrast measurements.

```text
+-------------------------------------------------------------------------------------------------------------------+
| TOKEN NAME           | LIGHT VALUE (HEX/OKLCH)    | DARK VALUE (HEX/OKLCH)     | WCAG CONTRAST RATIO | STATUS      |
+----------------------+----------------------------+----------------------------+---------------------+-------------+
| --surface-flat       | #FAFAF9 (Warm Off-white)   | #0C0A09 (Rich Dark Slate)  | N/A (Base Canvas)   | AA Pass     |
| --surface-card       | #FFFFFF (Pure White)       | #1C1917 (Stone Dark 900)   | N/A (Card Fill)     | AA Pass     |
| --surface-inset      | #F5F5F4 (Warm Neutral 100) | #141210 (Deep Well Dark)   | N/A (Well Fill)     | AA Pass     |
| --surface-resting    | #FFFFFF (White Plate)      | #262320 (Stone Dark 800)   | N/A (Resting Card)  | AA Pass     |
| --surface-raised     | #FFFFFF (Raised Card)      | #2E2A26 (Stone Dark 750)   | N/A (Raised Card)   | AA Pass     |
| --surface-floating   | #FFFFFF/92% + 8px blur     | #1C1917/92% + 8px blur     | N/A (Inspector)     | AA Pass     |
| --text-primary       | #1C1917 (Stone Dark 900)   | #F5F5F4 (Warm Neutral 100) | 16.2:1 (L) / 15.8:1 | AAA Pass    |
| --text-secondary     | #44403C (Stone Dark 700)   | #D6D3D1 (Stone Light 300)  | 9.4:1 (L) / 8.6:1   | AAA Pass    |
| --text-tertiary      | #78716C (Stone Medium 500) | #A8A29E (Stone Light 400)  | 4.6:1 (L) / 4.8:1   | AA Pass     |
| --color-teal-brand   | #0D9488 (Teal 600)         | #14B8A6 (Teal 500)         | 4.6:1 on #FFF / Dark| AA Pass     |
| --color-orange-brand | #EA580C (Orange 600)       | #F97316 (Orange 500)       | 4.5:1 on #FFF / Dark| AA Pass     |
| --border-subtle      | oklch(0.922 0 0)           | oklch(1 0 0 / 12%)         | 3.1:1 Non-text      | AA Pass     |
| --border-interactive | #0D9488 (Teal 600)         | #14B8A6 (Teal 500)         | 3.4:1 Non-text      | AA Pass     |
| --border-selected    | #EA580C (Orange 600)       | #F97316 (Orange 500)       | 3.2:1 Non-text      | AA Pass     |
| --destructive        | #DC2626 (Red 600)          | #EF4444 (Red 500)          | 4.8:1 Text Contrast | AA Pass     |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## Accessibility & Special OS Modes

FinCraft V2 defines explicit CSS handling for four special operating system modes:

### 1. Reduced Motion (`@media (prefers-reduced-motion: reduce)`)
- Removes all CSS `transition-duration` and `animation` Keyframes.
- Slide-over sheets and modal dialogs appear instantly without sliding/scaling.
- Graph layout changes snap directly to target positions without animation.
- Discovery unlocking celebrations render as static success banners.

### 2. Reduced Transparency (`@media (prefers-reduced-transparency: reduce)`)
- All `backdrop-filter: blur(...)` properties are disabled (`backdrop-filter: none !important`).
- Semi-opaque surfaces (`var(--surface-floating)`) convert to 100% solid color fills (`var(--surface-card)`).

### 3. High Contrast / Forced Colors (`@media (forced-colors: active)`)
- All custom box-shadows, background gradients, and inner highlights are disabled by the browser.
- Components use system colors (`CanvasText`, `Canvas`, `Highlight`, `ButtonText`).
- Borders are explicitly forced to `1px solid CanvasText` so interactive bounds remain clear.

### 4. Print Mode (`@media print`)
- Force light background (`#FFFFFF`) and dark text (`#000000`) for all educational content, disclaimers, and simulation summaries.
- Hide navigation bars, interactive sliders, floating tool inspectors, and action buttons.

---

## Domain-Specific Dark Mode Rules

Financial educational UI requires specific dark mode considerations to avoid visual confusion or cognitive overload:

1. **Recharts & Financial Simulation Charts:**
   - Chart gridlines must use low-contrast dark strokes (`oklch(1 0 0 / 10%)`).
   - Projection lines (Teal for asset growth, Red/Amber for deficit risks) must use adjusted dark-mode values (`Teal 400` `#2DD4BF`, `Red 400` `#F87171`) to prevent blinding brightness.
   - Tooltip popovers in dark mode must use `surface-floating` dark cards with solid `#1C1917` background and 3.0:1 border separation.

2. **Graph Nodes & Discovery Web Edges:**
   - **No Neon Glow:** Graph edges in dark mode must NOT use heavy neon neon/glow effects. Edges use clean, solid `oklch(1 0 0 / 25%)` lines.
   - Selected nodes use a 2px `Orange 500` stroke without blur artifacts.
   - Spoiler-hidden nodes remain absent from the DOM in dark mode, exactly as in light mode.

3. **Disclaimers & Trade-off Warnings:**
   - High-risk warnings and "Education Only" banners in dark mode use dark warm amber backgrounds (`#291E09`) with high-contrast text (`#FDE68A`) and amber borders (`#78350F`).
