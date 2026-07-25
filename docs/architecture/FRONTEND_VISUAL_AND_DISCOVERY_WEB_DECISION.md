# FinCraft Lab Visual and Discovery Web Decision

## Decision status

- **Status:** APPROVED
- **Date:** 2026-07-25 (Asia/Bangkok)
- **Task ID:** `P13_FRONTEND_FOUNDATION_1C1_OWNER_VISUAL_AND_DISCOVERY_WEB_DECISION_001`
- **Decision type:** Owner-approved canonical contract freeze
- **Research basis:** The preceding visual-reference and Discovery Web research task was completed in commit `90f7894741736103e34567b46c4c8cc93980f723`.

This document freezes the approved visual direction and Discovery Web boundaries for future implementation. It does not authorize Product UI, package installation, backend work, database changes, or research-history edits.

## Owner decisions

### Visual direction

The canonical direction is **FinCraft Tactile Discovery Lab**.

FinCraft is not full neumorphism, a Kigen clone, or a generic SaaS dashboard. It is a light-first financial literacy product that combines a trustworthy educational reading experience with a precise, tactile tool experience.

Normal reading content stays flat. Depth is earned by interactive controls, pressed or selected states, drag states, inset input/drop areas, and floating overlays. A container must not become dimensional merely because it is a container.

Approved signature language:

- Specimen Element Tile
- Recessed Craft Bay
- Orange Discovery Stamp
- Financial Learning Tape
- Mochi Lab Note
- Discovery Web Connection Language

These names describe future design contracts. They do not authorize creating components in this task.

### Controlled influences

- **Editorial Finance Workshop:** learning content, Discovery Detail, sources, trade-offs, risks, safety language, and long-form explanation.
- **Playful Modular Knowledge Canvas:** Craft cause/effect, Element combination, relationship encoding, and visual modularity inside Canvas only.
- **Kigen:** control anatomy, shallow stateful elevation, input wells, compact labels, separators, spacing rhythm, token discipline, and tool-like interaction.

Kigen is not a reference for FinCraft layout, brand colours, logo, navigation, page structure, content, exact components, or generator-strip cloning. The approved influences are principles, not copied assets or layouts.

### Score interpretation

Comparative raw scores in the research documents are supporting evidence only. They are not a mathematical winner-selection rule. Implementation difficulty was scored with **higher meaning harder**, so raw score totals must not be summed or treated as a quantitative proof that one direction wins. The approved direction balances trust, learning clarity, playfulness, graph compatibility, accessibility, performance, and maintainability through owner judgment.

## Discovery Web decision

### Classification and names

- **Umbrella feature:** FinCraft Discovery Web
- **MVP classification:** `MVP_SUPPORTING_FEATURE`
- **Primary product interaction:** Craft remains primary.
- **MVP route:** `/graph`, user-facing name **My Discovery Web**, after the supporting read API exists.
- **Embedded MVP view:** **Concept Orbit**, a bounded relationship view inside Discovery Detail.
- **Workspace layer:** **Workspace Connections**, a personal layer within the existing workspace domain. It is not canonical truth.
- **Post-MVP mode:** **Explore Map**.

The implementation order is:

1. Text relationship panel
2. Concept Orbit
3. My Discovery Web
4. Explore Map

### Data layers

These layers remain separate in storage derivation, API contracts, visual treatment, and user-facing language:

| Layer | Source and meaning | User-facing rule |
|---|---|---|
| Canonical knowledge | Reviewed/admin-authored `ElementRelationship` data with source and explanation | Not user-editable; source and explanation remain available |
| Recipe provenance | `CraftRecipe` and `CraftRecipeInput`; input points to output | A product recipe, not real-world causality |
| Personal discovery | `UserElement` and `DiscoveryEvent`; progress and history | Personal progress, not universal truth |
| Workspace | `WorkspaceNode` and `WorkspaceEdge`; arrangement and user-authored links | Label as Personal or My link; never merge with canonical truth |

The existing 15-model ERD is sufficient for MVP derivation. This task proposes no model or enum.

### Relationship taxonomy

The following is approved as a future service-validation target:

- **Recipe provenance:** `CRAFTED_FROM`; forward reading “Crafts into” or “Can create”; reverse reading “Made from”. Do not store a separate `CAN_CREATE` type.
- **Canonical:** `SUPPORTS`, `REDUCES`, `TRADE_OFF_WITH`, `RELATED_TO`.
- **Personal:** `PERSONAL_LINK`.
- **Deferred:** `CAUSES`.

Rules:

- `SUPPORTS` is directional, source-backed, explanation-backed, and must not imply certainty beyond evidence.
- `REDUCES` is directional and uses “May reduce”; it never implies risk elimination and requires source and explanation.
- `TRADE_OFF_WITH` is symmetric in the UI, conditional, and must avoid false equivalence.
- `RELATED_TO` is symmetric, sparingly used, and must not become vague edge proliferation.
- `PERSONAL_LINK` is explicitly marked Personal or My link and is not reviewed financial truth.
- `CAUSES` remains unavailable until a separate evidence and content-governance decision.

### Spoiler model

- Starter content is fully visible.
- Discovered content is fully visible when active.
- Undiscovered content is absent by default.

Undiscovered names, relationships, outputs, ingredients, topology, counts, and identities must not appear in API payloads, the DOM, accessibility text, search suggestions, URL values, filter counts, or error messages. Do not use silhouettes, unnamed mystery nodes, hidden topology, or blank recipe slots that reveal ingredient counts.

An explicit hint may reveal only a category and broad learning prompt. It must not reveal an Element name, exact relationship, exact output, full ingredients, or hidden topology. A future protected Admin/Super Admin preview must never share the user payload.

### UX order and accessibility

Discovery Detail may contain:

- Made From
- Can Lead To
- Related Concepts
- Trade-offs
- Appears In My Workspaces
- Discovery History

The text/list relationship representation is primary. Concept Orbit is an enhancement and the graph is never the only way to access relationship meaning.

On mobile, the relationship list appears before optional Orbit, details use a bottom sheet, filters use a separate sheet, multiple sheets are not stacked, and the graph defaults to depth one. The semantic list and graph must represent the same known, filtered data.

## Performance contract

Forbidden:

- Three.js, WebGL, and 3D
- Particles and video backgrounds
- Animated graph edges
- Continuous force simulation
- Perpetual layout calculation
- Continuously animated gradients
- Large full-screen blur layers
- Decorative infinite loops

Required future behavior:

- 2D rendering only
- Static graph positions between structural changes
- Layout only after load, expand, collapse, filter, mode change, or explicit re-layout
- Memoized nodes/types/options and narrow state subscriptions
- Reduced-motion support
- A synchronized semantic list
- No idle continuous CPU work

Initial product budgets are unverified until real content is profiled:

| View | Initial | Maximum |
|---|---:|---:|
| My Discovery Web desktop | 24 nodes / 36 edges | 56 nodes / 96 edges |
| My Discovery Web mobile | 12 nodes / 18 edges | 28 nodes / 44 edges |
| Concept Orbit desktop | 1 focus + up to 8 neighbours | Expanded view requires separate profiling |
| Concept Orbit mobile | 1 focus + up to 5 neighbours | Expanded view requires separate profiling |

Concept Orbit defaults to depth one and deterministic radial placement without a new layout package. Dagre is optional only after a separately authorized, evidence-based package task. The existing Workspace backend hard limit remains 100 nodes and 200 edges.

## Current API reality

### Implemented and available

- `GET /elements`
- `POST /craft`
- `GET /workspaces/:workspaceId/canvas`
- `PUT /workspaces/:workspaceId/canvas`
- Workspace CRUD

### Not implemented in inspected controllers

- Graph read API
- Element relationship/detail read API
- Recipe provenance read API
- Discovery history query API
- Appears-in-workspaces query API

Database storage is sufficient for MVP derivation, but API exposure is not complete. Frontend work must not invent Graph DTOs, hardcode Graph records, create permanent mocks, query Prisma, expose undiscovered data in browser logic, or infer recipes from client-side datasets. A bounded backend contract/implementation task is required before Graph Product UI integration.

## Architectural consequences

- `/graph` is a protected MVP supporting route contract named **My Discovery Web**, with readiness `BLOCKED_BY_READ_API`.
- Discovery Detail keeps a relationship panel and later Concept Orbit; known-only data and list-first accessibility are mandatory.
- Routes remain Server Components by default. A future React Flow graph is a bounded Client Component island only after a separately authorized package task.
- Canonical data remains server/query data. Viewport and selection are transient client state.
- Graph mapping, spoiler filtering, and relationship semantics live in typed feature-local modules, not presentation components.
- Workspace Connections remains inside the existing workspace route/domain and uses the existing Canvas snapshot authority.
- No permanent frontend mocks, client recipe derivation, or unsupported API claims are permitted.
- Visual components must use the approved tactile depth ladder, existing colour semantics, accessible states, and the FinCraft anti-AI-slop rules.

## Deferred decisions

- Backend read API contracts and service validation for relationship taxonomy
- Whether `relationshipType` receives a service-layer allow-list
- Discovery history pagination and filter endpoints
- Appears-in-workspaces query contract
- Hint metadata derivation that cannot expose hidden names or recipes
- Whether users can save Discovery Web viewport/filter state
- Dagre installation and any alternate layout engine
- Protected Admin/Super Admin complete-content preview
- Explore Map information architecture and route shape
- Profiling-based revision of graph budgets

## Rejected alternatives

- Full user-visible canonical graph in the MVP
- Explore Map as an MVP route
- Unknown node silhouettes, unnamed mystery nodes, hidden topology, and count-revealing placeholders
- `CAUSES` as an approved MVP relationship
- A separate stored `CAN_CREATE` relationship type
- Kigen as the FinCraft layout, brand, or component reference
- Full-page neumorphism, generic SaaS dashboard chrome, and floating-card-everywhere composition
- Three-dimensional, WebGL, particle, force-simulated, continuously animated, or video-backed graph experiences
- React Flow or Dagre installation in this contract-freeze task
- User editing of canonical relationships
- Permanent frontend mocks or client-side recipe inference

## Contract boundary

This decision record freezes direction and boundaries only. It does not create UI, components, API endpoints, DTOs, database models, packages, assets, screenshots, fonts, or research conclusions beyond the approved decision. Research documents remain unchanged as historical evidence.
