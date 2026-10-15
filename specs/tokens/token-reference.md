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
| entertainment | `--mcc-entertainment` | `bg-mcc-entertainment` |
| travel | `--mcc-travel` | `bg-mcc-travel` |
| transport | `--mcc-transport` | `bg-mcc-transport` |
| medical | `--mcc-medical` | `bg-mcc-medical` |
| shopping | `--mcc-shopping` | `bg-mcc-shopping` |
| money | `--mcc-money` | `bg-mcc-money` |
| utilities | `--mcc-utilities` | `bg-mcc-utilities` |
| other | `--mcc-other` | `bg-mcc-other` |
| cashback | `--mcc-cashback` | `bg-mcc-cashback` |
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

Defined in `src/shared/styles/tokens.css` (motionSystem v1). JS recipes: `src/shared/motion/motionSystem.ts`. See `.cursor/rules/motion.mdc`.

| Token | Value | Use |
|-------|-------|-----|
| `--motion-duration-xs` … `xl` | 100–500ms | Authored UI travel grid |
| `--motion-duration-pulse` | 1600ms | Skeleton pulse only (`linear`) |
| `--motion-duration-story-dwell` | 5000ms | Stories progress only (`linear`) |
| `--motion-ease-standard` / `enter` / `exit` / `ios` | beziers | Stay / arrive / leave; iOS only via nav/sheet/dialog/modal |
| `--motion-spring-smooth` / `snappy` / `bouncy` | spring or ease fallback | Layout, toggle, success |
| `--motion-distance-sm` / `md` / `lg` | 4 / 8 / 32px | Travel distances |
| `--motion-scale-sm` / `lg` | 0.97 / 0.5 | Press / pop-in |
| `--motion-fade-in*` / `fade-out*` / `cross-fade*` | spring recipes | Opacity enters/exits |
| `--motion-nav-enter-*` / `exit-*` / `parallax` | platform fork | Page push/pop (Android 32px parallax, iOS 30%) |
| `--motion-sheet-*` / `dialog-*` / `modal-*` | platform fork | Sheets, dialogs, modals |
| `--motion-offset-*` / `--motion-press-scale` | aliases | Compat → distance / scale-sm |

Platform: `applyPlatformAttribute()` in `main.tsx` sets `data-platform`. Nav enter/exit and parallax fork from that. Reduced motion shortens travel to sm fades and zeroes parallax/distances.

## Radius

| CSS variable | Tailwind |
|--------------|----------|
| `--radius-compact` | `rounded-compact` |
| `--radius-card` | `rounded-card` |
| `--radius-grouped` | `rounded-grouped` |
| `--device-screen-radius` | `rounded-device-screen` (preview frame only) |
