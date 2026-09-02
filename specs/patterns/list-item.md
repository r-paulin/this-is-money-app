# List item pattern

**Figma:** Ⓒ List Item `8107:97972`, transaction row `8114:196360`

## Layout

| Zone | Spec |
|------|------|
| Horizontal padding | 24px (`px-6`) when custom row; Kalep list may differ |
| Vertical padding | 12px (`py-3` / `--list-item-vr-padding`) |
| Icon → primary text | 16px (`--list-item-start-gap`) |
| Primary text → amount | 12px (`--list-item-end-gap`) |
| Vertical alignment | `items-start` — icon and amount align to top |
| Primary / amount line | `py-[2px]` on text blocks (`--list-item-label-py`) |

## Transaction row

- **Component:** `TransactionRow.tsx`
- **Icon:** `TransactionCategoryIcon` (40px)
- **Primary:** merchant name, `Text` semibold
- **Secondary:** date / status, `text-secondary`
- **Amount:** `formatTransactionListEurFromCents` — sign from `kind`, not raw cents

## When to use Kalep `ListItemLayout`

Use Kalep layout when spacing matches design. If Figma requires explicit gaps (16px / 12px) and top alignment, use a custom flex row documented here.

## Recipient row (send money)

- Avatar 40×40 (`RecipientAvatar`)
- Same start gap principles as transactions
- Trusted badge: Kalep `Badge`, size per Figma — do not scale with CSS transform
