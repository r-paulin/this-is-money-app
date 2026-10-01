# Spec Delta

## Purpose

Show the driver their Activity as a day-grouped list they can scan, page through, and recognize by category icon.

## ADDED Requirements

### Requirement: Activity title and tools
The screen title MUST be Activity. Search and the statement action MUST stay available even when the list has a single row. Day headers MUST still appear for that single row.

#### Scenario: One transaction
- **WHEN** the driver opens Activity and only one transaction exists
- **THEN** the title is Activity, search and the statement action are visible, and the row sits under a day header

### Requirement: Day groups and time-only timestamps
Transactions MUST be grouped under a day header. The row secondary line MUST show the clock time only, because the day header already carries the date. Credits MUST be shown in the success color with a leading plus. A missing amount MUST be shown as `--`.

#### Scenario: Row under Today
- **WHEN** a transaction occurred today at 19:05
- **THEN** it appears under the Today header and the row shows 19:05 without repeating the calendar date

### Requirement: Header collapses on scroll
Once the driver scrolls the list, the title and search MUST leave the view. The back control MUST stay fixed. The list MUST NOT jump when the header collapses.

#### Scenario: Scrolled list
- **WHEN** the driver scrolls past the first screen of Activity
- **THEN** the title and search are no longer visible and the back control remains

### Requirement: Paged loading and end of list
The first open MUST show a skeleton for the title, search, statement action, day header, and three rows, and those skeletons MUST NOT be tappable. Further pages MUST append skeleton rows under the loaded list. When no further page exists, the list MUST show the snackbar "You have reached the end of your activity list" and MUST NOT show more skeletons. The last row MUST keep enough space that the snackbar does not cover it.

#### Scenario: First open
- **WHEN** Activity is opened and the first page has not arrived
- **THEN** the title, search, and three rows are skeletons and cannot be opened

#### Scenario: End of history
- **WHEN** the driver has loaded every page
- **THEN** the end snackbar is shown and no further skeleton rows appear

### Requirement: Category icon hierarchy
Each row MUST choose its mark in this order: the MCC category icon when the code is mapped; the other icon when the code is unknown; a full-size incoming or outgoing arrow as the mark itself for a transfer or payout; the error icon in place of the category glyph for a failed or declined row. Restaurants, bars, and entertainment MUST NOT share one color. Cashback MUST have its own mark. The Bolt payout mark MUST NOT be selected by copying the money category codes.

#### Scenario: Ride payout
- **WHEN** the row is a ride payout
- **THEN** the mark is a full-size incoming arrow, not a category circle with a small corner badge

#### Scenario: Declined card payment
- **WHEN** the row is a declined card payment at a known merchant
- **THEN** the mark is the error icon, not the merchant's category glyph

#### Scenario: Unknown code
- **WHEN** the merchant category code is not in the mapped set
- **THEN** the row uses the other icon
