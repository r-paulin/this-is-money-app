import path from "node:path"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"

/** Absolute origin for og:image (CF Pages sets CF_PAGES_URL at build). */
function siteOrigin(): string {
  const raw =
    process.env.CF_PAGES_URL ||
    process.env.VITE_SITE_URL ||
    "https://this-is-money-app.pages.dev"
  return raw.replace(/\/$/, "")
}

function htmlSiteOrigin(): Plugin {
  return {
    name: "html-site-origin",
    transformIndexHtml(html) {
      return html.replaceAll("%SITE_ORIGIN%", siteOrigin())
    },
  }
}

export default defineConfig({
  plugins: [react(), htmlSiteOrigin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
