import { Typography } from "@bolteu/kalep-react"
import Lock from "@bolteu/kalep-react-icons/dist/Lock"
import "./payment-card.css"
import boltLogo from "./assets/bolt-logo.svg"
import visaBusiness from "./assets/visa-business.svg"
import { PaymentCardBadge } from "./PaymentCardBadge"
import { PaymentCardDotPattern } from "./PaymentCardPattern"
import {
  getBadgeLabel,
  getFullBackgroundStyle,
  type PaymentCardProps,
} from "./paymentCard.config"

export function PaymentCard({
  virtual = false,
  lastFour = "4231",
  locked = false,
  className = "",
}: PaymentCardProps) {
  const label = getBadgeLabel(virtual)

  return (
    <div
      role="img"
      aria-label={`${label} card ending in ${lastFour}${locked ? ", locked" : ""}`}
      className={[
        "relative h-[13.625rem] w-full max-w-[21.5625rem] overflow-hidden rounded-[12px] border border-neutral-primary",
        "shadow-[0px_6px_12px_-2px_rgba(28,28,28,0.25),0px_3px_7px_-3px_rgba(28,28,28,0.3)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={getFullBackgroundStyle(virtual)}
    >
      {virtual ? <PaymentCardDotPattern full /> : null}

      <PaymentCardBadge label={label} />

      <img
        src={boltLogo}
        alt=""
        aria-hidden
        className="absolute left-[15px] top-[15px] h-7 w-12 object-contain object-left-top"
      />

      <img
        src={visaBusiness}
        alt=""
        aria-hidden
        className="absolute bottom-[11px] right-[11px] h-[30px] w-[60px] object-contain object-right-bottom"
      />

      <div className="ffeature absolute bottom-5 left-[15px] translate-y-1/2">
        <Typography
          variant="body-m-compact-accent"
          as="p"
          inlineStyle={{ color: "var(--color-static-content-key-light, #ffffff)" }}
        >
          ·· {lastFour}
        </Typography>
      </div>

      {locked ? (
        <div
          className="payment-card-lock-overlay absolute inset-0 z-10 flex items-center justify-center"
          aria-hidden
        >
          <Lock
            className="text-static-key-light"
            style={{ width: 80, height: 80 }}
          />
        </div>
      ) : null}
    </div>
  )
}
