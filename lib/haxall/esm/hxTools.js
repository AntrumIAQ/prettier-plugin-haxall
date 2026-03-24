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
import * as hxStore from './hxStore.js'
import * as web from './web.js'
import * as compilerDoc from './compilerDoc.js'
import * as wisp from './wisp.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as auth from './auth.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as defc from './defc.js'
import * as folio from './folio.js'
import * as hxFolio from './hxFolio.js'
import * as obs from './obs.js'
import * as hx from './hx.js'
import * as hxUser from './hxUser.js'
import * as hxd from './hxd.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class InitCli extends hx.HxCli {
  constructor() {
    super();
    const this$ = this;
    this.#headless = false;
    this.#httpPort = 8080;
    this.#httpsDisable = false;
    return;
  }

  typeof() { return InitCli.type$; }

  #headless = false;

  headless(it) {
    if (it === undefined) {
      return this.#headless;
    }
    else {
      this.#headless = it;
      return;
    }
  }

  #httpPort = 0;

  httpPort(it) {
    if (it === undefined) {
      return this.#httpPort;
    }
    else {
      this.#httpPort = it;
      return;
    }
  }

  #httpsDisable = false;

  httpsDisable(it) {
    if (it === undefined) {
      return this.#httpsDisable;
    }
    else {
      this.#httpsDisable = it;
      return;
    }
  }

  #suUser = null;

  suUser(it) {
    if (it === undefined) {
      return this.#suUser;
    }
    else {
      this.#suUser = it;
      return;
    }
  }

  #suPass = null;

  suPass(it) {
    if (it === undefined) {
      return this.#suPass;
    }
    else {
      this.#suPass = it;
      return;
    }
  }

  #dir = null;

  dir(it) {
    if (it === undefined) {
      return this.#dir;
    }
    else {
      this.#dir = it;
      return;
    }
  }

  #showPassword = false;

  // private field reflection only
  __showPassword(it) { if (it === undefined) return this.#showPassword; else this.#showPassword = it; }

  name() {
    return "init";
  }

  summary() {
    return "Initialize a new daemon database";
  }

  run() {
    this.init();
    this.gatherInputs();
    this.createDatabase();
    this.printLine();
    this.printLine("Success!");
    this.printLine();
    if (this.#showPassword) {
      this.printLine("--- Superuser account ---");
      this.printLine(sys.Str.plus("Username: ", this.#suUser));
      this.printLine(sys.Str.plus("Password: ", this.#suPass));
      this.printLine();
    }
    ;
    return 0;
  }

  init() {
    if (!this.#dir.isDir()) {
      this.#dir = this.#dir.uri().plusSlash().toFile();
    }
    ;
    this.#dir = this.#dir.normalize();
    if ((this.#headless && this.#suUser == null)) {
      this.#suUser = "su";
    }
    ;
    if ((this.#headless && this.#suPass == null)) {
      this.#suPass = InitCli.genPassword();
      this.#showPassword = true;
    }
    ;
    this.printLine();
    this.printLine(sys.Str.plus(sys.Str.plus("hx init [", this.#dir.normalize().osPath()), "]"));
    this.printLine();
    return;
  }

  open() {
    const this$ = this;
    let dbDir = this.#dir.plus(sys.Uri.fromStr("db/"));
    if (dbDir.plus(sys.Uri.fromStr("folio.index")).exists()) {
      this.printLine(sys.Str.plus(sys.Str.plus("Open database [", dbDir), "]"));
    }
    else {
      this.printLine(sys.Str.plus(sys.Str.plus("Create database [", dbDir), "]"));
    }
    ;
    let config = folio.FolioConfig.make((it) => {
      it.__name("haxall");
      it.__dir(dbDir);
      it.__pool(concurrent.ActorPool.make());
      return;
    });
    return hxFolio.HxFolio.open(config);
  }

  close(db) {
    db.close();
    this.printLine("Close database");
    return;
  }

  gatherInputs() {
    if (this.#headless) {
      return;
    }
    ;
    this.printLine();
    this.#suUser = this.promptSu();
    this.#suPass = this.promptPassword();
    this.#httpPort = this.promptInt("http port", this.#httpPort);
    this.printLine();
    return;
  }

  promptConfirm(msg) {
    let res = sys.Env.cur().prompt(sys.Str.plus(sys.Str.plus("", msg), " (y/n)> "));
    if (sys.ObjUtil.equals(sys.Str.lower(res), "y")) {
      return true;
    }
    ;
    return false;
  }

  promptInt(msg,$def) {
    while (true) {
      let res = sys.Env.cur().prompt(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " ["), sys.ObjUtil.coerce($def, sys.Obj.type$.toNullable())), "]> "));
      if (sys.Str.isEmpty(res)) {
        return $def;
      }
      ;
      let int = sys.Int.fromStr(sys.ObjUtil.coerce(res, sys.Str.type$), 10, false);
      if (int != null) {
        return sys.ObjUtil.coerce(int, sys.Int.type$);
      }
      ;
    }
    ;
    throw sys.Err.make();
  }

  promptSu() {
    while (true) {
      let username = sys.Env.cur().prompt("su username> ");
      if (haystack.Ref.isId(sys.ObjUtil.coerce(username, sys.Str.type$))) {
        return sys.ObjUtil.coerce(username, sys.Str.type$);
      }
      else {
        this.printLine(sys.Str.plus(sys.Str.plus("Not a valid username: '", username), "'"));
      }
      ;
    }
    ;
    throw sys.Err.make();
  }

  promptPassword() {
    while (true) {
      let pass = sys.Env.cur().promptPassword("su password> ");
      let conf = sys.Env.cur().promptPassword("su password (confirm)> ");
      if (sys.ObjUtil.compareNE(pass, conf)) {
        this.printLine("Not confirmed!");
        continue;
      }
      ;
      if (sys.Str.isEmpty(pass)) {
        this.printLine("Password cannot be empty");
        continue;
      }
      ;
      return sys.ObjUtil.coerce(pass, sys.Str.type$);
    }
    ;
    throw sys.Err.make();
  }

  createDatabase() {
    const this$ = this;
    let boot = sys.ObjUtil.coerce(sys.ObjUtil.with(hxd.HxdBoot.make(), (it) => {
      it.dir(this$.#dir);
      it.create(true);
      it.log(sys.Log.get("init"));
      return;
    }), hxd.HxdBoot.type$);
    let rt = boot.init();
    this.initHttpPort(rt);
    this.initSu(rt);
    rt.db().close();
    return;
  }

  initHttpPort(rt) {
    let rec = rt.db().read(sys.ObjUtil.coerce(haystack.Filter.fromStr("ext==\"http\""), haystack.Filter.type$));
    let port = haystack.Number.makeInt(this.#httpPort);
    if (sys.ObjUtil.compareNE(rec.get("httpPort"), port)) {
      rt.log().info(sys.Str.plus(sys.Str.plus("Update httpPort [", port), "]"));
      rt.db().commit(folio.Diff.make(rec, sys.Map.__fromLiteral(["httpPort"], [port], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?"))));
    }
    ;
    if ((this.#httpsDisable && sys.ObjUtil.equals(rec.get("httpsEnabled"), true))) {
      rt.log().info("Disable https");
      rt.db().commit(folio.Diff.make(rec, sys.Map.__fromLiteral(["httpsEnabled"], [haystack.Remove.val()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Remove"))));
    }
    ;
    return;
  }

  initSu(rt) {
    let rec = rt.db().read(sys.ObjUtil.coerce(haystack.Filter.fromStr(sys.Str.plus("username==", sys.Str.toCode(this.#suUser))), haystack.Filter.type$), false);
    if (rec == null) {
      rt.log().info(sys.Str.plus(sys.Str.plus("Create su [", sys.Str.toCode(this.#suUser)), "]"));
      hxUser.HxUserUtil.addUser(rt.db(), sys.ObjUtil.coerce(this.#suUser, sys.Str.type$), sys.ObjUtil.coerce(this.#suPass, sys.Str.type$), sys.Map.__fromLiteral(["userRole"], ["su"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    }
    else {
      rt.log().info(sys.Str.plus("Update su ", sys.Str.toCode(this.#suUser)));
      hxUser.HxUserUtil.updatePassword(rt.db(), sys.ObjUtil.coerce(rec, haystack.Dict.type$), sys.ObjUtil.coerce(this.#suPass, sys.Str.type$));
    }
    ;
    return;
  }

  static genPassword() {
    const this$ = this;
    let alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let mixed = sys.Str.chars(alphabet).shuffle();
    let buf = sys.StrBuf.make();
    sys.Int.times(3, (i) => {
      sys.Int.times(5, (it) => {
        buf.addChar(mixed.get(sys.Int.random(sys.Range.make(0, mixed.size(), true))));
        return;
      });
      if (sys.ObjUtil.compareLT(i, 2)) {
        buf.addChar(45);
      }
      ;
      return;
    });
    return buf.toStr();
  }

  static make() {
    const $self = new InitCli();
    InitCli.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxCli.make$($self);
    ;
    return;
  }

}

class StubCli extends hx.HxCli {
  constructor() {
    super();
    const this$ = this;
    this.#type = "fantom";
    this.#out = sys.ObjUtil.coerce(sys.File.make(sys.Uri.fromStr("./")), sys.File.type$);
    this.#today = sys.Date.today();
    this.#stdMacros = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    this.#headerApply = (key) => {
      let $_u0 = key;
      if (sys.ObjUtil.equals($_u0, "year")) {
        return sys.Int.toStr(this$.#today.year());
      }
      else if (sys.ObjUtil.equals($_u0, "date")) {
        return this$.#today.toLocale("DD MMM YYYY");
      }
      else if (sys.ObjUtil.equals($_u0, "org")) {
        return this$.#org;
      }
      else if (sys.ObjUtil.equals($_u0, "author")) {
        return this$.#author;
      }
      else if (sys.ObjUtil.equals($_u0, "license")) {
        return ((this$) => { if (this$.isHx()) return "Licensed under the Academic Free License version 3.0"; return this$.#lic; })(this$);
      }
      else {
        return null;
      }
      ;
    };
    return;
  }

  typeof() { return StubCli.type$; }

  #type = null;

  type(it) {
    if (it === undefined) {
      return this.#type;
    }
    else {
      this.#type = it;
      return;
    }
  }

  #out = null;

  out(it) {
    if (it === undefined) {
      return this.#out;
    }
    else {
      this.#out = it;
      return;
    }
  }

  #desc = null;

  desc(it) {
    if (it === undefined) {
      return this.#desc;
    }
    else {
      this.#desc = it;
      return;
    }
  }

  #author = null;

  author(it) {
    if (it === undefined) {
      return this.#author;
    }
    else {
      this.#author = it;
      return;
    }
  }

  #org = null;

  org(it) {
    if (it === undefined) {
      return this.#org;
    }
    else {
      this.#org = it;
      return;
    }
  }

  #orgUri = null;

  orgUri(it) {
    if (it === undefined) {
      return this.#orgUri;
    }
    else {
      this.#orgUri = it;
      return;
    }
  }

  #proj = null;

  proj(it) {
    if (it === undefined) {
      return this.#proj;
    }
    else {
      this.#proj = it;
      return;
    }
  }

  #projUri = null;

  projUri(it) {
    if (it === undefined) {
      return this.#projUri;
    }
    else {
      this.#projUri = it;
      return;
    }
  }

  #lic = null;

  lic(it) {
    if (it === undefined) {
      return this.#lic;
    }
    else {
      this.#lic = it;
      return;
    }
  }

  #vcs = null;

  vcs(it) {
    if (it === undefined) {
      return this.#vcs;
    }
    else {
      this.#vcs = it;
      return;
    }
  }

  #vcsUri = null;

  vcsUri(it) {
    if (it === undefined) {
      return this.#vcsUri;
    }
    else {
      this.#vcsUri = it;
      return;
    }
  }

  #skyarc = false;

  skyarc(it) {
    if (it === undefined) {
      return this.#skyarc;
    }
    else {
      this.#skyarc = it;
      return;
    }
  }

  #meta = null;

  meta(it) {
    if (it === undefined) {
      return this.#meta;
    }
    else {
      this.#meta = it;
      return;
    }
  }

  #libName = null;

  libName(it) {
    if (it === undefined) {
      return this.#libName;
    }
    else {
      this.#libName = it;
      return;
    }
  }

  #today = null;

  // private field reflection only
  __today(it) { if (it === undefined) return this.#today; else this.#today = it; }

  #typePrefix = null;

  // private field reflection only
  __typePrefix(it) { if (it === undefined) return this.#typePrefix; else this.#typePrefix = it; }

  #libOrg = null;

  // private field reflection only
  __libOrg(it) { if (it === undefined) return this.#libOrg; else this.#libOrg = it; }

  #stdMacros = null;

  // private field reflection only
  __stdMacros(it) { if (it === undefined) return this.#stdMacros; else this.#stdMacros = it; }

  #buildFile = null;

  // private field reflection only
  __buildFile(it) { if (it === undefined) return this.#buildFile; else this.#buildFile = it; }

  #podFandocFile = null;

  // private field reflection only
  __podFandocFile(it) { if (it === undefined) return this.#podFandocFile; else this.#podFandocFile = it; }

  #libDefFile = null;

  // private field reflection only
  __libDefFile(it) { if (it === undefined) return this.#libDefFile; else this.#libDefFile = it; }

  #libFile = null;

  // private field reflection only
  __libFile(it) { if (it === undefined) return this.#libFile; else this.#libFile = it; }

  #fanFuncsFile = null;

  // private field reflection only
  __fanFuncsFile(it) { if (it === undefined) return this.#fanFuncsFile; else this.#fanFuncsFile = it; }

  #connDispatchFile = null;

  // private field reflection only
  __connDispatchFile(it) { if (it === undefined) return this.#connDispatchFile; else this.#connDispatchFile = it; }

  #axonFuncsFile = null;

  // private field reflection only
  __axonFuncsFile(it) { if (it === undefined) return this.#axonFuncsFile; else this.#axonFuncsFile = it; }

  #connDefFile = null;

  // private field reflection only
  __connDefFile(it) { if (it === undefined) return this.#connDefFile; else this.#connDefFile = it; }

  #connPointDefFile = null;

  // private field reflection only
  __connPointDefFile(it) { if (it === undefined) return this.#connPointDefFile; else this.#connPointDefFile = it; }

  #skyarcFile = null;

  // private field reflection only
  __skyarcFile(it) { if (it === undefined) return this.#skyarcFile; else this.#skyarcFile = it; }

  #headerApply = null;

  // private field reflection only
  __headerApply(it) { if (it === undefined) return this.#headerApply; else this.#headerApply = it; }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    let c = hx.HxCli.prototype.usage.call(this, out);
    out.printLine();
    out.printLine("Notes: You will be prompted for any unspecified options that don't have default values.\n");
    return c;
  }

  defName() {
    return sys.ObjUtil.coerce(((this$) => { if (this$.isHx()) return sys.Str.decapitalize(this$.#typePrefix); return this$.#libName; })(this), sys.Str.type$);
  }

  name() {
    return "stub";
  }

  summary() {
    return "Stub a new Haxall pod";
  }

  run() {
    this.loadMeta();
    this.promptInput();
    if (!this.checkInput()) {
      return 1;
    }
    ;
    this.initMacros();
    this.genFileNames();
    if (!this.confirm()) {
      return 1;
    }
    ;
    this.genBuild();
    this.genLibDef();
    this.genLib();
    this.genFanFuncs();
    this.genAxonFuncs();
    this.genConnDef();
    this.genPointDef();
    this.genConnDispatch();
    this.genSkyarc();
    this.genPodFandoc();
    this.printLine("Done!");
    return 0;
  }

  loadMeta() {
    if (this.#meta == null) {
      return;
    }
    ;
    let pod = sys.Pod.find(sys.ObjUtil.coerce(this.#meta, sys.Str.type$));
    if (this.#org == null) {
      this.#org = pod.meta().get("org.name");
    }
    ;
    this.#orgUri = pod.meta().get("org.uri");
    this.#proj = pod.meta().get("proj.name");
    this.#projUri = pod.meta().get("proj.uri");
    this.#lic = pod.meta().get("license.name");
    this.#vcs = pod.meta().get("vcs.name");
    this.#vcsUri = pod.meta().get("vcs.uri");
    return;
  }

  promptInput() {
    if (this.#org == null) {
      this.#org = sys.Str.trimToNull(this.prompt("Organization name"));
    }
    ;
    if (this.#author == null) {
      this.#author = this.promptDef("Author", sys.Env.cur().user());
    }
    ;
    if (this.#desc == null) {
      this.#desc = this.prompt("Pod summary");
    }
    ;
    if (this.#orgUri == null) {
      this.#orgUri = this.prompt("Organization URL");
    }
    ;
    if (this.#proj == null) {
      this.#proj = this.promptDef("Project Name", "Haxall");
    }
    ;
    if (this.#projUri == null) {
      let $def = ((this$) => { if (sys.ObjUtil.equals(this$.#proj, "Haxall")) return "https://haxall.io"; return ""; })(this);
      this.#projUri = this.promptDef("Project URL", $def);
    }
    ;
    let isHaxall = sys.ObjUtil.equals(this.#proj, "Haxall");
    if (this.#lic == null) {
      this.#lic = this.promptDef("License Name", "Academic Free License 3.0");
    }
    ;
    if (this.#vcs == null) {
      let $def = ((this$) => { if (isHaxall) return "Git"; return ""; })(this);
      this.#vcs = this.promptDef("VCS Name", $def);
      if (sys.Str.isEmpty(this.#vcs)) {
        this.#vcsUri = "";
      }
      ;
    }
    ;
    if (this.#vcsUri == null) {
      let $def = ((this$) => { if (isHaxall) return "https://github.com/haxall/haxall"; return ""; })(this);
      this.#vcsUri = this.promptDef("VCS URL", $def);
    }
    ;
    return;
  }

  checkInput() {
    const this$ = this;
    let $_u6 = this.#type;
    if (sys.ObjUtil.equals($_u6, "conn") || sys.ObjUtil.equals($_u6, "fantom") || sys.ObjUtil.equals($_u6, "resource")) {
      let ok = true;
    }
    else {
      return this.fatal(sys.Str.plus("Invalid pod type: ", this.#type));
    }
    ;
    if (!haystack.Etc.isTagName(sys.ObjUtil.coerce(this.#libName, sys.Str.type$))) {
      return this.fatal(sys.Str.plus("Library name must be a valid tag name: ", this.#libName));
    }
    ;
    if (sys.Str.endsWith(this.#libName, "Ext")) {
      return this.fatal(sys.Str.plus("Library name must not end with 'Ext': ", this.#libName));
    }
    ;
    let idx = sys.Str.chars(this.#libName).findIndex((it) => {
      return sys.Int.isUpper(it);
    });
    if ((idx == null || sys.ObjUtil.equals(idx, 0))) {
      return this.fatal(sys.Str.plus("Library name must start with lowercase prefix: ", this.#libName));
    }
    ;
    this.#libOrg = sys.Str.getRange(this.#libName, sys.Range.make(0, sys.ObjUtil.coerce(idx, sys.Int.type$), true));
    this.#typePrefix = ((this$) => { if (this$.isHx()) return sys.Str.getRange(this$.#libName, sys.Range.make(sys.ObjUtil.coerce(idx, sys.Int.type$), -1)); return sys.Str.capitalize(this$.#libName); })(this);
    if (this.#org == null) {
      return this.fatal("Must specify an organization");
    }
    ;
    if (this.#author == null) {
      return this.fatal("Must specify an author");
    }
    ;
    this.#out = this.#out.normalize().uri().plusSlash().toFile().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", this.#libName), "/")));
    if (this.isResource()) {
      if (this.containsFcode()) {
        return this.fatal(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot create resource pod.\n ", this.name()), " already exists and contains Fantom code: "), this.#out));
      }
      ;
    }
    ;
    return true;
  }

  fatal(msg) {
    this.printLine();
    this.err(msg);
    this.printLine();
    this.usage();
    return false;
  }

  initMacros() {
    this.#stdMacros.set("org", sys.ObjUtil.coerce(this.#org, sys.Str.type$));
    this.#stdMacros.set("libName", sys.ObjUtil.coerce(this.#libName, sys.Str.type$));
    this.#stdMacros.set("defName", this.defName());
    this.#stdMacros.set("typePrefix", sys.ObjUtil.coerce(this.#typePrefix, sys.Str.type$));
    this.#stdMacros.set("header", this.applyTemplate(sys.Uri.fromStr("header.template"), this.#headerApply));
    return;
  }

  genFileNames() {
    this.#buildFile = this.#out.plus(sys.Uri.fromStr("build.fan"));
    this.#podFandocFile = this.#out.plus(sys.Uri.fromStr("pod.fandoc"));
    this.#libDefFile = this.#out.plus(sys.Uri.fromStr("lib/lib.trio"));
    if (this.isResource()) {
      this.#axonFuncsFile = this.#out.plus(sys.Uri.fromStr("lib/funcs.trio"));
    }
    else {
      this.#libFile = this.#out.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("fan/", this.#typePrefix), "Lib.fan")));
      this.#fanFuncsFile = this.#out.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("fan/", this.#typePrefix), "Funcs.fan")));
      if (this.isConn()) {
        this.#connDefFile = this.#out.plus(sys.Uri.fromStr("lib/conn.trio"));
        this.#connPointDefFile = this.#out.plus(sys.Uri.fromStr("lib/point.trio"));
        this.#connDispatchFile = this.#out.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("fan/", this.#typePrefix), "Dispatch.fan")));
      }
      ;
      if (this.#skyarc) {
        this.#skyarcFile = this.#out.plus(sys.Uri.fromStr("lib/skyarc.trio"));
      }
      ;
    }
    ;
    return;
  }

  confirm() {
    const this$ = this;
    this.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("=== Stub ", sys.Str.toCode(this.#libName)), " "), this.#type), " ==="));
    this.printLine(sys.Str.plus("Org:     ", this.#org));
    this.printLine(sys.Str.plus("Author:  ", this.#author));
    this.printLine(sys.Str.plus("Summary: ", this.#desc));
    this.printLine();
    this.printLine("Pod Meta");
    this.printLine(sys.Str.plus("  org.uri:            ", this.#orgUri));
    this.printLine(sys.Str.plus("  proj.name:          ", this.#proj));
    this.printLine(sys.Str.plus("  proj.uri:           ", this.#projUri));
    this.printLine(sys.Str.plus("  license.name:       ", this.#lic));
    if (this.#vcs != null) {
      this.printLine(sys.Str.plus("  vcs.name:           ", this.#vcs));
      this.printLine(sys.Str.plus("  vcs.uri:            ", this.#vcsUri));
    }
    ;
    this.printLine();
    this.printLine("Generate Files:");
    sys.ObjUtil.typeof(this).fields().each((field) => {
      if (!sys.Str.endsWith(field.name(), "File")) {
        return;
      }
      ;
      let f = sys.ObjUtil.as(field.get(this$), sys.File.type$);
      if (f != null) {
        let s = sys.Str.padr(sys.Str.plus(sys.Str.plus("  ", sys.Str.toDisplayName(field.name())), ":"), 22);
        s = sys.Str.plus(s, f.osPath());
        if (f.exists()) {
          s = sys.Str.plus(s, " (OVERWRITE!!!)");
        }
        ;
        this$.printLine(s);
      }
      ;
      return;
    });
    let cont = this.promptConfirm("Continue");
    if (!cont) {
      this.printLine("Cancelled");
    }
    ;
    return cont;
  }

  genBuild() {
    const this$ = this;
    let buildPod = sys.Pod.find("build");
    let fanVer = ((this$) => { if (buildPod.config("fan.depend") == null) return "1.0"; return "@{fan.depend}"; })(this);
    let hxVer = sys.ObjUtil.typeof(this).pod().version().segments().getRange(sys.Range.make(0, 1)).join(".");
    if (buildPod.config("hx.depend") != null) {
      (hxVer = "@{hx.depend}");
    }
    else {
      if (buildPod.config("skyarc.depend") != null) {
        (hxVer = "@{skyarc.depend}");
      }
      ;
    }
    ;
    let depends = sys.List.make(sys.Str.type$, [sys.Str.plus("sys ", fanVer)]);
    if (!this.isResource()) {
      depends.add(sys.Str.plus("concurrent ", fanVer)).add(sys.Str.plus("inet ", fanVer));
      depends.add(sys.Str.plus("haystack ", hxVer)).add(sys.Str.plus("axon ", hxVer)).add(sys.Str.plus("folio ", hxVer)).add(sys.Str.plus("hx ", hxVer));
      if (this.isConn()) {
        depends.add(sys.Str.plus("hxConn ", hxVer));
      }
      ;
    }
    ;
    let srcDirs = sys.List.make(sys.Uri.type$);
    if (!this.isResource()) {
      srcDirs.add(sys.Uri.fromStr("fan/"));
    }
    ;
    let resDirs = sys.List.make(sys.Uri.type$, [sys.Uri.fromStr("lib/")]);
    let content = this.applyTemplate(sys.Uri.fromStr("build.fan.template"), (key) => {
      let $_u9 = key;
      if (sys.ObjUtil.equals($_u9, "desc")) {
        return this$.#desc;
      }
      else if (sys.ObjUtil.equals($_u9, "orgUri")) {
        return this$.#orgUri;
      }
      else if (sys.ObjUtil.equals($_u9, "proj")) {
        return this$.#proj;
      }
      else if (sys.ObjUtil.equals($_u9, "projUri")) {
        return this$.#projUri;
      }
      else if (sys.ObjUtil.equals($_u9, "lic")) {
        return this$.#lic;
      }
      else if (sys.ObjUtil.equals($_u9, "vcs")) {
        return this$.#vcs;
      }
      else if (sys.ObjUtil.equals($_u9, "vcsUri")) {
        return this$.#vcsUri;
      }
      else if (sys.ObjUtil.equals($_u9, "depends")) {
        return this$.buildList(depends);
      }
      else if (sys.ObjUtil.equals($_u9, "srcDirs")) {
        return this$.buildList(srcDirs);
      }
      else {
        return null;
      }
      ;
    });
    this.#buildFile.out().writeChars(content).close();
    return;
  }

  buildList(list) {
    const this$ = this;
    if (list.isEmpty()) {
      return ",";
    }
    ;
    let s = list.join(",\n", (item) => {
      return sys.Str.plus(sys.Str.spaces(6), sys.ObjUtil.trap(item,"toCode", sys.List.make(sys.Obj.type$.toNullable(), [])));
    });
    return s;
  }

  genLibDef() {
    const this$ = this;
    let depends = sys.List.make(sys.Str.type$, ["^lib:ph", "^lib:axon", "^lib:hx"]);
    if (this.isConn()) {
      depends.add("^lib:conn");
    }
    ;
    this.#libDefFile.out().writeChars(this.applyTemplate(sys.Uri.fromStr("lib.trio.template"), (key) => {
      let $_u10 = key;
      if (sys.ObjUtil.equals($_u10, "depends")) {
        return depends.join(", ");
      }
      else if (sys.ObjUtil.equals($_u10, "typeName")) {
        return ((this$) => { if (this$.isResource()) return ""; return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("typeName: \"", this$.#libName), "::"), this$.#typePrefix), "Lib\""); })(this$);
      }
      ;
      return null;
    })).close();
    return;
  }

  genLib() {
    if (this.#libFile == null) {
      return;
    }
    ;
    let template = ((this$) => { if (this$.isConn()) return sys.Uri.fromStr("connLib.fan.template"); return sys.Uri.fromStr("lib.fan.template"); })(this);
    this.#libFile.out().writeChars(this.applyTemplate(template)).close();
    return;
  }

  genFanFuncs() {
    if (this.#fanFuncsFile == null) {
      return;
    }
    ;
    this.#fanFuncsFile.out().writeChars(this.applyTemplate(sys.Uri.fromStr("funcs.fan.template"))).close();
    return;
  }

  genAxonFuncs() {
    if (this.#axonFuncsFile == null) {
      return;
    }
    ;
    this.#axonFuncsFile.out().writeChars(this.applyTemplate(sys.Uri.fromStr("funcs.trio.template"))).close();
    return;
  }

  genConnDef() {
    const this$ = this;
    if (this.#connDefFile == null) {
      return;
    }
    ;
    this.#connDefFile.out().writeChars(this.applyTemplate(sys.Uri.fromStr("conn.trio.template"), (key) => {
      if (sys.ObjUtil.equals(key, "connFeatures")) {
        return "{pollMode:\"buckets\"}";
      }
      ;
      return null;
    })).close();
    return;
  }

  genPointDef() {
    if (this.#connPointDefFile == null) {
      return;
    }
    ;
    this.#connPointDefFile.out().writeChars(this.applyTemplate(sys.Uri.fromStr("connPoint.trio.template"))).close();
    return;
  }

  genConnDispatch() {
    if (this.#connDispatchFile == null) {
      return;
    }
    ;
    this.#connDispatchFile.out().writeChars(this.applyTemplate(sys.Uri.fromStr("connDispatch.fan.template"))).close();
    return;
  }

  genSkyarc() {
    if (this.#skyarcFile == null) {
      return;
    }
    ;
    this.#skyarcFile.out().writeChars(this.applyTemplate(sys.Uri.fromStr("skyarc.trio.template"))).close();
    return;
  }

  genPodFandoc() {
    if (this.#podFandocFile == null) {
      return;
    }
    ;
    this.#podFandocFile.out().writeChars(this.applyTemplate(sys.Uri.fromStr("pod.fandoc.template"), this.#headerApply)).close();
    return;
  }

  containsFcode() {
    const this$ = this;
    let fcode = false;
    this.#out.plus(sys.Uri.fromStr("fan/")).walk((it) => {
      if (sys.ObjUtil.equals("fan", it.ext())) {
        (fcode = true);
      }
      ;
      return;
    });
    return fcode;
  }

  isHx() {
    return sys.ObjUtil.equals(this.#libOrg, "hx");
  }

  isResource() {
    return sys.ObjUtil.equals(this.#type, "resource");
  }

  isConn() {
    return sys.ObjUtil.equals(this.#type, "conn");
  }

  isFan() {
    return (sys.ObjUtil.equals(this.#type, "fantom") || this.isConn());
  }

  applyTemplate(uri,resolve) {
    if (resolve === undefined) resolve = null;
    const this$ = this;
    return util.Macro.make(this.template(uri)).apply((key) => {
      let val = this$.#stdMacros.get(key);
      if (val != null) {
        return sys.ObjUtil.coerce(val, sys.Str.type$);
      }
      ;
      if (resolve != null) {
        (val = sys.Func.call(resolve, key));
      }
      ;
      if (val != null) {
        return sys.ObjUtil.coerce(val, sys.Str.type$);
      }
      ;
      throw sys.Err.make(sys.Str.plus("Unexpected key: ", key));
    });
  }

  template(uri) {
    return sys.ObjUtil.typeof(this).pod().file(sys.Uri.fromStr("/lib/stub/").plus(uri)).readAllStr();
  }

  promptConfirm(msg) {
    let res = ((this$) => { let $_u13 = sys.Str.trimToNull(sys.Env.cur().prompt(sys.Str.plus(sys.Str.plus("", msg), " (Yn): "))); if ($_u13 != null) return $_u13; return "y"; })(this);
    return sys.ObjUtil.equals(sys.Str.lower(res), "y");
  }

  prompt(msg) {
    return sys.Str.trim(sys.Env.cur().prompt(sys.Str.plus(sys.Str.plus("", msg), ": ")));
  }

  promptDef(msg,$def) {
    return sys.ObjUtil.coerce(((this$) => { let $_u14 = sys.Str.trimToNull(sys.Env.cur().prompt(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " ["), $def), "]: "))); if ($_u14 != null) return $_u14; return $def; })(this), sys.Str.type$);
  }

  static make() {
    const $self = new StubCli();
    StubCli.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxCli.make$($self);
    ;
    return;
  }

}

class ConvertCli extends hx.HxCli {
  constructor() {
    super();
    const this$ = this;
    this.#outDir = sys.ObjUtil.coerce(sys.File.make(sys.Uri.fromStr("./")), sys.File.type$);
    this.#output = "";
    this.#inputs = sys.List.make(sys.File.type$);
    return;
  }

  typeof() { return ConvertCli.type$; }

  #outDir = null;

  outDir(it) {
    if (it === undefined) {
      return this.#outDir;
    }
    else {
      this.#outDir = it;
      return;
    }
  }

  #output = null;

  output(it) {
    if (it === undefined) {
      return this.#output;
    }
    else {
      this.#output = it;
      return;
    }
  }

  #inputs = null;

  inputs(it) {
    if (it === undefined) {
      return this.#inputs;
    }
    else {
      this.#inputs = it;
      return;
    }
  }

  name() {
    return "convert";
  }

  summary() {
    return "Convert between file formats";
  }

  run() {
    const this$ = this;
    let formats = sys.Str.split(this.#output, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
    if (formats.isEmpty()) {
      return this.err("No output formats specified");
    }
    ;
    if (this.#inputs.isEmpty()) {
      return this.err("No input files specified");
    }
    ;
    this.#inputs.each((input) => {
      formats.each((format) => {
        this$.convert(input, format);
        return;
      });
      return;
    });
    return 0;
  }

  convert(inFile,format) {
    let grid = this.read(inFile);
    let outFile = this.#outDir.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus(inFile.basename(), "."), format)));
    let out = outFile.out();
    this.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("", inFile.osPath()), "  =>  "), outFile.osPath()));
    this.write(grid, format, out);
    out.close();
    return 0;
  }

  read(file) {
    if (!file.exists()) {
      throw sys.Err.make(sys.Str.plus("Input file not found: ", file));
    }
    ;
    if (file.isDir()) {
      throw sys.Err.make(sys.Str.plus("Input file cannot be dir: ", file));
    }
    ;
    let $_u15 = file.ext();
    if (sys.ObjUtil.equals($_u15, "zinc")) {
      return haystack.ZincReader.make(file.in()).readGrid();
    }
    else if (sys.ObjUtil.equals($_u15, "json")) {
      return haystack.JsonReader.make(file.in()).readGrid();
    }
    else if (sys.ObjUtil.equals($_u15, "trio")) {
      return haystack.TrioReader.make(file.in()).readGrid();
    }
    else if (sys.ObjUtil.equals($_u15, "csv")) {
      return haystack.CsvReader.make(file.in()).readGrid();
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unknown input file type: ", file));
    }
    ;
  }

  write(grid,format,out) {
    let $_u16 = format;
    if (sys.ObjUtil.equals($_u16, "zinc")) {
      return sys.ObjUtil.coerce(haystack.ZincWriter.make(out).writeGrid(grid), haystack.ZincWriter.type$);
    }
    else if (sys.ObjUtil.equals($_u16, "json")) {
      return sys.ObjUtil.coerce(haystack.JsonWriter.make(out).writeGrid(grid), haystack.JsonWriter.type$);
    }
    else if (sys.ObjUtil.equals($_u16, "trio")) {
      return sys.ObjUtil.coerce(haystack.TrioWriter.make(out).writeGrid(grid), haystack.TrioWriter.type$);
    }
    else if (sys.ObjUtil.equals($_u16, "csv")) {
      return sys.ObjUtil.coerce(haystack.CsvWriter.make(out).writeGrid(grid), haystack.CsvWriter.type$);
    }
    else if (sys.ObjUtil.equals($_u16, "jsonld")) {
      return sys.ObjUtil.coerce(def.JsonLdWriter.make(out, this.nsOpts()).writeGrid(grid), def.JsonLdWriter.type$);
    }
    else if (sys.ObjUtil.equals($_u16, "turtle")) {
      return sys.ObjUtil.coerce(def.TurtleWriter.make(out, this.nsOpts()).writeGrid(grid), def.TurtleWriter.type$);
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unknown output format: ", format));
    }
    ;
  }

  nsOpts() {
    return haystack.Etc.makeDict1("ns", this.ns());
  }

  ns() {
    throw sys.Err.make("Namespace formats not supported yet");
  }

  static make() {
    const $self = new ConvertCli();
    ConvertCli.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxCli.make$($self);
    ;
    return;
  }

}

class CryptoCli extends hx.HxCli {
  constructor() {
    super();
    const this$ = this;
    this.#dir = sys.Env.cur().workDir().plus(sys.Uri.fromStr("var/"));
    this.#args = sys.ObjUtil.coerce(((this$) => { let $_u17 = sys.Env.cur().args(); if ($_u17 == null) return null; return sys.ObjUtil.toImmutable(sys.Env.cur().args()); })(this), sys.Type.find("sys::Str[]"));
    return;
  }

  typeof() { return CryptoCli.type$; }

  #dir = null;

  // private field reflection only
  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #args = null;

  // private field reflection only
  __args(it) { if (it === undefined) return this.#args; else this.#args = it; }

  #argsMap = null;

  // private field reflection only
  __argsMap(it) { if (it === undefined) return this.#argsMap; else this.#argsMap = it; }

  #action = null;

  // private field reflection only
  __action(it) { if (it === undefined) return this.#action; else this.#action = it; }

  #keystore$Store = undefined;

  // private field reflection only
  __keystore$Store(it) { if (it === undefined) return this.#keystore$Store; else this.#keystore$Store = it; }

  name() {
    return "crypto";
  }

  summary() {
    return "Manage crypto keys and certificates";
  }

  run() {
    let $_u18 = this.#action;
    if (sys.ObjUtil.equals($_u18, "add")) {
      this.doAddKey();
    }
    else if (sys.ObjUtil.equals($_u18, "trust")) {
      this.doTrust();
    }
    else if (sys.ObjUtil.equals($_u18, "export")) {
      this.doExport();
    }
    else if (sys.ObjUtil.equals($_u18, "list")) {
      this.doList();
    }
    else if (sys.ObjUtil.equals($_u18, "remove")) {
      this.doRemove();
    }
    else if (sys.ObjUtil.equals($_u18, "rename")) {
      this.doRename();
    }
    else {
      this.err(sys.Str.plus("Unsupported action: ", sys.Str.toCode(this.#action)));
      return this.usage();
    }
    ;
    return 0;
  }

  keystore() {
    if (this.#keystore$Store === undefined) {
      this.#keystore$Store = this.keystore$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#keystore$Store, crypto.KeyStore.type$);
  }

  doAddKey() {
    if (this.helpRequested()) {
      return this.usageAdd();
    }
    ;
    let alias = this.#argsMap.get("alias");
    if (alias == null) {
      this.usageAdd("-alias required");
    }
    ;
    let force = (this.hasArg("force") || this.hasArg("f"));
    if (this.keystore().containsAlias(sys.ObjUtil.coerce(alias, sys.Str.type$))) {
      if (!force) {
        this.info(sys.Str.plus(sys.Str.plus("Entry with alias '", alias), "' already exists. Use -f to overwrite"));
        return;
      }
      ;
    }
    ;
    let x = ((this$) => { if (this$.hasArg("import")) return this$.import(sys.ObjUtil.coerce(alias, sys.Str.type$), this$.keystore()); return this$.readPEMs(sys.ObjUtil.coerce(alias, sys.Str.type$), this$.keystore()); })(this);
    this.info(sys.Str.plus(sys.Str.plus("SUCCESS! Key added with alias '", alias), "'"));
    return;
  }

  import(alias,keystore) {
    const this$ = this;
    if (!this.hasArg("import")) {
      this.usageAdd("-import required");
    }
    ;
    let file = CryptoCli.parseArgToFile(sys.ObjUtil.coerce(this.#argsMap.get("import"), sys.Str.type$));
    let pass = this.#argsMap.get("pass");
    if (!file.exists()) {
      this.exitErr(sys.Str.plus("Import file does not exist: ", file));
    }
    ;
    let ks = crypto.Crypto.cur().loadKeyStore(file, sys.Map.__fromLiteral(["password"], [pass], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")));
    let entry = ks.aliases().eachWhile((name) => {
      let e = ks.get(name);
      if (!sys.ObjUtil.is(e, crypto.PrivKeyEntry.type$)) {
        return null;
      }
      ;
      return sys.ObjUtil.coerce(e, crypto.PrivKeyEntry.type$.toNullable());
    });
    if (entry == null) {
      this.exitErr("Key store does not contain entry with private key and certifcate chain");
    }
    ;
    return keystore.set(alias, sys.ObjUtil.coerce(entry, crypto.KeyStoreEntry.type$));
  }

  readPEMs(alias,keystore) {
    if (!this.hasArg("priv")) {
      this.usageAdd("-priv required");
    }
    ;
    if (!this.hasArg("certs")) {
      this.usageAdd("-certs required");
    }
    ;
    let alg = ((this$) => { if (this$.hasArg("alg")) return sys.Str.upper(sys.ObjUtil.as(this$.#argsMap.get("alg"), sys.Str.type$)); return "RSA"; })(this);
    let in$ = CryptoCli.parseArgToFile(sys.ObjUtil.coerce(this.#argsMap.get("priv"), sys.Str.type$)).in();
    let privKey = sys.ObjUtil.as(crypto.Crypto.cur().loadPem(in$, alg), crypto.PrivKey.type$);
    in$.close();
    let certs = crypto.Crypto.cur().loadX509(CryptoCli.parseArgToFile(sys.ObjUtil.coerce(this.#argsMap.get("certs"), sys.Str.type$)).in());
    return keystore.setPrivKey(alias, sys.ObjUtil.coerce(privKey, crypto.PrivKey.type$), certs);
  }

  doTrust() {
    const this$ = this;
    if (this.helpRequested()) {
      this.usageTrust();
    }
    ;
    let certs = sys.List.make(crypto.Cert.type$);
    if (this.hasArg("uri")) {
      (certs = crypto.Crypto.cur().loadCertsForUri(sys.Str.toUri(this.#argsMap.get("uri"))));
    }
    else {
      if (this.hasArg("cert")) {
        (certs = crypto.Crypto.cur().loadX509(CryptoCli.parseArgToFile(sys.ObjUtil.coerce(this.#argsMap.get("cert"), sys.Str.type$)).in()));
      }
      else {
        this.usageTrust("-cert or -uri required");
      }
      ;
    }
    ;
    let force = (this.hasArg("force") || this.hasArg("f"));
    let alias = this.#argsMap.get("alias");
    if (alias == null) {
      let cert = certs.first();
      let equal = sys.Str.index(cert.subject(), "=");
      let comma = sys.Str.index(cert.subject(), ",");
      if ((equal == null || comma == null || sys.ObjUtil.compareLT(comma, equal))) {
        this.exitErr(sys.Str.plus(sys.Str.plus("Cannot auto-generate alias for ", cert.subject()), ". Use -alias option"));
      }
      ;
      (alias = sys.Str.lower(sys.Str.replace(sys.Str.getRange(cert.subject(), sys.Range.make(3, sys.ObjUtil.coerce(comma, sys.Int.type$), true)), " ", "")));
    }
    ;
    let ks = this.keystore();
    certs.each((cert,i) => {
      let entryAlias = ((this$) => { if (sys.ObjUtil.equals(i, 0)) return alias; return sys.Str.plus(sys.Str.plus(sys.Str.plus("", alias), "."), sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())); })(this$);
      if (ks.containsAlias(sys.ObjUtil.coerce(entryAlias, sys.Str.type$))) {
        if (!force) {
          this$.info(sys.Str.plus(sys.Str.plus("Entry with alias '", entryAlias), "' already exists. Use -f to overwrite"));
          return;
        }
        ;
      }
      ;
      this$.info(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Trusting ", cert.subject()), " as "), entryAlias), "\n"));
      ks.setTrust(sys.ObjUtil.coerce(entryAlias, sys.Str.type$), cert);
      return;
    });
    return;
  }

  doExport() {
    const this$ = this;
    if (this.helpRequested()) {
      return this.usageExport();
    }
    ;
    if (!this.hasArg("alias")) {
      this.usageExport("-alias option is required");
    }
    ;
    let alias = this.#argsMap.get("alias");
    let entry = this.keystore().get(sys.ObjUtil.coerce(alias, sys.Str.type$));
    if (sys.ObjUtil.is(entry, crypto.TrustEntry.type$)) {
      let trust = sys.ObjUtil.coerce(entry, crypto.TrustEntry.type$);
      let f = sys.File.make(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", alias), "-trusted.cert")));
      f.out().writeChars(trust.cert().toStr()).close();
      this.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("Exported ", alias), " to: "), f.normalize().osPath()));
    }
    else {
      let key = sys.ObjUtil.coerce(entry, crypto.PrivKeyEntry.type$);
      if (this.hasArg("priv")) {
        let f = sys.File.make(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", alias), "-priv.key")));
        f.out().writeChars(key.priv().toStr()).close();
        this.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("Exported ", alias), " private key to: "), f.normalize().osPath()));
      }
      ;
      let f = sys.File.make(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", alias), "-cert.crt")));
      let out = f.out();
      key.certChain().each((cert) => {
        out.writeChars(cert.toStr());
        return;
      });
      out.close();
      this.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("Exported ", alias), " certificate chain to: "), f.normalize().osPath()));
    }
    ;
    return;
  }

  doList() {
    const this$ = this;
    if (this.helpRequested()) {
      return this.usageList();
    }
    ;
    let ks = this.keystore();
    let aliases = ((this$) => { if (this$.hasArg("alias")) return sys.List.make(sys.Str.type$.toNullable(), [this$.#argsMap.get("alias")]); return ks.aliases(); })(this);
    aliases.each((alias) => {
      let entry = ks.get(sys.ObjUtil.coerce(alias, sys.Str.type$), false);
      let buf = sys.StrBuf.make();
      if (sys.ObjUtil.is(entry, crypto.PrivKeyEntry.type$)) {
        let pk = sys.ObjUtil.as(entry, crypto.PrivKeyEntry.type$);
        buf.add(sys.Str.plus("[private key] ", pk.cert().subject()));
      }
      else {
        if (sys.ObjUtil.is(entry, crypto.TrustEntry.type$)) {
          let cert = sys.ObjUtil.as(entry, crypto.TrustEntry.type$).cert();
          buf.add("[trusted certificate]\n");
          buf.add(sys.Str.plus("  Subject: ", cert.subject()));
          if (sys.ObjUtil.compareNE(cert.subject(), cert.issuer())) {
            buf.add(sys.Str.plus("\n   Issuer: ", cert.issuer()));
          }
          ;
        }
        else {
          if (entry == null) {
            buf.add("NOT FOUND");
          }
          ;
        }
        ;
      }
      ;
      this$.info(sys.Str.plus(sys.Str.plus(sys.Str.plus("", alias), ": "), buf));
      return;
    });
    return;
  }

  doRemove() {
    if (this.helpRequested()) {
      this.usageRemove();
    }
    ;
    if (!this.hasArg("alias")) {
      this.usageRemove("-alias required");
    }
    ;
    let alias = this.#argsMap.get("alias");
    let ks = this.keystore();
    if (!ks.containsAlias(sys.ObjUtil.coerce(alias, sys.Str.type$))) {
      this.exitErr(sys.Str.plus(sys.Str.plus("No entry with alias '", alias), "'"));
    }
    ;
    ks.remove(sys.ObjUtil.coerce(alias, sys.Str.type$));
    this.info(sys.Str.plus("Removed ", alias));
    return;
  }

  doRename() {
    if (this.helpRequested()) {
      this.usageRename();
    }
    ;
    if (!this.hasArg("alias")) {
      this.usageRename("-alias required");
    }
    ;
    if (!this.hasArg("to")) {
      this.usageRename("-to required");
    }
    ;
    let ks = this.keystore();
    let alias = this.#argsMap.get("alias");
    let to = this.#argsMap.get("to");
    let force = (this.hasArg("force") || this.hasArg("f"));
    let keep = this.hasArg("keep");
    if (!ks.containsAlias(sys.ObjUtil.coerce(alias, sys.Str.type$))) {
      return this.info(sys.Str.plus(sys.Str.plus("No entry with alias '", alias), "'"));
    }
    ;
    if ((ks.containsAlias(sys.ObjUtil.coerce(to, sys.Str.type$)) && !force)) {
      return this.info(sys.Str.plus(sys.Str.plus("Entry with alias '", to), "' already exists. Use -force option to rename"));
    }
    ;
    let entry = ks.get(sys.ObjUtil.coerce(alias, sys.Str.type$));
    ks.set(sys.ObjUtil.coerce(to, sys.Str.type$), sys.ObjUtil.coerce(entry, crypto.KeyStoreEntry.type$));
    if (!keep) {
      ks.remove(sys.ObjUtil.coerce(alias, sys.Str.type$));
    }
    ;
    this.info(sys.Str.plus(sys.Str.plus(sys.Str.plus("renamed ", alias), " to "), to));
    return;
  }

  parseArgs(args) {
    const this$ = this;
    if (args.isEmpty()) {
      this.err("No action specified");
      return false;
    }
    ;
    this.#argsMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    this.#action = args.first();
    let envArgs = this.#args.getRange(sys.Range.make(1, -1));
    envArgs.each((s,i) => {
      if ((!sys.Str.startsWith(s, "-") || sys.ObjUtil.compareLT(sys.Str.size(s), 2))) {
        return;
      }
      ;
      let name = sys.Str.getRange(s, sys.Range.make(1, -1));
      let val = "true";
      if ((sys.ObjUtil.compareLT(sys.Int.plus(i, 1), envArgs.size()) && !sys.Str.startsWith(envArgs.get(sys.Int.plus(i, 1)), "-"))) {
        (val = envArgs.get(sys.Int.plus(i, 1)));
      }
      ;
      this$.#argsMap.set(name, val);
      return;
    });
    if (this.hasArg("d")) {
      this.#dir = CryptoCli.parseArgToDir(sys.ObjUtil.coerce(this.#argsMap.get("d"), sys.Str.type$));
    }
    else {
      if (this.hasArg("var")) {
        this.#dir = CryptoCli.parseArgToDir(sys.ObjUtil.coerce(this.#argsMap.get("var"), sys.Str.type$));
      }
      ;
    }
    ;
    return true;
  }

  hasArg(arg) {
    return this.#argsMap.containsKey(arg);
  }

  helpRequested() {
    return (this.hasArg("help") || this.hasArg("?"));
  }

  static parseArgToFile(val) {
    if (sys.Str.contains(val, "\\")) {
      return sys.File.os(val).normalize();
    }
    else {
      return sys.ObjUtil.coerce(sys.File.make(sys.Str.toUri(val), false), sys.File.type$);
    }
    ;
  }

  static parseArgToDir(val) {
    let f = CryptoCli.parseArgToFile(val);
    if (f.isDir()) {
      return f;
    }
    ;
    return f.uri().plusSlash().toFile();
  }

  info(msg) {
    this.printLine(msg);
    return;
  }

  exitErr(msg) {
    this.err(msg);
    sys.Env.cur().exit(2);
    return;
  }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    out.printLine(sys.Str.plus(sys.Str.plus("Usage:\n  hx crypto <action> <action options>* <options>*\n\nActions:\n  add     Adds a private key + certificate to the keystore\n  trust   Adds a trusted certificate to the keystore\n  export  Export an entry from the keystore\n  remove  Removes an entry from the keystore\n  list    List summary information about entries in the keystore\n  rename  Rename an entry's alias in the keystore\n\nOptions:\n  -d <dir>    Path to directory containing crypto/ (default = ", this.#dir), ")\n  -var <dir>  Alias for -d <dir>\n  -help, -?   Print usage help.\n\nUse 'hx crypto <action> -help' to get action-specific help"));
    return 1;
  }

  usageAdd(err,out) {
    if (err === undefined) err = null;
    if (out === undefined) out = sys.Env.cur().out();
    if (err != null) {
      this.err(sys.ObjUtil.coerce(err, sys.Str.type$));
    }
    ;
    out.printLine("Add:\n  hx crypto add -alias <alias> -priv <file> -certs <file>\n  hx crypto add -alias <alias> -import <file> [-pass <password>]\n\nOptions:\n  -alias   <alias>   Add the private key + X.509 certificate chain\n                     with this alias\n  -priv    <file>    PEM-encoded private key\n  -certs   <file>    PEM-encoded X.509 certificate (the entire\n                     certificate chain should be included and must\n                     be in the correct order starting with the\n                     server certificate, then each Intermediate CA\n                     if any and ending with the Root CA)\n  -import  <file>    Import the private key and certificate from\n                     the given key store file. The private key and\n                     certificate should be the only entries in\n                     the key store. Supports key stores with .jks,\n                     .p12, .pfx, and .fks extensions.\n  -pass    <pass>    If the imported file is password protected,\n                     specify the password with this option.\n  -alg     <alg>     RSA or EC (default: RSA)\n  -force, -f         Add the certficiate even if the alias already\n                     exists\n");
    sys.Env.cur().exit(1);
    return;
  }

  usageTrust(err,out) {
    if (err === undefined) err = null;
    if (out === undefined) out = sys.Env.cur().out();
    if (err != null) {
      this.err(sys.ObjUtil.coerce(err, sys.Str.type$));
    }
    ;
    out.printLine("Trust:\n  hx crypto trust (-cert <file> | -uri <uri>) [-alias <alias>] [-f]\n\nOptions:\n  -cert   <file>  PEM-encoded X.509 certificate to trust. If there\n                  are multiple certificates in the file they will\n                  all be added.\n  -uri    <uri>   Trust the entire certificate chain for the given uri.\n  -alias  <alias> Add the trusted certificate with this alias.\n                  (default: subject's CN)\n  -force, -f      Add the certficiate even if the alias already exists\n");
    sys.Env.cur().exit(1);
    return;
  }

  usageExport(err,out) {
    if (err === undefined) err = null;
    if (out === undefined) out = sys.Env.cur().out();
    if (err != null) {
      this.err(sys.ObjUtil.coerce(err, sys.Str.type$));
    }
    ;
    out.printLine("Export:\n  hx crypto export -alias <alias>\n\nOptions:\n  -alias <alias> the alias of the entry to export\n");
    sys.Env.cur().exit(1);
    return;
  }

  usageList(err,out) {
    if (err === undefined) err = null;
    if (out === undefined) out = sys.Env.cur().out();
    if (err != null) {
      this.err(sys.ObjUtil.coerce(err, sys.Str.type$));
    }
    ;
    out.printLine("List:\n  hx crypto list [-alias <alias>]\n\nOptions:\n  -alias <alias> List information only for alias\n");
    sys.Env.cur().exit(1);
    return;
  }

  usageRemove(err,out) {
    if (err === undefined) err = null;
    if (out === undefined) out = sys.Env.cur().out();
    if (err != null) {
      this.err(sys.ObjUtil.coerce(err, sys.Str.type$));
    }
    ;
    out.printLine("List:\n  hx crypto remove -alias <alias>\n\nOptions:\n  -alias <alias> The alias of the entry to remove\n");
    sys.Env.cur().exit(1);
    return;
  }

  usageRename(err,out) {
    if (err === undefined) err = null;
    if (out === undefined) out = sys.Env.cur().out();
    if (err != null) {
      this.err(sys.ObjUtil.coerce(err, sys.Str.type$));
    }
    ;
    out.printLine("Rename:\n  hx crypto rename -alias <alias> -to <new alias> [-f] [-keep]\n\nOptions:\n  -alias <alias> The alias you want to rename\n  -to <alias>    The new alias you want to use for that entry\n  -force, -f     Force the rename even if an entry with the 'to'\n                 alias already exists.\n  -keep          Keep the original entry instead of removing it.\n");
    sys.Env.cur().exit(1);
    return;
  }

  static make() {
    const $self = new CryptoCli();
    CryptoCli.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxCli.make$($self);
    ;
    return;
  }

  keystore$Once() {
    const this$ = this;
    let cryptoDir = this.#dir.plus(sys.Uri.fromStr("crypto/")).normalize();
    if (!cryptoDir.exists()) {
      this.exitErr(sys.Str.plus("crypto directory does not exist: ", cryptoDir));
    }
    ;
    let keystoreFile = cryptoDir.plus(sys.Uri.fromStr("keystore.p12"));
    if (!keystoreFile.exists()) {
      this.exitErr(sys.Str.plus("keystore not found: ", keystoreFile));
    }
    ;
    let pool = concurrent.ActorPool.make((it) => {
      it.__name("CryptoCli");
      return;
    });
    let keystore = sys.Type.find("hxCrypto::CryptoKeyStore").make(sys.List.make(sys.Obj.type$, [pool, keystoreFile, this.log()]));
    return sys.ObjUtil.coerce(keystore, crypto.KeyStore.type$);
  }

}

const p = sys.Pod.add$('hxTools');
const xp = sys.Param.noParams$();
let m;
InitCli.type$ = p.at$('InitCli','hx::HxCli',[],{},128,InitCli);
StubCli.type$ = p.at$('StubCli','hx::HxCli',[],{},128,StubCli);
ConvertCli.type$ = p.at$('ConvertCli','hx::HxCli',[],{},128,ConvertCli);
CryptoCli.type$ = p.at$('CryptoCli','hx::HxCli',[],{},128,CryptoCli);
InitCli.type$.af$('headless',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Disables all prompts.\";}"}).af$('httpPort',73728,'sys::Int',{'util::Opt':"util::Opt{help=\"HTTP port\";}"}).af$('httpsDisable',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Disable HTTPS if configured\";}"}).af$('suUser',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"The su username for headless, defaults to su\";}"}).af$('suPass',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"The su user password for headless, defaults to auto-generated\";}"}).af$('dir',73728,'sys::File?',{'util::Arg':"util::Arg{help=\"Runtime database directory\";}"}).af$('showPassword',67584,'sys::Bool',{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('init',2048,'sys::Void',xp,{}).am$('open',2048,'folio::Folio',xp,{}).am$('close',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('db','folio::Folio',false)]),{}).am$('gatherInputs',2048,'sys::Void',xp,{}).am$('promptConfirm',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('promptInt',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('def','sys::Int',false)]),{}).am$('promptSu',2048,'sys::Str',xp,{}).am$('promptPassword',2048,'sys::Str',xp,{}).am$('createDatabase',2048,'sys::Void',xp,{}).am$('initHttpPort',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('initSu',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('genPassword',34818,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
StubCli.type$.af$('type',73728,'sys::Str',{'util::Opt':"util::Opt{help=\"pod type to stub: resource | fantom | conn\";}"}).af$('out',73728,'sys::File',{'util::Opt':"util::Opt{help=\"target base directory\";}"}).af$('desc',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"description of the pod\";}"}).af$('author',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"author name\";}"}).af$('org',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"organization name\";}"}).af$('orgUri',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"organization website\";}"}).af$('proj',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"project name\";}"}).af$('projUri',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"project website\";}"}).af$('lic',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"source code license\";}"}).af$('vcs',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"version control name (e.g. Git, Mercurial)\";}"}).af$('vcsUri',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"URL where the source code is hosted\";}"}).af$('skyarc',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"generate skyarc.trio (default = false)\";}"}).af$('meta',73728,'sys::Str?',{'util::Opt':"util::Opt{help=\"copy build.fan metadata from the given pod\";}"}).af$('libName',73728,'sys::Str?',{'util::Arg':"util::Arg{help=\"Haxall library name\";}"}).af$('today',67586,'sys::Date',{}).af$('typePrefix',67584,'sys::Str?',{}).af$('libOrg',67584,'sys::Str?',{}).af$('stdMacros',67584,'[sys::Str:sys::Str]',{}).af$('buildFile',67584,'sys::File?',{}).af$('podFandocFile',67584,'sys::File?',{}).af$('libDefFile',67584,'sys::File?',{}).af$('libFile',67584,'sys::File?',{}).af$('fanFuncsFile',67584,'sys::File?',{}).af$('connDispatchFile',67584,'sys::File?',{}).af$('axonFuncsFile',67584,'sys::File?',{}).af$('connDefFile',67584,'sys::File?',{}).af$('connPointDefFile',67584,'sys::File?',{}).af$('skyarcFile',67584,'sys::File?',{}).af$('headerApply',67584,'|sys::Str->sys::Str?|',{}).am$('usage',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('defName',2048,'sys::Str',xp,{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('loadMeta',2048,'sys::Void',xp,{}).am$('promptInput',2048,'sys::Void',xp,{}).am$('checkInput',2048,'sys::Bool',xp,{}).am$('fatal',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('initMacros',2048,'sys::Void',xp,{}).am$('genFileNames',2048,'sys::Void',xp,{}).am$('confirm',2048,'sys::Bool',xp,{}).am$('genBuild',2048,'sys::Void',xp,{}).am$('buildList',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj[]',false)]),{}).am$('genLibDef',2048,'sys::Void',xp,{}).am$('genLib',2048,'sys::Void',xp,{}).am$('genFanFuncs',2048,'sys::Void',xp,{}).am$('genAxonFuncs',2048,'sys::Void',xp,{}).am$('genConnDef',2048,'sys::Void',xp,{}).am$('genPointDef',2048,'sys::Void',xp,{}).am$('genConnDispatch',2048,'sys::Void',xp,{}).am$('genSkyarc',2048,'sys::Void',xp,{}).am$('genPodFandoc',2048,'sys::Void',xp,{}).am$('containsFcode',2048,'sys::Bool',xp,{}).am$('isHx',2048,'sys::Bool',xp,{}).am$('isResource',2048,'sys::Bool',xp,{}).am$('isConn',2048,'sys::Bool',xp,{}).am$('isFan',2048,'sys::Bool',xp,{}).am$('applyTemplate',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('resolve','|sys::Str->sys::Str?|?',true)]),{}).am$('template',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('promptConfirm',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('prompt',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('promptDef',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('def','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ConvertCli.type$.af$('outDir',73728,'sys::File',{'util::Opt':"util::Opt{help=\"Output directory\";}"}).af$('output',73728,'sys::Str',{'util::Opt':"util::Opt{help=\"Comma separated output formats: zinc, json, trio, csv\";}"}).af$('inputs',73728,'sys::File[]',{'util::Arg':"util::Arg{help=\"Input file(s) to convert\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('convert',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('inFile','sys::File',false),new sys.Param('format','sys::Str',false)]),{}).am$('read',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('write',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('format','sys::Str',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('nsOpts',2048,'haystack::Dict',xp,{}).am$('ns',2048,'haystack::Namespace',xp,{}).am$('make',139268,'sys::Void',xp,{});
CryptoCli.type$.af$('dir',67584,'sys::File',{}).af$('args',67586,'sys::Str[]',{}).af$('argsMap',67584,'[sys::Str:sys::Str]?',{}).af$('action',67584,'sys::Str?',{}).af$('keystore$Store',722944,'sys::Obj?',{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('keystore',526336,'crypto::KeyStore',xp,{}).am$('doAddKey',2048,'sys::Void',xp,{}).am$('import',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('keystore','crypto::KeyStore',false)]),{}).am$('readPEMs',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('alias','sys::Str',false),new sys.Param('keystore','crypto::KeyStore',false)]),{}).am$('doTrust',2048,'sys::Void',xp,{}).am$('doExport',2048,'sys::Void',xp,{}).am$('doList',2048,'sys::Void',xp,{}).am$('doRemove',2048,'sys::Void',xp,{}).am$('doRename',2048,'sys::Void',xp,{}).am$('parseArgs',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('hasArg',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Str',false)]),{}).am$('helpRequested',2048,'sys::Bool',xp,{}).am$('parseArgToFile',34818,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{}).am$('parseArgToDir',34818,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{}).am$('info',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('exitErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('usage',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('usageAdd',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Str?',true),new sys.Param('out','sys::OutStream',true)]),{}).am$('usageTrust',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Str?',true),new sys.Param('out','sys::OutStream',true)]),{}).am$('usageExport',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Str?',true),new sys.Param('out','sys::OutStream',true)]),{}).am$('usageList',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Str?',true),new sys.Param('out','sys::OutStream',true)]),{}).am$('usageRemove',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Str?',true),new sys.Param('out','sys::OutStream',true)]),{}).am$('usageRename',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Str?',true),new sys.Param('out','sys::OutStream',true)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('keystore$Once',133120,'crypto::KeyStore',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxTools");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;crypto 1.0;util 1.0;haystack 3.1.11;def 3.1.11;folio 3.1.11;hx 3.1.11;hxd 3.1.11;hxFolio 3.1.11;hxUser 3.1.11");
m.set("pod.summary", "Haxall CLI tools");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:29-05:00 New_York");
m.set("build.tsKey", "241210143129");
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
};
