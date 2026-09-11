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
  | "mobile-wallet"
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
  /** Row is disabled when the card is locked. */
  disabledWhenLocked?: boolean
}

/** Figma 6474:47636 — Card controls list order and copy. */
export const CARD_CONTROL_ITEMS: CardControlItem[] = [
  {
    id: "lock",
    primary: "Lock card",
    icon: UnlockOutlined,
    hasSwitch: true,
  },
  {
    id: "card-details",
    primary: "Card details",
    icon: CardOutlined,
    disabledWhenLocked: true,
  },
  {
    id: "pin-reminder",
    primary: "PIN reminder",
    icon: DashboardOutlined,
    disabledWhenLocked: true,
  },
  {
    id: "spending-limits",
    primary: "Payment and card limits",
    icon: ChartOutlined,
    disabledWhenLocked: true,
  },
  {
    id: "mobile-wallet",
    primary: "Mobile wallets",
    icon: WalletOutlined,
    disabledWhenLocked: true,
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

/** Lock/unlock in-flight duration before overlay / disabled state settles. */
export const CARD_CONTROLS_TRANSITION_MS = 1200

export const CARD_LOCKED_SNACKBAR_MESSAGE =
  "Card locked. This feature isn't available while your card is locked."

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
