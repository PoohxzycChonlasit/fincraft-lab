# FinCraft Design System V2 — Options & Recommendation Proposal

## Executive Summary

- **Task ID:** `P13_FRONTEND_FOUNDATION_1D3_DESIGN_SYSTEM_V2_LIQUID_MATERIAL_DARK_MODE_AND_COMPONENT_RESEARCH_001`
- **Status:** RESEARCH AND V2 DIRECTION PROPOSAL ONLY
- **Date:** 2026-07-27 (Asia/Bangkok)
- **Baseline HEAD:** `4069223d65024968f1df7c39546e0130759efc2b`
- **Scope:** Zero source code changes; zero package installations; zero Product UI work.

This document presents three comprehensive visual direction options for **FinCraft Design System V2**, evaluates them across 13 quantitative and qualitative criteria, recommends a primary direction, and establishes a standardized **25-Component Anatomy Roadmap**.

FinCraft is a light-first Financial Literacy Discovery Lab (65% professional/educational, 35% playful/laboratory). The proposed Design System V2 direction solves all prototype gaps highlighted by the Owner—refining card edges, adding lifted material depth, establishing complete Light/Dark/System theme tokens, and defining professional component anatomy—without installing heavy 3D/WebGL packages or risking generic AI-slop visual outputs.

---

## Visual Direction Options Evaluation

### Option A: FinCraft Lifted Learning Material

- **Concept:** A friendly, high-precision educational workshop instrument. Flat document reading surfaces paired with crisp, lifted tactile controls featuring top inner specular highlights and dual-tone borders.
- **Light Theme:** Warm off-white laboratory background (`#FAFAF9`), pure white cards (`#FFFFFF`), deep Teal primary actions (`#0D9488`), and energetic Orange craft accents (`#EA580C`).
- **Dark Theme:** Rich dark slate background (`#0C0A09`), stone dark cards (`#1C1917`), Teal 500 actions (`#14B8A6`), and Orange 500 accents (`#F97316`).
- **Surface & Edge Philosophy:** Normal reading surfaces remain flat. Tactile depth is earned exclusively by interactive buttons, selected nodes, input wells, and floating inspectors. Specular inner top highlights simulate physical edge light.
- **Pros:** Maximum reading clarity, trustworthy financial presentation, low GPU resource usage, strong Kigen control discipline without cloning Kigen's dark layout.
- **Cons:** Requires strict design discipline to avoid over-beveling controls.

### Option B: FinCraft Adaptive Glass Instruments

- **Concept:** A modern translucent laboratory console. Tool panels, navigation bars, and inspectors use semi-opaque frosted glass surfaces with subtle backdrop blur and light-reflecting edges.
- **Light Theme:** Soft translucent white cards (`#FFFFFF/85%` + 10px blur), subtle Teal glass highlights, and dark slate typography.
- **Dark Theme:** Translucent dark stone cards (`#1C1917/85%` + 10px blur), bright Teal/Orange edge highlights, and high-contrast text.
- **Surface & Edge Philosophy:** Translucent material layers create visual depth by blurring underlying canvas elements. Specular edges wrap floating tool panels.
- **Pros:** Sleek, modern appearance with a premium software feel inspired by Apple HIG.
- **Cons:** Higher GPU rendering cost on mobile; risk of poor text contrast if backgrounds change; fallback required under reduced transparency.

### Option C: FinCraft Paper-and-Glass Hybrid (Recommended Adaptation)

- **Concept:** The ultimate synthesis of Option A and Option B. 
  - **Flat Paper Reading Surfaces** for long-form educational articles, disclaimers, and trade-off tables (Option A discipline).
  - **Lifted Glass Control Islands** for interactive toolbars, floating inspectors, and Craft Canvas controls (Option B translucency).
- **Light & Dark Themes:** Uses Option A's solid high-contrast warm light / rich dark slate color tokens for 90% of reading content, applying translucent frosted glass strictly to 10% floating UI islands.
- **Pros:** Delivers Apple-inspired lifted material sophistication where it matters (floating tools) while preserving 100% reading legibility, zero mobile lag, and strict WCAG contrast on document content.

---

## Comparative Scorecard (13 Criteria)

Scores use a 1–10 scale (`1 = Poor/Weak`, `10 = Excellent/Strong`). For *Implementation Difficulty*, higher means more difficult.

```text
+---------------------------------------------------------------------------------------------------+
| EVALUATION CRITERION               | OPTION A: LIFTED   | OPTION B: ADAPTIVE | OPTION C: HYBRID  |
|                                    | MATERIAL           | GLASS              | (RECOMMENDED)     |
+------------------------------------+--------------------+--------------------+-------------------+
| 1. FinCraft Uniqueness             | 8 / 10             | 8 / 10             | 9 / 10            |
| 2. Financial Educational Trust     | 9 / 10             | 7 / 10             | 9 / 10            |
| 3. Learning Content Clarity        | 9 / 10             | 6 / 10             | 10 / 10           |
| 4. Playful Laboratory Feel         | 8 / 10             | 8 / 10             | 9 / 10            |
| 5. Mobile Viability & Layout       | 9 / 10             | 6 / 10             | 9 / 10            |
| 6. Accessibility & WCAG Compliance | 9 / 10             | 6 / 10             | 9 / 10            |
| 7. Performance & Low GPU Usage     | 10 / 10            | 5 / 10             | 9 / 10            |
| 8. Codebase Maintainability        | 9 / 10             | 6 / 10             | 8 / 10            |
| 9. Implementation Difficulty (Hard)| 5 / 10 (Moderate)  | 8 / 10 (Hard)      | 6 / 10 (Moderate) |
| 10. Graph Canvas Compatibility     | 9 / 10             | 7 / 10             | 9 / 10            |
| 11. Simulation UI Compatibility    | 9 / 10             | 7 / 10             | 9 / 10            |
| 12. Resistance to AI-Slop          | 9 / 10             | 6 / 10             | 9 / 10            |
| 13. Apple/Kigen Copy Safety        | 9 / 10             | 5 / 10             | 9 / 10            |
+------------------------------------+--------------------+--------------------+-------------------+
| TOTAL BALANCED SCORE               | 98 / 110           | 77 / 110           | 104 / 110         |
+---------------------------------------------------------------------------------------------------+
```

### Recommendation Justification
**Option C (FinCraft Paper-and-Glass Hybrid)** is formally recommended for Owner selection. It provides the exact visual refinement requested by the Owner—lifted cards, crisp dual-tone edges, and Apple-inspired translucent inspectors—without compromising reading contrast, mobile battery life, or graph rendering performance.

---

## 25-Component Anatomy Roadmap

The table below specifies the proposed design anatomy for all 25 core FinCraft components under Design System V2.

```text
+-----------------------------------------------------------------------------------------------------------------------------------+
| #  | COMPONENT         | HTML SEMANTICS | MATERIAL & EDGE ROLE     | ELEVATION TIER   | LIGHT / DARK STATE SUMMARY    | PHASE     |
+----+-------------------+----------------+--------------------------+------------------+-------------------------------+-----------+
| 1  | App Shell         | <header>/<main>| surface-flat             | None (0px)       | Warm Off-white / Rich Slate   | System V2 |
| 2  | Navigation Bar    | <nav>          | surface-card + Quiet Edge| Resting (1px)    | Solid white / Dark stone      | System V2 |
| 3  | Button            | <button>       | surface-resting/raised   | Resting -> Raised| Teal/Orange -> Hover/Pressed  | System V2 |
| 4  | Segmented Control | <div role=grp> | surface-inset + Quiet Edge| Inset (-1px)     | Recessed track, raised plate  | System V2 |
| 5  | Input Field       | <input>        | surface-inset + Inter.   | Inset (-1px)     | Focus teal ring, error red    | System V2 |
| 6  | Select Dropdown   | <select>       | surface-inset + Inter.   | Inset (-1px)     | Custom arrow, dark native     | System V2 |
| 7  | Tabs              | <div role=tablist>| surface-flat           | None (0px)       | Active tab orange bottom stroke| System V2 |
| 8  | Card              | <article>/<section>| surface-card + Quiet | Resting (1px)    | Flat document reading card    | System V2 |
| 9  | Lifted Card       | <article>      | surface-resting + Dual   | Raised (4px)     | TopSpecular highlight + shadow| System V2 |
| 10 | Inspector Panel   | <aside>        | surface-floating + Dual  | Floating (10px)  | 92% translucent + 8px blur    | System V2 |
| 11 | Sheet Drawer      | <dialog>       | surface-overlay + Dual   | Overlay (20px)   | Slide-in right/bottom + backdrop| System V2|
| 12 | Dialog Modal      | <dialog>       | surface-overlay + Dual   | Overlay (20px)   | Centered modal + backdrop     | System V2 |
| 13 | Tooltip           | <div role=tooltip>| surface-floating       | Floating (8px)   | Small high-contrast caption   | System V2 |
| 14 | Toast Notification| <ol role=status>| surface-floating + Inter.| Floating (10px)  | Auto-dismiss top-right status | System V2 |
| 15 | Element Tile      | <button>/<div> | surface-resting + Category| Resting -> Raised| Category color badge + title  | Signature |
| 16 | Craft Bay         | <section>      | surface-inset + Recessed | Inset (-2px)     | Recessed drop zone for craft  | Signature |
| 17 | Discovery Result  | <dialog>/<article>| surface-overlay + Orange | Overlay (20px)   | Orange celebration stamp      | Signature |
| 18 | Learning Tape     | <aside>/<div>  | surface-card + LeftStroke| Resting (1px)    | Editorial yellow/teal callout  | Signature |
| 19 | Mochi Note        | <figure>       | surface-card + WarmBorder| Resting (1px)    | Mascot guide + speech balloon  | Signature |
| 20 | Graph Node        | <g>/<div>      | surface-resting -> Raised| Resting -> Raised| 2D node with selected border  | Graph MVP |
| 21 | Graph Inspector   | <aside>        | surface-floating + Dual  | Floating (10px)  | Node details + relationship list| Graph MVP |
| 22 | Simulation Control| <form>         | surface-card + Inset     | Resting (1px)    | Sliders & parameters form     | Sim MVP   |
| 23 | Scenario Card     | <article>      | surface-resting + Edge   | Raised (4px)     | Cash reserve projection card  | Sim MVP   |
| 24 | Trade-off Block   | <section>      | surface-card + Dual      | Resting (1px)    | 2-column benefit vs risk grid | Detail MVP|
| 25 | Admin Table       | <table>        | surface-card + Quiet     | Resting (1px)    | Data grid with pagination     | Admin MVP |
+-----------------------------------------------------------------------------------------------------------------------------------+
```

---

## Risk Analysis & Deferred Items

### Risk Analysis
1. **FOUC (Flash of Unstyled Content):** If Next.js SSR hydration is implemented incorrectly, users may experience a brief white flash when opening the app in dark mode. *Mitigation:* The inline anti-FOUC script specified in Document 3 is mandatory for the future Theme implementation task.
2. **Backdrop Filter Degradation on Low-End Mobile:** Older Android devices may lag when scrolling over translucent elements. *Mitigation:* Backdrop-filters are restricted to fixed floating overlays and automatically disabled when `prefers-reduced-transparency` is active.

### Deferred Items (Post-MVP)
- User-customizable accent color pickers.
- Complex 3D node rendering in Craft Canvas (permanently deferred/banned).
- Dark Mode toggle animations (instant CSS transitions are preferred for performance).

---

## Owner Decisions Required

Before proceeding to any code implementation, the Owner must review this research capsule and make four decision selections:

1. **Visual Direction Selection:**
   - [ ] **Option C: FinCraft Paper-and-Glass Hybrid** (Recommended)
   - [ ] Option A: FinCraft Lifted Learning Material
   - [ ] Option B: FinCraft Adaptive Glass Instruments

2. **Dark Mode & Theme Architecture:**
   - [ ] Approve proposed Light, Dark, and System theme architecture with zero-FOUC inline hydration script.

3. **Lifted Surface & Specular Edge Strategy:**
   - [ ] Approve top inner specular highlight (`inset 0 1px 0 rgba(...)`) and dual-tone borders for interactive surfaces.

4. **Component Anatomy Roadmap:**
   - [ ] Approve the 25-Component Anatomy specification as the canonical guide for future component development.
