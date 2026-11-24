import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(join(dir, "entry.txt"), "utf8");

// Strip a single trailing newline if present (entry is one line).
const text = raw.endsWith("\n") ? raw.slice(0, -1) : raw;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

if (text.length < 1 || text.length > 200) {
  fail(`entry must be 1-200 characters, got ${text.length}`);
}
if (text.trim().length === 0) {
  fail("entry must not be only whitespace");
}
if (text.includes("\n") || text.includes("\r")) {
  fail("entry must be a single line");
}

// Reject control characters, invisible characters and Unicode line/paragraph separators.
if (/[\u0000-\u001F\u007F\u200B\u200C\u200D\uFEFF\uFFFD\u2028\u2029]/.test(text)) {
  fail("entry must not contain control or invisible characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
console.log(`wrote ${text.length} characters to ${join(outDir, "entry.txt")}`);
