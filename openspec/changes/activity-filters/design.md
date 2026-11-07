# Design

## Context

Activity already lists, pages, and searches a local mock feed. Get statement is a download button in the search row. `AppNavbar` renders Back only, once per stack layer. Search is `applyActivitySearch` over the full feed. Amount direction already exists in `formatSignedTransactionAmount`: payouts, refunds, and inbound transfers credit; purchases and the remaining debit kinds debit; declined, failed, and reversal amounts do not.

See proposal.md for why. Behavior is fixed in `specs/activity-filters/spec.md`. This file is how to get there without a new dependency.

## Goals / Non-Goals

**Goals:**

- One pure filter step in front of the existing search, so the QA scenarios can run without the screen.
- The statement control lives on the Activity stack entry, so Filters does not inherit it.
- Disabled activity types follow balance direction, including types the Money in frame left looking active.

**Non-Goals:**

- A shared date-picker component for Get statement. Statement keeps its native picker.
- Persisting the draft anywhere but component state.

## Decisions

### Toolbar action is per stack entry

Add an optional `toolbarEnd` render on `ScreenEntry`. `AppNavbar` renders it on the trailing side of that layer only. Home pushes Activity with a small statement button that itself calls `push` for the existing Get statement gate. The Filters entry omits `toolbarEnd`.

Alternative: a global trailing slot like `setNavbarBackHandler`. Rejected. Activity stays mounted under Filters, so a global slot would keep the download icon on the Filters toolbar.

### Filter, then search

```
feed
  -> date + money flow + activity types
  -> existing search (idle until 3 characters)
  -> page the result
```

`applyActivitySearch` already returns the input unchanged when the query is short. Pass it the filtered rows. Do not teach search about filters.

Chip labels, the badge count, disabled types, and the summary total are pure functions of the applied selection plus the matched rows. The screen only renders them.

### Balance effect decides both the quiet chips and the rows

| Activity type | Adds to balance | Takes from balance | Quiet on Money in | Quiet on Money out |
|---|---|---|---|---|
| Payouts | yes | no | | yes |
| Transfers | inbound | outbound | | |
| Card payments | no | charged, ATM, pending hold | yes | |
| Refunds | cleared refund | no | | yes |
| Reversals | no | no | yes | yes |
| Cashback | yes | no | | yes |
| Fees | no | yes | yes | |

The Money in frame paints Reversals in the active color. The balance rule wins: a returned hold does not add to the balance, so Reversals is quiet for both directed flows. QA covers that on purpose.

Map today's kinds as follows. `purchase`, `authorization`, and `atm` are Card payments. `authorization` takes from available balance. `atm` is the withdrawal only; its `serviceFeeCents` is not a second row. `declined` and the existing `failed` rows are Card payments that move no money. `reversal` moves no money. A refund with `paymentStatus: "pending"` stays a Refund in the Money in list and is left out of the total.

Add two mock rows, nothing more: one `cashback` kind (or the existing cashback theme override treated as Cashback) and one `fee` kind. Without them those chips can never match.

### Dates

Reuse the month helpers in `statementRanges.ts`. This week is Sunday through the end of today, because the filter calendar's first column is Sunday. Custom start and end are inclusive local days.

Sliding the range: inclusive length is `endDay - startDay + 1`. After a new start, `end = start + length - 1`. Do this only when the driver edits the start while an end is already set. Editing the end to a day before the start sets the error and does not slide.

Apply with a missing date or a reversed range returns without popping. The button stays the primary button; the guard is in the handler. That matches the frames, where Apply stays green.

### Draft versus applied

Filters holds a draft copy. Clear resets the draft. Back drops it. Apply copies it onto Activity and pops. Reopening Filters copies the applied selection back into the draft. The badge is derived from the applied selection only.

### List states

Filtered loading reuses the list skeleton already under search, placed under the chips. The filter-empty copy and illustration are the statement empty art and the two lines in the spec. The failure state reuses the spilled-mug search error and adds the retry control search already has. The failure frame has no button; the sentence "Try again" needs one, and search already established that control.

Applied chips wrap. The no-results frame crops a third chip at the screen edge; wrapping keeps every remove control visible.

Day headers use `position: sticky` under the toolbar. Do not animate height. The end snackbar and page size stay as they are; they page the filtered result instead of the whole feed.

### What the tests lock

`src/features/transactions/lib/activityFilters.test.ts` is the automated QA pass for the logic scenarios: quiet types for each money flow, dropping an incompatible selection, Sunday week, January last-month, inclusive custom bounds, range slide, reversed range refused, row inclusion, pending hold, pending refund excluded from the total, declined and reversal excluded from directed flows, chip labels, badge count, and search receiving only the filtered rows.

Chrome, copy, skeleton, and pinned headers stay manual checks against the spec scenarios. There is no browser harness in this repo.

## Risks / Trade-offs

- [Reversals look selectable in the Money in frame] → Spec and tests disable them. Do not "fix" the tests to match that frame.
- [Quiet chips are easy to implement as hidden chips] → They stay visible and untappable, which is what the disabled frame shows.
- [Pending refund in the list and out of the total looks inconsistent] → The row is the status; the total is money that has moved. The scenario states both.
- [A simulated filter failure has no network] → Same pattern as search: the filter function can throw, and the screen shows the failure state. One test feeds that throw.
- [Sticky day headers can sit under the navbar] → Offset the sticky top by the toolbar height token already used for the nav body.

## Migration Plan

No data migration. The feed is mock data in memory. Reverting the change restores the download button in the search row and removes Filters. Applied filters disappear when the driver leaves Activity, because the screen unmounts with the stack entry.
