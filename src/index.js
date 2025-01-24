import * as fan from './haxall/fan.js'
import * as sys from './haxall/esm/sys.js'
import * as axon from './haxall/esm/axon.js'
import * as concurrent from './haxall/esm/concurrent.js'
import * as haystack from './haxall/esm/haystack.js'
import { builders } from "prettier/doc"
import { utils } from "prettier/doc"
const pb = builders;
const pu = utils;

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
      this._args_need_parens = false
      this._group_id = this.lhs._end.filePos()
      this._break_if_group = this._group_id
      for (let index = 0; index < this.args.length; ++index) {
        if (this.args[index]._type == axon.ExprType.dotCall()) this.args[index]._arg_of_dotcall = this
      }
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

function printAxon(path, options, print) {

  const newlinePrior = function (filePos) {
    for (let index = filePos - 1; index >= 0; --index) {
      let ch = options.originalText[index]
      if (ch != ' ') {
        if (ch == '\n') return true
        break
      }
    }
    return false
  }

  const newlineAfter = function (filePos) {
    for (let index = filePos + 1; index < options.originalText.length; ++index) {
      let ch = options.originalText[index]
      if (ch != ' ') {
        if (ch == '\n') return true
        break
      }
    }
    return false
  }

  const parens = function (expr, docs) {
    if (expr === undefined || !expr._inParens) return docs

    let lParenBreak = "";
    let rParenBreak = "";

    if (newlineAfter(expr.startLoc().filePos())) lParenBreak = pb.hardlineWithoutBreakParent
    if (newlinePrior(expr.endLoc().filePos())) rParenBreak = pb.hardlineWithoutBreakParent
    if (!Array.isArray(docs)) docs = [docs]
    if (lParenBreak === pb.hardlineWithoutBreakParent && rParenBreak === pb.hardlineWithoutBreakParent) return ["(", pb.indent([lParenBreak, ...docs]), rParenBreak, ")"]
    return ["(", lParenBreak, ...docs, rParenBreak, ")"]
  }

  function argsGroup(args, groupId, argExprs) {
    let parenBreak = (args.length >= 1 && newlinePrior(argExprs[0]._start.filePos())) ? pb.hardlineWithoutBreakParent : pb.softline
    if (args.length > 1 || parenBreak == pb.hardlineWithoutBreakParent) {
      return pb.group([
        '(',
        pb.indent([
          parenBreak,
          pb.join([',', parenBreak == pb.hardlineWithoutBreakParent ? parenBreak : pb.line], args)
        ]),
        parenBreak,
        ')'
      ], { id: groupId }
      )
    }
    return pb.group(['(', pb.join([',', pb.line], args), ')'], { id: groupId })
  }

  const node = path.getNode()

  let makeDocs = () => {
    switch (node._type) {

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

        node._group_id = node._start.filePos()
        if (node.vals.length > 1 || trailingComma) {
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
            ], { shouldBreak: trailingComma, id: node._group_id }
          )
        }
        return pb.group(['[', path.map(print, 'vals'), ']'], { id: node._group_id })
      }

      case axon.ExprType.dict(): {
        const keys = path.map(print, "names")
        const values = path.map(print, "vals")
        for (let i = 0; i < keys.length; ++i) {
          if (values[i] == "marker") values[i] = ""
          if (values[i] == "remove") {
            values[i] = ""
            keys[i] = "-" + keys[i]
          }
        }
        const longestKeyLength = Math.max(...(keys.map(k => k.length)));
        const pairs = keys.map((k, i) => [k, values[i] == "" ? "" : [":", pb.ifBreak(" ".repeat(longestKeyLength - k.length + 1), " "), values[i]]]);

        let trailingComma = false
        if (node.vals.length > 0) {
          let lastIndex = node.vals.length - 1
          let isMarker = values[lastIndex] == ""
          let lastNode = isMarker ? node.names[lastIndex] : node.vals[lastIndex]
          trailingComma = lastNode._end !== null && options.originalText[lastNode._end.filePos() + 1] == ','
        }

        node._group_id = node._start.filePos()
        if (node.vals.length > 1 || trailingComma) {
          return pb.group(
            [
              '{',
              pb.indent([
                pb.softline,
                pb.join([',', pb.line], pairs)
              ]),
              trailingComma ? ',' : '', pb.softline,
              '}'
            ], { shouldBreak: trailingComma, id: node._group_id }
          )
        }
        return pb.group(['{', pairs, '}'], { id: node._group_id })
      }

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

      case axon.ExprType.call(): {
        let isDotCallLeaf = path.parent !== null && path.parent._type != axon.ExprType.dotCall()
        const argDocs = path.map(print, 'args')
        let trailingLamdba = null
        if (isDotCallLeaf && node.args.length > 0 && node.args[node.args.length - 1]._type == axon.ExprType.func()) {
          trailingLamdba = argDocs.splice(-1, 1).pop()
        }
        let docs = [path.call(print, "func"), argsGroup(argDocs, node.func._end.filePos(), node.args)]
        if (trailingLamdba !== null) {
          docs = docs.concat([" ", trailingLamdba])
        }
        return pb.group(docs)
      }

      case axon.ExprType.partialCall():
        return [path.call(print, "func"), argsGroup(path.map(print, 'args'), node.func._end.filePos(), node.args)]

      case axon.ExprType.staticCall():
        return [path.call(print, "typeRef"), ".", path.call(print, "funcName"), argsGroup(path.map(print, 'args'), node.func._end.filePos(), node.args)]

      case axon.ExprType.trapCall():
        return [path.call(print, "lhs"), "->", node.rhs.val.value]

      case axon.ExprType.block(): {
        return doWrap(pb.join(pb.hardlineWithoutBreakParent, path.map(print, 'exprs')))
      }

      case axon.ExprType.returnExpr():
        return ["return ", path.call(print, 'expr')]

      case axon.ExprType.throwExpr():
        return ["throw ", path.call(print, 'expr')]

      case axon.ExprType.tryExpr(): {
        let tryDoc = path.call(print, 'tryExpr')
        if (node.tryExpr._type == axon.ExprType.block()) {
          popEnd(tryDoc)
        }
        else tryDoc = [tryDoc, newlineAfter(node.tryExpr._end.filePos()) ? pb.hardlineWithoutBreakParent : " "]
        const docs = ["try ", tryDoc, "catch "]
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
        let lOpBreak = newlineAfter(node.lhs._end.filePos()) ? pb.hardlineWithoutBreakParent : " "
        let rOpBreak = newlineAfter(options.originalText.indexOf(node._type.op(), node.lhs._end.filePos() + 1) + node._type.op().length - 1) ? pb.hardlineWithoutBreakParent : " "
        let docs = [path.call(print, "lhs"), lOpBreak, node._type.op(), rOpBreak, path.call(print, "rhs")]
        if (node._start.filePos() != node.lhs._start.filePos() && node._end.filePos() != node.rhs._end.filePos()) {
          docs = parens(node, docs)
        }
        return pb.group(docs)
      }

      default:
        throw new Error("Unknown axon type: " + JSON.stringify(node));

      case axon.ExprType.dotCall(): {
        let dotBreak = ""
        let dotBreakGroup = 0

        if (node.lhs._type == axon.ExprType.dotCall()) {
          node.lhs._args_need_parens = true
          node.lhs._break_if_group = node._break_if_group
          dotBreak = pb.ifBreak(pb.hardlineWithoutBreakParent, pb.softline, { groupId: node._break_if_group })
          dotBreakGroup = dotBreak.groupId
        }
        else {
          if (path.parent !== null && path.parent._type === axon.ExprType.dotCall() && node._arg_of_dotcall != path.parent) {
            dotBreak = pb.ifBreak(pb.hardlineWithoutBreakParent, pb.softline, { groupId: node._break_if_group })
            dotBreakGroup = dotBreak.groupId
          }
          if (node.lhs._type == axon.ExprType.dict() || node.lhs._type == axon.ExprType.list()) {
            dotBreak = pb.ifBreak("", dotBreak, { groupId: node.lhs._group_id })
            dotBreakGroup = dotBreak.groupId
          }
        }

        let docs = [path.call(print, "lhs")]
        const argDocs = path.map(print, 'args')

        let trailingLamdba = null
        if (!node._args_need_parens && node.args.length > 0 && node.args[node.args.length - 1]._type == axon.ExprType.func()) {
          trailingLamdba = argDocs.splice(-1, 1).pop()
        }

        if (node.func.name.value == "get" && argDocs.length == 1 && trailingLamdba === null) {
          docs = docs.concat(["[", argDocs[0], "]"])
        }
        else {
          let dotAndRhsDocs = [dotBreak, ".", path.call(print, "func")];
          if (argDocs.length > 0 || (trailingLamdba !== null && node.args[node.args.length - 1].params.length != 1)) {
            dotAndRhsDocs.push(argsGroup(argDocs, node.func._end.filePos(), node.args))
          }
          if (trailingLamdba !== null) {
            dotAndRhsDocs = dotAndRhsDocs.concat([" ", trailingLamdba])
          }

          if (dotBreak != "") dotAndRhsDocs = pb.indentIfBreak(dotAndRhsDocs, { groupId: dotBreakGroup })
          docs = docs.concat(dotAndRhsDocs)
        }

        docs = pb.group(docs, { id: node._group_id })
        return docs
      }

      case axon.ExprType.ifExpr(): {
        const lParenBreak = newlinePrior(node.cond._start.filePos()) ? pb.hardlineWithoutBreakParent : ""
        const rParenBreak = newlineAfter(node.cond._end.filePos()) ? pb.hardlineWithoutBreakParent : ""
        let docs = ["if ", pb.group(["(", pb.indent([lParenBreak, path.call(print, 'cond')]), rParenBreak, ")"]), " "]

        let ifExprInBlock = node.ifExpr._type == axon.ExprType.block()
        let lastExprInIf_is_IfWithoutElse = ifExprInBlock && isIfWithoutElse(node.ifExpr.exprs[node.ifExpr.exprs.length - 1])

        let ifDoc = path.call(print, 'ifExpr')
        if (newlinePrior(node.ifExpr._start.filePos())) {
          ifDoc = doWrap(ifDoc)
          ifExprInBlock = true
          lastExprInIf_is_IfWithoutElse = isIfWithoutElse(node.ifExpr)
        }

        if ("elseExpr" in node) {
          if (ifExprInBlock && !lastExprInIf_is_IfWithoutElse) {
            popEnd(ifDoc)
          }
          else ifDoc = [ifDoc, newlineAfter(node.ifExpr._end.filePos()) ? pb.hardlineWithoutBreakParent : " "]

          let elseDoc = path.call(print, "elseExpr")
          if (newlinePrior(node.elseExpr._start.filePos())) elseDoc = doWrap(elseDoc)
          docs = docs.concat([ifDoc, "else ", elseDoc])
        }
        else docs.push(ifDoc)
        return pb.group(docs)
      }
    }
  }
  return parens(node._expr, makeDocs())
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

function doWrap(docs) {
  return ["do", pb.indent(
    [pb.hardlineWithoutBreakParent, docs]
  ), pb.hardlineWithoutBreakParent, "end"]
}

function isIfWithoutElse(expr) {
  return expr._type == axon.ExprType.ifExpr() && expr.elseExpr === undefined
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
    let src = value.get("src")
    if (src !== null) {
      let trimmed = src.trim()
      if (trimmed.length > 0 && trimmed[0] == '(') src = new TrioSrc(src, reader.srcLineNum())
    }
    ast.children.push({
      _start: axon.Loc.make(options.filepath, reader.recLineNum(), reader.recFilePos()),
      _end: axon.Loc.make(options.filepath, reader.__lineNum(), reader.filePos()),
      dict: value,
      src: src
    })
  });
  return ast
}

function printTrio(path, options, print) {
  const node = path.getNode()
  if (node.children !== undefined) return pb.join(pb.concat(["---", pb.hardline]), path.map(print, "children"))

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
    if (n == "src" && path.node.src instanceof TrioSrc) {
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
const ignoredKeys = new Set(["_expr", "_type", "_start", "_end", "_inParens", "_args_need_parens", "_break_if_group", "_group_id", "_arg_of_dotcall"]);


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
