import { List } from "@bolteu/kalep-react"
import ArrowRight from "@bolteu/kalep-react-icons/dist/ArrowRight"
import CashOutlined from "@bolteu/kalep-react-icons/dist/CashOutlined"
import ChevronForward from "@bolteu/kalep-react-icons/dist/ChevronForward"
import MailOutlined from "@bolteu/kalep-react-icons/dist/MailOutlined"
import OfferOutlined from "@bolteu/kalep-react-icons/dist/OfferOutlined"
import ReorderHoriz from "@bolteu/kalep-react-icons/dist/ReorderHoriz"
import type { ComponentType } from "react"
import type { KalepIcon } from "@bolteu/kalep-react-icons/dist/types"
import { HOME_MENU_ITEMS } from "../data/homeMenuItems"
import type { HomeMenuItemId } from "../home.types"

const MENU_ICONS: Record<HomeMenuItemId, ComponentType<KalepIcon>> = {
  transactions: ReorderHoriz,
  "send-money": ArrowRight,
  loans: CashOutlined,
  rewards: OfferOutlined,
  feedback: MailOutlined,
}

interface ServicesListProps {
  onMenuItemClick: (id: HomeMenuItemId) => void
}

/** Figma 6957:28098 — Services menu (Transactions → Feedback). */
export function ServicesList({ onMenuItemClick }: ServicesListProps) {
  return (
    <List.Root className="[&_li>div:hover]:!bg-transparent [&_li>div:focus:hover]:!bg-transparent">
      {HOME_MENU_ITEMS.map((item, index) => {
        const Icon = MENU_ICONS[item.id]
        const isLast = index === HOME_MENU_ITEMS.length - 1

        return (
          <List.Item
            key={item.id}
            primary={item.primary}
            secondary={item.secondary}
            separator={!isLast}
            paddingStart={6}
            paddingEnd={6}
            onClick={() => onMenuItemClick(item.id)}
            primaryTypographyProps={{ variant: "body-m-compact-regular" }}
            secondaryTypographyProps={{ variant: "body-s-regular" }}
            renderStartSlot={() => (
              <Icon size="lg" className="text-secondary" />
            )}
            renderEndSlot={() => (
              <ChevronForward size="lg" className="text-tertiary" />
            )}
          />
        )
      })}
    </List.Root>
  )
}
