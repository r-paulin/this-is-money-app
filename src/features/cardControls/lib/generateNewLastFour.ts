export function generateNewLastFour(): string {
  let result = ""
  for (let index = 0; index < 4; index += 1) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result
}
