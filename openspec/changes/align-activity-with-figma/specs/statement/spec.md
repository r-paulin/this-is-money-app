# Spec Delta

## Purpose

Let the driver create a statement for a real period, including the cases where the range is too long, the period is empty, or generation fails.

## ADDED Requirements

### Requirement: Period presets
Get statement MUST offer This month, Last month, Last 3 months, and Custom range, in that order. This month MUST be selected by default. Each preset MUST show the computed dates, not only the label. The primary action MUST read Create statement.

#### Scenario: Default open
- **WHEN** the driver opens Get statement
- **THEN** This month is selected, its date range is visible, and the action is Create statement

### Requirement: Range longer than one year
A custom range longer than one year MUST NOT start generation. An inline message MUST name the one-year limit and tell the driver to adjust the start or end date. The message MUST sit between the date fields and the action, and the dates the driver entered MUST stay editable.

#### Scenario: Custom range over a year
- **WHEN** the driver sets a custom range longer than one year and tries to create the statement
- **THEN** generation does not start, the inline message is shown, and the entered dates remain

### Requirement: Empty period still produces a statement
A period with no transactions MUST be treated as a successful result, not an error. The ready screen MUST explain that the file shows no activity, and both download formats MUST stay available.

#### Scenario: No transactions in range
- **WHEN** generation finishes for a period that contains no transactions
- **THEN** the ready screen offers both download formats and the copy explains the empty period

### Requirement: Generation progress, delay, error, and download
While the file is being created, the screen MUST show a spinner and creation copy. If creation takes longer, the copy MUST change to say it is still working. A generation failure MUST show an error state with a way to try again, distinct from the empty-period success. After a successful download, a snackbar MUST confirm the file was downloaded.

#### Scenario: Creation takes longer
- **WHEN** creation is still running after the longer-wait threshold
- **THEN** the copy changes to the longer-creation message and the spinner remains

#### Scenario: Generation fails
- **WHEN** statement generation fails
- **THEN** the error state is shown and the driver can try again without being told the period was empty

#### Scenario: File downloaded
- **WHEN** the driver downloads the ready file
- **THEN** a snackbar confirms the download
