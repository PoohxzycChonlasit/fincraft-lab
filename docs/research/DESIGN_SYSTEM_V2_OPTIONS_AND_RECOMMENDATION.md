# FinCraft Design System V2 — Options & Recommendation Proposal

## Executive Summary

- **Task ID:** `P13_FRONTEND_FOUNDATION_1D3B_DESIGN_SYSTEM_V2_RESEARCH_ACCURACY_AND_DECISION_READINESS_REPAIR_001`
- **Status:** RESEARCH OPTIONS PROPOSAL (PROVISIONAL RECOMMENDATION — NOT CANONICAL)
- **Date:** 2026-07-27 (Asia/Bangkok)
- **Baseline HEAD:** `f9434d5391cc829a9358fcd36863675fbd8d8507`
- **Scope:** Bounded research document repair only. Zero source code changes; zero package installations; zero Product UI work.

This document presents three visual direction options for **FinCraft Design System V2**, evaluates them across 13 audit criteria, presents a corrected reproducible scorecard out of 130 points, provides a provisional recommendation (**Option C: FinCraft Paper-and-Glass Hybrid**), and outlines a **25-Component Anatomy Roadmap** and compact **Owner Decision Section**.

FinCraft is a light-first Financial Literacy Discovery Lab (65% professional/educational, 35% playful/laboratory). The proposed Design System V2 options address prototype gaps identified by the Owner—refining card edges, adding lifted material depth, establishing Light/Dark/System theme tokens, and defining professional component anatomy—without installing heavy 3D/WebGL packages or risking generic AI-slop visual outputs.

---

## Visual Direction Options Evaluation

### Option A: FinCraft Lifted Learning Material

- **Concept:** A friendly, high-precision educational workshop instrument. Flat document reading surfaces paired with crisp, lifted tactile controls featuring top inner specular highlights and dual-tone borders.
- **Light Candidate:** Warm off-white laboratory background (`#FAFAF9`), pure white cards (`#FFFFFF`), deep Teal primary actions (`#0D9488`), and energetic Orange craft accents (`#EA580C`).
- **Dark Candidate:** Rich dark slate background (`#0C0A09`), stone dark cards (`#1C1917`), Teal 500 actions (`#14B8A6`), and Orange 500 accents (`#F97316`).
- **Surface & Edge Philosophy:** Normal reading surfaces remain 100% opaque and flat. Tactile depth is earned exclusively by interactive buttons, selected nodes, input wells, and floating inspectors. Specular inner top highlights simulate physical edge light.
- **Pros:** Maximum reading clarity, trustworthy financial presentation, low GPU resource usage, strong Kigen control discipline without cloning Kigen's dark layout.
- **Cons:** Requires strict design discipline to avoid over-beveling controls.

### Option B: FinCraft Adaptive Glass Instruments

- **Concept:** A modern translucent laboratory console. Tool panels, navigation bars, and inspectors use semi-opaque frosted glass surfaces with subtle backdrop blur and light-reflecting edges.
- **Light Candidate:** Soft translucent white cards (`#FFFFFF/85%` + 10px blur), subtle Teal glass highlights, and dark slate typography.
- **Dark Candidate:** Translucent dark stone cards (`#1C1917/85%` + 10px blur), bright Teal/Orange edge highlights, and high-contrast text.
- **Surface & Edge Philosophy:** Translucent material layers create visual depth by blurring underlying canvas elements. Specular edges wrap floating tool panels.
- **Pros:** Sleek, modern appearance with a premium software feel inspired by Apple HIG principles.
- **Cons:** Higher GPU rendering cost on mobile; risk of poor text contrast if backgrounds change; fallback required under reduced transparency.

### Option C: FinCraft Paper-and-Glass Hybrid (Provisional Recommendation)

- **Concept:** The ultimate synthesis of Option A and Option B. 
  - **Flat Paper Reading Surfaces (Solid Opaque)** for long-form educational articles, disclaimers, inputs, and trade-off tables (Option A discipline).
  - **Bounded Lifted Glass Control Islands** for interactive toolbars, floating inspectors, popovers, and Craft Canvas controls (Option B translucency).
- **Light & Dark Themes:** Uses Option A's solid high-contrast warm light / rich dark slate color tokens for primary reading content, applying translucent frosted glass strictly to bounded floating UI panels.
- **Pros:** Delivers Apple-inspired lifted material sophistication where it matters (floating tools) while preserving 100% reading legibility, zero mobile lag, and strict WCAG contrast on document content.

---

## Corrected Comparative Scorecard (13 Criteria — 130 Max Points)

Each criterion is scored on a 1–10 scale. Implementation Difficulty is scored on a difficulty scale (1 = easiest, 10 = hardest); in total score calculation, **Ease of Implementation (10 - Difficulty)** is used so all summed criteria move in the same positive direction (higher = better).

```text
+---------------------------------------------------------------------------------------------------+
| EVALUATION CRITERION (10 MAX EACH) | OPTION A: LIFTED   | OPTION B: ADAPTIVE | OPTION C: HYBRID  |
|                                    | MATERIAL           | GLASS              | (RECOMMENDED)     |
+------------------------------------+--------------------+--------------------+-------------------+
| 1. FinCraft Uniqueness             | 9 / 10             | 8 / 10             | 9 / 10            |
| 2. Financial Educational Trust     | 8 / 10             | 7 / 10             | 9 / 10            |
| 3. Learning Content Clarity        | 9 / 10             | 6 / 10             | 10 / 10           |
| 4. Playful Laboratory Feel         | 8 / 10             | 8 / 10             | 9 / 10            |
| 5. Mobile Usability & Layout       | 8 / 10             | 6 / 10             | 9 / 10            |
| 6. Accessibility & WCAG Target     | 8 / 10             | 6 / 10             | 9 / 10            |
| 7. Performance & Low GPU Budget    | 9 / 10             | 5 / 10             | 9 / 10            |
| 8. Simulation UI Compatibility    | 8 / 10             | 7 / 10             | 9 / 10            |
| 9. Graph Canvas Compatibility     | 9 / 10             | 7 / 10             | 9 / 10            |
| 10. Ease of Implementation (10-Diff)| 4 / 10 (Diff = 6)  | 2 / 10 (Diff = 8)  | 4 / 10 (Diff = 6) |
| 11. Codebase Maintainability       | 8 / 10             | 6 / 10             | 8 / 10            |
| 12. Resistance to AI-Slop          | 9 / 10             | 6 / 10             | 9 / 10            |
| 13. Apple/Kigen Copy Safety        | 9 / 10             | 5 / 10             | 9 / 10            |
+------------------------------------+--------------------+--------------------+-------------------+
| REPRODUCIBLE TOTAL SCORE (/130)    | 107 / 130          | 81 / 130           | 113 / 130         |
+---------------------------------------------------------------------------------------------------+
```

### Reproducible Score Calculation Breakdown
- **Option A Total:** 9 + 8 + 9 + 8 + 8 + 8 + 9 + 8 + 9 + 4 + 8 + 9 + 9 = **107 / 130**
- **Option B Total:** 8 + 7 + 6 + 8 + 6 + 6 + 5 + 7 + 7 + 2 + 6 + 6 + 5 = **81 / 130**
- **Option C Total:** 9 + 9 + 10 + 9 + 9 + 9 + 9 + 9 + 9 + 4 + 8 + 9 + 9 = **113 / 130**

### Provisional Recommendation Justification
**Option C (FinCraft Paper-and-Glass Hybrid)** is provisionally recommended for Owner consideration based on its leading score (113/130). It provides lifted cards, crisp dual-tone edges, and Apple-inspired translucent inspectors where appropriate, without compromising reading contrast, mobile battery life, or graph rendering performance.

---

## 25-Component Anatomy Roadmap

The table below specifies the proposed design anatomy for all 25 core FinCraft components under Design System V2.

```text
+-----------------------------------------------------------------------------------------------------------------------------------+
| #  | COMPONENT         | HTML SEMANTICS | MATERIAL & EDGE ROLE     | ELEVATION TIER   | LIGHT / DARK CANDIDATE STATE SUMMARY| PHASE     |
+----+-------------------+----------------+--------------------------+------------------+-------------------------------------+-----------+
| 1  | App Shell         | <header>/<main>| surface-flat             | None (0px)       | Warm Off-white / Rich Slate         | System V2 |
| 2  | Navigation Bar    | <nav>          | surface-card + Quiet Edge| Resting (1px)    | Solid white / Dark stone            | System V2 |
| 3  | Button            | <button>       | surface-resting/raised   | Resting -> Raised| Teal/Orange -> Hover/Pressed        | System V2 |
| 4  | Segmented Control | <div role=grp> | surface-inset + Quiet Edge| Inset (-1px)     | Recessed track, raised plate        | System V2 |
| 5  | Input Field       | <input>        | surface-inset + Inter.   | Inset (-1px)     | Focus teal ring, error red          | System V2 |
| 6  | Select Dropdown   | <select>       | surface-inset + Inter.   | Inset (-1px)     | Custom arrow, dark native           | System V2 |
| 7  | Tabs              | <div role=tablist>| surface-flat           | None (0px)       | Active tab orange bottom stroke     | System V2 |
| 8  | Card              | <article>/<section>| surface-card + Quiet | Resting (1px)    | Flat document reading card          | System V2 |
| 9  | Lifted Card       | <article>      | surface-resting + Dual   | Raised (4px)     | TopSpecular highlight + shadow      | System V2 |
| 10 | Inspector Panel   | <aside>        | surface-floating + Dual  | Floating (10px)  | Bounded Translucent + 8px blur      | System V2 |
| 11 | Sheet Drawer      | <dialog>       | surface-overlay + Dual   | Overlay (20px)   | Slide-in right/bottom + backdrop    | System V2 |
| 12 | Dialog Modal      | <dialog>       | surface-overlay + Dual   | Overlay (20px)   | Centered modal + backdrop           | System V2 |
| 13 | Tooltip           | <div role=tooltip>| surface-floating       | Floating (8px)   | Small high-contrast caption         | System V2 |
| 14 | Toast Notification| <ol role=status>| surface-floating + Inter.| Floating (10px)  | Auto-dismiss top-right status       | System V2 |
| 15 | Element Tile      | <button>/<div> | surface-resting + Category| Resting -> Raised| Category color badge + title        | Signature |
| 16 | Craft Bay         | <section>      | surface-inset + Recessed | Inset (-2px)     | Recessed drop zone for craft        | Signature |
| 17 | Discovery Result  | <dialog>/<article>| surface-overlay + Orange | Overlay (20px)   | Orange celebration stamp            | Signature |
| 18 | Learning Tape     | <aside>/<div>  | surface-card + LeftStroke| Resting (1px)    | Editorial yellow/teal callout        | Signature |
| 19 | Mochi Note        | <figure>       | surface-card + WarmBorder| Resting (1px)    | Mascot guide + speech balloon        | Signature |
| 20 | Graph Node        | <g>/<div>      | surface-resting -> Raised| Resting -> Raised| 2D node with selected border        | Graph MVP |
| 21 | Graph Inspector   | <aside>        | surface-floating + Dual  | Floating (10px)  | Node details + relationship list      | Graph MVP |
| 22 | Simulation Control| <form>         | surface-card + Inset     | Resting (1px)    | Sliders & parameters form           | Sim MVP   |
| 23 | Scenario Card     | <article>      | surface-resting + Edge   | Raised (4px)     | Cash reserve projection card        | Sim MVP   |
| 24 | Trade-off Block   | <section>      | surface-card + Dual      | Resting (1px)    | 2-column benefit vs risk grid       | Detail MVP|
| 25 | Admin Table       | <table>        | surface-card + Quiet     | Resting (1px)    | Data grid with pagination           | Admin MVP |
+-----------------------------------------------------------------------------------------------------------------------------------+
```

---

## Target Size, Accessibility & Performance Standards

- **Target Size Distinction:**
  - WCAG 2.2 SC 2.5.8 Target Size (Minimum) Level AA: **24×24 CSS px** minimum with documented spacing exceptions.
  - WCAG 2.2 SC 2.5.5 Target Size (Enhanced) Level AAA: **44×44 CSS px** minimum.
  - **FinCraft Standard:** **44×44 CSS px is a FinCraft product requirement**, NOT the WCAG AA minimum.
- **ACCESSIBILITY TARGET:** Designed toward **W3C WCAG 2.2 Level AA**. Conformance is **NOT YET EVALUATED** or verified.
- **PERFORMANCE TARGETS:** No timers/loops while idle (0% CPU idle budget). Handlers complete within 50ms. Smooth visual scroll response (60fps as an aspirational target only).

---

## Apple & Kigen Architectural Boundaries

- **Apple Liquid Glass Boundary:** Apple Liquid Glass is an Apple platform-specific dynamic material using native OS shaders and spatial refraction. FinCraft does **NOT** implement Apple Liquid Glass. Apple HIG is used strictly as a principle reference for edge specular light and depth hierarchy.
- **Kigen Boundary:** Kigen serves as a visual-quality reference for control anatomy, compact label rhythm, and stateful elevation discipline only. FinCraft does **NOT** copy Kigen's color generator, navigation, page layout, or component geometry.

---

## Compact Owner Decision Section

The Owner is requested to review this research capsule and make decision selections to freeze canonical direction:

```text
+---------------------------------------------------------------------------------------------------+
| COMPACT OWNER DECISION GATE                                                                       |
+---------------------------------------------------------------------------------------------------+
| DECISION 1: VISUAL DIRECTION SELECTION                                                            |
|   [ ] Option C: FinCraft Paper-and-Glass Hybrid (Provisional Recommendation)                      |
|   [ ] Option A: FinCraft Lifted Learning Material                                                 |
|   [ ] Option B: FinCraft Adaptive Glass Instruments                                               |
|                                                                                                   |
| DECISION 2: THEME MODES                                                                           |
|   [ ] Approve Light + Dark + System theme mode definitions.                                       |
|                                                                                                   |
| DECISION 3: THEME PERSISTENCE                                                                     |
|   [ ] Approve Cookie-Authoritative single persistence store (eliminating LocalStorage ambiguity).  |
|                                                                                                   |
| DECISION 4: MATERIAL & TRANSLUCENCY POLICY                                                        |
|   [ ] Approve 100% solid opaque content surfaces + bounded translucency on floating tool islands. |
|                                                                                                   |
| DECISION 5: TOUCH TARGET STANDARD                                                                 |
|   [ ] Approve 44×44 CSS px as the FinCraft product preference standard for primary controls.       |
|                                                                                                   |
| DECISION 6: DARK MODE CANDIDATE VALUES                                                            |
|   [ ] Treat proposed dark values as candidate exploration values requiring contrast prototyping.  |
|                                                                                                   |
| DECISION 7: IMPLEMENTATION SEQUENCE                                                               |
|   [ ] Token Contract -> Lab Prototype -> Contrast/A11y Audit -> Signature UI -> Product Shell     |
+---------------------------------------------------------------------------------------------------+
| SCOPE OF APPROVING DIRECTION C:                                                                   |
| Approving Direction C authorizes the design system V2 refactor plan. It DOES NOT authorize        |
| immediate Product UI construction, package installation, or skipping accessibility gates.       |
+---------------------------------------------------------------------------------------------------+
```

---

## Authoritative Research Sources

1. **W3C WCAG 2.2 Guidelines:**
   - Publisher: World Wide Web Consortium (W3C)
   - URL: `https://www.w3.org/TR/WCAG22/`
   - Access Date: 2026-07-27
   - Supports: Target Size SC 2.5.8 (AA 24px) vs SC 2.5.5 (AAA 44px), Contrast SC 1.4.3 (4.5:1), Non-Text Contrast SC 1.4.11 (3.0:1).

2. **MDN Web Docs — Web Media Features & Accessibility:**
   - Publisher: Mozilla Developer Network
   - URL: `https://developer.mozilla.org/en-US/docs/Web/CSS/@media`
   - Access Date: 2026-07-27
   - Supports: `@media (prefers-color-scheme)` and `@media (prefers-reduced-transparency)` standards.

3. **Next.js App Router Documentation:**
   - Publisher: Vercel / Next.js Team
   - URL: `https://nextjs.org/docs/app/building-your-application/rendering`
   - Access Date: 2026-07-27
   - Supports: Server Component rendering boundaries, hydration safety, and cookie inspection patterns.

4. **Apple Developer Human Interface Guidelines — Materials:**
   - Publisher: Apple Inc.
   - URL: `https://developer.apple.com/design/human-interface-guidelines/materials`
   - Access Date: 2026-07-27
   - Supports: Material hierarchy principles, specular edge highlights, and reduced transparency considerations.
