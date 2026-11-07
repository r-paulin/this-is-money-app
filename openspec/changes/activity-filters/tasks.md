# Tasks

## 1. Filter rules

- [x] 1.1 Add `src/features/transactions/lib/activityFilters.ts` with the applied selection, quiet activity types for Money in and Money out, dropping a type the new direction disables, inclusive date bounds (Sunday week, this month through today, previous calendar month), custom-range slide, reversed-range refusal, row matching, and the summary total. Verify `src/features/transactions/lib/activityFilters.test.ts` covers each of these and `npm test` passes that file.
- [x] 1.2 In `activityFilters.test.ts`, add the QA cases for rows that move no money: declined and failed card payments match Card payments only when money flow is All; reversals match neither directed flow; a pending hold matches Money out; a pending refund matches Money in and is excluded from the total; a missing amount does not change the total. Verify those cases fail before the rules exist and pass after.
- [x] 1.3 In `activityFilters.test.ts`, add chip-label, badge-count, and search-composition cases: preset name versus "20 Oct - 22 Oct, 2026", badge ignores All, and `applyActivitySearch` from `src/features/transactions/lib/searchTransactions.ts` receives only the filtered rows. Verify a card-payment merchant is absent when Payouts is applied and the query names that merchant.

## 2. Kinds the filters need

- [x] 2.1 Extend `TransactionKind` in `src/features/transactions/data/mccThemes.ts` with `cashback` and `fee`, and update `badgeForKind` so cashback is inbound and fee is outbound. Update the exhaustive `TYPE_LABEL` and `amountSign` in `src/features/transactions/lib/searchTransactions.ts`, and the credit branch in `src/features/transactions/lib/formatTransactionAmount.ts`, so a cashback row displays as a credit and a fee as a debit. Verify `npm test` still passes `src/features/transactions/lib/searchTransactions.test.ts` and `src/features/transactions/lib/formatTransactionAmount.test.ts`.
- [x] 2.2 Add one cashback row and one fee row in `src/features/transactions/data/mockTransactions.ts`. Verify a case in `activityFilters.test.ts` classifies that cashback row as Money in and that fee row as Money out.

## 3. Toolbar

- [x] 3.1 Add optional `toolbarEnd` on `ScreenEntry` in `src/shared/navigation/navigation.types.ts`, and render it on the trailing side of that layer in `src/shared/components/AppNavbar.tsx` and `src/shared/components/app-navbar.css`. Verify a layer without `toolbarEnd` shows no trailing control.
- [x] 3.2 Add `src/features/transactions/components/GetStatementToolbarButton.tsx` and pass it as `toolbarEnd` from `openTransactions` in `src/pages/HomePage.tsx`. Remove the download button from the search row in `src/features/transactions/components/TransactionsScreen.tsx`. Verify the statement control opens `GetStatementGate` and is absent on a Filters entry that does not set `toolbarEnd`.

## 4. Filters screen

- [x] 4.1 Add `src/features/transactions/components/ActivityFiltersScreen.tsx` with the three chip groups, the Sunday-first month calendar, pinned Apply and Clear, and the quiet-chip treatment from `activityFilters.ts`. Verify Money in leaves Card payments, Fees, and Reversals untappable with no error message, and Money out does the same for Payouts, Refunds, Cashback, and Reversals.
- [x] 4.2 In `ActivityFiltersScreen.tsx`, keep Apply enabled and refuse to pop when a custom date is missing or the end is before the start, showing "End date must be on or after the start date". Clear resets the draft and stays on the screen. Back discards the draft. Verify reopening the screen shows the last applied selection, using the draft rules already covered in `activityFilters.test.ts`.

## 5. Activity list

- [x] 5.1 In `src/features/transactions/components/TransactionsLoadingScreen.tsx`, skeleton the title, search, filter circle, day header, and three rows, and leave Back and the statement control real. In `src/features/transactions/components/TransactionsScreen.tsx`, put the filter control beside Search, show the badge, wrap the removable chips, and show the result count and signed total. Verify the first-open skeletons are not tappable and a date plus two types shows badge 3.
- [x] 5.2 In `TransactionsScreen.tsx`, apply filters before search, skeleton the list under the chips while a filtered page loads, and use `src/features/transactions/components/ActivitySearchStatus.tsx` for "No matching activity" and for "Couldn't load activity" with retry. Keep the existing search empty copy when a query misses a non-empty filtered set. Verify removing one chip updates the badge and the list, and retry reloads the same filters.
- [x] 5.3 In `TransactionsScreen.tsx`, pin the current day header under the toolbar, keep Back and the statement control fixed, and page plus end-snackbar the filtered set. Verify a short filtered list does not show "You have reached the end of your activity list" until the driver scrolls to the bottom.

## 6. Integration

- [x] 6.1 Run `npm test`, `npm run lint`, and `npm run build`. Verify they pass.
- [x] 6.2 Walk the scenarios in `openspec/changes/activity-filters/specs/activity-filters/spec.md` that are not asserted in `activityFilters.test.ts` (toolbar, skeleton, pinned header, empty and failure copy, chip removal on screen). Verify each one against the running Activity screen.
