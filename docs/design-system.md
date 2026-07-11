# Design System

EstateMind's visual identity is a **dark, futuristic fintech workspace** —
near-black backgrounds, glassmorphism surfaces, vivid teal/cyan accents,
and subtle micro-animations that convey autonomy and intelligence.

---

## Color Palette

All components must use CSS custom properties. No hardcoded hex values.

### Core Colors

| Role | CSS Variable | Value | Usage |
|------|-------------|-------|-------|
| Page Background | `--bg-base` | `#0A0A0F` | Root background |
| Surface | `--bg-surface` | `#12121A` | Cards, panels |
| Elevated Surface | `--bg-elevated` | `#1A1A2E` | Modals, popovers, hover states |
| Glass Surface | `--bg-glass` | `rgba(18, 18, 26, 0.7)` | Glassmorphism cards |

### Text Colors

| Role | CSS Variable | Value | Usage |
|------|-------------|-------|-------|
| Primary Text | `--text-primary` | `#F0F0F5` | Headings, body |
| Secondary Text | `--text-secondary` | `#A0A0B0` | Descriptions, labels |
| Muted Text | `--text-muted` | `#6B7280` | Timestamps, hints |
| Inverse Text | `--text-inverse` | `#0A0A0F` | Text on accent backgrounds |

### Accent Colors

| Role | CSS Variable | Value | Usage |
|------|-------------|-------|-------|
| Primary Accent | `--accent-primary` | `#00D4AA` | CTAs, active states, links |
| Primary Hover | `--accent-primary-hover` | `#00E8BD` | Primary hover state |
| Primary Glow | `--accent-primary-glow` | `rgba(0, 212, 170, 0.15)` | Glow effects, focus rings |
| Secondary Accent | `--accent-secondary` | `#7C3AED` | Badges, secondary actions |
| Secondary Hover | `--accent-secondary-hover` | `#8B5CF6` | Secondary hover state |

### State Colors

| Role | CSS Variable | Value | Usage |
|------|-------------|-------|-------|
| Success | `--state-success` | `#10B981` | Approved, settled, confirmed |
| Warning | `--state-warning` | `#F59E0B` | Low balance, pending |
| Error | `--state-error` | `#EF4444` | Rejected, failed |
| Info | `--state-info` | `#3B82F6` | Informational badges |

### Border Colors

| Role | CSS Variable | Value | Usage |
|------|-------------|-------|-------|
| Default Border | `--border-default` | `#1E1E2E` | Card borders, dividers |
| Subtle Border | `--border-subtle` | `#16162A` | Inner separators |
| Focus Border | `--border-focus` | `#00D4AA` | Focus rings |

### Gradient Presets

```css
--gradient-hero: linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #12121A 100%);
--gradient-card: linear-gradient(180deg, rgba(18, 18, 26, 0.8) 0%, rgba(10, 10, 15, 0.9) 100%);
--gradient-accent: linear-gradient(135deg, #00D4AA 0%, #7C3AED 100%);
--gradient-score: linear-gradient(90deg, #00D4AA 0%, #10B981 100%);
```

---

## Typography

### Font Stack

| Role | Font | CSS Variable | Fallback |
|------|------|-------------|----------|
| UI Text | Inter | `--font-sans` | system-ui, sans-serif |
| Code / Mono | JetBrains Mono | `--font-mono` | monospace |

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display | 48px / 3rem | 700 | 1.1 | Hero headings |
| H1 | 36px / 2.25rem | 700 | 1.2 | Page titles |
| H2 | 28px / 1.75rem | 600 | 1.3 | Section headings |
| H3 | 22px / 1.375rem | 600 | 1.4 | Card titles |
| H4 | 18px / 1.125rem | 500 | 1.4 | Subsection titles |
| Body | 16px / 1rem | 400 | 1.6 | Paragraph text |
| Body Small | 14px / 0.875rem | 400 | 1.5 | Labels, descriptions |
| Caption | 12px / 0.75rem | 400 | 1.4 | Timestamps, hints |
| Mono | 14px / 0.875rem | 400 | 1.5 | Wallet addresses, transaction IDs |

---

## Spacing Scale

Use a 4px base unit. All spacing must use these values.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight inline spacing |
| `--space-2` | 8px | Icon gaps, tight padding |
| `--space-3` | 12px | Input padding, small gaps |
| `--space-4` | 16px | Card padding, component gaps |
| `--space-5` | 20px | Section padding |
| `--space-6` | 24px | Card padding (large) |
| `--space-8` | 32px | Section margins |
| `--space-10` | 40px | Page section gaps |
| `--space-12` | 48px | Major section spacing |
| `--space-16` | 64px | Page top/bottom padding |

---

## Border Radius

| Context | Value | CSS Class |
|---------|-------|-----------|
| Small UI (badges, tags) | 6px | `rounded-md` |
| Buttons, inputs | 8px | `rounded-lg` |
| Cards, panels | 12px | `rounded-xl` |
| Modals, large surfaces | 16px | `rounded-2xl` |
| Full round (avatars, dots) | 9999px | `rounded-full` |

---

## Shadows & Effects

### Box Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(0, 212, 170, 0.15);
--shadow-glow-strong: 0 0 40px rgba(0, 212, 170, 0.25);
```

### Glassmorphism

```css
.glass {
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-default);
}
```

---

## Component Specifications

### Navbar

- **Position:** Fixed top, full width
- **Height:** 64px
- **Background:** `var(--bg-surface)` with `backdrop-filter: blur(12px)`
- **Border:** Bottom border `1px solid var(--border-default)`
- **Logo:** Left-aligned, text "EstateMind" in accent gradient
- **Nav Links:** Center or right-aligned: Discover, Recommend, Bookings, Wallet
- **Active State:** Accent underline + `var(--accent-primary)` text color

### Property Card

- **Background:** `var(--bg-surface)` with glass effect on hover
- **Border:** `1px solid var(--border-default)`
- **Border Radius:** `rounded-xl` (12px)
- **Hover:** Subtle translateY(-4px) + glow shadow + border brightens
- **Content:** Image (top), Name, Location tag, Price (accent color), Rating stars, WiFi badge, Beach distance badge, Availability dot
- **Size:** Min 300px wide in grid

### Score Breakdown Component

- **Layout:** Horizontal bar chart per scoring category
- **Bar Color:** `var(--gradient-score)` for filled portion
- **Background:** `var(--bg-elevated)` for unfilled portion
- **Labels:** Category name (left), Points (right)
- **Animation:** Bars animate in from 0 to final width on mount

### Booking Status Pipeline

- **Layout:** Horizontal stepper with 4 stages
- **Stages:** Submitted → Treasury Review → Settlement → Confirmed
- **Active Stage:** Accent glow + pulse animation
- **Completed Stage:** Success green with checkmark
- **Failed Stage:** Error red with X mark
- **Connector:** Line between stages, colored based on progress

### Wallet Dashboard

- **Balance Card:** Large glass card with USDC balance in Display size
- **Currency Label:** "USDC" in muted text with small Circle logo
- **Transaction List:** Rows with icon (debit/credit), description, amount (red for debit, green for credit), timestamp
- **Initialize Button:** Accent primary button

### Form Inputs

- **Background:** `var(--bg-elevated)`
- **Border:** `1px solid var(--border-default)`
- **Focus:** Border becomes `var(--border-focus)` with glow ring
- **Text:** `var(--text-primary)`
- **Placeholder:** `var(--text-muted)`
- **Border Radius:** `rounded-lg` (8px)
- **Padding:** `var(--space-3)` vertical, `var(--space-4)` horizontal
- **Height:** 44px

### Buttons

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| Primary | `var(--accent-primary)` | `var(--text-inverse)` | none | `var(--accent-primary-hover)` + glow |
| Secondary | transparent | `var(--accent-primary)` | `1px solid var(--accent-primary)` | `var(--accent-primary-glow)` bg |
| Ghost | transparent | `var(--text-secondary)` | none | `var(--bg-elevated)` bg |
| Danger | `var(--state-error)` | white | none | Brighter red |

- **Height:** 44px (default), 36px (small), 52px (large)
- **Border Radius:** `rounded-lg` (8px)
- **Font Weight:** 500
- **Transition:** `all 0.2s ease`

### Status Badges

| Status | Background | Text |
|--------|-----------|------|
| Available | `rgba(16, 185, 129, 0.15)` | `var(--state-success)` |
| Pending | `rgba(245, 158, 11, 0.15)` | `var(--state-warning)` |
| Settled | `rgba(0, 212, 170, 0.15)` | `var(--accent-primary)` |
| Rejected | `rgba(239, 68, 68, 0.15)` | `var(--state-error)` |
| Failed | `rgba(239, 68, 68, 0.15)` | `var(--state-error)` |

---

## Animations & Transitions

### Micro-Animations

```css
/* Card hover lift */
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow);
}

/* Fade in on mount */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Score bar fill */
@keyframes fillBar {
  from { width: 0%; }
  to { width: var(--fill-width); }
}

/* Pulse glow (active pipeline stage) */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(0, 212, 170, 0.3); }
  50% { box-shadow: 0 0 20px rgba(0, 212, 170, 0.6); }
}

/* Shimmer loading */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Transition Defaults

- **Duration:** 200ms for interactions, 300ms for layout changes, 500ms for page transitions
- **Easing:** `ease` for most, `ease-out` for entries, `ease-in` for exits
- **Stagger:** Cards in grids stagger entry by 50ms each

---

## Responsive Breakpoints

| Name | Min Width | Columns (Grid) | Usage |
|------|-----------|----------------|-------|
| Mobile | 0px | 1 | Phone screens |
| Tablet | 640px | 2 | Tablets, small laptops |
| Desktop | 1024px | 3 | Standard screens |
| Wide | 1280px | 4 | Large monitors |

### Layout Rules

- **Mobile:** Single column, hamburger menu, stacked cards
- **Tablet:** 2-column grid, collapsible sidebar
- **Desktop:** Full layout with sidebar navigation, 3-column property grid
- **Wide:** Same as desktop with wider content area

---

## Icons

- **Library:** Lucide React
- **Style:** Stroke-based only (no filled icons)
- **Sizes:**
  - Inline (in text): `h-4 w-4` (16px)
  - Buttons: `h-5 w-5` (20px)
  - Feature icons: `h-6 w-6` (24px)
  - Hero icons: `h-8 w-8` (32px)
- **Color:** Inherit from parent text color by default
- **Stroke Width:** 2px default, 1.5px for larger sizes

### Icon Usage Map

| Context | Icon | Source |
|---------|------|--------|
| Discover/Properties | `Building2` | lucide-react |
| Recommendations | `Sparkles` | lucide-react |
| Bookings | `CalendarCheck` | lucide-react |
| Wallet | `Wallet` | lucide-react |
| Budget | `DollarSign` | lucide-react |
| WiFi | `Wifi` | lucide-react |
| Beach | `Waves` | lucide-react |
| Location | `MapPin` | lucide-react |
| Rating | `Star` | lucide-react |
| Approved | `CheckCircle` | lucide-react |
| Rejected | `XCircle` | lucide-react |
| Pending | `Clock` | lucide-react |
| Transaction | `ArrowUpRight` / `ArrowDownLeft` | lucide-react |
