import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import {
  buildStatementRangeOptions,
  clampDateToMax,
  startOfDay,
  type StatementFileFormat,
  type StatementRangeId,
} from "../lib/statementRanges"
import { GetStatementCreatingContent } from "./GetStatementCreatingContent"
import { GetStatementFormContent } from "./GetStatementFormContent"
import { GetStatementLoadingScreen } from "./GetStatementLoadingScreen"
import { GetStatementReadyContent } from "./GetStatementReadyContent"

const SKELETON_MS = 800
const BUTTON_LOAD_MS = 1000
/** Start ready entrance after creating has begun fading (not instantly under the overlay). */
const READY_ENTRANCE_DELAY_MS = 360

type GetStatementStep = "form" | "creating" | "ready"

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export function GetStatementGate() {
  const [skeletonRevealed, setSkeletonRevealed] = useState(false)
  const [step, setStep] = useState<GetStatementStep>("form")
  const [showReadyUnderCreating, setShowReadyUnderCreating] = useState(false)
  const [readyEntrance, setReadyEntrance] = useState(false)
  const [creatingButton, setCreatingButton] = useState(false)
  const readyEntranceTimerRef = useRef(0)
  const createButtonTimerRef = useRef(0)
  const now = useMemo(() => new Date(), [])
  const options = useMemo(() => buildStatementRangeOptions(now), [now])
  const [selectedRange, setSelectedRange] = useState<StatementRangeId>("this_month")
  const [fileFormat, setFileFormat] = useState<StatementFileFormat>("pdf")
  const [customStart, setCustomStart] = useState(() => startOfDay(now))
  const [customEnd, setCustomEnd] = useState(() => startOfDay(now))

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSkeletonRevealed(true)
    }, SKELETON_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(readyEntranceTimerRef.current)
      window.clearTimeout(createButtonTimerRef.current)
    }
  }, [])

  const handleCustomStartChange = useCallback(
    (date: Date) => {
      const next = clampDateToMax(date, now)
      setCustomStart(next)
      setCustomEnd((end) => (end.getTime() < next.getTime() ? next : end))
    },
    [now],
  )

  const handleCustomEndChange = useCallback(
    (date: Date) => {
      const next = clampDateToMax(date, now)
      setCustomEnd(next.getTime() < customStart.getTime() ? customStart : next)
    },
    [customStart, now],
  )

  const handleCreate = useCallback(() => {
    if (creatingButton) return
    setCreatingButton(true)
    window.clearTimeout(createButtonTimerRef.current)
    createButtonTimerRef.current = window.setTimeout(() => {
      createButtonTimerRef.current = 0
      setCreatingButton(false)
      setShowReadyUnderCreating(false)
      setReadyEntrance(false)
      setStep("creating")
    }, BUTTON_LOAD_MS)
  }, [creatingButton])

  const handleCreatingExitStart = useCallback(() => {
    setShowReadyUnderCreating(true)
    setReadyEntrance(false)
    window.clearTimeout(readyEntranceTimerRef.current)
    const delay = prefersReducedMotion() ? 0 : READY_ENTRANCE_DELAY_MS
    readyEntranceTimerRef.current = window.setTimeout(() => {
      setReadyEntrance(true)
    }, delay)
  }, [])

  const handleCreatingExitComplete = useCallback(() => {
    setStep("ready")
    setShowReadyUnderCreating(false)
    setReadyEntrance(true)
  }, [])

  if (step === "creating" || step === "ready") {
    const showReady = step === "ready" || showReadyUnderCreating
    const showCreating = step === "creating"
    const playEntrance = step === "ready" || readyEntrance

    return (
      <div className="relative min-h-dvh overflow-hidden bg-layer-floor-1">
        {showReady ? (
          <GetStatementReadyContent playEntrance={playEntrance} />
        ) : null}
        {showCreating ? (
          <div className="absolute inset-0 z-10">
            <GetStatementCreatingContent
              onExitStart={handleCreatingExitStart}
              onExitComplete={handleCreatingExitComplete}
            />
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <SkeletonReveal
      revealed={skeletonRevealed}
      deferContentMount
      className="min-h-dvh bg-layer-floor-1"
      aria-label={skeletonRevealed ? undefined : "Loading get statement"}
      skeleton={<GetStatementLoadingScreen />}
    >
      <GetStatementFormContent
        options={options}
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        customStart={customStart}
        customEnd={customEnd}
        onCustomStartChange={handleCustomStartChange}
        onCustomEndChange={handleCustomEndChange}
        maxDate={now}
        fileFormat={fileFormat}
        onFileFormatChange={setFileFormat}
        creating={creatingButton}
        onCreate={handleCreate}
      />
    </SkeletonReveal>
  )
}
