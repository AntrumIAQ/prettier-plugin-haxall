// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as rdf from './rdf.js'
import * as util from './util.js'
import * as web from './web.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as folio from './folio.js'
import * as obs from './obs.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class UnknownWatchErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownWatchErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownWatchErr();
    UnknownWatchErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class WatchClosedErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WatchClosedErr.type$; }

  static make(msg,cause) {
    const $self = new WatchClosedErr();
    WatchClosedErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class ContextUnavailableErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ContextUnavailableErr.type$; }

  static make(msg,cause) {
    const $self = new ContextUnavailableErr();
    ContextUnavailableErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class SessionUnavailableErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SessionUnavailableErr.type$; }

  static make(msg,cause) {
    const $self = new SessionUnavailableErr();
    SessionUnavailableErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class HxTest extends haystack.HaystackTest {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return HxTest.type$; }

  #rtRef = null;

  rtRef(it) {
    if (it === undefined) {
      return this.#rtRef;
    }
    else {
      this.#rtRef = it;
      return;
    }
  }

  #spiDef$Store = undefined;

  // private field reflection only
  __spiDef$Store(it) { if (it === undefined) return this.#spiDef$Store; else this.#spiDef$Store = it; }

  setup() {
    if (this.curTestMethod().hasFacet(HxRuntimeTest.type$)) {
      this.rtStart();
    }
    ;
    return;
  }

  teardown() {
    concurrent.Actor.locals().remove(haystack.Etc.cxActorLocalsKey());
    if (this.#rtRef != null) {
      this.rtStop();
    }
    ;
    this.tempDir().delete();
    return;
  }

  rt(checked) {
    if (checked === undefined) checked = true;
    if ((this.#rtRef != null || !checked)) {
      return this.#rtRef;
    }
    ;
    throw sys.Err.make(sys.Str.plus(sys.Str.plus("Runtime not started (ensure ", this.curTestMethod()), " marked @HxRuntimeTest)"));
  }

  rtStart() {
    if (this.#rtRef != null) {
      throw sys.Err.make("Runtime already started!");
    }
    ;
    let projMeta = haystack.Etc.emptyDict();
    let facet = sys.ObjUtil.as(this.curTestMethod().facet(HxRuntimeTest.type$, false), HxRuntimeTest.type$);
    if ((facet != null && facet.meta() != null)) {
      if (sys.ObjUtil.is(facet.meta(), sys.Str.type$)) {
        (projMeta = sys.ObjUtil.coerce(haystack.TrioReader.make(sys.Str.in(sys.ObjUtil.toStr(facet.meta()))).readDict(), haystack.Dict.type$));
      }
      else {
        (projMeta = haystack.Etc.makeDict(sys.ObjUtil.coerce(facet.meta(), sys.Type.find("[sys::Str:sys::Obj]"))));
      }
      ;
    }
    ;
    this.#rtRef = this.spi().start(projMeta);
    return;
  }

  rtStop() {
    if (this.#rtRef == null) {
      throw sys.Err.make("Runtime not started!");
    }
    ;
    this.spi().stop(sys.ObjUtil.coerce(this.#rtRef, HxRuntime.type$));
    this.#rtRef = null;
    return;
  }

  rtRestart() {
    this.rtStop();
    this.rtStart();
    return;
  }

  spi() {
    return this.spiDef();
  }

  spiDef() {
    if (this.#spiDef$Store === undefined) {
      this.#spiDef$Store = this.spiDef$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#spiDef$Store, HxTestSpi.type$);
  }

  read(filter,checked) {
    if (checked === undefined) checked = true;
    return this.rt().db().read(sys.ObjUtil.coerce(haystack.Filter.fromStr(filter), haystack.Filter.type$), checked);
  }

  readById(id,checked) {
    if (checked === undefined) checked = true;
    return this.rt().db().readById(id, checked);
  }

  commit(rec,changes,flags) {
    if (flags === undefined) flags = 0;
    return this.rt().db().commit(folio.Diff.make(rec, changes, flags)).newRec();
  }

  addRec(tags) {
    if (tags === undefined) tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    const this$ = this;
    (tags = tags.findAll((v,n) => {
      return v != null;
    }));
    let id = sys.ObjUtil.as(tags.get("id"), haystack.Ref.type$);
    if (id != null) {
      if (id.isProjRec()) {
        (id = id.toProjRel());
      }
      ;
      tags.remove("id");
    }
    else {
      (id = haystack.Ref.gen());
    }
    ;
    return sys.ObjUtil.coerce(this.rt().db().commit(folio.Diff.makeAdd(tags, sys.ObjUtil.coerce(id, haystack.Ref.type$))).newRec(), haystack.Dict.type$);
  }

  addLib(libName,tags) {
    if (tags === undefined) tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    let lib = this.spi().addLib(libName, tags);
    this.rt().sync();
    lib.spi().sync();
    return lib;
  }

  addUser(user,pass,tags) {
    if (tags === undefined) tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    return this.spi().addUser(user, pass, tags);
  }

  genRef(id) {
    if (id === undefined) id = haystack.Ref.gen().id();
    if (this.rt().db().idPrefix() != null) {
      (id = sys.Str.plus(this.rt().db().idPrefix(), id));
    }
    ;
    return sys.ObjUtil.coerce(haystack.Ref.fromStr(id), haystack.Ref.type$);
  }

  forceSteadyState() {
    this.spi().forceSteadyState(sys.ObjUtil.coerce(this.rt(), HxRuntime.type$));
    return;
  }

  makeContext(user) {
    if (user === undefined) user = null;
    return this.spi().makeContext(user);
  }

  eval($axon) {
    return this.makeContext(null).eval($axon);
  }

  static make() {
    const $self = new HxTest();
    HxTest.make$($self);
    return $self;
  }

  static make$($self) {
    haystack.HaystackTest.make$($self);
    ;
    return;
  }

  spiDef$Once() {
    let type = ((this$) => { let $_u0 = sys.Type.find("skyarcd::ProjHxTestSpi", false); if ($_u0 != null) return $_u0; return sys.Type.find("hxd::HxdTestSpi"); })(this);
    return sys.ObjUtil.coerce(type.make(sys.List.make(HxTest.type$, [this])), HxTestSpi.type$);
  }

}

class HxRuntimeTest extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxRuntimeTest.type$; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  static make(f) {
    const $self = new HxRuntimeTest();
    HxRuntimeTest.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    ((this$) => { let $_u1 = f; if ($_u1 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

}

class HxTestSpi extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxTestSpi.type$; }

  #test = null;

  test() {
    return this.#test;
  }

  static make(test) {
    const $self = new HxTestSpi();
    HxTestSpi.make$($self,test);
    return $self;
  }

  static make$($self,test) {
    $self.#test = test;
    return;
  }

}

class HxLibWeb extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxLibWeb.type$; }

  #libRef = null;

  // private field reflection only
  __libRef(it) { if (it === undefined) return this.#libRef; else this.#libRef = it; }

  static make(lib) {
    const $self = new HxLibWeb();
    HxLibWeb.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    web.WebMod.make$($self);
    $self.#libRef = lib;
    return;
  }

  rt() {
    return this.#libRef.rt();
  }

  lib() {
    return this.#libRef;
  }

  uri() {
    return this.lib().spi().webUri();
  }

  isUnsupported() {
    return false;
  }

}

class UnsupportedHxLibWeb extends HxLibWeb {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnsupportedHxLibWeb.type$; }

  static make(lib) {
    const $self = new UnsupportedHxLibWeb();
    UnsupportedHxLibWeb.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    HxLibWeb.make$($self, lib);
    return;
  }

  isUnsupported() {
    return true;
  }

  onService() {
    this.res().sendErr(404);
    return;
  }

}

class HxWatch extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxWatch.type$; }

  #lease = null;

  lease(it) {
    if (it === undefined) {
    }
    else {
    }
  }

  add(id) {
    this.addAll(sys.List.make(haystack.Ref.type$, [id]));
    return;
  }

  addGrid(grid) {
    const this$ = this;
    if (grid.isEmpty()) {
      return;
    }
    ;
    let ids = sys.List.make(haystack.Ref.type$);
    ids.capacity(grid.size());
    let idCol = grid.col("id");
    grid.each((row) => {
      let id = sys.ObjUtil.as(row.val(sys.ObjUtil.coerce(idCol, haystack.Col.type$)), haystack.Ref.type$);
      if (id != null) {
        ids.add(sys.ObjUtil.coerce(id, haystack.Ref.type$));
      }
      ;
      return;
    });
    this.addAll(ids);
    return;
  }

  remove(id) {
    this.removeAll(sys.List.make(haystack.Ref.type$, [id]));
    return;
  }

  removeGrid(grid) {
    const this$ = this;
    let ids = sys.List.make(haystack.Ref.type$);
    ids.capacity(grid.size());
    let idCol = grid.col("id");
    grid.each((row) => {
      ids.add(sys.ObjUtil.coerce(row.val(sys.ObjUtil.coerce(idCol, haystack.Col.type$)), haystack.Ref.type$));
      return;
    });
    this.removeAll(ids);
    return;
  }

  hash() {
    return sys.ObjUtil.hash(sys.Obj.prototype);
  }

  equals(that) {
    return this === that;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("Watch-", this.rt().name()), "-"), this.id());
  }

  static make() {
    const $self = new HxWatch();
    HxWatch.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HxMsg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxMsg.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #a = null;

  a() { return this.#a; }

  __a(it) { if (it === undefined) return this.#a; else this.#a = it; }

  #b = null;

  b() { return this.#b; }

  __b(it) { if (it === undefined) return this.#b; else this.#b = it; }

  #c = null;

  c() { return this.#c; }

  __c(it) { if (it === undefined) return this.#c; else this.#c = it; }

  #d = null;

  d() { return this.#d; }

  __d(it) { if (it === undefined) return this.#d; else this.#d = it; }

  #e = null;

  e() { return this.#e; }

  __e(it) { if (it === undefined) return this.#e; else this.#e = it; }

  static make0(id) {
    const $self = new HxMsg();
    HxMsg.make0$($self,id);
    return $self;
  }

  static make0$($self,id) {
    $self.#id = id;
    return;
  }

  static make1(id,a) {
    const $self = new HxMsg();
    HxMsg.make1$($self,id,a);
    return $self;
  }

  static make1$($self,id,a) {
    $self.#id = id;
    $self.#a = ((this$) => { let $_u2 = a; if ($_u2 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    return;
  }

  static make2(id,a,b) {
    const $self = new HxMsg();
    HxMsg.make2$($self,id,a,b);
    return $self;
  }

  static make2$($self,id,a,b) {
    $self.#id = id;
    $self.#a = ((this$) => { let $_u3 = a; if ($_u3 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u4 = b; if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    return;
  }

  static make3(id,a,b,c) {
    const $self = new HxMsg();
    HxMsg.make3$($self,id,a,b,c);
    return $self;
  }

  static make3$($self,id,a,b,c) {
    $self.#id = id;
    $self.#a = ((this$) => { let $_u5 = a; if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u6 = b; if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    $self.#c = ((this$) => { let $_u7 = c; if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(c); })($self);
    return;
  }

  static make4(id,a,b,c,d) {
    const $self = new HxMsg();
    HxMsg.make4$($self,id,a,b,c,d);
    return $self;
  }

  static make4$($self,id,a,b,c,d) {
    $self.#id = id;
    $self.#a = ((this$) => { let $_u8 = a; if ($_u8 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u9 = b; if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    $self.#c = ((this$) => { let $_u10 = c; if ($_u10 == null) return null; return sys.ObjUtil.toImmutable(c); })($self);
    $self.#d = ((this$) => { let $_u11 = d; if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(d); })($self);
    return;
  }

  static make5(id,a,b,c,d,e) {
    const $self = new HxMsg();
    HxMsg.make5$($self,id,a,b,c,d,e);
    return $self;
  }

  static make5$($self,id,a,b,c,d,e) {
    $self.#id = id;
    $self.#a = ((this$) => { let $_u12 = a; if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u13 = b; if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    $self.#c = ((this$) => { let $_u14 = c; if ($_u14 == null) return null; return sys.ObjUtil.toImmutable(c); })($self);
    $self.#d = ((this$) => { let $_u15 = d; if ($_u15 == null) return null; return sys.ObjUtil.toImmutable(d); })($self);
    $self.#e = ((this$) => { let $_u16 = e; if ($_u16 == null) return null; return sys.ObjUtil.toImmutable(e); })($self);
    return;
  }

  hash() {
    let hash = sys.Str.hash(this.#id);
    if (this.#a != null) {
      (hash = sys.Int.xor(hash, sys.ObjUtil.hash(this.#a)));
    }
    ;
    if (this.#b != null) {
      (hash = sys.Int.xor(hash, sys.ObjUtil.hash(this.#b)));
    }
    ;
    if (this.#c != null) {
      (hash = sys.Int.xor(hash, sys.ObjUtil.hash(this.#c)));
    }
    ;
    if (this.#d != null) {
      (hash = sys.Int.xor(hash, sys.ObjUtil.hash(this.#d)));
    }
    ;
    if (this.#e != null) {
      (hash = sys.Int.xor(hash, sys.ObjUtil.hash(this.#e)));
    }
    ;
    return hash;
  }

  equals(that) {
    let m = sys.ObjUtil.as(that, HxMsg.type$);
    if (m == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#id, m.#id) && sys.ObjUtil.equals(this.#a, m.#a) && sys.ObjUtil.equals(this.#b, m.#b) && sys.ObjUtil.equals(this.#c, m.#c) && sys.ObjUtil.equals(this.#d, m.#d) && sys.ObjUtil.equals(this.#e, m.#e));
  }

  toStr() {
    return concurrent.ActorMsg.toDebugStr("HxMsg", this.#id, this.#a, this.#b, this.#c, this.#d, this.#e);
  }

}

class HxUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxUtil.type$; }

  static readAllTagNames(db,filter) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("axon::TagNameUsage"));
    db.readAllEachWhile(filter, haystack.Etc.emptyDict(), (rec) => {
      rec.each((v,n) => {
        let u = acc.get(n);
        if (u == null) {
          acc.set(n, sys.ObjUtil.coerce((u = axon.TagNameUsage.make()), axon.TagNameUsage.type$));
        }
        ;
        u.add(v);
        return;
      });
      return null;
    });
    let gb = haystack.GridBuilder.make().addCol("name").addCol("kind").addCol("count");
    acc.keys().sort().each((n) => {
      let u = acc.get(n);
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [n, u.toKind(), haystack.Number.makeInt(u.count())]));
      return;
    });
    return gb.toGrid();
  }

  static readAllTagVals(db,filter,tagName) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj"));
    db.readAllEachWhile(filter, haystack.Etc.emptyDict(), (rec) => {
      let val = rec.get(tagName);
      if (val != null) {
        acc.set(sys.ObjUtil.coerce(val, sys.Obj.type$), sys.ObjUtil.coerce(val, sys.Obj.type$));
      }
      ;
      return ((this$) => { if (sys.ObjUtil.compareGT(acc.size(), 200)) return "break"; return null; })(this$);
    });
    return acc.vals().sort();
  }

  static parseEnumNames(enum$) {
    return def.DefUtil.parseEnumNames(enum$);
  }

  static parseEnum(enum$) {
    return def.DefUtil.parseEnum(enum$);
  }

  static pods() {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.addCol("name").addCol("version").addCol("buildTime").addCol("buildHost").addCol("org").addCol("project").addCol("summary");
    sys.Pod.list().each((p) => {
      let m = p.meta();
      let ts = null;
      try {
        (ts = sys.DateTime.fromStr(sys.ObjUtil.coerce(m.get("build.ts"), sys.Str.type$)).toTimeZone(sys.TimeZone.cur()));
      }
      catch ($_u18) {
      }
      ;
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [p.name(), p.version().toStr(), ts, m.get("build.host"), m.get("org.name"), m.get("proj.name"), m.get("pod.summary")]));
      return;
    });
    return gb.toGrid();
  }

  static tzdb() {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.setMeta(sys.Map.__fromLiteral(["cur"], [sys.TimeZone.cur().name()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    gb.addCol("name").addCol("fullName");
    sys.TimeZone.listFullNames().each((fn) => {
      let slash = sys.Str.indexr(fn, "/");
      let n = ((this$) => { if (slash == null) return fn; return sys.Str.getRange(fn, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(slash, sys.Int.type$), 1), -1)); })(this$);
      gb.addRow2(n, fn);
      return;
    });
    return gb.toGrid();
  }

  static unitdb() {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.addCol("quantity").addCol("name").addCol("symbol");
    sys.Unit.quantities().each((q) => {
      sys.Unit.quantity(q).each((u) => {
        gb.addRow(sys.List.make(sys.Str.type$, [q, u.name(), u.symbol()]));
        return;
      });
      return;
    });
    return gb.toGrid();
  }

  static pid() {
    return HxThreadDump.pid();
  }

  static threadId() {
    return java.failjava.lang.Thread.currentThread().getId();
  }

  static threadDumpAll() {
    return HxThreadDump.make().toAll();
  }

  static threadDumpDeadlocks() {
    return sys.ObjUtil.coerce(HxThreadDump.make().toDeadlocks(), sys.Str.type$);
  }

  static threadDump(id) {
    return HxThreadDump.make().toThread(id);
  }

  static curContext() {
    return sys.ObjUtil.coerce(HxContext.curHx(), HxContext.type$);
  }

  static make() {
    const $self = new HxUtil();
    HxUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HxThreadDump extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#bean = sys.ObjUtil.coerce(java.failjava.lang.management.ManagementFactory.getThreadMXBean(), java.failjava.lang.management.ThreadMXBean.type$);
    this.#buf = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.StrBuf.make(), (it) => {
      it.capacity(4096);
      return;
    }), sys.StrBuf.type$);
    this.#byId = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("hx::HxThread"));
    return;
  }

  typeof() { return HxThreadDump.type$; }

  #bean = null;

  // private field reflection only
  __bean(it) { if (it === undefined) return this.#bean; else this.#bean = it; }

  #buf = null;

  // private field reflection only
  __buf(it) { if (it === undefined) return this.#buf; else this.#buf = it; }

  #byId = null;

  // private field reflection only
  __byId(it) { if (it === undefined) return this.#byId; else this.#byId = it; }

  static pid() {
    try {
      let type = sys.Type.find("[java]java.lang::ProcessHandle");
      let cur = type.method("current").callOn(null, null);
      return sys.ObjUtil.coerce(type.method("pid").callOn(cur, null), sys.Int.type$.toNullable());
    }
    catch ($_u20) {
      $_u20 = sys.Err.make($_u20);
      if ($_u20 instanceof sys.Err) {
        let e = $_u20;
        ;
        return null;
      }
      else {
        throw $_u20;
      }
    }
    ;
  }

  toDeadlocks() {
    return this.dump(true);
  }

  toAll() {
    return sys.ObjUtil.coerce(this.dump(false), sys.Str.type$);
  }

  toThread(id) {
    const this$ = this;
    let infos = sys.ObjUtil.coerce(sys.List.make(java.failjava.lang.management.ThreadInfo.type$.toNullable(), this.#bean.dumpAllThreads(true, true)), sys.Type.find("[java]java.lang.management::ThreadInfo[]"));
    let info = infos.find(() => {
      // Cannot write closure. Signature uses non-JS types: |[java]java.lang.management::ThreadInfo->sys::Bool|
      throw sys.UnsupportedErr.make('Closure uses non-JS types: ' + "|[java]java.lang.management::ThreadInfo->sys::Bool|");
    });
    if (info == null) {
      return sys.Str.plus("ThreadDump: id not found: ", sys.ObjUtil.coerce(id, sys.Obj.type$.toNullable()));
    }
    ;
    this.dumpStack(HxThread.make(this.#bean, sys.ObjUtil.coerce(info, java.failjava.lang.management.ThreadInfo.type$)));
    return this.#buf.toStr();
  }

  dump(deadlocksOnly) {
    const this$ = this;
    let infos = sys.ObjUtil.coerce(sys.List.make(java.failjava.lang.management.ThreadInfo.type$.toNullable(), this.#bean.dumpAllThreads(true, true)), sys.Type.find("[java]java.lang.management::ThreadInfo[]"));
    let threads = sys.ObjUtil.coerce(infos.map(() => {
      // Cannot write closure. Signature uses non-JS types: |[java]java.lang.management::ThreadInfo->hx::HxThread|
      throw sys.UnsupportedErr.make('Closure uses non-JS types: ' + "|[java]java.lang.management::ThreadInfo->hx::HxThread|");
    }, HxThread.type$), sys.Type.find("hx::HxThread[]"));
    threads.each((t) => {
      this$.#byId.set(sys.ObjUtil.coerce(t.id(), sys.Obj.type$.toNullable()), t);
      return;
    });
    this.#buf.add("\n");
    let deadlocked = this.#bean.findDeadlockedThreads();
    let haveDeadlocks = (deadlocked != null && sys.ObjUtil.compareGT(sys.ObjUtil.coerce(deadlocked.size(), sys.Int.type$), 0));
    if (haveDeadlocks) {
      this.#buf.add("  ### Deadlock Detected ###\n\n");
      for (let i = 0; sys.ObjUtil.compareLT(i, sys.ObjUtil.coerce(deadlocked.size(), sys.Int.type$)); i = sys.Int.increment(i)) {
        let id = deadlocked.get(sys.ObjUtil.coerce(i, java.fail.int.type$));
        let t = this.#byId.get(sys.ObjUtil.coerce(id, sys.Obj.type$.toNullable()));
        if (t != null) {
          this.dumpStack(sys.ObjUtil.coerce(t, HxThread.type$));
        }
        ;
      }
      ;
    }
    ;
    if (deadlocksOnly) {
      return ((this$) => { if (haveDeadlocks) return this$.#buf.toStr(); return null; })(this);
    }
    ;
    this.#buf.add("  ### CPU Time ###\n\n");
    threads.sortr((a,b) => {
      return sys.ObjUtil.compare(a.cpu(), b.cpu());
    });
    threads.each((t) => {
      if (sys.ObjUtil.compareGT(t.cpu(), sys.Duration.fromStr("1ms"))) {
        this$.#buf.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", t.name()), " ["), t.cpu().toLocale()), "]\n"));
      }
      ;
      return;
    });
    this.#buf.add("\n");
    this.#buf.add("  ### Stack Traces ###\n\n");
    threads.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    threads.each((t) => {
      this$.dumpStack(t);
      return;
    });
    return this.#buf.toStr();
  }

  dumpStack(t) {
    const this$ = this;
    let elems = sys.ObjUtil.coerce(sys.List.make(java.failjava.lang.StackTraceElement.type$.toNullable(), t.info().getStackTrace()), sys.Type.find("[java]java.lang::StackTraceElement[]"));
    if (elems.isEmpty()) {
      return;
    }
    ;
    this.#buf.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", t.name()), " ["), sys.ObjUtil.coerce(t.info().getThreadId(), sys.Obj.type$.toNullable())), ": "), t.info().getThreadState()), "]\n"));
    let lock = t.info().getLockInfo();
    let owner = t.info().getLockOwnerName();
    if (lock != null) {
      this.#buf.add(sys.Str.plus(sys.Str.plus("    - waiting to lock: ", lock), "\n"));
      if (owner != null) {
        this.#buf.add(sys.Str.plus(sys.Str.plus("    - lock held by: ", owner), "\n"));
      }
      ;
    }
    ;
    let monitors = sys.ObjUtil.coerce(sys.List.make(java.failjava.lang.management.MonitorInfo.type$.toNullable(), t.info().getLockedMonitors()), sys.Type.find("[java]java.lang.management::MonitorInfo[]"));
    elems.each(() => {
      // Cannot write closure. Signature uses non-JS types: |[java]java.lang::StackTraceElement->sys::Void|
      throw sys.UnsupportedErr.make('Closure uses non-JS types: ' + "|[java]java.lang::StackTraceElement->sys::Void|");
    });
    this.#buf.add("\n");
    return;
  }

  static make() {
    const $self = new HxThreadDump();
    HxThreadDump.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class HxThread extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxThread.type$; }

  #info = null;

  info(it) {
    if (it === undefined) {
      return this.#info;
    }
    else {
      this.#info = it;
      return;
    }
  }

  #id = 0;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #cpu = null;

  cpu() { return this.#cpu; }

  __cpu(it) { if (it === undefined) return this.#cpu; else this.#cpu = it; }

  static make(bean,info) {
    const $self = new HxThread();
    HxThread.make$($self,bean,info);
    return $self;
  }

  static make$($self,bean,info) {
    $self.#info = info;
    $self.#name = sys.ObjUtil.coerce(info.getThreadName(), sys.Str.type$);
    $self.#id = info.getThreadId();
    $self.#cpu = sys.ObjUtil.coerce(sys.Duration.make(bean.getThreadCpuTime(info.getThreadId())), sys.Duration.type$);
    return;
  }

}

class HxApiOp extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxApiOp.type$; }

  #spiRef = null;

  spiRef() { return this.#spiRef; }

  __spiRef(it) { if (it === undefined) return this.#spiRef; else this.#spiRef = it; }

  static make() {
    const $self = new HxApiOp();
    HxApiOp.make$($self);
    return $self;
  }

  static make$($self) {
    $self.#spiRef = sys.ObjUtil.coerce(((this$) => { let $_u22 = sys.ObjUtil.as(concurrent.Actor.locals().get("hxApiOp.spi"), HxApiOpSpi.type$); if ($_u22 != null) return $_u22; throw sys.Err.make("Invalid make context"); })($self), HxApiOpSpi.type$);
    return;
  }

  name() {
    return this.spi().name();
  }

  def() {
    return this.spi().def();
  }

  onService(req,res,cx) {
    let reqGrid = this.spi().readReq(this, req, res);
    if (reqGrid == null) {
      return;
    }
    ;
    let resGrid = this.onRequest(sys.ObjUtil.coerce(reqGrid, haystack.Grid.type$), cx);
    this.spi().writeRes(this, req, res, resGrid);
    return;
  }

  isGetAllowed() {
    return this.def().has("noSideEffects");
  }

  spi() {
    return this.#spiRef;
  }

}

class HxApiOpSpi {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxApiOpSpi.type$; }

}

class HxAboutOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxAboutOp.type$; }

  onRequest(req,cx) {
    return haystack.Etc.makeDictGrid(null, HxCoreFuncs.about());
  }

  static make() {
    const $self = new HxAboutOp();
    HxAboutOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxCloseOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxCloseOp.type$; }

  onRequest(req,cx) {
    cx.rt().user().closeSession(sys.ObjUtil.coerce(cx.session(), HxSession.type$));
    return haystack.Etc.emptyGrid();
  }

  static make() {
    const $self = new HxCloseOp();
    HxCloseOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxDefsOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxDefsOp.type$; }

  onRequest(req,cx) {
    const this$ = this;
    let opts = ((this$) => { let $_u23 = sys.ObjUtil.as(req.first(), haystack.Dict.type$); if ($_u23 != null) return $_u23; return haystack.Etc.emptyDict(); })(this);
    let limit = ((this$) => { let $_u24 = ((this$) => { let $_u25 = sys.ObjUtil.as(opts.get("limit"), haystack.Number.type$); if ($_u25 == null) return null; return sys.ObjUtil.as(opts.get("limit"), haystack.Number.type$).toInt(); })(this$); if ($_u24 != null) return $_u24; return sys.ObjUtil.coerce(sys.Int.maxVal(), sys.Int.type$.toNullable()); })(this);
    let filter = haystack.Filter.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u26 = sys.ObjUtil.as(opts.get("filter"), sys.Str.type$); if ($_u26 != null) return $_u26; return ""; })(this), sys.Str.type$), false);
    let acc = sys.List.make(haystack.Def.type$);
    let incomplete = false;
    this.eachDef(cx, ($def) => {
      if ((filter != null && !filter.matches($def, cx))) {
        return;
      }
      ;
      if (sys.ObjUtil.compareGE(acc.size(), limit)) {
        (incomplete = true);
        return;
      }
      ;
      acc.add($def);
      return;
    });
    let meta = ((this$) => { if (incomplete) return haystack.Etc.makeDict2("incomplete", haystack.Marker.val(), "limit", haystack.Number.makeInt(sys.ObjUtil.coerce(limit, sys.Int.type$))); return haystack.Etc.emptyDict(); })(this);
    return haystack.Etc.makeDictsGrid(meta, acc);
  }

  eachDef(cx,f) {
    cx.ns().eachDef(f);
    return;
  }

  static make() {
    const $self = new HxDefsOp();
    HxDefsOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxFiletypesOp extends HxDefsOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxFiletypesOp.type$; }

  eachDef(cx,f) {
    cx.ns().filetypes().each(f);
    return;
  }

  static make() {
    const $self = new HxFiletypesOp();
    HxFiletypesOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxDefsOp.make$($self);
    return;
  }

}

class HxLibsOp extends HxDefsOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxLibsOp.type$; }

  eachDef(cx,f) {
    cx.ns().libsList().each(f);
    return;
  }

  static make() {
    const $self = new HxLibsOp();
    HxLibsOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxDefsOp.make$($self);
    return;
  }

}

class HxOpsOp extends HxDefsOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxOpsOp.type$; }

  eachDef(cx,f) {
    cx.ns().feature("op").eachDef(f);
    return;
  }

  static make() {
    const $self = new HxOpsOp();
    HxOpsOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxDefsOp.make$($self);
    return;
  }

}

class HxReadOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxReadOp.type$; }

  onRequest(req,cx) {
    if (req.isEmpty()) {
      throw sys.Err.make("Request grid is empty");
    }
    ;
    if (req.has("filter")) {
      let reqRow = req.first();
      let filter = haystack.Filter.fromStr(sys.ObjUtil.coerce(reqRow.trap("filter", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$));
      let opts = reqRow;
      return cx.db().readAll(sys.ObjUtil.coerce(filter, haystack.Filter.type$), opts);
    }
    ;
    if (req.has("id")) {
      return cx.db().readByIds(req.ids(), false);
    }
    ;
    throw sys.Err.make("Request grid missing id or filter col");
  }

  static make() {
    const $self = new HxReadOp();
    HxReadOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxEvalOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxEvalOp.type$; }

  onRequest(req,cx) {
    if (req.isEmpty()) {
      throw sys.Err.make("Request grid is empty");
    }
    ;
    let expr = sys.ObjUtil.coerce(req.first().trap("expr", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    return haystack.Etc.toGrid(cx.evalOrReadAll(expr));
  }

  static make() {
    const $self = new HxEvalOp();
    HxEvalOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxCommitOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxCommitOp.type$; }

  onRequest(req,cx) {
    if (!cx.user().isAdmin()) {
      throw haystack.PermissionErr.make("Missing 'admin' permission: commit");
    }
    ;
    let mode = req.meta().trap("commit", sys.List.make(sys.Obj.type$.toNullable(), []));
    let $_u28 = mode;
    if (sys.ObjUtil.equals($_u28, "add")) {
      return this.onAdd(req, cx);
    }
    else if (sys.ObjUtil.equals($_u28, "update")) {
      return this.onUpdate(req, cx);
    }
    else if (sys.ObjUtil.equals($_u28, "remove")) {
      return this.onRemove(req, cx);
    }
    else {
      throw sys.ArgErr.make(sys.Str.plus("Unknown commit mode: ", mode));
    }
    ;
  }

  onAdd(req,cx) {
    const this$ = this;
    let diffs = sys.List.make(folio.Diff.type$);
    req.each((row) => {
      let changes = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
      let id = null;
      row.each((v,n) => {
        if (sys.ObjUtil.equals(n, "id")) {
          (id = sys.ObjUtil.coerce(v, haystack.Ref.type$.toNullable()));
          return;
        }
        ;
        changes.add(n, v);
        return;
      });
      diffs.add(folio.Diff.makeAdd(changes, sys.ObjUtil.coerce(((this$) => { let $_u29 = id; if ($_u29 != null) return $_u29; return haystack.Ref.gen(); })(this$), haystack.Ref.type$)));
      return;
    });
    let newRecs = cx.db().commitAll(diffs).map((d) => {
      return sys.ObjUtil.coerce(d.newRec(), haystack.Dict.type$);
    }, haystack.Dict.type$);
    return haystack.Etc.makeDictsGrid(null, sys.ObjUtil.coerce(newRecs, sys.Type.find("haystack::Dict?[]")));
  }

  onUpdate(req,cx) {
    const this$ = this;
    let flags = 0;
    if (req.meta().has("force")) {
      (flags = sys.Int.or(flags, folio.Diff.force()));
    }
    ;
    if (req.meta().has("transient")) {
      (flags = sys.Int.or(flags, folio.Diff.transient()));
    }
    ;
    let diffs = sys.List.make(folio.Diff.type$);
    req.each((row) => {
      let old = haystack.Etc.makeDict(sys.Map.__fromLiteral(["id","mod"], [row.id(),row.trap("mod", sys.List.make(sys.Obj.type$.toNullable(), []))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
      let changes = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
      row.each((v,n) => {
        if ((sys.ObjUtil.equals(n, "id") || sys.ObjUtil.equals(n, "mod"))) {
          return;
        }
        ;
        changes.add(n, v);
        return;
      });
      diffs.add(folio.Diff.make(old, changes, flags));
      return;
    });
    let newRecs = cx.db().commitAll(diffs).map((d) => {
      return sys.ObjUtil.coerce(d.newRec(), haystack.Dict.type$);
    }, haystack.Dict.type$);
    return haystack.Etc.makeDictsGrid(null, sys.ObjUtil.coerce(newRecs, sys.Type.find("haystack::Dict?[]")));
  }

  onRemove(req,cx) {
    const this$ = this;
    let flags = folio.Diff.remove();
    if (req.meta().has("force")) {
      (flags = sys.Int.or(flags, folio.Diff.force()));
    }
    ;
    let diffs = sys.List.make(folio.Diff.type$);
    req.each((row) => {
      diffs.add(folio.Diff.make(row, null, flags));
      return;
    });
    cx.db().commitAll(diffs);
    return haystack.Etc.makeEmptyGrid();
  }

  static make() {
    const $self = new HxCommitOp();
    HxCommitOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxNavOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxNavOp.type$; }

  onRequest(req,cx) {
    let func = cx.findTop("nav", false);
    if (func != null) {
      return sys.ObjUtil.coerce(func.call(cx, sys.List.make(haystack.Grid.type$, [req])), haystack.Grid.type$);
    }
    ;
    let navId = sys.ObjUtil.as(((this$) => { let $_u30 = req.first(); if ($_u30 == null) return null; return req.first().get("navId"); })(this), haystack.Ref.type$);
    if (navId == null) {
      let sites = cx.db().readAllList(sys.ObjUtil.coerce(haystack.Filter.fromStr("site"), haystack.Filter.type$));
      if (!sites.isEmpty()) {
        return this.respond(sites);
      }
      ;
      let equips = cx.db().readAllList(sys.ObjUtil.coerce(haystack.Filter.fromStr("equip"), haystack.Filter.type$));
      if (!equips.isEmpty()) {
        return this.respond(equips);
      }
      ;
      return this.respond(cx.db().readAllList(sys.ObjUtil.coerce(haystack.Filter.fromStr("point"), haystack.Filter.type$)));
    }
    ;
    let rec = cx.db().readById(navId);
    if (rec.has("site")) {
      return this.respond(cx.db().readAllList(sys.ObjUtil.coerce(haystack.Filter.fromStr(sys.Str.plus("equip and siteRef==", rec.id().toCode())), haystack.Filter.type$)));
    }
    else {
      if (rec.has("equip")) {
        return this.respond(cx.db().readAllList(sys.ObjUtil.coerce(haystack.Filter.fromStr(sys.Str.plus("point and equipRef==", rec.id().toCode())), haystack.Filter.type$)));
      }
      else {
        return haystack.Etc.emptyGrid();
      }
      ;
    }
    ;
  }

  respond(recs) {
    const this$ = this;
    if (recs.isEmpty()) {
      return haystack.Etc.emptyGrid();
    }
    ;
    (recs = sys.ObjUtil.coerce(recs.map((rec) => {
      if (rec.has("point")) {
        return rec;
      }
      ;
      return haystack.Etc.dictSet(rec, "navId", rec.id());
    }, haystack.Dict.type$), sys.Type.find("haystack::Dict[]")));
    haystack.Etc.sortDictsByDis(recs);
    return haystack.Etc.makeDictsGrid(null, recs);
  }

  static make() {
    const $self = new HxNavOp();
    HxNavOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxWatchSubOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxWatchSubOp.type$; }

  onRequest(req,cx) {
    const this$ = this;
    let watchId = sys.ObjUtil.as(req.meta().get("watchId"), sys.Str.type$);
    let watch = ((this$) => { if (watchId == null) return cx.rt().watch().open(sys.ObjUtil.coerce(req.meta().trap("watchDis", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)); return cx.rt().watch().get(sys.ObjUtil.coerce(watchId, sys.Str.type$)); })(this);
    let ids = req.ids();
    let lease = sys.ObjUtil.as(req.meta().get("lease"), haystack.Number.type$);
    if (lease != null) {
      watch.lease(sys.ObjUtil.coerce(lease.toDuration(), sys.Duration.type$));
    }
    ;
    watch.addAll(ids);
    let resMeta = haystack.Etc.makeDict2("watchId", watch.id(), "lease", haystack.Number.makeDuration(watch.lease(), null));
    let recs = cx.rt().db().readByIdsList(ids, false);
    let colNames = haystack.Etc.dictsNames(recs);
    let gb = haystack.GridBuilder.make();
    gb.setMeta(resMeta);
    if (colNames.isEmpty()) {
      gb.addCol("id");
      recs.each((it) => {
        gb.addRow1(null);
        return;
      });
    }
    else {
      colNames.each((colName) => {
        gb.addCol(colName);
        return;
      });
      gb.addDictRows(recs);
    }
    ;
    return gb.toGrid();
  }

  static make() {
    const $self = new HxWatchSubOp();
    HxWatchSubOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxWatchUnsubOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxWatchUnsubOp.type$; }

  onRequest(req,cx) {
    let watchId = ((this$) => { let $_u32 = sys.ObjUtil.as(req.meta().get("watchId"), sys.Str.type$); if ($_u32 != null) return $_u32; throw sys.Err.make("Missing meta.watchId"); })(this);
    let close = req.meta().has("close");
    let watch = cx.rt().watch().get(sys.ObjUtil.coerce(watchId, sys.Str.type$), false);
    if (watch == null) {
      return haystack.Etc.emptyGrid();
    }
    ;
    if (close) {
      watch.close();
    }
    else {
      watch.removeGrid(req);
    }
    ;
    return haystack.Etc.emptyGrid();
  }

  static make() {
    const $self = new HxWatchUnsubOp();
    HxWatchUnsubOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxWatchPollOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxWatchPollOp.type$; }

  onRequest(req,cx) {
    let watchId = ((this$) => { let $_u33 = sys.ObjUtil.as(req.meta().get("watchId"), sys.Str.type$); if ($_u33 != null) return $_u33; throw sys.Err.make("Missing meta.watchId"); })(this);
    let refresh = req.meta().has("refresh");
    let curValSub = req.meta().has("curValSub");
    let watch = cx.rt().watch().get(sys.ObjUtil.coerce(watchId, sys.Str.type$));
    let recs = ((this$) => { if (refresh) return watch.poll(sys.Duration.defVal()); return watch.poll(); })(this);
    let resMeta = haystack.Etc.makeDict1("watchId", watchId);
    if (curValSub) {
      return haystack.GridBuilder.make().setMeta(resMeta).addCol("id").addCol("curVal").addCol("curStatus").addDictRows(recs).toGrid();
    }
    else {
      return haystack.Etc.makeDictsGrid(resMeta, recs);
    }
    ;
  }

  static make() {
    const $self = new HxWatchPollOp();
    HxWatchPollOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxHisReadOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxHisReadOp.type$; }

  onRequest(req,cx) {
    if (req.isEmpty()) {
      throw sys.Err.make("Request grid is empty");
    }
    ;
    if (req.meta().has("range")) {
      return this.onBatch(req, cx);
    }
    else {
      return this.onSingle(req, cx);
    }
    ;
  }

  onSingle(req,cx) {
    const this$ = this;
    let reqRow = req.get(0);
    let rec = cx.db().readById(reqRow.id());
    let tz = folio.FolioUtil.hisTz(sys.ObjUtil.coerce(rec, haystack.Dict.type$));
    let span = HxHisReadOp.parseRange(sys.ObjUtil.coerce(tz, sys.TimeZone.type$), sys.ObjUtil.coerce(reqRow.trap("range", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)).toTimeZone(sys.ObjUtil.coerce(tz, sys.TimeZone.type$));
    let meta = sys.Map.__fromLiteral(["id","hisStart","hisEnd"], [rec.id(),span.start(),span.end()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let gb = haystack.GridBuilder.make().setMeta(meta).addCol("ts").addCol("val");
    cx.rt().his().read(sys.ObjUtil.coerce(rec, haystack.Dict.type$), span, req.meta(), (item) => {
      if (sys.ObjUtil.compareLT(item.ts(), span.start())) {
        return;
      }
      ;
      if (sys.ObjUtil.compareGE(item.ts(), span.end())) {
        return;
      }
      ;
      gb.addRow2(item.ts(), item.val());
      return;
    });
    return gb.toGrid();
  }

  onBatch(req,cx) {
    const this$ = this;
    let recs = sys.List.make(haystack.Dict.type$);
    req.each((row) => {
      recs.add(sys.ObjUtil.coerce(cx.db().readById(row.id()), haystack.Dict.type$));
      return;
    });
    if (recs.isEmpty()) {
      throw sys.Err.make("No recs");
    }
    ;
    let tz = null;
    let tzName = sys.ObjUtil.as(req.meta().get("tz"), sys.Str.type$);
    if (tzName != null) {
      (tz = sys.TimeZone.fromStr(sys.ObjUtil.coerce(tzName, sys.Str.type$)));
    }
    else {
      (tz = folio.FolioUtil.hisTz(recs.get(0)));
      recs.each((rec) => {
        if (tz !== folio.FolioUtil.hisTz(recs.get(0))) {
          throw sys.Err.make("Points do not share same tz, pass tz in meta");
        }
        ;
        return;
      });
    }
    ;
    let span = HxHisReadOp.parseRange(sys.ObjUtil.coerce(tz, sys.TimeZone.type$), sys.ObjUtil.coerce(req.meta().trap("range", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)).toTimeZone(sys.ObjUtil.coerce(tz, sys.TimeZone.type$));
    let rows = sys.Map.__fromLiteral([], [], sys.Type.find("sys::DateTime"), sys.Type.find("sys::Obj?[]"));
    recs.each((rec,i) => {
      this$.readBatch(req, cx, rec, span, (ts,val) => {
        let row = rows.get(ts);
        if (row == null) {
          (row = sys.List.make(sys.Obj.type$.toNullable()));
          row.size(sys.Int.plus(recs.size(), 1));
          row.set(0, ts);
          rows.set(ts, sys.ObjUtil.coerce(row, sys.Type.find("sys::Obj?[]")));
        }
        ;
        row.set(sys.Int.plus(i, 1), val);
        return;
      });
      return;
    });
    let gb = haystack.GridBuilder.make();
    gb.setMeta(sys.Map.__fromLiteral(["hisStart","hisEnd"], [span.start(),span.end()], sys.Type.find("sys::Str"), sys.Type.find("sys::DateTime")));
    gb.addCol("ts");
    recs.each((rec,i) => {
      gb.addCol(sys.Str.plus("v", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), sys.Map.__fromLiteral(["id"], [rec.id()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Ref")));
      return;
    });
    rows.keys().sort().each((ts) => {
      gb.addRow(sys.ObjUtil.coerce(rows.get(ts), sys.Type.find("sys::Obj?[]")));
      return;
    });
    return gb.toGrid();
  }

  readBatch(req,cx,rec,span,f) {
    const this$ = this;
    cx.rt().his().read(rec, span, req.meta(), (item) => {
      if (sys.ObjUtil.compareLT(item.ts(), span.start())) {
        return;
      }
      ;
      if (sys.ObjUtil.compareGE(item.ts(), span.end())) {
        return;
      }
      ;
      sys.Func.call(f, item.ts().toTimeZone(span.tz()), sys.ObjUtil.coerce(item.val(), sys.Obj.type$));
      return;
    });
    return;
  }

  static parseRange(tz,q) {
    try {
      if (sys.ObjUtil.equals(q, "today")) {
        return haystack.DateSpan.today().toSpan(tz);
      }
      ;
      if (sys.ObjUtil.equals(q, "yesterday")) {
        return haystack.DateSpan.yesterday().toSpan(tz);
      }
      ;
      let start = null;
      let end = null;
      let comma = sys.Str.index(q, ",");
      if (comma == null) {
        (start = haystack.ZincReader.make(sys.Str.in(q)).readVal());
      }
      else {
        (start = haystack.ZincReader.make(sys.Str.in(sys.Str.trim(sys.Str.getRange(q, sys.Range.make(0, sys.ObjUtil.coerce(comma, sys.Int.type$), true))))).readVal());
        (end = haystack.ZincReader.make(sys.Str.in(sys.Str.trim(sys.Str.getRange(q, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(comma, sys.Int.type$), 1), -1))))).readVal());
      }
      ;
      if (sys.ObjUtil.is(start, sys.Date.type$)) {
        if (end == null) {
          return haystack.DateSpan.make(sys.ObjUtil.coerce(start, sys.Date.type$)).toSpan(tz);
        }
        ;
        if (sys.ObjUtil.is(end, sys.Date.type$)) {
          return haystack.DateSpan.make(sys.ObjUtil.coerce(start, sys.Date.type$), sys.ObjUtil.coerce(end, sys.Obj.type$)).toSpan(tz);
        }
        ;
      }
      else {
        if (sys.ObjUtil.is(start, sys.DateTime.type$)) {
          if (end == null) {
            return sys.ObjUtil.coerce(haystack.Span.makeAbs(sys.ObjUtil.coerce(start, sys.DateTime.type$), sys.DateTime.now().toTimeZone(sys.ObjUtil.coerce(start, sys.DateTime.type$).tz())), haystack.Span.type$);
          }
          ;
          if (sys.ObjUtil.is(end, sys.DateTime.type$)) {
            return sys.ObjUtil.coerce(haystack.Span.makeAbs(sys.ObjUtil.coerce(start, sys.DateTime.type$), sys.ObjUtil.coerce(end, sys.DateTime.type$)), haystack.Span.type$);
          }
          ;
        }
        ;
      }
      ;
      throw sys.Err.make(sys.Str.plus("Invalid range: ", q));
    }
    catch ($_u35) {
      $_u35 = sys.Err.make($_u35);
      if ($_u35 instanceof sys.Err) {
        let e = $_u35;
        ;
        throw sys.ParseErr.make(sys.Str.plus("Invalid history range: ", q), e);
      }
      else {
        throw $_u35;
      }
    }
    ;
  }

  static make() {
    const $self = new HxHisReadOp();
    HxHisReadOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxHisWriteOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxHisWriteOp.type$; }

  onRequest(req,cx) {
    cx.checkAdmin("hisWrite op");
    if (req.meta().has("id")) {
      this.onSingle(req, cx);
    }
    else {
      this.onBatch(req, cx);
    }
    ;
    return haystack.Etc.emptyGrid();
  }

  onSingle(req,cx) {
    this.write(req, cx, req.meta().id(), sys.ObjUtil.coerce(req.col("ts"), haystack.Col.type$), sys.ObjUtil.coerce(req.col("val"), haystack.Col.type$));
    return;
  }

  onBatch(req,cx) {
    const this$ = this;
    let tsCol = req.cols().get(0);
    if (sys.ObjUtil.compareNE(tsCol.name(), "ts")) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("First col must be named 'ts', not '", tsCol.name()), "'"));
    }
    ;
    req.cols().eachRange(sys.Range.make(1, -1), (valCol) => {
      let id = ((this$) => { let $_u36 = sys.ObjUtil.as(valCol.meta().get("id"), haystack.Ref.type$); if ($_u36 != null) return $_u36; throw sys.Err.make(sys.Str.plus("Col missing id tag: ", valCol.name())); })(this$);
      this$.write(req, cx, sys.ObjUtil.coerce(id, haystack.Ref.type$), tsCol, valCol);
      return;
    });
    return;
  }

  write(req,cx,id,tsCol,valCol) {
    const this$ = this;
    let rec = cx.db().readById(id);
    let items = sys.List.make(haystack.HisItem.type$);
    items.capacity(req.size());
    req.each((row) => {
      let tsRaw = row.val(tsCol);
      let ts = ((this$) => { let $_u37 = sys.ObjUtil.as(tsRaw, sys.DateTime.type$); if ($_u37 != null) return $_u37; throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Timestamp value is not DateTime: ", tsRaw), " ["), ((this$) => { let $_u38 = tsRaw; if ($_u38 == null) return null; return sys.ObjUtil.typeof(tsRaw); })(this$)), "]")); })(this$);
      let val = row.val(valCol);
      if (val == null) {
        return;
      }
      ;
      items.add(haystack.HisItem.make(sys.ObjUtil.coerce(ts, sys.DateTime.type$), val));
      return;
    });
    let opts = req.meta();
    cx.rt().his().write(sys.ObjUtil.coerce(rec, haystack.Dict.type$), items, opts);
    return;
  }

  static make() {
    const $self = new HxHisWriteOp();
    HxHisWriteOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxPointWriteOp extends HxApiOp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxPointWriteOp.type$; }

  onRequest(req,cx) {
    if (sys.ObjUtil.compareNE(req.size(), 1)) {
      throw sys.Err.make("Request grid must have 1 row");
    }
    ;
    let reqRow = req.first();
    let rec = cx.db().readById(reqRow.id());
    let level = sys.ObjUtil.as(reqRow.get("level"), haystack.Number.type$);
    if (level == null) {
      return cx.rt().pointWrite().array(sys.ObjUtil.coerce(rec, haystack.Dict.type$));
    }
    ;
    cx.checkAdmin("pointWrite op");
    let val = reqRow.get("val");
    let who = ((this$) => { let $_u39 = ((this$) => { let $_u40 = reqRow.get("who"); if ($_u40 == null) return null; return sys.ObjUtil.toStr(reqRow.get("who")); })(this$); if ($_u39 != null) return $_u39; return cx.user().dis(); })(this);
    let dur = sys.ObjUtil.as(reqRow.get("duration"), haystack.Number.type$);
    (who = sys.Str.plus("Haystack.pointWrite | ", who));
    if ((val != null && sys.ObjUtil.equals(level.toInt(), 8) && dur != null)) {
      (val = haystack.Etc.makeDict2("val", val, "duration", dur.toDuration()));
    }
    ;
    cx.rt().pointWrite().write(sys.ObjUtil.coerce(rec, haystack.Dict.type$), val, level.toInt(), sys.ObjUtil.coerce(who, sys.Obj.type$)).get(sys.Duration.fromStr("30sec"));
    return haystack.Etc.makeEmptyGrid(haystack.Etc.makeDict1("ok", haystack.Marker.val()));
  }

  static make() {
    const $self = new HxPointWriteOp();
    HxPointWriteOp.make$($self);
    return $self;
  }

  static make$($self) {
    HxApiOp.make$($self);
    return;
  }

}

class HxContext extends axon.AxonContext {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxContext.type$; }

  #feedInitRef = null;

  feedInitRef(it) {
    if (it === undefined) {
      return this.#feedInitRef;
    }
    else {
      this.#feedInitRef = it;
      return;
    }
  }

  static curHx(checked) {
    if (checked === undefined) checked = true;
    let cx = concurrent.Actor.locals().get(haystack.Etc.cxActorLocalsKey());
    if (cx != null) {
      return sys.ObjUtil.coerce(cx, HxContext.type$.toNullable());
    }
    ;
    if (checked) {
      throw ContextUnavailableErr.make("No HxContext available");
    }
    ;
    return null;
  }

  checkSu(action) {
    if (!this.user().isSu()) {
      throw haystack.PermissionErr.make(sys.Str.plus("Missing 'su' permission: ", action));
    }
    ;
    return;
  }

  checkAdmin(action) {
    if (!this.user().isAdmin()) {
      throw haystack.PermissionErr.make(sys.Str.plus("Missing 'admin' permission: ", action));
    }
    ;
    return;
  }

  feedInit() {
    return sys.ObjUtil.coerce(((this$) => { let $_u41 = this$.feedInitRef(); if ($_u41 != null) return $_u41; throw sys.Err.make("Feeds not supported"); })(this), HxFeedInit.type$);
  }

  feedIsEnabled() {
    return false;
  }

  feedAdd(feed,meta) {
    if (meta === undefined) meta = null;
    return;
  }

  readCacheClear() {
    return;
  }

  export(req,out) {
    throw sys.UnsupportedErr.make("Export not supported");
  }

  static make() {
    const $self = new HxContext();
    HxContext.make$($self);
    return $self;
  }

  static make$($self) {
    axon.AxonContext.make$($self);
    return;
  }

}

class HxCli extends util.AbstractMain {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxCli.type$; }

  static find(name) {
    const this$ = this;
    return HxCli.list().find((cmd) => {
      return (sys.ObjUtil.equals(cmd.name(), name) || cmd.aliases().contains(name));
    });
  }

  static list() {
    const this$ = this;
    let acc = sys.List.make(HxCli.type$);
    sys.Env.cur().index("hx.cli").each((qname) => {
      try {
        let type = sys.Type.find(qname);
        let cmd = sys.ObjUtil.coerce(type.make(), HxCli.type$);
        acc.add(cmd);
      }
      catch ($_u42) {
        $_u42 = sys.Err.make($_u42);
        if ($_u42 instanceof sys.Err) {
          let e = $_u42;
          ;
          sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("ERROR: invalid hx.cli ", qname), "\n  "), e));
        }
        else {
          throw $_u42;
        }
      }
      ;
      return;
    });
    acc.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    return acc;
  }

  appName() {
    return sys.Str.plus("hx ", this.name());
  }

  log() {
    return sys.Log.get("hx");
  }

  aliases() {
    return sys.List.make(sys.Str.type$);
  }

  printLine(line) {
    if (line === undefined) line = "";
    sys.ObjUtil.echo(line);
    return;
  }

  err(msg) {
    this.printLine(sys.Str.plus("ERROR: ", msg));
    return 1;
  }

  static make() {
    const $self = new HxCli();
    HxCli.make$($self);
    return $self;
  }

  static make$($self) {
    util.AbstractMain.make$($self);
    return;
  }

}

class Main extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Main.type$; }

  static main(args) {
    if ((args.isEmpty() || sys.ObjUtil.equals(args.first(), "-?") || sys.ObjUtil.equals(args.first(), "-help") || sys.ObjUtil.equals(args.first(), "--help"))) {
      (args = sys.List.make(sys.Str.type$, ["help"]));
    }
    ;
    let cmdName = args.first();
    let cmd = HxCli.find(sys.ObjUtil.coerce(cmdName, sys.Str.type$));
    if (cmd == null) {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("ERROR: unknown command '", cmdName), "'"));
      return 1;
    }
    ;
    return cmd.main(args.dup().getRange(sys.Range.make(1, -1)));
  }

  static make() {
    const $self = new Main();
    Main.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HelpCli extends HxCli {
  constructor() {
    super();
    const this$ = this;
    this.#commandName = sys.List.make(sys.Str.type$);
    return;
  }

  typeof() { return HelpCli.type$; }

  #commandName = null;

  commandName(it) {
    if (it === undefined) {
      return this.#commandName;
    }
    else {
      this.#commandName = it;
      return;
    }
  }

  name() {
    return "help";
  }

  aliases() {
    return sys.List.make(sys.Str.type$, ["-h", "-?"]);
  }

  summary() {
    return "Print listing of available commands";
  }

  run() {
    const this$ = this;
    if (sys.ObjUtil.compareGT(this.#commandName.size(), 0)) {
      let cmdName = this.#commandName.get(0);
      let cmd = HxCli.find(cmdName);
      if (cmd == null) {
        return this.err(sys.Str.plus(sys.Str.plus("Unknown help command '", cmdName), "'"));
      }
      ;
      this.printLine();
      let ret = cmd.usage();
      this.printLine();
      return ret;
    }
    ;
    let cmds = HxCli.list();
    let maxName = 4;
    cmds.each((cmd) => {
      (maxName = sys.Int.max(maxName, sys.Str.size(cmd.name())));
      return;
    });
    this.printLine();
    this.printLine("Haxall CLI commands:");
    this.printLine();
    HxCli.list().each((cmd) => {
      this$.printLine(sys.Str.plus(sys.Str.plus(sys.Str.padr(cmd.name(), maxName), "  "), cmd.summary()));
      return;
    });
    this.printLine();
    return 0;
  }

  static make() {
    const $self = new HelpCli();
    HelpCli.make$($self);
    return $self;
  }

  static make$($self) {
    HxCli.make$($self);
    ;
    return;
  }

}

class VersionCli extends HxCli {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return VersionCli.type$; }

  name() {
    return "version";
  }

  aliases() {
    return sys.List.make(sys.Str.type$, ["-v"]);
  }

  summary() {
    return "Print version info";
  }

  run() {
    const this$ = this;
    let props = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj]"));
    props.set("hx.version", sys.ObjUtil.typeof(this).pod().version().toStr());
    util.AbstractMain.runtimeProps(props);
    let out = sys.Env.cur().out();
    out.printLine();
    this.printLine("Haxall CLI");
    this.printLine(sys.Str.plus(sys.Str.plus("Copyright (c) 2009-", sys.ObjUtil.coerce(sys.Date.today().year(), sys.Obj.type$.toNullable())), ", SkyFoundry LLC"));
    this.printLine("Licensed under the Academic Free License version 3.0");
    out.printLine();
    util.AbstractMain.printProps(props, sys.Map.__fromLiteral(["out"], [out], sys.Type.find("sys::Str"), sys.Type.find("sys::OutStream")));
    out.printLine();
    return 0;
    return 0;
  }

  static make() {
    const $self = new VersionCli();
    VersionCli.make$($self);
    return $self;
  }

  static make$($self) {
    HxCli.make$($self);
    return;
  }

}

class HxConfig extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxConfig.type$; }

  #metaRef = null;

  // private field reflection only
  __metaRef(it) { if (it === undefined) return this.#metaRef; else this.#metaRef = it; }

  static make(meta) {
    const $self = new HxConfig();
    HxConfig.make$($self,meta);
    return $self;
  }

  static make$($self,meta) {
    $self.#metaRef = meta;
    return;
  }

  meta() {
    return this.#metaRef;
  }

  has(name) {
    return this.meta().has(name);
  }

  get(name,$def) {
    if ($def === undefined) $def = null;
    return this.meta().get(name, $def);
  }

  makeSpi(key) {
    let qname = ((this$) => { let $_u43 = this$.get(key); if ($_u43 != null) return $_u43; throw sys.Err.make(sys.Str.plus("Boot config missing key: ", key)); })(this);
    return sys.Type.find(sys.ObjUtil.coerce(qname, sys.Str.type$)).make();
  }

  isTest() {
    return this.meta().has("test");
  }

}

class HxFeed extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxFeed.type$; }

  #viewId = null;

  viewId() { return this.#viewId; }

  __viewId(it) { if (it === undefined) return this.#viewId; else this.#viewId = it; }

  #key = null;

  key() { return this.#key; }

  __key(it) { if (it === undefined) return this.#key; else this.#key = it; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  static make(cx) {
    const $self = new HxFeed();
    HxFeed.make$($self,cx);
    return $self;
  }

  static make$($self,cx) {
    let init = cx.feedInit();
    $self.#rt = init.rt();
    $self.#viewId = init.viewId();
    $self.#key = init.key();
    $self.#log = init.log();
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this).name()), " "), this.#key);
  }

  subscribe(req,cx) {
    throw sys.UnsupportedErr.make(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this)), ".subscribe"));
  }

  unsubscribe() {
    return;
  }

  call(req,cx) {
    throw sys.UnsupportedErr.make(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this)), ".call"));
  }

  err(msg,err) {
    this.#log.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Feed ", this.#key), ": "), msg), err);
    return;
  }

}

class HxFeedInit extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxFeedInit.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #viewId = null;

  viewId() { return this.#viewId; }

  __viewId(it) { if (it === undefined) return this.#viewId; else this.#viewId = it; }

  #key = null;

  key() { return this.#key; }

  __key(it) { if (it === undefined) return this.#key; else this.#key = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  static make(f) {
    const $self = new HxFeedInit();
    HxFeedInit.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    sys.Func.call(f, $self);
    return;
  }

}

class HxPlatform extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxPlatform.type$; }

  #metaRef = null;

  // private field reflection only
  __metaRef(it) { if (it === undefined) return this.#metaRef; else this.#metaRef = it; }

  #isShell = false;

  isShell() { return this.#isShell; }

  __isShell(it) { if (it === undefined) return this.#isShell; else this.#isShell = it; }

  static make(meta) {
    const $self = new HxPlatform();
    HxPlatform.make$($self,meta);
    return $self;
  }

  static make$($self,meta) {
    $self.#metaRef = meta;
    $self.#isShell = meta.has("axonsh");
    return;
  }

  meta() {
    return this.#metaRef;
  }

  os() {
    return sys.Env.cur().os();
  }

  arch() {
    return sys.Env.cur().arch();
  }

  isSkySpark() {
    return false;
  }

  logoUri() {
    return sys.ObjUtil.coerce(((this$) => { let $_u44 = sys.ObjUtil.as(this$.meta().get("logoUri"), sys.Uri.type$); if ($_u44 != null) return $_u44; return sys.Uri.fromStr("/hxUser/logo.svg"); })(this), sys.Uri.type$);
  }

  faviconUri() {
    return sys.ObjUtil.coerce(((this$) => { let $_u45 = sys.ObjUtil.as(this$.meta().get("faviconUri"), sys.Uri.type$); if ($_u45 != null) return $_u45; return sys.Uri.fromStr("/hxUser/favicon.png"); })(this), sys.Uri.type$);
  }

  productName() {
    return sys.ObjUtil.coerce(((this$) => { let $_u46 = sys.ObjUtil.as(this$.meta().get("productName"), sys.Str.type$); if ($_u46 != null) return $_u46; return "Haxall"; })(this), sys.Str.type$);
  }

  productVersion() {
    return sys.ObjUtil.coerce(((this$) => { let $_u47 = sys.ObjUtil.as(this$.meta().get("productVersion"), sys.Str.type$); if ($_u47 != null) return $_u47; return sys.ObjUtil.typeof(this$).pod().version().toStr(); })(this), sys.Str.type$);
  }

  productUri() {
    return sys.ObjUtil.coerce(((this$) => { let $_u48 = sys.ObjUtil.as(this$.meta().get("productUri"), sys.Uri.type$); if ($_u48 != null) return $_u48; return sys.Uri.fromStr("https://haxall.io/"); })(this), sys.Uri.type$);
  }

  vendorName() {
    return sys.ObjUtil.coerce(((this$) => { let $_u49 = sys.ObjUtil.as(this$.meta().get("vendorName"), sys.Str.type$); if ($_u49 != null) return $_u49; return "SkyFoundry"; })(this), sys.Str.type$);
  }

  vendorUri() {
    return sys.ObjUtil.coerce(((this$) => { let $_u50 = sys.ObjUtil.as(this$.meta().get("vendorUri"), sys.Uri.type$); if ($_u50 != null) return $_u50; return sys.Uri.fromStr("https://skyfoundry.com/"); })(this), sys.Uri.type$);
  }

  hostOs() {
    return sys.ObjUtil.coerce(((this$) => { let $_u51 = sys.ObjUtil.as(this$.meta().get("hostOs"), sys.Str.type$); if ($_u51 != null) return $_u51; return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.os()), " "), this$.arch()), " "), sys.Env.cur().vars().get("os.version")); })(this), sys.Str.type$);
  }

  hostModel() {
    return sys.ObjUtil.coerce(((this$) => { let $_u52 = sys.ObjUtil.as(this$.meta().get("hostModel"), sys.Str.type$); if ($_u52 != null) return $_u52; return sys.Str.plus(sys.Str.plus(sys.Str.plus(this$.productName(), " ("), sys.Env.cur().vars().get("os.name")), ")"); })(this), sys.Str.type$);
  }

}

class HxCoreFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxCoreFuncs.type$; }

  static read(filterExpr,checked) {
    if (checked === undefined) checked = axon.Literal.trueVal();
    let cx = HxCoreFuncs.curContext();
    let filter = filterExpr.evalToFilter(cx);
    let check = checked.eval(cx);
    return cx.db().read(sys.ObjUtil.coerce(filter, haystack.Filter.type$), sys.ObjUtil.coerce(check, sys.Bool.type$));
  }

  static readById(id,checked) {
    if (checked === undefined) checked = true;
    return HxCoreFuncs.curContext().db().readById(((this$) => { let $_u53 = id; if ($_u53 != null) return $_u53; return haystack.Ref.nullRef(); })(this), checked);
  }

  static readByIdPersistentTags(id,checked) {
    if (checked === undefined) checked = true;
    return HxCoreFuncs.curContext().db().readByIdPersistentTags(id, checked);
  }

  static readByIdTransientTags(id,checked) {
    if (checked === undefined) checked = true;
    return HxCoreFuncs.curContext().db().readByIdTransientTags(id, checked);
  }

  static readLink(id) {
    const this$ = this;
    let cx = HxCoreFuncs.curContext();
    let rec = cx.db().readById(((this$) => { let $_u54 = id; if ($_u54 != null) return $_u54; return haystack.Ref.nullRef(); })(this), false);
    if (rec == null) {
      return rec;
    }
    ;
    let gb = haystack.GridBuilder.make();
    let row = sys.List.make(sys.Obj.type$.toNullable());
    haystack.Etc.dictsNames(sys.List.make(haystack.Dict.type$.toNullable(), [rec])).each((n) => {
      gb.addCol(n);
      row.add(rec.get(n));
      return;
    });
    gb.addRow(row);
    return gb.toGrid().first();
  }

  static readByIds(ids,checked) {
    if (checked === undefined) checked = true;
    return HxCoreFuncs.curContext().db().readByIds(ids, checked);
  }

  static readAll(filterExpr,optsExpr) {
    if (optsExpr === undefined) optsExpr = null;
    let cx = HxCoreFuncs.curContext();
    let filter = filterExpr.evalToFilter(cx);
    let opts = ((this$) => { if (optsExpr == null) return haystack.Etc.emptyDict(); return sys.ObjUtil.coerce(optsExpr.eval(cx), haystack.Dict.type$.toNullable()); })(this);
    return cx.db().readAll(sys.ObjUtil.coerce(filter, haystack.Filter.type$), opts);
  }

  static readByIdsStream(ids,checked) {
    if (checked === undefined) checked = true;
    return ReadByIdsStream.make(ids, checked);
  }

  static readAllStream(filterExpr) {
    let cx = HxCoreFuncs.curContext();
    let filter = filterExpr.evalToFilter(cx);
    return ReadAllStream.make(sys.ObjUtil.coerce(filter, haystack.Filter.type$));
  }

  static readAllTagNames(filterExpr) {
    let cx = HxCoreFuncs.curContext();
    let filter = filterExpr.evalToFilter(cx);
    return HxUtil.readAllTagNames(cx.db(), sys.ObjUtil.coerce(filter, haystack.Filter.type$));
  }

  static readAllTagVals(filterExpr,tagName) {
    let cx = HxCoreFuncs.curContext();
    let filter = filterExpr.evalToFilter(cx);
    let tag = tagName.eval(cx);
    let vals = HxUtil.readAllTagVals(cx.db(), sys.ObjUtil.coerce(filter, haystack.Filter.type$), sys.ObjUtil.coerce(tag, sys.Str.type$));
    return haystack.Etc.makeListGrid(null, "val", null, vals);
  }

  static readCount(filterExpr) {
    let cx = HxCoreFuncs.curContext();
    let filter = filterExpr.evalToFilter(cx);
    return sys.ObjUtil.coerce(haystack.Number.makeInt(cx.db().readCount(sys.ObjUtil.coerce(filter, haystack.Filter.type$))), haystack.Number.type$);
  }

  static toRecId(val) {
    return haystack.Etc.toId(val);
  }

  static toRecIdList(val) {
    return haystack.Etc.toIds(val);
  }

  static toRec(val) {
    return haystack.Etc.toRec(val);
  }

  static toRecList(val) {
    return haystack.Etc.toRecs(val);
  }

  static diff(orig,changes,flags) {
    if (flags === undefined) flags = null;
    if (changes == null) {
      (changes = haystack.Etc.emptyDict());
    }
    ;
    (changes = haystack.Etc.dictRemoveNulls(sys.ObjUtil.coerce(changes, haystack.Dict.type$)));
    let mask = 0;
    if (flags != null) {
      if (flags.has("add")) {
        if (orig != null) {
          throw sys.ArgErr.make("orig must be null if using 'add' flag");
        }
        ;
        let id = sys.ObjUtil.as(changes.get("id"), haystack.Ref.type$);
        if (id != null) {
          (changes = haystack.Etc.dictRemove(sys.ObjUtil.coerce(changes, haystack.Dict.type$), "id"));
        }
        else {
          (id = haystack.Ref.gen());
        }
        ;
        return folio.Diff.makeAdd(changes, sys.ObjUtil.coerce(id, haystack.Ref.type$));
      }
      ;
      if (flags.has("add")) {
        (mask = sys.Int.or(mask, folio.Diff.add()));
      }
      ;
      if (flags.has("remove")) {
        (mask = sys.Int.or(mask, folio.Diff.remove()));
      }
      ;
      if (flags.has("transient")) {
        (mask = sys.Int.or(mask, folio.Diff.transient()));
      }
      ;
      if (flags.has("force")) {
        (mask = sys.Int.or(mask, folio.Diff.force()));
      }
      ;
    }
    ;
    return folio.Diff.make(orig, changes, mask);
  }

  static commit(diffs) {
    const this$ = this;
    if (sys.ObjUtil.is(diffs, axon.MStream.type$)) {
      return CommitStream.make(sys.ObjUtil.coerce(diffs, axon.MStream.type$)).run();
    }
    ;
    let cx = HxCoreFuncs.curContext();
    cx.readCacheClear();
    if (sys.ObjUtil.is(diffs, folio.Diff.type$)) {
      return cx.db().commit(sys.ObjUtil.coerce(diffs, folio.Diff.type$)).newRec();
    }
    ;
    if ((sys.ObjUtil.is(diffs, sys.Type.find("sys::List")) && sys.ObjUtil.coerce(diffs, sys.Type.find("sys::List")).all((it) => {
      return sys.ObjUtil.is(it, folio.Diff.type$);
    }))) {
      return cx.db().commitAll(sys.ObjUtil.coerce(diffs, sys.Type.find("folio::Diff[]"))).map((r) => {
        return r.newRec();
      }, sys.Obj.type$.toNullable());
    }
    ;
    throw sys.Err.make(sys.Str.plus("Invalid diff arg: ", sys.ObjUtil.typeof(diffs)));
  }

  static passwordSet(key,val) {
    let cx = HxCoreFuncs.curContext();
    if (!cx.user().isAdmin()) {
      throw haystack.PermissionErr.make("passwordSet");
    }
    ;
    if (val == null) {
      cx.db().passwords().remove(sys.ObjUtil.toStr(key));
    }
    else {
      cx.db().passwords().set(sys.ObjUtil.toStr(key), sys.ObjUtil.coerce(val, sys.Str.type$));
    }
    ;
    return;
  }

  static stripUncommittable(val,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    (opts = haystack.Etc.makeDict(opts));
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return folio.FolioUtil.stripUncommittable(HxCoreFuncs.curContext().db(), sys.ObjUtil.coerce(val, haystack.Dict.type$), sys.ObjUtil.coerce(opts, haystack.Dict.type$.toNullable()));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Grid.type$).mapToList((r) => {
        return sys.ObjUtil.coerce(HxCoreFuncs.stripUncommittable(r, opts), haystack.Dict.type$);
      }, haystack.Dict.type$);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).map((r) => {
        return sys.ObjUtil.coerce(HxCoreFuncs.stripUncommittable(sys.ObjUtil.coerce(r, sys.Obj.type$), opts), haystack.Dict.type$);
      }, haystack.Dict.type$);
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Must be Dict, Dict[], or Grid: ", sys.ObjUtil.typeof(val)));
  }

  static isSteadyState() {
    return HxCoreFuncs.curContext().rt().isSteadyState();
  }

  static libAdd(name,tags) {
    if (tags === undefined) tags = null;
    return HxCoreFuncs.curContext().rt().libs().add(name, sys.ObjUtil.coerce(((this$) => { let $_u56 = tags; if ($_u56 != null) return $_u56; return haystack.Etc.emptyDict(); })(this), haystack.Dict.type$)).rec();
  }

  static libRemove(name) {
    HxCoreFuncs.curContext().rt().libs().remove(name);
    return "removed";
  }

  static libStatus() {
    return HxCoreFuncs.curContext().rt().libs().status();
  }

  static services() {
    const this$ = this;
    let services = HxCoreFuncs.curContext().rt().services();
    let gb = haystack.GridBuilder.make();
    gb.addCol("type").addCol("qname");
    services.list().each((type) => {
      services.getAll(type).each((service) => {
        gb.addRow2(type.qname(), sys.ObjUtil.typeof(service).qname());
        return;
      });
      return;
    });
    return gb.toGrid();
  }

  static xetoReload() {
    let cx = HxContext.curHx();
    let isShell = cx.rt().platform().isShell();
    let log = ((this$) => { if (isShell) return sys.Log.get("xeto"); return cx.rt().lib("xeto").log(); })(this);
    log.info(sys.Str.plus(sys.Str.plus("xetoReload [", cx.user().username()), "]"));
    cx.rt().context().xetoReload();
    return ((this$) => { if (isShell) return "_no_echo_"; return "reloaded"; })(this);
  }

  static usingStatus() {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.addCol("name").addCol("libStatus").addCol("enabled").addCol("version").addCol("doc");
    let cx = HxCoreFuncs.curContext();
    let ns = cx.xeto();
    let repo = xeto.LibRepo.cur();
    let system = xeto.LibNamespace.system();
    repo.libs().each((libName) => {
      let status = ((this$) => { let $_u59 = ((this$) => { let $_u60 = ns.libStatus(libName, false); if ($_u60 == null) return null; return ns.libStatus(libName, false).name(); })(this$); if ($_u59 != null) return $_u59; return "disabled"; })(this$);
      let enabledVer = ns.version(libName, false);
      let isSys = sys.ObjUtil.equals(libName, "sys");
      let isEnabled = enabledVer != null;
      let ver = ((this$) => { let $_u61 = enabledVer; if ($_u61 != null) return $_u61; return repo.latest(libName); })(this$);
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [libName, status, ((this$) => { if (system.version(libName, false) != null) return "boot"; return haystack.Marker.fromBool(isEnabled); })(this$), ver.version().toStr(), ver.doc()]));
      return;
    });
    return gb.toGrid().sort((a,b) => {
      let aEnableKey = ((this$) => { let $_u63 = ((this$) => { let $_u64 = a.get("enabled"); if ($_u64 == null) return null; return sys.ObjUtil.toStr(a.get("enabled")); })(this$); if ($_u63 != null) return $_u63; return "z"; })(this$);
      let bEnableKey = ((this$) => { let $_u65 = ((this$) => { let $_u66 = b.get("enabled"); if ($_u66 == null) return null; return sys.ObjUtil.toStr(b.get("enabled")); })(this$); if ($_u65 != null) return $_u65; return "z"; })(this$);
      if (sys.ObjUtil.equals(aEnableKey, bEnableKey)) {
        return sys.ObjUtil.compare(a.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), b.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])));
      }
      ;
      return sys.ObjUtil.compare(aEnableKey, bEnableKey);
    });
  }

  static usingAdd(names) {
    const this$ = this;
    if (sys.ObjUtil.is(names, sys.Str.type$)) {
      (names = sys.List.make(sys.Str.type$, [sys.ObjUtil.coerce(names, sys.Str.type$)]));
    }
    ;
    let list = ((this$) => { let $_u67 = sys.ObjUtil.as(names, sys.Type.find("sys::Str[]")); if ($_u67 != null) return $_u67; throw sys.ArgErr.make("Expecting names to be Str or Str[]"); })(this);
    let repo = xeto.LibRepo.cur();
    let depends = list.map((n) => {
      return sys.ObjUtil.coerce(xeto.LibDepend.make(n), xeto.LibDepend.type$);
    }, xeto.LibDepend.type$);
    let vers = repo.solveDepends(sys.ObjUtil.coerce(depends, sys.Type.find("xeto::LibDepend[]")));
    let cx = HxCoreFuncs.curContext();
    let diffs = sys.List.make(folio.Diff.type$);
    vers.each((ver) => {
      let libName = ver.name();
      if (sys.ObjUtil.equals(libName, "sys")) {
        return;
      }
      ;
      let rec = cx.db().read(haystack.Filter.eq("using", libName), false);
      if (rec == null) {
        diffs.add(folio.Diff.makeAdd(sys.Map.__fromLiteral(["using"], [libName], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
      }
      ;
      return;
    });
    cx.db().commitAll(diffs);
    return sys.ObjUtil.coerce(list, sys.Obj.type$);
  }

  static usingRemove(names) {
    const this$ = this;
    if (sys.ObjUtil.is(names, sys.Str.type$)) {
      (names = sys.List.make(sys.Str.type$, [sys.ObjUtil.coerce(names, sys.Str.type$)]));
    }
    ;
    let list = ((this$) => { let $_u68 = sys.ObjUtil.as(names, sys.Type.find("sys::Str[]")); if ($_u68 != null) return $_u68; throw sys.ArgErr.make("Expecting names to be Str or Str[]"); })(this);
    let cx = HxCoreFuncs.curContext();
    let ns = cx.xeto();
    ns.versions().each((v) => {
      if (list.contains(v.name())) {
        return;
      }
      ;
      v.depends().each((d) => {
        if (list.contains(d.name())) {
          throw haystack.DependErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Removing ", sys.Str.toCode(d.name())), " would break depends for "), sys.Str.toCode(v.name())));
        }
        ;
        return;
      });
      return;
    });
    let diffs = sys.List.make(folio.Diff.type$);
    list.each((libName) => {
      let rec = cx.db().read(haystack.Filter.eq("using", libName), false);
      if (rec != null) {
        diffs.add(folio.Diff.make(rec, null, folio.Diff.remove()));
      }
      ;
      return;
    });
    cx.db().commitAll(diffs);
    return sys.ObjUtil.coerce(list, sys.Obj.type$);
  }

  static observables() {
    const this$ = this;
    let cx = HxCoreFuncs.curContext();
    let gb = haystack.GridBuilder.make();
    gb.addCol("observable").addCol("subscriptions").addCol("doc");
    cx.rt().obs().list().each((o) => {
      let doc = ((this$) => { let $_u69 = ((this$) => { let $_u70 = cx.ns().def(o.name(), false); if ($_u70 == null) return null; return cx.ns().def(o.name(), false).get("doc"); })(this$); if ($_u69 != null) return $_u69; return ""; })(this$);
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [o.name(), haystack.Number.makeInt(o.subscriptions().size()), doc]));
      return;
    });
    return gb.toGrid();
  }

  static subscriptions() {
    const this$ = this;
    let cx = HxCoreFuncs.curContext();
    let gb = haystack.GridBuilder.make();
    gb.addCol("observable").addCol("observer").addCol("config");
    cx.rt().obs().list().each((o) => {
      o.subscriptions().each((s) => {
        gb.addRow(sys.List.make(sys.Str.type$, [o.name(), sys.ObjUtil.toStr(s.observer()), s.configDebug()]));
        return;
      });
      return;
    });
    return gb.toGrid();
  }

  static isWatched(rec) {
    return HxCoreFuncs.curContext().rt().watch().isWatched(haystack.Etc.toId(rec));
  }

  static watchOpen(grid,dis) {
    let cx = HxCoreFuncs.curContext();
    let watch = cx.rt().watch().open(dis);
    watch.addGrid(grid);
    return grid.addMeta(sys.Map.__fromLiteral(["watchId"], [watch.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

  static watchPoll(watchId) {
    let cx = HxCoreFuncs.curContext();
    let refresh = false;
    if (sys.ObjUtil.is(watchId, haystack.Grid.type$)) {
      let grid = sys.ObjUtil.coerce(watchId, haystack.Grid.type$);
      (watchId = sys.ObjUtil.coerce(((this$) => { let $_u71 = sys.ObjUtil.as(grid.meta().get("watchId"), sys.Str.type$); if ($_u71 != null) return $_u71; throw sys.Err.make("Missing meta.watchId"); })(this), sys.Obj.type$));
      (refresh = grid.meta().has("refresh"));
    }
    ;
    let watch = cx.rt().watch().get(sys.ObjUtil.coerce(watchId, sys.Str.type$));
    let recs = ((this$) => { if (refresh) return watch.poll(sys.Duration.defVal()); return watch.poll(); })(this);
    return haystack.Etc.makeDictsGrid(sys.Map.__fromLiteral(["watchId"], [watchId], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), recs);
  }

  static watchAdd(watchId,grid) {
    let cx = HxCoreFuncs.curContext();
    let watch = cx.rt().watch().get(watchId);
    watch.addGrid(grid);
    return grid;
  }

  static watchRemove(watchId,grid) {
    let cx = HxCoreFuncs.curContext();
    let watch = cx.rt().watch().get(watchId);
    watch.removeGrid(grid);
    return grid;
  }

  static watchClose(watchId) {
    ((this$) => { let $_u73 = HxCoreFuncs.curContext().rt().watch().get(watchId, false); if ($_u73 == null) return null; return HxCoreFuncs.curContext().rt().watch().get(watchId, false).close(); })(this);
    return null;
  }

  static about() {
    return HxCoreFuncs.curContext().about();
  }

  static context() {
    return HxCoreFuncs.curContext().toDict();
  }

  static pods() {
    return HxUtil.pods();
  }

  static tzdb() {
    return HxUtil.tzdb();
  }

  static unitdb() {
    return HxUtil.unitdb();
  }

  static threadDump() {
    return HxUtil.threadDumpAll();
  }

  static curContext() {
    return sys.ObjUtil.coerce(HxContext.curHx(), HxContext.type$);
  }

  static make() {
    const $self = new HxCoreFuncs();
    HxCoreFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ReadAllStream extends axon.SourceStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReadAllStream.type$; }

  #filter = null;

  filter() { return this.#filter; }

  __filter(it) { if (it === undefined) return this.#filter; else this.#filter = it; }

  static make(filter) {
    const $self = new ReadAllStream();
    ReadAllStream.make$($self,filter);
    return $self;
  }

  static make$($self,filter) {
    axon.SourceStream.make$($self);
    $self.#filter = filter;
    return;
  }

  funcName() {
    return "readAllStream";
  }

  funcArgs() {
    return sys.List.make(haystack.Filter.type$, [this.#filter]);
  }

  onStart(sig) {
    const this$ = this;
    let cx = sys.ObjUtil.coerce(this.cx(), HxContext.type$);
    cx.db().readAllEachWhile(this.#filter, haystack.Etc.emptyDict(), (rec) => {
      this$.submit(rec);
      return ((this$) => { if (this$.isComplete()) return "break"; return null; })(this$);
    });
    return;
  }

}

class ReadByIdsStream extends axon.SourceStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReadByIdsStream.type$; }

  #ids = null;

  ids() { return this.#ids; }

  __ids(it) { if (it === undefined) return this.#ids; else this.#ids = it; }

  #checked = false;

  checked() { return this.#checked; }

  __checked(it) { if (it === undefined) return this.#checked; else this.#checked = it; }

  static make(ids,checked) {
    const $self = new ReadByIdsStream();
    ReadByIdsStream.make$($self,ids,checked);
    return $self;
  }

  static make$($self,ids,checked) {
    axon.SourceStream.make$($self);
    $self.#ids = sys.ObjUtil.coerce(((this$) => { let $_u75 = ids; if ($_u75 == null) return null; return sys.ObjUtil.toImmutable(ids); })($self), sys.Type.find("haystack::Ref[]"));
    $self.#checked = checked;
    return;
  }

  funcName() {
    return "readByIdsStream";
  }

  funcArgs() {
    return sys.List.make(sys.Type.find("haystack::Ref[]"), [this.#ids]);
  }

  onStart(sig) {
    const this$ = this;
    let cx = sys.ObjUtil.coerce(this.cx(), HxContext.type$);
    this.#ids.eachWhile((id) => {
      let rec = cx.db().readById(id, this$.#checked);
      if (rec == null) {
        return null;
      }
      ;
      this$.submit(rec);
      return ((this$) => { if (this$.isComplete()) return "break"; return null; })(this$);
    });
    return;
  }

}

class CommitStream extends axon.TerminalStream {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommitStream.type$; }

  #count = 0;

  // private field reflection only
  __count(it) { if (it === undefined) return this.#count; else this.#count = it; }

  static make(prev) {
    const $self = new CommitStream();
    CommitStream.make$($self,prev);
    return $self;
  }

  static make$($self,prev) {
    axon.TerminalStream.make$($self, prev);
    return;
  }

  funcName() {
    return "commit";
  }

  onData(data) {
    if (data == null) {
      return;
    }
    ;
    let cx = sys.ObjUtil.coerce(this.cx(), HxContext.type$);
    ((this$) => { let $_u77 = this$.#count;this$.#count = sys.Int.increment(this$.#count); return $_u77; })(this);
    if (sys.ObjUtil.equals(sys.Int.mod(this.#count, 100), 0)) {
      cx.db().sync();
    }
    ;
    let diff = ((this$) => { let $_u78 = sys.ObjUtil.as(data, folio.Diff.type$); if ($_u78 != null) return $_u78; throw sys.Err.make(sys.Str.plus("Expecting Diff, not ", sys.ObjUtil.typeof(data))); })(this);
    cx.db().commitAsync(sys.ObjUtil.coerce(diff, folio.Diff.type$));
    return;
  }

  onRun() {
    let cx = sys.ObjUtil.coerce(this.cx(), HxContext.type$);
    cx.db().sync();
    return haystack.Number.makeInt(this.#count);
  }

}

class HxLib extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxLib.type$; }

  #spiRef = null;

  spiRef() { return this.#spiRef; }

  __spiRef(it) { if (it === undefined) return this.#spiRef; else this.#spiRef = it; }

  static make() {
    const $self = new HxLib();
    HxLib.make$($self);
    return $self;
  }

  static make$($self) {
    $self.#spiRef = sys.ObjUtil.coerce(((this$) => { let $_u79 = sys.ObjUtil.as(concurrent.Actor.locals().get("hx.spi"), HxLibSpi.type$); if ($_u79 != null) return $_u79; throw sys.Err.make("Invalid make context"); })($self), HxLibSpi.type$);
    return;
  }

  hash() {
    return sys.ObjUtil.hash(sys.Obj.prototype);
  }

  equals(that) {
    return this === that;
  }

  toStr() {
    return this.name();
  }

  rt() {
    return this.spi().rt();
  }

  name() {
    return this.spi().name();
  }

  def() {
    return this.spi().def();
  }

  rec() {
    return this.spi().rec();
  }

  log() {
    return this.spi().log();
  }

  web() {
    return UnsupportedHxLibWeb.make(this);
  }

  services() {
    return sys.ObjUtil.coerce(HxService.type$.emptyList(), sys.Type.find("hx::HxService[]"));
  }

  feedInit(req,cx) {
    throw sys.Err.make(sys.Str.plus("HxLib does not support feedInit: ", this.name()));
  }

  spi() {
    return this.#spiRef;
  }

  observables() {
    return sys.ObjUtil.coerce(obs.Observable.type$.emptyList(), sys.Type.find("obs::Observable[]"));
  }

  subscriptions() {
    return this.spi().subscriptions();
  }

  observe(name,config,callback) {
    return this.spi().observe(name, config, callback);
  }

  isRunning() {
    return this.spi().isRunning();
  }

  onStart() {
    return;
  }

  onReady() {
    return;
  }

  onUnready() {
    return;
  }

  onStop() {
    return;
  }

  onSteadyState() {
    return;
  }

  onRecUpdate() {
    return;
  }

  onHouseKeeping() {
    return;
  }

  houseKeepingFreq() {
    return null;
  }

  onReceive(msg) {
    throw sys.UnsupportedErr.make(sys.Str.plus("Unknown msg: ", msg));
  }

}

class HxLibSpi {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxLibSpi.type$; }

}

class HxStdServices {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxStdServices.type$; }

}

class HxServiceRegistry {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxServiceRegistry.type$; }

}

class HxService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxService.type$; }

}

class HxContextService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxContextService.type$; }

}

class HxObsService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxObsService.type$; }

}

class HxWatchService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxWatchService.type$; }

}

class HxHttpService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxHttpService.type$; }

}

class NilHttpService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NilHttpService.type$; }

  siteUri() {
    return sys.Uri.fromStr("http://localhost:8080/");
  }

  apiUri() {
    return sys.Uri.fromStr("/api/");
  }

  root(checked) {
    if (checked === undefined) checked = true;
    if (checked) {
      throw sys.UnsupportedErr.make();
    }
    ;
    return null;
  }

  static make() {
    const $self = new NilHttpService();
    NilHttpService.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HxUserService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxUserService.type$; }

}

class HxSession {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxSession.type$; }

}

class HxCryptoService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxCryptoService.type$; }

}

class HxFileService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxFileService.type$; }

}

class HxClusterService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxClusterService.type$; }

}

class HxIOService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxIOService.type$; }

}

class HxTaskService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxTaskService.type$; }

}

class HxTask {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxTask.type$; }

  toStr() { return haystack.Dict.prototype.toStr.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

}

class HxTaskAdjunct {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxTaskAdjunct.type$; }

  onKill() {
    return;
  }

}

class HxHisService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxHisService.type$; }

}

class NilHisService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NilHisService.type$; }

  read(pt,span,opts,f) {
    return;
  }

  write(pt,items,opts) {
    if (opts === undefined) opts = null;
    throw sys.UnsupportedErr.make("Using NilHisService");
  }

  static make() {
    const $self = new NilHisService();
    NilHisService.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HxPointWriteService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxPointWriteService.type$; }

}

class NilPointWriteService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NilPointWriteService.type$; }

  write(point,val,level,who,opts) {
    if (opts === undefined) opts = null;
    return concurrent.Future.makeCompletable().complete(null);
  }

  array(point) {
    return haystack.Etc.emptyGrid();
  }

  static make() {
    const $self = new NilPointWriteService();
    NilPointWriteService.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HxConnService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxConnService.type$; }

}

class HxConnLib {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxConnLib.type$; }

}

class HxConn {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxConn.type$; }

}

class HxConnPoint {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxConnPoint.type$; }

}

class NilConnService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NilConnService.type$; }

  libs() {
    return sys.ObjUtil.coerce(HxConnLib.type$.emptyList(), sys.Type.find("hx::HxConnLib[]"));
  }

  lib(name,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(this.get(checked), HxConnLib.type$.toNullable());
  }

  conns() {
    return sys.ObjUtil.coerce(HxConn.type$.emptyList(), sys.Type.find("hx::HxConn[]"));
  }

  conn(id,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(this.get(checked), HxConn.type$.toNullable());
  }

  isConn(id) {
    return false;
  }

  points() {
    return sys.ObjUtil.coerce(HxConnPoint.type$.emptyList(), sys.Type.find("hx::HxConnPoint[]"));
  }

  point(id,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(this.get(checked), HxConnPoint.type$.toNullable());
  }

  isPoint(id) {
    return false;
  }

  get(checked) {
    if (checked) {
      throw sys.Err.make("no connectors installed");
    }
    ;
    return null;
  }

  static make() {
    const $self = new NilConnService();
    NilConnService.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HxDockerService {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxDockerService.type$; }

  run(image,config) {
    return sys.ObjUtil.coerce(this.runAsync(image, config).get(), HxDockerContainer.type$);
  }

}

class HxDockerContainer {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxDockerContainer.type$; }

}

class HxDockerEndpoint {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxDockerEndpoint.type$; }

}

class HxRuntime {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxRuntime.type$; }

}

class HxRuntimeLibs {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxRuntimeLibs.type$; }

}

class HxUser {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxUser.type$; }

}

class HxUserAccess {
  constructor() {
    const this$ = this;
  }

  typeof() { return HxUserAccess.type$; }

}

const p = sys.Pod.add$('hx');
const xp = sys.Param.noParams$();
let m;
UnknownWatchErr.type$ = p.at$('UnknownWatchErr','sys::Err',[],{'sys::NoDoc':""},8194,UnknownWatchErr);
WatchClosedErr.type$ = p.at$('WatchClosedErr','sys::Err',[],{'sys::NoDoc':""},8194,WatchClosedErr);
ContextUnavailableErr.type$ = p.at$('ContextUnavailableErr','sys::Err',[],{'sys::NoDoc':""},8194,ContextUnavailableErr);
SessionUnavailableErr.type$ = p.at$('SessionUnavailableErr','sys::Err',[],{'sys::NoDoc':""},8194,SessionUnavailableErr);
HxTest.type$ = p.at$('HxTest','haystack::HaystackTest',[],{},8193,HxTest);
HxRuntimeTest.type$ = p.at$('HxRuntimeTest','sys::Obj',['sys::Facet'],{'sys::Serializable':""},8242,HxRuntimeTest);
HxTestSpi.type$ = p.at$('HxTestSpi','sys::Obj',[],{'sys::NoDoc':""},8193,HxTestSpi);
HxLibWeb.type$ = p.at$('HxLibWeb','web::WebMod',[],{},8195,HxLibWeb);
UnsupportedHxLibWeb.type$ = p.at$('UnsupportedHxLibWeb','hx::HxLibWeb',[],{},130,UnsupportedHxLibWeb);
HxWatch.type$ = p.at$('HxWatch','sys::Obj',[],{},8195,HxWatch);
HxMsg.type$ = p.at$('HxMsg','sys::Obj',[],{},8194,HxMsg);
HxUtil.type$ = p.at$('HxUtil','sys::Obj',[],{},8194,HxUtil);
HxThreadDump.type$ = p.at$('HxThreadDump','sys::Obj',[],{},128,HxThreadDump);
HxThread.type$ = p.at$('HxThread','sys::Obj',[],{},128,HxThread);
HxApiOp.type$ = p.at$('HxApiOp','sys::Obj',[],{},8193,HxApiOp);
HxApiOpSpi.type$ = p.am$('HxApiOpSpi','sys::Obj',[],{'sys::NoDoc':""},8451,HxApiOpSpi);
HxAboutOp.type$ = p.at$('HxAboutOp','hx::HxApiOp',[],{},128,HxAboutOp);
HxCloseOp.type$ = p.at$('HxCloseOp','hx::HxApiOp',[],{},128,HxCloseOp);
HxDefsOp.type$ = p.at$('HxDefsOp','hx::HxApiOp',[],{},128,HxDefsOp);
HxFiletypesOp.type$ = p.at$('HxFiletypesOp','hx::HxDefsOp',[],{},128,HxFiletypesOp);
HxLibsOp.type$ = p.at$('HxLibsOp','hx::HxDefsOp',[],{},128,HxLibsOp);
HxOpsOp.type$ = p.at$('HxOpsOp','hx::HxDefsOp',[],{},128,HxOpsOp);
HxReadOp.type$ = p.at$('HxReadOp','hx::HxApiOp',[],{},128,HxReadOp);
HxEvalOp.type$ = p.at$('HxEvalOp','hx::HxApiOp',[],{},128,HxEvalOp);
HxCommitOp.type$ = p.at$('HxCommitOp','hx::HxApiOp',[],{},128,HxCommitOp);
HxNavOp.type$ = p.at$('HxNavOp','hx::HxApiOp',[],{},128,HxNavOp);
HxWatchSubOp.type$ = p.at$('HxWatchSubOp','hx::HxApiOp',[],{'sys::NoDoc':""},8192,HxWatchSubOp);
HxWatchUnsubOp.type$ = p.at$('HxWatchUnsubOp','hx::HxApiOp',[],{'sys::NoDoc':""},8192,HxWatchUnsubOp);
HxWatchPollOp.type$ = p.at$('HxWatchPollOp','hx::HxApiOp',[],{},128,HxWatchPollOp);
HxHisReadOp.type$ = p.at$('HxHisReadOp','hx::HxApiOp',[],{},128,HxHisReadOp);
HxHisWriteOp.type$ = p.at$('HxHisWriteOp','hx::HxApiOp',[],{},128,HxHisWriteOp);
HxPointWriteOp.type$ = p.at$('HxPointWriteOp','hx::HxApiOp',[],{},128,HxPointWriteOp);
HxContext.type$ = p.at$('HxContext','axon::AxonContext',['folio::FolioContext'],{},8193,HxContext);
HxCli.type$ = p.at$('HxCli','util::AbstractMain',[],{},8193,HxCli);
Main.type$ = p.at$('Main','sys::Obj',[],{'sys::NoDoc':""},8194,Main);
HelpCli.type$ = p.at$('HelpCli','hx::HxCli',[],{},128,HelpCli);
VersionCli.type$ = p.at$('VersionCli','hx::HxCli',[],{},128,VersionCli);
HxConfig.type$ = p.at$('HxConfig','sys::Obj',[],{'sys::NoDoc':""},8194,HxConfig);
HxFeed.type$ = p.at$('HxFeed','sys::Obj',[],{'sys::NoDoc':""},8195,HxFeed);
HxFeedInit.type$ = p.at$('HxFeedInit','sys::Obj',[],{'sys::NoDoc':""},8194,HxFeedInit);
HxPlatform.type$ = p.at$('HxPlatform','sys::Obj',[],{},8194,HxPlatform);
HxCoreFuncs.type$ = p.at$('HxCoreFuncs','sys::Obj',[],{},8194,HxCoreFuncs);
ReadAllStream.type$ = p.at$('ReadAllStream','axon::SourceStream',[],{},128,ReadAllStream);
ReadByIdsStream.type$ = p.at$('ReadByIdsStream','axon::SourceStream',[],{},128,ReadByIdsStream);
CommitStream.type$ = p.at$('CommitStream','axon::TerminalStream',[],{},128,CommitStream);
HxLib.type$ = p.at$('HxLib','sys::Obj',[],{},8195,HxLib);
HxLibSpi.type$ = p.am$('HxLibSpi','sys::Obj',[],{'sys::NoDoc':""},8451,HxLibSpi);
HxStdServices.type$ = p.am$('HxStdServices','sys::Obj',[],{},8451,HxStdServices);
HxServiceRegistry.type$ = p.am$('HxServiceRegistry','sys::Obj',['hx::HxStdServices'],{},8451,HxServiceRegistry);
HxService.type$ = p.am$('HxService','sys::Obj',[],{},8451,HxService);
HxContextService.type$ = p.am$('HxContextService','sys::Obj',['hx::HxService'],{},8451,HxContextService);
HxObsService.type$ = p.am$('HxObsService','sys::Obj',['hx::HxService'],{},8451,HxObsService);
HxWatchService.type$ = p.am$('HxWatchService','sys::Obj',['hx::HxService'],{},8451,HxWatchService);
HxHttpService.type$ = p.am$('HxHttpService','sys::Obj',['hx::HxService'],{},8451,HxHttpService);
NilHttpService.type$ = p.at$('NilHttpService','sys::Obj',['hx::HxHttpService'],{'sys::NoDoc':""},8194,NilHttpService);
HxUserService.type$ = p.am$('HxUserService','sys::Obj',['hx::HxService'],{},8451,HxUserService);
HxSession.type$ = p.am$('HxSession','sys::Obj',[],{'sys::Js':""},8451,HxSession);
HxCryptoService.type$ = p.am$('HxCryptoService','sys::Obj',['hx::HxService'],{'sys::NoDoc':""},8451,HxCryptoService);
HxFileService.type$ = p.am$('HxFileService','sys::Obj',['hx::HxService'],{'sys::NoDoc':""},8451,HxFileService);
HxClusterService.type$ = p.am$('HxClusterService','sys::Obj',['hx::HxService'],{'sys::NoDoc':""},8451,HxClusterService);
HxIOService.type$ = p.am$('HxIOService','sys::Obj',['hx::HxService'],{'sys::NoDoc':""},8451,HxIOService);
HxTaskService.type$ = p.am$('HxTaskService','sys::Obj',['hx::HxService'],{'sys::NoDoc':""},8451,HxTaskService);
HxTask.type$ = p.am$('HxTask','sys::Obj',['haystack::Dict'],{'sys::NoDoc':""},8451,HxTask);
HxTaskAdjunct.type$ = p.am$('HxTaskAdjunct','sys::Obj',[],{'sys::NoDoc':""},8451,HxTaskAdjunct);
HxHisService.type$ = p.am$('HxHisService','sys::Obj',['hx::HxService'],{'sys::NoDoc':""},8451,HxHisService);
NilHisService.type$ = p.at$('NilHisService','sys::Obj',['hx::HxHisService'],{'sys::NoDoc':""},8194,NilHisService);
HxPointWriteService.type$ = p.am$('HxPointWriteService','sys::Obj',['hx::HxService'],{'sys::NoDoc':""},8451,HxPointWriteService);
NilPointWriteService.type$ = p.at$('NilPointWriteService','sys::Obj',['hx::HxPointWriteService'],{'sys::NoDoc':""},8194,NilPointWriteService);
HxConnService.type$ = p.am$('HxConnService','sys::Obj',['hx::HxService'],{'sys::NoDoc':""},8451,HxConnService);
HxConnLib.type$ = p.am$('HxConnLib','sys::Obj',[],{'sys::NoDoc':""},8451,HxConnLib);
HxConn.type$ = p.am$('HxConn','sys::Obj',[],{'sys::NoDoc':""},8451,HxConn);
HxConnPoint.type$ = p.am$('HxConnPoint','sys::Obj',[],{'sys::NoDoc':""},8451,HxConnPoint);
NilConnService.type$ = p.at$('NilConnService','sys::Obj',['hx::HxConnService'],{'sys::NoDoc':""},8194,NilConnService);
HxDockerService.type$ = p.am$('HxDockerService','sys::Obj',['hx::HxService'],{'sys::NoDoc':""},8451,HxDockerService);
HxDockerContainer.type$ = p.am$('HxDockerContainer','sys::Obj',[],{'sys::NoDoc':""},8451,HxDockerContainer);
HxDockerEndpoint.type$ = p.am$('HxDockerEndpoint','sys::Obj',[],{'sys::NoDoc':""},8451,HxDockerEndpoint);
HxRuntime.type$ = p.am$('HxRuntime','sys::Obj',['hx::HxStdServices'],{},8451,HxRuntime);
HxRuntimeLibs.type$ = p.am$('HxRuntimeLibs','sys::Obj',[],{},8451,HxRuntimeLibs);
HxUser.type$ = p.am$('HxUser','sys::Obj',[],{'sys::Js':""},8451,HxUser);
HxUserAccess.type$ = p.am$('HxUserAccess','sys::Obj',[],{'sys::Js':"",'sys::NoDoc':""},8451,HxUserAccess);
UnknownWatchErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
WatchClosedErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
ContextUnavailableErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
SessionUnavailableErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
HxTest.type$.af$('rtRef',73728,'hx::HxRuntime?',{'sys::NoDoc':""}).af$('spiDef$Store',722944,'sys::Obj?',{}).am$('setup',271360,'sys::Void',xp,{}).am$('teardown',271360,'sys::Void',xp,{}).am$('rt',8192,'hx::HxRuntime?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('rtStart',270336,'sys::Void',xp,{'sys::NoDoc':""}).am$('rtStop',270336,'sys::Void',xp,{'sys::NoDoc':""}).am$('rtRestart',270336,'sys::Void',xp,{'sys::NoDoc':""}).am$('spi',270336,'hx::HxTestSpi',xp,{'sys::NoDoc':""}).am$('spiDef',526336,'hx::HxTestSpi',xp,{}).am$('read',8192,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('readById',8192,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('commit',8192,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('changes','sys::Obj?',false),new sys.Param('flags','sys::Int',true)]),{}).am$('addRec',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('tags','[sys::Str:sys::Obj?]',true)]),{}).am$('addLib',8192,'hx::HxLib',sys.List.make(sys.Param.type$,[new sys.Param('libName','sys::Str',false),new sys.Param('tags','[sys::Str:sys::Obj?]',true)]),{}).am$('addUser',8192,'hx::HxUser',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false),new sys.Param('pass','sys::Str',false),new sys.Param('tags','[sys::Str:sys::Obj?]',true)]),{'sys::NoDoc':""}).am$('genRef',8192,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',true)]),{'sys::NoDoc':""}).am$('forceSteadyState',8192,'sys::Void',xp,{'sys::NoDoc':""}).am$('makeContext',270336,'hx::HxContext',sys.List.make(sys.Param.type$,[new sys.Param('user','hx::HxUser?',true)]),{}).am$('eval',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('axon','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('spiDef$Once',133120,'hx::HxTestSpi',xp,{});
HxRuntimeTest.type$.af$('meta',73730,'sys::Obj?',{}).am$('make',139268,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|hx::HxRuntimeTest->sys::Void|?',true)]),{});
HxTestSpi.type$.af$('test',73728,'hx::HxTest',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('test','hx::HxTest',false)]),{}).am$('start',270337,'hx::HxRuntime',sys.List.make(sys.Param.type$,[new sys.Param('projMeta','haystack::Dict',false)]),{}).am$('stop',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false)]),{}).am$('addUser',270337,'hx::HxUser',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false),new sys.Param('pass','sys::Str',false),new sys.Param('tags','[sys::Str:sys::Obj?]',false)]),{}).am$('addLib',270337,'hx::HxLib',sys.List.make(sys.Param.type$,[new sys.Param('libName','sys::Str',false),new sys.Param('tags','[sys::Str:sys::Obj?]',false)]),{}).am$('makeContext',270337,'hx::HxContext',sys.List.make(sys.Param.type$,[new sys.Param('user','hx::HxUser?',false)]),{}).am$('forceSteadyState',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false)]),{});
HxLibWeb.type$.af$('libRef',67586,'hx::HxLib',{}).am$('make',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxLib',false)]),{}).am$('rt',270336,'hx::HxRuntime',xp,{}).am$('lib',270336,'hx::HxLib',xp,{}).am$('uri',8192,'sys::Uri',xp,{}).am$('isUnsupported',270336,'sys::Bool',xp,{'sys::NoDoc':""});
UnsupportedHxLibWeb.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxLib',false)]),{}).am$('isUnsupported',271360,'sys::Bool',xp,{}).am$('onService',271360,'sys::Void',xp,{});
HxWatch.type$.af$('lease',270337,'sys::Duration',{}).am$('rt',270337,'hx::HxRuntime',xp,{}).am$('dis',270337,'sys::Str',xp,{}).am$('id',270337,'sys::Str',xp,{}).am$('list',270337,'haystack::Ref[]',xp,{}).am$('isEmpty',270337,'sys::Bool',xp,{}).am$('lastPoll',270337,'sys::Duration',xp,{'sys::NoDoc':""}).am$('lastRenew',270337,'sys::Duration',xp,{'sys::NoDoc':""}).am$('poll',270337,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('ticks','sys::Duration',true)]),{}).am$('renew',270337,'sys::Void',xp,{'sys::NoDoc':""}).am$('add',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('addGrid',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('addAll',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{}).am$('remove',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('removeAll',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{}).am$('set',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{'sys::NoDoc':""}).am$('removeGrid',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('isClosed',270337,'sys::Bool',xp,{}).am$('close',270337,'sys::Void',xp,{}).am$('hash',9216,'sys::Int',xp,{}).am$('equals',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',9216,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
HxMsg.type$.af$('id',73730,'sys::Str',{}).af$('a',73730,'sys::Obj?',{}).af$('b',73730,'sys::Obj?',{}).af$('c',73730,'sys::Obj?',{}).af$('d',73730,'sys::Obj?',{}).af$('e',73730,'sys::Obj?',{}).am$('make0',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('make1',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('a','sys::Obj?',false)]),{}).am$('make2',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{}).am$('make3',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false),new sys.Param('c','sys::Obj?',false)]),{}).am$('make4',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false),new sys.Param('c','sys::Obj?',false),new sys.Param('d','sys::Obj?',false)]),{}).am$('make5',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false),new sys.Param('c','sys::Obj?',false),new sys.Param('d','sys::Obj?',false),new sys.Param('e','sys::Obj?',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
HxUtil.type$.am$('readAllTagNames',32898,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('db','folio::Folio',false),new sys.Param('filter','haystack::Filter',false)]),{}).am$('readAllTagVals',32898,'sys::Obj[]',sys.List.make(sys.Param.type$,[new sys.Param('db','folio::Folio',false),new sys.Param('filter','haystack::Filter',false),new sys.Param('tagName','sys::Str',false)]),{}).am$('parseEnumNames',40962,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('enum','sys::Obj?',false)]),{}).am$('parseEnum',40962,'[sys::Str:haystack::Dict]',sys.List.make(sys.Param.type$,[new sys.Param('enum','sys::Obj?',false)]),{}).am$('pods',40962,'haystack::Grid',xp,{}).am$('tzdb',40962,'haystack::Grid',xp,{}).am$('unitdb',40962,'haystack::Grid',xp,{}).am$('pid',40962,'sys::Int?',xp,{}).am$('threadId',40962,'sys::Int',xp,{}).am$('threadDumpAll',40962,'sys::Str',xp,{}).am$('threadDumpDeadlocks',40962,'sys::Str',xp,{}).am$('threadDump',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Int',false)]),{}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('make',139268,'sys::Void',xp,{});
HxThreadDump.type$.af$('buf',67584,'sys::StrBuf',{}).af$('byId',67584,'[sys::Int:hx::HxThread]',{}).am$('pid',40962,'sys::Int?',xp,{}).am$('toDeadlocks',8192,'sys::Str?',xp,{}).am$('toAll',8192,'sys::Str',xp,{}).am$('toThread',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Int',false)]),{}).am$('dump',2048,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('deadlocksOnly','sys::Bool',false)]),{}).am$('dumpStack',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('t','hx::HxThread',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxThread.type$.af$('id',73730,'sys::Int',{}).af$('name',73730,'sys::Str',{}).af$('cpu',73730,'sys::Duration',{});
HxApiOp.type$.af$('spiRef',73730,'hx::HxApiOpSpi',{'sys::NoDoc':""}).am$('make',8196,'sys::Void',xp,{}).am$('name',8192,'sys::Str',xp,{}).am$('def',8192,'haystack::Def',xp,{}).am$('onService',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('onRequest',270337,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('isGetAllowed',270336,'sys::Bool',xp,{'sys::NoDoc':""}).am$('spi',270336,'hx::HxApiOpSpi',xp,{'sys::NoDoc':""});
HxApiOpSpi.type$.am$('name',270337,'sys::Str',xp,{}).am$('def',270337,'haystack::Def',xp,{}).am$('readReq',270337,'haystack::Grid?',sys.List.make(sys.Param.type$,[new sys.Param('op','hx::HxApiOp',false),new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('writeRes',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('op','hx::HxApiOp',false),new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false),new sys.Param('result','haystack::Grid',false)]),{});
HxAboutOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxCloseOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxDefsOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('eachDef',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('f','|haystack::Def->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxFiletypesOp.type$.am$('eachDef',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('f','|haystack::Def->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxLibsOp.type$.am$('eachDef',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('f','|haystack::Def->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxOpsOp.type$.am$('eachDef',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('f','|haystack::Def->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxReadOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxEvalOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxCommitOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('onAdd',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('onUpdate',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('onRemove',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxNavOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('respond',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('recs','haystack::Dict[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxWatchSubOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxWatchUnsubOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxWatchPollOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxHisReadOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('onSingle',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('onBatch',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('readBatch',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('span','haystack::Span',false),new sys.Param('f','|sys::DateTime,sys::Obj->sys::Void|',false)]),{}).am$('parseRange',40962,'haystack::Span',sys.List.make(sys.Param.type$,[new sys.Param('tz','sys::TimeZone',false),new sys.Param('q','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxHisWriteOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('onSingle',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('onBatch',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('write',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false),new sys.Param('id','haystack::Ref',false),new sys.Param('tsCol','haystack::Col',false),new sys.Param('valCol','haystack::Col',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxPointWriteOp.type$.am$('onRequest',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Grid',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxContext.type$.af$('feedInitRef',335872,'hx::HxFeedInit?',{'sys::NoDoc':""}).am$('curHx',40962,'hx::HxContext?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('rt',270337,'hx::HxRuntime',xp,{}).am$('db',270337,'folio::Folio',xp,{}).am$('user',270337,'hx::HxUser',xp,{}).am$('session',270337,'hx::HxSession?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('about',270337,'haystack::Dict',xp,{'sys::NoDoc':""}).am$('checkSu',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('action','sys::Str',false)]),{}).am$('checkAdmin',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('action','sys::Str',false)]),{}).am$('feedInit',270336,'hx::HxFeedInit',xp,{'sys::NoDoc':""}).am$('feedIsEnabled',270336,'sys::Bool',xp,{'sys::NoDoc':""}).am$('feedAdd',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('feed','hx::HxFeed',false),new sys.Param('meta','[sys::Str:sys::Obj?]?',true)]),{'sys::NoDoc':""}).am$('readCacheClear',270336,'sys::Void',xp,{'sys::NoDoc':""}).am$('export',270336,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Dict',false),new sys.Param('out','sys::OutStream',false)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{});
HxCli.type$.am$('find',40962,'hx::HxCli?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('list',40962,'hx::HxCli[]',xp,{}).am$('appName',9216,'sys::Str',xp,{}).am$('log',271360,'sys::Log',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('aliases',270336,'sys::Str[]',xp,{}).am$('run',271361,'sys::Int',xp,{}).am$('summary',270337,'sys::Str',xp,{}).am$('printLine',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',true)]),{}).am$('err',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{});
Main.type$.am$('main',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HelpCli.type$.af$('commandName',73728,'sys::Str[]',{'util::Arg':""}).am$('name',271360,'sys::Str',xp,{}).am$('aliases',271360,'sys::Str[]',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
VersionCli.type$.am$('name',271360,'sys::Str',xp,{}).am$('aliases',271360,'sys::Str[]',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
HxConfig.type$.af$('metaRef',67586,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false)]),{}).am$('meta',270336,'haystack::Dict',xp,{}).am$('has',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('get',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{}).am$('makeSpi',8192,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false)]),{}).am$('isTest',270336,'sys::Bool',xp,{});
HxFeed.type$.af$('viewId',73730,'sys::Str',{}).af$('key',73730,'sys::Str',{}).af$('rt',73730,'hx::HxRuntime',{}).af$('log',73730,'sys::Log',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('subscribe',270336,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Dict',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('poll',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false)]),{}).am$('unsubscribe',270336,'sys::Void',xp,{}).am$('call',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Dict',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('err',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('err','sys::Err?',false)]),{});
HxFeedInit.type$.af$('rt',73730,'hx::HxRuntime',{}).af$('viewId',73730,'sys::Str',{}).af$('key',73730,'sys::Str',{}).af$('log',73730,'sys::Log',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
HxPlatform.type$.af$('metaRef',67586,'haystack::Dict',{}).af$('isShell',73730,'sys::Bool',{'sys::NoDoc':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false)]),{}).am$('meta',270336,'haystack::Dict',xp,{}).am$('os',270336,'sys::Str',xp,{}).am$('arch',270336,'sys::Str',xp,{}).am$('isSkySpark',270336,'sys::Bool',xp,{}).am$('logoUri',270336,'sys::Uri',xp,{}).am$('faviconUri',270336,'sys::Uri',xp,{}).am$('productName',270336,'sys::Str',xp,{}).am$('productVersion',270336,'sys::Str',xp,{}).am$('productUri',270336,'sys::Uri',xp,{}).am$('vendorName',270336,'sys::Str',xp,{}).am$('vendorUri',270336,'sys::Uri',xp,{}).am$('hostOs',270336,'sys::Str',xp,{}).am$('hostModel',270336,'sys::Str',xp,{});
HxCoreFuncs.type$.am$('read',40962,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('filterExpr','axon::Expr',false),new sys.Param('checked','axon::Expr',true)]),{'axon::Axon':""}).am$('readById',40962,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref?',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('readByIdPersistentTags',40962,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('readByIdTransientTags',40962,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('readLink',40962,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref?',false)]),{'axon::Axon':""}).am$('readByIds',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('readAll',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('filterExpr','axon::Expr',false),new sys.Param('optsExpr','axon::Expr?',true)]),{'axon::Axon':""}).am$('readByIdsStream',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('readAllStream',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('filterExpr','axon::Expr',false)]),{'axon::Axon':""}).am$('readAllTagNames',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('filterExpr','axon::Expr',false)]),{'axon::Axon':""}).am$('readAllTagVals',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('filterExpr','axon::Expr',false),new sys.Param('tagName','axon::Expr',false)]),{'axon::Axon':""}).am$('readCount',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('filterExpr','axon::Expr',false)]),{'axon::Axon':""}).am$('toRecId',40962,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('toRecIdList',40962,'haystack::Ref[]',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('toRec',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('toRecList',40962,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('diff',40962,'folio::Diff',sys.List.make(sys.Param.type$,[new sys.Param('orig','haystack::Dict?',false),new sys.Param('changes','haystack::Dict?',false),new sys.Param('flags','haystack::Dict?',true)]),{'axon::Axon':""}).am$('commit',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('diffs','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('passwordSet',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false),new sys.Param('val','sys::Str?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('stripUncommittable',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('opts','sys::Obj?',true)]),{'axon::Axon':""}).am$('isSteadyState',40962,'sys::Bool',xp,{'axon::Axon':""}).am$('libAdd',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('tags','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('libRemove',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('libStatus',40962,'haystack::Grid',xp,{'axon::Axon':"axon::Axon{admin=true;}"}).am$('services',40962,'haystack::Grid',xp,{'axon::Axon':"axon::Axon{admin=true;}"}).am$('xetoReload',40962,'sys::Obj?',xp,{'axon::Axon':"axon::Axon{su=true;}"}).am$('usingStatus',40962,'haystack::Grid',xp,{'sys::NoDoc':"",'axon::Axon':""}).am$('usingAdd',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('names','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('usingRemove',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('names','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('observables',40962,'haystack::Grid',xp,{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('subscriptions',40962,'haystack::Grid',xp,{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('isWatched',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','sys::Obj',false)]),{'axon::Axon':""}).am$('watchOpen',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('dis','sys::Str',false)]),{'axon::Axon':""}).am$('watchPoll',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('watchId','sys::Obj',false)]),{'axon::Axon':""}).am$('watchAdd',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('watchId','sys::Str',false),new sys.Param('grid','haystack::Grid',false)]),{'axon::Axon':""}).am$('watchRemove',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('watchId','sys::Str',false),new sys.Param('grid','haystack::Grid',false)]),{'axon::Axon':""}).am$('watchClose',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('watchId','sys::Str',false)]),{'axon::Axon':""}).am$('about',40962,'haystack::Dict',xp,{'axon::Axon':""}).am$('context',40962,'haystack::Dict',xp,{'axon::Axon':""}).am$('pods',40962,'haystack::Grid',xp,{'axon::Axon':"axon::Axon{admin=true;}"}).am$('tzdb',40962,'haystack::Grid',xp,{'axon::Axon':""}).am$('unitdb',40962,'haystack::Grid',xp,{'axon::Axon':""}).am$('threadDump',40962,'sys::Str',xp,{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('make',139268,'sys::Void',xp,{});
ReadAllStream.type$.af$('filter',73730,'haystack::Filter',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{});
ReadByIdsStream.type$.af$('ids',73730,'haystack::Ref[]',{}).af$('checked',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false),new sys.Param('checked','sys::Bool',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('funcArgs',271360,'sys::Obj?[]',xp,{}).am$('onStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sig','axon::Signal',false)]),{});
CommitStream.type$.af$('count',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prev','axon::MStream',false)]),{}).am$('funcName',271360,'sys::Str',xp,{}).am$('onData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('data','sys::Obj?',false)]),{}).am$('onRun',271360,'sys::Obj?',xp,{});
HxLib.type$.af$('spiRef',73730,'hx::HxLibSpi',{'sys::NoDoc':""}).am$('make',8196,'sys::Void',xp,{}).am$('hash',9216,'sys::Int',xp,{}).am$('equals',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',9216,'sys::Str',xp,{}).am$('rt',270336,'hx::HxRuntime',xp,{}).am$('name',8192,'sys::Str',xp,{}).am$('def',270336,'haystack::Lib',xp,{'sys::NoDoc':""}).am$('rec',270336,'haystack::Dict',xp,{}).am$('log',8192,'sys::Log',xp,{}).am$('web',270336,'hx::HxLibWeb',xp,{}).am$('services',270336,'hx::HxService[]',xp,{}).am$('feedInit',270336,'hx::HxFeed',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Dict',false),new sys.Param('cx','hx::HxContext',false)]),{'sys::NoDoc':""}).am$('spi',270336,'hx::HxLibSpi',xp,{'sys::NoDoc':""}).am$('observables',270336,'obs::Observable[]',xp,{}).am$('subscriptions',8192,'obs::Subscription[]',xp,{}).am$('observe',8192,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('config','haystack::Dict',false),new sys.Param('callback','sys::Obj',false)]),{}).am$('isRunning',8192,'sys::Bool',xp,{}).am$('onStart',270336,'sys::Void',xp,{}).am$('onReady',270336,'sys::Void',xp,{}).am$('onUnready',270336,'sys::Void',xp,{}).am$('onStop',270336,'sys::Void',xp,{}).am$('onSteadyState',270336,'sys::Void',xp,{}).am$('onRecUpdate',270336,'sys::Void',xp,{}).am$('onHouseKeeping',270336,'sys::Void',xp,{}).am$('houseKeepingFreq',270336,'sys::Duration?',xp,{}).am$('onReceive',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{'sys::NoDoc':""});
HxLibSpi.type$.am$('rt',270337,'hx::HxRuntime',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('def',270337,'haystack::Lib',xp,{}).am$('rec',270337,'haystack::Dict',xp,{}).am$('log',270337,'sys::Log',xp,{}).am$('webUri',270337,'sys::Uri',xp,{}).am$('isRunning',270337,'sys::Bool',xp,{}).am$('actor',270337,'concurrent::Actor',xp,{}).am$('sync',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('subscriptions',270337,'obs::Subscription[]',xp,{}).am$('observe',270337,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('config','haystack::Dict',false),new sys.Param('callback','sys::Obj',false)]),{}).am$('isFault',270337,'sys::Bool',xp,{}).am$('toStatus',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('status','sys::Str',false),new sys.Param('msg','sys::Str',false)]),{});
HxStdServices.type$.am$('context',270337,'hx::HxContextService',xp,{}).am$('obs',270337,'hx::HxObsService',xp,{}).am$('watch',270337,'hx::HxWatchService',xp,{}).am$('http',270337,'hx::HxHttpService',xp,{}).am$('user',270337,'hx::HxUserService',xp,{}).am$('crypto',270337,'hx::HxCryptoService',xp,{'sys::NoDoc':""}).am$('file',270337,'hx::HxFileService',xp,{'sys::NoDoc':""}).am$('io',270337,'hx::HxIOService',xp,{'sys::NoDoc':""}).am$('task',270337,'hx::HxTaskService',xp,{'sys::NoDoc':""}).am$('his',270337,'hx::HxHisService',xp,{'sys::NoDoc':""}).am$('pointWrite',270337,'hx::HxPointWriteService',xp,{'sys::NoDoc':""}).am$('conn',270337,'hx::HxConnService',xp,{'sys::NoDoc':""});
HxServiceRegistry.type$.am$('list',270337,'sys::Type[]',xp,{}).am$('get',270337,'hx::HxService?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('getAll',270337,'hx::HxService[]',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{});
HxContextService.type$.am$('create',270337,'hx::HxContext',sys.List.make(sys.Param.type$,[new sys.Param('user','hx::HxUser',false)]),{}).am$('createSession',270337,'hx::HxContext',sys.List.make(sys.Param.type$,[new sys.Param('session','hx::HxSession',false)]),{'sys::NoDoc':""}).am$('xetoReload',270337,'sys::Void',xp,{'sys::NoDoc':""});
HxObsService.type$.am$('list',270337,'obs::Observable[]',xp,{}).am$('get',270337,'obs::Observable?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('schedule',270337,'obs::ScheduleObservable',xp,{'sys::NoDoc':""});
HxWatchService.type$.am$('list',270337,'hx::HxWatch[]',xp,{}).am$('listOn',270337,'hx::HxWatch[]',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('get',270337,'hx::HxWatch?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('open',270337,'hx::HxWatch',sys.List.make(sys.Param.type$,[new sys.Param('dis','sys::Str',false)]),{}).am$('isWatched',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('checkExpires',270337,'sys::Void',xp,{'sys::NoDoc':""}).am$('debugGrid',270337,'haystack::Grid',xp,{'sys::NoDoc':""});
HxHttpService.type$.am$('siteUri',270337,'sys::Uri',xp,{}).am$('apiUri',270337,'sys::Uri',xp,{}).am$('root',270337,'web::WebMod?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""});
NilHttpService.type$.am$('siteUri',271360,'sys::Uri',xp,{}).am$('apiUri',271360,'sys::Uri',xp,{}).am$('root',271360,'web::WebMod?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('make',139268,'sys::Void',xp,{});
HxUserService.type$.am$('read',270337,'hx::HxUser?',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Obj',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('authenticate',270337,'hx::HxContext?',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('closeSession',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('session','hx::HxSession',false)]),{'sys::NoDoc':""}).am$('makeSyntheticUser',270337,'hx::HxUser',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false),new sys.Param('tags','sys::Obj?',true)]),{'sys::NoDoc':""});
HxSession.type$.am$('key',270337,'sys::Str',xp,{}).am$('attestKey',270337,'sys::Str',xp,{}).am$('user',270337,'hx::HxUser',xp,{});
HxCryptoService.type$.am$('keystore',270337,'crypto::KeyStore',xp,{}).am$('httpsKey',270337,'crypto::KeyStore?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('hostKeyPair',270337,'crypto::KeyPair',xp,{}).am$('hostKey',270337,'crypto::PrivKeyEntry',xp,{}).am$('readBuf',270337,'sys::Buf',xp,{}).am$('writeBuf',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{});
HxFileService.type$.am$('resolve',270337,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{});
HxClusterService.type$.am$('nodeId',270337,'haystack::Ref',xp,{}).am$('stashedUser',270337,'hx::HxUser',sys.List.make(sys.Param.type$,[new sys.Param('node','sys::Obj',false),new sys.Param('username','sys::Str',false)]),{});
HxIOService.type$.am$('read',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('f','|sys::InStream->sys::Obj?|',false)]),{}).am$('write',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('handle','sys::Obj?',false),new sys.Param('f','|sys::OutStream->sys::Void|',false)]),{});
HxTaskService.type$.am$('cur',270337,'hx::HxTask?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('run',270337,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false),new sys.Param('msg','sys::Obj?',true)]),{}).am$('progress',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('progress','haystack::Dict',false)]),{}).am$('adjunct',270337,'hx::HxTaskAdjunct',sys.List.make(sys.Param.type$,[new sys.Param('onInit','|->hx::HxTaskAdjunct|',false)]),{});
HxTaskAdjunct.type$.am$('onKill',270336,'sys::Void',xp,{});
HxHisService.type$.am$('read',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','haystack::Dict',false),new sys.Param('span','haystack::Span?',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|haystack::HisItem->sys::Void|',false)]),{}).am$('write',270337,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('pt','haystack::Dict',false),new sys.Param('items','haystack::HisItem[]',false),new sys.Param('opts','haystack::Dict?',true)]),{});
NilHisService.type$.am$('read',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','haystack::Dict',false),new sys.Param('span','haystack::Span?',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|haystack::HisItem->sys::Void|',false)]),{}).am$('write',271360,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('pt','haystack::Dict',false),new sys.Param('items','haystack::HisItem[]',false),new sys.Param('opts','haystack::Dict?',true)]),{}).am$('make',139268,'sys::Void',xp,{});
HxPointWriteService.type$.am$('write',270337,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('point','haystack::Dict',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','sys::Int',false),new sys.Param('who','sys::Obj',false),new sys.Param('opts','haystack::Dict?',true)]),{}).am$('array',270337,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('point','haystack::Dict',false)]),{});
NilPointWriteService.type$.am$('write',271360,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('point','haystack::Dict',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','sys::Int',false),new sys.Param('who','sys::Obj',false),new sys.Param('opts','haystack::Dict?',true)]),{}).am$('array',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('point','haystack::Dict',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxConnService.type$.am$('libs',270337,'hx::HxConnLib[]',xp,{}).am$('lib',270337,'hx::HxConnLib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('conns',270337,'hx::HxConn[]',xp,{}).am$('conn',270337,'hx::HxConn?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isConn',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('points',270337,'hx::HxConnPoint[]',xp,{}).am$('point',270337,'hx::HxConnPoint?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isPoint',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{});
HxConnLib.type$.am$('name',270337,'sys::Str',xp,{}).am$('libDis',270337,'sys::Str',xp,{}).am$('icon',270337,'sys::Str',xp,{}).am$('connTag',270337,'sys::Str',xp,{}).am$('connRefTag',270337,'sys::Str',xp,{}).am$('numConns',270337,'sys::Int',xp,{}).am$('connFeatures',270337,'haystack::Dict',xp,{});
HxConn.type$.am$('lib',270337,'hx::HxConnLib',xp,{}).am$('id',270337,'haystack::Ref',xp,{}).am$('rec',270337,'haystack::Dict',xp,{}).am$('ping',270337,'concurrent::Future',xp,{}).am$('close',270337,'concurrent::Future',xp,{}).am$('learnAsync',270337,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj?',true)]),{}).am$('details',270337,'sys::Str',xp,{});
HxConnPoint.type$.am$('lib',270337,'hx::HxLib',xp,{}).am$('conn',270337,'hx::HxConn',xp,{}).am$('id',270337,'haystack::Ref',xp,{}).am$('rec',270337,'haystack::Dict',xp,{}).am$('details',270337,'sys::Str',xp,{});
NilConnService.type$.am$('libs',271360,'hx::HxConnLib[]',xp,{}).am$('lib',271360,'hx::HxConnLib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('conns',271360,'hx::HxConn[]',xp,{}).am$('conn',271360,'hx::HxConn?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isConn',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('points',271360,'hx::HxConnPoint[]',xp,{}).am$('point',271360,'hx::HxConnPoint?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isPoint',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('get',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxDockerService.type$.am$('run',8192,'hx::HxDockerContainer',sys.List.make(sys.Param.type$,[new sys.Param('image','sys::Str',false),new sys.Param('config','sys::Obj',false)]),{}).am$('runAsync',270337,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('image','sys::Str',false),new sys.Param('config','sys::Obj',false)]),{}).am$('deleteContainer',270337,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{});
HxDockerContainer.type$.am$('id',270337,'sys::Str',xp,{}).am$('names',270337,'sys::Str[]',xp,{}).am$('image',270337,'sys::Str',xp,{}).am$('created',270337,'sys::DateTime',xp,{}).am$('state',270337,'sys::Str',xp,{}).am$('network',270337,'hx::HxDockerEndpoint?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{});
HxDockerEndpoint.type$.am$('gateway',270337,'inet::IpAddr?',xp,{}).am$('ip',270337,'inet::IpAddr?',xp,{}).am$('gateway6',270337,'inet::IpAddr?',xp,{}).am$('ip6',270337,'inet::IpAddr?',xp,{});
HxRuntime.type$.am$('name',270337,'sys::Str',xp,{}).am$('dis',270337,'sys::Str',xp,{}).am$('version',270337,'sys::Version',xp,{}).am$('isRunning',270337,'sys::Bool',xp,{}).am$('platform',270337,'hx::HxPlatform',xp,{}).am$('dir',270337,'sys::File',xp,{}).am$('ns',270337,'haystack::Namespace',xp,{}).am$('db',270337,'folio::Folio',xp,{}).am$('meta',270337,'haystack::Dict',xp,{}).am$('lib',270337,'hx::HxLib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('libs',270337,'hx::HxRuntimeLibs',xp,{}).am$('services',270337,'hx::HxServiceRegistry',xp,{}).am$('sync',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('isSteadyState',270337,'sys::Bool',xp,{}).am$('config',270337,'hx::HxConfig',xp,{'sys::NoDoc':""});
HxRuntimeLibs.type$.am$('list',270337,'hx::HxLib[]',xp,{}).am$('get',270337,'hx::HxLib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('has',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('add',270337,'hx::HxLib',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('tags','haystack::Dict',true)]),{}).am$('remove',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','sys::Obj',false)]),{}).am$('actorPool',270337,'concurrent::ActorPool',xp,{}).am$('status',270337,'haystack::Grid',xp,{'sys::NoDoc':""});
HxUser.type$.am$('id',270337,'haystack::Ref',xp,{}).am$('username',270337,'sys::Str',xp,{}).am$('meta',270337,'haystack::Dict',xp,{}).am$('dis',270337,'sys::Str',xp,{}).am$('isSu',270337,'sys::Bool',xp,{}).am$('isAdmin',270337,'sys::Bool',xp,{}).am$('email',270337,'sys::Str?',xp,{}).am$('mod',270337,'sys::DateTime',xp,{'sys::NoDoc':""}).am$('access',270337,'hx::HxUserAccess',xp,{'sys::NoDoc':""});
HxUserAccess.type$.am$('canPointWriteAtLevel',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::Int',false)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hx");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;inet 1.0;crypto 1.0;util 1.0;web 1.0;xeto 3.1.11;haystack 3.1.11;def 3.1.11;axon 3.1.11;obs 3.1.11;folio 3.1.11");
m.set("pod.summary", "Haxall framework APIs");
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
  UnknownWatchErr,
  WatchClosedErr,
  ContextUnavailableErr,
  SessionUnavailableErr,
  HxTest,
  HxRuntimeTest,
  HxTestSpi,
  HxLibWeb,
  HxWatch,
  HxMsg,
  HxUtil,
  HxApiOp,
  HxApiOpSpi,
  HxWatchSubOp,
  HxWatchUnsubOp,
  HxContext,
  HxCli,
  Main,
  HxConfig,
  HxFeed,
  HxFeedInit,
  HxPlatform,
  HxCoreFuncs,
  HxLib,
  HxLibSpi,
  HxStdServices,
  HxServiceRegistry,
  HxService,
  HxContextService,
  HxObsService,
  HxWatchService,
  HxHttpService,
  NilHttpService,
  HxUserService,
  HxSession,
  HxCryptoService,
  HxFileService,
  HxClusterService,
  HxIOService,
  HxTaskService,
  HxTask,
  HxTaskAdjunct,
  HxHisService,
  NilHisService,
  HxPointWriteService,
  NilPointWriteService,
  HxConnService,
  HxConnLib,
  HxConn,
  HxConnPoint,
  NilConnService,
  HxDockerService,
  HxDockerContainer,
  HxDockerEndpoint,
  HxRuntime,
  HxRuntimeLibs,
  HxUser,
  HxUserAccess,
};
