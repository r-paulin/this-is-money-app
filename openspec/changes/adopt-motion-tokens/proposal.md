# Proposal

## Why

Motion in the app is a set of local durations and cubic-beziers, mostly from transitions.dev, with the iOS interactive curve reused on components that should not use it. Bolt Money motion guidance v1 defines one shared scale (durations, eases, springs, distances, and platform forks). Screens should move on that scale, and new work should not invent another.

## What Changes

- Add the v1 motion tokens (durations, easing, springs, distances, platform-forked nav/sheet tokens, reduced-motion overrides) as the only motion values in the app.
- Retoken existing transitions onto those tokens, including iOS navigation (push and pop split) and the delight sequences (balance, statement ready, PIN reveal, send-money result, card replace).
- Replace reduced-motion behavior that deletes animation with the guidance’s swap: movement becomes a fade, except stagger, parallax, and shake, which are removed.
- **BREAKING** for any caller that depends on digit pop-in, a shared 350ms nav duration, or the iOS curve on non-navigation UI.
- Add a standing project rule: UI motion uses only these tokens. No new raw durations, cubic-beziers, or one-off easings.

## Capabilities

### New Capabilities

- `motion`: Shared motion tokens, how each existing surface uses them, reduced-motion swaps, and the rule that no other motion values are allowed.

### Modified Capabilities

- (none — `openspec list --specs` is empty)

## Impact

- Tokens and global press: `src/shared/styles/tokens.css` (or a stylesheet it imports), `src/index.css`
- Navigation: `src/shared/styles/navigation.css`, `src/shared/navigation/useEdgeSwipeBack.ts`, nav duration readers
- Shared primitives: `TextSwap.tsx`, `icon-swap.css`, `text-stagger.css`, `NumberPopIn.tsx`, `SkeletonReveal/skeleton-reveal.css`, `InlineLabelTextField`, `PaymentCard`, `PullToRefresh`
- Features: home banner dismiss, card-replace fly-in, animated balance, send-money amount/review/result/tabs, statement creating/ready, PIN reveal, card-controls shimmer (loop only)
- Docs and agent rules: `specs/patterns/text-field.md`, `specs/patterns/navigation.md` if present, `.cursor/rules/ios-navigation.mdc`, a new always-applied motion rule, `AGENTS.md`
- Kalep sheet and dialog motion stays as shipped by the library; the sheet tokens exist for our own overlays

## Non-goals

- Building the Android shared-axis navigation. Android values exist as the default token fork; this app sets `data-platform="ios"` at boot.
- Replacing Kalep modal, sheet, or dialog motion.
- Adding Motion (motion.dev / framer-motion) or any new dependency. Springs are the pre-sampled CSS `linear()` timings from the guidance.
- New delight that does not exist today (cashback sparkles, a success check that is not already on screen).
- Changing what an interaction does, only how it moves.
