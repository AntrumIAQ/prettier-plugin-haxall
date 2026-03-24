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
import * as auth from './auth.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as folio from './folio.js'
import * as hxUtil from './hxUtil.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
import * as hxPoint from './hxPoint.js'
import * as hxConn from './hxConn.js'
import * as xml from './xml.js'
import * as obix from './obix.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class ObixFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixFuncs.type$; }

  static obixPing(conn) {
    return hxConn.ConnFwFuncs.connPing(conn);
  }

  static obixSyncCur(points) {
    return hxConn.ConnFwFuncs.connSyncCur(points);
  }

  static obixSyncHis(points,span) {
    if (span === undefined) span = null;
    return hxConn.ConnFwFuncs.connSyncHis(points, span);
  }

  static obixLearn(conn,arg) {
    if (arg === undefined) arg = null;
    return sys.ObjUtil.coerce(hxConn.ConnFwFuncs.connLearn(conn, arg).get(sys.Duration.fromStr("1min")), haystack.Grid.type$);
  }

  static obixReadObj(conn,uri) {
    return sys.ObjUtil.coerce(ObixFuncs.dispatch(ObixFuncs.curContext(), conn, hx.HxMsg.make1("readObj", uri)), haystack.Grid.type$);
  }

  static obixReadHis(conn,uri,span) {
    let cx = ObixFuncs.curContext();
    let rec = haystack.Etc.toRec(conn);
    if (rec.missing("tz")) {
      throw sys.Err.make("obixConn missing 'tz' tag");
    }
    ;
    let tz = sys.TimeZone.fromStr(sys.ObjUtil.coerce(rec.trap("tz", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$));
    let s = haystack.Etc.toSpan(span, tz, cx);
    return sys.ObjUtil.coerce(ObixFuncs.dispatch(cx, rec, hx.HxMsg.make2("readHis", uri, s)), haystack.Grid.type$);
  }

  static obixWriteObj(conn,uri,arg) {
    return sys.ObjUtil.coerce(ObixFuncs.dispatch(ObixFuncs.curContext(), conn, hx.HxMsg.make2("writeObj", uri, arg)), haystack.Grid.type$);
  }

  static obixInvoke(conn,uri,arg) {
    return sys.ObjUtil.coerce(ObixFuncs.dispatch(ObixFuncs.curContext(), conn, hx.HxMsg.make2("invoke", uri, arg)), haystack.Grid.type$);
  }

  static obixSyncHisGroup(group,range) {
    if (range === undefined) range = null;
    return hxConn.ConnFwFuncs.connSyncHis(ObixFuncs.curContext().db().readAllList(haystack.Filter.eq("obixSyncHisGroup", sys.Str.toCode(group))), range);
  }

  static dispatch(cx,conn,msg) {
    let lib = sys.ObjUtil.coerce(cx.rt().lib("obix"), ObixLib.type$);
    return lib.conn(haystack.Etc.toId(conn)).sendSync(msg);
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static make() {
    const $self = new ObixFuncs();
    ObixFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ObixWatch extends obix.ObixModWatch {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return ObixWatch.type$; }

  #mod = null;

  mod() { return this.#mod; }

  __mod(it) { if (it === undefined) return this.#mod; else this.#mod = it; }

  #watch = null;

  watch() { return this.#watch; }

  __watch(it) { if (it === undefined) return this.#watch; else this.#watch = it; }

  #recsUri = null;

  recsUri() { return this.#recsUri; }

  __recsUri(it) { if (it === undefined) return this.#recsUri; else this.#recsUri = it; }

  #lease = null;

  lease(it) {
    if (it === undefined) {
      return this.#watch.lease();
    }
    else {
      this.#watch.lease(it);
      return;
    }
  }

  #recParentProxy$Store = undefined;

  // private field reflection only
  __recParentProxy$Store(it) { if (it === undefined) return this.#recParentProxy$Store; else this.#recParentProxy$Store = it; }

  static make(mod,watch) {
    const $self = new ObixWatch();
    ObixWatch.make$($self,mod,watch);
    return $self;
  }

  static make$($self,mod,watch) {
    obix.ObixModWatch.make$($self);
    ;
    $self.#mod = mod;
    $self.#watch = watch;
    $self.#recsUri = mod.req().modBase().plus(sys.Uri.fromStr("rec/"));
    return;
  }

  id() {
    return this.#watch.id();
  }

  add(uris) {
    const this$ = this;
    let validIds = sys.List.make(haystack.Ref.type$);
    let idByIndex = sys.List.make(haystack.Ref.type$.toNullable());
    uris.each((uri) => {
      let id = this$.uriToId(uri);
      idByIndex.add(id);
      if (id != null) {
        validIds.add(sys.ObjUtil.coerce(id, haystack.Ref.type$));
      }
      ;
      return;
    });
    this.#watch.addAll(validIds);
    let recList = this.#watch.rt().db().readByIdsList(this.#watch.list(), false);
    let recsById = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Dict?"));
    recList.each((rec) => {
      if (rec != null) {
        recsById.set(rec.id(), rec);
      }
      ;
      return;
    });
    let objs = sys.List.make(obix.ObixObj.type$);
    uris.each((uri,i) => {
      let id = idByIndex.get(i);
      let rec = null;
      if (id != null) {
        (rec = recsById.get(sys.ObjUtil.coerce(id, haystack.Ref.type$)));
      }
      ;
      let obj = null;
      if (rec == null) {
        (obj = obix.ObixErr.toUnresolvedObj(uri));
        if (id == null) {
          obj.display(sys.Str.plus(sys.Str.plus("Watch URI must be: ", this$.#recsUri), "{id}/"));
        }
        ;
      }
      else {
        (obj = this$.recToObix(sys.ObjUtil.coerce(rec, haystack.Dict.type$)));
      }
      ;
      objs.add(sys.ObjUtil.coerce(obj, obix.ObixObj.type$));
      return;
    });
    return objs;
  }

  remove(uris) {
    const this$ = this;
    let ids = sys.List.make(haystack.Ref.type$);
    uris.each((uri) => {
      let id = this$.uriToId(uri);
      if (id != null) {
        ids.add(sys.ObjUtil.coerce(id, haystack.Ref.type$));
      }
      ;
      return;
    });
    this.#watch.removeAll(ids);
    return;
  }

  pollChanges() {
    return this.doPoll(this.#watch.poll());
  }

  pollRefresh() {
    return this.doPoll(this.#watch.poll(sys.Duration.defVal()));
  }

  doPoll(recs) {
    const this$ = this;
    let objs = sys.List.make(obix.ObixObj.type$);
    objs.capacity(recs.size());
    recs.each((rec) => {
      let obj = this$.recToObix(rec);
      objs.add(obj);
      return;
    });
    return objs;
  }

  delete() {
    this.#watch.close();
    return;
  }

  recToObix(rec) {
    let proxy = ObixRec.make(this.recParentProxy(), rec.id().toStr(), rec);
    proxy.isRoot(false);
    return proxy.read();
  }

  recParentProxy() {
    if (this.#recParentProxy$Store === undefined) {
      this.#recParentProxy$Store = this.recParentProxy$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#recParentProxy$Store, ObixRecs.type$);
  }

  uriToId(uri) {
    if (sys.ObjUtil.compareNE(uri.parent(), this.#recsUri)) {
      return null;
    }
    ;
    if (!uri.isDir()) {
      return null;
    }
    ;
    return haystack.Ref.fromStr(uri.path().get(-1), false);
  }

  recParentProxy$Once() {
    return sys.ObjUtil.coerce(ObixLobby.make(this.#mod).get("rec"), ObixRecs.type$);
  }

}

class ObixAspect extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixAspect.type$; }

  static #point = undefined;

  static point() {
    if (ObixAspect.#point === undefined) {
      ObixAspect.static$init();
      if (ObixAspect.#point === undefined) ObixAspect.#point = null;
    }
    return ObixAspect.#point;
  }

  static #writable = undefined;

  static writable() {
    if (ObixAspect.#writable === undefined) {
      ObixAspect.static$init();
      if (ObixAspect.#writable === undefined) ObixAspect.#writable = null;
    }
    return ObixAspect.#writable;
  }

  static #history = undefined;

  static history() {
    if (ObixAspect.#history === undefined) {
      ObixAspect.static$init();
      if (ObixAspect.#history === undefined) ObixAspect.#history = null;
    }
    return ObixAspect.#history;
  }

  static toContract(rec) {
    const this$ = this;
    let aspects = ObixAspect.toAspects(rec);
    let uris = sys.ObjUtil.coerce(aspects.map((a) => {
      return a.contract();
    }, sys.Uri.type$), sys.Type.find("sys::Uri[]"));
    rec.each((v,n) => {
      if (v === haystack.Marker.val()) {
        uris.add(sys.Str.toUri(sys.Str.plus("tag:", n)));
      }
      ;
      return;
    });
    if (uris.isEmpty()) {
      return obix.Contract.empty();
    }
    ;
    return obix.Contract.make(uris);
  }

  static toAspects(rec) {
    let acc = sys.List.make(ObixAspect.type$);
    if (rec.has("point")) {
      acc.add(ObixAspect.point());
    }
    ;
    if (sys.ObjUtil.is(rec.get("obixWritable"), haystack.Number.type$)) {
      acc.add(ObixAspect.writable());
    }
    ;
    if (rec.has("his")) {
      acc.add(ObixAspect.history());
    }
    ;
    return acc;
  }

  static make() {
    const $self = new ObixAspect();
    ObixAspect.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    ObixAspect.#point = ObixPointAspect.make();
    ObixAspect.#writable = ObixWritableAspect.make();
    ObixAspect.#history = ObixHistoryAspect.make();
    return;
  }

}

class ObixPointAspect extends ObixAspect {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixPointAspect.type$; }

  contract() {
    return sys.Uri.fromStr("obix:Point");
  }

  get(parent,name) {
    return null;
  }

  read(parent,obj) {
    let rec = parent.rec();
    let val = rec.get("curVal");
    if (sys.ObjUtil.is(val, haystack.Number.type$)) {
      let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
      obj.val(sys.ObjUtil.coerce(num.toFloat(), sys.Obj.type$.toNullable()));
      obj.unit(num.unit());
    }
    else {
      if (val != null) {
        obj.val(val);
      }
      ;
    }
    ;
    let curStatus = hxConn.ConnStatus.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u0 = sys.ObjUtil.as(rec.get("curStatus"), sys.Str.type$); if ($_u0 != null) return $_u0; return "ok"; })(this), sys.Str.type$), false);
    if (curStatus != null) {
      if (curStatus.isRemote()) {
        (curStatus = curStatus.remoteToLocal());
      }
      ;
      obj.status(sys.ObjUtil.coerce(((this$) => { let $_u1 = obix.Status.fromStr(curStatus.name(), false); if ($_u1 != null) return $_u1; return obix.Status.ok(); })(this), obix.Status.type$));
    }
    ;
    return;
  }

  static make() {
    const $self = new ObixPointAspect();
    ObixPointAspect.make$($self);
    return $self;
  }

  static make$($self) {
    ObixAspect.make$($self);
    return;
  }

}

class ObixWritableAspect extends ObixAspect {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixWritableAspect.type$; }

  contract() {
    return sys.Uri.fromStr("obix:WritablePoint");
  }

  get(parent,name) {
    let $_u2 = name;
    if (sys.ObjUtil.equals($_u2, "writePoint")) {
      return ObixWritableOp.make(parent);
    }
    else {
      return null;
    }
    ;
  }

  read(parent,obj) {
    const this$ = this;
    obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.elemName("op");
      it.name("writePoint");
      it.href(sys.Uri.fromStr("writePoint"));
      it.in(obix.Contract.writePointIn());
      it.out(obix.Contract.point());
      return;
    }), obix.ObixObj.type$));
    return;
  }

  static make() {
    const $self = new ObixWritableAspect();
    ObixWritableAspect.make$($self);
    return $self;
  }

  static make$($self) {
    ObixAspect.make$($self);
    return;
  }

}

class ObixProxy extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixProxy.type$; }

  #lobbyRef = null;

  // private field reflection only
  __lobbyRef(it) { if (it === undefined) return this.#lobbyRef; else this.#lobbyRef = it; }

  #parentRef = null;

  // private field reflection only
  __parentRef(it) { if (it === undefined) return this.#parentRef; else this.#parentRef = it; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  static make(parent,name) {
    const $self = new ObixProxy();
    ObixProxy.make$($self,parent,name);
    return $self;
  }

  static make$($self,parent,name) {
    $self.#lobbyRef = parent.lobby();
    $self.#parentRef = parent;
    $self.#uri = sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", parent.#uri), ""), name), "/"));
    return;
  }

  static makeLobby() {
    const $self = new ObixProxy();
    ObixProxy.makeLobby$($self);
    return $self;
  }

  static makeLobby$($self) {
    $self.#lobbyRef = sys.ObjUtil.coerce($self, ObixLobby.type$);
    $self.#uri = sys.Uri.fromStr("");
    return;
  }

  lobby() {
    return this.#lobbyRef;
  }

  parent() {
    return this.#parentRef;
  }

  rt() {
    return this.lobby().mod().rt();
  }

  get(name) {
    return null;
  }

  write(arg) {
    throw sys.ReadonlyErr.make();
  }

  invoke(arg) {
    throw sys.UnsupportedErr.make();
  }

  absBaseUri() {
    return this.lobby().mod().req().absUri().plus(this.lobby().mod().req().modBase()).plus(this.#uri);
  }

  idToUri(id) {
    return this.lobby().mod().req().modBase().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", id.toStr()), "/")));
  }

  queryToUri(query) {
    return this.lobby().mod().req().modBase().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("query/", query), "/")));
  }

}

class ObixWritableOp extends ObixProxy {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixWritableOp.type$; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  static make(parent) {
    const $self = new ObixWritableOp();
    ObixWritableOp.make$($self,parent);
    return $self;
  }

  static make$($self,parent) {
    ObixProxy.make$($self, parent, "writePoint");
    $self.#rec = parent.rec();
    return;
  }

  read() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.elemName("op");
      it.name("writePoint");
      it.href(this$.absBaseUri());
      it.in(obix.Contract.writePointIn());
      it.out(obix.Contract.point());
      return;
    }), obix.ObixObj.type$);
  }

  invoke(arg) {
    let level = sys.ObjUtil.as(this.#rec.get("obixWritable"), haystack.Number.type$);
    if (level == null) {
      throw sys.Err.make("Missing obixWritable Number tag");
    }
    ;
    let val = ObixUtil.toVal(sys.ObjUtil.coerce(arg.get("value"), obix.ObixObj.type$));
    this.rt().pointWrite().write(this.#rec, val, level.toInt(), "oBIX client").get(sys.Duration.fromStr("10sec"));
    return obix.ObixObj.make();
  }

}

class ObixHistoryAspect extends ObixAspect {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixHistoryAspect.type$; }

  contract() {
    return sys.Uri.fromStr("obix:History");
  }

  get(parent,name) {
    let $_u3 = name;
    if (sys.ObjUtil.equals($_u3, "query")) {
      return ObixHistoryQuery.make(parent);
    }
    else {
      return null;
    }
    ;
  }

  read(parent,obj) {
    const this$ = this;
    let rec = parent.rec();
    let hisSize = ((this$) => { let $_u4 = sys.ObjUtil.as(rec.get("hisSize"), haystack.Number.type$); if ($_u4 != null) return $_u4; return haystack.Number.zero(); })(this);
    obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.name("count");
      it.elemName("int");
      it.val(sys.ObjUtil.coerce(hisSize.toInt(), sys.Obj.type$.toNullable()));
      return;
    }), obix.ObixObj.type$));
    obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.name("start");
      it.elemName("abstime");
      it.val(rec.get("hisStart"));
      return;
    }), obix.ObixObj.type$));
    obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.name("end");
      it.elemName("abstime");
      it.val(rec.get("hisEnd"));
      return;
    }), obix.ObixObj.type$));
    let tzName = rec.get("tz");
    if (tzName != null) {
      let tz = sys.TimeZone.fromStr(sys.ObjUtil.coerce(tzName, sys.Str.type$), false);
      if (tz != null) {
        obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
          it.name("tz");
          it.val(tz.fullName());
          return;
        }), obix.ObixObj.type$));
      }
      ;
    }
    ;
    obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.elemName("op");
      it.name("query");
      it.href(sys.Uri.fromStr("query"));
      it.in(obix.Contract.historyFilter());
      it.out(obix.Contract.historyQueryOut());
      return;
    }), obix.ObixObj.type$));
    return;
  }

  static make() {
    const $self = new ObixHistoryAspect();
    ObixHistoryAspect.make$($self);
    return $self;
  }

  static make$($self) {
    ObixAspect.make$($self);
    return;
  }

}

class ObixHistoryQuery extends ObixProxy {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixHistoryQuery.type$; }

  static make(parent) {
    const $self = new ObixHistoryQuery();
    ObixHistoryQuery.make$($self,parent);
    return $self;
  }

  static make$($self,parent) {
    ObixProxy.make$($self, parent, "query");
    return;
  }

  read() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.elemName("op");
      it.name("query");
      it.href(this$.absBaseUri());
      it.in(obix.Contract.historyFilter());
      it.out(obix.Contract.historyQueryOut());
      return;
    }), obix.ObixObj.type$);
  }

  invoke(arg) {
    const this$ = this;
    let start = sys.ObjUtil.coerce(((this$) => { let $_u5=arg.get("start", false); return ($_u5==null) ? null : $_u5.val(); })(this), sys.DateTime.type$.toNullable());
    let end = sys.ObjUtil.coerce(((this$) => { let $_u6=arg.get("end", false); return ($_u6==null) ? null : $_u6.val(); })(this), sys.DateTime.type$.toNullable());
    let limit = sys.ObjUtil.coerce(((this$) => { let $_u7 = ((this$) => { let $_u8=arg.get("limit", false); return ($_u8==null) ? null : $_u8.val(); })(this$); if ($_u7 != null) return $_u7; return sys.ObjUtil.coerce(sys.Int.maxVal(), sys.Obj.type$.toNullable()); })(this), sys.Int.type$);
    let rec = sys.ObjUtil.coerce(this.parent(), ObixRec.type$).rec();
    let tz = sys.TimeZone.fromStr(sys.ObjUtil.coerce(rec.trap("tz", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$));
    if (start != null) {
      (start = start.toTimeZone(sys.ObjUtil.coerce(tz, sys.TimeZone.type$)));
    }
    ;
    if (end != null) {
      (end = end.toTimeZone(sys.ObjUtil.coerce(tz, sys.TimeZone.type$)));
    }
    ;
    let span = null;
    if ((start == null && end == null)) {
      (span = null);
    }
    else {
      if ((start != null && end != null)) {
        (span = haystack.Span.makeAbs(sys.ObjUtil.coerce(start, sys.DateTime.type$), sys.ObjUtil.coerce(end, sys.DateTime.type$)));
      }
      else {
        throw sys.Err.make("Partial null span not supported");
      }
      ;
    }
    ;
    let count = 0;
    let data = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.name("data");
      it.elemName("list");
      it.of(obix.Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("#RecordProto"), sys.Uri.fromStr("obix:HistoryRecord")])));
      return;
    }), obix.ObixObj.type$);
    this.rt().his().read(rec, span, null, (item) => {
      if (sys.ObjUtil.compareGE(count, limit)) {
        return;
      }
      ;
      count = sys.Int.increment(count);
      let itemVal = item.val();
      if (sys.ObjUtil.is(itemVal, haystack.Number.type$)) {
        (itemVal = sys.ObjUtil.coerce(sys.ObjUtil.coerce(itemVal, haystack.Number.type$).toFloat(), sys.Obj.type$.toNullable()));
      }
      ;
      data.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
          it.name("timestamp");
          it.val(item.ts());
          it.tz(null);
          return;
        }), obix.ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
          it.name("value");
          it.val(itemVal);
          return;
        }), obix.ObixObj.type$));
        return;
      }), obix.ObixObj.type$));
      return;
    });
    let proto = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.name("proto");
      it.href(sys.Uri.fromStr("#RecordProto"));
      it.contract(obix.Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:History")])));
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("timestamp");
        it.elemName("abstime");
        it.tz(tz);
        return;
      }), obix.ObixObj.type$));
      return;
    }), obix.ObixObj.type$);
    let unit = sys.Unit.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u9 = rec.get("unit"); if ($_u9 != null) return $_u9; return ""; })(this), sys.Str.type$), false);
    if (unit != null) {
      let valElemName = ((this$) => { let $_u10 = ((this$) => { let $_u11=((this$) => { let $_u12 = data.first(); if ($_u12 == null) return null; return data.first().get("value"); })(this$); return ($_u11==null) ? null : $_u11.elemName(); })(this$); if ($_u10 != null) return $_u10; return "obj"; })(this);
      proto.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("value");
        it.elemName(sys.ObjUtil.coerce(valElemName, sys.Str.type$));
        it.unit(unit);
        return;
      }), obix.ObixObj.type$));
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.contract(obix.Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:HistoryQueryOut")])));
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("count");
        it.val(sys.ObjUtil.coerce(count, sys.Obj.type$.toNullable()));
        return;
      }), obix.ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("start");
        it.elemName("abstime");
        it.val(start);
        return;
      }), obix.ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("end");
        it.elemName("abstime");
        it.val(end);
        return;
      }), obix.ObixObj.type$)).add(proto).add(data);
      return;
    }), obix.ObixObj.type$);
  }

}

class ObixLib extends hxConn.ConnLib {
  constructor() {
    super();
    const this$ = this;
    this.#web = ObixLibWeb.make(this);
    return;
  }

  typeof() { return ObixLib.type$; }

  #web = null;

  web() { return this.#web; }

  __web(it) { if (it === undefined) return this.#web; else this.#web = it; }

  static make() {
    const $self = new ObixLib();
    ObixLib.make$($self);
    return $self;
  }

  static make$($self) {
    hxConn.ConnLib.make$($self);
    ;
    return;
  }

}

class ObixLibWeb extends hx.HxLibWeb {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixLibWeb.type$; }

  #mod = null;

  mod() { return this.#mod; }

  __mod(it) { if (it === undefined) return this.#mod; else this.#mod = it; }

  static make(lib) {
    const $self = new ObixLibWeb();
    ObixLibWeb.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    hx.HxLibWeb.make$($self, lib);
    $self.#mod = ObixWebMod.make(lib);
    return;
  }

  onService() {
    this.#mod.onService();
    return;
  }

}

class ObixDispatch extends hxConn.ConnDispatch {
  constructor() {
    super();
    const this$ = this;
    this.#watchUris = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Uri"), sys.Type.find("hxConn::ConnPoint"));
    return;
  }

  typeof() { return ObixDispatch.type$; }

  #client = null;

  client(it) {
    if (it === undefined) {
      return this.#client;
    }
    else {
      this.#client = it;
      return;
    }
  }

  #clientWatch = null;

  clientWatch(it) {
    if (it === undefined) {
      return this.#clientWatch;
    }
    else {
      this.#clientWatch = it;
      return;
    }
  }

  #watchUris = null;

  watchUris(it) {
    if (it === undefined) {
      return this.#watchUris;
    }
    else {
      this.#watchUris = it;
      return;
    }
  }

  #isNiagara = false;

  isNiagara(it) {
    if (it === undefined) {
      return this.#isNiagara;
    }
    else {
      this.#isNiagara = it;
      return;
    }
  }

  static make(arg) {
    const $self = new ObixDispatch();
    ObixDispatch.make$($self,arg);
    return $self;
  }

  static make$($self,arg) {
    hxConn.ConnDispatch.make$($self, arg);
    ;
    return;
  }

  onReceive(msg) {
    let msgId = msg.id();
    if (msgId === "readHis") {
      return this.onReadHis(sys.ObjUtil.coerce(msg.a(), sys.Uri.type$), sys.ObjUtil.coerce(msg.b(), haystack.Span.type$));
    }
    ;
    if (msgId === "readObj") {
      return this.onReadObj(sys.ObjUtil.coerce(msg.a(), sys.Uri.type$));
    }
    ;
    if (msgId === "writeObj") {
      return this.onWriteObj(sys.ObjUtil.coerce(msg.a(), sys.Uri.type$), msg.b());
    }
    ;
    if (msgId === "invoke") {
      return this.onInvoke(sys.ObjUtil.coerce(msg.a(), sys.Uri.type$), msg.b());
    }
    ;
    return hxConn.ConnDispatch.prototype.onReceive.call(this, msg);
  }

  onOpen() {
    let lobbyVal = ((this$) => { let $_u13 = this$.rec().get("obixLobby"); if ($_u13 != null) return $_u13; throw haystack.FaultErr.make("Missing 'obixLobby' tag"); })(this);
    let lobbyUri = ((this$) => { let $_u14 = sys.ObjUtil.as(lobbyVal, sys.Uri.type$); if ($_u14 != null) return $_u14; throw haystack.FaultErr.make(sys.Str.plus("Type of 'obixLobby' must be Uri, not ", sys.ObjUtil.typeof(lobbyVal).name())); })(this);
    let user = ((this$) => { let $_u15 = this$.rec().get("username"); if ($_u15 != null) return $_u15; return ""; })(this);
    let pass = ((this$) => { let $_u16 = this$.db().passwords().get(this$.id().toStr()); if ($_u16 != null) return $_u16; return ""; })(this);
    let log = this.trace().asLog();
    let sockConfig = inet.SocketConfig.cur().setTimeouts(this.conn().timeout());
    if (this.rec().has("obixBasicAuth")) {
      this.trace().phase("Authenticate using Basic");
      this.#client = obix.ObixClient.makeBasicAuth(sys.ObjUtil.coerce(lobbyUri, sys.Uri.type$), sys.ObjUtil.coerce(user, sys.Str.type$), sys.ObjUtil.coerce(pass, sys.Str.type$));
    }
    else {
      this.trace().phase("Authenticate using Haystack");
      let $auth = auth.AuthClientContext.open(sys.ObjUtil.coerce(lobbyUri, sys.Uri.type$), sys.ObjUtil.coerce(user, sys.Str.type$), sys.ObjUtil.coerce(pass, sys.Str.type$), log, sockConfig);
      this.trace().phase("AuthClientContext", $auth.headers().toStr());
      this.#client = obix.ObixClient.make(sys.ObjUtil.coerce(lobbyUri, sys.Uri.type$), $auth.headers());
    }
    ;
    this.#client.log(log);
    this.#client.socketConfig(sockConfig);
    this.#client.readLobby();
    this.#isNiagara = sys.Str.contains(sys.ObjUtil.toStr(this.rec().get("productName", "")), "Niagara");
    return;
  }

  onClose() {
    try {
      ((this$) => { let $_u17 = this$.#clientWatch; if ($_u17 == null) return null; return this$.#clientWatch.close(); })(this);
    }
    catch ($_u18) {
    }
    ;
    this.#client = null;
    this.#clientWatch = null;
    this.#watchUris.clear();
    return;
  }

  onPing() {
    let about = this.#client.readAbout();
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let tzStr = sys.ObjUtil.as(ObixUtil.toChildVal(about, "tz"), sys.Str.type$);
    if (tzStr != null) {
      let tz = sys.TimeZone.fromStr(sys.ObjUtil.coerce(tzStr, sys.Str.type$), false);
      if (tz != null) {
        tags.set("tz", tz.name());
      }
      ;
    }
    ;
    tags.set("productName", sys.ObjUtil.coerce(ObixUtil.toChildVal(about, "productName", "?"), sys.Obj.type$));
    tags.set("productVersion", sys.ObjUtil.coerce(ObixUtil.toChildVal(about, "productVersion", "?"), sys.Obj.type$));
    tags.set("vendorName", sys.ObjUtil.coerce(ObixUtil.toChildVal(about, "vendorName", "?"), sys.Obj.type$));
    return haystack.Etc.makeDict(tags);
  }

  onReadObj(uri) {
    this.open();
    return ObixUtil.toGrid(this, this.#client.read(uri));
  }

  onWriteObj(uri,val) {
    this.open();
    let obj = ObixUtil.toObix(val);
    obj.href(uri);
    return ObixUtil.toGrid(this, this.#client.write(obj));
  }

  onInvoke(uri,val) {
    this.open();
    return ObixUtil.toGrid(this, this.#client.invoke(uri, ObixUtil.toObix(val)));
  }

  onLearn(obj) {
    return sys.ObjUtil.coerce(ObixLearn.make(this, sys.ObjUtil.coerce(obj, sys.Uri.type$.toNullable())).learn(), haystack.Grid.type$);
  }

  onSyncCur(points) {
    const this$ = this;
    let uris = sys.List.make(sys.Uri.type$);
    let pointsByIndex = sys.List.make(hxConn.ConnPoint.type$);
    points.each((pt) => {
      if (!pt.isCurEnabled()) {
        return;
      }
      ;
      let uri = sys.ObjUtil.coerce(pt.curAddr(), sys.Uri.type$);
      uris.add(uri);
      pointsByIndex.add(pt);
      return;
    });
    if (uris.isEmpty()) {
      return;
    }
    ;
    let objs = this.#client.batchRead(uris);
    objs.each((obj,i) => {
      let pt = pointsByIndex.get(i);
      this$.syncPoint(pt, obj);
      return;
    });
    return;
  }

  onWatch(points) {
    const this$ = this;
    let uris = sys.List.make(sys.Uri.type$);
    points.each((pt) => {
      if (!pt.isCurEnabled()) {
        return;
      }
      ;
      let uri = sys.ObjUtil.coerce(pt.curAddr(), sys.Uri.type$);
      uris.add(uri);
      this$.#watchUris.set(uri, pt);
      return;
    });
    if (uris.isEmpty()) {
      return;
    }
    ;
    if (this.#client.watchServiceUri() == null) {
      return;
    }
    ;
    try {
      if (this.#clientWatch == null) {
        this.#clientWatch = this.#client.watchOpen();
      }
      ;
      this.syncWatched(this.#clientWatch.add(uris));
    }
    catch ($_u19) {
      $_u19 = sys.Err.make($_u19);
      if ($_u19 instanceof obix.ObixErr) {
        let e = $_u19;
        ;
        this.onWatchErr(e);
      }
      else {
        throw $_u19;
      }
    }
    ;
    return;
  }

  onUnwatch(points) {
    const this$ = this;
    let uris = sys.List.make(sys.Uri.type$);
    points.each((pt) => {
      let uri = sys.ObjUtil.as(pt.rec().get("obixCur"), sys.Uri.type$);
      if (uri == null) {
        return;
      }
      ;
      uris.add(sys.ObjUtil.coerce(uri, sys.Uri.type$));
      this$.#watchUris.remove(sys.ObjUtil.coerce(uri, sys.Uri.type$));
      return;
    });
    if (this.#clientWatch == null) {
      return;
    }
    ;
    try {
      this.#clientWatch.remove(uris);
    }
    catch ($_u20) {
      $_u20 = sys.Err.make($_u20);
      if ($_u20 instanceof sys.Err) {
        let e = $_u20;
        ;
      }
      else {
        throw $_u20;
      }
    }
    ;
    if (this.#watchUris.isEmpty()) {
      let cw = this.#clientWatch;
      this.#clientWatch = null;
      cw.close();
    }
    ;
    return;
  }

  onPollManual() {
    if (this.#clientWatch == null) {
      return;
    }
    ;
    try {
      this.syncWatched(this.#clientWatch.pollChanges());
    }
    catch ($_u21) {
      $_u21 = sys.Err.make($_u21);
      if ($_u21 instanceof sys.Err) {
        let e = $_u21;
        ;
        this.onWatchErr(e);
      }
      else {
        throw $_u21;
      }
    }
    ;
    return;
  }

  onWatchErr(err) {
    if ((sys.ObjUtil.is(err, obix.ObixErr.type$) && sys.ObjUtil.coerce(err, obix.ObixErr.type$).isBadUri())) {
      try {
        this.#clientWatch = this.#client.watchOpen();
        this.syncWatched(this.#clientWatch.add(this.#watchUris.keys()));
        return;
      }
      catch ($_u22) {
        $_u22 = sys.Err.make($_u22);
        if ($_u22 instanceof sys.Err) {
          let e = $_u22;
          ;
        }
        else {
          throw $_u22;
        }
      }
      ;
    }
    ;
    this.close(err);
    return;
  }

  syncWatched(objs) {
    const this$ = this;
    objs.each((obj) => {
      let pt = this$.#watchUris.get(sys.ObjUtil.coerce(obj.href(), sys.Uri.type$));
      if (pt == null) {
        return;
      }
      ;
      this$.syncPoint(sys.ObjUtil.coerce(pt, hxConn.ConnPoint.type$), obj);
      return;
    });
    return;
  }

  syncPoint(pt,obj) {
    if (sys.ObjUtil.equals(obj.elemName(), "err")) {
      pt.updateCurErr(sys.ObjUtil.coerce(obix.ObixErr.make(obj), sys.Err.type$));
      return;
    }
    ;
    let errStatus = this.toCurErrStatus(obj.status());
    if (errStatus != null) {
      pt.updateCurErr(hxConn.RemoteStatusErr.make(sys.ObjUtil.coerce(errStatus, hxConn.ConnStatus.type$)));
      return;
    }
    ;
    let val = obj.val();
    if (sys.ObjUtil.is(val, sys.Num.type$)) {
      (val = haystack.Number.makeNum(sys.ObjUtil.coerce(val, sys.Num.type$), obj.unit()));
    }
    ;
    pt.updateCurOk(val);
    return;
  }

  toCurErrStatus(obixStatus) {
    let $_u23 = obixStatus;
    if (sys.ObjUtil.equals($_u23, obix.Status.down())) {
      return hxConn.ConnStatus.down();
    }
    else if (sys.ObjUtil.equals($_u23, obix.Status.fault())) {
      return hxConn.ConnStatus.fault();
    }
    else if (sys.ObjUtil.equals($_u23, obix.Status.disabled())) {
      return hxConn.ConnStatus.disabled();
    }
    else {
      return null;
    }
    ;
  }

  onWrite(pt,info) {
    const this$ = this;
    let uri = ((this$) => { let $_u24 = sys.ObjUtil.as(pt.writeAddr(), sys.Uri.type$); if ($_u24 != null) return $_u24; throw haystack.FaultErr.make("Missing obixWrite Uri"); })(this);
    let valObj = ObixUtil.toObix(info.val());
    valObj.name("value");
    let arg = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.contract(obix.Contract.writePointIn());
      it.add(valObj);
      return;
    }), obix.ObixObj.type$);
    this.#client.invoke(sys.ObjUtil.coerce(uri, sys.Uri.type$), arg);
    pt.updateWriteOk(info);
    return;
  }

  onSyncHis(point,span) {
    try {
      let items = this.readHisUri(sys.ObjUtil.coerce(point.hisAddr(), sys.Uri.type$), span.start(), span.end(), span.tz());
      return point.updateHisOk(items, span);
    }
    catch ($_u25) {
      $_u25 = sys.Err.make($_u25);
      if ($_u25 instanceof sys.Err) {
        let e = $_u25;
        ;
        return point.updateHisErr(e);
      }
      else {
        throw $_u25;
      }
    }
    ;
  }

  onReadHis(uri,span) {
    const this$ = this;
    this.open();
    let items = this.readHisUri(uri, span.start(), span.end());
    let gb = haystack.GridBuilder.make().addCol("ts").addCol("val");
    gb.capacity(items.size());
    items.each((item) => {
      gb.addRow2(item.ts(), item.val());
      return;
    });
    return gb.toGrid();
  }

  readHisUri(uri,start,end,tz) {
    if (tz === undefined) tz = null;
    return this.readHis(this.#client.read(uri), start, end, tz);
  }

  readHis(hisObj,start,end,tz) {
    if (tz === undefined) tz = null;
    const this$ = this;
    let queryUri = null;
    try {
      (queryUri = hisObj.href().plus(sys.ObjUtil.coerce(hisObj.get("query").href(), sys.Uri.type$)));
    }
    catch ($_u26) {
      $_u26 = sys.Err.make($_u26);
      if ($_u26 instanceof sys.Err) {
        let e = $_u26;
        ;
        let s = sys.StrBuf.make();
        hisObj.writeXml(s.out());
        throw sys.Err.make(sys.Str.plus("Cannot access 'query' op:\n", s), e);
      }
      else {
        throw $_u26;
      }
    }
    ;
    let req = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.contract(obix.Contract.make(sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:HistoryFilter")])));
      return;
    }), obix.ObixObj.type$);
    if (start != null) {
      req.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("start");
        it.val(start);
        return;
      }), obix.ObixObj.type$));
    }
    ;
    if (end != null) {
      req.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("end");
        it.val(end);
        return;
      }), obix.ObixObj.type$));
    }
    ;
    let res = this.#client.invoke(sys.ObjUtil.coerce(queryUri, sys.Uri.type$), req);
    return ObixUtil.toHisItems(res, tz);
  }

}

class ObixLobby extends ObixProxy {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixLobby.type$; }

  #mod = null;

  mod() { return this.#mod; }

  __mod(it) { if (it === undefined) return this.#mod; else this.#mod = it; }

  static make(mod) {
    const $self = new ObixLobby();
    ObixLobby.make$($self,mod);
    return $self;
  }

  static make$($self,mod) {
    ObixProxy.makeLobby$($self);
    $self.#mod = mod;
    return;
  }

  get(name) {
    if (sys.ObjUtil.equals(name, "rec")) {
      return ObixRecs.make(this);
    }
    ;
    if (sys.ObjUtil.equals(name, "query")) {
      return ObixQuery.make(this);
    }
    ;
    return null;
  }

  read() {
    const this$ = this;
    let obj = this.#mod.defaultLobby();
    obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.name("sites");
      it.href(sys.Uri.fromStr("query/site/"));
      return;
    }), obix.ObixObj.type$));
    obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.name("equip");
      it.href(sys.Uri.fromStr("query/equip/"));
      return;
    }), obix.ObixObj.type$));
    obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.name("points");
      it.href(sys.Uri.fromStr("query/point/"));
      return;
    }), obix.ObixObj.type$));
    obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.name("histories");
      it.href(sys.Uri.fromStr("query/his/"));
      return;
    }), obix.ObixObj.type$));
    return obj;
  }

}

class ObixRecs extends ObixProxy {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixRecs.type$; }

  static make(parent) {
    const $self = new ObixRecs();
    ObixRecs.make$($self,parent);
    return $self;
  }

  static make$($self,parent) {
    ObixProxy.make$($self, parent, "rec");
    return;
  }

  get(name) {
    let id = haystack.Ref.fromStr(name, false);
    let rec = ((this$) => { if (id != null) return this$.rt().db().readById(id, false); return this$.rt().db().read(haystack.Filter.eq("name", name), false); })(this);
    if (rec != null) {
      return ObixRec.make(this, name, sys.ObjUtil.coerce(rec, haystack.Dict.type$));
    }
    ;
    return null;
  }

  read() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.href(this$.absBaseUri());
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("comment");
        it.val("use rec/{id|name} to access a record");
        return;
      }), obix.ObixObj.type$));
      return;
    }), obix.ObixObj.type$);
  }

}

class ObixQuery extends ObixProxy {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixQuery.type$; }

  static make(parent) {
    const $self = new ObixQuery();
    ObixQuery.make$($self,parent);
    return $self;
  }

  static make$($self,parent) {
    ObixProxy.make$($self, parent, "query");
    return;
  }

  get(filter) {
    return ObixFilter.make(this, filter);
  }

  read() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.href(this$.absBaseUri());
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("comment");
        it.val("use query/{filter} to query by tag");
        return;
      }), obix.ObixObj.type$));
      return;
    }), obix.ObixObj.type$);
  }

}

class ObixFilter extends ObixProxy {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixFilter.type$; }

  static make(parent,filter) {
    const $self = new ObixFilter();
    ObixFilter.make$($self,parent,filter);
    return $self;
  }

  static make$($self,parent,filter) {
    ObixProxy.make$($self, parent, filter);
    return;
  }

  read() {
    const this$ = this;
    let list = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.href(this$.absBaseUri());
      return;
    }), obix.ObixObj.type$);
    let filter = this.uri().name();
    this.rt().db().readAllList(sys.ObjUtil.coerce(haystack.Filter.fromStr(filter), haystack.Filter.type$)).each((rec) => {
      list.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.elemName("ref");
        it.displayName(rec.dis());
        it.href(this$.idToUri(rec.id()));
        it.contract(ObixAspect.toContract(rec));
        return;
      }), obix.ObixObj.type$));
      return;
    });
    return list;
  }

}

class ObixRec extends ObixProxy {
  constructor() {
    super();
    const this$ = this;
    this.#isRoot = true;
    this.#aspects = sys.List.make(ObixAspect.type$);
    return;
  }

  typeof() { return ObixRec.type$; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  #isRoot = false;

  isRoot(it) {
    if (it === undefined) {
      return this.#isRoot;
    }
    else {
      this.#isRoot = it;
      return;
    }
  }

  #aspects = null;

  aspects(it) {
    if (it === undefined) {
      return this.#aspects;
    }
    else {
      this.#aspects = it;
      return;
    }
  }

  static make(parent,name,rec) {
    const $self = new ObixRec();
    ObixRec.make$($self,parent,name,rec);
    return $self;
  }

  static make$($self,parent,name,rec) {
    ObixProxy.make$($self, parent, name);
    ;
    $self.#rec = rec;
    $self.#aspects = ObixAspect.toAspects(rec);
    return;
  }

  get(name) {
    for (let i = 0; sys.ObjUtil.compareLT(i, this.#aspects.size()); i = sys.Int.increment(i)) {
      let aspectProxy = this.#aspects.get(i).get(this, name);
      if (aspectProxy != null) {
        return aspectProxy;
      }
      ;
    }
    ;
    let tagVal = this.#rec.get(name);
    if (tagVal != null) {
      return ObixTag.make(this, this.#rec, name, sys.ObjUtil.coerce(tagVal, sys.Obj.type$));
    }
    ;
    return null;
  }

  read() {
    const this$ = this;
    let obj = obix.ObixObj.make();
    obj.href(((this$) => { if (this$.#isRoot) return this$.absBaseUri(); return this$.idToUri(this$.#rec.id()); })(this));
    obj.displayName(this.#rec.dis());
    let contracts = sys.List.make(sys.Uri.type$);
    this.#aspects.each((aspect) => {
      contracts.add(aspect.contract());
      aspect.read(this$, obj);
      return;
    });
    if (this.#rec.has("site")) {
      let equipsUri = this.queryToUri(sys.Str.plus("equip and siteRef==", this.#rec.id().toCode()));
      obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.elemName("ref");
        it.displayName("equips");
        it.href(equipsUri);
        return;
      }), obix.ObixObj.type$));
    }
    ;
    if (this.#rec.has("equip")) {
      let pointsUri = this.queryToUri(sys.Str.plus("point and equipRef==", this.#rec.id().toCode()));
      obj.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.elemName("ref");
        it.displayName("points");
        it.href(pointsUri);
        return;
      }), obix.ObixObj.type$));
    }
    ;
    this.#rec.each((v,n) => {
      if (v === haystack.Marker.val()) {
        contracts.add(sys.Str.toUri(sys.Str.plus("tag:", n)));
        return;
      }
      ;
      if (sys.ObjUtil.equals(n, "id")) {
        return;
      }
      ;
      if (sys.ObjUtil.equals(n, "dis")) {
        obj.displayName(sys.ObjUtil.coerce(v, sys.Str.type$.toNullable()));
      }
      ;
      if (!obj.has(n)) {
        obj.add(this$.tagToObj(n, v));
      }
      ;
      return;
    });
    if (!contracts.isEmpty()) {
      obj.contract(obix.Contract.make(contracts));
    }
    ;
    return obj;
  }

  tagToObj(name,val) {
    const this$ = this;
    if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
      let ref = sys.ObjUtil.coerce(val, haystack.Ref.type$);
      let obj = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name(name);
        it.elemName("ref");
        it.href(this$.idToUri(ref));
        return;
      }), obix.ObixObj.type$);
      if (ref.disVal() != null) {
        obj.display(ref.disVal());
      }
      ;
      return obj;
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Number.type$)) {
      let num = sys.ObjUtil.coerce(val, haystack.Number.type$);
      return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name(name);
        it.val(sys.ObjUtil.coerce(num.toFloat(), sys.Obj.type$.toNullable()));
        it.unit(num.unit());
        it.href(sys.Str.toUri(name));
        return;
      }), obix.ObixObj.type$);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Coord.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name(name);
        it.val(sys.ObjUtil.toStr(val));
        it.href(sys.Str.toUri(name));
        return;
      }), obix.ObixObj.type$);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Bin.type$)) {
      (val = sys.ObjUtil.toStr(val));
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.name(name);
      it.val(val);
      it.href(sys.Str.toUri(name));
      return;
    }), obix.ObixObj.type$);
  }

}

class ObixTag extends ObixRec {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixTag.type$; }

  #tagName = null;

  tagName() { return this.#tagName; }

  __tagName(it) { if (it === undefined) return this.#tagName; else this.#tagName = it; }

  #tagVal = null;

  tagVal() { return this.#tagVal; }

  __tagVal(it) { if (it === undefined) return this.#tagVal; else this.#tagVal = it; }

  static make(parent,rec,tagName,tagVal) {
    const $self = new ObixTag();
    ObixTag.make$($self,parent,rec,tagName,tagVal);
    return $self;
  }

  static make$($self,parent,rec,tagName,tagVal) {
    ObixRec.make$($self, parent, tagName, rec);
    $self.#tagName = tagName;
    $self.#tagVal = ((this$) => { let $_u29 = tagVal; if ($_u29 == null) return null; return sys.ObjUtil.toImmutable(tagVal); })($self);
    return;
  }

  read() {
    let obj = this.tagToObj(this.#tagName, this.#tagVal);
    obj.href(this.absBaseUri());
    return obj;
  }

}

class ObixVal extends ObixProxy {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixVal.type$; }

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

  static make(parent,name,val) {
    const $self = new ObixVal();
    ObixVal.make$($self,parent,name,val);
    return $self;
  }

  static make$($self,parent,name,val) {
    ObixProxy.make$($self, parent, name);
    $self.#val = val;
    return;
  }

  read() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.href(this$.absBaseUri());
      it.val(this$.#val);
      return;
    }), obix.ObixObj.type$);
  }

}

class ObixLearn extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#objs = sys.List.make(ObixLearnObj.type$);
    return;
  }

  typeof() { return ObixLearn.type$; }

  #conn = null;

  conn(it) {
    if (it === undefined) {
      return this.#conn;
    }
    else {
      this.#conn = it;
      return;
    }
  }

  #client = null;

  client(it) {
    if (it === undefined) {
      return this.#client;
    }
    else {
      this.#client = it;
      return;
    }
  }

  #learnUri = null;

  learnUri(it) {
    if (it === undefined) {
      return this.#learnUri;
    }
    else {
      this.#learnUri = it;
      return;
    }
  }

  #baseObj = null;

  baseObj(it) {
    if (it === undefined) {
      return this.#baseObj;
    }
    else {
      this.#baseObj = it;
      return;
    }
  }

  #baseUri = null;

  baseUri(it) {
    if (it === undefined) {
      return this.#baseUri;
    }
    else {
      this.#baseUri = it;
      return;
    }
  }

  #objs = null;

  objs(it) {
    if (it === undefined) {
      return this.#objs;
    }
    else {
      this.#objs = it;
      return;
    }
  }

  static make(conn,learnUri) {
    const $self = new ObixLearn();
    ObixLearn.make$($self,conn,learnUri);
    return $self;
  }

  static make$($self,conn,learnUri) {
    ;
    $self.#conn = conn;
    $self.#client = sys.ObjUtil.coerce(conn.client(), obix.ObixClient.type$);
    $self.#learnUri = sys.ObjUtil.coerce(((this$) => { let $_u30 = learnUri; if ($_u30 != null) return $_u30; return sys.Uri.fromStr(""); })($self), sys.Uri.type$);
    return;
  }

  learn() {
    let t1 = sys.Duration.now();
    this.readBaseObj();
    this.addObj(sys.ObjUtil.coerce(this.#baseObj, obix.ObixObj.type$));
    this.addExtent();
    this.learnRefs();
    this.learnMore();
    this.fixIcons();
    let t2 = sys.Duration.now();
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("ObixLearn ", this.#learnUri), " ["), t2.minus(t1).toLocale()), "]"));
    return this.toGrid();
  }

  readBaseObj() {
    this.#baseObj = this.#client.read(this.#learnUri);
    this.#baseUri = this.#baseObj.href();
    return;
  }

  addExtent() {
    const this$ = this;
    this.#baseObj.each((child) => {
      this$.addObj(child);
      if (sys.ObjUtil.equals(child.elemName(), "list")) {
        child.each((grandchild) => {
          this$.addObj(grandchild);
          return;
        });
      }
      ;
      return;
    });
    return;
  }

  addObj(obj) {
    if (obj.href() == null) {
      return;
    }
    ;
    this.#objs.add(this.makeObj(obj));
    return;
  }

  makeObj(obj) {
    if (this.#conn.isNiagara()) {
      return ObixNiagaraObj.make(this, obj);
    }
    ;
    return ObixLearnObj.make(this, obj);
  }

  learnRefs() {
    const this$ = this;
    let uris = sys.List.make(sys.Uri.type$);
    let uriToObj = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Int"), sys.Type.find("sys::Int"));
    this.#objs.each((obj,i) => {
      if (sys.ObjUtil.equals(i, 0)) {
        return;
      }
      ;
      if (sys.ObjUtil.compareNE(obj.obj().elemName(), "ref")) {
        return;
      }
      ;
      if ((!obj.isPoint() && !obj.isHistory())) {
        return;
      }
      ;
      uriToObj.set(sys.ObjUtil.coerce(uris.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      uris.add(obj.uri());
      return;
    });
    if (uris.isEmpty()) {
      return;
    }
    ;
    let res = this.#client.batchRead(uris);
    res.each((r,i) => {
      this$.#objs.set(sys.ObjUtil.coerce(uriToObj.get(sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), sys.Int.type$), this$.makeObj(r));
      return;
    });
    return;
  }

  learnMore() {
    const this$ = this;
    let batchReq = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.elemName("list");
      it.contract(obix.Contract.batchIn());
      return;
    }), obix.ObixObj.type$);
    let batchMores = sys.List.make(ObixLearnMore.type$);
    this.#objs.each((obj) => {
      let more = obj.more();
      if (more == null) {
        return;
      }
      ;
      let req = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.elemName("uri");
        it.contract(more.req());
        it.val(obj.more().uri());
        return;
      }), obix.ObixObj.type$);
      if (more.arg() != null) {
        more.arg().name("in");
        req.add(sys.ObjUtil.coerce(more.arg(), obix.ObixObj.type$));
      }
      ;
      batchReq.add(req);
      batchMores.add(sys.ObjUtil.coerce(more, ObixLearnMore.type$));
      return;
    });
    if (batchMores.isEmpty()) {
      return;
    }
    ;
    if (this.#client.batchUri() == null) {
      throw sys.Err.make("ObixClient.batchUri not configured");
    }
    ;
    let batchRes = this.#client.invoke(sys.ObjUtil.coerce(this.#client.batchUri(), sys.Uri.type$), batchReq);
    batchRes.list().each((res,i) => {
      batchMores.get(i).onResult(res);
      return;
    });
    return;
  }

  fixIcons() {
    const this$ = this;
    let baseUri = sys.Str.plus(this.#conn.lib().web().uri().toStr(), sys.Str.plus("icon/", this.#conn.id()));
    this.#objs.each((obj) => {
      if ((obj.icon() != null && sys.Str.startsWith(obj.icon().toStr(), "/"))) {
        obj.icon(sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus("", baseUri), ""), obj.icon())));
      }
      ;
      return;
    });
    return;
  }

  toGrid() {
    const this$ = this;
    let meta = sys.Map.__fromLiteral(["obixConnRef","uri"], [this.#conn.id(),this.#learnUri], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let cols = sys.List.make(sys.Str.type$, ["dis", "learn", "point", "kind", "unit", "enum", "hisInterpolate", "obixCur", "obixWrite", "obixHis", "icon"]);
    let rows = sys.List.make(sys.Obj.type$.toNullable());
    this.#objs.each((obj) => {
      rows.add(sys.List.make(sys.Obj.type$.toNullable(), [obj.dis(), obj.learn(), ((this$) => { if (obj.isPoint()) return haystack.Marker.val(); return null; })(this$), obj.kind(), obj.unit(), obj.enum(), obj.hisInterpolate(), obj.obixCur(), obj.obixWrite(), obj.obixHis(), obj.icon()]));
      return;
    });
    return haystack.Etc.makeListsGrid(meta, cols, null, sys.ObjUtil.coerce(rows, sys.Type.find("sys::Obj?[][]")));
  }

}

class ObixLearnObj extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixLearnObj.type$; }

  #parent = null;

  parent(it) {
    if (it === undefined) {
      return this.#parent;
    }
    else {
      this.#parent = it;
      return;
    }
  }

  #obj = null;

  obj(it) {
    if (it === undefined) {
      return this.#obj;
    }
    else {
      this.#obj = it;
      return;
    }
  }

  #isPoint = false;

  isPoint(it) {
    if (it === undefined) {
      return this.#isPoint;
    }
    else {
      this.#isPoint = it;
      return;
    }
  }

  #isWritable = false;

  isWritable(it) {
    if (it === undefined) {
      return this.#isWritable;
    }
    else {
      this.#isWritable = it;
      return;
    }
  }

  #isHistory = false;

  isHistory(it) {
    if (it === undefined) {
      return this.#isHistory;
    }
    else {
      this.#isHistory = it;
      return;
    }
  }

  #uri = null;

  uri(it) {
    if (it === undefined) {
      return this.#uri;
    }
    else {
      this.#uri = it;
      return;
    }
  }

  #dis = null;

  dis(it) {
    if (it === undefined) {
      return this.#dis;
    }
    else {
      this.#dis = it;
      return;
    }
  }

  #learn = null;

  learn(it) {
    if (it === undefined) {
      return this.#learn;
    }
    else {
      this.#learn = it;
      return;
    }
  }

  #icon = null;

  icon(it) {
    if (it === undefined) {
      return this.#icon;
    }
    else {
      this.#icon = it;
      return;
    }
  }

  #isStr = null;

  isStr(it) {
    if (it === undefined) {
      return this.#isStr;
    }
    else {
      this.#isStr = it;
      return;
    }
  }

  #kind = null;

  kind(it) {
    if (it === undefined) {
      return this.#kind;
    }
    else {
      this.#kind = it;
      return;
    }
  }

  #unit = null;

  unit(it) {
    if (it === undefined) {
      return this.#unit;
    }
    else {
      this.#unit = it;
      return;
    }
  }

  #enum = null;

  enum(it) {
    if (it === undefined) {
      return this.#enum;
    }
    else {
      this.#enum = it;
      return;
    }
  }

  #hisInterpolate = null;

  hisInterpolate(it) {
    if (it === undefined) {
      return this.#hisInterpolate;
    }
    else {
      this.#hisInterpolate = it;
      return;
    }
  }

  #obixCur = null;

  obixCur(it) {
    if (it === undefined) {
      return this.#obixCur;
    }
    else {
      this.#obixCur = it;
      return;
    }
  }

  #obixWrite = null;

  obixWrite(it) {
    if (it === undefined) {
      return this.#obixWrite;
    }
    else {
      this.#obixWrite = it;
      return;
    }
  }

  #obixHis = null;

  obixHis(it) {
    if (it === undefined) {
      return this.#obixHis;
    }
    else {
      this.#obixHis = it;
      return;
    }
  }

  #more = null;

  more(it) {
    if (it === undefined) {
      return this.#more;
    }
    else {
      this.#more = it;
      return;
    }
  }

  static make(parent,obj) {
    const $self = new ObixLearnObj();
    ObixLearnObj.make$($self,parent,obj);
    return $self;
  }

  static make$($self,parent,obj) {
    $self.#parent = parent;
    $self.#obj = obj;
    $self.#uri = $self.toUri();
    $self.#dis = $self.toDis();
    $self.#learn = ((this$) => { if (obj === parent.baseObj()) return null; return this$.#uri; })($self);
    $self.#icon = obj.icon();
    $self.#isStr = ObixUtil.contractToDis(obj.contract());
    $self.#isPoint = obj.contract().has(sys.Uri.fromStr("obix:Point"));
    $self.#isWritable = obj.contract().has(sys.Uri.fromStr("obix:WritablePoint"));
    $self.#isHistory = obj.contract().has(sys.Uri.fromStr("obix:History"));
    $self.#kind = $self.toKind(obj);
    $self.#unit = ((this$) => { let $_u33 = obj.unit(); if ($_u33 == null) return null; return obj.unit().symbol(); })($self);
    $self.#obixCur = ((this$) => { if (this$.#kind != null) return this$.#uri; return null; })($self);
    $self.#obixWrite = $self.toWriteUri();
    $self.#obixHis = ((this$) => { if (this$.#isHistory) return this$.#uri; return null; })($self);
    return;
  }

  toUri() {
    return this.#parent.baseUri().plus(sys.ObjUtil.coerce(this.#obj.href(), sys.Uri.type$)).relToAuth();
  }

  toDis() {
    if (this.#obj.displayName() != null) {
      return sys.ObjUtil.coerce(this.#obj.displayName(), sys.Str.type$);
    }
    ;
    if (this.#obj.name() != null) {
      return this.unescapeName(sys.ObjUtil.coerce(this.#obj.name(), sys.Str.type$));
    }
    ;
    if (this.#obj.href() != null) {
      return this.unescapeName(this.#obj.href().name());
    }
    ;
    return this.#obj.contract().toStr();
  }

  unescapeName(name) {
    return name;
  }

  toKind(val) {
    let type = val.valType();
    if (type == null) {
      return null;
    }
    ;
    if (type === sys.Float.type$) {
      return haystack.Kind.number().name();
    }
    ;
    if (type === sys.Bool.type$) {
      return haystack.Kind.bool().name();
    }
    ;
    return haystack.Kind.str().name();
  }

  toWriteUri() {
    if (!this.#isWritable) {
      return null;
    }
    ;
    let op = this.#obj.get("writePoint", false);
    if (op == null) {
      return null;
    }
    ;
    return this.#uri.plus(sys.ObjUtil.coerce(op.href(), sys.Uri.type$));
  }

  onMore(res) {
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this).name()), " "), this.#obj);
  }

}

class ObixLearnMore extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixLearnMore.type$; }

  #parent = null;

  parent(it) {
    if (it === undefined) {
      return this.#parent;
    }
    else {
      this.#parent = it;
      return;
    }
  }

  #req = null;

  req(it) {
    if (it === undefined) {
      return this.#req;
    }
    else {
      this.#req = it;
      return;
    }
  }

  #uri = null;

  uri(it) {
    if (it === undefined) {
      return this.#uri;
    }
    else {
      this.#uri = it;
      return;
    }
  }

  #arg = null;

  arg(it) {
    if (it === undefined) {
      return this.#arg;
    }
    else {
      this.#arg = it;
      return;
    }
  }

  static make(parent,uri,arg) {
    const $self = new ObixLearnMore();
    ObixLearnMore.make$($self,parent,uri,arg);
    return $self;
  }

  static make$($self,parent,uri,arg) {
    $self.#parent = parent;
    $self.#req = ((this$) => { if (arg == null) return obix.Contract.read(); return obix.Contract.invoke(); })($self);
    $self.#uri = uri;
    $self.#arg = arg;
    return;
  }

  client() {
    return this.#parent.parent().client();
  }

}

class ObixNiagaraObj extends ObixLearnObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixNiagaraObj.type$; }

  static make(parent,obj) {
    const $self = new ObixNiagaraObj();
    ObixNiagaraObj.make$($self,parent,obj);
    return $self;
  }

  static make$($self,parent,obj) {
    ObixLearnObj.make$($self, parent, obj);
    if ($self.more() == null) {
      $self.more(ObixNiagaraMoreHisExt.check($self));
    }
    ;
    if ($self.more() == null) {
      $self.more(ObixNiagaraMoreHisQuery.check($self));
    }
    ;
    let facets = sys.ObjUtil.as(((this$) => { let $_u37=obj.get("facets", false); return ($_u37==null) ? null : $_u37.val(); })($self), sys.Str.type$);
    if (facets != null) {
      $self.parseFacets(sys.ObjUtil.coerce(facets, sys.Str.type$));
    }
    ;
    return;
  }

  parseFacets(str) {
    const this$ = this;
    try {
      let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
      sys.Str.split(str, sys.ObjUtil.coerce(124, sys.Int.type$.toNullable())).each((tok) => {
        let eq = sys.Str.index(tok, "=");
        let key = sys.Str.getRange(tok, sys.Range.make(0, sys.ObjUtil.coerce(eq, sys.Int.type$), true));
        let val = sys.Str.getRange(tok, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(eq, sys.Int.type$), 3), -1));
        map.set(key, val);
        return;
      });
      let trueText = map.get("trueText");
      let falseText = map.get("falseText");
      if ((trueText != null && falseText != null)) {
        (trueText = sys.Str.replace(this.unescapeName(sys.ObjUtil.coerce(trueText, sys.Str.type$)), ",", "."));
        (falseText = sys.Str.replace(this.unescapeName(sys.ObjUtil.coerce(falseText, sys.Str.type$)), ",", "."));
        this.enum(sys.Str.plus(sys.Str.plus(sys.Str.plus("", falseText), ","), trueText));
        return;
      }
      ;
      let range = map.get("range");
      if (range != null) {
        let names = sys.List.make(sys.Str.type$);
        sys.Str.split(sys.Str.getRange(range, sys.Range.make(1, -2)), sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).each((pair) => {
          let name = sys.Str.trim(sys.Str.getRange(pair, sys.Range.make(0, sys.ObjUtil.coerce(sys.Str.index(pair, "="), sys.Int.type$), true)));
          (name = sys.Str.replace(this$.unescapeName(name), ",", "."));
          names.add(name);
          return;
        });
        this.enum(names.join(","));
        return;
      }
      ;
    }
    catch ($_u38) {
      $_u38 = sys.Err.make($_u38);
      if ($_u38 instanceof sys.Err) {
        let e = $_u38;
        ;
      }
      else {
        throw $_u38;
      }
    }
    ;
    return;
  }

  unescapeName(name) {
    try {
      let s = sys.StrBuf.make();
      for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(name)); i = sys.Int.increment(i)) {
        let ch = sys.Str.get(name, i);
        if (sys.ObjUtil.equals(ch, 95)) {
          s.addChar(32);
          continue;
        }
        ;
        if (sys.ObjUtil.compareNE(ch, 36)) {
          s.addChar(ch);
          continue;
        }
        ;
        (ch = sys.Int.plus(sys.Int.shiftl(sys.ObjUtil.coerce(sys.Int.fromDigit(sys.Str.get(name, i = sys.Int.increment(i)), 16), sys.Int.type$), 4), sys.ObjUtil.coerce(sys.Int.fromDigit(sys.Str.get(name, i = sys.Int.increment(i)), 16), sys.Int.type$)));
        s.addChar(ch);
      }
      ;
      return s.toStr();
    }
    catch ($_u39) {
      $_u39 = sys.Err.make($_u39);
      if ($_u39 instanceof sys.Err) {
        let e = $_u39;
        ;
        e.trace();
        return name;
      }
      else {
        throw $_u39;
      }
    }
    ;
  }

}

class ObixNiagaraMoreHisExt extends ObixLearnMore {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixNiagaraMoreHisExt.type$; }

  static check(p) {
    const this$ = this;
    if (!p.isPoint()) {
      return null;
    }
    ;
    let hisExt = p.obj().list().find((child) => {
      return sys.Str.contains(child.contract().toStr(), "HistoryExt");
    });
    if (hisExt == null) {
      return null;
    }
    ;
    if (sys.Str.contains(hisExt.contract().toStr(), "Cov")) {
      p.hisInterpolate("cov");
    }
    ;
    return ObixNiagaraMoreHisExt.make(p, p.uri().plus(sys.ObjUtil.coerce(hisExt.href(), sys.Uri.type$)).plus(sys.Uri.fromStr("historyConfig/")));
  }

  onResult(res) {
    let idObj = res.get("id", false);
    if ((idObj == null || idObj.isNull() || !sys.ObjUtil.is(idObj.val(), sys.Str.type$))) {
      return;
    }
    ;
    let id = sys.ObjUtil.coerce(idObj.val(), sys.Str.type$);
    this.parent().obixHis(this.client().lobbyUri().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("histories", id), "/"))).relToAuth());
    return;
  }

  static make(p,u) {
    const $self = new ObixNiagaraMoreHisExt();
    ObixNiagaraMoreHisExt.make$($self,p,u);
    return $self;
  }

  static make$($self,p,u) {
    ObixLearnMore.make$($self, p, u, null);
    return;
  }

}

class ObixNiagaraMoreHisQuery extends ObixLearnMore {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixNiagaraMoreHisQuery.type$; }

  static #historyFilterContract = undefined;

  static historyFilterContract() {
    if (ObixNiagaraMoreHisQuery.#historyFilterContract === undefined) {
      ObixNiagaraMoreHisQuery.static$init();
      if (ObixNiagaraMoreHisQuery.#historyFilterContract === undefined) ObixNiagaraMoreHisQuery.#historyFilterContract = null;
    }
    return ObixNiagaraMoreHisQuery.#historyFilterContract;
  }

  static check(p) {
    const this$ = this;
    if (!p.isHistory()) {
      return null;
    }
    ;
    if (p.kind() != null) {
      return null;
    }
    ;
    if (sys.ObjUtil.equals(p.uri().name(), "AuditHistory")) {
      return null;
    }
    ;
    if (sys.ObjUtil.equals(p.uri().name(), "LogHistory")) {
      return null;
    }
    ;
    let query = ((this$) => { let $_u40=p.obj().get("query", false); return ($_u40==null) ? null : $_u40.href(); })(this);
    if (query == null) {
      return null;
    }
    ;
    let end = sys.ObjUtil.as(((this$) => { let $_u41=p.obj().get("start", false); return ($_u41==null) ? null : $_u41.val(); })(this), sys.DateTime.type$);
    if (end == null) {
      return null;
    }
    ;
    let arg = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.contract(ObixNiagaraMoreHisQuery.historyFilterContract());
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("limit");
        it.val(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
        return;
      }), obix.ObixObj.type$));
      return;
    }), obix.ObixObj.type$);
    return ObixNiagaraMoreHisQuery.make(p, sys.ObjUtil.coerce(query, sys.Uri.type$), arg);
  }

  onResult(res) {
    let proto = ((this$) => { let $_u42 = res.last(); if ($_u42 == null) return null; return res.last().get("value", false); })(this);
    if (proto == null) {
      return;
    }
    ;
    this.parent().unit(((this$) => { let $_u43 = proto.unit(); if ($_u43 == null) return null; return proto.unit().symbol(); })(this));
    this.parent().kind(this.parent().toKind(sys.ObjUtil.coerce(proto, obix.ObixObj.type$)));
    return;
  }

  static make(p,u,a) {
    const $self = new ObixNiagaraMoreHisQuery();
    ObixNiagaraMoreHisQuery.make$($self,p,u,a);
    return $self;
  }

  static make$($self,p,u,a) {
    ObixLearnMore.make$($self, p, u, a);
    return;
  }

  static static$init() {
    ObixNiagaraMoreHisQuery.#historyFilterContract = sys.ObjUtil.coerce(obix.Contract.fromStr("obix:HistoryFilter"), obix.Contract.type$);
    return;
  }

}

class ObixWebMod extends obix.ObixMod {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixWebMod.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  static make(lib) {
    const $self = new ObixWebMod();
    ObixWebMod.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    obix.ObixMod.make$($self, sys.Map.__fromLiteral(["serverName","vendorName","vendorUrl","productName","productUrl","productVersion"], [lib.rt().name(),lib.rt().platform().vendorName(),lib.rt().platform().vendorUri(),lib.rt().platform().productName(),lib.rt().platform().productUri(),sys.ObjUtil.typeof(lib).pod().version().toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    $self.#rt = lib.rt();
    $self.#lib = lib;
    return;
  }

  onService() {
    let cmd = this.req().modRel().path().getSafe(0);
    if (sys.ObjUtil.equals(cmd, "icon")) {
      this.icon(sys.ObjUtil.coerce(this.req().stash().get("proj"), hx.HxRuntime.type$));
      return;
    }
    ;
    obix.ObixMod.prototype.onService.call(this);
    return;
  }

  onRead(uri) {
    return this.resolve(uri).read();
  }

  onWrite(uri,arg) {
    return this.resolve(uri).write(arg);
  }

  onInvoke(uri,arg) {
    return this.resolve(uri).invoke(arg);
  }

  lobby() {
    return ObixLobby.make(this).read();
  }

  defaultLobby() {
    return obix.ObixMod.prototype.lobby.call(this);
  }

  resolve(uri) {
    const this$ = this;
    let proxy = ObixLobby.make(this);
    uri.path().each((name,i) => {
      (proxy = proxy.get(name));
      if (proxy == null) {
        throw sys.UnresolvedErr.make(uri.toStr());
      }
      ;
      return;
    });
    return sys.ObjUtil.coerce(proxy, ObixProxy.type$);
  }

  watchOpen() {
    let w = this.#rt.watch().open(sys.Str.plus("Obix Server: ", this.req().remoteAddr()));
    return ObixWatch.make(this, w);
  }

  watch(id) {
    let w = this.#rt.watch().get(id, false);
    if (w == null) {
      return null;
    }
    ;
    return ObixWatch.make(this, sys.ObjUtil.coerce(w, hx.HxWatch.type$));
  }

  icon(proj) {
    if (sys.ObjUtil.compareNE(this.req().method(), "GET")) {
      this.res().sendErr(501);
      return;
    }
    ;
    let uri = this.req().modRel();
    let id = haystack.Ref.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u44 = uri.path().getSafe(1); if ($_u44 != null) return $_u44; return ""; })(this), sys.Str.type$), false);
    let rec = this.#rt.db().readById(id, false);
    if (rec == null) {
      this.blankIcon();
      return;
    }
    ;
    let obixLobby = sys.ObjUtil.coerce(rec.trap("obixLobby", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Uri.type$);
    let username = sys.ObjUtil.coerce(rec.trap("username", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    let password = sys.ObjUtil.coerce(((this$) => { let $_u45 = this$.#rt.db().passwords().get(rec.id().toStr()); if ($_u45 != null) return $_u45; return ""; })(this), sys.Str.type$);
    let iconUri = obixLobby.plus(uri.getRangeToPathAbs(sys.Range.make(2, -1)));
    let c = web.WebClient.make(iconUri);
    c.reqMethod("GET");
    c.reqHeaders().set("Authorization", sys.Str.plus("Basic ", sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", username), ":"), password)).toBase64()));
    c.writeReq().readRes();
    let status = c.resCode();
    let ct = ((this$) => { let $_u46 = c.resHeaders().get("Content-Type"); if ($_u46 != null) return $_u46; return "error"; })(this);
    let cl = c.resHeaders().get("Content-Length");
    if ((sys.ObjUtil.compareNE(status, 200) || !sys.Str.startsWith(ct, "image"))) {
      this.blankIcon();
      return;
    }
    ;
    this.res().statusCode(status);
    this.res().headers().set("Content-Type", sys.ObjUtil.coerce(ct, sys.Str.type$));
    if (cl != null) {
      this.res().headers().set("Content-Length", sys.ObjUtil.coerce(cl, sys.Str.type$));
    }
    ;
    c.resIn().pipe(this.res().out());
    return;
  }

  blankIcon() {
    let f = sys.Pod.find("fresco").file(sys.Uri.fromStr("fan://frescoRes/img/blank-x16.png"));
    web.FileWeblet.make(sys.ObjUtil.coerce(f, sys.File.type$)).onGet();
    return;
  }

}

class ObixUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixUtil.type$; }

  static toGrid(conn,obj) {
    const this$ = this;
    let meta = ObixUtil.toTags(obj);
    let rows = sys.List.make(sys.Type.find("[sys::Str:sys::Obj]"));
    obj.list().each((kid) => {
      if (sys.ObjUtil.equals(kid.elemName(), "feed")) {
        return;
      }
      ;
      if ((conn.isNiagara() && kid.href() != null && sys.Str.startsWith(kid.href().toStr(), "~"))) {
        return;
      }
      ;
      let tags = ObixUtil.toTags(kid);
      rows.add(tags);
      return;
    });
    return haystack.Etc.makeMapsGrid(meta, rows);
  }

  static toTags(obj) {
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let hasVal = (obj.val() != null && !obj.isNull());
    tags.set("elem", obj.elemName());
    tags.set("status", obj.status().name());
    if (obj.href() != null) {
      tags.set("href", sys.ObjUtil.coerce(obj.href(), sys.Obj.type$));
    }
    ;
    if (obj.name() != null) {
      tags.set("name", sys.ObjUtil.coerce(obj.name(), sys.Obj.type$));
    }
    ;
    if (obj.displayName() != null) {
      tags.set("dis", sys.ObjUtil.coerce(obj.displayName(), sys.Obj.type$));
    }
    ;
    if (obj.display() != null) {
      tags.set("display", sys.ObjUtil.coerce(obj.display(), sys.Obj.type$));
    }
    ;
    if (!obj.contract().isEmpty()) {
      tags.set("is", obj.contract().toStr());
    }
    ;
    if (hasVal) {
      tags.set("val", sys.ObjUtil.coerce(ObixUtil.toVal(obj), sys.Obj.type$));
    }
    ;
    if (obj.icon() != null) {
      tags.set("icon", sys.ObjUtil.coerce(obj.icon(), sys.Obj.type$));
    }
    ;
    if (obj.in() != null) {
      tags.set("in", obj.in().toStr());
    }
    ;
    if (obj.out() != null) {
      tags.set("out", obj.out().toStr());
    }
    ;
    return tags;
  }

  static toHisItems(res,tz) {
    const this$ = this;
    let list = res.get("data");
    if (sys.ObjUtil.equals(list.size(), 0)) {
      return sys.List.make(haystack.HisItem.type$);
    }
    ;
    let unit = null;
    if ((tz == null && list.of() != null)) {
      res.each((kid) => {
        if (kid.href() == null) {
          return;
        }
        ;
        if (!sys.Str.contains(list.of().toStr(), kid.href().toStr())) {
          return;
        }
        ;
        (tz = ((this$) => { let $_u47=kid.get("timestamp", false); return ($_u47==null) ? null : $_u47.tz(); })(this$));
        (unit = ((this$) => { let $_u48=kid.get("value", false); return ($_u48==null) ? null : $_u48.unit(); })(this$));
        return;
      });
    }
    ;
    let items = sys.List.make(haystack.HisItem.type$);
    items.capacity(list.size());
    list.each((obj) => {
      let ts = sys.ObjUtil.coerce(obj.get("timestamp").val(), sys.DateTime.type$);
      let val = ((this$) => { let $_u49=obj.get("value"); return ($_u49==null) ? null : $_u49.val(); })(this$);
      if (sys.ObjUtil.is(val, sys.Num.type$)) {
        (val = haystack.Number.makeNum(sys.ObjUtil.coerce(val, sys.Num.type$), unit));
      }
      ;
      if (tz != null) {
        (ts = ts.toTimeZone(sys.ObjUtil.coerce(tz, sys.TimeZone.type$)));
      }
      ;
      items.add(haystack.HisItem.make(ts, val));
      return;
    });
    return items;
  }

  static toObix(obj) {
    const this$ = this;
    if (obj == null) {
      return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.isNull(true);
        return;
      }), obix.ObixObj.type$);
    }
    ;
    let str = sys.ObjUtil.as(obj, sys.Str.type$);
    if (str != null) {
      if ((sys.Str.startsWith(str, "<") && sys.Str.endsWith(str, ">"))) {
        return obix.ObixObj.readXml(sys.Str.in(str));
      }
      else {
        return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
          it.val(str);
          return;
        }), obix.ObixObj.type$);
      }
      ;
    }
    ;
    let num = sys.ObjUtil.as(obj, haystack.Number.type$);
    if (num != null) {
      return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.val(sys.ObjUtil.coerce(num.toFloat(), sys.Obj.type$.toNullable()));
        it.unit(num.unit());
        return;
      }), obix.ObixObj.type$);
    }
    ;
    let type = sys.ObjUtil.typeof(obj);
    if ((type === sys.Bool.type$ || type === sys.DateTime.type$ || type === sys.Date.type$ || type === sys.Time.type$ || type === sys.Uri.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.val(obj);
        return;
      }), obix.ObixObj.type$);
    }
    ;
    throw sys.Err.make(sys.Str.plus(sys.Str.plus("Cannot map ", sys.ObjUtil.typeof(obj)), " to ObixObj"));
  }

  static toChildVal(obj,name,def) {
    if (def === undefined) def = null;
    let child = obj.get(name, false);
    if ((child != null && child.val() != null)) {
      return ObixUtil.toVal(sys.ObjUtil.coerce(child, obix.ObixObj.type$));
    }
    ;
    return def;
  }

  static toVal(obj) {
    let val = obj.val();
    if (sys.ObjUtil.is(val, sys.Num.type$)) {
      return haystack.Number.makeNum(sys.ObjUtil.coerce(val, sys.Num.type$), obj.unit());
    }
    ;
    if (sys.ObjUtil.is(val, sys.Duration.type$)) {
      return haystack.Number.makeDuration(sys.ObjUtil.coerce(val, sys.Duration.type$));
    }
    ;
    return val;
  }

  static contractToDis(contract) {
    const this$ = this;
    return contract.uris().join(",", (uri) => {
      let s = uri.toStr();
      let colon = sys.Str.indexr(s, ":", -2);
      if (colon != null) {
        (s = sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), -1)));
      }
      ;
      return s;
    });
  }

  static make() {
    const $self = new ObixUtil();
    ObixUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ObixTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObixTest.type$; }

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

  #client = null;

  client(it) {
    if (it === undefined) {
      return this.#client;
    }
    else {
      this.#client = it;
      return;
    }
  }

  #lobbyUri = null;

  lobbyUri(it) {
    if (it === undefined) {
      return this.#lobbyUri;
    }
    else {
      this.#lobbyUri = it;
      return;
    }
  }

  #recA = null;

  recA(it) {
    if (it === undefined) {
      return this.#recA;
    }
    else {
      this.#recA = it;
      return;
    }
  }

  #recB = null;

  recB(it) {
    if (it === undefined) {
      return this.#recB;
    }
    else {
      this.#recB = it;
      return;
    }
  }

  #pt1 = null;

  pt1(it) {
    if (it === undefined) {
      return this.#pt1;
    }
    else {
      this.#pt1 = it;
      return;
    }
  }

  #pt2 = null;

  pt2(it) {
    if (it === undefined) {
      return this.#pt2;
    }
    else {
      this.#pt2 = it;
      return;
    }
  }

  #pt3 = null;

  pt3(it) {
    if (it === undefined) {
      return this.#pt3;
    }
    else {
      this.#pt3 = it;
      return;
    }
  }

  #hisF = null;

  hisF(it) {
    if (it === undefined) {
      return this.#hisF;
    }
    else {
      this.#hisF = it;
      return;
    }
  }

  #hisB = null;

  hisB(it) {
    if (it === undefined) {
      return this.#hisB;
    }
    else {
      this.#hisB = it;
      return;
    }
  }

  #conn = null;

  conn(it) {
    if (it === undefined) {
      return this.#conn;
    }
    else {
      this.#conn = it;
      return;
    }
  }

  #hisSyncF = null;

  hisSyncF(it) {
    if (it === undefined) {
      return this.#hisSyncF;
    }
    else {
      this.#hisSyncF = it;
      return;
    }
  }

  test() {
    this.buildProj();
    this.verifyLobby();
    this.verifyReads();
    this.verifyBatch();
    this.verifyPoints();
    this.verifyHis();
    this.verifyHisQueries();
    this.verifyConn();
    this.verifyReadHis();
    this.verifyHisSync();
    this.verifyServerWatches();
    this.verifyClientWatches();
    this.verifyWritables();
    return;
  }

  buildProj() {
    const this$ = this;
    if (this.rt().platform().isSkySpark()) {
      this.addLib("his");
    }
    else {
      this.addLib("http");
    }
    ;
    this.addLib("task");
    this.#lib = sys.ObjUtil.coerce(this.addLib("obix"), ObixLib.type$.toNullable());
    let m = haystack.Marker.val();
    this.#recA = this.addRec(sys.Map.__fromLiteral(["dis","i","f","s","d","t","m1","m2","geoCoord"], ["Rec A",haystack.HaystackTest.n(sys.ObjUtil.coerce(45, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(-33.0), sys.Num.type$.toNullable())),"55\u00b0",sys.Date.fromStr("2010-05-17"),sys.Time.fromStr("16:30:00"),m,m,haystack.Coord.make(sys.Float.make(10.0), sys.Float.make(-20.0))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#recB = this.addRec(sys.Map.__fromLiteral(["dis","id","a"], ["Rec B",haystack.Ref.fromStr("b"),this.#recA.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#pt1 = this.addRec(sys.Map.__fromLiteral(["dis","id","point","kind"], ["Point #1",haystack.Ref.fromStr("pt1"),m,"Bool"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#pt2 = this.addRec(sys.Map.__fromLiteral(["dis","id","point","kind","room"], ["Point #2",haystack.Ref.fromStr("pt2"),m,"Number","215"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#pt3 = this.addRec(sys.Map.__fromLiteral(["dis","id","point","kind","writable"], ["Point #3",haystack.Ref.fromStr("pt3"),m,"Number",m], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#pt1 = this.commit(sys.ObjUtil.coerce(this.#pt1, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")), folio.Diff.transient());
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(75.0), sys.Num.type$.toNullable()), "fahrenheit")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    let tz = sys.TimeZone.fromStr("Chicago");
    let h = this.addRec(sys.Map.__fromLiteral(["point","his","kind","tz","dis","foo","unit"], [m,m,"Number",tz.name(),"Float His","bar","fahrenheit"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.#hisF = this.readById(h.id());
    let items = sys.List.make(haystack.HisItem.type$);
    sys.Range.make(1, 4).each((mon) => {
      sys.Range.make(1, 28).each((day) => {
        items.add(ObixTest.item(ObixTest.dt(2010, mon, day, 12, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.mult(mon, day), sys.Num.type$)), sys.Obj.type$.toNullable())));
        return;
      });
      return;
    });
    this.rt().his().write(h, items);
    (tz = sys.TimeZone.fromStr("Denver"));
    (h = this.addRec(sys.Map.__fromLiteral(["his","kind","tz","dis","point"], [m,"Bool",tz.name(),"Bool His",m], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))));
    this.#hisB = this.readById(h.id());
    (items = sys.List.make(haystack.HisItem.type$));
    sys.Range.make(1, 4).each((mon) => {
      sys.Range.make(1, 28).each((day) => {
        items.add(ObixTest.item(ObixTest.dt(2010, mon, day, 12, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Int.isOdd(sys.Int.mult(mon, day)), sys.Obj.type$.toNullable())));
        return;
      });
      return;
    });
    this.rt().his().write(h, items);
    return;
  }

  verifyLobby() {
    let lib = sys.ObjUtil.coerce(this.rt().lib("obix"), ObixLib.type$);
    let projApiUri = this.rt().http().siteUri().plus(this.rt().http().apiUri());
    this.#lobbyUri = projApiUri.plus(lib.web().uri());
    this.addUser("alice", "secret");
    let authClient = haystack.Client.open(projApiUri, "alice", "secret");
    this.#client = obix.ObixClient.make(sys.ObjUtil.coerce(this.#lobbyUri, sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.trap(authClient.auth(),"headers", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Type.find("[sys::Str:sys::Str]")));
    let lobby = this.#client.readLobby();
    this.verifyEq(lobby.href(), this.#lobbyUri);
    this.verifyEq(lobby.contract().toStr(), "obix:Lobby");
    this.verifyEq(this.#client.aboutUri(), sys.Uri.fromStr("about/"));
    let about = this.#client.readAbout();
    this.verifyEq(about.href(), this.#lobbyUri.plus(sys.Uri.fromStr("about/")));
    this.verifyEq(about.contract().toStr(), "obix:About");
    this.verifyEq(about.get("obixVersion").val(), "1.1");
    this.verifyEq(about.get("serverName").val(), this.rt().name());
    this.verifyEq(about.get("vendorName").val(), this.rt().platform().vendorName());
    this.verifyEq(about.get("productName").val(), this.rt().platform().productName());
    this.verifyEq(about.get("tz").val(), sys.TimeZone.cur().fullName());
    return;
  }

  verifyReads() {
    let x = this.#client.read(sys.Str.toUri(sys.Str.plus("rec/", this.#recA.id())));
    this.verifyEq(x.href(), this.#lobbyUri.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recA.id()), "/"))));
    this.verifyEq(x.contract().toStr(), "tag:m1 tag:m2");
    this.verifyEq(x.displayName(), "Rec A");
    this.verifyEq(x.elemName(), "obj");
    this.verifyEq(x.get("dis").val(), "Rec A");
    this.verifyEq(x.get("i").href(), sys.Uri.fromStr("i"));
    this.verifyEq(x.get("i").val(), sys.ObjUtil.coerce(sys.Float.make(45.0), sys.Obj.type$.toNullable()));
    this.verifyEq(x.get("f").val(), sys.ObjUtil.coerce(sys.Float.make(-33.0), sys.Obj.type$.toNullable()));
    this.verifyEq(x.get("s").val(), "55\u00b0");
    this.verifyEq(x.get("d").val(), sys.Date.fromStr("2010-05-17"));
    this.verifyEq(x.get("t").val(), sys.Time.fromStr("16:30:00"));
    this.verifyEq(x.get("m1", false), null);
    this.verifyEq(x.get("geoCoord").val(), "C(10.0,-20.0)");
    (x = this.#client.read(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recA.id()), "/i"))));
    this.verifyEq(x.href(), this.#lobbyUri.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recA.id()), "/i/"))));
    this.verifyEq(x.contract().toStr(), "");
    this.verifyEq(x.elemName(), "real");
    this.verifyEq(x.val(), sys.ObjUtil.coerce(sys.Float.make(45.0), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(x.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    (x = this.#client.read(sys.Uri.fromStr("rec/b/")));
    this.verifyEq(x.href(), this.#lobbyUri.plus(sys.Uri.fromStr("rec/b/")));
    this.verifyEq(x.contract().toStr(), "");
    this.verifyEq(x.displayName(), "Rec B");
    this.verifyEq(x.get("a").elemName(), "ref");
    this.verifyEq(x.get("a").href(), this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recA.id()), "/"))));
    return;
  }

  verifyBatch() {
    let res = this.#client.batchRead(sys.List.make(sys.Uri.type$, [sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recA.id()), "/i")), sys.Uri.fromStr("rec/b/")]));
    this.verifyEq(sys.ObjUtil.coerce(res.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(res.get(0).val(), sys.ObjUtil.coerce(sys.Float.make(45.0), sys.Obj.type$.toNullable()));
    this.verifyEq(res.get(0).href(), this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recA.id()), "/i"))));
    this.verifyEq(res.get(1).displayName(), "Rec B");
    this.verifyEq(res.get(1).href(), this.href(sys.Uri.fromStr("rec/b/")));
    return;
  }

  verifyPoints() {
    let x = this.#client.read(sys.Uri.fromStr("rec/pt1"));
    this.verifyEq(x.href(), this.#lobbyUri.plus(sys.Uri.fromStr("rec/pt1/")));
    this.verifyEq(x.contract().toStr(), "obix:Point tag:point");
    this.verifyEq(x.elemName(), "bool");
    this.verifyEq(x.displayName(), "Point #1");
    this.verifyEq(x.val(), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    (x = this.#client.read(sys.Uri.fromStr("rec/pt2/")));
    this.verifyEq(x.href(), this.#lobbyUri.plus(sys.Uri.fromStr("rec/pt2/")));
    this.verifyEq(x.contract().toStr(), "obix:Point tag:point");
    this.verifyEq(x.elemName(), "real");
    this.verifyEq(x.displayName(), "Point #2");
    this.verifyEq(x.val(), sys.ObjUtil.coerce(sys.Float.make(75.0), sys.Obj.type$.toNullable()));
    this.verifyEq(x.unit(), sys.Unit.fromStr("fahrenheit"));
    this.verifyEq(x.get("room").val(), "215");
    return;
  }

  verifyHis() {
    const this$ = this;
    this.#hisF = this.readById(this.#hisF.id());
    this.#hisB = this.readById(this.#hisB.id());
    let x = this.#client.read(sys.Str.toUri(sys.Str.plus("rec/", this.#hisF.id())));
    this.verifyEq(x.href(), this.#lobbyUri.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#hisF.id()), "/"))));
    this.verifyEq(x.contract().toStr(), "obix:Point obix:History tag:point tag:his");
    this.verifyEq(x.elemName(), "obj");
    this.verifyEq(x.displayName(), "Float His");
    this.verifyEq(x.get("count").val(), sys.ObjUtil.trap(this.#hisF.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])),"toInt", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(x.get("start").val(), this.#hisF.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(x.get("start").tz(), sys.TimeZone.fromStr("Chicago"));
    this.verifyEq(x.get("end").val(), this.#hisF.trap("hisEnd", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(x.get("end").tz(), sys.TimeZone.fromStr("Chicago"));
    this.verifyEq(x.get("tz").val(), "America/Chicago");
    let q = x.get("query");
    this.verifyEq(q.href(), sys.Uri.fromStr("query"));
    let testQuery = () => {
      this$.verifyEq(q.elemName(), "op");
      this$.verifyEq(q.in().toStr(), "obix:HistoryFilter");
      this$.verifyEq(q.out().toStr(), "obix:HistoryQueryOut");
      return;
    };
    (q = this.#client.read(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#hisF.id()), "/query"))));
    this.verifyEq(q.href(), this.#lobbyUri.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#hisF.id()), "/query/"))));
    sys.Func.call(testQuery);
    (x = this.#client.read(sys.Str.toUri(sys.Str.plus("rec/", this.#hisB.id()))));
    this.verifyEq(x.href(), this.#lobbyUri.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#hisB.id()), "/"))));
    this.verifyEq(x.contract().uris().dup().sort(), sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("obix:Point"), sys.Uri.fromStr("obix:History"), sys.Uri.fromStr("tag:his"), sys.Uri.fromStr("tag:point")]).sort());
    this.verifyEq(x.displayName(), "Bool His");
    this.verifyEq(x.get("count").val(), sys.ObjUtil.trap(this.#hisB.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])),"toInt", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(x.get("start").val(), this.#hisB.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(x.get("start").tz(), sys.TimeZone.fromStr("Denver"));
    this.verifyEq(x.get("end").val(), this.#hisB.trap("hisEnd", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(x.get("end").tz(), sys.TimeZone.fromStr("Denver"));
    this.verifyEq(x.get("tz").val(), "America/Denver");
    return;
  }

  verifyHisQueries() {
    let tz = sys.TimeZone.fromStr(sys.ObjUtil.coerce(this.#hisF.trap("tz", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$));
    this.verifyHisQuery(sys.ObjUtil.coerce(this.#hisF, haystack.Dict.type$), null, null);
    this.verifyHisQuery(sys.ObjUtil.coerce(this.#hisF, haystack.Dict.type$), sys.Date.fromStr("2010-02-01").midnight(sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.Date.fromStr("2010-03-01").midnight(sys.ObjUtil.coerce(tz, sys.TimeZone.type$)));
    this.verifyHisQuery(sys.ObjUtil.coerce(this.#hisF, haystack.Dict.type$), null, null, sys.ObjUtil.coerce(5, sys.Int.type$.toNullable()));
    return;
  }

  verifyHisQuery(rec,s,e,limit) {
    if (limit === undefined) limit = null;
    const this$ = this;
    let tz = sys.TimeZone.fromStr(sys.ObjUtil.coerce(rec.trap("tz", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$));
    let arg = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("limit");
        it.val(sys.ObjUtil.coerce(limit, sys.Obj.type$.toNullable()));
        return;
      }), obix.ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("start");
        it.val(s);
        return;
      }), obix.ObixObj.type$)).add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("end");
        it.val(e);
        return;
      }), obix.ObixObj.type$));
      return;
    }), obix.ObixObj.type$);
    let r = this.#client.invoke(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", rec.id()), "/query")), arg);
    this.verifyEq(r.contract().toStr(), "obix:HistoryQueryOut");
    this.verifyEq(r.get("count").val(), sys.ObjUtil.coerce(r.get("data").size(), sys.Obj.type$.toNullable()));
    if (limit != null) {
      this.verify(sys.ObjUtil.compareLE(r.get("count").val(), limit));
    }
    ;
    this.verifyEq(r.get("start").val(), s);
    this.verifyEq(r.get("end").val(), e);
    this.verifyEq(r.get("proto").get("timestamp").tz(), tz);
    if (rec.has("unit")) {
      this.verifyEq(r.get("proto").get("value").elemName(), "real");
      this.verifyEq(r.get("proto").get("value").unit(), sys.Unit.fromStr(sys.ObjUtil.coerce(rec.trap("unit", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)));
    }
    ;
    let items = sys.List.make(haystack.HisItem.type$);
    this.rt().his().read(rec, ((this$) => { if (s == null) return null; return haystack.Span.makeAbs(sys.ObjUtil.coerce(s, sys.DateTime.type$), sys.ObjUtil.coerce(e, sys.DateTime.type$)); })(this), null, (item) => {
      items.add(item);
      return;
    });
    if (limit != null) {
      (items = items.getRange(sys.Range.make(0, sys.ObjUtil.coerce(limit, sys.Int.type$), true)));
    }
    ;
    let data = r.get("data");
    this.verifyEq(sys.ObjUtil.coerce(items.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(data.size(), sys.Obj.type$.toNullable()));
    let i = 0;
    data.each((x) => {
      let item = items.get(((this$) => { let $_u51 = i;i = sys.Int.increment(i); return $_u51; })(this$));
      this$.verifyEq(x.get("timestamp").val(), item.ts());
      this$.verifyEq(x.get("value").val(), sys.ObjUtil.trap(item.val(),"toFloat", sys.List.make(sys.Obj.type$.toNullable(), [])));
      return;
    });
    return;
  }

  verifyConn() {
    this.#conn = this.addRec(sys.Map.__fromLiteral(["obixConn","obixLobby","username","obixPollFreq"], [haystack.Marker.val(),this.#lobbyUri,"alice",haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable()), "ms")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.rt().db().passwords().set(this.#conn.id().toStr(), "secret");
    let r = this.eval("read(obixConn).obixPing.futureGet");
    this.sync();
    this.#conn = this.read("obixConn");
    this.verifyEq(this.#conn.trap("connStatus", sys.List.make(sys.Obj.type$.toNullable(), [])), "ok");
    this.verifyEq(this.#conn.trap("connState", sys.List.make(sys.Obj.type$.toNullable(), [])), "open");
    this.verifyEq(this.#conn.trap("vendorName", sys.List.make(sys.Obj.type$.toNullable(), [])), this.rt().platform().vendorName());
    this.verifyEq(this.#conn.trap("productName", sys.List.make(sys.Obj.type$.toNullable(), [])), this.rt().platform().productName());
    this.verifyEq(this.#conn.trap("tz", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.TimeZone.cur().name());
    this.eval(sys.Str.plus(sys.Str.plus("obixPing(", this.#conn.id().toCode()), ")"));
    return;
  }

  verifyReadHis() {
    let grid = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("obixReadHis(", this.#conn.id().toCode()), ", `rec/"), this.#hisF.id()), "`, 2010-04-01)")), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(grid.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.trap(grid.get(0).trap("ts", sys.List.make(sys.Obj.type$.toNullable(), [])),"date", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Date.make(2010, sys.Month.mar(), 28));
    this.verifyEq(sys.ObjUtil.trap(grid.get(1).trap("ts", sys.List.make(sys.Obj.type$.toNullable(), [])),"date", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Date.make(2010, sys.Month.apr(), 1));
    this.verifyEq(sys.ObjUtil.trap(grid.get(2).trap("ts", sys.List.make(sys.Obj.type$.toNullable(), [])),"date", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Date.make(2010, sys.Month.apr(), 2));
    return;
  }

  verifyHisSync() {
    const this$ = this;
    this.#hisSyncF = this.addRec(sys.Map.__fromLiteral(["dis","obixConnRef","obixHis","his","tz","point","unit","kind"], ["Test Proxy",this.#conn.id(),sys.Str.toUri(sys.Str.plus("rec/", this.#hisF.id())),haystack.HaystackTest.m(),"Chicago",haystack.HaystackTest.m(),"fahrenheit","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.sync();
    let r = this.eval(sys.Str.plus(sys.Str.plus("readById(", this.#hisSyncF.id().toCode()), ").obixSyncHis(2010)"));
    this.sync();
    this.#hisSyncF = this.readById(this.#hisSyncF.id());
    this.#hisF = this.readById(this.#hisF.id());
    this.verifyEq(this.#hisSyncF.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#hisF.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(this.#hisSyncF.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#hisF.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(this.#hisSyncF.trap("hisEnd", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#hisF.trap("hisEnd", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(this.#hisSyncF.trap("hisStatus", sys.List.make(sys.Obj.type$.toNullable(), [])), "ok");
    let a = sys.List.make(haystack.HisItem.type$);
    this.rt().his().read(sys.ObjUtil.coerce(this.#hisF, haystack.Dict.type$), null, null, (item) => {
      a.add(item);
      return;
    });
    let b = sys.List.make(haystack.HisItem.type$);
    this.rt().his().read(sys.ObjUtil.coerce(this.#hisSyncF, haystack.Dict.type$), null, null, (item) => {
      b.add(item);
      return;
    });
    this.verifyEq(a, b);
    this.verifyEq(sys.ObjUtil.trap(a.first().val(),"unit", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Unit.fromStr("fahrenheit"));
    this.verifyEq(sys.ObjUtil.trap(b.first().val(),"unit", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Unit.fromStr("fahrenheit"));
    let tz = sys.TimeZone.fromStr("Chicago");
    this.rt().his().write(sys.ObjUtil.coerce(this.#hisF, haystack.Dict.type$), sys.List.make(haystack.HisItem.type$, [ObixTest.item(ObixTest.dt(2010, 5, 1, 1, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(110.0), sys.Obj.type$.toNullable())), ObixTest.item(ObixTest.dt(2010, 5, 1, 2, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(120.0), sys.Obj.type$.toNullable())), ObixTest.item(ObixTest.dt(2010, 5, 1, 3, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(130.0), sys.Obj.type$.toNullable())), ObixTest.item(ObixTest.dt(2010, 5, 1, 4, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(140.0), sys.Obj.type$.toNullable())), ObixTest.item(ObixTest.dt(2010, 5, 1, 5, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(150.0), sys.Obj.type$.toNullable())), ObixTest.item(ObixTest.dt(2010, 5, 2, 1, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(210.0), sys.Obj.type$.toNullable())), ObixTest.item(ObixTest.dt(2010, 5, 2, 2, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(220.0), sys.Obj.type$.toNullable())), ObixTest.item(ObixTest.dt(2010, 5, 2, 3, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(230.0), sys.Obj.type$.toNullable()))]));
    this.eval(sys.Str.plus(sys.Str.plus("readById(", this.#hisSyncF.id().toCode()), ").obixSyncHis(2010-05-01)"));
    this.sync();
    this.#hisSyncF = this.readById(this.#hisSyncF.id());
    this.#hisF = this.readById(this.#hisF.id());
    this.verifyEq(this.#hisSyncF.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#hisF.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(this.#hisSyncF.trap("hisEnd", sys.List.make(sys.Obj.type$.toNullable(), [])), ObixTest.dt(2010, 5, 1, 5, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)));
    this.verifyEq(this.#hisSyncF.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(-3, sys.Num.type$.toNullable())).plus(sys.ObjUtil.coerce(this.#hisF.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$)));
    a.clear();
    this.rt().his().read(sys.ObjUtil.coerce(this.#hisF, haystack.Dict.type$), null, null, (item) => {
      a.add(item);
      return;
    });
    b.clear();
    this.rt().his().read(sys.ObjUtil.coerce(this.#hisSyncF, haystack.Dict.type$), null, null, (item) => {
      b.add(item);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(sys.Int.minus(a.size(), 3), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()));
    this.verifyEq(a.getRange(sys.Range.make(0, -4)), b);
    this.eval(sys.Str.plus(sys.Str.plus("readById(", this.#hisSyncF.id().toCode()), ").obixSyncHis"));
    concurrent.Actor.sleep(sys.Duration.fromStr("100ms"));
    this.#hisSyncF = this.readById(this.#hisSyncF.id());
    this.verifyEq(this.#hisSyncF.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#hisF.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(this.#hisSyncF.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#hisF.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(this.#hisSyncF.trap("hisEnd", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#hisF.trap("hisEnd", sys.List.make(sys.Obj.type$.toNullable(), [])));
    a.clear();
    this.rt().his().read(sys.ObjUtil.coerce(this.#hisF, haystack.Dict.type$), null, null, (item) => {
      a.add(item);
      return;
    });
    b.clear();
    this.rt().his().read(sys.ObjUtil.coerce(this.#hisSyncF, haystack.Dict.type$), null, null, (item) => {
      b.add(item);
      return;
    });
    this.verifyEq(a, b);
    return;
  }

  verifyServerWatches() {
    const this$ = this;
    let w = this.#client.invoke(sys.Uri.fromStr("watchService/make"), obix.ObixObj.make());
    this.verifyWatch(w);
    let w2 = this.#client.read(sys.ObjUtil.coerce(w.href(), sys.Uri.type$));
    this.verifyEq(w.href(), w2.href());
    this.verifyWatch(w2);
    let wlease = this.#client.write(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.href(w.get("lease").normalizedHref());
      it.val(sys.Duration.fromStr("47sec"));
      return;
    }), obix.ObixObj.type$));
    this.verifyEq(wlease.val(), sys.Duration.fromStr("47sec"));
    (wlease = this.#client.read(sys.ObjUtil.coerce(w.get("lease").normalizedHref(), sys.Uri.type$)));
    this.verifyEq(wlease.val(), sys.Duration.fromStr("47sec"));
    this.verifyEq(wlease.href(), w.get("lease").normalizedHref());
    (w = this.#client.read(sys.ObjUtil.coerce(w.href(), sys.Uri.type$)));
    this.verifyWatch(w);
    let list = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.elemName("list");
      it.name("hrefs");
      return;
    }), obix.ObixObj.type$);
    list.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.val(this$.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this$.#recA.id()), "/"))));
      return;
    }), obix.ObixObj.type$));
    list.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.val(this$.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this$.#recB.id()), "/"))));
      return;
    }), obix.ObixObj.type$));
    list.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.val(this$.href(sys.Str.toUri(sys.Str.plus("rec/", this$.#pt1.id()))));
      return;
    }), obix.ObixObj.type$));
    list.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.val(sys.Uri.fromStr("foobar"));
      return;
    }), obix.ObixObj.type$));
    let res = this.#client.invoke(sys.ObjUtil.coerce(w.get("add").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.add(list);
      return;
    }), obix.ObixObj.type$));
    let vals = res.get("values").list();
    this.verifyEq(sys.ObjUtil.coerce(vals.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(vals.get(0).href(), this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recA.id()), "/"))));
    this.verifyEq(vals.get(0).normalizedHref(), this.#lobbyUri.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recA.id()), "/"))));
    this.verifyEq(vals.get(0).displayName(), "Rec A");
    this.verifyEq(vals.get(0).get("f").val(), sys.ObjUtil.coerce(sys.Float.make(-33.0), sys.Obj.type$.toNullable()));
    this.verifyEq(vals.get(1).href(), this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recB.id()), "/"))));
    this.verifyEq(vals.get(1).displayName(), "Rec B");
    this.verifyEq(vals.get(1).get("a").href(), this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recA.id()), "/"))));
    this.verifyEq(vals.get(1).get("a").display(), "Rec A");
    this.verifyWatchUnresolvedErr(vals.get(2), this.href(sys.Str.toUri(sys.Str.plus("rec/", this.#pt1.id()))));
    this.verifyWatchUnresolvedErr(vals.get(3), sys.Uri.fromStr("foobar"));
    this.verifyWatchIds(w, sys.List.make(haystack.Dict.type$.toNullable(), [this.#recA, this.#recB]));
    (list = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.elemName("list");
      it.name("hrefs");
      return;
    }), obix.ObixObj.type$));
    list.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.val(this$.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this$.#pt2.id()), "/"))));
      return;
    }), obix.ObixObj.type$));
    list.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.val(this$.href(sys.Uri.fromStr("rec/badone/")));
      return;
    }), obix.ObixObj.type$));
    (res = this.#client.invoke(sys.ObjUtil.coerce(w.get("add").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.add(list);
      return;
    }), obix.ObixObj.type$)));
    (vals = res.get("values").list());
    this.verifyEq(sys.ObjUtil.coerce(vals.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(vals.get(0).href(), this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#pt2.id()), "/"))));
    this.verifyEq(vals.get(0).displayName(), "Point #2");
    this.verifyEq(vals.get(0).val(), sys.ObjUtil.coerce(sys.Float.make(75.0), sys.Obj.type$.toNullable()));
    this.verifyEq(vals.get(0).get("curVal").val(), sys.ObjUtil.coerce(sys.Float.make(75.0), sys.Obj.type$.toNullable()));
    this.verifyWatchUnresolvedErr(vals.get(1), this.href(sys.Uri.fromStr("rec/badone/")));
    this.verifyWatchIds(w, sys.List.make(haystack.Dict.type$.toNullable(), [this.#recA, this.#recB, this.#pt2]));
    (res = this.#client.invoke(sys.ObjUtil.coerce(w.get("pollChanges").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      return;
    }), obix.ObixObj.type$)));
    (vals = res.get("values").list());
    this.verifyEq(sys.ObjUtil.coerce(vals.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    (res = this.#client.invoke(sys.ObjUtil.coerce(w.get("pollChanges").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      return;
    }), obix.ObixObj.type$)));
    (vals = res.get("values").list());
    this.verifyEq(sys.ObjUtil.coerce(vals.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal","curStatus"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(90.0), sys.Num.type$.toNullable())),"fault"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), folio.Diff.transient());
    (res = this.#client.invoke(sys.ObjUtil.coerce(w.get("pollChanges").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      return;
    }), obix.ObixObj.type$)));
    (vals = res.get("values").list());
    this.verifyEq(sys.ObjUtil.coerce(vals.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(vals.get(0).href(), this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#pt2.id()), "/"))));
    this.verifyEq(vals.get(0).normalizedHref(), this.#lobbyUri.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#pt2.id()), "/"))));
    this.verifyEq(vals.get(0).displayName(), "Point #2");
    this.verifyEq(vals.get(0).val(), sys.ObjUtil.coerce(sys.Float.make(90.0), sys.Obj.type$.toNullable()));
    this.verifyEq(vals.get(0).status(), obix.Status.fault());
    this.verifyEq(vals.get(0).get("curVal").val(), sys.ObjUtil.coerce(sys.Float.make(90.0), sys.Obj.type$.toNullable()));
    (res = this.#client.invoke(sys.ObjUtil.coerce(w.get("pollChanges").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      return;
    }), obix.ObixObj.type$)));
    (vals = res.get("values").list());
    this.verifyEq(sys.ObjUtil.coerce(vals.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal","curStatus"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(123.0), sys.Num.type$.toNullable())),"disabled"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), folio.Diff.transient());
    this.#recA = this.commit(sys.ObjUtil.coerce(this.#recA, haystack.Dict.type$), sys.Map.__fromLiteral(["foo"], ["bar"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    (res = this.#client.invoke(sys.ObjUtil.coerce(w.get("pollRefresh").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      return;
    }), obix.ObixObj.type$)));
    (vals = res.get("values").list());
    (vals = vals.dup().sort((a,b) => {
      return sys.ObjUtil.compare(a.displayName(), b.displayName());
    }));
    this.verifyEq(sys.ObjUtil.coerce(vals.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(vals.get(0).href(), this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#pt2.id()), "/"))));
    this.verifyEq(vals.get(0).val(), sys.ObjUtil.coerce(sys.Float.make(123.0), sys.Obj.type$.toNullable()));
    this.verifyEq(vals.get(0).status(), obix.Status.disabled());
    this.verifyEq(vals.get(1).href(), this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recA.id()), "/"))));
    this.verifyEq(vals.get(1).get("foo").val(), "bar");
    this.verifyEq(vals.get(2).href(), this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recB.id()), "/"))));
    (res = this.#client.invoke(sys.ObjUtil.coerce(w.get("pollChanges").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      return;
    }), obix.ObixObj.type$)));
    (vals = res.get("values").list());
    this.verifyEq(sys.ObjUtil.coerce(vals.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.#recA = this.commit(sys.ObjUtil.coerce(this.#recA, haystack.Dict.type$), sys.Map.__fromLiteral(["foo"], ["again"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.#recB = this.commit(sys.ObjUtil.coerce(this.#recB, haystack.Dict.type$), sys.Map.__fromLiteral(["foo"], ["again"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    (list = sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.elemName("list");
      it.name("hrefs");
      return;
    }), obix.ObixObj.type$));
    list.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.val(this$.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this$.#recB.id()), "/"))));
      return;
    }), obix.ObixObj.type$));
    list.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.val(this$.href(sys.Uri.fromStr("rec/badone/")));
      return;
    }), obix.ObixObj.type$));
    (res = this.#client.invoke(sys.ObjUtil.coerce(w.get("remove").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.add(list);
      return;
    }), obix.ObixObj.type$)));
    this.verifyWatchIds(w, sys.List.make(haystack.Dict.type$.toNullable(), [this.#recA, this.#pt2]));
    (res = this.#client.invoke(sys.ObjUtil.coerce(w.get("pollChanges").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      return;
    }), obix.ObixObj.type$)));
    (vals = res.get("values").list());
    this.verifyEq(sys.ObjUtil.coerce(vals.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(vals.get(0).normalizedHref(), this.#lobbyUri.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#recA.id()), "/"))));
    this.verifyEq(vals.get(0).get("foo").val(), "again");
    this.verifyNotNull(this.rt().watch().get(w.href().path().get(-1)));
    (res = this.#client.invoke(sys.ObjUtil.coerce(w.get("delete").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      return;
    }), obix.ObixObj.type$)));
    this.verifyNull(this.rt().watch().get(w.href().path().get(-1), false));
    try {
      (res = this.#client.invoke(sys.ObjUtil.coerce(w.get("pollChanges").normalizedHref(), sys.Uri.type$), sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        return;
      }), obix.ObixObj.type$)));
      this.fail();
    }
    catch ($_u52) {
      $_u52 = sys.Err.make($_u52);
      if ($_u52 instanceof obix.ObixErr) {
        let e = $_u52;
        ;
        this.verifyEq(e.contract().toStr(), "obix:BadUriErr");
      }
      else {
        throw $_u52;
      }
    }
    ;
    return;
  }

  verifyWatch(obj) {
    this.verifyEq(obj.contract().toStr(), "obix:Watch");
    this.verifyEq(obj.get("add").elemName(), "op");
    this.verifyEq(obj.get("remove").elemName(), "op");
    this.verifyEq(obj.get("pollRefresh").elemName(), "op");
    this.verifyEq(obj.get("pollRefresh").elemName(), "op");
    let w = this.rt().watch().get(obj.href().path().get(-1));
    this.verifyEq(w.lease(), obj.get("lease").val());
    return;
  }

  verifyWatchIds(obj,recs) {
    const this$ = this;
    let w = this.rt().watch().get(obj.href().path().get(-1));
    let ids = w.list().sort().findAll((id) => {
      return sys.ObjUtil.compareNE(id.toStr(), "badone");
    });
    this.verifyEq(ids, recs.map((r) => {
      return r.id();
    }, haystack.Ref.type$).sort());
    return;
  }

  verifyWatchUnresolvedErr(obj,uri) {
    this.verifyEq(obj.elemName(), "err");
    this.verifyEq(obj.href(), uri);
    this.verifyEq(obj.contract().toStr(), "obix:BadUriErr");
    return;
  }

  verifyClientWatches() {
    const this$ = this;
    this.commit(sys.ObjUtil.coerce(this.#pt1, haystack.Dict.type$), sys.Map.__fromLiteral(["curStatus"], [haystack.Remove.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Remove")), folio.Diff.transient());
    this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curStatus"], ["ok"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), folio.Diff.transient());
    let p1 = this.addClientProxy("Pt-1", "Bool", this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#pt1.id()), "/"))));
    let p2 = this.addClientProxy("Pt-2", "Number", this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#pt2.id()), "/"))));
    let px = this.addClientProxy("Pt-X", "Number", this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", haystack.Ref.gen()), "/"))));
    this.verifyNotEq(p1.id(), this.#pt1.id());
    this.verifyNotEq(p2.id(), this.#pt2.id());
    this.eval(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("obixSyncCur([", p1.id().toCode()), ", "), p2.id().toCode()), "])"));
    this.sync();
    (p1 = sys.ObjUtil.coerce(this.readById(p1.id()), haystack.Dict.type$));
    this.verifyEq(p1.get("curStatus"), "ok");
    this.verifyEq(p1.get("curVal"), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    (p2 = sys.ObjUtil.coerce(this.readById(p2.id()), haystack.Dict.type$));
    this.verifyEq(p2.get("curStatus"), "ok");
    this.verifyEq(p2.get("curVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())));
    this.commit(sys.ObjUtil.coerce(this.readById(this.#pt1.id()), haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")), folio.Diff.transient());
    this.commit(sys.ObjUtil.coerce(this.readById(this.#pt2.id()), haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(93, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    this.eval(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("obixSyncCur([", p1.id().toCode()), ", "), p2.id().toCode()), "])"));
    this.sync();
    (p1 = sys.ObjUtil.coerce(this.readById(p1.id()), haystack.Dict.type$));
    this.verifyEq(p1.get("curStatus"), "ok");
    this.verifyEq(p1.get("curVal"), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    (p2 = sys.ObjUtil.coerce(this.readById(p2.id()), haystack.Dict.type$));
    this.verifyEq(p2.get("curStatus"), "ok");
    this.verifyEq(p2.get("curVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(93, sys.Num.type$.toNullable())));
    this.commit(sys.ObjUtil.coerce(this.readById(this.#pt1.id()), haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")), folio.Diff.transient());
    this.commit(sys.ObjUtil.coerce(this.readById(this.#pt2.id()), haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(555, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    let w = this.rt().watch().open("test");
    w.addAll(sys.List.make(haystack.Ref.type$, [p1.id(), p2.id(), px.id()]));
    this.sync();
    (p1 = sys.ObjUtil.coerce(this.readById(p1.id()), haystack.Dict.type$));
    this.verifyEq(p1.get("curStatus"), "ok");
    this.verifyEq(p1.get("curVal"), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    (p2 = sys.ObjUtil.coerce(this.readById(p2.id()), haystack.Dict.type$));
    this.verifyEq(p2.get("curStatus"), "ok");
    this.verifyEq(p2.get("curVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(555, sys.Num.type$.toNullable())));
    (px = sys.ObjUtil.coerce(this.readById(px.id()), haystack.Dict.type$));
    this.verifyEq(px.get("curStatus"), "fault");
    this.verifyEq(px.get("curVal"), null);
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().list().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().isWatched(this.#pt1.id()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().isWatched(this.#pt2.id()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.#pt1 = this.commit(sys.ObjUtil.coerce(this.#pt1, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")), folio.Diff.transient());
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(345, sys.Num.type$.toNullable()), "ft")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    concurrent.Actor.sleep(sys.Duration.fromStr("200ms"));
    (p1 = sys.ObjUtil.coerce(this.readById(p1.id()), haystack.Dict.type$));
    this.verifyEq(p1.get("curStatus"), "ok");
    this.verifyEq(p1.get("curVal"), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    (p2 = sys.ObjUtil.coerce(this.readById(p2.id()), haystack.Dict.type$));
    this.verifyEq(p2.get("curStatus"), "ok");
    this.verifyEq(p2.get("curVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(345, sys.Num.type$.toNullable()), "ft"));
    (px = sys.ObjUtil.coerce(this.readById(px.id()), haystack.Dict.type$));
    this.verifyEq(px.get("curStatus"), "fault");
    this.verifyEq(px.get("curVal"), null);
    this.#pt1 = this.commit(sys.ObjUtil.coerce(this.#pt1, haystack.Dict.type$), sys.Map.__fromLiteral(["curStatus"], ["disabled"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), folio.Diff.transient());
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curStatus"], ["remoteDown"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), folio.Diff.transient());
    concurrent.Actor.sleep(sys.Duration.fromStr("200ms"));
    (p1 = sys.ObjUtil.coerce(this.readById(p1.id()), haystack.Dict.type$));
    this.verifyEq(p1.get("curStatus"), "remoteDisabled");
    this.verifyEq(p1.get("curVal"), null);
    (p2 = sys.ObjUtil.coerce(this.readById(p2.id()), haystack.Dict.type$));
    this.verifyEq(p2.get("curStatus"), "remoteDown");
    this.verifyEq(p2.get("curVal"), null);
    (px = sys.ObjUtil.coerce(this.readById(px.id()), haystack.Dict.type$));
    this.verifyEq(px.get("curStatus"), "fault");
    this.verifyEq(px.get("curVal"), null);
    w.remove(p1.id());
    this.sync();
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().list().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().isWatched(this.#pt1.id()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().isWatched(this.#pt2.id()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    w.close();
    this.sync();
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().list().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().isWatched(this.#pt1.id()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().isWatched(this.#pt2.id()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.#pt1 = this.commit(sys.ObjUtil.coerce(this.#pt1, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal","curStatus"], [sys.ObjUtil.coerce(false, sys.Obj.type$),"ok"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), folio.Diff.transient());
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal","curStatus"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(987, sys.Num.type$.toNullable()), "m"),"ok"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), folio.Diff.transient());
    (w = this.rt().watch().open("test 2"));
    w.addAll(sys.List.make(haystack.Ref.type$, [p1.id(), p2.id()]));
    this.sync();
    (p1 = sys.ObjUtil.coerce(this.readById(p1.id()), haystack.Dict.type$));
    this.verifyEq(p1.get("curStatus"), "ok");
    this.verifyEq(p1.get("curVal"), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    (p2 = sys.ObjUtil.coerce(this.readById(p2.id()), haystack.Dict.type$));
    this.verifyEq(p2.get("curStatus"), "ok");
    this.verifyEq(p2.get("curVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(987, sys.Num.type$.toNullable()), "m"));
    let serverWatch = this.rt().watch().list().find((x) => {
      return x !== w;
    });
    this.verifyEq(sys.ObjUtil.coerce(sys.Str.startsWith(serverWatch.dis(), "Obix Server:"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), serverWatch.dis());
    serverWatch.close();
    concurrent.Actor.sleep(sys.Duration.fromStr("200ms"));
    this.#pt1 = this.commit(sys.ObjUtil.coerce(this.#pt1, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")), folio.Diff.transient());
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(339, sys.Num.type$.toNullable()), "kW")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    concurrent.Actor.sleep(sys.Duration.fromStr("200ms"));
    (p1 = sys.ObjUtil.coerce(this.readById(p1.id()), haystack.Dict.type$));
    this.verifyEq(p1.get("curStatus"), "ok");
    this.verifyEq(p1.get("curVal"), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    (p2 = sys.ObjUtil.coerce(this.readById(p2.id()), haystack.Dict.type$));
    this.verifyEq(p2.get("curStatus"), "ok");
    this.verifyEq(p2.get("curVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(339, sys.Num.type$.toNullable()), "kW"));
    return;
  }

  verifyWritables() {
    const this$ = this;
    let res = this.#client.read(this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#pt3.id()), "/"))));
    this.verify(res.contract().uris().contains(sys.Uri.fromStr("obix:Point")));
    this.verify(!res.contract().uris().contains(sys.Uri.fromStr("obix:WritablePoint")));
    this.#pt3 = this.commit(sys.ObjUtil.coerce(this.#pt3, haystack.Dict.type$), sys.Map.__fromLiteral(["obixWritable"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(13, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")));
    (res = this.#client.read(this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#pt3.id()), "/")))));
    this.verify(res.contract().uris().contains(sys.Uri.fromStr("obix:Point")));
    this.verify(res.contract().uris().contains(sys.Uri.fromStr("obix:WritablePoint")));
    let op = res.get("writePoint");
    this.verifyEq(op.elemName(), "op");
    this.verifyEq(op.in().toStr(), "obix:WritePointIn");
    this.rt().lib("point");
    this.rt().sync();
    this.eval(sys.Str.plus(sys.Str.plus("pointSetDef(", this.#pt3.id().toCode()), ", 0)"));
    this.rt().sync();
    this.#pt3 = this.readById(this.#pt3.id());
    this.verifyEq(this.#pt3.get("writeVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())));
    this.verifyEq(this.#pt3.get("writeLevel"), haystack.HaystackTest.n(sys.ObjUtil.coerce(17, sys.Num.type$.toNullable())));
    let writeUri = this.href(sys.Str.toUri(sys.Str.plus(sys.Str.plus("rec/", this.#pt3.id()), "/writePoint")));
    this.#client.invoke(writeUri, sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("value");
        it.val(sys.ObjUtil.coerce(sys.Float.make(932.0), sys.Obj.type$.toNullable()));
        return;
      }), obix.ObixObj.type$));
      return;
    }), obix.ObixObj.type$));
    this.rt().sync();
    this.#pt3 = this.readById(this.#pt3.id());
    this.verifyEq(this.#pt3.get("writeVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(932, sys.Num.type$.toNullable())));
    this.verifyEq(this.#pt3.get("writeLevel"), haystack.HaystackTest.n(sys.ObjUtil.coerce(13, sys.Num.type$.toNullable())));
    this.#client.invoke(writeUri, sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
      it.add(sys.ObjUtil.coerce(sys.ObjUtil.with(obix.ObixObj.make(), (it) => {
        it.name("value");
        it.val(null);
        return;
      }), obix.ObixObj.type$));
      return;
    }), obix.ObixObj.type$));
    this.rt().sync();
    this.#pt3 = this.readById(this.#pt3.id());
    this.verifyEq(this.#pt3.get("writeVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(0, sys.Num.type$.toNullable())));
    this.verifyEq(this.#pt3.get("writeLevel"), haystack.HaystackTest.n(sys.ObjUtil.coerce(17, sys.Num.type$.toNullable())));
    this.eval(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("obixInvoke(", this.#conn.id().toCode()), ", `"), writeUri), "`, \"<obj><real name='value' val='423'/></obj>\")"));
    this.rt().sync();
    this.#pt3 = this.readById(this.#pt3.id());
    this.verifyEq(this.#pt3.get("writeVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(423, sys.Num.type$.toNullable())));
    this.verifyEq(this.#pt3.get("writeLevel"), haystack.HaystackTest.n(sys.ObjUtil.coerce(13, sys.Num.type$.toNullable())));
    return;
  }

  addClientProxy(dis,kind,uri) {
    return this.addRec(sys.Map.__fromLiteral(["dis","point","kind","obixConnRef","obixCur"], [dis,haystack.Marker.val(),kind,this.#conn.id(),uri], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
  }

  dump(title,obj) {
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("######### ", title), " ##########"));
    obj.writeXml(sys.Env.cur().out());
    return;
  }

  testToObix() {
    let ts = sys.DateTime.now();
    this.verifyToObix(null, "<obj isNull='true'/>");
    this.verifyToObix("foo", "<str val='foo'/>");
    this.verifyToObix(haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())), "<real val='123.0'/>");
    this.verifyToObix(haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable()), "m"), "<real val='123.0' unit='obix:units/meter'/>");
    this.verifyToObix(sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), "<bool val='true'/>");
    this.verifyToObix(sys.Uri.fromStr("foo.txt"), "<uri val='foo.txt'/>");
    this.verifyToObix(sys.Date.fromStr("2012-03-06"), "<date val='2012-03-06'/>");
    this.verifyToObix(sys.Time.make(23, 15), "<time val='23:15:00'/>");
    this.verifyToObix(ts, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<abstime val='", ts.toIso()), "' tz='"), ts.tz().fullName()), "'/>"));
    this.verifyToObix("<int val='3'/>", "<int val='3'/>");
    return;
  }

  verifyToObix(val,expected) {
    let $obix = ObixUtil.toObix(val);
    let s = sys.StrBuf.make();
    $obix.writeXml(s.out());
    let actual = sys.Str.trim(s.toStr());
    this.verifyEq(actual, expected);
    return;
  }

  static item(ts,val) {
    if (sys.ObjUtil.is(val, sys.Num.type$)) {
      (val = haystack.Number.makeNum(sys.ObjUtil.coerce(val, sys.Num.type$)));
    }
    ;
    return haystack.HisItem.make(ts, val);
  }

  static dt(y,m,d,h,min,tz) {
    if (tz === undefined) tz = sys.TimeZone.utc();
    return sys.ObjUtil.coerce(sys.DateTime.make(y, sys.Month.vals().get(sys.Int.minus(m, 1)), d, h, min, 0, 0, tz), sys.DateTime.type$);
  }

  href(relative) {
    return this.#lobbyUri.plus(relative).relToAuth();
  }

  sync() {
    this.rt().sync();
    this.#lib.conn(this.#conn.id()).sync();
    return;
  }

  static make() {
    const $self = new ObixTest();
    ObixTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxObix');
const xp = sys.Param.noParams$();
let m;
ObixFuncs.type$ = p.at$('ObixFuncs','sys::Obj',[],{},8194,ObixFuncs);
ObixWatch.type$ = p.at$('ObixWatch','obix::ObixModWatch',[],{},8192,ObixWatch);
ObixAspect.type$ = p.at$('ObixAspect','sys::Obj',[],{},8195,ObixAspect);
ObixPointAspect.type$ = p.at$('ObixPointAspect','hxObix::ObixAspect',[],{},8194,ObixPointAspect);
ObixWritableAspect.type$ = p.at$('ObixWritableAspect','hxObix::ObixAspect',[],{},8194,ObixWritableAspect);
ObixProxy.type$ = p.at$('ObixProxy','sys::Obj',[],{},8193,ObixProxy);
ObixWritableOp.type$ = p.at$('ObixWritableOp','hxObix::ObixProxy',[],{},8192,ObixWritableOp);
ObixHistoryAspect.type$ = p.at$('ObixHistoryAspect','hxObix::ObixAspect',[],{},8194,ObixHistoryAspect);
ObixHistoryQuery.type$ = p.at$('ObixHistoryQuery','hxObix::ObixProxy',[],{},8192,ObixHistoryQuery);
ObixLib.type$ = p.at$('ObixLib','hxConn::ConnLib',[],{},8194,ObixLib);
ObixLibWeb.type$ = p.at$('ObixLibWeb','hx::HxLibWeb',[],{},130,ObixLibWeb);
ObixDispatch.type$ = p.at$('ObixDispatch','hxConn::ConnDispatch',[],{},8192,ObixDispatch);
ObixLobby.type$ = p.at$('ObixLobby','hxObix::ObixProxy',[],{},8192,ObixLobby);
ObixRecs.type$ = p.at$('ObixRecs','hxObix::ObixProxy',[],{},8192,ObixRecs);
ObixQuery.type$ = p.at$('ObixQuery','hxObix::ObixProxy',[],{},8192,ObixQuery);
ObixFilter.type$ = p.at$('ObixFilter','hxObix::ObixProxy',[],{},8192,ObixFilter);
ObixRec.type$ = p.at$('ObixRec','hxObix::ObixProxy',[],{},8192,ObixRec);
ObixTag.type$ = p.at$('ObixTag','hxObix::ObixRec',[],{},8192,ObixTag);
ObixVal.type$ = p.at$('ObixVal','hxObix::ObixProxy',[],{},8192,ObixVal);
ObixLearn.type$ = p.at$('ObixLearn','sys::Obj',[],{},128,ObixLearn);
ObixLearnObj.type$ = p.at$('ObixLearnObj','sys::Obj',[],{},128,ObixLearnObj);
ObixLearnMore.type$ = p.at$('ObixLearnMore','sys::Obj',[],{},129,ObixLearnMore);
ObixNiagaraObj.type$ = p.at$('ObixNiagaraObj','hxObix::ObixLearnObj',[],{},128,ObixNiagaraObj);
ObixNiagaraMoreHisExt.type$ = p.at$('ObixNiagaraMoreHisExt','hxObix::ObixLearnMore',[],{},128,ObixNiagaraMoreHisExt);
ObixNiagaraMoreHisQuery.type$ = p.at$('ObixNiagaraMoreHisQuery','hxObix::ObixLearnMore',[],{},128,ObixNiagaraMoreHisQuery);
ObixWebMod.type$ = p.at$('ObixWebMod','obix::ObixMod',[],{},8194,ObixWebMod);
ObixUtil.type$ = p.at$('ObixUtil','sys::Obj',[],{},8192,ObixUtil);
ObixTest.type$ = p.at$('ObixTest','hx::HxTest',[],{},8192,ObixTest);
ObixFuncs.type$.am$('obixPing',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('obixSyncCur',40962,'concurrent::Future[]',sys.List.make(sys.Param.type$,[new sys.Param('points','sys::Obj',false)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('obixSyncHis',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('points','sys::Obj',false),new sys.Param('span','sys::Obj?',true)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('obixLearn',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('arg','sys::Obj?',true)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('obixReadObj',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('uri','sys::Uri',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('obixReadHis',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('uri','sys::Uri',false),new sys.Param('span','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('obixWriteObj',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('uri','sys::Obj',false),new sys.Param('arg','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('obixInvoke',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('uri','sys::Obj',false),new sys.Param('arg','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('obixSyncHisGroup',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('group','sys::Str',false),new sys.Param('range','sys::Obj?',true)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('dispatch',32898,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('conn','sys::Obj',false),new sys.Param('msg','hx::HxMsg',false)]),{}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('make',139268,'sys::Void',xp,{});
ObixWatch.type$.af$('mod',73730,'hxObix::ObixWebMod',{}).af$('watch',73730,'hx::HxWatch',{}).af$('recsUri',73730,'sys::Uri',{}).af$('lease',271360,'sys::Duration',{}).af$('recParentProxy$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mod','hxObix::ObixWebMod',false),new sys.Param('watch','hx::HxWatch',false)]),{}).am$('id',271360,'sys::Str',xp,{}).am$('add',271360,'obix::ObixObj[]',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{}).am$('remove',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{}).am$('pollChanges',271360,'obix::ObixObj[]',xp,{}).am$('pollRefresh',271360,'obix::ObixObj[]',xp,{}).am$('doPoll',2048,'obix::ObixObj[]',sys.List.make(sys.Param.type$,[new sys.Param('recs','haystack::Dict[]',false)]),{}).am$('delete',271360,'sys::Void',xp,{}).am$('recToObix',2048,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('recParentProxy',526336,'hxObix::ObixRecs',xp,{}).am$('uriToId',2048,'haystack::Ref?',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('recParentProxy$Once',133120,'hxObix::ObixRecs',xp,{});
ObixAspect.type$.af$('point',106498,'hxObix::ObixAspect',{}).af$('writable',106498,'hxObix::ObixAspect',{}).af$('history',106498,'hxObix::ObixAspect',{}).am$('toContract',40962,'obix::Contract',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('toAspects',40962,'hxObix::ObixAspect[]',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('contract',270337,'sys::Uri',xp,{}).am$('get',270337,'hxObix::ObixProxy?',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixRec',false),new sys.Param('name','sys::Str',false)]),{}).am$('read',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixRec',false),new sys.Param('obj','obix::ObixObj',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ObixPointAspect.type$.am$('contract',271360,'sys::Uri',xp,{}).am$('get',271360,'hxObix::ObixProxy?',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixRec',false),new sys.Param('name','sys::Str',false)]),{}).am$('read',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixRec',false),new sys.Param('obj','obix::ObixObj',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ObixWritableAspect.type$.am$('contract',271360,'sys::Uri',xp,{}).am$('get',271360,'hxObix::ObixProxy?',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixRec',false),new sys.Param('name','sys::Str',false)]),{}).am$('read',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixRec',false),new sys.Param('obj','obix::ObixObj',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ObixProxy.type$.af$('lobbyRef',67584,'hxObix::ObixLobby',{}).af$('parentRef',67584,'hxObix::ObixProxy?',{}).af$('uri',73730,'sys::Uri',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixProxy',false),new sys.Param('name','sys::Str',false)]),{}).am$('makeLobby',8196,'sys::Void',xp,{}).am$('lobby',8192,'hxObix::ObixLobby',xp,{}).am$('parent',8192,'hxObix::ObixProxy?',xp,{}).am$('rt',8192,'hx::HxRuntime',xp,{}).am$('get',270336,'hxObix::ObixProxy?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('read',270337,'obix::ObixObj',xp,{}).am$('write',270336,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('arg','obix::ObixObj',false)]),{}).am$('invoke',270336,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('arg','obix::ObixObj',false)]),{}).am$('absBaseUri',8192,'sys::Uri',xp,{}).am$('idToUri',8192,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('queryToUri',8192,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('query','sys::Str',false)]),{});
ObixWritableOp.type$.af$('rec',73730,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixRec',false)]),{}).am$('read',271360,'obix::ObixObj',xp,{}).am$('invoke',271360,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('arg','obix::ObixObj',false)]),{});
ObixHistoryAspect.type$.am$('contract',271360,'sys::Uri',xp,{}).am$('get',271360,'hxObix::ObixProxy?',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixRec',false),new sys.Param('name','sys::Str',false)]),{}).am$('read',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixRec',false),new sys.Param('obj','obix::ObixObj',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ObixHistoryQuery.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixRec',false)]),{}).am$('read',271360,'obix::ObixObj',xp,{}).am$('invoke',271360,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('arg','obix::ObixObj',false)]),{});
ObixLib.type$.af$('web',336898,'hx::HxLibWeb',{}).am$('make',139268,'sys::Void',xp,{});
ObixLibWeb.type$.af$('mod',73730,'hxObix::ObixWebMod',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxObix::ObixLib',false)]),{}).am$('onService',271360,'sys::Void',xp,{});
ObixDispatch.type$.af$('client',73728,'obix::ObixClient?',{}).af$('clientWatch',73728,'obix::ObixClientWatch?',{}).af$('watchUris',73728,'[sys::Uri:hxConn::ConnPoint]',{}).af$('isNiagara',73728,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('onReceive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('onOpen',271360,'sys::Void',xp,{}).am$('onClose',271360,'sys::Void',xp,{}).am$('onPing',271360,'haystack::Dict',xp,{}).am$('onReadObj',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('onWriteObj',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('onInvoke',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('onLearn',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('onSyncCur',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onWatch',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onUnwatch',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onPollManual',271360,'sys::Void',xp,{}).am$('onWatchErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err',false)]),{}).am$('syncWatched',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('objs','obix::ObixObj[]',false)]),{}).am$('syncPoint',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('obj','obix::ObixObj',false)]),{}).am$('toCurErrStatus',2048,'hxConn::ConnStatus?',sys.List.make(sys.Param.type$,[new sys.Param('obixStatus','obix::Status',false)]),{}).am$('onWrite',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('info','hxConn::ConnWriteInfo',false)]),{}).am$('onSyncHis',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('span','haystack::Span',false)]),{}).am$('onReadHis',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('span','haystack::Span',false)]),{}).am$('readHisUri',2048,'haystack::HisItem[]',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('start','sys::DateTime?',false),new sys.Param('end','sys::DateTime?',false),new sys.Param('tz','sys::TimeZone?',true)]),{}).am$('readHis',2048,'haystack::HisItem[]',sys.List.make(sys.Param.type$,[new sys.Param('hisObj','obix::ObixObj',false),new sys.Param('start','sys::DateTime?',false),new sys.Param('end','sys::DateTime?',false),new sys.Param('tz','sys::TimeZone?',true)]),{});
ObixLobby.type$.af$('mod',73730,'hxObix::ObixWebMod',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mod','hxObix::ObixWebMod',false)]),{}).am$('get',271360,'hxObix::ObixProxy?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('read',271360,'obix::ObixObj',xp,{});
ObixRecs.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixProxy',false)]),{}).am$('get',271360,'hxObix::ObixProxy?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('read',271360,'obix::ObixObj',xp,{});
ObixQuery.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixProxy',false)]),{}).am$('get',271360,'hxObix::ObixProxy?',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false)]),{}).am$('read',271360,'obix::ObixObj',xp,{});
ObixFilter.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixProxy',false),new sys.Param('filter','sys::Str',false)]),{}).am$('read',271360,'obix::ObixObj',xp,{});
ObixRec.type$.af$('rec',73730,'haystack::Dict',{}).af$('isRoot',73728,'sys::Bool',{}).af$('aspects',73728,'hxObix::ObixAspect[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixProxy',false),new sys.Param('name','sys::Str',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('get',271360,'hxObix::ObixProxy?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('read',271360,'obix::ObixObj',xp,{}).am$('tagToObj',8192,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj',false)]),{});
ObixTag.type$.af$('tagName',73730,'sys::Str',{}).af$('tagVal',73730,'sys::Obj',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixRec',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('tagName','sys::Str',false),new sys.Param('tagVal','sys::Obj',false)]),{}).am$('read',271360,'obix::ObixObj',xp,{});
ObixVal.type$.af$('val',73728,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixProxy',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('read',271360,'obix::ObixObj',xp,{});
ObixLearn.type$.af$('conn',73728,'hxObix::ObixDispatch',{}).af$('client',73728,'obix::ObixClient',{}).af$('learnUri',73728,'sys::Uri',{}).af$('baseObj',73728,'obix::ObixObj?',{}).af$('baseUri',73728,'sys::Uri?',{}).af$('objs',73728,'hxObix::ObixLearnObj[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxObix::ObixDispatch',false),new sys.Param('learnUri','sys::Uri?',false)]),{}).am$('learn',8192,'haystack::Grid?',xp,{}).am$('readBaseObj',2048,'sys::Void',xp,{}).am$('addExtent',2048,'sys::Void',xp,{}).am$('addObj',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false)]),{}).am$('makeObj',2048,'hxObix::ObixLearnObj',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false)]),{}).am$('learnRefs',2048,'sys::Void',xp,{}).am$('learnMore',2048,'sys::Void',xp,{}).am$('fixIcons',2048,'sys::Void',xp,{}).am$('toGrid',2048,'haystack::Grid',xp,{});
ObixLearnObj.type$.af$('parent',73728,'hxObix::ObixLearn',{}).af$('obj',73728,'obix::ObixObj',{}).af$('isPoint',73728,'sys::Bool',{}).af$('isWritable',73728,'sys::Bool',{}).af$('isHistory',73728,'sys::Bool',{}).af$('uri',73728,'sys::Uri',{}).af$('dis',73728,'sys::Str',{}).af$('learn',73728,'sys::Uri?',{}).af$('icon',73728,'sys::Uri?',{}).af$('isStr',73728,'sys::Str?',{}).af$('kind',73728,'sys::Str?',{}).af$('unit',73728,'sys::Str?',{}).af$('enum',73728,'sys::Str?',{}).af$('hisInterpolate',73728,'sys::Str?',{}).af$('obixCur',73728,'sys::Uri?',{}).af$('obixWrite',73728,'sys::Uri?',{}).af$('obixHis',73728,'sys::Uri?',{}).af$('more',73728,'hxObix::ObixLearnMore?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixLearn',false),new sys.Param('obj','obix::ObixObj',false)]),{}).am$('toUri',2048,'sys::Uri',xp,{}).am$('toDis',270336,'sys::Str',xp,{}).am$('unescapeName',270336,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('toKind',270336,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('val','obix::ObixObj',false)]),{}).am$('toWriteUri',270336,'sys::Uri?',xp,{}).am$('onMore',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('res','obix::ObixObj',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
ObixLearnMore.type$.af$('parent',73728,'hxObix::ObixLearnObj',{}).af$('req',73728,'obix::Contract',{}).af$('uri',73728,'sys::Uri',{}).af$('arg',73728,'obix::ObixObj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixLearnObj',false),new sys.Param('uri','sys::Uri',false),new sys.Param('arg','obix::ObixObj?',false)]),{}).am$('client',8192,'obix::ObixClient',xp,{}).am$('onResult',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false)]),{});
ObixNiagaraObj.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','hxObix::ObixLearn',false),new sys.Param('obj','obix::ObixObj',false)]),{}).am$('parseFacets',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('unescapeName',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{});
ObixNiagaraMoreHisExt.type$.am$('check',40962,'hxObix::ObixLearnMore?',sys.List.make(sys.Param.type$,[new sys.Param('p','hxObix::ObixNiagaraObj',false)]),{}).am$('onResult',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('res','obix::ObixObj',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','hxObix::ObixNiagaraObj',false),new sys.Param('u','sys::Uri',false)]),{});
ObixNiagaraMoreHisQuery.type$.af$('historyFilterContract',106498,'obix::Contract',{}).am$('check',40962,'hxObix::ObixLearnMore?',sys.List.make(sys.Param.type$,[new sys.Param('p','hxObix::ObixNiagaraObj',false)]),{}).am$('onResult',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('res','obix::ObixObj',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','hxObix::ObixNiagaraObj',false),new sys.Param('u','sys::Uri',false),new sys.Param('a','obix::ObixObj',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ObixWebMod.type$.af$('rt',73730,'hx::HxRuntime',{}).af$('lib',73730,'hxObix::ObixLib',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxObix::ObixLib',false)]),{}).am$('onService',271360,'sys::Void',xp,{}).am$('onRead',271360,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('onWrite',271360,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('arg','obix::ObixObj',false)]),{}).am$('onInvoke',271360,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('arg','obix::ObixObj',false)]),{}).am$('lobby',271360,'obix::ObixObj',xp,{}).am$('defaultLobby',128,'obix::ObixObj',xp,{}).am$('resolve',2048,'hxObix::ObixProxy',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('watchOpen',271360,'obix::ObixModWatch',xp,{}).am$('watch',271360,'obix::ObixModWatch?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('icon',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('proj','hx::HxRuntime',false)]),{}).am$('blankIcon',2048,'sys::Void',xp,{});
ObixUtil.type$.am$('toGrid',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxObix::ObixDispatch',false),new sys.Param('obj','obix::ObixObj',false)]),{}).am$('toTags',40962,'[sys::Str:sys::Obj]',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false)]),{}).am$('toHisItems',40962,'haystack::HisItem[]',sys.List.make(sys.Param.type$,[new sys.Param('res','obix::ObixObj',false),new sys.Param('tz','sys::TimeZone?',false)]),{}).am$('toObix',40962,'obix::ObixObj',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toChildVal',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false),new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{}).am$('toVal',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false)]),{}).am$('contractToDis',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('contract','obix::Contract',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ObixTest.type$.af$('lib',73728,'hxObix::ObixLib?',{}).af$('client',73728,'obix::ObixClient?',{}).af$('lobbyUri',73728,'sys::Uri?',{}).af$('recA',73728,'haystack::Dict?',{}).af$('recB',73728,'haystack::Dict?',{}).af$('pt1',73728,'haystack::Dict?',{}).af$('pt2',73728,'haystack::Dict?',{}).af$('pt3',73728,'haystack::Dict?',{}).af$('hisF',73728,'haystack::Dict?',{}).af$('hisB',73728,'haystack::Dict?',{}).af$('conn',73728,'haystack::Dict?',{}).af$('hisSyncF',73728,'haystack::Dict?',{}).am$('test',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('buildProj',8192,'sys::Void',xp,{}).am$('verifyLobby',8192,'sys::Void',xp,{}).am$('verifyReads',8192,'sys::Void',xp,{}).am$('verifyBatch',8192,'sys::Void',xp,{}).am$('verifyPoints',8192,'sys::Void',xp,{}).am$('verifyHis',8192,'sys::Void',xp,{}).am$('verifyHisQueries',8192,'sys::Void',xp,{}).am$('verifyHisQuery',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('s','sys::DateTime?',false),new sys.Param('e','sys::DateTime?',false),new sys.Param('limit','sys::Int?',true)]),{}).am$('verifyConn',8192,'sys::Void',xp,{}).am$('verifyReadHis',8192,'sys::Void',xp,{}).am$('verifyHisSync',8192,'sys::Void',xp,{}).am$('verifyServerWatches',8192,'sys::Void',xp,{}).am$('verifyWatch',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false)]),{}).am$('verifyWatchIds',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false),new sys.Param('recs','haystack::Dict[]',false)]),{}).am$('verifyWatchUnresolvedErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','obix::ObixObj',false),new sys.Param('uri','sys::Uri',false)]),{}).am$('verifyClientWatches',8192,'sys::Void',xp,{}).am$('verifyWritables',8192,'sys::Void',xp,{}).am$('addClientProxy',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('dis','sys::Str',false),new sys.Param('kind','sys::Str',false),new sys.Param('uri','sys::Uri',false)]),{}).am$('dump',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('title','sys::Str',false),new sys.Param('obj','obix::ObixObj',false)]),{}).am$('testToObix',8192,'sys::Void',xp,{}).am$('verifyToObix',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('expected','sys::Str',false)]),{}).am$('item',40962,'haystack::HisItem',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('dt',40962,'sys::DateTime',sys.List.make(sys.Param.type$,[new sys.Param('y','sys::Int',false),new sys.Param('m','sys::Int',false),new sys.Param('d','sys::Int',false),new sys.Param('h','sys::Int',false),new sys.Param('min','sys::Int',false),new sys.Param('tz','sys::TimeZone',true)]),{}).am$('href',8192,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('relative','sys::Uri',false)]),{}).am$('sync',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxObix");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;inet 1.0;web 1.0;xml 1.0;auth 3.1.11;obix 3.1.11;haystack 3.1.11;axon 3.1.11;folio 3.1.11;hx 3.1.11;hxConn 3.1.11");
m.set("pod.summary", "oBIX Connector");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:28-05:00 New_York");
m.set("build.tsKey", "241210143128");
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
  ObixFuncs,
  ObixWatch,
  ObixAspect,
  ObixPointAspect,
  ObixWritableAspect,
  ObixProxy,
  ObixWritableOp,
  ObixHistoryAspect,
  ObixHistoryQuery,
  ObixLib,
  ObixDispatch,
  ObixLobby,
  ObixRecs,
  ObixQuery,
  ObixFilter,
  ObixRec,
  ObixTag,
  ObixVal,
  ObixWebMod,
  ObixUtil,
  ObixTest,
};
