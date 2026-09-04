# Design system specs (LLM-readable)

Machine- and human-readable design documentation for this app. **Read these before implementing UI.**

## Layer model

| Layer | Source | Use in code |
|-------|--------|-------------|
| 1 — Kalep | `@bolteu/kalep-react`, `@bolteu/kalep-tailwind`, `@bolteu/design-tokens` | Prefer Kalep components + semantic Tailwind (`text-primary`, `bg-neutral-secondary`) |
| 2 — App tokens | `src/shared/styles/tokens.css` + `tailwind.config.ts` | MCC palette, list-item spacing, `rounded-compact` |
| 3 — Feature data | e.g. `mccThemes.ts` | Maps domain → token class names (never hex) |

## Index

- [Foundations](foundations.md) — typography, color philosophy, spacing scale
- [Token reference](tokens/token-reference.md) — CSS variables and Tailwind aliases
- [MCC icon](components/mcc-icon.md) — transaction category circles
- [List item](patterns/list-item.md) — transaction / recipient rows
- [Text field](patterns/text-field.md) — inline-label form inputs (not search)
- [Add recipient form](patterns/add-recipient-form.md) — Individual / Business tabs, step 1 fields
- [Navigation](patterns/navigation.md) — push vs modal (see also `.cursor/rules/ios-navigation.mdc`)

## Enforcement

```bash
npm run token-audit          # no raw hex / arbitrary Tailwind in src/
npm run design-system:drift  # vendor tarball versions unchanged
```

## Figma

- List item: `8114:196360` (Ⓒ List Item `8107:97972`)
- MCC icon: `138:7229`
- Text field (inline label): `7507:106517`
- Add recipient (tabs): `7507:114775`
