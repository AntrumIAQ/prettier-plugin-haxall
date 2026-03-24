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
class EcobeeErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeErr.type$; }

  #status = null;

  status() { return this.#status; }

  __status(it) { if (it === undefined) return this.#status; else this.#status = it; }

  static make(status,cause) {
    const $self = new EcobeeErr();
    EcobeeErr.make$($self,status,cause);
    return $self;
  }

  static make$($self,status,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, status.message(), cause);
    $self.#status = status;
    return;
  }

  code() {
    return this.#status.code();
  }

  message() {
    return this.#status.message();
  }

  toStr() {
    return this.#status.toStr();
  }

}

class EcobeeDispatch extends hxConn.ConnDispatch {
  constructor() {
    super();
    const this$ = this;
    this.#lastPollSummary = sys.DateTime.defVal();
    return;
  }

  typeof() { return EcobeeDispatch.type$; }

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

  #latestSummary = null;

  // private field reflection only
  __latestSummary(it) { if (it === undefined) return this.#latestSummary; else this.#latestSummary = it; }

  #lastPollSummary = null;

  // private field reflection only
  __lastPollSummary(it) { if (it === undefined) return this.#lastPollSummary; else this.#lastPollSummary = it; }

  static #ecobeePollInterval = undefined;

  static ecobeePollInterval() {
    if (EcobeeDispatch.#ecobeePollInterval === undefined) {
      EcobeeDispatch.static$init();
      if (EcobeeDispatch.#ecobeePollInterval === undefined) EcobeeDispatch.#ecobeePollInterval = null;
    }
    return EcobeeDispatch.#ecobeePollInterval;
  }

  static make(arg) {
    const $self = new EcobeeDispatch();
    EcobeeDispatch.make$($self,arg);
    return $self;
  }

  static make$($self,arg) {
    hxConn.ConnDispatch.make$($self, arg);
    ;
    return;
  }

  ecobeeLib() {
    return sys.ObjUtil.coerce(this.lib(), EcobeeLib.type$);
  }

  onOpen() {
    this.#client = Ecobee.make(this.password("ecobeeClientId"), this.password("ecobeeRefreshToken"), this.trace().asLog());
    this.pollSummary();
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
    return haystack.Etc.emptyDict();
  }

  pollSummary() {
    const this$ = this;
    if (sys.ObjUtil.compareLT(this.#lastPollSummary.plus(EcobeeDispatch.ecobeePollInterval()), sys.DateTime.now())) {
      this.#latestSummary = this.#client.thermostat().summary(EcobeeSelection.make((it) => {
        it.__selectionType(SelectionType.registered());
        it.__includeRuntime(true);
        return;
      }));
      this.#lastPollSummary = sys.DateTime.now();
    }
    ;
    return sys.ObjUtil.coerce(this.#latestSummary, ThermostatSummaryResp.type$);
  }

  onSyncCur(points) {
    EcobeeSyncCur.make(this, points).run();
    return;
  }

  onWrite(point,event) {
    EcobeeWrite.make(this, point, event).run();
    return;
  }

  onSyncHis(point,span) {
    return EcobeeSyncHis.make(this, point, span).run();
  }

  onLearn(arg) {
    return EcobeeLearn.make(this, arg).learn();
  }

  static static$init() {
    EcobeeDispatch.#ecobeePollInterval = sys.Duration.fromStr("3min");
    return;
  }

}

class EcobeeUtil {
  constructor() {
    const this$ = this;
  }

  typeof() { return EcobeeUtil.type$; }

  static #fahr = undefined;

  static fahr() {
    if (EcobeeUtil.#fahr === undefined) {
      EcobeeUtil.static$init();
      if (EcobeeUtil.#fahr === undefined) EcobeeUtil.#fahr = null;
    }
    return EcobeeUtil.#fahr;
  }

  static #relHum = undefined;

  static relHum() {
    if (EcobeeUtil.#relHum === undefined) {
      EcobeeUtil.static$init();
      if (EcobeeUtil.#relHum === undefined) EcobeeUtil.#relHum = null;
    }
    return EcobeeUtil.#relHum;
  }

  static #sec = undefined;

  static sec() {
    if (EcobeeUtil.#sec === undefined) {
      EcobeeUtil.static$init();
      if (EcobeeUtil.#sec === undefined) EcobeeUtil.#sec = null;
    }
    return EcobeeUtil.#sec;
  }

  static toHay(val,unit) {
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

  static toEcobee(val,field) {
    if (val == null) {
      return null;
    }
    ;
    return sys.ObjUtil.toStr(val);
  }

  static static$init() {
    EcobeeUtil.#fahr = sys.ObjUtil.coerce(sys.Unit.fromStr("fahrenheit"), sys.Unit.type$);
    EcobeeUtil.#relHum = sys.ObjUtil.coerce(sys.Unit.fromStr("%RH"), sys.Unit.type$);
    EcobeeUtil.#sec = sys.ObjUtil.coerce(sys.Unit.fromStr("second"), sys.Unit.type$);
    return;
  }

}

class EcobeeLib extends hxConn.ConnLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeLib.type$; }

  static cur(checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(hx.HxContext.curHx().rt().lib("ecobee", checked), EcobeeLib.type$.toNullable());
  }

  static make() {
    const $self = new EcobeeLib();
    EcobeeLib.make$($self);
    return $self;
  }

  static make$($self) {
    hxConn.ConnLib.make$($self);
    return;
  }

}

class EcobeeFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeFuncs.type$; }

  static curHx() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static lib(cx) {
    if (cx === undefined) cx = EcobeeFuncs.curHx();
    return sys.ObjUtil.coerce(cx.rt().lib("ecobee"), EcobeeLib.type$);
  }

  static make() {
    const $self = new EcobeeFuncs();
    EcobeeFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Ecobee extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Ecobee.type$; }

  static #tokenUri = undefined;

  static tokenUri() {
    if (Ecobee.#tokenUri === undefined) {
      Ecobee.static$init();
      if (Ecobee.#tokenUri === undefined) Ecobee.#tokenUri = null;
    }
    return Ecobee.#tokenUri;
  }

  #client = null;

  client() { return this.#client; }

  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  static make(clientId,refreshToken,log) {
    const $self = new Ecobee();
    Ecobee.make$($self,clientId,refreshToken,log);
    return $self;
  }

  static make$($self,clientId,refreshToken,log) {
    if (log === undefined) log = sys.Log.get("ecobee");
    const this$ = $self;
    let token = oauth2.RawAccessToken.make("ForceRefreshAuthToken", (it) => {
      it.__refreshToken(refreshToken);
      return;
    });
    let params = sys.Map.__fromLiteral(["client_id"], [clientId], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    $self.#client = oauth2.OAuthClient.makeRefreshable(token, Ecobee.tokenUri(), params);
    $self.#log = log;
    return;
  }

  thermostat() {
    return ThermostatReq.make(this);
  }

  report() {
    return ReportReq.make(this);
  }

  static static$init() {
    Ecobee.#tokenUri = sys.Uri.fromStr("https://api.ecobee.com/token");
    return;
  }

}

class EcobeeAuthorization extends util.AbstractMain {
  constructor() {
    super();
    const this$ = this;
    this.#scope = "smartRead";
    return;
  }

  typeof() { return EcobeeAuthorization.type$; }

  #scope = null;

  scope(it) {
    if (it === undefined) {
      return this.#scope;
    }
    else {
      this.#scope = it;
      return;
    }
  }

  run() {
    let apiKey = sys.Env.cur().prompt("Ecobee API Key: ");
    let params = sys.Map.__fromLiteral(["response_type","client_id","scope"], ["ecobeePin",sys.ObjUtil.coerce(apiKey, sys.Str.type$),this.#scope], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let s = web.WebClient.make(sys.Uri.fromStr("https://api.ecobee.com/authorize").plusQuery(params)).getStr();
    let json = sys.ObjUtil.coerce(util.JsonInStream.make(sys.Str.in(s)).readJson(), sys.Type.find("sys::Map"));
    let pin = json.get("ecobeePin");
    let poll = sys.Duration.fromStr(sys.Str.plus(sys.ObjUtil.toStr(json.get("interval")), "sec"));
    sys.Env.cur().out().printLine(sys.Str.plus(sys.Str.plus("\nOn the Ecobee Portal go to 'My Apps' and select 'Add Application'.\nValidate your application with this PIN:\n\n    ", pin), "\n\nAfter entering the PIN on the portal, check back here to see your generated\nrefresh token.\n"));
    (params = sys.Map.__fromLiteral(["grant_type","client_id","code","ecobee_type"], ["ecobeePin",sys.ObjUtil.coerce(apiKey, sys.Str.type$),sys.ObjUtil.coerce(json.get("code"), sys.Str.type$),"jwt"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    let start = sys.DateTime.now();
    while (true) {
      concurrent.Actor.sleep(sys.ObjUtil.coerce(poll, sys.Duration.type$));
      (s = web.WebClient.make(sys.Uri.fromStr("https://api.ecobee.com/token")).postForm(params).resStr());
      (json = sys.ObjUtil.coerce(util.JsonInStream.make(sys.Str.in(s)).readJson(), sys.Type.find("sys::Map")));
      if (json.get("access_token") != null) {
        break;
      }
      ;
      if (sys.ObjUtil.compareGT(sys.DateTime.now().minusDateTime(start), sys.Duration.fromStr("2min"))) {
        throw sys.Err.make("Took too long to validate pin");
      }
      ;
    }
    ;
    let refreshToken = json.get("refresh_token");
    sys.Env.cur().out().printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("You will need to set these tags on your Ecobee connector:\n\necobeeClientId: ", apiKey), "\necobeeRefreshToken: "), refreshToken), "\n"));
    return 0;
  }

  static make() {
    const $self = new EcobeeAuthorization();
    EcobeeAuthorization.make$($self);
    return $self;
  }

  static make$($self) {
    util.AbstractMain.make$($self);
    ;
    return;
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

  #client = null;

  client() { return this.#client; }

  __client(it) { if (it === undefined) return this.#client; else this.#client = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  static #debugCounter = undefined;

  static debugCounter() {
    if (ApiReq.#debugCounter === undefined) {
      ApiReq.static$init();
      if (ApiReq.#debugCounter === undefined) ApiReq.#debugCounter = null;
    }
    return ApiReq.#debugCounter;
  }

  static make(client,log) {
    const $self = new ApiReq();
    ApiReq.make$($self,client,log);
    return $self;
  }

  static make$($self,client,log) {
    if (log === undefined) log = null;
    $self.#client = client;
    $self.#log = log;
    return;
  }

  isDebug() {
    return sys.ObjUtil.coerce(((this$) => { let $_u1 = ((this$) => { let $_u2 = this$.#log; if ($_u2 == null) return null; return this$.#log.isDebug(); })(this$); if ($_u1 != null) return $_u1; return sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()); })(this), sys.Bool.type$);
  }

  invokeGet(endpoint,obj,page) {
    if (page === undefined) page = null;
    let bodyJson = sys.Map.__fromLiteral([obj.jsonKey()], [obj], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    if (page != null) {
      bodyJson.set("page", EcobeePage.makeReq(sys.ObjUtil.coerce(page, sys.Int.type$)));
    }
    ;
    let body = EcobeeEncoder.jsonStr(bodyJson);
    let query = sys.Map.__fromLiteral(["format","body"], ["json",body], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let json = this.invoke("GET", ApiReq.baseUri().plus(endpoint).plusQuery(query));
    let respType = ((this$) => { let $_u3 = sys.ObjUtil.typeof(this$).pod().type(sys.Str.plus(sys.Str.plus("", sys.Str.capitalize(endpoint.path().last())), "Resp"), false); if ($_u3 != null) return $_u3; return EcobeeResp.type$; })(this);
    return sys.ObjUtil.coerce(EcobeeDecoder.make().decode(json, sys.ObjUtil.coerce(respType, sys.Type.type$)), EcobeeObj.type$);
  }

  invoke(method,uri,req,headers) {
    if (req === undefined) req = null;
    if (headers === undefined) headers = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    let c = this.call(method, uri, req, headers);
    return this.readJson(c);
  }

  call(method,uri,req,headers) {
    if (req === undefined) req = null;
    if (headers === undefined) headers = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    const this$ = this;
    let attempt = 0;
    while (true) {
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
        ;
        if (sys.ObjUtil.is(req, sys.File.type$)) {
          s.add(sys.Str.trimEnd(sys.ObjUtil.coerce(req, sys.File.type$).readAllStr())).add("\n");
        }
        ;
        this.#log.debug(s.toStr());
      }
      ;
      attempt = sys.Int.increment(attempt);
      let c = this.#client.call(method, uri, req, headers);
      if (sys.ObjUtil.equals(c.resCode(), 200)) {
        return c;
      }
      ;
      try {
        if (sys.ObjUtil.compareNE(c.resCode(), 500)) {
          throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unexpected response [", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), "] "), c.resPhrase()));
        }
        ;
        let json = this.readJson(c, count);
        let resp = sys.ObjUtil.coerce(EcobeeDecoder.make().decode(json, EcobeeResp.type$), EcobeeResp.type$);
        if ((resp.status().isTokenExpired() && sys.ObjUtil.compareLT(attempt, 2))) {
          this.#client.refreshToken();
          continue;
        }
        ;
        throw EcobeeErr.make(resp.status());
      }
      finally {
        c.close();
      }
      ;
    }
    ;
    throw sys.IOErr.make("Compiler requires this");
  }

  readJson(c,count) {
    if (count === undefined) count = sys.Int.minus(ApiReq.debugCounter().val(), 1);
    const this$ = this;
    let jstr = c.resStr();
    if (this.isDebug()) {
      let s = sys.StrBuf.make().add(sys.Str.plus(sys.Str.plus("< [", sys.ObjUtil.coerce(count, sys.Obj.type$.toNullable())), "]\n")).add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), " "), c.resPhrase()), "\n"));
      c.resHeaders().each((v,n) => {
        s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), v), "\n"));
        return;
      });
      s.add(sys.Str.plus(sys.Str.plus("", sys.Str.trimEnd(jstr)), "\n"));
      this.#log.debug(s.toStr());
    }
    ;
    return sys.ObjUtil.coerce(util.JsonInStream.make(sys.Str.in(jstr)).readJson(), sys.Type.find("sys::Map"));
  }

  static static$init() {
    ApiReq.#baseUri = sys.Uri.fromStr("https://api.ecobee.com/1/");
    ApiReq.#debugCounter = concurrent.AtomicInt.make();
    return;
  }

}

class ThermostatReq extends ApiReq {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThermostatReq.type$; }

  static make(ecobee) {
    const $self = new ThermostatReq();
    ThermostatReq.make$($self,ecobee);
    return $self;
  }

  static make$($self,ecobee) {
    ApiReq.make$($self, ecobee.client(), ecobee.log());
    return;
  }

  summary(selection) {
    return sys.ObjUtil.coerce(this.invokeGet(sys.Uri.fromStr("thermostatSummary"), selection), ThermostatSummaryResp.type$);
  }

  get(selection) {
    let acc = sys.List.make(EcobeeThermostat.type$);
    let page = 1;
    while (true) {
      let resp = sys.ObjUtil.as(this.invokeGet(sys.Uri.fromStr("thermostat"), selection, sys.ObjUtil.coerce(page, sys.Int.type$.toNullable())), ThermostatResp.type$);
      acc.addAll(resp.thermostatList());
      if (!resp.morePages()) {
        break;
      }
      ;
      page = sys.Int.increment(page);
    }
    ;
    return acc;
  }

  update(selection,thermostat) {
    let uri = ApiReq.baseUri().plus(sys.Uri.fromStr("thermostat")).plusQuery(sys.Map.__fromLiteral(["format"], ["json"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    let bodyJson = sys.Map.__fromLiteral([selection.jsonKey(),thermostat.jsonKey()], [selection,thermostat], sys.Type.find("sys::Str"), sys.Type.find("hxEcobee::EcobeeObj"));
    let body = sys.Str.toBuf(EcobeeEncoder.jsonStr(bodyJson)).toFile(sys.Uri.fromStr("update.json"));
    let resp = this.invoke("POST", uri, body);
    return;
  }

  callFunc(selection,func) {
    let uri = ApiReq.baseUri().plus(sys.Uri.fromStr("thermostat")).plusQuery(sys.Map.__fromLiteral(["format"], ["json"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    let bodyJson = sys.Map.__fromLiteral([selection.jsonKey(),"functions"], [selection,sys.List.make(EcobeeFunction.type$, [func])], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let body = sys.Str.toBuf(EcobeeEncoder.jsonStr(bodyJson)).toFile(sys.Uri.fromStr("event.json"));
    let resp = this.invoke("POST", uri, body);
    return;
  }

}

class EcobeeObj extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#resJson = null;
    return;
  }

  typeof() { return EcobeeObj.type$; }

  #resJson = null;

  resJson() { return this.#resJson; }

  __resJson(it) { if (it === undefined) return this.#resJson; else this.#resJson = it; }

  static make() {
    const $self = new EcobeeObj();
    EcobeeObj.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  id() {
    return null;
  }

  jsonKey() {
    return sys.Str.decapitalize(sys.Str.getRange(sys.ObjUtil.typeof(this).name(), sys.Range.make(6, -1)));
  }

  encode() {
    return EcobeeEncoder.jsonStr(this);
  }

}

class EcobeeResp extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeResp.type$; }

  #page = null;

  page() { return this.#page; }

  __page(it) { if (it === undefined) return this.#page; else this.#page = it; }

  #status = null;

  status() { return this.#status; }

  __status(it) { if (it === undefined) return this.#status; else this.#status = it; }

  static make(f) {
    const $self = new EcobeeResp();
    EcobeeResp.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

  morePages() {
    return sys.ObjUtil.coerce(((this$) => { let $_u4 = ((this$) => { let $_u5 = this$.#page; if ($_u5 == null) return null; return this$.#page.morePages(); })(this$); if ($_u4 != null) return $_u4; return sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()); })(this), sys.Bool.type$);
  }

}

class ThermostatSummaryResp extends EcobeeResp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThermostatSummaryResp.type$; }

  #thermostatCount = 0;

  thermostatCount() { return this.#thermostatCount; }

  __thermostatCount(it) { if (it === undefined) return this.#thermostatCount; else this.#thermostatCount = it; }

  #revisionList = null;

  revisionList() { return this.#revisionList; }

  __revisionList(it) { if (it === undefined) return this.#revisionList; else this.#revisionList = it; }

  #statusList = null;

  statusList() { return this.#statusList; }

  __statusList(it) { if (it === undefined) return this.#statusList; else this.#statusList = it; }

  static make(f) {
    const $self = new ThermostatSummaryResp();
    ThermostatSummaryResp.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeResp.make$($self, sys.ObjUtil.coerce(f, sys.Type.find("|hxEcobee::EcobeeResp->sys::Void|")));
    sys.Func.call(f, $self);
    return;
  }

  revisions() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxEcobee::ThermostatRev")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:hxEcobee::ThermostatRev]")).setList(this.#revisionList, (it) => {
      return it.id();
    });
  }

}

class ThermostatResp extends EcobeeResp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThermostatResp.type$; }

  #thermostatList = null;

  thermostatList() { return this.#thermostatList; }

  __thermostatList(it) { if (it === undefined) return this.#thermostatList; else this.#thermostatList = it; }

  static make(f) {
    const $self = new ThermostatResp();
    ThermostatResp.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeResp.make$($self, sys.ObjUtil.coerce(f, sys.Type.find("|hxEcobee::EcobeeResp->sys::Void|")));
    sys.Func.call(f, $self);
    return;
  }

}

class ThermostatRev extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ThermostatRev.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #connected = false;

  connected() { return this.#connected; }

  __connected(it) { if (it === undefined) return this.#connected; else this.#connected = it; }

  #thermostatRev = null;

  thermostatRev() { return this.#thermostatRev; }

  __thermostatRev(it) { if (it === undefined) return this.#thermostatRev; else this.#thermostatRev = it; }

  #alertsRev = null;

  alertsRev() { return this.#alertsRev; }

  __alertsRev(it) { if (it === undefined) return this.#alertsRev; else this.#alertsRev = it; }

  #runtimeRev = null;

  runtimeRev() { return this.#runtimeRev; }

  __runtimeRev(it) { if (it === undefined) return this.#runtimeRev; else this.#runtimeRev = it; }

  #intervalRev = null;

  intervalRev() { return this.#intervalRev; }

  __intervalRev(it) { if (it === undefined) return this.#intervalRev; else this.#intervalRev = it; }

  static fromStr(csv) {
    const this$ = this;
    let cols = sys.Str.split(csv, sys.ObjUtil.coerce(58, sys.Int.type$.toNullable()));
    let dec = EcobeeDecoder.make();
    let fields = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Field"), sys.Type.find("sys::Obj"));
    ThermostatRev.type$.fields().each((f,i) => {
      fields.set(f, sys.ObjUtil.coerce(dec.decode(cols.get(i), f.type()), sys.Obj.type$));
      return;
    });
    let setter = sys.Field.makeSetFunc(fields);
    return sys.ObjUtil.coerce(ThermostatRev.type$.make(sys.List.make(sys.Type.find("|sys::Obj->sys::Void|"), [setter])), ThermostatRev.type$.toNullable());
  }

  static make(f) {
    const $self = new ThermostatRev();
    ThermostatRev.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    sys.Func.call(f, $self);
    return;
  }

}

class EquipmentStatus extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EquipmentStatus.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #status = null;

  status() { return this.#status; }

  __status(it) { if (it === undefined) return this.#status; else this.#status = it; }

  static fromStr(csv) {
    const this$ = this;
    let cols = sys.Str.split(csv, sys.ObjUtil.coerce(58, sys.Int.type$.toNullable()));
    let dec = EcobeeDecoder.make();
    let fields = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Field"), sys.Type.find("sys::Obj"));
    EquipmentStatus.type$.fields().each((f,i) => {
      fields.set(f, sys.ObjUtil.coerce(dec.decode(cols.get(i), f.type()), sys.Obj.type$));
      return;
    });
    let setter = sys.Field.makeSetFunc(fields);
    return sys.ObjUtil.coerce(EquipmentStatus.type$.make(sys.List.make(sys.Type.find("|sys::Obj->sys::Void|"), [setter])), EquipmentStatus.type$.toNullable());
  }

  static make(f) {
    const $self = new EquipmentStatus();
    EquipmentStatus.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    sys.Func.call(f, $self);
    return;
  }

}

class ReportReq extends ApiReq {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReportReq.type$; }

  static make(ecobee) {
    const $self = new ReportReq();
    ReportReq.make$($self,ecobee);
    return $self;
  }

  static make$($self,ecobee) {
    ApiReq.make$($self, ecobee.client(), ecobee.log());
    return;
  }

  runtime(req) {
    let query = sys.Map.__fromLiteral(["format","body"], ["json",EcobeeEncoder.jsonStr(req)], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    let json = this.invoke("GET", ApiReq.baseUri().plus(sys.Uri.fromStr("runtimeReport")).plusQuery(query));
    return sys.ObjUtil.coerce(EcobeeDecoder.make().decode(json, RuntimeReportResp.type$), RuntimeReportResp.type$);
  }

}

class RuntimeReportReq extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RuntimeReportReq.type$; }

  #selection = null;

  selection() { return this.#selection; }

  __selection(it) { if (it === undefined) return this.#selection; else this.#selection = it; }

  #startDate = null;

  startDate() { return this.#startDate; }

  __startDate(it) { if (it === undefined) return this.#startDate; else this.#startDate = it; }

  #startInterval = null;

  startInterval() { return this.#startInterval; }

  __startInterval(it) { if (it === undefined) return this.#startInterval; else this.#startInterval = it; }

  #endDate = null;

  endDate() { return this.#endDate; }

  __endDate(it) { if (it === undefined) return this.#endDate; else this.#endDate = it; }

  #endInterval = null;

  endInterval() { return this.#endInterval; }

  __endInterval(it) { if (it === undefined) return this.#endInterval; else this.#endInterval = it; }

  #columns = null;

  columns() { return this.#columns; }

  __columns(it) { if (it === undefined) return this.#columns; else this.#columns = it; }

  #includeSensors = null;

  includeSensors() { return this.#includeSensors; }

  __includeSensors(it) { if (it === undefined) return this.#includeSensors; else this.#includeSensors = it; }

  static make(f) {
    const $self = new RuntimeReportReq();
    RuntimeReportReq.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

}

class RuntimeReportResp extends EcobeeResp {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RuntimeReportResp.type$; }

  #startDate = null;

  startDate() { return this.#startDate; }

  __startDate(it) { if (it === undefined) return this.#startDate; else this.#startDate = it; }

  #startInterval = 0;

  startInterval() { return this.#startInterval; }

  __startInterval(it) { if (it === undefined) return this.#startInterval; else this.#startInterval = it; }

  #endDate = null;

  endDate() { return this.#endDate; }

  __endDate(it) { if (it === undefined) return this.#endDate; else this.#endDate = it; }

  #endInterval = 0;

  endInterval() { return this.#endInterval; }

  __endInterval(it) { if (it === undefined) return this.#endInterval; else this.#endInterval = it; }

  #columns = null;

  columns() { return this.#columns; }

  __columns(it) { if (it === undefined) return this.#columns; else this.#columns = it; }

  #reportList = null;

  reportList() { return this.#reportList; }

  __reportList(it) { if (it === undefined) return this.#reportList; else this.#reportList = it; }

  static make(f) {
    const $self = new RuntimeReportResp();
    RuntimeReportResp.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeResp.make$($self, sys.ObjUtil.coerce(f, sys.Type.find("|hxEcobee::EcobeeResp->sys::Void|")));
    sys.Func.call(f, $self);
    return;
  }

}

class EcobeePage extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeePage.type$; }

  #page = null;

  page() { return this.#page; }

  __page(it) { if (it === undefined) return this.#page; else this.#page = it; }

  #totalPages = null;

  totalPages() { return this.#totalPages; }

  __totalPages(it) { if (it === undefined) return this.#totalPages; else this.#totalPages = it; }

  #pageSize = null;

  pageSize() { return this.#pageSize; }

  __pageSize(it) { if (it === undefined) return this.#pageSize; else this.#pageSize = it; }

  #total = null;

  total() { return this.#total; }

  __total(it) { if (it === undefined) return this.#total; else this.#total = it; }

  static make(f) {
    const $self = new EcobeePage();
    EcobeePage.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

  static makeReq(page) {
    const $self = new EcobeePage();
    EcobeePage.makeReq$($self,page);
    return $self;
  }

  static makeReq$($self,page) {
    EcobeeObj.make$($self);
    $self.#page = sys.ObjUtil.coerce(sys.Int.max(page, 1), sys.Int.type$.toNullable());
    return;
  }

  morePages() {
    return (this.#page != null && this.#totalPages != null && sys.ObjUtil.compareLT(this.#page, this.#totalPages));
  }

}

class EcobeeRuntimeReport extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeRuntimeReport.type$; }

  #thermostatIdentifier = null;

  thermostatIdentifier() { return this.#thermostatIdentifier; }

  __thermostatIdentifier(it) { if (it === undefined) return this.#thermostatIdentifier; else this.#thermostatIdentifier = it; }

  #rowCount = null;

  rowCount() { return this.#rowCount; }

  __rowCount(it) { if (it === undefined) return this.#rowCount; else this.#rowCount = it; }

  #rowList = null;

  rowList() { return this.#rowList; }

  __rowList(it) { if (it === undefined) return this.#rowList; else this.#rowList = it; }

  static make(f) {
    const $self = new EcobeeRuntimeReport();
    EcobeeRuntimeReport.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

  id() {
    return this.#thermostatIdentifier;
  }

}

class EcobeeRuntime extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeRuntime.type$; }

  #runtimeRev = null;

  runtimeRev() { return this.#runtimeRev; }

  __runtimeRev(it) { if (it === undefined) return this.#runtimeRev; else this.#runtimeRev = it; }

  #connected = null;

  connected() { return this.#connected; }

  __connected(it) { if (it === undefined) return this.#connected; else this.#connected = it; }

  #firstConnected = null;

  firstConnected() { return this.#firstConnected; }

  __firstConnected(it) { if (it === undefined) return this.#firstConnected; else this.#firstConnected = it; }

  #connectDateTime = null;

  connectDateTime() { return this.#connectDateTime; }

  __connectDateTime(it) { if (it === undefined) return this.#connectDateTime; else this.#connectDateTime = it; }

  #disconnectDateTime = null;

  disconnectDateTime() { return this.#disconnectDateTime; }

  __disconnectDateTime(it) { if (it === undefined) return this.#disconnectDateTime; else this.#disconnectDateTime = it; }

  #lastModified = null;

  lastModified() { return this.#lastModified; }

  __lastModified(it) { if (it === undefined) return this.#lastModified; else this.#lastModified = it; }

  #lastStatusModified = null;

  lastStatusModified() { return this.#lastStatusModified; }

  __lastStatusModified(it) { if (it === undefined) return this.#lastStatusModified; else this.#lastStatusModified = it; }

  #runtimeDate = null;

  runtimeDate() { return this.#runtimeDate; }

  __runtimeDate(it) { if (it === undefined) return this.#runtimeDate; else this.#runtimeDate = it; }

  #runtimeInterval = null;

  runtimeInterval() { return this.#runtimeInterval; }

  __runtimeInterval(it) { if (it === undefined) return this.#runtimeInterval; else this.#runtimeInterval = it; }

  #actualTemperature = null;

  actualTemperature() { return this.#actualTemperature; }

  __actualTemperature(it) { if (it === undefined) return this.#actualTemperature; else this.#actualTemperature = it; }

  #actualHumidity = null;

  actualHumidity() { return this.#actualHumidity; }

  __actualHumidity(it) { if (it === undefined) return this.#actualHumidity; else this.#actualHumidity = it; }

  #rawTemperature = null;

  rawTemperature() { return this.#rawTemperature; }

  __rawTemperature(it) { if (it === undefined) return this.#rawTemperature; else this.#rawTemperature = it; }

  #desiredHeat = null;

  desiredHeat() { return this.#desiredHeat; }

  __desiredHeat(it) { if (it === undefined) return this.#desiredHeat; else this.#desiredHeat = it; }

  #desiredCool = null;

  desiredCool() { return this.#desiredCool; }

  __desiredCool(it) { if (it === undefined) return this.#desiredCool; else this.#desiredCool = it; }

  #desiredHumidity = null;

  desiredHumidity() { return this.#desiredHumidity; }

  __desiredHumidity(it) { if (it === undefined) return this.#desiredHumidity; else this.#desiredHumidity = it; }

  #desiredFanMode = null;

  desiredFanMode() { return this.#desiredFanMode; }

  __desiredFanMode(it) { if (it === undefined) return this.#desiredFanMode; else this.#desiredFanMode = it; }

  #actualVOC = null;

  actualVOC() { return this.#actualVOC; }

  __actualVOC(it) { if (it === undefined) return this.#actualVOC; else this.#actualVOC = it; }

  #actualCO2 = null;

  actualCO2() { return this.#actualCO2; }

  __actualCO2(it) { if (it === undefined) return this.#actualCO2; else this.#actualCO2 = it; }

  #actualAQAccuracy = null;

  actualAQAccuracy() { return this.#actualAQAccuracy; }

  __actualAQAccuracy(it) { if (it === undefined) return this.#actualAQAccuracy; else this.#actualAQAccuracy = it; }

  #actualAQScore = null;

  actualAQScore() { return this.#actualAQScore; }

  __actualAQScore(it) { if (it === undefined) return this.#actualAQScore; else this.#actualAQScore = it; }

  #desiredHeatRange = null;

  desiredHeatRange() { return this.#desiredHeatRange; }

  __desiredHeatRange(it) { if (it === undefined) return this.#desiredHeatRange; else this.#desiredHeatRange = it; }

  #desiredCoolRange = null;

  desiredCoolRange() { return this.#desiredCoolRange; }

  __desiredCoolRange(it) { if (it === undefined) return this.#desiredCoolRange; else this.#desiredCoolRange = it; }

  static make(f) {
    const $self = new EcobeeRuntime();
    EcobeeRuntime.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

}

class EcobeeSettings extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeSettings.type$; }

  #hvacMode = null;

  hvacMode() { return this.#hvacMode; }

  __hvacMode(it) { if (it === undefined) return this.#hvacMode; else this.#hvacMode = it; }

  #lastServiceDate = null;

  lastServiceDate() { return this.#lastServiceDate; }

  __lastServiceDate(it) { if (it === undefined) return this.#lastServiceDate; else this.#lastServiceDate = it; }

  #serviceRemindMe = null;

  serviceRemindMe() { return this.#serviceRemindMe; }

  __serviceRemindMe(it) { if (it === undefined) return this.#serviceRemindMe; else this.#serviceRemindMe = it; }

  #monthsBetweenService = null;

  monthsBetweenService() { return this.#monthsBetweenService; }

  __monthsBetweenService(it) { if (it === undefined) return this.#monthsBetweenService; else this.#monthsBetweenService = it; }

  #remindMeDate = null;

  remindMeDate() { return this.#remindMeDate; }

  __remindMeDate(it) { if (it === undefined) return this.#remindMeDate; else this.#remindMeDate = it; }

  #vent = null;

  vent() { return this.#vent; }

  __vent(it) { if (it === undefined) return this.#vent; else this.#vent = it; }

  #ventilatorMinOnTime = null;

  ventilatorMinOnTime() { return this.#ventilatorMinOnTime; }

  __ventilatorMinOnTime(it) { if (it === undefined) return this.#ventilatorMinOnTime; else this.#ventilatorMinOnTime = it; }

  #serviceRemindTechnician = null;

  serviceRemindTechnician() { return this.#serviceRemindTechnician; }

  __serviceRemindTechnician(it) { if (it === undefined) return this.#serviceRemindTechnician; else this.#serviceRemindTechnician = it; }

  #eiLocation = null;

  eiLocation() { return this.#eiLocation; }

  __eiLocation(it) { if (it === undefined) return this.#eiLocation; else this.#eiLocation = it; }

  #coldTempAlert = null;

  coldTempAlert() { return this.#coldTempAlert; }

  __coldTempAlert(it) { if (it === undefined) return this.#coldTempAlert; else this.#coldTempAlert = it; }

  #coldTempAlertEnabled = null;

  coldTempAlertEnabled() { return this.#coldTempAlertEnabled; }

  __coldTempAlertEnabled(it) { if (it === undefined) return this.#coldTempAlertEnabled; else this.#coldTempAlertEnabled = it; }

  #hotTempAlert = null;

  hotTempAlert() { return this.#hotTempAlert; }

  __hotTempAlert(it) { if (it === undefined) return this.#hotTempAlert; else this.#hotTempAlert = it; }

  #hotTempAlertEnabled = null;

  hotTempAlertEnabled() { return this.#hotTempAlertEnabled; }

  __hotTempAlertEnabled(it) { if (it === undefined) return this.#hotTempAlertEnabled; else this.#hotTempAlertEnabled = it; }

  #coolStages = null;

  coolStages() { return this.#coolStages; }

  __coolStages(it) { if (it === undefined) return this.#coolStages; else this.#coolStages = it; }

  #heatStages = null;

  heatStages() { return this.#heatStages; }

  __heatStages(it) { if (it === undefined) return this.#heatStages; else this.#heatStages = it; }

  #maxSetBack = null;

  maxSetBack() { return this.#maxSetBack; }

  __maxSetBack(it) { if (it === undefined) return this.#maxSetBack; else this.#maxSetBack = it; }

  #maxSetForward = null;

  maxSetForward() { return this.#maxSetForward; }

  __maxSetForward(it) { if (it === undefined) return this.#maxSetForward; else this.#maxSetForward = it; }

  #quickSaveSetBack = null;

  quickSaveSetBack() { return this.#quickSaveSetBack; }

  __quickSaveSetBack(it) { if (it === undefined) return this.#quickSaveSetBack; else this.#quickSaveSetBack = it; }

  #quickSaveSetForward = null;

  quickSaveSetForward() { return this.#quickSaveSetForward; }

  __quickSaveSetForward(it) { if (it === undefined) return this.#quickSaveSetForward; else this.#quickSaveSetForward = it; }

  #hasHeatPump = null;

  hasHeatPump() { return this.#hasHeatPump; }

  __hasHeatPump(it) { if (it === undefined) return this.#hasHeatPump; else this.#hasHeatPump = it; }

  #hasForcedAir = null;

  hasForcedAir() { return this.#hasForcedAir; }

  __hasForcedAir(it) { if (it === undefined) return this.#hasForcedAir; else this.#hasForcedAir = it; }

  #hasBoiler = null;

  hasBoiler() { return this.#hasBoiler; }

  __hasBoiler(it) { if (it === undefined) return this.#hasBoiler; else this.#hasBoiler = it; }

  #hasHumidifier = null;

  hasHumidifier() { return this.#hasHumidifier; }

  __hasHumidifier(it) { if (it === undefined) return this.#hasHumidifier; else this.#hasHumidifier = it; }

  #hasErv = null;

  hasErv() { return this.#hasErv; }

  __hasErv(it) { if (it === undefined) return this.#hasErv; else this.#hasErv = it; }

  #hasHrv = null;

  hasHrv() { return this.#hasHrv; }

  __hasHrv(it) { if (it === undefined) return this.#hasHrv; else this.#hasHrv = it; }

  #condensationAvoid = null;

  condensationAvoid() { return this.#condensationAvoid; }

  __condensationAvoid(it) { if (it === undefined) return this.#condensationAvoid; else this.#condensationAvoid = it; }

  #useCelsius = null;

  useCelsius() { return this.#useCelsius; }

  __useCelsius(it) { if (it === undefined) return this.#useCelsius; else this.#useCelsius = it; }

  #userTimeFormat12 = null;

  userTimeFormat12() { return this.#userTimeFormat12; }

  __userTimeFormat12(it) { if (it === undefined) return this.#userTimeFormat12; else this.#userTimeFormat12 = it; }

  #locale = null;

  locale() { return this.#locale; }

  __locale(it) { if (it === undefined) return this.#locale; else this.#locale = it; }

  #humidity = null;

  humidity() { return this.#humidity; }

  __humidity(it) { if (it === undefined) return this.#humidity; else this.#humidity = it; }

  #humidifierMode = null;

  humidifierMode() { return this.#humidifierMode; }

  __humidifierMode(it) { if (it === undefined) return this.#humidifierMode; else this.#humidifierMode = it; }

  #backlightOnIntensity = null;

  backlightOnIntensity() { return this.#backlightOnIntensity; }

  __backlightOnIntensity(it) { if (it === undefined) return this.#backlightOnIntensity; else this.#backlightOnIntensity = it; }

  #backlightSleepIntensity = null;

  backlightSleepIntensity() { return this.#backlightSleepIntensity; }

  __backlightSleepIntensity(it) { if (it === undefined) return this.#backlightSleepIntensity; else this.#backlightSleepIntensity = it; }

  #backlightOffTime = null;

  backlightOffTime() { return this.#backlightOffTime; }

  __backlightOffTime(it) { if (it === undefined) return this.#backlightOffTime; else this.#backlightOffTime = it; }

  #compressorProtectionMinTime = null;

  compressorProtectionMinTime() { return this.#compressorProtectionMinTime; }

  __compressorProtectionMinTime(it) { if (it === undefined) return this.#compressorProtectionMinTime; else this.#compressorProtectionMinTime = it; }

  #compressorProtectionMinTemp = null;

  compressorProtectionMinTemp() { return this.#compressorProtectionMinTemp; }

  __compressorProtectionMinTemp(it) { if (it === undefined) return this.#compressorProtectionMinTemp; else this.#compressorProtectionMinTemp = it; }

  #stage1HeatingDifferentialTemp = null;

  stage1HeatingDifferentialTemp() { return this.#stage1HeatingDifferentialTemp; }

  __stage1HeatingDifferentialTemp(it) { if (it === undefined) return this.#stage1HeatingDifferentialTemp; else this.#stage1HeatingDifferentialTemp = it; }

  #stage1CoolingDifferentialTemp = null;

  stage1CoolingDifferentialTemp() { return this.#stage1CoolingDifferentialTemp; }

  __stage1CoolingDifferentialTemp(it) { if (it === undefined) return this.#stage1CoolingDifferentialTemp; else this.#stage1CoolingDifferentialTemp = it; }

  #stage1HeatingDissipationTime = null;

  stage1HeatingDissipationTime() { return this.#stage1HeatingDissipationTime; }

  __stage1HeatingDissipationTime(it) { if (it === undefined) return this.#stage1HeatingDissipationTime; else this.#stage1HeatingDissipationTime = it; }

  #stage1CoolingDissipationTime = null;

  stage1CoolingDissipationTime() { return this.#stage1CoolingDissipationTime; }

  __stage1CoolingDissipationTime(it) { if (it === undefined) return this.#stage1CoolingDissipationTime; else this.#stage1CoolingDissipationTime = it; }

  #heatPumpReversalOnCool = null;

  heatPumpReversalOnCool() { return this.#heatPumpReversalOnCool; }

  __heatPumpReversalOnCool(it) { if (it === undefined) return this.#heatPumpReversalOnCool; else this.#heatPumpReversalOnCool = it; }

  #fanControlRequired = null;

  fanControlRequired() { return this.#fanControlRequired; }

  __fanControlRequired(it) { if (it === undefined) return this.#fanControlRequired; else this.#fanControlRequired = it; }

  #fanMinOnTime = null;

  fanMinOnTime() { return this.#fanMinOnTime; }

  __fanMinOnTime(it) { if (it === undefined) return this.#fanMinOnTime; else this.#fanMinOnTime = it; }

  #heatCoolMinDelta = null;

  heatCoolMinDelta() { return this.#heatCoolMinDelta; }

  __heatCoolMinDelta(it) { if (it === undefined) return this.#heatCoolMinDelta; else this.#heatCoolMinDelta = it; }

  #tempCorrection = null;

  tempCorrection() { return this.#tempCorrection; }

  __tempCorrection(it) { if (it === undefined) return this.#tempCorrection; else this.#tempCorrection = it; }

  #holdAction = null;

  holdAction() { return this.#holdAction; }

  __holdAction(it) { if (it === undefined) return this.#holdAction; else this.#holdAction = it; }

  #heatPumpGroundWater = null;

  heatPumpGroundWater() { return this.#heatPumpGroundWater; }

  __heatPumpGroundWater(it) { if (it === undefined) return this.#heatPumpGroundWater; else this.#heatPumpGroundWater = it; }

  #hasElectric = null;

  hasElectric() { return this.#hasElectric; }

  __hasElectric(it) { if (it === undefined) return this.#hasElectric; else this.#hasElectric = it; }

  #hasDehumidifier = null;

  hasDehumidifier() { return this.#hasDehumidifier; }

  __hasDehumidifier(it) { if (it === undefined) return this.#hasDehumidifier; else this.#hasDehumidifier = it; }

  #dehumidifierMode = null;

  dehumidifierMode() { return this.#dehumidifierMode; }

  __dehumidifierMode(it) { if (it === undefined) return this.#dehumidifierMode; else this.#dehumidifierMode = it; }

  #dehumidifierLevel = null;

  dehumidifierLevel() { return this.#dehumidifierLevel; }

  __dehumidifierLevel(it) { if (it === undefined) return this.#dehumidifierLevel; else this.#dehumidifierLevel = it; }

  #dehumidifyWithAC = null;

  dehumidifyWithAC() { return this.#dehumidifyWithAC; }

  __dehumidifyWithAC(it) { if (it === undefined) return this.#dehumidifyWithAC; else this.#dehumidifyWithAC = it; }

  #dehumidifyOvercoolOffset = null;

  dehumidifyOvercoolOffset() { return this.#dehumidifyOvercoolOffset; }

  __dehumidifyOvercoolOffset(it) { if (it === undefined) return this.#dehumidifyOvercoolOffset; else this.#dehumidifyOvercoolOffset = it; }

  #autoHeatCoolFeatureEnabled = null;

  autoHeatCoolFeatureEnabled() { return this.#autoHeatCoolFeatureEnabled; }

  __autoHeatCoolFeatureEnabled(it) { if (it === undefined) return this.#autoHeatCoolFeatureEnabled; else this.#autoHeatCoolFeatureEnabled = it; }

  #wifiOfflineAlert = null;

  wifiOfflineAlert() { return this.#wifiOfflineAlert; }

  __wifiOfflineAlert(it) { if (it === undefined) return this.#wifiOfflineAlert; else this.#wifiOfflineAlert = it; }

  #heatMinTemp = null;

  heatMinTemp() { return this.#heatMinTemp; }

  __heatMinTemp(it) { if (it === undefined) return this.#heatMinTemp; else this.#heatMinTemp = it; }

  #heatMaxTemp = null;

  heatMaxTemp() { return this.#heatMaxTemp; }

  __heatMaxTemp(it) { if (it === undefined) return this.#heatMaxTemp; else this.#heatMaxTemp = it; }

  #coolMinTemp = null;

  coolMinTemp() { return this.#coolMinTemp; }

  __coolMinTemp(it) { if (it === undefined) return this.#coolMinTemp; else this.#coolMinTemp = it; }

  #coolMaxTemp = null;

  coolMaxTemp() { return this.#coolMaxTemp; }

  __coolMaxTemp(it) { if (it === undefined) return this.#coolMaxTemp; else this.#coolMaxTemp = it; }

  #heatRangeHigh = null;

  heatRangeHigh() { return this.#heatRangeHigh; }

  __heatRangeHigh(it) { if (it === undefined) return this.#heatRangeHigh; else this.#heatRangeHigh = it; }

  #heatRangeLow = null;

  heatRangeLow() { return this.#heatRangeLow; }

  __heatRangeLow(it) { if (it === undefined) return this.#heatRangeLow; else this.#heatRangeLow = it; }

  #coolRangeHigh = null;

  coolRangeHigh() { return this.#coolRangeHigh; }

  __coolRangeHigh(it) { if (it === undefined) return this.#coolRangeHigh; else this.#coolRangeHigh = it; }

  #coolRangeLow = null;

  coolRangeLow() { return this.#coolRangeLow; }

  __coolRangeLow(it) { if (it === undefined) return this.#coolRangeLow; else this.#coolRangeLow = it; }

  #userAccessCode = null;

  userAccessCode() { return this.#userAccessCode; }

  __userAccessCode(it) { if (it === undefined) return this.#userAccessCode; else this.#userAccessCode = it; }

  #userAccessSetting = null;

  userAccessSetting() { return this.#userAccessSetting; }

  __userAccessSetting(it) { if (it === undefined) return this.#userAccessSetting; else this.#userAccessSetting = it; }

  #auxRuntimeAlert = null;

  auxRuntimeAlert() { return this.#auxRuntimeAlert; }

  __auxRuntimeAlert(it) { if (it === undefined) return this.#auxRuntimeAlert; else this.#auxRuntimeAlert = it; }

  #auxOutdoorTempAlert = null;

  auxOutdoorTempAlert() { return this.#auxOutdoorTempAlert; }

  __auxOutdoorTempAlert(it) { if (it === undefined) return this.#auxOutdoorTempAlert; else this.#auxOutdoorTempAlert = it; }

  #auxMaxOutdoorTemp = null;

  auxMaxOutdoorTemp() { return this.#auxMaxOutdoorTemp; }

  __auxMaxOutdoorTemp(it) { if (it === undefined) return this.#auxMaxOutdoorTemp; else this.#auxMaxOutdoorTemp = it; }

  #auxRuntimeAlertNotify = null;

  auxRuntimeAlertNotify() { return this.#auxRuntimeAlertNotify; }

  __auxRuntimeAlertNotify(it) { if (it === undefined) return this.#auxRuntimeAlertNotify; else this.#auxRuntimeAlertNotify = it; }

  #auxOutdoorTempAlertyNotify = null;

  auxOutdoorTempAlertyNotify() { return this.#auxOutdoorTempAlertyNotify; }

  __auxOutdoorTempAlertyNotify(it) { if (it === undefined) return this.#auxOutdoorTempAlertyNotify; else this.#auxOutdoorTempAlertyNotify = it; }

  #auxRuntimeAlertNotifyTechnician = null;

  auxRuntimeAlertNotifyTechnician() { return this.#auxRuntimeAlertNotifyTechnician; }

  __auxRuntimeAlertNotifyTechnician(it) { if (it === undefined) return this.#auxRuntimeAlertNotifyTechnician; else this.#auxRuntimeAlertNotifyTechnician = it; }

  #auxOutdoorTempAlertNotifyTechnician = null;

  auxOutdoorTempAlertNotifyTechnician() { return this.#auxOutdoorTempAlertNotifyTechnician; }

  __auxOutdoorTempAlertNotifyTechnician(it) { if (it === undefined) return this.#auxOutdoorTempAlertNotifyTechnician; else this.#auxOutdoorTempAlertNotifyTechnician = it; }

  #disablePreHeating = null;

  disablePreHeating() { return this.#disablePreHeating; }

  __disablePreHeating(it) { if (it === undefined) return this.#disablePreHeating; else this.#disablePreHeating = it; }

  #disablePreCooling = null;

  disablePreCooling() { return this.#disablePreCooling; }

  __disablePreCooling(it) { if (it === undefined) return this.#disablePreCooling; else this.#disablePreCooling = it; }

  #installerCodeRequired = null;

  installerCodeRequired() { return this.#installerCodeRequired; }

  __installerCodeRequired(it) { if (it === undefined) return this.#installerCodeRequired; else this.#installerCodeRequired = it; }

  #drAccept = null;

  drAccept() { return this.#drAccept; }

  __drAccept(it) { if (it === undefined) return this.#drAccept; else this.#drAccept = it; }

  #isRentalProperty = null;

  isRentalProperty() { return this.#isRentalProperty; }

  __isRentalProperty(it) { if (it === undefined) return this.#isRentalProperty; else this.#isRentalProperty = it; }

  #useZoneController = null;

  useZoneController() { return this.#useZoneController; }

  __useZoneController(it) { if (it === undefined) return this.#useZoneController; else this.#useZoneController = it; }

  #randomStartDelayCool = null;

  randomStartDelayCool() { return this.#randomStartDelayCool; }

  __randomStartDelayCool(it) { if (it === undefined) return this.#randomStartDelayCool; else this.#randomStartDelayCool = it; }

  #randomStartDelayHeat = null;

  randomStartDelayHeat() { return this.#randomStartDelayHeat; }

  __randomStartDelayHeat(it) { if (it === undefined) return this.#randomStartDelayHeat; else this.#randomStartDelayHeat = it; }

  #humidityHighAlert = null;

  humidityHighAlert() { return this.#humidityHighAlert; }

  __humidityHighAlert(it) { if (it === undefined) return this.#humidityHighAlert; else this.#humidityHighAlert = it; }

  #humidityLowAlert = null;

  humidityLowAlert() { return this.#humidityLowAlert; }

  __humidityLowAlert(it) { if (it === undefined) return this.#humidityLowAlert; else this.#humidityLowAlert = it; }

  #disableHeatPumpAlerts = null;

  disableHeatPumpAlerts() { return this.#disableHeatPumpAlerts; }

  __disableHeatPumpAlerts(it) { if (it === undefined) return this.#disableHeatPumpAlerts; else this.#disableHeatPumpAlerts = it; }

  #disableAlertsOnIdt = null;

  disableAlertsOnIdt() { return this.#disableAlertsOnIdt; }

  __disableAlertsOnIdt(it) { if (it === undefined) return this.#disableAlertsOnIdt; else this.#disableAlertsOnIdt = it; }

  #humidityAlertNotify = null;

  humidityAlertNotify() { return this.#humidityAlertNotify; }

  __humidityAlertNotify(it) { if (it === undefined) return this.#humidityAlertNotify; else this.#humidityAlertNotify = it; }

  #humidityAlertNotifyTechnician = null;

  humidityAlertNotifyTechnician() { return this.#humidityAlertNotifyTechnician; }

  __humidityAlertNotifyTechnician(it) { if (it === undefined) return this.#humidityAlertNotifyTechnician; else this.#humidityAlertNotifyTechnician = it; }

  #tempAlertNotify = null;

  tempAlertNotify() { return this.#tempAlertNotify; }

  __tempAlertNotify(it) { if (it === undefined) return this.#tempAlertNotify; else this.#tempAlertNotify = it; }

  #tempAlertNotifyTechnician = null;

  tempAlertNotifyTechnician() { return this.#tempAlertNotifyTechnician; }

  __tempAlertNotifyTechnician(it) { if (it === undefined) return this.#tempAlertNotifyTechnician; else this.#tempAlertNotifyTechnician = it; }

  #monthlyElectricityBillLimit = null;

  monthlyElectricityBillLimit() { return this.#monthlyElectricityBillLimit; }

  __monthlyElectricityBillLimit(it) { if (it === undefined) return this.#monthlyElectricityBillLimit; else this.#monthlyElectricityBillLimit = it; }

  #enableElectricityBillAlert = null;

  enableElectricityBillAlert() { return this.#enableElectricityBillAlert; }

  __enableElectricityBillAlert(it) { if (it === undefined) return this.#enableElectricityBillAlert; else this.#enableElectricityBillAlert = it; }

  #enableProjectedElectricityBillAlert = null;

  enableProjectedElectricityBillAlert() { return this.#enableProjectedElectricityBillAlert; }

  __enableProjectedElectricityBillAlert(it) { if (it === undefined) return this.#enableProjectedElectricityBillAlert; else this.#enableProjectedElectricityBillAlert = it; }

  #electricityBillingDayOfMonth = null;

  electricityBillingDayOfMonth() { return this.#electricityBillingDayOfMonth; }

  __electricityBillingDayOfMonth(it) { if (it === undefined) return this.#electricityBillingDayOfMonth; else this.#electricityBillingDayOfMonth = it; }

  #electricityBillCycleMonths = null;

  electricityBillCycleMonths() { return this.#electricityBillCycleMonths; }

  __electricityBillCycleMonths(it) { if (it === undefined) return this.#electricityBillCycleMonths; else this.#electricityBillCycleMonths = it; }

  #electricityBillStartMonth = null;

  electricityBillStartMonth() { return this.#electricityBillStartMonth; }

  __electricityBillStartMonth(it) { if (it === undefined) return this.#electricityBillStartMonth; else this.#electricityBillStartMonth = it; }

  #ventilatorMinOnTimeHome = null;

  ventilatorMinOnTimeHome() { return this.#ventilatorMinOnTimeHome; }

  __ventilatorMinOnTimeHome(it) { if (it === undefined) return this.#ventilatorMinOnTimeHome; else this.#ventilatorMinOnTimeHome = it; }

  #ventilatorMinOnTimeAway = null;

  ventilatorMinOnTimeAway() { return this.#ventilatorMinOnTimeAway; }

  __ventilatorMinOnTimeAway(it) { if (it === undefined) return this.#ventilatorMinOnTimeAway; else this.#ventilatorMinOnTimeAway = it; }

  #backlightOffDuringSleep = null;

  backlightOffDuringSleep() { return this.#backlightOffDuringSleep; }

  __backlightOffDuringSleep(it) { if (it === undefined) return this.#backlightOffDuringSleep; else this.#backlightOffDuringSleep = it; }

  #autoAway = null;

  autoAway() { return this.#autoAway; }

  __autoAway(it) { if (it === undefined) return this.#autoAway; else this.#autoAway = it; }

  #smartCirculation = null;

  smartCirculation() { return this.#smartCirculation; }

  __smartCirculation(it) { if (it === undefined) return this.#smartCirculation; else this.#smartCirculation = it; }

  #followMeComfort = null;

  followMeComfort() { return this.#followMeComfort; }

  __followMeComfort(it) { if (it === undefined) return this.#followMeComfort; else this.#followMeComfort = it; }

  #ventilatorType = null;

  ventilatorType() { return this.#ventilatorType; }

  __ventilatorType(it) { if (it === undefined) return this.#ventilatorType; else this.#ventilatorType = it; }

  #isVentilatorTimerOn = null;

  isVentilatorTimerOn() { return this.#isVentilatorTimerOn; }

  __isVentilatorTimerOn(it) { if (it === undefined) return this.#isVentilatorTimerOn; else this.#isVentilatorTimerOn = it; }

  #ventilatorOffDateTime = null;

  ventilatorOffDateTime() { return this.#ventilatorOffDateTime; }

  __ventilatorOffDateTime(it) { if (it === undefined) return this.#ventilatorOffDateTime; else this.#ventilatorOffDateTime = it; }

  #hasUVFilter = null;

  hasUVFilter() { return this.#hasUVFilter; }

  __hasUVFilter(it) { if (it === undefined) return this.#hasUVFilter; else this.#hasUVFilter = it; }

  #coolingLockout = null;

  coolingLockout() { return this.#coolingLockout; }

  __coolingLockout(it) { if (it === undefined) return this.#coolingLockout; else this.#coolingLockout = it; }

  #ventilatorFreeCooling = null;

  ventilatorFreeCooling() { return this.#ventilatorFreeCooling; }

  __ventilatorFreeCooling(it) { if (it === undefined) return this.#ventilatorFreeCooling; else this.#ventilatorFreeCooling = it; }

  #dehumidfyWhenHeating = null;

  dehumidfyWhenHeating() { return this.#dehumidfyWhenHeating; }

  __dehumidfyWhenHeating(it) { if (it === undefined) return this.#dehumidfyWhenHeating; else this.#dehumidfyWhenHeating = it; }

  #ventilatorDehumidify = null;

  ventilatorDehumidify() { return this.#ventilatorDehumidify; }

  __ventilatorDehumidify(it) { if (it === undefined) return this.#ventilatorDehumidify; else this.#ventilatorDehumidify = it; }

  #groupRef = null;

  groupRef() { return this.#groupRef; }

  __groupRef(it) { if (it === undefined) return this.#groupRef; else this.#groupRef = it; }

  #groupName = null;

  groupName() { return this.#groupName; }

  __groupName(it) { if (it === undefined) return this.#groupName; else this.#groupName = it; }

  #groupSetting = null;

  groupSetting() { return this.#groupSetting; }

  __groupSetting(it) { if (it === undefined) return this.#groupSetting; else this.#groupSetting = it; }

  #fanSpeed = null;

  fanSpeed() { return this.#fanSpeed; }

  __fanSpeed(it) { if (it === undefined) return this.#fanSpeed; else this.#fanSpeed = it; }

  static make(f) {
    const $self = new EcobeeSettings();
    EcobeeSettings.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

}

class EcobeeFunction extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeFunction.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #params = null;

  params() { return this.#params; }

  __params(it) { if (it === undefined) return this.#params; else this.#params = it; }

  static make(f) {
    const $self = new EcobeeFunction();
    EcobeeFunction.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

  static makeFields(type,params) {
    const $self = new EcobeeFunction();
    EcobeeFunction.makeFields$($self,type,params);
    return $self;
  }

  static makeFields$($self,type,params) {
    EcobeeObj.make$($self);
    $self.#type = type;
    $self.#params = sys.ObjUtil.coerce(((this$) => { let $_u6 = params; if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(params); })($self), sys.Type.find("sys::Map?"));
    return;
  }

}

class EcobeeThermostat extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeThermostat.type$; }

  #identifier = null;

  identifier() { return this.#identifier; }

  __identifier(it) { if (it === undefined) return this.#identifier; else this.#identifier = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #thermostatRev = null;

  thermostatRev() { return this.#thermostatRev; }

  __thermostatRev(it) { if (it === undefined) return this.#thermostatRev; else this.#thermostatRev = it; }

  #isRegistered = null;

  isRegistered() { return this.#isRegistered; }

  __isRegistered(it) { if (it === undefined) return this.#isRegistered; else this.#isRegistered = it; }

  #modelNumber = null;

  modelNumber() { return this.#modelNumber; }

  __modelNumber(it) { if (it === undefined) return this.#modelNumber; else this.#modelNumber = it; }

  #brand = null;

  brand() { return this.#brand; }

  __brand(it) { if (it === undefined) return this.#brand; else this.#brand = it; }

  #features = null;

  features() { return this.#features; }

  __features(it) { if (it === undefined) return this.#features; else this.#features = it; }

  #utcTime = null;

  utcTime() { return this.#utcTime; }

  __utcTime(it) { if (it === undefined) return this.#utcTime; else this.#utcTime = it; }

  #settings = null;

  settings() { return this.#settings; }

  __settings(it) { if (it === undefined) return this.#settings; else this.#settings = it; }

  #runtime = null;

  runtime() { return this.#runtime; }

  __runtime(it) { if (it === undefined) return this.#runtime; else this.#runtime = it; }

  #equipmentStatus = null;

  equipmentStatus() { return this.#equipmentStatus; }

  __equipmentStatus(it) { if (it === undefined) return this.#equipmentStatus; else this.#equipmentStatus = it; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #remoteSensors = null;

  remoteSensors() { return this.#remoteSensors; }

  __remoteSensors(it) { if (it === undefined) return this.#remoteSensors; else this.#remoteSensors = it; }

  static make(f) {
    const $self = new EcobeeThermostat();
    EcobeeThermostat.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

  id() {
    return this.#identifier;
  }

}

class EcobeeVersion extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeVersion.type$; }

  #thermostatFirmwareVersion = null;

  thermostatFirmwareVersion() { return this.#thermostatFirmwareVersion; }

  __thermostatFirmwareVersion(it) { if (it === undefined) return this.#thermostatFirmwareVersion; else this.#thermostatFirmwareVersion = it; }

  static fromStr(val) {
    const this$ = this;
    return EcobeeVersion.make((it) => {
      it.#thermostatFirmwareVersion = sys.Version.fromStr(val);
      return;
    });
  }

  static make(f) {
    const $self = new EcobeeVersion();
    EcobeeVersion.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

}

class EcobeeStatus extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeStatus.type$; }

  #code = 0;

  code() { return this.#code; }

  __code(it) { if (it === undefined) return this.#code; else this.#code = it; }

  #message = null;

  message() { return this.#message; }

  __message(it) { if (it === undefined) return this.#message; else this.#message = it; }

  static make(f) {
    const $self = new EcobeeStatus();
    EcobeeStatus.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

  static makeFields(code,message) {
    const $self = new EcobeeStatus();
    EcobeeStatus.makeFields$($self,code,message);
    return $self;
  }

  static makeFields$($self,code,message) {
    EcobeeObj.make$($self);
    $self.#code = code;
    $self.#message = message;
    return;
  }

  isOk() {
    return sys.ObjUtil.equals(this.#code, 0);
  }

  isErr() {
    return !this.isOk();
  }

  isTokenExpired() {
    return sys.ObjUtil.equals(this.#code, 14);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("[", sys.ObjUtil.coerce(this.#code, sys.Obj.type$.toNullable())), "] "), this.#message);
  }

}

class EcobeeSelection extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
    this.#selectionMatch = "";
    this.#includeRuntime = false;
    this.#includeExtendedRuntime = false;
    this.#includeSettings = false;
    this.#includeLocation = false;
    this.#includeProgram = false;
    this.#includeEvents = false;
    this.#includeDevice = false;
    this.#includeTechnician = false;
    this.#includeUtility = false;
    this.#includeManagement = false;
    this.#includeAlerts = false;
    this.#includeWeather = false;
    this.#includeHouseDetails = false;
    this.#includeOemCfg = false;
    this.#includeEquipmentStatus = false;
    this.#includeNotificationSettings = false;
    this.#includePrivacy = false;
    this.#includeVersion = false;
    this.#includeSecurity = false;
    this.#includeSensors = false;
    this.#includeAudid = false;
    this.#includeEnergy = false;
    this.#includeCapabilities = false;
    return;
  }

  typeof() { return EcobeeSelection.type$; }

  #selectionType = null;

  selectionType() { return this.#selectionType; }

  __selectionType(it) { if (it === undefined) return this.#selectionType; else this.#selectionType = it; }

  #selectionMatch = null;

  selectionMatch() { return this.#selectionMatch; }

  __selectionMatch(it) { if (it === undefined) return this.#selectionMatch; else this.#selectionMatch = it; }

  #includeRuntime = false;

  includeRuntime() { return this.#includeRuntime; }

  __includeRuntime(it) { if (it === undefined) return this.#includeRuntime; else this.#includeRuntime = it; }

  #includeExtendedRuntime = false;

  includeExtendedRuntime() { return this.#includeExtendedRuntime; }

  __includeExtendedRuntime(it) { if (it === undefined) return this.#includeExtendedRuntime; else this.#includeExtendedRuntime = it; }

  #includeSettings = false;

  includeSettings() { return this.#includeSettings; }

  __includeSettings(it) { if (it === undefined) return this.#includeSettings; else this.#includeSettings = it; }

  #includeLocation = false;

  includeLocation() { return this.#includeLocation; }

  __includeLocation(it) { if (it === undefined) return this.#includeLocation; else this.#includeLocation = it; }

  #includeProgram = false;

  includeProgram() { return this.#includeProgram; }

  __includeProgram(it) { if (it === undefined) return this.#includeProgram; else this.#includeProgram = it; }

  #includeEvents = false;

  includeEvents() { return this.#includeEvents; }

  __includeEvents(it) { if (it === undefined) return this.#includeEvents; else this.#includeEvents = it; }

  #includeDevice = false;

  includeDevice() { return this.#includeDevice; }

  __includeDevice(it) { if (it === undefined) return this.#includeDevice; else this.#includeDevice = it; }

  #includeTechnician = false;

  includeTechnician() { return this.#includeTechnician; }

  __includeTechnician(it) { if (it === undefined) return this.#includeTechnician; else this.#includeTechnician = it; }

  #includeUtility = false;

  includeUtility() { return this.#includeUtility; }

  __includeUtility(it) { if (it === undefined) return this.#includeUtility; else this.#includeUtility = it; }

  #includeManagement = false;

  includeManagement() { return this.#includeManagement; }

  __includeManagement(it) { if (it === undefined) return this.#includeManagement; else this.#includeManagement = it; }

  #includeAlerts = false;

  includeAlerts() { return this.#includeAlerts; }

  __includeAlerts(it) { if (it === undefined) return this.#includeAlerts; else this.#includeAlerts = it; }

  #includeWeather = false;

  includeWeather() { return this.#includeWeather; }

  __includeWeather(it) { if (it === undefined) return this.#includeWeather; else this.#includeWeather = it; }

  #includeHouseDetails = false;

  includeHouseDetails() { return this.#includeHouseDetails; }

  __includeHouseDetails(it) { if (it === undefined) return this.#includeHouseDetails; else this.#includeHouseDetails = it; }

  #includeOemCfg = false;

  includeOemCfg() { return this.#includeOemCfg; }

  __includeOemCfg(it) { if (it === undefined) return this.#includeOemCfg; else this.#includeOemCfg = it; }

  #includeEquipmentStatus = false;

  includeEquipmentStatus() { return this.#includeEquipmentStatus; }

  __includeEquipmentStatus(it) { if (it === undefined) return this.#includeEquipmentStatus; else this.#includeEquipmentStatus = it; }

  #includeNotificationSettings = false;

  includeNotificationSettings() { return this.#includeNotificationSettings; }

  __includeNotificationSettings(it) { if (it === undefined) return this.#includeNotificationSettings; else this.#includeNotificationSettings = it; }

  #includePrivacy = false;

  includePrivacy() { return this.#includePrivacy; }

  __includePrivacy(it) { if (it === undefined) return this.#includePrivacy; else this.#includePrivacy = it; }

  #includeVersion = false;

  includeVersion() { return this.#includeVersion; }

  __includeVersion(it) { if (it === undefined) return this.#includeVersion; else this.#includeVersion = it; }

  #includeSecurity = false;

  includeSecurity() { return this.#includeSecurity; }

  __includeSecurity(it) { if (it === undefined) return this.#includeSecurity; else this.#includeSecurity = it; }

  #includeSensors = false;

  includeSensors() { return this.#includeSensors; }

  __includeSensors(it) { if (it === undefined) return this.#includeSensors; else this.#includeSensors = it; }

  #includeAudid = false;

  includeAudid() { return this.#includeAudid; }

  __includeAudid(it) { if (it === undefined) return this.#includeAudid; else this.#includeAudid = it; }

  #includeEnergy = false;

  includeEnergy() { return this.#includeEnergy; }

  __includeEnergy(it) { if (it === undefined) return this.#includeEnergy; else this.#includeEnergy = it; }

  #includeCapabilities = false;

  includeCapabilities() { return this.#includeCapabilities; }

  __includeCapabilities(it) { if (it === undefined) return this.#includeCapabilities; else this.#includeCapabilities = it; }

  static make(f) {
    const $self = new EcobeeSelection();
    EcobeeSelection.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    ;
    sys.Func.call(f, $self);
    return;
  }

  static makeThermostats(match) {
    const $self = new EcobeeSelection();
    EcobeeSelection.makeThermostats$($self,match);
    return $self;
  }

  static makeThermostats$($self,match) {
    EcobeeObj.make$($self);
    ;
    $self.#selectionType = SelectionType.thermostats();
    $self.#selectionMatch = match;
    return;
  }

}

class SelectionType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SelectionType.type$; }

  static registered() { return SelectionType.vals().get(0); }

  static thermostats() { return SelectionType.vals().get(1); }

  static managementSet() { return SelectionType.vals().get(2); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new SelectionType();
    SelectionType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(SelectionType.type$, SelectionType.vals(), name$, checked);
  }

  static vals() {
    if (SelectionType.#vals == null) {
      SelectionType.#vals = sys.List.make(SelectionType.type$, [
        SelectionType.make(0, "registered", ),
        SelectionType.make(1, "thermostats", ),
        SelectionType.make(2, "managementSet", ),
      ]).toImmutable();
    }
    return SelectionType.#vals;
  }

  static static$init() {
    const $_u7 = SelectionType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class EcobeeDecoder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeDecoder.type$; }

  static make() {
    const $self = new EcobeeDecoder();
    EcobeeDecoder.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  decode(json,asType) {
    if (json == null) {
      return null;
    }
    ;
    if (sys.Str.type$ === asType) {
      return this.decodeStr(sys.ObjUtil.coerce(json, sys.Obj.type$));
    }
    ;
    if (sys.Bool.type$ === asType) {
      return sys.ObjUtil.coerce(this.decodeBool(sys.ObjUtil.coerce(json, sys.Obj.type$)), sys.Obj.type$.toNullable());
    }
    ;
    if (sys.Int.type$ === asType) {
      return sys.ObjUtil.coerce(sys.Num.toInt(this.decodeNum(sys.ObjUtil.coerce(json, sys.Obj.type$))), sys.Obj.type$.toNullable());
    }
    ;
    if (sys.Float.type$ === asType) {
      return sys.ObjUtil.coerce(sys.Num.toFloat(this.decodeNum(sys.ObjUtil.coerce(json, sys.Obj.type$))), sys.Obj.type$.toNullable());
    }
    ;
    if (sys.DateTime.type$ === asType) {
      return this.decodeDateTime(sys.ObjUtil.coerce(json, sys.Obj.type$));
    }
    ;
    if (sys.Date.type$ === asType) {
      return this.decodeDate(sys.ObjUtil.coerce(json, sys.Obj.type$));
    }
    ;
    if (asType.fits(sys.Type.find("sys::List"))) {
      return this.decodeList(sys.ObjUtil.coerce(json, sys.Obj.type$), asType);
    }
    ;
    if (asType.fits(sys.Type.find("sys::Map"))) {
      return this.decodeMap(sys.ObjUtil.coerce(json, sys.Obj.type$), asType);
    }
    ;
    return this.decodeObj(json, asType);
  }

  decodeStr(v) {
    if (sys.ObjUtil.is(v, sys.Str.type$)) {
      return sys.ObjUtil.coerce(v, sys.Str.type$);
    }
    ;
    throw EcobeeDecoder.valErr(v, sys.Str.type$);
  }

  decodeBool(v) {
    if (sys.ObjUtil.is(v, sys.Bool.type$)) {
      return sys.ObjUtil.coerce(v, sys.Bool.type$);
    }
    ;
    if (sys.ObjUtil.is(v, sys.Str.type$)) {
      return sys.ObjUtil.coerce(sys.Bool.fromStr(sys.ObjUtil.coerce(v, sys.Str.type$)), sys.Bool.type$);
    }
    ;
    throw EcobeeDecoder.valErr(v, sys.Bool.type$);
  }

  decodeNum(v) {
    if (sys.ObjUtil.is(v, sys.Num.type$)) {
      return sys.ObjUtil.coerce(v, sys.Num.type$);
    }
    ;
    throw EcobeeDecoder.valErr(v, sys.Num.type$);
  }

  decodeDateTime(v) {
    if (sys.ObjUtil.is(v, sys.Str.type$)) {
      return sys.ObjUtil.coerce(sys.DateTime.fromLocale(sys.ObjUtil.coerce(v, sys.Str.type$), "YYYY-MM-DD hh:mm:ss", sys.TimeZone.utc()), sys.DateTime.type$);
    }
    ;
    throw EcobeeDecoder.valErr(v, sys.DateTime.type$);
  }

  decodeDate(v) {
    if (sys.ObjUtil.is(v, sys.Str.type$)) {
      return sys.ObjUtil.coerce(sys.Date.fromStr(sys.ObjUtil.coerce(v, sys.Str.type$)), sys.Date.type$);
    }
    ;
    throw EcobeeDecoder.valErr(v, sys.Date.type$);
  }

  decodeList(json,listType) {
    const this$ = this;
    let v = sys.ObjUtil.as(json, sys.Type.find("sys::List"));
    if (v == null) {
      throw EcobeeDecoder.valErr(json, listType);
    }
    ;
    let of$ = listType.params().get("V");
    let acc = sys.List.make(sys.ObjUtil.coerce(of$, sys.Type.type$), v.size());
    v.each((item) => {
      acc.add(sys.ObjUtil.coerce(this$.decode(item, sys.ObjUtil.coerce(of$, sys.Type.type$)), sys.Obj.type$));
      return;
    });
    return acc;
  }

  decodeMap(json,mapType) {
    const this$ = this;
    let v = sys.ObjUtil.as(json, sys.Type.find("sys::Map"));
    if (v == null) {
      throw EcobeeDecoder.valErr(json, mapType);
    }
    ;
    let keyType = mapType.params().get("K");
    let valType = mapType.params().get("V");
    let map = sys.Map.make(mapType);
    v.each((val,key) => {
      map.set(sys.ObjUtil.coerce(this$.decode(key, sys.ObjUtil.coerce(keyType, sys.Type.type$)), sys.Obj.type$), sys.ObjUtil.coerce(this$.decode(val, sys.ObjUtil.coerce(valType, sys.Type.type$)), sys.Obj.type$));
      return;
    });
    return map;
  }

  decodeObj(obj,type) {
    const this$ = this;
    if (sys.ObjUtil.is(obj, sys.Str.type$)) {
      return sys.ObjUtil.coerce(type.method("fromStr").call(obj), sys.Obj.type$);
    }
    ;
    let json = sys.ObjUtil.coerce(obj, sys.Type.find("[sys::Str:sys::Obj?]"));
    let fromJson = type.method("fromJson", false);
    if (fromJson != null) {
      return sys.ObjUtil.coerce(fromJson.call(json), sys.Obj.type$);
    }
    ;
    let fields = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Field"), sys.Type.find("sys::Obj"));
    json.each((val,propName) => {
      let field = EcobeeDecoder.toField(type, propName);
      if (field == null) {
        return;
      }
      ;
      let fieldVal = this$.decodeField(sys.ObjUtil.coerce(field, sys.Field.type$), val);
      if (field.isConst()) {
        (fieldVal = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(fieldVal), sys.Obj.type$.toNullable()));
      }
      ;
      fields.set(sys.ObjUtil.coerce(field, sys.Field.type$), sys.ObjUtil.coerce(fieldVal, sys.Obj.type$));
      return;
    });
    let rawField = type.field("rawJson", false);
    if (rawField != null) {
      fields.set(sys.ObjUtil.coerce(rawField, sys.Field.type$), sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(json), sys.Type.find("[sys::Str:sys::Obj?]")));
    }
    ;
    let setter = sys.Field.makeSetFunc(fields);
    return type.make(sys.List.make(sys.Type.find("|sys::Obj->sys::Void|"), [setter]));
  }

  decodeField(f,v) {
    if (v == null) {
      if ((f.type().fits(sys.Type.find("sys::List")) && !f.type().isNullable())) {
        return f.type().params().get("V").emptyList();
      }
      ;
      if ((f.type().fits(sys.Type.find("sys::Map")) && !f.type().isNullable())) {
        return sys.Map.make(f.type());
      }
      ;
      return null;
    }
    ;
    let ftype = f.type().toNonNullable();
    try {
      let decoded = this.decode(v, ftype);
      return decoded;
    }
    catch ($_u8) {
      $_u8 = sys.Err.make($_u8);
      if ($_u8 instanceof sys.ParseErr) {
        let err = $_u8;
        ;
        throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot decode field ", f), " with type "), f.type()), err);
      }
      else {
        throw $_u8;
      }
    }
    ;
  }

  static toField(type,propName) {
    return type.field(sys.Str.decapitalize(propName), false);
  }

  static valErr(v,expected) {
    return sys.ParseErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected val with type ", expected), ", but got "), sys.ObjUtil.typeof(v)), ": "), v));
  }

}

class EcobeeEncoder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeEncoder.type$; }

  static encode(val) {
    return EcobeeEncoder.make().encodeVal(val);
  }

  static jsonStr(val) {
    return util.JsonOutStream.writeJsonToStr(EcobeeEncoder.encode(val));
  }

  static make() {
    const $self = new EcobeeEncoder();
    EcobeeEncoder.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  encodeVal(val) {
    if (val == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      return val;
    }
    ;
    if (sys.ObjUtil.is(val, sys.Bool.type$)) {
      return val;
    }
    ;
    if (sys.ObjUtil.is(val, sys.Num.type$)) {
      return val;
    }
    ;
    if (sys.ObjUtil.is(val, sys.Date.type$)) {
      return sys.ObjUtil.toStr(val);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Enum.type$)) {
      return this.encodeEnum(sys.ObjUtil.coerce(val, sys.Enum.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return this.encodeList(sys.ObjUtil.coerce(val, sys.Type.find("sys::List")));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::Map"))) {
      return this.encodeMap(sys.ObjUtil.coerce(val, sys.Type.find("sys::Map")));
    }
    ;
    return this.encodeObj(sys.ObjUtil.coerce(val, EcobeeObj.type$));
  }

  encodeObj(obj) {
    const this$ = this;
    let encoder = sys.ObjUtil.typeof(obj).method("toJson", false);
    if (encoder != null) {
      return sys.ObjUtil.coerce(encoder.callOn(obj, null), sys.Obj.type$);
    }
    ;
    let json = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj?]"));
    sys.ObjUtil.typeof(obj).fields().each((field) => {
      if (!EcobeeEncoder.acceptField(field)) {
        return;
      }
      ;
      let val = field.get(obj);
      if (val == null) {
        return;
      }
      ;
      if (sys.ObjUtil.equals(val, false)) {
        return;
      }
      ;
      json.set(EcobeeEncoder.toPropName(field), this$.encodeVal(val));
      return;
    });
    return json;
  }

  encodeEnum(val) {
    return val.toStr();
  }

  encodeList(val) {
    const this$ = this;
    return val.map((item) => {
      return this$.encodeVal(item);
    }, sys.Obj.type$.toNullable());
  }

  encodeMap(val) {
    const this$ = this;
    let json = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj?]"));
    val.each((v,k) => {
      json.set(sys.ObjUtil.toStr(k), this$.encodeVal(v));
      return;
    });
    return json;
  }

  static acceptField(field) {
    if (field.isStatic()) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(field.parent(), EcobeeObj.type$)) {
      return false;
    }
    ;
    return true;
  }

  static toPropName(field) {
    return field.name();
  }

}

class EcobeeRemoteSensor extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
    this.#capability = sys.ObjUtil.coerce(((this$) => { let $_u9 = sys.List.make(EcobeeRemoteSensorCapability.type$); if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(EcobeeRemoteSensorCapability.type$)); })(this), sys.Type.find("hxEcobee::EcobeeRemoteSensorCapability[]"));
    return;
  }

  typeof() { return EcobeeRemoteSensor.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #code = null;

  code() { return this.#code; }

  __code(it) { if (it === undefined) return this.#code; else this.#code = it; }

  #inUse = null;

  inUse() { return this.#inUse; }

  __inUse(it) { if (it === undefined) return this.#inUse; else this.#inUse = it; }

  #capability = null;

  capability() { return this.#capability; }

  __capability(it) { if (it === undefined) return this.#capability; else this.#capability = it; }

  static make(f) {
    const $self = new EcobeeRemoteSensor();
    EcobeeRemoteSensor.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    ;
    sys.Func.call(f, $self);
    return;
  }

  getCapability(type) {
    const this$ = this;
    return this.#capability.find((it) => {
      return sys.ObjUtil.equals(it.type(), type);
    });
  }

  hasCapability(type) {
    return this.getCapability(type) != null;
  }

}

class EcobeeRemoteSensorCapability extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeRemoteSensorCapability.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #value = null;

  value() { return this.#value; }

  __value(it) { if (it === undefined) return this.#value; else this.#value = it; }

  static make(f) {
    const $self = new EcobeeRemoteSensorCapability();
    EcobeeRemoteSensorCapability.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

}

class EcobeeEvent extends EcobeeObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeEvent.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #running = null;

  running() { return this.#running; }

  __running(it) { if (it === undefined) return this.#running; else this.#running = it; }

  #coolHoldTemp = null;

  coolHoldTemp() { return this.#coolHoldTemp; }

  __coolHoldTemp(it) { if (it === undefined) return this.#coolHoldTemp; else this.#coolHoldTemp = it; }

  #heatHoldTemp = null;

  heatHoldTemp() { return this.#heatHoldTemp; }

  __heatHoldTemp(it) { if (it === undefined) return this.#heatHoldTemp; else this.#heatHoldTemp = it; }

  static make(f) {
    const $self = new EcobeeEvent();
    EcobeeEvent.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    EcobeeObj.make$($self);
    sys.Func.call(f, $self);
    return;
  }

}

class EcobeeConnTask extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeConnTask.type$; }

  #dispatch = null;

  dispatch() {
    return this.#dispatch;
  }

  static make(dispatch) {
    const $self = new EcobeeConnTask();
    EcobeeConnTask.make$($self,dispatch);
    return $self;
  }

  static make$($self,dispatch) {
    $self.#dispatch = dispatch;
    return;
  }

  client() {
    return sys.ObjUtil.coerce(this.#dispatch.client(), Ecobee.type$);
  }

  conn() {
    return this.#dispatch.conn();
  }

  log() {
    return this.#dispatch.trace().asLog();
  }

  static toCurId(pt) {
    return EcobeeConnTask.toRemoteId(pt.rec(), "ecobeeCur");
  }

  static toWriteId(pt) {
    return EcobeeConnTask.toRemoteId(pt.rec(), "ecobeeWrite");
  }

  static toHisId(pt) {
    return EcobeeConnTask.toRemoteId(pt.rec(), "ecobeeHis");
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
    return sys.ObjUtil.coerce(EcobeePropId.fromStr(sys.ObjUtil.coerce(val, sys.Str.type$)), EcobeePropId.type$);
  }

  pointData(pt) {
    return sys.ObjUtil.coerce(((this$) => { let $_u10 = sys.ObjUtil.as(pt.data(), haystack.Dict.type$); if ($_u10 != null) return $_u10; return haystack.Etc.emptyDict(); })(this), haystack.Dict.type$);
  }

}

class EcobeeWrite extends EcobeeConnTask {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeWrite.type$; }

  #point = null;

  // private field reflection only
  __point(it) { if (it === undefined) return this.#point; else this.#point = it; }

  #event = null;

  // private field reflection only
  __event(it) { if (it === undefined) return this.#event; else this.#event = it; }

  #propId = null;

  // private field reflection only
  __propId(it) { if (it === undefined) return this.#propId; else this.#propId = it; }

  #selection = null;

  // private field reflection only
  __selection(it) { if (it === undefined) return this.#selection; else this.#selection = it; }

  static make(dispatch,point,event) {
    const $self = new EcobeeWrite();
    EcobeeWrite.make$($self,dispatch,point,event);
    return $self;
  }

  static make$($self,dispatch,point,event) {
    EcobeeConnTask.make$($self, dispatch);
    $self.#point = point;
    $self.#event = event;
    return;
  }

  run() {
    const this$ = this;
    try {
      this.#propId = EcobeeConnTask.toWriteId(this.#point);
      this.log().debug(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("onWrite: ", this.#point), " "), this.#propId), " "), this.#event));
      this.#selection = EcobeeSelection.make((it) => {
        it.__selectionType(SelectionType.thermostats());
        it.__selectionMatch(this$.#propId.thermostatId());
        return;
      });
      if (this.#propId.isSettings()) {
        this.writeSettings();
      }
      else {
        this.invokeFunc();
      }
      ;
      this.#point.updateWriteOk(this.#event);
    }
    catch ($_u11) {
      $_u11 = sys.Err.make($_u11);
      if ($_u11 instanceof sys.Err) {
        let err = $_u11;
        ;
        this.#point.updateWriteErr(this.#event, err);
      }
      else {
        throw $_u11;
      }
    }
    ;
    return null;
  }

  writeSettings() {
    const this$ = this;
    let thermostat = EcobeeThermostat.make((it) => {
      it.__settings(this$.toSettings(sys.ObjUtil.coerce(this$.#propId, EcobeePropId.type$)));
      return;
    });
    this.client().thermostat().update(sys.ObjUtil.coerce(this.#selection, EcobeeSelection.type$), thermostat);
    return;
  }

  toSettings(propId) {
    let setter = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Field"), sys.Type.find("sys::Obj?"));
    let type = EcobeeSettings.type$;
    let field = type.field(propId.propSpecs().get(1).prop());
    setter.set(sys.ObjUtil.coerce(field, sys.Field.type$), EcobeeUtil.toEcobee(this.#event.val(), sys.ObjUtil.coerce(field, sys.Field.type$)));
    return sys.ObjUtil.coerce(type.make(sys.List.make(sys.Type.find("|sys::Obj->sys::Void|"), [sys.Field.makeSetFunc(setter)])), EcobeeSettings.type$);
  }

  invokeFunc() {
    if ((sys.ObjUtil.equals(this.#propId.propUri(), sys.Uri.fromStr("runtime/desiredHeat")) || sys.ObjUtil.equals(this.#propId.propUri(), sys.Uri.fromStr("runtime/desiredCool")))) {
      let func = EcobeeFunction.makeFields("setHold", sys.Map.__fromLiteral(["holdType","heatHoldTemp","coolHoldTemp"], ["indefinite",sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.#event.val(), haystack.Number.type$).toInt(), sys.Obj.type$),sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.#event.val(), haystack.Number.type$).toInt(), sys.Obj.type$)], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
      this.client().thermostat().callFunc(sys.ObjUtil.coerce(this.#selection, EcobeeSelection.type$), func);
    }
    else {
      throw haystack.FaultErr.make(sys.Str.plus("Property not supported for write: ", this.#propId));
    }
    ;
    return;
  }

}

class EcobeeSyncCur extends EcobeeConnTask {
  constructor() {
    super();
    const this$ = this;
    this.#stalePoints = sys.List.make(hxConn.ConnPoint.type$);
    this.#staleThermostats = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool"));
    return;
  }

  typeof() { return EcobeeSyncCur.type$; }

  #points = null;

  // private field reflection only
  __points(it) { if (it === undefined) return this.#points; else this.#points = it; }

  #summary = null;

  // private field reflection only
  __summary(it) { if (it === undefined) return this.#summary; else this.#summary = it; }

  #stalePoints = null;

  // private field reflection only
  __stalePoints(it) { if (it === undefined) return this.#stalePoints; else this.#stalePoints = it; }

  #staleThermostats = null;

  // private field reflection only
  __staleThermostats(it) { if (it === undefined) return this.#staleThermostats; else this.#staleThermostats = it; }

  static make(dispatch,points) {
    const $self = new EcobeeSyncCur();
    EcobeeSyncCur.make$($self,dispatch,points);
    return $self;
  }

  static make$($self,dispatch,points) {
    EcobeeConnTask.make$($self, dispatch);
    ;
    $self.#points = sys.ObjUtil.coerce(((this$) => { let $_u12 = points; if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(points); })($self), sys.Type.find("hxConn::ConnPoint[]"));
    return;
  }

  run() {
    this.init();
    this.sync();
    return null;
  }

  init() {
    const this$ = this;
    this.#summary = this.dispatch().pollSummary();
    let revisions = this.#summary.revisions();
    this.#points.each((point) => {
      let propId = EcobeeConnTask.toCurId(point);
      let rev = revisions.get(propId.thermostatId());
      if (rev == null) {
        return point.updateCurErr(haystack.FaultErr.make(sys.Str.plus("Thermostat not registered at Ecobee server: ", propId.thermostatId())));
      }
      ;
      let data = this$.pointData(point);
      let lastSync = sys.ObjUtil.as(data.get("runtimeRev"), sys.Str.type$);
      if (sys.ObjUtil.compareNE(rev.runtimeRev(), lastSync)) {
        this$.#stalePoints.add(point);
        this$.#staleThermostats.set(propId.thermostatId(), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
      }
      ;
      return;
    });
    return;
  }

  sync() {
    const this$ = this;
    if (this.#stalePoints.isEmpty()) {
      return;
    }
    ;
    let selection = EcobeeSelection.make((it) => {
      it.__selectionType(SelectionType.thermostats());
      it.__selectionMatch(this$.#staleThermostats.keys().join(","));
      it.__includeRuntime(true);
      it.__includeSensors(true);
      it.__includeSettings(true);
      it.__includeEquipmentStatus(true);
      return;
    });
    let thermostats = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxEcobee::EcobeeThermostat")).setList(this.client().thermostat().get(selection), (it) => {
      return sys.ObjUtil.coerce(it.identifier(), sys.Str.type$);
    });
    this.#stalePoints.each((point) => {
      let propId = EcobeeConnTask.toCurId(point);
      let thermostat = thermostats.get(propId.thermostatId());
      try {
        if (thermostat == null) {
          throw haystack.FaultErr.make(sys.Str.plus("Thermostat not returned by Ecobee server for: ", propId));
        }
        ;
        let val = this$.resolveVal(propId, sys.ObjUtil.coerce(thermostat, EcobeeThermostat.type$));
        (val = this$.coerce(val, point, propId));
        point.updateCurOk(val);
        let data = haystack.Etc.dictMerge(this$.pointData(point), sys.Map.__fromLiteral(["runtimeRev"], [thermostat.runtime().runtimeRev()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")));
        this$.dispatch().setPointData(point, data);
      }
      catch ($_u13) {
        $_u13 = sys.Err.make($_u13);
        if ($_u13 instanceof sys.Err) {
          let err = $_u13;
          ;
          point.updateCurErr(err);
        }
        else {
          throw $_u13;
        }
      }
      ;
      return;
    });
    return;
  }

  resolveVal(propId,thermostat) {
    const this$ = this;
    if (sys.ObjUtil.compareNE(propId.thermostatId(), thermostat.identifier())) {
      throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Illegal State ", propId), " != "), thermostat.identifier()));
    }
    ;
    let obj = thermostat;
    propId.propSpecs().each((spec) => {
      try {
        let field = sys.ObjUtil.typeof(obj).field(spec.prop());
        (obj = field.get(obj));
        if (spec.isObjectSelect()) {
          if (!sys.ObjUtil.is(obj, sys.Type.find("sys::List"))) {
            throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus("", spec), " does not resolve to a list"));
          }
          ;
          let list = sys.ObjUtil.as(obj, sys.Type.find("hxEcobee::EcobeeObj[]"));
          if (list == null) {
            throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus("", spec), " does not resolve to an ecobee object list"));
          }
          ;
          (obj = list.find((item) => {
            if (spec.isIdSelector()) {
              return sys.ObjUtil.equals(item.id(), spec.selectVal());
            }
            else {
              (field = sys.ObjUtil.typeof(item).field(sys.ObjUtil.coerce(spec.selectKey(), sys.Str.type$)));
              return sys.ObjUtil.equals(field.get(item), spec.selectVal());
            }
            ;
          }));
          if (obj == null) {
            throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus("", spec), " did not match any objects"));
          }
          ;
        }
        else {
          if (sys.ObjUtil.is(obj, sys.Type.find("sys::List"))) {
            throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus("", spec), " resolves to a list, but does not have an object selector"));
          }
          ;
        }
        ;
      }
      catch ($_u14) {
        $_u14 = sys.Err.make($_u14);
        if ($_u14 instanceof sys.UnknownSlotErr) {
          let err = $_u14;
          ;
          throw haystack.FaultErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Could not resolve ", spec), " on "), sys.ObjUtil.typeof(obj)), err);
        }
        else {
          throw $_u14;
        }
      }
      ;
      return;
    });
    return EcobeeUtil.toHay(obj);
  }

  coerce(val,point,propId) {
    if (val == null) {
      return null;
    }
    ;
    if ((sys.ObjUtil.equals(point.kind().name(), "Bool") && sys.ObjUtil.is(val, sys.Str.type$))) {
      return sys.ObjUtil.coerce(sys.Bool.fromStr(sys.ObjUtil.coerce(val, sys.Str.type$)), sys.Obj.type$.toNullable());
    }
    ;
    return val;
  }

}

class EcobeeLearn extends EcobeeConnTask {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeLearn.type$; }

  static fahr() { return EcobeeUtil.fahr(); }

  static relHum() { return EcobeeUtil.relHum(); }

  static sec() { return EcobeeUtil.sec(); }

  #arg = null;

  // private field reflection only
  __arg(it) { if (it === undefined) return this.#arg; else this.#arg = it; }

  static make(dispatch,arg) {
    const $self = new EcobeeLearn();
    EcobeeLearn.make$($self,dispatch,arg);
    return $self;
  }

  static make$($self,dispatch,arg) {
    EcobeeConnTask.make$($self, dispatch);
    $self.#arg = arg;
    return;
  }

  learn() {
    return sys.ObjUtil.coerce(this.run(), haystack.Grid.type$);
  }

  run() {
    let t1 = sys.Duration.now();
    try {
      let meta = sys.Map.__fromLiteral(["ecobeeConnRef"], [this.conn().id()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Ref"));
      let rows = sys.List.make(haystack.Dict.type$);
      if (this.#arg == null) {
        (rows = this.learnRoot());
      }
      else {
        (rows = sys.ObjUtil.coerce(this.#arg, sys.Type.find("haystack::Dict[]")));
      }
      ;
      return haystack.Etc.makeDictsGrid(meta, rows);
    }
    finally {
      let t2 = sys.Duration.now();
      if (this.#arg == null) {
        this.log().info(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.conn().dis()), " Learn "), this.#arg), " ["), t2.minus(t1).toLocale()), "]"));
      }
      ;
    }
    ;
  }

  learnRoot() {
    const this$ = this;
    let acc = sys.List.make(haystack.Dict.type$);
    let thermostats = this.client().thermostat().get(EcobeeSelection.make((it) => {
      it.__selectionType(SelectionType.registered());
      it.__includeRuntime(true);
      it.__includeSensors(true);
      return;
    }));
    thermostats.each((thermostat) => {
      let tags = sys.Map.__fromLiteral(["dis","ecobeeId","ecobeeModelNumber","equip","thermostat"], [thermostat.name(),thermostat.id(),thermostat.modelNumber(),haystack.Marker.val(),haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
      let children = this$.learnRemoteSensors(thermostat);
      children.addAll(this$.learnThermostatPoints(thermostat));
      tags.set("learn", children);
      acc.add(haystack.Etc.makeDict(tags));
      return;
    });
    return acc;
  }

  learnRemoteSensors(thermostat) {
    const this$ = this;
    let acc = sys.List.make(haystack.Dict.type$);
    thermostat.remoteSensors().each((sensor) => {
      let tags = sys.Map.__fromLiteral(["dis","ecobeeId","ecobeeSensorType","equip","thermostat"], [sys.Str.plus(sys.Str.plus("\u2022 ", sensor.name()), " (Remote Sensor)"),sensor.id(),sensor.type(),haystack.Marker.val(),haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
      let children = this$.learnRemoteSensorPoints(thermostat, sensor);
      tags.set("learn", children);
      acc.add(haystack.Etc.makeDict(tags));
      return;
    });
    return acc;
  }

  learnThermostatPoints(t) {
    let points = sys.List.make(haystack.Dict.type$);
    points.add(PointBuilder.make(t).dis("Equip Status").kind("Str").markers("zone,air,hvacMode,sensor").cur("equipmentStatus").finish());
    points.add(PointBuilder.make(t).dis("Reported Temp").kind("Number").unit(EcobeeUtil.fahr()).markers("zone,air,temp,sensor").cur("runtime/actualTemperature", "/ 10").his("runtime/zoneAveTemp").finish());
    points.add(PointBuilder.make(t).dis("Actual Humidity").kind("Number").unit(EcobeeUtil.relHum()).markers("zone,air,humidity,sensor").cur("runtime/actualHumidity").his("runtime/zoneHumidity").finish());
    points.add(PointBuilder.make(t).dis("Dry-Bulb Temp").kind("Number").unit(EcobeeUtil.fahr()).markers("zone,air,temp,sensor").cur("runtime/rawTemperature", "/ 10").finish());
    points.add(PointBuilder.make(t).dis("Desired Heat").kind("Number").unit(EcobeeUtil.fahr()).markers("zone,air,temp,heating,sp").cur("runtime/desiredHeat", "/ 10").write("runtime/desiredHeat", "* 10").his("runtime/zoneHeatTemp").finish());
    points.add(PointBuilder.make(t).dis("Desired Cool").kind("Number").unit(EcobeeUtil.fahr()).markers("zone,air,temp,cooling,sp").cur("runtime/desiredCool", "/ 10").write("runtime/desiredCool", "* 10").his("runtime/zoneCoolTemp").finish());
    points.add(PointBuilder.make(t).dis("Actual CO2").kind("Number").markers("zone,air,co2,sensor").cur("runtime/actualCO2").finish());
    points.add(PointBuilder.make(t).dis("HVAC mode").kind("Str").enums("auto,auxHeatOnly,cool,heat,off").markers("zone,air,hvacMode,cmd").curAndWrite("settings/hvacMode").his("runtime/hvacMode").finish());
    points.add(PointBuilder.make(t).dis("Aux. Heat Runtime").kind("Number").unit(EcobeeUtil.sec()).markers("").his("runtime/auxHeat1").finish());
    points.add(PointBuilder.make(t).dis("Compressor Cool Runtime").kind("Number").unit(EcobeeUtil.sec()).markers("").his("runtime/compCool1").finish());
    return points;
  }

  learnRemoteSensorPoints(t,s) {
    let points = sys.List.make(haystack.Dict.type$);
    if (s.hasCapability("co2")) {
      points.add(PointBuilder.make(t).dis("CO2").kind("Number").markers("zone,air,co2,sensor").cur(EcobeeLearn.capProp(s, "co2"), "strToNumber").finish());
    }
    ;
    if (s.hasCapability("humidity")) {
      points.add(PointBuilder.make(t).dis("Humidity").kind("Number").unit(EcobeeUtil.relHum()).markers("zone,air,humidity,sensor").cur(EcobeeLearn.capProp(s, "humidity"), "strToNumber").finish());
    }
    ;
    if (s.hasCapability("temperature")) {
      points.add(PointBuilder.make(t).dis("Temp").kind("Number").unit(EcobeeUtil.fahr()).markers("zone,air,temp,sensor").cur(EcobeeLearn.capProp(s, "temperature"), "strToNumber / 10").finish());
    }
    ;
    if (s.hasCapability("occupancy")) {
      points.add(PointBuilder.make(t).dis("Occupancy").kind("Bool").markers("zone,occupied,sensor").cur(EcobeeLearn.capProp(s, "occupancy")).finish());
    }
    ;
    return points;
  }

  static capProp(s,type) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("remoteSensors[", s.id()), "]/capability[type="), type), "]/value");
  }

}

class PointBuilder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PointBuilder.type$; }

  #thermostat = null;

  // private field reflection only
  __thermostat(it) { if (it === undefined) return this.#thermostat; else this.#thermostat = it; }

  #tags = null;

  // private field reflection only
  __tags(it) { if (it === undefined) return this.#tags; else this.#tags = it; }

  static make(thermostat) {
    const $self = new PointBuilder();
    PointBuilder.make$($self,thermostat);
    return $self;
  }

  static make$($self,thermostat) {
    $self.#thermostat = thermostat;
    $self.#tags = sys.Map.__fromLiteral(["point","ecobeePoint"], [haystack.Marker.val(),haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
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

  cur(path,convert) {
    if (convert === undefined) convert = null;
    this.set("ecobeeCur", sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#thermostat.id()), "/"), path));
    if (convert != null) {
      this.set("curConvert", convert);
    }
    ;
    return this;
  }

  write(path,convert) {
    if (convert === undefined) convert = null;
    this.set("ecobeeWrite", sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#thermostat.id()), "/"), path)).markers("writable");
    if (convert != null) {
      this.set("writeConvert", convert);
    }
    ;
    return this;
  }

  his(path,hisMode,convert) {
    if (hisMode === undefined) hisMode = null;
    if (convert === undefined) convert = null;
    this.set("ecobeeHis", sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#thermostat.id()), "/"), path)).markers("his");
    if (hisMode != null) {
      this.set("hisMode", hisMode);
    }
    ;
    if (convert != null) {
      this.set("hisConvert", convert);
    }
    ;
    return this;
  }

  curAndWrite(path) {
    return this.cur(path).write(path);
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

class EcobeePropId extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeePropId.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #thermostatId = null;

  thermostatId() { return this.#thermostatId; }

  __thermostatId(it) { if (it === undefined) return this.#thermostatId; else this.#thermostatId = it; }

  #propSpecs = null;

  propSpecs() { return this.#propSpecs; }

  __propSpecs(it) { if (it === undefined) return this.#propSpecs; else this.#propSpecs = it; }

  static fromStr(s) {
    return EcobeePropId.make(sys.Str.toUri(s));
  }

  static make(uri) {
    const $self = new EcobeePropId();
    EcobeePropId.make$($self,uri);
    return $self;
  }

  static make$($self,uri) {
    const this$ = $self;
    $self.#uri = uri;
    if (sys.ObjUtil.compareLT(uri.path().size(), 2)) {
      throw sys.ArgErr.make(sys.Str.plus("Invalid property id: ", uri));
    }
    ;
    $self.#thermostatId = uri.path().get(0);
    $self.#propSpecs = sys.ObjUtil.coerce(((this$) => { let $_u15 = sys.ObjUtil.coerce(uri.path().getRange(sys.Range.make(1, -1)).map((it) => {
      return EcobeePropSpec.fromStr(it);
    }, sys.Obj.type$.toNullable()), sys.Type.find("hxEcobee::EcobeePropSpec[]")); if ($_u15 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(uri.path().getRange(sys.Range.make(1, -1)).map((it) => {
      return EcobeePropSpec.fromStr(it);
    }, sys.Obj.type$.toNullable()), sys.Type.find("hxEcobee::EcobeePropSpec[]"))); })($self), sys.Type.find("hxEcobee::EcobeePropSpec[]"));
    if ($self.#propSpecs.last().isObjectSelect()) {
      throw sys.ArgErr.make(sys.Str.plus("Property id must not end with a selector: ", uri));
    }
    ;
    return;
  }

  propUri() {
    return sys.Str.toUri(this.#propSpecs.join("/"));
  }

  isSettings() {
    return sys.ObjUtil.equals(this.#propSpecs.first().prop(), "settings");
  }

  isRuntime() {
    return sys.ObjUtil.equals(this.#propSpecs.first().prop(), "runtime");
  }

  toStr() {
    return this.#uri.toStr();
  }

}

class EcobeePropSpec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeePropSpec.type$; }

  #prop = null;

  prop() { return this.#prop; }

  __prop(it) { if (it === undefined) return this.#prop; else this.#prop = it; }

  #selectKey = null;

  selectKey() { return this.#selectKey; }

  __selectKey(it) { if (it === undefined) return this.#selectKey; else this.#selectKey = it; }

  #selectVal = null;

  selectVal() { return this.#selectVal; }

  __selectVal(it) { if (it === undefined) return this.#selectVal; else this.#selectVal = it; }

  static fromStr(s) {
    let selectIdx = sys.Str.index(s, "[");
    if (selectIdx == null) {
      return EcobeePropSpec.make(s, null, null);
    }
    ;
    let prop = sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(selectIdx, sys.Int.type$), true));
    let select = sys.Str.split(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(selectIdx, sys.Int.type$), 1), -1, true)), sys.ObjUtil.coerce(61, sys.Int.type$.toNullable()));
    let key = ((this$) => { if (sys.ObjUtil.equals(select.size(), 1)) return "id"; return select.first(); })(this);
    let val = select.last();
    return EcobeePropSpec.make(prop, key, val);
  }

  static make(prop,selectKey,selectVal) {
    const $self = new EcobeePropSpec();
    EcobeePropSpec.make$($self,prop,selectKey,selectVal);
    return $self;
  }

  static make$($self,prop,selectKey,selectVal) {
    $self.#prop = prop;
    $self.#selectKey = selectKey;
    $self.#selectVal = selectVal;
    return;
  }

  isObjectSelect() {
    return this.#selectKey != null;
  }

  isIdSelector() {
    return sys.ObjUtil.equals(this.#selectKey, "id");
  }

  toStr() {
    return ((this$) => { if (this$.#selectKey == null) return this$.#prop; return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#prop), "["), this$.#selectKey), "="), this$.#selectVal), "]"); })(this);
  }

}

class EcobeeSyncHis extends EcobeeConnTask {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EcobeeSyncHis.type$; }

  #point = null;

  // private field reflection only
  __point(it) { if (it === undefined) return this.#point; else this.#point = it; }

  #span = null;

  // private field reflection only
  __span(it) { if (it === undefined) return this.#span; else this.#span = it; }

  #utcSpan = null;

  // private field reflection only
  __utcSpan(it) { if (it === undefined) return this.#utcSpan; else this.#utcSpan = it; }

  static make(dispatch,point,span) {
    const $self = new EcobeeSyncHis();
    EcobeeSyncHis.make$($self,dispatch,point,span);
    return $self;
  }

  static make$($self,dispatch,point,span) {
    EcobeeConnTask.make$($self, dispatch);
    $self.#point = point;
    $self.#span = span;
    $self.#utcSpan = span.toTimeZone(sys.TimeZone.utc());
    return;
  }

  run() {
    const this$ = this;
    try {
      let propId = EcobeeConnTask.toHisId(this.#point);
      if (!propId.isRuntime()) {
        throw haystack.FaultErr.make(sys.Str.plus("Unsupported his property: ", propId));
      }
      ;
      let req = RuntimeReportReq.make((it) => {
        it.__selection(EcobeeSelection.makeThermostats(propId.thermostatId()));
        it.__startDate(this$.#utcSpan.start().date());
        it.__endDate(this$.#utcSpan.end().date());
        it.__columns(propId.propSpecs().last().prop());
        return;
      });
      let resp = this.client().report().runtime(req);
      let report = resp.reportList().first();
      let items = sys.List.make(haystack.HisItem.type$);
      let prevItem = null;
      report.rowList().each((csv) => {
        let vals = sys.Str.split(csv, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
        let date = sys.Date.fromStr(vals.get(0));
        let time = sys.Time.fromStr(vals.get(1));
        let ts = date.toDateTime(sys.ObjUtil.coerce(time, sys.Time.type$), this$.#point.tz());
        if (!this$.#span.contains(ts)) {
          return;
        }
        ;
        let val = vals.getSafe(2);
        if (this$.#point.kind().isNumber()) {
          (val = haystack.Number.fromStr(sys.ObjUtil.coerce(val, sys.Str.type$), false));
        }
        ;
        items.add(haystack.HisItem.make(ts, val));
        (prevItem = items.last());
        return;
      });
      return this.#point.updateHisOk(items, this.#span);
    }
    catch ($_u18) {
      $_u18 = sys.Err.make($_u18);
      if ($_u18 instanceof sys.Err) {
        let err = $_u18;
        ;
        return this.#point.updateHisErr(err);
      }
      else {
        throw $_u18;
      }
    }
    ;
  }

}

const p = sys.Pod.add$('hxEcobee');
const xp = sys.Param.noParams$();
let m;
EcobeeErr.type$ = p.at$('EcobeeErr','sys::Err',[],{},8194,EcobeeErr);
EcobeeDispatch.type$ = p.at$('EcobeeDispatch','hxConn::ConnDispatch',[],{},8192,EcobeeDispatch);
EcobeeUtil.type$ = p.am$('EcobeeUtil','sys::Obj',[],{},385,EcobeeUtil);
EcobeeLib.type$ = p.at$('EcobeeLib','hxConn::ConnLib',[],{},8194,EcobeeLib);
EcobeeFuncs.type$ = p.at$('EcobeeFuncs','sys::Obj',[],{},8194,EcobeeFuncs);
Ecobee.type$ = p.at$('Ecobee','sys::Obj',[],{},8194,Ecobee);
EcobeeAuthorization.type$ = p.at$('EcobeeAuthorization','util::AbstractMain',[],{'sys::NoDoc':""},8192,EcobeeAuthorization);
ApiReq.type$ = p.at$('ApiReq','sys::Obj',[],{},8192,ApiReq);
ThermostatReq.type$ = p.at$('ThermostatReq','hxEcobee::ApiReq',[],{},8192,ThermostatReq);
EcobeeObj.type$ = p.at$('EcobeeObj','sys::Obj',[],{},8195,EcobeeObj);
EcobeeResp.type$ = p.at$('EcobeeResp','hxEcobee::EcobeeObj',[],{},8194,EcobeeResp);
ThermostatSummaryResp.type$ = p.at$('ThermostatSummaryResp','hxEcobee::EcobeeResp',[],{},8226,ThermostatSummaryResp);
ThermostatResp.type$ = p.at$('ThermostatResp','hxEcobee::EcobeeResp',[],{},8226,ThermostatResp);
ThermostatRev.type$ = p.at$('ThermostatRev','sys::Obj',[],{},8226,ThermostatRev);
EquipmentStatus.type$ = p.at$('EquipmentStatus','sys::Obj',[],{},8226,EquipmentStatus);
ReportReq.type$ = p.at$('ReportReq','hxEcobee::ApiReq',[],{},8192,ReportReq);
RuntimeReportReq.type$ = p.at$('RuntimeReportReq','hxEcobee::EcobeeObj',[],{},8194,RuntimeReportReq);
RuntimeReportResp.type$ = p.at$('RuntimeReportResp','hxEcobee::EcobeeResp',[],{},8226,RuntimeReportResp);
EcobeePage.type$ = p.at$('EcobeePage','hxEcobee::EcobeeObj',[],{},8194,EcobeePage);
EcobeeRuntimeReport.type$ = p.at$('EcobeeRuntimeReport','hxEcobee::EcobeeObj',[],{},8194,EcobeeRuntimeReport);
EcobeeRuntime.type$ = p.at$('EcobeeRuntime','hxEcobee::EcobeeObj',[],{},8194,EcobeeRuntime);
EcobeeSettings.type$ = p.at$('EcobeeSettings','hxEcobee::EcobeeObj',[],{},8194,EcobeeSettings);
EcobeeFunction.type$ = p.at$('EcobeeFunction','hxEcobee::EcobeeObj',[],{},8194,EcobeeFunction);
EcobeeThermostat.type$ = p.at$('EcobeeThermostat','hxEcobee::EcobeeObj',[],{},8194,EcobeeThermostat);
EcobeeVersion.type$ = p.at$('EcobeeVersion','hxEcobee::EcobeeObj',[],{},8194,EcobeeVersion);
EcobeeStatus.type$ = p.at$('EcobeeStatus','hxEcobee::EcobeeObj',[],{},8194,EcobeeStatus);
EcobeeSelection.type$ = p.at$('EcobeeSelection','hxEcobee::EcobeeObj',[],{},8194,EcobeeSelection);
SelectionType.type$ = p.at$('SelectionType','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,SelectionType);
EcobeeDecoder.type$ = p.at$('EcobeeDecoder','sys::Obj',[],{'sys::NoDoc':""},8224,EcobeeDecoder);
EcobeeEncoder.type$ = p.at$('EcobeeEncoder','sys::Obj',[],{},8192,EcobeeEncoder);
EcobeeRemoteSensor.type$ = p.at$('EcobeeRemoteSensor','hxEcobee::EcobeeObj',[],{},8194,EcobeeRemoteSensor);
EcobeeRemoteSensorCapability.type$ = p.at$('EcobeeRemoteSensorCapability','hxEcobee::EcobeeObj',[],{},8194,EcobeeRemoteSensorCapability);
EcobeeEvent.type$ = p.at$('EcobeeEvent','hxEcobee::EcobeeObj',[],{},8194,EcobeeEvent);
EcobeeConnTask.type$ = p.at$('EcobeeConnTask','sys::Obj',[],{},129,EcobeeConnTask);
EcobeeWrite.type$ = p.at$('EcobeeWrite','hxEcobee::EcobeeConnTask',[],{},128,EcobeeWrite);
EcobeeSyncCur.type$ = p.at$('EcobeeSyncCur','hxEcobee::EcobeeConnTask',[],{},128,EcobeeSyncCur);
EcobeeLearn.type$ = p.at$('EcobeeLearn','hxEcobee::EcobeeConnTask',['hxEcobee::EcobeeUtil'],{},128,EcobeeLearn);
PointBuilder.type$ = p.at$('PointBuilder','sys::Obj',[],{},128,PointBuilder);
EcobeePropId.type$ = p.at$('EcobeePropId','sys::Obj',[],{'sys::NoDoc':""},8194,EcobeePropId);
EcobeePropSpec.type$ = p.at$('EcobeePropSpec','sys::Obj',[],{'sys::NoDoc':""},8194,EcobeePropSpec);
EcobeeSyncHis.type$ = p.at$('EcobeeSyncHis','hxEcobee::EcobeeConnTask',[],{},128,EcobeeSyncHis);
EcobeeErr.type$.af$('status',73730,'hxEcobee::EcobeeStatus',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('status','hxEcobee::EcobeeStatus',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('code',8192,'sys::Int',xp,{}).am$('message',8192,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
EcobeeDispatch.type$.af$('client',65664,'hxEcobee::Ecobee?',{}).af$('latestSummary',67584,'hxEcobee::ThermostatSummaryResp?',{}).af$('lastPollSummary',67584,'sys::DateTime',{}).af$('ecobeePollInterval',100354,'sys::Duration',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('ecobeeLib',2048,'hxEcobee::EcobeeLib',xp,{}).am$('onOpen',271360,'sys::Void',xp,{}).am$('password',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('onClose',271360,'sys::Void',xp,{}).am$('onPing',271360,'haystack::Dict',xp,{}).am$('pollSummary',128,'hxEcobee::ThermostatSummaryResp',xp,{}).am$('onSyncCur',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('onWrite',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('event','hxConn::ConnWriteInfo',false)]),{}).am$('onSyncHis',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('span','haystack::Span',false)]),{}).am$('onLearn',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
EcobeeUtil.type$.af$('fahr',106498,'sys::Unit',{}).af$('relHum',106498,'sys::Unit',{}).af$('sec',106498,'sys::Unit',{}).am$('toHay',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('unit','sys::Unit?',true)]),{}).am$('toEcobee',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('field','sys::Field',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
EcobeeLib.type$.am$('cur',40962,'hxEcobee::EcobeeLib?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('make',139268,'sys::Void',xp,{});
EcobeeFuncs.type$.am$('curHx',34818,'hx::HxContext',xp,{}).am$('lib',34818,'hxEcobee::EcobeeLib',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',true)]),{}).am$('make',139268,'sys::Void',xp,{});
Ecobee.type$.af$('tokenUri',100354,'sys::Uri',{}).af$('client',65666,'oauth2::OAuthClient',{}).af$('log',73730,'sys::Log',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('clientId','sys::Str',false),new sys.Param('refreshToken','sys::Str',false),new sys.Param('log','sys::Log',true)]),{}).am$('thermostat',8192,'hxEcobee::ThermostatReq',xp,{}).am$('report',8192,'hxEcobee::ReportReq',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
EcobeeAuthorization.type$.af$('scope',73728,'sys::Str',{'util::Opt':"util::Opt{help=\"Authorization scope. Must be one of: smartRead, smartWrite, ems\";}"}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
ApiReq.type$.af$('baseUri',98434,'sys::Uri',{}).af$('client',69634,'oauth2::OAuthClient',{}).af$('log',69634,'sys::Log?',{}).af$('debugCounter',100354,'concurrent::AtomicInt',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('client','oauth2::OAuthClient',false),new sys.Param('log','sys::Log?',true)]),{}).am$('isDebug',2048,'sys::Bool',xp,{}).am$('invokeGet',8192,'hxEcobee::EcobeeObj',sys.List.make(sys.Param.type$,[new sys.Param('endpoint','sys::Uri',false),new sys.Param('obj','hxEcobee::EcobeeObj',false),new sys.Param('page','sys::Int?',true)]),{}).am$('invoke',8192,'sys::Map',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('uri','sys::Uri',false),new sys.Param('req','sys::Obj?',true),new sys.Param('headers','[sys::Str:sys::Str]',true)]),{}).am$('call',8192,'web::WebClient',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('uri','sys::Uri',false),new sys.Param('req','sys::Obj?',true),new sys.Param('headers','[sys::Str:sys::Str]',true)]),{'sys::NoDoc':""}).am$('readJson',2048,'sys::Map',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false),new sys.Param('count','sys::Int',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ThermostatReq.type$.am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ecobee','hxEcobee::Ecobee',false)]),{}).am$('summary',8192,'hxEcobee::ThermostatSummaryResp',sys.List.make(sys.Param.type$,[new sys.Param('selection','hxEcobee::EcobeeSelection',false)]),{}).am$('get',8192,'hxEcobee::EcobeeThermostat[]',sys.List.make(sys.Param.type$,[new sys.Param('selection','hxEcobee::EcobeeSelection',false)]),{}).am$('update',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('selection','hxEcobee::EcobeeSelection',false),new sys.Param('thermostat','hxEcobee::EcobeeThermostat',false)]),{}).am$('callFunc',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('selection','hxEcobee::EcobeeSelection',false),new sys.Param('func','hxEcobee::EcobeeFunction',false)]),{});
EcobeeObj.type$.af$('resJson',73730,'[sys::Str:sys::Obj?]?',{}).am$('make',8196,'sys::Void',xp,{}).am$('id',270336,'sys::Str?',xp,{}).am$('jsonKey',270336,'sys::Str',xp,{}).am$('encode',270336,'sys::Str',xp,{});
EcobeeResp.type$.af$('page',73730,'hxEcobee::EcobeePage?',{}).af$('status',73730,'hxEcobee::EcobeeStatus',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('morePages',8192,'sys::Bool',xp,{});
ThermostatSummaryResp.type$.af$('thermostatCount',73730,'sys::Int',{}).af$('revisionList',73730,'hxEcobee::ThermostatRev[]',{}).af$('statusList',73730,'hxEcobee::EquipmentStatus[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('revisions',8192,'[sys::Str:hxEcobee::ThermostatRev]',xp,{});
ThermostatResp.type$.af$('thermostatList',73730,'hxEcobee::EcobeeThermostat[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
ThermostatRev.type$.af$('id',73730,'sys::Str',{}).af$('name',73730,'sys::Str',{}).af$('connected',73730,'sys::Bool',{}).af$('thermostatRev',73730,'sys::Str',{}).af$('alertsRev',73730,'sys::Str',{}).af$('runtimeRev',73730,'sys::Str',{}).af$('intervalRev',73730,'sys::Str',{}).am$('fromStr',40966,'hxEcobee::ThermostatRev?',sys.List.make(sys.Param.type$,[new sys.Param('csv','sys::Str',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
EquipmentStatus.type$.af$('id',73730,'sys::Str',{}).af$('status',73730,'sys::Str',{}).am$('fromStr',40966,'hxEcobee::EquipmentStatus?',sys.List.make(sys.Param.type$,[new sys.Param('csv','sys::Str',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
ReportReq.type$.am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ecobee','hxEcobee::Ecobee',false)]),{}).am$('runtime',8192,'hxEcobee::RuntimeReportResp',sys.List.make(sys.Param.type$,[new sys.Param('req','hxEcobee::RuntimeReportReq',false)]),{});
RuntimeReportReq.type$.af$('selection',73730,'hxEcobee::EcobeeSelection',{}).af$('startDate',73730,'sys::Date',{}).af$('startInterval',73730,'sys::Int?',{}).af$('endDate',73730,'sys::Date',{}).af$('endInterval',73730,'sys::Int?',{}).af$('columns',73730,'sys::Str',{}).af$('includeSensors',73730,'sys::Bool?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
RuntimeReportResp.type$.af$('startDate',73730,'sys::Date',{}).af$('startInterval',73730,'sys::Int',{}).af$('endDate',73730,'sys::Date',{}).af$('endInterval',73730,'sys::Int',{}).af$('columns',73730,'sys::Str',{}).af$('reportList',73730,'hxEcobee::EcobeeRuntimeReport[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
EcobeePage.type$.af$('page',73730,'sys::Int?',{}).af$('totalPages',73730,'sys::Int?',{}).af$('pageSize',73730,'sys::Int?',{}).af$('total',73730,'sys::Int?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('makeReq',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('page','sys::Int',false)]),{}).am$('morePages',8192,'sys::Bool',xp,{});
EcobeeRuntimeReport.type$.af$('thermostatIdentifier',73730,'sys::Str?',{}).af$('rowCount',73730,'sys::Int?',{}).af$('rowList',73730,'sys::Str[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('id',271360,'sys::Str?',xp,{});
EcobeeRuntime.type$.af$('runtimeRev',73730,'sys::Str?',{}).af$('connected',73730,'sys::Bool?',{}).af$('firstConnected',73730,'sys::DateTime?',{}).af$('connectDateTime',73730,'sys::Str?',{}).af$('disconnectDateTime',73730,'sys::Str?',{}).af$('lastModified',73730,'sys::DateTime?',{}).af$('lastStatusModified',73730,'sys::DateTime?',{}).af$('runtimeDate',73730,'sys::Date?',{}).af$('runtimeInterval',73730,'sys::Int?',{}).af$('actualTemperature',73730,'sys::Int?',{}).af$('actualHumidity',73730,'sys::Int?',{}).af$('rawTemperature',73730,'sys::Int?',{}).af$('desiredHeat',73730,'sys::Int?',{}).af$('desiredCool',73730,'sys::Int?',{}).af$('desiredHumidity',73730,'sys::Int?',{}).af$('desiredFanMode',73730,'sys::Str?',{}).af$('actualVOC',73730,'sys::Int?',{}).af$('actualCO2',73730,'sys::Int?',{}).af$('actualAQAccuracy',73730,'sys::Int?',{}).af$('actualAQScore',73730,'sys::Int?',{}).af$('desiredHeatRange',73730,'sys::Int[]?',{}).af$('desiredCoolRange',73730,'sys::Int[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
EcobeeSettings.type$.af$('hvacMode',73730,'sys::Str?',{}).af$('lastServiceDate',73730,'sys::Date?',{}).af$('serviceRemindMe',73730,'sys::Bool?',{}).af$('monthsBetweenService',73730,'sys::Int?',{}).af$('remindMeDate',73730,'sys::Date?',{}).af$('vent',73730,'sys::Str?',{}).af$('ventilatorMinOnTime',73730,'sys::Int?',{}).af$('serviceRemindTechnician',73730,'sys::Bool?',{}).af$('eiLocation',73730,'sys::Str?',{}).af$('coldTempAlert',73730,'sys::Int?',{}).af$('coldTempAlertEnabled',73730,'sys::Bool?',{}).af$('hotTempAlert',73730,'sys::Int?',{}).af$('hotTempAlertEnabled',73730,'sys::Bool?',{}).af$('coolStages',73730,'sys::Int?',{}).af$('heatStages',73730,'sys::Int?',{}).af$('maxSetBack',73730,'sys::Int?',{}).af$('maxSetForward',73730,'sys::Int?',{}).af$('quickSaveSetBack',73730,'sys::Int?',{}).af$('quickSaveSetForward',73730,'sys::Int?',{}).af$('hasHeatPump',73730,'sys::Bool?',{}).af$('hasForcedAir',73730,'sys::Bool?',{}).af$('hasBoiler',73730,'sys::Bool?',{}).af$('hasHumidifier',73730,'sys::Bool?',{}).af$('hasErv',73730,'sys::Bool?',{}).af$('hasHrv',73730,'sys::Bool?',{}).af$('condensationAvoid',73730,'sys::Bool?',{}).af$('useCelsius',73730,'sys::Bool?',{}).af$('userTimeFormat12',73730,'sys::Bool?',{}).af$('locale',73730,'sys::Str?',{}).af$('humidity',73730,'sys::Str?',{}).af$('humidifierMode',73730,'sys::Str?',{}).af$('backlightOnIntensity',73730,'sys::Int?',{}).af$('backlightSleepIntensity',73730,'sys::Int?',{}).af$('backlightOffTime',73730,'sys::Int?',{}).af$('compressorProtectionMinTime',73730,'sys::Int?',{}).af$('compressorProtectionMinTemp',73730,'sys::Int?',{}).af$('stage1HeatingDifferentialTemp',73730,'sys::Int?',{}).af$('stage1CoolingDifferentialTemp',73730,'sys::Int?',{}).af$('stage1HeatingDissipationTime',73730,'sys::Int?',{}).af$('stage1CoolingDissipationTime',73730,'sys::Int?',{}).af$('heatPumpReversalOnCool',73730,'sys::Bool?',{}).af$('fanControlRequired',73730,'sys::Bool?',{}).af$('fanMinOnTime',73730,'sys::Int?',{}).af$('heatCoolMinDelta',73730,'sys::Int?',{}).af$('tempCorrection',73730,'sys::Int?',{}).af$('holdAction',73730,'sys::Str?',{}).af$('heatPumpGroundWater',73730,'sys::Bool?',{}).af$('hasElectric',73730,'sys::Bool?',{}).af$('hasDehumidifier',73730,'sys::Bool?',{}).af$('dehumidifierMode',73730,'sys::Str?',{}).af$('dehumidifierLevel',73730,'sys::Int?',{}).af$('dehumidifyWithAC',73730,'sys::Bool?',{}).af$('dehumidifyOvercoolOffset',73730,'sys::Int?',{}).af$('autoHeatCoolFeatureEnabled',73730,'sys::Bool?',{}).af$('wifiOfflineAlert',73730,'sys::Bool?',{}).af$('heatMinTemp',73730,'sys::Int?',{}).af$('heatMaxTemp',73730,'sys::Int?',{}).af$('coolMinTemp',73730,'sys::Int?',{}).af$('coolMaxTemp',73730,'sys::Int?',{}).af$('heatRangeHigh',73730,'sys::Int?',{}).af$('heatRangeLow',73730,'sys::Int?',{}).af$('coolRangeHigh',73730,'sys::Int?',{}).af$('coolRangeLow',73730,'sys::Int?',{}).af$('userAccessCode',73730,'sys::Str?',{}).af$('userAccessSetting',73730,'sys::Int?',{}).af$('auxRuntimeAlert',73730,'sys::Int?',{}).af$('auxOutdoorTempAlert',73730,'sys::Int?',{}).af$('auxMaxOutdoorTemp',73730,'sys::Int?',{}).af$('auxRuntimeAlertNotify',73730,'sys::Bool?',{}).af$('auxOutdoorTempAlertyNotify',73730,'sys::Bool?',{}).af$('auxRuntimeAlertNotifyTechnician',73730,'sys::Bool?',{}).af$('auxOutdoorTempAlertNotifyTechnician',73730,'sys::Bool?',{}).af$('disablePreHeating',73730,'sys::Bool?',{}).af$('disablePreCooling',73730,'sys::Bool?',{}).af$('installerCodeRequired',73730,'sys::Bool?',{}).af$('drAccept',73730,'sys::Str?',{}).af$('isRentalProperty',73730,'sys::Bool?',{}).af$('useZoneController',73730,'sys::Bool?',{}).af$('randomStartDelayCool',73730,'sys::Int?',{}).af$('randomStartDelayHeat',73730,'sys::Int?',{}).af$('humidityHighAlert',73730,'sys::Int?',{}).af$('humidityLowAlert',73730,'sys::Int?',{}).af$('disableHeatPumpAlerts',73730,'sys::Bool?',{}).af$('disableAlertsOnIdt',73730,'sys::Bool?',{}).af$('humidityAlertNotify',73730,'sys::Bool?',{}).af$('humidityAlertNotifyTechnician',73730,'sys::Bool?',{}).af$('tempAlertNotify',73730,'sys::Bool?',{}).af$('tempAlertNotifyTechnician',73730,'sys::Bool?',{}).af$('monthlyElectricityBillLimit',73730,'sys::Int?',{}).af$('enableElectricityBillAlert',73730,'sys::Bool?',{}).af$('enableProjectedElectricityBillAlert',73730,'sys::Bool?',{}).af$('electricityBillingDayOfMonth',73730,'sys::Int?',{}).af$('electricityBillCycleMonths',73730,'sys::Int?',{}).af$('electricityBillStartMonth',73730,'sys::Int?',{}).af$('ventilatorMinOnTimeHome',73730,'sys::Int?',{}).af$('ventilatorMinOnTimeAway',73730,'sys::Int?',{}).af$('backlightOffDuringSleep',73730,'sys::Bool?',{}).af$('autoAway',73730,'sys::Bool?',{}).af$('smartCirculation',73730,'sys::Bool?',{}).af$('followMeComfort',73730,'sys::Bool?',{}).af$('ventilatorType',73730,'sys::Str?',{}).af$('isVentilatorTimerOn',73730,'sys::Bool?',{}).af$('ventilatorOffDateTime',73730,'sys::Str?',{}).af$('hasUVFilter',73730,'sys::Bool?',{}).af$('coolingLockout',73730,'sys::Bool?',{}).af$('ventilatorFreeCooling',73730,'sys::Bool?',{}).af$('dehumidfyWhenHeating',73730,'sys::Bool?',{}).af$('ventilatorDehumidify',73730,'sys::Bool?',{}).af$('groupRef',73730,'sys::Str?',{}).af$('groupName',73730,'sys::Str?',{}).af$('groupSetting',73730,'sys::Int?',{}).af$('fanSpeed',73730,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
EcobeeFunction.type$.af$('type',73730,'sys::Str?',{}).af$('params',73730,'sys::Map?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('params','sys::Map',false)]),{});
EcobeeThermostat.type$.af$('identifier',73730,'sys::Str?',{}).af$('name',73730,'sys::Str?',{}).af$('thermostatRev',73730,'sys::Str?',{}).af$('isRegistered',73730,'sys::Bool?',{}).af$('modelNumber',73730,'sys::Str?',{}).af$('brand',73730,'sys::Str?',{}).af$('features',73730,'sys::Str?',{}).af$('utcTime',73730,'sys::DateTime?',{}).af$('settings',73730,'hxEcobee::EcobeeSettings?',{}).af$('runtime',73730,'hxEcobee::EcobeeRuntime?',{}).af$('equipmentStatus',73730,'sys::Str?',{}).af$('version',73730,'hxEcobee::EcobeeVersion?',{}).af$('remoteSensors',73730,'hxEcobee::EcobeeRemoteSensor[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('id',271360,'sys::Str?',xp,{});
EcobeeVersion.type$.af$('thermostatFirmwareVersion',73730,'sys::Version?',{}).am$('fromStr',40966,'hxEcobee::EcobeeVersion?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
EcobeeStatus.type$.af$('code',73730,'sys::Int',{}).af$('message',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false),new sys.Param('message','sys::Str',false)]),{}).am$('isOk',8192,'sys::Bool',xp,{}).am$('isErr',8192,'sys::Bool',xp,{}).am$('isTokenExpired',128,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
EcobeeSelection.type$.af$('selectionType',73730,'hxEcobee::SelectionType',{}).af$('selectionMatch',73730,'sys::Str',{}).af$('includeRuntime',73730,'sys::Bool',{}).af$('includeExtendedRuntime',73730,'sys::Bool',{}).af$('includeSettings',73730,'sys::Bool',{}).af$('includeLocation',73730,'sys::Bool',{}).af$('includeProgram',73730,'sys::Bool',{}).af$('includeEvents',73730,'sys::Bool',{}).af$('includeDevice',73730,'sys::Bool',{}).af$('includeTechnician',73730,'sys::Bool',{}).af$('includeUtility',73730,'sys::Bool',{}).af$('includeManagement',73730,'sys::Bool',{}).af$('includeAlerts',73730,'sys::Bool',{}).af$('includeWeather',73730,'sys::Bool',{}).af$('includeHouseDetails',73730,'sys::Bool',{}).af$('includeOemCfg',73730,'sys::Bool',{}).af$('includeEquipmentStatus',73730,'sys::Bool',{}).af$('includeNotificationSettings',73730,'sys::Bool',{}).af$('includePrivacy',73730,'sys::Bool',{}).af$('includeVersion',73730,'sys::Bool',{}).af$('includeSecurity',73730,'sys::Bool',{}).af$('includeSensors',73730,'sys::Bool',{}).af$('includeAudid',73730,'sys::Bool',{}).af$('includeEnergy',73730,'sys::Bool',{}).af$('includeCapabilities',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('makeThermostats',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('match','sys::Str',false)]),{});
SelectionType.type$.af$('registered',106506,'hxEcobee::SelectionType',{}).af$('thermostats',106506,'hxEcobee::SelectionType',{}).af$('managementSet',106506,'hxEcobee::SelectionType',{}).af$('vals',106498,'hxEcobee::SelectionType[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'hxEcobee::SelectionType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
EcobeeDecoder.type$.am$('make',8196,'sys::Void',xp,{}).am$('decode',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Obj?',false),new sys.Param('asType','sys::Type',false)]),{}).am$('decodeStr',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj',false)]),{}).am$('decodeBool',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj',false)]),{}).am$('decodeNum',2048,'sys::Num',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj',false)]),{}).am$('decodeDateTime',2048,'sys::DateTime',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj',false)]),{}).am$('decodeDate',2048,'sys::Date',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj',false)]),{}).am$('decodeList',2048,'sys::List',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Obj',false),new sys.Param('listType','sys::Type',false)]),{}).am$('decodeMap',2048,'sys::Map',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Obj',false),new sys.Param('mapType','sys::Type',false)]),{}).am$('decodeObj',2048,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false),new sys.Param('type','sys::Type',false)]),{}).am$('decodeField',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Field',false),new sys.Param('v','sys::Obj?',false)]),{}).am$('toField',34818,'sys::Field?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('propName','sys::Str',false)]),{}).am$('valErr',34818,'sys::ParseErr',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj',false),new sys.Param('expected','sys::Type',false)]),{});
EcobeeEncoder.type$.am$('encode',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('jsonStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('make',8196,'sys::Void',xp,{}).am$('encodeVal',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('encodeObj',8192,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('obj','hxEcobee::EcobeeObj',false)]),{}).am$('encodeEnum',8192,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Enum',false)]),{}).am$('encodeList',8192,'sys::List',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::List',false)]),{}).am$('encodeMap',8192,'sys::Map',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Map',false)]),{}).am$('acceptField',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('field','sys::Field',false)]),{}).am$('toPropName',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('field','sys::Field',false)]),{});
EcobeeRemoteSensor.type$.af$('id',336898,'sys::Str?',{}).af$('name',73730,'sys::Str?',{}).af$('type',73730,'sys::Str?',{}).af$('code',73730,'sys::Str?',{}).af$('inUse',73730,'sys::Bool?',{}).af$('capability',73730,'hxEcobee::EcobeeRemoteSensorCapability[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('getCapability',8192,'hxEcobee::EcobeeRemoteSensorCapability?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false)]),{}).am$('hasCapability',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false)]),{});
EcobeeRemoteSensorCapability.type$.af$('id',336898,'sys::Str?',{}).af$('type',73730,'sys::Str?',{}).af$('value',73730,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
EcobeeEvent.type$.af$('type',73730,'sys::Str?',{}).af$('name',73730,'sys::Str?',{}).af$('running',73730,'sys::Bool?',{}).af$('coolHoldTemp',73730,'sys::Int?',{}).af$('heatHoldTemp',73730,'sys::Int?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
EcobeeConnTask.type$.af$('dispatch',73728,'hxEcobee::EcobeeDispatch',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dispatch','hxEcobee::EcobeeDispatch',false)]),{}).am$('client',8192,'hxEcobee::Ecobee',xp,{}).am$('conn',8192,'hxConn::Conn',xp,{}).am$('log',8192,'sys::Log',xp,{}).am$('run',270337,'sys::Obj?',xp,{}).am$('toCurId',32898,'hxEcobee::EcobeePropId',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('toWriteId',32898,'hxEcobee::EcobeePropId',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('toHisId',32898,'hxEcobee::EcobeePropId',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{}).am$('toRemoteId',32898,'hxEcobee::EcobeePropId',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('tag','sys::Str',false)]),{}).am$('pointData',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('pt','hxConn::ConnPoint',false)]),{});
EcobeeWrite.type$.af$('point',67586,'hxConn::ConnPoint',{}).af$('event',67586,'hxConn::ConnWriteInfo',{}).af$('propId',67584,'hxEcobee::EcobeePropId?',{}).af$('selection',67584,'hxEcobee::EcobeeSelection?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dispatch','hxEcobee::EcobeeDispatch',false),new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('event','hxConn::ConnWriteInfo',false)]),{}).am$('run',271360,'sys::Obj?',xp,{}).am$('writeSettings',2048,'sys::Void',xp,{}).am$('toSettings',2048,'hxEcobee::EcobeeSettings',sys.List.make(sys.Param.type$,[new sys.Param('propId','hxEcobee::EcobeePropId',false)]),{}).am$('invokeFunc',2048,'sys::Void',xp,{});
EcobeeSyncCur.type$.af$('points',67586,'hxConn::ConnPoint[]',{}).af$('summary',67584,'hxEcobee::ThermostatSummaryResp?',{}).af$('stalePoints',67584,'hxConn::ConnPoint[]',{}).af$('staleThermostats',67584,'[sys::Str:sys::Bool]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dispatch','hxEcobee::EcobeeDispatch',false),new sys.Param('points','hxConn::ConnPoint[]',false)]),{}).am$('run',271360,'sys::Obj?',xp,{}).am$('init',2048,'sys::Void',xp,{}).am$('sync',2048,'sys::Void',xp,{}).am$('resolveVal',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('propId','hxEcobee::EcobeePropId',false),new sys.Param('thermostat','hxEcobee::EcobeeThermostat',false)]),{}).am$('coerce',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('propId','hxEcobee::EcobeePropId',false)]),{});
EcobeeLearn.type$.af$('arg',67584,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dispatch','hxEcobee::EcobeeDispatch',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('learn',8192,'haystack::Grid',xp,{}).am$('run',271360,'sys::Obj?',xp,{}).am$('learnRoot',2048,'haystack::Dict[]',xp,{}).am$('learnRemoteSensors',2048,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('thermostat','hxEcobee::EcobeeThermostat',false)]),{}).am$('learnThermostatPoints',2048,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('t','hxEcobee::EcobeeThermostat',false)]),{}).am$('learnRemoteSensorPoints',2048,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('t','hxEcobee::EcobeeThermostat',false),new sys.Param('s','hxEcobee::EcobeeRemoteSensor',false)]),{}).am$('capProp',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('s','hxEcobee::EcobeeRemoteSensor',false),new sys.Param('type','sys::Str',false)]),{});
PointBuilder.type$.af$('thermostat',67584,'hxEcobee::EcobeeThermostat',{}).af$('tags',67584,'[sys::Str:sys::Obj]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('thermostat','hxEcobee::EcobeeThermostat',false)]),{}).am$('set',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('dis',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('dis','sys::Str',false)]),{}).am$('kind',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('kind','sys::Str',false)]),{}).am$('unit',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('unit','sys::Unit',false)]),{}).am$('cur',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('path','sys::Str',false),new sys.Param('convert','sys::Str?',true)]),{}).am$('write',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('path','sys::Str',false),new sys.Param('convert','sys::Str?',true)]),{}).am$('his',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('path','sys::Str',false),new sys.Param('hisMode','sys::Str?',true),new sys.Param('convert','sys::Str?',true)]),{}).am$('curAndWrite',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('path','sys::Str',false)]),{}).am$('enums',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('enums','sys::Str',false)]),{}).am$('markers',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('markers','sys::Str',false)]),{}).am$('finish',8192,'haystack::Dict',xp,{});
EcobeePropId.type$.af$('uri',73730,'sys::Uri',{}).af$('thermostatId',73730,'sys::Str',{}).af$('propSpecs',73730,'hxEcobee::EcobeePropSpec[]',{}).am$('fromStr',40966,'hxEcobee::EcobeePropId?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('propUri',8192,'sys::Uri',xp,{}).am$('isSettings',8192,'sys::Bool',xp,{}).am$('isRuntime',8192,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
EcobeePropSpec.type$.af$('prop',73730,'sys::Str',{}).af$('selectKey',73730,'sys::Str?',{}).af$('selectVal',73730,'sys::Str?',{}).am$('fromStr',40966,'hxEcobee::EcobeePropSpec?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('prop','sys::Str',false),new sys.Param('selectKey','sys::Str?',false),new sys.Param('selectVal','sys::Str?',false)]),{}).am$('isObjectSelect',8192,'sys::Bool',xp,{}).am$('isIdSelector',8192,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
EcobeeSyncHis.type$.af$('point',67586,'hxConn::ConnPoint',{}).af$('span',67586,'haystack::Span',{}).af$('utcSpan',67586,'haystack::Span',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dispatch','hxEcobee::EcobeeDispatch',false),new sys.Param('point','hxConn::ConnPoint',false),new sys.Param('span','haystack::Span',false)]),{}).am$('run',271360,'sys::Obj?',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxEcobee");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;web 1.0;util 1.0;haystack 3.1.11;axon 3.1.11;folio 3.1.11;hx 3.1.11;hxConn 3.1.11;oauth2 3.1.11");
m.set("pod.summary", "Ecobee connector");
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
  EcobeeErr,
  EcobeeDispatch,
  EcobeeLib,
  EcobeeFuncs,
  Ecobee,
  EcobeeAuthorization,
  ApiReq,
  ThermostatReq,
  EcobeeObj,
  EcobeeResp,
  ThermostatSummaryResp,
  ThermostatResp,
  ThermostatRev,
  EquipmentStatus,
  ReportReq,
  RuntimeReportReq,
  RuntimeReportResp,
  EcobeePage,
  EcobeeRuntimeReport,
  EcobeeRuntime,
  EcobeeSettings,
  EcobeeFunction,
  EcobeeThermostat,
  EcobeeVersion,
  EcobeeStatus,
  EcobeeSelection,
  SelectionType,
  EcobeeDecoder,
  EcobeeEncoder,
  EcobeeRemoteSensor,
  EcobeeRemoteSensorCapability,
  EcobeeEvent,
  EcobeePropId,
  EcobeePropSpec,
};
