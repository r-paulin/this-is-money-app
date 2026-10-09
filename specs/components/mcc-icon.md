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
│              │20px│ badge only on a category circle
└──────────────└────┘
     offset: 4px outside circle (-bottom-mcc-badge-offset)
```

## Rules

1. Circle background from `theme.bgClass` (`bg-mcc-*`) — never inline hex
2. Ride payouts: Bolt glyph on the green circle, plus the same small inflow badge a reversal uses. A transfer to another person: cash glyph on the green circle, plus the outflow badge. Incoming transfers use that circle with the inflow badge. ATM stays the outgoing arrow mark.
3. Declined and failed keep the category glyph, greyed (`text-secondary`). The list circle is `bg-neutral-secondary`. Detail uses `bg-layer-floor-1`. The decline badge is a 16px slot (`size-mcc-badge`) at the same -4px corner as inflow and outflow, vertically flipped, with the 20px graphic overflowing by 12.5%.
4. Cashback is selected only by `themeOverride`. It has no MCC codes. Glyph is Figma `cashback_colored` (`9526:168300`) — `icon-cashback-colored.svg`, not Kalep Gift.
5. A refund or reversal that still uses a category circle may show the 20px inflow asset, unflipped.
6. Icon mapping lives in `THEME_ICONS` — add new themes there + `mccThemes.ts`

## Do not

- Change circle to 48px without updating Figma spec
- Use `rounded-[8px]` on the category icon (always `rounded-full`)
- Put hex colors in `mccThemes.ts` — use `bg-mcc-*` classes only
