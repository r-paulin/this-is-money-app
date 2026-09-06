import { GhostButton, Typography } from "@bolteu/kalep-react"
import ArrowBackward from "@bolteu/kalep-react-icons/dist/ArrowBackward"
import { useNavigationStack } from "@/shared/navigation"
import "./app-navbar.css"

const NAVBAR_TITLE = "Bolt Card"

export function AppNavbar() {
  const { canPop, pop, navbarBackHandler, isNavigationLocked } =
    useNavigationStack()

  const showBack = navbarBackHandler !== null || (!isNavigationLocked && canPop)

  const handleBack = () => {
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
      <div className="app-navbar__toolbar">
        <div className="app-navbar__back-slot">
          {showBack ? (
            <GhostButton onClick={handleBack} aria-label="Back">
              <ArrowBackward size="lg" className="text-primary" />
            </GhostButton>
          ) : (
            <span className="app-navbar__back-spacer" aria-hidden />
          )}
        </div>

        <div className="app-navbar__title-row">
          <span className="app-navbar__title">
            <Typography
              variant="body-l-compact-accent"
              color="primary"
              as="span"
              align="center"
              noWrap
            >
              {NAVBAR_TITLE}
            </Typography>
          </span>
        </div>
      </div>
    </header>
  )
}
