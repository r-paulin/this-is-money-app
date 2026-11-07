# Spec Delta

## Purpose

Let a driver narrow Activity by period, money direction, and activity type, and search only inside that set. Types that cannot move the balance in the chosen direction are unavailable, and the list states match the Activity and Filters frames.

## ADDED Requirements

### Requirement: Statement action stays in the toolbar

The Get statement control MUST sit in the Activity toolbar on the trailing side of Back. It MUST stay fixed while the driver scrolls. Activating it MUST open the existing Get statement flow. The search row MUST NOT contain the statement control.

#### Scenario: Statement from the toolbar

- **WHEN** the driver opens Activity and activates the toolbar statement control
- **THEN** Get statement opens and the search row shows Search and the filter control only

#### Scenario: Statement stays while scrolling

- **WHEN** the driver scrolls the Activity list
- **THEN** Back and the statement control remain visible

### Requirement: Filter control and count badge

The control beside Search MUST open Filters. With no applied filters it MUST show no count. After filters are applied, it MUST show a count equal to the number of applied chips: one for a date other than All, one for a money flow other than All, and one for each selected activity type. All MUST NOT add to the count.

#### Scenario: No filters

- **WHEN** the driver opens Activity before applying filters
- **THEN** the filter control has no count badge

#### Scenario: Date and two types

- **WHEN** the driver applies a custom date, Payouts, and Transfers
- **THEN** the filter control shows 3

#### Scenario: Date only

- **WHEN** the driver applies only a custom date
- **THEN** the filter control shows 1

### Requirement: First open uses the filter skeleton

The first open MUST show a real Back control and a real statement control. The title, the search field, the filter control, a day header, and three rows MUST be skeletons and MUST NOT be tappable. The skeleton filter control MUST occupy the circle beside search.

#### Scenario: First open

- **WHEN** Activity is opened and the first page has not arrived
- **THEN** the title, search, filter circle, day header, and three rows are skeletons and cannot be opened

### Requirement: Scroll chrome

Once the driver scrolls, the title, search, filter control, and applied chips MUST leave the view. Back and the statement control MUST stay fixed. The day header of the group under the toolbar MUST stay pinned until the next day header replaces it. The list MUST NOT jump when the header collapses.

#### Scenario: Scrolled list

- **WHEN** the driver scrolls past the first screen of Activity
- **THEN** the title, search, and filter control are no longer visible, and Back and the statement control remain

#### Scenario: Pinned day header

- **WHEN** the driver scrolls through a day group
- **THEN** that day's header stays pinned under the toolbar until the next day's header reaches it

### Requirement: Filters opens as its own screen

Filters MUST be a pushed screen titled Filters, with Back returning to Activity. It MUST show three groups: Date (All, This week, This month, Last month, Custom), Money flow (All, Money in, Money out), and Activity type (All, Payouts, Transfers, Card payments, Refunds, Reversals, Cashback, Fees). Apply filters and Clear filters MUST stay pinned at the bottom. The first visit MUST show All selected in every group.

#### Scenario: Open with nothing applied

- **WHEN** the driver opens Filters before anything is applied
- **THEN** Date, Money flow, and Activity type each have All selected, and both buttons are visible

#### Scenario: Back from Filters

- **WHEN** the driver activates Back on Filters
- **THEN** Activity is shown again

### Requirement: How a selection is chosen

Date MUST allow one option. Money flow MUST allow one option. Activity type MUST allow All, or one or more specific types. Choosing a specific type MUST clear All. Choosing All MUST clear every specific type. Money in and Money out MUST show their direction marks.

#### Scenario: Several activity types

- **WHEN** the driver selects Payouts and then Transfers
- **THEN** both stay selected and All is not selected

#### Scenario: All clears types

- **WHEN** specific activity types are selected and the driver selects All
- **THEN** only All is selected

### Requirement: Money flow disables types that cannot move the balance that way

A type MUST be enabled for Money in only when that type can add to the driver's balance. A type MUST be enabled for Money out only when that type can take from the driver's balance. A disabled type MUST use the quiet label treatment and MUST NOT be selectable.

Money in MUST enable Payouts, Transfers, Refunds, and Cashback. Money in MUST disable Card payments, Fees, and Reversals, because those types cannot add to the balance.

Money out MUST enable Transfers, Card payments, and Fees. Money out MUST disable Payouts, Refunds, Cashback, and Reversals, because those types cannot take from the balance.

All MUST enable every activity type. The screen MUST NOT show an error dialog or inline error for a disabled type.

#### Scenario: Money in quiets card payments and fees

- **WHEN** the driver selects Money in
- **THEN** Card payments, Fees, and Reversals are quiet and cannot be selected, and Payouts, Transfers, Refunds, and Cashback can be selected

#### Scenario: Money out quiets credits

- **WHEN** the driver selects Money out
- **THEN** Payouts, Refunds, Cashback, and Reversals are quiet and cannot be selected, and Transfers, Card payments, and Fees can be selected

#### Scenario: All restores every type

- **WHEN** Money in is selected and the driver then selects All for money flow
- **THEN** every activity type can be selected again

#### Scenario: Pressing a quiet type

- **WHEN** Card payments is quiet under Money in and the driver presses it
- **THEN** the selection does not change and no error message is shown

### Requirement: An incompatible type is dropped from the draft

When the driver changes money flow, every selected activity type that is now disabled MUST leave the selection. When no specific type remains, Activity type MUST return to All. This MUST happen in the draft before Apply.

#### Scenario: Money in drops a selected card payment

- **WHEN** Card payments is selected and the driver then selects Money in
- **THEN** Card payments is no longer selected and Activity type shows All

#### Scenario: A still-valid type remains

- **WHEN** Payouts and Card payments are selected and the driver then selects Money in
- **THEN** Payouts stays selected and Card payments does not

### Requirement: Custom dates

Choosing Custom MUST show Start date and End date, and an inline month calendar that starts the week on Sunday. Pressing a field MUST choose whether the next day sets the start or the end. Month arrows MUST move the visible month. A range of a single day MUST be allowed. Dates MUST be inclusive calendar days in the driver's local timezone.

This week MUST run from Sunday of the current week through the end of today. This month MUST run from the first of the current month through the end of today. Last month MUST be the entire previous calendar month, including when today is in January.

#### Scenario: Empty custom fields

- **WHEN** the driver selects Custom and has not chosen both dates
- **THEN** Start date and End date are empty and the calendar can set them

#### Scenario: This week on a Sunday

- **WHEN** today is a Sunday and the driver applies This week
- **THEN** only transactions from that Sunday are included

#### Scenario: Last month across the new year

- **WHEN** today is in January and the driver applies Last month
- **THEN** only transactions from the previous December are included

### Requirement: A custom range that cannot be applied

Apply filters MUST stay enabled. When either custom date is missing, Apply MUST NOT change Activity and MUST leave the driver on Filters. When the end date is before the start date, Filters MUST show "End date must be on or after the start date" on the end field, and Apply MUST NOT change Activity.

Changing the end date to the start date or a later day MUST clear that error. When the driver changes the start date after an end date is already set, the end date MUST move so the inclusive length of the range stays the same, and the error MUST NOT be shown.

#### Scenario: Apply with an empty end date

- **WHEN** Custom is selected, only the start date is set, and the driver presses Apply filters
- **THEN** Filters stays open and the previously applied Activity filters are unchanged

#### Scenario: End before start

- **WHEN** the start date is 20 Oct 2026 and the driver sets the end date to 19 Oct 2026
- **THEN** the end field shows "End date must be on or after the start date"

#### Scenario: Apply while the range is reversed

- **WHEN** the reversed-range error is showing and the driver presses Apply filters
- **THEN** Filters stays open and Activity is unchanged

#### Scenario: Editing the start slides the range

- **WHEN** the range is 20 Oct 2026 through 22 Oct 2026 and the driver changes the start to 25 Oct 2026
- **THEN** the end date becomes 27 Oct 2026 and no range error is shown

#### Scenario: Fixing the end date

- **WHEN** the reversed-range error is showing and the driver sets the end date to the start date
- **THEN** the error is gone and Apply filters can commit the range

### Requirement: Apply, Clear, and leaving Filters

Apply filters MUST commit the draft, close Filters, and show the filtered Activity. Clear filters MUST set every group back to All and MUST stay on Filters. Clear MUST NOT change the list until Apply. Back MUST discard the draft and keep the last applied filters. Opening Filters again MUST show the applied selection, not a discarded draft.

Applying All in every group MUST remove the badge, the chips, and the summary, and MUST show the full list.

#### Scenario: Apply commits

- **WHEN** the driver selects This month and Payouts and presses Apply filters
- **THEN** Activity shows that date and Payouts, and Filters is closed

#### Scenario: Clear does not commit

- **WHEN** filters are already applied, the driver opens Filters, presses Clear filters, and then presses Back
- **THEN** Activity still shows the filters that were applied before that visit

#### Scenario: Clear then Apply

- **WHEN** the driver presses Clear filters and then Apply filters
- **THEN** Activity shows the full list with no badge, chips, or summary

#### Scenario: Reopen shows the applied draft

- **WHEN** This month and Money in are applied and the driver opens Filters again
- **THEN** This month and Money in are selected

### Requirement: Applied chips and summary

Applied filters other than All MUST appear as removable chips under the search row. A date preset MUST use its name. A custom range MUST use the form "20 Oct - 22 Oct, 2026". Money flow MUST use "Money in" or "Money out". An activity type MUST use its name. Every chip MUST be fully visible.

The summary MUST show "{n} results", or "1 result" when there is one. The total MUST be the net of rows that changed the balance, credits as positive and debits as negative. A positive net MUST use the incoming mark and a leading plus. A negative net MUST use the outgoing mark and a leading minus. A zero net MUST show €0.00 and no direction mark. Rows that did not move money MUST be excluded from the total.

#### Scenario: Custom range and payouts

- **WHEN** the driver applies 20 Oct 2026 through 22 Oct 2026 and Payouts, and those rows total 1200.00 euros in
- **THEN** the chips read "20 Oct - 22 Oct, 2026" and "Payouts", and the summary shows the result count and +€1200.00 with the incoming mark

#### Scenario: One result

- **WHEN** the applied filters match one row
- **THEN** the summary reads "1 result"

#### Scenario: Net money out

- **WHEN** the matched rows that moved money net to 30.00 euros out
- **THEN** the summary uses the outgoing mark and -€30.00

### Requirement: Which rows match

Groups combine with AND. Activity types combine with OR. Date bounds are inclusive.

Money in MUST include only rows that add to the balance: payouts, inbound transfers, cleared refunds, and cashback. Money out MUST include only rows that take from the balance: card payments that were charged or are a pending hold, ATM withdrawals, outbound transfers, and fees.

A pending hold MUST be included in Money out, because available balance has already been reduced. A pending refund MUST be included in Refunds when Money in is selected, and MUST be excluded from the total until it has cleared.

Transfers MUST stay available for both directions. Money in MUST include only inbound transfers. Money out MUST include only outbound transfers.

#### Scenario: Money in keeps credits

- **WHEN** the driver applies Money in and Payouts
- **THEN** payout rows are included and card payments, fees, and reversals are not

#### Scenario: Money out keeps a pending hold

- **WHEN** the driver applies Money out and Card payments
- **THEN** a pending card hold is included and a payout is not

#### Scenario: Inbound transfer only

- **WHEN** the driver applies Money in and Transfers
- **THEN** inbound transfers are included and outbound transfers are not

#### Scenario: Pending refund is listed and not totaled

- **WHEN** the driver applies Money in and Refunds, and the only match is a refund that is not yet cleared
- **THEN** that refund is in the list and the summary total is €0.00

#### Scenario: Two types are a union

- **WHEN** the driver applies Payouts and Transfers with money flow All
- **THEN** both payouts and transfers are included and a card payment is not

#### Scenario: Date bounds are inclusive

- **WHEN** the driver applies a custom range of 20 Oct 2026 through 22 Oct 2026
- **THEN** a transaction at the start of 20 Oct and a transaction at the end of 22 Oct are included, and a transaction on 23 Oct is not

### Requirement: Rows that move no money

A declined row, a failed row, a returned or expired hold, and a row with no amount MUST NOT match Money in or Money out, and MUST NOT change the total. With money flow All, a declined or failed card payment MUST still match Card payments, and a reversal MUST still match Reversals.

#### Scenario: Declined card payment under Money out

- **WHEN** the driver applies Money out and Card payments
- **THEN** a declined card payment is absent

#### Scenario: Declined card payment under All

- **WHEN** money flow is All and the driver applies Card payments
- **THEN** a declined card payment is included and the total ignores its amount

#### Scenario: Reversal under Money in

- **WHEN** the driver applies Money in
- **THEN** a returned hold is absent, including when Activity type is All

#### Scenario: Missing amount

- **WHEN** a matched row has no amount
- **THEN** the row can appear in the list and the total ignores it

### Requirement: Removing a chip

Pressing a chip MUST remove that one filter and refresh the list. Removing the date chip MUST set Date to All. Removing the money-flow chip MUST set Money flow to All and MUST make every activity type available again on the next visit to Filters. Removing the last activity-type chip MUST set Activity type to All. The badge and summary MUST update to the remaining filters.

#### Scenario: Remove one type

- **WHEN** Payouts and Transfers are applied and the driver removes Payouts
- **THEN** only Transfers remains applied and the badge count drops by one

#### Scenario: Remove money flow

- **WHEN** Money in is applied and the driver removes that chip
- **THEN** the list is no longer limited by direction and the next Filters visit shows every activity type as available

### Requirement: Search runs inside the filtered set

Search MUST apply the existing Activity search rules to the filtered rows only. A query shorter than three characters, ignoring surrounding spaces, MUST NOT narrow the filtered set further. Clearing the query MUST restore the filtered set, scrolled to the top, and MUST keep the chips.

When the filters themselves match nothing, Activity MUST show the filter empty state even if a query is present. When the filters match rows and the query matches none of them, Activity MUST show the existing search empty state and MUST keep the chips.

#### Scenario: Search inside payouts

- **WHEN** Payouts is applied and the driver searches a merchant name that exists only on a card payment
- **THEN** that card payment is not shown

#### Scenario: Short query

- **WHEN** filters are applied and the driver types two characters
- **THEN** the filtered list stays unchanged

#### Scenario: Clear search keeps filters

- **WHEN** the driver clears a query that had narrowed a filtered list
- **THEN** the filtered rows return, scrolled to the top, and the chips remain

#### Scenario: Query inside an empty filter

- **WHEN** the applied filters match nothing and the driver searches
- **THEN** the filter empty state is shown and the chips remain

#### Scenario: Query misses a non-empty filter

- **WHEN** the applied filters match rows and a query of at least three characters matches none of them
- **THEN** the search empty copy is shown and the chips remain

### Requirement: Filtered loading, empty, and failure

After Apply, and after a chip is removed, Activity MUST keep the title, search, filter control, badge, and chips, and MUST skeleton the list until the page arrives. It MUST NOT show an empty state during that wait.

When the applied filters match nothing, Activity MUST show the statement illustration, "No matching activity", and "Try changing or removing your filters to see more activity". It MUST keep the chips and MUST NOT show a summary.

When loading the filtered list fails, Activity MUST show the spilled-mug illustration, "Couldn't load activity", and "We couldn't load activity with these filters. Try again", plus a retry control. The chips MUST remain. Activating retry MUST load the same filters again.

#### Scenario: Apply shows skeletons

- **WHEN** the driver presses Apply filters and the filtered page has not arrived
- **THEN** the chips stay visible and the list area shows a skeleton day header and skeleton rows

#### Scenario: No matching activity

- **WHEN** the applied filters match nothing
- **THEN** the filter empty illustration and both lines of copy are shown, with the chips still visible and no summary

#### Scenario: Filtered load fails

- **WHEN** the filtered list fails to load
- **THEN** the spilled-mug illustration, both failure lines, a retry control, and the chips are shown

#### Scenario: Retry uses the same filters

- **WHEN** the driver activates retry after a filtered load failure
- **THEN** the same filters load again

### Requirement: Paging the filtered list

Further pages MUST append skeleton rows under the filtered list, including a skeleton day header when the next group is unknown. The end snackbar "You have reached the end of your activity list" MUST appear when the driver scrolls to the end of the filtered set, and MUST NOT appear merely because a short filtered list fits on screen. The last row MUST keep enough space that the snackbar does not cover it.

#### Scenario: Next filtered page

- **WHEN** the driver scrolls to the end of a filtered list that has more pages
- **THEN** skeleton rows appear under the loaded rows and the chips stay in place

#### Scenario: End of a filtered set

- **WHEN** the driver scrolls to the bottom after every filtered page has loaded
- **THEN** the end snackbar is shown and no further skeleton rows appear

#### Scenario: Short list does not toast

- **WHEN** the filtered rows fit on screen and the driver has not scrolled to the bottom
- **THEN** the end snackbar is not shown
