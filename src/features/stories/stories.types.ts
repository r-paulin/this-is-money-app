export type StoryMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster?: string }
  | { kind: "none" }

/** Content-sheet background tone. Header chrome is always dark. */
export type StoryTone = "light" | "actionSecondary"

export interface StoryPage {
  id: string
  tone: StoryTone
  media: StoryMedia
  title: string
  body: string
  ctaLabel?: string
}

export interface StorySequence {
  id: string
  pages: StoryPage[]
}

export type StoryTapZone = "leading" | "trailing"

export type StoryDwellOutcome = "advance" | "stay" | "close"
