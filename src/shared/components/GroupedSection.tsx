import type { ReactNode } from "react"
import "@/shared/styles/grouped-section.css"

export interface GroupedSectionProps {
  children: ReactNode
  /** Section top inset inside the white card (default 24px). */
  paddingTop?: 8 | 24
  /** Optional bottom inset inside the white card (Cards 8px). */
  paddingBottom?: 8
  "aria-labelledby"?: string
}

/** White grouped card on floor-0-grouped with 8px separators above and below. */
export function GroupedSection({
  children,
  paddingTop = 24,
  paddingBottom,
  "aria-labelledby": ariaLabelledBy,
}: GroupedSectionProps) {
  return (
    <div className="grouped-section__wrap">
      <div className="grouped-section__separator" aria-hidden />
      <section
        className="grouped-section__card"
        aria-labelledby={ariaLabelledBy}
      >
        <div
          className={
            paddingTop === 8
              ? "grouped-section__padding-top--8"
              : "grouped-section__padding-top--24"
          }
          aria-hidden
        />
        {children}
        {paddingBottom === 8 ? (
          <div className="grouped-section__padding-bottom--8" aria-hidden />
        ) : null}
      </section>
      <div className="grouped-section__separator" aria-hidden />
    </div>
  )
}
