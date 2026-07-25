# FinCraft Lab — Design Direction & Visual Identity

## Product Identity & Core Aesthetic

FinCraft Lab is a **Financial Literacy Discovery Lab**. It combines elements, discovers concepts, and runs financial simulations in an interactive visual workspace.

### Design Ratio & Personality
- **65% Professional & Educational**: Clean typography, trustworthy teal actions, structured data cards, clear financial trade-off tables, clear disclaimers.
- **35% Playful & Laboratory**: Warm neutral surfaces, vibrant category badge colors, energetic discovery orange accents, friendly companion guide (Mochi), interactive alchemy-style crafting equations.

### Light-First MVP Approach
The MVP is designed **Light-First** using warm off-white and soft neutral laboratory surfaces (`#FAFAF9`, `#F5F5F4`), providing high contrast and comfortable long-form reading for educational content.

---

## Color System Principles

| Role | Color Family | Intended Usage |
|---|---|---|
| Primary Action & Trust | Deep Teal (`#0D9488` / `#0F766E`) | Main buttons, navigation links, active states, progress indicators |
| Craft & Discovery Accent | Energetic Orange (`#EA580C` / `#F97316`) | Crafting button, successful discovery highlights, milestone nodes |
| Base Surfaces | Warm Neutrals (`#FAFAF9`, `#FFFFFF`) | Laboratory canvas background, card surfaces, side panels |
| Text & Data | Charcoal & Slate (`#1C1917`, `#44403C`) | Primary typography, data values, table headers |
| Safety & Education | Warm Amber & Soft Red | Educational disclaimer banners, high-risk flags, trade-off warnings |

---

## Role of Mochi (Companion Guide)

Mochi is an educational guide and laboratory assistant.

### Approved Functional Roles for Mochi
1. **Onboarding**: Welcoming new users during registration and pet setup.
2. **Contextual Guidance**: Explaining complex financial trade-offs (e.g. inflation or compound interest).
3. **Empty States**: Providing helpful prompts when a workspace or vault has no items.
4. **Discovery Moments**: Celebrating newly discovered financial elements.
5. **Simulation Insights**: Summarizing simulation results (e.g. survival months).
6. **Educational Safety Reminders**: Emphasizing "Education Only / Not Financial Advice".

### Forbidden Roles for Mochi
- Mochi must NEVER be used as a Craft Recipe input on the Canvas.
- Mochi must NOT appear in every card corner or header section.
- Mochi must NOT block interactive controls or obscure canvas nodes.

## Canonical visual freeze

The approved direction is **FinCraft Tactile Discovery Lab**. FinCraft is not full neumorphism, a Kigen clone, or a generic SaaS dashboard.

- **Editorial borrowing:** Use an editorial finance workshop hierarchy for Discovery Detail, learning content, sources, trade-offs, risks, safety language, and long-form explanation.
- **Modular borrowing:** Use playful modular knowledge-canvas language only for Craft cause/effect, Element combination, graph relationship encoding, and visual modularity inside Canvas.
- **Kigen boundary:** Borrow control anatomy, shallow stateful elevation, input wells, compact labels, separators, spacing rhythm, token discipline, and tool-like interaction. Do not borrow Kigen layout, logo, brand colours, navigation, page structure, content, exact components, or generator-strip presentation.
- **Depth rule:** Normal reading content remains flat. Dimension is reserved for interactive, pressed, selected, drag, inset input/drop, and floating overlay states.
- **Signature language:** Specimen Element Tile, Recessed Craft Bay, Orange Discovery Stamp, Financial Learning Tape, Mochi Lab Note, and Discovery Web Connection Language.

These signatures are design contracts, not permission to create Product UI in this freeze task.

## Canonical prohibitions

The visual system must reject nested card walls, excessive pills, fake metrics or activity, decorative gradients, repeated oversized CTAs, mascot flooding, meaningless sparkle decoration, arbitrary shadows, and generic SaaS dashboard composition. Teal remains the trust/action family, orange remains the Craft/Discovery family, and category colours remain supporting identifiers.

No 3D, WebGL, particles, video backgrounds, large full-screen blur layers, continuously animated gradients, animated graph edges, continuous force simulation, perpetual layout calculation, or decorative infinite motion is permitted. Motion must explain a state change, remain finite, support reduced motion, and never carry meaning that is unavailable in text.

---

## Anti-AI-Slop Rules (Strict Design Hygiene)

To prevent the application from drifting into generic, over-decorated AI-generated UI, all designs MUST reject:

1. **Card Overuse**: Do NOT wrap every tiny label or section in nested floating cards.
2. **Pill Saturation**: Do NOT flood headers with meaningless pill badges.
3. **Fake Metrics & Fake Activity**: Do NOT display fake user counts, fake live feeds, or fake social proof.
4. **Gratuitous Gradients**: Do NOT apply heavy multi-color background gradients behind standard text.
5. **Repeated Oversized CTAs**: Only ONE primary call to action per screen section.
6. **Generic SaaS Dashboards**: Avoid generic grid layouts that look like analytics dashboards.
7. **Mascot Flooding**: Keep Mochi strictly in functional guidance roles.
8. **Sparkle Decoration**: Do NOT scatter decorative sparkle or star icons across standard UI.
9. **Desktop-Only Thinking**: Every page MUST have an explicit, touch-friendly mobile layout.

---

## TasteSkill Authority Hierarchy

TasteSkill serves as a supplemental visual review tool. It MUST follow the project authority hierarchy:

```text
1. AGENTS.md & Project Context
2. FinCraft Frontend Engineering Skill (.agents/skills/fincraft-frontend-engineering/SKILL.md)
3. FinCraft Design Direction & Tokens (docs/design/*)
4. Frontend System Design (docs/architecture/*)
5. TasteSkill Visual Review
6. Page Task Prompt
```

TasteSkill CANNOT override accessibility standards, FinCraft color semantics, Mochi functional rules, responsive requirements, or backend API contracts.
