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
import * as obs from './obs.js'
import * as hx from './hx.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class HxApiWeb extends hx.HxLibWeb {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxApiWeb.type$; }

  doReadReq() { return haystack.WebOpUtil.prototype.doReadReq.apply(this, arguments); }

  ioOpts() { return haystack.WebOpUtil.prototype.ioOpts.apply(this, arguments); }

  doWriteRes() { return haystack.WebOpUtil.prototype.doWriteRes.apply(this, arguments); }

  acceptMimeType() { return haystack.WebOpUtil.prototype.acceptMimeType.apply(this, arguments); }

  toFiletype() { return haystack.WebOpUtil.prototype.toFiletype.apply(this, arguments); }

  doReadReqPost() { return haystack.WebOpUtil.prototype.doReadReqPost.apply(this, arguments); }

  doReadReqGet() { return haystack.WebOpUtil.prototype.doReadReqGet.apply(this, arguments); }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  static make(lib) {
    const $self = new HxApiWeb();
    HxApiWeb.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    hx.HxLibWeb.make$($self, lib);
    $self.#lib = lib;
    return;
  }

  ns() {
    return this.#lib.rt().ns();
  }

  onService() {
    let req = this.req();
    let res = this.res();
    try {
      let path = req.modRel().path();
      let opName = this.pathToOpName(path);
      if (opName == null) {
        return res.sendErr(404);
      }
      ;
      let cx = this.rt().user().authenticate(req, res);
      if (cx == null) {
        return;
      }
      ;
      cx.timeout(hx.HxContext.timeoutDef());
      concurrent.Actor.locals().set(haystack.Etc.cxActorLocalsKey(), cx);
      let opDef = cx.ns().def(sys.Str.plus("op:", opName), false);
      if (opDef == null) {
        return res.sendErr(404);
      }
      ;
      concurrent.Actor.locals().set("hxApiOp.spi", HxApiOpSpiImpl.make(this.ns(), sys.ObjUtil.coerce(opDef, haystack.Def.type$)));
      let typeName = ((this$) => { let $_u0 = sys.ObjUtil.as(opDef.get("typeName"), sys.Str.type$); if ($_u0 != null) return $_u0; throw sys.Err.make(sys.Str.plus("Op missing typeName: ", opName)); })(this);
      let op = sys.ObjUtil.coerce(sys.Type.find(sys.ObjUtil.coerce(typeName, sys.Str.type$)).make(), hx.HxApiOp.type$);
      op.onService(req, res, sys.ObjUtil.coerce(cx, hx.HxContext.type$));
    }
    catch ($_u1) {
      $_u1 = sys.Err.make($_u1);
      if ($_u1 instanceof sys.Err) {
        let e = $_u1;
        ;
        if (res.isCommitted()) {
          e.trace();
        }
        else {
          this.writeRes(this.toErrGrid(e));
        }
        ;
      }
      else {
        throw $_u1;
      }
    }
    finally {
      concurrent.Actor.locals().remove(haystack.Etc.cxActorLocalsKey());
      concurrent.Actor.locals().remove("hxApiOp.spi");
    }
    ;
    return;
  }

  pathToOpName(path) {
    if (sys.ObjUtil.equals(path.size(), 1)) {
      return path.get(0);
    }
    ;
    if (sys.ObjUtil.equals(path.size(), 2)) {
      let cluster = sys.ObjUtil.as(this.#lib.rt().services().get(hx.HxClusterService.type$, false), hx.HxClusterService.type$);
      if ((cluster != null && sys.ObjUtil.equals(path.get(0), cluster.nodeId().segs().get(0).body()))) {
        return path.get(1);
      }
      ;
    }
    ;
    return null;
  }

  readReq() {
    return this.doReadReq(this.req(), this.res());
  }

  writeRes(result) {
    if (this.res().isCommitted()) {
      return;
    }
    ;
    this.doWriteRes(this.req(), this.res(), haystack.Etc.toGrid(result));
    return;
  }

  toErrGrid(err,meta) {
    if (meta === undefined) meta = null;
    if (this.#lib.rec().has("disableErrTrace")) {
      (meta = haystack.Etc.makeDict(meta));
      (meta = haystack.Etc.dictSet(sys.ObjUtil.coerce(meta, haystack.Dict.type$.toNullable()), "errTrace", sys.Str.plus(sys.Str.plus("", err), "\n  Trace disabled")));
    }
    ;
    return haystack.Etc.makeErrGrid(err, meta);
  }

}

class HxApiOpSpiImpl extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxApiOpSpiImpl.type$; }

  doReadReq() { return haystack.WebOpUtil.prototype.doReadReq.apply(this, arguments); }

  ioOpts() { return haystack.WebOpUtil.prototype.ioOpts.apply(this, arguments); }

  doWriteRes() { return haystack.WebOpUtil.prototype.doWriteRes.apply(this, arguments); }

  acceptMimeType() { return haystack.WebOpUtil.prototype.acceptMimeType.apply(this, arguments); }

  toFiletype() { return haystack.WebOpUtil.prototype.toFiletype.apply(this, arguments); }

  doReadReqPost() { return haystack.WebOpUtil.prototype.doReadReqPost.apply(this, arguments); }

  doReadReqGet() { return haystack.WebOpUtil.prototype.doReadReqGet.apply(this, arguments); }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #def = null;

  def() { return this.#def; }

  __def(it) { if (it === undefined) return this.#def; else this.#def = it; }

  static make(ns,def) {
    const $self = new HxApiOpSpiImpl();
    HxApiOpSpiImpl.make$($self,ns,def);
    return $self;
  }

  static make$($self,ns,def) {
    $self.#ns = ns;
    $self.#name = def.name();
    $self.#def = def;
    return;
  }

  readReq(op,req,res) {
    if ((req.isGet() && !op.isGetAllowed())) {
      res.sendErr(405, sys.Str.plus(sys.Str.plus("GET not allowed for op '", this.#name), "'"));
      return null;
    }
    ;
    return this.doReadReq(req, res);
  }

  writeRes(op,req,res,grid) {
    this.doWriteRes(req, res, grid);
    return;
  }

}

class HxApiLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
    this.#web = HxApiWeb.make(this);
    return;
  }

  typeof() { return HxApiLib.type$; }

  #web = null;

  web() { return this.#web; }

  __web(it) { if (it === undefined) return this.#web; else this.#web = it; }

  static make() {
    const $self = new HxApiLib();
    HxApiLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    ;
    return;
  }

}

const p = sys.Pod.add$('hxApi');
const xp = sys.Param.noParams$();
let m;
HxApiWeb.type$ = p.at$('HxApiWeb','hx::HxLibWeb',['haystack::WebOpUtil'],{},8194,HxApiWeb);
HxApiOpSpiImpl.type$ = p.at$('HxApiOpSpiImpl','sys::Obj',['haystack::WebOpUtil','hx::HxApiOpSpi'],{},130,HxApiOpSpiImpl);
HxApiLib.type$ = p.at$('HxApiLib','hx::HxLib',[],{},8194,HxApiLib);
HxApiWeb.type$.af$('lib',336898,'hx::HxLib',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxLib',false)]),{}).am$('ns',271360,'haystack::Namespace',xp,{}).am$('onService',271360,'sys::Void',xp,{}).am$('pathToOpName',2048,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('path','sys::Str[]',false)]),{}).am$('readReq',2048,'haystack::Grid?',xp,{}).am$('writeRes',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('result','sys::Obj?',false)]),{}).am$('toErrGrid',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err',false),new sys.Param('meta','sys::Obj?',true)]),{});
HxApiOpSpiImpl.type$.af$('ns',336898,'haystack::Namespace',{}).af$('name',336898,'sys::Str',{}).af$('def',336898,'haystack::Def',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','haystack::Namespace',false),new sys.Param('def','haystack::Def',false)]),{}).am$('readReq',271360,'haystack::Grid?',sys.List.make(sys.Param.type$,[new sys.Param('op','hx::HxApiOp',false),new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false)]),{}).am$('writeRes',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('op','hx::HxApiOp',false),new sys.Param('req','web::WebReq',false),new sys.Param('res','web::WebRes',false),new sys.Param('grid','haystack::Grid',false)]),{});
HxApiLib.type$.af$('web',336898,'hxApi::HxApiWeb',{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxApi");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;web 1.0;haystack 3.1.11;axon 3.1.11;folio 3.1.11;hx 3.1.11");
m.set("pod.summary", "Haxall Haystack HTTP API library");
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



// cjs exports begin
export {
  HxApiWeb,
  HxApiLib,
};
