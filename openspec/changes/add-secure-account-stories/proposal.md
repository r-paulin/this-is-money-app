# Proposal

## Why

Bolt Money needs a product **Stories** experience for short, full-screen education sequences (Figma “Secure your account”, node `10059:191766`). Shipping a reusable viewer with Instagram/TikTok-familiar paging and a mock four-page sequence lets us teach security steps without inventing a new interaction model.

## What Changes

- Add a reusable **Stories viewer**: full-screen pages with top progress segments, horizontal swipe / tap-to-advance, per-page media (image or video), per-page background, optional title/body and bottom CTA stack.
- Ship mock **Secure your account** content (4 pages matching Figma: progress bars, copy, illustration/media, primary CTA).
- Auto-advance each page after **5 seconds** (progress segment fills over that dwell); user can still swipe or tap to change page earlier.
- Primary CTA stays fixed; title, body, and media slide between pages.
- Motion for paging and chrome uses existing `--motion-*` tokens; the 1s dwell/progress fill is real-time `linear` (same exception as spinners/progress).
- Reachable demo entry so the flow can be opened in the app (stub from home); no home avatar tray in this change.

## Capabilities

### New Capabilities

- `stories`: Full-screen Stories viewer mechanics (paging, progress, pause, media, background, reduced motion) and the mock Secure your account sequence as the first consumer.

### Modified Capabilities

- (none — no existing OpenSpec capabilities under `openspec/specs/`)

## Impact

- UI: new feature module under `src/features/stories/` (viewer + Secure your account content); thin home stub to open the viewer
- Motion: document story dwell as real-time progress; paging reuses springs / duration tokens (no new travel curve longer than xl)
- Assets: Figma exports for page media under the stories feature assets folder
- Patterns: immersive overlay (not nav-stack push), aligned with `specs/patterns/navigation.md` modal/overlay guidance
- Tests: pure logic for index/advance/pause; smoke render if practical
- Design reference: [Bolt Money — Secure your account](https://www.figma.com/design/puViCQQJSni8sOYM3rHRuB/Bolt-Money?node-id=10059-191766)

## Non-goals

- Home stories tray / avatar rings, or multi-publisher story rails
- Story creation / upload UI or CMS
- Backend, analytics, or persistence of “seen” state beyond optional in-session mock
- First-run product gating, account-security API actions behind CTAs (buttons may stub)
- Changing global nav stack transitions or unrelated home banners
- Per-banner story sequences (any banner opens the same Secure your account flow in v1)
