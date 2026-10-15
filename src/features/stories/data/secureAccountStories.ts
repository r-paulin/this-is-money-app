import type { StorySequence } from "../stories.types"
import biometricsArt from "../assets/secure-account-biometrics.png"
import doneArt from "../assets/secure-account-done.png"
import smsArt from "../assets/secure-account-sms.png"
import paymentVideo from "../assets/smartphone-in-hand-payment-keypad.mp4"

const CTA_LABEL = "Get a Bolt Card"

/** Figma Secure your account — `10059:191766` (4 pages). */
export const SECURE_ACCOUNT_STORIES: StorySequence = {
  id: "secure-account",
  pages: [
    {
      id: "secure-phone",
      tone: "light",
      media: {
        kind: "video",
        src: paymentVideo,
      },
      title: "Pay with your phone",
      body: "Add your Bolt Card to your phone and pay wherever contactless payments are accepted.",
      ctaLabel: CTA_LABEL,
    },
    {
      id: "secure-sms",
      tone: "light",
      media: {
        kind: "image",
        src: smsArt,
        alt: "",
      },
      title: "How verification codes work",
      body: "We’ll send a unique code to your phone via SMS. Enter this code when prompted to verify it’s really you.",
      ctaLabel: CTA_LABEL,
    },
    {
      id: "secure-biometrics",
      tone: "light",
      media: {
        kind: "image",
        src: biometricsArt,
        alt: "",
      },
      title: "Use biometrics for faster access",
      body: "Once set up, you can use Face ID or your fingerprint instead of entering codes every time.",
      ctaLabel: CTA_LABEL,
    },
    {
      id: "secure-done",
      tone: "actionSecondary",
      media: {
        kind: "image",
        src: doneArt,
        alt: "",
      },
      title: "You’re all set!",
      body: "Your account is now more secure. You can manage these settings anytime in your security preferences.",
      ctaLabel: CTA_LABEL,
    },
  ],
}
