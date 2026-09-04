import {
  SkeletonBar,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

/** Figma SEND MONEY / Loading 7797:57688 — add recipient form skeleton */
export function AddRecipientLoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-6 py-3">
        <SkeletonBar width="40%" height={24} className="rounded" />
        <div className="pt-1">
          <SkeletonBar width="65%" height={32} className="rounded" />
        </div>
      </div>

      <div className="flex min-h-12 items-center gap-4 px-6">
        <SkeletonBar width={88} height={20} className="rounded" />
        <SkeletonBar width={72} height={20} className="rounded" />
      </div>

      <div className="flex flex-col gap-4 px-6 pt-4">
        {Array.from({ length: 3 }, (_, index) => (
          <SkeletonBar key={index} width="100%" height={56} className="rounded-compact" />
        ))}
      </div>
    </div>
  )
}
