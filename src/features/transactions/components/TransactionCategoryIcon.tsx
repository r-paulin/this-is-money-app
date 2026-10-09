import type { ComponentType, SVGProps } from "react"
import Airplane from "@bolteu/kalep-react-icons/dist/Airplane"
import Basket from "@bolteu/kalep-react-icons/dist/Basket"
import Boat from "@bolteu/kalep-react-icons/dist/Boat"
import Bus from "@bolteu/kalep-react-icons/dist/Bus"
import Card from "@bolteu/kalep-react-icons/dist/Card"
import Carsharing from "@bolteu/kalep-react-icons/dist/Carsharing"
import ArrowRightUp from "@bolteu/kalep-react-icons/dist/ArrowRightUp"
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
import iconCashbackColored from "../assets/icon-cashback-colored.svg"
import iconElectric from "../assets/icon-electric.svg"
import iconHouseUser from "../assets/icon-house-user.svg"
import iconParking from "../assets/icon-parking.svg"
import iconRepair from "../assets/icon-repair.svg"
import {
  badgeForKind,
  resolveCategoryMark,
  type MccThemeId,
  type TransactionKind,
} from "../data/mccThemes"

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>

type ThemeIcon =
  | { type: "kalep"; Icon: IconComponent }
  | { type: "asset"; src: string }

/** Figma `_ MCC` (138:7229): see specs/components/mcc-icon.md */
const MCC_ICON_SIZE_PX = 20
const MCC_BADGE_SIZE_PX = 20

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
  /** Figma cashback_colored 9526:168300 */
  cashback: { type: "asset", src: iconCashbackColored },
  decline: { type: "kalep", Icon: Decline },
}

function MccBadge({ src }: { src: string }) {
  return (
    <span
      className="absolute -bottom-mcc-badge-offset -right-mcc-badge-offset flex size-5 items-center justify-center overflow-visible"
      aria-hidden
    >
      <span className="relative block size-5">
        <img
          src={src}
          alt=""
          width={MCC_BADGE_SIZE_PX}
          height={MCC_BADGE_SIZE_PX}
          className="absolute inset-0 block size-full max-w-none"
          draggable={false}
        />
      </span>
    </span>
  )
}

/** Figma decline badge: 16px slot, graphic overflows 12.5%, flipped vertically. */
function DeclineBadge({ src }: { src: string }) {
  return (
    <span
      className="absolute -bottom-mcc-badge-offset -right-mcc-badge-offset flex size-mcc-badge items-center justify-center overflow-visible"
      aria-hidden
    >
      <span className="-scale-y-100">
        <span className="relative block size-mcc-badge">
          <span className="absolute inset-[-12.5%]">
            <img
              src={src}
              alt=""
              width={MCC_BADGE_SIZE_PX}
              height={MCC_BADGE_SIZE_PX}
              className="block size-full max-w-none"
              draggable={false}
            />
          </span>
        </span>
      </span>
    </span>
  )
}

export interface TransactionCategoryIconProps {
  mcc: number
  kind: TransactionKind
  themeOverride?: MccThemeId
  /** Detail declined circles are white. The list uses the grey neutral circle. */
  surface?: "list" | "detail"
}

function ThemeGlyph({
  theme,
  iconClass,
  muted,
}: {
  theme: ThemeIcon
  iconClass: string
  muted: boolean
}) {
  if (theme.type === "kalep") {
    return <theme.Icon size="sm" className={`block size-5 shrink-0 ${iconClass}`} />
  }
  if (muted) {
    return (
      <span
        className={`block size-5 shrink-0 bg-current ${iconClass}`}
        style={{
          WebkitMask: `url(${theme.src}) center / contain no-repeat`,
          mask: `url(${theme.src}) center / contain no-repeat`,
        }}
      />
    )
  }
  return (
    <img
      src={theme.src}
      alt=""
      width={MCC_ICON_SIZE_PX}
      height={MCC_ICON_SIZE_PX}
      className="block aspect-square size-5 shrink-0"
      draggable={false}
    />
  )
}

export function TransactionCategoryIcon({
  mcc,
  kind,
  themeOverride,
  surface = "list",
}: TransactionCategoryIconProps) {
  const mark = resolveCategoryMark({ mcc, kind, themeOverride })

  if (mark.kind === "arrow-in" || mark.kind === "arrow-out") {
    return (
      <span
        className="relative flex size-10 shrink-0 items-center justify-center overflow-visible rounded-full bg-mcc-money p-mcc-pad"
        aria-hidden
      >
        <ArrowRightUp
          size="sm"
          className={`block size-5 shrink-0 text-static-key-light ${mark.kind === "arrow-in" ? "rotate-180" : ""}`}
        />
      </span>
    )
  }

  const muted = kind === "declined" || kind === "failed"
  const theme = THEME_ICONS[mark.theme.id]
  const circleClass = muted
    ? surface === "detail"
      ? "bg-layer-floor-1"
      : "bg-neutral-secondary"
    : mark.theme.bgClass
  const iconClass = muted ? "text-secondary" : mark.theme.iconClass
  const badge = badgeForKind(kind)

  return (
    <span
      className={`relative flex size-10 shrink-0 items-center justify-center overflow-visible rounded-full p-mcc-pad ${circleClass}`}
      aria-hidden
    >
      <ThemeGlyph theme={theme} iconClass={iconClass} muted={muted} />
      {badge === "declined" ? (
        <DeclineBadge src={badgeDeclined} />
      ) : badge === "inbound" ? (
        <MccBadge src={badgeInflow} />
      ) : badge === "outbound" ? (
        <MccBadge src={badgeOutflow} />
      ) : null}
    </span>
  )
}
