import { getIbanMaskParts, IBAN_MASK_GROUP } from "../lib/iban"

export interface MaskedIbanProps {
  iban: string
  /** Prefabricated display when a full IBAN is unavailable. */
  fallbackDisplay?: string
}

/** Renders a masked IBAN with middot groups as separate aria-hidden spans. */
export function MaskedIban({ iban, fallbackDisplay }: MaskedIbanProps) {
  const parts = getIbanMaskParts(iban)

  if (!parts) {
    return <span className="iban-masked">{fallbackDisplay ?? iban}</span>
  }

  return (
    <span className="iban-masked">
      <span className="iban-masked__group">{parts.prefix}</span>
      {parts.maskedGroups.map((_, index) => (
        <span key={index}>
          {" "}
          <span className="iban-masked__group" aria-hidden="true">
            {IBAN_MASK_GROUP}
          </span>
        </span>
      ))}{" "}
      <span className="iban-masked__group">{parts.suffix}</span>
    </span>
  )
}
