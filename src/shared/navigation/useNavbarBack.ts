import { useEffect } from "react"
import { useNavigationStack } from "./useNavigationStack"

/** Override global navbar back for in-screen step flows (e.g. replace card delivery → reason). */
export function useNavbarBack(handler: (() => void) | null) {
  const { setNavbarBackHandler } = useNavigationStack()

  useEffect(() => {
    // Store function in state — must wrap in updater or React invokes the handler.
    setNavbarBackHandler(() => handler)
    return () => setNavbarBackHandler(null)
  }, [handler, setNavbarBackHandler])
}
