import { ListItemLayout, Typography, useSnackbar } from "@bolteu/kalep-react"
import { PaymentCard } from "@/shared/components/PaymentCard"
import { SwapSlot, TextSwap } from "@/shared/components/TextSwap"
import { useNavigationStack } from "@/shared/navigation"
import ChevronForward from "@bolteu/kalep-react-icons/dist/ChevronForward"
import LockOutlined from "@bolteu/kalep-react-icons/dist/LockOutlined"
import UnlockOutlined from "@bolteu/kalep-react-icons/dist/UnlockOutlined"
import { useEffect, useState } from "react"
import {
  CARD_CONTROL_ITEMS,
  CARD_CONTROLS_TRANSITION_MS,
  CARD_LOCKED_SNACKBAR_MESSAGE,
  type CardControlActionId,
} from "../data/cardControlItems"
import { DEFAULT_CARD_LAST_FOUR } from "../lib/generateCardDetails"
import type { CardType } from "@/features/home/home.types"
import { CardControlSkeletonRow } from "./CardControlSkeletonRow"
import { CardDetailsGate } from "./CardDetailsGate"
import { PinReminderGate } from "./PinReminderGate"
import { ReplaceCardGate } from "./ReplaceCardGate"

type LockPhase = "unlocked" | "locking" | "locked" | "unlocking"
type LockIconKey = "unlocked" | "locked"

export interface CardControlsScreenProps {
  cardType: CardType
  lastFour?: string
}

function getLockLabel(phase: LockPhase): string {
  switch (phase) {
    case "unlocked":
      return "Card unlocked"
    case "locking":
      return "Locking card..."
    case "locked":
      return "Card locked"
    case "unlocking":
      return "Unlocking card..."
  }
}

function getLockIconKey(phase: LockPhase): LockIconKey {
  if (phase === "locked" || phase === "unlocking") return "locked"
  return "unlocked"
}

function isLockSwitchOn(phase: LockPhase): boolean {
  return phase === "locking" || phase === "locked"
}

export function CardControlsScreen({
  cardType,
  lastFour = DEFAULT_CARD_LAST_FOUR,
}: CardControlsScreenProps) {
  const { push } = useNavigationStack()
  const snackbar = useSnackbar()
  const [lockPhase, setLockPhase] = useState<LockPhase>("unlocked")

  useEffect(() => {
    if (lockPhase !== "locking" && lockPhase !== "unlocking") return

    const timer = window.setTimeout(() => {
      setLockPhase((current) =>
        current === "locking" ? "locked" : "unlocked",
      )
    }, CARD_CONTROLS_TRANSITION_MS)

    return () => window.clearTimeout(timer)
  }, [lockPhase])

  const handleLockToggle = () => {
    if (lockPhase === "locking" || lockPhase === "unlocking") return

    if (lockPhase === "unlocked") {
      setLockPhase("locking")
      return
    }

    setLockPhase("unlocking")
  }

  const showLockedSnackbar = () => {
    snackbar.add({
      description: CARD_LOCKED_SNACKBAR_MESSAGE,
      dismissible: true,
      timeout: 3000,
    })
  }

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

    if (id === "replace") {
      push({
        key: `replace-card:${cardType}`,
        render: () => <ReplaceCardGate cardType={cardType} />,
      })
      return
    }

    console.info("[stub] Card control:", id, { cardType })
  }

  const isTransitioning = lockPhase === "locking" || lockPhase === "unlocking"
  const isLocked = lockPhase === "locked" || lockPhase === "unlocking"
  const cardLabel = cardType === "virtual" ? "Virtual card" : "Physical card"

  return (
    <div className="min-h-dvh bg-layer-floor-1">
      <div className="flex flex-col">
        <div className="flex flex-col items-center px-6 pb-6 pt-4">
          <PaymentCard
            virtual={cardType === "virtual"}
            locked={isLocked}
            lastFour={lastFour}
            showLastFour={false}
            variant="controls"
          />

          <div className="mt-4 flex items-end justify-center gap-4">
            {lockPhase === "locked" || lockPhase === "unlocking" ? (
              <Typography variant="body-s-compact-accent" color="primary" as="p" align="center">
                Locked — payments will be declined
              </Typography>
            ) : (
              <>
                <Typography variant="body-s-compact-accent" color="primary" as="p">
                  {cardLabel}
                </Typography>
                <Typography variant="body-s-compact-accent" color="secondary" as="p">
                  ···· {lastFour}
                </Typography>
              </>
            )}
          </div>
        </div>

        <ul className="m-0 list-none p-0">
          {CARD_CONTROL_ITEMS.map((item, index) => {
            const isLast = index === CARD_CONTROL_ITEMS.length - 1
            const isLock = item.id === "lock"
            const isDisabled = lockPhase === "locked" && item.disabledWhenLocked
            const showSkeleton = isTransitioning && !isLock

            if (showSkeleton) {
              return (
                <li key={item.id}>
                  <CardControlSkeletonRow separator={!isLast} shimmer />
                </li>
              )
            }

            const lockIconKey = getLockIconKey(lockPhase)
            const iconClassName = isDisabled ? "text-tertiary" : "text-secondary"

            return (
              <li key={item.id}>
                <ListItemLayout
                  primary={
                    isLock ? (
                      <TextSwap value={getLockLabel(lockPhase)} />
                    ) : isDisabled ? (
                      <Typography variant="body-m-compact-regular" color="secondary" as="span">
                        {item.primary}
                      </Typography>
                    ) : (
                      item.primary
                    )
                  }
                  secondary={
                    item.secondary ? (
                      <Typography variant="body-s-regular" color="secondary" as="span">
                        {item.secondary}
                      </Typography>
                    ) : undefined
                  }
                  separator={!isLast}
                  paddingStart={6}
                  paddingEnd={6}
                  selected={isLock ? isLockSwitchOn(lockPhase) : undefined}
                  selectionMode={isLock ? "switch" : undefined}
                  onClick={
                    isLock
                      ? handleLockToggle
                      : isDisabled
                        ? showLockedSnackbar
                        : () => handleAction(item.id)
                  }
                  renderStartSlot={() =>
                    isLock ? (
                      <SwapSlot value={lockIconKey} className="inline-flex items-center">
                        {(key) =>
                          key === "locked" ? (
                            <LockOutlined size="lg" className="text-secondary" />
                          ) : (
                            <UnlockOutlined size="lg" className="text-secondary" />
                          )
                        }
                      </SwapSlot>
                    ) : isDisabled ? (
                      <LockOutlined size="lg" className={iconClassName} />
                    ) : (
                      <item.icon size="lg" className={iconClassName} />
                    )
                  }
                  renderEndSlot={
                    isLock
                      ? undefined
                      : () => (
                          <ChevronForward size="lg" className="text-tertiary" aria-hidden />
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
