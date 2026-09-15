import { GhostButton } from "@bolteu/kalep-react"
import ArrowBackward from "@bolteu/kalep-react-icons/dist/ArrowBackward"
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

export function AppNavbar() {
  const { canPop, pop, navbarBackHandler, isNavigationLocked } =
    useNavigationStack()

  const showBack = navbarBackHandler !== null || (!isNavigationLocked && canPop)
  const isHomeRoot = !showBack

  const handleIconClick = () => {
    if (isHomeRoot) {
      console.info("[stub] Close WebView")
      return
    }

    if (navbarBackHandler) {
      navbarBackHandler()
      return
    }

    if (isNavigationLocked) return

    if (canPop) {
      pop()
    }
  }

  return (
    <header className="app-navbar" role="banner">
      <WebViewStatusBar />

      <div className="app-navbar__toolbar">
        {isHomeRoot || showBack ? (
          <div className="app-navbar__icon-button">
            <GhostButton
              onClick={handleIconClick}
              aria-label={isHomeRoot ? "Close" : "Back"}
            >
              <ArrowBackward size="lg" className="text-primary" />
            </GhostButton>
          </div>
        ) : (
          <span className="app-navbar__icon-button-spacer" aria-hidden />
        )}
      </div>
    </header>
  )
}
