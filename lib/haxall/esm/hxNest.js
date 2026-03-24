// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as rdf from './rdf.js'
import * as util from './util.js'
import * as web from './web.js'
import * as wisp from './wisp.js'
import * as oauth2 from './oauth2.js'
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
class NestLib extends hxConn.ConnLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NestLib.type$; }

  static cur(checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(hx.HxContext.curHx().rt().lib("nest", checked), NestLib.type$.toNullable());
  }

  static make() {
    const $self = new NestLib();
    NestLib.make$($self);
    return $self;
  }

  static make$($self) {
    hxConn.ConnLib.make$($self);
    return;
  }

}

class Nest extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Nest.type$; }

  static #tokenUri = undefined;

  static tokenUri() {
    if (Nest.#tokenUri === undefined) {
      Nest.static$init();
      if (Nest.#tokenUri === undefined) Nest.#tokenUri = null;
    }
    return Nest.#tokenUri;
  }

  #projectId = null;

  projectId() { return this.#projectId; }

  __projectId(it) { if (it === undefined) return this.#projectId; else this.#projectId = it; }

  #client = null;

  client() { return this.#client; }

  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  static make(projectId,clientId,clientSecret,refreshToken,log) {
    const $self = new Nest();
    Nest.make$($self,projectId,clientId,clientSecret,refreshToken,log);
    return $self;
  }

  static make$($self,projectId,clientId,clientSecret,refreshToken,log) {
    if (log === undefined) log = sys.Log.get("nest");
    const this$ = $self;
    $self.#projectId = projectId;
    let token = oauth2.RawAccessToken.make("ForceRefreshAuthToken", (it) => {
      it.__refreshToken(refreshToken);
      return;
    });
    let params = sys.Map.__fromLiteral(["client_id","client_secret"], [clientId,clientSecret], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    $self.#client = oauth2.OAuthClient.makeRefreshable(token, Nest.tokenUri(), params);
    $self.#log = log;
    return;
  }

  structures() {
    return StructuresReq.make(this);
  }

  rooms() {
    return RoomsReq.make(this);
  }

  devices() {
    return DevicesReq.make(this);
  }

  static static$init() {
    Nest.#tokenUri = sys.Uri.fromStr("https://www.googleapis.com/oauth2/v4/token");
    return;
  }

}

class NestDispatch extends hxConn.ConnDispatch {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NestDispatch.type$; }

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

  static make(arg) {
    const $self = new NestDispatch();
    NestDispatch.make$($self,arg);
    return $self;
  }

  static make$($self,arg) {
    hxConn.ConnDispatch.make$($self, arg);
    return;
  }

  nestLib() {
    return sys.ObjUtil.coerce(this.lib(), NestLib.type$);
  }

  onOpen() {
    this.#client = Nest.make(sys.ObjUtil.coerce(this.rec().trap("nestProjectId", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$), this.password("nestClientId"), this.password("nestClientSecret"), this.password("nestRefreshToken"), this.trace().asLog());
    return;
  }

  password(name) {
    return sys.ObjUtil.coerce(((this$) => { let $_u0 = this$.db().passwords().get(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.id()), " "), name)); if ($_u0 != null) return $_u0; throw haystack.FaultErr.make(sys.Str.plus("Missing password for ", name)); })(this), sys.Str.type$);
  }

  onClose() {
    this.#client = null;
    return;
  }

  onPing() {
    let structures = this.#client.structures().list();
    return haystack.Etc.emptyDict();
  }

  onSyncCur(points) {
    NestSyncCur.make(this, points).run();
    return;
  }

  onWrite(point,event) {
    NestWrite.make(this, point, event).run();
    return;
  }

  onLearn(arg) {
    return sys.ObjUtil.coerce(NestLearn.make(this, arg).run(), haystack.Grid.type$);
  }

}

class NestUtil {
  constructor() {
    const this$ = this;
  }

  typeof() { return NestUtil.type$; }

  static #celsius = undefined;

  static celsius() {
    if (NestUtil.#celsius === undefined) {
      NestUtil.static$init();
      if (NestUtil.#celsius === undefined) NestUtil.#celsius = null;
    }
    return NestUtil.#celsius;
  }

  static #fahr = undefined;

  static fahr() {
    if (NestUtil.#fahr === undefined) {
      NestUtil.static$init();
      if (NestUtil.#fahr === undefined) NestUtil.#fahr = null;
    }
    return NestUtil.#fahr;
  }

  static #relHum = undefined;

  static relHum() {
    if (NestUtil.#relHum === undefined) {
      NestUtil.static$init();
      if (NestUtil.#relHum === undefined) NestUtil.#relHum = null;
    }
    return NestUtil.#relHum;
  }

  static nestToHay(val,unit) {
    if (unit === undefined) unit = null;
    if (val == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(val, sys.Float.type$)) {
      return haystack.Number.make(sys.ObjUtil.coerce(val, sys.Float.type$), unit);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Int.type$)) {
      return haystack.Number.makeInt(sys.ObjUtil.coerce(val, sys.Int.type$), unit);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      return val;
    }
    ;
    return sys.ObjUtil.toStr(val);
  }

  static getTraitVal(res,ref) {
    return NestUtil.nestToHay(res.traitVal(ref.trait(), ref.field()), NestUtil.toUnit(res, ref));
  }

  static toUnit(res,ref) {
    if (sys.Str.endsWith(ref.field(), "Celsius")) {
      return NestUtil.celsius();
    }
    ;
    return null;
  }

  static static$init() {
    NestUtil.#celsius = sys.ObjUtil.coerce(sys.Unit.fromStr("celsius"), sys.Unit.type$);
    NestUtil.#fahr = sys.ObjUtil.coerce(sys.Unit.fromStr("fahrenheit"), sys.Unit.type$);
    NestUtil.#relHum = sys.ObjUtil.coerce(sys.Unit.fromStr("%RH"), sys.Unit.type$);
    return;
  }

}

class NestErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NestErr.type$; }

  #error = null;

  error() { return this.#error; }

  __error(it) { if (it === undefined) return this.#error; else this.#error = it; }

  static make(error,cause) {
    const $self = new NestErr();
    NestErr.make$($self,error,cause);
    return $self;
  }

  static make$($self,error,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(error.get("message"), sys.Str.type$), cause);
    $self.#error = sys.ObjUtil.coerce(((this$) => { let $_u1 = error; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(error); })($self), sys.Type.find("[sys::Str:sys::Obj?]"));
    return;
  }

  code() {
    return sys.ObjUtil.coerce(this.#error.get("code"), sys.Int.type$);
  }

  message() {
    return sys.ObjUtil.coerce(((this$) => { let $_u2 = this$.#error.get("message"); if ($_u2 != null) return $_u2; return "Unknown Err"; })(this), sys.Str.type$);
  }

  toStr() {
    let buf = sys.StrBuf.make().add(sys.Str.plus(sys.Str.plus(sys.Str.plus("[", sys.ObjUtil.coerce(this.code(), sys.Obj.type$.toNullable())), "] "), this.message()));
    return buf.toStr();
  }

}

class ApiReq extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ApiReq.type$; }

  static #baseUri = undefined;

  static baseUri() {
    if (ApiReq.#baseUri === undefined) {
      ApiReq.static$init();
      if (ApiReq.#baseUri === undefined) ApiReq.#baseUri = null;
    }
    return ApiReq.#baseUri;
  }

  static #debugCounter = undefined;

  static debugCounter() {
    if (ApiReq.#debugCounter === undefined) {
      ApiReq.static$init();
      if (ApiReq.#debugCounter === undefined) ApiReq.#debugCounter = null;
    }
    return ApiReq.#debugCounter;
  }

  #projectId = null;

  projectId() { return this.#projectId; }

  __projectId(it) { if (it === undefined) return this.#projectId; else this.#projectId = it; }

  #client = null;

  client() { return this.#client; }

  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  static make(projectId,client,log) {
    const $self = new ApiReq();
    ApiReq.make$($self,projectId,client,log);
    return $self;
  }

  static make$($self,projectId,client,log) {
    if (log === undefined) log = null;
    $self.#projectId = projectId;
    $self.#client = client;
    $self.#log = log;
    return;
  }

  isDebug() {
    return sys.ObjUtil.coerce(((this$) => { let $_u3 = ((this$) => { let $_u4 = this$.#log; if ($_u4 == null) return null; return this$.#log.isDebug(); })(this$); if ($_u3 != null) return $_u3; return sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()); })(this), sys.Bool.type$);
  }

  projectUri() {
    return ApiReq.baseUri().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("enterprises/", this.#projectId), "/")));
  }

  invoke(method,uri,req,headers) {
    if (req === undefined) req = null;
    if (headers === undefined) headers = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    return this.readJson(this.call(method, uri, req, headers));
  }

  call(method,uri,req,headers) {
    if (req === undefined) req = null;
    if (headers === undefined) headers = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    const this$ = this;
    let count = ApiReq.debugCounter().getAndIncrement();
    if (this.isDebug()) {
      let s = sys.StrBuf.make().add(sys.Str.plus(sys.Str.plus("> [", sys.ObjUtil.coerce(count, sys.Obj.type$.toNullable())), "]\n")).add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", method), " "), uri), "\n"));
      headers.each((v,n) => {
        s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), v), "\n"));
        return;
      });
      if (sys.ObjUtil.is(req, sys.Str.type$)) {
        s.add(sys.Str.trimEnd(sys.ObjUtil.coerce(req, sys.Str.type$))).add("\n");
      }
      else {
        if (sys.ObjUtil.is(req, sys.File.type$)) {
          s.add(sys.Str.trimEnd(sys.ObjUtil.coerce(req, sys.File.type$).readAllStr())).add("\n");
        }
        ;
      }
      ;
      this.#log.debug(s.toStr());
    }
    ;
    let c = this.#client.call(method, uri, req, headers);
    if (sys.ObjUtil.equals(sys.Int.div(c.resCode(), 100), 2)) {
      return c;
    }
    ;
    try {
      let json = this.readJson(c);
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), "] "), c.resPhrase()), "\n"), json));
    }
    finally {
      c.close();
    }
    ;
  }

  readJson(c,count) {
    if (count === undefined) count = sys.Int.minus(ApiReq.debugCounter().val(), 1);
    const this$ = this;
    if (sys.ObjUtil.equals(c.resCode(), 204)) {
      return sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?"));
    }
    ;
    let str = c.resStr();
    let json = sys.ObjUtil.coerce(util.JsonInStream.make(sys.Str.in(str)).readJson(), sys.Type.find("sys::Map"));
    if (this.isDebug()) {
      let s = sys.StrBuf.make().add(sys.Str.plus(sys.Str.plus("< [", sys.ObjUtil.coerce(count, sys.Obj.type$.toNullable())), "]\n")).add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), " "), c.resPhrase()), "\n"));
      c.resHeaders().each((v,n) => {
        s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), v), "\n"));
        return;
      });
      s.add(sys.Str.plus(sys.Str.plus("", sys.Str.trimEnd(str)), "\n"));
      this.#log.debug(s.toStr());
    }
    ;
    let err = sys.ObjUtil.as(json.get("error"), sys.Type.find("sys::Map"));
    if (err != null) {
      throw NestErr.make(sys.ObjUtil.coerce(err, sys.Type.find("[sys::Str:sys::Obj?]")));
    }
    ;
    return json;
  }

  static static$init() {
    ApiReq.#baseUri = sys.Uri.fromStr("https://smartdevicemanagement.googleapis.com/v1/");
    ApiReq.#debugCounter = concurrent.AtomicInt.make();
    return;
  }

}

class StructuresReq extends ApiReq {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StructuresReq.type$; }

  static make(nest) {
    const $self = new StructuresReq();
    StructuresReq.make$($self,nest);
    return $self;
  }

  static make$($self,nest) {
    ApiReq.make$($self, nest.projectId(), nest.client(), nest.log());
    return;
  }

  list() {
    const this$ = this;
    let acc = sys.List.make(NestStructure.type$);
    let params = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    while (true) {
      let json = this.invoke("GET", this.projectUri().plus(sys.Uri.fromStr("structures")).plusQuery(params));
      sys.ObjUtil.as(json.get("structures"), sys.Type.find("sys::List")).each((s) => {
        acc.add(NestStructure.make(sys.ObjUtil.coerce(s, sys.Type.find("sys::Map"))));
        return;
      });
      let nextPageToken = sys.ObjUtil.as(json.get("nextPageToken"), sys.Str.type$);
      if (nextPageToken == null) {
        break;
      }
      ;
      (params = sys.Map.__fromLiteral(["pageToken"], [nextPageToken], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")));
    }
    ;
    return acc;
  }

  get(structureId) {
    return NestStructure.make(sys.ObjUtil.coerce(this.invoke("GET", this.projectUri().plus(sys.Str.toUri(sys.Str.plus("structures/", structureId)))), sys.Type.find("sys::Map")));
  }

}

class RoomsReq extends ApiReq {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RoomsReq.type$; }

  static make(nest) {
    const $self = new RoomsReq();
    RoomsReq.make$($self,nest);
    return $self;
  }

  static make$($self,nest) {
    ApiReq.make$($self, nest.projectId(), nest.client(), nest.log());
    return;
  }

  list(structureId) {
    const this$ = this;
    let acc = sys.List.make(NestRoom.type$);
    let params = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    while (true) {
      let json = this.invoke("GET", this.projectUri().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("structures/", structureId), "/rooms"))).plusQuery(params));
      sys.ObjUtil.as(json.get("rooms"), sys.Type.find("sys::List")).each((r) => {
        acc.add(NestRoom.make(sys.ObjUtil.coerce(r, sys.Type.find("sys::Map"))));
        return;
      });
      let nextPageToken = sys.ObjUtil.as(json.get("nextPageToken"), sys.Str.type$);
      if (nextPageToken == null) {
        break;
      }
      ;
      (params = sys.Map.__fromLiteral(["pageToken"], [nextPageToken], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")));
    }
    ;
    return acc;
  }

  get(structureId,roomId) {
    return NestRoom.make(sys.ObjUtil.coerce(this.invoke("GET", this.projectUri().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus("structures/", structureId), "/rooms/"), roomId)))), sys.Type.find("sys::Map")));
  }

}

class DevicesReq extends ApiReq {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DevicesReq.type$; }

  static make(nest) {
    const $self = new DevicesReq();
    DevicesReq.make$($self,nest);
    return $self;
  }

  static make$($self,nest) {
    ApiReq.make$($self, nest.projectId(), nest.client(), nest.log());
    return;
  }

  list() {
    const this$ = this;
    let json = this.invoke("GET", this.projectUri().plus(sys.Uri.fromStr("devices")));
    return sys.ObjUtil.coerce(sys.ObjUtil.as(json.get("devices"), sys.Type.find("sys::List")).map((d) => {
      return NestDevice.fromJson(sys.ObjUtil.coerce(d, sys.Type.find("sys::Map")));
    }, NestDevice.type$), sys.Type.find("hxNest::NestDevice[]"));
  }

  get(deviceId) {
    return NestDevice.fromJson(sys.ObjUtil.coerce(this.invoke("GET", this.projectUri().plus(sys.Str.toUri(sys.Str.plus("devices/", deviceId)))), sys.Type.find("sys::Map")));
  }

  exec(deviceId,command,params) {
    let body = sys.Str.toBuf(util.JsonOutStream.writeJsonToStr(sys.Map.__fromLiteral(["command","params"], [command,params], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")))).toFile(sys.Uri.fromStr("command.json"));
    let json = this.invoke("POST", this.projectUri().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("devices/", deviceId), ":executeCommand"))), body);
    return;
  }

}

class NestResource extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NestResource.type$; }

  static #celsius = undefined;

  static celsius() {
    if (NestResource.#celsius === undefined) {
      NestResource.static$init();
      if (NestResource.#celsius === undefined) NestResource.#celsius = null;
    }
    return NestResource.#celsius;
  }

  static #relHum = undefined;

  static relHum() {
    if (NestResource.#relHum === undefined) {
      NestResource.static$init();
      if (NestResource.#relHum === undefined) NestResource.#relHum = null;
    }
    return NestResource.#relHum;
  }

  #json = null;

  json() { return this.#json; }

  __json(it) { if (it === undefined) return this.#json; else this.#json = it; }

  static make(json) {
    const $self = new NestResource();
    NestResource.make$($self,json);
    return $self;
  }

  static make$($self,json) {
    $self.#json = sys.ObjUtil.coerce(((this$) => { let $_u5 = json; if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(json); })($self), sys.Type.find("[sys::Str:sys::Obj?]"));
    return;
  }

  name() {
    return sys.Str.toUri(sys.ObjUtil.coerce(this.#json.get("name"), sys.Str.type$));
  }

  id() {
    return sys.ObjUtil.coerce(((this$) => { let $_u6 = this$.name().path().last(); if ($_u6 != null) return $_u6; return ""; })(this), sys.Str.type$);
  }

  dis() {
    return sys.ObjUtil.coerce(this.traitVal("Info", "customName"), sys.Str.type$);
  }

  traits() {
    return sys.ObjUtil.coerce(this.#json.get("traits"), sys.Type.find("[sys::Str:sys::Obj?]"));
  }

  trait(name) {
    return sys.ObjUtil.coerce(this.traits().get(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.traitsKey()), "."), name)), sys.Type.find("sys::Map"));
  }

  traitVal(trait,field) {
    return this.trait(trait).get(field);
  }

  toStr() {
    return this.#json.toStr();
  }

  static static$init() {
    NestResource.#celsius = sys.ObjUtil.coerce(sys.Unit.fromStr("celsius"), sys.Unit.type$);
    NestResource.#relHum = sys.ObjUtil.coerce(sys.Unit.fromStr("%RH"), sys.Unit.type$);
    return;
  }

}

class NestDevice extends NestResource {
  constructor() {
    super();
    const this$ = this;
    this.#traitsKey = "sdm.devices.traits";
    return;
  }

  typeof() { return NestDevice.type$; }

  #traitsKey = null;

  traitsKey() { return this.#traitsKey; }

  __traitsKey(it) { if (it === undefined) return this.#traitsKey; else this.#traitsKey = it; }

  static fromJson(json) {
    let $_u7 = json.get("type");
    if (sys.ObjUtil.equals($_u7, "sdm.devices.types.THERMOSTAT")) {
      return NestThermostat.make(json);
    }
    else {
      return NestDevice.make(json);
    }
    ;
  }

  static make(json) {
    const $self = new NestDevice();
    NestDevice.make$($self,json);
    return $self;
  }

  static make$($self,json) {
    NestResource.make$($self, sys.ObjUtil.coerce(json, sys.Type.find("[sys::Str:sys::Obj?]")));
    ;
    return;
  }

  type() {
    return sys.ObjUtil.coerce(this.json().get("type"), sys.Str.type$);
  }

  typeName() {
    return sys.ObjUtil.coerce(sys.Str.split(this.type(), sys.ObjUtil.coerce(46, sys.Int.type$.toNullable())).last(), sys.Str.type$);
  }

  parentRelations() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.as(this.json().get("parentRelations"), sys.Type.find("sys::List")).map((p) => {
      return ParentRelation.make(sys.ObjUtil.coerce(p, sys.Type.find("sys::Map")));
    }, ParentRelation.type$), sys.Type.find("hxNest::ParentRelation[]"));
  }

}

class ParentRelation extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ParentRelation.type$; }

  #parent = null;

  parent() { return this.#parent; }

  __parent(it) { if (it === undefined) return this.#parent; else this.#parent = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  static make(json) {
    const $self = new ParentRelation();
    ParentRelation.make$($self,json);
    return $self;
  }

  static make$($self,json) {
    $self.#parent = sys.Str.toUri(sys.ObjUtil.coerce(json.get("parent"), sys.Str.type$));
    $self.#dis = sys.ObjUtil.coerce(json.get("displayName"), sys.Str.type$);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#dis), " ["), this.#parent), "]");
  }

}

class NestStructure extends NestResource {
  constructor() {
    super();
    const this$ = this;
    this.#traitsKey = "sdm.structures.traits";
    return;
  }

  typeof() { return NestStructure.type$; }

  #traitsKey = null;

  traitsKey() { return this.#traitsKey; }

  __traitsKey(it) { if (it === undefined) return this.#traitsKey; else this.#traitsKey = it; }

  static make(json) {
    const $self = new NestStructure();
    NestStructure.make$($self,json);
    return $self;
  }

  static make$($self,json) {
    NestResource.make$($self, sys.ObjUtil.coerce(json, sys.Type.find("[sys::Str:sys::Obj?]")));
    ;
    return;
  }

}

class NestRoom extends NestResource {
  constructor() {
    super();
    const this$ = this;
    this.#traitsKey = "sdm.structures.traits";
    return;
  }

  typeof() { return NestRoom.type$; }

  #traitsKey = null;

  traitsKey() { return this.#traitsKey; }

  __traitsKey(it) { if (it === undefined) return this.#traitsKey; else this.#traitsKey = it; }

  static make(json) {
    const $self = new NestRoom();
    NestRoom.make$($self,json);
    return $self;
  }

  static make$($self,json) {
    NestResource.make$($self, sys.ObjUtil.coerce(json, sys.Type.find("[sys::Str:sys::Obj?]")));
    ;
    return;
  }

  dis() {
    return sys.ObjUtil.coerce(this.traitVal("RoomInfo", "customName"), sys.Str.type$);
  }

  structureId() {
    return this.name().path().get(3);
  }

}

class NestThermostat extends NestDevice {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NestThermostat.type$; }

  static make(json) {
    const $self = new NestThermostat();
    NestThermostat.make$($self,json);
    return $self;
  }

  static make$($self,json) {
    NestDevice.make$($self, json);
    return;
  }

  connectivity() {
    return sys.ObjUtil.coerce(Connectivity.fromStr(sys.ObjUtil.coerce(this.traitVal("Connectivity", "status"), sys.Str.type$)), Connectivity.type$);
  }

  isFanOn() {
    return sys.ObjUtil.equals(this.traitVal("Fan", "timerMode"), "ON");
  }

  humidity() {
    return sys.ObjUtil.coerce(this.traitVal("Humidity", "ambientHumidityPercent"), sys.Float.type$);
  }

  temperature() {
    return sys.ObjUtil.coerce(this.traitVal("Temperature", "ambientTemperatureCelsius"), sys.Float.type$);
  }

  status() {
    return sys.ObjUtil.coerce(HvacStatus.fromStr(sys.ObjUtil.coerce(this.traitVal("ThermostatHvac", "status"), sys.Str.type$)), HvacStatus.type$);
  }

  mode() {
    return sys.ObjUtil.coerce(ThermostatMode.fromStr(sys.ObjUtil.coerce(this.traitVal("ThermostatMode", "mode"), sys.Str.type$)), ThermostatMode.type$);
  }

  setpoint() {
    return sys.Map.__fromLiteral(["heatCelsius","coolCelsius"], [sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.traitVal("ThermostatTemperatureSetpoint", "heatCelsius"), sys.Float.type$), sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.traitVal("ThermostatTemperatureSetpoint", "coolCelsius"), sys.Float.type$), sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Float"));
  }

}

class Connectivity extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Connectivity.type$; }

  static ONLINE() { return Connectivity.vals().get(0); }

  static OFFLINE() { return Connectivity.vals().get(1); }

  static #vals = undefined;

  isOnline() {
    return this === Connectivity.ONLINE();
  }

  static make($ordinal,$name) {
    const $self = new Connectivity();
    Connectivity.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Connectivity.type$, Connectivity.vals(), name$, checked);
  }

  static vals() {
    if (Connectivity.#vals == null) {
      Connectivity.#vals = sys.List.make(Connectivity.type$, [
        Connectivity.make(0, "ONLINE", ),
        Connectivity.make(1, "OFFLINE", ),
      ]).toImmutable();
    }
    return Connectivity.#vals;
  }

  static static$init() {
    const $_u8 = Connectivity.vals();
    if (true) {
    }
    ;
    return;
  }

}

class ThermostatMode extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThermostatMode.type$; }

  static HEAT() { return ThermostatMode.vals().get(0); }

  static COOL() { return ThermostatMode.vals().get(1); }

  static HEATCOOL() { return ThermostatMode.vals().get(2); }

  static OFF() { return ThermostatMode.vals().get(3); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new ThermostatMode();
    ThermostatMode.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(ThermostatMode.type$, ThermostatMode.vals(), name$, checked);
  }

  static vals() {
    if (ThermostatMode.#vals == null) {
      ThermostatMode.#vals = sys.List.make(ThermostatMode.type$, [
        ThermostatMode.make(0, "HEAT", ),
        ThermostatMode.make(1, "COOL", ),
        ThermostatMode.make(2, "HEATCOOL", ),
        ThermostatMode.make(3, "OFF", ),
      ]).toImmutable();
    }
    return ThermostatMode.#vals;
  }

  static static$init() {
    const $_u9 = ThermostatMode.vals();
    if (true) {
    }
    ;
    return;
  }

}

class HvacStatus extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HvacStatus.type$; }

  static OFF() { return HvacStatus.vals().get(0); }

  static HEATING() { return HvacStatus.vals().get(1); }

  static COOLING() { return HvacStatus.vals().get(2); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new HvacStatus();
    HvacStatus.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(HvacStatus.type$, HvacStatus.vals(), name$, checked);
  }

  static vals() {
    if (HvacStatus.#vals == null) {
      HvacStatus.#vals = sys.List.make(HvacStatus.type$, [
        HvacStatus.make(0, "OFF", ),
        HvacStatus.make(1, "HEATING", ),
        HvacStatus.make(2, "COOLING", ),
      ]).toImmutable();
    }
    return HvacStatus.#vals;
  }

  static static$init() {
    const $_u10 = HvacStatus.vals();
    if (true) {
    }
    ;
    return;
  }

}

class NestConnTask extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NestConnTask.type$; }

  #dispatch = null;

  dispatch() {
    return this.#dispatch;
  }

  static make(dispatch) {
    const $self = new NestConnTask();
    NestConnTask.make$($self,dispatch);
    return $self;
  }

  static make$($self,dispatch) {
    $self.#dispatch = dispatch;
    return;
  }

  client() {
    return sys.ObjUtil.coerce(this.#dispatch.client(), Nest.type$);
  }

  conn() {
    return this.#dispatch.conn();
  }

  log() {
    return this.#dispatch.log();
  }

  openPin() {
    this.#dispatch.openPin(sys.Str.plus("", sys.ObjUtil.typeof(this)));
    return;
  }

  closePin() {
    this.#dispatch.closePin(sys.Str.plus("", sys.ObjUtil.typeof(this)));
    return;
  }

  static toCurId(pt) {
    return NestConnTask.toRemoteId(pt.rec(), "nestCur");
  }

  static toWriteId(pt) {
    return NestConnTask.toRemoteId(pt.rec(), "nestWrite");
  }

  static toRemoteId(rec,tag) {
    let val = rec.get(tag);
    if (val == null) {
      throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus("", tag), " not defined"));
    }
    ;
    if (!sys.ObjUtil.is(val, sys.Str.type$)) {
      throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", tag), " must be a Str: "), sys.ObjUtil.typeof(val).name()));
    }
    ;
    return sys.ObjUtil.coerce(NestTraitRef.fromStr(sys.ObjUtil.coerce(val, sys.Str.type$)), NestTraitRef.type$);
  }

}

class NestSyncCur extends NestConnTask {
  constructor() {
    super();
    const this$ = this;
    this.#byDevice = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxConn::ConnPoint[]"));
    return;
  }

  typeof() { return NestSyncCur.type$; }

  #points = null;

  // private field reflection only
  __points(it) { if (it === undefined) return this.#points; else this.#points = it; }

  #byDevice = null;

  // private field reflection only
  __byDevice(it) { if (it === undefined) return this.#byDevice; else this.#byDevice = it; }

  static make(dispatch,points) {
    const $self = new NestSyncCur();
    NestSyncCur.make$($self,dispatch,points);
    return $self;
  }

  static make$($self,dispatch,points) {
    NestConnTask.make$($self, dispatch);
    ;
    $self.#points = points;
    return;
  }

  run() {
    const this$ = this;
    this.init();
    this.#byDevice.each((points,deviceId) => {
      this$.syncDevice(deviceId, points);
      return;
    });
    return this.#points;
  }

  init() {
    const this$ = this;
    this.#points.each((point) => {
      let traitRef = NestConnTask.toCurId(point);
      this$.#byDevice.getOrAdd(traitRef.deviceId(), (it) => {
        return sys.List.make(hxConn.ConnPoint.type$);
      }).add(point);
      return;
    });
    return;
  }

  syncDevice(deviceId,points) {
    const this$ = this;
    try {
      let device = this.client().devices().get(deviceId);
      points.each((pt) => {
        this$.updateCur(device, pt);
        return;
      });
    }
    catch ($_u11) {
      $_u11 = sys.Err.make($_u11);
      if ($_u11 instanceof sys.Err) {
        let err = $_u11;
        ;
        points.each((pt) => {
          pt.updateCurErr(err);
          return;
        });
      }
      else {
        throw $_u11;
      }
    }
    ;
    return;
  }

  updateCur(device,point) {
    let traitRef = NestConnTask.toCurId(point);
    try {
      point.updateCurOk(NestUtil.getTraitVal(device, traitRef));
    }
    catch ($_u12) {
      $_u12 = sys.Err.make($_u12);
      if ($_u12 instanceof sys.Err) {
        let err = $_u12;
        ;
        point.updateCurErr(err);
      }
      else {
        throw $_u12;
      }
    }
    ;
    return;
  }

}

class NestTraitRef extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NestTraitRef.type$; }

  #deviceId = null;

  deviceId() { return this.#deviceId; }

  __deviceId(it) { if (it === undefined) return this.#deviceId; else this.#deviceId = it; }

  #trait = null;

  trait() { return this.#trait; }

  __trait(it) { if (it === undefined) return this.#trait; else this.#trait = it; }

  #field = null;

  field() { return this.#field; }

  __field(it) { if (it === undefined) return this.#field; else this.#field = it; }

  static fromStr(s) {
    let parts = sys.Str.split(s, sys.ObjUtil.coerce(58, sys.Int.type$.toNullable()));
    let device = parts.first();
    (parts = sys.Str.split(parts.last(), sys.ObjUtil.coerce(46, sys.Int.type$.toNullable())));
    let trait = parts.first();
    let field = parts.last();
    return NestTraitRef.make(sys.ObjUtil.coerce(device, sys.Str.type$), sys.ObjUtil.coerce(trait, sys.Str.type$), sys.ObjUtil.coerce(field, sys.Str.type$));
  }

  static make(deviceId,trait,field) {
    const $self = new NestTraitRef();
    NestTraitRef.make$($self,deviceId,trait,field);
    return $self;
  }

  static make$($self,deviceId,trait,field) {
    $self.#deviceId = deviceId;
    $self.#trait = trait;
    $self.#field = field;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#deviceId), ":"), this.#trait), "."), this.#field);
  }

}

class NestWrite extends NestConnTask {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NestWrite.type$; }

  #point = null;

  // private field reflection only
  __point(it) { if (it === undefined) return this.#point; else this.#point = it; }

  #event = null;

  // private field reflection only
  __event(it) { if (it === undefined) return this.#event; else this.#event = it; }

  static make(dispatch,point,event) {
    const $self = new NestWrite();
    NestWrite.make$($self,dispatch,point,event);
    return $self;
  }

  static make$($self,dispatch,point,event) {
    NestConnTask.make$($self, dispatch);
    $self.#point = point;
    $self.#event = event;
    return;
  }

  run() {
    try {
      let traitRef = NestConnTask.toWriteId(this.#point);
      let trait = traitRef.trait();
      let command = null;
      let params = null;
      let $_u13 = trait;
      if (sys.ObjUtil.equals($_u13, "ThermostatMode")) {
        (command = NestWrite.cmd(trait, "SetMode"));
        (params = sys.Map.__fromLiteral(["mode"], [sys.ObjUtil.toStr(this.#event.val())], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
      }
      else if (sys.ObjUtil.equals($_u13, "ThermostatTemperatureSetpoint")) {
        (command = NestWrite.cmd(trait, ((this$) => { if (sys.ObjUtil.equals(traitRef.field(), "heatCelsius")) return "SetHeat"; return "SetCool"; })(this)));
        (params = sys.Map.__fromLiteral([traitRef.field()], [sys.ObjUtil.coerce(this.toCelsius(sys.ObjUtil.coerce(this.#event.val(), sys.Obj.type$)), sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Float")));
      }
      else {
        throw haystack.FaultErr.make(sys.Str.plus("Unsupported trait for write: ", traitRef));
      }
      ;
      this.client().devices().exec(traitRef.deviceId(), sys.ObjUtil.coerce(command, sys.Str.type$), sys.ObjUtil.coerce(params, sys.Type.find("sys::Map")));
      this.#point.updateWriteOk(this.#event);
    }
    catch ($_u15) {
      $_u15 = sys.Err.make($_u15);
      if ($_u15 instanceof sys.Err) {
        let err = $_u15;
        ;
        this.#point.updateWriteErr(this.#event, err);
      }
      else {
        throw $_u15;
      }
    }
    ;
    return null;
  }

  static cmd(trait,command) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("sdm.devices.commands.", trait), "."), command);
  }

  toCelsius(obj) {
    if (!sys.ObjUtil.is(obj, haystack.Number.type$)) {
      throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot write ", obj), " ("), sys.ObjUtil.typeof(obj)), ")"));
    }
    ;
    let num = sys.ObjUtil.coerce(obj, haystack.Number.type$);
    let unit = ((this$) => { let $_u16 = num.unit(); if ($_u16 != null) return $_u16; return this$.#point.unit(); })(this);
    if (unit == null) {
      throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus("Cannot write ", num), " - has not unit and point does not have unit tag"));
    }
    ;
    if (sys.ObjUtil.equals(unit, NestUtil.celsius())) {
      return num.toFloat();
    }
    ;
    if (sys.ObjUtil.equals(unit, NestUtil.fahr())) {
      return NestUtil.fahr().convertTo(num.toFloat(), NestUtil.celsius());
    }
    ;
    throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus("Cannot convert ", unit), " to Celsius"));
  }

}

class NestLearn extends NestConnTask {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NestLearn.type$; }

  static fahr() { return NestUtil.fahr(); }

  static relHum() { return NestUtil.relHum(); }

  static celsius() { return NestUtil.celsius(); }

  #arg = null;

  // private field reflection only
  __arg(it) { if (it === undefined) return this.#arg; else this.#arg = it; }

  static make(dispatch,arg) {
    const $self = new NestLearn();
    NestLearn.make$($self,dispatch,arg);
    return $self;
  }

  static make$($self,dispatch,arg) {
    NestConnTask.make$($self, dispatch);
    $self.#arg = arg;
    return;
  }

  learn() {
    return sys.ObjUtil.coerce(this.run(), haystack.Grid.type$);
  }

  run() {
    let t1 = sys.Duration.now();
    try {
      let meta = sys.Map.__fromLiteral(["nestConnRef"], [this.conn().id()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Ref"));
      let rows = sys.List.make(haystack.Dict.type$);
      let spec = sys.ObjUtil.as(this.#arg, haystack.Dict.type$);
      if (this.#arg == null) {
        (rows = this.learnStructures());
      }
      else {
        if (spec.has("structure")) {
          (rows = this.learnRooms(sys.ObjUtil.coerce(spec, haystack.Dict.type$)));
        }
        else {
          if (spec.has("room")) {
            (rows = this.learnDevices(sys.ObjUtil.coerce(spec, haystack.Dict.type$)));
          }
          else {
            if (spec.has("device")) {
              (rows = this.learnPoints(sys.ObjUtil.coerce(spec, haystack.Dict.type$)));
            }
            else {
              throw sys.Err.make(sys.Str.plus("Unexpected arg: ", this.#arg));
            }
            ;
          }
          ;
        }
        ;
      }
      ;
      return haystack.Etc.makeDictsGrid(meta, rows);
    }
    finally {
      let t2 = sys.Duration.now();
      this.log().info(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.conn().dis()), " Learn "), this.#arg), " ["), t2.minus(t1).toLocale()), "]"));
    }
    ;
  }

  learnStructures() {
    const this$ = this;
    let acc = sys.List.make(haystack.Dict.type$);
    let structures = this.client().structures().list();
    structures.each((structure) => {
      acc.add(haystack.Etc.makeDict(sys.Map.__fromLiteral(["learn","dis"], [haystack.Etc.makeDict(sys.Map.__fromLiteral(["structure","structureId"], [structure.name(),structure.id()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))),structure.dis()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))));
      return;
    });
    return acc;
  }

  learnRooms(arg) {
    const this$ = this;
    let acc = sys.List.make(haystack.Dict.type$);
    let rooms = this.client().rooms().list(sys.ObjUtil.coerce(arg.get("structureId"), sys.Str.type$));
    rooms.each((room) => {
      acc.add(haystack.Etc.makeDict(sys.Map.__fromLiteral(["learn","dis"], [haystack.Etc.makeDict(sys.Map.__fromLiteral(["room"], [room.name()], sys.Type.find("sys::Str"), sys.Type.find("sys::Uri"))),room.dis()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))));
      return;
    });
    return acc;
  }

  learnDevices(arg) {
    const this$ = this;
    let room = sys.ObjUtil.as(arg.get("room"), sys.Uri.type$);
    let acc = sys.List.make(haystack.Dict.type$);
    let devices = this.client().devices().list();
    devices.each((device) => {
      if (!sys.ObjUtil.is(device, NestThermostat.type$)) {
        return;
      }
      ;
      let r = device.parentRelations().find((it) => {
        return sys.ObjUtil.equals(it.parent(), room);
      });
      if (r == null) {
        return;
      }
      ;
      let dis = sys.Str.trimToNull(device.dis());
      if (dis == null) {
        (dis = sys.Str.plus(sys.Str.plus(sys.Str.plus("", r.dis()), " "), device.typeName()));
      }
      ;
      acc.add(haystack.Etc.makeDict(sys.Map.__fromLiteral(["learn","dis"], [haystack.Etc.makeDict(sys.Map.__fromLiteral(["device","deviceId","dis"], [device.name(),device.id(),dis], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))),dis], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))));
      return;
    });
    return acc;
  }

  learnPoints(arg) {
    let deviceId = arg.get("deviceId");
    let device = this.client().devices().get(sys.ObjUtil.coerce(deviceId, sys.Str.type$));
    if (sys.ObjUtil.is(device, NestThermostat.type$)) {
      return this.learnThermostat(arg, sys.ObjUtil.coerce(device, NestThermostat.type$));
    }
    ;
    throw sys.Err.make(sys.Str.plus("Unsupported device: ", device.type()));
  }

  learnThermostat(arg,t) {
    let points = sys.List.make(haystack.Dict.type$);
    points.add(PointBuilder.make(t).dis("Humidity").kind("Number").unit(NestUtil.celsius()).cur("Humidity.ambientHumidityPercent").markers("zone,air,humidity,sensor").finish());
    points.add(PointBuilder.make(t).dis("Temp").kind("Number").unit(NestUtil.celsius()).cur("Temperature.ambientTemperatureCelsius").markers("zone,air,temp,sensor").finish());
    points.add(PointBuilder.make(t).dis("Thermostat Mode").kind("Str").enums("HEAT,COOL,HEATCOOL,OFF").curAndWrite("ThermostatMode.mode").finish());
    points.add(PointBuilder.make(t).dis("Thermostat Status").kind("Str").enums("OFF,HEATING,COOLING").cur("ThermostatHvac.status").markers("zone,air,hvacMode,sensor").finish());
    points.add(PointBuilder.make(t).dis("Heating Setpoint").kind("Number").unit(NestUtil.celsius()).curAndWrite("ThermostatTemperatureSetpoint.heatCelsius").markers("zone,air,temp,heating,sp").finish());
    points.add(PointBuilder.make(t).dis("Cooling Setpoint").kind("Number").unit(NestUtil.celsius()).curAndWrite("ThermostatTemperatureSetpoint.coolCelsius").markers("zone,air,temp,heating,sp").finish());
    return points;
  }

}

class PointBuilder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PointBuilder.type$; }

  #device = null;

  // private field reflection only
  __device(it) { if (it === undefined) return this.#device; else this.#device = it; }

  #tags = null;

  // private field reflection only
  __tags(it) { if (it === undefined) return this.#tags; else this.#tags = it; }

  static make(device) {
    const $self = new PointBuilder();
    PointBuilder.make$($self,device);
    return $self;
  }

  static make$($self,device) {
    $self.#device = device;
    $self.#tags = sys.Map.__fromLiteral(["point","nestPoint"], [haystack.Marker.val(),haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    return;
  }

  set(tag,val) {
    this.#tags.set(tag, sys.ObjUtil.coerce(val, sys.Obj.type$));
    return this;
  }

  dis(dis) {
    return this.set("dis", dis);
  }

  kind(kind) {
    return this.set("kind", kind);
  }

  unit(unit) {
    return this.set("unit", unit.toStr());
  }

  cur(trait) {
    return this.set("nestCur", sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#device.id()), ":"), trait));
  }

  write(trait) {
    return this.set("nestWrite", sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#device.id()), ":"), trait)).markers("writable");
  }

  curAndWrite(trait) {
    return this.cur(trait).write(trait);
  }

  enums(enums) {
    return this.set("enum", enums);
  }

  markers(markers) {
    const this$ = this;
    sys.Str.split(markers, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).each((marker) => {
      this$.#tags.set(marker, haystack.Marker.val());
      return;
    });
    return this;
  }

  finish() {
    return haystack.Etc.makeDict(this.#tags);
  }

}

const p = sys.Pod.add$('hxNest');
const xp = sys.Param.noParams$();
let m;
NestLib.type$ = p.at$('NestLib','hxConn::ConnLib',[],{},8194,NestLib);
Nest.type$ = p.at$('Nest','sys::Obj',[],{},8194,Nest);
NestDispatch.type$ = p.at$('NestDispatch','hxConn::ConnDispatch',[],{},8192,NestDispatch);
NestUtil.type$ = p.am$('NestUtil','sys::Obj',[],{},385,NestUtil);
NestErr.type$ = p.at$('NestErr','sys::Err',[],{},8194,NestErr);
ApiReq.type$ = p.at$('ApiReq','sys::Obj',[],{},8192,ApiReq);
StructuresReq.type$ = p.at$('StructuresReq','hxNest::ApiReq',[],{},8192,StructuresReq);
RoomsReq.type$ = p.at$('RoomsReq','hxNest::ApiReq',[],{},8192,RoomsReq);
DevicesReq.type$ = p.at$('DevicesReq','hxNest::ApiReq',[],{},8192,DevicesReq);
NestResource.type$ = p.at$('NestResource','sys::Obj',[],{},8195,NestResource);
NestDevice.type$ = p.at$('NestDevice','hxNest::NestResource',[],{},8194,NestDevice);
ParentRelation.type$ = p.at$('ParentRelation','sys::Obj',[],{},8194,ParentRelation);
NestStructure.type$ = p.at$('NestStructure','hxNest::NestResource',[],{},8194,NestStructure);
NestRoom.type$ = p.at$('NestRoom','hxNest::NestResource',[],{},8194,NestRoom);
NestThermostat.type$ = p.at$('NestThermostat','hxNest::NestDevice',[],{},8194,NestThermostat);
Connectivity.type$ = p.at$('Connectivity','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,Connectivity);
ThermostatMode.type$ = p.at$('ThermostatMode','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,ThermostatMode);
HvacStatus.type$ = p.at$('HvacStatus','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,HvacStatus);
NestConnTask.type$ = p.at$('NestConnTask','sys::Obj',[],{},129,NestConnTask);
NestSyncCur.type$ = p.at$('NestSyncCur','hxNest::NestConnTask',[],{},128,NestSyncCur);
NestTraitRef.type$ = p.at$('NestTraitRef','sys::Obj',[],{},130,NestTraitRef);
NestWrite.type$ = p.at$('NestWrite','hxNest::NestConnTask',[],{},128,NestWrite);
NestLearn.type$ = p.at$('NestLearn','hxNest::NestConnTask',['hxNest::NestUtil'],{},128,NestLearn);
PointBuilder.type$ = p.at$('PointBuilder','sys::Obj',[],{},128,PointBuilder);
NestLib.type$.am$('cur',40962,'hxNest::NestLib?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('make',139268,'sys::Void',xp,{});
Nest.type$.af$('tokenUri',100354,'sys::Uri',{}).af$('projectId',65666,'sys::Str',{}).af$('client',65666,'oauth2::OAuthClient',{}).af$('log',73730,'sys::Log',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('projectId','sys::Str',false),new sys.Param('clientId','sys::Str',false),new sys.Param('clientSecret','sys::Str',false),new sys.Param('refreshToken','sys::Str',false),new sys.Param('log','sys::Log',true)]),{}).am$('structures',8192,'hxNest::StructuresReq',xp,{}).am$('rooms',8192,'hxNest::RoomsReq',xp,{}).am$('devices',8192,'hxNest::DevicesReq',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
NestDispatch.type$.af$('client',65664,'hxNest::Nest?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('nestLib',2048,'hxNest::NestLib',xp,{}).am$('onOpen',271360,'sys::Void',xp,{}).am$('password',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('onClose',271360,'sys::Void',xp,{}).am$('onPing',271360,'haystack::Dict',xp,{}).am$('onSyncCur',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onWrite',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('event','hxConn::ConnWriteInfo',false)]),{}).am$('onLearn',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj?',false)]),{});
NestUtil.type$.af$('celsius',106498,'sys::Unit',{}).af$('fahr',106498,'sys::Unit',{}).af$('relHum',106498,'sys::Unit',{}).am$('nestToHay',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('unit','sys::Unit?',true)]),{}).am$('getTraitVal',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('res','hxNest::NestResource',false),new sys.Param('ref','hxNest::NestTraitRef',false)]),{}).am$('toUnit',40962,'sys::Unit?',sys.List.make(sys.Param.type$,[new sys.Param('res','hxNest::NestResource',false),new sys.Param('ref','hxNest::NestTraitRef',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
NestErr.type$.af$('error',73730,'[sys::Str:sys::Obj?]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('error','[sys::Str:sys::Obj?]',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('code',8192,'sys::Int',xp,{}).am$('message',8192,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
ApiReq.type$.af$('baseUri',100354,'sys::Uri',{}).af$('debugCounter',100354,'concurrent::AtomicInt',{}).af$('projectId',69634,'sys::Str',{}).af$('client',69634,'oauth2::OAuthClient',{}).af$('log',69634,'sys::Log?',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('projectId','sys::Str',false),new sys.Param('client','oauth2::OAuthClient',false),new sys.Param('log','sys::Log?',true)]),{}).am$('isDebug',2048,'sys::Bool',xp,{}).am$('projectUri',4096,'sys::Uri',xp,{}).am$('invoke',8192,'sys::Map?',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('uri','sys::Uri',false),new sys.Param('req','sys::Obj?',true),new sys.Param('headers','[sys::Str:sys::Str]',true)]),{}).am$('call',8192,'web::WebClient',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('uri','sys::Uri',false),new sys.Param('req','sys::Obj?',true),new sys.Param('headers','[sys::Str:sys::Str]',true)]),{'sys::NoDoc':""}).am$('readJson',128,'sys::Map',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false),new sys.Param('count','sys::Int',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
StructuresReq.type$.am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('nest','hxNest::Nest',false)]),{}).am$('list',8192,'hxNest::NestStructure[]',xp,{}).am$('get',8192,'hxNest::NestStructure',sys.List.make(sys.Param.type$,[new sys.Param('structureId','sys::Str',false)]),{});
RoomsReq.type$.am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('nest','hxNest::Nest',false)]),{}).am$('list',8192,'hxNest::NestRoom[]',sys.List.make(sys.Param.type$,[new sys.Param('structureId','sys::Str',false)]),{}).am$('get',8192,'hxNest::NestRoom',sys.List.make(sys.Param.type$,[new sys.Param('structureId','sys::Str',false),new sys.Param('roomId','sys::Str',false)]),{});
DevicesReq.type$.am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('nest','hxNest::Nest',false)]),{}).am$('list',8192,'hxNest::NestDevice[]',xp,{}).am$('get',8192,'hxNest::NestDevice',sys.List.make(sys.Param.type$,[new sys.Param('deviceId','sys::Str',false)]),{}).am$('exec',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('deviceId','sys::Str',false),new sys.Param('command','sys::Str',false),new sys.Param('params','sys::Map',false)]),{});
NestResource.type$.af$('celsius',102402,'sys::Unit',{}).af$('relHum',102402,'sys::Unit',{}).af$('json',73730,'[sys::Str:sys::Obj?]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('json','[sys::Str:sys::Obj?]',false)]),{}).am$('traitsKey',266241,'sys::Str',xp,{}).am$('name',8192,'sys::Uri',xp,{}).am$('id',270336,'sys::Str',xp,{}).am$('dis',270336,'sys::Str',xp,{}).am$('traits',8192,'[sys::Str:sys::Obj?]',xp,{}).am$('trait',8192,'sys::Map',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('traitVal',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('trait','sys::Str',false),new sys.Param('field','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
NestDevice.type$.af$('traitsKey',332802,'sys::Str',{}).am$('fromJson',40962,'hxNest::NestDevice',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Map',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Map',false)]),{}).am$('type',8192,'sys::Str',xp,{}).am$('typeName',8192,'sys::Str',xp,{}).am$('parentRelations',8192,'hxNest::ParentRelation[]',xp,{});
ParentRelation.type$.af$('parent',73730,'sys::Uri',{}).af$('dis',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Map',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
NestStructure.type$.af$('traitsKey',332802,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Map',false)]),{});
NestRoom.type$.af$('traitsKey',332802,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Map',false)]),{}).am$('dis',271360,'sys::Str',xp,{}).am$('structureId',8192,'sys::Str',xp,{});
NestThermostat.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Map',false)]),{}).am$('connectivity',8192,'hxNest::Connectivity',xp,{}).am$('isFanOn',8192,'sys::Bool',xp,{}).am$('humidity',8192,'sys::Float',xp,{}).am$('temperature',8192,'sys::Float',xp,{}).am$('status',8192,'hxNest::HvacStatus',xp,{}).am$('mode',8192,'hxNest::ThermostatMode',xp,{}).am$('setpoint',8192,'[sys::Str:sys::Float]',xp,{});
Connectivity.type$.af$('ONLINE',106506,'hxNest::Connectivity',{}).af$('OFFLINE',106506,'hxNest::Connectivity',{}).af$('vals',106498,'hxNest::Connectivity[]',{}).am$('isOnline',8192,'sys::Bool',xp,{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'hxNest::Connectivity?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ThermostatMode.type$.af$('HEAT',106506,'hxNest::ThermostatMode',{}).af$('COOL',106506,'hxNest::ThermostatMode',{}).af$('HEATCOOL',106506,'hxNest::ThermostatMode',{}).af$('OFF',106506,'hxNest::ThermostatMode',{}).af$('vals',106498,'hxNest::ThermostatMode[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'hxNest::ThermostatMode?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
HvacStatus.type$.af$('OFF',106506,'hxNest::HvacStatus',{}).af$('HEATING',106506,'hxNest::HvacStatus',{}).af$('COOLING',106506,'hxNest::HvacStatus',{}).af$('vals',106498,'hxNest::HvacStatus[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'hxNest::HvacStatus?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
NestConnTask.type$.af$('dispatch',73728,'hxNest::NestDispatch',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dispatch','hxNest::NestDispatch',false)]),{}).am$('client',8192,'hxNest::Nest',xp,{}).am$('conn',8192,'hxConn::Conn',xp,{}).am$('log',270336,'sys::Log',xp,{}).am$('run',270337,'sys::Obj?',xp,{}).am$('openPin',4096,'sys::Void',xp,{}).am$('closePin',4096,'sys::Void',xp,{}).am$('toCurId',32898,'hxNest::NestTraitRef',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('toWriteId',32898,'hxNest::NestTraitRef',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('toRemoteId',32898,'hxNest::NestTraitRef',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('tag','sys::Str',false)]),{});
NestSyncCur.type$.af$('points',67584,'hxConn::ConnPoint[]',{}).af$('byDevice',67584,'[sys::Str:hxConn::ConnPoint[]]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dispatch','hxNest::NestDispatch',false),new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('run',271360,'sys::Obj?',xp,{}).am$('init',2048,'sys::Void',xp,{}).am$('syncDevice',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('deviceId','sys::Str',false),new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('updateCur',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('device','hxNest::NestDevice',false),new sys.Param('point','hxConn::ConnPoint',false)]),{});
NestTraitRef.type$.af$('deviceId',73730,'sys::Str',{}).af$('trait',73730,'sys::Str',{}).af$('field',73730,'sys::Str',{}).am$('fromStr',40966,'hxNest::NestTraitRef?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('deviceId','sys::Str',false),new sys.Param('trait','sys::Str',false),new sys.Param('field','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
NestWrite.type$.af$('point',67586,'hxConn::ConnPoint',{}).af$('event',67586,'hxConn::ConnWriteInfo',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dispatch','hxNest::NestDispatch',false),new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('event','hxConn::ConnWriteInfo',false)]),{}).am$('run',271360,'sys::Obj?',xp,{}).am$('cmd',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('trait','sys::Str',false),new sys.Param('command','sys::Str',false)]),{}).am$('toCelsius',2048,'sys::Float',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{});
NestLearn.type$.af$('arg',67584,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dispatch','hxNest::NestDispatch',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('learn',8192,'haystack::Grid',xp,{}).am$('run',271360,'sys::Obj?',xp,{}).am$('learnStructures',2048,'haystack::Dict[]',xp,{}).am$('learnRooms',2048,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('arg','haystack::Dict',false)]),{}).am$('learnDevices',2048,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('arg','haystack::Dict',false)]),{}).am$('learnPoints',2048,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('arg','haystack::Dict',false)]),{}).am$('learnThermostat',2048,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('arg','haystack::Dict',false),new sys.Param('t','hxNest::NestThermostat',false)]),{});
PointBuilder.type$.af$('device',67584,'hxNest::NestDevice',{}).af$('tags',67584,'[sys::Str:sys::Obj]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('device','hxNest::NestDevice',false)]),{}).am$('set',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('dis',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('dis','sys::Str',false)]),{}).am$('kind',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('kind','sys::Str',false)]),{}).am$('unit',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('unit','sys::Unit',false)]),{}).am$('cur',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('trait','sys::Str',false)]),{}).am$('write',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('trait','sys::Str',false)]),{}).am$('curAndWrite',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('trait','sys::Str',false)]),{}).am$('enums',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('enums','sys::Str',false)]),{}).am$('markers',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('markers','sys::Str',false)]),{}).am$('finish',8192,'haystack::Dict',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxNest");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;web 1.0;util 1.0;haystack 3.1.11;axon 3.1.11;folio 3.1.11;hx 3.1.11;hxConn 3.1.11;oauth2 3.1.11");
m.set("pod.summary", "Google Nest connector");
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
  NestLib,
  Nest,
  NestDispatch,
  NestErr,
  ApiReq,
  StructuresReq,
  RoomsReq,
  DevicesReq,
  NestResource,
  NestDevice,
  ParentRelation,
  NestStructure,
  NestRoom,
  NestThermostat,
  Connectivity,
  ThermostatMode,
  HvacStatus,
};
