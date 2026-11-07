# Spending limits

**Figma:** Card / Spending limits `11640:52404`

Per-card daily, monthly, and per-transaction caps. Entry from Card Controls (and Home warnings). Mock session store — no issuer API.

## Screens

| Screen | Nav key | Notes |
|--------|---------|--------|
| Overview | `spending-limits:{cardType}` | Gate skeleton → Progress circle + list + Change limits |
| Change limits | `change-limits:{cardType}` | Per transaction + monthly fields + sticky Save |

## Overview

- Intro: limits apply to this card only; balance is separate
- Progress circle: open-bottom ~270° arc; fill = spent this month / monthly limit
  - First entry: arc animates 0 → ratio; spent amount uses Number pop-in
  - Revisit with same spent/ratio: static (no animation)
  - Spent or ratio change (e.g. after Save): arc + digits animate again
- Rows (Label Stack — label above amount): Per transaction limit · Available this month (`Monthly limit: €X`)
- **Change limits** → edit screen

## Change limits

- Subtitle: “Set limits per transaction and month”
- Fields: Per transaction, Monthly spending limit (`InlineLabelTextField` + EUR) — no daily field
- Helper: transaction/transfer note + “Your new monthly limit takes effect at {date}, {time} local time.”
- Per-transaction max €3,000.00 (inline error when higher)
- Save: mock latency → snackbar “Spending limits updated” → pop to overview
- Saving a monthly cap below already-spent → €0 available (limit reached); daily cap unchanged on save

## Warnings

| Kind | Hub secondary | Home / Card Controls banner |
|------|---------------|-----------------------------|
| Daily low (≤ €50 left) | `Available today: €X` | “€X left to spend today” + reset countdown |
| Daily reached | `Daily limit reached` | Title + time until reset |
| Monthly reached | `Monthly limit reached` | Title + reset date |

Locked-card Home notification wins over limit warnings. Banner / Home action opens Spending limits (via Card Controls stack when needed).

## Implementation

- Domain: `src/features/cardControls/lib/spendingLimits.ts`
- UI: `SpendingLimitsGate` / `ChangeLimitsGate`
- Progress: `SpendingLimitsProgressRing` + shared `NumberPopIn` / `useNumberPopIn`
