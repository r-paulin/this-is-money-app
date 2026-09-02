import type { CardDetailsData } from "../lib/generateCardDetails"
import { CardDetailsContent } from "./CardDetailsContent"

export interface CardDetailsScreenProps {
  details: CardDetailsData
}

export function CardDetailsScreen({ details }: CardDetailsScreenProps) {
  return <CardDetailsContent details={details} />
}
