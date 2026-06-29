import type { ReactNode } from "react"
import { PaymentCardCutOff } from "@/shared/components/PaymentCard"
import type { CardType } from "../home.types"

interface WalletCardStackProps {
  balanceLabel: ReactNode
  balanceAmount: ReactNode
  sendMoneyButton: ReactNode
  onCardClick: (cardType: CardType) => void
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
}: WalletCardStackProps) {
  return (
    <div className="flex w-full flex-col items-center">
      <PaymentCardCutOff
        virtual={false}
        extended
        onClick={() => onCardClick("physical")}
        aria-label="Physical card"
        className="relative z-0 -mb-20 shrink-0"
      />
      <PaymentCardCutOff
        virtual
        onClick={() => onCardClick("virtual")}
        aria-label="Virtual card"
        className="relative z-[1] -mb-6 shrink-0"
      />
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
