import { ListItemLayout } from "@bolteu/kalep-react"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

const LOADING_LIST_COUNT = 3

export function CardControlsLoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="min-h-[250px] shrink-0">
        <div className="flex justify-center px-6 pb-6 pt-4">
          <div
            className="h-[218px] w-full max-w-[21.5625rem] rounded-card bg-neutral-secondary"
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
