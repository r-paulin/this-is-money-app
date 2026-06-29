import { useCallback, useLayoutEffect, useRef, useState } from "react"

/**
 * Official orchestration: remove `.is-animating`, swap digits,
 * force reflow via `offsetHeight`, re-add `.is-animating`.
 */
export function useNumberPopIn(initialValue: string, initialPlaying = false) {
  const groupRef = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(initialValue)
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [playing, setPlaying] = useState(initialPlaying)
  const pendingReplayRef = useRef(false)

  useLayoutEffect(() => {
    if (!pendingReplayRef.current) return
    pendingReplayRef.current = false
    void groupRef.current?.offsetHeight
    setPlaying(true)
  }, [value])

  const setDigits = useCallback((nextValue: string) => {
    pendingReplayRef.current = true
    setPlaying(false)
    setPreviousValue(value)
    setValue(nextValue)
  }, [value])

  const setDigitsStatic = useCallback((nextValue: string) => {
    pendingReplayRef.current = false
    setPlaying(false)
    setPreviousValue(null)
    setValue(nextValue)
  }, [])

  const replay = useCallback(() => {
    setPreviousValue(null)
    setPlaying(false)
    requestAnimationFrame(() => {
      void groupRef.current?.offsetHeight
      setPlaying(true)
    })
  }, [])

  return {
    groupRef,
    value,
    previousValue,
    playing,
    setDigits,
    setDigitsStatic,
    replay,
  }
}
