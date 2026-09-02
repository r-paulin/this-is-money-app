import kalepConfig from "@bolteu/kalep-tailwind/tailwind.config"
import kalepReactTailwind from "@bolteu/kalep-react/tailwind.config.js"
import type { Config } from "tailwindcss"

const kalep = kalepConfig as Config

export default {
  ...kalep,
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@bolteu/kalep-react/build/**/*.js",
  ],
  safelist: kalepReactTailwind.safelist,
  theme: {
    ...kalep.theme,
    extend: {
      ...(kalep.theme?.extend ?? {}),
      borderRadius: {
        ...(kalep.theme?.extend?.borderRadius ?? {}),
        compact: "var(--radius-compact)",
        card: "var(--radius-card)",
        "device-screen": "var(--device-screen-radius)",
      },
      spacing: {
        ...(kalep.theme?.extend?.spacing ?? {}),
        "list-start-gap": "var(--list-item-start-gap)",
        "list-end-gap": "var(--list-item-end-gap)",
        "list-vr": "var(--list-item-vr-padding)",
        "mcc-pad": "var(--mcc-icon-padding)",
        "mcc-badge": "var(--mcc-badge-size)",
        "mcc-badge-offset": "var(--mcc-badge-offset)",
      },
      colors: {
        ...(kalep.theme?.extend?.colors ?? {}),
        mcc: {
          groceries: "var(--mcc-groceries)",
          food: "var(--mcc-food)",
          travel: "var(--mcc-travel)",
          transport: "var(--mcc-transport)",
          medical: "var(--mcc-medical)",
          shopping: "var(--mcc-shopping)",
          money: "var(--mcc-money)",
          utilities: "var(--mcc-utilities)",
          government: "var(--mcc-government)",
          fuel: "var(--mcc-fuel)",
          decline: "var(--mcc-decline)",
        },
      },
    },
  },
} satisfies Config
