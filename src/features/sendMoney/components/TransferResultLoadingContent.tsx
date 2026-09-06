import {
  SkeletonBar,
  SkeletonCircle,
} from "@/shared/components/skeleton/SkeletonPlaceholders"

/** Figma SEND MONEY / Confirmation - Loading (7931:57169). */
export function TransferResultLoadingContent() {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden">
      <div className="flex flex-col items-center px-6">
        <SkeletonCircle size={148} />

        <div className="w-full max-w-[305px] pt-6">
          <SkeletonBar width="100%" height={36} className="rounded" />
          <div className="pt-3">
            <SkeletonBar width="100%" height={24} className="rounded" />
          </div>
        </div>
      </div>

      <div className="w-full shrink-0 pt-6">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="px-6 py-3">
            <SkeletonBar width="40%" height={14} className="rounded" />
            <div className="pt-1">
              <SkeletonBar width="100%" height={20} className="rounded" />
            </div>
            {index < 2 ? (
              <div className="pt-3">
                <div className="h-px bg-neutral-secondary" aria-hidden />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
