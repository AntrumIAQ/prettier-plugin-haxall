import { builders } from "prettier/doc"

import * as fan from './haxall/fan.js'
import * as sys from './haxall/esm/sys.js'
import * as axon from './haxall/esm/axon.js'
import * as concurrent from './haxall/esm/concurrent.js'
import * as haystack from './haxall/esm/haystack.js'

const pb = builders;

concurrent.Actor.locals().set(haystack.Etc.cxActorLocalsKey(), new axon.AxonContext());
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

function parseTrio(text, options) {
  console.log(axon.CoreLib.parseAst(text))
  return {
    type: "main",
    start: 0,
    end: text.length,
  };
}

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
    expr.walk((key, value) => { this[key] = makeAxonNode(value) })
    if (this.type == axon.ExprType.dotCall()) {
      this.lhs = this.args.splice(0, 1)[0]
    }
    else
      if (this.type == axon.ExprType.trapCall()) {
        this.lhs = this.args[0]
        this.rhs = this.args[1]
      }
  }
}

class AxonLeaf {
  constructor(type, value) {
    this.type = type
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

function printTrio(
  // Path to the AST node to print
  path,
  options,
  // Recursively print a child node
  print
) {
  const node = path.getNode()

  // if (Array.isArray(node)) {
  //   return concat(path.map(print))
  // }

  switch (node.type) {
    default:
      return "poot"//JSON.stringify(poot)
  }
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

    case axon.ExprType.compdef():
    case axon.ExprType.celldef():
      return "paxon::compcell"

    case axon.ExprType.call():
    case axon.ExprType.partialCall():
      return pb.concat([path.call(print, "func"), "(", pb.join(", ", path.map(print, 'args')), ")"])

    case axon.ExprType.staticCall():
      return pb.concat([path.call(print, "typeRef"), ".", path.call(print, "funcName"), "(", pb.join(", ", path.map(print, 'args')), ")"])

    case axon.ExprType.trapCall():
      return pb.concat([path.call(print, "lhs"), "->", node.rhs.val.value])

    case axon.ExprType.block():
      return pb.concat(["do", pb.indent(
        pb.concat([pb.hardlineWithoutBreakParent, pb.join(pb.hardlineWithoutBreakParent, path.map(print, 'exprs'))])
      ), pb.hardlineWithoutBreakParent, "end"])

    case axon.ExprType.ifExpr(): {
      let docs = ["if (", path.call(print, 'cond'), ")", pb.line, path.call(print, 'ifExpr')]
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

    case axon.ExprType.func(): {
      const needsParens = node._expr.isTop() || node.params.length > 1
      let docs = []
      if (needsParens) docs.push("(")
      docs = docs.concat([pb.join(", ", path.map(print, 'params'))])
      docs.push(needsParens ? ") " : " ")
      docs = docs.concat(["=> ", path.call(print, 'body')])
      return pb.concat(docs)
    }

    case axon.ExprType.dotCall(): {
      let docs = [path.call(print, "lhs"), ".", path.call(print, "func")]
      const argDocs = path.map(print, 'args')
      let trailingLamdba = null

      if (node.args.length > 0 && node.args[node.args.length - 1].type == axon.ExprType.func() && path.parent.type != axon.ExprType.dotCall()) {
        trailingLamdba = argDocs.splice(-1, 1).pop()
      }
      if (argDocs.length > 0) {
        docs = docs.concat(["(", pb.join(", ", argDocs), ")"])
      }
      if (trailingLamdba !== null) {
        docs.push(" ")
        docs.push(trailingLamdba)
      }
      return pb.concat(docs)
    }
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
