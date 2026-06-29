export type HomeMenuItemId =
  | "transactions"
  | "loans"
  | "cards"
  | "rewards"

export type CardType = "physical" | "virtual"

export interface HomeMenuItem {
  id: HomeMenuItemId
  primary: string
  secondary: string
}
