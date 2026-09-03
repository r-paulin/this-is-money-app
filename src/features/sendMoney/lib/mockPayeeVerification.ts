import { getIbanCountryCode } from "./iban"
import type { PayeeVerification, Recipient } from "../sendMoney.types"

const BANK_BY_COUNTRY: Record<string, string> = {
  FR: "BNP Paribas",
  DE: "Deutsche Bank",
  LV: "Swedbank",
  EE: "LHV Pank",
  LT: "SEB bankas",
  NL: "ING Bank",
  BE: "KBC Bank",
}

const STATUS_BY_RECIPIENT_ID: Record<string, PayeeVerification["status"]> = {
  "kristaps-kalnins": "PARTIAL_MATCH",
  "liga-vitola": "NOT_MATCHED",
  "sia-lmt": "UNAVAILABLE",
  "sia-latvenergo": "PARTIAL_MATCH_INCORRECT_TYPE",
}

function resolveMockBankName(iban: string): string | undefined {
  const country = getIbanCountryCode(iban)
  if (!country) return undefined
  return BANK_BY_COUNTRY[country] ?? `${country} Bank`
}

export function maskAccountName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => {
      if (part.length <= 1) return part
      const visible = part.slice(0, 1)
      const masked = "*".repeat(Math.min(3, part.length - 1))
      return `${visible}${masked}`
    })
    .join(" ")
}

function bankRecordNameForRecipient(recipient: Recipient): string {
  const parts = recipient.rawName.trim().split(/\s+/)
  if (parts.length < 2) {
    return recipient.rawName
  }

  const first = parts[0] ?? ""
  const last = parts[parts.length - 1] ?? ""
  return `${first} ${last.charAt(0).toUpperCase()}.`
}

function resolveStatus(recipient: Recipient): PayeeVerification["status"] {
  const mapped = STATUS_BY_RECIPIENT_ID[recipient.id]
  if (mapped) return mapped

  if (recipient.id.startsWith("new-")) {
    if (recipient.rawName.toLowerCase().includes("nomatch")) {
      return "NOT_MATCHED"
    }
    if (recipient.rawName.toLowerCase().includes("partial")) {
      return "PARTIAL_MATCH"
    }
    if (recipient.rawName.toLowerCase().includes("unavailable")) {
      return "UNAVAILABLE"
    }
  }

  return "FULL_MATCH"
}

/** Mock Airwallex Verify a beneficiary account (Confirmation of Payee). */
export function resolveMockPayeeVerification(recipient: Recipient): PayeeVerification {
  const status = resolveStatus(recipient)
  const resolvedBankName = resolveMockBankName(recipient.iban)

  if (status === "PARTIAL_MATCH" || status === "PARTIAL_MATCH_INCORRECT_TYPE") {
    return {
      status,
      resolvedBankName,
      maskedAccountName: maskAccountName(bankRecordNameForRecipient(recipient)),
    }
  }

  if (status === "FULL_MATCH") {
    return { status, resolvedBankName }
  }

  if (status === "UNAVAILABLE") {
    return { status }
  }

  return { status, resolvedBankName }
}
