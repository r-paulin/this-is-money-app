# Design

## Context

See proposal.md for why. No Stories feature exists today. Closest reuse: `BannerSlider` (pointer drag + snap + `--motion-spring-smooth`), `HomeBanner` / `CashbackHeroVideo` (muted video, pause off-screen), `CardReplaceFlyIn` (device-local fixed overlay), and `DeviceShellOutlet` `portalRoot` for in-bezel portals. Nav stack push is for hierarchical drill-down; Stories are immersive overlays per `specs/patterns/navigation.md`. Motion travel maxes at xl (500ms); 1s page dwell is real-time progress (`linear`), same class as spinners — define the dwell in `tokens.css`, do not invent a travel ease longer than xl.

Figma `10059:191766` is four “ONBOARDING / Page” bezels: fixed dark header (status, back, progress) on full-screen black chrome + a separate content sheet with rounded top corners. Only the sheet background varies by page (white / brand teal / etc.) — never the header.

## Goals / Non-Goals

**Goals:**

- One small Stories module: data model + viewer chrome + paging/progress logic + Secure your account mock content.
- Instagram-familiar gestures (swipe, tap zones, hold-to-pause) with Bolt motion tokens.
- Demo entry from home so QA can open the flow without a tray.

**Non-Goals:**

- See proposal.md. Also: no shared carousel abstraction extracted from `BannerSlider` unless the Stories track would literally duplicate it with no gain; prefer a stories-local track.

## Industry mechanics (applied)

| Pattern (IG / TikTok / Snap) | v1 application |
|---|---|
| Segmented top progress | One segment per page; fill = dwell progress |
| ~5–15s image dwell | **5s dwell** (product choice; `--motion-duration-story-dwell`) |
| Video length as dwell | Cap: still auto-advance at 5s; pause video on leave |
| Horizontal drag between items | Pointer drag + commit threshold; spring-smooth settle |
| Tap left / right thirds | Leading → previous; trailing → next (no-op on last; close only via back/CTA) |
| Hold to pause | `pointerdown` pause, `pointerup`/`cancel` resume; ignore when target is CTA/close |
| Peek of adjacent story | Optional; v1 can clip to full-bleed pages (no peer publisher rail) |
| Reduced motion | Cross-fade pages; keep progress meaning (fill or stepped) without slide |

## Decisions

### Overlay, not nav push

Render the viewer as a full-bleed layer inside the device shell (portal to `portalRoot` when available, else fixed within the shell). Open/close state lives in a thin home stub or feature provider. Do **not** `push()` Stories onto `NavigationStack` — that would fight edge-swipe-back and imply hierarchy.

Alternative: Kalep `Modal`. Rejected for v1 unless Modal already supports full-bleed media + custom gestures without fighting pointer capture; a local overlay matches `CardReplaceFlyIn` and keeps gesture ownership.

### Feature folder `src/features/stories/`

- `types` — page + sequence shapes (`backgroundClass` or token key, `media: image | video | none`, copy, `cta?`)
- `data/secureAccountStories.ts` — four-page mock from Figma
- `StoriesViewer` — chrome (close, progress, media, copy, CTA) + gesture wiring
- `stories.css` — progress fill, track transform, reduced-motion
- Pure helpers for index clamp, dwell remaining, tap-zone hit testing — unit-test these

Home only mounts a stub control that sets `open` and renders the viewer.

### Dwell token in `tokens.css`

Add a real-time duration used only for story progress / auto-advance: `--motion-duration-story-dwell: 5000ms`. Progress animation uses `linear` over that variable. Document in `specs/tokens/token-reference.md` that this is dwell/progress, not UI travel (travel still ≤ xl). CTA stays outside the sliding track. Header chrome stays dark; only the sheet background transitions with `--motion-duration-md` + `--motion-ease-standard`.

Paging settle uses `--motion-spring-smooth` / `--motion-spring-smooth-duration` (same family as banners). Reduced motion: opacity at `--motion-duration-sm` + `--motion-ease-standard`.

### Progress implementation

CSS width/scaleX on an inner fill driven by a single `animation` or `requestAnimationFrame` tied to dwell. Prefer one approach:

- **Chosen:** CSS animation on the active fill from 0→100% over `var(--motion-duration-story-dwell)` with `animation-play-state` paused on hold; on manual page change, remount/restart the active fill. Completed segments are static full width.

Avoid animating layout width if transform scaleX works with `transform-origin: left`.

### Gestures

Reuse the BannerSlider lessons: `touch-action` that allows horizontal intent, vertical drag cancels story swipe, suppress click after drag, commit when offset passes ~20–30% of width (or velocity). Tap zones only fire when the pointer did not drag. Do not animate `left`/`top`; use `translate3d` on a track of full-viewport pages.

### Media

- Image: `<img>` or decorative asset, object-fit cover/contain per Figma.
- Video: muted, `playsInline`, play when page active and not paused; pause otherwise (mirror `HomeBanner` / cashback patterns).
- Background: Tailwind semantic / `bg-*` token classes from content config — no hex in TSX.

### Secure your account content

Four pages mapped from Figma labels: 2FA intro → SMS codes → biometrics → confirmation. Export illustrations via Figma MCP `download_assets` during apply; store under `src/features/stories/assets/`. CTAs stub (`console` or no-op / close) until product wires real security settings.

### Demo entry

Add a clearly temporary home entry (e.g. list row under Services, or a stub on an existing promo) labeled for Secure your account. Record in tasks that this can be swapped for first-run gating later without changing the viewer.

## Risks / Trade-offs

- **[Risk] 5s dwell may still feel short for dense copy** → Mitigation: user can hold to pause; swipe/tap freely; product can lengthen the token later without API change.
- **[Risk] Overlay steals pointer from nav edge-swipe** → Mitigation: only while open; close restores; do not mount Stories inside a nav layer that also needs edge pop.
- **[Risk] Video longer than 1s feels cut off** → Mitigation: spec says advance at 1s; keep mock videos short or accept cut; document for content authors.
- **[Risk] Duplicating BannerSlider drag code** → Mitigation: copy the minimal pointer machine into stories CSS/TS; extract shared helper only if both call sites stabilize identically.

## Migration Plan

Ship behind the demo entry only. No data migration. Rollback = remove entry + feature folder. After archive, promote `openspec/changes/.../specs/stories/spec.md` into main specs via the usual archive flow.

## Open Questions

- Exact home stub placement (Services list vs temporary header action) — pick the smallest home diff during apply; does not change viewer requirements.
