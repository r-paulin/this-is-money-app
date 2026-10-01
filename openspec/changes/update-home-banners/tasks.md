# Tasks

## 1. Content model

- [x] 1.1 Reshape `HomeBannerContent` in `src/features/home/data/homeBannerContent.ts` to body segments, media (`imageSrc`, optional `videoSrc`, `placeholderSrc`), and optional background token class; migrate all five `HomeBannerId` entries (bold lead from former title + former body); verify TypeScript compiles for that file via `npm run build` (or `tsc -b` failure surfaces the type errors).
- [x] 1.2 Update any exports/types that still reference `title` / `actionLabel` / `actionVariant` in `src/features/home/` (including `HomeBanner` props consumers); verify no remaining references with a project search for those field names under home.

## 2. Banner card UI

- [x] 2.1 Rewrite `src/features/home/components/HomeBanner.tsx` for single body (`Typography` Body M compact), mandatory media slot, whole-card activate stub, and close control (Kalep Cross or Clear) with solid floor-1 fill and 32×32 hit target that stops propagation; verify card tap logs the stub and close calls `onDismiss` without logging activate.
- [x] 2.2 Restyle `src/features/home/components/home-banner.css` to 92px min-height, dimension/300 radius, start padding dimension/300, 100px flush media, logical positioning for RTL close; remove old title/CTA spacing and 190px min-height; verify no raw hex added (`npm run token-audit`).

## 3. Slider section

- [x] 3.1 Update `src/features/home/components/BannerSlider.tsx` and related rules in `home-banner.css` for single vs multi padding (dimension/600 / 300 / 600), gap dimension/300, dots (24×8 active, 8×8 inactive, 4px gap, 8px below), stretch-equal heights, and `null` when empty; verify single banner shows no dots and multi shows dots under the track.
- [x] 3.2 Confirm `src/features/home/HomeScreenProvider.tsx` and `src/features/home/lib/homeScreenLogic.ts` eligibility/dismiss behavior unchanged; verify dismiss still filters ids and last dismiss collapses the section in the UI.

## 4. Media fallbacks

- [x] 4.1 Implement image `onError` → placeholder → omit media (full-width text) in `HomeBanner.tsx`; verify broken primary src shows placeholder and double failure leaves no broken-image chrome.
- [x] 4.2 Add optional muted looping video with pause when off-screen and static fallback for reduce-motion / saveData / codec error in `HomeBanner.tsx` / `BannerSlider.tsx` as needed; verify reduce-motion shows the static frame when a `videoSrc` is configured (or document image-only mock path if no video asset yet).

## 5. Tests and verification

- [x] 5.1 Extend `src/features/home/lib/homeScreenLogic.test.ts` for `bannerSliderIsSingle` and `filterEligibleBanners` / empty-visible expectations used by the slider; verify `npm test` passes.
- [x] 5.2 Run `npm test`, `npm run build`, `npm run lint`, and `npm run token-audit`; verify all succeed with no new arbitrary color/radius findings in touched TSX.
