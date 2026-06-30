export const DEFAULT_CARD_LAST_FOUR = "4231"

export interface CardDetailsData {
  cardNumber: string
  cardNumberRaw: string
  expiryDate: string
  expiryDateRaw: string
  cvv: string
}

function randomDigits(count: number): string {
  let result = ""
  for (let index = 0; index < count; index += 1) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result
}

function formatCardNumber(digits: string): string {
  return digits.match(/.{1,4}/g)?.join(" ") ?? digits
}

export function generateCardDetails(lastFour = DEFAULT_CARD_LAST_FOUR): CardDetailsData {
  const prefixDigits = `4${randomDigits(11)}`
  const cardNumberRaw = `${prefixDigits}${lastFour}`
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")
  const year = String(Math.floor(Math.random() * 6) + 26).padStart(2, "0")
  const expiryDateRaw = `${month}/${year}`
  const cvv = randomDigits(3)

  return {
    cardNumber: formatCardNumber(cardNumberRaw),
    cardNumberRaw,
    expiryDate: `${month} / ${year}`,
    expiryDateRaw,
    cvv,
  }
}
