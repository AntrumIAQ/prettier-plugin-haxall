/**
 * Converts the raw Fantom compiler AST (from parseFantom) into a clean JS
 * object tree. Each structural node carries startLine / endLine (1-based)
 * so the printer can locate corresponding source text.
 *
 * Does NOT recurse into method bodies — those are handled by the printer via
 * source-extraction on demand.
 */

import { shortType } from "./short-type.js";

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function buildFantomAst(parseResult) {
  const { unit, originalText, shebang, parseError, filepath, compiler } = parseResult;

  if (!unit || parseError) {
    return {
      type: "FantomFile",
      shebang: shebang ?? "",
      usings: [],
      types: [],
      originalText,
      filepath: filepath ?? null,
      parseError,
    };
  }

  const sourceLines = originalText.split("\n");
  const totalLines = sourceLines.length;

  const usings = buildUsings(unit, totalLines);
  const types = buildTypes(unit, sourceLines, totalLines, compiler ?? null);

  return {
    type: "FantomFile",
    shebang: shebang ?? "",
    usings,
    types,
    originalText,
    sourceLines,
    filepath: filepath ?? null,
    parseError: null,
  };
}

// ---------------------------------------------------------------------------
// Usings
// ---------------------------------------------------------------------------

function buildUsings(unit, totalLines) {
  const result = [];
  unit.usings().each((u) => {
    const podName = String(u.podName());
    // Skip implicitly-added `sys` using — the compiler adds it but it's not in source
    if (podName === "sys") return;
    const startLine = u.loc().line();
    result.push({
      type: "UsingDef",
      podName,
      typeName: u.typeName() ? String(u.typeName()) : null,
      asName: u.asName() ? String(u.asName()) : null,
      startLine,
      endLine: startLine,
    });
  });
  return result;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

function buildTypes(unit, sourceLines, totalLines, compiler) {
  const result = [];
  const allTypeDefs = [];
  unit.types().each((td) => allTypeDefs.push(td));

  allTypeDefs.forEach((td, idx) => {
    const nextTd = allTypeDefs[idx + 1];
    const nextStartLine = nextTd ? nextTd.loc().line() : totalLines + 1;
    result.push(buildTypeDef(td, sourceLines, nextStartLine, compiler));
  });

  return result;
}

function buildTypeDef(td, sourceLines, nextTypeStartLine, compiler) {
  const startLine = td.loc().line();

  // Collect the facets for this type
  const facets = buildFacets(td, sourceLines);

  // The actual type keyword line is after all facets
  const facetCount = facets.length;
  const headerLine = facetCount > 0
    ? facets[facetCount - 1].startLine + 1
    : startLine;

  // Find the type body's closing brace line before building slots, so the last
  // slot's endLine search is capped at the type `}` (not the next type's start).
  const endLine = findTypeEndLine(sourceLines, headerLine, nextTypeStartLine - 1);

  // Collect slots
  const allSlots = [];
  td.slots().each((s) => allSlots.push(s));

  allSlots.sort((a, b) => a.loc().line() - b.loc().line());

  const slots = allSlots.map((slot, idx) => {
    const nextSlot = allSlots[idx + 1];
    // For the last slot, cap at the type's `}` to avoid picking it up as the slot end.
    const nextSlotStartLine = nextSlot ? nextSlot.loc().line() : endLine;
    return buildSlot(slot, sourceLines, nextSlotStartLine, compiler);
  });
  const bodyOpenLine = findTypeBodyOpenLine(sourceLines, headerLine, endLine);

  return {
    type: "TypeDef",
    name: String(td.name()),
    base: buildBaseClass(td, sourceLines, headerLine),
    mixins: buildMixins(td),
    facets,
    flags: buildTypeFlags(td),
    slots,
    startLine,
    headerLine,
    bodyOpenLine,
    endLine,
  };
}

function buildBaseClass(td, sourceLines, headerLine) {
  let base = null;
  try {
    if (td.base()) {
      base = shortType(td.base().toStr());
    }
  } catch (_) {}

  // The compiler may return Void when the base class can't be resolved at parse-only
  // time (e.g. a type from another pod not in the lib path). In that case, check
  // whether the source actually declares a base class and extract it directly.
  if (base === "Void" || base === null) {
    let baseSpecified = false;
    try { baseSpecified = !!td.baseSpecified?.(); } catch (_) {}
    if (baseSpecified || base === "Void") {
      const headerSrc = sourceLines[headerLine - 1] ?? "";
      const colonMatch = headerSrc.match(/:\s*([A-Za-z_][\w:]*)/);
      if (colonMatch) {
        base = colonMatch[1];
      }
    }
  }
  return base;
}

function buildMixins(td) {
  const result = [];
  try {
    td.mixins().each((m) => result.push(shortType(m.toStr())));
  } catch (_) {}
  return result;
}

function buildTypeFlags(td) {
  // Canonical Fantom type modifier order (Fantom conventions):
  // abstract, [scope: internal], [storage: native], [special: final, const]
  // Keyword markers (enum, mixin, facet) come last — used by typeKeyword() to pick the class keyword.
  // Note: mixins are implicitly abstract in Fantom; never emit "abstract" before "mixin".
  const isMixin = (() => { try { return td.isMixin(); } catch (_) { return false; } })();
  const flags = [];
  if (!isMixin) try { if (td.isAbstract()) flags.push("abstract"); } catch (_) {}
  try { if (td.isInternal()) flags.push("internal"); } catch (_) {}
  try { if (td.isNative()) flags.push("native"); } catch (_) {}
  try { if (td.isFinal()) flags.push("final"); } catch (_) {}
  try { if (td.isConst()) flags.push("const"); } catch (_) {}
  try { if (td.isEnum()) flags.push("enum"); } catch (_) {}
  try { if (isMixin) flags.push("mixin"); } catch (_) {}
  try { if (td.isFacet()) flags.push("facet"); } catch (_) {}
  return flags;
}

function findTypeEndLine(sourceLines, fromLine, maxLine) {
  // Scan backwards from maxLine to find the `}` that closes the type
  for (let i = Math.min(maxLine, sourceLines.length) - 1; i >= fromLine; i--) {
    const trimmed = sourceLines[i].trim();
    if (trimmed === "}") return i + 1; // 1-based
  }
  return maxLine;
}

// ---------------------------------------------------------------------------
// Slots (MethodDef / FieldDef)
// ---------------------------------------------------------------------------

function buildSlot(slot, sourceLines, nextSlotStartLine, compiler) {
  const startLine = slot.loc().line();
  const facets = buildFacets(slot, sourceLines);
  const flags = buildSlotFlags(slot);

  // Determine if this is a method or field
  const isMethod = isMethodDef(slot);

  if (isMethod) {
    return buildMethodDef(slot, facets, flags, sourceLines, startLine, nextSlotStartLine, compiler);
  } else {
    return buildFieldDef(slot, facets, flags, sourceLines, startLine, nextSlotStartLine);
  }
}

function isMethodDef(slot) {
  try {
    slot.returnType();
    return true;
  } catch (_) {
    return false;
  }
}

function buildMethodDef(slot, facets, flags, sourceLines, startLine, nextSlotStartLine, compiler) {
  const name = String(slot.name());
  const returnType = shortType(slot.returnType().toStr());

  // Parameters
  const params = buildParams(slot);

  // Extract source param list text to preserve closure type named params (e.g. |Str name|).
  // Fantom's paramType().toStr() strips named params inside |...|, so we use the source line.
  // Also handles multi-line param lists by scanning across source lines.
  let sourceParamList = null;
  try {
    // Find the line containing `name(` — scan from startLine forward in case facets are
    // on preceding lines. Start at startLine (handles inline facets on same line as sig)
    // and advance at most to startLine+facets.length+1 for preceding-line facets.
    const scanEnd = Math.min(startLine + facets.length + 2, sourceLines.length);
    let sigLine = startLine;
    for (let li = startLine - 1; li < scanEnd; li++) {
      if ((sourceLines[li] || "").includes(`${name}(`)) { sigLine = li + 1; break; }
    }
    const srcLine = sourceLines[sigLine - 1] || "";
    const nameIdx = srcLine.indexOf(`${name}(`);
    if (nameIdx !== -1) {
      const openParen = nameIdx + name.length;
      // Find the matching close paren, potentially spanning multiple lines
      let depth = 0;
      let closeParen = -1;
      let paramText = "";
      outer: for (let li = sigLine - 1; li < Math.min(sigLine + 10, sourceLines.length); li++) {
        const scanLine = sourceLines[li];
        const startIdx = li === sigLine - 1 ? openParen : 0;
        for (let ci = startIdx; ci < scanLine.length; ci++) {
          const ch = scanLine[ci];
          if (ch === "(") { depth++; if (li === sigLine - 1 && ci === openParen) continue; }
          else if (ch === ")") { depth--; if (depth === 0) { closeParen = ci; break outer; } }
          if (depth > 0 || (li === sigLine - 1 && ci > openParen)) {
            paramText += ch;
          }
        }
        if (depth > 0) paramText += "\n";
      }
      if (closeParen !== -1 && paramText !== "") {
        sourceParamList = paramText;
      } else if (closeParen !== -1) {
        // Empty param list
        sourceParamList = "";
      }
    }
  } catch (_) {}

  // Determine endLine: scan from startLine to nextSlotStartLine for closing `}`
  const endLine = findSlotEndLine(sourceLines, startLine, nextSlotStartLine - 1);

  // Determine if it's abstract/native (no body)
  const hasBody = !flags.includes("abstract") && !flags.includes("native");

  // Detect constructor chain (`: super(...)` or `: this.make(...)`)
  let hasCtorChain = false;
  try { hasCtorChain = !!slot.ctorChain(); } catch (_) {}

  // Compute the actual method signature line (after any preceding facet lines).
  // slot.loc().line() may return the first facet's line, so we advance past preceding-line
  // facets. If all facets are inline (on the same line as the signature), startLine is correct.
  let signatureLine = startLine;
  if (facets.length > 0) {
    const lastFacetLine = facets[facets.length - 1].startLine;
    // If the last facet is on a different line than startLine, signature is on the next line
    if (lastFacetLine !== startLine) signatureLine = lastFacetLine + 1;
  }

  // Detect one-liner methods: signature and body on the same line
  const isOneLiner = hasBody && (signatureLine === endLine);

  // Collect AST-driven body rewrites (only when compiler is available and method has a body).
  const bodyRewrites = hasBody ? collectBodyRewrites(slot, sourceLines, startLine, endLine, returnType, compiler) : null;

  return {
    type: "MethodDef",
    name,
    returnType,
    params,
    sourceParamList,
    facets,
    flags,
    hasBody,
    hasCtorChain,
    isOneLiner,
    startLine,
    endLine,
    nextSlotStartLine,
    bodyRewrites,
  };
}

/**
 * Walk the method's AST body to collect two kinds of rewrite hints:
 *  - zeroArgCalls: CallExpr nodes with no arguments that are named method calls (not constructors,
 *    not func-variable invocations). These map to `name()` → `name` rewrites.
 *  - singleReturn: true if the body is exactly one ReturnStmt with a non-null expression, and
 *    the method return type is not Void. Enables stripping `return ` from that statement.
 *
 * Returns null when compiler is not available (graceful degradation).
 */
function collectBodyRewrites(slot, sourceLines, startLine, endLine, returnType, compiler) {
  if (!compiler) return null;

  let code;
  try { code = slot.code(); } catch (_) { return null; }
  if (!code) return null;

  const zeroArgCalls = [];
  let singleReturn = null;

  // --- single-return detection ---
  if (returnType !== "Void" && returnType !== "This") {
    try {
      const stmts = code.stmts();
      if (stmts.size() === 1) {
        const stmt = stmts.get(0);
        const stmtTypeName = String(stmt.typeof().name());
        if (stmtTypeName === "ReturnStmt") {
          let hasExpr = false;
          try { hasExpr = !!stmt.expr(); } catch (_) {}
          if (hasExpr) {
            const stmtLine = stmt.loc().line();
            singleReturn = { sourceLine: stmtLine };
          }
        }
      }
    } catch (_) {}
  }

  // --- zero-arg call detection via AST visitor ---
  try {
    // Walk all statements recursively, collecting zero-arg CallExpr nodes.
    // At parse stage (before ResolveExpr), method() is always null, so we cannot
    // distinguish method calls from func-variable invocations by type. We use
    // id() to skip constructors and collect the rest — in practice nearly all
    // zero-arg calls are method calls.
    const callExprTypeName = "CallExpr";
    const constructionId = (() => { try { return String(compiler.ExprId.construction()); } catch(_) { return "construction"; } })();

    function visitExprNode(expr) {
      if (!expr) return;
      try {
        const tname = String(expr.typeof().name());
        if (tname === callExprTypeName) {
          let argSize = 0;
          try { argSize = expr.args().size(); } catch (_) {}
          if (argSize === 0) {
            // Skip constructors (Type() calls)
            let exprId = "";
            try { exprId = String(expr.id()); } catch (_) {}
            if (exprId !== constructionId) {
              const loc = expr.loc();
              const line = loc.line();
              const col = loc.col();
              let callName = "";
              try { callName = String(expr.name()); } catch (_) {}
              if (callName) {
                zeroArgCalls.push({ sourceLine: line, sourceCol: col, name: callName });
              }
            }
          }
        }
      } catch (_) {}
    }

    function visitStmtNode(stmt) {
      if (!stmt) return;
      try {
        // Walk any expressions inside this statement using known accessors
        const accessors = ["expr", "init", "condition", "update", "cond"];
        for (const acc of accessors) {
          try {
            const child = stmt[acc] ? stmt[acc]() : null;
            if (child) visitExprTree(child);
          } catch (_) {}
        }
        // For blocks (if/while/for bodies)
        try {
          const block = stmt.block ? stmt.block() : null;
          if (block) {
            const stmts = block.stmts();
            for (let i = 0; i < stmts.size(); i++) visitStmtNode(stmts.get(i));
          }
        } catch (_) {}
        // trueBlock / falseBlock for if statements; finallyBlock for try
        for (const acc of ["trueBlock", "falseBlock", "finallyBlock", "defaultBlock"]) {
          try {
            const block = stmt[acc] ? stmt[acc]() : null;
            if (block) {
              const stmts = block.stmts();
              for (let i = 0; i < stmts.size(); i++) visitStmtNode(stmts.get(i));
            }
          } catch (_) {}
        }
        // catches() for try/catch — each Catch has a block
        try {
          const catchList = stmt.catches ? stmt.catches() : null;
          if (catchList) {
            for (let i = 0; i < catchList.size(); i++) {
              const catchClause = catchList.get(i);
              try {
                const block = catchClause.block ? catchClause.block() : null;
                if (block) {
                  const stmts = block.stmts();
                  for (let j = 0; j < stmts.size(); j++) visitStmtNode(stmts.get(j));
                }
              } catch (_) {}
            }
          }
        } catch (_) {}
        // cases() for switch — each Case has a block and case expressions
        try {
          const caseList = stmt.cases ? stmt.cases() : null;
          if (caseList) {
            for (let i = 0; i < caseList.size(); i++) {
              const caseClause = caseList.get(i);
              try {
                // Walk case expressions (could contain zero-arg calls)
                const caseExprs = caseClause.cases ? caseClause.cases() : null;
                if (caseExprs) {
                  for (let j = 0; j < caseExprs.size(); j++) visitExprTree(caseExprs.get(j));
                }
                // Walk case body
                const block = caseClause.block ? caseClause.block() : null;
                if (block) {
                  const stmts = block.stmts();
                  for (let j = 0; j < stmts.size(); j++) visitStmtNode(stmts.get(j));
                }
              } catch (_) {}
            }
          }
        } catch (_) {}
      } catch (_) {}
    }

    function visitExprTree(expr) {
      if (!expr) return;
      visitExprNode(expr);
      // Single-value sub-expression accessors
      for (const acc of ["target", "lhs", "rhs", "operand", "condition", "trueExpr", "falseExpr"]) {
        try {
          const child = expr[acc] ? expr[acc]() : null;
          if (child) visitExprTree(child);
        } catch (_) {}
      }
      // List-of-expr accessors (args, operands for CondExpr, vals for ListExpr/MapExpr)
      for (const acc of ["args", "operands", "vals"]) {
        try {
          const list = expr[acc] ? expr[acc]() : null;
          if (!list) continue;
          const sz = list.size();
          for (let i = 0; i < sz; i++) visitExprTree(list.get(i));
        } catch (_) {}
      }
      // ClosureExpr: visit the closure body block so zero-arg calls inside closures are stripped
      try {
        const code = expr.code ? expr.code() : null;
        if (code) {
          const stmts = code.stmts ? code.stmts() : null;
          if (stmts) {
            for (let i = 0; i < stmts.size(); i++) visitStmtNode(stmts.get(i));
          }
        }
      } catch (_) {}
    }

    const stmts = code.stmts();
    for (let i = 0; i < stmts.size(); i++) {
      visitStmtNode(stmts.get(i));
    }
  } catch (_) {}

  return { zeroArgCalls, singleReturn };
}

function buildFieldDef(slot, facets, flags, sourceLines, startLine, nextSlotStartLine) {
  const name = String(slot.name());
  let fieldType = "Obj";
  try {
    fieldType = shortType(slot.fieldType().toStr());
  } catch (_) {}

  const endLine = findSlotEndLine(sourceLines, startLine, nextSlotStartLine - 1);

  // Detect whether this field has an accessor block `{ get {...} set {...} }`
  // or a scope-narrowing accessor `{ private set }`.
  let hasAccessorBlock = false;
  try {
    const g = slot.getter();
    const s = slot.setter();
    // Non-synthetic getter/setter = explicit body
    if ((g && !g.isSynthetic()) || (s && !s.isSynthetic())) hasAccessorBlock = true;
    // Scope-narrowing synthetic setter: setter has STRICTER protection than the field itself.
    // A field `private Int x` has a synthetic private setter at the same level — no accessor block.
    // A field `Int x { private set }` has a synthetic private setter but the field is public — accessor block.
    if (s && s.isSynthetic() && !hasAccessorBlock) {
      const fPrivate = flags.includes("private");
      const fProtected = flags.includes("protected");
      const fInternal = flags.includes("internal");
      const sPrivate = s.isPrivate();
      const sProtected = s.isProtected();
      const sInternal = s.isInternal();
      if (sPrivate !== fPrivate || sProtected !== fProtected || sInternal !== fInternal) {
        hasAccessorBlock = true;
      }
    }
  } catch (_) {}

  return {
    type: "FieldDef",
    name,
    fieldType,
    facets,
    flags,
    hasAccessorBlock,
    startLine,
    endLine,
    nextSlotStartLine,
  };
}

function buildSlotFlags(slot) {
  // Canonical Fantom modifier order (from Fantom conventions):
  // new, override, abstract, [scope: protected/internal/private], [storage: static/native], [special: const/readonly/virtual/once]
  const flags = [];
  try { if (slot.isCtor()) flags.push("new"); } catch (_) {}
  try { if (slot.isOverride()) flags.push("override"); } catch (_) {}
  try { if (slot.isAbstract()) flags.push("abstract"); } catch (_) {}
  try { if (slot.isProtected()) flags.push("protected"); } catch (_) {}
  try { if (slot.isInternal()) flags.push("internal"); } catch (_) {}
  try { if (slot.isPrivate()) flags.push("private"); } catch (_) {}
  try { if (slot.isStatic()) flags.push("static"); } catch (_) {}
  try { if (slot.isNative()) flags.push("native"); } catch (_) {}
  try { if (slot.isConst()) flags.push("const"); } catch (_) {}
  try { if (slot.isReadonly()) flags.push("readonly"); } catch (_) {}
  try { if (slot.isVirtual()) flags.push("virtual"); } catch (_) {}
  try { if (slot.isOnce()) flags.push("once"); } catch (_) {}
  return flags;
}

function findSlotEndLine(sourceLines, fromLine, maxLine) {
  // Scan backwards for the last non-blank, non-comment line.
  // Comments (// and ** fandoc) and blank lines between slots belong in the gap.
  const limit = Math.min(maxLine, sourceLines.length);
  for (let i = limit - 1; i >= fromLine; i--) {
    const trimmed = sourceLines[i].trim();
    if (trimmed.length > 0 && !trimmed.startsWith("//") && !trimmed.startsWith("**")) return i + 1; // 1-based
  }
  return fromLine;
}

function findTypeBodyOpenLine(sourceLines, headerLine, endLine) {
  // Scan forward from headerLine for the line containing the opening `{`.
  for (let i = headerLine - 1; i < Math.min(endLine, sourceLines.length); i++) {
    if (sourceLines[i].includes("{")) return i + 1; // 1-based
  }
  return headerLine;
}

// ---------------------------------------------------------------------------
// Facets
// ---------------------------------------------------------------------------

function buildFacets(node, sourceLines) {
  const result = [];
  try {
    const facets = node.facets();
    if (!facets) return result;
    facets.each((f) => {
      result.push(buildFacetDef(f, sourceLines));
    });
  } catch (_) {}
  return result;
}

function buildFacetDef(f, sourceLines) {
  const qname = shortType(String(f.qname()));
  const startLine = f.loc().line();

  // Extract the raw facet body `{ ... }` from source to preserve exact field values
  // (AST-reconstructed values expand type references like `Marker("")` → `unknown::Marker.<ctor>("")`).
  let sourceBody = null;
  let fields = [];
  try {
    if (sourceLines) {
      sourceBody = extractFacetSourceBody(sourceLines, startLine, qname);
    }
    if (!sourceBody) {
      // Fallback: reconstruct from AST field values
      const names = f.names();
      const vals = f.vals();
      if (names && vals) {
        for (let i = 0; i < names.size(); i++) {
          fields.push({ name: String(names.get(i)), val: String(vals.get(i)) });
        }
      }
    }
  } catch (_) {}

  return {
    type: "FacetDef",
    qname,
    fields,
    sourceBody,
    startLine,
    endLine: startLine,
  };
}

/**
 * Extracts the raw `{ ... }` body from a facet annotation in source.
 * Returns the body text INCLUDING the outer braces (e.g. `{ su = true }`),
 * or null if the facet has no body.
 */
function extractFacetSourceBody(sourceLines, startLine, qname) {
  const srcLine = sourceLines[startLine - 1] || "";
  // Find `@qname` then check if `{` immediately follows (ignoring whitespace)
  const facetIdx = srcLine.indexOf(`@${qname}`);
  if (facetIdx === -1) return null;
  const afterFacetName = srcLine.slice(facetIdx + qname.length + 1).trimStart();
  // Only extract body if `{` is the immediate next token — not if another `@facet` or keyword follows
  if (!afterFacetName.startsWith("{")) return null;

  // Extract balanced braces (may span lines for multi-line facets)
  let depth = 0;
  let body = "";
  let startedOnLine = true;
  const startText = afterFacetName;
  for (let li = startLine - 1; li < sourceLines.length; li++) {
    const text = startedOnLine ? startText : sourceLines[li];
    startedOnLine = false;
    for (let ci = 0; ci < text.length; ci++) {
      body += text[ci];
      if (text[ci] === "{") depth++;
      else if (text[ci] === "}") {
        depth--;
        if (depth === 0) return body.trim();
      }
    }
    if (depth > 0) body += "\n";
  }
  return null;
}

// ---------------------------------------------------------------------------
// Parameters
// ---------------------------------------------------------------------------

function buildParams(slot) {
  const result = [];
  try {
    slot.paramDefs().each((p) => {
      let defaultVal = null;
      if (p.hasDefault()) {
        try {
          defaultVal = shortType(String(p.def().toStr()));
        } catch (_) {}
      }
      result.push({
        type: "ParamDef",
        name: String(p.name()),
        paramType: shortType(p.paramType().toStr()),
        hasDefault: p.hasDefault(),
        defaultVal,
      });
    });
  } catch (_) {}
  return result;
}
