/** CSS animation names from navigation.css — only these may end a stack transition. */
export const NAV_LAYER_ANIMATIONS = new Set([
  "nav-push-top",
  "nav-pop-top",
  "nav-fade-in",
])

export function isNavLayerAnimationEvent(
  event: React.AnimationEvent<HTMLElement>,
): boolean {
  return (
    event.target === event.currentTarget &&
    NAV_LAYER_ANIMATIONS.has(event.animationName)
  )
}
