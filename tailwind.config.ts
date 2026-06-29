import kalepConfig from "@bolteu/kalep-tailwind/tailwind.config"
// Kalep React Typography builds class names at runtime — keep them in the bundle.
import kalepReactTailwind from "@bolteu/kalep-react/tailwind.config.js"

export default {
  ...kalepConfig,
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@bolteu/kalep-react/build/**/*.js",
  ],
  safelist: kalepReactTailwind.safelist,
}
