import type { RecipientType } from "../sendMoney.types"

export const RECIPIENT_TYPE_TAB_IDS: Record<RecipientType, string> = {
  individual: "recipient-type-tab-individual",
  business: "recipient-type-tab-business",
}

export const RECIPIENT_TYPE_TABS: { value: RecipientType; label: string }[] = [
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
]
