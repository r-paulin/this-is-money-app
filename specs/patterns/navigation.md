# Navigation patterns

Full rules: `.cursor/rules/ios-navigation.mdc`

## Quick reference

| User action | Pattern | API |
|-------------|---------|-----|
| Tap list row / drill-down | Push | `useNavigationStack().push({ key, render })` |
| Back chevron | Pop | `pop()` |
| Send money, sheets, alerts | Modal | Kalep modal — **not** nav stack |

## Screen keys

Include params in `key`: e.g. `card-controls:virtual`, `send-money:recipient-select`

## Transition

Push uses `--motion-nav-enter` (500ms, iOS ease). Pop uses `--motion-nav-exit` (400ms, iOS ease). The screen behind parallax is 30%. Reduced motion cross-fades at `--motion-duration-sm` with `--motion-ease-standard` and does not slide.

## Do not

- Swap screens with `useState` + conditional render for hierarchical flows
- Push modals onto the stack
