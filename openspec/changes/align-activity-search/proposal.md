# Proposal

## Why

Activity search already filters the mock feed, but it still drifts from Figma Flow / Search (`8824:30792`): long search result sets never show the end-of-list toast, empty/error empty-states do not match the illustrated frames, and leave/return query clearing is not guaranteed. Drivers need the search experience to behave like the design board, not a partial list filter.

## What Changes

- Finish Activity search states against Figma: loading skeleton under the field, results with day groups and time-only timestamps, no-match illustration + copy, failed search illustration + retry (including keyboard-up and keyboard-dismissed layouts).
- Paginate search results the same way as the unfiltered list, and show the same end-of-list snackbar when the filtered set is exhausted.
- Align empty-state art with the Figma “Long Document” empty frame (replace undersized receipt placeholder if needed).
- Guarantee that leaving Activity and returning clears the query (and restores the unfiltered list).
- Keep existing match rules (3+ characters, word-start names/diacritics, amounts, reference, type, transfer ID, declined/pending eligible) and only adjust them if tests or Figma annotations prove a gap.

## Capabilities

### New Capabilities

- `activity-search`: Query threshold and match rules, loading / results / empty / error states, search pagination + end toast, and clear-on-leave behavior for Activity search (Figma `8824:30792`).

### Modified Capabilities

- None. Durable `openspec/specs/` has no `activity-search` inventory yet. An older in-flight change (`align-activity-with-figma`) drafted a delta; this change supersedes that search scope as the search-only source of truth.

## Impact

- `src/features/transactions/components/TransactionsScreen.tsx` (states, pagination toast while filtering, leave/clear wiring)
- `src/features/transactions/components/TransactionsGate.tsx` (mount/clear semantics if needed)
- Empty/error illustration assets under `src/features/home/assets/` or `src/features/transactions/assets/`
- Possibly small updates to `searchTransactions.ts` / tests only if match-rule gaps appear
- No new dependencies; mock-local filter stays local

## Non-goals

- Activity list chrome outside search (title scroll, unfiltered end toast already shipping, MCC icons)
- Get statement flow
- Card / transfer / payout detail screens
- Live search API or remote indexing
- Changing debit amount sign display rules
- Archiving or finishing unrelated tasks in `align-activity-with-figma`
