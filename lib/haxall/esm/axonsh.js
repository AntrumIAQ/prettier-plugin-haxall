// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as fandoc from './fandoc.js'
import * as inet from './inet.js'
import * as rdf from './rdf.js'
import * as syntax from './syntax.js'
import * as util from './util.js'
import * as web from './web.js'
import * as compilerDoc from './compilerDoc.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as defc from './defc.js'
import * as folio from './folio.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
import * as xetoEnv from './xetoEnv.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class ShellContext extends hx.HxContext {
  constructor() {
    super();
    const this$ = this;
    this.#showTrace = true;
    this.#isDone = false;
    return;
  }

  typeof() { return ShellContext.type$; }

  #showTrace = false;

  showTrace(it) {
    if (it === undefined) {
      return this.#showTrace;
    }
    else {
      this.#showTrace = it;
      return;
    }
  }

  static #noEcho = undefined;

  static noEcho() {
    if (ShellContext.#noEcho === undefined) {
      ShellContext.static$init();
      if (ShellContext.#noEcho === undefined) ShellContext.#noEcho = null;
    }
    return ShellContext.#noEcho;
  }

  #out = null;

  out() {
    return this.#out;
  }

  #isDone = false;

  isDone(it) {
    if (it === undefined) {
      return this.#isDone;
    }
    else {
      this.#isDone = it;
      return;
    }
  }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #user = null;

  user() { return this.#user; }

  __user(it) { if (it === undefined) return this.#user; else this.#user = it; }

  #funcs = null;

  funcs(it) {
    if (it === undefined) {
      return this.#funcs;
    }
    else {
      this.#funcs = it;
      return;
    }
  }

  #inference$Store = undefined;

  // private field reflection only
  __inference$Store(it) { if (it === undefined) return this.#inference$Store; else this.#inference$Store = it; }

  static make(out) {
    const $self = new ShellContext();
    ShellContext.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    if (out === undefined) out = sys.Env.cur().out();
    hx.HxContext.make$($self);
    ;
    $self.#out = out;
    $self.#funcs = ShellContext.loadBuiltInFuncs();
    $self.#rt = ShellRuntime.make();
    $self.#user = ShellUser.make();
    return;
  }

  runInteractive() {
    this.#out.printLine(sys.Str.plus(sys.Str.plus("Axon shell v", sys.ObjUtil.typeof(this).pod().version()), " ('?' for help, 'quit' to quit)"));
    while (!this.#isDone) {
      try {
        let expr = this.prompt();
        if (!sys.Str.isEmpty(expr)) {
          this.run(expr);
        }
        ;
      }
      catch ($_u0) {
        $_u0 = sys.Err.make($_u0);
        if ($_u0 instanceof axon.SyntaxErr) {
          let e = $_u0;
          ;
          this.err(sys.Str.plus("Syntax Error: ", e.msg()));
        }
        else if ($_u0 instanceof axon.EvalErr) {
          let e = $_u0;
          ;
          this.err(e.msg(), e.cause());
        }
        else if ($_u0 instanceof sys.Err) {
          let e = $_u0;
          ;
          this.err(e.toStr(), e);
        }
        else {
          throw $_u0;
        }
      }
      ;
    }
    ;
    return 0;
  }

  run(expr) {
    if ((sys.Str.contains(expr, ";") || sys.Str.contains(expr, "\n"))) {
      (expr = sys.Str.plus(sys.Str.plus("do\n", expr), "\nend"));
    }
    ;
    let val = null;
    try {
      (val = this.eval(expr));
    }
    catch ($_u1) {
      $_u1 = sys.Err.make($_u1);
      if ($_u1 instanceof axon.EvalErr) {
        let e = $_u1;
        ;
        this.err(e.msg(), e.cause());
        return 1;
      }
      else {
        throw $_u1;
      }
    }
    ;
    if (val !== ShellContext.noEcho()) {
      this.print(val);
    }
    ;
    if ((val != null && sys.ObjUtil.compareNE(val, ShellContext.noEcho()))) {
      this.defOrAssign("it", val, axon.Loc.eval());
    }
    ;
    return 0;
  }

  prompt() {
    let expr = sys.Str.trim(sys.Env.cur().prompt("axon> "));
    if (this.isMultiLine(expr)) {
      let x = sys.StrBuf.make().add(expr).add("\n");
      while (true) {
        let next = sys.Env.cur().prompt("..... ");
        if (sys.Str.isEmpty(sys.Str.trim(next))) {
          break;
        }
        ;
        x.add(next).add("\n");
      }
      ;
      (expr = x.toStr());
    }
    ;
    let $_u2 = expr;
    if (sys.ObjUtil.equals($_u2, "?") || sys.ObjUtil.equals($_u2, "help")) {
      return "help()";
    }
    else if (sys.ObjUtil.equals($_u2, "bye") || sys.ObjUtil.equals($_u2, "exit") || sys.ObjUtil.equals($_u2, "quit")) {
      return "quit()";
    }
    ;
    return expr;
  }

  isMultiLine(expr) {
    if (sys.Str.endsWith(expr, "do")) {
      return true;
    }
    ;
    if (sys.Str.endsWith(expr, "{")) {
      return true;
    }
    ;
    return false;
  }

  print(val,opts) {
    if (opts === undefined) opts = null;
    this.printer(opts).print(val);
    return;
  }

  err(msg,err) {
    if (err === undefined) err = null;
    let str = this.errToStr(msg, err);
    if (!sys.Str.endsWith(str, "\n")) {
      str = sys.Str.plus(str, "\n");
    }
    ;
    this.printer().warn(str);
    return null;
  }

  errToStr(msg,err) {
    let str = sys.Str.plus("ERROR: ", msg);
    if (err == null) {
      return str;
    }
    ;
    if (sys.ObjUtil.is(err, util.FileLocErr.type$)) {
      str = sys.Str.plus(str, sys.Str.plus(sys.Str.plus(" [", sys.ObjUtil.coerce(err, util.FileLocErr.type$).loc()), "]"));
    }
    ;
    if (this.#showTrace) {
      str = sys.Str.plus(str, sys.Str.plus("\n", err.traceToStr()));
    }
    else {
      if (!sys.Str.contains(str, "\n")) {
        str = sys.Str.plus(str, sys.Str.plus("\n", err.toStr()));
      }
      ;
    }
    ;
    return str;
  }

  printer(opts) {
    if (opts === undefined) opts = null;
    return xetoEnv.Printer.make(sys.ObjUtil.coerce(this.xeto(), xetoEnv.MNamespace.type$), this.#out, sys.ObjUtil.coerce(((this$) => { let $_u3 = opts; if ($_u3 != null) return $_u3; return haystack.Etc.dict0(); })(this), xeto.Dict.type$));
  }

  ns() {
    return this.#rt.ns();
  }

  db() {
    return sys.ObjUtil.coerce(this.#rt.db(), ShellFolio.type$);
  }

  session(checked) {
    if (checked === undefined) checked = true;
    if (checked) {
      throw hx.SessionUnavailableErr.make("ShellContext");
    }
    ;
    return null;
  }

  about() {
    return haystack.Etc.dict0();
  }

  xetoReadById(id) {
    return this.db().readById(sys.ObjUtil.coerce(id, haystack.Ref.type$.toNullable()), false);
  }

  xetoReadAllEachWhile(filter,f) {
    return this.db().readAllEachWhile(sys.ObjUtil.coerce(haystack.Filter.fromStr(filter), haystack.Filter.type$), haystack.Etc.dict0(), f);
  }

  deref(id) {
    return this.db().readById(id, false);
  }

  inference() {
    if (this.#inference$Store === undefined) {
      this.#inference$Store = this.inference$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#inference$Store, haystack.FilterInference.type$);
  }

  toDict() {
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    tags.set("axonsh", haystack.Marker.val());
    tags.set("locale", sys.Locale.cur().toStr());
    tags.set("username", this.#user.username());
    tags.set("userRef", this.#user.id());
    return haystack.Etc.dictMerge(hx.HxContext.prototype.toDict.call(this), tags);
  }

  canRead(rec) {
    return true;
  }

  canWrite(rec) {
    return true;
  }

  commitInfo() {
    return this.#user;
  }

  findTop(name,checked) {
    if (checked === undefined) checked = true;
    let f = this.#funcs.get(name);
    if (f != null) {
      return f;
    }
    ;
    if (checked) {
      throw haystack.UnknownFuncErr.make(name);
    }
    ;
    return null;
  }

  trapRef(id,checked) {
    if (checked === undefined) checked = true;
    return this.db().readById(id, checked);
  }

  static loadBuiltInFuncs() {
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("axon::TopFn"));
    acc.addAll(axon.FantomFn.reflectType(axon.CoreLib.type$));
    acc.addAll(axon.FantomFn.reflectType(ShellFuncs.type$));
    acc.addAll(axon.FantomFn.reflectType(hx.HxCoreFuncs.type$));
    acc.addAll(axon.FantomFn.reflectType(sys.ObjUtil.coerce(sys.Type.find("hxXeto::XetoFuncs"), sys.Type.type$)));
    acc.addAll(axon.FantomFn.reflectType(sys.ObjUtil.coerce(sys.Type.find("hxIO::IOFuncs"), sys.Type.type$)));
    return acc;
  }

  resolveFile(uri) {
    return sys.ObjUtil.coerce(sys.File.make(uri, false), sys.File.type$);
  }

  inference$Once() {
    return def.MFilterInference.make(this.ns());
  }

  static static$init() {
    ShellContext.#noEcho = "_no_echo_";
    return;
  }

}

class ShellFolio extends folio.Folio {
  constructor() {
    super();
    const this$ = this;
    this.#curVerRef = concurrent.AtomicInt.make(1);
    this.#map = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return ShellFolio.type$; }

  #curVerRef = null;

  // private field reflection only
  __curVerRef(it) { if (it === undefined) return this.#curVerRef; else this.#curVerRef = it; }

  #flushMode = null;

  flushMode(it) {
    if (it === undefined) {
      return "fsync";
    }
    else {
      throw sys.UnsupportedErr.make();
    }
  }

  #map = null;

  // private field reflection only
  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  static make(config) {
    const $self = new ShellFolio();
    ShellFolio.make$($self,config);
    return $self;
  }

  static make$($self,config) {
    folio.Folio.make$($self, config);
    ;
    return;
  }

  passwords() {
    throw sys.UnsupportedErr.make();
  }

  curVer() {
    return this.#curVerRef.val();
  }

  flush() {
    return;
  }

  doCloseAsync() {
    return sys.ObjUtil.coerce(folio.FolioFuture.makeSync(folio.CountFolioRes.make(0)), folio.FolioFuture.type$);
  }

  doReadByIds(ids) {
    const this$ = this;
    let map = this.#map;
    let acc = sys.List.make(haystack.Dict.type$.toNullable());
    let errMsg = "";
    let dicts = sys.List.make(haystack.Dict.type$.toNullable());
    dicts.size(ids.size());
    ids.each((id,i) => {
      let rec = map.get(id);
      if (rec != null) {
        dicts.set(i, sys.ObjUtil.coerce(rec, haystack.Dict.type$.toNullable()));
      }
      else {
        if (sys.Str.isEmpty(errMsg)) {
          (errMsg = id.toStr());
        }
        ;
      }
      ;
      return;
    });
    let errs = !sys.Str.isEmpty(errMsg);
    return sys.ObjUtil.coerce(folio.FolioFuture.makeSync(folio.ReadFolioRes.make(errMsg, errs, dicts)), folio.FolioFuture.type$);
  }

  doReadAll(filter,opts) {
    const this$ = this;
    let errMsg = filter.toStr();
    let acc = sys.List.make(haystack.Dict.type$);
    this.doReadAllEachWhile(filter, opts, (rec) => {
      acc.add(rec);
      return null;
    });
    if ((opts != null && opts.has("sort"))) {
      (acc = haystack.Etc.sortDictsByDis(acc));
    }
    ;
    return sys.ObjUtil.coerce(folio.FolioFuture.makeSync(folio.ReadFolioRes.make(errMsg, false, acc)), folio.FolioFuture.type$);
  }

  doReadCount(filter,opts) {
    const this$ = this;
    let count = 0;
    this.doReadAllEachWhile(filter, opts, () => {
      ((this$) => { let $_u4 = count;count = sys.Int.increment(count); return $_u4; })(this$);
      return;
    });
    return count;
  }

  doReadAllEachWhile(filter,opts,f) {
    const this$ = this;
    if (opts == null) {
      (opts = haystack.Etc.dict0());
    }
    ;
    let limit = ((this$) => { let $_u5 = ((this$) => { let $_u6 = sys.ObjUtil.as(opts.get("limit"), haystack.Number.type$); if ($_u6 == null) return null; return sys.ObjUtil.as(opts.get("limit"), haystack.Number.type$).toInt(); })(this$); if ($_u5 != null) return $_u5; return sys.ObjUtil.coerce(10000, sys.Int.type$.toNullable()); })(this);
    let skipTrash = opts.missing("trash");
    let map = this.#map;
    let cx = haystack.PatherContext.make((id) => {
      return sys.ObjUtil.coerce(map.get(id), haystack.Dict.type$.toNullable());
    });
    let count = 0;
    return this.eachWhile((rec) => {
      if (!filter.matches(rec, cx)) {
        return null;
      }
      ;
      if ((rec.has("trash") && skipTrash)) {
        return null;
      }
      ;
      ((this$) => { let $_u7 = count;count = sys.Int.increment(count); return $_u7; })(this$);
      let x = sys.Func.call(f, rec);
      if (x != null) {
        return x;
      }
      ;
      return ((this$) => { if (sys.ObjUtil.compareGE(count, limit)) return "break"; return null; })(this$);
    });
  }

  his() {
    throw sys.UnsupportedErr.make();
  }

  backup() {
    throw sys.UnsupportedErr.make();
  }

  doCommitAllAsync(diffs,cxInfo) {
    const this$ = this;
    folio.FolioUtil.checkDiffs(diffs);
    let newMod = sys.DateTime.nowUtc(null);
    let internedIds = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Ref"));
    (diffs = sys.ObjUtil.coerce(diffs.map((diff) => {
      return this$.commitApply(diff, internedIds, newMod);
    }, sys.Obj.type$.toNullable()), sys.Type.find("folio::Diff[]")));
    diffs.each((diff) => {
      if (diff.isRemove()) {
        this$.#map.remove(diff.id());
      }
      else {
        this$.#map.set(diff.id(), sys.ObjUtil.coerce(diff.newRec(), sys.Obj.type$));
      }
      ;
      return;
    });
    this.refreshDisAll();
    return sys.ObjUtil.coerce(folio.FolioFuture.makeSync(folio.CommitFolioRes.make(diffs)), folio.FolioFuture.type$);
  }

  commitApply(diff,internedIds,newMod) {
    const this$ = this;
    let id = this.commitNorm(diff.id(), internedIds);
    let oldRec = sys.ObjUtil.as(this.#map.get(id), haystack.Dict.type$);
    if (diff.isAdd()) {
      if (oldRec != null) {
        throw folio.CommitErr.make(sys.Str.plus("Rec already exists: ", diff.id()));
      }
      ;
    }
    else {
      if (oldRec == null) {
        throw folio.CommitErr.make(sys.Str.plus("Rec not found: ", diff.id()));
      }
      ;
      if ((!diff.isForce() && sys.ObjUtil.compareNE(oldRec.trap("mod", sys.List.make(sys.Obj.type$.toNullable(), [])), diff.oldMod()))) {
        throw folio.ConcurrentChangeErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", diff.id()), ": "), oldRec.trap("mod", sys.List.make(sys.Obj.type$.toNullable(), []))), " != "), diff.oldMod()));
      }
      ;
    }
    ;
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    if (oldRec != null) {
      oldRec.each((v,n) => {
        tags.set(n, v);
        return;
      });
    }
    ;
    diff.changes().each((v,n) => {
      if (v === haystack.Remove.val()) {
        tags.remove(n);
      }
      else {
        tags.set(n, this$.commitNorm(v, internedIds));
      }
      ;
      return;
    });
    tags.set("id", id);
    if (!diff.isTransient()) {
      tags.set("mod", newMod);
    }
    ;
    let newRec = haystack.Etc.dictFromMap(tags);
    newRec.id().disVal(newRec.dis());
    return folio.Diff.makeAll(sys.ObjUtil.coerce(id, haystack.Ref.type$), diff.oldMod(), oldRec, newMod, newRec, diff.changes(), diff.flags());
  }

  commitNorm(val,internedIds) {
    let id = sys.ObjUtil.as(val, haystack.Ref.type$);
    if (id == null) {
      return val;
    }
    ;
    let interned = internedIds.get(sys.ObjUtil.coerce(id, haystack.Ref.type$));
    if (interned != null) {
      return sys.ObjUtil.coerce(interned, sys.Obj.type$);
    }
    ;
    let rec = sys.ObjUtil.as(this.#map.get(sys.ObjUtil.coerce(id, sys.Obj.type$)), haystack.Dict.type$);
    if (rec != null) {
      return rec.id();
    }
    ;
    if (id.disVal() != null) {
      (id = haystack.Ref.make(id.id(), null));
    }
    ;
    internedIds.set(sys.ObjUtil.coerce(id, haystack.Ref.type$), sys.ObjUtil.coerce(id, haystack.Ref.type$));
    return sys.ObjUtil.coerce(id, sys.Obj.type$);
  }

  refreshDisAll() {
    const this$ = this;
    this.#map.each(sys.ObjUtil.coerce((rec) => {
      rec.id().disVal(null);
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    this.#map.each(sys.ObjUtil.coerce((rec) => {
      this$.refreshDis(rec);
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    return;
  }

  refreshDis(rec) {
    let id = rec.id();
    id.disVal(id.id());
    let disMacro = sys.ObjUtil.as(rec.get("disMacro", null), sys.Str.type$);
    let dis = ((this$) => { if (disMacro != null) return DisMacro.make(sys.ObjUtil.coerce(disMacro, sys.Str.type$), rec, this$).apply(); return rec.dis(null, null); })(this);
    id.disVal(dis);
    return sys.ObjUtil.coerce(dis, sys.Str.type$);
  }

  toDis(id) {
    if (id.disVal() != null) {
      return sys.ObjUtil.coerce(id.disVal(), sys.Str.type$);
    }
    ;
    let rec = this.#map.get(id);
    if (rec == null) {
      return id.id();
    }
    ;
    return this.refreshDis(sys.ObjUtil.coerce(rec, haystack.Dict.type$));
  }

  eachWhile(f) {
    return this.#map.eachWhile(sys.ObjUtil.coerce(f, sys.Type.find("|sys::Obj,sys::Obj->sys::Obj?|")));
  }

  each(f) {
    this.#map.each(sys.ObjUtil.coerce(f, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    return;
  }

}

class DisMacro extends haystack.Macro {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DisMacro.type$; }

  #db = null;

  db() { return this.#db; }

  __db(it) { if (it === undefined) return this.#db; else this.#db = it; }

  static make(p,s,db) {
    const $self = new DisMacro();
    DisMacro.make$($self,p,s,db);
    return $self;
  }

  static make$($self,p,s,db) {
    haystack.Macro.make$($self, p, s);
    $self.#db = db;
    return;
  }

  refToDis(ref) {
    return this.#db.toDis(ref);
  }

}

class ShellUser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellUser.type$; }

  #username = null;

  username() { return this.#username; }

  __username(it) { if (it === undefined) return this.#username; else this.#username = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #isSu = false;

  isSu() { return this.#isSu; }

  __isSu(it) { if (it === undefined) return this.#isSu; else this.#isSu = it; }

  #isAdmin = false;

  isAdmin() { return this.#isAdmin; }

  __isAdmin(it) { if (it === undefined) return this.#isAdmin; else this.#isAdmin = it; }

  #email = null;

  email() { return this.#email; }

  __email(it) { if (it === undefined) return this.#email; else this.#email = it; }

  #mod = null;

  mod() { return this.#mod; }

  __mod(it) { if (it === undefined) return this.#mod; else this.#mod = it; }

  #access = null;

  access() { return this.#access; }

  __access(it) { if (it === undefined) return this.#access; else this.#access = it; }

  static make() {
    const $self = new ShellUser();
    ShellUser.make$($self);
    return $self;
  }

  static make$($self) {
    $self.#username = haystack.Etc.toTagName(sys.Env.cur().user());
    $self.#id = sys.ObjUtil.coerce(haystack.Ref.fromStr(sys.Str.plus(sys.Str.plus(haystack.RefSchemes.user(), ":"), $self.#username)), haystack.Ref.type$);
    $self.#mod = sys.DateTime.nowUtc();
    $self.#meta = haystack.Etc.dict3("username", $self.#username, "id", $self.#id, "mod", $self.#mod);
    $self.#dis = $self.#username;
    $self.#isAdmin = true;
    $self.#isSu = true;
    $self.#access = ShellUserAccess.make();
    return;
  }

  toStr() {
    return this.#username;
  }

}

class ShellUserAccess extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellUserAccess.type$; }

  canPointWriteAtLevel(level) {
    return true;
  }

  static make() {
    const $self = new ShellUserAccess();
    ShellUserAccess.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Main extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#out = sys.Env.cur().out();
    return;
  }

  typeof() { return Main.type$; }

  #out = null;

  out(it) {
    if (it === undefined) {
      return this.#out;
    }
    else {
      this.#out = it;
      return;
    }
  }

  main(mainArgs) {
    const this$ = this;
    let opts = mainArgs.findAll((it) => {
      return sys.Str.startsWith(it, "-");
    });
    let args = mainArgs.findAll((it) => {
      return !sys.Str.startsWith(it, "-");
    });
    if (this.hasOpt(opts, "-help", "-?")) {
      return this.printHelp();
    }
    ;
    if (this.hasOpt(opts, "-version", "-v")) {
      return this.printVersion();
    }
    ;
    let cx = ShellContext.make(this.#out);
    if (args.isEmpty()) {
      return cx.runInteractive();
    }
    ;
    let arg = args.get(0);
    cx.defOrAssign("args", mainArgs.getRange(sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(mainArgs.index(arg), sys.Int.type$), 1), -1)), axon.Loc.make("main"));
    if (sys.Str.endsWith(arg, ".axon")) {
      (arg = sys.File.os(arg).readAllStr());
      if (sys.Str.startsWith(arg, "#!")) {
        (arg = sys.Str.splitLines(arg).getRange(sys.Range.make(1, -1)).join("\n"));
      }
      ;
    }
    ;
    let errnum = cx.run(arg);
    if (this.hasOpt(opts, "-i")) {
      return cx.runInteractive();
    }
    else {
      return errnum;
    }
    ;
  }

  hasOpt(opts,name,abbr) {
    if (abbr === undefined) abbr = null;
    const this$ = this;
    return opts.any((it) => {
      return (sys.ObjUtil.equals(it, name) || sys.ObjUtil.equals(it, abbr));
    });
  }

  printHelp() {
    this.#out.printLine();
    this.#out.printLine("Usage:");
    this.#out.printLine("  axon              Start interactive shell");
    this.#out.printLine("  axon file         Execute axon script from file");
    this.#out.printLine("  axon 'expr'       Evaluate axon expression");
    this.#out.printLine("  axon 'expr' -i    Eval axon and then enter interactive shell");
    this.#out.printLine("Options:");
    this.#out.printLine("  -help, -?         Print usage help");
    this.#out.printLine("  -version, -v      Print version info");
    this.#out.printLine("  -i                Enter interactive shell after eval");
    this.#out.printLine();
    return 0;
  }

  printVersion() {
    const this$ = this;
    let props = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj]"));
    props.set("axon.version", sys.ObjUtil.typeof(this).pod().version().toStr());
    util.AbstractMain.runtimeProps(props);
    let out = sys.Env.cur().out();
    out.printLine();
    out.printLine("Axon Shell");
    out.printLine(sys.Str.plus(sys.Str.plus("Copyright (c) 2022-", sys.ObjUtil.coerce(sys.Date.today().year(), sys.Obj.type$.toNullable())), ", SkyFoundry LLC"));
    out.printLine("Licensed under the Academic Free License version 3.0");
    out.printLine();
    util.AbstractMain.printProps(props, sys.Map.__fromLiteral(["out"], [out], sys.Type.find("sys::Str"), sys.Type.find("sys::OutStream")));
    out.printLine();
    return 0;
  }

  static make() {
    const $self = new Main();
    Main.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class ShellStdServices {
  constructor() {
    const this$ = this;
  }

  typeof() { return ShellStdServices.type$; }

  context() {
    return sys.ObjUtil.coerce(this.service(hx.HxContextService.type$), hx.HxContextService.type$);
  }

  obs() {
    return sys.ObjUtil.coerce(this.service(hx.HxObsService.type$), hx.HxObsService.type$);
  }

  watch() {
    return sys.ObjUtil.coerce(this.service(hx.HxWatchService.type$), hx.HxWatchService.type$);
  }

  file() {
    return sys.ObjUtil.coerce(this.service(hx.HxFileService.type$), hx.HxFileService.type$);
  }

  his() {
    return sys.ObjUtil.coerce(this.service(hx.HxHisService.type$), hx.HxHisService.type$);
  }

  crypto() {
    return sys.ObjUtil.coerce(this.service(hx.HxCryptoService.type$), hx.HxCryptoService.type$);
  }

  http() {
    return sys.ObjUtil.coerce(this.service(hx.HxHttpService.type$), hx.HxHttpService.type$);
  }

  user() {
    return sys.ObjUtil.coerce(this.service(hx.HxUserService.type$), hx.HxUserService.type$);
  }

  io() {
    return sys.ObjUtil.coerce(this.service(hx.HxIOService.type$), hx.HxIOService.type$);
  }

  task() {
    return sys.ObjUtil.coerce(this.service(hx.HxTaskService.type$), hx.HxTaskService.type$);
  }

  conn() {
    return sys.ObjUtil.coerce(this.service(hx.HxConnService.type$), hx.HxConnService.type$);
  }

  pointWrite() {
    return sys.ObjUtil.coerce(this.service(hx.HxPointWriteService.type$), hx.HxPointWriteService.type$);
  }

}

class ShellServiceRegistry extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellServiceRegistry.type$; }

  obs() { return ShellStdServices.prototype.obs.apply(this, arguments); }

  conn() { return ShellStdServices.prototype.conn.apply(this, arguments); }

  io() { return ShellStdServices.prototype.io.apply(this, arguments); }

  pointWrite() { return ShellStdServices.prototype.pointWrite.apply(this, arguments); }

  crypto() { return ShellStdServices.prototype.crypto.apply(this, arguments); }

  file() { return ShellStdServices.prototype.file.apply(this, arguments); }

  his() { return ShellStdServices.prototype.his.apply(this, arguments); }

  task() { return ShellStdServices.prototype.task.apply(this, arguments); }

  watch() { return ShellStdServices.prototype.watch.apply(this, arguments); }

  context() { return ShellStdServices.prototype.context.apply(this, arguments); }

  http() { return ShellStdServices.prototype.http.apply(this, arguments); }

  user() { return ShellStdServices.prototype.user.apply(this, arguments); }

  #list = null;

  list() { return this.#list; }

  __list(it) { if (it === undefined) return this.#list; else this.#list = it; }

  #map = null;

  // private field reflection only
  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  static make(rt) {
    const $self = new ShellServiceRegistry();
    ShellServiceRegistry.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Type"), sys.Type.find("hx::HxService[]"));
    map.set(hx.HxContextService.type$, sys.List.make(hx.HxService.type$, [ShellContextService.make(rt)]));
    map.set(hx.HxFileService.type$, sys.List.make(hx.HxService.type$, [ShellFileService.make()]));
    $self.#list = sys.ObjUtil.coerce(((this$) => { let $_u10 = map.keys().sort(); if ($_u10 == null) return null; return sys.ObjUtil.toImmutable(map.keys().sort()); })($self), sys.Type.find("sys::Type[]"));
    $self.#map = sys.ObjUtil.coerce(((this$) => { let $_u11 = map; if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(map); })($self), sys.Type.find("[sys::Type:hx::HxService[]]"));
    return;
  }

  service(type) {
    return sys.ObjUtil.coerce(this.get(type, true), hx.HxService.type$);
  }

  get(type,checked) {
    if (checked === undefined) checked = true;
    let x = this.#map.get(type);
    if (x != null) {
      return x.first();
    }
    ;
    if (checked) {
      throw sys.UnknownServiceErr.make(type.qname());
    }
    ;
    return null;
  }

  getAll(type) {
    return sys.ObjUtil.coerce(((this$) => { let $_u12 = this$.#map.get(type); if ($_u12 != null) return $_u12; return hx.HxService.type$.emptyList(); })(this), sys.Type.find("hx::HxService[]"));
  }

}

class ShellContextService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellContextService.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  static make(rt) {
    const $self = new ShellContextService();
    ShellContextService.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    $self.#rt = rt;
    return;
  }

  create(user) {
    throw sys.UnsupportedErr.make();
  }

  createSession(session) {
    throw sys.UnsupportedErr.make();
  }

  xetoReload() {
    this.#rt.ns().xetoReload();
    return;
  }

}

class ShellFileService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellFileService.type$; }

  resolve(uri) {
    return sys.ObjUtil.coerce(sys.File.make(uri, false), sys.File.type$);
  }

  static make() {
    const $self = new ShellFileService();
    ShellFileService.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ShellRuntime extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#services = ShellServiceRegistry.make(this);
    return;
  }

  typeof() { return ShellRuntime.type$; }

  obs() { return ShellStdServices.prototype.obs.apply(this, arguments); }

  conn() { return ShellStdServices.prototype.conn.apply(this, arguments); }

  io() { return ShellStdServices.prototype.io.apply(this, arguments); }

  pointWrite() { return ShellStdServices.prototype.pointWrite.apply(this, arguments); }

  crypto() { return ShellStdServices.prototype.crypto.apply(this, arguments); }

  file() { return ShellStdServices.prototype.file.apply(this, arguments); }

  his() { return ShellStdServices.prototype.his.apply(this, arguments); }

  task() { return ShellStdServices.prototype.task.apply(this, arguments); }

  watch() { return ShellStdServices.prototype.watch.apply(this, arguments); }

  context() { return ShellStdServices.prototype.context.apply(this, arguments); }

  http() { return ShellStdServices.prototype.http.apply(this, arguments); }

  user() { return ShellStdServices.prototype.user.apply(this, arguments); }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #platform = null;

  platform() { return this.#platform; }

  __platform(it) { if (it === undefined) return this.#platform; else this.#platform = it; }

  #config = null;

  config() { return this.#config; }

  __config(it) { if (it === undefined) return this.#config; else this.#config = it; }

  #db = null;

  db() { return this.#db; }

  __db(it) { if (it === undefined) return this.#db; else this.#db = it; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #services = null;

  services() { return this.#services; }

  __services(it) { if (it === undefined) return this.#services; else this.#services = it; }

  static make() {
    const $self = new ShellRuntime();
    ShellRuntime.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    ;
    $self.#name = "axonsh";
    $self.#dir = sys.Env.cur().workDir().plus(sys.Uri.fromStr("axonsh/"));
    $self.#version = sys.ObjUtil.typeof($self).pod().version();
    $self.#platform = hx.HxPlatform.make(haystack.Etc.dict1("axonsh", haystack.Marker.val()));
    $self.#config = hx.HxConfig.make(haystack.Etc.dict0());
    $self.#db = ShellFolio.make(folio.FolioConfig.make((it) => {
      it.__name(this$.#name);
      it.__dir(this$.#dir);
      return;
    }));
    $self.#ns = ShellNamespace.init($self);
    return;
  }

  dis() {
    return this.#name;
  }

  meta() {
    return haystack.Etc.dict0();
  }

  lib(name,checked) {
    if (checked === undefined) checked = true;
    return this.libs().get(name, checked);
  }

  libs() {
    throw sys.UnsupportedErr.make();
  }

  isSteadyState() {
    return true;
  }

  sync(timeout) {
    if (timeout === undefined) timeout = sys.Duration.fromStr("30sec");
    return this;
  }

  isRunning() {
    return true;
  }

  service(type) {
    return sys.ObjUtil.coerce(this.#services.get(type, true), hx.HxService.type$);
  }

}

class ShellNamespace extends def.MBuiltNamespace {
  constructor() {
    super();
    const this$ = this;
    this.#repo = xeto.LibRepo.cur();
    this.#xetoRef = concurrent.AtomicRef.make(this.createDefaultNamespace());
    return;
  }

  typeof() { return ShellNamespace.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #repo = null;

  repo() { return this.#repo; }

  __repo(it) { if (it === undefined) return this.#repo; else this.#repo = it; }

  #xetoRef = null;

  xetoRef() { return this.#xetoRef; }

  __xetoRef(it) { if (it === undefined) return this.#xetoRef; else this.#xetoRef = it; }

  static init(rt) {
    const this$ = this;
    let c = sys.ObjUtil.coerce(sys.ObjUtil.with(defc.DefCompiler.make(), (it) => {
      it.factory(ShellDefFactory.make(rt));
      return;
    }), defc.DefCompiler.type$);
    return sys.ObjUtil.coerce(c.compileNamespace(), ShellNamespace.type$);
  }

  static make(b,rt) {
    const $self = new ShellNamespace();
    ShellNamespace.make$($self,b,rt);
    return $self;
  }

  static make$($self,b,rt) {
    def.MBuiltNamespace.make$($self, b);
    ;
    $self.#rt = rt;
    return;
  }

  xetoReload() {
    this.#xetoRef.val(this.createDefaultNamespace());
    return;
  }

  createDefaultNamespace() {
    return this.#repo.createNamespace(sys.List.make(xeto.LibVersion.type$.toNullable(), [this.#repo.latest("sys")]));
  }

  addUsing(libName,out) {
    const this$ = this;
    let depends = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::LibDepend"));
    this.xeto().libs().each((lib) => {
      depends.set(lib.name(), sys.ObjUtil.coerce(xeto.LibDepend.make(lib.name(), sys.ObjUtil.coerce(xeto.LibDependVersions.fromVersion(lib.version()), xeto.LibDependVersions.type$)), xeto.LibDepend.type$));
      return;
    });
    if (sys.ObjUtil.equals(libName, "*")) {
      this.#repo.libs().each((x) => {
        if (depends.get(x) != null) {
          return;
        }
        ;
        depends.set(x, sys.ObjUtil.coerce(xeto.LibDepend.make(x), xeto.LibDepend.type$));
        return;
      });
    }
    else {
      depends.set(libName, sys.ObjUtil.coerce(xeto.LibDepend.make(libName), xeto.LibDepend.type$));
    }
    ;
    let vers = this.#repo.solveDepends(depends.vals());
    let old = this.xeto();
    vers.each((ver) => {
      if (old.version(ver.name(), false) == null) {
        out.printLine(sys.Str.plus("using ", ver.name()));
      }
      ;
      return;
    });
    this.#xetoRef.val(this.#repo.createNamespace(vers));
    return;
  }

}

class ShellXetoGetter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellXetoGetter.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  static make(rt) {
    const $self = new ShellXetoGetter();
    ShellXetoGetter.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    $self.#rt = rt;
    return;
  }

  get() {
    return sys.ObjUtil.coerce(this.#rt.ns().xetoRef().val(), xeto.LibNamespace.type$);
  }

}

class ShellDefFactory extends def.DefFactory {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellDefFactory.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  static make(rt) {
    const $self = new ShellDefFactory();
    ShellDefFactory.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    def.DefFactory.make$($self);
    $self.#rt = rt;
    return;
  }

  createNamespace(b) {
    b.xetoGetter(ShellXetoGetter.make(this.#rt));
    return ShellNamespace.make(b, this.#rt);
  }

}

class ShellLoader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#shortIds = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Ref"));
    return;
  }

  typeof() { return ShellLoader.type$; }

  #cx = null;

  // private field reflection only
  __cx(it) { if (it === undefined) return this.#cx; else this.#cx = it; }

  #uri = null;

  // private field reflection only
  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #opts = null;

  // private field reflection only
  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #useShortIds = false;

  // private field reflection only
  __useShortIds(it) { if (it === undefined) return this.#useShortIds; else this.#useShortIds = it; }

  #shortIdWidth = 0;

  // private field reflection only
  __shortIdWidth(it) { if (it === undefined) return this.#shortIdWidth; else this.#shortIdWidth = it; }

  #shortIds = null;

  // private field reflection only
  __shortIds(it) { if (it === undefined) return this.#shortIds; else this.#shortIds = it; }

  static make(cx,uri,opts) {
    const $self = new ShellLoader();
    ShellLoader.make$($self,cx,uri,opts);
    return $self;
  }

  static make$($self,cx,uri,opts) {
    ;
    $self.#cx = cx;
    $self.#uri = uri;
    $self.#opts = opts;
    $self.#useShortIds = opts.has("shortIds");
    return;
  }

  load() {
    const this$ = this;
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("LOAD: loading '", this.#uri), "' "), this.#opts), " ..."));
    let grid = this.readUri(this.#uri);
    this.#shortIdWidth = sys.Str.size(sys.Int.toHex(grid.size()));
    (grid = grid.map((rec) => {
      return this$.normRec(rec);
    }, sys.Obj.type$.toNullable()));
    let diffs = sys.List.make(folio.Diff.type$);
    grid.each((rec) => {
      let id = ((this$) => { let $_u13 = sys.ObjUtil.as(rec.get("id"), haystack.Ref.type$); if ($_u13 != null) return $_u13; return haystack.Ref.gen(); })(this$);
      (rec = haystack.Etc.dictRemoveAll(sys.ObjUtil.coerce(rec, haystack.Dict.type$), sys.List.make(sys.Str.type$, ["id", "mod"])));
      diffs.add(folio.Diff.makeAdd(rec, sys.ObjUtil.coerce(id, haystack.Ref.type$)));
      return;
    });
    this.#cx.db().commitAll(diffs);
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("LOAD: loaded ", sys.ObjUtil.coerce(grid.size(), sys.Obj.type$.toNullable())), " recs"));
    return ShellContext.noEcho();
  }

  readUri(uri) {
    if ((sys.ObjUtil.equals(uri.scheme(), "http") || sys.ObjUtil.equals(uri.scheme(), "https"))) {
      return this.readStr(uri, web.WebClient.make(uri).getStr());
    }
    else {
      return this.readStr(uri, uri.toFile().readAllStr());
    }
    ;
  }

  readStr(uri,s) {
    let $_u14 = uri.ext();
    if (sys.ObjUtil.equals($_u14, "zinc")) {
      return haystack.ZincReader.make(sys.Str.in(s)).readGrid();
    }
    else if (sys.ObjUtil.equals($_u14, "json")) {
      return haystack.JsonReader.make(sys.Str.in(s)).readGrid();
    }
    else if (sys.ObjUtil.equals($_u14, "trio")) {
      return haystack.TrioReader.make(sys.Str.in(s)).readGrid();
    }
    else if (sys.ObjUtil.equals($_u14, "csv")) {
      return haystack.CsvReader.make(sys.Str.in(s)).readGrid();
    }
    else {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus("ERROR: unknown file type [", uri.name()), "]"));
    }
    ;
  }

  normRec(rec) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    rec.each((v,n) => {
      if (folio.FolioUtil.isUncommittable(n)) {
        return;
      }
      ;
      if (sys.ObjUtil.is(v, haystack.Ref.type$)) {
        (v = this$.normRef(sys.ObjUtil.coerce(v, haystack.Ref.type$)));
      }
      ;
      acc.set(n, v);
      return;
    });
    return haystack.Etc.dictFromMap(acc);
  }

  normRef(id) {
    (id = id.toProjRel());
    if (this.#useShortIds) {
      let short = this.#shortIds.get(id);
      if (short == null) {
        this.#shortIds.set(id, sys.ObjUtil.coerce((short = haystack.Ref.fromStr(sys.Str.upper(sys.Int.toHex(this.#shortIds.size(), sys.ObjUtil.coerce(this.#shortIdWidth, sys.Int.type$.toNullable()))))), haystack.Ref.type$));
      }
      ;
      (id = sys.ObjUtil.coerce(short, haystack.Ref.type$));
    }
    ;
    return id;
  }

}

class ShellFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShellFuncs.type$; }

  static quit() {
    ShellFuncs.cx().isDone(true);
    return ShellFuncs.noEcho();
  }

  static showTrace(flag) {
    ShellFuncs.cx().showTrace(flag);
    return ShellFuncs.noEcho();
  }

  static help(func) {
    if (func === undefined) func = null;
    const this$ = this;
    let out = ShellFuncs.cx().printer();
    let comment = out.theme().comment();
    if (func == null) {
      out.nl();
      out.color(comment);
      out.w("?, help            Print this help summary").nl();
      out.w("quit, exit, bye    Exit the shell").nl();
      out.w("help(func)         Help on a specific function").nl();
      out.w("helpAll()          Print summary of all functions").nl();
      out.w("print(val)         Pretty print value").nl();
      out.w("showTrace(flag)    Toggle the show err trace flag").nl();
      out.w("scope()            Print variables in scope").nl();
      out.w("using()            Print data libraries in use").nl();
      out.w("using(qname)       Import given data library").nl();
      out.w("load(file)         Load virtual database").nl();
      out.w("read(filter)       Read rec as dict from virtual database").nl();
      out.w("readAll(filter)    Read recs as grid from virtual database").nl();
      out.colorEnd(comment);
      out.nl();
      return ShellFuncs.noEcho();
    }
    ;
    let f = sys.ObjUtil.as(func, axon.TopFn.type$);
    if (f == null) {
      out.warn(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Not a top level function: ", func), " ["), sys.ObjUtil.typeof(func)), "]"));
      return ShellFuncs.noEcho();
    }
    ;
    let s = sys.StrBuf.make();
    s.add(f.name()).add("(");
    f.params().each((p,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        s.add(", ");
      }
      ;
      s.add(p.name());
      if (p.def() != null) {
        s.add(":").add(p.def());
      }
      ;
      return;
    });
    s.add(")");
    let sig = s.toStr();
    let doc = ShellFuncs.funcDoc(sys.ObjUtil.coerce(f, axon.TopFn.type$));
    out.nl();
    out.color(comment);
    out.w(sig).nl();
    if (doc != null) {
      out.nl().w(sys.ObjUtil.coerce(doc, sys.Obj.type$)).nl();
    }
    ;
    out.colorEnd(comment);
    out.nl();
    return ShellFuncs.noEcho();
  }

  static helpAll() {
    const this$ = this;
    let out = ShellFuncs.cx().printer();
    let comment = out.theme().comment();
    let names = ShellFuncs.cx().funcs().keys().sort();
    let nameMax = ShellFuncs.maxStr(names);
    out.nl();
    out.color(comment);
    names.each((n) => {
      let f = ShellFuncs.cx().funcs().get(n);
      if (ShellFuncs.isNoDoc(sys.ObjUtil.coerce(f, axon.TopFn.type$))) {
        return;
      }
      ;
      let d = ShellFuncs.docSummary(sys.ObjUtil.coerce(((this$) => { let $_u15 = ShellFuncs.funcDoc(sys.ObjUtil.coerce(f, axon.TopFn.type$)); if ($_u15 != null) return $_u15; return ""; })(this$), sys.Str.type$));
      out.w(sys.Str.plus(sys.Str.plus(sys.Str.padr(n, nameMax), " "), d)).nl();
      return;
    });
    out.colorEnd(comment);
    out.nl();
    return ShellFuncs.noEcho();
  }

  static print(val,opts) {
    if (val === undefined) val = null;
    if (opts === undefined) opts = null;
    ShellFuncs.cx().print(val, sys.ObjUtil.coerce(opts, haystack.Dict.type$.toNullable()));
    return ShellFuncs.noEcho();
  }

  static scope() {
    const this$ = this;
    let out = ShellFuncs.cx().out();
    let vars = ShellFuncs.cx().varsInScope();
    let names = vars.keys().sort();
    let nameMax = ShellFuncs.maxStr(names);
    out.printLine();
    vars.keys().sort().each((n) => {
      out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.padr(sys.Str.plus(sys.Str.plus("", n), ":"), sys.Int.plus(nameMax, 1)), " "), vars.get(n)));
      return;
    });
    out.printLine();
    return ShellFuncs.noEcho();
  }

  static _using(name) {
    if (name === undefined) name = null;
    const this$ = this;
    let out = ShellFuncs.cx().out();
    if (name != null) {
      ShellFuncs.cx().rt().ns().addUsing(sys.ObjUtil.coerce(name, sys.Str.type$), out);
      return ShellFuncs.noEcho();
    }
    ;
    out.printLine();
    ShellFuncs.cx().ns().xeto().versions().sort().each((x) => {
      out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", x.name()), " ["), x.version()), "]"));
      return;
    });
    out.printLine();
    return ShellFuncs.noEcho();
  }

  static datalib(qname) {
    return sys.ObjUtil.coerce(ShellFuncs.cx().xeto().lib(qname), xeto.Lib.type$);
  }

  static refreshDisAll() {
    ShellFuncs.cx().db().refreshDisAll();
    return "refreshed";
  }

  static load(uri,opts) {
    if (opts === undefined) opts = null;
    return ShellLoader.make(ShellFuncs.cx(), uri, sys.ObjUtil.coerce(((this$) => { let $_u16 = opts; if ($_u16 != null) return $_u16; return haystack.Etc.dict0(); })(this), xeto.Dict.type$)).load();
  }

  static unloadAll() {
    const this$ = this;
    let recs = ShellFuncs.cx().db().readAllList(haystack.Filter.has("id"));
    let diffs = recs.map((rec) => {
      return folio.Diff.make(rec, null, folio.Diff.remove());
    }, folio.Diff.type$);
    ShellFuncs.cx().db().commitAll(sys.ObjUtil.coerce(diffs, sys.Type.find("folio::Diff[]")));
    return sys.Str.plus(sys.Str.plus("Removed ", sys.ObjUtil.coerce(recs.size(), sys.Obj.type$.toNullable())), " recs");
  }

  static loadFuncs(libName) {
    const this$ = this;
    let pod = sys.Pod.find(sys.Str.plus(libName, "Ext"), false);
    if (pod == null) {
      (pod = sys.Pod.find(sys.Str.plus("hx", sys.Str.capitalize(libName)), false));
    }
    ;
    if (pod == null) {
      throw sys.Err.make(sys.Str.plus("Cannot find pod for ", sys.Str.toCode(libName)));
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("axon::TopFn"));
    pod.files().each((file) => {
      if ((sys.ObjUtil.equals(file.ext(), "trio") && sys.Str.startsWith(file.pathStr(), "/lib/"))) {
        ShellFuncs.loadFuncsFromTrio(acc, file);
      }
      ;
      return;
    });
    ShellFuncs.cx().funcs().setAll(acc);
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("Loaded ", sys.ObjUtil.coerce(acc.size(), sys.Obj.type$.toNullable())), " funcs from "), pod);
  }

  static loadFuncsFromTrio(acc,file) {
    const this$ = this;
    haystack.TrioReader.make(file.in()).eachDict((rec) => {
      if ((rec.missing("func") || rec.missing("name"))) {
        return;
      }
      ;
      let name = sys.ObjUtil.coerce(rec.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
      try {
        acc.set(name, axon.Parser.make(axon.Loc.make(file.toStr()), sys.Str.in(sys.ObjUtil.toStr(rec.trap("src", sys.List.make(sys.Obj.type$.toNullable(), []))))).parseTop(name, rec));
      }
      catch ($_u17) {
        $_u17 = sys.Err.make($_u17);
        if ($_u17 instanceof sys.Err) {
          let e = $_u17;
          ;
          sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("ERROR: Cannot load ", name), "\n  "), e));
        }
        else {
          throw $_u17;
        }
      }
      ;
      return;
    });
    return;
  }

  static noEcho() {
    return ShellContext.noEcho();
  }

  static cx() {
    return sys.ObjUtil.coerce(axon.AxonContext.curAxon(), ShellContext.type$);
  }

  static maxStr(strs) {
    const this$ = this;
    return sys.ObjUtil.coerce(strs.reduce(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), (acc,s) => {
      return sys.ObjUtil.coerce(sys.Int.max(sys.Str.size(s), sys.ObjUtil.coerce(acc, sys.Int.type$)), sys.Obj.type$.toNullable());
    }), sys.Int.type$);
  }

  static isNoDoc(f) {
    if (f.meta().has("nodoc")) {
      return true;
    }
    ;
    if (sys.ObjUtil.is(f, axon.FantomFn.type$)) {
      return sys.ObjUtil.coerce(f, axon.FantomFn.type$).method().hasFacet(sys.NoDoc.type$);
    }
    ;
    return false;
  }

  static funcDoc(f) {
    let doc = sys.ObjUtil.as(f.meta().get("doc"), sys.Str.type$);
    if (doc != null) {
      return sys.Str.trimToNull(doc);
    }
    ;
    if (sys.ObjUtil.is(f, axon.FantomFn.type$)) {
      return sys.ObjUtil.coerce(f, axon.FantomFn.type$).method().doc();
    }
    ;
    return null;
  }

  static docSummary(t) {
    if (sys.Str.isEmpty(t)) {
      return "";
    }
    ;
    let semicolon = sys.Str.index(t, ";");
    if (semicolon != null) {
      (t = sys.Str.getRange(t, sys.Range.make(0, sys.ObjUtil.coerce(semicolon, sys.Int.type$), true)));
    }
    ;
    let colon = sys.Str.index(t, ":");
    while ((colon != null && sys.ObjUtil.compareLT(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), sys.Str.size(t)) && !sys.Int.isSpace(sys.Str.get(t, sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1))))) {
      (colon = sys.Str.index(t, ":", sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1)));
    }
    ;
    if (colon != null) {
      (t = sys.Str.getRange(t, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true)));
    }
    ;
    let period = sys.Str.index(t, ".");
    while ((period != null && sys.ObjUtil.compareLT(sys.Int.plus(sys.ObjUtil.coerce(period, sys.Int.type$), 1), sys.Str.size(t)) && !sys.Int.isSpace(sys.Str.get(t, sys.Int.plus(sys.ObjUtil.coerce(period, sys.Int.type$), 1))))) {
      (period = sys.Str.index(t, ".", sys.Int.plus(sys.ObjUtil.coerce(period, sys.Int.type$), 1)));
    }
    ;
    if (period != null) {
      (t = sys.Str.getRange(t, sys.Range.make(0, sys.ObjUtil.coerce(period, sys.Int.type$), true)));
    }
    ;
    return sys.Str.trim(sys.Str.replace(t, "\n", " "));
  }

  static make() {
    const $self = new ShellFuncs();
    ShellFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

const p = sys.Pod.add$('axonsh');
const xp = sys.Param.noParams$();
let m;
ShellContext.type$ = p.at$('ShellContext','hx::HxContext',[],{},8192,ShellContext);
ShellFolio.type$ = p.at$('ShellFolio','folio::Folio',[],{},8194,ShellFolio);
DisMacro.type$ = p.at$('DisMacro','haystack::Macro',[],{},128,DisMacro);
ShellUser.type$ = p.at$('ShellUser','sys::Obj',['hx::HxUser'],{},130,ShellUser);
ShellUserAccess.type$ = p.at$('ShellUserAccess','sys::Obj',['hx::HxUserAccess'],{},130,ShellUserAccess);
Main.type$ = p.at$('Main','sys::Obj',[],{},8192,Main);
ShellStdServices.type$ = p.am$('ShellStdServices','sys::Obj',['hx::HxStdServices'],{},8451,ShellStdServices);
ShellServiceRegistry.type$ = p.at$('ShellServiceRegistry','sys::Obj',['hx::HxServiceRegistry','axonsh::ShellStdServices'],{},8194,ShellServiceRegistry);
ShellContextService.type$ = p.at$('ShellContextService','sys::Obj',['hx::HxContextService'],{},130,ShellContextService);
ShellFileService.type$ = p.at$('ShellFileService','sys::Obj',['hx::HxFileService'],{},130,ShellFileService);
ShellRuntime.type$ = p.at$('ShellRuntime','sys::Obj',['hx::HxRuntime','axonsh::ShellStdServices'],{},8194,ShellRuntime);
ShellNamespace.type$ = p.at$('ShellNamespace','def::MBuiltNamespace',[],{},8194,ShellNamespace);
ShellXetoGetter.type$ = p.at$('ShellXetoGetter','sys::Obj',['def::XetoGetter'],{},130,ShellXetoGetter);
ShellDefFactory.type$ = p.at$('ShellDefFactory','def::DefFactory',[],{},130,ShellDefFactory);
ShellLoader.type$ = p.at$('ShellLoader','sys::Obj',[],{},128,ShellLoader);
ShellFuncs.type$ = p.at$('ShellFuncs','sys::Obj',[],{},8194,ShellFuncs);
ShellContext.type$.af$('showTrace',73728,'sys::Bool',{}).af$('noEcho',106498,'sys::Str',{}).af$('out',73728,'sys::OutStream',{}).af$('isDone',73728,'sys::Bool',{}).af$('rt',336898,'axonsh::ShellRuntime',{}).af$('user',336898,'hx::HxUser',{}).af$('funcs',73728,'[sys::Str:axon::TopFn]',{}).af$('inference$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('runInteractive',8192,'sys::Int',xp,{}).am$('run',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false)]),{}).am$('prompt',2048,'sys::Str',xp,{}).am$('isMultiLine',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false)]),{}).am$('print',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',true)]),{}).am$('err',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('err','sys::Err?',true)]),{}).am$('errToStr',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('err','sys::Err?',false)]),{}).am$('printer',8192,'xetoEnv::Printer',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict?',true)]),{}).am$('ns',271360,'haystack::Namespace',xp,{}).am$('db',271360,'axonsh::ShellFolio',xp,{}).am$('session',271360,'hx::HxSession?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('about',271360,'haystack::Dict',xp,{}).am$('xetoReadById',271360,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false)]),{}).am$('xetoReadAllEachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false),new sys.Param('f','|xeto::Dict->sys::Obj?|',false)]),{}).am$('deref',271360,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('inference',795648,'haystack::FilterInference',xp,{}).am$('toDict',271360,'haystack::Dict',xp,{}).am$('canRead',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('canWrite',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('commitInfo',271360,'sys::Obj?',xp,{}).am$('findTop',271360,'axon::Fn?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('trapRef',271360,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('loadBuiltInFuncs',34818,'[sys::Str:axon::TopFn]',xp,{}).am$('resolveFile',8192,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('inference$Once',133120,'haystack::FilterInference',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ShellFolio.type$.af$('curVerRef',67586,'concurrent::AtomicInt',{}).af$('flushMode',271360,'sys::Str',{}).af$('map',67586,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','folio::FolioConfig',false)]),{}).am$('passwords',271360,'folio::PasswordStore',xp,{}).am$('curVer',271360,'sys::Int',xp,{}).am$('flush',271360,'sys::Void',xp,{}).am$('doCloseAsync',271360,'folio::FolioFuture',xp,{}).am$('doReadByIds',271360,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{}).am$('doReadAll',271360,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false)]),{}).am$('doReadCount',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false)]),{}).am$('doReadAllEachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|haystack::Dict->sys::Obj?|',false)]),{}).am$('his',271360,'folio::FolioHis',xp,{}).am$('backup',271360,'folio::FolioBackup',xp,{}).am$('doCommitAllAsync',271360,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false),new sys.Param('cxInfo','sys::Obj?',false)]),{}).am$('commitApply',2048,'folio::Diff',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false),new sys.Param('internedIds','[haystack::Ref:haystack::Ref]',false),new sys.Param('newMod','sys::DateTime',false)]),{}).am$('commitNorm',2048,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('internedIds','[haystack::Ref:haystack::Ref]',false)]),{}).am$('refreshDisAll',8192,'sys::Void',xp,{}).am$('refreshDis',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('toDis',128,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('eachWhile',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Dict->sys::Obj?|',false)]),{}).am$('each',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|haystack::Dict->sys::Void|',false)]),{});
DisMacro.type$.af$('db',73730,'axonsh::ShellFolio',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','sys::Str',false),new sys.Param('s','haystack::Dict',false),new sys.Param('db','axonsh::ShellFolio',false)]),{}).am$('refToDis',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false)]),{});
ShellUser.type$.af$('username',336898,'sys::Str',{}).af$('meta',336898,'haystack::Dict',{}).af$('id',336898,'haystack::Ref',{}).af$('dis',336898,'sys::Str',{}).af$('isSu',336898,'sys::Bool',{}).af$('isAdmin',336898,'sys::Bool',{}).af$('email',336898,'sys::Str?',{}).af$('mod',336898,'sys::DateTime',{}).af$('access',336898,'hx::HxUserAccess',{}).am$('make',8196,'sys::Void',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
ShellUserAccess.type$.am$('canPointWriteAtLevel',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Main.type$.af$('out',73728,'sys::OutStream',{}).am$('main',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('mainArgs','sys::Str[]',false)]),{}).am$('hasOpt',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('opts','sys::Str[]',false),new sys.Param('name','sys::Str',false),new sys.Param('abbr','sys::Str?',true)]),{}).am$('printHelp',8192,'sys::Int',xp,{}).am$('printVersion',2048,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
ShellStdServices.type$.am$('service',270337,'hx::HxService',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('context',271360,'hx::HxContextService',xp,{}).am$('obs',271360,'hx::HxObsService',xp,{}).am$('watch',271360,'hx::HxWatchService',xp,{}).am$('file',271360,'hx::HxFileService',xp,{}).am$('his',271360,'hx::HxHisService',xp,{}).am$('crypto',271360,'hx::HxCryptoService',xp,{}).am$('http',271360,'hx::HxHttpService',xp,{}).am$('user',271360,'hx::HxUserService',xp,{}).am$('io',271360,'hx::HxIOService',xp,{}).am$('task',271360,'hx::HxTaskService',xp,{}).am$('conn',271360,'hx::HxConnService',xp,{}).am$('pointWrite',271360,'hx::HxPointWriteService',xp,{});
ShellServiceRegistry.type$.af$('list',336898,'sys::Type[]',{}).af$('map',67586,'[sys::Type:hx::HxService[]]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','axonsh::ShellRuntime',false)]),{}).am$('service',271360,'hx::HxService',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('get',271360,'hx::HxService?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('getAll',271360,'hx::HxService[]',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{});
ShellContextService.type$.af$('rt',73730,'axonsh::ShellRuntime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','axonsh::ShellRuntime',false)]),{}).am$('create',271360,'hx::HxContext',sys.List.make(sys.Param.type$,[new sys.Param('user','hx::HxUser',false)]),{}).am$('createSession',271360,'hx::HxContext',sys.List.make(sys.Param.type$,[new sys.Param('session','hx::HxSession',false)]),{}).am$('xetoReload',271360,'sys::Void',xp,{});
ShellFileService.type$.am$('resolve',271360,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ShellRuntime.type$.af$('name',336898,'sys::Str',{}).af$('dir',336898,'sys::File',{}).af$('version',336898,'sys::Version',{}).af$('platform',336898,'hx::HxPlatform',{}).af$('config',336898,'hx::HxConfig',{}).af$('db',336898,'folio::Folio',{}).af$('ns',336898,'axonsh::ShellNamespace',{}).af$('services',336898,'axonsh::ShellServiceRegistry',{}).am$('make',8196,'sys::Void',xp,{}).am$('dis',271360,'sys::Str',xp,{}).am$('meta',271360,'haystack::Dict',xp,{}).am$('lib',271360,'hx::HxLib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('libs',271360,'hx::HxRuntimeLibs',xp,{}).am$('isSteadyState',271360,'sys::Bool',xp,{}).am$('sync',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('isRunning',271360,'sys::Bool',xp,{}).am$('service',271360,'hx::HxService',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{});
ShellNamespace.type$.af$('rt',73730,'axonsh::ShellRuntime',{}).af$('repo',73730,'xeto::LibRepo',{}).af$('xetoRef',73730,'concurrent::AtomicRef',{}).am$('init',40962,'axonsh::ShellNamespace',sys.List.make(sys.Param.type$,[new sys.Param('rt','axonsh::ShellRuntime',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BNamespace',false),new sys.Param('rt','axonsh::ShellRuntime',false)]),{}).am$('xetoReload',8192,'sys::Void',xp,{}).am$('createDefaultNamespace',8192,'xeto::LibNamespace',xp,{}).am$('addUsing',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('libName','sys::Str',false),new sys.Param('out','sys::OutStream',false)]),{});
ShellXetoGetter.type$.af$('rt',73730,'axonsh::ShellRuntime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','axonsh::ShellRuntime',false)]),{}).am$('get',271360,'xeto::LibNamespace',xp,{});
ShellDefFactory.type$.af$('rt',73730,'axonsh::ShellRuntime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','axonsh::ShellRuntime',false)]),{}).am$('createNamespace',271360,'def::MNamespace',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BNamespace',false)]),{});
ShellLoader.type$.af$('cx',67584,'axonsh::ShellContext',{}).af$('uri',67584,'sys::Uri',{}).af$('opts',67584,'xeto::Dict',{}).af$('useShortIds',67584,'sys::Bool',{}).af$('shortIdWidth',67584,'sys::Int',{}).af$('shortIds',67584,'[haystack::Ref:haystack::Ref]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','axonsh::ShellContext',false),new sys.Param('uri','sys::Uri',false),new sys.Param('opts','xeto::Dict',false)]),{}).am$('load',8192,'sys::Obj?',xp,{}).am$('readUri',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('readStr',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('s','sys::Str',false)]),{}).am$('normRec',2048,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('rec','xeto::Dict',false)]),{}).am$('normRef',2048,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{});
ShellFuncs.type$.am$('quit',40962,'sys::Obj?',xp,{'axon::Axon':""}).am$('showTrace',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('flag','sys::Bool',false)]),{'axon::Axon':""}).am$('help',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('func','sys::Obj?',true)]),{'axon::Axon':""}).am$('helpAll',40962,'sys::Obj?',xp,{'axon::Axon':""}).am$('print',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',true),new sys.Param('opts','xeto::Dict?',true)]),{'axon::Axon':""}).am$('scope',40962,'sys::Obj?',xp,{'axon::Axon':""}).am$('_using',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str?',true)]),{'axon::Axon':""}).am$('datalib',40962,'xeto::Lib',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false)]),{'axon::Axon':""}).am$('refreshDisAll',40962,'sys::Obj?',xp,{'sys::NoDoc':"",'axon::Axon':""}).am$('load',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('opts','xeto::Dict?',true)]),{'axon::Axon':""}).am$('unloadAll',40962,'sys::Obj?',xp,{'axon::Axon':""}).am$('loadFuncs',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('libName','sys::Str',false)]),{'sys::NoDoc':"",'axon::Axon':""}).am$('loadFuncsFromTrio',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:axon::TopFn]',false),new sys.Param('file','sys::File',false)]),{}).am$('noEcho',34818,'sys::Str',xp,{}).am$('cx',34818,'axonsh::ShellContext',xp,{}).am$('maxStr',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('strs','sys::Str[]',false)]),{}).am$('isNoDoc',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('f','axon::TopFn',false)]),{}).am$('funcDoc',34818,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('f','axon::TopFn',false)]),{}).am$('docSummary',34818,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "axonsh");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;util 1.0;web 1.0;xeto 3.1.11;haystack 3.1.11;xetoEnv 3.1.11;def 3.1.11;defc 3.1.11;axon 3.1.11;folio 3.1.11;hx 3.1.11");
m.set("pod.summary", "Axon shell command line interface");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:29-05:00 New_York");
m.set("build.tsKey", "241210143129");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
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
  ShellContext,
  ShellFolio,
  Main,
  ShellStdServices,
  ShellServiceRegistry,
  ShellRuntime,
  ShellNamespace,
  ShellFuncs,
};
