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
import * as hxConn from './hxConn.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class HaystackDispatch extends hxConn.ConnDispatch {
  constructor() {
    super();
    const this$ = this;
    this.#watchedIds = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj"));
    return;
  }

  typeof() { return HaystackDispatch.type$; }

  static #noLearnTagsRef = undefined;

  static noLearnTagsRef() {
    if (HaystackDispatch.#noLearnTagsRef === undefined) {
      HaystackDispatch.static$init();
      if (HaystackDispatch.#noLearnTagsRef === undefined) HaystackDispatch.#noLearnTagsRef = null;
    }
    return HaystackDispatch.#noLearnTagsRef;
  }

  #client = null;

  // private field reflection only
  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  #watchedIds = null;

  // private field reflection only
  __watchedIds(it) { if (it === undefined) return this.#watchedIds; else this.#watchedIds = it; }

  #watchInfo = null;

  // private field reflection only
  __watchInfo(it) { if (it === undefined) return this.#watchInfo; else this.#watchInfo = it; }

  static make(arg) {
    const $self = new HaystackDispatch();
    HaystackDispatch.make$($self,arg);
    return $self;
  }

  static make$($self,arg) {
    hxConn.ConnDispatch.make$($self, arg);
    ;
    return;
  }

  onReceive(msg) {
    let msgId = msg.id();
    if (msgId === "call") {
      return this.onCall(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), sys.ObjUtil.coerce(msg.b(), haystack.Grid.type$), sys.ObjUtil.coerce(msg.c(), sys.Bool.type$));
    }
    ;
    if (msgId === "readById") {
      return this.onReadById(sys.ObjUtil.coerce(msg.a(), sys.Obj.type$), sys.ObjUtil.coerce(msg.b(), sys.Bool.type$));
    }
    ;
    if (msgId === "readByIds") {
      return this.onReadByIds(sys.ObjUtil.coerce(msg.a(), sys.Type.find("sys::Obj[]")), sys.ObjUtil.coerce(msg.b(), sys.Bool.type$));
    }
    ;
    if (msgId === "read") {
      return this.onRead(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), sys.ObjUtil.coerce(msg.b(), sys.Bool.type$));
    }
    ;
    if (msgId === "readAll") {
      return this.onReadAll(sys.ObjUtil.coerce(msg.a(), sys.Str.type$));
    }
    ;
    if (msgId === "eval") {
      return this.onEval(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), sys.ObjUtil.coerce(msg.b(), haystack.Dict.type$));
    }
    ;
    if (msgId === "hisRead") {
      return this.onHisRead(sys.ObjUtil.coerce(msg.a(), haystack.Ref.type$), sys.ObjUtil.coerce(msg.b(), sys.Str.type$));
    }
    ;
    if (msgId === "invokeAction") {
      return this.onInvokeAction(sys.ObjUtil.coerce(msg.a(), sys.Obj.type$), sys.ObjUtil.coerce(msg.b(), sys.Str.type$), sys.ObjUtil.coerce(msg.c(), haystack.Dict.type$));
    }
    ;
    return hxConn.ConnDispatch.prototype.onReceive.call(this, msg);
  }

  onOpen() {
    let uriVal = ((this$) => { let $_u0 = this$.rec().get("uri"); if ($_u0 != null) return $_u0; throw haystack.FaultErr.make("Missing 'uri' tag"); })(this);
    let uri = ((this$) => { let $_u1 = sys.ObjUtil.as(uriVal, sys.Uri.type$); if ($_u1 != null) return $_u1; throw haystack.FaultErr.make(sys.Str.plus("Type of 'uri' must be Uri, not ", sys.ObjUtil.typeof(uriVal).name())); })(this);
    let user = ((this$) => { let $_u2 = sys.ObjUtil.as(this$.rec().get("username"), sys.Str.type$); if ($_u2 != null) return $_u2; return ""; })(this);
    let pass = ((this$) => { let $_u3 = this$.db().passwords().get(this$.id().toStr()); if ($_u3 != null) return $_u3; return ""; })(this);
    let opts = sys.Map.__fromLiteral(["log","timeout"], [this.trace().asLog(),this.conn().timeout()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    this.#client = haystack.Client.open(sys.ObjUtil.coerce(uri, sys.Uri.type$), sys.ObjUtil.coerce(user, sys.Str.type$), sys.ObjUtil.coerce(pass, sys.Str.type$), opts);
    return;
  }

  onClose() {
    let old = this.#client;
    this.#client = null;
    this.watchClear();
    if ((old != null && this.rec().missing("haystackCloseUnsupported"))) {
      try {
        old.close();
      }
      catch ($_u4) {
        $_u4 = sys.Err.make($_u4);
        if ($_u4 instanceof sys.Err) {
          let e = $_u4;
          ;
        }
        else {
          throw $_u4;
        }
      }
      ;
    }
    ;
    return;
  }

  onPing() {
    const this$ = this;
    let about = this.#client.about();
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    tags.addNotNull("productName", sys.ObjUtil.as(about.get("productName"), sys.Str.type$));
    tags.addNotNull("productVersion", sys.ObjUtil.as(about.get("productVersion"), sys.Str.type$));
    tags.addNotNull("moduleName", sys.ObjUtil.as(about.get("moduleName"), sys.Str.type$));
    tags.addNotNull("moduleVersion", sys.ObjUtil.as(about.get("moduleVersion"), sys.Str.type$));
    tags.addNotNull("vendorName", sys.ObjUtil.as(about.get("vendorName"), sys.Str.type$));
    tags.addNotNull("serialNumber", sys.ObjUtil.as(about.get("serialNumber"), sys.Str.type$));
    about.each((v,n) => {
      if (sys.Str.startsWith(n, "host")) {
        tags.set(n, v);
      }
      ;
      return;
    });
    let tzStr = sys.ObjUtil.as(about.get("tz"), sys.Str.type$);
    if (tzStr != null) {
      let tz = sys.TimeZone.fromStr(sys.ObjUtil.coerce(tzStr, sys.Str.type$), false);
      if (tz != null) {
        tags.set("tz", tz.name());
      }
      ;
    }
    ;
    return haystack.Etc.makeDict(tags);
  }

  onCall(op,req,checked) {
    return this.call(op, req, checked);
  }

  call(op,req,checked) {
    if (checked === undefined) checked = true;
    return this.openClient().call(op, req, checked);
  }

  openClient() {
    this.open();
    return sys.ObjUtil.coerce(this.#client, haystack.Client.type$);
  }

  onReadById(id,checked) {
    return this.openClient().readById(id, checked);
  }

  onReadByIds(ids,checked) {
    return this.openClient().readByIds(ids, checked);
  }

  onRead(filter,checked) {
    return this.openClient().read(filter, checked);
  }

  onReadAll(filter) {
    return this.openClient().readAll(filter);
  }

  onEval(expr,opts) {
    let req = haystack.Etc.makeListGrid(opts, "expr", null, sys.List.make(sys.Str.type$, [expr]));
    return this.openClient().call("eval", req);
  }

  onInvokeAction(id,action,args) {
    let req = haystack.Etc.makeDictGrid(sys.Map.__fromLiteral(["id","action"], [id,action], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), args);
    return this.openClient().call("invokeAction", req);
  }

  onLearn(arg) {
    const this$ = this;
    let noLearnTags = sys.ObjUtil.as(HaystackDispatch.noLearnTagsRef().val(), haystack.Dict.type$);
    if (noLearnTags == null) {
      HaystackDispatch.noLearnTagsRef().val((noLearnTags = haystack.Etc.makeDict(folio.FolioUtil.tagsToNeverLearn())));
    }
    ;
    let client = this.openClient();
    let req = ((this$) => { if (arg == null) return haystack.Etc.makeEmptyGrid(); return haystack.Etc.makeListGrid(null, "navId", null, sys.List.make(sys.Obj.type$.toNullable(), [arg])); })(this);
    let res = client.call("nav", req);
    let learnRows = sys.List.make(sys.Type.find("[sys::Str:sys::Obj?]"));
    res.each((row) => {
      let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
      row.each((val,name) => {
        if (sys.ObjUtil.is(val, haystack.Bin.type$)) {
          return;
        }
        ;
        if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
          return;
        }
        ;
        if (noLearnTags.has(name)) {
          return;
        }
        ;
        map.set(name, val);
        return;
      });
      let id = sys.ObjUtil.as(row.get("id"), haystack.Ref.type$);
      if (map.get("dis") == null) {
        if (row.has("navName")) {
          map.set("dis", sys.ObjUtil.toStr(row.get("navName")));
        }
        else {
          if (id != null) {
            map.set("dis", id.dis());
          }
          ;
        }
        ;
      }
      ;
      if (row.has("point")) {
        if (id != null) {
          if (row.has("cur")) {
            map.set("haystackCur", id.toStr());
          }
          ;
          if (row.has("writable")) {
            map.set("haystackWrite", id.toStr());
          }
          ;
          if (row.has("his")) {
            map.set("haystackHis", id.toStr());
          }
          ;
        }
        ;
      }
      else {
        let navId = row.get("navId");
        if (navId != null) {
          map.set("learn", sys.ObjUtil.coerce(navId, sys.Obj.type$));
        }
        ;
      }
      ;
      learnRows.add(map);
      return;
    });
    return haystack.Etc.makeMapsGrid(null, learnRows);
  }

  onSyncCur(points) {
    const this$ = this;
    let ids = sys.List.make(sys.Obj.type$);
    let pointsByIndex = sys.List.make(hxConn.ConnPoint.type$);
    points.each((pt) => {
      try {
        let id = HaystackDispatch.toCurId(pt);
        ids.add(id);
        pointsByIndex.add(pt);
      }
      catch ($_u6) {
        $_u6 = sys.Err.make($_u6);
        if ($_u6 instanceof sys.Err) {
          let e = $_u6;
          ;
          pt.updateCurErr(e);
        }
        else {
          throw $_u6;
        }
      }
      ;
      return;
    });
    if (ids.isEmpty()) {
      return;
    }
    ;
    let reqMeta = sys.Map.__fromLiteral(["watchDis","lease","curValPoll"], [sys.Str.plus(sys.Str.plus("SkySpark Conn: ", this.dis()), " (sync cur)"),haystack.Number.makeDuration(sys.Duration.fromStr("10sec"), null),haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let req = haystack.Etc.makeListGrid(reqMeta, "id", null, ids);
    let readGrid = this.call("watchSub", req);
    readGrid.each((readRow,i) => {
      let pt = pointsByIndex.get(i);
      this$.syncPoint(pt, readRow);
      return;
    });
    return;
  }

  syncPoint(pt,result) {
    if (result.missing("id")) {
      pt.updateCurErr(haystack.UnknownRecErr.make(""));
      return;
    }
    ;
    let curStatus = sys.ObjUtil.as(result.get("curStatus"), sys.Str.type$);
    if ((curStatus != null && sys.ObjUtil.compareNE(curStatus, "ok"))) {
      let errStatus = ((this$) => { let $_u7 = hxConn.ConnStatus.fromStr(sys.ObjUtil.coerce(curStatus, sys.Str.type$), false); if ($_u7 != null) return $_u7; return hxConn.ConnStatus.fault(); })(this);
      pt.updateCurErr(hxConn.RemoteStatusErr.make(sys.ObjUtil.coerce(errStatus, hxConn.ConnStatus.type$)));
      return;
    }
    ;
    pt.updateCurOk(result.get("curVal"));
    return;
  }

  onWatch(points) {
    try {
      this.watchSub(points);
    }
    catch ($_u8) {
      $_u8 = sys.Err.make($_u8);
      if ($_u8 instanceof sys.Err) {
        let e = $_u8;
        ;
        this.onWatchErr(e);
      }
      else {
        throw $_u8;
      }
    }
    ;
    return;
  }

  watchSub(points) {
    const this$ = this;
    let subIds = sys.List.make(sys.Obj.type$);
    subIds.capacity(points.size());
    let subPoints = sys.List.make(hxConn.ConnPoint.type$);
    subPoints.capacity(points.size());
    points.each((pt) => {
      try {
        let id = HaystackDispatch.toCurId(pt);
        subIds.add(id);
        subPoints.add(pt);
      }
      catch ($_u9) {
        $_u9 = sys.Err.make($_u9);
        if ($_u9 instanceof sys.Err) {
          let e = $_u9;
          ;
          pt.updateCurErr(e);
        }
        else {
          throw $_u9;
        }
      }
      ;
      return;
    });
    if (subIds.isEmpty()) {
      return;
    }
    ;
    let leaseReq = ((this$) => { let $_u10 = this$.conn().pollFreq(); if ($_u10 != null) return $_u10; return sys.Duration.fromStr("10sec"); })(this).mult(2);
    if (sys.ObjUtil.compareLT(leaseReq, sys.Duration.fromStr("1min"))) {
      (leaseReq = sys.Duration.fromStr("1min"));
    }
    ;
    let meta = sys.Map.__fromLiteral(["watchDis","lease","curValSub"], [sys.Str.plus("SkySpark Conn: ", this.dis()),haystack.Number.makeDuration(leaseReq, null),haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    if (this.watchId() != null) {
      meta.set("watchId", sys.ObjUtil.coerce(this.watchId(), sys.Obj.type$));
    }
    ;
    let req = haystack.Etc.makeListGrid(meta, "id", null, subIds);
    let res = this.call("watchSub", req);
    let watchId = res.meta().trap("watchId", sys.List.make(sys.Obj.type$.toNullable(), []));
    let watchLeaseReq = leaseReq;
    let watchLeaseRes = null;
    try {
      (watchLeaseRes = sys.ObjUtil.coerce(res.meta().trap("lease", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$).toDuration());
    }
    catch ($_u11) {
      $_u11 = sys.Err.make($_u11);
      if ($_u11 instanceof sys.Err) {
        let e = $_u11;
        ;
        (watchLeaseRes = e.toStr());
      }
      else {
        throw $_u11;
      }
    }
    ;
    this.#watchInfo = WatchInfo.make(sys.ObjUtil.coerce(watchId, sys.Str.type$), watchLeaseReq, sys.ObjUtil.coerce(watchLeaseRes, sys.Obj.type$));
    this.setConnData(this.#watchInfo);
    res.each((resRow,i) => {
      let pt = subPoints.getSafe(i);
      if (pt == null) {
        return;
      }
      ;
      let id = resRow.get("id");
      if (id != null) {
        this$.addWatchedId(sys.ObjUtil.coerce(id, sys.Obj.type$), sys.ObjUtil.coerce(pt, hxConn.ConnPoint.type$));
      }
      ;
      this$.syncPoint(sys.ObjUtil.coerce(pt, hxConn.ConnPoint.type$), resRow);
      return;
    });
    return;
  }

  addWatchedId(id,pt) {
    let cur = this.#watchedIds.get(id);
    if (cur == null) {
      this.#watchedIds.set(id, pt);
      return;
    }
    ;
    let curPt = sys.ObjUtil.as(cur, hxConn.ConnPoint.type$);
    if (curPt != null) {
      if (cur === pt) {
        return;
      }
      ;
      this.#watchedIds.set(id, sys.List.make(hxConn.ConnPoint.type$, [sys.ObjUtil.coerce(curPt, hxConn.ConnPoint.type$), pt]));
      return;
    }
    ;
    let curList = ((this$) => { let $_u12 = sys.ObjUtil.as(cur, sys.Type.find("hxConn::ConnPoint[]")); if ($_u12 != null) return $_u12; throw sys.Err.make(sys.Str.plus("expecting ConnPoint[], not ", sys.ObjUtil.typeof(cur))); })(this);
    if (curList.indexSame(pt) != null) {
      return;
    }
    ;
    curList.add(pt);
    return;
  }

  onUnwatch(points) {
    const this$ = this;
    let ids = sys.List.make(sys.Obj.type$);
    points.each((pt) => {
      try {
        let id = HaystackDispatch.toCurId(pt);
        ids.add(id);
      }
      catch ($_u13) {
        $_u13 = sys.Err.make($_u13);
        if ($_u13 instanceof sys.Err) {
          let e = $_u13;
          ;
        }
        else {
          throw $_u13;
        }
      }
      ;
      return;
    });
    if (this.watchId() == null) {
      return;
    }
    ;
    let close = !this.hasPointsWatched();
    let meta = sys.Map.__fromLiteral(["watchId"], [sys.ObjUtil.coerce(this.watchId(), sys.Obj.type$)], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    if (close) {
      meta.set("close", haystack.Marker.val());
    }
    ;
    let req = haystack.Etc.makeListGrid(meta, "id", null, ids);
    try {
      this.call("watchUnsub", req);
    }
    catch ($_u14) {
      $_u14 = sys.Err.make($_u14);
      if ($_u14 instanceof sys.Err) {
        let e = $_u14;
        ;
      }
      else {
        throw $_u14;
      }
    }
    ;
    if (close) {
      this.watchClear();
    }
    ;
    return;
  }

  onPollManual() {
    const this$ = this;
    if (this.watchId() == null) {
      return;
    }
    ;
    try {
      let req = haystack.Etc.makeEmptyGrid(haystack.Etc.makeDict2("watchId", this.watchId(), "curValSub", haystack.Marker.val()));
      let res = this.call("watchPoll", req);
      res.each((rec) => {
        let id = ((this$) => { let $_u15 = rec.get("id"); if ($_u15 != null) return $_u15; return haystack.Ref.nullRef(); })(this$);
        let ptOrPts = this$.#watchedIds.get(sys.ObjUtil.coerce(id, sys.Obj.type$));
        if (ptOrPts == null) {
          if (sys.ObjUtil.compareNE(id, haystack.Ref.nullRef())) {
            sys.ObjUtil.echo(sys.Str.plus("WARN: HaystackConn watch returned unwatched point: ", id));
          }
          ;
          return;
        }
        ;
        if (sys.ObjUtil.is(ptOrPts, hxConn.ConnPoint.type$)) {
          this$.syncPoint(sys.ObjUtil.coerce(ptOrPts, hxConn.ConnPoint.type$), rec);
        }
        else {
          sys.ObjUtil.coerce(ptOrPts, sys.Type.find("hxConn::ConnPoint[]")).each((pt) => {
            this$.syncPoint(pt, rec);
            return;
          });
        }
        ;
        return;
      });
    }
    catch ($_u16) {
      $_u16 = sys.Err.make($_u16);
      if ($_u16 instanceof sys.Err) {
        let e = $_u16;
        ;
        this.onWatchErr(e);
      }
      else {
        throw $_u16;
      }
    }
    ;
    return;
  }

  onWatchErr(err) {
    this.watchClear();
    if (sys.ObjUtil.is(err, haystack.CallErr.type$)) {
      try {
        this.watchSub(this.pointsWatched());
      }
      catch ($_u17) {
        $_u17 = sys.Err.make($_u17);
        if ($_u17 instanceof sys.Err) {
          let e = $_u17;
          ;
        }
        else {
          throw $_u17;
        }
      }
      ;
    }
    ;
    this.close(err);
    return;
  }

  watchId() {
    return ((this$) => { let $_u18=this$.#watchInfo; return ($_u18==null) ? null : $_u18.id(); })(this);
  }

  watchClear() {
    this.#watchInfo = null;
    this.#watchedIds.clear();
    return;
  }

  onWrite(point,info) {
    let val = info.val();
    let level = info.level();
    let who = info.who();
    try {
      let id = HaystackDispatch.toWriteId(point);
      let writeLevel = this.toHaystackWriteLevel(point, info);
      if (writeLevel == null) {
        return;
      }
      ;
      let lastWriteLevel = sys.ObjUtil.as(point.data(), haystack.Number.type$);
      if ((lastWriteLevel != null && sys.ObjUtil.compareNE(lastWriteLevel, writeLevel))) {
        this.callPointWrite(point, id, sys.ObjUtil.coerce(lastWriteLevel, haystack.Number.type$), null, null);
      }
      ;
      let schedule = null;
      let timeline = info.opts().get("schedule");
      if ((sys.ObjUtil.is(timeline, haystack.Grid.type$) && point.tuning().rec().has("writeSchedule"))) {
        (schedule = haystack.ZincWriter.gridToStr(sys.ObjUtil.coerce(timeline, haystack.Grid.type$)));
      }
      ;
      this.callPointWrite(point, id, sys.ObjUtil.coerce(writeLevel, haystack.Number.type$), val, schedule);
      this.setPointData(point, writeLevel);
      point.updateWriteOk(info);
    }
    catch ($_u19) {
      $_u19 = sys.Err.make($_u19);
      if ($_u19 instanceof sys.Err) {
        let e = $_u19;
        ;
        point.updateWriteErr(info, e);
      }
      else {
        throw $_u19;
      }
    }
    ;
    return;
  }

  callPointWrite(point,id,writeLevel,val,schedule) {
    let reqWho = sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.rt().name()), " :: "), point.dis());
    let map = sys.Map.__fromLiteral(["id","level","who"], [id,writeLevel,reqWho], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    if (val != null) {
      map.set("val", sys.ObjUtil.coerce(val, sys.Obj.type$));
    }
    ;
    if (schedule != null) {
      map.set("schedule", sys.ObjUtil.coerce(schedule, sys.Obj.type$));
    }
    ;
    let req = haystack.Etc.makeMapGrid(null, map);
    return this.call("pointWrite", req);
  }

  toHaystackWriteLevel(pt,info) {
    let x = pt.rec().get("haystackWriteLevel");
    if (x == null) {
      pt.updateWriteErr(info, haystack.FaultErr.make("missing haystackWriteLevel"));
      return null;
    }
    ;
    let num = sys.ObjUtil.as(x, haystack.Number.type$);
    if (num == null) {
      pt.updateWriteErr(info, haystack.FaultErr.make(sys.Str.plus(sys.Str.plus("haystackWriteLevel is ", sys.ObjUtil.typeof(x).name()), " not Number")));
      return null;
    }
    ;
    if ((sys.ObjUtil.compareLT(num.toInt(), 1) || sys.ObjUtil.compareGT(num.toInt(), 17))) {
      pt.updateWriteErr(info, haystack.FaultErr.make(sys.Str.plus("haystackWriteLevel is not 1-17: ", num)));
      return null;
    }
    ;
    return num;
  }

  onHisRead(id,range) {
    let req = haystack.GridBuilder.make().addCol("id").addCol("range").addRow2(id, range).toGrid();
    return this.openClient().call("hisRead", req);
  }

  onSyncHis(point,span) {
    const this$ = this;
    try {
      let tz = point.tz();
      let range = sys.Str.plus(sys.Str.plus(sys.Str.plus("", span.start()), ","), span.end());
      let hisId = HaystackDispatch.toHisId(point);
      let req = haystack.GridBuilder.make().addCol("id").addCol("range").addRow2(hisId, range).toGrid();
      let res = this.openClient().call("hisRead", req);
      let items = sys.List.make(haystack.HisItem.type$);
      items.capacity(res.size());
      let ts = res.col("ts");
      let val = res.col("val");
      res.each((row) => {
        items.add(haystack.HisItem.make(sys.ObjUtil.coerce(row.val(sys.ObjUtil.coerce(ts, haystack.Col.type$)), sys.DateTime.type$), row.val(sys.ObjUtil.coerce(val, haystack.Col.type$))));
        return;
      });
      return point.updateHisOk(items, span);
    }
    catch ($_u20) {
      $_u20 = sys.Err.make($_u20);
      if ($_u20 instanceof sys.Err) {
        let e = $_u20;
        ;
        return point.updateHisErr(e);
      }
      else {
        throw $_u20;
      }
    }
    ;
  }

  static toCurId(pt) {
    return HaystackDispatch.toRemoteId(sys.ObjUtil.coerce(pt.curAddr(), sys.Obj.type$));
  }

  static toWriteId(pt) {
    return HaystackDispatch.toRemoteId(sys.ObjUtil.coerce(pt.writeAddr(), sys.Obj.type$));
  }

  static toHisId(pt) {
    return HaystackDispatch.toRemoteId(sys.ObjUtil.coerce(pt.hisAddr(), sys.Obj.type$));
  }

  static toRemoteId(val) {
    return sys.ObjUtil.coerce(haystack.Ref.make(sys.ObjUtil.toStr(val), null), haystack.Ref.type$);
  }

  static static$init() {
    HaystackDispatch.#noLearnTagsRef = concurrent.AtomicRef.make();
    return;
  }

}

class WatchInfo extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WatchInfo.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #leaseReq = null;

  leaseReq() { return this.#leaseReq; }

  __leaseReq(it) { if (it === undefined) return this.#leaseReq; else this.#leaseReq = it; }

  #leaseRes = null;

  leaseRes() { return this.#leaseRes; }

  __leaseRes(it) { if (it === undefined) return this.#leaseRes; else this.#leaseRes = it; }

  static make(id,leaseReq,leaseRes) {
    const $self = new WatchInfo();
    WatchInfo.make$($self,id,leaseReq,leaseRes);
    return $self;
  }

  static make$($self,id,leaseReq,leaseRes) {
    $self.#id = id;
    $self.#leaseReq = leaseReq;
    $self.#leaseRes = ((this$) => { let $_u21 = leaseRes; if ($_u21 == null) return null; return sys.ObjUtil.toImmutable(leaseRes); })($self);
    return;
  }

  toStr() {
    return sys.Str.plus("WatchInfo ", this.#id);
  }

}

class HaystackLib extends hxConn.ConnLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HaystackLib.type$; }

  onConnDetails(c) {
    let rec = c.rec();
    let uri = rec.get("uri");
    let product = sys.Str.plus(sys.Str.plus(sys.Str.plus("", rec.get("productName")), " "), rec.get("productVersion"));
    let module = sys.Str.plus(sys.Str.plus(sys.Str.plus("", rec.get("moduleName")), " "), rec.get("moduleVersion"));
    let vendor = sys.Str.plus("", rec.get("vendorName"));
    let watch = sys.ObjUtil.as(c.data(), WatchInfo.type$);
    let s = sys.StrBuf.make();
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("uri:           ", uri), "\nproduct:       "), product), "\nmodule:        "), module), "\nvendor:        "), vendor), "\nwatchId:       "), ((this$) => { let $_u22=watch; return ($_u22==null) ? null : $_u22.id(); })(this)), "\n"));
    if (watch != null) {
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("watchLeaseReq: ", ((this$) => { let $_u23=watch; return ($_u23==null) ? null : $_u23.leaseReq(); })(this)), "\nwatchLeaseRes: "), ((this$) => { let $_u24=watch; return ($_u24==null) ? null : $_u24.leaseRes(); })(this)), "\n"));
    }
    ;
    return s.toStr();
  }

  static make() {
    const $self = new HaystackLib();
    HaystackLib.make$($self);
    return $self;
  }

  static make$($self) {
    hxConn.ConnLib.make$($self);
    return;
  }

}

class HaystackFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HaystackFuncs.type$; }

  static #cannotSerialze = undefined;

  static cannotSerialze() {
    if (HaystackFuncs.#cannotSerialze === undefined) {
      HaystackFuncs.static$init();
      if (HaystackFuncs.#cannotSerialze === undefined) HaystackFuncs.#cannotSerialze = null;
    }
    return HaystackFuncs.#cannotSerialze;
  }

  static haystackPing(conn) {
    return hxConn.ConnFwFuncs.connPing(conn);
  }

  static haystackLearn(conn,arg) {
    if (arg === undefined) arg = null;
    return sys.ObjUtil.coerce(hxConn.ConnFwFuncs.connLearn(conn, arg).get(sys.Duration.fromStr("1min")), haystack.Grid.type$);
  }

  static haystackSyncCur(points) {
    return hxConn.ConnFwFuncs.connSyncCur(points);
  }

  static haystackSyncHis(points,span) {
    if (span === undefined) span = null;
    return hxConn.ConnFwFuncs.connSyncHis(points, span);
  }

  static haystackCall(conn,op,req,checked) {
    if (req === undefined) req = null;
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(HaystackFuncs.dispatch(HaystackFuncs.curContext(), conn, hx.HxMsg.make3("call", op, haystack.Etc.toGrid(req).toConst(), sys.ObjUtil.coerce(checked, sys.Obj.type$.toNullable()))), haystack.Grid.type$);
  }

  static haystackReadById(conn,id,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(HaystackFuncs.dispatch(HaystackFuncs.curContext(), conn, hx.HxMsg.make2("readById", id, sys.ObjUtil.coerce(checked, sys.Obj.type$.toNullable()))), haystack.Dict.type$.toNullable());
  }

  static haystackReadByIds(conn,ids,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(HaystackFuncs.dispatch(HaystackFuncs.curContext(), conn, hx.HxMsg.make2("readByIds", ids, sys.ObjUtil.coerce(checked, sys.Obj.type$.toNullable()))), haystack.Grid.type$);
  }

  static haystackRead(conn,filterExpr,checked) {
    if (checked === undefined) checked = axon.Literal.trueVal();
    let cx = HaystackFuncs.curContext();
    let c = conn.eval(cx);
    let filter = filterExpr.evalToFilter(cx);
    let check = checked.eval(cx);
    return sys.ObjUtil.coerce(HaystackFuncs.dispatch(cx, sys.ObjUtil.coerce(c, sys.Obj.type$), hx.HxMsg.make2("read", filter.toStr(), check)), haystack.Dict.type$.toNullable());
  }

  static haystackReadAll(conn,filterExpr) {
    let cx = HaystackFuncs.curContext();
    let c = conn.eval(cx);
    let filter = filterExpr.evalToFilter(cx);
    return sys.ObjUtil.coerce(HaystackFuncs.dispatch(cx, sys.ObjUtil.coerce(c, sys.Obj.type$), hx.HxMsg.make1("readAll", filter.toStr())), haystack.Grid.type$);
  }

  static haystackHisRead(conn,id,range) {
    return sys.ObjUtil.coerce(HaystackFuncs.dispatch(HaystackFuncs.curContext(), conn, hx.HxMsg.make2("hisRead", haystack.Etc.toId(id), HaystackFuncs.toHisRange(range))), haystack.Grid.type$);
  }

  static haystackInvokeAction(conn,id,action,args) {
    if (args === undefined) args = null;
    return HaystackFuncs.dispatch(HaystackFuncs.curContext(), conn, hx.HxMsg.make3("invokeAction", id, action, ((this$) => { let $_u25 = args; if ($_u25 != null) return $_u25; return haystack.Etc.emptyDict(); })(this)));
  }

  static haystackEval(conn,expr,opts) {
    if (opts === undefined) opts = axon.Literal.nullVal();
    const this$ = this;
    let cx = HaystackFuncs.curContext();
    let c = conn.eval(cx);
    let options = ((this$) => { let $_u26 = sys.ObjUtil.as(opts.eval(cx), haystack.Dict.type$); if ($_u26 != null) return $_u26; return haystack.Etc.emptyDict(); })(this);
    let exprStr = expr.toStr();
    let sb = sys.StrBuf.make();
    sb.add("do\n");
    let vars = cx.varsInScope();
    vars.each((v,n) => {
      if (!HaystackFuncs.varInExpr(exprStr, n)) {
        return;
      }
      ;
      let ser = HaystackFuncs.serializeVar(cx, v);
      if (ser === HaystackFuncs.cannotSerialze()) {
        sb.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  // ", n), ": cannot serialize "), sys.ObjUtil.typeof(v)), "\n"));
      }
      else {
        sb.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", n), ": "), ser), "\n"));
      }
      ;
      return;
    });
    sb.add("  ").add(exprStr).add("\n");
    sb.add("end\n");
    let s = sb.toStr();
    if (options.has("debug")) {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("### haystackEval(", conn), ")"));
      sys.ObjUtil.echo(s);
    }
    ;
    return HaystackFuncs.dispatch(cx, sys.ObjUtil.coerce(c, sys.Obj.type$), hx.HxMsg.make2("eval", s, options));
  }

  static varInExpr(expr,var$) {
    let i = sys.Str.index(expr, var$);
    if (i == null) {
      return false;
    }
    ;
    if ((sys.ObjUtil.compareGT(i, 0) && sys.Int.isAlphaNum(sys.Str.get(expr, sys.Int.minus(sys.ObjUtil.coerce(i, sys.Int.type$), 1))))) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareLT(sys.Int.plus(sys.ObjUtil.coerce(i, sys.Int.type$), sys.Str.size(var$)), sys.Str.size(expr))) {
      let after = sys.Str.get(expr, sys.Int.plus(sys.ObjUtil.coerce(i, sys.Int.type$), sys.Str.size(var$)));
      if ((sys.Int.isAlphaNum(after) || sys.ObjUtil.equals(after, 40))) {
        return false;
      }
      ;
    }
    ;
    return true;
  }

  static serializeVar(cx,val) {
    try {
      if (val == null) {
        return "null";
      }
      ;
      if ((sys.ObjUtil.is(val, axon.Fn.type$) && sys.ObjUtil.equals(sys.ObjUtil.coerce(val, axon.Fn.type$).requiredArity(), 0))) {
        return HaystackFuncs.serializeVar(cx, sys.ObjUtil.coerce(val, axon.Fn.type$).call(cx, sys.List.make(sys.Obj.type$.toNullable())));
      }
      ;
      if (sys.ObjUtil.is(val, haystack.DateSpan.type$)) {
        return sys.ObjUtil.coerce(val, haystack.DateSpan.type$).toCode();
      }
      ;
      if (sys.ObjUtil.is(val, sys.Bool.type$)) {
        return sys.ObjUtil.toStr(val);
      }
      ;
      if (sys.ObjUtil.is(val, haystack.Number.type$)) {
        return sys.ObjUtil.toStr(val);
      }
      ;
      if (sys.ObjUtil.is(val, sys.Str.type$)) {
        return sys.Str.toCode(sys.ObjUtil.coerce(val, sys.Str.type$));
      }
      ;
      if (sys.ObjUtil.is(val, sys.Uri.type$)) {
        return sys.ObjUtil.coerce(val, sys.Uri.type$).toCode();
      }
      ;
      if (sys.ObjUtil.is(val, sys.Date.type$)) {
        return sys.ObjUtil.toStr(val);
      }
      ;
      if (sys.ObjUtil.is(val, sys.Time.type$)) {
        return sys.ObjUtil.toStr(val);
      }
      ;
    }
    catch ($_u27) {
      $_u27 = sys.Err.make($_u27);
      if ($_u27 instanceof sys.Err) {
        let e = $_u27;
        ;
      }
      else {
        throw $_u27;
      }
    }
    ;
    return HaystackFuncs.cannotSerialze();
  }

  static toHisRange(range) {
    if (range == null) {
      return "today";
    }
    ;
    if (sys.ObjUtil.is(range, sys.Str.type$)) {
      return sys.ObjUtil.coerce(range, sys.Str.type$);
    }
    ;
    let dates = axon.CoreLib.toDateSpan(range);
    if (sys.ObjUtil.equals(dates.numDays(), 1)) {
      return dates.start().toStr();
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", dates.start()), ","), dates.end());
  }

  static dispatch(cx,conn,msg) {
    let lib = sys.ObjUtil.coerce(cx.rt().lib("haystack"), HaystackLib.type$);
    let r = lib.conn(haystack.Etc.toId(conn)).sendSync(msg);
    return r;
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static make() {
    const $self = new HaystackFuncs();
    HaystackFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    HaystackFuncs.#cannotSerialze = "_no_ser_";
    return;
  }

}

class HaystackConnTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HaystackConnTest.type$; }

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

  #ptw = null;

  ptw(it) {
    if (it === undefined) {
      return this.#ptw;
    }
    else {
      this.#ptw = it;
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
    this.init();
    this.verifyConn();
    this.verifyCall();
    this.verifyReads();
    this.verifyWatches();
    this.verifyPointWrite();
    this.verifyReadHis();
    this.verifySyncHis();
    this.verifyInvokeAction();
    this.verifyHaystackEval();
    return;
  }

  init() {
    const this$ = this;
    if (this.rt().platform().isSkySpark()) {
      this.addLib("his");
    }
    else {
      this.addLib("http");
    }
    ;
    this.addLib("task");
    this.addLib("haystack");
    this.addUser("hay", "foo", sys.Map.__fromLiteral(["userRole"], ["admin"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.#recA = this.addRec(sys.Map.__fromLiteral(["dis","i","f","s","d","t","m1","m2"], ["Rec A",haystack.HaystackTest.n(sys.ObjUtil.coerce(45, sys.Num.type$.toNullable())),haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(-33.0), sys.Num.type$.toNullable()), "m"),"55\u00b0",sys.Date.fromStr("2010-05-17"),sys.Time.fromStr("16:30:00"),haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.#recB = this.addRec(sys.Map.__fromLiteral(["dis","name","a"], ["Rec B","b",this.#recA.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let s = this.addRec(sys.Map.__fromLiteral(["dis","site"], ["Site",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let e = this.addRec(sys.Map.__fromLiteral(["navMacro","navName","equip","siteRef"], ["\$siteRef \$navName","Equip",haystack.HaystackTest.m(),s.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.#pt1 = this.addRec(sys.Map.__fromLiteral(["dis","name","point","kind"], ["Point-1","pt1",haystack.HaystackTest.m(),"Bool"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.#pt2 = this.addRec(sys.Map.__fromLiteral(["dis","name","point","kind","room"], ["Point-2","pt2",haystack.HaystackTest.m(),"Number","215"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.#pt3 = this.addRec(sys.Map.__fromLiteral(["dis","point","kind","siteRef","equipRef"], ["Point-3",haystack.HaystackTest.m(),"Number",s.id(),e.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.#pt1 = this.commit(sys.ObjUtil.coerce(this.#pt1, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")), folio.Diff.transient());
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(75.0), sys.Num.type$.toNullable()), "fahrenheit")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    this.#pt3 = this.commit(sys.ObjUtil.coerce(this.#pt3, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(30, sys.Num.type$.toNullable()), "kW")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    let tz = sys.TimeZone.fromStr("Chicago");
    let h = this.addRec(sys.Map.__fromLiteral(["his","point","kind","tz","dis","foo","unit"], [haystack.HaystackTest.m(),haystack.HaystackTest.m(),"Number",tz.name(),"Num His","bar","fahrenheit"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.#hisF = this.readById(h.id());
    let items = sys.List.make(haystack.HisItem.type$);
    sys.Range.make(1, 4).each((mon) => {
      sys.Range.make(1, 28).each((day) => {
        items.add(HaystackConnTest.item(HaystackConnTest.dt(2010, mon, day, 12, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.mult(mon, day), sys.Num.type$)), sys.Obj.type$.toNullable())));
        return;
      });
      return;
    });
    this.rt().his().write(h, items);
    (tz = sys.TimeZone.fromStr("Denver"));
    (h = this.addRec(sys.Map.__fromLiteral(["his","kind","tz","dis","point","val"], [haystack.HaystackTest.m(),"Bool",tz.name(),"Bool His",haystack.HaystackTest.m(),sys.ObjUtil.coerce(true, sys.Obj.type$)], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))));
    this.#hisB = this.readById(h.id());
    (items = sys.List.make(haystack.HisItem.type$));
    sys.Range.make(1, 4).each((mon) => {
      sys.Range.make(1, 28).each((day) => {
        items.add(HaystackConnTest.item(HaystackConnTest.dt(2010, mon, day, 12, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Int.isOdd(sys.Int.mult(mon, day)), sys.Obj.type$.toNullable())));
        return;
      });
      return;
    });
    this.rt().his().write(h, items);
    this.#ptw = this.addRec(sys.Map.__fromLiteral(["dis","name","point","writable","kind","unit"], ["Point-W","ptw",haystack.HaystackTest.m(),haystack.HaystackTest.m(),"Number","%"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    return;
  }

  verifyConn() {
    let uri = this.rt().http().siteUri().plus(this.rt().http().apiUri());
    this.#conn = this.addRec(sys.Map.__fromLiteral(["haystackConn","uri","username","haystackPollFreq"], [haystack.Marker.val(),uri,"hay",haystack.HaystackTest.n(sys.ObjUtil.coerce(10, sys.Num.type$.toNullable()), "ms")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.rt().db().passwords().set(this.#conn.id().toStr(), "foo");
    this.rt().sync();
    let r = sys.ObjUtil.as(this.eval("read(haystackConn).haystackPing.futureGet"), haystack.Dict.type$);
    this.verifyEq(r.id(), this.#conn.id());
    this.verifyEq(r.trap("productName", sys.List.make(sys.Obj.type$.toNullable(), [])), this.rt().platform().productName());
    this.#conn = this.readById(this.#conn.id());
    this.verifyEq(this.#conn.trap("connStatus", sys.List.make(sys.Obj.type$.toNullable(), [])), "ok");
    this.verifyEq(this.#conn.trap("productName", sys.List.make(sys.Obj.type$.toNullable(), [])), this.rt().platform().productName());
    this.verifyEq(this.#conn.trap("productVersion", sys.List.make(sys.Obj.type$.toNullable(), [])), this.rt().version().toStr());
    this.verifyEq(this.#conn.trap("vendorName", sys.List.make(sys.Obj.type$.toNullable(), [])), this.rt().platform().vendorName());
    this.verifyEq(this.#conn.trap("tz", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.TimeZone.cur().name());
    this.eval(sys.Str.plus(sys.Str.plus("haystackPing(", this.#conn.id().toCode()), ")"));
    return;
  }

  verifyCall() {
    const this$ = this;
    let grid = sys.ObjUtil.coerce(this.eval("read(haystackConn).haystackCall(\"ops\")"), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(grid.colNames().contains("def"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    let r = grid.find((r) => {
      return sys.ObjUtil.equals(sys.ObjUtil.toStr(r.trap("def", sys.List.make(sys.Obj.type$.toNullable(), []))), "op:about");
    });
    this.verifyNotNull(r);
    return;
  }

  verifyReads() {
    let x = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("read(haystackConn).haystackReadById(", this.#recA.id().toCode()), ")")), haystack.Dict.type$.toNullable());
    this.verifyEq(x.trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Rec A");
    this.verifyEq(x.trap("i", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(45.0), sys.Num.type$.toNullable())));
    this.verifyEq(x.trap("f", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(-33.0), sys.Num.type$.toNullable()), "m"));
    this.verifyEq(x.trap("s", sys.List.make(sys.Obj.type$.toNullable(), [])), "55\u00b0");
    this.verifyEq(x.trap("d", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Date.fromStr("2010-05-17"));
    this.verifyEq(x.trap("t", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Time.fromStr("16:30:00"));
    this.verifyEq(x.trap("m1", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Marker.val());
    this.verifyNull(this.eval("read(haystackConn).haystackReadById(@badId, false)"));
    this.verifyEvalErr("read(haystackConn).haystackReadById(@badId)", haystack.UnknownRecErr.type$);
    this.verifyEvalErr("read(haystackConn).haystackReadById(@badId, true)", haystack.UnknownRecErr.type$);
    let grid = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("read(haystackConn).haystackReadByIds([", this.#recA.id().toCode()), ", "), this.#recB.id().toCode()), "])")), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(grid.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(grid.get(0).trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Rec A");
    this.verifyEq(grid.get(1).trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Rec B");
    (grid = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("read(haystackConn).haystackReadByIds([@badId2, ", this.#recA.id().toCode()), ", @badId], false)")), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(grid.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(grid.get(0).get("id"), null);
    this.verifyEq(grid.get(1).get("id"), this.#recA.id());
    this.verifyEq(grid.get(2).get("id"), null);
    this.verifyEvalErr(sys.Str.plus(sys.Str.plus("read(haystackConn).haystackReadByIds([", this.#recA.id().toCode()), ", @badId])"), haystack.UnknownRecErr.type$);
    this.verifyEvalErr(sys.Str.plus(sys.Str.plus("read(haystackConn).haystackReadByIds([", this.#recA.id().toCode()), ", @badId], true)"), haystack.UnknownRecErr.type$);
    (x = sys.ObjUtil.coerce(this.eval("read(haystackConn).haystackRead(dis==\"Rec B\")"), haystack.Dict.type$.toNullable()));
    this.verifyEq(x.trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Rec B");
    this.verifyEq(x.trap("a", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#recA.id());
    this.verifyNull(this.eval("read(haystackConn).haystackRead(dis==\"bad\", false)"));
    this.verifyEvalErr("read(haystackConn).haystackRead(dis==\"bad\")", haystack.UnknownRecErr.type$);
    this.verifyEvalErr("read(haystackConn).haystackRead(dis==\"bad\", true)", haystack.UnknownRecErr.type$);
    (grid = sys.ObjUtil.coerce(this.eval("read(haystackConn).haystackReadAll(point)"), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(grid.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()));
    (grid = grid.sortCol("dis"));
    this.verifyEq(grid.get(0).trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Bool His");
    this.verifyEq(grid.get(1).trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Num His");
    this.verifyEq(grid.get(2).trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Point-1");
    this.verifyEq(grid.get(3).trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Point-2");
    this.verifyEq(grid.get(4).trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Point-3");
    this.verifyEq(grid.get(5).trap("dis", sys.List.make(sys.Obj.type$.toNullable(), [])), "Point-W");
    return;
  }

  verifyWatches() {
    const this$ = this;
    let badRef = this.genRef();
    let proxy1 = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","his","point","unit","kind"], ["Proxy-1",this.#conn.id(),this.#pt1.id().toStr(),haystack.Marker.val(),haystack.Marker.val(),"fahrenheit","Bool"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let proxy2 = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","his","point","unit","kind"], ["Proxy-2",this.#conn.id(),this.#pt2.id().toStr(),haystack.Marker.val(),haystack.Marker.val(),"fahrenheit","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let proxy3 = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","his","curConvert","point","unit","kind"], ["Proxy-3",this.#conn.id(),this.#pt3.id().toStr(),haystack.Marker.val(),"kW=>W",haystack.Marker.val(),"W","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let proxy3dup = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","his","point","unit","kind"], ["Proxy-3-Dup",this.#conn.id(),this.#pt3.id().toStr(),haystack.Marker.val(),haystack.Marker.val(),"kW","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let proxy3dup2 = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","his","point","unit","kind"], ["Proxy-3-Dup2",this.#conn.id(),this.#pt3.id().toStr(),haystack.Marker.val(),haystack.Marker.val(),"kW","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let proxyE1 = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","his","point","unit","kind"], ["Proxy-E1",this.#conn.id(),haystack.Ref.fromStr("bad"),haystack.Marker.val(),haystack.Marker.val(),"fahrenheit","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let proxyE2 = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","his","point","unit","kind"], ["Proxy-E2",this.#conn.id(),badRef.toStr(),haystack.Marker.val(),haystack.Marker.val(),"fahrenheit","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let proxyE3 = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","his","point","unit","kind"], ["Proxy-E3",this.#conn.id(),this.#pt2.id().toStr(),haystack.Marker.val(),haystack.Marker.val(),"kW","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.rt().sync();
    this.eval("readAll(haystackCur).haystackSyncCur");
    this.syncConn();
    this.verifyCur(proxy1, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyCur(proxy2, haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(75.0), sys.Num.type$.toNullable()), "fahrenheit"));
    this.verifyCur(proxy3, haystack.HaystackTest.n(sys.ObjUtil.coerce(30000, sys.Num.type$.toNullable()), "W"));
    this.verifyCur(proxy3dup, haystack.HaystackTest.n(sys.ObjUtil.coerce(30, sys.Num.type$.toNullable()), "kW"));
    this.verifyCur(proxy3dup2, haystack.HaystackTest.n(sys.ObjUtil.coerce(30, sys.Num.type$.toNullable()), "kW"));
    this.verifyCur(proxyE1, null, "fault", "Invalid type for 'haystackCur' [Ref != Str]");
    this.verifyCur(proxyE2, null, "fault", "haystack::UnknownRecErr");
    this.verifyCur(proxyE3, null, "fault", "sys::Err: point unit != updateCurOk unit: kW != \u00b0F");
    let watches = this.rt().watch().list();
    this.verifyEq(sys.ObjUtil.coerce(watches.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(watches.first().list().dup().sort(), sys.List.make(haystack.Ref.type$, [this.#pt1.id(), this.#pt2.id(), this.#pt3.id(), sys.ObjUtil.coerce(haystack.Ref.fromStr(sys.ObjUtil.coerce(proxyE2.trap("haystackCur", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)), haystack.Ref.type$)]).sort());
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(88.0), sys.Num.type$.toNullable()), "fahrenheit")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    this.eval(sys.Str.plus(sys.Str.plus("haystackSyncCur(", proxy2.id().toCode()), ")"));
    this.syncConn();
    this.verifyCur(proxy2, haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(88.0), sys.Num.type$.toNullable()), "fahrenheit"), "ok");
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().list().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.rt().watch().list().each((w) => {
      w.close();
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(this.rt().watch().list().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.resetCur(proxy1);
    this.resetCur(proxy2);
    this.resetCur(proxy3);
    this.resetCur(proxy3dup);
    this.resetCur(proxy3dup2);
    this.resetCur(proxyE1);
    this.resetCur(proxyE2);
    let clientWatch = this.rt().watch().open("test");
    clientWatch.addAll(sys.List.make(haystack.Ref.type$, [proxy1.id(), proxyE1.id(), proxyE2.id()]));
    concurrent.Actor.sleep(sys.Duration.fromStr("100ms"));
    this.syncConn();
    (watches = this.rt().watch().list());
    this.verifyEq(sys.ObjUtil.coerce(watches.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    let serverWatch = watches.find((x) => {
      return x !== clientWatch;
    });
    this.verifyEq(serverWatch.list().dup().sort(), sys.List.make(haystack.Ref.type$, [this.#pt1.id(), badRef]).sort());
    clientWatch.addAll(sys.List.make(haystack.Ref.type$, [proxy2.id(), proxy3.id(), proxy3dup.id()]));
    concurrent.Actor.sleep(sys.Duration.fromStr("100ms"));
    this.syncConn();
    this.verifyEq(serverWatch.list().dup().sort(), sys.List.make(haystack.Ref.type$, [badRef, this.#pt1.id(), this.#pt2.id(), this.#pt3.id()]).sort());
    this.#pt1 = this.commit(sys.ObjUtil.coerce(this.#pt1, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")), folio.Diff.transient());
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(99.0), sys.Num.type$.toNullable()), "fahrenheit")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    this.#pt3 = this.commit(sys.ObjUtil.coerce(this.#pt3, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(40.0), sys.Num.type$.toNullable()), "kW")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    concurrent.Actor.sleep(sys.Duration.fromStr("100ms"));
    this.syncConn();
    this.verifyCur(proxy1, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyCur(proxy2, haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(99.0), sys.Num.type$.toNullable()), "fahrenheit"));
    this.verifyCur(proxy3, haystack.HaystackTest.n(sys.ObjUtil.coerce(40000, sys.Num.type$.toNullable()), "W"));
    this.verifyCur(proxy3dup, haystack.HaystackTest.n(sys.ObjUtil.coerce(40, sys.Num.type$.toNullable()), "kW"));
    this.verifyCur(proxyE1, null, "fault", "Invalid type for 'haystackCur' [Ref != Str]");
    this.verifyCur(proxyE2, null, "fault", "haystack::UnknownRecErr");
    clientWatch.addAll(sys.List.make(haystack.Ref.type$, [proxy3dup2.id()]));
    concurrent.Actor.sleep(sys.Duration.fromStr("100ms"));
    this.syncConn();
    this.#pt1 = this.commit(sys.ObjUtil.coerce(this.#pt1, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")), folio.Diff.transient());
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(sys.Float.make(1972.0), sys.Num.type$.toNullable()), "fahrenheit")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    this.#pt3 = this.commit(sys.ObjUtil.coerce(this.#pt3, haystack.Dict.type$), sys.Map.__fromLiteral(["curVal"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(50, sys.Num.type$.toNullable()), "kW")], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")), folio.Diff.transient());
    concurrent.Actor.sleep(sys.Duration.fromStr("150ms"));
    this.syncConn();
    this.verifyCur(proxy1, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyCur(proxy2, haystack.HaystackTest.n(sys.ObjUtil.coerce(1972, sys.Num.type$.toNullable()), "fahrenheit"));
    this.verifyCur(proxy3, haystack.HaystackTest.n(sys.ObjUtil.coerce(50000, sys.Num.type$.toNullable()), "W"));
    this.verifyCur(proxy3dup, haystack.HaystackTest.n(sys.ObjUtil.coerce(50, sys.Num.type$.toNullable()), "kW"));
    this.verifyCur(proxy3dup2, haystack.HaystackTest.n(sys.ObjUtil.coerce(50, sys.Num.type$.toNullable()), "kW"));
    this.#pt1 = this.commit(sys.ObjUtil.coerce(this.#pt1, haystack.Dict.type$), sys.Map.__fromLiteral(["curStatus","curVal"], ["ok",sys.ObjUtil.coerce(true, sys.Obj.type$)], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), folio.Diff.transient());
    this.#pt2 = this.commit(sys.ObjUtil.coerce(this.#pt2, haystack.Dict.type$), sys.Map.__fromLiteral(["curStatus"], ["down"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), folio.Diff.transient());
    this.#pt3 = this.commit(sys.ObjUtil.coerce(this.#pt3, haystack.Dict.type$), sys.Map.__fromLiteral(["curStatus"], ["remoteFault"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), folio.Diff.transient());
    concurrent.Actor.sleep(sys.Duration.fromStr("500ms"));
    this.verifyCur(proxy1, sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), "ok");
    this.verifyCur(proxy2, null, "remoteDown", "Remote status err: down");
    this.verifyCur(proxy3, null, "remoteFault", "Remote status err: remoteFault");
    this.verifyCur(proxy3dup, null, "remoteFault", "Remote status err: remoteFault");
    clientWatch.remove(proxy2.id());
    concurrent.Actor.sleep(sys.Duration.fromStr("100ms"));
    this.verifyEq(serverWatch.list().dup().sort(), sys.List.make(haystack.Ref.type$, [badRef, this.#pt1.id(), this.#pt3.id()]).sort());
    clientWatch.close();
    concurrent.Actor.sleep(sys.Duration.fromStr("100ms"));
    this.syncConn();
    this.verifyEq(sys.ObjUtil.coerce(serverWatch.isClosed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return;
  }

  verifyCur(r,val,status,err) {
    if (status === undefined) status = "ok";
    if (err === undefined) err = null;
    (r = sys.ObjUtil.coerce(this.readById(r.id()), haystack.Dict.type$));
    this.verifyEq(r.get("curVal"), val);
    this.verifyEq(r.get("curStatus"), status);
    this.verifyEq(r.get("curErr"), err);
    return;
  }

  resetCur(r) {
    return;
  }

  verifyPointWrite() {
    let bad1 = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","haystackWrite","writable","point","unit","kind"], ["ProxyW",this.#conn.id(),this.#ptw.id().toStr(),this.#ptw.id(),haystack.Marker.val(),haystack.Marker.val(),"%","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let bad2 = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","haystackWrite","writable","point","unit","kind"], ["ProxyW",this.#conn.id(),this.#ptw.id().toStr(),this.#ptw.id().toStr(),haystack.Marker.val(),haystack.Marker.val(),"%","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let bad3 = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","haystackWrite","haystackWriteLevel","writable","point","unit","kind"], ["ProxyW",this.#conn.id(),this.#ptw.id().toStr(),this.#ptw.id().toStr(),haystack.HaystackTest.n(sys.ObjUtil.coerce(18, sys.Num.type$.toNullable())),haystack.Marker.val(),haystack.Marker.val(),"%","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let bad4 = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","haystackWrite","haystackWriteLevel","writable","point","unit","kind"], ["ProxyW",this.#conn.id(),this.#ptw.id().toStr(),"badone",haystack.HaystackTest.n(sys.ObjUtil.coerce(15, sys.Num.type$.toNullable())),haystack.Marker.val(),haystack.Marker.val(),"%","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    let proxy = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackCur","haystackWrite","haystackWriteLevel","writable","point","unit","kind"], ["ProxyW",this.#conn.id(),this.#ptw.id().toStr(),this.#ptw.id().toStr(),haystack.HaystackTest.n(sys.ObjUtil.coerce(15, sys.Num.type$.toNullable())),haystack.Marker.val(),haystack.Marker.val(),"%","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    while (!this.rt().isSteadyState()) {
      concurrent.Actor.sleep(sys.Duration.fromStr("10ms"));
    }
    ;
    this.eval(sys.Str.plus(sys.Str.plus("pointOverride(", bad1.id().toCode()), ",  1)"));
    this.eval(sys.Str.plus(sys.Str.plus("pointOverride(", bad2.id().toCode()), ",  2)"));
    this.eval(sys.Str.plus(sys.Str.plus("pointOverride(", bad3.id().toCode()), ",  3)"));
    this.eval(sys.Str.plus(sys.Str.plus("pointOverride(", bad4.id().toCode()), ",  3)"));
    this.eval(sys.Str.plus(sys.Str.plus("pointOverride(", proxy.id().toCode()), ", 99)"));
    this.syncConn();
    (bad1 = sys.ObjUtil.coerce(this.readById(bad1.id()), haystack.Dict.type$));
    this.verifyEq(bad1.get("writeStatus"), "fault");
    this.verifyEq(bad1.get("writeErr"), "Invalid type for 'haystackWrite' [Ref != Str]");
    (bad2 = sys.ObjUtil.coerce(this.readById(bad2.id()), haystack.Dict.type$));
    this.verifyEq(bad2.get("writeStatus"), "fault");
    this.verifyEq(bad2.get("writeErr"), "missing haystackWriteLevel");
    (bad3 = sys.ObjUtil.coerce(this.readById(bad3.id()), haystack.Dict.type$));
    this.verifyEq(bad3.get("writeStatus"), "fault");
    this.verifyEq(bad3.get("writeErr"), "haystackWriteLevel is not 1-17: 18");
    (bad4 = sys.ObjUtil.coerce(this.readById(bad4.id()), haystack.Dict.type$));
    this.verifyEq(bad4.get("writeStatus"), "fault");
    this.verifyEq(bad4.get("writeErr"), sys.Str.plus("haystack::CallErr: haystack::UnknownRecErr: ", bad4.trap("haystackWrite", sys.List.make(sys.Obj.type$.toNullable(), []))));
    (proxy = sys.ObjUtil.coerce(this.readById(proxy.id()), haystack.Dict.type$));
    this.verifyEq(proxy.get("writeStatus"), "ok");
    this.verifyEq(proxy.get("writeErr"), null);
    this.verifyEq(proxy.get("writeVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(99, sys.Num.type$.toNullable())));
    this.verifyEq(proxy.get("writeLevel"), haystack.HaystackTest.n(sys.ObjUtil.coerce(8, sys.Num.type$.toNullable())));
    this.#ptw = this.readById(this.#ptw.id());
    this.verifyEq(this.#ptw.get("writeStatus"), null);
    this.verifyEq(this.#ptw.get("writeLevel"), haystack.HaystackTest.n(sys.ObjUtil.coerce(15, sys.Num.type$.toNullable())));
    this.verifyEq(this.#ptw.get("writeVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(99, sys.Num.type$.toNullable())));
    let array = this.evalToGrid(sys.Str.plus(sys.Str.plus("pointWriteArray(", this.#ptw.id().toCode()), ")"));
    this.verifyEq(array.get(14).get("level"), haystack.HaystackTest.n(sys.ObjUtil.coerce(15, sys.Num.type$.toNullable())));
    this.verifyEq(array.get(14).get("val"), haystack.HaystackTest.n(sys.ObjUtil.coerce(99, sys.Num.type$.toNullable())));
    this.verifyEq(array.get(15).get("level"), haystack.HaystackTest.n(sys.ObjUtil.coerce(16, sys.Num.type$.toNullable())));
    this.verifyEq(array.get(15).get("val"), null);
    this.verifyEq(array.get(14).get("who"), "Haystack.pointWrite | test :: ProxyW");
    (proxy = sys.ObjUtil.coerce(this.commit(proxy, sys.Map.__fromLiteral(["haystackWriteLevel"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(16, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?"))), haystack.Dict.type$));
    this.eval(sys.Str.plus(sys.Str.plus("pointOverride(", proxy.id().toCode()), ", 321)"));
    this.syncConn();
    (proxy = sys.ObjUtil.coerce(this.readById(proxy.id()), haystack.Dict.type$));
    this.verifyEq(proxy.get("writeStatus"), "ok");
    this.verifyEq(proxy.get("writeErr"), null);
    this.verifyEq(proxy.get("writeVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(321, sys.Num.type$.toNullable())));
    this.verifyEq(proxy.get("writeLevel"), haystack.HaystackTest.n(sys.ObjUtil.coerce(8, sys.Num.type$.toNullable())));
    this.#ptw = this.readById(this.#ptw.id());
    this.verifyEq(this.#ptw.get("writeStatus"), null);
    this.verifyEq(this.#ptw.get("writeLevel"), haystack.HaystackTest.n(sys.ObjUtil.coerce(16, sys.Num.type$.toNullable())));
    this.verifyEq(this.#ptw.get("writeVal"), haystack.HaystackTest.n(sys.ObjUtil.coerce(321, sys.Num.type$.toNullable())));
    (array = this.evalToGrid(sys.Str.plus(sys.Str.plus("pointWriteArray(", this.#ptw.id().toCode()), ")")));
    this.verifyEq(array.get(14).get("level"), haystack.HaystackTest.n(sys.ObjUtil.coerce(15, sys.Num.type$.toNullable())));
    this.verifyEq(array.get(14).get("val"), null);
    this.verifyEq(array.get(15).get("level"), haystack.HaystackTest.n(sys.ObjUtil.coerce(16, sys.Num.type$.toNullable())));
    this.verifyEq(array.get(15).get("val"), haystack.HaystackTest.n(sys.ObjUtil.coerce(321, sys.Num.type$.toNullable())));
    return;
  }

  verifyReadHis() {
    this.doVerifyReadHis(sys.ObjUtil.coerce(this.#hisF, haystack.Dict.type$), "2010-03-01");
    this.doVerifyReadHis(sys.ObjUtil.coerce(this.#hisF, haystack.Dict.type$), "2010-02-23..2010-03-04");
    return;
  }

  doVerifyReadHis(rec,range) {
    const this$ = this;
    let actual = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("read(haystackConn).haystackHisRead(", rec.id().toCode()), ", "), range), ")")), haystack.Grid.type$);
    let expected = this.readHisToGrid(rec, range);
    this.verifyEq(sys.ObjUtil.coerce(actual.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    this.verifyEq(actual.meta().get("hisStart"), expected.meta().get("hisStart"));
    this.verifyEq(actual.meta().get("hisEnd"), expected.meta().get("hisEnd"));
    expected.each((e,i) => {
      let a = actual.get(i);
      this$.verifyEq(e.trap("ts", sys.List.make(sys.Obj.type$.toNullable(), [])), a.trap("ts", sys.List.make(sys.Obj.type$.toNullable(), [])));
      this$.verifyEq(e.trap("val", sys.List.make(sys.Obj.type$.toNullable(), [])), a.trap("val", sys.List.make(sys.Obj.type$.toNullable(), [])));
      return;
    });
    return;
  }

  readHisToGrid(rec,range) {
    const this$ = this;
    let span = this.rangeToSpan(rec, range);
    let items = sys.List.make(haystack.HisItem.type$);
    this.rt().his().read(rec, span, null, (item) => {
      if (span.contains(item.ts())) {
        items.add(item);
      }
      ;
      return;
    });
    let grid = haystack.Etc.makeDictsGrid(sys.Map.__fromLiteral(["hisStart","hisEnd"], [span.start(),span.end()], sys.Type.find("sys::Str"), sys.Type.find("sys::DateTime")), items);
    return grid;
  }

  rangeToSpan(rec,range) {
    let tz = sys.TimeZone.fromStr(sys.ObjUtil.toStr(rec.trap("tz", sys.List.make(sys.Obj.type$.toNullable(), []))));
    let dots = sys.Str.index(range, "..");
    if (dots == null) {
      return haystack.DateSpan.make(sys.ObjUtil.coerce(sys.Date.fromStr(range), sys.Date.type$)).toSpan(sys.ObjUtil.coerce(tz, sys.TimeZone.type$));
    }
    else {
      return haystack.DateSpan.make(sys.ObjUtil.coerce(sys.Date.fromStr(sys.Str.getRange(range, sys.Range.make(0, sys.ObjUtil.coerce(dots, sys.Int.type$), true))), sys.Date.type$), sys.ObjUtil.coerce(sys.Date.fromStr(sys.Str.getRange(range, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(dots, sys.Int.type$), 2), -1))), sys.Obj.type$)).toSpan(sys.ObjUtil.coerce(tz, sys.TimeZone.type$));
    }
    ;
  }

  verifySyncHis() {
    const this$ = this;
    this.#hisSyncF = this.addRec(sys.Map.__fromLiteral(["dis","haystackConnRef","haystackHis","his","tz","point","unit","kind"], ["Test Proxy",this.#conn.id(),this.#hisF.id().toStr(),haystack.Marker.val(),"Chicago",haystack.Marker.val(),"fahrenheit","Number"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.eval(sys.Str.plus(sys.Str.plus("readById(", this.#hisSyncF.id().toCode()), ").haystackSyncHis(2010)"));
    this.syncConn();
    this.#hisSyncF = this.readById(this.#hisSyncF.id());
    this.#hisF = this.readById(this.#hisF.id());
    this.verifyEq(this.#hisSyncF.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#hisF.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(this.#hisSyncF.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#hisF.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(this.#hisSyncF.trap("hisEnd", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#hisF.trap("hisEnd", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(this.#hisSyncF.get("hisStatus"), "ok");
    this.verifyEq(this.#hisSyncF.get("hisErr"), null);
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
    this.rt().his().write(sys.ObjUtil.coerce(this.#hisF, haystack.Dict.type$), sys.List.make(haystack.HisItem.type$, [HaystackConnTest.item(HaystackConnTest.dt(2010, 5, 1, 1, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(110.0), sys.Obj.type$.toNullable())), HaystackConnTest.item(HaystackConnTest.dt(2010, 5, 1, 2, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(120.0), sys.Obj.type$.toNullable())), HaystackConnTest.item(HaystackConnTest.dt(2010, 5, 1, 3, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(130.0), sys.Obj.type$.toNullable())), HaystackConnTest.item(HaystackConnTest.dt(2010, 5, 1, 4, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(140.0), sys.Obj.type$.toNullable())), HaystackConnTest.item(HaystackConnTest.dt(2010, 5, 1, 5, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(150.0), sys.Obj.type$.toNullable())), HaystackConnTest.item(HaystackConnTest.dt(2010, 5, 2, 1, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(210.0), sys.Obj.type$.toNullable())), HaystackConnTest.item(HaystackConnTest.dt(2010, 5, 2, 2, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(220.0), sys.Obj.type$.toNullable())), HaystackConnTest.item(HaystackConnTest.dt(2010, 5, 2, 3, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)), sys.ObjUtil.coerce(sys.Float.make(230.0), sys.Obj.type$.toNullable()))])).get();
    this.eval(sys.Str.plus(sys.Str.plus("readById(", this.#hisSyncF.id().toCode()), ").haystackSyncHis(2010-05-01)"));
    this.syncConn();
    this.#hisSyncF = this.readById(this.#hisSyncF.id());
    this.#hisF = this.readById(this.#hisF.id());
    this.verifyEq(this.#hisSyncF.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(-3, sys.Num.type$.toNullable())).plus(sys.ObjUtil.coerce(this.#hisF.trap("hisSize", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$)));
    this.verifyEq(this.#hisSyncF.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])), this.#hisF.trap("hisStart", sys.List.make(sys.Obj.type$.toNullable(), [])));
    this.verifyEq(this.#hisSyncF.trap("hisEnd", sys.List.make(sys.Obj.type$.toNullable(), [])), HaystackConnTest.dt(2010, 5, 1, 5, 0, sys.ObjUtil.coerce(tz, sys.TimeZone.type$)));
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
    this.eval(sys.Str.plus(sys.Str.plus("readById(", this.#hisSyncF.id().toCode()), ").haystackSyncHis"));
    this.syncConn();
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
    this.verifyEq(sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable()));
    this.verifyEq(a, b);
    return;
  }

  syncConn() {
    let lib = sys.ObjUtil.coerce(this.rt().lib("haystack"), HaystackLib.type$);
    this.rt().sync();
    lib.conn(this.#conn.id()).sync();
    return;
  }

  verifyInvokeAction() {
    if (!this.rt().platform().isSkySpark()) {
      return;
    }
    ;
    let r = this.addRec(sys.Map.__fromLiteral(["dis","count","msg1","msg2","actions"], ["Action",haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())),"","","ver: \"2.0\"\ndis,expr\n\"test1\",\"commit(diff(\\\$self, {count: \\\$self->count+1}))\"\n\"test2\",\"commit(diff(\\\$self, {msg1: \\\$str, msg2:\\\"\\\"+\\\$number}))\""], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    this.eval(sys.Str.plus(sys.Str.plus("invoke(", r.id().toCode()), ", \"test1\")"));
    this.eval(sys.Str.plus(sys.Str.plus("invoke(", r.id().toCode()), ", \"test2\", {str:\"init\", number:123})"));
    (r = sys.ObjUtil.coerce(this.readById(r.id()), haystack.Dict.type$));
    this.verifyEq(r.trap("count", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())));
    this.verifyEq(r.trap("msg1", sys.List.make(sys.Obj.type$.toNullable(), [])), "init");
    this.verifyEq(r.trap("msg2", sys.List.make(sys.Obj.type$.toNullable(), [])), "123");
    this.eval(sys.Str.plus(sys.Str.plus("read(haystackConn).haystackInvokeAction(", r.id().toCode()), ", \"test1\")"));
    this.eval(sys.Str.plus(sys.Str.plus("read(haystackConn).haystackInvokeAction(", r.id().toCode()), ", \"test2\", {str:\"network\",number:987})"));
    (r = sys.ObjUtil.coerce(this.readById(r.id()), haystack.Dict.type$));
    this.verifyEq(r.trap("count", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())));
    this.verifyEq(r.trap("msg1", sys.List.make(sys.Obj.type$.toNullable(), [])), "network");
    this.verifyEq(r.trap("msg2", sys.List.make(sys.Obj.type$.toNullable(), [])), "987");
    return;
  }

  verifyHaystackEval() {
    let g = sys.ObjUtil.coerce(this.eval("read(haystackConn).haystackEval(3 + 5)"), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(g.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(g.first().trap("val", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(8, sys.Num.type$.toNullable())));
    (g = sys.ObjUtil.coerce(this.eval("read(haystackConn).haystackEval(readAll(haystackConn))"), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(g.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyDictEq(sys.ObjUtil.coerce(g.first(), haystack.Dict.type$), sys.ObjUtil.coerce(this.#conn, sys.Obj.type$));
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

  evalToGrid($axon) {
    return sys.ObjUtil.coerce(this.eval($axon), haystack.Grid.type$);
  }

  verifyEvalErr($axon,errType) {
    const this$ = this;
    let expr = axon.Parser.make(axon.Loc.eval(), sys.Str.in($axon)).parse();
    let scope = this.makeContext();
    let err = null;
    try {
      expr.eval(scope);
    }
    catch ($_u28) {
      $_u28 = sys.Err.make($_u28);
      if ($_u28 instanceof axon.EvalErr) {
        let e = $_u28;
        ;
        (err = e);
      }
      else {
        throw $_u28;
      }
    }
    ;
    if (err == null) {
      this.fail(sys.Str.plus("EvalErr not thrown: ", $axon));
    }
    ;
    if (errType == null) {
      this.verifyNull(err.cause());
    }
    else {
      if (err.cause() == null) {
        this.fail(sys.Str.plus("EvalErr.cause is null: ", $axon));
      }
      ;
      sys.ObjUtil.coerce(this, sys.Test.type$).verifyErr(errType, (it) => {
        throw sys.ObjUtil.coerce(err.cause(), sys.Err.type$);
      });
    }
    ;
    return;
  }

  static make() {
    const $self = new HaystackConnTest();
    HaystackConnTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxHaystack');
const xp = sys.Param.noParams$();
let m;
HaystackDispatch.type$ = p.at$('HaystackDispatch','hxConn::ConnDispatch',[],{},8192,HaystackDispatch);
WatchInfo.type$ = p.at$('WatchInfo','sys::Obj',[],{},130,WatchInfo);
HaystackLib.type$ = p.at$('HaystackLib','hxConn::ConnLib',[],{},8194,HaystackLib);
HaystackFuncs.type$ = p.at$('HaystackFuncs','sys::Obj',[],{},8194,HaystackFuncs);
HaystackConnTest.type$ = p.at$('HaystackConnTest','hx::HxTest',[],{},8192,HaystackConnTest);
HaystackDispatch.type$.af$('noLearnTagsRef',100354,'concurrent::AtomicRef',{}).af$('client',67584,'haystack::Client?',{}).af$('watchedIds',67584,'[sys::Obj:sys::Obj]',{}).af$('watchInfo',67584,'hxHaystack::WatchInfo?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('onReceive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('onOpen',271360,'sys::Void',xp,{}).am$('onClose',271360,'sys::Void',xp,{}).am$('onPing',271360,'haystack::Dict',xp,{}).am$('onCall',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('op','sys::Str',false),new sys.Param('req','haystack::Grid',false),new sys.Param('checked','sys::Bool',false)]),{}).am$('call',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('op','sys::Str',false),new sys.Param('req','haystack::Grid',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('openClient',8192,'haystack::Client',xp,{}).am$('onReadById',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false),new sys.Param('checked','sys::Bool',false)]),{}).am$('onReadByIds',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('ids','sys::Obj[]',false),new sys.Param('checked','sys::Bool',false)]),{}).am$('onRead',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false),new sys.Param('checked','sys::Bool',false)]),{}).am$('onReadAll',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false)]),{}).am$('onEval',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false),new sys.Param('opts','haystack::Dict',false)]),{}).am$('onInvokeAction',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false),new sys.Param('action','sys::Str',false),new sys.Param('args','haystack::Dict',false)]),{}).am$('onLearn',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj?',false)]),{}).am$('onSyncCur',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('syncPoint',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('result','haystack::Dict',false)]),{}).am$('onWatch',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('watchSub',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('addWatchedId',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false),new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('onUnwatch',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onPollManual',271360,'sys::Void',xp,{}).am$('onWatchErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err',false)]),{}).am$('watchId',2048,'sys::Str?',xp,{}).am$('watchClear',2048,'sys::Void',xp,{}).am$('onWrite',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('info','hxConn::ConnWriteInfo',false)]),{}).am$('callPointWrite',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('id','sys::Obj',false),new sys.Param('writeLevel','haystack::Number',false),new sys.Param('val','sys::Obj?',false),new sys.Param('schedule','sys::Str?',false)]),{}).am$('toHaystackWriteLevel',2048,'haystack::Number?',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false),new sys.Param('info','hxConn::ConnWriteInfo',false)]),{}).am$('onHisRead',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('range','sys::Str',false)]),{}).am$('onSyncHis',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('span','haystack::Span',false)]),{}).am$('toCurId',34818,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('toWriteId',34818,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('toHisId',34818,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('toRemoteId',34818,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
WatchInfo.type$.af$('id',73730,'sys::Str',{}).af$('leaseReq',73730,'sys::Duration',{}).af$('leaseRes',73730,'sys::Obj',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('leaseReq','sys::Duration',false),new sys.Param('leaseRes','sys::Obj',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
HaystackLib.type$.am$('onConnDetails',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('c','hxConn::Conn',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HaystackFuncs.type$.af$('cannotSerialze',100354,'sys::Str',{}).am$('haystackPing',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('haystackLearn',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('arg','sys::Obj?',true)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('haystackSyncCur',40962,'concurrent::Future[]',sys.List.make(sys.Param.type$,[new sys.Param('points','sys::Obj',false)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('haystackSyncHis',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('points','sys::Obj',false),new sys.Param('span','sys::Obj?',true)]),{'sys::Deprecated':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('haystackCall',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('op','sys::Str',false),new sys.Param('req','sys::Obj?',true),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('haystackReadById',40962,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('id','sys::Obj',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('haystackReadByIds',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('ids','sys::Obj[]',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('haystackRead',40962,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('conn','axon::Expr',false),new sys.Param('filterExpr','axon::Expr',false),new sys.Param('checked','axon::Expr',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('haystackReadAll',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','axon::Expr',false),new sys.Param('filterExpr','axon::Expr',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('haystackHisRead',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('id','sys::Obj',false),new sys.Param('range','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('haystackInvokeAction',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('id','sys::Obj',false),new sys.Param('action','sys::Str',false),new sys.Param('args','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('haystackEval',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('conn','axon::Expr',false),new sys.Param('expr','axon::Expr',false),new sys.Param('opts','axon::Expr',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('varInExpr',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false),new sys.Param('var','sys::Str',false)]),{}).am$('serializeVar',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('toHisRange',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('range','sys::Obj?',false)]),{}).am$('dispatch',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('conn','sys::Obj',false),new sys.Param('msg','hx::HxMsg',false)]),{}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
HaystackConnTest.type$.af$('recA',73728,'haystack::Dict?',{}).af$('recB',73728,'haystack::Dict?',{}).af$('pt1',73728,'haystack::Dict?',{}).af$('pt2',73728,'haystack::Dict?',{}).af$('pt3',73728,'haystack::Dict?',{}).af$('ptw',73728,'haystack::Dict?',{}).af$('hisF',73728,'haystack::Dict?',{}).af$('hisB',73728,'haystack::Dict?',{}).af$('conn',73728,'haystack::Dict?',{}).af$('hisSyncF',73728,'haystack::Dict?',{}).am$('test',8192,'sys::Void',xp,{'hx::HxRuntimeTest':"hx::HxRuntimeTest{meta=\"steadyState: 10ms\";}"}).am$('init',8192,'sys::Void',xp,{}).am$('verifyConn',8192,'sys::Void',xp,{}).am$('verifyCall',8192,'sys::Void',xp,{}).am$('verifyReads',8192,'sys::Void',xp,{}).am$('verifyWatches',8192,'sys::Void',xp,{}).am$('verifyCur',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','haystack::Dict',false),new sys.Param('val','sys::Obj?',false),new sys.Param('status','sys::Str',true),new sys.Param('err','sys::Str?',true)]),{}).am$('resetCur',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','haystack::Dict',false)]),{}).am$('verifyPointWrite',8192,'sys::Void',xp,{}).am$('verifyReadHis',8192,'sys::Void',xp,{}).am$('doVerifyReadHis',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('range','sys::Str',false)]),{}).am$('readHisToGrid',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('range','sys::Str',false)]),{}).am$('rangeToSpan',2048,'haystack::Span',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('range','sys::Str',false)]),{}).am$('verifySyncHis',8192,'sys::Void',xp,{}).am$('syncConn',8192,'sys::Void',xp,{}).am$('verifyInvokeAction',8192,'sys::Void',xp,{}).am$('verifyHaystackEval',8192,'sys::Void',xp,{}).am$('item',40962,'haystack::HisItem',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('dt',40962,'sys::DateTime',sys.List.make(sys.Param.type$,[new sys.Param('y','sys::Int',false),new sys.Param('m','sys::Int',false),new sys.Param('d','sys::Int',false),new sys.Param('h','sys::Int',false),new sys.Param('min','sys::Int',false),new sys.Param('tz','sys::TimeZone',true)]),{}).am$('evalToGrid',8192,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('axon','sys::Str',false)]),{}).am$('verifyEvalErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('axon','sys::Str',false),new sys.Param('errType','sys::Type?',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxHaystack");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;haystack 3.1.11;axon 3.1.11;folio 3.1.11;hx 3.1.11;hxConn 3.1.11");
m.set("pod.summary", "Haystack HTTP API connector");
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
  HaystackDispatch,
  HaystackLib,
  HaystackFuncs,
  HaystackConnTest,
};
