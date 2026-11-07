import type { ComponentType } from "react"
import type { KalepIcon } from "@bolteu/kalep-react-icons/dist/types"
import AlertOutlined from "@bolteu/kalep-react-icons/dist/AlertOutlined"
import CardOutlined from "@bolteu/kalep-react-icons/dist/CardOutlined"
import ChartOutlined from "@bolteu/kalep-react-icons/dist/ChartOutlined"
import DashboardOutlined from "@bolteu/kalep-react-icons/dist/DashboardOutlined"
import UnlockOutlined from "@bolteu/kalep-react-icons/dist/UnlockOutlined"
import WalletOutlined from "@bolteu/kalep-react-icons/dist/WalletOutlined"

export type CardControlActionId =
  | "lock"
  | "apple-wallet"
  | "pin-reminder"
  | "card-details"
  | "spending-limits"
  | "replace"

export type LockPhase = "unlocked" | "locking" | "locked" | "unlocking"

export interface CardControlItem {
  id: CardControlActionId
  primary: string
  secondary?: string
  icon: ComponentType<KalepIcon>
  hasSwitch?: boolean
}

/** Figma 11633:51454 — Card / Lock and Unlock list order and copy. */
export const CARD_CONTROL_ITEMS: CardControlItem[] = [
  {
    id: "lock",
    primary: "Unlocked",
    icon: UnlockOutlined,
    hasSwitch: true,
  },
  {
    id: "card-details",
    primary: "Card details",
    icon: CardOutlined,
  },
  {
    id: "pin-reminder",
    primary: "PIN reminder",
    icon: DashboardOutlined,
  },
  {
    id: "apple-wallet",
    primary: "Add to Apple Wallet",
    icon: WalletOutlined,
  },
  {
    id: "spending-limits",
    primary: "Spending limits",
    icon: ChartOutlined,
  },
  {
    id: "replace",
    primary: "Replace card",
    secondary: "Card lost, damaged or stolen?",
    icon: AlertOutlined,
  },
]

/** Initial gate loading skeleton rows — Figma 8533:110978–110980. */
export const CARD_CONTROLS_LOADING_SKELETON_COUNT = 3

/** Mock lock/unlock success latency before overlay / disabled state settles. */
export const CARD_CONTROLS_TRANSITION_MS = 1200

/** Figma: treat in-flight lock/unlock as failure after 10s. */
export const CARD_CONTROLS_TIMEOUT_MS = 10_000

export const CARD_LOCKED_SNACKBAR_MESSAGE =
  "This feature isn't available while your card is locked."

export const CARD_LOCKED_CAPTION = "Locked — payments will be declined."

export const CARD_LOCK_ERROR_MESSAGE =
  "Couldn't update your card. Please try again."

/** Rows that show the locked snackbar when tapped while locked. */
const SNACKBAR_WHEN_LOCKED: ReadonlySet<CardControlActionId> = new Set([
  "card-details",
  "pin-reminder",
  "apple-wallet",
])

/**
 * Disable matrix (Figma 11633:51454):
 * - locking: rows 2–4 (details, PIN, Apple Wallet)
 * - locked: same three; Spending limits + Replace stay enabled
 * - unlocking: rows 2–6 (all actions including Replace)
 */
export function isControlDisabled(
  id: CardControlActionId,
  phase: LockPhase,
): boolean {
  if (id === "lock") return false

  if (phase === "unlocking") {
    return true
  }

  if (phase === "locking" || phase === "locked") {
    return SNACKBAR_WHEN_LOCKED.has(id)
  }

  return false
}

export function showsLockedSnackbarOnTap(
  id: CardControlActionId,
  phase: LockPhase,
): boolean {
  return phase === "locked" && SNACKBAR_WHEN_LOCKED.has(id)
}

export function getLockPrimary(phase: LockPhase): string {
  switch (phase) {
    case "unlocked":
    case "locking":
      return "Unlocked"
    case "locked":
    case "unlocking":
      return "Card locked"
  }
}

export function getLockSecondary(phase: LockPhase): string {
  switch (phase) {
    case "unlocked":
      return "Lock card to stop payments"
    case "locking":
      return "Locking card..."
    case "locked":
      return "Unlock your card to use it again"
    case "unlocking":
      return "Unlocking card..."
  }
}

export function getLockStatusAnnouncement(phase: LockPhase): string {
  switch (phase) {
    case "unlocked":
      return "Card unlocked"
    case "locking":
      return "Locking card"
    case "locked":
      return "Card locked"
    case "unlocking":
      return "Unlocking card"
  }
}

export function isLockSwitchOn(phase: LockPhase): boolean {
  return phase === "locking" || phase === "locked"
}

/** Lock icon on the lock row while locking or locked (mirrors unlock icon during unlocking). */
export function usesLockIcon(phase: LockPhase): boolean {
  return phase === "locking" || phase === "locked"
}

/** Disabled row start icons stay locked until the card overlay clears. */
export function showLockedRowIcon(phase: LockPhase): boolean {
  return phase === "locked" || phase === "unlocking"
}

export function showLockedCaption(phase: LockPhase): boolean {
  return phase === "locked" || phase === "unlocking"
}
