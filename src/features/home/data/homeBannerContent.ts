import type { HomeBannerId } from "../home.types"

export type HomeBannerActionVariant = "ghost" | "primary"

export interface HomeBannerContent {
  title: string
  body: string
  actionLabel: string
  actionVariant: HomeBannerActionVariant
}

export const HOME_BANNER_CONTENT: Record<HomeBannerId, HomeBannerContent> = {
  GoogleWallet: {
    title: "Add your Bolt Card to Google Pay",
    body: "Pay with your phone wherever contactless payments are accepted",
    actionLabel: "Add to Google Pay",
    actionVariant: "ghost",
  },
  AppleWallet: {
    title: "Add your card to Apple Wallet",
    body: "Pay with your phone by adding your card to Apple Wallet",
    actionLabel: "Add to Apple Wallet",
    actionVariant: "ghost",
  },
  PayWithPhone: {
    title: "Pay faster with your phone",
    body: "Add your card to your mobile wallet for quick, secure payments",
    actionLabel: "Add to wallet",
    actionVariant: "primary",
  },
  GetPhysicalCard: {
    title: "Get your physical card",
    body: "More than just a card — it's your money, ready to go wherever you do",
    actionLabel: "Order your card",
    actionVariant: "primary",
  },
  PhysicalCardStatus: {
    title: "Your Hopp card is on its way",
    body: "Most cards arrive within 7–10 business days. We'll let you know when it's ready to activate.",
    actionLabel: "Activate card",
    actionVariant: "primary",
  },
}
