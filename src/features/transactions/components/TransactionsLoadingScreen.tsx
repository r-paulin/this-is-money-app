import { ListItemLayout } from "@bolteu/kalep-react"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"
import "./activity-search-states.css"

const ROW_COUNT = 3

/** Figma 8845:53130 — section label bar + three list rows while search settles. */
export function TransactionSearchSkeleton() {
  return (
    <div
      className="activity-search-skeleton is-pulsing"
      aria-busy
      aria-label="Searching activity"
    >
      <ActivityListSkeleton />
    </div>
  )
}

function ActivityListSkeleton() {
  return (
    <div aria-hidden>
      <div className="flex items-center px-6 pb-2 pt-5">
        <SkeletonBar width="40%" height={16} className="rounded" />
      </div>
      <TransactionSkeletonRows />
    </div>
  )
}

export function TransactionSkeletonRows() {
  return (
    <ul className="m-0 list-none p-0" aria-hidden>
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <li key={index}>
          <SkeletonListItem separator={index < ROW_COUNT - 1} />
        </li>
      ))}
    </ul>
  )
}

function SkeletonListItem({ separator }: { separator: boolean }) {
  return (
    <ListItemLayout
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      renderStartSlot={() => <SkeletonCircle size={40} />}
      primary={<SkeletonBar width="100%" height={14} className="my-[5px]" />}
      secondary={<SkeletonBar width="40%" height={12} className="my-1" />}
    />
  )
}

export function TransactionsLoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-6 pb-5">
        <SkeletonBar width="50%" height={24} />
      </div>

      <div className="flex items-start pr-6">
        <div className="min-w-0 flex-1 pl-6 pr-3">
          <SkeletonBar width="100%" height={56} className="!rounded-full" />
        </div>
        <SkeletonBar width={56} height={56} className="shrink-0 !rounded-full" />
      </div>

      <ActivityListSkeleton />
    </div>
  )
}
