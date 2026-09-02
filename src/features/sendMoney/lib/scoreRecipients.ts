import type { Recipient } from "../sendMoney.types"
import { RECIPIENT_RETENTION_DAYS } from "../sendMoney.types"

const MS_PER_DAY = 1000 * 60 * 60 * 24

export function isRecipientEligible(recipient: Recipient, now = Date.now()): boolean {
  const daysSince = (now - recipient.lastTransferredAt) / MS_PER_DAY
  return daysSince <= RECIPIENT_RETENTION_DAYS
}

export function scoreRecipient(recipient: Recipient, now = Date.now()): number {
  const daysSince = Math.max(0, (now - recipient.lastTransferredAt) / MS_PER_DAY)
  const recencyScore = Math.max(0, 1 - daysSince / RECIPIENT_RETENTION_DAYS)
  const freq90Score = Math.min(recipient.transferCount90d / 12, 1)
  const freq365Score = Math.min(recipient.transferCount365d / 24, 1)
  const amountScore = Math.min(recipient.averageAmountCents / 50_000, 1)

  return (
    0.4 * recencyScore +
    0.3 * freq90Score +
    0.2 * freq365Score +
    0.1 * amountScore
  )
}

export function compareRecipients(a: Recipient, b: Recipient, now = Date.now()): number {
  const scoreDiff = scoreRecipient(b, now) - scoreRecipient(a, now)
  if (scoreDiff !== 0) {
    return scoreDiff
  }

  const recencyDiff = b.lastTransferredAt - a.lastTransferredAt
  if (recencyDiff !== 0) {
    return recencyDiff
  }

  return b.averageAmountCents - a.averageAmountCents
}

export function getDefaultRecipients(
  recipients: Recipient[],
  now = Date.now(),
  limit = 10,
): Recipient[] {
  return recipients
    .filter((recipient) => isRecipientEligible(recipient, now))
    .sort((a, b) => compareRecipients(a, b, now))
    .slice(0, limit)
}
