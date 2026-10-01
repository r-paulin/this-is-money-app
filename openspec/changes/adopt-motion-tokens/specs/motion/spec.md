# Spec Delta

## Purpose

Defines the Bolt Money motion scale and how this app moves: one set of duration, easing, spring, and distance tokens, iOS navigation and sheets resolved from that scale, and a project rule that no other motion values are used.

## ADDED Requirements

### Requirement: Motion uses only the defined tokens

UI motion authored in this project MUST use the shared motion tokens and nothing else. A duration, easing, spring, distance, scale, blur, or stagger that is not one of those tokens MUST NOT be introduced. The keyword `linear` is allowed only when the motion represents real time passing (spinner, loading pulse, countdown, progress, or a damped error shake). Third-party component motion that this project does not author (Kalep sheets and dialogs) is unchanged.

The standing project rule (always-applied agent rule and the agent checklist) MUST state this constraint so later work does not add raw durations or cubic-beziers.

#### Scenario: New transition

- **WHEN** a screen or component adds or changes a transition or animation
- **THEN** its duration, easing, and distance resolve from the shared motion tokens
- **AND** the stylesheet does not contain a new raw millisecond duration or a cubic-bezier that is not a token definition

#### Scenario: Real-time motion

- **WHEN** a spinner, skeleton pulse, or countdown is shown
- **THEN** it may use `linear`
- **AND** it does not use a travel ease or a spring

### Requirement: Token scale

The app MUST define the v1 scale:

- Durations: xs 100ms, sm 200ms, md 300ms, lg 400ms, xl 500ms. Nothing in the app travels longer than xl.
- Easing: standard `cubic-bezier(0.2, 0, 0, 1)`, enter `cubic-bezier(0.05, 0.7, 0.1, 1)`, exit `cubic-bezier(0.3, 0, 0.8, 0.15)`, ios `cubic-bezier(0.32, 0.72, 0, 1)`.
- Springs: smooth (visual 0.4s, bounce 0, settle 490ms), snappy (visual 0.3s, bounce 0.15, settle 340ms), bouncy (visual 0.4s, bounce 0.3, settle 450ms). Bouncy is for one confirmed-success element per screen.
- Distances: press scale 0.97, text-swap offset 4px with 2px blur and 150ms per phase, toast offset 8px, Android shared-axis offset 30px, stagger 40ms.
- Semantic nav and sheet tokens fork per platform. Android is the default. iOS uses xl + ios ease to enter and lg + ios ease to exit, for both pages and sheets.

The iOS ease MUST be reached only through the nav and sheet tokens. Components MUST use standard, enter, exit, or a spring.

#### Scenario: Boot platform

- **WHEN** the app starts in this product
- **THEN** the document root is marked as the iOS platform
- **AND** page enter resolves to 500ms with the iOS ease
- **AND** page exit resolves to 400ms with the iOS ease

### Requirement: iOS page navigation

A pushed screen MUST enter from the trailing edge and cover the previous screen. The previous screen MUST parallax to 30% of the width. Pop MUST reverse that motion. Push and pop MUST NOT share one duration. An interrupted transition MUST reverse from the current position with the exit token and MUST NOT queue a second animation. While an edge swipe is in progress, the screens MUST follow the finger with no duration; release commits or cancels with the exit spring-smooth feel already specified for drag release, using the nav exit token for the committed pop.

#### Scenario: Push

- **WHEN** the user opens a hierarchical screen
- **THEN** the incoming screen moves from fully off-screen trailing to rest over the nav enter token
- **AND** the previous screen shifts to −30% width over the same time

#### Scenario: Pop

- **WHEN** the user goes back
- **THEN** the outgoing screen leaves to the trailing edge over the nav exit token
- **AND** the screen underneath returns from −30% to rest over the same time

#### Scenario: Reduced motion navigation

- **WHEN** reduced motion is on and the user pushes or pops
- **THEN** the screens cross-fade at the sm duration with the standard ease
- **AND** they do not slide or parallax

### Requirement: Reduced motion swaps movement for a fade

When reduced motion is requested, movement MUST become a fade at the sm duration and the standard ease. Springs MUST lose overshoot and use that same fade timing. Press scale MUST become opacity 0.7 at the xs duration. Text swap MUST change the label instantly. Stagger, parallax, sparkles, and shake MUST be removed; colour and text carry the meaning. Feedback MUST NOT be deleted entirely where a fade or opacity change still applies.

#### Scenario: Dismiss under reduced motion

- **WHEN** reduced motion is on and a banner or toast leaves
- **THEN** it fades at the sm duration
- **AND** it does not scale or travel

#### Scenario: Press under reduced motion

- **WHEN** reduced motion is on and the user presses a button
- **THEN** the control drops to opacity 0.7 within the xs duration
- **AND** it does not scale

### Requirement: Press, toggle, and text change

Press feedback MUST start on pointer down at press scale 0.97 within the xs duration and the standard ease. A control that already tracks pointer up and pointer down MUST release with the snappy spring. Toggle thumbs MUST use the snappy spring. A label that changes in place MUST use the text-swap token (4px, 2px blur, 150ms per phase). Icon swap MUST fade with 2px blur at the sm duration and MUST NOT scale from a tiny start size.

#### Scenario: Button press

- **WHEN** the user presses a button and reduced motion is off
- **THEN** the button scales to 0.97 within 100ms

#### Scenario: In-place label

- **WHEN** a fee label or card-lock subtitle changes and reduced motion is off
- **THEN** the old text lifts, blurs, and fades, then the new text enters from below
- **AND** each phase lasts 150ms

### Requirement: On-screen movement and exits

Something that stays on screen (tab indicator, expand, collapse, reorder, field label) MUST use the standard ease. Something arriving (toast, menu, banner content) MUST use the enter ease or smooth spring. Something leaving for good MUST use the exit ease, one duration step shorter than the matching enter. Expand and collapse MUST animate transform and opacity, not height, width, or position. Drag MUST follow the finger with no easing; release MUST use the smooth spring.

#### Scenario: Expand a section

- **WHEN** a disclosure or date-range section opens
- **THEN** it eases with the standard curve at the md duration
- **AND** height and grid-row size are not animated

#### Scenario: Banner dismiss

- **WHEN** the user dismisses a home banner and reduced motion is off
- **THEN** the card leaves with the exit ease at the sm duration
- **AND** it does not use the iOS navigation curve

#### Scenario: Pull to refresh

- **WHEN** the user pulls to refresh
- **THEN** the content follows the finger while dragging
- **AND** release settles with the smooth spring

### Requirement: Tabs

Switching tabs MUST NOT slide the content horizontally. On iOS the content MUST cross-fade at the xs duration. A tab indicator MAY move at the md duration with the standard ease.

#### Scenario: Individual and Business

- **WHEN** the user switches recipient type
- **THEN** the form content cross-fades at the xs duration
- **AND** it does not travel with the page-navigation curve

### Requirement: Money and success moments

Balances and other money amounts MUST cross-fade at the sm duration. They MUST NOT count up, roll digits, or bounce. A confirmed success MAY use the bouncy spring on one element. Errors MUST NOT bounce. A wrong code or PIN MAY shake at the md duration, damped and linear; the colour and message still appear at the sm duration when motion is reduced. A success illustration (send-money result, statement-ready hero) MUST settle with the smooth spring over about 16px. Title, body, and actions on that screen MUST already be in place. A shared-element move (card replace) MUST use transform and opacity with the smooth spring and MUST NOT animate `left` or `top`. A full-screen exit into a result (statement creating) MUST leave with the exit ease at the lg duration.

#### Scenario: Balance updates

- **WHEN** the home balance changes and reduced motion is off
- **THEN** the amount cross-fades at the sm duration
- **AND** digits do not pop, stagger, or overshoot

#### Scenario: Statement ready

- **WHEN** a statement becomes ready and reduced motion is off
- **THEN** the illustration settles with the smooth spring
- **AND** the title and actions do not rise in after it

#### Scenario: PIN shown

- **WHEN** the PIN reminder reveals the code and reduced motion is off
- **THEN** it fades in at the sm duration with the standard ease
- **AND** it does not scale with overshoot

#### Scenario: Wrong PIN

- **WHEN** a PIN or amount is rejected and reduced motion is off
- **THEN** the field shakes once at the md duration
- **AND** the shake does not bounce past a damped return
