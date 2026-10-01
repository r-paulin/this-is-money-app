# Proposal

## Why

Home promo banners must match the Bolt Money Figma **Section / Banners** system (`9250:174850`): a single body string, mandatory decorative media, whole-card activation, and a close control. The current card uses a separate title, body, and CTA button, shares one image across all ids, and does not follow the new spacing, height, media, or failure rules.

## What Changes

- Reshape the home banner card to **Banner / Content**: one body (optional bold segments), mandatory media slot, close control; remove the separate title row and visible CTA button (**BREAKING** for the current card content model).
- Whole-card tap opens the banner destination (existing stub); close uses a filled circular Cross control with a 32×32 hit target that does not activate the card.
- Align section and card layout with Figma tokens: floor-0-grouped section, floor-1 card (`min-height` 92px, radius `dimension/300`), single vs multi padding/dots rules, 3-line clamp with accessible full string.
- Support per-banner background tokens, image or muted looping video (no Lottie), reduce-motion / save-data / codec fallbacks, and media error fallbacks without broken-image UI.
- Keep selection (`MOCK_BANNER_IDS`), eligibility (`filterEligibleBanners`), and in-memory dismiss; collapse the section when no banners remain.
- Migrate existing `HomeBannerId` copy into the new content shape (bold lead from today’s title + remaining body).

## Capabilities

### New Capabilities

- `home-banners`: Layout, copy truncation, media, activation, dismiss, empty/error, and RTL behavior for the home promo banner section and cards.

### Modified Capabilities

- (none — no existing OpenSpec capabilities under `openspec/specs/`)

## Impact

- UI: `HomeBanner.tsx`, `BannerSlider.tsx`, `home-banner.css`
- Data: `homeBannerContent.ts` content shape; callers that assume title/actionLabel
- State: `HomeScreenProvider` dismiss remains session-only
- Tests: `homeScreenLogic.test.ts` (single vs multi, empty section); extend as needed for new content helpers
- Design system: Kalep `Typography` / Cross icon; semantic tokens only (no raw hex)
- Out of scope systems: remote banner API, persisted re-show schedule

## Non-goals

- Remote banner fetch or a CMS
- Persisted dismiss and the numeric re-show schedule (“show once” / “show {X} times per period”) until X and the period are defined
- Lottie, campaign eligibility changes beyond existing `filterEligibleBanners`
- In-component WCAG contrast enforcement (review-time check only)
- Reviving unused `GoogleWalletBanner.tsx`
