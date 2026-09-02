/** Skip the Send money skeleton after the first successful reveal in this session. */
let sendMoneyListRevealed = false

export function hasSendMoneyListRevealed(): boolean {
  return sendMoneyListRevealed
}

export function markSendMoneyListRevealed(): void {
  sendMoneyListRevealed = true
}
