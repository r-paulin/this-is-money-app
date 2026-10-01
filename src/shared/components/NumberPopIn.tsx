// Transitions.dev — Number pop-in (React, self-contained)
// https://transitions.dev

const __TRANSITION_STYLES = `
@keyframes t-digit-pop-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.t-digit-group {
  display: inline-flex;
  align-items: baseline;
}
.t-digit {
  display: inline-block;
  will-change: transform, opacity, filter;
}
.t-digit-group.is-animating .t-digit {
  animation: t-digit-pop-in var(--motion-duration-sm) var(--motion-ease-standard) both;
}
`

if (typeof document !== "undefined" && !document.getElementById("transitions-p9")) {
  const style = document.createElement("style")
  style.id = "transitions-p9"
  style.textContent = __TRANSITION_STYLES
  document.head.appendChild(style)
}

function getChangedIndices(from: string, to: string): number[] {
  const fromChars = [...from]
  const toChars = [...to]
  const length = Math.max(fromChars.length, toChars.length)
  const changed: number[] = []

  for (let i = 0; i < length; i += 1) {
    if (fromChars[i] !== toChars[i]) {
      changed.push(i)
    }
  }

  return changed
}

/** Stagger the last two changed digits (transitions.dev decimal pattern). */
function staggerForChangedIndex(
  index: number,
  changedIndices: number[],
): "1" | "2" | undefined {
  const position = changedIndices.indexOf(index)
  if (position === -1) return undefined

  const last = changedIndices.length - 1
  if (position === last - 1) return "1"
  if (position === last) return "2"
  return undefined
}

function shouldAnimateChar(
  playing: boolean,
  index: number,
  from: string | null,
  to: string,
): boolean {
  if (!playing) return false
  if (from === null) return true
  return [...from][index] !== [...to][index]
}

interface NumberPopInProps {
  value: string
  playing?: boolean
  /** When set, only characters that differ from this value animate. */
  previousValue?: string | null
  className?: string
  groupRef?: React.RefObject<HTMLSpanElement | null>
  "aria-label"?: string
}

export function NumberPopIn({
  value,
  playing = false,
  previousValue = null,
  className,
  groupRef,
  "aria-label": ariaLabel,
}: NumberPopInProps) {
  const chars = [...value]
  const changedIndices =
    previousValue !== null ? getChangedIndices(previousValue, value) : chars.map((_, i) => i)

  return (
    <span
      ref={groupRef}
      className={`t-digit-group${playing ? " is-animating" : ""}${className ? ` ${className}` : ""}`}
      aria-label={ariaLabel ?? value}
    >
      {chars.map((ch, i) => {
        const animate = shouldAnimateChar(playing, i, previousValue, value)

        return (
          <span
            key={i}
            className={animate ? "t-digit" : undefined}
            data-stagger={
              animate ? staggerForChangedIndex(i, changedIndices) : undefined
            }
            aria-hidden
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        )
      })}
    </span>
  )
}
