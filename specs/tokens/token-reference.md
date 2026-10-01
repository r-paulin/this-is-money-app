# Token reference

Source of truth: `src/shared/styles/tokens.css`  
Tailwind extensions: `tailwind.config.ts`

## Content & surfaces

| CSS variable | Tailwind (Kalep) |
|--------------|------------------|
| `--content-primary` | `text-primary` |
| `--content-secondary` | `text-secondary` |
| `--content-tertiary` | `text-tertiary` |
| `--layer-floor-1` | `bg-floor-1` |

## List item (Figma 8107:97972)

| CSS variable | Tailwind | px |
|--------------|----------|-----|
| `--list-item-vr-padding` | `py-list-vr` / `px-list-vr`* | 12 |
| `--list-item-start-gap` | `pr-list-start-gap` / `gap-list-start-gap`* | 16 |
| `--list-item-end-gap` | `pl-list-end-gap` / `gap-list-end-gap`* | 12 |
| `--list-item-label-py` | `py-[2px]` or custom | 2 |

\*Use spacing utilities as needed; prefer Kalep `ListItemLayout` when it matches Figma.

## MCC icon

| CSS variable | Tailwind | px |
|--------------|----------|-----|
| `--mcc-icon-padding` | `p-mcc-pad` | 10 |
| `--mcc-icon-glyph-size` | `size-5` (20px) | 20 |
| `--mcc-badge-size` | `size-mcc-badge` | 16 |
| `--mcc-badge-offset` | `-bottom-mcc-badge-offset`, `-right-mcc-badge-offset` | 4 |

## MCC theme fills

| Theme id | CSS variable | Tailwind class |
|----------|--------------|----------------|
| groceries | `--mcc-groceries` | `bg-mcc-groceries` |
| food / restaurants | `--mcc-food` | `bg-mcc-food` |
| travel | `--mcc-travel` | `bg-mcc-travel` |
| transport | `--mcc-transport` | `bg-mcc-transport` |
| medical | `--mcc-medical` | `bg-mcc-medical` |
| shopping | `--mcc-shopping` | `bg-mcc-shopping` |
| money | `--mcc-money` | `bg-mcc-money` |
| utilities | `--mcc-utilities` | `bg-mcc-utilities` |
| government | `--mcc-government` | `bg-mcc-government` |
| fuel | `--mcc-fuel` | `bg-mcc-fuel` |
| decline | `--mcc-decline` | `bg-mcc-decline` |

Map MCC codes → theme in `src/features/transactions/data/mccThemes.ts` only.

## Home card thumbnails

| CSS variable | Tailwind |
|--------------|----------|
| `--card-thumb-green` | `bg-card-thumb-green` |
| `--card-thumb-black` | `bg-card-thumb-black` |
| `--card-thumb-locked` | `bg-card-thumb-locked` |
| `--card-thumb-add` | `bg-card-thumb-add` |

## Display M (home balance)

| CSS variable | Value |
|--------------|-------|
| `--display-m-font-size` | 48px |
| `--display-m-line-height` | 60px |
| `--display-m-letter-spacing` | -1.056px |

Use with `--font-weight-semibold` (650) and `--content-primary`.

## Motion

Defined in `src/shared/styles/tokens.css`. Authored UI motion uses these variables only. See `.cursor/rules/motion.mdc`.

| Token | Value | Use |
|-------|-------|-----|
| `--motion-duration-xs` | 100ms | Press, colour, opacity |
| `--motion-duration-sm` | 200ms | Toggle, icon swap, small fade. Exits one step shorter. |
| `--motion-duration-md` | 300ms | Expand, toast, tab indicator |
| `--motion-duration-lg` | 400ms | Large exit, dialog-scale |
| `--motion-duration-xl` | 500ms | iOS page and sheet enter. Ceiling. |
| `--motion-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Moves while it stays on screen |
| `--motion-ease-enter` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Arrives |
| `--motion-ease-exit` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Leaves |
| `--motion-ease-ios` | `cubic-bezier(0.32, 0.72, 0, 1)` | Only via `--motion-nav-*` and `--motion-sheet-*` |
| `--motion-spring-smooth` | settle 490ms, bounce 0 | Layout, drag release |
| `--motion-spring-snappy` | settle 340ms, bounce 0.15 | Toggle thumb |
| `--motion-spring-bouncy` | settle 450ms, bounce 0.3 | One confirmed-success element |
| `--motion-press-scale` | 0.97 | Press. Reduced motion sets this to 1. |
| `--motion-offset-xs` / `--motion-blur-xs` | 4px / 2px | Text swap, with `--motion-text-swap-duration` 150ms |
| `--motion-offset-sm` | 8px | Toast / small rise |
| `--motion-offset-md` | 30px | Short travel |
| `--motion-stagger` | 40ms | First-render delay, five items max |

`--motion-nav-enter-*`, `--motion-nav-exit-*`, `--motion-sheet-enter-*`, and `--motion-sheet-exit-*` fork per platform. This app sets `data-platform="ios"` at boot, so enter is xl + iOS ease and exit is lg + iOS ease. `prefers-reduced-motion: reduce` shortens springs and travel to sm and clears offsets.

## Radius

| CSS variable | Tailwind |
|--------------|----------|
| `--radius-compact` | `rounded-compact` |
| `--radius-card` | `rounded-card` |
| `--radius-grouped` | `rounded-grouped` |
| `--device-screen-radius` | `rounded-device-screen` (preview frame only) |
