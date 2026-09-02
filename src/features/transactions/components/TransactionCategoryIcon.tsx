import type { ComponentType, SVGProps } from "react"
import Airplane from "@bolteu/kalep-react-icons/dist/Airplane"
import Basket from "@bolteu/kalep-react-icons/dist/Basket"
import Boat from "@bolteu/kalep-react-icons/dist/Boat"
import Bus from "@bolteu/kalep-react-icons/dist/Bus"
import Card from "@bolteu/kalep-react-icons/dist/Card"
import Carsharing from "@bolteu/kalep-react-icons/dist/Carsharing"
import Cash from "@bolteu/kalep-react-icons/dist/Cash"
import Decline from "@bolteu/kalep-react-icons/dist/Decline"
import Flag from "@bolteu/kalep-react-icons/dist/Flag"
import Food from "@bolteu/kalep-react-icons/dist/Food"
import LogoBolt from "@bolteu/kalep-react-icons/dist/LogoBolt"
import Medical from "@bolteu/kalep-react-icons/dist/Medical"
import NightLife from "@bolteu/kalep-react-icons/dist/NightLife"
import Pass from "@bolteu/kalep-react-icons/dist/Pass"
import Refuel from "@bolteu/kalep-react-icons/dist/Refuel"
import ShoppingBag from "@bolteu/kalep-react-icons/dist/ShoppingBag"
import Train from "@bolteu/kalep-react-icons/dist/Train"
import badgeDeclined from "../assets/badge-declined.svg"
import badgeInflow from "../assets/badge-inflow.svg"
import badgeOutflow from "../assets/badge-outflow.svg"
import iconElectric from "../assets/icon-electric.svg"
import iconHouseUser from "../assets/icon-house-user.svg"
import iconParking from "../assets/icon-parking.svg"
import iconRepair from "../assets/icon-repair.svg"
import {
  badgeForKind,
  resolveThemeForTransaction,
  type MccThemeId,
  type TransactionKind,
} from "../data/mccThemes"

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>

type ThemeIcon =
  | { type: "kalep"; Icon: IconComponent }
  | { type: "asset"; src: string }

/** Figma `_ MCC` (138:7229): see specs/components/mcc-icon.md */
const MCC_ICON_SIZE_PX = 20
const MCC_BADGE_SIZE_PX = 16

/** Icons per Figma `_ MCC` (138:7229). */
const THEME_ICONS: Record<MccThemeId, ThemeIcon> = {
  groceries: { type: "kalep", Icon: Basket },
  restaurants: { type: "kalep", Icon: Food },
  entertainment_bars: { type: "kalep", Icon: NightLife },
  entertainment: { type: "kalep", Icon: Pass },
  travel: { type: "kalep", Icon: Airplane },
  travel_cruise: { type: "kalep", Icon: Boat },
  travel_rentals: { type: "kalep", Icon: Carsharing },
  travel_hotel: { type: "asset", src: iconHouseUser },
  transport_bus: { type: "kalep", Icon: Bus },
  transport_train: { type: "kalep", Icon: Train },
  travel_parking: { type: "asset", src: iconParking },
  medical: { type: "kalep", Icon: Medical },
  shopping: { type: "kalep", Icon: ShoppingBag },
  money: { type: "kalep", Icon: Cash },
  bolt: { type: "kalep", Icon: LogoBolt },
  utilities: { type: "asset", src: iconElectric },
  government: { type: "kalep", Icon: Flag },
  fuel: { type: "kalep", Icon: Refuel },
  auto: { type: "asset", src: iconRepair },
  other: { type: "kalep", Icon: Card },
  decline: { type: "kalep", Icon: Decline },
}

function MccBadge({ src }: { src: string }) {
  return (
    <span
      className="absolute -bottom-mcc-badge-offset -right-mcc-badge-offset flex size-mcc-badge items-center justify-center"
      aria-hidden
    >
      <span className="-scale-y-100 flex-none">
        <img
          src={src}
          alt=""
          width={MCC_BADGE_SIZE_PX}
          height={MCC_BADGE_SIZE_PX}
          className="block aspect-square size-4"
          draggable={false}
        />
      </span>
    </span>
  )
}

export interface TransactionCategoryIconProps {
  mcc: number
  kind: TransactionKind
  themeOverride?: MccThemeId
}

export function TransactionCategoryIcon({
  mcc,
  kind,
  themeOverride,
}: TransactionCategoryIconProps) {
  const theme = resolveThemeForTransaction({ mcc, kind, themeOverride })
  const icon = THEME_ICONS[theme.id]
  const badge = badgeForKind(kind)
  const usesNeutralDeclinedStyle =
    kind === "declined" || (kind === "failed" && theme.id !== "decline")

  const circleClass = usesNeutralDeclinedStyle ? "bg-neutral-secondary" : theme.bgClass
  const iconClass = usesNeutralDeclinedStyle ? "text-secondary" : theme.iconClass

  return (
    <span
      className={`relative flex size-10 shrink-0 items-center justify-center overflow-visible rounded-full p-mcc-pad ${circleClass}`}
      aria-hidden
    >
      {icon.type === "kalep" ? (
        <icon.Icon
          size="sm"
          className={`block size-5 shrink-0 ${iconClass}`}
        />
      ) : (
        <img
          src={icon.src}
          alt=""
          width={MCC_ICON_SIZE_PX}
          height={MCC_ICON_SIZE_PX}
          className={`block aspect-square size-5 shrink-0 ${usesNeutralDeclinedStyle ? "opacity-60" : ""}`}
          draggable={false}
        />
      )}
      {badge === "declined" ? (
        <MccBadge src={badgeDeclined} />
      ) : badge === "inbound" ? (
        <MccBadge src={badgeInflow} />
      ) : badge === "outbound" ? (
        <MccBadge src={badgeOutflow} />
      ) : null}
    </span>
  )
}
