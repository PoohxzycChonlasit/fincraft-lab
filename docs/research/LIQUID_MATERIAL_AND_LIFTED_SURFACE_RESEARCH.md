# FinCraft Design System V2 — Liquid Material & Lifted Surface Research

## Executive Summary

- **Task ID:** `P13_FRONTEND_FOUNDATION_1D3_DESIGN_SYSTEM_V2_LIQUID_MATERIAL_DARK_MODE_AND_COMPONENT_RESEARCH_001`
- **Status:** RESEARCH AND MATERIAL STRATEGY PROPOSAL ONLY
- **Date:** 2026-07-27 (Asia/Bangkok)
- **Baseline HEAD:** `4069223d65024968f1df7c39546e0130759efc2b`
- **Scope:** Zero source code changes; zero package installations; zero Product UI work.

This document researches a low-cost, web-native material and edge refinement strategy for FinCraft Design System V2. Drawing inspiration from modern OS interface design principles—specifically Apple's Human Interface Guidelines on Materials, Translucency, and Specular Edges—we adapt these ideas into a lightweight, performance-conscious web system.

**FinCraft does NOT copy Apple Liquid Glass, nor does it implement heavy GPU shaders, WebGL, 3D refraction, or continuous animations.** Instead, FinCraft translates these principles into standard CSS variables, static inner highlights, dual-tone borders, subtle semi-opaque fills, and small, strictly bounded backdrop filters. This achieves a premium, lifted tactile feel while maintaining high accessibility, low battery consumption, and fast rendering across desktop and mobile browsers.

---

## Apple Principles Analysis & Architectural Boundary

### 1. Official Apple HIG & WWDC Material Principles

Apple's material design system relies on clear hierarchical principles:
- **Hierarchy through Materials:** Materials indicate depth and context. Content sits on flat base surfaces, while interactive tools, toolbars, and floating inspectors float above on translucent material layers.
- **Specular Edge Highlights:** Thin, light-reflecting top borders emulate physical glass edges catching light, creating separation without thick dark drop shadows.
- **Adaptive Contrast:** Translucent materials automatically adjust tint and opacity based on background content to preserve text contrast (WCAG Compliance).
- **Reduced Transparency Support:** macOS and iOS provide system settings (`prefers-reduced-transparency`) that swap blurred translucent materials for solid high-contrast surfaces.

### 2. Strict Apple & Web Boundary Definition

```text
+-----------------------------------------------------------------------------------+
| APPLE LIQUID GLASS (PLATFORM)       | FINCRAFT LIFTED GLASS (WEB ADAPTATION)      |
+-------------------------------------+---------------------------------------------+
| - Dynamic native OS render engine   | - Pure CSS variables & standard DOM         |
| - Real-time optical refraction      | - Static inner highlight (inset top shadow) |
| - GPU spatial depth shaders         | - Dual-tone 1px borders & crisp radius      |
| - Continuous motion distortion      | - Zero continuous animation / zero WebGL    |
| - Platform-exclusive APIs           | - Standard web standards (Next.js/Tailwind) |
+-----------------------------------------------------------------------------------+
```

FinCraft treats Apple purely as an inspiration for visual quality and material discipline. **We explicitly reject:**
- Copying Apple navigation, window controls, rounded pill geometry, or icons.
- Using 3D rendering engines, Three.js, WebGL, or canvas refraction.
- Full-page continuous blur filters (`backdrop-filter: blur(40px)`) that degrade mobile frame rates.
- Animated gradient borders or perpetually moving glass shines.

---

## Low-Resource Web Material Strategy

To achieve a premium lifted appearance without incurring performance penalties, FinCraft V2 uses a **4-Part Low-Cost CSS Strategy**:

```css
/* FinCraft V2 Lifted Glass CSS Pattern Example */
.surface-lifted-glass {
  /* 1. Semi-opaque surface fill */
  background-color: color-mix(in oklch, var(--surface-card) 92%, transparent);

  /* 2. Dual-tone border (light top edge, subtle dark perimeter) */
  border: 1px solid var(--border-subtle);
  border-top-color: color-mix(in oklch, var(--color-teal-600) 25%, var(--border-subtle));

  /* 3. Static Inner Highlight (simulates top edge light reflection) */
  box-shadow: 
    inset 0 1px 0 0 rgba(255, 255, 255, 0.4),  /* Top inner specular highlight */
    var(--shadow-raised);                      /* Subtle ambient drop shadow */

  /* 4. Small bounded backdrop blur (only on floating panels, disabled under reduced motion) */
  backdrop-filter: blur(8px);
}
```

### Key Performance Guardrails
1. **No Blur on Scroll Surfaces:** Backdrop filters are restricted to small floating overlays (`surface-floating`, `surface-inspector`). Main content cards use opaque static fills.
2. **Reduced Transparency Fallback:** Under `@media (prefers-reduced-transparency: reduce)`, all backdrop-filters are removed, and backgrounds revert to 100% solid tokens (`var(--surface-card)`).
3. **Compositor Efficiency:** Shadow transitions use `opacity` or simple 150ms transform states rather than animating heavy blur radiuses.

---

## Layered Surface Elevation & Edge Matrix

FinCraft V2 defines 7 explicit Surface Elevation Roles and 6 Edge Roles.

### Surface Elevation Matrix

```text
+---------------------------------------------------------------------------------------------------------------------------------------+
| ROLE             | PURPOSE                  | BACKGROUND FILL              | BORDER & INNER HIGHLIGHT     | SHADOW & ELEVATION     |
+------------------+--------------------------+------------------------------+------------------------------+------------------------+
| 1. Canvas        | Root lab background      | var(--surface-flat) [100%]   | None                         | None (0px)             |
| 2. Content       | Reading cards, documents | var(--surface-card) [100%]   | var(--border-subtle)         | None / Flat            |
| 3. Grouped       | Sub-panels, list wells   | var(--surface-inset) [100%]  | var(--border-subtle)         | Inset 0 1px 2px rgb... |
| 4. Lifted        | Standard interactive card| var(--surface-resting) [100%]| Dual-tone + Top Highlight    | var(--shadow-resting)  |
| 5. Selected      | Active node / craft item | var(--surface-raised) [100%] | var(--border-selected)       | var(--shadow-raised)   |
| 6. Floating      | Inspector, popover, menu | var(--surface-floating)[92%] | var(--border-interactive)    | var(--shadow-floating) |
| 7. Overlay       | Dialogs, sheet drawers   | var(--popover) [96%]         | var(--border-interactive)    | 0 20px 30px -10px ...  |
+---------------------------------------------------------------------------------------------------------------------------------------+
```

#### Detailed State & Accessibility Specifications per Surface Role:

1. **Canvas (`surface-flat`):**
   - *Light Mode:* `#FAFAF9` (Warm off-white) | *Dark Mode:* `#0C0A09` (Rich dark slate)
   - *Behavior:* Flat, non-interactive document plane. Zero shadow, zero elevation.

2. **Content (`surface-card`):**
   - *Light Mode:* `#FFFFFF` | *Dark Mode:* `#1C1917`
   - *Behavior:* Document reading surface. Stays flat. Earns border on hover if interactive.

3. **Grouped (`surface-inset`):**
   - *Light Mode:* `#F5F5F4` | *Dark Mode:* `#141210`
   - *Behavior:* Recessed value wells, code blocks, input containers. Soft inset shadow (`inset 0 1px 2px rgba(0,0,0,0.08)`).

4. **Lifted (`surface-resting`):**
   - *Light Mode:* `#FFFFFF` | *Dark Mode:* `#262320`
   - *Behavior:* Tactile interactive card. Includes top inner specular highlight (`inset 0 1px 0 rgba(255,255,255,0.3)` in light, `rgba(255,255,255,0.08)` in dark).

5. **Selected (`surface-raised`):**
   - *Light Mode:* `#FFFFFF` with Orange/Teal border | *Dark Mode:* `#2E2A26`
   - *Behavior:* Active selection. Higher z-index, strong border stroke (`var(--border-selected)`), 4px elevation shadow.

6. **Floating (`surface-floating`):**
   - *Light Mode:* `#FFFFFF/92%` + 8px blur | *Dark Mode:* `#1C1917/92%` + 8px blur
   - *Behavior:* Tool inspectors, popovers. Overlaps content. Reduced transparency fallback removes blur.

7. **Overlay (`surface-overlay`):**
   - *Light Mode:* `#FFFFFF/96%` + 12px blur | *Dark Mode:* `#1C1917/96%` + 12px blur
   - *Behavior:* Modal dialogs, mobile sheets. Paired with dark backdrop overlay (`rgba(0,0,0,0.4)`).

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

## W3C WCAG 2.2 & Performance Verification Standards

Every proposed material and edge specification in Design System V2 must pass the following W3C compliance gates:

1. **Text Contrast (WCAG 2.2 SC 1.4.3 Level AA):**
   - Body text on all surfaces (Flat, Card, Lifted, Floating) must maintain a minimum contrast ratio of **4.5:1** against the surface background color.
   - Large text (18pt / 24px or 14pt bold / 19px bold) must maintain a minimum ratio of **3.0:1**.

2. **Non-Text Contrast (WCAG 2.2 SC 1.4.11 Level AA):**
   - Active controls, input borders, radio/checkbox boundaries, and selected graph node edges must maintain at least **3.0:1** contrast against adjacent backgrounds.

3. **Focus Appearance (WCAG 2.2 SC 2.4.13 Level AA):**
   - Interactive controls must display a high-contrast focus indicator with an outline area of at least 2px thickness and 3:1 contrast against both the control and background.

4. **Frame Rate & CPU Budget:**
   - Zero continuous animation when idle (0% CPU usage).
   - Layout transitions complete within **150ms** (fast) or **250ms** (normal).
   - Translucent floating layers must maintain 60fps scrolling on target mobile hardware.
