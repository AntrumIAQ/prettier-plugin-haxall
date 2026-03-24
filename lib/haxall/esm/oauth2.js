// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as util from './util.js'
import * as web from './web.js'
import * as wisp from './wisp.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class TokenReq extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TokenReq.type$; }

  #tokenUri = null;

  tokenUri() { return this.#tokenUri; }

  __tokenUri(it) { if (it === undefined) return this.#tokenUri; else this.#tokenUri = it; }

  #customParams = null;

  customParams() { return this.#customParams; }

  __customParams(it) { if (it === undefined) return this.#customParams; else this.#customParams = it; }

  static make(tokenUri,customParams) {
    const $self = new TokenReq();
    TokenReq.make$($self,tokenUri,customParams);
    return $self;
  }

  static make$($self,tokenUri,customParams) {
    if (customParams === undefined) customParams = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    $self.#tokenUri = tokenUri;
    $self.#customParams = sys.ObjUtil.coerce(((this$) => { let $_u0 = customParams; if ($_u0 == null) return null; return sys.ObjUtil.toImmutable(customParams); })($self), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

  build() {
    let params = this.#customParams.dup();
    params.set("grant_type", this.grantType());
    return params;
  }

}

class AuthCodeTokenReq extends TokenReq {
  constructor() {
    super();
    const this$ = this;
    this.#grantType = "authorization_code";
    return;
  }

  typeof() { return AuthCodeTokenReq.type$; }

  #grantType = null;

  grantType() { return this.#grantType; }

  __grantType(it) { if (it === undefined) return this.#grantType; else this.#grantType = it; }

  static make(tokenUri,customParams) {
    const $self = new AuthCodeTokenReq();
    AuthCodeTokenReq.make$($self,tokenUri,customParams);
    return $self;
  }

  static make$($self,tokenUri,customParams) {
    if (customParams === undefined) customParams = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    TokenReq.make$($self, tokenUri, customParams);
    ;
    return;
  }

  grant(req,flowParams) {
    let params = flowParams.dup().addAll(this.build());
    params.set("client_id", req.clientId());
    if (req.redirectUri() != null) {
      params.set("redirect_uri", req.redirectUri().toStr());
    }
    ;
    let client = web.WebClient.make(this.tokenUri()).postForm(params);
    return sys.ObjUtil.coerce(JsonAccessToken.fromStr(client.resStr()), AccessToken.type$);
  }

}

class Pkce extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Pkce.type$; }

  static #chars = undefined;

  static chars() {
    if (Pkce.#chars === undefined) {
      Pkce.static$init();
      if (Pkce.#chars === undefined) Pkce.#chars = null;
    }
    return Pkce.#chars;
  }

  static #minLen = undefined;

  static minLen() {
    if (Pkce.#minLen === undefined) {
      Pkce.static$init();
      if (Pkce.#minLen === undefined) Pkce.#minLen = 0;
    }
    return Pkce.#minLen;
  }

  static #maxLen = undefined;

  static maxLen() {
    if (Pkce.#maxLen === undefined) {
      Pkce.static$init();
      if (Pkce.#maxLen === undefined) Pkce.#maxLen = 0;
    }
    return Pkce.#maxLen;
  }

  #codeVerifier = null;

  codeVerifier() { return this.#codeVerifier; }

  __codeVerifier(it) { if (it === undefined) return this.#codeVerifier; else this.#codeVerifier = it; }

  #challenge = null;

  challenge() { return this.#challenge; }

  __challenge(it) { if (it === undefined) return this.#challenge; else this.#challenge = it; }

  static gen() {
    return Pkce.make(Pkce.genCode());
  }

  static make(codeVerifier) {
    const $self = new Pkce();
    Pkce.make$($self,codeVerifier);
    return $self;
  }

  static make$($self,codeVerifier) {
    $self.#codeVerifier = codeVerifier;
    $self.#challenge = Pkce.sha256(codeVerifier);
    return;
  }

  params(params) {
    if (params === undefined) params = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Str]"));
    params.set("code_challenge", this.#challenge);
    params.set("code_challenge_method", "S256");
    return params;
  }

  static genCode() {
    const this$ = this;
    let rand = util.Random.makeSecure();
    let len = rand.next(sys.Range.make(Pkce.minLen(), Pkce.maxLen()));
    let buf = sys.StrBuf.make(len);
    sys.Int.times(len, (it) => {
      buf.addChar(sys.Str.get(Pkce.chars(), rand.next(sys.Range.make(0, sys.Str.size(Pkce.chars()), true))));
      return;
    });
    return buf.toStr();
  }

  static sha256(str) {
    return sys.Str.toBuf(str).toDigest("SHA-256").toBase64Uri();
  }

  static static$init() {
    Pkce.#chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-.~";
    Pkce.#minLen = 43;
    Pkce.#maxLen = 128;
    return;
  }

}

class OAuthErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return OAuthErr.type$; }

  #code = 0;

  code() { return this.#code; }

  __code(it) { if (it === undefined) return this.#code; else this.#code = it; }

  #body = null;

  body() { return this.#body; }

  __body(it) { if (it === undefined) return this.#body; else this.#body = it; }

  static make(c) {
    const $self = new OAuthErr();
    OAuthErr.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    sys.Err.make$($self, c.resPhrase());
    $self.#code = c.resCode();
    $self.#body = c.resStr();
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("[", sys.ObjUtil.coerce(this.#code, sys.Obj.type$.toNullable())), "] "), sys.Err.prototype.msg.call(this)), "\n"), this.#body);
  }

}

class AuthCodeGrant extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AuthCodeGrant.type$; }

  #authReq = null;

  authReq() { return this.#authReq; }

  __authReq(it) { if (it === undefined) return this.#authReq; else this.#authReq = it; }

  #tokenReq = null;

  tokenReq() { return this.#tokenReq; }

  __tokenReq(it) { if (it === undefined) return this.#tokenReq; else this.#tokenReq = it; }

  static make(authReq,tokenReq) {
    const $self = new AuthCodeGrant();
    AuthCodeGrant.make$($self,authReq,tokenReq);
    return $self;
  }

  static make$($self,authReq,tokenReq) {
    $self.#authReq = authReq;
    $self.#tokenReq = tokenReq;
    return;
  }

  run() {
    let pkce = Pkce.gen();
    let authRes = this.#authReq.authorize(pkce.params());
    let tokenParams = sys.Map.__fromLiteral(["code","code_verifier"], [authRes.get("code"),pkce.codeVerifier()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?"));
    return this.#tokenReq.grant(this.#authReq, tokenParams);
  }

  client() {
    let token = this.run();
    let params = sys.Map.__fromLiteral(["client_id"], [this.#authReq.clientId()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).addAll(this.#tokenReq.customParams());
    return OAuthClient.makeRefreshable(token, this.#tokenReq.tokenUri(), params);
  }

}

class AccessToken {
  constructor() {
    const this$ = this;
  }

  typeof() { return AccessToken.type$; }

  hasRefreshToken() {
    return this.refreshToken() != null;
  }

}

class JsonAccessToken extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return JsonAccessToken.type$; }

  hasRefreshToken() { return AccessToken.prototype.hasRefreshToken.apply(this, arguments); }

  #json = null;

  json() { return this.#json; }

  __json(it) { if (it === undefined) return this.#json; else this.#json = it; }

  static fromStr(json) {
    return JsonAccessToken.make(sys.ObjUtil.coerce(sys.ObjUtil.coerce(util.JsonInStream.make(sys.Str.in(json)).readJson(), sys.Type.find("sys::Map")), sys.Type.find("[sys::Str:sys::Obj?]")));
  }

  static make(json) {
    const $self = new JsonAccessToken();
    JsonAccessToken.make$($self,json);
    return $self;
  }

  static make$($self,json) {
    $self.#json = sys.ObjUtil.coerce(((this$) => { let $_u1 = json; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(json); })($self), sys.Type.find("[sys::Str:sys::Obj?]"));
    return;
  }

  tokenType() {
    return sys.ObjUtil.coerce(this.#json.getChecked("token_type"), sys.Str.type$);
  }

  accessToken() {
    return sys.ObjUtil.coerce(this.#json.getChecked("access_token"), sys.Str.type$);
  }

  refreshToken() {
    return sys.ObjUtil.coerce(this.#json.get("refresh_token"), sys.Str.type$.toNullable());
  }

  expiresIn() {
    let dur = this.#json.get("expires_in");
    if (dur == null) {
      return null;
    }
    ;
    return sys.Duration.fromStr(sys.Str.plus(sys.Str.plus("", dur), "sec"));
  }

  scope() {
    return sys.ObjUtil.coerce(((this$) => { let $_u2 = ((this$) => { let $_u3 = sys.ObjUtil.as(this$.#json.get("scope"), sys.Str.type$); if ($_u3 == null) return null; return sys.Str.split(sys.ObjUtil.as(this$.#json.get("scope"), sys.Str.type$), sys.ObjUtil.coerce(32, sys.Int.type$.toNullable())); })(this$); if ($_u2 != null) return $_u2; return sys.Str.type$.emptyList(); })(this), sys.Type.find("sys::Str[]"));
  }

  toStr() {
    return this.#json.toStr();
  }

}

class RawAccessToken extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#tokenType = "Bearer";
    this.#scope = sys.ObjUtil.coerce(((this$) => { let $_u4 = sys.ObjUtil.coerce(sys.Str.type$.emptyList(), sys.Type.find("sys::Str[]")); if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.Str.type$.emptyList(), sys.Type.find("sys::Str[]"))); })(this), sys.Type.find("sys::Str[]"));
    return;
  }

  typeof() { return RawAccessToken.type$; }

  hasRefreshToken() { return AccessToken.prototype.hasRefreshToken.apply(this, arguments); }

  #tokenType = null;

  tokenType() { return this.#tokenType; }

  __tokenType(it) { if (it === undefined) return this.#tokenType; else this.#tokenType = it; }

  #accessToken = null;

  accessToken() { return this.#accessToken; }

  __accessToken(it) { if (it === undefined) return this.#accessToken; else this.#accessToken = it; }

  #refreshToken = null;

  refreshToken() { return this.#refreshToken; }

  __refreshToken(it) { if (it === undefined) return this.#refreshToken; else this.#refreshToken = it; }

  #expiresIn = null;

  expiresIn() { return this.#expiresIn; }

  __expiresIn(it) { if (it === undefined) return this.#expiresIn; else this.#expiresIn = it; }

  #scope = null;

  scope() { return this.#scope; }

  __scope(it) { if (it === undefined) return this.#scope; else this.#scope = it; }

  static make(accessToken,f) {
    const $self = new RawAccessToken();
    RawAccessToken.make$($self,accessToken,f);
    return $self;
  }

  static make$($self,accessToken,f) {
    if (f === undefined) f = null;
    ;
    ((this$) => { let $_u5 = f; if ($_u5 == null) return null; return sys.Func.call(f, this$); })($self);
    $self.#accessToken = accessToken;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("{accessToken:", this.#accessToken), ", refreshToken:"), this.#refreshToken), ", expiresIn:"), this.#expiresIn), "}");
  }

}

class OAuthClient extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#tokenRef = concurrent.AtomicRef.make();
    this.#tokenUri = null;
    this.#refreshParams = sys.ObjUtil.coerce(((this$) => { let $_u6 = OAuthClient.emptyHeaders(); if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(OAuthClient.emptyHeaders()); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

  typeof() { return OAuthClient.type$; }

  static #emptyHeaders = undefined;

  static emptyHeaders() {
    if (OAuthClient.#emptyHeaders === undefined) {
      OAuthClient.static$init();
      if (OAuthClient.#emptyHeaders === undefined) OAuthClient.#emptyHeaders = null;
    }
    return OAuthClient.#emptyHeaders;
  }

  #tokenRef = null;

  // private field reflection only
  __tokenRef(it) { if (it === undefined) return this.#tokenRef; else this.#tokenRef = it; }

  #tokenUri = null;

  // private field reflection only
  __tokenUri(it) { if (it === undefined) return this.#tokenUri; else this.#tokenUri = it; }

  #refreshParams = null;

  // private field reflection only
  __refreshParams(it) { if (it === undefined) return this.#refreshParams; else this.#refreshParams = it; }

  static make(token) {
    const $self = new OAuthClient();
    OAuthClient.make$($self,token);
    return $self;
  }

  static make$($self,token) {
    ;
    $self.#tokenRef.val(token);
    return;
  }

  static makeRefreshable(token,tokenUri,params) {
    const $self = new OAuthClient();
    OAuthClient.makeRefreshable$($self,token,tokenUri,params);
    return $self;
  }

  static makeRefreshable$($self,token,tokenUri,params) {
    ;
    $self.#tokenRef.val(token);
    $self.#tokenUri = tokenUri;
    $self.#refreshParams = sys.ObjUtil.coerce(((this$) => { let $_u7 = params; if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(params); })($self), sys.Type.find("[sys::Str:sys::Str]"));
    if (params.get("client_id") == null) {
      throw sys.ArgErr.make(sys.Str.plus("Must specify 'client_id' in params: ", params));
    }
    ;
    return;
  }

  token() {
    return sys.ObjUtil.coerce(this.#tokenRef.val(), AccessToken.type$);
  }

  call(method,uri,req,headers) {
    if (req === undefined) req = null;
    if (headers === undefined) headers = OAuthClient.emptyHeaders();
    let c = null;
    let attempt = 1;
    while (true) {
      (c = this.doCall(method, uri, req, headers));
      if ((sys.ObjUtil.equals(c.resCode(), 401) && sys.ObjUtil.equals(attempt, 1))) {
        this.refreshToken();
      }
      else {
        break;
      }
      ;
      attempt = sys.Int.increment(attempt);
    }
    ;
    return sys.ObjUtil.coerce(c, web.WebClient.type$);
  }

  doCall(method,uri,req,headers) {
    let c = this.prepare(method, uri, headers);
    try {
      if (req == null) {
        c.writeReq();
      }
      else {
        c.writeFile(method, OAuthClient.toFile(sys.ObjUtil.coerce(req, sys.Obj.type$)));
      }
      ;
      c.readRes();
      return c;
    }
    catch ($_u8) {
      $_u8 = sys.Err.make($_u8);
      if ($_u8 instanceof sys.IOErr) {
        let err = $_u8;
        ;
        try {
          if (sys.ObjUtil.equals(c.resCode(), 0)) {
            throw err;
          }
          else {
            throw OAuthErr.make(c);
          }
          ;
        }
        finally {
          c.close();
        }
        ;
      }
      else {
        throw $_u8;
      }
    }
    ;
  }

  prepare(method,uri,headers) {
    if (headers === undefined) headers = OAuthClient.emptyHeaders();
    let c = web.WebClient.make(uri);
    c.reqMethod(sys.Str.upper(method));
    c.reqHeaders().addAll(headers);
    c.reqHeaders().set("Authorization", sys.Str.plus("Bearer ", this.token().accessToken()));
    return c;
  }

  refreshToken() {
    if ((this.#tokenUri == null || this.token().refreshToken() == null)) {
      return;
    }
    ;
    let c = web.WebClient.make(this.#tokenUri);
    try {
      let params = this.#refreshParams.dup();
      params.addAll(sys.Map.__fromLiteral(["grant_type","refresh_token"], ["refresh_token",this.token().refreshToken()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")));
      c.postForm(params);
      let json = OAuthClient.readJson(c.resStr());
      if (!json.containsKey("refresh_token")) {
        json.set("refresh_token", sys.ObjUtil.coerce(this.token().refreshToken(), sys.Obj.type$));
      }
      ;
      this.#tokenRef.val(JsonAccessToken.make(sys.ObjUtil.coerce(json, sys.Type.find("[sys::Str:sys::Obj?]"))));
    }
    finally {
      c.close();
    }
    ;
    return;
  }

  static readJson(str) {
    return sys.ObjUtil.coerce(util.JsonInStream.make(sys.Str.in(str)).readJson(), sys.Type.find("sys::Map"));
  }

  static toFile(obj) {
    if (sys.ObjUtil.is(obj, sys.File.type$)) {
      return sys.ObjUtil.coerce(obj, sys.File.type$);
    }
    ;
    if (sys.ObjUtil.is(obj, sys.Buf.type$)) {
      return sys.ObjUtil.coerce(obj, sys.Buf.type$).toFile(sys.Uri.fromStr("chunk"));
    }
    ;
    if (sys.ObjUtil.is(obj, sys.Type.find("sys::Map"))) {
      return sys.Str.toBuf(util.JsonOutStream.writeJsonToStr(obj)).toFile(sys.Uri.fromStr("req.json"));
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot convert to file ", sys.ObjUtil.typeof(obj)), ": "), obj));
  }

  static static$init() {
    OAuthClient.#emptyHeaders = sys.ObjUtil.coerce(((this$) => { let $_u9 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

}

class AuthReq extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#customParams = sys.ObjUtil.coerce(((this$) => { let $_u10 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u10 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

  typeof() { return AuthReq.type$; }

  #authUri = null;

  authUri() { return this.#authUri; }

  __authUri(it) { if (it === undefined) return this.#authUri; else this.#authUri = it; }

  #clientId = null;

  clientId() { return this.#clientId; }

  __clientId(it) { if (it === undefined) return this.#clientId; else this.#clientId = it; }

  #redirectUri = null;

  redirectUri() { return this.#redirectUri; }

  __redirectUri(it) { if (it === undefined) return this.#redirectUri; else this.#redirectUri = it; }

  #scopes = null;

  scopes() { return this.#scopes; }

  __scopes(it) { if (it === undefined) return this.#scopes; else this.#scopes = it; }

  #customParams = null;

  customParams() { return this.#customParams; }

  __customParams(it) { if (it === undefined) return this.#customParams; else this.#customParams = it; }

  static make(authUri,clientId,f) {
    const $self = new AuthReq();
    AuthReq.make$($self,authUri,clientId,f);
    return $self;
  }

  static make$($self,authUri,clientId,f) {
    if (f === undefined) f = null;
    ;
    ((this$) => { let $_u11 = f; if ($_u11 == null) return null; return sys.Func.call(f, this$); })($self);
    $self.#authUri = authUri;
    $self.#clientId = clientId;
    return;
  }

  build() {
    let params = this.#customParams.dup();
    params.set("client_id", this.#clientId);
    params.set("response_type", this.responseType());
    if (this.#redirectUri != null) {
      params.set("redirect_uri", this.#redirectUri.toStr());
    }
    ;
    if (this.#scopes != null) {
      params.set("scope", this.#scopes.join(" "));
    }
    ;
    return params;
  }

}

class LoopbackAuthReq extends AuthReq {
  constructor() {
    super();
    const this$ = this;
    this.#responseType = "code";
    return;
  }

  typeof() { return LoopbackAuthReq.type$; }

  #responseType = null;

  responseType() { return this.#responseType; }

  __responseType(it) { if (it === undefined) return this.#responseType; else this.#responseType = it; }

  static make(authUri,clientId,f) {
    const $self = new LoopbackAuthReq();
    LoopbackAuthReq.make$($self,authUri,clientId,f);
    return $self;
  }

  static make$($self,authUri,clientId,f) {
    if (f === undefined) f = null;
    AuthReq.make$($self, authUri, clientId, sys.ObjUtil.coerce(f, sys.Type.find("|oauth2::AuthReq->sys::Void|?")));
    ;
    if ($self.redirectUri() == null) {
      throw sys.ArgErr.make("Must set redirectUri");
    }
    ;
    $self.checkHost();
    return;
  }

  checkHost() {
    let $_u12 = sys.Str.lower(this.redirectUri().host());
    if (sys.ObjUtil.equals($_u12, "127.0.0.1") || sys.ObjUtil.equals($_u12, "localhost") || sys.ObjUtil.equals($_u12, inet.IpAddr.local().toStr())) {
      return;
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid host [", this.redirectUri().host()), "] for "), sys.ObjUtil.typeof(this).name()), ". Use '127.0.0.1' instead."));
  }

  authorize(flowParams) {
    const this$ = this;
    let params = this.build();
    params.set("state", sys.Buf.random(16).toBase64Uri());
    params.addAll(flowParams);
    let mod = LoopbackMod.make();
    let $wisp = sys.ObjUtil.coerce(wisp.WispService.make((it) => {
      it.__httpPort(((this$) => { let $_u13 = this$.redirectUri().port(); if ($_u13 != null) return $_u13; return sys.ObjUtil.coerce(80, sys.Int.type$.toNullable()); })(this$));
      it.__root(mod);
      return;
    }).start(), wisp.WispService.type$);
    try {
      let uri = this.authUri().plusQuery(params);
      java.failjava.awt.Desktop.getDesktop().browse(java.failjava.net.URI.javaInit(uri.encode()));
      let authRes = mod.authRes().get(sys.Duration.fromStr("2min"));
      return this.verify(sys.ObjUtil.coerce(authRes, sys.Type.find("[sys::Str:sys::Str]")), sys.ObjUtil.coerce(params.get("state"), sys.Str.type$));
    }
    finally {
      $wisp.stop();
    }
    ;
  }

  verify(authRes,state) {
    if (sys.ObjUtil.compareNE(authRes.get("state"), state)) {
      throw sys.Err.make("Invalid state");
    }
    ;
    return authRes;
  }

}

class LoopbackMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
    this.#authRes = concurrent.Future.makeCompletable();
    return;
  }

  typeof() { return LoopbackMod.type$; }

  #authRes = null;

  authRes() { return this.#authRes; }

  __authRes(it) { if (it === undefined) return this.#authRes; else this.#authRes = it; }

  static make() {
    const $self = new LoopbackMod();
    LoopbackMod.make$($self);
    return $self;
  }

  static make$($self) {
    web.WebMod.make$($self);
    ;
    return;
  }

  onGet() {
    if (this.checkError()) {
      return;
    }
    ;
    this.res().headers().set("Content-Type", "text/html; charset=utf-8");
    let out = this.res().out();
    out.html().head().title().w("Auth Success").titleEnd().headEnd().body().h1().w("Authorization Granted").h1().p().w("You may close this page").pEnd().bodyEnd().htmlEnd();
    this.#authRes.complete(this.req().uri().query());
    return;
  }

  checkError() {
    let q = this.req().uri().query();
    let error = q.get("error");
    if (error == null) {
      return false;
    }
    ;
    this.#authRes.completeErr(AuthReqErr.make(q));
    let errorUri = ((this$) => { let $_u14 = sys.ObjUtil.as(q.get("error_uri"), sys.Str.type$); if ($_u14 == null) return null; return sys.Str.toUri(sys.ObjUtil.as(q.get("error_uri"), sys.Str.type$)); })(this);
    if (errorUri != null) {
      this.res().redirect(sys.ObjUtil.coerce(errorUri, sys.Uri.type$));
      return true;
    }
    ;
    this.res().headers().set("Content-Type", "text/html; charset=utf-8");
    let desc = ((this$) => { let $_u15 = q.get("error_description"); if ($_u15 != null) return $_u15; return "No futher details available"; })(this);
    let out = this.res().out();
    out.html().head().title().w("Auth Error").titleEnd().headEnd().body().h1().w("Authorization Error").h1End().p().w(sys.Str.plus(sys.Str.plus(sys.Str.plus("", error), ": "), desc)).pEnd().bodyEnd().htmlEnd();
    return true;
  }

}

class AuthReqErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AuthReqErr.type$; }

  #params = null;

  params() { return this.#params; }

  __params(it) { if (it === undefined) return this.#params; else this.#params = it; }

  static make(params,cause) {
    const $self = new AuthReqErr();
    AuthReqErr.make$($self,params,cause);
    return $self;
  }

  static make$($self,params,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, sys.ObjUtil.coerce(params.get("error"), sys.Str.type$), cause);
    $self.#params = sys.ObjUtil.coerce(((this$) => { let $_u16 = params; if ($_u16 == null) return null; return sys.ObjUtil.toImmutable(params); })($self), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

  error() {
    return sys.ObjUtil.coerce(this.#params.get("error"), sys.Str.type$);
  }

  desc() {
    return sys.ObjUtil.coerce(((this$) => { let $_u17 = this$.#params.get("error_description"); if ($_u17 != null) return $_u17; return "No description available"; })(this), sys.Str.type$);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("[", this.error()), "] "), this.desc());
  }

}

const p = sys.Pod.add$('oauth2');
const xp = sys.Param.noParams$();
let m;
TokenReq.type$ = p.at$('TokenReq','sys::Obj',[],{},8195,TokenReq);
AuthCodeTokenReq.type$ = p.at$('AuthCodeTokenReq','oauth2::TokenReq',[],{},8194,AuthCodeTokenReq);
Pkce.type$ = p.at$('Pkce','sys::Obj',[],{'sys::NoDoc':""},8226,Pkce);
OAuthErr.type$ = p.at$('OAuthErr','sys::Err',[],{},8194,OAuthErr);
AuthCodeGrant.type$ = p.at$('AuthCodeGrant','sys::Obj',[],{},8194,AuthCodeGrant);
AccessToken.type$ = p.am$('AccessToken','sys::Obj',[],{},8451,AccessToken);
JsonAccessToken.type$ = p.at$('JsonAccessToken','sys::Obj',['oauth2::AccessToken'],{},8194,JsonAccessToken);
RawAccessToken.type$ = p.at$('RawAccessToken','sys::Obj',['oauth2::AccessToken'],{},8194,RawAccessToken);
OAuthClient.type$ = p.at$('OAuthClient','sys::Obj',[],{},8194,OAuthClient);
AuthReq.type$ = p.at$('AuthReq','sys::Obj',[],{},8195,AuthReq);
LoopbackAuthReq.type$ = p.at$('LoopbackAuthReq','oauth2::AuthReq',[],{},8194,LoopbackAuthReq);
LoopbackMod.type$ = p.at$('LoopbackMod','web::WebMod',[],{},130,LoopbackMod);
AuthReqErr.type$ = p.at$('AuthReqErr','sys::Err',[],{},8194,AuthReqErr);
TokenReq.type$.af$('tokenUri',73730,'sys::Uri',{}).af$('customParams',73730,'[sys::Str:sys::Str]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tokenUri','sys::Uri',false),new sys.Param('customParams','[sys::Str:sys::Str]',true)]),{}).am$('grantType',270337,'sys::Str',xp,{}).am$('build',270336,'[sys::Str:sys::Str]',xp,{}).am$('grant',270337,'oauth2::AccessToken',sys.List.make(sys.Param.type$,[new sys.Param('authReq','oauth2::AuthReq',false),new sys.Param('flowParams','[sys::Str:sys::Str]',false)]),{});
AuthCodeTokenReq.type$.af$('grantType',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tokenUri','sys::Uri',false),new sys.Param('customParams','[sys::Str:sys::Str]',true)]),{}).am$('grant',271360,'oauth2::AccessToken',sys.List.make(sys.Param.type$,[new sys.Param('req','oauth2::AuthReq',false),new sys.Param('flowParams','[sys::Str:sys::Str]',false)]),{});
Pkce.type$.af$('chars',100354,'sys::Str',{}).af$('minLen',100354,'sys::Int',{}).af$('maxLen',100354,'sys::Int',{}).af$('codeVerifier',73730,'sys::Str',{}).af$('challenge',73730,'sys::Str',{}).am$('gen',40962,'oauth2::Pkce',xp,{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('codeVerifier','sys::Str',false)]),{}).am$('params',8192,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('params','[sys::Str:sys::Str]',true)]),{}).am$('genCode',40962,'sys::Str',xp,{}).am$('sha256',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
OAuthErr.type$.af$('code',73730,'sys::Int',{}).af$('body',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','web::WebClient',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
AuthCodeGrant.type$.af$('authReq',73730,'oauth2::AuthReq',{}).af$('tokenReq',73730,'oauth2::TokenReq',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('authReq','oauth2::AuthReq',false),new sys.Param('tokenReq','oauth2::AuthCodeTokenReq',false)]),{}).am$('run',8192,'oauth2::AccessToken',xp,{'sys::NoDoc':""}).am$('client',8192,'oauth2::OAuthClient',xp,{});
AccessToken.type$.am$('tokenType',270337,'sys::Str',xp,{}).am$('accessToken',270337,'sys::Str',xp,{}).am$('refreshToken',270337,'sys::Str?',xp,{}).am$('hasRefreshToken',8192,'sys::Bool',xp,{}).am$('expiresIn',270337,'sys::Duration?',xp,{}).am$('scope',270337,'sys::Str[]',xp,{});
JsonAccessToken.type$.af$('json',73730,'[sys::Str:sys::Obj?]',{}).am$('fromStr',40966,'oauth2::JsonAccessToken?',sys.List.make(sys.Param.type$,[new sys.Param('json','sys::Str',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('json','[sys::Str:sys::Obj?]',false)]),{}).am$('tokenType',271360,'sys::Str',xp,{}).am$('accessToken',271360,'sys::Str',xp,{}).am$('refreshToken',271360,'sys::Str?',xp,{}).am$('expiresIn',271360,'sys::Duration?',xp,{}).am$('scope',271360,'sys::Str[]',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
RawAccessToken.type$.af$('tokenType',336898,'sys::Str',{}).af$('accessToken',336898,'sys::Str',{}).af$('refreshToken',336898,'sys::Str?',{}).af$('expiresIn',336898,'sys::Duration?',{}).af$('scope',336898,'sys::Str[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('accessToken','sys::Str',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{});
OAuthClient.type$.af$('emptyHeaders',100354,'[sys::Str:sys::Str]',{}).af$('tokenRef',67586,'concurrent::AtomicRef',{}).af$('tokenUri',67586,'sys::Uri?',{}).af$('refreshParams',67586,'[sys::Str:sys::Str]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('token','oauth2::AccessToken',false)]),{}).am$('makeRefreshable',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('token','oauth2::AccessToken',false),new sys.Param('tokenUri','sys::Uri',false),new sys.Param('params','[sys::Str:sys::Str]',false)]),{}).am$('token',4096,'oauth2::AccessToken',xp,{}).am$('call',8192,'web::WebClient',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('uri','sys::Uri',false),new sys.Param('req','sys::Obj?',true),new sys.Param('headers','[sys::Str:sys::Str]',true)]),{}).am$('doCall',2048,'web::WebClient',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('uri','sys::Uri',false),new sys.Param('req','sys::Obj?',false),new sys.Param('headers','[sys::Str:sys::Str]',false)]),{}).am$('prepare',8192,'web::WebClient',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Str',false),new sys.Param('uri','sys::Uri',false),new sys.Param('headers','[sys::Str:sys::Str]',true)]),{}).am$('refreshToken',8192,'sys::Void',xp,{'sys::NoDoc':""}).am$('readJson',36866,'sys::Map',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('toFile',34818,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
AuthReq.type$.af$('authUri',73730,'sys::Uri',{}).af$('clientId',73730,'sys::Str',{}).af$('redirectUri',73730,'sys::Uri?',{}).af$('scopes',73730,'sys::Str[]?',{}).af$('customParams',73730,'[sys::Str:sys::Str]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('authUri','sys::Uri',false),new sys.Param('clientId','sys::Str',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('build',270336,'[sys::Str:sys::Str]',xp,{}).am$('responseType',270337,'sys::Str',xp,{}).am$('authorize',270337,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('flowParams','[sys::Str:sys::Str]',false)]),{});
LoopbackAuthReq.type$.af$('responseType',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('authUri','sys::Uri',false),new sys.Param('clientId','sys::Str',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('checkHost',2048,'sys::Void',xp,{}).am$('authorize',271360,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('flowParams','[sys::Str:sys::Str]',false)]),{}).am$('verify',2048,'[sys::Str:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('authRes','[sys::Str:sys::Str]',false),new sys.Param('state','sys::Str',false)]),{});
LoopbackMod.type$.af$('authRes',73730,'concurrent::Future',{}).am$('make',8196,'sys::Void',xp,{}).am$('onGet',271360,'sys::Void',xp,{}).am$('checkError',2048,'sys::Bool',xp,{});
AuthReqErr.type$.af$('params',73730,'[sys::Str:sys::Str]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('params','[sys::Str:sys::Str]',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('error',8192,'sys::Str',xp,{}).am$('desc',8192,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "oauth2");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;inet 1.0;web 1.0;wisp 1.0;util 1.0");
m.set("pod.summary", "OAuth 2.0 Library");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:24-05:00 New_York");
m.set("build.tsKey", "241210143124");
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
  TokenReq,
  AuthCodeTokenReq,
  Pkce,
  OAuthErr,
  AuthCodeGrant,
  AccessToken,
  JsonAccessToken,
  RawAccessToken,
  OAuthClient,
  AuthReq,
  LoopbackAuthReq,
  AuthReqErr,
};
