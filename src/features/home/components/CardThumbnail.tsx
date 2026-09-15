import Plus from "@bolteu/kalep-react-icons/dist/Plus"
import { getCardThumbnailSrc } from "../lib/cardThumbnailAssets"
import type { CardThumbnailColor, HomeCardRowKind } from "../home.types"

export interface CardThumbnailProps {
  kind: HomeCardRowKind
  color?: CardThumbnailColor
  locked?: boolean
  blocked?: boolean
  lost?: boolean
  stolen?: boolean
}

export function CardThumbnail(props: CardThumbnailProps) {
  const { kind } = props

  if (kind === "offer") {
    return (
      <div
        className="flex h-[30px] w-12 items-center justify-center rounded-[2px] bg-card-thumb-add"
        aria-hidden
      >
        <Plus size="sm" className="text-secondary" />
      </div>
    )
  }

  const src = getCardThumbnailSrc(props)

  return (
    <img
      src={src ?? undefined}
      alt=""
      aria-hidden
      className="h-[30px] w-12 shrink-0 rounded-[2px]"
      width={48}
      height={30}
    />
  )
}
