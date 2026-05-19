// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as sedona from './sedona.js'
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
import * as hxConn from './hxConn.js'
import * as xml from './xml.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class SedonaDispatch extends hxConn.ConnDispatch {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SedonaDispatch.type$; }

  #scheme = null;

  scheme(it) {
    if (it === undefined) {
      return this.#scheme;
    }
    else {
      this.#scheme = it;
      return;
    }
  }

  #dasm = null;

  dasm(it) {
    if (it === undefined) {
      return this.#dasm;
    }
    else {
      this.#dasm = it;
      return;
    }
  }

  #sox = null;

  sox(it) {
    if (it === undefined) {
      return this.#sox;
    }
    else {
      this.#sox = it;
      return;
    }
  }

  static make(arg) {
    const $self = new SedonaDispatch();
    SedonaDispatch.make$($self,arg);
    return $self;
  }

  static make$($self,arg) {
    hxConn.ConnDispatch.make$($self, arg);
    return;
  }

  onReceive(msg) {
    let msgId = msg.id();
    if (msgId === "updateCur") {
      return this.onUpdateCur(sys.ObjUtil.coerce(msg.a(), haystack.Ref.type$));
    }
    ;
    if (msgId === "readComp") {
      return this.onReadComp(sys.ObjUtil.coerce(msg.a(), haystack.Number.type$));
    }
    ;
    if (msgId === "soxClosed") {
      return this.onSoxClosed(sys.ObjUtil.coerce(msg.a(), sys.Str.type$.toNullable()));
    }
    ;
    if (msgId === "writeCompProperty") {
      this.onWriteProperty(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), msg.b());
      return null;
    }
    ;
    return hxConn.ConnDispatch.prototype.onReceive.call(this, msg);
  }

  onOpen() {
    const this$ = this;
    try {
      let uriVal = ((this$) => { let $_u0 = this$.rec().get("uri"); if ($_u0 != null) return $_u0; throw haystack.FaultErr.make("Missing 'uri' tag"); })(this);
      let uri = ((this$) => { let $_u1 = sys.ObjUtil.as(uriVal, sys.Uri.type$); if ($_u1 != null) return $_u1; throw haystack.FaultErr.make(sys.Str.plus("Type of 'uri' must be Uri, not ", sys.ObjUtil.typeof(uriVal).name())); })(this);
      let uriScheme = ((this$) => { let $_u2 = uri.scheme(); if ($_u2 != null) return $_u2; return ""; })(this);
      let host = ((this$) => { let $_u3 = uri.host(); if ($_u3 != null) return $_u3; return ""; })(this);
      let port = ((this$) => { let $_u4 = uri.port(); if ($_u4 != null) return $_u4; return sys.ObjUtil.coerce(1876, sys.Int.type$.toNullable()); })(this);
      let user = ((this$) => { let $_u5 = this$.rec().get("username"); if ($_u5 != null) return $_u5; return ""; })(this);
      let pass = ((this$) => { let $_u6 = this$.rt().db().passwords().get(this$.id().toStr()); if ($_u6 != null) return $_u6; return ""; })(this);
      this.#scheme = SedonaScheme.schemes().find((s) => {
        return sys.ObjUtil.equals(uriScheme, s.uriScheme());
      });
      if (this.#scheme == null) {
        throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus("Unsupported scheme: '", uriScheme), "'"));
      }
      ;
      this.#dasm = this.#scheme.createDaspSocket(this.rec());
      this.#sox = java.failsedona.sox.SoxClient.javaInit(this.#dasm, this.#scheme.inetAddress(sys.ObjUtil.coerce(uri, sys.Uri.type$)), sys.ObjUtil.coerce(sys.Num.toInt(sys.ObjUtil.coerce(port, sys.Num.type$)), java.fail.int.type$), sys.ObjUtil.coerce(user, sys.Str.type$.toNullable()), pass);
      this.#sox.addListener(SoxConnListener.make(this.conn()));
      this.#sox.connect(this.#scheme.options(this.conn()));
    }
    catch ($_u7) {
      $_u7 = sys.Err.make($_u7);
      if ($_u7 instanceof sys.Err) {
        let e = $_u7;
        ;
        this.onClose();
        throw this.toConnErr(e);
      }
      else {
        throw $_u7;
      }
    }
    ;
    return;
  }

  toConnErr(e) {
    let daspErr = sys.ObjUtil.as(java.failfanx.interop.Interop.toJava(e), java.failsedona.dasp.DaspException.type$);
    if (daspErr != null) {
      if (sys.Str.startsWith(daspErr.getMessage(), "No response")) {
        return haystack.DownErr.make("No response", e);
      }
      ;
      let $_u8 = sys.ObjUtil.coerce(daspErr.errorCode(), sys.Int.type$);
      if (sys.ObjUtil.equals($_u8, sys.ObjUtil.coerce(java.failsedona.dasp.DaspConst.INCOMPATIBLE_VERSION(), sys.Int.type$))) {
        return haystack.FaultErr.make("Incompatible Dasp version", e);
      }
      else if (sys.ObjUtil.equals($_u8, sys.ObjUtil.coerce(java.failsedona.dasp.DaspConst.BUSY(), sys.Int.type$))) {
        return haystack.DownErr.make("Busy", e);
      }
      else if (sys.ObjUtil.equals($_u8, sys.ObjUtil.coerce(java.failsedona.dasp.DaspConst.DIGEST_NOT_SUPPORTED(), sys.Int.type$))) {
        return haystack.FaultErr.make("Digest not supported", e);
      }
      else if (sys.ObjUtil.equals($_u8, sys.ObjUtil.coerce(java.failsedona.dasp.DaspConst.NOT_AUTHENTICATED(), sys.Int.type$))) {
        return haystack.FaultErr.make("Not authenticated", e);
      }
      else if (sys.ObjUtil.equals($_u8, sys.ObjUtil.coerce(java.failsedona.dasp.DaspConst.TIMEOUT(), sys.Int.type$))) {
        return haystack.DownErr.make("Timeout", e);
      }
      ;
    }
    ;
    return e;
  }

  onClose() {
    const this$ = this;
    ((this$) => { let $_u9 = this$.#sox; if ($_u9 == null) return null; return this$.#sox.close(); })(this);
    if (this.#dasm != null) {
      this.#scheme.closeDaspSocket(sys.ObjUtil.coerce(this.#dasm, java.failsedona.dasp.DaspSocket.type$));
    }
    ;
    this.#sox = null;
    this.#dasm = null;
    this.#scheme = null;
    this.points().each((point) => {
      this$.setPointData(point, null);
      return;
    });
    return;
  }

  onPing() {
    let versionInfo = this.#sox.readVersion();
    let plat = versionInfo.platformId();
    let kits = sys.ObjUtil.coerce(sys.List.make(java.failsedona.sox.KitVersion.type$.toNullable(), versionInfo.kits()), sys.Type.find("[java]sedona.sox::KitVersion[]"));
    let version = sys.ObjUtil.toStr(kits.first().version());
    return haystack.Etc.makeDict(sys.Map.__fromLiteral(["sedonaVersion","sedonaPlatform"], [version,plat], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")));
  }

  onSoxClosed(cause) {
    this.close(haystack.DownErr.make(sys.ObjUtil.coerce(((this$) => { let $_u10 = cause; if ($_u10 != null) return $_u10; return "lost connection"; })(this), sys.Str.type$)));
    return null;
  }

  onReadComp(id) {
    this.open();
    let comp = this.#sox.load(sys.ObjUtil.coerce(id.toInt(), java.fail.int.type$));
    let mask = sys.Int.or(sys.Int.or(sys.ObjUtil.coerce(java.failsedona.sox.SoxComponent.TREE(), sys.Int.type$), sys.ObjUtil.coerce(java.failsedona.sox.SoxComponent.CONFIG(), sys.Int.type$)), sys.ObjUtil.coerce(java.failsedona.sox.SoxComponent.RUNTIME(), sys.Int.type$));
    this.#sox.update(comp, sys.ObjUtil.coerce(mask, java.fail.int.type$));
    return SedonaUtil.compToDict(sys.ObjUtil.coerce(comp, java.failsedona.sox.SoxComponent.type$));
  }

  onLearn(arg) {
    const this$ = this;
    let compId = sys.ObjUtil.as(arg, haystack.Number.type$);
    if (compId == null) {
      (compId = haystack.Number.zero());
    }
    ;
    let comp = sys.ObjUtil.coerce(this.#sox.load(sys.ObjUtil.coerce(compId.toInt(), java.fail.int.type$)), java.failsedona.sox.SoxComponent.type$);
    let kids = sys.ObjUtil.coerce(sys.List.make(java.failsedona.sox.SoxComponent.type$.toNullable(), comp.children()), sys.Type.find("[java]sedona.sox::SoxComponent[]"));
    let meta = sys.Map.__fromLiteral(["sedonaConnRef","compId","type"], [this.id(),compId,comp.type().qname()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    let cols = sys.List.make(sys.Str.type$, ["dis", "learn", "type", "kind", "sedonaCur", "sedonaWrite", "point"]);
    let rows = sys.List.make(sys.Obj.type$.toNullable());
    rows.add(this.learnCompRow(comp, true));
    let slots = sys.ObjUtil.coerce(sys.List.make(java.failsedona.Slot.type$.toNullable(), comp.type().slots()), sys.Type.find("[java]sedona::Slot[]"));
    slots.each(() => {
      // Cannot write closure. Signature uses non-JS types: |[java]sedona::Slot->sys::Void|
      throw sys.UnsupportedErr.make('Closure uses non-JS types: ' + "|[java]sedona::Slot->sys::Void|");
    });
    kids.each(() => {
      // Cannot write closure. Signature uses non-JS types: |[java]sedona.sox::SoxComponent->sys::Void|
      throw sys.UnsupportedErr.make('Closure uses non-JS types: ' + "|[java]sedona.sox::SoxComponent->sys::Void|");
    });
    return haystack.Etc.makeListsGrid(meta, cols, null, sys.ObjUtil.coerce(rows, sys.Type.find("sys::Obj?[][]")));
  }

  learnSlotRow(comp,slot) {
    if (sys.ObjUtil.equals(slot.name(), "meta")) {
      return null;
    }
    ;
    if (slot.isAction()) {
      return null;
    }
    ;
    let kind = SedonaUtil.sedonaTypeToKind(sys.ObjUtil.coerce(slot.type(), java.failsedona.Type.type$));
    let ro = slot.facets().getb("readonly", false);
    let addr = null;
    if (kind != null) {
      (addr = sys.Str.plus(sys.Str.plus(sys.Int.toStr(sys.ObjUtil.coerce(comp.id(), sys.Int.type$)), "."), slot.name()));
    }
    ;
    let pointMarker = ((this$) => { if (addr != null) return haystack.Marker.val(); return null; })(this);
    return sys.List.make(sys.Obj.type$.toNullable(), [slot.name(), null, slot.type().name(), kind, addr, ((this$) => { if (ro) return null; return addr; })(this), pointMarker]);
  }

  learnCompRow(comp,self$) {
    let learn = ((this$) => { if (self$) return null; return haystack.Number.makeInt(sys.ObjUtil.coerce(comp.id(), sys.Int.type$)); })(this);
    let kind = null;
    let curAddr = null;
    let writeAddr = null;
    let out = comp.type().slot("out", false);
    if (out != null) {
      (kind = SedonaUtil.sedonaTypeToKind(sys.ObjUtil.coerce(out.type(), java.failsedona.Type.type$)));
      if (kind != null) {
        (curAddr = sys.Str.plus(sys.Int.toStr(sys.ObjUtil.coerce(comp.id(), sys.Int.type$)), ".out"));
      }
      ;
    }
    ;
    let in$ = comp.type().slot("in", false);
    if ((in$ != null && curAddr != null)) {
      let inKind = SedonaUtil.sedonaTypeToKind(sys.ObjUtil.coerce(in$.type(), java.failsedona.Type.type$));
      let ro = in$.facets().getb("readonly", false);
      if ((sys.ObjUtil.equals(inKind, kind) && !ro)) {
        (writeAddr = sys.Str.plus(sys.Int.toStr(sys.ObjUtil.coerce(comp.id(), sys.Int.type$)), ".in"));
      }
      ;
    }
    ;
    let pointMarker = ((this$) => { if (curAddr != null) return haystack.Marker.val(); return null; })(this);
    return sys.List.make(sys.Obj.type$.toNullable(), [comp.name(), learn, comp.type().qname(), kind, curAddr, writeAddr, pointMarker]);
  }

  onWatch(points) {
    const this$ = this;
    points.each((pt) => {
      try {
        this$.syncCurPoint(pt, "sub");
      }
      catch ($_u15) {
        $_u15 = sys.Err.make($_u15);
        if ($_u15 instanceof sys.Err) {
          let e = $_u15;
          ;
          pt.updateCurErr(e);
        }
        else {
          throw $_u15;
        }
      }
      ;
      return;
    });
    return;
  }

  onUnwatch(points) {
    const this$ = this;
    let comps = sys.List.make(java.failsedona.sox.SoxComponent.type$);
    points.each((pt) => {
      let comp = this$.pointToComp(pt);
      if (comp != null) {
        comps.add(sys.ObjUtil.coerce(comp, java.failsedona.sox.SoxComponent.type$));
      }
      ;
      return;
    });
    ((this$) => { let $_u16 = this$.#sox; if ($_u16 == null) return null; return this$.#sox.unsubscribe(sys.ObjUtil.coerce(comps.asArray(java.failsedona.sox.SoxComponent.<class>()), java.failsedona.sox.[SoxComponent.type$.toNullable()), sys.ObjUtil.coerce(sys.Int.or(sys.ObjUtil.coerce(java.failsedona.sox.SoxComponent.CONFIG(), sys.Int.type$), sys.ObjUtil.coerce(java.failsedona.sox.SoxComponent.RUNTIME(), sys.Int.type$)), java.fail.int.type$)); })(this);
    return;
  }

  onSyncCur(points) {
    const this$ = this;
    this.open();
    points.each((point) => {
      try {
        this$.syncCurPoint(point, "read");
      }
      catch ($_u17) {
        $_u17 = sys.Err.make($_u17);
        if ($_u17 instanceof sys.Err) {
          let e = $_u17;
          ;
          point.updateCurErr(e);
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

  onUpdateCur(id) {
    let point = this.point(id, false);
    if (point != null) {
      try {
        this.syncCurPoint(sys.ObjUtil.coerce(point, hxConn.ConnPoint.type$), "update");
      }
      catch ($_u18) {
        $_u18 = sys.Err.make($_u18);
        if ($_u18 instanceof sys.Err) {
          let e = $_u18;
          ;
          point.updateCurErr(e);
        }
        else {
          throw $_u18;
        }
      }
      ;
    }
    ;
    return null;
  }

  syncCurPoint(point,mode) {
    if (this.#sox == null) {
      throw haystack.DownErr.make("No sox client");
    }
    ;
    let addr = ((this$) => { let $_u19 = point.rec().get("sedonaCur"); if ($_u19 != null) return $_u19; throw haystack.FaultErr.make("Missing 'sedonaCur' tag"); })(this);
    let comp = this.load(point, sys.ObjUtil.coerce(addr, sys.Str.type$));
    let slot = this.toCompSlot(comp, sys.ObjUtil.coerce(addr, sys.Str.type$));
    let unit = point.unit();
    let sval = null;
    if (mode === "update") {
      (sval = comp.get(slot));
    }
    else {
      if (mode === "sub") {
        let mask = ((this$) => { if (slot.isConfig()) return sys.ObjUtil.coerce(java.failsedona.sox.SoxComponent.CONFIG(), sys.Int.type$); return sys.ObjUtil.coerce(java.failsedona.sox.SoxComponent.RUNTIME(), sys.Int.type$); })(this);
        this.#sox.subscribe(comp, sys.ObjUtil.coerce(mask, java.fail.int.type$));
        (sval = comp.get(slot));
      }
      else {
        if (mode === "read") {
          (sval = this.#sox.readProp(comp, slot));
        }
        else {
          throw sys.Err.make("invalid state!");
        }
        ;
      }
      ;
    }
    ;
    let fval = SedonaUtil.valueToFan(sys.ObjUtil.coerce(sval, java.failsedona.Value.type$.toNullable()), point.unit());
    point.updateCurOk(fval);
    return;
  }

  onWrite(point,info) {
    try {
      let addr = ((this$) => { let $_u21 = point.rec().get("sedonaWrite"); if ($_u21 != null) return $_u21; throw haystack.FaultErr.make("Missing 'sedonaWrite' tag"); })(this);
      let comp = this.load(point, sys.ObjUtil.coerce(addr, sys.Str.type$));
      let slot = this.toCompSlot(comp, sys.ObjUtil.coerce(addr, sys.Str.type$));
      let sval = SedonaUtil.fanToValue(sys.ObjUtil.coerce(slot.type(), java.failsedona.Type.type$), info.val());
      this.#sox.write(comp, slot, sval);
      point.updateWriteOk(info);
    }
    catch ($_u22) {
      $_u22 = sys.Err.make($_u22);
      if ($_u22 instanceof sys.Err) {
        let e = $_u22;
        ;
        point.updateWriteErr(info, e);
      }
      else {
        throw $_u22;
      }
    }
    ;
    return;
  }

  onWriteProperty(addr,val) {
    this.open();
    let comp = this.#sox.load(sys.ObjUtil.coerce(this.toCompId(addr), java.fail.int.type$));
    let slot = this.toCompSlot(sys.ObjUtil.coerce(comp, java.failsedona.sox.SoxComponent.type$), addr);
    let sval = SedonaUtil.fanToValue(sys.ObjUtil.coerce(slot.type(), java.failsedona.Type.type$), val);
    this.#sox.write(comp, slot, sval);
    return;
  }

  load(point,addr) {
    try {
      let comp = this.pointToComp(point);
      if ((comp != null && comp.client() === this.#sox)) {
        return sys.ObjUtil.coerce(comp, java.failsedona.sox.SoxComponent.type$);
      }
      ;
      (comp = this.#sox.load(sys.ObjUtil.coerce(this.toCompId(addr), java.fail.int.type$)));
      let slot = this.toCompSlot(sys.ObjUtil.coerce(comp, java.failsedona.sox.SoxComponent.type$), addr);
      comp.listener(SoxCompListener.make(this.conn(), point.id(), sys.ObjUtil.coerce(slot.name(), sys.Str.type$)));
      this.setPointData(point, sys.Unsafe.make(comp));
      return sys.ObjUtil.coerce(comp, java.failsedona.sox.SoxComponent.type$);
    }
    catch ($_u23) {
      $_u23 = sys.Err.make($_u23);
      if ($_u23 instanceof sys.Err) {
        let e = $_u23;
        ;
        let msg = e.msg();
        let x = sys.Str.index(msg, "Request failed:");
        if (x != null) {
          throw haystack.FaultErr.make(sys.Str.getRange(msg, sys.Range.make(sys.ObjUtil.coerce(x, sys.Int.type$), -1)), e);
        }
        ;
        throw e;
      }
      else {
        throw $_u23;
      }
    }
    ;
  }

  toCompId(addr) {
    try {
      return sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.getRange(addr, sys.Range.make(0, sys.ObjUtil.coerce(sys.Str.index(addr, "."), sys.Int.type$), true))), sys.Int.type$);
    }
    catch ($_u24) {
      $_u24 = sys.Err.make($_u24);
      if ($_u24 instanceof sys.Err) {
        let e = $_u24;
        ;
        throw haystack.FaultErr.make(sys.Str.plus("addr must be compId.slot: ", addr));
      }
      else {
        throw $_u24;
      }
    }
    ;
  }

  toCompSlot(comp,addr) {
    let slotName = sys.Str.getRange(addr, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(addr, "."), sys.Int.type$), 1), -1));
    return sys.ObjUtil.coerce(((this$) => { let $_u25 = comp.type().slot(slotName, false); if ($_u25 != null) return $_u25; throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unknown slot '", comp.type().qname()), "."), slotName), "'")); })(this), java.failsedona.Slot.type$);
  }

  pointToComp(pt) {
    return sys.ObjUtil.coerce(((this$) => { let $_u26 = sys.ObjUtil.as(pt.data(), sys.Unsafe.type$); if ($_u26 == null) return null; return sys.ObjUtil.as(pt.data(), sys.Unsafe.type$).val(); })(this), java.failsedona.sox.SoxComponent.type$.toNullable());
  }

}

class SoxConnListener extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SoxConnListener.type$; }

  #conn = null;

  conn() { return this.#conn; }

  __conn(it) { if (it === undefined) return this.#conn; else this.#conn = it; }

  static make(c) {
    const $self = new SoxConnListener();
    SoxConnListener.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    $self.#conn = c;
    return;
  }

  soxClientClosed(client) {
    this.#conn.send(hx.HxMsg.make1("soxClosed", client.closeCause()));
    return;
  }

}

class SoxCompListener extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SoxCompListener.type$; }

  #conn = null;

  conn() { return this.#conn; }

  __conn(it) { if (it === undefined) return this.#conn; else this.#conn = it; }

  #pointId = null;

  pointId() { return this.#pointId; }

  __pointId(it) { if (it === undefined) return this.#pointId; else this.#pointId = it; }

  #slot = null;

  slot() { return this.#slot; }

  __slot(it) { if (it === undefined) return this.#slot; else this.#slot = it; }

  static make(conn,id,slot) {
    const $self = new SoxCompListener();
    SoxCompListener.make$($self,conn,id,slot);
    return $self;
  }

  static make$($self,conn,id,slot) {
    $self.#conn = conn;
    $self.#pointId = id;
    $self.#slot = slot;
    return;
  }

  changed(c,mask_$J) {
    let mask = sys.ObjUtil.coerce(mask_$J, sys.Int.type$);
    this.#conn.send(hx.HxMsg.make1("updateCur", this.#pointId));
    return;
  }

}

class SedonaFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SedonaFuncs.type$; }

  static #sedonaHome = undefined;

  static sedonaHome() {
    if (SedonaFuncs.#sedonaHome === undefined) {
      SedonaFuncs.static$init();
      if (SedonaFuncs.#sedonaHome === undefined) SedonaFuncs.#sedonaHome = null;
    }
    return SedonaFuncs.#sedonaHome;
  }

  static sedonaPing(conn) {
    return hxConn.ConnFwFuncs.connPing(conn);
  }

  static sedonaSyncCur(points) {
    return hxConn.ConnFwFuncs.connSyncCur(points);
  }

  static sedonaLearn(conn,arg) {
    if (arg === undefined) arg = null;
    return sys.ObjUtil.coerce(hxConn.ConnFwFuncs.connLearn(conn, arg).get(sys.Duration.fromStr("1min")), haystack.Grid.type$);
  }

  static sedonaReadComp(conn,compId) {
    return SedonaFuncs.dispatch(SedonaFuncs.curContext(), conn, hx.HxMsg.make1("readComp", compId));
  }

  static sedonaWrite(conn,addr,val) {
    SedonaFuncs.dispatch(SedonaFuncs.curContext(), conn, hx.HxMsg.make2("writeCompProperty", addr, val));
    return "ok";
  }

  static sedonaDiscover() {
    const this$ = this;
    let dicts = sys.List.make(haystack.Dict.type$);
    SedonaScheme.schemes().each((s) => {
      let grid = s.discover();
      grid.each((r) => {
        dicts.add(r);
        return;
      });
      return;
    });
    return haystack.Etc.makeDictsGrid(null, dicts);
  }

  static sedonaKitManifests() {
    const this$ = this;
    let lib = SedonaFuncs.curContext().rt().lib("sedona");
    let cols = sys.List.make(sys.Str.type$, ["hasNatives", "doc", "version", "vendor", "description", "buildHost", "buildTime"]);
    let b = haystack.GridBuilder.make();
    b.addCol("id", haystack.Etc.makeDict1("hidden", haystack.Marker.val()));
    b.addCol("name");
    b.addCol("checksum");
    b.addColNames(cols);
    let m = SedonaFuncs.sedonaHome().plus(sys.Uri.fromStr("manifests/"));
    if (m.exists()) {
      m.listDirs().each((d) => {
        d.listFiles().each((f) => {
          if (sys.ObjUtil.compareNE(f.ext(), "xml")) {
            return;
          }
          ;
          try {
            let elem = SedonaFuncs.xmlParse(f);
            let name = SedonaFuncs.xmlToName(elem);
            let checksum = SedonaFuncs.xmlToChecksum(elem);
            let id = SedonaFuncs.xmlToId(name, checksum);
            let row = sys.List.make(sys.Obj.type$.toNullable(), [id, name, checksum]);
            cols.each((c) => {
              row.add(((this$) => { let $_u27=elem.attr(c, false); return ($_u27==null) ? null : $_u27.val(); })(this$));
              return;
            });
            b.addRow(row);
          }
          catch ($_u28) {
            $_u28 = sys.Err.make($_u28);
            if ($_u28 instanceof sys.Err) {
              let err = $_u28;
              ;
              lib.log().err(sys.Str.plus("Cannot parse manifest: ", f.osPath()), err);
            }
            else {
              throw $_u28;
            }
          }
          ;
          return;
        });
        return;
      });
    }
    ;
    return b.toGrid().sortCol("name");
  }

  static sedonaKitManifestUpload(uris) {
    const this$ = this;
    uris.each((uri) => {
      let file = SedonaFuncs.curContext().rt().file().resolve(uri);
      try {
        let elem = SedonaFuncs.xmlParse(file);
        let name = SedonaFuncs.xmlToName(elem);
        let checksum = SedonaFuncs.xmlToChecksum(elem);
        let id = SedonaFuncs.xmlToId(name, checksum);
        let dest = SedonaFuncs.idToFile(id, false);
        if (dest.exists()) {
          dest.delete();
        }
        ;
        let out = dest.out();
        try {
          file.in().pipe(out);
          file.delete();
        }
        finally {
          out.close();
        }
        ;
      }
      catch ($_u29) {
        $_u29 = sys.Err.make($_u29);
        if ($_u29 instanceof sys.Err) {
          let e = $_u29;
          ;
          throw sys.Err.make(sys.Str.plus("File is not a valid sedona manifest XML file: ", file.name()), e);
        }
        else {
          throw $_u29;
        }
      }
      ;
      return;
    });
    return;
  }

  static sedonaKitManifestView(id) {
    let $xml = SedonaFuncs.idToFile(id).readAllStr();
    return haystack.Etc.makeMapGrid(sys.Map.__fromLiteral(["view"], ["text"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["val"], [$xml], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

  static sedonaDeleteKitManifests(ids) {
    const this$ = this;
    ids.each((id) => {
      SedonaFuncs.idToFile(id).delete();
      return;
    });
    return;
  }

  static xmlParse(file) {
    return xml.XParser.make(file.in()).parseDoc().root();
  }

  static xmlToName(elem) {
    return elem.attr("name").val();
  }

  static xmlToChecksum(elem) {
    return sys.Str.padl(elem.attr("checksum").val(), 8, 48);
  }

  static xmlToId(name,checksum) {
    return sys.ObjUtil.coerce(haystack.Ref.fromStr(sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), "-"), checksum)), haystack.Ref.type$);
  }

  static idToFile(id,mustExist) {
    if (mustExist === undefined) mustExist = true;
    let kit = sys.ObjUtil.toStr(id);
    if (sys.Str.contains(kit, ".")) {
      throw sys.Err.make(sys.Str.plus("Invalid manifest: ", id));
    }
    ;
    let dash = sys.Str.index(kit, "-");
    let name = sys.Str.getRange(kit, sys.Range.make(0, sys.ObjUtil.coerce(dash, sys.Int.type$), true));
    let sum = sys.Str.getRange(kit, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(dash, sys.Int.type$), 1), -1));
    let path = sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("manifests/", name), "/"), name), "-"), sum), ".xml"));
    let file = SedonaFuncs.sedonaHome().plus(path);
    if ((!file.exists() && mustExist)) {
      throw sys.Err.make(sys.Str.plus("Manifest not found: {var}/etc/sedona/", path));
    }
    ;
    return file;
  }

  static dispatch(cx,conn,msg) {
    let lib = sys.ObjUtil.coerce(cx.rt().lib("sedona"), SedonaLib.type$);
    let r = lib.conn(haystack.Etc.toId(conn)).sendSync(msg);
    return r;
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static make() {
    const $self = new SedonaFuncs();
    SedonaFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    SedonaFuncs.#sedonaHome = sys.Env.cur().workDir().plus(sys.Uri.fromStr("etc/sedona/"));
    return;
  }

}

class SedonaScheme extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SedonaScheme.type$; }

  static #schemesRef = undefined;

  static schemesRef() {
    if (SedonaScheme.#schemesRef === undefined) {
      SedonaScheme.static$init();
      if (SedonaScheme.#schemesRef === undefined) SedonaScheme.#schemesRef = null;
    }
    return SedonaScheme.#schemesRef;
  }

  static schemes() {
    const this$ = this;
    if (SedonaScheme.schemesRef().val() == null) {
      let types = sys.Env.cur().index("hxSedona.scheme");
      SedonaScheme.schemesRef().val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(types.map((t) => {
        return sys.Type.find(t).make();
      }, sys.Obj.type$.toNullable())), sys.Type.find("sys::Obj?[]")));
    }
    ;
    return sys.ObjUtil.coerce(SedonaScheme.schemesRef().val(), sys.Type.find("hxSedona::SedonaScheme[]"));
  }

  options(conn) {
    return null;
  }

  static make() {
    const $self = new SedonaScheme();
    SedonaScheme.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    SedonaScheme.#schemesRef = concurrent.AtomicRef.make();
    return;
  }

}

class DefaultSedonaScheme extends SedonaScheme {
  constructor() {
    super();
    const this$ = this;
    this.#uriScheme = "sox";
    return;
  }

  typeof() { return DefaultSedonaScheme.type$; }

  #uriScheme = null;

  uriScheme() { return this.#uriScheme; }

  __uriScheme(it) { if (it === undefined) return this.#uriScheme; else this.#uriScheme = it; }

  createDaspSocket(rec) {
    return sys.ObjUtil.coerce(java.failsedona.dasp.DaspSocket.open(sys.ObjUtil.coerce(-1, java.fail.int.type$), null, sys.ObjUtil.coerce(sys.ObjUtil.coerce(java.failsedona.dasp.DaspSocket.SESSION_QUEUING(), sys.Int.type$), java.fail.int.type$)), java.failsedona.dasp.DaspSocket.type$);
  }

  closeDaspSocket(s) {
    s.close();
    return;
  }

  inetAddress(uri) {
    return sys.ObjUtil.coerce(java.failjava.net.InetAddress.getByName(uri.host()), java.failjava.net.InetAddress.type$);
  }

  discover() {
    return haystack.Etc.makeEmptyGrid();
  }

  static make() {
    const $self = new DefaultSedonaScheme();
    DefaultSedonaScheme.make$($self);
    return $self;
  }

  static make$($self) {
    SedonaScheme.make$($self);
    ;
    return;
  }

}

class SedonaUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SedonaUtil.type$; }

  static compToDict(comp) {
    const this$ = this;
    let tags = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj?]"));
    let props = sys.ObjUtil.coerce(sys.List.make(java.failsedona.Slot.type$.toNullable(), comp.type().props()), sys.Type.find("[java]sedona::Slot[]"));
    tags.set("dis", comp.name());
    tags.set("compId", haystack.Number.makeInt(sys.ObjUtil.coerce(comp.id(), sys.Int.type$)));
    tags.set("parentId", haystack.Number.makeInt(sys.ObjUtil.coerce(comp.parentId(), sys.Int.type$)));
    tags.set("path", comp.path());
    tags.set("type", comp.type().qname());
    tags.set("meta", sys.Str.plus("0x", sys.Int.toHex(sys.ObjUtil.coerce(comp.getInt("meta"), sys.Int.type$))));
    tags.set("childrenIds", SedonaUtil.idsToStr(sys.ObjUtil.coerce(comp.childrenIds(), java.failfanx.interop.IntArray.type$)));
    props.each(() => {
      // Cannot write closure. Signature uses non-JS types: |[java]sedona::Slot->sys::Void|
      throw sys.UnsupportedErr.make('Closure uses non-JS types: ' + "|[java]sedona::Slot->sys::Void|");
    });
    return haystack.Etc.makeDict(tags);
  }

  static valueToFan(v,unit) {
    if (unit === undefined) unit = null;
    if ((v == null || v.isNull())) {
      return null;
    }
    ;
    let $_u30 = sys.ObjUtil.coerce(v.typeId(), sys.Int.type$);
    if (sys.ObjUtil.equals($_u30, sys.ObjUtil.coerce(java.failsedona.Constants.voidId(), sys.Int.type$))) {
      return null;
    }
    else if (sys.ObjUtil.equals($_u30, sys.ObjUtil.coerce(java.failsedona.Constants.boolId(), sys.Int.type$))) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(v, java.failsedona.Bool.type$).val(), sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u30, sys.ObjUtil.coerce(java.failsedona.Constants.byteId(), sys.Int.type$))) {
      return haystack.Number.makeInt(sys.ObjUtil.coerce(sys.ObjUtil.coerce(v, java.failsedona.Byte.type$).val(), sys.Int.type$), unit);
    }
    else if (sys.ObjUtil.equals($_u30, sys.ObjUtil.coerce(java.failsedona.Constants.shortId(), sys.Int.type$))) {
      return haystack.Number.makeInt(sys.ObjUtil.coerce(sys.ObjUtil.coerce(v, java.failsedona.Short.type$).val(), sys.Int.type$), unit);
    }
    else if (sys.ObjUtil.equals($_u30, sys.ObjUtil.coerce(java.failsedona.Constants.intId(), sys.Int.type$))) {
      return haystack.Number.makeInt(sys.ObjUtil.coerce(sys.ObjUtil.coerce(v, java.failsedona.Int.type$).val(), sys.Int.type$), unit);
    }
    else if (sys.ObjUtil.equals($_u30, sys.ObjUtil.coerce(java.failsedona.Constants.longId(), sys.Int.type$))) {
      return haystack.Number.makeInt(sys.ObjUtil.coerce(v, java.failsedona.Long.type$).val(), unit);
    }
    else if (sys.ObjUtil.equals($_u30, sys.ObjUtil.coerce(java.failsedona.Constants.floatId(), sys.Int.type$))) {
      return haystack.Number.make(sys.ObjUtil.coerce(sys.ObjUtil.coerce(v, java.failsedona.Float.type$).val(), sys.Float.type$), unit);
    }
    else if (sys.ObjUtil.equals($_u30, sys.ObjUtil.coerce(java.failsedona.Constants.doubleId(), sys.Int.type$))) {
      return haystack.Number.make(sys.ObjUtil.coerce(v, java.failsedona.Double.type$).val(), unit);
    }
    else if (sys.ObjUtil.equals($_u30, sys.ObjUtil.coerce(java.failsedona.Constants.bufId(), sys.Int.type$))) {
      return sys.ObjUtil.coerce(v, java.failsedona.Buf.type$).dumpToString();
    }
    else if (sys.ObjUtil.equals($_u30, sys.ObjUtil.coerce(java.failsedona.Constants.strId(), sys.Int.type$))) {
      return sys.ObjUtil.coerce(v, java.failsedona.Str.type$).val();
    }
    else {
      sys.ObjUtil.echo(sys.Str.plus("Unknown sedona value type ", sys.ObjUtil.coerce(sys.ObjUtil.coerce(v.typeId(), sys.Int.type$), sys.Obj.type$.toNullable())));
      return null;
    }
    ;
  }

  static fanToValue(type,v) {
    let num = sys.ObjUtil.as(v, haystack.Number.type$);
    let int = ((this$) => { if (num == null) return 0; return num.toInt(); })(this);
    let $_u32 = sys.ObjUtil.coerce(type.id(), sys.Int.type$);
    if (sys.ObjUtil.equals($_u32, sys.ObjUtil.coerce(java.failsedona.Constants.boolId(), sys.Int.type$))) {
      return sys.ObjUtil.coerce(((this$) => { if (v == null) return java.failsedona.Bool.NULL(); return java.failsedona.Bool.make(sys.ObjUtil.coerce(v, sys.Bool.type$)); })(this), java.failsedona.Value.type$);
    }
    else if (sys.ObjUtil.equals($_u32, sys.ObjUtil.coerce(java.failsedona.Constants.byteId(), sys.Int.type$))) {
      return sys.ObjUtil.coerce(java.failsedona.Byte.make(sys.ObjUtil.coerce(int, java.fail.int.type$)), java.failsedona.Value.type$);
    }
    else if (sys.ObjUtil.equals($_u32, sys.ObjUtil.coerce(java.failsedona.Constants.shortId(), sys.Int.type$))) {
      return sys.ObjUtil.coerce(java.failsedona.Short.make(sys.ObjUtil.coerce(int, java.fail.int.type$)), java.failsedona.Value.type$);
    }
    else if (sys.ObjUtil.equals($_u32, sys.ObjUtil.coerce(java.failsedona.Constants.intId(), sys.Int.type$))) {
      return sys.ObjUtil.coerce(java.failsedona.Int.make(sys.ObjUtil.coerce(int, java.fail.int.type$)), java.failsedona.Value.type$);
    }
    else if (sys.ObjUtil.equals($_u32, sys.ObjUtil.coerce(java.failsedona.Constants.longId(), sys.Int.type$))) {
      return sys.ObjUtil.coerce(java.failsedona.Long.make(int), java.failsedona.Value.type$);
    }
    else if (sys.ObjUtil.equals($_u32, sys.ObjUtil.coerce(java.failsedona.Constants.floatId(), sys.Int.type$))) {
      return sys.ObjUtil.coerce(((this$) => { if (v == null) return java.failsedona.Float.NULL(); return java.failsedona.Float.make(sys.ObjUtil.coerce(num.toFloat(), java.fail.float.type$)); })(this), java.failsedona.Value.type$);
    }
    else if (sys.ObjUtil.equals($_u32, sys.ObjUtil.coerce(java.failsedona.Constants.doubleId(), sys.Int.type$))) {
      return sys.ObjUtil.coerce(((this$) => { if (v == null) return java.failsedona.Double.NULL(); return java.failsedona.Double.make(num.toFloat()); })(this), java.failsedona.Value.type$);
    }
    else if (sys.ObjUtil.equals($_u32, sys.ObjUtil.coerce(java.failsedona.Constants.strId(), sys.Int.type$))) {
      return sys.ObjUtil.coerce(java.failsedona.Str.make(sys.ObjUtil.coerce(v, sys.Str.type$)), java.failsedona.Value.type$);
    }
    else {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot map ", v), " to "), type));
    }
    ;
  }

  static sedonaTypeToKind(type) {
    if ((type.isInteger() || sys.ObjUtil.equals(sys.ObjUtil.coerce(type.id(), sys.Int.type$), sys.ObjUtil.coerce(java.failsedona.Type.longId(), sys.Int.type$)) || sys.ObjUtil.equals(sys.ObjUtil.coerce(type.id(), sys.Int.type$), sys.ObjUtil.coerce(java.failsedona.Type.floatId(), sys.Int.type$)) || sys.ObjUtil.equals(sys.ObjUtil.coerce(type.id(), sys.Int.type$), sys.ObjUtil.coerce(java.failsedona.Type.doubleId(), sys.Int.type$)))) {
      return "Number";
    }
    ;
    if (sys.ObjUtil.equals(sys.ObjUtil.coerce(type.id(), sys.Int.type$), sys.ObjUtil.coerce(java.failsedona.Type.boolId(), sys.Int.type$))) {
      return "Bool";
    }
    ;
    return null;
  }

  static idsToStr(array) {
    let s = sys.StrBuf.make();
    s.capacity(sys.Int.mult(sys.ObjUtil.coerce(array.size(), sys.Int.type$), 3));
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.ObjUtil.coerce(array.size(), sys.Int.type$)); i = sys.Int.increment(i)) {
      s.join(sys.ObjUtil.coerce(sys.ObjUtil.coerce(array.get(sys.ObjUtil.coerce(i, java.fail.int.type$)), sys.Int.type$), sys.Obj.type$.toNullable()), ",");
    }
    ;
    return s.toStr();
  }

  static make() {
    const $self = new SedonaUtil();
    SedonaUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class SedonaLib extends hxConn.ConnLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SedonaLib.type$; }

  static make() {
    const $self = new SedonaLib();
    SedonaLib.make$($self);
    return $self;
  }

  static make$($self) {
    hxConn.ConnLib.make$($self);
    return;
  }

  static static$init() {
    if (true) {
      let homeDir = sys.Env.cur().workDir().plus(sys.Uri.fromStr("etc/sedona/"));
      try {
        java.failjava.lang.System.getProperties().put("sedona.home", homeDir.osPath());
      }
      catch ($_u36) {
        $_u36 = sys.Err.make($_u36);
        if ($_u36 instanceof sys.Err) {
          let e = $_u36;
          ;
          e.trace();
        }
        else {
          throw $_u36;
        }
      }
      ;
      let props = homeDir.plus(sys.Uri.fromStr("lib/sedona.properties"));
      try {
        if (!props.exists()) {
          props.out().print(sys.Str.plus("# sedona.props\n# stubbed ", sys.DateTime.now().toLocale())).close();
        }
        ;
      }
      catch ($_u37) {
        $_u37 = sys.Err.make($_u37);
        if ($_u37 instanceof sys.Err) {
          let e = $_u37;
          ;
          e.trace();
        }
        else {
          throw $_u37;
        }
      }
      ;
    }
    ;
    return;
  }

}

const p = sys.Pod.add$('hxSedona');
const xp = sys.Param.noParams$();
let m;
SedonaDispatch.type$ = p.at$('SedonaDispatch','hxConn::ConnDispatch',[],{},8192,SedonaDispatch);
SoxConnListener.type$ = p.at$('SoxConnListener','sys::Obj',['[java]sedona.sox::SoxClient$Listener'],{},130,SoxConnListener);
SoxCompListener.type$ = p.at$('SoxCompListener','sys::Obj',['[java]sedona.sox::SoxComponentListener'],{},130,SoxCompListener);
SedonaFuncs.type$ = p.at$('SedonaFuncs','sys::Obj',[],{},8194,SedonaFuncs);
SedonaScheme.type$ = p.at$('SedonaScheme','sys::Obj',[],{},8195,SedonaScheme);
DefaultSedonaScheme.type$ = p.at$('DefaultSedonaScheme','hxSedona::SedonaScheme',[],{},130,DefaultSedonaScheme);
SedonaUtil.type$ = p.at$('SedonaUtil','sys::Obj',[],{},8192,SedonaUtil);
SedonaLib.type$ = p.at$('SedonaLib','hxConn::ConnLib',[],{},8194,SedonaLib);
SedonaDispatch.type$.af$('scheme',73728,'hxSedona::SedonaScheme?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('onReceive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('onOpen',271360,'sys::Void',xp,{}).am$('toConnErr',2048,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('e','sys::Err',false)]),{}).am$('onClose',271360,'sys::Void',xp,{}).am$('onPing',271360,'haystack::Dict',xp,{}).am$('onSoxClosed',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cause','sys::Str?',false)]),{}).am$('onReadComp',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Number',false)]),{}).am$('onLearn',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj?',false)]),{}).am$('onWatch',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onUnwatch',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onSyncCur',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onUpdateCur',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('syncCurPoint',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('mode','sys::Str',false)]),{}).am$('onWrite',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('info','hxConn::ConnWriteInfo',false)]),{}).am$('onWriteProperty',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('addr','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('load',2048,'[java]sedona.sox::SoxComponent',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('addr','sys::Str',false)]),{}).am$('toCompId',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('addr','sys::Str',false)]),{}).am$('pointToComp',2048,'[java]sedona.sox::SoxComponent?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{});
SoxConnListener.type$.af$('conn',73730,'hxConn::Conn',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','hxConn::Conn',false)]),{});
SoxCompListener.type$.af$('conn',73730,'hxConn::Conn',{}).af$('pointId',73730,'haystack::Ref',{}).af$('slot',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false),new sys.Param('id','haystack::Ref',false),new sys.Param('slot','sys::Str',false)]),{});
SedonaFuncs.type$.af$('sedonaHome',106498,'sys::File',{}).am$('sedonaPing',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('sedonaSyncCur',40962,'concurrent::Future[]',sys.List.make(sys.Param.type$,[new sys.Param('points','sys::Obj',false)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('sedonaLearn',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('arg','sys::Obj?',true)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('sedonaReadComp',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('compId','haystack::Number',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('sedonaWrite',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('addr','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('sedonaDiscover',40962,'haystack::Grid',xp,{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('sedonaKitManifests',40962,'haystack::Grid',xp,{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('sedonaKitManifestUpload',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uris','sys::Uri[]',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('sedonaKitManifestView',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('sedonaDeleteKitManifests',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ids','sys::Obj[]',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('xmlParse',34818,'xml::XElem',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('xmlToName',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('elem','xml::XElem',false)]),{}).am$('xmlToChecksum',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('elem','xml::XElem',false)]),{}).am$('xmlToId',34818,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checksum','sys::Str',false)]),{}).am$('idToFile',34818,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false),new sys.Param('mustExist','sys::Bool',true)]),{}).am$('dispatch',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('conn','sys::Obj',false),new sys.Param('msg','hx::HxMsg',false)]),{}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
SedonaScheme.type$.af$('schemesRef',100354,'concurrent::AtomicRef',{}).am$('schemes',40962,'hxSedona::SedonaScheme[]',xp,{}).am$('uriScheme',270337,'sys::Str',xp,{}).am$('options',270336,'[java]java.util::Hashtable?',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false)]),{}).am$('createDaspSocket',270337,'[java]sedona.dasp::DaspSocket',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('inetAddress',270337,'[java]java.net::InetAddress',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('discover',270337,'haystack::Grid',xp,{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
DefaultSedonaScheme.type$.af$('uriScheme',336898,'sys::Str',{}).am$('createDaspSocket',271360,'[java]sedona.dasp::DaspSocket',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('inetAddress',271360,'[java]java.net::InetAddress',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('discover',271360,'haystack::Grid',xp,{}).am$('make',139268,'sys::Void',xp,{});
SedonaUtil.type$.am$('make',139268,'sys::Void',xp,{});
SedonaLib.type$.am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxSedona");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;sys 1.0;util 1.0;web 1.0;xml 1.0;sedona 1.2.28;haystack 3.1.11;axon 3.1.11;folio 3.1.11;hx 3.1.11;hxConn 3.1.11");
m.set("pod.summary", "Sedona Sox connector");
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
  SedonaDispatch,
  SedonaFuncs,
  SedonaScheme,
  SedonaUtil,
  SedonaLib,
};
