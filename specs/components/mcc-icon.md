# MCC icon (transaction category)

**Figma:** `_ MCC` node `138:7229`  
**Implementation:** `TransactionCategoryIcon.tsx` + `mccThemes.ts`

## Anatomy

```
┌──────────────────────────── 40×40 container (size-10)
│  padding: 10px (p-mcc-pad)
│  ┌──────────────────┐
│  │  glyph 20×20     │  Kalep icon size="sm" or asset SVG
│  └──────────────────┘
│              ┌────┐
│              │16px│ badge (inflow / outflow / declined)
└──────────────└────┘
     offset: 6px outside circle (-bottom-mcc-badge-offset)
```

## Rules

1. Circle background from `theme.bgClass` (`bg-mcc-*`) — never inline hex
2. Declined / failed (non-decline theme): neutral circle `bg-neutral-secondary`, `text-secondary` icon
3. Badge assets: `badge-inflow.svg`, `badge-outflow.svg`, `badge-declined.svg`
4. Icon mapping lives in `THEME_ICONS` — add new themes there + `mccThemes.ts`

## Do not

- Change circle to 48px without updating Figma spec
- Use `rounded-[8px]` on the category icon (always `rounded-full`)
- Put hex colors in `mccThemes.ts` — use `bg-mcc-*` classes only
