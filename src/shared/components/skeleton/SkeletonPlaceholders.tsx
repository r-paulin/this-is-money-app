export function SkeletonBar({
  width,
  height = 14,
  className = "",
}: {
  width: number | string
  height?: number
  className?: string
}) {
  return (
    <div
      className={["rounded bg-neutral-secondary", className].filter(Boolean).join(" ")}
      style={{ width, height }}
      aria-hidden
    />
  )
}

export function SkeletonCircle({ size = 24 }: { size?: number }) {
  return (
    <div
      className="shrink-0 rounded-full bg-neutral-secondary"
      style={{ width: size, height: size }}
      aria-hidden
    />
  )
}
