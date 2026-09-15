import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  HOME_FETCH_STUB_MS,
  HOME_FETCH_TIMEOUT_MS,
  MOCK_BALANCE_CENTS,
  MOCK_BANNER_IDS,
  MOCK_NOTIFICATION,
  buildMockHomeCards,
  getMockTransactionCount,
} from "./data/homeMockData"
import { HomeScreenContext } from "./homeScreenContext"
import type {
  ActivityFetchState,
  BalanceFetchState,
  HomeBannerId,
  HomeCardRow,
  HomeNotification,
} from "./home.types"

export interface HomeScreenProviderProps {
  children: ReactNode
}

export function HomeScreenProvider({ children }: HomeScreenProviderProps) {
  const [balanceCents, setBalanceCents] = useState(0)
  const [balanceState, setBalanceState] = useState<BalanceFetchState>("loading")
  const [activityState, setActivityState] = useState<ActivityFetchState>("loading")
  const [cardsState, setCardsState] = useState<ActivityFetchState>("loading")
  const [cards, setCards] = useState<HomeCardRow[]>([])
  const [transactionCount, setTransactionCount] = useState(0)
  const [dismissedBannerIds, setDismissedBannerIds] = useState<Set<HomeBannerId>>(
    () => new Set(),
  )
  const [fetchGeneration, setFetchGeneration] = useState(0)
  const [asOfMs, setAsOfMs] = useState(0)
  const notification: HomeNotification | null = MOCK_NOTIFICATION
  const timeoutRef = useRef<number | null>(null)

  const clearFetchTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const completeFetch = useCallback(() => {
    clearFetchTimeout()
    setBalanceCents(MOCK_BALANCE_CENTS)
    setBalanceState("ready")
    setActivityState("ready")
    setCardsState("ready")
    const now = Date.now()
    setAsOfMs(now)
    setCards(buildMockHomeCards(now))
    setTransactionCount(getMockTransactionCount())
  }, [clearFetchTimeout])

  const failFetch = useCallback(() => {
    clearFetchTimeout()
    setBalanceState("failed")
    setActivityState("failed")
    setCardsState("failed")
  }, [clearFetchTimeout])

  useEffect(() => {
    const stubTimer = window.setTimeout(completeFetch, HOME_FETCH_STUB_MS)
    timeoutRef.current = window.setTimeout(failFetch, HOME_FETCH_TIMEOUT_MS)

    return () => {
      window.clearTimeout(stubTimer)
      clearFetchTimeout()
    }
  }, [fetchGeneration, completeFetch, failFetch, clearFetchTimeout])

  const dismissBanner = useCallback((id: HomeBannerId) => {
    setDismissedBannerIds((current) => new Set([...current, id]))
  }, [])

  const refresh = useCallback(async () => {
    setBalanceState("loading")
    setActivityState("loading")
    setCardsState("loading")
    setFetchGeneration((value) => value + 1)
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, HOME_FETCH_STUB_MS)
    })
  }, [])

  const retryActivity = useCallback(() => {
    setActivityState("loading")
    window.setTimeout(() => {
      setActivityState("ready")
      setTransactionCount(getMockTransactionCount())
    }, HOME_FETCH_STUB_MS)
  }, [])

  const visibleBanners = useMemo(
    () => MOCK_BANNER_IDS.filter((id) => !dismissedBannerIds.has(id)),
    [dismissedBannerIds],
  )

  const value = useMemo(
    () => ({
      balanceCents,
      balanceState,
      notification,
      banners: visibleBanners,
      dismissedBannerIds,
      dismissBanner,
      cards,
      cardsState,
      activityState,
      transactionCount,
      asOfMs,
      refresh,
      retryActivity,
    }),
    [
      balanceCents,
      balanceState,
      notification,
      visibleBanners,
      dismissedBannerIds,
      dismissBanner,
      cards,
      cardsState,
      activityState,
      transactionCount,
      asOfMs,
      refresh,
      retryActivity,
    ],
  )

  return (
    <HomeScreenContext.Provider value={value}>{children}</HomeScreenContext.Provider>
  )
}
