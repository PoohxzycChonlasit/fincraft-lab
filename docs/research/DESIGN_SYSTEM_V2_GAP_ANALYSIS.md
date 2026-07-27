# FinCraft Design System V2 — Gap Analysis

## Executive Summary

- **Task ID:** `P13_FRONTEND_FOUNDATION_1D3_DESIGN_SYSTEM_V2_LIQUID_MATERIAL_DARK_MODE_AND_COMPONENT_RESEARCH_001`
- **Status:** RESEARCH AND GAP ANALYSIS PROPOSAL ONLY
- **Date:** 2026-07-27 (Asia/Bangkok)
- **Baseline HEAD:** `4069223d65024968f1df7c39546e0130759efc2b`
- **Scope:** Zero source code changes; zero package installations; zero Product UI work.

FinCraft Lab's current Design System Lab (`/dev/design-system`) established a functional foundation for proving tactile control anatomy, surface depth tiers, and FinCraft brand color roles (Teal trust/action and Orange craft/discovery). However, an objective visual audit and owner review demonstrate that **the current implementation is an early prototype**, insufficient for building high-quality, product-ready UI.

Key gaps include unrefined card edges, flat/basic lifted surfaces without inner highlights or glass-like refinement, total absence of Dark Mode and theme switching, incomplete component anatomy across interactive widgets, and an aesthetic that still resembles an internal developer utility rather than a premium, friendly financial literacy discovery lab.

This document presents a comprehensive audit of the current prototype, classifies all identified gaps, aligns them with Owner directives, and establishes why Product UI development must remain paused (`SAFE_TO_START_PRODUCT_PAGES: NO`) until Design System V2 is approved.

---

## Current System Audit (/dev/design-system)

The visual audit was conducted across three canonical viewports (Desktop `1440×1200`, Tablet `768×1024`, Mobile `390×844`) on rendered pages of `/dev/design-system`.

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

### Detailed Observations

1. **Colour Architecture:** The core semantic colors (`Teal 600` `#0D9488` for trust/primary action, `Orange 600` `#EA580C` for craft/discovery, `Neutral` slate/stone) function correctly. However, Destructive was initially confused with accent roles before being moved to Visual State. Token definitions in `globals.css` use raw `oklch()` values mixed with hex codes without explicit Dark Mode color pairs.
2. **Theme Architecture:** Currently light-only. Although a `.dark` CSS class block exists in `globals.css`, there is no runtime theme switcher, no `color-scheme` property, no SSR hydration guard against white flashes (FOUC), and no system preference listener (`prefers-color-scheme`).
3. **Surfaces & Material Refinement:** Surfaces use flat background fills (`var(--surface-resting)`, `var(--surface-inset)`). Raised surfaces lack subtle top-edge inner highlights (`highlight-inner`) or delicate border gradients that create a polished, lifted appearance. There is no subtle backdrop blur (`backdrop-filter`) for floating overlays.
4. **Borders & Edge Anatomy:** Borders are uniform 1px solid lines using `var(--border-subtle)` (`oklch(0.922 0 0)`). They lack light-reflecting top strokes or dark-chiseled bottom strokes that give modern UI (such as iOS Liquid Glass or premium desktop software) a tangible, tactile feel.
5. **Elevation & Depth:** Shadows rely on standard Tailwind/CSS box-shadows (`var(--shadow-raised)` = `0 4px 10px -4px rgb(28 25 23 / 0.18)`). Without layered ambient + direct shadow pairs or subtle edge light, lifted cards appear flat and unrefined.
6. **Typography & Hierarchy:** While `Inter` is loaded properly via Next.js `next/font/google`, heading scale and editorial contrast are minimal. Text hierarchy relies mostly on uppercase tracking-widest metadata labels, missing warm editorial typographic touches suitable for a financial learning workshop.
7. **Controls Anatomy:** The segmented controls and custom range slider (`.lab-range`) are functional, but native `<select>` dropdowns for visual state look unstyled and out of place. Buttons lack active micro-press feedback transitions.
8. **Brand Identity & Atmosphere:** The page reads as a technical design-token test bench rather than a friendly, trustworthy laboratory. Mochi guide elements, specimen element tiles, and craft bay visual motifs are missing from the lab demonstration.

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
+----------------------------+------------------------------------------------------+---------------+
| Incomplete                 | - Lifted surface depth (lacks top edge highlight)    | Design System |
|                            | - Segmented control anatomy (lacks active indicator) | V2 Refactor   |
|                            | - Card edge refinement (lacks dual-tone border)      |               |
|                            | - Typography scale & editorial headers               |               |
+----------------------------+------------------------------------------------------+---------------+
| Inconsistent               | - Border radius usage (mixed Tailwind & inline vars) | Design System |
|                            | - Shadow elevation steps across viewports            | V2 Refactor   |
|                            | - Native form control styling vs custom controls     |               |
+----------------------------+------------------------------------------------------+---------------+
| Missing                    | - Complete Dark Mode & System theme resolution       | Design System |
|                            | - Safe SSR theme hydration (No-flash script)         | V2 & Theme    |
|                            | - Lifted Glass material strategy (low resource)      | Task          |
|                            | - 25-Component Anatomy specification                 |               |
|                            | - Mochi & Specimen brand integration                 |               |
+----------------------------+------------------------------------------------------+---------------+
| Must Fix Before Product UI | - Dark Mode CSS variables & semantic color pairs     | Must Complete |
|                            | - Refined Lifted Card & Glass edge token contract    | Before        |
|                            | - Standardized Component Anatomy for buttons/inputs  | Product UI    |
|                            | - Theme switcher & hydration architecture            |               |
+----------------------------+------------------------------------------------------+---------------+
| May Defer Until After MVP  | - Advanced Explore Map graph layout engines          | Post-MVP      |
|                            | - High-iteration custom theme customization          |               |
|                            | - Complex 3D/WebGL visual effects (permanently banned)|               |
+---------------------------------------------------------------------------------------------------+
```

---

## Owner Direction Alignment

The Owner's feedback explicitly highlights five core deficiencies in the prototype:

1. **"Card edges are not refined enough":** Standard 1px solid borders look flat and generic.
   *V2 Solution:* Introduce quiet, interactive, selected, and floating edge roles featuring dual-layer stroke effects (subtle inner highlight on top edge, soft dark boundary on bottom edge).

2. **"Lifted surfaces remain visually basic":** Plain gray/white card fills lack dimension.
   *V2 Solution:* Implement a low-cost Lifted Surface & Glass strategy using multi-layered CSS variables, subtle translucency (`bg-surface/90`), and ambient+direct shadow pairing.

3. **"Dark Mode and Theme switching are absent":** The app only renders in light mode.
   *V2 Solution:* Architect complete Light, Dark, and System theme tokens with WCAG-compliant color pairs and zero-FOUC inline hydration scripts.

4. **"Component anatomy is incomplete":** Controls feel disconnected and unstandardized.
   *V2 Solution:* Publish a comprehensive 25-component anatomy roadmap specifying exact roles, HTML semantics, elevation tiers, state transitions, and responsive adaptations.

5. **"Visual identity resembles an internal developer tool":** Lacks FinCraft's signature warm laboratory feel.
   *V2 Solution:* Integrate FinCraft signature language (Specimen Element Tiles, Recessed Craft Bays, Orange Discovery Stamps, Financial Learning Tapes) into component design contracts.

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

### Next Required Milestones
1. **Design System V2 Research Approval:** Owner reviews and selects a V2 visual direction proposal.
2. **Owner V2 Decision Freeze:** Record canonical design system V2 contract freeze.
3. **Design System V2 Refactor Task:** Update CSS variables, tokens, theme architecture, and Design System Lab UI without building Product UI.
4. **Product UI Authorization:** Begin building feature routes only after Design System V2 is verified and approved.
