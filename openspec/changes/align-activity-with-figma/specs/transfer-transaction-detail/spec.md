# Spec Delta

## Purpose

Show transfer and payout detail screens that match Figma Flow / Transfer details (`7961:112407`): one layout, phase-specific banner and footer, Recipient/Sender, Send again when completed outbound, and copyable Transfer ID.

## ADDED Requirements

### Requirement: Transfer phases
A transfer detail MUST resolve a phase: completed, processing, delayed, or returned. Processing maps from on_the_way / PROCESSING-SENT style states. Delayed maps from overdue / SLA timeout. Returned maps from an explicit returned phase or returned list status.

#### Scenario: Completed transfer
- **WHEN** the driver opens a completed outbound transfer
- **THEN** there is no phase notice, Send again is shown, and the footer is Download receipt then Get help

#### Scenario: Processing transfer
- **WHEN** the driver opens a processing transfer
- **THEN** a warning notice titled Processing shows the expected arrival copy, Send again is hidden, and the footer is Get help only

#### Scenario: Delayed transfer
- **WHEN** the driver opens a delayed transfer
- **THEN** a warning notice explains the transfer is taking longer without a second ETA, and the footer is Get help only

#### Scenario: Returned transfer
- **WHEN** the driver opens a returned transfer
- **THEN** a danger notice asks to check recipient details, optional You sent and Returned to you sections render when provided, and the footer is Get help only

### Requirement: Summary and party block
The summary MUST show amount and `{Status} · {detail date}`. Outbound transfers MUST label the party block Recipient with masked IBAN and bank name. Inbound transfers MUST label it Sender and MUST NOT show Send again.

### Requirement: Transfer details rows
Transfer details MUST include Reference, Date, copyable Transfer ID, Amount, Fee, and Total. Cross-currency rows MAY appear when provided on the transaction.

### Requirement: Payout detail
A ride payout MUST use the payout variant with Sender, Transfer details, Completed · date summary, and Get help footer.
