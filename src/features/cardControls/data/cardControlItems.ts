import type { ComponentType } from "react"
import type { KalepIcon } from "@bolteu/kalep-react-icons/dist/types"
import CardOutlined from "@bolteu/kalep-react-icons/dist/CardOutlined"
import Refresh from "@bolteu/kalep-react-icons/dist/Refresh"
import ScoreOutlined from "@bolteu/kalep-react-icons/dist/ScoreOutlined"
import ShowOutlined from "@bolteu/kalep-react-icons/dist/ShowOutlined"
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
  icon: ComponentType<KalepIcon>
  hasSwitch?: boolean
}

export const CARD_CONTROL_ITEMS: CardControlItem[] = [
  {
    id: "lock",
    primary: "Lock card",
    icon: UnlockOutlined,
    hasSwitch: true,
  },
  {
    id: "mobile-wallet",
    primary: "Add card to mobile wallet",
    icon: WalletOutlined,
  },
  {
    id: "pin-reminder",
    primary: "PIN reminder",
    icon: ShowOutlined,
  },
  {
    id: "card-details",
    primary: "Card details",
    icon: CardOutlined,
  },
  {
    id: "spending-limits",
    primary: "Spending limits",
    icon: ScoreOutlined,
  },
  {
    id: "replace",
    primary: "Replace card",
    icon: Refresh,
  },
]
