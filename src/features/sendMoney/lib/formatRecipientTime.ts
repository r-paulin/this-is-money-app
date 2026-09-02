const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function calendarDaysBetween(earlier: Date, later: Date): number {
  const startEarlier = startOfLocalDay(earlier).getTime()
  const startLater = startOfLocalDay(later).getTime()
  return Math.round((startLater - startEarlier) / (1000 * 60 * 60 * 24))
}

export function formatRecipientRelativeTime(transferredAt: number, now = Date.now()): string {
  const date = new Date(transferredAt)
  const nowDate = new Date(now)
  const diffMs = now - transferredAt
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const dayDiff = calendarDaysBetween(date, nowDate)

  if (diffMinutes < 10) {
    return "Just now"
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`
  }

  if (diffHours < 6 && dayDiff === 0) {
    return `${diffHours} hours ago`
  }

  if (dayDiff === 0) {
    return "Today"
  }

  if (dayDiff === 1) {
    return "Yesterday"
  }

  if (dayDiff >= 2 && dayDiff <= 10) {
    return `${dayDiff} days ago`
  }

  if (dayDiff > 10 && dayDiff < 365) {
    return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`
  }

  return `${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`
}
