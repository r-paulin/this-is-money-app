# Spec Delta

## Purpose

Show each transaction with the merchant-category mark from the MCC set, including declined and the small inflow or outflow badge.

## ADDED Requirements

### Requirement: Category circle stays the mark
Every transaction mark MUST be the 40px category circle for its MCC theme, including Bolt payouts, money transfers, ATM, and cashback. A transfer, payout, or ATM MUST NOT replace that circle with a full-size arrow. An unknown code MUST use the other mark. Cashback MUST be selected only by an override and MUST NOT claim MCC codes.

#### Scenario: Ride payout
- **WHEN** the row is a ride payout, on the list or on detail
- **THEN** the mark is the green Bolt circle with the same small inflow badge a reversal already uses, never a full-size arrow

#### Scenario: Unknown code
- **WHEN** the merchant category code is not in the mapped set
- **THEN** the mark is the other category circle

### Requirement: Declined keeps the category glyph
A declined or failed transaction MUST keep the category glyph. On a list, including Home preview, that circle MUST use the neutral declined background from the MCC set, and the declined badge MUST sit at the bottom-right. The glyph MUST NOT be replaced by a standalone error icon.

#### Scenario: Declined groceries on the list
- **WHEN** a grocery payment is declined on Activity or Home
- **THEN** the mark is the grocery glyph on the neutral circle with the declined corner badge

### Requirement: Detail declined circle is white
Transaction detail MUST use the same category mark and the same corner badge as the list. A declined or failed mark on detail MUST use a white circle instead of the neutral list circle.

#### Scenario: Declined payment on detail
- **WHEN** the driver opens a declined card payment
- **THEN** the mark is the same category glyph and declined badge as the list, on a white circle

### Requirement: Inflow and outflow are corner badges
Inflow and outflow MUST stay the small bottom-right badges already shown on a reversal. Their size, outline, and arrow direction MUST NOT change. Incoming kinds (ride payout, transfer in, refund, reversal) MUST use that inflow badge. Outgoing transfer and ATM MUST use the matching outflow badge. A purchase that is not declined MUST NOT show either badge.

#### Scenario: Ride payout inflow
- **WHEN** the row is a ride payout
- **THEN** the Bolt circle shows the same inflow badge as a Hertz reversal, at the bottom-right

#### Scenario: ATM outflow
- **WHEN** the row is an ATM withdrawal
- **THEN** the money circle shows the small outflow badge at the bottom-right
