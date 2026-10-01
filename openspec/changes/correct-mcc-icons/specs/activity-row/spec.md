# Spec Delta

## Purpose

Keep the activity amount on the same top line as the merchant name, and color strikethrough sums with the tertiary content color.

## ADDED Requirements

### Requirement: Amount shares the merchant name's top
On an activity list row, the top of the amount MUST line up with the top of the merchant name. The amount MUST NOT sit on the vertical center of the row, and it MUST NOT sit higher than the merchant name.

#### Scenario: Two-line row
- **WHEN** a row shows a merchant name, a time underneath, and an amount
- **THEN** the amount's top edge matches the merchant name's top edge

### Requirement: Strikethrough amounts use tertiary
A struck-through amount MUST use the tertiary content color. That includes a reversal, a failed payment, and a declined payment. A missing amount stays on the secondary content color and is not struck through.

#### Scenario: Reverted amount
- **WHEN** the row is a reversal
- **THEN** the amount is struck through and uses the tertiary content color

#### Scenario: Failed amount
- **WHEN** the row is failed
- **THEN** the amount is struck through and uses the tertiary content color

#### Scenario: Declined amount
- **WHEN** the row is declined
- **THEN** the amount is struck through and uses the tertiary content color
