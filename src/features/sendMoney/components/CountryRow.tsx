import { ListItemLayout, Typography } from "@bolteu/kalep-react"
import type { ReactNode } from "react"
import type { TransferCountry } from "../data/countries"
import { CountryFlag } from "./CountryFlag"

export interface CountryRowProps {
  country: TransferCountry
  selected: boolean
  primary?: ReactNode
  separator?: boolean
  onSelect: (country: TransferCountry) => void
}

export function CountryRow({
  country,
  selected,
  primary = country.name,
  separator = true,
  onSelect,
}: CountryRowProps) {
  return (
    <div className={country.supported ? undefined : "opacity-60"}>
      <ListItemLayout
        primary={primary}
        secondary={country.supported ? undefined : "Not supported"}
        separator={separator}
        paddingStart={6}
        paddingEnd={6}
        onClick={() => onSelect(country)}
        primaryTypographyProps={{ variant: "body-m-compact-regular" }}
        secondaryTypographyProps={{ variant: "body-s-regular" }}
        renderStartSlot={() => <CountryFlag country={country} />}
        renderEndSlot={() =>
          selected ? (
            <Typography as="span" variant="body-l-accent" color="primary" aria-label="Selected">
              ✓
            </Typography>
          ) : null
        }
      />
    </div>
  )
}
