import { List, ListItemLayout, Typography } from "@bolteu/kalep-react"
import ChevronRight from "@bolteu/kalep-react-icons/dist/ChevronRight"
import { GroupedSection } from "@/shared/components/GroupedSection"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { SkeletonBar } from "@/shared/components/skeleton/SkeletonPlaceholders"
import {
  getPhysicalCardStatusLine,
  isPhysicalCardStatusNegative,
  shouldShowPhysicalOffer,
} from "../lib/homeScreenLogic"
import type { ActivityFetchState, CardType, HomeCardRow } from "../home.types"
import { CardThumbnail } from "./CardThumbnail"

export interface CardsSectionProps {
  cards: HomeCardRow[]
  cardsState: ActivityFetchState
  asOfMs: number
  onCardClick: (cardType: CardType) => void
  onGetPhysical: () => void
}

function getRowTitle(card: HomeCardRow): string {
  if (card.kind === "offer") return "Get a physical card"
  if (card.kind === "virtual") return "Virtual card"
  return "Physical card"
}

function getRowSecondary(card: HomeCardRow): string | undefined {
  if (card.kind === "offer") {
    return "Pay in person and withdraw cash with a physical card"
  }
  if (card.lastFour && card.expiry) {
    return `\u00B7\u00B7 ${card.lastFour}, ${card.expiry}`
  }
  return undefined
}

function CardSkeletonRow({ separator }: { separator: boolean }) {
  return (
    <ListItemLayout
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      primary={<SkeletonBar width="55%" height={20} />}
      secondary={<SkeletonBar width="40%" height={16} />}
      renderStartSlot={() => <SkeletonBar width={48} height={30} className="rounded-sm" />}
      renderEndSlot={() => <SkeletonBar width={20} height={20} />}
    />
  )
}

export function CardsSection({
  cards,
  cardsState,
  asOfMs,
  onCardClick,
  onGetPhysical,
}: CardsSectionProps) {
  const now = asOfMs
  const rows: HomeCardRow[] = [...cards]
  if (shouldShowPhysicalOffer(cards)) {
    rows.push({ kind: "offer", color: "green" })
  }

  const loading = cardsState === "loading"

  return (
    <GroupedSection paddingBottom={8} aria-labelledby="cards-heading">
      <SectionHeader id="cards-heading" grouped>
        Cards
      </SectionHeader>

      {loading ? (
        <div aria-busy="true" aria-label="Loading cards">
          <CardSkeletonRow separator />
          <CardSkeletonRow separator={false} />
        </div>
      ) : (
        <List.Root className="[&_li>div:hover]:!bg-transparent [&_li>div:focus:hover]:!bg-transparent">
          {rows.map((card, index) => {
            const statusLine =
              card.kind === "physical" ? getPhysicalCardStatusLine(card, now) : undefined
            const statusNegative = isPhysicalCardStatusNegative(statusLine)
            const isOffer = card.kind === "offer"
            const secondary = getRowSecondary(card)

            const handleClick = () => {
              if (isOffer) {
                onGetPhysical()
                return
              }
              onCardClick(card.kind === "virtual" ? "virtual" : "physical")
            }

            return (
              <List.Item
                key={`${card.kind}-${card.lastFour ?? "offer"}`}
                primary={getRowTitle(card)}
                secondary={
                  <span className="flex flex-col gap-0.5">
                    {secondary ? (
                      <span className={isOffer ? "line-clamp-2" : undefined}>
                        <Typography variant="body-s-regular" color="secondary" as="span">
                          {secondary}
                        </Typography>
                      </span>
                    ) : null}
                    {statusLine ? (
                      <Typography
                        variant="body-s-accent"
                        color={statusNegative ? "danger-primary" : "primary"}
                        as="span"
                      >
                        {statusLine}
                      </Typography>
                    ) : null}
                  </span>
                }
                separator={index < rows.length - 1}
                paddingStart={6}
                paddingEnd={6}
                onClick={handleClick}
                primaryTypographyProps={{ variant: "body-m-compact-regular" }}
                renderStartSlot={() => (
                  <CardThumbnail
                    kind={card.kind}
                    color={card.color}
                    locked={card.locked}
                    blocked={card.blocked}
                    lost={card.lost}
                    stolen={card.stolen}
                  />
                )}
                renderEndSlot={() => (
                  <ChevronRight size="md" className="text-secondary" aria-hidden />
                )}
                aria-label={getRowTitle(card)}
              />
            )
          })}
        </List.Root>
      )}
    </GroupedSection>
  )
}
