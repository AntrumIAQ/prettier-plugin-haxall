#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";
import plugin from "../../src/index.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const cases = [
  ["issue-12.fan", "issue-12-expected.fan"],
  ["issue-13.fan", "issue-13-expected.fan"],
  ["issue-14.fan", "issue-14-expected.fan"],
  ["issue-15.fan", "issue-15-expected.fan"],
];

let failed = 0;

for (const [inputName, expectedName] of cases) {
  const inputPath = path.join(root, inputName);
  const expectedPath = path.join(root, expectedName);
  const input = fs.readFileSync(inputPath, "utf8");
  const expected = fs.readFileSync(expectedPath, "utf8");
  const actual = await prettier.format(input, {
    parser: "fantom",
    plugins: [plugin],
    printWidth: 120,
  });

  if (actual !== expected) {
    failed += 1;
    console.error(`FAIL ${inputName}`);
    console.error("--- expected ---");
    console.error(expected);
    console.error("--- actual ---");
    console.error(actual);
  } else {
    console.log(`PASS ${inputName}`);
  }
}

if (failed > 0) {
  process.exit(1);
}

console.log(`All ${cases.length} Fantom formatting tests passed.`);
