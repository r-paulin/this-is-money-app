import { ListItemLayout } from "@bolteu/kalep-react"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"
import "./card-controls-shimmer.css"

export interface CardControlSkeletonRowProps {
  separator?: boolean
  shimmer?: boolean
}

export function CardControlSkeletonRow({
  separator = true,
  shimmer = false,
}: CardControlSkeletonRowProps) {
  const shimmerClassName = shimmer ? "card-control-shimmer" : undefined

  return (
    <ListItemLayout
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      renderStartSlot={() => (
        <span className={shimmerClassName}>
          <SkeletonCircle />
        </span>
      )}
      primary={
        <span className={shimmerClassName}>
          <SkeletonBar width="45%" />
        </span>
      }
    />
  )
}
