import { useEffect, useState } from "react"
import { useNavigationStack } from "./useNavigationStack"

/** True once the current screen's push/pop animation has finished. */
export function useAfterNavigationTransition(): boolean {
  const { isTransitioning } = useNavigationStack()
  const [ready, setReady] = useState(() => !isTransitioning)

  useEffect(() => {
    if (isTransitioning) {
      setReady(false)
      return
    }
    setReady(true)
  }, [isTransitioning])

  return ready
}
