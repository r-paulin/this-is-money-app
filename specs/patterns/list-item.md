# List item pattern

**Figma:** Ⓒ List Item `9656:41653` (size.comp.M), `_ MCC` `138:7229`

## Layout

| Zone | Spec |
|------|------|
| Horizontal padding | 24px (`px-6` / Kalep `paddingStart={6}`) |
| Vertical padding | Activity rows: 8px size.comp.M (`paddingTop`/`paddingBottom`={2}); other lists may use 12px (`py-3`) |
| Icon → primary text | 12px (`gap-3` / Kalep list gap) |
| Primary text → amount | 12px |
| Content row | Top-aligned (`.transaction-row` overrides Kalep `items-center`) so amount and title share a line |
| Start slot | 6px vertical pad on the 40px MCC (`self-start py-1.5`) |
| End slot | 4px top pad (`self-start pt-1`) so the amount lines up with the primary line |
| Primary / amount line | `py-[var(--list-item-label-py)]` (2px) |

## Transaction row

- **Component:** `TransactionRow.tsx`
- **Icon:** `TransactionCategoryIcon` (40px)
- **Primary:** merchant name, `body-m-compact-regular`, clamp 3 lines
- **Secondary:** time · status (or reserved amount / linked merchant), `body-s-regular` `text-secondary`
- **Amount:** `formatSignedTransactionAmount` — sign and tone from `kind` + `listStatus`; tabular lining figures
- **Foreign amount:** optional second end-slot line (`secondaryAmountText`), `body-s` `text-secondary`

## When to use Kalep `ListItemLayout`

Use Kalep layout when spacing matches design. Activity rows override vertical padding to 8px to match list item M.

## Recipient row (send money)

- Avatar 40×40 (`RecipientAvatar`)
- Same start gap principles as transactions
- Trusted badge: Kalep `Badge`, size per Figma — do not scale with CSS transform
