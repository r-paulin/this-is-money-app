# Design

## Context

See proposal.md for why. Motion values are local today: `--nav-duration: 350ms` and `--nav-ease: cubic-bezier(0.32, 0.72, 0, 1)` in `navigation.css` (push and pop share them; parallax is 33%), the same iOS curve copied onto fields, banners, cards, and pull-to-refresh, and a second transitions.dev curve `cubic-bezier(0.22, 1, 0.36, 1)` on statement screens, stagger, shake, and digit pop-in. `tokens.css` is imported from `index.css` and has no motion section. Reduced motion usually sets `transition: none` / `animation: none`. `useEdgeSwipeBack` hardcodes `parallaxRatio = 0.33`. Reduced-motion nav completion is a 150ms timeout in `NavigationStack.tsx` because the fade does not reliably end the stack transition. Recipient type tabs read `--nav-duration` / `--nav-ease`, so they are coupled to page navigation.

## Goals / Non-Goals

**Goals:**

- One token block, copied from motion guidance v1, that every authored transition reads.
- iOS resolution at boot, with push and pop on the forked nav tokens.
- A standing rule plus an audit check so later changes cannot add another cubic-bezier.

**Non-Goals:**

- See proposal.md. Also: no velocity-based swipe physics beyond continuing from the current drag offset, and no new press-gesture helper.

## Decisions

### Tokens live in `tokens.css`

Add the guidance’s `:root` motion block, the `[data-platform="ios"]` overrides, and the `prefers-reduced-motion` overrides to `src/shared/styles/tokens.css`. Document them in `specs/tokens/token-reference.md`.

Alternative: a new `motion.css`. Rejected because new tokens already belong in `tokens.css`, which is imported globally. No second entry point.

Copy the pre-sampled `linear()` spring strings from the guidance. Do not resample them.

### This app always resolves iOS

Set `document.documentElement.dataset.platform = "ios"` once at boot (`src/main.tsx`), before paint. Do not sniff the user agent. Android values stay in `:root` as the guidance’s default and are unused here.

### Navigation reads the forked tokens

In `navigation.css`, set duration and ease from direction:

- `data-direction="push"` → `--motion-nav-enter-duration` / `--motion-nav-enter-ease`
- `data-direction="pop"` → `--motion-nav-exit-duration` / `--motion-nav-exit-ease`

Keep the existing keyframes (incoming from 100%, outgoing to 100%). Change `--nav-parallax` from `33%` to `30%`, and `useEdgeSwipeBack`’s `parallaxRatio` from `0.33` to `0.3`.

The 30% parallax is the iOS spatial model from the guidance, not a duration or ease. It stays a nav constant (`--nav-parallax`). It is not a new motion token and it is not a free value for other components.

Reduced motion: both the top and below layers fade (`--motion-duration-sm`, `--motion-ease-standard`). No slide, no parallax. Bump the `NavigationStack` reduced-motion completion timeout from 150ms to 200ms so it matches sm.

Swipe commit already calls `pop()` after the finger sets inline transforms. Those inline transforms are cleared when dragging ends, which restarts the pop keyframes from rest. On commit, leave the dragged translation in place and run the pop from that offset with the nav exit token, instead of restarting at 0. Cancel (swipe released under the commit threshold) returns with the same exit token. While dragging, transforms stay duration-less, as they are now.

Recipient tabs must stop reading `--nav-duration`. After this split, that variable would follow whatever direction the stack last used.

### Press stays one CSS transition

Global `:active` in `index.css` becomes `scale(var(--motion-press-scale))` over `--motion-duration-xs` and `--motion-ease-standard`. A single CSS transition cannot use a different curve on release. No component tracks pointer-down and pointer-up separately today, so do not add a press helper. Toggle thumbs (the trusted-contact switch in `send-money-review.css`) use `--motion-spring-snappy` for the thumb travel.

Under reduced motion the token block sets `--motion-press-scale: 1`. The global rule must also fade to opacity 0.7 at xs, because scale 1 alone removes the feedback.

### Retoken by reading variables

Each call site drops its literal duration and cubic-bezier and uses the token named in `specs/motion/spec.md`. Practical mappings that are easy to get wrong:

| Place | Token |
|---|---|
| Field label, payment-card fade, colour | sm or xs + standard. Colour/opacity state is xs; a small fade that is not a press is sm. |
| Icon swap | sm + standard, 2px blur, no start scale |
| Text stagger | md + enter, 8px, 40ms. Drop the 3px blur. Reduced motion: show the final text immediately (stagger is removed, not faded). |
| Text swap | already 150ms / 4px / 2px. Point the injected CSS at the tokens. Reduced motion: the existing instant path stays. |
| Expand/collapse, including date rows | md + standard on transform and opacity. Remove the `grid-template-rows` transition. |
| Banner dismiss | sm + exit, opacity. Drop scale 0.96. |
| Pull-to-refresh release | smooth spring. Drag keeps `transition: none`. Pill exit: exit ease, one step shorter than the enter. |
| Recipient form switch | content cross-fades at xs + standard. Do not add a sliding indicator; the underline is already per selected tab. |
| Amount / PIN shake | md, `linear`, damped. Colour at sm + standard. Reduced motion: no shake. |
| Balance and PIN digits (`NumberPopIn`) | opacity cross-fade at sm + standard. Remove the overshoot curve, 8px travel, and 70ms digit stagger. |
| PIN reminder chrome | sm + standard fade. Remove the scale overshoot. |
| Statement-ready hero | smooth spring, about 16px. Actions and title are visible without a delayed rise. |
| Statement creating exit | lg + exit, opacity and a short offset (`--motion-offset-md`), not a 28% drop over 620ms. |
| Send-money result video | smooth spring, about 16px. |
| Card-replace fly-in | smooth spring on `transform` and opacity. Measure the delta and animate `translate`, not `left` / `top`. Drop the separate 0.98 scale keyframe and the 550ms literal. |
| Skeleton reveal | lg is already 400ms; ease becomes standard. Pulse stays `linear`. |
| Card-controls shimmer | stays a `linear` loop. Reduced motion already disables it. |

`linear` remains legal for those loops, the shake, and spinners. It is the one non-token timing function, and only for real time or a damped shake.

### Project rule

Add `.cursor/rules/motion.mdc` with `alwaysApply: true`. It tells agents: authored motion uses the `--motion-*` tokens in `tokens.css` only; `linear` only for real-time motion and the damped shake; `--nav-parallax: 30%` is the navigation spatial constant, not a pattern to copy; the iOS ease is only via `--motion-nav-*` and `--motion-sheet-*`. Add the same constraint as a short bullet in `AGENTS.md` and a pointer in `.cursor/rules/design-system.mdc`.

Extend `scripts/token-audit.ts` to fail on `cubic-bezier(` outside `src/shared/styles/tokens.css`. That is the check that stops a new ease from landing. Do not try to ban every `Nms` literal; loading loops are allowed to keep a literal duration with `linear`, and the rule file covers the rest.

Update the durations in `.cursor/rules/ios-navigation.mdc` (push xl / pop lg, ease via the nav tokens, parallax 30%, reduced-motion fade at sm) and the field sentence in `specs/patterns/text-field.md`.

## Risks / Trade-offs

- [Nav feels slower] Push goes from 350ms to 500ms, pop to 400ms. → That is the guidance. Do not split the difference.
- [Date rows change shape] Stopping `grid-template-rows` animation means the row opens in layout and the content fades. → Required by “do not animate height.” Keep the open and closed states; only the interpolation changes.
- [Card-replace flight is harder than a class swap] `left`/`top` is how the overlay is positioned today. → Translate from the measured start rect to the measured end rect. If the measurement is wrong, the card will miss the slot; verify that path in the browser.
- [Injected style tags] `TextSwap` and `NumberPopIn` write a `<style>` at runtime. → Point those strings at the global tokens so reduced-motion overrides in `tokens.css` still apply. Do not duplicate the token values inside the string.
- [Audit false positives] A comment that mentions `cubic-bezier` would fail. → Match the function call, and keep the only definition in `tokens.css`.
- [Kalep sheets still use their own motion] Sheet tokens will exist and nothing in the app will read them yet. → Called out in the rule so nobody “fixes” Kalep by wrapping it in a second animation.

## Migration Plan

Land tokens and the project rule first, then retoken call sites, then the audit. The audit cannot be turned on before the cubic-beziers are gone. Rollback is reverting the change; there is no persisted data.

## Open Questions

None. Surface behavior is in `specs/motion/spec.md`.
