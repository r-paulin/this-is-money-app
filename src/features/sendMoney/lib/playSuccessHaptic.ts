/** Success haptic pattern from https://haptics.lochie.me/ (Success preset). */
const SUCCESS_VIBRATE_PATTERN = [30, 50, 30]

export function playSuccessHaptic(reducedMotion = false): void {
  if (reducedMotion) return
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    return
  }

  navigator.vibrate(SUCCESS_VIBRATE_PATTERN)
}
