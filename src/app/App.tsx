import { DeviceFrame } from "@/shared/components"
import { HomePage } from "@/pages"
import { SnackbarProvider } from "@bolteu/kalep-react"

export const App = () => (
  <div className="min-h-dvh flex justify-center items-stretch bg-special-brand-alt">
    <DeviceFrame>
      <SnackbarProvider placement="bottom-center">
        <HomePage />
      </SnackbarProvider>
    </DeviceFrame>
  </div>
)
