// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as util from './util.js'
import * as web from './web.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class AuthMsg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AuthMsg.type$; }

  #scheme = null;

  scheme() { return this.#scheme; }

  __scheme(it) { if (it === undefined) return this.#scheme; else this.#scheme = it; }

  #params = null;

  params() { return this.#params; }

  __params(it) { if (it === undefined) return this.#params; else this.#params = it; }

  #toStr = null;

  toStr() { return this.#toStr; }

  __toStr(it) { if (it === undefined) return this.#toStr; else this.#toStr = it; }

  static listFromStr(s) {
    const this$ = this;
    return sys.ObjUtil.coerce(AuthMsg.splitList(s).map((tok) => {
      return sys.ObjUtil.coerce(AuthMsg.fromStr(tok), AuthMsg.type$);
    }, AuthMsg.type$), sys.Type.find("auth::AuthMsg[]"));
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    try {
      return AuthMsg.decode(s);
    }
    catch ($_u0) {
      $_u0 = sys.Err.make($_u0);
      if ($_u0 instanceof sys.Err) {
        let e = $_u0;
        ;
        if (checked) {
          throw sys.ParseErr.make(e.toStr());
        }
        ;
        return null;
      }
      else {
        throw $_u0;
      }
    }
    ;
  }

  static make(scheme,params) {
    const $self = new AuthMsg();
    AuthMsg.make$($self,scheme,params);
    return $self;
  }

  static make$($self,scheme,params) {
    $self.#scheme = sys.Str.lower(scheme);
    $self.#params = sys.ObjUtil.coerce(((this$) => { let $_u1 = params; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(params); })($self), sys.Type.find("[sys::Str:sys::Str]"));
    $self.#toStr = AuthMsg.encode(scheme, params);
    return;
  }

  hash() {
    return sys.Str.hash(this.#toStr);
  }

  equals(that) {
    return (sys.ObjUtil.is(that, AuthMsg.type$) && sys.ObjUtil.equals(this.#toStr, sys.ObjUtil.toStr(that)));
  }

  param(name,checked) {
    if (checked === undefined) checked = true;
    let val = this.#params.get(name);
    if (val != null) {
      return val;
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus("AuthScheme param not found: ", name));
    }
    ;
    return null;
  }

  paramsToStr() {
    if (this.#params.isEmpty()) {
      return "";
    }
    ;
    return sys.Str.getRange(this.#toStr, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(this.#toStr, " "), sys.Int.type$), 1), -1));
  }

  static splitList(s) {
    const this$ = this;
    let toks = sys.Str.split(s, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
    let breaks = sys.List.make(sys.Int.type$);
    sys.Str.split(s, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).each((tok,i) => {
      let sp = sys.Str.index(tok, " ");
      let name = ((this$) => { if (sp == null) return tok; return sys.Str.getRange(tok, sys.Range.make(0, sys.ObjUtil.coerce(sp, sys.Int.type$), true)); })(this$);
      if ((web.WebUtil.isToken(name) && sys.ObjUtil.compareGT(i, 0))) {
        breaks.add(sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      }
      ;
      return;
    });
    let acc = sys.List.make(sys.Str.type$);
    let start = 0;
    breaks.each((end) => {
      acc.add(toks.getRange(sys.Range.make(start, end, true)).join(","));
      (start = end);
      return;
    });
    acc.add(toks.getRange(sys.Range.make(start, -1)).join(","));
    return acc;
  }

  static decode(s) {
    const this$ = this;
    let sp = sys.Str.index(s, " ");
    let scheme = s;
    let params = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), (it) => {
      it.caseInsensitive(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Str]"));
    if (sp != null) {
      (scheme = sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(sp, sys.Int.type$), true)));
      sys.Str.split(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sp, sys.Int.type$), 1), -1)), sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).each((p) => {
        let eq = ((this$) => { let $_u3 = sys.Str.index(p, "="); if ($_u3 != null) return $_u3; throw sys.Err.make(sys.Str.plus("Invalid auth-param: ", p)); })(this$);
        params.set(sys.Str.trim(sys.Str.getRange(p, sys.Range.make(0, sys.ObjUtil.coerce(eq, sys.Int.type$), true))), sys.Str.trim(sys.Str.getRange(p, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(eq, sys.Int.type$), 1), -1))));
        return;
      });
    }
    ;
    return AuthMsg.make(scheme, params);
  }

  static encode(scheme,params) {
    const this$ = this;
    let s = sys.StrBuf.make();
    AuthMsg.addToken(s, scheme);
    let first = true;
    params.keys().sort().each((n) => {
      let v = params.get(n);
      if (first) {
        (first = false);
      }
      else {
        s.addChar(44);
      }
      ;
      s.addChar(32);
      AuthMsg.addToken(s, n);
      s.addChar(61);
      AuthMsg.addToken(s, sys.ObjUtil.coerce(v, sys.Str.type$));
      return;
    });
    return s.toStr();
  }

  static addToken(buf,val) {
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(val)); i = sys.Int.increment(i)) {
      let c = sys.Str.get(val, i);
      if (web.WebUtil.isTokenChar(c)) {
        buf.addChar(c);
      }
      else {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid char '", sys.Int.toChar(c)), "' in "), sys.Str.toCode(val)));
      }
      ;
    }
    ;
    return;
  }

}

class AuthErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
    this.#resCode = 403;
    return;
  }

  typeof() { return AuthErr.type$; }

  #resMsg = null;

  resMsg() { return this.#resMsg; }

  __resMsg(it) { if (it === undefined) return this.#resMsg; else this.#resMsg = it; }

  #resCode = 0;

  resCode() { return this.#resCode; }

  __resCode(it) { if (it === undefined) return this.#resCode; else this.#resCode = it; }

  static makeUnknownUser(username) {
    return AuthErr.makeRes(sys.Str.plus(sys.Str.plus("Unknown user '", username), "'"), "Invalid username or password");
  }

  static makeInvalidPassword() {
    return AuthErr.makeRes("Invalid password", "Invalid username or password");
  }

  static make(msg,cause) {
    const $self = new AuthErr();
    AuthErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    ;
    $self.#resMsg = msg;
    return;
  }

  static makeRes(debugMsg,resMsg,resCode) {
    const $self = new AuthErr();
    AuthErr.makeRes$($self,debugMsg,resMsg,resCode);
    return $self;
  }

  static makeRes$($self,debugMsg,resMsg,resCode) {
    if (resCode === undefined) resCode = 403;
    sys.Err.make$($self, debugMsg, null);
    ;
    $self.#resMsg = resMsg;
    $self.#resCode = resCode;
    return;
  }

}

class AuthClientContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#userAgent = sys.Str.plus("SkyArc/", sys.ObjUtil.typeof(this).pod().version());
    this.#headers = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    this.#stash = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    return;
  }

  typeof() { return AuthClientContext.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #user = null;

  user() { return this.#user; }

  __user(it) { if (it === undefined) return this.#user; else this.#user = it; }

  #pass = null;

  pass(it) {
    if (it === undefined) {
      return this.#pass;
    }
    else {
      this.#pass = it;
      return;
    }
  }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #userAgent = null;

  userAgent() { return this.#userAgent; }

  __userAgent(it) { if (it === undefined) return this.#userAgent; else this.#userAgent = it; }

  #socketConfig = null;

  socketConfig() { return this.#socketConfig; }

  __socketConfig(it) { if (it === undefined) return this.#socketConfig; else this.#socketConfig = it; }

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

  #isAuthenticated = false;

  isAuthenticated() {
    return this.#isAuthenticated;
  }

  #stash = null;

  stash() {
    return this.#stash;
  }

  static #debugCounter = undefined;

  static debugCounter() {
    if (AuthClientContext.#debugCounter === undefined) {
      AuthClientContext.static$init();
      if (AuthClientContext.#debugCounter === undefined) AuthClientContext.#debugCounter = null;
    }
    return AuthClientContext.#debugCounter;
  }

  static open(uri,user,pass,log,socketConfig) {
    if (socketConfig === undefined) socketConfig = inet.SocketConfig.cur();
    const this$ = this;
    return AuthClientContext.make((it) => {
      it.#uri = uri;
      it.#user = user;
      it.#pass = pass;
      it.#log = log;
      it.#socketConfig = socketConfig;
      return;
    }).doOpen();
  }

  static make(f) {
    const $self = new AuthClientContext();
    AuthClientContext.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    return;
  }

  doOpen() {
    try {
      if (this.openBearer()) {
        return this;
      }
      ;
      let c = this.prepare(web.WebClient.make(this.#uri));
      c.reqHeaders().set("Authorization", AuthMsg.make("hello", sys.Map.__fromLiteral(["username"], [AuthUtil.toBase64(this.#user)], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))).toStr());
      let content = this.get(c);
      if (this.openStd(c)) {
        return this.success(c);
      }
      ;
      if (sys.ObjUtil.equals(c.resCode(), 200)) {
        return this.success(c);
      }
      ;
      let schemes = AuthScheme.list();
      for (let i = 0; sys.ObjUtil.compareLT(i, schemes.size()); i = sys.Int.increment(i)) {
        if (schemes.get(i).onClientNonStd(this, c, content)) {
          return this.success(c);
        }
        ;
      }
      ;
      let resCode = c.resCode();
      let resServer = c.resHeaders().get("Server");
      if (sys.ObjUtil.compareGE(sys.Int.div(resCode, 100), 4)) {
        throw sys.IOErr.make(sys.Str.plus("HTTP error code: ", sys.ObjUtil.coerce(resCode, sys.Obj.type$.toNullable())));
      }
      ;
      throw AuthErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("No suitable auth scheme for: ", sys.ObjUtil.coerce(resCode, sys.Obj.type$.toNullable())), " "), resServer));
    }
    finally {
      this.#pass = null;
      this.#stash.clear();
    }
    ;
  }

  resHeader(c,name) {
    return sys.ObjUtil.coerce(((this$) => { let $_u4 = c.resHeaders().get(name); if ($_u4 != null) return $_u4; throw this$.err(sys.Str.plus("Missing required header: ", name)); })(this), sys.Str.type$);
  }

  err(msg) {
    return AuthErr.make(msg);
  }

  success(c) {
    this.addCookiesToHeaders(c);
    this.#isAuthenticated = true;
    return this;
  }

  addCookiesToHeaders(c) {
    const this$ = this;
    if ((c.cookies().isEmpty() || this.#headers.containsKey("Cookie"))) {
      return;
    }
    ;
    let s = sys.StrBuf.make();
    c.cookies().each((cookie) => {
      s.join(sys.Str.plus(sys.Str.plus(sys.Str.plus("", cookie.name()), "="), cookie.val()), ";");
      return;
    });
    this.#headers.set("Cookie", s.toStr());
    return;
  }

  openBearer() {
    if (sys.ObjUtil.compareNE(this.#user, "auth-bearer-token")) {
      return false;
    }
    ;
    this.#headers.set("Authorization", AuthMsg.make("bearer", sys.Map.__fromLiteral(["authToken"], [this.#pass], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?"))).toStr());
    this.#isAuthenticated = true;
    return true;
  }

  openStd(c) {
    if (sys.ObjUtil.compareNE(c.resCode(), 401)) {
      return false;
    }
    ;
    let wwwAuth = c.resHeaders().get("WWW-Authenticate");
    if (wwwAuth == null) {
      return false;
    }
    ;
    if (sys.Str.startsWith(sys.Str.lower(wwwAuth), "basic")) {
      return false;
    }
    ;
    let scheme = null;
    for (let loopCount = 0; true; loopCount = sys.Int.increment(loopCount)) {
      if (sys.ObjUtil.compareGT(loopCount, 5)) {
        throw this.err("Loop count exceeded");
      }
      ;
      let header = this.resHeader(c, "WWW-Authenticate");
      let resMsgs = AuthMsg.listFromStr(header);
      let resMsg = resMsgs.first();
      (scheme = AuthScheme.find(resMsg.scheme()));
      let reqMsg = scheme.onClient(this, sys.ObjUtil.coerce(resMsg, AuthMsg.type$));
      (c = this.prepare(web.WebClient.make(this.#uri)));
      c.reqHeaders().set("Authorization", reqMsg.toStr());
      this.get(c);
      if (sys.ObjUtil.equals(c.resCode(), 200)) {
        break;
      }
      ;
      if (sys.ObjUtil.equals(c.resCode(), 401)) {
        continue;
      }
      ;
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), " "), c.resPhrase()));
    }
    ;
    let authInfo = this.resHeader(c, "Authentication-Info");
    let authInfoMsg = AuthMsg.fromStr(sys.Str.plus("bearer ", authInfo));
    scheme.onClientSuccess(this, sys.ObjUtil.coerce(authInfoMsg, AuthMsg.type$));
    (authInfoMsg = AuthMsg.make("bearer", sys.Map.__fromLiteral(["authToken"], [authInfoMsg.param("authToken")], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?"))));
    this.#headers.set("Authorization", authInfoMsg.toStr());
    return true;
  }

  prepare(c) {
    c.followRedirects(false);
    c.socketConfig(this.#socketConfig);
    c.reqHeaders().setAll(this.#headers);
    if (this.#userAgent != null) {
      c.reqHeaders().set("User-Agent", sys.ObjUtil.coerce(this.#userAgent, sys.Str.type$));
    }
    ;
    return c;
  }

  get(c) {
    return this.send(c, null);
  }

  post(c,content) {
    return this.send(c, content);
  }

  send(c,post) {
    try {
      let body = null;
      if (post != null) {
        (body = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().print(post), sys.Buf.type$.toNullable()).flip(), sys.Buf.type$.toNullable()));
        c.reqMethod("POST");
        c.reqHeaders().set("Content-Length", sys.Int.toStr(body.size()));
        if (c.reqHeaders().get("Content-Type") == null) {
          c.reqHeaders().set("Content-Type", "text/plain; charset=utf-8");
        }
        ;
      }
      ;
      let debugCount = AuthClientContext.debugReq(this.#log, c, post);
      if (post == null) {
        c.writeReq().readRes();
      }
      else {
        c.writeReq();
        c.reqOut().writeBuf(sys.ObjUtil.coerce(body, sys.Buf.type$)).close();
        c.readRes();
      }
      ;
      let res = null;
      let resType = c.resHeaders().get("Content-Type");
      if (resType != null) {
        (res = c.resIn().readAllStr());
      }
      ;
      AuthClientContext.debugRes(this.#log, debugCount, c, res);
      return res;
    }
    finally {
      c.close();
    }
    ;
  }

  static debugReq(log,c,content) {
    if (content === undefined) content = null;
    const this$ = this;
    if ((log == null || !log.isDebug())) {
      return 0;
    }
    ;
    let count = AuthClientContext.debugCounter().getAndIncrement();
    let s = sys.StrBuf.make();
    s.add(sys.Str.plus(sys.Str.plus("> [", sys.ObjUtil.coerce(count, sys.Obj.type$.toNullable())), "]\n"));
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", c.reqMethod()), " "), c.reqUri()), "\n"));
    c.reqHeaders().each((v,n) => {
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), v), "\n"));
      return;
    });
    if (content != null) {
      s.add(sys.Str.trimEnd(content)).add("\n");
    }
    ;
    log.debug(s.toStr());
    return count;
  }

  static debugRes(log,count,c,content) {
    if (content === undefined) content = null;
    const this$ = this;
    if ((log == null || !log.isDebug())) {
      return;
    }
    ;
    let s = sys.StrBuf.make();
    s.add(sys.Str.plus(sys.Str.plus("< [", sys.ObjUtil.coerce(count, sys.Obj.type$.toNullable())), "]\n"));
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), " "), c.resPhrase()), "\n"));
    c.resHeaders().each((v,n) => {
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), v), "\n"));
      return;
    });
    if (content != null) {
      s.add(sys.Str.trimEnd(content)).add("\n");
    }
    ;
    log.debug(s.toStr());
    return;
  }

  static main(args) {
    if (sys.ObjUtil.compareLT(args.size(), 3)) {
      sys.ObjUtil.echo("usage: <uri> <user> <pass>");
      return;
    }
    ;
    let log = sys.Log.get("auth");
    log.level(sys.LogLevel.debug());
    let cx = AuthClientContext.open(sys.Str.toUri(args.get(0)), args.get(1), args.get(2), log);
    sys.ObjUtil.echo("--- AuthContext.open success! ---\n");
    let res = cx.get(cx.prepare(web.WebClient.make(cx.#uri)));
    return;
  }

  static static$init() {
    AuthClientContext.#debugCounter = concurrent.AtomicInt.make();
    return;
  }

}

class AuthServerContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AuthServerContext.type$; }

  #user = null;

  user() {
    return this.#user;
  }

  #req = null;

  req() {
    return this.#req;
  }

  #res = null;

  res() {
    return this.#res;
  }

  #isDebug = false;

  isDebug() {
    return this.#isDebug;
  }

  static #debugCounter = undefined;

  static debugCounter() {
    if (AuthServerContext.#debugCounter === undefined) {
      AuthServerContext.static$init();
      if (AuthServerContext.#debugCounter === undefined) AuthServerContext.#debugCounter = null;
    }
    return AuthServerContext.#debugCounter;
  }

  #debugCount = 0;

  // private field reflection only
  __debugCount(it) { if (it === undefined) return this.#debugCount; else this.#debugCount = it; }

  #debugBuf = null;

  // private field reflection only
  __debugBuf(it) { if (it === undefined) return this.#debugBuf; else this.#debugBuf = it; }

  #debugStep = 0;

  // private field reflection only
  __debugStep(it) { if (it === undefined) return this.#debugStep; else this.#debugStep = it; }

  authSecret(secret) {
    return sys.ObjUtil.equals(this.userSecret(), secret);
  }

  onAuthErr(err) {
    return;
  }

  onService(req,res) {
    let username = null;
    try {
      this.#req = req;
      this.#res = res;
      let isDebug = this.debugReq(req);
      let header = req.headers().get("Authorization");
      if (isDebug) {
        this.debug(sys.Str.plus("Auth header: ", header));
      }
      ;
      if (header == null) {
        return this.sendRes(res, 400, "Missing Authorization header");
      }
      ;
      let reqMsg = AuthMsg.fromStr(sys.ObjUtil.coerce(header, sys.Str.type$), false);
      if (isDebug) {
        this.debug(sys.Str.plus("Parse header: ", reqMsg));
      }
      ;
      if (reqMsg == null) {
        let errMsg = ((this$) => { if (sys.Str.startsWith(sys.Str.lower(header), "basic")) return "Basic authentication not supported"; return "Cannot parse Authorization header"; })(this);
        return this.sendRes(res, 400, errMsg);
      }
      ;
      let schemeName = reqMsg.scheme();
      if (sys.ObjUtil.equals("bearer", schemeName)) {
        return this.handleBearer(sys.ObjUtil.coerce(reqMsg, AuthMsg.type$));
      }
      ;
      let username64 = ((this$) => { let $_u6 = reqMsg.param("username", false); if ($_u6 != null) return $_u6; return reqMsg.param("handshakeToken", false); })(this);
      if (isDebug) {
        this.debug(sys.Str.plus("Username64: ", username64));
      }
      ;
      if (username64 == null) {
        return this.sendRes(res, 400, "Missing username or handshakeToken in Authorization header");
      }
      ;
      try {
        (username = AuthUtil.fromBase64(sys.ObjUtil.coerce(username64, sys.Str.type$)));
      }
      catch ($_u7) {
        $_u7 = sys.Err.make($_u7);
        if ($_u7 instanceof sys.Err) {
          let e = $_u7;
          ;
        }
        else {
          throw $_u7;
        }
      }
      ;
      if (isDebug) {
        this.debug(sys.Str.plus("Username: ", username));
      }
      ;
      if (username == null) {
        return this.sendRes(res, 400, "Invalid base64 encoding of username param in Authorization header");
      }
      ;
      let user = this.userByUsername(sys.ObjUtil.coerce(username, sys.Str.type$));
      if (isDebug) {
        this.debug(sys.Str.plus("User: ", user));
      }
      ;
      if (user == null) {
        return null;
      }
      ;
      if (sys.ObjUtil.equals(schemeName, "hello")) {
        (schemeName = user.scheme());
      }
      ;
      if (isDebug) {
        this.debug(sys.Str.plus("Scheme name: ", schemeName));
      }
      ;
      if (sys.ObjUtil.compareNE(schemeName, user.scheme())) {
        return this.sendRes(res, 400, sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid auth scheme for user: ", schemeName), " != "), user.scheme()));
      }
      ;
      this.#user = user;
      let resMsg = this.handleScheme(schemeName, sys.ObjUtil.coerce(reqMsg, AuthMsg.type$));
      if (resMsg == null) {
        return this.sendRes(res, 400, "Unsupported scheme for Authorization header");
      }
      ;
      if (isDebug) {
        this.debug(sys.Str.plus("Res msg: ", resMsg));
      }
      ;
      let ok = resMsg.param("authToken", false) != null;
      if (ok) {
        res.headers().set("Authentication-Info", resMsg.paramsToStr());
        this.sendRes(res, 200, "Auth successful");
      }
      else {
        res.headers().set("WWW-Authenticate", resMsg.toStr());
        this.sendRes(res, 401, "Auth challenge");
      }
      ;
      return null;
    }
    catch ($_u8) {
      $_u8 = sys.Err.make($_u8);
      if ($_u8 instanceof AuthErr) {
        let e = $_u8;
        ;
        let remoteAddr = AuthUtil.realIp(req);
        let msg = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Login failed for user [", username), "] from remote ip ["), remoteAddr), "]: "), e.msg());
        if (this.log().isDebug()) {
          this.log().debug(msg, e);
        }
        else {
          this.log().info(msg);
        }
        ;
        this.onAuthErr(e);
        return this.sendRes(res, e.resCode(), sys.Str.plus("Auth failed: ", e.resMsg()));
      }
      else {
        throw $_u8;
      }
    }
    ;
  }

  handleBearer(reqMsg) {
    let authToken = reqMsg.param("authToken", false);
    if (this.#isDebug) {
      this.debug(sys.Str.plus("Bearer token: ", authToken));
    }
    ;
    if (authToken != null) {
      let session = this.sessionByAuthToken(sys.ObjUtil.coerce(authToken, sys.Str.type$));
      if (this.#isDebug) {
        this.debug(sys.Str.plus("Bearer session: ", session));
      }
      ;
      if (session != null) {
        return session;
      }
      ;
    }
    ;
    return this.sendRes(sys.ObjUtil.coerce(this.#res, web.WebRes.type$), 403, "Invalid or expired authToken");
  }

  handleScheme(schemeName,reqMsg) {
    let scheme = AuthScheme.find(schemeName, false);
    if (this.#isDebug) {
      this.debug(sys.Str.plus("Scheme: ", ((this$) => { let $_u9 = scheme; if ($_u9 == null) return null; return sys.ObjUtil.typeof(scheme); })(this)));
    }
    ;
    if (scheme == null) {
      return null;
    }
    ;
    let resMsg = null;
    try {
      (resMsg = scheme.onServer(this, reqMsg));
    }
    catch ($_u10) {
      $_u10 = sys.Err.make($_u10);
      if ($_u10 instanceof sys.UnsupportedErr) {
        let e = $_u10;
        ;
        if (this.#isDebug) {
          e.trace();
        }
        ;
      }
      else {
        throw $_u10;
      }
    }
    ;
    return resMsg;
  }

  addSecResHeaders() {
    this.#res.headers().set("Cache-Control", "no-cache, no-store, private");
    this.#res.headers().set("X-Frame-Options", "SAMEORIGIN");
    this.#res.headers().set("Content-Security-Policy", "frame-ancestors 'self'");
    return;
  }

  sendRes(res,code,msg) {
    res.headers().set("Content-Length", "0");
    this.addSecResHeaders();
    if (this.#isDebug) {
      this.debugRes(res, code, msg);
    }
    ;
    res.sendErr(code, msg);
    return null;
  }

  debug(msg) {
    if (!this.#isDebug) {
      throw sys.Err.make("Wrap with if(isDebug)");
    }
    ;
    if (sys.Str.contains(msg, "password")) {
      let r = sys.Regex.fromStr("password=(.*)\\b?");
      let m = r.matcher(msg);
      if (m.find()) {
        (msg = sys.Str.replace(msg, sys.Str.plus("password=", m.group(1)), "password=<password>"));
      }
      ;
    }
    ;
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.#debugBuf.add(sys.Int.toChar(this.#debugStep)), sys.StrBuf.type$.toNullable()).add(") "), sys.StrBuf.type$.toNullable()).add(msg), sys.StrBuf.type$.toNullable()).addChar(10);
    ((this$) => { let $_u11 = this$.#debugStep;this$.#debugStep = sys.Int.increment(this$.#debugStep); return $_u11; })(this);
    return;
  }

  debugReq(req) {
    const this$ = this;
    this.#isDebug = this.log().isDebug();
    if (!this.#isDebug) {
      return false;
    }
    ;
    this.#debugCount = AuthServerContext.debugCounter().getAndIncrement();
    let s = ((this$) => { let $_u12 = sys.StrBuf.make(); this$.#debugBuf = $_u12; return $_u12; })(this);
    s.add(sys.Str.plus(sys.Str.plus("> [", sys.ObjUtil.coerce(this.#debugCount, sys.Obj.type$.toNullable())), "]\n"));
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", req.method()), " "), req.uri()), "\n"));
    req.headers().each((v,n) => {
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), v), "\n"));
      return;
    });
    this.log().debug(s.toStr());
    this.#debugBuf = sys.ObjUtil.coerce(sys.ObjUtil.coerce(s.clear(), sys.StrBuf.type$.toNullable()).add(sys.Str.plus(sys.Str.plus("< [", sys.ObjUtil.coerce(this.#debugCount, sys.Obj.type$.toNullable())), "]\n")), sys.StrBuf.type$.toNullable());
    this.#debugStep = 97;
    return true;
  }

  debugRes(res,code,msg) {
    const this$ = this;
    if (!this.#isDebug) {
      return;
    }
    ;
    let s = this.#debugBuf;
    s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(code, sys.Obj.type$.toNullable())), " "), msg), "\n"));
    res.headers().each((v,n) => {
      s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", n), ": "), v), "\n"));
      return;
    });
    this.log().debug(s.toStr());
    return;
  }

  static make() {
    const $self = new AuthServerContext();
    AuthServerContext.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    AuthServerContext.#debugCounter = concurrent.AtomicInt.make();
    return;
  }

}

class AuthUser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AuthUser.type$; }

  #username = null;

  username() { return this.#username; }

  __username(it) { if (it === undefined) return this.#username; else this.#username = it; }

  #scheme = null;

  scheme() { return this.#scheme; }

  __scheme(it) { if (it === undefined) return this.#scheme; else this.#scheme = it; }

  #params = null;

  params() { return this.#params; }

  __params(it) { if (it === undefined) return this.#params; else this.#params = it; }

  static genFake(username) {
    let scram = ScramKey.gen(sys.Map.__fromLiteral(["hash","salt"], ["SHA-256",sys.Buf.fromBase64(AuthUtil.dummySalt(username))], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    return AuthUser.makeMsg(username, scram.toAuthMsg());
  }

  static makeMsg(username,msg) {
    const $self = new AuthUser();
    AuthUser.makeMsg$($self,username,msg);
    return $self;
  }

  static makeMsg$($self,username,msg) {
    AuthUser.make$($self, username, msg.scheme(), msg.params());
    return;
  }

  static make(username,scheme,params) {
    const $self = new AuthUser();
    AuthUser.make$($self,username,scheme,params);
    return $self;
  }

  static make$($self,username,scheme,params) {
    $self.#username = username;
    $self.#scheme = scheme;
    $self.#params = sys.ObjUtil.coerce(((this$) => { let $_u13 = params; if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(params); })($self), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

  toStr() {
    return this.#username;
  }

  param(name,checked) {
    if (checked === undefined) checked = true;
    let val = this.#params.get(name);
    if (val != null) {
      return val;
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus("AuthUser param not found: ", name));
    }
    ;
    return null;
  }

}

class AuthScheme extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AuthScheme.type$; }

  static #registryRef = undefined;

  static registryRef() {
    if (AuthScheme.#registryRef === undefined) {
      AuthScheme.static$init();
      if (AuthScheme.#registryRef === undefined) AuthScheme.#registryRef = null;
    }
    return AuthScheme.#registryRef;
  }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  static list() {
    return AuthScheme.registry().list();
  }

  static find(name,checked) {
    if (checked === undefined) checked = true;
    return AuthScheme.registry().find(name, checked);
  }

  static registry() {
    let r = sys.ObjUtil.as(AuthScheme.registryRef().val(), AuthSchemeRegistry.type$);
    if (r == null) {
      AuthScheme.registryRef().val((r = AuthSchemeRegistry.make()));
    }
    ;
    return sys.ObjUtil.coerce(r, AuthSchemeRegistry.type$);
  }

  static make(name) {
    const $self = new AuthScheme();
    AuthScheme.make$($self,name);
    return $self;
  }

  static make$($self,name) {
    if (sys.ObjUtil.compareNE(name, sys.Str.lower(name))) {
      throw sys.ArgErr.make(sys.Str.plus("Name must be lowercase: ", name));
    }
    ;
    $self.#name = name;
    return;
  }

  onClientSuccess(cx,msg) {
    return;
  }

  onClientNonStd(cx,c,content) {
    return false;
  }

  static static$init() {
    AuthScheme.#registryRef = concurrent.AtomicRef.make();
    return;
  }

}

class AuthSchemeRegistry extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AuthSchemeRegistry.type$; }

  #list = null;

  list() { return this.#list; }

  __list(it) { if (it === undefined) return this.#list; else this.#list = it; }

  #byName = null;

  byName() { return this.#byName; }

  __byName(it) { if (it === undefined) return this.#byName; else this.#byName = it; }

  static make() {
    const $self = new AuthSchemeRegistry();
    AuthSchemeRegistry.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    let list = sys.List.make(AuthScheme.type$);
    let byName = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("auth::AuthScheme"));
    try {
      sys.Env.cur().index("auth.scheme").each((qname) => {
        try {
          let scheme = sys.ObjUtil.coerce(sys.Type.find(qname).make(), AuthScheme.type$);
          byName.add(scheme.name(), scheme);
          list.add(scheme);
        }
        catch ($_u14) {
          $_u14 = sys.Err.make($_u14);
          if ($_u14 instanceof sys.Err) {
            let e = $_u14;
            ;
            sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("ERROR: Invalid auth.scheme: ", qname), "; "), e));
          }
          else {
            throw $_u14;
          }
        }
        ;
        return;
      });
      (list = list.sort((a,b) => {
        return sys.ObjUtil.compare(a.name(), b.name());
      }));
    }
    catch ($_u15) {
      $_u15 = sys.Err.make($_u15);
      if ($_u15 instanceof sys.Err) {
        let e = $_u15;
        ;
        e.trace();
      }
      else {
        throw $_u15;
      }
    }
    ;
    $self.#list = sys.ObjUtil.coerce(((this$) => { let $_u16 = list; if ($_u16 == null) return null; return sys.ObjUtil.toImmutable(list); })($self), sys.Type.find("auth::AuthScheme[]"));
    $self.#byName = sys.ObjUtil.coerce(((this$) => { let $_u17 = byName; if ($_u17 == null) return null; return sys.ObjUtil.toImmutable(byName); })($self), sys.Type.find("[sys::Str:auth::AuthScheme]"));
    return;
  }

  find(name,checked) {
    if (checked === undefined) checked = true;
    let scheme = this.#byName.get(sys.Str.lower(name));
    if (scheme != null) {
      return scheme;
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus("Unknown auth scheme: ", name));
    }
    ;
    return null;
  }

}

class AuthUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AuthUtil.type$; }

  static #dummyRand = undefined;

  static dummyRand() {
    if (AuthUtil.#dummyRand === undefined) {
      AuthUtil.static$init();
      if (AuthUtil.#dummyRand === undefined) AuthUtil.#dummyRand = null;
    }
    return AuthUtil.#dummyRand;
  }

  static #nonceMask = undefined;

  static nonceMask() {
    if (AuthUtil.#nonceMask === undefined) {
      AuthUtil.static$init();
      if (AuthUtil.#nonceMask === undefined) AuthUtil.#nonceMask = 0;
    }
    return AuthUtil.#nonceMask;
  }

  static toBase64(x) {
    if (sys.ObjUtil.is(x, sys.Str.type$)) {
      (x = sys.Str.toBuf(sys.ObjUtil.coerce(x, sys.Str.type$)));
    }
    ;
    return sys.ObjUtil.coerce(x, sys.Buf.type$).toBase64Uri();
  }

  static fromBase64(s) {
    return sys.Buf.fromBase64(s).readAllStr();
  }

  static genSalt() {
    return AuthUtil.toBase64(sys.Buf.random(32));
  }

  static dummySalt(username) {
    return AuthUtil.toBase64(sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", username), ":"), AuthUtil.dummyRand())).toDigest("SHA-256"));
  }

  static genNonce() {
    let rand = sys.Int.random();
    let ticks = sys.Int.xor(sys.Int.xor(sys.DateTime.nowTicks(), AuthUtil.nonceMask()), rand);
    return sys.Str.plus(sys.Int.toHex(rand, sys.ObjUtil.coerce(16, sys.Int.type$.toNullable())), sys.Int.toHex(ticks, sys.ObjUtil.coerce(16, sys.Int.type$.toNullable())));
  }

  static verifyNonce(nonce) {
    let rand = sys.Str.toInt(sys.Str.getRange(nonce, sys.Range.make(0, 15)), 16);
    let ticks = sys.Int.xor(sys.Int.xor(sys.ObjUtil.coerce(sys.Str.toInt(sys.Str.getRange(nonce, sys.Range.make(16, -1)), 16), sys.Int.type$), AuthUtil.nonceMask()), sys.ObjUtil.coerce(rand, sys.Int.type$));
    let diff = sys.Int.abs(sys.Int.minus(sys.DateTime.nowTicks(), ticks));
    return sys.ObjUtil.compareLT(diff, 30000000000);
  }

  static authToken(req) {
    let header = req.headers().get("Authorization");
    if (header == null) {
      return null;
    }
    ;
    let reqMsg = AuthMsg.fromStr(sys.ObjUtil.coerce(header, sys.Str.type$), false);
    if (reqMsg == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.compareNE(reqMsg.scheme(), "bearer")) {
      return null;
    }
    ;
    return reqMsg.param("authToken", false);
  }

  static realIp(req) {
    let addr = req.headers().get("X-Real-IP");
    if (addr == null) {
      (addr = req.headers().get("X-Forwarded-For"));
    }
    ;
    if (addr == null) {
      (addr = req.remoteAddr().numeric());
    }
    ;
    return sys.ObjUtil.coerce(addr, sys.Str.type$);
  }

  static make() {
    const $self = new AuthUtil();
    AuthUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    AuthUtil.#dummyRand = sys.Buf.random(16).toHex();
    AuthUtil.#nonceMask = sys.Int.random();
    return;
  }

}

class BasicScheme extends AuthScheme {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BasicScheme.type$; }

  static make() {
    const $self = new BasicScheme();
    BasicScheme.make$($self);
    return $self;
  }

  static make$($self) {
    AuthScheme.make$($self, "basic");
    return;
  }

  onServer(cx,msg) {
    throw sys.UnsupportedErr.make();
  }

  onClient(cx,msg) {
    throw sys.UnsupportedErr.make();
  }

  static use(c,content) {
    let resCode = c.resCode();
    let wwwAuth = sys.Str.lower(c.resHeaders().get("WWW-Authenticate", ""));
    let server = sys.Str.lower(c.resHeaders().get("Server", ""));
    let setCookie = sys.Str.lower(c.resHeaders().get("Set-Cookie", ""));
    if ((sys.ObjUtil.equals(resCode, 401) && sys.Str.startsWith(wwwAuth, "basic"))) {
      return true;
    }
    ;
    if ((sys.Str.startsWith(server, "niagara") || sys.Str.contains(setCookie, "niagara"))) {
      return true;
    }
    ;
    if ((sys.ObjUtil.equals(resCode, 500) && content != null && sys.Str.contains(content, "wrong 4-byte ending"))) {
      return true;
    }
    ;
    return false;
  }

  onClientNonStd(cx,c,content) {
    if (!BasicScheme.use(c, content)) {
      return false;
    }
    ;
    let cred = sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", cx.user()), ":"), cx.pass())).toBase64();
    let headerKey = "Authorization";
    let headerVal = sys.Str.plus("Basic ", cred);
    (c = cx.prepare(web.WebClient.make(cx.uri())));
    c.reqHeaders().set(headerKey, headerVal);
    cx.get(c);
    if (sys.ObjUtil.compareNE(c.resCode(), 200)) {
      throw cx.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Basic auth failed: ", sys.ObjUtil.coerce(c.resCode(), sys.Obj.type$.toNullable())), " "), c.resPhrase()));
    }
    ;
    cx.headers().set(headerKey, headerVal);
    return true;
  }

}

class PlaintextScheme extends AuthScheme {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PlaintextScheme.type$; }

  static make() {
    const $self = new PlaintextScheme();
    PlaintextScheme.make$($self);
    return $self;
  }

  static make$($self) {
    AuthScheme.make$($self, "plaintext");
    return;
  }

  static makeScheme(name) {
    const $self = new PlaintextScheme();
    PlaintextScheme.makeScheme$($self,name);
    return $self;
  }

  static makeScheme$($self,name) {
    AuthScheme.make$($self, name);
    return;
  }

  onClient(cx,msg) {
    return AuthMsg.make(this.name(), sys.Map.__fromLiteral(["username","password"], [AuthUtil.toBase64(cx.user()),AuthUtil.toBase64(sys.ObjUtil.coerce(cx.pass(), sys.Obj.type$))], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

  onServer(cx,msg) {
    if (sys.ObjUtil.equals(msg.scheme(), "hello")) {
      return sys.ObjUtil.coerce(AuthMsg.fromStr(this.name()), AuthMsg.type$);
    }
    ;
    let given = AuthUtil.fromBase64(sys.ObjUtil.coerce(msg.param("password"), sys.Str.type$));
    if (!cx.authSecret(given)) {
      throw AuthErr.makeInvalidPassword();
    }
    ;
    let authToken = cx.login();
    return AuthMsg.make(this.name(), sys.Map.__fromLiteral(["authToken"], [authToken], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

}

class XPlaintextScheme extends PlaintextScheme {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XPlaintextScheme.type$; }

  static make() {
    const $self = new XPlaintextScheme();
    XPlaintextScheme.make$($self);
    return $self;
  }

  static make$($self) {
    PlaintextScheme.makeScheme$($self, "x-plaintext");
    return;
  }

}

class HmacScheme extends AuthScheme {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HmacScheme.type$; }

  static gen() {
    return sys.Map.__fromLiteral(["hash","salt"], ["SHA-1",AuthUtil.genSalt()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
  }

  static make() {
    const $self = new HmacScheme();
    HmacScheme.make$($self);
    return $self;
  }

  static make$($self) {
    AuthScheme.make$($self, "hmac");
    return;
  }

  onClient(cx,msg) {
    let user = cx.user();
    let pass = cx.pass();
    let hash = msg.param("hash");
    let salt = sys.Buf.fromBase64(sys.ObjUtil.coerce(msg.param("salt"), sys.Str.type$)).toBase64();
    let nonce = msg.param("nonce");
    let secret = HmacScheme.hmac(user, sys.ObjUtil.coerce(pass, sys.Str.type$), salt, sys.ObjUtil.coerce(hash, sys.Str.type$));
    let digest = sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", secret), ":"), nonce)).toDigest(sys.ObjUtil.coerce(hash, sys.Str.type$));
    return AuthMsg.make(this.name(), sys.Map.__fromLiteral(["handshakeToken","digest","nonce"], [AuthUtil.toBase64(cx.user()),AuthUtil.toBase64(digest),nonce], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")));
  }

  onServer(cx,msg) {
    if (sys.ObjUtil.equals(msg.scheme(), "hello")) {
      let params = cx.user().params().dup();
      params.set("nonce", AuthUtil.genNonce());
      return AuthMsg.make(this.name(), params);
    }
    ;
    let user = cx.user().username();
    let secret = cx.userSecret();
    let hash = cx.user().param("hash");
    let nonce = msg.param("nonce");
    let digest = msg.param("digest");
    let expected = AuthUtil.toBase64(sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", secret), ":"), nonce)).toDigest(sys.ObjUtil.coerce(hash, sys.Str.type$)));
    if (cx.isDebug()) {
      cx.debug(sys.Str.plus("hmac.nonce:    ", nonce));
      cx.debug(sys.Str.plus("hmac.digest:   ", digest));
      cx.debug(sys.Str.plus("hmac.expected: ", expected));
    }
    ;
    if (sys.ObjUtil.compareNE(expected, digest)) {
      throw AuthErr.makeInvalidPassword();
    }
    ;
    let authToken = cx.login();
    return AuthMsg.make("hmac", sys.Map.__fromLiteral(["authToken"], [authToken], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

  static hmac(user,pass,salt,hash) {
    if (hash === undefined) hash = "SHA-1";
    (salt = sys.Buf.fromBase64(salt).toBase64());
    return sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", user), ":"), salt)).hmac(hash, sys.Str.toBuf(pass)).toBase64();
  }

}

class ScramScheme extends AuthScheme {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ScramScheme.type$; }

  static #clientNonceBytes = undefined;

  static clientNonceBytes() {
    if (ScramScheme.#clientNonceBytes === undefined) {
      ScramScheme.static$init();
      if (ScramScheme.#clientNonceBytes === undefined) ScramScheme.#clientNonceBytes = 0;
    }
    return ScramScheme.#clientNonceBytes;
  }

  static #gs2_header = undefined;

  static gs2_header() {
    if (ScramScheme.#gs2_header === undefined) {
      ScramScheme.static$init();
      if (ScramScheme.#gs2_header === undefined) ScramScheme.#gs2_header = null;
    }
    return ScramScheme.#gs2_header;
  }

  static make() {
    const $self = new ScramScheme();
    ScramScheme.make$($self);
    return $self;
  }

  static make$($self) {
    AuthScheme.make$($self, "scram");
    return;
  }

  onClientSuccess(cx,msg) {
    let s2_msg = AuthUtil.fromBase64(sys.ObjUtil.coerce(msg.param("data"), sys.Str.type$));
    let data = ScramScheme.decodeMsg(s2_msg);
    if (sys.ObjUtil.compareNE(cx.stash().get("serverSignature"), data.get("v"))) {
      throw AuthErr.make("Invalid server signature");
    }
    ;
    return;
  }

  onClient(cx,msg) {
    return ((this$) => { if (msg.params().get("data") == null) return this$.sendClientFirstMessage(cx, msg); return this$.sendClientFinalMessage(cx, msg); })(this);
  }

  sendClientFirstMessage(cx,msg) {
    let c_nonce = sys.Buf.random(ScramScheme.clientNonceBytes()).toHex();
    let c1_bare = sys.Str.plus(sys.Str.plus(sys.Str.plus("n=", cx.user()), ",r="), c_nonce);
    let c1_msg = sys.Str.plus(ScramScheme.gs2_header(), c1_bare);
    cx.log().debug(sys.Str.plus("client-first-message: ", c1_msg));
    let params = sys.Map.__fromLiteral(["data"], [AuthUtil.toBase64(c1_msg)], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    return AuthMsg.make(this.name(), ScramScheme.injectHandshakeToken(msg, params));
  }

  sendClientFinalMessage(cx,msg) {
    let s1_msg = AuthUtil.fromBase64(sys.ObjUtil.coerce(msg.param("data"), sys.Str.type$));
    let data = ScramScheme.decodeMsg(s1_msg);
    let cbind_input = ScramScheme.gs2_header();
    let channel_binding = AuthUtil.toBase64(cbind_input);
    let nonce = data.get("r");
    let c2_no_proof = sys.Str.plus(sys.Str.plus(sys.Str.plus("c=", channel_binding), ",r="), nonce);
    let hash = msg.param("hash");
    let salt = data.get("s");
    let iterations = sys.Int.fromStr(sys.ObjUtil.coerce(data.get("i"), sys.Str.type$));
    let scramKey = ScramKey.compute(sys.ObjUtil.coerce(cx.pass(), sys.Str.type$), sys.ObjUtil.coerce(hash, sys.Str.type$), sys.ObjUtil.coerce(salt, sys.Obj.type$), sys.ObjUtil.coerce(iterations, sys.Int.type$));
    let c_nonce = sys.Str.getRange(nonce, sys.Range.make(0, sys.Int.mult(ScramScheme.clientNonceBytes(), 2), true));
    let c1_bare = sys.Str.plus(sys.Str.plus(sys.Str.plus("n=", cx.user()), ",r="), c_nonce);
    let authMsg = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", c1_bare), ","), s1_msg), ","), c2_no_proof);
    let clientSig = sys.Str.toBuf(authMsg).hmac(sys.ObjUtil.coerce(hash, sys.Str.type$), sys.ObjUtil.coerce(scramKey.storedKey(), sys.Buf.type$));
    let proof = ScramScheme.xor(sys.ObjUtil.coerce(scramKey.clientKey(), sys.Buf.type$), clientSig).toBase64();
    let c2_msg = sys.Str.plus(sys.Str.plus(sys.Str.plus("", c2_no_proof), ",p="), proof);
    let serverSig = sys.Str.toBuf(authMsg).hmac(sys.ObjUtil.coerce(hash, sys.Str.type$), sys.ObjUtil.coerce(scramKey.serverKey(), sys.Buf.type$)).toBase64();
    cx.stash().set("serverSignature", serverSig);
    cx.log().debug(sys.Str.plus("auth-msg: ", authMsg));
    cx.log().debug(sys.Str.plus("client-final-message: ", c2_msg));
    let params = sys.Map.__fromLiteral(["data"], [AuthUtil.toBase64(c2_msg)], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    return AuthMsg.make(this.name(), ScramScheme.injectHandshakeToken(msg, params));
  }

  onServer(cx,msg) {
    if (sys.ObjUtil.equals(msg.scheme(), "hello")) {
      let params = sys.Map.__fromLiteral(["hash","handshakeToken"], [cx.user().params().get("hash"),msg.param("username")], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?"));
      return AuthMsg.make(this.name(), params);
    }
    ;
    let data = ScramScheme.decodeMsg(AuthUtil.fromBase64(sys.ObjUtil.coerce(msg.param("data"), sys.Str.type$)));
    return ((this$) => { if (data.get("p") == null) return this$.onClientFirstMessage(cx, msg); return this$.onClientFinalMessage(cx, msg); })(this);
  }

  onClientFirstMessage(cx,msg) {
    let user = cx.user();
    let hash = user.param("hash");
    let salt = user.param("salt");
    let i = user.param("c");
    (salt = sys.Buf.fromBase64(sys.ObjUtil.coerce(salt, sys.Str.type$)).toBase64());
    let c1_msg = AuthUtil.fromBase64(sys.ObjUtil.coerce(msg.param("data"), sys.Str.type$));
    let data = ScramScheme.decodeMsg(c1_msg);
    let c_nonce = data.get("r");
    if ((c_nonce == null || sys.Str.isEmpty(c_nonce))) {
      throw AuthErr.make(sys.Str.plus(sys.Str.plus("Bad client nonce: '", c_nonce), "'"));
    }
    ;
    let s_nonce = AuthUtil.genNonce();
    let nonce = sys.Str.plus(sys.Str.plus(sys.Str.plus("", c_nonce), ""), s_nonce);
    let s1_msg = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("r=", nonce), ",s="), salt), ",i="), i);
    if (cx.isDebug()) {
      cx.debug(sys.Str.plus("server-first-message: ", s1_msg));
    }
    ;
    let params = sys.Map.__fromLiteral(["hash","data"], [hash,AuthUtil.toBase64(s1_msg)], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?"));
    return AuthMsg.make(this.name(), ScramScheme.injectHandshakeToken(msg, params));
  }

  onClientFinalMessage(cx,msg) {
    let user = cx.user();
    let username = AuthUtil.fromBase64(sys.ObjUtil.coerce(msg.param("handshakeToken"), sys.Str.type$));
    let secret = ((this$) => { let $_u20 = cx.userSecret(); if ($_u20 != null) return $_u20; throw AuthErr.makeUnknownUser(username); })(this);
    let hash = user.param("hash");
    let salt = user.param("salt");
    let i = user.param("c");
    (salt = sys.Buf.fromBase64(sys.ObjUtil.coerce(salt, sys.Str.type$)).toBase64());
    let c2_msg = AuthUtil.fromBase64(sys.ObjUtil.coerce(msg.param("data"), sys.Str.type$));
    let data = ScramScheme.decodeMsg(c2_msg);
    let nonce = data.get("r");
    let s_nonce = sys.Str.getRange(nonce, sys.Range.make(sys.Int.negate(sys.Str.size(AuthUtil.genNonce())), -1));
    if (!AuthUtil.verifyNonce(s_nonce)) {
      throw AuthErr.make("Invalid nonce");
    }
    ;
    let c_nonce = sys.Str.getRange(nonce, sys.Range.make(0, sys.Int.negate(sys.Str.size(s_nonce)), true));
    let c1_bare = sys.Str.plus(sys.Str.plus(sys.Str.plus("n=", username), ",r="), c_nonce);
    let s1_msg = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("r=", nonce), ",s="), salt), ",i="), i);
    let channel = data.get("c");
    let c2_no_proof = sys.Str.plus(sys.Str.plus(sys.Str.plus("c=", channel), ",r="), nonce);
    let authMsg = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", c1_bare), ","), s1_msg), ","), c2_no_proof);
    let saltedPassword = sys.Buf.fromBase64(sys.ObjUtil.coerce(secret, sys.Str.type$));
    let scramKey = ScramKey.gen(sys.Map.__fromLiteral(["hash","salt","iterations"], [hash,sys.Buf.fromBase64(sys.ObjUtil.coerce(salt, sys.Str.type$)),sys.Str.plus("", i)], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
    scramKey.saltedPassword(saltedPassword);
    let clientSig = sys.Str.toBuf(authMsg).hmac(sys.ObjUtil.coerce(hash, sys.Str.type$), sys.ObjUtil.coerce(scramKey.storedKey(), sys.Buf.type$));
    if (cx.isDebug()) {
      cx.debug(sys.Str.plus("auth-msg: ", authMsg));
      cx.debug(sys.Str.plus("saltedPassword=", saltedPassword.toBase64()));
      cx.debug(sys.Str.plus("clientKey=", scramKey.clientKey().toBase64()));
      cx.debug(sys.Str.plus("storedKey=", scramKey.storedKey().toBase64()));
      cx.debug(sys.Str.plus("clientSig=", clientSig.toBase64()));
    }
    ;
    let proof = sys.Buf.fromBase64(sys.ObjUtil.coerce(data.get("p"), sys.Str.type$));
    let clientKey = ScramScheme.xor(proof, clientSig);
    let computedSecret = clientKey.toDigest(sys.ObjUtil.coerce(hash, sys.Str.type$));
    if (sys.ObjUtil.compareNE(computedSecret.toBase64(), scramKey.storedKey().toBase64())) {
      throw AuthErr.makeInvalidPassword();
    }
    ;
    let serverSig = sys.Str.toBuf(authMsg).hmac(sys.ObjUtil.coerce(hash, sys.Str.type$), sys.ObjUtil.coerce(scramKey.serverKey(), sys.Buf.type$));
    let s2_msg = sys.Str.plus("v=", serverSig.toBase64());
    let params = sys.Map.__fromLiteral(["authToken","hash","data"], [cx.login(),hash,AuthUtil.toBase64(s2_msg)], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?"));
    return AuthMsg.make(this.name(), params);
  }

  static injectHandshakeToken(msg,params) {
    let tok = msg.params().get("handshakeToken");
    if (tok != null) {
      params.set("handshakeToken", sys.ObjUtil.coerce(tok, sys.Str.type$));
    }
    ;
    return params;
  }

  static decodeMsg(s) {
    const this$ = this;
    let data = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    sys.Str.split(s, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).each((tok) => {
      let n = sys.Str.index(tok, "=");
      if (n == null) {
        return;
      }
      ;
      data.add(sys.Str.getRange(tok, sys.Range.make(0, sys.ObjUtil.coerce(n, sys.Int.type$), true)), sys.Str.getRange(tok, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(n, sys.Int.type$), 1), -1)));
      return;
    });
    return data;
  }

  static xor(a,b) {
    if (sys.ObjUtil.compareNE(a.size(), b.size())) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("sizes don't match: ", sys.ObjUtil.coerce(a.size(), sys.Obj.type$.toNullable())), " <> "), sys.ObjUtil.coerce(b.size(), sys.Obj.type$.toNullable())));
    }
    ;
    let x = sys.Buf.make();
    for (let i = 0; sys.ObjUtil.compareLT(i, a.size()); i = sys.Int.increment(i)) {
      x.write(sys.Int.xor(a.get(i), b.get(i)));
    }
    ;
    return sys.ObjUtil.coerce(x, sys.Buf.type$);
  }

  static static$init() {
    ScramScheme.#clientNonceBytes = 12;
    ScramScheme.#gs2_header = "n,,";
    return;
  }

}

class ScramKey extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ScramKey.type$; }

  #hashFunc = null;

  hashFunc() { return this.#hashFunc; }

  __hashFunc(it) { if (it === undefined) return this.#hashFunc; else this.#hashFunc = it; }

  #salt = null;

  salt() {
    return this.#salt;
  }

  #c = 0;

  c() { return this.#c; }

  __c(it) { if (it === undefined) return this.#c; else this.#c = it; }

  #saltedPassword = null;

  saltedPassword(it) {
    if (it === undefined) {
      return this.#saltedPassword;
    }
    else {
      this.#saltedPassword = it;
      this.#clientKey = sys.ObjUtil.coerce(sys.Buf.make().writeChars("Client Key"), sys.Buf.type$.toNullable()).hmac(this.#hashFunc, sys.ObjUtil.coerce(this.#saltedPassword, sys.Buf.type$));
      this.#storedKey = this.#clientKey.toDigest(this.#hashFunc);
      this.#serverKey = sys.ObjUtil.coerce(sys.Buf.make().writeChars("Server Key"), sys.Buf.type$.toNullable()).hmac(this.#hashFunc, sys.ObjUtil.coerce(this.#saltedPassword, sys.Buf.type$));
      return;
    }
  }

  #clientKey = null;

  clientKey() {
    return this.#clientKey;
  }

  #storedKey = null;

  storedKey() {
    return this.#storedKey;
  }

  #serverKey = null;

  serverKey() {
    return this.#serverKey;
  }

  static gen(config) {
    if (config === undefined) config = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj?]"));
    let hashFunc = ((this$) => { let $_u21 = config.get("hash"); if ($_u21 != null) return $_u21; return "SHA-256"; })(this);
    let salt = ((this$) => { let $_u22 = config.get("salt"); if ($_u22 != null) return $_u22; return sys.Buf.random(32); })(this);
    let c = ((this$) => { let $_u23 = config.get("c"); if ($_u23 != null) return $_u23; return sys.ObjUtil.coerce(10000, sys.Obj.type$.toNullable()); })(this);
    return ScramKey.make(sys.ObjUtil.coerce(hashFunc, sys.Str.type$), sys.ObjUtil.coerce(salt, sys.Buf.type$), sys.ObjUtil.coerce(c, sys.Int.type$));
  }

  static fromAuthMsg(msg) {
    if (sys.ObjUtil.compareNE(msg.scheme(), "scram")) {
      throw sys.ArgErr.make(sys.Str.plus("Not a scram msg: ", msg));
    }
    ;
    return sys.ObjUtil.coerce(ScramKey.gen(sys.Map.__fromLiteral(["hash","salt","c"], [msg.param("hash"),sys.Buf.fromBase64(sys.ObjUtil.coerce(msg.param("salt"), sys.Str.type$)),sys.ObjUtil.coerce(sys.Int.fromStr(sys.ObjUtil.coerce(msg.param("c"), sys.Str.type$)), sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"))), ScramKey.type$);
  }

  static compute(password,hash,salt,c) {
    if (sys.ObjUtil.is(salt, sys.Str.type$)) {
      (salt = sys.Buf.fromBase64(sys.ObjUtil.coerce(salt, sys.Str.type$)));
    }
    else {
      if (!sys.ObjUtil.is(salt, sys.Buf.type$)) {
        throw sys.ArgErr.make("salt must be base64 encoded Str, or Buf");
      }
      ;
    }
    ;
    let key = ScramKey.make(hash, sys.ObjUtil.coerce(salt, sys.Buf.type$), c);
    key.toSecret(password);
    return key;
  }

  static make(hashFunc,salt,c) {
    const $self = new ScramKey();
    ScramKey.make$($self,hashFunc,salt,c);
    return $self;
  }

  static make$($self,hashFunc,salt,c) {
    $self.#hashFunc = hashFunc;
    $self.#salt = salt;
    $self.#c = c;
    return;
  }

  toAuthMsg() {
    return AuthMsg.make("scram", sys.Map.__fromLiteral(["hash","salt","c"], [this.#hashFunc,this.#salt.toBase64Uri(),sys.Int.toStr(this.#c)], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

  toSecret(password) {
    if (sys.Str.isEmpty(password)) {
      throw sys.Err.make("Scram scheme password cannot be empty");
    }
    ;
    let pbk = sys.Str.plus("PBKDF2WithHmac", sys.Str.replace(this.#hashFunc, "-", ""));
    let keyBytes = sys.Int.div(ScramKey.keyBits(this.#hashFunc), 8);
    this.saltedPassword(sys.Buf.pbk(pbk, password, this.#salt, this.#c, keyBytes));
    return this.saltedPassword().toBase64Uri();
  }

  static keyBits(hash) {
    let $_u24 = sys.Str.upper(hash);
    if (sys.ObjUtil.equals($_u24, "SHA-1")) {
      return 160;
    }
    else if (sys.ObjUtil.equals($_u24, "SHA-256")) {
      return 256;
    }
    else if (sys.ObjUtil.equals($_u24, "SHA-512")) {
      return 512;
    }
    else {
      throw sys.ArgErr.make(sys.Str.plus("Unsupported hash function: ", hash));
    }
    ;
  }

}

class Folio2Scheme extends AuthScheme {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Folio2Scheme.type$; }

  static make() {
    const $self = new Folio2Scheme();
    Folio2Scheme.make$($self);
    return $self;
  }

  static make$($self) {
    AuthScheme.make$($self, "folio2");
    return;
  }

  onServer(cx,msg) {
    throw sys.UnsupportedErr.make();
  }

  onClient(cx,msg) {
    throw sys.UnsupportedErr.make();
  }

  onClientNonStd(cx,c,content) {
    let header = c.resHeaders().get("Folio-Auth-Api-Uri");
    if (header == null) {
      return false;
    }
    ;
    let authUri = this.toAuthUri(cx, sys.ObjUtil.coerce(header, sys.Str.type$));
    let authInfo = this.readAuthInfo(cx, authUri);
    let digest = this.computeDigest(cx, authInfo);
    let cookie = this.authenticate(cx, authUri, authInfo, digest);
    cx.headers().set("Cookie", cookie);
    return true;
  }

  toAuthUri(cx,header) {
    return cx.uri().plus(sys.Str.toUri(header)).plus(sys.Str.toUri(sys.Str.plus("?", cx.user())));
  }

  readAuthInfo(cx,authUri) {
    let c = cx.prepare(web.WebClient.make(authUri));
    let response = cx.get(c);
    return this.parseAuthProps(sys.ObjUtil.coerce(response, sys.Str.type$));
  }

  computeDigest(cx,authInfo) {
    let user = cx.user();
    let pass = cx.pass();
    let nonce = ((this$) => { let $_u25 = authInfo.get("nonce"); if ($_u25 != null) return $_u25; throw cx.err("Missing 'nonce' in auth info"); })(this);
    let salt = ((this$) => { let $_u26 = authInfo.get("userSalt"); if ($_u26 != null) return $_u26; throw cx.err("Missing 'userSalt' in auth info"); })(this);
    let hmac = sys.ObjUtil.coerce(sys.Buf.make().print(sys.Str.plus(sys.Str.plus(sys.Str.plus("", user), ":"), salt)), sys.Buf.type$.toNullable()).hmac("SHA-1", sys.Str.toBuf(pass)).toBase64();
    return sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", hmac), ":"), nonce)).toDigest("SHA-1").toBase64();
  }

  authenticate(cx,authUri,authInfo,digest) {
    let c = cx.prepare(web.WebClient.make(authUri));
    let nonce = authInfo.get("nonce");
    let req = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("nonce:", nonce), "\ndigest:"), digest), "\n");
    if (sys.ObjUtil.equals(authInfo.get("onAuthEnabled"), "true")) {
      req = sys.Str.plus(req, sys.Str.plus(sys.Str.plus("password:", cx.pass()), "\n"));
    }
    ;
    let response = cx.post(c, req);
    if (sys.ObjUtil.compareNE(c.resCode(), 200)) {
      throw cx.err("Authentication failed");
    }
    ;
    let info = this.parseAuthProps(sys.ObjUtil.coerce(response, sys.Str.type$));
    return sys.ObjUtil.coerce(((this$) => { let $_u27 = info.get("cookie"); if ($_u27 != null) return $_u27; throw cx.err("Missing 'cookie'"); })(this), sys.Str.type$);
  }

  parseAuthProps(text) {
    const this$ = this;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    sys.Str.splitLines(text).each((line) => {
      (line = sys.Str.trim(line));
      if (sys.Str.isEmpty(line)) {
        return;
      }
      ;
      let colon = sys.Str.index(line, ":");
      map.set(sys.Str.trim(sys.Str.getRange(line, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true))), sys.Str.trim(sys.Str.getRange(line, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), -1))));
      return;
    });
    return map;
  }

}

class AuthMsgTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AuthMsgTest.type$; }

  testEncoding() {
    const this$ = this;
    this.verifyEq(AuthMsg.fromStr("foo"), AuthMsg.fromStr("foo"));
    this.verifyEq(AuthMsg.fromStr("a x=y"), AuthMsg.fromStr("a x=y"));
    this.verifyEq(AuthMsg.fromStr("a i=j, x=y"), AuthMsg.fromStr("a i=j, x=y"));
    this.verifyEq(AuthMsg.fromStr("a i=j, x=y"), AuthMsg.fromStr("a x=y ,i=j"));
    this.verifyNotEq(AuthMsg.fromStr("foo"), AuthMsg.fromStr("bar"));
    this.verifyNotEq(AuthMsg.fromStr("foo"), AuthMsg.fromStr("foo k=v"));
    let q = AuthMsg.fromStr("foo alpha=beta, gamma=delta");
    this.verifyEq(q.scheme(), "foo");
    this.verifyEq(q.param("alpha"), "beta");
    this.verifyEq(q.param("Alpha"), "beta");
    this.verifyEq(q.param("ALPHA"), "beta");
    this.verifyEq(q.param("Gamma"), "delta");
    this.verifyEq(AuthMsg.fromStr("foo alpha \t = \t beta"), AuthMsg.make("foo", sys.Map.__fromLiteral(["alpha"], ["beta"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(AuthMsg.fromStr("foo a=b, c = d, e=f, g=h"), AuthMsg.make("foo", sys.Map.__fromLiteral(["a","c","e","g"], ["b","d","f","h"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(AuthMsg.fromStr("foo a=b, c = d, e=f, g=h"), AuthMsg.make("foo", sys.Map.__fromLiteral(["g","e","c","a"], ["h","f","d","b"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    this.verifyEq(AuthMsg.fromStr("foo g=h, c = d, e=f,  a = b").toStr(), "foo a=b, c=d, e=f, g=h");
    this.verifyEncoding(sys.Map.__fromLiteral(["salt","hash"], ["abc012","sha-1"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyEncoding(sys.Map.__fromLiteral(["salt","hash","foo"], ["azAZ09!#\$%&'*+-.^_`~","sha-1","bar"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.verifyErr(sys.Err.type$, (it) => {
      let x = AuthMsg.make("hmac", sys.Map.__fromLiteral(["salt","hash"], ["a=b","sha-1"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      let x = AuthMsg.make("hmac", sys.Map.__fromLiteral(["salt","hash","bad/key"], ["abc","sha-1","val"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      let x = AuthMsg.make("(bad)", sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      let x = AuthMsg.make("ok", sys.Map.__fromLiteral(["key"], ["val not good"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      let x = AuthMsg.make("ok", sys.Map.__fromLiteral(["key not good"], ["val"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = AuthMsg.fromStr("(bad)");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = AuthMsg.fromStr("hmac foo");
      return;
    });
    this.verifyErr(sys.ParseErr.type$, (it) => {
      let x = AuthMsg.fromStr("hmac foo=bar xxx");
      return;
    });
    return;
  }

  verifyEncoding(params) {
    let a = AuthMsg.make("hmac", params);
    this.verifyEq(a.scheme(), "hmac");
    this.verifyEq(a.params(), params);
    this.verifySame(a.toStr(), a.toStr());
    let b = AuthMsg.fromStr(a.toStr());
    this.verifyEq(b.scheme(), "hmac");
    this.verifyEq(b.params(), params);
    this.verifyEq(a, b);
    return;
  }

  testSplitList() {
    this.verifySplitList("a,b", sys.List.make(sys.Str.type$, ["a", "b"]));
    this.verifySplitList("a \t,  b", sys.List.make(sys.Str.type$, ["a", "b"]));
    this.verifySplitList("a, b, c", sys.List.make(sys.Str.type$, ["a", "b", "c"]));
    this.verifySplitList("a b=c", sys.List.make(sys.Str.type$, ["a b=c"]));
    this.verifySplitList("a b=c, d=e", sys.List.make(sys.Str.type$, ["a b=c,d=e"]));
    this.verifySplitList("a b=c, d=e \t,\t f=g", sys.List.make(sys.Str.type$, ["a b=c,d=e,f=g"]));
    this.verifySplitList("a b=c, d=e, f g=h", sys.List.make(sys.Str.type$, ["a b=c,d=e", "f g=h"]));
    this.verifySplitList("a b=c, d=e, f, g h=i,j=k", sys.List.make(sys.Str.type$, ["a b=c,d=e", "f", "g h=i,j=k"]));
    return;
  }

  verifySplitList(s,expected) {
    this.verifyEq(AuthMsg.splitList(s), expected);
    let msgs = AuthMsg.listFromStr(s);
    this.verifyEq(sys.ObjUtil.coerce(msgs.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    return;
  }

  testListFromStr() {
    let a = AuthMsg.make("hmac", HmacScheme.gen());
    let b = AuthMsg.make("hmac", HmacScheme.gen());
    let c = AuthMsg.make("hmac", HmacScheme.gen());
    this.verifyNotEq(a, b);
    this.verifyNotEq(a, c);
    this.verifyListFromStr(sys.Str.plus("", a), sys.List.make(AuthMsg.type$, [a]));
    this.verifyListFromStr(sys.Str.plus(sys.Str.plus(sys.Str.plus("", a), ","), b), sys.List.make(AuthMsg.type$, [a, b]));
    this.verifyListFromStr(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", a), " , "), b), " \t,\t "), c), sys.List.make(AuthMsg.type$, [a, b, c]));
    return;
  }

  verifyListFromStr(s,expected) {
    const this$ = this;
    let actual = AuthMsg.listFromStr(s);
    this.verifyEq(sys.ObjUtil.coerce(actual.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    actual.each((a,i) => {
      this$.verifyEq(a, expected.get(i));
      return;
    });
    return;
  }

  static make() {
    const $self = new AuthMsgTest();
    AuthMsgTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class RoundtripTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RoundtripTest.type$; }

  static #clientLevel = undefined;

  static clientLevel() {
    if (RoundtripTest.#clientLevel === undefined) {
      RoundtripTest.static$init();
      if (RoundtripTest.#clientLevel === undefined) RoundtripTest.#clientLevel = null;
    }
    return RoundtripTest.#clientLevel;
  }

  static #serverLevel = undefined;

  static serverLevel() {
    if (RoundtripTest.#serverLevel === undefined) {
      RoundtripTest.static$init();
      if (RoundtripTest.#serverLevel === undefined) RoundtripTest.#serverLevel = null;
    }
    return RoundtripTest.#serverLevel;
  }

  #wisp = null;

  wisp(it) {
    if (it === undefined) {
      return this.#wisp;
    }
    else {
      this.#wisp = it;
      return;
    }
  }

  #port = 0;

  port(it) {
    if (it === undefined) {
      return this.#port;
    }
    else {
      this.#port = it;
      return;
    }
  }

  test() {
    this.openServer();
    this.verifyAccount("sally");
    this.verifyAccount("holden");
    this.verifyAccount("peter");
    this.verifyAccount("xavier");
    this.verifyAuthBearer();
    this.closeServer();
    return;
  }

  verifyAccount(user) {
    this.verifyBad(user, "bad-one");
    this.verifyGood(user, sys.Str.plus("pass-", user));
    return;
  }

  verifyAuthBearer() {
    const this$ = this;
    let user = "auth-bearer-token";
    this.verifyGood(user, sys.Str.plus("tok-", user));
    this.verifyErr(sys.IOErr.type$, (it) => {
      let cx = this$.openClient(user, sys.Str.plus("bad-", user));
      let testBody = sys.Str.plus("test", sys.ObjUtil.coerce(sys.Range.make(0, 100).random(), sys.Obj.type$.toNullable()));
      let c = cx.prepare(web.WebClient.make(cx.uri().plus(sys.Str.toUri(sys.Str.plus("?", testBody)))));
      c.getStr();
      return;
    });
    return;
  }

  verifyBad(user,pass) {
    const this$ = this;
    this.verifyErr(AuthErr.type$, (it) => {
      this$.openClient(user, pass);
      return;
    });
    return;
  }

  verifyGood(user,pass) {
    let cx = this.openClient(user, pass);
    this.verify(cx.isAuthenticated());
    let testBody = sys.Str.plus("test", sys.ObjUtil.coerce(sys.Range.make(0, 100).random(), sys.Obj.type$.toNullable()));
    let c = cx.prepare(web.WebClient.make(cx.uri().plus(sys.Str.toUri(sys.Str.plus("?", testBody)))));
    if (sys.Str.startsWith(user, "b")) {
      this.verifyEq(c.reqHeaders().get("Authorization"), sys.Str.plus("Basic ", sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", user), ":"), pass)).toBase64()));
    }
    else {
      this.verifyEq(c.reqHeaders().get("Authorization"), sys.Str.plus("bearer authToken=tok-", user));
    }
    ;
    this.verifyEq(c.getStr(), testBody);
    return;
  }

  openServer() {
    this.#wisp = sys.ObjUtil.coerce(sys.Slot.findMethod("wisp::WispService.testSetup").call(TestMod.make()), sys.Service.type$.toNullable());
    this.#wisp.start();
    this.#port = sys.ObjUtil.coerce(sys.ObjUtil.trap(this.#wisp,"httpPort", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$);
    return;
  }

  closeServer() {
    this.#wisp.stop();
    return;
  }

  openClient(user,pass) {
    const this$ = this;
    return AuthClientContext.open(sys.Str.toUri(sys.Str.plus(sys.Str.plus("http://localhost:", sys.ObjUtil.coerce(this.#port, sys.Obj.type$.toNullable())), "/")), user, pass, sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Log.get("client"), (it) => {
      it.level(RoundtripTest.clientLevel());
      return;
    }), sys.Log.type$));
  }

  static make() {
    const $self = new RoundtripTest();
    RoundtripTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

  static static$init() {
    RoundtripTest.#clientLevel = sys.LogLevel.info();
    RoundtripTest.#serverLevel = sys.LogLevel.info();
    return;
  }

}

class TestMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TestMod.type$; }

  onService() {
    let cx = TestServerContext.make();
    let user = cx.onService(this.req(), this.res());
    if (user == null) {
      return;
    }
    ;
    this.res().headers().set("Content-Type", "text/plain");
    this.res().out().w(this.req().uri().queryStr());
    return;
  }

  static make() {
    const $self = new TestMod();
    TestMod.make$($self);
    return $self;
  }

  static make$($self) {
    web.WebMod.make$($self);
    return;
  }

}

class TestServerContext extends AuthServerContext {
  constructor() {
    super();
    const this$ = this;
    this.#log = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Log.get("server"), (it) => {
      it.level(RoundtripTest.serverLevel());
      return;
    }), sys.Log.type$);
    return;
  }

  typeof() { return TestServerContext.type$; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  login() {
    return sys.Str.plus("tok-", this.user().username());
  }

  sessionByAuthToken(authToken) {
    if (!sys.Str.startsWith(authToken, "tok-")) {
      return null;
    }
    ;
    return this.userByUsername(sys.Str.getRange(authToken, sys.Range.make(4, -1)));
  }

  userSecret() {
    return sys.ObjUtil.coerce(this.userByUsername(this.user().username()), TestAuthUser.type$).secret();
  }

  userByUsername(username) {
    let $_u28 = sys.Str.get(username, 0);
    if (sys.ObjUtil.equals($_u28, 97) || sys.ObjUtil.equals($_u28, 115)) {
      return this.toScramUser(username);
    }
    else if (sys.ObjUtil.equals($_u28, 104)) {
      return this.toHmacUser(username);
    }
    else if (sys.ObjUtil.equals($_u28, 98)) {
      return this.toBasicUser(username);
    }
    else if (sys.ObjUtil.equals($_u28, 112)) {
      return this.toPlaintextUser(username);
    }
    else if (sys.ObjUtil.equals($_u28, 120)) {
      return this.toPlaintextUser(username, "x-plaintext");
    }
    else {
      return null;
    }
    ;
  }

  toScramUser(user) {
    let pass = sys.Str.plus("pass-", user);
    let salt = sys.Str.plus("salt-", user);
    let scram = ScramKey.gen(sys.Map.__fromLiteral(["hash","salt","c"], ["SHA-256",sys.Str.toBuf(salt),sys.ObjUtil.coerce(100, sys.Obj.type$)], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let msg = scram.toAuthMsg();
    return TestAuthUser.make(user, msg.scheme(), msg.params(), scram.toSecret(pass));
  }

  toHmacUser(user) {
    let pass = sys.Str.plus("pass-", user);
    let salt = sys.Str.plus("salt-", user);
    let salt64 = sys.Buf.fromBase64(salt).toBase64();
    let hash = "SHA-1";
    let secret = sys.Str.toBuf(sys.Str.plus(sys.Str.plus(sys.Str.plus("", user), ":"), salt64)).hmac(hash, sys.Str.toBuf(pass)).toBase64();
    return TestAuthUser.make(user, "hmac", sys.Map.__fromLiteral(["salt","hash"], [salt,hash], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), secret);
  }

  toBasicUser(user) {
    let pass = sys.Str.plus("pass-", user);
    return TestAuthUser.make(user, "basic", sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]")), pass);
  }

  toPlaintextUser(user,scheme) {
    if (scheme === undefined) scheme = "plaintext";
    let secret = sys.Str.plus("pass-", user);
    return TestAuthUser.make(user, scheme, sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]")), secret);
  }

  static make() {
    const $self = new TestServerContext();
    TestServerContext.make$($self);
    return $self;
  }

  static make$($self) {
    AuthServerContext.make$($self);
    ;
    return;
  }

}

class TestAuthUser extends AuthUser {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TestAuthUser.type$; }

  #secret = null;

  secret() { return this.#secret; }

  __secret(it) { if (it === undefined) return this.#secret; else this.#secret = it; }

  static make(u,s,p,x) {
    const $self = new TestAuthUser();
    TestAuthUser.make$($self,u,s,p,x);
    return $self;
  }

  static make$($self,u,s,p,x) {
    AuthUser.make$($self, u, s, p);
    $self.#secret = x;
    return;
  }

}

const p = sys.Pod.add$('auth');
const xp = sys.Param.noParams$();
let m;
AuthMsg.type$ = p.at$('AuthMsg','sys::Obj',[],{'sys::Js':""},8194,AuthMsg);
AuthErr.type$ = p.at$('AuthErr','sys::Err',[],{},8194,AuthErr);
AuthClientContext.type$ = p.at$('AuthClientContext','sys::Obj',['haystack::HaystackClientAuth'],{},8192,AuthClientContext);
AuthServerContext.type$ = p.at$('AuthServerContext','sys::Obj',[],{},8193,AuthServerContext);
AuthUser.type$ = p.at$('AuthUser','sys::Obj',[],{},8194,AuthUser);
AuthScheme.type$ = p.at$('AuthScheme','sys::Obj',[],{},8195,AuthScheme);
AuthSchemeRegistry.type$ = p.at$('AuthSchemeRegistry','sys::Obj',[],{},130,AuthSchemeRegistry);
AuthUtil.type$ = p.at$('AuthUtil','sys::Obj',[],{'sys::NoDoc':""},8194,AuthUtil);
BasicScheme.type$ = p.at$('BasicScheme','auth::AuthScheme',[],{},8194,BasicScheme);
PlaintextScheme.type$ = p.at$('PlaintextScheme','auth::AuthScheme',[],{},8194,PlaintextScheme);
XPlaintextScheme.type$ = p.at$('XPlaintextScheme','auth::PlaintextScheme',[],{'sys::NoDoc':""},8194,XPlaintextScheme);
HmacScheme.type$ = p.at$('HmacScheme','auth::AuthScheme',[],{},8194,HmacScheme);
ScramScheme.type$ = p.at$('ScramScheme','auth::AuthScheme',[],{},8194,ScramScheme);
ScramKey.type$ = p.at$('ScramKey','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8192,ScramKey);
Folio2Scheme.type$ = p.at$('Folio2Scheme','auth::AuthScheme',[],{},8194,Folio2Scheme);
AuthMsgTest.type$ = p.at$('AuthMsgTest','sys::Test',[],{},8192,AuthMsgTest);
RoundtripTest.type$ = p.at$('RoundtripTest','sys::Test',[],{},8192,RoundtripTest);
TestMod.type$ = p.at$('TestMod','web::WebMod',[],{},130,TestMod);
TestServerContext.type$ = p.at$('TestServerContext','auth::AuthServerContext',[],{},128,TestServerContext);
TestAuthUser.type$ = p.at$('TestAuthUser','auth::AuthUser',[],{},130,TestAuthUser);
AuthMsg.type$.af$('scheme',73730,'sys::Str',{}).af$('params',73730,'[sys::Str:sys::Str]',{}).af$('toStr',336898,'sys::Str',{}).am$('listFromStr',40962,'auth::AuthMsg[]',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('fromStr',40966,'auth::AuthMsg?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('scheme','sys::Str',false),new sys.Param('params','[sys::Str:sys::Str]',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('param',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('paramsToStr',8192,'sys::Str',xp,{}).am$('splitList',32898,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('decode',34818,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('encode',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('scheme','sys::Str',false),new sys.Param('params','[sys::Str:sys::Str]',false)]),{}).am$('addToken',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::StrBuf',false),new sys.Param('val','sys::Str',false)]),{});
AuthErr.type$.af$('resMsg',73730,'sys::Str',{}).af$('resCode',73730,'sys::Int',{}).am$('makeUnknownUser',40962,'auth::AuthErr',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false)]),{}).am$('makeInvalidPassword',40962,'auth::AuthErr',xp,{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('makeRes',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('debugMsg','sys::Str',false),new sys.Param('resMsg','sys::Str',false),new sys.Param('resCode','sys::Int',true)]),{});
AuthClientContext.type$.af$('uri',73730,'sys::Uri',{}).af$('user',73730,'sys::Str',{}).af$('pass',73728,'sys::Str?',{}).af$('log',73730,'sys::Log',{}).af$('userAgent',73730,'sys::Str?',{}).af$('socketConfig',73730,'inet::SocketConfig',{}).af$('headers',73728,'[sys::Str:sys::Str]',{}).af$('isAuthenticated',73728,'sys::Bool',{}).af$('stash',73728,'[sys::Str:sys::Obj?]',{}).af$('debugCounter',106498,'concurrent::AtomicInt',{}).am$('open',40962,'auth::AuthClientContext',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('user','sys::Str',false),new sys.Param('pass','sys::Str',false),new sys.Param('log','sys::Log',false),new sys.Param('socketConfig','inet::SocketConfig',true)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('doOpen',2048,'sys::This',xp,{}).am$('resHeader',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false),new sys.Param('name','sys::Str',false)]),{}).am$('err',8192,'auth::AuthErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('success',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false)]),{}).am$('addCookiesToHeaders',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false)]),{}).am$('openBearer',2048,'sys::Bool',xp,{}).am$('openStd',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false)]),{}).am$('prepare',271360,'web::WebClient',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false)]),{}).am$('get',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false)]),{}).am$('post',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false),new sys.Param('content','sys::Str',false)]),{}).am$('send',2048,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false),new sys.Param('post','sys::Str?',false)]),{}).am$('debugReq',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('log','sys::Log?',false),new sys.Param('c','web::WebClient',false),new sys.Param('content','sys::Str?',true)]),{}).am$('debugRes',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('log','sys::Log?',false),new sys.Param('count','sys::Int',false),new sys.Param('c','web::WebClient',false),new sys.Param('content','sys::Str?',true)]),{}).am$('main',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
AuthServerContext.type$.af$('user',73728,'auth::AuthUser?',{}).af$('req',73728,'web::WebReq?',{}).af$('res',73728,'web::WebRes?',{}).af$('isDebug',73728,'sys::Bool',{}).af$('debugCounter',106498,'concurrent::AtomicInt',{}).af$('debugCount',67584,'sys::Int',{}).af$('debugBuf',67584,'sys::StrBuf?',{}).af$('debugStep',67584,'sys::Int',{}).am$('log',270337,'sys::Log',xp,{}).am$('userByUsername',270337,'auth::AuthUser?',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false)]),{}).am$('sessionByAuthToken',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('authToken','sys::Str',false)]),{}).am$('userSecret',270337,'sys::Str?',xp,{}).am$('authSecret',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('secret','sys::Str',false)]),{}).am$('login',270337,'sys::Str',xp,{}).am$('onAuthErr',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','auth::AuthErr',false)]),{}).am$('onService',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('handleBearer',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('reqMsg','auth::AuthMsg',false)]),{}).am$('handleScheme',266240,'auth::AuthMsg?',sys.List.make(sys.Param.type$,[new sys.Param('schemeName','sys::Str',false),new sys.Param('reqMsg','auth::AuthMsg',false)]),{}).am$('addSecResHeaders',266240,'sys::Void',xp,{}).am$('sendRes',128,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('res','web::WebRes',false),new sys.Param('code','sys::Int',false),new sys.Param('msg','sys::Str',false)]),{}).am$('debug',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('debugReq',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false)]),{}).am$('debugRes',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('res','web::WebRes',false),new sys.Param('code','sys::Int',false),new sys.Param('msg','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
AuthUser.type$.af$('username',73730,'sys::Str',{}).af$('scheme',73730,'sys::Str',{}).af$('params',73730,'[sys::Str:sys::Str]',{}).am$('genFake',40962,'auth::AuthUser',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false)]),{'sys::NoDoc':""}).am$('makeMsg',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false),new sys.Param('msg','auth::AuthMsg',false)]),{'sys::NoDoc':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false),new sys.Param('scheme','sys::Str',false),new sys.Param('params','[sys::Str:sys::Str]',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('param',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
AuthScheme.type$.af$('registryRef',100354,'concurrent::AtomicRef',{}).af$('name',73730,'sys::Str',{}).am$('list',40962,'auth::AuthScheme[]',xp,{}).am$('find',40962,'auth::AuthScheme?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('registry',34818,'auth::AuthSchemeRegistry',xp,{}).am$('make',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('onServer',270337,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthServerContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onClient',270337,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onClientSuccess',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onClientNonStd',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('c','web::WebClient',false),new sys.Param('content','sys::Str?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
AuthSchemeRegistry.type$.af$('list',73730,'auth::AuthScheme[]',{}).af$('byName',73730,'[sys::Str:auth::AuthScheme]',{}).am$('make',8196,'sys::Void',xp,{}).am$('find',8192,'auth::AuthScheme?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
AuthUtil.type$.af$('dummyRand',100354,'sys::Str',{}).af$('nonceMask',106498,'sys::Int',{}).am$('toBase64',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false)]),{}).am$('fromBase64',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('genSalt',40962,'sys::Str',xp,{}).am$('dummySalt',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false)]),{}).am$('genNonce',40962,'sys::Str',xp,{}).am$('verifyNonce',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('nonce','sys::Str',false)]),{}).am$('authToken',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false)]),{}).am$('realIp',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
BasicScheme.type$.am$('make',8196,'sys::Void',xp,{}).am$('onServer',271360,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthServerContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onClient',271360,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('use',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false),new sys.Param('content','sys::Str?',false)]),{}).am$('onClientNonStd',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('c','web::WebClient',false),new sys.Param('content','sys::Str?',false)]),{});
PlaintextScheme.type$.am$('make',8196,'sys::Void',xp,{}).am$('makeScheme',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('onClient',271360,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onServer',271360,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthServerContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{});
XPlaintextScheme.type$.am$('make',8196,'sys::Void',xp,{});
HmacScheme.type$.am$('gen',40962,'[sys::Str:sys::Str]',xp,{}).am$('make',8196,'sys::Void',xp,{}).am$('onClient',271360,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onServer',271360,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthServerContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('hmac',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false),new sys.Param('pass','sys::Str',false),new sys.Param('salt','sys::Str',false),new sys.Param('hash','sys::Str',true)]),{});
ScramScheme.type$.af$('clientNonceBytes',100354,'sys::Int',{}).af$('gs2_header',100354,'sys::Str',{}).am$('make',8196,'sys::Void',xp,{}).am$('onClientSuccess',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onClient',271360,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('sendClientFirstMessage',2048,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('sendClientFinalMessage',2048,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onServer',271360,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthServerContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onClientFirstMessage',2048,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthServerContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onClientFinalMessage',2048,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthServerContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('injectHandshakeToken',34818,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('msg','auth::AuthMsg',false),new sys.Param('params','[sys::Str:sys::Str]',false)]),{}).am$('decodeMsg',34818,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('xor',34818,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Buf',false),new sys.Param('b','sys::Buf',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ScramKey.type$.af$('hashFunc',73730,'sys::Str',{}).af$('salt',73728,'sys::Buf',{}).af$('c',73730,'sys::Int',{}).af$('saltedPassword',65664,'sys::Buf?',{}).af$('clientKey',65664,'sys::Buf?',{}).af$('storedKey',65664,'sys::Buf?',{}).af$('serverKey',65664,'sys::Buf?',{}).am$('gen',40966,'auth::ScramKey?',sys.List.make(sys.Param.type$,[new sys.Param('config','[sys::Str:sys::Obj?]',true)]),{}).am$('fromAuthMsg',40962,'auth::ScramKey',sys.List.make(sys.Param.type$,[new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('compute',40962,'auth::ScramKey',sys.List.make(sys.Param.type$,[new sys.Param('password','sys::Str',false),new sys.Param('hash','sys::Str',false),new sys.Param('salt','sys::Obj',false),new sys.Param('c','sys::Int',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('hashFunc','sys::Str',false),new sys.Param('salt','sys::Buf',false),new sys.Param('c','sys::Int',false)]),{}).am$('toAuthMsg',8192,'auth::AuthMsg',xp,{}).am$('toSecret',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('password','sys::Str',false)]),{}).am$('keyBits',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('hash','sys::Str',false)]),{});
Folio2Scheme.type$.am$('make',8196,'sys::Void',xp,{}).am$('onServer',271360,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthServerContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onClient',271360,'auth::AuthMsg',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('onClientNonStd',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('c','web::WebClient',false),new sys.Param('content','sys::Str?',false)]),{}).am$('toAuthUri',2048,'sys::Uri',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('header','sys::Str',false)]),{}).am$('readAuthInfo',2048,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('authUri','sys::Uri',false)]),{}).am$('computeDigest',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('authInfo','[sys::Str:sys::Str]',false)]),{}).am$('authenticate',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('cx','auth::AuthClientContext',false),new sys.Param('authUri','sys::Uri',false),new sys.Param('authInfo','[sys::Str:sys::Str]',false),new sys.Param('digest','sys::Str',false)]),{}).am$('parseAuthProps',2048,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('text','sys::Str',false)]),{});
AuthMsgTest.type$.am$('testEncoding',8192,'sys::Void',xp,{}).am$('verifyEncoding',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('params','[sys::Str:sys::Str]',false)]),{}).am$('testSplitList',8192,'sys::Void',xp,{}).am$('verifySplitList',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('expected','sys::Str[]',false)]),{}).am$('testListFromStr',8192,'sys::Void',xp,{}).am$('verifyListFromStr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('expected','auth::AuthMsg[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
RoundtripTest.type$.af$('clientLevel',106498,'sys::LogLevel',{}).af$('serverLevel',106498,'sys::LogLevel',{}).af$('wisp',73728,'sys::Service?',{}).af$('port',73728,'sys::Int',{}).am$('test',8192,'sys::Void',xp,{}).am$('verifyAccount',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false)]),{}).am$('verifyAuthBearer',8192,'sys::Void',xp,{}).am$('verifyBad',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false),new sys.Param('pass','sys::Str',false)]),{}).am$('verifyGood',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false),new sys.Param('pass','sys::Str',false)]),{}).am$('openServer',8192,'sys::Void',xp,{}).am$('closeServer',8192,'sys::Void',xp,{}).am$('openClient',8192,'auth::AuthClientContext',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false),new sys.Param('pass','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
TestMod.type$.am$('onService',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
TestServerContext.type$.af$('log',336898,'sys::Log',{}).am$('login',271360,'sys::Str',xp,{}).am$('sessionByAuthToken',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('authToken','sys::Str',false)]),{}).am$('userSecret',271360,'sys::Str?',xp,{}).am$('userByUsername',271360,'auth::AuthUser?',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false)]),{}).am$('toScramUser',2048,'auth::AuthUser',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false)]),{}).am$('toHmacUser',2048,'auth::AuthUser',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false)]),{}).am$('toBasicUser',2048,'auth::AuthUser',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false)]),{}).am$('toPlaintextUser',2048,'auth::AuthUser',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false),new sys.Param('scheme','sys::Str',true)]),{}).am$('make',139268,'sys::Void',xp,{});
TestAuthUser.type$.af$('secret',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('u','sys::Str',false),new sys.Param('s','sys::Str',false),new sys.Param('p','[sys::Str:sys::Str]',false),new sys.Param('x','sys::Str',false)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "auth");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;inet 1.0;web 1.0;haystack 3.1.11");
m.set("pod.summary", "Authentication framework");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:25-05:00 New_York");
m.set("build.tsKey", "241210143125");
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
  AuthMsg,
  AuthErr,
  AuthClientContext,
  AuthServerContext,
  AuthUser,
  AuthScheme,
  AuthUtil,
  BasicScheme,
  PlaintextScheme,
  XPlaintextScheme,
  HmacScheme,
  ScramScheme,
  ScramKey,
  Folio2Scheme,
  AuthMsgTest,
  RoundtripTest,
};
