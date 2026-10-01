import { Typography } from "@bolteu/kalep-react"
import type { ReactNode } from "react"

interface SectionHeaderProps {
  id?: string
  children: ReactNode
  /** Bottom spacer in px. Transactions list uses 8; default 12 matches Figma 6582:20909. */
  paddingBottom?: 8 | 12
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
  variant = "heading-xs-accent",
  grouped = false,
}: SectionHeaderProps) {
  return (
    <div className="flex w-full flex-col items-start px-6">
      {/* Ungrouped: 24px top. Grouped: 12px header PaddingTop (Figma). */}
      <div
        className={`w-full shrink-0 ${grouped ? "h-3" : "h-6"}`}
        aria-hidden
      />
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
