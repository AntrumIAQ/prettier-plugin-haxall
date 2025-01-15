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
    values.type = "array"
    return values
  }
  else {
    return new AxonLeaf("literal", obj)
  }
}

class AxonTree {
  constructor(expr) {
    this.type = expr.type()
    this._expr = expr
    this.start = expr.startLoc()
    this.end = expr.endLoc()
    if (this.type == axon.ExprType.compdef()) {
      expr.walk((key, value) => { this[key] = value })
      this.body = makeAxonNode(this.body)

      const cells = new Array()
      cells.type = "array"
      this.cells.each((value, key) => cells.push(new AxonCellDef(key, value)))
      this.cells = cells
    }
    else {
      expr.walk((key, value) => { this[key] = makeAxonNode(value) })
    }
    if (this.type == axon.ExprType.dotCall()) {
      this.lhs = this.args.splice(0, 1)[0]
    }
    else if (this.type == axon.ExprType.trapCall()) {
      this.lhs = this.args[0]
      this.rhs = this.args[1]
    }
    else if (this.type == axon.ExprType.partialCall()) {
      this._expr.args().each((arg, i) => { if (arg === null) this.args[i].value = { toStr: function () { return "_" } } })
    }
  }
}

class AxonLeaf {
  constructor(type, value) {
    this.type = type
    this.value = value
    if (value !== null && value.startLoc !== undefined) {
      this.start = value.startLoc()
      this.end = value.endLoc()
    }
  }
}

class AxonCellDef {
  constructor(key, value, start) {
    this.type = axon.ExprType.celldef()
    this.key = key
    this.value = value
    this.start = start.startLoc()
    this.end = end.endLoc()
  }
}

function parseAxon(text, options, options2, loc) {
  if (loc === undefined) loc = axon.Loc.make(options.filepath, 0, 0)
  const ins = sys.Str.in(text);
  const parser = axon.Parser.make(loc, ins);
  const ast = new AxonTree(parser.parse())
  ast.comments = parser.comments()
  return ast
}

function printAxon(path, options, print) {
  const node = path.getNode()

  switch (node.type) {

    case "array":
      return path.map(print, 'value')

    case "literal":
      if (node.value === null) return "null"
      if (typeof node.value == "string") return '"' + node.value + '"'
      return (typeof node.value == "object" && "toStr" in node.value) ? node.value.toStr() : String(node.value)

    case axon.ExprType.literal():
      return path.call(print, "val")

    case axon.ExprType.list():
      return pb.group(
        [
          '[',
          pb.indent(
            [
              pb.softline,
              pb.join([',', pb.line], path.map(print, 'vals'))
            ]
          ),
          pb.softline,
          ']'
        ]
      )

    case axon.ExprType.dict():
      const keys = []
      node.names.forEach((name) => keys.push(haystack.Etc.isTagName(name.value) ? name.value : sys.Str.toCode(name.value)))
      const values = path.map(print, "vals")
      const pairs = keys.map((k, i) => [k, values[i] == "marker" ? "" : [": ", values[i]]]);
      return pb.group(
        [
          '{',
          pb.indent([
            pb.softline,
            pb.join([',', pb.line], pairs)
          ]),
          pb.softline,
          '}'
        ]
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
      const needsParens = path.parent === null || path.parent.dict !== undefined || node.params.length > 1
      let docs = []
      if (needsParens) docs.push("(")
      docs = docs.concat([pb.join(", ", path.map(print, 'params'))])
      docs.push(needsParens ? ") " : " ")
      docs = docs.concat(["=> ", path.call(print, 'body')])
      return docs
    }

    case axon.ExprType.compdef():
      return ["defcomp", pb.indent([pb.hardline, pb.join(pb.hardline, path.map(print, "cells")), pb.hardline, path.call(print, 'body')]), pb.hardline, "end"]

    case axon.ExprType.celldef():
      return node.value.toStr().replace("is:", "is:^")

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
      if (node.tryExpr.type == axon.ExprType.block()) {
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
      return [node.type.op(), " ", path.call(print, "operand")]

    case axon.ExprType.neg("-"):
      return [node.type.op(), path.call(print, "operand")]

    case axon.ExprType.and("and"):
    case axon.ExprType.or("or"):
      return pb.group([path.call(print, "lhs"), pb.line, node.type.op(), " ", path.call(print, "rhs")])

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
    case axon.ExprType.div("/"):
      return [path.call(print, "lhs"), " ", node.type.op(), " ", path.call(print, "rhs")]

    default:
      throw new Error("Unknown axon type: " + JSON.stringify(node));

    case axon.ExprType.dotCall(): {
      let isDotCallLeaf = path.parent.type != axon.ExprType.dotCall()
      if (isDotCallLeaf) options.dotCallLeafGroupId = node.start.filePos
      let docs = [path.call(print, "lhs")]
      const argDocs = path.map(print, 'args')

      let trailingLamdba = null
      if (node.args.length > 0 && node.args[node.args.length - 1].type == axon.ExprType.func() && isDotCallLeaf) {
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
      docs = pb.group(docs, { id: isDotCallLeaf ? node.start.filePos : null })
      return docs
    }

    case axon.ExprType.ifExpr(): {
      let ifDoc = path.call(print, 'ifExpr')
      let docs = ["if ", pb.group(["(", pb.indent([pb.softline, path.call(print, 'cond')]), pb.softline, ")"]), " "]
      if ("elseExpr" in node) {
        docs = docs.concat([ifDoc, pb.line, "else ", path.call(print, "elseExpr")])
        if (node.ifExpr.type == axon.ExprType.block()) {
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
    docs.pop()
    return
  }
  for (let index = docs.length - 1; index >= 0; index--) {
    let blockDocs = docs[index]
    if (Array.isArray(blockDocs) && blockDocs[blockDocs.length - 1] == "end") {
      blockDocs.pop()
      blockDocs.pop()
      return
    }
  }
}

function parseTrio(text, options) {
  const ast = { children: [] }
  const reader = haystack.TrioReader.make(sys.Str.in(text))
  reader.eachDict((value) => {
    ast.children.push({
      start: reader.recLineNum(),
      srcStart: reader.srcLineNum(),
      end: reader.__lineNum(),
      dict: value,
      axon: value.has("src") ? parseAxon(value.get("src"), options, options, axon.Loc.make("unknown", reader.srcLineNum())) : null
    })
  });
  return ast
}

function printTrio(path, options, print) {
  const node = path.getNode()
  if ("children" in node) return pb.join(pb.concat(["---", pb.hardline]), path.map(print, "children"))
  if ("type" in node) return printAxon(path, options, print)

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
      docs = docs.concat([pb.indent([pb.hardline, path.call(print, "axon")]), pb.hardline])
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
  return pb.concat(docs)
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
    astFormat: 'trio-ast'
  },
  'axon-parse': {
    parse: parseAxon,
    locStart: (node) => {
      if (node.start === undefined) {
        return 0
      }
      if (node.start === null) {
        return 0
      }
      return node.start.filePos()
    },
    locEnd: (node) => {
      if (node.end === undefined) {
        return 0
      }
      if (node.type == "commentML") {
        return node.end.filePos() + 1
      }
      return node.end.filePos()
    },
    astFormat: 'axon-ast'
  }
}
const ignoredKeys = new Set(["_expr", "type", "start", "end"]);

const printers = {
  'trio-ast': {
    print: printTrio,
    printComment: (path, options) => comment.node.value
  },
  'axon-ast': {
    print: printAxon,
    printComment: (path, options) => {
      if (path.node.type == "commentSL") return ["// ", path.node.value]
      if (path.node.type == "commentML") {
        if (path.node.value.includes("\n")) {
          const lines = path.node.value.split('\n').map((line) => line.trim())
          if (lines.length > 0 && lines[lines.length - 1].length == 0) lines.pop()
          if (lines.length > 0 && lines[0].length == 0) lines.shift()
          return ["/*", pb.indent([pb.hardline, pb.join(pb.hardline, lines)]), pb.hardline, "*/"]
        }
        else return ["/*", path.node.value, "*/"]
      }
      if (path.node.type == "blanklines") return pb.hardline
    },
    isBlockComment: (node) => node.type == "commentML" || node.type == "blanklines",
    canAttachComment: (node) => "start" in node && node.start !== null,
    getVisitorKeys: (node, nonTraversableKeys) => {
      return Object.keys(node).filter(
        (key) => !nonTraversableKeys.has(key) && !ignoredKeys.has(key),
      );
    }
  }
}

export default {
  languages,
  parsers,
  printers
}
