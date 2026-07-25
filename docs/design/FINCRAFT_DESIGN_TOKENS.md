# FinCraft Lab — Design Tokens Contract

## Token Architecture Overview

FinCraft Lab uses Tailwind CSS v4 CSS variables for design tokens. All UI components reference these tokens rather than arbitrary inline magic values.

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

### Laboratory Surface Neutrals (Warm Neutrals)
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

## 3. Spacing & Layout Tokens

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

### Layout Widths
- **Max Content Width**: `1280px` (`max-w-7xl`)
- **Reading Width**: `768px` (`max-w-3xl`)
- **Auth Card Width**: `440px` (`max-w-md`)
- **Min Touch Target**: `44px x 44px`

---

## 4. Radius, Shadows & Elevation

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

## 7. Future Semantic Surface and Relationship Families

The following semantic families are reserved for future component implementation. They are token names and meaning contracts, not implementation CSS. They must map to the existing colour semantics and must not introduce a second teal or orange meaning.

### Surface and state families

- `surface-flat`: normal reading content and calm document regions; no earned depth.
- `surface-resting`: a stable resting surface for an interactive region.
- `surface-inset`: an input well, drop area, or recessed craft region.
- `surface-raised`: a pressed, selected, or otherwise actively dimensional control.
- `surface-floating`: an overlay, sheet, popover, or inspector above the reading plane.
- `border-subtle`: the existing quiet boundary for normal separation.
- `border-interactive`: a boundary that responds to hover or focus-visible state.
- `border-selected`: the stronger boundary for selected or active state.
- `highlight-inner`: a restrained inner highlight used only when a surface earns tactile depth.
- `shadow-resting`: the lightest static elevation for an interactive resting surface.
- `shadow-raised`: the selected or pressed elevation step.
- `shadow-floating`: the overlay elevation step for sheets, dialogs, and inspectors.

### Relationship families

- `relation-recipe`: orange Craft/Discovery semantics for recipe provenance; use direction and text as well as colour.
- `relation-support`: teal trust/action semantics for sourced directional support.
- `relation-reduce`: teal trust/action semantics with cautious “May reduce” language and a non-colour marker.
- `relation-tradeoff`: warning-neutral, conditional trade-off semantics; use line pattern and text.
- `relation-related`: neutral, sparingly used relatedness semantics.
- `relation-personal`: neutral personal-workspace semantics with a Personal/My link marker; never present it as canonical truth.

Canonical relationship labels, spoiler rules, and graph boundaries are defined in `docs/architecture/FRONTEND_VISUAL_AND_DISCOVERY_WEB_DECISION.md`. Existing motion durations remain canonical: 150ms fast, 250ms normal, and 350ms slow. Future discovery celebration may not exceed the research ceiling of 700ms, is finite, and is removed or made static under reduced motion. These ceilings do not replace the existing duration tokens.
