import { GhostButton } from "@bolteu/kalep-react"
import Download from "@bolteu/kalep-react-icons/dist/Download"
import { useNavigationStack } from "@/shared/navigation"
import { GetStatementGate } from "./GetStatementGate"

export function GetStatementToolbarButton() {
  const { push } = useNavigationStack()

  return (
    <GhostButton
      aria-label="Get statement"
      onClick={() => {
        push({
          key: "get-statement",
          render: () => <GetStatementGate />,
        })
      }}
    >
      <Download size="lg" aria-hidden />
    </GhostButton>
  )
}
