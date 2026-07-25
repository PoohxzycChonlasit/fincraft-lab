# FinCraft Visual Direction Options

## Decision context

FinCraft is a light-first financial literacy discovery product: 65% professional/educational and 35% playful/laboratory. The visual system must preserve the existing teal trust/action family, orange Craft/Discovery family, warm neutral surfaces, controlled Mochi usage, clear safety language, and normal-hardware performance.

Scores use `1 = weak/low` and `10 = strong/high`. For **implementation difficulty**, a higher score means harder to implement and maintain.

## A. TACTILE_DISCOVERY_LAB

### Definition

- **Brand personality:** A friendly precision instrument: curious, capable, warm, and trustworthy.
- **Surfaces:** Warm off-white laboratory field; mostly flat reading regions; shallow inset control wells; raised primary controls; selected graph nodes receive a single soft elevation step.
- **Typography:** Inter/Noto Sans Thai for product, controls, numbers, and nodes. Optional editorial serif only for large marketing statements, never for financial data or controls.
- **Colour behaviour:** Teal communicates trust/action. Orange is scarce and event-based: Craft action, new discovery, or selected provenance. Category colours remain supporting identifiers. No decorative rainbow gradients.
- **Component geometry:** 6–12 px tokenized radii. Tactile depth comes from border, inner highlight, and short static shadow—not large floating cards.
- **Density:** Medium in tool regions, relaxed in learning content. Controls group by function with hairline separators.
- **Mochi usage:** Onboarding, empty guidance, discovery success, simulation explanation, or safety reminder only. Mochi never enters the graph as a concept node or Recipe input.
- **Graph treatment:** Simple 2D nodes and edges by default. Selected nodes become gently dimensional. Local-first views, labelled relation patterns, and a persistent detail/list alternative.
- **Mobile treatment:** One dominant canvas or article region; bottom sheets for filters/details; Concept Orbit starts at depth one; 44 px controls; no tiny persistent toolbar.
- **Strengths:** Distinctive without a new brand identity; matches the owner's Kigen preference at the control-system level; supports Craft cause/effect; compatible with existing tokens.
- **Weaknesses:** Requires disciplined state design. Overuse of inset/raised surfaces can become skeuomorphic or visually noisy.
- **Performance implications:** Low to moderate. Static CSS borders/shadows are cheap when limited. Graph style stays simple.
- **Accessibility implications:** Physical cues reinforce states, but every cue still needs semantic labels, contrast, focus-visible, and non-colour encoding.
- **Implementation complexity:** Moderate: token refinements, reusable state variants, and careful review; no custom rendering engine.
- **AI-slop risks:** Excess bevels, every card floating, gummy buttons, random knobs, fake lab labels, ornamental graph glow.

### Scores

| Criterion | Score | Reason |
|---|---:|---|
| Uniqueness | 9 | Tool tactility plus financial discovery is uncommon when applied selectively. |
| Financial trust | 8 | Teal, readable data, and restrained surfaces retain credibility. |
| Learning clarity | 9 | Tool and reading regions can have different densities without changing identity. |
| Playfulness | 8 | Cause/effect and gentle dimension feel playful without cartoon styling. |
| Mobile viability | 8 | Works with sheets and local graph budgets; depth must stay minimal. |
| Accessibility | 8 | Multiple state cues are possible; contrast needs explicit validation. |
| Performance | 9 | Static 2D surfaces and bounded graph rendering are inexpensive. |
| Maintainability | 8 | Strong if tactile states become tokens/variants, weak if hand-authored per page. |
| Implementation difficulty | 6 | More judgment than a flat system, but no exotic technology. |
| Graph compatibility | 9 | Selected-node dimension and flat normal nodes create useful hierarchy. |
| Resistance to generic AI UI | 9 | A coherent tool metaphor resists generic card-dashboard output. |

## B. EDITORIAL_FINANCE_WORKSHOP

### Definition

- **Brand personality:** An approachable financial journal and guided workshop: calm, literate, source-conscious, and mature.
- **Surfaces:** Mostly flat paper-like warm neutrals with rules, columns, callouts, and occasional framed examples.
- **Typography:** Strong reading hierarchy. Inter/Noto Sans Thai remain functional fonts; a restrained editorial serif may appear in marketing and major educational headings only.
- **Colour behaviour:** Teal for action and navigation; orange as a margin mark or discovery highlight; semantic amber/red for risks. Large areas remain neutral.
- **Component geometry:** Squarer composition, thin borders, few shadows, generous reading measures.
- **Density:** Low to medium in articles; compact tables and source lists; less suited to dense canvas controls.
- **Mochi usage:** Margin-note guide, article empty state, or safety explainer; never continuous decoration.
- **Graph treatment:** Graph is an index/diagram embedded in an editorial shell. Labels and explanatory list dominate over decorative nodes.
- **Mobile treatment:** Excellent single-column reading; relationship groups become accordions; graph becomes a local diagram plus list.
- **Strengths:** Highest trust and long-form learning clarity; excellent source/disclaimer presentation; lowest visual/rendering cost.
- **Weaknesses:** Craft interaction may feel less playful and less distinctive as a tool; graph can feel like an appendix.
- **Performance implications:** Low. Mostly typography, rules, and static surfaces.
- **Accessibility implications:** Strong reading order and semantic structure; serif scale, line length, and table overflow need care.
- **Implementation complexity:** Low to moderate.
- **AI-slop risks:** Fashion-magazine pastiche, oversized serif heroes, fake editorial labels, endless rule lines, or beige sameness.

### Scores

| Criterion | Score | Reason |
|---|---:|---|
| Uniqueness | 7 | Distinct from SaaS but increasingly common in premium finance/editorial sites. |
| Financial trust | 9 | Reading and source hierarchy communicate seriousness. |
| Learning clarity | 10 | Best option for lessons, trade-offs, and citations. |
| Playfulness | 5 | Workshop tone is warm but less interactive. |
| Mobile viability | 9 | Linear editorial flow adapts naturally. |
| Accessibility | 9 | Semantic document structure is straightforward. |
| Performance | 10 | Lowest decorative/rendering cost. |
| Maintainability | 9 | Few effects and clear content primitives. |
| Implementation difficulty | 4 | Mostly typography and layout discipline. |
| Graph compatibility | 6 | Supports explanatory diagrams more than exploratory graph interaction. |
| Resistance to generic AI UI | 8 | Strong when genuinely editorial; weak if it becomes a serif-and-beige template. |

## C. PLAYFUL_MODULAR_KNOWLEDGE_CANVAS

### Definition

- **Brand personality:** A modular discovery toy for serious ideas: energetic, combinable, visual, and exploratory.
- **Surfaces:** Colour-coded tiles, modular blocks, socket-like connections, and a spacious canvas.
- **Typography:** Sans-only, compact node labels, clear numerical styles, and stronger category labelling.
- **Colour behaviour:** Category colours are more visible; teal/orange retain semantic priority. Colour saturation must be capped.
- **Component geometry:** Interlocking modules, notched or connected edges, and more varied node silhouettes.
- **Density:** Medium to high on desktop; deliberately reduced on mobile.
- **Mochi usage:** Onboarding and empty-state navigator only. Additional character-like node decoration is prohibited.
- **Graph treatment:** Graph and Craft Canvas share a modular visual grammar. Recipe direction and relationship types are highly visible.
- **Mobile treatment:** Focus mode shows one concept and a small ring of neighbours; list-first fallback is prominent.
- **Strengths:** Highest playfulness and immediate graph compatibility; visually memorable; crafting feels central.
- **Weaknesses:** Greatest risk of childishness, category-colour overload, complex custom nodes, and reduced long-form trust.
- **Performance implications:** Moderate to high if node shapes, shadows, labels, and connectors become complex. Must remain SVG/CSS 2D.
- **Accessibility implications:** Strong non-colour patterns are possible, but irregular shapes and dense canvas interaction raise keyboard/cognitive load.
- **Implementation complexity:** Highest of the three; needs more variants, layout testing, and responsive reductions.
- **AI-slop risks:** Toy blocks, candy colours, blob nodes, excessive badges, random icons, decorative connections, and novelty over meaning.

### Scores

| Criterion | Score | Reason |
|---|---:|---|
| Uniqueness | 9 | Strong visual ownership is possible. |
| Financial trust | 6 | Requires significant restraint to avoid toy-like finance. |
| Learning clarity | 7 | Connections are clear, but long-form detail competes with the canvas metaphor. |
| Playfulness | 10 | Highest playful discovery value. |
| Mobile viability | 6 | Needs aggressive local scope and alternate views. |
| Accessibility | 6 | More shapes and interactions create more failure modes. |
| Performance | 7 | Acceptable only with simple static nodes and strict budgets. |
| Maintainability | 6 | More variants and bespoke geometry increase review cost. |
| Implementation difficulty | 8 | Most custom visual and responsive work. |
| Graph compatibility | 10 | The graph is native to the direction. |
| Resistance to generic AI UI | 9 | Distinctive, but can become generic “playful AI canvas” slop. |

## Comparative scorecard

| Criterion | A. Tactile Discovery Lab | B. Editorial Finance Workshop | C. Playful Modular Canvas |
|---|---:|---:|---:|
| Uniqueness | 9 | 7 | 9 |
| Financial trust | 8 | 9 | 6 |
| Learning clarity | 9 | 10 | 7 |
| Playfulness | 8 | 5 | 10 |
| Mobile viability | 8 | 9 | 6 |
| Accessibility | 8 | 9 | 6 |
| Performance | 9 | 10 | 7 |
| Maintainability | 8 | 9 | 6 |
| Implementation difficulty (higher = harder) | 6 | 4 | 8 |
| Graph compatibility | 9 | 6 | 10 |
| Resistance to generic AI UI | 9 | 8 | 9 |

## Recommendation: FinCraft Tactile Discovery Lab

Recommend **A. TACTILE_DISCOVERY_LAB** as the leading visual direction, with two controlled borrowings:

1. Use **B's editorial hierarchy** for Discovery Detail, source lists, risk/trade-off explanations, and safety language.
2. Use **C's modular clarity** only for graph relation encoding and Craft cause/effect—not for the full page chrome.

This direction wins because it balances all product constraints rather than maximizing spectacle. It can feel distinctive and playful while remaining fast, light-first, readable, and credible. Its main cost is design discipline: selected and interactive things may feel dimensional; ordinary reading containers should remain flat.

## Kigen's exact role

Kigen is a reference for:

- control anatomy;
- shallow, stateful elevation;
- input wells and compact labels;
- spacing rhythm and separators;
- disciplined tokens and variants;
- a product that feels like a tool.

Kigen is explicitly not a reference for:

- FinCraft layout, brand, navigation, content, logo, colour identity, or exact components;
- generic SaaS templates;
- copying its generator strip or component library.

## Implementation guardrails for a future design-system step

- Create one elevation/state ladder, not per-component shadows.
- Normal surfaces stay flat; selected/pressed/floating controls earn depth.
- Teal remains trust/action; orange remains Craft/Discovery.
- No 3D, WebGL, particles, perpetual animation, large blur fields, or animated graph edges.
- Every tactile cue must have a semantic state and visible focus equivalent.
- Validate mobile at the same time as desktop.
- Keep Server Components as the default; tactile interaction remains inside bounded Client Component islands.
- Do not install packages or begin Product UI until the owner freezes a direction.

## Owner decisions required

1. Approve or reject **FinCraft Tactile Discovery Lab**.
2. Approve the editorial borrowing for learning/detail pages.
3. Confirm that selected controls/nodes may use shallow dimension while normal content remains flat.
4. Confirm that no visual direction changes the frozen colour semantics or Mochi role.
