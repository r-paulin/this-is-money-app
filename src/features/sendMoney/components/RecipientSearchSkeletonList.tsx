import { ListItemLayout } from "@bolteu/kalep-react"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

const ROW_COUNT = 3

/** Skeleton rows shown while recipient search results are loading. */
export function RecipientSearchSkeletonList() {
  return (
    <ul className="m-0 list-none p-0" aria-label="Searching recipients" aria-busy>
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
  )
}
