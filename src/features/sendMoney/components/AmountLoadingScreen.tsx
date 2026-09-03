import { SkeletonBar } from "@/shared/components/skeleton/SkeletonPlaceholders"

/** Figma amount loading — title, subtitle, field, helper skeleton. */
export function AmountLoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-6 py-3">
        <SkeletonBar width="70%" height={40} className="rounded" />
        <div className="pt-1">
          <SkeletonBar width="100%" height={24} className="rounded" />
        </div>
      </div>

      <div className="px-6 pt-3">
        <SkeletonBar width="100%" height={61} className="rounded-compact" />
      </div>

      <div className="px-6 pt-2">
        <SkeletonBar width="50%" height={20} className="rounded" />
      </div>
    </div>
  )
}
