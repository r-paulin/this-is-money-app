// Transitions.dev — Number pop-in (React, self-contained)
// https://transitions.dev

const __TRANSITION_STYLES = `
:root {
  --digit-dur: 500ms;
  --digit-distance: 8px;
  --digit-stagger: 70ms;
  --digit-blur: 2px;
  --digit-ease: cubic-bezier(0.34, 1.45, 0.64, 1);
  --digit-dir-x: 0;
  --digit-dir-y: 1;
}

@keyframes t-digit-pop-in {
  0%   {
    transform: translate(
      calc(var(--digit-distance) * var(--digit-dir-x)),
      calc(var(--digit-distance) * var(--digit-dir-y))
    );
    opacity: 0;
    filter: blur(var(--digit-blur));
  }
  100% { transform: translate(0, 0); opacity: 1; filter: blur(0); }
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
  animation: t-digit-pop-in var(--digit-dur) var(--digit-ease) both;
}
.t-digit-group.is-animating .t-digit[data-stagger="1"] {
  animation-delay: var(--digit-stagger);
}
.t-digit-group.is-animating .t-digit[data-stagger="2"] {
  animation-delay: calc(var(--digit-stagger) * 2);
}

@media (prefers-reduced-motion: reduce) {
  .t-digit-group .t-digit { animation: none !important; }
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
