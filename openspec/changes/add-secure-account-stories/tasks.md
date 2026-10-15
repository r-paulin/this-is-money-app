# Tasks

## 1. Tokens and types

- [x] 1.1 Add `--motion-duration-story-dwell: 1000ms` (and reduced-motion note if needed) in `src/shared/styles/tokens.css`; document it as real-time story progress (not UI travel) in `specs/tokens/token-reference.md`. Verify `npm run token-audit` passes and the variable is listed in the reference.
- [x] 1.2 Add story page/sequence types and pure helpers (clamp index, next/prev, tap-zone side, dwell complete → advance or close) in `src/features/stories/stories.types.ts` and `src/features/stories/lib/storiesLogic.ts` with a small unit test file `src/features/stories/lib/storiesLogic.test.ts`. Verify the new tests pass via `npm test`.

## 2. Secure your account content and assets

- [x] 2.1 Export Figma media for the four Secure your account pages (node `10059:191766` children) into `src/features/stories/assets/` using Figma MCP download_assets (no lingering figma.com asset URLs). Verify each asset file is non-empty on disk.
- [x] 2.2 Add mock sequence `src/features/stories/data/secureAccountStories.ts` with four pages (background token class, image/video/none, title, body, CTA label) aligned to Figma copy. Verify the module exports a sequence whose `pages.length === 4`.

## 3. Stories viewer UI

- [x] 3.1 Implement progress segments + page chrome in `src/features/stories/components/StoriesProgress.tsx` and `src/features/stories/stories.css` (active fill uses `linear` over `--motion-duration-story-dwell`, `scaleX`/`transform-origin: left`, pause via `animation-play-state`). Verify a single active segment animates to full in 1s when not paused.
- [x] 3.2 Implement `src/features/stories/components/StoriesViewer.tsx`: full-bleed overlay (portal to device `portalRoot` when set), close control, horizontal track paging with `--motion-spring-smooth`, tap zones, hold-to-pause, image/video media, per-page background, optional CTA; reduced motion cross-fade at `--motion-duration-sm` / `--motion-ease-standard`. Verify swipe/tap changes page, hold pauses progress, last-page dwell closes, and no raw hex classes appear in the TSX.
- [x] 3.3 Export a thin public API from `src/features/stories/index.ts` (`StoriesViewer`, `SECURE_ACCOUNT_STORIES` or equivalent). Verify home can import without deep relative paths into internals.

## 4. Home demo entry

- [x] 4.1 Wire a temporary open/close stub on home via `src/features/home/components/ServicesList.tsx` (or the smallest adjacent home surface if Services is unused) and `src/features/home/components/HomeScreen.tsx` that mounts `StoriesViewer` with the Secure your account sequence. Verify tapping the stub opens the viewer and close returns to home without a nav-stack push for Stories.

## 5. Integration verification

- [x] 5.1 Run `npm test`, `npm run build`, `npm run lint`, and `npm run token-audit`; fix any issues introduced by Stories. Verify all four succeed.
- [x] 5.2 Smoke-check the four Figma pages (progress count, backgrounds, media, CTA, paging/auto-advance at 1s). Verify visual structure matches `10059:191766` and reduced-motion does not horizontal-slide.
