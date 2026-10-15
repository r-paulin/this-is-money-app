# Spec Delta

## Purpose

Defines a full-screen Stories viewer for short product education sequences: multi-page media with Instagram-style progress, paging, and auto-advance, starting with the Secure your account mock flow.

## ADDED Requirements

### Requirement: Stories viewer presents a page sequence

The system MUST present a Stories sequence as a full-screen immersive viewer opened via the shared navigation stack (`push` with `immersive: true`). A sequence MUST consist of one or more ordered pages. Each page MUST support: a content-sheet background (semantic or app token color), media that is either an image or a video (or neither when illustration-only), and optional title, body, and primary action label. The viewer MUST keep a fixed dark header chrome (status, back, progress) on a full-screen dark base; only the rounded-top content sheet MAY change background per page. Open and close MUST use the same push/pop page motion as other hierarchical screens. Closing MUST `pop()` back to the previous screen.

#### Scenario: Open Secure your account

- **WHEN** the user opens the Secure your account Stories sequence from the demo entry
- **THEN** the viewer pushes onto the navigation stack with shared page-enter motion
- **AND** the viewer covers the device screen with a dark header chrome, the first page’s content sheet (background, media, copy), and progress segments
- **AND** the underlying home (or previous) UI is not interactive until the viewer pops

#### Scenario: Close

- **WHEN** the user activates the close control
- **THEN** the viewer dismisses
- **AND** the user sees the screen that was underneath

### Requirement: Progress segments track page position and dwell

The viewer MUST show one horizontal progress segment per page in the sequence. Completed pages MUST show a filled segment. The active page’s segment MUST fill over the page dwell duration using real-time linear motion. Upcoming pages MUST show empty segments. Changing page MUST update segment fill state immediately (previous pages filled, new active filling from empty, later empty).

#### Scenario: Auto-advance fills then advances

- **WHEN** a page is active and the user does not pause or navigate away
- **THEN** the active segment fills completely over 5 seconds
- **AND** when the fill completes the viewer advances to the next page (or stays on the last page without auto-closing)

#### Scenario: Manual advance mid-dwell

- **WHEN** the user advances to the next page before the 5 second dwell ends
- **THEN** the left-behind page’s segment appears fully filled
- **AND** the new page’s segment starts filling from empty over 5 seconds

### Requirement: Horizontal paging and tap zones

The viewer MUST let the user move between pages by horizontal swipe (forward and back) and by tap zones: a leading-side tap goes to the previous page (or no-ops on the first page), a trailing-side tap goes to the next page (or no-ops on the last page). Closing or leaving the sequence MUST only happen via the back control or the page CTA — not via content-area tap on the last page. Paging transitions MUST combine horizontal slide with a cross-fade (outgoing opacity decreases, incoming increases) using project motion tokens. Under reduced motion, page changes MUST cross-fade at the small duration with the standard ease and MUST NOT slide horizontally.

#### Scenario: Swipe forward

- **WHEN** the user swipes horizontally toward the leading edge with enough distance or velocity to commit
- **THEN** the next page becomes active with a tokenized paging transition
- **AND** the progress segments reflect the new index

#### Scenario: Swipe back

- **WHEN** the user swipes horizontally toward the trailing edge with enough distance or velocity to commit
- **THEN** the previous page becomes active
- **AND** if already on the first page the viewer stays on the first page

#### Scenario: Reduced motion paging

- **WHEN** reduced motion is preferred and the user changes page
- **THEN** the content cross-fades at the small motion duration with the standard ease
- **AND** there is no horizontal slide or parallax between pages

### Requirement: Hold pauses auto-advance

While the user presses and holds on the story content (outside dedicated interactive controls), auto-advance and progress fill MUST pause. Releasing MUST resume fill from the paused progress for the remaining dwell time. Interactive controls (close, CTA) MUST remain usable and MUST NOT be treated as a hold-to-pause target when activated.

#### Scenario: Pause and resume

- **WHEN** the user holds on the story content mid-dwell
- **THEN** the active progress segment stops filling
- **WHEN** the user releases
- **THEN** the segment continues filling for the remaining time until advance

### Requirement: Image and video media

A page with image media MUST show that image. A page with video media MUST play the video muted and inline while the page is active, and MUST pause when the page is inactive, paused by hold, or the viewer is closed. If a video ends before the 5 second dwell completes, the viewer MUST still wait for the remaining dwell before auto-advancing unless the user navigates earlier. If the video is longer than 5 seconds, auto-advance at 5 seconds MUST still occur (video pauses on leave). Background color MUST paint behind media so letterboxing or transparent areas do not flash the wrong layer. The primary CTA MUST stay fixed outside the sliding content track; only title, body, and media slide between pages.

#### Scenario: Video page

- **WHEN** an active page has video media
- **THEN** the video plays muted while active and not held
- **AND** leaving the page or closing the viewer pauses the video

#### Scenario: Background change between pages

- **WHEN** consecutive pages declare different backgrounds
- **THEN** the visible background updates with the active page
- **AND** the update uses only design-system / app token colors (no raw hex in component markup)

### Requirement: Secure your account mock sequence

The product MUST include a mock four-page Secure your account sequence that matches the Figma structure: progress indicators for four pages, header with back control, title and body copy per page, central illustration or media, and a fixed bottom primary button. Page copy and media MUST follow the Figma “Secure your account” frames. Primary button actions MAY be stubs in v1.

#### Scenario: Four pages

- **WHEN** the Secure your account sequence is opened
- **THEN** exactly four progress segments are shown
- **AND** the user can reach each of the four pages by swipe, tap, or auto-advance

#### Scenario: Last page auto-advance closes

- **WHEN** the user is on the fourth page and the 5 second dwell completes without interaction
- **THEN** the viewer closes
