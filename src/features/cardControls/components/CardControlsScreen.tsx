import { GhostButton, ListItemLayout } from "@bolteu/kalep-react"
import ChevronCircleLeft from "@bolteu/kalep-react-icons/dist/ChevronCircleLeft"
import LockOutlined from "@bolteu/kalep-react-icons/dist/LockOutlined"
import UnlockOutlined from "@bolteu/kalep-react-icons/dist/UnlockOutlined"
import { useState } from "react"
import {
  CARD_CONTROL_ITEMS,
  type CardControlActionId,
} from "../data/cardControlItems"
import { DEFAULT_CARD_LAST_FOUR } from "../lib/generateCardDetails"
import type { CardType } from "@/features/home/home.types"
import { PaymentCard } from "@/shared/components/PaymentCard"
import { SwapSlot, TextSwap } from "@/shared/components/TextSwap"
import { useNavigationStack } from "@/shared/navigation"
import { CardDetailsGate } from "./CardDetailsGate"
import { PinReminderGate } from "./PinReminderGate"

type LockSwapKey = "lock" | "unlock"

export interface CardControlsScreenProps {
  cardType: CardType
  lastFour?: string
  onBack?: () => void
}

export function CardControlsScreen({
  cardType,
  lastFour = DEFAULT_CARD_LAST_FOUR,
  onBack,
}: CardControlsScreenProps) {
  const { pop, push } = useNavigationStack()
  const handleBack = onBack ?? pop
  const [locked, setLocked] = useState(false)

  const handleAction = (id: CardControlActionId) => {
    if (id === "pin-reminder") {
      push({
        key: `pin-reminder:${cardType}`,
        render: () => <PinReminderGate />,
      })
      return
    }

    if (id === "card-details") {
      push({
        key: `card-details:${cardType}`,
        render: () => <CardDetailsGate lastFour={lastFour} />,
      })
      return
    }

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
          <PaymentCard virtual={cardType === "virtual"} locked={locked} lastFour={lastFour} />
        </div>

        <ul className="m-0 list-none p-0">
          {CARD_CONTROL_ITEMS.map((item, index) => {
            const isLast = index === CARD_CONTROL_ITEMS.length - 1
            const isLock = item.id === "lock"
            const lockSwapKey: LockSwapKey = locked ? "unlock" : "lock"

            return (
              <li key={item.id}>
                <ListItemLayout
                  primary={
                    isLock ? (
                      <TextSwap
                        value={lockSwapKey === "unlock" ? "Unlock card" : "Lock card"}
                      />
                    ) : (
                      item.primary
                    )
                  }
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
                  renderStartSlot={() =>
                    isLock ? (
                      <SwapSlot
                        value={lockSwapKey}
                        className="inline-flex items-center"
                      >
                        {(key) =>
                          key === "unlock" ? (
                            <LockOutlined size="lg" className="text-secondary" />
                          ) : (
                            <UnlockOutlined size="lg" className="text-secondary" />
                          )
                        }
                      </SwapSlot>
                    ) : (
                      <item.icon size="lg" className="text-secondary" />
                    )
                  }
                />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
