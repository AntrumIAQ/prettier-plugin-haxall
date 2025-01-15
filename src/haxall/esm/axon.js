// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as util from './util.js'
import * as web from './web.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class AxonContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#stashRef = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    this.#timeoutTicks = sys.Int.maxVal();
    this.#stack = sys.List.make(CallFrame.type$);
    return;
  }

  typeof() { return AxonContext.type$; }

  xetoReadById() { return haystack.HaystackContext.prototype.xetoReadById.apply(this, arguments); }

  xetoReadAllEachWhile() { return haystack.HaystackContext.prototype.xetoReadAllEachWhile.apply(this, arguments); }

  #timeout = null;

  timeout(it) {
    if (it === undefined) {
      return this.#timeout;
    }
    else {
      this.#timeout = it;
      this.#timeoutTicks = ((this$) => { if (it == null) return sys.Int.maxVal(); return sys.Int.plus(sys.Duration.nowTicks(), it.ticks()); })(this);
      return;
    }
  }

  static #timeoutDef = undefined;

  static timeoutDef() {
    if (AxonContext.#timeoutDef === undefined) {
      AxonContext.static$init();
      if (AxonContext.#timeoutDef === undefined) AxonContext.#timeoutDef = null;
    }
    return AxonContext.#timeoutDef;
  }

  #stashRef = null;

  // private field reflection only
  __stashRef(it) { if (it === undefined) return this.#stashRef; else this.#stashRef = it; }

  #heartbeatFunc = null;

  heartbeatFunc(it) {
    if (it === undefined) {
      return this.#heartbeatFunc;
    }
    else {
      this.#heartbeatFunc = it;
      return;
    }
  }

  #timeoutTicks = 0;

  // private field reflection only
  __timeoutTicks(it) { if (it === undefined) return this.#timeoutTicks; else this.#timeoutTicks = it; }

  #stack = null;

  // private field reflection only
  __stack(it) { if (it === undefined) return this.#stack; else this.#stack = it; }

  #regex = null;

  // private field reflection only
  __regex(it) { if (it === undefined) return this.#regex; else this.#regex = it; }

  #xetoIsSpecCache = null;

  // private field reflection only
  __xetoIsSpecCache(it) { if (it === undefined) return this.#xetoIsSpecCache; else this.#xetoIsSpecCache = it; }

  #toDictExtra = null;

  // private field reflection only
  __toDictExtra(it) { if (it === undefined) return this.#toDictExtra; else this.#toDictExtra = it; }

  static curAxon(checked) {
    if (checked === undefined) checked = true;
    let cx = concurrent.Actor.locals().get(haystack.Etc.cxActorLocalsKey());
    if (cx != null) {
      return sys.ObjUtil.coerce(cx, AxonContext.type$.toNullable());
    }
    ;
    if (checked) {
      throw sys.Err.make("No AxonContext available");
    }
    ;
    return null;
  }

  static make() {
    const $self = new AxonContext();
    AxonContext.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    $self.#stack.add(CallFrame.makeRoot($self));
    return;
  }

  xeto() {
    return this.ns().xeto();
  }

  trapRef(ref,checked) {
    if (checked === undefined) checked = true;
    throw sys.UnsupportedErr.make();
  }

  xqReadById(ref,checked) {
    if (checked === undefined) checked = true;
    throw sys.UnsupportedErr.make();
  }

  toDateSpanDef() {
    return haystack.DateSpan.today();
  }

  evalOrReadAll(src) {
    throw sys.UnsupportedErr.make();
  }

  parse(src,loc) {
    if (loc === undefined) loc = Loc.eval();
    let parser = Parser.make(loc, sys.Str.in(src));
    let expr = parser.parse();
    return expr;
  }

  call(funcName,args) {
    return this.evalToFunc(funcName).call(this, args);
  }

  evalToFunc(src) {
    return this.parse(src).evalToFunc(this);
  }

  eval(src,loc) {
    if (loc === undefined) loc = Loc.eval();
    return this.evalExpr(this.parse(src, loc));
  }

  evalExpr(expr) {
    try {
      return expr.eval(this);
    }
    catch ($_u1) {
      $_u1 = sys.Err.make($_u1);
      if ($_u1 instanceof ReturnErr) {
        let e = $_u1;
        ;
        return ReturnErr.getVal();
      }
      else {
        throw $_u1;
      }
    }
    ;
  }

  xetoIsSpec(specName,rec) {
    let spec = ((this$) => { let $_u2 = this$.#xetoIsSpecCache; if ($_u2 == null) return null; return this$.#xetoIsSpecCache.get(specName); })(this);
    if (spec == null) {
      if (this.#xetoIsSpecCache == null) {
        this.#xetoIsSpecCache = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Spec"));
      }
      ;
      (spec = ((this$) => { if (sys.Str.contains(specName, "::")) return this$.xeto().type(specName); return this$.xeto().unqualifiedType(specName); })(this));
      this.#xetoIsSpecCache.set(specName, sys.ObjUtil.coerce(spec, xeto.Spec.type$));
    }
    ;
    return this.xeto().specOf(rec).isa(sys.ObjUtil.coerce(spec, xeto.Spec.type$));
  }

  toDict() {
    return ((this$) => { if (this$.#toDictExtra == null) return haystack.Etc.emptyDict(); return haystack.Etc.makeDict(this$.#toDictExtra); })(this);
  }

  toDictSet(name,val) {
    if (this.#toDictExtra == null) {
      this.#toDictExtra = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    }
    ;
    if (val != null) {
      this.#toDictExtra.set(name, sys.ObjUtil.coerce(val, sys.Obj.type$));
    }
    else {
      this.#toDictExtra.remove(name);
    }
    ;
    return;
  }

  heartbeat(loc) {
    ((this$) => { let $_u5 = this$.#heartbeatFunc; if ($_u5 == null) return null; return sys.Func.call(this$.#heartbeatFunc); })(this);
    if ((sys.ObjUtil.compareGT(sys.Duration.nowTicks(), this.#timeoutTicks) && this.timeout() != null)) {
      throw EvalTimeoutErr.make(sys.ObjUtil.coerce(this.timeout(), sys.Duration.type$), this, loc);
    }
    ;
    return;
  }

  curFunc() {
    for (let i = sys.Int.minus(this.#stack.size(), 1); sys.ObjUtil.compareGE(i, 0); i = sys.Int.decrement(i)) {
      let f = this.#stack.get(i);
      if (sys.ObjUtil.compareNE(f.func().name(), "curFunc")) {
        return f.func();
      }
      ;
    }
    ;
    return null;
  }

  callInNewFrame(func,args,callLoc,vars) {
    if (vars === undefined) vars = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    let frame = CallFrame.make(this, func, args, callLoc, vars);
    this.#stack.push(frame);
    try {
      return func.doCall(this, args);
    }
    finally {
      this.#stack.pop();
    }
    ;
  }

  checkCall(func) {
    return;
  }

  defOrAssign(name,val,loc) {
    let f = this.#stack.last();
    if (f.has(name)) {
      return this.assign(name, val, loc);
    }
    else {
      return this.def(name, val, loc);
    }
    ;
  }

  def(name,val,loc) {
    let f = this.#stack.last();
    if (f.has(name)) {
      throw EvalErr.make(sys.Str.plus(sys.Str.plus("Symbol already bound '", name), "'"), this, loc);
    }
    ;
    return f.set(name, val);
  }

  curFrame() {
    return sys.ObjUtil.coerce(this.#stack.last(), CallFrame.type$);
  }

  resolve(name,loc) {
    let frame = this.varFrame(name);
    if (frame != null) {
      return frame.get(name);
    }
    ;
    let top = this.findTop(name, false);
    if (top != null) {
      return top;
    }
    ;
    throw EvalErr.make(sys.Str.plus(sys.Str.plus("Unknown symbol '", name), "'"), this, loc);
  }

  getVar(name) {
    let frame = this.varFrame(name);
    if (frame != null) {
      return frame.get(name);
    }
    ;
    return null;
  }

  assign(name,val,loc) {
    let frame = this.varFrame(name);
    if (frame != null) {
      return frame.set(name, val);
    }
    ;
    throw EvalErr.make(sys.Str.plus(sys.Str.plus("Unknown symbol '", name), "'"), this, loc);
  }

  varsInScope() {
    const this$ = this;
    let curFunc = this.scopeCurFunc();
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    for (let i = 0; sys.ObjUtil.compareLT(i, this.#stack.size()); i = sys.Int.increment(i)) {
      let f = this.#stack.get(i);
      if (f.isVisibleTo(curFunc)) {
        f.each((v,n) => {
          acc.set(n, v);
          return;
        });
      }
      ;
    }
    ;
    return acc;
  }

  varFrame(name) {
    let curFunc = this.scopeCurFunc();
    for (let i = sys.Int.minus(this.#stack.size(), 1); sys.ObjUtil.compareGE(i, 0); i = sys.Int.decrement(i)) {
      let f = this.#stack.get(i);
      if ((f.has(name) && f.isVisibleTo(curFunc))) {
        return f;
      }
      ;
    }
    ;
    return null;
  }

  scopeCurFunc() {
    let curFunc = this.#stack.last().func();
    if (sys.ObjUtil.is(curFunc, LazyFantomFn.type$)) {
      (curFunc = this.#stack.get(-2).func());
    }
    ;
    return curFunc;
  }

  traceToStr(errLoc,opts) {
    if (opts === undefined) opts = null;
    let s = sys.StrBuf.make();
    this.trace(errLoc, s.out(), opts);
    return s.toStr();
  }

  traceToGrid(errLoc,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    let gb = haystack.GridBuilder.make().addCol("name").addCol("file").addCol("line").addCol("vars");
    this.traceWalk(errLoc, opts, (name,loc,vars) => {
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [name, loc.file(), haystack.Number.makeInt(loc.line()), vars]));
      return;
    });
    return gb.toGrid();
  }

  trace(errLoc,out,opts) {
    if (out === undefined) out = sys.Env.cur().out();
    if (opts === undefined) opts = null;
    const this$ = this;
    let traceVars = (opts != null && opts.has("vars"));
    this.traceWalk(errLoc, opts, (name,loc,vars) => {
      if (loc === Loc.unknown()) {
        out.printLine(sys.Str.plus("  ", name));
      }
      else {
        out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", name), " ("), loc), ")"));
      }
      ;
      if (traceVars) {
        vars.each((v,n) => {
          out.print(sys.Str.plus(sys.Str.plus("    ", n), ": ")).print(Expr.summary(v)).printLine();
          return;
        });
      }
      ;
      return;
    });
    return;
  }

  traceWalk(errLoc,opts,f) {
    for (let i = sys.Int.minus(this.#stack.size(), 1); sys.ObjUtil.compareGE(i, 1); i = sys.Int.decrement(i)) {
      let frame = this.#stack.get(i);
      let func = frame.func();
      let name = func.name();
      let loc = ((this$) => { let $_u6 = ((this$) => { let $_u7=this$.#stack.getSafe(sys.Int.plus(i, 1)); return ($_u7==null) ? null : $_u7.callLoc(); })(this$); if ($_u6 != null) return $_u6; return errLoc; })(this);
      sys.Func.call(f, name, sys.ObjUtil.coerce(loc, Loc.type$), frame.toDict());
    }
    ;
    return;
  }

  stash() {
    return this.#stashRef;
  }

  toRegex(s) {
    try {
      if (this.#regex == null) {
        this.#regex = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Regex"));
      }
      ;
      let r = this.#regex.get(sys.ObjUtil.coerce(s, sys.Str.type$));
      if (r == null) {
        this.#regex.set(sys.ObjUtil.coerce(s, sys.Str.type$), sys.ObjUtil.coerce((r = sys.Regex.fromStr(sys.ObjUtil.coerce(s, sys.Str.type$))), sys.Regex.type$));
      }
      ;
      return sys.ObjUtil.coerce(r, sys.Regex.type$);
    }
    catch ($_u8) {
      $_u8 = sys.Err.make($_u8);
      if ($_u8 instanceof sys.CastErr) {
        let e = $_u8;
        ;
        throw sys.CastErr.make(sys.Str.plus("regex must be Str, not ", sys.ObjUtil.typeof(s)));
      }
      else {
        throw $_u8;
      }
    }
    ;
  }

  clone() {
    throw sys.UnsupportedErr.make();
  }

  doClone(that) {
    that.#heartbeatFunc = this.#heartbeatFunc;
    that.#timeoutTicks = this.#timeoutTicks;
    that.#stack = this.#stack.dup();
    that.#regex = this.#regex;
    return that;
  }

  static static$init() {
    AxonContext.#timeoutDef = sys.Duration.fromStr("1min");
    return;
  }

}

class CallFrame extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CallFrame.type$; }

  static #rootFunc = undefined;

  static rootFunc() {
    if (CallFrame.#rootFunc === undefined) {
      CallFrame.static$init();
      if (CallFrame.#rootFunc === undefined) CallFrame.#rootFunc = null;
    }
    return CallFrame.#rootFunc;
  }

  static #nullVal = undefined;

  static nullVal() {
    if (CallFrame.#nullVal === undefined) {
      CallFrame.static$init();
      if (CallFrame.#nullVal === undefined) CallFrame.#nullVal = null;
    }
    return CallFrame.#nullVal;
  }

  #cx = null;

  cx() {
    return this.#cx;
  }

  #callLoc = null;

  callLoc() { return this.#callLoc; }

  __callLoc(it) { if (it === undefined) return this.#callLoc; else this.#callLoc = it; }

  #func = null;

  func() { return this.#func; }

  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  #vars = null;

  // private field reflection only
  __vars(it) { if (it === undefined) return this.#vars; else this.#vars = it; }

  static make(cx,func,args,callLoc,vars) {
    const $self = new CallFrame();
    CallFrame.make$($self,cx,func,args,callLoc,vars);
    return $self;
  }

  static make$($self,cx,func,args,callLoc,vars) {
    const this$ = $self;
    $self.#cx = cx;
    $self.#func = func;
    $self.#callLoc = callLoc;
    $self.#vars = vars;
    if (!func.isNative()) {
      func.params().each((param,i) => {
        this$.set(param.name(), args.get(i));
        return;
      });
    }
    ;
    return;
  }

  static makeRoot(cx) {
    const $self = new CallFrame();
    CallFrame.makeRoot$($self,cx);
    return $self;
  }

  static makeRoot$($self,cx) {
    $self.#cx = cx;
    $self.#func = CallFrame.rootFunc();
    $self.#callLoc = $self.#func.loc();
    $self.#vars = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    return;
  }

  has(name) {
    return this.#vars.containsKey(name);
  }

  each(f) {
    this.#vars.each(f);
    return;
  }

  toDict() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    this.#vars.each((v,n) => {
      if ((v != null && !sys.ObjUtil.isImmutable(v))) {
        (v = sys.ObjUtil.toStr(v));
      }
      ;
      acc.set(n, v);
      return;
    });
    return haystack.Etc.makeDict(acc);
  }

  get(name) {
    return this.#vars.get(name);
  }

  set(name,val) {
    this.#vars.set(name, val);
    return val;
  }

  remove(name) {
    this.#vars.remove(name);
    return;
  }

  isVisibleTo(f) {
    while (f != null) {
      if (this.#func === f) {
        return true;
      }
      ;
      (f = f.outer());
    }
    ;
    return this.#func === CallFrame.rootFunc();
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("CallFrame ", this.#func.name()), " ["), this.#callLoc), "]");
  }

  static static$init() {
    CallFrame.#rootFunc = Fn.make(Loc.make("root"), "root", sys.List.make(FnParam.type$));
    CallFrame.#nullVal = "_CallFrame.null_";
    return;
  }

}

class AxonErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AxonErr.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  static make(msg,loc,cause) {
    const $self = new AxonErr();
    AxonErr.make$($self,msg,loc,cause);
    return $self;
  }

  static make$($self,msg,loc,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$), cause);
    $self.#loc = loc;
    return;
  }

  toStr() {
    let str = sys.Err.prototype.toStr.call(this);
    if (!this.#loc.isUnknown()) {
      str = sys.Str.plus(str, sys.Str.plus(sys.Str.plus(" [", this.#loc), "]"));
    }
    ;
    return str;
  }

}

class SyntaxErr extends AxonErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SyntaxErr.type$; }

  static make(msg,loc,cause) {
    const $self = new SyntaxErr();
    SyntaxErr.make$($self,msg,loc,cause);
    return $self;
  }

  static make$($self,msg,loc,cause) {
    if (cause === undefined) cause = null;
    AxonErr.make$($self, msg, loc, cause);
    return;
  }

}

class EvalErr extends AxonErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EvalErr.type$; }

  #axonTrace = null;

  axonTrace() { return this.#axonTrace; }

  __axonTrace(it) { if (it === undefined) return this.#axonTrace; else this.#axonTrace = it; }

  static make(msg,cx,loc,cause) {
    const $self = new EvalErr();
    EvalErr.make$($self,msg,cx,loc,cause);
    return $self;
  }

  static make$($self,msg,cx,loc,cause) {
    if (cause === undefined) cause = null;
    AxonErr.make$($self, msg, loc, cause);
    $self.#axonTrace = cx.traceToStr(loc);
    return;
  }

}

class EvalTimeoutErr extends EvalErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EvalTimeoutErr.type$; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  static make(timeout,cx,loc) {
    const $self = new EvalTimeoutErr();
    EvalTimeoutErr.make$($self,timeout,cx,loc);
    return $self;
  }

  static make$($self,timeout,cx,loc) {
    EvalErr.make$($self, sys.Str.toLocale($self.msg()), cx, loc);
    $self.#meta = haystack.Etc.makeDict(sys.Map.__fromLiteral(["more","timeout"], [haystack.Marker.val(),timeout.toLocale()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    return;
  }

}

class ThrowErr extends EvalErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThrowErr.type$; }

  #tags = null;

  tags() { return this.#tags; }

  __tags(it) { if (it === undefined) return this.#tags; else this.#tags = it; }

  static make(cx,loc,tags) {
    const $self = new ThrowErr();
    ThrowErr.make$($self,cx,loc,tags);
    return $self;
  }

  static make$($self,cx,loc,tags) {
    EvalErr.make$($self, tags.dis(), cx, loc);
    $self.#tags = tags;
    return;
  }

}

class Axon extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#su = false;
    this.#admin = false;
    return;
  }

  typeof() { return Axon.type$; }

  #su = false;

  su() { return this.#su; }

  __su(it) { if (it === undefined) return this.#su; else this.#su = it; }

  #admin = false;

  admin() { return this.#admin; }

  __admin(it) { if (it === undefined) return this.#admin; else this.#admin = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  decode(f) {
    const this$ = this;
    if (this.#su) {
      sys.Func.call(f, "su", haystack.Marker.val());
    }
    ;
    if (this.#admin) {
      sys.Func.call(f, "admin", haystack.Marker.val());
    }
    ;
    if (this.#meta != null) {
      if (sys.ObjUtil.is(this.#meta, sys.Str.type$)) {
        haystack.TrioReader.make(sys.Str.in(sys.ObjUtil.toStr(this.#meta))).readDict().each((v,n) => {
          sys.Func.call(f, n, v);
          return;
        });
      }
      else {
        sys.ObjUtil.coerce(this.#meta, sys.Type.find("[sys::Str:sys::Obj]")).each((v,n) => {
          sys.Func.call(f, n, v);
          return;
        });
      }
      ;
    }
    ;
    return;
  }

  static make(f) {
    const $self = new Axon();
    Axon.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ;
    ((this$) => { let $_u9 = f; if ($_u9 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

}

class Comp {
  constructor() {
    const this$ = this;
  }

  typeof() { return Comp.type$; }

}

class Expr extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  #startLoc = null;

  startLoc(it) {
    if (it === undefined) {
      return this.#startLoc;
    }
    else {
      this.#startLoc = it;
      return;
    }
  }

  #endLoc = null;

  endLoc(it) {
    if (it === undefined) {
      return this.#endLoc;
    }
    else {
      this.#endLoc = it;
      return;
    }
  }

  typeof() { return Expr.type$; }

  encode() {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj?]"));
    acc.set("type", this.type().encode());
    this.walk((k,v) => {
      acc.set(k, this$.encodeNorm(v));
      return;
    });
    return haystack.Etc.makeDict(acc);
  }

  encodeNorm(v) {
    const this$ = this;
    if (sys.ObjUtil.is(v, Expr.type$)) {
      return sys.ObjUtil.coerce(v, Expr.type$).encode();
    }
    ;
    if (sys.ObjUtil.is(v, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(v, sys.Type.find("sys::List")).map((x) => {
        return this$.encodeNorm(x);
      }, sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(v, FnParam.type$)) {
      return sys.ObjUtil.coerce(v, FnParam.type$).encode();
    }
    ;
    return v;
  }

  toStr() {
    let out = Printer.make();
    this.print(out);
    return out.toStr();
  }

  evalToFunc(cx) {
    let t = this.eval(cx);
    let fn = sys.ObjUtil.as(t, Fn.type$);
    if (fn == null) {
      if (sys.ObjUtil.is(t, haystack.Dict.type$)) {
        let dict = sys.ObjUtil.coerce(t, haystack.Dict.type$);
        let name = sys.ObjUtil.as(dict.get("name"), sys.Str.type$);
        if ((dict.has("func") && name != null)) {
          (fn = cx.findTop(sys.ObjUtil.coerce(name, sys.Str.type$), false));
        }
        ;
      }
      ;
      if (fn == null) {
        let var$ = sys.ObjUtil.as(this, Var.type$);
        if (var$ != null) {
          (fn = cx.findTop(var$.name(), false));
          if (fn != null) {
            throw this.err(sys.Str.plus(sys.Str.plus("Local variable ", sys.Str.toCode(var$.name())), " is hiding function"), cx);
          }
          else {
            throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Local variable ", sys.Str.toCode(var$.name())), " is not assigned to a function: "), Expr.summary(t)), cx);
          }
          ;
        }
        ;
        throw this.err(sys.Str.plus("Target does not eval to func: ", Expr.summary(t)), cx);
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(fn, Fn.type$);
  }

  evalToFilter(cx,checked) {
    if (checked === undefined) checked = true;
    return ExprToFilter.make(cx).evalToFilter(this, checked);
  }

  static summary(obj) {
    const this$ = this;
    if (obj == null) {
      return "null";
    }
    ;
    if (sys.ObjUtil.is(obj, Block.type$)) {
      return "Block";
    }
    ;
    if (sys.ObjUtil.is(obj, Fn.type$)) {
      return sys.Str.plus("Func ", sys.ObjUtil.coerce(obj, Fn.type$).sig());
    }
    ;
    if (sys.ObjUtil.is(obj, haystack.Grid.type$)) {
      let grid = sys.ObjUtil.coerce(obj, haystack.Grid.type$);
      let size = "?";
      try {
        (size = sys.Int.toStr(grid.size()));
      }
      catch ($_u10) {
      }
      ;
      return sys.Str.plus(sys.ObjUtil.typeof(obj).name(), sys.Str.plus(sys.Str.plus(sys.Str.plus(" ", sys.ObjUtil.coerce(grid.cols().size(), sys.Obj.type$.toNullable())), "x"), size));
    }
    ;
    if (sys.ObjUtil.is(obj, sys.Type.find("sys::List"))) {
      let list = sys.ObjUtil.coerce(obj, sys.Type.find("sys::List"));
      let s = sys.StrBuf.make();
      s.add("[");
      for (let i = 0; sys.ObjUtil.compareLT(i, list.size()); i = sys.Int.increment(i)) {
        if (sys.ObjUtil.compareGT(i, 0)) {
          s.add(", ");
        }
        ;
        let str = Expr.summary(list.get(i));
        if (sys.ObjUtil.compareGT(sys.Int.plus(s.size(), sys.Str.size(str)), 58)) {
          s.add("...");
          break;
        }
        ;
        s.add(str);
      }
      ;
      s.add("]");
      return s.toStr();
    }
    ;
    if (sys.ObjUtil.is(obj, haystack.Dict.type$)) {
      let dict = sys.ObjUtil.coerce(obj, haystack.Dict.type$);
      let s = sys.StrBuf.make();
      s.add("{");
      try {
        dict.each((v,n) => {
          if (sys.ObjUtil.compareGT(s.size(), 1)) {
            s.add(", ");
          }
          ;
          if (sys.ObjUtil.compareGT(sys.Int.plus(s.size(), sys.Str.size(n)), 50)) {
            throw sys.Err.make();
          }
          ;
          s.add(n);
          if (sys.ObjUtil.equals(v, haystack.Marker.val())) {
            return;
          }
          ;
          s.add(":");
          let str = Expr.summary(v);
          if (sys.ObjUtil.compareGT(sys.Int.plus(s.size(), sys.Str.size(str)), 50)) {
            throw sys.Err.make();
          }
          ;
          s.add(str);
          return;
        });
      }
      catch ($_u11) {
        $_u11 = sys.Err.make($_u11);
        if ($_u11 instanceof sys.Err) {
          let e = $_u11;
          ;
          s.add("...");
        }
        else {
          throw $_u11;
        }
      }
      ;
      s.add("}");
      return s.toStr();
    }
    ;
    let kind = haystack.Kind.fromVal(obj, false);
    if (kind != null) {
      return kind.valToStr(sys.ObjUtil.coerce(obj, sys.Obj.type$));
    }
    ;
    let str = sys.ObjUtil.toStr(obj);
    if (sys.ObjUtil.compareGT(sys.Str.size(str), 60)) {
      (str = sys.Str.plus(sys.Str.getRange(str, sys.Range.make(0, 60)), "..."));
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", str), " is "), sys.ObjUtil.typeof(obj).name());
  }

  err(msg,cx) {
    return EvalErr.make(msg, cx, this.loc());
  }

  foldConst() {
    return this;
  }

  isConst() {
    return false;
  }

  constVal() {
    throw sys.Err.make(sys.Str.plus("Not const: ", this.type()));
  }

  isNull() {
    return (this.type() === ExprType.literal() && sys.ObjUtil.coerce(this, Literal.type$).val() == null);
  }

  isMarker() {
    return (this.type() === ExprType.literal() && sys.ObjUtil.coerce(this, Literal.type$).val() === haystack.Marker.val());
  }

  asCallFuncName() {
    if (this.type() === ExprType.dotCall()) {
      return sys.ObjUtil.coerce(this, DotCall.type$).funcName();
    }
    ;
    if (this.type() === ExprType.call()) {
      let target = sys.ObjUtil.as(sys.ObjUtil.coerce(this, Call.type$).func(), Var.type$);
      if (target != null) {
        let name = target.name();
        let colon = sys.Str.indexr(name, ":");
        if (colon != null) {
          (name = sys.Str.getRange(name, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), -1)));
        }
        ;
        return name;
      }
      ;
    }
    ;
    return null;
  }

  static make() {
    const $self = new Expr();
    Expr.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Call extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Call.type$; }

  #func = null;

  func() { return this.#func; }

  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  #args = null;

  args() { return this.#args; }

  __args(it) { if (it === undefined) return this.#args; else this.#args = it; }

  static make(func,args) {
    const $self = new Call();
    Call.make$($self,func,args);
    return $self;
  }

  static make$($self,func,args) {
    Expr.make$($self);
    $self.#func = func;
    $self.#args = sys.ObjUtil.coerce(((this$) => { let $_u12 = args; if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(args); })($self), sys.Type.find("axon::Expr?[]"));
    return;
  }

  type() {
    return ExprType.call();
  }

  loc() {
    return this.#func.loc();
  }

  funcName() {
    if (sys.ObjUtil.is(this.#func, Var.type$)) {
      return sys.ObjUtil.coerce(this.#func, Var.type$).name();
    }
    ;
    return null;
  }

  eval(cx) {
    return this.evalFunc(cx).callLazy(cx, this.#args, this.loc());
  }

  evalFunc(cx) {
    return this.#func.evalToFunc(cx);
  }

  evalArgs(cx) {
    const this$ = this;
    return this.#args.map((arg) => {
      return arg.eval(cx);
    }, sys.Obj.type$.toNullable());
  }

  walk(f) {
    sys.Func.call(f, "func", this.#func);
    sys.Func.call(f, "args", this.#args);
    return;
  }

  print(out) {
    const this$ = this;
    out.atomicStart().atomic(this.#func).wc(40);
    this.#args.each((arg,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        out.comma();
      }
      ;
      if (arg == null) {
        out.wc(95);
      }
      else {
        arg.print(out);
      }
      ;
      return;
    });
    out.wc(41).atomicEnd();
    return out;
  }

}

class DotCall extends Call {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DotCall.type$; }

  #funcName = null;

  funcName() { return this.#funcName; }

  __funcName(it) { if (it === undefined) return this.#funcName; else this.#funcName = it; }

  static make(funcName,args) {
    const $self = new DotCall();
    DotCall.make$($self,funcName,args);
    return $self;
  }

  static make$($self,funcName,args) {
    Call.make$($self, Var.make(args.first().loc(), funcName), args);
    $self.#funcName = funcName;
    return;
  }

  type() {
    return ExprType.dotCall();
  }

  eval(cx) {
    const this$ = this;
    let target = this.args().first().eval(cx);
    if (target != null) {
      let method = cx.xeto().interfaceMethodOn(sys.ObjUtil.coerce(target, sys.Obj.type$), sys.ObjUtil.coerce(this.#funcName, sys.Str.type$));
      if (method != null) {
        if ((method.isStatic() || method.isCtor())) {
          throw sys.Err.make(sys.Str.plus("Cannot call static method as instance: ", method.qname()));
        }
        ;
        let methodArgs = sys.List.make(sys.Obj.type$.toNullable());
        methodArgs.capacity(sys.Int.minus(this.args().size(), 1));
        this.args().eachRange(sys.Range.make(1, -1), (arg) => {
          methodArgs.add(arg.eval(cx));
          return;
        });
        return method.callOn(target, methodArgs);
      }
      ;
    }
    ;
    let callArgs = this.args().dup().set(0, Literal.wrap(target));
    return this.evalFunc(cx).callLazy(cx, callArgs, this.loc());
  }

  print(out) {
    const this$ = this;
    out.atomicStart().atomic(sys.ObjUtil.coerce(this.args().get(0), Expr.type$)).wc(46).expr(this.func()).wc(40);
    this.args().each((arg,i) => {
      if (sys.ObjUtil.equals(i, 0)) {
        return;
      }
      ;
      if (sys.ObjUtil.compareGT(i, 1)) {
        out.comma();
      }
      ;
      if (arg == null) {
        out.wc(95);
      }
      else {
        arg.print(out);
      }
      ;
      return;
    });
    out.wc(41).atomicEnd();
    return out;
  }

}

class StaticCall extends Call {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StaticCall.type$; }

  #typeRef = null;

  typeRef() { return this.#typeRef; }

  __typeRef(it) { if (it === undefined) return this.#typeRef; else this.#typeRef = it; }

  #funcName = null;

  funcName() { return this.#funcName; }

  __funcName(it) { if (it === undefined) return this.#funcName; else this.#funcName = it; }

  static make(typeRef,funcName,args) {
    const $self = new StaticCall();
    StaticCall.make$($self,typeRef,funcName,args);
    return $self;
  }

  static make$($self,typeRef,funcName,args) {
    Call.make$($self, typeRef, args);
    $self.#typeRef = typeRef;
    $self.#funcName = funcName;
    return;
  }

  type() {
    return ExprType.staticCall();
  }

  eval(cx) {
    let method = cx.xeto().interfaceMethod(sys.ObjUtil.coerce(this.#typeRef.eval(cx), xeto.Spec.type$), sys.ObjUtil.coerce(this.#funcName, sys.Str.type$));
    if (method == null) {
      throw sys.UnknownSlotErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#typeRef), "."), this.#funcName));
    }
    ;
    if ((!method.isStatic() && !method.isCtor())) {
      throw sys.Err.make(sys.Str.plus("Cannot call instance method as static: ", method.qname()));
    }
    ;
    return method.callList(this.evalArgs(cx));
  }

  print(out) {
    const this$ = this;
    out.atomicStart().atomic(this.#typeRef).wc(46).w(sys.ObjUtil.coerce(this.#funcName, sys.Obj.type$)).wc(40);
    this.args().each((arg,i) => {
      if (sys.ObjUtil.compareGT(i, 1)) {
        out.comma();
      }
      ;
      arg.print(out);
      return;
    });
    out.wc(41).atomicEnd();
    return out;
  }

}

class TrapCall extends DotCall {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TrapCall.type$; }

  #tagName = null;

  tagName() { return this.#tagName; }

  __tagName(it) { if (it === undefined) return this.#tagName; else this.#tagName = it; }

  static make(target,tagName) {
    const $self = new TrapCall();
    TrapCall.make$($self,target,tagName);
    return $self;
  }

  static make$($self,target,tagName) {
    DotCall.make$($self, "trap", sys.List.make(Expr.type$, [target, Literal.make(tagName)]));
    $self.#tagName = tagName;
    return;
  }

  type() {
    return ExprType.trapCall();
  }

  print(out) {
    return out.expr(sys.ObjUtil.coerce(this.args().get(0), Expr.type$)).w("->").w(this.#tagName);
  }

}

class PartialCall extends Call {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PartialCall.type$; }

  #params = null;

  params() { return this.#params; }

  __params(it) { if (it === undefined) return this.#params; else this.#params = it; }

  static make(func,args,numPartials) {
    const $self = new PartialCall();
    PartialCall.make$($self,func,args,numPartials);
    return $self;
  }

  static make$($self,func,args,numPartials) {
    Call.make$($self, func, args);
    $self.__func(func);
    $self.__args(sys.ObjUtil.coerce(((this$) => { let $_u13 = args; if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(args); })($self), sys.Type.find("axon::Expr?[]")));
    $self.#params = sys.ObjUtil.coerce(((this$) => { let $_u14 = FnParam.makeNum(numPartials); if ($_u14 == null) return null; return sys.ObjUtil.toImmutable(FnParam.makeNum(numPartials)); })($self), sys.Type.find("axon::FnParam[]"));
    return;
  }

  type() {
    return ExprType.partialCall();
  }

  eval(cx) {
    const this$ = this;
    let partial = 0;
    let boundTarget = this.bind(this.func(), cx);
    let boundArgs = sys.ObjUtil.coerce(this.args().map((arg) => {
      return ((this$) => { if (arg == null) return Var.make(this$.loc(), this$.#params.get(((this$) => { let $_u16 = partial;partial = sys.Int.increment(partial); return $_u16; })(this$)).name()); return this$.bind(sys.ObjUtil.coerce(arg, Expr.type$), cx); })(this$);
    }, Expr.type$), sys.Type.find("axon::Expr[]"));
    let call = Call.make(boundTarget, boundArgs);
    return Fn.make(this.loc(), this.toStr(), this.#params, call);
  }

  bind(expr,cx) {
    let val = expr.eval(cx);
    if (val == null) {
      return Literal.nullVal();
    }
    ;
    if (sys.ObjUtil.isImmutable(val)) {
      return Literal.make(val);
    }
    ;
    return UnsafeLiteral.make(val);
  }

}

class Fn extends Expr {
  constructor() {
    super();
    const this$ = this;
    this.#outerRef = concurrent.AtomicRef.make(null);
    return;
  }

  typeof() { return Fn.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #outerRef = null;

  outerRef() { return this.#outerRef; }

  __outerRef(it) { if (it === undefined) return this.#outerRef; else this.#outerRef = it; }

  #params = null;

  params() { return this.#params; }

  __params(it) { if (it === undefined) return this.#params; else this.#params = it; }

  #body = null;

  body() { return this.#body; }

  __body(it) { if (it === undefined) return this.#body; else this.#body = it; }

  static make(loc,name,params,body) {
    const $self = new Fn();
    Fn.make$($self,loc,name,params,body);
    return $self;
  }

  static make$($self,loc,name,params,body) {
    if (body === undefined) body = Literal.nullVal();
    Expr.make$($self);
    ;
    $self.#loc = loc;
    $self.#name = name;
    $self.#params = sys.ObjUtil.coerce(((this$) => { let $_u17 = params; if ($_u17 == null) return null; return sys.ObjUtil.toImmutable(params); })($self), sys.Type.find("axon::FnParam[]"));
    $self.#body = body;
    return;
  }

  type() {
    return ExprType.func();
  }

  meta() {
    return haystack.Etc.emptyDict();
  }

  isTop() {
    return false;
  }

  outer() {
    return sys.ObjUtil.coerce(this.#outerRef.val(), Fn.type$.toNullable());
  }

  arity() {
    return this.#params.size();
  }

  requiredArity() {
    let i = 0;
    for (; sys.ObjUtil.compareLT(i, this.#params.size()); i = sys.Int.increment(i)) {
      if (!this.#params.get(i).hasDef()) {
        break;
      }
      ;
    }
    ;
    return i;
  }

  eval(cx) {
    return this;
  }

  isComp() {
    return false;
  }

  isNative() {
    return false;
  }

  isSu() {
    return false;
  }

  isAdmin() {
    return false;
  }

  isDeprecated() {
    return false;
  }

  call(cx,args) {
    return this.callx(cx, args, Loc.unknown());
  }

  haystackCall(cx,args) {
    return this.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args);
  }

  callLazy(cx,args,callLoc) {
    const this$ = this;
    return this.callx(cx, args.map((arg) => {
      return arg.eval(cx);
    }, sys.Obj.type$.toNullable()), callLoc);
  }

  callx(cx,args,callLoc) {
    cx.heartbeat(callLoc);
    if (sys.ObjUtil.compareNE(this.arity(), args.size())) {
      (args = args.rw());
      while (sys.ObjUtil.compareLT(args.size(), this.#params.size())) {
        let def = this.#params.get(args.size()).def();
        if (def == null) {
          break;
        }
        ;
        args.add(def.eval(cx));
      }
      ;
      if (sys.ObjUtil.compareLT(args.size(), this.#params.size())) {
        throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid number of args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected "), sys.ObjUtil.coerce(this.arity(), sys.Obj.type$.toNullable())), cx);
      }
      ;
    }
    ;
    return cx.callInNewFrame(this, args, callLoc);
  }

  doCall(cx,args) {
    let result = null;
    try {
      (result = this.#body.eval(cx));
    }
    catch ($_u18) {
      $_u18 = sys.Err.make($_u18);
      if ($_u18 instanceof ReturnErr) {
        let e = $_u18;
        ;
        (result = ReturnErr.getVal());
      }
      else {
        throw $_u18;
      }
    }
    ;
    if (sys.ObjUtil.is(result, haystack.Grid.type$)) {
      sys.ObjUtil.coerce(result, haystack.Grid.type$).first();
    }
    ;
    return result;
  }

  evalParamDef(cx,param) {
    if (param.def() == null) {
      throw sys.Err.make(sys.Str.plus("Param has no def: ", param.name()));
    }
    ;
    return param.def().eval(cx);
  }

  sig() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(this.#name, "("), this.#params.join(",")), ")");
  }

  walk(f) {
    sys.Func.call(f, "params", this.#params);
    sys.Func.call(f, "body", this.#body);
    return;
  }

  print(out) {
    const this$ = this;
    out.atomicStart().wc(40);
    this.#params.each((p,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        out.comma();
      }
      ;
      p.print(out);
      return;
    });
    out.w(") => ");
    this.#body.print(out);
    return out.atomicEnd();
  }

  toFunc() {
    const this$ = this;
    let cx = sys.ObjUtil.coerce(AxonContext.curAxon().clone(), AxonContext.type$.toNullable());
    let $_u19 = this.#params.size();
    if (sys.ObjUtil.equals($_u19, 0)) {
      return () => {
        return this$.call(sys.ObjUtil.coerce(cx, AxonContext.type$), sys.List.make(sys.Obj.type$.toNullable()));
      };
    }
    else if (sys.ObjUtil.equals($_u19, 1)) {
      return (a) => {
        return this$.call(sys.ObjUtil.coerce(cx, AxonContext.type$), sys.List.make(sys.Obj.type$.toNullable(), [a]));
      };
    }
    else if (sys.ObjUtil.equals($_u19, 2)) {
      return (a,b) => {
        return this$.call(sys.ObjUtil.coerce(cx, AxonContext.type$), sys.List.make(sys.Obj.type$.toNullable(), [a, b]));
      };
    }
    else if (sys.ObjUtil.equals($_u19, 3)) {
      return (a,b,c) => {
        return this$.call(sys.ObjUtil.coerce(cx, AxonContext.type$), sys.List.make(sys.Obj.type$.toNullable(), [a, b, c]));
      };
    }
    else if (sys.ObjUtil.equals($_u19, 4)) {
      return (a,b,c,d) => {
        return this$.call(sys.ObjUtil.coerce(cx, AxonContext.type$), sys.List.make(sys.Obj.type$.toNullable(), [a, b, c, d]));
      };
    }
    else if (sys.ObjUtil.equals($_u19, 5)) {
      return (a,b,c,d,e) => {
        return this$.call(sys.ObjUtil.coerce(cx, AxonContext.type$), sys.List.make(sys.Obj.type$.toNullable(), [a, b, c, d, e]));
      };
    }
    else {
      throw sys.Err.make(sys.Str.plus("Too many params to map to sys::Func ", this.#loc));
    }
    ;
  }

}

class TopFn extends Fn {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TopFn.type$; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #isAdmin = false;

  isAdmin() { return this.#isAdmin; }

  __isAdmin(it) { if (it === undefined) return this.#isAdmin; else this.#isAdmin = it; }

  #isSu = false;

  isSu() { return this.#isSu; }

  __isSu(it) { if (it === undefined) return this.#isSu; else this.#isSu = it; }

  #isDeprecated = false;

  isDeprecated() { return this.#isDeprecated; }

  __isDeprecated(it) { if (it === undefined) return this.#isDeprecated; else this.#isDeprecated = it; }

  static make(loc,name,meta,params,body) {
    const $self = new TopFn();
    TopFn.make$($self,loc,name,meta,params,body);
    return $self;
  }

  static make$($self,loc,name,meta,params,body) {
    if (body === undefined) body = Literal.nullVal();
    Fn.make$($self, loc, name, params, body);
    $self.#meta = meta;
    $self.#isSu = meta.has("su");
    $self.#isAdmin = ($self.#isSu || meta.has("admin"));
    $self.#isDeprecated = meta.has("deprecated");
    return;
  }

  isTop() {
    return true;
  }

  isLazy() {
    return false;
  }

  toStr() {
    return this.name();
  }

  callx(cx,args,callLoc) {
    cx.checkCall(this);
    return Fn.prototype.callx.call(this, cx, args, callLoc);
  }

}

class FnParam extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FnParam.type$; }

  static #cells = undefined;

  static cells() {
    if (FnParam.#cells === undefined) {
      FnParam.static$init();
      if (FnParam.#cells === undefined) FnParam.#cells = null;
    }
    return FnParam.#cells;
  }

  static #byNum = undefined;

  static byNum() {
    if (FnParam.#byNum === undefined) {
      FnParam.static$init();
      if (FnParam.#byNum === undefined) FnParam.#byNum = null;
    }
    return FnParam.#byNum;
  }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #def = null;

  def() { return this.#def; }

  __def(it) { if (it === undefined) return this.#def; else this.#def = it; }

  #hasDef = false;

  hasDef() { return this.#hasDef; }

  __hasDef(it) { if (it === undefined) return this.#hasDef; else this.#hasDef = it; }
  
  #startLoc = null;

  startLoc(it) {
    if (it === undefined) {
      return this.#startLoc;
    }
    else {
      this.#startLoc = it;
      return;
    }
  }

  #endLoc = null;

  endLoc(it) {
    if (it === undefined) {
      return this.#endLoc;
    }
    else {
      this.#endLoc = it;
      return;
    }
  }

  static makeNum(num) {
    return FnParam.byNum().get(num);
  }

  static makeFanList(f) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.Func.params(f).map((p) => {
      return FnParam.makeFan(p);
    }, FnParam.type$), sys.Type.find("axon::FnParam[]"));
  }

  static makeFan(p) {
    const $self = new FnParam();
    FnParam.makeFan$($self,p);
    return $self;
  }

  static makeFan$($self,p) {
    $self.#name = p.name();
    $self.#hasDef = p.hasDefault();
    return;
  }

  static make(name,def) {
    const $self = new FnParam();
    FnParam.make$($self,name,def);
    return $self;
  }

  static make$($self,name,def) {
    if (def === undefined) def = null;
    $self.#name = name;
    $self.#def = def;
    $self.#hasDef = def != null;
    return;
  }

  encode() {
    return ((this$) => { if (this$.#def == null) return haystack.Etc.makeDict1("name", this$.#name); return haystack.Etc.makeDict2("name", this$.#name, "def", this$.#def.encode()); })(this);
  }

  print(out) {
    out.w(this.#name);
    if (this.#def != null) {
      out.wc(58).expr(sys.ObjUtil.coerce(this.#def, Expr.type$));
    }
    ;
    return;
  }

  toStr() {
    return ((this$) => { if (this$.#def == null) return this$.#name; return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#name), ": "), this$.#def); })(this);
  }

  static static$init() {
    const this$ = this;
    FnParam.#cells = sys.ObjUtil.coerce(((this$) => { let $_u22 = sys.List.make(FnParam.type$, [FnParam.make("cells")]); if ($_u22 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(FnParam.type$, [FnParam.make("cells")])); })(this), sys.Type.find("axon::FnParam[]"));
    if (true) {
      let acc = sys.List.make(sys.Type.find("axon::FnParam[]"));
      sys.Int.times(20, (num) => {
        let params = sys.List.make(FnParam.type$);
        sys.Int.times(num, (i) => {
          params.add(FnParam.make(sys.Int.toChar(sys.Int.plus(97, i))));
          return;
        });
        acc.add(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(params), sys.Type.find("axon::FnParam[]")));
        return;
      });
      FnParam.#byNum = sys.ObjUtil.coerce(((this$) => { let $_u23 = acc; if ($_u23 == null) return null; return sys.ObjUtil.toImmutable(acc); })(this), sys.Type.find("axon::FnParam[][]"));
    }
    ;
    return;
  }

}

class ReturnErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReturnErr.type$; }

  static make() {
    const $self = new ReturnErr();
    ReturnErr.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Err.make$($self, "");
    return;
  }

  static getVal() {
    return concurrent.Actor.locals().remove("axon.returnVal");
  }

  static putVal(v) {
    concurrent.Actor.locals().set("axon.returnVal", v);
    return;
  }

}

class UnaryOp extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnaryOp.type$; }

  #operand = null;

  operand() { return this.#operand; }

  __operand(it) { if (it === undefined) return this.#operand; else this.#operand = it; }

  static make(operand) {
    const $self = new UnaryOp();
    UnaryOp.make$($self,operand);
    return $self;
  }

  static make$($self,operand) {
    Expr.make$($self);
    $self.#operand = operand;
    return;
  }

  loc() {
    return this.#operand.loc();
  }

  eval(cx) {
    try {
      return this.doEval(cx);
    }
    catch ($_u24) {
      $_u24 = sys.Err.make($_u24);
      if ($_u24 instanceof EvalErr) {
        let e = $_u24;
        ;
        throw e;
      }
      else if ($_u24 instanceof sys.Err) {
        let e = $_u24;
        ;
        throw this.err(e.toStr(), cx);
      }
      else {
        throw $_u24;
      }
    }
    ;
  }

  walk(f) {
    sys.Func.call(f, "operand", this.#operand);
    return;
  }

  print(out) {
    return out.w(sys.ObjUtil.coerce(this.type().op(), sys.Obj.type$)).wc(32).atomic(this.#operand);
  }

}

class BinaryOp extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BinaryOp.type$; }

  #lhs = null;

  lhs() { return this.#lhs; }

  __lhs(it) { if (it === undefined) return this.#lhs; else this.#lhs = it; }

  #rhs = null;

  rhs() { return this.#rhs; }

  __rhs(it) { if (it === undefined) return this.#rhs; else this.#rhs = it; }

  static make(lhs,rhs) {
    const $self = new BinaryOp();
    BinaryOp.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    Expr.make$($self);
    $self.#lhs = lhs;
    $self.#rhs = rhs;
    $self.startLoc(lhs.startLoc())
    $self.endLoc(rhs.endLoc())
    return;
  }

  loc() {
    return this.#lhs.loc();
  }

  eval(cx) {
    try {
      return this.doEval(cx);
    }
    catch ($_u25) {
      $_u25 = sys.Err.make($_u25);
      if ($_u25 instanceof EvalErr) {
        let e = $_u25;
        ;
        throw e;
      }
      else if ($_u25 instanceof sys.Err) {
        let e = $_u25;
        ;
        throw this.err(e.toStr(), cx);
      }
      else {
        throw $_u25;
      }
    }
    ;
  }

  walk(f) {
    sys.Func.call(f, "lhs", this.#lhs);
    sys.Func.call(f, "rhs", this.#rhs);
    return;
  }

  print(out) {
    return out.atomicStart().atomic(this.#lhs).wc(32).w(sys.ObjUtil.coerce(this.type().op(), sys.Obj.type$)).wc(32).atomic(this.#rhs).atomicEnd();
  }

}

class Return extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Return.type$; }

  #expr = null;

  expr() { return this.#expr; }

  __expr(it) { if (it === undefined) return this.#expr; else this.#expr = it; }

  static make(expr) {
    const $self = new Return();
    Return.make$($self,expr);
    return $self;
  }

  static make$($self,expr) {
    Expr.make$($self);
    $self.#expr = expr;
    return;
  }

  type() {
    return ExprType.returnExpr();
  }

  loc() {
    return this.#expr.loc();
  }

  eval(cx) {
    ReturnErr.putVal(this.#expr.eval(cx));
    throw ReturnErr.make();
  }

  walk(f) {
    sys.Func.call(f, "expr", this.#expr);
    return;
  }

  print(out) {
    return out.w("return ").expr(this.#expr);
  }

}

class Throw extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Throw.type$; }

  #expr = null;

  expr() { return this.#expr; }

  __expr(it) { if (it === undefined) return this.#expr; else this.#expr = it; }

  static make(expr) {
    const $self = new Throw();
    Throw.make$($self,expr);
    return $self;
  }

  static make$($self,expr) {
    Expr.make$($self);
    $self.#expr = expr;
    return;
  }

  type() {
    return ExprType.throwExpr();
  }

  loc() {
    return this.#expr.loc();
  }

  eval(cx) {
    const this$ = this;
    let raw = this.#expr.eval(cx);
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    if (sys.ObjUtil.is(raw, haystack.Dict.type$)) {
      let dict = sys.ObjUtil.coerce(raw, haystack.Dict.type$);
      if ((dict.get("err") === haystack.Marker.val() && sys.ObjUtil.is(dict.get("dis"), sys.Str.type$))) {
        throw ThrowErr.make(cx, this.loc(), dict);
      }
      ;
      dict.each((v,n) => {
        tags.set(n, v);
        return;
      });
      if (tags.get("dis") == null) {
        tags.set("dis", "null");
      }
      ;
    }
    ;
    tags.set("err", haystack.Marker.val());
    if (tags.get("dis") == null) {
      tags.set("dis", sys.ObjUtil.coerce(((this$) => { let $_u26 = ((this$) => { let $_u27 = raw; if ($_u27 == null) return null; return sys.ObjUtil.toStr(raw); })(this$); if ($_u26 != null) return $_u26; return "null"; })(this), sys.Obj.type$));
    }
    ;
    throw ThrowErr.make(cx, this.loc(), haystack.Etc.makeDict(tags));
  }

  walk(f) {
    sys.Func.call(f, "expr", this.#expr);
    return;
  }

  print(out) {
    return out.atomicStart().w("throw ").expr(this.#expr).atomicEnd();
  }

}

class TryCatch extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TryCatch.type$; }

  #tryExpr = null;

  tryExpr() { return this.#tryExpr; }

  __tryExpr(it) { if (it === undefined) return this.#tryExpr; else this.#tryExpr = it; }

  #errVarName = null;

  errVarName() { return this.#errVarName; }

  __errVarName(it) { if (it === undefined) return this.#errVarName; else this.#errVarName = it; }

  #catchExpr = null;

  catchExpr() { return this.#catchExpr; }

  __catchExpr(it) { if (it === undefined) return this.#catchExpr; else this.#catchExpr = it; }

  static make(tryExpr,errVarName,catchExpr) {
    const $self = new TryCatch();
    TryCatch.make$($self,tryExpr,errVarName,catchExpr);
    return $self;
  }

  static make$($self,tryExpr,errVarName,catchExpr) {
    Expr.make$($self);
    $self.#tryExpr = tryExpr;
    $self.#errVarName = errVarName;
    $self.#catchExpr = catchExpr;
    return;
  }

  type() {
    return ExprType.tryExpr();
  }

  loc() {
    return this.#tryExpr.loc();
  }

  eval(cx) {
    try {
      return this.#tryExpr.eval(cx);
    }
    catch ($_u28) {
      $_u28 = sys.Err.make($_u28);
      if ($_u28 instanceof ReturnErr) {
        let e = $_u28;
        ;
        return ReturnErr.getVal();
      }
      else if ($_u28 instanceof sys.Err) {
        let e = $_u28;
        ;
        if (this.#errVarName == null) {
          return this.#catchExpr.eval(cx);
        }
        ;
        let tags = null;
        if (sys.ObjUtil.is(e, ThrowErr.type$)) {
          (tags = haystack.Etc.dictSet(sys.ObjUtil.coerce(e, ThrowErr.type$).tags(), "errTrace", e.traceToStr()));
        }
        else {
          (tags = haystack.Etc.makeDict(sys.Map.__fromLiteral(["err","dis","type","errTrace"], [haystack.Marker.val(),e.toStr(),sys.ObjUtil.typeof(e).qname(),e.traceToStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))));
        }
        ;
        cx.defOrAssign(sys.ObjUtil.coerce(this.#errVarName, sys.Str.type$), tags, this.#catchExpr.loc());
        return this.#catchExpr.eval(cx);
      }
      else {
        throw $_u28;
      }
    }
    ;
  }

  walk(f) {
    sys.Func.call(f, "tryExpr", this.#tryExpr);
    if (this.#errVarName != null) {
      sys.Func.call(f, "errVarName", this.#errVarName);
    }
    ;
    sys.Func.call(f, "catchExpr", this.#catchExpr);
    return;
  }

  print(out) {
    out.atomicStart().w("try ");
    this.#tryExpr.print(out);
    out.w(" catch ");
    if (this.#errVarName != null) {
      out.wc(40).w(sys.ObjUtil.coerce(this.#errVarName, sys.Obj.type$)).w(") ");
    }
    ;
    this.#catchExpr.print(out).atomicEnd();
    return out;
  }

}

class If extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return If.type$; }

  #cond = null;

  cond() { return this.#cond; }

  __cond(it) { if (it === undefined) return this.#cond; else this.#cond = it; }

  #ifExpr = null;

  ifExpr() { return this.#ifExpr; }

  __ifExpr(it) { if (it === undefined) return this.#ifExpr; else this.#ifExpr = it; }

  #elseExpr = null;

  elseExpr() { return this.#elseExpr; }

  __elseExpr(it) { if (it === undefined) return this.#elseExpr; else this.#elseExpr = it; }

  static make(cond,ifExpr,elseExpr) {
    const $self = new If();
    If.make$($self,cond,ifExpr,elseExpr);
    return $self;
  }

  static make$($self,cond,ifExpr,elseExpr) {
    if (elseExpr === undefined) elseExpr = Literal.nullVal();
    Expr.make$($self);
    $self.#cond = cond;
    $self.#ifExpr = ifExpr;
    $self.#elseExpr = elseExpr;
    return;
  }

  type() {
    return ExprType.ifExpr();
  }

  loc() {
    return this.#cond.loc();
  }

  eval(cx) {
    if (sys.ObjUtil.coerce(this.#cond.eval(cx), sys.Bool.type$)) {
      return this.#ifExpr.eval(cx);
    }
    else {
      return this.#elseExpr.eval(cx);
    }
    ;
  }

  walk(f) {
    sys.Func.call(f, "cond", this.#cond);
    sys.Func.call(f, "ifExpr", this.#ifExpr);
    if (!this.#elseExpr.isNull()) {
      sys.Func.call(f, "elseExpr", this.#elseExpr);
    }
    ;
    return;
  }

  print(out) {
    out.atomicStart().w("if (");
    this.#cond.print(out);
    out.w(") ");
    this.#ifExpr.print(out);
    if (!this.#elseExpr.isNull()) {
      out.w(" else ");
      this.#elseExpr.print(out);
    }
    ;
    return out.atomicEnd();
  }

}

class Assign extends BinaryOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Assign.type$; }

  static make(lhs,rhs) {
    const $self = new Assign();
    Assign.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    BinaryOp.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.assign();
  }

  doEval(cx) {
    let var$ = ((this$) => { let $_u29 = sys.ObjUtil.as(this$.lhs(), Var.type$); if ($_u29 != null) return $_u29; throw this$.err(sys.Str.plus("Not assignable: ", Expr.summary(this$.lhs())), cx); })(this);
    return cx.assign(var$.name(), this.rhs().eval(cx), this.lhs().loc());
  }

  print(out) {
    return out.atomicStart().expr(this.lhs()).wc(32).w(sys.ObjUtil.coerce(this.type().op(), sys.Obj.type$)).wc(32).expr(this.rhs()).atomicEnd();
  }

}

class Not extends UnaryOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Not.type$; }

  static make(operand) {
    const $self = new Not();
    Not.make$($self,operand);
    return $self;
  }

  static make$($self,operand) {
    UnaryOp.make$($self, operand);
    return;
  }

  type() {
    return ExprType.not();
  }

  doEval(cx) {
    return sys.ObjUtil.coerce(sys.Bool.not(sys.ObjUtil.coerce(this.operand().eval(cx), sys.Bool.type$)), sys.Obj.type$.toNullable());
  }

}

class And extends BinaryOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return And.type$; }

  static make(lhs,rhs) {
    const $self = new And();
    And.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    BinaryOp.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.and();
  }

  doEval(cx) {
    if (sys.ObjUtil.coerce(this.lhs().eval(cx), sys.Bool.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.rhs().eval(cx), sys.Bool.type$), sys.Obj.type$.toNullable());
    }
    else {
      return sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable());
    }
    ;
  }

}

class Or extends BinaryOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Or.type$; }

  static make(lhs,rhs) {
    const $self = new Or();
    Or.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    BinaryOp.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.or();
  }

  doEval(cx) {
    if (sys.ObjUtil.coerce(this.lhs().eval(cx), sys.Bool.type$)) {
      return sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable());
    }
    else {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.rhs().eval(cx), sys.Bool.type$), sys.Obj.type$.toNullable());
    }
    ;
  }

}

class Eq extends BinaryOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Eq.type$; }

  static make(lhs,rhs) {
    const $self = new Eq();
    Eq.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    BinaryOp.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.eq();
  }

  doEval(cx) {
    return sys.ObjUtil.coerce(this.eq(cx), sys.Obj.type$.toNullable());
  }

  eq(cx) {
    let a = this.lhs().eval(cx);
    let at = ((this$) => { let $_u30 = a; if ($_u30 == null) return null; return sys.ObjUtil.typeof(a); })(this);
    let b = this.rhs().eval(cx);
    let bt = ((this$) => { let $_u31 = b; if ($_u31 == null) return null; return sys.ObjUtil.typeof(b); })(this);
    if ((at === haystack.Number.type$ && bt === haystack.Number.type$)) {
      return this.evalNumber(sys.ObjUtil.coerce(a, haystack.Number.type$), sys.ObjUtil.coerce(b, haystack.Number.type$));
    }
    ;
    return sys.ObjUtil.equals(a, b);
  }

  evalNumber(a,b) {
    if (sys.ObjUtil.compareNE(sys.ObjUtil.compare(a.toFloat(), sys.ObjUtil.coerce(b.toFloat(), sys.Obj.type$)), 0)) {
      return false;
    }
    ;
    if (a.unit() === b.unit()) {
      return true;
    }
    ;
    if ((a.unit() == null || b.unit() == null)) {
      return true;
    }
    ;
    return false;
  }

}

class Ne extends Eq {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Ne.type$; }

  static make(lhs,rhs) {
    const $self = new Ne();
    Ne.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    Eq.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.ne();
  }

  doEval(cx) {
    return sys.ObjUtil.coerce(!this.eq(cx), sys.Obj.type$.toNullable());
  }

}

class Compare extends BinaryOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Compare.type$; }

  static make(lhs,rhs) {
    const $self = new Compare();
    Compare.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    BinaryOp.make$($self, lhs, rhs);
    return;
  }

  doEval(cx) {
    let a = this.lhs().eval(cx);
    let b = this.rhs().eval(cx);
    if ((a == null || b == null)) {
      return this.cmp(a, b);
    }
    ;
    let ak = haystack.Kind.fromType(sys.ObjUtil.typeof(a), false);
    let bk = haystack.Kind.fromType(sys.ObjUtil.typeof(b), false);
    if ((ak != null && ak === bk && !ak.isCollection())) {
      return this.cmp(a, b);
    }
    ;
    let adis = ((this$) => { let $_u32 = ((this$) => { let $_u33=ak; return ($_u33==null) ? null : $_u33.name(); })(this$); if ($_u32 != null) return $_u32; return sys.ObjUtil.typeof(a).toStr(); })(this);
    let bdis = ((this$) => { let $_u34 = ((this$) => { let $_u35=bk; return ($_u35==null) ? null : $_u35.name(); })(this$); if ($_u34 != null) return $_u34; return sys.ObjUtil.typeof(b).toStr(); })(this);
    throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot compare types: ", adis), " "), this.type().op()), " "), bdis), cx);
  }

}

class Lt extends Compare {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Lt.type$; }

  static make(lhs,rhs) {
    const $self = new Lt();
    Lt.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    Compare.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.lt();
  }

  cmp(a,b) {
    return sys.ObjUtil.coerce(sys.ObjUtil.compareLT(a, b), sys.Obj.type$.toNullable());
  }

}

class Le extends Compare {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Le.type$; }

  static make(lhs,rhs) {
    const $self = new Le();
    Le.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    Compare.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.le();
  }

  cmp(a,b) {
    return sys.ObjUtil.coerce(sys.ObjUtil.compareLE(a, b), sys.Obj.type$.toNullable());
  }

}

class Ge extends Compare {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Ge.type$; }

  static make(lhs,rhs) {
    const $self = new Ge();
    Ge.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    Compare.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.ge();
  }

  cmp(a,b) {
    return sys.ObjUtil.coerce(sys.ObjUtil.compareGE(a, b), sys.Obj.type$.toNullable());
  }

}

class Gt extends Compare {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Gt.type$; }

  static make(lhs,rhs) {
    const $self = new Gt();
    Gt.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    Compare.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.gt();
  }

  cmp(a,b) {
    return sys.ObjUtil.coerce(sys.ObjUtil.compareGT(a, b), sys.Obj.type$.toNullable());
  }

}

class Cmp extends Compare {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Cmp.type$; }

  static make(lhs,rhs) {
    const $self = new Cmp();
    Cmp.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    Compare.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.cmp();
  }

  cmp(a,b) {
    let r = sys.ObjUtil.compare(a, b);
    if (sys.ObjUtil.compareLT(r, 0)) {
      return haystack.Number.negOne();
    }
    ;
    if (sys.ObjUtil.compareGT(r, 0)) {
      return haystack.Number.one();
    }
    ;
    return haystack.Number.zero();
  }

}

class Neg extends UnaryOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Neg.type$; }

  static make(operand) {
    const $self = new Neg();
    Neg.make$($self,operand);
    return $self;
  }

  static make$($self,operand) {
    UnaryOp.make$($self, operand);
    return;
  }

  type() {
    return ExprType.neg();
  }

  foldConst() {
    if ((this.operand().isConst() && sys.ObjUtil.is(this.operand().constVal(), haystack.Number.type$))) {
      return Literal.make(sys.ObjUtil.coerce(this.operand().constVal(), haystack.Number.type$).negate());
    }
    else {
      return UnaryOp.prototype.foldConst.call(this);
    }
    ;
  }

  doEval(cx) {
    let a = this.operand().eval(cx);
    if (a == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(a, haystack.Number.type$)) {
      return sys.ObjUtil.coerce(a, haystack.Number.type$).negate();
    }
    ;
    if (a === haystack.NA.val()) {
      return haystack.NA.val();
    }
    ;
    throw this.err(sys.Str.plus("Unsupported operation neg on ", sys.ObjUtil.typeof(a)), cx);
  }

}

class BinaryMath extends BinaryOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BinaryMath.type$; }

  static make(lhs,rhs) {
    const $self = new BinaryMath();
    BinaryMath.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    BinaryOp.make$($self, lhs, rhs);
    return;
  }

  doEval(cx) {
    let a = this.lhs().eval(cx);
    let at = ((this$) => { let $_u36 = a; if ($_u36 == null) return null; return sys.ObjUtil.typeof(a); })(this);
    let b = this.rhs().eval(cx);
    let bt = ((this$) => { let $_u37 = b; if ($_u37 == null) return null; return sys.ObjUtil.typeof(b); })(this);
    if (sys.ObjUtil.compareNE(at, bt)) {
      if ((at === sys.Str.type$ || (bt === sys.Str.type$ && at !== sys.Uri.type$))) {
        (a = ((this$) => { if (a == null) return "null"; return sys.ObjUtil.toStr(a); })(this));
        (at = sys.Str.type$);
        (b = ((this$) => { if (b == null) return "null"; return sys.ObjUtil.toStr(b); })(this));
        (bt = sys.Str.type$);
      }
      ;
    }
    ;
    if ((a == null || b == null)) {
      return null;
    }
    ;
    if ((a === haystack.NA.val() || b === haystack.NA.val())) {
      return haystack.NA.val();
    }
    ;
    if (at === haystack.Number.type$) {
      return this.evalNumber(sys.ObjUtil.coerce(a, haystack.Number.type$), sys.ObjUtil.coerce(b, haystack.Number.type$), cx);
    }
    ;
    if (at === sys.Str.type$) {
      return this.evalStr(sys.ObjUtil.coerce(a, sys.Str.type$), sys.ObjUtil.coerce(b, sys.Str.type$), cx);
    }
    ;
    if (at === sys.Date.type$) {
      return this.evalDate(sys.ObjUtil.coerce(a, sys.Date.type$), sys.ObjUtil.coerce(b, sys.Obj.type$), cx);
    }
    ;
    if (at === sys.DateTime.type$) {
      return this.evalDateTime(sys.ObjUtil.coerce(a, sys.DateTime.type$), sys.ObjUtil.coerce(b, sys.Obj.type$), cx);
    }
    ;
    if (at === sys.Time.type$) {
      return this.evalTime(sys.ObjUtil.coerce(a, sys.Time.type$), sys.ObjUtil.coerce(b, sys.Obj.type$), cx);
    }
    ;
    if (at === haystack.DateSpan.type$) {
      return this.evalDateSpan(sys.ObjUtil.coerce(a, haystack.DateSpan.type$), sys.ObjUtil.coerce(b, sys.Obj.type$), cx);
    }
    ;
    if (at === sys.Uri.type$) {
      return this.evalUri(sys.ObjUtil.coerce(a, sys.Uri.type$), sys.ObjUtil.coerce(b, sys.Obj.type$), cx);
    }
    ;
    throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unsupported operation ", at), " "), this.type()), " "), bt), cx);
  }

  evalStr(a,b,cx) {
    throw this.err(sys.Str.plus(sys.Str.plus("Unsupported ", this.type()), " on Str"), cx);
  }

  evalDate(a,b,cx) {
    throw this.err(sys.Str.plus(sys.Str.plus("Unsupported ", this.type()), " on Date"), cx);
  }

  evalDateTime(a,b,cx) {
    throw this.err(sys.Str.plus(sys.Str.plus("Unsupported ", this.type()), " on DateTime"), cx);
  }

  evalTime(a,b,cx) {
    throw this.err(sys.Str.plus(sys.Str.plus("Unsupported ", this.type()), " on Time"), cx);
  }

  evalDateSpan(a,b,cx) {
    throw this.err(sys.Str.plus(sys.Str.plus("Unsupported ", this.type()), " on DateSpan"), cx);
  }

  evalUri(a,b,cx) {
    throw this.err(sys.Str.plus(sys.Str.plus("Unsupported ", this.type()), " on Uri"), cx);
  }

}

class Add extends BinaryMath {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Add.type$; }

  static make(lhs,rhs) {
    const $self = new Add();
    Add.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    BinaryMath.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.add();
  }

  evalNumber(a,b,cx) {
    return a.plus(b);
  }

  evalStr(a,b,cx) {
    return sys.Str.plus(a, b);
  }

  evalDate(a,b,cx) {
    if (sys.ObjUtil.is(b, haystack.Number.type$)) {
      return a.plus(sys.ObjUtil.coerce(sys.ObjUtil.coerce(b, haystack.Number.type$).toDuration(), sys.Duration.type$));
    }
    ;
    throw this.err(sys.Str.plus("Unsupported operation: Date + ", sys.ObjUtil.typeof(b)), cx);
  }

  evalDateTime(a,b,cx) {
    if (sys.ObjUtil.is(b, haystack.Number.type$)) {
      return a.plus(sys.ObjUtil.coerce(sys.ObjUtil.coerce(b, haystack.Number.type$).toDuration(), sys.Duration.type$));
    }
    ;
    throw this.err(sys.Str.plus("Unsupported operation: DateTime + ", sys.ObjUtil.typeof(b)), cx);
  }

  evalDateSpan(a,b,cx) {
    if (sys.ObjUtil.is(b, haystack.Number.type$)) {
      return a.plus(sys.ObjUtil.coerce(sys.ObjUtil.coerce(b, haystack.Number.type$).toDuration(), sys.Duration.type$));
    }
    ;
    throw this.err(sys.Str.plus("Unsupported operation: DateSpan + ", sys.ObjUtil.typeof(b)), cx);
  }

  evalTime(a,b,cx) {
    if (sys.ObjUtil.is(b, haystack.Number.type$)) {
      return a.plus(sys.ObjUtil.coerce(sys.ObjUtil.coerce(b, haystack.Number.type$).toDuration(), sys.Duration.type$));
    }
    ;
    throw this.err(sys.Str.plus("Unsupported operation: Time + ", sys.ObjUtil.typeof(b)), cx);
  }

  evalUri(a,b,cx) {
    if (sys.ObjUtil.is(b, sys.Str.type$)) {
      return a.plus(sys.Str.toUri(sys.ObjUtil.toStr(b)));
    }
    ;
    if (sys.ObjUtil.is(b, sys.Uri.type$)) {
      return a.plus(sys.ObjUtil.coerce(b, sys.Uri.type$));
    }
    ;
    throw this.err(sys.Str.plus("Unsupported operation: Uri + ", sys.ObjUtil.typeof(b)), cx);
  }

}

class Sub extends BinaryMath {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Sub.type$; }

  static make(lhs,rhs) {
    const $self = new Sub();
    Sub.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    BinaryMath.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.sub();
  }

  evalNumber(a,b,cx) {
    return a.minus(b);
  }

  evalDate(a,b,cx) {
    if (sys.ObjUtil.is(b, haystack.Number.type$)) {
      return a.plus(sys.ObjUtil.coerce(sys.ObjUtil.coerce(b, haystack.Number.type$).negate().toDuration(), sys.Duration.type$));
    }
    ;
    if (sys.ObjUtil.is(b, sys.Date.type$)) {
      return haystack.Number.makeDuration(a.minusDate(sys.ObjUtil.coerce(b, sys.Date.type$)), sys.Unit.fromStr("day"));
    }
    ;
    throw this.err(sys.Str.plus("Unsupported operation: Date - ", sys.ObjUtil.typeof(b)), cx);
  }

  evalDateTime(a,b,cx) {
    if (sys.ObjUtil.is(b, haystack.Number.type$)) {
      return a.plus(sys.ObjUtil.coerce(sys.ObjUtil.coerce(b, haystack.Number.type$).negate().toDuration(), sys.Duration.type$));
    }
    ;
    if (sys.ObjUtil.is(b, sys.DateTime.type$)) {
      return haystack.Number.makeDuration(a.minusDateTime(sys.ObjUtil.coerce(b, sys.DateTime.type$)));
    }
    ;
    throw this.err(sys.Str.plus("Unsupported operation: DateTime - ", sys.ObjUtil.typeof(b)), cx);
  }

  evalTime(a,b,cx) {
    if (sys.ObjUtil.is(b, haystack.Number.type$)) {
      return a.minus(sys.ObjUtil.coerce(sys.ObjUtil.coerce(b, haystack.Number.type$).toDuration(), sys.Duration.type$));
    }
    ;
    throw this.err(sys.Str.plus("Unsupported operation: Time - ", sys.ObjUtil.typeof(b)), cx);
  }

  evalDateSpan(a,b,cx) {
    if (sys.ObjUtil.is(b, haystack.Number.type$)) {
      return a.minus(sys.ObjUtil.coerce(sys.ObjUtil.coerce(b, haystack.Number.type$).toDuration(), sys.Duration.type$));
    }
    ;
    throw this.err(sys.Str.plus("Unsupported operation: DateSpan - ", sys.ObjUtil.typeof(b)), cx);
  }

}

class Mul extends BinaryMath {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Mul.type$; }

  static make(lhs,rhs) {
    const $self = new Mul();
    Mul.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    BinaryMath.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.mul();
  }

  evalNumber(a,b,cx) {
    return a.mult(b);
  }

}

class Div extends BinaryMath {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Div.type$; }

  static make(lhs,rhs) {
    const $self = new Div();
    Div.make$($self,lhs,rhs);
    return $self;
  }

  static make$($self,lhs,rhs) {
    BinaryMath.make$($self, lhs, rhs);
    return;
  }

  type() {
    return ExprType.div();
  }

  evalNumber(a,b,cx) {
    return a.div(b);
  }

}

class DefineVar extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefineVar.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(loc,name,val) {
    const $self = new DefineVar();
    DefineVar.make$($self,loc,name,val);
    return $self;
  }

  static make$($self,loc,name,val) {
    Expr.make$($self);
    $self.#loc = loc;
    $self.#name = name;
    $self.#val = val;
    return;
  }

  type() {
    return ExprType.def();
  }

  eval(cx) {
    return cx.def(this.#name, this.#val.eval(cx), this.#loc);
  }

  walk(f) {
    sys.Func.call(f, "name", this.#name);
    sys.Func.call(f, "val", this.#val);
    return;
  }

  print(out) {
    return out.w(this.#name).w(": ").expr(this.#val);
  }

}

class Block extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Block.type$; }

  #exprs = null;

  exprs() { return this.#exprs; }

  __exprs(it) { if (it === undefined) return this.#exprs; else this.#exprs = it; }

  static make(exprs) {
    const $self = new Block();
    Block.make$($self,exprs);
    return $self;
  }

  static make$($self,exprs) {
    Expr.make$($self);
    if (exprs.isEmpty()) {
      throw sys.ArgErr.make("exprs cannot be empty");
    }
    ;
    $self.#exprs = sys.ObjUtil.coerce(((this$) => { let $_u40 = exprs; if ($_u40 == null) return null; return sys.ObjUtil.toImmutable(exprs); })($self), sys.Type.find("axon::Expr[]"));
    return;
  }

  type() {
    return ExprType.block();
  }

  loc() {
    return this.#exprs.first().loc();
  }

  eval(cx) {
    const this$ = this;
    let result = null;
    this.#exprs.each((expr) => {
      (result = expr.eval(cx));
      return;
    });
    return result;
  }

  walk(f) {
    sys.Func.call(f, "exprs", this.#exprs);
    return;
  }

  print(out) {
    const this$ = this;
    out.w("do").nl();
    out.indent();
    this.#exprs.each((expr) => {
      expr.print(out).eos().nl();
      return;
    });
    out.unindent();
    out.w("end").nl();
    return out;
  }

}

class Loc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Loc.type$; }

  static #unknown = undefined;

  static unknown() {
    if (Loc.#unknown === undefined) {
      Loc.static$init();
      if (Loc.#unknown === undefined) Loc.#unknown = null;
    }
    return Loc.#unknown;
  }

  static #eval = undefined;

  static eval() {
    if (Loc.#eval === undefined) {
      Loc.static$init();
      if (Loc.#eval === undefined) Loc.#eval = null;
    }
    return Loc.#eval;
  }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #line = 0;

  line() { return this.#line; }

  __line(it) { if (it === undefined) return this.#line; else this.#line = it; }

  #filePos = 0;

  filePos(it) { if (it === undefined) return this.#filePos; else this.#filePos = it; }

  static make(file,line,filePos) {
    const $self = new Loc();
    Loc.make$($self,file,line,filePos);
    return $self;
  }

  static make$($self,file,line,filePos) {
    if (line === undefined) line = 0;
    if (filePos === undefined){
       filePos = 0;
    }
    $self.#file = file;
    $self.#line = line;
    $self.#filePos = filePos;
    return;
  }

  toStr() {
    if (sys.ObjUtil.compareLE(this.#line, 0)) {
      return this.#file;
    }
    else {
      return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#file), ":"), sys.ObjUtil.coerce(this.#line, sys.Obj.type$.toNullable()));
    }
    ;
  }

  isUnknown() {
    return this === Loc.unknown();
  }

  static static$init() {
    Loc.#unknown = Loc.make("unknown", 0);
    Loc.#eval = Loc.make("eval", 0);
    return;
  }

}

class Printer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#indentation = 0;
    this.#buf = sys.StrBuf.make();
    return;
  }

  typeof() { return Printer.type$; }

  #indentation = 0;

  // private field reflection only
  __indentation(it) { if (it === undefined) return this.#indentation; else this.#indentation = it; }

  #isNewline = false;

  // private field reflection only
  __isNewline(it) { if (it === undefined) return this.#isNewline; else this.#isNewline = it; }

  #buf = null;

  // private field reflection only
  __buf(it) { if (it === undefined) return this.#buf; else this.#buf = it; }

  #atomicLevel = 0;

  // private field reflection only
  __atomicLevel(it) { if (it === undefined) return this.#atomicLevel; else this.#atomicLevel = it; }

  w(v) {
    this.checkNewline();
    this.#buf.add(v);
    return this;
  }

  wc(c) {
    this.checkNewline();
    this.#buf.addChar(c);
    return this;
  }

  nl() {
    if (this.#isNewline) {
      return this;
    }
    ;
    this.#isNewline = true;
    this.#buf.addChar(10);
    return this;
  }

  eos() {
    if (this.#isNewline) {
      return this;
    }
    ;
    this.#buf.addChar(59);
    return this;
  }

  indent() {
    ((this$) => { let $_u41 = this$.#indentation;this$.#indentation = sys.Int.increment(this$.#indentation); return $_u41; })(this);
    return this;
  }

  unindent() {
    ((this$) => { let $_u42 = this$.#indentation;this$.#indentation = sys.Int.decrement(this$.#indentation); return $_u42; })(this);
    return this;
  }

  val(val) {
    return this.w(sys.ObjUtil.coerce(haystack.Etc.toAxon(val), sys.Obj.type$));
  }

  comma() {
    return this.w(", ");
  }

  expr(expr) {
    return expr.print(this);
  }

  atomic(expr) {
    this.#atomicLevel = sys.Int.increment(this.#atomicLevel);
    expr.print(this);
    this.#atomicLevel = sys.Int.decrement(this.#atomicLevel);
    return this;
  }

  atomicStart() {
    if (sys.ObjUtil.compareGT(this.#atomicLevel, 0)) {
      this.wc(40);
    }
    ;
    return this;
  }

  atomicEnd() {
    if (sys.ObjUtil.compareGT(this.#atomicLevel, 0)) {
      this.wc(41);
    }
    ;
    return this;
  }

  toStr() {
    return this.#buf.toStr();
  }

  checkNewline() {
    if (!this.#isNewline) {
      return;
    }
    ;
    this.#buf.add(sys.Str.spaces(sys.Int.mult(this.#indentation, 2)));
    this.#isNewline = false;
    return;
  }

  static make() {
    const $self = new Printer();
    Printer.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Literal extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Literal.type$; }

  static #trueVal = undefined;

  static trueVal() {
    if (Literal.#trueVal === undefined) {
      Literal.static$init();
      if (Literal.#trueVal === undefined) Literal.#trueVal = null;
    }
    return Literal.#trueVal;
  }

  static #falseVal = undefined;

  static falseVal() {
    if (Literal.#falseVal === undefined) {
      Literal.static$init();
      if (Literal.#falseVal === undefined) Literal.#falseVal = null;
    }
    return Literal.#falseVal;
  }

  static #nullVal = undefined;

  static nullVal() {
    if (Literal.#nullVal === undefined) {
      Literal.static$init();
      if (Literal.#nullVal === undefined) Literal.#nullVal = null;
    }
    return Literal.#nullVal;
  }

  static #markerVal = undefined;

  static markerVal() {
    if (Literal.#markerVal === undefined) {
      Literal.static$init();
      if (Literal.#markerVal === undefined) Literal.#markerVal = null;
    }
    return Literal.#markerVal;
  }

  static #removeVal = undefined;

  static removeVal() {
    if (Literal.#removeVal === undefined) {
      Literal.static$init();
      if (Literal.#removeVal === undefined) Literal.#removeVal = null;
    }
    return Literal.#removeVal;
  }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static bool(val) {
    return ((this$) => { if (val) return Literal.trueVal(); return Literal.falseVal(); })(this);
  }

  static wrap(val) {
    if (val == null) {
      return Literal.nullVal();
    }
    ;
    if (sys.ObjUtil.isImmutable(val)) {
      return Literal.make(val);
    }
    ;
    return UnsafeLiteral.make(val);
  }

  static make(val) {
    const $self = new Literal();
    Literal.make$($self,val);
    return $self;
  }

  static make$($self,val) {
    Expr.make$($self);
    $self.#val = ((this$) => { let $_u44 = val; if ($_u44 == null) return null; return sys.ObjUtil.toImmutable(val); })($self);
    return;
  }

  type() {
    return ExprType.literal();
  }

  loc() {
    return Loc.unknown();
  }

  isConst() {
    return true;
  }

  constVal() {
    return this.#val;
  }

  eval(cx) {
    return this.#val;
  }

  walk(f) {
    sys.Func.call(f, "val", this.#val);
    return;
  }

  print(out) {
    return out.val(this.#val);
  }

  static static$init() {
    Literal.#trueVal = Literal.make(sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    Literal.#falseVal = Literal.make(sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    Literal.#nullVal = Literal.make(null);
    Literal.#markerVal = Literal.make(haystack.Marker.val());
    Literal.#removeVal = Literal.make(haystack.Remove.val());
    return;
  }

}

class UnsafeLiteral extends Literal {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnsafeLiteral.type$; }

  static make(val) {
    const $self = new UnsafeLiteral();
    UnsafeLiteral.make$($self,val);
    return $self;
  }

  static make$($self,val) {
    Literal.make$($self, sys.Unsafe.make(val));
    return;
  }

  eval(cx) {
    return sys.ObjUtil.coerce(this.val(), sys.Unsafe.type$).val();
  }

}

class FilterExpr extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterExpr.type$; }

  #filter = null;

  filter() { return this.#filter; }

  __filter(it) { if (it === undefined) return this.#filter; else this.#filter = it; }

  static make(filter) {
    const $self = new FilterExpr();
    FilterExpr.make$($self,filter);
    return $self;
  }

  static make$($self,filter) {
    Expr.make$($self);
    $self.#filter = filter;
    return;
  }

  type() {
    return ExprType.filter();
  }

  loc() {
    return Loc.unknown();
  }

  eval(cx) {
    return this.#filter;
  }

  walk(f) {
    sys.Func.call(f, "filter", this.#filter.toStr());
    return;
  }

  print(out) {
    return out.w("parseFilter(").w(sys.Str.toCode(this.#filter.toStr())).w(")");
  }

}

class ListExpr extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListExpr.type$; }

  static #empty = undefined;

  static empty() {
    if (ListExpr.#empty === undefined) {
      ListExpr.static$init();
      if (ListExpr.#empty === undefined) ListExpr.#empty = null;
    }
    return ListExpr.#empty;
  }

  #vals = null;

  vals() { return this.#vals; }

  __vals(it) { if (it === undefined) return this.#vals; else this.#vals = it; }

  #constValRef = null;

  // private field reflection only
  __constValRef(it) { if (it === undefined) return this.#constValRef; else this.#constValRef = it; }

  static make(vals,allValsConst) {
    const $self = new ListExpr();
    ListExpr.make$($self,vals,allValsConst);
    return $self;
  }

  static make$($self,vals,allValsConst) {
    const this$ = $self;
    Expr.make$($self);
    $self.#vals = sys.ObjUtil.coerce(((this$) => { let $_u45 = vals; if ($_u45 == null) return null; return sys.ObjUtil.toImmutable(vals); })($self), sys.Type.find("axon::Expr[]"));
    if (allValsConst) {
      $self.#constValRef = sys.ObjUtil.coerce(((this$) => { let $_u46 = vals.map((v) => {
        return v.constVal();
      }, sys.Obj.type$.toNullable()); if ($_u46 == null) return null; return sys.ObjUtil.toImmutable(vals.map((v) => {
        return v.constVal();
      }, sys.Obj.type$.toNullable())); })($self), sys.Type.find("sys::Obj?[]?"));
    }
    ;
    return;
  }

  type() {
    return ExprType.list();
  }

  loc() {
    return ((this$) => { if (this$.#vals.isEmpty()) return Loc.unknown(); return this$.#vals.first().loc(); })(this);
  }

  isConst() {
    return this.#constValRef != null;
  }

  constVal() {
    return ((this$) => { let $_u48 = this$.#constValRef; if ($_u48 != null) return $_u48; return Expr.prototype.constVal.call(this$); })(this);
  }

  eval(cx) {
    const this$ = this;
    if (this.#constValRef != null) {
      return this.#constValRef;
    }
    ;
    return this.#vals.map((expr) => {
      return expr.eval(cx);
    }, sys.Obj.type$.toNullable());
  }

  walk(f) {
    sys.Func.call(f, "vals", this.#vals);
    return;
  }

  print(out) {
    const this$ = this;
    out.wc(91);
    this.#vals.each((val,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        out.comma();
      }
      ;
      val.print(out);
      return;
    });
    return out.wc(93);
  }

  static static$init() {
    ListExpr.#empty = ListExpr.make(sys.ObjUtil.coerce(Expr.type$.emptyList(), sys.Type.find("axon::Expr[]")), true);
    return;
  }

}

class DictExpr extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DictExpr.type$; }

  static #empty = undefined;

  static empty() {
    if (DictExpr.#empty === undefined) {
      DictExpr.static$init();
      if (DictExpr.#empty === undefined) DictExpr.#empty = null;
    }
    return DictExpr.#empty;
  }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #names = null;

  names() { return this.#names; }

  __names(it) { if (it === undefined) return this.#names; else this.#names = it; }

  #vals = null;

  vals() { return this.#vals; }

  __vals(it) { if (it === undefined) return this.#vals; else this.#vals = it; }

  #constValRef = null;

  // private field reflection only
  __constValRef(it) { if (it === undefined) return this.#constValRef; else this.#constValRef = it; }

  static make(loc,names,vals,allValsConst) {
    const $self = new DictExpr();
    DictExpr.make$($self,loc,names,vals,allValsConst);
    return $self;
  }

  static make$($self,loc,names,vals,allValsConst) {
    const this$ = $self;
    Expr.make$($self);
    $self.#loc = loc;
    $self.#names = sys.ObjUtil.coerce(((this$) => { let $_u49 = names; if ($_u49 == null) return null; return sys.ObjUtil.toImmutable(names); })($self), sys.Type.find("sys::Str[]"));
    $self.#vals = sys.ObjUtil.coerce(((this$) => { let $_u50 = vals; if ($_u50 == null) return null; return sys.ObjUtil.toImmutable(vals); })($self), sys.Type.find("axon::Expr[]"));
    if (allValsConst) {
      let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
      tags.ordered(true);
      names.each((name,i) => {
        tags.set(name, vals.get(i).constVal());
        return;
      });
      $self.#constValRef = haystack.Etc.makeDict(tags);
    }
    ;
    return;
  }

  type() {
    return ExprType.dict();
  }

  isConst() {
    return this.#constValRef != null;
  }

  constVal() {
    return ((this$) => { let $_u51 = this$.#constValRef; if ($_u51 != null) return $_u51; return Expr.prototype.constVal.call(this$); })(this);
  }

  eval(cx) {
    const this$ = this;
    if (this.#constValRef != null) {
      return this.#constValRef;
    }
    ;
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    tags.ordered(true);
    this.#names.each((name,i) => {
      let val = this$.#vals.get(i).eval(cx);
      tags.set(name, val);
      return;
    });
    return haystack.Etc.makeDict(tags);
  }

  walk(f) {
    sys.Func.call(f, "names", this.#names);
    sys.Func.call(f, "vals", this.#vals);
    return;
  }

  print(out) {
    const this$ = this;
    out.wc(123);
    this.#names.each((n,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        out.comma();
      }
      ;
      if (haystack.Etc.isTagName(n)) {
        out.w(n);
      }
      else {
        out.w(sys.Str.toCode(n));
      }
      ;
      let val = this$.#vals.get(i);
      if (!val.isMarker()) {
        out.wc(58).expr(val);
      }
      ;
      return;
    });
    return out.wc(125);
  }

  static static$init() {
    DictExpr.#empty = DictExpr.make(Loc.unknown(), sys.ObjUtil.coerce(sys.Str.type$.emptyList(), sys.Type.find("sys::Str[]")), sys.ObjUtil.coerce(Expr.type$.emptyList(), sys.Type.find("axon::Expr[]")), true);
    return;
  }

}

class RangeExpr extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RangeExpr.type$; }

  #start = null;

  start() { return this.#start; }

  __start(it) { if (it === undefined) return this.#start; else this.#start = it; }

  #end = null;

  end() { return this.#end; }

  __end(it) { if (it === undefined) return this.#end; else this.#end = it; }

  static make(start,end) {
    const $self = new RangeExpr();
    RangeExpr.make$($self,start,end);
    return $self;
  }

  static make$($self,start,end) {
    Expr.make$($self);
    $self.#start = start;
    $self.#end = end;
    return;
  }

  type() {
    return ExprType.range();
  }

  loc() {
    return this.#start.loc();
  }

  eval(cx) {
    let s = this.#start.eval(cx);
    let e = this.#end.eval(cx);
    if ((sys.ObjUtil.is(s, sys.Date.type$) && sys.ObjUtil.is(e, sys.Date.type$))) {
      return haystack.DateSpan.make(sys.ObjUtil.coerce(s, sys.Date.type$), sys.ObjUtil.coerce(e, sys.Obj.type$));
    }
    ;
    return haystack.ObjRange.make(s, e);
  }

  walk(f) {
    sys.Func.call(f, "start", this.#start);
    sys.Func.call(f, "end", this.#end);
    return;
  }

  print(out) {
    return out.atomicStart().atomic(this.#start).w("..").atomic(this.#end).atomicEnd();
  }

}

class CellDef {
  constructor() {
    const this$ = this;
  }

  typeof() { return CellDef.type$; }

  toStr() { return haystack.Dict.prototype.toStr.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

}

class Var extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Var.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  static make(loc,name) {
    const $self = new Var();
    Var.make$($self,loc,name);
    return $self;
  }

  static make$($self,loc,name) {
    Expr.make$($self);
    $self.#loc = loc;
    $self.#name = name;
    return;
  }

  type() {
    return ExprType.var();
  }

  eval(cx) {
    return cx.resolve(this.#name, this.#loc);
  }

  toStr() {
    return this.#name;
  }

  walk(f) {
    sys.Func.call(f, "name", this.#name);
    return;
  }

  print(out) {
    return out.w(this.#name);
  }

}

class TypeRef extends Expr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TypeRef.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  static make(loc,lib,name) {
    const $self = new TypeRef();
    TypeRef.make$($self,loc,lib,name);
    return $self;
  }

  static make$($self,loc,lib,name) {
    Expr.make$($self);
    $self.#loc = loc;
    $self.#lib = lib;
    $self.#name = name;
    return;
  }

  type() {
    return ExprType.typeRef();
  }

  eval(cx) {
    if (this.#lib != null) {
      return cx.xeto().lib(sys.ObjUtil.coerce(this.#lib, sys.Str.type$)).type(this.#name);
    }
    ;
    let local = sys.ObjUtil.as(cx.getVar(this.#name), xeto.Spec.type$);
    if (local != null) {
      return local;
    }
    ;
    return cx.xeto().unqualifiedType(this.#name);
  }

  print(out) {
    return out.w(this.nameToStr());
  }

  walk(f) {
    sys.Func.call(f, "specRef", this.nameToStr());
    return;
  }

  nameToStr() {
    if (this.#lib != null) {
      return sys.Str.plus(sys.Str.plus(this.#lib, "::"), this.#name);
    }
    else {
      return this.#name;
    }
    ;
  }

}

class CompDef extends TopFn {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompDef.type$; }

  static make(loc,name,meta,body) {
    const $self = new CompDef();
    CompDef.make$($self,loc,name,meta,body);
    return $self;
  }

  static make$($self,loc,name,meta,body) {
    TopFn.make$($self, loc, name, meta, FnParam.cells(), body);
    return;
  }

  type() {
    return ExprType.compdef();
  }

  isComp() {
    return true;
  }

  isNative() {
    return true;
  }

  callx(cx,args,loc) {
    const this$ = this;
    let comp = this.instantiate();
    if (sys.ObjUtil.compareGT(args.size(), 0)) {
      let arg = ((this$) => { let $_u52 = sys.ObjUtil.as(args.get(0), haystack.Dict.type$); if ($_u52 != null) return $_u52; throw sys.ArgErr.make("Must call comp with Dict arg"); })(this);
      haystack.Etc.dictEach(sys.ObjUtil.coerce(arg, haystack.Dict.type$), (v,n) => {
        let cell = this$.cell(n, false);
        if (cell != null) {
          comp.setCell(sys.ObjUtil.coerce(cell, CellDef.type$), v);
        }
        ;
        return;
      });
    }
    ;
    comp.recompute(cx);
    let result = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    this.cells().each((cell) => {
      let v = comp.getCell(cell);
      if (v != null) {
        result.set(cell.name(), v);
      }
      ;
      return;
    });
    return haystack.Etc.makeDict(result);
  }

  walk(f) {
    const this$ = this;
    TopFn.prototype.walk.call(this, f);
    let cellsMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Dict"));
    this.cells().each((cell) => {
      cellsMap.set(cell.name(), cell);
      return;
    });
    sys.Func.call(f, "cells", haystack.Etc.makeDict(cellsMap));
    return;
  }

  print(out) {
    const this$ = this;
    out.w("defcomp").nl();
    out.indent();
    this.cells().each((cell) => {
      out.w(cell.name()).w(": ").val(cell).nl();
      return;
    });
    this.body().print(out);
    out.unindent();
    out.w("end").nl();
    return out;
  }

  dump(out) {
    if (out === undefined) out = sys.Env.cur().out();
    const this$ = this;
    out.printLine(sys.Str.plus(sys.Str.plus("--- ", this.name()), " ---"));
    this.cells().each((cell) => {
      out.print("  ").printLine(cell);
      return;
    });
    out.flush();
    return;
  }

}

class ExprType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExprType.type$; }

  static literal() { return ExprType.vals().get(0); }

  static list() { return ExprType.vals().get(1); }

  static dict() { return ExprType.vals().get(2); }

  static range() { return ExprType.vals().get(3); }

  static filter() { return ExprType.vals().get(4); }

  static def() { return ExprType.vals().get(5); }

  static var() { return ExprType.vals().get(6); }

  static func() { return ExprType.vals().get(7); }

  static compdef() { return ExprType.vals().get(8); }

  static celldef() { return ExprType.vals().get(9); }

  static call() { return ExprType.vals().get(10); }

  static dotCall() { return ExprType.vals().get(11); }

  static staticCall() { return ExprType.vals().get(12); }

  static trapCall() { return ExprType.vals().get(13); }

  static partialCall() { return ExprType.vals().get(14); }

  static block() { return ExprType.vals().get(15); }

  static ifExpr() { return ExprType.vals().get(16); }

  static returnExpr() { return ExprType.vals().get(17); }

  static throwExpr() { return ExprType.vals().get(18); }

  static tryExpr() { return ExprType.vals().get(19); }

  static typeRef() { return ExprType.vals().get(20); }

  static assign() { return ExprType.vals().get(21); }

  static not() { return ExprType.vals().get(22); }

  static and() { return ExprType.vals().get(23); }

  static or() { return ExprType.vals().get(24); }

  static eq() { return ExprType.vals().get(25); }

  static ne() { return ExprType.vals().get(26); }

  static lt() { return ExprType.vals().get(27); }

  static le() { return ExprType.vals().get(28); }

  static ge() { return ExprType.vals().get(29); }

  static gt() { return ExprType.vals().get(30); }

  static cmp() { return ExprType.vals().get(31); }

  static neg() { return ExprType.vals().get(32); }

  static add() { return ExprType.vals().get(33); }

  static sub() { return ExprType.vals().get(34); }

  static mul() { return ExprType.vals().get(35); }

  static div() { return ExprType.vals().get(36); }

  static #vals = undefined;

  #op = null;

  op() { return this.#op; }

  __op(it) { if (it === undefined) return this.#op; else this.#op = it; }

  static make($ordinal,$name,op) {
    const $self = new ExprType();
    ExprType.make$($self,$ordinal,$name,op);
    return $self;
  }

  static make$($self,$ordinal,$name,op) {
    if (op === undefined) op = null;
    sys.Enum.make$($self, $ordinal, $name);
    $self.#op = op;
    return;
  }

  encode() {
    return ((this$) => { if (sys.Str.endsWith(this$.name(), "Expr")) return sys.Str.getRange(this$.name(), sys.Range.make(0, -5)); return this$.name(); })(this);
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(ExprType.type$, ExprType.vals(), name$, checked);
  }

  static vals() {
    if (ExprType.#vals == null) {
      ExprType.#vals = sys.List.make(ExprType.type$, [
        ExprType.make(0, "literal", ),
        ExprType.make(1, "list", ),
        ExprType.make(2, "dict", ),
        ExprType.make(3, "range", ),
        ExprType.make(4, "filter", ),
        ExprType.make(5, "def", ),
        ExprType.make(6, "var", ),
        ExprType.make(7, "func", ),
        ExprType.make(8, "compdef", ),
        ExprType.make(9, "celldef", ),
        ExprType.make(10, "call", ),
        ExprType.make(11, "dotCall", ),
        ExprType.make(12, "staticCall", ),
        ExprType.make(13, "trapCall", ),
        ExprType.make(14, "partialCall", ),
        ExprType.make(15, "block", ),
        ExprType.make(16, "ifExpr", ),
        ExprType.make(17, "returnExpr", ),
        ExprType.make(18, "throwExpr", ),
        ExprType.make(19, "tryExpr", ),
        ExprType.make(20, "typeRef", ),
        ExprType.make(21, "assign", "="),
        ExprType.make(22, "not", "not"),
        ExprType.make(23, "and", "and"),
        ExprType.make(24, "or", "or"),
        ExprType.make(25, "eq", "=="),
        ExprType.make(26, "ne", "!="),
        ExprType.make(27, "lt", "<"),
        ExprType.make(28, "le", "<="),
        ExprType.make(29, "ge", ">="),
        ExprType.make(30, "gt", ">"),
        ExprType.make(31, "cmp", "<=>"),
        ExprType.make(32, "neg", "-"),
        ExprType.make(33, "add", "+"),
        ExprType.make(34, "sub", "-"),
        ExprType.make(35, "mul", "*"),
        ExprType.make(36, "div", "/"),
      ]).toImmutable();
    }
    return ExprType.#vals;
  }

  static static$init() {
    const $_u54 = ExprType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class MComp extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MComp.type$; }

  #def = null;

  def() { return this.#def; }

  __def(it) { if (it === undefined) return this.#def; else this.#def = it; }

  #cells = null;

  // private field reflection only
  __cells(it) { if (it === undefined) return this.#cells; else this.#cells = it; }

  static make(def) {
    const $self = new MComp();
    MComp.make$($self,def);
    return $self;
  }

  static make$($self,def) {
    const this$ = $self;
    $self.#def = def;
    $self.#cells = sys.List.make(MCell.type$);
    $self.#cells.capacity(def.cells().size());
    def.cells().each((x) => {
      this$.#cells.add(MCell.make(x));
      return;
    });
    return;
  }

  get(name) {
    return this.getCell(sys.ObjUtil.coerce(this.#def.cell(name), CellDef.type$));
  }

  set(name,val) {
    return sys.ObjUtil.coerce(this.setCell(sys.ObjUtil.coerce(this.#def.cell(name), CellDef.type$), val), MComp.type$);
  }

  getCell(cd) {
    this.checkMyCellDef(cd);
    return this.#cells.get(cd.index()).get();
  }

  setCell(cd,val) {
    this.checkMyCellDef(cd);
    this.#cells.get(cd.index()).set(val);
    return this;
  }

  cellVals() {
    const this$ = this;
    return this.#cells.map((cell) => {
      return cell.get();
    }, sys.Obj.type$.toNullable());
  }

  recompute(cx) {
    const this$ = this;
    let vars = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    this.#cells.each((cell) => {
      vars.set(cell.name(), cell.get());
      return;
    });
    cx.callInNewFrame(this.#def, sys.Obj.type$.emptyList(), this.#def.loc(), vars);
    this.#cells.each((cell,i) => {
      cell.recomputed(vars.get(cell.name()));
      return;
    });
    return this;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("Comp<", this.#def.name()), ">");
  }

  checkMyCellDef(cd) {
    if (this.#def.cells().get(cd.index()) !== cd) {
      throw sys.Err.make(sys.Str.plus("Not my cell def: ", cd));
    }
    ;
    return;
  }

  dump(out) {
    if (out === undefined) out = sys.Env.cur().out();
    MComp.doDump(this, out);
    return;
  }

  static doDump(comp,out) {
    const this$ = this;
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("--- ", comp.def().name()), " ["), comp), "] ---"));
    comp.def().cells().each((c) => {
      out.print("  ").print(c.name()).print(": ").printLine(comp.getCell(c));
      return;
    });
    out.flush();
    return;
  }

}

class MCompDef extends CompDef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MCompDef.type$; }

  #cells = null;

  cells() { return this.#cells; }

  __cells(it) { if (it === undefined) return this.#cells; else this.#cells = it; }

  #cellsMap = null;

  // private field reflection only
  __cellsMap(it) { if (it === undefined) return this.#cellsMap; else this.#cellsMap = it; }

  static make(loc,name,meta,body,cells,cellsMap) {
    const $self = new MCompDef();
    MCompDef.make$($self,loc,name,meta,body,cells,cellsMap);
    return $self;
  }

  static make$($self,loc,name,meta,body,cells,cellsMap) {
    CompDef.make$($self, loc, name, meta, body);
    $self.#cells = sys.ObjUtil.coerce(((this$) => { let $_u55 = sys.ObjUtil.coerce(cells, sys.Type.find("axon::MCellDef[]")); if ($_u55 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(cells, sys.Type.find("axon::MCellDef[]"))); })($self), sys.Type.find("axon::MCellDef[]"));
    $self.#cellsMap = sys.ObjUtil.coerce(((this$) => { let $_u56 = sys.ObjUtil.coerce(cellsMap, sys.Type.find("[sys::Str:axon::MCellDef]")); if ($_u56 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(cellsMap, sys.Type.find("[sys::Str:axon::MCellDef]"))); })($self), sys.Type.find("[sys::Str:axon::MCellDef]"));
    return;
  }

  size() {
    return this.#cells.size();
  }

  cell(name,checked) {
    if (checked === undefined) checked = true;
    let cell = this.#cellsMap.get(name);
    if (cell != null) {
      return cell;
    }
    ;
    if (checked) {
      throw haystack.UnknownCellErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.name()), "."), name));
    }
    ;
    return null;
  }

  instantiate() {
    return MComp.make(this);
  }

}

class MCell extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MCell.type$; }

  #def = null;

  def() { return this.#def; }

  __def(it) { if (it === undefined) return this.#def; else this.#def = it; }

  #val = null;

  // private field reflection only
  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(def) {
    const $self = new MCell();
    MCell.make$($self,def);
    return $self;
  }

  static make$($self,def) {
    $self.#def = def;
    $self.#val = def.defVal();
    return;
  }

  name() {
    return this.#def.name();
  }

  get() {
    return this.#val;
  }

  set(val) {
    if (this.#def.ro()) {
      throw sys.ReadonlyErr.make(sys.Str.plus("Cannot set readonly cell: ", this.#def));
    }
    ;
    this.#val = val;
    return;
  }

  recomputed(val) {
    this.#val = val;
    return;
  }

}

class MCellDef extends haystack.WrapDict {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MCellDef.type$; }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #parentRef = null;

  // private field reflection only
  __parentRef(it) { if (it === undefined) return this.#parentRef; else this.#parentRef = it; }

  #index = 0;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #defVal = null;

  defVal() { return this.#defVal; }

  __defVal(it) { if (it === undefined) return this.#defVal; else this.#defVal = it; }

  #ro = false;

  ro() { return this.#ro; }

  __ro(it) { if (it === undefined) return this.#ro; else this.#ro = it; }

  static make(parentRef,index,name,meta) {
    const $self = new MCellDef();
    MCellDef.make$($self,parentRef,index,name,meta);
    return $self;
  }

  static make$($self,parentRef,index,name,meta) {
    haystack.WrapDict.make$($self, meta);
    $self.#parentRef = parentRef;
    $self.#index = index;
    $self.#name = name;
    $self.#defVal = ((this$) => { let $_u57 = meta.get("defVal"); if ($_u57 == null) return null; return sys.ObjUtil.toImmutable(meta.get("defVal")); })($self);
    $self.#ro = MCellDef.isReadonly(meta);
    return;
  }

  static isReadonly(meta) {
    return (meta.has("ro") || meta.has("bindOut"));
  }

  parent() {
    return sys.ObjUtil.coerce(this.#parentRef.val(), MCompDef.type$);
  }

  toStr() {
    let s = sys.StrBuf.make();
    s.add(this.#name).add(": ").add(haystack.WrapDict.prototype.toStr.call(this));
    return s.toStr();
  }

}

class Cell extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Cell.type$; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  decode(f) {
    const this$ = this;
    if (this.#meta != null) {
      haystack.TrioReader.make(sys.Str.in(sys.ObjUtil.toStr(this.#meta))).readDict().each((v,n) => {
        sys.Func.call(f, n, v);
        return;
      });
    }
    ;
    return;
  }

  static make(f) {
    const $self = new Cell();
    Cell.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ((this$) => { let $_u58 = f; if ($_u58 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

}

class FCellDef extends haystack.WrapDict {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FCellDef.type$; }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #parent = null;

  parent() { return this.#parent; }

  __parent(it) { if (it === undefined) return this.#parent; else this.#parent = it; }

  #index = 0;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #field = null;

  field() { return this.#field; }

  __field(it) { if (it === undefined) return this.#field; else this.#field = it; }

  #ro = false;

  ro() { return this.#ro; }

  __ro(it) { if (it === undefined) return this.#ro; else this.#ro = it; }

  static make(parent,index,field,facet) {
    const $self = new FCellDef();
    FCellDef.make$($self,parent,index,field,facet);
    return $self;
  }

  static make$($self,parent,index,field,facet) {
    haystack.WrapDict.make$($self, FCellDef.toMeta(field, facet));
    $self.#parent = parent;
    $self.#index = index;
    $self.#name = field.name();
    $self.#field = field;
    $self.#ro = MCellDef.isReadonly($self.wrapped());
    return;
  }

  static toMeta(field,facet) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    facet.decode((n,v) => {
      acc.set(n, v);
      return;
    });
    return haystack.Etc.makeDict(acc);
  }

  toStr() {
    let s = sys.StrBuf.make();
    s.add(this.#name).add(": ").add(haystack.WrapDict.prototype.toStr.call(this));
    return s.toStr();
  }

  getCell(comp) {
    return this.#field.get(comp);
  }

  setCell(comp,val) {
    if (this.#ro) {
      throw sys.ReadonlyErr.make(sys.Str.plus("Cannot set readonly cell: ", this.#name));
    }
    ;
    this.#field.set(comp, val);
    return;
  }

}

class AbstractComp extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AbstractComp.type$; }

  #defRef = null;

  defRef() { return this.#defRef; }

  __defRef(it) { if (it === undefined) return this.#defRef; else this.#defRef = it; }

  static reflect(type,meta) {
    return FCompDef.make(type, sys.Str.decapitalize(type.name()), meta);
  }

  static make(init) {
    const $self = new AbstractComp();
    AbstractComp.make$($self,init);
    return $self;
  }

  static make$($self,init) {
    $self.#defRef = sys.ObjUtil.coerce(init, FCompDef.type$);
    return;
  }

  def() {
    return this.#defRef;
  }

  get(name) {
    return this.getCell(sys.ObjUtil.coerce(this.def().cell(name), CellDef.type$));
  }

  set(name,val) {
    return sys.ObjUtil.coerce(this.setCell(sys.ObjUtil.coerce(this.def().cell(name), CellDef.type$), val), AbstractComp.type$);
  }

  getCell(cd) {
    return sys.ObjUtil.coerce(cd, FCellDef.type$).getCell(this);
  }

  setCell(cd,val) {
    sys.ObjUtil.coerce(cd, FCellDef.type$).setCell(this, val);
    return this;
  }

  recompute(cx) {
    this.onRecompute(cx);
    return this;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("Comp<", this.def().name()), ">");
  }

  cellVals() {
    const this$ = this;
    return this.def().cells().map((cell) => {
      return this$.getCell(cell);
    }, sys.Obj.type$.toNullable());
  }

  dump(out) {
    if (out === undefined) out = sys.Env.cur().out();
    MComp.doDump(this, out);
    return;
  }

}

class FCompDef extends CompDef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FCompDef.type$; }

  #compType = null;

  compType() { return this.#compType; }

  __compType(it) { if (it === undefined) return this.#compType; else this.#compType = it; }

  #cells = null;

  cells() { return this.#cells; }

  __cells(it) { if (it === undefined) return this.#cells; else this.#cells = it; }

  #cellsMap = null;

  // private field reflection only
  __cellsMap(it) { if (it === undefined) return this.#cellsMap; else this.#cellsMap = it; }

  static make(type,name,meta) {
    const $self = new FCompDef();
    FCompDef.make$($self,type,name,meta);
    return $self;
  }

  static make$($self,type,name,meta) {
    const this$ = $self;
    CompDef.make$($self, Loc.make(type.qname()), name, meta, Literal.nullVal());
    let list = sys.List.make(FCellDef.type$);
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("axon::FCellDef"));
    type.fields().each((field) => {
      let facet = field.facet(Cell.type$, false);
      if (facet == null) {
        return;
      }
      ;
      let cd = FCellDef.make(this$, list.size(), field, sys.ObjUtil.coerce(facet, Cell.type$));
      list.add(cd);
      map.add(cd.name(), cd);
      return;
    });
    $self.#compType = type;
    $self.#cells = sys.ObjUtil.coerce(((this$) => { let $_u59 = list; if ($_u59 == null) return null; return sys.ObjUtil.toImmutable(list); })($self), sys.Type.find("axon::FCellDef[]"));
    $self.#cellsMap = sys.ObjUtil.coerce(((this$) => { let $_u60 = map; if ($_u60 == null) return null; return sys.ObjUtil.toImmutable(map); })($self), sys.Type.find("[sys::Str:axon::FCellDef]"));
    return;
  }

  size() {
    return this.#cells.size();
  }

  cell(name,checked) {
    if (checked === undefined) checked = true;
    let cell = this.#cellsMap.get(name);
    if (cell != null) {
      return cell;
    }
    ;
    if (checked) {
      throw haystack.UnknownCellErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.name()), "."), name));
    }
    ;
    return null;
  }

  instantiate() {
    return sys.ObjUtil.coerce(this.#compType.make(sys.List.make(FCompDef.type$, [this])), Comp.type$);
  }

}

class CoreLibUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CoreLibUtil.type$; }

  static sort(val,sorter,ascending) {
    const this$ = this;
    let func = null;
    if (sys.ObjUtil.is(sorter, Fn.type$)) {
      let cx = AxonContext.curAxon();
      let args = sys.List.make(sys.Obj.type$.toNullable(), [null, null]);
      let fn = sys.ObjUtil.coerce(sorter, Fn.type$);
      (func = (a,b) => {
        return sys.ObjUtil.coerce(fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, a).set(1, b)), haystack.Number.type$).toInt();
      });
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let list = sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).dup();
      if (sorter == null) {
        return ((this$) => { if (ascending) return list.sort(); return list.sortr(); })(this);
      }
      ;
      if (func != null) {
        return ((this$) => { if (ascending) return list.sort(sys.ObjUtil.coerce(func, sys.Type.find("|sys::V,sys::V->sys::Int|?"))); return list.sortr(sys.ObjUtil.coerce(func, sys.Type.find("|sys::V,sys::V->sys::Int|?"))); })(this);
      }
      ;
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      let grid = sys.ObjUtil.coerce(val, haystack.Grid.type$);
      if (sys.ObjUtil.is(sorter, sys.Str.type$)) {
        return ((this$) => { if (ascending) return grid.sortCol(sys.ObjUtil.coerce(sorter, sys.Obj.type$)); return grid.sortColr(sys.ObjUtil.coerce(sorter, sys.Obj.type$)); })(this);
      }
      ;
      if (func != null) {
        return ((this$) => { if (ascending) return grid.sort(sys.ObjUtil.coerce(func, sys.Type.find("|haystack::Row,haystack::Row->sys::Int|"))); return grid.sortr(sys.ObjUtil.coerce(func, sys.Type.find("|haystack::Row,haystack::Row->sys::Int|"))); })(this);
      }
      ;
    }
    ;
    throw CoreLib.argErr("sort", val);
  }

  static gridColKinds(g) {
    const this$ = this;
    let gb = haystack.GridBuilder.make().addCol("name").addCol("kind").addCol("count");
    g.cols().each((col) => {
      let usage = TagNameUsage.make();
      g.each((row) => {
        usage.add(row.val(col));
        return;
      });
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [col.name(), usage.toKind(), haystack.Number.makeInt(usage.count())]));
      return;
    });
    return gb.toGrid();
  }

  static funcs(cx,filterExpr) {
    if (filterExpr === undefined) filterExpr = Literal.nullVal();
    const this$ = this;
    let filter = null;
    if (filterExpr !== Literal.nullVal()) {
      (filter = filterExpr.evalToFilter(cx));
    }
    ;
    let acc = sys.List.make(haystack.Dict.type$);
    cx.ns().feature("func").eachDef((def) => {
      if (def.has("nodoc")) {
        return;
      }
      ;
      if ((filter != null && !filter.matches(def, cx))) {
        return;
      }
      ;
      acc.add(def);
      return;
    });
    let names = haystack.Etc.dictsNames(acc);
    names.remove("src");
    return haystack.GridBuilder.make().addColNames(names).addDictRows(acc).toGrid();
  }

  static func(cx,name,checked) {
    let fn = CoreLibUtil.coerceToFn(cx, name, checked);
    if (fn == null) {
      return null;
    }
    ;
    return CoreLibUtil.fnToDict(cx, sys.ObjUtil.coerce(fn, TopFn.type$));
  }

  static compDef(cx,name,checked) {
    const this$ = this;
    let fn = CoreLibUtil.coerceToFn(cx, name, checked);
    if (fn == null) {
      return null;
    }
    ;
    let comp = ((this$) => { let $_u65 = sys.ObjUtil.as(fn, CompDef.type$); if ($_u65 != null) return $_u65; throw sys.Err.make(sys.Str.plus("Func is not a comp: ", fn.name())); })(this);
    let cols = haystack.Etc.dictsNames(comp.cells());
    cols.remove("name");
    let gb = haystack.GridBuilder.make().addCol("name").addColNames(cols);
    gb.setMeta(CoreLibUtil.fnToDict(cx, sys.ObjUtil.coerce(fn, TopFn.type$)));
    comp.cells().each((cell) => {
      let row = sys.List.make(sys.Obj.type$.toNullable());
      row.capacity(sys.Int.plus(1, cols.size()));
      row.add(cell.name());
      cols.each((n) => {
        row.add(cell.get(n));
        return;
      });
      gb.addRow(row);
      return;
    });
    return gb.toGrid();
  }

  static curFunc(cx) {
    let def = CoreLibUtil.coerceToFn(cx, sys.ObjUtil.coerce(cx.curFunc(), sys.Obj.type$), false);
    if (def == null) {
      throw sys.Err.make("No top-level func active");
    }
    ;
    return CoreLibUtil.fnToDict(cx, sys.ObjUtil.coerce(def, TopFn.type$));
  }

  static params(cx,fn) {
    const this$ = this;
    let rows = sys.List.make(sys.Obj.type$);
    fn.params().each((p) => {
      let def = ((this$) => { let $_u66 = p.def(); if ($_u66 == null) return null; return p.def().eval(cx); })(this$);
      rows.add(sys.List.make(sys.Obj.type$.toNullable(), [p.name(), def]));
      return;
    });
    return haystack.Etc.makeListsGrid(null, sys.List.make(sys.Str.type$, ["name", "def"]), null, sys.ObjUtil.coerce(rows, sys.Type.find("sys::Obj?[][]")));
  }

  static coerceToFn(cx,x,checked) {
    if (sys.ObjUtil.is(x, sys.Str.type$)) {
      return sys.ObjUtil.coerce(cx.findTop(sys.ObjUtil.coerce(x, sys.Str.type$), checked), TopFn.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(x, Fn.type$)) {
      let name = sys.ObjUtil.coerce(x, Fn.type$).name();
      let dot = sys.Str.index(name, ".");
      if (dot != null) {
        (name = sys.Str.getRange(name, sys.Range.make(0, sys.ObjUtil.coerce(dot, sys.Int.type$), true)));
      }
      ;
      return sys.ObjUtil.coerce(cx.findTop(name, checked), TopFn.type$.toNullable());
    }
    ;
    if ((sys.ObjUtil.is(x, haystack.Dict.type$) && sys.ObjUtil.coerce(x, haystack.Dict.type$).has("id"))) {
      (x = sys.ObjUtil.coerce(sys.ObjUtil.trap(x,"id", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Obj.type$));
    }
    ;
    if (sys.ObjUtil.is(x, haystack.Ref.type$)) {
      let rec = cx.deref(sys.ObjUtil.coerce(x, haystack.Ref.type$));
      if (rec == null) {
        if (checked) {
          throw haystack.UnknownFuncErr.make(sys.ObjUtil.toStr(x));
        }
        ;
        return null;
      }
      ;
      let name = ((this$) => { let $_u67 = sys.ObjUtil.as(rec.get("name"), sys.Str.type$); if ($_u67 != null) return $_u67; return sys.ObjUtil.coerce(rec.trap("def", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Symbol.type$).name(); })(this);
      return sys.ObjUtil.coerce(cx.findTop(sys.ObjUtil.coerce(name, sys.Str.type$)), TopFn.type$.toNullable());
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("Invalid func name argument [", sys.ObjUtil.typeof(x)), "]"));
  }

  static fnToDict(cx,fn) {
    let dict = fn.meta();
    if (dict.missing("lib")) {
      (dict = sys.ObjUtil.coerce(cx.ns().def(sys.Str.plus("func:", fn.name())), haystack.Dict.type$));
    }
    ;
    return haystack.Etc.dictRemove(dict, "src");
  }

  static make() {
    const $self = new CoreLibUtil();
    CoreLibUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class TagNameUsage extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TagNameUsage.type$; }

  #count = 0;

  count(it) {
    if (it === undefined) {
      return this.#count;
    }
    else {
      this.#count = it;
      return;
    }
  }

  #marker = false;

  marker(it) {
    if (it === undefined) {
      return this.#marker;
    }
    else {
      this.#marker = it;
      return;
    }
  }

  #str = false;

  str(it) {
    if (it === undefined) {
      return this.#str;
    }
    else {
      this.#str = it;
      return;
    }
  }

  #ref = false;

  ref(it) {
    if (it === undefined) {
      return this.#ref;
    }
    else {
      this.#ref = it;
      return;
    }
  }

  #number = false;

  number(it) {
    if (it === undefined) {
      return this.#number;
    }
    else {
      this.#number = it;
      return;
    }
  }

  #bool = false;

  bool(it) {
    if (it === undefined) {
      return this.#bool;
    }
    else {
      this.#bool = it;
      return;
    }
  }

  #bin = false;

  bin(it) {
    if (it === undefined) {
      return this.#bin;
    }
    else {
      this.#bin = it;
      return;
    }
  }

  #uri = false;

  uri(it) {
    if (it === undefined) {
      return this.#uri;
    }
    else {
      this.#uri = it;
      return;
    }
  }

  #dateTime = false;

  dateTime(it) {
    if (it === undefined) {
      return this.#dateTime;
    }
    else {
      this.#dateTime = it;
      return;
    }
  }

  #date = false;

  date(it) {
    if (it === undefined) {
      return this.#date;
    }
    else {
      this.#date = it;
      return;
    }
  }

  #time = false;

  time(it) {
    if (it === undefined) {
      return this.#time;
    }
    else {
      this.#time = it;
      return;
    }
  }

  #coord = false;

  coord(it) {
    if (it === undefined) {
      return this.#coord;
    }
    else {
      this.#coord = it;
      return;
    }
  }

  #list = false;

  list(it) {
    if (it === undefined) {
      return this.#list;
    }
    else {
      this.#list = it;
      return;
    }
  }

  #dict = false;

  dict(it) {
    if (it === undefined) {
      return this.#dict;
    }
    else {
      this.#dict = it;
      return;
    }
  }

  #grid = false;

  grid(it) {
    if (it === undefined) {
      return this.#grid;
    }
    else {
      this.#grid = it;
      return;
    }
  }

  #symbol = false;

  symbol(it) {
    if (it === undefined) {
      return this.#symbol;
    }
    else {
      this.#symbol = it;
      return;
    }
  }

  toKind() {
    let s = sys.StrBuf.make();
    if (this.#marker) {
      s.join("Marker", "|");
    }
    ;
    if (this.#str) {
      s.join("Str", "|");
    }
    ;
    if (this.#ref) {
      s.join("Ref", "|");
    }
    ;
    if (this.#number) {
      s.join("Number", "|");
    }
    ;
    if (this.#bool) {
      s.join("Bool", "|");
    }
    ;
    if (this.#bin) {
      s.join("Bin", "|");
    }
    ;
    if (this.#uri) {
      s.join("Uri", "|");
    }
    ;
    if (this.#dateTime) {
      s.join("DateTime", "|");
    }
    ;
    if (this.#date) {
      s.join("Date", "|");
    }
    ;
    if (this.#time) {
      s.join("Time", "|");
    }
    ;
    if (this.#coord) {
      s.join("Coord", "|");
    }
    ;
    if (this.#list) {
      s.join("List", "|");
    }
    ;
    if (this.#dict) {
      s.join("Dict", "|");
    }
    ;
    if (this.#grid) {
      s.join("Grid", "|");
    }
    ;
    if (this.#symbol) {
      s.join("Symbol", "|");
    }
    ;
    return s.toStr();
  }

  add(val) {
    if (val == null) {
      return;
    }
    ;
    ((this$) => { let $_u68 = this$.#count;this$.#count = sys.Int.increment(this$.#count); return $_u68; })(this);
    let kind = haystack.Kind.fromVal(val, false);
    if (kind === haystack.Kind.marker()) {
      this.#marker = true;
      return;
    }
    ;
    if (kind === haystack.Kind.str()) {
      this.#str = true;
      return;
    }
    ;
    if (kind === haystack.Kind.ref()) {
      this.#ref = true;
      return;
    }
    ;
    if (kind === haystack.Kind.number()) {
      this.#number = true;
      return;
    }
    ;
    if (kind === haystack.Kind.bool()) {
      this.#bool = true;
      return;
    }
    ;
    if (kind === haystack.Kind.bin()) {
      this.#bin = true;
      return;
    }
    ;
    if (kind === haystack.Kind.uri()) {
      this.#uri = true;
      return;
    }
    ;
    if (kind === haystack.Kind.dateTime()) {
      this.#dateTime = true;
      return;
    }
    ;
    if (kind === haystack.Kind.date()) {
      this.#date = true;
      return;
    }
    ;
    if (kind === haystack.Kind.time()) {
      this.#time = true;
      return;
    }
    ;
    if (kind === haystack.Kind.coord()) {
      this.#coord = true;
      return;
    }
    ;
    if (kind === haystack.Kind.dict()) {
      this.#dict = true;
      return;
    }
    ;
    if (kind === haystack.Kind.grid()) {
      this.#grid = true;
      return;
    }
    ;
    if (kind === haystack.Kind.symbol()) {
      this.#symbol = true;
      return;
    }
    ;
    if (kind.isList()) {
      this.#list = true;
      return;
    }
    ;
    return;
  }

  static make() {
    const $self = new TagNameUsage();
    TagNameUsage.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class CoreLib extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CoreLib.type$; }

  static #foldStartVal = undefined;

  static foldStartVal() {
    if (CoreLib.#foldStartVal === undefined) {
      CoreLib.static$init();
      if (CoreLib.#foldStartVal === undefined) CoreLib.#foldStartVal = null;
    }
    return CoreLib.#foldStartVal;
  }

  static #foldEndVal = undefined;

  static foldEndVal() {
    if (CoreLib.#foldEndVal === undefined) {
      CoreLib.static$init();
      if (CoreLib.#foldEndVal === undefined) CoreLib.#foldEndVal = null;
    }
    return CoreLib.#foldEndVal;
  }

  static #unitYear = undefined;

  static unitYear() {
    if (CoreLib.#unitYear === undefined) {
      CoreLib.static$init();
      if (CoreLib.#unitYear === undefined) CoreLib.#unitYear = null;
    }
    return CoreLib.#unitYear;
  }

  static #unitMo = undefined;

  static unitMo() {
    if (CoreLib.#unitMo === undefined) {
      CoreLib.static$init();
      if (CoreLib.#unitMo === undefined) CoreLib.#unitMo = null;
    }
    return CoreLib.#unitMo;
  }

  static #unitWeek = undefined;

  static unitWeek() {
    if (CoreLib.#unitWeek === undefined) {
      CoreLib.static$init();
      if (CoreLib.#unitWeek === undefined) CoreLib.#unitWeek = null;
    }
    return CoreLib.#unitWeek;
  }

  static #unitDay = undefined;

  static unitDay() {
    if (CoreLib.#unitDay === undefined) {
      CoreLib.static$init();
      if (CoreLib.#unitDay === undefined) CoreLib.#unitDay = null;
    }
    return CoreLib.#unitDay;
  }

  static #unitHour = undefined;

  static unitHour() {
    if (CoreLib.#unitHour === undefined) {
      CoreLib.static$init();
      if (CoreLib.#unitHour === undefined) CoreLib.#unitHour = null;
    }
    return CoreLib.#unitHour;
  }

  static #unitMin = undefined;

  static unitMin() {
    if (CoreLib.#unitMin === undefined) {
      CoreLib.static$init();
      if (CoreLib.#unitMin === undefined) CoreLib.#unitMin = null;
    }
    return CoreLib.#unitMin;
  }

  static #unitSec = undefined;

  static unitSec() {
    if (CoreLib.#unitSec === undefined) {
      CoreLib.static$init();
      if (CoreLib.#unitSec === undefined) CoreLib.#unitSec = null;
    }
    return CoreLib.#unitSec;
  }

  static _equals(a,b) {
    return sys.ObjUtil.coerce(haystack.Etc.eq(a, b), sys.Obj.type$.toNullable());
  }

  static isEmpty(val) {
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, haystack.Dict.type$).isEmpty(), sys.Obj.type$.toNullable());
    }
    ;
    return sys.ObjUtil.trap(val,"isEmpty", sys.List.make(sys.Obj.type$.toNullable(), []));
  }

  static size(val) {
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      throw CoreLib.argErr("size", val);
    }
    ;
    let size = sys.ObjUtil.coerce(sys.ObjUtil.trap(val,"size", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$);
    return haystack.Number.make(sys.Num.toFloat(sys.ObjUtil.coerce(size, sys.Num.type$)));
  }

  static get(val,key) {
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Dict.type$).get(sys.ObjUtil.coerce(key, sys.Str.type$));
    }
    ;
    if (sys.ObjUtil.is(key, haystack.ObjRange.type$)) {
      return sys.ObjUtil.trap(val,"getRange", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(key, haystack.ObjRange.type$).toIntRange()]));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      return haystack.Number.makeInt(sys.Str.get(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(key, haystack.Number.type$).toInt()));
    }
    ;
    if (sys.ObjUtil.is(key, haystack.Number.type$)) {
      (key = sys.ObjUtil.coerce(sys.ObjUtil.coerce(key, haystack.Number.type$).toInt(), sys.Obj.type$.toNullable()));
    }
    ;
    return sys.ObjUtil.trap(val,"get", sys.List.make(sys.Obj.type$.toNullable(), [key]));
  }

  static getSafe(val,key) {
    let range = null;
    let index = 0;
    if (sys.ObjUtil.is(key, haystack.Number.type$)) {
      (index = sys.ObjUtil.coerce(key, haystack.Number.type$).toInt());
    }
    else {
      (range = sys.ObjUtil.coerce(key, haystack.ObjRange.type$).toIntRange());
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let x = sys.ObjUtil.coerce(val, sys.Type.find("sys::List"));
      return ((this$) => { if (range == null) return x.getSafe(index); return x.getRange(CoreLib.toSafeRange(x.size(), sys.ObjUtil.coerce(range, sys.Range.type$))); })(this);
    }
    else {
      if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
        let x = sys.ObjUtil.coerce(val, haystack.Grid.type$);
        return ((this$) => { if (range == null) return x.getSafe(index); return x.getRange(CoreLib.toSafeRange(x.size(), sys.ObjUtil.coerce(range, sys.Range.type$))); })(this);
      }
      else {
        if (sys.ObjUtil.is(val, sys.Str.type$)) {
          let x = sys.ObjUtil.coerce(val, sys.Str.type$);
          if (range != null) {
            return sys.Str.getRange(x, CoreLib.toSafeRange(sys.Str.size(x), sys.ObjUtil.coerce(range, sys.Range.type$)));
          }
          ;
          let char = sys.Str.getSafe(x, index);
          return ((this$) => { if (sys.ObjUtil.compareLE(char, 0)) return null; return haystack.Number.makeInt(char); })(this);
        }
        else {
          throw sys.Err.make(sys.Str.plus("Invalid val type: ", ((this$) => { let $_u72 = val; if ($_u72 == null) return null; return sys.ObjUtil.typeof(val); })(this)));
        }
        ;
      }
      ;
    }
    ;
  }

  static toSafeRange(size,r) {
    let s = r.start();
    if (sys.ObjUtil.compareLT(s, 0)) {
      (s = sys.Int.plus(size, s));
    }
    ;
    let e = r.end();
    if (sys.ObjUtil.compareLT(e, 0)) {
      (e = sys.Int.plus(size, e));
    }
    ;
    if ((sys.ObjUtil.compareGE(s, size) || sys.ObjUtil.compareLT(e, 0))) {
      return sys.Range.make(0, 0, true);
    }
    ;
    if (sys.ObjUtil.compareLT(s, 0)) {
      (s = 0);
    }
    ;
    if (sys.ObjUtil.compareGE(e, size)) {
      (e = sys.Int.minus(size, 1));
    }
    ;
    return sys.Range.make(s, e);
  }

  static first(val) {
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return FirstStream.make(sys.ObjUtil.coerce(val, MStream.type$)).run();
    }
    ;
    return sys.ObjUtil.trap(val,"first", sys.List.make(sys.Obj.type$.toNullable(), []));
  }

  static last(val) {
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return LastStream.make(sys.ObjUtil.coerce(val, MStream.type$)).run();
    }
    ;
    return sys.ObjUtil.trap(val,"last", sys.List.make(sys.Obj.type$.toNullable(), []));
  }

  static has(val,name) {
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, haystack.Dict.type$).has(name), sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, haystack.Grid.type$).has(name), sys.Obj.type$.toNullable());
    }
    ;
    throw CoreLib.argErr("has", val);
  }

  static missing(val,name) {
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, haystack.Dict.type$).missing(name), sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, haystack.Grid.type$).missing(name), sys.Obj.type$.toNullable());
    }
    ;
    throw CoreLib.argErr("missing", val);
  }

  static index(val,x,offset) {
    if (offset === undefined) offset = haystack.Number.zero();
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      let r = sys.Str.index(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(x, sys.Str.type$), offset.toInt());
      return ((this$) => { if (r == null) return null; return haystack.Number.makeInt(sys.ObjUtil.coerce(r, sys.Int.type$)); })(this);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let r = sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).index(x, offset.toInt());
      return ((this$) => { if (r == null) return null; return haystack.Number.makeInt(sys.ObjUtil.coerce(r, sys.Int.type$)); })(this);
    }
    ;
    throw CoreLib.argErr("index", val);
  }

  static indexr(val,x,offset) {
    if (offset === undefined) offset = haystack.Number.negOne();
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      let r = sys.Str.indexr(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(x, sys.Str.type$), offset.toInt());
      return ((this$) => { if (r == null) return null; return haystack.Number.makeInt(sys.ObjUtil.coerce(r, sys.Int.type$)); })(this);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let r = sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).indexr(x, offset.toInt());
      return ((this$) => { if (r == null) return null; return haystack.Number.makeInt(sys.ObjUtil.coerce(r, sys.Int.type$)); })(this);
    }
    ;
    throw CoreLib.argErr("indexr", val);
  }

  static contains(val,x) {
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      return sys.Str.contains(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(x, sys.Str.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")).contains(x);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.ObjRange.type$)) {
      return sys.ObjUtil.coerce(val, haystack.ObjRange.type$).contains(x);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.DateSpan.type$)) {
      return sys.ObjUtil.coerce(val, haystack.DateSpan.type$).contains(sys.ObjUtil.coerce(x, sys.Date.type$.toNullable()));
    }
    ;
    throw CoreLib.argErr("contains", val);
  }

  static add(val,item) {
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return CoreLib.mutList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]"))).add(item);
    }
    ;
    throw CoreLib.argErr("add", val);
  }

  static addAll(val,items) {
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return CoreLib.mutList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]"))).addAll(sys.ObjUtil.coerce(items, sys.Type.find("sys::Obj?[]")));
    }
    ;
    throw CoreLib.argErr("addAll", val);
  }

  static set(val,key,item) {
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return CoreLib.mutList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]"))).set(sys.ObjUtil.coerce(key, haystack.Number.type$).toInt(), item);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return haystack.Etc.dictSet(sys.ObjUtil.coerce(val, haystack.Dict.type$.toNullable()), sys.ObjUtil.coerce(key, sys.Str.type$), item);
    }
    ;
    throw CoreLib.argErr("set", val);
  }

  static merge(a,b) {
    return haystack.Etc.dictMerge(sys.ObjUtil.coerce(a, haystack.Dict.type$), b);
  }

  static insert(val,index,item) {
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return CoreLib.mutList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]"))).insert(index.toInt(), item);
    }
    ;
    throw CoreLib.argErr("insert", val);
  }

  static insertAll(val,index,items) {
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return CoreLib.mutList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]"))).insertAll(index.toInt(), sys.ObjUtil.coerce(sys.ObjUtil.coerce(items, sys.Type.find("sys::List")), sys.Type.find("sys::Obj?[]")));
    }
    ;
    throw CoreLib.argErr("insertAll", val);
  }

  static remove(val,key) {
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let list = sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).dup();
      list.removeAt(sys.ObjUtil.coerce(key, haystack.Number.type$).toInt());
      return list;
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return haystack.Etc.dictRemove(sys.ObjUtil.coerce(val, haystack.Dict.type$), sys.ObjUtil.coerce(key, sys.Str.type$));
    }
    ;
    throw CoreLib.argErr("remove", val);
  }

  static mutList(list) {
    return sys.List.make(sys.Obj.type$.toNullable()).addAll(list);
  }

  static stream(val) {
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return GridStream.make(sys.ObjUtil.coerce(val, haystack.Grid.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return ListStream.make(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.ObjRange.type$)) {
      return RangeStream.make(sys.ObjUtil.coerce(val, haystack.ObjRange.type$).toIntRange());
    }
    ;
    throw CoreLib.argErr("stream", val);
  }

  static streamCol(grid,col) {
    return GridColStream.make(grid, sys.ObjUtil.coerce(((this$) => { let $_u77 = sys.ObjUtil.as(col, haystack.Col.type$); if ($_u77 != null) return $_u77; return grid.col(sys.ObjUtil.toStr(col)); })(this), haystack.Col.type$));
  }

  static collect(stream,to) {
    if (to === undefined) to = null;
    return sys.ObjUtil.coerce(CollectStream.make(sys.ObjUtil.coerce(stream, MStream.type$), to).run(), sys.Obj.type$);
  }

  static limit(stream,limit) {
    return LimitStream.make(sys.ObjUtil.coerce(stream, MStream.type$), limit.toInt());
  }

  static skip(stream,count) {
    let c = count.toInt();
    if (sys.ObjUtil.compareLE(c, 0)) {
      return sys.ObjUtil.coerce(stream, sys.Obj.type$);
    }
    ;
    return SkipStream.make(sys.ObjUtil.coerce(stream, MStream.type$), c);
  }

  static sort(val,sorter) {
    if (sorter === undefined) sorter = null;
    return CoreLibUtil.sort(val, sorter, true);
  }

  static sortDis(val) {
    return val.sortDis();
  }

  static sortr(val,sorter) {
    if (sorter === undefined) sorter = null;
    return CoreLibUtil.sort(val, sorter, false);
  }

  static each(val,fn) {
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return EachStream.make(sys.ObjUtil.coerce(val, MStream.type$), fn).run();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      sys.ObjUtil.coerce(val, haystack.Grid.type$).each(sys.ObjUtil.coerce(CoreLib.toGridIterator(fn), sys.Type.find("|haystack::Row,sys::Int->sys::Void|")));
      return null;
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      haystack.Etc.dictEach(sys.ObjUtil.coerce(val, haystack.Dict.type$), sys.ObjUtil.coerce(CoreLib.toDictIterator(fn), sys.Type.find("|sys::Obj?,sys::Str->sys::Void|")));
      return null;
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).each(sys.ObjUtil.coerce(CoreLib.toListIterator(fn), sys.Type.find("|sys::V,sys::Int->sys::Void|")));
      return null;
    }
    ;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      sys.Str.each(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(CoreLib.toStrIterator(fn), sys.Type.find("|sys::Int,sys::Int->sys::Void|")));
      return null;
    }
    ;
    if (sys.ObjUtil.is(val, haystack.ObjRange.type$)) {
      sys.ObjUtil.coerce(val, haystack.ObjRange.type$).toIntRange().each(sys.ObjUtil.coerce(CoreLib.toRangeIterator(fn), sys.Type.find("|sys::Int->sys::Void|")));
      return null;
    }
    ;
    throw CoreLib.argErr("each", val);
  }

  static eachWhile(val,fn) {
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return EachWhileStream.make(sys.ObjUtil.coerce(val, MStream.type$), fn).run();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Grid.type$).eachWhile(sys.ObjUtil.coerce(CoreLib.toGridIterator(fn), sys.Type.find("|haystack::Row,sys::Int->sys::Obj?|")));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return haystack.Etc.dictEachWhile(sys.ObjUtil.coerce(val, haystack.Dict.type$), sys.ObjUtil.coerce(CoreLib.toDictIterator(fn), sys.Type.find("|sys::Obj?,sys::Str->sys::Obj?|")));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).eachWhile(sys.ObjUtil.coerce(CoreLib.toListIterator(fn), sys.Type.find("|sys::V,sys::Int->sys::Obj?|")));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      return sys.Str.eachWhile(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(CoreLib.toStrIterator(fn), sys.Type.find("|sys::Int,sys::Int->sys::Obj?|")));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.ObjRange.type$)) {
      return sys.ObjUtil.coerce(val, haystack.ObjRange.type$).toIntRange().eachWhile(sys.ObjUtil.coerce(CoreLib.toRangeIterator(fn), sys.Type.find("|sys::Int->sys::Obj?|")));
    }
    ;
    throw CoreLib.argErr("eachWhile", val);
  }

  static map(val,fn) {
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return MapStream.make(sys.ObjUtil.coerce(val, MStream.type$), fn);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Grid.type$).map(sys.ObjUtil.coerce(CoreLib.toGridIterator(fn), sys.Type.find("|haystack::Row,sys::Int->sys::Obj?|")));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return haystack.Etc.dictMap(sys.ObjUtil.coerce(val, haystack.Dict.type$), sys.ObjUtil.coerce(CoreLib.toDictIterator(fn), sys.Type.find("|sys::Obj?,sys::Str->sys::Obj?|")));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).map(sys.ObjUtil.coerce(CoreLib.toListIterator(fn), sys.Type.find("|sys::V,sys::Int->sys::Obj?|")));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.ObjRange.type$)) {
      return sys.ObjUtil.coerce(val, haystack.ObjRange.type$).toIntRange().map(sys.ObjUtil.coerce(CoreLib.toRangeIterator(fn), sys.Type.find("|sys::Int->sys::Obj?|")));
    }
    ;
    throw CoreLib.argErr("map", val);
  }

  static flatMap(val,fn) {
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return FlatMapStream.make(sys.ObjUtil.coerce(val, MStream.type$), fn);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Grid.type$).flatMap(sys.ObjUtil.coerce(CoreLib.toGridIterator(fn), sys.Type.find("|haystack::Row,sys::Int->sys::Obj?|")));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).flatMap(sys.ObjUtil.coerce(CoreLib.toListIterator(fn), sys.Type.find("|sys::V,sys::Int->sys::Obj?[]|")));
    }
    ;
    throw CoreLib.argErr("flatMap", val);
  }

  static find(val,fn) {
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return FindStream.make(sys.ObjUtil.coerce(val, MStream.type$), fn).run();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Grid.type$).find(sys.ObjUtil.coerce(CoreLib.toGridIterator(fn), sys.Type.find("|haystack::Row,sys::Int->sys::Bool|")));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return haystack.Etc.dictFind(sys.ObjUtil.coerce(val, haystack.Dict.type$), sys.ObjUtil.coerce(CoreLib.toDictIterator(fn), sys.Type.find("|sys::Obj?,sys::Str->sys::Bool|")));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).find(sys.ObjUtil.coerce(CoreLib.toListIterator(fn), sys.Type.find("|sys::V,sys::Int->sys::Bool|")));
    }
    ;
    throw CoreLib.argErr("findAll", val);
  }

  static findAll(val,fn) {
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return FindAllStream.make(sys.ObjUtil.coerce(val, MStream.type$), fn);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Grid.type$).findAll(sys.ObjUtil.coerce(CoreLib.toGridIterator(fn), sys.Type.find("|haystack::Row,sys::Int->sys::Bool|")));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).findAll(sys.ObjUtil.coerce(CoreLib.toListIterator(fn), sys.Type.find("|sys::V,sys::Int->sys::Bool|")));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return haystack.Etc.dictFindAll(sys.ObjUtil.coerce(val, haystack.Dict.type$), sys.ObjUtil.coerce(CoreLib.toDictIterator(fn), sys.Type.find("|sys::Obj?,sys::Str->sys::Bool|")));
    }
    ;
    throw CoreLib.argErr("findAll", val);
  }

  static filter(val,filterExpr) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let v = val.eval(sys.ObjUtil.coerce(cx, AxonContext.type$));
    let filter = filterExpr.evalToFilter(sys.ObjUtil.coerce(cx, AxonContext.type$));
    if (sys.ObjUtil.is(v, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(v, haystack.Grid.type$).filter(sys.ObjUtil.coerce(filter, haystack.Filter.type$), cx);
    }
    ;
    if (sys.ObjUtil.is(v, MStream.type$)) {
      return FilterStream.make(sys.ObjUtil.coerce(v, MStream.type$), sys.ObjUtil.coerce(filter, haystack.Filter.type$));
    }
    ;
    let list = ((this$) => { let $_u78 = sys.ObjUtil.as(v, sys.Type.find("sys::Obj?[]")); if ($_u78 != null) return $_u78; throw CoreLib.argErr("filter val", v); })(this);
    return list.findAll((item) => {
      if (item == null) {
        return false;
      }
      ;
      if (sys.ObjUtil.is(item, haystack.Dict.type$)) {
        return filter.matches(sys.ObjUtil.coerce(item, haystack.Dict.type$), cx);
      }
      ;
      if (sys.ObjUtil.is(item, haystack.Col.type$)) {
        return filter.matches(sys.ObjUtil.coerce(item, haystack.Col.type$).meta(), cx);
      }
      ;
      throw CoreLib.argErr("filter item", item);
    });
  }

  static all(val,fn) {
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return AllStream.make(sys.ObjUtil.coerce(val, MStream.type$), fn).run();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, haystack.Grid.type$).all(sys.ObjUtil.coerce(CoreLib.toGridIterator(fn), sys.Type.find("|haystack::Row,sys::Int->sys::Bool|"))), sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).all(sys.ObjUtil.coerce(CoreLib.toListIterator(fn), sys.Type.find("|sys::V,sys::Int->sys::Bool|"))), sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return sys.ObjUtil.coerce(haystack.Etc.dictAll(sys.ObjUtil.coerce(val, haystack.Dict.type$), sys.ObjUtil.coerce(CoreLib.toDictIterator(fn), sys.Type.find("|sys::Obj?,sys::Str->sys::Bool|"))), sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      return sys.ObjUtil.coerce(sys.Str.all(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(CoreLib.toStrIterator(fn), sys.Type.find("|sys::Int,sys::Int->sys::Bool|"))), sys.Obj.type$.toNullable());
    }
    ;
    throw CoreLib.argErr("any", val);
  }

  static any(val,fn) {
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return AnyStream.make(sys.ObjUtil.coerce(val, MStream.type$), fn).run();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, haystack.Grid.type$).any(sys.ObjUtil.coerce(CoreLib.toGridIterator(fn), sys.Type.find("|haystack::Row,sys::Int->sys::Bool|"))), sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).any(sys.ObjUtil.coerce(CoreLib.toListIterator(fn), sys.Type.find("|sys::V,sys::Int->sys::Bool|"))), sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return sys.ObjUtil.coerce(haystack.Etc.dictAny(sys.ObjUtil.coerce(val, haystack.Dict.type$), sys.ObjUtil.coerce(CoreLib.toDictIterator(fn), sys.Type.find("|sys::Obj?,sys::Str->sys::Bool|"))), sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      return sys.ObjUtil.coerce(sys.Str.any(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(CoreLib.toStrIterator(fn), sys.Type.find("|sys::Int,sys::Int->sys::Bool|"))), sys.Obj.type$.toNullable());
    }
    ;
    throw CoreLib.argErr("any", val);
  }

  static reduce(val,init,fn) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return ReduceStream.make(sys.ObjUtil.coerce(val, MStream.type$), init, fn).run();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      (val = sys.ObjUtil.coerce(val, haystack.Grid.type$).toRows());
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).reduce(init, (acc,item,index) => {
        return fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), sys.List.make(sys.Obj.type$.toNullable(), [acc, item, haystack.Number.makeInt(index)]));
      });
    }
    ;
    throw CoreLib.argErr("reduce", val);
  }

  static moveTo(list,item,toIndex) {
    return list.dup().moveTo(item, toIndex.toInt());
  }

  static unique(val,key) {
    if (key === undefined) key = null;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).unique();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Grid.type$).unique(sys.ObjUtil.coerce(((this$) => { let $_u79 = sys.ObjUtil.as(key, sys.Type.find("sys::Obj[]")); if ($_u79 != null) return $_u79; return sys.List.make(sys.Obj.type$.toNullable(), [key]); })(this), sys.Type.find("sys::Obj[]")));
    }
    ;
    throw CoreLib.argErr("unique", val);
  }

  static flatten(list) {
    const this$ = this;
    if (list.isEmpty()) {
      return list;
    }
    ;
    if ((list.of().fits(haystack.Grid.type$) || list.all((x) => {
      return sys.ObjUtil.is(x, haystack.Grid.type$);
    }))) {
      return haystack.Etc.gridFlatten(sys.ObjUtil.coerce(list, sys.Type.find("haystack::Grid[]")));
    }
    else {
      return list.flatten();
    }
    ;
  }

  static gridRowsToDict(grid,rowToKey,rowToVal) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    let args = sys.List.make(sys.Obj.type$.toNullable(), [null, null]);
    grid.each((row,i) => {
      let index = haystack.Number.makeInt(i);
      let key = rowToKey.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, row).set(1, index));
      let val = rowToVal.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, row).set(1, index));
      map.set(sys.ObjUtil.coerce(key, sys.Str.type$), val);
      return;
    });
    return haystack.Etc.makeDict(map);
  }

  static gridColsToDict(grid,colToKey,colToVal) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    let args = sys.List.make(sys.Obj.type$.toNullable(), [null, null]);
    grid.cols().each((col,i) => {
      let index = haystack.Number.makeInt(i);
      let key = colToKey.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, col).set(1, index));
      let val = colToVal.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, col).set(1, index));
      map.set(sys.ObjUtil.coerce(key, sys.Str.type$), val);
      return;
    });
    return haystack.Etc.makeDict(map);
  }

  static gridColKinds(grid) {
    return CoreLibUtil.gridColKinds(grid);
  }

  static toGridIterator(fn) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let args = sys.List.make(sys.Obj.type$.toNullable(), [null, null]);
    return (row,i) => {
      return fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, row).set(1, haystack.Number.makeInt(i)));
    };
  }

  static toDictIterator(fn) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let args = sys.List.make(sys.Obj.type$.toNullable(), [null, null]);
    return (v,k) => {
      return fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, v).set(1, k));
    };
  }

  static toListIterator(fn) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let args = sys.List.make(sys.Obj.type$.toNullable(), [null, null]);
    return (v,i) => {
      return fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, v).set(1, haystack.Number.makeInt(i)));
    };
  }

  static toStrIterator(fn) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let args = sys.List.make(sys.Obj.type$.toNullable(), [null, null]);
    return (ch,i) => {
      return fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, haystack.Number.makeInt(ch)).set(1, haystack.Number.makeInt(i)));
    };
  }

  static toRangeIterator(fn) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let args = sys.List.make(sys.Obj.type$.toNullable(), [null]);
    return (i) => {
      return fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, haystack.Number.makeInt(i)));
    };
  }

  static fold(val,fn) {
    const this$ = this;
    if (sys.ObjUtil.is(val, MStream.type$)) {
      return FoldStream.make(sys.ObjUtil.coerce(val, MStream.type$), fn).run();
    }
    ;
    let list = ((this$) => { let $_u80 = sys.ObjUtil.as(val, sys.Type.find("sys::List")); if ($_u80 != null) return $_u80; throw CoreLib.argErr("fold", val); })(this);
    let cx = AxonContext.curAxon();
    let args = sys.List.make(sys.Obj.type$.toNullable(), [CoreLib.foldStartVal(), null]);
    let r = fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args);
    let na = list.eachWhile((item) => {
      (r = fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, item).set(1, r)));
      if (r === haystack.NA.val()) {
        return r;
      }
      ;
      return null;
    });
    if (na != null) {
      return na;
    }
    ;
    return fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, CoreLib.foldEndVal()).set(1, r));
  }

  static foldCol(grid,colName,fn) {
    const this$ = this;
    let col = grid.col(colName);
    let cx = AxonContext.curAxon();
    let args = sys.List.make(sys.Obj.type$.toNullable(), [CoreLib.foldStartVal(), null]);
    let r = fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args);
    let na = grid.eachWhile((row) => {
      (r = fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, row.val(sys.ObjUtil.coerce(col, haystack.Col.type$))).set(1, r)));
      if (r === haystack.NA.val()) {
        return r;
      }
      ;
      return null;
    });
    if (na != null) {
      return na;
    }
    ;
    return fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, CoreLib.foldEndVal()).set(1, r));
  }

  static foldCols(grid,colSelector,newColName,fn) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let cols = null;
    if (sys.ObjUtil.is(colSelector, sys.Type.find("sys::List"))) {
      let cs = sys.ObjUtil.coerce(colSelector, sys.Type.find("sys::Str[]"));
      (cols = grid.cols().findAll((c) => {
        return cs.contains(c.name());
      }));
    }
    else {
      let cs = sys.ObjUtil.coerce(colSelector, Fn.type$);
      let csArgs = sys.List.make(sys.Obj.type$.toNullable(), [null]);
      (cols = grid.cols().findAll((c) => {
        return sys.ObjUtil.coerce(cs.call(sys.ObjUtil.coerce(cx, AxonContext.type$), csArgs.set(0, c)), sys.Bool.type$);
      }));
    }
    ;
    let origRows = sys.ObjUtil.coerce(sys.ObjUtil.trap(grid,"toRows", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Type.find("haystack::Row[]"));
    let removed = grid.removeCols(cols.map((c) => {
      return c.name();
    }, sys.Str.type$));
    let added = removed.addCol(newColName, haystack.Etc.emptyDict(), (ignore,i) => {
      let row = origRows.get(i);
      let args = sys.List.make(sys.Obj.type$.toNullable(), [CoreLib.foldStartVal(), null]);
      let r = fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args);
      cols.each((col) => {
        (r = fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, row.val(col)).set(1, r)));
        return;
      });
      return fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, CoreLib.foldEndVal()).set(1, r));
    });
    return added;
  }

  static foldStart() {
    return CoreLib.foldStartVal();
  }

  static foldEnd() {
    return CoreLib.foldEndVal();
  }

  static count(val,acc) {
    if (val === CoreLib.foldStartVal()) {
      return haystack.Number.zero();
    }
    ;
    if (val === CoreLib.foldEndVal()) {
      return acc;
    }
    ;
    return sys.ObjUtil.coerce(acc, haystack.Number.type$).increment();
  }

  static sum(val,acc) {
    if (val === CoreLib.foldStartVal()) {
      return null;
    }
    ;
    if (val === CoreLib.foldEndVal()) {
      return acc;
    }
    ;
    if ((val === haystack.NA.val() || acc === haystack.NA.val())) {
      return haystack.NA.val();
    }
    ;
    if (val == null) {
      return acc;
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Number.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Number.type$).plus(sys.ObjUtil.coerce(((this$) => { let $_u81 = acc; if ($_u81 != null) return $_u81; return haystack.Number.zero(); })(this), haystack.Number.type$));
    }
    ;
    throw CoreLib.argErr("Cannot sum", val);
  }

  static min(val,acc) {
    if (val === CoreLib.foldStartVal()) {
      return haystack.Number.posInf();
    }
    ;
    if (val === CoreLib.foldEndVal()) {
      return ((this$) => { if (sys.ObjUtil.equals(acc, haystack.Number.posInf())) return null; return acc; })(this);
    }
    ;
    if ((val === haystack.NA.val() || acc === haystack.NA.val())) {
      return haystack.NA.val();
    }
    ;
    if (val == null) {
      return acc;
    }
    ;
    if (acc == null) {
      return val;
    }
    ;
    return sys.ObjUtil.coerce(val, haystack.Number.type$).min(sys.ObjUtil.coerce(acc, haystack.Number.type$));
  }

  static max(val,acc) {
    if (val === CoreLib.foldStartVal()) {
      return CoreLib.foldStartVal();
    }
    ;
    if (val === CoreLib.foldEndVal()) {
      return ((this$) => { if (sys.ObjUtil.equals(acc, CoreLib.foldStartVal())) return null; return acc; })(this);
    }
    ;
    if (acc === CoreLib.foldStartVal()) {
      return val;
    }
    ;
    if ((val === haystack.NA.val() || acc === haystack.NA.val())) {
      return haystack.NA.val();
    }
    ;
    if (val == null) {
      return acc;
    }
    ;
    if (acc == null) {
      return val;
    }
    ;
    return sys.ObjUtil.coerce(val, haystack.Number.type$).max(sys.ObjUtil.coerce(acc, haystack.Number.type$));
  }

  static avg(val,acc) {
    if (val === CoreLib.foldStartVal()) {
      return sys.List.make(haystack.Number.type$, [haystack.Number.zero(), haystack.Number.zero()]);
    }
    ;
    if ((val === haystack.NA.val() || acc === haystack.NA.val())) {
      return haystack.NA.val();
    }
    ;
    let state = CoreLib.toFoldNumAcc("avg", acc);
    let count = state.get(0);
    let total = state.get(1);
    if (val === CoreLib.foldEndVal()) {
      return ((this$) => { if (sys.ObjUtil.equals(count.toFloat(), sys.Float.make(0.0))) return null; return total.div(count); })(this);
    }
    ;
    if (val == null) {
      return acc;
    }
    ;
    state.set(0, count.increment());
    state.set(1, total.plus(sys.ObjUtil.coerce(val, haystack.Number.type$)));
    return state;
  }

  static spread(val,acc) {
    if (val === CoreLib.foldStartVal()) {
      return sys.List.make(haystack.Number.type$, [haystack.Number.posInf(), haystack.Number.negInf()]);
    }
    ;
    if ((val === haystack.NA.val() || acc === haystack.NA.val())) {
      return haystack.NA.val();
    }
    ;
    let state = CoreLib.toFoldNumAcc("spread", acc);
    if (val === CoreLib.foldEndVal()) {
      return ((this$) => { if (sys.ObjUtil.equals(state.get(0), haystack.Number.posInf())) return null; return state.get(1).minus(state.get(0)); })(this);
    }
    ;
    if (val == null) {
      return state;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    state.set(0, num.min(state.get(0)));
    state.set(1, num.max(state.get(1)));
    return state;
  }

  static toFoldNumAcc(name,acc) {
    let list = sys.ObjUtil.as(acc, sys.Type.find("sys::List"));
    if ((list != null && sys.ObjUtil.equals(list.size(), 2))) {
      return sys.ObjUtil.coerce(list, sys.Type.find("haystack::Number[]"));
    }
    ;
    throw sys.Err.make(sys.Str.plus(sys.Str.plus("Invalid accumulator; try using fold(", name), ")"));
  }

  static marker() {
    return haystack.Marker.val();
  }

  static removeMarker() {
    return haystack.Remove.val();
  }

  static na() {
    return haystack.NA.val();
  }

  static isTagName(n) {
    return haystack.Etc.isTagName(n);
  }

  static toTagName(n) {
    return haystack.Etc.toTagName(n);
  }

  static names(dict) {
    return haystack.Etc.dictNames(dict);
  }

  static vals(dict) {
    return haystack.Etc.dictVals(dict);
  }

  static _trap(val,name) {
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Dict.type$).trap(name, null);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
      return AxonContext.curAxon().trapRef(sys.ObjUtil.coerce(val, haystack.Ref.type$)).trap(name, null);
    }
    ;
    throw CoreLib.argErr("trap", val);
  }

  static meta(val) {
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Grid.type$).meta();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Col.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Col.type$).meta();
    }
    ;
    throw CoreLib.argErr("meta", val);
  }

  static cols(grid) {
    return grid.cols();
  }

  static col(grid,name,checked) {
    if (checked === undefined) checked = true;
    return grid.col(name, checked);
  }

  static colNames(grid) {
    return grid.colNames();
  }

  static name(val) {
    if (sys.ObjUtil.is(val, haystack.Col.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Col.type$).name();
    }
    ;
    throw CoreLib.argErr("name", val);
  }

  static setMeta(grid,meta) {
    if (sys.ObjUtil.is(grid, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(grid, haystack.Grid.type$).setMeta(meta);
    }
    ;
    if (sys.ObjUtil.is(grid, MStream.type$)) {
      return SetMetaStream.make(sys.ObjUtil.coerce(grid, MStream.type$), meta);
    }
    ;
    throw CoreLib.argErr("setMeta", grid);
  }

  static addMeta(grid,meta) {
    if (sys.ObjUtil.is(grid, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(grid, haystack.Grid.type$).addMeta(meta);
    }
    ;
    if (sys.ObjUtil.is(grid, MStream.type$)) {
      return AddMetaStream.make(sys.ObjUtil.coerce(grid, MStream.type$), meta);
    }
    ;
    throw CoreLib.argErr("setMeta", grid);
  }

  static join(a,b,joinColName) {
    return a.join(b, joinColName);
  }

  static joinAll(grids,joinColName) {
    const this$ = this;
    if (grids.isEmpty()) {
      throw sys.ArgErr.make("Grid.joinAll no grids specified");
    }
    ;
    if (sys.ObjUtil.equals(grids.size(), 1)) {
      return sys.ObjUtil.coerce(grids.first(), haystack.Grid.type$);
    }
    ;
    let result = grids.first();
    grids.eachRange(sys.Range.make(1, -1), (x) => {
      (result = result.join(x, joinColName));
      return;
    });
    return sys.ObjUtil.coerce(result, haystack.Grid.type$);
  }

  static addCol(grid,col,fn) {
    let name = sys.ObjUtil.as(col, sys.Str.type$);
    let meta = haystack.Etc.emptyDict();
    if (sys.ObjUtil.is(col, haystack.Dict.type$)) {
      (meta = sys.ObjUtil.coerce(col, haystack.Dict.type$));
      (name = sys.ObjUtil.coerce(meta.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$.toNullable()));
    }
    ;
    return grid.addCol(sys.ObjUtil.coerce(name, sys.Str.type$), meta, sys.ObjUtil.coerce(CoreLib.toGridIterator(fn), sys.Type.find("|haystack::Row,sys::Int->sys::Obj?|")));
  }

  static addCols(a,b) {
    return a.addCols(b);
  }

  static renameCol(grid,oldName,newName) {
    return grid.renameCol(oldName, newName);
  }

  static renameCols(grid,mapping) {
    return grid.renameCols(sys.ObjUtil.coerce(haystack.Etc.dictToMap(mapping), sys.Type.find("[sys::Str:sys::Str]")));
  }

  static reorderCols(grid,colNames) {
    if (sys.ObjUtil.is(grid, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(grid, haystack.Grid.type$).reorderCols(colNames);
    }
    ;
    if (sys.ObjUtil.is(grid, MStream.type$)) {
      return ReorderColsStream.make(sys.ObjUtil.coerce(grid, MStream.type$), colNames);
    }
    ;
    throw CoreLib.argErr("reorderCols", grid);
  }

  static setColMeta(grid,name,meta) {
    if (sys.ObjUtil.is(grid, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(grid, haystack.Grid.type$).setColMeta(name, meta);
    }
    ;
    if (sys.ObjUtil.is(grid, MStream.type$)) {
      return SetColMetaStream.make(sys.ObjUtil.coerce(grid, MStream.type$), name, meta);
    }
    ;
    throw CoreLib.argErr("setColMeta", grid);
  }

  static addColMeta(grid,name,meta) {
    if (sys.ObjUtil.is(grid, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(grid, haystack.Grid.type$).addColMeta(name, meta);
    }
    ;
    if (sys.ObjUtil.is(grid, MStream.type$)) {
      return AddColMetaStream.make(sys.ObjUtil.coerce(grid, MStream.type$), name, meta);
    }
    ;
    throw CoreLib.argErr("addColMeta", grid);
  }

  static removeCol(grid,col) {
    if (sys.ObjUtil.is(grid, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(grid, haystack.Grid.type$).removeCol(col);
    }
    ;
    if (sys.ObjUtil.is(grid, MStream.type$)) {
      return RemoveColsStream.make(sys.ObjUtil.coerce(grid, MStream.type$), sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$, [col]), sys.Type.find("sys::Str[]")));
    }
    ;
    throw CoreLib.argErr("removeCol", grid);
  }

  static removeCols(grid,cols) {
    if (sys.ObjUtil.is(grid, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(grid, haystack.Grid.type$).removeCols(cols);
    }
    ;
    if (sys.ObjUtil.is(grid, MStream.type$)) {
      return RemoveColsStream.make(sys.ObjUtil.coerce(grid, MStream.type$), sys.ObjUtil.coerce(cols, sys.Type.find("sys::Str[]")));
    }
    ;
    throw CoreLib.argErr("removeCols", grid);
  }

  static keepCols(grid,cols) {
    if (sys.ObjUtil.is(grid, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(grid, haystack.Grid.type$).keepCols(cols);
    }
    ;
    if (sys.ObjUtil.is(grid, MStream.type$)) {
      return KeepColsStream.make(sys.ObjUtil.coerce(grid, MStream.type$), sys.ObjUtil.coerce(cols, sys.Type.find("sys::Str[]")));
    }
    ;
    throw CoreLib.argErr("keepCols", grid);
  }

  static addRow(grid,newRow) {
    return CoreLib.addRows(grid, sys.List.make(haystack.Dict.type$, [newRow]));
  }

  static addRows(grid,newRows) {
    const this$ = this;
    let newRowsSize = 0;
    try {
      (newRowsSize = sys.ObjUtil.coerce(sys.ObjUtil.trap(newRows,"size", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$));
      if (sys.ObjUtil.equals(newRowsSize, 0)) {
        return grid;
      }
      ;
    }
    catch ($_u86) {
      $_u86 = sys.Err.make($_u86);
      if ($_u86 instanceof sys.Err) {
        let e = $_u86;
        ;
        e.trace();
      }
      else {
        throw $_u86;
      }
    }
    ;
    let rows = sys.List.make(haystack.Dict.type$);
    rows.capacity(sys.Int.plus(grid.size(), newRowsSize));
    grid.each((row) => {
      rows.add(row);
      return;
    });
    if (sys.ObjUtil.is(newRows, sys.Type.find("sys::List"))) {
      rows.addAll(sys.ObjUtil.coerce(newRows, sys.Type.find("haystack::Dict[]")));
    }
    else {
      if (sys.ObjUtil.is(newRows, haystack.Grid.type$)) {
        sys.ObjUtil.coerce(newRows, haystack.Grid.type$).each((row) => {
          rows.add(row);
          return;
        });
      }
      else {
        throw sys.ArgErr.make(sys.Str.plus("Invalid newRows type: ", sys.ObjUtil.typeof(newRows)));
      }
      ;
    }
    ;
    let cols = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Dict"));
    cols.ordered(true);
    grid.cols().each((col) => {
      cols.set(col.name(), col.meta());
      return;
    });
    rows.each((r) => {
      haystack.Etc.dictEach(r, (v,n) => {
        if (cols.get(n) == null) {
          cols.set(n, haystack.Etc.emptyDict());
        }
        ;
        return;
      });
      return;
    });
    if ((sys.ObjUtil.compareGT(cols.size(), 1) && cols.get("empty") != null && rows.all((it) => {
      return it.missing("empty");
    }))) {
      cols.remove("empty");
    }
    ;
    let gb = haystack.GridBuilder.make();
    gb.setMeta(grid.meta());
    cols.each((meta,name) => {
      gb.addCol(name, meta);
      return;
    });
    gb.addDictRows(rows);
    return gb.toGrid();
  }

  static rowToList(row) {
    const this$ = this;
    return sys.ObjUtil.coerce(((this$) => { let $_u87 = row.cells(); if ($_u87 != null) return $_u87; return row.grid().cols().map((c) => {
      return row.val(c);
    }, sys.Obj.type$.toNullable()); })(this), sys.Type.find("sys::Obj?[]"));
  }

  static colToList(grid,col) {
    return grid.colToList(col);
  }

  static transpose(grid) {
    return grid.transpose();
  }

  static swizzleRefs(grid) {
    const this$ = this;
    let oldToNewIds = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Ref"));
    grid.each((r) => {
      oldToNewIds.set(r.id(), haystack.Ref.gen());
      return;
    });
    return grid.map((r) => {
      let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
      r.each((v,n) => {
        map.set(n, CoreLib.swizzleRefsVal(oldToNewIds, v));
        return;
      });
      return haystack.Etc.makeDict(map);
    }, sys.Obj.type$.toNullable());
  }

  static gridReplace(grid,from$,to) {
    return grid.replace(from$, to);
  }

  static swizzleRefsVal(oldToNewIds,v) {
    const this$ = this;
    if (v == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(v, haystack.Ref.type$)) {
      return oldToNewIds.get(sys.ObjUtil.coerce(v, haystack.Ref.type$), sys.ObjUtil.coerce(v, haystack.Ref.type$.toNullable()));
    }
    ;
    if (sys.ObjUtil.is(v, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(v, sys.Type.find("sys::List")).map((x) => {
        return CoreLib.swizzleRefsVal(oldToNewIds, x);
      }, sys.Obj.type$.toNullable());
    }
    ;
    return v;
  }

  static times(times,fn) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let args = sys.List.make(sys.Obj.type$.toNullable(), [null]);
    sys.Int.times(times.toInt(), (i) => {
      fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, haystack.Number.makeInt(i)));
      return;
    });
    return null;
  }

  static isOdd(val) {
    return sys.ObjUtil.coerce(sys.Int.isOdd(val.toInt()), sys.Obj.type$.toNullable());
  }

  static isEven(val) {
    return sys.ObjUtil.coerce(sys.Int.isEven(val.toInt()), sys.Obj.type$.toNullable());
  }

  static abs(val) {
    return ((this$) => { let $_u88 = val; if ($_u88 == null) return null; return val.abs(); })(this);
  }

  static isNaN(val) {
    return (sys.ObjUtil.is(val, haystack.Number.type$) && sys.ObjUtil.coerce(val, haystack.Number.type$).isNaN());
  }

  static nan() {
    return haystack.Number.nan();
  }

  static posInf() {
    return haystack.Number.posInf();
  }

  static negInf() {
    return haystack.Number.negInf();
  }

  static clamp(val,min,max) {
    return val.clamp(min, max);
  }

  static today() {
    return sys.Date.today();
  }

  static yesterday() {
    return sys.Date.today().minus(sys.Duration.fromStr("1day"));
  }

  static now() {
    return sys.DateTime.now();
  }

  static nowUtc() {
    return sys.DateTime.nowUtc();
  }

  static nowTicks() {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.DateTime.nowTicks(), haystack.Number.ns()), haystack.Number.type$);
  }

  static occurred(ts,range) {
    if (sys.ObjUtil.is(ts, sys.DateTime.type$)) {
      (ts = sys.ObjUtil.coerce(ts, sys.DateTime.type$).date());
    }
    else {
      if (!sys.ObjUtil.is(ts, sys.Date.type$)) {
        throw CoreLib.argErr("occurred", ts);
      }
      ;
    }
    ;
    let date = sys.ObjUtil.coerce(ts, sys.Date.type$);
    return sys.ObjUtil.coerce(CoreLib.toDateSpan(range).contains(date), sys.Obj.type$.toNullable());
  }

  static start(val) {
    if (sys.ObjUtil.is(val, haystack.Span.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Span.type$).start();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.DateSpan.type$)) {
      return sys.ObjUtil.coerce(val, haystack.DateSpan.type$).start();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.ObjRange.type$)) {
      return sys.ObjUtil.coerce(val, haystack.ObjRange.type$).start();
    }
    ;
    throw CoreLib.argErr("start", val);
  }

  static end(val) {
    if (sys.ObjUtil.is(val, haystack.Span.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Span.type$).end();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.DateSpan.type$)) {
      return sys.ObjUtil.coerce(val, haystack.DateSpan.type$).end();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.ObjRange.type$)) {
      return sys.ObjUtil.coerce(val, haystack.ObjRange.type$).end();
    }
    ;
    throw CoreLib.argErr("end", val);
  }

  static thisWeek() {
    return haystack.DateSpan.thisWeek();
  }

  static thisMonth() {
    return haystack.DateSpan.thisMonth();
  }

  static thisQuarter() {
    return haystack.DateSpan.thisQuarter();
  }

  static thisYear() {
    return haystack.DateSpan.thisYear();
  }

  static pastWeek() {
    return haystack.DateSpan.pastWeek();
  }

  static pastMonth() {
    return haystack.DateSpan.pastMonth();
  }

  static pastYear() {
    return haystack.DateSpan.pastYear();
  }

  static lastWeek() {
    return haystack.DateSpan.lastWeek();
  }

  static lastMonth() {
    return haystack.DateSpan.lastMonth();
  }

  static lastQuarter() {
    return haystack.DateSpan.lastQuarter();
  }

  static lastYear() {
    return haystack.DateSpan.lastYear();
  }

  static firstOfMonth(date) {
    return date.firstOfMonth();
  }

  static lastOfMonth(date) {
    return date.lastOfMonth();
  }

  static toDateSpan(x) {
    if (x == null) {
      return AxonContext.curAxon().toDateSpanDef();
    }
    ;
    return haystack.Etc.toDateSpan(x);
  }

  static toSpan(x,tz) {
    if (tz === undefined) tz = null;
    if (x == null) {
      (x = AxonContext.curAxon().toDateSpanDef());
    }
    ;
    return haystack.Etc.toSpan(x, ((this$) => { if (tz != null) return sys.TimeZone.fromStr(sys.ObjUtil.coerce(tz, sys.Str.type$)); return null; })(this));
  }

  static toDateTimeSpan(a,b) {
    if (b === undefined) b = null;
    return CoreLib.toSpan(a, sys.ObjUtil.coerce(b, sys.Str.type$.toNullable()));
  }

  static numDays(span) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(CoreLib.toSpan(span).numDays(), haystack.Number.day()), haystack.Number.type$);
  }

  static eachDay(dates,fn) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let args = sys.List.make(sys.Obj.type$.toNullable(), [null]);
    CoreLib.toDateSpan(dates).eachDay((date) => {
      fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, date));
      return;
    });
    return null;
  }

  static eachMonth(dates,fn) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let args = sys.List.make(sys.Obj.type$.toNullable(), [null]);
    CoreLib.toDateSpan(dates).eachMonth((span) => {
      fn.call(sys.ObjUtil.coerce(cx, AxonContext.type$), args.set(0, span));
      return;
    });
    return null;
  }

  static year(d) {
    return haystack.Number.makeInt(sys.ObjUtil.coerce(sys.ObjUtil.trap(d,"year", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$), CoreLib.unitYear());
  }

  static month(d) {
    return haystack.Number.makeInt(sys.Int.plus(sys.ObjUtil.coerce(sys.ObjUtil.trap(d,"month", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Month.type$).ordinal(), 1), CoreLib.unitMo());
  }

  static day(d) {
    return haystack.Number.makeInt(sys.ObjUtil.coerce(sys.ObjUtil.trap(d,"day", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$), CoreLib.unitDay());
  }

  static hour(t) {
    return haystack.Number.makeInt(sys.ObjUtil.coerce(sys.ObjUtil.trap(t,"hour", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$), CoreLib.unitHour());
  }

  static minute(t) {
    return haystack.Number.makeInt(sys.ObjUtil.coerce(sys.ObjUtil.trap(t,"min", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$), CoreLib.unitMin());
  }

  static second(t) {
    return haystack.Number.makeInt(sys.ObjUtil.coerce(sys.ObjUtil.trap(t,"sec", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$), CoreLib.unitSec());
  }

  static weekday(t) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.ObjUtil.coerce(sys.ObjUtil.trap(t,"weekday", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Weekday.type$).ordinal(), CoreLib.unitDay()), haystack.Number.type$);
  }

  static isWeekend(t) {
    let w = CoreLib.weekday(t);
    return sys.ObjUtil.coerce((sys.ObjUtil.equals(w.toFloat(), sys.Float.make(0.0)) || sys.ObjUtil.equals(w.toFloat(), sys.Float.make(6.0))), sys.Obj.type$.toNullable());
  }

  static isWeekday(t) {
    let w = CoreLib.weekday(t);
    return sys.ObjUtil.coerce((sys.ObjUtil.compareNE(w.toFloat(), sys.Float.make(0.0)) && sys.ObjUtil.compareNE(w.toFloat(), sys.Float.make(6.0))), sys.Obj.type$.toNullable());
  }

  static tz(dt) {
    if (dt === undefined) dt = null;
    return ((this$) => { let $_u90 = ((this$) => { let $_u91 = dt; if ($_u91 == null) return null; return dt.tz(); })(this$); if ($_u90 != null) return $_u90; return sys.TimeZone.cur(); })(this).name();
  }

  static dateTime(d,t,tz) {
    if (tz === undefined) tz = null;
    return d.toDateTime(t, sys.ObjUtil.coerce(((this$) => { if (tz == null) return sys.TimeZone.cur(); return sys.TimeZone.fromStr(sys.ObjUtil.coerce(tz, sys.Str.type$)); })(this), sys.TimeZone.type$));
  }

  static date(val,month,day) {
    if (month === undefined) month = null;
    if (day === undefined) day = null;
    if (sys.ObjUtil.is(val, sys.DateTime.type$)) {
      return sys.ObjUtil.coerce(val, sys.DateTime.type$).date();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Number.type$)) {
      return sys.Date.make(sys.ObjUtil.coerce(val, haystack.Number.type$).toInt(), sys.Month.vals().get(sys.Int.minus(month.toInt(), 1)), day.toInt());
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Invalid val type: ", sys.ObjUtil.typeof(val)));
  }

  static time(val,minutes,secs) {
    if (minutes === undefined) minutes = null;
    if (secs === undefined) secs = haystack.Number.zero();
    if (sys.ObjUtil.is(val, sys.DateTime.type$)) {
      return sys.ObjUtil.coerce(val, sys.DateTime.type$).time();
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Number.type$)) {
      return sys.Time.make(sys.ObjUtil.coerce(val, haystack.Number.type$).toInt(), minutes.toInt(), secs.toInt());
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Invalid val type: ", sys.ObjUtil.typeof(val)));
  }

  static toTimeZone(val,tz) {
    if (sys.ObjUtil.is(val, sys.DateTime.type$)) {
      return sys.ObjUtil.coerce(val, sys.DateTime.type$).toTimeZone(sys.ObjUtil.coerce(sys.TimeZone.fromStr(tz), sys.TimeZone.type$));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Span.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Span.type$).toTimeZone(sys.ObjUtil.coerce(sys.TimeZone.fromStr(tz), sys.TimeZone.type$));
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Invalid val type: ", sys.ObjUtil.typeof(val)));
  }

  static numDaysInMonth(month) {
    if (month === undefined) month = null;
    let d = null;
    if (sys.ObjUtil.is(month, sys.Date.type$)) {
      (d = sys.ObjUtil.coerce(month, sys.Date.type$.toNullable()));
    }
    else {
      if (sys.ObjUtil.is(month, haystack.Number.type$)) {
        (d = sys.Date.make(sys.Date.today().year(), sys.Month.vals().get(sys.Int.minus(sys.ObjUtil.coerce(month, haystack.Number.type$).toInt(), 1)), 1));
      }
      else {
        if (month == null) {
          (d = sys.Date.today());
        }
        else {
          throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid month arg: ", month), " ["), sys.ObjUtil.typeof(month)), "]"));
        }
        ;
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(haystack.Number.makeInt(d.month().numDays(d.year()), haystack.Number.day()), haystack.Number.type$);
  }

  static isLeapYear(year) {
    return sys.DateTime.isLeapYear(year.toInt());
  }

  static dst(dt) {
    return dt.dst();
  }

  static hoursInDay(dt) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(dt.hoursInDay()), haystack.Number.type$);
  }

  static dayOfYear(val) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.ObjUtil.coerce(sys.ObjUtil.trap(val,"dayOfYear", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$), CoreLib.unitDay()), haystack.Number.type$);
  }

  static weekOfYear(val,startOfWeek) {
    if (startOfWeek === undefined) startOfWeek = null;
    let sow = ((this$) => { if (startOfWeek != null) return sys.Weekday.vals().get(startOfWeek.toInt()); return sys.Weekday.localeStartOfWeek(); })(this);
    return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.ObjUtil.coerce(sys.ObjUtil.trap(val,"weekOfYear", sys.List.make(sys.Obj.type$.toNullable(), [sow])), sys.Int.type$), CoreLib.unitWeek()), haystack.Number.type$);
  }

  static startOfWeek() {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(sys.Weekday.localeStartOfWeek().ordinal(), CoreLib.unitDay()), haystack.Number.type$);
  }

  static toJavaMillis(dt) {
    return sys.ObjUtil.coerce(haystack.Number.makeInt(dt.toJava(), haystack.Number.ms()), haystack.Number.type$);
  }

  static fromJavaMillis(millis,tz) {
    if (tz === undefined) tz = null;
    return sys.ObjUtil.coerce(sys.DateTime.fromJava(millis.toInt(), sys.ObjUtil.coerce(((this$) => { if (tz == null) return sys.TimeZone.cur(); return sys.TimeZone.fromStr(sys.ObjUtil.coerce(tz, sys.Str.type$)); })(this), sys.TimeZone.type$), false), sys.DateTime.type$);
  }

  static isMetric(val) {
    if (val === undefined) val = null;
    if (sys.ObjUtil.is(val, haystack.Number.type$)) {
      let unit = sys.ObjUtil.coerce(val, haystack.Number.type$).unit();
      if (unit != null) {
        let metric = CoreLib.isUnitMetric(sys.ObjUtil.coerce(unit, sys.Unit.type$));
        if (metric != null) {
          return sys.ObjUtil.coerce(metric, sys.Bool.type$);
        }
        ;
      }
      ;
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      let rec = sys.ObjUtil.coerce(val, haystack.Dict.type$);
      let geoCountry = rec.get("geoCountry");
      if (geoCountry != null) {
        return sys.ObjUtil.compareNE(geoCountry, "US");
      }
      ;
      let unit = rec.get("unit");
      if (unit != null) {
        let metric = CoreLib.isUnitMetric(sys.ObjUtil.coerce(sys.Unit.fromStr(sys.ObjUtil.coerce(unit, sys.Str.type$)), sys.Unit.type$));
        if (metric != null) {
          return sys.ObjUtil.coerce(metric, sys.Bool.type$);
        }
        ;
      }
      ;
    }
    ;
    return sys.ObjUtil.compareNE(sys.Locale.cur().country(), "US");
  }

  static isUnitMetric(unit) {
    if ((unit === haystack.Number.F() || unit === haystack.Number.Fdeg())) {
      return sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable());
    }
    ;
    if ((unit === haystack.Number.C() || unit === haystack.Number.Cdeg())) {
      return sys.ObjUtil.coerce(true, sys.Bool.type$.toNullable());
    }
    ;
    return null;
  }

  static unit(val) {
    return ((this$) => { let $_u95 = ((this$) => { let $_u96 = val; if ($_u96 == null) return null; return val.unit(); })(this$); if ($_u95 == null) return null; return ((this$) => { let $_u97 = val; if ($_u97 == null) return null; return val.unit(); })(this$).toStr(); })(this);
  }

  static unitsEq(a,b) {
    if ((a == null || b == null)) {
      return false;
    }
    ;
    return sys.ObjUtil.equals(a.unit(), b.unit());
  }

  static to(val,unit) {
    if (val == null) {
      return null;
    }
    ;
    if (unit == null) {
      return haystack.Number.make(val.toFloat());
    }
    ;
    let u = ((this$) => { if (sys.ObjUtil.is(unit, haystack.Number.type$)) return sys.ObjUtil.coerce(unit, haystack.Number.type$).unit(); return haystack.Number.loadUnit(sys.ObjUtil.coerce(unit, sys.Str.type$)); })(this);
    if (val.unit() === u) {
      return val;
    }
    ;
    if (val.unit() == null) {
      return haystack.Number.make(val.toFloat(), u);
    }
    ;
    if (u == null) {
      return haystack.Number.make(val.toFloat());
    }
    ;
    return haystack.Number.make(val.unit().convertTo(val.toFloat(), sys.ObjUtil.coerce(u, sys.Unit.type$)), u);
  }

  static _as(val,unit) {
    if (val == null) {
      return null;
    }
    ;
    if (unit == null) {
      return val;
    }
    ;
    let u = ((this$) => { if (sys.ObjUtil.is(unit, haystack.Number.type$)) return sys.ObjUtil.coerce(unit, haystack.Number.type$).unit(); return haystack.Number.loadUnit(sys.ObjUtil.coerce(unit, sys.Str.type$)); })(this);
    if (val.unit() === u) {
      return val;
    }
    ;
    return haystack.Number.make(val.toFloat(), u);
  }

  static def(symbol,checked) {
    if (checked === undefined) checked = true;
    return ((this$) => { let $_u100 = sys.ObjUtil.as(symbol, haystack.Def.type$); if ($_u100 != null) return $_u100; return AxonContext.curAxon().ns().def(sys.ObjUtil.toStr(symbol), checked); })(this);
  }

  static defs() {
    return AxonContext.curAxon().ns().defs().sort();
  }

  static tags() {
    const this$ = this;
    let defs = AxonContext.curAxon().ns().findDefs((d) => {
      return d.symbol().type().isTag();
    });
    return defs.sort();
  }

  static terms() {
    const this$ = this;
    let defs = AxonContext.curAxon().ns().findDefs((d) => {
      return d.symbol().type().isTerm();
    });
    return defs.sort();
  }

  static conjuncts() {
    const this$ = this;
    let defs = AxonContext.curAxon().ns().findDefs((d) => {
      return d.symbol().type().isConjunct();
    });
    return defs.sort();
  }

  static libs() {
    return AxonContext.curAxon().ns().feature("lib").defs().sort();
  }

  static supertypes(d) {
    return AxonContext.curAxon().ns().supertypes(sys.ObjUtil.coerce(CoreLib.def(d), haystack.Def.type$));
  }

  static subtypes(d) {
    return AxonContext.curAxon().ns().subtypes(sys.ObjUtil.coerce(CoreLib.def(d), haystack.Def.type$));
  }

  static hasSubtypes(d) {
    return AxonContext.curAxon().ns().hasSubtypes(sys.ObjUtil.coerce(CoreLib.def(d), haystack.Def.type$));
  }

  static inheritance(d) {
    return AxonContext.curAxon().ns().inheritance(sys.ObjUtil.coerce(CoreLib.def(d), haystack.Def.type$));
  }

  static associations(parent,association) {
    return AxonContext.curAxon().ns().associations(sys.ObjUtil.coerce(CoreLib.def(parent), haystack.Def.type$), sys.ObjUtil.coerce(CoreLib.def(association), haystack.Def.type$));
  }

  static implement(d) {
    return AxonContext.curAxon().ns().implement(sys.ObjUtil.coerce(CoreLib.def(d), haystack.Def.type$));
  }

  static reflect(dict) {
    return AxonContext.curAxon().ns().reflect(dict).defs();
  }

  proto(parent,proto) {
    return AxonContext.curAxon().ns().proto(parent, proto);
  }

  static protos(parent) {
    return AxonContext.curAxon().ns().protos(parent);
  }

  static nsTimestamp() {
    return AxonContext.curAxon().ns().ts();
  }

  static params(fn) {
    return CoreLibUtil.params(sys.ObjUtil.coerce(AxonContext.curAxon(), AxonContext.type$), fn);
  }

  static func(name,checked) {
    if (checked === undefined) checked = true;
    return CoreLibUtil.func(sys.ObjUtil.coerce(AxonContext.curAxon(), AxonContext.type$), name, checked);
  }

  static funcs(filterExpr) {
    if (filterExpr === undefined) filterExpr = Literal.nullVal();
    return CoreLibUtil.funcs(sys.ObjUtil.coerce(AxonContext.curAxon(), AxonContext.type$), filterExpr);
  }

  static compDef(name,checked) {
    if (checked === undefined) checked = true;
    return CoreLibUtil.compDef(sys.ObjUtil.coerce(AxonContext.curAxon(), AxonContext.type$), name, checked);
  }

  static curFunc() {
    return CoreLibUtil.curFunc(sys.ObjUtil.coerce(AxonContext.curAxon(), AxonContext.type$));
  }

  static debugType(val) {
    if (val == null) {
      return "null";
    }
    ;
    return sys.ObjUtil.typeof(val).qname();
  }

  static isNull(val) {
    return val == null;
  }

  static isNonNull(val) {
    return val != null;
  }

  static isList(val) {
    return sys.ObjUtil.is(val, sys.Type.find("sys::List"));
  }

  static isDict(val) {
    return sys.ObjUtil.is(val, haystack.Dict.type$);
  }

  static isGrid(val) {
    return sys.ObjUtil.is(val, haystack.Grid.type$);
  }

  static isHisGrid(val) {
    return (sys.ObjUtil.is(val, haystack.Grid.type$) && sys.ObjUtil.coerce(val, haystack.Grid.type$).isHisGrid());
  }

  static isBool(val) {
    return sys.ObjUtil.is(val, sys.Bool.type$);
  }

  static isNumber(val) {
    return sys.ObjUtil.is(val, haystack.Number.type$);
  }

  static isDuration(val) {
    return (sys.ObjUtil.is(val, haystack.Number.type$) && sys.ObjUtil.coerce(val, haystack.Number.type$).isDuration());
  }

  static isRef(val) {
    return sys.ObjUtil.is(val, haystack.Ref.type$);
  }

  static isStr(val) {
    return sys.ObjUtil.is(val, sys.Str.type$);
  }

  static isUri(val) {
    return sys.ObjUtil.is(val, sys.Uri.type$);
  }

  static isDate(val) {
    return sys.ObjUtil.is(val, sys.Date.type$);
  }

  static isTime(val) {
    return sys.ObjUtil.is(val, sys.Time.type$);
  }

  static isDateTime(val) {
    return sys.ObjUtil.is(val, sys.DateTime.type$);
  }

  static isFunc(val) {
    return sys.ObjUtil.is(val, Fn.type$);
  }

  static isSpan(val) {
    return sys.ObjUtil.is(val, haystack.Span.type$);
  }

  static isKeyword(val) {
    return Token.isKeyword(val);
  }

  static toHex(val) {
    return sys.Int.toHex(val.toInt());
  }

  static toRadix(val,radix,width) {
    if (width === undefined) width = null;
    return sys.Int.toRadix(val.toInt(), radix.toInt(), ((this$) => { let $_u101 = width; if ($_u101 == null) return null; return width.toInt(); })(this));
  }

  static _toStr(val) {
    return ((this$) => { if (val == null) return "null"; return sys.ObjUtil.toStr(val); })(this);
  }

  static toList(val) {
    return sys.ObjUtil.coerce(((this$) => { let $_u103 = sys.ObjUtil.as(val, sys.Type.find("sys::List")); if ($_u103 != null) return $_u103; return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.List.make(sys.Obj.type$.toNullable(), [val])), sys.Type.find("sys::Obj?[]")); })(this), sys.Type.find("sys::Obj?[]"));
  }

  static toGrid(val,meta) {
    if (meta === undefined) meta = null;
    return haystack.Etc.toGrid(val, meta);
  }

  static colsToLocale(grid) {
    return grid.colsToLocale();
  }

  static toLocale(key) {
    let colons = sys.Str.index(key, "::");
    if (colons == null) {
      return haystack.Etc.tagToLocale(key);
    }
    ;
    let pod = sys.Pod.find(sys.Str.getRange(key, sys.Range.make(0, sys.ObjUtil.coerce(colons, sys.Int.type$), true)));
    let name = sys.Str.getRange(key, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colons, sys.Int.type$), 2), -1));
    return sys.ObjUtil.coerce(sys.Env.cur().locale(sys.ObjUtil.coerce(pod, sys.Pod.type$), name), sys.Str.type$);
  }

  static localeUse(locale,expr) {
    const this$ = this;
    let cx = AxonContext.curAxon();
    let result = null;
    sys.Locale.fromStr(sys.ObjUtil.coerce(locale.eval(sys.ObjUtil.coerce(cx, AxonContext.type$)), sys.Str.type$)).use((it) => {
      (result = expr.eval(sys.ObjUtil.coerce(cx, AxonContext.type$)));
      return;
    });
    return result;
  }

  static dis(dict,name,def) {
    if (name === undefined) name = null;
    if (def === undefined) def = "";
    if (dict == null) {
      return "null";
    }
    ;
    return sys.ObjUtil.coerce(dict.dis(name, def), sys.Str.type$);
  }

  static relDis(parent,child) {
    if (sys.ObjUtil.is(parent, haystack.Dict.type$)) {
      (parent = sys.ObjUtil.coerce(sys.ObjUtil.coerce(parent, haystack.Dict.type$).dis(), sys.Obj.type$));
    }
    ;
    if (sys.ObjUtil.is(child, haystack.Dict.type$)) {
      (child = sys.ObjUtil.coerce(sys.ObjUtil.coerce(child, haystack.Dict.type$).dis(), sys.Obj.type$));
    }
    ;
    return haystack.Etc.relDis(sys.ObjUtil.coerce(parent, sys.Str.type$), sys.ObjUtil.coerce(child, sys.Str.type$));
  }

  static format(val,pattern) {
    if (pattern === undefined) pattern = null;
    if (val == null) {
      return "null";
    }
    ;
    let m = sys.ObjUtil.typeof(val).method("toLocale", false);
    if (m == null) {
      return sys.ObjUtil.toStr(val);
    }
    ;
    return sys.ObjUtil.coerce(m.callOn(val, sys.List.make(sys.Str.type$.toNullable(), [pattern])), sys.Str.type$);
  }

  static parseBool(val,checked) {
    if (checked === undefined) checked = true;
    return sys.Bool.fromStr(val, checked);
  }

  static parseInt(val,radix,checked) {
    if (radix === undefined) radix = haystack.Number.ten();
    if (checked === undefined) checked = true;
    let i = sys.Int.fromStr(val, radix.toInt(), checked);
    if (i == null) {
      return null;
    }
    ;
    return haystack.Number.make(sys.Num.toFloat(sys.ObjUtil.coerce(i, sys.Num.type$)));
  }

  static parseFloat(val,checked) {
    if (checked === undefined) checked = true;
    let f = sys.Float.fromStr(val, checked);
    if (f == null) {
      return null;
    }
    ;
    return haystack.Number.make(sys.ObjUtil.coerce(f, sys.Float.type$));
  }

  static parseNumber(val,checked) {
    if (checked === undefined) checked = true;
    let ch = ((this$) => { if (sys.Str.isEmpty(val)) return 0; return sys.Str.get(val, 0); })(this);
    if ((sys.Int.isDigit(ch) || sys.ObjUtil.equals(ch, 45) || sys.ObjUtil.equals(ch, 78) || sys.ObjUtil.equals(ch, 73))) {
      try {
        return sys.ObjUtil.coerce(haystack.ZincReader.make(sys.Str.in(val)).readVal(), haystack.Number.type$);
      }
      catch ($_u105) {
        $_u105 = sys.Err.make($_u105);
        if ($_u105 instanceof sys.Err) {
          let e = $_u105;
          ;
        }
        else {
          throw $_u105;
        }
      }
      ;
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid number: ", val));
    }
    ;
    return null;
  }

  static parseUri(val,checked) {
    if (checked === undefined) checked = true;
    return sys.Uri.fromStr(val, checked);
  }

  static parseDate(val,pattern,checked) {
    if (pattern === undefined) pattern = "YYYY-MM-DD";
    if (checked === undefined) checked = true;
    return sys.Date.fromLocale(val, pattern, checked);
  }

  static parseTime(val,pattern,checked) {
    if (pattern === undefined) pattern = "hh:mm:SS";
    if (checked === undefined) checked = true;
    return sys.Time.fromLocale(val, pattern, checked);
  }

  static parseDateTime(val,pattern,tz,checked) {
    if (pattern === undefined) pattern = "YYYY-MM-DD'T'hh:mm:SS.FFFFFFFFFz zzzz";
    if (tz === undefined) tz = sys.TimeZone.cur().name();
    if (checked === undefined) checked = true;
    return sys.DateTime.fromLocale(val, pattern, sys.ObjUtil.coerce(sys.TimeZone.fromStr(tz), sys.TimeZone.type$), checked);
  }

  static parseRef(val,dis,checked) {
    if (dis === undefined) dis = null;
    if (checked === undefined) checked = true;
    if (sys.ObjUtil.is(dis, sys.Bool.type$)) {
      return haystack.Ref.fromStr(val, sys.ObjUtil.coerce(dis, sys.Bool.type$));
    }
    ;
    try {
      if (sys.ObjUtil.equals(sys.Str.get(val, 0), 64)) {
        (val = sys.Str.getRange(val, sys.Range.make(1, -1)));
      }
      ;
      return haystack.Ref.make(val, sys.ObjUtil.coerce(dis, sys.Str.type$.toNullable()));
    }
    catch ($_u106) {
      $_u106 = sys.Err.make($_u106);
      if ($_u106 instanceof sys.Err) {
        let e = $_u106;
        ;
        if (checked) {
          throw e;
        }
        ;
        return null;
      }
      else {
        throw $_u106;
      }
    }
    ;
  }

  static parseSymbol(val,checked) {
    if (checked === undefined) checked = true;
    return haystack.Symbol.fromStr(val, checked);
  }

  static parseFilter(val,checked) {
    if (checked === undefined) checked = true;
    return haystack.Filter.fromStr(val, checked);
  }

  static parseSearch(val) {
    return haystack.Filter.search(val);
  }

  static filterToFunc(filterExpr) {
    let cx = AxonContext.curAxon();
    let filter = filterExpr.evalToFilter(sys.ObjUtil.coerce(cx, AxonContext.type$));
    return FilterFn.make(sys.ObjUtil.coerce(filter, haystack.Filter.type$));
  }

  static parseUnit(val,checked) {
    if (checked === undefined) checked = true;
    return ((this$) => { let $_u107 = sys.Unit.fromStr(val, checked); if ($_u107 == null) return null; return sys.Unit.fromStr(val, checked).symbol(); })(this);
  }

  static xstr(type,val) {
    return haystack.XStr.decode(type, val);
  }

  static upper(val) {
    return sys.ObjUtil.trap(val,"upper", sys.List.make(sys.Obj.type$.toNullable(), []));
  }

  static lower(val) {
    return sys.ObjUtil.trap(val,"lower", sys.List.make(sys.Obj.type$.toNullable(), []));
  }

  static isSpace(num) {
    return sys.Int.isSpace(num.toInt());
  }

  static isAlpha(num) {
    return sys.Int.isAlpha(num.toInt());
  }

  static isAlphaNum(num) {
    return sys.Int.isAlphaNum(num.toInt());
  }

  static isUpper(num) {
    return sys.Int.isUpper(num.toInt());
  }

  static isLower(num) {
    return sys.Int.isLower(num.toInt());
  }

  static isDigit(num,radix) {
    if (radix === undefined) radix = haystack.Number.ten();
    return sys.Int.isDigit(num.toInt(), radix.toInt());
  }

  static toChar(num) {
    return sys.Int.toChar(num.toInt());
  }

  static split(val,sep,opts) {
    if (sep === undefined) sep = null;
    if (opts === undefined) opts = null;
    if (sep == null) {
      return sys.Str.split(val);
    }
    ;
    if (sys.ObjUtil.compareNE(sys.Str.size(sep), 1)) {
      throw sys.ArgErr.make(sys.Str.plus("Split string must be one char: ", sys.Str.toCode(sep)));
    }
    ;
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    let trim = opts.missing("noTrim");
    return sys.Str.split(val, sys.ObjUtil.coerce(sys.Str.get(sep, 0), sys.Int.type$.toNullable()), trim);
  }

  static capitalize(val) {
    return sys.Str.capitalize(val);
  }

  static decapitalize(val) {
    return sys.Str.decapitalize(val);
  }

  static trim(val) {
    return sys.Str.trim(val);
  }

  static trimStart(val) {
    return sys.Str.trimStart(val);
  }

  static trimEnd(val) {
    return sys.Str.trimEnd(val);
  }

  static startsWith(val,sub) {
    return sys.Str.startsWith(val, sub);
  }

  static endsWith(val,sub) {
    return sys.Str.endsWith(val, sub);
  }

  static replace(val,from$,to) {
    return sys.Str.replace(val, from$, to);
  }

  static padl(val,width,char) {
    if (char === undefined) char = " ";
    return sys.Str.padl(val, width.toInt(), sys.Str.get(char, 0));
  }

  static padr(val,width,char) {
    if (char === undefined) char = " ";
    return sys.Str.padr(val, width.toInt(), sys.Str.get(char, 0));
  }

  static concat(list,sep) {
    if (sep === undefined) sep = "";
    return list.join(sep);
  }

  static reMatches(regex,s) {
    return AxonContext.curAxon().toRegex(regex).matches(s);
  }

  static reFind(regex,s) {
    let m = AxonContext.curAxon().toRegex(regex).matcher(s);
    if (!m.find()) {
      return null;
    }
    ;
    return m.group();
  }

  static reFindAll(regex,s) {
    let m = AxonContext.curAxon().toRegex(regex).matcher(s);
    let acc = sys.List.make(sys.Str.type$);
    while (m.find()) {
      acc.add(sys.ObjUtil.coerce(m.group(), sys.Str.type$));
    }
    ;
    return acc;
  }

  static reGroups(regex,s) {
    let m = AxonContext.curAxon().toRegex(regex).matcher(s);
    if (!m.find()) {
      return null;
    }
    ;
    let groups = sys.List.make(sys.Obj.type$.toNullable());
    for (let i = 0; sys.ObjUtil.compareLE(i, m.groupCount()); i = sys.Int.increment(i)) {
      groups.add(m.group(i));
    }
    ;
    return groups;
  }

  static uriScheme(val) {
    return val.scheme();
  }

  static uriHost(val) {
    return val.host();
  }

  static uriPort(val) {
    return ((this$) => { if (val.port() == null) return null; return haystack.Number.make(sys.Num.toFloat(sys.ObjUtil.coerce(val.port(), sys.Num.type$))); })(this);
  }

  static uriName(val) {
    return val.name();
  }

  static uriPath(val) {
    return val.path();
  }

  static uriPathStr(val) {
    return val.pathStr();
  }

  static uriBasename(val) {
    return val.basename();
  }

  static uriExt(val) {
    return val.ext();
  }

  static uriIsDir(val) {
    return val.isDir();
  }

  static uriFrag(val) {
    return val.frag();
  }

  static uriQueryStr(val) {
    return val.queryStr();
  }

  static uriPlusSlash(val) {
    return val.plusSlash();
  }

  static uriEncode(val) {
    return val.encode();
  }

  static uriDecode(val,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(sys.Uri.decode(val, checked), sys.Uri.type$);
  }

  static refGen() {
    return haystack.Ref.gen();
  }

  static refDis(ref) {
    return ref.dis();
  }

  static refProjName(ref,checked) {
    if (checked === undefined) checked = true;
    if (ref.isProjRec()) {
      return ref.segs().get(0).body();
    }
    ;
    if (checked) {
      throw sys.ArgErr.make(sys.Str.plus("Ref is not project record: ", ref.toCode()));
    }
    ;
    return null;
  }

  static coord(lat,lng) {
    return haystack.Coord.make(lat.toFloat(), lng.toFloat());
  }

  static coordLat(coord) {
    return haystack.Number.make(coord.lat());
  }

  static coordLng(coord) {
    return haystack.Number.make(coord.lng());
  }

  static coordDist(c1,c2) {
    return haystack.Number.make(c1.dist(c2), sys.Unit.fromStr("m"));
  }

  static noop() {
    return "noop";
  }

  static _echo(x) {
    let s = ((this$) => { let $_u109 = ((this$) => { let $_u110 = x; if ($_u110 == null) return null; return sys.ObjUtil.toStr(x); })(this$); if ($_u109 != null) return $_u109; return "null"; })(this);
    sys.ObjUtil.echo(s);
    return s;
  }

  static dump(x) {
    let m = ((this$) => { let $_u111 = ((this$) => { let $_u112 = x; if ($_u112 == null) return null; return sys.ObjUtil.typeof(x); })(this$); if ($_u111 == null) return null; return ((this$) => { let $_u113 = x; if ($_u113 == null) return null; return sys.ObjUtil.typeof(x); })(this$).method("dump", false); })(this);
    if (m != null) {
      m.call(x);
    }
    else {
      sys.ObjUtil.echo(x);
    }
    ;
    return x;
  }

  static eval(expr) {
    return AxonContext.curAxon().eval(expr);
  }

  static evalToFunc(expr) {
    return AxonContext.curAxon().evalToFunc(expr);
  }

  static evalOrReadAll(expr) {
    return AxonContext.curAxon().evalOrReadAll(expr);
  }

  static call(func,args) {
    if (args === undefined) args = null;
    let cx = AxonContext.curAxon();
    let fn = ((this$) => { if (sys.ObjUtil.is(func, sys.Str.type$)) return cx.findTop(sys.ObjUtil.coerce(func, sys.Str.type$)); return sys.ObjUtil.coerce(func, Fn.type$); })(this);
    if (args == null) {
      (args = sys.Obj.type$.emptyList());
    }
    ;
    return fn.callx(sys.ObjUtil.coerce(cx, AxonContext.type$), sys.ObjUtil.coerce(args, sys.Type.find("sys::Obj?[]")), Loc.make("call"));
  }

  static toAxonCode(val) {
    return haystack.Etc.toAxon(val);
  }

  static parseAst(src) {
    return AxonContext.curAxon().parse(src).encode();
  }

  static trace(opts) {
    if (opts === undefined) opts = null;
    let cx = AxonContext.curAxon();
    let str = cx.traceToStr(sys.ObjUtil.coerce(((this$) => { let $_u115 = ((this$) => { let $_u116=cx.curFunc(); return ($_u116==null) ? null : $_u116.loc(); })(this$); if ($_u115 != null) return $_u115; return Loc.unknown(); })(this), Loc.type$), opts);
    sys.ObjUtil.echo(str);
    return str;
  }

  static traceToGrid(opts) {
    if (opts === undefined) opts = null;
    let cx = AxonContext.curAxon();
    return cx.traceToGrid(sys.ObjUtil.coerce(((this$) => { let $_u117 = ((this$) => { let $_u118=cx.curFunc(); return ($_u118==null) ? null : $_u118.loc(); })(this$); if ($_u117 != null) return $_u117; return Loc.unknown(); })(this), Loc.type$), opts);
  }

  static checkSyntax(src) {
    try {
      Parser.make(Loc.make("checkSyntax"), sys.Str.in(src)).parseTop("checkSyntax");
      return haystack.Etc.makeEmptyGrid();
    }
    catch ($_u119) {
      $_u119 = sys.Err.make($_u119);
      if ($_u119 instanceof SyntaxErr) {
        let e = $_u119;
        ;
        let meta = sys.Map.__fromLiteral(["err","dis"], [haystack.Marker.val(),"Syntax errors"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
        let row = sys.Map.__fromLiteral(["line","dis"], [haystack.Number.makeInt(e.loc().line()),e.msg()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
        return haystack.Etc.makeMapGrid(meta, row);
      }
      else if ($_u119 instanceof sys.Err) {
        let e = $_u119;
        ;
        e.trace();
        let meta = sys.Map.__fromLiteral(["err","dis"], [haystack.Marker.val(),"Parser failed"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
        let row = sys.Map.__fromLiteral(["line","dis"], [haystack.Number.makeInt(1),sys.Str.plus("Parser failed: ", e.msg())], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
        return haystack.Etc.makeMapGrid(meta, row);
      }
      else {
        throw $_u119;
      }
    }
    ;
  }

  static argErr(name,val) {
    let t = ((this$) => { if (val == null) return "null"; return sys.ObjUtil.typeof(val).qname(); })(this);
    return sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid arg '", t), "' to 'core::"), name), "'"));
  }

  static make() {
    const $self = new CoreLib();
    CoreLib.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    CoreLib.#foldStartVal = "__foldStart__";
    CoreLib.#foldEndVal = "__foldEnd__";
    CoreLib.#unitYear = sys.ObjUtil.coerce(sys.Unit.fromStr("year"), sys.Unit.type$);
    CoreLib.#unitMo = sys.ObjUtil.coerce(sys.Unit.fromStr("mo"), sys.Unit.type$);
    CoreLib.#unitWeek = sys.ObjUtil.coerce(sys.Unit.fromStr("week"), sys.Unit.type$);
    CoreLib.#unitDay = sys.ObjUtil.coerce(sys.Unit.fromStr("day"), sys.Unit.type$);
    CoreLib.#unitHour = sys.ObjUtil.coerce(sys.Unit.fromStr("h"), sys.Unit.type$);
    CoreLib.#unitMin = sys.ObjUtil.coerce(sys.Unit.fromStr("min"), sys.Unit.type$);
    CoreLib.#unitSec = sys.ObjUtil.coerce(sys.Unit.fromStr("s"), sys.Unit.type$);
    return;
  }

}

class FantomFn extends TopFn {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FantomFn.type$; }

  #method = null;

  method() { return this.#method; }

  __method(it) { if (it === undefined) return this.#method; else this.#method = it; }

  #instanceRef = null;

  instanceRef() { return this.#instanceRef; }

  __instanceRef(it) { if (it === undefined) return this.#instanceRef; else this.#instanceRef = it; }

  static reflectType(type) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("axon::FantomFn"));
    type.methods().each((m) => {
      if (!m.isPublic()) {
        return;
      }
      ;
      if (m.parent() !== type) {
        return;
      }
      ;
      let facet = m.facet(Axon.type$, false);
      if (facet == null) {
        return;
      }
      ;
      let name = FantomFn.toName(m);
      let meta = haystack.Etc.emptyDict();
      let fn = FantomFn.reflectMethod(m, name, meta, null);
      acc.set(fn.name(), fn);
      return;
    });
    return acc;
  }

  static reflectFuncFromType(type,name,meta,instanceRef) {
    let m = type.method(sys.Str.plus("_", name), false);
    if (m == null) {
      (m = type.method(name, false));
    }
    ;
    if (m == null) {
      return null;
    }
    ;
    return FantomFn.reflectMethod(sys.ObjUtil.coerce(m, sys.Method.type$), name, meta, instanceRef);
  }

  static reflectMethod(m,name,meta,instanceRef) {
    const this$ = this;
    let lazy = false;
    let params = m.params().map((p) => {
      if (!haystack.Etc.isTagName(p.name())) {
        throw sys.Err.make(sys.Str.plus("Invalid func param name: ", p));
      }
      ;
      if (p.type() === Expr.type$) {
        (lazy = true);
      }
      ;
      if (p.type().fits(sys.Type.find("sys::Func"))) {
        sys.ObjUtil.echo(sys.Str.plus("WARNING AXON FUNC ARG: ", m));
      }
      ;
      return FnParam.makeFan(p);
    }, FnParam.type$);
    if (lazy) {
      return LazyFantomFn.make(name, meta, sys.ObjUtil.coerce(params, sys.Type.find("axon::FnParam[]")), m, instanceRef);
    }
    else {
      return FantomFn.make(name, meta, sys.ObjUtil.coerce(params, sys.Type.find("axon::FnParam[]")), m, instanceRef);
    }
    ;
  }

  static toName(m) {
    let name = m.name();
    if (sys.ObjUtil.equals(sys.Str.get(name, 0), 95)) {
      (name = sys.Str.getRange(name, sys.Range.make(1, -1)));
    }
    ;
    return name;
  }

  static make(name,meta,params,method,instanceRef) {
    const $self = new FantomFn();
    FantomFn.make$($self,name,meta,params,method,instanceRef);
    return $self;
  }

  static make$($self,name,meta,params,method,instanceRef) {
    TopFn.make$($self, Loc.make(name), name, meta, params, Literal.nullVal());
    $self.#method = method;
    $self.#instanceRef = instanceRef;
    return;
  }

  isNative() {
    return true;
  }

  callx(cx,args,callLoc) {
    let oldCx = concurrent.Actor.locals().get(haystack.Etc.cxActorLocalsKey());
    concurrent.Actor.locals().set(haystack.Etc.cxActorLocalsKey(), cx);
    cx.checkCall(this);
    try {
      return cx.callInNewFrame(this, args, callLoc);
    }
    catch ($_u121) {
      $_u121 = sys.Err.make($_u121);
      if ($_u121 instanceof EvalErr) {
        let e = $_u121;
        ;
        throw e;
      }
      else if ($_u121 instanceof sys.Err) {
        let e = $_u121;
        ;
        throw EvalErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Func failed: ", this.sig()), "; args: "), this.argsToStr(args)), "\n  "), e), cx, callLoc, e);
      }
      else {
        throw $_u121;
      }
    }
    finally {
      concurrent.Actor.locals().set(haystack.Etc.cxActorLocalsKey(), oldCx);
    }
    ;
  }

  doCall(cx,args) {
    if (this.#method.isStatic()) {
      return this.#method.callList(args);
    }
    else {
      return this.#method.callOn(this.#instanceRef.val(), args);
    }
    ;
  }

  evalParamDef(cx,param) {
    const this$ = this;
    let p = ((this$) => { let $_u122 = this$.#method.params().find((x) => {
      return sys.ObjUtil.equals(x.name(), param.name());
    }); if ($_u122 != null) return $_u122; throw sys.Err.make(sys.Str.plus("Invalid param: ", param.name())); })(this);
    return this.#method.paramDef(sys.ObjUtil.coerce(p, sys.Param.type$), null);
  }

  sig() {
    const this$ = this;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(this.name(), "("), this.#method.params().join(",", (p) => {
      return sys.Str.plus(sys.Str.plus(sys.Str.plus("", p.type().name()), " "), p.name());
    })), ")");
  }

  argsToStr(args) {
    const this$ = this;
    return sys.Str.plus(sys.Str.plus("(", args.join(",", (arg) => {
      return ((this$) => { if (arg == null) return "null"; return sys.ObjUtil.typeof(arg).name(); })(this$);
    })), ")");
  }

}

class LazyFantomFn extends FantomFn {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LazyFantomFn.type$; }

  static make(n,d,p,m,i) {
    const $self = new LazyFantomFn();
    LazyFantomFn.make$($self,n,d,p,m,i);
    return $self;
  }

  static make$($self,n,d,p,m,i) {
    FantomFn.make$($self, n, d, p, m, sys.ObjUtil.coerce(i, concurrent.AtomicRef.type$.toNullable()));
    return;
  }

  isLazy() {
    return true;
  }

  callLazy(cx,args,callLoc) {
    return FantomFn.prototype.callx.call(this, cx, args, callLoc);
  }

}

class FantomClosureFn extends Fn {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FantomClosureFn.type$; }

  #f = null;

  f() { return this.#f; }

  __f(it) { if (it === undefined) return this.#f; else this.#f = it; }

  static make(f) {
    const $self = new FantomClosureFn();
    FantomClosureFn.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    Fn.make$($self, Loc.make("Fantom Func"), "fan", FnParam.makeFanList(f));
    $self.#f = sys.Unsafe.make(f);
    return;
  }

  isNative() {
    return true;
  }

  callx(cx,args,callLoc) {
    return sys.Func.callList(sys.ObjUtil.coerce(this.#f.val(), sys.Type.find("sys::Func")), args);
  }

}

class FilterFn extends Fn {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterFn.type$; }

  #filter = null;

  filter() { return this.#filter; }

  __filter(it) { if (it === undefined) return this.#filter; else this.#filter = it; }

  static make(filter) {
    const $self = new FilterFn();
    FilterFn.make$($self,filter);
    return $self;
  }

  static make$($self,filter) {
    Fn.make$($self, Loc.unknown(), "filterToFunc", sys.List.make(FnParam.type$, [FnParam.make("dict")]));
    $self.#filter = filter;
    return;
  }

  callx(cx,args,callLoc) {
    let dict = sys.ObjUtil.as(args.first(), haystack.Dict.type$);
    if (dict == null) {
      throw this.err(sys.Str.plus(sys.Str.plus("Invalid arg, expected (Dict) not (", ((this$) => { let $_u124 = args.first(); if ($_u124 == null) return null; return sys.ObjUtil.typeof(args.first()); })(this)), ")"), cx);
    }
    ;
    return sys.ObjUtil.coerce(this.#filter.matches(sys.ObjUtil.coerce(dict, haystack.Dict.type$), cx), sys.Obj.type$.toNullable());
  }

}

class Tokenizer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#line = 1;
    this.#col = -2;
    this.#filePos = -2;
    return;
  }

  typeof() { return Tokenizer.type$; }

  #startLoc = Loc.eval();

  startLoc(it) {
    if (it === undefined) {
      return this.#startLoc;
    }
    else {
      this.#startLoc = it;
      return;
    }
  }

  #tok = null;

  tok(it) {
    if (it === undefined) {
      return this.#tok;
    }
    else {
      this.#tok = it;
      return;
    }
  }

  #val = null;

  val(it) {
    if (it === undefined) {
      return this.#val;
    }
    else {
      this.#val = it;
      return;
    }
  }

  #valStartLoc = Loc.eval();

  valStartLoc(it) {
    if (it === undefined) {
      return this.#valStartLoc;
    }
    else {
      this.#valStartLoc = it;
      return;
    }
  }

  #valEndLoc = Loc.eval();

  valEndLoc(it) {
    if (it === undefined) {
      return this.#valEndLoc;
    }
    else {
      this.#valEndLoc = it;
      return;
    }
  }

  #line = 0;

  line(it) {
    if (it === undefined) {
      return this.#line;
    }
    else {
      this.#line = it;
      return;
    }
  }

  #col = 0;

  col(it) {
    if (it === undefined) {
      return this.#col;
    }
    else {
      this.#col = it;
      return;
    }
  }


  #filePos = 0;

  filePos(it) {
    if (it === undefined) {
      return this.#filePos;
    }
    else {
      this.#filePos = it;
      return;
    }
  }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  #cur = 0;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #peek = 0;

  // private field reflection only
  __peek(it) { if (it === undefined) return this.#peek; else this.#peek = it; }

  static make(startLoc,in$) {
    const $self = new Tokenizer();
    Tokenizer.make$($self,startLoc,in$);
    return $self;
  }

  static make$($self,startLoc,in$) {
    ;
    $self.#startLoc = startLoc;
    $self.#in = in$;
    $self.#tok = Token.eof();
    $self.consume();
    $self.consume();
    return;
  }

  next() {
    this.#val = null;
    let startLine = this.#line;
    while (true) {
      if (sys.ObjUtil.equals(this.#cur, 10)) {
        this.#line = sys.Int.increment(this.#line);
        this.consume();
        while (sys.ObjUtil.equals(this.#cur, 32)) {
          this.consume();
        }
        ;
        continue;
      }
      ;
      if ((sys.ObjUtil.equals(this.#cur, 32) || sys.ObjUtil.equals(this.#cur, 9) || sys.ObjUtil.equals(this.#cur, 160))) {
        this.consume();
        continue;
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 13)) {
        throw this.err("Carriage return characters disallowed");
      }
      ;
      break;
    }
    ;
    this.#valStartLoc = this.curLoc();
    let isWord = false
    let nextTok = () => {
      if (sys.ObjUtil.equals(this.#cur, 47)) {
        if (sys.ObjUtil.equals(this.#peek, 47)) {
          this.#tok = this.commentSL();
          return this.#tok
        }
        ;
        if (sys.ObjUtil.equals(this.#peek, 42)) {
          this.#tok = this.commentML();
          return this.#tok
        }
        ;
      }
      ;
      if ((sys.ObjUtil.equals(this.#cur, 114) && sys.ObjUtil.equals(this.#peek, 34))) {
        return ((this$) => { let $_u125 = this$.rawStr(); this$.#tok = $_u125; return $_u125; })(this);
      }
      ;
      if (sys.Int.isAlpha(this.#cur)) {
        isWord = true
        return ((this$) => { let $_u126 = this$.word(); this$.#tok = $_u126; return $_u126; })(this);
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 34)) {
        return ((this$) => { let $_u127 = this$.str(); this$.#tok = $_u127; return $_u127; })(this);
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 64)) {
        return ((this$) => { let $_u128 = this$.ref(); this$.#tok = $_u128; return $_u128; })(this);
      }
      ;
      if (sys.Int.isDigit(this.#cur)) {
        return ((this$) => { let $_u129 = this$.num(); this$.#tok = $_u129; return $_u129; })(this);
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 94)) {
        return ((this$) => { let $_u130 = this$.symbol(); this$.#tok = $_u130; return $_u130; })(this);
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 96)) {
        return ((this$) => { let $_u131 = this$.uri(); this$.#tok = $_u131; return $_u131; })(this);
      }
      ;
      return ((this$) => { let $_u132 = this$.operator(); this$.#tok = $_u132; return $_u132; })(this);
    }
    let tok = nextTok()
    this.#valEndLoc = this.curLoc();
    this.#valEndLoc.filePos(this.#valEndLoc.filePos() - 1)
    if (isWord) this.#valEndLoc.filePos(this.#valEndLoc.filePos() - 1)
    return tok
  }

  word() {
    let s = sys.StrBuf.make();
    while ((sys.Int.isAlphaNum(this.#cur) || sys.ObjUtil.equals(this.#cur, 95))) {
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    let id = s.toStr();
    this.#val = id;
    if (sys.Int.isUpper(sys.Str.get(id, 0))) {
      return Token.typename();
    }
    ;
    let keyword = Token.keywords().get(id);
    if (keyword != null) {
      this.#val = null;
      return sys.ObjUtil.coerce(keyword, Token.type$);
    }
    ;
    return Token.id();
  }

  num() {
    let isHex = (sys.ObjUtil.equals(this.#cur, 48) && sys.ObjUtil.equals(this.#peek, 120));
    if (isHex) {
      this.consume();
      this.consume();
      let s = sys.StrBuf.make();
      while (true) {
        if (sys.Int.isDigit(this.#cur, 16)) {
          s.addChar(this.#cur);
          this.consume();
          continue;
        }
        ;
        if (sys.ObjUtil.equals(this.#cur, 95)) {
          this.consume();
          continue;
        }
        ;
        break;
      }
      ;
      this.#val = haystack.Number.make(sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.fromStr(s.toStr(), 16), sys.Num.type$)));
      return Token.val();
    }
    ;
    let s = sys.StrBuf.make().addChar(this.#cur);
    this.consume();
    let colons = 0;
    let dashes = 0;
    let unitIndex = 0;
    let exp = false;
    while (true) {
      if (!sys.Int.isDigit(this.#cur)) {
        if ((exp && (sys.ObjUtil.equals(this.#cur, 43) || sys.ObjUtil.equals(this.#cur, 45)))) {
        }
        else {
          if (sys.ObjUtil.equals(this.#cur, 45)) {
            ((this$) => { let $_u133 = dashes;dashes = sys.Int.increment(dashes); return $_u133; })(this);
          }
          else {
            if ((sys.ObjUtil.equals(this.#cur, 58) && sys.Int.isDigit(this.#peek))) {
              ((this$) => { let $_u134 = colons;colons = sys.Int.increment(colons); return $_u134; })(this);
            }
            else {
              if (((exp || sys.ObjUtil.compareGE(colons, 1)) && sys.ObjUtil.equals(this.#cur, 43))) {
              }
              else {
                if (sys.ObjUtil.equals(this.#cur, 46)) {
                  if (!sys.Int.isDigit(this.#peek)) {
                    break;
                  }
                  ;
                }
                else {
                  if (((sys.ObjUtil.equals(this.#cur, 101) || sys.ObjUtil.equals(this.#cur, 69)) && (sys.ObjUtil.equals(this.#peek, 45) || sys.ObjUtil.equals(this.#peek, 43) || sys.Int.isDigit(this.#peek)))) {
                    (exp = true);
                  }
                  else {
                    if ((sys.Int.isAlpha(this.#cur) || sys.ObjUtil.equals(this.#cur, 37) || sys.ObjUtil.equals(this.#cur, 36) || sys.ObjUtil.compareGT(this.#cur, 128) || (sys.ObjUtil.equals(this.#cur, 47) && sys.ObjUtil.compareNE(this.#peek, 47)))) {
                      if (sys.ObjUtil.equals(unitIndex, 0)) {
                        (unitIndex = s.size());
                      }
                      ;
                    }
                    else {
                      if (sys.ObjUtil.equals(this.#cur, 95)) {
                        if ((sys.ObjUtil.equals(unitIndex, 0) && sys.Int.isDigit(this.#peek))) {
                          this.consume();
                          continue;
                        }
                        else {
                          if (sys.ObjUtil.equals(unitIndex, 0)) {
                            (unitIndex = s.size());
                          }
                          ;
                        }
                        ;
                      }
                      else {
                        break;
                      }
                      ;
                    }
                    ;
                  }
                  ;
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
      }
      ;
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    if ((sys.ObjUtil.equals(dashes, 2) && sys.ObjUtil.equals(colons, 0))) {
      this.#val = sys.Date.fromStr(s.toStr(), false);
      if (this.#val == null) {
        throw this.err(sys.Str.plus(sys.Str.plus("Invalid date literal '", s), "'"));
      }
      ;
      return Token.val();
    }
    ;
    if ((sys.ObjUtil.equals(dashes, 1) && sys.ObjUtil.equals(colons, 0))) {
      let start = sys.Date.fromStr(sys.Str.plus(sys.Str.plus("", s), "-01"), false);
      if (start != null) {
        this.#val = haystack.DateSpan.makeMonth(start.year(), start.month());
        return Token.val();
      }
      ;
    }
    ;
    if ((sys.ObjUtil.equals(dashes, 0) && sys.ObjUtil.compareGE(colons, 1))) {
      if (sys.ObjUtil.equals(s.get(1), 58)) {
        s.insert(0, "0");
      }
      ;
      if (sys.ObjUtil.equals(colons, 1)) {
        s.add(":00");
      }
      ;
      this.#val = sys.Time.fromStr(s.toStr(), false);
      if (this.#val == null) {
        throw this.err(sys.Str.plus(sys.Str.plus("Invalid time literal '", s), "'"));
      }
      ;
      return Token.val();
    }
    ;
    let str = s.toStr();
    if (sys.ObjUtil.equals(unitIndex, 0)) {
      let float = sys.Float.fromStr(str, false);
      if (float == null) {
        throw this.err(sys.Str.plus(sys.Str.plus("Invalid number literal '", str), "'"));
      }
      ;
      this.#val = haystack.Number.make(sys.ObjUtil.coerce(float, sys.Float.type$), null);
    }
    else {
      let floatStr = sys.Str.getRange(str, sys.Range.make(0, unitIndex, true));
      let unitStr = sys.Str.getRange(str, sys.Range.make(unitIndex, -1));
      let float = sys.Float.fromStr(floatStr, false);
      if (float == null) {
        throw this.err(sys.Str.plus(sys.Str.plus("Invalid number literal '", str), "'"));
      }
      ;
      let unit = haystack.Number.loadUnit(unitStr, false);
      if (unit == null) {
        throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid unit name '", unitStr), "' ["), sys.Str.toCode(unitStr, sys.ObjUtil.coerce(34, sys.Int.type$.toNullable()), true)), "]"));
      }
      ;
      this.#val = haystack.Number.make(sys.ObjUtil.coerce(float, sys.Float.type$), unit);
    }
    ;
    return Token.val();
  }

  rawStr() {
    this.consume();
    this.consume();
    let s = sys.StrBuf.make();
    while (true) {
      let ch = this.#cur;
      if (sys.ObjUtil.equals(ch, 34)) {
        this.consume();
        break;
      }
      ;
      if ((sys.ObjUtil.equals(ch, 0) || sys.ObjUtil.equals(ch, 10))) {
        throw this.err("Unexpected end of str");
      }
      ;
      this.consume();
      s.addChar(ch);
    }
    ;
    this.#val = s.toStr();
    return Token.val();
  }

  str() {
    this.consume();
    if ((sys.ObjUtil.equals(this.#cur, 34) && sys.ObjUtil.equals(this.#peek, 34))) {
      return this.strTripleQuote();
    }
    ;
    let s = sys.StrBuf.make();
    while (true) {
      let ch = this.#cur;
      if (sys.ObjUtil.equals(ch, 34)) {
        this.consume();
        break;
      }
      ;
      if (sys.ObjUtil.equals(ch, 36)) {
        throw this.err("String interpolation not supported yet");
      }
      ;
      if ((sys.ObjUtil.equals(ch, 0) || sys.ObjUtil.equals(ch, 10))) {
        throw this.err("Unexpected end of str");
      }
      ;
      if (sys.ObjUtil.equals(ch, 92)) {
        s.addChar(this.escape());
        continue;
      }
      ;
      this.consume();
      s.addChar(ch);
    }
    ;
    this.#val = s.toStr();
    return Token.val();
  }

  strTripleQuote() {
    this.consume();
    this.consume();
    let s = sys.StrBuf.make();
    let startCol = this.#col;
    while (true) {
      let ch = this.#cur;
      if (sys.ObjUtil.equals(ch, 36)) {
        throw this.err("String interpolation not supported yet");
      }
      ;
      if (sys.ObjUtil.equals(ch, 0)) {
        throw this.err("Unexpected end of str");
      }
      ;
      if (sys.ObjUtil.equals(ch, 92)) {
        s.addChar(this.escape());
        continue;
      }
      ;
      if (sys.ObjUtil.equals(ch, 34)) {
        if (sys.ObjUtil.compareLT(this.#col, startCol)) {
          throw this.err(sys.Str.plus("Leading space in multi-line string must be ", sys.ObjUtil.coerce(startCol, sys.Obj.type$.toNullable())));
        }
        ;
        this.consume();
        if ((sys.ObjUtil.equals(this.#cur, 34) && sys.ObjUtil.equals(this.#peek, 34))) {
          this.consume();
          this.consume();
          break;
        }
        ;
      }
      ;
      if (sys.ObjUtil.compareGE(this.#col, startCol)) {
        if (sys.ObjUtil.compareNE(ch, 34)) {
          this.consume();
        }
        ;
        s.addChar(ch);
      }
      else {
        if (sys.ObjUtil.equals(ch, 10)) {
          this.consume();
          s.addChar(ch);
        }
        else {
          if (sys.ObjUtil.compareNE(ch, 32)) {
            throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Leading space in multi-line string must be ", sys.ObjUtil.coerce(startCol, sys.Obj.type$.toNullable())), " ["), sys.Str.toCode(sys.Int.toChar(ch))), "]"));
          }
          ;
          this.consume();
        }
        ;
      }
      ;
    }
    ;
    this.#val = s.toStr();
    return Token.val();
  }

  ref() {
    this.consume();
    let s = sys.StrBuf.make();
    while (true) {
      let ch = this.#cur;
      if (haystack.Ref.isIdChar(ch)) {
        this.consume();
        s.addChar(ch);
      }
      else {
        break;
      }
      ;
    }
    ;
    if (s.isEmpty()) {
      throw this.err("Invalid empty ref");
    }
    ;
    this.#val = haystack.Ref.fromStr(s.toStr());
    return Token.val();
  }

  symbol() {
    this.consume();
    let s = sys.StrBuf.make();
    while (true) {
      let ch = this.#cur;
      if (haystack.Ref.isIdChar(ch)) {
        this.consume();
        s.addChar(ch);
      }
      else {
        break;
      }
      ;
    }
    ;
    if (s.isEmpty()) {
      throw this.err("Invalid empty symbol");
    }
    ;
    this.#val = haystack.Symbol.fromStr(s.toStr());
    return Token.val();
  }

  uri() {
    this.consume();
    let s = sys.StrBuf.make();
    while (true) {
      let ch = this.#cur;
      if (sys.ObjUtil.equals(ch, 96)) {
        this.consume();
        break;
      }
      ;
      if (sys.ObjUtil.equals(ch, 36)) {
        throw this.err("String interpolation not supported yet");
      }
      ;
      if ((sys.ObjUtil.equals(ch, 0) || sys.ObjUtil.equals(ch, 10))) {
        throw this.err("Unexpected end of uri");
      }
      ;
      if (sys.ObjUtil.equals(ch, 92)) {
        let $_u135 = this.#peek;
        if (sys.ObjUtil.equals($_u135, 58) || sys.ObjUtil.equals($_u135, 47) || sys.ObjUtil.equals($_u135, 63) || sys.ObjUtil.equals($_u135, 35) || sys.ObjUtil.equals($_u135, 91) || sys.ObjUtil.equals($_u135, 93) || sys.ObjUtil.equals($_u135, 64) || sys.ObjUtil.equals($_u135, 92) || sys.ObjUtil.equals($_u135, 38) || sys.ObjUtil.equals($_u135, 61) || sys.ObjUtil.equals($_u135, 59) || sys.ObjUtil.equals($_u135, 36)) {
          s.addChar(ch);
          s.addChar(this.#peek);
          this.consume();
          this.consume();
        }
        else {
          s.addChar(this.escape());
        }
        ;
      }
      else {
        this.consume();
        s.addChar(ch);
      }
      ;
    }
    ;
    this.#val = sys.Uri.fromStr(s.toStr());
    return Token.val();
  }

  escape() {
    this.consume();
    let $_u136 = this.#cur;
    if (sys.ObjUtil.equals($_u136, 98)) {
      this.consume();
      return 8;
    }
    else if (sys.ObjUtil.equals($_u136, 102)) {
      this.consume();
      return 12;
    }
    else if (sys.ObjUtil.equals($_u136, 110)) {
      this.consume();
      return 10;
    }
    else if (sys.ObjUtil.equals($_u136, 114)) {
      this.consume();
      return 13;
    }
    else if (sys.ObjUtil.equals($_u136, 116)) {
      this.consume();
      return 9;
    }
    else if (sys.ObjUtil.equals($_u136, 34)) {
      this.consume();
      return 34;
    }
    else if (sys.ObjUtil.equals($_u136, 36)) {
      this.consume();
      return 36;
    }
    else if (sys.ObjUtil.equals($_u136, 39)) {
      this.consume();
      return 39;
    }
    else if (sys.ObjUtil.equals($_u136, 96)) {
      this.consume();
      return 96;
    }
    else if (sys.ObjUtil.equals($_u136, 92)) {
      this.consume();
      return 92;
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 117)) {
      this.consume();
      let n3 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n2 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n1 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n0 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      if ((n3 == null || n2 == null || n1 == null || n0 == null)) {
        throw this.err("Invalid hex value for \\uxxxx");
      }
      ;
      return sys.Int.or(sys.Int.or(sys.Int.or(sys.Int.shiftl(sys.ObjUtil.coerce(n3, sys.Int.type$), 12), sys.Int.shiftl(sys.ObjUtil.coerce(n2, sys.Int.type$), 8)), sys.Int.shiftl(sys.ObjUtil.coerce(n1, sys.Int.type$), 4)), sys.ObjUtil.coerce(n0, sys.Int.type$));
    }
    ;
    throw this.err("Invalid escape sequence");
  }

  operator() {
    let c = this.#cur;
    this.consume();
    let $_u137 = c;
    if (sys.ObjUtil.equals($_u137, 0)) {
      return Token.eof();
    }
    else if (sys.ObjUtil.equals($_u137, 13)) {
      throw this.err("Carriage return \\r not allowed in source");
    }
    else if (sys.ObjUtil.equals($_u137, 33)) {
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return Token.notEq();
      }
      ;
      return Token.bang();
    }
    else if (sys.ObjUtil.equals($_u137, 38)) {
      return Token.amp();
    }
    else if (sys.ObjUtil.equals($_u137, 40)) {
      return Token.lparen();
    }
    else if (sys.ObjUtil.equals($_u137, 41)) {
      return Token.rparen();
    }
    else if (sys.ObjUtil.equals($_u137, 42)) {
      return Token.star();
    }
    else if (sys.ObjUtil.equals($_u137, 43)) {
      return Token.plus();
    }
    else if (sys.ObjUtil.equals($_u137, 44)) {
      return Token.comma();
    }
    else if (sys.ObjUtil.equals($_u137, 45)) {
      if (sys.ObjUtil.equals(this.#cur, 62)) {
        this.consume();
        return Token.arrow();
      }
      ;
      return Token.minus();
    }
    else if (sys.ObjUtil.equals($_u137, 46)) {
      if (sys.ObjUtil.equals(this.#cur, 46)) {
        this.consume();
        return Token.dotDot();
      }
      ;
      return Token.dot();
    }
    else if (sys.ObjUtil.equals($_u137, 47)) {
      return Token.slash();
    }
    else if (sys.ObjUtil.equals($_u137, 58)) {
      if (sys.ObjUtil.equals(this.#cur, 58)) {
        this.consume();
        return Token.doubleColon();
      }
      ;
      return Token.colon();
    }
    else if (sys.ObjUtil.equals($_u137, 59)) {
      return Token.semicolon();
    }
    else if (sys.ObjUtil.equals($_u137, 60)) {
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        if (sys.ObjUtil.equals(this.#cur, 62)) {
          this.consume();
          return Token.cmp();
        }
        ;
        return Token.ltEq();
      }
      ;
      return Token.lt();
    }
    else if (sys.ObjUtil.equals($_u137, 61)) {
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return Token.eq();
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 62)) {
        this.consume();
        return Token.fnEq();
      }
      ;
      return Token.assign();
    }
    else if (sys.ObjUtil.equals($_u137, 62)) {
      if (sys.ObjUtil.equals(this.#cur, 61)) {
        this.consume();
        return Token.gtEq();
      }
      ;
      return Token.gt();
    }
    else if (sys.ObjUtil.equals($_u137, 63)) {
      return Token.question();
    }
    else if (sys.ObjUtil.equals($_u137, 91)) {
      return Token.lbracket();
    }
    else if (sys.ObjUtil.equals($_u137, 93)) {
      return Token.rbracket();
    }
    else if (sys.ObjUtil.equals($_u137, 123)) {
      return Token.lbrace();
    }
    else if (sys.ObjUtil.equals($_u137, 124)) {
      return Token.pipe();
    }
    else if (sys.ObjUtil.equals($_u137, 125)) {
      return Token.rbrace();
    }
    else if (sys.ObjUtil.equals($_u137, 94)) {
      return Token.caret();
    }
    else if (sys.ObjUtil.equals($_u137, 95)) {
      return Token.underbar();
    }
    ;
    if (sys.ObjUtil.equals(c, 0)) {
      return Token.eof();
    }
    ;
    throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unexpected symbol: ", sys.Int.toChar(c)), " (0x"), sys.Int.toHex(c)), ")"));
  }

  skipCommentSL() {
    this.consume();
    this.consume();
    while (true) {
      if ((sys.ObjUtil.equals(this.#cur, 10) || sys.ObjUtil.equals(this.#cur, 0))) {
        break;
      }
      ;
      this.consume();
    }
    ;
    return;
  }

  skipCommentML() {
    this.consume();
    this.consume();
    let depth = 1;
    while (true) {
      if ((sys.ObjUtil.equals(this.#cur, 42) && sys.ObjUtil.equals(this.#peek, 47))) {
        this.consume();
        this.consume();
        ((this$) => { let $_u138 = depth;depth = sys.Int.decrement(depth); return $_u138; })(this);
        if (sys.ObjUtil.compareLE(depth, 0)) {
          break;
        }
        ;
      }
      ;
      if ((sys.ObjUtil.equals(this.#cur, 47) && sys.ObjUtil.equals(this.#peek, 42))) {
        this.consume();
        this.consume();
        ((this$) => { let $_u139 = depth;depth = sys.Int.increment(depth); return $_u139; })(this);
        continue;
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 10)) {
        this.#line = sys.Int.increment(this.#line);
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 0)) {
        break;
      }
      ;
      this.consume();
    }
    ;
    return;
  }
  
  commentSL() {
    this.consume();
    this.consume();
    let s = sys.StrBuf.make();
    while (true) {
      if ((sys.ObjUtil.equals(this.#cur, 10) || sys.ObjUtil.equals(this.#cur, 0))) {
        break;
      }
      ;
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    this.#val = s.toStr();
    return Token.commentSL();
  }

  commentML() {
    this.consume();
    this.consume();
    let s = sys.StrBuf.make();
    let depth = 1;
    while (true) {
      if ((sys.ObjUtil.equals(this.#cur, 42) && sys.ObjUtil.equals(this.#peek, 47))) {
        this.consume();
        this.consume();
        ((this$) => { let $_u138 = depth;depth = sys.Int.decrement(depth); return $_u138; })(this);
        if (sys.ObjUtil.compareLE(depth, 0)) {
          break;
        } else {
          s.addChar(42);
          s.addChar(47);
        }
        ;
      }
      ;
      if ((sys.ObjUtil.equals(this.#cur, 47) && sys.ObjUtil.equals(this.#peek, 42))) {
        s.addChar(this.#cur);
        s.addChar(this.#peek);
        this.consume();
        this.consume();
        ((this$) => { let $_u139 = depth;depth = sys.Int.increment(depth); return $_u139; })(this);
        continue;
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 10)) {
        this.#line = sys.Int.increment(this.#line);
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 0)) {
        break;
      }
      ;
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    this.#val = s.toStr();
    return Token.commentML();
  }

  err(msg) {
    return SyntaxErr.make(msg, this.curLoc());
  }

  curLoc() {
    return Loc.make(this.#startLoc.file(), sys.Int.plus(this.#startLoc.line(), this.#line),sys.Int.plus(this.#startLoc.filePos(), this.#filePos));
  }

  consume() {
    if (sys.ObjUtil.equals(this.#cur, 10)) {
      this.#col = 0;
    }
    else {
      ((this$) => { let $_u140 = this$.#col;this$.#col = sys.Int.increment(this$.#col); return $_u140; })(this);
    }
    ;
    this.#cur = this.#peek;
    this.#peek = sys.ObjUtil.coerce(((this$) => { let $_u141 = this$.#in.readChar(); if ($_u141 != null) return $_u141; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this), sys.Int.type$);
    this.#filePos++;
    return;
  }

}

class ExprToFilter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExprToFilter.type$; }

  #cx = null;

  // private field reflection only
  __cx(it) { if (it === undefined) return this.#cx; else this.#cx = it; }

  static make(cx) {
    const $self = new ExprToFilter();
    ExprToFilter.make$($self,cx);
    return $self;
  }

  static make$($self,cx) {
    $self.#cx = cx;
    return;
  }

  evalToFilter(expr,checked) {
    if (checked === undefined) checked = true;
    try {
      if (sys.ObjUtil.equals(expr.type(), ExprType.literal())) {
        let literal = sys.ObjUtil.coerce(expr, Literal.type$).val();
        if ((sys.ObjUtil.is(literal, sys.Str.type$) && !Token.isKeyword(sys.ObjUtil.coerce(literal, sys.Str.type$)))) {
          throw NotFilterErr.make("String literal");
        }
        ;
        if (sys.ObjUtil.is(literal, haystack.Filter.type$)) {
          return sys.ObjUtil.coerce(literal, haystack.Filter.type$.toNullable());
        }
        ;
      }
      ;
      return this.toFilter(expr);
    }
    catch ($_u142) {
      $_u142 = sys.Err.make($_u142);
      if ($_u142 instanceof NotFilterErr) {
        let e = $_u142;
        ;
        if (checked) {
          throw expr.err(sys.Str.plus("Expr is not a filter; ", e.msg()), this.#cx);
        }
        ;
        return null;
      }
      else {
        throw $_u142;
      }
    }
    ;
  }

  toFilter(expr) {
    if (expr.type() === ExprType.filter()) {
      return sys.ObjUtil.coerce(expr, FilterExpr.type$).filter();
    }
    ;
    if (expr.type() === ExprType.var()) {
      let var$ = this.#cx.getVar(sys.ObjUtil.coerce(expr, Var.type$).name());
      if (sys.ObjUtil.is(var$, haystack.Filter.type$)) {
        return sys.ObjUtil.coerce(var$, haystack.Filter.type$);
      }
      ;
    }
    ;
    let callName = expr.asCallFuncName();
    if ((sys.ObjUtil.equals(callName, "parseFilter") || sys.ObjUtil.equals(callName, "parseSearch"))) {
      return sys.ObjUtil.coerce(expr.eval(this.#cx), haystack.Filter.type$);
    }
    ;
    if ((expr.type() === ExprType.literal() && sys.ObjUtil.is(expr.eval(this.#cx), haystack.Symbol.type$))) {
      return haystack.Filter.isSymbol(sys.ObjUtil.coerce(expr.eval(this.#cx), haystack.Symbol.type$));
    }
    ;
    if ((expr.type() === ExprType.var() || expr.type() === ExprType.literal() || expr.type() === ExprType.trapCall())) {
      return haystack.Filter.has(this.toPath(expr));
    }
    ;
    let binary = sys.ObjUtil.as(expr, BinaryOp.type$);
    if (binary != null) {
      let lhs = binary.lhs();
      let rhs = binary.rhs();
      let $_u143 = expr.type();
      if (sys.ObjUtil.equals($_u143, ExprType.eq())) {
        return haystack.Filter.eq(this.toPath(lhs), sys.ObjUtil.coerce(this.toVal(rhs), sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u143, ExprType.ne())) {
        return haystack.Filter.ne(this.toPath(lhs), sys.ObjUtil.coerce(this.toVal(rhs), sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u143, ExprType.lt())) {
        return haystack.Filter.lt(this.toPath(lhs), sys.ObjUtil.coerce(this.toVal(rhs), sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u143, ExprType.le())) {
        return haystack.Filter.le(this.toPath(lhs), sys.ObjUtil.coerce(this.toVal(rhs), sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u143, ExprType.ge())) {
        return haystack.Filter.ge(this.toPath(lhs), sys.ObjUtil.coerce(this.toVal(rhs), sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u143, ExprType.gt())) {
        return haystack.Filter.gt(this.toPath(lhs), sys.ObjUtil.coerce(this.toVal(rhs), sys.Obj.type$));
      }
      else if (sys.ObjUtil.equals($_u143, ExprType.and())) {
        return this.toFilter(lhs).and(this.toFilter(rhs));
      }
      else if (sys.ObjUtil.equals($_u143, ExprType.or())) {
        return this.toFilter(lhs).or(this.toFilter(rhs));
      }
      ;
    }
    ;
    if (expr.type() === ExprType.not()) {
      let operand = sys.ObjUtil.coerce(expr, UnaryOp.type$).operand();
      return haystack.Filter.missing(this.toPath(operand));
    }
    ;
    if (expr.type() === ExprType.typeRef()) {
      return haystack.Filter.isSpec(sys.ObjUtil.coerce(expr, TypeRef.type$).nameToStr());
    }
    ;
    throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Not a filter expr: ", expr), " ["), expr.type()), "]"));
  }

  toPath(expr) {
    if (sys.ObjUtil.is(expr, Var.type$)) {
      return haystack.FilterPath.makeName(sys.ObjUtil.coerce(expr, Var.type$).name());
    }
    ;
    if (sys.ObjUtil.is(expr, TrapCall.type$)) {
      let trap = sys.ObjUtil.coerce(expr, TrapCall.type$);
      let names = sys.List.make(sys.Str.type$, [trap.tagName()]);
      while (true) {
        (expr = sys.ObjUtil.coerce(trap.args().get(0), Expr.type$));
        if (sys.ObjUtil.is(expr, Var.type$)) {
          names.insert(0, sys.ObjUtil.coerce(expr, Var.type$).name());
          break;
        }
        ;
        if (sys.ObjUtil.is(expr, TrapCall.type$)) {
          (trap = sys.ObjUtil.coerce(expr, TrapCall.type$));
          names.insert(0, trap.tagName());
          continue;
        }
        ;
        throw this.err(sys.Str.plus("Not a tag path: ", expr));
      }
      ;
      return haystack.FilterPath.makeNames(names);
    }
    ;
    if (sys.ObjUtil.is(expr, Literal.type$)) {
      let literal = sys.ObjUtil.coerce(expr, Literal.type$);
      if (sys.ObjUtil.is(literal.val(), sys.Str.type$)) {
        return haystack.FilterPath.makeName(sys.ObjUtil.coerce(literal.val(), sys.Str.type$));
      }
      ;
    }
    ;
    throw this.err(sys.Str.plus("Not a tag path: ", expr));
  }

  toVal(expr) {
    let val = expr.eval(this.#cx);
    let kind = haystack.Kind.fromVal(val, false);
    if (kind == null) {
      throw this.err(sys.Str.plus(sys.Str.plus("Cannot use value type '", ((this$) => { let $_u144 = val; if ($_u144 == null) return null; return sys.ObjUtil.typeof(val); })(this)), "' in filter"));
    }
    ;
    if (kind.isCollection()) {
      if (sys.ObjUtil.equals(kind, haystack.Kind.dict())) {
        throw this.err("Cannot use Dict in filter (try using '->' operator)");
      }
      ;
      throw this.err(sys.Str.plus(sys.Str.plus("Cannot use ", kind.name()), " in filter"));
    }
    ;
    return val;
  }

  err(msg) {
    return NotFilterErr.make(msg);
  }

}

class NotFilterErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NotFilterErr.type$; }

  static make(msg) {
    const $self = new NotFilterErr();
    NotFilterErr.make$($self,msg);
    return $self;
  }

  static make$($self,msg) {
    sys.Err.make$($self, sys.ObjUtil.coerce(msg, sys.Str.type$));
    return;
  }

}

class Comment extends sys.Obj {
  constructor(value, start, end, type) {
    super();
    this.value = value
    this.start = start
    this.end = end
    this.type = type
  }  
}

class Parser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nl = true;
    this.#inners = sys.List.make(Fn.type$);
    return;
  }

  typeof() { return Parser.type$; }

  static #noArgs = undefined;

  static noArgs() {
    if (Parser.#noArgs === undefined) {
      Parser.static$init();
      if (Parser.#noArgs === undefined) Parser.#noArgs = null;
    }
    return Parser.#noArgs;
  }

  static #noParams = undefined;

  static noParams() {
    if (Parser.#noParams === undefined) {
      Parser.static$init();
      if (Parser.#noParams === undefined) Parser.#noParams = null;
    }
    return Parser.#noParams;
  }

  #startLoc = null;

  // private field reflection only
  __startLoc(it) { if (it === undefined) return this.#startLoc; else this.#startLoc = it; }

  #tokenizer = null;

  // private field reflection only
  __tokenizer(it) { if (it === undefined) return this.#tokenizer; else this.#tokenizer = it; }

  #cur = null;

  cur() {
    return this.#cur;
  }

  #curVal = null;

  curVal() {
    return this.#curVal;
  }

  #curValStart = Loc.eval();

  curValStart() {
    return this.#curValStart;
  }

  #curValEnd = Loc.eval();

  curValEnd() {
    return this.#curValEnd;
  }

  #curIndent = 0;

  // private field reflection only
  __curIndent(it) { if (it === undefined) return this.#curIndent; else this.#curIndent = it; }

  #nl = false;

  // private field reflection only
  __nl(it) { if (it === undefined) return this.#nl; else this.#nl = it; }

  #curLine = 0;

  // private field reflection only
  __curLine(it) { if (it === undefined) return this.#curLine; else this.#curLine = it; }

  #peek = null;

  peek() {
    return this.#peek;
  }

  #peekVal = null;

  peekVal() {
    return this.#peekVal;
  }

  #peekValStart = Loc.eval();

  peekValStart() {
    return this.#peekValStart;
  }

  #peekValEnd = Loc.eval();

  peekValEnd() {
    return this.#peekValEnd;
  }

  #peekLine = 0;

  // private field reflection only
  __peekLine(it) { if (it === undefined) return this.#peekLine; else this.#peekLine = it; }

  #peekPeek = null;

  // private field reflection only
  __peekPeek(it) { if (it === undefined) return this.#peekPeek; else this.#peekPeek = it; }

  #peekPeekVal = null;

  // private field reflection only
  __peekPeekVal(it) { if (it === undefined) return this.#peekPeekVal; else this.#peekPeekVal = it; }

  #peekPeekValStart = Loc.eval();

  // private field reflection only
  __peekPeekValStart(it) { if (it === undefined) return this.#peekPeekValStart; else this.#peekPeekValStart = it; }

  #peekPeekValEnd = Loc.eval();

  // private field reflection only
  __peekPeekValEnd(it) { if (it === undefined) return this.#peekPeekValEnd; else this.#peekPeekValEnd = it; }

  #peekPeekLine = 0;

  // private field reflection only
  __peekPeekLine(it) { if (it === undefined) return this.#peekPeekLine; else this.#peekPeekLine = it; }
  
  #curName = null;

  // private field reflection only
  __curName(it) { if (it === undefined) return this.#curName; else this.#curName = it; }

  #curFuncName = null;

  // private field reflection only
  __curFuncName(it) { if (it === undefined) return this.#curFuncName; else this.#curFuncName = it; }

  #anonNum = 0;

  // private field reflection only
  __anonNum(it) { if (it === undefined) return this.#anonNum; else this.#anonNum = it; }

  #inners = null;

  // private field reflection only
  __inners(it) { if (it === undefined) return this.#inners; else this.#inners = it; }

  #inSpec = 0;

  // private field reflection only
  __inSpec(it) { if (it === undefined) return this.#inSpec; else this.#inSpec = it; }

  #comments = [];

  // private field reflection only
  __comments(it) { if (it === undefined) return this.#comments; else this.#comments = it; }

  comments() {
    return this.#comments;
  }

  static make(startLoc,in$) {
    const $self = new Parser();
    Parser.make$($self,startLoc,in$);
    return $self;
  }

  static make$($self,startLoc,in$) {
    ;
    $self.#startLoc = startLoc;
    $self.#tokenizer = Tokenizer.make(startLoc, in$);
    $self.#cur = ((this$) => { let $_u145 = ((this$) => { let $_u146 = Token.eof(); this$.#peekPeek = $_u146; return $_u146; })(this$); this$.#peek = $_u145; return $_u145; })($self);
    $self.consume();
    $self.consume();
    $self.consume();
    return;
  }

  setStartEnd( expr, start, end ){
    expr.startLoc(start)
    expr.endLoc(end)
    return expr
  }

  parse() {
    let r = ((this$) => { if (this$.#cur === Token.defcompKeyword()) return this$.defcomp("top", haystack.Etc.emptyDict()); return this$.expr(); })(this);
    if (this.#cur !== Token.eof()) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting end of file, not ", this.#cur), " ("), this.#curVal), ")"));
    }
    ;
    return r;
  }

  parseTop(name,meta) {
    if (meta === undefined) meta = haystack.Etc.emptyDict();
    let loc = this.curLoc();
    this.#curName = name;
    let fn = null;
    if (this.#cur === Token.defcompKeyword()) {
      (fn = this.defcomp(name, meta));
    }
    else {
      let exprStart = this.#curValStart
      if (this.#cur !== Token.lparen()) {
        throw this.err("Expecting '(...) =>' top-level function");
      }
      ;
      this.consume(Token.lparen());
      let params = this.params();
      if (this.#cur !== Token.fnEq()) {
        throw this.err("Expecting '(...) =>' top-level function");
      }
      ;
      (fn = this.lamdbaBody(loc, params, meta));
    }
    ;
    if (this.#cur !== Token.eof()) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting end of file, not ", this.#cur), " ("), this.#curVal), ")"));
    }
    ;
    return sys.ObjUtil.coerce(fn, TopFn.type$);
  }

  namedExpr(name) {
    this.#curName = name;
    let e = this.expr();
    this.#curName = null;
    return e;
  }

  expr() {
    if (this.#cur === Token.id()) {
      if (this.#peek === Token.colon()) {
        return this.def();
      }
      ;
      if (this.#peek === Token.fnEq()) {
        return this.lambda1();
      }
      ;
    }
    ;
    if (this.#cur === Token.doKeyword()) {
      return this.doBlock();
    }
    ;
    if (this.#cur === Token.ifKeyword()) {
      return sys.ObjUtil.coerce(this.ifExpr(), Expr.type$);
    }
    ;
    if (this.#cur === Token.lbracket()) {
      return this.termExpr(this.list());
    }
    ;
    if (this.#cur === Token.lbrace()) {
      return this.termExpr(this.dict());
    }
    ;
    if (this.#cur === Token.returnKeyword()) {
      return sys.ObjUtil.coerce(this.returnExpr(), Expr.type$);
    }
    ;
    if (this.#cur === Token.throwKeyword()) {
      return sys.ObjUtil.coerce(this.throwExpr(), Expr.type$);
    }
    ;
    if (this.#cur === Token.tryKeyword()) {
      return sys.ObjUtil.coerce(this.tryCatchExpr(), Expr.type$);
    }
    ;
    return this.assignExpr();
  }

  doBlock() {
    let exprStart = this.#curValStart
    this.consume(Token.doKeyword());
    let exprs = sys.List.make(Expr.type$, [this.expr()]);
    let exprEnd = exprs.last().endLoc()
    while (true) {
      if (this.#cur === Token.endKeyword()) {
        exprEnd = this.#curValEnd
        this.consume();
        break;
      }
      ;
      if (this.#cur === Token.elseKeyword()) {
        break;
      }
      ;
      if (this.#cur === Token.catchKeyword()) {
        break;
      }
      ;
      if (this.#cur === Token.eof()) {
        throw this.err("Expecting 'end', not end of file");
      }
      ;
      this.eos();
      if (this.#cur === Token.endKeyword()) {
        exprEnd = this.#curValEnd
        this.consume();
        break;
      }
      ;
      if (this.#cur === Token.elseKeyword()) {
        break;
      }
      ;
      if (this.#cur === Token.catchKeyword()) {
        break;
      }
      ;
      if (this.#cur === Token.eof()) {
        throw this.err("Expecting 'end', not end of file");
      }
      ;
      exprs.add(this.expr());
      exprEnd = exprs.last().endLoc()
    }
    ;
    return this.setStartEnd(Block.make(exprs), exprStart, exprEnd);
  }

  isEos() {
    return (this.#cur === Token.semicolon() || this.#nl);
  }

  eos() {
    if (this.#cur === Token.semicolon()) {
      this.consume();
      return;
    }
    ;
    if (this.#nl) {
      return;
    }
    ;
    throw this.err(sys.Str.plus("Expecting newline or semicolon, not ", this.curToStr()));
  }

  defcomp(name,meta) {
    let exprStart = this.#curValStart
    let compLoc = this.curLoc();
    this.consume(Token.defcompKeyword());
    let compRef = concurrent.AtomicRef.make();
    let cells = sys.List.make(MCellDef.type$);
    let cellsMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("axon::MCellDef"));
    while ((this.#cur !== Token.doKeyword() && this.#cur !== Token.endKeyword())) {
      let cellLoc = this.curLoc();
      let c = this.cell(compRef, cells.size());
      if (cellsMap.get(c.name()) != null) {
        throw this.err(sys.Str.plus("Duplicate cell names: ", c.name()), cellLoc);
      }
      ;
      cells.add(sys.ObjUtil.coerce(c, MCellDef.type$));
      cellsMap.add(c.name(), sys.ObjUtil.coerce(c, MCellDef.type$));
    }
    ;
    let body = Literal.nullVal();
    if (this.#cur === Token.doKeyword()) {
      (body = this.doBlock());
    }
    ;
    let exprEnd = this.#curValEnd
    this.consume(Token.endKeyword());
    let def = MCompDef.make(compLoc, name, meta, body, cells, cellsMap);
    compRef.val(def);
    this.bindInnersToOuter(def);
    return this.setStartEnd(def, exprStart, exprEnd);
  }

  cell(compRef,index) {
    let exprStart = this.#curValStart
    let name = this.consumeIdOrKeyword("Expecting cell name");
    this.consume(Token.colon());
    let meta = this.constDict();
    if (meta.has("name")) {
      throw this.err("Comp cell meta cannot define 'name' tag");
    }
    ;
    this.eos();
    return this.setStartEnd(MCellDef.make(compRef, index, name, meta), exprStart, meta.endLoc());
  }

  def() {
    let exprStart = this.#curValStart
    let loc = this.curLoc();
    let name = this.consumeId("variable name");
    this.consume(Token.colon());
    let def = DefineVar.make(loc, name, this.namedExpr(name))
    return this.setStartEnd(def, exprStart, def.val().endLoc());
  }

  ifExpr() {
    let exprStart = this.#curValStart
    let loc = this.curLoc();
    this.consume();
    this.consume(Token.lparen());
    let cond = this.expr();
    this.consume(Token.rparen());
    let trueVal = this.expr();
    let exprEnd = trueVal.endLoc()
    let falseVal = Literal.nullVal();
    if (this.#cur === Token.elseKeyword()) {
      this.consume();
      (falseVal = this.expr());
      exprEnd = falseVal.endLoc()
    }
    ;
    return this.setStartEnd(If.make(cond, trueVal, falseVal), exprStart, exprEnd);
  }

  returnExpr() {
    let exprStart = this.#curValStart
    this.consume(Token.returnKeyword());
    if (this.#nl) {
      throw this.err("return must be followed by expr on same line");
    }
    ;
    let expr = Return.make(this.expr())
    return this.setStartEnd(expr, exprStart,expr.expr().endLoc())
  }

  throwExpr() {
    let exprStart = this.#curValStart
    this.consume(Token.throwKeyword());
    if (this.#nl) {
      throw this.err("throw must be followed by expr on same line");
    }
    ;
    let expr = Throw.make(this.expr())
    return this.setStartEnd(expr, exprStart, expr.expr().endLoc())
  }

  tryCatchExpr() {
    let exprStart = this.#curValStart
    this.consume(Token.tryKeyword());
    let body = this.expr();
    this.consume(Token.catchKeyword());
    let errVarName = null;
    if ((this.#cur === Token.lparen() && sys.ObjUtil.equals(this.#peek, Token.id()) && this.#peekPeek === Token.rparen())) {
      this.consume();
      (errVarName = this.consumeId("exception variable name"));
      this.consume();
    }
    ;
    let catcher = this.expr();
    let expr = TryCatch.make(body, errVarName, catcher)
    return this.setStartEnd(expr, exprStart, catcher.endLoc())
  }

  list() {
    let exprStart = this.#curValStart
    this.consume(Token.lbracket());
    if (this.#cur === Token.rbracket()) {
      let exprEnd = this.#curValEnd
      this.consume();
      return this.setStartEnd(ListExpr.empty(), exprStart, exprEnd)
    }
    ;
    let acc = sys.List.make(Expr.type$);
    let allValsConst = true;
    while (true) {
      let val = this.expr();
      acc.add(val);
      if (!val.isConst()) {
        (allValsConst = false);
      }
      ;
      if (this.#cur !== Token.comma()) {
        break;
      }
      ;
      this.consume();
      if (this.#cur === Token.rbracket()) {
        break;
      }
      ;
    }
    ;
    let exprEnd = this.#curValEnd
    this.consume(Token.rbracket());
    return this.setStartEnd(ListExpr.make(acc, allValsConst), exprStart, exprEnd);
  }

  dict() {
    let exprStart = this.#curValStart
    let open = Token.lbrace();
    let close = Token.rbrace();
    this.consume(open);
    if (this.#cur === close) {
      let exprEnd = this.#curValEnd
      this.consume();
      return this.setStartEnd(DictExpr.empty(), exprStart, exprEnd)
    }
    ;
    let loc = this.curLoc();
    let names = sys.List.make(sys.Str.type$);
    let vals = sys.List.make(Expr.type$);
    let allValsConst = true;
    while (true) {
      let val = Literal.markerVal();
      if (this.#cur === Token.minus()) {
        this.consume();
        (val = Literal.removeVal());
      }
      ;
      let name = null;
      if ((this.#cur === Token.val() && sys.ObjUtil.is(this.#curVal, sys.Str.type$))) {
        (name = sys.ObjUtil.coerce(this.#curVal, sys.Str.type$.toNullable()));
        this.consume();
      }
      else {
        (name = this.consumeIdOrKeyword("dict tag name"));
      }
      ;
      names.add(sys.ObjUtil.coerce(name, sys.Str.type$));
      if (this.#cur === Token.colon()) {
        if (val === Literal.removeVal()) {
          throw this.err(sys.Str.plus("Cannot have both - and val in dict: ", name));
        }
        ;
        this.consume();
        (val = this.expr());
      }
      ;
      if (!val.isConst()) {
        (allValsConst = false);
      }
      ;
      vals.add(val);
      if (this.#cur !== Token.comma()) {
        if (this.#cur !== close) {
          throw this.err(sys.Str.plus(sys.Str.plus("Expecting colon and value after ", sys.Str.toCode(name)), " dict literal"));
        }
        ;
        break;
      }
      ;
      this.consume();
      if (this.#cur === close) {
        break;
      }
      ;
    }
    ;
    let exprEnd = this.#curValEnd
    this.consume(close);
    return this.setStartEnd(DictExpr.make(loc, names, vals, allValsConst), exprStart, exprEnd)
  }

  constDict() {
    let expr = this.dict();
    if (expr.constVal() == null) {
      throw this.err("Dict cannot use expressions", expr.loc());
    }
    ;
    return sys.ObjUtil.coerce(expr.constVal(), haystack.Dict.type$);
  }

  assignExpr() {
    let expr = this.condOrExpr();
    if (this.#cur !== Token.assign()) {
      return expr;
    }
    ;
    this.consume();
    return Assign.make(expr, this.expr());
  }

  condOrExpr() {
    let expr = this.condAndExpr();
    if (this.#cur !== Token.orKeyword()) {
      return expr;
    }
    ;
    this.consume();
    return Or.make(expr, this.condOrExpr());
  }

  condAndExpr() {
    let expr = this.compareExpr();
    if (this.#cur !== Token.andKeyword()) {
      return expr;
    }
    ;
    this.consume();
    return And.make(expr, this.condAndExpr());
  }

  compareExpr() {
    let expr = this.rangeExpr();
    if (sys.ObjUtil.compareGT(this.#inSpec, 0)) {
      return expr;
    }
    ;
    let $_u148 = this.#cur;
    if (sys.ObjUtil.equals($_u148, Token.eq())) {
      this.consume();
      return Eq.make(expr, this.rangeExpr());
    }
    else if (sys.ObjUtil.equals($_u148, Token.notEq())) {
      this.consume();
      return Ne.make(expr, this.rangeExpr());
    }
    else if (sys.ObjUtil.equals($_u148, Token.lt())) {
      this.consume();
      return Lt.make(expr, this.rangeExpr());
    }
    else if (sys.ObjUtil.equals($_u148, Token.ltEq())) {
      this.consume();
      return Le.make(expr, this.rangeExpr());
    }
    else if (sys.ObjUtil.equals($_u148, Token.gtEq())) {
      this.consume();
      return Ge.make(expr, this.rangeExpr());
    }
    else if (sys.ObjUtil.equals($_u148, Token.gt())) {
      this.consume();
      return Gt.make(expr, this.rangeExpr());
    }
    else if (sys.ObjUtil.equals($_u148, Token.cmp())) {
      this.consume();
      return Cmp.make(expr, this.rangeExpr());
    }
    ;
    return expr;
  }

  rangeExpr() {
    let expr = this.addExpr();
    if (this.#cur === Token.dotDot()) {
      let startLoc = expr.startLoc()
      this.consume();
      (expr = RangeExpr.make(expr, this.addExpr()));
      expr.startLoc(startLoc)
    }
    ;
    return expr;
  }

  addExpr() {
    let expr = this.multExpr();
    while (true) {
      if (this.#cur === Token.plus()) {
        this.consume();
        (expr = Add.make(expr, this.multExpr()));
        continue;
      }
      ;
      if (this.#cur === Token.minus()) {
        this.consume();
        (expr = Sub.make(expr, this.multExpr()));
        continue;
      }
      ;
      break;
    }
    ;
    return expr;
  }

  multExpr() {
    let expr = this.unaryExpr();
    while (true) {
      if (this.#cur === Token.star()) {
        this.consume();
        (expr = Mul.make(expr, this.unaryExpr()));
        continue;
      }
      ;
      if (this.#cur === Token.slash()) {
        this.consume();
        (expr = Div.make(expr, this.unaryExpr()));
        continue;
      }
      ;
      break;
    }
    ;
    return expr;
  }

  unaryExpr() {
    let startLoc = this.#curValStart
    let endLoc = this.#curValEnd
    if (this.#cur === Token.minus()) {
      this.consume();
      return this.setStartEnd(Neg.make(this.termExpr()).foldConst(),startLoc,endLoc);
    }
    ;
    if (this.#cur === Token.notKeyword()) {
      this.consume();
      return this.setStartEnd(Not.make(this.termExpr()).foldConst(),startLoc,endLoc);
    }
    ;
    return this.termExpr();
  }

  termExpr(start) {
    if (start === undefined) start = null;
    let expr = ((this$) => { let $_u149 = start; if ($_u149 != null) return $_u149; return this$.termBase(); })(this);
    while (true) {
      if ((this.#cur === Token.lparen() && !this.#nl)) {
        (expr = this.call(sys.ObjUtil.coerce(expr, Expr.type$), false));
        continue;
      }
      ;
      if ((this.#cur === Token.lbracket() && !this.#nl)) {
        (expr = this.index(sys.ObjUtil.coerce(expr, Expr.type$)));
        continue;
      }
      ;
      if (this.#cur === Token.dot()) {
        (expr = this.call(sys.ObjUtil.coerce(expr, Expr.type$), true));
        continue;
      }
      ;
      if (this.#cur === Token.arrow()) {
        (expr = this.dictGet(sys.ObjUtil.coerce(expr, Expr.type$)));
        continue;
      }
      ;
      break;
    }
    ;
    return sys.ObjUtil.coerce(expr, Expr.type$);
  }

  termBase() {
    let start = this.#curValStart
    let end = this.#curValEnd
    if (this.#cur === Token.lparen()) {
      return this.parenExpr();
    }
    ;
    if (this.#cur === Token.val()) {
      return this.setStartEnd(Literal.make(this.consumeVal()),start,end);
    }
    ;
    if (this.#cur === Token.id()) {
      return this.termId();
    }
    ;
    if (this.#cur === Token.typename()) {
      return this.typeRef(null);
    }
    ;
    if (this.#cur === Token.trueKeyword()) {
      this.consume();
      return this.setStartEnd(Literal.trueVal(),start,end);
    }
    ;
    if (this.#cur === Token.falseKeyword()) {
      this.consume();
      return this.setStartEnd(Literal.falseVal(),start,end);
    }
    ;
    if (this.#cur === Token.nullKeyword()) {
      this.consume();
      return this.setStartEnd(Literal.nullVal(),start,end);
    }
    ;
    throw this.err(sys.Str.plus("Unexpected token ", this.#cur));
  }

  termId() {
    let startLoc = this.#curValStart
    let endLoc = this.#curValEnd
    let loc = this.curLoc();
    let name = this.consumeId("name");
    if (this.#cur !== Token.doubleColon()) {
      return this.setStartEnd(Var.make(loc, name),startLoc,endLoc);
    }
    ;
    endLoc = this.#curValEnd
    this.consume();
    if (this.#cur === Token.typename()) {
      return this.setStartEnd(this.typeRef(name),startLoc,endLoc);
    }
    else {
      endLoc = this.#curValEnd
      return this.setStartEnd(Var.make(loc, sys.Str.plus(sys.Str.plus(name, "::"), this.consumeIdOrKeyword("func qname"))),startLoc,endLoc);
    }
    ;
  }

  call(target,isMethod) {
    let args = ((this$) => { if (isMethod) return sys.List.make(Expr.type$.toNullable(), [target]); return sys.List.make(Expr.type$.toNullable()); })(this);
    let methodName = "?";
    if (isMethod) {
      this.consume(Token.dot());
      let endMethodName = this.#curValEnd;
      (methodName = this.consumeIdOrKeyword("func name"));
      if (this.#cur === Token.doubleColon()) {
        this.consume();
        if (this.#cur === Token.typename()) {
          return this.specFromDottedPath(target, methodName);
        }
        else {
          (methodName = sys.Str.plus(sys.Str.plus(methodName, "::"), this.consumeIdOrKeyword("func qname")));
        }
        ;
      }
      ;
      if (this.#cur !== Token.lparen()) {
        if ((this.#cur === Token.id() && this.#peek === Token.fnEq())) {
          args.add(this.lambda1());
        }
        ;
        return this.setStartEnd(this.toDotCall(methodName, args), target.startLoc(), endMethodName)
      }
      ;
    }
    ;
    let numPartials = 0;
    if (this.#nl) {
      throw this.err("opening call '(' paren cannot be on new line");
    }
    ;
    this.consume(Token.lparen());
    if (this.#cur !== Token.rparen()) {
      while (true) {
        if (this.#cur === Token.underbar()) {
          numPartials = sys.Int.increment(numPartials);
          args.add(null);
          this.consume();
        }
        else {
          args.add(this.expr());
        }
        ;
        if (this.#cur === Token.rparen()) {
          break;
        }
        ;
        this.consume(Token.comma());
      }
      ;
    }
    ;
    let callEndLoc = this.#curValEnd
    this.consume(Token.rparen());
    if ((!this.isEos() && (this.#cur === Token.id() || this.#cur === Token.lparen()))) {
      args.add(this.lamdba());
      callEndLoc = args.last().endLoc()
    }
    ;
    let call = ((this$) => { if (isMethod) return this$.toDotCall(methodName, args); return this$.toCall(target, args); })(this);
    if (sys.ObjUtil.compareGT(numPartials, 0)) {
      const parCall = PartialCall.make(call.func(), call.args(), numPartials);
      this.setStartEnd(parCall,target.startLoc(),callEndLoc)
      return parCall
    }
    else {
      this.setStartEnd(call,target.startLoc(),callEndLoc)
      return call;
    }
    ;
  }

  toCall(target,args) {
    if (target.type() === ExprType.typeRef()) {
      let typeName = sys.ObjUtil.coerce(target, TypeRef.type$).name();
      return StaticCall.make(sys.ObjUtil.coerce(target, TypeRef.type$), sys.Str.plus("axonMake", typeName), args);
    }
    else {
      return Call.make(target, args);
    }
    ;
  }

  toDotCall(methodName,args) {
    if (args.first().type() === ExprType.typeRef()) {
      return StaticCall.make(sys.ObjUtil.coerce(args.get(0), TypeRef.type$), methodName, args.getRange(sys.Range.make(1, -1)));
    }
    else {
      return DotCall.make(methodName, args);
    }
    ;
  }

  index(target) {
    let startLoc = this.#curValStart
    this.consume(Token.lbracket());
    let arg = this.expr();
    let endLoc = this.#curValEnd
    this.consume(Token.rbracket());
    const call = DotCall.make("get", sys.List.make(Expr.type$, [target, arg]));
    this.setStartEnd(call, startLoc, endLoc)
    return call
  }

  dictGet(target) {
    let startLoc = this.#curValStart
    this.consume(Token.arrow());
    let endLoc = this.#curValEnd
    let name = this.consumeId("dict tag name");
    return this.setStartEnd( TrapCall.make(target, name), startLoc, endLoc )
  }

  lamdba() {
    let loc = this.curLoc();
    if (this.#cur === Token.id()) {
      return this.lambda1()
    }
    ;
    if (this.#cur === Token.lparen()) {
      let expr = this.parenExpr();
      if (sys.ObjUtil.is(expr, Fn.type$)) {
        return sys.ObjUtil.coerce(expr, Fn.type$)
      }
      ;
    }
    ;
    throw this.err("Expecting lamdba expr", loc);
  }

  lambda1() {
    let startLoc = this.#curValStart
    let loc = this.curLoc();
    let params = sys.List.make(FnParam.type$, [FnParam.make(this.consumeId("func parameter name"))]);
    let expr = this.lamdbaBody(loc, params);
    expr.startLoc(startLoc)
    return expr
  }

  parenExpr() {
    let startLoc = this.#curValStart
    let loc = this.curLoc();
    this.consume(Token.lparen());
    if ((this.#cur === Token.rparen() && this.#peek === Token.fnEq())) {
      this.consume();
      return this.lamdbaBody(loc, Parser.noParams());
    }
    ;
    if ((this.#cur === Token.id() && this.#peek === Token.rparen() && sys.ObjUtil.equals(this.#peekPeek, Token.fnEq()))) {
      let id = this.consumeId("func parameter name");
      this.consume();
      return this.lamdbaBody(loc, sys.List.make(FnParam.type$, [FnParam.make(id)]));
    }
    ;
    if ((this.#cur === Token.id() && (this.#peek === Token.comma() || this.#peek === Token.colon()))) {
      let params = this.params();
      return this.lamdbaBody(loc, params);
    }
    ;
    let expr = this.expr();
    this.setStartEnd(expr, startLoc, this.#curValEnd)
    this.consume(Token.rparen());
    return expr;
  }

  params() {
    let acc = sys.List.make(FnParam.type$);
    if (this.#cur !== Token.rparen()) {
      acc.add(this.param());
      while (this.#cur === Token.comma()) {
        this.consume();
        acc.add(this.param());
      }
      ;
    }
    ;
    this.consume(Token.rparen());
    return acc;
  }

  param() {    
    let exprStart = this.#curValStart
    let idEnd = this.#curValEnd
    let name = this.consumeId("func parameter name");
    if (this.#cur !== Token.colon()) {
      return this.setStartEnd(FnParam.make(name), exprStart, idEnd);
    }
    ;
    let defValEnd = this.#curValEnd
    this.consume();
    return this.setStartEnd(FnParam.make(name, this.expr()), exprStart, defValEnd);
  }

  typeRef(lib) {
    let startLoc = this.#curValStart
    let loc = this.curLoc();
    if ((lib == null && (this.#cur === Token.id() || this.#cur.keyword()))) {
      (lib = this.consumeIdOrKeyword("spec lib name"));
      while (this.#cur === Token.dot()) {
        this.consume();
        (lib = sys.Str.plus(sys.Str.plus(lib, "."), this.consumeIdOrKeyword("spec lib name")));
      }
      ;
      if (this.#cur !== Token.doubleColon()) {
        throw this.err("Expecting :: for spec qname");
      }
      ;
      this.consume();
    }
    ;
    if (this.#cur !== Token.typename()) {
      throw this.err("Expecting spec typename");
    }
    ;
    let typename = this.#curVal;
    let endLoc = this.#curValEnd
    this.consume();
    return this.setStartEnd(TypeRef.make(loc, lib, sys.ObjUtil.coerce(typename, sys.Str.type$)),startLoc,endLoc);
  }

  specFromDottedPath(base,lastName) {
    let names = sys.List.make(sys.Str.type$);
    names.add(lastName);
    while (true) {
      if (base.type() === ExprType.var()) {
        let var$ = sys.ObjUtil.coerce(base, Var.type$);
        names.add(var$.name());
        let typeRef = this.typeRef(names.reverse().join("."));
        typeRef.startLoc(base.startLoc())
        return typeRef
      }
      ;
      if (base.type() === ExprType.dotCall()) {
        let dot = sys.ObjUtil.coerce(base, DotCall.type$);
        if (sys.ObjUtil.equals(dot.args().size(), 1)) {
          names.add(sys.ObjUtil.coerce(dot.funcName(), sys.Str.type$));
          (base = sys.ObjUtil.coerce(dot.args().get(0), Expr.type$));
          continue;
        }
        ;
      }
      ;
      throw this.err(sys.Str.plus("Invalid spec qname: ", base), base.loc());
    }
    ;
    throw this.err("illegal state");
  }

  lamdbaBody(loc,params,topMeta) {
    let startLoc = this.#curValStart
    if (topMeta === undefined) topMeta = null;
    let oldInners = this.#inners;
    this.#inners = sys.List.make(Fn.type$);
    let oldFuncName = this.#curFuncName;
    if (this.#curName != null) {
      this.#curFuncName = this.#curName;
      this.#curName = null;
    }
    else {
      this.#curFuncName = sys.Str.plus("anon-", sys.ObjUtil.coerce(this.#anonNum = sys.Int.increment(this.#anonNum), sys.Obj.type$.toNullable()));
    }
    ;
    if (oldFuncName != null) {
      this.#curFuncName = sys.Str.plus(sys.Str.plus(oldFuncName, "."), this.#curFuncName);
    }
    ;
    this.consume(Token.fnEq());
    let body = this.expr();
    (body = this.optimizeLastReturn(body));
    let fn = ((this$) => { if (topMeta != null) return TopFn.make(loc, sys.ObjUtil.coerce(this$.#curFuncName, sys.Str.type$), sys.ObjUtil.coerce(topMeta, haystack.Dict.type$), params, body); return Fn.make(loc, sys.ObjUtil.coerce(this$.#curFuncName, sys.Str.type$), params, body); })(this);
    this.bindInnersToOuter(fn);
    this.#inners = oldInners.add(fn);
    this.#curFuncName = oldFuncName;
    return this.setStartEnd(fn,startLoc,body.endLoc());
  }

  optimizeLastReturn(expr) {
    if (expr.type() === ExprType.returnExpr()) {
      return sys.ObjUtil.coerce(expr, Return.type$).expr();
    }
    ;
    if (expr.type() === ExprType.block()) {
      let block = sys.ObjUtil.coerce(expr, Block.type$);
      if (sys.ObjUtil.equals(block.exprs().last().type(), ExprType.returnExpr())) {
        return this.setStartEnd(Block.make(block.exprs().dup().set(-1, this.optimizeLastReturn(sys.ObjUtil.coerce(block.exprs().last(), Expr.type$)))), block.startLoc(), block.endLoc());
      }
      ;
    }
    ;
    return expr;
  }

  bindInnersToOuter(fn) {
    const this$ = this;
    this.#inners.each((inner) => {
      inner.outerRef().val(fn);
      return;
    });
    return;
  }

  err(msg,loc) {
    if (loc === undefined) loc = this.curLoc();
    return SyntaxErr.make(msg, loc);
  }

  curLoc() {
    return Loc.make(this.#startLoc.file(), sys.Int.plus(this.#startLoc.line(), this.#curLine), this.#nl - 1);
  }

  consumeId(expected) {
    if (sys.ObjUtil.compareNE(this.#cur, Token.id())) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected ", expected), ", not "), this.curToStr()));
    }
    ;
    let id = this.#curVal;
    this.consume();
    return sys.ObjUtil.coerce(id, sys.Str.type$);
  }

  consumeIdOrKeyword(expected) {
    if (this.#cur.keyword()) {
      let id = this.#cur.symbol();
      this.consume();
      return id;
    }
    ;
    return this.consumeId(expected);
  }

  consumeVal() {
    this.verify(Token.val());
    let val = this.#curVal;
    this.consume();
    return val;
  }

  verify(expected) {
    if (sys.ObjUtil.compareNE(this.#cur, expected)) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected ", expected), ", not "), this.curToStr()));
    }
    ;
    return;
  }

  curToStr() {
    if (this.#cur === Token.id()) {
      return sys.Str.plus(sys.Str.plus("identifier '", this.#curVal), "'");
    }
    ;
    if (this.#cur === Token.val()) {
      return sys.Str.plus("value ", haystack.Etc.toAxon(this.#curVal));
    }
    ;
    return this.#cur.toStr();
  }

  consume(expected) {
    if (expected === undefined) expected = null;
    if (expected != null) {
      this.verify(sys.ObjUtil.coerce(expected, Token.type$));
    }
    ;
    this.#nl = sys.ObjUtil.compareNE(this.#curLine, this.#peekLine);
    this.#cur = this.#peek;
    this.#curVal = this.#peekVal;
    this.#curValStart = this.#peekValStart;
    this.#curValEnd = this.#peekValEnd;
    this.#curLine = this.#peekLine;
    this.#peek = this.#peekPeek;
    this.#peekVal = this.#peekPeekVal;
    this.#peekValStart = this.#peekPeekValStart;
    this.#peekValEnd = this.#peekPeekValEnd;
    this.#peekLine = this.#peekPeekLine;
    this.#peekPeek = this.#tokenizer.next();
    this.#peekPeekVal = this.#tokenizer.val();
    this.#peekPeekValStart = this.#tokenizer.valStartLoc();
    this.#peekPeekValEnd = this.#tokenizer.valEndLoc();
    this.#peekPeekLine = this.#tokenizer.line();
    let blankLines = this.#peekValStart.line() - this.#curValEnd.line() - 1;
    let blanksStart = Loc.make(this.#curValEnd.file(), this.#curValEnd.line() + 1,this.#curValEnd.filePos() + 2)
    let blanksEnd = Loc.make(this.#curValEnd.file(), blanksStart.line() + blankLines - 1,blanksStart.filePos() + blankLines - 1)
    
    if ( this.#cur === Token.commentML() || this.#cur === Token.commentSL() ) {
      this.#comments.push( new Comment( this.#curVal, this.#curValStart, this.#curValEnd, this.#cur.name() ) )
      //console.log( "comment", this.#curValStart.line(), this.#curValStart.filePos(), this.#curValEnd.line(), this.#curValEnd.filePos() )
      return this.consume(null)
    }
    if ( blankLines > 0 && blanksStart.line() > 1)   {
       this.#comments.push( new Comment( "blank line", blanksStart, blanksEnd, "blanklines" ) )
       //console.log( "blank", blanksStart.line(), blanksStart.filePos(), blanksEnd.line(), blanksEnd.filePos() )
    }
    return;
  }

  static static$init() {
    Parser.#noArgs = sys.ObjUtil.coerce(((this$) => { let $_u153 = sys.ObjUtil.coerce(Expr.type$.emptyList(), sys.Type.find("axon::Expr[]")); if ($_u153 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(Expr.type$.emptyList(), sys.Type.find("axon::Expr[]"))); })(this), sys.Type.find("axon::Expr[]"));
    Parser.#noParams = sys.ObjUtil.coerce(((this$) => { let $_u154 = sys.ObjUtil.coerce(FnParam.type$.emptyList(), sys.Type.find("axon::FnParam[]")); if ($_u154 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(FnParam.type$.emptyList(), sys.Type.find("axon::FnParam[]"))); })(this), sys.Type.find("axon::FnParam[]"));
    return;
  }

}

class Token extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Token.type$; }

  static id() { return Token.vals().get(0); }

  static typename() { return Token.vals().get(1); }

  static val() { return Token.vals().get(2); }

  static colon() { return Token.vals().get(3); }

  static doubleColon() { return Token.vals().get(4); }

  static dot() { return Token.vals().get(5); }

  static semicolon() { return Token.vals().get(6); }

  static comma() { return Token.vals().get(7); }

  static plus() { return Token.vals().get(8); }

  static minus() { return Token.vals().get(9); }

  static star() { return Token.vals().get(10); }

  static slash() { return Token.vals().get(11); }

  static bang() { return Token.vals().get(12); }

  static caret() { return Token.vals().get(13); }

  static question() { return Token.vals().get(14); }

  static amp() { return Token.vals().get(15); }

  static assign() { return Token.vals().get(16); }

  static fnEq() { return Token.vals().get(17); }

  static eq() { return Token.vals().get(18); }

  static notEq() { return Token.vals().get(19); }

  static lt() { return Token.vals().get(20); }

  static ltEq() { return Token.vals().get(21); }

  static gt() { return Token.vals().get(22); }

  static gtEq() { return Token.vals().get(23); }

  static cmp() { return Token.vals().get(24); }

  static lbrace() { return Token.vals().get(25); }

  static rbrace() { return Token.vals().get(26); }

  static lparen() { return Token.vals().get(27); }

  static rparen() { return Token.vals().get(28); }

  static lbracket() { return Token.vals().get(29); }

  static rbracket() { return Token.vals().get(30); }

  static pipe() { return Token.vals().get(31); }

  static underbar() { return Token.vals().get(32); }

  static arrow() { return Token.vals().get(33); }

  static dotDot() { return Token.vals().get(34); }

  static andKeyword() { return Token.vals().get(35); }

  static catchKeyword() { return Token.vals().get(36); }

  static defcompKeyword() { return Token.vals().get(37); }

  static deflinksKeyword() { return Token.vals().get(38); }

  static doKeyword() { return Token.vals().get(39); }

  static elseKeyword() { return Token.vals().get(40); }

  static endKeyword() { return Token.vals().get(41); }

  static falseKeyword() { return Token.vals().get(42); }

  static ifKeyword() { return Token.vals().get(43); }

  static notKeyword() { return Token.vals().get(44); }

  static nullKeyword() { return Token.vals().get(45); }

  static orKeyword() { return Token.vals().get(46); }

  static returnKeyword() { return Token.vals().get(47); }

  static throwKeyword() { return Token.vals().get(48); }

  static trueKeyword() { return Token.vals().get(49); }

  static tryKeyword() { return Token.vals().get(50); }

  static eof() { return Token.vals().get(51); }

  static commentSL() { return Token.vals().get(52); }

  static commentML() { return Token.vals().get(53); }

  static #vals = undefined;

  static #keywords = undefined;

  static keywords() {
    if (Token.#keywords === undefined) {
      Token.static$init();
      if (Token.#keywords === undefined) Token.#keywords = null;
    }
    return Token.#keywords;
  }

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  #keyword = false;

  keyword() { return this.#keyword; }

  __keyword(it) { if (it === undefined) return this.#keyword; else this.#keyword = it; }

  static make($ordinal,$name,symbol) {
    const $self = new Token();
    Token.make$($self,$ordinal,$name,symbol);
    return $self;
  }

  static make$($self,$ordinal,$name,symbol) {
    if (symbol === undefined) symbol = null;
    sys.Enum.make$($self, $ordinal, $name);
    if (symbol == null) {
      if (!sys.Str.endsWith($self.name(), "Keyword")) {
        throw sys.Err.make($self.name());
      }
      ;
      $self.#symbol = sys.Str.getRange($self.name(), sys.Range.make(0, -8));
      $self.#keyword = true;
    }
    else {
      $self.#symbol = sys.ObjUtil.coerce(symbol, sys.Str.type$);
      $self.#keyword = false;
    }
    ;
    return;
  }

  toStr() {
    return this.#symbol;
  }

  static isKeyword(val) {
    return Token.keywords().get(val) != null;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Token.type$, Token.vals(), name$, checked);
  }

  static vals() {
    if (Token.#vals == null) {
      Token.#vals = sys.List.make(Token.type$, [
        Token.make(0, "id", "identifier"),
        Token.make(1, "typename", "typename"),
        Token.make(2, "val", "value"),
        Token.make(3, "colon", ":"),
        Token.make(4, "doubleColon", "::"),
        Token.make(5, "dot", "."),
        Token.make(6, "semicolon", ";"),
        Token.make(7, "comma", ","),
        Token.make(8, "plus", "+"),
        Token.make(9, "minus", "-"),
        Token.make(10, "star", "*"),
        Token.make(11, "slash", "/"),
        Token.make(12, "bang", "!"),
        Token.make(13, "caret", "^"),
        Token.make(14, "question", "?"),
        Token.make(15, "amp", "&"),
        Token.make(16, "assign", "="),
        Token.make(17, "fnEq", "=>"),
        Token.make(18, "eq", "=="),
        Token.make(19, "notEq", "!="),
        Token.make(20, "lt", "<"),
        Token.make(21, "ltEq", "<="),
        Token.make(22, "gt", ">"),
        Token.make(23, "gtEq", ">="),
        Token.make(24, "cmp", "<=>"),
        Token.make(25, "lbrace", "{"),
        Token.make(26, "rbrace", "}"),
        Token.make(27, "lparen", "("),
        Token.make(28, "rparen", ")"),
        Token.make(29, "lbracket", "["),
        Token.make(30, "rbracket", "]"),
        Token.make(31, "pipe", "|"),
        Token.make(32, "underbar", "_"),
        Token.make(33, "arrow", "->"),
        Token.make(34, "dotDot", ".."),
        Token.make(35, "andKeyword", ),
        Token.make(36, "catchKeyword", ),
        Token.make(37, "defcompKeyword", ),
        Token.make(38, "deflinksKeyword", ),
        Token.make(39, "doKeyword", ),
        Token.make(40, "elseKeyword", ),
        Token.make(41, "endKeyword", ),
        Token.make(42, "falseKeyword", ),
        Token.make(43, "ifKeyword", ),
        Token.make(44, "notKeyword", ),
        Token.make(45, "nullKeyword", ),
        Token.make(46, "orKeyword", ),
        Token.make(47, "returnKeyword", ),
        Token.make(48, "throwKeyword", ),
        Token.make(49, "trueKeyword", ),
        Token.make(50, "tryKeyword", ),
        Token.make(51, "eof", "eof"),
        Token.make(52, "commentSL", "commentSL"),
        Token.make(53, "commentML", "commentML"),
      ]).toImmutable();
    }
    return Token.#vals;
  }

  static static$init() {
    const $_u155 = Token.vals();
    if (true) {
    }
    ;
    if (true) {
      let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("axon::Token"));
      Token.#vals.each((tok) => {
        if (tok.#keyword) {
          map.set(tok.#symbol, tok);
        }
        ;
        return;
      });
      Token.#keywords = sys.ObjUtil.coerce(((this$) => { let $_u156 = map; if ($_u156 == null) return null; return sys.ObjUtil.toImmutable(map); })(this), sys.Type.find("[sys::Str:axon::Token]"));
    }
    ;
    return;
  }

}

class Collector extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Collector.type$; }

  onStart(stream) {
    return;
  }

  onSignal(signal) {
    return;
  }

  static make() {
    const $self = new Collector();
    Collector.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ListCollector extends Collector {
  constructor() {
    super();
    const this$ = this;
    this.#list = sys.List.make(sys.Obj.type$.toNullable());
    return;
  }

  typeof() { return ListCollector.type$; }

  #list = null;

  // private field reflection only
  __list(it) { if (it === undefined) return this.#list; else this.#list = it; }

  onData(data) {
    this.#list.add(data);
    return;
  }

  onFinish() {
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.#list), sys.Type.find("sys::Obj?[]"));
  }

  static make() {
    const $self = new ListCollector();
    ListCollector.make$($self);
    return $self;
  }

  static make$($self) {
    Collector.make$($self);
    ;
    return;
  }

}

class DictCollector extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DictCollector.type$; }

  #map = null;

  // private field reflection only
  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  #dict = null;

  // private field reflection only
  __dict(it) { if (it === undefined) return this.#dict; else this.#dict = it; }

  static make(dict) {
    const $self = new DictCollector();
    DictCollector.make$($self,dict);
    return $self;
  }

  static make$($self,dict) {
    if (dict === undefined) dict = null;
    $self.#dict = dict;
    return;
  }

  finish() {
    return sys.ObjUtil.coerce(((this$) => { if (this$.#dict != null) return this$.#dict; return haystack.Etc.makeDict(this$.#map); })(this), haystack.Dict.type$);
  }

  reset(x) {
    this.#map = null;
    this.#dict = x;
    return;
  }

  merge(m) {
    const this$ = this;
    this.initMap();
    m.each((v,n) => {
      this$.doSet(n, v);
      return;
    });
    return;
  }

  set(name,val) {
    this.initMap();
    this.doSet(name, val);
    return;
  }

  doSet(name,val) {
    if (val === haystack.Remove.val()) {
      this.#map.remove(name);
    }
    else {
      this.#map.set(name, val);
    }
    ;
    return;
  }

  initMap() {
    if (this.#dict != null) {
      this.#map = haystack.Etc.dictToMap(this.#dict);
      this.#dict = null;
    }
    else {
      if (this.#map == null) {
        this.#map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
      }
      ;
    }
    ;
    return;
  }

}

class GridCollector extends Collector {
  constructor() {
    super();
    const this$ = this;
    this.#meta = DictCollector.make();
    this.#colMeta = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("axon::DictCollector"));
    this.#cols = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:sys::Obj?]")), sys.Type.find("[sys::Str:sys::Str]"));
    this.#rows = sys.List.make(haystack.Dict.type$);
    return;
  }

  typeof() { return GridCollector.type$; }

  #meta = null;

  meta(it) {
    if (it === undefined) {
      return this.#meta;
    }
    else {
      this.#meta = it;
      return;
    }
  }

  #colMeta = null;

  // private field reflection only
  __colMeta(it) { if (it === undefined) return this.#colMeta; else this.#colMeta = it; }

  #cols = null;

  // private field reflection only
  __cols(it) { if (it === undefined) return this.#cols; else this.#cols = it; }

  #rows = null;

  // private field reflection only
  __rows(it) { if (it === undefined) return this.#rows; else this.#rows = it; }

  #removeCols = null;

  // private field reflection only
  __removeCols(it) { if (it === undefined) return this.#removeCols; else this.#removeCols = it; }

  #keepCols = null;

  // private field reflection only
  __keepCols(it) { if (it === undefined) return this.#keepCols; else this.#keepCols = it; }

  #keepColsOrdered = false;

  // private field reflection only
  __keepColsOrdered(it) { if (it === undefined) return this.#keepColsOrdered; else this.#keepColsOrdered = it; }

  onStart(stream) {
    const this$ = this;
    let srcStream = sys.ObjUtil.as(stream.source(), GridStream.type$);
    if (srcStream != null) {
      let src = srcStream.grid();
      this.#meta.reset(src.meta());
      src.cols().each((col) => {
        this$.#cols.set(col.name(), col.name());
        if (!col.meta().isEmpty()) {
          this$.#colMeta.set(col.name(), DictCollector.make(col.meta()));
        }
        ;
        return;
      });
    }
    ;
    return;
  }

  onData(data) {
    const this$ = this;
    let row = ((this$) => { let $_u158 = sys.ObjUtil.as(data, haystack.Dict.type$); if ($_u158 != null) return $_u158; return haystack.Etc.makeDict1("val", data); })(this);
    row.each((v,n) => {
      if (this$.#cols.get(n) == null) {
        this$.#cols.add(n, n);
      }
      ;
      return;
    });
    this.#rows.add(sys.ObjUtil.coerce(row, haystack.Dict.type$));
    return;
  }

  onSignal(signal) {
    let $_u159 = signal.type();
    if (sys.ObjUtil.equals($_u159, SignalType.setMeta())) {
      this.#meta.reset(sys.ObjUtil.coerce(signal.a(), haystack.Dict.type$));
    }
    else if (sys.ObjUtil.equals($_u159, SignalType.addMeta())) {
      this.#meta.merge(sys.ObjUtil.coerce(signal.a(), haystack.Dict.type$));
    }
    else if (sys.ObjUtil.equals($_u159, SignalType.setColMeta())) {
      this.toColMeta(sys.ObjUtil.coerce(signal.a(), sys.Str.type$)).reset(sys.ObjUtil.coerce(signal.b(), haystack.Dict.type$));
    }
    else if (sys.ObjUtil.equals($_u159, SignalType.addColMeta())) {
      this.toColMeta(sys.ObjUtil.coerce(signal.a(), sys.Str.type$)).merge(sys.ObjUtil.coerce(signal.b(), haystack.Dict.type$));
    }
    else if (sys.ObjUtil.equals($_u159, SignalType.removeCols())) {
      this.#removeCols = this.addColNames(this.#removeCols, sys.ObjUtil.coerce(signal.a(), sys.Type.find("sys::Str[]")));
    }
    else if (sys.ObjUtil.equals($_u159, SignalType.keepCols())) {
      this.#keepCols = this.addColNames(this.#keepCols, sys.ObjUtil.coerce(signal.a(), sys.Type.find("sys::Str[]")));
    }
    else if (sys.ObjUtil.equals($_u159, SignalType.reorderCols())) {
      this.#keepCols = this.addColNames(this.#keepCols, sys.ObjUtil.coerce(signal.a(), sys.Type.find("sys::Str[]")));
      this.#keepColsOrdered = true;
    }
    ;
    return;
  }

  toColMeta(name) {
    let c = this.#colMeta.get(name);
    if (c == null) {
      this.#colMeta.set(name, sys.ObjUtil.coerce((c = DictCollector.make()), DictCollector.type$));
    }
    ;
    return sys.ObjUtil.coerce(c, DictCollector.type$);
  }

  addColNames(cur,toAdd) {
    if (cur == null) {
      (cur = sys.List.make(sys.Str.type$));
    }
    ;
    return cur.addAll(toAdd);
  }

  onFinish() {
    const this$ = this;
    this.applyRemoveCols();
    this.applyKeepCols();
    let gb = haystack.GridBuilder.make();
    gb.setMeta(this.#meta.finish());
    this.#cols.each((n) => {
      gb.addCol(n, ((this$) => { let $_u160 = this$.#colMeta.get(n); if ($_u160 == null) return null; return this$.#colMeta.get(n).finish(); })(this$));
      return;
    });
    gb.capacity(this.#rows.size());
    gb.addDictRows(this.#rows);
    return gb.toGrid();
  }

  applyRemoveCols() {
    const this$ = this;
    if (this.#removeCols == null) {
      return;
    }
    ;
    this.#removeCols.each((n) => {
      this$.#cols.remove(n);
      return;
    });
    return;
  }

  applyKeepCols() {
    const this$ = this;
    if (this.#keepCols == null) {
      return;
    }
    ;
    let newCols = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    if (this.#keepColsOrdered) {
      this.#keepCols.each((n) => {
        if (this$.#cols.get(n) != null) {
          newCols.set(n, n);
        }
        ;
        return;
      });
    }
    else {
      let keepMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).setList(sys.ObjUtil.coerce(this.#keepCols, sys.Type.find("sys::Str[]")));
      this.#cols.each((n) => {
        if (keepMap.get(n) != null) {
          newCols.set(n, n);
        }
        ;
        return;
      });
    }
    ;
    this.#cols = newCols;
    return;
  }

  static make() {
    const $self = new GridCollector();
    GridCollector.make$($self);
    return $self;
  }

  static make$($self) {
    Collector.make$($self);
    ;
    return;
  }

}

class MStream extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MStream.type$; }

  #prev = null;

  prev() {
    return this.#prev;
  }

  #next = null;

  next() {
    return this.#next;
  }

  #cx = null;

  cx() {
    return this.#cx;
  }

  #complete = false;

  // private field reflection only
  __complete(it) { if (it === undefined) return this.#complete; else this.#complete = it; }

  static make(prev) {
    const $self = new MStream();
    MStream.make$($self,prev);
    return $self;
  }

  static make$($self,prev) {
    if (prev == null) {
      if (!$self.isSource()) {
        throw sys.Err.make(sys.Str.plus("Missing stream source: ", sys.ObjUtil.typeof($self)));
      }
      ;
      $self.#cx = sys.ObjUtil.coerce(AxonContext.curAxon(), AxonContext.type$);
    }
    else {
      if (prev.isTerminal()) {
        throw sys.Err.make(sys.Str.plus("Stream is terminated by: ", sys.ObjUtil.typeof(prev)));
      }
      ;
      $self.#cx = prev.#cx;
      $self.#prev = prev;
      prev.#next = $self;
    }
    ;
    return;
  }

  source() {
    let x = this;
    while (x.#prev != null) {
      (x = sys.ObjUtil.coerce(x.#prev, MStream.type$));
    }
    ;
    return x;
  }

  terminal() {
    let x = this;
    while (x.#next != null) {
      (x = sys.ObjUtil.coerce(x.#next, MStream.type$));
    }
    ;
    return x;
  }

  walk(f) {
    for (let x = this; x != null; (x = x.#prev)) {
      sys.Func.call(f, sys.ObjUtil.coerce(x, MStream.type$));
    }
    ;
    return;
  }

  isGridStage() {
    return false;
  }

  signalStart() {
    this.source().signal(Signal.start());
    return;
  }

  signalComplete() {
    this.source().signal(Signal.complete());
    return;
  }

  signal(signal) {
    for (let x = this; x != null; (x = x.#next)) {
      x.doSignal(signal);
    }
    ;
    return;
  }

  submit(data) {
    if (this.#complete) {
      throw sys.Err.make("submit to complete stream");
    }
    ;
    if (this.#next != null) {
      this.#next.onData(data);
    }
    ;
    return;
  }

  submitAll(dataList) {
    const this$ = this;
    dataList.eachWhile((data) => {
      this$.submit(data);
      return ((this$) => { if (this$.#complete) return "break"; return null; })(this$);
    });
    return;
  }

  isComplete() {
    return this.#complete;
  }

  onData(data) {
    return;
  }

  doSignal(sig) {
    if (sig.isComplete()) {
      this.#complete = true;
    }
    ;
    let $_u162 = sig.type();
    if (sys.ObjUtil.equals($_u162, SignalType.start())) {
      this.onStart(sig);
    }
    else if (sys.ObjUtil.equals($_u162, SignalType.complete())) {
      this.onComplete(sig);
    }
    ;
    this.onSignal(sig);
    return;
  }

  onStart(sig) {
    return;
  }

  onComplete(sig) {
    return;
  }

  onSignal(sig) {
    return;
  }

  funcArgs() {
    return sys.Obj.type$.emptyList();
  }

  encode() {
    const this$ = this;
    let argsPerStep = sys.List.make(sys.Type.find("sys::List"));
    let maxNumArgs = 0;
    let x = this;
    while (true) {
      let args = x.funcArgs();
      (maxNumArgs = sys.Int.max(maxNumArgs, args.size()));
      argsPerStep.add(args);
      if (x.#prev == null) {
        break;
      }
      ;
      (x = sys.ObjUtil.coerce(x.#prev, MStream.type$));
    }
    ;
    let gb = haystack.GridBuilder.make();
    gb.addCol("name");
    sys.Int.times(maxNumArgs, (i) => {
      gb.addCol(sys.Str.plus("arg", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())));
      return;
    });
    let n = sys.Int.minus(argsPerStep.size(), 1);
    while (true) {
      let row = sys.List.make(sys.Obj.type$.toNullable());
      row.size(gb.numCols());
      row.set(0, x.funcName());
      let args = argsPerStep.get(((this$) => { let $_u163 = n;n = sys.Int.decrement(n); return $_u163; })(this));
      args.each((arg,i) => {
        row.set(sys.Int.plus(i, 1), MStream.encodeArg(arg));
        return;
      });
      gb.addRow(row);
      if (x === this) {
        break;
      }
      ;
      (x = sys.ObjUtil.coerce(x.#next, MStream.type$));
    }
    ;
    return gb.toGrid();
  }

  static encodeArg(val) {
    if (sys.ObjUtil.is(val, Fn.type$)) {
      return haystack.XStr.make("Fn", sys.ObjUtil.toStr(val));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Filter.type$)) {
      return haystack.XStr.make("Filter", sys.ObjUtil.toStr(val));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Range.type$)) {
      return haystack.XStr.make("Range", sys.ObjUtil.toStr(val));
    }
    ;
    return val;
  }

  static decode(cx,grid) {
    const this$ = this;
    if (grid.isEmpty()) {
      throw sys.Err.make("Grid is empty");
    }
    ;
    let nameCol = grid.cols().get(0);
    let argsCols = grid.cols().getRange(sys.Range.make(1, -1));
    let stream = null;
    grid.each((row) => {
      let func = cx.findTop(sys.ObjUtil.coerce(row.val(nameCol), sys.Str.type$));
      let args = sys.List.make(sys.Obj.type$.toNullable());
      args.capacity(sys.Int.plus(1, argsCols.size()));
      if (stream != null) {
        args.add(MStream.streamToArg(sys.ObjUtil.coerce(func, TopFn.type$), sys.ObjUtil.coerce(stream, MStream.type$)));
      }
      ;
      argsCols.each((argCol) => {
        args.add(MStream.decodeArg(cx, row.val(argCol)));
        return;
      });
      (stream = sys.ObjUtil.coerce(func.call(cx, args), MStream.type$.toNullable()));
      return;
    });
    return sys.ObjUtil.coerce(stream, MStream.type$);
  }

  static streamToArg(fn,stream) {
    return ((this$) => { if (fn.isLazy()) return UnsafeLiteral.make(stream); return stream; })(this);
  }

  static decodeArg(cx,val) {
    let x = sys.ObjUtil.as(val, haystack.XStr.type$);
    if (x == null) {
      return val;
    }
    ;
    let $_u165 = x.type();
    if (sys.ObjUtil.equals($_u165, "Fn")) {
      return cx.evalToFunc(x.val());
    }
    else if (sys.ObjUtil.equals($_u165, "Filter")) {
      return FilterExpr.make(sys.ObjUtil.coerce(haystack.Filter.fromStr(x.val()), haystack.Filter.type$));
    }
    else if (sys.ObjUtil.equals($_u165, "Range")) {
      return haystack.ObjRange.fromIntRange(sys.ObjUtil.coerce(sys.Range.fromStr(x.val()), sys.Range.type$));
    }
    else {
      return val;
    }
    ;
  }

}

class SourceStream extends MStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SourceStream.type$; }

  static make() {
    const $self = new SourceStream();
    SourceStream.make$($self);
    return $self;
  }

  static make$($self) {
    MStream.make$($self, null);
    return;
  }

  isSource() {
    return true;
  }

  isTerminal() {
    return false;
  }

}

class GridStream extends SourceStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GridStream.type$; }

  #grid = null;

  grid(it) {
    if (it === undefined) {
      return this.#grid;
    }
    else {
      this.#grid = it;
      return;
    }
  }

  static make(grid) {
    const $self = new GridStream();
    GridStream.make$($self,grid);
    return $self;
  }

  static make$($self,grid) {
    SourceStream.make$($self);
    $self.#grid = grid;
    return;
  }

  isGridStage() {
    return true;
  }

  funcName() {
    return "stream";
  }

  funcArgs() {
    return sys.List.make(haystack.Grid.type$, [this.#grid]);
  }

  onStart(sig) {
    const this$ = this;
    this.#grid.eachWhile((row) => {
      this$.submit(row);
      return ((this$) => { if (this$.isComplete()) return "break"; return null; })(this$);
    });
    return;
  }

}

class GridColStream extends SourceStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GridColStream.type$; }

  #grid = null;

  grid(it) {
    if (it === undefined) {
      return this.#grid;
    }
    else {
      this.#grid = it;
      return;
    }
  }

  #col = null;

  col(it) {
    if (it === undefined) {
      return this.#col;
    }
    else {
      this.#col = it;
      return;
    }
  }

  static make(grid,col) {
    const $self = new GridColStream();
    GridColStream.make$($self,grid,col);
    return $self;
  }

  static make$($self,grid,col) {
    SourceStream.make$($self);
    $self.#grid = grid;
    $self.#col = col;
    return;
  }

  funcName() {
    return "streamCol";
  }

  funcArgs() {
    return sys.List.make(sys.Obj.type$, [this.#grid, this.#col.name()]);
  }

  onStart(sig) {
    const this$ = this;
    this.#grid.eachWhile((row) => {
      this$.submit(row.val(this$.#col));
      return ((this$) => { if (this$.isComplete()) return "break"; return null; })(this$);
    });
    return;
  }

}

class TransformStream extends MStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TransformStream.type$; }

  static make(prev) {
    const $self = new TransformStream();
    TransformStream.make$($self,prev);
    return $self;
  }

  static make$($self,prev) {
    MStream.make$($self, prev);
    return;
  }

  isSource() {
    return false;
  }

  isTerminal() {
    return false;
  }

}

class PassThruStream extends TransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PassThruStream.type$; }

  static make(prev) {
    const $self = new PassThruStream();
    PassThruStream.make$($self,prev);
    return $self;
  }

  static make$($self,prev) {
    TransformStream.make$($self, prev);
    return;
  }

  onData(data) {
    this.submit(data);
    return;
  }

}

class GridTransformStream extends PassThruStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GridTransformStream.type$; }

  static make(prev) {
    const $self = new GridTransformStream();
    GridTransformStream.make$($self,prev);
    return $self;
  }

  static make$($self,prev) {
    PassThruStream.make$($self, prev);
    return;
  }

  isGridStage() {
    return true;
  }

}

class SetMetaStream extends GridTransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SetMetaStream.type$; }

  #meta = null;

  // private field reflection only
  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  static make(prev,meta) {
    const $self = new SetMetaStream();
    SetMetaStream.make$($self,prev,meta);
    return $self;
  }

  static make$($self,prev,meta) {
    GridTransformStream.make$($self, prev);
    $self.#meta = meta;
    return;
  }

  funcName() {
    return "setMeta";
  }

  funcArgs() {
    return sys.List.make(haystack.Dict.type$, [this.#meta]);
  }

  onStart(s) {
    this.signal(Signal.make(SignalType.setMeta(), this.#meta));
    return;
  }

}

class AddMetaStream extends GridTransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AddMetaStream.type$; }

  #meta = null;

  // private field reflection only
  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  static make(prev,meta) {
    const $self = new AddMetaStream();
    AddMetaStream.make$($self,prev,meta);
    return $self;
  }

  static make$($self,prev,meta) {
    GridTransformStream.make$($self, prev);
    $self.#meta = meta;
    return;
  }

  funcName() {
    return "addMeta";
  }

  funcArgs() {
    return sys.List.make(haystack.Dict.type$, [this.#meta]);
  }

  onStart(s) {
    this.signal(Signal.make(SignalType.addMeta(), this.#meta));
    return;
  }

}

class SetColMetaStream extends GridTransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SetColMetaStream.type$; }

  #name = null;

  // private field reflection only
  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #meta = null;

  // private field reflection only
  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  static make(prev,name,meta) {
    const $self = new SetColMetaStream();
    SetColMetaStream.make$($self,prev,name,meta);
    return $self;
  }

  static make$($self,prev,name,meta) {
    GridTransformStream.make$($self, prev);
    $self.#name = name;
    $self.#meta = meta;
    return;
  }

  funcName() {
    return "setColMeta";
  }

  funcArgs() {
    return sys.List.make(sys.Obj.type$, [this.#name, this.#meta]);
  }

  onStart(s) {
    this.signal(Signal.make(SignalType.setColMeta(), this.#name, this.#meta));
    return;
  }

}

class AddColMetaStream extends GridTransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AddColMetaStream.type$; }

  #name = null;

  // private field reflection only
  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #meta = null;

  // private field reflection only
  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  static make(prev,name,meta) {
    const $self = new AddColMetaStream();
    AddColMetaStream.make$($self,prev,name,meta);
    return $self;
  }

  static make$($self,prev,name,meta) {
    GridTransformStream.make$($self, prev);
    $self.#name = name;
    $self.#meta = meta;
    return;
  }

  funcName() {
    return "addColMeta";
  }

  funcArgs() {
    return sys.List.make(sys.Obj.type$, [this.#name, this.#meta]);
  }

  onStart(s) {
    this.signal(Signal.make(SignalType.addColMeta(), this.#name, this.#meta));
    return;
  }

}

class ReorderColsStream extends GridTransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReorderColsStream.type$; }

  #cols = null;

  // private field reflection only
  __cols(it) { if (it === undefined) return this.#cols; else this.#cols = it; }

  static make(prev,cols) {
    const $self = new ReorderColsStream();
    ReorderColsStream.make$($self,prev,cols);
    return $self;
  }

  static make$($self,prev,cols) {
    GridTransformStream.make$($self, prev);
    $self.#cols = cols;
    return;
  }

  funcName() {
    return "reorderCols";
  }

  funcArgs() {
    return sys.List.make(sys.Type.find("sys::Str[]"), [this.#cols]);
  }

  onStart(s) {
    this.signal(Signal.make(SignalType.reorderCols(), this.#cols));
    return;
  }

}

class KeepColsStream extends GridTransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return KeepColsStream.type$; }

  #cols = null;

  // private field reflection only
  __cols(it) { if (it === undefined) return this.#cols; else this.#cols = it; }

  static make(prev,cols) {
    const $self = new KeepColsStream();
    KeepColsStream.make$($self,prev,cols);
    return $self;
  }

  static make$($self,prev,cols) {
    GridTransformStream.make$($self, prev);
    $self.#cols = sys.ObjUtil.coerce(((this$) => { let $_u168 = cols; if ($_u168 == null) return null; return sys.ObjUtil.toImmutable(cols); })($self), sys.Type.find("sys::Str[]"));
    return;
  }

  funcName() {
    return "keepCols";
  }

  funcArgs() {
    return sys.List.make(sys.Type.find("sys::Str[]"), [this.#cols]);
  }

  onStart(s) {
    this.signal(Signal.make(SignalType.keepCols(), this.#cols));
    return;
  }

}

class RemoveColsStream extends GridTransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RemoveColsStream.type$; }

  #cols = null;

  // private field reflection only
  __cols(it) { if (it === undefined) return this.#cols; else this.#cols = it; }

  static make(prev,cols) {
    const $self = new RemoveColsStream();
    RemoveColsStream.make$($self,prev,cols);
    return $self;
  }

  static make$($self,prev,cols) {
    GridTransformStream.make$($self, prev);
    $self.#cols = cols;
    return;
  }

  funcName() {
    return "removeCols";
  }

  funcArgs() {
    return sys.List.make(sys.Type.find("sys::Str[]"), [this.#cols]);
  }

  onStart(s) {
    this.signal(Signal.make(SignalType.removeCols(), this.#cols));
    return;
  }

}

class MapStream extends TransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MapStream.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  static make(prev,func) {
    const $self = new MapStream();
    MapStream.make$($self,prev,func);
    return $self;
  }

  static make$($self,prev,func) {
    TransformStream.make$($self, prev);
    $self.#func = func;
    return;
  }

  funcName() {
    return "map";
  }

  funcArgs() {
    return sys.List.make(Fn.type$, [this.#func]);
  }

  onData(data) {
    this.submit(this.#func.call(this.cx(), sys.List.make(sys.Obj.type$.toNullable(), [data])));
    return;
  }

}

class LimitStream extends TransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LimitStream.type$; }

  #limit = 0;

  // private field reflection only
  __limit(it) { if (it === undefined) return this.#limit; else this.#limit = it; }

  #count = 0;

  // private field reflection only
  __count(it) { if (it === undefined) return this.#count; else this.#count = it; }

  static make(prev,limit) {
    const $self = new LimitStream();
    LimitStream.make$($self,prev,limit);
    return $self;
  }

  static make$($self,prev,limit) {
    TransformStream.make$($self, prev);
    $self.#limit = limit;
    return;
  }

  funcName() {
    return "limit";
  }

  funcArgs() {
    return sys.List.make(haystack.Number.type$.toNullable(), [haystack.Number.makeInt(this.#limit)]);
  }

  onData(data) {
    ((this$) => { let $_u169 = this$.#count;this$.#count = sys.Int.increment(this$.#count); return $_u169; })(this);
    if (sys.ObjUtil.compareGT(this.#count, this.#limit)) {
      this.signalComplete();
    }
    else {
      this.submit(data);
    }
    ;
    return;
  }

}

class SkipStream extends TransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SkipStream.type$; }

  #count = 0;

  // private field reflection only
  __count(it) { if (it === undefined) return this.#count; else this.#count = it; }

  #seen = 0;

  // private field reflection only
  __seen(it) { if (it === undefined) return this.#seen; else this.#seen = it; }

  static make(prev,count) {
    const $self = new SkipStream();
    SkipStream.make$($self,prev,count);
    return $self;
  }

  static make$($self,prev,count) {
    TransformStream.make$($self, prev);
    $self.#count = count;
    return;
  }

  funcName() {
    return "skip";
  }

  funcArgs() {
    return sys.List.make(haystack.Number.type$.toNullable(), [haystack.Number.makeInt(this.#count)]);
  }

  onData(data) {
    if (sys.ObjUtil.compareGE(this.#seen, this.#count)) {
      this.submit(data);
    }
    ;
    ((this$) => { let $_u170 = this$.#seen;this$.#seen = sys.Int.increment(this$.#seen); return $_u170; })(this);
    return;
  }

}

class FlatMapStream extends TransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FlatMapStream.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  static make(prev,func) {
    const $self = new FlatMapStream();
    FlatMapStream.make$($self,prev,func);
    return $self;
  }

  static make$($self,prev,func) {
    TransformStream.make$($self, prev);
    $self.#func = func;
    return;
  }

  funcName() {
    return "flatMap";
  }

  funcArgs() {
    return sys.List.make(Fn.type$, [this.#func]);
  }

  onData(data) {
    let r = this.#func.call(this.cx(), sys.List.make(sys.Obj.type$.toNullable(), [data]));
    if (r == null) {
      return;
    }
    ;
    if (sys.ObjUtil.is(r, haystack.Grid.type$)) {
      (r = sys.ObjUtil.coerce(r, haystack.Grid.type$).toRows());
    }
    ;
    let list = ((this$) => { let $_u171 = sys.ObjUtil.as(r, sys.Type.find("sys::List")); if ($_u171 != null) return $_u171; throw sys.Err.make("flatMap must return list"); })(this);
    this.submitAll(sys.ObjUtil.coerce(list, sys.Type.find("sys::Obj?[]")));
    return;
  }

}

class FindAllStream extends TransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FindAllStream.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  static make(prev,func) {
    const $self = new FindAllStream();
    FindAllStream.make$($self,prev,func);
    return $self;
  }

  static make$($self,prev,func) {
    TransformStream.make$($self, prev);
    $self.#func = func;
    return;
  }

  funcName() {
    return "findAll";
  }

  funcArgs() {
    return sys.List.make(Fn.type$, [this.#func]);
  }

  onData(data) {
    if (sys.ObjUtil.coerce(this.#func.call(this.cx(), sys.List.make(sys.Obj.type$.toNullable(), [data])), sys.Bool.type$)) {
      this.submit(data);
    }
    ;
    return;
  }

}

class FilterStream extends TransformStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterStream.type$; }

  #filter = null;

  // private field reflection only
  __filter(it) { if (it === undefined) return this.#filter; else this.#filter = it; }

  static make(prev,filter) {
    const $self = new FilterStream();
    FilterStream.make$($self,prev,filter);
    return $self;
  }

  static make$($self,prev,filter) {
    TransformStream.make$($self, prev);
    $self.#filter = filter;
    return;
  }

  funcName() {
    return "filter";
  }

  funcArgs() {
    return sys.List.make(haystack.Filter.type$, [this.#filter]);
  }

  onData(data) {
    if (data == null) {
      return;
    }
    ;
    let dict = ((this$) => { let $_u172 = sys.ObjUtil.as(data, haystack.Dict.type$); if ($_u172 != null) return $_u172; throw sys.Err.make(sys.Str.plus(sys.Str.plus("filter data not Dict [", sys.ObjUtil.typeof(data)), "]")); })(this);
    if (this.#filter.matches(sys.ObjUtil.coerce(dict, haystack.Dict.type$), this.cx())) {
      this.submit(data);
    }
    ;
    return;
  }

}

class TerminalStream extends MStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TerminalStream.type$; }

  static make(prev) {
    const $self = new TerminalStream();
    TerminalStream.make$($self,prev);
    return $self;
  }

  static make$($self,prev) {
    MStream.make$($self, prev);
    return;
  }

  isSource() {
    return false;
  }

  isTerminal() {
    return true;
  }

  run() {
    this.onPreRun();
    this.signalStart();
    return this.onRun();
  }

  onPreRun() {
    return;
  }

}

class CollectStream extends TerminalStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CollectStream.type$; }

  #collector = null;

  // private field reflection only
  __collector(it) { if (it === undefined) return this.#collector; else this.#collector = it; }

  #to = null;

  // private field reflection only
  __to(it) { if (it === undefined) return this.#to; else this.#to = it; }

  static make(prev,to) {
    const $self = new CollectStream();
    CollectStream.make$($self,prev,to);
    return $self;
  }

  static make$($self,prev,to) {
    TerminalStream.make$($self, prev);
    $self.#to = to;
    return;
  }

  funcName() {
    return "collect";
  }

  funcArgs() {
    return ((this$) => { if (this$.#to == null) return TerminalStream.prototype.funcArgs.call(this$); return sys.List.make(Fn.type$.toNullable(), [this$.#to]); })(this);
  }

  onPreRun() {
    this.#collector = this.initCollector();
    this.#collector.onStart(this);
    return;
  }

  onSignal(signal) {
    this.#collector.onSignal(signal);
    return;
  }

  initCollector() {
    if (this.#to == null) {
      return ((this$) => { if (this$.inferToGrid()) return GridCollector.make(); return ListCollector.make(); })(this);
    }
    ;
    let $_u175 = this.#to.name();
    if (sys.ObjUtil.equals($_u175, "toGrid")) {
      return GridCollector.make();
    }
    else if (sys.ObjUtil.equals($_u175, "toList")) {
      return ListCollector.make();
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unsupported collect func: ", this.#to.name()));
    }
    ;
  }

  inferToGrid() {
    const this$ = this;
    let hasGridStage = false;
    this.walk((s) => {
      (hasGridStage = (hasGridStage || s.isGridStage()));
      return;
    });
    return hasGridStage;
  }

  onData(data) {
    this.#collector.onData(data);
    return;
  }

  onRun() {
    return this.#collector.onFinish();
  }

}

class EachStream extends TerminalStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EachStream.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  static make(prev,func) {
    const $self = new EachStream();
    EachStream.make$($self,prev,func);
    return $self;
  }

  static make$($self,prev,func) {
    TerminalStream.make$($self, prev);
    $self.#func = func;
    return;
  }

  funcName() {
    return "each";
  }

  funcArgs() {
    return sys.List.make(Fn.type$, [this.#func]);
  }

  onData(data) {
    this.#func.call(this.cx(), sys.List.make(sys.Obj.type$.toNullable(), [data]));
    return;
  }

  onRun() {
    return null;
  }

}

class EachWhileStream extends TerminalStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EachWhileStream.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  #result = null;

  // private field reflection only
  __result(it) { if (it === undefined) return this.#result; else this.#result = it; }

  static make(prev,func) {
    const $self = new EachWhileStream();
    EachWhileStream.make$($self,prev,func);
    return $self;
  }

  static make$($self,prev,func) {
    TerminalStream.make$($self, prev);
    $self.#func = func;
    return;
  }

  funcName() {
    return "eachWhile";
  }

  funcArgs() {
    return sys.List.make(Fn.type$, [this.#func]);
  }

  onData(data) {
    this.#result = this.#func.call(this.cx(), sys.List.make(sys.Obj.type$.toNullable(), [data]));
    if (this.#result != null) {
      this.signalComplete();
    }
    ;
    return;
  }

  onRun() {
    return this.#result;
  }

}

class FindStream extends TerminalStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FindStream.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  #result = null;

  // private field reflection only
  __result(it) { if (it === undefined) return this.#result; else this.#result = it; }

  static make(prev,func) {
    const $self = new FindStream();
    FindStream.make$($self,prev,func);
    return $self;
  }

  static make$($self,prev,func) {
    TerminalStream.make$($self, prev);
    $self.#func = func;
    return;
  }

  funcName() {
    return "find";
  }

  funcArgs() {
    return sys.List.make(Fn.type$, [this.#func]);
  }

  onData(data) {
    if (sys.ObjUtil.coerce(this.#func.call(this.cx(), sys.List.make(sys.Obj.type$.toNullable(), [data])), sys.Bool.type$)) {
      this.#result = data;
      this.signalComplete();
    }
    ;
    return;
  }

  onRun() {
    return this.#result;
  }

}

class ReduceStream extends TerminalStream {
  constructor() {
    super();
    const this$ = this;
    this.#args = sys.List.make(sys.Obj.type$.toNullable(), [null, null]);
    return;
  }

  typeof() { return ReduceStream.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  #args = null;

  // private field reflection only
  __args(it) { if (it === undefined) return this.#args; else this.#args = it; }

  #acc = null;

  // private field reflection only
  __acc(it) { if (it === undefined) return this.#acc; else this.#acc = it; }

  static make(prev,init,func) {
    const $self = new ReduceStream();
    ReduceStream.make$($self,prev,init,func);
    return $self;
  }

  static make$($self,prev,init,func) {
    TerminalStream.make$($self, prev);
    ;
    $self.#acc = init;
    $self.#func = func;
    return;
  }

  funcName() {
    return "reduce";
  }

  onData(data) {
    this.#acc = this.#func.call(this.cx(), this.#args.set(0, this.#acc).set(1, data));
    return;
  }

  onRun() {
    return this.#acc;
  }

}

class FoldStream extends TerminalStream {
  constructor() {
    super();
    const this$ = this;
    this.#args = sys.List.make(sys.Obj.type$.toNullable(), [null, null]);
    return;
  }

  typeof() { return FoldStream.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  #args = null;

  // private field reflection only
  __args(it) { if (it === undefined) return this.#args; else this.#args = it; }

  #acc = null;

  // private field reflection only
  __acc(it) { if (it === undefined) return this.#acc; else this.#acc = it; }

  static make(prev,func) {
    const $self = new FoldStream();
    FoldStream.make$($self,prev,func);
    return $self;
  }

  static make$($self,prev,func) {
    TerminalStream.make$($self, prev);
    ;
    $self.#func = func;
    return;
  }

  funcName() {
    return "fold";
  }

  onData(data) {
    this.#acc = this.#func.call(this.cx(), this.#args.set(0, data).set(1, this.#acc));
    if (sys.ObjUtil.equals(this.#acc, haystack.NA.val())) {
      this.signalComplete();
    }
    ;
    return;
  }

  onPreRun() {
    this.#acc = this.#func.call(this.cx(), this.#args.set(0, CoreLib.foldStart()).set(1, this.#acc));
    return;
  }

  onRun() {
    return this.#func.call(this.cx(), this.#args.set(0, CoreLib.foldEnd()).set(1, this.#acc));
  }

}

class FirstStream extends TerminalStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FirstStream.type$; }

  #result = null;

  result(it) {
    if (it === undefined) {
      return this.#result;
    }
    else {
      this.#result = it;
      return;
    }
  }

  static make(prev) {
    const $self = new FirstStream();
    FirstStream.make$($self,prev);
    return $self;
  }

  static make$($self,prev) {
    TerminalStream.make$($self, prev);
    return;
  }

  funcName() {
    return "first";
  }

  onRun() {
    return this.#result;
  }

  onData(data) {
    this.#result = data;
    this.signalComplete();
    return;
  }

}

class LastStream extends TerminalStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LastStream.type$; }

  #result = null;

  result(it) {
    if (it === undefined) {
      return this.#result;
    }
    else {
      this.#result = it;
      return;
    }
  }

  static make(prev) {
    const $self = new LastStream();
    LastStream.make$($self,prev);
    return $self;
  }

  static make$($self,prev) {
    TerminalStream.make$($self, prev);
    return;
  }

  funcName() {
    return "last";
  }

  onRun() {
    return this.#result;
  }

  onData(data) {
    this.#result = data;
    return;
  }

}

class AnyStream extends TerminalStream {
  constructor() {
    super();
    const this$ = this;
    this.#result = false;
    return;
  }

  typeof() { return AnyStream.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  #result = false;

  // private field reflection only
  __result(it) { if (it === undefined) return this.#result; else this.#result = it; }

  static make(prev,func) {
    const $self = new AnyStream();
    AnyStream.make$($self,prev,func);
    return $self;
  }

  static make$($self,prev,func) {
    TerminalStream.make$($self, prev);
    ;
    $self.#func = func;
    return;
  }

  funcName() {
    return "any";
  }

  funcArgs() {
    return sys.List.make(Fn.type$, [this.#func]);
  }

  onData(data) {
    if (sys.ObjUtil.coerce(this.#func.call(this.cx(), sys.List.make(sys.Obj.type$.toNullable(), [data])), sys.Bool.type$)) {
      this.#result = true;
      this.signalComplete();
    }
    ;
    return;
  }

  onRun() {
    return sys.ObjUtil.coerce(this.#result, sys.Obj.type$.toNullable());
  }

}

class AllStream extends TerminalStream {
  constructor() {
    super();
    const this$ = this;
    this.#result = true;
    return;
  }

  typeof() { return AllStream.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  #result = false;

  // private field reflection only
  __result(it) { if (it === undefined) return this.#result; else this.#result = it; }

  static make(prev,func) {
    const $self = new AllStream();
    AllStream.make$($self,prev,func);
    return $self;
  }

  static make$($self,prev,func) {
    TerminalStream.make$($self, prev);
    ;
    $self.#func = func;
    return;
  }

  funcName() {
    return "all";
  }

  funcArgs() {
    return sys.List.make(Fn.type$, [this.#func]);
  }

  onData(data) {
    if (!sys.ObjUtil.coerce(this.#func.call(this.cx(), sys.List.make(sys.Obj.type$.toNullable(), [data])), sys.Bool.type$)) {
      this.#result = false;
      this.signalComplete();
    }
    ;
    return;
  }

  onRun() {
    return sys.ObjUtil.coerce(this.#result, sys.Obj.type$.toNullable());
  }

}

class Signal extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Signal.type$; }

  static #start = undefined;

  static start() {
    if (Signal.#start === undefined) {
      Signal.static$init();
      if (Signal.#start === undefined) Signal.#start = null;
    }
    return Signal.#start;
  }

  static #complete = undefined;

  static complete() {
    if (Signal.#complete === undefined) {
      Signal.static$init();
      if (Signal.#complete === undefined) Signal.#complete = null;
    }
    return Signal.#complete;
  }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #a = null;

  a() { return this.#a; }

  __a(it) { if (it === undefined) return this.#a; else this.#a = it; }

  #b = null;

  b() { return this.#b; }

  __b(it) { if (it === undefined) return this.#b; else this.#b = it; }

  static make(type,a,b) {
    const $self = new Signal();
    Signal.make$($self,type,a,b);
    return $self;
  }

  static make$($self,type,a,b) {
    if (a === undefined) a = null;
    if (b === undefined) b = null;
    $self.#type = type;
    $self.#a = ((this$) => { let $_u176 = a; if ($_u176 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u177 = b; if ($_u177 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    return;
  }

  isComplete() {
    return this.#type.isComplete();
  }

  toStr() {
    return concurrent.ActorMsg.toDebugStr("Signal", this.#type, this.#a, this.#b);
  }

  static static$init() {
    Signal.#start = Signal.make(SignalType.start());
    Signal.#complete = Signal.make(SignalType.complete());
    return;
  }

}

class SignalType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SignalType.type$; }

  static start() { return SignalType.vals().get(0); }

  static err() { return SignalType.vals().get(1); }

  static complete() { return SignalType.vals().get(2); }

  static setMeta() { return SignalType.vals().get(3); }

  static addMeta() { return SignalType.vals().get(4); }

  static setColMeta() { return SignalType.vals().get(5); }

  static addColMeta() { return SignalType.vals().get(6); }

  static reorderCols() { return SignalType.vals().get(7); }

  static keepCols() { return SignalType.vals().get(8); }

  static removeCols() { return SignalType.vals().get(9); }

  static #vals = undefined;

  #isComplete = false;

  isComplete() { return this.#isComplete; }

  __isComplete(it) { if (it === undefined) return this.#isComplete; else this.#isComplete = it; }

  static make($ordinal,$name,isComplete) {
    const $self = new SignalType();
    SignalType.make$($self,$ordinal,$name,isComplete);
    return $self;
  }

  static make$($self,$ordinal,$name,isComplete) {
    if (isComplete === undefined) isComplete = false;
    sys.Enum.make$($self, $ordinal, $name);
    $self.#isComplete = isComplete;
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(SignalType.type$, SignalType.vals(), name$, checked);
  }

  static vals() {
    if (SignalType.#vals == null) {
      SignalType.#vals = sys.List.make(SignalType.type$, [
        SignalType.make(0, "start", ),
        SignalType.make(1, "err", true),
        SignalType.make(2, "complete", true),
        SignalType.make(3, "setMeta", ),
        SignalType.make(4, "addMeta", ),
        SignalType.make(5, "setColMeta", ),
        SignalType.make(6, "addColMeta", ),
        SignalType.make(7, "reorderCols", ),
        SignalType.make(8, "keepCols", ),
        SignalType.make(9, "removeCols", ),
      ]).toImmutable();
    }
    return SignalType.#vals;
  }

  static static$init() {
    const $_u178 = SignalType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class RangeStream extends SourceStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RangeStream.type$; }

  #range = null;

  // private field reflection only
  __range(it) { if (it === undefined) return this.#range; else this.#range = it; }

  static make(range) {
    const $self = new RangeStream();
    RangeStream.make$($self,range);
    return $self;
  }

  static make$($self,range) {
    SourceStream.make$($self);
    $self.#range = range;
    return;
  }

  funcName() {
    return "stream";
  }

  funcArgs() {
    return sys.List.make(sys.Range.type$, [this.#range]);
  }

  onStart(sig) {
    const this$ = this;
    this.#range.eachWhile((i) => {
      this$.submit(haystack.Number.makeInt(i));
      return ((this$) => { if (this$.isComplete()) return "break"; return null; })(this$);
    });
    return;
  }

}

class ListStream extends SourceStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ListStream.type$; }

  #list = null;

  // private field reflection only
  __list(it) { if (it === undefined) return this.#list; else this.#list = it; }

  static make(list) {
    const $self = new ListStream();
    ListStream.make$($self,list);
    return $self;
  }

  static make$($self,list) {
    SourceStream.make$($self);
    $self.#list = list;
    return;
  }

  funcName() {
    return "stream";
  }

  funcArgs() {
    return sys.List.make(sys.Type.find("sys::Obj?[]"), [this.#list]);
  }

  onStart(sig) {
    this.submitAll(this.#list);
    return;
  }

}

const p = sys.Pod.add$('axon');
const xp = sys.Param.noParams$();
let m;
AxonContext.type$ = p.at$('AxonContext','sys::Obj',['haystack::HaystackContext'],{'sys::Js':""},8193,AxonContext);
CallFrame.type$ = p.at$('CallFrame','sys::Obj',[],{'sys::Js':""},128,CallFrame);
AxonErr.type$ = p.at$('AxonErr','sys::Err',[],{'sys::Js':""},8195,AxonErr);
SyntaxErr.type$ = p.at$('SyntaxErr','axon::AxonErr',[],{'sys::Js':""},8194,SyntaxErr);
EvalErr.type$ = p.at$('EvalErr','axon::AxonErr',[],{'sys::Js':""},8194,EvalErr);
EvalTimeoutErr.type$ = p.at$('EvalTimeoutErr','axon::EvalErr',[],{'sys::Js':"",'sys::NoDoc':""},8194,EvalTimeoutErr);
ThrowErr.type$ = p.at$('ThrowErr','axon::EvalErr',[],{'sys::Js':"",'sys::NoDoc':""},8194,ThrowErr);
Axon.type$ = p.at$('Axon','sys::Obj',['sys::Facet','haystack::Define'],{'sys::Js':"",'sys::Serializable':""},8242,Axon);
Comp.type$ = p.am$('Comp','sys::Obj',[],{'sys::Js':""},8449,Comp);
Expr.type$ = p.at$('Expr','sys::Obj',[],{'sys::Js':""},8195,Expr);
Call.type$ = p.at$('Call','axon::Expr',[],{'sys::Js':""},130,Call);
DotCall.type$ = p.at$('DotCall','axon::Call',[],{'sys::Js':""},130,DotCall);
StaticCall.type$ = p.at$('StaticCall','axon::Call',[],{'sys::Js':""},130,StaticCall);
TrapCall.type$ = p.at$('TrapCall','axon::DotCall',[],{'sys::Js':""},130,TrapCall);
PartialCall.type$ = p.at$('PartialCall','axon::Call',[],{'sys::Js':""},130,PartialCall);
Fn.type$ = p.at$('Fn','axon::Expr',['haystack::HaystackFunc'],{'sys::Js':""},8194,Fn);
TopFn.type$ = p.at$('TopFn','axon::Fn',[],{'sys::Js':""},8194,TopFn);
FnParam.type$ = p.at$('FnParam','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8194,FnParam);
ReturnErr.type$ = p.at$('ReturnErr','sys::Err',[],{'sys::Js':""},130,ReturnErr);
UnaryOp.type$ = p.at$('UnaryOp','axon::Expr',[],{'sys::Js':""},131,UnaryOp);
BinaryOp.type$ = p.at$('BinaryOp','axon::Expr',[],{'sys::Js':""},131,BinaryOp);
Return.type$ = p.at$('Return','axon::Expr',[],{'sys::Js':""},130,Return);
Throw.type$ = p.at$('Throw','axon::Expr',[],{'sys::Js':""},130,Throw);
TryCatch.type$ = p.at$('TryCatch','axon::Expr',[],{'sys::Js':""},130,TryCatch);
If.type$ = p.at$('If','axon::Expr',[],{'sys::Js':""},130,If);
Assign.type$ = p.at$('Assign','axon::BinaryOp',[],{'sys::Js':""},130,Assign);
Not.type$ = p.at$('Not','axon::UnaryOp',[],{'sys::Js':""},130,Not);
And.type$ = p.at$('And','axon::BinaryOp',[],{'sys::Js':""},130,And);
Or.type$ = p.at$('Or','axon::BinaryOp',[],{'sys::Js':""},130,Or);
Eq.type$ = p.at$('Eq','axon::BinaryOp',[],{'sys::Js':""},130,Eq);
Ne.type$ = p.at$('Ne','axon::Eq',[],{'sys::Js':""},130,Ne);
Compare.type$ = p.at$('Compare','axon::BinaryOp',[],{'sys::Js':""},131,Compare);
Lt.type$ = p.at$('Lt','axon::Compare',[],{'sys::Js':""},130,Lt);
Le.type$ = p.at$('Le','axon::Compare',[],{'sys::Js':""},130,Le);
Ge.type$ = p.at$('Ge','axon::Compare',[],{'sys::Js':""},130,Ge);
Gt.type$ = p.at$('Gt','axon::Compare',[],{'sys::Js':""},130,Gt);
Cmp.type$ = p.at$('Cmp','axon::Compare',[],{'sys::Js':""},130,Cmp);
Neg.type$ = p.at$('Neg','axon::UnaryOp',[],{'sys::Js':""},130,Neg);
BinaryMath.type$ = p.at$('BinaryMath','axon::BinaryOp',[],{'sys::Js':""},131,BinaryMath);
Add.type$ = p.at$('Add','axon::BinaryMath',[],{'sys::Js':""},130,Add);
Sub.type$ = p.at$('Sub','axon::BinaryMath',[],{'sys::Js':""},130,Sub);
Mul.type$ = p.at$('Mul','axon::BinaryMath',[],{'sys::Js':""},130,Mul);
Div.type$ = p.at$('Div','axon::BinaryMath',[],{'sys::Js':""},130,Div);
DefineVar.type$ = p.at$('DefineVar','axon::Expr',[],{'sys::Js':""},130,DefineVar);
Block.type$ = p.at$('Block','axon::Expr',[],{'sys::Js':""},130,Block);
Loc.type$ = p.at$('Loc','sys::Obj',[],{'sys::Js':""},8194,Loc);
Printer.type$ = p.at$('Printer','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,Printer);
Literal.type$ = p.at$('Literal','axon::Expr',[],{'sys::NoDoc':"",'sys::Js':""},8194,Literal);
UnsafeLiteral.type$ = p.at$('UnsafeLiteral','axon::Literal',[],{'sys::Js':""},130,UnsafeLiteral);
FilterExpr.type$ = p.at$('FilterExpr','axon::Expr',[],{'sys::Js':""},130,FilterExpr);
ListExpr.type$ = p.at$('ListExpr','axon::Expr',[],{'sys::Js':""},130,ListExpr);
DictExpr.type$ = p.at$('DictExpr','axon::Expr',[],{'sys::Js':""},130,DictExpr);
RangeExpr.type$ = p.at$('RangeExpr','axon::Expr',[],{'sys::Js':""},130,RangeExpr);
CellDef.type$ = p.am$('CellDef','sys::Obj',['haystack::Dict'],{'sys::Js':""},8451,CellDef);
Var.type$ = p.at$('Var','axon::Expr',[],{'sys::Js':""},130,Var);
TypeRef.type$ = p.at$('TypeRef','axon::Expr',[],{'sys::Js':""},130,TypeRef);
CompDef.type$ = p.at$('CompDef','axon::TopFn',[],{'sys::Js':""},8195,CompDef);
ExprType.type$ = p.at$('ExprType','sys::Enum',[],{'sys::NoDoc':"",'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,ExprType);
MComp.type$ = p.at$('MComp','sys::Obj',['axon::Comp'],{'sys::Js':""},128,MComp);
MCompDef.type$ = p.at$('MCompDef','axon::CompDef',[],{'sys::Js':""},130,MCompDef);
MCell.type$ = p.at$('MCell','sys::Obj',[],{'sys::Js':""},128,MCell);
MCellDef.type$ = p.at$('MCellDef','haystack::WrapDict',['axon::CellDef'],{'sys::Js':""},130,MCellDef);
Cell.type$ = p.at$('Cell','sys::Obj',['sys::Facet','haystack::Define'],{'sys::Js':"",'sys::Serializable':""},8242,Cell);
FCellDef.type$ = p.at$('FCellDef','haystack::WrapDict',['axon::CellDef'],{'sys::Js':""},130,FCellDef);
AbstractComp.type$ = p.at$('AbstractComp','sys::Obj',['axon::Comp'],{'sys::Js':""},8193,AbstractComp);
FCompDef.type$ = p.at$('FCompDef','axon::CompDef',[],{'sys::Js':""},130,FCompDef);
CoreLibUtil.type$ = p.at$('CoreLibUtil','sys::Obj',[],{'sys::Js':""},130,CoreLibUtil);
TagNameUsage.type$ = p.at$('TagNameUsage','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,TagNameUsage);
CoreLib.type$ = p.at$('CoreLib','sys::Obj',[],{'sys::Js':""},8194,CoreLib);
FantomFn.type$ = p.at$('FantomFn','axon::TopFn',[],{'sys::Js':"",'sys::NoDoc':""},8194,FantomFn);
LazyFantomFn.type$ = p.at$('LazyFantomFn','axon::FantomFn',[],{'sys::Js':"",'sys::NoDoc':""},130,LazyFantomFn);
FantomClosureFn.type$ = p.at$('FantomClosureFn','axon::Fn',[],{'sys::NoDoc':""},8194,FantomClosureFn);
FilterFn.type$ = p.at$('FilterFn','axon::Fn',[],{'sys::Js':""},130,FilterFn);
Tokenizer.type$ = p.at$('Tokenizer','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,Tokenizer);
ExprToFilter.type$ = p.at$('ExprToFilter','sys::Obj',[],{'sys::Js':""},128,ExprToFilter);
NotFilterErr.type$ = p.at$('NotFilterErr','sys::Err',[],{'sys::Js':""},130,NotFilterErr);
Parser.type$ = p.at$('Parser','sys::Obj',[],{'sys::Js':"",'sys::NoDoc':""},8192,Parser);
Token.type$ = p.at$('Token','sys::Enum',[],{'sys::NoDoc':"",'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,Token);
Collector.type$ = p.at$('Collector','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8193,Collector);
ListCollector.type$ = p.at$('ListCollector','axon::Collector',[],{'sys::NoDoc':"",'sys::Js':""},8192,ListCollector);
DictCollector.type$ = p.at$('DictCollector','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,DictCollector);
GridCollector.type$ = p.at$('GridCollector','axon::Collector',[],{'sys::NoDoc':"",'sys::Js':""},8192,GridCollector);
MStream.type$ = p.at$('MStream','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8193,MStream);
SourceStream.type$ = p.at$('SourceStream','axon::MStream',[],{'sys::NoDoc':"",'sys::Js':""},8193,SourceStream);
GridStream.type$ = p.at$('GridStream','axon::SourceStream',[],{'sys::Js':""},128,GridStream);
GridColStream.type$ = p.at$('GridColStream','axon::SourceStream',[],{'sys::Js':""},128,GridColStream);
TransformStream.type$ = p.at$('TransformStream','axon::MStream',[],{'sys::NoDoc':"",'sys::Js':""},8193,TransformStream);
PassThruStream.type$ = p.at$('PassThruStream','axon::TransformStream',[],{'sys::NoDoc':"",'sys::Js':""},8193,PassThruStream);
GridTransformStream.type$ = p.at$('GridTransformStream','axon::PassThruStream',[],{'sys::Js':""},129,GridTransformStream);
SetMetaStream.type$ = p.at$('SetMetaStream','axon::GridTransformStream',[],{'sys::Js':""},128,SetMetaStream);
AddMetaStream.type$ = p.at$('AddMetaStream','axon::GridTransformStream',[],{'sys::Js':""},128,AddMetaStream);
SetColMetaStream.type$ = p.at$('SetColMetaStream','axon::GridTransformStream',[],{'sys::Js':""},128,SetColMetaStream);
AddColMetaStream.type$ = p.at$('AddColMetaStream','axon::GridTransformStream',[],{'sys::Js':""},128,AddColMetaStream);
ReorderColsStream.type$ = p.at$('ReorderColsStream','axon::GridTransformStream',[],{'sys::Js':""},128,ReorderColsStream);
KeepColsStream.type$ = p.at$('KeepColsStream','axon::GridTransformStream',[],{'sys::Js':""},128,KeepColsStream);
RemoveColsStream.type$ = p.at$('RemoveColsStream','axon::GridTransformStream',[],{'sys::Js':""},128,RemoveColsStream);
MapStream.type$ = p.at$('MapStream','axon::TransformStream',[],{'sys::Js':""},128,MapStream);
LimitStream.type$ = p.at$('LimitStream','axon::TransformStream',[],{'sys::Js':""},128,LimitStream);
SkipStream.type$ = p.at$('SkipStream','axon::TransformStream',[],{'sys::Js':""},128,SkipStream);
FlatMapStream.type$ = p.at$('FlatMapStream','axon::TransformStream',[],{'sys::Js':""},128,FlatMapStream);
FindAllStream.type$ = p.at$('FindAllStream','axon::TransformStream',[],{'sys::Js':""},128,FindAllStream);
FilterStream.type$ = p.at$('FilterStream','axon::TransformStream',[],{'sys::Js':""},128,FilterStream);
TerminalStream.type$ = p.at$('TerminalStream','axon::MStream',[],{'sys::NoDoc':"",'sys::Js':""},8193,TerminalStream);
CollectStream.type$ = p.at$('CollectStream','axon::TerminalStream',[],{'sys::Js':""},128,CollectStream);
EachStream.type$ = p.at$('EachStream','axon::TerminalStream',[],{'sys::Js':""},128,EachStream);
EachWhileStream.type$ = p.at$('EachWhileStream','axon::TerminalStream',[],{'sys::Js':""},128,EachWhileStream);
FindStream.type$ = p.at$('FindStream','axon::TerminalStream',[],{'sys::Js':""},128,FindStream);
ReduceStream.type$ = p.at$('ReduceStream','axon::TerminalStream',[],{'sys::Js':""},128,ReduceStream);
FoldStream.type$ = p.at$('FoldStream','axon::TerminalStream',[],{'sys::Js':""},128,FoldStream);
FirstStream.type$ = p.at$('FirstStream','axon::TerminalStream',[],{'sys::Js':""},128,FirstStream);
LastStream.type$ = p.at$('LastStream','axon::TerminalStream',[],{'sys::Js':""},128,LastStream);
AnyStream.type$ = p.at$('AnyStream','axon::TerminalStream',[],{'sys::Js':""},128,AnyStream);
AllStream.type$ = p.at$('AllStream','axon::TerminalStream',[],{'sys::Js':""},128,AllStream);
Signal.type$ = p.at$('Signal','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8194,Signal);
SignalType.type$ = p.at$('SignalType','sys::Enum',[],{'sys::NoDoc':"",'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,SignalType);
RangeStream.type$ = p.at$('RangeStream','axon::SourceStream',[],{'sys::Js':""},128,RangeStream);
ListStream.type$ = p.at$('ListStream','axon::SourceStream',[],{'sys::Js':""},128,ListStream);
AxonContext.type$.af$('timeout',73728,'sys::Duration?',{'sys::NoDoc':""}).af$('timeoutDef',106498,'sys::Duration',{'sys::NoDoc':""}).af$('stashRef',67584,'[sys::Str:sys::Obj?]',{}).af$('heartbeatFunc',73728,'sys::Func?',{'sys::NoDoc':""}).af$('timeoutTicks',67584,'sys::Int',{}).af$('stack',67584,'axon::CallFrame[]',{}).af$('regex',67584,'[sys::Str:sys::Regex]?',{}).af$('xetoIsSpecCache',67584,'[sys::Str:xeto::Spec]?',{}).af$('toDictExtra',67584,'[sys::Str:sys::Obj]?',{}).am$('curAxon',40962,'axon::AxonContext?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('make',8196,'sys::Void',xp,{'sys::NoDoc':""}).am$('ns',270337,'haystack::Namespace',xp,{}).am$('xeto',270336,'xeto::LibNamespace',xp,{}).am$('findTop',270337,'axon::Fn?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('trapRef',270336,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('xqReadById',270336,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('toDateSpanDef',270336,'haystack::DateSpan',xp,{'sys::NoDoc':""}).am$('evalOrReadAll',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false)]),{'sys::NoDoc':""}).am$('parse',8192,'axon::Expr',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('loc','axon::Loc',true)]),{}).am$('call',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('funcName','sys::Str',false),new sys.Param('args','sys::Obj?[]',false)]),{}).am$('evalToFunc',8192,'axon::Fn',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false)]),{}).am$('eval',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('loc','axon::Loc',true)]),{}).am$('evalExpr',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false)]),{}).am$('xetoIsSpec',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('specName','sys::Str',false),new sys.Param('rec','xeto::Dict',false)]),{'sys::NoDoc':""}).am$('toDict',271360,'haystack::Dict',xp,{'sys::NoDoc':""}).am$('toDictSet',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'sys::NoDoc':""}).am$('heartbeat',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','axon::Loc',false)]),{'sys::NoDoc':""}).am$('curFunc',8192,'axon::Fn?',xp,{'sys::NoDoc':""}).am$('callInNewFrame',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('func','axon::Fn',false),new sys.Param('args','sys::Obj?[]',false),new sys.Param('callLoc','axon::Loc',false),new sys.Param('vars','[sys::Str:sys::Obj?]',true)]),{'sys::NoDoc':""}).am$('checkCall',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('func','axon::Fn',false)]),{'sys::NoDoc':""}).am$('defOrAssign',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false),new sys.Param('loc','axon::Loc',false)]),{'sys::NoDoc':""}).am$('def',128,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false),new sys.Param('loc','axon::Loc',false)]),{}).am$('curFrame',128,'axon::CallFrame',xp,{}).am$('resolve',128,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('loc','axon::Loc',false)]),{}).am$('getVar',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{'sys::NoDoc':""}).am$('assign',128,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false),new sys.Param('loc','axon::Loc',false)]),{}).am$('varsInScope',8192,'[sys::Str:sys::Obj?]',xp,{'sys::NoDoc':""}).am$('varFrame',2048,'axon::CallFrame?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('scopeCurFunc',2048,'axon::Fn',xp,{}).am$('traceToStr',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('errLoc','axon::Loc',false),new sys.Param('opts','haystack::Dict?',true)]),{'sys::NoDoc':""}).am$('traceToGrid',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('errLoc','axon::Loc',false),new sys.Param('opts','haystack::Dict?',true)]),{'sys::NoDoc':""}).am$('trace',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('errLoc','axon::Loc',false),new sys.Param('out','sys::OutStream',true),new sys.Param('opts','haystack::Dict?',true)]),{'sys::NoDoc':""}).am$('traceWalk',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('errLoc','axon::Loc',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|sys::Str,axon::Loc,haystack::Dict->sys::Void|',false)]),{'sys::NoDoc':""}).am$('stash',8192,'[sys::Str:sys::Obj?]',xp,{}).am$('toRegex',128,'sys::Regex',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Obj',false)]),{}).am$('clone',270336,'sys::This',xp,{'sys::NoDoc':""}).am$('doClone',4096,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('that','axon::AxonContext',false)]),{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
CallFrame.type$.af$('rootFunc',100354,'axon::Fn',{}).af$('nullVal',100354,'sys::Str',{}).af$('cx',73728,'axon::AxonContext',{}).af$('callLoc',73730,'axon::Loc',{}).af$('func',73730,'axon::Fn',{}).af$('vars',67584,'[sys::Str:sys::Obj?]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('func','axon::Fn',false),new sys.Param('args','sys::Obj?[]',false),new sys.Param('callLoc','axon::Loc',false),new sys.Param('vars','[sys::Str:sys::Obj?]',false)]),{}).am$('makeRoot',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('has',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj?,sys::Str->sys::Void|',false)]),{}).am$('toDict',8192,'haystack::Dict',xp,{}).am$('get',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('set',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('remove',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('isVisibleTo',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('f','axon::Fn?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
AxonErr.type$.af$('loc',73730,'axon::Loc',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str?',false),new sys.Param('loc','axon::Loc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{});
SyntaxErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str?',false),new sys.Param('loc','axon::Loc',false),new sys.Param('cause','sys::Err?',true)]),{});
EvalErr.type$.af$('axonTrace',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str?',false),new sys.Param('cx','axon::AxonContext',false),new sys.Param('loc','axon::Loc',false),new sys.Param('cause','sys::Err?',true)]),{});
EvalTimeoutErr.type$.af$('meta',73730,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration',false),new sys.Param('cx','axon::AxonContext',false),new sys.Param('loc','axon::Loc',false)]),{});
ThrowErr.type$.af$('tags',73730,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('loc','axon::Loc',false),new sys.Param('tags','haystack::Dict',false)]),{});
Axon.type$.af$('su',73730,'sys::Bool',{}).af$('admin',73730,'sys::Bool',{}).af$('meta',73730,'sys::Obj?',{}).am$('decode',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj->sys::Void|',false)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|axon::Axon->sys::Void|?',true)]),{});
Comp.type$.am$('def',270337,'axon::CompDef',xp,{}).am$('get',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{'sys::Operator':""}).am$('set',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'sys::Operator':""}).am$('getCell',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cd','axon::CellDef',false)]),{}).am$('setCell',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cd','axon::CellDef',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('recompute',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('cellVals',270337,'sys::Obj?[]',xp,{'sys::NoDoc':""}).am$('dump',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{'sys::NoDoc':""});
Expr.type$.am$('type',270337,'axon::ExprType',xp,{'sys::NoDoc':""}).am$('loc',270337,'axon::Loc',xp,{}).am$('eval',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('encode',8192,'haystack::Dict',xp,{}).am$('encodeNorm',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj?',false)]),{}).am$('walk',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{'sys::NoDoc':""}).am$('print',270337,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{'sys::NoDoc':""}).am$('toStr',271360,'sys::Str',xp,{}).am$('evalToFunc',8192,'axon::Fn',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{'sys::NoDoc':""}).am$('evalToFilter',8192,'haystack::Filter?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('summary',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{'sys::NoDoc':""}).am$('err',8192,'axon::EvalErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cx','axon::AxonContext',false)]),{'sys::NoDoc':""}).am$('foldConst',270336,'axon::Expr',xp,{'sys::NoDoc':""}).am$('isConst',270336,'sys::Bool',xp,{'sys::NoDoc':""}).am$('constVal',270336,'sys::Obj?',xp,{'sys::NoDoc':""}).am$('isNull',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isMarker',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('asCallFuncName',8192,'sys::Str?',xp,{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{});
Call.type$.af$('func',73730,'axon::Expr',{}).af$('args',73730,'axon::Expr?[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('func','axon::Expr',false),new sys.Param('args','axon::Expr?[]',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('loc',271360,'axon::Loc',xp,{}).am$('funcName',270336,'sys::Str?',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalFunc',8192,'axon::Fn',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalArgs',8192,'sys::Obj?[]',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
DotCall.type$.af$('funcName',336898,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('funcName','sys::Str',false),new sys.Param('args','axon::Expr[]',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
StaticCall.type$.af$('typeRef',73730,'axon::TypeRef',{}).af$('funcName',336898,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('typeRef','axon::TypeRef',false),new sys.Param('funcName','sys::Str',false),new sys.Param('args','axon::Expr[]',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
TrapCall.type$.af$('tagName',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('target','axon::Expr',false),new sys.Param('tagName','sys::Str',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
PartialCall.type$.af$('params',73730,'axon::FnParam[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('func','axon::Expr',false),new sys.Param('args','axon::Expr?[]',false),new sys.Param('numPartials','sys::Int',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('bind',2048,'axon::Literal',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false),new sys.Param('cx','axon::AxonContext',false)]),{});
Fn.type$.af$('loc',336898,'axon::Loc',{'sys::NoDoc':""}).af$('name',73730,'sys::Str',{}).af$('outerRef',65666,'concurrent::AtomicRef',{}).af$('params',73730,'axon::FnParam[]',{'sys::NoDoc':""}).af$('body',73730,'axon::Expr',{'sys::NoDoc':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','axon::Loc',false),new sys.Param('name','sys::Str',false),new sys.Param('params','axon::FnParam[]',false),new sys.Param('body','axon::Expr',true)]),{'sys::NoDoc':""}).am$('type',271360,'axon::ExprType',xp,{'sys::NoDoc':""}).am$('meta',270336,'haystack::Dict',xp,{}).am$('isTop',270336,'sys::Bool',xp,{}).am$('outer',8192,'axon::Fn?',xp,{'sys::NoDoc':""}).am$('arity',8192,'sys::Int',xp,{'sys::NoDoc':""}).am$('requiredArity',8192,'sys::Int',xp,{'sys::NoDoc':""}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('isComp',270336,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isNative',270336,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isSu',270336,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isAdmin',270336,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isDeprecated',270336,'sys::Bool',xp,{'sys::NoDoc':""}).am$('call',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('args','sys::Obj?[]',false)]),{}).am$('haystackCall',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','haystack::HaystackContext',false),new sys.Param('args','sys::Obj?[]',false)]),{'sys::NoDoc':""}).am$('callLazy',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('args','axon::Expr[]',false),new sys.Param('callLoc','axon::Loc',false)]),{'sys::NoDoc':""}).am$('callx',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('args','sys::Obj?[]',false),new sys.Param('callLoc','axon::Loc',false)]),{'sys::NoDoc':""}).am$('doCall',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('args','sys::Obj?[]',false)]),{'sys::NoDoc':""}).am$('evalParamDef',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('param','axon::FnParam',false)]),{'sys::NoDoc':""}).am$('sig',270336,'sys::Str',xp,{'sys::NoDoc':""}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{'sys::NoDoc':""}).am$('toFunc',8192,'sys::Func',xp,{'sys::NoDoc':""});
TopFn.type$.af$('meta',336898,'haystack::Dict',{}).af$('isAdmin',336898,'sys::Bool',{}).af$('isSu',336898,'sys::Bool',{}).af$('isDeprecated',336898,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','axon::Loc',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false),new sys.Param('params','axon::FnParam[]',false),new sys.Param('body','axon::Expr',true)]),{}).am$('isTop',271360,'sys::Bool',xp,{}).am$('isLazy',270336,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('callx',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('args','sys::Obj?[]',false),new sys.Param('callLoc','axon::Loc',false)]),{'sys::NoDoc':""});
FnParam.type$.af$('cells',106498,'axon::FnParam[]',{}).af$('byNum',100354,'axon::FnParam[][]',{}).af$('name',73730,'sys::Str',{}).af$('def',73730,'axon::Expr?',{}).af$('hasDef',73730,'sys::Bool',{}).am$('makeNum',40962,'axon::FnParam[]',sys.List.make(sys.Param.type$,[new sys.Param('num','sys::Int',false)]),{}).am$('makeFanList',40962,'axon::FnParam[]',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Func',false)]),{}).am$('makeFan',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','sys::Param',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','axon::Expr?',true)]),{}).am$('encode',8192,'haystack::Dict',xp,{}).am$('print',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ReturnErr.type$.am$('make',8196,'sys::Void',xp,{}).am$('getVal',40962,'sys::Obj?',xp,{}).am$('putVal',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj?',false)]),{});
UnaryOp.type$.af$('operand',73730,'axon::Expr',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('operand','axon::Expr',false)]),{}).am$('loc',271360,'axon::Loc',xp,{}).am$('eval',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('doEval',262273,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
BinaryOp.type$.af$('lhs',73730,'axon::Expr',{}).af$('rhs',73730,'axon::Expr',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('loc',271360,'axon::Loc',xp,{}).am$('eval',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('doEval',262273,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
Return.type$.af$('expr',73730,'axon::Expr',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('loc',271360,'axon::Loc',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
Throw.type$.af$('expr',73730,'axon::Expr',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('loc',271360,'axon::Loc',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
TryCatch.type$.af$('tryExpr',73730,'axon::Expr',{}).af$('errVarName',73730,'sys::Str?',{}).af$('catchExpr',73730,'axon::Expr',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tryExpr','axon::Expr',false),new sys.Param('errVarName','sys::Str?',false),new sys.Param('catchExpr','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('loc',271360,'axon::Loc',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
If.type$.af$('cond',73730,'axon::Expr',{}).af$('ifExpr',73730,'axon::Expr',{}).af$('elseExpr',73730,'axon::Expr',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cond','axon::Expr',false),new sys.Param('ifExpr','axon::Expr',false),new sys.Param('elseExpr','axon::Expr',true)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('loc',271360,'axon::Loc',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
Assign.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('doEval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
Not.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('operand','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('doEval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{});
And.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('doEval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{});
Or.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('doEval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{});
Eq.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('doEval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('eq',128,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalNumber',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false)]),{});
Ne.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('doEval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{});
Compare.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('doEval',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('cmp',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{});
Lt.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('cmp',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{});
Le.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('cmp',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{});
Ge.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('cmp',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{});
Gt.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('cmp',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{});
Cmp.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('cmp',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{});
Neg.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('operand','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('foldConst',271360,'axon::Expr',xp,{}).am$('doEval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{});
BinaryMath.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('doEval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalNumber',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalStr',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Str',false),new sys.Param('b','sys::Str',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalDate',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Date',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalDateTime',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::DateTime',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalTime',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Time',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalDateSpan',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::DateSpan',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalUri',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Uri',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{});
Add.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('evalNumber',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalStr',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Str',false),new sys.Param('b','sys::Str',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalDate',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Date',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalDateTime',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::DateTime',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalDateSpan',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::DateSpan',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalTime',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Time',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalUri',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Uri',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{});
Sub.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('evalNumber',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalDate',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Date',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalDateTime',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::DateTime',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalTime',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Time',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalDateSpan',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::DateSpan',false),new sys.Param('b','sys::Obj',false),new sys.Param('cx','axon::AxonContext',false)]),{});
Mul.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('evalNumber',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false),new sys.Param('cx','axon::AxonContext',false)]),{});
Div.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lhs','axon::Expr',false),new sys.Param('rhs','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('evalNumber',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number',false),new sys.Param('b','haystack::Number',false),new sys.Param('cx','axon::AxonContext',false)]),{});
DefineVar.type$.af$('loc',336898,'axon::Loc',{}).af$('name',73730,'sys::Str',{}).af$('val',73730,'axon::Expr',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','axon::Loc',false),new sys.Param('name','sys::Str',false),new sys.Param('val','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
Block.type$.af$('exprs',73730,'axon::Expr[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('exprs','axon::Expr[]',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('loc',271360,'axon::Loc',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
Loc.type$.af$('unknown',106498,'axon::Loc',{}).af$('eval',106498,'axon::Loc',{}).af$('file',73730,'sys::Str',{}).af$('line',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::Str',false),new sys.Param('line','sys::Int',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('isUnknown',8192,'sys::Bool',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Printer.type$.af$('indentation',67584,'sys::Int',{}).af$('isNewline',67584,'sys::Bool',{}).af$('buf',67584,'sys::StrBuf',{}).af$('atomicLevel',67584,'sys::Int',{}).am$('w',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj',false)]),{}).am$('wc',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('nl',8192,'sys::This',xp,{}).am$('eos',8192,'sys::This',xp,{}).am$('indent',8192,'sys::This',xp,{}).am$('unindent',8192,'sys::This',xp,{}).am$('val',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('comma',8192,'sys::This',xp,{}).am$('expr',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false)]),{}).am$('atomic',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false)]),{}).am$('atomicStart',8192,'sys::This',xp,{}).am$('atomicEnd',8192,'sys::This',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('checkNewline',2048,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
Literal.type$.af$('trueVal',106498,'axon::Literal',{}).af$('falseVal',106498,'axon::Literal',{}).af$('nullVal',106498,'axon::Literal',{}).af$('markerVal',106498,'axon::Literal',{}).af$('removeVal',106498,'axon::Literal',{}).af$('val',73730,'sys::Obj?',{}).am$('bool',40962,'axon::Literal',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',false)]),{}).am$('wrap',40962,'axon::Literal',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('loc',271360,'axon::Loc',xp,{}).am$('isConst',271360,'sys::Bool',xp,{}).am$('constVal',271360,'sys::Obj?',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
UnsafeLiteral.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{});
FilterExpr.type$.af$('filter',73730,'haystack::Filter',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('loc',271360,'axon::Loc',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
ListExpr.type$.af$('empty',106498,'axon::ListExpr',{}).af$('vals',73730,'axon::Expr[]',{}).af$('constValRef',67586,'sys::Obj?[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('vals','axon::Expr[]',false),new sys.Param('allValsConst','sys::Bool',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('loc',271360,'axon::Loc',xp,{}).am$('isConst',271360,'sys::Bool',xp,{}).am$('constVal',271360,'sys::Obj?',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DictExpr.type$.af$('empty',106498,'axon::DictExpr',{}).af$('loc',336898,'axon::Loc',{}).af$('names',73730,'sys::Str[]',{}).af$('vals',73730,'axon::Expr[]',{}).af$('constValRef',67586,'haystack::Dict?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','axon::Loc',false),new sys.Param('names','sys::Str[]',false),new sys.Param('vals','axon::Expr[]',false),new sys.Param('allValsConst','sys::Bool',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('isConst',271360,'sys::Bool',xp,{}).am$('constVal',271360,'sys::Obj?',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
RangeExpr.type$.af$('start',73730,'axon::Expr',{}).af$('end',73730,'axon::Expr',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('start','axon::Expr',false),new sys.Param('end','axon::Expr',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('loc',271360,'axon::Loc',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
CellDef.type$.am$('parent',270337,'axon::CompDef',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('index',270337,'sys::Int',xp,{'sys::NoDoc':""});
Var.type$.af$('loc',336898,'axon::Loc',{}).af$('name',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','axon::Loc',false),new sys.Param('name','sys::Str',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{});
TypeRef.type$.af$('loc',336898,'axon::Loc',{}).af$('lib',73730,'sys::Str?',{}).af$('name',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','axon::Loc',false),new sys.Param('lib','sys::Str?',false),new sys.Param('name','sys::Str',false)]),{}).am$('type',271360,'axon::ExprType',xp,{}).am$('eval',271360,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('print',271360,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{}).am$('nameToStr',8192,'sys::Str',xp,{});
CompDef.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','axon::Loc',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false),new sys.Param('body','axon::Expr',false)]),{'sys::NoDoc':""}).am$('type',271360,'axon::ExprType',xp,{'sys::NoDoc':""}).am$('size',270337,'sys::Int',xp,{'sys::NoDoc':""}).am$('cells',270337,'axon::CellDef[]',xp,{}).am$('cell',270337,'axon::CellDef?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('instantiate',270337,'axon::Comp',xp,{}).am$('isComp',9216,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isNative',9216,'sys::Bool',xp,{'sys::NoDoc':""}).am$('callx',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('args','sys::Obj?[]',false),new sys.Param('loc','axon::Loc',false)]),{'sys::NoDoc':""}).am$('walk',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj?->sys::Void|',false)]),{'sys::NoDoc':""}).am$('print',9216,'axon::Printer',sys.List.make(sys.Param.type$,[new sys.Param('out','axon::Printer',false)]),{'sys::NoDoc':""}).am$('dump',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{'sys::NoDoc':""});
ExprType.type$.af$('literal',106506,'axon::ExprType',{}).af$('list',106506,'axon::ExprType',{}).af$('dict',106506,'axon::ExprType',{}).af$('range',106506,'axon::ExprType',{}).af$('filter',106506,'axon::ExprType',{}).af$('def',106506,'axon::ExprType',{}).af$('var',106506,'axon::ExprType',{}).af$('func',106506,'axon::ExprType',{}).af$('compdef',106506,'axon::ExprType',{}).af$('celldef',106506,'axon::ExprType',{}).af$('call',106506,'axon::ExprType',{}).af$('dotCall',106506,'axon::ExprType',{}).af$('staticCall',106506,'axon::ExprType',{}).af$('trapCall',106506,'axon::ExprType',{}).af$('partialCall',106506,'axon::ExprType',{}).af$('block',106506,'axon::ExprType',{}).af$('ifExpr',106506,'axon::ExprType',{}).af$('returnExpr',106506,'axon::ExprType',{}).af$('throwExpr',106506,'axon::ExprType',{}).af$('tryExpr',106506,'axon::ExprType',{}).af$('typeRef',106506,'axon::ExprType',{}).af$('assign',106506,'axon::ExprType',{}).af$('not',106506,'axon::ExprType',{}).af$('and',106506,'axon::ExprType',{}).af$('or',106506,'axon::ExprType',{}).af$('eq',106506,'axon::ExprType',{}).af$('ne',106506,'axon::ExprType',{}).af$('lt',106506,'axon::ExprType',{}).af$('le',106506,'axon::ExprType',{}).af$('ge',106506,'axon::ExprType',{}).af$('gt',106506,'axon::ExprType',{}).af$('cmp',106506,'axon::ExprType',{}).af$('neg',106506,'axon::ExprType',{}).af$('add',106506,'axon::ExprType',{}).af$('sub',106506,'axon::ExprType',{}).af$('mul',106506,'axon::ExprType',{}).af$('div',106506,'axon::ExprType',{}).af$('vals',106498,'axon::ExprType[]',{}).af$('op',73730,'sys::Str?',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('op','sys::Str?',true)]),{}).am$('encode',128,'sys::Str',xp,{}).am$('fromStr',40966,'axon::ExprType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
MComp.type$.af$('def',336898,'axon::MCompDef',{}).af$('cells',67584,'axon::MCell[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','axon::MCompDef',false)]),{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{'sys::Operator':""}).am$('set',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'sys::Operator':""}).am$('getCell',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cd','axon::CellDef',false)]),{}).am$('setCell',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cd','axon::CellDef',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('cellVals',271360,'sys::Obj?[]',xp,{}).am$('recompute',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('checkMyCellDef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cd','axon::CellDef',false)]),{}).am$('dump',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('doDump',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('comp','axon::Comp',false),new sys.Param('out','sys::OutStream',false)]),{});
MCompDef.type$.af$('cells',336898,'axon::MCellDef[]',{}).af$('cellsMap',67586,'[sys::Str:axon::MCellDef]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','axon::Loc',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false),new sys.Param('body','axon::Expr',false),new sys.Param('cells','axon::CellDef[]',false),new sys.Param('cellsMap','[sys::Str:axon::CellDef]',false)]),{}).am$('size',271360,'sys::Int',xp,{}).am$('cell',271360,'axon::MCellDef?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('instantiate',271360,'axon::Comp',xp,{});
MCell.type$.af$('def',73730,'axon::MCellDef',{}).af$('val',67584,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','axon::MCellDef',false)]),{}).am$('name',8192,'sys::Str',xp,{}).am$('get',8192,'sys::Obj?',xp,{}).am$('set',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('recomputed',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{});
MCellDef.type$.af$('parentRef',67586,'concurrent::AtomicRef',{}).af$('index',336898,'sys::Int',{}).af$('name',336898,'sys::Str',{}).af$('defVal',73730,'sys::Obj?',{}).af$('ro',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parentRef','concurrent::AtomicRef',false),new sys.Param('index','sys::Int',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('isReadonly',32898,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false)]),{}).am$('parent',271360,'axon::MCompDef',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
Cell.type$.af$('meta',73730,'sys::Obj?',{}).am$('decode',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,sys::Obj->sys::Void|',false)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|axon::Cell->sys::Void|?',true)]),{});
FCellDef.type$.af$('parent',336898,'axon::FCompDef',{}).af$('index',336898,'sys::Int',{}).af$('name',336898,'sys::Str',{}).af$('field',73730,'sys::Field',{}).af$('ro',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','axon::FCompDef',false),new sys.Param('index','sys::Int',false),new sys.Param('field','sys::Field',false),new sys.Param('facet','axon::Cell',false)]),{}).am$('toMeta',34818,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('field','sys::Field',false),new sys.Param('facet','axon::Cell',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('getCell',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('comp','axon::AbstractComp',false)]),{}).am$('setCell',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('comp','axon::AbstractComp',false),new sys.Param('val','sys::Obj?',false)]),{});
AbstractComp.type$.af$('defRef',65666,'axon::FCompDef',{}).am$('reflect',40962,'axon::CompDef',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('init','sys::Obj',false)]),{}).am$('def',9216,'axon::CompDef',xp,{}).am$('get',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{'sys::Operator':""}).am$('set',9216,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'sys::Operator':""}).am$('getCell',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cd','axon::CellDef',false)]),{}).am$('setCell',9216,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cd','axon::CellDef',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('recompute',9216,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('onRecompute',266241,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('toStr',9216,'sys::Str',xp,{}).am$('cellVals',9216,'sys::Obj?[]',xp,{'sys::NoDoc':""}).am$('dump',9216,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{'sys::NoDoc':""});
FCompDef.type$.af$('compType',73730,'sys::Type',{}).af$('cells',336898,'axon::FCellDef[]',{}).af$('cellsMap',67586,'[sys::Str:axon::FCellDef]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('size',271360,'sys::Int',xp,{}).am$('cell',271360,'axon::FCellDef?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('instantiate',271360,'axon::Comp',xp,{});
CoreLibUtil.type$.am$('sort',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('sorter','sys::Obj?',false),new sys.Param('ascending','sys::Bool',false)]),{}).am$('gridColKinds',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('g','haystack::Grid',false)]),{}).am$('funcs',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('filterExpr','axon::Expr',true)]),{}).am$('func',40962,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('name','sys::Obj',false),new sys.Param('checked','sys::Bool',false)]),{}).am$('compDef',40962,'haystack::Grid?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('name','sys::Obj',false),new sys.Param('checked','sys::Bool',false)]),{}).am$('curFunc',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('params',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('fn','axon::Fn',false)]),{}).am$('coerceToFn',34818,'axon::TopFn?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('x','sys::Obj',false),new sys.Param('checked','sys::Bool',false)]),{}).am$('fnToDict',34818,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('fn','axon::TopFn',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TagNameUsage.type$.af$('count',73728,'sys::Int',{}).af$('marker',73728,'sys::Bool',{}).af$('str',73728,'sys::Bool',{}).af$('ref',73728,'sys::Bool',{}).af$('number',73728,'sys::Bool',{}).af$('bool',73728,'sys::Bool',{}).af$('bin',73728,'sys::Bool',{}).af$('uri',73728,'sys::Bool',{}).af$('dateTime',73728,'sys::Bool',{}).af$('date',73728,'sys::Bool',{}).af$('time',73728,'sys::Bool',{}).af$('coord',73728,'sys::Bool',{}).af$('list',73728,'sys::Bool',{}).af$('dict',73728,'sys::Bool',{}).af$('grid',73728,'sys::Bool',{}).af$('symbol',73728,'sys::Bool',{}).am$('toKind',8192,'sys::Str',xp,{}).am$('add',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CoreLib.type$.af$('foldStartVal',100354,'sys::Str',{}).af$('foldEndVal',100354,'sys::Str',{}).af$('unitYear',100354,'sys::Unit',{}).af$('unitMo',100354,'sys::Unit',{}).af$('unitWeek',100354,'sys::Unit',{}).af$('unitDay',100354,'sys::Unit',{}).af$('unitHour',100354,'sys::Unit',{}).af$('unitMin',100354,'sys::Unit',{}).af$('unitSec',100354,'sys::Unit',{}).am$('_equals',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{'axon::Axon':""}).am$('isEmpty',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('size',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('get',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('key','sys::Obj?',false)]),{'axon::Axon':""}).am$('getSafe',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('key','sys::Obj?',false)]),{'axon::Axon':""}).am$('toSafeRange',34818,'sys::Range',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false),new sys.Param('r','sys::Range',false)]),{}).am$('first',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('last',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('has',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('name','sys::Str',false)]),{'axon::Axon':""}).am$('missing',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('name','sys::Str',false)]),{'axon::Axon':""}).am$('index',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('x','sys::Obj',false),new sys.Param('offset','haystack::Number',true)]),{'axon::Axon':""}).am$('indexr',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('x','sys::Obj',false),new sys.Param('offset','haystack::Number',true)]),{'axon::Axon':""}).am$('contains',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('x','sys::Obj?',false)]),{'axon::Axon':""}).am$('add',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('item','sys::Obj?',false)]),{'axon::Axon':""}).am$('addAll',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('items','sys::Obj?',false)]),{'axon::Axon':""}).am$('set',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('key','sys::Obj?',false),new sys.Param('item','sys::Obj?',false)]),{'axon::Axon':""}).am$('merge',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{'axon::Axon':""}).am$('insert',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('index','haystack::Number',false),new sys.Param('item','sys::Obj?',false)]),{'axon::Axon':""}).am$('insertAll',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('index','haystack::Number',false),new sys.Param('items','sys::Obj?',false)]),{'axon::Axon':""}).am$('remove',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('key','sys::Obj?',false)]),{'axon::Axon':""}).am$('mutList',34818,'sys::Obj?[]',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj?[]',false)]),{}).am$('stream',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('streamCol',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('col','sys::Obj',false)]),{'axon::Axon':""}).am$('collect',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('stream','sys::Obj?',false),new sys.Param('to','axon::Fn?',true)]),{'axon::Axon':""}).am$('limit',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('stream','sys::Obj?',false),new sys.Param('limit','haystack::Number',false)]),{'axon::Axon':""}).am$('skip',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('stream','sys::Obj?',false),new sys.Param('count','haystack::Number',false)]),{'axon::Axon':""}).am$('sort',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('sorter','sys::Obj?',true)]),{'axon::Axon':""}).am$('sortDis',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Grid',false)]),{'axon::Axon':""}).am$('sortr',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('sorter','sys::Obj?',true)]),{'axon::Axon':""}).am$('each',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('eachWhile',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('map',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('flatMap',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('find',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('findAll',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('filter',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('val','axon::Expr',false),new sys.Param('filterExpr','axon::Expr',false)]),{'axon::Axon':""}).am$('all',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('any',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('reduce',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('init','sys::Obj?',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('moveTo',40962,'sys::Obj[]',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj[]',false),new sys.Param('item','sys::Obj?',false),new sys.Param('toIndex','haystack::Number',false)]),{'axon::Axon':""}).am$('unique',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('key','sys::Obj?',true)]),{'axon::Axon':""}).am$('flatten',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::List',false)]),{'axon::Axon':""}).am$('gridRowsToDict',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('rowToKey','axon::Fn',false),new sys.Param('rowToVal','axon::Fn',false)]),{'axon::Axon':""}).am$('gridColsToDict',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('colToKey','axon::Fn',false),new sys.Param('colToVal','axon::Fn',false)]),{'axon::Axon':""}).am$('gridColKinds',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{'axon::Axon':""}).am$('toGridIterator',34818,'sys::Func',sys.List.make(sys.Param.type$,[new sys.Param('fn','axon::Fn',false)]),{}).am$('toDictIterator',34818,'sys::Func',sys.List.make(sys.Param.type$,[new sys.Param('fn','axon::Fn',false)]),{}).am$('toListIterator',34818,'sys::Func',sys.List.make(sys.Param.type$,[new sys.Param('fn','axon::Fn',false)]),{}).am$('toStrIterator',34818,'sys::Func',sys.List.make(sys.Param.type$,[new sys.Param('fn','axon::Fn',false)]),{}).am$('toRangeIterator',34818,'sys::Func',sys.List.make(sys.Param.type$,[new sys.Param('fn','axon::Fn',false)]),{}).am$('fold',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('foldCol',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('colName','sys::Str',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('foldCols',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('colSelector','sys::Obj',false),new sys.Param('newColName','sys::Str',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('foldStart',40962,'sys::Obj?',xp,{'axon::Axon':""}).am$('foldEnd',40962,'sys::Obj?',xp,{'axon::Axon':""}).am$('count',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('acc','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{meta=[\"foldOn\":\"Obj\"];}"}).am$('sum',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('acc','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{meta=[\"foldOn\":\"Number\"];}"}).am$('min',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('acc','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{meta=[\"foldOn\":\"Number\"];}"}).am$('max',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('acc','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{meta=[\"foldOn\":\"Number\"];}"}).am$('avg',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('acc','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{meta=[\"foldOn\":\"Number\"];}"}).am$('spread',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('acc','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{meta=[\"foldOn\":\"Number\"];}"}).am$('toFoldNumAcc',34818,'haystack::Number[]',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('acc','sys::Obj?',false)]),{}).am$('marker',40962,'haystack::Marker',xp,{'axon::Axon':""}).am$('removeMarker',40962,'haystack::Remove',xp,{'axon::Axon':""}).am$('na',40962,'haystack::NA',xp,{'axon::Axon':""}).am$('isTagName',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{'axon::Axon':""}).am$('toTagName',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{'axon::Axon':""}).am$('names',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{'axon::Axon':""}).am$('vals',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{'axon::Axon':""}).am$('_trap',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('name','sys::Str',false)]),{'axon::Axon':""}).am$('meta',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('cols',40962,'haystack::Col[]',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{'axon::Axon':""}).am$('col',40962,'haystack::Col?',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('colNames',40962,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{'axon::Axon':""}).am$('name',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('setMeta',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('grid','sys::Obj',false),new sys.Param('meta','haystack::Dict',false)]),{'axon::Axon':""}).am$('addMeta',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('grid','sys::Obj',false),new sys.Param('meta','haystack::Dict',false)]),{'axon::Axon':""}).am$('join',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Grid',false),new sys.Param('b','haystack::Grid',false),new sys.Param('joinColName','sys::Str',false)]),{'axon::Axon':""}).am$('joinAll',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grids','haystack::Grid[]',false),new sys.Param('joinColName','sys::Str',false)]),{'axon::Axon':""}).am$('addCol',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('col','sys::Obj?',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('addCols',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Grid',false),new sys.Param('b','haystack::Grid',false)]),{'axon::Axon':""}).am$('renameCol',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('oldName','sys::Str',false),new sys.Param('newName','sys::Str',false)]),{'axon::Axon':""}).am$('renameCols',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('mapping','haystack::Dict',false)]),{'axon::Axon':""}).am$('reorderCols',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('grid','sys::Obj',false),new sys.Param('colNames','sys::Str[]',false)]),{'axon::Axon':""}).am$('setColMeta',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('grid','sys::Obj',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false)]),{'axon::Axon':""}).am$('addColMeta',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('grid','sys::Obj',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false)]),{'axon::Axon':""}).am$('removeCol',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('grid','sys::Obj',false),new sys.Param('col','sys::Obj',false)]),{'axon::Axon':""}).am$('removeCols',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('grid','sys::Obj',false),new sys.Param('cols','sys::Obj[]',false)]),{'axon::Axon':""}).am$('keepCols',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('grid','sys::Obj',false),new sys.Param('cols','sys::Obj[]',false)]),{'axon::Axon':""}).am$('addRow',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('newRow','haystack::Dict',false)]),{'axon::Axon':""}).am$('addRows',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('newRows','sys::Obj',false)]),{'axon::Axon':""}).am$('rowToList',40962,'sys::Obj?[]',sys.List.make(sys.Param.type$,[new sys.Param('row','haystack::Row',false)]),{'axon::Axon':""}).am$('colToList',40962,'sys::Obj?[]',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('col','sys::Obj',false)]),{'axon::Axon':""}).am$('transpose',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{'axon::Axon':""}).am$('swizzleRefs',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{'axon::Axon':""}).am$('gridReplace',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('from','sys::Obj?',false),new sys.Param('to','sys::Obj?',false)]),{'axon::Axon':""}).am$('swizzleRefsVal',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('oldToNewIds','[haystack::Ref:haystack::Ref]',false),new sys.Param('v','sys::Obj?',false)]),{'sys::NoDoc':""}).am$('times',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('times','haystack::Number',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('isOdd',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('isEven',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('abs',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number?',false)]),{'axon::Axon':""}).am$('isNaN',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('nan',40962,'haystack::Number',xp,{'axon::Axon':""}).am$('posInf',40962,'haystack::Number',xp,{'axon::Axon':""}).am$('negInf',40962,'haystack::Number',xp,{'axon::Axon':""}).am$('clamp',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false),new sys.Param('min','haystack::Number',false),new sys.Param('max','haystack::Number',false)]),{'axon::Axon':""}).am$('today',40962,'sys::Date',xp,{'axon::Axon':""}).am$('yesterday',40962,'sys::Date',xp,{'axon::Axon':""}).am$('now',40962,'sys::DateTime',xp,{'axon::Axon':""}).am$('nowUtc',40962,'sys::DateTime',xp,{'axon::Axon':""}).am$('nowTicks',40962,'haystack::Number',xp,{'axon::Axon':""}).am$('occurred',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::Obj?',false),new sys.Param('range','sys::Obj?',false)]),{'axon::Axon':""}).am$('start',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('end',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('thisWeek',40962,'haystack::DateSpan',xp,{'axon::Axon':""}).am$('thisMonth',40962,'haystack::DateSpan',xp,{'axon::Axon':""}).am$('thisQuarter',40962,'haystack::DateSpan',xp,{'axon::Axon':""}).am$('thisYear',40962,'haystack::DateSpan',xp,{'axon::Axon':""}).am$('pastWeek',40962,'haystack::DateSpan',xp,{'axon::Axon':""}).am$('pastMonth',40962,'haystack::DateSpan',xp,{'axon::Axon':""}).am$('pastYear',40962,'haystack::DateSpan',xp,{'axon::Axon':""}).am$('lastWeek',40962,'haystack::DateSpan',xp,{'axon::Axon':""}).am$('lastMonth',40962,'haystack::DateSpan',xp,{'axon::Axon':""}).am$('lastQuarter',40962,'haystack::DateSpan',xp,{'axon::Axon':""}).am$('lastYear',40962,'haystack::DateSpan',xp,{'axon::Axon':""}).am$('firstOfMonth',40962,'sys::Date',sys.List.make(sys.Param.type$,[new sys.Param('date','sys::Date',false)]),{'axon::Axon':""}).am$('lastOfMonth',40962,'sys::Date',sys.List.make(sys.Param.type$,[new sys.Param('date','sys::Date',false)]),{'axon::Axon':""}).am$('toDateSpan',40962,'haystack::DateSpan',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{'axon::Axon':""}).am$('toSpan',40962,'haystack::Span',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false),new sys.Param('tz','sys::Str?',true)]),{'axon::Axon':""}).am$('toDateTimeSpan',40962,'haystack::Span',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',true)]),{'sys::NoDoc':"",'sys::Deprecated':"sys::Deprecated{msg=\"Use toSpan\";}",'axon::Axon':""}).am$('numDays',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('span','sys::Obj?',false)]),{'axon::Axon':""}).am$('eachDay',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('dates','sys::Obj',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('eachMonth',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('dates','sys::Obj',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':""}).am$('year',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('d','sys::Obj',false)]),{'axon::Axon':""}).am$('month',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('d','sys::Obj',false)]),{'axon::Axon':""}).am$('day',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('d','sys::Obj',false)]),{'axon::Axon':""}).am$('hour',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Obj',false)]),{'axon::Axon':""}).am$('minute',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Obj',false)]),{'axon::Axon':""}).am$('second',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Obj',false)]),{'axon::Axon':""}).am$('weekday',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Obj',false)]),{'axon::Axon':""}).am$('isWeekend',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Obj',false)]),{'axon::Axon':""}).am$('isWeekday',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Obj',false)]),{'axon::Axon':""}).am$('tz',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('dt','sys::DateTime?',true)]),{'axon::Axon':""}).am$('dateTime',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('d','sys::Date',false),new sys.Param('t','sys::Time',false),new sys.Param('tz','sys::Str?',true)]),{'axon::Axon':""}).am$('date',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('month','haystack::Number?',true),new sys.Param('day','haystack::Number?',true)]),{'axon::Axon':""}).am$('time',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('minutes','haystack::Number?',true),new sys.Param('secs','haystack::Number',true)]),{'axon::Axon':""}).am$('toTimeZone',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('tz','sys::Str',false)]),{'axon::Axon':""}).am$('numDaysInMonth',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('month','sys::Obj?',true)]),{'axon::Axon':""}).am$('isLeapYear',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('year','haystack::Number',false)]),{'axon::Axon':""}).am$('dst',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('dt','sys::DateTime',false)]),{'axon::Axon':""}).am$('hoursInDay',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('dt','sys::DateTime',false)]),{'axon::Axon':""}).am$('dayOfYear',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{'axon::Axon':""}).am$('weekOfYear',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('startOfWeek','haystack::Number?',true)]),{'axon::Axon':""}).am$('startOfWeek',40962,'haystack::Number',xp,{'axon::Axon':""}).am$('toJavaMillis',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('dt','sys::DateTime',false)]),{'axon::Axon':""}).am$('fromJavaMillis',40962,'sys::DateTime',sys.List.make(sys.Param.type$,[new sys.Param('millis','haystack::Number',false),new sys.Param('tz','sys::Str?',true)]),{'axon::Axon':""}).am$('isMetric',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',true)]),{'axon::Axon':""}).am$('isUnitMetric',34818,'sys::Bool?',sys.List.make(sys.Param.type$,[new sys.Param('unit','sys::Unit',false)]),{}).am$('unit',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number?',false)]),{'axon::Axon':""}).am$('unitsEq',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Number?',false),new sys.Param('b','haystack::Number?',false)]),{'axon::Axon':""}).am$('to',40962,'haystack::Number?',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number?',false),new sys.Param('unit','sys::Obj?',false)]),{'axon::Axon':""}).am$('_as',40962,'haystack::Number?',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number?',false),new sys.Param('unit','sys::Obj?',false)]),{'axon::Axon':""}).am$('def',40962,'haystack::Def?',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Obj',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('defs',40962,'haystack::Def[]',xp,{'axon::Axon':""}).am$('tags',40962,'haystack::Def[]',xp,{'axon::Axon':""}).am$('terms',40962,'haystack::Def[]',xp,{'axon::Axon':""}).am$('conjuncts',40962,'haystack::Def[]',xp,{'axon::Axon':""}).am$('libs',40962,'haystack::Def[]',xp,{'axon::Axon':""}).am$('supertypes',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('d','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('subtypes',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('d','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('hasSubtypes',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('d','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('inheritance',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('d','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('associations',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('parent','sys::Obj',false),new sys.Param('association','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('implement',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('d','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('reflect',40962,'haystack::Def[]',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('proto',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('parent','haystack::Dict',false),new sys.Param('proto','haystack::Dict',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('protos',40962,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('parent','haystack::Dict',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('nsTimestamp',40962,'sys::DateTime',xp,{'sys::NoDoc':"",'axon::Axon':""}).am$('params',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('fn','axon::Fn',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('func',40962,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Obj',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('funcs',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('filterExpr','axon::Expr',true)]),{'axon::Axon':""}).am$('compDef',40962,'haystack::Grid?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Obj',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('curFunc',40962,'haystack::Dict',xp,{'axon::Axon':""}).am$('debugType',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isNull',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isNonNull',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isList',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isDict',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isGrid',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isHisGrid',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isBool',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isNumber',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isDuration',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isRef',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isStr',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isUri',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isDate',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isTime',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isDateTime',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isFunc',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isSpan',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('isKeyword',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{'axon::Axon':""}).am$('toHex',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{'axon::Axon':""}).am$('toRadix',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false),new sys.Param('radix','haystack::Number',false),new sys.Param('width','haystack::Number?',true)]),{'axon::Axon':""}).am$('_toStr',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('toList',40962,'sys::Obj?[]',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('toGrid',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('meta','haystack::Dict?',true)]),{'axon::Axon':""}).am$('colsToLocale',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{'axon::Axon':""}).am$('toLocale',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{'axon::Axon':""}).am$('localeUse',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('locale','axon::Expr',false),new sys.Param('expr','axon::Expr',false)]),{'axon::Axon':""}).am$('dis',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict?',false),new sys.Param('name','sys::Str?',true),new sys.Param('def','sys::Str?',true)]),{'axon::Axon':""}).am$('relDis',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('parent','sys::Obj',false),new sys.Param('child','sys::Obj',false)]),{'axon::Axon':""}).am$('format',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('pattern','sys::Str?',true)]),{'axon::Axon':""}).am$('parseBool',40962,'sys::Bool?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('parseInt',40962,'haystack::Number?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('radix','haystack::Number',true),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('parseFloat',40962,'haystack::Number?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('parseNumber',40962,'haystack::Number?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('parseUri',40962,'sys::Uri?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('parseDate',40962,'sys::Date?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('pattern','sys::Str',true),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('parseTime',40962,'sys::Time?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('pattern','sys::Str',true),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('parseDateTime',40962,'sys::DateTime?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('pattern','sys::Str',true),new sys.Param('tz','sys::Str',true),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('parseRef',40962,'haystack::Ref?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('dis','sys::Obj?',true),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('parseSymbol',40962,'haystack::Symbol?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('parseFilter',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('parseSearch',40962,'haystack::Filter',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{'axon::Axon':""}).am$('filterToFunc',40962,'axon::Fn',sys.List.make(sys.Param.type$,[new sys.Param('filterExpr','axon::Expr',false)]),{'axon::Axon':""}).am$('parseUnit',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('xstr',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('val','sys::Str',false)]),{'axon::Axon':""}).am$('upper',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{'axon::Axon':""}).am$('lower',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{'axon::Axon':""}).am$('isSpace',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('num','haystack::Number',false)]),{'axon::Axon':""}).am$('isAlpha',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('num','haystack::Number',false)]),{'axon::Axon':""}).am$('isAlphaNum',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('num','haystack::Number',false)]),{'axon::Axon':""}).am$('isUpper',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('num','haystack::Number',false)]),{'axon::Axon':""}).am$('isLower',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('num','haystack::Number',false)]),{'axon::Axon':""}).am$('isDigit',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('num','haystack::Number',false),new sys.Param('radix','haystack::Number',true)]),{'axon::Axon':""}).am$('toChar',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('num','haystack::Number',false)]),{'axon::Axon':""}).am$('split',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('sep','sys::Str?',true),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':""}).am$('capitalize',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{'axon::Axon':""}).am$('decapitalize',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{'axon::Axon':""}).am$('trim',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{'axon::Axon':""}).am$('trimStart',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{'axon::Axon':""}).am$('trimEnd',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{'axon::Axon':""}).am$('startsWith',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('sub','sys::Str',false)]),{'axon::Axon':""}).am$('endsWith',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('sub','sys::Str',false)]),{'axon::Axon':""}).am$('replace',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('from','sys::Str',false),new sys.Param('to','sys::Str',false)]),{'axon::Axon':""}).am$('padl',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('width','haystack::Number',false),new sys.Param('char','sys::Str',true)]),{'axon::Axon':""}).am$('padr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('width','haystack::Number',false),new sys.Param('char','sys::Str',true)]),{'axon::Axon':""}).am$('concat',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::List',false),new sys.Param('sep','sys::Str',true)]),{'axon::Axon':""}).am$('reMatches',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('regex','sys::Obj',false),new sys.Param('s','sys::Str',false)]),{'axon::Axon':""}).am$('reFind',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('regex','sys::Obj',false),new sys.Param('s','sys::Str',false)]),{'axon::Axon':""}).am$('reFindAll',40962,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('regex','sys::Obj',false),new sys.Param('s','sys::Str',false)]),{'axon::Axon':""}).am$('reGroups',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('regex','sys::Obj',false),new sys.Param('s','sys::Str',false)]),{'axon::Axon':""}).am$('uriScheme',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriHost',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriPort',40962,'haystack::Number?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriName',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriPath',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriPathStr',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriBasename',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriExt',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriIsDir',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriFrag',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriQueryStr',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriPlusSlash',40962,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriEncode',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Uri',false)]),{'axon::Axon':""}).am$('uriDecode',40962,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('refGen',40962,'haystack::Ref',xp,{'axon::Axon':""}).am$('refDis',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false)]),{'axon::Axon':""}).am$('refProjName',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('coord',40962,'haystack::Coord',sys.List.make(sys.Param.type$,[new sys.Param('lat','haystack::Number',false),new sys.Param('lng','haystack::Number',false)]),{'axon::Axon':""}).am$('coordLat',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('coord','haystack::Coord',false)]),{'axon::Axon':""}).am$('coordLng',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('coord','haystack::Coord',false)]),{'axon::Axon':""}).am$('coordDist',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('c1','haystack::Coord',false),new sys.Param('c2','haystack::Coord',false)]),{'axon::Axon':""}).am$('noop',40962,'sys::Obj?',xp,{'sys::NoDoc':"",'axon::Axon':""}).am$('_echo',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('dump',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('eval',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false)]),{'axon::Axon':""}).am$('evalToFunc',40962,'axon::Fn',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false)]),{'axon::Axon':""}).am$('evalOrReadAll',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('call',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('func','sys::Obj',false),new sys.Param('args','sys::Obj?[]?',true)]),{'axon::Axon':""}).am$('toAxonCode',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('parseAst',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false)]),{'axon::Axon':""}).am$('trace',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict?',true)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('traceToGrid',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict?',true)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('checkSyntax',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('argErr',32898,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
FantomFn.type$.af$('method',73730,'sys::Method',{}).af$('instanceRef',73730,'concurrent::AtomicRef?',{}).am$('reflectType',40962,'[sys::Str:axon::FantomFn]',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('reflectFuncFromType',40962,'axon::FantomFn?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false),new sys.Param('instanceRef','concurrent::AtomicRef?',false)]),{}).am$('reflectMethod',40962,'axon::FantomFn',sys.List.make(sys.Param.type$,[new sys.Param('m','sys::Method',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false),new sys.Param('instanceRef','concurrent::AtomicRef?',false)]),{}).am$('toName',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('m','sys::Method',false)]),{}).am$('make',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false),new sys.Param('params','axon::FnParam[]',false),new sys.Param('method','sys::Method',false),new sys.Param('instanceRef','concurrent::AtomicRef?',false)]),{}).am$('isNative',271360,'sys::Bool',xp,{}).am$('callx',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('args','sys::Obj?[]',false),new sys.Param('callLoc','axon::Loc',false)]),{}).am$('doCall',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('args','sys::Obj?[]',false)]),{}).am$('evalParamDef',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('param','axon::FnParam',false)]),{}).am$('sig',271360,'sys::Str',xp,{}).am$('argsToStr',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Obj?[]',false)]),{});
LazyFantomFn.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('d','haystack::Dict',false),new sys.Param('p','axon::FnParam[]',false),new sys.Param('m','sys::Method',false),new sys.Param('i','sys::Obj?',false)]),{}).am$('isLazy',271360,'sys::Bool',xp,{}).am$('callLazy',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('args','axon::Expr[]',false),new sys.Param('callLoc','axon::Loc',false)]),{});
FantomClosureFn.type$.af$('f',73730,'sys::Unsafe',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Func',false)]),{}).am$('isNative',271360,'sys::Bool',xp,{}).am$('callx',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('args','sys::Obj?[]',false),new sys.Param('callLoc','axon::Loc',false)]),{});
FilterFn.type$.af$('filter',73730,'haystack::Filter',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false)]),{}).am$('callx',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('args','sys::Obj?[]',false),new sys.Param('callLoc','axon::Loc',false)]),{});
Tokenizer.type$.af$('startLoc',73728,'axon::Loc',{}).af$('tok',73728,'axon::Token',{}).af$('val',73728,'sys::Obj?',{}).af$('line',73728,'sys::Int',{}).af$('col',73728,'sys::Int',{}).af$('in',67584,'sys::InStream',{}).af$('cur',67584,'sys::Int',{}).af$('peek',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('startLoc','axon::Loc',false),new sys.Param('in','sys::InStream',false)]),{}).am$('next',8192,'axon::Token',xp,{}).am$('word',2048,'axon::Token',xp,{}).am$('num',2048,'axon::Token',xp,{}).am$('rawStr',2048,'axon::Token',xp,{}).am$('str',2048,'axon::Token',xp,{}).am$('strTripleQuote',2048,'axon::Token',xp,{}).am$('ref',2048,'axon::Token',xp,{}).am$('symbol',2048,'axon::Token',xp,{}).am$('uri',2048,'axon::Token',xp,{}).am$('escape',2048,'sys::Int',xp,{}).am$('operator',2048,'axon::Token',xp,{}).am$('skipCommentSL',2048,'sys::Void',xp,{}).am$('skipCommentML',2048,'sys::Void',xp,{}).am$('err',8192,'axon::SyntaxErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('curLoc',8192,'axon::Loc',xp,{}).am$('consume',2048,'sys::Void',xp,{});
ExprToFilter.type$.af$('cx',67584,'axon::AxonContext',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false)]),{}).am$('evalToFilter',8192,'haystack::Filter?',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('toFilter',2048,'haystack::Filter',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false)]),{}).am$('toPath',2048,'haystack::FilterPath',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false)]),{}).am$('toVal',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false)]),{}).am$('err',2048,'axon::NotFilterErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{});
NotFilterErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str?',false)]),{});
Parser.type$.af$('noArgs',100354,'axon::Expr[]',{}).af$('noParams',100354,'axon::FnParam[]',{}).af$('startLoc',67584,'axon::Loc',{}).af$('tokenizer',67584,'axon::Tokenizer',{}).af$('cur',73728,'axon::Token',{}).af$('curVal',73728,'sys::Obj?',{}).af$('curIndent',67584,'sys::Int',{}).af$('nl',67584,'sys::Bool',{}).af$('curLine',67584,'sys::Int',{}).af$('peek',73728,'axon::Token',{}).af$('peekVal',73728,'sys::Obj?',{}).af$('peekLine',67584,'sys::Int',{}).af$('peekPeek',67584,'axon::Token',{}).af$('peekPeekVal',67584,'sys::Obj?',{}).af$('peekPeekLine',67584,'sys::Int',{}).af$('curName',67584,'sys::Str?',{}).af$('curFuncName',67584,'sys::Str?',{}).af$('anonNum',67584,'sys::Int',{}).af$('inners',67584,'axon::Fn[]',{}).af$('inSpec',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('startLoc','axon::Loc',false),new sys.Param('in','sys::InStream',false)]),{}).am$('parse',8192,'axon::Expr',xp,{}).am$('parseTop',8192,'axon::TopFn',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',true)]),{}).am$('namedExpr',4096,'axon::Expr',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('expr',4096,'axon::Expr',xp,{}).am$('doBlock',2048,'axon::Expr',xp,{}).am$('isEos',4096,'sys::Bool',xp,{}).am$('eos',4096,'sys::Void',xp,{}).am$('defcomp',2048,'axon::Fn',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('cell',2048,'axon::CellDef',sys.List.make(sys.Param.type$,[new sys.Param('compRef','concurrent::AtomicRef',false),new sys.Param('index','sys::Int',false)]),{}).am$('def',2048,'axon::DefineVar',xp,{}).am$('ifExpr',2048,'sys::Obj',xp,{}).am$('returnExpr',2048,'sys::Obj',xp,{}).am$('throwExpr',2048,'sys::Obj',xp,{}).am$('tryCatchExpr',2048,'sys::Obj',xp,{}).am$('list',2048,'axon::Expr',xp,{}).am$('dict',2048,'axon::DictExpr',xp,{}).am$('constDict',4096,'haystack::Dict',xp,{}).am$('assignExpr',2048,'axon::Expr',xp,{}).am$('condOrExpr',2048,'axon::Expr',xp,{}).am$('condAndExpr',2048,'axon::Expr',xp,{}).am$('compareExpr',2048,'axon::Expr',xp,{}).am$('rangeExpr',2048,'axon::Expr',xp,{}).am$('addExpr',2048,'axon::Expr',xp,{}).am$('multExpr',2048,'axon::Expr',xp,{}).am$('unaryExpr',2048,'axon::Expr',xp,{}).am$('termExpr',2048,'axon::Expr',sys.List.make(sys.Param.type$,[new sys.Param('start','axon::Expr?',true)]),{}).am$('termBase',2048,'axon::Expr',xp,{}).am$('termId',2048,'axon::Expr',xp,{}).am$('call',2048,'axon::Expr',sys.List.make(sys.Param.type$,[new sys.Param('target','axon::Expr',false),new sys.Param('isMethod','sys::Bool',false)]),{}).am$('toCall',2048,'axon::Call',sys.List.make(sys.Param.type$,[new sys.Param('target','axon::Expr',false),new sys.Param('args','axon::Expr[]',false)]),{}).am$('toDotCall',2048,'axon::Call',sys.List.make(sys.Param.type$,[new sys.Param('methodName','sys::Str',false),new sys.Param('args','axon::Expr[]',false)]),{}).am$('index',2048,'axon::Expr',sys.List.make(sys.Param.type$,[new sys.Param('target','axon::Expr',false)]),{}).am$('dictGet',2048,'axon::Expr',sys.List.make(sys.Param.type$,[new sys.Param('target','axon::Expr',false)]),{}).am$('lamdba',2048,'axon::Fn',xp,{}).am$('lambda1',2048,'axon::Fn',xp,{}).am$('parenExpr',2048,'axon::Expr',xp,{}).am$('params',2048,'axon::FnParam[]',xp,{}).am$('param',2048,'axon::FnParam',xp,{}).am$('typeRef',2048,'axon::TypeRef',sys.List.make(sys.Param.type$,[new sys.Param('lib','sys::Str?',false)]),{}).am$('specFromDottedPath',2048,'axon::Expr',sys.List.make(sys.Param.type$,[new sys.Param('base','axon::Expr',false),new sys.Param('lastName','sys::Str',false)]),{}).am$('lamdbaBody',2048,'axon::Fn',sys.List.make(sys.Param.type$,[new sys.Param('loc','axon::Loc',false),new sys.Param('params','axon::FnParam[]',false),new sys.Param('topMeta','haystack::Dict?',true)]),{}).am$('optimizeLastReturn',2048,'axon::Expr',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false)]),{}).am$('bindInnersToOuter',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('fn','axon::Fn',false)]),{}).am$('err',4096,'axon::SyntaxErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','axon::Loc',true)]),{}).am$('curLoc',4096,'axon::Loc',xp,{}).am$('consumeId',4096,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('expected','sys::Str',false)]),{}).am$('consumeIdOrKeyword',4096,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('expected','sys::Str',false)]),{}).am$('consumeVal',4096,'sys::Obj?',xp,{}).am$('verify',4096,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','axon::Token',false)]),{}).am$('curToStr',2048,'sys::Str',xp,{}).am$('consume',4096,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','axon::Token?',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Token.type$.af$('id',106506,'axon::Token',{}).af$('typename',106506,'axon::Token',{}).af$('val',106506,'axon::Token',{}).af$('colon',106506,'axon::Token',{}).af$('doubleColon',106506,'axon::Token',{}).af$('dot',106506,'axon::Token',{}).af$('semicolon',106506,'axon::Token',{}).af$('comma',106506,'axon::Token',{}).af$('plus',106506,'axon::Token',{}).af$('minus',106506,'axon::Token',{}).af$('star',106506,'axon::Token',{}).af$('slash',106506,'axon::Token',{}).af$('bang',106506,'axon::Token',{}).af$('caret',106506,'axon::Token',{}).af$('question',106506,'axon::Token',{}).af$('amp',106506,'axon::Token',{}).af$('assign',106506,'axon::Token',{}).af$('fnEq',106506,'axon::Token',{}).af$('eq',106506,'axon::Token',{}).af$('notEq',106506,'axon::Token',{}).af$('lt',106506,'axon::Token',{}).af$('ltEq',106506,'axon::Token',{}).af$('gt',106506,'axon::Token',{}).af$('gtEq',106506,'axon::Token',{}).af$('cmp',106506,'axon::Token',{}).af$('lbrace',106506,'axon::Token',{}).af$('rbrace',106506,'axon::Token',{}).af$('lparen',106506,'axon::Token',{}).af$('rparen',106506,'axon::Token',{}).af$('lbracket',106506,'axon::Token',{}).af$('rbracket',106506,'axon::Token',{}).af$('pipe',106506,'axon::Token',{}).af$('underbar',106506,'axon::Token',{}).af$('arrow',106506,'axon::Token',{}).af$('dotDot',106506,'axon::Token',{}).af$('andKeyword',106506,'axon::Token',{}).af$('catchKeyword',106506,'axon::Token',{}).af$('defcompKeyword',106506,'axon::Token',{}).af$('deflinksKeyword',106506,'axon::Token',{}).af$('doKeyword',106506,'axon::Token',{}).af$('elseKeyword',106506,'axon::Token',{}).af$('endKeyword',106506,'axon::Token',{}).af$('falseKeyword',106506,'axon::Token',{}).af$('ifKeyword',106506,'axon::Token',{}).af$('notKeyword',106506,'axon::Token',{}).af$('nullKeyword',106506,'axon::Token',{}).af$('orKeyword',106506,'axon::Token',{}).af$('returnKeyword',106506,'axon::Token',{}).af$('throwKeyword',106506,'axon::Token',{}).af$('trueKeyword',106506,'axon::Token',{}).af$('tryKeyword',106506,'axon::Token',{}).af$('eof',106506,'axon::Token',{}).af$('vals',106498,'axon::Token[]',{}).af$('keywords',106498,'[sys::Str:axon::Token]',{}).af$('symbol',73730,'sys::Str',{}).af$('keyword',73730,'sys::Bool',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('symbol','sys::Str?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('isKeyword',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{}).am$('fromStr',40966,'axon::Token?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Collector.type$.am$('onStart',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('stream','axon::MStream',false)]),{}).am$('onSignal',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('signal','axon::Signal',false)]),{}).am$('onData',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onFinish',270337,'sys::Obj?',xp,{}).am$('make',139268,'sys::Void',xp,{});
ListCollector.type$.af$('list',67584,'sys::Obj?[]',{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onFinish',271360,'sys::Obj?',xp,{}).am$('make',139268,'sys::Void',xp,{});
DictCollector.type$.af$('map',67584,'[sys::Str:sys::Obj?]?',{}).af$('dict',67584,'haystack::Dict?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict?',true)]),{}).am$('finish',8192,'haystack::Dict',xp,{}).am$('reset',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','haystack::Dict',false)]),{}).am$('merge',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('m','haystack::Dict',false)]),{}).am$('set',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('doSet',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('initMap',2048,'sys::Void',xp,{});
GridCollector.type$.af$('meta',73728,'axon::DictCollector',{}).af$('colMeta',67584,'[sys::Str:axon::DictCollector]',{}).af$('cols',67584,'[sys::Str:sys::Str]',{}).af$('rows',67584,'haystack::Dict[]',{}).af$('removeCols',67584,'sys::Str[]?',{}).af$('keepCols',67584,'sys::Str[]?',{}).af$('keepColsOrdered',67584,'sys::Bool',{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('stream','axon::MStream',false)]),{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onSignal',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('signal','axon::Signal',false)]),{}).am$('toColMeta',2048,'axon::DictCollector',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('addColNames',2048,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('cur','sys::Str[]?',false),new sys.Param('toAdd','sys::Str[]',false)]),{}).am$('onFinish',271360,'haystack::Grid?',xp,{}).am$('applyRemoveCols',2048,'sys::Void',xp,{}).am$('applyKeepCols',2048,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
MStream.type$.af$('prev',73728,'axon::MStream?',{}).af$('next',73728,'axon::MStream?',{}).af$('cx',73728,'axon::AxonContext',{}).af$('complete',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream?',false)]),{}).am$('source',8192,'axon::MStream',xp,{}).am$('terminal',8192,'axon::MStream',xp,{}).am$('walk',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|axon::MStream->sys::Void|',false)]),{}).am$('isSource',270337,'sys::Bool',xp,{}).am$('isTerminal',270337,'sys::Bool',xp,{}).am$('isGridStage',270336,'sys::Bool',xp,{}).am$('signalStart',8192,'sys::Void',xp,{}).am$('signalComplete',8192,'sys::Void',xp,{}).am$('signal',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('signal','axon::Signal',false)]),{}).am$('submit',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('submitAll',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dataList','sys::Obj?[]',false)]),{}).am$('isComplete',8192,'sys::Bool',xp,{}).am$('onData',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('doSignal',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{}).am$('onStart',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{}).am$('onComplete',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{}).am$('onSignal',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{}).am$('funcName',270337,'sys::Str',xp,{}).am$('funcArgs',270336,'sys::Obj?[]',xp,{}).am$('encode',8192,'haystack::Grid',xp,{}).am$('encodeArg',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('decode',40962,'axon::MStream',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('grid','haystack::Grid',false)]),{}).am$('streamToArg',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('fn','axon::TopFn',false),new sys.Param('stream','axon::MStream',false)]),{}).am$('decodeArg',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','axon::AxonContext',false),new sys.Param('val','sys::Obj?',false)]),{});
SourceStream.type$.am$('make',8196,'sys::Void',xp,{}).am$('isSource',9216,'sys::Bool',xp,{}).am$('isTerminal',9216,'sys::Bool',xp,{});
GridStream.type$.af$('grid',65664,'haystack::Grid',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('isGridStage',271360,'sys::Bool',xp,{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{});
GridColStream.type$.af$('grid',65664,'haystack::Grid',{}).af$('col',65664,'haystack::Col',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('col','haystack::Col',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{});
TransformStream.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false)]),{}).am$('isSource',9216,'sys::Bool',xp,{}).am$('isTerminal',9216,'sys::Bool',xp,{});
PassThruStream.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false)]),{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{});
GridTransformStream.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false)]),{}).am$('isGridStage',9216,'sys::Bool',xp,{});
SetMetaStream.type$.af$('meta',67586,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','axon::Signal',false)]),{});
AddMetaStream.type$.af$('meta',67586,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','axon::Signal',false)]),{});
SetColMetaStream.type$.af$('name',67586,'sys::Str',{}).af$('meta',67586,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','axon::Signal',false)]),{});
AddColMetaStream.type$.af$('name',67586,'sys::Str',{}).af$('meta',67586,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','axon::Signal',false)]),{});
ReorderColsStream.type$.af$('cols',67584,'sys::Str[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('cols','sys::Str[]',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','axon::Signal',false)]),{});
KeepColsStream.type$.af$('cols',67586,'sys::Str[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('cols','sys::Str[]',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','axon::Signal',false)]),{});
RemoveColsStream.type$.af$('cols',67584,'sys::Str[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('cols','sys::Str[]',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','axon::Signal',false)]),{});
MapStream.type$.af$('func',67584,'axon::Fn',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('func','axon::Fn',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{});
LimitStream.type$.af$('limit',67586,'sys::Int',{}).af$('count',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('limit','sys::Int',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{});
SkipStream.type$.af$('count',67584,'sys::Int',{}).af$('seen',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('count','sys::Int',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{});
FlatMapStream.type$.af$('func',67586,'axon::Fn',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('func','axon::Fn',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{});
FindAllStream.type$.af$('func',67586,'axon::Fn',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('func','axon::Fn',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{});
FilterStream.type$.af$('filter',67586,'haystack::Filter',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('filter','haystack::Filter',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{});
TerminalStream.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false)]),{}).am$('isSource',9216,'sys::Bool',xp,{}).am$('isTerminal',9216,'sys::Bool',xp,{}).am$('run',8192,'sys::Obj?',xp,{}).am$('onPreRun',270336,'sys::Void',xp,{}).am$('onRun',270337,'sys::Obj?',xp,{});
CollectStream.type$.af$('collector',67584,'axon::Collector?',{}).af$('to',67584,'axon::Fn?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('to','axon::Fn?',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onPreRun',271360,'sys::Void',xp,{}).am$('onSignal',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('signal','axon::Signal',false)]),{}).am$('initCollector',2048,'axon::Collector',xp,{}).am$('inferToGrid',2048,'sys::Bool',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onRun',271360,'sys::Obj?',xp,{});
EachStream.type$.af$('func',67586,'axon::Fn',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('func','axon::Fn',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onRun',271360,'sys::Obj?',xp,{});
EachWhileStream.type$.af$('func',67586,'axon::Fn',{}).af$('result',67584,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('func','axon::Fn',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onRun',271360,'sys::Obj?',xp,{});
FindStream.type$.af$('func',67586,'axon::Fn',{}).af$('result',67584,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('func','axon::Fn',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onRun',271360,'sys::Obj?',xp,{});
ReduceStream.type$.af$('func',67586,'axon::Fn',{}).af$('args',67584,'sys::Obj?[]',{}).af$('acc',67584,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('init','sys::Obj?',false),new sys.Param('func','axon::Fn',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onRun',271360,'sys::Obj?',xp,{});
FoldStream.type$.af$('func',67586,'axon::Fn',{}).af$('args',67584,'sys::Obj?[]',{}).af$('acc',67584,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('func','axon::Fn',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onPreRun',271360,'sys::Void',xp,{}).am$('onRun',271360,'sys::Obj?',xp,{});
FirstStream.type$.af$('result',73728,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('onRun',271360,'sys::Obj?',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{});
LastStream.type$.af$('result',73728,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('onRun',271360,'sys::Obj?',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{});
AnyStream.type$.af$('func',67586,'axon::Fn',{}).af$('result',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('func','axon::Fn',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onRun',271360,'sys::Obj?',xp,{});
AllStream.type$.af$('func',67586,'axon::Fn',{}).af$('result',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false),new sys.Param('func','axon::Fn',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onRun',271360,'sys::Obj?',xp,{});
Signal.type$.af$('start',106498,'axon::Signal',{}).af$('complete',106498,'axon::Signal',{}).af$('type',73730,'axon::SignalType',{}).af$('a',73730,'sys::Obj?',{}).af$('b',73730,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','axon::SignalType',false),new sys.Param('a','sys::Obj?',true),new sys.Param('b','sys::Obj?',true)]),{}).am$('isComplete',8192,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
SignalType.type$.af$('start',106506,'axon::SignalType',{}).af$('err',106506,'axon::SignalType',{}).af$('complete',106506,'axon::SignalType',{}).af$('setMeta',106506,'axon::SignalType',{}).af$('addMeta',106506,'axon::SignalType',{}).af$('setColMeta',106506,'axon::SignalType',{}).af$('addColMeta',106506,'axon::SignalType',{}).af$('reorderCols',106506,'axon::SignalType',{}).af$('keepCols',106506,'axon::SignalType',{}).af$('removeCols',106506,'axon::SignalType',{}).af$('vals',106498,'axon::SignalType[]',{}).af$('isComplete',73730,'sys::Bool',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('isComplete','sys::Bool',true)]),{}).am$('fromStr',40966,'axon::SignalType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
RangeStream.type$.af$('range',67586,'sys::Range',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('range','sys::Range',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{});
ListStream.type$.af$('list',67584,'sys::Obj?[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj?[]',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "axon");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;xeto 3.1.11;haystack 3.1.11");
m.set("pod.summary", "Axon scripting engine");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:26-05:00 New_York");
m.set("build.tsKey", "241210143126");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("hx.docFantom", "true");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "SkyFoundry");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Haxall");
m.set("proj.uri", "https://haxall.io/");
m.set("pod.docApi", "true");
m.set("org.uri", "https://skyfoundry.com/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  AxonContext,
  AxonErr,
  SyntaxErr,
  EvalErr,
  EvalTimeoutErr,
  ThrowErr,
  Axon,
  Comp,
  Expr,
  Fn,
  TopFn,
  FnParam,
  Loc,
  Printer,
  Literal,
  CellDef,
  CompDef,
  ExprType,
  Cell,
  AbstractComp,
  TagNameUsage,
  CoreLib,
  FantomFn,
  FantomClosureFn,
  Tokenizer,
  Parser,
  Token,
  Collector,
  ListCollector,
  DictCollector,
  GridCollector,
  MStream,
  SourceStream,
  TransformStream,
  PassThruStream,
  TerminalStream,
  Signal,
  SignalType,
};
