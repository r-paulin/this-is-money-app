import {
  useContext,
  useEffect,
  useLayoutEffect,
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

  useEffect(() => {
    if (open) setMounted(true)
  }, [open])

  useLayoutEffect(() => {
    if (!mounted || !open) return
    setPhase("enter")
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPhase("idle"))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [mounted, open])

  useEffect(() => {
    if (!open && mounted) setPhase("exit")
  }, [open, mounted])

  useEffect(() => {
    onReadyChange?.(phase === "idle")
  }, [phase, onReadyChange])

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (phase !== "exit") return
    const property = event.propertyName
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced || kind === "fadeScale") {
      if (property !== "opacity") return
    } else if (property !== "transform") {
      return
    }
    setMounted(false)
    onExited?.()
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
