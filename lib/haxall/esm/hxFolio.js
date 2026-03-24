// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as rdf from './rdf.js'
import * as util from './util.js'
import * as hxStore from './hxStore.js'
import * as web from './web.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as def from './def.js'
import * as folio from './folio.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class HxFolioMgr extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxFolioMgr.type$; }

  #folio = null;

  folio() { return this.#folio; }

  __folio(it) { if (it === undefined) return this.#folio; else this.#folio = it; }

  static make($folio) {
    const $self = new HxFolioMgr();
    HxFolioMgr.make$($self,$folio);
    return $self;
  }

  static make$($self,$folio) {
    concurrent.Actor.make$($self, $folio.config().pool());
    $self.#folio = $folio;
    return;
  }

  static makeCoalescing($folio,toKey,coalesce) {
    const $self = new HxFolioMgr();
    HxFolioMgr.makeCoalescing$($self,$folio,toKey,coalesce);
    return $self;
  }

  static makeCoalescing$($self,$folio,toKey,coalesce) {
    concurrent.Actor.makeCoalescing$($self, $folio.config().pool(), toKey, coalesce);
    $self.#folio = $folio;
    return;
  }

  log() {
    return this.#folio.log();
  }

  sync(timeout) {
    if (timeout === undefined) timeout = sys.Duration.fromStr("30sec");
    this.send(Msg.make(MsgId.sync())).get(timeout);
    return;
  }

  receive(msg) {
    return this.onReceive(sys.ObjUtil.coerce(msg, Msg.type$));
  }

  onReceive(msg) {
    let $_u0 = msg.id();
    if (sys.ObjUtil.equals($_u0, MsgId.sync())) {
      return "sync";
    }
    else if (sys.ObjUtil.equals($_u0, MsgId.close())) {
      this.onClose();
      return folio.CountFolioRes.make(0);
    }
    else if (sys.ObjUtil.equals($_u0, MsgId.testSleep())) {
      concurrent.Actor.sleep(sys.ObjUtil.coerce(msg.a(), sys.Duration.type$));
      return null;
    }
    ;
    this.log().err(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this)), " unknown msg: "), msg));
    throw sys.Err.make(sys.Str.plus("Unknown msg: ", msg.id()));
  }

  onClose() {
    return;
  }

  debugDump(out) {
    sys.ObjUtil.trap(this,"dump", sys.List.make(sys.Obj.type$.toNullable(), [out]));
    return;
  }

}

class Msg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Msg.type$; }

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

  #coalesceKey = null;

  coalesceKey() { return this.#coalesceKey; }

  __coalesceKey(it) { if (it === undefined) return this.#coalesceKey; else this.#coalesceKey = it; }

  static make(id,a,b,c,d) {
    const $self = new Msg();
    Msg.make$($self,id,a,b,c,d);
    return $self;
  }

  static make$($self,id,a,b,c,d) {
    if (a === undefined) a = null;
    if (b === undefined) b = null;
    if (c === undefined) c = null;
    if (d === undefined) d = null;
    $self.#id = id;
    $self.#a = ((this$) => { let $_u1 = a; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u2 = b; if ($_u2 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    $self.#c = ((this$) => { let $_u3 = c; if ($_u3 == null) return null; return sys.ObjUtil.toImmutable(c); })($self);
    $self.#d = ((this$) => { let $_u4 = d; if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(d); })($self);
    if (id.coalesce()) {
      $self.#coalesceKey = MsgCoalesceKey.make(id, sys.ObjUtil.coerce(a, Rec.type$.toNullable()));
    }
    ;
    return;
  }

  toStr() {
    return concurrent.ActorMsg.toDebugStr("Msg", this.#id, this.#a, this.#b, this.#c, this.#d);
  }

}

class MsgId extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MsgId.type$; }

  static sync() { return MsgId.vals().get(0); }

  static testSleep() { return MsgId.vals().get(1); }

  static close() { return MsgId.vals().get(2); }

  static commit() { return MsgId.vals().get(3); }

  static hisWrite() { return MsgId.vals().get(4); }

  static storeAdd() { return MsgId.vals().get(5); }

  static storeUpdate() { return MsgId.vals().get(6); }

  static storeRemove() { return MsgId.vals().get(7); }

  static disUpdateAll() { return MsgId.vals().get(8); }

  static disUpdate() { return MsgId.vals().get(9); }

  static #vals = undefined;

  #coalesce = false;

  coalesce() { return this.#coalesce; }

  __coalesce(it) { if (it === undefined) return this.#coalesce; else this.#coalesce = it; }

  static make($ordinal,$name,coalesce) {
    const $self = new MsgId();
    MsgId.make$($self,$ordinal,$name,coalesce);
    return $self;
  }

  static make$($self,$ordinal,$name,coalesce) {
    if (coalesce === undefined) coalesce = false;
    sys.Enum.make$($self, $ordinal, $name);
    $self.#coalesce = coalesce;
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(MsgId.type$, MsgId.vals(), name$, checked);
  }

  static vals() {
    if (MsgId.#vals == null) {
      MsgId.#vals = sys.List.make(MsgId.type$, [
        MsgId.make(0, "sync", ),
        MsgId.make(1, "testSleep", ),
        MsgId.make(2, "close", ),
        MsgId.make(3, "commit", ),
        MsgId.make(4, "hisWrite", ),
        MsgId.make(5, "storeAdd", ),
        MsgId.make(6, "storeUpdate", true),
        MsgId.make(7, "storeRemove", ),
        MsgId.make(8, "disUpdateAll", true),
        MsgId.make(9, "disUpdate", ),
      ]).toImmutable();
    }
    return MsgId.#vals;
  }

  static static$init() {
    const $_u5 = MsgId.vals();
    if (true) {
    }
    ;
    return;
  }

}

class MsgCoalesceKey extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MsgCoalesceKey.type$; }

  #hash = 0;

  hash() { return this.#hash; }

  __hash(it) { if (it === undefined) return this.#hash; else this.#hash = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  static make(id,rec) {
    const $self = new MsgCoalesceKey();
    MsgCoalesceKey.make$($self,id,rec);
    return $self;
  }

  static make$($self,id,rec) {
    $self.#hash = ((this$) => { if (rec == null) return sys.ObjUtil.hash(id); return sys.Int.xor(sys.ObjUtil.hash(id), rec.id().hash()); })($self);
    $self.#id = id;
    $self.#rec = rec;
    return;
  }

  equals(obj) {
    let that = sys.ObjUtil.coerce(obj, MsgCoalesceKey.type$);
    return (this.#id === that.#id && this.#rec === that.#rec);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#id), " "), this.#rec.id());
  }

}

class StoreMgr extends HxFolioMgr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StoreMgr.type$; }

  #blobs = null;

  blobs() { return this.#blobs; }

  __blobs(it) { if (it === undefined) return this.#blobs; else this.#blobs = it; }

  static make($folio,loader) {
    const $self = new StoreMgr();
    StoreMgr.make$($self,$folio,loader);
    return $self;
  }

  static make$($self,$folio,loader) {
    const this$ = $self;
    HxFolioMgr.makeCoalescing$($self, $folio, sys.ObjUtil.coerce((m) => {
      return m.coalesceKey();
    }, sys.Type.find("|sys::Obj?->sys::Obj?|?")), null);
    $self.#blobs = sys.ObjUtil.coerce(loader.blobs(), hxStore.Store.type$);
    if (loader.config().isReplica()) {
      $self.#blobs.ro(true);
    }
    ;
    $self.#blobs.onWriteErr((e) => {
      this$.#blobs.ro(true);
      this$.log().err("Store I/O write error, locking down to readonly", e);
      return;
    });
    return;
  }

  add(tags) {
    return sys.ObjUtil.coerce(this.send(Msg.make(MsgId.storeAdd(), tags)).get(null), Rec.type$);
  }

  update(rec) {
    this.send(Msg.make(MsgId.storeUpdate(), rec));
    return;
  }

  remove(rec) {
    this.send(Msg.make(MsgId.storeRemove(), rec));
    return;
  }

  onReceive(msg) {
    try {
      let $_u7 = msg.id();
      if (sys.ObjUtil.equals($_u7, MsgId.storeAdd())) {
        return this.onAdd(sys.ObjUtil.coerce(msg.a(), haystack.Dict.type$));
      }
      else if (sys.ObjUtil.equals($_u7, MsgId.storeUpdate())) {
        return this.onUpdate(sys.ObjUtil.coerce(msg.a(), Rec.type$));
      }
      else if (sys.ObjUtil.equals($_u7, MsgId.storeRemove())) {
        return this.onRemove(sys.ObjUtil.coerce(msg.a(), Rec.type$));
      }
      else {
        return HxFolioMgr.prototype.onReceive.call(this, msg);
      }
      ;
    }
    catch ($_u8) {
      $_u8 = sys.Err.make($_u8);
      if ($_u8 instanceof sys.Err) {
        let e = $_u8;
        ;
        this.folio().log().err("Store error", e);
        throw e;
      }
      else {
        throw $_u8;
      }
    }
    ;
  }

  onAdd(persistent) {
    let meta = sys.Buf.make();
    let data = this.encode(persistent);
    let blob = this.#blobs.create(sys.ObjUtil.coerce(meta, sys.Buf.type$), data);
    let rec = Rec.make(blob, persistent);
    rec.numWritesRef().incrementAndGet();
    return rec;
  }

  onUpdate(rec) {
    let data = this.encode(rec.persistent());
    rec.blob().write(null, data);
    rec.numWritesRef().incrementAndGet();
    return rec;
  }

  onRemove(rec) {
    const this$ = this;
    rec.eachBlob((blob) => {
      blob.delete();
      return;
    });
    return rec;
  }

  onClose() {
    this.#blobs.close();
    return;
  }

  encode(persistent) {
    let buf = sys.ObjUtil.as(concurrent.Actor.locals().get("buf"), sys.Buf.type$);
    if (buf == null) {
      concurrent.Actor.locals().set("buf", (buf = sys.Buf.make(1024)));
    }
    ;
    buf.clear();
    let brio = haystack.BrioWriter.make(buf.out());
    brio.encodeRefToRel(this.folio().idPrefix());
    brio.encodeRefDis(false);
    brio.writeDict(persistent);
    return sys.ObjUtil.coerce(buf, sys.Buf.type$);
  }

}

class Rec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#dictRef = concurrent.AtomicRef.make();
    this.#persistentRef = concurrent.AtomicRef.make();
    this.#transientRef = concurrent.AtomicRef.make(haystack.Etc.emptyDict());
    this.#isTrashRef = concurrent.AtomicBool.make();
    this.#ticksRef = concurrent.AtomicInt.make(1);
    this.#numWritesRef = concurrent.AtomicInt.make();
    this.#numWatches = concurrent.AtomicInt.make();
    this.#hisItemsRef = concurrent.AtomicRef.make(haystack.HisItem.type$.emptyList());
    return;
  }

  typeof() { return Rec.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #blob = null;

  blob() { return this.#blob; }

  __blob(it) { if (it === undefined) return this.#blob; else this.#blob = it; }

  #dictRef = null;

  // private field reflection only
  __dictRef(it) { if (it === undefined) return this.#dictRef; else this.#dictRef = it; }

  #persistentRef = null;

  // private field reflection only
  __persistentRef(it) { if (it === undefined) return this.#persistentRef; else this.#persistentRef = it; }

  #transientRef = null;

  // private field reflection only
  __transientRef(it) { if (it === undefined) return this.#transientRef; else this.#transientRef = it; }

  #isTrashRef = null;

  // private field reflection only
  __isTrashRef(it) { if (it === undefined) return this.#isTrashRef; else this.#isTrashRef = it; }

  #ticksRef = null;

  // private field reflection only
  __ticksRef(it) { if (it === undefined) return this.#ticksRef; else this.#ticksRef = it; }

  #numWritesRef = null;

  numWritesRef() { return this.#numWritesRef; }

  __numWritesRef(it) { if (it === undefined) return this.#numWritesRef; else this.#numWritesRef = it; }

  #numWatches = null;

  numWatches() { return this.#numWatches; }

  __numWatches(it) { if (it === undefined) return this.#numWatches; else this.#numWatches = it; }

  #hisItemsRef = null;

  // private field reflection only
  __hisItemsRef(it) { if (it === undefined) return this.#hisItemsRef; else this.#hisItemsRef = it; }

  static make(blob,persistent) {
    const $self = new Rec();
    Rec.make$($self,blob,persistent);
    return $self;
  }

  static make$($self,blob,persistent) {
    ;
    blob.stash($self);
    $self.#blob = blob;
    $self.#id = persistent.id();
    $self.#id.disVal(persistent.dis());
    $self.#persistentRef.val(persistent);
    $self.#dictRef.val(persistent);
    $self.#isTrashRef.val(persistent.has("trash"));
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("Rec(", this.#id.toZinc()), ")");
  }

  handle() {
    return this.#blob.handle();
  }

  dis() {
    return sys.ObjUtil.coerce(this.dict().dis(), sys.Str.type$);
  }

  dict() {
    return sys.ObjUtil.coerce(this.#dictRef.val(), haystack.Dict.type$);
  }

  persistent() {
    return sys.ObjUtil.coerce(this.#persistentRef.val(), haystack.Dict.type$);
  }

  transient() {
    return sys.ObjUtil.coerce(this.#transientRef.val(), haystack.Dict.type$);
  }

  isTrash() {
    return this.#isTrashRef.val();
  }

  ticks() {
    return this.#ticksRef.val();
  }

  updateDict(p,t,ticks) {
    this.#persistentRef.val(p);
    this.#transientRef.val(t);
    this.#dictRef.val(haystack.Etc.dictMerge(p, t));
    this.#isTrashRef.val(p.has("trash"));
    this.#ticksRef.val(ticks);
    return;
  }

  numWrites() {
    return this.#numWritesRef.val();
  }

  hisItems() {
    return sys.ObjUtil.coerce(this.#hisItemsRef.val(), sys.Type.find("haystack::HisItem[]"));
  }

  hisUpdate(items) {
    let t = haystack.Etc.dictToMap(this.transient());
    if (items.isEmpty()) {
      t.remove("hisSize");
      t.remove("hisStart");
      t.remove("hisEnd");
    }
    else {
      t.set("hisSize", haystack.Number.makeInt(items.size()));
      t.set("hisStart", items.first().ts());
      t.set("hisEnd", items.last().ts());
    }
    ;
    let newTransient = haystack.Etc.makeDict(t);
    this.updateDict(this.persistent(), newTransient, sys.Duration.nowTicks());
    this.#hisItemsRef.val(items);
    return this;
  }

  eachBlob(f) {
    sys.Func.call(f, this.#blob);
    return;
  }

}

class StatsMgr extends HxFolioMgr {
  constructor() {
    super();
    const this$ = this;
    this.#commitsPersistent = StatsCountAndTicks.make();
    this.#commitsTransient = StatsCountAndTicks.make();
    this.#reads = StatsCountAndTicks.make();
    this.#readsByPlan = StatsReadByPlan.make();
    return;
  }

  typeof() { return StatsMgr.type$; }

  #commitsPersistent = null;

  commitsPersistent() { return this.#commitsPersistent; }

  __commitsPersistent(it) { if (it === undefined) return this.#commitsPersistent; else this.#commitsPersistent = it; }

  #commitsTransient = null;

  commitsTransient() { return this.#commitsTransient; }

  __commitsTransient(it) { if (it === undefined) return this.#commitsTransient; else this.#commitsTransient = it; }

  #reads = null;

  reads() { return this.#reads; }

  __reads(it) { if (it === undefined) return this.#reads; else this.#reads = it; }

  #readsByPlan = null;

  readsByPlan() { return this.#readsByPlan; }

  __readsByPlan(it) { if (it === undefined) return this.#readsByPlan; else this.#readsByPlan = it; }

  #diags = null;

  diags() { return this.#diags; }

  __diags(it) { if (it === undefined) return this.#diags; else this.#diags = it; }

  static make($folio) {
    const $self = new StatsMgr();
    StatsMgr.make$($self,$folio);
    return $self;
  }

  static make$($self,$folio) {
    const this$ = $self;
    HxFolioMgr.make$($self, $folio);
    ;
    $self.#diags = sys.ObjUtil.coerce(((this$) => { let $_u9 = sys.List.make(FolioDiag.type$, [FolioDiag.make("recs", "Recs", () => {
      return sys.ObjUtil.coerce(haystack.Number.makeInt($folio.index().size()), sys.Obj.type$);
    }), FolioDiag.make("readCount", "Read Count", () => {
      return sys.ObjUtil.coerce(haystack.Number.makeInt(this$.#reads.count()), sys.Obj.type$);
    }), FolioDiag.make("readAvg", "Read Avg", () => {
      return this$.#reads.avgTime();
    }), FolioDiag.make("pCommitCount", "Persistent Commit Count", () => {
      return sys.ObjUtil.coerce(haystack.Number.makeInt(this$.#commitsPersistent.count()), sys.Obj.type$);
    }), FolioDiag.make("pCommitAvg", "Persistent Commit Avg", () => {
      return this$.#commitsPersistent.avgTime();
    }), FolioDiag.make("tCommitCount", "Transient Commit Count", () => {
      return sys.ObjUtil.coerce(haystack.Number.makeInt(this$.#commitsTransient.count()), sys.Obj.type$);
    }), FolioDiag.make("tCommitAvg", "Transient Commit Avg", () => {
      return this$.#commitsTransient.avgTime();
    })]); if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(FolioDiag.type$, [FolioDiag.make("recs", "Recs", () => {
      return sys.ObjUtil.coerce(haystack.Number.makeInt($folio.index().size()), sys.Obj.type$);
    }), FolioDiag.make("readCount", "Read Count", () => {
      return sys.ObjUtil.coerce(haystack.Number.makeInt(this$.#reads.count()), sys.Obj.type$);
    }), FolioDiag.make("readAvg", "Read Avg", () => {
      return this$.#reads.avgTime();
    }), FolioDiag.make("pCommitCount", "Persistent Commit Count", () => {
      return sys.ObjUtil.coerce(haystack.Number.makeInt(this$.#commitsPersistent.count()), sys.Obj.type$);
    }), FolioDiag.make("pCommitAvg", "Persistent Commit Avg", () => {
      return this$.#commitsPersistent.avgTime();
    }), FolioDiag.make("tCommitCount", "Transient Commit Count", () => {
      return sys.ObjUtil.coerce(haystack.Number.makeInt(this$.#commitsTransient.count()), sys.Obj.type$);
    }), FolioDiag.make("tCommitAvg", "Transient Commit Avg", () => {
      return this$.#commitsTransient.avgTime();
    })])); })($self), sys.Type.find("hxFolio::FolioDiag[]"));
    return;
  }

  clear() {
    this.#commitsPersistent.clear();
    this.#commitsTransient.clear();
    this.#reads.clear();
    this.#readsByPlan.clear();
    return;
  }

  debugSummary() {
    let store = this.folio().store().blobs();
    let storeMeta = store.meta();
    let gb = haystack.GridBuilder.make();
    gb.addCol("dis").addCol("val");
    gb.addRow2("name", this.folio().dir().parent().name());
    gb.addRow2("dir", this.folio().dir().osPath());
    gb.addRow2("version", sys.ObjUtil.typeof(this).pod().version().toStr());
    gb.addRow2("idPrefix", this.folio().idPrefix());
    gb.addRow2("index.size", haystack.Number.makeInt(this.folio().index().size()));
    gb.addRow2("store.size", sys.Int.toLocale(store.size()));
    gb.addRow2("store.ver", sys.Int.toLocale(store.ver()));
    gb.addRow2("store.numPageFile", sys.Int.toLocale(store.pageFileSize()));
    gb.addRow2("store.blobMetaMax", sys.Int.toLocale(storeMeta.blobMetaMax(), "B"));
    gb.addRow2("store.blobDataMax", sys.Int.toLocale(storeMeta.blobDataMax(), "B"));
    gb.addRow2("store.hisPageSize", haystack.Number.makeDuration(storeMeta.hisPageSize(), haystack.Number.day()));
    gb.addRow2("store.flushMode", store.flushMode());
    gb.addRow2("store.unflushedCount", haystack.Number.makeInt(store.unflushedCount()));
    gb.addRow2("store.gcFreezeCount", haystack.Number.makeInt(store.gcFreezeCount()));
    gb.addRow2("store.backup", store.backup(null));
    gb.addRow2("reads.num", haystack.Number.makeInt(this.#reads.count()));
    gb.addRow2("reads.totalTime", this.#reads.totalTime());
    gb.addRow2("reads.avgTime", this.#reads.avgTime());
    gb.addRow2("commits.persistent.num", haystack.Number.makeInt(this.#commitsPersistent.count()));
    gb.addRow2("commits.persistent.totalTime", this.#commitsPersistent.totalTime());
    gb.addRow2("commits.persistent.avgTime", this.#commitsPersistent.avgTime());
    gb.addRow2("commits.transient.num", haystack.Number.makeInt(this.#commitsTransient.count()));
    gb.addRow2("commits.transient.totalTime", this.#commitsTransient.totalTime());
    gb.addRow2("commits.transient.avgTime", this.#commitsTransient.avgTime());
    return gb.toGrid();
  }

  debugReadsByPlan() {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.addCol("plan").addCol("numReads").addCol("totalTime").addCol("avgTime");
    this.#readsByPlan.each((stats,plan) => {
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [plan, haystack.Number.makeInt(stats.count()), stats.totalTime(), stats.avgTime()]));
      return;
    });
    return gb.sortrCol("numReads").toGrid();
  }

}

class StatsCountAndTicks extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#countRef = concurrent.AtomicInt.make();
    this.#ticksRef = concurrent.AtomicInt.make();
    return;
  }

  typeof() { return StatsCountAndTicks.type$; }

  #countRef = null;

  // private field reflection only
  __countRef(it) { if (it === undefined) return this.#countRef; else this.#countRef = it; }

  #ticksRef = null;

  // private field reflection only
  __ticksRef(it) { if (it === undefined) return this.#ticksRef; else this.#ticksRef = it; }

  add(ticks) {
    this.#countRef.incrementAndGet();
    this.#ticksRef.addAndGet(ticks);
    return;
  }

  clear() {
    this.#countRef.val(((this$) => { let $_u10 = 0; this$.#ticksRef.val($_u10); return $_u10; })(this));
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.count(), sys.Obj.type$.toNullable())), " ("), this.totalTime()), " | "), this.avgTime()), ")");
  }

  totalTime() {
    return sys.Duration.make(this.ticks()).toLocale();
  }

  avgTime() {
    return ((this$) => { if (sys.ObjUtil.equals(this$.count(), 0)) return "-"; return sys.Duration.make(sys.Int.div(this$.ticks(), this$.count())).toLocale(); })(this);
  }

  count() {
    return this.#countRef.val();
  }

  ticks() {
    return this.#ticksRef.val();
  }

  static make() {
    const $self = new StatsCountAndTicks();
    StatsCountAndTicks.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class StatsReadByTag extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#map = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return StatsReadByTag.type$; }

  #map = null;

  // private field reflection only
  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  each(f) {
    const this$ = this;
    this.#map.each(sys.ObjUtil.coerce((v,t) => {
      sys.Func.call(f, sys.ObjUtil.coerce(v.val(), sys.Obj.type$.toNullable()), t);
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    return;
  }

  add(tag) {
    let count = sys.ObjUtil.as(this.#map.get(tag), concurrent.AtomicInt.type$);
    if (count == null) {
      this.#map.set(tag, sys.ObjUtil.coerce((count = concurrent.AtomicInt.make()), sys.Obj.type$));
    }
    ;
    return count.incrementAndGet();
  }

  clear() {
    this.#map.clear();
    return;
  }

  static make() {
    const $self = new StatsReadByTag();
    StatsReadByTag.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class StatsReadByPlan extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#map = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return StatsReadByPlan.type$; }

  #map = null;

  // private field reflection only
  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  each(f) {
    this.#map.each(sys.ObjUtil.coerce(f, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    return;
  }

  add(plan,ticks) {
    let stats = sys.ObjUtil.as(this.#map.get(plan), StatsCountAndTicks.type$);
    if (stats == null) {
      this.#map.set(plan, sys.ObjUtil.coerce((stats = StatsCountAndTicks.make()), sys.Obj.type$));
    }
    ;
    return stats.add(ticks);
  }

  clear() {
    this.#map.clear();
    return;
  }

  static make() {
    const $self = new StatsReadByPlan();
    StatsReadByPlan.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class FolioDiag extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FolioDiag.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #func = null;

  func() { return this.#func; }

  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  static make(name,dis,func) {
    const $self = new FolioDiag();
    FolioDiag.make$($self,name,dis,func);
    return $self;
  }

  static make$($self,name,dis,func) {
    $self.#name = name;
    $self.#dis = dis;
    $self.#func = sys.ObjUtil.coerce(((this$) => { let $_u12 = func; if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(func); })($self), sys.Type.find("|->sys::Obj|"));
    return;
  }

  val() {
    return sys.Func.call(this.#func);
  }

}

class Query extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return Query.type$; }

  xetoReadById() { return haystack.HaystackContext.prototype.xetoReadById.apply(this, arguments); }

  xetoReadAllEachWhile() { return haystack.HaystackContext.prototype.xetoReadAllEachWhile.apply(this, arguments); }

  #folio = null;

  folio() { return this.#folio; }

  __folio(it) { if (it === undefined) return this.#folio; else this.#folio = it; }

  #index = null;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #filter = null;

  filter() { return this.#filter; }

  __filter(it) { if (it === undefined) return this.#filter; else this.#filter = it; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #startTicks = 0;

  startTicks() { return this.#startTicks; }

  __startTicks(it) { if (it === undefined) return this.#startTicks; else this.#startTicks = it; }

  #xetoIsSpecCache = null;

  // private field reflection only
  __xetoIsSpecCache(it) { if (it === undefined) return this.#xetoIsSpecCache; else this.#xetoIsSpecCache = it; }

  #inference$Store = undefined;

  // private field reflection only
  __inference$Store(it) { if (it === undefined) return this.#inference$Store; else this.#inference$Store = it; }

  static make($folio,filter,opts) {
    const $self = new Query();
    Query.make$($self,$folio,filter,opts);
    return $self;
  }

  static make$($self,$folio,filter,opts) {
    ;
    $self.#folio = $folio;
    $self.#index = $folio.index();
    $self.#filter = filter;
    $self.#opts = QueryOpts.make(opts);
    $self.#startTicks = sys.Duration.nowTicks();
    return;
  }

  collect(cx) {
    let plan = this.makePlan();
    let acc = QueryCollect.make(cx, this.#opts);
    plan.query(this, acc);
    this.updateStats(plan);
    let list = acc.list();
    if (this.#opts.sort()) {
      (list = haystack.Etc.sortDictsByDis(list));
    }
    ;
    return list;
  }

  eachWhile(cx,cb) {
    let plan = this.makePlan();
    let acc = QueryEachWhile.make(cx, this.#opts, cb);
    plan.query(this, acc);
    this.updateStats(plan);
    return acc.result();
  }

  count(cx) {
    let plan = this.makePlan();
    let acc = QueryCounter.make(cx, this.#opts);
    plan.query(this, acc);
    this.updateStats(plan);
    return acc.count();
  }

  makePlan() {
    if (!this.#opts.skipTrash()) {
      return FullScanPlan.make();
    }
    ;
    return sys.ObjUtil.coerce(Query.doMakePlan(this.#index, this.#filter, false), QueryPlan.type$);
  }

  xetoIsSpec(specName,rec) {
    let ns = this.#folio.hooks().xeto(false);
    if (ns == null) {
      return false;
    }
    ;
    let spec = ((this$) => { let $_u13 = this$.#xetoIsSpecCache; if ($_u13 == null) return null; return this$.#xetoIsSpecCache.get(specName); })(this);
    if (spec == null) {
      if (this.#xetoIsSpecCache == null) {
        this.#xetoIsSpecCache = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Spec"));
      }
      ;
      (spec = ((this$) => { if (sys.Str.contains(specName, "::")) return ns.type(specName); return ns.unqualifiedType(specName); })(this));
      this.#xetoIsSpecCache.set(specName, sys.ObjUtil.coerce(spec, xeto.Spec.type$));
    }
    ;
    return ns.specOf(rec).isa(sys.ObjUtil.coerce(spec, xeto.Spec.type$));
  }

  deref(id) {
    return this.#index.dict(id, false);
  }

  inference() {
    if (this.#inference$Store === undefined) {
      this.#inference$Store = this.inference$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#inference$Store, haystack.FilterInference.type$);
  }

  toDict() {
    return haystack.Etc.emptyDict();
  }

  static doMakePlan(index,filter,inCompound) {
    let type = filter.type();
    if (type === haystack.FilterType.and()) {
      let a = Query.doMakePlan(index, sys.ObjUtil.coerce(filter.argA(), haystack.Filter.type$), true);
      let b = Query.doMakePlan(index, sys.ObjUtil.coerce(filter.argB(), haystack.Filter.type$), true);
      return ((this$) => { if (sys.ObjUtil.compareLE(a.cost(), b.cost())) return a; return b; })(this);
    }
    ;
    if (type === haystack.FilterType.eq()) {
      let path = sys.ObjUtil.coerce(filter.argA(), haystack.FilterPath.type$);
      if ((sys.ObjUtil.equals(path.size(), 1) && sys.ObjUtil.equals(path.get(0), "id"))) {
        return ByIdPlan.make(sys.ObjUtil.coerce(((this$) => { let $_u16 = sys.ObjUtil.as(filter.argB(), haystack.Ref.type$); if ($_u16 != null) return $_u16; return haystack.Ref.nullRef(); })(this), haystack.Ref.type$), inCompound);
      }
      ;
    }
    ;
    return FullScanPlan.make();
  }

  updateStats(plan) {
    let ticks = sys.Int.minus(sys.Duration.nowTicks(), this.#startTicks);
    let stats = this.#folio.stats();
    stats.reads().add(ticks);
    stats.readsByPlan().add(plan.debug(), ticks);
    return;
  }

  inference$Once() {
    let ns = this.#folio.hooks().ns(false);
    if (ns != null) {
      return def.MFilterInference.make(sys.ObjUtil.coerce(ns, haystack.Namespace.type$));
    }
    ;
    return haystack.FilterInference.nil();
  }

}

class QueryOpts extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueryOpts.type$; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #limit = 0;

  limit() { return this.#limit; }

  __limit(it) { if (it === undefined) return this.#limit; else this.#limit = it; }

  #search = null;

  search() { return this.#search; }

  __search(it) { if (it === undefined) return this.#search; else this.#search = it; }

  #skipTrash = false;

  skipTrash() { return this.#skipTrash; }

  __skipTrash(it) { if (it === undefined) return this.#skipTrash; else this.#skipTrash = it; }

  #sort = false;

  sort() { return this.#sort; }

  __sort(it) { if (it === undefined) return this.#sort; else this.#sort = it; }

  static make(opts) {
    const $self = new QueryOpts();
    QueryOpts.make$($self,opts);
    return $self;
  }

  static make$($self,opts) {
    $self.#opts = opts;
    $self.#limit = QueryOpts.toLimit(opts);
    $self.#search = QueryOpts.toSearch(opts);
    $self.#skipTrash = opts.missing("trash");
    $self.#sort = opts.has("sort");
    return;
  }

  static makeLimit(limit) {
    const $self = new QueryOpts();
    QueryOpts.makeLimit$($self,limit);
    return $self;
  }

  static makeLimit$($self,limit) {
    $self.#opts = haystack.Etc.emptyDict();
    $self.#limit = limit;
    return;
  }

  static toLimit(opts) {
    let optLimit = opts.get("limit", "not-found");
    if (sys.ObjUtil.is(optLimit, haystack.Number.type$)) {
      return sys.ObjUtil.coerce(optLimit, haystack.Number.type$).toInt();
    }
    else {
      return sys.Int.maxVal();
    }
    ;
  }

  static toSearch(opts) {
    let search = sys.ObjUtil.as(opts.get("search"), sys.Str.type$);
    if (search == null) {
      return null;
    }
    ;
    (search = sys.Str.trimToNull(search));
    if (search == null) {
      return null;
    }
    ;
    return haystack.Filter.search(sys.ObjUtil.coerce(search, sys.Str.type$));
  }

}

class QueryAcc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueryAcc.type$; }

  #cx = null;

  cx(it) {
    if (it === undefined) {
      return this.#cx;
    }
    else {
      this.#cx = it;
      return;
    }
  }

  #limit = 0;

  limit() { return this.#limit; }

  __limit(it) { if (it === undefined) return this.#limit; else this.#limit = it; }

  #search = null;

  search(it) {
    if (it === undefined) {
      return this.#search;
    }
    else {
      this.#search = it;
      return;
    }
  }

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

  static make(cx,opts) {
    const $self = new QueryAcc();
    QueryAcc.make$($self,cx,opts);
    return $self;
  }

  static make$($self,cx,opts) {
    $self.#cx = cx;
    $self.#limit = opts.limit();
    $self.#search = opts.search();
    return;
  }

  prepCapacity(addingSize) {
    return;
  }

  add(rec) {
    if (sys.ObjUtil.compareGE(this.#count, this.#limit)) {
      return false;
    }
    ;
    if ((this.#cx != null && !this.#cx.canRead(rec))) {
      return true;
    }
    ;
    if ((this.#search != null && !this.#search.matches(rec, haystack.HaystackContext.nil()))) {
      return true;
    }
    ;
    ((this$) => { let $_u17 = this$.#count;this$.#count = sys.Int.increment(this$.#count); return $_u17; })(this);
    if (!this.onAdd(rec)) {
      return false;
    }
    ;
    return sys.ObjUtil.compareLT(this.#count, this.#limit);
  }

}

class QueryCollect extends QueryAcc {
  constructor() {
    super();
    const this$ = this;
    this.#list = sys.List.make(haystack.Dict.type$);
    return;
  }

  typeof() { return QueryCollect.type$; }

  #list = null;

  list(it) {
    if (it === undefined) {
      return this.#list;
    }
    else {
      this.#list = it;
      return;
    }
  }

  static make(cx,opts) {
    const $self = new QueryCollect();
    QueryCollect.make$($self,cx,opts);
    return $self;
  }

  static make$($self,cx,opts) {
    QueryAcc.make$($self, cx, opts);
    ;
    return;
  }

  prepCapacity(addingSize) {
    let total = sys.Int.plus(this.#list.size(), addingSize);
    if (sys.ObjUtil.compareGT(total, this.limit())) {
      (total = this.limit());
    }
    ;
    this.#list.capacity(total);
    return;
  }

  onAdd(rec) {
    this.#list.add(rec);
    return true;
  }

}

class QueryEachWhile extends QueryAcc {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueryEachWhile.type$; }

  #cb = null;

  cb(it) {
    if (it === undefined) {
      return this.#cb;
    }
    else {
      this.#cb = it;
      return;
    }
  }

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

  static make(cx,opts,cb) {
    const $self = new QueryEachWhile();
    QueryEachWhile.make$($self,cx,opts,cb);
    return $self;
  }

  static make$($self,cx,opts,cb) {
    QueryAcc.make$($self, cx, opts);
    $self.#cb = cb;
    return;
  }

  onAdd(rec) {
    this.#result = sys.Func.call(this.#cb, rec);
    return this.#result == null;
  }

}

class QueryCounter extends QueryAcc {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueryCounter.type$; }

  static make(cx,opts) {
    const $self = new QueryCounter();
    QueryCounter.make$($self,cx,opts);
    return $self;
  }

  static make$($self,cx,opts) {
    QueryAcc.make$($self, cx, opts);
    return;
  }

  onAdd(rec) {
    return true;
  }

}

class QueryPlan extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueryPlan.type$; }

  static make() {
    const $self = new QueryPlan();
    QueryPlan.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class EmptyPlan extends QueryPlan {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EmptyPlan.type$; }

  debug() {
    return "empty";
  }

  cost() {
    return 0;
  }

  query(q,acc) {
    return;
  }

  static make() {
    const $self = new EmptyPlan();
    EmptyPlan.make$($self);
    return $self;
  }

  static make$($self) {
    QueryPlan.make$($self);
    return;
  }

}

class ByIdPlan extends QueryPlan {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ByIdPlan.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #inCompound = false;

  inCompound() { return this.#inCompound; }

  __inCompound(it) { if (it === undefined) return this.#inCompound; else this.#inCompound = it; }

  static make(id,inCompound) {
    const $self = new ByIdPlan();
    ByIdPlan.make$($self,id,inCompound);
    return $self;
  }

  static make$($self,id,inCompound) {
    QueryPlan.make$($self);
    $self.#id = id;
    $self.#inCompound = inCompound;
    return;
  }

  debug() {
    return "byId";
  }

  cost() {
    return 1;
  }

  query(q,acc) {
    let rec = q.index().dict(this.#id, false);
    if (rec == null) {
      return;
    }
    ;
    if ((this.#inCompound && !q.filter().matches(sys.ObjUtil.coerce(rec, haystack.Dict.type$), q))) {
      return;
    }
    ;
    acc.add(sys.ObjUtil.coerce(rec, haystack.Dict.type$));
    return;
  }

}

class FullScanPlan extends QueryPlan {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FullScanPlan.type$; }

  debug() {
    return "fullScan";
  }

  cost() {
    return sys.Int.maxVal();
  }

  query(q,acc) {
    const this$ = this;
    q.index().byId().eachWhile(sys.ObjUtil.coerce((rec) => {
      let dict = rec.dict();
      if (!q.filter().matches(dict, q)) {
        return null;
      }
      ;
      if ((rec.isTrash() && q.opts().skipTrash())) {
        return null;
      }
      ;
      return ((this$) => { if (acc.add(dict)) return null; return "break"; })(this$);
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Obj?|")));
    return;
  }

  static make() {
    const $self = new FullScanPlan();
    FullScanPlan.make$($self);
    return $self;
  }

  static make$($self) {
    QueryPlan.make$($self);
    return;
  }

}

class IndexMgr extends HxFolioMgr {
  constructor() {
    super();
    const this$ = this;
    this.#lastModRef = concurrent.AtomicRef.make(sys.DateTime.nowUtc());
    return;
  }

  typeof() { return IndexMgr.type$; }

  #lastModRef = null;

  // private field reflection only
  __lastModRef(it) { if (it === undefined) return this.#lastModRef; else this.#lastModRef = it; }

  #byId = null;

  byId() { return this.#byId; }

  __byId(it) { if (it === undefined) return this.#byId; else this.#byId = it; }

  static make($folio,loader) {
    const $self = new IndexMgr();
    IndexMgr.make$($self,$folio,loader);
    return $self;
  }

  static make$($self,$folio,loader) {
    HxFolioMgr.make$($self, $folio);
    ;
    $self.#byId = loader.byId();
    return;
  }

  size() {
    return this.#byId.size();
  }

  rec(ref,checked) {
    if (checked === undefined) checked = true;
    let rec = this.#byId.get(ref);
    if (rec != null) {
      return sys.ObjUtil.coerce(rec, Rec.type$.toNullable());
    }
    ;
    if ((ref.isRel() && this.folio().idPrefix() != null)) {
      (ref = ref.toAbs(sys.ObjUtil.coerce(this.folio().idPrefix(), sys.Str.type$)));
      (rec = this.#byId.get(ref));
      if (rec != null) {
        return sys.ObjUtil.coerce(rec, Rec.type$.toNullable());
      }
      ;
    }
    ;
    if (checked) {
      throw haystack.UnknownRecErr.make(ref.id());
    }
    ;
    return null;
  }

  dict(ref,checked) {
    if (checked === undefined) checked = true;
    return ((this$) => { let $_u19 = this$.rec(ref, checked); if ($_u19 == null) return null; return this$.rec(ref, checked).dict(); })(this);
  }

  lastMod() {
    return sys.ObjUtil.coerce(this.#lastModRef.val(), sys.DateTime.type$);
  }

  commit(diffs) {
    return this.send(Msg.make(MsgId.commit(), diffs));
  }

  hisWrite(rec,items,opts,cxInfo) {
    return this.send(Msg.make(MsgId.hisWrite(), rec, sys.Unsafe.make(items), opts, cxInfo));
  }

  onReceive(msg) {
    let $_u20 = msg.id();
    if (sys.ObjUtil.equals($_u20, MsgId.commit())) {
      return this.onCommit(sys.ObjUtil.coerce(msg.a(), sys.Type.find("folio::Diff[]")), sys.ObjUtil.coerce(msg.b(), sys.Type.find("[haystack::Ref:haystack::Ref]?")), msg.c());
    }
    else if (sys.ObjUtil.equals($_u20, MsgId.hisWrite())) {
      return this.onHisWrite(sys.ObjUtil.coerce(msg.a(), Rec.type$), sys.ObjUtil.coerce(msg.b(), sys.Unsafe.type$), sys.ObjUtil.coerce(msg.c(), haystack.Dict.type$), msg.d());
    }
    else {
      return HxFolioMgr.prototype.onReceive.call(this, msg);
    }
    ;
  }

  onHisUpdate(rec,items) {
    return rec.hisUpdate(items);
  }

  onCommit(diffs,newIds,cxInfo) {
    const this$ = this;
    let persistent = !diffs.first().isTransient();
    let newMod = sys.DateTime.nowUtc(null);
    if (sys.ObjUtil.compareLE(newMod, this.lastMod())) {
      (newMod = this.lastMod().plus(sys.Duration.fromStr("1ms")));
    }
    ;
    let newTicks = sys.Duration.nowTicks();
    let commits = sys.ObjUtil.coerce(diffs.map((d) => {
      return Commit.make(this$.folio(), d, newMod, newTicks, newIds, cxInfo);
    }, Commit.type$), sys.Type.find("hxFolio::Commit[]"));
    commits.each((c) => {
      c.verify();
      return;
    });
    try {
      (diffs = sys.ObjUtil.coerce(commits.map((c) => {
        return c.apply();
      }, folio.Diff.type$), sys.Type.find("folio::Diff[]")));
    }
    catch ($_u21) {
      $_u21 = sys.Err.make($_u21);
      if ($_u21 instanceof sys.Err) {
        let e = $_u21;
        ;
        this.log().err("Commit failed", e);
        throw e;
      }
      else {
        throw $_u21;
      }
    }
    ;
    if (persistent) {
      this.#lastModRef.val(newMod);
    }
    ;
    if ((newIds != null && sys.ObjUtil.compareGT(newIds.size(), 1))) {
      this.folio().disMgr().updateAll();
    }
    ;
    return folio.CommitFolioRes.make(diffs);
  }

  onHisWrite(rec,toWriteUnsafe,opts,cxInfo) {
    let toWrite = sys.ObjUtil.coerce(toWriteUnsafe.val(), sys.Type.find("haystack::HisItem[]"));
    let curItems = rec.hisItems();
    let newItems = folio.FolioUtil.hisWriteMerge(curItems, toWrite);
    let maxItems = this.hisMaxItems(rec.dict());
    if (sys.ObjUtil.compareGT(newItems.size(), maxItems)) {
      (newItems = newItems.getRange(sys.Range.make(sys.Int.minus(newItems.size(), maxItems), -1)));
    }
    ;
    (newItems = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(newItems), sys.Type.find("haystack::HisItem[]")));
    rec.hisUpdate(newItems);
    let span = haystack.Span.makeAbs(toWrite.first().ts(), toWrite.last().ts());
    let result = haystack.Etc.makeDict2("count", haystack.Number.makeInt(toWrite.size()), "span", span);
    this.folio().hooks().postHisWrite(HisEvent.make(rec.dict(), result, cxInfo));
    return folio.HisWriteFolioRes.make(result);
  }

  hisMaxItems(rec) {
    return sys.ObjUtil.coerce(haystack.Etc.dictGetInt(rec, "hisMaxItems", sys.ObjUtil.coerce(1000, sys.Int.type$.toNullable())), sys.Int.type$);
  }

  hisTagsModified(rec) {
    const this$ = this;
    try {
      let curItems = rec.hisItems();
      if (curItems.isEmpty()) {
        return;
      }
      ;
      let dict = rec.dict();
      let tz = folio.FolioUtil.hisTz(dict);
      let unit = folio.FolioUtil.hisUnit(dict);
      let kind = folio.FolioUtil.hisKind(dict);
      let isNum = kind.isNumber();
      let sample = curItems.first();
      if ((sys.ObjUtil.equals(sample.ts().tz(), tz) && sys.ObjUtil.equals(((this$) => { let $_u22 = sys.ObjUtil.as(sample.val(), haystack.Number.type$); if ($_u22 == null) return null; return sys.ObjUtil.as(sample.val(), haystack.Number.type$).unit(); })(this), unit))) {
        return;
      }
      ;
      let newItems = curItems.map((item) => {
        let ts = item.ts().toTimeZone(sys.ObjUtil.coerce(tz, sys.TimeZone.type$));
        let val = item.val();
        if (isNum) {
          (val = haystack.Number.make(sys.ObjUtil.coerce(val, haystack.Number.type$).toFloat(), unit));
        }
        ;
        return haystack.HisItem.make(ts, val);
      }, haystack.HisItem.type$);
      (newItems = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(newItems), sys.Type.find("sys::Obj?[]")));
      rec.hisUpdate(sys.ObjUtil.coerce(newItems, sys.Type.find("haystack::HisItem[]")));
    }
    catch ($_u23) {
      $_u23 = sys.Err.make($_u23);
      if ($_u23 instanceof sys.Err) {
        let e = $_u23;
        ;
        this.folio().log().err(sys.Str.plus("HisMgr.onUpdate: ", rec.id().toZinc()), e);
      }
      else {
        throw $_u23;
      }
    }
    ;
    return;
  }

}

class Loader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#buf = sys.ObjUtil.coerce(sys.Buf.make(4096), sys.Buf.type$);
    this.#reader = LoaderBrioReader.make(this, this.#buf.in());
    this.#refs = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Ref"));
    this.#byId = concurrent.ConcurrentMap.make();
    this.#byHandle = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("hxFolio::LoaderRec"));
    return;
  }

  typeof() { return Loader.type$; }

  #config = null;

  config() { return this.#config; }

  __config(it) { if (it === undefined) return this.#config; else this.#config = it; }

  #buf = null;

  buf(it) {
    if (it === undefined) {
      return this.#buf;
    }
    else {
      this.#buf = it;
      return;
    }
  }

  #reader = null;

  reader(it) {
    if (it === undefined) {
      return this.#reader;
    }
    else {
      this.#reader = it;
      return;
    }
  }

  #refs = null;

  refs(it) {
    if (it === undefined) {
      return this.#refs;
    }
    else {
      this.#refs = it;
      return;
    }
  }

  #byId = null;

  byId(it) {
    if (it === undefined) {
      return this.#byId;
    }
    else {
      this.#byId = it;
      return;
    }
  }

  #byHandle = null;

  byHandle(it) {
    if (it === undefined) {
      return this.#byHandle;
    }
    else {
      this.#byHandle = it;
      return;
    }
  }

  #blobs = null;

  blobs(it) {
    if (it === undefined) {
      return this.#blobs;
    }
    else {
      this.#blobs = it;
      return;
    }
  }

  static make(config) {
    const $self = new Loader();
    Loader.make$($self,config);
    return $self;
  }

  static make$($self,config) {
    ;
    $self.#config = config;
    return;
  }

  load() {
    this.loadBlobs();
    this.loadRecs();
    return this;
  }

  loadBlobs() {
    this.#blobs = hxStore.Store.open(this.#config.dir(), Loader.toStoreConfig(this.#config.opts()));
    return;
  }

  static toStoreConfig(opts) {
    const this$ = this;
    return hxStore.StoreConfig.make((it) => {
      if (opts.has("hisPageSize")) {
        it.__hisPageSize(sys.ObjUtil.coerce(sys.ObjUtil.coerce(opts.trap("hisPageSize", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$).toDuration(), sys.Duration.type$));
      }
      ;
      return;
    });
  }

  loadRecs() {
    const this$ = this;
    this.#blobs.each((b) => {
      try {
        if (sys.ObjUtil.equals(b.meta().size(), 0)) {
          this$.loadRec(b);
        }
        ;
      }
      catch ($_u24) {
        $_u24 = sys.Err.make($_u24);
        if ($_u24 instanceof sys.Err) {
          let e = $_u24;
          ;
          throw this$.err(sys.Str.plus("Cannot load rec blob: ", b), e);
        }
        else {
          throw $_u24;
        }
      }
      ;
      return;
    });
    return;
  }

  loadRec(blob) {
    blob.read(this.#buf);
    let dict = this.#reader.readDict();
    let rec = Rec.make(blob, dict);
    this.#byId.add(rec.id(), rec);
    this.#byHandle.add(sys.ObjUtil.coerce(rec.handle(), sys.Obj.type$.toNullable()), LoaderRec.make(rec));
    return;
  }

  internRef(id) {
    let ref = this.#refs.get(id);
    if (ref == null) {
      (ref = haystack.Ref.fromStr(id));
      if (ref.isRel()) {
        if (this.#config.idPrefix() != null) {
          (ref = ref.toAbs(sys.ObjUtil.coerce(this.#config.idPrefix(), sys.Str.type$)));
          this.#refs.set(id, sys.ObjUtil.coerce(ref, haystack.Ref.type$));
        }
        ;
      }
      ;
      this.#refs.set(ref.id(), sys.ObjUtil.coerce(ref, haystack.Ref.type$));
    }
    ;
    return sys.ObjUtil.coerce(ref, haystack.Ref.type$);
  }

  err(msg,cause) {
    if (cause === undefined) cause = null;
    return folio.LoadErr.make(msg, cause);
  }

}

class LoaderRec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LoaderRec.type$; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  static make(rec) {
    const $self = new LoaderRec();
    LoaderRec.make$($self,rec);
    return $self;
  }

  static make$($self,rec) {
    $self.#rec = rec;
    return;
  }

}

class LoaderBrioReader extends haystack.BrioReader {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LoaderBrioReader.type$; }

  #loader = null;

  loader(it) {
    if (it === undefined) {
      return this.#loader;
    }
    else {
      this.#loader = it;
      return;
    }
  }

  static make(l,in$) {
    const $self = new LoaderBrioReader();
    LoaderBrioReader.make$($self,l,in$);
    return $self;
  }

  static make$($self,l,in$) {
    haystack.BrioReader.make$($self, in$);
    $self.#loader = l;
    return;
  }

  internRef(id,dis) {
    return this.#loader.internRef(id);
  }

}

class DisMgr extends HxFolioMgr {
  constructor() {
    super();
    const this$ = this;
    this.#updateAllCount = concurrent.AtomicInt.make();
    return;
  }

  typeof() { return DisMgr.type$; }

  #updateAllCount = null;

  updateAllCount() { return this.#updateAllCount; }

  __updateAllCount(it) { if (it === undefined) return this.#updateAllCount; else this.#updateAllCount = it; }

  static #updateAllMsg = undefined;

  static updateAllMsg() {
    if (DisMgr.#updateAllMsg === undefined) {
      DisMgr.static$init();
      if (DisMgr.#updateAllMsg === undefined) DisMgr.#updateAllMsg = null;
    }
    return DisMgr.#updateAllMsg;
  }

  static make($folio) {
    const $self = new DisMgr();
    DisMgr.make$($self,$folio);
    return $self;
  }

  static make$($self,$folio) {
    const this$ = $self;
    HxFolioMgr.makeCoalescing$($self, $folio, sys.ObjUtil.coerce((m) => {
      return m.coalesceKey();
    }, sys.Type.find("|sys::Obj?->sys::Obj?|?")), null);
    ;
    return;
  }

  updateAll() {
    return this.send(DisMgr.updateAllMsg());
  }

  update(rec) {
    let newDis = rec.dict().dis();
    let oldDis = rec.id().disVal();
    if (sys.ObjUtil.equals(oldDis, newDis)) {
      return;
    }
    ;
    this.setDis(rec, sys.ObjUtil.coerce(newDis, sys.Str.type$));
    this.updateAll();
    return;
  }

  onReceive(msg) {
    try {
      let $_u25 = msg.id();
      if (sys.ObjUtil.equals($_u25, MsgId.disUpdateAll())) {
        return this.onUpdateAll();
      }
      else {
        return HxFolioMgr.prototype.onReceive.call(this, msg);
      }
      ;
    }
    catch ($_u26) {
      $_u26 = sys.Err.make($_u26);
      if ($_u26 instanceof sys.Err) {
        let e = $_u26;
        ;
        this.log().err(sys.Str.plus("DisMgr ", msg.id()), e);
        throw e;
      }
      else {
        throw $_u26;
      }
    }
    ;
  }

  onUpdateAll() {
    const this$ = this;
    this.#updateAllCount.getAndIncrement();
    let cache = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("sys::Str"));
    this.folio().index().byId().each(sys.ObjUtil.coerce((rec) => {
      this$.setDis(rec, this$.toDis(cache, rec.id()));
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    return sys.Str.plus("updateAll ", sys.ObjUtil.coerce(cache.size(), sys.Obj.type$.toNullable()));
  }

  toDis(cache,id) {
    let x = cache.get(id);
    if (x == null) {
      cache.set(id, sys.ObjUtil.coerce((x = id.id()), sys.Str.type$));
      try {
        cache.set(id, sys.ObjUtil.coerce((x = this.computeDis(cache, id)), sys.Str.type$));
      }
      catch ($_u27) {
        $_u27 = sys.Err.make($_u27);
        if ($_u27 instanceof sys.Err) {
          let e = $_u27;
          ;
          e.trace();
        }
        else {
          throw $_u27;
        }
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(x, sys.Str.type$);
  }

  computeDis(cache,id) {
    let rec = this.folio().index().rec(id, false);
    if (rec != null) {
      let dict = rec.dict();
      let disMacro = sys.ObjUtil.as(dict.get("disMacro", null), sys.Str.type$);
      return sys.ObjUtil.coerce(((this$) => { if (disMacro != null) return DisMgrMacro.make(sys.ObjUtil.coerce(disMacro, sys.Str.type$), dict, this$, cache).apply(); return dict.dis(null, null); })(this), sys.Str.type$);
    }
    ;
    return id.id();
  }

  setDis(rec,dis) {
    rec.id().disVal(dis);
    return;
  }

  static static$init() {
    DisMgr.#updateAllMsg = Msg.make(MsgId.disUpdateAll());
    return;
  }

}

class DisMgrMacro extends haystack.Macro {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DisMgrMacro.type$; }

  #mgr = null;

  mgr(it) {
    if (it === undefined) {
      return this.#mgr;
    }
    else {
      this.#mgr = it;
      return;
    }
  }

  #cache = null;

  cache(it) {
    if (it === undefined) {
      return this.#cache;
    }
    else {
      this.#cache = it;
      return;
    }
  }

  static make(p,s,m,c) {
    const $self = new DisMgrMacro();
    DisMgrMacro.make$($self,p,s,m,c);
    return $self;
  }

  static make$($self,p,s,m,c) {
    haystack.Macro.make$($self, p, s);
    $self.#mgr = m;
    $self.#cache = c;
    return;
  }

  refToDis(ref) {
    return this.#mgr.toDis(this.#cache, ref);
  }

}

class DebugMgr extends HxFolioMgr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DebugMgr.type$; }

  static make($folio) {
    const $self = new DebugMgr();
    DebugMgr.make$($self,$folio);
    return $self;
  }

  static make$($self,$folio) {
    HxFolioMgr.make$($self, $folio);
    return;
  }

  recBlobs(ids) {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.addCol("id").addCol("blobHandle").addCol("blobSize");
    ids.each((id) => {
      let rec = this$.folio().index().rec(id, false);
      if (rec == null) {
        return;
      }
      ;
      let blob = rec.blob();
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [id, sys.ObjUtil.toStr(blob), haystack.Number.makeInt(blob.size(), haystack.Number.byte())]));
      return;
    });
    return gb.toGrid();
  }

  dump(out) {
    const this$ = this;
    out.printLine("--- Summary ---");
    this.folio().stats().debugSummary().each((row) => {
      out.print(row.get("dis")).print(": ").printLine(row.get("val"));
      return;
    });
    out.printLine();
    out.printLine("--- Page Size Distribution ---");
    out.printLine("pageSize   numFiles       numBlobs");
    this.folio().store().blobs().pageFileDistribution().each((line) => {
      let toks = sys.Str.split(line, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
      let pageSize = sys.Str.padl(sys.Int.toLocale(sys.ObjUtil.coerce(sys.Str.toInt(toks.get(0)), sys.Int.type$), "B"), 8);
      let numFiles = sys.Str.padl(sys.Int.toLocale(sys.ObjUtil.coerce(sys.Str.toInt(toks.get(1)), sys.Int.type$)), 10);
      let numBlobs = sys.Str.padl(sys.Int.toLocale(sys.ObjUtil.coerce(sys.Str.toInt(toks.get(2)), sys.Int.type$)), 14);
      out.print(pageSize).print(" ").print(numFiles).print(" ").printLine(numBlobs);
      return;
    });
    out.printLine();
    out.printLine("--- ActorPool ---");
    sys.ObjUtil.trap(this.folio().config().pool(),"dump", sys.List.make(sys.Obj.type$.toNullable(), [out]));
    out.printLine();
    out.printLine("--- IndexMgr ---");
    this.folio().index().debugDump(out);
    out.printLine();
    out.printLine("--- StoreMgr ---");
    this.folio().store().debugDump(out);
    return;
  }

}

class HisMgr extends HxFolioMgr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisMgr.type$; }

  static make($folio) {
    const $self = new HisMgr();
    HisMgr.make$($self,$folio);
    return $self;
  }

  static make$($self,$folio) {
    HxFolioMgr.make$($self, $folio);
    return;
  }

  read(id,span,opts,f) {
    const this$ = this;
    this.folio().checkRead();
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    let rec = this.folio().index().rec(id);
    let cx = folio.FolioContext.curFolio(false);
    if ((cx != null && !cx.canRead(rec.dict()))) {
      throw haystack.PermissionErr.make(sys.Str.plus("Cannot read: ", id.toCode()));
    }
    ;
    let dict = rec.dict();
    if ((dict.missing("point") || dict.missing("his"))) {
      throw folio.HisConfigErr.make(dict, "Not tagged as his point");
    }
    ;
    if (dict.has("aux")) {
      throw folio.HisConfigErr.make(dict, "Cannot read aux point");
    }
    ;
    if (dict.has("trash")) {
      throw folio.HisConfigErr.make(dict, "Cannot read from trash");
    }
    ;
    let items = rec.hisItems();
    if (span == null) {
      items.each(f);
    }
    else {
      let prev = null;
      let next = 0;
      items.each((item) => {
        if (sys.ObjUtil.compareLT(item.ts(), span.start())) {
          (prev = item);
        }
        else {
          if (sys.ObjUtil.compareGE(item.ts(), span.end())) {
            if (sys.ObjUtil.compareLT(next, 2)) {
              sys.Func.call(f, item);
              ((this$) => { let $_u29 = next;next = sys.Int.increment(next); return $_u29; })(this$);
            }
            ;
          }
          else {
            if (prev != null) {
              sys.Func.call(f, sys.ObjUtil.coerce(prev, haystack.HisItem.type$));
              (prev = null);
            }
            ;
            sys.Func.call(f, item);
          }
          ;
        }
        ;
        return;
      });
    }
    ;
    return;
  }

  write(id,items,opts) {
    if (opts === undefined) opts = null;
    this.folio().checkWrite();
    (opts = haystack.Etc.dictSet(opts, "unitSet", haystack.Marker.val()));
    if (items.isEmpty()) {
      return sys.ObjUtil.coerce(folio.FolioFuture.makeSync(folio.HisWriteFolioRes.empty()), folio.FolioFuture.type$);
    }
    ;
    let rec = this.folio().index().rec(id);
    let dict = rec.dict();
    (items = folio.FolioUtil.hisWriteCheck(dict, items, sys.ObjUtil.coerce(opts, haystack.Dict.type$)));
    let cx = folio.FolioContext.curFolio(false);
    if ((cx != null && !cx.canWrite(rec.dict()))) {
      throw haystack.PermissionErr.make(sys.Str.plus("Cannot write: ", id.toCode()));
    }
    ;
    return sys.ObjUtil.coerce(folio.FolioFuture.makeAsync(this.folio().index().hisWrite(sys.ObjUtil.coerce(rec, Rec.type$), items, opts, ((this$) => { let $_u30 = cx; if ($_u30 == null) return null; return cx.commitInfo(); })(this))), folio.FolioFuture.type$);
  }

}

class HisEvent extends folio.FolioHisEvent {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisEvent.type$; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  #result = null;

  result() { return this.#result; }

  __result(it) { if (it === undefined) return this.#result; else this.#result = it; }

  #cxInfo = null;

  cxInfo() { return this.#cxInfo; }

  __cxInfo(it) { if (it === undefined) return this.#cxInfo; else this.#cxInfo = it; }

  static make(rec,result,cxInfo) {
    const $self = new HisEvent();
    HisEvent.make$($self,rec,result,cxInfo);
    return $self;
  }

  static make$($self,rec,result,cxInfo) {
    folio.FolioHisEvent.make$($self);
    $self.#rec = rec;
    $self.#result = result;
    $self.#cxInfo = ((this$) => { let $_u31 = cxInfo; if ($_u31 == null) return null; return sys.ObjUtil.toImmutable(cxInfo); })($self);
    return;
  }

}

class Commit extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    return;
  }

  typeof() { return Commit.type$; }

  #folio = null;

  folio() { return this.#folio; }

  __folio(it) { if (it === undefined) return this.#folio; else this.#folio = it; }

  #index = null;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #store = null;

  store() { return this.#store; }

  __store(it) { if (it === undefined) return this.#store; else this.#store = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #isTransient = false;

  isTransient() { return this.#isTransient; }

  __isTransient(it) { if (it === undefined) return this.#isTransient; else this.#isTransient = it; }

  #inDiff = null;

  inDiff() { return this.#inDiff; }

  __inDiff(it) { if (it === undefined) return this.#inDiff; else this.#inDiff = it; }

  #oldRec = null;

  oldRec() { return this.#oldRec; }

  __oldRec(it) { if (it === undefined) return this.#oldRec; else this.#oldRec = it; }

  #oldDict = null;

  oldDict() { return this.#oldDict; }

  __oldDict(it) { if (it === undefined) return this.#oldDict; else this.#oldDict = it; }

  #oldMod = null;

  oldMod() { return this.#oldMod; }

  __oldMod(it) { if (it === undefined) return this.#oldMod; else this.#oldMod = it; }

  #newMod = null;

  newMod() { return this.#newMod; }

  __newMod(it) { if (it === undefined) return this.#newMod; else this.#newMod = it; }

  #newTicks = 0;

  newTicks() { return this.#newTicks; }

  __newTicks(it) { if (it === undefined) return this.#newTicks; else this.#newTicks = it; }

  #cxInfo = null;

  cxInfo() { return this.#cxInfo; }

  __cxInfo(it) { if (it === undefined) return this.#cxInfo; else this.#cxInfo = it; }

  #event = null;

  // private field reflection only
  __event(it) { if (it === undefined) return this.#event; else this.#event = it; }

  #newIds = null;

  // private field reflection only
  __newIds(it) { if (it === undefined) return this.#newIds; else this.#newIds = it; }

  #tags = null;

  // private field reflection only
  __tags(it) { if (it === undefined) return this.#tags; else this.#tags = it; }

  #hisTagsModified = false;

  // private field reflection only
  __hisTagsModified(it) { if (it === undefined) return this.#hisTagsModified; else this.#hisTagsModified = it; }

  #newRec = null;

  // private field reflection only
  __newRec(it) { if (it === undefined) return this.#newRec; else this.#newRec = it; }

  #outDiff = null;

  // private field reflection only
  __outDiff(it) { if (it === undefined) return this.#outDiff; else this.#outDiff = it; }

  static make($folio,diff,newMod,newTicks,newIds,cxInfo) {
    const $self = new Commit();
    Commit.make$($self,$folio,diff,newMod,newTicks,newIds,cxInfo);
    return $self;
  }

  static make$($self,$folio,diff,newMod,newTicks,newIds,cxInfo) {
    ;
    $self.#folio = $folio;
    $self.#index = $folio.index();
    $self.#store = $folio.store();
    $self.#inDiff = diff;
    $self.#isTransient = diff.isTransient();
    $self.#oldMod = $self.#inDiff.oldMod();
    $self.#newMod = sys.ObjUtil.coerce(((this$) => { if (diff.isTransient()) return this$.#oldMod; return newMod; })($self), sys.DateTime.type$);
    $self.#newTicks = newTicks;
    $self.#newIds = newIds;
    $self.#cxInfo = ((this$) => { let $_u33 = cxInfo; if ($_u33 == null) return null; return sys.ObjUtil.toImmutable(cxInfo); })($self);
    $self.#oldRec = $self.#index.rec(diff.id(), false);
    if ($self.#oldRec == null) {
      $self.#id = $self.normRef(diff.id());
    }
    else {
      $self.#id = $self.#oldRec.id();
      $self.#oldDict = $self.#oldRec.dict();
    }
    ;
    $self.#event = CommitEvent.make(diff, $self.#oldDict, cxInfo);
    return;
  }

  verify() {
    const this$ = this;
    if (this.#inDiff.isAdd()) {
      if (this.#oldRec != null) {
        throw folio.CommitErr.make(sys.Str.plus("Rec already exists: ", this.#id));
      }
      ;
    }
    else {
      if (this.#oldRec == null) {
        throw folio.CommitErr.make(sys.Str.plus("Rec not found: ", this.#id));
      }
      ;
      if ((!this.#inDiff.isForce() && sys.ObjUtil.compareNE(this.#oldRec.dict().trap("mod", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#oldMod))) {
        throw folio.ConcurrentChangeErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#id), ": "), this.#oldRec.dict().trap("mod", sys.List.make(sys.Obj.type$.toNullable(), []))), " != "), this.#oldMod));
      }
      ;
      this.#inDiff.changes().each((v,n) => {
        if (this$.#isTransient) {
          if (this$.#oldRec.persistent().has(n)) {
            throw folio.CommitErr.make(sys.Str.plus("Cannot update persistent tag transiently: ", n));
          }
          ;
        }
        else {
          if (this$.#oldRec.transient().has(n)) {
            throw folio.CommitErr.make(sys.Str.plus("Cannot update transient tag persistently: ", n));
          }
          ;
        }
        ;
        return;
      });
    }
    ;
    this.#folio.hooks().preCommit(this.#event);
    return;
  }

  apply() {
    this.normTags();
    if (this.#inDiff.isAdd()) {
      this.add();
    }
    else {
      if (this.#inDiff.isRemove()) {
        this.remove();
      }
      else {
        if (this.#isTransient) {
          this.updateTransient();
        }
        else {
          this.updatePersistent();
        }
        ;
      }
      ;
    }
    ;
    this.#outDiff = folio.Diff.makeAll(this.#id, this.#oldMod, this.#oldDict, this.#newMod, ((this$) => { let $_u34 = this$.#newRec; if ($_u34 == null) return null; return this$.#newRec.dict(); })(this), this.#inDiff.changes(), this.#inDiff.flags());
    this.#event.diff(sys.ObjUtil.coerce(this.#outDiff, folio.Diff.type$));
    this.#folio.hooks().postCommit(this.#event);
    let stats = ((this$) => { if (this$.#isTransient) return this$.#folio.stats().commitsTransient(); return this$.#folio.stats().commitsPersistent(); })(this);
    stats.add(sys.Int.minus(sys.Duration.nowTicks(), this.#newTicks));
    return sys.ObjUtil.coerce(this.#outDiff, folio.Diff.type$);
  }

  normTags() {
    const this$ = this;
    this.#inDiff.changes().each((v,n) => {
      if ((sys.ObjUtil.equals(n, "tz") || sys.ObjUtil.equals(n, "unit"))) {
        this$.#hisTagsModified = true;
      }
      ;
      this$.#tags.set(n, sys.ObjUtil.coerce(this$.normVal(v), sys.Obj.type$));
      return;
    });
    return;
  }

  normVal(tag) {
    if (tag == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(tag, haystack.Ref.type$)) {
      return this.normRef(sys.ObjUtil.coerce(tag, haystack.Ref.type$));
    }
    ;
    if (sys.ObjUtil.is(tag, sys.Type.find("sys::List"))) {
      return this.normList(sys.ObjUtil.coerce(tag, sys.Type.find("sys::Obj?[]")));
    }
    ;
    if (sys.ObjUtil.is(tag, haystack.Dict.type$)) {
      return this.normDict(sys.ObjUtil.coerce(tag, haystack.Dict.type$));
    }
    ;
    return tag;
  }

  normList(list) {
    let acc = list.dup();
    for (let i = 0; sys.ObjUtil.compareLT(i, acc.size()); i = sys.Int.increment(i)) {
      acc.set(i, this.normVal(acc.get(i)));
    }
    ;
    return acc;
  }

  normDict(dict) {
    const this$ = this;
    let hasRef = dict.eachWhile((v,n) => {
      return ((this$) => { if (sys.ObjUtil.is(v, haystack.Ref.type$)) return "yes"; return null; })(this$);
    });
    if (hasRef == null) {
      return dict;
    }
    ;
    return haystack.Etc.dictMap(dict, (v,n) => {
      return this$.normVal(v);
    });
  }

  normRef(ref) {
    (ref = this.#folio.toAbsRef(ref));
    let rec = this.#index.rec(ref, false);
    if (rec != null) {
      return rec.id();
    }
    ;
    if (this.#newIds != null) {
      let newId = this.#newIds.get(ref);
      if (newId != null) {
        return sys.ObjUtil.coerce(newId, haystack.Ref.type$);
      }
      ;
    }
    ;
    (ref = ref.noDis());
    return ref;
  }

  add() {
    const this$ = this;
    this.#tags = this.#tags.findAll((v) => {
      return sys.ObjUtil.compareNE(v, haystack.Remove.val());
    });
    this.#tags.set("id", this.#id);
    this.#tags.set("mod", this.#newMod);
    this.#newRec = this.#store.add(haystack.Etc.makeDict(this.#tags));
    Commit.indexAdd(this.#index, sys.ObjUtil.coerce(this.#newRec, Rec.type$));
    return;
  }

  updatePersistent() {
    let acc = this.mergeChanges(this.#oldRec.persistent());
    acc.set("id", this.#oldRec.id());
    acc.set("mod", this.#newMod);
    let newPersistent = haystack.Etc.makeDict(acc);
    this.#newRec = this.#oldRec;
    Commit.indexUpdate(this.#index, sys.ObjUtil.coerce(this.#newRec, Rec.type$), sys.ObjUtil.coerce(this.#oldDict, haystack.Dict.type$), newPersistent, this.#newTicks, this.#tags);
    if (this.#hisTagsModified) {
      this.#index.hisTagsModified(sys.ObjUtil.coerce(this.#newRec, Rec.type$));
    }
    ;
    this.#store.update(sys.ObjUtil.coerce(this.#newRec, Rec.type$));
    return;
  }

  updateTransient() {
    let newTransient = haystack.Etc.makeDict(this.mergeChanges(this.#oldRec.transient()));
    this.#newRec = this.#oldRec;
    this.#newRec.updateDict(this.#newRec.persistent(), newTransient, this.#newTicks);
    return;
  }

  mergeChanges(orig) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    orig.each((v,n) => {
      acc.set(n, v);
      return;
    });
    this.#tags.each((v,n) => {
      if (v === haystack.Remove.val()) {
        acc.remove(n);
      }
      else {
        acc.set(n, v);
      }
      ;
      return;
    });
    return acc;
  }

  remove() {
    Commit.indexRemove(this.#index, sys.ObjUtil.coerce(this.#oldRec, Rec.type$));
    this.#store.remove(sys.ObjUtil.coerce(this.#oldRec, Rec.type$));
    return;
  }

  static indexAdd(index,newRec) {
    index.byId().add(newRec.id(), newRec);
    return;
  }

  static indexUpdate(index,rec,oldDict,newDict,newTicks,tags) {
    let oldIsTrash = rec.isTrash();
    rec.updateDict(newDict, rec.transient(), newTicks);
    let newIsTrash = rec.isTrash();
    index.folio().disMgr().update(rec);
    return;
  }

  static indexRemove(index,rec) {
    let $folio = index.folio();
    let dict = rec.persistent();
    rec.id().disVal(null);
    index.byId().remove(rec.id());
    $folio.disMgr().updateAll();
    return;
  }

}

class CommitEvent extends folio.FolioCommitEvent {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommitEvent.type$; }

  #diff = null;

  diff(it) {
    if (it === undefined) {
      return this.#diff;
    }
    else {
      this.#diff = it;
      return;
    }
  }

  #oldRec = null;

  oldRec(it) {
    if (it === undefined) {
      return this.#oldRec;
    }
    else {
      this.#oldRec = it;
      return;
    }
  }

  #cxInfo = null;

  cxInfo(it) {
    if (it === undefined) {
      return this.#cxInfo;
    }
    else {
      this.#cxInfo = it;
      return;
    }
  }

  static make(diff,oldRec,cxInfo) {
    const $self = new CommitEvent();
    CommitEvent.make$($self,diff,oldRec,cxInfo);
    return $self;
  }

  static make$($self,diff,oldRec,cxInfo) {
    folio.FolioCommitEvent.make$($self);
    $self.diff(diff);
    $self.oldRec(oldRec);
    $self.cxInfo(cxInfo);
    return;
  }

}

class BackupMgr extends HxFolioMgr {
  constructor() {
    super();
    const this$ = this;
    this.#lastRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return BackupMgr.type$; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #lastRef = null;

  lastRef() { return this.#lastRef; }

  __lastRef(it) { if (it === undefined) return this.#lastRef; else this.#lastRef = it; }

  static make($folio) {
    const $self = new BackupMgr();
    BackupMgr.make$($self,$folio);
    return $self;
  }

  static make$($self,$folio) {
    HxFolioMgr.make$($self, $folio);
    ;
    $self.#dir = $folio.dir().plus(sys.Uri.fromStr("../backup/"));
    return;
  }

  list() {
    const this$ = this;
    let acc = sys.List.make(folio.FolioBackupFile.type$);
    this.#dir.list().each((f) => {
      if ((f.isDir() || sys.ObjUtil.compareNE(f.ext(), "zip"))) {
        return;
      }
      ;
      try {
        let s = f.basename();
        let date = sys.Date.make(sys.Int.plus(2000, sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.getRange(s, sys.Range.make(-13, -12))), sys.Int.type$)), sys.Month.vals().get(sys.Int.minus(sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.getRange(s, sys.Range.make(-11, -10))), sys.Int.type$), 1)), sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.getRange(s, sys.Range.make(-9, -8))), sys.Int.type$));
        let time = sys.Time.make(sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.getRange(s, sys.Range.make(-6, -5))), sys.Int.type$), sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.getRange(s, sys.Range.make(-4, -3))), sys.Int.type$), sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.getRange(s, sys.Range.make(-2, -1))), sys.Int.type$));
        let ts = date.toDateTime(sys.ObjUtil.coerce(time, sys.Time.type$));
        acc.add(folio.FolioBackupFile.make(f, ts));
      }
      catch ($_u37) {
      }
      ;
      return;
    });
    return acc.sortr((a,b) => {
      return sys.ObjUtil.compare(a.ts(), b.ts());
    });
  }

  monitor() {
    return this.curBackup();
  }

  create() {
    const this$ = this;
    let ts = sys.DateTime.now(null).toLocale("YYMMDD-hhmmss");
    let file = this.#dir.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.folio().name()), "-"), ts), ".zip")));
    if (file.exists()) {
      throw sys.IOErr.make(sys.Str.plus("Backup file already exists: ", file));
    }
    ;
    this.log().info(sys.Str.plus(sys.Str.plus("Backup ", sys.Str.toCode(file.name())), " ..."));
    let bm = this.kickoff(file, sys.Map.__fromLiteral(["pathPrefix","futureResult"], [sys.Str.toUri(sys.Str.plus(sys.Str.plus("", file.basename()), "/db/")),folio.BackupFolioRes.make()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.#lastRef.val(bm);
    bm.onComplete((x) => {
      let dur = x.endTime().minusDateTime(x.startTime());
      if (x.err() == null) {
        this$.log().info(sys.Str.plus(sys.Str.plus("Backup completed [", sys.Int.toLocale(sys.ObjUtil.coerce(x.file().size(), sys.Int.type$), "B")), sys.Str.plus(sys.Str.plus(", ", dur.toLocale()), "]")));
      }
      else {
        this$.log().err("Backup failed", x.err());
      }
      ;
      return;
    });
    return sys.ObjUtil.coerce(folio.FolioFuture.makeAsync(bm.future()), folio.FolioFuture.type$);
  }

  status() {
    let bm = this.curBackup();
    if (bm != null) {
      return sys.Str.plus(sys.Str.plus("Backup in progress [", sys.ObjUtil.coerce(bm.progress(), sys.Obj.type$.toNullable())), "%]");
    }
    ;
    (bm = sys.ObjUtil.coerce(this.#lastRef.val(), hxStore.BackupMonitor.type$.toNullable()));
    if ((bm != null && bm.err() != null)) {
      return sys.Str.plus("Backup error: ", bm.err().toStr());
    }
    ;
    let last = this.list().first();
    if (last != null) {
      let ts = last.ts();
      let when = ((this$) => { if (sys.ObjUtil.equals(ts.date(), sys.Date.today())) return sys.Str.plus("today at ", ts.time().toLocale()); return ts.date().toLocale(); })(this);
      return sys.Str.plus("Last backup was ", when);
    }
    ;
    return "No backups";
  }

  summary(b) {
    let bm = this.curBackup();
    if ((bm != null && sys.ObjUtil.equals(bm.file().name(), b.file().name()))) {
      return sys.Str.plus(sys.Str.plus("Backup in progress [", sys.ObjUtil.coerce(bm.progress(), sys.Obj.type$.toNullable())), "%]");
    }
    ;
    return haystack.Etc.tsToDis(b.ts());
  }

  curBackup() {
    return this.folio().store().blobs().backup(null, null);
  }

  kickoff(zip,opts) {
    if (opts === undefined) opts = null;
    return this.folio().store().blobs().backup(zip, opts);
  }

}

class HxFolio extends folio.Folio {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxFolio.type$; }

  #passwords = null;

  passwords() { return this.#passwords; }

  __passwords(it) { if (it === undefined) return this.#passwords; else this.#passwords = it; }

  #index = null;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #store = null;

  store() { return this.#store; }

  __store(it) { if (it === undefined) return this.#store; else this.#store = it; }

  #disMgr = null;

  disMgr() { return this.#disMgr; }

  __disMgr(it) { if (it === undefined) return this.#disMgr; else this.#disMgr = it; }

  #debug = null;

  debug() { return this.#debug; }

  __debug(it) { if (it === undefined) return this.#debug; else this.#debug = it; }

  #stats = null;

  stats() { return this.#stats; }

  __stats(it) { if (it === undefined) return this.#stats; else this.#stats = it; }

  #backup = null;

  backup() { return this.#backup; }

  __backup(it) { if (it === undefined) return this.#backup; else this.#backup = it; }

  #his = null;

  his() { return this.#his; }

  __his(it) { if (it === undefined) return this.#his; else this.#his = it; }

  #mgrsByName = null;

  mgrsByName() { return this.#mgrsByName; }

  __mgrsByName(it) { if (it === undefined) return this.#mgrsByName; else this.#mgrsByName = it; }

  #flushMode = null;

  flushMode(it) {
    if (it === undefined) {
      return this.#store.blobs().flushMode();
    }
    else {
      this.#store.blobs().flushMode(it);
      return;
    }
  }

  static open(config) {
    let loader = Loader.make(config);
    loader.load();
    return HxFolio.make(loader);
  }

  static make(loader) {
    const $self = new HxFolio();
    HxFolio.make$($self,loader);
    return $self;
  }

  static make$($self,loader) {
    folio.Folio.make$($self, loader.config());
    $self.#passwords = folio.PasswordStore.open($self.dir().plus(sys.Uri.fromStr("passwords.props")), $self.config());
    $self.#debug = DebugMgr.make($self);
    $self.#index = IndexMgr.make($self, loader);
    $self.#store = StoreMgr.make($self, loader);
    $self.#disMgr = DisMgr.make($self);
    $self.#stats = StatsMgr.make($self);
    $self.#backup = BackupMgr.make($self);
    $self.#his = HisMgr.make($self);
    $self.#mgrsByName = sys.ObjUtil.coerce(((this$) => { let $_u39 = this$.initMgrsByName(); if ($_u39 == null) return null; return sys.ObjUtil.toImmutable(this$.initMgrsByName()); })($self), sys.Type.find("[sys::Str:hxFolio::HxFolioMgr]"));
    $self.#disMgr.updateAll().get(null);
    return;
  }

  initMgrsByName() {
    return sys.Map.__fromLiteral(["debug","index","store","dis","stats","backup"], [this.#debug,this.#index,this.#store,this.#disMgr,this.#stats,this.#stats], sys.Type.find("sys::Str"), sys.Type.find("hxFolio::HxFolioMgr"));
  }

  diags() {
    return this.#stats.diags();
  }

  curVer() {
    return this.#store.blobs().ver();
  }

  rec(id,checked) {
    if (checked === undefined) checked = true;
    return this.#index.rec(id, checked);
  }

  toAbsRef(ref) {
    if ((ref.isRel() && this.idPrefix() != null)) {
      return ref.toAbs(sys.ObjUtil.coerce(this.idPrefix(), sys.Str.type$));
    }
    ;
    return ref;
  }

  flush() {
    this.#store.blobs().flush();
    return;
  }

  sync(timeout,mgr) {
    if (timeout === undefined) timeout = null;
    if (mgr === undefined) mgr = null;
    let msg = Msg.make(MsgId.sync());
    if (mgr == null) {
      this.doSync(msg).get(timeout);
    }
    else {
      this.#mgrsByName.getChecked(sys.ObjUtil.coerce(mgr, sys.Str.type$)).send(msg).get(timeout);
    }
    ;
    return this;
  }

  doCloseAsync() {
    let msg = Msg.make(MsgId.close());
    return sys.ObjUtil.coerce(folio.FolioFuture.makeAsync(this.doSync(msg)), folio.FolioFuture.type$);
  }

  doSync(msg) {
    let f = this.#index.send(msg);
    (f = this.#store.sendWhenComplete(f, msg));
    return f;
  }

  doReadByIds(ids) {
    const this$ = this;
    let cx = folio.FolioContext.curFolio(false);
    let errMsg = "";
    let dicts = sys.List.make(haystack.Dict.type$.toNullable());
    dicts.size(ids.size());
    ids.each((id,i) => {
      let rec = this$.#index.rec(id, false);
      if ((rec != null && !rec.isTrash())) {
        let dict = rec.dict();
        if ((cx != null && !cx.canRead(dict))) {
          (errMsg = sys.Str.plus("No read permission: ", id.toStr()));
        }
        else {
          dicts.set(i, dict);
        }
        ;
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
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    let cx = folio.FolioContext.curFolio(false);
    let dicts = Query.make(this, filter, sys.ObjUtil.coerce(opts, haystack.Dict.type$)).collect(cx);
    return sys.ObjUtil.coerce(folio.FolioFuture.makeSync(folio.ReadFolioRes.make(filter, false, dicts)), folio.FolioFuture.type$);
  }

  doReadAllEachWhile(filter,opts,f) {
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    let cx = folio.FolioContext.curFolio(false);
    return Query.make(this, filter, sys.ObjUtil.coerce(opts, haystack.Dict.type$)).eachWhile(cx, f);
  }

  doReadCount(filter,opts) {
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    let cx = folio.FolioContext.curFolio(false);
    return Query.make(this, filter, sys.ObjUtil.coerce(opts, haystack.Dict.type$)).count(cx);
  }

  doCommitAllAsync(diffs,cxInfo) {
    const this$ = this;
    (diffs = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(diffs), sys.Type.find("folio::Diff[]")));
    folio.FolioUtil.checkDiffs(diffs);
    let cx = folio.FolioContext.curFolio(false);
    if (cx != null) {
      diffs.each((diff) => {
        this$.checkCanWrite(sys.ObjUtil.coerce(cx, folio.FolioContext.type$), diff);
        return;
      });
    }
    ;
    let newIds = null;
    diffs.each((diff) => {
      if (!diff.isAdd()) {
        return;
      }
      ;
      if (newIds == null) {
        (newIds = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Ref")));
      }
      ;
      let id = this$.toAbsRef(diff.id());
      newIds.set(id, id);
      return;
    });
    return sys.ObjUtil.coerce(folio.FolioFuture.makeAsync(this.#index.send(Msg.make(MsgId.commit(), diffs, newIds, cxInfo))), folio.FolioFuture.type$);
  }

  checkCanWrite(cx,diff) {
    let id = diff.id();
    let rec = this.#index.dict(id, false);
    if (rec == null) {
      return;
    }
    ;
    if (!cx.canWrite(sys.ObjUtil.coerce(rec, haystack.Dict.type$))) {
      throw haystack.PermissionErr.make(sys.Str.plus("Cannot write: ", id.toCode()));
    }
    ;
    return;
  }

  readByIdPersistentTags(id,checked) {
    if (checked === undefined) checked = true;
    return ((this$) => { let $_u40 = this$.rec(id, checked); if ($_u40 == null) return null; return this$.rec(id, checked).persistent(); })(this);
  }

  readByIdTransientTags(id,checked) {
    if (checked === undefined) checked = true;
    return ((this$) => { let $_u41 = this$.rec(id, checked); if ($_u41 == null) return null; return this$.rec(id, checked).transient(); })(this);
  }

  debugDump(out) {
    this.#debug.dump(out);
    return;
  }

}

class WhiteboxTest extends haystack.HaystackTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WhiteboxTest.type$; }

  #folio = null;

  folio(it) {
    if (it === undefined) {
      return this.#folio;
    }
    else {
      this.#folio = it;
      return;
    }
  }

  teardown() {
    if (this.#folio != null) {
      this.close();
    }
    ;
    return;
  }

  open() {
    const this$ = this;
    return sys.ObjUtil.coerce(((this$) => { let $_u42 = sys.ObjUtil.coerce(HxFolio.open(folio.FolioConfig.make((it) => {
      it.__dir(this$.tempDir());
      it.__log(sys.Log.get("test"));
      return;
    })), HxFolio.type$.toNullable()); this$.#folio = $_u42; return $_u42; })(this), HxFolio.type$);
  }

  close() {
    if (this.#folio == null) {
      throw sys.Err.make("Folio not open!");
    }
    ;
    this.#folio.close();
    this.#folio = null;
    return;
  }

  reopen() {
    this.close();
    return this.open();
  }

  readById(id) {
    return sys.ObjUtil.coerce(this.#folio.readById(id), haystack.Dict.type$);
  }

  addRec(tags) {
    let dict = haystack.Etc.makeDict(tags);
    let id = dict.get("id");
    if (id != null) {
      (dict = haystack.Etc.dictRemove(dict, "id"));
    }
    else {
      (id = haystack.Ref.gen());
    }
    ;
    return this.doCommit(folio.Diff.makeAdd(dict, sys.ObjUtil.coerce(id, haystack.Ref.type$)));
  }

  commit(rec,changes,flags) {
    if (flags === undefined) flags = 0;
    return this.doCommit(folio.Diff.make(rec, changes, flags));
  }

  doCommit(diff) {
    let stats = ((this$) => { if (diff.isTransient()) return this$.#folio.stats().commitsTransient(); return this$.#folio.stats().commitsPersistent(); })(this);
    let oldCount = stats.count();
    (diff = this.#folio.commit(diff));
    this.verifyEq(sys.ObjUtil.coerce(stats.count(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(oldCount, 1), sys.Obj.type$.toNullable()));
    return sys.ObjUtil.coerce(diff.newRec(), haystack.Dict.type$);
  }

  verifySparksEq(actual,expected) {
    const this$ = this;
    this.sortSparks(expected);
    this.sortSparks(actual);
    this.verifyEq(sys.ObjUtil.coerce(actual.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    expected.each((e,i) => {
      let a = actual.get(i);
      this$.verifyDictEq(e, a);
      return;
    });
    return;
  }

  sortSparks(sparks) {
    const this$ = this;
    sparks.sort((a,b) => {
      let at = a.trap("targetRef", sys.List.make(sys.Obj.type$.toNullable(), []));
      let bt = b.trap("targetRef", sys.List.make(sys.Obj.type$.toNullable(), []));
      if (sys.ObjUtil.compareNE(at, bt)) {
        return sys.ObjUtil.compare(at, bt);
      }
      ;
      let ad = a.trap("date", sys.List.make(sys.Obj.type$.toNullable(), []));
      let bd = b.trap("date", sys.List.make(sys.Obj.type$.toNullable(), []));
      if (sys.ObjUtil.compareNE(ad, bd)) {
        return sys.ObjUtil.compare(ad, bd);
      }
      ;
      return sys.ObjUtil.compare(a.trap("ruleRef", sys.List.make(sys.Obj.type$.toNullable(), [])), b.trap("ruleRef", sys.List.make(sys.Obj.type$.toNullable(), [])));
    });
    return;
  }

  static make() {
    const $self = new WhiteboxTest();
    WhiteboxTest.make$($self);
    return $self;
  }

  static make$($self) {
    haystack.HaystackTest.make$($self);
    return;
  }

}

class DisMgrTest extends WhiteboxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DisMgrTest.type$; }

  test() {
    const this$ = this;
    this.open();
    let disMgr = this.folio().disMgr();
    let b = this.addRec(sys.Map.__fromLiteral(["disMacro","navName","aRef"], ["\$aRef \$navName","B",haystack.Ref.fromStr("foo")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyDis(b, "foo B");
    let a = this.addRec(sys.Map.__fromLiteral(["dis"], ["A"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyDis(a, "A");
    let a2 = this.commit(a, sys.Map.__fromLiteral(["dis"], ["A-2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifySame(a.id(), a2.id());
    this.verifyDis(a2, "A-2");
    this.verifyEq(a.id().dis(), "A-2");
    (b = this.commit(b, sys.Map.__fromLiteral(["aRef","refs"], [haystack.Ref.fromStr(a.id().id()),sys.List.make(sys.Obj.type$.toNullable(), [haystack.Ref.fromStr(a.id().id()), "foo", haystack.Ref.fromStr(b.id().id())])], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))));
    disMgr.sync();
    this.verifySameRef(sys.ObjUtil.coerce(b.trap("aRef", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$), a.id(), "A-2");
    this.verifySameRef(sys.ObjUtil.coerce(sys.ObjUtil.trap(b.trap("refs", sys.List.make(sys.Obj.type$.toNullable(), [])),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])), haystack.Ref.type$), a.id(), "A-2");
    this.verifySameRef(sys.ObjUtil.coerce(sys.ObjUtil.trap(b.trap("refs", sys.List.make(sys.Obj.type$.toNullable(), [])),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())])), haystack.Ref.type$), b.id(), "A-2 B");
    this.verifyDis(b, "A-2 B");
    (b = this.commit(b, sys.Map.__fromLiteral(["navName"], ["B-2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    disMgr.sync();
    this.verifyDis(b, "A-2 B-2");
    this.verifySameRef(sys.ObjUtil.coerce(sys.ObjUtil.trap(b.trap("refs", sys.List.make(sys.Obj.type$.toNullable(), [])),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())])), haystack.Ref.type$), b.id(), "A-2 B-2");
    (a = this.commit(a2, sys.Map.__fromLiteral(["dis"], ["A-3"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    disMgr.sync();
    this.verifyDis(a, "A-3");
    this.verifyDis(b, "A-3 B-2");
    let c = this.addRec(sys.Map.__fromLiteral(["disMacro","aRef","bRef","xRef"], ["a:\$aRef | b:\$bRef | x:\$xRef",a.id(),b.id(),haystack.Ref.fromStr("X")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifySame(c.trap("aRef", sys.List.make(sys.Obj.type$.toNullable(), [])), a.id());
    this.verifySame(c.trap("bRef", sys.List.make(sys.Obj.type$.toNullable(), [])), b.id());
    this.verifyDis(c, "a:A-3 | b:A-3 B-2 | x:X");
    let n1 = this.folio().disMgr().updateAllCount().val();
    this.folio().disMgr().send(Msg.make(MsgId.testSleep(), sys.Duration.fromStr("100ms")));
    sys.Int.times(100, (it) => {
      disMgr.updateAll();
      return;
    });
    disMgr.sync();
    let n2 = disMgr.updateAllCount().val();
    this.verifyEq(sys.ObjUtil.coerce(n1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.minus(n2, 1), sys.Obj.type$.toNullable()));
    this.reopen();
    (disMgr = this.folio().disMgr());
    (a = this.readById(a.id()));
    (b = this.readById(b.id()));
    (c = this.readById(c.id()));
    this.verifySameRef(sys.ObjUtil.coerce(b.trap("aRef", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$), a.id(), "A-3");
    this.verifySameRef(sys.ObjUtil.coerce(c.trap("aRef", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$), a.id(), "A-3");
    this.verifySameRef(sys.ObjUtil.coerce(c.trap("bRef", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$), b.id(), "A-3 B-2");
    this.verifySameRef(sys.ObjUtil.coerce(sys.ObjUtil.trap(b.trap("refs", sys.List.make(sys.Obj.type$.toNullable(), [])),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])), haystack.Ref.type$), a.id(), "A-3");
    this.verifySameRef(sys.ObjUtil.coerce(sys.ObjUtil.trap(b.trap("refs", sys.List.make(sys.Obj.type$.toNullable(), [])),"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())])), haystack.Ref.type$), b.id(), "A-3 B-2");
    this.verifyDis(a, "A-3");
    this.verifyDis(b, "A-3 B-2");
    this.verifyDis(c, "a:A-3 | b:A-3 B-2 | x:X");
    sys.Int.times(20, (i) => {
      this$.folio().commitAll(sys.List.make(folio.Diff.type$, [folio.Diff.make(a, sys.Map.__fromLiteral(["dis"], [sys.Str.plus("A-", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), folio.Diff.make(b, sys.Map.__fromLiteral(["navName"], [sys.Str.plus("B-", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")))]));
      disMgr.sync();
      (a = this$.readById(a.id()));
      (b = this$.readById(b.id()));
      (c = this$.readById(c.id()));
      this$.verifyEq(a.id().dis(), sys.Str.plus("A-", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())));
      this$.verifyEq(b.id().dis(), sys.Str.plus(sys.Str.plus(sys.Str.plus("A-", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " B-"), sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())));
      this$.verifyEq(c.id().dis(), sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("a:A-", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " | b:A-"), sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " B-"), sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " | x:X"));
      return;
    });
    this.folio().commit(folio.Diff.make(a, null, folio.Diff.remove()));
    disMgr.sync();
    (b = this.readById(b.id()));
    (c = this.readById(c.id()));
    this.verifyEq(a.id().disVal(), null);
    this.verifySame(b.trap("aRef", sys.List.make(sys.Obj.type$.toNullable(), [])), a.id());
    this.verifyEq(b.id().dis(), sys.Str.plus(sys.Str.plus("", a.id().id()), " B-19"));
    this.verifyEq(c.id().dis(), sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("a:", a.id().id()), " | b:"), a.id().id()), " B-19 | x:X"));
    this.close();
    return;
  }

  verifySameRef(a,b,dis) {
    this.verifySame(a, b);
    this.verifyEq(a.dis(), dis);
    this.verifyEq(b.dis(), dis);
    return;
  }

  verifyDis(r,dis) {
    this.verifyEq(r.dis(), dis);
    this.verifyEq(r.id().dis(), dis);
    this.verifyEq(r.id().disVal(), dis);
    this.verifyEq(this.folio().readById(r.id()).id().dis(), dis);
    return;
  }

  static make() {
    const $self = new DisMgrTest();
    DisMgrTest.make$($self);
    return $self;
  }

  static make$($self) {
    WhiteboxTest.make$($self);
    return;
  }

}

class StoreMgrTest extends WhiteboxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StoreMgrTest.type$; }

  testWriteNum() {
    const this$ = this;
    this.open();
    let x = this.addRec(sys.Map.__fromLiteral(["dis","n"], ["X",haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let xr = this.folio().index().rec(x.id());
    this.folio().store().sync();
    this.verifyEq(sys.ObjUtil.coerce(xr.numWrites(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    sys.Range.make(1, 3).each((i) => {
      (x = this$.commit(x, sys.Map.__fromLiteral(["n"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(i, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?"))));
      this$.folio().store().sync();
      this$.verifyEq(sys.ObjUtil.coerce(xr.numWrites(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(1, i), sys.Obj.type$.toNullable()));
      return;
    });
    (x = this.readById(x.id()));
    this.verifyEq(x.trap("n", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())));
    (x = this.commit(x, sys.Map.__fromLiteral(["foo"], ["t"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), folio.Diff.transient()));
    this.folio().store().sync();
    this.verifyEq(sys.ObjUtil.coerce(xr.numWrites(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    let y = this.addRec(sys.Map.__fromLiteral(["dis","n"], ["Y",haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let yr = this.folio().index().rec(y.id());
    this.folio().store().sync();
    this.verifyEq(sys.ObjUtil.coerce(yr.numWrites(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.folio().store().send(Msg.make(MsgId.testSleep(), sys.Duration.fromStr("200ms")));
    sys.Int.times(100, (i) => {
      (x = this$.commit(x, sys.Map.__fromLiteral(["n"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(i, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?"))));
      (y = this$.commit(y, sys.Map.__fromLiteral(["n"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Int.plus(i, 100), sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?"))));
      return;
    });
    this.folio().store().sync();
    this.verifyEq(this.readById(x.id()).trap("n", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(99, sys.Num.type$.toNullable())));
    this.verifyEq(this.readById(y.id()).trap("n", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(199, sys.Num.type$.toNullable())));
    this.verifyEq(sys.ObjUtil.coerce(xr.numWrites(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(yr.numWrites(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.reopen();
    (xr = this.folio().index().rec(x.id()));
    (yr = this.folio().index().rec(y.id()));
    this.verifyEq(this.readById(x.id()).trap("n", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(99, sys.Num.type$.toNullable())));
    this.verifyEq(this.readById(y.id()).trap("n", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(199, sys.Num.type$.toNullable())));
    this.verifyEq(sys.ObjUtil.coerce(xr.numWrites(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(yr.numWrites(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    return;
  }

  static make() {
    const $self = new StoreMgrTest();
    StoreMgrTest.make$($self);
    return $self;
  }

  static make$($self) {
    WhiteboxTest.make$($self);
    return;
  }

}

class CommitTest extends WhiteboxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommitTest.type$; }

  test() {
    const this$ = this;
    this.open();
    let a = this.addRec(sys.Map.__fromLiteral(["dis"], ["A"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    (a = this.verifyCommit(a, sys.Map.__fromLiteral(["foo"], ["bar"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), 0, sys.Map.__fromLiteral(["dis","foo"], ["A","bar"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"))));
    (a = this.verifyCommit(a, sys.Map.__fromLiteral(["curVal","curStatus","baz"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(75, sys.Num.type$.toNullable())),"ok",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), folio.Diff.transient(), sys.Map.__fromLiteral(["dis","foo"], ["A","bar"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["curVal","curStatus","baz"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(75, sys.Num.type$.toNullable())),"ok",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))));
    this.verifyCommitErr(a, sys.Map.__fromLiteral(["id"], [haystack.Ref.gen()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Ref")), "never");
    this.verifyCommitErr(a, sys.Map.__fromLiteral(["mod"], [sys.DateTime.nowUtc()], sys.Type.find("sys::Str"), sys.Type.find("sys::DateTime")), "never");
    this.verifyCommitErr(a, sys.Map.__fromLiteral(["hisEnd"], [sys.DateTime.now()], sys.Type.find("sys::Str"), sys.Type.find("sys::DateTime")), "never");
    this.verifyCommitErr(a, sys.Map.__fromLiteral(["dis"], ["A!"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), "persistentOnly");
    this.verifyCommitErr(a, sys.Map.__fromLiteral(["site"], ["A!"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), "persistentOnly");
    this.verifyCommitErr(a, sys.Map.__fromLiteral(["writeVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), "transientOnly");
    this.verifyCommitErr(a, sys.Map.__fromLiteral(["hisStatus"], ["bad"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), "transientOnly");
    this.verifyErr(folio.CommitErr.type$, (it) => {
      this$.commit(a, sys.Map.__fromLiteral(["foo"], ["!"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), folio.Diff.transient());
      return;
    });
    this.verifyErr(folio.CommitErr.type$, (it) => {
      this$.commit(a, sys.Map.__fromLiteral(["foo"], [haystack.Remove.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Remove")), folio.Diff.transient());
      return;
    });
    this.verifyErr(folio.CommitErr.type$, (it) => {
      this$.commit(a, sys.Map.__fromLiteral(["baz"], ["!"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), 0);
      return;
    });
    this.verifyErr(folio.CommitErr.type$, (it) => {
      this$.commit(a, sys.Map.__fromLiteral(["baz"], [haystack.Remove.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Remove")), 0);
      return;
    });
    (a = this.verifyCommit(a, sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), 0, sys.Map.__fromLiteral(["dis","foo"], ["A","bar"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["curVal","curStatus","baz"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(75, sys.Num.type$.toNullable())),"ok",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))));
    (a = this.verifyCommit(a, sys.Map.__fromLiteral(["foo","newP"], [haystack.Remove.val(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), 0, sys.Map.__fromLiteral(["dis","newP"], ["A",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), sys.Map.__fromLiteral(["curVal","curStatus","baz"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(75, sys.Num.type$.toNullable())),"ok",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))));
    (a = this.verifyCommit(a, sys.Map.__fromLiteral(["baz"], [haystack.Remove.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Remove")), folio.Diff.transient(), sys.Map.__fromLiteral(["dis","newP"], ["A",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), sys.Map.__fromLiteral(["curVal","curStatus"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(75, sys.Num.type$.toNullable())),"ok"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))));
    this.reopen();
    (a = this.verifyCommit(a, sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), 0, sys.Map.__fromLiteral(["dis","newP"], ["A",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"))));
    this.close();
    return;
  }

  verifyCommit(rec,changes,flags,persistent,transient) {
    const this$ = this;
    let id = rec.id();
    let r = this.folio().index().rec(rec.id());
    let oldMod = sys.ObjUtil.coerce(rec.trap("mod", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.DateTime.type$);
    let oldTicks = r.ticks();
    let oldPersistent = r.persistent();
    let oldTransient = r.transient();
    let isTransient = sys.ObjUtil.compareNE(flags, 0);
    (rec = sys.ObjUtil.coerce(this.folio().commit(folio.Diff.make(rec, changes, flags)).newRec(), haystack.Dict.type$));
    this.verifySame(rec, this.folio().readById(id));
    this.verifySame(rec, r.dict());
    let newMod = sys.ObjUtil.coerce(rec.trap("mod", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.DateTime.type$);
    let newTicks = r.ticks();
    this.verify(sys.ObjUtil.compareGT(newTicks, oldTicks));
    if (!isTransient) {
      this.verify(sys.ObjUtil.compareGT(newMod, oldMod));
    }
    ;
    this.verifyDictEq(r.persistent(), persistent.dup().add("id", id).add("mod", newMod));
    this.verifyDictEq(r.transient(), transient);
    if (isTransient) {
      this.verifySame(r.persistent(), oldPersistent);
    }
    else {
      this.verifySame(r.transient(), oldTransient);
    }
    ;
    if (transient.isEmpty()) {
      this.verifySame(r.dict(), r.persistent());
    }
    ;
    let merge = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    merge.add("id", id).add("mod", newMod);
    persistent.each((v,n) => {
      merge.add(n, v);
      return;
    });
    transient.each((v,n) => {
      merge.add(n, v);
      return;
    });
    this.verifyDictEq(rec, merge);
    return rec;
  }

  verifyCommitErr(rec,changes,mode) {
    const this$ = this;
    let p = false;
    let t = false;
    let $_u44 = mode;
    if (sys.ObjUtil.equals($_u44, "never")) {
      (p = (t = true));
    }
    else if (sys.ObjUtil.equals($_u44, "persistentOnly")) {
      (t = true);
    }
    else if (sys.ObjUtil.equals($_u44, "transientOnly")) {
      (p = true);
    }
    else {
      this.fail();
    }
    ;
    if (p) {
      this.verifyErr(folio.DiffErr.type$, (it) => {
        this$.commit(rec, changes);
        return;
      });
    }
    ;
    if (t) {
      this.verifyErr(folio.DiffErr.type$, (it) => {
        this$.commit(rec, changes, folio.Diff.transient());
        return;
      });
    }
    ;
    return;
  }

  testTrash() {
    this.open();
    let a = this.addRec(sys.Map.__fromLiteral(["dis","foo"], ["A",haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let b = this.addRec(sys.Map.__fromLiteral(["dis","foo"], ["B",haystack.HaystackTest.n(sys.ObjUtil.coerce(2, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let c = this.addRec(sys.Map.__fromLiteral(["dis","foo","trash"], ["C",haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let d = this.addRec(sys.Map.__fromLiteral(["dis","foo","trash"], ["C",haystack.HaystackTest.n(sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyTrash(a, false);
    this.verifyTrash(b, false);
    this.verifyTrash(c, true);
    this.verifyTrash(d, true);
    this.commit(b, sys.Map.__fromLiteral(["trash"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    this.verifyTrash(a, false);
    this.verifyTrash(b, true);
    this.verifyTrash(c, true);
    this.verifyTrash(d, true);
    this.commit(c, sys.Map.__fromLiteral(["trash"], [haystack.Remove.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Remove")));
    this.verifyTrash(a, false);
    this.verifyTrash(b, true);
    this.verifyTrash(c, false);
    this.verifyTrash(d, true);
    this.reopen();
    this.verifyTrash(a, false);
    this.verifyTrash(b, true);
    this.verifyTrash(c, false);
    this.verifyTrash(d, true);
    this.close();
    return;
  }

  verifyTrash(r,isTrash) {
    (r = sys.ObjUtil.coerce(this.folio().readById(r.id()), haystack.Dict.type$));
    this.verifyEq(sys.ObjUtil.coerce(r.has("trash"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(isTrash, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.folio().index().rec(r.id()).isTrash(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(isTrash, sys.Obj.type$.toNullable()));
    let f = haystack.Filter.fromStr(sys.Str.plus("foo==", r.trap("foo", sys.List.make(sys.Obj.type$.toNullable(), []))));
    if (isTrash) {
      this.verifyEq(sys.ObjUtil.coerce(this.folio().readAll(sys.ObjUtil.coerce(f, haystack.Filter.type$)).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
      this.verifyEq(sys.ObjUtil.coerce(this.folio().readCount(sys.ObjUtil.coerce(f, haystack.Filter.type$)), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
      this.verifyEq(this.folio().read(sys.ObjUtil.coerce(f, haystack.Filter.type$), false), null);
    }
    else {
      this.verifyEq(sys.ObjUtil.coerce(this.folio().readAll(sys.ObjUtil.coerce(f, haystack.Filter.type$)).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
      this.verifyEq(this.folio().readAll(sys.ObjUtil.coerce(f, haystack.Filter.type$)).get(0).trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])), r.id());
      this.verifyEq(sys.ObjUtil.coerce(this.folio().readCount(sys.ObjUtil.coerce(f, haystack.Filter.type$)), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
      this.verifyDictEq(sys.ObjUtil.coerce(this.folio().read(sys.ObjUtil.coerce(f, haystack.Filter.type$), false), haystack.Dict.type$), r);
    }
    ;
    let opts = haystack.Etc.makeDict(sys.Map.__fromLiteral(["trash"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    this.verifyEq(sys.ObjUtil.coerce(this.folio().readAll(sys.ObjUtil.coerce(f, haystack.Filter.type$), opts).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(this.folio().readAll(sys.ObjUtil.coerce(f, haystack.Filter.type$), opts).get(0).trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])), r.id());
    this.verifyEq(sys.ObjUtil.coerce(this.folio().readCount(sys.ObjUtil.coerce(f, haystack.Filter.type$), opts), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    return;
  }

  static make() {
    const $self = new CommitTest();
    CommitTest.make$($self);
    return $self;
  }

  static make$($self) {
    WhiteboxTest.make$($self);
    return;
  }

}

class QueryTest extends WhiteboxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueryTest.type$; }

  #a = null;

  a(it) {
    if (it === undefined) {
      return this.#a;
    }
    else {
      this.#a = it;
      return;
    }
  }

  #b = null;

  b(it) {
    if (it === undefined) {
      return this.#b;
    }
    else {
      this.#b = it;
      return;
    }
  }

  #c = null;

  c(it) {
    if (it === undefined) {
      return this.#c;
    }
    else {
      this.#c = it;
      return;
    }
  }

  #d = null;

  d(it) {
    if (it === undefined) {
      return this.#d;
    }
    else {
      this.#d = it;
      return;
    }
  }

  #e = null;

  e(it) {
    if (it === undefined) {
      return this.#e;
    }
    else {
      this.#e = it;
      return;
    }
  }

  #f = null;

  f(it) {
    if (it === undefined) {
      return this.#f;
    }
    else {
      this.#f = it;
      return;
    }
  }

  #g = null;

  g(it) {
    if (it === undefined) {
      return this.#g;
    }
    else {
      this.#g = it;
      return;
    }
  }

  #h = null;

  h(it) {
    if (it === undefined) {
      return this.#h;
    }
    else {
      this.#h = it;
      return;
    }
  }

  #i = null;

  i(it) {
    if (it === undefined) {
      return this.#i;
    }
    else {
      this.#i = it;
      return;
    }
  }

  #x1 = null;

  x1(it) {
    if (it === undefined) {
      return this.#x1;
    }
    else {
      this.#x1 = it;
      return;
    }
  }

  #x2 = null;

  x2(it) {
    if (it === undefined) {
      return this.#x2;
    }
    else {
      this.#x2 = it;
      return;
    }
  }

  #x3 = null;

  x3(it) {
    if (it === undefined) {
      return this.#x3;
    }
    else {
      this.#x3 = it;
      return;
    }
  }

  test() {
    this.open();
    this.#a = this.addRec(sys.Map.__fromLiteral(["dis","num"], ["A",haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#b = this.addRec(sys.Map.__fromLiteral(["dis","num","fooRef"], ["B",haystack.HaystackTest.n(sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())),this.#a.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#c = this.addRec(sys.Map.__fromLiteral(["dis","num","fooRef","bar"], ["C",haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())),this.#a.id(),"a"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#d = this.addRec(sys.Map.__fromLiteral(["dis","num","fooRef","bar"], ["D",haystack.HaystackTest.n(sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())),this.#a.id(),"b"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#e = this.addRec(sys.Map.__fromLiteral(["dis","num","fooRef","bar"], ["E",haystack.HaystackTest.n(sys.ObjUtil.coerce(5, sys.Num.type$.toNullable())),this.#b.id(),"c"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#f = this.addRec(sys.Map.__fromLiteral(["dis","num","fooRef","bar"], ["F",haystack.HaystackTest.n(sys.ObjUtil.coerce(6, sys.Num.type$.toNullable())),this.#b.id(),"d"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#g = this.addRec(sys.Map.__fromLiteral(["dis","num","baz"], ["G",haystack.HaystackTest.n(sys.ObjUtil.coerce(7, sys.Num.type$.toNullable())),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#x1 = this.addRec(sys.Map.__fromLiteral(["dis","num","fooRef","bar","trash"], ["X1",haystack.HaystackTest.n(sys.ObjUtil.coerce(8, sys.Num.type$.toNullable())),this.#b.id(),"x",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#x2 = this.addRec(sys.Map.__fromLiteral(["dis","num","fooRef","bar","trash"], ["X2",haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())),this.#b.id(),"x",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#x3 = this.addRec(sys.Map.__fromLiteral(["dis","num","fooRef","bar","trash"], ["X3",haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable())),this.#b.id(),"x",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.doTest(false);
    this.#x1 = this.commit(sys.ObjUtil.coerce(this.#x1, haystack.Dict.type$), sys.Map.__fromLiteral(["num","bar"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(11, sys.Num.type$.toNullable())),"c"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#x2 = this.commit(sys.ObjUtil.coerce(this.#x2, haystack.Dict.type$), sys.Map.__fromLiteral(["trash"], [haystack.Remove.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Remove")));
    this.#c = this.commit(sys.ObjUtil.coerce(this.#c, haystack.Dict.type$), sys.Map.__fromLiteral(["trash"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    this.#x2 = this.commit(sys.ObjUtil.coerce(this.#x2, haystack.Dict.type$), sys.Map.__fromLiteral(["trash"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    this.#c = this.commit(sys.ObjUtil.coerce(this.#c, haystack.Dict.type$), sys.Map.__fromLiteral(["trash"], [haystack.Remove.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Remove")));
    this.close();
    return;
  }

  doTest(indexed) {
    this.verifyQuery("outOfThsWorld", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), "fullScan");
    this.verifyQuery("outOfThsWorld and fooBar", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), "fullScan");
    this.verifyQuery("outOfThsWorld or fooBar", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), "fullScan");
    this.verifyQuery(sys.Str.plus("id==", this.#b.id().toCode()), sys.List.make(haystack.Dict.type$.toNullable(), [this.#b]), "byId");
    this.verifyQuery(sys.Str.plus("id==", haystack.Ref.gen().toCode()), sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), "byId");
    this.verifyQuery("id==`uri-not-id`", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), "byId");
    this.verifyQuery(sys.Str.plus(sys.Str.plus("id==", this.#b.id().toCode()), " and num==2"), sys.List.make(haystack.Dict.type$.toNullable(), [this.#b]), "byId");
    this.verifyQuery(sys.Str.plus(sys.Str.plus("id==", this.#b.id().toCode()), " and num!=2"), sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), "byId");
    this.verifyQuery(sys.Str.plus(sys.Str.plus("x and id==", this.#b.id().toCode()), " and y"), sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), "byId");
    this.verifyQuery("num", sys.List.make(haystack.Dict.type$.toNullable(), [this.#a, this.#b, this.#c, this.#d, this.#e, this.#f, this.#g]), ((this$) => { if (indexed) return "tagMatch:num"; return "fullScan"; })(this));
    this.verifyQuery("num > 4", sys.List.make(haystack.Dict.type$.toNullable(), [this.#e, this.#f, this.#g]), ((this$) => { if (indexed) return "tagScan:num"; return "fullScan"; })(this));
    this.verifyQuery("num >= 4", sys.List.make(haystack.Dict.type$.toNullable(), [this.#d, this.#e, this.#f, this.#g]), ((this$) => { if (indexed) return "tagScan:num"; return "fullScan"; })(this));
    this.verifyQuery("num <= 4", sys.List.make(haystack.Dict.type$.toNullable(), [this.#a, this.#b, this.#c, this.#d]), ((this$) => { if (indexed) return "tagScan:num"; return "fullScan"; })(this));
    this.verifyQuery("num < 4", sys.List.make(haystack.Dict.type$.toNullable(), [this.#a, this.#b, this.#c]), ((this$) => { if (indexed) return "tagScan:num"; return "fullScan"; })(this));
    this.verifyQuery("num == 4", sys.List.make(haystack.Dict.type$.toNullable(), [this.#d]), ((this$) => { if (indexed) return "tagValMatch:num"; return "fullScan"; })(this));
    this.verifyQuery("num != 4", sys.List.make(haystack.Dict.type$.toNullable(), [this.#a, this.#b, this.#c, this.#e, this.#f, this.#g]), ((this$) => { if (indexed) return "tagScan:num"; return "fullScan"; })(this));
    this.verifyQuery("num == 99", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), ((this$) => { if (indexed) return "empty"; return "fullScan"; })(this));
    this.verifyQuery("num > 99", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), ((this$) => { if (indexed) return "tagScan:num"; return "fullScan"; })(this));
    this.verifyQuery("num > `foo`", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), ((this$) => { if (indexed) return "tagScan:num"; return "fullScan"; })(this));
    this.verifyQuery("not num", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), "fullScan");
    this.verifyQuery("not fooBar", sys.List.make(haystack.Dict.type$.toNullable(), [this.#a, this.#b, this.#c, this.#d, this.#e, this.#f, this.#g]), "fullScan");
    let aId = this.#a.id().toCode();
    let bId = this.#b.id().toCode();
    this.verifyQuery("fooRef", sys.List.make(haystack.Dict.type$.toNullable(), [this.#b, this.#c, this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagMatch:fooRef"; return "fullScan"; })(this));
    this.verifyQuery(sys.Str.plus("fooRef == ", aId), sys.List.make(haystack.Dict.type$.toNullable(), [this.#b, this.#c, this.#d]), ((this$) => { if (indexed) return "tagValMatch:fooRef"; return "fullScan"; })(this));
    this.verifyQuery(sys.Str.plus("fooRef == ", bId), sys.List.make(haystack.Dict.type$.toNullable(), [this.#e, this.#f]), ((this$) => { if (indexed) return "tagValMatch:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef == @xxxx", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), ((this$) => { if (indexed) return "empty"; return "fullScan"; })(this));
    this.verifyQuery(sys.Str.plus("fooRef != ", aId), sys.List.make(haystack.Dict.type$.toNullable(), [this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef != @xxxx", sys.List.make(haystack.Dict.type$.toNullable(), [this.#b, this.#c, this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->num==1", sys.List.make(haystack.Dict.type$.toNullable(), [this.#b, this.#c, this.#d]), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->num>=1", sys.List.make(haystack.Dict.type$.toNullable(), [this.#b, this.#c, this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->num>1", sys.List.make(haystack.Dict.type$.toNullable(), [this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->xxx", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->dis", sys.List.make(haystack.Dict.type$.toNullable(), [this.#b, this.#c, this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->dis==\"B\"", sys.List.make(haystack.Dict.type$.toNullable(), [this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->fooRef", sys.List.make(haystack.Dict.type$.toNullable(), [this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->badone", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("not fooRef->dis", sys.List.make(haystack.Dict.type$.toNullable(), [this.#a, this.#g]), "fullScan");
    this.verifyQuery("num and fooRef", sys.List.make(haystack.Dict.type$.toNullable(), [this.#b, this.#c, this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef and num", sys.List.make(haystack.Dict.type$.toNullable(), [this.#b, this.#c, this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("num and bar", sys.List.make(haystack.Dict.type$.toNullable(), [this.#c, this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:bar"; return "fullScan"; })(this));
    this.verifyQuery("bar and num", sys.List.make(haystack.Dict.type$.toNullable(), [this.#c, this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:bar"; return "fullScan"; })(this));
    this.verifyQuery("num and fooRef and bar", sys.List.make(haystack.Dict.type$.toNullable(), [this.#c, this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:bar"; return "fullScan"; })(this));
    this.verifyQuery("bar and num and fooRef", sys.List.make(haystack.Dict.type$.toNullable(), [this.#c, this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:bar"; return "fullScan"; })(this));
    this.verifyQuery(sys.Str.plus(sys.Str.plus("fooRef==", aId), " and bar"), sys.List.make(haystack.Dict.type$.toNullable(), [this.#c, this.#d]), ((this$) => { if (indexed) return "tagValScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef==@xxx and bar", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")), ((this$) => { if (indexed) return "empty"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->num>1 and num", sys.List.make(haystack.Dict.type$.toNullable(), [this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:fooRef"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->num>1 and num==6", sys.List.make(haystack.Dict.type$.toNullable(), [this.#f]), ((this$) => { if (indexed) return "tagValScan:num"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->dis and bar", sys.List.make(haystack.Dict.type$.toNullable(), [this.#c, this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:bar"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->dis and bar==\"b\"", sys.List.make(haystack.Dict.type$.toNullable(), [this.#d]), ((this$) => { if (indexed) return "tagValScan:bar"; return "fullScan"; })(this));
    this.verifyQuery("fooRef->dis and bar>=\"b\"", sys.List.make(haystack.Dict.type$.toNullable(), [this.#d, this.#e, this.#f]), ((this$) => { if (indexed) return "tagScan:bar"; return "fullScan"; })(this));
    this.verifyQuery("fooRef or bar", sys.List.make(haystack.Dict.type$.toNullable(), [this.#b, this.#c, this.#d, this.#e, this.#f]), "fullScan");
    this.verifyQuery("fooRef or bar or baz", sys.List.make(haystack.Dict.type$.toNullable(), [this.#b, this.#c, this.#d, this.#e, this.#f, this.#g]), "fullScan");
    this.verifyQuery("(fooRef and bar) or baz", sys.List.make(haystack.Dict.type$.toNullable(), [this.#c, this.#d, this.#e, this.#f, this.#g]), "fullScan");
    this.verifyQuery("^baz", sys.List.make(haystack.Dict.type$.toNullable(), [this.#g]), "fullScan");
    this.verifyQuery("^num-bar", sys.List.make(haystack.Dict.type$.toNullable(), [this.#c, this.#d, this.#e, this.#f]), "fullScan");
    this.verifyQuery("^bar-num", sys.List.make(haystack.Dict.type$.toNullable(), [this.#c, this.#d, this.#e, this.#f]), "fullScan");
    this.verifyQuery("trash", sys.List.make(haystack.Dict.type$.toNullable(), [this.#x1, this.#x2, this.#x3]), "fullScan", true);
    this.verifyQuery("trash and num", sys.List.make(haystack.Dict.type$.toNullable(), [this.#x1, this.#x2, this.#x3]), "fullScan", true);
    this.verifyQuery("num >= 8", sys.List.make(haystack.Dict.type$.toNullable(), [this.#x1, this.#x2, this.#x3]), "fullScan", true);
    this.verifyQuery("trash and num >= 8", sys.List.make(haystack.Dict.type$.toNullable(), [this.#x1, this.#x2, this.#x3]), "fullScan", true);
    this.verifyQuery("num == 9 or num == 10", sys.List.make(haystack.Dict.type$.toNullable(), [this.#x2, this.#x3]), "fullScan", true);
    this.verifyQuery("num >= 8 and fooRef", sys.List.make(haystack.Dict.type$.toNullable(), [this.#x1, this.#x2, this.#x3]), "fullScan", true);
    return;
  }

  verifyQuery(filterStr,expected,plan,trash) {
    if (trash === undefined) trash = false;
    const this$ = this;
    this.folio().stats().clear();
    let statsA = this.folio().stats().reads().count();
    let opts = ((this$) => { if (trash) return haystack.Etc.makeDict1("trash", haystack.HaystackTest.m()); return null; })(this);
    let filter = haystack.Filter.fromStr(filterStr);
    let list = this.folio().readAllList(sys.ObjUtil.coerce(filter, haystack.Filter.type$), opts);
    this.verifyDictsEq(list, expected, false);
    this.verifyPlanStats(plan);
    let grid = this.folio().readAll(sys.ObjUtil.coerce(filter, haystack.Filter.type$), opts);
    this.verifyDictsEq(grid.toRows(), expected, false);
    this.verifyPlanStats(plan);
    let statsB = this.folio().stats().reads().count();
    let count = this.folio().readCount(sys.ObjUtil.coerce(filter, haystack.Filter.type$), opts);
    this.verifyEq(sys.ObjUtil.coerce(count, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    this.verifyPlanStats(plan);
    let statsC = this.folio().stats().reads().count();
    let acc = sys.List.make(haystack.Dict.type$);
    let ew = this.folio().readAllEachWhile(sys.ObjUtil.coerce(filter, haystack.Filter.type$), opts, (rec) => {
      acc.add(rec);
      return null;
    });
    this.verifyEq(ew, null);
    this.verifyDictsEq(acc, expected, false);
    this.verifyPlanStats(plan);
    let statsD = this.folio().stats().reads().count();
    this.verifyEq(sys.ObjUtil.coerce(statsB, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(statsA, 2), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(statsC, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(statsB, 1), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(statsD, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.plus(statsC, 1), sys.Obj.type$.toNullable()));
    if (trash) {
      return;
    }
    ;
    if (expected.isEmpty()) {
      this.verifyEq(this.folio().read(sys.ObjUtil.coerce(filter, haystack.Filter.type$), false), null);
      this.verifyErr(haystack.UnknownRecErr.type$, (it) => {
        this$.folio().read(sys.ObjUtil.coerce(filter, haystack.Filter.type$));
        return;
      });
    }
    else {
      let single = this.folio().read(sys.ObjUtil.coerce(filter, haystack.Filter.type$));
      this.verifyDictEq(sys.ObjUtil.coerce(expected.find((s) => {
        return sys.ObjUtil.equals(s.id(), single.id());
      }), haystack.Dict.type$), sys.ObjUtil.coerce(single, sys.Obj.type$));
    }
    ;
    this.verifyPlanStats(plan);
    if (sys.ObjUtil.compareGT(expected.size(), 2)) {
      let limit = sys.Range.make(1, expected.size()).random();
      (opts = haystack.Etc.makeDict(sys.Map.__fromLiteral(["limit"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(limit, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?"))));
      let limited = list.getRange(sys.Range.make(0, limit, true));
      this.verifyDictsEq(this.folio().readAllList(sys.ObjUtil.coerce(filter, haystack.Filter.type$), opts), limited, true);
      this.verifyDictsEq(this.folio().readAll(sys.ObjUtil.coerce(filter, haystack.Filter.type$), opts).toRows(), limited, true);
      this.verifyEq(sys.ObjUtil.coerce(this.folio().readCount(sys.ObjUtil.coerce(filter, haystack.Filter.type$), opts), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(limit, sys.Obj.type$.toNullable()));
      this.verifyPlanStats(plan);
    }
    ;
    return;
  }

  verifyPlanStats(plan) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxFolio::StatsCountAndTicks"));
    this.folio().stats().readsByPlan().each((v,p) => {
      acc.set(p, v);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(acc.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(acc.keys().first(), plan);
    this.folio().stats().readsByPlan().clear();
    return;
  }

  testQueryAcc() {
    let a = haystack.Etc.makeDict(sys.Map.__fromLiteral(["dis","num","a"], ["A",haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let b = haystack.Etc.makeDict(sys.Map.__fromLiteral(["dis","num","b"], ["B",haystack.HaystackTest.n(sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let c = haystack.Etc.makeDict(sys.Map.__fromLiteral(["dis","num","c"], ["C",haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let d = haystack.Etc.makeDict(sys.Map.__fromLiteral(["dis","num","d"], ["D",haystack.HaystackTest.n(sys.ObjUtil.coerce(4, sys.Num.type$.toNullable())),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let x = sys.List.make(haystack.Dict.type$, [a, b, c, d]);
    this.verifyQueryAcc(null, 10, x, sys.List.make(haystack.Dict.type$, [a, b, c, d]));
    this.verifyQueryAcc(null, 4, x, sys.List.make(haystack.Dict.type$, [a, b, c, d]));
    this.verifyQueryAcc(null, 3, x, sys.List.make(haystack.Dict.type$, [a, b, c]));
    this.verifyQueryAcc(null, 2, x, sys.List.make(haystack.Dict.type$, [a, b]));
    this.verifyQueryAcc(null, 1, x, sys.List.make(haystack.Dict.type$, [a]));
    this.verifyQueryAcc(null, 0, x, sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")));
    let cx = QueryTestContext.make(sys.ObjUtil.coerce(haystack.Filter.fromStr("dis"), haystack.Filter.type$));
    this.verifyQueryAcc(cx, 10, x, sys.List.make(haystack.Dict.type$, [a, b, c, d]));
    this.verifyQueryAcc(cx, 4, x, sys.List.make(haystack.Dict.type$, [a, b, c, d]));
    this.verifyQueryAcc(cx, 3, x, sys.List.make(haystack.Dict.type$, [a, b, c]));
    this.verifyQueryAcc(cx, 2, x, sys.List.make(haystack.Dict.type$, [a, b]));
    this.verifyQueryAcc(cx, 1, x, sys.List.make(haystack.Dict.type$, [a]));
    this.verifyQueryAcc(cx, 0, x, sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")));
    (cx = QueryTestContext.make(sys.ObjUtil.coerce(haystack.Filter.fromStr("num <= 2"), haystack.Filter.type$)));
    this.verifyQueryAcc(cx, 10, x, sys.List.make(haystack.Dict.type$, [a, b]));
    this.verifyQueryAcc(cx, 4, x, sys.List.make(haystack.Dict.type$, [a, b]));
    this.verifyQueryAcc(cx, 3, x, sys.List.make(haystack.Dict.type$, [a, b]));
    this.verifyQueryAcc(cx, 2, x, sys.List.make(haystack.Dict.type$, [a, b]));
    this.verifyQueryAcc(cx, 1, x, sys.List.make(haystack.Dict.type$, [a]));
    this.verifyQueryAcc(cx, 0, x, sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")));
    (cx = QueryTestContext.make(sys.ObjUtil.coerce(haystack.Filter.fromStr("num == 3"), haystack.Filter.type$)));
    this.verifyQueryAcc(cx, 10, x, sys.List.make(haystack.Dict.type$, [c]));
    this.verifyQueryAcc(cx, 4, x, sys.List.make(haystack.Dict.type$, [c]));
    this.verifyQueryAcc(cx, 3, x, sys.List.make(haystack.Dict.type$, [c]));
    this.verifyQueryAcc(cx, 2, x, sys.List.make(haystack.Dict.type$, [c]));
    this.verifyQueryAcc(cx, 1, x, sys.List.make(haystack.Dict.type$, [c]));
    this.verifyQueryAcc(cx, 0, x, sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict[]")));
    return;
  }

  verifyQueryAcc(cx,limit,x,expected) {
    const this$ = this;
    let opts = QueryOpts.makeLimit(limit);
    let collect = QueryCollect.make(cx, opts);
    x.each((r,i) => {
      this$.verifyEq(sys.ObjUtil.coerce(collect.add(r), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.compareLT(collect.list().size(), limit), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyDictsEq(collect.list(), expected);
    let count = QueryCounter.make(cx, opts);
    x.each((r,i) => {
      this$.verifyEq(sys.ObjUtil.coerce(count.add(r), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.compareLT(count.count(), limit), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(count.count(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    let eAcc = sys.List.make(haystack.Dict.type$);
    let e = QueryEachWhile.make(cx, opts, (rec) => {
      eAcc.add(rec);
      return null;
    });
    x.each((r,i) => {
      this$.verifyEq(sys.ObjUtil.coerce(e.add(r), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.compareLT(eAcc.size(), limit), sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyDictsEq(eAcc, expected);
    (eAcc = sys.List.make(haystack.Dict.type$));
    let broke = false;
    (e = QueryEachWhile.make(cx, QueryOpts.makeLimit(sys.Int.maxVal()), (rec) => {
      if (sys.ObjUtil.compareLT(eAcc.size(), limit)) {
        eAcc.add(rec);
      }
      ;
      (broke = sys.ObjUtil.compareGE(eAcc.size(), limit));
      return ((this$) => { if (broke) return "break"; return null; })(this$);
    }));
    x.each((r,i) => {
      e.add(r);
      return;
    });
    this.verifyDictsEq(eAcc, expected);
    this.verifyEq(e.result(), ((this$) => { if (broke) return "break"; return null; })(this));
    return;
  }

  static make() {
    const $self = new QueryTest();
    QueryTest.make$($self);
    return $self;
  }

  static make$($self) {
    WhiteboxTest.make$($self);
    return;
  }

}

class QueryTestContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueryTestContext.type$; }

  #readFilter = null;

  readFilter() { return this.#readFilter; }

  __readFilter(it) { if (it === undefined) return this.#readFilter; else this.#readFilter = it; }

  static make(f) {
    const $self = new QueryTestContext();
    QueryTestContext.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    $self.#readFilter = f;
    return;
  }

  canRead(rec) {
    return this.#readFilter.matches(rec, haystack.HaystackContext.nil());
  }

  canWrite(rec) {
    return true;
  }

  commitInfo() {
    return null;
  }

}

class MiscTest extends WhiteboxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MiscTest.type$; }

  #counter = 0;

  counter(it) {
    if (it === undefined) {
      return this.#counter;
    }
    else {
      this.#counter = it;
      return;
    }
  }

  testIntern() {
    this.open();
    let a = this.addRec(sys.Map.__fromLiteral(["dis","date","ref","sym"], ["x",sys.Date.today(),haystack.Ref.fromStr("xxx"),haystack.Symbol.fromStr("bar")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let b = this.addRec(sys.Map.__fromLiteral(["dis","date","ref","sym"], ["x",sys.Date.today(),haystack.Ref.fromStr("xxx"),haystack.Symbol.fromStr("bar")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.reopen();
    (a = sys.ObjUtil.coerce(this.folio().readById(a.id()), haystack.Dict.type$));
    (b = sys.ObjUtil.coerce(this.folio().readById(b.id()), haystack.Dict.type$));
    this.verifySame(a.trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), b.trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifySame(a.trap("date", sys.List.make(sys.Obj.type$.toNullable(), [])), b.trap("date", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifySame(a.trap("ref", sys.List.make(sys.Obj.type$.toNullable(), [])), b.trap("ref", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifySame(a.trap("sym", sys.List.make(sys.Obj.type$.toNullable(), [])), b.trap("sym", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.close();
    return;
  }

  testSync() {
    this.open();
    let tz = sys.TimeZone.cur();
    let ts = sys.DateTime.now().floor(sys.Duration.fromStr("1min"));
    let pt = this.addRec(sys.Map.__fromLiteral(["dis","point","his","kind","tz","ts"], ["Point!",haystack.HaystackTest.m(),haystack.HaystackTest.m(),"Number",tz.name(),ts], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.verifySync("index", sys.List.make(IndexMgr.type$, [this.folio().index()]));
    this.verifySync("store", sys.List.make(StoreMgr.type$, [this.folio().store()]));
    this.verifySync("index,store", sys.List.make(HxFolioMgr.type$, [this.folio().index(), this.folio().store()]));
    this.verifySync("store", sys.List.make(StoreMgr.type$, [this.folio().store()]));
    this.verifySync("all!", sys.List.make(HxFolioMgr.type$, [this.folio().index(), this.folio().store()]));
    this.close();
    return;
  }

  verifySync(test,mgrs) {
    const this$ = this;
    ((this$) => { let $_u85 = this$.#counter;this$.#counter = sys.Int.increment(this$.#counter); return $_u85; })(this);
    let pt = this.folio().read(sys.ObjUtil.coerce(haystack.Filter.fromStr("point"), haystack.Filter.type$));
    let t1 = sys.Duration.now();
    let index = this.folio().dir().plus(sys.Uri.fromStr("folio.index"));
    let crc1 = index.readAllBuf().crc("CRC-32");
    let spark = haystack.Etc.makeDict(sys.Map.__fromLiteral(["targetRef","ruleRef","date","counter"], [pt.id(),haystack.Ref.fromStr("foo"),sys.Date.today(),haystack.HaystackTest.n(sys.ObjUtil.coerce(this.#counter, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let delay = sys.Duration.fromStr("200ms");
    mgrs.each((mgr) => {
      mgr.send(Msg.make(MsgId.testSleep(), delay));
      return;
    });
    let f1 = this.folio().commitAsync(folio.Diff.makeAdd(sys.Map.__fromLiteral(["test"], [test], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(f1.status(), concurrent.FutureStatus.pending());
    this.verifyErr(sys.TimeoutErr.type$, (it) => {
      this$.folio().sync(sys.Duration.fromStr("100ms"));
      return;
    });
    this.folio().sync(sys.Duration.fromStr("1sec"));
    let t2 = sys.Duration.now();
    let crc2 = index.readAllBuf().crc("CRC-32");
    let diff = t2.minus(t1);
    this.verifyEq(f1.status(), concurrent.FutureStatus.ok());
    this.verify((sys.ObjUtil.compareGT(diff, delay) && sys.ObjUtil.compareLT(diff, delay.plus(sys.Duration.fromStr("100ms")))));
    this.verifyNotEq(sys.ObjUtil.coerce(crc1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(crc2, sys.Obj.type$.toNullable()));
    let dict = f1.dict();
    this.verifyEq(dict.trap("test", sys.List.make(sys.Obj.type$.toNullable(), [])), test);
    return;
  }

  static make() {
    const $self = new MiscTest();
    MiscTest.make$($self);
    return $self;
  }

  static make$($self) {
    WhiteboxTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxFolio');
const xp = sys.Param.noParams$();
let m;
HxFolioMgr.type$ = p.at$('HxFolioMgr','concurrent::Actor',[],{'sys::NoDoc':""},8195,HxFolioMgr);
Msg.type$ = p.at$('Msg','sys::Obj',[],{},130,Msg);
MsgId.type$ = p.at$('MsgId','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,MsgId);
MsgCoalesceKey.type$ = p.at$('MsgCoalesceKey','sys::Obj',[],{},130,MsgCoalesceKey);
StoreMgr.type$ = p.at$('StoreMgr','hxFolio::HxFolioMgr',[],{},130,StoreMgr);
Rec.type$ = p.at$('Rec','sys::Obj',[],{},8194,Rec);
StatsMgr.type$ = p.at$('StatsMgr','hxFolio::HxFolioMgr',[],{},130,StatsMgr);
StatsCountAndTicks.type$ = p.at$('StatsCountAndTicks','sys::Obj',[],{},130,StatsCountAndTicks);
StatsReadByTag.type$ = p.at$('StatsReadByTag','sys::Obj',[],{},130,StatsReadByTag);
StatsReadByPlan.type$ = p.at$('StatsReadByPlan','sys::Obj',[],{},130,StatsReadByPlan);
FolioDiag.type$ = p.at$('FolioDiag','sys::Obj',[],{},8194,FolioDiag);
Query.type$ = p.at$('Query','sys::Obj',['haystack::HaystackContext'],{},128,Query);
QueryOpts.type$ = p.at$('QueryOpts','sys::Obj',[],{},130,QueryOpts);
QueryAcc.type$ = p.at$('QueryAcc','sys::Obj',[],{},129,QueryAcc);
QueryCollect.type$ = p.at$('QueryCollect','hxFolio::QueryAcc',[],{},128,QueryCollect);
QueryEachWhile.type$ = p.at$('QueryEachWhile','hxFolio::QueryAcc',[],{},128,QueryEachWhile);
QueryCounter.type$ = p.at$('QueryCounter','hxFolio::QueryAcc',[],{},128,QueryCounter);
QueryPlan.type$ = p.at$('QueryPlan','sys::Obj',[],{},129,QueryPlan);
EmptyPlan.type$ = p.at$('EmptyPlan','hxFolio::QueryPlan',[],{},160,EmptyPlan);
ByIdPlan.type$ = p.at$('ByIdPlan','hxFolio::QueryPlan',[],{},160,ByIdPlan);
FullScanPlan.type$ = p.at$('FullScanPlan','hxFolio::QueryPlan',[],{},160,FullScanPlan);
IndexMgr.type$ = p.at$('IndexMgr','hxFolio::HxFolioMgr',[],{},130,IndexMgr);
Loader.type$ = p.at$('Loader','sys::Obj',[],{},128,Loader);
LoaderRec.type$ = p.at$('LoaderRec','sys::Obj',[],{},128,LoaderRec);
LoaderBrioReader.type$ = p.at$('LoaderBrioReader','haystack::BrioReader',[],{},128,LoaderBrioReader);
DisMgr.type$ = p.at$('DisMgr','hxFolio::HxFolioMgr',[],{},130,DisMgr);
DisMgrMacro.type$ = p.at$('DisMgrMacro','haystack::Macro',[],{},128,DisMgrMacro);
DebugMgr.type$ = p.at$('DebugMgr','hxFolio::HxFolioMgr',[],{'sys::NoDoc':""},8194,DebugMgr);
HisMgr.type$ = p.at$('HisMgr','hxFolio::HxFolioMgr',['folio::FolioHis'],{'sys::NoDoc':""},8194,HisMgr);
HisEvent.type$ = p.at$('HisEvent','folio::FolioHisEvent',[],{},128,HisEvent);
Commit.type$ = p.at$('Commit','sys::Obj',[],{},128,Commit);
CommitEvent.type$ = p.at$('CommitEvent','folio::FolioCommitEvent',[],{},128,CommitEvent);
BackupMgr.type$ = p.at$('BackupMgr','hxFolio::HxFolioMgr',['folio::FolioBackup'],{'sys::NoDoc':""},8194,BackupMgr);
HxFolio.type$ = p.at$('HxFolio','folio::Folio',[],{},8194,HxFolio);
WhiteboxTest.type$ = p.at$('WhiteboxTest','haystack::HaystackTest',[],{},8193,WhiteboxTest);
DisMgrTest.type$ = p.at$('DisMgrTest','hxFolio::WhiteboxTest',[],{},8192,DisMgrTest);
StoreMgrTest.type$ = p.at$('StoreMgrTest','hxFolio::WhiteboxTest',[],{},8192,StoreMgrTest);
CommitTest.type$ = p.at$('CommitTest','hxFolio::WhiteboxTest',[],{},8192,CommitTest);
QueryTest.type$ = p.at$('QueryTest','hxFolio::WhiteboxTest',[],{},8192,QueryTest);
QueryTestContext.type$ = p.at$('QueryTestContext','sys::Obj',['folio::FolioContext'],{},128,QueryTestContext);
MiscTest.type$ = p.at$('MiscTest','hxFolio::WhiteboxTest',[],{},8192,MiscTest);
HxFolioMgr.type$.af$('folio',73730,'hxFolio::HxFolio',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','hxFolio::HxFolio',false)]),{}).am$('makeCoalescing',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','hxFolio::HxFolio',false),new sys.Param('toKey','|sys::Obj?->sys::Obj?|?',false),new sys.Param('coalesce','|sys::Obj?,sys::Obj?->sys::Obj?|?',false)]),{}).am$('log',8192,'sys::Log',xp,{}).am$('sync',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('receive',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('onReceive',262272,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hxFolio::Msg',false)]),{}).am$('onClose',262272,'sys::Void',xp,{}).am$('debugDump',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{});
Msg.type$.af$('id',73730,'hxFolio::MsgId',{}).af$('a',73730,'sys::Obj?',{}).af$('b',73730,'sys::Obj?',{}).af$('c',73730,'sys::Obj?',{}).af$('d',73730,'sys::Obj?',{}).af$('coalesceKey',73730,'hxFolio::MsgCoalesceKey?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','hxFolio::MsgId',false),new sys.Param('a','sys::Obj?',true),new sys.Param('b','sys::Obj?',true),new sys.Param('c','sys::Obj?',true),new sys.Param('d','sys::Obj?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{});
MsgId.type$.af$('sync',106506,'hxFolio::MsgId',{}).af$('testSleep',106506,'hxFolio::MsgId',{}).af$('close',106506,'hxFolio::MsgId',{}).af$('commit',106506,'hxFolio::MsgId',{}).af$('hisWrite',106506,'hxFolio::MsgId',{}).af$('storeAdd',106506,'hxFolio::MsgId',{}).af$('storeUpdate',106506,'hxFolio::MsgId',{}).af$('storeRemove',106506,'hxFolio::MsgId',{}).af$('disUpdateAll',106506,'hxFolio::MsgId',{}).af$('disUpdate',106506,'hxFolio::MsgId',{}).af$('vals',106498,'hxFolio::MsgId[]',{}).af$('coalesce',73730,'sys::Bool',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('coalesce','sys::Bool',true)]),{}).am$('fromStr',40966,'hxFolio::MsgId?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
MsgCoalesceKey.type$.af$('hash',336898,'sys::Int',{}).af$('id',73730,'hxFolio::MsgId',{}).af$('rec',73730,'hxFolio::Rec?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','hxFolio::MsgId',false),new sys.Param('rec','hxFolio::Rec?',false)]),{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
StoreMgr.type$.af$('blobs',73730,'hxStore::Store',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','hxFolio::HxFolio',false),new sys.Param('loader','hxFolio::Loader',false)]),{}).am$('add',8192,'hxFolio::Rec',sys.List.make(sys.Param.type$,[new sys.Param('tags','haystack::Dict',false)]),{}).am$('update',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','hxFolio::Rec',false)]),{}).am$('remove',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','hxFolio::Rec',false)]),{}).am$('onReceive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hxFolio::Msg',false)]),{}).am$('onAdd',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('persistent','haystack::Dict',false)]),{}).am$('onUpdate',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('rec','hxFolio::Rec',false)]),{}).am$('onRemove',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('rec','hxFolio::Rec',false)]),{}).am$('onClose',263296,'sys::Void',xp,{}).am$('encode',2048,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('persistent','haystack::Dict',false)]),{});
Rec.type$.af$('id',73730,'haystack::Ref',{}).af$('blob',73730,'hxStore::Blob',{}).af$('dictRef',67586,'concurrent::AtomicRef',{}).af$('persistentRef',67586,'concurrent::AtomicRef',{}).af$('transientRef',67586,'concurrent::AtomicRef',{}).af$('isTrashRef',67586,'concurrent::AtomicBool',{}).af$('ticksRef',67586,'concurrent::AtomicInt',{}).af$('numWritesRef',65666,'concurrent::AtomicInt',{}).af$('numWatches',73730,'concurrent::AtomicInt',{}).af$('hisItemsRef',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('blob','hxStore::Blob',false),new sys.Param('persistent','haystack::Dict',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('handle',8192,'sys::Int',xp,{}).am$('dis',8192,'sys::Str',xp,{}).am$('dict',8192,'haystack::Dict',xp,{}).am$('persistent',8192,'haystack::Dict',xp,{}).am$('transient',8192,'haystack::Dict',xp,{}).am$('isTrash',8192,'sys::Bool',xp,{}).am$('ticks',8192,'sys::Int',xp,{}).am$('updateDict',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','haystack::Dict',false),new sys.Param('t','haystack::Dict',false),new sys.Param('ticks','sys::Int',false)]),{}).am$('numWrites',8192,'sys::Int',xp,{}).am$('hisItems',8192,'haystack::HisItem[]',xp,{}).am$('hisUpdate',128,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('items','haystack::HisItem[]',false)]),{}).am$('eachBlob',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|hxStore::Blob->sys::Void|',false)]),{});
StatsMgr.type$.af$('commitsPersistent',73730,'hxFolio::StatsCountAndTicks',{}).af$('commitsTransient',73730,'hxFolio::StatsCountAndTicks',{}).af$('reads',73730,'hxFolio::StatsCountAndTicks',{}).af$('readsByPlan',73730,'hxFolio::StatsReadByPlan',{}).af$('diags',73730,'hxFolio::FolioDiag[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','hxFolio::HxFolio',false)]),{}).am$('clear',8192,'sys::Void',xp,{}).am$('debugSummary',8192,'haystack::Grid',xp,{}).am$('debugReadsByPlan',8192,'haystack::Grid',xp,{});
StatsCountAndTicks.type$.af$('countRef',67586,'concurrent::AtomicInt',{}).af$('ticksRef',67586,'concurrent::AtomicInt',{}).am$('add',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ticks','sys::Int',false)]),{}).am$('clear',8192,'sys::Void',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('totalTime',8192,'sys::Str',xp,{}).am$('avgTime',8192,'sys::Str',xp,{}).am$('count',8192,'sys::Int',xp,{}).am$('ticks',8192,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
StatsReadByTag.type$.af$('map',67586,'concurrent::ConcurrentMap',{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Int,sys::Str->sys::Void|',false)]),{}).am$('add',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false)]),{}).am$('clear',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
StatsReadByPlan.type$.af$('map',67586,'concurrent::ConcurrentMap',{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|hxFolio::StatsCountAndTicks,sys::Str->sys::Void|',false)]),{}).am$('add',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('plan','sys::Str',false),new sys.Param('ticks','sys::Int',false)]),{}).am$('clear',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
FolioDiag.type$.af$('name',73730,'sys::Str',{}).af$('dis',73730,'sys::Str',{}).af$('func',73730,'|->sys::Obj|',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('dis','sys::Str',false),new sys.Param('func','|->sys::Obj|',false)]),{}).am$('val',8192,'sys::Obj?',xp,{});
Query.type$.af$('folio',73730,'hxFolio::HxFolio',{}).af$('index',73730,'hxFolio::IndexMgr',{}).af$('filter',73730,'haystack::Filter',{}).af$('opts',73730,'hxFolio::QueryOpts',{}).af$('startTicks',73730,'sys::Int',{}).af$('xetoIsSpecCache',67584,'[sys::Str:xeto::Spec]?',{}).af$('inference$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','hxFolio::HxFolio',false),new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict',false)]),{}).am$('collect',8192,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('cx','folio::FolioContext?',false)]),{}).am$('eachWhile',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','folio::FolioContext?',false),new sys.Param('cb','|haystack::Dict->sys::Obj?|',false)]),{}).am$('count',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('cx','folio::FolioContext?',false)]),{}).am$('makePlan',8192,'hxFolio::QueryPlan',xp,{}).am$('xetoIsSpec',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('specName','sys::Str',false),new sys.Param('rec','xeto::Dict',false)]),{'sys::NoDoc':""}).am$('deref',271360,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('inference',795648,'haystack::FilterInference',xp,{}).am$('toDict',271360,'haystack::Dict',xp,{}).am$('doMakePlan',40962,'hxFolio::QueryPlan?',sys.List.make(sys.Param.type$,[new sys.Param('index','hxFolio::IndexMgr',false),new sys.Param('filter','haystack::Filter',false),new sys.Param('inCompound','sys::Bool',false)]),{}).am$('updateStats',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('plan','hxFolio::QueryPlan',false)]),{}).am$('inference$Once',133120,'haystack::FilterInference',xp,{});
QueryOpts.type$.af$('opts',73730,'haystack::Dict',{}).af$('limit',73730,'sys::Int',{}).af$('search',73730,'haystack::Filter?',{}).af$('skipTrash',73730,'sys::Bool',{}).af$('sort',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict',false)]),{}).am$('makeLimit',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('limit','sys::Int',false)]),{}).am$('toLimit',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict',false)]),{}).am$('toSearch',34818,'haystack::Filter?',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict',false)]),{});
QueryAcc.type$.af$('cx',73728,'folio::FolioContext?',{}).af$('limit',73730,'sys::Int',{}).af$('search',73728,'haystack::Filter?',{}).af$('count',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','folio::FolioContext?',false),new sys.Param('opts','hxFolio::QueryOpts',false)]),{}).am$('prepCapacity',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('addingSize','sys::Int',false)]),{}).am$('add',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('onAdd',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{});
QueryCollect.type$.af$('list',73728,'haystack::Dict[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','folio::FolioContext?',false),new sys.Param('opts','hxFolio::QueryOpts',false)]),{}).am$('prepCapacity',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('addingSize','sys::Int',false)]),{}).am$('onAdd',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{});
QueryEachWhile.type$.af$('cb',73728,'|haystack::Dict->sys::Obj?|',{}).af$('result',73728,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','folio::FolioContext?',false),new sys.Param('opts','hxFolio::QueryOpts',false),new sys.Param('cb','|haystack::Dict->sys::Obj?|',false)]),{}).am$('onAdd',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{});
QueryCounter.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','folio::FolioContext?',false),new sys.Param('opts','hxFolio::QueryOpts',false)]),{}).am$('onAdd',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{});
QueryPlan.type$.am$('debug',270337,'sys::Str',xp,{}).am$('cost',270337,'sys::Int',xp,{}).am$('query',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('q','hxFolio::Query',false),new sys.Param('acc','hxFolio::QueryAcc',false)]),{}).am$('make',139268,'sys::Void',xp,{});
EmptyPlan.type$.am$('debug',271360,'sys::Str',xp,{}).am$('cost',271360,'sys::Int',xp,{}).am$('query',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('q','hxFolio::Query',false),new sys.Param('acc','hxFolio::QueryAcc',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ByIdPlan.type$.af$('id',73730,'haystack::Ref',{}).af$('inCompound',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('inCompound','sys::Bool',false)]),{}).am$('debug',271360,'sys::Str',xp,{}).am$('cost',271360,'sys::Int',xp,{}).am$('query',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('q','hxFolio::Query',false),new sys.Param('acc','hxFolio::QueryAcc',false)]),{});
FullScanPlan.type$.am$('debug',271360,'sys::Str',xp,{}).am$('cost',271360,'sys::Int',xp,{}).am$('query',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('q','hxFolio::Query',false),new sys.Param('acc','hxFolio::QueryAcc',false)]),{}).am$('make',139268,'sys::Void',xp,{});
IndexMgr.type$.af$('lastModRef',67586,'concurrent::AtomicRef',{}).af$('byId',65666,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','hxFolio::HxFolio',false),new sys.Param('loader','hxFolio::Loader',false)]),{}).am$('size',8192,'sys::Int',xp,{}).am$('rec',8192,'hxFolio::Rec?',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('dict',8192,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('lastMod',2048,'sys::DateTime',xp,{}).am$('commit',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false)]),{}).am$('hisWrite',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('rec','hxFolio::Rec',false),new sys.Param('items','haystack::HisItem[]',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('cxInfo','sys::Obj?',false)]),{}).am$('onReceive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hxFolio::Msg',false)]),{}).am$('onHisUpdate',2048,'hxFolio::Rec',sys.List.make(sys.Param.type$,[new sys.Param('rec','hxFolio::Rec',false),new sys.Param('items','haystack::HisItem[]',false)]),{}).am$('onCommit',2048,'folio::CommitFolioRes',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false),new sys.Param('newIds','[haystack::Ref:haystack::Ref]?',false),new sys.Param('cxInfo','sys::Obj?',false)]),{}).am$('onHisWrite',2048,'folio::HisWriteFolioRes',sys.List.make(sys.Param.type$,[new sys.Param('rec','hxFolio::Rec',false),new sys.Param('toWriteUnsafe','sys::Unsafe',false),new sys.Param('opts','haystack::Dict',false),new sys.Param('cxInfo','sys::Obj?',false)]),{}).am$('hisMaxItems',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('hisTagsModified',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','hxFolio::Rec',false)]),{});
Loader.type$.af$('config',73730,'folio::FolioConfig',{}).af$('buf',73728,'sys::Buf',{}).af$('reader',73728,'haystack::BrioReader',{}).af$('refs',73728,'[sys::Str:haystack::Ref]',{}).af$('byId',73728,'concurrent::ConcurrentMap',{}).af$('byHandle',73728,'[sys::Int:hxFolio::LoaderRec]',{}).af$('blobs',73728,'hxStore::Store?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','folio::FolioConfig',false)]),{}).am$('load',8192,'sys::This',xp,{}).am$('loadBlobs',2048,'sys::Void',xp,{}).am$('toStoreConfig',34818,'hxStore::StoreConfig',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict',false)]),{}).am$('loadRecs',2048,'sys::Void',xp,{}).am$('loadRec',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('blob','hxStore::Blob',false)]),{}).am$('internRef',8192,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('err',2048,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
LoaderRec.type$.af$('rec',73730,'hxFolio::Rec',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','hxFolio::Rec',false)]),{});
LoaderBrioReader.type$.af$('loader',73728,'hxFolio::Loader',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('l','hxFolio::Loader',false),new sys.Param('in','sys::InStream',false)]),{}).am$('internRef',271360,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('dis','sys::Str?',false)]),{});
DisMgr.type$.af$('updateAllCount',73730,'concurrent::AtomicInt',{}).af$('updateAllMsg',106498,'hxFolio::Msg',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','hxFolio::HxFolio',false)]),{}).am$('updateAll',8192,'concurrent::Future',xp,{}).am$('update',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','hxFolio::Rec',false)]),{}).am$('onReceive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hxFolio::Msg',false)]),{}).am$('onUpdateAll',2048,'sys::Obj?',xp,{}).am$('toDis',128,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('cache','[haystack::Ref:sys::Str]',false),new sys.Param('id','haystack::Ref',false)]),{}).am$('computeDis',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('cache','[haystack::Ref:sys::Str]',false),new sys.Param('id','haystack::Ref',false)]),{}).am$('setDis',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','hxFolio::Rec',false),new sys.Param('dis','sys::Str',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DisMgrMacro.type$.af$('mgr',73728,'hxFolio::DisMgr',{}).af$('cache',73728,'[haystack::Ref:sys::Str]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','sys::Str',false),new sys.Param('s','haystack::Dict',false),new sys.Param('m','hxFolio::DisMgr',false),new sys.Param('c','[haystack::Ref:sys::Str]',false)]),{}).am$('refToDis',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false)]),{});
DebugMgr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','hxFolio::HxFolio',false)]),{}).am$('recBlobs',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{}).am$('dump',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{});
HisMgr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','hxFolio::HxFolio',false)]),{}).am$('read',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('span','haystack::Span?',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|haystack::HisItem->sys::Void|',false)]),{}).am$('write',271360,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('items','haystack::HisItem[]',false),new sys.Param('opts','haystack::Dict?',true)]),{});
HisEvent.type$.af$('rec',336898,'haystack::Dict',{}).af$('result',336898,'haystack::Dict',{}).af$('cxInfo',336898,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('result','haystack::Dict',false),new sys.Param('cxInfo','sys::Obj?',false)]),{});
Commit.type$.af$('folio',73730,'hxFolio::HxFolio',{}).af$('index',73730,'hxFolio::IndexMgr',{}).af$('store',73730,'hxFolio::StoreMgr',{}).af$('id',73730,'haystack::Ref',{}).af$('isTransient',73730,'sys::Bool',{}).af$('inDiff',73730,'folio::Diff',{}).af$('oldRec',73730,'hxFolio::Rec?',{}).af$('oldDict',73730,'haystack::Dict?',{}).af$('oldMod',73730,'sys::DateTime?',{}).af$('newMod',73730,'sys::DateTime',{}).af$('newTicks',73730,'sys::Int',{}).af$('cxInfo',73730,'sys::Obj?',{}).af$('event',67584,'hxFolio::CommitEvent',{}).af$('newIds',67584,'[haystack::Ref:haystack::Ref]?',{}).af$('tags',67584,'[sys::Str:sys::Obj]',{}).af$('hisTagsModified',67584,'sys::Bool',{}).af$('newRec',67584,'hxFolio::Rec?',{}).af$('outDiff',67584,'folio::Diff?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','hxFolio::HxFolio',false),new sys.Param('diff','folio::Diff',false),new sys.Param('newMod','sys::DateTime',false),new sys.Param('newTicks','sys::Int',false),new sys.Param('newIds','[haystack::Ref:haystack::Ref]?',false),new sys.Param('cxInfo','sys::Obj?',false)]),{}).am$('verify',8192,'sys::Void',xp,{}).am$('apply',8192,'folio::Diff',xp,{}).am$('normTags',2048,'sys::Void',xp,{}).am$('normVal',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Obj?',false)]),{}).am$('normList',2048,'sys::Obj?[]',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj?[]',false)]),{}).am$('normDict',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('normRef',2048,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false)]),{}).am$('add',2048,'sys::Void',xp,{}).am$('updatePersistent',2048,'sys::Void',xp,{}).am$('updateTransient',2048,'sys::Void',xp,{}).am$('mergeChanges',2048,'[sys::Str:sys::Obj]',sys.List.make(sys.Param.type$,[new sys.Param('orig','haystack::Dict',false)]),{}).am$('remove',2048,'sys::Void',xp,{}).am$('indexAdd',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','hxFolio::IndexMgr',false),new sys.Param('newRec','hxFolio::Rec',false)]),{}).am$('indexUpdate',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','hxFolio::IndexMgr',false),new sys.Param('rec','hxFolio::Rec',false),new sys.Param('oldDict','haystack::Dict',false),new sys.Param('newDict','haystack::Dict',false),new sys.Param('newTicks','sys::Int',false),new sys.Param('tags','[sys::Str:sys::Obj?]?',false)]),{}).am$('indexRemove',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','hxFolio::IndexMgr',false),new sys.Param('rec','hxFolio::Rec',false)]),{});
CommitEvent.type$.af$('diff',336896,'folio::Diff',{}).af$('oldRec',336896,'haystack::Dict?',{}).af$('cxInfo',336896,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false),new sys.Param('oldRec','haystack::Dict?',false),new sys.Param('cxInfo','sys::Obj?',false)]),{});
BackupMgr.type$.af$('dir',73730,'sys::File',{}).af$('lastRef',73730,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('folio','hxFolio::HxFolio',false)]),{}).am$('list',271360,'folio::FolioBackupFile[]',xp,{}).am$('monitor',271360,'hxStore::BackupMonitor?',xp,{}).am$('create',271360,'folio::FolioFuture',xp,{}).am$('status',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('b','folio::FolioBackupFile',false)]),{}).am$('curBackup',2048,'hxStore::BackupMonitor?',xp,{}).am$('kickoff',2048,'hxStore::BackupMonitor?',sys.List.make(sys.Param.type$,[new sys.Param('zip','sys::File',false),new sys.Param('opts','[sys::Str:sys::Obj]?',true)]),{});
HxFolio.type$.af$('passwords',336898,'folio::PasswordStore',{}).af$('index',65666,'hxFolio::IndexMgr',{}).af$('store',65666,'hxFolio::StoreMgr',{}).af$('disMgr',65666,'hxFolio::DisMgr',{}).af$('debug',73730,'hxFolio::DebugMgr',{}).af$('stats',65666,'hxFolio::StatsMgr',{}).af$('backup',336898,'hxFolio::BackupMgr',{}).af$('his',336898,'hxFolio::HisMgr',{}).af$('mgrsByName',65666,'[sys::Str:hxFolio::HxFolioMgr]',{}).af$('flushMode',271360,'sys::Str',{}).am$('open',40962,'folio::Folio',sys.List.make(sys.Param.type$,[new sys.Param('config','folio::FolioConfig',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loader','hxFolio::Loader',false)]),{}).am$('initMgrsByName',2048,'[sys::Str:hxFolio::HxFolioMgr]',xp,{}).am$('diags',8192,'hxFolio::FolioDiag[]',xp,{}).am$('curVer',271360,'sys::Int',xp,{}).am$('rec',8192,'hxFolio::Rec?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('toAbsRef',8192,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false)]),{}).am$('flush',271360,'sys::Void',xp,{}).am$('sync',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true),new sys.Param('mgr','sys::Str?',true)]),{}).am$('doCloseAsync',267264,'folio::FolioFuture',xp,{}).am$('doSync',2048,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('msg','hxFolio::Msg',false)]),{}).am$('doReadByIds',267264,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{}).am$('doReadAll',267264,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false)]),{}).am$('doReadAllEachWhile',267264,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|haystack::Dict->sys::Obj?|',false)]),{}).am$('doReadCount',267264,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('filter','haystack::Filter',false),new sys.Param('opts','haystack::Dict?',false)]),{}).am$('doCommitAllAsync',267264,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('diffs','folio::Diff[]',false),new sys.Param('cxInfo','sys::Obj?',false)]),{}).am$('checkCanWrite',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','folio::FolioContext',false),new sys.Param('diff','folio::Diff',false)]),{}).am$('readByIdPersistentTags',271360,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('readByIdTransientTags',271360,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('debugDump',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{});
WhiteboxTest.type$.af$('folio',73728,'hxFolio::HxFolio?',{}).am$('teardown',271360,'sys::Void',xp,{}).am$('open',270336,'hxFolio::HxFolio',xp,{}).am$('close',8192,'sys::Void',xp,{}).am$('reopen',8192,'folio::Folio',xp,{}).am$('readById',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('addRec',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('tags','sys::Obj',false)]),{}).am$('commit',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('changes','sys::Obj',false),new sys.Param('flags','sys::Int',true)]),{}).am$('doCommit',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false)]),{}).am$('verifySparksEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('actual','haystack::Dict[]',false),new sys.Param('expected','haystack::Dict[]',false)]),{}).am$('sortSparks',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sparks','haystack::Dict[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DisMgrTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('verifySameRef',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','haystack::Ref',false),new sys.Param('b','haystack::Ref',false),new sys.Param('dis','sys::Str',false)]),{}).am$('verifyDis',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','haystack::Dict',false),new sys.Param('dis','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
StoreMgrTest.type$.am$('testWriteNum',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
CommitTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('verifyCommit',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('changes','sys::Obj',false),new sys.Param('flags','sys::Int',false),new sys.Param('persistent','[sys::Str:sys::Obj]',false),new sys.Param('transient','[sys::Str:sys::Obj]',false)]),{}).am$('verifyCommitErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('changes','sys::Obj',false),new sys.Param('mode','sys::Str',false)]),{}).am$('testTrash',8192,'sys::Void',xp,{}).am$('verifyTrash',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','haystack::Dict',false),new sys.Param('isTrash','sys::Bool',false)]),{}).am$('make',139268,'sys::Void',xp,{});
QueryTest.type$.af$('a',73728,'haystack::Dict?',{}).af$('b',73728,'haystack::Dict?',{}).af$('c',73728,'haystack::Dict?',{}).af$('d',73728,'haystack::Dict?',{}).af$('e',73728,'haystack::Dict?',{}).af$('f',73728,'haystack::Dict?',{}).af$('g',73728,'haystack::Dict?',{}).af$('h',73728,'haystack::Dict?',{}).af$('i',73728,'haystack::Dict?',{}).af$('x1',73728,'haystack::Dict?',{}).af$('x2',73728,'haystack::Dict?',{}).af$('x3',73728,'haystack::Dict?',{}).am$('test',8192,'sys::Void',xp,{}).am$('doTest',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('indexed','sys::Bool',false)]),{}).am$('verifyQuery',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('filterStr','sys::Str',false),new sys.Param('expected','haystack::Dict[]',false),new sys.Param('plan','sys::Str',false),new sys.Param('trash','sys::Bool',true)]),{}).am$('verifyPlanStats',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('plan','sys::Str',false)]),{}).am$('testQueryAcc',8192,'sys::Void',xp,{}).am$('verifyQueryAcc',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','folio::FolioContext?',false),new sys.Param('limit','sys::Int',false),new sys.Param('x','haystack::Dict[]',false),new sys.Param('expected','haystack::Dict[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
QueryTestContext.type$.af$('readFilter',73730,'haystack::Filter',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','haystack::Filter',false)]),{}).am$('canRead',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('canWrite',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('commitInfo',271360,'sys::Obj?',xp,{});
MiscTest.type$.af$('counter',73728,'sys::Int',{}).am$('testIntern',8192,'sys::Void',xp,{}).am$('testSync',8192,'sys::Void',xp,{}).am$('verifySync',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('test','sys::Str',false),new sys.Param('mgrs','hxFolio::HxFolioMgr[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxFolio");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;xeto 3.1.11;haystack 3.1.11;def 3.1.11;folio 3.1.11;hxStore 3.1.11");
m.set("pod.summary", "Haxall folio database implementation");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:26-05:00 New_York");
m.set("build.tsKey", "241210143126");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "SkyFoundry");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Haxall");
m.set("proj.uri", "https://haxall.io/");
m.set("pod.docApi", "false");
m.set("org.uri", "https://skyfoundry.com/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  HxFolioMgr,
  Rec,
  FolioDiag,
  DebugMgr,
  HisMgr,
  BackupMgr,
  HxFolio,
  WhiteboxTest,
  DisMgrTest,
  StoreMgrTest,
  CommitTest,
  QueryTest,
  MiscTest,
};
