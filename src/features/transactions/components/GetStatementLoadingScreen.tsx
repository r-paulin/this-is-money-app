import { ListItemLayout } from "@bolteu/kalep-react"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

const ROW_COUNT = 4

export interface GetStatementLoadingScreenProps {
  onBack: () => void
}

export function GetStatementLoadingScreen({ onBack }: GetStatementLoadingScreenProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-5 pr-6 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2"
          aria-label="Back"
        >
          <SkeletonCircle size={24} />
          <SkeletonBar width={56} height={14} />
        </button>
      </div>

      <div className="px-6 py-3">
        <SkeletonBar width="60%" height={32} className="rounded" />
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

      <div className="px-6 py-4">
        <SkeletonBar width="100%" height={48} className="rounded-full" />
      </div>
    </div>
  )
}
