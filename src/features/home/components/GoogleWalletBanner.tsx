import { GhostButton, Typography } from "@bolteu/kalep-react"
import Clear from "@bolteu/kalep-react-icons/dist/Clear"
import googleWalletBadge from "../assets/google-wallet-badge.svg"

interface GoogleWalletBannerProps {
  onDismiss: () => void
}

/** Figma 6957:28097 — “Pay with your phone” + Add to Google Wallet badge. */
export function GoogleWalletBanner({ onDismiss }: GoogleWalletBannerProps) {
  return (
    <div className="relative flex min-h-[168px] w-full flex-col items-start gap-2 overflow-hidden rounded-xl bg-layer-floor-0-grouped p-5">
      <div className="flex w-full flex-col items-start pr-8">
        <Typography
          variant="heading-xs-accent"
          color="primary"
          as="p"
          align="start"
          inlineStyle={{ fontVariantNumeric: "lining-nums proportional-nums" }}
        >
          Pay with your phone
        </Typography>
        <Typography
          variant="body-s-regular"
          color="secondary"
          as="p"
          align="start"
          inlineStyle={{ fontVariantNumeric: "lining-nums proportional-nums" }}
        >
          Use your phone wherever contactless payments are accepted
        </Typography>
      </div>

      <a
        href="#add-to-google-wallet"
        className="relative block h-[55px] w-[199px] shrink-0"
        onClick={(event) => {
          event.preventDefault()
          console.info("[stub] Add to Google Wallet")
        }}
      >
        <img
          src={googleWalletBadge}
          alt="Add to Google Wallet"
          className="block size-full max-w-none"
          width={199}
          height={55}
        />
      </a>

      <div className="absolute right-3 top-3">
        <GhostButton onClick={onDismiss} aria-label="Dismiss">
          <Clear size="md" className="text-secondary" />
        </GhostButton>
      </div>
    </div>
  )
}
