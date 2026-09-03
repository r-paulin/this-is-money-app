/** French-style amount display (Figma: 12 312,50). */
export const AMOUNT_DISPLAY_LOCALE = "fr-FR"

export interface AmountInputState {
  /** Integer digits; empty string = empty entry state. */
  majorDigits: string
  /** Fraction digits (0–2) when {@link inDecimal}. */
  minorDigits: string
  inDecimal: boolean
}

export const EMPTY_AMOUNT_STATE: AmountInputState = {
  majorDigits: "",
  minorDigits: "",
  inDecimal: false,
}

export interface AmountDisplayParts {
  /** Primary-colour segment (includes grouping / comma). */
  entered: string
  /** Secondary ghost suffix (e.g. remaining fraction zeros). */
  ghost: string
  isEmpty: boolean
}

export function isEmptyAmountState(state: AmountInputState): boolean {
  return (
    state.majorDigits === "" &&
    !state.inDecimal &&
    state.minorDigits === ""
  )
}

export function amountCentsFromState(state: AmountInputState): number {
  if (isEmptyAmountState(state)) {
    return 0
  }

  const major = Number.parseInt(state.majorDigits || "0", 10)
  if (!state.inDecimal) {
    return major * 100
  }

  const minor = Number.parseInt((state.minorDigits + "00").slice(0, 2), 10)
  return major * 100 + minor
}

function formatGroupedMajor(digits: string): string {
  if (!digits) return ""
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F")
}

export function formatAmountDisplay(state: AmountInputState): AmountDisplayParts {
  if (isEmptyAmountState(state)) {
    return {
      entered: "",
      ghost: "0,00",
      isEmpty: true,
    }
  }

  const groupedMajor = formatGroupedMajor(state.majorDigits)

  if (!state.inDecimal) {
    return {
      entered: groupedMajor,
      ghost: "",
      isEmpty: false,
    }
  }

  const entered = `${groupedMajor},${state.minorDigits}`
  const ghostZeros = "00".slice(state.minorDigits.length)
  return {
    entered,
    ghost: ghostZeros,
    isEmpty: false,
  }
}

export function applyAmountKey(
  state: AmountInputState,
  key: string,
): AmountInputState {
  if (key === "Backspace") {
    return applyAmountBackspace(state)
  }

  if (key === "," || key === ".") {
    if (isEmptyAmountState(state)) {
      return { majorDigits: "0", minorDigits: "", inDecimal: true }
    }
    if (state.inDecimal) {
      return state
    }
    return { ...state, inDecimal: true }
  }

  if (!/^\d$/.test(key)) {
    return state
  }

  if (state.inDecimal) {
    if (state.minorDigits.length >= 2) {
      return state
    }
    return { ...state, minorDigits: state.minorDigits + key }
  }

  return { ...state, majorDigits: state.majorDigits + key }
}

export function applyAmountBackspace(state: AmountInputState): AmountInputState {
  if (state.inDecimal && state.minorDigits.length > 0) {
    return { ...state, minorDigits: state.minorDigits.slice(0, -1) }
  }

  if (state.inDecimal) {
    return { ...state, inDecimal: false, minorDigits: "" }
  }

  if (state.majorDigits.length <= 1) {
    return EMPTY_AMOUNT_STATE
  }

  return { ...state, majorDigits: state.majorDigits.slice(0, -1) }
}

/** Parse pasted / typed string into state (digits and one decimal separator). */
export function amountStateFromRawInput(raw: string): AmountInputState {
  const normalized = raw.replace(/\s/g, "").replace(".", ",")
  if (!normalized || normalized === "0" || normalized === "0,00") {
    return EMPTY_AMOUNT_STATE
  }

  const [majorPart, minorPart = ""] = normalized.split(",")
  const majorDigits = majorPart.replace(/\D/g, "")
  const hasDecimal = normalized.includes(",")
  const minorDigits = minorPart.replace(/\D/g, "").slice(0, 2)

  if (!majorDigits && !minorDigits && !hasDecimal) {
    return EMPTY_AMOUNT_STATE
  }

  return {
    majorDigits,
    minorDigits,
    inDecimal: hasDecimal,
  }
}

export function formatAvailableLine(cents: number): string {
  const formatted = new Intl.NumberFormat(AMOUNT_DISPLAY_LOCALE, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
  return `Available: ${formatted}`
}
