# Spec Delta

## Purpose

Defines the home Cashback promo section: grouped layout, static offer copy, decorative illustration, and “View cashback” activation matching Bolt Money Figma `9527:203981`.

## ADDED Requirements

### Requirement: Cashback section on home

The home screen SHALL include a Cashback section rendered as a white grouped card on `layer/floor-0-grouped`, with an 8px section separator below the card. The section SHALL appear after the Cards section and before the legal footer unless a later Figma home composition update specifies a different order.

#### Scenario: Section visible on home

- **WHEN** the user opens the home screen
- **THEN** a Cashback section is visible in the scrollable home stack
- **AND** the section uses the same grouped-card chrome pattern as other home sections (white card, rounded corners, floor-0-grouped gutters)

### Requirement: Section header

The Cashback section SHALL show a section header titled “Cashback” using Heading XS Accent and `content/primary`.

#### Scenario: Header copy

- **WHEN** the Cashback section is rendered
- **THEN** the heading text is exactly “Cashback”
- **AND** the heading is visually emphasized with the design-system semibold heading style

### Requirement: Promo row content

The section SHALL contain a single list row with no item separator. The start-side content SHALL include, in order:

1. Primary title: “Earn cashback when you spend” (Body L Accent, `content/primary`)
2. Secondary offer: “1% back on settled fuel and EV charging payments over €1” (Body S Regular, `content/secondary`)
3. CTA label: “View cashback” (Body M Compact Accent, action/link primary semantic color)

The end side SHALL show the decorative “Car with Coins” illustration. The illustration MUST be decorative (`alt=""` or equivalent) and MUST NOT be the only carrier of the offer meaning.

#### Scenario: Default promo composition

- **WHEN** the Cashback section is rendered
- **THEN** the three text lines and the car-with-coins illustration are all visible
- **AND** the CTA text uses the semantic action/link primary color, not a raw hex

#### Scenario: Decorative illustration

- **WHEN** assistive technology reads the row
- **THEN** the illustration is skipped or announced as empty decorative media
- **AND** the accessible name includes the offer title and CTA intent

### Requirement: View cashback activation

Activating the promo row (or an equivalent dedicated control covering the same action) SHALL invoke the cashback entry stub. Until a cashback destination screen exists, activation MUST NOT navigate away via the hierarchical nav stack; it MAY log a stub or no-op that can later open a real destination.

#### Scenario: User activates View cashback

- **WHEN** the user activates the Cashback promo row
- **THEN** the cashback entry action runs
- **AND** the home screen remains the active hierarchical screen

### Requirement: Static mock content

Cashback copy and the illustration SHALL be local/static for this change. The system MUST NOT require a remote cashback API to render the section.

#### Scenario: Offline / no API

- **WHEN** no cashback backend is available
- **THEN** the section still renders with the Figma mock copy and local asset
