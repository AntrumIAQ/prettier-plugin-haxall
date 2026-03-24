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
class PlatformLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PlatformLib.type$; }

  #platformSpi = null;

  platformSpi() { return this.#platformSpi; }

  __platformSpi(it) { if (it === undefined) return this.#platformSpi; else this.#platformSpi = it; }

  static make() {
    const $self = new PlatformLib();
    PlatformLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    $self.#platformSpi = sys.ObjUtil.coerce($self.rt().config().makeSpi("platformSpi"), PlatformSpi.type$);
    return;
  }

}

class PlatformSpi {
  constructor() {
    const this$ = this;
  }

  typeof() { return PlatformSpi.type$; }

}

class PlatformFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PlatformFuncs.type$; }

  static platformReboot() {
    PlatformFuncs.lib().platformSpi().reboot();
    return;
  }

  static platformRestart() {
    PlatformFuncs.lib().platformSpi().restart();
    return;
  }

  static platformShutdown() {
    PlatformFuncs.lib().platformSpi().shutdown();
    return;
  }

  static platformInfo() {
    let cx = PlatformFuncs.curContext();
    let info = PlatformFuncs.platformInfoDefaults(cx.rt()).addAll(PlatformFuncs.lib(cx).platformSpi().info());
    let gb = haystack.GridBuilder.make().addCol("dis").addCol("val").addCol("icon");
    PlatformFuncs.platformInfoSection(gb, info, "sw", "Software", "host");
    PlatformFuncs.platformInfoSection(gb, info, "hw", "Hardware", "cpu");
    PlatformFuncs.platformInfoSection(gb, info, "os", "OS", "hdd");
    PlatformFuncs.platformInfoSection(gb, info, "java", "Java", "java");
    return gb.toGrid();
  }

  static platformInfoSection(gb,info,name,dis,icon) {
    const this$ = this;
    let matches = info.findAll((x) => {
      return sys.ObjUtil.equals(x.get("section"), name);
    });
    if (matches.isEmpty()) {
      return;
    }
    ;
    gb.addRow(sys.List.make(sys.Str.type$, [dis, "___", icon]));
    matches.each((r) => {
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [r.get("dis"), r.get("val"), null]));
      return;
    });
    return;
  }

  static platformInfoDefaults(rt) {
    let env = sys.Env.cur().vars();
    let now = sys.DateTime.now();
    return sys.List.make(haystack.Dict.type$, [PlatformFuncs.pi("sw", "Name", rt.platform().productName()), PlatformFuncs.pi("sw", "Version", rt.platform().productVersion()), PlatformFuncs.pi("sw", "Time", sys.Str.plus(sys.Str.plus(sys.Str.plus(now.time().toLocale(), " "), now.date().toLocale()), now.tz().name())), PlatformFuncs.pi("sw", "Uptime", sys.Duration.uptime().toLocale()), PlatformFuncs.pi("os", "Name", sys.Str.plus(sys.Str.plus(env.get("os.name"), " "), env.get("os.arch"))), PlatformFuncs.pi("os", "Version", sys.ObjUtil.coerce(env.get("os.version"), sys.Str.type$)), PlatformFuncs.pi("java", "Name", sys.Str.plus(sys.Str.plus(env.get("java.vm.name"), " "), env.get("java.vm.version"))), PlatformFuncs.pi("java", "Version", sys.ObjUtil.coerce(env.get("java.version"), sys.Str.type$))]);
  }

  static pi(section,dis,val) {
    return haystack.Etc.dict3("section", section, "dis", dis, "val", val);
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static lib(cx) {
    if (cx === undefined) cx = PlatformFuncs.curContext();
    return sys.ObjUtil.coerce(cx.rt().lib("platform"), PlatformLib.type$);
  }

  static make() {
    const $self = new PlatformFuncs();
    PlatformFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

const p = sys.Pod.add$('hxPlatform');
const xp = sys.Param.noParams$();
let m;
PlatformLib.type$ = p.at$('PlatformLib','hx::HxLib',[],{},8194,PlatformLib);
PlatformSpi.type$ = p.am$('PlatformSpi','sys::Obj',[],{},8451,PlatformSpi);
PlatformFuncs.type$ = p.at$('PlatformFuncs','sys::Obj',[],{'sys::NoDoc':""},8194,PlatformFuncs);
PlatformLib.type$.af$('platformSpi',65666,'hxPlatform::PlatformSpi',{}).am$('make',8196,'sys::Void',xp,{});
PlatformSpi.type$.am$('reboot',270337,'sys::Void',xp,{}).am$('restart',270337,'sys::Void',xp,{}).am$('shutdown',270337,'sys::Void',xp,{}).am$('info',270337,'haystack::Dict[]',xp,{});
PlatformFuncs.type$.am$('platformReboot',40962,'sys::Void',xp,{'axon::Axon':"axon::Axon{su=true;}"}).am$('platformRestart',40962,'sys::Void',xp,{'axon::Axon':"axon::Axon{su=true;}"}).am$('platformShutdown',40962,'sys::Void',xp,{'axon::Axon':"axon::Axon{su=true;}"}).am$('platformInfo',40962,'haystack::Grid',xp,{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('platformInfoSection',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('gb','haystack::GridBuilder',false),new sys.Param('info','haystack::Dict[]',false),new sys.Param('name','sys::Str',false),new sys.Param('dis','sys::Str',false),new sys.Param('icon','sys::Str',false)]),{}).am$('platformInfoDefaults',34818,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false)]),{}).am$('pi',34818,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('section','sys::Str',false),new sys.Param('dis','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('lib',34818,'hxPlatform::PlatformLib',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',true)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxPlatform");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;haystack 3.1.11;axon 3.1.11;hx 3.1.11");
m.set("pod.summary", "Platform support for basic functionality");
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
  PlatformLib,
  PlatformSpi,
  PlatformFuncs,
};
