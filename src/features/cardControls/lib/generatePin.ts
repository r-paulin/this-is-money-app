export function generatePin(): string {
  let pin = ""
  for (let index = 0; index < 4; index += 1) {
    pin += Math.floor(Math.random() * 10).toString()
  }
  return pin
}
