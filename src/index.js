import * as fan from './haxall/fan.js'
import * as sys from './haxall/esm/sys.js'
import * as axon from './haxall/esm/axon.js'
import * as concurrent from './haxall/esm/concurrent.js'
import * as haystack from './haxall/esm/haystack.js'
import { builders } from "prettier/doc"
const pb = builders;

concurrent.Actor.locals().set(haystack.Etc.cxActorLocalsKey(), new axon.AxonContext());

function makeAxonNode(obj) {
  if (sys.ObjUtil.is(obj, axon.Expr.type$)) {
    return new AxonTree(obj)
  }
  else if (sys.ObjUtil.is(obj, sys.Type.find("sys::List"))) {
    const values = new Array()
    obj.each((value) => values.push(makeAxonNode(value)))
    values._type = "array"
    return values
  }
  else {
    return new AxonLeaf("literal", obj)
  }
}

class AxonTree {
  constructor(expr) {
    this._type = expr.type()
    this._expr = expr
    this._start = expr.startLoc()
    this._end = expr.endLoc()
    if (this._type == axon.ExprType.compdef()) {
      expr.walk((key, value) => { this[key] = value })
      this.body = makeAxonNode(this.body)
      this.cell_names = haystack.Etc.dictNames(this.cells)
      this.cell_values = []
      haystack.Etc.dictVals(this.cells).each((v) => { v._type = v.type(); this.cell_values.push(v) })
    }
    else {
      expr.walk((key, value) => { this[key] = makeAxonNode(value) })
    }
    if (this._type == axon.ExprType.dotCall()) {
      this.lhs = this.args.splice(0, 1)[0]
    }
    else if (this._type == axon.ExprType.trapCall()) {
      this.lhs = this.args[0]
      this.rhs = this.args[1]
    }
    else if (this._type == axon.ExprType.partialCall()) {
      this._expr.args().each((arg, i) => { if (arg === null) this.args[i].value = { toStr: function () { return "_" } } })
    }
  }
}

class AxonLeaf {
  constructor(type, value) {
    this._type = type
    this.value = value
    if (value !== null && value.startLoc !== undefined) {
      this._start = value.startLoc()
      this._end = value.endLoc()
    }
  }
}

function parseAxon(text, options, options2) {
  const loc = axon.Loc.make(options.filepath, options.trioline === undefined ? 0 : options.trioline - 1, 0)
  const ins = sys.Str.in(text);
  const parser = axon.Parser.make(loc, ins);
  const ast = new AxonTree(parser.parse())
  ast.comments = parser.comments()
  return ast
}

function isBinaryExpr(expr) {
  return expr._type.ordinal() >= axon.ExprType.assign().ordinal() && expr._type.ordinal() <= axon.ExprType.div().ordinal()
}

function printAxon(path, options, print) {

  const parens = function (expr, docs, type) {
    let lParen = "";
    let lParenBreak = "";
    let rParen = "";
    let rParenBreak = "";
    if (!expr._parens_restored && isBinaryExpr(expr) &&
      (options.originalText[expr._start.filePos()] == '(' && options.originalText[expr._end.filePos()] == ')')
    ) {
      expr._parens_restored = true
      lParen = "("
      rParen = ")"

      if (options.originalText[expr._start.filePos() + 1] == '\n') lParenBreak = pb.hardlineWithoutBreakParent

      for (let index = expr._end.filePos() - 1; index >= 0; --index) {
        let ch = options.originalText[index]
        if (ch != ' ') {
          if (ch == '\n') rParenBreak = pb.hardlineWithoutBreakParent
          break
        }
      }
    }
    return Array.isArray(docs) ? [lParen, lParenBreak, ...docs, rParenBreak, rParen] : [lParen, lParenBreak, docs, rParenBreak, rParen]
  }

  const node = path.getNode()

  switch (node._type) {

    case "array":
      return path.map(print, 'value')

    case "literal":
      return String(node.value)

    case axon.ExprType.literal():
      if (node._start !== null) {
        return options.originalText.substring(node._start.filePos(), node._end.filePos() + 1)
      }
      return path.call(print, "val")

    case axon.ExprType.list(): {
      let trailingComma = false
      if (node.vals.length > 0) {
        let lastNode = node.vals[node.vals.length - 1]
        trailingComma = lastNode._end !== null && options.originalText[lastNode._end.filePos() + 1] == ','
      }
      return pb.group(
        [
          '[',
          pb.indent(
            [
              pb.softline,
              pb.join([',', pb.line], path.map(print, 'vals'))
            ]
          ),
          trailingComma ? ',' : '', pb.softline,
          ']'
        ], { shouldBreak: trailingComma }
      )
    }

    case axon.ExprType.dict():
      const keys = path.map(print, "names")
      const values = path.map(print, "vals")
      const longestKeyLength = Math.max(...(keys.map(k => k.length)));
      const pairs = keys.map((k, i) => [k, values[i] == "marker" ? "" : [":", pb.ifBreak(" ".repeat(longestKeyLength - k.length + 1), " "), values[i]]]);

      let trailingComma = false
      if (node.vals.length > 0) {
        let lastIndex = node.vals.length - 1
        let isMarker = values[lastIndex] == "marker" || values[lastIndex] == "<marker>"
        let lastNode = isMarker ? node.names[lastIndex] : node.vals[lastIndex]
        trailingComma = lastNode._end !== null && options.originalText[lastNode._end.filePos() + 1] == ','
      }

      return pb.group(
        [
          '{',
          pb.indent([
            pb.softline,
            pb.join([',', pb.line], pairs)
          ]),
          trailingComma ? ',' : '', pb.softline,
          '}'
        ], { shouldBreak: trailingComma }
      )

    case axon.ExprType.range():
      return [path.call(print, 'start'), "..", path.call(print, 'end')]

    case axon.ExprType.filter():
      return ["parseFilter(", node.filter.toStr().toCode(), ")"]

    case axon.ExprType.def():
      return [node.name.value, ": ", path.call(print, 'val')]

    case axon.ExprType.var():
      return node.name.value

    case axon.ExprType.func(): {
      const needsParens = path.parent === null || path.parent.dict !== undefined || node.params.length != 1
      let docs = []
      if (needsParens) docs.push("(")
      docs = docs.concat([pb.join(", ", path.map(print, 'params'))])
      docs.push(needsParens ? ") " : " ")
      docs = docs.concat(["=> ", path.call(print, 'body')])
      return docs
    }

    case axon.ExprType.compdef(): {
      const keys = node.cell_names
      const values = path.map(print, "cell_values")
      const longestKeyLength = Math.max(...(keys.map(k => k.length)));
      const pairs = []
      keys.each((k, i) => { pairs.push([k, ":", " ".repeat(longestKeyLength - k.length + 1), values[i]]) });

      return ["defcomp", pb.indent([pb.hardline, pb.join(pb.hardline, pairs), pb.hardline, path.call(print, 'body')]), pb.hardline, "end"]
    }

    case axon.ExprType.celldef(): {
      let str = node.toStr().replace("is:", "is:^")
      return str.substring(str.indexOf(':') + 1).trim()
    }

    case axon.ExprType.call():
    case axon.ExprType.partialCall():
      return [path.call(print, "func"), "(", pb.join(", ", path.map(print, 'args')), ")"]

    case axon.ExprType.staticCall():
      return [path.call(print, "typeRef"), ".", path.call(print, "funcName"), "(", pb.join(", ", path.map(print, 'args')), ")"]

    case axon.ExprType.trapCall():
      return [path.call(print, "lhs"), "->", node.rhs.val.value]

    case axon.ExprType.block(): {
      return ["do", pb.indent(
        [pb.hardlineWithoutBreakParent, pb.join(pb.hardlineWithoutBreakParent, path.map(print, 'exprs'))]
      ), pb.hardlineWithoutBreakParent, "end"]
    }

    case axon.ExprType.returnExpr():
      return ["return ", path.call(print, 'expr')]

    case axon.ExprType.throwExpr():
      return ["throw ", path.call(print, 'expr')]

    case axon.ExprType.tryExpr(): {
      const tryDoc = path.call(print, 'tryExpr')
      if (node.tryExpr._type == axon.ExprType.block()) {
        popEnd(tryDoc)
      }
      const docs = ["try ", tryDoc, pb.line, "catch "]
      if ("errVarName" in node) {
        docs.push("(" + node.errVarName.value + ") ")
      }
      docs.push(path.call(print, 'catchExpr'))
      return pb.group(docs)
    }

    case axon.ExprType.typeRef():
      return "paxon::typeRef"

    case axon.ExprType.not("not"):
      return [node._type.op(), " ", path.call(print, "operand")]

    case axon.ExprType.neg("-"):
      return [node._type.op(), path.call(print, "operand")]

    case axon.ExprType.and("and"):
    case axon.ExprType.or("or"):
    case axon.ExprType.assign("="):
    case axon.ExprType.eq("=="):
    case axon.ExprType.ne("!="):
    case axon.ExprType.lt("<"):
    case axon.ExprType.le("<="):
    case axon.ExprType.ge(">="):
    case axon.ExprType.gt(">"):
    case axon.ExprType.cmp("<=>"):
    case axon.ExprType.add("+"):
    case axon.ExprType.sub("-"):
    case axon.ExprType.mul("*"):
    case axon.ExprType.div("/"): {
      let lOpBreak = options.originalText[node.lhs._end.filePos() + 1] == '\n' ? pb.hardlineWithoutBreakParent : " "
      let rOpBreak = options.originalText[options.originalText.indexOf(node._type.op(), node.lhs._end.filePos() + 1) + 1] == '\n' ? pb.hardlineWithoutBreakParent : " "
      let docs = [parens(node.lhs, path.call(print, "lhs")), lOpBreak, node._type.op(), rOpBreak, parens(node.rhs, path.call(print, "rhs"))]
      if (node._start.filePos() != node.lhs._start.filePos() && node._end.filePos() != node.rhs._end.filePos()) {
        docs = parens(node, docs)
      }
      return pb.group(docs)
    }

    default:
      throw new Error("Unknown axon type: " + JSON.stringify(node));

    case axon.ExprType.dotCall(): {
      let isDotCallLeaf = path.parent._type != axon.ExprType.dotCall()
      if (isDotCallLeaf) options.dotCallLeafGroupId = node._start.filePos()
      let docs = [path.call(print, "lhs")]
      const argDocs = path.map(print, 'args')

      let trailingLamdba = null
      if (isDotCallLeaf && node.args.length > 0 && node.args[node.args.length - 1]._type == axon.ExprType.func() && node.args[node.args.length - 1].params.length == 1) {
        trailingLamdba = argDocs.splice(-1, 1).pop()
      }

      if (node.func.name.value == "get" && argDocs.length == 1 && trailingLamdba === null) {
        docs = docs.concat(["[", argDocs[0], "]"])
      }
      else {
        let dotBreak = isDotCallLeaf ? pb.softline : pb.ifBreak(pb.hardlineWithoutBreakParent, pb.softline, { groupId: options.dotCallLeafGroupId })
        docs = docs.concat([dotBreak, ".", path.call(print, "func")])
        if (argDocs.length > 0) {
          docs = docs.concat(["(", pb.join(", ", argDocs), ")"])
        }
        if (trailingLamdba !== null) {
          docs = docs.concat([" ", trailingLamdba])
        }
      }
      if (isDotCallLeaf) docs = pb.indent(docs)
      docs = pb.group(docs, { id: isDotCallLeaf ? node._start.filePos() : null })
      return docs
    }

    case axon.ExprType.ifExpr(): {
      let ifDoc = path.call(print, 'ifExpr')
      let docs = ["if ", pb.group(["(", pb.indent([pb.softline, path.call(print, 'cond')]), pb.softline, ")"]), " "]
      if ("elseExpr" in node) {
        docs = docs.concat([ifDoc, pb.line, "else ", path.call(print, "elseExpr")])
        if (node.ifExpr._type == axon.ExprType.block()) {
          popEnd(ifDoc)
        }
      }
      else docs.push(ifDoc)
      return pb.group(docs)
    }
  }
}

function popEnd(docs) {
  if (docs[docs.length - 1] == "end") {
    docs.pop()
    return
  }
  for (let index = docs.length - 1; index >= 0; index--) {
    let blockDocs = docs[index]
    if (Array.isArray(blockDocs) && blockDocs[blockDocs.length - 1] == "end") {
      blockDocs.pop()
      return
    }
  }
}

class TrioSrc {
  constructor(src, line) {
    this.src = src
    this.line = line
  }
}

function parseTrio(text, options) {
  const ast = { children: [], comments: [] }
  const reader = haystack.TrioReader.make(sys.Str.in(text))
  reader.eachDict((value) => {
    ast.children.push({
      _start: axon.Loc.make(options.filepath, reader.recLineNum(), reader.recFilePos()),
      _end: axon.Loc.make(options.filepath, reader.__lineNum(), reader.filePos()),
      dict: value,
      src: new TrioSrc(value.get("src"), reader.srcLineNum())
    })
  });
  return ast
}

function printTrio(path, options, print) {
  const node = path.getNode()
  if ("children" in node) return pb.join(pb.concat(["---", pb.hardline]), path.map(print, "children"))

  let docs = []

  const names = haystack.Etc.dictNames(node.dict)
  names.sort()
  names.moveTo("dis", 0)
  names.moveTo("name", 0)
  names.moveTo("id", 0)
  names.moveTo("src", -1)
  names.each((n) => {
    let v = node.dict.get(n);
    if (v == null) return;

    docs.push(n)
    if (v === haystack.Marker.val()) {
      docs.push(pb.hardline)
      return
    }
    docs.push(": ")
    let kind = haystack.Kind.fromVal(v, false);
    if (kind == null) {
      docs.push(haystack.XStr.encode(v).toStr())
      return
    }

    if (kind !== haystack.Kind.str()) {
      if (kind.isCollection()) {
        const trioWriterStr = sys.StrBuf.make()
        const trioWriter = haystack.TrioWriter.make(trioWriterStr.out())
        trioWriter.writeCollection(v)
        docs.push(trioWriterStr.toStr())
      }
      else {
        if (sys.ObjUtil.equals(kind, haystack.Kind.bool())) docs.push(String(v))
        else docs.push(kind.valToZinc(v))
        docs.push(pb.hardline)
      }
      return
    }

    let str = sys.ObjUtil.coerce(v, sys.Str.type$);
    if (n == "src") {
      docs = docs.concat([pb.indent([pb.hardline, path.call(print, "src")]), pb.hardline])
    }
    else if (!sys.Str.contains(str, "\n")) {
      if (haystack.TrioWriter.useQuotes(str)) docs.push(sys.Str.toCode(str))
      else docs.push(str)
      docs.push(pb.hardline)
    }
    else {
      const indented = []
      sys.Str.splitLines(str).each((line) => {
        indented.push(line)
        return;
      })
      docs.push(pb.indent([pb.hardline, pb.join(pb.hardline, indented)]))
      docs.push(pb.hardline)
    }
    return
  })
  return docs
}

function locStart(node) {
  if (node._start === undefined) {
    return 0
  }
  if (node._start === null) {
    return 0
  }
  return node._start.filePos()
}

function locEnd(node) {
  if (node._end === undefined) {
    return 0
  }
  if (node._end === null) {
    return 0
  }
  if (node._type == "commentML") {
    return node._end.filePos() + 1
  }
  return node._end.filePos()
}

const languages = [
  {
    extensions: ['.trio'],
    name: 'Trio',
    parsers: ['trio-parse']
  },
  {
    extensions: ['.axon'],
    name: 'Axon',
    parsers: ['axon-parse']
  }
]

const parsers = {
  'trio-parse': {
    parse: parseTrio,
    locStart: locStart,
    locEnd: locEnd,
    astFormat: 'trio-ast'
  },
  'axon-parse': {
    parse: parseAxon,
    locStart: locStart,
    locEnd: locEnd,
    astFormat: 'axon-ast'
  }
}
const ignoredKeys = new Set(["_expr", "_type", "_start", "_end", "_parens_restored"]);


function printComment(path, options) {
  let node = path.node
  if (node._type == "commentSL") {
    let precedingSpaces = 0
    if (node.placement == "remaining") {
      for (let index = node._start.filePos() - 1; index >= 0; --index) {
        let ch = options.originalText[index]
        if (ch != ' ') break
        precedingSpaces++
      }
    }
    precedingSpaces = Math.max(0, precedingSpaces - 1)
    return [" ".repeat(precedingSpaces), "//", node.value]
  }
  if (node._type == "commentML") {
    if (node.value.includes("\n")) {
      const lines = node.value.split('\n').map((line) => line.trim())
      if (lines.length > 0 && lines[lines.length - 1].length == 0) lines.pop()
      if (lines.length > 0 && lines[0].length == 0) lines.shift()
      return ["/*", pb.indent([pb.hardline, pb.join(pb.hardline, lines)]), pb.hardline, "*/"]
    }
    else return ["/*", node.value, "*/"]
  }
  if (node._type == "blanklines") {
    return node.placement == "ownLine" ? "" : pb.hardline
  }
  return ""
}

function isBlockComment(node) { return node._type == "commentML" }

function canAttachComment(node) { return "_start" in node && node._start !== null }

function getVisitorKeys(node, nonTraversableKeys) {
  return Object.keys(node).filter(
    (key) => !nonTraversableKeys.has(key) && !ignoredKeys.has(key),
  );
}

const printers = {
  'trio-ast': {
    print: printTrio,
    embed: (path, options) => {
      if (path.node instanceof TrioSrc && path.node.src !== null) {
        return async (textToDoc) => await textToDoc(path.node.src, { parser: "axon-parse", trioline: path.node.line })
      }
    },
  },
  'axon-ast': {
    print: printAxon,
    printComment: printComment,
    isBlockComment: isBlockComment,
    canAttachComment: canAttachComment,
    getVisitorKeys: getVisitorKeys
  }
}

export default {
  languages,
  parsers,
  printers
}
