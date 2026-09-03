import { Typography } from "@bolteu/kalep-react"

const EU_FLAG_URL = import.meta.glob<string>(
  "/node_modules/circle-flags/flags/eu.svg",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
)["/node_modules/circle-flags/flags/eu.svg"]

export function EurCurrencyChip() {
  return (
    <div
      className="flex shrink-0 items-center gap-1 rounded-compact bg-neutral-secondary px-2 py-1"
      aria-hidden
    >
      {EU_FLAG_URL ? (
        <img src={EU_FLAG_URL} alt="" width={24} height={24} className="size-6 rounded-full" />
      ) : null}
      <span className="text-primary">
        <Typography variant="body-m-compact-accent" color="primary" as="span">
          EUR
        </Typography>
      </span>
    </div>
  )
}
