# Spec Delta

## Purpose

Show a card payment detail screen that matches Figma Flow / Card transactions (`9640:34528`): summary with status and date, optional inline notice, Paid with / Charged on / Transaction ID / Merchant, optional Currency / Fee / Related / Cashback / Dispute sections, and a state-specific footer.

## ADDED Requirements

### Requirement: Summary shows status and date
Opening a card payment MUST show the category mark, signed amount, and subtext `{Status} · {detail date}`. Returned holds MUST use status Credited with a struck amount. Declined and failed amounts MUST be unsigned and struck. Refund pending amounts MUST use the muted credit tone.

#### Scenario: Completed payment
- **WHEN** the driver opens a captured card payment
- **THEN** the subtext starts with `Completed ·` and there is no status notice under the summary

#### Scenario: Returned hold
- **WHEN** the driver opens a returned authorization
- **THEN** the status is Credited, the amount is struck, and a notice explains the return

### Requirement: Inline notice replaces the Status row
Card detail MUST NOT show a Status list row. Pending, declined, returned, refund pending, fee, dispute, and charged-later states MUST show an inline notice under the summary with the tone and copy from the design comments.

#### Scenario: Authorization hold
- **WHEN** the driver opens a pending authorization
- **THEN** a warning notice titled Payment pending explains the reservation and return-by date

#### Scenario: Declined payment
- **WHEN** the driver opens a declined card payment with a known reason
- **THEN** a danger notice titled Declined shows one plain-language sentence for that reason

### Requirement: Transaction details rows
The Transaction details section MUST show Paid with (virtual or physical card last four), optional Charged on when clearing date differs from purchase date, a copyable Transaction ID, optional amount rows when reserved and charged differ, and Merchant with location / Also appears as rules.

#### Scenario: Charged on a later day
- **WHEN** the clearing date is a different calendar day from the purchase
- **THEN** Charged on shows the clearing timestamp

### Requirement: Optional sections
When foreign amount data is present, a Currency section MUST show paid foreign amount, rate, and that conversion fee is separate. Fee kind rows MUST show Fee details and Related payment. Refunds MUST link Related payment when an id is present. Cashback pending or received MUST appear in a Cashback section. Dispute states MUST show a Dispute section with opened date and reference.

### Requirement: Footer actions
Pending, declined, returned, fee, cashback, and dispute states MUST show Get help. Settled completed card payments without an active dispute MUST show Dispute. Actions MAY be stubs.

#### Scenario: Pending footer
- **WHEN** the driver opens a pending authorization
- **THEN** the footer is Get help and not Dispute

#### Scenario: Completed footer
- **WHEN** the driver opens a completed purchase without a dispute
- **THEN** the footer is Dispute

### Requirement: listStatus drives detail over kind alone
Refund pending MUST be Pending with a refund-pending notice even when kind is refund. Partially returned / partially charged / charged later MUST use their list statuses in the summary. Kind alone MUST NOT force Refunded when listStatus is refund_pending.

### Requirement: Merchant recognition
The merchant row MUST show the merchant name and, when a city or country is present, the location. A missing location MUST read Location unavailable. An online merchant with no physical presence MUST omit the location row. When the stored descriptor does not match the clean merchant name, the row MUST add "Also appears as:" plus that descriptor. An empty merchant name MUST fall back to Unknown merchant.

### Requirement: Hold return days
Pending return-by dates MUST use 5 days in-person, 10 days online, and 30 days for rental-class MCCs (rentals, hotels, restaurants, bars, transport).
