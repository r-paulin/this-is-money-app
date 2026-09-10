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
    primary: "Card unlocked",
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

export const CARD_CONTROLS_SKELETON_ROW_COUNT = 4

/** Lock/unlock transition duration — matches shimmer loop (1200ms ease-in-out). */
export const CARD_CONTROLS_TRANSITION_MS = 1200

export const CARD_LOCKED_SNACKBAR_MESSAGE =
  "Card locked. This feature isn't available while your card is locked."
