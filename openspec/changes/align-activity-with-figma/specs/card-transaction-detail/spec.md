# Spec Delta

## Purpose

Show a card payment as a settled record whose status matches what actually happened to the money.

## ADDED Requirements

### Requirement: Detail follows the transaction kind
Opening a card payment MUST show a summary (category mark, amount, timestamp) and a Transaction details section with card, merchant, and status, plus Get help. The status MUST come from the transaction kind. A declined, failed, pending authorization, reversal, or refund MUST NOT be labeled Completed.

#### Scenario: Declined payment
- **WHEN** the driver opens a declined card payment
- **THEN** the status is Declined and is not Completed

#### Scenario: Authorization hold
- **WHEN** the driver opens an authorization that has not been captured
- **THEN** the status is Pending

### Requirement: Status copy
Completed MUST show the status with no extra description. Pending MUST say the merchant has placed a hold and include the date the hold will be released if the merchant does not collect the payment. Reversal MUST use the status Hold released and say that no money was taken. Refund MUST use the status Refunded and say the merchant refunded the payment. The summary mark MUST follow the same category-icon rules as the Activity row.

#### Scenario: Completed payment
- **WHEN** the driver opens a captured card payment
- **THEN** the status is Completed and no explanatory sentence is shown under it

#### Scenario: Reversal
- **WHEN** the driver opens a reversal
- **THEN** the status is Hold released and the description says no money was taken

#### Scenario: Refund
- **WHEN** the driver opens a refund
- **THEN** the status is Refunded and the description says the merchant refunded the payment

### Requirement: Decline reasons stay plain
A declined payment that includes a known reason MUST show one non-technical sentence for that reason. The known reasons are insufficient funds, inactive or closed card, expired card, suspected fraud, transaction not allowed, velocity limit, amount limit, blocked merchant category, blocked region, invalid card details, issuer unavailable, technical issue, and failed cardholder verification. An unknown or missing reason MUST still show Declined without inventing a cause.

#### Scenario: Insufficient funds
- **WHEN** the decline reason is insufficient funds
- **THEN** the description says there was not enough balance to complete the payment

#### Scenario: Unknown reason
- **WHEN** a declined payment has no mapped reason
- **THEN** the status is Declined and no guessed explanation is shown

### Requirement: Merchant recognition
The merchant row MUST show the merchant name and, when a city or country is present, the location. A missing location MUST read Location unavailable. An online merchant with no physical presence MUST omit the location row. When the stored descriptor does not match the clean merchant name, the row MUST add "Also appears as:" plus that descriptor. An empty merchant name MUST fall back to Unknown merchant.

#### Scenario: Missing location
- **WHEN** a card payment has a merchant name and no location
- **THEN** the location reads Location unavailable

#### Scenario: Cryptic descriptor
- **WHEN** the acquirer descriptor differs from the clean merchant name
- **THEN** the merchant row includes "Also appears as:" and the descriptor
