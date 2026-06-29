import { DeviceFrame } from "@/shared/components"
import { HomePage } from "@/pages"

export const App = () => (
  <div className="min-h-dvh flex justify-center items-stretch bg-special-brand-alt">
    <DeviceFrame>
      <HomePage />
    </DeviceFrame>
  </div>
)
