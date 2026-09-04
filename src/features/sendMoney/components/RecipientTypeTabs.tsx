import { useLayoutEffect, useRef, useState } from "react"
import type { RecipientType } from "../sendMoney.types"
import { RECIPIENT_TYPE_TAB_IDS, RECIPIENT_TYPE_TABS } from "./recipientTypeConstants"
import "./recipient-type-tabs.css"

export interface RecipientTypeTabsProps {
  value: RecipientType
  onChange: (type: RecipientType) => void
}

/** Figma 7507:114775 — Individual / Business tabs above add-recipient form */
export function RecipientTypeTabs({ value, onChange }: RecipientTypeTabsProps) {
  const tablistRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Partial<Record<RecipientType, HTMLButtonElement>>>({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const measure = () => {
      const tab = tabRefs.current[value]
      const list = tablistRef.current
      if (!tab || !list) return

      const listRect = list.getBoundingClientRect()
      const tabRect = tab.getBoundingClientRect()
      setIndicator({
        left: tabRect.left - listRect.left,
        width: tabRect.width,
      })
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [value])

  return (
    <div className="recipient-type-tabs">
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Recipient type"
        className="recipient-type-tabs__list flex min-h-12 items-center px-6"
      >
        {RECIPIENT_TYPE_TABS.map((tab) => {
          const selected = value === tab.value
          return (
            <button
              key={tab.value}
              ref={(element) => {
                tabRefs.current[tab.value] = element ?? undefined
              }}
              type="button"
              role="tab"
              id={RECIPIENT_TYPE_TAB_IDS[tab.value]}
              aria-selected={selected}
              aria-controls={`recipient-type-panel-${tab.value}`}
              tabIndex={selected ? 0 : -1}
              className={[
                "relative flex min-h-12 items-center px-2 py-2",
                selected
                  ? "bolt-font-body-m-compact-accent text-primary"
                  : "bolt-font-body-m-compact-regular text-secondary",
              ].join(" ")}
              onClick={() => onChange(tab.value)}
            >
              {tab.label}
            </button>
          )
        })}
        <span
          className="recipient-type-tabs__indicator"
          style={{ left: indicator.left, width: indicator.width }}
          aria-hidden
        />
      </div>
    </div>
  )
}
