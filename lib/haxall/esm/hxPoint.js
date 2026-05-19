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
import * as hxUtil from './hxUtil.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class PointMgrActor extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#isRunningRef = concurrent.AtomicBool.make();
    return;
  }

  typeof() { return PointMgrActor.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #checkFreq = null;

  checkFreq() { return this.#checkFreq; }

  __checkFreq(it) { if (it === undefined) return this.#checkFreq; else this.#checkFreq = it; }

  #mgrType = null;

  mgrType() { return this.#mgrType; }

  __mgrType(it) { if (it === undefined) return this.#mgrType; else this.#mgrType = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #isRunningRef = null;

  // private field reflection only
  __isRunningRef(it) { if (it === undefined) return this.#isRunningRef; else this.#isRunningRef = it; }

  static #checkMsg = undefined;

  static checkMsg() {
    if (PointMgrActor.#checkMsg === undefined) {
      PointMgrActor.static$init();
      if (PointMgrActor.#checkMsg === undefined) PointMgrActor.#checkMsg = null;
    }
    return PointMgrActor.#checkMsg;
  }

  static #timeout = undefined;

  static timeout() {
    if (PointMgrActor.#timeout === undefined) {
      PointMgrActor.static$init();
      if (PointMgrActor.#timeout === undefined) PointMgrActor.#timeout = null;
    }
    return PointMgrActor.#timeout;
  }

  static make(lib,checkFreq,mgrType) {
    const $self = new PointMgrActor();
    PointMgrActor.make$($self,lib,checkFreq,mgrType);
    return $self;
  }

  static make$($self,lib,checkFreq,mgrType) {
    concurrent.Actor.make$($self, lib.rt().libs().actorPool());
    ;
    $self.#lib = lib;
    $self.#checkFreq = checkFreq;
    $self.#mgrType = mgrType;
    $self.#log = lib.log();
    return;
  }

  isRunning() {
    return this.#isRunningRef.val();
  }

  start() {
    this.#isRunningRef.val(true);
    this.sendLater(this.#checkFreq, PointMgrActor.checkMsg());
    return;
  }

  stop() {
    this.#isRunningRef.val(false);
    return;
  }

  obs(e) {
    this.send(hx.HxMsg.make1("obs", e));
    return;
  }

  details(id) {
    return sys.ObjUtil.coerce(this.send(hx.HxMsg.make1("details", id)).get(PointMgrActor.timeout()), sys.Str.type$.toNullable());
  }

  sync(timeout) {
    if (timeout === undefined) timeout = sys.Duration.fromStr("30sec");
    this.send(hx.HxMsg.make0("sync")).get(timeout);
    return;
  }

  forceCheck() {
    this.send(hx.HxMsg.make0("forceCheck")).get(PointMgrActor.timeout());
    return;
  }

  receive(msg) {
    if (this.#lib.spi().isFault()) {
      return null;
    }
    ;
    let mgr = sys.ObjUtil.as(concurrent.Actor.locals().get("pm"), PointMgr.type$);
    if (mgr == null) {
      if (!this.isRunning()) {
        return null;
      }
      ;
      try {
        concurrent.Actor.locals().set("pm", (mgr = sys.ObjUtil.coerce(this.#mgrType.make(sys.List.make(PointLib.type$, [this.#lib])), PointMgr.type$.toNullable())));
      }
      catch ($_u0) {
        $_u0 = sys.Err.make($_u0);
        if ($_u0 instanceof sys.Err) {
          let e = $_u0;
          ;
          this.#log.err(sys.Str.plus("Init manager ", this.#mgrType), e);
        }
        else {
          throw $_u0;
        }
      }
      ;
    }
    ;
    if (msg === PointMgrActor.checkMsg()) {
      try {
        mgr.onCheck();
      }
      catch ($_u1) {
        $_u1 = sys.Err.make($_u1);
        if ($_u1 instanceof folio.ShutdownErr) {
          let e = $_u1;
          ;
        }
        else if ($_u1 instanceof sys.Err) {
          let e = $_u1;
          ;
          this.#log.err("onCheck", e);
        }
        else {
          throw $_u1;
        }
      }
      ;
      if (this.isRunning()) {
        this.sendLater(this.#checkFreq, PointMgrActor.checkMsg());
      }
      ;
      return null;
    }
    ;
    return mgr.onReceive(sys.ObjUtil.coerce(msg, hx.HxMsg.type$));
  }

  static static$init() {
    PointMgrActor.#checkMsg = hx.HxMsg.make0("check");
    PointMgrActor.#timeout = sys.Duration.fromStr("30sec");
    return;
  }

}

class DemoMgrActor extends PointMgrActor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DemoMgrActor.type$; }

  static make(lib) {
    const $self = new DemoMgrActor();
    DemoMgrActor.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    PointMgrActor.make$($self, lib, sys.Duration.fromStr("1sec"), DemoMgr.type$);
    return;
  }

}

class PointMgr extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PointMgr.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  static make(lib) {
    const $self = new PointMgr();
    PointMgr.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    $self.#lib = lib;
    $self.#rt = lib.rt();
    $self.#log = lib.log();
    return;
  }

  onForceCheck() {
    this.onCheck();
    return null;
  }

  onDetails(id) {
    return null;
  }

  onObs(e) {
    return null;
  }

  onReceive(msg) {
    if (msg.id() === "obs") {
      return this.onObs(sys.ObjUtil.coerce(msg.a(), obs.CommitObservation.type$));
    }
    ;
    if (msg.id() === "details") {
      return this.onDetails(sys.ObjUtil.coerce(msg.a(), haystack.Ref.type$));
    }
    ;
    if (msg.id() === "forceCheck") {
      return this.onForceCheck();
    }
    ;
    if (msg.id() === "sync") {
      return null;
    }
    ;
    throw sys.Err.make(sys.Str.plus("Unknown msg: ", msg.id()));
  }

}

class DemoMgr extends PointMgr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DemoMgr.type$; }

  #db = null;

  db() { return this.#db; }

  __db(it) { if (it === undefined) return this.#db; else this.#db = it; }

  #cycle = 0;

  cycle(it) {
    if (it === undefined) {
      return this.#cycle;
    }
    else {
      this.#cycle = it;
      return;
    }
  }

  static make(lib) {
    const $self = new DemoMgr();
    DemoMgr.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    PointMgr.make$($self, lib);
    $self.#db = lib.rt().db();
    return;
  }

  onCheck() {
    const this$ = this;
    ((this$) => { let $_u2 = this$.#cycle;this$.#cycle = sys.Int.increment(this$.#cycle); return $_u2; })(this);
    let now = sys.Duration.now();
    let recs = this.#db.readAll(haystack.Filter.has("point"));
    recs.each((rec) => {
      if (rec.missing("cur")) {
        return;
      }
      ;
      if (rec.has("noDemoMode")) {
        return;
      }
      ;
      if (rec.has("curSource")) {
        return;
      }
      ;
      if (rec.has("curTracksWrite")) {
        return;
      }
      ;
      if ((rec.has("point") && sys.ObjUtil.is(rec.get("weatherStationRef"), haystack.Ref.type$))) {
        return;
      }
      ;
      if ((rec.has("schedule") || rec.has("calendar"))) {
        return;
      }
      ;
      if (this$.lib().rt().conn().isPoint(rec.id())) {
        return;
      }
      ;
      try {
        let kind = rec.get("kind");
        if (sys.ObjUtil.equals(kind, "Number")) {
          this$.checkNumber(rec);
        }
        else {
          if (sys.ObjUtil.equals(kind, "Bool")) {
            this$.checkBool(rec);
          }
          else {
            if (sys.ObjUtil.equals(kind, "Str")) {
              this$.checkStr(rec);
            }
            ;
          }
          ;
        }
        ;
      }
      catch ($_u3) {
        $_u3 = sys.Err.make($_u3);
        if ($_u3 instanceof folio.ShutdownErr) {
          let e = $_u3;
          ;
        }
        else if ($_u3 instanceof sys.Err) {
          let e = $_u3;
          ;
          e.trace();
        }
        else {
          throw $_u3;
        }
      }
      ;
      return;
    });
    return;
  }

  checkNumber(rec) {
    let range = this.toNumberRange(rec);
    let span = sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.minus(range.end(), range.start()), sys.Num.type$));
    let mid = sys.Float.plus(sys.Num.toFloat(sys.ObjUtil.coerce(range.start(), sys.Num.type$)), sys.Float.div(span, sys.Float.make(2.0)));
    let unit = haystack.Number.loadUnit(sys.ObjUtil.coerce(((this$) => { let $_u4 = rec.get("unit"); if ($_u4 != null) return $_u4; return "????"; })(this), sys.Str.type$), false);
    if (rec.has("sp")) {
      this.updatePoint(rec, haystack.Number.make(mid, unit));
      return;
    }
    ;
    let pointCycle = sys.Int.plus(this.#cycle, sys.Int.and(rec.id().hash(), 255));
    let sin = sys.Float.sin(sys.Int.divFloat(pointCycle, sys.Float.make(10.0)));
    let val = sys.Float.plus(mid, sys.Float.mult(sys.Float.divInt(span, 2), sin));
    (val = sys.Float.div(sys.Float.round(sys.Float.multInt(val, 10)), sys.Float.make(10.0)));
    this.updatePoint(rec, haystack.Number.make(val, unit));
    return;
  }

  toNumberRange(rec) {
    let min = sys.ObjUtil.as(rec.get("minVal"), haystack.Number.type$);
    let max = sys.ObjUtil.as(rec.get("maxVal"), haystack.Number.type$);
    if ((min != null && max != null)) {
      return sys.Range.make(min.toInt(), max.toInt());
    }
    ;
    let unit = ((this$) => { let $_u5 = rec.get("unit"); if ($_u5 != null) return $_u5; return "%"; })(this);
    let rand = sys.Int.mod(rec.id().hash(), 100);
    let $_u6 = unit;
    if (sys.ObjUtil.equals($_u6, "\u00b0F")) {
      return ((this$) => { if (rec.has("zone")) return sys.Range.make(66, 80); return sys.Range.make(50, 80); })(this);
    }
    else if (sys.ObjUtil.equals($_u6, "\u00b0C")) {
      return ((this$) => { if (rec.has("zone")) return sys.Range.make(18, 27); return sys.Range.make(10, 27); })(this);
    }
    else if (sys.ObjUtil.equals($_u6, "kW") || sys.ObjUtil.equals($_u6, "kWh")) {
      return sys.Range.make(sys.Int.plus(700, rand), sys.Int.plus(1000, sys.Int.mult(rand, 2)));
    }
    else if (sys.ObjUtil.equals($_u6, "inH\u2082O")) {
      return sys.Range.make(2, 0);
    }
    else {
      return sys.Range.make(0, 100);
    }
    ;
  }

  checkBool(rec) {
    if (sys.ObjUtil.compareNE(sys.Int.mod(this.#cycle, 5), 0)) {
      return;
    }
    ;
    let val = sys.ObjUtil.as(rec.get("curVal"), sys.Bool.type$);
    if (val == null) {
      (val = sys.ObjUtil.coerce(sys.ObjUtil.compareGT(sys.Range.make(1, 100).random(), 50), sys.Bool.type$.toNullable()));
    }
    ;
    this.updatePoint(rec, sys.ObjUtil.coerce(!sys.ObjUtil.coerce(val, sys.Bool.type$), sys.Obj.type$));
    return;
  }

  checkStr(rec) {
    if (sys.ObjUtil.compareNE(sys.Int.mod(this.#cycle, 5), 0)) {
      return;
    }
    ;
    let enum$ = sys.ObjUtil.as(rec.get("enum"), sys.Str.type$);
    if (enum$ == null) {
      return;
    }
    ;
    let vals = sys.Str.split(enum$, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
    if (sys.ObjUtil.compareLT(vals.size(), 2)) {
      return;
    }
    ;
    let val = sys.ObjUtil.as(rec.get("curVal"), sys.Str.type$);
    if (val == null) {
      (val = vals.first());
    }
    ;
    let index = ((this$) => { let $_u9 = vals.index(sys.ObjUtil.coerce(val, sys.Str.type$)); if ($_u9 != null) return $_u9; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this);
    ((this$) => { let $_u10 = index;index = sys.Int.increment(sys.ObjUtil.coerce(index, sys.Int.type$)); return $_u10; })(this);
    if (sys.ObjUtil.compareGE(index, vals.size())) {
      (index = sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()));
    }
    ;
    this.updatePoint(rec, vals.get(sys.ObjUtil.coerce(index, sys.Int.type$)));
    return;
  }

  updatePoint(rec,val) {
    let writeVal = rec.get("writeVal");
    if (writeVal != null) {
      (val = sys.ObjUtil.coerce(writeVal, sys.Obj.type$));
    }
    ;
    this.#db.commitAsync(folio.Diff.make(rec, haystack.Etc.makeDict2("curVal", val, "curStatus", "ok"), folio.Diff.forceTransient()));
    return;
  }

}

class PointLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PointLib.type$; }

  #observables = null;

  observables() { return this.#observables; }

  __observables(it) { if (it === undefined) return this.#observables; else this.#observables = it; }

  #enums = null;

  enums() { return this.#enums; }

  __enums(it) { if (it === undefined) return this.#enums; else this.#enums = it; }

  #hisCollectMgr = null;

  hisCollectMgr() { return this.#hisCollectMgr; }

  __hisCollectMgr(it) { if (it === undefined) return this.#hisCollectMgr; else this.#hisCollectMgr = it; }

  #writeMgr = null;

  writeMgr() { return this.#writeMgr; }

  __writeMgr(it) { if (it === undefined) return this.#writeMgr; else this.#writeMgr = it; }

  #demoMgr = null;

  demoMgr() { return this.#demoMgr; }

  __demoMgr(it) { if (it === undefined) return this.#demoMgr; else this.#demoMgr = it; }

  static make() {
    const $self = new PointLib();
    PointLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    $self.#enums = EnumDefs.make();
    $self.#hisCollectMgr = HisCollectMgrActor.make($self);
    $self.#writeMgr = WriteMgrActor.make($self);
    $self.#demoMgr = DemoMgrActor.make($self);
    $self.#observables = sys.ObjUtil.coerce(((this$) => { let $_u11 = sys.List.make(WriteObservable.type$, [this$.#writeMgr.observable()]); if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(WriteObservable.type$, [this$.#writeMgr.observable()])); })($self), sys.Type.find("obs::Observable[]"));
    return;
  }

  services() {
    return sys.List.make(WriteMgrActor.type$, [this.#writeMgr]);
  }

  hisCollectNA() {
    return this.rec().has("hisCollectNA");
  }

  onStart() {
    this.observe("obsCommits", haystack.Etc.makeDict(sys.Map.__fromLiteral(["obsAdds","obsUpdates","obsRemoves","obsAddOnInit","syncable","obsFilter"], [haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),"point"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))), PointLib.type$.slot("onPointEvent"));
    this.observe("obsCommits", haystack.Etc.makeDict(sys.Map.__fromLiteral(["obsAdds","obsUpdates","obsRemoves","obsAddOnInit","syncable","obsFilter"], [haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),"enumMeta"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))), PointLib.type$.slot("onEnumMetaEvent"));
    if (this.rec().missing("disableWritables")) {
      this.#writeMgr.start();
    }
    ;
    if (this.rec().missing("disableHisCollect")) {
      this.#hisCollectMgr.start();
    }
    ;
    if (this.rec().has("demoMode")) {
      this.#demoMgr.start();
    }
    ;
    return;
  }

  onStop() {
    this.#writeMgr.stop();
    this.#hisCollectMgr.stop();
    this.#demoMgr.stop();
    return;
  }

  onSteadyState() {
    if (this.#writeMgr.isRunning()) {
      this.#writeMgr.forceCheck();
    }
    ;
    return;
  }

  onEnumMetaEvent(e) {
    if (e == null) {
      return;
    }
    ;
    let newRec = e.newRec();
    if (newRec.has("trash")) {
      (newRec = haystack.Etc.emptyDict());
    }
    ;
    this.#enums.updateMeta(newRec, this.log());
    return;
  }

  onPointEvent(e) {
    if (e == null) {
      this.#writeMgr.sync();
      this.#hisCollectMgr.sync();
      return;
    }
    ;
    if (e.recHas("writable")) {
      this.#writeMgr.send(hx.HxMsg.make1("obs", e));
    }
    ;
    if ((PointUtil.isHisCollect(e.oldRec()) || PointUtil.isHisCollect(e.newRec()))) {
      this.#hisCollectMgr.send(hx.HxMsg.make1("obs", e));
    }
    ;
    return;
  }

}

class PointRecSet extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PointRecSet.type$; }

  #recs = null;

  // private field reflection only
  __recs(it) { if (it === undefined) return this.#recs; else this.#recs = it; }

  #cx = null;

  // private field reflection only
  __cx(it) { if (it === undefined) return this.#cx; else this.#cx = it; }

  static make(recs,cx) {
    const $self = new PointRecSet();
    PointRecSet.make$($self,recs,cx);
    return $self;
  }

  static make$($self,recs,cx) {
    if (cx === undefined) cx = sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
    $self.#recs = haystack.Etc.toRecs(recs, cx);
    $self.#cx = cx;
    return;
  }

  toSites() {
    return this.map("site", "siteRef");
  }

  toSpaces() {
    return this.map("space", "spaceRef");
  }

  toEquips() {
    return this.map("equip", "equipRef");
  }

  toDevices() {
    return this.map("device", "deviceRef");
  }

  toPoints() {
    return this.map("point", "pointRef");
  }

  map(markerTag,refTag) {
    const this$ = this;
    if (sys.ObjUtil.equals(this.#recs.size(), 1)) {
      return haystack.Etc.makeDictsGrid(null, this.mapRec(sys.ObjUtil.coerce(this.#recs.first(), haystack.Dict.type$), markerTag, refTag));
    }
    ;
    let join = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Dict"));
    this.#recs.each((rec) => {
      this$.mapRec(rec, markerTag, refTag).each((x) => {
        join.set(x.id(), x);
        return;
      });
      return;
    });
    return haystack.Etc.makeDictsGrid(null, join.vals());
  }

  mapRec(rec,markerTag,refTag) {
    if (rec.has(markerTag)) {
      return sys.List.make(haystack.Dict.type$, [rec]);
    }
    ;
    let ref = sys.ObjUtil.as(rec.get(refTag), haystack.Ref.type$);
    if (ref != null) {
      return sys.List.make(haystack.Dict.type$.toNullable(), [this.#cx.db().readById(ref)]);
    }
    ;
    if (rec.has("equip")) {
      return this.children(markerTag, "equipRef", rec.id());
    }
    ;
    if (rec.has("site")) {
      return this.children(markerTag, "siteRef", rec.id());
    }
    ;
    if (rec.has("space")) {
      return this.children(markerTag, "spaceRef", rec.id());
    }
    ;
    if (rec.has("device")) {
      return this.children(markerTag, "deviceRef", rec.id());
    }
    ;
    if (rec.has("weatherStation")) {
      return this.children(markerTag, "weatherStationRef", rec.id());
    }
    ;
    return sys.ObjUtil.coerce(haystack.Dict.type$.emptyList(), sys.Type.find("haystack::Dict[]"));
  }

  children(markerTag,parentRef,parentId) {
    return this.#cx.db().readAllList(haystack.Filter.has(markerTag).and(haystack.Filter.eq(parentRef, parentId)));
  }

}

class EnumDefs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#metaRef = concurrent.AtomicRef.make(haystack.Etc.emptyDict());
    this.#byName = concurrent.AtomicRef.make(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxPoint::EnumDef"))), sys.Type.find("[sys::Str:hxPoint::EnumDef]")));
    return;
  }

  typeof() { return EnumDefs.type$; }

  #metaRef = null;

  // private field reflection only
  __metaRef(it) { if (it === undefined) return this.#metaRef; else this.#metaRef = it; }

  #byName = null;

  // private field reflection only
  __byName(it) { if (it === undefined) return this.#byName; else this.#byName = it; }

  list() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.#byName.val(), sys.Type.find("[sys::Str:hxPoint::EnumDef]")).vals().sort((a,b) => {
      return sys.ObjUtil.compare(a.id(), b.id());
    });
  }

  get(id,checked) {
    if (checked === undefined) checked = true;
    let enum$ = sys.ObjUtil.coerce(this.#byName.val(), sys.Type.find("[sys::Str:hxPoint::EnumDef]")).get(id);
    if (enum$ != null) {
      return enum$;
    }
    ;
    if (checked) {
      throw haystack.UnknownNameErr.make(sys.Str.plus("enum def: ", id));
    }
    ;
    return null;
  }

  meta() {
    return sys.ObjUtil.coerce(this.#metaRef.val(), haystack.Dict.type$);
  }

  updateMeta(cur,log) {
    const this$ = this;
    let old = this.meta();
    if ((cur === old || sys.ObjUtil.equals(old.get("mod"), cur.get("mod")))) {
      return;
    }
    ;
    try {
      let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxPoint::EnumDef"));
      cur.each((val,name) => {
        let grid = this$.toGrid(val);
        if (grid == null) {
          return;
        }
        ;
        try {
          acc.set(name, EnumDef.make(name, sys.ObjUtil.coerce(grid, haystack.Grid.type$)));
        }
        catch ($_u12) {
          $_u12 = sys.Err.make($_u12);
          if ($_u12 instanceof sys.Err) {
            let e = $_u12;
            ;
            log.err(sys.Str.plus("Invalid enum def: ", name), e);
          }
          else {
            throw $_u12;
          }
        }
        ;
        return;
      });
      this.#byName.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("[sys::Str:hxPoint::EnumDef]")));
      this.#metaRef.val(cur);
    }
    catch ($_u13) {
      $_u13 = sys.Err.make($_u13);
      if ($_u13 instanceof sys.Err) {
        let e = $_u13;
        ;
        log.err("updateMeta", e);
      }
      else {
        throw $_u13;
      }
    }
    ;
    return;
  }

  toGrid(val) {
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Grid.type$.toNullable());
    }
    ;
    if ((sys.ObjUtil.is(val, sys.Str.type$) && sys.Str.startsWith(sys.ObjUtil.toStr(val), "ver:"))) {
      return haystack.ZincReader.make(sys.Str.in(sys.ObjUtil.toStr(val))).readGrid();
    }
    ;
    return null;
  }

  static make() {
    const $self = new EnumDefs();
    EnumDefs.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class EnumDef extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EnumDef.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #grid = null;

  grid() { return this.#grid; }

  __grid(it) { if (it === undefined) return this.#grid; else this.#grid = it; }

  #trueName = null;

  trueName() { return this.#trueName; }

  __trueName(it) { if (it === undefined) return this.#trueName; else this.#trueName = it; }

  #falseName = null;

  falseName() { return this.#falseName; }

  __falseName(it) { if (it === undefined) return this.#falseName; else this.#falseName = it; }

  #nameToCodeMap = null;

  // private field reflection only
  __nameToCodeMap(it) { if (it === undefined) return this.#nameToCodeMap; else this.#nameToCodeMap = it; }

  #codeToNameMap = null;

  // private field reflection only
  __codeToNameMap(it) { if (it === undefined) return this.#codeToNameMap; else this.#codeToNameMap = it; }

  static make(id,grid) {
    const $self = new EnumDef();
    EnumDef.make$($self,id,grid);
    return $self;
  }

  static make$($self,id,grid) {
    const this$ = $self;
    let trueName = null;
    let falseName = null;
    let nameToCodeMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number"));
    let codeToNameMap = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Number"), sys.Type.find("sys::Str"));
    grid.each((row,i) => {
      let name = sys.ObjUtil.coerce(row.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
      let code = ((this$) => { let $_u14 = sys.ObjUtil.as(row.get("code"), haystack.Number.type$); if ($_u14 != null) return $_u14; return haystack.Number.makeInt(i); })(this$);
      if ((trueName == null && sys.ObjUtil.compareNE(code.toInt(), 0))) {
        (trueName = name);
      }
      ;
      if ((falseName == null && sys.ObjUtil.equals(code.toInt(), 0))) {
        (falseName = name);
      }
      ;
      if (nameToCodeMap.get(name) == null) {
        nameToCodeMap.add(name, sys.ObjUtil.coerce(code, haystack.Number.type$));
      }
      ;
      if (codeToNameMap.get(sys.ObjUtil.coerce(code, haystack.Number.type$)) == null) {
        codeToNameMap.add(sys.ObjUtil.coerce(code, haystack.Number.type$), name);
      }
      ;
      return;
    });
    $self.#id = id;
    $self.#grid = grid;
    $self.#nameToCodeMap = sys.ObjUtil.coerce(((this$) => { let $_u15 = nameToCodeMap; if ($_u15 == null) return null; return sys.ObjUtil.toImmutable(nameToCodeMap); })($self), sys.Type.find("[sys::Str:haystack::Number]"));
    $self.#codeToNameMap = sys.ObjUtil.coerce(((this$) => { let $_u16 = codeToNameMap; if ($_u16 == null) return null; return sys.ObjUtil.toImmutable(codeToNameMap); })($self), sys.Type.find("[haystack::Number:sys::Str]"));
    $self.#trueName = sys.ObjUtil.coerce(trueName, sys.Str.type$.toNullable());
    $self.#falseName = sys.ObjUtil.coerce(falseName, sys.Str.type$.toNullable());
    return;
  }

  static makeEnumTag(enums) {
    const $self = new EnumDef();
    EnumDef.makeEnumTag$($self,enums);
    return $self;
  }

  static makeEnumTag$($self,enums) {
    const this$ = $self;
    let trueName = null;
    let falseName = null;
    let nameToCodeMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number"));
    let codeToNameMap = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Number"), sys.Type.find("sys::Str"));
    sys.Str.split(enums, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).each((name,index) => {
      let code = haystack.Number.makeInt(index);
      if ((trueName == null && sys.ObjUtil.compareNE(code.toInt(), 0))) {
        (trueName = name);
      }
      ;
      if ((falseName == null && sys.ObjUtil.equals(code.toInt(), 0))) {
        (falseName = name);
      }
      ;
      if (nameToCodeMap.get(name) == null) {
        nameToCodeMap.add(name, sys.ObjUtil.coerce(code, haystack.Number.type$));
      }
      ;
      if (codeToNameMap.get(sys.ObjUtil.coerce(code, haystack.Number.type$)) == null) {
        codeToNameMap.add(sys.ObjUtil.coerce(code, haystack.Number.type$), name);
      }
      ;
      return;
    });
    $self.#id = "self";
    $self.#nameToCodeMap = sys.ObjUtil.coerce(((this$) => { let $_u17 = nameToCodeMap; if ($_u17 == null) return null; return sys.ObjUtil.toImmutable(nameToCodeMap); })($self), sys.Type.find("[sys::Str:haystack::Number]"));
    $self.#codeToNameMap = sys.ObjUtil.coerce(((this$) => { let $_u18 = codeToNameMap; if ($_u18 == null) return null; return sys.ObjUtil.toImmutable(codeToNameMap); })($self), sys.Type.find("[haystack::Number:sys::Str]"));
    $self.#trueName = sys.ObjUtil.coerce(trueName, sys.Str.type$.toNullable());
    $self.#falseName = sys.ObjUtil.coerce(falseName, sys.Str.type$.toNullable());
    return;
  }

  size() {
    return this.#grid.size();
  }

  nameToCode(name,checked) {
    if (checked === undefined) checked = true;
    let code = this.#nameToCodeMap.get(name);
    if (code != null) {
      return code;
    }
    ;
    if (checked) {
      throw haystack.UnknownNameErr.make(sys.Str.plus("nameToCode: ", name));
    }
    ;
    return null;
  }

  codeToName(code,checked) {
    if (checked === undefined) checked = true;
    let name = this.#codeToNameMap.get(code);
    if (name != null) {
      return name;
    }
    ;
    if (checked) {
      throw haystack.UnknownNameErr.make(sys.Str.plus("codeToName: ", code));
    }
    ;
    return null;
  }

}

class WriteMgrActor extends PointMgrActor {
  constructor() {
    super();
    const this$ = this;
    this.#observable = WriteObservable.make();
    return;
  }

  typeof() { return WriteMgrActor.type$; }

  #observable = null;

  observable() { return this.#observable; }

  __observable(it) { if (it === undefined) return this.#observable; else this.#observable = it; }

  static make(lib) {
    const $self = new WriteMgrActor();
    WriteMgrActor.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    PointMgrActor.make$($self, lib, sys.Duration.fromStr("4sec"), WriteMgr.type$);
    ;
    return;
  }

  array(point) {
    return this.arrayById(point.id());
  }

  arrayById(id) {
    return sys.ObjUtil.coerce(this.send(hx.HxMsg.make1("array", id)).get(PointMgrActor.timeout()), haystack.Grid.type$);
  }

  write(point,val,level,who,opts) {
    if (opts === undefined) opts = null;
    if ((sys.ObjUtil.compareLT(level, 1) || sys.ObjUtil.compareGT(level, 17))) {
      throw sys.Err.make(sys.Str.plus("Invalid level: ", sys.ObjUtil.coerce(level, sys.Obj.type$.toNullable())));
    }
    ;
    if (sys.Str.isEmpty(sys.ObjUtil.toStr(who))) {
      throw sys.Err.make("Must provide non-empty who Str");
    }
    ;
    if (point.missing("point")) {
      throw sys.Err.make(sys.Str.plus("Missing point tag: ", point.dis()));
    }
    ;
    if (point.missing("writable")) {
      throw sys.Err.make(sys.Str.plus("Missing writable tag: ", point.dis()));
    }
    ;
    let kind = ((this$) => { let $_u19 = sys.ObjUtil.as(point.get("kind"), sys.Str.type$); if ($_u19 != null) return $_u19; throw sys.Err.make(sys.Str.plus("Missing kind tag: ", point.dis())); })(this);
    let valRef = val;
    if (sys.ObjUtil.is(valRef, haystack.Dict.type$)) {
      (val = sys.ObjUtil.trap(valRef,"val", sys.List.make(sys.Obj.type$.toNullable(), [])));
    }
    ;
    if (val != null) {
      let $_u20 = kind;
      if (sys.ObjUtil.equals($_u20, "Number")) {
        if (!sys.ObjUtil.is(val, haystack.Number.type$)) {
          throw sys.Err.make(sys.Str.plus("Invalid Number val: ", sys.ObjUtil.typeof(val)));
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u20, "Bool")) {
        if (!sys.ObjUtil.is(val, sys.Bool.type$)) {
          throw sys.Err.make(sys.Str.plus("Invalid Bool val: ", sys.ObjUtil.typeof(val)));
        }
        ;
      }
      else if (sys.ObjUtil.equals($_u20, "Str")) {
        if (!sys.ObjUtil.is(val, sys.Str.type$)) {
          throw sys.Err.make(sys.Str.plus("Invalid Str val: ", sys.ObjUtil.typeof(val)));
        }
        ;
      }
      else {
        throw sys.Err.make(sys.Str.plus("Invalid kind: ", kind));
      }
      ;
    }
    ;
    (val = PointUtil.applyUnit(point, val, "write"));
    return this.send(hx.HxMsg.make5("write", point.id(), valRef, sys.ObjUtil.coerce(level, sys.Obj.type$.toNullable()), who, opts));
  }

}

class WriteMgr extends PointMgr {
  constructor() {
    super();
    const this$ = this;
    this.#needFirstFire = true;
    this.#points = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("hxPoint::WriteRec"));
    return;
  }

  typeof() { return WriteMgr.type$; }

  #needFirstFire = false;

  // private field reflection only
  __needFirstFire(it) { if (it === undefined) return this.#needFirstFire; else this.#needFirstFire = it; }

  #points = null;

  // private field reflection only
  __points(it) { if (it === undefined) return this.#points; else this.#points = it; }

  static make(lib) {
    const $self = new WriteMgr();
    WriteMgr.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    PointMgr.make$($self, lib);
    ;
    return;
  }

  onReceive(msg) {
    if (msg.id() === "write") {
      return this.get(sys.ObjUtil.coerce(msg.a(), haystack.Ref.type$)).write(this, msg.b(), sys.ObjUtil.coerce(msg.c(), sys.Int.type$), sys.ObjUtil.coerce(msg.d(), sys.Obj.type$), sys.ObjUtil.coerce(msg.e(), haystack.Dict.type$.toNullable()));
    }
    ;
    if (msg.id() === "array") {
      return this.get(sys.ObjUtil.coerce(msg.a(), haystack.Ref.type$)).toGrid();
    }
    ;
    return PointMgr.prototype.onReceive.call(this, msg);
  }

  onCheck() {
    const this$ = this;
    if ((this.#needFirstFire && this.rt().isSteadyState())) {
      this.#needFirstFire = false;
      this.fireFirstObservations();
    }
    ;
    let now = sys.Duration.now();
    this.#points.each((pt) => {
      pt.check(this$, now);
      return;
    });
    return;
  }

  get(id) {
    return sys.ObjUtil.coerce(((this$) => { let $_u21 = this$.#points.get(id); if ($_u21 != null) return $_u21; throw sys.Err.make(sys.Str.plus("Not writable point: ", id.toZinc())); })(this), WriteRec.type$);
  }

  onObs(e) {
    try {
      if (e.newRec().has("writable")) {
        let pt = this.#points.get(e.id());
        if (pt == null) {
          this.#points.set(e.id(), sys.ObjUtil.coerce((pt = WriteRec.make(this, e.id(), e.newRec())), WriteRec.type$));
        }
        ;
        pt.updateRec(e.newRec());
      }
      else {
        this.#points.remove(e.id());
      }
      ;
    }
    catch ($_u22) {
      $_u22 = sys.Err.make($_u22);
      if ($_u22 instanceof sys.Err) {
        let err = $_u22;
        ;
        this.log().err("WriteMgr.onObs", err);
      }
      else {
        throw $_u22;
      }
    }
    ;
    return null;
  }

  sink(writeRec,val,level,who) {
    let rec = writeRec.rec();
    let changes = this.sinkChanges(rec, val, level);
    this.rt().db().commitAsync(folio.Diff.make(rec, changes, folio.Diff.forceTransient()));
    return;
  }

  sinkChanges(rec,val,level) {
    if (val == null) {
      (val = haystack.Remove.val());
    }
    ;
    let curTracks = rec.has("curTracksWrite");
    if (curTracks) {
      return haystack.Etc.makeDict4("curVal", val, "curStatus", "ok", "writeVal", val, "writeLevel", level);
    }
    ;
    return haystack.Etc.makeDict2("writeVal", val, "writeLevel", level);
  }

  fireFirstObservations() {
    const this$ = this;
    this.#points.each((pt) => {
      this$.fireObservation(pt, pt.lastVal(), sys.ObjUtil.coerce(pt.lastLevel(), haystack.Number.type$), "first", null, true, true);
      return;
    });
    return;
  }

  fireObservation(writeRec,val,level,who,opts,effectiveChange,first) {
    const this$ = this;
    let observable = this.lib().writeMgr().observable();
    if (!observable.hasSubscriptions()) {
      return;
    }
    ;
    let ts = sys.DateTime.now();
    let rec = writeRec.rec();
    let eventEff = null;
    let eventAll = null;
    observable.subscriptions().each(sys.ObjUtil.coerce((sub) => {
      if ((!effectiveChange && !sub.isAllWrites())) {
        return;
      }
      ;
      if (!sub.include(rec)) {
        return;
      }
      ;
      if (sub.isAllWrites()) {
        if (eventAll == null) {
          (eventAll = WriteObservation.make(observable, ts, writeRec.id(), rec, val, level, sys.ObjUtil.coerce(who, sys.Obj.type$), opts, first));
        }
        ;
        sub.send(sys.ObjUtil.coerce(eventAll, obs.Observation.type$));
      }
      else {
        if (eventEff == null) {
          (eventEff = WriteObservation.make(observable, ts, writeRec.id(), rec, writeRec.lastVal(), sys.ObjUtil.coerce(writeRec.lastLevel(), haystack.Number.type$), sys.ObjUtil.coerce(who, sys.Obj.type$), opts, first));
        }
        ;
        sub.send(sys.ObjUtil.coerce(eventEff, obs.Observation.type$));
      }
      ;
      return;
    }, sys.Type.find("|obs::Subscription,sys::Int->sys::Void|")));
    return;
  }

  onDetails(id) {
    let pt = this.#points.get(id);
    if (pt == null) {
      return null;
    }
    ;
    return pt.toDetails();
  }

}

class PointConvert extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PointConvert.type$; }

  static #cache = undefined;

  static cache() {
    if (PointConvert.#cache === undefined) {
      PointConvert.static$init();
      if (PointConvert.#cache === undefined) PointConvert.#cache = null;
    }
    return PointConvert.#cache;
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    let val = PointConvert.cache().get(s);
    if (val == null) {
      try {
        (val = ConvertParser.make(s).parse());
      }
      catch ($_u23) {
        $_u23 = sys.Err.make($_u23);
        if ($_u23 instanceof sys.ParseErr) {
          let e = $_u23;
          ;
          (val = sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.Str.toCode(s)), ": "), e.msg()), e));
        }
        else if ($_u23 instanceof sys.Err) {
          let e = $_u23;
          ;
          (val = sys.ParseErr.make(s, e));
        }
        else {
          throw $_u23;
        }
      }
      ;
      PointConvert.cache().set(s, sys.ObjUtil.coerce(val, sys.Obj.type$));
    }
    ;
    if (sys.ObjUtil.is(val, PointConvert.type$)) {
      return sys.ObjUtil.coerce(val, PointConvert.type$.toNullable());
    }
    ;
    if (checked) {
      let err = sys.ObjUtil.coerce(val, sys.Err.type$);
      throw sys.ParseErr.make(err.msg(), err.cause());
    }
    ;
    return null;
  }

  static make() {
    const $self = new PointConvert();
    PointConvert.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    PointConvert.#cache = concurrent.ConcurrentMap.make();
    return;
  }

}

class ConvertParser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConvertParser.type$; }

  static #tokenSeps = undefined;

  static tokenSeps() {
    if (ConvertParser.#tokenSeps === undefined) {
      ConvertParser.static$init();
      if (ConvertParser.#tokenSeps === undefined) ConvertParser.#tokenSeps = null;
    }
    return ConvertParser.#tokenSeps;
  }

  static #eof = undefined;

  static eof() {
    if (ConvertParser.#eof === undefined) {
      ConvertParser.static$init();
      if (ConvertParser.#eof === undefined) ConvertParser.#eof = null;
    }
    return ConvertParser.#eof;
  }

  #toks = null;

  // private field reflection only
  __toks(it) { if (it === undefined) return this.#toks; else this.#toks = it; }

  #cur = null;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #curi = 0;

  // private field reflection only
  __curi(it) { if (it === undefined) return this.#curi; else this.#curi = it; }

  static make(s) {
    const $self = new ConvertParser();
    ConvertParser.make$($self,s);
    return $self;
  }

  static make$($self,s) {
    $self.#toks = ConvertParser.tokenize(s);
    if ($self.#toks.isEmpty()) {
      throw sys.ParseErr.make("Empty string");
    }
    ;
    $self.#cur = sys.ObjUtil.coerce($self.#toks.first(), sys.Str.type$);
    return;
  }

  parse() {
    let expr = this.parseExpr();
    if (sys.ObjUtil.compareGE(this.#curi, this.#toks.size())) {
      return expr;
    }
    ;
    let pipeline = sys.List.make(PointConvert.type$, [expr]);
    while (sys.ObjUtil.compareLT(this.#curi, this.#toks.size())) {
      pipeline.add(this.parseExpr());
    }
    ;
    return PipelineConvert.make(pipeline);
  }

  parseExpr() {
    if (sys.ObjUtil.equals(this.#cur, "+")) {
      return this.parseAdd();
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, "-")) {
      return this.parseSub();
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, "*")) {
      return this.parseMul();
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, "/")) {
      return this.parseDiv();
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, "&")) {
      return this.parseAnd();
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, "|")) {
      return this.parseOr();
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, "^")) {
      return this.parseXor();
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, ">>")) {
      return this.parseShiftr();
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, "<<")) {
      return this.parseShiftl();
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, "?:")) {
      return this.parseElvis();
    }
    ;
    if (sys.Str.startsWith(this.#cur, "-")) {
      return this.parseSubAtomic();
    }
    ;
    return this.parseFuncOrUnit();
  }

  parseAdd() {
    this.consume("+");
    return AddConvert.make(this.consumeFloat());
  }

  parseSub() {
    this.consume("-");
    return SubConvert.make(this.consumeFloat());
  }

  parseMul() {
    this.consume("*");
    return MulConvert.make(this.consumeFloat());
  }

  parseDiv() {
    this.consume("/");
    return DivConvert.make(this.consumeFloat());
  }

  parseAnd() {
    this.consume("&");
    return AndConvert.make(this.consumeInt());
  }

  parseOr() {
    this.consume("|");
    return OrConvert.make(this.consumeInt());
  }

  parseXor() {
    this.consume("^");
    return XorConvert.make(this.consumeInt());
  }

  parseShiftr() {
    this.consume(">>");
    return ShiftrConvert.make(this.consumeInt());
  }

  parseShiftl() {
    this.consume("<<");
    return ShiftlConvert.make(this.consumeInt());
  }

  parseElvis() {
    this.consume("?:");
    return ElvisConvert.make(this.consumeLiteral());
  }

  parseSubAtomic() {
    let tok = sys.Str.getRange(this.consume(null), sys.Range.make(1, -1));
    let f = sys.Float.fromStr(tok, false);
    if (f == null) {
      throw sys.ParseErr.make(sys.Str.plus("Expecting float, not ", tok));
    }
    ;
    return SubConvert.make(sys.ObjUtil.coerce(f, sys.Float.type$));
  }

  parseFuncOrUnit() {
    let name = this.consume(null);
    if (sys.ObjUtil.equals(this.#cur, "=>")) {
      return this.parseUnit(name);
    }
    else {
      return this.parseFunc(name);
    }
    ;
  }

  parseUnit(from$) {
    this.consume("=>");
    let to = this.consume(null);
    return UnitConvert.make(from$, to);
  }

  parseFunc(name) {
    let args = sys.List.make(sys.Str.type$);
    this.consume("(");
    if (sys.ObjUtil.compareNE(this.#cur, ")")) {
      while (true) {
        let s = sys.StrBuf.make();
        s.add(this.consume(null));
        while ((sys.ObjUtil.compareNE(this.#cur, ",") && sys.ObjUtil.compareNE(this.#cur, ")"))) {
          s.addChar(32).add(this.consume(null));
        }
        ;
        args.add(s.toStr());
        if (sys.ObjUtil.equals(this.#cur, ")")) {
          break;
        }
        ;
        this.consume(",");
      }
      ;
    }
    ;
    this.consume(")");
    let $_u24 = name;
    if (sys.ObjUtil.equals($_u24, "pow")) {
      return PowConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "min")) {
      return MinConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "max")) {
      return MaxConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "reset")) {
      return ResetConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "toStr")) {
      return ToStrConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "invert")) {
      return InvertConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "as")) {
      return AsConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "thermistor")) {
      return ThermistorConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "u2SwapEndian")) {
      return U2SwapEndianConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "u4SwapEndian")) {
      return U4SwapEndianConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "enumStrToNumber")) {
      return EnumStrToNumberConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "enumNumberToStr")) {
      return EnumNumberToStrConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "enumStrToBool")) {
      return EnumStrToBoolConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "enumBoolToStr")) {
      return EnumBoolToStrConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "numberToBool")) {
      return NumberToBoolConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "numberToStr")) {
      return NumberToStrConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "numberToHex")) {
      return NumberToHexConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "boolToNumber")) {
      return BoolToNumberConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "strToBool")) {
      return StrToBoolConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "strToNumber")) {
      return StrToNumberConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "hexToNumber")) {
      return HexToNumberConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "lower")) {
      return LowerConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "upper")) {
      return UpperConvert.make(args);
    }
    else if (sys.ObjUtil.equals($_u24, "strReplace")) {
      return StrReplaceConvert.make(args);
    }
    else {
      throw sys.ParseErr.make(sys.Str.plus("Unknown convert func: ", name));
    }
    ;
  }

  consumeLiteral() {
    let tok = this.consume(null);
    if (sys.Str.isEmpty(tok)) {
      throw sys.ParseErr.make("Expecting literal");
    }
    ;
    let num = haystack.Number.fromStr(tok, false);
    if (num != null) {
      return num;
    }
    ;
    if (sys.ObjUtil.equals(tok, "true")) {
      return sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.equals(tok, "false")) {
      return sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.equals(tok, "NA")) {
      return haystack.NA.val();
    }
    ;
    if (!sys.Int.isAlpha(sys.Str.get(tok, 0))) {
      throw sys.ParseErr.make("Expecting literal");
    }
    ;
    return tok;
  }

  consumeFloat() {
    let tok = this.consume(null);
    let f = sys.Float.fromStr(tok, false);
    if (f == null) {
      throw sys.ParseErr.make(sys.Str.plus("Expecting float, not ", tok));
    }
    ;
    return sys.ObjUtil.coerce(f, sys.Float.type$);
  }

  consumeInt() {
    let tok = this.consume(null);
    let i = ((this$) => { if (sys.Str.startsWith(tok, "0x")) return sys.Int.fromStr(sys.Str.getRange(tok, sys.Range.make(2, -1)), 16, false); return sys.Int.fromStr(tok, 10, false); })(this);
    if (i == null) {
      throw sys.ParseErr.make(sys.Str.plus("Expecting int, not ", tok));
    }
    ;
    return sys.ObjUtil.coerce(i, sys.Int.type$);
  }

  consume(expected) {
    if (sys.ObjUtil.equals(this.#cur, ConvertParser.eof())) {
      throw sys.Err.make("Unexpected end of string");
    }
    ;
    let old = this.#cur;
    if ((expected != null && sys.ObjUtil.compareNE(this.#cur, expected))) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected ", expected), " not "), this.#cur));
    }
    ;
    this.#cur = sys.ObjUtil.coerce(((this$) => { let $_u26 = this$.#toks.getSafe(this$.#curi = sys.Int.increment(this$.#curi)); if ($_u26 != null) return $_u26; return ConvertParser.eof(); })(this), sys.Str.type$);
    return old;
  }

  static tokenize(s) {
    (s = sys.Str.trim(s));
    let acc = sys.List.make(sys.Str.type$);
    let start = 0;
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(s)); i = sys.Int.increment(i)) {
      let ch = sys.Str.get(s, i);
      if ((sys.ObjUtil.compareLT(ch, sys.Str.size(ConvertParser.tokenSeps())) && sys.ObjUtil.equals(sys.Str.get(ConvertParser.tokenSeps(), ch), 120))) {
        let next = ((this$) => { if (sys.ObjUtil.compareLT(sys.Int.plus(i, 1), sys.Str.size(s))) return sys.Str.get(s, sys.Int.plus(i, 1)); return 0; })(this);
        if ((sys.ObjUtil.equals(ch, 47) && sys.Int.isAlpha(next))) {
          continue;
        }
        ;
        if (sys.ObjUtil.compareLT(start, i)) {
          acc.add(sys.Str.getRange(s, sys.Range.make(start, i, true)));
        }
        ;
        if (!sys.Int.isSpace(ch)) {
          let opStart = i;
          if ((sys.ObjUtil.equals(ch, 60) && sys.ObjUtil.equals(next, 60))) {
            i = sys.Int.increment(i);
          }
          ;
          if ((sys.ObjUtil.equals(ch, 62) && sys.ObjUtil.equals(next, 62))) {
            i = sys.Int.increment(i);
          }
          ;
          if ((sys.ObjUtil.equals(ch, 61) && sys.ObjUtil.equals(next, 62))) {
            i = sys.Int.increment(i);
          }
          ;
          acc.add(sys.Str.getRange(s, sys.Range.make(opStart, i)));
        }
        ;
        (start = sys.Int.plus(i, 1));
      }
      else {
        if (sys.ObjUtil.equals(ch, 39)) {
          (start = sys.Int.plus(i, 1));
          ((this$) => { let $_u28 = i;i = sys.Int.increment(i); return $_u28; })(this);
          while ((sys.ObjUtil.compareLT(i, sys.Str.size(s)) && sys.ObjUtil.compareNE(sys.Str.get(s, i), 39))) {
            ((this$) => { let $_u29 = i;i = sys.Int.increment(i); return $_u29; })(this);
          }
          ;
          if (sys.ObjUtil.compareGE(i, sys.Str.size(s))) {
            throw sys.Err.make("Missing end quote");
          }
          ;
          acc.add(sys.Str.getRange(s, sys.Range.make(start, i, true)));
          (start = sys.Int.plus(i, 1));
        }
        ;
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareLT(start, sys.Str.size(s))) {
      acc.add(sys.Str.getRange(s, sys.Range.make(start, -1)));
    }
    ;
    return acc;
  }

  static main(args) {
    const this$ = this;
    sys.ObjUtil.echo("0123456789_123456789");
    sys.ObjUtil.echo(args.first());
    sys.ObjUtil.echo("--------------");
    ConvertParser.tokenize(sys.ObjUtil.coerce(args.first(), sys.Str.type$)).each((tok) => {
      sys.ObjUtil.echo(sys.Str.toCode(tok));
      return;
    });
    return;
  }

  static static$init() {
    if (true) {
      let seps = " \t+*/&|^<>(,)=";
      let s = sys.StrBuf.make();
      for (let i = 0; sys.ObjUtil.compareLT(i, 128); i = sys.Int.increment(i)) {
        s.addChar(((this$) => { if (sys.Str.containsChar(seps, i)) return 120; return 32; })(this));
      }
      ;
      ConvertParser.#tokenSeps = s.toStr();
    }
    ;
    ConvertParser.#eof = "<end>";
    return;
  }

}

class PipelineConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PipelineConvert.type$; }

  #pipeline = null;

  pipeline() { return this.#pipeline; }

  __pipeline(it) { if (it === undefined) return this.#pipeline; else this.#pipeline = it; }

  static make(p) {
    const $self = new PipelineConvert();
    PipelineConvert.make$($self,p);
    return $self;
  }

  static make$($self,p) {
    PointConvert.make$($self);
    $self.#pipeline = sys.ObjUtil.coerce(((this$) => { let $_u31 = p; if ($_u31 == null) return null; return sys.ObjUtil.toImmutable(p); })($self), sys.Type.find("hxPoint::PointConvert[]"));
    return;
  }

  toStr() {
    return this.#pipeline.join(" ");
  }

  convert(lib,rec,val) {
    for (let i = 0; sys.ObjUtil.compareLT(i, this.#pipeline.size()); i = sys.Int.increment(i)) {
      (val = this.#pipeline.get(i).convert(lib, rec, val));
    }
    ;
    return val;
  }

}

class MathConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MathConvert.type$; }

  #x = sys.Float.make(0);

  x() { return this.#x; }

  __x(it) { if (it === undefined) return this.#x; else this.#x = it; }

  static make(x) {
    const $self = new MathConvert();
    MathConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    PointConvert.make$($self);
    $self.#x = x;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.symbol()), " "), sys.ObjUtil.coerce(this.#x, sys.Obj.type$.toNullable()));
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    return haystack.Number.make(this.doConvert(num.toFloat()), num.unit());
  }

}

class AddConvert extends MathConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AddConvert.type$; }

  static make(x) {
    const $self = new AddConvert();
    AddConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    MathConvert.make$($self, x);
    return;
  }

  symbol() {
    return "+";
  }

  doConvert(f) {
    return sys.Float.plus(f, this.x());
  }

}

class SubConvert extends MathConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SubConvert.type$; }

  static make(x) {
    const $self = new SubConvert();
    SubConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    MathConvert.make$($self, x);
    return;
  }

  symbol() {
    return "-";
  }

  doConvert(f) {
    return sys.Float.minus(f, this.x());
  }

}

class MulConvert extends MathConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MulConvert.type$; }

  static make(x) {
    const $self = new MulConvert();
    MulConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    MathConvert.make$($self, x);
    return;
  }

  symbol() {
    return "*";
  }

  doConvert(f) {
    return sys.Float.mult(f, this.x());
  }

}

class DivConvert extends MathConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DivConvert.type$; }

  static make(x) {
    const $self = new DivConvert();
    DivConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    MathConvert.make$($self, x);
    if (sys.ObjUtil.equals(x, sys.Float.make(0.0))) {
      throw sys.ParseErr.make("/ zero");
    }
    ;
    return;
  }

  symbol() {
    return "/";
  }

  doConvert(f) {
    return sys.Float.div(f, this.x());
  }

}

class BitConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BitConvert.type$; }

  #x = 0;

  x() { return this.#x; }

  __x(it) { if (it === undefined) return this.#x; else this.#x = it; }

  static make(x) {
    const $self = new BitConvert();
    BitConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    PointConvert.make$($self);
    $self.#x = x;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.symbol()), " 0x"), sys.Int.toHex(this.#x));
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    return haystack.Number.makeInt(this.doConvert(num.toInt()), num.unit());
  }

}

class AndConvert extends BitConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AndConvert.type$; }

  static make(x) {
    const $self = new AndConvert();
    AndConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    BitConvert.make$($self, x);
    return;
  }

  symbol() {
    return "&";
  }

  doConvert(v) {
    return sys.Int.and(v, this.x());
  }

}

class OrConvert extends BitConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return OrConvert.type$; }

  static make(x) {
    const $self = new OrConvert();
    OrConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    BitConvert.make$($self, x);
    return;
  }

  symbol() {
    return "|";
  }

  doConvert(v) {
    return sys.Int.or(v, this.x());
  }

}

class XorConvert extends BitConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XorConvert.type$; }

  static make(x) {
    const $self = new XorConvert();
    XorConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    BitConvert.make$($self, x);
    return;
  }

  symbol() {
    return "^";
  }

  doConvert(v) {
    return sys.Int.xor(v, this.x());
  }

}

class ShiftrConvert extends BitConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShiftrConvert.type$; }

  static make(x) {
    const $self = new ShiftrConvert();
    ShiftrConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    BitConvert.make$($self, x);
    return;
  }

  symbol() {
    return ">>";
  }

  doConvert(v) {
    return sys.Int.shiftr(v, this.x());
  }

}

class ShiftlConvert extends BitConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ShiftlConvert.type$; }

  static make(x) {
    const $self = new ShiftlConvert();
    ShiftlConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    BitConvert.make$($self, x);
    return;
  }

  symbol() {
    return "<<";
  }

  doConvert(v) {
    return sys.Int.shiftl(v, this.x());
  }

}

class ElvisConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ElvisConvert.type$; }

  #x = null;

  x() { return this.#x; }

  __x(it) { if (it === undefined) return this.#x; else this.#x = it; }

  static make(x) {
    const $self = new ElvisConvert();
    ElvisConvert.make$($self,x);
    return $self;
  }

  static make$($self,x) {
    PointConvert.make$($self);
    $self.#x = ((this$) => { let $_u32 = x; if ($_u32 == null) return null; return sys.ObjUtil.toImmutable(x); })($self);
    return;
  }

  toStr() {
    return sys.Str.plus("?: ", this.#x);
  }

  convert(lib,rec,v) {
    return ((this$) => { let $_u33 = v; if ($_u33 != null) return $_u33; return this$.#x; })(this);
  }

}

class UnitConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnitConvert.type$; }

  #from = null;

  from() { return this.#from; }

  __from(it) { if (it === undefined) return this.#from; else this.#from = it; }

  #to = null;

  to() { return this.#to; }

  __to(it) { if (it === undefined) return this.#to; else this.#to = it; }

  static make(from$,to) {
    const $self = new UnitConvert();
    UnitConvert.make$($self,from$,to);
    return $self;
  }

  static make$($self,from$,to) {
    PointConvert.make$($self);
    $self.#from = sys.ObjUtil.coerce(((this$) => { let $_u34 = sys.Unit.fromStr(from$, false); if ($_u34 != null) return $_u34; throw sys.ParseErr.make(sys.Str.plus("Unknown unit: ", from$)); })($self), sys.Unit.type$);
    $self.#to = sys.ObjUtil.coerce(((this$) => { let $_u35 = sys.Unit.fromStr(to, false); if ($_u35 != null) return $_u35; throw sys.ParseErr.make(sys.Str.plus("Unknown unit: ", to)); })($self), sys.Unit.type$);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#from), " => "), this.#to);
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    if ((num.unit() != null && sys.ObjUtil.compareNE(num.unit(), this.#from))) {
      throw haystack.UnitErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("val unit != from unit: ", num.unit()), " != "), this.#from));
    }
    ;
    return haystack.Number.make(this.#from.convertTo(num.toFloat(), this.#to), this.#to);
  }

}

class ToStrConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ToStrConvert.type$; }

  static make(args) {
    const $self = new ToStrConvert();
    ToStrConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 0)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0"));
    }
    ;
    return;
  }

  toStr() {
    return "toStr()";
  }

  convert(lib,rec,val) {
    if (val == null) {
      return "null";
    }
    ;
    return sys.ObjUtil.toStr(val);
  }

}

class AsConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsConvert.type$; }

  #to = null;

  to() { return this.#to; }

  __to(it) { if (it === undefined) return this.#to; else this.#to = it; }

  static make(args) {
    const $self = new AsConvert();
    AsConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 1)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args: ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 1"));
    }
    ;
    $self.#to = sys.ObjUtil.coerce(((this$) => { let $_u36 = sys.Unit.fromStr(sys.ObjUtil.coerce(args.first(), sys.Str.type$), false); if ($_u36 != null) return $_u36; throw sys.ParseErr.make(sys.Str.plus("Unknown unit: ", args.first())); })($self), sys.Unit.type$);
    return;
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    return haystack.Number.make(num.toFloat(), this.#to);
  }

}

class InvertConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InvertConvert.type$; }

  static make(args) {
    const $self = new InvertConvert();
    InvertConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 0)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0"));
    }
    ;
    return;
  }

  toStr() {
    return "invert()";
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    return sys.ObjUtil.coerce(sys.Bool.not(sys.ObjUtil.coerce(val, sys.Bool.type$)), sys.Obj.type$.toNullable());
  }

}

class PowConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PowConvert.type$; }

  #exp = sys.Float.make(0);

  exp() { return this.#exp; }

  __exp(it) { if (it === undefined) return this.#exp; else this.#exp = it; }

  static make(args) {
    const $self = new PowConvert();
    PowConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 1)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 1"));
    }
    ;
    $self.#exp = sys.ObjUtil.coerce(sys.Str.toFloat(args.get(0)), sys.Float.type$);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("pow(", sys.ObjUtil.coerce(this.#exp, sys.Obj.type$.toNullable())), ")");
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    let in$ = num.toFloat();
    let out = sys.Float.pow(in$, this.#exp);
    return haystack.Number.make(out, num.unit());
  }

}

class MinConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MinConvert.type$; }

  #limit = sys.Float.make(0);

  limit() { return this.#limit; }

  __limit(it) { if (it === undefined) return this.#limit; else this.#limit = it; }

  static make(args) {
    const $self = new MinConvert();
    MinConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 1)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 1"));
    }
    ;
    $self.#limit = sys.ObjUtil.coerce(sys.Str.toFloat(args.get(0)), sys.Float.type$);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("min(", sys.ObjUtil.coerce(this.#limit, sys.Obj.type$.toNullable())), ")");
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    let in$ = num.toFloat();
    if (sys.ObjUtil.compareLE(in$, this.#limit)) {
      return num;
    }
    ;
    return haystack.Number.make(this.#limit, num.unit());
  }

}

class MaxConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MaxConvert.type$; }

  #limit = sys.Float.make(0);

  limit() { return this.#limit; }

  __limit(it) { if (it === undefined) return this.#limit; else this.#limit = it; }

  static make(args) {
    const $self = new MaxConvert();
    MaxConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 1)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 1"));
    }
    ;
    $self.#limit = sys.ObjUtil.coerce(sys.Str.toFloat(args.get(0)), sys.Float.type$);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("max(", sys.ObjUtil.coerce(this.#limit, sys.Obj.type$.toNullable())), ")");
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    let in$ = num.toFloat();
    if (sys.ObjUtil.compareGE(in$, this.#limit)) {
      return num;
    }
    ;
    return haystack.Number.make(this.#limit, num.unit());
  }

}

class ResetConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ResetConvert.type$; }

  #inLo = sys.Float.make(0);

  inLo() { return this.#inLo; }

  __inLo(it) { if (it === undefined) return this.#inLo; else this.#inLo = it; }

  #inHi = sys.Float.make(0);

  inHi() { return this.#inHi; }

  __inHi(it) { if (it === undefined) return this.#inHi; else this.#inHi = it; }

  #outLo = sys.Float.make(0);

  outLo() { return this.#outLo; }

  __outLo(it) { if (it === undefined) return this.#outLo; else this.#outLo = it; }

  #outHi = sys.Float.make(0);

  outHi() { return this.#outHi; }

  __outHi(it) { if (it === undefined) return this.#outHi; else this.#outHi = it; }

  static make(args) {
    const $self = new ResetConvert();
    ResetConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 4)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 4"));
    }
    ;
    $self.#inLo = sys.ObjUtil.coerce(sys.Str.toFloat(args.get(0)), sys.Float.type$);
    $self.#inHi = sys.ObjUtil.coerce(sys.Str.toFloat(args.get(1)), sys.Float.type$);
    $self.#outLo = sys.ObjUtil.coerce(sys.Str.toFloat(args.get(2)), sys.Float.type$);
    $self.#outHi = sys.ObjUtil.coerce(sys.Str.toFloat(args.get(3)), sys.Float.type$);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("reset(", sys.ObjUtil.coerce(this.#inLo, sys.Obj.type$.toNullable())), ","), sys.ObjUtil.coerce(this.#inHi, sys.Obj.type$.toNullable())), ","), sys.ObjUtil.coerce(this.#outLo, sys.Obj.type$.toNullable())), ","), sys.ObjUtil.coerce(this.#outHi, sys.Obj.type$.toNullable())), ")");
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    let in$ = num.toFloat();
    if (sys.ObjUtil.compareLT(in$, this.#inLo)) {
      (in$ = this.#inLo);
    }
    ;
    if (sys.ObjUtil.compareGT(in$, this.#inHi)) {
      (in$ = this.#inHi);
    }
    ;
    let inDiff = sys.Float.abs(sys.Float.minus(this.#inHi, this.#inLo));
    let outDiff = sys.Float.abs(sys.Float.minus(this.#outHi, this.#outLo));
    let out = sys.Float.mult(sys.Float.div(sys.Float.minus(in$, this.#inLo), inDiff), outDiff);
    if (sys.ObjUtil.compareLT(this.#outHi, this.#outLo)) {
      (out = sys.Float.minus(this.#outLo, out));
    }
    else {
      (out = sys.Float.plus(this.#outLo, out));
    }
    ;
    return haystack.Number.make(out, num.unit());
  }

}

class U2SwapEndianConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return U2SwapEndianConvert.type$; }

  static make(args) {
    const $self = new U2SwapEndianConvert();
    U2SwapEndianConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 0)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0"));
    }
    ;
    return;
  }

  toStr() {
    return "u2SwapEndian()";
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    let int = num.toInt();
    let swap = sys.Int.or(sys.Int.and(sys.Int.shiftr(int, 8), 255), sys.Int.shiftl(sys.Int.and(int, 255), 8));
    return haystack.Number.makeInt(swap, num.unit());
  }

}

class U4SwapEndianConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return U4SwapEndianConvert.type$; }

  static make(args) {
    const $self = new U4SwapEndianConvert();
    U4SwapEndianConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 0)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0"));
    }
    ;
    return;
  }

  toStr() {
    return "u4SwapEndian()";
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    let int = num.toInt();
    let swap = sys.Int.or(sys.Int.or(sys.Int.or(sys.Int.shiftr(sys.Int.and(int, 4278190080), 24), sys.Int.shiftr(sys.Int.and(int, 16711680), 8)), sys.Int.shiftl(sys.Int.and(int, 65280), 8)), sys.Int.shiftl(sys.Int.and(int, 255), 24));
    return haystack.Number.makeInt(swap, num.unit());
  }

}

class EnumConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EnumConvert.type$; }

  #enumId = null;

  enumId() { return this.#enumId; }

  __enumId(it) { if (it === undefined) return this.#enumId; else this.#enumId = it; }

  #checked = false;

  checked() { return this.#checked; }

  __checked(it) { if (it === undefined) return this.#checked; else this.#checked = it; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  static make(args,funcName,useChecked) {
    const $self = new EnumConvert();
    EnumConvert.make$($self,args,funcName,useChecked);
    return $self;
  }

  static make$($self,args,funcName,useChecked) {
    if (useChecked === undefined) useChecked = true;
    PointConvert.make$($self);
    if ((sys.ObjUtil.compareNE(args.size(), 1) && sys.ObjUtil.compareNE(args.size(), 2))) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 1 or 2"));
    }
    ;
    $self.#enumId = args.get(0);
    $self.#checked = sys.ObjUtil.coerce(sys.Str.toBool(args.getSafe(1, "true")), sys.Bool.type$);
    $self.#toStr = ((this$) => { if (useChecked) return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", funcName), "("), this$.#enumId), ","), sys.ObjUtil.coerce(this$.#checked, sys.Obj.type$.toNullable())), ")"); return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", funcName), "("), this$.#enumId), ")"); })($self);
    return;
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let def = ((this$) => { if (sys.ObjUtil.equals(this$.#enumId, "self")) return EnumDef.makeEnumTag(sys.ObjUtil.coerce(rec.trap("enum", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)); return lib.enums().get(this$.#enumId); })(this);
    return this.doConvert(sys.ObjUtil.coerce(def, EnumDef.type$), sys.ObjUtil.coerce(val, sys.Obj.type$));
  }

}

class EnumStrToNumberConvert extends EnumConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EnumStrToNumberConvert.type$; }

  static make(args) {
    const $self = new EnumStrToNumberConvert();
    EnumStrToNumberConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    EnumConvert.make$($self, args, "enumStrToNumber");
    return;
  }

  doConvert(enum$,val) {
    return enum$.nameToCode(sys.ObjUtil.coerce(val, sys.Str.type$), this.checked());
  }

}

class EnumNumberToStrConvert extends EnumConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EnumNumberToStrConvert.type$; }

  static make(args) {
    const $self = new EnumNumberToStrConvert();
    EnumNumberToStrConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    EnumConvert.make$($self, args, "enumNumberToStr");
    return;
  }

  doConvert(enum$,val) {
    return enum$.codeToName(sys.ObjUtil.coerce(val, haystack.Number.type$), this.checked());
  }

}

class EnumStrToBoolConvert extends EnumConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EnumStrToBoolConvert.type$; }

  static make(args) {
    const $self = new EnumStrToBoolConvert();
    EnumStrToBoolConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    EnumConvert.make$($self, args, "enumStrToBool");
    return;
  }

  doConvert(enum$,val) {
    let code = enum$.nameToCode(sys.ObjUtil.coerce(val, sys.Str.type$), this.checked());
    if (code == null) {
      return null;
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.compareNE(code.toInt(), 0), sys.Obj.type$.toNullable());
  }

}

class EnumBoolToStrConvert extends EnumConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EnumBoolToStrConvert.type$; }

  static make(args) {
    const $self = new EnumBoolToStrConvert();
    EnumBoolToStrConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    EnumConvert.make$($self, args, "enumBoolToStr", false);
    return;
  }

  doConvert(enum$,val) {
    return ((this$) => { if (sys.ObjUtil.coerce(val, sys.Bool.type$)) return enum$.trueName(); return enum$.falseName(); })(this);
  }

}

class NumberToBoolConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NumberToBoolConvert.type$; }

  static make(args) {
    const $self = new NumberToBoolConvert();
    NumberToBoolConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 0)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0"));
    }
    ;
    return;
  }

  toStr() {
    return "numberToBool()";
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    return sys.ObjUtil.coerce(sys.ObjUtil.compareNE(num.toFloat(), sys.Float.make(0.0)), sys.Obj.type$.toNullable());
  }

}

class NumberToStrConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NumberToStrConvert.type$; }

  #enum = null;

  enum() { return this.#enum; }

  __enum(it) { if (it === undefined) return this.#enum; else this.#enum = it; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  static make(args) {
    const $self = new NumberToStrConvert();
    NumberToStrConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    $self.#enum = sys.ObjUtil.coerce(((this$) => { let $_u40 = args; if ($_u40 == null) return null; return sys.ObjUtil.toImmutable(args); })($self), sys.Type.find("sys::Str[]"));
    $self.#toStr = sys.Str.plus(sys.Str.plus("numberToStr(", $self.#enum.join(", ")), ")");
    return;
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    if (this.#enum.isEmpty()) {
      return num.toStr();
    }
    ;
    let ord = num.toInt();
    if ((sys.ObjUtil.compareLT(ord, 0) || sys.ObjUtil.compareGE(ord, this.#enum.size()))) {
      return null;
    }
    ;
    return this.#enum.get(ord);
  }

}

class BoolToNumberConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BoolToNumberConvert.type$; }

  #falseVal = null;

  falseVal() { return this.#falseVal; }

  __falseVal(it) { if (it === undefined) return this.#falseVal; else this.#falseVal = it; }

  #trueVal = null;

  trueVal() { return this.#trueVal; }

  __trueVal(it) { if (it === undefined) return this.#trueVal; else this.#trueVal = it; }

  static make(args) {
    const $self = new BoolToNumberConvert();
    BoolToNumberConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.equals(args.size(), 0)) {
      $self.#falseVal = haystack.Number.zero();
      $self.#trueVal = haystack.Number.one();
    }
    else {
      if (sys.ObjUtil.equals(args.size(), 2)) {
        $self.#falseVal = sys.ObjUtil.coerce(haystack.Number.fromStr(args.get(0)), haystack.Number.type$);
        $self.#trueVal = sys.ObjUtil.coerce(haystack.Number.fromStr(args.get(1)), haystack.Number.type$);
      }
      else {
        throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0 or 2"));
      }
      ;
    }
    ;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("boolToNumber(", this.#falseVal), ","), this.#trueVal), ")");
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.equals(val, true)) {
      return this.#trueVal;
    }
    ;
    return this.#falseVal;
  }

}

class StrToBoolConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrToBoolConvert.type$; }

  #falseStrs = null;

  falseStrs() { return this.#falseStrs; }

  __falseStrs(it) { if (it === undefined) return this.#falseStrs; else this.#falseStrs = it; }

  #trueStrs = null;

  trueStrs() { return this.#trueStrs; }

  __trueStrs(it) { if (it === undefined) return this.#trueStrs; else this.#trueStrs = it; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  static make(args) {
    const $self = new StrToBoolConvert();
    StrToBoolConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 2)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 2"));
    }
    ;
    $self.#falseStrs = sys.ObjUtil.coerce(((this$) => { let $_u41 = StrToBoolConvert.parseToks(args.get(0)); if ($_u41 == null) return null; return sys.ObjUtil.toImmutable(StrToBoolConvert.parseToks(args.get(0))); })($self), sys.Type.find("sys::Str[]"));
    $self.#trueStrs = sys.ObjUtil.coerce(((this$) => { let $_u42 = StrToBoolConvert.parseToks(args.get(1)); if ($_u42 == null) return null; return sys.ObjUtil.toImmutable(StrToBoolConvert.parseToks(args.get(1))); })($self), sys.Type.find("sys::Str[]"));
    if (($self.#falseStrs.isEmpty() && $self.#trueStrs.isEmpty())) {
      throw sys.ParseErr.make("Both false and true are wildcard");
    }
    ;
    let s = sys.StrBuf.make().add("strToBool(");
    StrToBoolConvert.addToStr(s, $self.#falseStrs);
    s.addChar(44).addChar(32);
    StrToBoolConvert.addToStr(s, $self.#trueStrs);
    s.addChar(41);
    $self.#toStr = s.toStr();
    return;
  }

  static addToStr(s,list) {
    const this$ = this;
    if (list.isEmpty()) {
      s.addChar(42);
    }
    else {
      list.each((x,i) => {
        if (sys.ObjUtil.compareGT(i, 0)) {
          s.addChar(32);
        }
        ;
        s.add(x);
        return;
      });
    }
    ;
    return;
  }

  static parseToks(s) {
    const this$ = this;
    if (sys.ObjUtil.equals(s, "*")) {
      return sys.ObjUtil.coerce(sys.Str.type$.emptyList(), sys.Type.find("sys::Str[]"));
    }
    ;
    let toks = sys.Str.split(s).findAll((tok) => {
      return !sys.Str.isEmpty(tok);
    });
    if (toks.isEmpty()) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid StrToBool arg: ", sys.Str.toCode(s)));
    }
    ;
    return toks;
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let s = sys.ObjUtil.toStr(val);
    if (this.#falseStrs.contains(s)) {
      return sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable());
    }
    ;
    if (this.#trueStrs.contains(s)) {
      return sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable());
    }
    ;
    if (this.#falseStrs.isEmpty()) {
      return sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable());
    }
    ;
    if (this.#trueStrs.isEmpty()) {
      return sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable());
    }
    ;
    return null;
  }

}

class StrToNumberConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrToNumberConvert.type$; }

  #checked = false;

  checked() { return this.#checked; }

  __checked(it) { if (it === undefined) return this.#checked; else this.#checked = it; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  static make(args) {
    const $self = new StrToNumberConvert();
    StrToNumberConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareGT(args.size(), 1)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0 or 1"));
    }
    ;
    $self.#checked = sys.ObjUtil.coerce(sys.Str.toBool(args.getSafe(0, "true")), sys.Bool.type$);
    $self.#toStr = sys.Str.plus(sys.Str.plus("strToNumber(", sys.ObjUtil.coerce($self.#checked, sys.Obj.type$.toNullable())), ")");
    return;
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Number.type$)) {
      return val;
    }
    ;
    return haystack.Number.fromStr(sys.ObjUtil.toStr(val), this.#checked);
  }

}

class HexToNumberConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HexToNumberConvert.type$; }

  #checked = false;

  checked() { return this.#checked; }

  __checked(it) { if (it === undefined) return this.#checked; else this.#checked = it; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  static make(args) {
    const $self = new HexToNumberConvert();
    HexToNumberConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareGT(args.size(), 1)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0 or 1"));
    }
    ;
    $self.#checked = sys.ObjUtil.coerce(sys.Str.toBool(args.getSafe(0, "true")), sys.Bool.type$);
    $self.#toStr = sys.Str.plus(sys.Str.plus("hexToNumber(", sys.ObjUtil.coerce($self.#checked, sys.Obj.type$.toNullable())), ")");
    return;
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let i = sys.Int.fromStr(sys.ObjUtil.toStr(val), 16, this.#checked);
    if (i == null) {
      return null;
    }
    ;
    return haystack.Number.makeInt(sys.ObjUtil.coerce(i, sys.Int.type$));
  }

}

class NumberToHexConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NumberToHexConvert.type$; }

  static make(args) {
    const $self = new NumberToHexConvert();
    NumberToHexConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 0)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0"));
    }
    ;
    return;
  }

  toStr() {
    return "numberToHex()";
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    return sys.Int.toHex(num.toInt());
  }

}

class LowerConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LowerConvert.type$; }

  static make(args) {
    const $self = new LowerConvert();
    LowerConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 0)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0"));
    }
    ;
    return;
  }

  toStr() {
    return "lower()";
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    return sys.Str.lower(sys.ObjUtil.toStr(val));
  }

}

class UpperConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UpperConvert.type$; }

  static make(args) {
    const $self = new UpperConvert();
    UpperConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 0)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0"));
    }
    ;
    return;
  }

  toStr() {
    return "upper()";
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    return sys.Str.upper(sys.ObjUtil.toStr(val));
  }

}

class StrReplaceConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrReplaceConvert.type$; }

  #from = null;

  from() { return this.#from; }

  __from(it) { if (it === undefined) return this.#from; else this.#from = it; }

  #to = null;

  to() { return this.#to; }

  __to(it) { if (it === undefined) return this.#to; else this.#to = it; }

  static make(args) {
    const $self = new StrReplaceConvert();
    StrReplaceConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 2)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 0"));
    }
    ;
    $self.#from = args.get(0);
    $self.#to = args.get(1);
    return;
  }

  toStr() {
    return "strReplace(from, to)";
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    return sys.Str.replace(sys.ObjUtil.toStr(val), this.#from, this.#to);
  }

}

class ThermistorConvert extends PointConvert {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThermistorConvert.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #items = null;

  items() { return this.#items; }

  __items(it) { if (it === undefined) return this.#items; else this.#items = it; }

  static listTables() {
    const this$ = this;
    let files = ThermistorConvert.type$.pod().files().findAll((f) => {
      return (sys.Str.startsWith(f.pathStr(), "/thermistor/thermistor-") && sys.ObjUtil.equals(f.ext(), "csv"));
    });
    return sys.ObjUtil.coerce(files.map((f) => {
      return sys.Str.getRange(f.basename(), sys.Range.make(11, -1));
    }, sys.Str.type$), sys.Type.find("sys::Str[]"));
  }

  static findTableFile(name,checked) {
    if (checked === undefined) checked = true;
    let f = ThermistorConvert.type$.pod().file(sys.Str.toUri(sys.Str.plus(sys.Str.plus("/thermistor/thermistor-", name), ".csv")), false);
    if (f != null) {
      return f;
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Uknown thermistor table: ", name));
    }
    ;
    return null;
  }

  static make(args) {
    const $self = new ThermistorConvert();
    ThermistorConvert.make$($self,args);
    return $self;
  }

  static make$($self,args) {
    const this$ = $self;
    PointConvert.make$($self);
    if (sys.ObjUtil.compareNE(args.size(), 1)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid num args ", sys.ObjUtil.coerce(args.size(), sys.Obj.type$.toNullable())), ", expected 1"));
    }
    ;
    $self.#name = sys.ObjUtil.coerce(args.first(), sys.Str.type$);
    let f = ThermistorConvert.findTableFile($self.#name);
    let lines = f.readAllLines();
    if (sys.ObjUtil.compareNE(lines.first(), "ohms,degF")) {
      throw sys.Err.make(sys.Str.plus("Invalid header: ", lines.first()));
    }
    ;
    let acc = sys.List.make(ThermistorItem.type$);
    acc.capacity(sys.Int.minus(lines.size(), 1));
    lines.each((line,i) => {
      if (sys.ObjUtil.equals(i, 0)) {
        return;
      }
      ;
      let toks = sys.Str.split(line, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
      acc.add(ThermistorItem.make(sys.ObjUtil.coerce(sys.Str.toFloat(toks.get(0)), sys.Float.type$), sys.ObjUtil.coerce(sys.Str.toFloat(toks.get(1)), sys.Float.type$)));
      return;
    });
    $self.#items = sys.ObjUtil.coerce(((this$) => { let $_u43 = acc; if ($_u43 == null) return null; return sys.ObjUtil.toImmutable(acc); })($self), sys.Type.find("hxPoint::ThermistorItem[]"));
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("thermistor(", this.#name), ")");
  }

  convert(lib,rec,val) {
    if (val == null) {
      return null;
    }
    ;
    let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
    let ohms = num.toFloat();
    let degF = this.ohmsToDegF(ohms);
    let unit = sys.ObjUtil.as(rec.get("unit"), sys.Str.type$);
    if ((sys.ObjUtil.equals(unit, haystack.Number.C().symbol()) || sys.ObjUtil.equals(unit, haystack.Number.C().name()))) {
      return haystack.Number.make(sys.Float.div(sys.Float.mult(sys.Float.minus(degF, sys.Float.make(32.0)), sys.Float.make(5.0)), sys.Float.make(9.0)), haystack.Number.C());
    }
    else {
      return haystack.Number.make(degF, haystack.Number.F());
    }
    ;
  }

  ohmsToDegF(ohms) {
    if (sys.ObjUtil.compareLE(ohms, this.#items.first().ohms())) {
      return this.#items.first().degF();
    }
    ;
    if (sys.ObjUtil.compareGE(ohms, this.#items.last().ohms())) {
      return this.#items.last().degF();
    }
    ;
    let i = this.#items.binarySearch(ThermistorItem.make(ohms, sys.Float.make(0.0)));
    if (sys.ObjUtil.compareGE(i, 0)) {
      return this.#items.get(i).degF();
    }
    ;
    (i = sys.Int.minus(sys.Int.negate(i), 2));
    let prev = this.#items.get(i);
    let next = this.#items.get(sys.Int.plus(i, 1));
    let ohmsDiff = sys.Float.minus(prev.ohms(), next.ohms());
    let degFDiff = sys.Float.minus(prev.degF(), next.degF());
    return sys.Float.plus(prev.degF(), sys.Float.mult(sys.Float.div(sys.Float.minus(ohms, prev.ohms()), ohmsDiff), degFDiff));
  }

}

class ThermistorItem extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThermistorItem.type$; }

  #ohms = sys.Float.make(0);

  ohms() { return this.#ohms; }

  __ohms(it) { if (it === undefined) return this.#ohms; else this.#ohms = it; }

  #degF = sys.Float.make(0);

  degF() { return this.#degF; }

  __degF(it) { if (it === undefined) return this.#degF; else this.#degF = it; }

  static make(ohms,degF) {
    const $self = new ThermistorItem();
    ThermistorItem.make$($self,ohms,degF);
    return $self;
  }

  static make$($self,ohms,degF) {
    $self.#ohms = ohms;
    $self.#degF = degF;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.#ohms, sys.Obj.type$.toNullable())), ", "), sys.ObjUtil.coerce(this.#degF, sys.Obj.type$.toNullable()));
  }

  compare(that) {
    return sys.ObjUtil.compare(this.#ohms, sys.ObjUtil.coerce(that, ThermistorItem.type$).#ohms);
  }

}

class HisCollectMgrActor extends PointMgrActor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisCollectMgrActor.type$; }

  static make(lib) {
    const $self = new HisCollectMgrActor();
    HisCollectMgrActor.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    PointMgrActor.make$($self, lib, sys.Duration.fromStr("100ms"), HisCollectMgr.type$);
    return;
  }

  writeAll() {
    return this.send(hx.HxMsg.make0("writeAll"));
  }

  reset() {
    return this.send(hx.HxMsg.make0("reset"));
  }

}

class HisCollectMgr extends PointMgr {
  constructor() {
    super();
    const this$ = this;
    this.#points = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("hxPoint::HisCollectRec"));
    return;
  }

  typeof() { return HisCollectMgr.type$; }

  #points = null;

  // private field reflection only
  __points(it) { if (it === undefined) return this.#points; else this.#points = it; }

  #refreshVer = 0;

  // private field reflection only
  __refreshVer(it) { if (it === undefined) return this.#refreshVer; else this.#refreshVer = it; }

  #refreshTicks = 0;

  // private field reflection only
  __refreshTicks(it) { if (it === undefined) return this.#refreshTicks; else this.#refreshTicks = it; }

  #nextTopOfMin = null;

  // private field reflection only
  __nextTopOfMin(it) { if (it === undefined) return this.#nextTopOfMin; else this.#nextTopOfMin = it; }

  #watch = null;

  // private field reflection only
  __watch(it) { if (it === undefined) return this.#watch; else this.#watch = it; }

  static make(lib) {
    const $self = new HisCollectMgr();
    HisCollectMgr.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    PointMgr.make$($self, lib);
    ;
    $self.#nextTopOfMin = sys.DateTime.now(null).floor(sys.Duration.fromStr("1min")).plus(sys.Duration.fromStr("1min"));
    return;
  }

  onReceive(msg) {
    if (sys.ObjUtil.equals(msg.id(), "writeAll")) {
      return this.onWriteAll();
    }
    ;
    if (sys.ObjUtil.equals(msg.id(), "reset")) {
      return this.onReset();
    }
    ;
    return PointMgr.prototype.onReceive.call(this, msg);
  }

  onObs(e) {
    try {
      let id = e.id();
      if (e.isRemoved()) {
        this.remove(id);
        return null;
      }
      ;
      let rec = this.#points.get(id);
      if (rec == null) {
        (rec = this.add(id, e.newRec()));
      }
      ;
      rec.onRefresh(this, e.newRec());
      if (!rec.isHisCollect()) {
        this.remove(id);
      }
      ;
    }
    catch ($_u44) {
      $_u44 = sys.Err.make($_u44);
      if ($_u44 instanceof sys.Err) {
        let err = $_u44;
        ;
        this.log().err("HisCollectMgr.onObs", err);
      }
      else {
        throw $_u44;
      }
    }
    ;
    return null;
  }

  add(id,rec) {
    let x = HisCollectRec.make(id, rec);
    this.#points.set(id, x);
    if (this.#watch != null) {
      this.#watch.add(id);
    }
    ;
    return x;
  }

  remove(id) {
    this.#points.remove(id);
    if (this.#watch != null) {
      this.#watch.remove(id);
    }
    ;
    return;
  }

  onCheck() {
    const this$ = this;
    let now = sys.DateTime.now(null);
    let topOfMin = false;
    if (sys.ObjUtil.compareGE(now, this.#nextTopOfMin)) {
      this.#nextTopOfMin = this.#nextTopOfMin.plus(sys.Duration.fromStr("1min"));
      (topOfMin = true);
    }
    ;
    if (this.#points.isEmpty()) {
      return;
    }
    ;
    if ((this.#watch == null || this.#watch.isClosed())) {
      this.openWatch();
    }
    ;
    let recs = null;
    try {
      (recs = this.#watch.poll(sys.Duration.fromStr("0ns")));
    }
    catch ($_u45) {
      $_u45 = sys.Err.make($_u45);
      if ($_u45 instanceof folio.ShutdownErr) {
        let e = $_u45;
        ;
        return;
      }
      else {
        throw $_u45;
      }
    }
    ;
    if (!this.lib().rt().isSteadyState()) {
      return;
    }
    ;
    recs.each((rec) => {
      if (rec == null) {
        return;
      }
      ;
      try {
        let pt = this$.#points.get(rec.id());
        if (pt != null) {
          pt.onCheck(this$, sys.ObjUtil.coerce(rec, haystack.Dict.type$), now, topOfMin);
        }
        ;
      }
      catch ($_u46) {
        $_u46 = sys.Err.make($_u46);
        if ($_u46 instanceof sys.Err) {
          let e = $_u46;
          ;
          this$.log().err(sys.Str.plus("onCheck: ", rec.dis()), e);
        }
        else {
          throw $_u46;
        }
      }
      ;
      return;
    });
    return;
  }

  onDetails(id) {
    let pt = this.#points.get(id);
    if (pt == null) {
      return null;
    }
    ;
    return pt.toDetails();
  }

  get(id) {
    return sys.ObjUtil.coerce(((this$) => { let $_u47 = this$.#points.get(id); if ($_u47 != null) return $_u47; throw sys.Err.make(sys.Str.plus("Not hisCollect point: ", id)); })(this), HisCollectRec.type$);
  }

  onWriteAll() {
    const this$ = this;
    let num = 0;
    this.#points.each((pt) => {
      if (pt.writePending(this$)) {
        ((this$) => { let $_u48 = num;num = sys.Int.increment(num); return $_u48; })(this$);
      }
      ;
      return;
    });
    if (sys.ObjUtil.compareGT(num, 0)) {
      this.log().info(sys.Str.plus(sys.Str.plus("hisCollectWriteAll [flushed ", sys.ObjUtil.coerce(num, sys.Obj.type$.toNullable())), " points]"));
    }
    ;
    return haystack.Number.makeInt(num);
  }

  onReset() {
    this.log().info("hisCollectReset");
    let oldId = ((this$) => { let $_u49 = this$.#watch; if ($_u49 == null) return null; return this$.#watch.id(); })(this);
    if (this.#watch != null) {
      this.#watch.close();
    }
    ;
    this.openWatch();
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("Old: ", oldId), "; New: "), this.#watch.id());
  }

  openWatch() {
    this.#watch = this.rt().watch().open("HisCollect");
    this.#watch.lease(sys.Duration.fromStr("1hr"));
    this.#watch.addAll(this.#points.keys());
    return;
  }

}

class WriteRec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WriteRec.type$; }

  static #levelDis = undefined;

  static levelDis() {
    if (WriteRec.#levelDis === undefined) {
      WriteRec.static$init();
      if (WriteRec.#levelDis === undefined) WriteRec.#levelDis = null;
    }
    return WriteRec.#levelDis;
  }

  static #levelNums = undefined;

  static levelNums() {
    if (WriteRec.#levelNums === undefined) {
      WriteRec.static$init();
      if (WriteRec.#levelNums === undefined) WriteRec.#levelNums = null;
    }
    return WriteRec.#levelNums;
  }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #rec = null;

  rec() {
    return this.#rec;
  }

  #lastVal = null;

  lastVal() {
    return this.#lastVal;
  }

  #lastLevel = null;

  lastLevel() {
    return this.#lastLevel;
  }

  #levels = null;

  // private field reflection only
  __levels(it) { if (it === undefined) return this.#levels; else this.#levels = it; }

  #overrideExpire = 0;

  // private field reflection only
  __overrideExpire(it) { if (it === undefined) return this.#overrideExpire; else this.#overrideExpire = it; }

  static make(mgr,id,rec) {
    const $self = new WriteRec();
    WriteRec.make$($self,mgr,id,rec);
    return $self;
  }

  static make$($self,mgr,id,rec) {
    const this$ = $self;
    $self.#id = id;
    $self.#rec = rec;
    $self.#levels = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.List.make(WriteLevel.type$.toNullable()), (it) => {
      it.size(17);
      return;
    }), sys.Type.find("hxPoint::WriteLevel?[]"));
    $self.init(1, "write1");
    $self.init(8, "write8");
    $self.init(17, "writeDef");
    $self.update(mgr);
    return;
  }

  init(level,tag) {
    let val = this.#rec.get(tag);
    if (val == null) {
      return;
    }
    ;
    let lvl = WriteLevel.make();
    lvl.val(val);
    lvl.who("database restore");
    this.#levels.set(sys.Int.minus(level, 1), lvl);
    return;
  }

  updateRec(rec) {
    this.#rec = rec;
    return;
  }

  check(mgr,now) {
    if ((sys.ObjUtil.compareNE(this.#overrideExpire, 0) && sys.ObjUtil.compareLT(this.#overrideExpire, now.ticks()))) {
      this.write(mgr, null, 8, sys.ObjUtil.coerce(this.#levels.get(7).who(), sys.Obj.type$), null);
    }
    ;
    return;
  }

  write(mgr,val,level,who,opts) {
    let duration = null;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      (duration = sys.ObjUtil.coerce(sys.ObjUtil.trap(val,"duration", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Duration.type$));
      (val = sys.ObjUtil.trap(val,"val", sys.List.make(sys.Obj.type$.toNullable(), [])));
    }
    ;
    if (sys.ObjUtil.equals(level, 8)) {
      if (duration != null) {
        this.#overrideExpire = sys.Int.plus(sys.Duration.nowTicks(), duration.ticks());
      }
      else {
        this.#overrideExpire = 0;
      }
      ;
    }
    ;
    let lvl = this.#levels.get(sys.Int.minus(level, 1));
    if (lvl == null) {
      this.#levels.set(sys.Int.minus(level, 1), (lvl = WriteLevel.make()));
    }
    ;
    if ((sys.ObjUtil.equals(lvl.val(), val) && WriteRec.whoIsEqual(lvl.who(), who))) {
      return val;
    }
    ;
    lvl.val(val);
    lvl.who(who);
    if (duration == null) {
      let $_u50 = level;
      if (sys.ObjUtil.equals($_u50, 1)) {
        this.persist(mgr, "write1", val);
      }
      else if (sys.ObjUtil.equals($_u50, 8)) {
        this.persist(mgr, "write8", val);
      }
      else if (sys.ObjUtil.equals($_u50, 17)) {
        this.persist(mgr, "writeDef", val);
      }
      ;
    }
    ;
    let effectiveChange = this.update(mgr);
    if (mgr.rt().isSteadyState()) {
      mgr.fireObservation(this, val, WriteRec.levelNums().get(sys.Int.minus(level, 1)), who, opts, effectiveChange, false);
    }
    ;
    return val;
  }

  static whoIsEqual(a,b) {
    let aGrid = sys.ObjUtil.as(a, haystack.Grid.type$);
    if (aGrid == null) {
      return sys.ObjUtil.equals(a, b);
    }
    ;
    let bGrid = sys.ObjUtil.as(b, haystack.Grid.type$);
    if (bGrid == null) {
      return false;
    }
    ;
    let aMod = aGrid.meta().get("mod");
    let bMod = bGrid.meta().get("mod");
    return sys.ObjUtil.equals(aMod, bMod);
  }

  persist(mgr,tag,val) {
    if (sys.ObjUtil.equals(this.#rec.get(tag), val)) {
      return;
    }
    ;
    this.#rec = sys.ObjUtil.coerce(mgr.rt().db().commit(folio.Diff.make(this.#rec, haystack.Etc.makeDict1(tag, ((this$) => { let $_u51 = val; if ($_u51 != null) return $_u51; return haystack.Remove.val(); })(this)), folio.Diff.force())).newRec(), haystack.Dict.type$);
    return;
  }

  update(mgr) {
    let level = WriteRec.levelNums().last();
    let val = null;
    let who = null;
    for (let i = 0; sys.ObjUtil.compareLT(i, 17); i = sys.Int.increment(i)) {
      let lvl = this.#levels.get(i);
      if ((lvl == null || lvl.val() == null)) {
        continue;
      }
      ;
      (level = WriteRec.levelNums().get(i));
      (val = lvl.val());
      (who = lvl.who());
      break;
    }
    ;
    if ((sys.ObjUtil.equals(val, this.#lastVal) && sys.ObjUtil.equals(level, this.#lastLevel))) {
      return false;
    }
    ;
    this.#lastVal = val;
    this.#lastLevel = level;
    try {
      mgr.sink(this, val, sys.ObjUtil.coerce(level, haystack.Number.type$), who);
    }
    catch ($_u52) {
      $_u52 = sys.Err.make($_u52);
      if ($_u52 instanceof folio.ShutdownErr) {
        let e = $_u52;
        ;
      }
      else if ($_u52 instanceof sys.Err) {
        let e = $_u52;
        ;
        mgr.lib().log().err("writeSink", e);
      }
      else {
        throw $_u52;
      }
    }
    ;
    return true;
  }

  toDetails() {
    const this$ = this;
    let s = sys.StrBuf.make();
    s.add("Writable\n");
    s.add("=============================\n");
    s.add("Level   Val          Who\n");
    s.add("-----   ----------   --------\n");
    this.#levels.each((level,i) => {
      let lvl = sys.Int.plus(i, 1);
      let val = ((this$) => { let $_u53 = ((this$) => { let $_u54=level; return ($_u54==null) ? null : $_u54.val(); })(this$); if ($_u53 != null) return $_u53; return "null"; })(this$);
      let who = ((this$) => { let $_u55 = ((this$) => { let $_u56 = level; if ($_u56 == null) return null; return level.whoToStr(); })(this$); if ($_u55 != null) return $_u55; return ""; })(this$);
      if ((sys.ObjUtil.equals(i, 7) && sys.ObjUtil.compareGT(this$.#overrideExpire, 0))) {
        let left = sys.Duration.make(this$.#overrideExpire).minus(sys.Duration.now()).abs();
        who = sys.Str.plus(who, sys.Str.plus(sys.Str.plus(" (expires in ", left.toLocale()), ")"));
      }
      ;
      s.add(sys.Str.padr(sys.Int.toStr(lvl), 5)).add("   ").add(sys.Str.padr(sys.ObjUtil.toStr(val), 10)).add("    ").add(who).add("\n");
      return;
    });
    s.add("\n");
    return s.toStr();
  }

  toGrid() {
    let meta = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    meta.addNotNull("writeVal", this.#lastVal);
    meta.addNotNull("writeLevel", this.#lastLevel);
    let enum$ = sys.ObjUtil.coerce(sys.Str.type$.emptyList(), sys.Type.find("sys::Str[]"));
    try {
      if (this.#rec.has("enum")) {
        (enum$ = hx.HxUtil.parseEnumNames(sys.ObjUtil.toStr(this.#rec.get("enum"))));
      }
      ;
    }
    catch ($_u57) {
      $_u57 = sys.Err.make($_u57);
      if ($_u57 instanceof sys.Err) {
        let e = $_u57;
        ;
      }
      else {
        throw $_u57;
      }
    }
    ;
    let gb = haystack.GridBuilder.make();
    gb.capacity(17);
    gb.setMeta(meta).addCol("level").addCol("levelDis").addCol("val").addCol("valDis").addCol("who").addCol("expires");
    for (let i = 0; sys.ObjUtil.compareLT(i, 17); i = sys.Int.increment(i)) {
      let lvl = this.#levels.get(i);
      let val = null;
      let who = null;
      if (lvl != null) {
        (val = lvl.val());
        (who = lvl.whoToStr());
      }
      ;
      let valDis = ((this$) => { if (val == null) return null; return sys.ObjUtil.toStr(val); })(this);
      if ((sys.ObjUtil.is(val, sys.Bool.type$) && sys.ObjUtil.equals(enum$.size(), 2))) {
        let e = enum$.get(((this$) => { if (sys.ObjUtil.coerce(val, sys.Bool.type$)) return 1; return 0; })(this));
        if (!sys.Str.isEmpty(e)) {
          (valDis = e);
        }
        ;
      }
      ;
      let expires = null;
      if ((sys.ObjUtil.equals(i, 7) && sys.ObjUtil.compareGT(this.#overrideExpire, 0))) {
        let left = sys.Duration.make(this.#overrideExpire).minus(sys.Duration.now()).abs();
        (expires = haystack.Number.makeDuration(left, null));
      }
      ;
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [haystack.Number.makeInt(sys.Int.plus(i, 1)), WriteRec.levelDis().get(i), val, valDis, who, expires]));
    }
    ;
    return gb.toGrid();
  }

  static static$init() {
    WriteRec.#levelDis = sys.ObjUtil.coerce(((this$) => { let $_u60 = sys.List.make(sys.Str.type$, ["1 (emergency)", "2", "3", "4", "5", "6", "7", "8 (manual)", "9", "10", "11", "12", "13", "14", "15", "16", "def"]); if ($_u60 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["1 (emergency)", "2", "3", "4", "5", "6", "7", "8 (manual)", "9", "10", "11", "12", "13", "14", "15", "16", "def"])); })(this), sys.Type.find("sys::Str[]"));
    if (true) {
      let list = sys.List.make(haystack.Number.type$);
      for (let i = 0; sys.ObjUtil.compareLT(i, 17); i = sys.Int.increment(i)) {
        list.add(sys.ObjUtil.coerce(haystack.Number.makeInt(sys.Int.plus(i, 1)), haystack.Number.type$));
      }
      ;
      WriteRec.#levelNums = sys.ObjUtil.coerce(((this$) => { let $_u61 = list; if ($_u61 == null) return null; return sys.ObjUtil.toImmutable(list); })(this), sys.Type.find("haystack::Number[]"));
    }
    ;
    return;
  }

}

class WriteLevel extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WriteLevel.type$; }

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

  #who = null;

  who(it) {
    if (it === undefined) {
      return this.#who;
    }
    else {
      this.#who = it;
      return;
    }
  }

  whoToStr() {
    if (sys.ObjUtil.is(this.#who, haystack.Grid.type$)) {
      return sys.ObjUtil.coerce(((this$) => { let $_u62 = sys.ObjUtil.coerce(this$.#who, haystack.Grid.type$).meta().get("who"); if ($_u62 != null) return $_u62; return "Grid?"; })(this), sys.Str.type$.toNullable());
    }
    ;
    return sys.ObjUtil.coerce(this.#who, sys.Str.type$.toNullable());
  }

  static make() {
    const $self = new WriteLevel();
    WriteLevel.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class PointFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PointFuncs.type$; }

  static #timeout = undefined;

  static timeout() {
    if (PointFuncs.#timeout === undefined) {
      PointFuncs.static$init();
      if (PointFuncs.#timeout === undefined) PointFuncs.#timeout = null;
    }
    return PointFuncs.#timeout;
  }

  static #level1 = undefined;

  static level1() {
    if (PointFuncs.#level1 === undefined) {
      PointFuncs.static$init();
      if (PointFuncs.#level1 === undefined) PointFuncs.#level1 = null;
    }
    return PointFuncs.#level1;
  }

  static #level8 = undefined;

  static level8() {
    if (PointFuncs.#level8 === undefined) {
      PointFuncs.static$init();
      if (PointFuncs.#level8 === undefined) PointFuncs.#level8 = null;
    }
    return PointFuncs.#level8;
  }

  static #levelDef = undefined;

  static levelDef() {
    if (PointFuncs.#levelDef === undefined) {
      PointFuncs.static$init();
      if (PointFuncs.#levelDef === undefined) PointFuncs.#levelDef = null;
    }
    return PointFuncs.#levelDef;
  }

  static toSites(recs) {
    return PointRecSet.make(recs).toSites();
  }

  static toSpaces(recs) {
    return PointRecSet.make(recs, PointFuncs.curContext()).toSpaces();
  }

  static toEquips(recs) {
    return PointRecSet.make(recs, PointFuncs.curContext()).toEquips();
  }

  static toDevices(recs) {
    return PointRecSet.make(recs, PointFuncs.curContext()).toDevices();
  }

  static toPoints(recs) {
    return PointRecSet.make(recs, PointFuncs.curContext()).toPoints();
  }

  static toOccupied(rec,checked) {
    if (checked === undefined) checked = true;
    return PointUtil.toOccupied(haystack.Etc.toRec(rec), checked, PointFuncs.curContext());
  }

  static equipToPoints(equip) {
    let cx = PointFuncs.curContext();
    let rec = haystack.Etc.toRec(equip, cx);
    let id = rec.id();
    if (rec.get("equip") !== haystack.Marker.val()) {
      throw sys.Err.make(sys.Str.plus("Not equip: ", id));
    }
    ;
    return cx.db().readAll(haystack.Filter.has("point").and(haystack.Filter.eq("equipRef", id)));
  }

  static pointEmergencyOverride(point,val) {
    return PointFuncs.pointWrite(point, val, PointFuncs.level1(), null);
  }

  static pointEmergencyAuto(point) {
    return PointFuncs.pointWrite(point, null, PointFuncs.level1(), null);
  }

  static pointOverride(point,val,duration) {
    if (duration === undefined) duration = null;
    if ((val != null && duration != null)) {
      (val = haystack.Etc.makeDict2("val", val, "duration", duration.toDuration()));
    }
    ;
    return PointFuncs.pointWrite(point, val, PointFuncs.level8(), null);
  }

  static pointAuto(point) {
    return PointFuncs.pointWrite(point, null, PointFuncs.level8(), null);
  }

  static pointSetDef(point,val) {
    return PointFuncs.pointWrite(point, val, PointFuncs.levelDef(), null);
  }

  static pointWrite(point,val,level,who,opts) {
    if (who === undefined) who = null;
    if (opts === undefined) opts = null;
    let cx = PointFuncs.curContext();
    if (level == null) {
      throw sys.ArgErr.make("level arg is null");
    }
    ;
    if (who == null) {
      (who = cx.user().dis());
    }
    ;
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    return PointFuncs.lib(cx).writeMgr().write(haystack.Etc.toRec(point), val, level.toInt(), sys.ObjUtil.coerce(who, sys.Obj.type$), opts).get(PointFuncs.timeout());
  }

  static pointOverrideCommand(point,val,level,duration) {
    if (duration === undefined) duration = null;
    let cx = PointFuncs.curContext();
    let lib = PointFuncs.lib(cx);
    let rec = cx.db().readById(haystack.Etc.toId(point));
    if (!cx.user().access().canPointWriteAtLevel(level.toInt())) {
      throw haystack.PermissionErr.make(sys.Str.plus("Cannot override level: ", level));
    }
    ;
    if ((sys.ObjUtil.equals(level.toInt(), 8) && val != null && duration != null)) {
      (val = haystack.Etc.makeDict2("val", val, "duration", duration.toDuration()));
    }
    ;
    return lib.writeMgr().write(sys.ObjUtil.coerce(rec, haystack.Dict.type$), val, level.toInt(), cx.user().dis(), haystack.Etc.emptyDict()).get(PointFuncs.timeout());
  }

  static pointWriteArray(point) {
    return PointFuncs.lib(PointFuncs.curContext()).writeMgr().arrayById(haystack.Etc.toId(point));
  }

  static pointConvert(pt,convert,val) {
    let cx = PointFuncs.curContext();
    let lib = PointFuncs.lib(cx);
    let rec = ((this$) => { if (pt == null) return haystack.Etc.emptyDict(); return haystack.Etc.toRec(pt); })(this);
    return PointConvert.fromStr(convert).convert(lib, rec, val);
  }

  static pointDetails(point) {
    let cx = PointFuncs.curContext();
    let rec = haystack.Etc.toRec(point);
    return PointUtil.pointDetails(PointFuncs.lib(cx), rec, true);
  }

  static pointThermistorTables() {
    return haystack.Etc.makeListGrid(null, "name", null, ThermistorConvert.listTables());
  }

  static enumDefs() {
    const this$ = this;
    let lib = PointFuncs.lib(PointFuncs.curContext());
    lib.rt().sync();
    let enums = lib.enums();
    let gb = haystack.GridBuilder.make();
    gb.setMeta(enums.meta());
    gb.addCol("id").addCol("size");
    enums.list().each((e) => {
      gb.addRow2(e.id(), haystack.Number.makeInt(e.size()));
      return;
    });
    return gb.toGrid();
  }

  static enumDef(id,checked) {
    if (checked === undefined) checked = true;
    let lib = PointFuncs.lib(PointFuncs.curContext());
    lib.rt().sync();
    return ((this$) => { let $_u64=lib.enums().get(id, checked); return ($_u64==null) ? null : $_u64.grid(); })(this);
  }

  static matchPointVal(val,match) {
    if (sys.ObjUtil.equals(val, match)) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(match, false)) {
      if ((sys.ObjUtil.is(val, haystack.Number.type$) && sys.ObjUtil.equals(sys.ObjUtil.coerce(val, haystack.Number.type$).toFloat(), sys.Float.make(0.0)))) {
        return true;
      }
      ;
      return false;
    }
    ;
    if (sys.ObjUtil.equals(match, true)) {
      if ((sys.ObjUtil.is(val, haystack.Number.type$) && sys.ObjUtil.compareNE(sys.ObjUtil.coerce(val, haystack.Number.type$).toFloat(), sys.Float.make(0.0)))) {
        return true;
      }
      ;
      return false;
    }
    ;
    if ((sys.ObjUtil.is(match, haystack.ObjRange.type$) && sys.ObjUtil.is(val, haystack.Number.type$))) {
      let r = sys.ObjUtil.coerce(match, haystack.ObjRange.type$);
      let s = sys.ObjUtil.as(r.start(), haystack.Number.type$);
      let e = sys.ObjUtil.as(r.end(), haystack.Number.type$);
      if ((s == null || e == null)) {
        return false;
      }
      ;
      let sf = s.toFloat();
      let ef = e.toFloat();
      if (sys.ObjUtil.equals(ef, sys.Float.make(100.0))) {
        (ef = sys.Float.make(100.9));
      }
      ;
      let vf = sys.ObjUtil.coerce(val, haystack.Number.type$).toFloat();
      return (sys.ObjUtil.compareLE(sf, vf) && sys.ObjUtil.compareLE(vf, ef));
    }
    ;
    if (sys.ObjUtil.is(match, axon.Fn.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(match, axon.Fn.type$).call(PointFuncs.curContext(), sys.List.make(sys.Obj.type$.toNullable(), [val])), sys.Bool.type$);
    }
    ;
    return false;
  }

  static hisCollectWriteAll(timeout) {
    if (timeout === undefined) timeout = null;
    return PointFuncs.lib(PointFuncs.curContext()).hisCollectMgr().writeAll().get(((this$) => { let $_u65 = timeout; if ($_u65 == null) return null; return timeout.toDuration(); })(this));
  }

  static hisCollectReset(timeout) {
    if (timeout === undefined) timeout = null;
    return PointFuncs.lib(PointFuncs.curContext()).hisCollectMgr().reset().get(((this$) => { let $_u66 = timeout; if ($_u66 == null) return null; return timeout.toDuration(); })(this));
  }

  static pointExtSync() {
    PointFuncs.curContext().rt().sync();
    return null;
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static lib(cx) {
    return sys.ObjUtil.coerce(cx.rt().lib("point"), PointLib.type$);
  }

  static make() {
    const $self = new PointFuncs();
    PointFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    PointFuncs.#timeout = sys.Duration.fromStr("30sec");
    PointFuncs.#level1 = sys.ObjUtil.coerce(haystack.Number.makeInt(1), haystack.Number.type$);
    PointFuncs.#level8 = sys.ObjUtil.coerce(haystack.Number.makeInt(8), haystack.Number.type$);
    PointFuncs.#levelDef = sys.ObjUtil.coerce(haystack.Number.makeInt(17), haystack.Number.type$);
    return;
  }

}

class HisCollectRec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisCollectRec.type$; }

  static #hisCollectIntervalMin = undefined;

  static hisCollectIntervalMin() {
    if (HisCollectRec.#hisCollectIntervalMin === undefined) {
      HisCollectRec.static$init();
      if (HisCollectRec.#hisCollectIntervalMin === undefined) HisCollectRec.#hisCollectIntervalMin = null;
    }
    return HisCollectRec.#hisCollectIntervalMin;
  }

  static #hisCollectIntervalMax = undefined;

  static hisCollectIntervalMax() {
    if (HisCollectRec.#hisCollectIntervalMax === undefined) {
      HisCollectRec.static$init();
      if (HisCollectRec.#hisCollectIntervalMax === undefined) HisCollectRec.#hisCollectIntervalMax = null;
    }
    return HisCollectRec.#hisCollectIntervalMax;
  }

  static #maxBufSize = undefined;

  static maxBufSize() {
    if (HisCollectRec.#maxBufSize === undefined) {
      HisCollectRec.static$init();
      if (HisCollectRec.#maxBufSize === undefined) HisCollectRec.#maxBufSize = 0;
    }
    return HisCollectRec.#maxBufSize;
  }

  static #statusInit = undefined;

  static statusInit() {
    if (HisCollectRec.#statusInit === undefined) {
      HisCollectRec.static$init();
      if (HisCollectRec.#statusInit === undefined) HisCollectRec.#statusInit = null;
    }
    return HisCollectRec.#statusInit;
  }

  static #statusOk = undefined;

  static statusOk() {
    if (HisCollectRec.#statusOk === undefined) {
      HisCollectRec.static$init();
      if (HisCollectRec.#statusOk === undefined) HisCollectRec.#statusOk = null;
    }
    return HisCollectRec.#statusOk;
  }

  static #statusFault = undefined;

  static statusFault() {
    if (HisCollectRec.#statusFault === undefined) {
      HisCollectRec.static$init();
      if (HisCollectRec.#statusFault === undefined) HisCollectRec.#statusFault = null;
    }
    return HisCollectRec.#statusFault;
  }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #rec = null;

  // private field reflection only
  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  #status = null;

  // private field reflection only
  __status(it) { if (it === undefined) return this.#status; else this.#status = it; }

  #err = null;

  // private field reflection only
  __err(it) { if (it === undefined) return this.#err; else this.#err = it; }

  #tz = null;

  // private field reflection only
  __tz(it) { if (it === undefined) return this.#tz; else this.#tz = it; }

  #interval = null;

  // private field reflection only
  __interval(it) { if (it === undefined) return this.#interval; else this.#interval = it; }

  #intervalHours = 0;

  // private field reflection only
  __intervalHours(it) { if (it === undefined) return this.#intervalHours; else this.#intervalHours = it; }

  #intervalMinutes = 0;

  // private field reflection only
  __intervalMinutes(it) { if (it === undefined) return this.#intervalMinutes; else this.#intervalMinutes = it; }

  #intervalSecs = 0;

  // private field reflection only
  __intervalSecs(it) { if (it === undefined) return this.#intervalSecs; else this.#intervalSecs = it; }

  #writeFreq = null;

  // private field reflection only
  __writeFreq(it) { if (it === undefined) return this.#writeFreq; else this.#writeFreq = it; }

  #writeLast = 0;

  // private field reflection only
  __writeLast(it) { if (it === undefined) return this.#writeLast; else this.#writeLast = it; }

  #writeErr = null;

  // private field reflection only
  __writeErr(it) { if (it === undefined) return this.#writeErr; else this.#writeErr = it; }

  #cov = null;

  // private field reflection only
  __cov(it) { if (it === undefined) return this.#cov; else this.#cov = it; }

  #covRateLimit = null;

  // private field reflection only
  __covRateLimit(it) { if (it === undefined) return this.#covRateLimit; else this.#covRateLimit = it; }

  #collectNA = false;

  // private field reflection only
  __collectNA(it) { if (it === undefined) return this.#collectNA; else this.#collectNA = it; }

  #buf = null;

  // private field reflection only
  __buf(it) { if (it === undefined) return this.#buf; else this.#buf = it; }

  #lastItem = null;

  // private field reflection only
  __lastItem(it) { if (it === undefined) return this.#lastItem; else this.#lastItem = it; }

  static make(id,rec) {
    const $self = new HisCollectRec();
    HisCollectRec.make$($self,id,rec);
    return $self;
  }

  static make$($self,id,rec) {
    $self.#id = id;
    $self.#rec = rec;
    $self.#status = HisCollectRec.statusInit();
    $self.#tz = sys.TimeZone.cur();
    $self.#buf = hxUtil.CircularBuf.make(16);
    $self.#covRateLimit = sys.Duration.fromStr("1sec");
    return;
  }

  onCheck(mgr,rec,now,topOfMin) {
    this.#rec = rec;
    let curVal = rec.get("curVal");
    let curStatus = rec.get("curStatus");
    let collectRequired = false;
    if (this.#interval != null) {
      (collectRequired = this.isInterval(now, topOfMin));
    }
    ;
    if ((!collectRequired && this.#cov != null)) {
      (collectRequired = this.isCov(now, curVal));
    }
    ;
    if (!collectRequired) {
      return;
    }
    ;
    let ts = now.toTimeZone(this.#tz);
    if (this.bufFullOfPending()) {
      let newMax = sys.Int.mult(this.#buf.max(), 2);
      if (sys.ObjUtil.compareLT(newMax, HisCollectRec.maxBufSize())) {
        this.#buf.resize(newMax);
      }
      else {
        this.writePending(mgr);
      }
      ;
    }
    ;
    this.#lastItem = HisCollectItem.make(ts, curVal, sys.ObjUtil.coerce(curStatus, sys.Str.type$.toNullable()));
    this.#buf.add(this.#lastItem);
    this.checkWrite(mgr);
    return;
  }

  isInterval(now,topOfMin) {
    if (sys.ObjUtil.compareGT(this.#intervalSecs, 0)) {
      if (this.#lastItem == null) {
        return topOfMin;
      }
      ;
      let lastItem = sys.ObjUtil.coerce(this.#buf.newest(), HisCollectItem.type$);
      let delta = sys.Int.minus(now.ticks(), lastItem.ts().ticks());
      if (sys.ObjUtil.compareLT(delta, 1300000000)) {
        return false;
      }
      ;
      if (sys.ObjUtil.compareGT(delta, sys.Int.plus(this.#interval.ticks(), 1000000000))) {
        return true;
      }
      ;
      return sys.ObjUtil.equals(sys.Int.mod(now.sec(), this.#intervalSecs), 0);
    }
    ;
    if (!topOfMin) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareGT(this.#intervalHours, 0)) {
      return (sys.ObjUtil.equals(sys.Int.mod(now.hour(), this.#intervalHours), 0) && sys.ObjUtil.equals(now.min(), 0));
    }
    else {
      return sys.ObjUtil.equals(sys.Int.mod(now.min(), this.#intervalMinutes), 0);
    }
    ;
  }

  isCov(now,curVal) {
    if (this.#lastItem == null) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(this.#lastItem.curVal(), curVal)) {
      return false;
    }
    ;
    if (this.throttleCov(now)) {
      return false;
    }
    ;
    if (this.#cov === haystack.Marker.val()) {
      return true;
    }
    ;
    let lastNum = sys.ObjUtil.as(this.#lastItem.curVal(), haystack.Number.type$);
    let curNum = sys.ObjUtil.as(curVal, haystack.Number.type$);
    if ((lastNum == null || curNum == null)) {
      return true;
    }
    ;
    return sys.ObjUtil.compareGE(sys.Float.abs(sys.Float.minus(lastNum.toFloat(), curNum.toFloat())), sys.ObjUtil.coerce(this.#cov, haystack.Number.type$).toFloat());
  }

  throttleCov(now) {
    let age = now.minusDateTime(this.#lastItem.ts());
    return sys.ObjUtil.compareLT(age, this.#covRateLimit);
  }

  bufFullOfPending() {
    if (sys.ObjUtil.compareLT(this.#buf.size(), this.#buf.max())) {
      return false;
    }
    ;
    let old = sys.ObjUtil.coerce(this.#buf.oldest(), HisCollectItem.type$);
    return sys.ObjUtil.equals(old.written(), HisCollectItemState.pending());
  }

  checkWrite(mgr) {
    if (this.#writeFreq != null) {
      let last = this.#writeLast;
      if (sys.ObjUtil.equals(last, 0)) {
        (last = sys.Duration.boot().ticks());
      }
      ;
      let age = sys.Int.minus(sys.Duration.nowTicks(), last);
      if (sys.ObjUtil.compareLT(age, this.#writeFreq.ticks())) {
        return;
      }
      ;
    }
    ;
    this.writePending(mgr);
    return;
  }

  writePending(mgr) {
    const this$ = this;
    let toWrite = sys.List.make(haystack.HisItem.type$);
    this.#buf.eachWhile(sys.ObjUtil.coerce((item) => {
      if (sys.ObjUtil.compareNE(item.written(), HisCollectItemState.pending())) {
        return "done";
      }
      ;
      let val = item.curVal();
      if ((val == null || sys.ObjUtil.compareNE(item.curStatus(), "ok"))) {
        if (!this$.#collectNA) {
          item.written(HisCollectItemState.skipped());
          return null;
        }
        ;
        (val = haystack.NA.val());
        item.written(HisCollectItemState.wroteNA());
      }
      else {
        item.written(HisCollectItemState.wroteVal());
      }
      ;
      toWrite.add(haystack.HisItem.make(item.ts(), val));
      return null;
    }, sys.Type.find("|sys::Obj?->sys::Obj?|")));
    if (toWrite.isEmpty()) {
      return false;
    }
    ;
    toWrite.reverse();
    try {
      mgr.lib().rt().his().write(this.#rec, toWrite, haystack.Etc.emptyDict());
      this.#writeErr = null;
    }
    catch ($_u67) {
      $_u67 = sys.Err.make($_u67);
      if ($_u67 instanceof sys.Err) {
        let e = $_u67;
        ;
        this.#writeErr = e;
      }
      else {
        throw $_u67;
      }
    }
    ;
    this.#writeLast = sys.Duration.nowTicks();
    return true;
  }

  isHisCollect() {
    return (this.#interval != null || this.#cov != null);
  }

  onRefresh(mgr,rec) {
    try {
      let settings = mgr.lib().rec();
      this.#rec = rec;
      if (rec.get("point") !== haystack.Marker.val()) {
        throw haystack.FaultErr.make("Missing 'point' marker tag");
      }
      ;
      if (rec.get("his") !== haystack.Marker.val()) {
        throw haystack.FaultErr.make("Missing 'his' marker tag");
      }
      ;
      let tz = sys.TimeZone.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u68 = sys.ObjUtil.as(rec.get("tz"), sys.Str.type$); if ($_u68 != null) return $_u68; return ""; })(this), sys.Str.type$), false);
      if (tz == null) {
        throw haystack.FaultErr.make("Missing or invalid 'tz' tag");
      }
      ;
      this.#tz = sys.ObjUtil.coerce(tz, sys.TimeZone.type$);
      this.#writeFreq = null;
      if (rec.has("hisCollectWriteFreq")) {
        let dur = ((this$) => { let $_u69 = sys.ObjUtil.as(rec.get("hisCollectWriteFreq"), haystack.Number.type$); if ($_u69 == null) return null; return sys.ObjUtil.as(rec.get("hisCollectWriteFreq"), haystack.Number.type$).toDuration(false); })(this);
        if (dur == null) {
          throw haystack.FaultErr.make("hisWriteFreq not valid dur");
        }
        ;
        if (sys.ObjUtil.compareLT(dur, sys.Duration.fromStr("1sec"))) {
          (dur = sys.Duration.fromStr("1sec"));
        }
        ;
        if (sys.ObjUtil.compareGT(dur, sys.Duration.fromStr("1day"))) {
          (dur = sys.Duration.fromStr("1day"));
        }
        ;
        this.#writeFreq = dur;
      }
      ;
      this.#interval = null;
      this.#intervalSecs = 0;
      this.#intervalHours = 0;
      this.#intervalMinutes = 0;
      let intervalVal = rec.get("hisCollectInterval");
      if (intervalVal != null) {
        let dur = sys.Duration.fromStr("1min");
        try {
          (dur = sys.ObjUtil.coerce(sys.ObjUtil.coerce(intervalVal, haystack.Number.type$).toDuration(), sys.Duration.type$));
        }
        catch ($_u70) {
          $_u70 = sys.Err.make($_u70);
          if ($_u70 instanceof sys.Err) {
            let e = $_u70;
            ;
            throw haystack.FaultErr.make("hisCollectInterval is not duration Number");
          }
          else {
            throw $_u70;
          }
        }
        ;
        if (sys.ObjUtil.compareGT(dur, HisCollectRec.hisCollectIntervalMax())) {
          throw haystack.FaultErr.make(sys.Str.plus("hisCollectInterval > ", HisCollectRec.hisCollectIntervalMax()));
        }
        ;
        if (sys.ObjUtil.compareLT(dur, HisCollectRec.hisCollectIntervalMin())) {
          throw haystack.FaultErr.make(sys.Str.plus("hisCollectInterval < ", HisCollectRec.hisCollectIntervalMin()));
        }
        ;
        let secs = 0;
        let mins = 0;
        let hours = 0;
        if (sys.ObjUtil.compareLT(dur, sys.Duration.fromStr("1min"))) {
          (secs = dur.toSec());
          if (sys.ObjUtil.compareNE(sys.Int.mult(secs, 1000000000), dur.ticks())) {
            throw haystack.FaultErr.make("hisCollectInterval must be even number of seconds");
          }
          ;
          if (sys.ObjUtil.compareNE(sys.Int.mod(60, secs), 0)) {
            throw haystack.FaultErr.make("hisCollectInterval seconds must be evenly divisible by 60sec");
          }
          ;
        }
        else {
          if (sys.ObjUtil.compareLT(dur, sys.Duration.fromStr("1hr"))) {
            (mins = dur.toMin());
            if (sys.ObjUtil.compareNE(sys.Int.mult(mins, 60000000000), dur.ticks())) {
              throw haystack.FaultErr.make("hisCollectInterval must be even number of minutes");
            }
            ;
            if (sys.ObjUtil.compareNE(sys.Int.mod(60, mins), 0)) {
              throw haystack.FaultErr.make("hisCollectInterval minutes must be evenly divisible by 60min");
            }
            ;
          }
          else {
            (hours = dur.toHour());
            if (sys.ObjUtil.compareNE(sys.Int.mult(hours, 3600000000000), dur.ticks())) {
              throw haystack.FaultErr.make("hisCollectInterval must be even number of hours");
            }
            ;
            if (sys.ObjUtil.compareNE(sys.Int.mod(24, hours), 0)) {
              throw haystack.FaultErr.make("hisCollectInterval hours must be evenly divisible by 24hr");
            }
            ;
          }
          ;
        }
        ;
        this.#intervalSecs = secs;
        this.#intervalMinutes = mins;
        this.#intervalHours = hours;
        this.#interval = dur;
      }
      ;
      this.#cov = null;
      let cov = rec.get("hisCollectCov");
      if (cov != null) {
        if (cov !== haystack.Marker.val()) {
          let num = sys.ObjUtil.as(cov, haystack.Number.type$);
          if (num == null) {
            throw haystack.FaultErr.make("hisCollectCov must be Marker or Number");
          }
          ;
          if (sys.ObjUtil.compareNE(rec.get("kind"), "Number")) {
            throw haystack.FaultErr.make("hisCollectCov Number on non-Number kind");
          }
          ;
        }
        ;
        this.#cov = cov;
      }
      ;
      let rateLimit = ((this$) => { let $_u71 = sys.ObjUtil.as(rec.get("hisCollectCovRateLimit"), haystack.Number.type$); if ($_u71 == null) return null; return sys.ObjUtil.as(rec.get("hisCollectCovRateLimit"), haystack.Number.type$).toDuration(false); })(this);
      if (rateLimit == null) {
        if (sys.ObjUtil.equals(rec.get("kind"), haystack.Kind.number().name())) {
          (rateLimit = ((this$) => { let $_u72 = this$.#interval; if ($_u72 != null) return $_u72; return sys.Duration.fromStr("1hr"); })(this).div(10).min(sys.Duration.fromStr("1min")));
        }
        else {
          (rateLimit = sys.Duration.fromStr("1sec"));
        }
        ;
      }
      ;
      this.#covRateLimit = sys.ObjUtil.coerce(rateLimit, sys.Duration.type$);
      this.#collectNA = (mgr.lib().hisCollectNA() || rec.has("hisCollectNA"));
      if (this.#writeErr != null) {
        this.updateStatusErr(mgr, this.#writeErr.toStr());
      }
      ;
      this.updateStatusOk(mgr);
    }
    catch ($_u73) {
      $_u73 = sys.Err.make($_u73);
      if ($_u73 instanceof haystack.FaultErr) {
        let e = $_u73;
        ;
        this.updateStatusErr(mgr, e.msg());
      }
      else if ($_u73 instanceof sys.Err) {
        let e = $_u73;
        ;
        this.updateStatusErr(mgr, e.toStr());
      }
      else {
        throw $_u73;
      }
    }
    ;
    return;
  }

  updateStatusOk(mgr) {
    if (this.#status === HisCollectRec.statusOk()) {
      return;
    }
    ;
    this.#status = HisCollectRec.statusOk();
    this.#err = null;
    this.commit(mgr, haystack.Etc.makeDict2("hisStatus", HisCollectRec.statusOk(), "hisErr", haystack.Remove.val()));
    return;
  }

  updateStatusErr(mgr,err) {
    if ((this.#status === HisCollectRec.statusFault() && sys.ObjUtil.equals(err, this.#err))) {
      return;
    }
    ;
    this.#status = HisCollectRec.statusFault();
    this.#err = err;
    this.commit(mgr, haystack.Etc.makeDict2("hisStatus", HisCollectRec.statusFault(), "hisErr", err));
    return;
  }

  commit(mgr,changes) {
    this.#rec = sys.ObjUtil.coerce(mgr.lib().rt().db().commit(folio.Diff.make(this.#rec, changes, folio.Diff.forceTransient())).newRec(), haystack.Dict.type$);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#rec.dis()), " interval="), this.#interval), " cov="), this.#cov);
  }

  toDetails() {
    const this$ = this;
    let pattern = "YYYY-MMM-DD hh:mm:ss";
    let s = sys.StrBuf.make().add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("His Collect\n=============================\nhisStatus:       ", this.#status), "\nhisErr:          "), this.#err), "\ninterval:        "), this.#interval), " ("), sys.ObjUtil.coerce(this.#intervalHours, sys.Obj.type$.toNullable())), "hr, "), sys.ObjUtil.coerce(this.#intervalMinutes, sys.Obj.type$.toNullable())), "min, "), sys.ObjUtil.coerce(this.#intervalSecs, sys.Obj.type$.toNullable())), "sec)\ncov:             "), this.#cov), "\ncovRateLimit:    "), this.#covRateLimit), "\ncollectNA:       "), sys.ObjUtil.coerce(this.#collectNA, sys.Obj.type$.toNullable())), "\ntz:              "), this.#tz), "\nwriteFreq:       "), this.#writeFreq), "\nwriteLast:       "), HisCollectRec.detailsDurToTs(this.#writeLast)), "\nwriteErr:        "), HisCollectRec.detailsErr(this.#writeErr)), "\n"));
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("buffer:          ", sys.ObjUtil.coerce(this.#buf.size(), sys.Obj.type$.toNullable())), " ("), sys.ObjUtil.coerce(this.#buf.max(), sys.Obj.type$.toNullable())), " max)\n"));
    this.#buf.each(sys.ObjUtil.coerce((item) => {
      let valStr = ((this$) => { let $_u74 = ((this$) => { let $_u75 = item.curVal(); if ($_u75 == null) return null; return sys.ObjUtil.toStr(item.curVal()); })(this$); if ($_u74 != null) return $_u74; return "null"; })(this$);
      s.add("  ").add(item.ts().toLocale(pattern)).add(" ").add(valStr).add(" {").add(item.curStatus()).add("} ").add(item.writtenToStr()).add("\n");
      return;
    }, sys.Type.find("|sys::Obj?->sys::Void|")));
    return s.toStr();
  }

  static detailsErr(err) {
    return haystack.Etc.debugErr(err);
  }

  static detailsDurToTs(dur) {
    return haystack.Etc.debugDur(sys.ObjUtil.coerce(dur, sys.Obj.type$.toNullable()));
  }

  static static$init() {
    HisCollectRec.#hisCollectIntervalMin = sys.Duration.fromStr("1sec");
    HisCollectRec.#hisCollectIntervalMax = sys.Duration.fromStr("1day");
    HisCollectRec.#maxBufSize = 4096;
    HisCollectRec.#statusInit = "init";
    HisCollectRec.#statusOk = "ok";
    HisCollectRec.#statusFault = "fault";
    return;
  }

}

class HisCollectItem extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisCollectItem.type$; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  #curVal = null;

  curVal() { return this.#curVal; }

  __curVal(it) { if (it === undefined) return this.#curVal; else this.#curVal = it; }

  #curStatus = null;

  curStatus() { return this.#curStatus; }

  __curStatus(it) { if (it === undefined) return this.#curStatus; else this.#curStatus = it; }

  #written = null;

  written(it) {
    if (it === undefined) {
      return this.#written;
    }
    else {
      this.#written = it;
      return;
    }
  }

  static make(ts,curVal,curStatus) {
    const $self = new HisCollectItem();
    HisCollectItem.make$($self,ts,curVal,curStatus);
    return $self;
  }

  static make$($self,ts,curVal,curStatus) {
    $self.#ts = ts;
    $self.#curVal = ((this$) => { let $_u76 = curVal; if ($_u76 == null) return null; return sys.ObjUtil.toImmutable(curVal); })($self);
    $self.#curStatus = curStatus;
    $self.#written = HisCollectItemState.pending();
    return;
  }

  writtenToStr() {
    return this.#written.toStr();
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#ts.toLocale()), " "), this.#curVal), " {"), this.#curStatus), "} "), this.writtenToStr());
  }

}

class HisCollectItemState extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisCollectItemState.type$; }

  static pending() { return HisCollectItemState.vals().get(0); }

  static wroteVal() { return HisCollectItemState.vals().get(1); }

  static wroteNA() { return HisCollectItemState.vals().get(2); }

  static skipped() { return HisCollectItemState.vals().get(3); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new HisCollectItemState();
    HisCollectItemState.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(HisCollectItemState.type$, HisCollectItemState.vals(), name$, checked);
  }

  static vals() {
    if (HisCollectItemState.#vals == null) {
      HisCollectItemState.#vals = sys.List.make(HisCollectItemState.type$, [
        HisCollectItemState.make(0, "pending", ),
        HisCollectItemState.make(1, "wroteVal", ),
        HisCollectItemState.make(2, "wroteNA", ),
        HisCollectItemState.make(3, "skipped", ),
      ]).toImmutable();
    }
    return HisCollectItemState.#vals;
  }

  static static$init() {
    const $_u77 = HisCollectItemState.vals();
    if (true) {
    }
    ;
    return;
  }

}

class WriteObservable extends obs.Observable {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WriteObservable.type$; }

  name() {
    return "obsPointWrites";
  }

  onSubscribe(observer,config) {
    return WriteSubscription.make(this, observer, config);
  }

  static make() {
    const $self = new WriteObservable();
    WriteObservable.make$($self);
    return $self;
  }

  static make$($self) {
    obs.Observable.make$($self);
    return;
  }

}

class WriteSubscription extends obs.RecSubscription {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WriteSubscription.type$; }

  #isAllWrites = false;

  isAllWrites() { return this.#isAllWrites; }

  __isAllWrites(it) { if (it === undefined) return this.#isAllWrites; else this.#isAllWrites = it; }

  static make(observable,observer,config) {
    const $self = new WriteSubscription();
    WriteSubscription.make$($self,observable,observer,config);
    return $self;
  }

  static make$($self,observable,observer,config) {
    obs.RecSubscription.make$($self, observable, observer, config);
    $self.#isAllWrites = config.has("obsAllWrites");
    return;
  }

}

class WriteObservation extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WriteObservation.type$; }

  toStr() { return haystack.Dict.prototype.toStr.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  #level = null;

  level() { return this.#level; }

  __level(it) { if (it === undefined) return this.#level; else this.#level = it; }

  #who = null;

  who() { return this.#who; }

  __who(it) { if (it === undefined) return this.#who; else this.#who = it; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #first = null;

  first() { return this.#first; }

  __first(it) { if (it === undefined) return this.#first; else this.#first = it; }

  static make(observable,ts,id,rec,val,level,who,opts,first) {
    const $self = new WriteObservation();
    WriteObservation.make$($self,observable,ts,id,rec,val,level,who,opts,first);
    return $self;
  }

  static make$($self,observable,ts,id,rec,val,level,who,opts,first) {
    $self.#type = observable.name();
    $self.#ts = ts;
    $self.#id = id;
    $self.#rec = rec;
    $self.#val = ((this$) => { let $_u78 = val; if ($_u78 == null) return null; return sys.ObjUtil.toImmutable(val); })($self);
    $self.#level = level;
    $self.#who = ((this$) => { let $_u79 = who; if ($_u79 == null) return null; return sys.ObjUtil.toImmutable(who); })($self);
    $self.#opts = opts;
    $self.#first = haystack.Marker.fromBool(first);
    return;
  }

  subType() {
    return null;
  }

  isFirst() {
    return this.#first != null;
  }

  isEmpty() {
    return false;
  }

  get(name,def) {
    if (def === undefined) def = null;
    let $_u80 = name;
    if (sys.ObjUtil.equals($_u80, "type")) {
      return this.#type;
    }
    else if (sys.ObjUtil.equals($_u80, "subType")) {
      return this.subType();
    }
    else if (sys.ObjUtil.equals($_u80, "ts")) {
      return this.#ts;
    }
    else if (sys.ObjUtil.equals($_u80, "id")) {
      return this.#id;
    }
    else if (sys.ObjUtil.equals($_u80, "rec")) {
      return this.#rec;
    }
    else if (sys.ObjUtil.equals($_u80, "val")) {
      return this.#val;
    }
    else if (sys.ObjUtil.equals($_u80, "level")) {
      return this.#level;
    }
    else if (sys.ObjUtil.equals($_u80, "who")) {
      return this.#who;
    }
    else if (sys.ObjUtil.equals($_u80, "opts")) {
      return this.#opts;
    }
    else if (sys.ObjUtil.equals($_u80, "first")) {
      return this.#first;
    }
    else {
      return def;
    }
    ;
  }

  has(name) {
    return this.get(name, null) != null;
  }

  missing(name) {
    return !this.has(name);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    return ((this$) => { let $_u81 = this$.get(name, null); if ($_u81 != null) return $_u81; throw haystack.UnknownNameErr.make(name); })(this);
  }

  each(f) {
    const this$ = this;
    this.eachWhile((v,n) => {
      sys.Func.call(f, v, n);
      return null;
    });
    return;
  }

  eachWhile(f) {
    let r = null;
    (r = sys.Func.call(f, this.#type, "type"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#ts, "ts"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#id, "id"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#rec, "rec"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#level, "level"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#who, "who"));
    if (r != null) {
      return r;
    }
    ;
    if (this.#val != null) {
      (r = sys.Func.call(f, sys.ObjUtil.coerce(this.#val, sys.Obj.type$), "val"));
    }
    ;
    if (r != null) {
      return r;
    }
    ;
    if (this.#opts != null) {
      (r = sys.Func.call(f, this.#who, "opts"));
    }
    ;
    if (r != null) {
      return r;
    }
    ;
    if (this.#first != null) {
      (r = sys.Func.call(f, sys.ObjUtil.coerce(this.#first, sys.Obj.type$), "first"));
    }
    ;
    if (r != null) {
      return r;
    }
    ;
    return null;
  }

}

class PointUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PointUtil.type$; }

  static isHisCollect(pt) {
    return (pt.has("hisCollectInterval") || pt.has("hisCollectCov"));
  }

  static applyUnit(pt,val,action) {
    let num = sys.ObjUtil.as(val, haystack.Number.type$);
    if (num == null) {
      return val;
    }
    ;
    let unit = haystack.Number.loadUnit(sys.ObjUtil.coerce(((this$) => { let $_u82 = sys.ObjUtil.as(pt.get("unit"), sys.Str.type$); if ($_u82 != null) return $_u82; return ""; })(this), sys.Str.type$), false);
    if (unit == null) {
      return val;
    }
    ;
    if (num.unit() == null) {
      return haystack.Number.make(num.toFloat(), unit);
    }
    ;
    if (num.unit() !== unit) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("point unit != ", action), " unit: "), unit), " != "), num.unit()));
    }
    ;
    return val;
  }

  static pointDetails(lib,pt,isTop) {
    if (isTop) {
      let cp = lib.rt().conn().point(pt.id(), false);
      if (cp != null) {
        return cp.details();
      }
      ;
    }
    ;
    let ws = lib.writeMgr().details(pt.id());
    let hs = lib.hisCollectMgr().details(pt.id());
    let s = sys.StrBuf.make();
    if (isTop) {
      s.add(PointUtil.toSummary(pt));
    }
    ;
    if (hs != null) {
      s.add("\n").add(hs);
    }
    ;
    if (ws != null) {
      s.add("\n").add(ws);
    }
    ;
    return s.toStr();
  }

  static toSummary(pt) {
    let kind = pt.get("kind");
    let unit = pt.get("unit");
    let tz = pt.get("tz");
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("id:    ", pt.id().toCode()), "\ndis:   "), pt.dis()), "\nkind:  "), kind), "\nunit:  "), unit), "\ntz:    "), tz), "\n");
  }

  static toOccupied(r,checked,cx) {
    let occupied = haystack.Filter.fromStr("occupied");
    if (r.has("equip")) {
      let occ = cx.db().read(occupied.and(haystack.Filter.eq("equipRef", r.id())), false);
      if (occ != null) {
        return occ;
      }
      ;
      (occ = PointUtil.toParentEquipOccupied(r, cx));
      if (occ != null) {
        return occ;
      }
      ;
      (occ = PointUtil.toParentSpaceOccupied(r, cx));
      if (occ != null) {
        return occ;
      }
      ;
    }
    ;
    if (r.has("space")) {
      let occ = cx.db().read(occupied.and(haystack.Filter.eq("spaceRef", r.id())), false);
      if (occ != null) {
        return occ;
      }
      ;
      (occ = PointUtil.toParentSpaceOccupied(r, cx));
      if (occ != null) {
        return occ;
      }
      ;
    }
    ;
    if (r.has("point")) {
      let occ = PointUtil.toParentEquipOccupied(r, cx);
      if (occ != null) {
        return occ;
      }
      ;
      (occ = PointUtil.toParentSpaceOccupied(r, cx));
      if (occ != null) {
        return occ;
      }
      ;
    }
    ;
    let siteId = sys.ObjUtil.coerce(((this$) => { if (r.has("site")) return r.id(); return r.trap("siteRef", sys.List.make(sys.Obj.type$.toNullable(), [])); })(this), haystack.Ref.type$);
    let recs = cx.db().readAll(occupied.and(haystack.Filter.eq("siteRef", siteId)).and(haystack.Filter.has("sitePoint")));
    if (sys.ObjUtil.equals(recs.size(), 1)) {
      return recs.first();
    }
    ;
    if (checked) {
      if (sys.ObjUtil.equals(recs.size(), 0)) {
        throw sys.Err.make(sys.Str.plus("No 'occupied' point found for ", r.id().toZinc()));
      }
      else {
        throw sys.Err.make("Multiple 'sitePoint occupied' matches");
      }
      ;
    }
    ;
    return null;
  }

  static toParentSpaceOccupied(r,cx) {
    let spaceRef = sys.ObjUtil.as(r.get("spaceRef"), haystack.Ref.type$);
    if (spaceRef == null) {
      return null;
    }
    ;
    return PointUtil.toOccupied(sys.ObjUtil.coerce(cx.db().readById(spaceRef), haystack.Dict.type$), false, cx);
  }

  static toParentEquipOccupied(r,cx) {
    let equipRef = sys.ObjUtil.as(r.get("equipRef"), haystack.Ref.type$);
    if (equipRef == null) {
      return null;
    }
    ;
    return PointUtil.toOccupied(sys.ObjUtil.coerce(cx.db().readById(equipRef), haystack.Dict.type$), false, cx);
  }

  static make() {
    const $self = new PointUtil();
    PointUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class RosterTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RosterTest.type$; }

  #lib = null;

  lib(it) {
    if (it === undefined) {
      return this.#lib;
    }
    else {
      this.#lib = it;
      return;
    }
  }

  test() {
    this.addRec(sys.Map.__fromLiteral(["enumMeta","alpha"], [haystack.HaystackTest.m(),"ver:\"3.0\"\nname\n\"off\"\n\"slow\"\n\"fast\""], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.addRec(sys.Map.__fromLiteral(["dis","point","his","tz"], ["A",haystack.HaystackTest.m(),haystack.HaystackTest.m(),"New_York"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.addRec(sys.Map.__fromLiteral(["dis","point","his","tz","writable","writeDef"], ["W",haystack.HaystackTest.m(),haystack.HaystackTest.m(),"New_York",haystack.HaystackTest.m(),haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.addRec(sys.Map.__fromLiteral(["dis","point","his","tz","hisCollectInterval"], ["Int",haystack.HaystackTest.m(),haystack.HaystackTest.m(),"New_York",haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable()), "sec")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.addRec(sys.Map.__fromLiteral(["dis","point","his","tz","hisCollectCov"], ["Cov",haystack.HaystackTest.m(),haystack.HaystackTest.m(),"New_York",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.#lib = sys.ObjUtil.coerce(this.addLib("point"), PointLib.type$.toNullable());
    this.#lib.spi().sync();
    this.sync();
    this.verifyEnumMeta();
    this.verifyWritables();
    this.verifyHisCollects();
    return;
  }

  verifyEnumMeta() {
    this.verifyEq(sys.ObjUtil.coerce(this.#lib.enums().list().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    let e = this.#lib.enums().get("alpha");
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "off", 0);
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "slow", 1);
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "fast", 2);
    this.commit(sys.ObjUtil.coerce(this.rt().db().read(sys.ObjUtil.coerce(haystack.Filter.fromStr("enumMeta"), haystack.Filter.type$)), haystack.Dict.type$), sys.Map.__fromLiteral(["alpha","beta"], ["ver:\"3.0\"\nname\n\"xoff\"\n\"xslow\"\n\"xfast\"","ver:\"3.0\"\n name,code\n \"one\",1\n \"two\",2"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.sync();
    this.verifyEq(sys.ObjUtil.coerce(this.#lib.enums().list().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    (e = this.#lib.enums().get("alpha"));
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "xoff", 0);
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "xslow", 1);
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "xfast", 2);
    (e = this.#lib.enums().get("beta"));
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "one", 1);
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "two", 2);
    this.commit(sys.ObjUtil.coerce(this.rt().db().read(sys.ObjUtil.coerce(haystack.Filter.fromStr("enumMeta"), haystack.Filter.type$)), haystack.Dict.type$), sys.Map.__fromLiteral(["trash"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    this.rt().sync();
    this.verifyEq(sys.ObjUtil.coerce(this.#lib.enums().list().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    return;
  }

  verifyEnumDef(e,name,code) {
    this.verifyEq(e.nameToCode(name), haystack.HaystackTest.n(sys.ObjUtil.coerce(code, sys.Num.type$.toNullable())));
    this.verifyEq(e.codeToName(sys.ObjUtil.coerce(haystack.HaystackTest.n(sys.ObjUtil.coerce(code, sys.Num.type$.toNullable())), haystack.Number.type$)), name);
    return;
  }

  verifyWritables() {
    let a = this.rt().db().read(sys.ObjUtil.coerce(haystack.Filter.fromStr("dis==\"A\""), haystack.Filter.type$));
    let w = this.rt().db().read(sys.ObjUtil.coerce(haystack.Filter.fromStr("dis==\"W\""), haystack.Filter.type$));
    let array = this.verifyWritable(w.id(), haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())), 17);
    this.verifyEq(array.get(16).trap("val", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())));
    (a = this.commit(sys.ObjUtil.coerce(a, haystack.Dict.type$), sys.Map.__fromLiteral(["writable"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker"))));
    this.sync();
    this.verifyWritable(a.id(), null, 17);
    (a = this.commit(sys.ObjUtil.coerce(a, haystack.Dict.type$), sys.Map.__fromLiteral(["writable"], [haystack.Remove.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Remove"))));
    this.sync();
    this.verifyNotWritable(a.id());
    let x = this.addRec(sys.Map.__fromLiteral(["dis","point","writable"], ["New",haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.sync();
    this.verifyWritable(x.id(), null, 17);
    this.commit(x, sys.Map.__fromLiteral(["trash"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    this.sync();
    this.verifyNotWritable(x.id());
    this.verifyWritable(w.id(), haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())), 17);
    this.commit(sys.ObjUtil.coerce(w, haystack.Dict.type$), null, folio.Diff.remove());
    this.sync();
    this.verifyNotWritable(w.id());
    return;
  }

  verifyWritable(id,val,level) {
    let rec = this.rt().db().readById(id);
    if (rec.missing("writeLevel")) {
      this.rt().db().sync();
      (rec = this.rt().db().readById(id));
    }
    ;
    this.verifyEq(rec.get("writeVal"), val);
    this.verifyEq(rec.get("writeLevel"), haystack.HaystackTest.n(sys.ObjUtil.coerce(level, sys.Num.type$.toNullable())));
    let array = this.writeArray(id);
    this.verifyEq(sys.ObjUtil.coerce(array.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable()));
    return array;
  }

  verifyNotWritable(id) {
    const this$ = this;
    this.verifyErrMsg(sys.Err.type$, sys.Str.plus("Not writable point: ", id.toZinc()), (it) => {
      this$.writeArray(id);
      return;
    });
    return;
  }

  writeArray(id) {
    return this.#lib.writeMgr().arrayById(id);
  }

  verifyHisCollects() {
    let int = this.rt().db().read(sys.ObjUtil.coerce(haystack.Filter.fromStr("dis==\"Int\""), haystack.Filter.type$));
    let cov = this.rt().db().read(sys.ObjUtil.coerce(haystack.Filter.fromStr("dis==\"Cov\""), haystack.Filter.type$));
    let a = this.rt().db().read(sys.ObjUtil.coerce(haystack.Filter.fromStr("dis==\"A\""), haystack.Filter.type$));
    this.verifyHisCollect(int.id(), sys.Duration.fromStr("10sec"), false);
    this.verifyHisCollect(cov.id(), null, true);
    this.verifyNotHisCollect(a.id());
    this.verifyHisCollectWatch(sys.List.make(haystack.Dict.type$.toNullable(), [int, cov]));
    (a = this.commit(sys.ObjUtil.coerce(a, haystack.Dict.type$), sys.Map.__fromLiteral(["hisCollectInterval","hisCollectCov"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(5, sys.Num.type$.toNullable()), "min"),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))));
    this.sync();
    this.verifyHisCollect(a.id(), sys.Duration.fromStr("5min"), true);
    this.verifyHisCollectWatch(sys.List.make(haystack.Dict.type$.toNullable(), [int, cov, a]));
    (a = this.commit(sys.ObjUtil.coerce(a, haystack.Dict.type$), sys.Map.__fromLiteral(["hisCollectCov"], [haystack.Remove.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Remove"))));
    this.sync();
    this.verifyHisCollect(a.id(), sys.Duration.fromStr("5min"), false);
    this.verifyHisCollectWatch(sys.List.make(haystack.Dict.type$.toNullable(), [int, cov, a]));
    (a = this.commit(sys.ObjUtil.coerce(a, haystack.Dict.type$), sys.Map.__fromLiteral(["hisCollectInterval"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), "hr")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?"))));
    this.sync();
    this.verifyHisCollect(a.id(), sys.Duration.fromStr("1hr"), false);
    this.verifyHisCollectWatch(sys.List.make(haystack.Dict.type$.toNullable(), [int, cov, a]));
    (a = this.commit(sys.ObjUtil.coerce(a, haystack.Dict.type$), sys.Map.__fromLiteral(["hisCollectInterval"], [haystack.Remove.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Remove"))));
    this.sync();
    this.verifyNotHisCollect(a.id());
    this.verifyHisCollectWatch(sys.List.make(haystack.Dict.type$.toNullable(), [int, cov]));
    let x = this.addRec(sys.Map.__fromLiteral(["dis","point","his","tz","hisCollectInterval"], ["New",haystack.HaystackTest.m(),haystack.HaystackTest.m(),"New_York",haystack.HaystackTest.n(sys.ObjUtil.coerce(30, sys.Num.type$.toNullable()), "sec")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.sync();
    this.verifyHisCollect(x.id(), sys.Duration.fromStr("30sec"), false);
    this.verifyHisCollectWatch(sys.List.make(haystack.Dict.type$.toNullable(), [int, cov, x]));
    this.commit(x, sys.Map.__fromLiteral(["trash"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    this.sync();
    this.verifyNotHisCollect(x.id());
    this.verifyHisCollectWatch(sys.List.make(haystack.Dict.type$.toNullable(), [int, cov]));
    this.verifyHisCollect(cov.id(), null, true);
    this.commit(sys.ObjUtil.coerce(cov, haystack.Dict.type$), null, folio.Diff.remove());
    this.sync();
    this.verifyNotWritable(cov.id());
    this.verifyHisCollectWatch(sys.List.make(haystack.Dict.type$.toNullable(), [int]));
    return;
  }

  verifyHisCollect(id,interval,cov) {
    const this$ = this;
    let details = this.#lib.hisCollectMgr().details(id);
    this.verifyNotNull(details);
    let lines = sys.Str.splitLines(details);
    let intLine = lines.find((it) => {
      return sys.Str.startsWith(it, "interval:");
    });
    let covLine = lines.find((it) => {
      return sys.Str.startsWith(it, "cov:");
    });
    this.verifyEq(sys.ObjUtil.coerce(sys.Str.contains(intLine, sys.ObjUtil.coerce(((this$) => { let $_u84 = ((this$) => { let $_u85 = interval; if ($_u85 == null) return null; return interval.toStr(); })(this$); if ($_u84 != null) return $_u84; return "_x_"; })(this), sys.Str.type$)), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(interval != null, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.Str.contains(covLine, "marker"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(cov, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().isWatched(id), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return;
  }

  verifyNotHisCollect(id) {
    let details = this.#lib.hisCollectMgr().details(id);
    this.verifyNull(details);
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().isWatched(id), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    return;
  }

  verifyHisCollectWatch(recs) {
    const this$ = this;
    let watch = ((this$) => { let $_u86 = this$.rt().watch().list().first(); if ($_u86 != null) return $_u86; throw sys.Err.make("no watch"); })(this);
    this.verifyEq(watch.dis(), "HisCollect");
    this.verifyEq(recs.map((r) => {
      return r.id();
    }, haystack.Ref.type$).sort(), watch.list().dup().sort());
    return;
  }

  sync() {
    this.rt().sync();
    this.#lib.hisCollectMgr().forceCheck();
    return;
  }

  static make() {
    const $self = new RosterTest();
    RosterTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

class ConvertTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConvertTest.type$; }

  #lib = null;

  lib(it) {
    if (it === undefined) {
      return this.#lib;
    }
    else {
      this.#lib = it;
      return;
    }
  }

  test() {
    this.#lib = sys.ObjUtil.coerce(this.addLib("point"), PointLib.type$.toNullable());
    this.doCache();
    this.doEnums();
    this.doParse();
    this.doEnumConverts();
    this.doUnit();
    this.doBool();
    this.doTypeConverts();
    this.doThermistor();
    this.doFunc();
    return;
  }

  doCache() {
    this.verifySame(PointConvert.fromStr("+3"), PointConvert.fromStr("+3"));
    let e1 = null;
    let e2 = null;
    let x = null;
    try {
      (x = PointConvert.fromStr("bad!#@#"));
    }
    catch ($_u87) {
      $_u87 = sys.Err.make($_u87);
      if ($_u87 instanceof sys.Err) {
        let e = $_u87;
        ;
        (e1 = e);
      }
      else {
        throw $_u87;
      }
    }
    ;
    try {
      (x = PointConvert.fromStr("bad!#@#"));
    }
    catch ($_u88) {
      $_u88 = sys.Err.make($_u88);
      if ($_u88 instanceof sys.Err) {
        let e = $_u88;
        ;
        (e2 = e);
      }
      else {
        throw $_u88;
      }
    }
    ;
    this.verifyEq(sys.ObjUtil.typeof(e1), sys.ParseErr.type$);
    this.verifySame(e1.cause(), e2.cause());
    return;
  }

  doEnums() {
    const this$ = this;
    this.rt().db().commit(folio.Diff.makeAdd(sys.Map.__fromLiteral(["enumMeta","notMeta","alpha","beta","gamma"], [haystack.Marker.val(),"foo","ver:\"3.0\"\nname\n\"off\"\n\"slow\"\n\"fast\"","ver:\"3.0\"\nname,code\n\"negOne\",-1\n\"seven\",7\n\"five\",5\n\"nine\",9",haystack.ZincReader.make(sys.Str.in("ver:\"3.0\"\nname,code\n\"a\",-1\n\"x\",-1\n\"b\",9\n\"b\",10")).readGrid()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))));
    this.rt().sync();
    let list = this.#lib.enums().list();
    this.verifyEq(sys.ObjUtil.coerce(list.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(list.get(0).id(), "alpha");
    this.verifyEq(sys.ObjUtil.coerce(list.get(0).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(list.get(1).id(), "beta");
    this.verifyEq(sys.ObjUtil.coerce(list.get(1).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(list.get(2).id(), "gamma");
    this.verifyEq(sys.ObjUtil.coerce(list.get(2).size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(this.#lib.enums().get("bad", false), null);
    this.verifyErr(haystack.UnknownNameErr.type$, (it) => {
      this$.#lib.enums().get("bad");
      return;
    });
    let e = this.#lib.enums().get("alpha");
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "off", 0);
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "slow", 1);
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "fast", 2);
    this.verifyEnumBad(sys.ObjUtil.coerce(e, EnumDef.type$));
    (e = this.#lib.enums().get("beta"));
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "negOne", -1);
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "seven", 7);
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "five", 5);
    this.verifyEnumDef(sys.ObjUtil.coerce(e, EnumDef.type$), "nine", 9);
    this.verifyEnumBad(sys.ObjUtil.coerce(e, EnumDef.type$));
    (e = this.#lib.enums().get("gamma"));
    this.verifyEq(e.nameToCode("a"), haystack.HaystackTest.n(sys.ObjUtil.coerce(-1, sys.Num.type$.toNullable())));
    this.verifyEq(e.nameToCode("x"), haystack.HaystackTest.n(sys.ObjUtil.coerce(-1, sys.Num.type$.toNullable())));
    this.verifyEq(e.nameToCode("b"), haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())));
    this.verifyEq(e.codeToName(sys.ObjUtil.coerce(haystack.HaystackTest.n(sys.ObjUtil.coerce(-1, sys.Num.type$.toNullable())), haystack.Number.type$)), "a");
    this.verifyEq(e.codeToName(sys.ObjUtil.coerce(haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())), haystack.Number.type$)), "b");
    this.verifyEq(e.codeToName(sys.ObjUtil.coerce(haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable())), haystack.Number.type$)), "b");
    this.verifyEnumBad(sys.ObjUtil.coerce(e, EnumDef.type$));
    return;
  }

  verifyEnumDef(e,name,code) {
    this.verifyEq(e.nameToCode(name), haystack.HaystackTest.n(sys.ObjUtil.coerce(code, sys.Num.type$.toNullable())));
    this.verifyEq(e.codeToName(sys.ObjUtil.coerce(haystack.HaystackTest.n(sys.ObjUtil.coerce(code, sys.Num.type$.toNullable())), haystack.Number.type$)), name);
    return;
  }

  verifyEnumBad(e) {
    const this$ = this;
    this.verifyEq(e.nameToCode("bad", false), null);
    this.verifyErr(haystack.UnknownNameErr.type$, (it) => {
      e.nameToCode("bad");
      return;
    });
    this.verifyEq(e.codeToName(sys.ObjUtil.coerce(haystack.HaystackTest.n(sys.ObjUtil.coerce(-9999, sys.Num.type$.toNullable())), haystack.Number.type$), false), null);
    this.verifyErr(haystack.UnknownNameErr.type$, (it) => {
      e.codeToName(sys.ObjUtil.coerce(haystack.HaystackTest.n(sys.ObjUtil.coerce(-9999, sys.Num.type$.toNullable())), haystack.Number.type$));
      return;
    });
    return;
  }

  doEnumConverts() {
    let rec = haystack.Etc.makeDict(sys.Map.__fromLiteral(["enum"], ["x, y, z"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    let c = PointConvert.fromStr("enumStrToNumber(gamma)");
    this.verifyEq(sys.ObjUtil.toStr(c), "enumStrToNumber(gamma,true)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "a", haystack.HaystackTest.n(sys.ObjUtil.coerce(-1, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "x", haystack.HaystackTest.n(sys.ObjUtil.coerce(-1, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "b", haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "foobar", haystack.UnknownNameErr.type$);
    let oldc = c;
    (c = PointConvert.fromStr("enumStrToNumber( gamma, true)"));
    this.verifyEq(sys.ObjUtil.toStr(oldc), sys.ObjUtil.toStr(c));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "b", haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "foobar", haystack.UnknownNameErr.type$);
    (c = PointConvert.fromStr("enumStrToNumber(gamma, false)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "enumStrToNumber(gamma,false)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "b", haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "foobar", null);
    (c = PointConvert.fromStr("enumStrToNumber(gamma, false) ?: -123"));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "b", haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "foobar", haystack.HaystackTest.n(sys.ObjUtil.coerce(-123, sys.Num.type$.toNullable())));
    (c = PointConvert.fromStr("enumNumberToStr(gamma)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "enumNumberToStr(gamma,true)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(-1, sys.Num.type$.toNullable())), "a");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())), "b");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable())), "b");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(99, sys.Num.type$.toNullable())), haystack.UnknownNameErr.type$);
    (c = PointConvert.fromStr("enumNumberToStr(gamma,false)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "enumNumberToStr(gamma,false)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable())), "b");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(99, sys.Num.type$.toNullable())), null);
    (c = PointConvert.fromStr("enumStrToBool(alpha)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "enumStrToBool(alpha,true)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "off", sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "slow", sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "fast", sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "bad", haystack.UnknownNameErr.type$);
    (c = PointConvert.fromStr("enumStrToBool(alpha, false)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "enumStrToBool(alpha,false)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "fast", sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "bad", null);
    (c = PointConvert.fromStr("enumBoolToStr(alpha)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "enumBoolToStr(alpha)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), "off");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), "slow");
    (c = PointConvert.fromStr("enumBoolToStr(self)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "enumBoolToStr(self)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), "x");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), "y");
    (c = PointConvert.fromStr("enumNumberToStr(self,false)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "enumNumberToStr(self,false)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())), "x");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())), "y");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())), "z");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), null);
    (c = PointConvert.fromStr("enumNumberToStr(self,false) ?: invalid"));
    this.verifyEq(sys.ObjUtil.toStr(c), "enumNumberToStr(self,false) ?: invalid");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())), "x");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())), "y");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())), "z");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), "invalid");
    (c = PointConvert.fromStr("enumStrToNumber(self,false)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "enumStrToNumber(self,false)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "x", haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "y", haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "z", haystack.HaystackTest.n(sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "w", null);
    return;
  }

  doParse() {
    const this$ = this;
    this.verifyParse("+81", sys.ObjUtil.coerce(sys.Float.make(3.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(84.0), sys.Obj.type$.toNullable()), AddConvert.type$, sys.ObjUtil.coerce(sys.Float.make(81.0), sys.Obj.type$.toNullable()));
    this.verifyParse("  +   -3  ", sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), AddConvert.type$, sys.ObjUtil.coerce(sys.Float.make(-3.0), sys.Obj.type$.toNullable()));
    this.verifyParse("-10", sys.ObjUtil.coerce(sys.Float.make(17.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(7.0), sys.Obj.type$.toNullable()), SubConvert.type$, sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()));
    this.verifyParse("- 10", sys.ObjUtil.coerce(sys.Float.make(17.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(7.0), sys.Obj.type$.toNullable()), SubConvert.type$, sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()));
    this.verifyParse("*5", sys.ObjUtil.coerce(sys.Float.make(7.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(35.0), sys.Obj.type$.toNullable()), MulConvert.type$, sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()));
    this.verifyParse("* 1.2", sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(6.0), sys.Obj.type$.toNullable()), MulConvert.type$, sys.ObjUtil.coerce(sys.Float.make(1.2), sys.Obj.type$.toNullable()));
    this.verifyParse("/0.5", sys.ObjUtil.coerce(sys.Float.make(12.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(24.0), sys.Obj.type$.toNullable()), DivConvert.type$, sys.ObjUtil.coerce(sys.Float.make(0.5), sys.Obj.type$.toNullable()));
    this.verifyParse("&0xab", sys.ObjUtil.coerce(sys.Float.make(209.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(129.0), sys.Obj.type$.toNullable()), AndConvert.type$, sys.ObjUtil.coerce(171, sys.Obj.type$.toNullable()));
    this.verifyParse("&171", sys.ObjUtil.coerce(sys.Float.make(209.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(129.0), sys.Obj.type$.toNullable()), AndConvert.type$, sys.ObjUtil.coerce(171, sys.Obj.type$.toNullable()));
    this.verifyParse("|0xab", sys.ObjUtil.coerce(sys.Float.make(209.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(251.0), sys.Obj.type$.toNullable()), OrConvert.type$, sys.ObjUtil.coerce(171, sys.Obj.type$.toNullable()));
    this.verifyParse("^ 0xab ", sys.ObjUtil.coerce(sys.Float.make(209.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(122.0), sys.Obj.type$.toNullable()), XorConvert.type$, sys.ObjUtil.coerce(171, sys.Obj.type$.toNullable()));
    this.verifyParse("<< 8 ", sys.ObjUtil.coerce(sys.Float.make(171.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(43776.0), sys.Obj.type$.toNullable()), ShiftlConvert.type$, sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()));
    this.verifyParse(">> 4 ", sys.ObjUtil.coerce(sys.Float.make(171.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), ShiftrConvert.type$, sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyParse("pow(8) ", sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(256.0), sys.Obj.type$.toNullable()), PowConvert.type$);
    this.verifyParse("pow(-1) ", sys.ObjUtil.coerce(sys.Float.make(77.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.012987012987012988), sys.Obj.type$.toNullable()), PowConvert.type$);
    this.verifyParse("pow(-2) ", sys.ObjUtil.coerce(sys.Float.make(16.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(0.00390625), sys.Obj.type$.toNullable()), PowConvert.type$);
    this.verifyParse("min(9) ", sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()), MinConvert.type$);
    this.verifyParse("min(9) ", sys.ObjUtil.coerce(sys.Float.make(11.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(9.0), sys.Obj.type$.toNullable()), MinConvert.type$);
    this.verifyParse("max(10) ", sys.ObjUtil.coerce(sys.Float.make(8.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), MaxConvert.type$);
    this.verifyParse("max(10) ", sys.ObjUtil.coerce(sys.Float.make(12.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(12.0), sys.Obj.type$.toNullable()), MaxConvert.type$);
    this.verifyParse("toStr()", null, "null", ToStrConvert.type$);
    this.verifyParse("toStr()", "foo", "foo", ToStrConvert.type$);
    this.verifyParse("toStr()", haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), "3", ToStrConvert.type$);
    this.verifyParse("toStr()", sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), "true", ToStrConvert.type$);
    this.verifyParse("upper()", null, null, UpperConvert.type$);
    this.verifyParse("upper()", "FooBar", "FOOBAR", UpperConvert.type$);
    this.verifyParse("lower()", null, null, LowerConvert.type$);
    this.verifyParse("lower()", "FooBar", "foobar", LowerConvert.type$);
    this.verifyParse("strReplace(\$20, _)", "Foo\$20Bar", "Foo_Bar", StrReplaceConvert.type$);
    this.verifyParse("strReplace('_', ' ')", "Foo_Bar", "Foo Bar", StrReplaceConvert.type$);
    this.verifyParse("strReplace('_',' ')", "Foo_Bar", "Foo Bar", StrReplaceConvert.type$);
    this.verifyParse("strReplace(' ', '')", " Foo Bar ", "FooBar", StrReplaceConvert.type$);
    this.verifyParse("strReplace('xx', '__')", "xxFooxxBarxxBox", "__Foo__Bar__Box", StrReplaceConvert.type$);
    this.verifyParse("strReplace( xx, __ )", "xxFooxxBarxxBox", "__Foo__Bar__Box", StrReplaceConvert.type$);
    this.verifyParse("reset(10,20,300,400)", sys.ObjUtil.coerce(sys.Float.make(-8.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(300.0), sys.Obj.type$.toNullable()), ResetConvert.type$);
    this.verifyParse("reset(10,20,300,400)", sys.ObjUtil.coerce(sys.Float.make(10.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(300.0), sys.Obj.type$.toNullable()), ResetConvert.type$);
    this.verifyParse("reset(10,20,300,400)", sys.ObjUtil.coerce(sys.Float.make(12.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(320.0), sys.Obj.type$.toNullable()), ResetConvert.type$);
    this.verifyParse("reset(10,20,300,400)", sys.ObjUtil.coerce(sys.Float.make(19.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(390.0), sys.Obj.type$.toNullable()), ResetConvert.type$);
    this.verifyParse("reset(10,20,300,400)", sys.ObjUtil.coerce(sys.Float.make(21.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(400.0), sys.Obj.type$.toNullable()), ResetConvert.type$);
    this.verifyParse("+14 * 10", sys.ObjUtil.coerce(sys.Float.make(2.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(160.0), sys.Obj.type$.toNullable()), PipelineConvert.type$);
    this.verifyParse("* 3 + 13 / 0.5 -2", sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(54.0), sys.Obj.type$.toNullable()), PipelineConvert.type$);
    this.verifyParse("u2SwapEndian()", sys.ObjUtil.coerce(sys.Float.make(43811.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(9131.0), sys.Obj.type$.toNullable()), U2SwapEndianConvert.type$);
    this.verifyParse("u2SwapEndian()", sys.ObjUtil.coerce(sys.Float.make(65244.0), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(56574.0), sys.Obj.type$.toNullable()), U2SwapEndianConvert.type$);
    this.verifyParse("u4SwapEndian()", sys.ObjUtil.coerce(sys.Float.make(2.696004307E9), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.552752032E9), sys.Obj.type$.toNullable()), U4SwapEndianConvert.type$);
    this.verifyParse("u4SwapEndian()", sys.ObjUtil.coerce(sys.Float.make(1.6821197E7), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.Float.make(3.450535937E9), sys.Obj.type$.toNullable()), U4SwapEndianConvert.type$);
    this.verifyParse("numberToBool()", haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Num.type$.toNullable())), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), NumberToBoolConvert.type$);
    this.verifyParse("numberToBool()", haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(1.0), sys.Num.type$.toNullable())), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), NumberToBoolConvert.type$);
    this.verifyParse("numberToBool() invert()", haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(0.0), sys.Num.type$.toNullable())), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), PipelineConvert.type$);
    this.verifyParse("numberToBool() invert()", haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(99.0), sys.Num.type$.toNullable())), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), PipelineConvert.type$);
    this.verifyParse("numberToStr(off, slow, fast)", haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())), "off", NumberToStrConvert.type$);
    this.verifyParse("numberToStr(off, slow, fast)", haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())), "slow", NumberToStrConvert.type$);
    this.verifyParse("numberToStr(off, slow, fast)", haystack.HaystackTest.n(sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())), "fast", NumberToStrConvert.type$);
    this.verifyParse("numberToStr(off, slow, fast)", haystack.HaystackTest.n(sys.ObjUtil.coerce(-1, sys.Num.type$.toNullable())), null, NumberToStrConvert.type$);
    this.verifyParse("numberToStr(off, slow, fast)", haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), null, NumberToStrConvert.type$);
    this.verifyParse("numberToStr(off, slow, fast) ?: unknown", haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), "unknown", PipelineConvert.type$);
    this.verifyStrToBool("strToBool(off, *)", sys.List.make(sys.Str.type$, ["off"]), sys.List.make(sys.Str.type$));
    this.verifyStrToBool("strToBool(off nil, *)", sys.List.make(sys.Str.type$, ["off", "nil"]), sys.List.make(sys.Str.type$));
    this.verifyStrToBool("strToBool(*, on)", sys.List.make(sys.Str.type$), sys.List.make(sys.Str.type$, ["on"]));
    this.verifyStrToBool("strToBool( * ,  on  run)", sys.List.make(sys.Str.type$), sys.List.make(sys.Str.type$, ["on", "run"]), "strToBool(*, on run)");
    this.verifyStrToBool("strToBool(a b c d, x y z)", sys.List.make(sys.Str.type$, ["a", "b", "c", "d"]), sys.List.make(sys.Str.type$, ["x", "y", "z"]));
    this.verifyStrToBool("strToBool(num0, num99)", sys.List.make(sys.Str.type$, ["num0"]), sys.List.make(sys.Str.type$, ["num99"]));
    this.verifyStrToBool("strToBool(0, 1 2)", sys.List.make(sys.Str.type$, ["0"]), sys.List.make(sys.Str.type$, ["1", "2"]));
    this.verifyParse("strToNumber()", haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())), haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())), StrToNumberConvert.type$);
    this.verifyParse("strToNumber()", "4.2", haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(4.2), sys.Num.type$.toNullable())), StrToNumberConvert.type$);
    this.verifyParse("strToNumber()", "-99%", haystack.HaystackTest.n(sys.ObjUtil.coerce(-99, sys.Num.type$.toNullable()), "%"), StrToNumberConvert.type$);
    this.verifyParse("strToNumber(false)", "foo", null, StrToNumberConvert.type$);
    this.verifyParse("strToNumber(false) ?: 2.8", "foo", haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(2.8), sys.Num.type$.toNullable())), PipelineConvert.type$);
    this.verifyParse("strToNumber(false) ?: -99", "foo", haystack.HaystackTest.n(sys.ObjUtil.coerce(-99, sys.Num.type$.toNullable())), PipelineConvert.type$);
    this.verifyParse("strToNumber() m => cm", "2m", haystack.HaystackTest.n(sys.ObjUtil.coerce(200, sys.Num.type$.toNullable()), "cm"), PipelineConvert.type$);
    this.verifyParse("?: false", sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), ElvisConvert.type$);
    this.verifyParse("?: false", null, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), ElvisConvert.type$);
    this.verifyParse("?: true", sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), ElvisConvert.type$);
    this.verifyParse("?: true", null, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), ElvisConvert.type$);
    this.verifyParse("?: NA", haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), ElvisConvert.type$);
    this.verifyParse("?: NA", null, haystack.NA.val(), ElvisConvert.type$);
    this.verifyParse("?: 125", haystack.HaystackTest.n(sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())), haystack.HaystackTest.n(sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())), ElvisConvert.type$);
    this.verifyParse("?: 125", null, haystack.HaystackTest.n(sys.ObjUtil.coerce(125, sys.Num.type$.toNullable())), ElvisConvert.type$);
    this.verifyParse("?: -123.456", null, haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(-123.456), sys.Num.type$.toNullable())), ElvisConvert.type$);
    this.verifyParse("?: err", "ok", "ok", ElvisConvert.type$);
    this.verifyParse("?: err", null, "err", ElvisConvert.type$);
    this.verifyEq(PointConvert.fromStr("", false), null);
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("", true);
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("-xx");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("* foo");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("/ 0");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("/ 0");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("foo(");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("foo(a");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("foo(a b");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("foo(a b, ");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("foo(a b, c");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("foo(a b, c d");
      return;
    });
    return;
  }

  verifyParse(s,in$,out,type,x) {
    if (x === undefined) x = null;
    let c = PointConvert.fromStr(s);
    let rec = haystack.Etc.emptyDict();
    this.verifyEq(sys.ObjUtil.typeof(c), type);
    if ((sys.ObjUtil.is(in$, sys.Float.type$) && sys.ObjUtil.is(out, sys.Float.type$))) {
      this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(in$, sys.Num.type$.toNullable())), haystack.HaystackTest.n(sys.ObjUtil.coerce(out, sys.Num.type$.toNullable())));
      this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(in$, sys.Num.type$.toNullable()), "%"), haystack.HaystackTest.n(sys.ObjUtil.coerce(out, sys.Num.type$.toNullable()), "%"));
    }
    else {
      let q = c.convert(sys.ObjUtil.coerce(this.#lib, PointLib.type$), rec, in$);
      this.verifyEq(q, out);
    }
    ;
    if (x != null) {
      this.verifyEq(sys.ObjUtil.trap(c,"x", sys.List.make(sys.Obj.type$.toNullable(), [])), x);
    }
    ;
    if ((!sys.Str.contains(s, "?:") && sys.ObjUtil.compareNE(s, "toStr()"))) {
      this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    }
    ;
    return;
  }

  verifyStrToBool(s,fs,ts,toStr) {
    if (toStr === undefined) toStr = s;
    const this$ = this;
    let c = sys.ObjUtil.coerce(PointConvert.fromStr(s), StrToBoolConvert.type$);
    this.verifyEq(c.falseStrs(), fs);
    this.verifyEq(c.trueStrs(), ts);
    let rec = haystack.Etc.emptyDict();
    fs.each((x) => {
      this$.verifyConvert(c, rec, x, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      return;
    });
    ts.each((x) => {
      this$.verifyConvert(c, rec, x, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      return;
    });
    if ((sys.ObjUtil.compareGT(fs.size(), 0) && sys.ObjUtil.compareGT(ts.size(), 0))) {
      this.verifyConvert(c, rec, "none", null);
    }
    ;
    this.verifyEq(c.toStr(), toStr);
    return;
  }

  doUnit() {
    const this$ = this;
    this.verifyUnit("\u00b0C=>\u00b0F", sys.Float.make(0.0), sys.Float.make(32.0));
    this.verifyUnit("\u00b0C => \u00b0F", sys.Float.make(100.0), sys.Float.make(212.0));
    this.verifyUnit("km => m", sys.Float.make(2.0), sys.Float.make(2000.0));
    this.verifyUnit("J/m\u00b2=>kWh/m\u00b2", sys.Float.make(600000.0), sys.Float.make(0.16666667));
    this.verifyUnit("J/m\u00b2  =>  kWh/m\u00b2", sys.Float.make(600000.0), sys.Float.make(0.16666667));
    let rec = haystack.Etc.emptyDict();
    this.verifyConvert(sys.ObjUtil.coerce(PointConvert.fromStr("as(\u00b0F)"), PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(PointConvert.fromStr("as(\u00b0F)"), PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(55, sys.Num.type$.toNullable()), "\u00b0F"), haystack.HaystackTest.n(sys.ObjUtil.coerce(55, sys.Num.type$.toNullable()), "\u00b0F"));
    this.verifyConvert(sys.ObjUtil.coerce(PointConvert.fromStr("as(\u00b0C)"), PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(55, sys.Num.type$.toNullable()), "\u00b0F"), haystack.HaystackTest.n(sys.ObjUtil.coerce(55, sys.Num.type$.toNullable()), "\u00b0C"));
    this.verifyConvert(sys.ObjUtil.coerce(PointConvert.fromStr("as(ft)"), PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(55, sys.Num.type$.toNullable()), "\u00b0F"), haystack.HaystackTest.n(sys.ObjUtil.coerce(55, sys.Num.type$.toNullable()), "ft"));
    let c = PointConvert.fromStr("km=>m + 13");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Num.type$.toNullable())), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(5013.0), sys.Num.type$.toNullable()), "m"));
    (c = PointConvert.fromStr("+3 km=>m +13"));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(5.0), sys.Num.type$.toNullable())), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(8013.0), sys.Num.type$.toNullable()), "m"));
    (c = PointConvert.fromStr("\u00b0C => km"));
    this.verifyErr(sys.Err.type$, (it) => {
      c.convert(sys.ObjUtil.coerce(this$.#lib, PointLib.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Num.type$.toNullable())));
      return;
    });
    this.verifyErr(haystack.UnitErr.type$, (it) => {
      c.convert(sys.ObjUtil.coerce(this$.#lib, PointLib.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(4.0), sys.Num.type$.toNullable()), "m"));
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("foo=>m");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("m=>foo");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("as()");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = PointConvert.fromStr("as(foo)");
      return;
    });
    return;
  }

  verifyUnit(s,from$,expected) {
    let c = sys.ObjUtil.coerce(PointConvert.fromStr(s), UnitConvert.type$);
    let rec = haystack.Etc.emptyDict();
    this.verifyConvert(c, rec, null, null);
    let to = sys.ObjUtil.coerce(c.convert(sys.ObjUtil.coerce(this.#lib, PointLib.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(from$, sys.Num.type$.toNullable()))), haystack.Number.type$);
    this.verifyEq(to.unit(), c.to());
    this.verify(sys.Float.approx(expected, to.toFloat()));
    (to = sys.ObjUtil.coerce(c.convert(sys.ObjUtil.coerce(this.#lib, PointLib.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(from$, sys.Num.type$.toNullable()), c.from())), haystack.Number.type$));
    this.verifyEq(to.unit(), c.to());
    this.verify(sys.Float.approx(expected, to.toFloat()));
    return;
  }

  doBool() {
    let c = PointConvert.fromStr("invert()");
    let rec = haystack.Etc.emptyDict();
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return;
  }

  doTypeConverts() {
    let rec = haystack.Etc.emptyDict();
    let c = PointConvert.fromStr("strToNumber()");
    this.verifyEq(sys.ObjUtil.toStr(c), "strToNumber(true)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "123", haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "1.23ft", haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(1.23), sys.Num.type$.toNullable()), "ft"));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "xxx", sys.ParseErr.type$);
    (c = PointConvert.fromStr("strToNumber(false)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "strToNumber(false)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "123", haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "1.23ft", haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(1.23), sys.Num.type$.toNullable()), "ft"));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "xxx", null);
    (c = PointConvert.fromStr("hexToNumber()"));
    this.verifyEq(sys.ObjUtil.toStr(c), "hexToNumber(true)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "123abc", haystack.HaystackTest.n(sys.ObjUtil.coerce(1194684, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "xxx", sys.ParseErr.type$);
    (c = PointConvert.fromStr("hexToNumber(false)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "hexToNumber(false)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "ff", haystack.HaystackTest.n(sys.ObjUtil.coerce(255, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "xxx", null);
    (c = PointConvert.fromStr("numberToStr()"));
    this.verifyEq(sys.ObjUtil.toStr(c), "numberToStr()");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())), "123");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(1.23), sys.Num.type$.toNullable()), "ft"), "1.23ft");
    (c = PointConvert.fromStr("numberToHex()"));
    this.verifyEq(sys.ObjUtil.toStr(c), "numberToHex()");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(1234, sys.Num.type$.toNullable())), "4d2");
    (c = PointConvert.fromStr("numberToBool()"));
    this.verifyEq(sys.ObjUtil.toStr(c), "numberToBool()");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(99, sys.Num.type$.toNullable())), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    (c = PointConvert.fromStr("boolToNumber()"));
    this.verifyEq(sys.ObjUtil.toStr(c), "boolToNumber(0,1)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "not bool", haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())));
    (c = PointConvert.fromStr("boolToNumber(-10kW, 20kW)"));
    this.verifyEq(sys.ObjUtil.toStr(c), "boolToNumber(-10kW,20kW)");
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, null, null);
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), haystack.HaystackTest.n(sys.ObjUtil.coerce(20, sys.Num.type$.toNullable()), "kW"));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), haystack.HaystackTest.n(sys.ObjUtil.coerce(-10, sys.Num.type$.toNullable()), "kW"));
    this.verifyConvert(sys.ObjUtil.coerce(c, PointConvert.type$), rec, "not bool", haystack.HaystackTest.n(sys.ObjUtil.coerce(-10, sys.Num.type$.toNullable()), "kW"));
    return;
  }

  doThermistor() {
    let c = PointConvert.fromStr("thermistor(3k)");
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(5813.0), sys.Float.make(51.0));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(5513.0), sys.Float.make(53.0));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(5663.0), sys.Float.make(52.0));
    (c = PointConvert.fromStr("thermistor(10k-2)"));
    this.verifySame(c, PointConvert.fromStr("thermistor(10k-2)"));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(999999.0), sys.Float.make(-39.0));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(323840.0), sys.Float.make(-39.0));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(323839.0), sys.Float.make(-39.0));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(318122.75), sys.Float.make(-38.5));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(307833.5), sys.Float.make(-37.6));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(300974.0), sys.Float.make(-37.0));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(10000.0), sys.Float.make(77.0));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(9952.6), sys.Float.make(77.2));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(9526.0), sys.Float.make(79.0));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(1070.0), sys.Float.make(185.0));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(1061.0), sys.Float.make(185.5));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(1034.0), sys.Float.make(187.0));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(1032.0), sys.Float.make(187.0));
    this.verifyThermistor(sys.ObjUtil.coerce(c, PointConvert.type$), sys.Float.make(-99.0), sys.Float.make(187.0));
    return;
  }

  verifyThermistor(c,ohms,degF) {
    let rec = haystack.Etc.emptyDict();
    let degC = haystack.Number.F().convertTo(degF, haystack.Number.C());
    this.verifyConvert(c, rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(ohms, sys.Num.type$.toNullable())), haystack.HaystackTest.n(sys.ObjUtil.coerce(degF, sys.Num.type$.toNullable()), haystack.Number.F()));
    (rec = haystack.Etc.makeDict(sys.Map.__fromLiteral(["unit"], ["\u00b0C"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(sys.ObjUtil.trap(c.convert(sys.ObjUtil.coerce(this.#lib, PointLib.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(ohms, sys.Num.type$.toNullable()))),"toLocale", sys.List.make(sys.Obj.type$.toNullable(), ["#.000"])), haystack.HaystackTest.n(sys.ObjUtil.coerce(degC, sys.Num.type$.toNullable()), haystack.Number.C()).toLocale("#.000"));
    (rec = haystack.Etc.makeDict(sys.Map.__fromLiteral(["unit"], ["celsius"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(sys.ObjUtil.trap(c.convert(sys.ObjUtil.coerce(this.#lib, PointLib.type$), rec, haystack.HaystackTest.n(sys.ObjUtil.coerce(ohms, sys.Num.type$.toNullable()))),"toLocale", sys.List.make(sys.Obj.type$.toNullable(), ["#.000"])), haystack.HaystackTest.n(sys.ObjUtil.coerce(degC, sys.Num.type$.toNullable()), haystack.Number.C()).toLocale("#.000"));
    this.verifyConvert(c, rec, null, null);
    return;
  }

  doFunc() {
    let pt = this.addRec(sys.Map.__fromLiteral(["dis","point"], ["Dummy point",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.verifyFuncConvert(null, "+3", haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), haystack.HaystackTest.n(sys.ObjUtil.coerce(6, sys.Num.type$.toNullable())));
    this.verifyFuncConvert(haystack.Etc.emptyDict(), "*3", haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable())));
    this.verifyFuncConvert(pt, "*3 -1", haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), haystack.HaystackTest.n(sys.ObjUtil.coerce(8, sys.Num.type$.toNullable())));
    this.verifyFuncConvert(pt.id(), "numberToStr()", haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())), "3");
    let g = sys.ObjUtil.coerce(this.eval("enumDefs()"), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(g.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyDictEq(g.get(0), sys.Map.__fromLiteral(["id","size"], ["alpha",haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyDictEq(g.get(1), sys.Map.__fromLiteral(["id","size"], ["beta",haystack.HaystackTest.n(sys.ObjUtil.coerce(4, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyDictEq(g.get(2), sys.Map.__fromLiteral(["id","size"], ["gamma",haystack.HaystackTest.n(sys.ObjUtil.coerce(4, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    (g = sys.ObjUtil.coerce(this.eval("enumDef(\"beta\")"), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(g.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyDictEq(g.get(0), sys.Map.__fromLiteral(["name","code"], ["negOne",haystack.HaystackTest.n(sys.ObjUtil.coerce(-1, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyDictEq(g.get(1), sys.Map.__fromLiteral(["name","code"], ["seven",haystack.HaystackTest.n(sys.ObjUtil.coerce(7, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyDictEq(g.get(2), sys.Map.__fromLiteral(["name","code"], ["five",haystack.HaystackTest.n(sys.ObjUtil.coerce(5, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.verifyDictEq(g.get(3), sys.Map.__fromLiteral(["name","code"], ["nine",haystack.HaystackTest.n(sys.ObjUtil.coerce(9, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    return;
  }

  verifyFuncConvert(rec,pattern,from$,expected) {
    let $axon = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("pointConvert(", haystack.Etc.toAxon(rec)), ", "), sys.Str.toCode(pattern)), ", "), haystack.Etc.toAxon(from$)), ")");
    let actual = this.eval($axon);
    this.verifyEq(actual, expected);
    return;
  }

  verifyConvert(c,rec,val,expected) {
    const this$ = this;
    if (sys.ObjUtil.is(expected, sys.Type.type$)) {
      this.verifyErr(sys.ObjUtil.coerce(expected, sys.Type.type$.toNullable()), (it) => {
        c.convert(sys.ObjUtil.coerce(this$.#lib, PointLib.type$), rec, val);
        return;
      });
    }
    else {
      let actual = c.convert(sys.ObjUtil.coerce(this.#lib, PointLib.type$), rec, val);
      this.verifyEq(actual, expected);
    }
    ;
    return;
  }

  static make() {
    const $self = new ConvertTest();
    ConvertTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

class HisCollectTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisCollectTest.type$; }

  testConfig() {
    let lib = sys.ObjUtil.coerce(this.addLib("point"), PointLib.type$);
    this.verifyConfig(lib, sys.Map.__fromLiteral(["hisCollectInterval","kind"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(20, sys.Num.type$.toNullable()), "min"),"Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), "20min (0hr, 20min, 0sec)", "null", "1min", "null");
    this.verifyConfig(lib, sys.Map.__fromLiteral(["hisCollectInterval","kind"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), "hr"),"Bool"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), "1hr (1hr, 0min, 0sec)", "null", "1sec", "null");
    this.verifyConfig(lib, sys.Map.__fromLiteral(["hisCollectInterval","kind","hisCollectWriteFreq"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable()), "sec"),"Str",haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable()), "min")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), "10sec (0hr, 0min, 10sec)", "null", "1sec", "10min");
    this.verifyConfig(lib, sys.Map.__fromLiteral(["hisCollectCov","kind"], [haystack.HaystackTest.m(),"Bool"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), "null (0hr, 0min, 0sec)", "marker", "1sec", "null");
    this.verifyConfig(lib, sys.Map.__fromLiteral(["hisCollectCov","kind","hisCollectCovRateLimit"], [haystack.HaystackTest.m(),"Bool",haystack.HaystackTest.n(sys.ObjUtil.coerce(5, sys.Num.type$.toNullable()), "sec")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), "null (0hr, 0min, 0sec)", "marker", "5sec", "null");
    this.verifyConfig(lib, sys.Map.__fromLiteral(["hisCollectCov","kind","hisCollectCovRateLimit","hisCollectWriteFreq"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), "kW"),"Number",haystack.HaystackTest.n(sys.ObjUtil.coerce(7, sys.Num.type$.toNullable()), "sec"),haystack.HaystackTest.n(sys.ObjUtil.coerce(15, sys.Num.type$.toNullable()), "min")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), "null (0hr, 0min, 0sec)", "1kW", "7sec", "15min");
    this.verifyConfig(lib, sys.Map.__fromLiteral(["hisCollectInterval","hisCollectCov","kind","hisCollectCovRateLimit"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable()), "sec"),haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), "kW"),"Number",haystack.HaystackTest.n(sys.ObjUtil.coerce(7, sys.Num.type$.toNullable()), "sec")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), "10sec (0hr, 0min, 10sec)", "1kW", "7sec", "null");
    this.verifyConfig(lib, sys.Map.__fromLiteral(["hisCollectInterval","hisCollectCov","kind"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(20, sys.Num.type$.toNullable()), "sec"),haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), "kW"),"Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), "20sec (0hr, 0min, 20sec)", "1kW", "2sec", "null");
    return;
  }

  verifyConfig(lib,ptTags,interval,cov,rateLimit,writeFreq) {
    const this$ = this;
    let pt = this.addRec(ptTags.dup().addAll(sys.Map.__fromLiteral(["dis","point","his","tz"], ["Point",haystack.HaystackTest.m(),haystack.HaystackTest.m(),"Chicago"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))));
    this.rt().sync();
    let str = sys.ObjUtil.toStr(this.eval(sys.Str.plus(sys.Str.plus("pointDetails(", pt.id().toCode()), ")")));
    let lines = sys.Str.splitLines(str);
    let findLine = (key) => {
      let line = lines.find((x) => {
        return sys.Str.startsWith(x, sys.Str.plus(key, ":"));
      });
      if (line == null) {
        this$.fail(key);
      }
      ;
      return sys.Str.trim(sys.Str.getRange(line, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(line, ":"), sys.Int.type$), 1), -1)));
    };
    this.verifyEq(sys.Func.call(findLine, "interval"), interval);
    this.verifyEq(sys.Func.call(findLine, "cov"), cov);
    this.verifyEq(sys.Func.call(findLine, "covRateLimit"), rateLimit);
    this.verifyEq(sys.Func.call(findLine, "writeFreq"), writeFreq);
    lib.hisCollectMgr().forceCheck();
    let watch = ((this$) => { let $_u89 = this$.rt().watch().list().first(); if ($_u89 != null) return $_u89; throw sys.Err.make("no watch!"); })(this);
    this.verifyEq(watch.dis(), "HisCollect");
    this.verifyEq(sys.ObjUtil.coerce(watch.list().contains(pt.id()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return;
  }

  static make() {
    const $self = new HisCollectTest();
    HisCollectTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

class WriteTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WriteTest.type$; }

  testWrites() {
    let lib = sys.ObjUtil.coerce(this.addLib("point"), PointLib.type$);
    lib.spi().sync();
    let pt = this.addRec(sys.Map.__fromLiteral(["dis","point","writable","kind"], ["P",haystack.HaystackTest.m(),haystack.HaystackTest.m(),"Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let ptId = pt.id().toCode();
    this.verifyWrite(lib, pt, null, 17, sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Int:sys::Obj?]")));
    this.eval(sys.Str.plus(sys.Str.plus("pointSetDef(", ptId), ", 170)"));
    this.verifyWrite(lib, pt, haystack.HaystackTest.n(sys.ObjUtil.coerce(170, sys.Num.type$.toNullable())), 17, sys.Map.__fromLiteral([sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(170, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", ptId), ", 140, 14, \"test-14\")"));
    this.verifyWrite(lib, pt, haystack.HaystackTest.n(sys.ObjUtil.coerce(140, sys.Num.type$.toNullable())), 14, sys.Map.__fromLiteral([sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(140, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(170, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.eval(sys.Str.plus(sys.Str.plus("pointOverride(", ptId), ", 88)"));
    this.verifyWrite(lib, pt, haystack.HaystackTest.n(sys.ObjUtil.coerce(88, sys.Num.type$.toNullable())), 8, sys.Map.__fromLiteral([sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(88, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(140, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(170, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.eval(sys.Str.plus(sys.Str.plus("pointOverride(", ptId), ", 80)"));
    this.verifyWrite(lib, pt, haystack.HaystackTest.n(sys.ObjUtil.coerce(80, sys.Num.type$.toNullable())), 8, sys.Map.__fromLiteral([sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(80, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(140, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(170, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    (pt = sys.ObjUtil.coerce(this.rt().db().commit(folio.Diff.make(this.rt().db().readById(pt.id()), sys.Map.__fromLiteral(["curTracksWrite"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")))).newRec(), haystack.Dict.type$));
    this.eval(sys.Str.plus(sys.Str.plus("pointEmergencyOverride(", ptId), ", 10)"));
    this.verifyWrite(lib, pt, haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable())), 1, sys.Map.__fromLiteral([sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(80, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(140, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(170, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.eval(sys.Str.plus(sys.Str.plus("pointEmergencyAuto(", ptId), ")"));
    this.verifyWrite(lib, pt, haystack.HaystackTest.n(sys.ObjUtil.coerce(80, sys.Num.type$.toNullable())), 8, sys.Map.__fromLiteral([sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(80, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(140, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(170, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.eval(sys.Str.plus(sys.Str.plus("pointAuto(", ptId), ")"));
    this.verifyWrite(lib, pt, haystack.HaystackTest.n(sys.ObjUtil.coerce(140, sys.Num.type$.toNullable())), 14, sys.Map.__fromLiteral([sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(140, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(170, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", ptId), ", null, 14, \"test-14\")"));
    this.verifyWrite(lib, pt, haystack.HaystackTest.n(sys.ObjUtil.coerce(170, sys.Num.type$.toNullable())), 17, sys.Map.__fromLiteral([sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(170, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.eval(sys.Str.plus(sys.Str.plus("pointSetDef(", ptId), ", null)"));
    this.verifyWrite(lib, pt, null, 17, sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Int:sys::Obj?]")));
    return;
  }

  verifyWrite(lib,pt,val,level,levels) {
    const this$ = this;
    this.rt().sync();
    (pt = sys.ObjUtil.coerce(this.rt().db().readById(pt.id()), haystack.Dict.type$));
    if (pt.missing("writeLevel")) {
      this.rt().db().sync();
      (pt = sys.ObjUtil.coerce(this.rt().db().readById(pt.id()), haystack.Dict.type$));
    }
    ;
    this.verifyEq(pt.get("writeVal"), val);
    this.verifyEq(pt.get("writeStatus"), null);
    this.verifyEq(pt.get("writeLevel"), haystack.Number.makeInt(level));
    if (pt.has("curTracksWrite")) {
      this.verifyEq(pt.get("curVal"), val);
      this.verifyEq(pt.get("curStatus"), "ok");
    }
    else {
      this.verifyEq(pt.get("curVal"), null);
      this.verifyEq(pt.get("curStatus"), null);
    }
    ;
    this.verifyEq(pt.get("write1"), levels.get(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())));
    this.verifyEq(pt.get("write8"), levels.get(sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable())));
    this.verifyEq(pt.get("writeDef"), levels.get(sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable())));
    let g = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("pointWriteArray(", pt.id().toCode()), ")")), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(g.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(17, sys.Obj.type$.toNullable()));
    g.each((row,i) => {
      let lvl = sys.Int.plus(i, 1);
      this$.verifyEq(row.trap("level", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(lvl, sys.Num.type$.toNullable())));
      this$.verifyEq(row.get("val"), levels.get(sys.ObjUtil.coerce(lvl, sys.Obj.type$.toNullable())));
      if (row.has("val")) {
        if ((sys.ObjUtil.equals(lvl, 1) || sys.ObjUtil.equals(lvl, 8) || sys.ObjUtil.equals(lvl, 17))) {
          this$.verifyEq(row.get("who"), this$.eval("context()->username"));
        }
        else {
          this$.verifyEq(row.get("who"), sys.Str.plus("test-", sys.ObjUtil.coerce(lvl, sys.Obj.type$.toNullable())));
        }
        ;
      }
      ;
      return;
    });
    this.verifyGridEq(g, this.rt().pointWrite().array(pt));
    return g;
  }

  testObservable() {
    const this$ = this;
    let lib = sys.ObjUtil.coerce(this.addLib("point"), PointLib.type$);
    let x = this.addRec(sys.Map.__fromLiteral(["dis","point","writable","kind"], ["X",haystack.HaystackTest.m(),haystack.HaystackTest.m(),"Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let y = this.addRec(sys.Map.__fromLiteral(["dis","point","writable","kind"], ["Y",haystack.HaystackTest.m(),haystack.HaystackTest.m(),"Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let obsA = TestObserver.make();
    let obsB = TestObserver.make();
    let obsX = TestObserver.make();
    let obsY = TestObserver.make();
    this.rt().obs().get("obsPointWrites").subscribe(obsA, haystack.Etc.makeDict(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?"))));
    this.rt().obs().get("obsPointWrites").subscribe(obsB, haystack.Etc.makeDict(sys.Map.__fromLiteral(["obsAllWrites"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker"))));
    this.rt().obs().get("obsPointWrites").subscribe(obsX, haystack.Etc.makeDict(sys.Map.__fromLiteral(["obsFilter"], ["dis==\"X\""], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.rt().obs().get("obsPointWrites").subscribe(obsY, haystack.Etc.makeDict(sys.Map.__fromLiteral(["obsFilter"], ["dis==\"Y\""], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    let reset = () => {
      this$.rt().sync();
      obsA.clear();
      obsB.clear();
      obsX.clear();
      obsY.clear();
      return;
    };
    try {
      this.verifyEq(sys.ObjUtil.coerce(this.rt().isSteadyState(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
      this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", x.id().toCode()), ", 987, 16, \"test-16\")"));
      this.verifyObs(obsA, x, null, -1, "");
      this.verifyObs(obsB, x, null, -1, "");
      this.verifyObs(obsX, x, null, -1, "");
      this.verifyObs(obsY, y, null, -1, "");
    }
    catch ($_u90) {
      $_u90 = sys.Err.make($_u90);
      if ($_u90 instanceof sys.TestErr) {
        let e = $_u90;
        ;
        if (this.rt().isSteadyState()) {
          sys.ObjUtil.echo("***WARN*** reached steady state before expected");
          return null;
        }
        ;
        throw e;
      }
      else {
        throw $_u90;
      }
    }
    ;
    while (!this.rt().isSteadyState()) {
      concurrent.Actor.sleep(sys.Duration.fromStr("10ms"));
    }
    ;
    this.rt().sync();
    lib.writeMgr().forceCheck();
    this.verifyObs(obsX, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(987, sys.Num.type$.toNullable())), 16, "first");
    this.verifyObs(obsY, y, null, 17, "first");
    sys.Func.call(reset);
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", x.id().toCode()), ", 123, 16, \"test-16\")"));
    this.verifyWrite(lib, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())), 16, sys.Map.__fromLiteral([sys.ObjUtil.coerce(16, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.verifyObs(obsA, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())), 16, "test-16");
    this.verifyObs(obsB, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())), 16, "test-16");
    this.verifyObs(obsX, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())), 16, "test-16");
    this.verifyObs(obsY, y, null, -1, "");
    sys.Func.call(reset);
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", x.id().toCode()), ", 456, 14, \"test-14\")"));
    this.verifyWrite(lib, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(456, sys.Num.type$.toNullable())), 14, sys.Map.__fromLiteral([sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(16, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(456, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.verifyObs(obsA, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(456, sys.Num.type$.toNullable())), 14, "test-14");
    this.verifyObs(obsB, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(456, sys.Num.type$.toNullable())), 14, "test-14");
    this.verifyObs(obsX, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(456, sys.Num.type$.toNullable())), 14, "test-14");
    this.verifyObs(obsY, y, null, -1, "");
    sys.Func.call(reset);
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", x.id().toCode()), ", 789, 14, \"test-14\")"));
    this.verifyWrite(lib, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())), 14, sys.Map.__fromLiteral([sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(16, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.verifyObs(obsA, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())), 14, "test-14");
    this.verifyObs(obsB, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())), 14, "test-14");
    this.verifyObs(obsX, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())), 14, "test-14");
    this.verifyObs(obsY, y, null, -1, "");
    sys.Func.call(reset);
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", x.id().toCode()), ", 789, 14, \"test-14\")"));
    this.verifyWrite(lib, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())), 14, sys.Map.__fromLiteral([sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(16, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.verifyObs(obsA, x, null, -1, "");
    this.verifyObs(obsB, x, null, -1, "");
    this.verifyObs(obsX, x, null, -1, "");
    this.verifyObs(obsY, y, null, -1, "");
    sys.Func.call(reset);
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", x.id().toCode()), ", 69, 13, \"test-13\")"));
    this.verifyWrite(lib, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(69, sys.Num.type$.toNullable())), 13, sys.Map.__fromLiteral([sys.ObjUtil.coerce(13, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(16, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(69, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.verifyObs(obsA, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(69, sys.Num.type$.toNullable())), 13, "test-13");
    this.verifyObs(obsB, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(69, sys.Num.type$.toNullable())), 13, "test-13");
    this.verifyObs(obsX, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(69, sys.Num.type$.toNullable())), 13, "test-13");
    this.verifyObs(obsY, y, null, -1, "");
    sys.Func.call(reset);
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", x.id().toCode()), ", null, 13, \"test-13\")"));
    this.verifyWrite(lib, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())), 14, sys.Map.__fromLiteral([sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(16, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.verifyObs(obsA, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())), 14, "test-13");
    this.verifyObs(obsB, x, null, 13, "test-13");
    this.verifyObs(obsX, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())), 14, "test-13");
    this.verifyObs(obsY, y, null, -1, "");
    sys.Func.call(reset);
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", x.id().toCode()), ", 150, 15, \"test-15\")"));
    this.verifyWrite(lib, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())), 14, sys.Map.__fromLiteral([sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(15, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(16, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(150, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.verifyObs(obsA, x, null, -1, "");
    this.verifyObs(obsB, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(150, sys.Num.type$.toNullable())), 15, "test-15");
    this.verifyObs(obsX, x, null, -1, "");
    this.verifyObs(obsY, y, null, -1, "");
    sys.Func.call(reset);
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", x.id().toCode()), ", null, 15, \"test-15\")"));
    this.verifyWrite(lib, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())), 14, sys.Map.__fromLiteral([sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(16, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.verifyObs(obsA, x, null, -1, "");
    this.verifyObs(obsB, x, null, 15, "test-15");
    this.verifyObs(obsX, x, null, -1, "");
    this.verifyObs(obsY, y, null, -1, "");
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", x.id().toCode()), ", null, 16, \"test-16\")"));
    this.verifyWrite(lib, x, haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable())), 14, sys.Map.__fromLiteral([sys.ObjUtil.coerce(14, sys.Obj.type$.toNullable())], [haystack.HaystackTest.n(sys.ObjUtil.coerce(789, sys.Num.type$.toNullable()))], sys.Type.find("sys::Int"), sys.Type.find("haystack::Number?")));
    this.verifyObs(obsA, x, null, -1, "");
    this.verifyObs(obsB, x, null, 16, "test-16");
    this.verifyObs(obsX, x, null, -1, "");
    this.verifyObs(obsY, y, null, -1, "");
    this.eval(sys.Str.plus(sys.Str.plus("pointWrite(", x.id().toCode()), ", null, 14, \"test-14\")"));
    this.verifyWrite(lib, x, null, 17, sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Int:sys::Obj?]")));
    this.verifyObs(obsA, x, null, 17, "test-14");
    this.verifyObs(obsB, x, null, 14, "test-14");
    this.verifyObs(obsX, x, null, 17, "test-14");
    this.verifyObs(obsY, y, null, -1, "");
    return;
  }

  verifyObs($obs,pt,val,level,who) {
    let e = sys.ObjUtil.as($obs.sync(), haystack.Dict.type$);
    if (sys.ObjUtil.equals(level, -1)) {
      this.verifyNull(e, null);
      return;
    }
    else {
      if (e == null) {
        this.fail("no event received");
      }
      ;
    }
    ;
    this.verifyEq(e.trap("type", sys.List.make(sys.Obj.type$.toNullable(), [])), "obsPointWrites");
    this.verifyEq(e.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])), pt.id());
    this.verifyDictEq(sys.ObjUtil.coerce(e.trap("rec", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Dict.type$), pt);
    this.verifyEq(e.get("val"), val);
    this.verifyEq(e.trap("level", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(level, sys.Num.type$.toNullable())));
    this.verifyEq(e.trap("who", sys.List.make(sys.Obj.type$.toNullable(), [])), who);
    if (sys.ObjUtil.equals(who, "first")) {
      this.verifyEq(e.trap("first", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.m());
      this.verifyEq(sys.ObjUtil.coerce(e.has("first"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    }
    else {
      this.verifyEq(e.get("first"), null);
      this.verifyEq(sys.ObjUtil.coerce(e.has("first"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    }
    ;
    return;
  }

  static make() {
    const $self = new WriteTest();
    WriteTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

class TestObserver extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#msgsRef = concurrent.AtomicRef.make(sys.Obj.type$.emptyList());
    return;
  }

  typeof() { return TestObserver.type$; }

  toActorMsg() { return obs.Observer.prototype.toActorMsg.apply(this, arguments); }

  toSyncMsg() { return obs.Observer.prototype.toSyncMsg.apply(this, arguments); }

  #msgsRef = null;

  msgsRef() { return this.#msgsRef; }

  __msgsRef(it) { if (it === undefined) return this.#msgsRef; else this.#msgsRef = it; }

  static make() {
    const $self = new TestObserver();
    TestObserver.make$($self);
    return $self;
  }

  static make$($self) {
    concurrent.Actor.make$($self, concurrent.ActorPool.make());
    ;
    return;
  }

  meta() {
    return haystack.Etc.emptyDict();
  }

  actor() {
    return this;
  }

  receive(msg) {
    if (sys.ObjUtil.equals(msg, "_sync_")) {
      return this.msgs().last();
    }
    ;
    this.#msgsRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.msgs().dup().add(sys.ObjUtil.coerce(msg, sys.Obj.type$))), sys.Type.find("sys::Obj[]")));
    return null;
  }

  sync() {
    return this.send("_sync_").get();
  }

  msgs() {
    return sys.ObjUtil.coerce(this.#msgsRef.val(), sys.Type.find("sys::Obj[]"));
  }

  clear() {
    this.sync();
    this.#msgsRef.val(sys.Obj.type$.emptyList());
    return;
  }

}

class PointRecSetTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PointRecSetTest.type$; }

  testSets() {
    this.addLib("point");
    let siteA = this.addRec(sys.Map.__fromLiteral(["dis","site","geoCity"], ["Site A",haystack.HaystackTest.m(),"Richmond"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let siteB = this.addRec(sys.Map.__fromLiteral(["dis","site","geoCity"], ["Site B",haystack.HaystackTest.m(),"Norfolk"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let spAP = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","space","siteA"], ["Space AP",siteA.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let spAQ = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","space","siteA"], ["Space AQ",siteA.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let spBR = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","space","siteB"], ["Space BR",siteB.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let eqA1 = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","spaceRef","equip","siteA"], ["Eq A1",siteA.id(),spAP.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let eqA2 = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","spaceRef","equip","siteA"], ["Eq A2",siteA.id(),spAQ.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let eqB1 = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","spaceRef","equip","siteB"], ["Eq B1",siteB.id(),spBR.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let dvA1a = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","spaceRef","device","siteA"], ["Dv A1a",siteA.id(),spAP.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let dvA1b = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","spaceRef","device","siteA"], ["Dv A1b",siteA.id(),spAP.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let dvB1 = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","spaceRef","equipRef","device","siteB"], ["Dv B1",siteB.id(),spBR.id(),eqB1.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let ptAa = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","point"], ["Pt Aa",siteA.id(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let ptA1a = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","spaceRef","equipRef","deviceRef","point","siteA"], ["Pt A1a",siteA.id(),spAP.id(),eqA1.id(),dvA1a.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let ptA1b = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","spaceRef","equipRef","deviceRef","point","siteA"], ["Pt A1b",siteA.id(),spAP.id(),eqA1.id(),dvA1b.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let ptA2a = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","spaceRef","equipRef","point","siteA"], ["Pt A2a",siteA.id(),spAQ.id(),eqA2.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let ptB1a = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","spaceRef","equipRef","point","siteB"], ["Pt B1a",siteB.id(),spBR.id(),eqB1.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let ptB1b = this.addRec(sys.Map.__fromLiteral(["dis","siteRef","spaceRef","equipRef","deviceRef","point","siteB"], ["Pt B1b",siteB.id(),spBR.id(),eqB1.id(),dvB1.id(),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.verifyToSet("readAll(ext).toSites", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict?[]")));
    this.verifyToSet("readAll(site).toSites", sys.List.make(haystack.Dict.type$, [siteA, siteB]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readById(", siteB.id().toCode()), ").toSites"), sys.List.make(haystack.Dict.type$, [siteB]));
    this.verifyToSet("readAll(dis).toSites", sys.List.make(haystack.Dict.type$, [siteA, siteB]));
    this.verifyToSet("readAll(equip).toSites", sys.List.make(haystack.Dict.type$, [siteA, siteB]));
    this.verifyToSet("read(equip and siteB).toSites", sys.List.make(haystack.Dict.type$, [siteB]));
    this.verifyToSet("readAll(point).toSites", sys.List.make(haystack.Dict.type$, [siteA, siteB]));
    this.verifyToSet("readAll(point).toSites", sys.List.make(haystack.Dict.type$, [siteA, siteB]));
    this.verifyToSet("readAll(point and siteA).toSites", sys.List.make(haystack.Dict.type$, [siteA]));
    this.verifyToSet("readAll(point and siteB).toSites", sys.List.make(haystack.Dict.type$, [siteB]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[@", siteA.id()), ", @"), eqA1.id()), "].toSites"), sys.List.make(haystack.Dict.type$, [siteA]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[@", siteA.id()), ", @"), ptB1b.id()), "].toSites"), sys.List.make(haystack.Dict.type$, [siteA, siteB]));
    this.verifyToSet("toSpaces(null)", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict?[]")));
    this.verifyToSet("readAll(ext).toSpaces", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict?[]")));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readById(", spAP.id().toCode()), ").toSpaces"), sys.List.make(haystack.Dict.type$, [spAP]));
    this.verifyToSet("readAll(dis).toSpaces", sys.List.make(haystack.Dict.type$, [spAP, spAQ, spBR]));
    this.verifyToSet("readAll(site).toSpaces", sys.List.make(haystack.Dict.type$, [spAP, spAQ, spBR]));
    this.verifyToSet("readAll(space).toSpaces", sys.List.make(haystack.Dict.type$, [spAP, spAQ, spBR]));
    this.verifyToSet("readAll(equip).toSpaces", sys.List.make(haystack.Dict.type$, [spAP, spAQ, spBR]));
    this.verifyToSet("readAll(point).toSpaces", sys.List.make(haystack.Dict.type$, [spAP, spAQ, spBR]));
    this.verifyToSet("readAll(point and siteA).toSpaces", sys.List.make(haystack.Dict.type$, [spAP, spAQ]));
    this.verifyToSet("readAll(point and siteB).toSpaces", sys.List.make(haystack.Dict.type$, [spBR]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readAll(id==", siteA.id().toCode()), ").toSpaces"), sys.List.make(haystack.Dict.type$, [spAP, spAQ]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readById(", siteB.id().toCode()), ").toSpaces"), sys.List.make(haystack.Dict.type$, [spBR]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[@", spAQ.id()), ", @"), siteB.id()), "].toSpaces"), sys.List.make(haystack.Dict.type$, [spAQ, spBR]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[@", eqA2.id()), ", @"), siteB.id()), "].toSpaces"), sys.List.make(haystack.Dict.type$, [spAQ, spBR]));
    this.verifyToSet("readAll(ext).toEquips", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict?[]")));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readById(", eqA2.id().toCode()), ").toEquips"), sys.List.make(haystack.Dict.type$, [eqA2]));
    this.verifyToSet("readAll(equip).toEquips", sys.List.make(haystack.Dict.type$, [eqA1, eqA2, eqB1]));
    this.verifyToSet("readAll(dis).toEquips", sys.List.make(haystack.Dict.type$, [eqA1, eqA2, eqB1]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readAll(equip and siteRef==", siteA.id().toCode()), ").toEquips"), sys.List.make(haystack.Dict.type$, [eqA1, eqA2]));
    this.verifyToSet("readAll(point).toEquips", sys.List.make(haystack.Dict.type$, [eqA1, eqA2, eqB1]));
    this.verifyToSet("readAll(point and siteA).toEquips", sys.List.make(haystack.Dict.type$, [eqA1, eqA2]));
    this.verifyToSet("readAll(point and siteB).toEquips", sys.List.make(haystack.Dict.type$, [eqB1]));
    this.verifyToSet("readAll(site).toEquips", sys.List.make(haystack.Dict.type$, [eqA1, eqA2, eqB1]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readAll(id==", siteA.id().toCode()), ").toEquips"), sys.List.make(haystack.Dict.type$, [eqA1, eqA2]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readById(", siteB.id().toCode()), ").toEquips"), sys.List.make(haystack.Dict.type$, [eqB1]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("[@", spAQ.id()), "].toEquips"), sys.List.make(haystack.Dict.type$, [eqA2]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[@", spAP.id()), ", @"), eqB1.id()), "].toEquips"), sys.List.make(haystack.Dict.type$, [eqA1, eqB1]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("[@", ptB1b.id()), "].toEquips"), sys.List.make(haystack.Dict.type$, [eqB1]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[@", ptB1b.id()), ", @"), spBR.id()), "].toEquips"), sys.List.make(haystack.Dict.type$, [eqB1]));
    this.verifyToSet("readAll(ext).toDevices", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict?[]")));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readById(", ptA1b.id().toCode()), ").toDevices"), sys.List.make(haystack.Dict.type$, [dvA1b]));
    this.verifyToSet("readAll(point).toDevices", sys.List.make(haystack.Dict.type$, [dvA1a, dvA1b, dvB1]));
    this.verifyToSet("readAll(dis).toDevices", sys.List.make(haystack.Dict.type$, [dvA1a, dvA1b, dvB1]));
    this.verifyToSet("readAll(point and siteB).toDevices", sys.List.make(haystack.Dict.type$, [dvB1]));
    this.verifyToSet("readAll(site).toDevices", sys.List.make(haystack.Dict.type$, [dvA1a, dvA1b, dvB1]));
    this.verifyToSet("readAll(space).toDevices", sys.List.make(haystack.Dict.type$, [dvA1a, dvA1b, dvB1]));
    this.verifyToSet("readAll(device and siteB).toDevices", sys.List.make(haystack.Dict.type$, [dvB1]));
    this.verifyToSet("readAll(device and siteB).toDevices", sys.List.make(haystack.Dict.type$, [dvB1]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readAll(id==", siteA.id().toCode()), ").toDevices"), sys.List.make(haystack.Dict.type$, [dvA1a, dvA1b]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("(@", spAP.id()), ").toDevices"), sys.List.make(haystack.Dict.type$, [dvA1a, dvA1b]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("(@", spAQ.id()), ").toDevices"), sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict?[]")));
    this.verifyToSet(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[@", spAP.id()), ", @"), siteB.id()), "].toDevices"), sys.List.make(haystack.Dict.type$, [dvA1a, dvA1b, dvB1]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[@", ptA1a.id()), ", @"), dvB1.id()), "].toDevices"), sys.List.make(haystack.Dict.type$, [dvA1a, dvB1]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readById(", eqA1.id().toCode()), ").toPoints"), sys.List.make(haystack.Dict.type$, [ptA1a, ptA1b]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readById(", eqA1.id().toCode()), ").equipToPoints"), sys.List.make(haystack.Dict.type$, [ptA1a, ptA1b]));
    this.verifyToSet("readAll(ext).toPoints", sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("haystack::Dict?[]")));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readById(", ptA2a.id().toCode()), ").toPoints"), sys.List.make(haystack.Dict.type$, [ptA2a]));
    this.verifyToSet("readAll(point).toPoints", sys.List.make(haystack.Dict.type$, [ptAa, ptA1a, ptA1b, ptA2a, ptB1a, ptB1b]));
    this.verifyToSet("readAll(dis).toPoints", sys.List.make(haystack.Dict.type$, [ptAa, ptA1a, ptA1b, ptA2a, ptB1a, ptB1b]));
    this.verifyToSet("readAll(point and siteB).toPoints", sys.List.make(haystack.Dict.type$, [ptB1a, ptB1b]));
    this.verifyToSet("readAll(site).toPoints", sys.List.make(haystack.Dict.type$, [ptAa, ptA1a, ptA1b, ptA2a, ptB1a, ptB1b]));
    this.verifyToSet("readAll(space).toPoints", sys.List.make(haystack.Dict.type$, [ptA1a, ptA1b, ptA2a, ptB1a, ptB1b]));
    this.verifyToSet("readAll(equip).toPoints", sys.List.make(haystack.Dict.type$, [ptA1a, ptA1b, ptA2a, ptB1a, ptB1b]));
    this.verifyToSet("readAll(device).toPoints", sys.List.make(haystack.Dict.type$, [ptA1a, ptA1b, ptB1b]));
    this.verifyToSet("readAll(equip and siteA).toPoints", sys.List.make(haystack.Dict.type$, [ptA1a, ptA1b, ptA2a]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readAll(id==", siteA.id().toCode()), ").toPoints"), sys.List.make(haystack.Dict.type$, [ptAa, ptA1a, ptA1b, ptA2a]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("readById(", siteB.id().toCode()), ").toPoints"), sys.List.make(haystack.Dict.type$, [ptB1a, ptB1b]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("(@", spAQ.id()), ").toPoints"), sys.List.make(haystack.Dict.type$, [ptA2a]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[@", spAQ.id()), ", @"), siteB.id()), "].toPoints"), sys.List.make(haystack.Dict.type$, [ptA2a, ptB1a, ptB1b]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[@", ptB1b.id()), ", @"), spBR.id()), "].toPoints"), sys.List.make(haystack.Dict.type$, [ptB1a, ptB1b]));
    this.verifyToSet(sys.Str.plus(sys.Str.plus("[@", dvA1a.id()), "].toPoints"), sys.List.make(haystack.Dict.type$, [ptA1a]));
    return;
  }

  verifyToSet($axon,recs) {
    const this$ = this;
    let grid = sys.ObjUtil.coerce(this.eval($axon), haystack.Grid.type$);
    this.verifyRecIds(grid, sys.ObjUtil.coerce(recs.map((rec) => {
      return rec.id();
    }, haystack.Ref.type$.toNullable()), sys.Type.find("haystack::Ref[]")));
    return;
  }

  testToOccupied() {
    this.addLib("point");
    let s = this.addRec(sys.Map.__fromLiteral(["dis","site"], ["S",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let fA = this.addRec(sys.Map.__fromLiteral(["dis","space","siteRef"], ["Floor-A",haystack.HaystackTest.m(),s.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let fB = this.addRec(sys.Map.__fromLiteral(["dis","space","siteRef"], ["Floor-B",haystack.HaystackTest.m(),s.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let rB = this.addRec(sys.Map.__fromLiteral(["dis","space","siteRef","spaceRef"], ["Room-B",haystack.HaystackTest.m(),s.id(),fB.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.verifytoOccupied(s, null);
    let eA = this.addRec(sys.Map.__fromLiteral(["dis","equip","siteRef","spaceRef"], ["EA",haystack.HaystackTest.m(),s.id(),fA.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let pA = this.addRec(sys.Map.__fromLiteral(["dis","point","siteRef","spaceRef","equipRef"], ["P-EA",haystack.HaystackTest.m(),s.id(),fA.id(),eA.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let occA = this.addRec(sys.Map.__fromLiteral(["dis","occupied","point","siteRef","equipRef"], ["Occ-A",haystack.HaystackTest.m(),haystack.HaystackTest.m(),s.id(),eA.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let eAx = this.addRec(sys.Map.__fromLiteral(["dis","equip","siteRef","spaceRef","equipRef"], ["EAx",haystack.HaystackTest.m(),s.id(),fA.id(),eA.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let pAx = this.addRec(sys.Map.__fromLiteral(["dis","point","siteRef","spaceRef","equipRef"], ["P-EAx",haystack.HaystackTest.m(),s.id(),fA.id(),eAx.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let eAxy = this.addRec(sys.Map.__fromLiteral(["dis","equip","siteRef","spaceRef","equipRef"], ["EAxy",haystack.HaystackTest.m(),s.id(),fA.id(),eAx.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let pAxy = this.addRec(sys.Map.__fromLiteral(["dis","point","siteRef","spaceRef","equipRef"], ["P-EAxy",haystack.HaystackTest.m(),s.id(),fA.id(),eAxy.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let eB = this.addRec(sys.Map.__fromLiteral(["dis","equip","siteRef","spaceRef"], ["EB",haystack.HaystackTest.m(),s.id(),rB.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let pB = this.addRec(sys.Map.__fromLiteral(["dis","point","siteRef","equipRef","spaceRef"], ["P-EB",haystack.HaystackTest.m(),s.id(),eB.id(),rB.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let eS = this.addRec(sys.Map.__fromLiteral(["dis","equip","siteRef"], ["ES",haystack.HaystackTest.m(),s.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let occS = this.addRec(sys.Map.__fromLiteral(["dis","occupied","point","siteRef","equipRef"], ["Occ-S",haystack.HaystackTest.m(),haystack.HaystackTest.m(),s.id(),eS.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.verifytoOccupied(s, null);
    (occS = sys.ObjUtil.coerce(this.commit(occS, sys.Map.__fromLiteral(["sitePoint"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker"))), haystack.Dict.type$));
    this.rt().sync();
    this.verifytoOccupied(s, occS);
    this.verifytoOccupied(eA, occA);
    this.verifytoOccupied(pA, occA);
    this.verifytoOccupied(eAx, occA);
    this.verifytoOccupied(pAx, occA);
    this.verifytoOccupied(eAxy, occA);
    this.verifytoOccupied(pAxy, occA);
    let occAx = this.addRec(sys.Map.__fromLiteral(["dis","occupied","point","siteRef","equipRef"], ["Occ-Ax",haystack.HaystackTest.m(),haystack.HaystackTest.m(),s.id(),eAx.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.verifytoOccupied(eA, occA);
    this.verifytoOccupied(pA, occA);
    this.verifytoOccupied(eAx, occAx);
    this.verifytoOccupied(pAx, occAx);
    this.verifytoOccupied(eAxy, occAx);
    this.verifytoOccupied(pAxy, occAx);
    let occAxy = this.addRec(sys.Map.__fromLiteral(["dis","occupied","point","siteRef","equipRef"], ["Occ-Axy",haystack.HaystackTest.m(),haystack.HaystackTest.m(),s.id(),eAxy.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.verifytoOccupied(eA, occA);
    this.verifytoOccupied(pA, occA);
    this.verifytoOccupied(eAx, occAx);
    this.verifytoOccupied(pAx, occAx);
    this.verifytoOccupied(eAxy, occAxy);
    this.verifytoOccupied(pAxy, occAxy);
    this.verifytoOccupied(fA, occS);
    this.verifytoOccupied(fB, occS);
    this.verifytoOccupied(rB, occS);
    this.verifytoOccupied(eB, occS);
    this.verifytoOccupied(pB, occS);
    let occFa = this.addRec(sys.Map.__fromLiteral(["dis","occupied","point","siteRef","spaceRef"], ["Occ-FA",haystack.HaystackTest.m(),haystack.HaystackTest.m(),s.id(),fA.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let occFb = this.addRec(sys.Map.__fromLiteral(["dis","occupied","point","siteRef","spaceRef"], ["Occ-FB",haystack.HaystackTest.m(),haystack.HaystackTest.m(),s.id(),fB.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.verifytoOccupied(fA, occFa);
    this.verifytoOccupied(fB, occFb);
    this.verifytoOccupied(rB, occFb);
    this.verifytoOccupied(eB, occFb);
    this.verifytoOccupied(pB, occFb);
    let occRb = this.addRec(sys.Map.__fromLiteral(["dis","occupied","point","siteRef","spaceRef"], ["Occ-FB",haystack.HaystackTest.m(),haystack.HaystackTest.m(),s.id(),rB.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.verifytoOccupied(fA, occFa);
    this.verifytoOccupied(fB, occFb);
    this.verifytoOccupied(rB, occRb);
    this.verifytoOccupied(eB, occRb);
    this.verifytoOccupied(pB, occRb);
    this.commit(occA, null, folio.Diff.remove());
    this.verifytoOccupied(eA, occFa);
    this.verifytoOccupied(pA, occFa);
    this.verifytoOccupied(eAx, occAx);
    this.verifytoOccupied(pAx, occAx);
    this.verifytoOccupied(eAxy, occAxy);
    this.verifytoOccupied(pAxy, occAxy);
    return;
  }

  verifytoOccupied(r,expected) {
    const this$ = this;
    if (expected != null) {
      (expected = this.readById(expected.id()));
      this.verifySame(this.eval(sys.Str.plus(sys.Str.plus("toOccupied(", r.id().toCode()), ")->id")), expected.id());
      this.verifySame(this.eval(sys.Str.plus(sys.Str.plus("readById(", r.id().toCode()), ").toOccupied->id")), expected.id());
    }
    else {
      this.verifyNull(this.eval(sys.Str.plus(sys.Str.plus("toOccupied(", r.id().toCode()), ", false)")));
      this.verifyErr(axon.EvalErr.type$, (it) => {
        this$.eval(sys.Str.plus(sys.Str.plus("toOccupied(", r.id().toCode()), ")"));
        return;
      });
      this.verifyErr(axon.EvalErr.type$, (it) => {
        this$.eval(sys.Str.plus(sys.Str.plus("toOccupied(", r.id().toCode()), ", true)"));
        return;
      });
    }
    ;
    return;
  }

  testMatchPointVal() {
    this.addLib("point");
    this.verifyMatchPointVal("(true, true)", true);
    this.verifyMatchPointVal("(true, false)", false);
    this.verifyMatchPointVal("(false, false)", true);
    this.verifyMatchPointVal("(false, true)", false);
    this.verifyMatchPointVal("(0,    false)", true);
    this.verifyMatchPointVal("(0.0,  false)", true);
    this.verifyMatchPointVal("(0,    true)", false);
    this.verifyMatchPointVal("(0.0,  true)", false);
    this.verifyMatchPointVal("(44,   false)", false);
    this.verifyMatchPointVal("(44.0, false)", false);
    this.verifyMatchPointVal("(44,   true)", true);
    this.verifyMatchPointVal("(44.0, true)", true);
    this.verifyMatchPointVal("(-1,    0..10)", false);
    this.verifyMatchPointVal("(0,     0..10)", true);
    this.verifyMatchPointVal("(4,     0..10)", true);
    this.verifyMatchPointVal("(4,     0.0 .. 10.0)", true);
    this.verifyMatchPointVal("(4.0,   0..10)", true);
    this.verifyMatchPointVal("(10,    0..10)", true);
    this.verifyMatchPointVal("(11,    0..10)", false);
    this.verifyMatchPointVal("(11.0,  0..10)", false);
    this.verifyMatchPointVal("(true,  0..10)", false);
    this.verifyMatchPointVal("(88,    2009-10)", false);
    this.verifyMatchPointVal("(30) x => x.isEven", true);
    this.verifyMatchPointVal("(31) x => x.isEven", false);
    this.verifyMatchPointVal("(29.9,  30..100)", false);
    this.verifyMatchPointVal("(30.2,  30..100)", true);
    this.verifyMatchPointVal("(100.2, 30..100)", true);
    this.verifyMatchPointVal("(101,   30..100)", false);
    return;
  }

  verifyMatchPointVal(params,expected) {
    this.verifyEq(this.eval(sys.Str.plus("matchPointVal", params)), sys.ObjUtil.coerce(expected, sys.Obj.type$.toNullable()));
    return;
  }

  static make() {
    const $self = new PointRecSetTest();
    PointRecSetTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxPoint');
const xp = sys.Param.noParams$();
let m;
PointMgrActor.type$ = p.at$('PointMgrActor','concurrent::Actor',[],{},130,PointMgrActor);
DemoMgrActor.type$ = p.at$('DemoMgrActor','hxPoint::PointMgrActor',[],{},130,DemoMgrActor);
PointMgr.type$ = p.at$('PointMgr','sys::Obj',[],{},129,PointMgr);
DemoMgr.type$ = p.at$('DemoMgr','hxPoint::PointMgr',[],{},128,DemoMgr);
PointLib.type$ = p.at$('PointLib','hx::HxLib',[],{},8194,PointLib);
PointRecSet.type$ = p.at$('PointRecSet','sys::Obj',[],{},128,PointRecSet);
EnumDefs.type$ = p.at$('EnumDefs','sys::Obj',[],{'sys::NoDoc':""},8194,EnumDefs);
EnumDef.type$ = p.at$('EnumDef','sys::Obj',[],{'sys::NoDoc':""},8194,EnumDef);
WriteMgrActor.type$ = p.at$('WriteMgrActor','hxPoint::PointMgrActor',['hx::HxPointWriteService'],{},130,WriteMgrActor);
WriteMgr.type$ = p.at$('WriteMgr','hxPoint::PointMgr',[],{},128,WriteMgr);
PointConvert.type$ = p.at$('PointConvert','sys::Obj',[],{'sys::NoDoc':""},8195,PointConvert);
ConvertParser.type$ = p.at$('ConvertParser','sys::Obj',[],{},128,ConvertParser);
PipelineConvert.type$ = p.at$('PipelineConvert','hxPoint::PointConvert',[],{},130,PipelineConvert);
MathConvert.type$ = p.at$('MathConvert','hxPoint::PointConvert',[],{},131,MathConvert);
AddConvert.type$ = p.at$('AddConvert','hxPoint::MathConvert',[],{},130,AddConvert);
SubConvert.type$ = p.at$('SubConvert','hxPoint::MathConvert',[],{},130,SubConvert);
MulConvert.type$ = p.at$('MulConvert','hxPoint::MathConvert',[],{},130,MulConvert);
DivConvert.type$ = p.at$('DivConvert','hxPoint::MathConvert',[],{},130,DivConvert);
BitConvert.type$ = p.at$('BitConvert','hxPoint::PointConvert',[],{},131,BitConvert);
AndConvert.type$ = p.at$('AndConvert','hxPoint::BitConvert',[],{},130,AndConvert);
OrConvert.type$ = p.at$('OrConvert','hxPoint::BitConvert',[],{},130,OrConvert);
XorConvert.type$ = p.at$('XorConvert','hxPoint::BitConvert',[],{},130,XorConvert);
ShiftrConvert.type$ = p.at$('ShiftrConvert','hxPoint::BitConvert',[],{},130,ShiftrConvert);
ShiftlConvert.type$ = p.at$('ShiftlConvert','hxPoint::BitConvert',[],{},130,ShiftlConvert);
ElvisConvert.type$ = p.at$('ElvisConvert','hxPoint::PointConvert',[],{},130,ElvisConvert);
UnitConvert.type$ = p.at$('UnitConvert','hxPoint::PointConvert',[],{},130,UnitConvert);
ToStrConvert.type$ = p.at$('ToStrConvert','hxPoint::PointConvert',[],{},130,ToStrConvert);
AsConvert.type$ = p.at$('AsConvert','hxPoint::PointConvert',[],{},130,AsConvert);
InvertConvert.type$ = p.at$('InvertConvert','hxPoint::PointConvert',[],{},130,InvertConvert);
PowConvert.type$ = p.at$('PowConvert','hxPoint::PointConvert',[],{},130,PowConvert);
MinConvert.type$ = p.at$('MinConvert','hxPoint::PointConvert',[],{},130,MinConvert);
MaxConvert.type$ = p.at$('MaxConvert','hxPoint::PointConvert',[],{},130,MaxConvert);
ResetConvert.type$ = p.at$('ResetConvert','hxPoint::PointConvert',[],{},130,ResetConvert);
U2SwapEndianConvert.type$ = p.at$('U2SwapEndianConvert','hxPoint::PointConvert',[],{},130,U2SwapEndianConvert);
U4SwapEndianConvert.type$ = p.at$('U4SwapEndianConvert','hxPoint::PointConvert',[],{},130,U4SwapEndianConvert);
EnumConvert.type$ = p.at$('EnumConvert','hxPoint::PointConvert',[],{},131,EnumConvert);
EnumStrToNumberConvert.type$ = p.at$('EnumStrToNumberConvert','hxPoint::EnumConvert',[],{},130,EnumStrToNumberConvert);
EnumNumberToStrConvert.type$ = p.at$('EnumNumberToStrConvert','hxPoint::EnumConvert',[],{},130,EnumNumberToStrConvert);
EnumStrToBoolConvert.type$ = p.at$('EnumStrToBoolConvert','hxPoint::EnumConvert',[],{},130,EnumStrToBoolConvert);
EnumBoolToStrConvert.type$ = p.at$('EnumBoolToStrConvert','hxPoint::EnumConvert',[],{},130,EnumBoolToStrConvert);
NumberToBoolConvert.type$ = p.at$('NumberToBoolConvert','hxPoint::PointConvert',[],{},130,NumberToBoolConvert);
NumberToStrConvert.type$ = p.at$('NumberToStrConvert','hxPoint::PointConvert',[],{},130,NumberToStrConvert);
BoolToNumberConvert.type$ = p.at$('BoolToNumberConvert','hxPoint::PointConvert',[],{},130,BoolToNumberConvert);
StrToBoolConvert.type$ = p.at$('StrToBoolConvert','hxPoint::PointConvert',[],{},130,StrToBoolConvert);
StrToNumberConvert.type$ = p.at$('StrToNumberConvert','hxPoint::PointConvert',[],{},130,StrToNumberConvert);
HexToNumberConvert.type$ = p.at$('HexToNumberConvert','hxPoint::PointConvert',[],{},130,HexToNumberConvert);
NumberToHexConvert.type$ = p.at$('NumberToHexConvert','hxPoint::PointConvert',[],{},130,NumberToHexConvert);
LowerConvert.type$ = p.at$('LowerConvert','hxPoint::PointConvert',[],{},130,LowerConvert);
UpperConvert.type$ = p.at$('UpperConvert','hxPoint::PointConvert',[],{},130,UpperConvert);
StrReplaceConvert.type$ = p.at$('StrReplaceConvert','hxPoint::PointConvert',[],{},130,StrReplaceConvert);
ThermistorConvert.type$ = p.at$('ThermistorConvert','hxPoint::PointConvert',[],{},130,ThermistorConvert);
ThermistorItem.type$ = p.at$('ThermistorItem','sys::Obj',[],{},130,ThermistorItem);
HisCollectMgrActor.type$ = p.at$('HisCollectMgrActor','hxPoint::PointMgrActor',[],{},130,HisCollectMgrActor);
HisCollectMgr.type$ = p.at$('HisCollectMgr','hxPoint::PointMgr',[],{},128,HisCollectMgr);
WriteRec.type$ = p.at$('WriteRec','sys::Obj',[],{},128,WriteRec);
WriteLevel.type$ = p.at$('WriteLevel','sys::Obj',[],{},128,WriteLevel);
PointFuncs.type$ = p.at$('PointFuncs','sys::Obj',[],{},8194,PointFuncs);
HisCollectRec.type$ = p.at$('HisCollectRec','sys::Obj',[],{'sys::NoDoc':""},128,HisCollectRec);
HisCollectItem.type$ = p.at$('HisCollectItem','sys::Obj',[],{},128,HisCollectItem);
HisCollectItemState.type$ = p.at$('HisCollectItemState','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,HisCollectItemState);
WriteObservable.type$ = p.at$('WriteObservable','obs::Observable',[],{},130,WriteObservable);
WriteSubscription.type$ = p.at$('WriteSubscription','obs::RecSubscription',[],{},130,WriteSubscription);
WriteObservation.type$ = p.at$('WriteObservation','sys::Obj',['obs::Observation'],{'sys::NoDoc':""},8194,WriteObservation);
PointUtil.type$ = p.at$('PointUtil','sys::Obj',[],{},8192,PointUtil);
RosterTest.type$ = p.at$('RosterTest','hx::HxTest',[],{},8192,RosterTest);
ConvertTest.type$ = p.at$('ConvertTest','hx::HxTest',[],{},8192,ConvertTest);
HisCollectTest.type$ = p.at$('HisCollectTest','hx::HxTest',[],{},8192,HisCollectTest);
WriteTest.type$ = p.at$('WriteTest','hx::HxTest',[],{},8192,WriteTest);
TestObserver.type$ = p.at$('TestObserver','concurrent::Actor',['obs::Observer'],{},130,TestObserver);
PointRecSetTest.type$ = p.at$('PointRecSetTest','hx::HxTest',[],{},8192,PointRecSetTest);
PointMgrActor.type$.af$('lib',73730,'hxPoint::PointLib',{}).af$('checkFreq',73730,'sys::Duration',{}).af$('mgrType',73730,'sys::Type',{}).af$('log',73730,'sys::Log',{}).af$('isRunningRef',67586,'concurrent::AtomicBool',{}).af$('checkMsg',100354,'hx::HxMsg',{}).af$('timeout',98434,'sys::Duration',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('checkFreq','sys::Duration',false),new sys.Param('mgrType','sys::Type',false)]),{}).am$('isRunning',8192,'sys::Bool',xp,{}).am$('start',8192,'sys::Void',xp,{}).am$('stop',8192,'sys::Void',xp,{}).am$('obs',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation',false)]),{}).am$('details',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('sync',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('forceCheck',8192,'sys::Void',xp,{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DemoMgrActor.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false)]),{});
PointMgr.type$.af$('lib',73730,'hxPoint::PointLib',{}).af$('rt',73730,'hx::HxRuntime',{}).af$('log',73730,'sys::Log',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false)]),{}).am$('onCheck',270337,'sys::Void',xp,{}).am$('onForceCheck',270336,'sys::Obj?',xp,{}).am$('onDetails',270336,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('onObs',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation',false)]),{}).am$('onReceive',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{});
DemoMgr.type$.af$('db',73730,'folio::Folio',{}).af$('cycle',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false)]),{}).am$('onCheck',271360,'sys::Void',xp,{}).am$('checkNumber',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('toNumberRange',8192,'sys::Range',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('checkBool',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('checkStr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('updatePoint',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj',false)]),{});
PointLib.type$.af$('observables',336898,'obs::Observable[]',{}).af$('enums',65666,'hxPoint::EnumDefs',{}).af$('hisCollectMgr',65666,'hxPoint::HisCollectMgrActor',{}).af$('writeMgr',65666,'hxPoint::WriteMgrActor',{}).af$('demoMgr',65666,'hxPoint::DemoMgrActor',{}).am$('make',8196,'sys::Void',xp,{}).am$('services',271360,'hx::HxService[]',xp,{}).am$('hisCollectNA',8192,'sys::Bool',xp,{}).am$('onStart',271360,'sys::Void',xp,{}).am$('onStop',271360,'sys::Void',xp,{}).am$('onSteadyState',271360,'sys::Void',xp,{}).am$('onEnumMetaEvent',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation?',false)]),{}).am$('onPointEvent',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation?',false)]),{});
PointRecSet.type$.af$('recs',67584,'haystack::Dict[]',{}).af$('cx',67584,'hx::HxContext',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('recs','sys::Obj?',false),new sys.Param('cx','hx::HxContext',true)]),{}).am$('toSites',8192,'haystack::Grid',xp,{}).am$('toSpaces',8192,'haystack::Grid',xp,{}).am$('toEquips',8192,'haystack::Grid',xp,{}).am$('toDevices',8192,'haystack::Grid',xp,{}).am$('toPoints',8192,'haystack::Grid',xp,{}).am$('map',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('markerTag','sys::Str',false),new sys.Param('refTag','sys::Str',false)]),{}).am$('mapRec',2048,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('markerTag','sys::Str',false),new sys.Param('refTag','sys::Str',false)]),{}).am$('children',2048,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('markerTag','sys::Str',false),new sys.Param('parentRef','sys::Str',false),new sys.Param('parentId','haystack::Ref',false)]),{});
EnumDefs.type$.af$('metaRef',67586,'concurrent::AtomicRef',{}).af$('byName',67586,'concurrent::AtomicRef',{}).am$('list',8192,'hxPoint::EnumDef[]',xp,{}).am$('get',8192,'hxPoint::EnumDef?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('meta',8192,'haystack::Dict',xp,{}).am$('updateMeta',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cur','haystack::Dict',false),new sys.Param('log','sys::Log',false)]),{'sys::NoDoc':""}).am$('toGrid',2048,'haystack::Grid?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
EnumDef.type$.af$('id',73730,'sys::Str',{}).af$('grid',73730,'haystack::Grid?',{}).af$('trueName',73730,'sys::Str?',{}).af$('falseName',73730,'sys::Str?',{}).af$('nameToCodeMap',67586,'[sys::Str:haystack::Number]',{}).af$('codeToNameMap',67586,'[haystack::Number:sys::Str]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('grid','haystack::Grid',false)]),{}).am$('makeEnumTag',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('enums','sys::Str',false)]),{}).am$('size',8192,'sys::Int',xp,{}).am$('nameToCode',8192,'haystack::Number?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('codeToName',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('code','haystack::Number',false),new sys.Param('checked','sys::Bool',true)]),{});
WriteMgrActor.type$.af$('observable',73730,'hxPoint::WriteObservable',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false)]),{}).am$('array',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('point','haystack::Dict',false)]),{}).am$('arrayById',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('write',271360,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('point','haystack::Dict',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','sys::Int',false),new sys.Param('who','sys::Obj',false),new sys.Param('opts','haystack::Dict?',true)]),{});
WriteMgr.type$.af$('needFirstFire',67584,'sys::Bool',{}).af$('points',67584,'[haystack::Ref:hxPoint::WriteRec]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false)]),{}).am$('onReceive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('onCheck',271360,'sys::Void',xp,{}).am$('get',2048,'hxPoint::WriteRec',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('onObs',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation',false)]),{}).am$('sink',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('writeRec','hxPoint::WriteRec',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','haystack::Number',false),new sys.Param('who','sys::Obj?',false)]),{}).am$('sinkChanges',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','haystack::Number',false)]),{}).am$('fireFirstObservations',2048,'sys::Void',xp,{}).am$('fireObservation',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('writeRec','hxPoint::WriteRec',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','haystack::Number',false),new sys.Param('who','sys::Obj?',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('effectiveChange','sys::Bool',false),new sys.Param('first','sys::Bool',false)]),{}).am$('onDetails',271360,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{});
PointConvert.type$.af$('cache',100354,'concurrent::ConcurrentMap',{}).am$('fromStr',40966,'hxPoint::PointConvert?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('convert',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ConvertParser.type$.af$('tokenSeps',100354,'sys::Str',{}).af$('eof',100354,'sys::Str',{}).af$('toks',67584,'sys::Str[]',{}).af$('cur',67584,'sys::Str',{}).af$('curi',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('parse',8192,'hxPoint::PointConvert',xp,{}).am$('parseExpr',2048,'hxPoint::PointConvert',xp,{}).am$('parseAdd',2048,'hxPoint::PointConvert',xp,{}).am$('parseSub',2048,'hxPoint::PointConvert',xp,{}).am$('parseMul',2048,'hxPoint::PointConvert',xp,{}).am$('parseDiv',2048,'hxPoint::PointConvert',xp,{}).am$('parseAnd',2048,'hxPoint::PointConvert',xp,{}).am$('parseOr',2048,'hxPoint::PointConvert',xp,{}).am$('parseXor',2048,'hxPoint::PointConvert',xp,{}).am$('parseShiftr',2048,'hxPoint::PointConvert',xp,{}).am$('parseShiftl',2048,'hxPoint::PointConvert',xp,{}).am$('parseElvis',2048,'hxPoint::PointConvert',xp,{}).am$('parseSubAtomic',2048,'hxPoint::PointConvert',xp,{}).am$('parseFuncOrUnit',2048,'hxPoint::PointConvert',xp,{}).am$('parseUnit',2048,'hxPoint::PointConvert',sys.List.make(sys.Param.type$,[new sys.Param('from','sys::Str',false)]),{}).am$('parseFunc',2048,'hxPoint::PointConvert',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('consumeLiteral',2048,'sys::Obj?',xp,{}).am$('consumeFloat',2048,'sys::Float',xp,{}).am$('consumeInt',2048,'sys::Int',xp,{}).am$('consume',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('expected','sys::Str?',false)]),{}).am$('tokenize',32898,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('main',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
PipelineConvert.type$.af$('pipeline',73730,'hxPoint::PointConvert[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','hxPoint::PointConvert[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
MathConvert.type$.af$('x',73730,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false)]),{}).am$('symbol',270337,'sys::Str',xp,{}).am$('doConvert',270337,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Float',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
AddConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false)]),{}).am$('symbol',271360,'sys::Str',xp,{}).am$('doConvert',271360,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Float',false)]),{});
SubConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false)]),{}).am$('symbol',271360,'sys::Str',xp,{}).am$('doConvert',271360,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Float',false)]),{});
MulConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false)]),{}).am$('symbol',271360,'sys::Str',xp,{}).am$('doConvert',271360,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Float',false)]),{});
DivConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Float',false)]),{}).am$('symbol',271360,'sys::Str',xp,{}).am$('doConvert',271360,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Float',false)]),{});
BitConvert.type$.af$('x',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false)]),{}).am$('symbol',270337,'sys::Str',xp,{}).am$('doConvert',270337,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
AndConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false)]),{}).am$('symbol',271360,'sys::Str',xp,{}).am$('doConvert',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{});
OrConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false)]),{}).am$('symbol',271360,'sys::Str',xp,{}).am$('doConvert',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{});
XorConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false)]),{}).am$('symbol',271360,'sys::Str',xp,{}).am$('doConvert',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{});
ShiftrConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false)]),{}).am$('symbol',271360,'sys::Str',xp,{}).am$('doConvert',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{});
ShiftlConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false)]),{}).am$('symbol',271360,'sys::Str',xp,{}).am$('doConvert',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Int',false)]),{});
ElvisConvert.type$.af$('x',73730,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('v','sys::Obj?',false)]),{});
UnitConvert.type$.af$('from',73730,'sys::Unit',{}).af$('to',73730,'sys::Unit',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('from','sys::Str',false),new sys.Param('to','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
ToStrConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
AsConvert.type$.af$('to',73730,'sys::Unit',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
InvertConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
PowConvert.type$.af$('exp',73730,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
MinConvert.type$.af$('limit',73730,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
MaxConvert.type$.af$('limit',73730,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
ResetConvert.type$.af$('inLo',73730,'sys::Float',{}).af$('inHi',73730,'sys::Float',{}).af$('outLo',73730,'sys::Float',{}).af$('outHi',73730,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
U2SwapEndianConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
U4SwapEndianConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
EnumConvert.type$.af$('enumId',73730,'sys::Str',{}).af$('checked',73730,'sys::Bool',{}).af$('toStr',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false),new sys.Param('funcName','sys::Str',false),new sys.Param('useChecked','sys::Bool',true)]),{}).am$('convert',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('doConvert',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('enum','hxPoint::EnumDef',false),new sys.Param('val','sys::Obj',false)]),{});
EnumStrToNumberConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('doConvert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('enum','hxPoint::EnumDef',false),new sys.Param('val','sys::Obj',false)]),{});
EnumNumberToStrConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('doConvert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('enum','hxPoint::EnumDef',false),new sys.Param('val','sys::Obj',false)]),{});
EnumStrToBoolConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('doConvert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('enum','hxPoint::EnumDef',false),new sys.Param('val','sys::Obj',false)]),{});
EnumBoolToStrConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('doConvert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('enum','hxPoint::EnumDef',false),new sys.Param('val','sys::Obj',false)]),{});
NumberToBoolConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
NumberToStrConvert.type$.af$('enum',73730,'sys::Str[]',{}).af$('toStr',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
BoolToNumberConvert.type$.af$('falseVal',73730,'haystack::Number',{}).af$('trueVal',73730,'haystack::Number',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
StrToBoolConvert.type$.af$('falseStrs',73730,'sys::Str[]',{}).af$('trueStrs',73730,'sys::Str[]',{}).af$('toStr',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('addToStr',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::StrBuf',false),new sys.Param('list','sys::Str[]',false)]),{}).am$('parseToks',40962,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
StrToNumberConvert.type$.af$('checked',73730,'sys::Bool',{}).af$('toStr',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
HexToNumberConvert.type$.af$('checked',73730,'sys::Bool',{}).af$('toStr',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
NumberToHexConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
LowerConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
UpperConvert.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
StrReplaceConvert.type$.af$('from',73730,'sys::Str',{}).af$('to',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{});
ThermistorConvert.type$.af$('name',73730,'sys::Str',{}).af$('items',73730,'hxPoint::ThermistorItem[]',{}).am$('listTables',40962,'sys::Str[]',xp,{}).am$('findTableFile',40962,'sys::File?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('convert',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('ohmsToDegF',8192,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('ohms','sys::Float',false)]),{});
ThermistorItem.type$.af$('ohms',73730,'sys::Float',{}).af$('degF',73730,'sys::Float',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ohms','sys::Float',false),new sys.Param('degF','sys::Float',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj',false)]),{});
HisCollectMgrActor.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false)]),{}).am$('writeAll',8192,'concurrent::Future',xp,{}).am$('reset',8192,'concurrent::Future',xp,{});
HisCollectMgr.type$.af$('points',67584,'[haystack::Ref:hxPoint::HisCollectRec]',{}).af$('refreshVer',67584,'sys::Int',{}).af$('refreshTicks',67584,'sys::Int',{}).af$('nextTopOfMin',67584,'sys::DateTime',{}).af$('watch',67584,'hx::HxWatch?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false)]),{}).am$('onReceive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('onObs',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation',false)]),{}).am$('add',2048,'hxPoint::HisCollectRec',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('remove',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('onCheck',271360,'sys::Void',xp,{}).am$('onDetails',271360,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('get',2048,'hxPoint::HisCollectRec',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('onWriteAll',2048,'sys::Obj?',xp,{}).am$('onReset',2048,'sys::Obj?',xp,{}).am$('openWatch',2048,'sys::Void',xp,{});
WriteRec.type$.af$('levelDis',106498,'sys::Str[]',{}).af$('levelNums',106498,'haystack::Number[]',{}).af$('id',73730,'haystack::Ref',{}).af$('rec',73728,'haystack::Dict',{}).af$('lastVal',73728,'sys::Obj?',{}).af$('lastLevel',73728,'haystack::Number?',{}).af$('levels',67584,'hxPoint::WriteLevel?[]',{}).af$('overrideExpire',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::WriteMgr',false),new sys.Param('id','haystack::Ref',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('init',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::Int',false),new sys.Param('tag','sys::Str',false)]),{}).am$('updateRec',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('check',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::WriteMgr',false),new sys.Param('now','sys::Duration',false)]),{}).am$('write',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::WriteMgr',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','sys::Int',false),new sys.Param('who','sys::Obj',false),new sys.Param('opts','haystack::Dict?',false)]),{}).am$('whoIsEqual',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{}).am$('persist',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::WriteMgr',false),new sys.Param('tag','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('update',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::WriteMgr',false)]),{}).am$('toDetails',8192,'sys::Str',xp,{}).am$('toGrid',8192,'haystack::Grid',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
WriteLevel.type$.af$('val',73728,'sys::Obj?',{}).af$('who',73728,'sys::Obj?',{}).am$('whoToStr',8192,'sys::Str?',xp,{}).am$('make',139268,'sys::Void',xp,{});
PointFuncs.type$.af$('timeout',98434,'sys::Duration',{}).af$('level1',98434,'haystack::Number',{}).af$('level8',98434,'haystack::Number',{}).af$('levelDef',98434,'haystack::Number',{}).am$('toSites',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('recs','sys::Obj?',false)]),{'axon::Axon':""}).am$('toSpaces',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('recs','sys::Obj?',false)]),{'axon::Axon':""}).am$('toEquips',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('recs','sys::Obj?',false)]),{'axon::Axon':""}).am$('toDevices',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('recs','sys::Obj?',false)]),{'axon::Axon':""}).am$('toPoints',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('recs','sys::Obj?',false)]),{'axon::Axon':""}).am$('toOccupied',40962,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('rec','sys::Obj?',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('equipToPoints',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('equip','sys::Obj',false)]),{'axon::Axon':"axon::Axon{meta=[\"overridable\":haystack::Marker(\"\")];}"}).am$('pointEmergencyOverride',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','sys::Obj',false),new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('pointEmergencyAuto',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('pointOverride',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','sys::Obj',false),new sys.Param('val','sys::Obj?',false),new sys.Param('duration','haystack::Number?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('pointAuto',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('pointSetDef',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','sys::Obj',false),new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('pointWrite',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','sys::Obj',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','haystack::Number?',false),new sys.Param('who','sys::Obj?',true),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('pointOverrideCommand',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','sys::Obj',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','haystack::Number',false),new sys.Param('duration','haystack::Number?',true)]),{'axon::Axon':""}).am$('pointWriteArray',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('point','sys::Obj',false)]),{'axon::Axon':""}).am$('pointConvert',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('pt','sys::Obj?',false),new sys.Param('convert','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':""}).am$('pointDetails',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('point','sys::Obj',false)]),{'axon::Axon':""}).am$('pointThermistorTables',40962,'haystack::Grid',xp,{'axon::Axon':""}).am$('enumDefs',40962,'haystack::Grid',xp,{'axon::Axon':""}).am$('enumDef',40962,'haystack::Grid?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('matchPointVal',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('match','sys::Obj?',false)]),{'axon::Axon':""}).am$('hisCollectWriteAll',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('timeout','haystack::Number?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('hisCollectReset',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('timeout','haystack::Number?',true)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('pointExtSync',40962,'sys::Obj?',xp,{'sys::Deprecated':"",'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('lib',34818,'hxPoint::PointLib',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
HisCollectRec.type$.af$('hisCollectIntervalMin',100354,'sys::Duration',{}).af$('hisCollectIntervalMax',100354,'sys::Duration',{}).af$('maxBufSize',100354,'sys::Int',{}).af$('statusInit',100354,'sys::Str',{}).af$('statusOk',100354,'sys::Str',{}).af$('statusFault',100354,'sys::Str',{}).af$('id',73730,'haystack::Ref',{}).af$('rec',67584,'haystack::Dict',{}).af$('status',67584,'sys::Str',{}).af$('err',67584,'sys::Str?',{}).af$('tz',67584,'sys::TimeZone',{}).af$('interval',67584,'sys::Duration?',{}).af$('intervalHours',67584,'sys::Int',{}).af$('intervalMinutes',67584,'sys::Int',{}).af$('intervalSecs',67584,'sys::Int',{}).af$('writeFreq',67584,'sys::Duration?',{}).af$('writeLast',67584,'sys::Int',{}).af$('writeErr',67584,'sys::Err?',{}).af$('cov',67584,'sys::Obj?',{}).af$('covRateLimit',67584,'sys::Duration',{}).af$('collectNA',67584,'sys::Bool',{}).af$('buf',67584,'hxUtil::CircularBuf',{}).af$('lastItem',67584,'hxPoint::HisCollectItem?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('onCheck',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::HisCollectMgr',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('now','sys::DateTime',false),new sys.Param('topOfMin','sys::Bool',false)]),{}).am$('isInterval',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('now','sys::DateTime',false),new sys.Param('topOfMin','sys::Bool',false)]),{}).am$('isCov',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('now','sys::DateTime',false),new sys.Param('curVal','sys::Obj?',false)]),{}).am$('throttleCov',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('now','sys::DateTime',false)]),{}).am$('bufFullOfPending',2048,'sys::Bool',xp,{}).am$('checkWrite',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::HisCollectMgr',false)]),{}).am$('writePending',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::HisCollectMgr',false)]),{}).am$('isHisCollect',8192,'sys::Bool',xp,{}).am$('onRefresh',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::HisCollectMgr',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('updateStatusOk',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::HisCollectMgr',false)]),{}).am$('updateStatusErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::HisCollectMgr',false),new sys.Param('err','sys::Str',false)]),{}).am$('commit',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPoint::HisCollectMgr',false),new sys.Param('changes','haystack::Dict',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('toDetails',8192,'sys::Str',xp,{}).am$('detailsErr',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err?',false)]),{}).am$('detailsDurToTs',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('dur','sys::Int',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
HisCollectItem.type$.af$('ts',73730,'sys::DateTime',{}).af$('curVal',73730,'sys::Obj?',{}).af$('curStatus',73730,'sys::Str?',{}).af$('written',73728,'hxPoint::HisCollectItemState',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false),new sys.Param('curVal','sys::Obj?',false),new sys.Param('curStatus','sys::Str?',false)]),{}).am$('writtenToStr',8192,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
HisCollectItemState.type$.af$('pending',106506,'hxPoint::HisCollectItemState',{}).af$('wroteVal',106506,'hxPoint::HisCollectItemState',{}).af$('wroteNA',106506,'hxPoint::HisCollectItemState',{}).af$('skipped',106506,'hxPoint::HisCollectItemState',{}).af$('vals',106498,'hxPoint::HisCollectItemState[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'hxPoint::HisCollectItemState?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
WriteObservable.type$.am$('name',271360,'sys::Str',xp,{}).am$('onSubscribe',271360,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('make',139268,'sys::Void',xp,{});
WriteSubscription.type$.af$('isAllWrites',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','hxPoint::WriteObservable',false),new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{});
WriteObservation.type$.af$('type',336898,'sys::Str',{}).af$('ts',336898,'sys::DateTime',{}).af$('id',336898,'haystack::Ref',{}).af$('rec',73730,'haystack::Dict',{}).af$('val',73730,'sys::Obj?',{}).af$('level',73730,'haystack::Number',{}).af$('who',73730,'sys::Obj',{}).af$('opts',73730,'haystack::Dict?',{}).af$('first',73730,'haystack::Marker?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','obs::Observable',false),new sys.Param('ts','sys::DateTime',false),new sys.Param('id','haystack::Ref',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','haystack::Number',false),new sys.Param('who','sys::Obj',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('first','sys::Bool',false)]),{}).am$('subType',271360,'sys::Str?',xp,{}).am$('isFirst',8192,'sys::Bool',xp,{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{});
PointUtil.type$.am$('isHisCollect',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('pt','haystack::Dict',false)]),{}).am$('applyUnit',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('pt','haystack::Dict',false),new sys.Param('val','sys::Obj?',false),new sys.Param('action','sys::Str',false)]),{}).am$('pointDetails',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('pt','haystack::Dict',false),new sys.Param('isTop','sys::Bool',false)]),{}).am$('toSummary',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('pt','haystack::Dict',false)]),{}).am$('toOccupied',40962,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('r','haystack::Dict',false),new sys.Param('checked','sys::Bool',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('toParentSpaceOccupied',34818,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('r','haystack::Dict',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('toParentEquipOccupied',34818,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('r','haystack::Dict',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
RosterTest.type$.af$('lib',73728,'hxPoint::PointLib?',{}).am$('test',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifyEnumMeta',8192,'sys::Void',xp,{}).am$('verifyEnumDef',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','hxPoint::EnumDef',false),new sys.Param('name','sys::Str',false),new sys.Param('code','sys::Int',false)]),{}).am$('verifyWritables',8192,'sys::Void',xp,{}).am$('verifyWritable',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','sys::Int',false)]),{}).am$('verifyNotWritable',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('writeArray',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('verifyHisCollects',8192,'sys::Void',xp,{}).am$('verifyHisCollect',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('interval','sys::Duration?',false),new sys.Param('cov','sys::Bool',false)]),{}).am$('verifyNotHisCollect',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('verifyHisCollectWatch',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('recs','haystack::Dict[]',false)]),{}).am$('sync',2048,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
ConvertTest.type$.af$('lib',73728,'hxPoint::PointLib?',{}).am$('test',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('doCache',8192,'sys::Void',xp,{}).am$('doEnums',8192,'sys::Void',xp,{}).am$('verifyEnumDef',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','hxPoint::EnumDef',false),new sys.Param('name','sys::Str',false),new sys.Param('code','sys::Int',false)]),{}).am$('verifyEnumBad',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','hxPoint::EnumDef',false)]),{}).am$('doEnumConverts',8192,'sys::Void',xp,{}).am$('doParse',8192,'sys::Void',xp,{}).am$('verifyParse',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('in','sys::Obj?',false),new sys.Param('out','sys::Obj?',false),new sys.Param('type','sys::Type',false),new sys.Param('x','sys::Obj?',true)]),{}).am$('verifyStrToBool',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('fs','sys::Str[]',false),new sys.Param('ts','sys::Str[]',false),new sys.Param('toStr','sys::Str',true)]),{}).am$('doUnit',8192,'sys::Void',xp,{}).am$('verifyUnit',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('from','sys::Float',false),new sys.Param('expected','sys::Float',false)]),{}).am$('doBool',8192,'sys::Void',xp,{}).am$('doTypeConverts',8192,'sys::Void',xp,{}).am$('doThermistor',8192,'sys::Void',xp,{}).am$('verifyThermistor',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','hxPoint::PointConvert',false),new sys.Param('ohms','sys::Float',false),new sys.Param('degF','sys::Float',false)]),{}).am$('doFunc',8192,'sys::Void',xp,{}).am$('verifyFuncConvert',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','sys::Obj?',false),new sys.Param('pattern','sys::Str',false),new sys.Param('from','sys::Obj?',false),new sys.Param('expected','sys::Obj?',false)]),{}).am$('verifyConvert',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','hxPoint::PointConvert',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('val','sys::Obj?',false),new sys.Param('expected','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HisCollectTest.type$.am$('testConfig',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifyConfig',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('ptTags','[sys::Str:sys::Obj]',false),new sys.Param('interval','sys::Str',false),new sys.Param('cov','sys::Str',false),new sys.Param('rateLimit','sys::Str',false),new sys.Param('writeFreq','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
WriteTest.type$.am$('testWrites',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifyWrite',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPoint::PointLib',false),new sys.Param('pt','haystack::Dict',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','sys::Int',false),new sys.Param('levels','[sys::Int:sys::Obj?]',false)]),{}).am$('testObservable',8192,'sys::Void',xp,{'hx::HxRuntimeTest':"hx::HxRuntimeTest{meta=\"steadyState: 500ms\";}"}).am$('verifyObs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obs','hxPoint::TestObserver',false),new sys.Param('pt','haystack::Dict',false),new sys.Param('val','sys::Obj?',false),new sys.Param('level','sys::Int',false),new sys.Param('who','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TestObserver.type$.af$('msgsRef',73730,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',xp,{}).am$('meta',271360,'haystack::Dict',xp,{}).am$('actor',271360,'concurrent::Actor',xp,{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('sync',8192,'sys::Obj?',xp,{}).am$('msgs',8192,'sys::Obj[]',xp,{}).am$('clear',8192,'sys::Void',xp,{});
PointRecSetTest.type$.am$('testSets',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifyToSet',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('axon','sys::Str',false),new sys.Param('recs','haystack::Dict?[]',false)]),{}).am$('testToOccupied',270336,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifytoOccupied',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','haystack::Dict',false),new sys.Param('expected','haystack::Dict?',false)]),{}).am$('testMatchPointVal',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('verifyMatchPointVal',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('params','sys::Str',false),new sys.Param('expected','sys::Bool',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxPoint");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;haystack 3.1.11;obs 3.1.11;axon 3.1.11;folio 3.1.11;hx 3.1.11;hxUtil 3.1.11");
m.set("pod.summary", "Point historization and writable support");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:27-05:00 New_York");
m.set("build.tsKey", "241210143127");
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
  PointLib,
  EnumDefs,
  EnumDef,
  PointConvert,
  PointFuncs,
  WriteObservation,
  PointUtil,
  RosterTest,
  ConvertTest,
  HisCollectTest,
  WriteTest,
  PointRecSetTest,
};
