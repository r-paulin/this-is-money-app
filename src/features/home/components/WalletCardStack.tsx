import type { ReactNode, RefObject } from "react"
import { PaymentCardCutOff } from "@/shared/components/PaymentCard"
import type { CardType } from "../home.types"

interface WalletCardStackProps {
  balanceLabel?: ReactNode
  balanceAmount: ReactNode
  sendMoneyButton: ReactNode
  onCardClick: (cardType: CardType) => void
  physicalCardRef?: RefObject<HTMLDivElement | null>
  virtualCardRef?: RefObject<HTMLDivElement | null>
  hiddenCardType?: CardType | null
  settlingCardType?: CardType | null
}

/**
 * Wallet header — Figma node 6582:20906 / 6395:17187.
 * Stacked cut-off payment cards overlap the balance panel by 24px.
 * The back (physical) card is extended to fill the stack depth behind the front card.
 */
export function WalletCardStack({
  balanceLabel,
  balanceAmount,
  sendMoneyButton,
  onCardClick,
  physicalCardRef,
  virtualCardRef,
  hiddenCardType = null,
  settlingCardType = null,
}: WalletCardStackProps) {
  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={physicalCardRef}
        className={[
          "relative z-0 -mb-20 w-full shrink-0",
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
          "relative z-[1] -mb-6 w-full shrink-0",
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
      <div className="relative z-10 flex w-full flex-col items-center rounded-[12px] bg-layer-floor-1 py-9">
        <div className="w-full px-6 pb-4 text-center">
          {balanceLabel}
          {balanceAmount}
        </div>
        <div className="flex justify-center">{sendMoneyButton}</div>
      </div>
    </div>
  )
}
