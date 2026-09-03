export const REFERENCE_MAX_LENGTH = 140

/** SEPA ISO 20022 unstructured remittance allowed characters. */
const SEPA_REFERENCE_PATTERN =
  /^[A-Za-z0-9/\-?:()'+,.\n ]*$/

const REJECTED_REFERENCE_CHARS = "@#$%&*^~|\\{}[];!"

export function sanitizeReferenceInput(value: string): string {
  const stripped = value
    .split("")
    .filter((char) => !REJECTED_REFERENCE_CHARS.includes(char))
    .join("")
  return stripped.slice(0, REFERENCE_MAX_LENGTH)
}

export function isValidReference(value: string): boolean {
  if (value.length > REFERENCE_MAX_LENGTH) {
    return false
  }
  return SEPA_REFERENCE_PATTERN.test(value)
}
