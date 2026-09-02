import { ListItemLayout, Typography } from "@bolteu/kalep-react"
import { SkeletonBar, SkeletonCircle } from "@/shared/components/skeleton/SkeletonPlaceholders"
import {
  REPLACE_REASON_OPTIONS,
  type ReplaceReasonId,
} from "../lib/replaceCard.constants"

export interface ReplaceCardReasonContentProps {
  loading?: boolean
  selectedReason?: ReplaceReasonId
  onReasonChange?: (reason: ReplaceReasonId) => void
}

export function ReplaceCardReasonContent({
  loading = false,
  selectedReason,
  onReasonChange,
}: ReplaceCardReasonContentProps) {
  return (
    <div className="min-h-dvh bg-layer-floor-1">
      <div className="flex flex-col">
        <div className="px-6 py-3">
          <div className="relative">
            <Typography
              variant="heading-l-accent"
              color="primary"
              as="h1"
              aria-hidden={loading}
            >
              <span className={loading ? "invisible" : undefined}>Replace your card</span>
            </Typography>
            {loading ? (
              <SkeletonBar
                width={180}
                height={14}
                className="absolute left-0 top-1/2 -translate-y-1/2"
              />
            ) : null}
          </div>
        </div>

        <div className="px-6 pb-6 pt-[5px]">
          <div className="relative">
            <Typography variant="body-m-regular" color="primary" as="p" aria-hidden={loading}>
              <span className={loading ? "invisible" : undefined}>
                Choose the reason for replacing your card:
              </span>
            </Typography>
            {loading ? (
              <SkeletonBar
                width={280}
                height={14}
                className="absolute left-0 top-1/2 -translate-y-1/2"
              />
            ) : null}
          </div>
        </div>

        <ul className="m-0 list-none p-0">
          {(loading ? REPLACE_REASON_OPTIONS.slice(0, 3) : REPLACE_REASON_OPTIONS).map(
            (option, index, items) => {
              const isLast = index === items.length - 1

              if (loading) {
                return (
                  <li key={option.id}>
                    <ListItemLayout
                      separator={!isLast}
                      paddingStart={6}
                      paddingEnd={6}
                      primary={
                        <SkeletonBar
                          width={120}
                          height={14}
                          className="my-[5px]"
                        />
                      }
                      renderStartSlot={() => <SkeletonCircle size={24} />}
                    />
                  </li>
                )
              }

              return (
                <li key={option.id}>
                  <ListItemLayout
                    primary={option.label}
                    separator={!isLast}
                    paddingStart={6}
                    paddingEnd={6}
                    selected={selectedReason === option.id}
                    selectionMode="solo-radio"
                    onClick={() => onReasonChange?.(option.id)}
                  />
                </li>
              )
            },
          )}
        </ul>
      </div>
    </div>
  )
}
