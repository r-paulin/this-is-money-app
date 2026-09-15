import { useContext } from "react"
import { HomeScreenContext } from "./homeScreenContext"

export function useHomeScreen() {
  const context = useContext(HomeScreenContext)
  if (!context) {
    throw new Error("useHomeScreen must be used within HomeScreenProvider")
  }
  return context
}
