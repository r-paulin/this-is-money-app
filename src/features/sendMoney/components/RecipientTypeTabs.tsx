import type { RecipientType } from "../sendMoney.types"
import { RECIPIENT_TYPE_TAB_IDS, RECIPIENT_TYPE_TABS } from "./recipientTypeConstants"
import "./recipient-type-tabs.css"

export interface RecipientTypeTabsProps {
  value: RecipientType
  onChange: (type: RecipientType) => void
}

/** Figma 7507:114775 — Individual / Business tabs above add-recipient form */
export function RecipientTypeTabs({ value, onChange }: RecipientTypeTabsProps) {
  return (
    <div className="recipient-type-tabs">
      <div
        role="tablist"
        aria-label="Recipient type"
        className="recipient-type-tabs__list flex min-h-12 items-center px-6"
      >
        {RECIPIENT_TYPE_TABS.map((tab) => {
          const selected = value === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              id={RECIPIENT_TYPE_TAB_IDS[tab.value]}
              aria-selected={selected}
              aria-controls={`recipient-type-panel-${tab.value}`}
              tabIndex={selected ? 0 : -1}
              className={[
                "recipient-type-tabs__tab relative flex min-h-12 items-center px-2 py-2",
                selected
                  ? "recipient-type-tabs__tab--selected bolt-font-body-m-compact-accent text-primary"
                  : "bolt-font-body-m-compact-regular text-secondary",
              ].join(" ")}
              onClick={() => onChange(tab.value)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
