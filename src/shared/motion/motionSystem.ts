/**
 * Motion tokens v1. Use recipes from motionSystem, not loose durations.
 * CSS mirror: `src/shared/styles/tokens.css`.
 */

export type Platform = "ios" | "android"

export const duration = {
  xs: 0.1,
  sm: 0.2,
  md: 0.3,
  lg: 0.4,
  xl: 0.5,
} as const

export const ease = {
  standard: [0.2, 0, 0, 1],
  enter: [0.05, 0.7, 0.1, 1],
  exit: [0.3, 0, 0.8, 0.15],
  ios: [0.32, 0.72, 0, 1],
} as const

export const spring = {
  smooth: { type: "spring", visualDuration: 0.4, bounce: 0 },
  snappy: { type: "spring", visualDuration: 0.3, bounce: 0.15 },
  bouncy: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
} as const

export const distance = { sm: 4, md: 8, lg: 32 } as const

export const scale = { sm: 0.97, lg: 0.5 } as const

export const stagger = 0.04

export const press = {
  down: {
    scale: scale.sm,
    transition: { duration: duration.xs, ease: ease.standard },
  },
  up: { scale: 1, transition: spring.snappy },
}

export const patterns = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: spring.smooth },
    exit: { opacity: 0, transition: spring.snappy },
  },
  crossFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: spring.smooth,
  },
  spinnerDelay: duration.sm,
  riseIn: {
    initial: { opacity: 0, y: distance.md },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.md, ease: ease.enter },
    },
    exit: {
      opacity: 0,
      y: distance.md,
      transition: { duration: duration.sm, ease: ease.exit },
    },
  },
  confirm: {
    initial: { opacity: 0, scale: scale.sm },
    animate: { opacity: 1, scale: 1 },
    transition: spring.smooth,
  },
  popIn: {
    initial: { opacity: 0, scale: scale.lg },
    animate: { opacity: 1, scale: 1 },
    transition: spring.bouncy,
  },
  listInsert: { duration: duration.md, ease: ease.standard },
  disclosure: { duration: duration.md, ease: ease.standard },
  toastHold: 4000,
}

const forks = {
  ios: {
    nav: {
      enter: { duration: duration.xl, ease: ease.ios },
      exit: { duration: duration.lg, ease: ease.ios },
      parallax: "30%",
    },
    sheet: {
      enter: { duration: duration.xl, ease: ease.ios },
      exit: { duration: duration.lg, ease: ease.ios },
      scrim: 0.28,
      backdropScale: 0.93,
      elastic: 0.12,
    },
    dialog: {
      enter: { duration: duration.sm, ease: ease.ios },
      exit: { duration: duration.xs, ease: ease.ios },
      scale: 0.97,
      scrim: 0.28,
      fade: { enter: spring.smooth, exit: spring.snappy },
    },
    modal: {
      enter: { duration: duration.xl, ease: ease.ios },
      exit: { duration: duration.lg, ease: ease.ios },
      kind: "cover",
    },
  },
  android: {
    nav: {
      enter: { duration: duration.lg, ease: ease.standard },
      exit: { duration: duration.md, ease: ease.standard },
      parallax: "32px",
    },
    sheet: {
      enter: { duration: duration.lg, ease: ease.enter },
      exit: { duration: duration.md, ease: ease.exit },
      scrim: 0.28,
      backdropScale: 1,
      elastic: 0,
    },
    dialog: {
      enter: { duration: duration.md, ease: ease.enter },
      exit: { duration: duration.sm, ease: ease.exit },
      scale: 0.92,
      scrim: 0.28,
      fade: { enter: spring.smooth, exit: spring.snappy },
    },
    modal: {
      enter: { duration: duration.lg, ease: ease.enter },
      exit: { duration: duration.md, ease: ease.exit },
      scale: 0.92,
      kind: "fadeScale",
      fade: { enter: spring.smooth, exit: spring.snappy },
    },
  },
} as const

/** Reduce Motion: fades use duration.sm + ease.standard; travel clears. */
export function reduce<T>(recipe: T): T {
  const walk = (value: unknown, key?: string): unknown => {
    if (key === "ease") return ease.standard
    if (key === "duration" && typeof value === "number") return duration.sm
    if ((key === "x" || key === "y") && typeof value === "number") return 0
    if (key === "scale" && typeof value === "number") return 1
    if (key === "delay" && typeof value === "number") return 0
    if (Array.isArray(value)) return value.map((item) => walk(item))
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>
      if (record.type === "spring") {
        return { duration: duration.sm, ease: ease.standard }
      }
      const out: Record<string, unknown> = {}
      for (const entryKey of Object.keys(record)) {
        out[entryKey] = walk(record[entryKey], entryKey)
      }
      return out
    }
    return value
  }
  return walk(recipe) as T
}

/** Resolve on the client only (after hydration), never at import time. */
export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "android"
  const ua = navigator.userAgent
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  return isIOS ? "ios" : "android"
}

export function getRecipes(platform: Platform = detectPlatform()) {
  return forks[platform]
}

export function applyPlatformAttribute(
  platform: Platform = detectPlatform(),
): void {
  if (typeof document === "undefined") return
  document.documentElement.dataset.platform = platform
}

/** Resolve `--motion-nav-parallax` (30% or 32px) to pixels for interactive drag. */
export function readNavParallaxPx(containerWidth: number): number {
  if (typeof document === "undefined" || containerWidth <= 0) return 0
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--motion-nav-parallax")
    .trim()
  if (!raw) return 0
  if (raw.endsWith("%")) {
    const percent = Number.parseFloat(raw)
    return Number.isFinite(percent) ? (percent / 100) * containerWidth : 0
  }
  const px = Number.parseFloat(raw)
  return Number.isFinite(px) ? px : 0
}
