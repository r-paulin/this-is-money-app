import { createContext } from "react"

export type OsStatusBarTheme = "light" | "dark"

export interface OsStatusBarContextValue {
  theme: OsStatusBarTheme
  /** Modal / overlay chrome. Pass `null` to follow the nav stack again. */
  setThemeOverride: (theme: OsStatusBarTheme | null) => void
}

export const OsStatusBarContext = createContext<OsStatusBarContextValue | null>(
  null,
)
