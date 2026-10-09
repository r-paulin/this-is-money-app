# Design

## Context

See `proposal.md` for motivation. Today’s home stack in `HomeScreen.tsx`:

- `HomeHeader` → `BannerSlider` → `ActivitySection` → `CardsSection` → `LegalFooter`
- Grouped chrome via `GroupedSection` + `SectionHeader` (Activity, Cards)
- Promo banners are a separate carousel system (`HomeBanner` / `BannerSlider`); Cashback is a **section**, not a banner card
- No Cashback UI or asset exists under `src/features/home/` yet
- Figma source: Bolt Money `9527:203981` (Ⓒ Section → header + one Ⓒ List Item + section separator)

## Goals / Non-Goals

**Goals:**

- Add one grouped Cashback section matching Figma layout and typography
- Reuse `GroupedSection` / `SectionHeader` / Kalep list patterns already used on home
- Ship the car-with-coins illustration as a committed local asset
- Stub “View cashback” without inventing a detail screen

**Non-Goals:**

- Cashback balance, ledger, or eligibility logic
- Parallel banner-style dismiss / carousel
- New design tokens beyond existing semantic colors (action-primary / link-primary for CTA)

## Decisions

### 1. New `CashbackSection` component; mount after Cards

**Choice:** Add `src/features/home/components/CashbackSection.tsx` and render it in `HomeScreen` after `CardsSection`, before `LegalFooter`.

**Rationale:** Mirrors `ActivitySection` / `CardsSection`. Figma node is a standalone Ⓒ Section; full-page order was not in the selected frame — after Cards is the least surprising slot next to other product sections and before legal. If a later full-home Figma frame places it elsewhere, move the one JSX call.

**Alternatives:** Inline in `HomeScreen` — clutters the page; between Activity and Cards — more disruptive to the current activity→cards scan path without confirmed Figma order.

### 2. Custom label column inside `ListItemLayout`, not three Kalep slots

**Choice:** Use `ListItemLayout` with `separator={false}`, a custom `primary` React node stacking title + offer + CTA `Typography` lines, and `renderEndSlot` for the illustration. Do not force-fit CTA into `secondary` alone (Kalep stack is primary/secondary only).

**Rationale:** Figma shows three text styles (Body L Accent, Body S Regular, Body M Compact Accent) plus end media. Custom primary keeps one list-item chrome and matches how other home rows customize slots.

**Alternatives:** Plain flex row without `ListItemLayout` — works but diverges from Activity/Cards; wrapping CTA as a GhostButton — Figma shows text CTA, not a button component.

### 3. Whole-row activation stub

**Choice:** `onClick` on the list item calls `console.info("[stub] View cashback")` (or a tiny prop `onViewCashback` from `HomeScreen` that stubs). No `useNavigationStack().push`.

**Rationale:** Spec forbids inventing a destination; banners and physical-card offer already use stubs.

**Alternatives:** Push a placeholder screen — rejected (out of scope).

### 4. Illustration: export once, commit under home assets

**Choice:** Export Figma “Car with Coins” (`9106:57072`) as PNG or SVG into `src/features/home/assets/` (e.g. `illustration-car-with-coins.png`). Size the leaf to the Figma end-slot box (verify on apply; expect ~120×120-class decorative asset). `alt=""`.

**Rationale:** Same pattern as `illustration-receipt.svg` / banner media. MCP asset URLs expire; do not hotlink.

**Alternatives:** Inline SVG redraw — unnecessary when Figma export exists.

### 5. Spacing via existing GroupedSection knobs

**Choice:** `GroupedSection` with `paddingTop={8}` and `paddingBottom={12}`; `SectionHeader` with `grouped` and `paddingBottom={8}` to match Figma header bottom pad (8px) and section bottom spacing (12px).

**Rationale:** Tokens already encoded in `grouped-section.css` / `SectionHeader`; avoid a one-off CSS file unless ListItemLayout padding gaps need a thin `cashback-section.css`.

### 6. Copy stays inline (or a tiny const), not a banner content map

**Choice:** Hardcode the three Figma strings in the section (or a `homeCashbackContent.ts` const object if it keeps the component cleaner). Do not reuse `homeBannerContent`.

**Rationale:** Single static offer; banner content model is for dismissible carousel media.

## Risks / Trade-offs

- [Home order wrong vs a larger Figma frame] → Mitigation: one mount point; adjust if a parent home frame shows a different stack order.
- [Illustration pixel size / crop mismatch] → Mitigation: compare against Figma screenshot during apply; set explicit width/height on the img leaf.
- [CTA color token name] → Mitigation: use Kalep `color="action-primary"` or `link-primary` (whichever matches existing green CTAs like HomeBanner / AmountScreen); no hex.
- [Stub mistaken for finished navigation] → Mitigation: document stub in tasks; leave a single obvious console stub.

## Migration Plan

- Additive UI only; no data migration.
- Rollback: remove the section from `HomeScreen` and delete the new component/asset.

## Open Questions

- Exact full-home vertical order if Product later provides a complete home frame that places Cashback above Cards — adjust mount order only; specs already allow a later composition update.
