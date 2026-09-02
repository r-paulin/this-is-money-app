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
| `--mcc-badge-offset` | `-bottom-mcc-badge-offset`, `-right-mcc-badge-offset` | 6 |

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

## Radius

| CSS variable | Tailwind |
|--------------|----------|
| `--radius-compact` | `rounded-compact` |
| `--radius-card` | `rounded-card` |
| `--device-screen-radius` | `rounded-device-screen` (preview frame only) |
