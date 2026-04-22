/**
 * AST-driven Fantom formatter.
 *
 * Strategy:
 *  - Type headers (class/mixin/enum + facets, name, base) are RECONSTRUCTED
 *    from AST data, so facet positioning and signature format are always correct.
 *  - Method signatures (return type, name, params) are RECONSTRUCTED from AST.
 *  - Field declarations are RECONSTRUCTED from AST (flags, type, name).
 *  - Field init values and method bodies are SOURCE-EXTRACTED and re-indented.
 *    This preserves complex closures, DSL strings, comments, and all expressions
 *    exactly as the user wrote them, while normalising the indentation level.
 *  - Body lines are also passed through `formatLine` to normalize call spacing,
 *    paren/bracket whitespace, and it-block brace placement.
 *
 * Output style:
 *   - Braces on their own lines (Fantom conventional style)
 *   - 2-space slot indentation inside classes
 *   - 4-space body indentation inside methods
 *   - Single blank line between slots
 */

import { formatLine, splitCodeAndComment } from "./fantom-formatter.js";

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/**
 * @param {object} ast  - result of buildFantomAst()
 * @returns {string}    - formatted Fantom source
 */
export function printFantomAst(ast) {
  const { shebang, usings, types, sourceLines } = ast;

  const parts = [];

  if (shebang) parts.push(shebang.trimEnd());

  if (sourceLines && types.length > 0) {
    // Find the first and last `using` lines in the source (by scanning source directly,
    // not AST — the AST filters implicit usings like `sys`).
    const firstUsingSrcLine = findFirstUsingSourceLine(sourceLines);
    const lastUsingSrcLine = findLastUsingSourceLine(sourceLines);
    const firstType = types[0];
    // The "effective" start of the first type includes any facet lines above the class keyword.
    // td.loc().line() may return the class keyword OR the first facet depending on compiler version;
    // take the minimum of all facet starts and the recorded startLine to be safe.
    const firstTypeEffectiveLine = typeEffectiveStartLine(firstType);

    // Copyright / top-of-file comments before any `using`
    const headerEnd = firstUsingSrcLine != null ? firstUsingSrcLine - 1
                    : firstTypeEffectiveLine - 1;
    const headerLines = extractGapLines(sourceLines, shebang ? 1 : 0, headerEnd);
    if (headerLines.length > 0) {
      if (parts.length > 0) parts.push("");
      parts.push(...headerLines.map(normalizeGapLine));
    }

    // Usings (reconstructed/normalized from AST)
    if (usings.length > 0) {
      if (parts.length > 0) parts.push("");
      for (const u of usings) {
        parts.push(printUsing(u));
      }
    }

    // Content between last using in source and first type (e.g. top-level fandoc)
    if (lastUsingSrcLine != null) {
      const preTypeLines = extractGapLines(sourceLines, lastUsingSrcLine, firstTypeEffectiveLine - 1);
      if (preTypeLines.length > 0) {
        parts.push("");
        parts.push(...preTypeLines.map(normalizeGapLine));
      }
    }
  } else {
    // No sourceLines or no types — fall back to simple using output
    if (usings.length > 0) {
      if (parts.length > 0) parts.push("");
      for (const u of usings) {
        parts.push(printUsing(u));
      }
    }
  }

  // types
  for (let i = 0; i < types.length; i++) {
    const td = types[i];
    if (i === 0) {
      // Before first type: only add a blank separator if the source had a blank line
      // between the last output content and the type. This prevents a spurious extra blank
      // when fandoc is directly adjacent to the class declaration (no blank in source).
      if (parts.length > 0) {
        const typeStart = typeEffectiveStartLine(td);
        const lineBeforeType = (sourceLines ?? [])[typeStart - 2]; // 0-based: line just before type
        const sourceHadBlank = lineBeforeType == null || lineBeforeType.trim() === "";
        if (sourceHadBlank && parts[parts.length - 1] !== "") parts.push("");
      }
    } else {
      // Between types: extract any inter-type gap content from source
      // (section dividers, fandoc comments between top-level types).
      const prevTd = types[i - 1];
      const gapStart = prevTd.endLine;
      const gapEnd = typeEffectiveStartLine(td) - 1;
      const rawGap = sourceLines.slice(gapStart, gapEnd);
      const hadTrailingBlank = rawGap.length > 0 && rawGap[rawGap.length - 1].trim() === "";
      const gapLines = extractGapLines(sourceLines, gapStart, gapEnd);
      if (gapLines.length > 0) {
        parts.push("");
        parts.push(...gapLines.map(normalizeGapLine));
        // Preserve blank between section header and class declaration if source had one
        if (hadTrailingBlank) parts.push("");
      } else {
        parts.push("");
      }
    }
    parts.push(...printTypeDef(td, sourceLines));
  }

  // trailing newline (join adds \n between parts; add one extra at end)
  return parts.join("\n") + "\n";
}

/**
 * Returns the effective first source line of a type, accounting for facets that
 * appear before the class keyword. The compiler's loc().line() may return either
 * the class keyword line or a facet line depending on context, so we take the
 * minimum of all facet startLine values and the recorded startLine.
 */
function typeEffectiveStartLine(td) {
  let line = td.startLine;
  for (const f of td.facets) {
    if (f.startLine < line) line = f.startLine;
  }
  return line;
}

/**
 * Returns the 1-based line number of the first `using` statement in source, or null.
 */
function findFirstUsingSourceLine(sourceLines) {
  for (let i = 0; i < sourceLines.length; i++) {
    if (/^\s*using\s+/.test(sourceLines[i])) return i + 1;
  }
  return null;
}

/**
 * Returns the 1-based line number of the last `using` statement in source, or null.
 */
function findLastUsingSourceLine(sourceLines) {
  let last = null;
  for (let i = 0; i < sourceLines.length; i++) {
    if (/^\s*using\s+/.test(sourceLines[i])) last = i + 1;
  }
  return last;
}

// ---------------------------------------------------------------------------
// Using
// ---------------------------------------------------------------------------

function printUsing(u) {
  let line = `using ${u.podName}`;
  if (u.typeName) line += `::${u.typeName}`;
  if (u.asName) line += ` as ${u.asName}`;
  return line;
}

// ---------------------------------------------------------------------------
// TypeDef
// ---------------------------------------------------------------------------

function printTypeDef(td, sourceLines) {
  const lines = [];

  // Facets: some may be inline with the class keyword (e.g. `@Js class Foo`)
  const { own: ownFacets, inline: inlineFacets } = splitFacets(td.facets, td.startLine, sourceLines);
  const facetLineGroups = groupFacetsByLine(ownFacets);
  for (const group of facetLineGroups) {
    lines.push(group.map((f) => printFacet(f, "").trim()).join(" "));
  }

  // Class header keyword
  const keyword = typeKeyword(td.flags);
  const header = buildTypeHeader(keyword, td);
  const inlinePrefix = inlineFacets.map((f) => printFacet(f, "").trim()).join(" ");
  lines.push(inlinePrefix ? `${inlinePrefix} ${header}` : header);
  lines.push("{");

  // Slots
  const slotLines = printSlots(td.slots, td.bodyOpenLine, sourceLines);
  lines.push(...slotLines);

  // Preserve trailing blank line(s) between last slot and closing `}`
  if (td.slots.length > 0) {
    const lastSlot = td.slots[td.slots.length - 1];
    const trailGap = sourceLines.slice(lastSlot.endLine, td.endLine - 1);
    if (trailGap.some((l) => l.trim() === "")) lines.push("");
  }

  lines.push("}");
  return lines;
}

function typeKeyword(flags) {
  if (flags.includes("enum")) return "enum";
  if (flags.includes("mixin")) return "mixin";
  if (flags.includes("facet")) return "facet";
  return "class";
}

function buildTypeHeader(keyword, td) {
  const modifiers = td.flags
    .filter((f) => ["abstract", "internal", "native", "final", "const"].includes(f))
    .join(" ");
  const prefix = modifiers ? `${modifiers} ` : "";

  let header = `${prefix}${keyword} ${td.name}`;

  // Collect base + mixins
  const bases = [];
  if (td.base && !["Obj", "Enum", "Facet"].includes(td.base)) {
    bases.push(td.base);
  }
  for (const m of td.mixins) {
    if (m && !["Obj"].includes(m)) bases.push(m);
  }
  if (bases.length > 0) {
    header += ` : ${bases.join(", ")}`;
  }

  return header;
}

// ---------------------------------------------------------------------------
// Slots
// ---------------------------------------------------------------------------

function printSlots(slots, bodyOpenLine, sourceLines) {
  const lines = [];
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const isMethod = slot.type === "MethodDef";

    if (i === 0) {
      // Extract gap between class opening `{` and the first slot (fandoc, section dividers)
      if (bodyOpenLine != null) {
        const rawGap = sourceLines.slice(bodyOpenLine, slot.startLine - 1);
        const gapLines = extractGapLines(sourceLines, bodyOpenLine, slot.startLine - 1);
        if (gapLines.length > 0) {
          // Preserve blank after `{` if source had one
          if (rawGap.length > 0 && rawGap[0].trim() === "") lines.push("");
          lines.push(...gapLines.map(normalizeGapLine));
        }
      }
    } else {
      const prevSlot = slots[i - 1];
      // Extract gap lines between end of previous slot and start of this slot
      // (these may contain fandoc comments and section dividers)
      const gapStart = prevSlot.endLine; // 0-based index of line after prev endLine
      const gapEnd = slot.startLine - 1; // 0-based index of line before slot startLine
      const rawGap = sourceLines.slice(gapStart, gapEnd);
      const hadTrailingBlank = rawGap.length > 0 && rawGap[rawGap.length - 1].trim() === "";
      const gapLines = extractGapLines(sourceLines, gapStart, gapEnd);

      if (gapLines.length > 0) {
        // Always emit a blank line then the comment content before any slot
        lines.push("");
        lines.push(...gapLines.map(normalizeGapLine));
        // Preserve blank between section header and first slot if source had one
        if (hadTrailingBlank) lines.push("");
      } else {
        // No fandoc/divider content: preserve a blank line only if source had one
        if (rawGap.some((l) => l.trim() === "")) lines.push("");
      }
    }

    if (isMethod) {
      lines.push(...printMethodDef(slot, sourceLines));
    } else {
      lines.push(...printFieldDef(slot, sourceLines));
    }
  }
  return lines;
}

/**
 * Extracts non-trivial gap lines (comments) between two slot regions.
 * Returns only lines that contain actual content (strips leading/trailing blanks).
 *
 * @param {string[]} sourceLines
 * @param {number}   gapStart  - 1-based line number (inclusive) to start from
 * @param {number}   gapEnd    - 1-based line number (inclusive) to end at
 * @returns {string[]}
 */
function extractGapLines(sourceLines, gapStart, gapEnd) {
  if (gapEnd < gapStart) return [];
  const raw = sourceLines.slice(gapStart, gapEnd); // gapStart is already past prevSlot.endLine
  // Strip leading/trailing blank lines; keep interior content
  let start = 0;
  let end = raw.length - 1;
  while (start <= end && raw[start].trim() === "") start++;
  while (end >= start && raw[end].trim() === "") end--;
  if (start > end) return [];
  return raw.slice(start, end + 1);
}

/**
 * Normalizes section-divider lines to exactly 74 characters.
 * A line whose trimmed content is 6+ consecutive `/` or `*` characters (and nothing else)
 * is normalized to 74 of that character (preserving leading whitespace).
 */
function normalizeGapLine(line) {
  const trimmed = line.trim();
  if (trimmed.length >= 6 && /^\/+$/.test(trimmed)) return "/".repeat(74);
  if (trimmed.length >= 6 && /^\*+$/.test(trimmed)) return "*".repeat(74);
  return line;
}

// ---------------------------------------------------------------------------
// MethodDef
// ---------------------------------------------------------------------------

function printMethodDef(method, sourceLines) {
  const lines = [];
  const indent = "  "; // slot-level: 2 spaces

  // Facets: some may be inline with the signature (e.g. `@NoDoc native Str foo()`)
  const { own: ownFacets, inline: inlineFacets } = splitFacets(method.facets, method.startLine, sourceLines);
  // Group own facets by their source line so multiple facets on the same line
  // (e.g. `@NoDoc @Axon { admin = true }`) are emitted together on one line.
  const facetLineGroups = groupFacetsByLine(ownFacets);
  for (const group of facetLineGroups) {
    lines.push(indent + group.map((f) => printFacet(f, "").trim()).join(" "));
  }

  // Signature (+ optional constructor initializer)
  const sig = buildMethodSignature(method);
  const inlinePrefix = inlineFacets.map((f) => printFacet(f, "").trim()).join(" ");
  let sigLine = `${indent}${inlinePrefix ? inlinePrefix + " " : ""}${sig}`;
  if (method.hasCtorChain) {
    const init = extractCtorInitializer(sourceLines, method.startLine, method.endLine);
    if (init) sigLine += ` : ${init}`;
  }
  lines.push(sigLine);

  if (!method.hasBody) {
    return lines;
  }

  // Apply AST-driven body rewrites to a patched sourceLines copy before extraction.
  const patchedSourceLines = applyBodyRewrites(sourceLines, method.bodyRewrites);

  // Body: source-extract the content between `{` and `}`
  const body = extractSlotBody(patchedSourceLines, method.startLine, method.endLine);

  if (body === null) {
    // Distinguish truly bodyless (native class methods) from empty bodies.
    // Skip facet lines (starting with `@`) when looking for a `{` — a `{` in a facet
    // like `@Axon { su = true }` is not a method body.
    const srcSpanLines = patchedSourceLines.slice(method.startLine - 1, method.endLine);
    const hasBodyBrace = srcSpanLines.some((l) => !l.trimStart().startsWith("@") && l.includes("{"));
    if (!hasBodyBrace) {
      // No brace in source (outside facets) — method has no body (e.g. slot in a native class)
      return lines;
    }
    // Empty body: keep inline `{}` if originally a one-liner, else Allman style
    if (method.isOneLiner) {
      lines[lines.length - 1] += " {}";
    } else {
      lines.push(`${indent}{`);
      lines.push(`${indent}}`);
    }
    return lines;
  }

  // Preserve one-liner methods: if the original was a single line, keep it inline
  if (method.isOneLiner && !body.includes("\n")) {
    let inlineBody = body.trim();
    // Apply single-return strip for one-liners (can't use source-line patching for these)
    if (method.bodyRewrites?.singleReturn && inlineBody.startsWith("return ")) {
      inlineBody = inlineBody.slice("return ".length);
    }
    // Apply zero-arg call strips to the inline body string (simple text replacement)
    if (method.bodyRewrites?.zeroArgCalls?.length) {
      inlineBody = stripZeroArgCallsFromText(inlineBody, method.bodyRewrites.zeroArgCalls);
    }
    lines[lines.length - 1] += ` { ${inlineBody} }`;
    return lines;
  }

  lines.push(`${indent}{`);
  const bodyIndent = "    "; // body: 4 spaces
  const bodyLines = reindentBlock(body, bodyIndent);
  lines.push(...bodyLines);
  lines.push(`${indent}}`);

  return lines;
}

function buildMethodSignature(method) {
  let flags = method.flags.filter((f) =>
    ["static", "abstract", "override", "virtual", "const", "native", "new", "once",
     "readonly", "private", "protected", "internal"].includes(f)
  );
  // `override` and `abstract` both imply `virtual`; emitting virtual is redundant
  if (flags.includes("override") || flags.includes("abstract")) {
    flags = flags.filter((f) => f !== "virtual");
  }

  // Use source param list when available to preserve closure type named params (|Str name|).
  // Fallback to AST-built params when source extraction was not possible.
  const params = method.sourceParamList ?? buildParamList(method.params);

  // Constructors: emit `new name(params)` without return type
  if (flags.includes("new")) {
    const otherFlags = flags.filter((f) => f !== "new").join(" ");
    const prefix = otherFlags ? `${otherFlags} ` : "";
    return `${prefix}new ${method.name}(${params})`;
  }

  const modifiers = flags.join(" ");
  const prefix = modifiers ? `${modifiers} ` : "";
  return `${prefix}${method.returnType} ${method.name}(${params})`;
}

function buildParamList(params) {
  return params
    .map((p) => {
      let s = `${p.paramType} ${p.name}`;
      if (p.hasDefault) s += ` := ${p.defaultVal ?? "_"}`;
      return s;
    })
    .join(", ");
}

// ---------------------------------------------------------------------------
// FieldDef
// ---------------------------------------------------------------------------

function printFieldDef(field, sourceLines) {
  const lines = [];
  const indent = "  ";

  // Facets: some may be inline (e.g. `@Transient Int count`)
  const { own: ownFacets, inline: inlineFacets } = splitFacets(field.facets, field.startLine, sourceLines);
  const facetLineGroups = groupFacetsByLine(ownFacets);
  for (const group of facetLineGroups) {
    lines.push(indent + group.map((f) => printFacet(f, "").trim()).join(" "));
  }

  // Reconstruct the field header from AST (canonical modifier order)
  let flags = field.flags.filter((f) =>
    ["new", "override", "virtual", "abstract", "static", "native", "once",
     "readonly", "const", "private", "protected", "internal"].includes(f)
  );
  if (flags.includes("override") || flags.includes("abstract")) flags = flags.filter((f) => f !== "virtual");
  const modifiers = flags.join(" ");
  const prefix = modifiers ? `${modifiers} ` : "";
  const inlinePrefix = inlineFacets.map((f) => printFacet(f, "").trim()).join(" ");
  const header = `${indent}${inlinePrefix ? inlinePrefix + " " : ""}${prefix}${field.fieldType} ${field.name}`;

  // Find the init value in the source (everything after `:=`)
  const initText = extractFieldInit(sourceLines, field.startLine, field.endLine);

  if (initText !== null) {
    // Has `:=` init
    const initLines = initText.split("\n");
    if (initLines.length === 1) {
      lines.push(`${header} := ${initLines[0].trim()}`);
    } else {
      const firstInit = initLines[0].trim();
      lines.push(`${header} := ${firstInit}`);
      const rest = initLines.slice(1);
      const reindented = reindentBlock(rest.join("\n"), indent + "  ");
      lines.push(...reindented);
    }
    // If there is an accessor block after a single-line init, emit those lines
    if (field.hasAccessorBlock && initLines.length === 1 && field.endLine > field.startLine) {
      // Lines after the declaration line (0-based: field.startLine .. field.endLine - 1)
      const accessorSrc = sourceLines.slice(field.startLine, field.endLine);
      if (accessorSrc.some((l) => l.trim())) {
        lines.push(...reindentBlock(accessorSrc.join("\n"), indent));
      }
    }
  } else if (field.hasAccessorBlock) {
    // No `:=` init — accessor block is either inline on the declaration line
    // (e.g. `Int flagsSimple { private set }`) or on following lines.
    const sourceLine = sourceLines[field.startLine - 1] ?? "";
    const braceIdx = sourceLine.indexOf("{");
    if (braceIdx !== -1) {
      // Inline accessor: extract the `{...}` part and append to reconstructed header
      const accessorPart = sourceLine.slice(braceIdx).trim();
      const fullLine = `${header} ${accessorPart}`;
      lines.push(...reindentBlock(fullLine, indent));
    } else if (field.endLine > field.startLine) {
      // Accessor block on following lines
      lines.push(header);
      const accessorSrc = sourceLines.slice(field.startLine, field.endLine);
      if (accessorSrc.some((l) => l.trim())) {
        lines.push(...reindentBlock(accessorSrc.join("\n"), indent));
      }
    } else {
      lines.push(header);
    }
  } else {
    lines.push(header);
  }

  return lines;
}

// ---------------------------------------------------------------------------
// FacetDef
// ---------------------------------------------------------------------------

function printFacet(f, indent) {
  let line = `${indent}@${f.qname}`;
  if (f.sourceBody) {
    // Use raw source body to preserve exact field values (e.g. `{ su = true }`, `{ meta = [...] }`)
    line += ` ${f.sourceBody}`;
  } else if (f.fields.length > 0) {
    const pairs = f.fields.map((kv) => `${kv.name} = ${kv.val}`).join("; ");
    line += ` { ${pairs} }`;
  }
  return line;
}

/**
 * Returns true if a facet appears inline (same source line) with the
 * declaration at `startLine`. A facet is "inline" when the source line
 * contains both the facet annotation AND a declaration keyword/identifier
 * after all the facets (e.g. `@Js class Foo`, `@NoDoc native Str debug()`).
 *
 * Handles multiple facets on the same line (e.g. `@NoDoc @Axon { su = true }`)
 * by stripping ALL facet annotations from the line before checking for remaining content.
 */
function isInlineFacet(f, startLine, sourceLines) {
  const srcLine = (sourceLines[startLine - 1] || "").trimStart();
  // The facet must appear somewhere on this line
  if (!srcLine.includes(`@${f.qname}`)) return false;
  // Strip all @Name and @Name { ... } patterns from the line.
  // If any non-whitespace remains, the facets are inline with a declaration.
  const stripped = srcLine.replace(/@\w+(\s*\{[^}]*\})?\s*/g, "").trim();
  return stripped.length > 0;
}

/**
 * Groups an array of facets by their source line number.
 * Facets on the same source line are kept together in one group.
 */
function groupFacetsByLine(facets) {
  const groups = [];
  let currentGroup = [];
  let currentLine = -1;
  for (const f of facets) {
    if (f.startLine === currentLine) {
      currentGroup.push(f);
    } else {
      if (currentGroup.length > 0) groups.push(currentGroup);
      currentGroup = [f];
      currentLine = f.startLine;
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
}

/**
 * Separates facets into two groups: those emitted inline with the declaration
 * and those emitted on their own line above it.
 */
function splitFacets(facets, startLine, sourceLines) {
  const own = [];
  const inline = [];
  for (const f of facets) {
    if (isInlineFacet(f, startLine, sourceLines)) {
      inline.push(f);
    } else {
      own.push(f);
    }
  }
  return { own, inline };
}

// ---------------------------------------------------------------------------
// Source extraction helpers
// ---------------------------------------------------------------------------

/**
 * Apply AST-driven rewrites to source lines, returning a patched copy.
 * Rewrites are applied BEFORE body extraction so `extractSlotBody` sees already-transformed text.
 *
 * bodyRewrites shape: { zeroArgCalls: [{sourceLine, sourceCol, name}], singleReturn: {sourceLine}|null }
 * All line/col numbers are 1-based (from Fantom compiler AST).
 */
function applyBodyRewrites(sourceLines, bodyRewrites) {
  if (!bodyRewrites) return sourceLines;
  const { zeroArgCalls, singleReturn } = bodyRewrites;
  if ((!zeroArgCalls || zeroArgCalls.length === 0) && !singleReturn) return sourceLines;

  // Shallow copy — only patch lines that need changes
  const patched = sourceLines.slice();

  // Apply zero-arg call rewrites: replace `name()` → `name` at the known location.
  // Process calls in reverse order by col on the same line to avoid offset shifts.
  if (zeroArgCalls && zeroArgCalls.length > 0) {
    // Group by source line
    const byLine = new Map();
    for (const call of zeroArgCalls) {
      const arr = byLine.get(call.sourceLine) ?? [];
      arr.push(call);
      byLine.set(call.sourceLine, arr);
    }
    for (const [srcLine, calls] of byLine) {
      const idx = srcLine - 1;
      if (idx < 0 || idx >= patched.length) continue;
      let line = patched[idx];
      // Sort calls in descending col order so earlier replacements don't shift later offsets
      calls.sort((a, b) => b.sourceCol - a.sourceCol);
      for (const call of calls) {
        const col0 = call.sourceCol - 1; // convert to 0-based
        const target = `${call.name}()`;
        // Verify the text matches at this position before rewriting
        if (line.slice(col0, col0 + target.length) === target) {
          line = line.slice(0, col0) + call.name + line.slice(col0 + target.length);
        } else {
          // Fallback: scan the line for `name()` and replace last occurrence before col
          const searchTarget = target;
          let pos = line.lastIndexOf(searchTarget, col0 + call.name.length + 2);
          if (pos !== -1) {
            line = line.slice(0, pos) + call.name + line.slice(pos + searchTarget.length);
          }
        }
      }
      patched[idx] = line;
    }
  }

  // Apply single-return rewrite: strip `return ` from the start of the statement.
  if (singleReturn) {
    const idx = singleReturn.sourceLine - 1;
    if (idx >= 0 && idx < patched.length) {
      const line = patched[idx];
      const trimmed = line.trimStart();
      if (trimmed.startsWith("return ")) {
        const leadingWs = line.slice(0, line.length - trimmed.length);
        patched[idx] = leadingWs + trimmed.slice("return ".length);
      }
    }
  }

  return patched;
}

/**
 * Strip zero-arg `name()` → `name` from an inline body text string.
 * Used for one-liner methods where source-line-based patching cannot apply.
 * Replaces all occurrences of `call.name + "()"` that exactly match calls in the list.
 */
function stripZeroArgCallsFromText(text, zeroArgCalls) {
  // Collect unique call names (source location is meaningless for one-liner inline text)
  const names = new Set(zeroArgCalls.map((c) => c.name));
  let result = text;
  for (const name of names) {
    // Replace `name()` with `name`, but not `name(args)` — only empty parens
    result = result.replaceAll(`${name}()`, name);
  }
  return result;
}

/**
 * Finds the method/constructor body between `{` and `}` within the slot's
 * source lines, then returns the content between them as a string (NOT
 * including the brace lines themselves). Returns null if no body found.
 *
 * @param {string[]} sourceLines  - all file lines (0-indexed)
 * @param {number}   startLine    - slot's startLine (1-based, inclusive)
 * @param {number}   endLine      - slot's endLine (1-based, inclusive)
 */
function extractSlotBody(sourceLines, startLine, endLine) {
  let bodyOpenIdx = -1;
  let bodyOpenCol = -1;
  let depth = 0;

  for (let i = startLine - 1; i < Math.min(endLine, sourceLines.length); i++) {
    const line = sourceLines[i];
    // Lines starting with `@` are facet annotations — their `{...}` fields are NOT method bodies.
    const isFacetLine = line.trimStart().startsWith("@");
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci];
      if (ch === "{") {
        if (depth === 0 && !isFacetLine) {
          bodyOpenIdx = i;
          bodyOpenCol = ci;
        }
        depth++;
      } else if (ch === "}") {
        depth--;
        if (bodyOpenIdx !== -1 && depth === 0) {
          const bodyCloseIdx = i;
          const bodyCloseCol = ci;

          if (bodyOpenIdx === bodyCloseIdx) {
            // Same-line body: extract text between `{` and `}`
            const inner = line.slice(bodyOpenCol + 1, bodyCloseCol).trim();
            return inner.length > 0 ? inner : null;
          }

          // Multi-line body
          const bodyLines = sourceLines.slice(bodyOpenIdx + 1, bodyCloseIdx);
          return bodyLines.join("\n");
        }
      }
    }
  }

  // Found open but never closed within range; use remaining lines
  if (bodyOpenIdx !== -1) {
    const bodyLines = sourceLines.slice(bodyOpenIdx + 1, endLine);
    return bodyLines.join("\n");
  }

  return null;
}

/**
 * Finds the field init value in source. Looks for `:=` or `=` on the
 * field declaration line and extracts the init text (may span lines
 * if the init is a closure).
 *
 * Returns the init text (without leading `:=`), or null if no init.
 */
function extractFieldInit(sourceLines, startLine, endLine) {
  // Scan lines in the slot region looking for `:=`
  for (let i = startLine - 1; i < Math.min(endLine, sourceLines.length); i++) {
    const line = sourceLines[i];
    const assignIdx = line.indexOf(":=");
    if (assignIdx === -1) continue;

    const afterAssign = line.slice(assignIdx + 2).trim();

    // Track depth for both `{}` (closures) and `[]` (list literals)
    let braceDepth = 0;
    let bracketDepth = 0;
    for (const ch of afterAssign) {
      if (ch === "{") braceDepth++;
      else if (ch === "}") braceDepth--;
      else if (ch === "[") bracketDepth++;
      else if (ch === "]") bracketDepth--;
    }

    if (braceDepth === 0 && bracketDepth === 0) {
      // Single-line init
      return afterAssign || null;
    }

    // Multi-line: collect lines until all depths return to 0
    const initParts = [afterAssign];
    for (let j = i + 1; j < Math.min(endLine, sourceLines.length); j++) {
      const nextLine = sourceLines[j];
      initParts.push(nextLine);
      for (const ch of nextLine) {
        if (ch === "{") braceDepth++;
        else if (ch === "}") braceDepth--;
        else if (ch === "[") bracketDepth++;
        else if (ch === "]") bracketDepth--;
      }
      if (braceDepth === 0 && bracketDepth === 0) break;
    }
    return initParts.join("\n");
  }

  return null;
}

/**
 * Extracts the constructor initializer (`: super(...)` or `: this.make(...)`)
 * from source, between the closing `)` of the param list and the opening `{`.
 * Returns the initializer text WITHOUT the leading `: `, or null if not found.
 */
function extractCtorInitializer(sourceLines, startLine, endLine) {
  // Collect all source text from startLine to the body-opening `{`
  let parenDepth = 0;
  let pastParams = false;

  for (let i = startLine - 1; i < Math.min(endLine, sourceLines.length); i++) {
    const line = sourceLines[i];
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci];
      if (!pastParams) {
        if (ch === "(") parenDepth++;
        else if (ch === ")") {
          parenDepth--;
          if (parenDepth === 0) {
            // Past the closing `)` of the param list
            // The initializer is the text between here and `{`
            const rest = line.slice(ci + 1);
            // Collect until we see `{`
            let initText = rest;
            for (let j = i + 1; j < Math.min(endLine, sourceLines.length); j++) {
              if (initText.includes("{")) break;
              initText += " " + sourceLines[j];
            }
            const braceIdx = initText.indexOf("{");
            const region = braceIdx >= 0 ? initText.slice(0, braceIdx) : initText;
            const colonMatch = region.match(/:\s*(.+?)\s*$/);
            if (colonMatch) return colonMatch[1].trim();
            return null;
          }
        }
      }
    }
  }
  return null;
}

/**
 * Converts K&R control-flow braces to Allman style for a single formatted line.
 * Returns an array of one or more lines:
 *   `    if (x) {`           → ["    if (x)", "    {"]
 *   `    else {`             → ["    else", "    {"]
 *   `    } else if (x) {`   → ["    }", "    else if (x)", "    {"]
 *   `    } catch (e) {`     → ["    }", "    catch (e)", "    {"]
 * Closure blocks (`|x| {`) and same-line bodies (`{ expr }`) are left unchanged.
 */
function allmanifyLine(line) {
  const trimEnd = line.trimEnd();
  if (!trimEnd.endsWith("{")) return [line];

  const indent = trimEnd.match(/^(\s*)/)[1];
  const content = trimEnd.trimStart();

  // Skip closure blocks: `|...| {` — these are intentional K&R in Fantom
  if (/\|[^|]*\|\s*\{$/.test(content)) return [line];

  // Skip same-line bodies: `{ expr }` already on one line (handled separately as one-liners)
  // These would have a matching `}` on the same line, not at the end
  if (/^\{.*\}$/.test(content)) return [line];

  // Case: `} else if (...) {` or `} else {` or `} catch (...) {` or `} finally {`
  const closeContMatch = content.match(/^}\s+(else(?:\s+if\s*\(.*\))?|catch\s*\(.*\)|finally)\s*\{$/);
  if (closeContMatch) {
    const keyword = closeContMatch[1].trimEnd();
    return [`${indent}}`, `${indent}${keyword}`, `${indent}{`];
  }

  // Case: standalone control-flow `keyword (...) {` or bare `else {` / `try {` / `finally {`
  if (!/^(if|for|while|else(?:\s+if)?|switch|try|catch|finally)[\s({]/.test(content)) return [line];

  // Strip trailing ` {`
  const withoutBrace = trimEnd.slice(0, trimEnd.lastIndexOf(" {")) || trimEnd.slice(0, -1);
  return [withoutBrace, `${indent}{`];
}

/**
 * Finds the minimum indentation of all non-empty lines, strips it, then
 * prepends targetIndent to every line. Applies formatLine for spacing normalization
 * and allmanifyLine for Allman brace conversion on control-flow constructs.
 *
 * @param {string} text          - block text (may be multi-line)
 * @param {string} targetIndent  - spaces to prepend to each line
 * @returns {string[]}           - array of re-indented lines
 */
function reindentBlock(text, targetIndent) {
  if (!text || text.trim() === "") return [];

  const lines = text.split("\n");

  // Find the minimum indentation (ignore blank lines); tabs count as 1 indent unit
  const indentLen = (line) => {
    let n = 0;
    for (const ch of line) {
      if (ch === " ") n++;
      else if (ch === "\t") n += 4;
      else break;
    }
    return n;
  };

  // Compute minIndent and indentUnit using only structural lines (paren/bracket depth 0).
  // Continuation lines (inside multi-line calls or list literals) are excluded so that
  // mis-indented arguments don't corrupt the structural indent unit for the whole body.
  let parenD = 0, bracketD = 0;
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim() === "") continue;
    if (parenD === 0 && bracketD === 0) {
      const leading = indentLen(line);
      if (leading < minIndent) minIndent = leading;
    }
    for (const ch of line) {
      if (ch === "(") parenD++;
      else if (ch === ")") parenD = Math.max(0, parenD - 1);
      else if (ch === "[") bracketD++;
      else if (ch === "]") bracketD = Math.max(0, bracketD - 1);
    }
  }
  if (minIndent === Infinity) minIndent = 0;

  // Detect the source indent unit (smallest non-zero relative indent among structural lines).
  // Using min (not GCD) avoids edge cases where alignment continuation lines
  // (e.g., 13-space continuations) corrupt the structural indent unit via GCD.
  parenD = 0; bracketD = 0;
  let indentUnit = 0;
  for (const line of lines) {
    if (line.trim() === "") continue;
    if (parenD === 0 && bracketD === 0) {
      const rel = indentLen(line) - minIndent;
      if (rel > 0 && (indentUnit === 0 || rel < indentUnit)) indentUnit = rel;
    }
    for (const ch of line) {
      if (ch === "(") parenD++;
      else if (ch === ")") parenD = Math.max(0, parenD - 1);
      else if (ch === "[") bracketD++;
      else if (ch === "]") bracketD = Math.max(0, bracketD - 1);
    }
  }
  if (indentUnit === 0) indentUnit = 2; // flat or all-continuation block — use 2-space default

  const state = { inBlockComment: false, inTripleString: false };
  const result = [];
  let crossLineParenDepth = 0; // track open parens spanning multiple lines for semicolon guarding
  for (const line of lines) {
    if (line.trim() === "") {
      result.push("");
      continue;
    }
    const rel = indentLen(line) - minIndent;
    // Normalize: convert source indent levels to canonical 2-space levels
    const level = Math.round(rel / indentUnit);
    const normalizedLeading = "  ".repeat(level);
    const formatted = formatLine(line.trimStart(), state, crossLineParenDepth);
    const reindented = targetIndent + normalizedLeading + formatted;
    result.push(...allmanifyLine(reindented));
    // Update running paren depth for subsequent lines using raw source (before formatting).
    // Count parens in the code portion only (skip string/comment content).
    const { code: lineCode } = splitCodeAndComment(line, {
      inBlockComment: state.inBlockComment,
      inTripleString: state.inTripleString,
    });
    for (const ch of lineCode) {
      if (ch === "(") crossLineParenDepth += 1;
      else if (ch === ")") crossLineParenDepth = Math.max(0, crossLineParenDepth - 1);
    }
  }
  return fixMultiLineCallArgs(result);
}

/**
 * Counts the net `{` minus `}` balance of a line, skipping string literals
 * and line comments. Used alongside parenLineBalance for closure depth tracking.
 */
function braceLineBalance(line) {
  let balance = 0;
  let inStr = false;
  let strChar = "";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inStr) {
      if (ch === "\\" && strChar !== "`") { i++; continue; }
      if (ch === strChar) inStr = false;
    } else if (ch === '"' || ch === "'") {
      inStr = true;
      strChar = ch;
    } else if (ch === "/" && line[i + 1] === "/") {
      break;
    } else if (ch === "{") {
      balance++;
    } else if (ch === "}") {
      balance--;
    }
  }
  return balance;
}

/**
 * Post-processing pass: for every line ending with `(` that is followed by a
 * multi-line arg list, re-indents all arg lines using paren+brace depth tracking
 * so that args are always at `callIndent + 2 + innerDepth*2` regardless of their
 * original indentation. The closing `)` is placed at `callIndent`.
 *
 * This handles dangling args (next line at ≤ callIndent), already-indented args,
 * and mis-indented args (e.g., one arg at 15 spaces when others are at 8).
 *
 * Applied as a single pass; nested calls are handled inline via depth tracking.
 */
function fixMultiLineCallArgs(lines) {
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      result.push(line);
      i++;
      continue;
    }

    const callIndent = line.search(/\S/);
    const trimEnd = line.trimEnd();

    if (trimEnd.endsWith("(")) {
      // Check there is a next line (multi-line call, not an empty call on the last line)
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;

      if (j < lines.length) {
        result.push(line);
        i++;

        // Collect and re-indent args until the matching closing `)`
        let parenDepth = 1; // we opened the outer `(`
        let braceDepth = 0;

        while (i < lines.length && parenDepth > 0) {
          const argLine = lines[i];
          const argTrimmed = argLine.trim();

          if (!argTrimmed) {
            result.push("");
            i++;
            continue;
          }

          const pBal = parenLineBalance(argLine);
          const bBal = braceLineBalance(argLine);
          const newParenDepth = parenDepth + pBal;
          const newBraceDepth = Math.max(0, braceDepth + bBal);

          // Outer call closed: this line's parens bring depth to ≤0
          if (newParenDepth <= 0) {
            if (argTrimmed[0] === ")") {
              // Pure closing line — place at callIndent
              result.push(" ".repeat(callIndent) + argTrimmed);
            } else {
              // Content + trailing closing parens — use current depth
              const combined = (parenDepth - 1) + braceDepth;
              result.push(" ".repeat(callIndent + 2 + combined * 2) + argTrimmed);
            }
            parenDepth = 0;
            i++;
            break;
          }

          // Determine output depth: closing lines use depth AFTER the leading close;
          // other lines use depth BEFORE update (so they align with their opening).
          let outParen = parenDepth;
          let outBrace = braceDepth;
          if (argTrimmed[0] === ")") {
            outParen = newParenDepth; // depth after decrement
          } else if (argTrimmed[0] === "}") {
            outBrace = newBraceDepth; // depth after decrement
          }

          const combined = (outParen - 1) + outBrace;
          result.push(" ".repeat(callIndent + 2 + combined * 2) + argTrimmed);

          parenDepth = newParenDepth;
          braceDepth = newBraceDepth;
          i++;
        }
        continue;
      }
    }

    result.push(line);
    i++;
  }

  return result;
}

/**
 * Counts the net `(` minus `)` balance of a line, skipping string literals
 * and line comments. Used to track paren depth across multi-line calls.
 */
function parenLineBalance(line) {
  let balance = 0;
  let inStr = false;
  let strChar = "";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inStr) {
      if (ch === "\\" && strChar !== "`") { i++; continue; } // escape sequence
      if (ch === strChar) inStr = false;
    } else if (ch === '"' || ch === "'") {
      inStr = true;
      strChar = ch;
    } else if (ch === "/" && line[i + 1] === "/") {
      break; // line comment — stop counting
    } else if (ch === "(") {
      balance++;
    } else if (ch === ")") {
      balance--;
    }
  }
  return balance;
}
