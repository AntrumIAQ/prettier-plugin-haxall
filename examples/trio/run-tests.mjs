#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";
import plugin from "../../src/index.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const cases = [["multiline-string.trio", "multiline-string-expected.trio"]];

let failed = 0;

for (const [inputName, expectedName] of cases) {
  const inputPath = path.join(root, inputName);
  const expectedPath = path.join(root, expectedName);
  const input = fs.readFileSync(inputPath, "utf8");
  const expected = fs.readFileSync(expectedPath, "utf8");
  const format = (text) => prettier.format(text, { parser: "trio-parse", plugins: [plugin], printWidth: 120 });

  const actual = await format(input);
  if (actual !== expected) {
    failed += 1;
    console.error(`FAIL ${inputName}`);
    console.error("--- expected ---");
    console.error(expected);
    console.error("--- actual ---");
    console.error(actual);
    continue;
  }

  // A dedented block comment/multi-line-string bug can format cleanly once
  // but produce output that no longer re-parses (or drifts) on a second
  // pass, since the axon source is now indented differently than it was in
  // the hand-written original. Guard against that regression directly.
  const reformatted = await format(actual);
  if (reformatted !== actual) {
    failed += 1;
    console.error(`FAIL ${inputName} (not idempotent on second format pass)`);
    console.error("--- first pass ---");
    console.error(actual);
    console.error("--- second pass ---");
    console.error(reformatted);
    continue;
  }

  console.log(`PASS ${inputName}`);
}

if (failed > 0) {
  process.exit(1);
}

console.log(`All ${cases.length} Trio formatting tests passed.`);
