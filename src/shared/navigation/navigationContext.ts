import { createContext } from "react"
import type { NavigationContextValue } from "./navigation.types"

export const NavigationContext = createContext<NavigationContextValue | null>(
  null,
)
