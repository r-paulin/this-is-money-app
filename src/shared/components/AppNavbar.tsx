import { GhostButton } from "@bolteu/kalep-react"
import ArrowBackward from "@bolteu/kalep-react-icons/dist/ArrowBackward"
import Cross from "@bolteu/kalep-react-icons/dist/Cross"
import { useNavigationStack } from "@/shared/navigation"
import batteryIcon from "@/shared/assets/status-bar/battery.svg"
import cellularIcon from "@/shared/assets/status-bar/cellular.svg"
import wifiIcon from "@/shared/assets/status-bar/wifi.svg"
import "./app-navbar.css"

function WebViewStatusBar() {
  return (
    <div className="app-navbar__status-bar" aria-hidden>
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
  )
}

export interface AppNavbarProps {
  /** Whether this screen can pop (index > 0). */
  canGoBack: boolean
  /** Dark chrome for immersive screens (e.g. Stories). */
  immersive?: boolean
  /** Only the top layer handles presses / navbarBackHandler. */
  interactive?: boolean
  /** Override back (e.g. modal dismiss). Skips nav `pop()`. */
  onBack?: () => void
}

export function AppNavbar({
  canGoBack,
  immersive = false,
  interactive = true,
  onBack,
}: AppNavbarProps) {
  const { pop, navbarBackHandler, isNavigationLocked } = useNavigationStack()

  const showBack =
    Boolean(onBack) ||
    canGoBack ||
    (interactive && navbarBackHandler !== null && !isNavigationLocked)
  const isHomeRoot = !showBack

  const handleIconClick = () => {
    if (!interactive) return

    if (onBack) {
      onBack()
      return
    }

    if (isHomeRoot) {
      console.info("[stub] Close WebView")
      return
    }

    if (navbarBackHandler) {
      navbarBackHandler()
      return
    }

    if (isNavigationLocked) return

    if (canGoBack) {
      pop()
    }
  }

  return (
    <header
      className={["app-navbar", immersive ? "app-navbar--immersive" : ""]
        .filter(Boolean)
        .join(" ")}
      role="banner"
    >
      <WebViewStatusBar />

      <div className="app-navbar__toolbar">
        {isHomeRoot || showBack ? (
          <div className="app-navbar__icon-button">
            <GhostButton
              onClick={handleIconClick}
              aria-label={immersive || isHomeRoot ? "Close" : "Back"}
              disabled={!interactive}
              overrideClassName="app-navbar__icon-control"
            >
              {immersive ? (
                <Cross size="lg" className="app-navbar__back-icon" />
              ) : (
                <ArrowBackward size="lg" className="app-navbar__back-icon" />
              )}
            </GhostButton>
          </div>
        ) : (
          <span className="app-navbar__icon-button-spacer" aria-hidden />
        )}
      </div>
    </header>
  )
}
