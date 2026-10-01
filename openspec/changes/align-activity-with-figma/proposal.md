# Proposal

## Why

The Activity screen still behaves like an earlier Transactions list. Figma now specifies the list, search, statement, and card-detail states drivers actually hit, and the category icons on those rows do not match the merchant-category set. Drivers cannot tell a payout from a card payment at a glance, and a declined or pending card payment opens as if it had completed.

## What Changes

- Rename the screen title to Activity and match the list states in Figma `6875:56422`: day groups, time-only row timestamps, header collapse on scroll, paged loading skeletons, and an end-of-list snackbar.
- Fix category icons against Figma `8808:69988`: distinct theme colors, a Cashback theme, error icon in place of the MCC glyph for failed and declined rows, and a full-size directional arrow for transfers and payouts instead of a 16px corner badge.
- Match search in Figma `8824:30792`: three-character minimum, word-start name match, amount, reference, type, and transfer ID, plus illustrated empty and failed states.
- Add the missing Get statement states from Figma `8849:10959`: range longer than one year, empty period that still produces a file, generation error, longer-creation copy, and the downloaded snackbar.
- Drive card-transaction detail from the transaction kind (Figma `8855:29989` and `8859:9978`): completed, pending hold, declined with a plain reason, reversal as hold released, and refund. Stop opening those rows as Completed.

## Capabilities

### New Capabilities

- `activity-list`: Activity title, day-grouped list, timestamps, scroll collapse, pagination, end snackbar, and category icons on rows.
- `activity-search`: What the Activity search matches, and the loading, empty, and failed states.
- `statement`: Get statement presets plus range-too-long, empty period, generation error, longer creation, and downloaded confirmation.
- `card-transaction-detail`: Card payment detail summary and status copy for completed, pending, declined, reversal, and refund.

### Modified Capabilities

- None. The specs inventory is empty.

## Impact

- `src/features/transactions/` list, search, statement gate, detail content, category icon, and mock feed.
- `src/shared/styles/tokens.css` only if a missing MCC color has no token yet.
- `specs/components/mcc-icon.md` so the icon spec matches the corrected hierarchy.
- No new dependencies. Mock data stays local; paging is simulated on that feed.

## Non-goals

- The structure-board heading “Did you make this payment?”. The detail flow frames are a settled record (amount, card, merchant, status, Get help), and that is the layout this change follows.
- A live transactions or statement API. States are driven by the existing mock feed.
- Chargeback and chargeback-reversal screens. Figma describes them, and this app has no kind for them yet.
- Transfer and payout detail layouts beyond the shared category icon. Those screens already have their own sections.
- Changing debit amounts from a leading minus to an unsigned primary amount. The written amount rule only requires primary color for outflows.
