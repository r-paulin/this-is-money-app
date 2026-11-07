# Card controls (lock and unlock)

**Figma:** Card / Lock and Unlock `11633:51454`

Hub screen: `CardControlsScreen` — card face + control list. Nested flows (details, PIN, spending limits, replace) are separate push screens.

## List order

1. Lock toggle
2. Card details
3. PIN reminder
4. Add to Apple Wallet (stub)
5. Spending limits → [`spending-limits.md`](spending-limits.md)
6. Replace card

## Lock phases

| Phase | Primary | Secondary | Card overlay | Caption |
|-------|---------|-----------|--------------|---------|
| `unlocked` | Unlocked | Lock card to stop payments | off | Type + `····` last four |
| `locking` | Unlocked | Locking card... | off (wait for success) | Type + last four |
| `locked` | Card locked | Unlock your card to use it again | on (200ms crossfade) | `Locked — payments will be declined.` |
| `unlocking` | Card locked | Unlocking card... | on until success | Locked caption |

Toggle flips optimistically, then ignores input until the phase settles. Mock success ~1.2s; treat still-in-flight after 10s as failure (revert toggle, restore labels, inline error under the lock row).

## Disable matrix

| Row | locking | locked | unlocking |
|-----|---------|--------|-----------|
| Card details | disabled | disabled + snackbar on tap | disabled |
| PIN reminder | disabled | disabled + snackbar on tap | disabled |
| Add to Apple Wallet | disabled | disabled + snackbar on tap | disabled |
| Spending limits | enabled | enabled | disabled |
| Replace card | enabled | enabled | disabled |

Snackbar (locked tap): `This feature isn't available while your card is locked.` Restart the timer on repeat taps; do not stack.

When daily limit is low or a period limit is reached, the hub may show a warning banner and a Spending limits secondary (see spending-limits.md). Tap opens Spending limits.

## A11y

Announce phase changes via `aria-live="polite"` (`Locking card` → `Card locked`, etc.).

## Out of scope here

Apple Wallet destination; Airwallex `BLOCKED` cards that cannot unlock.
