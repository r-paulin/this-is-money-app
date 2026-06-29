import { useContext } from "react"
import { NavigationContext } from "./navigationContext"
import type { NavigationContextValue } from "./navigation.types"

export function useNavigationStack(): NavigationContextValue {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigationStack must be used within NavigationProvider")
  }
  return context
}
