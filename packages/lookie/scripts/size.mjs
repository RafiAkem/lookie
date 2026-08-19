// Size budget check: fails when gzip of the minified IIFE exceeds the limit.
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const LIMIT = 5 * 1024; // 5 KB gzip
const file = new URL("../dist/lookie.js", import.meta.url);
const bytes = readFileSync(file);
const gz = gzipSync(bytes).length;
console.log(`lookie.js gzip: ${(gz / 1024).toFixed(2)} KB (raw ${(bytes.length / 1024).toFixed(2)} KB), limit ${LIMIT / 1024} KB`);
if (gz > LIMIT) {
  console.error("Size budget exceeded.");
  process.exit(1);
}