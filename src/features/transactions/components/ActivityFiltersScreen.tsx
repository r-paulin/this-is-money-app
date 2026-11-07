import { Button, GhostButton, Typography } from "@bolteu/kalep-react"
import ArrowCircleDown from "@bolteu/kalep-react-icons/dist/ArrowCircleDown"
import ArrowCircleUp from "@bolteu/kalep-react-icons/dist/ArrowCircleUp"
import ChevronLeft from "@bolteu/kalep-react-icons/dist/ChevronLeft"
import ChevronRight from "@bolteu/kalep-react-icons/dist/ChevronRight"
import { useState, type ReactNode } from "react"
import { GroupedSection } from "@/shared/components/GroupedSection"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { useNavigationStack } from "@/shared/navigation"
import {
  ACTIVITY_TYPE_LABEL,
  ACTIVITY_TYPES,
  type ActivityFilterSelection,
  type DatePresetId,
  type MoneyFlowId,
  EMPTY_ACTIVITY_FILTERS,
  RANGE_ERROR,
  canApplyActivityFilters,
  customRangeError,
  isActivityTypeQuiet,
  selectMoneyFlow,
  slideCustomEnd,
  toggleActivityType,
} from "../lib/activityFilters"
import { MONTHS_SHORT } from "../lib/formatTransactionDate"
import { startOfDay } from "../lib/statementRanges"
import "./activity-filters.css"
import "./custom-date-rows.css"

const DATE_OPTIONS: { id: DatePresetId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "this_week", label: "This week" },
  { id: "this_month", label: "This month" },
  { id: "last_month", label: "Last month" },
  { id: "custom", label: "Custom" },
]

const FLOW_OPTIONS: { id: MoneyFlowId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in", label: "Money in" },
  { id: "out", label: "Money out" },
]

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

type DateField = "start" | "end"

export function ActivityFiltersScreen({
  applied,
  onApply,
}: {
  applied: ActivityFilterSelection
  onApply: (selection: ActivityFilterSelection) => void
}) {
  const { pop } = useNavigationStack()
  const [draft, setDraft] = useState(applied)
  const [picking, setPicking] = useState<DateField>("start")
  const [visibleMonth, setVisibleMonth] = useState(() =>
    firstOfMonth(applied.customStart ?? applied.customEnd ?? new Date()),
  )

  const isCustom = draft.date === "custom"
  const rangeError = isCustom ? customRangeError(draft.customStart, draft.customEnd) : null

  const applyFilters = () => {
    if (!canApplyActivityFilters(draft)) return
    onApply(draft)
    pop()
  }

  const chooseDay = (day: Date) => {
    const picked = startOfDay(day)
    setDraft((current) => {
      if (picking === "end") return { ...current, customEnd: picked }
      const customEnd =
        current.customStart && current.customEnd
          ? slideCustomEnd(current.customStart, current.customEnd, picked)
          : current.customEnd
      return { ...current, customStart: picked, customEnd }
    })
  }

  return (
    <div className="flex min-h-[calc(var(--app-h)-var(--app-navbar-offset))] flex-col bg-layer-floor-1">
      <div className="flex-1 bg-layer-floor-0-grouped pb-4">
        <div className="bg-layer-floor-1 px-6 py-3">
          <Typography variant="heading-l-accent" color="primary" as="h1">
            Filters
          </Typography>
        </div>

        <GroupedSection
          paddingTop={8}
          paddingBottom={8}
          separatorTop={false}
          aria-labelledby="filters-date-heading"
        >
          <SectionHeader id="filters-date-heading" grouped paddingBottom={8}>
            Date
          </SectionHeader>
          <div className="flex flex-wrap gap-2 px-6 py-3" role="group" aria-label="Date">
            {DATE_OPTIONS.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={draft.date === option.id}
                onSelect={() => setDraft((current) => ({ ...current, date: option.id }))}
              />
            ))}
          </div>
          <div
            className={["custom-date-rows", isCustom ? "is-open" : ""].filter(Boolean).join(" ")}
            aria-hidden={!isCustom}
          >
            <div className="custom-date-rows__clip">
              <div className="custom-date-rows__row custom-date-rows__row--1 flex flex-col gap-3 px-6 pb-3">
                <div className="grid grid-cols-2 gap-3">
                  <DateFieldButton
                    label="Start date"
                    value={draft.customStart}
                    pressed={picking === "start"}
                    onSelect={() => setPicking("start")}
                  />
                  <DateFieldButton
                    label="End date"
                    value={draft.customEnd}
                    pressed={picking === "end"}
                    invalid={rangeError != null}
                    onSelect={() => setPicking("end")}
                  />
                </div>
                {rangeError ? (
                  <p className="m-0 text-danger-primary">{RANGE_ERROR}</p>
                ) : null}
                <MonthCalendar
                  month={visibleMonth}
                  start={draft.customStart}
                  end={draft.customEnd}
                  onShift={(delta) =>
                    setVisibleMonth(
                      (current) => new Date(current.getFullYear(), current.getMonth() + delta, 1),
                    )
                  }
                  onPick={chooseDay}
                />
              </div>
            </div>
          </div>
        </GroupedSection>

        <GroupedSection
          paddingTop={8}
          paddingBottom={8}
          separatorTop={false}
          aria-labelledby="filters-flow-heading"
        >
          <SectionHeader id="filters-flow-heading" grouped paddingBottom={8}>
            Money flow
          </SectionHeader>
          <div className="flex flex-wrap gap-2 px-6 py-3" role="group" aria-label="Money flow">
            {FLOW_OPTIONS.map((option) => (
              <FilterChip
                key={option.id}
                label={option.label}
                selected={draft.moneyFlow === option.id}
                endIcon={
                  option.id === "in" ? (
                    <ArrowCircleDown
                      size="sm"
                      aria-hidden
                      className={
                        draft.moneyFlow === "in" ? "text-static-key-light" : "text-primary"
                      }
                    />
                  ) : option.id === "out" ? (
                    <ArrowCircleUp
                      size="sm"
                      aria-hidden
                      className={
                        draft.moneyFlow === "out" ? "text-static-key-light" : "text-primary"
                      }
                    />
                  ) : null
                }
                onSelect={() => setDraft((current) => selectMoneyFlow(current, option.id))}
              />
            ))}
          </div>
        </GroupedSection>

        <GroupedSection
          paddingTop={8}
          paddingBottom={8}
          separatorTop={false}
          aria-labelledby="filters-type-heading"
        >
          <SectionHeader id="filters-type-heading" grouped paddingBottom={8}>
            Activity type
          </SectionHeader>
          <div className="flex flex-wrap gap-2 px-6 py-3" role="group" aria-label="Activity type">
            <FilterChip
              label="All"
              selected={draft.types.length === 0}
              onSelect={() => setDraft((current) => ({ ...current, types: [] }))}
            />
            {ACTIVITY_TYPES.map((type) => (
              <FilterChip
                key={type}
                label={ACTIVITY_TYPE_LABEL[type]}
                selected={draft.types.includes(type)}
                quiet={isActivityTypeQuiet(draft.moneyFlow, type)}
                onSelect={() => setDraft((current) => toggleActivityType(current, type))}
              />
            ))}
          </div>
        </GroupedSection>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-4 bg-layer-floor-1 px-6 py-4">
        <Button size="lg" fullWidth onClick={applyFilters}>
          Apply filters
        </Button>
        <Button
          size="lg"
          variant="secondary"
          fullWidth
          onClick={() => setDraft({ ...EMPTY_ACTIVITY_FILTERS, types: [] })}
        >
          Clear filters
        </Button>
      </div>
    </div>
  )
}

function FilterChip({
  label,
  selected,
  quiet = false,
  endIcon,
  onSelect,
}: {
  label: string
  selected: boolean
  quiet?: boolean
  endIcon?: ReactNode
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={quiet}
      onClick={onSelect}
      className={[
        "activity-filter-chip inline-flex min-h-9 min-w-20 items-center justify-center gap-1.5 rounded-compact border px-3 py-1.5 disabled:opacity-100",
        selected
          ? "border-neutral-secondary bg-action-primary text-static-key-light"
          : "border-neutral-secondary bg-neutral-secondary",
        quiet ? "text-tertiary" : selected ? "" : "text-primary",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Typography
        variant="body-s-accent"
        color={quiet ? "tertiary" : selected ? "primary-inverted" : "primary"}
        as="span"
      >
        {label}
      </Typography>
      {endIcon}
    </button>
  )
}

function DateFieldButton({
  label,
  value,
  pressed,
  invalid = false,
  onSelect,
}: {
  label: string
  value: Date | null
  pressed: boolean
  invalid?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onSelect}
      className={[
        "flex min-h-14 flex-col items-start justify-center rounded-compact bg-neutral-secondary px-3 py-2 text-left",
        invalid
          ? "border border-danger-primary"
          : pressed
            ? "border border-action-primary"
            : "border border-transparent",
      ].join(" ")}
    >
      <Typography variant="body-s-regular" color="tertiary" as="span">
        {label}
      </Typography>
      {value ? (
        <Typography variant="body-m-regular" color="primary" as="span">
          {formatFieldDate(value)}
        </Typography>
      ) : null}
    </button>
  )
}

function MonthCalendar({
  month,
  start,
  end,
  onShift,
  onPick,
}: {
  month: Date
  start: Date | null
  end: Date | null
  onShift: (delta: number) => void
  onPick: (day: Date) => void
}) {
  const label = month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
  const cells = monthCells(month)
  const startTime = start ? startOfDay(start).getTime() : null
  const endTime = end ? startOfDay(end).getTime() : null
  const ordered = startTime != null && endTime != null && startTime <= endTime

  return (
    <div className="flex flex-col gap-2" role="group" aria-label={label}>
      <div className="flex items-center justify-between">
        <GhostButton aria-label="Previous month" onClick={() => onShift(-1)}>
          <ChevronLeft size="md" aria-hidden />
        </GhostButton>
        <Typography variant="body-m-accent" color="primary" as="p">
          {label}
        </Typography>
        <GhostButton aria-label="Next month" onClick={() => onShift(1)}>
          <ChevronRight size="md" aria-hidden />
        </GhostButton>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <Typography key={day} variant="body-s-regular" color="tertiary" as="span">
            {day}
          </Typography>
        ))}
        {cells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />
          const time = startOfDay(day).getTime()
          const endpoint = time === startTime || time === endTime
          const within =
            ordered && startTime != null && endTime != null && time > startTime && time < endTime
          return (
            <button
              key={time}
              type="button"
              aria-pressed={endpoint}
              aria-label={formatFieldDate(day)}
              onClick={() => onPick(day)}
              className={[
                "activity-filter-chip inline-flex h-10 items-center justify-center rounded-full",
                endpoint
                  ? "bg-action-primary text-static-key-light"
                  : within
                    ? "bg-action-secondary text-primary"
                    : "text-primary",
              ].join(" ")}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function firstOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function monthCells(month: Date): Array<Date | null> {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const lead = new Date(year, monthIndex, 1).getDay()
  const days = new Date(year, monthIndex + 1, 0).getDate()
  const cells: Array<Date | null> = Array.from({ length: lead }, () => null)
  for (let day = 1; day <= days; day += 1) cells.push(new Date(year, monthIndex, day))
  return cells
}

function formatFieldDate(date: Date): string {
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}, ${date.getFullYear()}`
}
