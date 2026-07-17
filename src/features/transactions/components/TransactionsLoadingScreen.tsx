import { ListItemLayout } from "@bolteu/kalep-react"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

const ROW_COUNT = 3

export interface TransactionsLoadingScreenProps {
  onBack: () => void
}

export function TransactionsLoadingScreen({ onBack }: TransactionsLoadingScreenProps) {
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

        <div className="pb-3 pt-6">
          <SkeletonBar width="55%" height={32} className="rounded" />
        </div>
      </div>

      <div className="px-6 pb-2 pt-5">
        <SkeletonBar width={72} height={14} className="mb-2" />
        <SkeletonBar width={120} height={12} />
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
                renderStartSlot={() => <SkeletonCircle size={36} />}
                primary={<SkeletonBar width="55%" height={14} className="my-[5px]" />}
                secondary={<SkeletonBar width="35%" height={12} className="my-1" />}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
