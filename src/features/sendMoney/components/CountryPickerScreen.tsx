import {
  ListItemLayout,
  TextField,
  Typography,
  useSnackbar,
} from "@bolteu/kalep-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useAfterNavigationTransition, useNavigationStack } from "@/shared/navigation"
import {
  COUNTRIES,
  type TransferCountry,
} from "../data/countries"
import { highlightNameMatch } from "../lib/highlightMatch"
import { orderCountries, searchCountries } from "../lib/searchCountries"
import countryNotFound from "../assets/country-not-found.png"
import { CountryRow } from "./CountryRow"
import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

const SEARCH_DEBOUNCE_MS = 200
const COVERAGE_LOADING_MS = 500

export interface CountryPickerScreenProps {
  currentCountryCode: string
  onSelect: (country: TransferCountry) => void
}

export function CountryPickerScreen({
  currentCountryCode,
  onSelect,
}: CountryPickerScreenProps) {
  const { pop } = useNavigationStack()
  const snackbar = useSnackbar()
  const navigationReady = useAfterNavigationTransition()
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [coverageLoading, setCoverageLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCoverageLoading(false)
    }, COVERAGE_LOADING_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!navigationReady) return
    const focusTimer = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50)
    return () => window.clearTimeout(focusTimer)
  }, [navigationReady])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [query])

  const isSearching = query !== debouncedQuery
  const visibleCountries = useMemo(() => {
    const matches = searchCountries(COUNTRIES, debouncedQuery)
    return debouncedQuery ? matches : orderCountries(matches, currentCountryCode)
  }, [currentCountryCode, debouncedQuery])

  const handleSelect = (country: TransferCountry) => {
    if (!country.supported) {
      snackbar.add({
        description: "Transfers aren’t available to this country yet",
        dismissible: false,
        timeout: 3000,
      })
      return
    }
    onSelect(country)
    pop()
  }

  return (
    <div className="min-h-dvh bg-layer-floor-1">
      <div className="flex flex-col pb-6">
        <div className="px-6 py-3">
          <Typography variant="heading-l-accent" color="primary" as="h1">
            Country
          </Typography>
        </div>

        <div className="px-6 pb-2">
          <TextField
            ref={inputRef}
            type="search"
            size="lg"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search country"
            clearTextLabel="Clear country search"
            autoComplete="off"
            fullWidth
          />
        </div>

        {coverageLoading ? <CountryRowsSkeleton /> : null}
        {!coverageLoading && visibleCountries.length > 0 ? (
          <ul className="m-0 list-none p-0" aria-busy={isSearching}>
            {visibleCountries.map((country, index) => (
              <li key={country.code}>
                <CountryRow
                  country={country}
                  selected={country.code === currentCountryCode}
                  primary={
                    debouncedQuery
                      ? highlightNameMatch(country.name, debouncedQuery)
                      : country.name
                  }
                  separator={index < visibleCountries.length - 1}
                  onSelect={handleSelect}
                />
              </li>
            ))}
          </ul>
        ) : null}
        {!coverageLoading && debouncedQuery && visibleCountries.length === 0 ? (
          <div className="flex flex-col items-center px-6 pb-10 pt-12 text-center">
            <img
              src={countryNotFound}
              alt=""
              width={200}
              height={148}
              className="h-[148px] w-[200px] object-contain"
              aria-hidden
            />
            <div className="pt-4">
              <Typography variant="heading-s-accent" color="primary" as="p">
                Country not found
              </Typography>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function CountryRowsSkeleton() {
  return (
    <ul className="m-0 list-none p-0" aria-label="Searching countries">
      {Array.from({ length: 3 }, (_, index) => (
        <li key={index}>
          <ListItemLayout
            separator={index < 2}
            paddingStart={6}
            paddingEnd={6}
            renderStartSlot={() => <SkeletonCircle size={24} />}
            primary={<SkeletonBar width="40%" height={14} className="my-[3px]" />}
          />
        </li>
      ))}
    </ul>
  )
}
