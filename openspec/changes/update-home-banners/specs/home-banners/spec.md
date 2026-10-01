# Spec Delta

## Purpose

Defines home promo banner section and card behavior: layout, copy truncation, media, activation, dismiss, empty/error handling, and RTL, matching the Bolt Money Figma Section / Banners system.

## ADDED Requirements

### Requirement: Banner section layout

The home screen SHALL render eligible banners inside a section with background `layer/floor-0-grouped` and no corner radius. Each banner card SHALL use background `layer/floor-1` by default (or a configured semantic background token), corner radius `dimension/300`, and a hairline border from a design-system border token. Card height SHALL be at least 92px and grow with copy up to a three-line body clamp.

#### Scenario: Single visible banner

- **WHEN** exactly one eligible banner is visible
- **THEN** the card is full width of the section content area
- **AND** section padding is `dimension/600` horizontal and `dimension/300` vertical
- **AND** pagination dots are not shown

#### Scenario: Multiple visible banners

- **WHEN** two or more eligible banners are visible
- **THEN** banners appear in one horizontal non-wrapping row with gap `dimension/300`
- **AND** section padding is `dimension/600` horizontal, `dimension/300` top, and `dimension/600` bottom
- **AND** centered pagination dots appear 8px below the cards (active 24×8 using `bg-active/neutral-secondary`, inactive 8×8 using `bg/neutral-secondary`, gap `dimension/100`)

#### Scenario: Equalized carousel height

- **WHEN** multiple banners are shown and copy lengths differ
- **THEN** all cards in the row stretch to the tallest card
- **AND** body text remains capped at three lines with ellipsis

### Requirement: Banner card content layout

Each banner card SHALL place body text on the start side and media on the end side, with the close control at the top end. Card padding-inline-start SHALL be `dimension/300`; media SHALL sit flush to the end and bottom edges and be 100px wide with end-side radii `dimension/300`. Body text SHALL use Body M compact styling and `content/primary`, with vertical padding `dimension/400` on the text block. Short one-line copy SHALL still occupy the 92px minimum height without stretching media to fill leftover space.

#### Scenario: Default card composition

- **WHEN** a banner with body and media is rendered
- **THEN** text appears on the start side and media on the end side
- **AND** the close control appears at the top end of the card
- **AND** the card is at least 92px tall

### Requirement: Body copy and truncation

Banner body SHALL be a single string composed of text segments that may mark limited bold emphasis on the lead sentence or key benefit only. The system MUST NOT support italics, inline links, or color/size changes inside the body. Body text SHALL clamp to a maximum of three lines with an ellipsis. The accessible name for the card SHALL be the full untruncated string. Bold emphasis MUST NOT be the only carrier of meaning. Callers MAY interpolate dynamic values (amount, date) before render; copy MUST remain valid under the three-line cap when those values are long.

#### Scenario: Long body truncates visually

- **WHEN** the banner body exceeds three lines at the rendered width
- **THEN** the visible text truncates with an ellipsis after three lines
- **AND** assistive technology can access the full untruncated string

#### Scenario: Bold segments only

- **WHEN** body content includes bold segments
- **THEN** only those segments render with bold weight
- **AND** no other inline styles (italic, link, color, size) are applied

### Requirement: Decorative media

Each publishable banner MUST include a media asset: a static image or a muted looping video. Lottie MUST NOT be supported. Media is decorative and MUST be hidden from assistive technology. Video SHALL pause when the banner slide is off-screen. When `prefers-reduced-motion` is enabled, when save-data is preferred, or when the video codec is unsupported, the system SHALL show a static frame instead of playing video. Media MUST NOT be the sole carrier of information that is not also present in the body text.

#### Scenario: Video off-screen

- **WHEN** a banner with video scrolls out of the carousel viewport
- **THEN** playback pauses

#### Scenario: Reduced motion

- **WHEN** the user prefers reduced motion and the banner media is video
- **THEN** a static frame is shown instead of looping playback

### Requirement: Media load failures

If primary media fails to load, the system SHALL attempt a local placeholder image. If the placeholder also fails, the system SHALL omit the media slot and expand body text to the full card width. The system MUST NEVER show a broken-image indicator.

#### Scenario: Primary media fails, placeholder succeeds

- **WHEN** the primary media URL fails to load and a placeholder is available
- **THEN** the placeholder image is shown in the media slot

#### Scenario: All media fails

- **WHEN** primary media and placeholder both fail
- **THEN** the media slot is omitted
- **AND** body text expands to full card width
- **AND** no broken-image UI is shown

### Requirement: Background colour tokens

Each banner MAY specify a background colour via a design-system token (default `layer/floor-1`, including semantic tints such as a failure tint). Background values MUST use tokens, not raw hex. Text-to-background contrast of at least 4.5:1 is a content/review obligation; the component is not required to compute contrast at runtime.

#### Scenario: Custom background token

- **WHEN** a banner specifies a semantic background token
- **THEN** the card uses that token for its background

### Requirement: Card activation and close

The whole banner card SHALL be activatable and open the banner destination. The close control SHALL sit at the top end with a solid `layer/floor-1` circular fill so it remains visible over media. The close hit target SHALL be 32×32. Taps inside the close target SHALL dismiss the banner; taps elsewhere on the card SHALL activate the destination and MUST NOT dismiss.

#### Scenario: Activate destination

- **WHEN** the user activates the card outside the close hit target
- **THEN** the banner destination action runs
- **AND** the banner remains visible until separately dismissed

#### Scenario: Dismiss via close

- **WHEN** the user activates the close hit target
- **THEN** that banner is dismissed
- **AND** the destination action does not run

### Requirement: Per-banner dismiss

Dismissal SHALL be per banner and optimistic (UI updates immediately). This change keeps dismiss state in session memory. Persisted re-show rules (“show once” or “show {X} times per period”) are out of scope until parameters are defined.

#### Scenario: Dismiss one of many

- **WHEN** the user dismisses one banner while others remain eligible
- **THEN** only the dismissed banner is removed from the carousel
- **AND** remaining banners stay visible

### Requirement: Empty and failed content

When zero eligible banners remain (including after the last dismiss) or when banner content fails to load, the system SHALL omit the entire banner section including its padding. The system MUST NOT show a skeleton or error state for a failed promo. Errors from an unavailable destination SHALL surface in the opened flow, not on the banner itself.

#### Scenario: Last banner dismissed

- **WHEN** the user dismisses the last visible banner
- **THEN** the banner section and its padding are removed from the home layout

#### Scenario: Content fetch failure

- **WHEN** banner content fails to load
- **THEN** no banner section is rendered
- **AND** no skeleton or error message is shown for the promo

### Requirement: RTL layout

In right-to-left locales, the banner layout SHALL mirror: text and media swap via logical start/end edges, and the close control moves to the top start.

#### Scenario: RTL close placement

- **WHEN** the locale direction is RTL
- **THEN** the close control is positioned at the top start of the card
- **AND** media sits on the end side relative to the writing direction

### Requirement: Existing banner identity migration

Existing home banner ids SHALL continue to be selectable via the current mock list and eligibility rules. Their copy SHALL map into the new body-segment model (prior title as bold lead, prior body as following text). Card activation replaces the previous visible CTA. Shared single artwork across all ids MUST be replaced by per-banner media in the content model.

#### Scenario: Known id still dismissible

- **WHEN** an existing banner id such as `GoogleWallet` is visible and the user dismisses it
- **THEN** that id is removed for the session
- **AND** other eligible ids remain subject to the same eligibility filter as before
