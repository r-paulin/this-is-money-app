# Design

## Context

See proposal.md — Why. Search already lives in `TransactionsScreen` + `applyActivitySearch` / `searchTransactions`, with debounce, skeleton settling, empty/error branches, and title highlight. The main behavioral gap is the end snackbar being gated off while `filtering` is true. Empty art is a small receipt SVG vs Figma’s Long Document frame; error has one layout vs keyboard-up / keyboard-dismissed frames. `TransactionsGate` remounts `TransactionsScreen` via `deferContentMount`, which usually clears query on re-entry — make that requirement explicit rather than accidental.

## Goals / Non-Goals

**Goals:**

- Close Figma search-state gaps with the smallest change to the existing screen
- Enable end-of-list snackbar for exhausted **filtered** pages without changing unfiltered behavior
- Keep match logic unless a failing scenario proves a bug
- Export / size the empty illustration to match the no-match frame

**Non-Goals:**

- New search screen or route separate from Activity
- Remote search API
- Redesigning the unfiltered Activity list or statement entry

## Decisions

### 1. Patch `TransactionsScreen` end-toast guard; do not fork a SearchScreen

**Choice:** Keep search on `TransactionsScreen`. Change the end-snackbar effect so it fires when `search.status === "results"` and `!hasMore` (and still when idle/unfiltered as today), not when `filtering` alone blocks it. Reset `endNoticeSent` when the debounced query changes.

**Alternatives:** Separate Search screen — rejected (Figma keeps search on Activity). Duplicate toast logic — rejected (one snackbar string already exists).

### 2. Empty illustration: export Figma Long Document; keep spilled mug for error

**Choice:** Export the no-match illustration from Figma `8845:53239` / Long Document into feature assets (prefer `src/features/transactions/assets/` if home-owned receipt is wrong for search). Size toward Figma leaf (~200×148 display, not 80×80). Keep existing spilled-mug asset for error; adjust vertical placement so keyboard-up and keyboard-dismissed frames both read correctly (flex centering / padding, not two components).

**Alternatives:** Keep tiny receipt — rejected (visible mismatch). Animate keyboard layout switches — rejected (overkill; CSS layout covers both).

### 3. Clear-on-leave via Gate remount; add a guard if needed

**Choice:** Rely on `TransactionsGate` remounting content when pushed again (`deferContentMount`). Verify pop → push clears query. If the stack ever keeps the screen mounted, reset query in a Gate/key keyed by navigation entry — only if verification fails.

**Alternatives:** Global search store — rejected (YAGNI). Persist query across visits — contradicts Figma.

### 4. Match rules stay in `searchTransactions.ts`

**Choice:** No redesign of matching. Add or tighten tests only if a Figma annotation scenario fails against current code.

## Risks / Trade-offs

- **[Risk] End toast fires twice when clearing from filtered → unfiltered** → Reset `endNoticeSent` on query change; keep existing unfiltered path’s one-shot guard.
- **[Risk] Large illustration asset size** → Prefer optimized PNG/SVG export; don’t bundle keyboard chrome from Figma frames.
- **[Risk] Error “request fails” is mock-only today** (`filter` throw) → Keep injectable filter / attempt counter; no fake network layer.

## Migration Plan

- Ship as UI + local filter behavior only; no schema or API migration.
- Rollback: revert `TransactionsScreen` toast/illustration changes; match helpers unchanged if untouched.
