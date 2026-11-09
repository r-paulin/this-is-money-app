import { Button, ListItemLayout, Typography, useSnackbar } from "@bolteu/kalep-react"
import Card from "@bolteu/kalep-react-icons/dist/Card"
import CopyOutlined from "@bolteu/kalep-react-icons/dist/CopyOutlined"
import Globe from "@bolteu/kalep-react-icons/dist/Globe"
import ShareIosOutlined from "@bolteu/kalep-react-icons/dist/ShareIosOutlined"
import Time from "@bolteu/kalep-react-icons/dist/Time"
import { GroupedSection } from "@/shared/components/GroupedSection"
import { formatIbanDisplay } from "@/features/sendMoney/lib/iban"
import { MOCK_ACCOUNT_DETAILS } from "../data/mockAccountDetails"
import {
  formatAccountDetailsShareText,
  formatBankNameAndAddressCopy,
} from "../lib/accountDetailsLogic"

const COPY_SNACKBAR = "Copied to clipboard"

const INFO_ITEMS = [
  {
    id: "local",
    title: "Local transfers",
    body: "Usually arrive instantly or within 2 working days, depending on the sending bank",
    Icon: Time,
  },
  {
    id: "international",
    title: "International transfers",
    body: "Transfer times vary by country and bank. The sending or intermediary bank may charge fees",
    Icon: Globe,
  },
  {
    id: "receive",
    title: "Receive money into your account",
    body: "Use these account details to receive payments. You can also use them to set up direct debits where supported",
    Icon: Card,
  },
] as const

type DetailRowId = "holder" | "iban" | "bic" | "bank"

const DETAIL_ROWS: {
  id: DetailRowId
  label: string
}[] = [
  { id: "holder", label: "Account holder" },
  { id: "iban", label: "IBAN" },
  { id: "bic", label: "BIC/SWIFT code" },
  { id: "bank", label: "Bank name and address" },
]

function CopyIconSlot() {
  return <CopyOutlined size="lg" className="text-secondary" aria-hidden />
}

export function AccountDetailsScreen() {
  const details = MOCK_ACCOUNT_DETAILS
  const snackbar = useSnackbar()
  const ibanDisplay = formatIbanDisplay(details.iban)

  async function copyValue(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      snackbar.add({
        description: COPY_SNACKBAR,
        dismissible: true,
        timeout: 3000,
      })
    } catch {
      snackbar.add({
        description: "Could not copy to clipboard",
        dismissible: true,
        timeout: 3000,
      })
    }
  }

  function resolveDisplay(id: DetailRowId) {
    switch (id) {
      case "holder":
        return details.accountHolder
      case "iban":
        return ibanDisplay
      case "bic":
        return details.bic
      case "bank":
        return details.bankName
    }
  }

  function resolveCopy(id: DetailRowId) {
    switch (id) {
      case "holder":
        return details.accountHolder
      case "iban":
        return details.iban
      case "bic":
        return details.bic
      case "bank":
        return formatBankNameAndAddressCopy(details)
    }
  }

  async function handleShare() {
    const text = formatAccountDetailsShareText(details)
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ text })
        return
      }
    } catch (error) {
      // User cancel — don't fall through to clipboard.
      if (error instanceof DOMException && error.name === "AbortError") return
    }
    await copyValue(text)
  }

  return (
    <div className="flex min-h-[calc(var(--app-h)-var(--app-navbar-offset))] flex-col overflow-y-auto bg-layer-floor-1">
      <div className="flex flex-col gap-1 px-6 pb-4">
        <Typography variant="heading-l-accent" color="primary" as="h1">
          Account details
        </Typography>
        <Typography variant="body-m-regular" color="secondary" as="p">
          Share these details to receive EUR payments
        </Typography>
      </div>

      <GroupedSection paddingTop={8} paddingBottom={12} separatorTop={false}>
        <ul className="m-0 list-none p-0">
          {DETAIL_ROWS.map((row, index) => {
            const isLast = index === DETAIL_ROWS.length - 1
            const value = resolveDisplay(row.id)
            return (
              <li key={row.id}>
                <ListItemLayout
                  isReverse
                  gap={1}
                  secondary={
                    <Typography
                      variant="body-m-compact-regular"
                      color="secondary"
                      as="span"
                    >
                      {row.label}
                    </Typography>
                  }
                  primary={
                    row.id === "bank" ? (
                      <Typography
                        variant="body-m-regular"
                        color="primary"
                        as="div"
                      >
                        <div>{value}</div>
                        <Typography
                          variant="body-m-regular"
                          color="secondary"
                          as="div"
                        >
                          {details.bankAddress}
                        </Typography>
                      </Typography>
                    ) : (
                      <Typography
                        variant="body-m-regular"
                        color="primary"
                        as="span"
                      >
                        {value}
                      </Typography>
                    )
                  }
                  separator={!isLast}
                  paddingStart={6}
                  paddingEnd={6}
                  paddingTop={3}
                  paddingBottom={3}
                  onClick={() => {
                    void copyValue(resolveCopy(row.id))
                  }}
                  aria-label={`Copy ${row.label}`}
                  renderEndSlot={() => <CopyIconSlot />}
                />
              </li>
            )
          })}
        </ul>

        <div className="px-6 py-3">
          <Button
            size="lg"
            variant="secondary"
            fullWidth
            onClick={() => {
              void handleShare()
            }}
          >
            <ShareIosOutlined size="lg" aria-hidden />
            Share details
          </Button>
        </div>
      </GroupedSection>

      <GroupedSection paddingTop={8} paddingBottom={8} separatorBottom={false}>
        <ul className="m-0 list-none p-0">
          {INFO_ITEMS.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 px-6 py-3"
            >
              <item.Icon
                size="lg"
                className="shrink-0 text-special-brand"
                aria-hidden
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Typography variant="body-m-accent" color="primary" as="p">
                  {item.title}
                </Typography>
                <Typography variant="body-s-regular" color="secondary" as="p">
                  {item.body}
                </Typography>
              </div>
            </li>
          ))}
        </ul>
      </GroupedSection>
    </div>
  )
}
