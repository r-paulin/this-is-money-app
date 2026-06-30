import type { CardDetailsData } from "../lib/generateCardDetails"
import { CardDetailsContent } from "./CardDetailsContent"

export interface CardDetailsScreenProps {
  details: CardDetailsData
  onBack?: () => void
}

export function CardDetailsScreen({ details, onBack }: CardDetailsScreenProps) {
  return <CardDetailsContent details={details} onBack={onBack} />
}
