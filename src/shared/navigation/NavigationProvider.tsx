import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { NavigationContext } from "./navigationContext"
import { NavigationStack } from "./NavigationStack"
import type { ScreenEntry, TransitionDirection } from "./navigation.types"

function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReducedMotion(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return reducedMotion
}

export interface NavigationProviderProps {
  initialScreen: ScreenEntry
  children?: ReactNode
}

export function NavigationProvider({
  initialScreen,
  children,
}: NavigationProviderProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [stack, setStack] = useState<ScreenEntry[]>([initialScreen])
  const [direction, setDirection] = useState<TransitionDirection | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const pendingPopRef = useRef(false)

  const push = useCallback(
    (entry: ScreenEntry) => {
      if (isTransitioning || isDragging) return

      setDirection("push")
      setIsTransitioning(true)
      setStack((current) => [...current, entry])
    },
    [isDragging, isTransitioning],
  )

  const pop = useCallback(() => {
    if (stack.length <= 1 || isTransitioning || isDragging) return

    pendingPopRef.current = true
    setDirection("pop")
    setIsTransitioning(true)
  }, [isDragging, isTransitioning, stack.length])

  const completeTransition = useCallback(() => {
    if (pendingPopRef.current) {
      pendingPopRef.current = false
      setStack((current) => current.slice(0, -1))
    }

    setDirection(null)
    setIsTransitioning(false)
    setDragOffset(0)
    setIsDragging(false)
  }, [])

  const value = useMemo(
    () => ({
      stack,
      push,
      pop,
      canPop: stack.length > 1,
      isTransitioning,
      direction,
      completeTransition,
      reducedMotion,
      dragOffset,
      setDragOffset,
      isDragging,
      setIsDragging,
    }),
    [
      stack,
      push,
      pop,
      isTransitioning,
      direction,
      completeTransition,
      reducedMotion,
      dragOffset,
      isDragging,
    ],
  )

  return (
    <NavigationContext.Provider value={value}>
      <NavigationStack />
      {children}
    </NavigationContext.Provider>
  )
}
