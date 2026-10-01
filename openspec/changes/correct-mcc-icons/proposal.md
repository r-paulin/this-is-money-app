# Proposal

## Why

Activity and transaction detail paint the wrong category mark. Transfers and payouts became a full-size arrow, and declined rows dropped the merchant glyph for an error icon. Figma `_ MCC` (`138:7229`) keeps the category circle for every code, including declined, and puts inflow or outflow in a small corner badge (`8808:69253`). The amount on a list row also sits off the merchant name instead of sharing its top edge.

## What Changes

- Restore the MCC set: each mapped code keeps its 40px category circle and glyph. Declined and failed keep that same glyph on a neutral circle, with the declined corner badge.
- Keep the corner inflow and outflow badges already used on a reversal such as Hertz. Do not resize or redraw them.
- A ride payout always matches Figma `8808:71498`: the green Bolt circle plus that same small inflow badge. It is never a full-size arrow.
- Transaction detail uses the same marks. The only difference is a declined or failed circle on detail: white (`bg-layer-floor-1`), not the grey list circle.
- Align the list amount with the top of the merchant name.
- Strikethrough amounts use the tertiary content color. That covers a reversal, a failed payment, and a declined payment. A missing amount stays on the secondary content color.

## Capabilities

### New Capabilities

- `mcc-icon`: Category circle, declined treatment on the list and on detail, and the inflow/outflow corner badge.
- `activity-row`: Amount shares the merchant name's top alignment on an activity row.

### Modified Capabilities

- None. Main specs are empty. This replaces the icon rules in the unarchived change `align-activity-with-figma` (the activity-list requirement that makes the arrow the whole mark and swaps a declined glyph for an error icon).

## Impact

- `TransactionCategoryIcon`, `mccThemes.ts` (`resolveCategoryMark`), `specs/components/mcc-icon.md`, and the existing badge assets.
- `TransactionDetailSummary` passes a detail surface so declined circles are white.
- `TransactionRow` amount slot. Home preview rows use the same icon and row, so they follow the list treatment.
- No new dependency. No change to search, statement, status sentences, or the navbar.

## Non-goals

- New MCC codes, including inventing codes for cashback.
- Rewriting transfer or payout detail layouts, card status copy, or the debit leading minus.
- A second back control on Activity.
