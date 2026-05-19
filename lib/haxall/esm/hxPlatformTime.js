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
class PlatformTimeLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PlatformTimeLib.type$; }

  #platformSpi = null;

  platformSpi() { return this.#platformSpi; }

  __platformSpi(it) { if (it === undefined) return this.#platformSpi; else this.#platformSpi = it; }

  static make() {
    const $self = new PlatformTimeLib();
    PlatformTimeLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    $self.#platformSpi = sys.ObjUtil.coerce($self.rt().config().makeSpi("platformTimeSpi"), PlatformTimeSpi.type$);
    return;
  }

}

class PlatformTimeFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PlatformTimeFuncs.type$; }

  static platformTimeSet(ts) {
    PlatformTimeFuncs.lib().platformSpi().timeSet(ts);
    return;
  }

  static platformTimeNtpServersGet() {
    return PlatformTimeFuncs.lib().platformSpi().ntpServersGet();
  }

  static platformTimeNtpServersSet(addresses) {
    PlatformTimeFuncs.lib().platformSpi().ntpServersSet(addresses);
    return;
  }

  static platformTimeInfo() {
    const this$ = this;
    let cx = PlatformTimeFuncs.curContext();
    let lib = PlatformTimeFuncs.lib(cx);
    let now = sys.DateTime.now();
    let gb = haystack.GridBuilder.make().addCol("dis").addCol("val").addCol("icon").addCol("edit");
    gb.addRow(sys.List.make(sys.Str.type$, ["Time", "___", "clock", "time"]));
    gb.addRow(sys.List.make(sys.Str.type$.toNullable(), ["Time", now.time().toLocale(), null, null]));
    gb.addRow(sys.List.make(sys.Str.type$.toNullable(), ["Date", now.date().toLocale(), null, null]));
    gb.addRow(sys.List.make(sys.Str.type$.toNullable(), ["TimeZone", now.tz().name(), null, null]));
    let ntp = lib.platformSpi().ntpServersGet();
    if (ntp != null) {
      gb.addRow(sys.List.make(sys.Str.type$, ["NTP", "___", "cloud", "ntp"]));
      ntp.each((address,i) => {
        gb.addRow(sys.List.make(sys.Str.type$.toNullable(), [sys.Str.plus("Server ", sys.ObjUtil.coerce(sys.Int.plus(i, 1), sys.Obj.type$.toNullable())), address, null, null]));
        return;
      });
    }
    ;
    return gb.toGrid();
  }

  static pi(section,dis,val) {
    return haystack.Etc.dict3("section", section, "dis", dis, "val", val);
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static lib(cx) {
    if (cx === undefined) cx = PlatformTimeFuncs.curContext();
    return sys.ObjUtil.coerce(cx.rt().lib("platformTime"), PlatformTimeLib.type$);
  }

  static make() {
    const $self = new PlatformTimeFuncs();
    PlatformTimeFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class PlatformTimeSpi {
  constructor() {
    const this$ = this;
  }

  typeof() { return PlatformTimeSpi.type$; }

}

const p = sys.Pod.add$('hxPlatformTime');
const xp = sys.Param.noParams$();
let m;
PlatformTimeLib.type$ = p.at$('PlatformTimeLib','hx::HxLib',[],{},8194,PlatformTimeLib);
PlatformTimeFuncs.type$ = p.at$('PlatformTimeFuncs','sys::Obj',[],{'sys::NoDoc':""},8194,PlatformTimeFuncs);
PlatformTimeSpi.type$ = p.am$('PlatformTimeSpi','sys::Obj',[],{},8451,PlatformTimeSpi);
PlatformTimeLib.type$.af$('platformSpi',65666,'hxPlatformTime::PlatformTimeSpi',{}).am$('make',8196,'sys::Void',xp,{});
PlatformTimeFuncs.type$.am$('platformTimeSet',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{'axon::Axon':"axon::Axon{su=true;}"}).am$('platformTimeNtpServersGet',40962,'sys::Str[]?',xp,{'axon::Axon':"axon::Axon{su=true;}"}).am$('platformTimeNtpServersSet',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('addresses','sys::Str[]',false)]),{'axon::Axon':"axon::Axon{su=true;}"}).am$('platformTimeInfo',40962,'haystack::Grid',xp,{'sys::NoDoc':"",'axon::Axon':"axon::Axon{su=true;}"}).am$('pi',34818,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('section','sys::Str',false),new sys.Param('dis','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('lib',34818,'hxPlatformTime::PlatformTimeLib',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',true)]),{}).am$('make',139268,'sys::Void',xp,{});
PlatformTimeSpi.type$.am$('timeSet',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{}).am$('ntpServersGet',270337,'sys::Str[]?',xp,{}).am$('ntpServersSet',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('addresses','sys::Str[]',false)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxPlatformTime");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;haystack 3.1.11;axon 3.1.11;hx 3.1.11");
m.set("pod.summary", "Platform support for date and time");
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
  PlatformTimeLib,
  PlatformTimeFuncs,
  PlatformTimeSpi,
};
