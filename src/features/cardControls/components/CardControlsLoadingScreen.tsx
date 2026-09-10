import { SkeletonBar } from "@/shared/components/skeleton/SkeletonPlaceholders"
import {
  DESIGN_HEIGHT_CONTROLS,
  DESIGN_WIDTH_CONTROLS,
} from "@/shared/components/PaymentCard/paymentCard.config"
import { CARD_CONTROLS_LOADING_SKELETON_COUNT } from "../data/cardControlItems"
import { CardControlSkeletonRow } from "./CardControlSkeletonRow"
import "./card-controls-shimmer.css"

export function CardControlsLoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="min-h-[250px] shrink-0">
        <div className="flex flex-col items-center px-6 pb-6 pt-4">
          <div className="card-control-shimmer" aria-hidden>
            <div
              className="rounded-card bg-neutral-secondary"
              style={{ width: DESIGN_WIDTH_CONTROLS, height: DESIGN_HEIGHT_CONTROLS }}
            />
          </div>
          <div className="card-control-shimmer mt-4 flex justify-center" aria-hidden>
            <SkeletonBar width={215} height={20} />
          </div>
        </div>
      </div>

      <ul className="m-0 list-none p-0">
        {Array.from({ length: CARD_CONTROLS_LOADING_SKELETON_COUNT }, (_, index) => {
          const isLast = index === CARD_CONTROLS_LOADING_SKELETON_COUNT - 1

          return (
            <li key={index}>
              <CardControlSkeletonRow separator={!isLast} shimmer />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
