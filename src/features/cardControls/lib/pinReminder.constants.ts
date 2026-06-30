export const PIN_REMINDER_COUNTDOWN_SECONDS = 20
export const PIN_REMINDER_SKELETON_MS = 800
export const PIN_REMINDER_PIN_DELAY_MS = 800

export const PIN_REMINDER_TITLE = "Here is a PIN reminder"

export const PIN_CARD_WIDTH = 200
export const PIN_CARD_HEIGHT = 148
export const PIN_BOX_MAX_WIDTH = 248
export const PIN_BOX_MIN_HEIGHT = 88

export const PIN_REMINDER_BACK_ICON_SIZE = 24
export const PIN_REMINDER_BACK_LINE_HEIGHT = 24
export const PIN_REMINDER_TITLE_LINE_HEIGHT = 32
export const PIN_REMINDER_SUBTITLE_LINE_HEIGHT = 24

export function formatPinReminderCountdown(seconds: number) {
  return `It will disappear in ${seconds} seconds`
}

export function formatPinDisplay(pin: string) {
  return pin.split("").join(" ")
}
