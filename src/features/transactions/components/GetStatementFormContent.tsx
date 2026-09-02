import {
  Button,
  ListItemLayout,
  Radio,
  Typography,
} from "@bolteu/kalep-react"
import ChevronDown from "@bolteu/kalep-react-icons/dist/ChevronDown"
import { useRef } from "react"
import {
  formatCustomRangeChip,
  parseDateInputValue,
  STATEMENT_FILE_FORMAT_OPTIONS,
  toDateInputValue,
  type StatementFileFormat,
  type StatementRangeId,
  type StatementRangeOption,
} from "../lib/statementRanges"
import "./custom-date-rows.css"

/** Figma 6875:54752 — pill chip, Body S Accent + chevron. */
const DATE_CHIP_CLASS =
  "pointer-events-none inline-flex shrink-0 items-center gap-1 rounded-full bg-neutral-secondary py-2 pl-3 pr-2"

export interface GetStatementFormContentProps {
  options: StatementRangeOption[]
  selectedRange: StatementRangeId
  onRangeChange: (id: StatementRangeId) => void
  customStart: Date
  customEnd: Date
  onCustomStartChange: (date: Date) => void
  onCustomEndChange: (date: Date) => void
  maxDate: Date
  fileFormat: StatementFileFormat
  onFileFormatChange: (format: StatementFileFormat) => void
  creating: boolean
  onCreate: () => void
}

export function GetStatementFormContent({
  options,
  selectedRange,
  onRangeChange,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
  maxDate,
  fileFormat,
  onFileFormatChange,
  creating,
  onCreate,
}: GetStatementFormContentProps) {
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)
  const maxValue = toDateInputValue(maxDate)
  const isCustom = selectedRange === "custom"

  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-6 py-3">
        <Typography variant="heading-l-accent" color="primary" as="h1">
          Get statement
        </Typography>
      </div>

      <ul className="m-0 list-none p-0" role="radiogroup" aria-label="Statement period">
        {options.map((option, index) => {
          const isLast = index === options.length - 1
          const selected = selectedRange === option.id
          return (
            <li key={option.id}>
              <ListItemLayout
                primary={option.label}
                secondary={option.subtitle}
                primaryTypographyProps={{ variant: "body-m-compact-regular" }}
                secondaryTypographyProps={{ variant: "body-s-regular" }}
                separator={!isLast}
                paddingStart={6}
                paddingEnd={6}
                disabled={creating}
                onClick={() => onRangeChange(option.id)}
                renderEndSlot={() => (
                  <Radio
                    checked={selected}
                    disabled={creating}
                    readOnly
                    tabIndex={-1}
                    aria-label={option.label}
                    onChange={() => onRangeChange(option.id)}
                  />
                )}
              />
            </li>
          )
        })}
      </ul>

      <div
        className={["custom-date-rows", isCustom ? "is-open" : ""].filter(Boolean).join(" ")}
        aria-hidden={!isCustom}
      >
        <div className="custom-date-rows__clip">
          <div className="flex flex-col">
            <input
              ref={startInputRef}
              type="date"
              className="pointer-events-none fixed left-0 top-0 size-0 opacity-0"
              tabIndex={-1}
              aria-hidden
              max={maxValue}
              value={toDateInputValue(customStart)}
              onChange={(e) => {
                const next = parseDateInputValue(e.target.value)
                if (next) onCustomStartChange(next)
              }}
            />
            <input
              ref={endInputRef}
              type="date"
              className="pointer-events-none fixed left-0 top-0 size-0 opacity-0"
              tabIndex={-1}
              aria-hidden
              max={maxValue}
              min={toDateInputValue(customStart)}
              value={toDateInputValue(customEnd)}
              onChange={(e) => {
                const next = parseDateInputValue(e.target.value)
                if (next) onCustomEndChange(next)
              }}
            />

            <div className="custom-date-rows__row custom-date-rows__row--1">
              <DateRow
                label="Start date"
                valueLabel={formatCustomRangeChip(customStart)}
                disabled={creating || !isCustom}
                onOpen={() => {
                  const input = startInputRef.current
                  if (!input) return
                  if (typeof input.showPicker === "function") {
                    void input.showPicker()
                  } else {
                    input.click()
                  }
                }}
              />
            </div>
            <div className="custom-date-rows__row custom-date-rows__row--2">
              <DateRow
                label="End date"
                valueLabel={formatCustomRangeChip(customEnd)}
                disabled={creating || !isCustom}
                onOpen={() => {
                  const input = endInputRef.current
                  if (!input) return
                  if (typeof input.showPicker === "function") {
                    void input.showPicker()
                  } else {
                    input.click()
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Figma 7024:22398 — File format section header (12 top / 8 bottom, no radio). */}
      <ListItemLayout
        primary="File format"
        secondary="Select the format for your download"
        primaryTypographyProps={{ variant: "body-l-accent" }}
        secondaryTypographyProps={{ variant: "body-s-regular" }}
        separator={false}
        paddingStart={6}
        paddingEnd={6}
        paddingTop={3}
        paddingBottom={2}
      />

      <ul className="m-0 list-none p-0" role="radiogroup" aria-label="File format">
        {STATEMENT_FILE_FORMAT_OPTIONS.map((option, index) => {
          const isLast = index === STATEMENT_FILE_FORMAT_OPTIONS.length - 1
          const selected = fileFormat === option.id
          return (
            <li key={option.id}>
              {/* Figma 7024:22428 — 8px vertical padding (size.comp.M), 48px row. */}
              <ListItemLayout
                primary={option.label}
                primaryTypographyProps={{ variant: "body-m-compact-regular" }}
                separator={!isLast}
                paddingStart={6}
                paddingEnd={6}
                paddingTop={2}
                paddingBottom={2}
                disabled={creating}
                onClick={() => onFileFormatChange(option.id)}
                renderEndSlot={() => (
                  <Radio
                    checked={selected}
                    disabled={creating}
                    readOnly
                    tabIndex={-1}
                    aria-label={option.label}
                    onChange={() => onFileFormatChange(option.id)}
                  />
                )}
              />
            </li>
          )
        })}
      </ul>

      {/* Button sits under the list (Figma 6875:54191), not pinned to viewport bottom */}
      <div className="px-6 py-4">
        <Button
          size="lg"
          variant="primary"
          fullWidth
          loading={creating}
          onClick={onCreate}
        >
          Create statement
        </Button>
      </div>
    </div>
  )
}

function DateRow({
  label,
  valueLabel,
  disabled,
  onOpen,
}: {
  label: string
  valueLabel: string
  disabled: boolean
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="flex w-full flex-row items-center justify-between gap-3 border-0 bg-transparent px-6 py-3 text-left disabled:opacity-50"
      onClick={onOpen}
    >
      <Typography as="span" variant="body-m-compact-regular" color="primary">
        {label}
      </Typography>
      <span className={DATE_CHIP_CLASS}>
        <Typography as="span" variant="body-s-accent" color="primary" noWrap>
          {valueLabel}
        </Typography>
        <ChevronDown size="sm" className="shrink-0 text-tertiary" aria-hidden />
      </span>
    </button>
  )
}
