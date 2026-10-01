# Design

## Context

See proposal.md for why. `resolveCategoryMark` currently returns `arrow-in`, `arrow-out`, or `error` before the theme circle, and `TransactionCategoryIcon` draws those as the whole 40px mark. `badgeForKind` already knows inflow, outflow, and declined, but the arrow and error marks never render the badge. The reversal row (Hertz) already shows the correct inflow badge: category circle plus the small corner mark. Figma ride payout `8808:71498` is that same badge on the green Bolt circle. Do not resize or reflip the badge. Detail and the list share `TransactionCategoryIcon`. `ListItemLayout` centers its row (`items-center`) and its end slot (`h-full items-center`). The amount wrapper in `TransactionRow` adds `self-start`, so the amount sticks to the top of that full-height slot while the merchant name stays centered in the label column.

## Goals / Non-Goals

**Goals:**

- One icon component for the list, Home preview, and detail.
- Restore the theme circle plus the existing corner badge.
- Line the amount up with the merchant name without forking Kalep.

**Non-Goals:**

- Changing the inflow or outflow badge that a reversal already shows.
- Editing `ListItemLayout` inside `node_modules`.

## Decisions

### 1. Theme circle, then a badge

Delete the arrow and error branches from `resolveCategoryMark`. The mark is always the theme from `resolveThemeForTransaction`, plus `badgeForKind`.

- Ride payout stays on the Bolt theme. Transfer in, transfer out, and ATM stay on the money theme.
- Failed with MCC 0 uses other, not a decline glyph that replaces the category.
- Declined and failed keep that glyph. The circle is `bg-neutral-secondary` on the list and Home. On detail it is `bg-layer-floor-1`. The declined badge still shows.
- Inflow and outflow keep the badge rendering already used for a reversal. Ride payout uses the Bolt glyph inside the green circle and that same inflow badge. Do not replace the circle with `ArrowRightUp`.

`TransactionDetailSummary` passes a surface so only detail uses the white declined circle. List and Home omit it.

Alternative: a second icon component for detail. Rejected because the only difference is the declined fill.

### 2. Amount top matches the name

Keep `ListItemLayout`. The amount's `self-start` wrapper is what pins it to the row top. In `TransactionRow.tsx`, top-align the label column and the amount together so their tops match. A local class on the row may set the inner flex to `flex-start`. Do not patch Kalep. Verify on a two-line row (name and time) that the amount is level with the name.

Alternative: vertically center the amount on the two-line block. Rejected because `8808:69253` puts the amount on the merchant line.

### 3. Primary color for reverted and failed sums

`formatSignedTransactionAmount` marks reversal, failed, and declined with tone `declined`. `TransactionRow` applies `line-through` for that tone and maps it to Typography `color="tertiary"` (`content/tertiary`). A missing amount stays `color="secondary"` and is not struck through. The detail summary has no strikethrough, so it stays on secondary for that tone.

## Risks / Trade-offs

- [The unarchived change `align-activity-with-figma` still says the arrow is the whole mark] → This change is the later rule. Apply updates the icon code and `specs/components/mcc-icon.md`. Do not revive the arrow-as-mark behavior.
- [Home preview uses the same icon] → Home declined rows become neutral circles too. That matches the list.

## Migration Plan

No stored data. Rollback is reverting the change.

## Open Questions

None.
