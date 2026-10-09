import { Button, Typography } from "@bolteu/kalep-react"
import ArrowCircleRight from "@bolteu/kalep-react-icons/dist/ArrowCircleRight"
import Lock from "@bolteu/kalep-react-icons/dist/Lock"
import { useEffect, useMemo, useRef } from "react"
import { formatHomeBalanceEurFromCents } from "@/features/transactions/lib/formatTransactionAmount"
import { NumberPopIn } from "@/shared/components/NumberPopIn"
import { SkeletonBar } from "@/shared/components/skeleton/SkeletonPlaceholders"
import { useNumberPopIn } from "@/shared/components/useNumberPopIn"
import { isSendMoneyDisabled } from "../lib/homeScreenLogic"
import type { BalanceFetchState, CardType, HomeNotification } from "../home.types"
import sectionSeparator from "../assets/section-separator.svg"
import "./home-header.css"

export interface HomeHeaderProps {
  balanceCents: number
  balanceState: BalanceFetchState
  notification: HomeNotification | null
  onSendMoney: () => void
  onUnlockCard?: (cardType: CardType) => void
}

export function HomeHeader({
  balanceCents,
  balanceState,
  notification,
  onSendMoney,
  onUnlockCard,
}: HomeHeaderProps) {
  const formattedBalance = useMemo(
    () => formatHomeBalanceEurFromCents(balanceCents),
    [balanceCents],
  )

  const { groupRef, value, previousValue, playing, setDigits, setDigitsStatic } = useNumberPopIn(
    formattedBalance,
    false,
  )
  const balanceReadyRef = useRef(false)

  useEffect(() => {
    if (balanceState !== "ready") return
    if (!balanceReadyRef.current) {
      balanceReadyRef.current = true
      setDigitsStatic(formattedBalance)
      return
    }
    setDigits(formattedBalance)
  }, [balanceState, formattedBalance, setDigits, setDigitsStatic])

  const loading = balanceState === "loading" || balanceState === "failed"
  const sendDisabled = isSendMoneyDisabled(
    balanceCents,
    balanceState === "ready" ? "ready" : "loading",
  )

  return (
    <header className="home-header w-full">
      <div className="home-header__content">
        {notification ? (
          <div className="home-header__notification-wrap">
            <div
              className={[
                "home-header__notification",
                notification.tone === "warning"
                  ? "home-header__notification--warning"
                  : notification.tone === "positive"
                    ? "home-header__notification--positive"
                    : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="home-header__notification-row">
                <Lock
                  size="md"
                  className="home-header__notification-icon shrink-0 text-warning-secondary"
                  aria-hidden
                />
                <div className="home-header__notification-text">
                  <p className="home-header__notification-body m-0">
                    <Typography variant="body-s-accent" color="primary" as="span">
                      {notification.accent}
                    </Typography>
                    <Typography variant="body-s-regular" color="primary" as="span">
                      {notification.body}
                    </Typography>
                  </p>
                  <button
                    type="button"
                    className="home-header__notification-action"
                    onClick={() => onUnlockCard?.(notification.cardType)}
                  >
                    <Typography variant="body-s-compact-accent" color="warning-primary" as="span">
                      {notification.actionLabel}
                    </Typography>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="home-header__inner">
          <div className="home-header__label">
            <Typography variant="body-m-regular" color="secondary" as="p" align="start">
              Available balance
            </Typography>
          </div>

          <div className="home-header__balance">
            {loading ? (
              <SkeletonBar width={240} height={60} className="rounded" />
            ) : (
              <p className="home-header__balance-amount">
                <NumberPopIn
                  groupRef={groupRef}
                  value={value}
                  previousValue={previousValue}
                  playing={playing}
                />
              </p>
            )}
          </div>

          <div className="home-header__actions">
            {loading ? (
              <SkeletonBar width={140} height={40} className="rounded-full" />
            ) : (
              <Button
                variant="static-light"
                size="md"
                disabled={sendDisabled}
                onClick={onSendMoney}
                aria-description={
                  sendDisabled
                    ? "Send money is unavailable when your balance is zero"
                    : undefined
                }
              >
                Send money
                <ArrowCircleRight
                  size="md"
                  className={
                    sendDisabled ? "text-static-tertiary-dark" : "text-action-primary"
                  }
                  aria-hidden
                />
              </Button>
            )}
          </div>
        </div>
      </div>

      <img
        src={sectionSeparator}
        alt=""
        className="home-header__separator"
        aria-hidden
      />
    </header>
  )
}
