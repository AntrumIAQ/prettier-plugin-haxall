//import { builders } from "prettier/doc"

import * as fan from './haxall/fan.js'
import * as sys from './haxall/esm/sys.js'
import * as axon from './haxall/esm/axon.js'
import * as concurrent from './haxall/esm/concurrent.js'
import * as haystack from './haxall/esm/haystack.js'
// import * as prettier from 'prettier'
// console.log(prettier)

//const newline = builders.hardline;
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

function parseAxon(text, options) {
  //if (loc === undefined) loc = axon.Loc.eval();
  let loc = axon.Loc.eval();
  let ins = sys.Str.in(text);
  let parser = axon.Parser.make(loc, ins);
  let expr = parser.parse();
  return expr.encode();
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
  const node = path.getNode()

  // if (Array.isArray(node)) {
  //   return concat(path.map(print))
  // }

  switch (node.type) {
    default:
      return "paxon"//JSON.stringify(poot)
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
