import { createContext } from "react"
import type {
  ActivityFetchState,
  BalanceFetchState,
  HomeBannerId,
  HomeCardRow,
  HomeNotification,
} from "./home.types"

export interface HomeScreenContextValue {
  balanceCents: number
  balanceState: BalanceFetchState
  notification: HomeNotification | null
  banners: HomeBannerId[]
  dismissedBannerIds: ReadonlySet<HomeBannerId>
  dismissBanner: (id: HomeBannerId) => void
  cards: HomeCardRow[]
  cardsState: ActivityFetchState
  activityState: ActivityFetchState
  transactionCount: number
  asOfMs: number
  refresh: () => Promise<void>
  retryActivity: () => void
}

export const HomeScreenContext = createContext<HomeScreenContextValue | null>(null)
