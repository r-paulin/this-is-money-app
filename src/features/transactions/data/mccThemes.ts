export type MccThemeId =
  | "groceries"
  | "restaurants"
  | "entertainment_bars"
  | "entertainment"
  | "travel"
  | "travel_cruise"
  | "travel_rentals"
  | "travel_hotel"
  | "transport_bus"
  | "transport_train"
  | "travel_parking"
  | "medical"
  | "shopping"
  | "money"
  | "bolt"
  | "utilities"
  | "government"
  | "fuel"
  | "auto"
  | "other"
  | "decline"

export type TransactionKind =
  | "purchase"
  | "ride_payout"
  | "atm"
  | "refund"
  | "declined"
  | "transfer_out"
  | "transfer_in"
  | "authorization"
  | "reversal"
  | "failed"

export type TransactionBadge = "inbound" | "outbound" | "declined"

export interface MccTheme {
  id: MccThemeId
  mccs: readonly number[]
  /** Tailwind bg class for the 40px icon circle — Figma `_ MCC` (138:7229) */
  bgClass: string
  iconClass: string
}

/**
 * MCC themes from Figma `138:7229` (_ MCC).
 * Colors and MCC lists taken from component variants / annotations.
 */
export const MCC_THEMES: readonly MccTheme[] = [
  {
    id: "groceries",
    mccs: [5411],
    bgClass: "bg-mcc-groceries",
    iconClass: "text-static-key-light",
  },
  {
    id: "restaurants",
    mccs: [5812, 5814],
    bgClass: "bg-mcc-food",
    iconClass: "text-static-key-light",
  },
  {
    id: "entertainment_bars",
    mccs: [5813],
    bgClass: "bg-mcc-food",
    iconClass: "text-static-key-light",
  },
  {
    id: "entertainment",
    mccs: [7832, 7922],
    bgClass: "bg-mcc-food",
    iconClass: "text-static-key-light",
  },
  {
    id: "travel",
    mccs: [4511, 7012, 4722, 4582, 4789],
    bgClass: "bg-mcc-travel",
    iconClass: "text-static-key-light",
  },
  {
    id: "travel_cruise",
    mccs: [4411],
    bgClass: "bg-mcc-travel",
    iconClass: "text-static-key-light",
  },
  {
    id: "travel_rentals",
    mccs: [7512],
    bgClass: "bg-mcc-travel",
    iconClass: "text-static-key-light",
  },
  {
    id: "travel_hotel",
    mccs: [7011],
    bgClass: "bg-mcc-travel",
    iconClass: "text-static-key-light",
  },
  {
    id: "transport_bus",
    mccs: [4111, 4131, 4121],
    bgClass: "bg-mcc-transport",
    iconClass: "text-static-key-light",
  },
  {
    id: "transport_train",
    mccs: [4112],
    bgClass: "bg-mcc-transport",
    iconClass: "text-static-key-light",
  },
  {
    id: "travel_parking",
    mccs: [7523, 4784],
    bgClass: "bg-mcc-transport",
    iconClass: "text-static-key-light",
  },
  {
    id: "medical",
    mccs: [5912, 8011, 8021],
    bgClass: "bg-mcc-medical",
    iconClass: "text-static-key-light",
  },
  {
    id: "shopping",
    mccs: [5311, 5331, 5399, 5732, 5941],
    bgClass: "bg-mcc-shopping",
    iconClass: "text-static-key-light",
  },
  {
    id: "money",
    mccs: [6011, 6012, 4829, 6536, 6537, 6538],
    bgClass: "bg-mcc-money",
    iconClass: "text-static-key-light",
  },
  {
    id: "bolt",
    mccs: [6011, 6012, 4829, 6536, 6537, 6538],
    bgClass: "bg-mcc-money",
    iconClass: "text-static-key-light",
  },
  {
    id: "utilities",
    mccs: [4900, 4812, 4814, 4899],
    bgClass: "bg-mcc-utilities",
    iconClass: "text-static-key-light",
  },
  {
    id: "government",
    mccs: [9211, 9222, 9311],
    bgClass: "bg-mcc-government",
    iconClass: "text-static-key-light",
  },
  {
    id: "fuel",
    mccs: [5541, 5542],
    bgClass: "bg-mcc-fuel",
    iconClass: "text-static-key-light",
  },
  {
    id: "auto",
    mccs: [5533, 7531, 7535, 7538],
    bgClass: "bg-mcc-fuel",
    iconClass: "text-static-key-light",
  },
  {
    id: "other",
    mccs: [],
    bgClass: "bg-mcc-utilities",
    iconClass: "text-static-key-light",
  },
  {
    id: "decline",
    mccs: [5912, 8011, 8021],
    bgClass: "bg-mcc-decline",
    iconClass: "text-static-key-light",
  },
] as const

const THEME_BY_ID = Object.fromEntries(MCC_THEMES.map((t) => [t.id, t])) as Record<
  MccThemeId,
  MccTheme
>

/** Order for MCC lookup — more specific themes before shared MCC sets. */
const LOOKUP_ORDER: readonly MccThemeId[] = [
  "groceries",
  "restaurants",
  "entertainment_bars",
  "entertainment",
  "travel_cruise",
  "travel_rentals",
  "travel_hotel",
  "travel_parking",
  "travel",
  "transport_bus",
  "transport_train",
  "shopping",
  "fuel",
  "auto",
  "utilities",
  "government",
  "medical",
  "money",
  "other",
]

export function resolveThemeForTransaction(opts: {
  mcc: number
  kind: TransactionKind
  themeOverride?: MccThemeId
}): MccTheme {
  if (opts.kind === "ride_payout") {
    return THEME_BY_ID.bolt
  }
  if (opts.themeOverride) {
    return THEME_BY_ID[opts.themeOverride]
  }
  if (opts.kind === "failed" && opts.mcc === 0) {
    return THEME_BY_ID.decline
  }
  if (opts.kind === "atm" || opts.kind === "transfer_out" || opts.kind === "transfer_in") {
    return THEME_BY_ID.money
  }

  for (const id of LOOKUP_ORDER) {
    const theme = THEME_BY_ID[id]
    if (theme.mccs.includes(opts.mcc)) {
      return theme
    }
  }

  return THEME_BY_ID.other
}

export function badgeForKind(kind: TransactionKind): TransactionBadge | undefined {
  if (kind === "declined" || kind === "failed") return "declined"
  if (
    kind === "ride_payout" ||
    kind === "refund" ||
    kind === "transfer_in" ||
    kind === "reversal"
  ) {
    return "inbound"
  }
  if (kind === "atm" || kind === "transfer_out") return "outbound"
  return undefined
}
