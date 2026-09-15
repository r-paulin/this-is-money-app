import { Button, GhostButton, Typography } from "@bolteu/kalep-react"
import Clear from "@bolteu/kalep-react-icons/dist/Clear"
import {
  HOME_BANNER_CONTENT,
  type HomeBannerActionVariant,
} from "../data/homeBannerContent"
import type { HomeBannerId } from "../home.types"
import bannerMedia from "../assets/banner-google-pay-media.png"
import "./home-banner.css"

export interface HomeBannerProps {
  id: HomeBannerId
  onDismiss: () => void
  className?: string
}

function BannerAction({
  bannerId,
  label,
  variant,
}: {
  bannerId: HomeBannerId
  label: string
  variant: HomeBannerActionVariant
}) {
  const handleClick = () => {
    console.info("[stub] Banner action:", bannerId)
  }

  if (variant === "primary") {
    return (
      <Button variant="primary" size="sm" onClick={handleClick}>
        {label}
      </Button>
    )
  }

  return (
    <GhostButton onClick={handleClick}>
      <Typography variant="body-m-compact-accent" color="action-primary" as="span">
        {label}
      </Typography>
    </GhostButton>
  )
}

export function HomeBanner({ id, onDismiss, className = "" }: HomeBannerProps) {
  const content = HOME_BANNER_CONTENT[id]

  return (
    <article
      className={[
        "home-banner relative flex w-full flex-col overflow-hidden rounded-grouped bg-layer-floor-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="home-banner__title-row">
        <p className="m-0 line-clamp-3">
          <Typography variant="heading-xs-accent" color="primary" as="span" align="start">
            {content.title}
          </Typography>
        </p>
      </div>

      <div className="home-banner__content-row">
        <div className="home-banner__text-col">
          <div className="home-banner__body-wrap">
            <p className="m-0 line-clamp-4">
              <Typography variant="body-s-regular" color="secondary" as="span" align="start">
                {content.body}
              </Typography>
            </p>
          </div>
          <BannerAction
            bannerId={id}
            label={content.actionLabel}
            variant={content.actionVariant}
          />
        </div>

        <div className="home-banner__media-wrap" aria-hidden>
          <img
            src={bannerMedia}
            alt=""
            className="home-banner__media"
            width={100}
            height={92}
          />
        </div>
      </div>

      <div className="home-banner__close-hit">
        <GhostButton onClick={onDismiss} aria-label="Dismiss">
          <Clear className="text-secondary" aria-hidden />
        </GhostButton>
      </div>
    </article>
  )
}
