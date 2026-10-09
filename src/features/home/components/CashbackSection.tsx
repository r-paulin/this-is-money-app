import { ListItemLayout, Typography } from "@bolteu/kalep-react"
import { GroupedSection } from "@/shared/components/GroupedSection"
import { SectionHeader } from "@/shared/components/SectionHeader"
import carWithCoins from "../assets/illustration-car-with-coins.png"

/** Figma end-slot leaf — 800×592 source, displayed at design scale. */
const ILLUSTRATION_WIDTH = 120
const ILLUSTRATION_HEIGHT = 89

export function CashbackSection() {
  return (
    <GroupedSection
      paddingTop={8}
      paddingBottom={12}
      aria-labelledby="cashback-heading"
    >
      <SectionHeader id="cashback-heading" grouped paddingBottom={8}>
        Cashback
      </SectionHeader>

      <ListItemLayout
        separator={false}
        paddingStart={6}
        paddingEnd={6}
        onClick={() => console.info("[stub] View cashback")}
        aria-label="Earn cashback when you spend. View cashback"
        primary={
          <div className="flex flex-col gap-3">
            <Typography variant="body-l-accent" color="primary" as="span">
              Earn cashback when you spend
            </Typography>
            <Typography variant="body-s-regular" color="secondary" as="span">
              1% back on settled fuel and EV charging payments over €1
            </Typography>
            {/* Extra 4px → ~16px offer→CTA (Figma 9527:203981) */}
            <div className="mt-1">
              <Typography variant="body-m-compact-accent" color="action-primary" as="span">
                View cashback
              </Typography>
            </div>
          </div>
        }
        renderEndSlot={() => (
          <img
            src={carWithCoins}
            alt=""
            width={ILLUSTRATION_WIDTH}
            height={ILLUSTRATION_HEIGHT}
            className="shrink-0 object-contain"
            aria-hidden
          />
        )}
      />
    </GroupedSection>
  )
}
