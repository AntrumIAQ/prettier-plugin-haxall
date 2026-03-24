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
class PlatformNetworkLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PlatformNetworkLib.type$; }

  #platformSpi = null;

  platformSpi() { return this.#platformSpi; }

  __platformSpi(it) { if (it === undefined) return this.#platformSpi; else this.#platformSpi = it; }

  static make() {
    const $self = new PlatformNetworkLib();
    PlatformNetworkLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    $self.#platformSpi = sys.ObjUtil.coerce($self.rt().config().makeSpi("platformNetworkSpi"), PlatformNetworkSpi.type$);
    return;
  }

}

class PlatformNetworkFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PlatformNetworkFuncs.type$; }

  static platformNetworkInterfaceGet(name) {
    const this$ = this;
    return sys.ObjUtil.coerce(((this$) => { let $_u0 = PlatformNetworkFuncs.lib().platformSpi().interfaces().find((it) => {
      return sys.ObjUtil.equals(it.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), name);
    }); if ($_u0 != null) return $_u0; throw sys.Err.make(sys.Str.plus("Unknown interface: ", name)); })(this), haystack.Dict.type$);
  }

  static platformNetworkInterfaceSet(config) {
    PlatformNetworkFuncs.lib().platformSpi().interfaceSet(config);
    return config;
  }

  static platformNetworkInfo() {
    const this$ = this;
    let cx = PlatformNetworkFuncs.curContext();
    let lib = PlatformNetworkFuncs.lib(cx);
    let now = sys.DateTime.now();
    let gb = haystack.GridBuilder.make().addCol("dis").addCol("val").addCol("icon").addCol("edit").addCol("name");
    lib.platformSpi().interfaces().each((d) => {
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [d.dis(), "___", PlatformNetworkFuncs.infoIcon(sys.ObjUtil.coerce(d.trap("type", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$)), d.trap("type", sys.List.make(sys.Obj.type$.toNullable(), [])), d.trap("name", sys.List.make(sys.Obj.type$.toNullable(), []))]));
      d.each((v,n) => {
        if (PlatformNetworkFuncs.infoSkip(n)) {
          return;
        }
        ;
        gb.addRow(sys.List.make(sys.Str.type$.toNullable(), [PlatformNetworkFuncs.infoDis(n), PlatformNetworkFuncs.infoVal(v), null, null, null]));
        return;
      });
      return;
    });
    return gb.toGrid();
  }

  static infoSkip(n) {
    return (sys.ObjUtil.equals(n, "dis") || sys.ObjUtil.equals(n, "modes"));
  }

  static infoDis(n) {
    if (sys.ObjUtil.equals(n, "ip")) {
      return "IP Address";
    }
    ;
    if (sys.ObjUtil.equals(n, "dns")) {
      return "DNS";
    }
    ;
    if (sys.ObjUtil.equals(n, "mac")) {
      return "MAC";
    }
    ;
    return sys.Str.toDisplayName(n);
  }

  static infoVal(x) {
    if (sys.ObjUtil.is(x, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(x, sys.Type.find("sys::List")).join(", ");
    }
    ;
    return sys.ObjUtil.toStr(x);
  }

  static infoIcon(type) {
    if (sys.ObjUtil.equals(type, "ethernet")) {
      return "equip";
    }
    ;
    if (sys.ObjUtil.equals(type, "wifi")) {
      return "wifi";
    }
    ;
    return "network";
  }

  static pi(section,dis,val) {
    return haystack.Etc.dict3("section", section, "dis", dis, "val", val);
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static lib(cx) {
    if (cx === undefined) cx = PlatformNetworkFuncs.curContext();
    return sys.ObjUtil.coerce(cx.rt().lib("platformNetwork"), PlatformNetworkLib.type$);
  }

  static make() {
    const $self = new PlatformNetworkFuncs();
    PlatformNetworkFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class PlatformNetworkSpi {
  constructor() {
    const this$ = this;
  }

  typeof() { return PlatformNetworkSpi.type$; }

}

const p = sys.Pod.add$('hxPlatformNetwork');
const xp = sys.Param.noParams$();
let m;
PlatformNetworkLib.type$ = p.at$('PlatformNetworkLib','hx::HxLib',[],{},8194,PlatformNetworkLib);
PlatformNetworkFuncs.type$ = p.at$('PlatformNetworkFuncs','sys::Obj',[],{'sys::NoDoc':""},8194,PlatformNetworkFuncs);
PlatformNetworkSpi.type$ = p.am$('PlatformNetworkSpi','sys::Obj',[],{},8451,PlatformNetworkSpi);
PlatformNetworkLib.type$.af$('platformSpi',65666,'hxPlatformNetwork::PlatformNetworkSpi',{}).am$('make',8196,'sys::Void',xp,{});
PlatformNetworkFuncs.type$.am$('platformNetworkInterfaceGet',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{'axon::Axon':"axon::Axon{su=true;}"}).am$('platformNetworkInterfaceSet',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('config','haystack::Dict',false)]),{'axon::Axon':"axon::Axon{su=true;}"}).am$('platformNetworkInfo',40962,'haystack::Grid',xp,{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('infoSkip',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('infoDis',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('infoVal',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false)]),{}).am$('infoIcon',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false)]),{}).am$('pi',34818,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('section','sys::Str',false),new sys.Param('dis','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('lib',34818,'hxPlatformNetwork::PlatformNetworkLib',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',true)]),{}).am$('make',139268,'sys::Void',xp,{});
PlatformNetworkSpi.type$.am$('interfaces',270337,'haystack::Dict[]',xp,{}).am$('interfaceSet',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('config','haystack::Dict',false)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxPlatformNetwork");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;haystack 3.1.11;axon 3.1.11;hx 3.1.11");
m.set("pod.summary", "Platform support for IP network config");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:28-05:00 New_York");
m.set("build.tsKey", "241210143128");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("license.name", "Acadmemic Free License 3.0");
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
  PlatformNetworkLib,
  PlatformNetworkFuncs,
  PlatformNetworkSpi,
};
