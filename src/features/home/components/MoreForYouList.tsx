import { Island, List } from "@bolteu/kalep-react"
import CashOutlined from "@bolteu/kalep-react-icons/dist/CashOutlined"
import CardOutlined from "@bolteu/kalep-react-icons/dist/CardOutlined"
import ChevronForward from "@bolteu/kalep-react-icons/dist/ChevronForward"
import OfferOutlined from "@bolteu/kalep-react-icons/dist/OfferOutlined"
import ReorderHoriz from "@bolteu/kalep-react-icons/dist/ReorderHoriz"
import type { ComponentType } from "react"
import type { KalepIcon } from "@bolteu/kalep-react-icons/dist/types"
import { HOME_MENU_ITEMS } from "../data/homeMenuItems"
import type { HomeMenuItemId } from "../home.types"

const MENU_ICONS: Record<
  HomeMenuItemId,
  ComponentType<KalepIcon>
> = {
  transactions: ReorderHoriz,
  loans: CashOutlined,
  cards: CardOutlined,
  rewards: OfferOutlined,
}

interface MoreForYouListProps {
  onMenuItemClick: (id: HomeMenuItemId) => void
}

export function MoreForYouList({ onMenuItemClick }: MoreForYouListProps) {
  return (
    <Island
      elevation="floor-1"
      corners="rounded"
      padding={0}
      className="overflow-hidden !border-0"
    >
      <List.Root>
        {HOME_MENU_ITEMS.map((item, index) => {
          const Icon = MENU_ICONS[item.id]
          const isLast = index === HOME_MENU_ITEMS.length - 1

          return (
            <List.Item
              key={item.id}
              primary={item.primary}
              secondary={item.secondary}
              separator={!isLast}
              onClick={() => onMenuItemClick(item.id)}
              primaryTypographyProps={{ variant: "body-m-compact-regular" }}
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
    </Island>
  )
}
