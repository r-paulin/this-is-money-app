import { Button, Typography } from "@bolteu/kalep-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import spilledMug from "@/features/home/assets/illustration-spilled-mug.svg"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import { buildMockTransactions } from "../data/mockTransactions"
import {
  isCustomRangeLongerThanOneYear,
  prepareStatement,
  statementRangeLimitMessage,
  type StatementOutcome,
} from "../lib/statementPlan"
import {
  buildStatementRangeOptions,
  clampDateToMax,
  endOfDay,
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
/** Start the ready illustration as the creating screen begins to leave. */
const READY_ENTRANCE_DELAY_MS = 0

type GetStatementStep = "form" | "creating" | "ready" | "error"

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
  const [rangeError, setRangeError] = useState<string | null>(null)
  const [outcome, setOutcome] = useState<StatementOutcome>("ready")

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
      setRangeError(null)
      setCustomEnd((end) => (end.getTime() < next.getTime() ? next : end))
    },
    [now],
  )

  const handleCustomEndChange = useCallback(
    (date: Date) => {
      const next = clampDateToMax(date, now)
      setRangeError(null)
      setCustomEnd(next.getTime() < customStart.getTime() ? customStart : next)
    },
    [customStart, now],
  )

  const handleCreate = useCallback(() => {
    if (creatingButton) return
    const option = options.find((item) => item.id === selectedRange) ?? options[0]
    const start = selectedRange === "custom" ? startOfDay(customStart) : (option?.start ?? customStart)
    const end = selectedRange === "custom" ? endOfDay(customEnd) : (option?.end ?? customEnd)
    if (selectedRange === "custom" && isCustomRangeLongerThanOneYear(customStart, customEnd)) {
      setRangeError(statementRangeLimitMessage())
      return
    }
    setRangeError(null)
    try {
      setOutcome(
        prepareStatement({
          start,
          end,
          transactions: buildMockTransactions(now),
        }),
      )
    } catch {
      setStep("error")
      return
    }
    setCreatingButton(true)
    window.clearTimeout(createButtonTimerRef.current)
    createButtonTimerRef.current = window.setTimeout(() => {
      createButtonTimerRef.current = 0
      setCreatingButton(false)
      setShowReadyUnderCreating(false)
      setReadyEntrance(false)
      setStep("creating")
    }, BUTTON_LOAD_MS)
  }, [creatingButton, customEnd, customStart, now, options, selectedRange])

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

  if (step === "error") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-layer-floor-1 px-6">
        <img src={spilledMug} alt="" width={80} height={80} className="mb-3" />
        <Typography variant="heading-m-accent" color="primary" as="h1" align="center">
          Couldn&apos;t create the statement
        </Typography>
        <Typography variant="body-m-regular" color="secondary" as="p" align="center">
          Something went wrong while creating the file. Try again.
        </Typography>
        <div className="w-full pt-4">
          <Button size="lg" variant="primary" fullWidth onClick={() => setStep("form")}>
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (step === "creating" || step === "ready") {
    const showReady = step === "ready" || showReadyUnderCreating
    const showCreating = step === "creating"
    const playEntrance = step === "ready" || readyEntrance

    return (
      <div className="relative min-h-dvh overflow-hidden bg-layer-floor-1">
        {showReady ? (
          <GetStatementReadyContent
            playEntrance={playEntrance}
            periodEmpty={outcome === "empty"}
          />
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
        onRangeChange={(id) => {
          setRangeError(null)
          setSelectedRange(id)
        }}
        customStart={customStart}
        customEnd={customEnd}
        onCustomStartChange={handleCustomStartChange}
        onCustomEndChange={handleCustomEndChange}
        maxDate={now}
        fileFormat={fileFormat}
        onFileFormatChange={setFileFormat}
        creating={creatingButton}
        rangeError={rangeError}
        onCreate={handleCreate}
      />
    </SkeletonReveal>
  )
}
