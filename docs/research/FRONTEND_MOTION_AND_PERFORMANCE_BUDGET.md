# FinCraft Frontend Motion and Performance Budget

## Purpose

Define a measurable budget for FinCraft Tactile Discovery Lab and its 2D React Flow experiences before Product UI work begins. This is a research recommendation, not an installed dependency or implementation claim.

Primary technical sources:

- [React Flow Performance](https://reactflow.dev/learn/advanced-use/performance)
- [React Flow Layouting Overview](https://reactflow.dev/learn/layouting/layouting)
- [React Flow Dagre Tree](https://reactflow.dev/examples/layout/dagre)
- [React Flow Expand and Collapse](https://reactflow.dev/examples/layout/expand-collapse)
- [React Flow Save and Restore](https://reactflow.dev/examples/interaction/save-and-restore)
- [React Flow Touch Device](https://reactflow.dev/examples/interaction/touch-device)
- [React Flow Accessibility](https://reactflow.dev/learn/advanced-use/accessibility)

## Non-negotiable exclusions

- No Three.js.
- No WebGL.
- No 3D animation or 3D graph.
- No particles.
- No continuously animated gradients.
- No continuously animated graph edges.
- No continuous force simulation.
- No perpetual layout calculation.
- No large full-screen blur layers.
- No decorative infinite loops.
- No video backgrounds.
- No motion required to understand state, direction, success, or risk.

## Motion principles

1. Motion explains a state change or preserves spatial continuity; it never exists only to keep the page alive.
2. Interaction feedback begins immediately and finishes quickly.
3. Graph positions are static between structural changes.
4. Layout runs only after initial load, expand, collapse, filter, viewport mode change, or explicit re-layout.
5. Reduced-motion mode removes non-essential transforms and opacity transitions without removing information.
6. Graph lines are always static. Selection uses stroke/label changes, not marching dashes or glow pulses.
7. Discovery celebration is bounded, dismissible, and understandable from text/icon/state without motion.

## Motion token recommendation

Use the existing duration intent unless a future design-system decision changes it:

| Token | Budget | Use |
|---|---:|---|
| Fast | 150 ms maximum | Press, toggle, hover/focus surface response |
| Normal | 250 ms maximum | Accordion, inspector disclosure, small panel change |
| Slow | 350 ms maximum | Dialog/sheet entrance only |

Additional rules:

- One transition per state change; do not chain ornamental sequences.
- Prefer opacity and small transforms on compositor-friendly elements, but do not promote large canvas layers speculatively.
- Avoid animating `box-shadow`, blur, layout dimensions, or large background gradients.
- Maximum tactile translation: visually subtle (for example 1–2 px), tokenized later; no bouncing or spring overshoot by default.
- Discovery celebration: one finite sequence, at most 700 ms total, no loop, skipped under reduced motion.

## Graph rendering budgets

These are product budgets, not React Flow library limits. They are deliberately below the existing Workspace snapshot hard limit of 100 nodes and 200 edges.

### My Discovery Web

| Budget | Desktop/tablet | Mobile | Behavior |
|---|---:|---:|---|
| Initial visible nodes | 24 | 12 | Prefer selected/recent/favourite connected nodes; never random truncation. |
| Initial visible edges | 36 | 18 | Remove edges whose endpoints are not visible; prioritize selected-node context. |
| One expansion action | +8 nodes / +12 edges | +4 nodes / +6 edges | Show a confirmation/count before an expansion would exceed the soft threshold. |
| Soft warning threshold | 40 nodes / 64 edges | 20 nodes / 30 edges | Suggest filtering, collapsing, or switching to list. |
| Maximum rendered view | 56 nodes / 96 edges | 28 nodes / 44 edges | Refuse further expansion until the user collapses or filters. |

### Concept Orbit

| Budget | Desktop/tablet | Mobile |
|---|---:|---:|
| Default nodes | 1 focus + up to 8 neighbours | 1 focus + up to 5 neighbours |
| Default edges | Up to 12 | Up to 8 |
| Expanded maximum | 17 nodes / 28 edges | 9 nodes / 14 edges |
| Default depth | 1 | 1 |

### Workspace Graph / Canvas

- Backend hard validation remains **100 nodes / 200 edges** per snapshot.
- Client soft warning proposal: **70 nodes / 120 edges**.
- Client strong warning proposal: **90 nodes / 170 edges**.
- Do not lower backend limits in this task. The client budget is a usability/performance warning, not a schema or API change.
- Only render the current workspace snapshot; never merge the canonical graph into the editable Canvas.

## Progressive rendering and expansion

- Server/API returns only authorized/spoiler-safe data required by the current mode where practical.
- Client maps only visible nodes and edges into React Flow.
- Collapsed branches should not render interactive DOM nodes. If `hidden` is used, verify hidden nodes are also absent from keyboard and accessibility navigation.
- One action expands one bounded branch. “Expand all” is not an MVP action.
- Preserve the selected node when a filter remains compatible; otherwise announce why selection cleared.
- On expansion/collapse, keep the focused control or move focus predictably to the selected node; never drop focus to the document body.
- Re-layout only the affected visible graph when possible. A simple full visible-view re-layout is acceptable under the maximum budgets if profiling passes.

## Layout strategy

### No additional layout package

Use deterministic local placement without another package when:

- Concept Orbit is depth one and within its 9-node default budget;
- a simple radial or ring arrangement is sufficient;
- category/list ordering provides the primary semantics;
- positions can be calculated once from stable node dimensions;
- the Workspace view already restores user/server positions.

This is the preferred MVP starting point for Concept Orbit.

### Dagre as the single optional engine

Consider `@dagrejs/dagre` in a separately authorized package task only when:

- the visible view is a directed recipe/provenance tree;
- top-to-bottom or left-to-right rank communicates direction better than a radial layout;
- nodes have predictable rectangular dimensions;
- layout runs only on structural changes or explicit re-layout;
- official engine/peer checks, clean install, TypeScript, lint, source limits, Next build, and runtime profiling all pass.

Dagre is the leading optional engine because React Flow documents it as the simplest drop-in option for tree-like layouts. Its known sub-flow limitation matters if nodes inside a sub-flow connect outside it; avoid that topology or reassess before adoption.

### Do not choose D3-force or ELK by default

- **D3-force:** reject continuous simulation. Even a finite force pass is unnecessary for the proposed local/directed MVP views unless a future benchmark proves otherwise.
- **ELK:** defer. It offers advanced layout and edge routing at the cost of complexity and bundle/worker decisions that the MVP does not currently need.
- **Multiple engines:** reject. One visual feature should not carry several layout packages and divergent behaviors.

## React and React Flow requirements

### Memoization

- Custom node components use `React.memo` when their props are stable.
- Custom edge components use `React.memo` if introduced; prefer built-in/simple edges first.
- `nodeTypes`, `edgeTypes`, `defaultEdgeOptions`, `snapGrid`, and similar objects are declared outside render or memoized.
- Event callbacks passed to React Flow use `useCallback` where stable references prevent child work.
- Data mapping is memoized from authorized graph DTO + active filters, not recomputed on every pan.

### State subscriptions

- Do not subscribe inspector/tool components to the full `nodes` or `edges` arrays when they need only selected IDs or counts.
- Keep selected node ID, visible layer, and filter state in narrow selectors.
- Do not duplicate the same server graph data in TanStack Query, Zustand, and local state.
- Viewport/selection can be transient client state; canonical content remains server/query data.

### Node and edge complexity

- Normal nodes: one main container, text label, category/type marker, and at most one status marker.
- Selected depth: border + static shallow shadow; no filter blur or multi-layer glow.
- Edges: straight, simple bezier, or smooth-step only after readability profiling.
- No embedded charts, forms, avatars, or long paragraphs inside graph nodes.
- Edge labels appear on selection or in the parallel list unless persistent labels remain readable within the edge budget.
- Avoid complex CSS gradients, animated shadows, and SVG filters.

## Local versus global rendering

- **Local rendering is the default interaction surface.** It answers the learning question around one concept and keeps labels readable.
- **My Discovery Web is bounded global-personal**, not database-global. It renders a curated visible set from the user's known nodes.
- **Explore Map is post-MVP** and should aggregate categories rather than render every canonical Element.
- **Admin complete graph** is a protected content-review tool and may use separate, stricter desktop-only budgets; it is not a user payload or MVP acceptance requirement.
- Mobile never defaults to a full free-pan global graph.

## Mobile interaction budget

- Default to Concept Orbit or a selected/recent local cluster.
- Graph/list segmented control has at least 44 px targets and a text label.
- Pan/zoom must not block page scrolling unexpectedly; use an explicit graph interaction region and clear controls.
- Details open in a bottom sheet with focus management and a close control.
- Filters open in a separate sheet; do not overlay multiple sheets.
- No drag-only required action. Selection, expansion, open detail, and relation browsing must work through buttons/list rows.
- Keep persistent graph controls to zoom in, zoom out, fit view, and list toggle; move secondary filters into a sheet.
- Test at 320 CSS px width and with 200% browser zoom for overflow and target access.

## Accessible list fallback

The list is not an error-only fallback; it is a first-class representation of the current graph filter.

- Heading identifies the current mode/focus and visible count.
- Nodes appear as links/buttons grouped by relationship family or category.
- Each relation sentence includes source, label, direction, target, and canonical/personal status.
- Recipe provenance reads, for example, “Income and Budget craft into Savings Plan” only when spoiler policy permits.
- Selecting in the list selects the same node in the graph when the graph is mounted.
- Graph failure never blocks access to the list or Discovery Detail.
- Colour, line dash, arrow, and position are supplementary; text carries the meaning.

## Save and restore

- Workspace Canvas uses the existing server snapshot contract, not localStorage as authority.
- Snapshot includes workspace ID, update timestamp, nodes, edges, and node positions; viewport persistence is not currently in the backend response and is not required for MVP.
- Discovery Web calculated positions need not be saved; deterministic re-layout is acceptable.
- Save states: idle, dirty, saving, saved, error. Announce saved/error status through a polite live region.
- Do not silently overwrite unsaved local changes after a failed request or background refetch.
- Any future optimistic-concurrency decision is out of scope for this research.

## Reduced-motion behavior

Under `prefers-reduced-motion: reduce`:

- remove non-essential transforms and fades;
- sheets/dialogs may appear without travel while preserving focus behavior;
- graph re-layout snaps to final positions or uses an effectively immediate transition;
- discovery celebration becomes a static success state;
- loading indicators use text/static skeletons without pulsing when practical;
- no information, selection, or direction disappears.

## Loading, error, and empty-state cost controls

- Skeletons approximate only the major region; do not render dozens of fake nodes.
- Never start a force simulation as a loading state.
- Empty graphs render a small starter/local state and text action, not decorative particles.
- Error UI keeps the accessible list and route navigation available.
- Mochi may appear once in a graph empty state; no animation is required.

## Profiling acceptance criteria

These thresholds must be measured in a production build on a normal supported development laptop and one representative mid-range mobile device or equivalent throttled profile. Record device/browser/build details with results.

### Required scenarios

1. My Discovery Web initial desktop budget (24 nodes / 36 edges).
2. My Discovery Web maximum desktop budget (56 / 96).
3. Mobile default (12 / 18) and maximum (28 / 44).
4. Concept Orbit default and expanded maximum.
5. Workspace snapshot at soft warning (70 / 120) and hard backend limit (100 / 200).
6. Select node, pan, zoom, open/close inspector, apply filter, expand, collapse, and explicit re-layout.
7. Reduced-motion and accessible list-only operation.

### Pass targets

- No continuous CPU activity when the graph is idle.
- No layout loop, force tick, or repeated state write after positions settle.
- Interaction handlers target **under 50 ms**; no repeatable long task above 100 ms during select, filter, or sheet open.
- Pan/zoom/drag should sustain a visually smooth response on the target hardware; investigate any repeatable main-thread frame above 50 ms.
- Default graph structural layout target: **under 100 ms desktop** and **under 150 ms mobile** at the stated default budgets.
- Maximum-view explicit re-layout target: **under 250 ms**, with a busy announcement if it exceeds 100 ms.
- No React commit caused by node movement should re-render every inspector/filter component.
- No unexpected network request during pan/zoom; expansion may make one bounded request if the API is designed that way.
- Memory returns close to the pre-view baseline after navigating away; no accumulating event listeners or retained graph instances across repeated route visits.
- Keyboard and list navigation remain usable when the graph fails to mount.
- Production build, TypeScript, ESLint, source-limit checks, and runtime smoke test must pass before acceptance.

The numeric targets are initial product budgets, not claims about current performance. A future implementation task must profile real content and adjust downward before requesting an exception upward.

## Rejected performance patterns

- Rendering the complete canonical dataset because React Flow can technically accept it.
- Calling layout on every render, viewport change, drag frame, or selection.
- Subscribing the full page to `nodes`/`edges`.
- Hiding large branches visually while keeping expensive child components active.
- Persistent edge labels on dense graphs when the list/selection model is clearer.
- Multi-layer shadows, backdrop blur, glass panels, SVG filters, and animated gradients on every node.
- Autoplay tours, bounce/spring loops, parallax, and ambient mascot motion.
- Installing Dagre, ELK, D3, or any performance package before the relevant bounded task is authorized and measured.

## Verification checklist for a future graph implementation

- [ ] Visible node/edge counts are displayed in development diagnostics.
- [ ] Initial, expansion, warning, and maximum budgets are enforced.
- [ ] `nodeTypes` and `edgeTypes` references are stable.
- [ ] Custom nodes and callbacks are memoized where beneficial.
- [ ] Layout runs only on approved triggers.
- [ ] Idle graph performs no continuous work.
- [ ] Normal nodes/edges use simple styles.
- [ ] Mobile starts local and provides a list toggle.
- [ ] Graph and list remain semantically synchronized.
- [ ] Focus-visible, labels, touch targets, and reduced motion pass.
- [ ] No colour-only relationship meaning.
- [ ] Spoiler-hidden data is absent from payload/DOM/accessibility text where required.
- [ ] Production profiling evidence records the required scenarios.

## Decision summary

- **3D:** prohibited.
- **WebGL:** prohibited.
- **Continuous force:** prohibited.
- **Animated edges:** prohibited.
- **Default layout:** deterministic local/radial without a package for Concept Orbit.
- **Optional single engine:** Dagre only for a demonstrated directed-tree need and only in a separately authorized install task.
- **Desktop initial/max:** 24/36 → 56/96 nodes/edges.
- **Mobile initial/max:** 12/18 → 28/44.
- **Expansion:** +8/+12 desktop; +4/+6 mobile.
- **Motion:** finite, state-driven, tokenized, optional.
- **Accessibility:** synchronized semantic list is mandatory.
