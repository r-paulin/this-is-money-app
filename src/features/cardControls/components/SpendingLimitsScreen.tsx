import { Button, ListItemLayout, Typography } from "@bolteu/kalep-react"
import { useState } from "react"
import { formatTransactionListEurFromCents } from "@/features/transactions/lib/formatTransactionAmount"
import type { CardType } from "@/features/home/home.types"
import { SkeletonBar } from "@/shared/components/skeleton/SkeletonPlaceholders"
import { useNavigationStack } from "@/shared/navigation"
import {
  SPENDING_LIMITS_INTRO,
  buildSpendingLimitsView,
  getSpendingLimits,
  type SpendingLimitsView,
} from "../lib/spendingLimits"
import { ChangeLimitsGate } from "./ChangeLimitsGate"
import { SpendingLimitsProgressRing } from "./SpendingLimitsProgressRing"
import "./spending-limits.css"

export interface SpendingLimitsScreenProps {
  cardType: CardType
  loading?: boolean
}

function LimitRow({
  label,
  amount,
  amountSecondary,
  separator,
}: {
  label: string
  amount: string
  amountSecondary?: string
  separator: boolean
}) {
  return (
    <ListItemLayout
      isReverse
      gap={1}
      secondary={
        <Typography variant="body-s-regular" color="secondary" as="span">
          {label}
        </Typography>
      }
      primary={
        <span className="flex flex-col items-start">
          <Typography
            variant="body-l-accent"
            color="primary"
            as="span"
            inlineStyle={{ fontVariantNumeric: "lining-nums tabular-nums" }}
          >
            {amount}
          </Typography>
          {amountSecondary ? (
            <Typography variant="body-s-regular" color="secondary" as="span">
              {amountSecondary}
            </Typography>
          ) : null}
        </span>
      }
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
    />
  )
}

export function SpendingLimitsScreen({
  cardType,
  loading = false,
}: SpendingLimitsScreenProps) {
  const { push } = useNavigationStack()
  const [view, setView] = useState<SpendingLimitsView>(() =>
    buildSpendingLimitsView(getSpendingLimits(cardType)),
  )

  const openChangeLimits = () => {
    push({
      key: `change-limits:${cardType}`,
      render: () => (
        <ChangeLimitsGate
          cardType={cardType}
          onSaved={() => {
            setView(buildSpendingLimitsView(getSpendingLimits(cardType)))
          }}
        />
      ),
    })
  }

  if (loading) {
    return (
      <div className="spending-limits-screen" aria-busy aria-label="Loading spending limits">
        <div className="spending-limits-screen__body">
          <div className="spending-limits-screen__intro flex flex-col gap-2">
            <SkeletonBar width={180} height={28} className="rounded" />
            <SkeletonBar width="100%" height={40} className="rounded" />
          </div>
          <div className="spending-limits-screen__ring-wrap flex justify-center">
            <SpendingLimitsProgressRing cardType={cardType} ratio={0} spentCents={0} empty />
          </div>
        </div>
      </div>
    )
  }

  const { state, availableThisMonthCents, ringRatio } = view

  return (
    <div className="spending-limits-screen">
      <div className="spending-limits-screen__body">
        <div className="spending-limits-screen__intro">
          <Typography variant="heading-m-accent" color="primary" as="h1">
            Spending limits
          </Typography>
          <Typography variant="body-m-regular" color="secondary" as="p">
            {SPENDING_LIMITS_INTRO}
          </Typography>
        </div>

        <div className="spending-limits-screen__ring-wrap">
          <SpendingLimitsProgressRing
            cardType={cardType}
            ratio={ringRatio}
            spentCents={state.spentThisMonthCents}
          />
        </div>

        <ul className="m-0 list-none p-0">
          <li>
            <LimitRow
              label="Per transaction limit"
              amount={formatTransactionListEurFromCents(state.perTransactionCents)}
              separator
            />
          </li>
          <li>
            <LimitRow
              label="Available this month"
              amount={formatTransactionListEurFromCents(availableThisMonthCents)}
              amountSecondary={`Monthly limit: ${formatTransactionListEurFromCents(state.monthlyLimitCents)}`}
              separator={false}
            />
          </li>
        </ul>
      </div>

      <div className="spending-limits-screen__footer">
        <Button size="lg" variant="primary" fullWidth onClick={openChangeLimits}>
          Change limits
        </Button>
      </div>
    </div>
  )
}
