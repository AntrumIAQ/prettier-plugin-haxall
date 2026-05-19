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
import * as hxPoint from './hxPoint.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class ConnTrace extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#log = ConnTraceLog.make(this);
    this.#enabled = concurrent.AtomicBool.make();
    return;
  }

  typeof() { return ConnTrace.type$; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #actor = null;

  // private field reflection only
  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  #enabled = null;

  // private field reflection only
  __enabled(it) { if (it === undefined) return this.#enabled; else this.#enabled = it; }

  static make(pool) {
    const $self = new ConnTrace();
    ConnTrace.make$($self,pool);
    return $self;
  }

  static make$($self,pool) {
    concurrent.Actor.make$($self, pool);
    ;
    $self.#actor = ConnTraceActor.make($self, pool);
    return;
  }

  max() {
    return 500;
  }

  isEnabled() {
    return this.#enabled.val();
  }

  enable() {
    if (this.#enabled.compareAndSet(false, true)) {
      this.#actor.send(hx.HxMsg.make0("enable")).get(null);
    }
    ;
    return;
  }

  disable() {
    if (this.#enabled.compareAndSet(true, false)) {
      this.#actor.send(hx.HxMsg.make0("disable")).get(null);
    }
    ;
    return;
  }

  clear() {
    this.#actor.send(hx.HxMsg.make0("clear"));
    return;
  }

  read() {
    return this.readSince(null);
  }

  readSince(since) {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.#actor.send(hx.HxMsg.make1("read", since)).get(), sys.Unsafe.type$).val(), sys.Type.find("hxConn::ConnTraceMsg[]"));
  }

  write(type,msg,arg) {
    if (arg === undefined) arg = null;
    if (this.isEnabled()) {
      if ((arg != null && !sys.ObjUtil.isImmutable(arg))) {
        throw sys.NotImmutableErr.make(sys.Str.plus("Trace arg not immutable: ", sys.ObjUtil.typeof(arg)));
      }
      ;
      this.#actor.send(ConnTraceMsg.make(type, msg, arg));
    }
    ;
    return;
  }

  phase(msg,arg) {
    if (arg === undefined) arg = null;
    this.write("phase", msg, arg);
    return;
  }

  dispatch(msg) {
    this.write("dispatch", msg.id(), msg);
    return;
  }

  poll(msg,arg) {
    if (arg === undefined) arg = null;
    this.write("poll", msg, arg);
    return;
  }

  req(msg,arg) {
    this.write("req", msg, arg);
    return;
  }

  res(msg,arg) {
    this.write("res", msg, arg);
    return;
  }

  event(msg,arg) {
    this.write("event", msg, arg);
    return;
  }

  asLog() {
    return this.#log;
  }

}

class ConnTraceMsg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnTraceMsg.type$; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #msg = null;

  msg() { return this.#msg; }

  __msg(it) { if (it === undefined) return this.#msg; else this.#msg = it; }

  #arg = null;

  arg() { return this.#arg; }

  __arg(it) { if (it === undefined) return this.#arg; else this.#arg = it; }

  static toGrid(list,meta) {
    if (meta === undefined) meta = null;
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.setMeta(meta);
    gb.addCol("ts", haystack.Etc.makeDict1("format", "hh:mm:ss.fff")).addCol("connTraceType", haystack.Etc.makeDict1("dis", "type")).addCol("msg").addCol("arg");
    list.each((x) => {
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [x.#ts, x.#type, x.#msg, x.argToStr()]));
      return;
    });
    return gb.toGrid();
  }

  static applyOpts(list,opts) {
    const this$ = this;
    if ((opts == null || opts.isEmpty())) {
      return list;
    }
    ;
    let types = ((this$) => { let $_u0 = sys.ObjUtil.as(opts.get("types"), sys.Str.type$); if ($_u0 == null) return null; return sys.Str.trimToNull(sys.ObjUtil.as(opts.get("types"), sys.Str.type$)); })(this);
    if ((types == null || sys.ObjUtil.equals(types, "*"))) {
      return list;
    }
    ;
    let typesMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).setList(sys.Str.split(types, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())));
    return list.findAll((x) => {
      return typesMap.containsKey(x.#type);
    });
  }

  static make(type,msg,arg) {
    const $self = new ConnTraceMsg();
    ConnTraceMsg.make$($self,type,msg,arg);
    return $self;
  }

  static make$($self,type,msg,arg) {
    $self.#ts = sys.DateTime.now(null);
    $self.#type = type;
    $self.#msg = msg;
    $self.#arg = ((this$) => { let $_u1 = arg; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(arg); })($self);
    return;
  }

  toStr() {
    let s = sys.StrBuf.make();
    s.add("[").add(this.#ts.toLocale("YYYY-MM-DD hh:mm:ss")).add("] ").add("<").add(this.#type).add("> ").add(this.#msg);
    if (this.#arg != null) {
      s.add(" ").add(this.#arg);
    }
    ;
    return s.toStr();
  }

  argToStr() {
    if (this.#arg == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(this.#arg, sys.Buf.type$)) {
      return sys.ObjUtil.coerce(this.#arg, sys.Buf.type$).toHex();
    }
    ;
    if (sys.ObjUtil.is(this.#arg, sys.Err.type$)) {
      return sys.ObjUtil.coerce(this.#arg, sys.Err.type$).traceToStr();
    }
    ;
    if (sys.ObjUtil.is(this.#arg, sys.LogRec.type$)) {
      let b = sys.Buf.make();
      sys.ObjUtil.coerce(this.#arg, sys.LogRec.type$).print(b.out());
      return sys.ObjUtil.coerce(b.flip(), sys.Buf.type$.toNullable()).readAllStr();
    }
    ;
    return sys.ObjUtil.toStr(this.#arg);
  }

}

class ConnTraceLog extends sys.Log {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnTraceLog.type$; }

  #trace = null;

  trace() { return this.#trace; }

  __trace(it) { if (it === undefined) return this.#trace; else this.#trace = it; }

  static make(trace) {
    const $self = new ConnTraceLog();
    ConnTraceLog.make$($self,trace);
    return $self;
  }

  static make$($self,trace) {
    sys.Log.make$($self, "connTrace", false);
    $self.#trace = trace;
    $self.level(sys.LogLevel.silent());
    return;
  }

  log(rec) {
    let msg = rec.msg();
    let char = ((this$) => { if (sys.Str.isEmpty(msg)) return 120; return sys.Str.get(msg, 0); })(this);
    let $_u3 = char;
    if (sys.ObjUtil.equals($_u3, 62)) {
      this.#trace.req(ConnTraceLog.summaryLine(msg), msg);
    }
    else if (sys.ObjUtil.equals($_u3, 60)) {
      this.#trace.res(ConnTraceLog.summaryLine(msg), msg);
    }
    else if (sys.ObjUtil.equals($_u3, 94)) {
      this.#trace.event(ConnTraceLog.summaryLine(msg), msg);
    }
    else {
      this.#trace.write("log", msg, rec);
    }
    ;
    return;
  }

  static summaryLine(msg) {
    let i = sys.Str.index(msg, "\n");
    if (i == null) {
      return msg;
    }
    ;
    let j = sys.Str.index(msg, "\n", sys.Int.plus(sys.ObjUtil.coerce(i, sys.Int.type$), 1));
    if (j == null) {
      return sys.Str.getRange(msg, sys.Range.make(0, sys.ObjUtil.coerce(i, sys.Int.type$), true));
    }
    ;
    return sys.Str.getRange(msg, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(i, sys.Int.type$), 1), sys.ObjUtil.coerce(j, sys.Int.type$), true));
  }

}

class ConnTraceFeed extends hx.HxFeed {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnTraceFeed.type$; }

  #trace = null;

  trace() { return this.#trace; }

  __trace(it) { if (it === undefined) return this.#trace; else this.#trace = it; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  static make(cx,trace,ts,opts) {
    const $self = new ConnTraceFeed();
    ConnTraceFeed.make$($self,cx,trace,ts,opts);
    return $self;
  }

  static make$($self,cx,trace,ts,opts) {
    hx.HxFeed.make$($self, cx);
    $self.#trace = trace;
    $self.#ts = concurrent.AtomicRef.make(ts);
    $self.#opts = opts;
    return;
  }

  poll(cx) {
    let list = this.#trace.readSince(sys.ObjUtil.coerce(this.#ts.val(), sys.DateTime.type$.toNullable()));
    if (!list.isEmpty()) {
      this.#ts.val(list.last().ts());
      (list = ConnTraceMsg.applyOpts(list, this.#opts));
    }
    ;
    return ConnTraceMsg.toGrid(list);
  }

}

class ConnTraceActor extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnTraceActor.type$; }

  #trace = null;

  // private field reflection only
  __trace(it) { if (it === undefined) return this.#trace; else this.#trace = it; }

  static make(trace,pool) {
    const $self = new ConnTraceActor();
    ConnTraceActor.make$($self,trace,pool);
    return $self;
  }

  static make$($self,trace,pool) {
    concurrent.Actor.make$($self, pool);
    $self.#trace = trace;
    return;
  }

  receive(msg) {
    if (sys.ObjUtil.is(msg, ConnTraceMsg.type$)) {
      sys.ObjUtil.coerce(concurrent.Actor.locals().get("b"), hxUtil.CircularBuf.type$).add(msg);
      return msg;
    }
    else {
      let m = sys.ObjUtil.coerce(msg, hx.HxMsg.type$);
      let $_u4 = m.id();
      if (sys.ObjUtil.equals($_u4, "read")) {
        return this.onRead(sys.ObjUtil.coerce(m.a(), sys.DateTime.type$.toNullable()));
      }
      else if (sys.ObjUtil.equals($_u4, "enable")) {
        return this.onEnable();
      }
      else if (sys.ObjUtil.equals($_u4, "disable")) {
        return this.onDisable();
      }
      else if (sys.ObjUtil.equals($_u4, "clear")) {
        return this.onClear();
      }
      else {
        throw sys.Err.make(sys.Str.plus("Unknown msg type: ", m));
      }
      ;
    }
    ;
  }

  onRead(since) {
    const this$ = this;
    let acc = sys.List.make(ConnTraceMsg.type$);
    let buf = sys.ObjUtil.as(concurrent.Actor.locals().get("b"), hxUtil.CircularBuf.type$);
    let sinceTicks = ((this$) => { if (since == null) return 0; return since.ticks(); })(this);
    if (buf != null) {
      acc.capacity(buf.size());
      buf.eachr(sys.ObjUtil.coerce((item) => {
        if (sys.ObjUtil.compareGT(item.ts().ticks(), sinceTicks)) {
          acc.add(item);
        }
        ;
        return;
      }, sys.Type.find("|sys::Obj?->sys::Void|")));
    }
    ;
    return sys.Unsafe.make(acc);
  }

  onEnable() {
    this.#trace.log().level(sys.LogLevel.debug());
    concurrent.Actor.locals().set("b", hxUtil.CircularBuf.make(this.#trace.max()));
    return "enabled";
  }

  onDisable() {
    this.#trace.log().level(sys.LogLevel.silent());
    concurrent.Actor.locals().remove("b");
    return "disabled";
  }

  onClear() {
    let buf = sys.ObjUtil.as(concurrent.Actor.locals().get("b"), hxUtil.CircularBuf.type$);
    if (buf != null) {
      buf.clear();
    }
    ;
    return "enabled";
  }

}

class ConnPointHisState extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnPointHisState.type$; }

  static #nil = undefined;

  static nil() {
    if (ConnPointHisState.#nil === undefined) {
      ConnPointHisState.static$init();
      if (ConnPointHisState.#nil === undefined) ConnPointHisState.#nil = null;
    }
    return ConnPointHisState.#nil;
  }

  #status = null;

  status() { return this.#status; }

  __status(it) { if (it === undefined) return this.#status; else this.#status = it; }

  #err = null;

  err() { return this.#err; }

  __err(it) { if (it === undefined) return this.#err; else this.#err = it; }

  #lastUpdate = 0;

  lastUpdate() { return this.#lastUpdate; }

  __lastUpdate(it) { if (it === undefined) return this.#lastUpdate; else this.#lastUpdate = it; }

  #lastItems = null;

  lastItems() { return this.#lastItems; }

  __lastItems(it) { if (it === undefined) return this.#lastItems; else this.#lastItems = it; }

  #numUpdates = 0;

  numUpdates() { return this.#numUpdates; }

  __numUpdates(it) { if (it === undefined) return this.#numUpdates; else this.#numUpdates = it; }

  static updateOk(pt,items,span) {
    let old = pt.hisState();
    try {
      let lastItems = sys.StrBuf.make();
      lastItems.add(sys.Int.toStr(items.size())).add(" items");
      if (sys.ObjUtil.compareGT(items.size(), 0)) {
        lastItems.add(", ").add(items.last());
      }
      ;
      let rec = pt.rec();
      let convert = pt.hisConvert();
      if (convert != null) {
        for (let i = 0; sys.ObjUtil.compareLT(i, items.size()); i = sys.Int.increment(i)) {
          let oldItem = items.get(i);
          items.set(i, haystack.HisItem.make(oldItem.ts(), convert.convert(pt.lib().pointLib(), rec, oldItem.val())));
        }
        ;
      }
      ;
      pt.lib().rt().his().write(rec, items, haystack.Etc.makeDict1("clip", span));
      return ConnPointHisState.makeOk(old, lastItems.toStr());
    }
    catch ($_u6) {
      $_u6 = sys.Err.make($_u6);
      if ($_u6 instanceof sys.Err) {
        let e = $_u6;
        ;
        return ConnPointHisState.makeErr(old, e);
      }
      else {
        throw $_u6;
      }
    }
    ;
  }

  static updateErr(pt,err) {
    return ConnPointHisState.makeErr(pt.hisState(), err);
  }

  details(s,pt) {
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("hisAddr:        ", pt.writeAddr()), "\nhisStatus:      "), this.#status), "\nhisConvert:     "), pt.hisConvert()), "\nhisLastUpdate:  "), haystack.Etc.debugDur(sys.ObjUtil.coerce(this.#lastUpdate, sys.Obj.type$.toNullable()))), "\nhisLastItems    "), this.#lastItems), "\nhisNumUpdate:   "), sys.ObjUtil.coerce(this.#numUpdates, sys.Obj.type$.toNullable())), "\nhisErr:         "), haystack.Etc.debugErr(this.#err)), "\n"));
    return;
  }

  static makeNil() {
    const $self = new ConnPointHisState();
    ConnPointHisState.makeNil$($self);
    return $self;
  }

  static makeNil$($self) {
    $self.#status = ConnStatus.unknown();
    $self.#lastItems = "";
    return;
  }

  static makeOk(old,lastItems) {
    const $self = new ConnPointHisState();
    ConnPointHisState.makeOk$($self,old,lastItems);
    return $self;
  }

  static makeOk$($self,old,lastItems) {
    $self.#status = ConnStatus.ok();
    $self.#lastUpdate = sys.Duration.nowTicks();
    $self.#lastItems = lastItems;
    $self.#numUpdates = sys.Int.plus(old.#numUpdates, 1);
    return;
  }

  static makeErr(old,err) {
    const $self = new ConnPointHisState();
    ConnPointHisState.makeErr$($self,old,err);
    return $self;
  }

  static makeErr$($self,old,err) {
    $self.#status = ConnStatus.fromErr(err);
    $self.#lastUpdate = sys.Duration.nowTicks();
    $self.#lastItems = "";
    $self.#numUpdates = sys.Int.plus(old.#numUpdates, 1);
    $self.#err = err;
    return;
  }

  static static$init() {
    ConnPointHisState.#nil = ConnPointHisState.makeNil();
    return;
  }

}

class ConnLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
    this.#fwRef = concurrent.AtomicRef.make();
    this.#pointLibRef = concurrent.AtomicRef.make();
    this.#modelRef = concurrent.AtomicRef.make();
    this.#connTag = sys.Str.plus(this.name(), "Conn");
    this.#connRefTag = sys.Str.plus(this.name(), "ConnRef");
    this.#roster = ConnRoster.make(this);
    this.#tuningRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return ConnLib.type$; }

  #fwRef = null;

  // private field reflection only
  __fwRef(it) { if (it === undefined) return this.#fwRef; else this.#fwRef = it; }

  #pointLibRef = null;

  // private field reflection only
  __pointLibRef(it) { if (it === undefined) return this.#pointLibRef; else this.#pointLibRef = it; }

  #modelRef = null;

  // private field reflection only
  __modelRef(it) { if (it === undefined) return this.#modelRef; else this.#modelRef = it; }

  #connTag = null;

  connTag() { return this.#connTag; }

  __connTag(it) { if (it === undefined) return this.#connTag; else this.#connTag = it; }

  #connRefTag = null;

  connRefTag() { return this.#connRefTag; }

  __connRefTag(it) { if (it === undefined) return this.#connRefTag; else this.#connRefTag = it; }

  #roster = null;

  roster() { return this.#roster; }

  __roster(it) { if (it === undefined) return this.#roster; else this.#roster = it; }

  #tuningRef = null;

  // private field reflection only
  __tuningRef(it) { if (it === undefined) return this.#tuningRef; else this.#tuningRef = it; }

  #connActorPool = null;

  connActorPool() { return this.#connActorPool; }

  __connActorPool(it) { if (it === undefined) return this.#connActorPool; else this.#connActorPool = it; }

  #poller = null;

  poller() { return this.#poller; }

  __poller(it) { if (it === undefined) return this.#poller; else this.#poller = it; }

  static make() {
    const $self = new ConnLib();
    ConnLib.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    hx.HxLib.make$($self);
    ;
    $self.#connActorPool = concurrent.ActorPool.make((it) => {
      it.__name(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.rt().name()), "-"), sys.Str.capitalize(this$.name())));
      it.__maxThreads(this$.rec().effectiveMaxThreads());
      return;
    });
    $self.#poller = ConnPoller.make($self);
    return;
  }

  rec() {
    return sys.ObjUtil.coerce(hx.HxLib.prototype.rec.call(this), ConnSettings.type$);
  }

  fw() {
    return sys.ObjUtil.coerce(this.#fwRef.val(), ConnFwLib.type$);
  }

  pointLib() {
    return sys.ObjUtil.coerce(this.#pointLibRef.val(), hxPoint.PointLib.type$);
  }

  model() {
    return sys.ObjUtil.coerce(((this$) => { let $_u7 = this$.#modelRef.val(); if ($_u7 != null) return $_u7; throw sys.Err.make("Not avail until after start"); })(this), ConnModel.type$);
  }

  icon() {
    return sys.ObjUtil.coerce(this.def().get("icon", "conn"), sys.Str.type$);
  }

  libDis() {
    return sys.ObjUtil.coerce(((this$) => { let $_u8 = this$.def().get("dis"); if ($_u8 != null) return $_u8; return ((this$) => { let $_u9 = ((this$) => { let $_u10 = sys.Pod.find("ui", false); if ($_u10 == null) return null; return sys.Pod.find("ui", false).locale(this$.name(), null); })(this$); if ($_u9 != null) return $_u9; return sys.Str.capitalize(this$.name()); })(this$); })(this), sys.Str.type$);
  }

  numConns() {
    return this.#roster.numConns();
  }

  connFeatures() {
    return sys.ObjUtil.coerce(((this$) => { let $_u11 = ((this$) => { let $_u12=sys.ObjUtil.as(this$.#modelRef.val(), ConnModel.type$); return ($_u12==null) ? null : $_u12.features(); })(this$); if ($_u11 != null) return $_u11; return haystack.Etc.makeDict1("name", this$.name()); })(this), haystack.Dict.type$);
  }

  conns() {
    return this.#roster.conns();
  }

  conn(id,checked) {
    if (checked === undefined) checked = true;
    return this.#roster.conn(id, checked);
  }

  points() {
    return this.#roster.points();
  }

  point(id,checked) {
    if (checked === undefined) checked = true;
    return this.#roster.point(id, checked);
  }

  tunings() {
    return this.fw().tunings();
  }

  tuning() {
    return sys.ObjUtil.coerce(this.#tuningRef.val(), ConnTuning.type$);
  }

  onStart() {
    this.#pointLibRef.val(sys.ObjUtil.coerce(this.rt().lib("point"), hxPoint.PointLib.type$));
    let fw = sys.ObjUtil.coerce(this.rt().lib("conn"), ConnFwLib.type$);
    this.#fwRef.val(fw);
    fw.service().addLib(this);
    this.#tuningRef.val(this.tunings().forLib(this));
    let model = ConnModel.make(this);
    this.#modelRef.val(model);
    this.#roster.start(model);
    if (model.pollMode().isEnabled()) {
      this.#poller.onStart();
    }
    ;
    return;
  }

  onStop() {
    if (this.rt().isRunning()) {
      this.#roster.removeAll();
      this.fw().service().removeLib(this);
    }
    ;
    this.#connActorPool.kill();
    return;
  }

  onRecUpdate() {
    this.#tuningRef.val(this.tunings().forLib(this));
    return;
  }

  onConnEvent(e) {
    if (e != null) {
      this.#roster.onConnEvent(sys.ObjUtil.coerce(e, obs.CommitObservation.type$));
    }
    ;
    return;
  }

  onPointEvent(e) {
    if (e != null) {
      this.#roster.onPointEvent(sys.ObjUtil.coerce(e, obs.CommitObservation.type$));
    }
    ;
    return;
  }

  onPointWatch(e) {
    if (e != null) {
      this.#roster.onPointWatch(sys.ObjUtil.coerce(e, obs.Observation.type$));
    }
    ;
    return;
  }

  onPointWrite(e) {
    if (e != null) {
      this.#roster.onPointWrite(sys.ObjUtil.coerce(e, hxPoint.WriteObservation.type$));
    }
    ;
    return;
  }

  tuningDefault() {
    return ConnTuning.make(haystack.Etc.makeDict1("id", haystack.Ref.fromStr(sys.Str.plus(sys.Str.plus("", this.name()), "-default"))));
  }

  onLearn(conn,arg) {
    return conn.send(hx.HxMsg.make1("learn", arg));
  }

  onConnDetails(conn) {
    return "";
  }

  onPointDetails(point) {
    return "";
  }

}

class ConnSettings extends haystack.TypedDict {
  constructor() {
    super();
    const this$ = this;
    this.#maxThreads = 100;
    return;
  }

  typeof() { return ConnSettings.type$; }

  #connTuningRef = null;

  connTuningRef() { return this.#connTuningRef; }

  __connTuningRef(it) { if (it === undefined) return this.#connTuningRef; else this.#connTuningRef = it; }

  #maxThreads = 0;

  maxThreads() { return this.#maxThreads; }

  __maxThreads(it) { if (it === undefined) return this.#maxThreads; else this.#maxThreads = it; }

  static make(d,f) {
    const $self = new ConnSettings();
    ConnSettings.make$($self,d,f);
    return $self;
  }

  static make$($self,d,f) {
    haystack.TypedDict.make$($self, d);
    ;
    sys.Func.call(f, $self);
    return;
  }

  effectiveMaxThreads() {
    let x = sys.ObjUtil.as(this.get("actorPoolMaxThreads"), haystack.Number.type$);
    if (x != null) {
      return sys.Int.clamp(x.toInt(), 1, 5000);
    }
    ;
    return sys.Int.clamp(this.#maxThreads, 1, 5000);
  }

}

class RemoteStatusErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RemoteStatusErr.type$; }

  #status = null;

  status() { return this.#status; }

  __status(it) { if (it === undefined) return this.#status; else this.#status = it; }

  static make(status) {
    const $self = new RemoteStatusErr();
    RemoteStatusErr.make$($self,status);
    return $self;
  }

  static make$($self,status) {
    sys.Err.make$($self, status.name());
    if (status.isOk()) {
      throw sys.ArgErr.make("RemoteStatusErr cannot be 'ok'");
    }
    ;
    $self.#status = status;
    return;
  }

}

class UnknownConnLibErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownConnLibErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownConnLibErr();
    UnknownConnLibErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownConnErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownConnErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownConnErr();
    UnknownConnErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownConnPointErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownConnPointErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownConnPointErr();
    UnknownConnPointErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownConnTuningErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownConnTuningErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownConnTuningErr();
    UnknownConnTuningErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class NotOpenLibErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NotOpenLibErr.type$; }

  static make(msg,cause) {
    const $self = new NotOpenLibErr();
    NotOpenLibErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class ConnService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#libDataRef = concurrent.AtomicRef.make(ConnServiceLibData.makeEmpty());
    this.#connsById = concurrent.ConcurrentMap.make();
    this.#pointsById = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return ConnService.type$; }

  #fw = null;

  // private field reflection only
  __fw(it) { if (it === undefined) return this.#fw; else this.#fw = it; }

  #libDataRef = null;

  // private field reflection only
  __libDataRef(it) { if (it === undefined) return this.#libDataRef; else this.#libDataRef = it; }

  #connsById = null;

  // private field reflection only
  __connsById(it) { if (it === undefined) return this.#connsById; else this.#connsById = it; }

  #pointsById = null;

  // private field reflection only
  __pointsById(it) { if (it === undefined) return this.#pointsById; else this.#pointsById = it; }

  static make(fw) {
    const $self = new ConnService();
    ConnService.make$($self,fw);
    return $self;
  }

  static make$($self,fw) {
    ;
    $self.#fw = fw;
    return;
  }

  libs() {
    return this.libData().list();
  }

  lib(name,checked) {
    if (checked === undefined) checked = true;
    let lib = this.libData().byName().get(name);
    if (lib != null) {
      return lib;
    }
    ;
    if (checked) {
      throw UnknownConnLibErr.make(name);
    }
    ;
    return null;
  }

  libData() {
    return sys.ObjUtil.coerce(this.#libDataRef.val(), ConnServiceLibData.type$);
  }

  conns() {
    return sys.ObjUtil.coerce(this.#connsById.vals(hx.HxConn.type$), sys.Type.find("hx::HxConn[]"));
  }

  conn(id,checked) {
    if (checked === undefined) checked = true;
    let conn = this.#connsById.get(id);
    if (conn != null) {
      return sys.ObjUtil.coerce(conn, hx.HxConn.type$.toNullable());
    }
    ;
    if (checked) {
      throw UnknownConnErr.make(sys.Str.plus("Connector not found: ", id.toZinc()));
    }
    ;
    return null;
  }

  isConn(id) {
    return this.#connsById.get(id) != null;
  }

  points() {
    return sys.ObjUtil.coerce(this.#pointsById.vals(hx.HxConnPoint.type$), sys.Type.find("hx::HxConnPoint[]"));
  }

  point(id,checked) {
    if (checked === undefined) checked = true;
    let point = this.#pointsById.get(id);
    if (point != null) {
      return sys.ObjUtil.coerce(point, hx.HxConnPoint.type$.toNullable());
    }
    ;
    if (checked) {
      throw UnknownConnPointErr.make(sys.Str.plus("Connector point not found: ", id.toZinc()));
    }
    ;
    return null;
  }

  isPoint(id) {
    return this.#pointsById.get(id) != null;
  }

  addLib(lib) {
    while (true) {
      let oldData = this.libData();
      let newData = oldData.add(lib);
      if (this.#libDataRef.compareAndSet(oldData, newData)) {
        break;
      }
      ;
    }
    ;
    return;
  }

  removeLib(lib) {
    while (true) {
      let oldData = this.libData();
      let newData = oldData.remove(lib);
      if (this.#libDataRef.compareAndSet(oldData, newData)) {
        break;
      }
      ;
    }
    ;
    return;
  }

  addConn(conn) {
    this.#connsById.set(conn.id(), conn);
    return;
  }

  removeConn(conn) {
    this.#connsById.remove(conn.id());
    return;
  }

  addPoint(pt) {
    let dup = sys.ObjUtil.as(this.#pointsById.getAndSet(pt.id(), pt), hx.HxConnPoint.type$);
    if ((dup != null && dup.lib() !== pt.lib())) {
      let pref = sys.ObjUtil.as(pt.rec().get("connDupPref"), sys.Str.type$);
      if (pref != null) {
        if (sys.ObjUtil.equals(pt.lib().name(), pref)) {
          return;
        }
        ;
        if (sys.ObjUtil.equals(dup.lib().name(), pref)) {
          this.#pointsById.set(dup.id(), sys.ObjUtil.coerce(dup, sys.Obj.type$));
          return null;
        }
        ;
      }
      ;
      this.#fw.log().warn(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Duplicate conn refs: ", dup.lib().name()), " + "), pt.lib().name()), " ["), pt.id().toZinc()), "]"));
    }
    ;
    return;
  }

  removePoint(pt) {
    this.#pointsById.remove(pt.id());
    return;
  }

}

class ConnServiceLibData extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#list = sys.ObjUtil.coerce(((this$) => { let $_u13 = sys.List.make(hx.HxConnLib.type$); if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(hx.HxConnLib.type$)); })(this), sys.Type.find("hx::HxConnLib[]"));
    this.#byName = sys.ObjUtil.coerce(((this$) => { let $_u14 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hx::HxConnLib")); if ($_u14 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hx::HxConnLib"))); })(this), sys.Type.find("[sys::Str:hx::HxConnLib]"));
    return;
  }

  typeof() { return ConnServiceLibData.type$; }

  #list = null;

  list() { return this.#list; }

  __list(it) { if (it === undefined) return this.#list; else this.#list = it; }

  #byName = null;

  byName() { return this.#byName; }

  __byName(it) { if (it === undefined) return this.#byName; else this.#byName = it; }

  static makeEmpty() {
    return ConnServiceLibData.make(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hx::HxConnLib")));
  }

  static make(byName) {
    const $self = new ConnServiceLibData();
    ConnServiceLibData.make$($self,byName);
    return $self;
  }

  static make$($self,byName) {
    const this$ = $self;
    ;
    $self.#list = sys.ObjUtil.coerce(((this$) => { let $_u15 = byName.vals().sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    }); if ($_u15 == null) return null; return sys.ObjUtil.toImmutable(byName.vals().sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    })); })($self), sys.Type.find("hx::HxConnLib[]"));
    $self.#byName = sys.ObjUtil.coerce(((this$) => { let $_u16 = byName; if ($_u16 == null) return null; return sys.ObjUtil.toImmutable(byName); })($self), sys.Type.find("[sys::Str:hx::HxConnLib]"));
    return;
  }

  add(lib) {
    return ConnServiceLibData.make(this.#byName.dup().set(lib.name(), lib));
  }

  remove(lib) {
    const this$ = this;
    return ConnServiceLibData.make(sys.ObjUtil.coerce(sys.ObjUtil.with(this.#byName.dup(), (it) => {
      it.remove(lib.name());
      return;
    }), sys.Type.find("[sys::Str:hx::HxConnLib]")));
  }

}

class Conn extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#dataRef = concurrent.AtomicRef.make();
    this.#vars = ConnVars.make();
    this.#committer = ConnCommitter.make();
    this.#pollNext = concurrent.AtomicInt.make(0);
    this.#pollBucketsRef = concurrent.AtomicRef.make(ConnPollBucket.type$.emptyList());
    this.#aliveRef = concurrent.AtomicBool.make(true);
    this.#pointsList = concurrent.AtomicRef.make(ConnPoint.type$.emptyList());
    this.#threadDebugRef = concurrent.AtomicRef.make(null);
    return;
  }

  typeof() { return Conn.type$; }

  static #toCoalesceKey = undefined;

  static toCoalesceKey() {
    if (Conn.#toCoalesceKey === undefined) {
      Conn.static$init();
      if (Conn.#toCoalesceKey === undefined) Conn.#toCoalesceKey = null;
    }
    return Conn.#toCoalesceKey;
  }

  static #toCoalesce = undefined;

  static toCoalesce() {
    if (Conn.#toCoalesce === undefined) {
      Conn.static$init();
      if (Conn.#toCoalesce === undefined) Conn.#toCoalesce = null;
    }
    return Conn.#toCoalesce;
  }

  #libRef = null;

  // private field reflection only
  __libRef(it) { if (it === undefined) return this.#libRef; else this.#libRef = it; }

  #idRef = null;

  // private field reflection only
  __idRef(it) { if (it === undefined) return this.#idRef; else this.#idRef = it; }

  #traceRef = null;

  // private field reflection only
  __traceRef(it) { if (it === undefined) return this.#traceRef; else this.#traceRef = it; }

  #dataRef = null;

  // private field reflection only
  __dataRef(it) { if (it === undefined) return this.#dataRef; else this.#dataRef = it; }

  #configRef = null;

  // private field reflection only
  __configRef(it) { if (it === undefined) return this.#configRef; else this.#configRef = it; }

  #vars = null;

  vars() { return this.#vars; }

  __vars(it) { if (it === undefined) return this.#vars; else this.#vars = it; }

  #committer = null;

  committer() { return this.#committer; }

  __committer(it) { if (it === undefined) return this.#committer; else this.#committer = it; }

  #pollModeRef = null;

  // private field reflection only
  __pollModeRef(it) { if (it === undefined) return this.#pollModeRef; else this.#pollModeRef = it; }

  static #pollMsg = undefined;

  static pollMsg() {
    if (Conn.#pollMsg === undefined) {
      Conn.static$init();
      if (Conn.#pollMsg === undefined) Conn.#pollMsg = null;
    }
    return Conn.#pollMsg;
  }

  #pollNext = null;

  pollNext() { return this.#pollNext; }

  __pollNext(it) { if (it === undefined) return this.#pollNext; else this.#pollNext = it; }

  #pollBucketsRef = null;

  // private field reflection only
  __pollBucketsRef(it) { if (it === undefined) return this.#pollBucketsRef; else this.#pollBucketsRef = it; }

  static #houseKeepingFreq = undefined;

  static houseKeepingFreq() {
    if (Conn.#houseKeepingFreq === undefined) {
      Conn.static$init();
      if (Conn.#houseKeepingFreq === undefined) Conn.#houseKeepingFreq = null;
    }
    return Conn.#houseKeepingFreq;
  }

  static #houseKeepingMsg = undefined;

  static houseKeepingMsg() {
    if (Conn.#houseKeepingMsg === undefined) {
      Conn.static$init();
      if (Conn.#houseKeepingMsg === undefined) Conn.#houseKeepingMsg = null;
    }
    return Conn.#houseKeepingMsg;
  }

  #aliveRef = null;

  // private field reflection only
  __aliveRef(it) { if (it === undefined) return this.#aliveRef; else this.#aliveRef = it; }

  #pointsList = null;

  // private field reflection only
  __pointsList(it) { if (it === undefined) return this.#pointsList; else this.#pointsList = it; }

  #threadDebugRef = null;

  // private field reflection only
  __threadDebugRef(it) { if (it === undefined) return this.#threadDebugRef; else this.#threadDebugRef = it; }

  static make(lib,rec) {
    const $self = new Conn();
    Conn.make$($self,lib,rec);
    return $self;
  }

  static make$($self,lib,rec) {
    concurrent.Actor.makeCoalescing$($self, lib.connActorPool(), sys.ObjUtil.coerce(Conn.toCoalesceKey(), sys.Type.find("|sys::Obj?->sys::Obj?|?")), sys.ObjUtil.coerce(Conn.toCoalesce(), sys.Type.find("|sys::Obj?,sys::Obj?->sys::Obj?|?")));
    ;
    $self.#libRef = lib;
    $self.#idRef = rec.id();
    $self.#configRef = concurrent.AtomicRef.make(ConnConfig.make(lib, rec));
    $self.#traceRef = ConnTrace.make(lib.rt().libs().actorPool());
    $self.#pollModeRef = lib.model().pollMode();
    return;
  }

  start() {
    this.send(hx.HxMsg.make0("init"));
    this.sendLater(Conn.houseKeepingFreq(), Conn.houseKeepingMsg());
    return;
  }

  rt() {
    return this.#libRef.rt();
  }

  db() {
    return this.#libRef.rt().db();
  }

  lib() {
    return this.#libRef;
  }

  pointLib() {
    return this.#libRef.pointLib();
  }

  id() {
    return this.#idRef;
  }

  trace() {
    return this.#traceRef;
  }

  log() {
    return this.#libRef.log();
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("Conn [", this.id().toZinc()), "]");
  }

  dis() {
    return this.config().dis();
  }

  rec() {
    return this.config().rec();
  }

  isDisabled() {
    return this.config().isDisabled();
  }

  timeout() {
    return this.config().timeout();
  }

  openRetryFreq() {
    return this.config().openRetryFreq();
  }

  pingFreq() {
    return this.config().pingFreq();
  }

  linger() {
    return this.config().linger();
  }

  tuning() {
    return sys.ObjUtil.coerce(((this$) => { let $_u17 = this$.config().tuning(); if ($_u17 != null) return $_u17; return this$.lib().tuning(); })(this), ConnTuning.type$);
  }

  data() {
    return this.#dataRef.val();
  }

  setData(mgr,val) {
    this.#dataRef.val(val);
    return;
  }

  status() {
    return this.#vars.status();
  }

  state() {
    return this.#vars.state();
  }

  config() {
    return sys.ObjUtil.coerce(this.#configRef.val(), ConnConfig.type$);
  }

  setConfig(mgr,c) {
    this.#configRef.val(c);
    return;
  }

  points() {
    return sys.ObjUtil.coerce(this.#pointsList.val(), sys.Type.find("hxConn::ConnPoint[]"));
  }

  point(id,checked) {
    if (checked === undefined) checked = true;
    let pt = sys.ObjUtil.as(this.lib().roster().point(id, false), ConnPoint.type$);
    if ((pt != null && pt.conn() === this)) {
      return pt;
    }
    ;
    if (checked) {
      throw UnknownConnPointErr.make(sys.Str.plus("Connector point not found: ", id.toZinc()));
    }
    ;
    return null;
  }

  pointIds() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.points().map((p) => {
      return p.id();
    }, haystack.Ref.type$), sys.Type.find("haystack::Ref[]"));
  }

  pollMode() {
    return this.#pollModeRef;
  }

  pollFreq() {
    return this.config().pollFreq();
  }

  pollFreqEffective() {
    if (this.isDisabled()) {
      return 0;
    }
    ;
    if (this.pollMode() === ConnPollMode.buckets()) {
      return 100000000;
    }
    ;
    if ((this.pollMode() === ConnPollMode.manual() && this.pollFreq() != null)) {
      return this.pollFreq().ticks();
    }
    ;
    return 0;
  }

  pollBuckets() {
    return sys.ObjUtil.coerce(this.#pollBucketsRef.val(), sys.Type.find("hxConn::ConnPollBucket[]"));
  }

  setPollBuckets(mgr,b) {
    this.#pollBucketsRef.val(b);
    return;
  }

  isStopped() {
    return this.pool().isStopped();
  }

  sendSync(msg) {
    return this.send(msg).get(this.timeout());
  }

  ping() {
    return this.send(hx.HxMsg.make0("ping"));
  }

  close() {
    return this.send(hx.HxMsg.make0("close"));
  }

  syncCur(points) {
    return this.send(hx.HxMsg.make1("syncCur", points));
  }

  sync(timeout) {
    if (timeout === undefined) timeout = null;
    if (this.isStopped()) {
      return this;
    }
    ;
    this.send(hx.HxMsg.make0("sync")).get(timeout);
    return this;
  }

  forceHouseKeeping() {
    return this.send(hx.HxMsg.make0("forcehk"));
  }

  learnAsync(arg) {
    if (arg === undefined) arg = null;
    return this.lib().onLearn(this, arg);
  }

  receive(m) {
    let msg = sys.ObjUtil.coerce(m, hx.HxMsg.type$);
    let mgr = sys.ObjUtil.as(concurrent.Actor.locals().get("mgr"), ConnMgr.type$);
    if (mgr == null) {
      try {
        concurrent.Actor.locals().set("mgr", (mgr = ConnMgr.make(this, this.lib().model().dispatchType())));
      }
      catch ($_u18) {
        $_u18 = sys.Err.make($_u18);
        if ($_u18 instanceof sys.Err) {
          let e = $_u18;
          ;
          this.log().err(sys.Str.plus("Cannot initialize  ", this.lib().model().dispatchType()), e);
          throw e;
        }
        else {
          throw $_u18;
        }
      }
      ;
    }
    ;
    if (msg === Conn.pollMsg()) {
      this.onReceiveEnter(msg);
      try {
        mgr.onPoll();
      }
      catch ($_u19) {
        $_u19 = sys.Err.make($_u19);
        if ($_u19 instanceof sys.Err) {
          let e = $_u19;
          ;
          this.log().err("Conn.receive poll", e);
        }
        else {
          throw $_u19;
        }
      }
      finally {
        this.onReceiveExit();
      }
      ;
      return null;
    }
    ;
    if (msg === Conn.houseKeepingMsg()) {
      this.trace().write("hk", "houseKeeping", msg);
      try {
        mgr.onHouseKeeping();
      }
      catch ($_u20) {
        $_u20 = sys.Err.make($_u20);
        if ($_u20 instanceof sys.Err) {
          let e = $_u20;
          ;
          this.log().err("Conn.receive houseKeeping", e);
        }
        else {
          throw $_u20;
        }
      }
      ;
      if (this.isAlive()) {
        this.sendLater(Conn.houseKeepingFreq(), Conn.houseKeepingMsg());
      }
      ;
      return null;
    }
    ;
    try {
      this.onReceiveEnter(msg);
      this.trace().dispatch(msg);
      return mgr.onReceive(msg);
    }
    finally {
      this.onReceiveExit();
    }
    ;
  }

  onReceiveEnter(msg) {
    this.#threadDebugRef.val(ConnThreadDebug.make(msg));
    return;
  }

  onReceiveExit() {
    this.#threadDebugRef.val(null);
    return;
  }

  isAlive() {
    return this.#aliveRef.val();
  }

  kill() {
    this.#aliveRef.val(false);
    return;
  }

  updatePointsList(pts) {
    const this$ = this;
    this.#pointsList.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(pts.sort((a,b) => {
      return sys.ObjUtil.compare(a.dis(), b.dis());
    })), sys.Type.find("hxConn::ConnPoint[]")));
    return;
  }

  details() {
    let s = sys.StrBuf.make();
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("id:             ", this.id()), "\ndis:            "), this.dis()), "\nrt:             "), this.rt().platform().hostModel()), " ["), this.rt().version()), "]\nlib:            "), sys.ObjUtil.typeof(this.lib())), " ["), sys.ObjUtil.typeof(this.lib()).pod().version()), "]\ntimeout:        "), this.timeout()), "\nopenRetryFreq:  "), this.openRetryFreq()), "\npingFreq:       "), this.pingFreq()), "\nlinger:         "), this.linger()), "\ntuning:         "), this.tuning().rec().id().toZinc()), "\nnumPoints:      "), sys.ObjUtil.coerce(this.points().size(), sys.Obj.type$.toNullable())), "\ndata:           "), this.data()), "\npollMode:       "), this.pollMode()), "\n"));
    let $_u21 = this.pollMode();
    if (sys.ObjUtil.equals($_u21, ConnPollMode.manual())) {
      this.detailsPollManual(s);
    }
    else if (sys.ObjUtil.equals($_u21, ConnPollMode.buckets())) {
      this.detailsPollBuckets(s);
    }
    ;
    s.add("\n");
    this.#vars.details(s);
    s.add("\n");
    this.#committer.details(s);
    let extra = sys.Str.trim(this.lib().onConnDetails(this));
    if (!sys.Str.isEmpty(extra)) {
      s.add("\n").add(extra).add("\n");
    }
    ;
    s.add("\n");
    this.detailsThreadDebug(s, sys.ObjUtil.coerce(this.#threadDebugRef.val(), ConnThreadDebug.type$.toNullable()));
    s.add("\n");
    s.add(sys.Str.plus(sys.ObjUtil.typeof(this.lib()).name(), "."));
    sys.ObjUtil.trap(this.lib().connActorPool(),"dump", sys.List.make(sys.Obj.type$.toNullable(), [s.out()]));
    return s.toStr();
  }

  detailsThreadDebug(s,x) {
    if (x == null) {
      return s.add("currentMessage: none\n");
    }
    ;
    s.add("currentMessage:\n");
    s.add(sys.Str.plus(sys.Str.plus("  id:        ", x.msg().id()), "\n"));
    this.detailsMsgArg(s, "arg-a", x.msg().a());
    this.detailsMsgArg(s, "arg-b", x.msg().b());
    this.detailsMsgArg(s, "arg-c", x.msg().c());
    this.detailsMsgArg(s, "arg-d", x.msg().d());
    s.add(sys.Str.plus(sys.Str.plus("  dur:       ", x.dur()), "\n"));
    s.add(sys.Str.plus(sys.Str.plus("  threadId:  ", sys.ObjUtil.coerce(x.threadId(), sys.Obj.type$.toNullable())), "\n"));
    let stackTrace = hx.HxUtil.threadDump(x.threadId());
    s.add(stackTrace);
    while (sys.ObjUtil.equals(s.get(-1), 10)) {
      s.remove(-1);
    }
    ;
    return s.add("\n");
  }

  detailsMsgArg(s,name,arg) {
    if (arg == null) {
      return;
    }
    ;
    let str = "";
    try {
      (str = sys.ObjUtil.toStr(arg));
    }
    catch ($_u22) {
      $_u22 = sys.Err.make($_u22);
      if ($_u22 instanceof sys.Err) {
        let e = $_u22;
        ;
        (str = e.toStr());
      }
      else {
        throw $_u22;
      }
    }
    ;
    if (sys.ObjUtil.compareGT(sys.Str.size(str), 100)) {
      (str = sys.Str.plus(sys.Str.getRange(str, sys.Range.make(0, 99, true)), "..."));
    }
    ;
    s.add("  ").add(name).add(":     ").add(str).add("\n");
    return;
  }

  detailsPollManual(s) {
    s.add(sys.Str.plus(sys.Str.plus("pollFreq:       ", this.pollFreq()), "\n"));
    return;
  }

  detailsPollBuckets(s) {
    const this$ = this;
    s.add("pollBuckets:\n");
    this.pollBuckets().each((b) => {
      s.add("  ").add(b).add("\n");
      return;
    });
    return;
  }

  static static$init() {
    const this$ = this;
    Conn.#toCoalesceKey = sys.ObjUtil.coerce(((this$) => { let $_u23 = (msg) => {
      if (msg.id() === "write") {
        return sys.ObjUtil.coerce(msg.a(), ConnPoint.type$).id();
      }
      ;
      if (msg.id() === "poll") {
        return msg.id();
      }
      ;
      return null;
    }; if ($_u23 == null) return null; return sys.ObjUtil.toImmutable((msg) => {
      if (msg.id() === "write") {
        return sys.ObjUtil.coerce(msg.a(), ConnPoint.type$).id();
      }
      ;
      if (msg.id() === "poll") {
        return msg.id();
      }
      ;
      return null;
    }); })(this), sys.Type.find("|hx::HxMsg->sys::Obj?|"));
    Conn.#toCoalesce = sys.ObjUtil.coerce(((this$) => { let $_u24 = (a,b) => {
      return b;
    }; if ($_u24 == null) return null; return sys.ObjUtil.toImmutable((a,b) => {
      return b;
    }); })(this), sys.Type.find("|hx::HxMsg,hx::HxMsg->hx::HxMsg|"));
    Conn.#pollMsg = hx.HxMsg.make0("poll");
    Conn.#houseKeepingFreq = sys.Duration.fromStr("3sec");
    Conn.#houseKeepingMsg = hx.HxMsg.make0("houseKeeping");
    return;
  }

}

class ConnThreadDebug extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnThreadDebug.type$; }

  #ticks = 0;

  ticks() { return this.#ticks; }

  __ticks(it) { if (it === undefined) return this.#ticks; else this.#ticks = it; }

  #threadId = 0;

  threadId() { return this.#threadId; }

  __threadId(it) { if (it === undefined) return this.#threadId; else this.#threadId = it; }

  #msg = null;

  msg() { return this.#msg; }

  __msg(it) { if (it === undefined) return this.#msg; else this.#msg = it; }

  static make(msg) {
    const $self = new ConnThreadDebug();
    ConnThreadDebug.make$($self,msg);
    return $self;
  }

  static make$($self,msg) {
    $self.#msg = msg;
    $self.#ticks = sys.Duration.nowTicks();
    $self.#threadId = hx.HxUtil.threadId();
    return;
  }

  dur() {
    return sys.Duration.now().minus(sys.ObjUtil.coerce(sys.Duration.make(this.#ticks), sys.Duration.type$)).toLocale();
  }

}

class ConnConfig extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnConfig.type$; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #isDisabled = false;

  isDisabled() { return this.#isDisabled; }

  __isDisabled(it) { if (it === undefined) return this.#isDisabled; else this.#isDisabled = it; }

  #timeout = null;

  timeout() { return this.#timeout; }

  __timeout(it) { if (it === undefined) return this.#timeout; else this.#timeout = it; }

  #openRetryFreq = null;

  openRetryFreq() { return this.#openRetryFreq; }

  __openRetryFreq(it) { if (it === undefined) return this.#openRetryFreq; else this.#openRetryFreq = it; }

  #pingFreq = null;

  pingFreq() { return this.#pingFreq; }

  __pingFreq(it) { if (it === undefined) return this.#pingFreq; else this.#pingFreq = it; }

  #linger = null;

  linger() { return this.#linger; }

  __linger(it) { if (it === undefined) return this.#linger; else this.#linger = it; }

  #pollFreq = null;

  pollFreq() { return this.#pollFreq; }

  __pollFreq(it) { if (it === undefined) return this.#pollFreq; else this.#pollFreq = it; }

  #tuning = null;

  tuning() { return this.#tuning; }

  __tuning(it) { if (it === undefined) return this.#tuning; else this.#tuning = it; }

  static make(lib,rec) {
    const $self = new ConnConfig();
    ConnConfig.make$($self,lib,rec);
    return $self;
  }

  static make$($self,lib,rec) {
    let model = lib.model();
    $self.#rec = rec;
    $self.#dis = sys.ObjUtil.coerce(rec.dis(), sys.Str.type$);
    $self.#isDisabled = rec.has("disabled");
    $self.#timeout = haystack.Etc.dictGetDuration(rec, "actorTimeout", sys.Duration.fromStr("1min")).max(sys.Duration.fromStr("1sec"));
    $self.#openRetryFreq = haystack.Etc.dictGetDuration(rec, "connOpenRetryFreq", sys.Duration.fromStr("10sec")).max(sys.Duration.fromStr("1sec"));
    $self.#pingFreq = ((this$) => { let $_u25 = haystack.Etc.dictGetDuration(rec, "connPingFreq", null); if ($_u25 == null) return null; return haystack.Etc.dictGetDuration(rec, "connPingFreq", null).max(sys.Duration.fromStr("1sec")); })($self);
    $self.#linger = haystack.Etc.dictGetDuration(rec, "connLinger", sys.Duration.fromStr("30sec")).max(sys.Duration.fromStr("0ns"));
    $self.#tuning = lib.tunings().forRec(rec);
    if (model.pollFreqTag() != null) {
      $self.#pollFreq = haystack.Etc.dictGetDuration(rec, sys.ObjUtil.coerce(model.pollFreqTag(), sys.Str.type$), model.pollFreqDefault()).max(sys.Duration.fromStr("100ms"));
    }
    ;
    return;
  }

}

class ConnVars extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#statusRef = concurrent.AtomicRef.make(ConnStatus.unknown());
    this.#stateRef = concurrent.AtomicRef.make(ConnState.closed());
    this.#openPinsRef = concurrent.AtomicRef.make(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), sys.Type.find("[sys::Str:sys::Str]")));
    this.#lingerUntilRef = concurrent.AtomicInt.make();
    this.#lastPollRef = concurrent.AtomicInt.make();
    this.#lastPingRef = concurrent.AtomicInt.make();
    this.#lastOkRef = concurrent.AtomicInt.make();
    this.#lastErrRef = concurrent.AtomicInt.make();
    this.#errRef = concurrent.AtomicRef.make(null);
    return;
  }

  typeof() { return ConnVars.type$; }

  #statusRef = null;

  // private field reflection only
  __statusRef(it) { if (it === undefined) return this.#statusRef; else this.#statusRef = it; }

  #stateRef = null;

  // private field reflection only
  __stateRef(it) { if (it === undefined) return this.#stateRef; else this.#stateRef = it; }

  #openPinsRef = null;

  // private field reflection only
  __openPinsRef(it) { if (it === undefined) return this.#openPinsRef; else this.#openPinsRef = it; }

  #lingerUntilRef = null;

  // private field reflection only
  __lingerUntilRef(it) { if (it === undefined) return this.#lingerUntilRef; else this.#lingerUntilRef = it; }

  #lastPollRef = null;

  // private field reflection only
  __lastPollRef(it) { if (it === undefined) return this.#lastPollRef; else this.#lastPollRef = it; }

  #lastPingRef = null;

  // private field reflection only
  __lastPingRef(it) { if (it === undefined) return this.#lastPingRef; else this.#lastPingRef = it; }

  #lastOkRef = null;

  // private field reflection only
  __lastOkRef(it) { if (it === undefined) return this.#lastOkRef; else this.#lastOkRef = it; }

  #lastErrRef = null;

  // private field reflection only
  __lastErrRef(it) { if (it === undefined) return this.#lastErrRef; else this.#lastErrRef = it; }

  #errRef = null;

  // private field reflection only
  __errRef(it) { if (it === undefined) return this.#errRef; else this.#errRef = it; }

  status() {
    return sys.ObjUtil.coerce(this.#statusRef.val(), ConnStatus.type$);
  }

  state() {
    return sys.ObjUtil.coerce(this.#stateRef.val(), ConnState.type$);
  }

  openPins() {
    return sys.ObjUtil.coerce(this.#openPinsRef.val(), sys.Type.find("[sys::Str:sys::Str]"));
  }

  lingerUntil() {
    return this.#lingerUntilRef.val();
  }

  lastPoll() {
    return this.#lastPollRef.val();
  }

  lastPing() {
    return this.#lastPingRef.val();
  }

  lastOk() {
    return this.#lastOkRef.val();
  }

  lastErr() {
    return this.#lastErrRef.val();
  }

  lastAttempt() {
    return sys.Int.max(this.lastErr(), this.lastOk());
  }

  err() {
    return sys.ObjUtil.coerce(this.#errRef.val(), sys.Err.type$.toNullable());
  }

  openPin(app) {
    let pins = this.openPins();
    if (pins.containsKey(app)) {
      return false;
    }
    ;
    this.#openPinsRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(pins.dup().set(app, app)), sys.Type.find("[sys::Str:sys::Str]")));
    return true;
  }

  closePin(app) {
    const this$ = this;
    let pins = this.openPins();
    if (!pins.containsKey(app)) {
      return false;
    }
    ;
    this.#openPinsRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.ObjUtil.with(pins.dup(), (it) => {
      it.remove(app);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"))), sys.Type.find("[sys::Str:sys::Str]")));
    return true;
  }

  lingerExpired() {
    let deadline = this.lingerUntil();
    return (sys.ObjUtil.compareGT(deadline, 0) && sys.ObjUtil.compareLE(deadline, sys.Duration.nowTicks()));
  }

  setLinger(x) {
    this.#lingerUntilRef.val(sys.Int.max(this.lingerUntil(), sys.Int.plus(sys.Duration.nowTicks(), x.ticks())));
    return;
  }

  clearLinger() {
    this.#lingerUntilRef.val(0);
    return;
  }

  polled() {
    this.#lastPollRef.val(sys.Duration.nowTicks());
    return;
  }

  pinged() {
    this.#lastPingRef.val(sys.Duration.nowTicks());
    return;
  }

  resetStats() {
    this.#lingerUntilRef.val(0);
    this.#lastPollRef.val(0);
    this.#lastPingRef.val(0);
    this.#lastOkRef.val(0);
    this.#lastErrRef.val(0);
    return;
  }

  updateState(state) {
    this.#stateRef.val(state);
    return;
  }

  updateStatus(status,state) {
    this.#statusRef.val(status);
    this.#stateRef.val(state);
    return;
  }

  updateOk() {
    this.#lastOkRef.val(sys.Duration.nowTicks());
    this.#errRef.val(null);
    return;
  }

  updateErr(err) {
    this.#lastErrRef.val(sys.Duration.nowTicks());
    this.#errRef.val(err);
    return;
  }

  details(s) {
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("status          ", this.status()), "\nstate:          "), this.state()), "\nopenPins:       "), this.openPins().keys().sort()), "\nlingering:      "), this.detailsLinger()), "\nlastPoll:       "), haystack.Etc.debugDur(sys.ObjUtil.coerce(this.lastPoll(), sys.Obj.type$.toNullable()))), "\nlastPing:       "), haystack.Etc.debugDur(sys.ObjUtil.coerce(this.lastPing(), sys.Obj.type$.toNullable()))), "\nlastOk:         "), haystack.Etc.debugDur(sys.ObjUtil.coerce(this.lastOk(), sys.Obj.type$.toNullable()))), "\nlastErr         "), haystack.Etc.debugDur(sys.ObjUtil.coerce(this.lastErr(), sys.Obj.type$.toNullable()))), "\nerr:            "), haystack.Etc.debugErr(this.err())), "\n"));
    return;
  }

  detailsLinger() {
    return ((this$) => { if (sys.ObjUtil.compareLE(this$.lingerUntil(), 0)) return "na"; return haystack.Etc.debugDur(sys.ObjUtil.coerce(this$.lingerUntil(), sys.Obj.type$.toNullable())); })(this);
  }

  static make() {
    const $self = new ConnVars();
    ConnVars.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class ConnPointCurState extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnPointCurState.type$; }

  static #nil = undefined;

  static nil() {
    if (ConnPointCurState.#nil === undefined) {
      ConnPointCurState.static$init();
      if (ConnPointCurState.#nil === undefined) ConnPointCurState.#nil = null;
    }
    return ConnPointCurState.#nil;
  }

  #status = null;

  status() { return this.#status; }

  __status(it) { if (it === undefined) return this.#status; else this.#status = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  #raw = null;

  raw() { return this.#raw; }

  __raw(it) { if (it === undefined) return this.#raw; else this.#raw = it; }

  #err = null;

  err() { return this.#err; }

  __err(it) { if (it === undefined) return this.#err; else this.#err = it; }

  #lastUpdate = 0;

  lastUpdate() { return this.#lastUpdate; }

  __lastUpdate(it) { if (it === undefined) return this.#lastUpdate; else this.#lastUpdate = it; }

  #numUpdates = 0;

  numUpdates() { return this.#numUpdates; }

  __numUpdates(it) { if (it === undefined) return this.#numUpdates; else this.#numUpdates = it; }

  #quickPoll = false;

  quickPoll() { return this.#quickPoll; }

  __quickPoll(it) { if (it === undefined) return this.#quickPoll; else this.#quickPoll = it; }

  static updateOk(pt,val) {
    let raw = val;
    let old = pt.curState();
    try {
      if (pt.curConvert() != null) {
        (val = pt.curConvert().convert(pt.lib().pointLib(), pt.rec(), raw));
      }
      ;
      if (pt.curCalibration() != null) {
        (val = sys.ObjUtil.coerce(val, haystack.Number.type$).plus(sys.ObjUtil.coerce(pt.curCalibration(), haystack.Number.type$)));
      }
      ;
      if (pt.kind().isNumber()) {
        (val = hxPoint.PointUtil.applyUnit(pt.rec(), val, "updateCurOk"));
      }
      ;
      if (val != null) {
        let valKind = haystack.Kind.fromVal(val);
        if (valKind !== pt.kind()) {
          throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("curVal kind != configured kind: ", valKind), " != "), pt.kind()));
        }
        ;
      }
      ;
      return ConnPointCurState.makeOk(old, val, raw);
    }
    catch ($_u27) {
      $_u27 = sys.Err.make($_u27);
      if ($_u27 instanceof sys.Err) {
        let e = $_u27;
        ;
        return ConnPointCurState.makeErr(old, e, raw);
      }
      else {
        throw $_u27;
      }
    }
    ;
  }

  static updateErr(pt,err) {
    return ConnPointCurState.makeErr(pt.curState(), err, null);
  }

  static updateStale(pt) {
    return ConnPointCurState.makeStale(pt.curState());
  }

  static updateQuickPoll(pt,quickPoll) {
    let old = pt.curState();
    if (sys.ObjUtil.equals(old.#quickPoll, quickPoll)) {
      return old;
    }
    ;
    return ConnPointCurState.makeQuickPoll(old, quickPoll);
  }

  details(s,pt) {
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("curAddr:        ", pt.curAddr()), "\ncurStatus:      "), this.#status), "\ncurVal:         "), this.#val), " ["), ((this$) => { let $_u28 = this$.#val; if ($_u28 == null) return null; return sys.ObjUtil.typeof(this$.#val); })(this)), "]\ncurRaw:         "), this.#raw), " ["), ((this$) => { let $_u29 = this$.#raw; if ($_u29 == null) return null; return sys.ObjUtil.typeof(this$.#raw); })(this)), "]\ncurConvert:     "), pt.curConvert()), "\ncurCalibration: "), pt.curCalibration()), "\ncurLastUpdate:  "), haystack.Etc.debugDur(sys.ObjUtil.coerce(this.#lastUpdate, sys.Obj.type$.toNullable()))), "\ncurNumUpdate:   "), sys.ObjUtil.coerce(this.#numUpdates, sys.Obj.type$.toNullable())), "\ncurQuickPoll:   "), sys.ObjUtil.coerce(this.#quickPoll, sys.Obj.type$.toNullable())), "\ncurErr:         "), haystack.Etc.debugErr(this.#err)), "\n"));
    return;
  }

  static makeNil() {
    const $self = new ConnPointCurState();
    ConnPointCurState.makeNil$($self);
    return $self;
  }

  static makeNil$($self) {
    $self.#status = ConnStatus.unknown();
    return;
  }

  static makeOk(old,val,raw) {
    const $self = new ConnPointCurState();
    ConnPointCurState.makeOk$($self,old,val,raw);
    return $self;
  }

  static makeOk$($self,old,val,raw) {
    $self.#status = ConnStatus.ok();
    $self.#lastUpdate = sys.Duration.nowTicks();
    $self.#numUpdates = sys.Int.plus(old.#numUpdates, 1);
    $self.#val = ((this$) => { let $_u30 = val; if ($_u30 == null) return null; return sys.ObjUtil.toImmutable(val); })($self);
    $self.#raw = ((this$) => { let $_u31 = raw; if ($_u31 == null) return null; return sys.ObjUtil.toImmutable(raw); })($self);
    $self.#quickPoll = old.#quickPoll;
    return;
  }

  static makeErr(old,err,raw) {
    const $self = new ConnPointCurState();
    ConnPointCurState.makeErr$($self,old,err,raw);
    return $self;
  }

  static makeErr$($self,old,err,raw) {
    $self.#status = ConnStatus.fromErr(err);
    $self.#err = err;
    $self.#lastUpdate = sys.Duration.nowTicks();
    $self.#numUpdates = sys.Int.plus(old.#numUpdates, 1);
    $self.#raw = ((this$) => { let $_u32 = raw; if ($_u32 == null) return null; return sys.ObjUtil.toImmutable(raw); })($self);
    $self.#quickPoll = old.#quickPoll;
    return;
  }

  static makeStale(old) {
    const $self = new ConnPointCurState();
    ConnPointCurState.makeStale$($self,old);
    return $self;
  }

  static makeStale$($self,old) {
    $self.#status = ConnStatus.stale();
    $self.#lastUpdate = old.#lastUpdate;
    $self.#numUpdates = old.#numUpdates;
    $self.#val = ((this$) => { let $_u33 = old.#val; if ($_u33 == null) return null; return sys.ObjUtil.toImmutable(old.#val); })($self);
    $self.#raw = ((this$) => { let $_u34 = old.#raw; if ($_u34 == null) return null; return sys.ObjUtil.toImmutable(old.#raw); })($self);
    $self.#quickPoll = old.#quickPoll;
    return;
  }

  static makeQuickPoll(old,quickPoll) {
    const $self = new ConnPointCurState();
    ConnPointCurState.makeQuickPoll$($self,old,quickPoll);
    return $self;
  }

  static makeQuickPoll$($self,old,quickPoll) {
    $self.#status = old.#status;
    $self.#lastUpdate = old.#lastUpdate;
    $self.#numUpdates = old.#numUpdates;
    $self.#val = ((this$) => { let $_u35 = old.#val; if ($_u35 == null) return null; return sys.ObjUtil.toImmutable(old.#val); })($self);
    $self.#raw = ((this$) => { let $_u36 = old.#raw; if ($_u36 == null) return null; return sys.ObjUtil.toImmutable(old.#raw); })($self);
    $self.#quickPoll = quickPoll;
    return;
  }

  static static$init() {
    ConnPointCurState.#nil = ConnPointCurState.makeNil();
    return;
  }

}

class ConnUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnUtil.type$; }

  static #levels = undefined;

  static levels() {
    if (ConnUtil.#levels === undefined) {
      ConnUtil.static$init();
      if (ConnUtil.#levels === undefined) ConnUtil.#levels = null;
    }
    return ConnUtil.#levels;
  }

  static levelToNumber(level) {
    return ConnUtil.levels().get(level);
  }

  static eachConnInPointIds(rt,points,f) {
    const this$ = this;
    if (points.isEmpty()) {
      return;
    }
    ;
    let sameConn = true;
    points.each((pt) => {
      if (points.first().conn() !== pt.conn()) {
        (sameConn = false);
      }
      ;
      return;
    });
    if (sameConn) {
      sys.Func.call(f, points.first().conn(), points);
      return;
    }
    ;
    let connsById = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("hxConn::Conn"));
    points.each((pt) => {
      connsById.set(pt.conn().id(), pt.conn());
      return;
    });
    connsById.each((conn) => {
      let pointsForConn = points.findAll((pt) => {
        return pt.conn() === conn;
      });
      sys.Func.call(f, pointsForConn.first().conn(), pointsForConn);
      return;
    });
    return;
  }

  static make() {
    const $self = new ConnUtil();
    ConnUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    const this$ = this;
    if (true) {
      let acc = sys.List.make(haystack.Number.type$);
      sys.Int.times(18, (i) => {
        acc.add(sys.ObjUtil.coerce(haystack.Number.makeInt(i), haystack.Number.type$));
        return;
      });
      ConnUtil.#levels = sys.ObjUtil.coerce(((this$) => { let $_u37 = acc; if ($_u37 == null) return null; return sys.ObjUtil.toImmutable(acc); })(this), sys.Type.find("haystack::Number[]"));
    }
    ;
    return;
  }

}

class ConnPoller extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnPoller.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  static #checkFreq = undefined;

  static checkFreq() {
    if (ConnPoller.#checkFreq === undefined) {
      ConnPoller.static$init();
      if (ConnPoller.#checkFreq === undefined) ConnPoller.#checkFreq = null;
    }
    return ConnPoller.#checkFreq;
  }

  static #checkMsg = undefined;

  static checkMsg() {
    if (ConnPoller.#checkMsg === undefined) {
      ConnPoller.static$init();
      if (ConnPoller.#checkMsg === undefined) ConnPoller.#checkMsg = null;
    }
    return ConnPoller.#checkMsg;
  }

  static make(lib) {
    const $self = new ConnPoller();
    ConnPoller.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    concurrent.Actor.make$($self, lib.rt().libs().actorPool());
    $self.#lib = lib;
    return;
  }

  onStart() {
    this.send(ConnPoller.checkMsg());
    return;
  }

  receive(msg) {
    if (msg !== ConnPoller.checkMsg()) {
      return null;
    }
    ;
    try {
      this.check();
    }
    catch ($_u38) {
      $_u38 = sys.Err.make($_u38);
      if ($_u38 instanceof sys.Err) {
        let e = $_u38;
        ;
        if (this.#lib.isRunning()) {
          this.#lib.log().err("ConnPoller.receive", e);
        }
        ;
      }
      else {
        throw $_u38;
      }
    }
    ;
    if (this.#lib.isRunning()) {
      this.sendLater(ConnPoller.checkFreq(), ConnPoller.checkMsg());
    }
    ;
    return null;
  }

  check() {
    const this$ = this;
    let now = sys.Duration.nowTicks();
    this.#lib.conns().each((conn) => {
      let pollNext = conn.pollNext().val();
      if (sys.ObjUtil.compareGT(pollNext, now)) {
        return;
      }
      ;
      let freq = conn.pollFreqEffective();
      if (sys.ObjUtil.compareLE(freq, 0)) {
        return;
      }
      ;
      if (sys.ObjUtil.equals(pollNext, 0)) {
        conn.pollNext().val(sys.Int.plus(now, ConnPoller.pollInitStaggerConn(conn)));
        return;
      }
      ;
      (now = sys.Duration.nowTicks());
      conn.pollNext().val(sys.Int.plus(now, freq));
      conn.send(Conn.pollMsg());
      return;
    });
    return;
  }

  static pollInitStaggerConn(conn) {
    return ConnPoller.pollInitStagger(sys.ObjUtil.coerce(((this$) => { let $_u39 = conn.pollFreq(); if ($_u39 != null) return $_u39; return sys.Duration.fromStr("10sec"); })(this), sys.Duration.type$));
  }

  static pollInitStaggerBucket(tuning) {
    return ConnPoller.pollInitStagger(tuning.pollTime());
  }

  static pollInitStagger(pollTime) {
    return sys.Int.div(sys.Int.mult(pollTime.ticks(), sys.Range.make(0, 100).random()), 100);
  }

  static static$init() {
    ConnPoller.#checkFreq = sys.Duration.fromStr("10ms");
    ConnPoller.#checkMsg = "check!";
    return;
  }

}

class ConnPollMode extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnPollMode.type$; }

  static disabled() { return ConnPollMode.vals().get(0); }

  static manual() { return ConnPollMode.vals().get(1); }

  static buckets() { return ConnPollMode.vals().get(2); }

  static #vals = undefined;

  isEnabled() {
    return this !== ConnPollMode.disabled();
  }

  static make($ordinal,$name) {
    const $self = new ConnPollMode();
    ConnPollMode.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(ConnPollMode.type$, ConnPollMode.vals(), name$, checked);
  }

  static vals() {
    if (ConnPollMode.#vals == null) {
      ConnPollMode.#vals = sys.List.make(ConnPollMode.type$, [
        ConnPollMode.make(0, "disabled", ),
        ConnPollMode.make(1, "manual", ),
        ConnPollMode.make(2, "buckets", ),
      ]).toImmutable();
    }
    return ConnPollMode.#vals;
  }

  static static$init() {
    const $_u40 = ConnPollMode.vals();
    if (true) {
    }
    ;
    return;
  }

}

class ConnPollBucket extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnPollBucket.type$; }

  #conn = null;

  conn() { return this.#conn; }

  __conn(it) { if (it === undefined) return this.#conn; else this.#conn = it; }

  #tuning = null;

  tuning() { return this.#tuning; }

  __tuning(it) { if (it === undefined) return this.#tuning; else this.#tuning = it; }

  #state = null;

  state() { return this.#state; }

  __state(it) { if (it === undefined) return this.#state; else this.#state = it; }

  #points = null;

  points() { return this.#points; }

  __points(it) { if (it === undefined) return this.#points; else this.#points = it; }

  static make(conn,tuning,state,points) {
    const $self = new ConnPollBucket();
    ConnPollBucket.make$($self,conn,tuning,state,points);
    return $self;
  }

  static make$($self,conn,tuning,state,points) {
    $self.#conn = conn;
    $self.#tuning = tuning;
    $self.#state = state;
    $self.#points = sys.ObjUtil.coerce(((this$) => { let $_u41 = points; if ($_u41 == null) return null; return sys.ObjUtil.toImmutable(points); })($self), sys.Type.find("hxConn::ConnPoint[]"));
    return;
  }

  pollTime() {
    return this.#tuning.pollTime();
  }

  nextPoll() {
    return this.#state.nextPoll().val();
  }

  updateNextPoll(startTicks) {
    let lastPoll = sys.Duration.nowTicks();
    let lastDur = sys.Int.minus(lastPoll, startTicks);
    this.#state.lastPoll().val(lastPoll);
    this.#state.lastDur().val(lastDur);
    this.#state.nextPoll().val(sys.Int.plus(lastPoll, this.pollTime().ticks()));
    this.#state.numPolls().increment();
    this.#state.totalDur().add(lastDur);
    return;
  }

  compare(that) {
    return sys.ObjUtil.compare(this.#tuning.pollTime(), sys.ObjUtil.coerce(that, ConnPollBucket.type$).#tuning.pollTime());
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#tuning.dis()), " ["), this.#tuning.pollTime()), ", "), sys.ObjUtil.coerce(this.#points.size(), sys.Obj.type$.toNullable())), " points] "), this.#state);
  }

}

class ConnPollBucketState extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nextPoll = concurrent.AtomicInt.make();
    this.#lastPoll = concurrent.AtomicInt.make();
    this.#numPolls = concurrent.AtomicInt.make();
    this.#lastDur = concurrent.AtomicInt.make();
    this.#totalDur = concurrent.AtomicInt.make();
    return;
  }

  typeof() { return ConnPollBucketState.type$; }

  #nextPoll = null;

  nextPoll() { return this.#nextPoll; }

  __nextPoll(it) { if (it === undefined) return this.#nextPoll; else this.#nextPoll = it; }

  #lastPoll = null;

  lastPoll() { return this.#lastPoll; }

  __lastPoll(it) { if (it === undefined) return this.#lastPoll; else this.#lastPoll = it; }

  #numPolls = null;

  numPolls() { return this.#numPolls; }

  __numPolls(it) { if (it === undefined) return this.#numPolls; else this.#numPolls = it; }

  #lastDur = null;

  lastDur() { return this.#lastDur; }

  __lastDur(it) { if (it === undefined) return this.#lastDur; else this.#lastDur = it; }

  #totalDur = null;

  totalDur() { return this.#totalDur; }

  __totalDur(it) { if (it === undefined) return this.#totalDur; else this.#totalDur = it; }

  static make(tuning) {
    const $self = new ConnPollBucketState();
    ConnPollBucketState.make$($self,tuning);
    return $self;
  }

  static make$($self,tuning) {
    ;
    $self.#nextPoll.val(sys.Int.plus(sys.Duration.nowTicks(), ConnPoller.pollInitStaggerBucket(tuning)));
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("nextPoll: ", haystack.Etc.debugDur(sys.ObjUtil.coerce(this.#nextPoll.val(), sys.Obj.type$.toNullable()))), ", lastPoll: "), haystack.Etc.debugDur(sys.ObjUtil.coerce(this.#lastPoll.val(), sys.Obj.type$.toNullable()))), ", lastDur: "), sys.Duration.make(this.#lastDur.val()).toLocale()), ", # polls: "), sys.ObjUtil.coerce(this.#numPolls.val(), sys.Obj.type$.toNullable())), ", avgPoll: "), ((this$) => { if (sys.ObjUtil.equals(this$.#numPolls.val(), 0)) return "n/a"; return sys.Duration.make(sys.Int.div(this$.#totalDur.val(), this$.#numPolls.val())).toLocale(); })(this));
  }

}

class ConnFwFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnFwFuncs.type$; }

  static connPoints(conn,checked) {
    if (checked === undefined) checked = true;
    let cx = ConnFwFuncs.curContext();
    let id = haystack.Etc.toId(conn);
    let c = cx.rt().conn().conn(id, false);
    if (!sys.ObjUtil.is(c, Conn.type$)) {
      if (!checked) {
        return sys.ObjUtil.coerce(haystack.Dict.type$.emptyList(), sys.Type.find("haystack::Dict[]"));
      }
      ;
      if (c == null) {
        throw UnknownConnErr.make(id.toZinc());
      }
      ;
      throw ConnFwFuncs.classicConnErr(sys.ObjUtil.coerce(c, hx.HxConn.type$));
    }
    ;
    return cx.db().readByIdsList(sys.ObjUtil.coerce(c, Conn.type$).pointIds());
  }

  static connPing(conn) {
    return ConnFwFuncs.toHxConn(conn).ping();
  }

  static connClose(conn) {
    return ConnFwFuncs.toHxConn(conn).close();
  }

  static connLearn(conn,arg) {
    if (arg === undefined) arg = null;
    return ConnFwFuncs.toHxConn(conn).learnAsync(arg);
  }

  static connSyncCur(points) {
    const this$ = this;
    let cx = ConnFwFuncs.curContext();
    let futures = sys.List.make(concurrent.Future.type$);
    let connPoints = ConnFwFuncs.toPoints(points, cx);
    ConnUtil.eachConnInPointIds(cx.rt(), connPoints, (c,pts) => {
      futures.add(c.syncCur(pts));
      return;
    });
    return futures;
  }

  static connSyncHis(points,span) {
    if (span === undefined) span = null;
    let cx = ConnFwFuncs.curContext();
    let connPoints = ConnFwFuncs.toPoints(points, cx);
    return ConnSyncHis.make(cx, connPoints, span).run();
  }

  static connDetails(obj) {
    if (sys.ObjUtil.is(obj, sys.Type.find("sys::List"))) {
      return ConnFwFuncs.connDetails(sys.ObjUtil.coerce(obj, sys.Type.find("sys::List")).get(0));
    }
    ;
    if (sys.ObjUtil.is(obj, ConnPoint.type$)) {
      return sys.ObjUtil.coerce(obj, ConnPoint.type$).details();
    }
    ;
    let cx = ConnFwFuncs.curContext();
    let id = haystack.Etc.toId(obj);
    return sys.ObjUtil.coerce(((this$) => { let $_u43 = ((this$) => { let $_u44 = cx.rt().conn().point(id, false); if ($_u44 == null) return null; return cx.rt().conn().point(id, false).details(); })(this$); if ($_u43 != null) return $_u43; return cx.rt().conn().conn(id).details(); })(this), sys.Obj.type$);
  }

  static connPointsVia(points,libOrConn) {
    const this$ = this;
    let cx = ConnFwFuncs.curContext();
    let pointIds = haystack.Etc.toIds(points);
    if (sys.ObjUtil.is(libOrConn, sys.Str.type$)) {
      let lib = sys.ObjUtil.coerce(cx.rt().lib(sys.ObjUtil.coerce(libOrConn, sys.Str.type$)), ConnLib.type$);
      return pointIds.map((id) => {
        return sys.ObjUtil.coerce(lib.point(id), ConnPoint.type$);
      }, ConnPoint.type$);
    }
    ;
    let conn = ConnFwFuncs.toConn(libOrConn);
    return pointIds.map((id) => {
      return sys.ObjUtil.coerce(conn.point(id), ConnPoint.type$);
    }, ConnPoint.type$);
  }

  static toPoints(points,cx) {
    const this$ = this;
    if (sys.ObjUtil.is(points, ConnPoint.type$)) {
      return sys.List.make(ConnPoint.type$, [sys.ObjUtil.coerce(points, ConnPoint.type$)]);
    }
    ;
    if (sys.ObjUtil.is(points, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(points, sys.Type.find("sys::List")).map((x) => {
        if (sys.ObjUtil.is(x, ConnPoint.type$)) {
          return sys.ObjUtil.coerce(x, ConnPoint.type$);
        }
        ;
        return sys.ObjUtil.coerce(cx.rt().conn().point(haystack.Etc.toId(x)), ConnPoint.type$);
      }, ConnPoint.type$), sys.Type.find("hxConn::ConnPoint[]"));
    }
    ;
    return sys.ObjUtil.coerce(haystack.Etc.toIds(points).map((id) => {
      return sys.ObjUtil.coerce(cx.rt().conn().point(id), ConnPoint.type$);
    }, ConnPoint.type$), sys.Type.find("hxConn::ConnPoint[]"));
  }

  static connTraceIsEnabled(conn) {
    return ConnFwFuncs.toConn(conn).trace().isEnabled();
  }

  static connTraceEnable(conn) {
    ConnFwFuncs.toConn(conn).trace().enable();
    return;
  }

  static connTraceDisable(conn) {
    ConnFwFuncs.toConn(conn).trace().disable();
    return;
  }

  static connTraceClear(conn) {
    ConnFwFuncs.toConn(conn).trace().clear();
    return;
  }

  static connTraceDisableAll() {
    const this$ = this;
    ConnFwFuncs.curContext().rt().conn().conns().each(($hx) => {
      let c = sys.ObjUtil.as($hx, Conn.type$);
      if (c != null) {
        c.trace().disable();
      }
      ;
      return;
    });
    return;
  }

  static connTrace(conn,opts) {
    if (opts === undefined) opts = null;
    let cx = hx.HxContext.curHx();
    let id = haystack.Etc.toId(conn);
    if (id.isNull()) {
      return haystack.Etc.emptyGrid();
    }
    ;
    let c = ConnFwFuncs.toConn(id);
    let meta = sys.Map.__fromLiteral(["conn","enabled","icon"], [c.rec(),sys.ObjUtil.coerce(c.trace().isEnabled(), sys.Obj.type$),c.lib().icon()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let list = c.trace().read();
    if (cx.feedIsEnabled()) {
      let ts = ((this$) => { let $_u45 = ((this$) => { let $_u46=list.last(); return ($_u46==null) ? null : $_u46.ts(); })(this$); if ($_u45 != null) return $_u45; return sys.DateTime.now(); })(this);
      cx.feedAdd(ConnTraceFeed.make(sys.ObjUtil.coerce(cx, hx.HxContext.type$), c.trace(), sys.ObjUtil.coerce(ts, sys.DateTime.type$), opts), meta);
    }
    ;
    (list = ConnTraceMsg.applyOpts(list, opts));
    return ConnTraceMsg.toGrid(list, meta);
  }

  static connPointsInWatch(conn) {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(ConnFwFuncs.toConn(conn).send(hx.HxMsg.make0("inWatch")).get(null), sys.Type.find("hxConn::ConnPoint[]")).map((pt) => {
      return pt.rec();
    }, haystack.Dict.type$), sys.Type.find("haystack::Dict[]"));
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static toHxConn(conn) {
    return sys.ObjUtil.coerce(ConnFwFuncs.curContext().rt().conn().conn(haystack.Etc.toId(conn), true), hx.HxConn.type$);
  }

  static toConn(conn) {
    let $hx = ConnFwFuncs.toHxConn(conn);
    return sys.ObjUtil.coerce(((this$) => { let $_u47 = sys.ObjUtil.as($hx, Conn.type$); if ($_u47 != null) return $_u47; throw ConnFwFuncs.classicConnErr($hx); })(this), Conn.type$);
  }

  static classicConnErr(c) {
    return sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", c.lib().name()), " connector uses classic framework ["), c.rec().dis()), "]"));
  }

  static make() {
    const $self = new ConnFwFuncs();
    ConnFwFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ConnCommitter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#managedRef = concurrent.AtomicRef.make(haystack.Etc.emptyDict());
    return;
  }

  typeof() { return ConnCommitter.type$; }

  #managedRef = null;

  // private field reflection only
  __managedRef(it) { if (it === undefined) return this.#managedRef; else this.#managedRef = it; }

  managed() {
    return sys.ObjUtil.coerce(this.#managedRef.val(), haystack.Dict.type$);
  }

  commit1(lib,rec,n0,v0) {
    let m = this.managed();
    if (sys.ObjUtil.equals(m.get(n0), v0)) {
      return;
    }
    ;
    let changes = haystack.Etc.makeDict1(n0, ((this$) => { let $_u48 = v0; if ($_u48 != null) return $_u48; return haystack.Remove.val(); })(this));
    this.commit(lib, rec, changes);
    return;
  }

  commit2(lib,rec,n0,v0,n1,v1) {
    let m = this.managed();
    if ((sys.ObjUtil.equals(m.get(n0), v0) && sys.ObjUtil.equals(m.get(n1), v1))) {
      return;
    }
    ;
    let changes = haystack.Etc.makeDict2(n0, ((this$) => { let $_u49 = v0; if ($_u49 != null) return $_u49; return haystack.Remove.val(); })(this), n1, ((this$) => { let $_u50 = v1; if ($_u50 != null) return $_u50; return haystack.Remove.val(); })(this));
    this.commit(lib, rec, changes);
    return;
  }

  commit3(lib,rec,n0,v0,n1,v1,n2,v2) {
    let m = this.managed();
    if ((sys.ObjUtil.equals(m.get(n0), v0) && sys.ObjUtil.equals(m.get(n1), v1) && sys.ObjUtil.equals(m.get(n2), v2))) {
      return;
    }
    ;
    let changes = haystack.Etc.makeDict3(n0, ((this$) => { let $_u51 = v0; if ($_u51 != null) return $_u51; return haystack.Remove.val(); })(this), n1, ((this$) => { let $_u52 = v1; if ($_u52 != null) return $_u52; return haystack.Remove.val(); })(this), n2, ((this$) => { let $_u53 = v2; if ($_u53 != null) return $_u53; return haystack.Remove.val(); })(this));
    this.commit(lib, rec, changes);
    return;
  }

  commit(lib,rec,changes) {
    const this$ = this;
    let acc = haystack.Etc.dictToMap(this.managed());
    changes.each((v,n) => {
      if (v === haystack.Remove.val()) {
        acc.remove(n);
      }
      else {
        acc.set(n, v);
      }
      ;
      return;
    });
    this.#managedRef.val(haystack.Etc.makeDict(acc));
    try {
      lib.rt().db().commit(folio.Diff.make(rec, changes, folio.Diff.forceTransient()));
    }
    catch ($_u54) {
      $_u54 = sys.Err.make($_u54);
      if ($_u54 instanceof folio.ShutdownErr) {
        let e = $_u54;
        ;
      }
      else if ($_u54 instanceof sys.Err) {
        let e = $_u54;
        ;
        let newRec = lib.rt().db().readById(rec.id(), false);
        if ((newRec == null || newRec.has("trash"))) {
          return;
        }
        ;
        throw e;
      }
      else {
        throw $_u54;
      }
    }
    ;
    return;
  }

  details(s) {
    const this$ = this;
    let m = this.managed();
    haystack.Etc.dictNames(m).sort().each((n) => {
      s.add(sys.Str.padr(sys.Str.plus(sys.Str.plus("", n), ":"), 16)).add(m.get(n)).add("\n");
      return;
    });
    return;
  }

  static make() {
    const $self = new ConnCommitter();
    ConnCommitter.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class ConnFwLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
    this.#service = ConnService.make(this);
    this.#tunings = ConnTuningRoster.make();
    return;
  }

  typeof() { return ConnFwLib.type$; }

  #service = null;

  service() { return this.#service; }

  __service(it) { if (it === undefined) return this.#service; else this.#service = it; }

  #tunings = null;

  tunings() { return this.#tunings; }

  __tunings(it) { if (it === undefined) return this.#tunings; else this.#tunings = it; }

  services() {
    return sys.List.make(ConnService.type$, [this.#service]);
  }

  onStart() {
    this.observe("obsCommits", haystack.Etc.makeDict(sys.Map.__fromLiteral(["obsAdds","obsUpdates","obsRemoves","obsAddOnInit","syncable","obsFilter"], [haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),"connTuning"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))), ConnFwLib.type$.slot("onConnTuningEvent"));
    return;
  }

  onConnTuningEvent(e) {
    this.#tunings.onEvent(e);
    return;
  }

  static make() {
    const $self = new ConnFwLib();
    ConnFwLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    ;
    return;
  }

}

class ConnRoster extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#connsList = concurrent.AtomicRef.make(Conn.type$.emptyList());
    this.#connsById = concurrent.ConcurrentMap.make();
    this.#pointsById = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return ConnRoster.type$; }

  #lib = null;

  // private field reflection only
  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #connsList = null;

  // private field reflection only
  __connsList(it) { if (it === undefined) return this.#connsList; else this.#connsList = it; }

  #connsById = null;

  // private field reflection only
  __connsById(it) { if (it === undefined) return this.#connsById; else this.#connsById = it; }

  #pointsById = null;

  // private field reflection only
  __pointsById(it) { if (it === undefined) return this.#pointsById; else this.#pointsById = it; }

  static make(lib) {
    const $self = new ConnRoster();
    ConnRoster.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    ;
    $self.#lib = lib;
    return;
  }

  numConns() {
    return this.#connsById.size();
  }

  conns() {
    return sys.ObjUtil.coerce(this.#connsList.val(), sys.Type.find("hxConn::Conn[]"));
  }

  conn(id,checked) {
    if (checked === undefined) checked = true;
    let conn = this.#connsById.get(id);
    if (conn != null) {
      return sys.ObjUtil.coerce(conn, Conn.type$.toNullable());
    }
    ;
    if (checked) {
      throw UnknownConnErr.make(sys.Str.plus("Connector not found: ", id.toZinc()));
    }
    ;
    return null;
  }

  points() {
    return sys.ObjUtil.coerce(this.#pointsById.vals(ConnPoint.type$), sys.Type.find("hxConn::ConnPoint[]"));
  }

  point(id,checked) {
    if (checked === undefined) checked = true;
    let pt = this.#pointsById.get(id);
    if (pt != null) {
      return sys.ObjUtil.coerce(pt, ConnPoint.type$.toNullable());
    }
    ;
    if (checked) {
      throw UnknownConnPointErr.make(sys.Str.plus("Connector point not found: ", id.toZinc()));
    }
    ;
    return null;
  }

  start(model) {
    this.initConns();
    this.#lib.observe("obsCommits", haystack.Etc.makeDict(sys.Map.__fromLiteral(["obsAdds","obsUpdates","obsRemoves","syncable","obsFilter"], [haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),model.connTag()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))), ConnLib.type$.slot("onConnEvent"));
    this.#lib.observe("obsCommits", haystack.Etc.makeDict(sys.Map.__fromLiteral(["obsAdds","obsUpdates","obsRemoves","syncable","obsFilter"], [haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),sys.Str.plus("point and ", model.connRefTag())], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))), ConnLib.type$.slot("onPointEvent"));
    if (model.hasCur()) {
      this.#lib.observe("obsWatches", haystack.Etc.makeDict(sys.Map.__fromLiteral(["obsFilter"], [sys.Str.plus("point and ", model.connRefTag())], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))), ConnLib.type$.slot("onPointWatch"));
    }
    ;
    if (model.hasWrite()) {
      this.#lib.observe("obsPointWrites", haystack.Etc.makeDict1("obsFilter", model.connRefTag()), ConnLib.type$.slot("onPointWrite"));
    }
    ;
    return;
  }

  initConns() {
    const this$ = this;
    let filter = haystack.Filter.has(this.#lib.model().connTag());
    this.#lib.rt().db().readAllEach(filter, haystack.Etc.emptyDict(), (rec) => {
      this$.onConnAdded(rec);
      return;
    });
    return;
  }

  onConnEvent(e) {
    if (e.isAdded()) {
      this.onConnAdded(e.newRec());
    }
    else {
      if (e.isUpdated()) {
        this.onConnUpdated(sys.ObjUtil.coerce(this.conn(e.id()), Conn.type$), e);
      }
      else {
        if (e.isRemoved()) {
          this.onConnRemoved(sys.ObjUtil.coerce(this.conn(e.id()), Conn.type$));
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  onConnAdded(rec) {
    const this$ = this;
    let conn = Conn.make(this.#lib, rec);
    let service = this.#lib.fw().service();
    this.#connsById.add(conn.id(), conn);
    this.updateConnsList();
    service.addConn(conn);
    let filter = haystack.Filter.has("point").and(haystack.Filter.eq(this.#lib.model().connRefTag(), conn.id()));
    let pointsList = sys.List.make(ConnPoint.type$);
    this.#lib.rt().db().readAllEach(filter, haystack.Etc.emptyDict(), (pointRec) => {
      let point = ConnPoint.make(conn, pointRec);
      pointsList.add(point);
      this$.#pointsById.add(point.id(), point);
      service.addPoint(point);
      return;
    });
    conn.updatePointsList(pointsList);
    conn.start();
    return;
  }

  onConnUpdated(conn,e) {
    conn.send(hx.HxMsg.make1("connUpdated", e.newRec()));
    return;
  }

  onConnRemoved(conn) {
    const this$ = this;
    conn.send(hx.HxMsg.make0("connRemoved"));
    conn.kill();
    let service = this.#lib.fw().service();
    conn.points().each((pt) => {
      service.removePoint(pt);
      this$.#pointsById.remove(pt.id());
      return;
    });
    service.removeConn(conn);
    this.#connsById.remove(conn.id());
    this.updateConnsList();
    return;
  }

  updateConnsList() {
    const this$ = this;
    let list = this.#connsById.vals(Conn.type$);
    if (sys.ObjUtil.compareGT(list.size(), 1)) {
      haystack.Etc.sortDis(list, sys.ObjUtil.coerce((c) => {
        return c.dis();
      }, sys.Type.find("|sys::Obj->sys::Str|?")));
    }
    ;
    this.#connsList.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(list), sys.Type.find("sys::Obj[]")));
    return;
  }

  onPointEvent(e) {
    if (e.isAdded()) {
      this.onPointAdded(e.newRec());
    }
    else {
      if (e.isUpdated()) {
        this.onPointUpdated(e);
      }
      else {
        if (e.isRemoved()) {
          this.onPointRemoved(e.id());
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  onPointAdded(rec) {
    let id = rec.id();
    let connRef = this.pointConnRef(rec);
    let conn = this.conn(connRef, false);
    if (conn == null) {
      return;
    }
    ;
    let point = conn.point(id, false);
    if (point != null) {
      return;
    }
    ;
    (point = ConnPoint.make(sys.ObjUtil.coerce(conn, Conn.type$), rec));
    this.#pointsById.add(point.id(), sys.ObjUtil.coerce(point, sys.Obj.type$));
    this.updateConnPoints(sys.ObjUtil.coerce(conn, Conn.type$));
    this.#lib.fw().service().addPoint(sys.ObjUtil.coerce(point, hx.HxConnPoint.type$));
    conn.send(hx.HxMsg.make1("pointAdded", point));
    return;
  }

  onPointUpdated(e) {
    let id = e.id();
    let rec = e.newRec();
    let point = this.point(id, false);
    if (point == null) {
      this.onPointAdded(rec);
      return;
    }
    ;
    let connRef = this.pointConnRef(rec);
    if (sys.ObjUtil.compareNE(point.conn().id(), connRef)) {
      this.onPointRemoved(id);
      this.onPointAdded(rec);
      return;
    }
    ;
    let conn = point.conn();
    if (!conn.pool().isStopped()) {
      conn.send(hx.HxMsg.make2("pointUpdated", point, rec));
    }
    ;
    return;
  }

  onPointRemoved(id) {
    let point = this.point(id, false);
    if (point == null) {
      return;
    }
    ;
    this.#pointsById.remove(id);
    this.updateConnPoints(point.conn());
    this.#lib.fw().service().removePoint(sys.ObjUtil.coerce(point, hx.HxConnPoint.type$));
    point.conn().send(hx.HxMsg.make1("pointRemoved", point));
    return;
  }

  updateConnPoints(conn) {
    const this$ = this;
    let acc = sys.List.make(ConnPoint.type$);
    acc.capacity(sys.Int.plus(conn.points().size(), 4));
    this.#pointsById.each(sys.ObjUtil.coerce((pt) => {
      if (pt.conn() === conn) {
        acc.add(pt);
      }
      ;
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    conn.updatePointsList(acc);
    return;
  }

  pointConnRef(rec) {
    return sys.ObjUtil.coerce(((this$) => { let $_u55 = sys.ObjUtil.as(rec.get(this$.#lib.model().connRefTag()), haystack.Ref.type$); if ($_u55 != null) return $_u55; return haystack.Ref.nullRef(); })(this), haystack.Ref.type$);
  }

  onPointWatch(e) {
    const this$ = this;
    let isWatch = sys.ObjUtil.equals(e.subType(), "watch");
    let type = ((this$) => { if (isWatch) return "watch"; return "unwatch"; })(this);
    let recs = sys.ObjUtil.coerce(e.get("recs"), sys.Type.find("haystack::Dict[]"));
    let groupsByConn = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("hxConn::ConnPoint[]"));
    recs.each((rec) => {
      let pt = this$.point(rec.id(), false);
      if (pt == null) {
        return;
      }
      ;
      let group = groupsByConn.get(pt.conn().id());
      if (group == null) {
        groupsByConn.set(pt.conn().id(), sys.ObjUtil.coerce((group = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.List.make(ConnPoint.type$), (it) => {
          it.capacity(recs.size());
          return;
        }), sys.Type.find("hxConn::ConnPoint[]"))), sys.Type.find("hxConn::ConnPoint[]")));
      }
      ;
      group.add(sys.ObjUtil.coerce(pt, ConnPoint.type$));
      return;
    });
    groupsByConn.each((group) => {
      group.first().conn().send(hx.HxMsg.make1(type, group));
      return;
    });
    return;
  }

  onPointWrite(e) {
    let point = this.point(e.id(), false);
    if (point == null) {
      return;
    }
    ;
    if (point.isWriteEnabled()) {
      point.conn().send(hx.HxMsg.make2("write", point, ConnWriteInfo.make(e)));
    }
    ;
    return;
  }

  removeAll() {
    const this$ = this;
    let service = this.#lib.fw().service();
    this.#pointsById.each((pt) => {
      service.removePoint(sys.ObjUtil.coerce(pt, hx.HxConnPoint.type$));
      return;
    });
    this.#connsById.each((c) => {
      service.removeConn(sys.ObjUtil.coerce(c, hx.HxConn.type$));
      return;
    });
    this.updateConnsList();
    return;
  }

  dump() {
    const this$ = this;
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("--- ", this.#lib.name()), " roster ["), sys.ObjUtil.coerce(this.#connsById.size(), sys.Obj.type$.toNullable())), " conns, "), sys.ObjUtil.coerce(this.#pointsById.size(), sys.Obj.type$.toNullable())), " points] ---"));
    let conns = this.conns().dup().sort((a,b) => {
      return sys.ObjUtil.compare(a.dis(), b.dis());
    });
    conns.each((c) => {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  - ", c.id().toZinc()), " ["), sys.ObjUtil.coerce(c.points().size(), sys.Obj.type$.toNullable())), "]"));
      c.points().each((pt) => {
        sys.ObjUtil.echo(sys.Str.plus("    - ", pt.id().toZinc()));
        return;
      });
      return;
    });
    return;
  }

}

class ConnMgr extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#pointsInWatch = sys.List.make(ConnPoint.type$);
    return;
  }

  typeof() { return ConnMgr.type$; }

  #conn = null;

  conn() { return this.#conn; }

  __conn(it) { if (it === undefined) return this.#conn; else this.#conn = it; }

  #vars = null;

  vars() { return this.#vars; }

  __vars(it) { if (it === undefined) return this.#vars; else this.#vars = it; }

  #isOpen = false;

  isOpen() {
    return this.#isOpen;
  }

  #dispatch = null;

  // private field reflection only
  __dispatch(it) { if (it === undefined) return this.#dispatch; else this.#dispatch = it; }

  #openForPing = false;

  // private field reflection only
  __openForPing(it) { if (it === undefined) return this.#openForPing; else this.#openForPing = it; }

  #pointsInWatch = null;

  pointsInWatch(it) {
    if (it === undefined) {
      return this.#pointsInWatch;
    }
    else {
      this.#pointsInWatch = it;
      return;
    }
  }

  static make(conn,dispatchType) {
    const $self = new ConnMgr();
    ConnMgr.make$($self,conn,dispatchType);
    return $self;
  }

  static make$($self,conn,dispatchType) {
    ;
    $self.#conn = conn;
    $self.#vars = conn.vars();
    $self.#dispatch = sys.ObjUtil.coerce(dispatchType.make(sys.List.make(ConnMgr.type$, [$self])), ConnDispatch.type$);
    return;
  }

  rt() {
    return this.#conn.rt();
  }

  db() {
    return this.#conn.db();
  }

  lib() {
    return this.#conn.lib();
  }

  id() {
    return this.#conn.id();
  }

  rec() {
    return this.#conn.rec();
  }

  dis() {
    return this.#conn.dis();
  }

  log() {
    return this.#conn.log();
  }

  isDisabled() {
    return this.#conn.isDisabled();
  }

  trace() {
    return this.#conn.trace();
  }

  timeout() {
    return this.#conn.timeout();
  }

  hasPointsWatched() {
    return sys.ObjUtil.compareGT(this.#pointsInWatch.size(), 0);
  }

  onReceive(msg) {
    try {
      let $_u57 = msg.id();
      if (sys.ObjUtil.equals($_u57, "ping")) {
        return this.ping();
      }
      else if (sys.ObjUtil.equals($_u57, "close")) {
        return this.close("force close");
      }
      else if (sys.ObjUtil.equals($_u57, "sync")) {
        return null;
      }
      else if (sys.ObjUtil.equals($_u57, "write")) {
        return this.onWrite(sys.ObjUtil.coerce(msg.a(), ConnPoint.type$), sys.ObjUtil.coerce(msg.b(), ConnWriteInfo.type$));
      }
      else if (sys.ObjUtil.equals($_u57, "watch")) {
        return this.onWatch(sys.ObjUtil.coerce(msg.a(), sys.Type.find("hxConn::ConnPoint[]")));
      }
      else if (sys.ObjUtil.equals($_u57, "unwatch")) {
        return this.onUnwatch(sys.ObjUtil.coerce(msg.a(), sys.Type.find("hxConn::ConnPoint[]")));
      }
      else if (sys.ObjUtil.equals($_u57, "syncCur")) {
        return this.onSyncCur(sys.ObjUtil.coerce(msg.a(), sys.Type.find("hxConn::ConnPoint[]")));
      }
      else if (sys.ObjUtil.equals($_u57, "syncHis")) {
        return this.onSyncHis(sys.ObjUtil.coerce(msg.a(), ConnPoint.type$), sys.ObjUtil.coerce(msg.b(), haystack.Span.type$));
      }
      else if (sys.ObjUtil.equals($_u57, "hisPending")) {
        return this.onHisPending(sys.ObjUtil.coerce(msg.a(), ConnPoint.type$));
      }
      else if (sys.ObjUtil.equals($_u57, "learn")) {
        return this.onLearn(msg.a());
      }
      else if (sys.ObjUtil.equals($_u57, "connUpdated")) {
        return this.onConnUpdated(sys.ObjUtil.coerce(msg.a(), haystack.Dict.type$));
      }
      else if (sys.ObjUtil.equals($_u57, "connRemoved")) {
        return this.onConnRemoved();
      }
      else if (sys.ObjUtil.equals($_u57, "pointAdded")) {
        return this.onPointAdded(sys.ObjUtil.coerce(msg.a(), ConnPoint.type$));
      }
      else if (sys.ObjUtil.equals($_u57, "pointUpdated")) {
        return this.onPointUpdated(sys.ObjUtil.coerce(msg.a(), ConnPoint.type$), sys.ObjUtil.coerce(msg.b(), haystack.Dict.type$));
      }
      else if (sys.ObjUtil.equals($_u57, "pointRemoved")) {
        return this.onPointRemoved(sys.ObjUtil.coerce(msg.a(), ConnPoint.type$));
      }
      else if (sys.ObjUtil.equals($_u57, "init")) {
        return this.onInit();
      }
      else if (sys.ObjUtil.equals($_u57, "forcehk")) {
        return this.onHouseKeeping();
      }
      else if (sys.ObjUtil.equals($_u57, "inWatch")) {
        return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.#pointsInWatch), sys.Type.find("hxConn::ConnPoint[]"));
      }
      ;
    }
    catch ($_u58) {
      $_u58 = sys.Err.make($_u58);
      if ($_u58 instanceof sys.Err) {
        let e = $_u58;
        ;
        if (!this.#conn.isStopped()) {
          this.log().err(sys.Str.plus("Conn.receive ", msg.id()), e);
        }
        ;
        throw e;
      }
      else {
        throw $_u58;
      }
    }
    ;
    return this.#dispatch.onReceive(msg);
  }

  isClosed() {
    return !this.#isOpen;
  }

  checkOpen() {
    if (!this.#isOpen) {
      throw NotOpenLibErr.make("Connector open failed", this.#vars.err());
    }
    ;
    return this;
  }

  openLinger(linger) {
    if (linger === undefined) linger = this.#conn.linger();
    this.open("linger");
    this.setLinger(linger);
    return this;
  }

  setLinger(linger) {
    this.#vars.setLinger(linger);
    return;
  }

  openPin(app) {
    if (this.#vars.openPin(app)) {
      this.trace().phase("openPin", app);
      this.open(app);
    }
    ;
    return;
  }

  closePin(app) {
    if (this.#vars.closePin(app)) {
      this.trace().phase("closePin", app);
      if (this.#vars.openPins().isEmpty()) {
        this.setLinger(sys.Duration.fromStr("5sec"));
      }
      ;
    }
    ;
    return;
  }

  open(app) {
    if (this.isDisabled()) {
      return;
    }
    ;
    if (this.#isOpen) {
      return;
    }
    ;
    this.trace().phase("opening...", app);
    this.updateConnState(ConnState.opening());
    try {
      this.#dispatch.onOpen();
    }
    catch ($_u59) {
      $_u59 = sys.Err.make($_u59);
      if ($_u59 instanceof sys.Err) {
        let e = $_u59;
        ;
        this.trace().phase("open err", e);
        this.updateConnErr(e);
        return;
      }
      else {
        throw $_u59;
      }
    }
    ;
    this.#isOpen = true;
    this.updateConnOk();
    this.trace().phase("open ok");
    if ((!this.#openForPing && sys.ObjUtil.compareLT(this.#vars.lastPing(), sys.Int.minus(sys.Duration.nowTicks(), 3600000000000)))) {
      this.ping();
    }
    ;
    try {
      if ((this.hasPointsWatched() && sys.ObjUtil.compareNE(app, "watch"))) {
        this.onWatch(this.#pointsInWatch);
      }
      ;
    }
    catch ($_u60) {
      $_u60 = sys.Err.make($_u60);
      if ($_u60 instanceof sys.Err) {
        let e = $_u60;
        ;
        this.close(e);
        return;
      }
      else {
        throw $_u60;
      }
    }
    ;
    this.checkWriteOnOpen();
    return;
  }

  close(cause) {
    if (this.isClosed()) {
      return this.rec();
    }
    ;
    this.trace().phase("close", cause);
    this.updateConnState(ConnState.closing());
    try {
      this.#dispatch.onClose();
    }
    catch ($_u61) {
      $_u61 = sys.Err.make($_u61);
      if ($_u61 instanceof sys.Err) {
        let e = $_u61;
        ;
        this.log().err("onClose", e);
      }
      else {
        throw $_u61;
      }
    }
    ;
    this.#vars.clearLinger();
    this.#isOpen = false;
    if (sys.ObjUtil.is(cause, sys.Err.type$)) {
      this.updateConnErr(sys.ObjUtil.coerce(cause, sys.Err.type$));
    }
    else {
      this.updateConnState(ConnState.closed());
    }
    ;
    return this.rec();
  }

  updateConnState(state) {
    try {
      this.#vars.updateState(state);
      this.#conn.committer().commit1(this.lib(), this.rec(), "connState", state.name());
    }
    catch ($_u62) {
      $_u62 = sys.Err.make($_u62);
      if ($_u62 instanceof folio.ShutdownErr) {
        let e = $_u62;
        ;
      }
      else if ($_u62 instanceof sys.Err) {
        let e = $_u62;
        ;
        if (this.#conn.isAlive()) {
          this.log().err("Conn.updateConnState", e);
        }
        ;
      }
      else {
        throw $_u62;
      }
    }
    ;
    return;
  }

  ping() {
    const this$ = this;
    let result = this.rec();
    this.#openForPing = true;
    try {
      this.openLinger();
    }
    finally {
      this.#openForPing = false;
    }
    ;
    if (!this.#isOpen) {
      return result;
    }
    ;
    this.trace().phase("ping");
    let r = null;
    try {
      (r = this.#dispatch.onPing());
    }
    catch ($_u63) {
      $_u63 = sys.Err.make($_u63);
      if ($_u63 instanceof sys.Err) {
        let e = $_u63;
        ;
        this.close(e);
        return result;
      }
      else {
        throw $_u63;
      }
    }
    ;
    this.#vars.pinged();
    let changes = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    r.each((v,n) => {
      if (v === haystack.Remove.val()) {
        if (this$.rec().has(n)) {
          changes.set(n, haystack.Remove.val());
        }
        ;
      }
      else {
        if (sys.ObjUtil.compareNE(this$.rec().get(n), v)) {
          changes.set(n, v);
        }
        ;
      }
      ;
      return;
    });
    if (!changes.isEmpty()) {
      (result = sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.commit(folio.Diff.make(this.rec(), changes, folio.Diff.force())).waitFor(this.timeout()), folio.FolioFuture.type$).dict(), haystack.Dict.type$));
    }
    ;
    return result;
  }

  onLearn(arg) {
    this.openLinger().checkOpen();
    return this.#dispatch.onLearn(arg);
  }

  onInit() {
    this.updateStatus(true);
    this.updatePointsInWatch();
    this.updateBuckets();
    return null;
  }

  onConnUpdated(newRec) {
    let oldConfig = this.#conn.config();
    let newConfig = ConnConfig.make(this.lib(), newRec);
    this.#conn.setConfig(this, newConfig);
    if (sys.ObjUtil.compareNE(oldConfig.isDisabled(), newConfig.isDisabled())) {
      if (newConfig.isDisabled()) {
        this.close("disabled");
      }
      ;
      this.#vars.resetStats();
      this.updateStatus();
      if (!newConfig.isDisabled()) {
        this.checkReopen();
      }
      ;
    }
    ;
    if (oldConfig.tuning() !== newConfig.tuning()) {
      this.updateBuckets();
    }
    ;
    this.#dispatch.onConnUpdated();
    return null;
  }

  onConnRemoved() {
    this.#dispatch.onConnRemoved();
    return null;
  }

  onPointAdded(pt) {
    this.updatePointsInWatch();
    this.updateBuckets();
    pt.updateStatus();
    this.#dispatch.onPointAdded(pt);
    return null;
  }

  onPointUpdated(pt,newRec) {
    let oldConfig = pt.config();
    let newConfig = ConnPointConfig.make(this.lib(), newRec);
    pt.setConfig(this, newConfig);
    if (oldConfig.isStatusUpdate(newConfig)) {
      pt.updateStatus();
    }
    ;
    if (sys.ObjUtil.compareNE(oldConfig.isCurEnabled(), newConfig.isCurEnabled())) {
      this.updatePointsInWatch();
    }
    ;
    if (oldConfig.tuning() !== newConfig.tuning()) {
      this.updateBuckets();
    }
    ;
    this.#dispatch.onPointUpdated(pt);
    return null;
  }

  onPointRemoved(pt) {
    this.updatePointsInWatch();
    this.updateBuckets();
    this.#dispatch.onPointRemoved(pt);
    return null;
  }

  onSyncCur(points) {
    const this$ = this;
    (points = points.findAll((pt) => {
      return pt.isCurEnabled();
    }));
    if (points.isEmpty()) {
      return "syncCur [no cur points]";
    }
    ;
    this.openLinger().checkOpen();
    this.#dispatch.onSyncCur(points);
    return sys.Str.plus(sys.Str.plus("syncCur [", sys.ObjUtil.coerce(points.size(), sys.Obj.type$.toNullable())), " points]");
  }

  onWatch(points) {
    const this$ = this;
    points.each((pt) => {
      pt.isWatchedRef().val(true);
      return;
    });
    (points = points.findAll((pt) => {
      return pt.isCurEnabled();
    }));
    if (points.isEmpty()) {
      return "watch [no cur points]";
    }
    ;
    let nowTicks = sys.Duration.nowTicks();
    points.each((pt) => {
      if (this$.isQuickPoll(nowTicks, pt)) {
        pt.updateCurQuickPoll(true);
      }
      ;
      return;
    });
    this.updatePointsInWatch();
    if (!this.#pointsInWatch.isEmpty()) {
      this.openPin("watch");
    }
    ;
    if (this.#isOpen) {
      this.#dispatch.onWatch(points);
    }
    ;
    return sys.Str.plus(sys.Str.plus("watch [", sys.ObjUtil.coerce(points.size(), sys.Obj.type$.toNullable())), " points]");
  }

  isQuickPoll(nowTicks,pt) {
    if (this.#conn.pollMode() !== ConnPollMode.buckets()) {
      return false;
    }
    ;
    if (!this.rt().isSteadyState()) {
      return false;
    }
    ;
    let curState = pt.curState();
    if (sys.ObjUtil.compareLE(curState.lastUpdate(), 0)) {
      return true;
    }
    ;
    return sys.ObjUtil.compareGT(sys.Int.minus(nowTicks, curState.lastUpdate()), pt.tuning().pollTime().ticks());
  }

  onUnwatch(points) {
    const this$ = this;
    if (points.isEmpty()) {
      return null;
    }
    ;
    points.each((pt) => {
      pt.isWatchedRef().val(false);
      return;
    });
    this.updatePointsInWatch();
    this.#dispatch.onUnwatch(points);
    if (this.#pointsInWatch.isEmpty()) {
      this.closePin("watch");
    }
    ;
    return null;
  }

  updatePointsInWatch() {
    const this$ = this;
    let acc = sys.List.make(ConnPoint.type$);
    acc.capacity(this.#conn.points().size());
    this.#conn.points().each((pt) => {
      if ((pt.isWatched() && pt.isCurEnabled())) {
        acc.add(pt);
      }
      ;
      return;
    });
    this.#pointsInWatch = acc;
    return;
  }

  onCurHouseKeeping(now,pt,tuning) {
    if (!pt.isCurEnabled()) {
      return;
    }
    ;
    if ((pt.curState().status() === ConnStatus.ok() && !pt.isWatched() && sys.ObjUtil.compareGE(sys.Int.minus(now.ticks(), pt.curState().lastUpdate()), tuning.staleTime().ticks()))) {
      pt.updateCurStale();
    }
    ;
    return;
  }

  onWrite(pt,info) {
    if (info.isFirst()) {
      if (!pt.tuning().writeOnStart()) {
        return null;
      }
      ;
    }
    ;
    pt.updateWriteReceived(info);
    let tuning = pt.tuning();
    if (tuning.writeMinTime() != null) {
      let lastWrite = sys.Int.minus(sys.Duration.nowTicks(), pt.writeState().lastUpdate());
      if (sys.ObjUtil.compareLT(lastWrite, tuning.writeMinTime().ticks())) {
        pt.updateWritePending(true);
        return null;
      }
      ;
    }
    ;
    this.openLinger();
    if (this.isClosed()) {
      pt.updateWriteErr(info, haystack.DownErr.make("closed"));
      return null;
    }
    ;
    try {
      if (pt.writeConvert() != null) {
        (info = ConnWriteInfo.convert(info, pt));
      }
      ;
      this.#dispatch.onWrite(pt, info);
    }
    catch ($_u64) {
      $_u64 = sys.Err.make($_u64);
      if ($_u64 instanceof sys.Err) {
        let e = $_u64;
        ;
        pt.updateWriteErr(info, e);
      }
      else {
        throw $_u64;
      }
    }
    ;
    return null;
  }

  checkWriteOnOpen() {
    const this$ = this;
    if (!this.lib().model().hasWrite()) {
      return;
    }
    ;
    this.#conn.points().each((pt) => {
      if (!pt.isWriteEnabled()) {
        return;
      }
      ;
      let writeState = pt.writeState();
      if (writeState.queued()) {
        return;
      }
      ;
      let last = writeState.lastInfo();
      if (last == null) {
        return;
      }
      ;
      if (!pt.tuning().writeOnOpen()) {
        return;
      }
      ;
      this$.sendWrite(pt, sys.ObjUtil.coerce(sys.ObjUtil.coerce(last.asOnOpen(), ConnWriteInfo.type$.toNullable()), ConnWriteInfo.type$));
      return;
    });
    return;
  }

  onWriteHouseKeeping(now,pt,tuning) {
    if (!pt.isWriteEnabled()) {
      return;
    }
    ;
    let state = pt.writeState();
    if (state.queued()) {
      return;
    }
    ;
    let last = state.lastInfo();
    if (last == null) {
      pt.updateWriteQueued(false);
      pt.updateWritePending(false);
      return;
    }
    ;
    if (state.pending()) {
      if (tuning.writeMinTime() == null) {
        pt.updateWritePending(false);
      }
      else {
        if (sys.ObjUtil.compareGE(sys.Int.minus(now.ticks(), pt.writeState().lastUpdate()), tuning.writeMinTime().ticks())) {
          this.sendWrite(pt, sys.ObjUtil.coerce(sys.ObjUtil.coerce(last.asMinTime(), ConnWriteInfo.type$.toNullable()), ConnWriteInfo.type$));
          pt.updateWritePending(false);
          return;
        }
        ;
      }
      ;
    }
    ;
    if (tuning.writeMaxTime() != null) {
      if ((sys.ObjUtil.compareGE(sys.Int.minus(now.ticks(), pt.writeState().lastUpdate()), tuning.writeMaxTime().ticks()) && this.rt().isSteadyState())) {
        this.sendWrite(pt, sys.ObjUtil.coerce(sys.ObjUtil.coerce(last.asMaxTime(), ConnWriteInfo.type$.toNullable()), ConnWriteInfo.type$));
        return;
      }
      ;
    }
    ;
    return;
  }

  sendWrite(pt,info) {
    this.#conn.send(hx.HxMsg.make2("write", pt, info));
    pt.updateWriteQueued(true);
    return;
  }

  onSyncHis(point,span) {
    this.openLinger();
    if (this.isClosed()) {
      return point.updateHisErr(haystack.DownErr.make("closed"));
    }
    ;
    try {
      return this.#dispatch.onSyncHis(point, span);
    }
    catch ($_u65) {
      $_u65 = sys.Err.make($_u65);
      if ($_u65 instanceof sys.Err) {
        let e = $_u65;
        ;
        return point.updateHisErr(e);
      }
      else {
        throw $_u65;
      }
    }
    ;
  }

  onHisPending(point) {
    point.updateHisPending();
    return null;
  }

  onPoll() {
    if (this.isClosed()) {
      return;
    }
    ;
    this.#vars.polled();
    let $_u66 = this.#conn.pollMode();
    if (sys.ObjUtil.equals($_u66, ConnPollMode.manual())) {
      this.onPollManual();
    }
    else if (sys.ObjUtil.equals($_u66, ConnPollMode.buckets())) {
      this.onPollBuckets();
    }
    ;
    return;
  }

  onPollManual() {
    this.trace().poll("poll manual", null);
    this.#dispatch.onPollManual();
    return;
  }

  onPollBuckets() {
    const this$ = this;
    let pollBuckets = this.#conn.pollBuckets();
    if ((pollBuckets.isEmpty() || !this.hasPointsWatched() || this.isClosed())) {
      return;
    }
    ;
    pollBuckets.each((bucket) => {
      let now = sys.Duration.nowTicks();
      if (sys.ObjUtil.compareGE(now, bucket.nextPoll())) {
        this$.pollBucket(now, bucket);
      }
      ;
      return;
    });
    let quicks = this.#pointsInWatch.findAll((pt) => {
      return pt.curState().quickPoll();
    });
    if (!quicks.isEmpty()) {
      this.trace().poll("Poll quick");
      this.pollBucketPoints(quicks);
    }
    ;
    return;
  }

  pollBucket(startTicks,bucket) {
    const this$ = this;
    let points = bucket.points().findAll((pt) => {
      return (pt.isWatched() && pt.isCurEnabled());
    });
    if (points.isEmpty()) {
      return;
    }
    ;
    try {
      this.trace().poll("Poll bucket", bucket.tuning().dis());
      this.pollBucketPoints(points);
    }
    finally {
      bucket.updateNextPoll(startTicks);
    }
    ;
    return;
  }

  pollBucketPoints(points) {
    const this$ = this;
    points.each((pt) => {
      pt.updateCurQuickPoll(false);
      return;
    });
    this.#dispatch.onPollBucket(points);
    return;
  }

  updateBuckets() {
    const this$ = this;
    if (this.#conn.pollMode() !== ConnPollMode.buckets()) {
      return;
    }
    ;
    let oldBuckets = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("hxConn::ConnPollBucket"));
    oldBuckets.setList(this.#conn.pollBuckets(), (b) => {
      return b.tuning().id();
    });
    let byTuningId = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("hxConn::ConnPoint[]"));
    this.#conn.points().each((pt) => {
      let tuningId = pt.tuning().id();
      let bucket = byTuningId.get(tuningId);
      if (bucket == null) {
        byTuningId.set(tuningId, sys.ObjUtil.coerce((bucket = sys.List.make(ConnPoint.type$)), sys.Type.find("hxConn::ConnPoint[]")));
      }
      ;
      bucket.add(pt);
      return;
    });
    let acc = sys.List.make(ConnPollBucket.type$);
    byTuningId.each((points) => {
      let tuning = points.first().tuning();
      let state = ((this$) => { let $_u67 = ((this$) => { let $_u68=oldBuckets.get(tuning.id()); return ($_u68==null) ? null : $_u68.state(); })(this$); if ($_u67 != null) return $_u67; return ConnPollBucketState.make(tuning); })(this$);
      acc.add(ConnPollBucket.make(this$.#conn, tuning, sys.ObjUtil.coerce(state, ConnPollBucketState.type$), points));
      return;
    });
    this.#conn.setPollBuckets(this, sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc.sort()), sys.Type.find("hxConn::ConnPollBucket[]")));
    return;
  }

  onHouseKeeping() {
    const this$ = this;
    this.checkReopen();
    this.checkAutoPing();
    if ((this.#vars.lingerExpired() && this.#vars.openPins().isEmpty())) {
      this.close("linger expired");
    }
    ;
    let now = sys.Duration.now();
    let toStale = sys.List.make(ConnPoint.type$);
    this.#conn.points().each((pt) => {
      try {
        this$.doPointHouseKeeping(now, toStale, pt);
      }
      catch ($_u69) {
        $_u69 = sys.Err.make($_u69);
        if ($_u69 instanceof sys.Err) {
          let e = $_u69;
          ;
          this$.log().err(sys.Str.plus(sys.Str.plus("doPointHouseKeeping(", pt.dis()), ")"), e);
        }
        else {
          throw $_u69;
        }
      }
      ;
      return;
    });
    if (!toStale.isEmpty()) {
      toStale.each((pt) => {
        try {
          pt.updateCurStale();
        }
        catch ($_u70) {
          $_u70 = sys.Err.make($_u70);
          if ($_u70 instanceof sys.Err) {
            let e = $_u70;
            ;
            this$.log().err(sys.Str.plus("doHouseKeeping updateCurStale: ", pt.dis()), e);
          }
          else {
            throw $_u70;
          }
        }
        ;
        return;
      });
    }
    ;
    this.#dispatch.onHouseKeeping();
    return null;
  }

  doPointHouseKeeping(now,toStale,pt) {
    let tuning = pt.tuning();
    this.onCurHouseKeeping(now, pt, tuning);
    this.onWriteHouseKeeping(now, pt, tuning);
    return;
  }

  checkAutoPing() {
    let pingFreq = this.#conn.pingFreq();
    if (pingFreq == null) {
      return;
    }
    ;
    let now = sys.Duration.nowTicks();
    if (sys.ObjUtil.compareLE(sys.Int.minus(now, this.#vars.lastPing()), pingFreq.ticks())) {
      return;
    }
    ;
    if (sys.ObjUtil.compareLE(sys.Int.minus(now, this.#vars.lastAttempt()), pingFreq.ticks())) {
      return;
    }
    ;
    if (!this.rt().isSteadyState()) {
      return;
    }
    ;
    this.ping();
    return;
  }

  checkReopen() {
    if ((this.#isOpen || this.isDisabled() || this.#vars.openPins().isEmpty())) {
      return;
    }
    ;
    try {
      if (sys.ObjUtil.compareGT(sys.Int.minus(sys.Duration.nowTicks(), this.#vars.lastErr()), this.#conn.openRetryFreq().ticks())) {
        this.ping();
      }
      ;
    }
    catch ($_u71) {
      $_u71 = sys.Err.make($_u71);
      if ($_u71 instanceof sys.Err) {
        let e = $_u71;
        ;
        this.log().err("checkReopenWatch", e);
      }
      else {
        throw $_u71;
      }
    }
    ;
    return;
  }

  updateConnOk() {
    this.#vars.updateOk();
    this.updateStatus();
    return;
  }

  updateConnErr(err) {
    this.#vars.updateErr(err);
    this.updateStatus();
    return;
  }

  updateStatus(forcePoints) {
    if (forcePoints === undefined) forcePoints = false;
    const this$ = this;
    let status = null;
    let curErr = this.#vars.err();
    let errStr = null;
    let state = ((this$) => { if (this$.#isOpen) return ConnState.open(); return ConnState.closed(); })(this);
    if (this.rec().has("disabled")) {
      (status = ConnStatus.disabled());
      (errStr = null);
    }
    else {
      if (curErr != null) {
        (status = ConnStatus.fromErr(sys.ObjUtil.coerce(curErr, sys.Err.type$)));
        (errStr = ConnStatus.toErrStr(curErr));
      }
      else {
        if (sys.ObjUtil.compareNE(this.#vars.lastOk(), 0)) {
          (status = ConnStatus.ok());
          (errStr = null);
        }
        else {
          (status = ConnStatus.unknown());
          (errStr = null);
        }
        ;
      }
      ;
    }
    ;
    let statusModified = this.#vars.status() !== status;
    this.#vars.updateStatus(sys.ObjUtil.coerce(status, ConnStatus.type$), state);
    this.#conn.committer().commit3(this.lib(), this.rec(), "connStatus", status.name(), "connState", state.name(), "connErr", errStr);
    if ((statusModified || forcePoints)) {
      this.#conn.points().each((pt) => {
        pt.onConnStatus();
        return;
      });
    }
    ;
    return;
  }

  commit(diff) {
    return this.db().commitAsync(diff);
  }

}

class AbstractSyncHis extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#results = sys.List.make(haystack.Dict.type$);
    return;
  }

  typeof() { return AbstractSyncHis.type$; }

  #cxRef = null;

  // private field reflection only
  __cxRef(it) { if (it === undefined) return this.#cxRef; else this.#cxRef = it; }

  #pointsRef = null;

  // private field reflection only
  __pointsRef(it) { if (it === undefined) return this.#pointsRef; else this.#pointsRef = it; }

  #task = null;

  // private field reflection only
  __task(it) { if (it === undefined) return this.#task; else this.#task = it; }

  #span = null;

  // private field reflection only
  __span(it) { if (it === undefined) return this.#span; else this.#span = it; }

  #num = 0;

  // private field reflection only
  __num(it) { if (it === undefined) return this.#num; else this.#num = it; }

  #numOk = 0;

  // private field reflection only
  __numOk(it) { if (it === undefined) return this.#numOk; else this.#numOk = it; }

  #numErr = 0;

  // private field reflection only
  __numErr(it) { if (it === undefined) return this.#numErr; else this.#numErr = it; }

  #results = null;

  // private field reflection only
  __results(it) { if (it === undefined) return this.#results; else this.#results = it; }

  static make(cx,points,span) {
    const $self = new AbstractSyncHis();
    AbstractSyncHis.make$($self,cx,points,span);
    return $self;
  }

  static make$($self,cx,points,span) {
    ;
    $self.#cxRef = cx;
    $self.#task = sys.ObjUtil.coerce(cx.rt().services().get(hx.HxTaskService.type$, false), hx.HxTaskService.type$.toNullable());
    $self.#num = points.size();
    $self.#pointsRef = sys.ObjUtil.coerce(points, sys.Type.find("hxConn::ConnPoint[]"));
    $self.#span = span;
    return;
  }

  run() {
    const this$ = this;
    if (this.points().isEmpty()) {
      return sys.ObjUtil.coerce(haystack.Dict.type$.emptyList(), sys.Type.find("haystack::Dict[]"));
    }
    ;
    this.trace(sys.Str.plus(sys.Str.plus("Sync ", sys.ObjUtil.coerce(this.#num, sys.Obj.type$.toNullable())), " points..."), 0);
    this.commitPending();
    this.points().each((pt,i) => {
      this$.cx().heartbeat(axon.Loc.make("connHisSync"));
      this$.trace(sys.Str.plus(sys.Str.plus("Syncing ", sys.Str.toCode(this$.dis(pt))), sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(" (", sys.ObjUtil.coerce(sys.Int.plus(i, 1), sys.Obj.type$.toNullable())), " of "), sys.ObjUtil.coerce(this$.#num, sys.Obj.type$.toNullable())), ")...")), sys.Int.div(sys.Int.mult(i, 100), this$.#num));
      let r = this$.sync(pt);
      if (r.has("err")) {
        this$.#numErr = sys.Int.increment(this$.#numErr);
      }
      else {
        this$.#numOk = sys.Int.increment(this$.#numOk);
      }
      ;
      this$.#results.add(r);
      return;
    });
    this.trace(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Complete: ", sys.ObjUtil.coerce(this.#numOk, sys.Obj.type$.toNullable())), " ok; "), sys.ObjUtil.coerce(this.#numErr, sys.Obj.type$.toNullable())), " errors"), 100);
    return this.#results;
  }

  cx() {
    return this.#cxRef;
  }

  points() {
    return this.#pointsRef;
  }

  toPointSpan(rec,tz) {
    let x = null;
    if (this.#span == null) {
      let last = sys.ObjUtil.as(rec.get("hisEnd"), sys.DateTime.type$);
      let now = sys.DateTime.now().toTimeZone(tz);
      if (last == null) {
        (last = now.minus(sys.Duration.fromStr("5day")));
      }
      ;
      (x = haystack.Span.makeAbs(last.plus(sys.Duration.fromStr("1ms")), now.plus(sys.Duration.fromStr("1hr"))));
    }
    else {
      (x = axon.CoreLib.toSpan(this.#span, tz.name()));
    }
    ;
    return sys.ObjUtil.coerce(x, haystack.Span.type$);
  }

  trace(msg,progress) {
    if (this.#task == null) {
      return;
    }
    ;
    this.#task.progress(haystack.Etc.makeDict2("msg", msg, "progress", haystack.Number.makeInt(progress, haystack.Number.percent())));
    return;
  }

}

class ConnSyncHis extends AbstractSyncHis {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnSyncHis.type$; }

  static make(cx,points,span) {
    const $self = new ConnSyncHis();
    ConnSyncHis.make$($self,cx,points,span);
    return $self;
  }

  static make$($self,cx,points,span) {
    AbstractSyncHis.make$($self, cx, points, span);
    return;
  }

  dis(pt) {
    return sys.ObjUtil.coerce(pt, ConnPoint.type$).dis();
  }

  points() {
    return sys.ObjUtil.coerce(AbstractSyncHis.prototype.points.call(this), sys.Type.find("hxConn::ConnPoint[]"));
  }

  commitPending() {
    const this$ = this;
    this.points().each((pt) => {
      pt.conn().send(hx.HxMsg.make1("hisPending", pt));
      return;
    });
    return;
  }

  sync(point) {
    let pt = sys.ObjUtil.coerce(point, ConnPoint.type$);
    let rec = this.cx().db().readById(pt.id());
    let span = this.toPointSpan(sys.ObjUtil.coerce(rec, haystack.Dict.type$), pt.tz());
    return sys.ObjUtil.coerce(pt.conn().send(hx.HxMsg.make2("syncHis", pt, span)).get(null), haystack.Dict.type$);
  }

}

class ConnStatus extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnStatus.type$; }

  static unknown() { return ConnStatus.vals().get(0); }

  static ok() { return ConnStatus.vals().get(1); }

  static stale() { return ConnStatus.vals().get(2); }

  static down() { return ConnStatus.vals().get(3); }

  static fault() { return ConnStatus.vals().get(4); }

  static disabled() { return ConnStatus.vals().get(5); }

  static remoteUnknown() { return ConnStatus.vals().get(6); }

  static remoteDown() { return ConnStatus.vals().get(7); }

  static remoteFault() { return ConnStatus.vals().get(8); }

  static remoteDisabled() { return ConnStatus.vals().get(9); }

  static #vals = undefined;

  isUnknown() {
    return this === ConnStatus.unknown();
  }

  isOk() {
    return this === ConnStatus.ok();
  }

  isDisabled() {
    return this === ConnStatus.disabled();
  }

  isLocal() {
    return this.remoteToLocal() == null;
  }

  isRemote() {
    return this.remoteToLocal() != null;
  }

  remoteToLocal() {
    let $_u73 = this;
    if (sys.ObjUtil.equals($_u73, ConnStatus.remoteUnknown())) {
      return ConnStatus.unknown();
    }
    else if (sys.ObjUtil.equals($_u73, ConnStatus.remoteDown())) {
      return ConnStatus.down();
    }
    else if (sys.ObjUtil.equals($_u73, ConnStatus.remoteFault())) {
      return ConnStatus.fault();
    }
    else if (sys.ObjUtil.equals($_u73, ConnStatus.remoteDisabled())) {
      return ConnStatus.disabled();
    }
    else {
      return null;
    }
    ;
  }

  localToRemote() {
    let $_u74 = this;
    if (sys.ObjUtil.equals($_u74, ConnStatus.unknown())) {
      return ConnStatus.remoteUnknown();
    }
    else if (sys.ObjUtil.equals($_u74, ConnStatus.down())) {
      return ConnStatus.remoteDown();
    }
    else if (sys.ObjUtil.equals($_u74, ConnStatus.fault())) {
      return ConnStatus.remoteFault();
    }
    else if (sys.ObjUtil.equals($_u74, ConnStatus.disabled())) {
      return ConnStatus.remoteDisabled();
    }
    else {
      return null;
    }
    ;
  }

  static fromErr(e) {
    if (sys.ObjUtil.is(e, sys.IOErr.type$)) {
      if ((sys.Str.contains(e.msg(), "Connection refused") || sys.Str.contains(e.msg(), "timed out"))) {
        return ConnStatus.down();
      }
      ;
    }
    else {
      if (sys.ObjUtil.is(e, RemoteStatusErr.type$)) {
        let s = sys.ObjUtil.coerce(e, RemoteStatusErr.type$).status();
        if (s.isRemote()) {
          return s;
        }
        ;
        return sys.ObjUtil.coerce(((this$) => { let $_u75 = s.localToRemote(); if ($_u75 != null) return $_u75; return ConnStatus.remoteUnknown(); })(this), ConnStatus.type$);
      }
      ;
    }
    ;
    return ((this$) => { if (sys.ObjUtil.is(e, haystack.DownErr.type$)) return ConnStatus.down(); return ConnStatus.fault(); })(this);
  }

  static toErrStr(err) {
    if (err == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(err, haystack.FaultErr.type$)) {
      return err.msg();
    }
    ;
    if (sys.ObjUtil.is(err, haystack.DownErr.type$)) {
      return err.msg();
    }
    ;
    if (sys.ObjUtil.is(err, RemoteStatusErr.type$)) {
      return sys.Str.plus("Remote status err: ", err.msg());
    }
    ;
    if (sys.ObjUtil.is(err, inet.UnknownHostErr.type$)) {
      return sys.Str.plus("Unknown host: ", err.msg());
    }
    ;
    if (sys.Str.startsWith(err.msg(), "java.net.UnknownHostException:")) {
      return sys.Str.plus("Unknown host", sys.Str.getRange(err.msg(), sys.Range.make(sys.ObjUtil.coerce(sys.Str.index(err.msg(), ":"), sys.Int.type$), -1)));
    }
    ;
    return err.toStr();
  }

  static make($ordinal,$name) {
    const $self = new ConnStatus();
    ConnStatus.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(ConnStatus.type$, ConnStatus.vals(), name$, checked);
  }

  static vals() {
    if (ConnStatus.#vals == null) {
      ConnStatus.#vals = sys.List.make(ConnStatus.type$, [
        ConnStatus.make(0, "unknown", ),
        ConnStatus.make(1, "ok", ),
        ConnStatus.make(2, "stale", ),
        ConnStatus.make(3, "down", ),
        ConnStatus.make(4, "fault", ),
        ConnStatus.make(5, "disabled", ),
        ConnStatus.make(6, "remoteUnknown", ),
        ConnStatus.make(7, "remoteDown", ),
        ConnStatus.make(8, "remoteFault", ),
        ConnStatus.make(9, "remoteDisabled", ),
      ]).toImmutable();
    }
    return ConnStatus.#vals;
  }

  static static$init() {
    const $_u77 = ConnStatus.vals();
    if (true) {
    }
    ;
    return;
  }

}

class ConnState extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnState.type$; }

  static closed() { return ConnState.vals().get(0); }

  static closing() { return ConnState.vals().get(1); }

  static open() { return ConnState.vals().get(2); }

  static opening() { return ConnState.vals().get(3); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new ConnState();
    ConnState.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(ConnState.type$, ConnState.vals(), name$, checked);
  }

  static vals() {
    if (ConnState.#vals == null) {
      ConnState.#vals = sys.List.make(ConnState.type$, [
        ConnState.make(0, "closed", ),
        ConnState.make(1, "closing", ),
        ConnState.make(2, "open", ),
        ConnState.make(3, "opening", ),
      ]).toImmutable();
    }
    return ConnState.#vals;
  }

  static static$init() {
    const $_u78 = ConnState.vals();
    if (true) {
    }
    ;
    return;
  }

}

class ConnDispatch extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnDispatch.type$; }

  #connRef = null;

  // private field reflection only
  __connRef(it) { if (it === undefined) return this.#connRef; else this.#connRef = it; }

  #mgr = null;

  // private field reflection only
  __mgr(it) { if (it === undefined) return this.#mgr; else this.#mgr = it; }

  static make(arg) {
    const $self = new ConnDispatch();
    ConnDispatch.make$($self,arg);
    return $self;
  }

  static make$($self,arg) {
    let mgr = ((this$) => { let $_u79 = sys.ObjUtil.as(arg, ConnMgr.type$); if ($_u79 != null) return $_u79; throw sys.Err.make(sys.Str.plus("Invalid constructor arg: ", arg)); })($self);
    $self.#mgr = sys.ObjUtil.coerce(mgr, ConnMgr.type$);
    $self.#connRef = mgr.conn();
    return;
  }

  rt() {
    return this.#connRef.rt();
  }

  db() {
    return this.#connRef.db();
  }

  lib() {
    return this.#connRef.lib();
  }

  conn() {
    return this.#connRef;
  }

  id() {
    return this.conn().id();
  }

  trace() {
    return this.conn().trace();
  }

  log() {
    return this.conn().log();
  }

  dis() {
    return this.conn().dis();
  }

  rec() {
    return this.conn().rec();
  }

  point(id,checked) {
    if (checked === undefined) checked = true;
    return this.conn().point(id, checked);
  }

  points() {
    return this.conn().points();
  }

  pointsWatched() {
    return this.#mgr.pointsInWatch().ro();
  }

  hasPointsWatched() {
    return this.#mgr.hasPointsWatched();
  }

  setConnData(val) {
    this.conn().setData(this.#mgr, val);
    return;
  }

  setPointData(pt,val) {
    pt.setData(this.#mgr, val);
    return;
  }

  open() {
    this.#mgr.openLinger().checkOpen();
    return this;
  }

  close(cause) {
    this.#mgr.close(cause);
    return this;
  }

  openPin(app) {
    this.#mgr.openPin(app);
    return this;
  }

  closePin(app) {
    this.#mgr.closePin(app);
    return this;
  }

  onReceive(msg) {
    throw sys.Err.make(sys.Str.plus("Unknown msg: ", msg));
  }

  onLearn(arg) {
    throw sys.UnsupportedErr.make();
  }

  onPollManual() {
    return;
  }

  onPollBucket(points) {
    this.onSyncCur(points);
    return;
  }

  onSyncCur(points) {
    return;
  }

  onWatch(points) {
    return;
  }

  onUnwatch(points) {
    return;
  }

  onWrite(point,event) {
    return;
  }

  onSyncHis(point,span) {
    throw sys.UnsupportedErr.make();
  }

  onHouseKeeping() {
    return;
  }

  onConnUpdated() {
    return;
  }

  onConnRemoved() {
    return;
  }

  onPointAdded(pt) {
    return;
  }

  onPointUpdated(pt) {
    return;
  }

  onPointRemoved(pt) {
    return;
  }

}

class ConnPointWriteState extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnPointWriteState.type$; }

  static #nil = undefined;

  static nil() {
    if (ConnPointWriteState.#nil === undefined) {
      ConnPointWriteState.static$init();
      if (ConnPointWriteState.#nil === undefined) ConnPointWriteState.#nil = null;
    }
    return ConnPointWriteState.#nil;
  }

  #status = null;

  status() { return this.#status; }

  __status(it) { if (it === undefined) return this.#status; else this.#status = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  #raw = null;

  raw() { return this.#raw; }

  __raw(it) { if (it === undefined) return this.#raw; else this.#raw = it; }

  #level = 0;

  level() { return this.#level; }

  __level(it) { if (it === undefined) return this.#level; else this.#level = it; }

  #err = null;

  err() { return this.#err; }

  __err(it) { if (it === undefined) return this.#err; else this.#err = it; }

  #lastUpdate = 0;

  lastUpdate() { return this.#lastUpdate; }

  __lastUpdate(it) { if (it === undefined) return this.#lastUpdate; else this.#lastUpdate = it; }

  #numUpdates = 0;

  numUpdates() { return this.#numUpdates; }

  __numUpdates(it) { if (it === undefined) return this.#numUpdates; else this.#numUpdates = it; }

  #lastInfo = null;

  lastInfo() { return this.#lastInfo; }

  __lastInfo(it) { if (it === undefined) return this.#lastInfo; else this.#lastInfo = it; }

  #pending = false;

  pending() { return this.#pending; }

  __pending(it) { if (it === undefined) return this.#pending; else this.#pending = it; }

  #queued = false;

  queued() { return this.#queued; }

  __queued(it) { if (it === undefined) return this.#queued; else this.#queued = it; }

  static updateOk(pt,info) {
    return ConnPointWriteState.makeOk(pt.writeState(), info);
  }

  static updateErr(pt,info,err) {
    return ConnPointWriteState.makeErr(pt.writeState(), info, err);
  }

  static updateReceived(pt,lastInfo) {
    return ConnPointWriteState.makeReceived(pt.writeState(), lastInfo);
  }

  static updatePending(pt,pending) {
    let old = pt.writeState();
    if (sys.ObjUtil.equals(old.#pending, pending)) {
      return old;
    }
    ;
    return ConnPointWriteState.makePending(old, pending);
  }

  static updateQueued(pt,queued) {
    let old = pt.writeState();
    if (sys.ObjUtil.equals(old.#queued, queued)) {
      return old;
    }
    ;
    return ConnPointWriteState.makeQueued(old, queued);
  }

  details(s,pt) {
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("writeAddr:        ", pt.writeAddr()), "\nwriteStatus:      "), this.#status), "\nwriteVal:         "), this.#val), " ["), ((this$) => { let $_u80 = this$.#val; if ($_u80 == null) return null; return sys.ObjUtil.typeof(this$.#val); })(this)), "]\nwriteRaw:         "), this.#raw), " ["), ((this$) => { let $_u81 = this$.#raw; if ($_u81 == null) return null; return sys.ObjUtil.typeof(this$.#raw); })(this)), "]\nwriteConvert:     "), pt.writeConvert()), "\nwriteLastInfo:    "), this.#lastInfo), "\nwritePending:     "), sys.ObjUtil.coerce(this.#pending, sys.Obj.type$.toNullable())), "\nwriteQueued:      "), sys.ObjUtil.coerce(this.#queued, sys.Obj.type$.toNullable())), "\nwriteLastUpdate:  "), haystack.Etc.debugDur(sys.ObjUtil.coerce(this.#lastUpdate, sys.Obj.type$.toNullable()))), "\nwriteNumUpdate:   "), sys.ObjUtil.coerce(this.#numUpdates, sys.Obj.type$.toNullable())), "\nwriteErr:         "), haystack.Etc.debugErr(this.#err)), "\n"));
    return;
  }

  static makeNil() {
    const $self = new ConnPointWriteState();
    ConnPointWriteState.makeNil$($self);
    return $self;
  }

  static makeNil$($self) {
    $self.#status = ConnStatus.unknown();
    return;
  }

  static makeOk(old,info) {
    const $self = new ConnPointWriteState();
    ConnPointWriteState.makeOk$($self,old,info);
    return $self;
  }

  static makeOk$($self,old,info) {
    $self.#status = ConnStatus.ok();
    $self.#lastUpdate = sys.Duration.nowTicks();
    $self.#numUpdates = sys.Int.plus(old.#numUpdates, 1);
    $self.#val = ((this$) => { let $_u82 = info.val(); if ($_u82 == null) return null; return sys.ObjUtil.toImmutable(info.val()); })($self);
    $self.#raw = ((this$) => { let $_u83 = info.raw(); if ($_u83 == null) return null; return sys.ObjUtil.toImmutable(info.raw()); })($self);
    $self.#level = info.level();
    $self.#lastInfo = old.#lastInfo;
    $self.#pending = old.#pending;
    $self.#queued = old.#queued;
    return;
  }

  static makeErr(old,info,err) {
    const $self = new ConnPointWriteState();
    ConnPointWriteState.makeErr$($self,old,info,err);
    return $self;
  }

  static makeErr$($self,old,info,err) {
    $self.#status = ConnStatus.fromErr(err);
    $self.#lastUpdate = sys.Duration.nowTicks();
    $self.#numUpdates = sys.Int.plus(old.#numUpdates, 1);
    $self.#val = ((this$) => { let $_u84 = info.val(); if ($_u84 == null) return null; return sys.ObjUtil.toImmutable(info.val()); })($self);
    $self.#raw = ((this$) => { let $_u85 = info.raw(); if ($_u85 == null) return null; return sys.ObjUtil.toImmutable(info.raw()); })($self);
    $self.#level = info.level();
    $self.#err = err;
    $self.#lastInfo = old.#lastInfo;
    $self.#pending = old.#pending;
    $self.#queued = old.#queued;
    return;
  }

  static makeReceived(old,lastInfo) {
    const $self = new ConnPointWriteState();
    ConnPointWriteState.makeReceived$($self,old,lastInfo);
    return $self;
  }

  static makeReceived$($self,old,lastInfo) {
    $self.#status = old.#status;
    $self.#lastUpdate = old.#lastUpdate;
    $self.#numUpdates = old.#numUpdates;
    $self.#val = ((this$) => { let $_u86 = old.#val; if ($_u86 == null) return null; return sys.ObjUtil.toImmutable(old.#val); })($self);
    $self.#raw = ((this$) => { let $_u87 = old.#raw; if ($_u87 == null) return null; return sys.ObjUtil.toImmutable(old.#raw); })($self);
    $self.#level = old.#level;
    $self.#err = old.#err;
    $self.#lastInfo = lastInfo;
    $self.#pending = old.#pending;
    $self.#queued = false;
    return;
  }

  static makePending(old,pending) {
    const $self = new ConnPointWriteState();
    ConnPointWriteState.makePending$($self,old,pending);
    return $self;
  }

  static makePending$($self,old,pending) {
    $self.#status = old.#status;
    $self.#lastUpdate = old.#lastUpdate;
    $self.#numUpdates = old.#numUpdates;
    $self.#val = ((this$) => { let $_u88 = old.#val; if ($_u88 == null) return null; return sys.ObjUtil.toImmutable(old.#val); })($self);
    $self.#raw = ((this$) => { let $_u89 = old.#raw; if ($_u89 == null) return null; return sys.ObjUtil.toImmutable(old.#raw); })($self);
    $self.#level = old.#level;
    $self.#err = old.#err;
    $self.#lastInfo = old.#lastInfo;
    $self.#pending = pending;
    $self.#queued = old.#queued;
    return;
  }

  static makeQueued(old,queued) {
    const $self = new ConnPointWriteState();
    ConnPointWriteState.makeQueued$($self,old,queued);
    return $self;
  }

  static makeQueued$($self,old,queued) {
    $self.#status = old.#status;
    $self.#lastUpdate = old.#lastUpdate;
    $self.#numUpdates = old.#numUpdates;
    $self.#val = ((this$) => { let $_u90 = old.#val; if ($_u90 == null) return null; return sys.ObjUtil.toImmutable(old.#val); })($self);
    $self.#raw = ((this$) => { let $_u91 = old.#raw; if ($_u91 == null) return null; return sys.ObjUtil.toImmutable(old.#raw); })($self);
    $self.#level = old.#level;
    $self.#err = old.#err;
    $self.#lastInfo = old.#lastInfo;
    $self.#pending = old.#pending;
    $self.#queued = queued;
    return;
  }

  static static$init() {
    ConnPointWriteState.#nil = ConnPointWriteState.makeNil();
    return;
  }

}

class ConnWriteInfo extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnWriteInfo.type$; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  #raw = null;

  raw() { return this.#raw; }

  __raw(it) { if (it === undefined) return this.#raw; else this.#raw = it; }

  #level = 0;

  level() { return this.#level; }

  __level(it) { if (it === undefined) return this.#level; else this.#level = it; }

  #isFirst = false;

  isFirst() { return this.#isFirst; }

  __isFirst(it) { if (it === undefined) return this.#isFirst; else this.#isFirst = it; }

  #who = null;

  who() { return this.#who; }

  __who(it) { if (it === undefined) return this.#who; else this.#who = it; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #extra = null;

  extra() { return this.#extra; }

  __extra(it) { if (it === undefined) return this.#extra; else this.#extra = it; }

  static make($obs) {
    const $self = new ConnWriteInfo();
    ConnWriteInfo.make$($self,$obs);
    return $self;
  }

  static make$($self,$obs) {
    $self.#raw = ((this$) => { let $_u92 = $obs.val(); if ($_u92 == null) return null; return sys.ObjUtil.toImmutable($obs.val()); })($self);
    $self.#val = ((this$) => { let $_u93 = $obs.val(); if ($_u93 == null) return null; return sys.ObjUtil.toImmutable($obs.val()); })($self);
    $self.#level = $obs.level().toInt();
    $self.#isFirst = $obs.isFirst();
    $self.#who = ((this$) => { let $_u94 = $obs.who(); if ($_u94 == null) return null; return sys.ObjUtil.toImmutable($obs.who()); })($self);
    $self.#opts = sys.ObjUtil.coerce(((this$) => { let $_u95 = $obs.opts(); if ($_u95 != null) return $_u95; return haystack.Etc.emptyDict(); })($self), haystack.Dict.type$);
    $self.#extra = "";
    return;
  }

  static convert(orig,pt) {
    const $self = new ConnWriteInfo();
    ConnWriteInfo.convert$($self,orig,pt);
    return $self;
  }

  static convert$($self,orig,pt) {
    $self.#raw = ((this$) => { let $_u96 = orig.#val; if ($_u96 == null) return null; return sys.ObjUtil.toImmutable(orig.#val); })($self);
    $self.#val = ((this$) => { let $_u97 = pt.writeConvert().convert(pt.lib().pointLib(), pt.rec(), orig.#val); if ($_u97 == null) return null; return sys.ObjUtil.toImmutable(pt.writeConvert().convert(pt.lib().pointLib(), pt.rec(), orig.#val)); })($self);
    $self.#level = orig.#level;
    $self.#isFirst = orig.#isFirst;
    $self.#who = ((this$) => { let $_u98 = orig.#who; if ($_u98 == null) return null; return sys.ObjUtil.toImmutable(orig.#who); })($self);
    $self.#opts = orig.#opts;
    $self.#extra = orig.#extra;
    return;
  }

  static makeExtra(orig,extra) {
    const $self = new ConnWriteInfo();
    ConnWriteInfo.makeExtra$($self,orig,extra);
    return $self;
  }

  static makeExtra$($self,orig,extra) {
    $self.#raw = ((this$) => { let $_u99 = orig.#raw; if ($_u99 == null) return null; return sys.ObjUtil.toImmutable(orig.#raw); })($self);
    $self.#val = ((this$) => { let $_u100 = orig.#val; if ($_u100 == null) return null; return sys.ObjUtil.toImmutable(orig.#val); })($self);
    $self.#level = orig.#level;
    $self.#isFirst = orig.#isFirst;
    $self.#who = ((this$) => { let $_u101 = orig.#who; if ($_u101 == null) return null; return sys.ObjUtil.toImmutable(orig.#who); })($self);
    $self.#opts = orig.#opts;
    $self.#extra = extra;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#val), " @ "), sys.ObjUtil.coerce(this.#level, sys.Obj.type$.toNullable())), " ["), this.#who), "] "), this.#extra);
  }

  asMinTime() {
    return ConnWriteInfo.makeExtra(this, "minTime");
  }

  asMaxTime() {
    return ConnWriteInfo.makeExtra(this, "maxTime");
  }

  asOnOpen() {
    return ConnWriteInfo.makeExtra(this, "onOpen");
  }

}

class ConnTuningRoster extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#byId = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return ConnTuningRoster.type$; }

  #byId = null;

  // private field reflection only
  __byId(it) { if (it === undefined) return this.#byId; else this.#byId = it; }

  list() {
    return sys.ObjUtil.coerce(this.#byId.vals(ConnTuning.type$), sys.Type.find("hxConn::ConnTuning[]"));
  }

  get(id,checked) {
    if (checked === undefined) checked = true;
    let t = this.#byId.get(id);
    if (t != null) {
      return sys.ObjUtil.coerce(t, ConnTuning.type$.toNullable());
    }
    ;
    if (checked) {
      throw UnknownConnTuningErr.make(sys.Str.plus("Tuning rec not found: ", id.toZinc()));
    }
    ;
    return null;
  }

  forLib(lib) {
    return sys.ObjUtil.coerce(((this$) => { let $_u102 = this$.forRec(lib.rec()); if ($_u102 != null) return $_u102; return lib.tuningDefault(); })(this), ConnTuning.type$);
  }

  forRec(rec) {
    let ref = sys.ObjUtil.as(rec.get("connTuningRef"), haystack.Ref.type$);
    if (ref == null) {
      return null;
    }
    ;
    return this.getOrStub(sys.ObjUtil.coerce(ref, haystack.Ref.type$));
  }

  getOrStub(id) {
    let t = this.#byId.get(id);
    if (t != null) {
      return sys.ObjUtil.coerce(t, ConnTuning.type$);
    }
    ;
    (t = ConnTuning.make(haystack.Etc.makeDict1("id", id)));
    (t = this.#byId.getOrAdd(id, sys.ObjUtil.coerce(t, sys.Obj.type$)));
    return sys.ObjUtil.coerce(t, ConnTuning.type$);
  }

  onEvent(e) {
    if (e.isRemoved()) {
      this.#byId.remove(e.id());
    }
    else {
      let cur = sys.ObjUtil.as(this.#byId.get(e.id()), ConnTuning.type$);
      if (cur == null) {
        this.#byId.getOrAdd(e.id(), ConnTuning.make(e.newRec()));
      }
      else {
        cur.updateRec(e.newRec());
      }
      ;
    }
    ;
    return;
  }

  static make() {
    const $self = new ConnTuningRoster();
    ConnTuningRoster.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class ConnTuning extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnTuning.type$; }

  #configRef = null;

  // private field reflection only
  __configRef(it) { if (it === undefined) return this.#configRef; else this.#configRef = it; }

  static make(rec) {
    const $self = new ConnTuning();
    ConnTuning.make$($self,rec);
    return $self;
  }

  static make$($self,rec) {
    $self.#configRef = concurrent.AtomicRef.make(ConnTuningConfig.make(rec));
    return;
  }

  id() {
    return this.config().id();
  }

  rec() {
    return this.config().rec();
  }

  dis() {
    return this.config().dis();
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("ConnTuning [", this.rec().id().toZinc()), "]");
  }

  pollTime() {
    return this.config().pollTime();
  }

  staleTime() {
    return this.config().staleTime();
  }

  writeMinTime() {
    return this.config().writeMinTime();
  }

  writeMaxTime() {
    return this.config().writeMaxTime();
  }

  writeOnOpen() {
    return this.config().writeOnOpen();
  }

  writeOnStart() {
    return this.config().writeOnStart();
  }

  config() {
    return sys.ObjUtil.coerce(this.#configRef.val(), ConnTuningConfig.type$);
  }

  updateRec(newRec) {
    this.#configRef.val(ConnTuningConfig.make(newRec));
    return;
  }

}

class ConnTuningConfig extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnTuningConfig.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #pollTime = null;

  pollTime() { return this.#pollTime; }

  __pollTime(it) { if (it === undefined) return this.#pollTime; else this.#pollTime = it; }

  #staleTime = null;

  staleTime() { return this.#staleTime; }

  __staleTime(it) { if (it === undefined) return this.#staleTime; else this.#staleTime = it; }

  #writeMinTime = null;

  writeMinTime() { return this.#writeMinTime; }

  __writeMinTime(it) { if (it === undefined) return this.#writeMinTime; else this.#writeMinTime = it; }

  #writeMaxTime = null;

  writeMaxTime() { return this.#writeMaxTime; }

  __writeMaxTime(it) { if (it === undefined) return this.#writeMaxTime; else this.#writeMaxTime = it; }

  #writeOnOpen = false;

  writeOnOpen() { return this.#writeOnOpen; }

  __writeOnOpen(it) { if (it === undefined) return this.#writeOnOpen; else this.#writeOnOpen = it; }

  #writeOnStart = false;

  writeOnStart() { return this.#writeOnStart; }

  __writeOnStart(it) { if (it === undefined) return this.#writeOnStart; else this.#writeOnStart = it; }

  static make(rec) {
    const $self = new ConnTuningConfig();
    ConnTuningConfig.make$($self,rec);
    return $self;
  }

  static make$($self,rec) {
    $self.#id = rec.id();
    $self.#rec = rec;
    $self.#dis = $self.#id.dis();
    $self.#pollTime = sys.ObjUtil.coerce($self.toDuration("pollTime", sys.Duration.fromStr("10sec")), sys.Duration.type$);
    $self.#staleTime = sys.ObjUtil.coerce($self.toDuration("staleTime", sys.Duration.fromStr("5min")), sys.Duration.type$);
    $self.#writeMinTime = $self.toDuration("writeMinTime", null);
    $self.#writeMaxTime = $self.toDuration("writeMaxTime", null);
    $self.#writeOnStart = rec.has("writeOnStart");
    $self.#writeOnOpen = rec.has("writeOnOpen");
    return;
  }

  toDuration(tag,def) {
    let num = sys.ObjUtil.as(this.#rec.get(tag), haystack.Number.type$);
    if (num == null) {
      return def;
    }
    ;
    try {
      let dur = num.toDuration();
      if (sys.ObjUtil.compareLT(dur, sys.Duration.fromStr("10ms"))) {
        (dur = sys.Duration.fromStr("10ms"));
      }
      ;
      return dur;
    }
    catch ($_u103) {
      return def;
    }
    ;
  }

}

class ConnModel extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnModel.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #connTag = null;

  connTag() { return this.#connTag; }

  __connTag(it) { if (it === undefined) return this.#connTag; else this.#connTag = it; }

  #connRefTag = null;

  connRefTag() { return this.#connRefTag; }

  __connRefTag(it) { if (it === undefined) return this.#connRefTag; else this.#connRefTag = it; }

  #pointTag = null;

  pointTag() { return this.#pointTag; }

  __pointTag(it) { if (it === undefined) return this.#pointTag; else this.#pointTag = it; }

  #curTag = null;

  curTag() { return this.#curTag; }

  __curTag(it) { if (it === undefined) return this.#curTag; else this.#curTag = it; }

  #writeTag = null;

  writeTag() { return this.#writeTag; }

  __writeTag(it) { if (it === undefined) return this.#writeTag; else this.#writeTag = it; }

  #writeLevelTag = null;

  writeLevelTag() { return this.#writeLevelTag; }

  __writeLevelTag(it) { if (it === undefined) return this.#writeLevelTag; else this.#writeLevelTag = it; }

  #hisTag = null;

  hisTag() { return this.#hisTag; }

  __hisTag(it) { if (it === undefined) return this.#hisTag; else this.#hisTag = it; }

  #curTagType = null;

  curTagType() { return this.#curTagType; }

  __curTagType(it) { if (it === undefined) return this.#curTagType; else this.#curTagType = it; }

  #writeTagType = null;

  writeTagType() { return this.#writeTagType; }

  __writeTagType(it) { if (it === undefined) return this.#writeTagType; else this.#writeTagType = it; }

  #hisTagType = null;

  hisTagType() { return this.#hisTagType; }

  __hisTagType(it) { if (it === undefined) return this.#hisTagType; else this.#hisTagType = it; }

  #pollMode = null;

  pollMode() { return this.#pollMode; }

  __pollMode(it) { if (it === undefined) return this.#pollMode; else this.#pollMode = it; }

  #pollFreqTag = null;

  pollFreqTag() { return this.#pollFreqTag; }

  __pollFreqTag(it) { if (it === undefined) return this.#pollFreqTag; else this.#pollFreqTag = it; }

  #pollFreqDefault = null;

  pollFreqDefault() { return this.#pollFreqDefault; }

  __pollFreqDefault(it) { if (it === undefined) return this.#pollFreqDefault; else this.#pollFreqDefault = it; }

  #dispatchType = null;

  dispatchType() { return this.#dispatchType; }

  __dispatchType(it) { if (it === undefined) return this.#dispatchType; else this.#dispatchType = it; }

  #features = null;

  features() { return this.#features; }

  __features(it) { if (it === undefined) return this.#features; else this.#features = it; }

  #hasLearn = false;

  hasLearn() { return this.#hasLearn; }

  __hasLearn(it) { if (it === undefined) return this.#hasLearn; else this.#hasLearn = it; }

  #hasCur = false;

  hasCur() { return this.#hasCur; }

  __hasCur(it) { if (it === undefined) return this.#hasCur; else this.#hasCur = it; }

  #hasWrite = false;

  hasWrite() { return this.#hasWrite; }

  __hasWrite(it) { if (it === undefined) return this.#hasWrite; else this.#hasWrite = it; }

  #hasHis = false;

  hasHis() { return this.#hasHis; }

  __hasHis(it) { if (it === undefined) return this.#hasHis; else this.#hasHis = it; }

  static make(lib) {
    const $self = new ConnModel();
    ConnModel.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    $self.#name = lib.name();
    let prefix = $self.#name;
    let ns = lib.rt().ns();
    let libDef = lib.def();
    let connDef = ConnModel.def(ns, lib, sys.Str.plus(sys.Str.plus("", prefix), "Conn"));
    let features = ((this$) => { let $_u104 = sys.ObjUtil.as(connDef.get("connFeatures"), haystack.Dict.type$); if ($_u104 != null) return $_u104; return haystack.Etc.emptyDict(); })($self);
    $self.#connTag = connDef.name();
    $self.#connRefTag = ConnModel.def(ns, lib, sys.Str.plus(sys.Str.plus("", prefix), "ConnRef")).name();
    $self.#pointTag = ConnModel.def(ns, lib, sys.Str.plus(sys.Str.plus("", prefix), "Point")).name();
    let curTagDef = ConnModel.def(ns, lib, sys.Str.plus(sys.Str.plus("", prefix), "Cur"), false);
    if (curTagDef != null) {
      $self.#curTag = curTagDef.name();
      $self.#curTagType = ConnModel.toAddrType(sys.ObjUtil.coerce(curTagDef, haystack.Def.type$));
    }
    ;
    let writeTagDef = ConnModel.def(ns, lib, sys.Str.plus(sys.Str.plus("", prefix), "Write"), false);
    if (writeTagDef != null) {
      $self.#writeTag = writeTagDef.name();
      $self.#writeTagType = ConnModel.toAddrType(sys.ObjUtil.coerce(writeTagDef, haystack.Def.type$));
      $self.#writeLevelTag = ((this$) => { let $_u105 = ConnModel.def(ns, lib, sys.Str.plus(sys.Str.plus("", prefix), "WriteLevel"), false); if ($_u105 == null) return null; return ConnModel.def(ns, lib, sys.Str.plus(sys.Str.plus("", prefix), "WriteLevel"), false).name(); })($self);
    }
    ;
    let hisTagDef = ConnModel.def(ns, lib, sys.Str.plus(sys.Str.plus("", prefix), "His"), false);
    if (hisTagDef != null) {
      $self.#hisTag = hisTagDef.name();
      $self.#hisTagType = ConnModel.toAddrType(sys.ObjUtil.coerce(hisTagDef, haystack.Def.type$));
    }
    ;
    $self.#hasLearn = features.has("learn");
    $self.#hasCur = $self.#curTag != null;
    $self.#hasWrite = $self.#writeTag != null;
    $self.#hasHis = $self.#hisTag != null;
    $self.#pollMode = sys.ObjUtil.coerce(ConnPollMode.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u106 = features.get("pollMode"); if ($_u106 != null) return $_u106; return "disabled"; })($self), sys.Str.type$)), ConnPollMode.type$);
    if ($self.#pollMode === ConnPollMode.manual()) {
      let pollFreqTagDef = ConnModel.def(ns, lib, sys.Str.plus(sys.Str.plus("", prefix), "PollFreq"));
      $self.#pollFreqTag = pollFreqTagDef.name();
      $self.#pollFreqDefault = ((this$) => { let $_u107 = ((this$) => { let $_u108 = sys.ObjUtil.as(pollFreqTagDef.get("val"), haystack.Number.type$); if ($_u108 == null) return null; return sys.ObjUtil.as(pollFreqTagDef.get("val"), haystack.Number.type$).toDuration(); })(this$); if ($_u107 != null) return $_u107; return sys.Duration.fromStr("10sec"); })($self);
    }
    ;
    $self.#dispatchType = sys.ObjUtil.coerce(sys.ObjUtil.typeof(lib).pod().type(sys.Str.plus(sys.Str.capitalize($self.#name), "Dispatch")), sys.Type.type$);
    let f = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    f.set("name", $self.#name);
    if ($self.#hasCur) {
      f.set("cur", haystack.Marker.val());
    }
    ;
    if ($self.#hasHis) {
      f.set("his", haystack.Marker.val());
    }
    ;
    if ($self.#hasWrite) {
      f.set("write", haystack.Marker.val());
    }
    ;
    if ($self.#hasLearn) {
      f.set("learn", haystack.Marker.val());
    }
    ;
    $self.#features = haystack.Etc.makeDict(f);
    return;
  }

  static def(ns,lib,symbol,checked) {
    if (checked === undefined) checked = true;
    let def = ns.def(symbol, false);
    if (def == null) {
      if (checked) {
        throw sys.Err.make(sys.Str.plus("Missing required def: ", symbol));
      }
      ;
      return null;
    }
    ;
    if (def.lib() !== ns.lib(lib.name())) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Def in wrong lib: ", symbol), " ["), def.lib()), " != "), lib.def()), "]"));
    }
    ;
    return def;
  }

  static toAddrType(def) {
    let symbol = sys.ObjUtil.coerce(def.get("is"), sys.Type.find("haystack::Symbol[]")).get(0).name();
    if (sys.ObjUtil.equals(symbol, "str")) {
      return sys.Str.type$;
    }
    ;
    if (sys.ObjUtil.equals(symbol, "uri")) {
      return sys.Uri.type$;
    }
    ;
    throw sys.Err.make(sys.Str.plus("Unsupported point address type: ", symbol));
  }

}

class ConnPoint extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#isWatchedRef = concurrent.AtomicBool.make(false);
    this.#dataRef = concurrent.AtomicRef.make();
    this.#committer = ConnCommitter.make();
    this.#curStateRef = concurrent.AtomicRef.make(ConnPointCurState.nil());
    this.#writeStateRef = concurrent.AtomicRef.make(ConnPointWriteState.nil());
    this.#hisStateRef = concurrent.AtomicRef.make(ConnPointHisState.nil());
    return;
  }

  typeof() { return ConnPoint.type$; }

  #connRef = null;

  // private field reflection only
  __connRef(it) { if (it === undefined) return this.#connRef; else this.#connRef = it; }

  #idRef = null;

  // private field reflection only
  __idRef(it) { if (it === undefined) return this.#idRef; else this.#idRef = it; }

  #isWatchedRef = null;

  isWatchedRef() { return this.#isWatchedRef; }

  __isWatchedRef(it) { if (it === undefined) return this.#isWatchedRef; else this.#isWatchedRef = it; }

  #dataRef = null;

  // private field reflection only
  __dataRef(it) { if (it === undefined) return this.#dataRef; else this.#dataRef = it; }

  #configRef = null;

  // private field reflection only
  __configRef(it) { if (it === undefined) return this.#configRef; else this.#configRef = it; }

  #committer = null;

  // private field reflection only
  __committer(it) { if (it === undefined) return this.#committer; else this.#committer = it; }

  #curStateRef = null;

  // private field reflection only
  __curStateRef(it) { if (it === undefined) return this.#curStateRef; else this.#curStateRef = it; }

  #writeStateRef = null;

  // private field reflection only
  __writeStateRef(it) { if (it === undefined) return this.#writeStateRef; else this.#writeStateRef = it; }

  #hisStateRef = null;

  // private field reflection only
  __hisStateRef(it) { if (it === undefined) return this.#hisStateRef; else this.#hisStateRef = it; }

  static make(conn,rec) {
    const $self = new ConnPoint();
    ConnPoint.make$($self,conn,rec);
    return $self;
  }

  static make$($self,conn,rec) {
    ;
    $self.#connRef = conn;
    $self.#idRef = rec.id();
    $self.#configRef = concurrent.AtomicRef.make(ConnPointConfig.make(conn.lib(), rec));
    $self.#isWatchedRef.val(conn.rt().watch().isWatched($self.id()));
    return;
  }

  lib() {
    return this.#connRef.lib();
  }

  conn() {
    return this.#connRef;
  }

  id() {
    return this.#idRef;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("ConnPoint [", this.id().toZinc()), "]");
  }

  dis() {
    return this.config().dis();
  }

  rec() {
    return this.config().rec();
  }

  curAddr() {
    return this.config().curAddr();
  }

  writeAddr() {
    return this.config().writeAddr();
  }

  hisAddr() {
    return this.config().hisAddr();
  }

  isCurEnabled() {
    return this.config().isCurEnabled();
  }

  isWriteEnabled() {
    return this.config().isWriteEnabled();
  }

  isHisEnabled() {
    return this.config().isHisEnabled();
  }

  kind() {
    return sys.ObjUtil.coerce(this.config().kind(), haystack.Kind.type$);
  }

  tz() {
    return this.config().tz();
  }

  unit() {
    return this.config().unit();
  }

  tuning() {
    return sys.ObjUtil.coerce(((this$) => { let $_u109 = this$.config().tuning(); if ($_u109 != null) return $_u109; return this$.conn().tuning(); })(this), ConnTuning.type$);
  }

  curCalibration() {
    return this.config().curCalibration();
  }

  curConvert() {
    return this.config().curConvert();
  }

  writeConvert() {
    return this.config().writeConvert();
  }

  hisConvert() {
    return this.config().hisConvert();
  }

  isEnabled() {
    return !this.config().isDisabled();
  }

  isDisabled() {
    return this.config().isDisabled();
  }

  isWatched() {
    return this.#isWatchedRef.val();
  }

  data() {
    return this.#dataRef.val();
  }

  setData(mgr,val) {
    this.#dataRef.val(val);
    return;
  }

  config() {
    return sys.ObjUtil.coerce(this.#configRef.val(), ConnPointConfig.type$);
  }

  setConfig(mgr,c) {
    this.#configRef.val(c);
    return;
  }

  updateCurOk(val) {
    let s = ConnPointCurState.updateOk(this, val);
    this.#curStateRef.val(s);
    this.updateCurTags(sys.ObjUtil.coerce(s, ConnPointCurState.type$));
    return;
  }

  updateCurErr(err) {
    let s = ConnPointCurState.updateErr(this, err);
    this.#curStateRef.val(s);
    this.updateCurTags(sys.ObjUtil.coerce(s, ConnPointCurState.type$));
    return;
  }

  updateCurStale() {
    let s = ConnPointCurState.updateStale(this);
    this.#curStateRef.val(s);
    this.#committer.commit1(this.lib(), this.rec(), "curStatus", s.status().name());
    return;
  }

  updateCurQuickPoll(quickPoll) {
    this.#curStateRef.val(ConnPointCurState.updateQuickPoll(this, quickPoll));
    return;
  }

  updateCurTags(s) {
    let status = s.status();
    let val = null;
    let err = null;
    let config = this.config();
    if (config.curFault() != null) {
      (status = ConnStatus.fault());
      (err = config.curFault());
    }
    else {
      if (config.isDisabled()) {
        (status = ConnStatus.disabled());
        (err = "Point is disabled");
      }
      else {
        if (!this.conn().status().isOk()) {
          (status = this.conn().status());
          (err = sys.Str.plus("conn ", status));
        }
        else {
          if (status.isOk()) {
            (val = s.val());
          }
          else {
            (err = ConnStatus.toErrStr(s.err()));
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    this.#committer.commit3(this.lib(), this.rec(), "curStatus", status.name(), "curVal", val, "curErr", err);
    return;
  }

  curState() {
    return sys.ObjUtil.coerce(this.#curStateRef.val(), ConnPointCurState.type$);
  }

  updateWriteOk(info) {
    let s = ConnPointWriteState.updateOk(this, info);
    this.#writeStateRef.val(s);
    this.updateWriteTags(sys.ObjUtil.coerce(s, ConnPointWriteState.type$));
    return;
  }

  updateWriteErr(info,err) {
    let s = ConnPointWriteState.updateErr(this, info, err);
    this.#writeStateRef.val(s);
    this.updateWriteTags(sys.ObjUtil.coerce(s, ConnPointWriteState.type$));
    return;
  }

  writeState() {
    return sys.ObjUtil.coerce(this.#writeStateRef.val(), ConnPointWriteState.type$);
  }

  updateWriteReceived(lastInfo) {
    this.#writeStateRef.val(ConnPointWriteState.updateReceived(this, lastInfo));
    return;
  }

  updateWritePending(pending) {
    this.#writeStateRef.val(ConnPointWriteState.updatePending(this, pending));
    return;
  }

  updateWriteQueued(queued) {
    this.#writeStateRef.val(ConnPointWriteState.updateQueued(this, queued));
    return;
  }

  updateWriteTags(s) {
    let status = s.status();
    let val = null;
    let err = null;
    let level = null;
    let config = this.config();
    if (config.writeFault() != null) {
      (status = ConnStatus.fault());
      (err = config.writeFault());
    }
    else {
      if (config.isDisabled()) {
        (status = ConnStatus.disabled());
        (err = "Point is disabled");
      }
      else {
        if (!this.conn().status().isOk()) {
          (status = this.conn().status());
          (err = sys.Str.plus("conn ", status));
        }
        else {
          if (status.isOk()) {
            (val = s.raw());
            (level = ConnUtil.levelToNumber(s.level()));
          }
          else {
            (err = ConnStatus.toErrStr(s.err()));
            (level = ConnUtil.levelToNumber(s.level()));
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    this.#committer.commit2(this.lib(), this.rec(), "writeStatus", status.name(), "writeErr", err);
    return;
  }

  updateHisOk(items,span) {
    let s = ConnPointHisState.updateOk(this, items, span);
    this.#hisStateRef.val(s);
    this.updateHisTags(sys.ObjUtil.coerce(s, ConnPointHisState.type$));
    return haystack.Etc.makeDict2("id", this.id(), "num", haystack.Number.makeInt(items.size()));
  }

  updateHisErr(err) {
    let s = ConnPointHisState.updateErr(this, err);
    this.#hisStateRef.val(s);
    this.updateHisTags(sys.ObjUtil.coerce(s, ConnPointHisState.type$));
    return haystack.Etc.makeDict2("id", this.id(), "err", err.toStr());
  }

  updateHisPending() {
    this.#committer.commit1(this.lib(), this.rec(), "hisStatus", "pending");
    return;
  }

  hisState() {
    return sys.ObjUtil.coerce(this.#hisStateRef.val(), ConnPointHisState.type$);
  }

  updateHisTags(s) {
    let status = s.status();
    let err = null;
    let config = this.config();
    if (config.writeFault() != null) {
      (status = ConnStatus.fault());
      (err = config.writeFault());
    }
    else {
      if (config.isDisabled()) {
        (status = ConnStatus.disabled());
        (err = "Point is disabled");
      }
      else {
        if (!this.conn().status().isOk()) {
          (status = this.conn().status());
          (err = sys.Str.plus("conn ", status));
        }
        else {
          if (!status.isOk()) {
            (err = ConnStatus.toErrStr(s.err()));
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    this.#committer.commit2(this.lib(), this.rec(), "hisStatus", status.name(), "hisErr", err);
    return;
  }

  onConnStatus() {
    this.updateStatus();
    return;
  }

  updateStatus() {
    let c = this.config();
    if (c.curAddr() != null) {
      this.updateCurTags(this.curState());
    }
    ;
    if (c.writeAddr() != null) {
      this.updateWriteTags(this.writeState());
    }
    ;
    if (c.hisAddr() != null) {
      this.updateHisTags(this.hisState());
    }
    ;
    return;
  }

  details() {
    const this$ = this;
    let model = this.lib().model();
    let s = sys.StrBuf.make();
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("id:             ", this.id()), "\ndis:            "), this.dis()), "\nrt:             "), this.lib().rt().platform().hostModel()), " ["), this.lib().rt().version()), "]\nlib:            "), sys.ObjUtil.typeof(this.lib())), " ["), sys.ObjUtil.typeof(this.lib()).pod().version()), "]\nconn:           "), this.conn().dis()), " ["), this.conn().id()), "] "), this.conn().status()), "\nkind:           "), this.kind()), "\ntz:             "), this.tz()), "\nunit:           "), this.unit()), "\ntuning:         "), this.tuning().rec().id().toZinc()), "\ndata:           "), this.data()), "\nisWatched:      "), sys.ObjUtil.coerce(this.isWatched(), sys.Obj.type$.toNullable())), "\n\n"));
    ConnPoint.detailsAddr(s, model.curTag(), this.curAddr());
    ConnPoint.detailsAddr(s, model.writeTag(), this.writeAddr());
    ConnPoint.detailsAddr(s, model.hisTag(), this.hisAddr());
    s.add("\n");
    this.#committer.details(s);
    let extra = sys.Str.trim(this.lib().onPointDetails(this));
    if (!sys.Str.isEmpty(extra)) {
      s.add("\n").add(extra).add("\n");
    }
    ;
    let watches = this.lib().rt().watch().listOn(this.id());
    s.add(sys.Str.plus(sys.Str.plus("\nWatches (", sys.ObjUtil.coerce(watches.size(), sys.Obj.type$.toNullable())), ")\n=============================\n"));
    if (watches.isEmpty()) {
      s.add("none\n");
    }
    else {
      watches.each((w) => {
        s.add(w.dis()).add(" (lastRenew: ").add(haystack.Etc.debugDur(sys.ObjUtil.coerce(w.lastRenew().ticks(), sys.Obj.type$.toNullable()))).add(", lease: ").add(w.lease()).add(")\n");
        return;
      });
    }
    ;
    if (this.curAddr() != null) {
      s.add("\nConn Cur\n=============================\n");
      this.curState().details(s, this);
    }
    ;
    if (this.writeAddr() != null) {
      s.add("\nConn Write\n=============================\n");
      this.writeState().details(s, this);
    }
    ;
    if ((this.hisAddr() != null || this.hisState() !== ConnPointHisState.nil())) {
      s.add("\nConn His Sync\n=============================\n");
      this.hisState().details(s, this);
    }
    ;
    try {
      let more = hxPoint.PointUtil.pointDetails(this.conn().pointLib(), this.rec(), false);
      s.add(more);
    }
    catch ($_u110) {
      $_u110 = sys.Err.make($_u110);
      if ($_u110 instanceof sys.Err) {
        let e = $_u110;
        ;
        this.conn().log().err("pointDetails", e);
      }
      else {
        throw $_u110;
      }
    }
    ;
    return s.toStr();
  }

  static detailsAddr(s,tag,val) {
    if (tag == null) {
      return;
    }
    ;
    s.add(sys.Str.padr(sys.Str.plus(sys.Str.plus("", tag), ":"), 16)).add(((this$) => { if (val == null) return "-"; return haystack.ZincWriter.valToStr(val); })(this)).add("\n");
    return;
  }

}

class ConnPointConfig extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConnPointConfig.type$; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #tz = null;

  tz() { return this.#tz; }

  __tz(it) { if (it === undefined) return this.#tz; else this.#tz = it; }

  #unit = null;

  unit() { return this.#unit; }

  __unit(it) { if (it === undefined) return this.#unit; else this.#unit = it; }

  #kind = null;

  kind() { return this.#kind; }

  __kind(it) { if (it === undefined) return this.#kind; else this.#kind = it; }

  #tuning = null;

  tuning() { return this.#tuning; }

  __tuning(it) { if (it === undefined) return this.#tuning; else this.#tuning = it; }

  #curAddr = null;

  curAddr() { return this.#curAddr; }

  __curAddr(it) { if (it === undefined) return this.#curAddr; else this.#curAddr = it; }

  #writeAddr = null;

  writeAddr() { return this.#writeAddr; }

  __writeAddr(it) { if (it === undefined) return this.#writeAddr; else this.#writeAddr = it; }

  #hisAddr = null;

  hisAddr() { return this.#hisAddr; }

  __hisAddr(it) { if (it === undefined) return this.#hisAddr; else this.#hisAddr = it; }

  #isDisabled = false;

  isDisabled() { return this.#isDisabled; }

  __isDisabled(it) { if (it === undefined) return this.#isDisabled; else this.#isDisabled = it; }

  #curFault = null;

  curFault() { return this.#curFault; }

  __curFault(it) { if (it === undefined) return this.#curFault; else this.#curFault = it; }

  #writeFault = null;

  writeFault() { return this.#writeFault; }

  __writeFault(it) { if (it === undefined) return this.#writeFault; else this.#writeFault = it; }

  #hisFault = null;

  hisFault() { return this.#hisFault; }

  __hisFault(it) { if (it === undefined) return this.#hisFault; else this.#hisFault = it; }

  #curCalibration = null;

  curCalibration() { return this.#curCalibration; }

  __curCalibration(it) { if (it === undefined) return this.#curCalibration; else this.#curCalibration = it; }

  #curConvert = null;

  curConvert() { return this.#curConvert; }

  __curConvert(it) { if (it === undefined) return this.#curConvert; else this.#curConvert = it; }

  #writeConvert = null;

  writeConvert() { return this.#writeConvert; }

  __writeConvert(it) { if (it === undefined) return this.#writeConvert; else this.#writeConvert = it; }

  #hisConvert = null;

  hisConvert() { return this.#hisConvert; }

  __hisConvert(it) { if (it === undefined) return this.#hisConvert; else this.#hisConvert = it; }

  static make(lib,rec) {
    const $self = new ConnPointConfig();
    ConnPointConfig.make$($self,lib,rec);
    return $self;
  }

  static make$($self,lib,rec) {
    let model = lib.model();
    $self.#rec = rec;
    $self.#dis = sys.ObjUtil.coerce(rec.dis(), sys.Str.type$);
    $self.#tz = sys.TimeZone.cur();
    $self.#kind = haystack.Kind.obj();
    try {
      $self.#isDisabled = rec.has("disabled");
      $self.#curAddr = ((this$) => { let $_u112 = ConnPointConfig.toAddr(model, rec, model.curTag()); if ($_u112 == null) return null; return sys.ObjUtil.toImmutable(ConnPointConfig.toAddr(model, rec, model.curTag())); })($self);
      $self.#writeAddr = ((this$) => { let $_u113 = ConnPointConfig.toAddr(model, rec, model.writeTag()); if ($_u113 == null) return null; return sys.ObjUtil.toImmutable(ConnPointConfig.toAddr(model, rec, model.writeTag())); })($self);
      $self.#hisAddr = ((this$) => { let $_u114 = ConnPointConfig.toAddr(model, rec, model.hisTag()); if ($_u114 == null) return null; return sys.ObjUtil.toImmutable(ConnPointConfig.toAddr(model, rec, model.hisTag())); })($self);
      $self.#curFault = ConnPointConfig.toAddrFault(model.curTag(), $self.#curAddr, model.curTagType());
      $self.#writeFault = ConnPointConfig.toAddrFault(model.writeTag(), $self.#writeAddr, model.writeTagType());
      $self.#hisFault = ConnPointConfig.toAddrFault(model.hisTag(), $self.#hisAddr, model.hisTagType());
      $self.#tz = sys.ObjUtil.coerce(((this$) => { if (rec.has("tz")) return folio.FolioUtil.hisTz(rec); return sys.TimeZone.cur(); })($self), sys.TimeZone.type$);
      $self.#unit = folio.FolioUtil.hisUnit(rec);
      $self.#kind = folio.FolioUtil.hisKind(rec);
      $self.#tuning = lib.tunings().forRec(rec);
      $self.#curCalibration = sys.ObjUtil.as(rec.get("curCalibration"), haystack.Number.type$);
      $self.#curConvert = ConnPointConfig.toConvert(rec, "curConvert");
      $self.#writeConvert = ConnPointConfig.toConvert(rec, "writeConvert");
      $self.#hisConvert = ConnPointConfig.toConvert(rec, "hisConvert");
    }
    catch ($_u116) {
      $_u116 = sys.Err.make($_u116);
      if ($_u116 instanceof sys.Err) {
        let e = $_u116;
        ;
        let fault = e.msg();
        if ($self.#curAddr != null) {
          $self.#curFault = ((this$) => { let $_u117 = this$.#curFault; if ($_u117 != null) return $_u117; return fault; })($self);
        }
        ;
        if ($self.#writeAddr != null) {
          $self.#writeFault = ((this$) => { let $_u118 = this$.#writeFault; if ($_u118 != null) return $_u118; return fault; })($self);
        }
        ;
        if ($self.#hisAddr != null) {
          $self.#hisFault = ((this$) => { let $_u119 = this$.#hisFault; if ($_u119 != null) return $_u119; return fault; })($self);
        }
        ;
      }
      else {
        throw $_u116;
      }
    }
    ;
    return;
  }

  static toAddr(model,rec,tag) {
    if (tag == null) {
      return null;
    }
    ;
    let val = rec.get(sys.ObjUtil.coerce(tag, sys.Str.type$));
    if (val == null) {
      return null;
    }
    ;
    return val;
  }

  static toAddrFault(tag,val,type) {
    if (val == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.typeof(val) !== type) {
      return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid type for '", tag), "' ["), sys.ObjUtil.typeof(val).name()), " != "), type.name()), "]");
    }
    ;
    return null;
  }

  static toConvert(rec,tag) {
    let str = rec.get(tag);
    if (str == null) {
      return null;
    }
    ;
    if (!sys.ObjUtil.is(str, sys.Str.type$)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("Point convert not string: '", tag), "'"));
    }
    ;
    if (sys.Str.isEmpty(sys.ObjUtil.toStr(str))) {
      return null;
    }
    ;
    return ((this$) => { let $_u120 = hxPoint.PointConvert.fromStr(sys.ObjUtil.coerce(str, sys.Str.type$), false); if ($_u120 != null) return $_u120; throw sys.Err.make(sys.Str.plus(sys.Str.plus("Point convert invalid: '", tag), "'")); })(this);
  }

  isEnabled() {
    return !this.#isDisabled;
  }

  isCurEnabled() {
    return (this.#curAddr != null && this.#curFault == null && this.isEnabled());
  }

  isWriteEnabled() {
    return (this.#writeAddr != null && this.#writeFault == null && this.isEnabled());
  }

  isHisEnabled() {
    return (this.#hisAddr != null && this.#hisFault == null && this.isEnabled());
  }

  isStatusUpdate(b) {
    let a = this;
    if (sys.ObjUtil.compareNE(a.#isDisabled, b.#isDisabled)) {
      return true;
    }
    ;
    if (sys.ObjUtil.compareNE(a.#curFault, b.#curFault)) {
      return true;
    }
    ;
    if (sys.ObjUtil.compareNE(a.#writeFault, b.#writeFault)) {
      return true;
    }
    ;
    if (sys.ObjUtil.compareNE(a.#hisFault, b.#hisFault)) {
      return true;
    }
    ;
    return false;
  }

}

const p = sys.Pod.add$('hxConn');
const xp = sys.Param.noParams$();
let m;
ConnTrace.type$ = p.at$('ConnTrace','concurrent::Actor',[],{},8194,ConnTrace);
ConnTraceMsg.type$ = p.at$('ConnTraceMsg','sys::Obj',[],{},8226,ConnTraceMsg);
ConnTraceLog.type$ = p.at$('ConnTraceLog','sys::Log',[],{},130,ConnTraceLog);
ConnTraceFeed.type$ = p.at$('ConnTraceFeed','hx::HxFeed',[],{},130,ConnTraceFeed);
ConnTraceActor.type$ = p.at$('ConnTraceActor','concurrent::Actor',[],{},130,ConnTraceActor);
ConnPointHisState.type$ = p.at$('ConnPointHisState','sys::Obj',[],{},162,ConnPointHisState);
ConnLib.type$ = p.at$('ConnLib','hx::HxLib',['hx::HxConnLib'],{},8195,ConnLib);
ConnSettings.type$ = p.at$('ConnSettings','haystack::TypedDict',[],{},8194,ConnSettings);
RemoteStatusErr.type$ = p.at$('RemoteStatusErr','sys::Err',[],{},8194,RemoteStatusErr);
UnknownConnLibErr.type$ = p.at$('UnknownConnLibErr','sys::Err',[],{'sys::NoDoc':""},8194,UnknownConnLibErr);
UnknownConnErr.type$ = p.at$('UnknownConnErr','sys::Err',[],{'sys::NoDoc':""},8194,UnknownConnErr);
UnknownConnPointErr.type$ = p.at$('UnknownConnPointErr','sys::Err',[],{'sys::NoDoc':""},8194,UnknownConnPointErr);
UnknownConnTuningErr.type$ = p.at$('UnknownConnTuningErr','sys::Err',[],{'sys::NoDoc':""},8194,UnknownConnTuningErr);
NotOpenLibErr.type$ = p.at$('NotOpenLibErr','sys::Err',[],{'sys::NoDoc':""},8194,NotOpenLibErr);
ConnService.type$ = p.at$('ConnService','sys::Obj',['hx::HxConnService'],{'sys::NoDoc':""},8194,ConnService);
ConnServiceLibData.type$ = p.at$('ConnServiceLibData','sys::Obj',[],{},130,ConnServiceLibData);
Conn.type$ = p.at$('Conn','concurrent::Actor',['hx::HxConn'],{},8226,Conn);
ConnThreadDebug.type$ = p.at$('ConnThreadDebug','sys::Obj',[],{},130,ConnThreadDebug);
ConnConfig.type$ = p.at$('ConnConfig','sys::Obj',[],{},162,ConnConfig);
ConnVars.type$ = p.at$('ConnVars','sys::Obj',[],{},162,ConnVars);
ConnPointCurState.type$ = p.at$('ConnPointCurState','sys::Obj',[],{},162,ConnPointCurState);
ConnUtil.type$ = p.at$('ConnUtil','sys::Obj',[],{'sys::NoDoc':""},8226,ConnUtil);
ConnPoller.type$ = p.at$('ConnPoller','concurrent::Actor',[],{},130,ConnPoller);
ConnPollMode.type$ = p.at$('ConnPollMode','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,ConnPollMode);
ConnPollBucket.type$ = p.at$('ConnPollBucket','sys::Obj',[],{'sys::NoDoc':""},8194,ConnPollBucket);
ConnPollBucketState.type$ = p.at$('ConnPollBucketState','sys::Obj',[],{'sys::NoDoc':""},8194,ConnPollBucketState);
ConnFwFuncs.type$ = p.at$('ConnFwFuncs','sys::Obj',[],{'sys::NoDoc':""},8194,ConnFwFuncs);
ConnCommitter.type$ = p.at$('ConnCommitter','sys::Obj',[],{},162,ConnCommitter);
ConnFwLib.type$ = p.at$('ConnFwLib','hx::HxLib',[],{'sys::NoDoc':""},8194,ConnFwLib);
ConnRoster.type$ = p.at$('ConnRoster','sys::Obj',[],{},162,ConnRoster);
ConnMgr.type$ = p.at$('ConnMgr','sys::Obj',[],{},160,ConnMgr);
AbstractSyncHis.type$ = p.at$('AbstractSyncHis','sys::Obj',[],{'sys::NoDoc':""},8193,AbstractSyncHis);
ConnSyncHis.type$ = p.at$('ConnSyncHis','hxConn::AbstractSyncHis',[],{},128,ConnSyncHis);
ConnStatus.type$ = p.at$('ConnStatus','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,ConnStatus);
ConnState.type$ = p.at$('ConnState','sys::Enum',[],{'sys::NoDoc':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,ConnState);
ConnDispatch.type$ = p.at$('ConnDispatch','sys::Obj',[],{},8193,ConnDispatch);
ConnPointWriteState.type$ = p.at$('ConnPointWriteState','sys::Obj',[],{},162,ConnPointWriteState);
ConnWriteInfo.type$ = p.at$('ConnWriteInfo','sys::Obj',[],{},8194,ConnWriteInfo);
ConnTuningRoster.type$ = p.at$('ConnTuningRoster','sys::Obj',[],{'sys::NoDoc':""},8226,ConnTuningRoster);
ConnTuning.type$ = p.at$('ConnTuning','sys::Obj',[],{},8226,ConnTuning);
ConnTuningConfig.type$ = p.at$('ConnTuningConfig','sys::Obj',[],{},130,ConnTuningConfig);
ConnModel.type$ = p.at$('ConnModel','sys::Obj',[],{'sys::NoDoc':""},8226,ConnModel);
ConnPoint.type$ = p.at$('ConnPoint','sys::Obj',['hx::HxConnPoint'],{},8226,ConnPoint);
ConnPointConfig.type$ = p.at$('ConnPointConfig','sys::Obj',[],{},162,ConnPointConfig);
ConnTrace.type$.af$('log',65666,'sys::Log',{}).af$('actor',67586,'hxConn::ConnTraceActor',{}).af$('enabled',67586,'concurrent::AtomicBool',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pool','concurrent::ActorPool',false)]),{}).am$('max',8192,'sys::Int',xp,{}).am$('isEnabled',8192,'sys::Bool',xp,{}).am$('enable',8192,'sys::Void',xp,{}).am$('disable',8192,'sys::Void',xp,{}).am$('clear',8192,'sys::Void',xp,{}).am$('read',8192,'hxConn::ConnTraceMsg[]',xp,{}).am$('readSince',8192,'hxConn::ConnTraceMsg[]',sys.List.make(sys.Param.type$,[new sys.Param('since','sys::DateTime?',false)]),{}).am$('write',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('msg','sys::Str',false),new sys.Param('arg','sys::Obj?',true)]),{}).am$('phase',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('arg','sys::Obj?',true)]),{}).am$('dispatch',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('poll',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('arg','sys::Obj?',true)]),{}).am$('req',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('arg','sys::Obj',false)]),{}).am$('res',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('arg','sys::Obj',false)]),{}).am$('event',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('arg','sys::Obj',false)]),{}).am$('asLog',8192,'sys::Log',xp,{});
ConnTraceMsg.type$.af$('ts',73730,'sys::DateTime',{}).af$('type',73730,'sys::Str',{}).af$('msg',73730,'sys::Str',{}).af$('arg',73730,'sys::Obj?',{}).am$('toGrid',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('list','hxConn::ConnTraceMsg[]',false),new sys.Param('meta','sys::Obj?',true)]),{}).am$('applyOpts',32898,'hxConn::ConnTraceMsg[]',sys.List.make(sys.Param.type$,[new sys.Param('list','hxConn::ConnTraceMsg[]',false),new sys.Param('opts','haystack::Dict?',false)]),{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('msg','sys::Str',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('argToStr',8192,'sys::Str?',xp,{});
ConnTraceLog.type$.af$('trace',73730,'hxConn::ConnTrace',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('trace','hxConn::ConnTrace',false)]),{}).am$('log',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','sys::LogRec',false)]),{}).am$('summaryLine',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{});
ConnTraceFeed.type$.af$('trace',73730,'hxConn::ConnTrace',{}).af$('ts',73730,'concurrent::AtomicRef',{}).af$('opts',73730,'haystack::Dict?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('trace','hxConn::ConnTrace',false),new sys.Param('ts','sys::DateTime',false),new sys.Param('opts','haystack::Dict?',false)]),{}).am$('poll',271360,'haystack::Grid?',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false)]),{});
ConnTraceActor.type$.af$('trace',67586,'hxConn::ConnTrace',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('trace','hxConn::ConnTrace',false),new sys.Param('pool','concurrent::ActorPool',false)]),{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('onRead',2048,'sys::Unsafe',sys.List.make(sys.Param.type$,[new sys.Param('since','sys::DateTime?',false)]),{}).am$('onEnable',2048,'sys::Obj?',xp,{}).am$('onDisable',2048,'sys::Obj?',xp,{}).am$('onClear',2048,'sys::Obj?',xp,{});
ConnPointHisState.type$.af$('nil',106498,'hxConn::ConnPointHisState',{}).af$('status',73730,'hxConn::ConnStatus',{}).af$('err',73730,'sys::Err?',{}).af$('lastUpdate',73730,'sys::Int',{}).af$('lastItems',73730,'sys::Str',{}).af$('numUpdates',73730,'sys::Int',{}).am$('updateOk',40966,'hxConn::ConnPointHisState?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('items','haystack::HisItem[]',false),new sys.Param('span','haystack::Span',false)]),{}).am$('updateErr',40966,'hxConn::ConnPointHisState?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('err','sys::Err',false)]),{}).am$('details',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::StrBuf',false),new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('makeNil',2052,'sys::Void',xp,{}).am$('makeOk',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxConn::ConnPointHisState',false),new sys.Param('lastItems','sys::Str',false)]),{}).am$('makeErr',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxConn::ConnPointHisState',false),new sys.Param('err','sys::Err',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ConnLib.type$.af$('fwRef',67586,'concurrent::AtomicRef',{}).af$('pointLibRef',67586,'concurrent::AtomicRef',{}).af$('modelRef',67586,'concurrent::AtomicRef',{}).af$('connTag',336898,'sys::Str',{'sys::NoDoc':""}).af$('connRefTag',336898,'sys::Str',{'sys::NoDoc':""}).af$('roster',65666,'hxConn::ConnRoster',{}).af$('tuningRef',67586,'concurrent::AtomicRef',{}).af$('connActorPool',65666,'concurrent::ActorPool',{}).af$('poller',65666,'hxConn::ConnPoller',{}).am$('make',8196,'sys::Void',xp,{}).am$('rec',271360,'hxConn::ConnSettings',xp,{}).am$('fw',8192,'hxConn::ConnFwLib',xp,{'sys::NoDoc':""}).am$('pointLib',8192,'hxPoint::PointLib',xp,{'sys::NoDoc':""}).am$('model',8192,'hxConn::ConnModel',xp,{'sys::NoDoc':""}).am$('icon',271360,'sys::Str',xp,{'sys::NoDoc':""}).am$('libDis',271360,'sys::Str',xp,{'sys::NoDoc':""}).am$('numConns',271360,'sys::Int',xp,{'sys::NoDoc':""}).am$('connFeatures',271360,'haystack::Dict',xp,{'sys::NoDoc':""}).am$('conns',8192,'hxConn::Conn[]',xp,{}).am$('conn',8192,'hxConn::Conn?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('points',8192,'hxConn::ConnPoint[]',xp,{}).am$('point',8192,'hxConn::ConnPoint?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('tunings',8192,'hxConn::ConnTuningRoster',xp,{'sys::NoDoc':""}).am$('tuning',8192,'hxConn::ConnTuning',xp,{'sys::NoDoc':""}).am$('onStart',271360,'sys::Void',xp,{}).am$('onStop',271360,'sys::Void',xp,{}).am$('onRecUpdate',271360,'sys::Void',xp,{}).am$('onConnEvent',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation?',false)]),{}).am$('onPointEvent',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation?',false)]),{}).am$('onPointWatch',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::Observation?',false)]),{}).am$('onPointWrite',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','hxPoint::WriteObservation?',false)]),{}).am$('tuningDefault',270336,'hxConn::ConnTuning',xp,{}).am$('onLearn',270336,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('onConnDetails',270336,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false)]),{}).am$('onPointDetails',270336,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false)]),{});
ConnSettings.type$.af$('connTuningRef',73730,'haystack::Ref?',{'haystack::TypedTag':""}).af$('maxThreads',73730,'sys::Int',{'haystack::TypedTag':"haystack::TypedTag{restart=true;meta=\"minVal: 1\\nmaxVal: 5000\";}"}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Dict',false),new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('effectiveMaxThreads',8192,'sys::Int',xp,{'sys::NoDoc':""});
RemoteStatusErr.type$.af$('status',73730,'hxConn::ConnStatus',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('status','hxConn::ConnStatus',false)]),{});
UnknownConnLibErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
UnknownConnErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
UnknownConnPointErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
UnknownConnTuningErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
NotOpenLibErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
ConnService.type$.af$('fw',67586,'hxConn::ConnFwLib',{}).af$('libDataRef',67586,'concurrent::AtomicRef',{}).af$('connsById',67586,'concurrent::ConcurrentMap',{}).af$('pointsById',67586,'concurrent::ConcurrentMap',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('fw','hxConn::ConnFwLib',false)]),{}).am$('libs',271360,'hx::HxConnLib[]',xp,{}).am$('lib',271360,'hx::HxConnLib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('libData',2048,'hxConn::ConnServiceLibData',xp,{}).am$('conns',271360,'hx::HxConn[]',xp,{}).am$('conn',271360,'hx::HxConn?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isConn',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('points',271360,'hx::HxConnPoint[]',xp,{}).am$('point',271360,'hx::HxConnPoint?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isPoint',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('addLib',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxConnLib',false)]),{}).am$('removeLib',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxConnLib',false)]),{}).am$('addConn',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','hx::HxConn',false)]),{}).am$('removeConn',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','hx::HxConn',false)]),{}).am$('addPoint',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','hx::HxConnPoint',false)]),{}).am$('removePoint',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','hx::HxConnPoint',false)]),{});
ConnServiceLibData.type$.af$('list',73730,'hx::HxConnLib[]',{}).af$('byName',73730,'[sys::Str:hx::HxConnLib]',{}).am$('makeEmpty',40966,'hxConn::ConnServiceLibData?',xp,{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('byName','[sys::Str:hx::HxConnLib]',false)]),{}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxConnLib',false)]),{}).am$('remove',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxConnLib',false)]),{});
Conn.type$.af$('toCoalesceKey',100354,'|hx::HxMsg->sys::Obj?|',{}).af$('toCoalesce',100354,'|hx::HxMsg,hx::HxMsg->hx::HxMsg|',{}).af$('libRef',67586,'hxConn::ConnLib',{}).af$('idRef',67586,'haystack::Ref',{}).af$('traceRef',67586,'hxConn::ConnTrace',{}).af$('dataRef',67586,'concurrent::AtomicRef',{}).af$('configRef',67586,'concurrent::AtomicRef',{}).af$('vars',65666,'hxConn::ConnVars',{}).af$('committer',65666,'hxConn::ConnCommitter',{}).af$('pollModeRef',67586,'hxConn::ConnPollMode',{}).af$('pollMsg',98434,'hx::HxMsg',{}).af$('pollNext',65666,'concurrent::AtomicInt',{}).af$('pollBucketsRef',67586,'concurrent::AtomicRef',{}).af$('houseKeepingFreq',100354,'sys::Duration',{}).af$('houseKeepingMsg',100354,'hx::HxMsg',{}).af$('aliveRef',67586,'concurrent::AtomicBool',{}).af$('pointsList',67586,'concurrent::AtomicRef',{}).af$('threadDebugRef',67586,'concurrent::AtomicRef',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxConn::ConnLib',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('start',128,'sys::Void',xp,{}).am$('rt',8192,'hx::HxRuntime',xp,{}).am$('db',8192,'folio::Folio',xp,{}).am$('lib',271360,'hxConn::ConnLib',xp,{}).am$('pointLib',8192,'hxPoint::PointLib',xp,{'sys::NoDoc':""}).am$('id',271360,'haystack::Ref',xp,{}).am$('trace',8192,'hxConn::ConnTrace',xp,{}).am$('log',8192,'sys::Log',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('dis',8192,'sys::Str',xp,{}).am$('rec',271360,'haystack::Dict',xp,{}).am$('isDisabled',8192,'sys::Bool',xp,{}).am$('timeout',8192,'sys::Duration',xp,{}).am$('openRetryFreq',8192,'sys::Duration',xp,{}).am$('pingFreq',8192,'sys::Duration?',xp,{}).am$('linger',8192,'sys::Duration',xp,{}).am$('tuning',8192,'hxConn::ConnTuning',xp,{}).am$('data',8192,'sys::Obj?',xp,{}).am$('setData',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxConn::ConnMgr',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('status',8192,'hxConn::ConnStatus',xp,{}).am$('state',8192,'hxConn::ConnState',xp,{'sys::NoDoc':""}).am$('config',128,'hxConn::ConnConfig',xp,{}).am$('setConfig',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxConn::ConnMgr',false),new sys.Param('c','hxConn::ConnConfig',false)]),{}).am$('points',8192,'hxConn::ConnPoint[]',xp,{}).am$('point',8192,'hxConn::ConnPoint?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('pointIds',8192,'haystack::Ref[]',xp,{}).am$('pollMode',8192,'hxConn::ConnPollMode',xp,{}).am$('pollFreq',8192,'sys::Duration?',xp,{}).am$('pollFreqEffective',128,'sys::Int',xp,{}).am$('pollBuckets',8192,'hxConn::ConnPollBucket[]',xp,{'sys::NoDoc':""}).am$('setPollBuckets',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxConn::ConnMgr',false),new sys.Param('b','hxConn::ConnPollBucket[]',false)]),{}).am$('isStopped',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('sendSync',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('ping',271360,'concurrent::Future',xp,{}).am$('close',271360,'concurrent::Future',xp,{}).am$('syncCur',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('sync',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('forceHouseKeeping',8192,'concurrent::Future',xp,{'sys::NoDoc':""}).am$('learnAsync',271360,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj?',true)]),{'sys::NoDoc':""}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('m','sys::Obj?',false)]),{}).am$('onReceiveEnter',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('onReceiveExit',2048,'sys::Void',xp,{}).am$('isAlive',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('kill',128,'sys::Void',xp,{}).am$('updatePointsList',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pts','hxConn::ConnPoint[]',false)]),{}).am$('details',271360,'sys::Str',xp,{'sys::NoDoc':""}).am$('detailsThreadDebug',2048,'sys::StrBuf',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::StrBuf',false),new sys.Param('x','hxConn::ConnThreadDebug?',false)]),{}).am$('detailsMsgArg',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::StrBuf',false),new sys.Param('name','sys::Str',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('detailsPollManual',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::StrBuf',false)]),{}).am$('detailsPollBuckets',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::StrBuf',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ConnThreadDebug.type$.af$('ticks',73730,'sys::Int',{}).af$('threadId',73730,'sys::Int',{}).af$('msg',73730,'hx::HxMsg',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('dur',8192,'sys::Str',xp,{});
ConnConfig.type$.af$('rec',73730,'haystack::Dict',{}).af$('dis',73730,'sys::Str',{}).af$('isDisabled',73730,'sys::Bool',{}).af$('timeout',73730,'sys::Duration',{}).af$('openRetryFreq',73730,'sys::Duration',{}).af$('pingFreq',73730,'sys::Duration?',{}).af$('linger',73730,'sys::Duration',{}).af$('pollFreq',73730,'sys::Duration?',{}).af$('tuning',73730,'hxConn::ConnTuning?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxConn::ConnLib',false),new sys.Param('rec','haystack::Dict',false)]),{});
ConnVars.type$.af$('statusRef',67586,'concurrent::AtomicRef',{}).af$('stateRef',67586,'concurrent::AtomicRef',{}).af$('openPinsRef',67586,'concurrent::AtomicRef',{}).af$('lingerUntilRef',67586,'concurrent::AtomicInt',{}).af$('lastPollRef',67586,'concurrent::AtomicInt',{}).af$('lastPingRef',67586,'concurrent::AtomicInt',{}).af$('lastOkRef',67586,'concurrent::AtomicInt',{}).af$('lastErrRef',67586,'concurrent::AtomicInt',{}).af$('errRef',67586,'concurrent::AtomicRef',{}).am$('status',8192,'hxConn::ConnStatus',xp,{}).am$('state',8192,'hxConn::ConnState',xp,{}).am$('openPins',8192,'[sys::Str:sys::Str]',xp,{}).am$('lingerUntil',8192,'sys::Int',xp,{}).am$('lastPoll',8192,'sys::Int',xp,{}).am$('lastPing',8192,'sys::Int',xp,{}).am$('lastOk',8192,'sys::Int',xp,{}).am$('lastErr',8192,'sys::Int',xp,{}).am$('lastAttempt',8192,'sys::Int',xp,{}).am$('err',8192,'sys::Err?',xp,{}).am$('openPin',128,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('app','sys::Str',false)]),{}).am$('closePin',128,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('app','sys::Str',false)]),{}).am$('lingerExpired',8192,'sys::Bool',xp,{}).am$('setLinger',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Duration',false)]),{}).am$('clearLinger',128,'sys::Void',xp,{}).am$('polled',128,'sys::Void',xp,{}).am$('pinged',128,'sys::Void',xp,{}).am$('resetStats',128,'sys::Void',xp,{}).am$('updateState',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('state','hxConn::ConnState',false)]),{}).am$('updateStatus',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('status','hxConn::ConnStatus',false),new sys.Param('state','hxConn::ConnState',false)]),{}).am$('updateOk',128,'sys::Void',xp,{}).am$('updateErr',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err',false)]),{}).am$('details',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::StrBuf',false)]),{}).am$('detailsLinger',2048,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
ConnPointCurState.type$.af$('nil',106498,'hxConn::ConnPointCurState',{}).af$('status',73730,'hxConn::ConnStatus',{}).af$('val',73730,'sys::Obj?',{}).af$('raw',73730,'sys::Obj?',{}).af$('err',73730,'sys::Err?',{}).af$('lastUpdate',73730,'sys::Int',{}).af$('numUpdates',73730,'sys::Int',{}).af$('quickPoll',73730,'sys::Bool',{}).am$('updateOk',40966,'hxConn::ConnPointCurState?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('updateErr',40966,'hxConn::ConnPointCurState?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('err','sys::Err',false)]),{}).am$('updateStale',40966,'hxConn::ConnPointCurState?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('updateQuickPoll',40966,'hxConn::ConnPointCurState?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('quickPoll','sys::Bool',false)]),{}).am$('details',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::StrBuf',false),new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('makeNil',2052,'sys::Void',xp,{}).am$('makeOk',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxConn::ConnPointCurState',false),new sys.Param('val','sys::Obj?',false),new sys.Param('raw','sys::Obj?',false)]),{}).am$('makeErr',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxConn::ConnPointCurState',false),new sys.Param('err','sys::Err',false),new sys.Param('raw','sys::Obj?',false)]),{}).am$('makeStale',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxConn::ConnPointCurState',false)]),{}).am$('makeQuickPoll',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxConn::ConnPointCurState',false),new sys.Param('quickPoll','sys::Bool',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ConnUtil.type$.af$('levels',100354,'haystack::Number[]',{}).am$('levelToNumber',40962,'haystack::Number',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::Int',false)]),{}).am$('eachConnInPointIds',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false),new sys.Param('points','hxConn::ConnPoint[]',false),new sys.Param('f','|hxConn::Conn,hxConn::ConnPoint[]->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ConnPoller.type$.af$('lib',73730,'hxConn::ConnLib',{}).af$('checkFreq',100354,'sys::Duration',{}).af$('checkMsg',100354,'sys::Str',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxConn::ConnLib',false)]),{}).am$('onStart',8192,'sys::Void',xp,{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('check',2048,'sys::Void',xp,{}).am$('pollInitStaggerConn',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false)]),{}).am$('pollInitStaggerBucket',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('tuning','hxConn::ConnTuning',false)]),{}).am$('pollInitStagger',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('pollTime','sys::Duration',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ConnPollMode.type$.af$('disabled',106506,'hxConn::ConnPollMode',{}).af$('manual',106506,'hxConn::ConnPollMode',{}).af$('buckets',106506,'hxConn::ConnPollMode',{}).af$('vals',106498,'hxConn::ConnPollMode[]',{}).am$('isEnabled',8192,'sys::Bool',xp,{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'hxConn::ConnPollMode?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ConnPollBucket.type$.af$('conn',73730,'hxConn::Conn',{}).af$('tuning',73730,'hxConn::ConnTuning',{}).af$('state',73730,'hxConn::ConnPollBucketState',{}).af$('points',73730,'hxConn::ConnPoint[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false),new sys.Param('tuning','hxConn::ConnTuning',false),new sys.Param('state','hxConn::ConnPollBucketState',false),new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('pollTime',8192,'sys::Duration',xp,{}).am$('nextPoll',8192,'sys::Int',xp,{}).am$('updateNextPoll',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('startTicks','sys::Int',false)]),{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
ConnPollBucketState.type$.af$('nextPoll',73730,'concurrent::AtomicInt',{}).af$('lastPoll',73730,'concurrent::AtomicInt',{}).af$('numPolls',73730,'concurrent::AtomicInt',{}).af$('lastDur',73730,'concurrent::AtomicInt',{}).af$('totalDur',73730,'concurrent::AtomicInt',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tuning','hxConn::ConnTuning',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
ConnFwFuncs.type$.am$('connPoints',40962,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':""}).am$('connPing',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connClose',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connLearn',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('arg','sys::Obj?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connSyncCur',40962,'concurrent::Future[]',sys.List.make(sys.Param.type$,[new sys.Param('points','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connSyncHis',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('points','sys::Obj',false),new sys.Param('span','sys::Obj?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connDetails',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connPointsVia',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('points','sys::Obj',false),new sys.Param('libOrConn','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('toPoints',34818,'hxConn::ConnPoint[]',sys.List.make(sys.Param.type$,[new sys.Param('points','sys::Obj',false),new sys.Param('cx','hx::HxContext',false)]),{}).am$('connTraceIsEnabled',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connTraceEnable',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connTraceDisable',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connTraceClear',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connTraceDisableAll',40962,'sys::Void',xp,{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connTrace',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('connPointsInWatch',40962,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('toHxConn',34818,'hx::HxConn',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{}).am$('toConn',34818,'hxConn::Conn',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{}).am$('classicConnErr',34818,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('c','hx::HxConn',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ConnCommitter.type$.af$('managedRef',67586,'concurrent::AtomicRef',{}).am$('managed',8192,'haystack::Dict',xp,{}).am$('commit1',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxConn::ConnLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj?',false)]),{}).am$('commit2',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxConn::ConnLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj?',false),new sys.Param('n1','sys::Str',false),new sys.Param('v1','sys::Obj?',false)]),{}).am$('commit3',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxConn::ConnLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj?',false),new sys.Param('n1','sys::Str',false),new sys.Param('v1','sys::Obj?',false),new sys.Param('n2','sys::Str',false),new sys.Param('v2','sys::Obj?',false)]),{}).am$('commit',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxConn::ConnLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('changes','haystack::Dict',false)]),{}).am$('details',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::StrBuf',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ConnFwLib.type$.af$('service',73730,'hxConn::ConnService',{}).af$('tunings',73730,'hxConn::ConnTuningRoster',{}).am$('services',271360,'hx::HxService[]',xp,{}).am$('onStart',271360,'sys::Void',xp,{}).am$('onConnTuningEvent',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ConnRoster.type$.af$('lib',67586,'hxConn::ConnLib',{}).af$('connsList',67586,'concurrent::AtomicRef',{}).af$('connsById',67586,'concurrent::ConcurrentMap',{}).af$('pointsById',67586,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxConn::ConnLib',false)]),{}).am$('numConns',8192,'sys::Int',xp,{}).am$('conns',8192,'hxConn::Conn[]',xp,{}).am$('conn',8192,'hxConn::Conn?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('points',8192,'hxConn::ConnPoint[]',xp,{}).am$('point',8192,'hxConn::ConnPoint?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('start',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('model','hxConn::ConnModel',false)]),{}).am$('initConns',2048,'sys::Void',xp,{}).am$('onConnEvent',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation',false)]),{}).am$('onConnAdded',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('onConnUpdated',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false),new sys.Param('e','obs::CommitObservation',false)]),{}).am$('onConnRemoved',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false)]),{}).am$('updateConnsList',2048,'sys::Void',xp,{}).am$('onPointEvent',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation',false)]),{}).am$('onPointAdded',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('onPointUpdated',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation',false)]),{}).am$('onPointRemoved',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('updateConnPoints',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false)]),{}).am$('pointConnRef',2048,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('onPointWatch',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::Observation',false)]),{}).am$('onPointWrite',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','hxPoint::WriteObservation',false)]),{}).am$('removeAll',8192,'sys::Void',xp,{}).am$('dump',8192,'sys::Void',xp,{});
ConnMgr.type$.af$('conn',73730,'hxConn::Conn',{}).af$('vars',73730,'hxConn::ConnVars',{}).af$('isOpen',73728,'sys::Bool',{}).af$('dispatch',67584,'hxConn::ConnDispatch',{}).af$('openForPing',67584,'sys::Bool',{}).af$('pointsInWatch',65664,'hxConn::ConnPoint[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false),new sys.Param('dispatchType','sys::Type',false)]),{}).am$('rt',8192,'hx::HxRuntime',xp,{}).am$('db',8192,'folio::Folio',xp,{}).am$('lib',8192,'hxConn::ConnLib',xp,{}).am$('id',8192,'haystack::Ref',xp,{}).am$('rec',8192,'haystack::Dict',xp,{}).am$('dis',8192,'sys::Str',xp,{}).am$('log',8192,'sys::Log',xp,{}).am$('isDisabled',8192,'sys::Bool',xp,{}).am$('trace',8192,'hxConn::ConnTrace',xp,{}).am$('timeout',8192,'sys::Duration',xp,{}).am$('hasPointsWatched',8192,'sys::Bool',xp,{}).am$('onReceive',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('isClosed',8192,'sys::Bool',xp,{}).am$('checkOpen',8192,'sys::This',xp,{}).am$('openLinger',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('linger','sys::Duration',true)]),{}).am$('setLinger',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('linger','sys::Duration',false)]),{}).am$('openPin',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('app','sys::Str',false)]),{}).am$('closePin',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('app','sys::Str',false)]),{}).am$('open',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('app','sys::Str',false)]),{}).am$('close',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('cause','sys::Obj?',false)]),{}).am$('updateConnState',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('state','hxConn::ConnState',false)]),{}).am$('ping',8192,'haystack::Dict',xp,{}).am$('onLearn',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj?',false)]),{}).am$('onInit',2048,'sys::Obj?',xp,{}).am$('onConnUpdated',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('newRec','haystack::Dict',false)]),{}).am$('onConnRemoved',2048,'sys::Obj?',xp,{}).am$('onPointAdded',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('onPointUpdated',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('newRec','haystack::Dict',false)]),{}).am$('onPointRemoved',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('onSyncCur',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onWatch',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('isQuickPoll',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('nowTicks','sys::Int',false),new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('onUnwatch',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('updatePointsInWatch',2048,'sys::Void',xp,{}).am$('onCurHouseKeeping',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('now','sys::Duration',false),new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('tuning','hxConn::ConnTuning',false)]),{}).am$('onWrite',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('info','hxConn::ConnWriteInfo',false)]),{}).am$('checkWriteOnOpen',2048,'sys::Void',xp,{}).am$('onWriteHouseKeeping',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('now','sys::Duration',false),new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('tuning','hxConn::ConnTuning',false)]),{}).am$('sendWrite',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('info','hxConn::ConnWriteInfo',false)]),{}).am$('onSyncHis',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('span','haystack::Span',false)]),{}).am$('onHisPending',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false)]),{}).am$('onPoll',128,'sys::Void',xp,{}).am$('onPollManual',2048,'sys::Void',xp,{}).am$('onPollBuckets',2048,'sys::Void',xp,{}).am$('pollBucket',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('startTicks','sys::Int',false),new sys.Param('bucket','hxConn::ConnPollBucket',false)]),{}).am$('pollBucketPoints',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('updateBuckets',2048,'sys::Void',xp,{}).am$('onHouseKeeping',128,'sys::Obj?',xp,{}).am$('doPointHouseKeeping',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('now','sys::Duration',false),new sys.Param('toStale','hxConn::ConnPoint[]',false),new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('checkAutoPing',2048,'sys::Void',xp,{}).am$('checkReopen',2048,'sys::Void',xp,{}).am$('updateConnOk',2048,'sys::Void',xp,{}).am$('updateConnErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err',false)]),{}).am$('updateStatus',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('forcePoints','sys::Bool',true)]),{}).am$('commit',2048,'folio::FolioFuture',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false)]),{});
AbstractSyncHis.type$.af$('cxRef',67584,'hx::HxContext',{}).af$('pointsRef',67584,'hxConn::ConnPoint[]',{}).af$('task',67584,'hx::HxTaskService?',{}).af$('span',67584,'sys::Obj?',{}).af$('num',67586,'sys::Int',{}).af$('numOk',67584,'sys::Int',{}).af$('numErr',67584,'sys::Int',{}).af$('results',67584,'haystack::Dict[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('points','sys::Obj[]',false),new sys.Param('span','sys::Obj?',false)]),{}).am$('run',8192,'haystack::Dict[]',xp,{}).am$('cx',270336,'hx::HxContext',xp,{}).am$('points',270336,'sys::Obj[]',xp,{}).am$('dis',270337,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('pt','sys::Obj',false)]),{}).am$('commitPending',270337,'sys::Void',xp,{}).am$('sync',270337,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('point','sys::Obj',false)]),{}).am$('toPointSpan',8192,'haystack::Span',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('tz','sys::TimeZone',false)]),{}).am$('trace',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('progress','sys::Int',false)]),{});
ConnSyncHis.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('points','hxConn::ConnPoint[]',false),new sys.Param('span','sys::Obj?',false)]),{}).am$('dis',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('pt','sys::Obj',false)]),{}).am$('points',271360,'hxConn::ConnPoint[]',xp,{}).am$('commitPending',271360,'sys::Void',xp,{}).am$('sync',271360,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('point','sys::Obj',false)]),{});
ConnStatus.type$.af$('unknown',106506,'hxConn::ConnStatus',{}).af$('ok',106506,'hxConn::ConnStatus',{}).af$('stale',106506,'hxConn::ConnStatus',{}).af$('down',106506,'hxConn::ConnStatus',{}).af$('fault',106506,'hxConn::ConnStatus',{}).af$('disabled',106506,'hxConn::ConnStatus',{}).af$('remoteUnknown',106506,'hxConn::ConnStatus',{}).af$('remoteDown',106506,'hxConn::ConnStatus',{}).af$('remoteFault',106506,'hxConn::ConnStatus',{}).af$('remoteDisabled',106506,'hxConn::ConnStatus',{}).af$('vals',106498,'hxConn::ConnStatus[]',{}).am$('isUnknown',8192,'sys::Bool',xp,{}).am$('isOk',8192,'sys::Bool',xp,{}).am$('isDisabled',8192,'sys::Bool',xp,{}).am$('isLocal',8192,'sys::Bool',xp,{}).am$('isRemote',8192,'sys::Bool',xp,{}).am$('remoteToLocal',8192,'hxConn::ConnStatus?',xp,{'sys::NoDoc':""}).am$('localToRemote',8192,'hxConn::ConnStatus?',xp,{'sys::NoDoc':""}).am$('fromErr',32898,'hxConn::ConnStatus',sys.List.make(sys.Param.type$,[new sys.Param('e','sys::Err',false)]),{}).am$('toErrStr',32898,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err?',false)]),{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'hxConn::ConnStatus?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ConnState.type$.af$('closed',106506,'hxConn::ConnState',{}).af$('closing',106506,'hxConn::ConnState',{}).af$('open',106506,'hxConn::ConnState',{}).af$('opening',106506,'hxConn::ConnState',{}).af$('vals',106498,'hxConn::ConnState[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'hxConn::ConnState?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ConnDispatch.type$.af$('connRef',67586,'hxConn::Conn',{}).af$('mgr',67584,'hxConn::ConnMgr',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('rt',8192,'hx::HxRuntime',xp,{}).am$('db',8192,'folio::Folio',xp,{}).am$('lib',270336,'hxConn::ConnLib',xp,{}).am$('conn',8192,'hxConn::Conn',xp,{}).am$('id',8192,'haystack::Ref',xp,{}).am$('trace',8192,'hxConn::ConnTrace',xp,{}).am$('log',8192,'sys::Log',xp,{}).am$('dis',8192,'sys::Str',xp,{}).am$('rec',8192,'haystack::Dict',xp,{}).am$('point',8192,'hxConn::ConnPoint?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('points',8192,'hxConn::ConnPoint[]',xp,{}).am$('pointsWatched',8192,'hxConn::ConnPoint[]',xp,{}).am$('hasPointsWatched',8192,'sys::Bool',xp,{}).am$('setConnData',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('setPointData',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('open',8192,'sys::This',xp,{}).am$('close',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cause','sys::Err?',false)]),{}).am$('openPin',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('app','sys::Str',false)]),{'sys::NoDoc':""}).am$('closePin',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('app','sys::Str',false)]),{'sys::NoDoc':""}).am$('onReceive',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('onOpen',270337,'sys::Void',xp,{}).am$('onClose',270337,'sys::Void',xp,{}).am$('onPing',270337,'haystack::Dict',xp,{}).am$('onLearn',270336,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj?',false)]),{}).am$('onPollManual',270336,'sys::Void',xp,{}).am$('onPollBucket',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onSyncCur',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onWatch',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onUnwatch',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onWrite',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('event','hxConn::ConnWriteInfo',false)]),{}).am$('onSyncHis',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('span','haystack::Span',false)]),{}).am$('onHouseKeeping',270336,'sys::Void',xp,{}).am$('onConnUpdated',270336,'sys::Void',xp,{}).am$('onConnRemoved',270336,'sys::Void',xp,{}).am$('onPointAdded',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('onPointUpdated',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('onPointRemoved',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{});
ConnPointWriteState.type$.af$('nil',106498,'hxConn::ConnPointWriteState',{}).af$('status',73730,'hxConn::ConnStatus',{}).af$('val',73730,'sys::Obj?',{}).af$('raw',73730,'sys::Obj?',{}).af$('level',73730,'sys::Int',{}).af$('err',73730,'sys::Err?',{}).af$('lastUpdate',73730,'sys::Int',{}).af$('numUpdates',73730,'sys::Int',{}).af$('lastInfo',73730,'hxConn::ConnWriteInfo?',{}).af$('pending',73730,'sys::Bool',{}).af$('queued',73730,'sys::Bool',{}).am$('updateOk',40966,'hxConn::ConnPointWriteState?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('info','hxConn::ConnWriteInfo',false)]),{}).am$('updateErr',40966,'hxConn::ConnPointWriteState?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('info','hxConn::ConnWriteInfo',false),new sys.Param('err','sys::Err',false)]),{}).am$('updateReceived',40966,'hxConn::ConnPointWriteState?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('lastInfo','hxConn::ConnWriteInfo',false)]),{}).am$('updatePending',40966,'hxConn::ConnPointWriteState?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('pending','sys::Bool',false)]),{}).am$('updateQueued',40966,'hxConn::ConnPointWriteState?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('queued','sys::Bool',false)]),{}).am$('details',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::StrBuf',false),new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('makeNil',2052,'sys::Void',xp,{}).am$('makeOk',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxConn::ConnPointWriteState',false),new sys.Param('info','hxConn::ConnWriteInfo',false)]),{}).am$('makeErr',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxConn::ConnPointWriteState',false),new sys.Param('info','hxConn::ConnWriteInfo',false),new sys.Param('err','sys::Err',false)]),{}).am$('makeReceived',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxConn::ConnPointWriteState',false),new sys.Param('lastInfo','hxConn::ConnWriteInfo',false)]),{}).am$('makePending',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxConn::ConnPointWriteState',false),new sys.Param('pending','sys::Bool',false)]),{}).am$('makeQueued',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('old','hxConn::ConnPointWriteState',false),new sys.Param('queued','sys::Bool',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ConnWriteInfo.type$.af$('val',73730,'sys::Obj?',{}).af$('raw',73730,'sys::Obj?',{'sys::NoDoc':""}).af$('level',73730,'sys::Int',{'sys::NoDoc':""}).af$('isFirst',73730,'sys::Bool',{'sys::NoDoc':""}).af$('who',73730,'sys::Obj?',{'sys::NoDoc':""}).af$('opts',73730,'haystack::Dict',{'sys::NoDoc':""}).af$('extra',73730,'sys::Str',{'sys::NoDoc':""}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obs','hxPoint::WriteObservation',false)]),{}).am$('convert',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('orig','hxConn::ConnWriteInfo',false),new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('makeExtra',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('orig','hxConn::ConnWriteInfo',false),new sys.Param('extra','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('asMinTime',8192,'sys::This',xp,{}).am$('asMaxTime',8192,'sys::This',xp,{}).am$('asOnOpen',8192,'sys::This',xp,{});
ConnTuningRoster.type$.af$('byId',67586,'concurrent::ConcurrentMap',{}).am$('list',8192,'hxConn::ConnTuning[]',xp,{}).am$('get',8192,'hxConn::ConnTuning?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('forLib',128,'hxConn::ConnTuning',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxConn::ConnLib',false)]),{}).am$('forRec',128,'hxConn::ConnTuning?',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('getOrStub',2048,'hxConn::ConnTuning',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('onEvent',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ConnTuning.type$.af$('configRef',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('id',8192,'haystack::Ref',xp,{}).am$('rec',8192,'haystack::Dict',xp,{}).am$('dis',8192,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('pollTime',8192,'sys::Duration',xp,{}).am$('staleTime',8192,'sys::Duration',xp,{}).am$('writeMinTime',8192,'sys::Duration?',xp,{}).am$('writeMaxTime',8192,'sys::Duration?',xp,{}).am$('writeOnOpen',8192,'sys::Bool',xp,{}).am$('writeOnStart',8192,'sys::Bool',xp,{}).am$('config',128,'hxConn::ConnTuningConfig',xp,{}).am$('updateRec',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('newRec','haystack::Dict',false)]),{});
ConnTuningConfig.type$.af$('id',73730,'haystack::Ref',{}).af$('rec',73730,'haystack::Dict',{}).af$('dis',73730,'sys::Str',{}).af$('pollTime',73730,'sys::Duration',{}).af$('staleTime',73730,'sys::Duration',{}).af$('writeMinTime',73730,'sys::Duration?',{}).af$('writeMaxTime',73730,'sys::Duration?',{}).af$('writeOnOpen',73730,'sys::Bool',{}).af$('writeOnStart',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('toDuration',2048,'sys::Duration?',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false),new sys.Param('def','sys::Duration?',false)]),{});
ConnModel.type$.af$('name',73730,'sys::Str',{}).af$('connTag',73730,'sys::Str',{}).af$('connRefTag',73730,'sys::Str',{}).af$('pointTag',73730,'sys::Str',{}).af$('curTag',73730,'sys::Str?',{}).af$('writeTag',73730,'sys::Str?',{}).af$('writeLevelTag',73730,'sys::Str?',{}).af$('hisTag',73730,'sys::Str?',{}).af$('curTagType',73730,'sys::Type?',{}).af$('writeTagType',73730,'sys::Type?',{}).af$('hisTagType',73730,'sys::Type?',{}).af$('pollMode',73730,'hxConn::ConnPollMode',{}).af$('pollFreqTag',73730,'sys::Str?',{}).af$('pollFreqDefault',73730,'sys::Duration?',{}).af$('dispatchType',73730,'sys::Type',{}).af$('features',73730,'haystack::Dict',{}).af$('hasLearn',73730,'sys::Bool',{}).af$('hasCur',73730,'sys::Bool',{}).af$('hasWrite',73730,'sys::Bool',{}).af$('hasHis',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxConn::ConnLib',false)]),{'sys::NoDoc':""}).am$('def',34818,'haystack::Def?',sys.List.make(sys.Param.type$,[new sys.Param('ns','haystack::Namespace',false),new sys.Param('lib','hxConn::ConnLib',false),new sys.Param('symbol','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('toAddrType',34818,'sys::Type',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{});
ConnPoint.type$.af$('connRef',67586,'hxConn::Conn',{}).af$('idRef',67586,'haystack::Ref',{}).af$('isWatchedRef',65666,'concurrent::AtomicBool',{}).af$('dataRef',67586,'concurrent::AtomicRef',{}).af$('configRef',67586,'concurrent::AtomicRef',{}).af$('committer',67586,'hxConn::ConnCommitter',{}).af$('curStateRef',67586,'concurrent::AtomicRef',{}).af$('writeStateRef',67586,'concurrent::AtomicRef',{}).af$('hisStateRef',67586,'concurrent::AtomicRef',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('lib',271360,'hxConn::ConnLib',xp,{}).am$('conn',271360,'hxConn::Conn',xp,{}).am$('id',271360,'haystack::Ref',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('dis',8192,'sys::Str',xp,{}).am$('rec',271360,'haystack::Dict',xp,{}).am$('curAddr',8192,'sys::Obj?',xp,{}).am$('writeAddr',8192,'sys::Obj?',xp,{}).am$('hisAddr',8192,'sys::Obj?',xp,{}).am$('isCurEnabled',8192,'sys::Bool',xp,{}).am$('isWriteEnabled',8192,'sys::Bool',xp,{}).am$('isHisEnabled',8192,'sys::Bool',xp,{}).am$('kind',8192,'haystack::Kind',xp,{}).am$('tz',8192,'sys::TimeZone',xp,{}).am$('unit',8192,'sys::Unit?',xp,{}).am$('tuning',8192,'hxConn::ConnTuning',xp,{}).am$('curCalibration',8192,'haystack::Number?',xp,{'sys::NoDoc':""}).am$('curConvert',8192,'hxPoint::PointConvert?',xp,{'sys::NoDoc':""}).am$('writeConvert',8192,'hxPoint::PointConvert?',xp,{'sys::NoDoc':""}).am$('hisConvert',8192,'hxPoint::PointConvert?',xp,{'sys::NoDoc':""}).am$('isEnabled',8192,'sys::Bool',xp,{}).am$('isDisabled',8192,'sys::Bool',xp,{}).am$('isWatched',8192,'sys::Bool',xp,{}).am$('data',8192,'sys::Obj?',xp,{}).am$('setData',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxConn::ConnMgr',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('config',128,'hxConn::ConnPointConfig',xp,{}).am$('setConfig',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxConn::ConnMgr',false),new sys.Param('c','hxConn::ConnPointConfig',false)]),{}).am$('updateCurOk',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('updateCurErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err',false)]),{}).am$('updateCurStale',128,'sys::Void',xp,{}).am$('updateCurQuickPoll',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('quickPoll','sys::Bool',false)]),{}).am$('updateCurTags',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','hxConn::ConnPointCurState',false)]),{}).am$('curState',128,'hxConn::ConnPointCurState',xp,{}).am$('updateWriteOk',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('info','hxConn::ConnWriteInfo',false)]),{}).am$('updateWriteErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('info','hxConn::ConnWriteInfo',false),new sys.Param('err','sys::Err',false)]),{}).am$('writeState',128,'hxConn::ConnPointWriteState',xp,{}).am$('updateWriteReceived',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lastInfo','hxConn::ConnWriteInfo',false)]),{}).am$('updateWritePending',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pending','sys::Bool',false)]),{}).am$('updateWriteQueued',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('queued','sys::Bool',false)]),{}).am$('updateWriteTags',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','hxConn::ConnPointWriteState',false)]),{}).am$('updateHisOk',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('items','haystack::HisItem[]',false),new sys.Param('span','haystack::Span',false)]),{}).am$('updateHisErr',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err',false)]),{}).am$('updateHisPending',128,'sys::Void',xp,{}).am$('hisState',128,'hxConn::ConnPointHisState',xp,{}).am$('updateHisTags',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','hxConn::ConnPointHisState',false)]),{}).am$('onConnStatus',128,'sys::Void',xp,{}).am$('updateStatus',128,'sys::Void',xp,{}).am$('details',271360,'sys::Str',xp,{'sys::NoDoc':""}).am$('detailsAddr',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::StrBuf',false),new sys.Param('tag','sys::Str?',false),new sys.Param('val','sys::Obj?',false)]),{});
ConnPointConfig.type$.af$('rec',73730,'haystack::Dict',{}).af$('dis',73730,'sys::Str',{}).af$('tz',73730,'sys::TimeZone',{}).af$('unit',73730,'sys::Unit?',{}).af$('kind',73730,'haystack::Kind?',{}).af$('tuning',73730,'hxConn::ConnTuning?',{}).af$('curAddr',73730,'sys::Obj?',{}).af$('writeAddr',73730,'sys::Obj?',{}).af$('hisAddr',73730,'sys::Obj?',{}).af$('isDisabled',73730,'sys::Bool',{}).af$('curFault',73730,'sys::Str?',{}).af$('writeFault',73730,'sys::Str?',{}).af$('hisFault',73730,'sys::Str?',{}).af$('curCalibration',73730,'haystack::Number?',{}).af$('curConvert',73730,'hxPoint::PointConvert?',{}).af$('writeConvert',73730,'hxPoint::PointConvert?',{}).af$('hisConvert',73730,'hxPoint::PointConvert?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxConn::ConnLib',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('toAddr',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('model','hxConn::ConnModel',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('tag','sys::Str?',false)]),{}).am$('toAddrFault',34818,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str?',false),new sys.Param('val','sys::Obj?',false),new sys.Param('type','sys::Type?',false)]),{}).am$('toConvert',34818,'hxPoint::PointConvert?',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('tag','sys::Str',false)]),{}).am$('isEnabled',8192,'sys::Bool',xp,{}).am$('isCurEnabled',8192,'sys::Bool',xp,{}).am$('isWriteEnabled',8192,'sys::Bool',xp,{}).am$('isHisEnabled',8192,'sys::Bool',xp,{}).am$('isStatusUpdate',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('b','hxConn::ConnPointConfig',false)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxConn");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;inet 1.0;haystack 3.1.11;axon 3.1.11;obs 3.1.11;folio 3.1.11;hx 3.1.11;hxUtil 3.1.11;hxPoint 3.1.11");
m.set("pod.summary", "Haxall connector framework");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:27-05:00 New_York");
m.set("build.tsKey", "241210143127");
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
  ConnTrace,
  ConnTraceMsg,
  ConnLib,
  ConnSettings,
  RemoteStatusErr,
  UnknownConnLibErr,
  UnknownConnErr,
  UnknownConnPointErr,
  UnknownConnTuningErr,
  NotOpenLibErr,
  ConnService,
  Conn,
  ConnUtil,
  ConnPollMode,
  ConnPollBucket,
  ConnPollBucketState,
  ConnFwFuncs,
  ConnFwLib,
  AbstractSyncHis,
  ConnStatus,
  ConnState,
  ConnDispatch,
  ConnWriteInfo,
  ConnTuningRoster,
  ConnTuning,
  ConnModel,
  ConnPoint,
};
