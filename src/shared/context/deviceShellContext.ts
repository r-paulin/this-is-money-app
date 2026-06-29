import { createContext } from "react"

export interface DeviceShellContextValue {
  portalRoot: HTMLElement | null
}

export const DeviceShellContext = createContext<DeviceShellContextValue>({
  portalRoot: null,
})
