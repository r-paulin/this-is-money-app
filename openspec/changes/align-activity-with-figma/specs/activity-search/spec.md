# Spec Delta

## Purpose

Let the driver find an Activity row by name, amount, reference, type, or transfer ID, and show a clear empty or failed result.

## ADDED Requirements

### Requirement: Search does not run on one or two characters
Activity search MUST NOT filter the list until the query has at least three characters, ignoring leading and trailing spaces. Clearing the query MUST restore the unfiltered list at the top.

#### Scenario: Two characters
- **WHEN** the driver types two characters
- **THEN** the unfiltered Activity list stays on screen

#### Scenario: Query cleared
- **WHEN** the driver deletes the query
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

### Requirement: Search states
While a search request is in flight, Activity MUST show the search skeleton under the field and MUST keep the keyboard available. No match MUST show the empty illustration with "We couldn't find a match" and "Try searching with a different name, amount, or reference". A failed search MUST show the error illustration and a retry action. Leaving Activity and returning MUST clear the query.

#### Scenario: No match
- **WHEN** a query of at least three characters matches nothing
- **THEN** the empty illustration and both lines of copy are shown, not a single "No transactions found" line

#### Scenario: Search fails
- **WHEN** the search request fails
- **THEN** the error illustration and a retry action are shown

#### Scenario: Return to Activity
- **WHEN** the driver leaves Activity and opens it again
- **THEN** the search field is empty
