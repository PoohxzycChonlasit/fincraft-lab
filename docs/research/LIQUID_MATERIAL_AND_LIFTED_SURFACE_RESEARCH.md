# FinCraft Design System V2 — Liquid Material & Lifted Surface Research

## Executive Summary

- **Task ID:** `P13_FRONTEND_FOUNDATION_1D3B_DESIGN_SYSTEM_V2_RESEARCH_ACCURACY_AND_DECISION_READINESS_REPAIR_001`
- **Status:** RESEARCH AND MATERIAL STRATEGY PROPOSAL ONLY
- **Date:** 2026-07-27 (Asia/Bangkok)
- **Baseline HEAD:** `f9434d5391cc829a9358fcd36863675fbd8d8507`
- **Scope:** Bounded research document repair only. Zero source code changes; zero package installations; zero Product UI work.

This document researches a low-cost, web-native material and edge refinement strategy for FinCraft Design System V2. Drawing inspiration from modern OS interface design principles—specifically Apple's Human Interface Guidelines on Materials, Translucency, and Specular Edges—we adapt these ideas into a lightweight, performance-conscious web system.

**FinCraft does NOT copy Apple Liquid Glass, nor does it implement heavy GPU shaders, WebGL, 3D refraction, or continuous animations.** Instead, FinCraft translates these principles into standard CSS variables, static inner highlights, dual-tone borders, subtle semi-opaque fills, and small, strictly bounded backdrop filters. This achieves a premium, lifted tactile feel while maintaining high accessibility, low battery consumption, and fast rendering across desktop and mobile browsers.

---

## Apple & Kigen Boundaries & Technical Differentiation

### 1. Official Apple HIG Material Principles

Apple's material design system relies on clear hierarchical principles:
- **Hierarchy through Materials:** Materials indicate depth and context. Content sits on flat base surfaces, while interactive tools, toolbars, and floating inspectors float above on translucent material layers.
- **Specular Edge Highlights:** Thin, light-reflecting top borders emulate physical glass edges catching light, creating separation without thick dark drop shadows.
- **Adaptive Contrast:** Translucent materials automatically adjust tint and opacity based on background content to preserve text contrast (WCAG Compliance).
- **Reduced Transparency Support:** Operating systems provide settings (`prefers-reduced-transparency`) that swap blurred translucent materials for solid high-contrast surfaces.

### 2. Explicit Boundary & Identification Matrix

```text
+---------------------------------------------------------------------------------------------------+
| REFERENCE SYSTEM            | NATURE & USAGE BOUNDARY                                             |
+-----------------------------+---------------------------------------------------------------------+
| Apple Liquid Glass          | - Platform-specific Apple dynamic digital material.                 |
|                             | - Uses native OS shaders, refraction, and dynamic spatial rendering. |
|                             | - FINCRAFT BOUNDARY: FinCraft DOES NOT implement Apple Liquid Glass. |
|                             |   Apple HIG is used ONLY as a principle reference for edge light    |
|                             |   and material hierarchy. FinCraft is a web-native design system.   |
+-----------------------------+---------------------------------------------------------------------+
| Kigen Design System         | - Visual-quality reference for control anatomy and token discipline.|
|                             | - FINCRAFT BOUNDARY: Kigen is referenced ONLY for compact label     |
|                             |   rhythm and shallow stateful elevation. FinCraft DOES NOT copy    |
|                             |   Kigen's color generator, layout, navigation, or geometry.         |
+-----------------------------+---------------------------------------------------------------------+
| FinCraft Lifted Glass       | - Web-native CSS material system.                                   |
| (Proposed System)           | - Uses dual-tone 1px borders, static --highlight-inner top shadow,  |
|                             |   role-based translucency, and zero continuous animations/shaders.  |
+---------------------------------------------------------------------------------------------------+
```

FinCraft explicitly rejects:
- Copying Apple navigation, window controls, rounded pill geometry, or icons.
- Using 3D rendering engines, Three.js, WebGL, or canvas refraction.
- Full-page continuous blur filters (`backdrop-filter: blur(40px)`) that degrade mobile frame rates.
- Animated gradient borders or perpetually moving glass shines.

---

## Low-Resource Web Material Strategy & Role-Based Translucency Policy

To achieve a premium lifted appearance without incurring performance penalties, FinCraft V2 uses a **Role-Based Translucency & Material Strategy**:

```css
/* FinCraft V2 Lifted Glass CSS Pattern Example (Floating Role Only) */
.surface-floating-glass {
  /* 1. Semi-opaque surface fill */
  background-color: color-mix(in oklch, var(--surface-card) 92%, transparent);

  /* 2. Dual-tone border (light top edge, subtle dark perimeter) */
  border: 1px solid var(--border-subtle);
  border-top-color: color-mix(in oklch, var(--color-teal-600) 25%, var(--border-subtle));

  /* 3. Static Inner Highlight (simulates top edge light reflection) */
  box-shadow: 
    inset 0 1px 0 0 rgba(255, 255, 255, 0.4),  /* Top inner specular highlight */
    var(--shadow-raised);                      /* Subtle ambient drop shadow */

  /* 4. Small bounded backdrop blur (strictly restricted to Floating & Overlay roles) */
  backdrop-filter: blur(8px);
}
```

### Translucency Role Policy
1. **Opaque by Default:** All primary reading Content (`surface-card`), Grouped learning regions (`surface-inset`), Input wells, Graph nodes, Simulation charts, Long-form text, and Admin tables are **100% solid opaque surfaces**. Translucency is strictly forbidden on these content areas to guarantee text contrast.
2. **Bounded Translucency Allowed:** Translucency and subtle backdrop blur (`backdrop-filter: blur(8px)`) are permitted **ONLY on Bounded Floating (`surface-floating`) and Overlay (`surface-overlay`) roles** (e.g. floating inspectors, dropdown menus, modal dialogs, slide-over sheets).
3. **Progressive Enhancement & Unsupported Browser Fallback:**
   - Default surface tokens are defined as solid or near-solid accessible fills.
   - On browsers that do not support `@media (prefers-reduced-transparency: reduce)` or `backdrop-filter`, the UI remains 100% readable and functional using standard solid CSS backgrounds (`var(--surface-card)`).
   - `@media (prefers-reduced-transparency: reduce)` acts as a progressive enhancement override that removes `backdrop-filter` and forces opacity to 100%.

---

## Layered Surface Elevation & Edge Matrix

FinCraft V2 defines 7 explicit Surface Elevation Roles and 6 Edge Roles.

### Surface Elevation Matrix

```text
+---------------------------------------------------------------------------------------------------------------------------------------+
| ROLE             | PURPOSE                  | TRANSLUCENCY POLICY          | BORDER & INNER HIGHLIGHT     | SHADOW & ELEVATION     |
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

#### Detailed State & Accessibility Specifications per Surface Role:

1. **Canvas (`surface-flat`):**
   - *Light Candidate:* `#FAFAF9` (Warm off-white) | *Dark Candidate:* `#0C0A09` (Rich dark slate)
   - *Behavior:* Flat, non-interactive document plane. Zero shadow, zero elevation. Solid opaque.

2. **Content (`surface-card`):**
   - *Light Candidate:* `#FFFFFF` | *Dark Candidate:* `#1C1917`
   - *Behavior:* Document reading surface. Solid opaque. Stays flat. Earns quiet border on hover if interactive.

3. **Grouped (`surface-inset`):**
   - *Light Candidate:* `#F5F5F4` | *Dark Candidate:* `#141210`
   - *Behavior:* Recessed value wells, code blocks, input containers. Solid opaque. Soft inset shadow (`inset 0 1px 2px rgba(0,0,0,0.08)`).

4. **Lifted (`surface-resting`):**
   - *Light Candidate:* `#FFFFFF` | *Dark Candidate:* `#262320`
   - *Behavior:* Tactile interactive card. Solid opaque. Includes top inner specular highlight (`inset 0 1px 0 rgba(255,255,255,0.3)` in light, `rgba(255,255,255,0.08)` in dark).

5. **Selected (`surface-raised`):**
   - *Light Candidate:* `#FFFFFF` with Orange/Teal border | *Dark Candidate:* `#2E2A26`
   - *Behavior:* Active selection. Solid opaque. Higher z-index, strong border stroke (`var(--border-selected)`), 4px elevation shadow.

6. **Floating (`surface-floating`):**
   - *Light Candidate:* `#FFFFFF/92%` + 8px blur | *Dark Candidate:* `#1C1917/92%` + 8px blur
   - *Behavior:* Tool inspectors, popovers. Bounded translucency allowed. Overlaps content. Reduced transparency fallback converts fill to 100% solid.

7. **Overlay (`surface-overlay`):**
   - *Light Candidate:* `#FFFFFF/96%` + 12px blur | *Dark Candidate:* `#1C1917/96%` + 12px blur
   - *Behavior:* Modal dialogs, mobile sheets. Bounded translucency allowed. Paired with dark backdrop overlay (`rgba(0,0,0,0.4)`).

---

### Edge Role Matrix

FinCraft V2 replaces generic borders with 6 functional Edge Roles:

```text
+---------------------------------------------------------------------------------------------------+
| EDGE ROLE       | CSS VARIABLE           | LIGHT STROKE           | DARK STROKE            | INTENT   |
+-----------------+------------------------+------------------------+------------------------+----------+
| 1. Quiet        | --border-subtle        | oklch(0.922 0 0)       | oklch(1 0 0 / 12%)     | Neutral  |
| 2. Interactive  | --border-interactive   | var(--color-teal-600)  | var(--color-teal-500)  | Focus/Hvr|
| 3. Selected     | --border-selected      | var(--color-orange-600)| var(--color-orange-500)| Active   |
| 4. Discovery    | --border-discovery     | var(--color-orange-500)| var(--color-orange-400)| Unlocked |
| 5. Floating     | --border-floating      | oklch(0.85 0 0)        | oklch(1 0 0 / 22%)     | Overlay  |
| 6. Danger       | --border-destructive   | oklch(0.577 0.245 27)  | oklch(0.704 0.191 22)  | Warning  |
+---------------------------------------------------------------------------------------------------+
```

---

## Target Size, Accessibility & Performance Standards

### 1. Target Size Distinction
- **WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA:** Requires **24×24 CSS px** minimum for pointer inputs (subject to documented spacing exceptions).
- **WCAG 2.2 SC 2.5.5 Target Size (Enhanced), Level AAA:** Specifies **44×44 CSS px** minimum without spacing dependencies.
- **FinCraft Product Preference:** FinCraft establishes **44×44 CSS px as an explicit FinCraft product requirement** for primary interactive touch targets (aligning with Level AAA guidelines for touch accessibility). This is a product choice, NOT the WCAG 2.2 AA minimum.

### 2. Accessibility Conformance Target
- **ACCESSIBILITY TARGET:** Designed toward **W3C WCAG 2.2 Level AA**.
- **CONFORMANCE STATUS:** Conformance is **NOT YET EVALUATED** or verified. Conformance can only be evaluated after implementation on active rendered components.
- **REQUIRED EVALUATION GATES (Pre-Release):**
  1. Automated accessibility scans (Axe / Lighthouse 100%).
  2. Keyboard-only navigation & visible focus ring review.
  3. Contrast ratio measurements across all 11 critical dark/light color pairs.
  4. Screen reader testing (NVDA / VoiceOver) on interactive components.
  5. Zoom and reflow testing at 200% browser zoom on 320px viewports.

### 3. Performance Targets vs Idle Budget
- **IDLE WORK BUDGET:** No active JavaScript timers, continuous animation loops, or unneeded state updates while idle. 0% sustained CPU work on idle pages.
- **MAIN-THREAD TARGET:** Interaction event handlers complete within **50ms**. Layout shifts or re-renders complete within **100ms** on desktop and **150ms** on mid-range mobile devices.
- **SCROLL & TRANSITION TARGET:** Smooth visual response on supported hardware. **60fps is an aspirational performance target**, to be empirically verified via browser profiling after implementation.

---

## Authoritative Research Sources

1. **W3C WCAG 2.2 SC 2.5.8 Target Size (Minimum):**
   - Publisher: World Wide Web Consortium (W3C)
   - URL: `https://www.w3.org/TR/WCAG22/#target-size-minimum`
   - Access Date: 2026-07-27
   - Supports: 24×24 CSS px Level AA minimum target size specification and documented spacing exceptions.

2. **W3C WCAG 2.2 SC 2.5.5 Target Size (Enhanced):**
   - Publisher: World Wide Web Consortium (W3C)
   - URL: `https://www.w3.org/TR/WCAG22/#target-size-enhanced`
   - Access Date: 2026-07-27
   - Supports: 44×44 CSS px Level AAA enhanced target size specification.

3. **MDN Web Docs — prefers-reduced-transparency:**
   - Publisher: Mozilla Developer Network
   - URL: `https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency`
   - Access Date: 2026-07-27
   - Supports: `@media (prefers-reduced-transparency: reduce)` media feature usage and progressive enhancement fallback patterns.

4. **Apple Developer Human Interface Guidelines — Materials:**
   - Publisher: Apple Inc.
   - URL: `https://developer.apple.com/design/human-interface-guidelines/materials`
   - Access Date: 2026-07-27
   - Supports: Material hierarchy principles, specular edge highlights, and reduced transparency considerations.
