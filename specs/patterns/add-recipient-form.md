# Add recipient form

Step 1 of the send-money flow — bank details for a new payee.

**Figma:** `7507:114775` (screen), `7507:106517` (transfer form + fields)

## Recipient type tabs

`RecipientTypeTabs` sits **above** the form fields:

| Tab | Last field label |
|-----|------------------|
| Individual | Account holder name |
| Business | Business name |

- Switching tabs **keeps** the same `accountHolderName` value; only the label changes.
- **Motion:** the form (country, account fields, name) cross-fades at `--motion-duration-xs` and `--motion-ease-standard` (`RecipientTypeFormPanels`). It does not slide. Active input blurs on switch.
- Selected type is stored on `Recipient.recipientType` when the user continues.
- Components: `RecipientTypeTabs`, `RecipientTypeFormPanels` under `src/features/sendMoney/components/`

## Form fields

See [text-field.md](text-field.md) for inline-label inputs (`InlineLabelTextField`, `FormPickerField`).

- Bank country → picker (`FormPickerField`)
- SEPA: IBAN + name
- Canada EFT: account / transit / institution numbers + name

## Loading

Country change shows a short schema skeleton (`RecipientFormSkeleton`) including a tab-bar placeholder.
