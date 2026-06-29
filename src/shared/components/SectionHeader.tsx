import { Typography } from "@bolteu/kalep-react"
import type { ReactNode } from "react"

interface SectionHeaderProps {
  id?: string
  children: ReactNode
}

/** Figma Ⓒ Section Header (6582:20909) — 24px top, title, 12px bottom, px-6. */
export function SectionHeader({ id, children }: SectionHeaderProps) {
  return (
    <div className="flex w-full flex-col items-start px-6">
      <div className="h-6 w-full shrink-0" aria-hidden />
      <h2 id={id} className="m-0 w-full break-words">
        <Typography
          variant="heading-xs-accent"
          color="primary"
          as="span"
          align="start"
          inlineStyle={{ fontVariantNumeric: "lining-nums proportional-nums" }}
        >
          {children}
        </Typography>
      </h2>
      <div className="h-3 w-full shrink-0" aria-hidden />
    </div>
  )
}
