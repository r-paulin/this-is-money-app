# Design

## Context

See `proposal.md` for motivation. Today’s home promo stack:

- `BannerSlider` → `HomeBanner` with title + body + CTA button + shared `banner-google-pay-media.png`
- Content map: `homeBannerContent.ts` (`title`, `body`, `actionLabel`, `actionVariant`)
- Visibility: `MOCK_BANNER_IDS` → session `dismissedBannerIds` → `filterEligibleBanners`
- CSS: `home-banner.css` still uses a 190px min-height and a taller title/CTA layout than Figma `9250:174850`

Figma conflicts one comment (“no minimum height”) with the component / Height notes (`min-height` 92px + 3-line cap). This design follows **92px minimum + 3-line cap**.

## Goals / Non-Goals

**Goals:**

- Reshape the existing card and slider to match Figma Banner / Content without a new component tree
- Replace the content model with body segments, per-id media, background token, and destination stub
- Keep selection/eligibility/dismiss plumbing; collapse the section when empty
- Prefer logical CSS (inline-start/end) for RTL

**Non-Goals:**

- New remote/CMS data layer
- Persisted dismiss / re-show counters
- Reviving `GoogleWalletBanner.tsx`
- Changing `filterEligibleBanners` rules beyond keeping them as-is

## Decisions

### 1. Keep `HomeBanner` + `BannerSlider`; reshape in place

**Choice:** Update the existing components and CSS rather than introducing a parallel banner component.

**Rationale:** One consumer on home; ponytail prefers fewest files. `GoogleWalletBanner` stays unused.

**Alternatives:** New `PromoBanner` + adapter — more surface area for the same UI.

### 2. Content model: segments + media + tokens

**Choice:** Replace `title` / `body` / `actionLabel` / `actionVariant` with roughly:

```ts
type BannerTextSegment = { text: string; bold?: boolean }
type HomeBannerContent = {
  body: BannerTextSegment[]
  media: { imageSrc: string; videoSrc?: string; placeholderSrc: string }
  backgroundClass?: string // semantic Tailwind / token class, default floor-1
  // destination remains stubbed via banner id for now
}
```

Map each existing id: bold segment = former title (+ sentence break), regular = former body. Drop visible CTA; card click uses the existing `console.info` stub keyed by id.

**Rationale:** Bold without HTML injection; Typography-friendly; mandatory media is explicit.

**Alternatives:** Store limited HTML and sanitize — rejected (harder to keep meaning if bold truncates mid-tag).

### 3. Height: 92px min, 3-line clamp

**Choice:** `min-height: 92px`; body `line-clamp-3`; carousel slides `align-items: stretch` so cards equalize.

**Rationale:** Matches Figma component + Height note; resolves the conflicting “no min height” comment.

### 4. Close: Cross icon, 32×32 hit target

**Choice:** Kalep Cross (or Clear if Cross is unavailable in the installed icon set — prefer Cross per Figma) on a circular `bg-layer-floor-1` fill; absolute top-end; 32×32 hit area; `stopPropagation` so dismiss ≠ activate.

**Rationale:** Figma close note; current code uses Clear at 44px — shrink to 32×32 and add fill.

### 5. Video / reduce-motion

**Choice:** Optional `videoSrc` with `<video muted loop playsInline>`; pause via IntersectionObserver / scroll visibility in the slider; static `<img>` when `prefers-reduced-motion`, `navigator.connection?.saveData`, or video error.

**Rationale:** Spec requires muted loop + pause off-screen + fallbacks; no Lottie dependency.

### 6. Media error cascade

**Choice:** `onError` on primary → swap to `placeholderSrc`; second failure → hide media wrapper and let text column go full width. Never leave `alt` broken-image chrome.

**Rationale:** Matches Figma ERROR CASES.

### 7. Dismiss remains session-only

**Choice:** Keep `HomeScreenProvider` `useState<Set<HomeBannerId>>`. Document re-show schedule as a follow-up when product defines X and period.

**Rationale:** Spec allows optimistic dismiss; persistence is an explicit non-goal.

### 8. Section empty = `null`

**Choice:** Keep `BannerSlider` early `return null` when `visible.length === 0` so padding collapses with the section.

**Rationale:** Already mostly true; verify after padding token updates.

## Risks / Trade-offs

- [Copy migration loses CTA labels] → Acceptable per Figma; destination still stubbed by id; product can restore labels later as in-body bold if needed.
- [Long dynamic values still overflow 3 lines] → Content authoring responsibility; no runtime localization QA in this change.
- [Video assets not yet in repo] → Content model supports `videoSrc` optional; ship with images first; video paths can be added when assets exist.
- [Contrast on tinted backgrounds] → Review-time only; wrong token can ship inaccessible copy.

## Migration Plan

1. Update content types and migrate the five existing ids.
2. Restyle `HomeBanner` / `home-banner.css` / `BannerSlider` padding to Figma tokens.
3. Wire card activate + close stopPropagation; media error/video fallbacks.
4. Extend `homeScreenLogic.test.ts` for single vs multi and empty section; add a small pure helper test for content mapping if extracted.
5. Visual check against Figma; `npm test`, `npm run build`, `npm run lint`, `npm run token-audit`.

Rollback: revert the feature branch; no schema/API migrations.

## Open Questions

- Exact semantic token class names for failure / tinted backgrounds (confirm against `tokens.css` / Kalep when applying).
- Whether installed `@bolteu/kalep-react-icons` exports `Cross` vs only `Clear` — pick at apply time without changing the 32×32 / fill behavior.
