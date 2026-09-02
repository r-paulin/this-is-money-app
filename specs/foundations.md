# Foundations

## Typography

- **Family:** Inter Variable (`--font-family`)
- **Weights:** 450 regular (`--font-weight-regular`), 650 semibold (`--font-weight-semibold`)
- **Components:** Use Kalep `Text` with `variant` props — do not invent font sizes in feature code

## Color

1. **Semantic first** — `text-primary`, `text-secondary`, `bg-neutral-secondary`, `text-content-action-primary`, etc. (Kalep / design-tokens)
2. **App tokens second** — MCC category fills (`bg-mcc-*`), layout aliases in `tokens.css`
3. **Never** — raw `#hex` in `.tsx` / arbitrary `bg-[#…]` in class names

Exceptions (defined only in token/CSS config files):

- Device preview bezel (`tokens.css`)
- Payment card gradients (`paymentCard.config.ts`)
- Wallet stack decorative gradient (`wallet-stack.css`)

## Spacing

Kalep dimension scale (also in `tokens.css`):

| Token | px |
|-------|-----|
| `--dimension-100` | 4 |
| `--dimension-150` | 6 |
| `--dimension-200` | 8 |
| `--dimension-250` | 10 |
| `--dimension-300` | 12 |
| `--dimension-400` | 16 |

## Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-compact` | 8px | Icon buttons, compact tiles (e.g. Get statement) |
| `--radius-card` | 12px | Cards |
| `rounded-full` | 50% | MCC circles, avatars |

Tailwind: `rounded-compact`, `rounded-card`
