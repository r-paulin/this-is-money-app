import type { ReactNode } from "react"

export type ScreenEntry = {
  key: string
  render: () => ReactNode
}

export type TransitionDirection = "push" | "pop"

export type NavigationContextValue = {
  stack: ScreenEntry[]
  push: (entry: ScreenEntry) => void
  pop: () => void
  popToRoot: () => void
  canPop: boolean
  isTransitioning: boolean
  direction: TransitionDirection | null
  completeTransition: () => void
  reducedMotion: boolean
  /** Interactive swipe drag offset in px (0 = resting). */
  dragOffset: number
  setDragOffset: (offset: number) => void
  isDragging: boolean
  setIsDragging: (dragging: boolean) => void
  /** When set, AppNavbar back invokes this instead of pop(). */
  navbarBackHandler: (() => void) | null
  setNavbarBackHandler: (handler: (() => void) | null) => void
}
