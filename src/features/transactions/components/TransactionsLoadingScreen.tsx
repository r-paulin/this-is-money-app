import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

const ROW_COUNT = 3

export function TransactionSkeletonRows() {
  return (
    <div aria-hidden>
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <SkeletonListItem key={index} />
      ))}
    </div>
  )
}

function SkeletonListItem() {
  return (
    <div className="flex items-center px-6 py-3">
      <SkeletonCircle size={40} />
      <div className="flex min-w-0 flex-1 flex-col pl-4">
        <div className="py-0.5">
          <SkeletonBar width="100%" height={12} />
        </div>
        <SkeletonBar width="40%" height={10} />
      </div>
    </div>
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

      <div className="px-6 pb-2 pt-5">
        <SkeletonBar width="40%" height={16} />
      </div>

      <TransactionSkeletonRows />
    </div>
  )
}
