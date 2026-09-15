import type { CardThumbnailColor, HomeCardRowKind } from "../home.types"
import physicalBlackLocked from "../assets/card-thumbnails/physical-black-locked.svg"
import physicalBlack from "../assets/card-thumbnails/physical-black.svg"
import physicalGreenLocked from "../assets/card-thumbnails/physical-green-locked.svg"
import physicalGreen from "../assets/card-thumbnails/physical-green.svg"
import virtualBlackLocked from "../assets/card-thumbnails/virtual-black-locked.svg"
import virtualBlack from "../assets/card-thumbnails/virtual-black.svg"
import virtualGreenLocked from "../assets/card-thumbnails/virtual-green-locked.svg"
import virtualGreen from "../assets/card-thumbnails/virtual-green.svg"

export interface CardThumbnailAssetKey {
  kind: HomeCardRowKind
  color?: CardThumbnailColor
  locked?: boolean
  blocked?: boolean
  lost?: boolean
  stolen?: boolean
}

export function getCardThumbnailSrc({
  kind,
  color = "green",
  locked,
  blocked,
  lost,
  stolen,
}: CardThumbnailAssetKey): string | null {
  if (kind === "offer") return null

  const isLocked = Boolean(locked || blocked || lost || stolen)
  const isVirtual = kind === "virtual"

  if (isVirtual && color === "green") {
    return isLocked ? virtualGreenLocked : virtualGreen
  }
  if (!isVirtual && color === "green") {
    return isLocked ? physicalGreenLocked : physicalGreen
  }
  if (isVirtual && color === "black") {
    return isLocked ? virtualBlackLocked : virtualBlack
  }
  return isLocked ? physicalBlackLocked : physicalBlack
}
