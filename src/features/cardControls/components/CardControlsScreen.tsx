import { ListItemLayout, Typography, useSnackbar } from "@bolteu/kalep-react"
import { IconSwap } from "@/shared/components/IconSwap"
import { PaymentCard } from "@/shared/components/PaymentCard"
import { TextSwap } from "@/shared/components/TextSwap"
import { useNavigationStack } from "@/shared/navigation"
import Alert from "@bolteu/kalep-react-icons/dist/Alert"
import ChevronForward from "@bolteu/kalep-react-icons/dist/ChevronForward"
import LockOutlined from "@bolteu/kalep-react-icons/dist/LockOutlined"
import UnlockOutlined from "@bolteu/kalep-react-icons/dist/UnlockOutlined"
import { useEffect, useRef, useState } from "react"
import {
  CARD_CONTROL_ITEMS,
  CARD_CONTROLS_TIMEOUT_MS,
  CARD_CONTROLS_TRANSITION_MS,
  CARD_LOCK_ERROR_MESSAGE,
  CARD_LOCKED_CAPTION,
  CARD_LOCKED_SNACKBAR_MESSAGE,
  getLockPrimary,
  getLockSecondary,
  getLockStatusAnnouncement,
  isControlDisabled,
  isLockSwitchOn,
  showLockedCaption,
  showLockedRowIcon,
  showsLockedSnackbarOnTap,
  usesLockIcon,
  type CardControlActionId,
  type LockPhase,
} from "../data/cardControlItems"
import { DEFAULT_CARD_LAST_FOUR } from "../lib/generateCardDetails"
import {
  buildSpendingLimitsView,
  getSpendingLimits,
  spendingLimitsHubSecondary,
  spendingWarningCopy,
} from "../lib/spendingLimits"
import type { CardType } from "@/features/home/home.types"
import { CardDetailsGate } from "./CardDetailsGate"
import { PinReminderGate } from "./PinReminderGate"
import { ReplaceCardGate } from "./ReplaceCardGate"
import { SpendingLimitsGate } from "./SpendingLimitsGate"

export interface CardControlsScreenProps {
  cardType: CardType
  lastFour?: string
  /** Home / provider lock flag — seeds LockPhase and syncs back after transitions. */
  initialLocked?: boolean
  onLockedChange?: (locked: boolean) => void
}

function getLockIconSwapState(phase: LockPhase): "a" | "b" {
  return usesLockIcon(phase) ? "b" : "a"
}

function getRowIconSwapState(phase: LockPhase, isDisabled: boolean): "a" | "b" {
  return showLockedRowIcon(phase) && isDisabled ? "b" : "a"
}

export function CardControlsScreen({
  cardType,
  lastFour = DEFAULT_CARD_LAST_FOUR,
  initialLocked = false,
  onLockedChange,
}: CardControlsScreenProps) {
  const { push } = useNavigationStack()
  const snackbar = useSnackbar()
  const snackbarIdRef = useRef<number | null>(null)
  const lockPhaseRef = useRef<LockPhase>(initialLocked ? "locked" : "unlocked")
  const [lockPhase, setLockPhase] = useState<LockPhase>(
    initialLocked ? "locked" : "unlocked",
  )
  const [lockError, setLockError] = useState<string | null>(null)

  lockPhaseRef.current = lockPhase

  useEffect(() => {
    if (lockPhase !== "locking" && lockPhase !== "unlocking") return

    const successTimer = window.setTimeout(() => {
      setLockError(null)
      setLockPhase((current) =>
        current === "locking" ? "locked" : current === "unlocking" ? "unlocked" : current,
      )
    }, CARD_CONTROLS_TRANSITION_MS)

    const timeoutTimer = window.setTimeout(() => {
      const current = lockPhaseRef.current
      if (current === "locking") {
        setLockError(CARD_LOCK_ERROR_MESSAGE)
        setLockPhase("unlocked")
        return
      }
      if (current === "unlocking") {
        setLockError(CARD_LOCK_ERROR_MESSAGE)
        setLockPhase("locked")
      }
    }, CARD_CONTROLS_TIMEOUT_MS)

    return () => {
      window.clearTimeout(successTimer)
      window.clearTimeout(timeoutTimer)
    }
  }, [lockPhase])

  useEffect(() => {
    if (lockPhase === "locked") onLockedChange?.(true)
    if (lockPhase === "unlocked") onLockedChange?.(false)
  }, [lockPhase, onLockedChange])

  const handleLockToggle = () => {
    if (lockPhase === "locking" || lockPhase === "unlocking") return

    setLockError(null)

    if (lockPhase === "unlocked") {
      setLockPhase("locking")
      return
    }

    setLockPhase("unlocking")
  }

  const showLockedSnackbar = () => {
    if (snackbarIdRef.current != null) {
      snackbar.remove(snackbarIdRef.current)
    }
    const id = snackbar.add({
      description: CARD_LOCKED_SNACKBAR_MESSAGE,
      dismissible: true,
      timeout: 3000,
    })
    snackbarIdRef.current = typeof id === "number" ? id : null
  }

  const limitsView = buildSpendingLimitsView(getSpendingLimits(cardType))
  const limitsSecondary = spendingLimitsHubSecondary(limitsView)
  const limitsWarning = spendingWarningCopy(limitsView)

  const openSpendingLimits = () => {
    push({
      key: `spending-limits:${cardType}`,
      render: () => <SpendingLimitsGate cardType={cardType} />,
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

    if (id === "spending-limits") {
      openSpendingLimits()
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
  const showLockOverlay = lockPhase === "locked" || lockPhase === "unlocking"
  const cardLabel = cardType === "virtual" ? "Virtual card" : "Physical card"
  const captionLocked = showLockedCaption(lockPhase)

  return (
    <div className="min-h-dvh bg-layer-floor-1">
      <div className="sr-only" aria-live="polite">
        {getLockStatusAnnouncement(lockPhase)}
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col items-center px-6 pb-6 pt-4">
          <PaymentCard
            virtual={cardType === "virtual"}
            locked={showLockOverlay}
            lastFour={lastFour}
            showLastFour={false}
            variant="controls"
          />

          <div className="mt-4 flex min-h-[18px] items-end justify-center gap-4">
            {captionLocked ? (
              <Typography variant="body-s-compact-regular" color="secondary" as="p">
                <TextSwap value={CARD_LOCKED_CAPTION} />
              </Typography>
            ) : (
              <>
                <Typography variant="body-s-compact-regular" color="secondary" as="p">
                  {cardLabel}
                </Typography>
                <Typography variant="body-s-compact-accent" color="primary" as="p">
                  ···· {lastFour}
                </Typography>
              </>
            )}
          </div>
        </div>

        {limitsWarning && lockPhase !== "locking" && lockPhase !== "unlocking" ? (
          <button
            type="button"
            className="mx-6 mb-2 flex w-[calc(100%-3rem)] items-start gap-3 rounded-compact bg-warning-secondary px-4 py-3 text-left"
            onClick={openSpendingLimits}
            aria-label={`${limitsWarning.accent}${limitsWarning.body}`}
          >
            <Alert size="md" className="mt-0.5 shrink-0 text-warning-secondary" aria-hidden />
            <span className="min-w-0">
              <Typography variant="body-s-accent" color="primary" as="span">
                {limitsWarning.accent}
              </Typography>
              <Typography variant="body-s-regular" color="primary" as="span">
                {limitsWarning.body}
              </Typography>
            </span>
          </button>
        ) : null}

        <ul className="m-0 list-none p-0">
          {CARD_CONTROL_ITEMS.map((item, index) => {
            const isLast = index === CARD_CONTROL_ITEMS.length - 1
            const isLock = item.id === "lock"
            const isDisabled = isControlDisabled(item.id, lockPhase)
            const snackbarOnTap = showsLockedSnackbarOnTap(item.id, lockPhase)
            const secondary =
              isLock
                ? getLockSecondary(lockPhase)
                : item.id === "spending-limits"
                  ? limitsSecondary
                  : item.secondary

            return (
              <li key={item.id}>
                <ListItemLayout
                  primary={
                    isLock ? (
                      <Typography variant="body-m-compact-regular" color="primary" as="span">
                        <TextSwap value={getLockPrimary(lockPhase)} />
                      </Typography>
                    ) : isDisabled ? (
                      <Typography variant="body-m-compact-regular" color="secondary" as="span">
                        {item.primary}
                      </Typography>
                    ) : (
                      item.primary
                    )
                  }
                  secondary={
                    isLock ? (
                      <Typography variant="body-s-regular" color="secondary" as="span">
                        <TextSwap value={getLockSecondary(lockPhase)} />
                      </Typography>
                    ) : secondary ? (
                      <Typography variant="body-s-regular" color="secondary" as="span">
                        {secondary}
                      </Typography>
                    ) : undefined
                  }
                  separator={!isLast || Boolean(lockError && isLock)}
                  paddingStart={6}
                  paddingEnd={6}
                  selected={isLock ? isLockSwitchOn(lockPhase) : undefined}
                  selectionMode={isLock ? "switch" : undefined}
                  onClick={
                    isLock
                      ? isTransitioning
                        ? undefined
                        : handleLockToggle
                      : snackbarOnTap
                        ? showLockedSnackbar
                        : isDisabled
                          ? undefined
                          : () => handleAction(item.id)
                  }
                  renderStartSlot={() =>
                    isLock ? (
                      <IconSwap
                        active={getLockIconSwapState(lockPhase)}
                        className="inline-flex items-center"
                        iconA={<UnlockOutlined size="lg" className="text-secondary" />}
                        iconB={<LockOutlined size="lg" className="text-secondary" />}
                      />
                    ) : (
                      <IconSwap
                        active={getRowIconSwapState(lockPhase, isDisabled)}
                        className="inline-flex items-center"
                        iconA={<item.icon size="lg" className="text-secondary" />}
                        iconB={<LockOutlined size="lg" className="text-secondary" />}
                      />
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
                {isLock && lockError ? (
                  <div className="px-6 pb-3">
                    <p className="m-0 text-danger-primary bolt-font-body-s-regular">{lockError}</p>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
