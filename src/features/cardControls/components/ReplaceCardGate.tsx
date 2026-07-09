import { Button } from "@bolteu/kalep-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useWalletCards } from "@/features/home/useWalletCards"
import type { CardType } from "@/features/home/home.types"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import { useNavigationStack } from "@/shared/navigation"
import { generateNewLastFour } from "../lib/generateNewLastFour"
import {
  DEFAULT_DELIVERY_ADDRESS,
  DEFAULT_REPLACE_REASON,
  REPLACE_CARD_PENDING_MS,
  REPLACE_CARD_SKELETON_MS,
  type DeliveryAddressForm,
  type ReplaceCardStep,
  type ReplaceReasonId,
} from "../lib/replaceCard.constants"
import { ReplaceCardDeliveryContent } from "./ReplaceCardDeliveryContent"
import { ReplaceCardPendingContent } from "./ReplaceCardPendingContent"
import { ReplaceCardReasonContent } from "./ReplaceCardReasonContent"
import { ReplaceCardSuccessContent } from "./ReplaceCardSuccessContent"

export interface ReplaceCardGateProps {
  cardType: CardType
}

function isDeliveryValid(address: DeliveryAddressForm): boolean {
  return (
    address.streetAddress.trim().length > 0 &&
    address.city.trim().length > 0 &&
    address.stateProvince.trim().length > 0 &&
    address.postalCode.trim().length > 0
  )
}

export function ReplaceCardGate({ cardType }: ReplaceCardGateProps) {
  const { pop, popToRoot } = useNavigationStack()
  const { completeReplace } = useWalletCards()
  const [skeletonRevealed, setSkeletonRevealed] = useState(false)
  const [step, setStep] = useState<ReplaceCardStep>("reason")
  const [selectedReason, setSelectedReason] = useState<ReplaceReasonId>(DEFAULT_REPLACE_REASON)
  const [address, setAddress] = useState<DeliveryAddressForm>(DEFAULT_DELIVERY_ADDRESS)
  const [deliveryError, setDeliveryError] = useState<string | null>(null)
  const newLastFour = useMemo(() => generateNewLastFour(), [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSkeletonRevealed(true)
    }, REPLACE_CARD_SKELETON_MS)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (step !== "pending") {
      return
    }

    const timer = window.setTimeout(() => {
      setStep("success")
    }, REPLACE_CARD_PENDING_MS)

    return () => window.clearTimeout(timer)
  }, [step])

  const handleContinue = useCallback(() => {
    if (cardType === "physical") {
      setStep("delivery")
      return
    }

    setStep("pending")
  }, [cardType])

  const handleAddressChange = useCallback(
    (field: keyof DeliveryAddressForm, value: string) => {
      setAddress((current) => ({ ...current, [field]: value }))
      setDeliveryError(null)
    },
    [],
  )

  const handleDeliverySubmit = useCallback(() => {
    if (!isDeliveryValid(address)) {
      setDeliveryError("Please fill in all required address fields.")
      return
    }

    setStep("pending")
  }, [address])

  const handleBack = useCallback(() => {
    if (step === "delivery") {
      setStep("reason")
      return
    }

    pop()
  }, [pop, step])

  const handleGotIt = useCallback(() => {
    completeReplace(cardType, newLastFour)
    popToRoot()
  }, [cardType, completeReplace, newLastFour, popToRoot])

  if (step === "pending") {
    return <ReplaceCardPendingContent />
  }

  if (step === "success") {
    return <ReplaceCardSuccessContent cardType={cardType} onGotIt={handleGotIt} />
  }

  if (step === "delivery") {
    return (
      <ReplaceCardDeliveryContent
        address={address}
        onAddressChange={handleAddressChange}
        onSubmit={handleDeliverySubmit}
        onBack={handleBack}
        error={deliveryError}
      />
    )
  }

  return (
    <SkeletonReveal
      revealed={skeletonRevealed}
      deferContentMount
      className="min-h-dvh bg-layer-floor-1"
      aria-label={skeletonRevealed ? undefined : "Loading replace card"}
      skeleton={<ReplaceCardReasonContent loading onBack={pop} />}
    >
      <div className="flex min-h-dvh flex-col bg-layer-floor-1">
        <ReplaceCardReasonContent
          selectedReason={selectedReason}
          onReasonChange={setSelectedReason}
          onBack={handleBack}
        />
        <div className="px-6 pb-6 pt-3">
          <Button size="lg" variant="primary" onClick={handleContinue} fullWidth>
            Continue
          </Button>
        </div>
      </div>
    </SkeletonReveal>
  )
}
