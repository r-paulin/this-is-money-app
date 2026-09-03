import { useCallback, useEffect, useMemo, useState } from "react"
import { TextField, Typography } from "@bolteu/kalep-react"
import { useNavigationStack } from "@/shared/navigation"
import { buildMockRecipients } from "../data/mockRecipients"
import {
  DEFAULT_RECIPIENT_LIST_MAX,
  type Recipient,
} from "../sendMoney.types"
import { getDefaultRecipients, isRecipientEligible } from "../lib/scoreRecipients"
import { searchRecipients } from "../lib/searchRecipients"
import { AddRecipientRow } from "./AddRecipientRow"
import { AmountGate } from "./AmountGate"
import { AddRecipientGate } from "./AddRecipientGate"
import { RecipientRow } from "./RecipientRow"

const SEARCH_DEBOUNCE_MS = 200

export function RecipientSelectScreen() {
  const { push } = useNavigationStack()
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  const [now] = useState(() => Date.now())
  const allRecipients = useMemo(() => buildMockRecipients(now), [now])
  const eligibleRecipients = useMemo(
    () => allRecipients.filter((recipient) => isRecipientEligible(recipient, now)),
    [allRecipients, now],
  )
  const defaultRecipients = useMemo(
    () => getDefaultRecipients(eligibleRecipients, now, DEFAULT_RECIPIENT_LIST_MAX),
    [eligibleRecipients, now],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [query])

  const searchResult = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return {
        recipients: defaultRecipients,
        addRowVariant: "default" as const,
      }
    }
    return searchRecipients(allRecipients, debouncedQuery, now)
  }, [debouncedQuery, defaultRecipients, allRecipients, now])

  const isSearching = debouncedQuery.trim().length > 0
  const showAddFirst = !isSearching
  const addRowVariant = isSearching ? searchResult.addRowVariant : "default"
  const addRowPrefill = searchResult.addRowPrefill
  const ibanFormatted = searchResult.ibanFormatted

  const openAmount = useCallback(
    (recipient: Recipient) => {
      push({
        key: `send-money-amount:${recipient.id}`,
        render: () => <AmountGate recipient={recipient} />,
      })
    },
    [push],
  )

  const openAddRecipient = useCallback(
    (prefillName?: string, prefillIban?: string) => {
      const prefillKey = prefillIban
        ? `:iban:${prefillIban}`
        : prefillName
          ? `:name:${prefillName}`
          : ""
      push({
        key: `send-money-add-recipient${prefillKey}`,
        render: () => (
          <AddRecipientGate
            prefillName={prefillName}
            prefillIban={prefillIban}
          />
        ),
      })
    },
    [push],
  )

  const handleAddRecipient = useCallback(() => {
    if (addRowVariant === "send-to-iban" && addRowPrefill) {
      openAddRecipient(undefined, addRowPrefill)
      return
    }
    openAddRecipient(addRowPrefill)
  }, [addRowPrefill, addRowVariant, openAddRecipient])

  const listRecipients = searchResult.recipients
  const showAddRow =
    addRowVariant === "send-to-iban" ||
    addRowVariant === "no-results" ||
    showAddFirst ||
    isSearching

  const addRowSeparator =
    addRowVariant === "send-to-iban" || addRowVariant === "no-results"
      ? false
      : listRecipients.length > 0

  return (
    <div className="min-h-dvh bg-layer-floor-1">
      <div className="flex flex-col pb-6">
        <div className="px-6 py-3">
          <Typography variant="heading-l-accent" color="primary" as="h1">
            Send money to
          </Typography>
        </div>

        <div className="px-6 pb-2">
          <TextField
            type="search"
            size="lg"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or bank account"
            fullWidth
          />
        </div>

        <div className="px-6 pb-1 pt-3">
          <Typography variant="body-m-regular" color="secondary" as="p">
            Recipients
          </Typography>
        </div>

        <ul className="m-0 list-none p-0">
          {showAddFirst && showAddRow ? (
            <li>
              <AddRecipientRow
                variant={addRowVariant}
                separator={addRowSeparator}
                ibanFormatted={ibanFormatted}
                onSelect={handleAddRecipient}
              />
            </li>
          ) : null}

          {listRecipients.map((recipient, index) => {
            const isLast =
              index === listRecipients.length - 1 &&
              (!isSearching || addRowVariant === "send-to-iban" || addRowVariant === "no-results")

            return (
              <li key={recipient.id}>
                <RecipientRow
                  recipient={recipient}
                  separator={!isLast}
                  searchQuery={isSearching ? debouncedQuery : undefined}
                  now={now}
                  onSelect={openAmount}
                />
              </li>
            )
          })}

          {isSearching && showAddRow && !showAddFirst ? (
            <li>
              <AddRecipientRow
                variant={addRowVariant}
                separator={false}
                ibanFormatted={ibanFormatted}
                onSelect={handleAddRecipient}
              />
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
