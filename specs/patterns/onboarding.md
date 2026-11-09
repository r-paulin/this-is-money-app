# Bolt Card onboarding

**Figma:** ONBOARDING / Page `10032:192705`

Pre-Home gate. Shown once per app session until Back or **Get a free Bolt Card**; then Home mounts via `NavigationProvider`. Not a nav-stack screen.

## Layout

- Light `OsStatusBar` + back chrome (AppNavbar styling; no stack hook)
- Hero: 345×240, 12px radius — looping muted video + cover poster (`BoltCardHeroVideo`)
- Reduced motion / save-data / video error → static cover only
- Headline + body, four icon bullets (Card / Offer / Cash / Chart), Learn more stub
- Sticky footer primary CTA

## Implementation

- Feature: `src/features/onboarding/`
- Gate: `src/pages/HomePage.tsx`
