import { AppNavbar } from "@/shared/components/AppNavbar"
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
  const [navbarBackHandler, setNavbarBackHandler] = useState<(() => void) | null>(
    null,
  )
  const pendingPopRef = useRef(false)
  const pendingPopToRootRef = useRef(false)

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

  const popToRoot = useCallback(() => {
    if (stack.length <= 1 || isTransitioning || isDragging) return

    pendingPopToRootRef.current = true
    setDirection("pop")
    setIsTransitioning(true)
  }, [isDragging, isTransitioning, stack.length])

  const completeTransition = useCallback(() => {
    if (pendingPopToRootRef.current) {
      pendingPopToRootRef.current = false
      setStack((current) => [current[0]])
    } else if (pendingPopRef.current) {
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
      popToRoot,
      canPop: stack.length > 1,
      isTransitioning,
      direction,
      completeTransition,
      reducedMotion,
      dragOffset,
      setDragOffset,
      isDragging,
      setIsDragging,
      navbarBackHandler,
      setNavbarBackHandler,
    }),
    [
      stack,
      push,
      pop,
      popToRoot,
      isTransitioning,
      direction,
      completeTransition,
      reducedMotion,
      dragOffset,
      isDragging,
      navbarBackHandler,
    ],
  )

  return (
    <NavigationContext.Provider value={value}>
      <div className="relative h-full min-h-dvh overflow-hidden">
        <AppNavbar />
        <NavigationStack />
        {children}
      </div>
    </NavigationContext.Provider>
  )
}
