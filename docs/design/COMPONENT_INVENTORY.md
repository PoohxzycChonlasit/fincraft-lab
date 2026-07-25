# FinCraft Lab — Component Inventory

## Inventory Categories & Phasing

Components are categorized into four distinct layers to maintain separation of concerns and prevent oversized component files:

1. **shadcn/ui primitives** (`src/components/ui`): Low-level accessible primitives.
2. **FinCraft brand components** (`src/components/brand`): Reusable domain visual assets.
3. **Feature components** (`src/features/*/components`): Domain-specific business components.
4. **Deferred components**: Post-MVP and non-essential UI components.

---

## 1. shadcn/ui Primitives (`src/components/ui`)

### Initial Foundation Candidates (Phase 1 Scaffold)
| Primitive | Responsibility | Reusable Scope | Expected States | Accessibility |
|---|---|---|---|---|
| `Button` | Primary/secondary actions | Global | Default, Hover, Focus-visible, Active, Loading, Disabled | ARIA button, 44px min touch |
| `Input` | Single-line text input | Forms | Default, Hover, Focus-visible, Error, Disabled | Label association, aria-invalid |
| `Label` | Field label | Forms | Default, Disabled, Error | HTML `for` binding |
| `Field` | FieldLabel, FieldDescription, FieldError wrapper | Forms | Default, Invalid, Disabled | ARIA fieldset & error binding |
| `Card` | Surface container | Layout | Default, Hover | Semantic sectioning |
| `Badge` | Category / status indicator | Global | Category variants | High contrast text |
| `Separator` | Visual divider | Layout | Horizontal, Vertical | `aria-orientation` |
| `Alert` | System messaging | Global | Success, Warning, Error, Info | `role="alert"` |
| `Skeleton` | Content loading placeholder | Global | Pulsing animation | `aria-busy="true"` |
| `Tooltip` | Hover micro-explanation | Global | Open, Closed | Keyboard focus trigger |
| `Dialog` | Modal dialogs | Global | Open, Closed | Focus trap, Escape key close |
| `Sheet` | Sliding side drawers | Global | Open, Closed | Focus trap, swipe close |
| `DropdownMenu` | Action menus | Global | Open, Closed | Keyboard arrow navigation |
| `Select` | Dropdown select | Forms | Default, Open, Disabled | ARIA listbox |
| `Tabs` | Segmented views | Navigation | Active, Inactive, Disabled | ARIA tablist |
| `Avatar` | User / pet picture | Global | Image, Fallback | Alt text, ARIA img |
| `Sonner` | Toast notifications | Global | Top-right toast queue | `aria-live="polite"` |

### Feature-Stage Candidates (Phase 2 Installation)
- `Command`: Fast search palette (installed for Knowledge Vault element search).
- `ScrollArea`: Custom scrollable panels (installed for Vault list).
- `Popover`: Inline popup panels.
- `Slider`: Range controls (installed for Simulation input parameters).
- `Toggle` & `ToggleGroup`: Button toggle groups.
- `Resizable`: Split panel handles (installed for Canvas / Vault split view).
- `Table`: Admin data grid table.
- `Pagination`: Admin table page navigation.
- `Chart`: Recharts wrapper (installed for Simulation timeline chart).
- `Accordion`: Collapsible FAQ & trade-off sections.
- `Progress`: Percentage progress bar.

*Rule*: **DO NOT run `shadcn add --all`**. Install only individual primitives when required by the active task phase.

---

## 2. FinCraft Brand Components (`src/components/brand`)

| Component Name | Responsibility | Reusable Scope | Expected States | Responsive Strategy |
|---|---|---|---|---|
| `FinCraftLogo` | Brand emblem & title | Header, Footer, Auth | Default, Compact | Text hides on small mobile |
| `MochiGuide` | Educational mascot guide | Onboarding, Guidance, Empty states | Idle, Explaining, Celebrating, Warning | Shrinks / hides on small screens |
| `ElementBadge` | Visual category badge | Vault, Detail, Cards | Category colors, Small/Large | Wraps inline |
| `ElementIcon` | Category emoji & icon | Canvas, Badges, Tables | Default, Dragging, Selected | Fixed aspect ratio |
| `CraftEquation` | Inputs → Output formula | Craft Canvas, Details | Valid recipe, Invalid combo | Stacks vertically on mobile |
| `EducationDisclaimer` | Safety banner | Footer, Details, Simulation | Static banner | Collapsible on mobile |
| `DiscoveryStatus` | New discovery banner | Craft Canvas popup | Unlocked, Already known | Centered overlay sheet |
| `CategoryLegend` | Color legend for categories | Graph View, Vault | Expanded, Collapsed | Collapses into popover on mobile |
| `TradeoffCard` | Pros vs Cons visual card | Discovery Detail | Benefits, Risks | 2-column desktop → 1-column mobile |
| `SimulationInsightCard` | Scenario key takeaway | Simulation results | Safe, At Risk, High Risk | Stacked card |
| `EmptyLabState` | Blank state placeholder | Workspaces, Canvas | No items, Search empty | Centered flex column |

---

## 3. Feature Component Structure (`src/features/*/components`)

### Auth Feature (`src/features/auth/components`)
- `LoginForm`: Handles email/password submission.
- `RegisterForm`: Handles user registration submission.
- `AuthHeader`: Branding title for auth card.

### Pet Feature (`src/features/pet/components`)
- `PetSpeciesSelector`: Grid of selectable animal companions.
- `PetProfileCard`: Displays pet name, species avatar, and goals.

### Knowledge Vault & Elements (`src/features/elements/components`)
- `KnowledgeVault`: Vault panel containing search and elements.
- `ElementCategoryFilter`: Filter pills for categories.
- `DraggableElementCard`: Vault element card supporting drag events.

### Craft & Canvas (`src/features/craft/components` & `src/features/canvas/components`)
- `CraftCanvas`: Main React Flow interactive canvas viewport.
- `ElementCanvasNode`: Custom React Flow node rendering an element.
- `CraftToolbar`: Canvas action controls (Clear, Center, Combine).
- `RecipeResultSheet`: Slide-over celebrating a new concept discovery.

### Simulation (`src/features/simulation/components`)
- `SimulationInputPanel`: Form sliders for cash, expenses, and horizon.
- `SimulationChart`: Recharts line graph showing cash reserve projection.
- `SurvivalMilestoneCard`: Milestone indicator showing month survival limit.

### Admin Content (`src/features/admin-content/components`)
- `AdminElementTable`: Data table listing elements and content status.
- `AdminElementForm`: Form sheet for creating or editing element metadata.
- `DiscoveryDetailForm`: Form for editing trade-offs and sources.

---

## 4. Deferred Components (Post-MVP)
- `CommunityPostCard`: Deferred (Social feed post).
- `CommentThread`: Deferred (Post comments).
- `CheckoutForm`: Out of Scope (Payment processing).
- `MultiplayerCursors`: Deferred (Real-time collaborative editing).
