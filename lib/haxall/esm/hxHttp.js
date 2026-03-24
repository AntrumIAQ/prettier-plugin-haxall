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
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as folio from './folio.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class HttpLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
    this.#wispRef = concurrent.AtomicRef.make(null);
    this.#rootRef = concurrent.AtomicRef.make(HttpRootMod.make(this));
    return;
  }

  typeof() { return HttpLib.type$; }

  #wispRef = null;

  // private field reflection only
  __wispRef(it) { if (it === undefined) return this.#wispRef; else this.#wispRef = it; }

  #rootRef = null;

  rootRef() { return this.#rootRef; }

  __rootRef(it) { if (it === undefined) return this.#rootRef; else this.#rootRef = it; }

  wisp() {
    return sys.ObjUtil.coerce(this.#wispRef.val(), wisp.WispService.type$);
  }

  services() {
    return sys.List.make(HttpLib.type$, [this]);
  }

  rec() {
    return sys.ObjUtil.coerce(hx.HxLib.prototype.rec.call(this), HttpSettings.type$);
  }

  root(checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(this.#rootRef.val(), web.WebMod.type$.toNullable());
  }

  siteUri() {
    let settings = this.rec();
    if ((settings.siteUri() != null && !sys.Str.isEmpty(settings.siteUri().toStr()))) {
      return settings.siteUri().plusSlash();
    }
    ;
    let host = inet.IpAddr.local().hostname();
    if (settings.httpsEnabled()) {
      return sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("https://", host), ":"), sys.ObjUtil.coerce(settings.httpsPort(), sys.Obj.type$.toNullable())), "/"));
    }
    else {
      return sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("http://", host), ":"), sys.ObjUtil.coerce(settings.httpPort(), sys.Obj.type$.toNullable())), "/"));
    }
    ;
  }

  apiUri() {
    return sys.Uri.fromStr("/api/");
  }

  onReady() {
    const this$ = this;
    let settings = this.rec();
    let addr = ((this$) => { if (((this$) => { let $_u1 = settings.addr(); if ($_u1 == null) return null; return sys.Str.trimToNull(settings.addr()); })(this$) == null) return null; return inet.IpAddr.make(sys.ObjUtil.coerce(settings.addr(), sys.Str.type$)); })(this);
    let httpsEnabled = settings.httpsEnabled();
    let httpsKeyStore = this.rt().crypto().httpsKey(false);
    let socketConfig = inet.SocketConfig.cur().copy((it) => {
      it.__keystore(httpsKeyStore);
      return;
    });
    if ((httpsEnabled && httpsKeyStore == null)) {
      (httpsEnabled = false);
      this.log().err("Failed to obtain entry with alias 'https' from the keystore. Disabling HTTPS");
    }
    ;
    let $wisp = wisp.WispService.make((it) => {
      it.__httpPort(sys.ObjUtil.coerce(settings.httpPort(), sys.Int.type$.toNullable()));
      it.__httpsPort(((this$) => { if (httpsEnabled) return sys.ObjUtil.coerce(settings.httpsPort(), sys.Int.type$.toNullable()); return null; })(this$));
      it.__addr(addr);
      it.__maxThreads(settings.maxThreads());
      it.__root(sys.ObjUtil.coerce(this$.root(), web.WebMod.type$));
      it.__errMod(((this$) => { if (sys.ObjUtil.is(it.errMod(), wisp.WispDefaultErrMod.type$)) return HttpErrMod.make(this$); return it.errMod(); })(this$));
      it.__socketConfig(socketConfig);
      return;
    });
    this.#wispRef.val($wisp);
    $wisp.start();
    return;
  }

  onUnready() {
    this.wisp().stop();
    return;
  }

  static make() {
    const $self = new HttpLib();
    HttpLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    ;
    return;
  }

}

class HttpRootMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HttpRootMod.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  static make(lib) {
    const $self = new HttpRootMod();
    HttpRootMod.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    web.WebMod.make$($self);
    $self.#rt = lib.rt();
    $self.#lib = lib;
    return;
  }

  onService() {
    let req = this.req();
    let res = this.res();
    let libName = ((this$) => { let $_u4 = req.modRel().path().first(); if ($_u4 != null) return $_u4; return ""; })(this);
    if (sys.Str.isEmpty(libName)) {
      return res.redirect(sys.Uri.fromStr("/shell"));
    }
    ;
    let lib = this.#rt.lib(sys.Str.plus("hx", sys.Str.capitalize(libName)), false);
    if (lib == null) {
      (lib = this.#rt.lib(sys.ObjUtil.coerce(libName, sys.Str.type$), false));
    }
    ;
    if (lib == null) {
      return res.sendErr(404);
    }
    ;
    let libWeb = lib.web();
    if (libWeb.isUnsupported()) {
      return res.sendErr(404);
    }
    ;
    req.mod(libWeb);
    req.modBase(req.modBase().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", libName), "/"))));
    libWeb.onService();
    return;
  }

}

class HttpSettings extends haystack.TypedDict {
  constructor() {
    super();
    const this$ = this;
    this.#httpsEnabled = false;
    this.#httpPort = 8080;
    this.#httpsPort = 443;
    this.#maxThreads = 500;
    this.#disableErrTrace = false;
    return;
  }

  typeof() { return HttpSettings.type$; }

  #siteUri = null;

  siteUri() { return this.#siteUri; }

  __siteUri(it) { if (it === undefined) return this.#siteUri; else this.#siteUri = it; }

  #addr = null;

  addr() { return this.#addr; }

  __addr(it) { if (it === undefined) return this.#addr; else this.#addr = it; }

  #httpsEnabled = false;

  httpsEnabled() { return this.#httpsEnabled; }

  __httpsEnabled(it) { if (it === undefined) return this.#httpsEnabled; else this.#httpsEnabled = it; }

  #httpPort = 0;

  httpPort() { return this.#httpPort; }

  __httpPort(it) { if (it === undefined) return this.#httpPort; else this.#httpPort = it; }

  #httpsPort = 0;

  httpsPort() { return this.#httpsPort; }

  __httpsPort(it) { if (it === undefined) return this.#httpsPort; else this.#httpsPort = it; }

  #maxThreads = 0;

  maxThreads() { return this.#maxThreads; }

  __maxThreads(it) { if (it === undefined) return this.#maxThreads; else this.#maxThreads = it; }

  #disableErrTrace = false;

  disableErrTrace() { return this.#disableErrTrace; }

  __disableErrTrace(it) { if (it === undefined) return this.#disableErrTrace; else this.#disableErrTrace = it; }

  static make(d,f) {
    const $self = new HttpSettings();
    HttpSettings.make$($self,d,f);
    return $self;
  }

  static make$($self,d,f) {
    haystack.TypedDict.make$($self, d);
    ;
    sys.Func.call(f, $self);
    return;
  }

}

class HttpFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HttpFuncs.type$; }

  static httpSiteUri() {
    return HttpFuncs.curContext().rt().http().siteUri();
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static make() {
    const $self = new HttpFuncs();
    HttpFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HttpErrMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HttpErrMod.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  static make(lib) {
    const $self = new HttpErrMod();
    HttpErrMod.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    web.WebMod.make$($self);
    $self.#lib = lib;
    return;
  }

  onService() {
    let err = sys.ObjUtil.coerce(this.req().stash().get("err"), sys.Err.type$);
    let errTrace = ((this$) => { if (this$.#lib.rec().disableErrTrace()) return err.toStr(); return err.traceToStr(); })(this);
    this.res().headers().set("Content-Type", "text/html; charset=utf-8");
    this.res().out().html().head().title().w(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.res().statusCode(), sys.Obj.type$.toNullable())), " INTERNAL SERVER ERROR")).titleEnd().headEnd().body().h1().w(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.res().statusCode(), sys.Obj.type$.toNullable())), " INTERNAL SERVER ERROR")).h1End().pre().esc(errTrace).preEnd().bodyEnd().htmlEnd();
    return;
  }

}

const p = sys.Pod.add$('hxHttp');
const xp = sys.Param.noParams$();
let m;
HttpLib.type$ = p.at$('HttpLib','hx::HxLib',['hx::HxHttpService'],{},8194,HttpLib);
HttpRootMod.type$ = p.at$('HttpRootMod','web::WebMod',[],{},130,HttpRootMod);
HttpSettings.type$ = p.at$('HttpSettings','haystack::TypedDict',[],{},8194,HttpSettings);
HttpFuncs.type$ = p.at$('HttpFuncs','sys::Obj',[],{},8194,HttpFuncs);
HttpErrMod.type$ = p.at$('HttpErrMod','web::WebMod',[],{},130,HttpErrMod);
HttpLib.type$.af$('wispRef',67586,'concurrent::AtomicRef',{}).af$('rootRef',73730,'concurrent::AtomicRef',{}).am$('wisp',8192,'wisp::WispService',xp,{}).am$('services',271360,'hx::HxService[]',xp,{}).am$('rec',271360,'hxHttp::HttpSettings',xp,{}).am$('root',271360,'web::WebMod?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('siteUri',271360,'sys::Uri',xp,{}).am$('apiUri',271360,'sys::Uri',xp,{}).am$('onReady',271360,'sys::Void',xp,{}).am$('onUnready',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
HttpRootMod.type$.af$('rt',73730,'hx::HxRuntime',{}).af$('lib',73730,'hxHttp::HttpLib',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxHttp::HttpLib',false)]),{}).am$('onService',271360,'sys::Void',xp,{});
HttpSettings.type$.af$('siteUri',73730,'sys::Uri?',{'haystack::TypedTag':""}).af$('addr',73730,'sys::Str?',{'haystack::TypedTag':"haystack::TypedTag{restart=true;}"}).af$('httpsEnabled',73730,'sys::Bool',{'haystack::TypedTag':"haystack::TypedTag{restart=true;}"}).af$('httpPort',73730,'sys::Int',{'haystack::TypedTag':"haystack::TypedTag{restart=true;}"}).af$('httpsPort',73730,'sys::Int',{'haystack::TypedTag':"haystack::TypedTag{restart=true;}"}).af$('maxThreads',73730,'sys::Int',{'haystack::TypedTag':"haystack::TypedTag{restart=true;}"}).af$('disableErrTrace',73730,'sys::Bool',{'haystack::TypedTag':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Dict',false),new sys.Param('f','|sys::This->sys::Void|',false)]),{});
HttpFuncs.type$.am$('httpSiteUri',40962,'sys::Uri',xp,{'axon::Axon':""}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('make',139268,'sys::Void',xp,{});
HttpErrMod.type$.af$('lib',73730,'hxHttp::HttpLib',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxHttp::HttpLib',false)]),{}).am$('onService',271360,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxHttp");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;inet 1.0;web 1.0;wisp 1.0;haystack 3.1.11;axon 3.1.11;hx 3.1.11");
m.set("pod.summary", "HTTP service handling library");
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
  HttpLib,
  HttpSettings,
  HttpFuncs,
};
