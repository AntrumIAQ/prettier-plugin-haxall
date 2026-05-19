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
class FileMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FileMod.type$; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  static make(f) {
    const $self = new FileMod();
    FileMod.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    web.WebMod.make$($self);
    ((this$) => { let $_u0 = f; if ($_u0 == null) return null; return sys.Func.call(f, this$); })($self);
    return;
  }

  onService() {
    if (!this.#file.isDir()) {
      if (!this.req().modRel().path().isEmpty()) {
        this.res().sendErr(404);
        return;
      }
      ;
      web.FileWeblet.make(this.#file).onService();
      return;
    }
    ;
    let f = this.#file.plus(this.req().modRel(), false);
    if (f.isDir()) {
      if (!this.req().uri().isDir()) {
        this.res().redirect(this.req().uri().plusSlash());
        return;
      }
      ;
      (f = f.plus(sys.Uri.fromStr("index.html")));
    }
    ;
    if (!f.exists()) {
      this.res().sendErr(404);
      return;
    }
    ;
    web.FileWeblet.make(f).checkUnderDir(this.#file).onService();
    return;
  }

}

class LogMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
    this.#dir = LogMod.noDir();
    this.#filename = "";
    this.#fields = "date time c-ip cs(X-Real-IP) cs-method cs-uri-stem cs-uri-query sc-status time-taken cs(User-Agent) cs(Referer)";
    return;
  }

  typeof() { return LogMod.type$; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  static #noDir = undefined;

  static noDir() {
    if (LogMod.#noDir === undefined) {
      LogMod.static$init();
      if (LogMod.#noDir === undefined) LogMod.#noDir = null;
    }
    return LogMod.#noDir;
  }

  #filename = null;

  filename() { return this.#filename; }

  __filename(it) { if (it === undefined) return this.#filename; else this.#filename = it; }

  #fields = null;

  fields() { return this.#fields; }

  __fields(it) { if (it === undefined) return this.#fields; else this.#fields = it; }

  static #formatters = undefined;

  static formatters() {
    if (LogMod.#formatters === undefined) {
      LogMod.static$init();
      if (LogMod.#formatters === undefined) LogMod.#formatters = null;
    }
    return LogMod.#formatters;
  }

  #logger = null;

  // private field reflection only
  __logger(it) { if (it === undefined) return this.#logger; else this.#logger = it; }

  static make(f) {
    const $self = new LogMod();
    LogMod.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    const this$ = $self;
    web.WebMod.make$($self);
    ;
    if (f != null) {
      sys.Func.call(f, $self);
    }
    ;
    $self.#logger = util.FileLogger.make((it) => {
      it.__dir(this$.#dir);
      it.__filename(this$.#filename);
      it.__onOpen(sys.ObjUtil.coerce(((this$) => { let $_u1 = (out) => {
        this$.onOpen(sys.ObjUtil.coerce(out, sys.OutStream.type$));
        return;
      }; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable((out) => {
        this$.onOpen(sys.ObjUtil.coerce(out, sys.OutStream.type$));
        return;
      }); })(this$), sys.Type.find("|sys::OutStream->sys::Void|?")));
      return;
    });
    return;
  }

  onOpen(out) {
    out.printLine("#Remark ==========================================================================");
    out.printLine(sys.Str.plus("#Remark ", sys.DateTime.now().toLocale()));
    out.printLine("#Version 1.0");
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("#Software ", sys.Type.of(this)), " "), sys.Pod.of(this).version()));
    out.printLine(sys.Str.plus("#Start-Date ", sys.DateTime.nowUtc().toLocale("YYYY-MM-DD hh:mm:ss")));
    out.printLine(sys.Str.plus("#Fields ", this.#fields));
    return;
  }

  onStop() {
    this.#logger.stop();
    return;
  }

  onService() {
    const this$ = this;
    try {
      let s = sys.StrBuf.make(256);
      sys.Str.split(this.#fields).each((field,i) => {
        if (sys.ObjUtil.compareNE(i, 0)) {
          s.add(" ");
        }
        ;
        let m = LogMod.formatters().get(field);
        if (m != null) {
          s.add(m.call(this$.req(), this$.res()));
          return;
        }
        ;
        if (sys.Str.startsWith(field, "cs(")) {
          s.add(LogMod.formatCsHeader(this$.req(), sys.Str.getRange(field, sys.Range.make(3, -2))));
          return;
        }
        ;
        s.add("-");
        return;
      });
      this.#logger.writeStr(s.toStr());
    }
    catch ($_u2) {
      $_u2 = sys.Err.make($_u2);
      if ($_u2 instanceof sys.Err) {
        let e = $_u2;
        ;
        this.#logger.writeStr(sys.Str.plus("# ", e));
      }
      else {
        throw $_u2;
      }
    }
    ;
    return;
  }

  static formatDate(req,res) {
    return sys.DateTime.nowUtc().toLocale("YYYY-MM-DD");
  }

  static formatTime(req,res) {
    return sys.DateTime.nowUtc().toLocale("hh:mm:ss");
  }

  static formatCIp(req,res) {
    return req.remoteAddr().numeric();
  }

  static formatCPort(req,res) {
    return sys.Int.toStr(req.remotePort());
  }

  static formatCsMethod(req,res) {
    return req.method();
  }

  static formatCsUri(req,res) {
    return req.uri().encode();
  }

  static formatCsUriStem(req,res) {
    return req.uri().pathOnly().encode();
  }

  static formatCsUriQuery(req,res) {
    if (req.uri().query().isEmpty()) {
      return "-";
    }
    ;
    return sys.Uri.encodeQuery(req.uri().query());
  }

  static formatScStatus(req,res) {
    return sys.Int.toStr(res.statusCode());
  }

  static formatTimeTaken(req,res) {
    let d = sys.Duration.now().minus(sys.ObjUtil.coerce(req.stash().get("web.startTime"), sys.Duration.type$));
    return sys.Int.toStr(d.toMillis());
  }

  static formatCsHeader(req,headerName) {
    let s = req.headers().get(headerName);
    if ((s == null || sys.Str.isEmpty(s))) {
      return "-";
    }
    ;
    return sys.Str.plus(sys.Str.plus("\"", sys.Str.replace(s, "\"", "\"\"")), "\"");
  }

  static static$init() {
    LogMod.#noDir = sys.ObjUtil.coerce(sys.File.make(sys.Uri.fromStr("no-dir-configured")), sys.File.type$);
    LogMod.#formatters = sys.ObjUtil.coerce(((this$) => { let $_u3 = sys.Map.__fromLiteral(["date","time","c-ip","c-port","cs-method","cs-uri","cs-uri-stem","cs-uri-query","sc-status","time-taken"], [LogMod.type$.slot("formatDate"),LogMod.type$.slot("formatTime"),LogMod.type$.slot("formatCIp"),LogMod.type$.slot("formatCPort"),LogMod.type$.slot("formatCsMethod"),LogMod.type$.slot("formatCsUri"),LogMod.type$.slot("formatCsUriStem"),LogMod.type$.slot("formatCsUriQuery"),LogMod.type$.slot("formatScStatus"),LogMod.type$.slot("formatTimeTaken")], sys.Type.find("sys::Str"), sys.Type.find("sys::Method")); if ($_u3 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["date","time","c-ip","c-port","cs-method","cs-uri","cs-uri-stem","cs-uri-query","sc-status","time-taken"], [LogMod.type$.slot("formatDate"),LogMod.type$.slot("formatTime"),LogMod.type$.slot("formatCIp"),LogMod.type$.slot("formatCPort"),LogMod.type$.slot("formatCsMethod"),LogMod.type$.slot("formatCsUri"),LogMod.type$.slot("formatCsUriStem"),LogMod.type$.slot("formatCsUriQuery"),LogMod.type$.slot("formatScStatus"),LogMod.type$.slot("formatTimeTaken")], sys.Type.find("sys::Str"), sys.Type.find("sys::Method"))); })(this), sys.Type.find("[sys::Str:sys::Method]"));
    return;
  }

}

class PipelineMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
    this.#before = sys.ObjUtil.coerce(((this$) => { let $_u4 = sys.List.make(web.WebMod.type$); if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(web.WebMod.type$)); })(this), sys.Type.find("web::WebMod[]"));
    this.#steps = sys.ObjUtil.coerce(((this$) => { let $_u5 = sys.List.make(web.WebMod.type$); if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(web.WebMod.type$)); })(this), sys.Type.find("web::WebMod[]"));
    this.#after = sys.ObjUtil.coerce(((this$) => { let $_u6 = sys.List.make(web.WebMod.type$); if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(sys.List.make(web.WebMod.type$)); })(this), sys.Type.find("web::WebMod[]"));
    return;
  }

  typeof() { return PipelineMod.type$; }

  #before = null;

  before() { return this.#before; }

  __before(it) { if (it === undefined) return this.#before; else this.#before = it; }

  #steps = null;

  steps() { return this.#steps; }

  __steps(it) { if (it === undefined) return this.#steps; else this.#steps = it; }

  #after = null;

  after() { return this.#after; }

  __after(it) { if (it === undefined) return this.#after; else this.#after = it; }

  static make(f) {
    const $self = new PipelineMod();
    PipelineMod.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    web.WebMod.make$($self);
    ;
    ((this$) => { let $_u7 = f; if ($_u7 == null) return null; return sys.Func.call(f, this$); })($self);
    if (($self.#before.isEmpty() && $self.#steps.isEmpty() && $self.#after.isEmpty())) {
      throw sys.ArgErr.make("PipelineMod has not steps configured");
    }
    ;
    return;
  }

  onStart() {
    const this$ = this;
    this.#before.each((mod) => {
      mod.onStart();
      return;
    });
    this.#steps.each((mod) => {
      mod.onStart();
      return;
    });
    this.#after.each((mod) => {
      mod.onStart();
      return;
    });
    return;
  }

  onStop() {
    const this$ = this;
    this.#before.each((mod) => {
      mod.onStop();
      return;
    });
    this.#steps.each((mod) => {
      mod.onStop();
      return;
    });
    this.#after.each((mod) => {
      mod.onStop();
      return;
    });
    return;
  }

  onService() {
    const this$ = this;
    this.#before.each((mod) => {
      this$.req().mod(mod);
      mod.onService();
      return;
    });
    this.#steps.each((mod) => {
      this$.req().mod(mod);
      if (!this$.res().isDone()) {
        mod.onService();
      }
      ;
      return;
    });
    this.#after.each((mod) => {
      this$.req().mod(mod);
      mod.onService();
      return;
    });
    return;
  }

}

class RouteMod extends web.WebMod {
  constructor() {
    super();
    const this$ = this;
    this.#routes = sys.ObjUtil.coerce(((this$) => { let $_u8 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("web::WebMod")); if ($_u8 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("web::WebMod"))); })(this), sys.Type.find("[sys::Str:web::WebMod]"));
    return;
  }

  typeof() { return RouteMod.type$; }

  #routes = null;

  routes() { return this.#routes; }

  __routes(it) { if (it === undefined) return this.#routes; else this.#routes = it; }

  static make(f) {
    const $self = new RouteMod();
    RouteMod.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    web.WebMod.make$($self);
    ;
    ((this$) => { let $_u9 = f; if ($_u9 == null) return null; return sys.Func.call(f, this$); })($self);
    if ($self.#routes.isEmpty()) {
      throw sys.ArgErr.make("RouteMod.routes is empty");
    }
    ;
    return;
  }

  onService() {
    let name = this.req().modRel().path().first();
    let route = this.#routes.get(sys.ObjUtil.coerce(((this$) => { let $_u10 = name; if ($_u10 != null) return $_u10; return "index"; })(this), sys.Str.type$));
    if (route == null) {
      this.res().sendErr(404);
      return;
    }
    ;
    this.req().mod(sys.ObjUtil.coerce(route, web.WebMod.type$));
    if (name != null) {
      this.req().modBase(this.req().modBase().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", name), "/"))));
    }
    ;
    route.onService();
    return;
  }

  onStart() {
    const this$ = this;
    this.#routes.each((mod) => {
      mod.onStart();
      return;
    });
    return;
  }

  onStop() {
    const this$ = this;
    this.#routes.each((mod) => {
      mod.onStop();
      return;
    });
    return;
  }

}

const p = sys.Pod.add$('webmod');
const xp = sys.Param.noParams$();
let m;
FileMod.type$ = p.at$('FileMod','web::WebMod',[],{},8194,FileMod);
LogMod.type$ = p.at$('LogMod','web::WebMod',[],{},8194,LogMod);
PipelineMod.type$ = p.at$('PipelineMod','web::WebMod',[],{},8194,PipelineMod);
RouteMod.type$ = p.at$('RouteMod','web::WebMod',[],{},8194,RouteMod);
FileMod.type$.af$('file',73730,'sys::File',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',false)]),{}).am$('onService',271360,'sys::Void',xp,{});
LogMod.type$.af$('dir',73730,'sys::File',{}).af$('noDir',100354,'sys::File',{}).af$('filename',73730,'sys::Str',{}).af$('fields',73730,'sys::Str',{}).af$('formatters',98434,'[sys::Str:sys::Method]',{}).af$('logger',67586,'util::FileLogger',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('onOpen',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('onStop',271360,'sys::Void',xp,{}).am$('onService',271360,'sys::Void',xp,{}).am$('formatDate',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('formatTime',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('formatCIp',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('formatCPort',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('formatCsMethod',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('formatCsUri',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('formatCsUriStem',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('formatCsUriQuery',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('formatScStatus',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('formatTimeTaken',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('formatCsHeader',32898,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('req','web::WebReq',false),new sys.Param('headerName','sys::Str',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
PipelineMod.type$.af$('before',73730,'web::WebMod[]',{}).af$('steps',73730,'web::WebMod[]',{}).af$('after',73730,'web::WebMod[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',false)]),{}).am$('onStart',271360,'sys::Void',xp,{}).am$('onStop',271360,'sys::Void',xp,{}).am$('onService',271360,'sys::Void',xp,{});
RouteMod.type$.af$('routes',73730,'[sys::Str:web::WebMod]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',false)]),{}).am$('onService',271360,'sys::Void',xp,{}).am$('onStart',271360,'sys::Void',xp,{}).am$('onStop',271360,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "webmod");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;inet 1.0;web 1.0;util 1.0");
m.set("pod.summary", "Standard library of WebMods");
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
m.set("org.uri", "https://fantom.org/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  FileMod,
  LogMod,
  PipelineMod,
  RouteMod,
};
