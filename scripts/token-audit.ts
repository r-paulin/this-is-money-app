/**
 * Scans source for design-token violations (raw hex in class names, arbitrary Tailwind).
 * Run: npm run token-audit
 */
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname
const SRC = join(ROOT, "src")

const ALLOWLIST = new Set([
  "src/shared/styles/tokens.css",
  "src/features/home/components/wallet-stack.css",
  "src/shared/components/PaymentCard/paymentCard.config.ts",
  "src/shared/components/PullToRefresh/pull-to-refresh.css",
])

const EXTENSIONS = new Set([".ts", ".tsx", ".css"])

const PATTERNS: { name: string; regex: RegExp }[] = [
  {
    name: "arbitrary color class",
    regex: /(?:bg|text|border|from|to|via|ring|fill|stroke)-\[#[0-9a-fA-F]{3,8}\]/g,
  },
  {
    name: "arbitrary rounded",
    regex: /rounded-\[[^\]]+\]/g,
  },
  {
    name: "inline hex in className",
    regex: /className=["'`][^"'`]*#[0-9a-fA-F]{3,8}/g,
  },
]

type Violation = { file: string; line: number; rule: string; match: string }

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === "assets") continue
      walk(full, files)
    } else if (EXTENSIONS.has(entry.slice(entry.lastIndexOf(".")))) {
      files.push(full)
    }
  }
  return files
}

function auditFile(path: string): Violation[] {
  const rel = relative(ROOT, path).replaceAll("\\", "/")
  if (ALLOWLIST.has(rel) || rel.endsWith(".test.ts") || rel.endsWith(".svg")) {
    return []
  }

  const content = readFileSync(path, "utf8")
  const lines = content.split("\n")
  const violations: Violation[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    if (line.includes('href="#')) continue

    for (const { name, regex } of PATTERNS) {
      regex.lastIndex = 0
      let match: RegExpExecArray | null
      while ((match = regex.exec(line)) !== null) {
        violations.push({
          file: rel,
          line: i + 1,
          rule: name,
          match: match[0],
        })
      }
    }
  }

  return violations
}

const allViolations = walk(SRC).flatMap(auditFile)

if (allViolations.length === 0) {
  console.log("token-audit: OK (no violations)")
  process.exit(0)
}

console.error(`token-audit: ${allViolations.length} violation(s)\n`)
for (const v of allViolations) {
  console.error(`  ${v.file}:${v.line} [${v.rule}] ${v.match}`)
}
console.error("\nUse tokens from specs/tokens/token-reference.md and Kalep semantic classes.")
process.exit(1)
