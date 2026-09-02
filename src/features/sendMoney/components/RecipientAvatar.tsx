import Verified from "@bolteu/kalep-react-icons/dist/Verified"
import { Typography } from "@bolteu/kalep-react"
import { getRecipientInitials } from "../lib/getRecipientInitials"

export interface RecipientAvatarProps {
  name: string
  trusted?: boolean
}

export function RecipientAvatar({ name, trusted = false }: RecipientAvatarProps) {
  const label = getRecipientInitials(name)

  return (
    <div
      className="relative flex size-10 min-h-10 min-w-10 shrink-0 items-center justify-center rounded-full bg-neutral-secondary p-1"
      aria-hidden
    >
      <Typography
        variant="body-s-compact-regular"
        color="primary"
        as="span"
        align="center"
      >
        {label}
      </Typography>
      {trusted ? (
        <Verified
          size="sm"
          className="absolute -bottom-1.5 -right-1.5 aspect-square size-5 shrink-0"
          aria-hidden
        />
      ) : null}
    </div>
  )
}
