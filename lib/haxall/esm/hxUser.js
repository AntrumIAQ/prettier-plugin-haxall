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
import * as web from './web.js'
import * as compilerDoc from './compilerDoc.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as auth from './auth.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as defc from './defc.js'
import * as folio from './folio.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class HxUserLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
    this.#web = HxUserWeb.make(this);
    this.#sessions = HxUserSessions.make(this);
    this.#noAuth = this.rt().config().has("noAuth");
    this.#loginUri = this.#web.uri().plus(sys.Uri.fromStr("login"));
    this.#logoutUri = this.#web.uri().plus(sys.Uri.fromStr("logout"));
    this.#cookieNameRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return HxUserLib.type$; }

  #web = null;

  web() { return this.#web; }

  __web(it) { if (it === undefined) return this.#web; else this.#web = it; }

  #sessions = null;

  sessions() { return this.#sessions; }

  __sessions(it) { if (it === undefined) return this.#sessions; else this.#sessions = it; }

  #noAuth = false;

  noAuth() { return this.#noAuth; }

  __noAuth(it) { if (it === undefined) return this.#noAuth; else this.#noAuth = it; }

  #loginUri = null;

  loginUri() { return this.#loginUri; }

  __loginUri(it) { if (it === undefined) return this.#loginUri; else this.#loginUri = it; }

  #logoutUri = null;

  logoutUri() { return this.#logoutUri; }

  __logoutUri(it) { if (it === undefined) return this.#logoutUri; else this.#logoutUri = it; }

  #cookieNameRef = null;

  // private field reflection only
  __cookieNameRef(it) { if (it === undefined) return this.#cookieNameRef; else this.#cookieNameRef = it; }

  rec() {
    return sys.ObjUtil.coerce(hx.HxLib.prototype.rec.call(this), HxUserSettings.type$);
  }

  cookieName() {
    return sys.ObjUtil.coerce(this.#cookieNameRef.val(), sys.Str.type$);
  }

  services() {
    return sys.List.make(HxUserLib.type$, [this]);
  }

  read(username,checked) {
    if (checked === undefined) checked = true;
    let rec = ((this$) => { if (sys.ObjUtil.is(username, haystack.Ref.type$)) return this$.rt().db().readById(sys.ObjUtil.coerce(username, haystack.Ref.type$.toNullable()), false); return this$.rt().db().read(haystack.Filter.eq("username", sys.ObjUtil.toStr(username)).and(haystack.Filter.has("user")), false); })(this);
    if (rec != null) {
      return HxUserImpl.make(sys.ObjUtil.coerce(rec, haystack.Dict.type$));
    }
    ;
    if (checked) {
      throw haystack.UnknownRecErr.make(sys.Str.plus("User not found: ", username));
    }
    ;
    return null;
  }

  authenticate(req,res) {
    return HxUserAuth.make(this, req, res).authenticate();
  }

  closeSession(session) {
    this.#sessions.close(sys.ObjUtil.coerce(session, HxUserSession.type$));
    return;
  }

  makeSyntheticUser(username,extra) {
    if (extra === undefined) extra = null;
    const this$ = this;
    let extraTags = haystack.Etc.makeDict(extra);
    let tags = sys.Map.__fromLiteral(["id","username","userRole","mod","synthetic"], [haystack.Ref.fromStr(username),username,"admin",sys.DateTime.nowUtc(),haystack.Marker.val()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    extraTags.each((v,n) => {
      tags.set(n, v);
      return;
    });
    return HxUserImpl.make(haystack.Etc.makeDict(tags));
  }

  login(req,res,user) {
    let session = this.#sessions.open(req, user);
    this.addSessionCookie(req, res, session);
    return session;
  }

  addSessionCookie(req,res,session) {
    let overrides = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Field"), sys.Type.find("sys::Obj?"));
    overrides.set(web.Cookie.type$.slot("sameSite"), null);
    if (sys.ObjUtil.equals(this.rt().http().siteUri().scheme(), "https")) {
      overrides.set(web.Cookie.type$.slot("secure"), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    }
    ;
    let cookie = web.Cookie.makeSession(this.cookieName(), session.key(), overrides);
    res.cookies().clear();
    res.cookies().add(cookie);
    return;
  }

  onStart() {
    this.#cookieNameRef.val(sys.Str.plus("hx-session-", sys.ObjUtil.coerce(((this$) => { let $_u1 = this$.rt().http().siteUri().port(); if ($_u1 != null) return $_u1; return sys.ObjUtil.coerce(80, sys.Int.type$.toNullable()); })(this), sys.Obj.type$.toNullable())));
    return;
  }

  houseKeepingFreq() {
    return sys.Duration.fromStr("17sec");
  }

  onHouseKeeping() {
    this.#sessions.onHouseKeeping();
    return;
  }

  static make() {
    const $self = new HxUserLib();
    HxUserLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    ;
    return;
  }

}

class HxUserWeb extends hx.HxLibWeb {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxUserWeb.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  static make(lib) {
    const $self = new HxUserWeb();
    HxUserWeb.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    hx.HxLibWeb.make$($self, lib);
    $self.#lib = lib;
    return;
  }

  onService() {
    let route = this.req().modRel().path().first();
    let $_u2 = route;
    if (sys.ObjUtil.equals($_u2, "login")) {
      this.onLogin();
    }
    else if (sys.ObjUtil.equals($_u2, "auth")) {
      this.onAuth();
    }
    else if (sys.ObjUtil.equals($_u2, "logout")) {
      this.onLogout();
    }
    else if (sys.ObjUtil.equals($_u2, "login.js")) {
      this.onRes();
    }
    else if (sys.ObjUtil.equals($_u2, "login.css")) {
      this.onRes();
    }
    else if (sys.ObjUtil.equals($_u2, "logo.svg")) {
      this.onRes();
    }
    else if (sys.ObjUtil.equals($_u2, "favicon.png")) {
      this.onRes();
    }
    else {
      this.res().sendErr(404);
    }
    ;
    return;
  }

  onLogin() {
    if (sys.ObjUtil.compareNE(this.req().method(), "GET")) {
      this.res().sendErr(501);
      return;
    }
    ;
    let title = sys.Str.plus("", HxUserWeb.type$.pod().locale("login.login"));
    let userLabel = sys.Str.plus("", HxUserWeb.type$.pod().locale("login.username"));
    let passLabel = sys.Str.plus("", HxUserWeb.type$.pod().locale("login.password"));
    let loginLabel = sys.Str.plus("", HxUserWeb.type$.pod().locale("login.login"));
    let loggingInLabel = sys.Str.plus("", HxUserWeb.type$.pod().locale("login.loggingIn"));
    let badCredsLabel = sys.Str.plus("", HxUserWeb.type$.pod().locale("login.invalidUsernamePassword"));
    let logoUri = this.rt().platform().logoUri();
    let loginUri = this.uri().plus(sys.Uri.fromStr("auth"));
    let redirectUri = sys.Uri.fromStr("/");
    this.res().headers().set("Content-Type", "text/html; charset=utf-8");
    let out = this.res().out();
    out.docType5().html().head().title().esc(title).titleEnd().includeCss(this.uri().plus(sys.Uri.fromStr("login.css"))).includeJs(this.uri().plus(sys.Uri.fromStr("login.js")));
    out.w("<meta name='viewport' content='user-scalable=no, width=device-width, initial-scale=1.0'/>").nl();
    out.script().w(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("hxLogin.passwordRequired = false;\nhxLogin.authUri = ", sys.Str.toCode(sys.Str.toStr(loginUri.encode()))), ";\nhxLogin.redirectUri = "), sys.Str.toCode(sys.Str.toStr(redirectUri.encode()))), ";\nhxLogin.localeLogin = "), sys.Str.toCode(loginLabel)), ";\nhxLogin.localeLoggingIn = "), sys.Str.toCode(loggingInLabel)), ";\nhxLogin.localeBadCreds = "), sys.Str.toCode(badCredsLabel)), ";\nwindow.onload = function() { hxLogin.init(); }")).scriptEnd();
    out.headEnd().body().form(sys.Str.plus(sys.Str.plus("id='loginForm' method='post' action='", sys.Str.toXml(loginUri.encode())), "' autocomplete='off'")).p("class='logo'").img(logoUri, "title='Haxall' alt='Haxall'").pEnd().p("id='err'").esc(badCredsLabel).pEnd().p().label("for='username'").esc(userLabel).w(":").labelEnd().textField(sys.Str.plus(sys.Str.plus("id='username' name='username' autocomplete='off' placeholder='", sys.Str.toXml(userLabel)), "'")).pEnd().p().label("for='password'").esc(passLabel).w(":").labelEnd().password(sys.Str.plus(sys.Str.plus("id='password' name='password' size='25' autocomplete='off' placeholder='", sys.Str.toXml(passLabel)), "'")).pEnd().p().submit(sys.Str.plus(sys.Str.plus("id='loginButton' value='", sys.Str.toXml(loginLabel)), "' onclick='return hxLogin.loginAuth();'")).pEnd().formEnd().bodyEnd().htmlEnd();
    return;
  }

  onAuth() {
    HxUserAuthServerContext.make(this.#lib).onService(this.req(), this.res());
    return;
  }

  onLogout() {
    let cx = this.#lib.authenticate(this.req(), this.res());
    if (cx == null) {
      return;
    }
    ;
    this.#lib.sessions().close(sys.ObjUtil.coerce(cx.session(), HxUserSession.type$));
    this.res().redirect(this.#lib.loginUri());
    return;
  }

  onRes() {
    let file = sys.ObjUtil.typeof(this).pod().file(sys.Str.toUri(sys.Str.plus("/res/", this.req().modRel())), false);
    if (file == null) {
      return this.res().sendErr(404);
    }
    ;
    web.FileWeblet.make(sys.ObjUtil.coerce(file, sys.File.type$)).onService();
    return;
  }

}

class HxUserAuth extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxUserAuth.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #req = null;

  req() {
    return this.#req;
  }

  #res = null;

  res() {
    return this.#res;
  }

  static make(lib,req,res) {
    const $self = new HxUserAuth();
    HxUserAuth.make$($self,lib,req,res);
    return $self;
  }

  static make$($self,lib,req,res) {
    $self.#rt = lib.rt();
    $self.#lib = lib;
    $self.#req = req;
    $self.#res = res;
    return;
  }

  authenticate() {
    let s = this.checkCluster();
    if (s != null) {
      return this.authenticated(sys.ObjUtil.coerce(s, HxUserSession.type$));
    }
    ;
    if (this.#res.isCommitted()) {
      return null;
    }
    ;
    (s = this.checkCookie());
    if (s != null) {
      return this.authenticated(sys.ObjUtil.coerce(s, HxUserSession.type$));
    }
    ;
    if (this.#res.isCommitted()) {
      return null;
    }
    ;
    (s = this.checkAuthorization());
    if (s != null) {
      return this.authenticated(sys.ObjUtil.coerce(s, HxUserSession.type$));
    }
    ;
    if (this.#res.isCommitted()) {
      return null;
    }
    ;
    this.#res.redirect(this.#lib.loginUri());
    return null;
  }

  authenticated(session) {
    let user = ((this$) => { if (session.isCluster()) return session.user(); return this$.#lib.read(session.user().id()); })(this);
    session.touch(sys.ObjUtil.coerce(user, hx.HxUser.type$));
    let cx = this.#rt.context().createSession(session);
    cx.stash().set("attestKey", session.attestKey());
    return cx;
  }

  checkCookie() {
    let key = this.#req.cookies().get(this.#lib.cookieName());
    if (key == null) {
      return null;
    }
    ;
    let session = this.#lib.sessions().get(sys.ObjUtil.coerce(key, sys.Str.type$), false);
    if (session == null) {
      return null;
    }
    ;
    let attestKey = this.#req.headers().get("Attest-Key");
    if (attestKey != null) {
      if (sys.ObjUtil.compareNE(session.attestKey(), attestKey)) {
        this.#res.sendErr(400, "Invalid Attest-Key");
        return null;
      }
      ;
    }
    else {
      if (!this.#req.isGet()) {
        this.#res.sendErr(400, "Attest-Key header required");
        return null;
      }
      ;
    }
    ;
    return session;
  }

  checkAuthorization() {
    if (this.#req.headers().containsKey("Authorization")) {
      return sys.ObjUtil.coerce(HxUserAuthServerContext.make(this.#lib).onService(this.#req, this.#res), HxUserSession.type$.toNullable());
    }
    ;
    if (this.#lib.noAuth()) {
      return this.#lib.login(this.#req, this.#res, HxUserImpl.make(sys.ObjUtil.coerce(this.#rt.db().read(sys.ObjUtil.coerce(haystack.Filter.fromStr("user and userRole==\"su\""), haystack.Filter.type$)), haystack.Dict.type$)));
    }
    ;
    return null;
  }

  checkCluster() {
    let sessionKey = sys.ObjUtil.as(this.#req.stash().get("clusterSessionKey"), sys.Str.type$);
    if (sessionKey == null) {
      return null;
    }
    ;
    let username = sys.ObjUtil.as(this.#req.stash().get("clusterUsername"), sys.Str.type$);
    if (username == null) {
      return null;
    }
    ;
    let session = this.#lib.sessions().get(sys.ObjUtil.coerce(sessionKey, sys.Str.type$), false);
    if (session != null) {
      if (sys.ObjUtil.compareNE(session.user().username(), username)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Session user mismatch ", session.user()), " != "), username));
      }
      ;
      return session;
    }
    else {
      let node = this.#req.stash().get("clusterNode");
      let attestKey = sys.ObjUtil.as(this.#req.stash().get("clusterAttestKey"), sys.Str.type$);
      if ((node == null || attestKey == null)) {
        return null;
      }
      ;
      let cluster = sys.ObjUtil.as(this.#rt.services().get(hx.HxClusterService.type$, false), hx.HxClusterService.type$);
      if (cluster == null) {
        return null;
      }
      ;
      let user = cluster.stashedUser(sys.ObjUtil.coerce(node, sys.Obj.type$), sys.ObjUtil.coerce(username, sys.Str.type$));
      (session = this.#lib.sessions().openCluster(this.#req, sys.ObjUtil.coerce(sessionKey, sys.Str.type$), sys.ObjUtil.coerce(attestKey, sys.Str.type$), user));
      return session;
    }
    ;
  }

}

class HxUserAuthServerContext extends auth.AuthServerContext {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxUserAuthServerContext.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  static make(lib) {
    const $self = new HxUserAuthServerContext();
    HxUserAuthServerContext.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    auth.AuthServerContext.make$($self);
    $self.#rt = lib.rt();
    $self.#lib = lib;
    return;
  }

  log() {
    return this.#lib.log();
  }

  userByUsername(username) {
    let user = this.#lib.read(username, false);
    if (user == null) {
      return auth.AuthUser.genFake(username);
    }
    ;
    let msg = HxUserUtil.dictToAuthMsg(sys.ObjUtil.coerce(user.meta().trap("userAuth", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Dict.type$));
    return auth.AuthUser.makeMsg(user.username(), sys.ObjUtil.coerce(msg, auth.AuthMsg.type$));
  }

  sessionByAuthToken(authToken) {
    return this.#lib.sessions().get(authToken, false);
  }

  userSecret() {
    let hxUser = this.#lib.read(this.user().username(), false);
    if (hxUser == null) {
      return null;
    }
    ;
    return this.#rt.db().passwords().get(hxUser.id().id());
  }

  login() {
    return this.#lib.login(sys.ObjUtil.coerce(this.req(), web.WebReq.type$), sys.ObjUtil.coerce(this.res(), web.WebRes.type$), sys.ObjUtil.coerce(this.#lib.read(this.user().username()), hx.HxUser.type$)).key();
  }

  onAuthErr(err) {
    this.res().headers().set("x-hx-login-err", err.resMsg());
    return;
  }

}

class HxUserSettings extends haystack.TypedDict {
  constructor() {
    super();
    const this$ = this;
    this.#maxSessions = 250;
    return;
  }

  typeof() { return HxUserSettings.type$; }

  #maxSessions = 0;

  maxSessions() { return this.#maxSessions; }

  __maxSessions(it) { if (it === undefined) return this.#maxSessions; else this.#maxSessions = it; }

  static make(d,f) {
    const $self = new HxUserSettings();
    HxUserSettings.make$($self,d,f);
    return $self;
  }

  static make$($self,d,f) {
    haystack.TypedDict.make$($self, d);
    ;
    sys.Func.call(f, $self);
    return;
  }

}

class HxUserSessions extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#byKey = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return HxUserSessions.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #byKey = null;

  // private field reflection only
  __byKey(it) { if (it === undefined) return this.#byKey; else this.#byKey = it; }

  static make(lib) {
    const $self = new HxUserSessions();
    HxUserSessions.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    ;
    $self.#lib = lib;
    return;
  }

  log() {
    return this.#lib.log();
  }

  list() {
    return sys.ObjUtil.coerce(this.#byKey.vals(HxUserSession.type$), sys.Type.find("hxUser::HxUserSession[]"));
  }

  get(key,checked) {
    if (checked === undefined) checked = true;
    let s = this.#byKey.get(key);
    if (s != null) {
      return sys.ObjUtil.coerce(s, HxUserSession.type$.toNullable());
    }
    ;
    if (checked) {
      throw haystack.UnknownNameErr.make(key);
    }
    ;
    return null;
  }

  open(req,user) {
    this.log().info(sys.Str.plus("Login: ", user.username()));
    let key = HxUserSession.genKey("s-");
    let attestKey = HxUserSession.genKey("a-");
    let session = HxUserSession.make(req, key, attestKey, user);
    return this.doOpen(session);
  }

  openCluster(req,key,attestKey,user) {
    const this$ = this;
    this.log().info(sys.Str.plus("Login cluster: ", user.username()));
    let session = HxUserSession.make(req, key, attestKey, user, (it) => {
      it.__isCluster(true);
      return;
    });
    return this.doOpen(session);
  }

  doOpen(session) {
    if ((sys.ObjUtil.compareGE(this.#byKey.size(), this.#lib.rec().maxSessions()) && !session.user().isSu())) {
      throw auth.AuthErr.makeRes("Max sessions exceeded", "Max sessions exceeded", 503);
    }
    ;
    this.#byKey.add(session.key(), session);
    return session;
  }

  close(session) {
    this.log().info(sys.Str.plus("Logout: ", session.user().username()));
    this.#byKey.remove(session.key());
    return;
  }

  onHouseKeeping() {
    const this$ = this;
    let lease = ((this$) => { let $_u4 = ((this$) => { let $_u5 = sys.ObjUtil.as(this$.#lib.rec().get("sessionTimeout"), haystack.Number.type$); if ($_u5 == null) return null; return sys.ObjUtil.as(this$.#lib.rec().get("sessionTimeout"), haystack.Number.type$).toDuration(false); })(this$); if ($_u4 != null) return $_u4; return sys.Duration.fromStr("1hr"); })(this);
    let now = sys.Duration.now();
    this.list().each((session) => {
      if (session.isExpired(sys.ObjUtil.coerce(lease, sys.Duration.type$), now)) {
        this$.close(session);
      }
      ;
      return;
    });
    return;
  }

}

class HxUserSession extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#key = HxUserSession.genKey("s-");
    this.#attestKey = HxUserSession.genKey("a-");
    this.#created = sys.DateTime.now();
    this.#touchedRef = concurrent.AtomicInt.make(sys.Duration.nowTicks());
    return;
  }

  typeof() { return HxUserSession.type$; }

  #key = null;

  key() { return this.#key; }

  __key(it) { if (it === undefined) return this.#key; else this.#key = it; }

  #attestKey = null;

  attestKey() { return this.#attestKey; }

  __attestKey(it) { if (it === undefined) return this.#attestKey; else this.#attestKey = it; }

  #userRef = null;

  // private field reflection only
  __userRef(it) { if (it === undefined) return this.#userRef; else this.#userRef = it; }

  #remoteAddr = null;

  remoteAddr() { return this.#remoteAddr; }

  __remoteAddr(it) { if (it === undefined) return this.#remoteAddr; else this.#remoteAddr = it; }

  #userAgent = null;

  userAgent() { return this.#userAgent; }

  __userAgent(it) { if (it === undefined) return this.#userAgent; else this.#userAgent = it; }

  #created = null;

  created() { return this.#created; }

  __created(it) { if (it === undefined) return this.#created; else this.#created = it; }

  #isCluster = false;

  isCluster() { return this.#isCluster; }

  __isCluster(it) { if (it === undefined) return this.#isCluster; else this.#isCluster = it; }

  #touchedRef = null;

  // private field reflection only
  __touchedRef(it) { if (it === undefined) return this.#touchedRef; else this.#touchedRef = it; }

  static #keyCounter = undefined;

  static keyCounter() {
    if (HxUserSession.#keyCounter === undefined) {
      HxUserSession.static$init();
      if (HxUserSession.#keyCounter === undefined) HxUserSession.#keyCounter = null;
    }
    return HxUserSession.#keyCounter;
  }

  static make(req,key,attestKey,user,f) {
    const $self = new HxUserSession();
    HxUserSession.make$($self,req,key,attestKey,user,f);
    return $self;
  }

  static make$($self,req,key,attestKey,user,f) {
    if (f === undefined) f = null;
    ;
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    $self.#key = key;
    $self.#attestKey = attestKey;
    $self.#remoteAddr = HxUserSession.toRemoteAddr(req);
    $self.#userAgent = sys.ObjUtil.coerce(((this$) => { let $_u6 = req.headers().get("User-Agent"); if ($_u6 != null) return $_u6; return ""; })($self), sys.Str.type$);
    $self.#userRef = concurrent.AtomicRef.make(user);
    return;
  }

  user() {
    return sys.ObjUtil.coerce(this.#userRef.val(), hx.HxUser.type$);
  }

  touched() {
    return this.#touchedRef.val();
  }

  touch(user) {
    this.#userRef.val(user);
    this.#touchedRef.val(sys.Duration.nowTicks());
    return;
  }

  isExpired(lease,now) {
    return sys.ObjUtil.compareGT(sys.Int.minus(now.ticks(), this.touched()), lease.ticks());
  }

  toStr() {
    return this.#key;
  }

  static toRemoteAddr(req) {
    let node = req.stash().get("clusterNode");
    if (node != null) {
      return sys.ObjUtil.toStr(node);
    }
    ;
    let addr = req.headers().get("X-Real-IP");
    if (addr == null) {
      (addr = req.headers().get("X-Forwarded-For"));
    }
    ;
    if (addr == null) {
      (addr = req.remoteAddr().toStr());
    }
    ;
    return sys.ObjUtil.coerce(addr, sys.Str.type$);
  }

  static genKey(prefix) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(prefix, sys.Buf.random(32).toBase64Uri()), "-"), sys.Int.toHex(HxUserSession.keyCounter().incrementAndGet()));
  }

  static static$init() {
    HxUserSession.#keyCounter = concurrent.AtomicInt.make();
    return;
  }

}

class HxUserUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxUserUtil.type$; }

  static addUser(db,user,pass,tags) {
    let scram = auth.ScramKey.gen();
    let userAuth = HxUserUtil.authMsgToDict(scram.toAuthMsg());
    let secret = scram.toSecret(pass);
    (tags = tags.dup());
    tags.set("username", user);
    tags.set("user", haystack.Marker.val());
    tags.set("created", sys.DateTime.now());
    tags.set("userAuth", userAuth);
    tags.set("disabled", haystack.Remove.val());
    HxUserUtil.addUserSet(tags, "dis", user);
    HxUserUtil.addUserSet(tags, "tz", sys.TimeZone.cur().toStr());
    HxUserUtil.addUserSet(tags, "userRole", "op");
    let rec = db.commit(folio.Diff.makeAdd(tags)).newRec();
    db.passwords().set(rec.id().id(), secret);
    return HxUserImpl.make(sys.ObjUtil.coerce(rec, haystack.Dict.type$));
  }

  static addUserSet(tags,name,val) {
    if (tags.get(name) == null) {
      tags.set(name, val);
    }
    ;
    return;
  }

  static updatePassword(db,rec,pass) {
    let scram = auth.ScramKey.gen();
    let userAuth = HxUserUtil.authMsgToDict(scram.toAuthMsg());
    let secret = scram.toSecret(pass);
    let changes = sys.Map.__fromLiteral(["userAuth"], [userAuth], sys.Type.find("sys::Str"), sys.Type.find("haystack::Dict"));
    db.commit(folio.Diff.make(rec, changes));
    db.passwords().set(rec.id().id(), secret);
    return;
  }

  static authMsgToDict(msg) {
    const this$ = this;
    let userAuth = sys.Map.__fromLiteral(["scheme"], [msg.scheme()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    msg.params().each((v,k) => {
      if (sys.ObjUtil.equals("c", k)) {
        userAuth.set(k, sys.ObjUtil.coerce(haystack.Number.makeInt(sys.ObjUtil.coerce(sys.Int.fromStr(v, 10), sys.Int.type$)), sys.Obj.type$));
      }
      else {
        userAuth.set(k, v);
      }
      ;
      return;
    });
    return haystack.Etc.makeDict(userAuth);
  }

  static dictToAuthMsg(userAuth,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let scheme = null;
    let params = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    userAuth.each((v,k) => {
      if (sys.ObjUtil.equals("scheme", k)) {
        (scheme = sys.ObjUtil.coerce(v, sys.Str.type$.toNullable()));
      }
      else {
        params.set(k, sys.Str.plus("", v));
      }
      ;
      return;
    });
    try {
      return auth.AuthMsg.make(sys.ObjUtil.coerce(scheme, sys.Str.type$), params);
    }
    catch ($_u7) {
      $_u7 = sys.Err.make($_u7);
      if ($_u7 instanceof sys.Err) {
        let e = $_u7;
        ;
        if (checked) {
          throw e;
        }
        ;
        return null;
      }
      else {
        throw $_u7;
      }
    }
    ;
  }

  static make() {
    const $self = new HxUserUtil();
    HxUserUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HxUserImpl extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxUserImpl.type$; }

  #username = null;

  username() { return this.#username; }

  __username(it) { if (it === undefined) return this.#username; else this.#username = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #isSu = false;

  isSu() { return this.#isSu; }

  __isSu(it) { if (it === undefined) return this.#isSu; else this.#isSu = it; }

  #isAdmin = false;

  isAdmin() { return this.#isAdmin; }

  __isAdmin(it) { if (it === undefined) return this.#isAdmin; else this.#isAdmin = it; }

  #email = null;

  email() { return this.#email; }

  __email(it) { if (it === undefined) return this.#email; else this.#email = it; }

  #mod = null;

  mod() { return this.#mod; }

  __mod(it) { if (it === undefined) return this.#mod; else this.#mod = it; }

  #access = null;

  access() { return this.#access; }

  __access(it) { if (it === undefined) return this.#access; else this.#access = it; }

  static make(meta) {
    const $self = new HxUserImpl();
    HxUserImpl.make$($self,meta);
    return $self;
  }

  static make$($self,meta) {
    $self.#meta = meta;
    $self.#id = meta.id();
    $self.#username = sys.ObjUtil.coerce(meta.trap("username", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    $self.#dis = sys.ObjUtil.coerce(((this$) => { let $_u8 = meta.get("dis"); if ($_u8 != null) return $_u8; return this$.#username; })($self), sys.Str.type$);
    $self.#email = sys.ObjUtil.as(meta.get("email"), sys.Str.type$);
    $self.#mod = sys.ObjUtil.coerce(meta.trap("mod", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.DateTime.type$);
    $self.#access = HxUserAccessImpl.make($self);
    let $_u9 = meta.get("userRole");
    if (sys.ObjUtil.equals($_u9, "su")) {
      $self.#isSu = ((this$) => { let $_u10 = true; this$.#isAdmin = $_u10; return $_u10; })($self);
    }
    else if (sys.ObjUtil.equals($_u9, "admin")) {
      $self.#isAdmin = true;
    }
    ;
    return;
  }

  toStr() {
    return this.#username;
  }

}

class HxUserAccessImpl extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxUserAccessImpl.type$; }

  #user = null;

  user() { return this.#user; }

  __user(it) { if (it === undefined) return this.#user; else this.#user = it; }

  static make(user) {
    const $self = new HxUserAccessImpl();
    HxUserAccessImpl.make$($self,user);
    return $self;
  }

  static make$($self,user) {
    $self.#user = user;
    return;
  }

  canPointWriteAtLevel(level) {
    return this.#user.isAdmin();
  }

}

class HxUserFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxUserFuncs.type$; }

  static make() {
    const $self = new HxUserFuncs();
    HxUserFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

const p = sys.Pod.add$('hxUser');
const xp = sys.Param.noParams$();
let m;
HxUserLib.type$ = p.at$('HxUserLib','hx::HxLib',['hx::HxUserService'],{},8194,HxUserLib);
HxUserWeb.type$ = p.at$('HxUserWeb','hx::HxLibWeb',[],{},8194,HxUserWeb);
HxUserAuth.type$ = p.at$('HxUserAuth','sys::Obj',[],{},128,HxUserAuth);
HxUserAuthServerContext.type$ = p.at$('HxUserAuthServerContext','auth::AuthServerContext',[],{},128,HxUserAuthServerContext);
HxUserSettings.type$ = p.at$('HxUserSettings','haystack::TypedDict',[],{},8194,HxUserSettings);
HxUserSessions.type$ = p.at$('HxUserSessions','sys::Obj',[],{},8194,HxUserSessions);
HxUserSession.type$ = p.at$('HxUserSession','sys::Obj',['hx::HxSession'],{},8194,HxUserSession);
HxUserUtil.type$ = p.at$('HxUserUtil','sys::Obj',[],{},8194,HxUserUtil);
HxUserImpl.type$ = p.at$('HxUserImpl','sys::Obj',['hx::HxUser'],{},8194,HxUserImpl);
HxUserAccessImpl.type$ = p.at$('HxUserAccessImpl','sys::Obj',['hx::HxUserAccess'],{},130,HxUserAccessImpl);
HxUserFuncs.type$ = p.at$('HxUserFuncs','sys::Obj',[],{},8194,HxUserFuncs);
HxUserLib.type$.af$('web',336898,'hxUser::HxUserWeb',{}).af$('sessions',73730,'hxUser::HxUserSessions',{}).af$('noAuth',73730,'sys::Bool',{}).af$('loginUri',73730,'sys::Uri',{}).af$('logoutUri',73730,'sys::Uri',{}).af$('cookieNameRef',67586,'concurrent::AtomicRef',{}).am$('rec',271360,'hxUser::HxUserSettings',xp,{}).am$('cookieName',8192,'sys::Str',xp,{}).am$('services',271360,'hx::HxService[]',xp,{}).am$('read',271360,'hx::HxUser?',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Obj',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('authenticate',271360,'hx::HxContext?',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('closeSession',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('session','hx::HxSession',false)]),{}).am$('makeSyntheticUser',271360,'hx::HxUser',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false),new sys.Param('extra','sys::Obj?',true)]),{}).am$('login',128,'hxUser::HxUserSession',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false),new sys.Param('user','hx::HxUser',false)]),{}).am$('addSessionCookie',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false),new sys.Param('session','hxUser::HxUserSession',false)]),{}).am$('onStart',271360,'sys::Void',xp,{}).am$('houseKeepingFreq',271360,'sys::Duration?',xp,{}).am$('onHouseKeeping',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
HxUserWeb.type$.af$('lib',336898,'hxUser::HxUserLib',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxUser::HxUserLib',false)]),{}).am$('onService',271360,'sys::Void',xp,{}).am$('onLogin',2048,'sys::Void',xp,{}).am$('onAuth',2048,'sys::Void',xp,{}).am$('onLogout',2048,'sys::Void',xp,{}).am$('onRes',2048,'sys::Void',xp,{});
HxUserAuth.type$.af$('rt',73730,'hx::HxRuntime',{}).af$('lib',73730,'hxUser::HxUserLib',{}).af$('req',73728,'web::WebReq',{}).af$('res',73728,'web::WebRes',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxUser::HxUserLib',false),new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('authenticate',8192,'hx::HxContext?',xp,{}).am$('authenticated',2048,'hx::HxContext',sys.List.make(sys.Param.type$,[new sys.Param('session','hxUser::HxUserSession',false)]),{}).am$('checkCookie',2048,'hxUser::HxUserSession?',xp,{}).am$('checkAuthorization',2048,'hxUser::HxUserSession?',xp,{}).am$('checkCluster',2048,'hxUser::HxUserSession?',xp,{});
HxUserAuthServerContext.type$.af$('rt',73730,'hx::HxRuntime',{}).af$('lib',73730,'hxUser::HxUserLib',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxUser::HxUserLib',false)]),{}).am$('log',271360,'sys::Log',xp,{}).am$('userByUsername',271360,'auth::AuthUser?',sys.List.make(sys.Param.type$,[new sys.Param('username','sys::Str',false)]),{}).am$('sessionByAuthToken',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('authToken','sys::Str',false)]),{}).am$('userSecret',271360,'sys::Str?',xp,{}).am$('login',271360,'sys::Str',xp,{}).am$('onAuthErr',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','auth::AuthErr',false)]),{});
HxUserSettings.type$.af$('maxSessions',73730,'sys::Int',{'haystack::TypedTag':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Dict',false),new sys.Param('f','|sys::This->sys::Void|',false)]),{});
HxUserSessions.type$.af$('lib',73730,'hxUser::HxUserLib',{}).af$('byKey',67586,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxUser::HxUserLib',false)]),{}).am$('log',8192,'sys::Log',xp,{}).am$('list',8192,'hxUser::HxUserSession[]',xp,{}).am$('get',8192,'hxUser::HxUserSession?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('open',8192,'hxUser::HxUserSession',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('user','hx::HxUser',false)]),{}).am$('openCluster',8192,'hxUser::HxUserSession',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('key','sys::Str',false),new sys.Param('attestKey','sys::Str',false),new sys.Param('user','hx::HxUser',false)]),{}).am$('doOpen',2048,'hxUser::HxUserSession',sys.List.make(sys.Param.type$,[new sys.Param('session','hxUser::HxUserSession',false)]),{}).am$('close',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('session','hxUser::HxUserSession',false)]),{}).am$('onHouseKeeping',8192,'sys::Void',xp,{});
HxUserSession.type$.af$('key',336898,'sys::Str',{}).af$('attestKey',336898,'sys::Str',{}).af$('userRef',67586,'concurrent::AtomicRef',{}).af$('remoteAddr',73730,'sys::Str',{}).af$('userAgent',73730,'sys::Str',{}).af$('created',73730,'sys::DateTime',{}).af$('isCluster',73730,'sys::Bool',{}).af$('touchedRef',67586,'concurrent::AtomicInt',{}).af$('keyCounter',100354,'concurrent::AtomicInt',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('key','sys::Str',false),new sys.Param('attestKey','sys::Str',false),new sys.Param('user','hx::HxUser',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('user',271360,'hx::HxUser',xp,{}).am$('touched',8192,'sys::Int',xp,{}).am$('touch',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('user','hx::HxUser',false)]),{}).am$('isExpired',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('lease','sys::Duration',false),new sys.Param('now','sys::Duration',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('toRemoteAddr',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false)]),{}).am$('genKey',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('prefix','sys::Str',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
HxUserUtil.type$.am$('addUser',40962,'hx::HxUser',sys.List.make(sys.Param.type$,[new sys.Param('db','folio::Folio',false),new sys.Param('user','sys::Str',false),new sys.Param('pass','sys::Str',false),new sys.Param('tags','[sys::Str:sys::Obj]',false)]),{}).am$('addUserSet',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tags','[sys::Str:sys::Obj]',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('updatePassword',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('db','folio::Folio',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('pass','sys::Str',false)]),{}).am$('authMsgToDict',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('msg','auth::AuthMsg',false)]),{}).am$('dictToAuthMsg',40962,'auth::AuthMsg?',sys.List.make(sys.Param.type$,[new sys.Param('userAuth','haystack::Dict',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('make',139268,'sys::Void',xp,{});
HxUserImpl.type$.af$('username',336898,'sys::Str',{}).af$('meta',336898,'haystack::Dict',{}).af$('id',336898,'haystack::Ref',{}).af$('dis',336898,'sys::Str',{}).af$('isSu',336898,'sys::Bool',{}).af$('isAdmin',336898,'sys::Bool',{}).af$('email',336898,'sys::Str?',{}).af$('mod',336898,'sys::DateTime',{}).af$('access',336898,'hx::HxUserAccess',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
HxUserAccessImpl.type$.af$('user',73730,'hx::HxUser',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('user','hx::HxUser',false)]),{}).am$('canPointWriteAtLevel',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::Int',false)]),{});
HxUserFuncs.type$.am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxUser");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;web 1.0;haystack 3.1.11;auth 3.1.11;def 3.1.11;defc 3.1.11;axon 3.1.11;folio 3.1.11;hx 3.1.11");
m.set("pod.summary", "Haxall auth and user management library");
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
m.set("pod.docApi", "false");
m.set("org.uri", "https://skyfoundry.com/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);

m=sys.Map.make(sys.Str.type$, sys.Str.type$);
m.set("login.username","Username");
m.set("login.password","Password");
m.set("login.invalidUsernamePassword","Invalid username or password");
m.set("login.login","Login");
m.set("login.loggingIn","Logging in");
sys.Env.cur().__props("hxUser:locale/en.props", m);



// cjs exports begin
export {
  HxUserLib,
  HxUserWeb,
  HxUserSettings,
  HxUserSessions,
  HxUserSession,
  HxUserUtil,
  HxUserImpl,
  HxUserFuncs,
};
