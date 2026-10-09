# Tasks

## 1. Search pagination end toast

- [x] 1.1 In `src/features/transactions/components/TransactionsScreen.tsx`, allow the end-of-list snackbar when `search.status === "results"` and there are no more pages; reset `endNoticeSent` when `debouncedQuery` changes. Verify scrolling through a filtered result set past the last page shows "You have reached the end of your activity list", and changing the query does not immediately re-fire the toast.

## 2. Empty and error visuals

- [x] 2.1 Export Figma Long Document empty art from Flow / Search no-match (`8845:53239`) into `src/features/transactions/assets/` (or replace the receipt usage), wire it in `src/features/transactions/components/TransactionsScreen.tsx` at Figma display scale, and keep spilled-mug for error. Verify empty shows both copy lines with the new illustration sized closer to ~200×148, not the 80×80 receipt crop.
- [x] 2.2 In `src/features/transactions/components/TransactionsScreen.tsx`, adjust empty/error block layout (padding / flex) so keyboard-up and keyboard-dismissed Figma frames both fit without clipping Try again. Verify error still shows "Search didn't work", "Try again in a moment", and retry re-runs search.

## 3. Clear on leave

- [x] 3.1 Confirm `src/features/transactions/components/TransactionsGate.tsx` remounts `TransactionsScreen` on each push (`deferContentMount`). If query can persist across visits, add an explicit reset (stable nav key or Gate remount). Verify leave Activity → open Activity again shows an empty search field and the unfiltered list.

## 4. Match rules regression

- [x] 4.1 Re-run / extend `src/features/transactions/lib/searchTransactions.test.ts` for Figma match scenarios (3-char threshold via `applyActivitySearch`, Élodie / elodie, amount formats, declined eligibility). Only change `src/features/transactions/lib/searchTransactions.ts` if a test fails. Verify `npm test` covers those cases and `applyActivitySearch` empty/error branches remain green.

## 5. Integration

- [x] 5.1 Run `npm test`, `npm run build`, and `npm run lint`. Verify all three pass.
