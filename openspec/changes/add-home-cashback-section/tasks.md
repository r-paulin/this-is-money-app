# Tasks

## 1. Asset

- [x] 1.1 Export Figma “Car with Coins” (`9106:57072` / Cashback end slot) and commit it as `src/features/home/assets/illustration-car-with-coins.png` (or `.svg` if the export is vector). Verify the file opens and matches the Figma screenshot crop (car + coin stacks).

## 2. Cashback section UI

- [x] 2.1 Add `src/features/home/components/CashbackSection.tsx` using `GroupedSection` (`paddingTop={8}`, `paddingBottom={12}`), `SectionHeader` titled “Cashback” (`grouped`, `paddingBottom={8}`, `id="cashback-heading"`), and a single `ListItemLayout` (`separator={false}`, `paddingStart={6}`, `paddingEnd={6}`) with stacked Typography: Body L Accent title, Body S Regular offer, Body M Compact Accent CTA in action/link primary color; end slot renders the illustration with fixed leaf dimensions and `alt=""`. Verify the component renders the three Figma strings and decorative image without raw hex classes.
- [x] 2.2 Wire whole-row `onClick` to a stub (`onViewCashback` prop or `console.info("[stub] View cashback")`) in `CashbackSection.tsx`. Verify activating the row does not call `useNavigationStack().push`.

## 3. Home composition

- [x] 3.1 Import and render `CashbackSection` in `src/features/home/components/HomeScreen.tsx` after `CardsSection` and before `LegalFooter`. Verify home scroll shows Cashback between Cards and the legal footer.

## 4. Verification

- [x] 4.1 Run `npx tsc -b`, `npm test`, and `npm run token-audit`; fix any issues introduced by the new section. Verify all three succeed.
- [x] 4.2 Smoke-check home against Figma `9527:203981` (header, copy, green CTA, illustration, grouped separators). Verify visual match for typography weight/color and illustration presence.
