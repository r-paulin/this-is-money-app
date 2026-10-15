# Navigation patterns

Full rules: `.cursor/rules/ios-navigation.mdc`

## Quick reference

| User action | Pattern | API |
|-------------|---------|-----|
| Tap list row / drill-down | Push | `useNavigationStack().push({ key, render })` |
| Immersive (e.g. Stories) | Push immersive | `push({ key, immersive: true, render })` — shared navbar, dark chrome |
| Back chevron | Pop | `pop()` |
| Send money, sheets, alerts | Modal | Kalep modal — **not** nav stack |

## Screen keys

Include params in `key`: e.g. `card-controls:virtual`, `send-money:recipient-select`

## Transition

Push/pop use `--motion-nav-enter-*` / `--motion-nav-exit-*`. Under-page parallax is `--motion-nav-parallax` (iOS 30%, Android 32px). `AppNavbar` is in-flow inside each nav layer so status/back travel with the page. Reduced motion fades the covering layer with `--motion-fade-in*` / `--motion-fade-out*` and does not slide.

## Do not

- Swap screens with `useState` + conditional render for hierarchical flows
- Push modals onto the stack
