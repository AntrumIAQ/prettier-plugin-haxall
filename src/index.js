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
    return new AxonLeaf(axon.ExprType.literal(), obj)
  }
}

class AxonTree {
  constructor(expr) {
    this.type = expr.type()
    expr.walk((key, value) => { this[key] = makeAxonNode(value) })
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
// function parseAxon(text, options) {
//   console.log("\n")
//   axon.CoreLib.parseAst(text).each((value, key) => console.log(key, value))
//   return {
//     type: "main",
//     start: 0,
//     end: text.length,
//   };
// }

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


function printAxon(
  // Path to the AST node to print
  path,
  options,
  // Recursively print a child node
  print
) {
  let node = path.getNode()
  // if (typeof node == "function") {
  //   node = node.call(path.parent)
  // }

  // let printer = new axon.Printer()
  // node.print(printer)
  // return printer.toStr()

  // if (Array.isArray(node)) {
  //   return concat(path.map(print))
  // }

  switch (node.type) {

    case "array":
      return path.map(print, 'value')

    case axon.ExprType.literal():
      return node.value.toStr()

    case axon.ExprType.func():
      return pb.concat(["(", pb.join(", ", path.map(print, 'params')), ") => ", path.call(print, 'body')])

    case axon.ExprType.block():
      return pb.concat(["do", pb.indent(
        pb.concat([pb.hardline, pb.join(pb.hardline, path.map(print, 'exprs'))])
      ), pb.hardline, "end", pb.hardline])

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

    case axon.ExprType.def():
      let out = pb.concat([node.name.value, ": ", path.call(print, 'val')])
      return out

    default:
      return "paxon"
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
