import type { HomeBannerId, HomeCardRow } from "../home.types"

const MS_PER_DAY = 86_400_000

export function shouldShowSeeAll(transactionCount: number): boolean {
  return transactionCount > 4
}

export function isSendMoneyDisabled(
  balanceCents: number,
  balanceState: "loading" | "ready" | "failed",
): boolean {
  if (balanceState !== "ready") return true
  return balanceCents === 0
}

export function bannerSliderIsSingle(visibleCount: number): boolean {
  return visibleCount <= 1
}

export function shouldShowPhysicalOffer(cards: HomeCardRow[]): boolean {
  return !cards.some((card) => card.kind === "physical")
}

export function filterEligibleBanners(
  banners: HomeBannerId[],
  physicalOrdered: boolean,
): HomeBannerId[] {
  return banners.filter((id) => {
    if (id === "GetPhysicalCard" && !physicalOrdered) return false
    return true
  })
}

export function getActivityHeaderCopy(
  state: "empty" | "loading" | "ready" | "failed",
  transactionCount: number,
): string {
  if (state === "empty" || state === "failed") return "Activity"
  if (state === "loading" || transactionCount > 0) return "All activity"
  return "Activity"
}

export function getActivityBodyState(
  fetchState: "loading" | "ready" | "failed",
  transactionCount: number,
): "empty" | "loading" | "few" | "maximum" | "failed" {
  if (fetchState === "loading") return "loading"
  if (fetchState === "failed") return "failed"
  if (transactionCount === 0) return "empty"
  if (transactionCount > 4) return "maximum"
  return "few"
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function getPhysicalCardStatusLine(
  card: HomeCardRow,
  now: number,
): string | undefined {
  if (card.kind !== "physical") return undefined

  if (card.expired) return "Expired"
  if (card.renewing) return "Renewing · new card on its way"
  if (card.daysToPrintedExpiry != null && card.daysToPrintedExpiry <= 30) {
    return "Expires in 30 days"
  }
  if (card.lost) return "Reported lost"
  if (card.stolen) return "Reported stolen"
  if (card.blocked) return "Blocked"
  if (card.locked) return "Locked"

  const phase = card.deliveryPhase
  if (!phase) return undefined

  const nowDate = new Date(now)

  if (phase === "preparing") return "Being prepared"

  if (phase === "in_delivery") {
    if (card.deliveryMaxEta != null && now > card.deliveryMaxEta) {
      return "Card hasn't arrived?"
    }
    if (
      card.deliveryMinEta != null &&
      !isSameCalendarDay(nowDate, new Date(card.deliveryMinEta)) &&
      now >= card.deliveryMinEta - 3 * MS_PER_DAY
    ) {
      return "Arriving in a few days"
    }
    return "On its way · 6–12 working days"
  }

  if (phase === "arriving_soon") return "Arriving in a few days"
  if (phase === "overdue") return "Card hasn't arrived?"

  return undefined
}

export function isPhysicalCardStatusNegative(statusLine: string | undefined): boolean {
  if (!statusLine) return false
  return statusLine === "Expired" || statusLine.startsWith("Expires in")
}
