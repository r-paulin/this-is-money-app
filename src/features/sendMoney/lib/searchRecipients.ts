import type { Recipient, RecipientSearchResult } from "../sendMoney.types"
import { formatIbanTruncated, isValidIban, normalizeIban } from "./iban"
import { compareRecipients } from "./scoreRecipients"
import { getNameMatchTier } from "./highlightMatch"

function queryHasDiacritics(query: string): boolean {
  return /\p{M}/u.test(query.normalize("NFD"))
}

type RankedRecipient = {
  recipient: Recipient
  tier: number
}

function rankNameMatches(
  recipients: Recipient[],
  query: string,
  now: number,
): RankedRecipient[] {
  const stripDiacritics = !queryHasDiacritics(query)
  const ranked: RankedRecipient[] = []

  for (const recipient of recipients) {
    const tier = getNameMatchTier(recipient.rawName, query, stripDiacritics)
    if (tier != null) {
      ranked.push({ recipient, tier })
    }
  }

  ranked.sort((a, b) => {
    if (a.tier !== b.tier) {
      return a.tier - b.tier
    }
    return compareRecipients(a.recipient, b.recipient, now)
  })

  return ranked
}

function findIbanMatches(recipients: Recipient[], query: string): Recipient[] {
  const normalizedQuery = normalizeIban(query)
  return recipients.filter((recipient) => {
    const normalizedIban = normalizeIban(recipient.iban)
    return normalizedIban.includes(normalizedQuery)
  })
}

export function searchRecipients(
  recipients: Recipient[],
  query: string,
  now = Date.now(),
): RecipientSearchResult {
  const trimmed = query.trim()

  if (!trimmed) {
    return {
      recipients: [],
      addRowVariant: "default",
    }
  }

  if (isValidIban(trimmed)) {
    const normalized = normalizeIban(trimmed)
    const matches = recipients.filter(
      (recipient) => normalizeIban(recipient.iban) === normalized,
    )

    if (matches.length > 0) {
      return {
        recipients: matches.sort((a, b) => compareRecipients(a, b, now)),
        addRowVariant: "default",
      }
    }

    return {
      recipients: [],
      addRowVariant: "send-to-iban",
      addRowPrefill: normalized,
      ibanFormatted: formatIbanTruncated(normalized),
    }
  }

  const nameMatches = rankNameMatches(recipients, trimmed, now)
  const ibanFragmentMatches = findIbanMatches(recipients, trimmed).filter(
    (recipient) => !nameMatches.some((match) => match.recipient.id === recipient.id),
  )

  const tierThree = ibanFragmentMatches.map((recipient) => ({
    recipient,
    tier: 3,
  }))

  const combined = [...nameMatches, ...tierThree]
  const uniqueRecipients = combined.filter(
    (item, index, array) =>
      array.findIndex((entry) => entry.recipient.id === item.recipient.id) === index,
  )

  if (uniqueRecipients.length === 0) {
    return {
      recipients: [],
      addRowVariant: "no-results",
      addRowPrefill: trimmed,
    }
  }

  return {
    recipients: uniqueRecipients.map((item) => item.recipient),
    addRowVariant: "default",
  }
}
