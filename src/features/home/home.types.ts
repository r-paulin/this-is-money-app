export type HomeMenuItemId =
  | "transactions"
  | "send-money"
  | "loans"
  | "rewards"
  | "feedback"

export type CardType = "physical" | "virtual"

export interface HomeMenuItem {
  id: HomeMenuItemId
  primary: string
  secondary: string
}
