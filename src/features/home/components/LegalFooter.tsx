import { Link, Typography } from "@bolteu/kalep-react"

export function LegalFooter() {
  return (
    <footer className="px-6 pb-6">
      <Typography
        variant="body-xs-regular"
        color="secondary"
        as="p"
        align="start"
        inlineStyle={{ textAlign: "left" }}
      >
        Available via Bolt. Provided by Airwallex. Use requires acceptance of
        Airwallex&apos;s{" "}
        <Link
          href="#terms"
          overrideClassName="underline"
          onClick={(event) => {
            event.preventDefault()
            console.info("[stub] Open Terms and Conditions")
          }}
        >
          Terms and Conditions
        </Link>
      </Typography>
    </footer>
  )
}
