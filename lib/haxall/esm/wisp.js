// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as util from './util.js'
import * as web from './web.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class WispReq extends web.WebReq {
  constructor() {
    super();
    const this$ = this;
    this.#method = "";
    this.#version = WispReq.nullVersion();
    this.#headers = WispReq.nullHeaders();
    this.#uri = sys.Uri.fromStr("");
    this.#checkContinue = true;
    return;
  }

  typeof() { return WispReq.type$; }

  #mod = null;

  mod(it) {
    if (it === undefined) {
      return this.#mod;
    }
    else {
      this.#mod = it;
      return;
    }
  }

  #method = null;

  method() {
    return this.#method;
  }

  #isGet = false;

  isGet() {
    return this.#isGet;
  }

  #isPost = false;

  isPost() {
    return this.#isPost;
  }

  #version = null;

  version(it) {
    if (it === undefined) {
      return this.#version;
    }
    else {
      this.#version = it;
      return;
    }
  }

  #headers = null;

  headers(it) {
    if (it === undefined) {
      return this.#headers;
    }
    else {
      this.#headers = it;
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

  #socket = null;

  socket(it) {
    if (it === undefined) {
      return this.#socket;
    }
    else {
      this.#socket = it;
      return;
    }
  }

  static #nullVersion = undefined;

  static nullVersion() {
    if (WispReq.#nullVersion === undefined) {
      WispReq.static$init();
      if (WispReq.#nullVersion === undefined) WispReq.#nullVersion = null;
    }
    return WispReq.#nullVersion;
  }

  static #nullHeaders = undefined;

  static nullHeaders() {
    if (WispReq.#nullHeaders === undefined) {
      WispReq.static$init();
      if (WispReq.#nullHeaders === undefined) WispReq.#nullHeaders = null;
    }
    return WispReq.#nullHeaders;
  }

  #service = null;

  service(it) {
    if (it === undefined) {
      return this.#service;
    }
    else {
      this.#service = it;
      return;
    }
  }

  #webIn = null;

  webIn(it) {
    if (it === undefined) {
      return this.#webIn;
    }
    else {
      this.#webIn = it;
      return;
    }
  }

  #checkContinue = false;

  // private field reflection only
  __checkContinue(it) { if (it === undefined) return this.#checkContinue; else this.#checkContinue = it; }

  #res = null;

  // private field reflection only
  __res(it) { if (it === undefined) return this.#res; else this.#res = it; }

  #absUri$Store = undefined;

  // private field reflection only
  __absUri$Store(it) { if (it === undefined) return this.#absUri$Store; else this.#absUri$Store = it; }

  #session$Store = undefined;

  // private field reflection only
  __session$Store(it) { if (it === undefined) return this.#session$Store; else this.#session$Store = it; }

  static make(service,socket,res) {
    const $self = new WispReq();
    WispReq.make$($self,service,socket,res);
    return $self;
  }

  static make$($self,service,socket,res) {
    web.WebReq.make$($self);
    ;
    $self.#service = service;
    $self.mod(service.root());
    $self.socket(socket);
    $self.#res = res;
    return;
  }

  remoteAddr() {
    return sys.ObjUtil.coerce(this.socket().remoteAddr(), inet.IpAddr.type$);
  }

  remotePort() {
    return sys.ObjUtil.coerce(this.socket().remotePort(), sys.Int.type$);
  }

  absUri() {
    if (this.#absUri$Store === undefined) {
      this.#absUri$Store = this.absUri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#absUri$Store, sys.Uri.type$);
  }

  session() {
    if (this.#session$Store === undefined) {
      this.#session$Store = this.session$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#session$Store, web.WebSession.type$);
  }

  in() {
    if (this.#webIn == null) {
      throw sys.Err.make("Attempt to access WebReq.in with no content");
    }
    ;
    if (this.#checkContinue) {
      this.#checkContinue = false;
      if (sys.ObjUtil.equals(((this$) => { let $_u0 = this$.headers().get("Expect"); if ($_u0 == null) return null; return sys.Str.lower(this$.headers().get("Expect")); })(this), "100-continue")) {
        this.#res.sendContinue();
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(this.#webIn, sys.InStream.type$);
  }

  socketOptions() {
    return this.socket().options();
  }

  setMethod(method) {
    (method = sys.Str.upper(method));
    this.#method = method;
    this.#isGet = sys.ObjUtil.equals(method, "GET");
    this.#isPost = sys.ObjUtil.equals(method, "POST");
    return;
  }

  isUpgrade() {
    return this.headers().get("Upgrade") != null;
  }

  isKeepAlive() {
    return sys.Str.indexIgnoreCase(this.headers().get("Connection", ""), "keep-alive") != null;
  }

  absUri$Once() {
    let scheme = ((this$) => { if (this$.#service.httpsPort() != null) return "https"; return "http"; })(this);
    let host = this.headers().get("Host");
    if (host == null) {
      throw sys.Err.make("Missing Host header");
    }
    ;
    return sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", scheme), "://"), host), "/")).plus(this.uri());
  }

  session$Once() {
    return this.#service.sessionStore().doLoad(this);
  }

  static static$init() {
    WispReq.#nullVersion = sys.ObjUtil.coerce(sys.Version.fromStr("0"), sys.Version.type$);
    WispReq.#nullHeaders = sys.ObjUtil.coerce(((this$) => { let $_u2 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u2 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

}

class WispSessionStore {
  constructor() {
    const this$ = this;
  }

  typeof() { return WispSessionStore.type$; }

  onStart() {
    return;
  }

  onStop() {
    return;
  }

  doLoad(req) {
    let ws = null;
    let name = this.service().sessionCookieName();
    let id = req.cookies().get(name);
    if (id != null) {
      let map = this.load(sys.ObjUtil.coerce(id, sys.Str.type$));
      (ws = WispSession.make(name, sys.ObjUtil.coerce(id, sys.Str.type$), map));
    }
    else {
      (ws = WispSession.make(name, sys.Str.plus(sys.Str.plus(sys.Uuid.make().toStr(), "-"), sys.Buf.random(8).toHex()), sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))));
      let res = sys.ObjUtil.coerce(concurrent.Actor.locals().get("web.res"), web.WebRes.type$);
      res.cookies().add(this.makeCookie(sys.ObjUtil.coerce(ws, WispSession.type$)));
    }
    ;
    concurrent.Actor.locals().set("web.session", ws);
    return sys.ObjUtil.coerce(ws, WispSession.type$);
  }

  makeCookie(ws) {
    return web.Cookie.makeSession(ws.name(), ws.id());
  }

  doSave() {
    try {
      let ws = sys.ObjUtil.coerce(concurrent.Actor.locals().remove("web.session"), WispSession.type$.toNullable());
      if (ws != null) {
        if (ws.isDeleted()) {
          this.delete(ws.id());
        }
        else {
          this.save(ws.id(), ws.map());
        }
        ;
      }
      ;
    }
    catch ($_u3) {
      $_u3 = sys.Err.make($_u3);
      if ($_u3 instanceof sys.Err) {
        let e = $_u3;
        ;
        WispService.log().err("WispSession save", e);
      }
      else {
        throw $_u3;
      }
    }
    ;
    return;
  }

}

class WispRes extends web.WebRes {
  constructor() {
    super();
    const this$ = this;
    this.#statusCode = 200;
    this.#cookies = sys.List.make(web.Cookie.type$);
    this.#isCommitted = false;
    this.#isDone = false;
    return;
  }

  typeof() { return WispRes.type$; }

  #statusCode = 0;

  statusCode(it) {
    if (it === undefined) {
      return this.#statusCode;
    }
    else {
      this.checkUncommitted();
      this.#statusCode = it;
      return;
    }
  }

  #statusPhrase = null;

  statusPhrase(it) {
    if (it === undefined) {
      return this.#statusPhrase;
    }
    else {
      this.checkUncommitted();
      this.#statusPhrase = it;
      return;
    }
  }

  #headers = null;

  headers(it) {
    if (it === undefined) {
      return this.#headers;
    }
    else {
      this.#headers = it;
      return;
    }
  }

  #cookies = null;

  cookies(it) {
    if (it === undefined) {
      this.checkUncommitted();
      return this.#cookies;
    }
    else {
      this.#cookies = it;
      return;
    }
  }

  #isCommitted = false;

  isCommitted() {
    return this.#isCommitted;
  }

  #isDone = false;

  isDone() {
    return this.#isDone;
  }

  #service = null;

  service(it) {
    if (it === undefined) {
      return this.#service;
    }
    else {
      this.#service = it;
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

  #socket = null;

  socket(it) {
    if (it === undefined) {
      return this.#socket;
    }
    else {
      this.#socket = it;
      return;
    }
  }

  #webOut = null;

  webOut(it) {
    if (it === undefined) {
      return this.#webOut;
    }
    else {
      this.#webOut = it;
      return;
    }
  }

  #upgraded = false;

  upgraded(it) {
    if (it === undefined) {
      return this.#upgraded;
    }
    else {
      this.#upgraded = it;
      return;
    }
  }

  static make(service,socket) {
    const $self = new WispRes();
    WispRes.make$($self,service,socket);
    return $self;
  }

  static make$($self,service,socket) {
    const this$ = $self;
    web.WebRes.make$($self);
    ;
    let headers = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.caseInsensitive(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    headers.set("Date", sys.DateTime.now().toHttpStr());
    headers.set("Connection", "close");
    headers.setAll(service.extraResHeaders());
    $self.#service = service;
    $self.#socket = socket;
    $self.headers(headers);
    return;
  }

  out() {
    this.commit(true);
    if (this.#webOut == null) {
      throw sys.Err.make("Must set Content-Length or Content-Type to write content");
    }
    ;
    return sys.ObjUtil.coerce(this.#webOut, web.WebOutStream.type$);
  }

  redirect(uri,statusCode) {
    if (statusCode === undefined) statusCode = 303;
    this.checkUncommitted();
    this.statusCode(statusCode);
    this.headers().set("Location", uri.encode());
    this.headers().set("Content-Length", "0");
    this.commit(false);
    this.done();
    return;
  }

  sendErr(statusCode,msg) {
    if (msg === undefined) msg = null;
    this.checkUncommitted();
    let buf = null;
    if (this.headers().get("Content-Length") == null) {
      (buf = sys.Buf.make());
      let bufOut = web.WebOutStream.make(buf.out());
      bufOut.docType();
      bufOut.html();
      bufOut.head().title().w(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(statusCode, sys.Obj.type$.toNullable())), " "), web.WebRes.statusMsg().get(sys.ObjUtil.coerce(statusCode, sys.Obj.type$.toNullable())))).titleEnd().headEnd();
      bufOut.body();
      bufOut.h1().w(web.WebRes.statusMsg().get(sys.ObjUtil.coerce(statusCode, sys.Obj.type$.toNullable()))).h1End();
      if (msg != null) {
        bufOut.w(sys.Str.toXml(msg)).nl();
      }
      ;
      bufOut.bodyEnd();
      bufOut.htmlEnd();
      this.headers().set("Content-Type", "text/html; charset=UTF-8");
      this.headers().set("Content-Length", sys.Int.toStr(buf.size()));
    }
    ;
    this.statusCode(statusCode);
    this.statusPhrase(msg);
    if (buf != null) {
      this.out().writeBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$));
    }
    else {
      this.commit(false);
    }
    ;
    this.done();
    return;
  }

  sendContinue() {
    this.checkUncommitted();
    let sout = this.#socket.out();
    sout.print("HTTP/1.1 100 Continue\r\n");
    sout.print("\r\n").flush();
    return;
  }

  done() {
    this.#isDone = true;
    return;
  }

  upgrade(statusCode) {
    if (statusCode === undefined) statusCode = 101;
    this.checkUncommitted();
    this.statusCode(statusCode);
    this.#upgraded = true;
    this.commit(false);
    return this.#socket;
  }

  checkUncommitted() {
    if (this.isCommitted()) {
      throw sys.Err.make("WebRes already committed");
    }
    ;
    return;
  }

  commit(content) {
    const this$ = this;
    if (this.isCommitted()) {
      return;
    }
    ;
    this.#isCommitted = true;
    let sout = this.#socket.out();
    if (content) {
      this.#webOut = this.#req.mod().makeResOut(sout);
    }
    ;
    this.headers(this.headers().ro());
    sout.print("HTTP/1.1 ").print(sys.ObjUtil.coerce(this.statusCode(), sys.Obj.type$.toNullable())).print(" ").print(this.toStatusMsg()).print("\r\n");
    web.WebUtil.writeHeaders(sout, this.headers());
    this.#cookies.each((c) => {
      sout.print("Set-Cookie: ").print(c).print("\r\n");
      return;
    });
    sout.print("\r\n").flush();
    return;
  }

  toStatusMsg() {
    if ((sys.ObjUtil.equals(this.statusCode(), 101) && sys.ObjUtil.equals(this.#headers.get("Upgrade"), "WebSocket"))) {
      return "Web Socket Protocol Handshake";
    }
    else {
      if (this.statusPhrase() != null) {
        return sys.ObjUtil.coerce(this.statusPhrase(), sys.Str.type$);
      }
      else {
        return sys.ObjUtil.coerce(((this$) => { let $_u4 = web.WebRes.statusMsg().get(sys.ObjUtil.coerce(this$.statusCode(), sys.Obj.type$.toNullable())); if ($_u4 != null) return $_u4; return sys.Int.toStr(this$.statusCode()); })(this), sys.Str.type$);
      }
      ;
    }
    ;
  }

  close() {
    this.commit(false);
    if (this.#webOut != null) {
      this.#webOut.close();
    }
    ;
    return;
  }

}

class WispSession extends web.WebSession {
  constructor() {
    super();
    const this$ = this;
    this.#map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    this.#isDeleted = false;
    return;
  }

  typeof() { return WispSession.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #map = null;

  map(it) {
    if (it === undefined) {
      return this.#map;
    }
    else {
      this.#map = it;
      return;
    }
  }

  #isDeleted = false;

  isDeleted(it) {
    if (it === undefined) {
      return this.#isDeleted;
    }
    else {
      this.#isDeleted = it;
      return;
    }
  }

  static make(name,id,map) {
    const $self = new WispSession();
    WispSession.make$($self,name,id,map);
    return $self;
  }

  static make$($self,name,id,map) {
    web.WebSession.make$($self);
    ;
    $self.#name = name;
    $self.#id = id;
    $self.map(map);
    return;
  }

  delete() {
    const this$ = this;
    this.#isDeleted = true;
    let res = sys.ObjUtil.coerce(concurrent.Actor.locals().get("web.res"), WispRes.type$);
    res.cookies().add(web.Cookie.make(this.#name, this.#id, (it) => {
      it.__maxAge(sys.Duration.fromStr("0ns"));
      return;
    }));
    return;
  }

  each(f) {
    this.map().each(f);
    return;
  }

  get(name,def) {
    if (def === undefined) def = null;
    return this.map().get(name, def);
  }

  set(name,val) {
    if (sys.ObjUtil.equals(this.map().get(name), val)) {
      return;
    }
    ;
    if ((val != null && !sys.ObjUtil.isImmutable(val))) {
      throw sys.NotImmutableErr.make(sys.Str.plus("WebSession value not immutable: ", val));
    }
    ;
    this.modify();
    this.map().set(name, val);
    return;
  }

  remove(name) {
    if (!this.map().containsKey(name)) {
      return;
    }
    ;
    this.modify();
    this.map().remove(name);
    return;
  }

  modify() {
    if (this.map().isRO()) {
      this.map(this.map().rw());
    }
    ;
    return this;
  }

}

class WispService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#addr = null;
    this.#httpPort = null;
    this.#httpsPort = null;
    this.#root = WispDefaultRootMod.make();
    this.#sessionStore = MemWispSessionStore.make(this);
    this.#maxThreads = 500;
    this.#errMod = WispService.initErrMod();
    this.#socketConfig = inet.SocketConfig.cur();
    this.#isListeningRef = concurrent.AtomicBool.make(false);
    this.#extraResHeaders = sys.ObjUtil.coerce(((this$) => { let $_u5 = WispService.initExtraResHeaders(); if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(WispService.initExtraResHeaders()); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    this.#sessionCookieName = sys.ObjUtil.coerce(sys.Pod.find("web").config("sessionCookieName", "fanws"), sys.Str.type$);
    return;
  }

  typeof() { return WispService.type$; }

  isInstalled() { return sys.Service.prototype.isInstalled.apply(this, arguments); }

  start() { return sys.Service.prototype.start.apply(this, arguments); }

  stop() { return sys.Service.prototype.stop.apply(this, arguments); }

  uninstall() { return sys.Service.prototype.uninstall.apply(this, arguments); }

  isRunning() { return sys.Service.prototype.isRunning.apply(this, arguments); }

  install() { return sys.Service.prototype.install.apply(this, arguments); }

  equals() { return sys.Service.prototype.equals.apply(this, arguments); }

  hash() { return sys.Service.prototype.hash.apply(this, arguments); }

  static #log = undefined;

  static log() {
    if (WispService.#log === undefined) {
      WispService.static$init();
      if (WispService.#log === undefined) WispService.#log = null;
    }
    return WispService.#log;
  }

  #addr = null;

  addr() { return this.#addr; }

  __addr(it) { if (it === undefined) return this.#addr; else this.#addr = it; }

  #httpPort = null;

  httpPort() { return this.#httpPort; }

  __httpPort(it) { if (it === undefined) return this.#httpPort; else this.#httpPort = it; }

  #httpsPort = null;

  httpsPort() { return this.#httpsPort; }

  __httpsPort(it) { if (it === undefined) return this.#httpsPort; else this.#httpsPort = it; }

  #root = null;

  root() { return this.#root; }

  __root(it) { if (it === undefined) return this.#root; else this.#root = it; }

  #sessionStore = null;

  sessionStore() { return this.#sessionStore; }

  __sessionStore(it) { if (it === undefined) return this.#sessionStore; else this.#sessionStore = it; }

  #maxThreads = 0;

  maxThreads() { return this.#maxThreads; }

  __maxThreads(it) { if (it === undefined) return this.#maxThreads; else this.#maxThreads = it; }

  #errMod = null;

  errMod() { return this.#errMod; }

  __errMod(it) { if (it === undefined) return this.#errMod; else this.#errMod = it; }

  #socketConfig = null;

  socketConfig() { return this.#socketConfig; }

  __socketConfig(it) { if (it === undefined) return this.#socketConfig; else this.#socketConfig = it; }

  #isListeningRef = null;

  // private field reflection only
  __isListeningRef(it) { if (it === undefined) return this.#isListeningRef; else this.#isListeningRef = it; }

  #extraResHeaders = null;

  extraResHeaders() { return this.#extraResHeaders; }

  __extraResHeaders(it) { if (it === undefined) return this.#extraResHeaders; else this.#extraResHeaders = it; }

  #sessionCookieName = null;

  sessionCookieName() { return this.#sessionCookieName; }

  __sessionCookieName(it) { if (it === undefined) return this.#sessionCookieName; else this.#sessionCookieName = it; }

  #listenerPool = null;

  listenerPool() { return this.#listenerPool; }

  __listenerPool(it) { if (it === undefined) return this.#listenerPool; else this.#listenerPool = it; }

  #httpListenerRef = null;

  httpListenerRef() { return this.#httpListenerRef; }

  __httpListenerRef(it) { if (it === undefined) return this.#httpListenerRef; else this.#httpListenerRef = it; }

  #httpsListenerRef = null;

  httpsListenerRef() { return this.#httpsListenerRef; }

  __httpsListenerRef(it) { if (it === undefined) return this.#httpsListenerRef; else this.#httpsListenerRef = it; }

  #processorPool = null;

  processorPool() { return this.#processorPool; }

  __processorPool(it) { if (it === undefined) return this.#processorPool; else this.#processorPool = it; }

  isListening() {
    return this.#isListeningRef.val();
  }

  static initErrMod() {
    try {
      return sys.ObjUtil.coerce(sys.Type.find(sys.ObjUtil.coerce(sys.Pod.find("web").config("errMod", "wisp::WispDefaultErrMod"), sys.Str.type$)).make(), web.WebMod.type$);
    }
    catch ($_u6) {
      $_u6 = sys.Err.make($_u6);
      if ($_u6 instanceof sys.Err) {
        let e = $_u6;
        ;
        WispService.log().err("Cannot init errMod", e);
      }
      else {
        throw $_u6;
      }
    }
    ;
    return WispDefaultErrMod.make();
  }

  static initExtraResHeaders() {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.caseInsensitive(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    try {
      WispService.parseExtraHeaders(acc, sys.ObjUtil.coerce(sys.Pod.find("web").config("extraResHeaders", ""), sys.Str.type$));
    }
    catch ($_u7) {
      $_u7 = sys.Err.make($_u7);
      if ($_u7 instanceof sys.Err) {
        let e = $_u7;
        ;
        WispService.log().err("Cannot init resHeaders", e);
      }
      else {
        throw $_u7;
      }
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("[sys::Str:sys::Str]"));
  }

  static parseExtraHeaders(acc,str) {
    const this$ = this;
    (str = sys.Str.trim(str));
    if (sys.Str.endsWith(str, ";")) {
      (str = sys.Str.getRange(str, sys.Range.make(0, -2)));
    }
    ;
    if (sys.Str.isEmpty(str)) {
      return;
    }
    ;
    let pairs = sys.List.make(sys.Str.type$);
    let s = 0;
    let inStr = false;
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(str)); i = sys.Int.increment(i)) {
      let ch = sys.Str.get(str, i);
      if (sys.ObjUtil.equals(ch, 34)) {
        (inStr = !inStr);
      }
      ;
      if ((sys.ObjUtil.equals(ch, 59) && !inStr)) {
        pairs.add(sys.Str.trim(sys.Str.getRange(str, sys.Range.make(s, i, true))));
        (s = sys.Int.plus(i, 1));
      }
      ;
    }
    ;
    if (sys.ObjUtil.compareLT(s, sys.Str.size(str))) {
      pairs.add(sys.Str.trim(sys.Str.getRange(str, sys.Range.make(s, -1))));
    }
    ;
    pairs.each((pair) => {
      let colon = ((this$) => { let $_u8 = sys.Str.index(pair, ":"); if ($_u8 != null) return $_u8; throw sys.Err.make(sys.Str.plus("Missing colon: ", pair)); })(this$);
      let key = sys.Str.trim(sys.Str.getRange(pair, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true)));
      let val = sys.Str.trim(sys.Str.getRange(pair, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), -1)));
      if ((sys.Str.startsWith(val, "\"") && sys.Str.endsWith(val, "\""))) {
        (val = sys.Str.getRange(val, sys.Range.make(1, -2)));
      }
      ;
      if ((sys.Str.isEmpty(key) || sys.Str.isEmpty(val))) {
        throw sys.Err.make(sys.Str.plus("Invalid header: ", pair));
      }
      ;
      acc.set(key, val);
      return;
    });
    return;
  }

  static make(f) {
    const $self = new WispService();
    WispService.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    const this$ = $self;
    ;
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    if (($self.#httpPort == null && $self.#httpsPort == null)) {
      throw sys.ArgErr.make("httpPort and httpsPort are both null. At least one port must be configured.");
    }
    ;
    if (sys.ObjUtil.equals($self.#httpPort, $self.#httpsPort)) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("httpPort '", sys.ObjUtil.coerce($self.#httpPort, sys.Obj.type$.toNullable())), "' cannot be the same as httpsPort '"), sys.ObjUtil.coerce($self.#httpsPort, sys.Obj.type$.toNullable())), "'"));
    }
    ;
    if (($self.#httpPort != null && $self.#httpsPort != null)) {
      $self.#root = WispHttpsRedirectMod.make($self, $self.#root);
    }
    ;
    $self.#listenerPool = concurrent.ActorPool.make((it) => {
      it.__name("WispServiceListener");
      return;
    });
    $self.#httpListenerRef = concurrent.AtomicRef.make();
    $self.#httpsListenerRef = concurrent.AtomicRef.make();
    $self.#processorPool = concurrent.ActorPool.make((it) => {
      it.__name("WispService");
      it.__maxThreads(this$.#maxThreads);
      return;
    });
    return;
  }

  onStart() {
    const this$ = this;
    if (this.#listenerPool.isStopped()) {
      throw sys.Err.make("WispService is already stopped, use to new instance to restart");
    }
    ;
    if (this.#httpPort != null) {
      concurrent.Actor.make(this.#listenerPool, () => {
        this$.listen(this$.makeListener(this$.#httpListenerRef), sys.ObjUtil.coerce(this$.#httpPort, sys.Int.type$));
        return;
      }).send(null);
    }
    ;
    if (this.#httpsPort != null) {
      concurrent.Actor.make(this.#listenerPool, () => {
        this$.listen(this$.makeListener(this$.#httpsListenerRef), sys.ObjUtil.coerce(this$.#httpsPort, sys.Int.type$));
        return;
      }).send(null);
    }
    ;
    this.#sessionStore.onStart();
    this.#root.onStart();
    return;
  }

  onStop() {
    try {
      this.#root.onStop();
    }
    catch ($_u9) {
      $_u9 = sys.Err.make($_u9);
      if ($_u9 instanceof sys.Err) {
        let e = $_u9;
        ;
        WispService.log().err("WispService stop root WebMod", e);
      }
      else {
        throw $_u9;
      }
    }
    ;
    try {
      this.#listenerPool.stop();
    }
    catch ($_u10) {
      $_u10 = sys.Err.make($_u10);
      if ($_u10 instanceof sys.Err) {
        let e = $_u10;
        ;
        WispService.log().err("WispService stop listener pool", e);
      }
      else {
        throw $_u10;
      }
    }
    ;
    try {
      this.closeListener(this.#httpListenerRef);
    }
    catch ($_u11) {
      $_u11 = sys.Err.make($_u11);
      if ($_u11 instanceof sys.Err) {
        let e = $_u11;
        ;
        WispService.log().err("WispService stop http listener socket", e);
      }
      else {
        throw $_u11;
      }
    }
    ;
    try {
      this.closeListener(this.#httpsListenerRef);
    }
    catch ($_u12) {
      $_u12 = sys.Err.make($_u12);
      if ($_u12 instanceof sys.Err) {
        let e = $_u12;
        ;
        WispService.log().err("WispService stop https listener socket", e);
      }
      else {
        throw $_u12;
      }
    }
    ;
    try {
      this.#processorPool.stop();
    }
    catch ($_u13) {
      $_u13 = sys.Err.make($_u13);
      if ($_u13 instanceof sys.Err) {
        let e = $_u13;
        ;
        WispService.log().err("WispService stop processor pool", e);
      }
      else {
        throw $_u13;
      }
    }
    ;
    try {
      this.#sessionStore.onStop();
    }
    catch ($_u14) {
      $_u14 = sys.Err.make($_u14);
      if ($_u14 instanceof sys.Err) {
        let e = $_u14;
        ;
        WispService.log().err("WispService stop session store", e);
      }
      else {
        throw $_u14;
      }
    }
    ;
    return;
  }

  closeListener(listenerRef) {
    ((this$) => { let $_u15 = ((this$) => { let $_u16 = listenerRef.val(); if ($_u16 == null) return null; return sys.ObjUtil.trap(listenerRef.val(),"val", sys.List.make(sys.Obj.type$.toNullable(), [])); })(this$); if ($_u15 == null) return null; return sys.ObjUtil.trap(((this$) => { let $_u17 = listenerRef.val(); if ($_u17 == null) return null; return sys.ObjUtil.trap(listenerRef.val(),"val", sys.List.make(sys.Obj.type$.toNullable(), [])); })(this$),"close", sys.List.make(sys.Obj.type$.toNullable(), [])); })(this);
    return;
  }

  listen(listener,port) {
    let portType = ((this$) => { if (sys.ObjUtil.equals(port, this$.#httpPort)) return "http"; return "https"; })(this);
    while (true) {
      try {
        listener.bind(this.#addr, sys.ObjUtil.coerce(port, sys.Int.type$.toNullable()));
        break;
      }
      catch ($_u19) {
        $_u19 = sys.Err.make($_u19);
        if ($_u19 instanceof sys.Err) {
          let e = $_u19;
          ;
          WispService.log().err(sys.Str.plus(sys.Str.plus(sys.Str.plus("WispService cannot bind to ", portType), " port "), sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable())), e);
          concurrent.Actor.sleep(sys.Duration.fromStr("10sec"));
        }
        else {
          throw $_u19;
        }
      }
      ;
    }
    ;
    WispService.log().info(sys.Str.plus(sys.Str.plus(sys.Str.plus("", portType), " started on port "), sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable())));
    this.#isListeningRef.val(true);
    while ((!this.#listenerPool.isStopped() && !listener.isClosed())) {
      try {
        let socket = listener.accept();
        WispActor.make(this).send(sys.Unsafe.make(socket));
      }
      catch ($_u20) {
        $_u20 = sys.Err.make($_u20);
        if ($_u20 instanceof sys.Err) {
          let e = $_u20;
          ;
          if ((!this.#listenerPool.isStopped() && !listener.isClosed())) {
            WispService.log().err(sys.Str.plus(sys.Str.plus(sys.Str.plus("WispService accept on ", portType), " port "), sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable())), e);
            concurrent.Actor.sleep(sys.Duration.fromStr("5sec"));
          }
          ;
        }
        else {
          throw $_u20;
        }
      }
      ;
    }
    ;
    this.#isListeningRef.val(false);
    try {
      listener.close();
    }
    catch ($_u21) {
    }
    ;
    WispService.log().info(sys.Str.plus(sys.Str.plus(sys.Str.plus("", portType), " stopped on port "), sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable())));
    return;
  }

  makeListener(storage) {
    const this$ = this;
    try {
      let cfg = this.#socketConfig;
      if (!cfg.reuseAddr()) {
        (cfg = cfg.copy((it) => {
          it.__reuseAddr(true);
          return;
        }));
      }
      ;
      let listener = inet.TcpListener.make(cfg);
      storage.val(sys.Unsafe.make(listener));
      return listener;
    }
    catch ($_u22) {
      $_u22 = sys.Err.make($_u22);
      if ($_u22 instanceof sys.Err) {
        let e = $_u22;
        ;
        WispService.log().err("Could not make listener", e);
        throw e;
      }
      else {
        throw $_u22;
      }
    }
    ;
  }

  static main() {
    const this$ = this;
    WispService.make((it) => {
      it.#httpPort = sys.ObjUtil.coerce(8080, sys.Int.type$.toNullable());
      return;
    }).start();
    concurrent.Actor.sleep(sys.Duration.maxVal());
    return;
  }

  static testSetup(root) {
    const this$ = this;
    WispService.log().level(sys.LogLevel.err());
    return WispService.make((it) => {
      it.#root = root;
      it.#httpPort = sys.ObjUtil.coerce(sys.Range.make(10000, 60000).random(), sys.Int.type$.toNullable());
      return;
    });
  }

  static testTeardown(service) {
    service.stop();
    return;
  }

  static static$init() {
    WispService.#log = sys.Log.get("web");
    return;
  }

}

class WispDefaultRootMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WispDefaultRootMod.type$; }

  onGet() {
    this.res().headers().set("Content-Type", "text/html; charset=utf-8");
    let out = this.res().out();
    out.html().head().title().w("Wisp").titleEnd().headEnd().body().h1().w("Wisp").h1End().p().w("Wisp is running!").pEnd().p().w("Currently there is no WebMod installed on this server.").pEnd().p().w("See <a href='https://fantom.org/doc/wisp/pod-doc.html'>wisp::pod-doc</a>\nto configure a WebMod for the server.").pEnd().bodyEnd().htmlEnd();
    return;
  }

  static make() {
    const $self = new WispDefaultRootMod();
    WispDefaultRootMod.make$($self);
    return $self;
  }

  static make$($self) {
    web.WebMod.make$($self);
    return;
  }

}

class WispHttpsRedirectMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WispHttpsRedirectMod.type$; }

  #service = null;

  service() { return this.#service; }

  __service(it) { if (it === undefined) return this.#service; else this.#service = it; }

  #root = null;

  root() { return this.#root; }

  __root(it) { if (it === undefined) return this.#root; else this.#root = it; }

  static make(service,root) {
    const $self = new WispHttpsRedirectMod();
    WispHttpsRedirectMod.make$($self,service,root);
    return $self;
  }

  static make$($self,service,root) {
    web.WebMod.make$($self);
    $self.#service = service;
    $self.#root = root;
    return;
  }

  onService() {
    if (sys.ObjUtil.equals(this.req().socket().localPort(), this.#service.httpPort())) {
      let redirectUri = sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("https://", this.req().absUri().host()), ":"), sys.ObjUtil.coerce(this.#service.httpsPort(), sys.Obj.type$.toNullable())), ""), this.req().uri()));
      this.res().redirect(redirectUri);
    }
    else {
      this.#root.onService();
    }
    ;
    return;
  }

}

class WispDefaultErrMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WispDefaultErrMod.type$; }

  onService() {
    let err = sys.ObjUtil.coerce(this.req().stash().get("err"), sys.Err.type$);
    this.res().headers().set("Content-Type", "text/plain");
    let str = sys.Str.replace(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.res().statusCode(), sys.Obj.type$.toNullable())), " INTERNAL SERVER ERROR\n\n"), this.req().uri()), "\n"), err.traceToStr()), "<", "&gt;");
    this.res().out().print(str);
    return;
  }

  static make() {
    const $self = new WispDefaultErrMod();
    WispDefaultErrMod.make$($self);
    return $self;
  }

  static make$($self) {
    web.WebMod.make$($self);
    return;
  }

}

class MemWispSessionStore extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#houseKeepingPeriod = sys.Duration.fromStr("1min");
    this.#expirationPeriod = sys.Duration.fromStr("1day");
    this.#timeout = sys.Duration.fromStr("15sec");
    this.#emptyMap = sys.ObjUtil.coerce(((this$) => { let $_u23 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")); if ($_u23 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))); })(this), sys.Type.find("[sys::Str:sys::Obj?]"));
    return;
  }

  typeof() { return MemWispSessionStore.type$; }

  doSave() { return WispSessionStore.prototype.doSave.apply(this, arguments); }

  doLoad() { return WispSessionStore.prototype.doLoad.apply(this, arguments); }

  makeCookie() { return WispSessionStore.prototype.makeCookie.apply(this, arguments); }

  #service = null;

  service() { return this.#service; }

  __service(it) { if (it === undefined) return this.#service; else this.#service = it; }

  #houseKeepingPeriod = null;

  houseKeepingPeriod() { return this.#houseKeepingPeriod; }

  __houseKeepingPeriod(it) { if (it === undefined) return this.#houseKeepingPeriod; else this.#houseKeepingPeriod = it; }

  #expirationPeriod = null;

  expirationPeriod() { return this.#expirationPeriod; }

  __expirationPeriod(it) { if (it === undefined) return this.#expirationPeriod; else this.#expirationPeriod = it; }

  #timeout = null;

  timeout() { return this.#timeout; }

  __timeout(it) { if (it === undefined) return this.#timeout; else this.#timeout = it; }

  #emptyMap = null;

  emptyMap() { return this.#emptyMap; }

  __emptyMap(it) { if (it === undefined) return this.#emptyMap; else this.#emptyMap = it; }

  static make(service) {
    const $self = new MemWispSessionStore();
    MemWispSessionStore.make$($self,service);
    return $self;
  }

  static make$($self,service) {
    const this$ = $self;
    concurrent.Actor.make$($self, concurrent.ActorPool.make((it) => {
      it.__name("WispServiceSessions");
      return;
    }));
    ;
    $self.#service = service;
    return;
  }

  onStart() {
    this.sendLater(this.#houseKeepingPeriod, Msg.make("houseKeeping"));
    return;
  }

  onStop() {
    this.pool().stop();
    return;
  }

  load(id) {
    return sys.ObjUtil.coerce(this.send(Msg.make("load", id)).get(this.#timeout), sys.Type.find("[sys::Str:sys::Obj?]"));
  }

  save(id,map) {
    this.send(Msg.make("save", id, map));
    return;
  }

  delete(id) {
    this.send(Msg.make("delete", id));
    return;
  }

  receive(msgObj) {
    try {
      let msg = sys.ObjUtil.coerce(msgObj, Msg.type$);
      let sessions = sys.ObjUtil.as(concurrent.Actor.locals().get("wisp.sessions"), sys.Type.find("[sys::Str:wisp::MemStoreSession]"));
      if (sessions == null) {
        concurrent.Actor.locals().set("wisp.sessions", (sessions = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("wisp::MemStoreSession"))));
      }
      ;
      let $_u24 = msg.cmd();
      if (sys.ObjUtil.equals($_u24, "houseKeeping")) {
        return this.onHouseKeeping(sys.ObjUtil.coerce(sessions, sys.Type.find("[sys::Str:wisp::MemStoreSession]")));
      }
      else if (sys.ObjUtil.equals($_u24, "load")) {
        return this.onLoad(sys.ObjUtil.coerce(sessions, sys.Type.find("[sys::Str:wisp::MemStoreSession]")), msg);
      }
      else if (sys.ObjUtil.equals($_u24, "save")) {
        return this.onSave(sys.ObjUtil.coerce(sessions, sys.Type.find("[sys::Str:wisp::MemStoreSession]")), msg);
      }
      else if (sys.ObjUtil.equals($_u24, "delete")) {
        return this.onDelete(sys.ObjUtil.coerce(sessions, sys.Type.find("[sys::Str:wisp::MemStoreSession]")), msg);
      }
      ;
      sys.ObjUtil.echo(sys.Str.plus("Unhandled msg: ", msg.cmd()));
    }
    catch ($_u25) {
      $_u25 = sys.Err.make($_u25);
      if ($_u25 instanceof sys.Err) {
        let e = $_u25;
        ;
        e.trace();
      }
      else {
        throw $_u25;
      }
    }
    ;
    return null;
  }

  onHouseKeeping(sessions) {
    const this$ = this;
    let now = sys.Duration.nowTicks();
    let expired = sys.List.make(sys.Str.type$);
    sessions.each((session) => {
      if (sys.ObjUtil.compareGT(sys.Int.minus(now, session.lastAccess()), this$.#expirationPeriod.ticks())) {
        expired.add(session.id());
      }
      ;
      return;
    });
    expired.each((id) => {
      sessions.remove(id);
      return;
    });
    this.sendLater(this.#houseKeepingPeriod, Msg.make("houseKeeping"));
    return null;
  }

  onLoad(sessions,msg) {
    return sys.ObjUtil.coerce(((this$) => { let $_u26 = ((this$) => { let $_u27=sessions.get(sys.ObjUtil.coerce(msg.id(), sys.Str.type$)); return ($_u27==null) ? null : $_u27.map(); })(this$); if ($_u26 != null) return $_u26; return this$.#emptyMap; })(this), sys.Type.find("sys::Map"));
  }

  onSave(sessions,msg) {
    let session = sessions.get(sys.ObjUtil.coerce(msg.id(), sys.Str.type$));
    if (session == null) {
      sessions.set(sys.ObjUtil.coerce(msg.id(), sys.Str.type$), sys.ObjUtil.coerce((session = MemStoreSession.make(sys.ObjUtil.coerce(msg.id(), sys.Str.type$))), MemStoreSession.type$));
    }
    ;
    session.map(msg.map());
    session.lastAccess(sys.Duration.nowTicks());
    return null;
  }

  onDelete(sessions,msg) {
    sessions.remove(sys.ObjUtil.coerce(msg.id(), sys.Str.type$));
    return null;
  }

}

class Msg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Msg.type$; }

  #cmd = null;

  cmd() { return this.#cmd; }

  __cmd(it) { if (it === undefined) return this.#cmd; else this.#cmd = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #map = null;

  map() { return this.#map; }

  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  static make(c,i,m) {
    const $self = new Msg();
    Msg.make$($self,c,i,m);
    return $self;
  }

  static make$($self,c,i,m) {
    if (i === undefined) i = null;
    if (m === undefined) m = null;
    $self.#cmd = c;
    $self.#id = i;
    $self.#map = sys.ObjUtil.coerce(((this$) => { let $_u28 = m; if ($_u28 == null) return null; return sys.ObjUtil.toImmutable(m); })($self), sys.Type.find("sys::Map?"));
    return;
  }

}

class MemStoreSession extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MemStoreSession.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #map = null;

  map(it) {
    if (it === undefined) {
      return this.#map;
    }
    else {
      this.#map = it;
      return;
    }
  }

  #lastAccess = 0;

  lastAccess(it) {
    if (it === undefined) {
      return this.#lastAccess;
    }
    else {
      this.#lastAccess = it;
      return;
    }
  }

  static make(id) {
    const $self = new MemStoreSession();
    MemStoreSession.make$($self,id);
    return $self;
  }

  static make$($self,id) {
    $self.#id = id;
    return;
  }

}

class Main extends util.AbstractMain {
  constructor() {
    super();
    const this$ = this;
    this.#httpPort = null;
    this.#httpsPort = null;
    return;
  }

  typeof() { return Main.type$; }

  #mod = null;

  mod(it) {
    if (it === undefined) {
      return this.#mod;
    }
    else {
      this.#mod = it;
      return;
    }
  }

  #addr = null;

  addr(it) {
    if (it === undefined) {
      return this.#addr;
    }
    else {
      this.#addr = it;
      return;
    }
  }

  #httpPort = null;

  httpPort(it) {
    if (it === undefined) {
      return this.#httpPort;
    }
    else {
      this.#httpPort = it;
      return;
    }
  }

  #httpsPort = null;

  httpsPort(it) {
    if (it === undefined) {
      return this.#httpsPort;
    }
    else {
      this.#httpsPort = it;
      return;
    }
  }

  run() {
    const this$ = this;
    return this.runServices(sys.List.make(WispService.type$, [WispService.make((it) => {
      it.__addr(((this$) => { if (this$.#addr == null) return null; return inet.IpAddr.make(sys.ObjUtil.coerce(this$.#addr, sys.Str.type$)); })(this$));
      it.__httpPort(((this$) => { let $_u30 = this$.#httpPort; if ($_u30 != null) return $_u30; return sys.ObjUtil.coerce(8080, sys.Int.type$.toNullable()); })(this$));
      it.__httpsPort(this$.#httpsPort);
      it.__root(sys.ObjUtil.coerce(sys.Type.find(sys.ObjUtil.coerce(this$.#mod, sys.Str.type$)).make(), web.WebMod.type$));
      return;
    })]));
  }

  static make() {
    const $self = new Main();
    Main.make$($self);
    return $self;
  }

  static make$($self) {
    util.AbstractMain.make$($self);
    ;
    return;
  }

}

class WispActor extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WispActor.type$; }

  static #ver10 = undefined;

  static ver10() {
    if (WispActor.#ver10 === undefined) {
      WispActor.static$init();
      if (WispActor.#ver10 === undefined) WispActor.#ver10 = null;
    }
    return WispActor.#ver10;
  }

  static #ver11 = undefined;

  static ver11() {
    if (WispActor.#ver11 === undefined) {
      WispActor.static$init();
      if (WispActor.#ver11 === undefined) WispActor.#ver11 = null;
    }
    return WispActor.#ver11;
  }

  static #wispVer = undefined;

  static wispVer() {
    if (WispActor.#wispVer === undefined) {
      WispActor.static$init();
      if (WispActor.#wispVer === undefined) WispActor.#wispVer = null;
    }
    return WispActor.#wispVer;
  }

  #service = null;

  service() { return this.#service; }

  __service(it) { if (it === undefined) return this.#service; else this.#service = it; }

  static make(service) {
    const $self = new WispActor();
    WispActor.make$($self,service);
    return $self;
  }

  static make$($self,service) {
    concurrent.Actor.make$($self, service.processorPool());
    $self.#service = service;
    return;
  }

  receive(msg) {
    this.process(sys.ObjUtil.coerce(sys.ObjUtil.coerce(msg, sys.Unsafe.type$).val(), inet.TcpSocket.type$));
    return null;
  }

  process(socket) {
    let res = null;
    let req = null;
    let close = true;
    let init = false;
    try {
      if (sys.ObjUtil.equals(socket.localPort(), this.#service.httpsPort())) {
        (socket = socket.upgradeTls());
      }
      ;
      (res = WispRes.make(this.#service, socket));
      (req = WispReq.make(this.#service, socket, sys.ObjUtil.coerce(res, WispRes.type$)));
      res.req(req);
      concurrent.Actor.locals().set("web.req", req);
      concurrent.Actor.locals().set("web.res", res);
      socket.options().receiveTimeout(sys.Duration.fromStr("10sec"));
      if (!WispActor.parseReq(sys.ObjUtil.coerce(req, WispReq.type$))) {
        return;
      }
      ;
      this.initReqRes(sys.ObjUtil.coerce(req, WispReq.type$), sys.ObjUtil.coerce(res, WispRes.type$));
      (init = true);
      this.#service.root().onService();
      this.#service.sessionStore().doSave();
      if (res.upgraded()) {
        (close = false);
      }
      else {
        res.close();
      }
      ;
    }
    catch ($_u31) {
      $_u31 = sys.Err.make($_u31);
      if ($_u31 instanceof sys.Err) {
        let e = $_u31;
        ;
        if (init) {
          this.internalServerErr(sys.ObjUtil.coerce(req, WispReq.type$), sys.ObjUtil.coerce(res, WispRes.type$), e);
        }
        else {
          if ((sys.ObjUtil.is(e, sys.IOErr.type$) && sys.Str.contains(e.msg(), "javax.net.ssl."))) {
            if (WispService.log().isDebug()) {
              WispService.log().debug("TLS Error", e);
            }
            ;
          }
          else {
            e.trace();
          }
          ;
        }
        ;
      }
      else {
        throw $_u31;
      }
    }
    finally {
      concurrent.Actor.locals().remove("web.req");
      concurrent.Actor.locals().remove("web.res");
      if (close) {
        try {
          socket.close();
        }
        catch ($_u32) {
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  isTls() {
    return this.#service.httpsPort() != null;
  }

  static parseReq(req) {
    try {
      let in$ = req.socket().in();
      let line = web.WebUtil.readLine(in$);
      while (sys.Str.isEmpty(line)) {
        (line = web.WebUtil.readLine(in$));
      }
      ;
      let toks = sys.Str.split(line);
      let method = toks.get(0);
      let uri = toks.get(1);
      let ver = toks.get(2);
      req.setMethod(method);
      req.uri(sys.ObjUtil.coerce(sys.Uri.decode(uri), sys.Uri.type$));
      if (sys.ObjUtil.equals(req.uri().path().first(), "..")) {
        throw sys.Err.make("Reject URI");
      }
      ;
      if (sys.Str.contains(req.uri().pathStr(), "//")) {
        throw sys.Err.make("Reject URI");
      }
      ;
      if (sys.ObjUtil.equals(ver, "HTTP/1.1")) {
        req.version(WispActor.ver11());
      }
      else {
        if (sys.ObjUtil.equals(ver, "HTTP/1.0")) {
          req.version(WispActor.ver10());
        }
        else {
          throw sys.Err.make("Unsupported version");
        }
        ;
      }
      ;
      req.headers(web.WebUtil.parseHeaders(in$).ro());
      return true;
    }
    catch ($_u33) {
      $_u33 = sys.Err.make($_u33);
      if ($_u33 instanceof sys.Err) {
        let e = $_u33;
        ;
        try {
          let out = req.socket().out();
          req.socket().out().print(sys.Str.plus(sys.Str.plus("HTTP/1.1 400 Bad Request: ", sys.Str.toCode(e.toStr())), "\r\n")).print("\r\n").flush();
        }
        catch ($_u34) {
          $_u34 = sys.Err.make($_u34);
          if ($_u34 instanceof sys.Err) {
            let e2 = $_u34;
            ;
          }
          else {
            throw $_u34;
          }
        }
        ;
        return false;
      }
      else {
        throw $_u33;
      }
    }
    ;
  }

  initReqRes(req,res) {
    req.webIn(this.initReqInStream(req));
    sys.Locale.setCur(sys.ObjUtil.coerce(req.locales().first(), sys.Locale.type$));
    return;
  }

  initReqInStream(req) {
    let raw = req.socket().in();
    if (req.isUpgrade()) {
      return raw;
    }
    ;
    let wrap = web.WebUtil.makeContentInStream(req.headers(), raw);
    if (wrap === raw) {
      return null;
    }
    ;
    return wrap;
  }

  internalServerErr(req,res,err) {
    try {
      if (sys.ObjUtil.is(err, sys.IOErr.type$)) {
        try {
          req.socket().out().flush();
        }
        catch ($_u35) {
          return;
        }
        ;
      }
      ;
      if (!sys.Str.contains(err.msg(), "Broken pipe")) {
        WispService.log().err(sys.Str.plus("Internal error processing: ", req.uri()), err);
      }
      ;
      if (!res.isCommitted()) {
        res.statusCode(500);
        res.headers().clear();
        req.stash().set("err", err);
        this.#service.errMod().onService();
        res.close();
      }
      ;
    }
    catch ($_u36) {
      $_u36 = sys.Err.make($_u36);
      if ($_u36 instanceof sys.Err) {
        let e = $_u36;
        ;
        WispService.log().err("internalServiceError res failed", e);
      }
      else {
        throw $_u36;
      }
    }
    ;
    return;
  }

  static static$init() {
    WispActor.#ver10 = sys.ObjUtil.coerce(sys.Version.fromStr("1.0"), sys.Version.type$);
    WispActor.#ver11 = sys.ObjUtil.coerce(sys.Version.fromStr("1.1"), sys.Version.type$);
    WispActor.#wispVer = sys.Str.plus("Wisp/", WispActor.type$.pod().version());
    return;
  }

}

class WispTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WispTest.type$; }

  testExtraHeaders() {
    this.verifyExtraHeaders("", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyExtraHeaders("  ", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyExtraHeaders("a:b;c:d", sys.Map.__fromLiteral(["a","c"], ["b","d"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyExtraHeaders("a : b ;  c : d ", sys.Map.__fromLiteral(["a","c"], ["b","d"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyExtraHeaders("a:\"b\"; c:\"d\"", sys.Map.__fromLiteral(["a","c"], ["b","d"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyExtraHeaders("a:\"i; j\"; b:\"foo; bar\";", sys.Map.__fromLiteral(["a","b"], ["i; j","foo; bar"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyExtraHeaders("Cookie:\"v1; v2\" ; Accept-Lang: \"en-us; q=0.5\"", sys.Map.__fromLiteral(["Cookie","Accept-Lang"], ["v1; v2","en-us; q=0.5"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyExtraHeaders("Header-1:\"Val\"; Header-2:\"Val\";", sys.Map.__fromLiteral(["Header-1","Header-2"], ["Val","Val"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyExtraHeaders("a", null);
    this.verifyExtraHeaders("a:b;;c:d", null);
    this.verifyExtraHeaders("a: ", null);
    this.verifyExtraHeaders("a:\"\"", null);
    return;
  }

  verifyExtraHeaders(str,expected) {
    const this$ = this;
    let actual = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    if (expected == null) {
      this.verifyErr(sys.Err.type$, (it) => {
        WispService.parseExtraHeaders(actual, str);
        return;
      });
    }
    else {
      WispService.parseExtraHeaders(actual, str);
      this.verifyEq(actual, expected);
    }
    ;
    return;
  }

  static make() {
    const $self = new WispTest();
    WispTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class ReqTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReqTest.type$; }

  testBasic() {
    this.verifyReq("GET / HTTP/1.0\r\nHost: foobar\r\nExtra1:  space\r\nExtra2: space  \r\nCont: one two \r\n  three\r\n\tfour\r\nCoalesce: a,b\r\nCoalesce: c\r\nCoalesce:  d\r\n\r\n", "GET", sys.Uri.fromStr("/"), sys.Map.__fromLiteral(["Host","Extra1","Extra2","Cont","Coalesce"], ["foobar","space","space","one two three four","a,b,c,d"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    return;
  }

  verifyReq(s,method,uri,headers) {
    return;
  }

  static main(args) {
    if (args === undefined) args = sys.Env.cur().args();
    let uri = sys.Str.toUri(args.first());
    let socket = inet.TcpSocket.make();
    socket.connect(sys.ObjUtil.coerce(inet.IpAddr.make(sys.ObjUtil.coerce(uri.host(), sys.Str.type$)), inet.IpAddr.type$), sys.ObjUtil.coerce(uri.port(), sys.Int.type$));
    socket.out().print(sys.Str.plus(sys.Str.plus("GET ", uri.pathStr()), " HTTP/1.1\r\n"));
    socket.out().print(sys.Str.plus(sys.Str.plus("Host: ", uri.host()), "\r\n"));
    socket.out().print("\r\n");
    socket.out().flush();
    while (true) {
      let line = socket.in().readLine();
      if (sys.Str.isEmpty(line)) {
        break;
      }
      ;
      sys.ObjUtil.echo(line);
    }
    ;
    socket.close();
    return;
  }

  static make() {
    const $self = new ReqTest();
    ReqTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('wisp');
const xp = sys.Param.noParams$();
let m;
WispReq.type$ = p.at$('WispReq','web::WebReq',[],{},128,WispReq);
WispSessionStore.type$ = p.am$('WispSessionStore','sys::Obj',[],{},8451,WispSessionStore);
WispRes.type$ = p.at$('WispRes','web::WebRes',[],{},128,WispRes);
WispSession.type$ = p.at$('WispSession','web::WebSession',[],{},128,WispSession);
WispService.type$ = p.at$('WispService','sys::Obj',['sys::Service'],{},8194,WispService);
WispDefaultRootMod.type$ = p.at$('WispDefaultRootMod','web::WebMod',[],{},130,WispDefaultRootMod);
WispHttpsRedirectMod.type$ = p.at$('WispHttpsRedirectMod','web::WebMod',[],{},130,WispHttpsRedirectMod);
WispDefaultErrMod.type$ = p.at$('WispDefaultErrMod','web::WebMod',[],{},8194,WispDefaultErrMod);
MemWispSessionStore.type$ = p.at$('MemWispSessionStore','concurrent::Actor',['wisp::WispSessionStore'],{},130,MemWispSessionStore);
Msg.type$ = p.at$('Msg','sys::Obj',[],{},130,Msg);
MemStoreSession.type$ = p.at$('MemStoreSession','sys::Obj',[],{},128,MemStoreSession);
Main.type$ = p.at$('Main','util::AbstractMain',[],{},128,Main);
WispActor.type$ = p.at$('WispActor','concurrent::Actor',[],{},130,WispActor);
WispTest.type$ = p.at$('WispTest','sys::Test',[],{},8192,WispTest);
ReqTest.type$ = p.at$('ReqTest','sys::Test',[],{},8192,ReqTest);
WispReq.type$.af$('mod',336896,'web::WebMod',{}).af$('method',336896,'sys::Str',{}).af$('isGet',336896,'sys::Bool',{}).af$('isPost',336896,'sys::Bool',{}).af$('version',336896,'sys::Version',{}).af$('headers',336896,'[sys::Str:sys::Str]',{}).af$('uri',336896,'sys::Uri',{}).af$('socket',336896,'inet::TcpSocket',{}).af$('nullVersion',106498,'sys::Version',{}).af$('nullHeaders',106498,'[sys::Str:sys::Str]',{}).af$('service',65664,'wisp::WispService',{}).af$('webIn',65664,'sys::InStream?',{}).af$('checkContinue',67584,'sys::Bool',{}).af$('res',67584,'wisp::WispRes',{}).af$('absUri$Store',722944,'sys::Obj?',{}).af$('session$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('service','wisp::WispService',false),new sys.Param('socket','inet::TcpSocket',false),new sys.Param('res','wisp::WispRes',false)]),{}).am$('remoteAddr',271360,'inet::IpAddr',xp,{}).am$('remotePort',271360,'sys::Int',xp,{}).am$('absUri',795648,'sys::Uri',xp,{}).am$('session',795648,'web::WebSession',xp,{}).am$('in',271360,'sys::InStream',xp,{}).am$('socketOptions',271360,'inet::SocketOptions',xp,{}).am$('setMethod',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false)]),{}).am$('isUpgrade',128,'sys::Bool',xp,{}).am$('isKeepAlive',128,'sys::Bool',xp,{}).am$('absUri$Once',133120,'sys::Uri',xp,{}).am$('session$Once',133120,'web::WebSession',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
WispSessionStore.type$.am$('service',270337,'wisp::WispService',xp,{}).am$('onStart',270336,'sys::Void',xp,{}).am$('onStop',270336,'sys::Void',xp,{}).am$('load',270337,'[sys::Str:sys::Obj?]',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('save',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('map','[sys::Str:sys::Obj?]',false)]),{}).am$('delete',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('doLoad',128,'wisp::WispSession',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false)]),{}).am$('makeCookie',2048,'web::Cookie',sys.List.make(sys.Param.type$,[new sys.Param('ws','wisp::WispSession',false)]),{}).am$('doSave',128,'sys::Void',xp,{});
WispRes.type$.af$('statusCode',336896,'sys::Int',{}).af$('statusPhrase',336896,'sys::Str?',{}).af$('headers',336896,'[sys::Str:sys::Str]',{}).af$('cookies',336896,'web::Cookie[]',{}).af$('isCommitted',336896,'sys::Bool',{}).af$('isDone',336896,'sys::Bool',{}).af$('service',65664,'wisp::WispService',{}).af$('req',65664,'wisp::WispReq?',{}).af$('socket',65664,'inet::TcpSocket',{}).af$('webOut',65664,'web::WebOutStream?',{}).af$('upgraded',65664,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('service','wisp::WispService',false),new sys.Param('socket','inet::TcpSocket',false)]),{}).am$('out',271360,'web::WebOutStream',xp,{}).am$('redirect',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('statusCode','sys::Int',true)]),{}).am$('sendErr',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('statusCode','sys::Int',false),new sys.Param('msg','sys::Str?',true)]),{}).am$('sendContinue',128,'sys::Void',xp,{}).am$('done',271360,'sys::Void',xp,{}).am$('upgrade',271360,'inet::TcpSocket',sys.List.make(sys.Param.type$,[new sys.Param('statusCode','sys::Int',true)]),{}).am$('checkUncommitted',128,'sys::Void',xp,{}).am$('commit',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('content','sys::Bool',false)]),{}).am$('toStatusMsg',2048,'sys::Str',xp,{}).am$('close',128,'sys::Void',xp,{});
WispSession.type$.af$('name',73730,'sys::Str',{}).af$('id',336898,'sys::Str',{}).af$('map',336896,'[sys::Str:sys::Obj?]',{}).af$('isDeleted',65664,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('id','sys::Str',false),new sys.Param('map','[sys::Str:sys::Obj?]',false)]),{}).am$('delete',271360,'sys::Void',xp,{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj?,sys::Str->sys::Void|',false)]),{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{}).am$('set',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('remove',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('modify',2048,'sys::This',xp,{});
WispService.type$.af$('log',98434,'sys::Log',{}).af$('addr',73730,'inet::IpAddr?',{}).af$('httpPort',73730,'sys::Int?',{}).af$('httpsPort',73730,'sys::Int?',{}).af$('root',73730,'web::WebMod',{}).af$('sessionStore',73730,'wisp::WispSessionStore',{}).af$('maxThreads',73730,'sys::Int',{}).af$('errMod',73730,'web::WebMod',{}).af$('socketConfig',73730,'inet::SocketConfig',{}).af$('isListeningRef',67586,'concurrent::AtomicBool',{}).af$('extraResHeaders',73730,'[sys::Str:sys::Str]',{}).af$('sessionCookieName',73730,'sys::Str',{}).af$('listenerPool',65666,'concurrent::ActorPool',{}).af$('httpListenerRef',65666,'concurrent::AtomicRef',{}).af$('httpsListenerRef',65666,'concurrent::AtomicRef',{}).af$('processorPool',65666,'concurrent::ActorPool',{}).am$('isListening',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('initErrMod',34818,'web::WebMod',xp,{}).am$('initExtraResHeaders',34818,'[sys::Str:sys::Str]',xp,{}).am$('parseExtraHeaders',32898,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Str]',false),new sys.Param('str','sys::Str',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('onStart',271360,'sys::Void',xp,{}).am$('onStop',271360,'sys::Void',xp,{}).am$('closeListener',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('listenerRef','concurrent::AtomicRef',false)]),{}).am$('listen',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('listener','inet::TcpListener',false),new sys.Param('port','sys::Int',false)]),{}).am$('makeListener',2048,'inet::TcpListener',sys.List.make(sys.Param.type$,[new sys.Param('storage','concurrent::AtomicRef',false)]),{}).am$('main',40962,'sys::Void',xp,{'sys::NoDoc':""}).am$('testSetup',40962,'wisp::WispService',sys.List.make(sys.Param.type$,[new sys.Param('root','web::WebMod',false)]),{'sys::NoDoc':""}).am$('testTeardown',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('service','wisp::WispService',false)]),{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
WispDefaultRootMod.type$.am$('onGet',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
WispHttpsRedirectMod.type$.af$('service',73730,'wisp::WispService',{}).af$('root',73730,'web::WebMod',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('service','wisp::WispService',false),new sys.Param('root','web::WebMod',false)]),{}).am$('onService',271360,'sys::Void',xp,{});
WispDefaultErrMod.type$.am$('onService',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
MemWispSessionStore.type$.af$('service',336898,'wisp::WispService',{}).af$('houseKeepingPeriod',73730,'sys::Duration',{}).af$('expirationPeriod',73730,'sys::Duration',{}).af$('timeout',73730,'sys::Duration',{}).af$('emptyMap',73730,'[sys::Str:sys::Obj?]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('service','wisp::WispService',false)]),{}).am$('onStart',271360,'sys::Void',xp,{}).am$('onStop',271360,'sys::Void',xp,{}).am$('load',271360,'[sys::Str:sys::Obj?]',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('save',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('map','[sys::Str:sys::Obj?]',false)]),{}).am$('delete',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msgObj','sys::Obj?',false)]),{}).am$('onHouseKeeping',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('sessions','[sys::Str:wisp::MemStoreSession]',false)]),{}).am$('onLoad',2048,'sys::Map',sys.List.make(sys.Param.type$,[new sys.Param('sessions','[sys::Str:wisp::MemStoreSession]',false),new sys.Param('msg','wisp::Msg',false)]),{}).am$('onSave',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('sessions','[sys::Str:wisp::MemStoreSession]',false),new sys.Param('msg','wisp::Msg',false)]),{}).am$('onDelete',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('sessions','[sys::Str:wisp::MemStoreSession]',false),new sys.Param('msg','wisp::Msg',false)]),{});
Msg.type$.af$('cmd',73730,'sys::Str',{}).af$('id',73730,'sys::Str?',{}).af$('map',73730,'sys::Map?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Str',false),new sys.Param('i','sys::Str?',true),new sys.Param('m','sys::Map?',true)]),{});
MemStoreSession.type$.af$('id',73730,'sys::Str',{}).af$('map',73728,'sys::Map?',{}).af$('lastAccess',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{});
Main.type$.af$('mod',73728,'sys::Str?',{'util::Arg':"util::Arg{help=\"qualified type name for WebMod to run\";}"}).af$('addr',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"IP address to bind to\";}"}).af$('httpPort',73728,'sys::Int?',{'util::Opt':"util::Opt{help=\"IP port to bind for HTTP (default 8080)\";}"}).af$('httpsPort',73728,'sys::Int?',{'util::Opt':"util::Opt{help=\"IP port to bind for HTTPS (disabled unless set)\";}"}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
WispActor.type$.af$('ver10',106498,'sys::Version',{}).af$('ver11',106498,'sys::Version',{}).af$('wispVer',106498,'sys::Str',{}).af$('service',73730,'wisp::WispService',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('service','wisp::WispService',false)]),{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('process',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('socket','inet::TcpSocket',false)]),{}).am$('isTls',2048,'sys::Bool',xp,{}).am$('parseReq',32898,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('req','wisp::WispReq',false)]),{}).am$('initReqRes',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('req','wisp::WispReq',false),new sys.Param('res','wisp::WispRes',false)]),{}).am$('initReqInStream',2048,'sys::InStream?',sys.List.make(sys.Param.type$,[new sys.Param('req','wisp::WispReq',false)]),{}).am$('internalServerErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('req','wisp::WispReq',false),new sys.Param('res','wisp::WispRes',false),new sys.Param('err','sys::Err',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
WispTest.type$.am$('testExtraHeaders',8192,'sys::Void',xp,{}).am$('verifyExtraHeaders',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('expected','[sys::Str:sys::Str]?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ReqTest.type$.am$('testBasic',8192,'sys::Void',xp,{}).am$('verifyReq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('method','sys::Str',false),new sys.Param('uri','sys::Uri',false),new sys.Param('headers','[sys::Str:sys::Str]',false)]),{}).am$('main',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',true)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "wisp");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;util 1.0;concurrent 1.0;inet 1.0;web 1.0");
m.set("pod.summary", "Wisp web Server");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:22-05:00 New_York");
m.set("build.tsKey", "241210143122");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "true");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "Fantom");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Fantom Core");
m.set("proj.uri", "https://fantom.org/");
m.set("pod.docApi", "true");
m.set("org.uri", "httsp://fantom.org/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  WispSessionStore,
  WispService,
  WispDefaultErrMod,
  WispTest,
  ReqTest,
};
