import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { App } from "@/app/App"

const params = new URLSearchParams(window.location.search)
const theme = params.get("theme")
if (theme === "dark") {
  document.documentElement.classList.add("dark")
  document.documentElement.setAttribute("data-mode", "dark")
} else {
  document.documentElement.classList.remove("dark")
  document.documentElement.setAttribute("data-mode", "light")
}

const rootEl = document.getElementById("root")
if (!rootEl) {
  console.error('Bolt Money: missing mount node <div id="root"></div>.')
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
