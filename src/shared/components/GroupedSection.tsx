import type { ReactNode } from "react"
import "@/shared/styles/grouped-section.css"

export interface GroupedSectionProps {
  children: ReactNode
  /**
   * Top inset inside the white card.
   * Figma Activity: 12; Cards: 8; default 24 for non-home usages.
   */
  paddingTop?: 8 | 12 | 24
  /**
   * Bottom inset inside the white card.
   * Figma Activity: 12; Cards: 8.
   */
  paddingBottom?: 8 | 12
  "aria-labelledby"?: string
}

const TOP_PAD_CLASS: Record<NonNullable<GroupedSectionProps["paddingTop"]>, string> = {
  8: "grouped-section__padding-top--8",
  12: "grouped-section__padding-top--12",
  24: "grouped-section__padding-top--24",
}

const BOTTOM_PAD_CLASS: Record<
  NonNullable<GroupedSectionProps["paddingBottom"]>,
  string
> = {
  8: "grouped-section__padding-bottom--8",
  12: "grouped-section__padding-bottom--12",
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
        <div className={TOP_PAD_CLASS[paddingTop]} aria-hidden />
        {children}
        {paddingBottom != null ? (
          <div className={BOTTOM_PAD_CLASS[paddingBottom]} aria-hidden />
        ) : null}
      </section>
      <div className="grouped-section__separator" aria-hidden />
    </div>
  )
}
