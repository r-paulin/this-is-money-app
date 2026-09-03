# Text field (inline label)

Form text inputs use an **inline / floating label** inside the field — not Kalep’s default label-above layout.

**Figma:** `7507:106517` (Bolt Money — Reference input)

## When to use

| Pattern | Component |
|---------|-----------|
| Form text input | `InlineLabelTextField` from `@/shared/components` |
| Tappable picker row (country, etc.) | `FormPickerField` |
| Search / filter bar | Kalep `TextField` with `type="search"` (unchanged) |

**Do not** use raw Kalep `TextField` with `label` above the input for form fields.

## Layout

- **Min height:** 56px (`min-h-14`)
- **Radius:** `rounded-compact` (8px)
- **Background:** `bg-neutral-secondary` (Kalep idle)
- **Padding:** `px-4 py-2`
- **Stack gap between fields:** `gap-4` (16px)

## Label states

| State | Label | Value / input |
|-------|-------|----------------|
| Empty, unfocused | `body-m-compact-regular`, secondary — single line | Hidden (`sr-only` input; tap label to focus) |
| Empty, focused | `body-s-compact-regular`, secondary | Placeholder in `body-m-compact-regular` |
| Filled | `body-s-compact-regular`, secondary | `body-m-compact-regular`, primary |
| Focused (filled or empty) | Same as filled label row | Border `action-primary`, background `special-nulled` (Kalep focus-within) |

Required fields: append ` *` to the label text (`required` prop).

## Motion

Label and input use a **200ms** ease (`cubic-bezier(0.32, 0.72, 0, 1)`): label slides from vertical center to top; input fades in. Respects `prefers-reduced-motion`. End icons sit in a fixed `size-8` slot, vertically centered in the 56px field.

## Picker field

`FormPickerField` matches the **filled** inline layout: small label + value, optional start/end slots (flag, chevron). Always tappable; no empty state.

## Errors

Use Kalep `error` + `helperText` on `InlineLabelTextField`. Helper renders below the field (Kalep default).

## Example

```tsx
import { InlineLabelTextField, FormPickerField } from "@/shared/components"

<FormPickerField
  label="Bank country"
  value={country.name}
  onClick={openCountryPicker}
  ariaLabel={`Bank country, ${country.name}. Change country`}
  startSlot={<CountryFlag country={country} />}
  endSlot={<ChevronDown />}
/>

<InlineLabelTextField
  label="IBAN"
  value={iban}
  placeholder="Enter or paste the IBAN"
  error={Boolean(error)}
  helperText={error}
  onChange={(e) => setIban(e.target.value)}
/>
```

## Implementation

- `src/shared/components/InlineLabelTextField/InlineLabelTextField.tsx`
- Wraps Kalep `TextField` with `renderLabel={() => null}` and custom `renderInput` for floating label behavior
