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
  }
}

class AxonCellDef {
  constructor(key, value) {
    this.type = axon.ExprType.celldef()
    this.key = key
    this.value = value
  }
}

function parseAxon(text, options) {
  //if (loc === undefined) loc = axon.Loc.eval();
  let loc = axon.Loc.eval();
  let ins = sys.Str.in(text);
  let parser = axon.Parser.make(loc, ins);
  let expr = parser.parse();
  let ast = new AxonTree(expr)
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
        pb.concat([
          '[',
          pb.indent(
            pb.concat([
              pb.softline,
              pb.join(pb.concat([',', pb.line]), path.map(print, 'vals'))
            ])
          ),
          pb.softline,
          ']'
        ])
      )

    case axon.ExprType.dict():
      const keys = []
      node.names.forEach((name) => keys.push(haystack.Etc.isTagName(name.value) ? name.value : sys.Str.toCode(name.value)))
      const values = path.map(print, "vals")
      const pairs = keys.map((k, i) => pb.concat([k, values[i] == "marker" ? "" : pb.concat([": ", values[i]])]));
      return pb.group(
        pb.concat([
          '{',
          pb.indent([
            pb.softline,
            pb.join(pb.concat([',', pb.line]), pairs)
          ]),
          pb.softline,
          '}'
        ])
      )

    case axon.ExprType.range():
      return pb.concat([path.call(print, 'start'), "..", path.call(print, 'end')])

    case axon.ExprType.filter():
      return pb.concat(["parseFilter(", node.filter.toStr().toCode(), ")"])

    case axon.ExprType.def():
      return pb.concat([node.name.value, ": ", path.call(print, 'val')])

    case axon.ExprType.var():
      return node.name.value

    case axon.ExprType.func(): {
      const needsParens = path.parent === null || node.params.length > 1
      let docs = []
      if (needsParens) docs.push("(")
      docs = docs.concat([pb.join(", ", path.map(print, 'params'))])
      docs.push(needsParens ? ") " : " ")
      docs = docs.concat(["=> ", path.call(print, 'body')])
      return pb.concat(docs)
    }

    case axon.ExprType.compdef():
      return pb.concat(["defcomp", pb.indent([pb.hardline, pb.join(pb.hardline, path.map(print, "cells")), pb.hardline, path.call(print, 'body')]), pb.hardline, "end"])

    case axon.ExprType.celldef():
      return node.value.toStr().replace("is:", "is:^")

    case axon.ExprType.call():
    case axon.ExprType.partialCall():
      return pb.concat([path.call(print, "func"), "(", pb.join(", ", path.map(print, 'args')), ")"])

    case axon.ExprType.dotCall(): {
      let docs = [path.call(print, "lhs")]
      const argDocs = path.map(print, 'args')

      let trailingLamdba = null
      if (node.args.length > 0 && node.args[node.args.length - 1].type == axon.ExprType.func() && path.parent.type != axon.ExprType.dotCall()) {
        trailingLamdba = argDocs.splice(-1, 1).pop()
      }

      if (node.func.name.value == "get" && argDocs.length == 1 && trailingLamdba === null) {
        docs = docs.concat(["[", argDocs[0], "]"])
      }
      else {
        docs = docs.concat([".", path.call(print, "func")])
        if (argDocs.length > 0) {
          docs = docs.concat(["(", pb.join(", ", argDocs), ")"])
        }
        if (trailingLamdba !== null) {
          docs = docs.concat([" ", trailingLamdba])
        }
      }
      return pb.concat(docs)
    }

    case axon.ExprType.staticCall():
      return pb.concat([path.call(print, "typeRef"), ".", path.call(print, "funcName"), "(", pb.join(", ", path.map(print, 'args')), ")"])

    case axon.ExprType.trapCall():
      return pb.concat([path.call(print, "lhs"), "->", node.rhs.val.value])

    case axon.ExprType.block():
      return pb.concat(["do", pb.indent(
        pb.concat([pb.hardlineWithoutBreakParent, pb.join(pb.hardlineWithoutBreakParent, path.map(print, 'exprs'))])
      ), pb.hardlineWithoutBreakParent, "end"])

    case axon.ExprType.ifExpr(): {
      let docs = ["if (", path.call(print, 'cond'), ") ", path.call(print, 'ifExpr')]
      if ("elseExpr" in node) {
        docs = docs.concat(pb.line, "else", pb.line, path.call(print, "elseExpr"))
      }
      return pb.group(pb.concat(docs))
    }

    case axon.ExprType.returnExpr():
      return pb.concat(["return ", path.call(print, 'expr')])

    case axon.ExprType.throwExpr():
      return pb.concat(["throw ", path.call(print, 'expr')])

    case axon.ExprType.tryExpr(): {
      const docs = ["try", pb.indent([pb.line, path.call(print, 'tryExpr')]), pb.line, "catch"]
      if ("errVarName" in node) {
        docs.push("(" + node.errVarName.value + ")")
      }
      docs.push(pb.indent([pb.line, path.call(print, 'catchExpr')]))
      return pb.group(pb.concat(docs))
    }

    case axon.ExprType.typeRef():
      return "paxon::typeRef"

    case axon.ExprType.not("not"):
    case axon.ExprType.neg("-"):
      return pb.concat([node.type.op(), " ", path.call(print, "operand")])

    case axon.ExprType.assign("="):
    case axon.ExprType.and("and"):
    case axon.ExprType.or("or"):
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
      return pb.concat([path.call(print, "lhs"), " ", node.type.op(), " ", path.call(print, "rhs")])

    default:
      throw new Error("Unknown axon type: " + JSON.stringify(node));
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
      axon: value.has("src") ? parseAxon(value.get("src"), options) : null
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
    if (!sys.Str.contains(str, "\n")) {
      if (haystack.TrioWriter.useQuotes(str)) docs.push(sys.Str.toCode(str))
      else docs.push(str)
      docs.push(pb.hardline)
    }
    else if (n == "src") {
      docs = docs.concat([pb.indent([pb.hardline, path.call(print, "axon")]), pb.hardline])
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
    astFormat: 'axon-ast'
  }
}

const printers = {
  'trio-ast': {
    print: printTrio
  },
  'axon-ast': {
    print: printAxon
  }
}

export default {
  languages,
  parsers,
  printers
}
