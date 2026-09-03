import type { PayeeVerificationStatus } from "../sendMoney.types"

export type ReviewBannerKind =
  | "none"
  | "trust"
  | "cop-warning"
  | "cop-danger"
  | "name-confirmed"

export type ReviewCtaMode = "confirm" | "edit-and-send"

export interface ReviewScreenRules {
  bannerKind: ReviewBannerKind
  trustedToggleEnabled: boolean
  ctaMode: ReviewCtaMode
}

const PARTIAL_STATUSES: PayeeVerificationStatus[] = [
  "PARTIAL_MATCH",
  "PARTIAL_MATCH_INCORRECT_TYPE",
]

export function getReviewScreenRules(
  status: PayeeVerificationStatus,
): ReviewScreenRules {
  if (status === "NOT_MATCHED") {
    return {
      bannerKind: "cop-danger",
      trustedToggleEnabled: false,
      ctaMode: "edit-and-send",
    }
  }

  if (PARTIAL_STATUSES.includes(status)) {
    return {
      bannerKind: "cop-warning",
      trustedToggleEnabled: false,
      ctaMode: "confirm",
    }
  }

  if (status === "UNAVAILABLE") {
    return {
      bannerKind: "trust",
      trustedToggleEnabled: true,
      ctaMode: "confirm",
    }
  }

  return {
    bannerKind: "name-confirmed",
    trustedToggleEnabled: true,
    ctaMode: "confirm",
  }
}

export function getPartialMatchBannerMessage(
  status: PayeeVerificationStatus,
): string {
  if (status === "PARTIAL_MATCH_INCORRECT_TYPE") {
    return "The account type doesn't match what you entered. Review the details before proceeding."
  }

  return "The name is a close match to the bank's records. Review the details before proceeding."
}

export function getNameConfirmedMessage(resolvedBankName?: string): string {
  if (resolvedBankName?.trim()) {
    return `Name confirmed by ${resolvedBankName.trim()}`
  }

  return "Name confirmed by the recipient's bank"
}
