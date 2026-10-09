# Spec Delta

## Purpose

Let the driver find an Activity row by name, amount, reference, type, or transfer ID, and show loading, results, empty, and failed search states that match Bolt Money Figma Flow / Search (`8824:30792`).

## ADDED Requirements

### Requirement: Search does not run on one or two characters

Activity search MUST NOT filter the list until the query has at least three characters, ignoring leading and trailing spaces. Clearing the query MUST restore the unfiltered list scrolled to the top.

#### Scenario: Two characters

- **WHEN** the driver types two characters
- **THEN** the unfiltered Activity list stays on screen

#### Scenario: Query cleared

- **WHEN** the driver deletes the query after a filter was applied
- **THEN** the full list returns, scrolled to the top

### Requirement: What a query matches

A query of at least three characters MUST match a row when any of these are true: a merchant or counterparty word starts with the query, ignoring case and diacritics; the amount equals the query in the forms 100, 100.00, €100, or 100 €, ignoring a leading sign unless the driver typed one; the reference contains the query; the row type label contains the query, such as Ride payout or Refund; the transfer ID equals the query. Declined and pending rows MUST remain eligible. Matches MUST stay grouped by day, and the row timestamp MUST stay time-only.

#### Scenario: Name without diacritics

- **WHEN** the driver searches elodie
- **THEN** a counterparty named Élodie Moreau is included

#### Scenario: Amount

- **WHEN** the driver searches 100.00
- **THEN** a transaction of 100.00 euros is included whether or not its displayed amount has a sign

#### Scenario: Declined row

- **WHEN** the driver searches the merchant name of a declined payment
- **THEN** that declined row appears in the results

### Requirement: Search loading state

While a search of three or more characters is settling (debounce / in-flight), Activity MUST show the search skeleton under the field and MUST keep the search field available so the driver can refine the query.

#### Scenario: Settling after three characters

- **WHEN** the driver types a third character and the debounced query has not caught up yet
- **THEN** skeleton rows appear under the search field instead of the previous list

### Requirement: Search results state

When a query of at least three characters returns matches, Activity MUST show those rows grouped by day with time-only timestamps, and MUST keep the keyboard available so the driver can refine without dismissing.

#### Scenario: Matches grouped by day

- **WHEN** the query matches rows on more than one calendar day
- **THEN** results appear under day section headers with time-only timestamps on each row

### Requirement: Search empty state

When a query of at least three characters matches nothing, Activity MUST show the no-match illustration and the copy "We couldn't find a match" plus "Try searching with a different name, amount, or reference". It MUST NOT show only a single "No transactions found" line.

#### Scenario: No match

- **WHEN** a query of at least three characters matches nothing
- **THEN** the empty illustration and both lines of copy are shown

### Requirement: Search error state

When search fails, Activity MUST show the error illustration, the copy "Search didn't work" and "Try again in a moment", and a retry action. Activating retry MUST re-run search for the current query.

#### Scenario: Search fails

- **WHEN** the search request fails
- **THEN** the error illustration, both error copy lines, and a retry action are shown

#### Scenario: Retry after failure

- **WHEN** the driver activates Try again after a failed search
- **THEN** search runs again for the current query

### Requirement: Search result pagination and end toast

Filtered search results MUST paginate like the unfiltered Activity list. When the driver reaches the end of the filtered result set, Activity MUST show the same end-of-list snackbar used for the unfiltered list ("You have reached the end of your activity list").

#### Scenario: End of search results

- **WHEN** the driver scrolls through all pages of a filtered result set with no more rows to load
- **THEN** the end-of-list snackbar appears

### Requirement: Leave and return clears search

Leaving Activity and opening it again MUST clear the search query and show the unfiltered list.

#### Scenario: Return to Activity

- **WHEN** the driver leaves Activity and opens it again
- **THEN** the search field is empty and the list is unfiltered
