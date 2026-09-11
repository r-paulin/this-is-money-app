# Agent instructions

## Design system

Before implementing or changing UI:

1. Read **`specs/README.md`** and the relevant spec under `specs/`
2. Use **Kalep** components and semantic Tailwind classes first
3. Use **app tokens** from `src/shared/styles/tokens.css` for MCC colors, list spacing, `rounded-compact`
4. **Form text fields** use `InlineLabelTextField` (label inside the field) — see `specs/patterns/text-field.md`. Do not use Kalep `TextField` with an above-label layout for forms; search bars stay `type="search"`.
5. Never add raw `#hex` or arbitrary Tailwind like `bg-[#…]` / `rounded-[8px]` in `.tsx` — put new values in `tokens.css` and extend `tailwind.config.ts`

```bash
npm run token-audit
npm run design-system:drift
```

After bumping `vendor-tarballs/*.tgz`, run `npm run design-system:drift -- --update`.

## Ponytail

Prefer the least code that works — see `.cursor/rules/ponytail.mdc` and https://ponytail.dev/. Reuse existing helpers, skip speculative abstractions, and do not add dependencies when the platform or an already-installed package covers it.

## Navigation

Hierarchical screens use `useNavigationStack()` — see `.cursor/rules/ios-navigation.mdc` and `specs/patterns/navigation.md`.

## Tests

```bash
npm test
npm run build
npm run lint
```
