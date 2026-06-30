/** Fixed line-box heights — match Kalep TypographyStack `base` variant. */
export const CARD_DETAILS_LABEL_LINE_HEIGHT = 20
export const CARD_DETAILS_VALUE_LINE_HEIGHT = 24
export const CARD_DETAILS_BACK_LINE_HEIGHT = 24
export const CARD_DETAILS_COPY_ICON_SIZE = 24

export const CARD_DETAILS_ROW_TEMPLATES = [
  {
    id: "card-number" as const,
    label: "Card number",
    placeholderValue: "0000 0000 0000 4231",
    skeletonLabelWidth: 104,
    skeletonValueWidth: 252,
    snackbarMessage: "Card number copied",
  },
  {
    id: "expiry-date" as const,
    label: "Expiry date",
    placeholderValue: "00 / 00",
    skeletonLabelWidth: 88,
    skeletonValueWidth: 72,
    snackbarMessage: "Expiry date copied",
  },
  {
    id: "cvv" as const,
    label: "CVV",
    placeholderValue: "000",
    skeletonLabelWidth: 40,
    skeletonValueWidth: 40,
    snackbarMessage: "CVV copied",
  },
] as const

export type CardDetailsRowId = (typeof CARD_DETAILS_ROW_TEMPLATES)[number]["id"]
