# FinCraft Discovery Web — Product and UX Research

## Executive recommendation

- **Feature classification:** `MVP_SUPPORTING_FEATURE`.
- **Working umbrella name:** **FinCraft Discovery Web**.
- **MVP user-facing modes:** **My Discovery Web** and a bounded **Concept Orbit** embedded in Discovery Detail.
- **MVP-adjacent workspace view:** **Workspace Graph**, explicitly personal and never presented as canonical truth.
- **Post-MVP mode:** **Explore Map**.
- **Default scope:** discovered/starter content and known connections only.
- **Default graph:** local or bounded personal view, never the complete canonical recipe database.
- **Primary non-graph context:** a backlink-equivalent relationship panel on Discovery Detail.

The graph should support learning, not become the product's primary navigation or a spectacle. Craft remains the core product interaction. Discovery Web helps users understand what they have learned, how concepts connect, and where a concept appears in their own work.

## Product principles extracted from Obsidian

Official source pages: [Internal links](https://obsidian.md/help/links), [Backlinks](https://obsidian.md/help/plugins/backlinks), [Graph view and Local Graph](https://obsidian.md/help/plugins/graph), and [Quick switcher](https://obsidian.md/help/plugins/quick-switcher).

| Obsidian principle | FinCraft translation | What is not translated |
|---|---|---|
| Notes are nodes | Financial Elements/Concepts are nodes. | Files, note editing, Markdown, folders, or vaults. |
| Internal links are edges | Sourced canonical relationships and recipe provenance are edges. | User-authored wiki links as educational truth. |
| Backlinks reveal incoming context | Discovery Detail shows what creates, affects, uses, or personally references the concept. | Linked/unlinked mention terminology. |
| Global graph answers “what exists?” | My Discovery Web answers “what have I discovered and how is it connected?” | A full database reveal by default. |
| Local graph answers “what is near this?” | Concept Orbit shows one selected concept and bounded neighbours. | Continuous force simulation or note circles. |
| Local depth controls complexity | Depth defaults to one; explicit expansion is budgeted and spoiler-aware. | Arbitrary deep traversal. |
| Filters and groups reveal structure | Filters use category, relation family, canonical/personal layer, and discovered status. | Colour-only grouping. |
| Arrows expose link direction | Direction appears only where meaning is directional; labels remain visible/available. | Arrows on symmetric related/trade-off links. |
| Graph selection navigates to content | Selecting a node opens a preview; explicit action navigates to Discovery Detail. | Graph as the only route to content. |
| Quick navigation reduces graph dependence | Search lets users find a known concept without panning a large canvas. | Creating notes or searching undiscovered recipe names. |

## Current implementation reality

### Implemented controllers relevant to this proposal

- `GET /elements` returns active starter elements plus active non-starters unlocked by the current user.
- `POST /craft` accepts exactly two unique unlocked inputs, records every attempt, unlocks the output once, and returns Discovery Detail for a successful recipe.
- `GET /workspaces/:workspaceId/canvas` returns the owned workspace snapshot with Element-backed nodes and personal labelled edges.
- `PUT /workspaces/:workspaceId/canvas` atomically replaces the bounded workspace snapshot.
- Workspace create/list/get/update/delete routes are implemented.

### Contracted but not currently implemented in the inspected controllers

- `GET /elements/graph`.
- `GET /elements/:elementId`.
- `GET /elements/:elementId/detail`.
- A discovery-history query endpoint.
- A recipe-provenance query endpoint.
- An “appears in workspaces” query endpoint.

The frozen frontend route contract describes `/graph` and Discovery Detail as MVP routes, but this research must not describe the supporting graph/detail endpoints as implemented. The schema can support the proposed MVP data, while API exposure remains a future bounded backend decision.

## Graph data layers

### CANONICAL_KNOWLEDGE_LAYER

- **Source:** `ElementRelationship` joined to active `Element` records.
- **Authorship:** system/admin-authored educational content.
- **Meaning:** reviewed financial relationships with label, optional explanation, strength, and sources.
- **Edit policy:** never editable from user graph/canvas UI.
- **Display policy:** canonical badge/legend; source/explanation available from edge detail; only active relationships.
- **Safety:** avoid deterministic wording unless evidence supports it. `relationshipType` is currently a string, so taxonomy governance is content policy, not a new enum in this task.

### RECIPE_PROVENANCE_LAYER

- **Source:** `CraftRecipe` + ordered `CraftRecipeInput` + output `Element`.
- **Meaning:** which inputs create a result under an approved recipe.
- **Direction:** input Element → output Element. The reverse reading is “Made From.”
- **Edit policy:** system/admin content only.
- **Display policy:** spoiler-aware; only show full inputs when all relevant nodes are already known or the recipe was successfully used by the current user.
- **Important distinction:** a Craft Recipe is not an `ElementRelationship` and must never be stored or narrated as generic financial causality.

### PERSONAL_DISCOVERY_LAYER

- **Source:** `UserElement` and `DiscoveryEvent`.
- **Meaning:** what the user has unlocked, first-unlock time, favourites/last view, and every successful or unsuccessful Craft attempt.
- **Edit policy:** generated by product activity; users may eventually change favourite status, not history.
- **Display policy:** personal badge; timestamps/history never imply universal financial truth.

### WORKSPACE_LAYER

- **Source:** `WorkspaceNode` and `WorkspaceEdge` under an owned `Workspace`.
- **Meaning:** a user's arrangement, positions, values, and labelled personal links.
- **Edit policy:** user-editable within owned workspace limits.
- **Display policy:** always labelled **Personal workspace** or **My link**; never merged visually into canonical truth without a layer distinction.
- **Current persistence:** existing Canvas snapshot API supports up to 100 nodes and 200 edges per workspace.

## Can the existing 15-model MVP ERD support the proposed MVP?

**Yes, for storage and derivation, with API exposure gaps. No model or enum is required for the proposed MVP.**

| Requirement | Existing support | Qualification |
|---|---|---|
| Canonical directed relationship | `ElementRelationship.sourceElementId/targetElementId` | `relationshipType` is a string; governance and validation are future decisions. |
| Relationship label/explanation/source | `label`, `description`, `sources`, `strength` | Sufficient for educational edge details. |
| Recipe provenance | `CraftRecipe` + `CraftRecipeInput` + output Element | Direction and ordered inputs are available. |
| Discovered node set | `UserElement` | Starter Elements need inclusion by the same availability rule as `GET /elements`. |
| Discovery history | `DiscoveryEvent` | Input IDs are JSON; suitable for history display, less convenient for relational traversal. |
| Personal workspace graph | `WorkspaceNode` + `WorkspaceEdge` | Personal edge semantics are free-text labels, not canonical taxonomy. |
| Saved positions | `WorkspaceNode.positionX/positionY` | Discovery Web positions should be derived unless explicitly made a Workspace view. |
| Detail/safety/source content | `DiscoveryDetail` | Supports context and education-only treatment. |

### Possible future gaps — decisions only, not schema proposals

- Query efficiency and index strategy if canonical relationship volume grows substantially.
- Whether `relationshipType` needs an approved validation allow-list at the service layer.
- Whether discovery history needs pagination/filter endpoints.
- Whether users need saved Discovery Web viewport/filter state; not required for MVP.
- Whether unknown-node hint metadata can be derived without exposing names/recipes.
- Whether personal edge labels need moderated presets; not required for personal workspace MVP.

## Mode 1 — My Discovery Web

- **Purpose:** Show the user's discovered financial knowledge as a coherent, navigable personal map.
- **Default user:** Authenticated learner with at least starter Elements.
- **Route or entry point:** Frozen route `/graph`; navigation label can be **My Discovery Web**.
- **Visible node scope:** Starter Elements plus unlocked active Elements, initially limited to the most relevant/recent connected set.
- **Visible edge scope:** Active canonical relationships where both endpoints are visible; recipe provenance only for recipes the user has completed or whose ingredients/results are already known; no Workspace edges by default.
- **Spoiler behaviour:** Unknown outputs/ingredients absent. Optional “There are more connections” affordance reveals a category-only hint, not names.
- **Interactions:** Select, open detail preview, navigate to Discovery Detail, search known concepts, filter categories/relation families, expand one local branch, collapse, reset view, explicit re-layout.
- **Filters:** Category, relation family, canonical/recipe layer, recent discoveries, favourites. Filters must be URL-shareable only when they cannot reveal undiscovered names.
- **Detail behaviour:** Desktop side inspector; mobile bottom sheet. It shows label, category, safety/reality status, relationship explanation, and an explicit “Open Discovery Detail” action.
- **Desktop layout:** Bounded graph center; compact top/left tool controls; right inspector opens only on selection; legend remains collapsible.
- **Mobile layout:** Local graph around the selected/recent concept, depth one, list/graph toggle, bottom sheet detail, filters in a sheet.
- **Empty state:** Starter-node map plus Mochi guidance: “Craft two Elements to grow your Discovery Web.”
- **Loading state:** Static skeleton blocks and plain progress text; no fake force initialization or pulsing graph.
- **Error state:** Preserve navigation and offer the accessible known-concepts list with retry.
- **Accessibility:** Graph and ordered relationship list represent the same filtered data; keyboard node traversal; visible focus; descriptive edge labels; no colour-only layer encoding.
- **Performance approach:** Initial 24 desktop / 12 mobile nodes; progressive branch expansion; no continuous layout; memoized nodes/types/options.
- **MVP status:** Yes, supporting feature, after supporting read API exists.

## Mode 2 — Concept Orbit

- **Purpose:** Explain immediate incoming/outgoing context for one known concept without opening the full graph.
- **Default user:** Learner reading Discovery Detail or inspecting a selected graph node.
- **Route or entry point:** Embedded section on `/discovery/[elementId]`; optionally deep-linkable by a view query later.
- **Visible node scope:** Selected concept plus depth-one known neighbours; hard default of 1 + up to 8 neighbours.
- **Visible edge scope:** Sourced canonical relationships, known recipe provenance, and optionally “appears in workspace” count—not workspace edges.
- **Spoiler behaviour:** Known-only. A maximum of one category-only “unknown connection” hint can appear after explicit action.
- **Interactions:** Select neighbour, move focus, open neighbour detail, switch incoming/outgoing, expand one branch if budget permits.
- **Filters:** Incoming/outgoing/both; relationship family; recipe/canonical.
- **Detail behaviour:** The article remains primary. Orbit updates a compact adjacent/inline summary and never replaces the article.
- **Desktop layout:** 2-column article section: relationship list plus compact 2D orbit.
- **Mobile layout:** Relationship list first; optional “View orbit” disclosure; bottom sheet for a selected neighbour.
- **Empty state:** “No reviewed connections are available yet” with return to Craft Lab.
- **Loading state:** List skeleton first; graph hydrates as a bounded Client Component.
- **Error state:** Keep the article and show the relationship list retry independently.
- **Accessibility:** List is canonical; orbit is an enhancement. Focus returns to the invoking control after closing detail.
- **Performance approach:** 9-node maximum by default; no external layout package needed for a deterministic radial placement.
- **MVP status:** Yes; this is the highest-value graph experience for the lowest complexity.

## Mode 3 — Explore Map

- **Purpose:** Browse the broader educational curriculum and category structure without revealing recipe answers.
- **Default user:** Experienced learner seeking what area to explore next; admin can preview a complete canonical version.
- **Route or entry point:** Future mode under `/graph` or a separate route only after owner approval; admin preview belongs in protected admin scope.
- **Visible node scope:** User view shows known nodes plus category-level unknown regions; admin view may show active canonical nodes.
- **Visible edge scope:** User view omits hidden recipe provenance and unknown endpoints; admin view can inspect canonical and recipe layers separately.
- **Spoiler behaviour:** Category clusters and counts only; no unknown names or ingredient combinations.
- **Interactions:** Browse category regions, choose a known concept, request a non-specific hint, filter level/category.
- **Filters:** Category, Element type, reality level, safety label, canonical relation family.
- **Detail behaviour:** Known concepts open detail. Unknown regions explain learning goals without identity disclosure.
- **Desktop layout:** Overview map with category index and selected-region panel.
- **Mobile layout:** Category list and progress summary; no global free-pan map by default.
- **Empty state:** Starter curriculum overview with a Craft Lab action.
- **Loading state:** Category/list structure first, optional graph second.
- **Error state:** Category navigation fallback.
- **Accessibility:** Semantic category tree/list is primary.
- **Performance approach:** Aggregate clusters; no individual full-database rendering.
- **MVP status:** `POST_MVP`; valuable only after content density and spoiler rules are validated.

## Mode 4 — Workspace Graph

- **Purpose:** View and edit the user's personal arrangement and links within one workspace.
- **Default user:** Owner of the current workspace.
- **Route or entry point:** Existing `/workspaces/[workspaceId]` Lab route as a Canvas/Graph view mode; do not create a parallel truth graph.
- **Visible node scope:** Workspace snapshot nodes only, each backed by an Element the user is allowed to use.
- **Visible edge scope:** Workspace personal edges only.
- **Spoiler behaviour:** Cannot add undiscovered non-starter Elements; no recipe suggestions inferred from personal proximity.
- **Interactions:** Pan, zoom, drag, connect, label personal edge, save snapshot, restore server snapshot, open Element detail.
- **Filters:** Current workspace content/type; optional personal-link visibility.
- **Detail behaviour:** Inspector states **Personal arrangement** and separates Element educational content from user-authored edge labels.
- **Desktop layout:** Existing Vault → Canvas → Detail contract.
- **Mobile layout:** Canvas focus with Vault and Detail sheets; list fallback for nodes and links.
- **Empty state:** Guided first node placement; Mochi allowed as guidance, never a node.
- **Loading state:** Load snapshot before enabling edit; dirty/saving/saved states are explicit.
- **Error state:** Do not overwrite local unsaved state on failed save; offer retry and restore confirmation.
- **Accessibility:** Non-drag actions for adding/selecting/linking; ordered node/edge list; keyboard move alternatives are a later usability requirement.
- **Performance approach:** Existing server validation bounds snapshots to 100 nodes/200 edges; client should warn well before the hard limit.
- **MVP status:** Existing Canvas domain; graph naming must not recast personal edges as canonical truth.

## Minimal relationship taxonomy

### Recommendation

Use six user-facing relation families in the MVP. One provenance family is derived from Recipe tables; four are reviewed canonical semantics; one is personal. Do not freeze all candidate strings in this research task.

| Proposed family | Direction | Source → target | Truth layer | User-facing label | Explanation / visual treatment | Accessibility treatment | Current backend mapping | Fact-risk control |
|---|---|---|---|---|---|---|---|---|
| `CRAFTED_FROM` / reverse `CAN_CREATE` | Directional | Input → output | Recipe provenance | “Crafts into” on forward traversal; “Made from” on result detail | Solid orange line, arrow toward output; same stored provenance, two reading labels | Announce “A crafts into B”; label available in list | `CraftRecipe` + `CraftRecipeInput` | Represents product recipe, not real-world causality |
| `SUPPORTS` | Directional | Supporting concept → supported concept | Canonical | “Supports” | Solid teal line, arrow; explanation required | Text label and direction announced | `ElementRelationship.relationshipType/label` | Sources required; avoid guarantees |
| `REDUCES` | Directional | Mitigating concept → risk/outcome | Canonical | “May reduce” | Solid teal line with a small bar marker plus arrow; cautious wording | Announce “may reduce”; not colour-only | `ElementRelationship` | Never imply elimination of risk; source required |
| `TRADE_OFF_WITH` | Symmetric in UI | Concept ↔ concept | Canonical | “Trade-off with” | Dashed line, no arrow, visible label on selection/list | Announce both endpoints and trade-off | `ElementRelationship` stored with one canonical ordering | Explanation must identify conditions; avoid false equivalence |
| `RELATED_TO` | Symmetric in UI | Concept ↔ concept | Canonical | “Related to” | Neutral solid thin line, no arrow | Text relation in list | `ElementRelationship` | Use sparingly; vague edges create noise |
| `PERSONAL_LINK` | Direction follows user edge | Workspace node → workspace node | Personal | “My link” plus user label | Dotted neutral line; “Personal” badge; never canonical colour treatment | Announce personal status and user label | `WorkspaceEdge` | Explicitly not reviewed financial truth |

### Deferred/rejected candidates

- **`CAUSES`: defer from MVP taxonomy.** Causal financial claims are high risk and often conditional. Only introduce after a content-governance decision requiring strong sources and qualified wording.
- **`CAN_CREATE`: do not store as a separate relationship type.** It is the forward reading of Recipe provenance; `CRAFTED_FROM` is the reverse detail view.
- **A separate generic “influences” edge:** reject for now because it would hide whether a relationship supports, reduces, or trades off.

## Backlink-equivalent Discovery Detail UX

The relationship panel should deliver context without requiring graph interaction.

### Made From

- **Data source:** Active `CraftRecipe` outputs and `CraftRecipeInput` records.
- **Visibility:** Show full inputs only for a recipe the user has completed or when every input/result is already known.
- **Spoiler handling:** Otherwise omit; do not show blank ingredient slots that reveal count/order unless approved as a hint.
- **Empty state:** “No known Craft path is available.”
- **Mobile:** Compact equation rows in an accordion; no horizontal overflow.
- **MVP:** Yes.

### Can Lead To

- **Data source:** Known recipe outputs where the current concept is an input, plus reviewed outgoing canonical relationships separated by label.
- **Visibility:** Only known output nodes and known relationships.
- **Spoiler handling:** Unknown outputs are absent; optional category-only hint after explicit action.
- **Empty state:** “No known next connections yet.”
- **Mobile:** Stacked links with relation labels and direction icons.
- **MVP:** Yes, bounded to known content.

### Related Concepts

- **Data source:** Active `ElementRelationship` records using approved canonical families.
- **Visibility:** Both endpoints known, or current node known with an approved non-spoiler relation.
- **Spoiler handling:** Unknown target absent by default.
- **Empty state:** “No reviewed related concepts are available.”
- **Mobile:** Ordered list; optional small orbit disclosure.
- **MVP:** Yes.

### Trade-offs

- **Data source:** `TRADE_OFF_WITH` relationships plus `DiscoveryDetail.possibleTradeoff` and `hiddenRisk`.
- **Visibility:** Known concepts only; article content remains visible for the current unlocked concept.
- **Spoiler handling:** Never reveal an unknown concept merely to populate a trade-off.
- **Empty state:** Use the Discovery Detail trade-off prose when no edge exists; do not fabricate a graph relation.
- **Mobile:** Text-first callout followed by links.
- **MVP:** Yes when reviewed relationships exist; no requirement to force one per Element.

### Appears In My Workspaces

- **Data source:** `WorkspaceNode` grouped by owned Workspace.
- **Visibility:** Current user only.
- **Spoiler handling:** None beyond normal ownership and Element availability.
- **Empty state:** “Not placed in a workspace yet” with a safe navigation action.
- **Mobile:** Workspace name list; avoid mini-canvases.
- **MVP:** Optional; include only after a bounded query endpoint exists.

### Discovery History

- **Data source:** `DiscoveryEvent` and first-unlock timestamp from `UserElement`.
- **Visibility:** Current user only; newest-first, paginated/limited.
- **Spoiler handling:** Failed attempts must not expose matched recipe data because none exists; input names are safe only if currently available to the user.
- **Empty state:** “No Craft history for this concept yet.”
- **Mobile:** Timeline list without decorative animation.
- **MVP:** Supporting, but lower priority than Made From/Related Concepts.

## Spoiler and learning policy

### Recommended default: absent unknown nodes, with explicit category-only hints

| Candidate | Decision | Reason |
|---|---|---|
| Absent | **Default** | Cleanest graph, strongest recipe protection, lowest cognitive/render cost. |
| Silhouettes | Reject for default | Implies count/position and creates mystery-node clutter. |
| Unnamed unknown nodes | Reject | Reveals graph topology and may encourage brute-force recipe hunting. |
| Category-only hints | Optional after explicit action | Gives direction without names or ingredient combinations; must be rate/budget limited by UX, not gamified scarcity. |

Policy rules:

1. Discovered nodes are fully visible if their content is active.
2. Starter Elements are visible because the product already treats them as available.
3. Undiscovered nodes and their direct recipe identities are absent by default.
4. Undiscovered Recipe inputs and outputs are never revealed in full.
5. Concept Orbit starts with known connections at depth one.
6. A user may explicitly request a hint; the hint may reveal category and a broad learning prompt, not name, exact edge, or full ingredients.
7. Admin/Super Admin may use a separate protected preview of active canonical content for content review; the admin view must never leak to user payloads.
8. Filtering, counts, search suggestions, URLs, accessible labels, and error messages must not leak hidden names.

## Graph visual language

### Nodes

- **Normal discovered node:** flat warm surface, category marker plus text label and type; no shadow or a single subtle border.
- **Selected node:** shallow raised surface, stronger border, visible selection ring, inspector association via `aria-describedby` where appropriate.
- **Hover state:** border/surface change only; never required for meaning.
- **Focus-visible:** high-contrast 2–3 px ring with offset, independent of selection and hover.
- **Locked/unknown state:** absent by default; category-only hint is a separate labelled control/marker, not a disabled node.
- **Personal node context:** “In workspace” or Personal marker where needed; underlying Element remains canonical content.
- **Canonical node context:** no special badge required on every node; the active layer/legend communicates canonical status.
- **Mochi:** never a graph node.

### Edges

| Relation | Line | Arrow | Label | Non-colour encoding |
|---|---|---|---|---|
| Recipe provenance | Solid orange | Toward output | On selection/list; “Crafts into” | Arrow + recipe icon/legend key |
| Supports | Solid teal | Toward supported concept | On selection/list | Arrow + text label |
| Reduces | Solid teal with bar marker | Toward mitigated risk/outcome | “May reduce” | Marker + text label |
| Trade-off | Dashed warning-neutral | None | Always available; visible when selected or space permits | Dash + text |
| Related | Thin neutral solid | None | On selection/list | Text and no arrow |
| Personal | Dotted neutral | User direction if meaningful | “Personal: [label]” | Dots + Personal badge/text |

Edge states:

- **Selected:** thicker stroke within a capped range; relation label becomes visible; connected nodes receive outline, not glow.
- **Hover:** optional highlight only; no unique information.
- **Focus-visible:** reachable through the relationship list even if direct SVG edge focus is unreliable.
- **Canonical vs personal:** separated by line pattern, label, and legend—not colour alone.
- **Motion:** no animated edges. Layout transitions are optional and disabled/reduced under reduced-motion; meaning never depends on animation.

## MVP boundary

### Include

- My Discovery Web at `/graph`, known-only and bounded.
- Concept Orbit depth one on Discovery Detail.
- Relationship list fallback and backlink-equivalent sections.
- Canonical, recipe provenance, and personal discovery layers with explicit semantics.
- Workspace Graph remains within the existing workspace canvas domain.
- Search/filter of known content, selection inspector, mobile sheet, and error/list fallback.

### Exclude from MVP

- Complete user-visible canonical graph.
- Explore Map overview.
- User editing of canonical relationships.
- Unknown names, recipe ingredients, or graph topology leaks.
- Continuous force layout, time-lapse, animated edges, 3D/WebGL, particles.
- Community graph, shared workspaces, likes, comments, collaboration, payment, or advice.
- New database model/enum.
- Saved global graph layout preferences.

## Proposed architecture boundary for future implementation

- Route/page remains a Server Component for authentication, metadata, initial bounded data, and fallback list.
- React Flow lives in a bounded `GraphCanvas` Client Component island.
- Filters that should be shareable use URL search parameters without spoiler-bearing values.
- React Flow viewport/selection is transient client state; canonical data remains server/API data.
- Workspace graph state may use the existing Canvas/Zustand boundary and snapshot API; it must not share canonical relationship mutation logic.
- Graph data mapping, spoiler filtering, and relationship semantics belong outside presentation components in typed feature-local modules.

## Consistency review

- **MVP scope:** Craft remains primary; Discovery Web is supporting.
- **Backend reality:** storage exists; graph/detail/history read APIs are not claimed as implemented.
- **15-model ERD:** sufficient for MVP derivation; no schema change proposed.
- **Mochi:** functional guide only, never recipe input or graph node.
- **Safety:** education only, simulation only, not financial advice; causal claims deferred.
- **Commercial scope:** no payment or subscription implementation.
- **Community:** deferred; no social graph.
- **Visual technology:** 2D only; no WebGL/3D.
- **Frontend architecture:** Server Component default, bounded React Flow Client island, small responsibility-based files.
- **Packages:** no package installation or update in this research task.
- **Product UI:** no UI implementation before owner approval.

## Owner decisions required

1. Confirm `MVP_SUPPORTING_FEATURE` classification.
2. Confirm the user-facing mode names: My Discovery Web, Concept Orbit, Explore Map, Workspace Graph.
3. Confirm unknown nodes are absent by default and category-only hints require explicit action.
4. Approve the six-family relationship taxonomy as a future validation target, with `CAUSES` deferred.
5. Confirm Concept Orbit and the text relationship panel precede Explore Map.
