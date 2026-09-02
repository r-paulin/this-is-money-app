import { Button, ListItemLayout, TextField, Typography } from "@bolteu/kalep-react"
import type { DeliveryAddressForm } from "../lib/replaceCard.constants"

export interface ReplaceCardDeliveryContentProps {
  address: DeliveryAddressForm
  onAddressChange: (field: keyof DeliveryAddressForm, value: string) => void
  onSubmit: () => void
  error?: string | null
}

export function ReplaceCardDeliveryContent({
  address,
  onAddressChange,
  onSubmit,
  error,
}: ReplaceCardDeliveryContentProps) {
  return (
    <div className="min-h-dvh bg-layer-floor-1">
      <div className="flex flex-col">
        <div className="px-6 py-3">
          <Typography variant="heading-l-accent" color="primary" as="h1">
            Where should we send your card?
          </Typography>
        </div>

        <div className="flex flex-col gap-0 px-6">
          <TextField
            disabled
            label="Country *"
            value="Canada"
            onChange={() => undefined}
          />
          <TextField
            label="Street address *"
            value={address.streetAddress}
            onChange={(event) => onAddressChange("streetAddress", event.target.value)}
          />
          <TextField
            label="Apartment, suite, unit"
            value={address.apartment}
            onChange={(event) => onAddressChange("apartment", event.target.value)}
          />
          <TextField
            label="City *"
            value={address.city}
            onChange={(event) => onAddressChange("city", event.target.value)}
          />
          <TextField
            label="State / Province / Region *"
            value={address.stateProvince}
            onChange={(event) => onAddressChange("stateProvince", event.target.value)}
          />
          <TextField
            label="Postal code *"
            value={address.postalCode}
            onChange={(event) => onAddressChange("postalCode", event.target.value)}
          />
        </div>

        <div className="px-6 py-2">
          <hr className="m-0 border-0 border-t border-neutral-primary" />
        </div>

        <ListItemLayout
          primary={
            <span className="flex items-center gap-2">
              <Typography variant="body-m-regular" color="secondary" as="span">
                <span className="line-through">$11.00</span>
              </Typography>
              <Typography variant="body-m-accent" color="primary" as="span">
                $0.00
              </Typography>
            </span>
          }
          paddingStart={6}
          paddingEnd={6}
        />

        {error ? (
          <div className="px-6 pt-2">
            <Typography variant="body-s-regular" color="danger-primary" as="p">
              {error}
            </Typography>
          </div>
        ) : null}

        <div className="px-6 pb-6 pt-3">
          <Button size="lg" variant="primary" onClick={onSubmit} fullWidth>
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
