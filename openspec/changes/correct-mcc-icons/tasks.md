# Tasks

## 1. Category marks

- [ ] 1.1 In `src/features/transactions/data/mccThemes.ts` and `src/features/transactions/data/mccThemes.test.ts`, stop returning an arrow or error mark. A ride payout resolves to the Bolt theme, a declined grocery keeps the grocery theme, and a failed row with MCC 0 resolves to other. Verify the updated unit test covers those three cases.
- [ ] 1.2 In `src/features/transactions/components/TransactionCategoryIcon.tsx` and `specs/components/mcc-icon.md`, draw the theme circle plus the existing `badgeForKind` corner badge. Do not change that badge's size or flip. A ride payout is the Bolt glyph on the green circle with the same inflow badge a reversal uses, including on detail. Declined and failed keep the category glyph on `bg-neutral-secondary`, and a detail surface uses `bg-layer-floor-1` for those only. Verify a ride payout does not render a full-size arrow, and a declined grocery still renders the basket.

## 2. Detail and list alignment

- [ ] 2.1 In `src/features/transactions/components/TransactionDetailSummary.tsx`, pass the detail surface into `TransactionCategoryIcon`. Verify a declined detail mark uses the white circle and a list row does not.
- [ ] 2.2 In `src/features/transactions/components/TransactionRow.tsx`, top-align the amount with the merchant name. A local class on that row may set the inner flex to `flex-start`. Do not edit Kalep. Verify on a two-line row that the amount's top matches the merchant name and is not centered on the row.
- [ ] 2.3 In `src/features/transactions/components/TransactionRow.tsx`, keep the strikethrough for reversal, failed, and declined, and use Typography `color="tertiary"` for that tone. A missing amount stays `color="secondary"`. Verify a reversal amount is tertiary and struck through.

## 3. Integration

- [ ] 3.1 Run `npm test` and `npm run build`. Verify both pass, and eslint on the files this change touches reports no new issues.
