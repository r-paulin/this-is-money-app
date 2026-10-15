import { useContext } from "react"
import { OsStatusBarContext } from "./osStatusBarContext"

export function useOsStatusBar() {
  const value = useContext(OsStatusBarContext)
  if (!value) {
    throw new Error("useOsStatusBar must be used within NavigationProvider")
  }
  return value
}
