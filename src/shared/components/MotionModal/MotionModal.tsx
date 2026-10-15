import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type TransitionEvent,
} from "react"
import { createPortal } from "react-dom"
import { DeviceShellContext } from "@/shared/context/deviceShellContext"
import { getRecipes } from "@/shared/motion/motionSystem"
import "./motion-modal.css"

export type MotionModalPhase = "enter" | "idle" | "exit"

export interface MotionModalProps {
  open: boolean
  children: ReactNode
  /** Fires when enter settles (`idle`) or leaves idle. */
  onReadyChange?: (ready: boolean) => void
  /** After exit transition finishes and the node unmounts. */
  onExited?: () => void
  className?: string
}

/** Exit fallback if `transitionend` is skipped (interrupted / reduced motion). */
const EXIT_FALLBACK_MS = 600

export function MotionModal({
  open,
  children,
  onReadyChange,
  onExited,
  className = "",
}: MotionModalProps) {
  const { portalRoot } = useContext(DeviceShellContext)
  const kind = getRecipes().modal.kind
  const [mounted, setMounted] = useState(open)
  const [phase, setPhase] = useState<MotionModalPhase>(open ? "enter" : "exit")
  const phaseRef = useRef(phase)
  const sessionRef = useRef(0)
  const exitedRef = useRef(false)
  phaseRef.current = phase

  const finishExit = () => {
    if (exitedRef.current || phaseRef.current !== "exit") return
    exitedRef.current = true
    setMounted(false)
    onExited?.()
  }

  useEffect(() => {
    if (open) {
      sessionRef.current += 1
      exitedRef.current = false
      setMounted(true)
      setPhase("enter")
      return
    }
    setPhase("exit")
  }, [open])

  useLayoutEffect(() => {
    if (!mounted || !open || phase !== "enter") return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPhase("idle"))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [mounted, open, phase])

  useEffect(() => {
    onReadyChange?.(phase === "idle" && open)
  }, [phase, open, onReadyChange])

  useEffect(() => {
    if (open || !mounted || phase !== "exit") return
    const session = sessionRef.current
    const timer = window.setTimeout(() => {
      if (sessionRef.current !== session) return
      finishExit()
    }, EXIT_FALLBACK_MS)
    return () => window.clearTimeout(timer)
  }, [open, mounted, phase, onExited])

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (phaseRef.current !== "exit") return
    const property = event.propertyName
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced || kind === "fadeScale") {
      if (property !== "opacity") return
    } else if (property !== "transform") {
      return
    }
    finishExit()
  }

  if (!mounted) return null

  const node = (
    <div
      className={["motion-modal", className].filter(Boolean).join(" ")}
      data-kind={kind}
      data-phase={phase}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  )

  if (portalRoot) return createPortal(node, portalRoot)
  return node
}
