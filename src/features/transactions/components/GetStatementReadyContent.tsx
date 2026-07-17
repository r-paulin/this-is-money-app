import { Button, GhostButton, Typography, useSnackbar } from "@bolteu/kalep-react"
import ChevronCircleLeft from "@bolteu/kalep-react-icons/dist/ChevronCircleLeft"
import { useEffect, useRef, useState } from "react"
import statementReadyDocs from "../assets/statement-ready-docs.png"
import "@/shared/styles/text-stagger.css"
import "./statement-ready.css"

const IMAGE_DELAY_MS = 120
const IMAGE_WIDTH = 200
const IMAGE_HEIGHT = 148

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export interface GetStatementReadyContentProps {
  onBack: () => void
}

export function GetStatementReadyContent({ onBack }: GetStatementReadyContentProps) {
  const snackbar = useSnackbar()
  const staggerRef = useRef<HTMLDivElement>(null)
  const [imageVisible, setImageVisible] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) {
      return
    }

    const timer = window.setTimeout(() => {
      setImageVisible(true)
    }, IMAGE_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const element = staggerRef.current
    if (!element) return

    if (prefersReducedMotion()) {
      element.classList.add("is-shown")
      return
    }

    element.classList.remove("is-shown", "is-hiding")
    const frame = window.requestAnimationFrame(() => {
      element.classList.add("is-shown")
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-5 pr-6 pt-6">
        <GhostButton onClick={onBack} aria-label="Back">
          <span className="flex items-center gap-2">
            <ChevronCircleLeft size="lg" className="text-action-primary" />
            <span className="text-body-m font-semibold text-action-primary">Back</span>
          </span>
        </GhostButton>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-6">
        <img
          src={statementReadyDocs}
          alt=""
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          className={[
            "statement-ready-hero shrink-0 object-contain",
            imageVisible ? "statement-ready-hero--visible" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden
        />

        <div ref={staggerRef} className="t-stagger w-full pt-3 text-center">
          <Typography variant="heading-m-accent" color="primary" as="h1" align="center">
            <span className="t-stagger-line t-stagger-line--1">Statement is ready</span>
          </Typography>
          <div className="px-2 pt-1">
            <Typography variant="body-m-regular" color="secondary" as="p" align="center">
              <span className="t-stagger-line t-stagger-line--2">
                Your statement has been created and is ready to download
              </span>
            </Typography>
          </div>
        </div>

        <div className="w-full pt-4">
          <Button
            size="lg"
            variant="primary"
            fullWidth
            onClick={() => {
              snackbar.add({
                description: "Statement downloaded.",
                dismissible: true,
                timeout: 3000,
              })
            }}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}
