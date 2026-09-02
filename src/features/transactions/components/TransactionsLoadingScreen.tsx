import { ListItemLayout } from "@bolteu/kalep-react"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

const ROW_COUNT = 3

function SkeletonListItem({ separator }: { separator: boolean }) {
  return (
    <ListItemLayout
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      primary={<SkeletonBar width="100%" height={20} />}
      secondary={<SkeletonBar width="40%" height={20} />}
      renderStartSlot={() => <SkeletonCircle size={40} />}
      renderEndSlot={() => <SkeletonBar width={72} height={20} />}
    />
  )
}

export function TransactionsLoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-6 py-3">
        <SkeletonBar width="55%" height={32} className="rounded" />
      </div>

      <div className="flex items-start gap-3 px-6">
        <SkeletonBar width="100%" height={56} className="min-w-0 flex-1 rounded-lg" />
        <SkeletonBar width={56} height={56} className="shrink-0 rounded-compact" />
      </div>

      <div className="px-6 pb-2 pt-5">
        <SkeletonBar width="50%" height={20} className="rounded" />
      </div>

      <div>
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <SkeletonListItem key={index} separator={index < ROW_COUNT - 1} />
        ))}
      </div>
    </div>
  )
}
