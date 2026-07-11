# UI Context

## Theme

The design language is a dark, futuristic fintech workspace. There is no light mode. The interface features near-black backgrounds, glassmorphism layered surfaces, and vivid cyan/teal and purple accent colors to convey autonomy, intelligence, and modern finance.

## Colors

All components must use these CSS custom property tokens. No hardcoded hex values are permitted in the components.

| Role            | CSS Variable       | Value    |
| --------------- | ------------------ | -------- |
| Page background | `--bg-base`        | `#0A0A0F` |
| Surface         | `--bg-surface`     | `#12121A` |
| Elevated surface| `--bg-elevated`    | `#1A1A2E` |
| Primary text    | `--text-primary`   | `#F0F0F5` |
| Muted text      | `--text-muted`     | `#6B7280` |
| Primary accent  | `--accent-primary` | `#00D4AA` |
| Secondary accent| `--accent-secondary`| `#7C3AED` |
| Border          | `--border-default` | `#1E1E2E` |
| Error           | `--state-error`    | `#EF4444` |
| Success         | `--state-success`  | `#10B981` |
| Warning         | `--state-warning`  | `#F59E0B` |

## Typography

| Role      | Font              | Variable      |
| --------- | ----------------- | ------------- |
| UI text   | Inter             | `--font-sans` |
| Code/mono | JetBrains Mono    | `--font-mono` |

## Border Radius

| Context           | Class            |
| ----------------- | ---------------- |
| Inline / small UI | `rounded-md`     |
| Buttons / Inputs  | `rounded-lg`     |
| Cards / panels    | `rounded-xl`     |
| Modals / overlays | `rounded-2xl`    |

## Component Library

Custom components built with Tailwind CSS. Leverage structural layouts and utility classes directly. Reusable components will be placed in `frontend/frontend/components/`.

## Layout Patterns

- **Full-width with sidebar nav**: The main application layout utilizes a top or side navigation structure to access Discover, Recommend, Bookings, and Wallet views.
- **Glassmorphism cards**: Property cards and wallet summary cards use semi-transparent backgrounds with backdrop blur to create depth.
- **Centered modals**: Modal dialogs use a centered overlay with a strong backdrop blur to focus user attention on critical actions (like booking confirmation).
- **Navbar**: Top bar with a bottom border and blurred background.

## Icons

Lucide React is used for all icons. Stroke-based icons only.
Sizes:
- `h-4 w-4` for inline text/badges.
- `h-5 w-5` for standard buttons.
- `h-6 w-6` for prominent feature icons.
