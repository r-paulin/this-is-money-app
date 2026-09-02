import { ListItemLayout } from "@bolteu/kalep-react"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

const PERIOD_ROW_COUNT = 4
const FORMAT_ROW_COUNT = 2

export function GetStatementLoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-6 py-3">
        <SkeletonBar width="60%" height={32} className="rounded" />
      </div>

      <ul className="m-0 list-none p-0">
        {Array.from({ length: PERIOD_ROW_COUNT }, (_, index) => {
          const isLast = index === PERIOD_ROW_COUNT - 1
          return (
            <li key={`period-${index}`}>
              <ListItemLayout
                separator={!isLast}
                paddingStart={6}
                paddingEnd={6}
                primary={<SkeletonBar width="40%" height={14} className="my-[5px]" />}
                secondary={
                  index < 3 ? (
                    <SkeletonBar width="28%" height={12} className="my-1" />
                  ) : undefined
                }
                renderEndSlot={() => <SkeletonCircle size={24} />}
              />
            </li>
          )
        })}
      </ul>

      <ListItemLayout
        separator={false}
        paddingStart={6}
        paddingEnd={6}
        paddingTop={3}
        paddingBottom={2}
        primary={<SkeletonBar width="36%" height={16} className="my-1" />}
        secondary={<SkeletonBar width="55%" height={12} className="my-1" />}
      />

      <ul className="m-0 list-none p-0">
        {Array.from({ length: FORMAT_ROW_COUNT }, (_, index) => {
          const isLast = index === FORMAT_ROW_COUNT - 1
          return (
            <li key={`format-${index}`}>
              <ListItemLayout
                separator={!isLast}
                paddingStart={6}
                paddingEnd={6}
                paddingTop={2}
                paddingBottom={2}
                primary={<SkeletonBar width="20%" height={14} className="my-[5px]" />}
                renderEndSlot={() => <SkeletonCircle size={24} />}
              />
            </li>
          )
        })}
      </ul>

      <div className="px-6 py-4">
        <SkeletonBar width="100%" height={48} className="rounded-full" />
      </div>
    </div>
  )
}
