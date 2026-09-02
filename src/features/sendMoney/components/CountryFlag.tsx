import type { TransferCountry } from "../data/countries"

const FLAG_URLS = import.meta.glob<string>(
  "/node_modules/circle-flags/flags/*.svg",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
)

export interface CountryFlagProps {
  country: Pick<TransferCountry, "code" | "name" | "flagEmoji">
  size?: number
}

export function CountryFlag({ country, size = 24 }: CountryFlagProps) {
  const flagUrl =
    FLAG_URLS[
      `/node_modules/circle-flags/flags/${country.code.toLowerCase()}.svg`
    ]

  return (
    <span
      className="inline-flex shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size }}
    >
      {flagUrl ? (
        <img
          src={flagUrl}
          alt={`${country.name} flag`}
          width={size}
          height={size}
          className="size-full object-cover"
        />
      ) : (
        <span className="flex size-full items-center justify-center text-base" role="img">
          {country.flagEmoji}
        </span>
      )}
    </span>
  )
}
