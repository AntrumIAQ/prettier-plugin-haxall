const KEYWORDS_WITH_PARENS = new Set(["if", "for", "while", "switch", "catch", "return", "throw", "assert"]);
const WORD_OPERATORS = new Set(["as", "is", "isnot"]);
const SPACE_BEFORE_TYPE_BRACKET_WORDS = new Set([
  "public",
  "protected",
  "private",
  "internal",
  "native",
  "final",
  "const",
  "abstract",
  "override",
  "static",
  "virtual",
  "readonly",
  "once",
]);
const BINARY_OPERATORS = new Set([
  "=",
  ":=",
  "+",
  "-",
  "*",
  "/",
  "%",
  "&&",
  "||",
  "==",
  "!=",
  "===",
  "!==",
  "<",
  "<=",
  ">",
  ">=",
  "<=>",
  "?:",
  "?",
  ":",
  "..",
  "..<",
  "|",
  "&",
]);
const COMPOUND_OPERATORS = [
  "..<",
  "===",
  "!==",
  "<=>",
  "?.",
  "?->",
  "->",
  "::",
  ":=",
  "==",
  "!=",
  "<=",
  ">=",
  "&&",
  "||",
  "?:",
  "..",
  "++",
  "--",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  // Single-char assignment must come after all multi-char = variants
  "=",
  // Arithmetic operators: must come after ++/--, +=/-= etc.
  "+",
  "-",
  "*",
  "/",
  "%",
];

function normalizeNewlines(text) {
  return text.replace(/\r\n?/g, "\n");
}

function makeIndent(level, options) {
  if (options.useTabs) {
    return "\t".repeat(level);
  }
  return " ".repeat(level * (options.tabWidth ?? 2));
}

function isIdentifierStart(ch) {
  return /[A-Za-z_]/.test(ch);
}

function isIdentifierPart(ch) {
  return /[A-Za-z0-9_]/.test(ch);
}

function splitCodeAndComment(line, state) {
  let i = 0;
  while (i < line.length) {
    if (state.inBlockComment) {
      const end = line.indexOf("*/", i);
      if (end === -1) {
        return { code: line, comment: "", state };
      }
      state.inBlockComment = false;
      i = end + 2;
      continue;
    }

    if (state.inTripleString) {
      const end = line.indexOf('"""', i);
      if (end === -1) {
        return { code: line, comment: "", state };
      }
      state.inTripleString = false;
      i = end + 3;
      continue;
    }

    if (line.startsWith('"""', i)) {
      state.inTripleString = true;
      i += 3;
      continue;
    }

    if (line.startsWith("/*", i)) {
      state.inBlockComment = true;
      i += 2;
      continue;
    }

    if (line.startsWith("//", i)) {
      return { code: line.slice(0, i), comment: line.slice(i), state };
    }

    const ch = line[i];
    if (ch === '"') {
      i += 1;
      while (i < line.length) {
        if (line[i] === "\\") {
          i += 2;
          continue;
        }
        if (line[i] === '"') {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }

    if (ch === "`") {
      i += 1;
      while (i < line.length) {
        if (line[i] === "\\") {
          i += 2;
          continue;
        }
        if (line[i] === "`") {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }

    i += 1;
  }

  return { code: line, comment: "", state };
}

function tokenizeCode(code) {
  const tokens = [];
  let i = 0;

  while (i < code.length) {
    const ch = code[i];

    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    if (ch === '"') {
      // Triple-quoted string: """..."""
      if (code.startsWith('"""', i)) {
        let j = i + 3;
        while (j < code.length) {
          if (code.startsWith('"""', j)) {
            j += 3;
            break;
          }
          j += 1;
        }
        tokens.push({ type: "literal", value: code.slice(i, j) });
        i = j;
        continue;
      }
      // Regular double-quoted string
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code[j] === '"') {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push({ type: "literal", value: code.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === "'") {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code[j] === "'") {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push({ type: "literal", value: code.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === "`") {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code[j] === "`") {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push({ type: "literal", value: code.slice(i, j) });
      i = j;
      continue;
    }

    if (isIdentifierStart(ch)) {
      let j = i + 1;
      while (j < code.length && isIdentifierPart(code[j])) {
        j += 1;
      }
      const value = code.slice(i, j);
      tokens.push({ type: WORD_OPERATORS.has(value) ? "operator" : "word", value });
      i = j;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      let j = i + 1;
      while (j < code.length) {
        const cj = code[j];
        if (!/[A-Za-z0-9_\.]/.test(cj)) {
          break;
        }
        // Keep Fantom range operators tokenizable: 0..<n and 0..n
        // Stop numeric/literal scan before a range ".." sequence.
        if (cj === "." && code[j + 1] === ".") {
          break;
        }
        j += 1;
      }
      tokens.push({ type: "literal", value: code.slice(i, j) });
      i = j;
      continue;
    }

    const compound = COMPOUND_OPERATORS.find((op) => code.startsWith(op, i));
    if (compound) {
      tokens.push({ type: "operator", value: compound });
      i += compound.length;
      continue;
    }

    tokens.push({ type: "punct", value: ch });
    i += 1;
  }

  return tokens;
}

// Determine if the ")" at tokens[closeIdx] closes a type-cast expression.
// A cast is "(TypeExpr)" where TypeExpr contains only type tokens: uppercase words, ?, [], ::, ->.
function isCastCloseAt(tokens, closeIdx) {
  let depth = 1;
  let i = closeIdx - 1;
  while (i >= 0 && depth > 0) {
    if (tokens[i].value === ")") depth++;
    else if (tokens[i].value === "(") depth--;
    i--;
  }
  if (depth !== 0) return false;
  const openIdx = i + 1;
  // Must have at least one token inside
  if (closeIdx - openIdx < 2) return false;
  for (let j = openIdx + 1; j < closeIdx; j++) {
    const tok = tokens[j];
    if (tok.type === "word" && /^[a-z]/.test(tok.value)) return false; // lowercase = variable, not type
    if (tok.type === "literal") return false;
    if (tok.type === "operator" && tok.value !== "?" && tok.value !== "->" && tok.value !== "::") return false;
  }
  return true;
}

function needsSpace(prev, next, after, prevprev, prevprevprev, bracketDepth = 0, allTokens = null, currentIdx = -1) {
  const isTypeWord = (t) => t?.type === "word" && /^[A-Z]/.test(t.value);
  const isTypeExprEnd = (t) =>
    t?.value === "]" || t?.value === ")" || t?.value === "?" || t?.value === "->" || isTypeWord(t);

  if (!prev) {
    return false;
  }

  if (prev.value === "(" || prev.value === "[") {
    return false;
  }

  // Space after "{" for inline closure bodies: { return val }.
  // Multi-line blocks have "{" on its own line so prev is undefined for the body line.
  if (prev.value === "{") {
    return next.type === "word" || next.type === "literal" || next.value === "(" || next.value === "[";
  }

  // Space before "}" for inline closure bodies: { stmt } or nested: { a } }.
  if (next.value === "}") {
    return (
      prev.type === "word" || prev.type === "literal" || prev.value === ")" || prev.value === "]" || prev.value === "}"
    );
  }

  if (next.value === ")" || next.value === "]" || next.value === "," || next.value === ";") {
    return false;
  }

  if (
    next.value === "." ||
    next.value === "?." ||
    next.value === "->" ||
    next.value === "?->" ||
    next.value === "::" ||
    next.value === "#"
  ) {
    return false;
  }

  if (
    prev.value === "." ||
    prev.value === "?." ||
    prev.value === "->" ||
    prev.value === "?->" ||
    prev.value === "::" ||
    prev.value === "#"
  ) {
    return false;
  }

  // '!' unary NOT: space before in most contexts, never after.
  if (next.value === "!") {
    if (prev.value === "(" || prev.value === "[" || prev.value === "{") return false;
    if (prev.value === "!") return false; // double negation !!cond stays tight
    return true; // space before ! after keywords/values/operators: return !x, && !x
  }
  if (prev.value === "!") {
    return false; // no space after unary !: !data, !isEmpty, etc.
  }

  // Colon spacing: use look-ahead to distinguish case labels from inheritance/ternary.
  // Map-literal keys (literal before colon) never get a preceding space,
  // UNLESS the token two-back is '?' which means this is a ternary true-value.
  // Map/Dict type annotations [Str:Int] inside brackets get NO space around ':'.
  if (next.value === ":") {
    if (bracketDepth > 0 && prev.type === "word") return false; // [Str:Int] type
    // Type map pair: Str:Obj, Str:OverviewSummaryCard (outside inheritance headers)
    if (isTypeWord(prev) && (isTypeWord(after) || after?.value === "[")) {
      const lead = prevprev?.value;
      const isInheritanceHeader = lead === "class" || lead === "mixin" || lead === "enum";
      if (!isInheritanceHeader) return false;
    }
    if (prev.type === "literal") {
      // Ternary: cond ? "val" : default — prevprev is "?"
      if (prevprev?.value === "?") return true;
      return false; // map literal key: no space before :
    }
    if (after == null) return false; // case label (nothing after :) — no space
    // Ternary colon after a word: cond ? Marker.val : null — need space before ':'
    // We detect this with prevprev heuristic: if prevprev is '?' or a word that looks like value (lowercase)
    if (prev.type === "word") {
      if (prevprev?.value === "?") return true; // cond ? val : ...
      if (prevprev?.value === ".") return true; // cond ? obj.field : ...
    }
    return prev.type === "word" || prev.value === ")" || prev.value === "]" || prev.value === "}";
  }

  // Always add space after a colon when something follows it.
  // But NOT inside type-annotation brackets [Str:Int] — colon after type-word has no space.
  if (prev.value === ":") {
    if (bracketDepth > 0) {
      // Inside [...]: map literal "key": val → space; type [Str:Int] → no space.
      // Heuristic: if the token before colon (prevprev) was a literal, it's a map key.
      if (prevprev?.type === "literal") {
        return next.type === "word" || next.type === "literal" || next.value === "(" || next.value === "[";
      }
      return false; // type annotation — no space after :
    }
    // Type map pair outside []: Str:Obj (but keep spaces for class Foo : Bar)
    if (isTypeWord(prevprev) && (isTypeWord(next) || next.value === "[")) {
      const lead = prevprevprev?.value;
      const isInheritanceHeader = lead === "class" || lead === "mixin" || lead === "enum";
      if (!isInheritanceHeader) return false;
    }
    return next.type === "word" || next.type === "literal" || next.value === "(" || next.value === "[";
  }

  if (next.value === "(") {
    // Comparison before cast/grouping: int > (Int)val
    // Keep generic type closes tight: List<Str>(...)
    if (prev.value === "<" || prev.value === ">") {
      if (prevprev?.type === "literal" || prevprev?.value === ")" || prevprev?.value === "]") return true;
      if (prevprev?.type === "word" && /^[a-z]/.test(prevprev.value)) return true;
      return false;
    }
    if (prev.value === "?") return true;
    if (KEYWORDS_WITH_PARENS.has(prev.value)) return true;
    // Space after operator before paren: := (expr), = (expr), + (expr), etc.
    // Exclude unary-prefix operators so -(expr) stays tight.
    if (prev.type === "operator" && prev.value !== "-" && prev.value !== "!" && prev.value !== "~") return true;
    return false;
  }

  if (next.value === "[") {
    if (prev.value === "return" || prev.value === "throw" || prev.value === "assert") return true;
    if (prev.type === "word" && SPACE_BEFORE_TYPE_BRACKET_WORDS.has(prev.value)) return true;
    // Space after operator before bracket: := [list], = [list], etc.
    if (prev.type === "operator" && prev.value !== "-" && prev.value !== "!" && prev.value !== "~") return true;
    return false;
  }

  // Space before opening brace for trailing closures: method { }, SomeClass { }.
  if (next.value === "{") {
    return prev.type === "word" || prev.type === "operator" || prev.value === ")" || prev.value === "]";
  }

  if (prev.value === "|") {
    if (next.type === "word" && isTypeExprEnd(prevprev)) {
      return true;
    }
    return false;
  }

  if (next.value === "|") {
    if (prev.value === "(" || prev.value === "," || prev.value === "|") {
      return false;
    }
    // Function type close: |Dict?[]| onClose, |->| callback
    if (after?.type === "word" && isTypeExprEnd(prev)) {
      return false;
    }
    // Space before | only when it OPENS a closure parameter list (next param name follows).
    // No space before CLOSING | (followed by { or ), etc.).
    if (after?.type === "word" || after?.value === "->") {
      return true; // opening |params|
    }
    return false; // closing | — no space
  }

  // Cast expression: keep cast and following token tight: (Type)name, (Obj?[])expr, ((Type)obj)
  if (prev.value === ")" && (next.type === "word" || next.value === "(")) {
    if (allTokens && currentIdx >= 0 && isCastCloseAt(allTokens, currentIdx - 1)) return false;
    // Fallback for simple (Type)name without full token context
    if (prevprev?.type === "word" && /^[A-Z]/.test(prevprev.value) && prevprevprev?.value === "(") return false;
  }

  // Space after "}" when more code follows on the same line: "} Void foo()", "} : elem".
  // Dot/nav operators and paren closers are handled by earlier rules.
  if (prev.value === "}") {
    return next.type === "word" || next.type === "literal";
  }

  if (prev.type === "operator" || next.type === "operator") {
    // Range operators: no spaces around .. and ..<
    if (prev.value === ".." || prev.value === "..<" || next.value === ".." || next.value === "..<") {
      return false;
    }
    // Handle remaining operator spacing:
    if (prev.value === "-" && next.type === "literal") {
      return false;
    }
    if (next.value === "-" && prev.value === "(") {
      return false;
    }
    // '!' handling is done before this block; any remaining '!' case falls through.
    return true;
  }

  // '?' is a punct token. Handle ternary vs nullable-type heuristics here.
  // Nullable type marker (no space before ?): uppercase-starting word like Obj?, Str?
  // Ternary operator (space before ?): lowercase word, literal, ), ]
  if (next.value === "?") {
    // Nullable array/list type marker: Elem[]? value
    if (
      prev.value === "]" &&
      after?.type === "word" &&
      (prevprev?.value === "[" || isTypeWord(prevprev) || prevprev?.value === "]")
    ) {
      return false;
    }
    if (prev.value === ")" || prev.value === "]" || prev.type === "literal") return true;
    if (prev.type === "word" && /^[a-z]/.test(prev.value)) return true; // lowercase = ternary
    return false; // uppercase type name (Obj?, Str?) — no space before ?
  }
  // Space after '?' — either ternary true-value or nullable chaining.
  if (prev.value === "?") {
    if (next.value === "." || next.value === "?." || next.value === "->") return false; // ?.y chaining
    if (next.type === "word" || next.type === "literal" || next.value === "(" || next.value === "[") {
      return true; // space after ternary ? and after nullable ? before param name
    }
    return false;
  }

  // Binary comparison operators < and >.
  // Heuristic: lowercase identifiers, literals, and closing brackets indicate comparison;
  // uppercase identifiers indicate type-generic syntax (List<Str>).
  if (next.value === "<" || next.value === ">") {
    if (prev.type === "literal" || prev.value === ")" || prev.value === "]") return true;
    if (prev.type === "word" && /^[a-z]/.test(prev.value)) return true;
    return false;
  }
  if (prev.value === "<" || prev.value === ">") {
    if (next.value === "(") {
      // Comparison before cast/grouping: int > (Int)val
      if (prevprev?.type === "literal" || prevprev?.value === ")" || prevprev?.value === "]") return true;
      if (prevprev?.type === "word" && /^[a-z]/.test(prevprev.value)) return true;
      return false; // likely generic type close: List<Str>(...)
    }
    if (next.type === "literal") return true;
    if (next.type === "word" && /^[a-z]/.test(next.value)) return true;
    return false;
  }

  return (
    (prev.type === "word" || prev.type === "literal" || prev.value === ")" || prev.value === "]") &&
    (next.type === "word" || next.type === "literal" || next.value === "(" || next.value === "[")
  );
}

// Apply regex transforms to non-literal regions of a string, leaving string literal content intact.
function applyToNonLiterals(str, transforms) {
  const placeholders = [];
  const protected_str = str.replace(
    /"""[\s\S]*?"""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g,
    (m) => {
      const idx = placeholders.length;
      placeholders.push(m);
      return `\x00L${idx}\x00`;
    },
  );
  let result = protected_str;
  for (const [regex, repl] of transforms) {
    result = result.replace(regex, repl);
  }
  return result.replace(/\x00L(\d+)\x00/g, (_, idx) => placeholders[+idx]);
}

function renderTokens(tokens) {
  let out = "";
  let bracketDepth = 0; // track depth inside [...] for map-type vs map-literal discrimination

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const prev = tokens[i - 1];
    const prevprev = tokens[i - 2]; // two tokens back, for ternary context
    const prevprevprev = tokens[i - 3];
    const after = tokens[i + 1]; // look-ahead for context-sensitive rules

    if (needsSpace(prev, token, after, prevprev, prevprevprev, bracketDepth, tokens, i)) {
      out += " ";
    }
    out += token.value;

    // Update bracket depth AFTER rendering the token.
    if (token.value === "[") bracketDepth += 1;
    if (token.value === "]") bracketDepth = Math.max(0, bracketDepth - 1);

    // Add space after comma and semicolon (statement separator in inline closures).
    if ((token.value === "," || token.value === ";") && i < tokens.length - 1) {
      out += " ";
    }
  }

  return applyToNonLiterals(out, [
    [/\s+\)/g, ")"],
    [/\(\s+/g, "("],
  ]);
}

function countStructuralDeltas(code) {
  let openBraces = 0;
  let closeBraces = 0;
  let parenDelta = 0;
  let bracketDelta = 0;
  let startsWithCloser = false;

  const tokens = tokenizeCode(code);
  const first = tokens[0];
  if (first?.value === "}") {
    startsWithCloser = true;
  }

  for (const token of tokens) {
    if (token.type !== "punct") {
      continue;
    }
    const ch = token.value;
    if (ch === "{") openBraces += 1;
    else if (ch === "}") closeBraces += 1;
    else if (ch === "(") parenDelta += 1;
    else if (ch === ")") parenDelta -= 1;
    else if (ch === "[") bracketDelta += 1;
    else if (ch === "]") bracketDelta -= 1;
  }

  return { openBraces, closeBraces, parenDelta, bracketDelta, startsWithCloser };
}

// Split lines where a closing brace is followed by more code on the same line,
// e.g. "  } Void test2()" → "  }\n  Void test2()".
// Control-flow continuations (else / catch / finally) are intentionally left intact.
// This is applied as a late pass (after AST-guided rewrites) so that AST line numbers
// still align with the base-formatted text during the earlier phases.
function splitCloseBraceContinuations(formatted) {
  return formatted.replace(
    /^([ \t]*})([ \t]+)(?!else\b|catch\b|finally\b)(\S)/gm,
    (_, close, _sp, firstChar) => `${close}\n${firstChar}`,
  );
}

function rewriteControlTransitions(formatted) {
  const lines = formatted.replace(/\n$/, "").split("\n");
  const out = [];
  const state = { inBlockComment: false, inTripleString: false };

  for (const line of lines) {
    const split = splitCodeAndComment(line, state);
    const code = split.code;
    const comment = split.comment;

    const match = code.match(/^(\s*\})(\s+)(else\b.*|catch\b.*|finally\b.*)$/);
    if (match != null) {
      const closeLine = match[1];
      const controlLine = `${(closeLine.match(/^\s*/) ?? [""])[0]}${match[3].trimStart()}`;
      out.push(closeLine);
      out.push(comment ? `${controlLine} ${comment.trimStart()}` : controlLine);
      continue;
    }

    out.push(line);
  }

  return `${out.join("\n")}\n`;
}

function formatLine(line, state) {
  const split = splitCodeAndComment(line, state);
  const code = split.code.trim();
  const comment = split.comment ? split.comment.trimStart() : "";

  if (!code) {
    return comment;
  }

  const rendered = applyToNonLiterals(renderTokens(tokenizeCode(code)), [
    [/\s+\)/g, ")"],
    [/\(\s+/g, "("],
    [/\s+\]/g, "]"],
    [/\[\s+/g, "["],
  ])
    // Normalize common closure signature spacing.
    .replace(/\|\s*([A-Za-z_][A-Za-z0-9_,\s]*)\s*\|/g, (_, inner) => `|${inner.trim().replace(/\s*,\s*/g, ", ")}|`)
    .replace(/\|\s*\{/g, "| {");

  return comment ? `${rendered} ${comment}` : rendered;
}

export { formatLine };

export function formatFantomBase(source, options = {}) {
  const text = normalizeNewlines(source);
  const lines = text.split("\n");
  const state = { inBlockComment: false, inTripleString: false };
  const out = [];

  let indentLevel = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  let blankRun = 0;
  let pendingSingleStmtControlBody = false;
  let pendingTernaryContinuation = false;

  for (const rawLine of lines) {
    const wasInTriple = state.inTripleString;
    const hasTripleDelimiter = rawLine.includes('"""');

    // Preserve raw text while inside triple-quoted blocks. This avoids
    // mutating DSL/multiline content that should be byte-stable.
    if (wasInTriple || hasTripleDelimiter) {
      splitCodeAndComment(rawLine, state);
      out.push(rawLine);
      blankRun = 0;
      continue;
    }

    const trimmed = rawLine.trim();

    if (!trimmed) {
      if (blankRun === 0) {
        out.push("");
      }
      blankRun += 1;
      continue;
    }

    blankRun = 0;

    const preview = splitCodeAndComment(rawLine, {
      inBlockComment: state.inBlockComment,
      inTripleString: state.inTripleString,
    });
    const deltas = countStructuralDeltas(preview.code);

    const codeTrimStart = preview.code.trimStart();
    const startsWithBraceCloser = deltas.startsWithCloser;
    const startsWithBracketCloser = codeTrimStart.startsWith("]");
    const startsWithParenCloser = codeTrimStart.startsWith(")");
    const leadingCloserCount = (codeTrimStart.match(/^[\]\)]+/) ?? [""])[0].length;

    let lineIndent = indentLevel;
    if (startsWithBraceCloser) {
      lineIndent = Math.max(0, lineIndent - 1);
    }
    // Continuation indent for multi-line paren/bracket expressions.
    // Use full nesting depth so nested call parameters are indented correctly.
    // For lines that begin with closers, back off one level per leading closer
    // so each ')' / ']' aligns with its matching opener line.
    const continuationDepth = parenDepth + bracketDepth;
    if (continuationDepth > 0) {
      const continuationContribution =
        startsWithBracketCloser || startsWithParenCloser
          ? Math.max(0, continuationDepth - leadingCloserCount)
          : continuationDepth;
      lineIndent += continuationContribution;
    }

    const wasPendingTernaryContinuation = pendingTernaryContinuation;
    if (wasPendingTernaryContinuation && !startsWithBracketCloser && !startsWithParenCloser) {
      lineIndent += 1;
    }

    // Indent one-line control body when braces are omitted.
    // Example:
    // if (cond)
    //   throw Err(...)
    if (pendingSingleStmtControlBody) {
      const isControlContinuation = /^(else\b|catch\b|finally\b)/.test(codeTrimStart);
      if (!codeTrimStart.startsWith("{") && !codeTrimStart.startsWith("}") && !isControlContinuation) {
        lineIndent += 1;
      }
      pendingSingleStmtControlBody = false;
    }

    const formatted = formatLine(rawLine, state);
    out.push(`${makeIndent(lineIndent, options)}${formatted}`.replace(/[ \t]+$/g, ""));

    const codeTrim = preview.code.trim();

    const controlHeaderWithoutBraces =
      (/^(if|for|while)\b.*\)\s*$/.test(codeTrim) ||
        /^else\s+if\b.*\)\s*$/.test(codeTrim) ||
        /^else\s*$/.test(codeTrim)) &&
      !codeTrim.endsWith("{");
    pendingSingleStmtControlBody = controlHeaderWithoutBraces;

    pendingTernaryContinuation = /\?\s*$/.test(codeTrim) || (wasPendingTernaryContinuation && /:\s*$/.test(codeTrim));

    indentLevel = Math.max(0, indentLevel + deltas.openBraces - deltas.closeBraces);
    parenDepth = Math.max(0, parenDepth + deltas.parenDelta);
    bracketDepth = Math.max(0, bracketDepth + deltas.bracketDelta);
  }

  return `${out.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}

function formatUsingNode(usingNode) {
  const podName = String(usingNode.podName());
  const typeName = usingNode.typeName() == null ? null : String(usingNode.typeName());
  const asName = usingNode.asName() == null ? null : String(usingNode.asName());

  let line = `using ${podName}`;
  if (typeName != null) {
    line += `::${typeName}`;
  }
  if (asName != null) {
    line += ` as ${asName}`;
  }
  return line;
}

function rewriteUsingBlockWithAst(formatted, ast) {
  const unit = ast?.unit;
  if (unit == null) {
    return formatted;
  }

  const explicitUsings = [];
  unit.usings().each((u) => {
    if (u.loc() != null && u.loc().line() != null) {
      explicitUsings.push(formatUsingNode(u));
    }
    return;
  });

  if (explicitUsings.length === 0) {
    return formatted;
  }

  const lines = formatted.replace(/\n$/, "").split("\n");
  let firstUsing = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].startsWith("using ")) {
      firstUsing = i;
      break;
    }
    if (lines[i].trim() !== "") {
      break;
    }
  }

  if (firstUsing < 0) {
    return formatted;
  }

  let endUsing = firstUsing;
  while (endUsing < lines.length && lines[endUsing].startsWith("using ")) {
    endUsing += 1;
  }

  const rebuilt = [
    ...lines.slice(0, firstUsing),
    ...explicitUsings,
    "",
    ...lines.slice(endUsing).filter((line, idx, arr) => !(idx === 0 && line.trim() === "")),
  ];

  return `${rebuilt.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}

function buildTypeModifierPrefix(typeDef) {
  const parts = [];
  if (typeof typeDef.isConst === "function" && typeDef.isConst()) {
    parts.push("const");
  }
  if (typeof typeDef.isAbstract === "function" && typeDef.isAbstract()) {
    parts.push("abstract");
  }
  if (typeof typeDef.isFinal === "function" && typeDef.isFinal()) {
    parts.push("final");
  }
  return parts.length === 0 ? "" : `${parts.join(" ")} `;
}

function typeKind(typeDef) {
  if (typeof typeDef.isMixin === "function" && typeDef.isMixin()) {
    return "mixin";
  }
  // Skip enum/facet for now until we add dedicated handling.
  if (
    (typeof typeDef.isEnum === "function" && typeDef.isEnum()) ||
    (typeof typeDef.isFacet === "function" && typeDef.isFacet())
  ) {
    return null;
  }
  return "class";
}

function rewriteTypeHeadersWithAst(formatted, ast) {
  const unit = ast?.unit;
  if (unit == null) {
    return formatted;
  }

  const lines = formatted.replace(/\n$/, "").split("\n");

  const applyAt = (idx, typeDef) => {
    if (idx < 0 || idx >= lines.length) {
      return false;
    }
    const line = lines[idx];
    const match = line.match(/^(\s*)(?:(?:const|abstract|final)\s+)*(class|mixin)\s+([A-Za-z_][A-Za-z0-9_]*)(.*)$/);
    if (match == null) {
      return false;
    }

    const kind = typeKind(typeDef);
    if (kind == null) {
      return false;
    }

    const name = String(typeDef.name());
    const indent = match[1];
    const suffix = match[4] ?? "";
    const modifiers = buildTypeModifierPrefix(typeDef);
    lines[idx] = `${indent}${modifiers}${kind} ${name}${suffix}`;
    return true;
  };

  unit.types().each((typeDef) => {
    const loc = typeDef.loc?.();
    const lineNum = loc?.line?.();
    if (lineNum == null) {
      return;
    }

    const target = lineNum - 1;
    if (applyAt(target, typeDef)) {
      return;
    }

    // If earlier rewrites changed line alignment, try a tiny local window.
    for (let delta = -2; delta <= 2; delta += 1) {
      if (delta === 0) {
        continue;
      }
      if (applyAt(target + delta, typeDef)) {
        return;
      }
    }
    return;
  });

  return `${lines.join("\n")}\n`;
}

const SLOT_MODIFIER_ORDER = [
  "public",
  "protected",
  "private",
  "internal",
  "abstract",
  "override",
  "static",
  "native",
  "final",
  "const",
  "virtual",
  "readonly",
  "once",
];

const SLOT_MODIFIER_SET = new Set(SLOT_MODIFIER_ORDER);

function normalizeLeadingModifiersOnLine(line) {
  const match = line.match(/^(\s*)(.*)$/);
  if (match == null) {
    return line;
  }

  const indent = match[1];
  const body = match[2];
  if (!body) {
    return line;
  }

  const parts = body.split(/\s+/);
  const consumed = [];
  let i = 0;
  while (i < parts.length && SLOT_MODIFIER_SET.has(parts[i])) {
    consumed.push(parts[i]);
    i += 1;
  }

  if (consumed.length <= 1) {
    return line;
  }

  const orderIndex = new Map(SLOT_MODIFIER_ORDER.map((m, idx) => [m, idx]));
  const seen = new Set();
  const sorted = consumed
    .filter((m) => {
      if (seen.has(m)) {
        return false;
      }
      seen.add(m);
      return true;
    })
    .sort((a, b) => (orderIndex.get(a) ?? 999) - (orderIndex.get(b) ?? 999));

  const rest = parts.slice(i).join(" ");
  if (!rest) {
    return line;
  }

  return `${indent}${sorted.join(" ")} ${rest}`;
}

function rewriteSlotHeadersWithAst(formatted, ast) {
  const unit = ast?.unit;
  if (unit == null) {
    return formatted;
  }

  const lines = formatted.replace(/\n$/, "").split("\n");

  const tryNormalizeAt = (idx) => {
    if (idx < 0 || idx >= lines.length) {
      return false;
    }
    const line = lines[idx];
    const trimmed = line.trimStart();
    if (trimmed === "" || trimmed.startsWith("@") || trimmed.startsWith("//")) {
      return false;
    }
    const updated = normalizeLeadingModifiersOnLine(line);
    if (updated !== line) {
      lines[idx] = updated;
      return true;
    }
    return false;
  };

  unit.types().each((typeDef) => {
    typeDef.slotDefs().each((slotDef) => {
      if (typeof slotDef.isSynthetic === "function" && slotDef.isSynthetic()) {
        return;
      }
      if (typeof slotDef.isFieldAccessor === "function" && slotDef.isFieldAccessor()) {
        return;
      }
      if (typeof slotDef.isStaticInit === "function" && slotDef.isStaticInit()) {
        return;
      }
      if (typeof slotDef.isInstanceInit === "function" && slotDef.isInstanceInit()) {
        return;
      }

      const loc = slotDef.loc?.();
      const lineNum = loc?.line?.();
      if (lineNum == null) {
        return;
      }

      const target = lineNum - 1;
      if (tryNormalizeAt(target)) {
        return;
      }
      for (let delta = -2; delta <= 2; delta += 1) {
        if (delta === 0) {
          continue;
        }
        if (tryNormalizeAt(target + delta)) {
          return;
        }
      }
      return;
    });
    return;
  });

  return `${lines.join("\n")}\n`;
}

function findMatchingParenOnLine(text, openIndex) {
  let depth = 0;
  let inDouble = false;
  let inBacktick = false;
  let inChar = false;

  for (let i = openIndex; i < text.length; i += 1) {
    const ch = text[i];
    const prev = i > 0 ? text[i - 1] : "";

    if (inDouble) {
      if (ch === '"' && prev !== "\\") {
        inDouble = false;
      }
      continue;
    }
    if (inBacktick) {
      if (ch === "`" && prev !== "\\") {
        inBacktick = false;
      }
      continue;
    }
    if (inChar) {
      if (ch === "'" && prev !== "\\") {
        inChar = false;
      }
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      continue;
    }
    if (ch === "`") {
      inBacktick = true;
      continue;
    }
    if (ch === "'") {
      inChar = true;
      continue;
    }

    if (ch === "(") {
      depth += 1;
      continue;
    }
    if (ch === ")") {
      depth -= 1;
      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

function splitTopLevelParams(paramText) {
  const parts = [];
  let current = "";
  let p = 0;
  let b = 0;
  let c = 0;
  let inDouble = false;
  let inBacktick = false;
  let inChar = false;

  for (let i = 0; i < paramText.length; i += 1) {
    const ch = paramText[i];
    const prev = i > 0 ? paramText[i - 1] : "";

    if (inDouble) {
      current += ch;
      if (ch === '"' && prev !== "\\") inDouble = false;
      continue;
    }
    if (inBacktick) {
      current += ch;
      if (ch === "`" && prev !== "\\") inBacktick = false;
      continue;
    }
    if (inChar) {
      current += ch;
      if (ch === "'" && prev !== "\\") inChar = false;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      current += ch;
      continue;
    }
    if (ch === "`") {
      inBacktick = true;
      current += ch;
      continue;
    }
    if (ch === "'") {
      inChar = true;
      current += ch;
      continue;
    }

    if (ch === "(") p += 1;
    else if (ch === ")") p -= 1;
    else if (ch === "[") b += 1;
    else if (ch === "]") b -= 1;
    else if (ch === "{") c += 1;
    else if (ch === "}") c -= 1;

    if (ch === "," && p === 0 && b === 0 && c === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  if (current.trim() !== "") {
    parts.push(current.trim());
  }

  return parts;
}

function normalizeParamSegment(segment) {
  return segment
    .replace(/\s*:=\s*/g, " := ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizeMethodHeaderLine(line) {
  const trimmed = line.trimStart();
  if (
    !trimmed.startsWith("new ") &&
    !trimmed.includes("Void ") &&
    !trimmed.includes(" Bool ") &&
    !trimmed.includes(" Int ")
  ) {
    // Cheap fast-path; if it still contains params but no common signature markers,
    // leave it untouched.
    if (!/[A-Za-z_][A-Za-z0-9_]*\s*\(/.test(trimmed)) {
      return line;
    }
  }

  const open = line.indexOf("(");
  if (open < 0) {
    return line;
  }

  const close = findMatchingParenOnLine(line, open);
  if (close < 0) {
    return line;
  }

  const before = line.slice(0, open + 1);
  const inside = line.slice(open + 1, close);
  const after = line.slice(close);

  const params = splitTopLevelParams(inside).map(normalizeParamSegment).join(", ");
  return `${before}${params}${after}`;
}

function codePortionEnd(line) {
  const split = splitCodeAndComment(line, { inBlockComment: false, inTripleString: false });
  return split.code.length;
}

function rewriteMethodSignaturesWithAst(formatted, source, ast) {
  const unit = ast?.unit;
  if (unit == null) {
    return formatted;
  }

  const lines = formatted.replace(/\n$/, "").split("\n");
  const sourceLines = normalizeNewlines(source).replace(/\n$/, "").split("\n");

  const normalizeAt = (idx, replacement, slotName) => {
    if (idx < 0 || idx >= lines.length) {
      return false;
    }
    const original = lines[idx];
    const indent = (original.match(/^\s*/) ?? [""])[0];
    const split = splitCodeAndComment(original, { inBlockComment: false, inTripleString: false });
    const codeTrim = split.code.trim();
    if (codeTrim === "") {
      return false;
    }
    if (/^(class|mixin|enum|facet)\b/.test(codeTrim)) {
      return false;
    }
    if (codeTrim.startsWith("}")) {
      return false; // never rewrite a line beginning with a closing brace
    }
    if (!new RegExp(`\\b${slotName}\\s*\\(`).test(codeTrim)) {
      return false;
    }
    const rebuilt = `${indent}${(codeTrim.match(/^(?:@\w+\s+)+/) ?? [""])[0]}${replacement.trim()}`;
    const updated = split.comment ? `${rebuilt} ${split.comment.trimStart()}` : rebuilt;
    if (updated !== original.trimEnd()) {
      lines[idx] = updated;
      return true;
    }
    return false;
  };

  const sourceSignatureForMethod = (slotDef) => {
    const lineNum = slotDef.loc?.()?.line?.();
    const colNum = slotDef.loc?.()?.col?.();
    if (lineNum == null || colNum == null) {
      return null;
    }
    // The Fantom AST's loc() for a method with facets points to the first facet line.
    // Two cases:
    //   (a) Facet on its own line: "@DbTest" → skip forward to the next non-facet line
    //   (b) Inline facet on the same line: "@Js Void foo()" → strip leading @Token tokens
    for (let offset = 0; offset <= 5; offset++) {
      const sourceLine = sourceLines[lineNum - 1 + offset] ?? "";
      const start = offset === 0 ? Math.max(0, colNum - 1) : 0;
      const end = codePortionEnd(sourceLine);
      if (start >= end) continue;
      const snippet = sourceLine.slice(start, end).trimRight();
      if (snippet === "") continue;
      // Strip any leading inline facets (@Identifier followed by whitespace)
      const stripped = snippet.replace(/^(?:@\w+\s+)+/, "");
      if (stripped === "") {
        // Line was entirely facet annotations — advance to next line
        continue;
      }
      if (stripped.trimStart().startsWith("@")) {
        // Still starts with a facet (no trailing space), skip this line
        continue;
      }
      return normalizeMethodHeaderLine(stripped);
    }
    return null;
  };

  unit.types().each((typeDef) => {
    typeDef.slotDefs().each((slotDef) => {
      if (slotDef.typeof().name() !== "MethodDef") {
        return;
      }
      if (typeof slotDef.isSynthetic === "function" && slotDef.isSynthetic()) {
        return;
      }
      if (typeof slotDef.isFieldAccessor === "function" && slotDef.isFieldAccessor()) {
        return;
      }
      if (typeof slotDef.isStaticInit === "function" && slotDef.isStaticInit()) {
        return;
      }
      if (typeof slotDef.isInstanceInit === "function" && slotDef.isInstanceInit()) {
        return;
      }

      const signature = sourceSignatureForMethod(slotDef);
      if (signature == null) {
        return;
      }

      const lineNum = slotDef.loc?.()?.line?.();
      if (lineNum == null) {
        return;
      }

      // target is in formatted-line space. Earlier passes may have changed the line count
      // vs the original source, so search ±3 lines around the nominal target to find the
      // actual signature line (the same heuristic used by rewriteSlotHeadersWithAst).
      const target = lineNum - 1;
      if (!normalizeAt(target, signature, String(slotDef.name()))) {
        // The AST loc() for a facet-annotated method points to the first facet line.
        // Facets always appear BEFORE the signature, so only search forward.
        for (let delta = 1; delta <= 5; delta++) {
          if (normalizeAt(target + delta, signature, String(slotDef.name()))) break;
        }
      }
      return;
    });
    return;
  });

  return `${lines.join("\n")}\n`;
}

function normalizeFieldDeclarationLine(line) {
  return line
    .replace(/\s*:=\s*/g, " := ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function rewriteFieldDeclarationsWithAst(formatted, source, ast) {
  const unit = ast?.unit;
  if (unit == null) {
    return formatted;
  }

  const lines = formatted.replace(/\n$/, "").split("\n");
  const sourceLines = normalizeNewlines(source).replace(/\n$/, "").split("\n");

  const applyAt = (idx, replacement, slotName) => {
    if (idx < 0 || idx >= lines.length) {
      return false;
    }
    const original = lines[idx];
    const indent = (original.match(/^\s*/) ?? [""])[0];
    const split = splitCodeAndComment(original, { inBlockComment: false, inTripleString: false });
    const codeTrim = split.code.trim();
    if (codeTrim === "") {
      return false;
    }
    if (/^(class|mixin|enum|facet)\b/.test(codeTrim)) {
      return false;
    }
    if (!new RegExp(`\\b${slotName}\\b`).test(codeTrim)) {
      return false;
    }
    const rebuilt = `${indent}${replacement}`;
    const updated = split.comment ? `${rebuilt} ${split.comment.trimStart()}` : rebuilt;
    if (updated !== original.trimEnd()) {
      lines[idx] = updated;
      return true;
    }
    return false;
  };

  unit.types().each((typeDef) => {
    typeDef.slotDefs().each((slotDef) => {
      if (slotDef.typeof().name() !== "FieldDef") {
        return;
      }
      if (typeof slotDef.isSynthetic === "function" && slotDef.isSynthetic()) {
        return;
      }

      const lineNum = slotDef.loc?.()?.line?.();
      const colNum = slotDef.loc?.()?.col?.();
      if (lineNum == null || colNum == null) {
        return;
      }

      const sourceLine = sourceLines[lineNum - 1] ?? "";
      const start = Math.max(0, colNum - 1);
      const end = codePortionEnd(sourceLine);
      if (start >= end) {
        return;
      }
      const snippet = sourceLine.slice(start, end);
      const normalized = normalizeFieldDeclarationLine(snippet);
      if (normalized === "") {
        return;
      }

      const target = lineNum - 1;
      applyAt(target, normalized, String(slotDef.name()));
      return;
    });
    return;
  });

  return `${lines.join("\n")}\n`;
}

/**
 * Detects unbraced try/catch/finally bodies (e.g. "try\n  stmt\nfinally") and
 * wraps each body with braces so the final formatFantom reflow can indent them
 * correctly.  Must run AFTER all other structural rewrites but BEFORE finalReflow.
 */
function rewriteUnbracedControlBodies(formatted, options = {}) {
  const lines = formatted.replace(/\n$/, "").split("\n");
  const out = [];
  const state = { inBlockComment: false, inTripleString: false };

  // Pattern: a line whose code portion is solely a control keyword (no trailing {).
  const CONTROL_CONTINUATION = /^(finally\s*$|catch\b)/;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Parse code vs comment (advancing multi-line state).
    const split = splitCodeAndComment(line, state);
    const code = split.code.trimEnd();

    // Match bare control keywords with no trailing brace.
    const m = code.match(/^(\s*)(try|finally|catch\s*(?:\([^)]*\))?)\s*$/);
    if (m != null && !code.endsWith("{")) {
      const indent = m[1];
      const indentLen = indent.length;

      // If the very next line is '{', the brace is already there — leave it alone.
      const nextTrimmed = (lines[i + 1] ?? "").trim();
      if (nextTrimmed === "{") {
        out.push(line);
        i += 1;
        continue;
      }

      // Collect body lines: consecutive non-blank lines at >= same indent that are
      // NOT a control-continuation keyword at the exact same indent.
      // We stop at blank lines because the code after the try/finally body is
      // typically separated from it by a blank line in the formatted output.
      const body = [];
      let j = i + 1;
      while (j < lines.length) {
        const bodyLine = lines[j];
        const bodyTrimmed = bodyLine.trim();

        // A blank line means the body is done.
        if (bodyTrimmed === "") {
          break;
        }

        const bodyIndentLen = bodyLine.match(/^(\s*)/)[1].length;

        // A shallower indent means we hit the method/class closing brace.
        if (bodyIndentLen < indentLen) {
          break;
        }
        // Same indent + continuation keyword (finally, catch) → end of body.
        if (bodyIndentLen === indentLen && CONTROL_CONTINUATION.test(bodyTrimmed)) {
          break;
        }
        // Same indent + standalone } → end of body (handles edge cases).
        if (bodyIndentLen === indentLen && bodyTrimmed === "}") {
          break;
        }

        body.push(bodyLine);
        j += 1;
      }

      // Only insert braces if we captured at least one real statement.
      const nonEmpty = body.filter((l) => l.trim() !== "");
      if (nonEmpty.length > 0) {
        out.push(line); // the keyword line itself
        out.push(`${indent}{`);
        for (const bl of body) {
          out.push(bl);
        }
        out.push(`${indent}}`);
        i = j;
        continue;
      }
    }

    // Preserve indentation for unbraced single-statement control bodies:
    // if (...)\nstmt
    const ctl = code.match(/^(\s*)(if|for|while)\b.*\)\s*$/);
    if (ctl != null && !code.endsWith("{")) {
      const indent = ctl[1];
      const indentLen = indent.length;
      const next = lines[i + 1] ?? "";
      const nextTrimmed = next.trim();

      if (
        nextTrimmed !== "" &&
        nextTrimmed !== "{" &&
        nextTrimmed !== "}" &&
        !/^(else\b|catch\b|finally\b)/.test(nextTrimmed)
      ) {
        const nextIndentLen = (next.match(/^(\s*)/) ?? ["", ""])[1].length;
        if (nextIndentLen <= indentLen) {
          const bodyIndent = `${indent}${makeIndent(1, options)}`;
          out.push(line);
          out.push(`${bodyIndent}${next.trimStart()}`);
          i += 2;
          continue;
        }
      }
    }

    out.push(line);
    i += 1;
  }

  return `${out.join("\n")}\n`;
}

function rewriteControlBraceStyle(formatted) {
  const lines = formatted.replace(/\n$/, "").split("\n");
  const out = [];
  const state = { inBlockComment: false, inTripleString: false };

  for (const line of lines) {
    const split = splitCodeAndComment(line, state);
    const code = split.code;
    const comment = split.comment;
    const match = code.match(/^(\s*)(if|for|while|switch|catch|else|try|finally)\b(.*)\{\s*$/);

    if (match != null) {
      const indent = match[1];
      const keyword = match[2];
      const rest = (match[3] ?? "").replace(/\s+$/g, "");
      const header = `${indent}${keyword}${rest}`;
      out.push(comment ? `${header} ${comment.trimStart()}` : header);
      out.push(`${indent}{`);
      continue;
    }

    out.push(line);
  }

  return `${out.join("\n")}\n`;
}

function collectControlHeaderNodes(ast) {
  const out = [];
  const unit = ast?.unit;
  if (unit == null) {
    return out;
  }

  const pushNode = (keyword, loc) => {
    const line = loc?.line?.();
    const col = loc?.col?.();
    if (line == null || col == null) {
      return;
    }
    out.push({ keyword, line, col });
  };

  const walkBlock = (block) => {
    if (block == null || typeof block.stmts !== "function") {
      return;
    }
    const stmts = block.stmts();
    for (let i = 0; i < stmts.size(); i += 1) {
      const stmt = stmts.get(i);
      const t = stmt.typeof().name();
      if (t === "IfStmt") {
        pushNode("if", stmt.loc?.());
      } else if (t === "ForStmt") {
        pushNode("for", stmt.loc?.());
      } else if (t === "WhileStmt") {
        pushNode("while", stmt.loc?.());
      } else if (t === "SwitchStmt") {
        pushNode("switch", stmt.loc?.());
      } else if (t === "TryStmt") {
        pushNode("try", stmt.loc?.());
      }

      if (typeof stmt.trueBlock === "function") walkBlock(stmt.trueBlock());
      if (typeof stmt.falseBlock === "function") walkBlock(stmt.falseBlock());
      if (typeof stmt.block === "function") walkBlock(stmt.block());
      if (typeof stmt.finallyBlock === "function") walkBlock(stmt.finallyBlock());
      if (typeof stmt.defaultBlock === "function") walkBlock(stmt.defaultBlock());

      if (typeof stmt.cases === "function") {
        const cases = stmt.cases();
        for (let j = 0; j < cases.size(); j += 1) {
          const c = cases.get(j);
          if (typeof c.block === "function") walkBlock(c.block());
        }
      }

      if (typeof stmt.catches === "function") {
        const catches = stmt.catches();
        for (let j = 0; j < catches.size(); j += 1) {
          const c = catches.get(j);
          pushNode("catch", c.loc?.());
          if (typeof c.block === "function") walkBlock(c.block());
        }
      }
    }
  };

  unit.types().each((typeDef) => {
    typeDef.slotDefs().each((slotDef) => {
      if (slotDef.typeof().name() !== "MethodDef") {
        return;
      }
      if (typeof slotDef.isSynthetic === "function" && slotDef.isSynthetic()) {
        return;
      }
      if (typeof slotDef.code === "function") {
        walkBlock(slotDef.code());
      }
      return;
    });
    return;
  });

  return out;
}

function collectSingleLineControlBodyNodes(ast) {
  const out = [];
  const unit = ast?.unit;
  if (unit == null) {
    return out;
  }

  const pushIfInlineBody = (keyword, stmtLoc, block) => {
    const stmtLine = stmtLoc?.line?.();
    const stmtCol = stmtLoc?.col?.();
    const blockLine = block?.loc?.()?.line?.();
    const blockStmts = block?.stmts?.();
    if (stmtLine == null || stmtCol == null || blockLine == null || blockStmts == null) {
      return;
    }
    if (stmtLine !== blockLine) {
      return;
    }
    if (blockStmts.size() !== 1) {
      return;
    }
    out.push({ keyword, line: stmtLine, col: stmtCol });
  };

  const walkBlock = (block) => {
    if (block == null || typeof block.stmts !== "function") {
      return;
    }
    const stmts = block.stmts();
    for (let i = 0; i < stmts.size(); i += 1) {
      const stmt = stmts.get(i);
      const t = stmt.typeof().name();

      if (t === "IfStmt") {
        if (typeof stmt.trueBlock === "function") {
          pushIfInlineBody("if", stmt.loc?.(), stmt.trueBlock());
        }

        if (typeof stmt.falseBlock === "function") {
          const falseBlock = stmt.falseBlock();
          const falseStmts = falseBlock?.stmts?.();
          if (falseStmts != null && falseStmts.size() === 1) {
            const firstFalseStmt = falseStmts.first();
            if (firstFalseStmt?.typeof?.()?.name?.() !== "IfStmt") {
              const falseLine = falseBlock?.loc?.()?.line?.();
              const falseCol = falseBlock?.loc?.()?.col?.();
              if (falseLine != null && falseCol != null) {
                out.push({ keyword: "else", line: falseLine, col: falseCol });
              }
            }
          }
        }
      } else if (t === "ForStmt") {
        if (typeof stmt.block === "function") {
          pushIfInlineBody("for", stmt.loc?.(), stmt.block());
        }
      } else if (t === "WhileStmt") {
        if (typeof stmt.block === "function") {
          pushIfInlineBody("while", stmt.loc?.(), stmt.block());
        }
      }

      if (typeof stmt.trueBlock === "function") walkBlock(stmt.trueBlock());
      if (typeof stmt.falseBlock === "function") walkBlock(stmt.falseBlock());
      if (typeof stmt.block === "function") walkBlock(stmt.block());
      if (typeof stmt.finallyBlock === "function") walkBlock(stmt.finallyBlock());
      if (typeof stmt.defaultBlock === "function") walkBlock(stmt.defaultBlock());

      if (typeof stmt.cases === "function") {
        const cases = stmt.cases();
        for (let j = 0; j < cases.size(); j += 1) {
          const c = cases.get(j);
          if (typeof c.block === "function") walkBlock(c.block());
        }
      }

      if (typeof stmt.catches === "function") {
        const catches = stmt.catches();
        for (let j = 0; j < catches.size(); j += 1) {
          const c = catches.get(j);
          if (typeof c.block === "function") walkBlock(c.block());
        }
      }
    }
  };

  unit.types().each((typeDef) => {
    typeDef.slotDefs().each((slotDef) => {
      if (slotDef.typeof().name() !== "MethodDef") {
        return;
      }
      if (typeof slotDef.isSynthetic === "function" && slotDef.isSynthetic()) {
        return;
      }
      if (typeof slotDef.code === "function") {
        walkBlock(slotDef.code());
      }
      return;
    });
    return;
  });

  return out;
}

function rewriteSingleLineControlBodiesWithAst(formatted, ast, options) {
  const nodes = collectSingleLineControlBodyNodes(ast);
  if (nodes.length === 0) {
    return formatted;
  }

  const lines = formatted.replace(/\n$/, "").split("\n");
  const sorted = nodes.slice().sort((a, b) => b.line - a.line || b.col - a.col);

  const tryRewriteAt = (idx, node) => {
    if (idx < 0 || idx >= lines.length) {
      return false;
    }

    const original = lines[idx];
    const split = splitCodeAndComment(original, { inBlockComment: false, inTripleString: false });
    const code = split.code;
    const comment = split.comment;
    const keywordRe = new RegExp(`\\b${node.keyword}\\b`);
    const keywordMatch = code.match(keywordRe);
    if (keywordMatch == null || keywordMatch.index == null) {
      return false;
    }
    const keywordStart = keywordMatch.index;

    let after = "";
    let header = "";

    if (node.keyword === "else") {
      after = code.slice(keywordStart + node.keyword.length).trim();
      if (after === "" || after.startsWith("{") || /^if\b/.test(after)) {
        return false;
      }
      header = code.slice(0, keywordStart + node.keyword.length).trimEnd();
      if (!/\belse\b/.test(header)) {
        return false;
      }
    } else {
      const openParen = code.indexOf("(", keywordStart + node.keyword.length);
      if (openParen < 0) {
        return false;
      }
      const closeParen = findMatchingParenOnLine(code, openParen);
      if (closeParen < 0) {
        return false;
      }

      after = code.slice(closeParen + 1).trim();
      if (after === "" || after.startsWith("{")) {
        return false;
      }

      header = code.slice(0, closeParen + 1).trimEnd();
      if (!new RegExp(`\\b${node.keyword}\\s*\\(`).test(header)) {
        return false;
      }
    }

    const indent = (header.match(/^\s*/) ?? [""])[0];
    const bodyIndent = `${indent}${makeIndent(1, options ?? {})}`;
    const headerWithComment = comment ? `${header} ${comment.trimStart()}` : header;

    lines.splice(idx, 1, headerWithComment, `${indent}{`, `${bodyIndent}${after}`, `${indent}}`);
    return true;
  };

  for (const node of sorted) {
    const target = node.line - 1;
    if (tryRewriteAt(target, node)) {
      continue;
    }

    for (let delta = -3; delta <= 3; delta += 1) {
      if (delta === 0) {
        continue;
      }
      if (tryRewriteAt(target + delta, node)) {
        break;
      }
    }
  }

  return `${lines.join("\n")}\n`;
}

function rewriteControlHeadersWithAst(formatted, ast) {
  const nodes = collectControlHeaderNodes(ast);
  if (nodes.length === 0) {
    return formatted;
  }

  const lines = formatted.replace(/\n$/, "").split("\n");
  const sorted = nodes.slice().sort((a, b) => b.line - a.line || b.col - a.col);

  for (const node of sorted) {
    const idx = node.line - 1;
    if (idx < 0 || idx >= lines.length) {
      continue;
    }

    const original = lines[idx];
    const split = splitCodeAndComment(original, { inBlockComment: false, inTripleString: false });
    const code = split.code;
    const comment = split.comment;
    const start = Math.max(0, node.col - 1);
    if (start >= code.length) {
      continue;
    }

    const braceIdx = code.indexOf("{", start);
    if (braceIdx < 0) {
      continue;
    }

    const afterBrace = code.slice(braceIdx + 1).trim();
    if (afterBrace !== "") {
      continue;
    }

    const header = code.slice(0, braceIdx).trimEnd();
    if (header.trimStart() === "") {
      continue;
    }

    const headerNorm =
      node.keyword === "if" ||
      node.keyword === "for" ||
      node.keyword === "while" ||
      node.keyword === "switch" ||
      node.keyword === "catch"
        ? header.replace(new RegExp(`\\b${node.keyword}\\s*\\(`), `${node.keyword} (`)
        : header;

    const indent = (headerNorm.match(/^\s*/) ?? [""])[0];
    lines[idx] = comment ? `${headerNorm} ${comment.trimStart()}` : headerNorm;
    lines.splice(idx + 1, 0, `${indent}{`);
  }

  return `${lines.join("\n")}\n`;
}

export function formatFantom(source, ast, options = {}) {
  const base = formatFantomBase(source, options);
  const phaseChanges = {};
  const phaseChangedLines = {};

  const changedLineNumbers = (before, after) => {
    const a = before.replace(/\n$/, "").split("\n");
    const b = after.replace(/\n$/, "").split("\n");
    const max = Math.max(a.length, b.length);
    const out = [];
    for (let i = 0; i < max; i += 1) {
      if ((a[i] ?? "") !== (b[i] ?? "")) {
        out.push(i + 1);
      }
    }
    return out;
  };

  const applyPhase = (name, current, fn) => {
    const next = fn(current);
    phaseChanges[name] = next !== current;
    if (options?.fantomDebugAstPass === true) {
      phaseChangedLines[name] = phaseChanges[name] ? changedLineNumbers(current, next) : [];
    }
    return next;
  };

  const astGuided = applyPhase(
    "slotHeaders",
    applyPhase(
      "fieldDecls",
      applyPhase(
        "methodSigs",
        applyPhase(
          "typeHeaders",
          applyPhase("usingBlock", base, (v) => rewriteUsingBlockWithAst(v, ast)),
          (v) => rewriteTypeHeadersWithAst(v, ast),
        ),
        (v) => rewriteMethodSignaturesWithAst(v, source, ast),
      ),
      (v) => rewriteFieldDeclarationsWithAst(v, source, ast),
    ),
    (v) => rewriteSlotHeadersWithAst(v, ast),
  );

  // Apply statement-brace shaping, then run one more formatting pass to normalize
  // indentation and spacing after structural rewrites.
  const transitionShaped = applyPhase("controlTransitions", astGuided, (v) => rewriteControlTransitions(v));
  const bodyShaped = applyPhase("controlBodiesAst", transitionShaped, (v) =>
    rewriteSingleLineControlBodiesWithAst(v, ast, options),
  );
  const astBraceShaped = applyPhase("controlHeadersAst", bodyShaped, (v) => rewriteControlHeadersWithAst(v, ast));
  const braceShaped = applyPhase("controlBraces", astBraceShaped, (v) => rewriteControlBraceStyle(v));
  const unbracedFixed = applyPhase("unbracedBodies", braceShaped, (v) => rewriteUnbracedControlBodies(v, options));
  const closeSplit = applyPhase("closeBraceSplit", unbracedFixed, (v) => splitCloseBraceContinuations(v));
  const finalText = applyPhase("finalReflow", closeSplit, (v) => formatFantomBase(v, options));

  if (options?.fantomDebugAstPass === true) {
    const changedEntries = Object.entries(phaseChanges)
      .filter(([, v]) => v)
      .map(([k]) => {
        const lines = phaseChangedLines[k] ?? [];
        if (lines.length === 0) {
          return k;
        }
        const preview = lines.slice(0, 12).join(",");
        const suffix = lines.length > 12 ? ",..." : "";
        return `${k}[L${preview}${suffix}]`;
      })
      .join(", ");
    const file = ast?.filepath ?? "<unknown>";
    const changedText = changedEntries === "" ? "none" : changedEntries;
    console.error(`[fantom-ast] ${file} changed phases: ${changedText}`);
  }

  return finalText;
}
