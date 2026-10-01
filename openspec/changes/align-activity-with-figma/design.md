# Design

## Context

See proposal.md for why. Activity is `TransactionsGate` → `TransactionsScreen`, pushed from Home with key `transactions`. There is no visible back row in that screen; back is the navigation-stack edge swipe. Category marks live in `TransactionCategoryIcon` and `mccThemes.ts`. Card detail status is chosen in `buildCardPaymentView`, which currently treats every non-pending kind as Completed. Search is a substring filter in `searchTransactions`. Statement steps live in `GetStatementGate`.

## Goals / Non-Goals

**Goals:**

- Meet the four new specs without a new dependency or a live API.
- Keep one icon function for list rows and the card-detail summary.

**Non-Goals:**

- A second back row on Activity. The app already has one navbar back.
- Inventing MCC numbers for Cashback. Figma labels the theme and does not list codes on that row.

## Decisions

### 1. Scrolling title, global back

Activity does not add its own back row. The navbar already stays fixed and calls `pop()`. Title, search, statement action, and the list sit in the nav layer, so a scroll hides the title and search without animating height. The edge swipe stays.

### 2. Page the mock feed

`buildMockTransactions` stays the source. The screen requests pages of 20, newest first. The first visit keeps the existing skeleton gate. The next page appends three skeleton rows, then the page. When the last page is shown, render the end snackbar and extra space under the last row. No new module: a cursor over the already-sorted array.

### 3. Icon hierarchy in the existing resolver

`resolveThemeForTransaction` gains an explicit mark kind: `arrow-in`, `arrow-out`, `error`, or a theme circle.

- `transfer_in` and `ride_payout` → incoming arrow as the 40px mark. No Bolt or cash circle, no corner badge.
- `transfer_out` and `atm` → outgoing arrow as the 40px mark.
- `declined` and `failed` → error icon, including when an MCC is present. Drop the medical codes currently stored on the decline theme.
- Mapped MCC → that theme. Unmapped → other.
- Remove the money MCC list copied onto `bolt`. Payouts no longer select Bolt by those codes.
- Add `cashback` with an empty MCC list, selected only by `themeOverride`.
- Give entertainment and other their own `bg-mcc-*` tokens. Take the hex from the Figma symbols at apply time and put it in `tokens.css`. Do not reuse `bg-mcc-food` or `bg-mcc-utilities`.

The 16px inflow/outflow badge assets stop being the way a transfer shows direction. They can remain for a card refund or reversal that still uses a category circle, at the 20px viewBox size of the asset so the arrow is not scaled down and flipped.

### 4. Time-only list timestamps

`formatTransactionTimestamp` becomes clock-only for the list. Detail keeps `formatTransactionDetailDate`. Day headers stay as they are.

### 5. Search is still local

`searchTransactions` returns the filtered page source. The screen ignores queries shorter than 3 characters. Matching:

- name: any whitespace-separated word starts with the query, case- and diacritic-insensitive
- amount: strip currency symbols and spaces; compare the numeric value; ignore a sign on the stored amount unless the query includes one
- reference, type label, and transfer ID from fields already on `Transaction` (add `reference` and `transferId` where the mock does not have them yet)

Debounce stays. While a query of 3+ characters is settling, show the search skeleton. Empty results use the existing document illustration if one is already in the repo; otherwise the statement document asset. Failed search is a render branch when the filter throws. The mock filter does not throw; a unit test covers the branch. Leaving the screen unmounts it, which clears the query.

### 6. Statement outcomes from the selected range

Before creation, if custom end − start is more than one year, show an inline message and do not advance the gate. Otherwise a local check against the mock feed returns `ready`, `empty`, or `error`. Empty is a real result when the range contains no mock rows, with both formats still offered and different copy. Error is the thrown-failure branch, tested, not the default button path. Creation copy swaps to the longer message after 3s, before the existing hold ends. Download uses the snackbar already imported on the ready screen.

### 7. Card status from kind

`buildCardPaymentView` maps kind:

| Kind | Status |
|---|---|
| `authorization`, or `purchase` with `paymentStatus: "pending"` | Pending, with the release date from `statusSubtext` or a date derived from `occurredAt` |
| `declined`, `failed` | Declined, plus one sentence from `declineReason` when set |
| `reversal` | Hold released |
| `refund` | Refunded |
| other card purchase | Completed, no sentence |

Add optional `declineReason`, `merchantDescriptor`, and `merchantLocation` on the mock transaction. Stop substituting the Lyon address. Missing location copy is "Location unavailable". Omit the location row when `merchantLocation` is explicitly absent for an online merchant (`locationOmitted: true`). Empty merchant name on a card row becomes "Unknown merchant" in the detail; the list fallback "Card payment" stays for the list.

## Risks / Trade-offs

- [Mock search never fails in the running app] → The error illustration is covered by a test that passes a thrown filter, so the branch cannot rot.
- [Cashback has no MCC list] → The theme exists for an override and will not steal other codes.
- [Paging a small mock feed reaches the end quickly] → Page size 20 still leaves a second page in the current fixture, which is enough to show skeletons and the snackbar.
- [Arrow marks replace the Bolt logo on payouts] → That is the spec. Home preview rows use the same icon component, so they change too.

## Migration Plan

No stored data and no deploy step. Rollback is reverting the change.

## Open Questions

None that change the specs or the task split. Entertainment, other, and cashback fills are read from Figma during apply.
