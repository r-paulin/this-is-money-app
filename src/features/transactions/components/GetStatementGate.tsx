import { useCallback, useEffect, useMemo, useState } from "react"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import { useNavigationStack } from "@/shared/navigation"
import {
  buildStatementRangeOptions,
  clampDateToMax,
  startOfDay,
  type StatementRangeId,
} from "../lib/statementRanges"
import { GetStatementCreatingContent } from "./GetStatementCreatingContent"
import { GetStatementFormContent } from "./GetStatementFormContent"
import { GetStatementLoadingScreen } from "./GetStatementLoadingScreen"
import { GetStatementReadyContent } from "./GetStatementReadyContent"

const SKELETON_MS = 800
const BUTTON_LOAD_MS = 1000

type GetStatementStep = "form" | "creating" | "ready"

export function GetStatementGate() {
  const { pop } = useNavigationStack()
  const [skeletonRevealed, setSkeletonRevealed] = useState(false)
  const [step, setStep] = useState<GetStatementStep>("form")
  const [showReadyUnderCreating, setShowReadyUnderCreating] = useState(false)
  const [creatingButton, setCreatingButton] = useState(false)
  const now = useMemo(() => new Date(), [])
  const options = useMemo(() => buildStatementRangeOptions(now), [now])
  const [selectedRange, setSelectedRange] = useState<StatementRangeId>("this_month")
  const [customStart, setCustomStart] = useState(() => startOfDay(now))
  const [customEnd, setCustomEnd] = useState(() => startOfDay(now))

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSkeletonRevealed(true)
    }, SKELETON_MS)
    return () => window.clearTimeout(timer)
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
    window.setTimeout(() => {
      setCreatingButton(false)
      setShowReadyUnderCreating(false)
      setStep("creating")
    }, BUTTON_LOAD_MS)
  }, [creatingButton])

  const handleCreatingExitStart = useCallback(() => {
    setShowReadyUnderCreating(true)
  }, [])

  const handleCreatingExitComplete = useCallback(() => {
    setStep("ready")
    setShowReadyUnderCreating(false)
  }, [])

  const handleBack = useCallback(() => {
    pop()
  }, [pop])

  if (step === "creating" || step === "ready") {
    const showReady = step === "ready" || showReadyUnderCreating
    const showCreating = step === "creating"

    return (
      <div className="relative min-h-dvh overflow-hidden bg-layer-floor-1">
        {showReady ? (
          <div className={showCreating ? "absolute inset-0 z-0" : undefined}>
            <GetStatementReadyContent onBack={handleBack} />
          </div>
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
      skeleton={<GetStatementLoadingScreen onBack={pop} />}
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
        creating={creatingButton}
        onCreate={handleCreate}
        onBack={pop}
      />
    </SkeletonReveal>
  )
}
