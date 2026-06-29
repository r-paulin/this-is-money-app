import boltLogo from "./assets/bolt-logo.svg"
import { PaymentCardBadge } from "./PaymentCardBadge"
import {
  getBadgeLabel,
  getCutOffBackgroundStyle,
  type PaymentCardCutOffProps,
} from "./paymentCard.config"
import { PaymentCardDotPattern } from "./PaymentCardPattern"

export function PaymentCardCutOff({
  virtual = false,
  extended = false,
  onClick,
  className = "",
  "aria-label": ariaLabel,
}: PaymentCardCutOffProps) {
  const content = (
    <>
      {virtual ? <PaymentCardDotPattern /> : null}

      <PaymentCardBadge label={getBadgeLabel(virtual)} />

      <img
        src={boltLogo}
        alt=""
        aria-hidden
        className="absolute left-[15px] top-[15px] h-7 w-12 object-contain object-left-top"
      />
    </>
  )

  const rootClassName = [
    "relative w-full shrink-0 overflow-hidden rounded-t-[12px] border border-neutral-primary",
    extended ? "h-[8.5rem]" : "h-20",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  const style = getCutOffBackgroundStyle(virtual, extended)

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${rootClassName} block cursor-pointer p-0 text-left`}
        aria-label={ariaLabel}
        style={style}
      >
        {content}
      </button>
    )
  }

  return (
    <div role="img" aria-label={ariaLabel} className={rootClassName} style={style}>
      {content}
    </div>
  )
}
