import type {
  CardType,
  HomeBannerId,
  HomeCardRow,
  HomeNotification,
} from "../home.types"

const MS_PER_DAY = 86_400_000

function isCardUnavailable(card: HomeCardRow): boolean {
  return Boolean(card.locked || card.blocked || card.lost || card.stolen)
}

/** Prefer virtual when both kinds are locked; otherwise first unavailable card. */
export function getLockedCardNotification(
  cards: HomeCardRow[],
): HomeNotification | null {
  const unavailable = cards.filter(
    (card) =>
      (card.kind === "virtual" || card.kind === "physical") && isCardUnavailable(card),
  )
  if (unavailable.length === 0) return null

  const card =
    unavailable.find((row) => row.kind === "virtual") ?? unavailable[0]!
  const lastFour = card.lastFour ?? "••••"
  const cardType: CardType = card.kind === "physical" ? "physical" : "virtual"

  return {
    tone: "warning",
    accent: `Your card ·· ${lastFour} is locked.`,
    body: " Unlock it to start making payments again",
    actionLabel: "Unlock the card",
    cardType,
  }
}

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

/** Next page after a horizontal drag. Negative dx moves toward the next banner. */
export function bannerSnapIndex(
  index: number,
  dx: number,
  step: number,
  count: number,
): number {
  const last = Math.max(count - 1, 0)
  if (step <= 0) return Math.min(Math.max(index, 0), last)
  const threshold = step * 0.2
  let next = index
  if (dx <= -threshold) next += 1
  else if (dx >= threshold) next -= 1
  return Math.min(Math.max(next, 0), last)
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

export function getCardStatusLine(
  card: HomeCardRow,
  now: number,
): string | undefined {
  if (card.kind === "offer") return undefined

  if (card.kind === "virtual") {
    if (card.lost) return "Reported lost"
    if (card.stolen) return "Reported stolen"
    if (card.blocked) return "Blocked"
    if (card.locked) return "Locked"
    return undefined
  }

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

/** @deprecated Use getCardStatusLine */
export function getPhysicalCardStatusLine(
  card: HomeCardRow,
  now: number,
): string | undefined {
  return getCardStatusLine(card, now)
}

export function isPhysicalCardStatusNegative(statusLine: string | undefined): boolean {
  if (!statusLine) return false
  return statusLine === "Expired" || statusLine.startsWith("Expires in")
}
