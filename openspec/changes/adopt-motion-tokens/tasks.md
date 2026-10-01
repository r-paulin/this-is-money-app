# Tasks

## 1. Tokens and the project rule

- [x] 1.1 Add the v1 motion block to `src/shared/styles/tokens.css`: durations, the four eases, the three pre-sampled springs and their settle durations, press scale, offsets, blur, text-swap duration, stagger, Android-default nav/sheet tokens, `[data-platform="ios"]` overrides, and the `prefers-reduced-motion` overrides from the guidance. Verify the custom properties exist by searching `tokens.css` for `--motion-duration-xl` and `--motion-ease-ios`.
- [x] 1.2 Set `document.documentElement.dataset.platform = "ios"` in `src/main.tsx` before the app renders. Verify the root element has `data-platform="ios"` after load.
- [x] 1.3 Document the tokens in `specs/tokens/token-reference.md`. Add `.cursor/rules/motion.mdc` (`alwaysApply: true`) stating that authored motion uses only these `--motion-*` tokens, that `linear` is only for real-time motion and the damped shake, that `--nav-parallax: 30%` is the navigation spatial constant, and that the iOS ease is only reached through `--motion-nav-*` and `--motion-sheet-*`. Add the same constraint as a short bullet in `AGENTS.md` and a pointer in `.cursor/rules/design-system.mdc`. Verify the rule file is always-applied and names `tokens.css`.

## 2. iOS navigation

- [x] 2.1 In `src/shared/styles/navigation.css`, drive push from `--motion-nav-enter-duration` / `--motion-nav-enter-ease` and pop from the exit pair; set `--nav-parallax` to `30%`; under reduced motion, fade both the top and below layers at `--motion-duration-sm` and `--motion-ease-standard` with no slide. Verify push and pop no longer share one duration variable.
- [x] 2.2 In `src/shared/navigation/useEdgeSwipeBack.ts`, set `parallaxRatio` to `0.3`. In `src/shared/navigation/NavigationStack.tsx`, change the reduced-motion completion timeout from 150ms to 200ms, and on swipe commit or cancel continue from the current drag offset with the nav exit token instead of restarting the pop at rest. Verify a partial swipe does not jump back to 0 before the pop finishes.
- [x] 2.3 Update the transition spec in `.cursor/rules/ios-navigation.mdc` and the quick reference in `specs/patterns/navigation.md` to push 500ms, pop 400ms, the nav token eases, parallax 30%, and a reduced-motion cross-fade at sm. Verify the old 350ms and 33% figures are gone from those files.

## 3. Shared primitives

- [x] 3.1 Point the injected CSS in `src/shared/components/TextSwap.tsx` and `src/shared/styles/icon-swap.css` at the tokens (text swap unchanged in feel; icon swap sm + standard, 2px blur, no 0.25 scale). Verify reduced motion still changes the label instantly and icon swap has no `scale(0.25)`.
- [x] 3.2 Retoken `src/shared/styles/text-stagger.css` to md + enter, 8px, 40ms, no blur; reduced motion shows the final text immediately. Retoken `src/shared/components/SkeletonReveal/skeleton-reveal.css` reveal to standard ease; leave the pulse `linear`. Verify stagger no longer uses `cubic-bezier(0.22, 1, 0.36, 1)`.
- [x] 3.3 Change `src/shared/components/NumberPopIn.tsx` so amount and digit changes cross-fade at sm + standard, with no travel, overshoot, or digit stagger. Verify `HomeHeader`, `AnimatedBalanceAmount`, and `PinReminderContent` still render the value and no longer run `t-digit-pop-in` with an overshoot curve.
- [x] 3.4 In `src/index.css`, set global press to `var(--motion-press-scale)` over xs + standard, and under reduced motion use opacity 0.7 at xs instead of scale. In `src/shared/components/InlineLabelTextField/inline-label-text-field.css` and `src/shared/components/PaymentCard/payment-card.css`, use sm or xs + standard and a reduced-motion fade instead of `transition: none`. Update the motion sentence in `specs/patterns/text-field.md`. Verify the iOS curve is gone from the field and card styles.
- [x] 3.5 In `src/shared/components/PullToRefresh/pull-to-refresh.css`, settle release with the smooth spring, keep drag at `transition: none`, and exit the pill with the exit ease one step shorter. Reduced motion fades instead of clearing the transition. Verify the 320ms and 250ms literals are gone.

## 4. Feature surfaces

- [x] 4.1 Home banner dismiss in `src/features/home/components/home-banner.css`: sm + exit, opacity only, no 0.96 scale; reduced motion fades at sm. Card replace in `src/features/home/card-replace-fly-in.css` and `src/features/home/components/CardReplaceFlyIn.tsx`: smooth spring on transform and opacity from the measured delta, no `left`/`top` animation, no 550ms literal. Verify dismiss does not use the iOS curve and the replaced card still lands in its slot.
- [x] 4.2 Send money: `send-money-amount.css` (colour at xs/sm + standard, shake md linear damped, reference row md + standard on transform and opacity), `send-money-review.css` (toggle thumb spring-snappy, no iOS curve), `send-money-result.css` (video enters with the smooth spring, about 16px), `recipient-type-tabs.css` (content cross-fades at xs + standard; stop reading `--nav-duration`). Verify the form no longer slides on the nav curve.
- [x] 4.3 Statements and PIN: `statement-creating.css` exits at lg + exit with opacity and `--motion-offset-md`; `statement-ready.css` settles the hero with the smooth spring and shows title and actions without a delayed rise; `custom-date-rows.css` stops animating `grid-template-rows` and uses md + standard on transform and opacity; `pin-reveal.css` fades at sm + standard with no scale overshoot. Verify none of these files still use a duration above 500ms or an overshoot cubic-bezier.
- [x] 4.4 Leave `src/features/cardControls/components/card-controls-shimmer.css` as a `linear` loop with its existing reduced-motion off switch. Verify it does not gain a travel ease.

## 5. Audit

- [x] 5.1 Extend `scripts/token-audit.ts` to fail on `cubic-bezier(` outside `src/shared/styles/tokens.css`. Verify `npm run token-audit` passes and that a temporary cubic-bezier in another CSS file would fail.
- [x] 5.2 Run `npm test`, `npm run build`, and `npm run lint`. Verify they pass. In the running app, push and pop a screen, dismiss a banner, and update the home balance, including with reduced motion preferred, and confirm those three match the spec (split nav timing, fade dismiss, balance cross-fade).
