import { Typography } from "@bolteu/kalep-react"
import Alert from "@bolteu/kalep-react-icons/dist/Alert"
import Time from "@bolteu/kalep-react-icons/dist/Time"
import type { ReactNode } from "react"
import type { DetailNoticeTone } from "../lib/transactionDetailContent"

export interface DetailNoticeProps {
  tone: DetailNoticeTone
  title: string
  body: string
  icon?: ReactNode
}

function defaultIcon(tone: DetailNoticeTone): ReactNode {
  if (tone === "danger") {
    return <Alert size="md" className="text-danger-primary" aria-hidden />
  }
  return <Time size="md" className="text-warning-primary" aria-hidden />
}

/** Figma Ⓒ Inline Notification under the detail summary. */
export function DetailNotice({ tone, title, body, icon }: DetailNoticeProps) {
  const toneClass =
    tone === "danger"
      ? "bg-danger-secondary"
      : tone === "warning"
        ? "bg-warning-secondary"
        : "bg-neutral-secondary"

  return (
    <div className={`mx-6 mt-4 rounded-[var(--dimension-300)] px-4 py-3 ${toneClass}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0" aria-hidden>
          {icon ?? defaultIcon(tone)}
        </span>
        <div className="min-w-0 flex-1">
          <Typography variant="body-m-compact-accent" color="primary" as="p">
            {title}
          </Typography>
          <div className="pt-0.5">
            <Typography variant="body-s-regular" color="primary" as="p">
              {body}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
