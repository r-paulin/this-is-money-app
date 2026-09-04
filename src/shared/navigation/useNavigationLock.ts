import { useEffect } from "react"
import { useNavigationStack } from "./useNavigationStack"

/** Disables pop, popTo, popToRoot, and swipe-back while locked (e.g. transfer loading). */
export function useNavigationLock(locked: boolean) {
  const { setNavigationLocked } = useNavigationStack()

  useEffect(() => {
    setNavigationLocked(locked)
    return () => setNavigationLocked(false)
  }, [locked, setNavigationLocked])
}
