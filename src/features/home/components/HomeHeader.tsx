import { Button, GhostButton, Typography } from "@bolteu/kalep-react"
import ArrowCircleRight from "@bolteu/kalep-react-icons/dist/ArrowCircleRight"
import { useEffect, useMemo } from "react"
import { formatEurFromCents } from "@/features/transactions/lib/formatTransactionAmount"
import { NumberPopIn } from "@/shared/components/NumberPopIn"
import { SkeletonBar } from "@/shared/components/skeleton/SkeletonPlaceholders"
import { useNumberPopIn } from "@/shared/components/useNumberPopIn"
import { isSendMoneyDisabled } from "../lib/homeScreenLogic"
import type { BalanceFetchState, HomeNotification } from "../home.types"
import sectionSeparator from "../assets/section-separator.svg"
import "./home-header.css"

export interface HomeHeaderProps {
  balanceCents: number
  balanceState: BalanceFetchState
  notification: HomeNotification | null
  onSendMoney: () => void
}

export function HomeHeader({
  balanceCents,
  balanceState,
  notification,
  onSendMoney,
}: HomeHeaderProps) {
  const formattedBalance = useMemo(
    () => formatEurFromCents(balanceCents).replace(/\u00a0/g, "\u202F"),
    [balanceCents],
  )

  const { groupRef, value, previousValue, playing, setDigitsStatic } = useNumberPopIn(
    formattedBalance,
    balanceState !== "loading",
  )

  useEffect(() => {
    if (balanceState === "ready") {
      setDigitsStatic(formattedBalance)
    }
  }, [balanceState, formattedBalance, setDigitsStatic])

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
                notification.tone === "positive"
                  ? "home-header__notification--positive"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {notification.destination ? (
                <GhostButton
                  onClick={() =>
                    console.info("[stub] Notification:", notification.destination)
                  }
                >
                  <Typography variant="body-s-regular" color="primary" as="span">
                    {notification.message}
                  </Typography>
                </GhostButton>
              ) : (
                <Typography variant="body-s-regular" color="primary" as="p">
                  {notification.message}
                </Typography>
              )}
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
                variant="primary"
                size="md"
                disabled={sendDisabled}
                onClick={onSendMoney}
                aria-description={
                  sendDisabled
                    ? "Send money is unavailable when your balance is zero"
                    : undefined
                }
              >
                <span className="inline-flex items-center gap-2">
                  Send money
                  <ArrowCircleRight size="md" aria-hidden />
                </span>
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
