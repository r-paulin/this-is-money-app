# Tasks

## 1. Category icons

- [x] 1.1 Add `--mcc-entertainment`, `--mcc-other`, and `--mcc-cashback` in `src/shared/styles/tokens.css` and the matching `bg-mcc-*` entries in `tailwind.config.ts`, using the Figma symbol fills. Document them in `specs/tokens/token-reference.md`. Verify `npm run token-audit` does not flag the new classes.
- [x] 1.2 Update `src/features/transactions/data/mccThemes.ts` and `src/features/transactions/components/TransactionCategoryIcon.tsx` so transfers, payouts, and ATM use a 40px arrow, failed and declined use the error icon, entertainment and other use their own colors, cashback is override-only, and the bolt theme no longer copies the money MCC list. Update `specs/components/mcc-icon.md`. Verify a ride payout does not render `badge-inflow.svg` and a declined grocery does not render the basket.

## 2. Activity list

- [x] 2.1 Change `src/features/transactions/lib/formatTransactionDate.ts` so list timestamps are clock-only, and update `src/features/transactions/lib/formatTransactionDate.test.ts`. Verify a today row formats as a time and not a calendar date.
- [x] 2.2 In `src/features/transactions/components/TransactionsScreen.tsx`, title the screen Activity and put the title, search, statement action, and list in the scrolling region. Back stays on the global navbar. Verify scrolling the list moves the title off screen while that navbar back stays.
- [x] 2.3 Page `buildMockTransactions` in `src/features/transactions/components/TransactionsScreen.tsx` at 20 rows, append skeletons from `src/features/transactions/components/TransactionsLoadingScreen.tsx` for the next page, and show the end snackbar with space under the last row when the feed is exhausted. Verify the second page shows skeletons before rows, and the snackbar text is "You have reached the end of your activity list".

## 3. Search

- [x] 3.1 Extend `src/features/transactions/lib/searchTransactions.ts` and `src/features/transactions/data/mockTransactions.ts` to match word-start names, amounts, reference, type label, and transfer ID, including declined rows. Update `src/features/transactions/lib/searchTransactions.test.ts`. Verify `elodie` matches Élodie, `100.00` matches that amount, and a one-character query is not applied by the screen.
- [x] 3.2 In `src/features/transactions/components/TransactionsScreen.tsx`, skip filtering under three characters, show the search skeleton while a longer query settles, render the empty illustration with both copy lines, and render the error illustration with retry when the filter throws. Verify the empty state does not say only "No transactions found", and a test covers the thrown-filter branch.

## 4. Statement

- [x] 4.1 In `src/features/transactions/components/GetStatementFormContent.tsx` and `src/features/transactions/components/GetStatementGate.tsx`, block a custom range longer than one year with an inline message between the dates and Create statement, and keep the entered dates. Verify creation does not start for that range.
- [x] 4.2 In `src/features/transactions/components/GetStatementGate.tsx`, `src/features/transactions/components/GetStatementCreatingContent.tsx`, and `src/features/transactions/components/GetStatementReadyContent.tsx`, swap in the longer-creation copy after 3 seconds, show empty-period success with both formats when the mock feed has no rows in range, show a distinct retry error when generation throws, and snackbar a successful download. Verify an empty range is not the error screen, and the download snackbar fires from the ready screen.

## 5. Card transaction detail

- [x] 5.1 Map kind to status in `src/features/transactions/lib/transactionDetailContent.ts` (pending, declined plus `declineReason`, hold released, refunded, completed with no sentence). Extend `src/features/transactions/data/mockTransactions.ts` with the optional reason, descriptor, and location fields. Update `src/features/transactions/lib/transactionDetailContent.test.ts`. Verify a declined row is not Completed and a reversal reads Hold released.
- [x] 5.2 In `src/features/transactions/lib/transactionDetailContent.ts` and `src/features/transactions/components/TransactionDetailSections.tsx`, show Location unavailable when location is missing, omit the location row when the merchant is online, add "Also appears as:" for a differing descriptor, and use Unknown merchant when the card merchant name is empty. Verify the Lyon fallback string is gone.

## 6. Integration

- [ ] 6.1 Run `npm test`, `npm run build`, and `npm run lint`. Verify all three pass.
