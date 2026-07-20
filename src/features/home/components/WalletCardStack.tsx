import type { ReactNode, RefObject } from "react"
import { PaymentCardCutOff } from "@/shared/components/PaymentCard"
import walletBalancePocket from "@/shared/components/PaymentCard/assets/wallet-balance-pocket.svg"
import type { CardType } from "../home.types"
import "./wallet-stack.css"

interface WalletCardStackProps {
  balanceAmount: ReactNode
  onCardClick: (cardType: CardType) => void
  physicalCardRef?: RefObject<HTMLDivElement | null>
  virtualCardRef?: RefObject<HTMLDivElement | null>
  hiddenCardType?: CardType | null
  settlingCardType?: CardType | null
}

/**
 * Wallet header — Figma 6957:28467.
 * Inset cut-off cards stack over a soft depth gradient, then tuck into a
 * notched balance pocket. Physical card is extended so it stays behind the
 * virtual card when the front card press-scales.
 */
export function WalletCardStack({
  balanceAmount,
  onCardClick,
  physicalCardRef,
  virtualCardRef,
  hiddenCardType = null,
  settlingCardType = null,
}: WalletCardStackProps) {
  return (
    <div className="wallet-stack">
      <div className="wallet-stack__depth" aria-hidden />

      <div
        ref={physicalCardRef}
        className={[
          "wallet-stack__card wallet-stack__card--physical",
          hiddenCardType === "physical" ? "opacity-0" : "",
          settlingCardType === "physical" ? "card-replace-slot-settle" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <PaymentCardCutOff
          virtual={false}
          extended
          onClick={() => onCardClick("physical")}
          aria-label="Physical card"
          className="relative w-full"
        />
      </div>

      <div
        ref={virtualCardRef}
        className={[
          "wallet-stack__card wallet-stack__card--virtual",
          hiddenCardType === "virtual" ? "opacity-0" : "",
          settlingCardType === "virtual" ? "card-replace-slot-settle" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <PaymentCardCutOff
          virtual
          onClick={() => onCardClick("virtual")}
          aria-label="Virtual card"
          className="relative w-full"
        />
      </div>

      <div className="wallet-stack__pocket">
        <img
          src={walletBalancePocket}
          alt=""
          className="wallet-stack__pocket-shape"
          aria-hidden
        />
        <div className="wallet-stack__pocket-content">{balanceAmount}</div>
      </div>
    </div>
  )
}
