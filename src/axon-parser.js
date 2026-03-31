import * as sys from "../lib/haxall/esm/sys.js";
import * as concurrent from "../lib/haxall/esm/concurrent.js";
import * as haystack from "../lib/haxall/esm/haystack.js";
import * as axon from "../lib/haxall/esm/axon.js";
import "../lib/haxall/esm/fantom.js";

sys.Unit.define("per_unum, ⁄₁; ; 1");
concurrent.Actor.locals().set(haystack.Etc.cxActorLocalsKey(), new axon.AxonContext());

export class TrioSrc {
  constructor(src, line) {
    this.src = src;
    this.line = line;
  }
}

function makeAxonNode(obj) {
  if (sys.ObjUtil.is(obj, axon.Expr.type$)) {
    return new AxonTree(obj);
  } else if (sys.ObjUtil.is(obj, axon.FnParam.type$)) {
    const node = { _type: "param", _start: obj.startLoc(), _end: obj.endLoc(), name: obj.name() };
    if (obj.hasDef()) node.def = makeAxonNode(obj.def());
    return node;
  } else if (sys.ObjUtil.is(obj, sys.Type.find("sys::List"))) {
    const values = new Array();
    obj.each((value) => values.push(makeAxonNode(value)));
    values._type = "array";
    return values;
  } else {
    return new AxonLeaf("literal", obj);
  }
}

class AxonTree {
  constructor(expr) {
    this._type = expr.type();
    this._expr = expr;
    this._start = expr.startLoc();
    this._end = expr.endLoc();
    if (this._type == axon.ExprType.compdef()) {
      expr.walk((key, value) => {
        this[key] = value;
      });
      this.body = makeAxonNode(this.body);
      this.cell_names = haystack.Etc.dictNames(this.cells);
      this.cell_values = [];
      haystack.Etc.dictVals(this.cells).each((v) => {
        v._type = v.type();
        this.cell_values.push(v);
      });
    } else {
      expr.walk((key, value) => {
        this[key] = makeAxonNode(value);
      });
    }
    if (this._type == axon.ExprType.dotCall()) {
      this.lhs = this.args.splice(0, 1)[0];
      this._args_need_parens = false;
      this._group_id = Symbol();
      this._break_if_group = this._group_id;
      for (let index = 0; index < this.args.length; ++index) {
        if (this.args[index]._type == axon.ExprType.dotCall()) this.args[index]._arg_of_dotcall = this;
      }
    } else if (this._type == axon.ExprType.trapCall()) {
      this.lhs = this.args[0];
      this.rhs = this.args[1];
    } else if (this._type == axon.ExprType.partialCall()) {
      this._expr.args().each((arg, i) => {
        if (arg === null) this.args[i].value = "_";
      });
    }
  }
}

class AxonLeaf {
  constructor(type, value) {
    this._type = type;
    this.value = value;
    if (value !== null && value.startLoc !== undefined) {
      this._start = value.startLoc();
      this._end = value.endLoc();
    }
  }
}

export function parseAxon(text, options, options2) {
  const loc = axon.Loc.make(options.filepath, options.trioline === undefined ? 0 : options.trioline - 1, 0);
  const ins = sys.Str.in(text);
  const parser = axon.Parser.make(loc, ins);
  const ast = new AxonTree(parser.parse());
  ast.comments = parser.comments();
  return ast;
}

export function parseTrio(text, options) {
  const ast = { children: [], comments: [] };
  const reader = haystack.TrioReader.make(sys.Str.in(text));
  reader.eachDict((value) => {
    let src = value.get("src");
    if (src !== null) {
      let trimmed = src.trim();
      if (trimmed.length > 0 && trimmed[0] == "(") src = new TrioSrc(src, reader.srcLineNum());
    }
    ast.children.push({
      _start: axon.Loc.make(options.filepath, reader.recLineNum(), reader.recFilePos()),
      _end: axon.Loc.make(options.filepath, reader.__lineNum(), reader.filePos()),
      dict: value,
      src: src,
    });
  });
  return ast;
}
