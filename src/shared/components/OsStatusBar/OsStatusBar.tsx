import batteryIcon from "@/shared/assets/status-bar/battery.svg"
import cellularIcon from "@/shared/assets/status-bar/cellular.svg"
import wifiIcon from "@/shared/assets/status-bar/wifi.svg"
import type { OsStatusBarTheme } from "./osStatusBarContext"
import "../app-navbar.css"

export interface OsStatusBarProps {
  theme: OsStatusBarTheme
}

/** Fixed OS chrome — does not travel with nav push/pop. */
export function OsStatusBar({ theme }: OsStatusBarProps) {
  return (
    <div
      className="os-status-bar"
      data-theme={theme}
      aria-hidden
    >
      <div className="app-navbar__status-bar">
        <div className="app-navbar__status-time">12:00</div>
        <div className="app-navbar__status-island" />
        <div className="app-navbar__status-levels">
          <img
            src={cellularIcon}
            alt=""
            className="app-navbar__status-icon app-navbar__status-icon--cellular"
          />
          <img
            src={wifiIcon}
            alt=""
            className="app-navbar__status-icon app-navbar__status-icon--wifi"
          />
          <img
            src={batteryIcon}
            alt=""
            className="app-navbar__status-icon app-navbar__status-icon--battery"
          />
        </div>
      </div>
    </div>
  )
}
