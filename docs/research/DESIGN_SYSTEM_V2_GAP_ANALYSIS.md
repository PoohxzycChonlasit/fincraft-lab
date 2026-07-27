# FinCraft Design System V2 โ€” Gap Analysis

## Executive Summary

- **Task ID:** `P13_FRONTEND_FOUNDATION_1D3B_DESIGN_SYSTEM_V2_RESEARCH_ACCURACY_AND_DECISION_READINESS_REPAIR_001`
- **Status:** RESEARCH GAP ANALYSIS & DECISION READINESS REPAIR (PROVISIONAL)
- **Date:** 2026-07-27 (Asia/Bangkok)
- **Baseline HEAD:** `f9434d5391cc829a9358fcd36863675fbd8d8507`
- **Scope:** Bounded research document repair only. Zero source code changes; zero package installations; zero Product UI work.

FinCraft Lab's current Design System Lab (`/dev/design-system`) established a functional foundation for probing tactile control anatomy, surface depth tiers, and FinCraft brand color roles (Teal trust/action and Orange craft/discovery). However, an objective visual audit and owner review demonstrate that **the current implementation is an early prototype**, insufficient for building high-quality, product-ready UI.

Key gaps include unrefined card edges, flat/basic lifted surfaces without inner highlights or glass-like refinement, total absence of Dark Mode and theme switching, incomplete component anatomy across interactive widgets, and an aesthetic that still resembles an internal developer utility rather than a premium, friendly financial literacy discovery lab.

This document presents a technically precise audit of the current prototype, classifies all identified gaps, aligns them with Owner directives, and establishes why Product UI development must remain paused (`SAFE_TO_START_PRODUCT_PAGES: NO`) until Design System V2 is approved.

---

## Current System Audit (/dev/design-system)

The visual audit was conducted across three canonical viewports (Desktop `1440ร—1200`, Tablet `768ร—1024`, Mobile `390ร—844`) on rendered pages of `/dev/design-system`.

```text
+-----------------------------------------------------------------------------------+
| AUDIT DOMAIN       | CURRENT PROTOTYPE STATE             | AUDIT EVALUATION       |
+--------------------+-------------------------------------+------------------------+
| Colour             | Teal 600/700, Orange 600/700,       | Good foundation;       |
| Architecture       | Warm Neutrals, Destructive oklch     | lacks dark mode pairs  |
+--------------------+-------------------------------------+------------------------+
| Theme              | Single light mode (oklch vars);     | Critical gap;          |
| Architecture       | `.dark` block exists but unused     | no theme resolution    |
+--------------------+-------------------------------------+------------------------+
| Surfaces           | 4 tiers (flat, resting, inset,      | Visually basic;        |
|                    | raised, floating); plain borders    | no inner highlights    |
+--------------------+-------------------------------------+------------------------+
| Borders & Edges    | Single `--border-subtle` hairline;  | Unrefined; no edge     |
|                    | subtle interactive/selected stroke  | specular highlight     |
+--------------------+-------------------------------------+------------------------+
| Elevation &        | Box shadows: resting, raised,       | Flat appearance;       |
| Shadows            | floating; plain 1-layer shadow      | depth feels artificial |
+--------------------+-------------------------------------+------------------------+
| Radius             | 4px, 8px, 12px, 16px mapped;        | Rigid scale;           |
|                    | hardcoded Tailwind radii in parts   | inconsistent rounding  |
+--------------------+-------------------------------------+------------------------+
| Typography         | Inter font family; basic scale      | Generic look; lacks    |
|                    | from text-xs to text-base           | editorial contrast     |
+--------------------+-------------------------------------+------------------------+
| Controls           | Segmented control, Range slider,    | Functional prototype;  |
|                    | State selector, Action button       | native select looks raw|
+--------------------+-------------------------------------+------------------------+
| Touch Targets      | Segmented buttons ~38px height;     | Meets WCAG AA (24px);  |
|                    | range slider thumb ~16px            | below FinCraft 44px    |
+--------------------+-------------------------------------+------------------------+
| Relationship       | Static lines with dashed/dotted     | Plain table layout;    |
| Visuals            | markers for relationship types      | lacks orbit/graph feel |
+--------------------+-------------------------------------+------------------------+
| Responsive         | Stacks vertically on mobile;        | Adequate layout;       |
| Behavior           | no horizontal overflow              | controls shrink tight  |
+--------------------+-------------------------------------+------------------------+
| FinCraft           | Brand colors present;               | Low brand identity;    |
| Identity           | Mochi companion absent              | feels like internal tool|
+-----------------------------------------------------------------------------------+
```

### Detailed Technical Audit Observations

1. **Colour Architecture:** The core semantic colors (`Teal 600` `#0D9488` for trust/primary action, `Orange 600` `#EA580C` for craft/discovery, `Neutral` slate/stone) function correctly. Destructive states were appropriately moved from Accent Role to Visual State. Token definitions in `globals.css` use raw `oklch()` values mixed with hex codes without explicit, contrast-validated Dark Mode color pairs.
2. **Theme Architecture:** Currently light-only. Although a `.dark` CSS class block exists in `globals.css`, there is no runtime theme switcher, no `color-scheme` property, no SSR hydration guard against white flashes (FOUC), and no system preference listener (`prefers-color-scheme`).
3. **Surfaces & Material Refinement:** Surfaces use flat background fills (`var(--surface-resting)`, `var(--surface-inset)`). Raised surfaces lack subtle top-edge inner highlights (`--highlight-inner`) or delicate border gradients that create a polished, lifted appearance. There is no subtle backdrop blur (`backdrop-filter`) for floating overlays.
4. **Borders & Edge Anatomy:** Borders are uniform 1px solid lines using `var(--border-subtle)` (`oklch(0.922 0 0)`). They lack light-reflecting top strokes or dark-chiseled bottom strokes that give modern software interfaces a tangible, tactile feel.
5. **Elevation & Depth:** Shadows rely on standard Tailwind/CSS box-shadows (`var(--shadow-raised)` = `0 4px 10px -4px rgb(28 25 23 / 0.18)`). Without layered ambient + direct shadow pairing or subtle edge light, lifted cards appear flat and unrefined.
6. **Touch Target Dimensions:**
   - **WCAG 2.2 AA Baseline:** WCAG 2.2 SC 2.5.8 Target Size (Minimum) requires **24ร—24 CSS px** (subject to documented spacing exceptions). The current controls (38px height segmented buttons, 16px range thumbs with spacing) technically pass WCAG 2.2 AA minimum.
   - **FinCraft Product Preference:** FinCraft establishes a stricter **44ร—44 CSS px preferred minimum** for primary touch controls (aligning with WCAG SC 2.5.5 Level AAA Enhanced guidelines). The current prototype fails this higher FinCraft product standard.
7. **Typography & Hierarchy:** While `Inter` is loaded properly via Next.js `next/font/google`, heading scale and editorial contrast are minimal. Text hierarchy relies mostly on uppercase tracking-widest metadata labels, missing warm editorial typographic touches suitable for a financial learning workshop.
8. **Controls Anatomy:** The segmented controls and custom range slider (`.lab-range`) are functional, but native `<select>` dropdowns for visual state look unstyled and out of place. Buttons lack active micro-press feedback transitions.
9. **Brand Identity & Atmosphere:** The page reads as a technical design-token test bench rather than a friendly, trustworthy laboratory. Mochi guide elements, specimen element tiles, and craft bay visual motifs are missing from the lab demonstration.

---

## Gap Categorization Matrix

All identified gaps are classified below by priority and resolution phase.

```text
+---------------------------------------------------------------------------------------------------+
| CATEGORY                   | ITEM / GAP DESCRIPTION                               | PHASE TARGET  |
+----------------------------+------------------------------------------------------+---------------+
| Already Adequate           | - Primary Teal & Orange semantic color mapping       | MVP Core      |
|                            | - Clean responsive single-column mobile stacking     |               |
|                            | - Basic 4-tier surface elevation logic               |               |
|                            | - Zero horizontal overflow on 390px mobile           |               |
|                            | - Basic 24x24px WCAG 2.2 AA target size compliance   |               |
+----------------------------+------------------------------------------------------+---------------+
| Incomplete                 | - Lifted surface depth (lacks top edge highlight)    | Design System |
|                            | - Segmented control anatomy (lacks active indicator) | V2 Refactor   |
|                            | - Card edge refinement (lacks dual-tone border)      |               |
|                            | - Touch target sizing (needs 44px FinCraft target)   |               |
|                            | - Typography scale & editorial headers               |               |
+----------------------------+------------------------------------------------------+---------------+
| Inconsistent               | - Border radius usage (mixed Tailwind & inline vars) | Design System |
|                            | - Shadow elevation steps across viewports            | V2 Refactor   |
|                            | - Native form control styling vs custom controls     |               |
+----------------------------+------------------------------------------------------+---------------+
| Missing                    | - Complete Dark Mode & System theme resolution       | Design System |
|                            | - Safe Cookie-authoritative SSR theme hydration      | V2 & Theme    |
|                            | - Lifted Glass material strategy (low resource)      | Task          |
|                            | - 25-Component Anatomy specification                 |               |
|                            | - Mochi & Specimen brand integration                 |               |
+----------------------------+------------------------------------------------------+---------------+
| Must Fix Before Product UI | - Dark Mode candidate CSS variables & contrast matrix| Must Complete |
|                            | - Refined Lifted Card & Glass edge token contract    | Before        |
|                            | - Standardized Component Anatomy for buttons/inputs  | Product UI    |
|                            | - Cookie-authoritative theme switcher architecture   |               |
+----------------------------+------------------------------------------------------+---------------+
| May Defer Until After MVP  | - Advanced Explore Map graph layout engines          | Post-MVP      |
|                            | - High-iteration custom theme customization          |               |
|                            | - Complex 3D/WebGL visual effects (permanently banned)|               |
+---------------------------------------------------------------------------------------------------+
```

---

## Owner Direction Alignment & Architectural Boundaries

The Owner's feedback explicitly highlights core deficiencies in the prototype. Below is the technical alignment plan:

1. **"Card edges are not refined enough":** Standard 1px solid borders look flat and generic.
   *V2 Solution:* Introduce quiet, interactive, selected, and floating edge roles featuring dual-layer stroke effects (subtle inner highlight on top edge, soft dark boundary on bottom edge).

2. **"Lifted surfaces remain visually basic":** Plain gray/white card fills lack dimension.
   *V2 Solution:* Implement a low-cost Lifted Surface & Glass strategy using multi-layered CSS variables, role-based translucency on floating tools, and ambient+direct shadow pairing.

3. **"Dark Mode and Theme switching are absent":** The app only renders in light mode.
   *V2 Solution:* Architect complete Light, Dark, and System theme tokens with candidate color pairs and a Cookie-authoritative SSR hydration strategy.

4. **"Component anatomy is incomplete":** Controls feel disconnected and unstandardized.
   *V2 Solution:* Publish a comprehensive 25-component anatomy roadmap specifying exact roles, HTML semantics, elevation tiers, state transitions, and responsive adaptations.

5. **"Visual identity resembles an internal developer tool":** Lacks FinCraft's signature warm laboratory feel.
   *V2 Solution:* Integrate FinCraft signature language (Specimen Element Tiles, Recessed Craft Bays, Orange Discovery Stamps, Financial Learning Tapes) into component design contracts.

### Critical Visual References & Boundaries
- **Apple Boundary:** Apple Developer documentation on Materials and Translucency serves as a principle reference for quality and depth hierarchy. FinCraft does **NOT** copy Apple Liquid Glass, Apple components, or Apple navigation layouts.
- **Kigen Boundary:** Kigen serves as a visual-quality reference for control anatomy, compact label rhythm, and stateful elevation discipline only. FinCraft does **NOT** copy Kigen's color generator, navigation, page layout, or component geometry.

---

## Accessibility & Conformance Target

- **ACCESSIBILITY TARGET:** FinCraft Design System V2 is designed toward **W3C WCAG 2.2 Level AA**.
- **CONFORMANCE STATUS:** Conformance is **NOT YET EVALUATION-READY** or verified. Conformance can only be claimed after manual and automated testing on fully implemented UI components.
- **REQUIRED EVALUATION GATES (Pre-Release):**
  1. Automated accessibility scans (Axe / Lighthouse 100%).
  2. Full keyboard-only navigation audit (tab order, focus traps, visible focus rings).
  3. Measured contrast ratio verification across all 11 critical dark/light color pairs.
  4. Screen reader testing (NVDA / VoiceOver) on form controls and graph lists.
  5. Zoom and reflow testing at 200% browser zoom on 320px viewports.

---

## Performance Targets vs Idle Work Budget

- **IDLE WORK BUDGET:** No active JavaScript timers, continuous animation loops, or unneeded state updates while idle. 0% sustained CPU usage on idle pages.
- **MAIN-THREAD TARGET:** Interaction event handlers complete within **50ms**. Layout shifts or re-renders complete within **100ms** on desktop and **150ms** on mid-range mobile devices.
- **SCROLL & TRANSITION TARGET:** Smooth visual response on supported hardware. 60fps is an **aspirational performance budget**, to be empirically verified via Chrome DevTools profiling after implementation.

---

## Product Readiness Assessment

```text
+-----------------------------------------------------------------------------------+
| PRODUCT READINESS GATE                                                            |
+-----------------------------------------------------------------------------------+
| SAFE_TO_START_PRODUCT_PAGES: NO                                                  |
|                                                                                   |
| Rationale: Building Product UI (Auth, Workspace, Craft Canvas, Discovery Detail,   |
| Simulation, Admin) on top of the current prototype design system would result in  |
| massive technical debt, inconsistent styling, rework when Dark Mode is introduced, |
| and an unacceptable visual experience that fails Owner quality standards.          |
+-----------------------------------------------------------------------------------+
```

---

## Authoritative Research Sources

1. **W3C WCAG 2.2 Guidelines:**
   - Publisher: World Wide Web Consortium (W3C)
   - URL: `https://www.w3.org/TR/WCAG22/`
   - Access Date: 2026-07-27
   - Supports: Target Size SC 2.5.8 (AA 24px) vs SC 2.5.5 (AAA 44px), Contrast Ratio SC 1.4.3 (4.5:1), Non-Text Contrast SC 1.4.11 (3.0:1), Focus Appearance SC 2.4.13.

2. **MDN Web Docs โ€” Accessibility & Target Metrics:**
   - Publisher: Mozilla Developer Network
   - URL: `https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Target_size`
   - Access Date: 2026-07-27
   - Supports: Touch target accessibility practices and CSS pixels representation.

3. **Next.js App Router Documentation:**
   - Publisher: Vercel / Next.js Team
   - URL: `https://nextjs.org/docs/app/building-your-application/rendering`
   - Access Date: 2026-07-27
   - Supports: Server Component rendering boundaries, hydration safety, and cookie inspection patterns.

4. **Apple Developer Human Interface Guidelines โ€” Materials & Translucency:**
   - Publisher: Apple Inc.
   - URL: `https://developer.apple.com/design/human-interface-guidelines/materials`
   - Access Date: 2026-07-27
   - Supports: Material hierarchy principles, specular edge highlights, and reduced transparency considerations.
