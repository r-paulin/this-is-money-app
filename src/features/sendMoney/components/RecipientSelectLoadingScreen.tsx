import { ListItemLayout } from "@bolteu/kalep-react"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

const ROW_COUNT = 3

export function RecipientSelectLoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-6 py-3">
        <SkeletonBar width="70%" height={32} className="rounded" />
      </div>

      <div className="px-6 pb-4">
        <SkeletonBar width="100%" height={56} className="rounded-lg" />
      </div>

      <div className="px-6 pb-2 pt-1">
        <SkeletonBar width={96} height={14} />
      </div>

      <ul className="m-0 list-none p-0">
        {Array.from({ length: ROW_COUNT }, (_, index) => {
          const isLast = index === ROW_COUNT - 1
          return (
            <li key={index}>
              <ListItemLayout
                separator={!isLast}
                paddingStart={6}
                paddingEnd={6}
                renderStartSlot={() => <SkeletonCircle size={40} />}
                primary={<SkeletonBar width="55%" height={14} className="my-[5px]" />}
                secondary={<SkeletonBar width="40%" height={12} className="my-1" />}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
