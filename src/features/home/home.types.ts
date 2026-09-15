export type HomeMenuItemId =
  | "transactions"
  | "send-money"
  | "loans"
  | "rewards"
  | "feedback"

export type CardType = "physical" | "virtual"

export interface HomeMenuItem {
  id: HomeMenuItemId
  primary: string
  secondary: string
}

export type HomeBannerId =
  | "GoogleWallet"
  | "AppleWallet"
  | "PayWithPhone"
  | "GetPhysicalCard"
  | "PhysicalCardStatus"

export type HomeNotificationTone = "positive" | "warning" | "error"

export interface HomeNotification {
  message: string
  tone: HomeNotificationTone
  /** When set, the notice is tappable and navigates via stub. */
  destination?: string
}

export type CardThumbnailColor = "green" | "black"

export type PhysicalDeliveryPhase =
  | "preparing"
  | "in_delivery"
  | "arriving_soon"
  | "overdue"

export type HomeCardRowKind = "virtual" | "physical" | "offer"

export interface HomeCardRow {
  kind: HomeCardRowKind
  color: CardThumbnailColor
  lastFour?: string
  /** MM/YY */
  expiry?: string
  locked?: boolean
  blocked?: boolean
  lost?: boolean
  stolen?: boolean
  deliveryPhase?: PhysicalDeliveryPhase
  /** Unix ms — min ETA for delivery window */
  deliveryMinEta?: number
  /** Unix ms — max ETA for delivery window */
  deliveryMaxEta?: number
  daysToPrintedExpiry?: number
  renewing?: boolean
  expired?: boolean
}

export type ActivityFetchState = "loading" | "ready" | "failed"

export type BalanceFetchState = "idle" | "loading" | "ready" | "failed"
