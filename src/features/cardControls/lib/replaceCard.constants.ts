export const REPLACE_CARD_SKELETON_MS = 800
export const REPLACE_CARD_PENDING_MS = 2000

export const REPLACE_CARD_BACK_LINE_HEIGHT = 24
export const REPLACE_CARD_TITLE_LINE_HEIGHT = 32
export const REPLACE_CARD_SUBTITLE_LINE_HEIGHT = 24

export const REPLACE_SUCCESS_CARD_WIDTH = 200
export const REPLACE_SUCCESS_CARD_HEIGHT = 148

export type ReplaceReasonId =
  | "lost"
  | "stolen"
  | "not-working"
  | "expired"
  | "want-new"

export interface ReplaceReasonOption {
  id: ReplaceReasonId
  label: string
}

export const REPLACE_REASON_OPTIONS: ReplaceReasonOption[] = [
  { id: "lost", label: "Lost" },
  { id: "stolen", label: "Stolen" },
  { id: "not-working", label: "Not working" },
  { id: "expired", label: "Expired" },
  { id: "want-new", label: "Want a new one" },
]

export const DEFAULT_REPLACE_REASON: ReplaceReasonId = "lost"

export type ReplaceCardStep = "reason" | "delivery" | "pending" | "success"

export interface DeliveryAddressForm {
  streetAddress: string
  apartment: string
  city: string
  stateProvince: string
  postalCode: string
}

export const DEFAULT_DELIVERY_ADDRESS: DeliveryAddressForm = {
  streetAddress: "Tanjoe Crescent 60",
  apartment: "",
  city: "North York",
  stateProvince: "ON",
  postalCode: "M2M 1P7",
}

export function getReplaceSuccessCopy(cardType: "physical" | "virtual") {
  if (cardType === "virtual") {
    return {
      title: "You've got a new virtual card",
      body: "Your old card has been deactivated. You can start using your new virtual card right away.",
    }
  }

  return {
    title: "Your new physical card is on the way",
    body: "Your old card has been deactivated. We'll ship your new physical card to the address you provided.",
  }
}
