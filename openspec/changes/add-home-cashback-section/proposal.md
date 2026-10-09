# Proposal

## Why

Home is missing the Figma **Cashback** promo section (`9527:203981`): a grouped card that explains fuel/EV cashback and offers a “View cashback” entry point. Shipping it keeps the home stack aligned with Bolt Money design and surfaces the cashback offer next to existing activity and cards content.

## What Changes

- Add a home **Cashback** grouped section with section header, promo list row (title, offer copy, green CTA text), and the Figma “Car with Coins” illustration in the end slot.
- Mount the section on `HomeScreen` in the home vertical stack (after Cards, before Legal footer — see design assumptions if Figma full-page order differs).
- Wire “View cashback” as a stub activation (no cashback detail screen in this change).
- Commit the exported illustration under `src/features/home/assets/` and use design-system typography/tokens only.

## Capabilities

### New Capabilities

- `home-cashback`: Layout, copy, illustration, and CTA activation for the home Cashback promo section.

### Modified Capabilities

- (none — no existing OpenSpec capabilities under `openspec/specs/`)

## Impact

- UI: new `CashbackSection` (or equivalent) under `src/features/home/components/`; `HomeScreen.tsx` composition
- Assets: car-with-coins illustration export from Figma
- Shared layout: reuse `GroupedSection` + `SectionHeader` + Kalep `ListItemLayout` / `Typography`
- Tests: light home logic or content assert if helpers are extracted; smoke via existing home tests if applicable
- Out of scope systems: cashback balance, earnings history, eligibility API, dismiss/hide rules

## Non-goals

- A full Cashback detail / history screen or navigation stack destination
- Real cashback rates, eligibility, or backend data (mock/static copy from Figma only)
- Dismiss, carousel, or multi-offer variants
- Changing MCC cashback theme icons used on activity rows
- Remote CMS or A/B targeting for the section
