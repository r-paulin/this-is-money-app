export const ONBOARDING_HEADLINE = "Instant access to your earnings"

export const ONBOARDING_BODY =
  "Access earnings from completed rides right away with a free Bolt Card"

export const ONBOARDING_LEARN_MORE = "Learn more"

export const ONBOARDING_CTA = "Get a free Bolt Card"

export type OnboardingBulletId = "expenses" | "rewarded" | "transfer" | "tracking"

export type OnboardingBullet = {
  id: OnboardingBulletId
  title: string
  description: string
}

/** Figma copy kept verbatim (including “Terms applly.”). */
export const ONBOARDING_BULLETS: OnboardingBullet[] = [
  {
    id: "expenses",
    title: "Cover everyday expenses",
    description:
      "Pay for fuel, charging, parking, or other expenses with your virtual or physical card",
  },
  {
    id: "rewarded",
    title: "Get rewarded",
    description: "Earn 1% back on fuel and EV charging. Terms applly.",
  },
  {
    id: "transfer",
    title: "Transfer money easily",
    description: "Send money to your bank or another recipient",
  },
  {
    id: "tracking",
    title: "Keep track of your spending",
    description:
      "See card activity in one place and download reports for accounting",
  },
]
