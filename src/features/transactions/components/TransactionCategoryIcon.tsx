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
  | { type: "kalep"; Icon: IconComponent; size: "sm" | "md" }
  | { type: "asset"; src: string; sizePx: number }

/** Icons per Figma `_ MCC` (138:7229). */
const THEME_ICONS: Record<MccThemeId, ThemeIcon> = {
  groceries: { type: "kalep", Icon: Basket, size: "sm" },
  restaurants: { type: "kalep", Icon: Food, size: "sm" },
  entertainment_bars: { type: "kalep", Icon: NightLife, size: "sm" },
  entertainment: { type: "kalep", Icon: Pass, size: "sm" },
  travel: { type: "kalep", Icon: Airplane, size: "sm" },
  travel_cruise: { type: "kalep", Icon: Boat, size: "sm" },
  travel_rentals: { type: "kalep", Icon: Carsharing, size: "sm" },
  travel_hotel: { type: "asset", src: iconHouseUser, sizePx: 16 },
  transport_bus: { type: "kalep", Icon: Bus, size: "sm" },
  transport_train: { type: "kalep", Icon: Train, size: "sm" },
  travel_parking: { type: "asset", src: iconParking, sizePx: 16 },
  medical: { type: "kalep", Icon: Medical, size: "sm" },
  shopping: { type: "kalep", Icon: ShoppingBag, size: "sm" },
  money: { type: "kalep", Icon: Cash, size: "sm" },
  bolt: { type: "kalep", Icon: LogoBolt, size: "md" },
  utilities: { type: "asset", src: iconElectric, sizePx: 16 },
  government: { type: "kalep", Icon: Flag, size: "sm" },
  fuel: { type: "kalep", Icon: Refuel, size: "sm" },
  auto: { type: "asset", src: iconRepair, sizePx: 16 },
  other: { type: "kalep", Icon: Card, size: "sm" },
  decline: { type: "kalep", Icon: Decline, size: "md" },
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

  return (
    <span className="relative inline-flex size-9 shrink-0 items-center justify-center">
      <span
        className={`flex size-9 items-center justify-center rounded-full ${theme.bgClass}`}
        aria-hidden
      >
        {icon.type === "kalep" ? (
          <icon.Icon size={icon.size} className={theme.iconClass} />
        ) : (
          <img
            src={icon.src}
            alt=""
            width={icon.sizePx}
            height={icon.sizePx}
            className="block"
            draggable={false}
          />
        )}
      </span>
      {badge ? (
        <span
          className="absolute -bottom-1 -right-1 flex size-4 -scale-y-100 items-center justify-center"
          aria-hidden
        >
          <img
            src={badge === "inbound" ? badgeInflow : badgeOutflow}
            alt=""
            width={16}
            height={16}
            className="block size-4"
            draggable={false}
          />
        </span>
      ) : null}
    </span>
  )
}
