import { GhostButton, ListItemLayout, Typography } from "@bolteu/kalep-react"
import { useMemo } from "react"
import { buildMockTransactions } from "@/features/transactions/data/mockTransactions"
import type { Transaction } from "@/features/transactions/data/mockTransactions"
import { TransactionRow } from "@/features/transactions/components/TransactionRow"
import { GroupedSection } from "@/shared/components/GroupedSection"
import { SectionHeader } from "@/shared/components/SectionHeader"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"
import {
  getActivityBodyState,
  getActivityHeaderCopy,
  shouldShowSeeAll,
} from "../lib/homeScreenLogic"
import type { ActivityFetchState } from "../home.types"
import spilledMug from "../assets/illustration-spilled-mug.svg"
import receipt from "../assets/illustration-receipt.svg"

const PREVIEW_LIMIT = 4
const SKELETON_ROW_COUNT = 4

export interface ActivitySectionProps {
  activityState: ActivityFetchState
  transactionCount: number
  onSeeAll: () => void
  onRetry: () => void
  onTransactionSelect: (transaction: Transaction) => void
}

function ActivitySkeletonRow({ separator }: { separator: boolean }) {
  return (
    <ListItemLayout
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      primary={<SkeletonBar width="100%" height={20} />}
      secondary={<SkeletonBar width="40%" height={16} />}
      renderStartSlot={() => <SkeletonCircle size={40} />}
      renderEndSlot={() => <SkeletonBar width={72} height={20} />}
    />
  )
}

function SeeAllSkeletonRow() {
  return (
    <ListItemLayout
      separator={false}
      paddingStart={6}
      paddingEnd={6}
      primary={<SkeletonBar width={80} height={20} />}
    />
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-6 pb-8 pt-2">
      <img src={receipt} alt="" width={80} height={80} className="mb-3" />
      <Typography variant="body-m-regular" color="secondary" as="p" align="center">
        No activity yet
      </Typography>
    </div>
  )
}

function FailedState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 pb-8 pt-2">
      <img src={spilledMug} alt="" width={80} height={80} className="mb-3" />
      <Typography variant="body-m-regular" color="secondary" as="p" align="center">
        Activity isn&apos;t available right now
      </Typography>
      <div className="pt-4">
        <GhostButton onClick={onRetry}>Try again</GhostButton>
      </div>
    </div>
  )
}

function SeeAllRow({ onSeeAll }: { onSeeAll: () => void }) {
  return (
    <ListItemLayout
      primary="See all"
      separator={false}
      paddingStart={6}
      paddingEnd={6}
      onClick={onSeeAll}
      primaryTypographyProps={{
        variant: "body-m-compact-regular",
        color: "action-primary",
      }}
      aria-label="See all activity"
    />
  )
}

export function ActivitySection({
  activityState,
  transactionCount,
  onSeeAll,
  onRetry,
  onTransactionSelect,
}: ActivitySectionProps) {
  const bodyState = getActivityBodyState(activityState, transactionCount)
  const headerCopy = getActivityHeaderCopy(
    bodyState === "empty"
      ? "empty"
      : bodyState === "failed"
        ? "failed"
        : bodyState === "loading"
          ? "loading"
          : "ready",
    transactionCount,
  )

  const previewTransactions = useMemo(() => {
    if (bodyState !== "few" && bodyState !== "maximum") return []
    return buildMockTransactions()
      .sort((a, b) => b.occurredAt - a.occurredAt)
      .slice(0, PREVIEW_LIMIT)
  }, [bodyState])

  const showSeeAll = bodyState === "maximum" && shouldShowSeeAll(transactionCount)

  return (
    <GroupedSection aria-labelledby="activity-heading">
      <SectionHeader id="activity-heading" grouped paddingBottom={8}>
        {headerCopy}
      </SectionHeader>

      {bodyState === "loading" ? (
        <div aria-busy="true" aria-label="Loading activity">
          {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
            <ActivitySkeletonRow
              key={index}
              separator={index < SKELETON_ROW_COUNT - 1}
            />
          ))}
          <SeeAllSkeletonRow />
        </div>
      ) : null}

      {bodyState === "empty" ? <EmptyState /> : null}
      {bodyState === "failed" ? <FailedState onRetry={onRetry} /> : null}

      {bodyState === "few" || bodyState === "maximum" ? (
        <ul className="m-0 list-none p-0">
          {previewTransactions.map((transaction, index) => (
            <li key={transaction.id}>
              <TransactionRow
                transaction={transaction}
                separator={index < previewTransactions.length - 1}
                onSelect={onTransactionSelect}
              />
            </li>
          ))}
          {showSeeAll ? (
            <li>
              <SeeAllRow onSeeAll={onSeeAll} />
            </li>
          ) : null}
        </ul>
      ) : null}
    </GroupedSection>
  )
}
