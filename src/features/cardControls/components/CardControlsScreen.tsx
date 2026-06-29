import { GhostButton, ListItemLayout } from "@bolteu/kalep-react"
import ChevronCircleLeft from "@bolteu/kalep-react-icons/dist/ChevronCircleLeft"
import { useState } from "react"
import { getCardControlImage } from "../cardControlAssets"
import {
  CARD_CONTROL_ITEMS,
  type CardControlActionId,
} from "../data/cardControlItems"
import type { CardType } from "@/features/home/home.types"
import { useNavigationStack } from "@/shared/navigation"

export interface CardControlsScreenProps {
  cardType: CardType
  onBack?: () => void
}

export function CardControlsScreen({
  cardType,
  onBack,
}: CardControlsScreenProps) {
  const { pop } = useNavigationStack()
  const handleBack = onBack ?? pop
  const [locked, setLocked] = useState(false)
  const cardImage = getCardControlImage(cardType)

  const handleAction = (id: CardControlActionId) => {
    console.info("[stub] Card control:", id, { cardType })
  }

  return (
    <div className="min-h-dvh bg-layer-floor-1">
      <div className="flex flex-col">
        <div className="px-5 pt-6">
          <GhostButton onClick={handleBack} aria-label="Back">
            <span className="flex items-center gap-2">
              <ChevronCircleLeft size="lg" className="text-action-primary" />
              <span className="text-body-m font-semibold text-action-primary">
                Back
              </span>
            </span>
          </GhostButton>
        </div>

        <div className="flex justify-center px-6 pb-6 pt-4">
          <img
            src={cardImage}
            alt={`${cardType} card`}
            width={345}
            height={218}
            className="h-[13.625rem] w-full max-w-[21.5625rem] rounded-[12px] object-cover object-center shadow-[0px_6px_12px_-2px_rgba(28,28,28,0.25),0px_3px_7px_-3px_rgba(28,28,28,0.3)]"
          />
        </div>

        <ul className="m-0 list-none p-0">
          {CARD_CONTROL_ITEMS.map((item, index) => {
            const Icon = item.icon
            const isLast = index === CARD_CONTROL_ITEMS.length - 1
            const isLock = item.id === "lock"

            return (
              <li key={item.id}>
                <ListItemLayout
                  primary={item.primary}
                  separator={!isLast}
                  paddingStart={6}
                  paddingEnd={6}
                  selected={isLock ? locked : undefined}
                  selectionMode={isLock ? "switch" : undefined}
                  onClick={
                    isLock
                      ? () => setLocked((value) => !value)
                      : () => handleAction(item.id)
                  }
                  renderStartSlot={() => (
                    <Icon size="lg" className="text-secondary" />
                  )}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
