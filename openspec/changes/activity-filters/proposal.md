# Proposal

## Why

Activity can be searched, but a driver still has to scroll to isolate one kind of money or one period. Figma now puts statement download in the top toolbar, a filter control beside search, and a Filters screen whose activity types go quiet when they cannot move the balance in the selected direction.

## What Changes

- Move Get statement from the search row into the Activity toolbar, trailing Back, and keep it fixed while the title and search scroll away.
- Open Filters from the round control beside Search. Show a count badge when filters are applied.
- Add a pushed Filters screen: Date, Money flow, and Activity type, with Apply and Clear pinned at the bottom.
- When Money in is selected, disable activity types that cannot add to the driver's balance (card payments and fees, and any other type that never credits). When Money out is selected, disable types that cannot take money out. Switching back to All restores every type.
- After Apply, show removable chips, a result count, and a balance total. Search runs only inside that filtered set.
- Match the loading, empty, and failure frames, including skeletons on first open and when a filtered page is loading.
- Specify the edge cases (invalid custom dates, incompatible selections, rows that move no money, search composed with filters) as QA scenarios the implementation must satisfy.

## Capabilities

### New Capabilities

- `activity-filters`: Activity toolbar and filter entry, the Filters screen, which types a money-flow selection disables, how rows and the total are included, and the loading, empty, and error states. Acceptance is the QA scenarios in that spec.

### Modified Capabilities

- None. The main spec inventory is empty. Earlier Activity behavior lives in completed change deltas and stays as it is, except where this capability replaces the statement control's place and the first-load skeleton footprint.

## Impact

- `src/shared/components/AppNavbar.tsx` and the navigation stack entry, so the download control belongs to the Activity layer only.
- `src/features/transactions/` list, loading skeleton, a new Filters screen, and a filter function beside the existing search.
- `src/features/transactions/data/mockTransactions.ts` so Fees and Cashback can match.
- New node tests next to the filter function, covering the QA scenarios. No new dependency. Filtering stays on the local mock feed.

## Non-goals

- A live transactions API, or persisting filters across leaving Activity.
- Redesigning transaction rows, dispute states, or the Get statement flow beyond its entry point.
- A bottom sheet. The frames are a full screen with a back arrow and no grabber.
- Disabling Apply while a custom range is incomplete. The frames keep Apply enabled; an incomplete or reversed range does not apply.
- An error dialog when a type is incompatible with the money flow. The disabled chip is the feedback.
