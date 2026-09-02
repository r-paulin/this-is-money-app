/**
 * Verifies vendored Kalep / design-token tarballs match design-system.lock.json.
 * Run after intentionally bumping vendor packages: npm run design-system:drift -- --update
 */
import { createHash } from "node:crypto"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname
const LOCK_PATH = join(ROOT, "design-system.lock.json")
const PKG_PATH = join(ROOT, "package.json")
const VENDOR_DIR = join(ROOT, "vendor-tarballs")

const VENDOR_PACKAGES = [
  "@bolteu/design-tokens",
  "@bolteu/kalep-icons-svg",
  "@bolteu/kalep-react",
  "@bolteu/kalep-react-icons",
  "@bolteu/kalep-tailwind",
] as const

type LockEntry = { version: string; tarball: string; sha256: string }
type LockFile = { packages: Record<string, LockEntry> }

function sha256File(path: string): string {
  const data = readFileSync(path)
  return createHash("sha256").update(data).digest("hex")
}

function parseTarballRef(ref: string): { tarball: string; version: string } {
  const match = ref.match(/bolteu-[\w-]+-(\d+\.\d+\.\d+)\.tgz$/)
  if (!match) throw new Error(`Unexpected vendor ref: ${ref}`)
  const version = match[1]!
  const tarball = ref.replace(/^file:\.\/vendor-tarballs\//, "")
  return { tarball, version }
}

function buildLockFromPackageJson(): LockFile {
  const pkg = JSON.parse(readFileSync(PKG_PATH, "utf8")) as {
    dependencies: Record<string, string>
  }
  const packages: Record<string, LockEntry> = {}

  for (const name of VENDOR_PACKAGES) {
    const ref = pkg.dependencies[name]
    if (!ref?.startsWith("file:")) {
      throw new Error(`Missing vendor tarball for ${name}`)
    }
    const { tarball, version } = parseTarballRef(ref)
    const path = join(VENDOR_DIR, tarball)
    if (!existsSync(path)) {
      throw new Error(`Tarball not found: ${path}`)
    }
    packages[name] = { version, tarball, sha256: sha256File(path) }
  }

  return { packages }
}

const update = process.argv.includes("--update")

if (update) {
  const lock = buildLockFromPackageJson()
  writeFileSync(LOCK_PATH, `${JSON.stringify(lock, null, 2)}\n`)
  console.log(`design-system:drift — updated ${LOCK_PATH}`)
  process.exit(0)
}

if (!existsSync(LOCK_PATH)) {
  console.error("design-system.lock.json missing. Run: npm run design-system:drift -- --update")
  process.exit(1)
}

const expected = JSON.parse(readFileSync(LOCK_PATH, "utf8")) as LockFile
const actual = buildLockFromPackageJson()

const errors: string[] = []

for (const name of VENDOR_PACKAGES) {
  const exp = expected.packages[name]
  const act = actual.packages[name]
  if (!exp) {
    errors.push(`${name}: missing in lock file`)
    continue
  }
  if (exp.version !== act.version) {
    errors.push(`${name}: version ${act.version} !== locked ${exp.version}`)
  }
  if (exp.tarball !== act.tarball) {
    errors.push(`${name}: tarball ${act.tarball} !== locked ${exp.tarball}`)
  }
  if (exp.sha256 !== act.sha256) {
    errors.push(`${name}: tarball hash changed (bump lock with --update if intentional)`)
  }
}

if (errors.length > 0) {
  console.error("design-system:drift — FAILED\n")
  for (const e of errors) console.error(`  • ${e}`)
  process.exit(1)
}

console.log("design-system:drift — OK (vendor tarballs match lock)")
process.exit(0)
