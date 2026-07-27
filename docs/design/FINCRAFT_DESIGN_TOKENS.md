# FinCraft Lab — Design Tokens Contract

## Token Architecture Overview

FinCraft Lab uses Tailwind CSS v4 CSS variables for design tokens. All UI components reference these tokens rather than arbitrary inline magic values.

### 5-Layer Token Architecture (Design System V2)

FinCraft V2 organizes tokens into 5 distinct layers (governed by `docs/architecture/FRONTEND_DESIGN_SYSTEM_V2_DECISION.md`):

```text
Layer 1: Primitive Tokens  (--color-teal-600: #0D9488, --color-stone-900: #1C1917)
  │
  ▼
Layer 2: Semantic Tokens   (--color-action-primary, --color-text-primary)
  │
  ▼
Layer 3: Material/Surface  (--surface-resting, --surface-floating, --border-subtle)
  │
  ▼
Layer 4: Component Tokens  (--button-primary-bg, --card-background)
  │
  ▼
Layer 5: Component State   (--button-primary-hover-bg, --card-border-selected)
```

**Token Usage Rule:** Components MUST NOT reference raw Layer 1 Primitive colors directly when an approved Layer 2 or Layer 3 Semantic Token exists.

---

## Theme & Persistence Architecture

- **Supported Preference Modes:** `light | dark | system`
- **Authoritative Persistence:** **Cookie (`fincraft_theme`)** is the sole authoritative persistence store. `localStorage` is NOT a second source of truth.
- **Server-Side Hydration:** Next.js App Router inspects `fincraft_theme` cookie during SSR (`cookies()`) to apply `.dark` class to initial HTML, preventing FOUC white flashes.
- **Dark Mode Candidate Values:** Dark Mode color pairs are explicitly designated as **Candidate Exploration Values**. Final dark hex values will be frozen only after contrast validation prototyping (`P13_FRONTEND_FOUNDATION_1D7`).

---

## 1. Color Tokens

### Primary Action Family (Teal)
```css
--color-teal-50:  #F0FDFA;
--color-teal-100: #CCFBF1;
--color-teal-500: #14B8A6;
--color-teal-600: #0D9488; /* Primary Brand Button */
--color-teal-700: #0F766E; /* Hover / Active State */
--color-teal-900: #134E4A;
```

### Craft & Discovery Family (Orange)
```css
--color-orange-50:  #FFF7ED;
--color-orange-100: #FFEDD5;
--color-orange-500: #F97316;
--color-orange-600: #EA580C; /* Craft Action / Discovery Accent */
--color-orange-700: #C2410C;
```

### Laboratory Surface Neutrals (Warm Neutrals - Light Mode Baseline)
```css
--color-surface-base:    #FAFAF9; /* Main Laboratory Background */
--color-surface-card:    #FFFFFF; /* Card Surface */
--color-surface-muted:   #F5F5F4; /* Panel / Muted Surface */
--color-surface-subtle:  #E7E5E4; /* Hover Neutral Surface */
--color-border-subtle:   #E7E5E4; /* Light Border */
--color-border-default:  #D6D3D1; /* Standard Input / Card Border */
--color-border-strong:   #A8A29E; /* Focused Border */
```

### Typography Text Colors
```css
--color-text-primary:    #1C1917; /* High contrast body / headers */
--color-text-secondary:  #44403C; /* Muted descriptions */
--color-text-tertiary:   #78716C; /* Captions / Timestamps */
--color-text-on-primary: #FFFFFF; /* Text on dark Teal/Orange buttons */
```

### Semantic Messaging Tokens
```css
--color-success-bg:     #F0FDF4; --color-success-text: #166534; --color-success-border: #BBF7D0;
--color-warning-bg:     #FFFBEB; --color-warning-text: #92400E; --color-warning-border: #FDE68A;
--color-error-bg:       #FEF2F2; --color-error-text:   #991B1B; --color-error-border:   #FECACA;
--color-info-bg:        #EFF6FF; --color-info-text:    #1E40AF; --color-info-border:    #BFDBFE;
```

### Element Category Color Mapping (8 Categories)
```css
--cat-income-assets:      #059669; /* Emerald Green */
--cat-debt-liabilities:   #DC2626; /* Crimson Red */
--cat-cashflow-budget:    #0284C7; /* Sky Blue */
--cat-risk-insurance:     #D97706; /* Amber */
--cat-investment:         #7C3AED; /* Violet */
--cat-tax-compliance:     #475569; /* Slate Gray */
--cat-behavior-mindset:   #DB2777; /* Pink */
--cat-macro-environment:  #0891B2; /* Cyan */
```

---

## 2. Typography Tokens & Rules

### Font Families
- **Thai UI**: `Noto Sans Thai`, sans-serif
- **English & Numbers**: `Inter`, sans-serif
- **Heading Accents**: Optional editorial serif (`Playfair Display` or `Merriweather`) for major marketing headers only.
- **Rule**: NO serif fonts in forms, Canvas node labels, data tables, controls, or numerical data.

### Scale & Hierarchy
```css
--text-xs:   0.75rem / 1.00rem;  /* Captions, badges */
--text-sm:   0.875rem / 1.25rem; /* Table data, small controls */
--text-base: 1.00rem / 1.50rem;  /* Body text, inputs */
--text-lg:   1.125rem / 1.75rem; /* Section titles */
--text-xl:   1.25rem / 1.75rem;  /* Card headings */
--text-2xl:  1.50rem / 2.00rem;  /* Page subheadings */
--text-3xl:  1.875rem / 2.25rem; /* Page headings */
--text-4xl:  2.25rem / 2.50rem;  /* Hero headings */
```

---

## 3. Spacing, Layout & Touch Target Tokens

```css
--space-1:  0.25rem;  (4px)
--space-2:  0.50rem;  (8px)
--space-3:  0.75rem;  (12px)
--space-4:  1.00rem;  (16px)
--space-6:  1.50rem;  (24px)
--space-8:  2.00rem;  (32px)
--space-12: 3.00rem;  (48px)
--space-16: 4.00rem;  (64px)
```

### Layout Widths & Touch Standards
- **Max Content Width**: `1280px` (`max-w-7xl`)
- **Reading Width**: `768px` (`max-w-3xl`)
- **Auth Card Width**: `440px` (`max-w-md`)
- **FinCraft Preferred Touch Target**: **44px x 44px** (Product preference standard)
- **WCAG 2.2 AA Target Size Baseline**: 24px x 24px (SC 2.5.8 Level AA minimum)

---

## 4. Radius, Shadows & Material Elevation

### Border Radius
```css
--radius-sm:   0.375rem; (6px - Buttons, Inputs)
--radius-md:   0.50rem;  (8px - Cards, Dialogs)
--radius-lg:   0.75rem;  (12px - Large Containers, Sheets)
--radius-full: 9999px;   (Badges, Avatars)
```

### Shadow Elevation
```css
--shadow-sm:   0 1px 2px 0 rgba(0, 0, 0, 0.05);  /* Subtle cards */
--shadow-md:   0 4px 6px -1px rgba(0, 0, 0, 0.1);/* Popovers, Dropdowns */
--shadow-lg:   0 10px 15px -3px rgba(0, 0, 0, 0.1);/* Dialogs, Sheets */
--highlight-inner: inset 0 1px 0 0 rgba(255, 255, 255, 0.3); /* Specular top edge highlight */
```

---

## 5. Motion & Z-Index Tokens

### Motion & Easing
```css
--duration-fast: 150ms;  /* Button clicks, toggles */
--duration-norm: 250ms;  /* Panel transitions, accordions */
--duration-slow: 350ms;  /* Modal fade, sheet slide */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
```
- **Accessibility Rule**: `@media (prefers-reduced-motion: reduce)` disables all non-essential transform and opacity transitions.

### Z-Index Hierarchy
```css
--z-canvas:   0;
--z-sticky:   10;
--z-drawer:   20;
--z-header:   30;
--z-overlay:  40;
--z-modal:    50;
--z-toast:    100;
```

---

## 6. Responsive Breakpoints

```text
sm: 640px  (Mobile landscape / small tablet)
md: 768px  (Tablet portrait / stacked lab layout)
lg: 1024px (Laptop / 3-column lab layout)
xl: 1280px (Desktop / full width canvas)
```

---

## 7. Canonical Surface Elevation & Edge Matrix

FinCraft Design System V2 freezes 7 Surface Elevation Roles and 6 Edge Roles:

### Surface Roles
- `surface-flat`: Root canvas and background plane (100% solid opaque).
- `surface-card`: Document reading card (100% solid opaque).
- `surface-inset`: Recessed input well, code block, or drop zone (100% solid opaque).
- `surface-resting`: Standard tactile interactive card (100% solid opaque + top specular highlight).
- `surface-raised`: Active selected node or highlighted card (100% solid opaque + selected stroke).
- `surface-floating`: Tool inspector, popover, or dropdown menu (bounded 92% translucency + 8px blur allowed).
- `surface-overlay`: Modal dialog or sliding sheet drawer (bounded 96% translucency + 12px blur allowed).

### Edge Roles
- `border-subtle`: Quiet boundary for normal component separation.
- `border-interactive`: Interactive hover and focus-visible boundary.
- `border-selected`: Stronger boundary for selected or active states.
- `border-discovery`: Orange discovery highlight boundary.
- `border-floating`: Elevated boundary for popovers and floating panels.
- `border-destructive`: Red warning and destructive state boundary.

### Relationship Families
- `relation-recipe`: Orange Craft/Discovery semantics for recipe provenance.
- `relation-support`: Teal trust/action semantics for directional support.
- `relation-reduce`: Teal trust/action semantics with "May reduce" language.
- `relation-tradeoff`: Warning-neutral trade-off semantics.
- `relation-related`: Neutral relatedness semantics.
- `relation-personal`: Neutral personal-workspace semantics marked Personal/My link.
