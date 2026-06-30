import { ListItemLayout } from "@bolteu/kalep-react"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

const LOADING_LIST_COUNT = 3

export interface CardControlsLoadingScreenProps {
  onBack: () => void
}

export function CardControlsLoadingScreen({ onBack }: CardControlsLoadingScreenProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="min-h-[306px] shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 pt-6"
          aria-label="Back"
        >
          <SkeletonCircle />
          <SkeletonBar width={56} />
        </button>

        <div className="flex justify-center px-6 pb-6 pt-4">
          <div
            className="h-[218px] w-full max-w-[21.5625rem] rounded-[12px] bg-neutral-secondary"
            aria-hidden
          />
        </div>
      </div>

      <ul className="m-0 list-none p-0">
        {Array.from({ length: LOADING_LIST_COUNT }, (_, index) => {
          const isLast = index === LOADING_LIST_COUNT - 1

          return (
            <li key={index}>
              <ListItemLayout
                separator={!isLast}
                paddingStart={6}
                paddingEnd={6}
                renderStartSlot={() => <SkeletonCircle />}
                primary={<SkeletonBar width="45%" />}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
