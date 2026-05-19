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
import * as hxStore from './hxStore.js'
import * as web from './web.js'
import * as compilerDoc from './compilerDoc.js'
import * as mqtt from './mqtt.js'
import * as wisp from './wisp.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as auth from './auth.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as defc from './defc.js'
import * as folio from './folio.js'
import * as hxFolio from './hxFolio.js'
import * as hxUtil from './hxUtil.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
import * as hxPoint from './hxPoint.js'
import * as hxConn from './hxConn.js'
import * as hxd from './hxd.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class MqttFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MqttFuncs.type$; }

  static mqttPublish(conn,topic,payload,cfg) {
    if (cfg === undefined) cfg = haystack.Etc.emptyDict();
    (payload = sys.ObjUtil.coerce(((this$) => { let $_u0 = ((this$) => { let $_u1 = sys.ObjUtil.as(payload, sys.Str.type$); if ($_u1 == null) return null; return sys.Str.toBuf(sys.ObjUtil.as(payload, sys.Str.type$)); })(this$); if ($_u0 != null) return $_u0; throw sys.Err.make(sys.Str.plus("TODO payload: ", sys.ObjUtil.typeof(payload))); })(this), sys.Obj.type$));
    let msg = hx.HxMsg.make3("mqtt.pub", topic, payload, cfg);
    return MqttLib.cur().conn(haystack.Etc.toId(conn)).send(msg).get();
  }

  static make() {
    const $self = new MqttFuncs();
    MqttFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class MqttLib extends hxConn.ConnLib {
  constructor() {
    super();
    const this$ = this;
    this.#mqtt = MqttObservable.make(this);
    this.#observables = sys.ObjUtil.coerce(((this$) => { let $_u2 = sys.List.make(obs.Observable.type$, [this$.#mqtt]); if ($_u2 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(obs.Observable.type$, [this$.#mqtt])); })(this), sys.Type.find("obs::Observable[]"));
    return;
  }

  typeof() { return MqttLib.type$; }

  #mqtt = null;

  mqtt() { return this.#mqtt; }

  __mqtt(it) { if (it === undefined) return this.#mqtt; else this.#mqtt = it; }

  #observables = null;

  observables() { return this.#observables; }

  __observables(it) { if (it === undefined) return this.#observables; else this.#observables = it; }

  static cur(checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(hx.HxContext.curHx().rt().lib("mqtt", checked), MqttLib.type$.toNullable());
  }

  onConnDetails(conn) {
    return sys.ObjUtil.coerce(((this$) => { let $_u3 = conn.data(); if ($_u3 != null) return $_u3; return "<no additional details>"; })(this), sys.Str.type$);
  }

  static make() {
    const $self = new MqttLib();
    MqttLib.make$($self);
    return $self;
  }

  static make$($self) {
    hxConn.ConnLib.make$($self);
    ;
    return;
  }

}

class MqttObservable extends obs.Observable {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MqttObservable.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  static make(lib) {
    const $self = new MqttObservable();
    MqttObservable.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    obs.Observable.make$($self);
    $self.#lib = lib;
    return;
  }

  name() {
    return "obsMqtt";
  }

  onSubscribe(observer,config) {
    let connRef = ((this$) => { let $_u4 = sys.ObjUtil.as(config.get("obsMqttConnRef"), haystack.Ref.type$); if ($_u4 != null) return $_u4; throw sys.Err.make("obsMqttConnRef not configured"); })(this);
    let conn = this.#lib.conn(sys.ObjUtil.coerce(connRef, haystack.Ref.type$));
    conn.send(hx.HxMsg.make1("mqtt.sub", config));
    return MqttSubscription.make(this, observer, config);
  }

  onUnsubscribe(s) {
    let sub = sys.ObjUtil.coerce(s, MqttSubscription.type$);
    let conn = this.#lib.conn(sub.connRef(), false);
    if (conn == null) {
      return;
    }
    ;
    try {
      conn.send(hx.HxMsg.make1("mqtt.unsub", sub));
    }
    catch ($_u5) {
      $_u5 = sys.Err.make($_u5);
      if ($_u5 instanceof sys.Err) {
        let err = $_u5;
        ;
        if (this.#lib.isRunning()) {
          throw err;
        }
        ;
      }
      else {
        throw $_u5;
      }
    }
    ;
    return;
  }

  deliver(connRef,topic,msg) {
    const this$ = this;
    let $obs = MqttObservation.make(this, topic, msg);
    this.subscriptions().each(sys.ObjUtil.coerce((sub) => {
      if (sys.ObjUtil.compareNE(sub.connRef(), connRef)) {
        return;
      }
      ;
      if (!sub.accept(topic)) {
        return;
      }
      ;
      sub.send($obs);
      return;
    }, sys.Type.find("|obs::Subscription,sys::Int->sys::Void|")));
    return;
  }

  connHasSubscriptions(connRef) {
    const this$ = this;
    return this.subscriptions().any(sys.ObjUtil.coerce((sub) => {
      return sys.ObjUtil.equals(sub.connRef(), connRef);
    }, sys.Type.find("|obs::Subscription,sys::Int->sys::Bool|")));
  }

}

class MqttSubscription extends obs.Subscription {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MqttSubscription.type$; }

  #connRef = null;

  connRef() { return this.#connRef; }

  __connRef(it) { if (it === undefined) return this.#connRef; else this.#connRef = it; }

  #filter = null;

  filter() { return this.#filter; }

  __filter(it) { if (it === undefined) return this.#filter; else this.#filter = it; }

  static make(observable,observer,config) {
    const $self = new MqttSubscription();
    MqttSubscription.make$($self,observable,observer,config);
    return $self;
  }

  static make$($self,observable,observer,config) {
    obs.Subscription.make$($self, observable, observer, config);
    $self.#connRef = sys.ObjUtil.coerce(config.get("obsMqttConnRef"), haystack.Ref.type$);
    $self.#filter = sys.ObjUtil.coerce(config.get("obsMqttTopic"), sys.Str.type$);
    return;
  }

  accept(topic) {
    return mqtt.Topic.matches(topic, this.#filter);
  }

}

class MqttObservation extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MqttObservation.type$; }

  toStr() { return haystack.Dict.prototype.toStr.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  #topic = null;

  topic() { return this.#topic; }

  __topic(it) { if (it === undefined) return this.#topic; else this.#topic = it; }

  #payload = null;

  payload() { return this.#payload; }

  __payload(it) { if (it === undefined) return this.#payload; else this.#payload = it; }

  #userProps = null;

  userProps() { return this.#userProps; }

  __userProps(it) { if (it === undefined) return this.#userProps; else this.#userProps = it; }

  static make(observable,topic,msg) {
    const $self = new MqttObservation();
    MqttObservation.make$($self,observable,topic,msg);
    return $self;
  }

  static make$($self,observable,topic,msg) {
    $self.#type = observable.name();
    $self.#ts = sys.DateTime.now();
    $self.#topic = topic;
    $self.#payload = sys.ObjUtil.coerce(((this$) => { let $_u6 = msg.payload(); if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(msg.payload()); })($self), sys.Buf.type$);
    $self.#userProps = MqttObservation.toUserProps(msg.userProps());
    return;
  }

  subType() {
    return null;
  }

  isEmpty() {
    return false;
  }

  get(name,def) {
    if (def === undefined) def = null;
    let $_u7 = name;
    if (sys.ObjUtil.equals($_u7, "type")) {
      return this.#type;
    }
    else if (sys.ObjUtil.equals($_u7, "ts")) {
      return this.#ts;
    }
    else if (sys.ObjUtil.equals($_u7, "topic")) {
      return this.#topic;
    }
    else if (sys.ObjUtil.equals($_u7, "payload")) {
      return this.#payload;
    }
    else if (sys.ObjUtil.equals($_u7, "userProps")) {
      return this.#userProps;
    }
    else {
      return def;
    }
    ;
  }

  has(name) {
    return this.get(name) != null;
  }

  missing(name) {
    return !this.has(name);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    return ((this$) => { let $_u8 = this$.get(name, null); if ($_u8 != null) return $_u8; throw haystack.UnknownNameErr.make(name); })(this);
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
    (r = sys.Func.call(f, this.#topic, "topic"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#payload, "payload"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#userProps, "userProps"));
    if (r != null) {
      return r;
    }
    ;
    return null;
  }

  static toUserProps(props) {
    const this$ = this;
    let m = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    props.each((prop) => {
      m.set(prop.name(), prop.val());
      return;
    });
    return ((this$) => { if (m.isEmpty()) return haystack.Etc.emptyDict(); return haystack.Etc.makeDict(m); })(this);
  }

}

class MqttDispatch extends hxConn.ConnDispatch {
  constructor() {
    super();
    const this$ = this;
    this.#onMessage = (topic,msg) => {
      this$.mqttLib().mqtt().deliver(this$.id(), sys.ObjUtil.coerce(topic, sys.Str.type$), sys.ObjUtil.coerce(msg, mqtt.Message.type$));
      return;
    };
    return;
  }

  typeof() { return MqttDispatch.type$; }

  onConnected() { return mqtt.ClientListener.prototype.onConnected.apply(this, arguments); }

  static #resubMsg = undefined;

  static resubMsg() {
    if (MqttDispatch.#resubMsg === undefined) {
      MqttDispatch.static$init();
      if (MqttDispatch.#resubMsg === undefined) MqttDispatch.#resubMsg = null;
    }
    return MqttDispatch.#resubMsg;
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

  #onMessage = null;

  // private field reflection only
  __onMessage(it) { if (it === undefined) return this.#onMessage; else this.#onMessage = it; }

  static make(arg) {
    const $self = new MqttDispatch();
    MqttDispatch.make$($self,arg);
    return $self;
  }

  static make$($self,arg) {
    hxConn.ConnDispatch.make$($self, arg);
    ;
    return;
  }

  mqttLib() {
    return sys.ObjUtil.coerce(this.lib(), MqttLib.type$);
  }

  onOpen() {
    const this$ = this;
    let uriVal = ((this$) => { let $_u10 = this$.rec().get("uri"); if ($_u10 != null) return $_u10; throw haystack.FaultErr.make("Missing 'uri' tag"); })(this);
    let verVal = mqtt.MqttVersion.fromStr(sys.ObjUtil.coerce(((this$) => { let $_u11 = this$.rec().get("mqttVersion"); if ($_u11 != null) return $_u11; return "v3_1_1"; })(this), sys.Str.type$));
    let clientId = this.toClientId();
    let config = mqtt.ClientConfig.make((it) => {
      it.__serverUri(sys.ObjUtil.coerce(uriVal, sys.Uri.type$));
      it.__version(sys.ObjUtil.coerce(verVal, mqtt.MqttVersion.type$));
      it.__clientId(clientId);
      it.__maxRetry(sys.ObjUtil.coerce(sys.ObjUtil.trap(this$.rec().get("mqttMaxRetry", haystack.Number.zero()),"toInt", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$));
      it.__retryInterval(sys.ObjUtil.coerce(sys.ObjUtil.trap(this$.rec().get("mqttRetryInterval", haystack.Number.makeDuration(sys.Duration.fromStr("10sec"))),"toDuration", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Duration.type$));
      it.__socketConfig(inet.SocketConfig.cur().copy((it) => {
        it.__keystore(this$.mqttKey());
        it.__connectTimeout(sys.Duration.fromStr("10sec"));
        it.__receiveTimeout(null);
        it.__tlsParams(sys.ObjUtil.coerce(((this$) => { let $_u12 = sys.Map.__fromLiteral(["appProtocols"], [this$.appProtocols()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str[]?")); if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["appProtocols"], [this$.appProtocols()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str[]?"))); })(this$), sys.Type.find("[sys::Str:sys::Obj?]")));
        return;
      }));
      return;
    });
    this.#client = mqtt.MqttClient.make(config, this.trace().asLog());
    this.#client.addListener(this);
    try {
      let resume = mqtt.ConnectConfig.make((it) => {
        it.__cleanSession(sys.ObjUtil.equals(this$.rec().get("mqttCleanSession"), true));
        it.__sessionExpiryInterval(this$.toSessionExpiryInterval());
        it.__username(sys.ObjUtil.as(this$.rec().get("username"), sys.Str.type$));
        it.__password(sys.ObjUtil.coerce(((this$) => { let $_u13 = ((this$) => { let $_u14 = this$.db().passwords().get(this$.id().toStr()); if ($_u14 == null) return null; return sys.Str.toBuf(this$.db().passwords().get(this$.id().toStr())); })(this$); if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(((this$) => { let $_u15 = this$.db().passwords().get(this$.id().toStr()); if ($_u15 == null) return null; return sys.Str.toBuf(this$.db().passwords().get(this$.id().toStr())); })(this$)); })(this$), sys.Buf.type$.toNullable()));
        return;
      });
      this.#client.connect(resume).get(sys.Duration.fromStr("10sec"));
    }
    catch ($_u16) {
      $_u16 = sys.Err.make($_u16);
      if ($_u16 instanceof sys.Err) {
        let err = $_u16;
        ;
        this.terminate();
        throw err;
      }
      else {
        throw $_u16;
      }
    }
    ;
    this.conn().send(MqttDispatch.resubMsg());
    return;
  }

  onDisconnected(err) {
    this.close(err);
    return;
  }

  onClose() {
    try {
      ((this$) => { let $_u17 = ((this$) => { let $_u18 = this$.#client; if ($_u18 == null) return null; return this$.#client.disconnect(); })(this$); if ($_u17 == null) return null; return ((this$) => { let $_u19 = this$.#client; if ($_u19 == null) return null; return this$.#client.disconnect(); })(this$).get(); })(this);
    }
    catch ($_u20) {
      $_u20 = sys.Err.make($_u20);
      if ($_u20 instanceof sys.Err) {
        let ignore = $_u20;
        ;
      }
      else {
        throw $_u20;
      }
    }
    finally {
      this.terminate();
    }
    ;
    return;
  }

  terminate() {
    ((this$) => { let $_u21 = this$.#client; if ($_u21 == null) return null; return this$.#client.terminate(); })(this);
    this.#client = null;
    return;
  }

  onPing() {
    return haystack.Etc.emptyDict();
  }

  onReceive(msg) {
    let $_u22 = msg.id();
    if (sys.ObjUtil.equals($_u22, "mqtt.pub")) {
      return this.onPub(sys.ObjUtil.coerce(msg.a(), sys.Str.type$), sys.ObjUtil.coerce(msg.b(), sys.Buf.type$), this.toConfig(sys.ObjUtil.coerce(msg.c(), haystack.Dict.type$)));
    }
    else if (sys.ObjUtil.equals($_u22, "mqtt.sub")) {
      return this.onSub(this.toConfig(sys.ObjUtil.coerce(msg.a(), haystack.Dict.type$)));
    }
    else if (sys.ObjUtil.equals($_u22, "mqtt.resub")) {
      return this.onResub();
    }
    else if (sys.ObjUtil.equals($_u22, "mqtt.unsub")) {
      return this.onUnsub(sys.ObjUtil.coerce(msg.a(), MqttSubscription.type$));
    }
    ;
    return hxConn.ConnDispatch.prototype.onReceive.call(this, msg);
  }

  onPub(topic,payload,cfg) {
    this.open();
    return this.#client.publishWith().topic(topic).payload(payload).qos(sys.ObjUtil.coerce(((this$) => { let $_u23 = ((this$) => { let $_u24 = sys.ObjUtil.as(cfg.get("mqttQos"), haystack.Number.type$); if ($_u24 == null) return null; return sys.ObjUtil.as(cfg.get("mqttQos"), haystack.Number.type$).toInt(); })(this$); if ($_u23 != null) return $_u23; return haystack.Number.zero(); })(this), sys.Obj.type$)).retain(sys.ObjUtil.equals(sys.ObjUtil.as(cfg.get("mqttRetain"), sys.Bool.type$), true)).expiryInterval(sys.ObjUtil.coerce(cfg.get("mqttExpiryInterval"), sys.Duration.type$.toNullable())).send().get();
  }

  onSub(cfg) {
    let filter = ((this$) => { let $_u25 = sys.ObjUtil.as(cfg.get("obsMqttTopic"), sys.Str.type$); if ($_u25 != null) return $_u25; throw sys.Err.make("obsMqttTopic not configured"); })(this);
    let qos = ((this$) => { let $_u26 = sys.ObjUtil.as(cfg.get("mqttQos"), haystack.Number.type$); if ($_u26 != null) return $_u26; throw sys.Err.make("mqttQos not configured"); })(this);
    this.openPin("mqtt.sub");
    try {
      let ack = this.#client.subscribeWith().topicFilter(sys.ObjUtil.coerce(filter, sys.Str.type$)).qos(sys.ObjUtil.coerce(qos.toInt(), sys.Obj.type$)).onMessage(this.#onMessage).send().get();
      return ack;
    }
    catch ($_u27) {
      $_u27 = sys.Err.make($_u27);
      if ($_u27 instanceof sys.Err) {
        let err = $_u27;
        ;
        this.trace().asLog().err(sys.Str.plus("Failed to subscribe to ", cfg), err);
        throw err;
      }
      else {
        throw $_u27;
      }
    }
    ;
  }

  onResub() {
    const this$ = this;
    this.mqttLib().mqtt().subscriptions().each(sys.ObjUtil.coerce((sub) => {
      if (sys.ObjUtil.equals(sub.connRef(), this$.conn().id())) {
        try {
          this$.onSub(this$.toConfig(sub.config()));
        }
        catch ($_u28) {
          $_u28 = sys.Err.make($_u28);
          if ($_u28 instanceof sys.Err) {
            let err = $_u28;
            ;
            this$.trace().asLog().err(sys.Str.plus("Failed to subscribe to ", sub.config()), err);
          }
          else {
            throw $_u28;
          }
        }
        ;
      }
      ;
      return;
    }, sys.Type.find("|obs::Subscription,sys::Int->sys::Void|")));
    return null;
  }

  onUnsub(sub) {
    try {
      return sys.ObjUtil.coerce(this.open(), MqttDispatch.type$).#client.unsubscribe(sub.filter()).get();
    }
    catch ($_u29) {
      $_u29 = sys.Err.make($_u29);
      if ($_u29 instanceof sys.Err) {
        let err = $_u29;
        ;
        this.trace().asLog().err(sys.Str.plus("Failed to unsubscribe filter: ", sub.filter()), err);
        throw err;
      }
      else {
        throw $_u29;
      }
    }
    finally {
      if (!this.mqttLib().mqtt().connHasSubscriptions(this.id())) {
        this.closePin("mqtt.sub");
      }
      ;
    }
    ;
  }

  onHouseKeeping() {
    this.setConnData(((this$) => { let $_u30 = this$.#client; if ($_u30 == null) return null; return this$.#client.debugClient(); })(this));
    return;
  }

  toClientId() {
    let id = sys.ObjUtil.as(this.rec().get("mqttClientId"), sys.Str.type$);
    if (id == null) {
      (id = mqtt.ClientId.gen());
      this.db().commit(folio.Diff.make(this.rec(), sys.Map.__fromLiteral(["mqttClientId"], [id], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?"))));
    }
    ;
    return sys.ObjUtil.coerce(id, sys.Str.type$);
  }

  toConfig(opts) {
    let defs = sys.Map.__fromLiteral(["mqttQos"], [haystack.Number.zero()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number"));
    return haystack.Etc.dictMerge(haystack.Etc.makeDict(defs), opts);
  }

  mqttKey() {
    let alias = sys.ObjUtil.as(this.rec().get("mqttCertAlias"), sys.Str.type$);
    if (alias == null) {
      return null;
    }
    ;
    let entry = sys.ObjUtil.as(this.rt().services().crypto().keystore().get(sys.ObjUtil.coerce(alias, sys.Str.type$)), crypto.PrivKeyEntry.type$);
    return crypto.Crypto.cur().loadKeyStore().set("mqtt", sys.ObjUtil.coerce(entry, crypto.KeyStoreEntry.type$));
  }

  appProtocols() {
    let protos = this.rec().get("mqttAppProtocols");
    if (sys.ObjUtil.is(protos, sys.Str.type$)) {
      return sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable(), [protos]), sys.Type.find("sys::Str[]?"));
    }
    ;
    if (sys.ObjUtil.is(protos, sys.Type.find("sys::Str[]"))) {
      return sys.ObjUtil.coerce(protos, sys.Type.find("sys::Str[]?"));
    }
    ;
    return null;
  }

  toSessionExpiryInterval() {
    let v = sys.ObjUtil.as(this.rec().get("mqttSessionExpiryInterval"), sys.Duration.type$);
    if (v == null) {
      (v = mqtt.MqttConst.sessionExpiresOnClose());
    }
    else {
      if (sys.ObjUtil.equals(v, sys.Duration.fromStr("-1sec"))) {
        (v = mqtt.MqttConst.sessionNeverExpires());
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(v, sys.Duration.type$);
  }

  static static$init() {
    MqttDispatch.#resubMsg = hx.HxMsg.make0("mqtt.resub");
    return;
  }

}

const p = sys.Pod.add$('hxMqtt');
const xp = sys.Param.noParams$();
let m;
MqttFuncs.type$ = p.at$('MqttFuncs','sys::Obj',[],{},8194,MqttFuncs);
MqttLib.type$ = p.at$('MqttLib','hxConn::ConnLib',[],{},8194,MqttLib);
MqttObservable.type$ = p.at$('MqttObservable','obs::Observable',[],{},130,MqttObservable);
MqttSubscription.type$ = p.at$('MqttSubscription','obs::Subscription',[],{},130,MqttSubscription);
MqttObservation.type$ = p.at$('MqttObservation','sys::Obj',['obs::Observation'],{'sys::NoDoc':""},8194,MqttObservation);
MqttDispatch.type$ = p.at$('MqttDispatch','hxConn::ConnDispatch',['mqtt::ClientListener'],{},8192,MqttDispatch);
MqttFuncs.type$.am$('mqttPublish',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('conn','sys::Obj',false),new sys.Param('topic','sys::Str',false),new sys.Param('payload','sys::Obj',false),new sys.Param('cfg','haystack::Dict',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('make',139268,'sys::Void',xp,{});
MqttLib.type$.af$('mqtt',65666,'hxMqtt::MqttObservable',{}).af$('observables',336898,'obs::Observable[]',{}).am$('cur',40962,'hxMqtt::MqttLib?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('onConnDetails',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('conn','hxConn::Conn',false)]),{}).am$('make',139268,'sys::Void',xp,{});
MqttObservable.type$.af$('lib',73730,'hxMqtt::MqttLib',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxMqtt::MqttLib',false)]),{}).am$('name',271360,'sys::Str',xp,{}).am$('onSubscribe',267264,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('onUnsubscribe',267264,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','obs::Subscription',false)]),{}).am$('deliver',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('connRef','haystack::Ref',false),new sys.Param('topic','sys::Str',false),new sys.Param('msg','mqtt::Message',false)]),{}).am$('connHasSubscriptions',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('connRef','haystack::Ref',false)]),{});
MqttSubscription.type$.af$('connRef',73730,'haystack::Ref',{}).af$('filter',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','hxMqtt::MqttObservable',false),new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('accept',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false)]),{});
MqttObservation.type$.af$('type',336898,'sys::Str',{}).af$('ts',336898,'sys::DateTime',{}).af$('topic',73730,'sys::Str',{}).af$('payload',73730,'sys::Buf',{}).af$('userProps',73730,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','obs::Observable',false),new sys.Param('topic','sys::Str',false),new sys.Param('msg','mqtt::Message',false)]),{}).am$('subType',271360,'sys::Str?',xp,{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('toUserProps',34818,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('props','mqtt::StrPair[]',false)]),{});
MqttDispatch.type$.af$('resubMsg',100354,'hx::HxMsg',{}).af$('client',69632,'mqtt::MqttClient?',{}).af$('onMessage',67584,'|sys::Str,mqtt::Message->sys::Void|',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('mqttLib',4096,'hxMqtt::MqttLib',xp,{}).am$('onOpen',271360,'sys::Void',xp,{}).am$('onDisconnected',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err?',false)]),{}).am$('onClose',271360,'sys::Void',xp,{}).am$('terminate',2048,'sys::Void',xp,{}).am$('onPing',271360,'haystack::Dict',xp,{}).am$('onReceive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('onPub',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('topic','sys::Str',false),new sys.Param('payload','sys::Buf',false),new sys.Param('cfg','haystack::Dict',false)]),{}).am$('onSub',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cfg','haystack::Dict',false)]),{}).am$('onResub',2048,'sys::Obj?',xp,{}).am$('onUnsub',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('sub','hxMqtt::MqttSubscription',false)]),{}).am$('onHouseKeeping',271360,'sys::Void',xp,{}).am$('toClientId',2048,'sys::Str',xp,{}).am$('toConfig',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict',false)]),{}).am$('mqttKey',2048,'crypto::KeyStore?',xp,{}).am$('appProtocols',2048,'sys::Str[]?',xp,{}).am$('toSessionExpiryInterval',2048,'sys::Duration',xp,{}).am$('static$init',165890,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxMqtt");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;crypto 1.0;inet 1.0;mqtt 3.1.11;haystack 3.1.11;axon 3.1.11;folio 3.1.11;obs 3.1.11;hx 3.1.11;hxd 3.1.11;hxConn 3.1.11");
m.set("pod.summary", "MQTT Connector");
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
  MqttFuncs,
  MqttLib,
  MqttObservation,
  MqttDispatch,
};
