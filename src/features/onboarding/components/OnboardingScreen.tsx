import { Button, GhostButton, Typography } from "@bolteu/kalep-react"
import ArrowBackward from "@bolteu/kalep-react-icons/dist/ArrowBackward"
import Card from "@bolteu/kalep-react-icons/dist/Card"
import Cash from "@bolteu/kalep-react-icons/dist/Cash"
import Chart from "@bolteu/kalep-react-icons/dist/Chart"
import Offer from "@bolteu/kalep-react-icons/dist/Offer"
import type { KalepIcon } from "@bolteu/kalep-react-icons/dist/types"
import type { ComponentType } from "react"
import { OsStatusBar } from "@/shared/components/OsStatusBar"
import "@/shared/components/app-navbar.css"
import {
  ONBOARDING_BODY,
  ONBOARDING_BULLETS,
  ONBOARDING_CTA,
  ONBOARDING_HEADLINE,
  ONBOARDING_LEARN_MORE,
  type OnboardingBulletId,
} from "../data/onboardingContent"
import { BoltCardHeroVideo } from "./BoltCardHeroVideo"
import "./onboarding.css"

const BULLET_ICONS: Record<OnboardingBulletId, ComponentType<KalepIcon>> = {
  expenses: Card,
  rewarded: Offer,
  transfer: Cash,
  tracking: Chart,
}

export interface OnboardingScreenProps {
  onContinue: () => void
}

export function OnboardingScreen({ onContinue }: OnboardingScreenProps) {
  return (
    <div className="onboarding-screen">
      <OsStatusBar theme="light" />

      <div className="onboarding-screen__chrome">
        <header className="app-navbar" role="banner">
          <div className="app-navbar__status-spacer" aria-hidden />
          <div className="app-navbar__toolbar">
            <div className="app-navbar__icon-button">
              <GhostButton
                onClick={onContinue}
                aria-label="Back"
                overrideClassName="app-navbar__icon-control"
              >
                <ArrowBackward size="lg" className="app-navbar__back-icon" />
              </GhostButton>
            </div>
          </div>
        </header>
      </div>

      <div className="onboarding-screen__body">
        <div className="onboarding-hero">
          <div className="onboarding-hero__frame" aria-hidden>
            <BoltCardHeroVideo />
          </div>
        </div>

        <div className="onboarding-intro">
          <Typography variant="heading-m-accent" color="primary" as="h1">
            {ONBOARDING_HEADLINE}
          </Typography>
          <Typography variant="body-m-regular" color="primary" as="p">
            {ONBOARDING_BODY}
          </Typography>
        </div>

        <ul className="onboarding-bullets">
          {ONBOARDING_BULLETS.map((bullet) => {
            const Icon = BULLET_ICONS[bullet.id]
            return (
              <li key={bullet.id} className="onboarding-bullet">
                <Icon
                  size="md"
                  className="onboarding-bullet__icon text-action-primary"
                  aria-hidden
                />
                <div className="onboarding-bullet__text">
                  <Typography variant="body-m-accent" color="primary" as="p">
                    {bullet.title}
                  </Typography>
                  <Typography variant="body-s-regular" color="secondary" as="p">
                    {bullet.description}
                  </Typography>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="onboarding-learn-more">
          <button
            type="button"
            className="onboarding-learn-more__button"
            onClick={() => console.info("[stub] Learn more about Bolt Card")}
          >
            <Typography variant="body-m-accent" color="link-primary" as="span">
              {ONBOARDING_LEARN_MORE}
            </Typography>
          </button>
        </div>
      </div>

      <div className="onboarding-footer">
        <div className="onboarding-footer__inner">
          <Button size="lg" variant="primary" fullWidth onClick={onContinue}>
            {ONBOARDING_CTA}
          </Button>
        </div>
      </div>
    </div>
  )
}
