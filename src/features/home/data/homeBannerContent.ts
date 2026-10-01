import type { HomeBannerId } from "../home.types"
import bannerAppleWalletCard from "../assets/banner-apple-wallet-card.png"
import bannerCardSetupAlert from "../assets/banner-card-setup-alert.png"
import bannerGooglePay from "../assets/banner-google-pay-media.png"
import bannerSuccessfulTransfer from "../assets/banner-successful-transfer.mp4"
import bannerSuccessfulTransferPoster from "../assets/banner-successful-transfer-poster.png"
import bannerWalletPhone from "../assets/banner-wallet-phone.svg"

export interface BannerTextSegment {
  text: string
  bold?: boolean
}

export interface HomeBannerMedia {
  imageSrc: string
  videoSrc?: string
  placeholderSrc: string
}

export interface HomeBannerContent {
  body: BannerTextSegment[]
  media: HomeBannerMedia
  /** Semantic Tailwind background class layered over floor-1; defaults to floor-1 only */
  backgroundClass?: string
}

export function bannerBodyPlainText(body: BannerTextSegment[]): string {
  return body.map((segment) => segment.text).join("").replace(/\s+/g, " ").trim()
}

function banner(
  lead: string,
  rest: string,
  media: HomeBannerMedia,
  backgroundClass?: string,
): HomeBannerContent {
  return {
    body: [
      { text: lead, bold: true },
      { text: rest },
    ],
    media,
    backgroundClass,
  }
}

const mediaAppleWallet: HomeBannerMedia = {
  imageSrc: bannerAppleWalletCard,
  placeholderSrc: bannerWalletPhone,
}

const mediaSendMoney: HomeBannerMedia = {
  imageSrc: bannerSuccessfulTransferPoster,
  videoSrc: bannerSuccessfulTransfer,
  placeholderSrc: bannerSuccessfulTransferPoster,
}

const mediaCardSetupFailed: HomeBannerMedia = {
  imageSrc: bannerCardSetupAlert,
  placeholderSrc: bannerWalletPhone,
}

const mediaPhone: HomeBannerMedia = {
  imageSrc: bannerGooglePay,
  placeholderSrc: bannerWalletPhone,
}

const mediaWallet: HomeBannerMedia = {
  imageSrc: bannerWalletPhone,
  placeholderSrc: bannerGooglePay,
}

export const HOME_BANNER_CONTENT: Record<HomeBannerId, HomeBannerContent> = {
  AppleWallet: banner(
    "Pay with your Apple devices. ",
    "Add your Bolt Card to Apple Wallet and start paying",
    mediaAppleWallet,
  ),
  PayWithPhone: banner(
    "Ready to send money? ",
    "Make transfers directly from your account",
    mediaSendMoney,
  ),
  PhysicalCardStatus: {
    body: [{ text: "We couldn’t set up your card. Try again." }],
    media: mediaCardSetupFailed,
    backgroundClass: "bg-danger-secondary",
  },
  GoogleWallet: banner(
    "Add your Bolt Card to Google Pay. ",
    "Pay with your phone wherever contactless payments are accepted",
    mediaPhone,
  ),
  GetPhysicalCard: banner(
    "Get your physical card. ",
    "More than just a card — it's your money, ready to go wherever you do",
    mediaWallet,
  ),
}
