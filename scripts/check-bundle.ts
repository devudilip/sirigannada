/**
 * Bundle budget check for the offline shell.
 *
 * Sums the bytes of everything the service worker precaches as the app shell — the
 * PRECACHE_SHELL routes' HTML, the /_next/static JS/CSS/font assets those pages reference,
 * and manifest.webmanifest + favicon.svg + the manifest's icons — from a static `next build`
 * export in out/. Dictionary shards and other /data/** files are fetched on demand and are
 * excluded.
 *
 * Usage: tsx scripts/check-bundle.ts [--budget <bytes>]
 *   Requires out/ to already exist: TMPDIR=/tmp npx next build
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildBundleReport, parsePrecacheShell } from "./lib/bundle";

const DEFAULT_BUDGET_BYTES = 2 * 1024 * 1024; // 2 MB
// Set to true once the owner has decided how to handle an over-budget shell; until then an
// over-budget result is reported clearly but does not fail CI.
const WARN_ONLY = true;

function parseArgs(argv: string[]): { budget: number } {
  let budget = DEFAULT_BUDGET_BYTES;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--budget" && argv[i + 1]) {
      budget = Number(argv[i + 1]);
      i++;
    }
  }
  return { budget };
}

function formatKB(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function main(): void {
  const { budget } = parseArgs(process.argv.slice(2));
  const repoRoot = join(import.meta.dirname, "..");
  const outDir = join(repoRoot, "out");
  const swPath = join(repoRoot, "public", "sw.js");

  if (!existsSync(outDir)) {
    console.error("out/ not found. Build the static export first: TMPDIR=/tmp npx next build");
    process.exit(1);
  }

  const swSource = readFileSync(swPath, "utf8");
  const routes = parsePrecacheShell(swSource);

  const readFile = (outPath: string): string | undefined => {
    const full = join(outDir, outPath);
    if (!existsSync(full)) return undefined;
    return readFileSync(full, "utf8");
  };
  const fileSize = (outPath: string): number | undefined => {
    const full = join(outDir, outPath);
    if (!existsSync(full)) return undefined;
    return statSync(full).size;
  };

  const report = buildBundleReport(routes, readFile, fileSize);

  console.log("Offline shell bundle budget\n");
  console.log("Route / group".padEnd(45) + "Size");
  console.log("-".repeat(60));
  for (const group of report.groups) {
    console.log(group.label.padEnd(45) + formatKB(group.bytes));
  }
  console.log("-".repeat(60));
  console.log("TOTAL".padEnd(45) + formatKB(report.totalBytes));
  console.log(`Budget: ${formatKB(budget)}`);

  if (report.missing.length > 0) {
    console.warn(`\nWarning: ${report.missing.length} referenced file(s) not found in out/:`);
    for (const path of report.missing) console.warn(`  - ${path}`);
  }

  if (report.totalBytes > budget) {
    const message = `\nOver budget: shell is ${formatKB(report.totalBytes)}, budget is ${formatKB(budget)}.`;
    if (WARN_ONLY) {
      console.warn(message + " (warning only, not failing CI — see scripts/check-bundle.ts)");
      process.exit(0);
    }
    console.error(message);
    process.exit(1);
  }

  console.log("\nWithin budget.");
}

main();
