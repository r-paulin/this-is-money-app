import { Typography } from "@bolteu/kalep-react"
import type { ReactNode } from "react"

interface SectionHeaderProps {
  id?: string
  children: ReactNode
  /** Bottom spacer in px. Transactions list uses 8; default 12 matches Figma 6582:20909. */
  paddingBottom?: 8 | 12
  /**
   * Top spacer in px. Default 24 (ungrouped) / 12 (grouped).
   * Cashback / Earned section headers use 20 (Figma 9588:212464).
   */
  paddingTop?: 12 | 20 | 24
  /** Home Services uses heading-s; date groups use heading-xs (default). */
  variant?: "heading-s-accent" | "heading-xs-accent"
  /**
   * Grouped home sections: Figma Ⓒ Section Header still has 12px top pad;
   * GroupedSection supplies the section-level inset (8/12) above that.
   */
  grouped?: boolean
}

/** Figma Ⓒ Section Header — top spacer, title, bottom spacer, px-6. */
export function SectionHeader({
  id,
  children,
  paddingBottom = 12,
  paddingTop,
  variant = "heading-xs-accent",
  grouped = false,
}: SectionHeaderProps) {
  const top =
    paddingTop ?? (grouped ? 12 : 24)
  const topClass =
    top === 12 ? "h-3" : top === 20 ? "h-5" : "h-6"

  return (
    <div className="flex w-full flex-col items-start px-6">
      <div className={`w-full shrink-0 ${topClass}`} aria-hidden />
      <h2 id={id} className="m-0 w-full break-words">
        <Typography
          variant={variant}
          color="primary"
          as="span"
          align="start"
          inlineStyle={{ fontVariantNumeric: "lining-nums proportional-nums" }}
        >
          {children}
        </Typography>
      </h2>
      <div
        className={`w-full shrink-0 ${paddingBottom === 8 ? "h-2" : "h-3"}`}
        aria-hidden
      />
    </div>
  )
}
