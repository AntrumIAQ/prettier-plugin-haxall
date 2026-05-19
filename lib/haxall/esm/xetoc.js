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
import * as xetoEnv from './xetoEnv.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class LocalNamespace extends xetoEnv.MNamespace {
  constructor() {
    super();
    const this$ = this;
    this.#compileCount = concurrent.AtomicInt.make();
    return;
  }

  typeof() { return LocalNamespace.type$; }

  #repo = null;

  repo() { return this.#repo; }

  __repo(it) { if (it === undefined) return this.#repo; else this.#repo = it; }

  #build = null;

  build() { return this.#build; }

  __build(it) { if (it === undefined) return this.#build; else this.#build = it; }

  #compileCount = null;

  // private field reflection only
  __compileCount(it) { if (it === undefined) return this.#compileCount; else this.#compileCount = it; }

  static make(base,names,versions,repo,build) {
    const $self = new LocalNamespace();
    LocalNamespace.make$($self,base,names,versions,repo,build);
    return $self;
  }

  static make$($self,base,names,versions,repo,build) {
    xetoEnv.MNamespace.make$($self, base, names, versions, null);
    ;
    $self.#repo = repo;
    $self.#build = sys.ObjUtil.coerce(((this$) => { let $_u0 = build; if ($_u0 == null) return null; return sys.ObjUtil.toImmutable(build); })($self), sys.Type.find("[sys::Str:sys::File]?"));
    return;
  }

  isRemote() {
    return false;
  }

  doLoadSync(v) {
    const this$ = this;
    let c = sys.ObjUtil.coerce(sys.ObjUtil.with(XetoCompiler.make(), (it) => {
      it.ns(this$);
      it.libName(v.name());
      it.input(v.file());
      it.build(((this$) => { let $_u1 = this$.#build; if ($_u1 == null) return null; return this$.#build.get(v.name()); })(this$));
      return;
    }), XetoCompiler.type$);
    return sys.ObjUtil.coerce(c.compileLib(), xetoEnv.XetoLib.type$);
  }

  doLoadAsync(version,f) {
    try {
      sys.Func.call(f, null, this.doLoadSync(version));
    }
    catch ($_u2) {
      $_u2 = sys.Err.make($_u2);
      if ($_u2 instanceof sys.Err) {
        let e = $_u2;
        ;
        sys.Func.call(f, null, e);
      }
      else {
        throw $_u2;
      }
    }
    ;
    return;
  }

  compileLib(src,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    if (opts == null) {
      (opts = haystack.Etc.dict0());
    }
    ;
    let libName = sys.Str.plus("temp", sys.ObjUtil.coerce(this.#compileCount.getAndIncrement(), sys.Obj.type$.toNullable()));
    if (!sys.Str.startsWith(src, "pragma:")) {
      (src = sys.Str.plus("pragma: Lib <\n   version: \"0.0.0\"\n   depends: { { lib: \"sys\" } }\n >\n ", src));
    }
    ;
    let c = sys.ObjUtil.coerce(sys.ObjUtil.with(XetoCompiler.make(), (it) => {
      it.ns(this$);
      it.libName(libName);
      it.input(sys.Str.toBuf(src).toFile(sys.Uri.fromStr("temp.xeto")));
      it.applyOpts(opts);
      return;
    }), XetoCompiler.type$);
    return c.compileLib();
  }

  compileData(src,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    let c = sys.ObjUtil.coerce(sys.ObjUtil.with(XetoCompiler.make(), (it) => {
      it.ns(this$);
      it.input(sys.Str.toBuf(src).toFile(sys.Uri.fromStr("parse.xeto")));
      it.applyOpts(opts);
      return;
    }), XetoCompiler.type$);
    return c.compileData();
  }

}

class FileRepoScanner extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoc::FileLibVersion[]"));
    return;
  }

  typeof() { return FileRepoScanner.type$; }

  #log = null;

  // private field reflection only
  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #names = null;

  // private field reflection only
  __names(it) { if (it === undefined) return this.#names; else this.#names = it; }

  #path = null;

  // private field reflection only
  __path(it) { if (it === undefined) return this.#path; else this.#path = it; }

  #acc = null;

  // private field reflection only
  __acc(it) { if (it === undefined) return this.#acc; else this.#acc = it; }

  static make(log,names,path) {
    const $self = new FileRepoScanner();
    FileRepoScanner.make$($self,log,names,path);
    return $self;
  }

  static make$($self,log,names,path) {
    ;
    $self.#log = log;
    $self.#names = names;
    $self.#path = path;
    return;
  }

  scan() {
    const this$ = this;
    let t1 = sys.Duration.now();
    this.#path.each((dir) => {
      this$.scanZips(dir, dir.plus(sys.Uri.fromStr("lib/xeto/")));
      this$.scanSrcs(dir, dir.plus(sys.Uri.fromStr("src/xeto/")));
      return;
    });
    this.#acc.each((list,name) => {
      list.sort();
      return;
    });
    let t2 = sys.Duration.now();
    this.#log.info(sys.Str.plus(sys.Str.plus("FileRepo scan [", t2.minus(t1).toLocale()), "]"));
    return FileRepoScan.make(this.#acc);
  }

  scanZips(pathDir,libXetoDir) {
    const this$ = this;
    libXetoDir.list().each((sub) => {
      if (sub.isDir()) {
        this$.scanZipLib(sub);
      }
      ;
      return;
    });
    return;
  }

  scanZipLib(dir) {
    const this$ = this;
    let name = dir.name();
    let err = xetoEnv.XetoUtil.libNameErr(name);
    if (err != null) {
      return this.#log.warn(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid lib name ", sys.Str.toCode(name)), " ["), dir.osPath()), "]"));
    }
    ;
    dir.list().each((f) => {
      if ((f.isDir() || sys.ObjUtil.compareNE(f.ext(), "xetolib"))) {
        return;
      }
      ;
      let version = null;
      let basename = f.basename();
      if ((sys.ObjUtil.compareGE(sys.Str.size(basename), sys.Int.plus(sys.Str.size(name), 6)) && sys.ObjUtil.equals(sys.Str.get(basename, sys.Str.size(name)), 45))) {
        (version = sys.Version.fromStr(sys.Str.getRange(basename, sys.Range.make(sys.Int.plus(sys.Str.size(name), 1), -1)), false));
        if ((version != null && sys.ObjUtil.compareNE(version.segments().size(), 3))) {
          return this$.#log.warn(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid xetolib version ", version), " ["), f.osPath()), "]"));
        }
        ;
      }
      ;
      if (version == null) {
        return this$.#log.warn(sys.Str.plus(sys.Str.plus("Invalid xetolib filename [", f.osPath()), "]"));
      }
      ;
      this$.add(FileLibVersion.make(name, sys.ObjUtil.coerce(version, sys.Version.type$), f, null, null));
      return;
    });
    return;
  }

  scanSrcs(pathDir,srcXetoDir) {
    const this$ = this;
    srcXetoDir.list().each((f) => {
      if (!f.isDir()) {
        return;
      }
      ;
      let lib = f.plus(sys.Uri.fromStr("lib.xeto"));
      if (lib.exists()) {
        this$.scanSrcLib(pathDir, f, lib);
      }
      ;
      return;
    });
    return;
  }

  scanSrcLib(pathDir,srcDir,lib) {
    let name = srcDir.name();
    let err = xetoEnv.XetoUtil.libNameErr(name);
    if (err != null) {
      return this.#log.warn(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid lib name ", sys.Str.toCode(name)), " ["), srcDir.osPath()), "]"));
    }
    ;
    let entry = this.parseSrcVersion(name, lib);
    if (entry == null) {
      return;
    }
    ;
    this.add(sys.ObjUtil.coerce(entry, FileLibVersion.type$));
    return;
  }

  parseSrcVersion(name,lib) {
    const this$ = this;
    try {
      let c = sys.ObjUtil.coerce(sys.ObjUtil.with(XetoCompiler.make(), (it) => {
        it.names(this$.#names);
        it.libName(name);
        it.input(lib);
        return;
      }), XetoCompiler.type$);
      return c.parseLibVersion();
    }
    catch ($_u3) {
      $_u3 = sys.Err.make($_u3);
      if ($_u3 instanceof sys.Err) {
        let e = $_u3;
        ;
        this.#log.info(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot parse lib source meta [", lib.osPath()), "]\n  "), e));
        return null;
      }
      else {
        throw $_u3;
      }
    }
    ;
  }

  add(entry) {
    const this$ = this;
    let name = entry.name();
    let list = this.#acc.get(name);
    if (list == null) {
      this.#acc.set(name, sys.List.make(FileLibVersion.type$, [entry]));
      return;
    }
    ;
    let dupIndex = list.findIndex((x) => {
      return sys.ObjUtil.equals(x.version(), entry.version());
    });
    if (dupIndex == null) {
      list.add(entry);
      return;
    }
    ;
    let dup = list.get(sys.ObjUtil.coerce(dupIndex, sys.Int.type$));
    if ((entry.file().isDir() && sys.ObjUtil.equals(dup.file().ext(), "xetolib"))) {
      list.removeAt(sys.ObjUtil.coerce(dupIndex, sys.Int.type$));
      list.add(entry);
      return;
    }
    ;
    this.#log.warn(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Dup lib ", sys.Str.toCode(name)), " lib hidden ["), entry.file().osPath()), "]"));
    return;
  }

}

class FileRepoScan extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#ts = sys.DateTime.now().toLocale("YYYY-MM-DD hh:mm:ss");
    return;
  }

  typeof() { return FileRepoScan.type$; }

  #list = null;

  list() { return this.#list; }

  __list(it) { if (it === undefined) return this.#list; else this.#list = it; }

  #map = null;

  map() { return this.#map; }

  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  static make(map) {
    const $self = new FileRepoScan();
    FileRepoScan.make$($self,map);
    return $self;
  }

  static make$($self,map) {
    ;
    $self.#list = sys.ObjUtil.coerce(((this$) => { let $_u4 = map.keys().sort(); if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(map.keys().sort()); })($self), sys.Type.find("sys::Str[]"));
    $self.#map = sys.ObjUtil.coerce(((this$) => { let $_u5 = map; if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(map); })($self), sys.Type.find("[sys::Str:xetoc::FileLibVersion[]]"));
    return;
  }

}

class FileRepo extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#names = xeto.NameTable.make();
    this.#log = sys.Log.get("xeto");
    this.#scanRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return FileRepo.type$; }

  #names = null;

  names() { return this.#names; }

  __names(it) { if (it === undefined) return this.#names; else this.#names = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #env = null;

  env() { return this.#env; }

  __env(it) { if (it === undefined) return this.#env; else this.#env = it; }

  #scanRef = null;

  // private field reflection only
  __scanRef(it) { if (it === undefined) return this.#scanRef; else this.#scanRef = it; }

  static make(env) {
    const $self = new FileRepo();
    FileRepo.make$($self,env);
    return $self;
  }

  static make$($self,env) {
    if (env === undefined) env = xeto.XetoEnv.cur();
    ;
    $self.#env = env;
    $self.rescan();
    return;
  }

  scan() {
    return sys.ObjUtil.coerce(this.#scanRef.val(), FileRepoScan.type$);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this).qname()), " ("), sys.Str.toLocale(this.scan().ts())), ")");
  }

  rescan() {
    this.#scanRef.val(FileRepoScanner.make(this.#log, this.#names, this.#env.path()).scan());
    return this;
  }

  libs() {
    return this.scan().list();
  }

  versions(name,checked) {
    if (checked === undefined) checked = true;
    let versions = this.scan().map().get(name);
    if (versions != null) {
      return versions;
    }
    ;
    if (checked) {
      throw haystack.UnknownLibErr.make(name);
    }
    ;
    return null;
  }

  latest(name,checked) {
    if (checked === undefined) checked = true;
    let versions = this.versions(name, checked);
    if (versions != null) {
      return versions.last();
    }
    ;
    if (checked) {
      throw haystack.UnknownLibErr.make(name);
    }
    ;
    return null;
  }

  latestMatch(d,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let versions = this.versions(d.name(), checked);
    if (versions != null) {
      let match = versions.eachrWhile((x) => {
        return ((this$) => { if (d.versions().contains(x.version())) return x; return null; })(this$);
      });
      if (match != null) {
        return sys.ObjUtil.coerce(match, xeto.LibVersion.type$.toNullable());
      }
      ;
    }
    ;
    if (checked) {
      throw haystack.UnknownLibErr.make(d.toStr());
    }
    ;
    return null;
  }

  version(name,version,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let versions = this.versions(name, checked);
    if (versions != null) {
      let index = versions.binaryFind((x) => {
        return sys.ObjUtil.compare(version, x.version());
      });
      if (sys.ObjUtil.compareGE(index, 0)) {
        return versions.get(index);
      }
      ;
    }
    ;
    if (checked) {
      throw haystack.UnknownLibErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), "-"), version));
    }
    ;
    return null;
  }

  solveDepends(libs) {
    return xetoEnv.DependSolver.make(this, libs).solve();
  }

  createNamespace(libs) {
    return LocalNamespace.make(null, this.#names, libs, this, null);
  }

  createOverlayNamespace(base,libs) {
    return LocalNamespace.make(sys.ObjUtil.coerce(base, xetoEnv.MNamespace.type$.toNullable()), this.#names, libs, this, null);
  }

  build(build) {
    const this$ = this;
    let buildAsDepends = build.map((v) => {
      if (!v.isSrc()) {
        throw sys.ArgErr.make(sys.Str.plus("Not source lib: ", v));
      }
      ;
      return xetoEnv.MLibDepend.makeFields(v.name(), sys.ObjUtil.coerce(xeto.LibDependVersions.fromVersion(v.version()), xeto.LibDependVersions.type$));
    }, xeto.LibDepend.type$);
    let libs = this.solveDepends(sys.ObjUtil.coerce(buildAsDepends, sys.Type.find("xeto::LibDepend[]")));
    let buildFiles = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::File"));
    build.each((v) => {
      buildFiles.set(v.name(), sys.ObjUtil.coerce(xetoEnv.XetoUtil.srcToLibZip(v), sys.File.type$));
      return;
    });
    let ns = LocalNamespace.make(null, this.#names, libs, this, buildFiles);
    ns.libs();
    ns.versions().each((v) => {
      if (ns.libStatus(v.name()).isErr()) {
        sys.ObjUtil.echo(sys.Str.plus("ERROR: could not compile ", sys.Str.toCode(v.name())));
      }
      ;
      return;
    });
    return ns;
  }

  createFromData(recs) {
    const this$ = this;
    let libNames = xetoEnv.XetoUtil.dataToLibs(recs);
    let versions = libNames.map((libName) => {
      return sys.ObjUtil.coerce(this$.latest(libName), xeto.LibVersion.type$);
    }, xeto.LibVersion.type$);
    return this.build(sys.ObjUtil.coerce(versions, sys.Type.find("xeto::LibVersion[]")));
  }

}

class FileLibVersion extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FileLibVersion.type$; }

  compare() { return xeto.LibVersion.prototype.compare.apply(this, arguments); }

  asDepend() { return xeto.LibVersion.prototype.asDepend.apply(this, arguments); }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #docRef = null;

  // private field reflection only
  __docRef(it) { if (it === undefined) return this.#docRef; else this.#docRef = it; }

  #fileRef = null;

  fileRef() { return this.#fileRef; }

  __fileRef(it) { if (it === undefined) return this.#fileRef; else this.#fileRef = it; }

  #dependsRef = null;

  // private field reflection only
  __dependsRef(it) { if (it === undefined) return this.#dependsRef; else this.#dependsRef = it; }

  static make(name,version,file,doc,depends) {
    const $self = new FileLibVersion();
    FileLibVersion.make$($self,name,version,file,doc,depends);
    return $self;
  }

  static make$($self,name,version,file,doc,depends) {
    $self.#name = name;
    $self.#version = version;
    $self.#fileRef = file;
    $self.#docRef = doc;
    $self.#dependsRef = sys.ObjUtil.coerce(((this$) => { let $_u7 = sys.ObjUtil.coerce(((this$) => { let $_u8 = depends; if ($_u8 == null) return null; return sys.ObjUtil.toImmutable(depends); })(this$), sys.Type.find("xeto::LibDepend[]?")); if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(((this$) => { let $_u9 = depends; if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(depends); })(this$), sys.Type.find("xeto::LibDepend[]?"))); })($self), sys.Type.find("xeto::LibDepend[]?"));
    return;
  }

  static makeFile(file) {
    const $self = new FileLibVersion();
    FileLibVersion.makeFile$($self,file);
    return $self;
  }

  static makeFile$($self,file) {
    let n = file.basename();
    let dash = ((this$) => { let $_u10 = sys.Str.index(n, "-"); if ($_u10 != null) return $_u10; throw sys.Err.make(n); })($self);
    $self.#name = sys.Str.getRange(n, sys.Range.make(0, sys.ObjUtil.coerce(dash, sys.Int.type$), true));
    $self.#version = sys.ObjUtil.coerce(sys.Version.fromStr(sys.Str.getRange(n, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(dash, sys.Int.type$), 1), -1))), sys.Version.type$);
    $self.#fileRef = file;
    return;
  }

  doc() {
    if (this.#docRef == null) {
      this.loadMeta();
    }
    ;
    return sys.ObjUtil.coerce(this.#docRef, sys.Str.type$);
  }

  file(checked) {
    if (checked === undefined) checked = true;
    return this.#fileRef;
  }

  isSrc() {
    return this.#fileRef.isDir();
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), "-"), this.#version);
  }

  depends() {
    if (this.#dependsRef == null) {
      this.loadMeta();
    }
    ;
    return sys.ObjUtil.coerce(this.#dependsRef, sys.Type.find("xeto::LibDepend[]"));
  }

  loadMeta() {
    if (this.file().isDir()) {
      throw sys.Err.make("src meta must be passed to make");
    }
    ;
    let zip = sys.Zip.open(sys.ObjUtil.coerce(this.file(), sys.File.type$));
    try {
      this.parseMeta(sys.ObjUtil.coerce(zip.contents().getChecked(sys.Uri.fromStr("/meta.props")), sys.File.type$));
    }
    finally {
      zip.close();
    }
    ;
    return;
  }

  parseMeta(f) {
    const this$ = this;
    let props = f.readProps();
    let doc = ((this$) => { let $_u11 = props.get("doc"); if ($_u11 != null) return $_u11; return ""; })(this);
    sys.ObjUtil.trap(FileLibVersion.type$.slot("docRef"),"setConst", sys.List.make(sys.Obj.type$.toNullable(), [this, doc]));
    let depends = xeto.LibDepend.type$.emptyList();
    let dependsStr = ((this$) => { let $_u12 = props.get("depends"); if ($_u12 == null) return null; return sys.Str.trimToNull(props.get("depends")); })(this);
    if (dependsStr != null) {
      (depends = sys.Str.split(dependsStr, sys.ObjUtil.coerce(59, sys.Int.type$.toNullable())).map((s) => {
        return FileLibVersion.parseDepend(s);
      }, xeto.LibDepend.type$));
    }
    ;
    sys.ObjUtil.trap(FileLibVersion.type$.slot("dependsRef"),"setConst", sys.List.make(sys.Obj.type$.toNullable(), [this, sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(depends), sys.Type.find("sys::Obj[]"))]));
    return;
  }

  static parseDepend(s) {
    let sp = ((this$) => { let $_u13 = sys.Str.index(s, " "); if ($_u13 != null) return $_u13; throw sys.ParseErr.make(sys.Str.plus("Invalid depend: ", s)); })(this);
    let n = sys.Str.trim(sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(sp, sys.Int.type$), true)));
    let v = xeto.LibDependVersions.fromStr(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sp, sys.Int.type$), 1), -1)));
    return xetoEnv.MLibDepend.makeFields(n, sys.ObjUtil.coerce(v, xeto.LibDependVersions.type$));
  }

}

class Step extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Step.type$; }

  #compiler = null;

  compiler(it) {
    if (it === undefined) {
      return this.#compiler;
    }
    else {
      this.#compiler = it;
      return;
    }
  }

  ns() {
    return this.#compiler.ns();
  }

  cns() {
    return sys.ObjUtil.coerce(this.#compiler.cns(), ANamespace.type$);
  }

  names() {
    return sys.ObjUtil.coerce(this.#compiler.names(), xeto.NameTable.type$);
  }

  isLib() {
    return this.#compiler.isLib();
  }

  isData() {
    return !this.#compiler.isLib();
  }

  isSys() {
    return this.#compiler.isSys();
  }

  isSysComp() {
    return this.#compiler.isSysComp();
  }

  sys() {
    return this.#compiler.sys();
  }

  depends() {
    return this.#compiler.depends();
  }

  ast() {
    return sys.ObjUtil.coerce(this.#compiler.ast(), ADoc.type$);
  }

  data() {
    return sys.ObjUtil.coerce(this.#compiler.data(), ADataDoc.type$);
  }

  lib() {
    return sys.ObjUtil.coerce(this.#compiler.lib(), ALib.type$);
  }

  pragma() {
    return this.#compiler.pragma();
  }

  info(msg) {
    this.#compiler.info(msg);
    return;
  }

  err(msg,loc,err) {
    if (err === undefined) err = null;
    return this.#compiler.err(msg, loc, err);
  }

  errSlot(slot,msg,loc,err) {
    if (err === undefined) err = null;
    return this.#compiler.errSlot(slot, msg, loc, err);
  }

  err2(msg,loc1,loc2,err) {
    if (err === undefined) err = null;
    return this.#compiler.err2(msg, loc1, loc2, err);
  }

  bombIfErr() {
    if (!this.#compiler.errs().isEmpty()) {
      throw sys.ObjUtil.coerce(this.#compiler.errs().first(), sys.Err.type$);
    }
    ;
    return;
  }

  isObj(s) {
    return s.cbase() == null;
  }

  strScalar(loc,str) {
    return AScalar.make(loc, this.sys().str(), str, str);
  }

  dirList(dir) {
    const this$ = this;
    return dir.list().sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
  }

  static make() {
    const $self = new Step();
    Step.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class LoadBindings extends Step {
  constructor() {
    super();
    const this$ = this;
    this.#bindings = xetoEnv.SpecBindings.cur();
    return;
  }

  typeof() { return LoadBindings.type$; }

  #bindings = null;

  bindings() { return this.#bindings; }

  __bindings(it) { if (it === undefined) return this.#bindings; else this.#bindings = it; }

  #loader = null;

  // private field reflection only
  __loader(it) { if (it === undefined) return this.#loader; else this.#loader = it; }

  run() {
    this.loadBindings();
    this.assignBindings();
    return;
  }

  loadBindings() {
    if (this.#bindings.needsLoad(this.lib().name(), sys.ObjUtil.coerce(this.lib().version(), sys.Version.type$))) {
      this.#loader = this.#bindings.load(this.lib().name(), sys.ObjUtil.coerce(this.lib().version(), sys.Version.type$));
    }
    ;
    return;
  }

  assignBindings() {
    const this$ = this;
    this.lib().types().each((spec) => {
      spec.bindingRef(this$.resolveBinding(spec));
      return;
    });
    this.lib().tops().each((top) => {
      if (top.bindingRef() == null) {
        top.bindingRef(top.ctype().binding());
      }
      ;
      return;
    });
    return;
  }

  resolveBinding(spec) {
    let b = this.#bindings.forSpec(spec.qname());
    if (b != null) {
      return sys.ObjUtil.coerce(b, xeto.SpecBinding.type$);
    }
    ;
    if (this.#loader != null) {
      (b = this.#loader.loadSpec(this.#bindings, spec));
      if (b != null) {
        return sys.ObjUtil.coerce(b, xeto.SpecBinding.type$);
      }
      ;
    }
    ;
    (b = spec.base().binding());
    if (b.isInheritable()) {
      return sys.ObjUtil.coerce(b, xeto.SpecBinding.type$);
    }
    ;
    if (spec.isScalar()) {
      return xetoEnv.GenericScalarBinding.make(spec.ctype().qname());
    }
    ;
    return this.#bindings.dict();
  }

  static make() {
    const $self = new LoadBindings();
    LoadBindings.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    ;
    return;
  }

}

class InheritSlots extends Step {
  constructor() {
    super();
    const this$ = this;
    this.#noSlots = sys.ObjUtil.coerce(((this$) => { let $_u14 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::CSpec")); if ($_u14 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::CSpec"))); })(this), sys.Type.find("[sys::Str:xetoEnv::CSpec]"));
    this.#stack = sys.List.make(ASpec.type$);
    this.#globals = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::CSpec?"));
    this.#types = sys.List.make(ASpec.type$);
    return;
  }

  typeof() { return InheritSlots.type$; }

  #noSlots = null;

  noSlots() { return this.#noSlots; }

  __noSlots(it) { if (it === undefined) return this.#noSlots; else this.#noSlots = it; }

  #stack = null;

  // private field reflection only
  __stack(it) { if (it === undefined) return this.#stack; else this.#stack = it; }

  #globals = null;

  // private field reflection only
  __globals(it) { if (it === undefined) return this.#globals; else this.#globals = it; }

  #types = null;

  // private field reflection only
  __types(it) { if (it === undefined) return this.#types; else this.#types = it; }

  run() {
    const this$ = this;
    this.lib().tops().each((spec) => {
      this$.inherit(spec);
      return;
    });
    this.bombIfErr();
    this.lib().typesRef(this.#types);
    return;
  }

  inherit(spec) {
    if (spec.cslotsRef() != null) {
      return;
    }
    ;
    if ((this.#stack.containsSame(spec) && !this.isSys())) {
      this.err(sys.Str.plus("Cyclic inheritance: ", spec.name()), spec.loc());
      spec.flags(0);
      spec.cslotsRef(this.#noSlots);
    }
    ;
    this.#stack.push(spec);
    this.doInherit(spec);
    this.#stack.pop();
    return;
  }

  doInherit(spec) {
    const this$ = this;
    if (spec.isObj()) {
      spec.flags(0);
      spec.cslotsRef(this.#noSlots);
      this.#types.add(spec);
      return;
    }
    ;
    spec.base(this.inferBase(spec));
    let explicitTypeRef = spec.typeRef() != null;
    if (!explicitTypeRef) {
      spec.typeRef(this.inferType(spec));
    }
    ;
    if (spec.base() == null) {
      spec.base(spec.typeRef().deref());
    }
    ;
    if (spec.base().isAst()) {
      this.inherit(sys.ObjUtil.coerce(spec.base(), ASpec.type$));
    }
    ;
    if (spec.isType()) {
      this.#types.add(spec);
    }
    ;
    if ((explicitTypeRef && spec.base().isMaybe() && !spec.metaHas("maybe"))) {
      spec.metaSetNone("maybe");
    }
    ;
    if (this.isEnum(spec)) {
      return this.inheritEnum(spec);
    }
    ;
    this.inheritFlags(spec);
    this.inheritSlots(spec);
    if (spec.slots() != null) {
      spec.slots().each((slot) => {
        this$.inherit(slot);
        return;
      });
    }
    ;
    return;
  }

  inferBase(x) {
    if (x.base() != null) {
      return x.base();
    }
    ;
    let base = this.inferBaseGlobal(x);
    if (base != null) {
      return base;
    }
    ;
    return ((this$) => { let $_u15 = x.typeRef(); if ($_u15 == null) return null; return x.typeRef().deref(); })(this);
  }

  inferBaseGlobal(x) {
    if (x.isTop()) {
      return null;
    }
    ;
    if (x.parent().isQuery()) {
      return null;
    }
    ;
    let global = this.cns().global(x.name(), x.loc());
    if (global == null) {
      return null;
    }
    ;
    return global;
  }

  inferType(x) {
    if (x.typeRef() != null) {
      return sys.ObjUtil.coerce(x.typeRef(), ASpecRef.type$);
    }
    ;
    if (x.base() != null) {
      return ASpecRef.makeResolved(x.loc(), x.base().ctype());
    }
    ;
    return sys.ObjUtil.coerce(((this$) => { let $_u16 = ((this$) => { if (x.val() == null) return this$.sys().dict(); return this$.sys().str(); })(this$); x.typeRef($_u16); return $_u16; })(this), ASpecRef.type$);
  }

  inheritFlags(x) {
    if (this.isSys()) {
      x.flags(this.computeFlagsSys(x));
    }
    else {
      if (this.isSysComp()) {
        x.flags(this.computeFlagsSysComp(x));
      }
      else {
        x.flags(this.computeFlagsNonSys(x));
      }
      ;
    }
    ;
    return;
  }

  computeFlagsNonSys(x) {
    let flags = sys.Int.and(x.base().flags(), xetoEnv.MSpecFlags.inheritMask());
    if (x.meta() != null) {
      let maybe = x.meta().get("maybe");
      if (maybe != null) {
        if (maybe.isNone()) {
          (flags = sys.Int.and(flags, sys.Int.not(xetoEnv.MSpecFlags.maybe())));
        }
        else {
          (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.maybe()));
        }
        ;
      }
      ;
    }
    ;
    let baseName = x.base().name();
    let $_u18 = baseName;
    if (sys.ObjUtil.equals($_u18, "And")) {
      (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.and()));
    }
    else if (sys.ObjUtil.equals($_u18, "Or")) {
      (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.or()));
    }
    ;
    return flags;
  }

  computeFlagsSys(x) {
    let flags = 0;
    if (x.metaHas("maybe")) {
      (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.maybe()));
    }
    ;
    for (let p = x; p != null; (p = sys.ObjUtil.coerce(p.base(), ASpec.type$.toNullable()))) {
      let $_u19 = p.name();
      if (sys.ObjUtil.equals($_u19, "Marker")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.marker()));
      }
      else if (sys.ObjUtil.equals($_u19, "Scalar")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.scalar()));
      }
      else if (sys.ObjUtil.equals($_u19, "Ref")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.ref()));
      }
      else if (sys.ObjUtil.equals($_u19, "MultiRef")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.multiRef()));
      }
      else if (sys.ObjUtil.equals($_u19, "Choice")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.choice()));
      }
      else if (sys.ObjUtil.equals($_u19, "Dict")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.dict()));
      }
      else if (sys.ObjUtil.equals($_u19, "List")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.list()));
      }
      else if (sys.ObjUtil.equals($_u19, "Query")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.query()));
      }
      else if (sys.ObjUtil.equals($_u19, "Func")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.func()));
      }
      else if (sys.ObjUtil.equals($_u19, "Interface")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.interface()));
      }
      else if (sys.ObjUtil.equals($_u19, "None")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.none()));
      }
      else if (sys.ObjUtil.equals($_u19, "Self")) {
        (flags = sys.Int.or(flags, xetoEnv.MSpecFlags.self()));
      }
      ;
    }
    ;
    return flags;
  }

  computeFlagsSysComp(x) {
    if (sys.ObjUtil.equals(x.name(), "Comp")) {
      return xetoEnv.MSpecFlags.comp();
    }
    ;
    return this.computeFlagsNonSys(x);
  }

  inheritSlots(spec) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::CSpec"));
    acc.ordered(true);
    let autoCount = 0;
    let base = spec.base();
    if (spec.isAnd()) {
      let ofs = spec.cofs();
      if (ofs != null) {
        ofs.each((of$) => {
          if (of$.isAst()) {
            this$.inherit(sys.ObjUtil.coerce(of$, ASpec.type$));
          }
          ;
          (autoCount = this$.inheritSlotsFrom(spec, acc, autoCount, of$));
          return;
        });
      }
      ;
    }
    else {
      (autoCount = this.inheritSlotsFrom(spec, acc, autoCount, sys.ObjUtil.coerce(base, xetoEnv.CSpec.type$)));
    }
    ;
    this.addOwnSlots(spec, acc, autoCount);
    spec.cslotsRef(acc);
    return;
  }

  inheritSlotsFrom(spec,acc,autoCount,base) {
    const this$ = this;
    base.cslots((slot) => {
      let name = slot.name();
      if (xetoEnv.XetoUtil.isAutoName(name)) {
        (name = this$.compiler().autoName(((this$) => { let $_u20 = autoCount;autoCount = sys.Int.increment(autoCount); return $_u20; })(this$)));
      }
      ;
      let dup = acc.get(name);
      if (dup === slot) {
        return;
      }
      ;
      if (dup != null) {
        (slot = this$.mergeInheritedSlots(spec, name, sys.ObjUtil.coerce(dup, xetoEnv.CSpec.type$), slot));
      }
      ;
      acc.set(name, slot);
      return;
    });
    return autoCount;
  }

  addOwnSlots(spec,acc,autoCount) {
    const this$ = this;
    if (spec.slots() == null) {
      return autoCount;
    }
    ;
    spec.slots().each((slot) => {
      let name = slot.name();
      if (xetoEnv.XetoUtil.isAutoName(name)) {
        (name = this$.compiler().autoName(((this$) => { let $_u21 = autoCount;autoCount = sys.Int.increment(autoCount); return $_u21; })(this$)));
      }
      ;
      let dup = acc.get(name);
      if (dup != null) {
        if (dup === slot) {
          return;
        }
        ;
        acc.set(name, this$.overrideSlot(sys.ObjUtil.coerce(dup, xetoEnv.CSpec.type$), slot));
      }
      else {
        acc.set(name, slot);
      }
      ;
      return;
    });
    return autoCount;
  }

  overrideSlot(base,slot) {
    slot.base(base);
    let val = slot.val();
    if ((val != null && val.typeRef() == null)) {
      val.typeRef(ASpecRef.makeResolved(val.loc(), base.ctype()));
    }
    ;
    return slot;
  }

  mergeInheritedSlots(spec,name,a,b) {
    if ((a.isQuery() && b.isQuery())) {
      return this.mergeQuerySlots(spec, name, a, b);
    }
    ;
    if (this.isDerivedFrom(a, b)) {
      return b;
    }
    ;
    if (this.isDerivedFrom(b, a)) {
      return a;
    }
    ;
    this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Conflicing inherited slots: ", a.qname()), ", "), b.qname()), spec.loc());
    return a;
  }

  isDerivedFrom(a,b) {
    if (b == null) {
      return false;
    }
    ;
    if (b === a) {
      return true;
    }
    ;
    return this.isDerivedFrom(a, b.cbase());
  }

  mergeQuerySlots(spec,name,a,b) {
    let loc = spec.loc();
    let merge = ASpec.make(loc, this.lib(), spec, name);
    merge.typeRef(ASpecRef.makeResolved(loc, a.ctype()));
    merge.base(a);
    merge.flags(a.flags());
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::CSpec"));
    acc.ordered(true);
    let autoCount = 0;
    (autoCount = this.inheritSlotsFrom(merge, acc, autoCount, a));
    (autoCount = this.inheritSlotsFrom(merge, acc, autoCount, b));
    merge.cslotsRef(acc);
    spec.initSlots().add(name, merge);
    return merge;
  }

  isEnum(spec) {
    let t = spec.typeRef().deref();
    return (t.isSys() && sys.ObjUtil.equals(t.name(), "Enum"));
  }

  inheritEnum(spec) {
    const this$ = this;
    spec.base(spec.typeRef().deref());
    spec.flags(sys.Int.or(spec.base().flags(), xetoEnv.MSpecFlags.enum()));
    let loc = spec.loc();
    if (spec.metaHas("sealed")) {
      this.err("Enum types are implied sealed", loc);
    }
    else {
      spec.metaInit().set("sealed", this.sys().markerScalar(loc));
    }
    ;
    let slots = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::CSpec"));
    slots.ordered(true);
    let enums = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::CSpec"));
    enums.ordered(true);
    let hasKeys = false;
    let enumRef = ASpecRef.makeResolved(loc, spec);
    let defKey = null;
    ((this$) => { let $_u22 = spec.slots(); if ($_u22 == null) return null; return spec.slots().each((slot) => {
      let item = this$.inheritEnumItem(spec, enumRef, slot);
      slots.add(item.name(), item);
      let key = item.name();
      let keyVal = sys.ObjUtil.as(item.metaGet("key"), AScalar.type$);
      if (keyVal != null) {
        (key = keyVal.str());
        (hasKeys = true);
      }
      ;
      if (enums.get(key) != null) {
        this$.err(sys.Str.plus("Duplicate enum key: ", key), item.loc());
      }
      else {
        enums.add(key, item);
      }
      ;
      if (defKey == null) {
        (defKey = key);
      }
      ;
      return;
    }); })(this);
    if (!hasKeys) {
      (enums = slots);
    }
    ;
    if (defKey == null) {
      this.err("Enum has no items", spec.loc());
    }
    else {
      spec.metaInit().set("val", AScalar.make(spec.loc(), enumRef, sys.ObjUtil.coerce(defKey, sys.Str.type$)));
    }
    ;
    spec.cslotsRef(slots);
    spec.enums(enums);
    return;
  }

  inheritEnumItem(enum$,enumRef,item) {
    if (item.typeRef() !== this.sys().marker()) {
      this.err(sys.Str.plus(sys.Str.plus("Enum item '", item.name()), "' cannot have type"), item.loc());
    }
    ;
    item.base(enum$);
    item.typeRef(enumRef);
    item.flags(enum$.flags());
    item.cslotsRef(this.#noSlots);
    return item;
  }

  static make() {
    const $self = new InheritSlots();
    InheritSlots.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    ;
    return;
  }

}

class OutputZip extends Step {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return OutputZip.type$; }

  run() {
    if (!this.needToRun()) {
      return;
    }
    ;
    let srcDir = this.compiler().input();
    let zipFile = this.compiler().build();
    zipFile.parent().create();
    let zip = sys.Zip.write(zipFile.out());
    try {
      this.writeMeta(zip, "/meta.props");
      this.writeToZip(zip, "", sys.ObjUtil.coerce(srcDir, sys.File.type$));
    }
    finally {
      zip.close();
    }
    ;
    return;
  }

  needToRun() {
    if (!this.compiler().isBuild()) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(sys.Env.cur().runtime(), "js")) {
      return false;
    }
    ;
    return true;
  }

  writeMeta(zip,path) {
    let meta = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    meta.ordered(true);
    meta.set("name", this.lib().name());
    meta.set("version", this.lib().version().toStr());
    meta.set("depends", this.depends().list().join(";"));
    meta.set("doc", sys.ObjUtil.coerce(((this$) => { let $_u23 = this$.lib().meta().getStr("doc"); if ($_u23 != null) return $_u23; return ""; })(this), sys.Str.type$));
    zip.writeNext(sys.Str.toUri(path)).writeProps(meta).close();
    return;
  }

  writeToZip(zip,path,file) {
    const this$ = this;
    if (!this.includeInZip(file)) {
      return;
    }
    ;
    if (file.isDir()) {
      this.dirList(file).each((kid) => {
        this$.writeToZip(zip, sys.Str.plus(sys.Str.plus(path, "/"), kid.name()), kid);
        return;
      });
      return;
    }
    ;
    try {
      let out = zip.writeNext(sys.Str.toUri(path), sys.ObjUtil.coerce(file.modified(), sys.DateTime.type$));
      file.in().pipe(out);
      out.close();
    }
    catch ($_u24) {
      $_u24 = sys.Err.make($_u24);
      if ($_u24 instanceof sys.Err) {
        let e = $_u24;
        ;
        throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot write file into zip '", path), "': "), e), sys.ObjUtil.coerce(util.FileLoc.makeFile(file), util.FileLoc.type$), e);
      }
      else {
        throw $_u24;
      }
    }
    ;
    return;
  }

  includeInZip(file) {
    if (sys.Str.startsWith(file.name(), ".")) {
      return false;
    }
    ;
    return true;
  }

  static make() {
    const $self = new OutputZip();
    OutputZip.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    return;
  }

}

class CheckErrors extends Step {
  constructor() {
    super();
    const this$ = this;
    this.#checkVal = xetoEnv.CheckVal.make(haystack.Etc.dict0());
    return;
  }

  typeof() { return CheckErrors.type$; }

  #checkVal = null;

  checkVal() { return this.#checkVal; }

  __checkVal(it) { if (it === undefined) return this.#checkVal; else this.#checkVal = it; }

  run() {
    if (this.isLib()) {
      this.checkLib(this.lib());
    }
    else {
      this.checkData(sys.ObjUtil.coerce(this.data().root(), AData.type$), null);
    }
    ;
    this.bombIfErr();
    return;
  }

  checkLib(x) {
    const this$ = this;
    if (!xetoEnv.XetoUtil.isLibName(x.name())) {
      this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid lib name '", x.name()), "': "), xetoEnv.XetoUtil.libNameErr(x.name())), x.loc());
    }
    ;
    this.checkLibMeta(this.lib());
    x.tops().each((type) => {
      this$.checkTop(type);
      return;
    });
    x.instances().each((instance,name) => {
      this$.checkInstance(x, name, instance);
      return;
    });
    return;
  }

  checkLibMeta(x) {
    const this$ = this;
    x.meta().each((v,n) => {
      if (xetoEnv.XetoUtil.isReservedLibMetaName(n)) {
        this$.err(sys.Str.plus(sys.Str.plus("Reserverd lib meta tag '", n), "'"), x.loc());
      }
      ;
      return;
    });
    return;
  }

  checkTop(x) {
    this.checkTopName(x);
    this.checkTypeInherit(x);
    this.checkSpec(x);
    if (x.isType()) {
      this.checkType(x);
    }
    else {
      if (x.isGlobal()) {
        this.checkGlobal(x);
      }
      else {
        if (x.isMeta()) {
          this.checkMetaSpec(x);
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  checkTopName(x) {
    if (this.lib().instances().get(x.name()) != null) {
      this.err(sys.Str.plus(sys.Str.plus("Spec '", x.name()), "' conflicts with instance of the same name"), x.loc());
    }
    ;
    if (xetoEnv.XetoUtil.isReservedSpecName(x.name())) {
      this.err(sys.Str.plus(sys.Str.plus("Spec name '", x.name()), "' is reserved"), x.loc());
    }
    ;
    return;
  }

  checkTypeInherit(x) {
    if (!x.isType()) {
      return;
    }
    ;
    if (x.base() == null) {
      return;
    }
    ;
    let base = x.cbase();
    this.checkCanInheritFrom(x, sys.ObjUtil.coerce(base, xetoEnv.CSpec.type$), x.loc());
    if (((x.isAnd() || x.isOr()) && !x.parsedCompound())) {
      return this.err(sys.Str.plus(sys.Str.plus("Cannot directly inherit from compound type '", base.name()), "'"), x.loc());
    }
    ;
    if (x.parsedCompound()) {
      this.checkCompoundType(x);
    }
    ;
    return;
  }

  checkCompoundType(x) {
    const this$ = this;
    let dict = null;
    let list = null;
    let scalar = null;
    x.cofs().each((of$) => {
      if (of$.isDict()) {
        (dict = of$);
      }
      ;
      if (of$.isList()) {
        (list = of$);
      }
      ;
      if (of$.isScalar()) {
        (scalar = of$);
      }
      ;
      this$.checkCanInheritFrom(x, of$, x.loc());
      return;
    });
    if (x.isAnd()) {
      if ((scalar != null && dict != null)) {
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot And scalar '", scalar.name()), "' and dict '"), dict.name()), "'"), x.loc());
      }
      ;
      if ((scalar != null && list != null)) {
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot And scalar '", scalar.name()), "' and list '"), list.name()), "'"), x.loc());
      }
      ;
      if ((dict != null && list != null)) {
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot And dict '", dict.name()), "' and list '"), list.name()), "'"), x.loc());
      }
      ;
    }
    ;
    return;
  }

  checkCanInheritFrom(x,base,loc) {
    if (base.isEnum()) {
      return this.err(sys.Str.plus(sys.Str.plus("Cannot inherit from Enum type '", base.name()), "'"), loc);
    }
    ;
    if ((base.cmeta().has("sealed") && !base.isAst() && !x.parsedSyntheticRef())) {
      return this.err(sys.Str.plus(sys.Str.plus("Cannot inherit from sealed type '", base.name()), "'"), loc);
    }
    ;
    return;
  }

  checkSpec(x) {
    this.checkSpecMeta(x);
    this.checkCovariant(x);
    if (x.isQuery()) {
      return this.checkSpecQuery(x);
    }
    ;
    this.checkSlots(x);
    return;
  }

  checkCovariant(x) {
    let b = x.base();
    if (b == null) {
      return;
    }
    ;
    let xType = x.ctype();
    let bType = b.ctype();
    if (!xType.cisa(bType)) {
      this.errCovariant(x, sys.Str.plus(sys.Str.plus("type '", xType), "' conflicts"), sys.Str.plus(sys.Str.plus("of type '", bType), "'"));
    }
    ;
    let xOf = x.cof();
    let bOf = b.cof();
    if ((xOf != null && bOf != null && !xOf.cisa(sys.ObjUtil.coerce(bOf, xetoEnv.CSpec.type$)))) {
      this.errCovariant(x, sys.Str.plus(sys.Str.plus("of's type '", xOf), "' conflicts"), sys.Str.plus(sys.Str.plus("of's type '", bOf), "'"));
    }
    ;
    let xMinVal = xetoEnv.XetoUtil.toFloat(x.cmeta().get("minVal"));
    let bMinVal = xetoEnv.XetoUtil.toFloat(b.cmeta().get("minVal"));
    if ((xMinVal != null && bMinVal != null && sys.ObjUtil.compareLT(xMinVal, bMinVal))) {
      this.errCovariant(x, sys.Str.plus(sys.Str.plus("minVal '", sys.ObjUtil.coerce(xMinVal, sys.Obj.type$.toNullable())), "' conflicts"), sys.Str.plus(sys.Str.plus("minVal '", sys.ObjUtil.coerce(bMinVal, sys.Obj.type$.toNullable())), "'"));
    }
    ;
    let xMaxVal = xetoEnv.XetoUtil.toFloat(x.cmeta().get("maxVal"));
    let bMaxVal = xetoEnv.XetoUtil.toFloat(b.cmeta().get("maxVal"));
    if ((xMinVal != null && bMinVal != null && sys.ObjUtil.compareLT(xMinVal, bMinVal))) {
      this.errCovariant(x, sys.Str.plus(sys.Str.plus("maxVal '", sys.ObjUtil.coerce(xMaxVal, sys.Obj.type$.toNullable())), "' conflicts"), sys.Str.plus(sys.Str.plus("maxVal '", sys.ObjUtil.coerce(bMaxVal, sys.Obj.type$.toNullable())), "'"));
    }
    ;
    let xQuantity = x.cmeta().get("quantity");
    let bQuantity = b.cmeta().get("quantity");
    if ((sys.ObjUtil.compareNE(xQuantity, bQuantity) && bQuantity != null)) {
      this.errCovariant(x, sys.Str.plus(sys.Str.plus("quantity '", xQuantity), "' conflicts"), sys.Str.plus(sys.Str.plus("quantity '", bQuantity), "'"));
    }
    ;
    let xUnit = x.cmeta().get("unit");
    let bUnit = b.cmeta().get("unit");
    if ((sys.ObjUtil.compareNE(xUnit, bUnit) && bUnit != null)) {
      this.errCovariant(x, sys.Str.plus(sys.Str.plus("unit '", xUnit), "' conflicts"), sys.Str.plus(sys.Str.plus("unit '", bUnit), "'"));
    }
    ;
    return;
  }

  errCovariant(x,msg1,msg2) {
    if ((x.isSlot() && x.base().flavor().isGlobal())) {
      this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Slot '", x.name()), "' "), msg1), " global slot '"), x.base().qname()), "' "), msg2), x.loc());
    }
    else {
      if (x.isSlot()) {
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Slot '", x.name()), "' "), msg1), " inherited slot '"), x.base().qname()), "' "), msg2), x.loc());
      }
      else {
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Type '", x.name()), "' "), msg1), " inherited type '"), x.base().qname()), "' "), msg2), x.loc());
      }
      ;
    }
    ;
    return;
  }

  checkSlots(x) {
    const this$ = this;
    if (x.slots() == null) {
      return;
    }
    ;
    x.slots().each((slot) => {
      this$.checkSlot(slot);
      return;
    });
    return;
  }

  checkSlot(x) {
    this.checkSpec(x);
    this.checkSlotType(x);
    this.checkSlotMeta(x);
    this.checkSlotVal(x);
    return;
  }

  checkSlotType(slot) {
    if (slot.parent().isEnum()) {
      return;
    }
    ;
    if ((slot.parent().isList() && !xetoEnv.XetoUtil.isAutoName(slot.name()))) {
      this.err("List specs cannot define slots", slot.loc());
    }
    ;
    if ((slot.parent().isChoice() && !slot.ctype().isMarker())) {
      this.err(sys.Str.plus(sys.Str.plus("Choice slot '", slot.name()), "' must be marker type"), slot.loc());
    }
    ;
    return;
  }

  checkSlotMeta(slot) {
    if (slot.meta() == null) {
      return;
    }
    ;
    let hasVal = slot.meta().get("val") != null;
    if ((hasVal && slot.base() != null && slot.base().cmeta().has("fixed"))) {
      this.err(sys.Str.plus(sys.Str.plus("Slot '", slot.name()), "' is fixed and cannot declare new default value"), slot.loc());
    }
    ;
    return;
  }

  checkSlotVal(slot) {
    if (this.isObj(slot.ctype())) {
      if ((slot.val() != null && slot.slots() != null)) {
        this.err("Cannot have both scalar value and slots", slot.loc());
      }
      ;
    }
    else {
      if (slot.ctype().isScalar()) {
        if (slot.slots() != null) {
          this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Scalar slot '", slot.name()), "' of type '"), slot.ctype()), "' cannot have slots"), slot.loc());
        }
        ;
      }
      else {
        if (slot.val() != null) {
          this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Non-scalar slot '", slot.name()), "' of type '"), slot.ctype()), "' cannot have scalar value"), slot.loc());
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  checkSpecMeta(x) {
    const this$ = this;
    if (x.meta() == null) {
      return;
    }
    ;
    x.meta().each((v,n) => {
      if (xetoEnv.XetoUtil.isReservedSpecMetaName(n)) {
        this$.err(sys.Str.plus(sys.Str.plus("Reserved spec meta tag '", n), "'"), x.loc());
      }
      ;
      return;
    });
    this.checkDict(sys.ObjUtil.coerce(x.meta(), ADict.type$), null);
    return;
  }

  checkType(x) {
    return;
  }

  checkGlobal(x) {
    this.cns().global(x.name(), x.loc());
    return;
  }

  checkMetaSpec(x) {
    this.cns().metaSpec(x.name(), x.loc());
    if (xetoEnv.XetoUtil.isReservedMetaName(x.name())) {
      this.err(sys.Str.plus(sys.Str.plus("Reserved meta tag '", x.name()), "'"), x.loc());
    }
    ;
    return;
  }

  checkSpecQuery(x) {
    return;
  }

  checkInstance(lib,name,x) {
    if (xetoEnv.XetoUtil.isReservedInstanceName(name)) {
      this.err(sys.Str.plus(sys.Str.plus("Instance name '", name), "' is reserved"), x.loc());
    }
    ;
    if (sys.Str.startsWith(name, "xmeta-")) {
      this.checkXMeta(lib, name, sys.ObjUtil.coerce(x, ADict.type$));
    }
    ;
    this.checkDict(sys.ObjUtil.coerce(x, ADict.type$), null);
    return;
  }

  checkXMeta(lib,name,x) {
    const this$ = this;
    lib.flags(sys.Int.or(lib.flags(), xetoEnv.MLibFlags.hasXMeta()));
    let dash = sys.Str.index(name, "-", 6);
    if (dash == null) {
      this.err(sys.Str.plus("Invalid xmeta id: ", name), x.loc());
    }
    ;
    let libName = sys.Str.getRange(name, sys.Range.make(6, sys.ObjUtil.coerce(dash, sys.Int.type$), true));
    let specName = sys.Str.getRange(name, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(dash, sys.Int.type$), 1), -1));
    if (sys.ObjUtil.equals(libName, lib.name())) {
      this.err("Cannot specify xmeta for spec in lib itself", x.loc());
      return;
    }
    ;
    let depend = this.compiler().depends().libs().get(libName);
    if (depend == null) {
      this.err(sys.Str.plus("Unknown lib for xmeta: ", libName), x.loc());
      return;
    }
    ;
    let spec = depend.spec(specName, false);
    if ((spec == null && sys.Str.endsWith(specName, "-enum"))) {
      (spec = depend.spec(sys.Str.getRange(specName, sys.Range.make(0, -6)), false));
      if ((spec != null && !spec.isEnum())) {
        return this.err(sys.Str.plus(sys.Str.plus("Enum xmeta for ", name), " for non-enum type"), x.loc());
      }
      ;
      return;
    }
    ;
    x.each((v,n) => {
      if (sys.ObjUtil.equals(n, "id")) {
        return;
      }
      ;
      let metaSpec = this$.cns().metaSpec(n, v.loc());
      if (metaSpec == null) {
        if (xetoEnv.XetoUtil.isReservedSpecMetaName(n)) {
          this$.err(sys.Str.plus(sys.Str.plus("Reserved xmeta tag '", n), "'"), v.loc());
        }
        else {
          this$.err(sys.Str.plus(sys.Str.plus("Undefined xmeta tag '", n), "'"), v.loc());
        }
        ;
      }
      ;
      return;
    });
    if (spec == null) {
      if (sys.Str.contains(specName, ".")) {
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot use dotted spec names for xmeta: ", libName), "::"), specName), x.loc());
      }
      else {
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unknown spec for xmeta: ", libName), "::"), specName), x.loc());
      }
      ;
      return;
    }
    ;
    return;
  }

  checkData(x,slot) {
    let $_u25 = x.nodeType();
    if (sys.ObjUtil.equals($_u25, ANodeType.dict())) {
      this.checkDict(sys.ObjUtil.coerce(x, ADict.type$), slot);
    }
    else if (sys.ObjUtil.equals($_u25, ANodeType.scalar())) {
      this.checkScalar(sys.ObjUtil.coerce(x, AScalar.type$), slot);
    }
    else if (sys.ObjUtil.equals($_u25, ANodeType.specRef())) {
      this.checkSpecRef(sys.ObjUtil.coerce(x, ASpecRef.type$));
    }
    else if (sys.ObjUtil.equals($_u25, ANodeType.dataRef())) {
      this.checkDataRef(sys.ObjUtil.coerce(x, ADataRef.type$));
    }
    ;
    return;
  }

  checkScalar(x,slot) {
    const this$ = this;
    let spec = ((this$) => { let $_u26 = slot; if ($_u26 != null) return $_u26; return x.ctype(); })(this);
    this.#checkVal.check(sys.ObjUtil.coerce(spec, xetoEnv.CSpec.type$), x.asm(), (msg) => {
      this$.errSlot(slot, msg, x.loc());
      return;
    });
    return;
  }

  checkDict(x,slot) {
    const this$ = this;
    let spec = x.ctype();
    if (spec.isList()) {
      this.checkList(x, slot);
    }
    ;
    x.each((v,n) => {
      this$.checkData(v, spec.cslot(n, false));
      if (!x.isMeta()) {
        this$.checkDictSlotAgainstGlobals(n, v);
      }
      ;
      return;
    });
    spec.cslots((specSlot) => {
      this$.checkDictSlot(x, specSlot);
      return;
    });
    return;
  }

  checkList(x,slot) {
    const this$ = this;
    let spec = ((this$) => { let $_u27 = slot; if ($_u27 != null) return $_u27; return x.ctype(); })(this);
    let list = sys.ObjUtil.as(x.asm(), sys.Type.find("sys::List"));
    if (list == null) {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("WARN: need to checkList on ", x.asm()), "`.typeof"));
      return;
    }
    ;
    this.#checkVal.check(sys.ObjUtil.coerce(spec, xetoEnv.CSpec.type$), sys.ObjUtil.coerce(list, sys.Obj.type$), (msg) => {
      this$.errSlot(slot, msg, x.loc());
      return;
    });
    let of$ = spec.cof();
    if (sys.ObjUtil.equals(spec.name(), "ofs")) {
      (of$ = null);
    }
    ;
    if (spec.isMultiRef()) {
      (of$ = null);
    }
    ;
    while ((of$ != null && xetoEnv.XetoUtil.isAutoName(of$.name()))) {
      (of$ = ((this$) => { let $_u28 = of$; if ($_u28 == null) return null; return of$.cbase(); })(this));
    }
    ;
    let named = false;
    x.each((v,n) => {
      if (!xetoEnv.XetoUtil.isAutoName(n)) {
        (named = true);
      }
      ;
      if ((of$ != null && !v.ctype().cisa(sys.ObjUtil.coerce(of$, xetoEnv.CSpec.type$)))) {
        this$.errSlot(slot, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("List item type is '", of$), "', item type is '"), v.ctype()), "'"), v.loc());
      }
      ;
      return;
    });
    if (named) {
      this.errSlot(slot, "List cannot contain named items", x.loc());
    }
    ;
    return;
  }

  checkDictSlot(x,slot) {
    if (slot.ctype().isChoice()) {
      return this.checkDictChoice(x, slot);
    }
    ;
    let val = x.get(slot.name());
    if (val == null) {
      return;
    }
    ;
    if (!x.isMeta()) {
      let valType = val.ctype();
      if (!this.valTypeFits(slot.ctype(), valType, val.asm())) {
        this.errSlot(slot, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Slot type is '", slot.ctype()), "', value type is '"), valType), "'"), x.loc());
      }
      ;
      if ((slot.isRef() || slot.isMultiRef())) {
        this.checkRefTarget(slot, sys.ObjUtil.coerce(val, AData.type$));
      }
      ;
    }
    ;
    return;
  }

  checkDictSlotAgainstGlobals(name,val) {
    const this$ = this;
    if (this.isSys()) {
      return;
    }
    ;
    if (xetoEnv.XetoUtil.isAutoName(name)) {
      return;
    }
    ;
    let global = this.cns().global(name, val.loc());
    if (global == null) {
      return;
    }
    ;
    let valType = val.ctype();
    if (!this.valTypeFits(global.ctype(), valType, val)) {
      this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Slot '", name), "': Global slot type is '"), global.ctype()), "', value type is '"), val.ctype()), "'"), val.loc());
      return;
    }
    ;
    this.#checkVal.check(sys.ObjUtil.coerce(global, xetoEnv.CSpec.type$), val.asm(), (msg) => {
      this$.errSlot(global, msg, val.loc());
      return;
    });
    return;
  }

  valTypeFits(type,valType,val) {
    const this$ = this;
    if (valType.cisa(type)) {
      return true;
    }
    ;
    if (type.isMultiRef()) {
      if (sys.ObjUtil.is(val, xeto.Ref.type$)) {
        return true;
      }
      ;
      if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
        return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).all((x) => {
          return sys.ObjUtil.is(x, xeto.Ref.type$);
        });
      }
      ;
    }
    ;
    return false;
  }

  checkRefTarget(slot,val) {
    const this$ = this;
    let of$ = slot.cof();
    if (of$ == null) {
      return true;
    }
    ;
    if (sys.ObjUtil.is(val, ADataRef.type$)) {
      let instance = sys.ObjUtil.coerce(val, ADataRef.type$).deref();
      if (!instance.ctype().cisa(sys.ObjUtil.coerce(of$, xetoEnv.CSpec.type$))) {
        this.errSlot(slot, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Ref target must be '", of$.qname()), "', target is '"), instance.ctype()), "'"), val.loc());
      }
      ;
      return;
    }
    ;
    if (sys.ObjUtil.is(val, ADict.type$)) {
      sys.ObjUtil.coerce(val, ADict.type$).each((item) => {
        this$.checkRefTarget(slot, item);
        return;
      });
      return;
    }
    ;
    return;
  }

  checkSpecRef(x) {
    return;
  }

  checkDataRef(x) {
    return;
  }

  checkDictChoice(x,slot) {
    const this$ = this;
    xetoEnv.MChoice.check(this.cns(), slot, sys.ObjUtil.coerce(x.asm(), xeto.Dict.type$), (msg) => {
      this$.errSlot(slot, msg, x.loc());
      return;
    });
    return;
  }

  static make() {
    const $self = new CheckErrors();
    CheckErrors.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    ;
    return;
  }

}

class InferData extends Step {
  constructor() {
    super();
    const this$ = this;
    this.#refDefVal = sys.ObjUtil.coerce(haystack.Ref.fromStr("x"), xeto.Ref.type$);
    return;
  }

  typeof() { return InferData.type$; }

  #refDefVal = null;

  refDefVal() { return this.#refDefVal; }

  __refDefVal(it) { if (it === undefined) return this.#refDefVal; else this.#refDefVal = it; }

  #curSpec = null;

  // private field reflection only
  __curSpec(it) { if (it === undefined) return this.#curSpec; else this.#curSpec = it; }

  infer(node) {
    if (node.nodeType() === ANodeType.spec()) {
      this.#curSpec = sys.ObjUtil.coerce(node, ASpec.type$.toNullable());
    }
    ;
    if (node.nodeType() === ANodeType.dict()) {
      this.inferDict(sys.ObjUtil.coerce(node, ADict.type$));
    }
    ;
    if (node.nodeType() === ANodeType.instance()) {
      this.inferInstance(sys.ObjUtil.coerce(node, AInstance.type$));
    }
    ;
    if (node.nodeType() === ANodeType.scalar()) {
      this.inferScalar(sys.ObjUtil.coerce(node, AScalar.type$));
    }
    ;
    if (node.nodeType() === ANodeType.specRef()) {
      this.inferRef(sys.ObjUtil.coerce(node, ARef.type$));
    }
    ;
    if (node.nodeType() === ANodeType.dataRef()) {
      this.inferRef(sys.ObjUtil.coerce(node, ARef.type$));
    }
    ;
    return;
  }

  inferInstance(dict) {
    this.#curSpec = null;
    this.inferId(dict);
    this.inferDict(dict);
    return;
  }

  inferDict(dict) {
    if (dict.isMeta()) {
      this.inferMetaSlots(dict);
    }
    else {
      this.inferDictSlots(dict);
    }
    ;
    return;
  }

  inferScalar(scalar) {
    if ((scalar.typeRef() == null || this.isObj(scalar.ctype()))) {
      scalar.typeRef(this.sys().str());
    }
    ;
    return;
  }

  inferRef(ref) {
    if (ref.typeRef() == null) {
      ref.typeRef(this.sys().ref());
    }
    ;
    return;
  }

  inferId(dict) {
    let id = sys.ObjUtil.toStr(dict.name());
    if (this.isLib()) {
      (id = sys.Str.plus(sys.Str.plus(this.lib().name(), "::"), id));
    }
    ;
    let loc = dict.loc();
    let ref = this.compiler().makeRef(id, null);
    if (dict.has("id")) {
      this.err("Named dict cannot have explicit id tag", loc);
    }
    ;
    dict.set("id", AScalar.make(loc, this.sys().ref(), id, ref));
    return;
  }

  inferMetaSlots(dict) {
    const this$ = this;
    dict.each((v,n) => {
      this$.inferMetaSlot(dict, n, v);
      return;
    });
    return;
  }

  inferMetaSlot(dict,name,val) {
    let metaSpec = this.cns().metaSpec(name, val.loc());
    if (metaSpec == null) {
      if ((dict.isSpecMeta() && xetoEnv.XetoUtil.isReservedSpecMetaName(name))) {
        return;
      }
      ;
      if ((dict.isLibMeta() && xetoEnv.XetoUtil.isReservedLibMetaName(name))) {
        return;
      }
      ;
      this.err(sys.Str.plus(sys.Str.plus("Undefined meta tag '", name), "'"), val.loc());
      return;
    }
    ;
    if (val.typeRef() != null) {
      return;
    }
    ;
    let type = metaSpec.ctype();
    if (type.isSelf()) {
      let parentSpec = sys.ObjUtil.as(dict.metaParent(), ASpec.type$);
      if (parentSpec == null) {
        this.err(sys.Str.plus(sys.Str.plus("Unexpected self meta '", name), "' outside of spec"), dict.loc());
      }
      else {
        (type = parentSpec.ctype());
      }
      ;
    }
    ;
    val.typeRef(this.inferDictSlotType(val.loc(), sys.ObjUtil.coerce(metaSpec, xetoEnv.CSpec.type$)));
    return;
  }

  inferDictSlots(dict) {
    const this$ = this;
    if (dict.typeRef() == null) {
      dict.typeRef(this.sys().dict());
    }
    ;
    let spec = dict.ctype();
    spec.cslots((slot) => {
      this$.inferDictSlot(dict, slot);
      return;
    });
    let of$ = ((this$) => { let $_u29=dict.typeRef(); return ($_u29==null) ? null : $_u29.of(); })(this);
    if (of$ != null) {
      dict.each((item) => {
        if (item.typeRef() == null) {
          item.typeRef(ASpecRef.makeResolved(item.loc(), sys.ObjUtil.coerce(of$, xetoEnv.CSpec.type$)));
        }
        ;
        return;
      });
    }
    ;
    return;
  }

  inferDictSlot(dict,slot) {
    let cur = dict.get(slot.name());
    if ((cur == null && slot.isMaybe())) {
      return;
    }
    ;
    if (cur != null) {
      if (cur.typeRef() == null) {
        cur.typeRef(this.inferDictSlotType(cur.loc(), slot));
      }
      ;
      return;
    }
    ;
    if (slot.cparent().isInterface()) {
      return;
    }
    ;
    let cspec = slot;
    if (slot.isAst()) {
      let val = sys.ObjUtil.as(sys.ObjUtil.coerce(slot, ASpec.type$).metaGet("val"), AData.type$);
      if (val != null) {
        dict.set(slot.name(), sys.ObjUtil.coerce(val, AData.type$));
        return;
      }
      ;
      (cspec = slot.ctype());
    }
    ;
    let val = cspec.cmeta().get("val");
    if (val == null) {
      return;
    }
    ;
    if (sys.ObjUtil.equals(val, this.#refDefVal)) {
      return;
    }
    ;
    let type = this.inferDictSlotType(dict.loc(), slot);
    dict.set(slot.name(), AScalar.make(dict.loc(), type, sys.ObjUtil.toStr(val), val));
    return;
  }

  inferDictSlotType(loc,slot) {
    let type = slot.ctype();
    if ((type.isSelf() && this.#curSpec != null)) {
      (type = this.#curSpec.ctype());
    }
    ;
    let ref = ASpecRef.makeResolved(loc, type);
    ref.of(slot.cof());
    return ref;
  }

  static make() {
    const $self = new InferData();
    InferData.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    ;
    return;
  }

}

class InferMeta extends InferData {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InferMeta.type$; }

  run() {
    const this$ = this;
    this.ast().walkMetaTopDown((node) => {
      this$.infer(node);
      return;
    });
    return;
  }

  static make() {
    const $self = new InferMeta();
    InferMeta.make$($self);
    return $self;
  }

  static make$($self) {
    InferData.make$($self);
    return;
  }

}

class InferInstances extends InferData {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InferInstances.type$; }

  run() {
    const this$ = this;
    this.ast().walkInstancesTopDown((node) => {
      this$.infer(node);
      return;
    });
    return;
  }

  static make() {
    const $self = new InferInstances();
    InferInstances.make$($self);
    return $self;
  }

  static make$($self) {
    InferData.make$($self);
    return;
  }

}

class Parse extends Step {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Parse.type$; }

  run() {
    let input = this.compiler().input();
    if (input == null) {
      throw this.err("Compiler input not configured", util.FileLoc.inputs());
    }
    ;
    if (!input.exists()) {
      throw this.err(sys.Str.plus("Input file not found: ", input), util.FileLoc.inputs());
    }
    ;
    if (this.isLib()) {
      this.parseLib(sys.ObjUtil.coerce(input, sys.File.type$));
    }
    else {
      this.parseData(sys.ObjUtil.coerce(input, sys.File.type$));
    }
    ;
    return;
  }

  parseLib(input) {
    let lib = ALib.make(sys.ObjUtil.coerce(this.compiler(), XetoCompiler.type$), sys.ObjUtil.coerce(util.FileLoc.makeFile(input), util.FileLoc.type$), sys.ObjUtil.coerce(this.compiler().libName(), sys.Str.type$));
    this.parseDir(input, lib);
    this.bombIfErr();
    let pragma = this.validateLibPragma(lib);
    this.bombIfErr();
    this.compiler().ast(lib);
    this.compiler().lib(lib);
    this.compiler().pragma(pragma);
    return;
  }

  parseData(input) {
    let doc = ADataDoc.make(sys.ObjUtil.coerce(this.compiler(), XetoCompiler.type$), sys.ObjUtil.coerce(util.FileLoc.makeFile(input), util.FileLoc.type$));
    this.parseFile(input, doc);
    this.bombIfErr();
    let pragma = ADict.make(doc.loc(), this.sys().lib());
    this.compiler().ast(doc);
    this.compiler().data(doc);
    this.compiler().pragma(pragma);
    return;
  }

  validateLibPragma(lib) {
    let pragma = lib.tops().remove("pragma");
    if (pragma == null) {
      this.err(sys.Str.plus(sys.Str.plus("Lib '", this.compiler().libName()), "' missing  pragma"), lib.loc());
      return null;
    }
    ;
    if (this.isLib()) {
      if ((pragma.typeRef() == null || sys.ObjUtil.compareNE(pragma.typeRef().name().name(), "Lib"))) {
        this.err("Pragma must have 'Lib' type", pragma.loc());
      }
      ;
    }
    ;
    if (pragma.meta() == null) {
      this.err("Pragma missing meta data", pragma.loc());
    }
    ;
    if (pragma.slots() != null) {
      this.err("Pragma cannot have slots", pragma.loc());
    }
    ;
    if (pragma.val() != null) {
      this.err("Pragma cannot scalar value", pragma.loc());
    }
    ;
    pragma.meta().typeRef(this.sys().lib());
    return pragma.meta();
  }

  parseDir(input,lib) {
    const this$ = this;
    let hasMarkdown = false;
    let files = null;
    if (sys.ObjUtil.equals(input.ext(), "xetolib")) {
      let zip = sys.Zip.read(input.in());
      let list = sys.List.make(sys.Uri.type$);
      try {
        zip.readEach((f) => {
          if (sys.ObjUtil.equals(f.ext(), "xeto")) {
            this$.parseFile(f, lib);
          }
          else {
            if (sys.ObjUtil.compareNE(f.name(), "meta.props")) {
              list.add(f.uri());
            }
            ;
          }
          ;
          if (sys.ObjUtil.equals(f.ext(), "md")) {
            (hasMarkdown = true);
          }
          ;
          return;
        });
      }
      finally {
        zip.close();
      }
      ;
      (files = xetoEnv.ZipLibFiles.make(input, list));
    }
    else {
      if (input.isDir()) {
        this.dirList(input).each((sub) => {
          if (sys.ObjUtil.equals(sub.ext(), "xeto")) {
            this$.parseFile(sub, lib);
          }
          ;
          if (sys.ObjUtil.equals(sub.ext(), "md")) {
            (hasMarkdown = true);
          }
          ;
          return;
        });
        (files = xetoEnv.DirLibFiles.make(input));
      }
      else {
        this.parseFile(input, lib);
        (files = xetoEnv.EmptyLibFiles.val());
      }
      ;
    }
    ;
    lib.files(files);
    if (hasMarkdown) {
      lib.flags(sys.Int.or(lib.flags(), xetoEnv.MLibFlags.hasMarkdown()));
    }
    ;
    return;
  }

  parseFile(input,doc) {
    let loc = util.FileLoc.makeFile(input);
    try {
      Parser.make(this, sys.ObjUtil.coerce(loc, util.FileLoc.type$), input.readAllStr(), doc).parseFile();
    }
    catch ($_u30) {
      $_u30 = sys.Err.make($_u30);
      if ($_u30 instanceof util.FileLocErr) {
        let e = $_u30;
        ;
        this.err(e.msg(), e.loc());
        return null;
      }
      else if ($_u30 instanceof sys.Err) {
        let e = $_u30;
        ;
        this.err(e.toStr(), sys.ObjUtil.coerce(loc, util.FileLoc.type$), e);
        return null;
      }
      else {
        throw $_u30;
      }
    }
    ;
    return;
  }

  static make() {
    const $self = new Parse();
    Parse.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    return;
  }

}

class ProcessPragma extends Step {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ProcessPragma.type$; }

  run() {
    if (this.isLib()) {
      this.lib().meta(this.compiler().pragma());
      this.lib().version(this.toVersion());
      this.pragma().metaParent(this.lib());
      this.compiler().depends().list(this.pragmaToDepends());
    }
    else {
      this.compiler().depends().list(this.nsToDepends());
    }
    ;
    return;
  }

  toVersion() {
    let obj = this.pragma().get("version");
    if (obj == null) {
      this.err("Missing required version lib meta", this.pragma().loc());
      return sys.Version.defVal();
    }
    ;
    let scalar = sys.ObjUtil.as(obj, AScalar.type$);
    if (scalar == null) {
      this.err("Version must be scalar", obj.loc());
      return sys.Version.defVal();
    }
    ;
    let verStr = scalar.str();
    let ver = sys.Version.fromStr(verStr, false);
    if (ver == null) {
      this.err(sys.Str.plus("Invalid version: ", verStr), obj.loc());
      return sys.Version.defVal();
    }
    ;
    if (sys.ObjUtil.compareNE(ver.segments().size(), 3)) {
      this.err(sys.Str.plus("Xeto version must be exactly three segments: ", ver), obj.loc());
      return sys.ObjUtil.coerce(ver, sys.Version.type$);
    }
    ;
    scalar.asmRef(ver);
    return sys.ObjUtil.coerce(ver, sys.Version.type$);
  }

  nsToDepends() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.ns().libs().map((lib) => {
      return xetoEnv.MLibDepend.makeFields(lib.name(), xeto.LibDependVersions.wildcard(), util.FileLoc.synthetic());
    }, xetoEnv.MLibDepend.type$), sys.Type.find("xetoEnv::MLibDepend[]"));
  }

  pragmaToDepends() {
    if (this.isSys()) {
      return sys.ObjUtil.coerce(xetoEnv.MLibDepend.type$.emptyList(), sys.Type.find("xetoEnv::MLibDepend[]"));
    }
    ;
    let list = this.toDependsList(this.pragma().get("depends"));
    if ((list != null && !list.isEmpty())) {
      return sys.ObjUtil.coerce(list, sys.Type.find("xetoEnv::MLibDepend[]"));
    }
    ;
    if (this.isLib()) {
      this.err("Must specify 'sys' in depends", this.pragma().loc());
    }
    ;
    return sys.List.make(xetoEnv.MLibDepend.type$, [xetoEnv.MLibDepend.makeFields("sys", xeto.LibDependVersions.wildcard(), util.FileLoc.synthetic())]);
  }

  toDependsList(val) {
    const this$ = this;
    if (val == null) {
      return null;
    }
    ;
    let alist = sys.ObjUtil.as(val, ADict.type$);
    if (alist == null) {
      this.err("Depends must be a list", val.loc());
      return null;
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::MLibDepend"));
    acc.ordered(true);
    alist.each((obj) => {
      this$.toDepend(acc, obj);
      return;
    });
    let depends = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc.vals()), sys.Type.find("xetoEnv::MLibDepend[]"));
    alist.asmRef(depends);
    return depends;
  }

  toDepend(acc,obj) {
    let loc = obj.loc();
    let dict = sys.ObjUtil.as(obj, ADict.type$);
    if (dict == null) {
      return this.err("Depend must be dict", loc);
    }
    ;
    let libName = dict.getStr("lib");
    if (libName == null) {
      return this.err("Depend missing lib name", loc);
    }
    ;
    let versions = xeto.LibDependVersions.wildcard();
    let versionsObj = dict.get("versions");
    if (versionsObj != null) {
      let versionsStr = ((this$) => { let $_u31=sys.ObjUtil.as(versionsObj, AScalar.type$); return ($_u31==null) ? null : $_u31.str(); })(this);
      if (versionsStr == null) {
        return this.err("Versions must be a scalar", versionsObj.loc());
      }
      ;
      (versions = xeto.LibDependVersions.fromStr(sys.ObjUtil.coerce(versionsStr, sys.Str.type$), false));
      if (versions == null) {
        return this.err(sys.Str.plus("Invalid versions syntax: ", versionsStr), versionsObj.loc());
      }
      ;
    }
    ;
    if (acc.get(sys.ObjUtil.coerce(libName, sys.Str.type$)) != null) {
      return this.err(sys.Str.plus(sys.Str.plus("Duplicate depend '", libName), "'"), loc);
    }
    ;
    (libName = this.names().toName(this.names().add(sys.ObjUtil.coerce(libName, sys.Str.type$))));
    acc.set(sys.ObjUtil.coerce(libName, sys.Str.type$), xetoEnv.MLibDepend.makeFields(sys.ObjUtil.coerce(libName, sys.Str.type$), sys.ObjUtil.coerce(versions, xeto.LibDependVersions.type$), loc));
    return;
  }

  static make() {
    const $self = new ProcessPragma();
    ProcessPragma.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    return;
  }

}

class Resolve extends Step {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Resolve.type$; }

  run() {
    const this$ = this;
    this.resolveDepends();
    this.bombIfErr();
    this.sys().each((x) => {
      this$.resolveRef(x);
      return;
    });
    this.ast().walkBottomUp((x) => {
      this$.resolveNode(x);
      return;
    });
    this.bombIfErr();
    return;
  }

  resolveDepends() {
    const this$ = this;
    this.depends().libs(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::XetoLib")));
    if (this.isSys()) {
      return;
    }
    ;
    this.depends().list().each((depend) => {
      this$.resolveDepend(depend);
      return;
    });
    return;
  }

  resolveDepend(d) {
    let libStatus = this.ns().libStatus(d.name(), false);
    if (libStatus == null) {
      this.err(sys.Str.plus(sys.Str.plus("Depend lib '", d.name()), "' not in namespace"), d.loc());
      return null;
    }
    ;
    if (libStatus.isErr()) {
      this.err(sys.Str.plus(sys.Str.plus("Depend lib '", d.name()), "' could not be compiled"), d.loc());
      return null;
    }
    ;
    let lib = this.ns().lib(d.name());
    if (!d.versions().contains(lib.version())) {
      this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Depend lib '", d.name()), "' version '"), lib.version()), "' is incompatible with '"), d.versions()), "'"), d.loc());
      return null;
    }
    ;
    this.depends().libs().add(lib.name(), sys.ObjUtil.coerce(lib, xetoEnv.XetoLib.type$));
    return sys.ObjUtil.coerce(lib, xetoEnv.XetoLib.type$.toNullable());
  }

  resolveNode(node) {
    if (node.nodeType() === ANodeType.specRef()) {
      return this.resolveRef(sys.ObjUtil.coerce(node, ARef.type$));
    }
    ;
    if (node.nodeType() === ANodeType.dataRef()) {
      return this.resolveRef(sys.ObjUtil.coerce(node, ARef.type$));
    }
    ;
    if (node.nodeType() === ANodeType.spec()) {
      return this.resolveSpec(sys.ObjUtil.coerce(node, ASpec.type$));
    }
    ;
    return;
  }

  resolveSpec(spec) {
    let val = spec.val();
    if ((val != null && !val.isAsm())) {
      if (val.typeRef() == null) {
        let ref = null;
        if (spec.isTop()) {
          (ref = ASpecRef.make(val.loc(), ASimpleName.make(this.lib().name(), spec.name())));
          ref.resolve(spec);
        }
        else {
          (ref = spec.typeRef());
        }
        ;
        val.typeRef(ref);
      }
      ;
      spec.metaSet("val", sys.ObjUtil.coerce(val, AData.type$));
    }
    ;
    return;
  }

  resolveRef(ref) {
    const this$ = this;
    if (ref.isResolved()) {
      return;
    }
    ;
    if (sys.ObjUtil.compareGT(ref.name().size(), 1)) {
      throw sys.Err.make(sys.Str.plus("TODO: path name: ", ref));
    }
    ;
    let n = ref.name();
    if (n.isQualified()) {
      return this.resolveQualified(ref);
    }
    ;
    let x = this.resolveInAst(ref, n.name());
    if (x != null) {
      ref.resolve(sys.ObjUtil.coerce(x, xetoEnv.CNode.type$));
      return;
    }
    ;
    let matches = sys.List.make(sys.Obj.type$);
    this.depends().libs().each((d) => {
      matches.addNotNull(this$.resolveInDepend(ref, n.name(), d));
      return;
    });
    if (matches.isEmpty()) {
      if (this.compiler().externRefs()) {
        return;
      }
      ;
      this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unresolved ", ref.what()), ": "), n), ref.loc());
    }
    else {
      if (sys.ObjUtil.compareGT(matches.size(), 1)) {
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Ambiguous ", ref.what()), ": "), n), " "), matches), ref.loc());
      }
      else {
        ref.resolve(sys.ObjUtil.coerce(matches.first(), xetoEnv.CNode.type$));
      }
      ;
    }
    ;
    return;
  }

  resolveQualified(ref) {
    let n = ref.name();
    if (sys.ObjUtil.equals(n.lib(), this.compiler().libName())) {
      let x = this.resolveInAst(ref, n.name());
      if (x == null) {
        return this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.Str.capitalize(ref.what())), " '"), n), "' not found in lib"), ref.loc());
      }
      ;
      ref.resolve(sys.ObjUtil.coerce(x, xetoEnv.CNode.type$));
      return;
    }
    ;
    let depend = this.depends().libs().get(sys.ObjUtil.coerce(n.lib(), sys.Str.type$));
    if (depend == null) {
      if (this.isLib()) {
        return this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.Str.capitalize(ref.what())), " lib '"), n), "' is not included in depends"), ref.loc());
      }
      ;
      (depend = this.resolveDepend(xetoEnv.MLibDepend.makeFields(sys.ObjUtil.coerce(n.lib(), sys.Str.type$), xeto.LibDependVersions.wildcard(), ref.loc())));
      if (depend == null) {
        return;
      }
      ;
    }
    ;
    let x = this.resolveInDepend(ref, n.name(), sys.ObjUtil.coerce(depend, xetoEnv.XetoLib.type$));
    if (x == null) {
      if (this.compiler().externRefs()) {
        return;
      }
      ;
      return this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unresolved ", ref.what()), " '"), n), "' in lib"), ref.loc());
    }
    ;
    ref.resolve(sys.ObjUtil.coerce(x, xetoEnv.CNode.type$));
    return;
  }

  resolveInAst(ref,name) {
    return ((this$) => { if (ref.nodeType() === ANodeType.specRef()) return ((this$) => { let $_u33 = this$.compiler().lib(); if ($_u33 == null) return null; return this$.compiler().lib().top(name); })(this$); return this$.ast().instance(name); })(this);
  }

  resolveInDepend(ref,name,depend) {
    return ((this$) => { if (ref.nodeType() === ANodeType.specRef()) return depend.type(name, false); return this$.wrapInstance(depend.instance(name, false)); })(this);
  }

  wrapInstance(dict) {
    if (dict == null) {
      return null;
    }
    ;
    return CInstanceWrap.make(sys.ObjUtil.coerce(dict, xeto.Dict.type$), sys.ObjUtil.coerce(this.ns().specOf(dict), xetoEnv.XetoSpec.type$));
  }

  static make() {
    const $self = new Resolve();
    Resolve.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    return;
  }

}

class Reify extends Step {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Reify.type$; }

  reify(node) {
    let $_u35 = node.nodeType();
    if (sys.ObjUtil.equals($_u35, ANodeType.spec())) {
      this.reifySpec(sys.ObjUtil.coerce(node, ASpec.type$));
    }
    else if (sys.ObjUtil.equals($_u35, ANodeType.dict())) {
      this.reifyDict(sys.ObjUtil.coerce(node, ADict.type$));
    }
    else if (sys.ObjUtil.equals($_u35, ANodeType.instance())) {
      this.reifyDict(sys.ObjUtil.coerce(node, ADict.type$));
    }
    else if (sys.ObjUtil.equals($_u35, ANodeType.scalar())) {
      this.reifyScalar(sys.ObjUtil.coerce(node, AScalar.type$));
    }
    else if (sys.ObjUtil.equals($_u35, ANodeType.dataRef())) {
      this.reifyDataRef(sys.ObjUtil.coerce(node, ADataRef.type$));
    }
    else if (sys.ObjUtil.equals($_u35, ANodeType.specRef())) {
      this.reifySpecRef(sys.ObjUtil.coerce(node, ASpecRef.type$));
    }
    else if (sys.ObjUtil.equals($_u35, ANodeType.lib())) {
      return;
    }
    else {
      throw sys.Err.make(node.nodeType().name());
    }
    ;
    return;
  }

  reifySpec(x) {
    if (x.meta() != null) {
      x.metaOwnRef(sys.ObjUtil.coerce(x.meta().asm(), xeto.Dict.type$.toNullable()));
    }
    else {
      x.metaOwnRef(xetoEnv.MNameDict.empty());
    }
    ;
    return;
  }

  reifyDict(x) {
    if (x.isAsm()) {
      return x.asm();
    }
    ;
    let type = x.ctype();
    let isList = type.isList();
    let asm = null;
    if (isList) {
      (asm = this.reifyRawList(x, type));
    }
    else {
      (asm = this.reifyRawDict(x, type));
      let binding = type.binding();
      let fantom = null;
      let err = null;
      try {
        (fantom = binding.decodeDict(sys.ObjUtil.coerce(asm, xeto.Dict.type$)));
      }
      catch ($_u36) {
        $_u36 = sys.Err.make($_u36);
        if ($_u36 instanceof sys.Err) {
          let e = $_u36;
          ;
          (err = e);
        }
        else {
          throw $_u36;
        }
      }
      ;
      if (fantom != null) {
        (asm = fantom);
      }
      else {
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot instantiate '", type.qname()), "' dict as Fantom class '"), binding.type()), "'"), x.loc(), err);
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(((this$) => { let $_u37 = asm; x.asmRef($_u37); return $_u37; })(this), sys.Obj.type$);
  }

  reifyRawDict(x,type) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.ordered(true);
    x.each((obj,name) => {
      acc.set(name, this$.reifyDictVal(obj));
      return;
    });
    if ((!x.isMeta() && sys.ObjUtil.compareNE(type.qname(), "sys::Dict"))) {
      acc.set("spec", this.compiler().makeRef(type.qname(), null));
    }
    ;
    return sys.ObjUtil.coerce(xetoEnv.MNameDict.wrap(this.names().dictMap(acc)), xeto.Dict.type$);
  }

  reifyRawList(x,type) {
    const this$ = this;
    let of$ = ((this$) => { let $_u38 = x.listOf(); if ($_u38 != null) return $_u38; return sys.Obj.type$; })(this);
    let list = sys.List.make(sys.ObjUtil.coerce(of$, sys.Type.type$), x.size());
    x.each((obj) => {
      list.add(this$.reifyDictVal(obj));
      return;
    });
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(list), sys.Type.find("sys::List")), sys.Type.find("sys::Obj[]"));
  }

  reifyDictVal(x) {
    if (x.nodeType() === ANodeType.specRef()) {
      return sys.ObjUtil.coerce(x, ASpecRef.type$).deref().id();
    }
    else {
      return x.asm();
    }
    ;
  }

  reifyScalar(x) {
    if (x.isAsm()) {
      return x.asm();
    }
    ;
    let type = x.ctype();
    try {
      let binding = type.binding();
      let fantom = binding.decodeScalar(x.str(), false);
      if (fantom == null) {
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid '", type.qname()), "' string value: "), sys.Str.toCode(x.str())), x.loc());
        (fantom = x.str());
      }
      ;
      return ((this$) => { let $_u39 = fantom; x.asmRef($_u39); return $_u39; })(this);
    }
    catch ($_u40) {
      $_u40 = sys.Err.make($_u40);
      if ($_u40 instanceof sys.Err) {
        let e = $_u40;
        ;
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot decode scalar '", type), "': "), e), x.loc());
        return ((this$) => { let $_u41 = "error"; x.asmRef($_u41); return $_u41; })(this);
      }
      else {
        throw $_u40;
      }
    }
    ;
  }

  reifyDataRef(x) {
    return ((this$) => { let $_u42 = ((this$) => { if (x.isResolved()) return x.deref().id(); return this$.compiler().makeRef(x.toStr(), x.dis()); })(this$); x.asmRef($_u42); return $_u42; })(this);
  }

  reifySpecRef(x) {
    return x.deref().id();
  }

  static make() {
    const $self = new Reify();
    Reify.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    return;
  }

}

class ReifyMeta extends Reify {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReifyMeta.type$; }

  run() {
    const this$ = this;
    this.ast().walkMetaBottomUp((node) => {
      this$.reify(node);
      return;
    });
    return;
  }

  static make() {
    const $self = new ReifyMeta();
    ReifyMeta.make$($self);
    return $self;
  }

  static make$($self) {
    Reify.make$($self);
    return;
  }

}

class ReifyInstances extends Reify {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReifyInstances.type$; }

  run() {
    const this$ = this;
    this.ast().walkInstancesBottomUp((node) => {
      this$.reify(node);
      return;
    });
    return;
  }

  static make() {
    const $self = new ReifyInstances();
    ReifyInstances.make$($self);
    return $self;
  }

  static make$($self) {
    Reify.make$($self);
    return;
  }

}

class Assemble extends Step {
  constructor() {
    super();
    const this$ = this;
    this.#mField = xetoEnv.XetoSpec.type$.slot("m");
    return;
  }

  typeof() { return Assemble.type$; }

  static #noSpecs = undefined;

  static noSpecs() {
    if (Assemble.#noSpecs === undefined) {
      Assemble.static$init();
      if (Assemble.#noSpecs === undefined) Assemble.#noSpecs = null;
    }
    return Assemble.#noSpecs;
  }

  static #noDicts = undefined;

  static noDicts() {
    if (Assemble.#noDicts === undefined) {
      Assemble.static$init();
      if (Assemble.#noDicts === undefined) Assemble.#noDicts = null;
    }
    return Assemble.#noDicts;
  }

  #mField = null;

  mField(it) {
    if (it === undefined) {
      return this.#mField;
    }
    else {
      this.#mField = it;
      return;
    }
  }

  run() {
    this.asmLib(this.lib());
    return;
  }

  asmLib(x) {
    const this$ = this;
    let m = xetoEnv.MLib.make(x.loc(), x.nameCode(), x.name(), sys.ObjUtil.coerce(x.meta().asm(), xetoEnv.MNameDict.type$), x.flags(), sys.ObjUtil.coerce(x.version(), sys.Version.type$), sys.ObjUtil.coerce(this.compiler().depends().list(), sys.Type.find("xetoEnv::MLibDepend[]")), this.asmTops(x), this.asmInstances(x), sys.ObjUtil.coerce(x.files(), xetoEnv.MLibFiles.type$));
    sys.ObjUtil.trap(xetoEnv.XetoLib.type$.slot("m"),"setConst", sys.List.make(sys.Obj.type$.toNullable(), [x.asm(), m]));
    this.lib().tops().each((spec) => {
      this$.asmTop(spec);
      return;
    });
    return;
  }

  asmTops(x) {
    const this$ = this;
    if (x.tops().isEmpty()) {
      return Assemble.noSpecs();
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Spec"));
    x.tops().each((t,n) => {
      acc.add(n, t.asm());
      return;
    });
    return acc;
  }

  asmInstances(x) {
    const this$ = this;
    if (x.instances().isEmpty()) {
      return Assemble.noDicts();
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Dict"));
    x.instances().each((d,n) => {
      acc.add(n, sys.ObjUtil.coerce(d.asm(), xeto.Dict.type$));
      return;
    });
    return acc;
  }

  asmTop(x) {
    let m = null;
    let $_u44 = x.flavor();
    if (sys.ObjUtil.equals($_u44, xeto.SpecFlavor.type())) {
      (m = xetoEnv.MType.make(x.loc(), x.lib().asm(), x.qname(), x.nameCode(), x.name(), ((this$) => { let $_u45 = x.base(); if ($_u45 == null) return null; return x.base().asm(); })(this), x.asm(), x.cmeta(), sys.ObjUtil.coerce(x.metaOwn(), xetoEnv.MNameDict.type$), this.asmSlots(x), this.asmSlotsOwn(x), x.flags(), x.args(), x.binding()));
    }
    else if (sys.ObjUtil.equals($_u44, xeto.SpecFlavor.global())) {
      (m = xetoEnv.MGlobal.make(x.loc(), x.lib().asm(), x.qname(), x.nameCode(), x.name(), ((this$) => { let $_u46 = x.base(); if ($_u46 == null) return null; return x.base().asm(); })(this), x.ctype().asm(), x.cmeta(), sys.ObjUtil.coerce(x.metaOwn(), xetoEnv.MNameDict.type$), this.asmSlots(x), this.asmSlotsOwn(x), x.flags(), x.args()));
    }
    else if (sys.ObjUtil.equals($_u44, xeto.SpecFlavor.meta())) {
      (m = xetoEnv.MMetaSpec.make(x.loc(), x.lib().asm(), x.qname(), x.nameCode(), x.name(), ((this$) => { let $_u47 = x.base(); if ($_u47 == null) return null; return x.base().asm(); })(this), x.ctype().asm(), x.cmeta(), sys.ObjUtil.coerce(x.metaOwn(), xetoEnv.MNameDict.type$), this.asmSlots(x), this.asmSlotsOwn(x), x.flags(), x.args()));
    }
    else {
      throw sys.Err.make(x.flavor().name());
    }
    ;
    sys.ObjUtil.trap(this.#mField,"setConst", sys.List.make(sys.Obj.type$.toNullable(), [x.asm(), m]));
    this.asmChildren(x);
    return;
  }

  asmSpec(x) {
    let m = xetoEnv.MSpec.make(x.loc(), x.parent().asm(), x.nameCode(), x.name(), x.base().asm(), x.ctype().asm(), x.cmeta(), sys.ObjUtil.coerce(x.metaOwn(), xetoEnv.MNameDict.type$), this.asmSlots(x), this.asmSlotsOwn(x), x.flags(), x.args());
    sys.ObjUtil.trap(this.#mField,"setConst", sys.List.make(sys.Obj.type$.toNullable(), [x.asm(), m]));
    this.asmChildren(x);
    return;
  }

  asmChildren(x) {
    const this$ = this;
    if (x.slots() == null) {
      return;
    }
    ;
    x.slots().each((kid) => {
      this$.asmSpec(kid);
      return;
    });
    return;
  }

  asmSlotsOwn(x) {
    const this$ = this;
    if ((x.slots() == null || x.slots().isEmpty())) {
      return xetoEnv.MSlots.empty();
    }
    ;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::XetoSpec"));
    map.ordered(true);
    x.slots().each((kid,name) => {
      map.add(name, kid.asm());
      return;
    });
    let dict = this.names().dictMap(map);
    return xetoEnv.MSlots.make(dict);
  }

  asmSlots(x) {
    const this$ = this;
    if (x.cslotsRef().isEmpty()) {
      return xetoEnv.MSlots.empty();
    }
    ;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::XetoSpec"));
    map.ordered(true);
    x.cslots((s,n) => {
      map.set(n, s.asm());
      return;
    });
    let dict = this.names().dictMap(map);
    return xetoEnv.MSlots.make(dict);
  }

  static make() {
    const $self = new Assemble();
    Assemble.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    ;
    return;
  }

  static static$init() {
    Assemble.#noSpecs = sys.ObjUtil.coerce(((this$) => { let $_u48 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Spec")); if ($_u48 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Spec"))); })(this), sys.Type.find("[sys::Str:xeto::Spec]"));
    Assemble.#noDicts = sys.ObjUtil.coerce(((this$) => { let $_u49 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Dict")); if ($_u49 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Dict"))); })(this), sys.Type.find("[sys::Str:xeto::Dict]"));
    return;
  }

}

class Init extends Step {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Init.type$; }

  run() {
    if (this.compiler().ns() != null) {
      this.compiler().names(this.compiler().ns().names());
    }
    ;
    if (this.compiler().names() == null) {
      throw this.err("Compiler names not configured", util.FileLoc.inputs());
    }
    ;
    if ((this.compiler().ns() == null && this.nsRequired())) {
      throw this.err("Compiler ns not configured", util.FileLoc.inputs());
    }
    ;
    let input = this.compiler().input();
    if (input == null) {
      throw this.err("Compiler input not configured", util.FileLoc.inputs());
    }
    ;
    if (!input.exists()) {
      throw this.err(sys.Str.plus("Input file not found: ", input), util.FileLoc.inputs());
    }
    ;
    this.compiler().cns(ANamespace.make(this));
    return;
  }

  nsRequired() {
    return true;
  }

  static make() {
    const $self = new Init();
    Init.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    return;
  }

}

class InitLib extends Init {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InitLib.type$; }

  run() {
    Init.prototype.run.call(this);
    if (this.compiler().libName() == null) {
      this.compiler().libName(this.compiler().input().name());
    }
    ;
    this.compiler().isLib(true);
    this.compiler().isSys(sys.ObjUtil.equals(this.compiler().libName(), "sys"));
    this.compiler().isSysComp(sys.ObjUtil.equals(this.compiler().libName(), "sys.comp"));
    return;
  }

  static make() {
    const $self = new InitLib();
    InitLib.make$($self);
    return $self;
  }

  static make$($self) {
    Init.make$($self);
    return;
  }

}

class InitLibVersion extends InitLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InitLibVersion.type$; }

  nsRequired() {
    return false;
  }

  static make() {
    const $self = new InitLibVersion();
    InitLibVersion.make$($self);
    return $self;
  }

  static make$($self) {
    InitLib.make$($self);
    return;
  }

}

class InitData extends Init {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InitData.type$; }

  run() {
    Init.prototype.run.call(this);
    this.compiler().isLib(false);
    this.compiler().isSys(false);
    return;
  }

  static make() {
    const $self = new InitData();
    InitData.make$($self);
    return $self;
  }

  static make$($self) {
    Init.make$($self);
    return;
  }

}

class InheritMeta extends Step {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InheritMeta.type$; }

  run() {
    const this$ = this;
    if (this.isData()) {
      return;
    }
    ;
    this.lib().tops().each((spec) => {
      this$.inherit(spec);
      return;
    });
    this.bombIfErr();
    return;
  }

  inherit(spec) {
    const this$ = this;
    if (spec.cmetaRef() != null) {
      return;
    }
    ;
    spec.cmetaRef(sys.ObjUtil.coerce(this.computeMeta(spec), xetoEnv.MNameDict.type$.toNullable()));
    spec.argsRef(this.computeArgs(spec));
    if (spec.slots() != null) {
      spec.slots().each((slot) => {
        this$.inherit(slot);
        return;
      });
    }
    ;
    return;
  }

  computeMeta(spec) {
    let own = spec.metaOwn();
    let base = spec.base();
    if (spec.base() == null) {
      return own;
    }
    ;
    if (base.isAst()) {
      this.inherit(sys.ObjUtil.coerce(base, ASpec.type$));
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.ordered(true);
    let baseSize = this.computedInherited(acc, spec, sys.ObjUtil.coerce(base, xetoEnv.CSpec.type$));
    if ((sys.ObjUtil.equals(acc.size(), baseSize) && own.isEmpty() && spec.val() == null)) {
      return base.cmeta();
    }
    ;
    xetoEnv.XetoUtil.addOwnMeta(acc, own);
    if ((this.isSys() && sys.ObjUtil.equals(spec.name(), "None"))) {
      acc.set("val", haystack.Remove.val());
    }
    ;
    return sys.ObjUtil.coerce(xetoEnv.MNameDict.wrap(this.names().dictMap(acc)), xeto.Dict.type$);
  }

  computedInherited(acc,spec,base) {
    if (spec.isAnd()) {
      return this.computeUnion(acc, spec.cofs(), spec.loc());
    }
    ;
    if (spec.isOr()) {
      return this.computeIntersection(acc, spec.cofs());
    }
    ;
    return this.computeFromBase(acc, base, spec.loc());
  }

  computeFromBase(acc,base,loc) {
    const this$ = this;
    let baseSize = 0;
    base.cmeta().each((v,n) => {
      ((this$) => { let $_u50 = baseSize;baseSize = sys.Int.increment(baseSize); return $_u50; })(this$);
      if ((this$.isInherited(base, n, loc) && acc.get(n) == null)) {
        acc.set(n, v);
      }
      ;
      return;
    });
    return baseSize;
  }

  isInherited(base,name,loc) {
    if (sys.ObjUtil.equals(name, "val")) {
      return !base.isEnum();
    }
    ;
    let metaSpec = this.cns().metaSpec(name, loc);
    if (metaSpec == null) {
      return true;
    }
    ;
    if (metaSpec.cmetaHas("noInherit")) {
      return false;
    }
    ;
    return true;
  }

  computeUnion(acc,ofs,loc) {
    const this$ = this;
    if (ofs == null) {
      return 0;
    }
    ;
    let baseSize = 0;
    ofs.each((of$) => {
      if (of$.isAst()) {
        this$.inherit(sys.ObjUtil.coerce(of$, ASpec.type$));
      }
      ;
      baseSize = sys.Int.plus(baseSize, this$.computeFromBase(acc, of$, loc));
      return;
    });
    return baseSize;
  }

  computeIntersection(acc,ofs) {
    return 0;
  }

  computeArgs(spec) {
    const this$ = this;
    let of$ = spec.metaGet("of");
    if (of$ != null) {
      if (sys.ObjUtil.compareNE(of$.nodeType(), ANodeType.specRef())) {
        this.err("Invalid value for 'of' meta, not a spec", of$.loc());
      }
      else {
        return xetoEnv.MSpecArgsOf.make(sys.ObjUtil.coerce(of$.asm(), xetoEnv.XetoSpec.type$));
      }
      ;
    }
    ;
    let ofs = sys.ObjUtil.as(spec.metaGet("ofs"), ADict.type$);
    if (ofs != null) {
      let acc = sys.List.make(xeto.Spec.type$);
      acc.capacity(ofs.size());
      ofs.each(sys.ObjUtil.coerce((ref) => {
        acc.add(ref.asm());
        return;
      }, sys.Type.find("|xetoc::AData,sys::Str->sys::Void|")));
      return xetoEnv.MSpecArgsOfs.make(sys.ObjUtil.coerce(acc, sys.Type.find("xetoEnv::XetoSpec[]")));
    }
    ;
    if (spec.base() != null) {
      return spec.base().args();
    }
    ;
    return xetoEnv.MSpecArgs.nil();
  }

  static make() {
    const $self = new InheritMeta();
    InheritMeta.make$($self);
    return $self;
  }

  static make$($self) {
    Step.make$($self);
    return;
  }

}

class XetoCompiler extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#log = sys.ObjUtil.coerce(xetoEnv.XetoLog.makeOutStream(), xetoEnv.XetoLog.type$);
    this.#errs = sys.List.make(xetoEnv.XetoCompilerErr.type$);
    this.#autoNames = sys.List.make(sys.Str.type$);
    this.#internRefs = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Ref"));
    return;
  }

  typeof() { return XetoCompiler.type$; }

  #ns = null;

  ns(it) {
    if (it === undefined) {
      return this.#ns;
    }
    else {
      this.#ns = it;
      return;
    }
  }

  #names = null;

  names(it) {
    if (it === undefined) {
      return this.#names;
    }
    else {
      this.#names = it;
      return;
    }
  }

  #log = null;

  log(it) {
    if (it === undefined) {
      return this.#log;
    }
    else {
      this.#log = it;
      return;
    }
  }

  #input = null;

  input(it) {
    if (it === undefined) {
      return this.#input;
    }
    else {
      this.#input = it;
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

  #build = null;

  build(it) {
    if (it === undefined) {
      return this.#build;
    }
    else {
      this.#build = it;
      return;
    }
  }

  #errs = null;

  errs(it) {
    if (it === undefined) {
      return this.#errs;
    }
    else {
      this.#errs = it;
      return;
    }
  }

  #sys = null;

  sys(it) {
    if (it === undefined) {
      return this.#sys;
    }
    else {
      this.#sys = it;
      return;
    }
  }

  #depends = null;

  depends(it) {
    if (it === undefined) {
      return this.#depends;
    }
    else {
      this.#depends = it;
      return;
    }
  }

  #duration = null;

  duration(it) {
    if (it === undefined) {
      return this.#duration;
    }
    else {
      this.#duration = it;
      return;
    }
  }

  #isLib = false;

  isLib(it) {
    if (it === undefined) {
      return this.#isLib;
    }
    else {
      this.#isLib = it;
      return;
    }
  }

  #isSys = false;

  isSys(it) {
    if (it === undefined) {
      return this.#isSys;
    }
    else {
      this.#isSys = it;
      return;
    }
  }

  #isSysComp = false;

  isSysComp(it) {
    if (it === undefined) {
      return this.#isSysComp;
    }
    else {
      this.#isSysComp = it;
      return;
    }
  }

  #cns = null;

  cns(it) {
    if (it === undefined) {
      return this.#cns;
    }
    else {
      this.#cns = it;
      return;
    }
  }

  #ast = null;

  ast(it) {
    if (it === undefined) {
      return this.#ast;
    }
    else {
      this.#ast = it;
      return;
    }
  }

  #lib = null;

  lib(it) {
    if (it === undefined) {
      return this.#lib;
    }
    else {
      this.#lib = it;
      return;
    }
  }

  #data = null;

  data(it) {
    if (it === undefined) {
      return this.#data;
    }
    else {
      this.#data = it;
      return;
    }
  }

  #pragma = null;

  pragma(it) {
    if (it === undefined) {
      return this.#pragma;
    }
    else {
      this.#pragma = it;
      return;
    }
  }

  #json = null;

  json(it) {
    if (it === undefined) {
      return this.#json;
    }
    else {
      this.#json = it;
      return;
    }
  }

  #externRefs = false;

  externRefs(it) {
    if (it === undefined) {
      return this.#externRefs;
    }
    else {
      this.#externRefs = it;
      return;
    }
  }

  #autoNames = null;

  // private field reflection only
  __autoNames(it) { if (it === undefined) return this.#autoNames; else this.#autoNames = it; }

  #internRefs = null;

  // private field reflection only
  __internRefs(it) { if (it === undefined) return this.#internRefs; else this.#internRefs = it; }

  static make() {
    const $self = new XetoCompiler();
    XetoCompiler.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    $self.#sys = ASys.make();
    $self.#depends = ADepends.make($self);
    return;
  }

  isBuild() {
    return this.#build != null;
  }

  applyOpts(opts) {
    if (opts == null) {
      return;
    }
    ;
    let log = xetoEnv.XetoUtil.optLog(opts, "log");
    if (log != null) {
      this.#log = xetoEnv.XetoCallbackLog.make(sys.ObjUtil.coerce(log, sys.Type.find("|xeto::XetoLogRec->sys::Void|")));
    }
    ;
    this.#externRefs = opts.has("externRefs");
    return;
  }

  compileLib() {
    this.run(sys.List.make(Step.type$, [InitLib.make(), Parse.make(), ProcessPragma.make(), Resolve.make(), InheritSlots.make(), LoadBindings.make(), InferMeta.make(), ReifyMeta.make(), InheritMeta.make(), InferInstances.make(), ReifyInstances.make(), CheckErrors.make(), Assemble.make(), OutputZip.make()]));
    this.info(sys.Str.plus(sys.Str.plus("Compiled xetolib [", ((this$) => { let $_u51 = ((this$) => { let $_u52 = this$.#build; if ($_u52 == null) return null; return this$.#build.osPath(); })(this$); if ($_u51 != null) return $_u51; return this$.#libName; })(this)), "]"));
    return this.#lib.asm();
  }

  compileData() {
    this.run(sys.List.make(Step.type$, [InitData.make(), Parse.make(), ProcessPragma.make(), Resolve.make(), InferInstances.make(), ReifyInstances.make(), CheckErrors.make()]));
    return this.#ast.asm();
  }

  parseLibVersion() {
    this.run(sys.List.make(Step.type$, [InitLibVersion.make(), Parse.make(), ProcessPragma.make()]));
    let doc = ((this$) => { let $_u53 = this$.#lib.meta().getStr("doc"); if ($_u53 != null) return $_u53; return ""; })(this);
    let dir = this.#input.parent();
    return FileLibVersion.make(sys.ObjUtil.coerce(this.#libName, sys.Str.type$), sys.ObjUtil.coerce(this.#lib.version(), sys.Version.type$), sys.ObjUtil.coerce(dir, sys.File.type$), doc, this.#depends.list());
  }

  run(steps) {
    const this$ = this;
    try {
      let t1 = sys.Duration.now();
      steps.each((step) => {
        step.compiler(this$);
        step.run();
        return;
      });
      let t2 = sys.Duration.now();
      this.#duration = t2.minus(t1);
      return this;
    }
    catch ($_u54) {
      $_u54 = sys.Err.make($_u54);
      if ($_u54 instanceof xetoEnv.XetoCompilerErr) {
        let e = $_u54;
        ;
        throw e;
      }
      else if ($_u54 instanceof sys.Err) {
        let e = $_u54;
        ;
        throw this.err("Internal compiler error", util.FileLoc.unknown(), e);
      }
      else {
        throw $_u54;
      }
    }
    ;
  }

  info(msg) {
    if (this.isBuild()) {
      this.#log.info(msg);
    }
    ;
    return;
  }

  warn(msg,loc,cause) {
    if (cause === undefined) cause = null;
    this.#log.warn(msg, loc, cause);
    return;
  }

  err(msg,loc,cause) {
    if (cause === undefined) cause = null;
    let err = xetoEnv.XetoCompilerErr.make(msg, loc, cause);
    this.#errs.add(err);
    this.#log.err(msg, loc, cause);
    return err;
  }

  errSlot(slot,msg,loc,cause) {
    if (cause === undefined) cause = null;
    if (slot != null) {
      (msg = sys.Str.plus(sys.Str.plus(sys.Str.plus("Slot '", slot.name()), "': "), msg));
    }
    ;
    return this.err(msg, loc, cause);
  }

  err2(msg,loc1,loc2,cause) {
    if (cause === undefined) cause = null;
    let err = xetoEnv.XetoCompilerErr.make(msg, loc1, cause);
    this.#errs.add(err);
    this.#log.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " ["), loc2), "]"), loc1, cause);
    return err;
  }

  autoName(i) {
    if (sys.ObjUtil.compareLT(i, this.#autoNames.size())) {
      return this.#autoNames.get(i);
    }
    ;
    if (sys.ObjUtil.compareNE(i, this.#autoNames.size())) {
      throw sys.Err.make(sys.Int.toStr(i));
    }
    ;
    let s = sys.Int.toStr(i);
    let n = sys.StrBuf.make(sys.Int.plus(1, sys.Str.size(s))).addChar(95).add(s).toStr();
    this.#autoNames.add(n);
    return n;
  }

  makeRef(id,dis) {
    let ref = this.#internRefs.get(id);
    if (ref == null) {
      this.#internRefs.set(id, sys.ObjUtil.coerce((ref = haystack.Ref.make(id, null)), haystack.Ref.type$));
    }
    ;
    if (dis != null) {
      ref.disVal(dis);
    }
    ;
    return sys.ObjUtil.coerce(ref, haystack.Ref.type$);
  }

}

class ANode extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ANode.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  static make(loc) {
    const $self = new ANode();
    ANode.make$($self,loc);
    return $self;
  }

  static make$($self,loc) {
    $self.#loc = loc;
    return;
  }

  dump(out,indent) {
    if (out === undefined) out = sys.Env.cur().out();
    if (indent === undefined) indent = "";
    out.print(sys.ObjUtil.toStr(this));
    return;
  }

}

class ASpec extends ANode {
  constructor() {
    super();
    const this$ = this;
    this.#asm = xetoEnv.XetoSpec.make();
    this.#flags = -1;
    return;
  }

  typeof() { return ASpec.type$; }

  isCompound() { return xetoEnv.CSpec.prototype.isCompound.apply(this, arguments); }

  #lib = null;

  lib() {
    return this.#lib;
  }

  #parent = null;

  parent() {
    return this.#parent;
  }

  #flavor = null;

  flavor(it) {
    if (it === undefined) {
      return this.#flavor;
    }
    else {
      this.#flavor = it;
      return;
    }
  }

  #nameCode = 0;

  nameCode() { return this.#nameCode; }

  __nameCode(it) { if (it === undefined) return this.#nameCode; else this.#nameCode = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #asm = null;

  asm() { return this.#asm; }

  __asm(it) { if (it === undefined) return this.#asm; else this.#asm = it; }

  #typeRef = null;

  typeRef(it) {
    if (it === undefined) {
      return this.#typeRef;
    }
    else {
      this.#typeRef = it;
      return;
    }
  }

  #base = null;

  base(it) {
    if (it === undefined) {
      return this.#base;
    }
    else {
      this.#base = it;
      return;
    }
  }

  #val = null;

  val(it) {
    if (it === undefined) {
      return this.#val;
    }
    else {
      this.#val = it;
      return;
    }
  }

  #argsRef = null;

  argsRef(it) {
    if (it === undefined) {
      return this.#argsRef;
    }
    else {
      this.#argsRef = it;
      return;
    }
  }

  #parsedCompound = false;

  parsedCompound(it) {
    if (it === undefined) {
      return this.#parsedCompound;
    }
    else {
      this.#parsedCompound = it;
      return;
    }
  }

  #parsedSyntheticRef = false;

  parsedSyntheticRef(it) {
    if (it === undefined) {
      return this.#parsedSyntheticRef;
    }
    else {
      this.#parsedSyntheticRef = it;
      return;
    }
  }

  #meta = null;

  meta() {
    return this.#meta;
  }

  #slots = null;

  slots() {
    return this.#slots;
  }

  #bindingRef = null;

  bindingRef(it) {
    if (it === undefined) {
      return this.#bindingRef;
    }
    else {
      this.#bindingRef = it;
      return;
    }
  }

  #metaOwnRef = null;

  metaOwnRef(it) {
    if (it === undefined) {
      return this.#metaOwnRef;
    }
    else {
      this.#metaOwnRef = it;
      return;
    }
  }

  #cmetaRef = null;

  cmetaRef(it) {
    if (it === undefined) {
      return this.#cmetaRef;
    }
    else {
      this.#cmetaRef = it;
      return;
    }
  }

  #cslotsRef = null;

  cslotsRef(it) {
    if (it === undefined) {
      return this.#cslotsRef;
    }
    else {
      this.#cslotsRef = it;
      return;
    }
  }

  #enums = null;

  enums(it) {
    if (it === undefined) {
      return this.#enums;
    }
    else {
      this.#enums = it;
      return;
    }
  }

  #flags = 0;

  flags(it) {
    if (it === undefined) {
      return this.#flags;
    }
    else {
      this.#flags = it;
      return;
    }
  }

  #id$Store = undefined;

  // private field reflection only
  __id$Store(it) { if (it === undefined) return this.#id$Store; else this.#id$Store = it; }

  #cof$Store = undefined;

  // private field reflection only
  __cof$Store(it) { if (it === undefined) return this.#cof$Store; else this.#cof$Store = it; }

  #cofs$Store = undefined;

  // private field reflection only
  __cofs$Store(it) { if (it === undefined) return this.#cofs$Store; else this.#cofs$Store = it; }

  static make(loc,lib,parent,name) {
    const $self = new ASpec();
    ASpec.make$($self,loc,lib,parent,name);
    return $self;
  }

  static make$($self,loc,lib,parent,name) {
    ANode.make$($self, loc);
    ;
    let names = lib.compiler().names();
    $self.#lib = lib;
    $self.#parent = parent;
    $self.#qname = ((this$) => { if (parent == null) return sys.Str.plus(sys.Str.plus(sys.Str.plus("", lib.name()), "::"), name); return sys.Str.plus(sys.Str.plus(sys.Str.plus("", parent.#qname), "."), name); })($self);
    $self.flavor(ASpec.toFlavor(parent, name));
    $self.#nameCode = names.add(name);
    $self.#name = names.toName($self.#nameCode);
    return;
  }

  static toFlavor(parent,name) {
    if (parent != null) {
      return xeto.SpecFlavor.slot();
    }
    ;
    if (sys.Int.isLower(sys.Str.get(name, 0))) {
      return xeto.SpecFlavor.global();
    }
    ;
    return xeto.SpecFlavor.type();
  }

  nodeType() {
    return ANodeType.spec();
  }

  compiler() {
    return this.#lib.compiler();
  }

  sys() {
    return this.#lib.compiler().sys();
  }

  isTop() {
    return this.flavor().isTop();
  }

  isType() {
    return this.flavor().isType();
  }

  isGlobal() {
    return this.flavor().isGlobal();
  }

  isMeta() {
    return this.flavor().isMeta();
  }

  isSys() {
    return this.#lib.isSys();
  }

  isSlot() {
    return this.#parent != null;
  }

  id() {
    if (this.#id$Store === undefined) {
      this.#id$Store = this.id$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#id$Store, haystack.Ref.type$);
  }

  toStr() {
    return this.#qname;
  }

  isObj() {
    return (this.#lib.isSys() && sys.ObjUtil.equals(this.#name, "Obj"));
  }

  args() {
    return sys.ObjUtil.coerce(((this$) => { let $_u56 = this$.#argsRef; if ($_u56 != null) return $_u56; throw xetoEnv.NotReadyErr.make(this$.#qname); })(this), xetoEnv.MSpecArgs.type$);
  }

  metaInit() {
    if (this.#meta == null) {
      this.#meta = ADict.make(this.loc(), this.compiler().sys().spec(), true);
    }
    ;
    this.#meta.metaParent(this);
    return sys.ObjUtil.coerce(this.#meta, ADict.type$);
  }

  metaHas(name) {
    return (this.#meta != null && this.#meta.has(name));
  }

  metaGet(name) {
    return ((this$) => { let $_u57 = this$.#meta; if ($_u57 == null) return null; return this$.#meta.get(name); })(this);
  }

  metaSet(name,data) {
    this.metaInit().set(name, data);
    return;
  }

  metaSetMarker(name) {
    this.metaSet(name, this.sys().markerScalar(this.loc()));
    return;
  }

  metaSetNone(name) {
    this.metaSet(name, AScalar.make(this.loc(), this.sys().none(), "none", haystack.Remove.val()));
    return;
  }

  metaSetStr(name,val) {
    this.metaSet(name, AScalar.make(this.loc(), this.sys().str(), val, val));
    return;
  }

  metaSetOfs(name,specs) {
    const this$ = this;
    let c = this.compiler();
    let first = specs.get(0);
    let loc = first.loc();
    let list = ADict.make(loc, this.sys().list());
    list.listOf(xeto.Ref.type$);
    specs.each((spec,i) => {
      list.set(c.autoName(i), spec);
      return;
    });
    this.metaSet("ofs", list);
    return;
  }

  initSlots() {
    if (this.#slots == null) {
      this.#slots = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoc::ASpec"));
      this.#slots.ordered(true);
    }
    ;
    return sys.ObjUtil.coerce(this.#slots, sys.Type.find("[sys::Str:xetoc::ASpec]"));
  }

  walkBottomUp(f) {
    const this$ = this;
    if (this.#typeRef != null) {
      this.#typeRef.walkBottomUp(f);
    }
    ;
    if (this.#meta != null) {
      this.#meta.walkBottomUp(f);
    }
    ;
    if (this.#slots != null) {
      this.#slots.each((x) => {
        x.walkBottomUp(f);
        return;
      });
    }
    ;
    if (this.#val != null) {
      this.#val.walkBottomUp(f);
    }
    ;
    sys.Func.call(f, this);
    return;
  }

  walkTopDown(f) {
    const this$ = this;
    if (this.#typeRef != null) {
      this.#typeRef.walkTopDown(f);
    }
    ;
    sys.Func.call(f, this);
    if (this.#meta != null) {
      this.#meta.walkTopDown(f);
    }
    ;
    if (this.#slots != null) {
      this.#slots.each((x) => {
        x.walkTopDown(f);
        return;
      });
    }
    ;
    if (this.#val != null) {
      this.#val.walkTopDown(f);
    }
    ;
    return;
  }

  dump(out,indent) {
    if (out === undefined) out = sys.Env.cur().out();
    if (indent === undefined) indent = "";
    const this$ = this;
    let indentMore = sys.Str.plus(indent, "  ");
    out.print(indent).print(this.#name).print(": ");
    if (this.#typeRef != null) {
      out.print(this.#typeRef).print(" ");
    }
    ;
    if (this.#meta != null) {
      this.#meta.dump(out, indentMore);
    }
    ;
    if (this.#slots != null) {
      out.printLine("{");
      this.#slots.each((s) => {
        s.dump(out, indentMore);
        out.printLine();
        return;
      });
      out.print(indent).print("}");
    }
    ;
    if (this.#val != null) {
      out.print(" = ").print(this.#val);
    }
    ;
    return;
  }

  isAst() {
    return true;
  }

  ctype() {
    return sys.ObjUtil.coerce(((this$) => { if (this$.isType()) return this$; return this$.#typeRef.deref(); })(this), xetoEnv.CSpec.type$);
  }

  cbase() {
    return this.#base;
  }

  cparent() {
    return this.#parent;
  }

  cslot(name,checked) {
    if (checked === undefined) checked = true;
    let ast = sys.ObjUtil.as(((this$) => { let $_u59 = this$.#slots; if ($_u59 == null) return null; return this$.#slots.get(name); })(this), ASpec.type$);
    if (ast != null) {
      return ast;
    }
    ;
    if (checked) {
      throw sys.UnknownSlotErr.make(name);
    }
    ;
    return null;
  }

  binding() {
    return sys.ObjUtil.coerce(((this$) => { let $_u60 = this$.#bindingRef; if ($_u60 != null) return $_u60; throw xetoEnv.NotReadyErr.make(this$.#qname); })(this), xeto.SpecBinding.type$);
  }

  metaOwn() {
    return sys.ObjUtil.coerce(((this$) => { let $_u61 = this$.#metaOwnRef; if ($_u61 != null) return $_u61; throw xetoEnv.NotReadyErr.make(this$.#qname); })(this), xeto.Dict.type$);
  }

  cmeta() {
    return sys.ObjUtil.coerce(((this$) => { let $_u62 = this$.#cmetaRef; if ($_u62 != null) return $_u62; throw xetoEnv.NotReadyErr.make(this$.#qname); })(this), xetoEnv.MNameDict.type$);
  }

  cmetaHas(name) {
    if (this.#cmetaRef != null) {
      return this.#cmetaRef.has(name);
    }
    ;
    return this.metaHas(name);
  }

  hasSlots() {
    if (this.#cslotsRef == null) {
      throw xetoEnv.NotReadyErr.make(this.#qname);
    }
    ;
    return !this.#cslotsRef.isEmpty();
  }

  cslots(f) {
    if (this.#cslotsRef == null) {
      throw xetoEnv.NotReadyErr.make(this.#qname);
    }
    ;
    this.#cslotsRef.each(f);
    return;
  }

  cslotsWhile(f) {
    if (this.#cslotsRef == null) {
      throw xetoEnv.NotReadyErr.make(this.#qname);
    }
    ;
    return this.#cslotsRef.eachWhile(f);
  }

  cenum(key,checked) {
    if (checked === undefined) checked = true;
    if (!this.isEnum()) {
      throw sys.Err.make(this.#qname);
    }
    ;
    if (this.#enums == null) {
      throw xetoEnv.NotReadyErr.make(this.#qname);
    }
    ;
    let x = this.#enums.get(key);
    if (x != null) {
      return x;
    }
    ;
    if (checked) {
      throw sys.Err.make(key);
    }
    ;
    return null;
  }

  cisa(that) {
    if (xetoEnv.XetoUtil.isa(this, that)) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(this.#qname, that.qname())) {
      return true;
    }
    ;
    return false;
  }

  cof() {
    if (this.#cof$Store === undefined) {
      this.#cof$Store = this.cof$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#cof$Store, xetoEnv.CSpec.type$.toNullable());
  }

  cofs() {
    if (this.#cofs$Store === undefined) {
      this.#cofs$Store = this.cofs$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#cofs$Store, sys.Type.find("xetoEnv::CSpec[]?"));
  }

  isNone() {
    return (this.isSys() && sys.ObjUtil.equals(this.#name, "None"));
  }

  isSelf() {
    return (this.isSys() && sys.ObjUtil.equals(this.#name, "Self"));
  }

  isEnum() {
    return (this.#base != null && this.#base.isSys() && sys.ObjUtil.equals(this.#base.name(), "Enum"));
  }

  isAnd() {
    return (this.#base != null && this.#base.isSys() && sys.ObjUtil.equals(this.#base.name(), "And"));
  }

  isOr() {
    return (this.#base != null && this.#base.isSys() && sys.ObjUtil.equals(this.#base.name(), "Or"));
  }

  isScalar() {
    return this.hasFlag(xetoEnv.MSpecFlags.scalar());
  }

  isMarker() {
    return this.hasFlag(xetoEnv.MSpecFlags.marker());
  }

  isRef() {
    return this.hasFlag(xetoEnv.MSpecFlags.ref());
  }

  isMultiRef() {
    return this.hasFlag(xetoEnv.MSpecFlags.multiRef());
  }

  isChoice() {
    return this.hasFlag(xetoEnv.MSpecFlags.choice());
  }

  isDict() {
    return this.hasFlag(xetoEnv.MSpecFlags.dict());
  }

  isList() {
    return this.hasFlag(xetoEnv.MSpecFlags.list());
  }

  isMaybe() {
    return this.hasFlag(xetoEnv.MSpecFlags.maybe());
  }

  isQuery() {
    return this.hasFlag(xetoEnv.MSpecFlags.query());
  }

  isFunc() {
    return this.hasFlag(xetoEnv.MSpecFlags.func());
  }

  isInterface() {
    return this.hasFlag(xetoEnv.MSpecFlags.interface());
  }

  isComp() {
    return this.hasFlag(xetoEnv.MSpecFlags.comp());
  }

  hasFlag(flag) {
    if (sys.ObjUtil.compareLT(this.flags(), 0)) {
      throw sys.Err.make(sys.Str.plus("Flags not set yet: ", this.#qname));
    }
    ;
    return sys.ObjUtil.compareNE(sys.Int.and(this.flags(), flag), 0);
  }

  id$Once() {
    return sys.ObjUtil.coerce(haystack.Ref.make(this.#qname, null), haystack.Ref.type$);
  }

  cof$Once() {
    if (this.#meta == null) {
      return null;
    }
    ;
    let x = sys.ObjUtil.as(this.#meta.get("of"), ASpecRef.type$);
    if (x == null) {
      return null;
    }
    ;
    return x.deref();
  }

  cofs$Once() {
    const this$ = this;
    if (this.#meta == null) {
      return null;
    }
    ;
    let list = sys.ObjUtil.as(this.#meta.get("ofs"), ADict.type$);
    if (list == null) {
      return null;
    }
    ;
    let acc = sys.List.make(xetoEnv.CSpec.type$);
    list.each((x) => {
      acc.add(sys.ObjUtil.coerce(x, ASpecRef.type$).deref());
      return;
    });
    return acc.ro();
  }

}

class CInstance {
  constructor() {
    const this$ = this;
  }

  typeof() { return CInstance.type$; }

}

class CInstanceWrap extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CInstanceWrap.type$; }

  #w = null;

  w() { return this.#w; }

  __w(it) { if (it === undefined) return this.#w; else this.#w = it; }

  #spec = null;

  spec() { return this.#spec; }

  __spec(it) { if (it === undefined) return this.#spec; else this.#spec = it; }

  static make(w,spec) {
    const $self = new CInstanceWrap();
    CInstanceWrap.make$($self,w,spec);
    return $self;
  }

  static make$($self,w,spec) {
    $self.#w = w;
    $self.#spec = spec;
    return;
  }

  isAst() {
    return false;
  }

  id() {
    return sys.ObjUtil.coerce(this.#w.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$);
  }

  ctype() {
    return this.#spec;
  }

  asm() {
    return this.id();
  }

}

class ADoc extends ANode {
  constructor() {
    super();
    const this$ = this;
    this.#instances = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:sys::Obj?]")), sys.Type.find("[sys::Str:xetoc::AInstance]"));
    return;
  }

  typeof() { return ADoc.type$; }

  #compiler = null;

  compiler() {
    return this.#compiler;
  }

  #instances = null;

  instances(it) {
    if (it === undefined) {
      return this.#instances;
    }
    else {
      this.#instances = it;
      return;
    }
  }

  static make(c,loc) {
    const $self = new ADoc();
    ADoc.make$($self,c,loc);
    return $self;
  }

  static make$($self,c,loc) {
    ANode.make$($self, loc);
    ;
    $self.#compiler = c;
    return;
  }

  instance(name) {
    return this.#instances.get(name);
  }

}

class ADataDoc extends ADoc {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ADataDoc.type$; }

  #root = null;

  root(it) {
    if (it === undefined) {
      return this.#root;
    }
    else {
      this.#root = it;
      return;
    }
  }

  static make(c,loc) {
    const $self = new ADataDoc();
    ADataDoc.make$($self,c,loc);
    return $self;
  }

  static make$($self,c,loc) {
    ADoc.make$($self, c, loc);
    return;
  }

  nodeType() {
    return ANodeType.dataDoc();
  }

  asm() {
    return this.#root.asm();
  }

  walkBottomUp(f) {
    this.#root.walkBottomUp(f);
    return;
  }

  walkTopDown(f) {
    this.#root.walkTopDown(f);
    return;
  }

  walkMetaTopDown(f) {
    return;
  }

  walkMetaBottomUp(f) {
    return;
  }

  walkInstancesTopDown(f) {
    this.walkTopDown(f);
    return;
  }

  walkInstancesBottomUp(f) {
    this.walkBottomUp(f);
    return;
  }

  dump(out,indent) {
    if (out === undefined) out = sys.Env.cur().out();
    if (indent === undefined) indent = "";
    this.#root.dump(out, indent);
    return;
  }

}

class ASys extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#obj = ASys.init("Obj");
    this.#none = ASys.init("None");
    this.#marker = ASys.init("Marker");
    this.#str = ASys.init("Str");
    this.#ref = ASys.init("Ref");
    this.#dict = ASys.init("Dict");
    this.#list = ASys.init("List");
    this.#and = ASys.init("And");
    this.#or = ASys.init("Or");
    this.#lib = ASys.init("Lib");
    this.#spec = ASys.init("Spec");
    this.#query = ASys.init("Query");
    return;
  }

  typeof() { return ASys.type$; }

  #obj = null;

  obj(it) {
    if (it === undefined) {
      return this.#obj;
    }
    else {
      this.#obj = it;
      return;
    }
  }

  #none = null;

  none(it) {
    if (it === undefined) {
      return this.#none;
    }
    else {
      this.#none = it;
      return;
    }
  }

  #marker = null;

  marker(it) {
    if (it === undefined) {
      return this.#marker;
    }
    else {
      this.#marker = it;
      return;
    }
  }

  #str = null;

  str(it) {
    if (it === undefined) {
      return this.#str;
    }
    else {
      this.#str = it;
      return;
    }
  }

  #ref = null;

  ref(it) {
    if (it === undefined) {
      return this.#ref;
    }
    else {
      this.#ref = it;
      return;
    }
  }

  #dict = null;

  dict(it) {
    if (it === undefined) {
      return this.#dict;
    }
    else {
      this.#dict = it;
      return;
    }
  }

  #list = null;

  list(it) {
    if (it === undefined) {
      return this.#list;
    }
    else {
      this.#list = it;
      return;
    }
  }

  #and = null;

  and(it) {
    if (it === undefined) {
      return this.#and;
    }
    else {
      this.#and = it;
      return;
    }
  }

  #or = null;

  or(it) {
    if (it === undefined) {
      return this.#or;
    }
    else {
      this.#or = it;
      return;
    }
  }

  #lib = null;

  lib(it) {
    if (it === undefined) {
      return this.#lib;
    }
    else {
      this.#lib = it;
      return;
    }
  }

  #spec = null;

  spec(it) {
    if (it === undefined) {
      return this.#spec;
    }
    else {
      this.#spec = it;
      return;
    }
  }

  #query = null;

  query(it) {
    if (it === undefined) {
      return this.#query;
    }
    else {
      this.#query = it;
      return;
    }
  }

  each(f) {
    const this$ = this;
    sys.ObjUtil.typeof(this).fields().each((field) => {
      let ref = sys.ObjUtil.as(field.get(this$), ASpecRef.type$);
      if (ref != null) {
        sys.Func.call(f, sys.ObjUtil.coerce(ref, ASpecRef.type$));
      }
      ;
      return;
    });
    return;
  }

  static init(name) {
    return ASpecRef.make(util.FileLoc.synthetic(), ASimpleName.make("sys", name));
  }

  markerScalar(loc) {
    return AScalar.make(loc, this.#marker, haystack.Marker.val().toStr(), haystack.Marker.val());
  }

  static make() {
    const $self = new ASys();
    ASys.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class AName extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AName.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  static make(lib) {
    const $self = new AName();
    AName.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    $self.#lib = lib;
    return;
  }

  isQualified() {
    return this.#lib != null;
  }

}

class ASimpleName extends AName {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ASimpleName.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  static make(lib,name) {
    const $self = new ASimpleName();
    ASimpleName.make$($self,lib,name);
    return $self;
  }

  static make$($self,lib,name) {
    AName.make$($self, lib);
    if (sys.Str.isEmpty(name)) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", ((this$) => { let $_u63 = lib; if ($_u63 == null) return null; return sys.Str.toCode(lib); })($self)), " "), sys.Str.toCode(name)));
    }
    ;
    $self.#name = name;
    return;
  }

  isPath() {
    return false;
  }

  size() {
    return 1;
  }

  nameAt(i) {
    if (sys.ObjUtil.equals(i, 0)) {
      return this.#name;
    }
    ;
    throw sys.IndexErr.make(sys.Int.toStr(i));
  }

  toStr() {
    return ((this$) => { if (this$.isQualified()) return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.lib()), "::"), this$.#name); return this$.#name; })(this);
  }

}

class APathName extends AName {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return APathName.type$; }

  #path = null;

  path() { return this.#path; }

  __path(it) { if (it === undefined) return this.#path; else this.#path = it; }

  static make(lib,path) {
    const $self = new APathName();
    APathName.make$($self,lib,path);
    return $self;
  }

  static make$($self,lib,path) {
    AName.make$($self, lib);
    $self.#path = sys.ObjUtil.coerce(((this$) => { let $_u65 = path; if ($_u65 == null) return null; return sys.ObjUtil.toImmutable(path); })($self), sys.Type.find("sys::Str[]"));
    return;
  }

  isPath() {
    return true;
  }

  name() {
    return sys.ObjUtil.coerce(this.#path.last(), sys.Str.type$);
  }

  size() {
    return this.#path.size();
  }

  nameAt(i) {
    return this.#path.get(i);
  }

  toStr() {
    const this$ = this;
    let s = sys.StrBuf.make();
    if (this.isQualified()) {
      s.add(this.lib()).add("::");
    }
    ;
    this.#path.each((n,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        s.addChar(46);
      }
      ;
      s.add(n);
      return;
    });
    return s.toStr();
  }

}

class AData extends ANode {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AData.type$; }

  #typeRef = null;

  typeRef(it) {
    if (it === undefined) {
      return this.#typeRef;
    }
    else {
      this.#typeRef = it;
      return;
    }
  }

  static make(loc,type) {
    const $self = new AData();
    AData.make$($self,loc,type);
    return $self;
  }

  static make$($self,loc,type) {
    ANode.make$($self, loc);
    $self.#typeRef = type;
    return;
  }

  ctype() {
    return sys.ObjUtil.coerce(((this$) => { let $_u66 = ((this$) => { let $_u67 = this$.#typeRef; if ($_u67 == null) return null; return this$.#typeRef.deref(); })(this$); if ($_u66 != null) return $_u66; throw xetoEnv.NotReadyErr.make(); })(this), xetoEnv.CSpec.type$);
  }

  isNone() {
    return false;
  }

}

class ARef extends AData {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ARef.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  static make(loc,name) {
    const $self = new ARef();
    ARef.make$($self,loc,name);
    return $self;
  }

  static make$($self,loc,name) {
    AData.make$($self, loc, null);
    $self.#name = name;
    return;
  }

  isAsm() {
    return this.isResolved();
  }

  toStr() {
    return sys.ObjUtil.toStr(this.#name);
  }

  walkBottomUp(f) {
    sys.Func.call(f, this);
    return;
  }

  walkTopDown(f) {
    sys.Func.call(f, this);
    return;
  }

}

class ASpecRef extends ARef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ASpecRef.type$; }

  #of = null;

  of(it) {
    if (it === undefined) {
      return this.#of;
    }
    else {
      this.#of = it;
      return;
    }
  }

  #resolvedRef = null;

  // private field reflection only
  __resolvedRef(it) { if (it === undefined) return this.#resolvedRef; else this.#resolvedRef = it; }

  static make(loc,name) {
    const $self = new ASpecRef();
    ASpecRef.make$($self,loc,name);
    return $self;
  }

  static make$($self,loc,name) {
    ARef.make$($self, loc, name);
    return;
  }

  static makeResolved(loc,spec) {
    const $self = new ASpecRef();
    ASpecRef.makeResolved$($self,loc,spec);
    return $self;
  }

  static makeResolved$($self,loc,spec) {
    ARef.make$($self, loc, ASimpleName.make(null, spec.name()));
    $self.#resolvedRef = spec;
    return;
  }

  nodeType() {
    return ANodeType.specRef();
  }

  what() {
    return "spec";
  }

  isResolved() {
    return this.#resolvedRef != null;
  }

  asm() {
    return this.deref().asm();
  }

  resolve(x) {
    this.#resolvedRef = sys.ObjUtil.coerce(x, xetoEnv.CSpec.type$.toNullable());
    return;
  }

  deref() {
    return sys.ObjUtil.coerce(((this$) => { let $_u68 = this$.#resolvedRef; if ($_u68 != null) return $_u68; throw xetoEnv.NotReadyErr.make(this$.toStr()); })(this), xetoEnv.CSpec.type$);
  }

}

class ADataRef extends ARef {
  constructor() {
    super();
    const this$ = this;
    this.#resolvedRef = null;
    this.#asmRef = null;
    return;
  }

  typeof() { return ADataRef.type$; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #resolvedRef = null;

  // private field reflection only
  __resolvedRef(it) { if (it === undefined) return this.#resolvedRef; else this.#resolvedRef = it; }

  #asmRef = null;

  asmRef(it) {
    if (it === undefined) {
      return this.#asmRef;
    }
    else {
      this.#asmRef = it;
      return;
    }
  }

  static make(loc,name,dis) {
    const $self = new ADataRef();
    ADataRef.make$($self,loc,name,dis);
    return $self;
  }

  static make$($self,loc,name,dis) {
    ARef.make$($self, loc, name);
    ;
    $self.#dis = dis;
    return;
  }

  nodeType() {
    return ANodeType.dataRef();
  }

  what() {
    return "instance";
  }

  asm() {
    return sys.ObjUtil.coerce(((this$) => { let $_u69 = this$.#asmRef; if ($_u69 != null) return $_u69; throw xetoEnv.NotReadyErr.make(this$.toStr()); })(this), xeto.Ref.type$);
  }

  isResolved() {
    return this.#resolvedRef != null;
  }

  resolve(x) {
    this.#resolvedRef = sys.ObjUtil.coerce(x, CInstance.type$.toNullable());
    return;
  }

  deref() {
    return sys.ObjUtil.coerce(((this$) => { let $_u70 = this$.#resolvedRef; if ($_u70 != null) return $_u70; throw xetoEnv.NotReadyErr.make(this$.toStr()); })(this), CInstance.type$);
  }

}

class ADepends extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#globals = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::CSpec?"));
    return;
  }

  typeof() { return ADepends.type$; }

  #compiler = null;

  compiler(it) {
    if (it === undefined) {
      return this.#compiler;
    }
    else {
      this.#compiler = it;
      return;
    }
  }

  #list = null;

  list(it) {
    if (it === undefined) {
      return this.#list;
    }
    else {
      this.#list = it;
      return;
    }
  }

  #libs = null;

  libs(it) {
    if (it === undefined) {
      return this.#libs;
    }
    else {
      this.#libs = it;
      return;
    }
  }

  #globals = null;

  // private field reflection only
  __globals(it) { if (it === undefined) return this.#globals; else this.#globals = it; }

  static make(compiler) {
    const $self = new ADepends();
    ADepends.make$($self,compiler);
    return $self;
  }

  static make$($self,compiler) {
    ;
    $self.#compiler = compiler;
    return;
  }

}

class ALib extends ADoc {
  constructor() {
    super();
    const this$ = this;
    this.#tops = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:sys::Obj?]")), sys.Type.find("[sys::Str:xetoc::ASpec]"));
    return;
  }

  typeof() { return ALib.type$; }

  #nameCode = 0;

  nameCode() { return this.#nameCode; }

  __nameCode(it) { if (it === undefined) return this.#nameCode; else this.#nameCode = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #isSys = false;

  isSys() { return this.#isSys; }

  __isSys(it) { if (it === undefined) return this.#isSys; else this.#isSys = it; }

  #asm = null;

  asm() { return this.#asm; }

  __asm(it) { if (it === undefined) return this.#asm; else this.#asm = it; }

  #files = null;

  files(it) {
    if (it === undefined) {
      return this.#files;
    }
    else {
      this.#files = it;
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

  #flags = 0;

  flags(it) {
    if (it === undefined) {
      return this.#flags;
    }
    else {
      this.#flags = it;
      return;
    }
  }

  #version = null;

  version(it) {
    if (it === undefined) {
      return this.#version;
    }
    else {
      this.#version = it;
      return;
    }
  }

  #tops = null;

  tops(it) {
    if (it === undefined) {
      return this.#tops;
    }
    else {
      this.#tops = it;
      return;
    }
  }

  #typesRef = null;

  typesRef(it) {
    if (it === undefined) {
      return this.#typesRef;
    }
    else {
      this.#typesRef = it;
      return;
    }
  }

  #autoNameCount = 0;

  // private field reflection only
  __autoNameCount(it) { if (it === undefined) return this.#autoNameCount; else this.#autoNameCount = it; }

  static make(c,loc,name) {
    const $self = new ALib();
    ALib.make$($self,c,loc,name);
    return $self;
  }

  static make$($self,c,loc,name) {
    ADoc.make$($self, c, loc);
    ;
    $self.#nameCode = c.names().add(name);
    $self.#name = c.names().toName($self.#nameCode);
    $self.#isSys = sys.ObjUtil.equals(name, "sys");
    $self.#asm = xetoEnv.XetoLib.make();
    return;
  }

  nodeType() {
    return ANodeType.lib();
  }

  top(name) {
    return this.#tops.get(name);
  }

  types() {
    return sys.ObjUtil.coerce(((this$) => { let $_u71 = this$.#typesRef; if ($_u71 != null) return $_u71; throw xetoEnv.NotReadyErr.make(this$.#name); })(this), sys.Type.find("xetoc::ASpec[]"));
  }

  walkBottomUp(f) {
    this.walkMetaBottomUp(f);
    this.walkInstancesBottomUp(f);
    sys.Func.call(f, this);
    return;
  }

  walkTopDown(f) {
    sys.Func.call(f, this);
    this.walkMetaTopDown(f);
    this.walkInstancesTopDown(f);
    return;
  }

  walkMetaBottomUp(f) {
    const this$ = this;
    this.#meta.walkBottomUp(f);
    this.#tops.each((x) => {
      x.walkBottomUp(f);
      return;
    });
    return;
  }

  walkMetaTopDown(f) {
    const this$ = this;
    this.#meta.walkTopDown(f);
    this.#tops.each((x) => {
      x.walkTopDown(f);
      return;
    });
    return;
  }

  walkInstancesBottomUp(f) {
    const this$ = this;
    this.instances().each((x) => {
      if (!x.isNested()) {
        x.walkBottomUp(f);
      }
      ;
      return;
    });
    return;
  }

  walkInstancesTopDown(f) {
    const this$ = this;
    this.instances().each((x) => {
      if (!x.isNested()) {
        x.walkTopDown(f);
      }
      ;
      return;
    });
    return;
  }

  autoName() {
    return sys.Str.plus("_", sys.ObjUtil.coerce(((this$) => { let $_u72 = this$.#autoNameCount;this$.#autoNameCount = sys.Int.increment(this$.#autoNameCount); return $_u72; })(this), sys.Obj.type$.toNullable()));
  }

  dump(out,indent) {
    if (out === undefined) out = sys.Env.cur().out();
    if (indent === undefined) indent = "";
    const this$ = this;
    this.#tops.each((spec) => {
      spec.dump(out, indent);
      out.printLine().printLine();
      return;
    });
    this.instances().each((data) => {
      data.dump(out, indent);
      out.printLine().printLine();
      return;
    });
    return;
  }

}

class ANodeType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ANodeType.type$; }

  static lib() { return ANodeType.vals().get(0); }

  static dataDoc() { return ANodeType.vals().get(1); }

  static spec() { return ANodeType.vals().get(2); }

  static scalar() { return ANodeType.vals().get(3); }

  static dict() { return ANodeType.vals().get(4); }

  static instance() { return ANodeType.vals().get(5); }

  static specRef() { return ANodeType.vals().get(6); }

  static dataRef() { return ANodeType.vals().get(7); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new ANodeType();
    ANodeType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(ANodeType.type$, ANodeType.vals(), name$, checked);
  }

  static vals() {
    if (ANodeType.#vals == null) {
      ANodeType.#vals = sys.List.make(ANodeType.type$, [
        ANodeType.make(0, "lib", ),
        ANodeType.make(1, "dataDoc", ),
        ANodeType.make(2, "spec", ),
        ANodeType.make(3, "scalar", ),
        ANodeType.make(4, "dict", ),
        ANodeType.make(5, "instance", ),
        ANodeType.make(6, "specRef", ),
        ANodeType.make(7, "dataRef", ),
      ]).toImmutable();
    }
    return ANodeType.#vals;
  }

  static static$init() {
    const $_u73 = ANodeType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class ANamespace extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#metaSpecs = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    this.#globals = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    return;
  }

  typeof() { return ANamespace.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #compiler = null;

  compiler(it) {
    if (it === undefined) {
      return this.#compiler;
    }
    else {
      this.#compiler = it;
      return;
    }
  }

  #metaSpecs = null;

  metaSpecs(it) {
    if (it === undefined) {
      return this.#metaSpecs;
    }
    else {
      this.#metaSpecs = it;
      return;
    }
  }

  #globals = null;

  globals(it) {
    if (it === undefined) {
      return this.#globals;
    }
    else {
      this.#globals = it;
      return;
    }
  }

  static make(step) {
    const $self = new ANamespace();
    ANamespace.make$($self,step);
    return $self;
  }

  static make$($self,step) {
    ;
    $self.#compiler = sys.ObjUtil.coerce(step.compiler(), XetoCompiler.type$);
    $self.#ns = step.ns();
    return;
  }

  metaSpec(name,loc) {
    return this.top(this.#metaSpecs, name, xeto.SpecFlavor.meta(), loc);
  }

  global(name,loc) {
    return this.top(this.#globals, name, xeto.SpecFlavor.global(), loc);
  }

  top(acc,name,flavor,loc) {
    let g = acc.get(name);
    if (g != null) {
      return sys.ObjUtil.as(g, xetoEnv.CSpec.type$);
    }
    ;
    (g = this.findTop(name, flavor, loc));
    acc.set(name, sys.ObjUtil.coerce(((this$) => { let $_u74 = g; if ($_u74 != null) return $_u74; return "not-found"; })(this), sys.Obj.type$));
    return sys.ObjUtil.as(g, xetoEnv.CSpec.type$);
  }

  findTop(name,flavor,loc) {
    const this$ = this;
    let acc = sys.List.make(xetoEnv.CSpec.type$);
    let mine = ((this$) => { let $_u75 = ((this$) => { let $_u76=this$.#compiler.lib(); return ($_u76==null) ? null : $_u76.tops(); })(this$); if ($_u75 == null) return null; return ((this$) => { let $_u77=this$.#compiler.lib(); return ($_u77==null) ? null : $_u77.tops(); })(this$).get(name); })(this);
    if ((mine != null && mine.flavor() === flavor)) {
      acc.add(sys.ObjUtil.coerce(mine, xetoEnv.CSpec.type$));
    }
    ;
    this.#compiler.depends().libs().each((lib) => {
      let g = lib.spec(name, false);
      if ((g != null && g.flavor() === flavor)) {
        acc.add(sys.ObjUtil.coerce(g, xetoEnv.CSpec.type$));
      }
      ;
      return;
    });
    if (acc.isEmpty()) {
      return null;
    }
    ;
    if (sys.ObjUtil.equals(acc.size(), 1)) {
      return acc.first();
    }
    ;
    this.#compiler.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Duplicate ", flavor), " specs: "), acc.join(", ")), loc);
    return null;
  }

  eachSubtype(type,f) {
    const this$ = this;
    if ((this.#ns != null && sys.ObjUtil.is(type, xetoEnv.XetoSpec.type$))) {
      this.#ns.eachSubtype(type, f);
    }
    ;
    if (this.#compiler.lib() != null) {
      this.#compiler.lib().tops().each((x) => {
        if ((x.isType() && x.cisa(type))) {
          sys.Func.call(f, x);
        }
        ;
        return;
      });
    }
    ;
    return;
  }

}

class AScalar extends AData {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AScalar.type$; }

  #asmRef = null;

  asmRef(it) {
    if (it === undefined) {
      return this.#asmRef;
    }
    else {
      this.#asmRef = it;
      return;
    }
  }

  #str = null;

  str() { return this.#str; }

  __str(it) { if (it === undefined) return this.#str; else this.#str = it; }

  static make(loc,type,str,asm) {
    const $self = new AScalar();
    AScalar.make$($self,loc,type,str,asm);
    return $self;
  }

  static make$($self,loc,type,str,asm) {
    if (asm === undefined) asm = null;
    AData.make$($self, loc, type);
    $self.#str = str;
    $self.#asmRef = asm;
    return;
  }

  nodeType() {
    return ANodeType.scalar();
  }

  isAsm() {
    return this.#asmRef != null;
  }

  asm() {
    return sys.ObjUtil.coerce(((this$) => { let $_u78 = this$.#asmRef; if ($_u78 != null) return $_u78; throw xetoEnv.NotReadyErr.make(this$.#str); })(this), sys.Obj.type$);
  }

  isNone() {
    return this.#asmRef === haystack.Remove.val();
  }

  toStr() {
    return ((this$) => { if (this$.typeRef() != null) return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.typeRef()), " "), sys.Str.toCode(this$.#str)); return sys.Str.toCode(this$.#str); })(this);
  }

  walkBottomUp(f) {
    if (this.typeRef() != null) {
      this.typeRef().walkBottomUp(f);
    }
    ;
    sys.Func.call(f, this);
    return;
  }

  walkTopDown(f) {
    if (this.typeRef() != null) {
      this.typeRef().walkTopDown(f);
    }
    ;
    sys.Func.call(f, this);
    return;
  }

}

class ADict extends AData {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ADict.type$; }

  #asmRef = null;

  asmRef(it) {
    if (it === undefined) {
      return this.#asmRef;
    }
    else {
      this.#asmRef = it;
      return;
    }
  }

  #isMeta = false;

  isMeta() { return this.#isMeta; }

  __isMeta(it) { if (it === undefined) return this.#isMeta; else this.#isMeta = it; }

  #metaParent = null;

  metaParent(it) {
    if (it === undefined) {
      return this.#metaParent;
    }
    else {
      this.#metaParent = it;
      return;
    }
  }

  #listOf = null;

  listOf(it) {
    if (it === undefined) {
      return this.#listOf;
    }
    else {
      this.#listOf = it;
      return;
    }
  }

  #map = null;

  map() {
    return this.#map;
  }

  static make(loc,type,isMeta) {
    const $self = new ADict();
    ADict.make$($self,loc,type,isMeta);
    return $self;
  }

  static make$($self,loc,type,isMeta) {
    if (isMeta === undefined) isMeta = false;
    AData.make$($self, loc, type);
    $self.#map = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), sys.Type.find("[sys::Str:xetoc::AData]"));
    $self.#map.ordered(true);
    $self.#isMeta = isMeta;
    return;
  }

  nodeType() {
    return ANodeType.dict();
  }

  isAsm() {
    return this.#asmRef != null;
  }

  asm() {
    return sys.ObjUtil.coerce(((this$) => { let $_u80 = this$.#asmRef; if ($_u80 != null) return $_u80; throw xetoEnv.NotReadyErr.make(); })(this), sys.Obj.type$);
  }

  isLibMeta() {
    return sys.ObjUtil.is(this.#metaParent, ALib.type$);
  }

  isSpecMeta() {
    return sys.ObjUtil.is(this.#metaParent, ASpec.type$);
  }

  toStr() {
    return this.#map.toStr();
  }

  size() {
    return this.#map.size();
  }

  has(name) {
    return this.#map.get(name) != null;
  }

  get(name) {
    return this.#map.get(name);
  }

  getStr(name) {
    return ((this$) => { let $_u81=sys.ObjUtil.as(this$.#map.get(name), AScalar.type$); return ($_u81==null) ? null : $_u81.str(); })(this);
  }

  set(name,val) {
    this.#map.set(name, val);
    return;
  }

  each(f) {
    this.#map.each(f);
    return;
  }

  walkBottomUp(f) {
    const this$ = this;
    if (this.typeRef() != null) {
      this.typeRef().walkBottomUp(f);
    }
    ;
    this.#map.each((x) => {
      x.walkBottomUp(f);
      return;
    });
    sys.Func.call(f, this);
    return;
  }

  walkTopDown(f) {
    const this$ = this;
    if (this.typeRef() != null) {
      this.typeRef().walkTopDown(f);
    }
    ;
    sys.Func.call(f, this);
    this.#map.each((x) => {
      x.walkTopDown(f);
      return;
    });
    return;
  }

  dump(out,indent) {
    if (out === undefined) out = sys.Env.cur().out();
    if (indent === undefined) indent = "";
    const this$ = this;
    if (this.typeRef() != null) {
      out.print(this.typeRef()).print(" ");
    }
    ;
    let indentMore = sys.Str.plus(indent, "  ");
    out.printLine(((this$) => { if (this$.#isMeta) return "<"; return "{"; })(this));
    this.#map.each((v,n) => {
      out.print(indentMore).print(n).print(": ");
      v.dump(out, indentMore);
      out.printLine();
      return;
    });
    out.print(indent).print(((this$) => { if (this$.#isMeta) return ">"; return "}"; })(this));
    return;
  }

}

class AInstance extends ADict {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AInstance.type$; }

  #name = null;

  name(it) {
    if (it === undefined) {
      return this.#name;
    }
    else {
      this.#name = it;
      return;
    }
  }

  #isNested = false;

  isNested() { return this.#isNested; }

  __isNested(it) { if (it === undefined) return this.#isNested; else this.#isNested = it; }

  static make(loc,type,name,isNested) {
    const $self = new AInstance();
    AInstance.make$($self,loc,type,name,isNested);
    return $self;
  }

  static make$($self,loc,type,name,isNested) {
    ADict.make$($self, loc, type);
    $self.#name = name;
    $self.#isNested = isNested;
    return;
  }

  nodeType() {
    return ANodeType.instance();
  }

  dump(out,indent) {
    if (out === undefined) out = sys.Env.cur().out();
    if (indent === undefined) indent = "";
    out.print("@").print(this.#name).print(": ");
    ADict.prototype.dump.call(this, out, indent);
    return;
  }

  isAst() {
    return true;
  }

  id() {
    return sys.ObjUtil.coerce(((this$) => { let $_u84 = ((this$) => { let $_u85 = this$.get("id"); if ($_u85 == null) return null; return this$.get("id").asm(); })(this$); if ($_u84 != null) return $_u84; throw xetoEnv.NotReadyErr.make(); })(this), haystack.Ref.type$);
  }

}

class Tokenizer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#line = 1;
    this.#col = 1;
    this.#keepComments = true;
    this.#peekLine = 1;
    return;
  }

  typeof() { return Tokenizer.type$; }

  #tok = null;

  tok(it) {
    if (it === undefined) {
      return this.#tok;
    }
    else {
      this.#tok = it;
      return;
    }
  }

  #val = null;

  val(it) {
    if (it === undefined) {
      return this.#val;
    }
    else {
      this.#val = it;
      return;
    }
  }

  #refDis = null;

  refDis(it) {
    if (it === undefined) {
      return this.#refDis;
    }
    else {
      this.#refDis = it;
      return;
    }
  }

  #line = 0;

  line(it) {
    if (it === undefined) {
      return this.#line;
    }
    else {
      this.#line = it;
      return;
    }
  }

  #col = 0;

  col(it) {
    if (it === undefined) {
      return this.#col;
    }
    else {
      this.#col = it;
      return;
    }
  }

  #keepComments = false;

  keepComments(it) {
    if (it === undefined) {
      return this.#keepComments;
    }
    else {
      this.#keepComments = it;
      return;
    }
  }

  #buf = null;

  // private field reflection only
  __buf(it) { if (it === undefined) return this.#buf; else this.#buf = it; }

  #pos = 0;

  // private field reflection only
  __pos(it) { if (it === undefined) return this.#pos; else this.#pos = it; }

  #cur = 0;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #peek = 0;

  // private field reflection only
  __peek(it) { if (it === undefined) return this.#peek; else this.#peek = it; }

  #peekLine = 0;

  // private field reflection only
  __peekLine(it) { if (it === undefined) return this.#peekLine; else this.#peekLine = it; }

  #peekCol = 0;

  // private field reflection only
  __peekCol(it) { if (it === undefined) return this.#peekCol; else this.#peekCol = it; }

  #curLine = 0;

  // private field reflection only
  __curLine(it) { if (it === undefined) return this.#curLine; else this.#curLine = it; }

  #curCol = 0;

  // private field reflection only
  __curCol(it) { if (it === undefined) return this.#curCol; else this.#curCol = it; }

  static make(buf) {
    const $self = new Tokenizer();
    Tokenizer.make$($self,buf);
    return $self;
  }

  static make$($self,buf) {
    ;
    $self.#buf = buf;
    $self.#tok = Token.eof();
    $self.consume();
    $self.consume();
    return;
  }

  next() {
    this.#val = null;
    while (true) {
      this.skipSpaces();
      if (sys.ObjUtil.equals(this.#cur, 47)) {
        if ((sys.ObjUtil.equals(this.#peek, 47) && this.#keepComments)) {
          this.lockLoc();
          return ((this$) => { let $_u86 = this$.parseComment(); this$.#tok = $_u86; return $_u86; })(this);
        }
        ;
        if (sys.ObjUtil.equals(this.#peek, 47)) {
          this.skipCommentSL();
          continue;
        }
        ;
        if (sys.ObjUtil.equals(this.#peek, 42)) {
          this.skipCommentML();
          continue;
        }
        ;
      }
      ;
      break;
    }
    ;
    this.lockLoc();
    if ((sys.ObjUtil.equals(this.#cur, 10) || sys.ObjUtil.equals(this.#cur, 13))) {
      if ((sys.ObjUtil.equals(this.#cur, 13) && sys.ObjUtil.equals(this.#peek, 10))) {
        this.consume();
      }
      ;
      this.consume();
      return ((this$) => { let $_u87 = Token.nl(); this$.#tok = $_u87; return $_u87; })(this);
    }
    ;
    if (sys.Int.isAlpha(this.#cur)) {
      return ((this$) => { let $_u88 = this$.id(); this$.#tok = $_u88; return $_u88; })(this);
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 34)) {
      return ((this$) => { let $_u89 = this$.str(); this$.#tok = $_u89; return $_u89; })(this);
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 64)) {
      return ((this$) => { let $_u90 = this$.ref(); this$.#tok = $_u90; return $_u90; })(this);
    }
    ;
    if (sys.Int.isDigit(this.#cur)) {
      return ((this$) => { let $_u91 = this$.num(); this$.#tok = $_u91; return $_u91; })(this);
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 45)) {
      if (sys.Int.isDigit(this.#peek)) {
        return ((this$) => { let $_u92 = this$.num(); this$.#tok = $_u92; return $_u92; })(this);
      }
      ;
      if ((sys.ObjUtil.equals(this.#peek, 45) && sys.ObjUtil.equals(this.peekPeek(), 45))) {
        return ((this$) => { let $_u93 = this$.heredoc(); this$.#tok = $_u93; return $_u93; })(this);
      }
      ;
    }
    ;
    return ((this$) => { let $_u94 = this$.operator(); this$.#tok = $_u94; return $_u94; })(this);
  }

  skipSpaces() {
    while (Tokenizer.isSpace(this.#cur)) {
      this.consume();
    }
    ;
    return;
  }

  static isSpace(c) {
    return (sys.ObjUtil.equals(c, 32) || sys.ObjUtil.equals(c, 9) || sys.ObjUtil.equals(c, 160));
  }

  lockLoc() {
    this.#line = this.#curLine;
    this.#col = this.#curCol;
    return;
  }

  id() {
    let s = sys.StrBuf.make();
    while ((sys.Int.isAlphaNum(this.#cur) || sys.ObjUtil.equals(this.#cur, 95))) {
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    let id = s.toStr();
    this.#val = id;
    return Token.id();
  }

  str() {
    this.consume();
    let isTriple = (sys.ObjUtil.equals(this.#cur, 34) && sys.ObjUtil.equals(this.#peek, 34));
    if (isTriple) {
      this.consume();
      this.consume();
    }
    ;
    let lines = ((this$) => { if (isTriple) return sys.List.make(sys.Str.type$); return null; })(this);
    let s = sys.StrBuf.make();
    while (true) {
      let ch = this.#cur;
      if (sys.ObjUtil.equals(ch, 34)) {
        this.consume();
        if (isTriple) {
          if ((sys.ObjUtil.compareNE(this.#cur, 34) || sys.ObjUtil.compareNE(this.#peek, 34))) {
            s.addChar(34);
            continue;
          }
          ;
          this.consume();
          this.consume();
        }
        ;
        break;
      }
      ;
      if (sys.ObjUtil.equals(ch, 10)) {
        if (isTriple) {
          lines.add(s.toStr());
          (s = sys.StrBuf.make());
          this.consume();
          continue;
        }
        else {
          throw this.err("Expected newline in string literal");
        }
        ;
      }
      ;
      if (sys.ObjUtil.equals(ch, 0)) {
        throw this.err("Unexpected end of string literal");
      }
      ;
      if (sys.ObjUtil.equals(ch, 92)) {
        s.addChar(this.escape());
        continue;
      }
      ;
      this.consume();
      s.addChar(ch);
    }
    ;
    if (isTriple) {
      lines.add(s.toStr());
      this.#val = this.normTripleQuotedStr(sys.ObjUtil.coerce(lines, sys.Type.find("sys::Str[]")));
    }
    else {
      this.#val = s.toStr();
    }
    ;
    return Token.scalar();
  }

  normTripleQuotedStr(lines) {
    const this$ = this;
    if (lines.isEmpty()) {
      return "";
    }
    ;
    if (sys.ObjUtil.equals(lines.size(), 1)) {
      return lines.get(0);
    }
    ;
    let firstIsEmpty = sys.Str.trimToNull(lines.first()) == null;
    let lastIsEmpty = sys.Str.trimToNull(lines.last()) == null;
    let indent = sys.Int.maxVal();
    let size = sys.Str.size(lines.first());
    lines.eachRange(sys.Range.make(1, -1), (line) => {
      (indent = sys.Int.min(indent, this$.indention(line)));
      size = sys.Int.plus(size, sys.Int.plus(sys.Str.size(line), 1));
      return;
    });
    if (sys.ObjUtil.equals(indent, sys.Int.maxVal())) {
      (indent = 0);
    }
    ;
    if (lastIsEmpty) {
      (indent = sys.Int.min(indent, sys.Str.size(lines.get(-1))));
    }
    ;
    let s = sys.StrBuf.make(size);
    if (!firstIsEmpty) {
      s.add(lines.get(0)).addChar(10);
    }
    ;
    lines.eachRange(sys.Range.make(1, -2), (line) => {
      if (sys.ObjUtil.compareLE(sys.Str.size(line), indent)) {
        s.addChar(10);
      }
      else {
        s.add(sys.Str.getRange(line, sys.Range.make(indent, -1))).addChar(10);
      }
      ;
      return;
    });
    if (!lastIsEmpty) {
      s.add(sys.Str.getRange(lines.last(), sys.Range.make(indent, -1)));
    }
    ;
    return s.toStr();
  }

  indention(line) {
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(line)); i = sys.Int.increment(i)) {
      if (!sys.Int.isSpace(sys.Str.get(line, i))) {
        return i;
      }
      ;
    }
    ;
    return sys.Int.maxVal();
  }

  escape() {
    this.consume();
    let $_u96 = this.#cur;
    if (sys.ObjUtil.equals($_u96, 98)) {
      this.consume();
      return 8;
    }
    else if (sys.ObjUtil.equals($_u96, 102)) {
      this.consume();
      return 12;
    }
    else if (sys.ObjUtil.equals($_u96, 110)) {
      this.consume();
      return 10;
    }
    else if (sys.ObjUtil.equals($_u96, 114)) {
      this.consume();
      return 13;
    }
    else if (sys.ObjUtil.equals($_u96, 116)) {
      this.consume();
      return 9;
    }
    else if (sys.ObjUtil.equals($_u96, 34)) {
      this.consume();
      return 34;
    }
    else if (sys.ObjUtil.equals($_u96, 36)) {
      this.consume();
      return 36;
    }
    else if (sys.ObjUtil.equals($_u96, 39)) {
      this.consume();
      return 39;
    }
    else if (sys.ObjUtil.equals($_u96, 96)) {
      this.consume();
      return 96;
    }
    else if (sys.ObjUtil.equals($_u96, 92)) {
      this.consume();
      return 92;
    }
    ;
    if (sys.ObjUtil.equals(this.#cur, 117)) {
      this.consume();
      let n3 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n2 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n1 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      let n0 = sys.Int.fromDigit(this.#cur, 16);
      this.consume();
      if ((n3 == null || n2 == null || n1 == null || n0 == null)) {
        throw this.err("Invalid hex value for \\uxxxx");
      }
      ;
      return sys.Int.or(sys.Int.or(sys.Int.or(sys.Int.shiftl(sys.ObjUtil.coerce(n3, sys.Int.type$), 12), sys.Int.shiftl(sys.ObjUtil.coerce(n2, sys.Int.type$), 8)), sys.Int.shiftl(sys.ObjUtil.coerce(n1, sys.Int.type$), 4)), sys.ObjUtil.coerce(n0, sys.Int.type$));
    }
    ;
    throw this.err("Invalid escape sequence");
  }

  ref() {
    this.consume();
    let ref = this.refName();
    let dis = null;
    if ((sys.ObjUtil.equals(this.#cur, 32) && sys.ObjUtil.equals(this.#peek, 34))) {
      this.consume();
      this.str();
      (dis = this.#val);
    }
    ;
    this.#val = ref;
    this.#refDis = sys.ObjUtil.coerce(dis, sys.Str.type$.toNullable());
    return Token.ref();
  }

  refName() {
    let name = this.refSection();
    if ((sys.ObjUtil.compareNE(this.#cur, 46) && !(sys.ObjUtil.equals(this.#cur, 58) && sys.ObjUtil.equals(this.#peek, 58)))) {
      return ASimpleName.make(null, name);
    }
    ;
    let path = sys.List.make(sys.Str.type$);
    path.add(name);
    while (sys.ObjUtil.equals(this.#cur, 46)) {
      this.consume();
      path.add(this.refSection());
    }
    ;
    if (!(sys.ObjUtil.equals(this.#cur, 58) && sys.ObjUtil.equals(this.#peek, 58))) {
      return APathName.make(null, path);
    }
    ;
    this.consume();
    this.consume();
    let lib = path.join(".");
    (name = this.refSection());
    if (sys.ObjUtil.compareNE(this.#cur, 46)) {
      return ASimpleName.make(lib, name);
    }
    ;
    path.clear();
    path.add(name);
    while (sys.ObjUtil.equals(this.#cur, 46)) {
      this.consume();
      path.add(this.refSection());
    }
    ;
    return APathName.make(lib, path);
  }

  refSection() {
    let s = sys.StrBuf.make();
    while (Tokenizer.isRefChar(this.#cur, this.#peek)) {
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    if (s.isEmpty()) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting ref char, not ", sys.Int.toChar(this.#cur)), " [0x"), sys.Int.toHex(this.#cur)), "]"));
    }
    ;
    return s.toStr();
  }

  static isRefChar(cur,peek) {
    if (sys.Int.isAlphaNum(cur)) {
      return true;
    }
    ;
    if ((sys.ObjUtil.equals(cur, 95) || sys.ObjUtil.equals(cur, 126))) {
      return true;
    }
    ;
    if ((sys.ObjUtil.equals(cur, 58) || sys.ObjUtil.equals(cur, 45))) {
      return (sys.Int.isAlphaNum(peek) || sys.ObjUtil.equals(peek, 95) || sys.ObjUtil.equals(peek, 126));
    }
    ;
    return false;
  }

  num() {
    let s = sys.StrBuf.make();
    while (Tokenizer.isNum(this.#cur)) {
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    this.#val = s.toStr();
    return Token.scalar();
  }

  static isNum(c) {
    return (sys.Int.isAlphaNum(c) || sys.ObjUtil.equals(c, 45) || sys.ObjUtil.equals(c, 46) || sys.ObjUtil.equals(c, 36) || sys.ObjUtil.equals(c, 58) || sys.ObjUtil.equals(c, 47) || sys.ObjUtil.equals(c, 37) || sys.ObjUtil.compareGT(c, 128));
  }

  operator() {
    let c = this.#cur;
    this.consume();
    let $_u97 = c;
    if (sys.ObjUtil.equals($_u97, 44)) {
      return Token.comma();
    }
    else if (sys.ObjUtil.equals($_u97, 58)) {
      if (sys.ObjUtil.equals(this.#cur, 58)) {
        this.consume();
        return Token.doubleColon();
      }
      ;
      return Token.colon();
    }
    else if (sys.ObjUtil.equals($_u97, 91)) {
      return Token.lbracket();
    }
    else if (sys.ObjUtil.equals($_u97, 93)) {
      return Token.rbracket();
    }
    else if (sys.ObjUtil.equals($_u97, 123)) {
      return Token.lbrace();
    }
    else if (sys.ObjUtil.equals($_u97, 125)) {
      return Token.rbrace();
    }
    else if (sys.ObjUtil.equals($_u97, 60)) {
      return Token.lt();
    }
    else if (sys.ObjUtil.equals($_u97, 62)) {
      return Token.gt();
    }
    else if (sys.ObjUtil.equals($_u97, 46)) {
      return Token.dot();
    }
    else if (sys.ObjUtil.equals($_u97, 63)) {
      return Token.question();
    }
    else if (sys.ObjUtil.equals($_u97, 38)) {
      return Token.amp();
    }
    else if (sys.ObjUtil.equals($_u97, 124)) {
      return Token.pipe();
    }
    else if (sys.ObjUtil.equals($_u97, 0)) {
      return Token.eof();
    }
    ;
    if (sys.ObjUtil.equals(c, 0)) {
      return Token.eof();
    }
    ;
    throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unexpected symbol: ", sys.Str.toCode(sys.Int.toChar(c), sys.ObjUtil.coerce(39, sys.Int.type$.toNullable()))), " (0x"), sys.Int.toHex(c)), ")"));
  }

  heredoc() {
    let startCol = this.#curCol;
    this.consume();
    this.consume();
    this.consume();
    this.skipSpaces();
    if (!sys.Int.isAlpha(this.#cur)) {
      throw this.err("Expecting heredoc name");
    }
    ;
    this.id();
    let name = sys.ObjUtil.coerce(this.#val, sys.Str.type$);
    this.skipSpaces();
    if (sys.ObjUtil.compareNE(this.#cur, 10)) {
      throw this.err("Expecting newline after heredoc name");
    }
    ;
    let s = sys.StrBuf.make();
    let firstNewline = true;
    while (true) {
      if (sys.ObjUtil.equals(this.#cur, 0)) {
        throw this.err("Unexpected end of heredoc");
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 10)) {
        if (firstNewline) {
          (firstNewline = false);
        }
        else {
          s.add("\n");
        }
        ;
        this.consume();
        this.skipSpaces();
        if (sys.ObjUtil.equals(this.#cur, 10)) {
          continue;
        }
        ;
        if (sys.ObjUtil.compareLT(this.#curCol, startCol)) {
          throw this.err(sys.Str.plus("Heredoc must be aligned with column ", sys.ObjUtil.coerce(startCol, sys.Obj.type$.toNullable())));
        }
        ;
        if (sys.ObjUtil.compareGT(this.#curCol, startCol)) {
          s.add(sys.Str.spaces(sys.Int.minus(this.#curCol, startCol)));
        }
        ;
      }
      ;
      if ((sys.ObjUtil.equals(this.#cur, 45) && sys.ObjUtil.equals(this.#peek, 45) && sys.ObjUtil.equals(this.peekPeek(), 45))) {
        if (this.isHeredocEnd()) {
          this.consume();
          this.consume();
          this.consume();
        }
        ;
        break;
      }
      ;
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    if ((sys.ObjUtil.compareGT(s.size(), 0) && sys.ObjUtil.equals(s.get(-1), 10))) {
      s.remove(-1);
    }
    ;
    let val = s.toStr();
    this.#val = Heredoc.make(name, val);
    return Token.heredoc();
  }

  isHeredocEnd() {
    let i = sys.Int.plus(this.#pos, 1);
    while ((sys.ObjUtil.compareLT(i, sys.Str.size(this.#buf)) && Tokenizer.isSpace(sys.Str.get(this.#buf, i)))) {
      i = sys.Int.increment(i);
    }
    ;
    return (sys.ObjUtil.compareGE(i, sys.Str.size(this.#buf)) || sys.ObjUtil.equals(sys.Str.get(this.#buf, i), 10));
  }

  parseComment() {
    let s = sys.StrBuf.make();
    this.consume();
    this.consume();
    if (sys.ObjUtil.equals(this.#cur, 32)) {
      this.consume();
    }
    ;
    while (true) {
      if ((sys.ObjUtil.equals(this.#cur, 10) || sys.ObjUtil.equals(this.#cur, 0))) {
        break;
      }
      ;
      s.addChar(this.#cur);
      this.consume();
    }
    ;
    this.#val = s.toStr();
    return Token.comment();
  }

  skipCommentSL() {
    this.consume();
    this.consume();
    while (true) {
      if ((sys.ObjUtil.equals(this.#cur, 10) || sys.ObjUtil.equals(this.#cur, 0))) {
        break;
      }
      ;
      this.consume();
    }
    ;
    return;
  }

  skipCommentML() {
    this.consume();
    this.consume();
    let depth = 1;
    while (true) {
      if ((sys.ObjUtil.equals(this.#cur, 42) && sys.ObjUtil.equals(this.#peek, 47))) {
        this.consume();
        this.consume();
        ((this$) => { let $_u98 = depth;depth = sys.Int.decrement(depth); return $_u98; })(this);
        if (sys.ObjUtil.compareLE(depth, 0)) {
          break;
        }
        ;
      }
      ;
      if ((sys.ObjUtil.equals(this.#cur, 47) && sys.ObjUtil.equals(this.#peek, 42))) {
        this.consume();
        this.consume();
        ((this$) => { let $_u99 = depth;depth = sys.Int.increment(depth); return $_u99; })(this);
        continue;
      }
      ;
      if (sys.ObjUtil.equals(this.#cur, 0)) {
        break;
      }
      ;
      this.consume();
    }
    ;
    return;
  }

  err(msg) {
    this.#val = msg;
    return sys.ParseErr.make(msg);
  }

  peekPeek() {
    return ((this$) => { if (sys.ObjUtil.compareLT(this$.#pos, sys.Str.size(this$.#buf))) return sys.Str.get(this$.#buf, this$.#pos); return 0; })(this);
  }

  consume() {
    this.#cur = this.#peek;
    this.#curLine = this.#peekLine;
    this.#curCol = this.#peekCol;
    this.#peek = ((this$) => { if (sys.ObjUtil.compareLT(this$.#pos, sys.Str.size(this$.#buf))) return sys.Str.get(this$.#buf, this$.#pos); return 0; })(this);
    ((this$) => { let $_u102 = this$.#pos;this$.#pos = sys.Int.increment(this$.#pos); return $_u102; })(this);
    if (sys.ObjUtil.equals(this.#peek, 10)) {
      ((this$) => { let $_u103 = this$.#peekLine;this$.#peekLine = sys.Int.increment(this$.#peekLine); return $_u103; })(this);
      this.#peekCol = 0;
    }
    else {
      ((this$) => { let $_u104 = this$.#peekCol;this$.#peekCol = sys.Int.increment(this$.#peekCol); return $_u104; })(this);
    }
    ;
    return;
  }

}

class Parser extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Parser.type$; }

  #step = null;

  // private field reflection only
  __step(it) { if (it === undefined) return this.#step; else this.#step = it; }

  #compiler = null;

  // private field reflection only
  __compiler(it) { if (it === undefined) return this.#compiler; else this.#compiler = it; }

  #sys = null;

  // private field reflection only
  __sys(it) { if (it === undefined) return this.#sys; else this.#sys = it; }

  #fileLoc = null;

  // private field reflection only
  __fileLoc(it) { if (it === undefined) return this.#fileLoc; else this.#fileLoc = it; }

  #tokenizer = null;

  // private field reflection only
  __tokenizer(it) { if (it === undefined) return this.#tokenizer; else this.#tokenizer = it; }

  #autoNames = null;

  // private field reflection only
  __autoNames(it) { if (it === undefined) return this.#autoNames; else this.#autoNames = it; }

  #doc = null;

  // private field reflection only
  __doc(it) { if (it === undefined) return this.#doc; else this.#doc = it; }

  #libRef = null;

  // private field reflection only
  __libRef(it) { if (it === undefined) return this.#libRef; else this.#libRef = it; }

  #isDataFile = false;

  // private field reflection only
  __isDataFile(it) { if (it === undefined) return this.#isDataFile; else this.#isDataFile = it; }

  #cur = null;

  // private field reflection only
  __cur(it) { if (it === undefined) return this.#cur; else this.#cur = it; }

  #curVal = null;

  // private field reflection only
  __curVal(it) { if (it === undefined) return this.#curVal; else this.#curVal = it; }

  #curLine = 0;

  // private field reflection only
  __curLine(it) { if (it === undefined) return this.#curLine; else this.#curLine = it; }

  #curCol = 0;

  // private field reflection only
  __curCol(it) { if (it === undefined) return this.#curCol; else this.#curCol = it; }

  #peek = null;

  // private field reflection only
  __peek(it) { if (it === undefined) return this.#peek; else this.#peek = it; }

  #peekVal = null;

  // private field reflection only
  __peekVal(it) { if (it === undefined) return this.#peekVal; else this.#peekVal = it; }

  #peekLine = 0;

  // private field reflection only
  __peekLine(it) { if (it === undefined) return this.#peekLine; else this.#peekLine = it; }

  #peekCol = 0;

  // private field reflection only
  __peekCol(it) { if (it === undefined) return this.#peekCol; else this.#peekCol = it; }

  static make(step,fileLoc,fileStr,doc) {
    const $self = new Parser();
    Parser.make$($self,step,fileLoc,fileStr,doc);
    return $self;
  }

  static make$($self,step,fileLoc,fileStr,doc) {
    const this$ = $self;
    $self.#step = step;
    $self.#compiler = sys.ObjUtil.coerce(step.compiler(), XetoCompiler.type$);
    $self.#doc = doc;
    $self.#isDataFile = sys.ObjUtil.equals(doc.nodeType(), ANodeType.dataDoc());
    $self.#sys = step.sys();
    $self.#fileLoc = fileLoc;
    $self.#tokenizer = sys.ObjUtil.coerce(sys.ObjUtil.with(Tokenizer.make(fileStr), (it) => {
      it.keepComments(true);
      return;
    }), Tokenizer.type$);
    $self.#cur = ((this$) => { let $_u105 = Token.eof(); this$.#peek = $_u105; return $_u105; })($self);
    $self.consume();
    $self.consume();
    return;
  }

  parseFile() {
    try {
      if (sys.ObjUtil.equals(this.#doc.nodeType(), ANodeType.dataDoc())) {
        this.parseDataFile(sys.ObjUtil.coerce(this.#doc, ADataDoc.type$));
      }
      else {
        this.parseLibFile(sys.ObjUtil.coerce(this.#doc, ALib.type$));
      }
      ;
    }
    catch ($_u106) {
      $_u106 = sys.Err.make($_u106);
      if ($_u106 instanceof sys.ParseErr) {
        let e = $_u106;
        ;
        throw this.err(e.msg(), this.curToLoc());
      }
      else {
        throw $_u106;
      }
    }
    ;
    return;
  }

  parseDataFile(doc) {
    this.skipNewlines();
    let data = this.parseTopData();
    doc.root(data);
    this.skipNewlines();
    if (this.#cur === Token.eof()) {
      return;
    }
    ;
    let list = ADict.make(data.loc(), this.#sys.list());
    list.listOf(xeto.Dict.type$);
    doc.root(list);
    this.addDataDict(list, data);
    while (this.#cur !== Token.eof()) {
      this.addDataDict(list, this.parseTopData());
      this.skipNewlines();
    }
    ;
    return;
  }

  parseLibFile(lib) {
    this.#libRef = lib;
    while (true) {
      if (!this.parseLibObj()) {
        break;
      }
      ;
    }
    ;
    this.verify(Token.eof());
    return;
  }

  lib() {
    return sys.ObjUtil.coerce(((this$) => { let $_u107 = this$.#libRef; if ($_u107 != null) return $_u107; throw this$.err("Lib not available in data file"); })(this), ALib.type$);
  }

  parseLibObj() {
    let doc = this.parseLeadingDoc();
    if (this.#cur === Token.eof()) {
      return false;
    }
    ;
    if (this.#cur === Token.id()) {
      return this.parseLibSpec(doc);
    }
    ;
    if (this.#cur === Token.ref()) {
      return this.parseLibData();
    }
    ;
    throw this.err(sys.Str.plus("Expecting instance data or spec, not ", this.curToStr()));
  }

  parseLibSpec(doc) {
    let spec = this.parseNamedSpec(null, doc);
    this.parseLibObjEnd("spec");
    this.add("spec", this.lib().tops(), spec.name(), spec);
    return true;
  }

  parseLibData() {
    let data = this.parseNamedData();
    this.parseLibObjEnd("instance");
    return true;
  }

  parseLibObjEnd(obj) {
    if (this.#cur === Token.eof()) {
      return;
    }
    ;
    if (this.#cur !== Token.nl()) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting newline after lib ", obj), ", not "), this.curToStr()));
    }
    ;
    this.skipNewlines();
    return;
  }

  parseNamedSpec(parent,doc) {
    let name = this.consumeName("Expecting spec name");
    if (this.#cur !== Token.colon()) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Spec name '", name), "' must be followed by colon, not "), this.curToStr()));
    }
    ;
    this.consume();
    return this.parseSpec(parent, doc, name);
  }

  parseSpec(parent,doc,name) {
    let spec = ASpec.make(this.curToLoc(), this.lib(), parent, name);
    this.parseSpecType(spec);
    this.parseSpecMeta(spec);
    this.parseSpecBody(spec);
    (doc = this.parseTrailingDoc(doc));
    if (doc != null) {
      spec.metaSetStr("doc", sys.ObjUtil.coerce(doc, sys.Str.type$));
    }
    ;
    this.parseSpecHeredocs(spec);
    return spec;
  }

  parseDataSpec(typeRef) {
    if ((this.#cur !== Token.lt() && this.#cur !== Token.pipe() && this.#cur !== Token.amp() && this.#cur !== Token.question())) {
      return typeRef;
    }
    ;
    let loc = typeRef.loc();
    if (this.#libRef == null) {
      throw this.err("Cannot use nested spec in data file", loc);
    }
    ;
    let spec = ASpec.make(loc, this.lib(), null, this.lib().autoName());
    spec.parsedSyntheticRef(true);
    this.parseSpecType(spec, typeRef);
    this.parseSpecMeta(spec);
    this.parseSpecBody(spec);
    this.add("spec", this.lib().tops(), spec.name(), spec);
    return ASpecRef.makeResolved(loc, spec);
  }

  parseMarkerSpec(parent,doc) {
    let loc = this.curToLoc();
    let name = this.consumeName("Expecting marker name");
    let spec = ASpec.make(loc, parent.lib(), parent, name);
    let marker = this.#sys.markerScalar(loc);
    spec.typeRef(marker.typeRef());
    this.parseSpecMeta(spec);
    (doc = this.parseTrailingDoc(doc));
    if (doc != null) {
      spec.metaSetStr("doc", sys.ObjUtil.coerce(doc, sys.Str.type$));
    }
    ;
    return spec;
  }

  parseSpecType(spec,typeRef) {
    if (typeRef === undefined) typeRef = null;
    if (typeRef == null) {
      spec.typeRef(this.parseTypeRef());
      if (spec.typeRef() == null) {
        return;
      }
      ;
    }
    else {
      spec.typeRef(typeRef);
    }
    ;
    if (this.#cur === Token.question()) {
      this.consume();
      spec.metaSetMarker("maybe");
      return;
    }
    ;
    if (this.#cur === Token.amp()) {
      return this.parseCompoundType(spec, this.#sys.and());
    }
    ;
    if (this.#cur === Token.pipe()) {
      return this.parseCompoundType(spec, this.#sys.or());
    }
    ;
    return;
  }

  parseCompoundType(spec,compoundType) {
    let list = sys.List.make(ASpecRef.type$);
    list.add(sys.ObjUtil.coerce(spec.typeRef(), ASpecRef.type$));
    let separator = this.#cur;
    while (this.#cur === separator) {
      this.consume();
      let next = ((this$) => { let $_u108 = this$.parseTypeRef(); if ($_u108 != null) return $_u108; throw this$.err(sys.Str.plus("Expecting next type name in ", compoundType.name())); })(this);
      list.add(sys.ObjUtil.coerce(next, ASpecRef.type$));
    }
    ;
    spec.parsedCompound(true);
    spec.typeRef(compoundType);
    spec.metaSetOfs("ofs", list);
    return;
  }

  parseSpecMeta(spec) {
    if (this.#cur === Token.lt()) {
      if ((spec.typeRef() == null && !spec.isObj())) {
        throw this.err("Cannot have <> meta without type name");
      }
      ;
      this.parseDict(null, Token.lt(), Token.gt(), spec.metaInit());
    }
    ;
    return;
  }

  parseSpecBody(spec) {
    if (this.#cur === Token.scalar()) {
      spec.val(this.parseScalar(null));
      return;
    }
    ;
    if (this.#cur === Token.lbrace()) {
      this.parseSpecSlots(spec);
      return;
    }
    ;
    if ((spec.typeRef() == null && !spec.isObj())) {
      throw this.err(sys.Str.plus("Expected spec body, not ", this.curToStr()));
    }
    ;
    return;
  }

  parseSpecSlots(parent) {
    let acc = parent.initSlots();
    this.consume(Token.lbrace());
    this.skipNewlines();
    while (this.#cur !== Token.rbrace()) {
      let doc = this.parseLeadingDoc();
      if (this.#cur === Token.rbrace()) {
        break;
      }
      ;
      let slot = null;
      if ((this.#cur === Token.id() && sys.ObjUtil.equals(this.#peek, Token.colon()))) {
        (slot = this.parseNamedSpec(parent, doc));
      }
      else {
        if (this.isCurMarkerSpec()) {
          (slot = this.parseMarkerSpec(parent, doc));
        }
        else {
          let name = this.autoName(acc);
          (slot = this.parseSpec(parent, doc, name));
        }
        ;
      }
      ;
      this.parseCommaOrNewline("Expecting end of slots", Token.rbrace());
      this.add("slot", acc, slot.name(), sys.ObjUtil.coerce(slot, ANode.type$));
    }
    ;
    this.consume(Token.rbrace());
    return acc;
  }

  isCurMarkerSpec() {
    if (this.#cur !== Token.id()) {
      return false;
    }
    ;
    if (!sys.Int.isLower(sys.Str.get(sys.ObjUtil.toStr(this.#curVal), 0))) {
      return false;
    }
    ;
    if (this.#peek === Token.dot()) {
      return false;
    }
    ;
    if (this.#peek === Token.doubleColon()) {
      return false;
    }
    ;
    return true;
  }

  parseSpecHeredocs(spec) {
    if ((this.#cur === Token.nl() && this.#peek === Token.heredoc())) {
      this.consume();
      while (this.#cur === Token.heredoc()) {
        let heredoc = sys.ObjUtil.coerce(this.#curVal, Heredoc.type$);
        this.consume();
        spec.metaSetStr(heredoc.name(), heredoc.val());
      }
      ;
    }
    ;
    return;
  }

  parseTopData() {
    if ((this.#cur === Token.ref() && this.#peek === Token.colon())) {
      return this.parseNamedData();
    }
    else {
      return this.parseData();
    }
    ;
  }

  parseNamedData(isNested) {
    if (isNested === undefined) isNested = false;
    let name = sys.ObjUtil.coerce(this.#curVal, AName.type$);
    this.consume(Token.ref());
    if (this.#cur !== Token.colon()) {
      throw this.err(sys.Str.plus("Expecting colon after instance id, not ", this.curToStr()));
    }
    ;
    this.consume();
    let type = this.parseTypeRef();
    let dict = AInstance.make(this.curToLoc(), type, name, isNested);
    if (this.#cur !== Token.lbrace()) {
      throw this.err("Expecting '{' to start named instance dict");
    }
    ;
    this.parseDict(type, Token.lbrace(), Token.rbrace(), dict);
    if (name.isQualified()) {
      throw this.err(sys.Str.plus("Cannot specify qualified id for instance id: ", name), dict.loc());
    }
    ;
    let id = sys.ObjUtil.toStr(name);
    this.add("instance", this.#doc.instances(), id, dict);
    return dict;
  }

  parseData() {
    if (this.#cur === Token.ref()) {
      return this.parseDataRef();
    }
    ;
    let type = this.parseTypeRef();
    if (this.#cur === Token.scalar()) {
      return this.parseScalar(type);
    }
    ;
    if (this.#cur === Token.lbrace()) {
      return this.parseDict(type, Token.lbrace(), Token.rbrace(), null);
    }
    ;
    if (type != null) {
      return this.parseDataSpec(sys.ObjUtil.coerce(type, ASpecRef.type$));
    }
    ;
    throw this.err(sys.Str.plus("Expecting data value, not ", this.curToStr()));
  }

  parseDataRef() {
    let loc = this.curToLoc();
    let name = sys.ObjUtil.coerce(this.#curVal, AName.type$);
    this.consume();
    return ADataRef.make(loc, name, this.#tokenizer.refDis());
  }

  parseScalar(type) {
    let x = AScalar.make(this.curToLoc(), type, sys.ObjUtil.coerce(this.#curVal, sys.Str.type$));
    this.consume();
    return x;
  }

  parseDict(type,openToken,closeToken,x) {
    if (x == null) {
      (x = ADict.make(this.curToLoc(), type));
    }
    ;
    this.consume(openToken);
    this.skipNewlines();
    while (this.#cur !== closeToken) {
      this.skipComments();
      let loc = this.curToLoc();
      let name = null;
      let val = null;
      if (this.curIsDictSlotName()) {
        (name = this.consumeName("Expecting dict tag name"));
        if ((this.#cur === Token.ref() && this.#peek === Token.colon())) {
          (val = this.parseNamedData(true));
        }
        else {
          if (this.#cur !== Token.colon()) {
            (val = this.#sys.markerScalar(loc));
          }
          else {
            this.consume();
            (val = this.parseData());
          }
          ;
        }
        ;
      }
      else {
        if ((this.#cur === Token.ref() && this.#peek === Token.colon())) {
          (name = this.autoName(x.map()));
          (val = this.parseNamedData(true));
        }
        else {
          if (this.#cur === Token.heredoc()) {
            this.parseDictHeredocs(sys.ObjUtil.coerce(x, ADict.type$));
            continue;
          }
          else {
            (name = this.autoName(x.map()));
            (val = this.parseData());
          }
          ;
        }
        ;
      }
      ;
      this.add("name", x.map(), sys.ObjUtil.coerce(name, sys.Str.type$), sys.ObjUtil.coerce(val, ANode.type$));
      if ((sys.ObjUtil.equals(name, "meta") && x.isSpecMeta())) {
        sys.ObjUtil.coerce(x.metaParent(), ASpec.type$).flavor(xeto.SpecFlavor.meta());
      }
      ;
      this.parseCommaOrNewline("Expecting end of dict tag", closeToken);
    }
    ;
    this.consume(closeToken);
    return sys.ObjUtil.coerce(x, ADict.type$);
  }

  curIsDictSlotName() {
    return (this.#cur === Token.id() && sys.Int.isLower(sys.Str.get(sys.ObjUtil.toStr(this.#curVal), 0)) && this.#peek !== Token.doubleColon() && this.#peek !== Token.dot());
  }

  parseDictHeredocs(x) {
    while (this.#cur === Token.heredoc()) {
      let heredoc = sys.ObjUtil.coerce(this.#curVal, Heredoc.type$);
      let val = AScalar.make(this.curToLoc(), this.#sys.str(), heredoc.val(), heredoc.val());
      this.consume();
      this.add("name", x.map(), heredoc.name(), val);
    }
    ;
    this.consume(Token.nl());
    return;
  }

  parseTypeRef() {
    if (this.#cur !== Token.id()) {
      return null;
    }
    ;
    let loc = this.curToLoc();
    let name = this.parseTypeRefName();
    return ASpecRef.make(loc, name);
  }

  parseTypeRefName() {
    let name = this.consumeName("Expecting type name");
    if ((this.#cur !== Token.dot() && this.#cur !== Token.doubleColon())) {
      return ASimpleName.make(null, name);
    }
    ;
    let path = sys.List.make(sys.Str.type$);
    path.add(name);
    while (this.#cur === Token.dot()) {
      this.consume();
      path.add(this.consumeName("Expecting next name in dotted type name"));
    }
    ;
    if (this.#cur !== Token.doubleColon()) {
      return APathName.make(null, path);
    }
    ;
    this.consume();
    let lib = path.join(".");
    if (this.#cur !== Token.id()) {
      throw this.err("Expecting type name after double colon");
    }
    ;
    (name = this.consumeName("Expecting type name after double colon"));
    if (this.#cur !== Token.dot()) {
      return ASimpleName.make(lib, name);
    }
    ;
    path.clear();
    path.add(name);
    while (this.#cur === Token.dot()) {
      this.consume();
      path.add(this.consumeName("Expecting next name in dotted type name"));
    }
    ;
    return APathName.make(lib, path);
  }

  parseCommaOrNewline(msg,close) {
    if (this.#cur === Token.comma()) {
      this.consume();
      this.skipNewlines();
      return;
    }
    ;
    if (this.#cur === Token.nl()) {
      this.skipNewlines();
      return;
    }
    ;
    if (this.#cur === close) {
      return;
    }
    ;
    throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), ": comma or newline, not "), this.curToStr()));
  }

  parseLeadingDoc() {
    let doc = null;
    while (true) {
      this.skipNewlines();
      if (this.#cur !== Token.comment()) {
        return null;
      }
      ;
      let s = sys.StrBuf.make();
      while (this.#cur === Token.comment()) {
        s.join(sys.ObjUtil.toStr(this.#curVal), "\n");
        this.consume();
        this.consume(Token.nl());
      }
      ;
      if (this.#cur === Token.nl()) {
        continue;
      }
      ;
      (doc = sys.Str.trimToNull(s.toStr()));
      break;
    }
    ;
    return doc;
  }

  parseTrailingDoc(doc) {
    if (this.#cur === Token.comment()) {
      if (doc == null) {
        (doc = sys.Str.trimToNull(sys.ObjUtil.toStr(this.#curVal)));
      }
      ;
      this.consume();
    }
    ;
    return doc;
  }

  addDataDict(list,data) {
    if ((data.nodeType() !== ANodeType.instance() && data.nodeType() !== ANodeType.dict())) {
      throw this.err("Data file can only contain one scalar", data.loc());
    }
    ;
    list.map().set(this.#compiler.autoName(list.map().size()), data);
    return;
  }

  add(what,map,name,val) {
    let dup = map.get(name);
    if (dup != null) {
      this.#compiler.err2(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Duplicate ", what), " '"), name), "'"), dup.loc(), val.loc());
    }
    else {
      map.add(name, val);
    }
    ;
    return;
  }

  autoName(map) {
    for (let i = 0; sys.ObjUtil.compareLT(i, 1000000); i = sys.Int.increment(i)) {
      let name = this.#compiler.autoName(i);
      if (map.get(name) == null) {
        return name;
      }
      ;
    }
    ;
    throw sys.Err.make("Too many children");
  }

  skipComments() {
    while ((this.#cur === Token.comment() || this.#cur === Token.nl())) {
      this.consume();
    }
    ;
    return;
  }

  skipNewlines() {
    if (this.#cur !== Token.nl()) {
      return false;
    }
    ;
    while (this.#cur === Token.nl()) {
      this.consume();
    }
    ;
    return true;
  }

  verify(expected) {
    if (this.#cur !== expected) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expected ", expected), " not "), this.curToStr()));
    }
    ;
    return;
  }

  curToLoc() {
    return util.FileLoc.make(this.#fileLoc.file(), this.#curLine, this.#curCol);
  }

  curToStr() {
    return ((this$) => { if (this$.#curVal != null) return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#cur), " "), sys.Str.toCode(sys.ObjUtil.toStr(this$.#curVal))); return this$.#cur.toStr(); })(this);
  }

  consumeName(expecting) {
    if (this.#cur !== Token.id()) {
      throw this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("", expecting), ", not "), this.curToStr()));
    }
    ;
    let name = sys.ObjUtil.toStr(this.#curVal);
    this.consume();
    return name;
  }

  consumeVal() {
    this.verify(Token.scalar());
    let val = this.#curVal;
    this.consume();
    return sys.ObjUtil.coerce(val, sys.Str.type$);
  }

  consume(expected) {
    if (expected === undefined) expected = null;
    if (expected != null) {
      this.verify(sys.ObjUtil.coerce(expected, Token.type$));
    }
    ;
    this.doConsume();
    while ((this.#isDataFile && this.#cur === Token.comment())) {
      this.doConsume();
    }
    ;
    return;
  }

  doConsume() {
    this.#cur = this.#peek;
    this.#curVal = this.#peekVal;
    this.#curLine = this.#peekLine;
    this.#curCol = this.#peekCol;
    this.#peek = this.#tokenizer.next();
    this.#peekVal = this.#tokenizer.val();
    this.#peekLine = this.#tokenizer.line();
    this.#peekCol = this.#tokenizer.col();
    return;
  }

  err(msg,loc) {
    if (loc === undefined) loc = this.curToLoc();
    return util.FileLocErr.make(msg, loc);
  }

}

class Token extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Token.type$; }

  static id() { return Token.vals().get(0); }

  static ref() { return Token.vals().get(1); }

  static scalar() { return Token.vals().get(2); }

  static dot() { return Token.vals().get(3); }

  static colon() { return Token.vals().get(4); }

  static doubleColon() { return Token.vals().get(5); }

  static comma() { return Token.vals().get(6); }

  static lt() { return Token.vals().get(7); }

  static gt() { return Token.vals().get(8); }

  static lbrace() { return Token.vals().get(9); }

  static rbrace() { return Token.vals().get(10); }

  static lparen() { return Token.vals().get(11); }

  static rparen() { return Token.vals().get(12); }

  static lbracket() { return Token.vals().get(13); }

  static rbracket() { return Token.vals().get(14); }

  static question() { return Token.vals().get(15); }

  static amp() { return Token.vals().get(16); }

  static pipe() { return Token.vals().get(17); }

  static heredoc() { return Token.vals().get(18); }

  static nl() { return Token.vals().get(19); }

  static comment() { return Token.vals().get(20); }

  static eof() { return Token.vals().get(21); }

  static #vals = undefined;

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  static make($ordinal,$name,dis) {
    const $self = new Token();
    Token.make$($self,$ordinal,$name,dis);
    return $self;
  }

  static make$($self,$ordinal,$name,dis) {
    sys.Enum.make$($self, $ordinal, $name);
    $self.#symbol = dis;
    $self.#dis = ((this$) => { if (sys.ObjUtil.compareLE(sys.Str.size(dis), 2)) return sys.Str.plus(sys.Str.plus(sys.Str.plus("'", dis), "' "), this$.name()); return dis; })($self);
    return;
  }

  toStr() {
    return this.#dis;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Token.type$, Token.vals(), name$, checked);
  }

  static vals() {
    if (Token.#vals == null) {
      Token.#vals = sys.List.make(Token.type$, [
        Token.make(0, "id", "name"),
        Token.make(1, "ref", "ref"),
        Token.make(2, "scalar", "scalar"),
        Token.make(3, "dot", "."),
        Token.make(4, "colon", ":"),
        Token.make(5, "doubleColon", "::"),
        Token.make(6, "comma", ","),
        Token.make(7, "lt", "<"),
        Token.make(8, "gt", ">"),
        Token.make(9, "lbrace", "{"),
        Token.make(10, "rbrace", "}"),
        Token.make(11, "lparen", "("),
        Token.make(12, "rparen", ")"),
        Token.make(13, "lbracket", "["),
        Token.make(14, "rbracket", "]"),
        Token.make(15, "question", "?"),
        Token.make(16, "amp", "&"),
        Token.make(17, "pipe", "|"),
        Token.make(18, "heredoc", "---"),
        Token.make(19, "nl", "newline"),
        Token.make(20, "comment", "comment"),
        Token.make(21, "eof", "eof"),
      ]).toImmutable();
    }
    return Token.#vals;
  }

  static static$init() {
    const $_u111 = Token.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Heredoc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Heredoc.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(n,v) {
    const $self = new Heredoc();
    Heredoc.make$($self,n,v);
    return $self;
  }

  static make$($self,n,v) {
    $self.#name = n;
    $self.#val = v;
    return;
  }

  toStr() {
    return sys.Str.plus("Heredoc ", this.#name);
  }

}

const p = sys.Pod.add$('xetoc');
const xp = sys.Param.noParams$();
let m;
LocalNamespace.type$ = p.at$('LocalNamespace','xetoEnv::MNamespace',[],{},8194,LocalNamespace);
FileRepoScanner.type$ = p.at$('FileRepoScanner','sys::Obj',[],{},128,FileRepoScanner);
FileRepoScan.type$ = p.at$('FileRepoScan','sys::Obj',[],{},130,FileRepoScan);
FileRepo.type$ = p.at$('FileRepo','sys::Obj',['xeto::LibRepo'],{},8194,FileRepo);
FileLibVersion.type$ = p.at$('FileLibVersion','sys::Obj',['xeto::LibVersion'],{},8194,FileLibVersion);
Step.type$ = p.at$('Step','sys::Obj',[],{},129,Step);
LoadBindings.type$ = p.at$('LoadBindings','xetoc::Step',[],{},128,LoadBindings);
InheritSlots.type$ = p.at$('InheritSlots','xetoc::Step',[],{},128,InheritSlots);
OutputZip.type$ = p.at$('OutputZip','xetoc::Step',[],{},128,OutputZip);
CheckErrors.type$ = p.at$('CheckErrors','xetoc::Step',[],{},128,CheckErrors);
InferData.type$ = p.at$('InferData','xetoc::Step',[],{},129,InferData);
InferMeta.type$ = p.at$('InferMeta','xetoc::InferData',[],{},128,InferMeta);
InferInstances.type$ = p.at$('InferInstances','xetoc::InferData',[],{},128,InferInstances);
Parse.type$ = p.at$('Parse','xetoc::Step',[],{},128,Parse);
ProcessPragma.type$ = p.at$('ProcessPragma','xetoc::Step',[],{},128,ProcessPragma);
Resolve.type$ = p.at$('Resolve','xetoc::Step',[],{},128,Resolve);
Reify.type$ = p.at$('Reify','xetoc::Step',[],{},129,Reify);
ReifyMeta.type$ = p.at$('ReifyMeta','xetoc::Reify',[],{},128,ReifyMeta);
ReifyInstances.type$ = p.at$('ReifyInstances','xetoc::Reify',[],{},128,ReifyInstances);
Assemble.type$ = p.at$('Assemble','xetoc::Step',[],{},128,Assemble);
Init.type$ = p.at$('Init','xetoc::Step',[],{},129,Init);
InitLib.type$ = p.at$('InitLib','xetoc::Init',[],{},128,InitLib);
InitLibVersion.type$ = p.at$('InitLibVersion','xetoc::InitLib',[],{},128,InitLibVersion);
InitData.type$ = p.at$('InitData','xetoc::Init',[],{},128,InitData);
InheritMeta.type$ = p.at$('InheritMeta','xetoc::Step',[],{},128,InheritMeta);
XetoCompiler.type$ = p.at$('XetoCompiler','sys::Obj',[],{},128,XetoCompiler);
ANode.type$ = p.at$('ANode','sys::Obj',[],{},129,ANode);
ASpec.type$ = p.at$('ASpec','xetoc::ANode',['xetoEnv::CSpec'],{},128,ASpec);
CInstance.type$ = p.am$('CInstance','sys::Obj',['xetoEnv::CNode'],{},385,CInstance);
CInstanceWrap.type$ = p.at$('CInstanceWrap','sys::Obj',['xetoc::CInstance'],{},130,CInstanceWrap);
ADoc.type$ = p.at$('ADoc','xetoc::ANode',[],{},129,ADoc);
ADataDoc.type$ = p.at$('ADataDoc','xetoc::ADoc',[],{},128,ADataDoc);
ASys.type$ = p.at$('ASys','sys::Obj',[],{},128,ASys);
AName.type$ = p.at$('AName','sys::Obj',[],{},131,AName);
ASimpleName.type$ = p.at$('ASimpleName','xetoc::AName',[],{},130,ASimpleName);
APathName.type$ = p.at$('APathName','xetoc::AName',[],{},130,APathName);
AData.type$ = p.at$('AData','xetoc::ANode',[],{},129,AData);
ARef.type$ = p.at$('ARef','xetoc::AData',[],{},129,ARef);
ASpecRef.type$ = p.at$('ASpecRef','xetoc::ARef',[],{},128,ASpecRef);
ADataRef.type$ = p.at$('ADataRef','xetoc::ARef',[],{},128,ADataRef);
ADepends.type$ = p.at$('ADepends','sys::Obj',[],{},128,ADepends);
ALib.type$ = p.at$('ALib','xetoc::ADoc',[],{},128,ALib);
ANodeType.type$ = p.at$('ANodeType','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,ANodeType);
ANamespace.type$ = p.at$('ANamespace','sys::Obj',['xetoEnv::CNamespace'],{},128,ANamespace);
AScalar.type$ = p.at$('AScalar','xetoc::AData',[],{},128,AScalar);
ADict.type$ = p.at$('ADict','xetoc::AData',[],{},128,ADict);
AInstance.type$ = p.at$('AInstance','xetoc::ADict',['xetoc::CInstance'],{},128,AInstance);
Tokenizer.type$ = p.at$('Tokenizer','sys::Obj',[],{},128,Tokenizer);
Parser.type$ = p.at$('Parser','sys::Obj',[],{},128,Parser);
Token.type$ = p.at$('Token','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,Token);
Heredoc.type$ = p.at$('Heredoc','sys::Obj',[],{},130,Heredoc);
LocalNamespace.type$.af$('repo',73730,'xeto::LibRepo',{}).af$('build',73730,'[sys::Str:sys::File]?',{}).af$('compileCount',67586,'concurrent::AtomicInt',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('base','xetoEnv::MNamespace?',false),new sys.Param('names','xeto::NameTable',false),new sys.Param('versions','xeto::LibVersion[]',false),new sys.Param('repo','xeto::LibRepo',false),new sys.Param('build','[sys::Str:sys::File]?',false)]),{}).am$('isRemote',271360,'sys::Bool',xp,{}).am$('doLoadSync',271360,'xetoEnv::XetoLib',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false)]),{}).am$('doLoadAsync',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('version','xeto::LibVersion',false),new sys.Param('f','|sys::Err?,sys::Obj?->sys::Void|',false)]),{}).am$('compileLib',271360,'xeto::Lib',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('compileData',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('opts','xeto::Dict?',true)]),{});
FileRepoScanner.type$.af$('log',67584,'sys::Log',{}).af$('names',67584,'xeto::NameTable',{}).af$('path',67584,'sys::File[]',{}).af$('acc',67584,'[sys::Str:xetoc::FileLibVersion[]]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('log','sys::Log',false),new sys.Param('names','xeto::NameTable',false),new sys.Param('path','sys::File[]',false)]),{}).am$('scan',8192,'xetoc::FileRepoScan',xp,{}).am$('scanZips',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pathDir','sys::File',false),new sys.Param('libXetoDir','sys::File',false)]),{}).am$('scanZipLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false)]),{}).am$('scanSrcs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pathDir','sys::File',false),new sys.Param('srcXetoDir','sys::File',false)]),{}).am$('scanSrcLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pathDir','sys::File',false),new sys.Param('srcDir','sys::File',false),new sys.Param('lib','sys::File',false)]),{}).am$('parseSrcVersion',2048,'xetoc::FileLibVersion?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('lib','sys::File',false)]),{}).am$('add',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoc::FileLibVersion',false)]),{});
FileRepoScan.type$.af$('list',73730,'sys::Str[]',{}).af$('map',73730,'[sys::Str:xetoc::FileLibVersion[]]',{}).af$('ts',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:xetoc::FileLibVersion[]]',false)]),{});
FileRepo.type$.af$('names',73730,'xeto::NameTable',{}).af$('log',73730,'sys::Log',{}).af$('env',73730,'xeto::XetoEnv',{}).af$('scanRef',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','xeto::XetoEnv',true)]),{}).am$('scan',128,'xetoc::FileRepoScan',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('rescan',271360,'sys::This',xp,{}).am$('libs',271360,'sys::Str[]',xp,{}).am$('versions',271360,'xeto::LibVersion[]?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('latest',271360,'xeto::LibVersion?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('latestMatch',271360,'xeto::LibVersion?',sys.List.make(sys.Param.type$,[new sys.Param('d','xeto::LibDepend',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('version',271360,'xeto::LibVersion?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('version','sys::Version',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('solveDepends',271360,'xeto::LibVersion[]',sys.List.make(sys.Param.type$,[new sys.Param('libs','xeto::LibDepend[]',false)]),{}).am$('createNamespace',271360,'xeto::LibNamespace',sys.List.make(sys.Param.type$,[new sys.Param('libs','xeto::LibVersion[]',false)]),{}).am$('createOverlayNamespace',271360,'xeto::LibNamespace',sys.List.make(sys.Param.type$,[new sys.Param('base','xeto::LibNamespace',false),new sys.Param('libs','xeto::LibVersion[]',false)]),{}).am$('build',271360,'xeto::LibNamespace',sys.List.make(sys.Param.type$,[new sys.Param('build','xeto::LibVersion[]',false)]),{}).am$('createFromData',271360,'xeto::LibNamespace',sys.List.make(sys.Param.type$,[new sys.Param('recs','xeto::Dict[]',false)]),{});
FileLibVersion.type$.af$('name',336898,'sys::Str',{}).af$('version',336898,'sys::Version',{}).af$('docRef',67586,'sys::Str?',{}).af$('fileRef',73730,'sys::File',{}).af$('dependsRef',67586,'xeto::LibDepend[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('version','sys::Version',false),new sys.Param('file','sys::File',false),new sys.Param('doc','sys::Str?',false),new sys.Param('depends','xeto::LibDepend[]?',false)]),{}).am$('makeFile',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('doc',271360,'sys::Str',xp,{}).am$('file',271360,'sys::File?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('isSrc',271360,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('depends',271360,'xeto::LibDepend[]',xp,{}).am$('loadMeta',2048,'sys::Void',xp,{}).am$('parseMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::File',false)]),{}).am$('parseDepend',34818,'xeto::LibDepend',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{});
Step.type$.af$('compiler',73728,'xetoc::XetoCompiler?',{}).am$('run',270337,'sys::Void',xp,{}).am$('ns',8192,'xetoEnv::MNamespace?',xp,{}).am$('cns',8192,'xetoc::ANamespace',xp,{}).am$('names',8192,'xeto::NameTable',xp,{}).am$('isLib',8192,'sys::Bool',xp,{}).am$('isData',8192,'sys::Bool',xp,{}).am$('isSys',8192,'sys::Bool',xp,{}).am$('isSysComp',8192,'sys::Bool',xp,{}).am$('sys',8192,'xetoc::ASys',xp,{}).am$('depends',8192,'xetoc::ADepends',xp,{}).am$('ast',8192,'xetoc::ADoc',xp,{}).am$('data',8192,'xetoc::ADataDoc',xp,{}).am$('lib',8192,'xetoc::ALib',xp,{}).am$('pragma',8192,'xetoc::ADict?',xp,{}).am$('info',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('err',8192,'xetoEnv::XetoCompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('err','sys::Err?',true)]),{}).am$('errSlot',8192,'xetoEnv::XetoCompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('slot','xetoEnv::CSpec?',false),new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('err','sys::Err?',true)]),{}).am$('err2',8192,'xetoEnv::XetoCompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc1','util::FileLoc',false),new sys.Param('loc2','util::FileLoc',false),new sys.Param('err','sys::Err?',true)]),{}).am$('bombIfErr',8192,'sys::Void',xp,{}).am$('isObj',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('s','xetoEnv::CSpec',false)]),{}).am$('strScalar',8192,'xetoc::AScalar',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('str','sys::Str',false)]),{}).am$('dirList',8192,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false)]),{}).am$('make',139268,'sys::Void',xp,{});
LoadBindings.type$.af$('bindings',73730,'xetoEnv::SpecBindings',{}).af$('loader',67584,'xetoEnv::SpecBindingLoader?',{}).am$('run',271360,'sys::Void',xp,{}).am$('loadBindings',8192,'sys::Void',xp,{}).am$('assignBindings',2048,'sys::Void',xp,{}).am$('resolveBinding',2048,'xeto::SpecBinding',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('make',139268,'sys::Void',xp,{});
InheritSlots.type$.af$('noSlots',73730,'[sys::Str:xetoEnv::CSpec]',{}).af$('stack',67584,'xetoc::ASpec[]',{}).af$('globals',67584,'[sys::Str:xetoEnv::CSpec?]',{}).af$('types',67584,'xetoc::ASpec[]',{}).am$('run',271360,'sys::Void',xp,{}).am$('inherit',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('doInherit',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('inferBase',8192,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('inferBaseGlobal',2048,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('inferType',8192,'xetoc::ASpecRef',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('inheritFlags',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('computeFlagsNonSys',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('computeFlagsSys',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('computeFlagsSysComp',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('inheritSlots',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('inheritSlotsFrom',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false),new sys.Param('acc','[sys::Str:xetoEnv::CSpec]',false),new sys.Param('autoCount','sys::Int',false),new sys.Param('base','xetoEnv::CSpec',false)]),{}).am$('addOwnSlots',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false),new sys.Param('acc','[sys::Str:xetoEnv::CSpec]',false),new sys.Param('autoCount','sys::Int',false)]),{}).am$('overrideSlot',2048,'xetoc::ASpec',sys.List.make(sys.Param.type$,[new sys.Param('base','xetoEnv::CSpec',false),new sys.Param('slot','xetoc::ASpec',false)]),{}).am$('mergeInheritedSlots',2048,'xetoEnv::CSpec',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false),new sys.Param('name','sys::Str',false),new sys.Param('a','xetoEnv::CSpec',false),new sys.Param('b','xetoEnv::CSpec',false)]),{}).am$('isDerivedFrom',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','xetoEnv::CSpec',false),new sys.Param('b','xetoEnv::CSpec?',false)]),{}).am$('mergeQuerySlots',2048,'xetoEnv::CSpec',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false),new sys.Param('name','sys::Str',false),new sys.Param('a','xetoEnv::CSpec',false),new sys.Param('b','xetoEnv::CSpec',false)]),{}).am$('isEnum',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('inheritEnum',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('inheritEnumItem',2048,'xetoc::ASpec',sys.List.make(sys.Param.type$,[new sys.Param('enum','xetoc::ASpec',false),new sys.Param('enumRef','xetoc::ASpecRef',false),new sys.Param('item','xetoc::ASpec',false)]),{}).am$('make',139268,'sys::Void',xp,{});
OutputZip.type$.am$('run',271360,'sys::Void',xp,{}).am$('needToRun',2048,'sys::Bool',xp,{}).am$('writeMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('zip','sys::Zip',false),new sys.Param('path','sys::Str',false)]),{}).am$('writeToZip',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('zip','sys::Zip',false),new sys.Param('path','sys::Str',false),new sys.Param('file','sys::File',false)]),{}).am$('includeInZip',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CheckErrors.type$.af$('checkVal',73730,'xetoEnv::CheckVal',{}).am$('run',271360,'sys::Void',xp,{}).am$('checkLib',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ALib',false)]),{}).am$('checkLibMeta',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ALib',false)]),{}).am$('checkTop',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkTopName',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkTypeInherit',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkCompoundType',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkCanInheritFrom',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false),new sys.Param('base','xetoEnv::CSpec',false),new sys.Param('loc','util::FileLoc',false)]),{}).am$('checkSpec',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkCovariant',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('errCovariant',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false),new sys.Param('msg1','sys::Str',false),new sys.Param('msg2','sys::Str',false)]),{}).am$('checkSlots',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkSlot',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkSlotType',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','xetoc::ASpec',false)]),{}).am$('checkSlotMeta',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','xetoc::ASpec',false)]),{}).am$('checkSlotVal',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','xetoc::ASpec',false)]),{}).am$('checkSpecMeta',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkType',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkGlobal',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkMetaSpec',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkSpecQuery',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('checkInstance',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xetoc::ALib',false),new sys.Param('name','sys::Str',false),new sys.Param('x','xetoc::AData',false)]),{}).am$('checkXMeta',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xetoc::ALib',false),new sys.Param('name','sys::Str',false),new sys.Param('x','xetoc::ADict',false)]),{}).am$('checkData',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::AData',false),new sys.Param('slot','xetoEnv::CSpec?',false)]),{}).am$('checkScalar',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::AScalar',false),new sys.Param('slot','xetoEnv::CSpec?',false)]),{}).am$('checkDict',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ADict',false),new sys.Param('slot','xetoEnv::CSpec?',false)]),{}).am$('checkList',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ADict',false),new sys.Param('slot','xetoEnv::CSpec?',false)]),{}).am$('checkDictSlot',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ADict',false),new sys.Param('slot','xetoEnv::CSpec',false)]),{}).am$('checkDictSlotAgainstGlobals',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','xetoc::AData',false)]),{}).am$('valTypeFits',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('type','xetoEnv::CSpec',false),new sys.Param('valType','xetoEnv::CSpec',false),new sys.Param('val','sys::Obj',false)]),{}).am$('checkRefTarget',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','xetoEnv::CSpec',false),new sys.Param('val','xetoc::AData',false)]),{}).am$('checkSpecRef',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpecRef',false)]),{}).am$('checkDataRef',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ADataRef',false)]),{}).am$('checkDictChoice',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ADict',false),new sys.Param('slot','xetoEnv::CSpec',false)]),{}).am$('make',139268,'sys::Void',xp,{});
InferData.type$.af$('refDefVal',73730,'xeto::Ref',{}).af$('curSpec',67584,'xetoc::ASpec?',{}).am$('infer',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','xetoc::ANode',false)]),{}).am$('inferInstance',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','xetoc::AInstance',false)]),{}).am$('inferDict',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','xetoc::ADict',false)]),{}).am$('inferScalar',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('scalar','xetoc::AScalar',false)]),{}).am$('inferRef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ref','xetoc::ARef',false)]),{}).am$('inferId',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','xetoc::AInstance',false)]),{}).am$('inferMetaSlots',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','xetoc::ADict',false)]),{}).am$('inferMetaSlot',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','xetoc::ADict',false),new sys.Param('name','sys::Str',false),new sys.Param('val','xetoc::AData',false)]),{}).am$('inferDictSlots',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','xetoc::ADict',false)]),{}).am$('inferDictSlot',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','xetoc::ADict',false),new sys.Param('slot','xetoEnv::CSpec',false)]),{}).am$('inferDictSlotType',2048,'xetoc::ASpecRef',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('slot','xetoEnv::CSpec',false)]),{}).am$('make',139268,'sys::Void',xp,{});
InferMeta.type$.am$('run',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
InferInstances.type$.am$('run',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
Parse.type$.am$('run',271360,'sys::Void',xp,{}).am$('parseLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::File',false)]),{}).am$('parseData',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::File',false)]),{}).am$('validateLibPragma',2048,'xetoc::ADict?',sys.List.make(sys.Param.type$,[new sys.Param('lib','xetoc::ALib',false)]),{}).am$('parseDir',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::File',false),new sys.Param('lib','xetoc::ALib',false)]),{}).am$('parseFile',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','sys::File',false),new sys.Param('doc','xetoc::ADoc',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ProcessPragma.type$.am$('run',271360,'sys::Void',xp,{}).am$('toVersion',2048,'sys::Version',xp,{}).am$('nsToDepends',2048,'xetoEnv::MLibDepend[]',xp,{}).am$('pragmaToDepends',2048,'xetoEnv::MLibDepend[]',xp,{}).am$('toDependsList',2048,'xetoEnv::MLibDepend[]?',sys.List.make(sys.Param.type$,[new sys.Param('val','xetoc::AData?',false)]),{}).am$('toDepend',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:xetoEnv::MLibDepend]',false),new sys.Param('obj','xetoc::AData',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Resolve.type$.am$('run',271360,'sys::Void',xp,{}).am$('resolveDepends',2048,'sys::Void',xp,{}).am$('resolveDepend',2048,'xetoEnv::XetoLib?',sys.List.make(sys.Param.type$,[new sys.Param('d','xetoEnv::MLibDepend',false)]),{}).am$('resolveNode',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','xetoc::ANode',false)]),{}).am$('resolveSpec',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('resolveRef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ref','xetoc::ARef',false)]),{}).am$('resolveQualified',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ref','xetoc::ARef',false)]),{}).am$('resolveInAst',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('ref','xetoc::ARef',false),new sys.Param('name','sys::Str',false)]),{}).am$('resolveInDepend',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('ref','xetoc::ARef',false),new sys.Param('name','sys::Str',false),new sys.Param('depend','xetoEnv::XetoLib',false)]),{}).am$('wrapInstance',2048,'xetoc::CInstance?',sys.List.make(sys.Param.type$,[new sys.Param('dict','xeto::Dict?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Reify.type$.am$('reify',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','xetoc::ANode',false)]),{}).am$('reifySpec',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('reifyDict',2048,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ADict',false)]),{}).am$('reifyRawDict',2048,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ADict',false),new sys.Param('type','xetoEnv::CSpec',false)]),{}).am$('reifyRawList',2048,'sys::Obj[]',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ADict',false),new sys.Param('type','xetoEnv::CSpec',false)]),{}).am$('reifyDictVal',2048,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ANode',false)]),{}).am$('reifyScalar',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::AScalar',false)]),{}).am$('reifyDataRef',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ADataRef',false)]),{}).am$('reifySpecRef',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpecRef',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ReifyMeta.type$.am$('run',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
ReifyInstances.type$.am$('run',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
Assemble.type$.af$('noSpecs',106498,'[sys::Str:xeto::Spec]',{}).af$('noDicts',106498,'[sys::Str:xeto::Dict]',{}).af$('mField',73728,'sys::Field',{}).am$('run',271360,'sys::Void',xp,{}).am$('asmLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ALib',false)]),{}).am$('asmTops',2048,'[sys::Str:xeto::Spec]',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ALib',false)]),{}).am$('asmInstances',2048,'[sys::Str:xeto::Dict]',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ALib',false)]),{}).am$('asmTop',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('asmSpec',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('asmChildren',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('asmSlotsOwn',2048,'xetoEnv::MSlots',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('asmSlots',2048,'xetoEnv::MSlots',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ASpec',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Init.type$.am$('run',271360,'sys::Void',xp,{}).am$('nsRequired',270336,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
InitLib.type$.am$('run',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
InitLibVersion.type$.am$('nsRequired',271360,'sys::Bool',xp,{}).am$('make',139268,'sys::Void',xp,{});
InitData.type$.am$('run',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
InheritMeta.type$.am$('run',271360,'sys::Void',xp,{}).am$('inherit',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('computeMeta',2048,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('computedInherited',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false),new sys.Param('spec','xetoc::ASpec',false),new sys.Param('base','xetoEnv::CSpec',false)]),{}).am$('computeFromBase',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false),new sys.Param('base','xetoEnv::CSpec',false),new sys.Param('loc','util::FileLoc',false)]),{}).am$('isInherited',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('base','xetoEnv::CSpec',false),new sys.Param('name','sys::Str',false),new sys.Param('loc','util::FileLoc',false)]),{}).am$('computeUnion',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false),new sys.Param('ofs','xetoEnv::CSpec[]?',false),new sys.Param('loc','util::FileLoc',false)]),{}).am$('computeIntersection',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false),new sys.Param('ofs','xetoEnv::CSpec[]?',false)]),{}).am$('computeArgs',2048,'xetoEnv::MSpecArgs',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('make',139268,'sys::Void',xp,{});
XetoCompiler.type$.af$('ns',73728,'xetoEnv::MNamespace?',{}).af$('names',73728,'xeto::NameTable?',{}).af$('log',73728,'xetoEnv::XetoLog',{}).af$('input',73728,'sys::File?',{}).af$('libName',73728,'sys::Str?',{}).af$('build',73728,'sys::File?',{}).af$('errs',73728,'xetoEnv::XetoCompilerErr[]',{}).af$('sys',65664,'xetoc::ASys',{}).af$('depends',65664,'xetoc::ADepends',{}).af$('duration',65664,'sys::Duration?',{}).af$('isLib',65664,'sys::Bool',{}).af$('isSys',65664,'sys::Bool',{}).af$('isSysComp',65664,'sys::Bool',{}).af$('cns',65664,'xetoc::ANamespace?',{}).af$('ast',65664,'xetoc::ADoc?',{}).af$('lib',65664,'xetoc::ALib?',{}).af$('data',65664,'xetoc::ADataDoc?',{}).af$('pragma',65664,'xetoc::ADict?',{}).af$('json',65664,'xeto::Dict?',{}).af$('externRefs',65664,'sys::Bool',{}).af$('autoNames',67584,'sys::Str[]',{}).af$('internRefs',67584,'[sys::Str:haystack::Ref]',{}).am$('make',8196,'sys::Void',xp,{}).am$('isBuild',8192,'sys::Bool',xp,{}).am$('applyOpts',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('opts','xeto::Dict?',false)]),{}).am$('compileLib',8192,'xeto::Lib',xp,{}).am$('compileData',8192,'sys::Obj?',xp,{}).am$('parseLibVersion',8192,'xetoc::FileLibVersion',xp,{}).am$('run',128,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('steps','xetoc::Step[]',false)]),{}).am$('info',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('warn',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('err',8192,'xetoEnv::XetoCompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('errSlot',8192,'xetoEnv::XetoCompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('slot','xetoEnv::CSpec?',false),new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('err2',8192,'xetoEnv::XetoCompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc1','util::FileLoc',false),new sys.Param('loc2','util::FileLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('autoName',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('makeRef',8192,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('dis','sys::Str?',false)]),{});
ANode.type$.af$('loc',73730,'util::FileLoc',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false)]),{}).am$('nodeType',270337,'xetoc::ANodeType',xp,{}).am$('walkBottomUp',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkTopDown',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('asm',270337,'sys::Obj',xp,{}).am$('dump',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true),new sys.Param('indent','sys::Str',true)]),{});
ASpec.type$.af$('lib',73728,'xetoc::ALib',{}).af$('parent',73728,'xetoc::ASpec?',{}).af$('flavor',336896,'xeto::SpecFlavor',{}).af$('nameCode',73730,'sys::Int',{}).af$('name',336898,'sys::Str',{}).af$('qname',336898,'sys::Str',{}).af$('asm',336898,'xetoEnv::XetoSpec',{}).af$('typeRef',73728,'xetoc::ASpecRef?',{}).af$('base',73728,'xetoEnv::CSpec?',{}).af$('val',73728,'xetoc::AScalar?',{}).af$('argsRef',65664,'xetoEnv::MSpecArgs?',{}).af$('parsedCompound',73728,'sys::Bool',{}).af$('parsedSyntheticRef',73728,'sys::Bool',{}).af$('meta',73728,'xetoc::ADict?',{}).af$('slots',73728,'[sys::Str:xetoc::ASpec]?',{}).af$('bindingRef',73728,'xeto::SpecBinding?',{}).af$('metaOwnRef',73728,'xeto::Dict?',{}).af$('cmetaRef',73728,'xetoEnv::MNameDict?',{}).af$('cslotsRef',73728,'[sys::Str:xetoEnv::CSpec]?',{}).af$('enums',73728,'[sys::Str:xetoEnv::CSpec]?',{}).af$('flags',336896,'sys::Int',{}).af$('id$Store',722944,'sys::Obj?',{}).af$('cof$Store',722944,'sys::Obj?',{}).af$('cofs$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('lib','xetoc::ALib',false),new sys.Param('parent','xetoc::ASpec?',false),new sys.Param('name','sys::Str',false)]),{}).am$('toFlavor',34818,'xeto::SpecFlavor',sys.List.make(sys.Param.type$,[new sys.Param('parent','xetoc::ASpec?',false),new sys.Param('name','sys::Str',false)]),{}).am$('nodeType',271360,'xetoc::ANodeType',xp,{}).am$('compiler',8192,'xetoc::XetoCompiler',xp,{}).am$('sys',8192,'xetoc::ASys',xp,{}).am$('isTop',8192,'sys::Bool',xp,{}).am$('isType',8192,'sys::Bool',xp,{}).am$('isGlobal',8192,'sys::Bool',xp,{}).am$('isMeta',8192,'sys::Bool',xp,{}).am$('isSys',271360,'sys::Bool',xp,{}).am$('isSlot',8192,'sys::Bool',xp,{}).am$('id',795648,'haystack::Ref',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('isObj',8192,'sys::Bool',xp,{}).am$('args',271360,'xetoEnv::MSpecArgs',xp,{}).am$('metaInit',8192,'xetoc::ADict',xp,{}).am$('metaHas',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('metaGet',8192,'xetoc::AData?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('metaSet',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('data','xetoc::AData',false)]),{}).am$('metaSetMarker',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('metaSetNone',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('metaSetStr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('metaSetOfs',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('specs','xetoc::ASpecRef[]',false)]),{}).am$('initSlots',8192,'[sys::Str:xetoc::ASpec]',xp,{}).am$('walkBottomUp',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkTopDown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('dump',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true),new sys.Param('indent','sys::Str',true)]),{}).am$('isAst',271360,'sys::Bool',xp,{}).am$('ctype',271360,'xetoEnv::CSpec',xp,{}).am$('cbase',271360,'xetoEnv::CSpec?',xp,{}).am$('cparent',271360,'xetoEnv::CSpec?',xp,{}).am$('cslot',271360,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('binding',271360,'xeto::SpecBinding',xp,{}).am$('metaOwn',8192,'xeto::Dict',xp,{}).am$('cmeta',271360,'xetoEnv::MNameDict',xp,{}).am$('cmetaHas',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('hasSlots',271360,'sys::Bool',xp,{}).am$('cslots',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoEnv::CSpec,sys::Str->sys::Void|',false)]),{}).am$('cslotsWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoEnv::CSpec,sys::Str->sys::Obj?|',false)]),{}).am$('cenum',271360,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('cisa',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','xetoEnv::CSpec',false)]),{}).am$('cof',795648,'xetoEnv::CSpec?',xp,{}).am$('cofs',795648,'xetoEnv::CSpec[]?',xp,{}).am$('isNone',271360,'sys::Bool',xp,{}).am$('isSelf',271360,'sys::Bool',xp,{}).am$('isEnum',271360,'sys::Bool',xp,{}).am$('isAnd',271360,'sys::Bool',xp,{}).am$('isOr',271360,'sys::Bool',xp,{}).am$('isScalar',271360,'sys::Bool',xp,{}).am$('isMarker',271360,'sys::Bool',xp,{}).am$('isRef',271360,'sys::Bool',xp,{}).am$('isMultiRef',271360,'sys::Bool',xp,{}).am$('isChoice',271360,'sys::Bool',xp,{}).am$('isDict',271360,'sys::Bool',xp,{}).am$('isList',271360,'sys::Bool',xp,{}).am$('isMaybe',271360,'sys::Bool',xp,{}).am$('isQuery',271360,'sys::Bool',xp,{}).am$('isFunc',271360,'sys::Bool',xp,{}).am$('isInterface',271360,'sys::Bool',xp,{}).am$('isComp',271360,'sys::Bool',xp,{}).am$('hasFlag',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flag','sys::Int',false)]),{}).am$('id$Once',133120,'haystack::Ref',xp,{}).am$('cof$Once',133120,'xetoEnv::CSpec?',xp,{}).am$('cofs$Once',133120,'xetoEnv::CSpec[]?',xp,{});
CInstance.type$.am$('isAst',270337,'sys::Bool',xp,{}).am$('ctype',270337,'xetoEnv::CSpec',xp,{});
CInstanceWrap.type$.af$('w',73730,'xeto::Dict',{}).af$('spec',73730,'xetoEnv::XetoSpec',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('w','xeto::Dict',false),new sys.Param('spec','xetoEnv::XetoSpec',false)]),{}).am$('isAst',271360,'sys::Bool',xp,{}).am$('id',271360,'haystack::Ref',xp,{}).am$('ctype',271360,'xetoEnv::CSpec',xp,{}).am$('asm',271360,'sys::Obj',xp,{});
ADoc.type$.af$('compiler',73728,'xetoc::XetoCompiler',{}).af$('instances',73728,'[sys::Str:xetoc::AInstance]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xetoc::XetoCompiler',false),new sys.Param('loc','util::FileLoc',false)]),{}).am$('instance',8192,'xetoc::AData?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('walkMetaTopDown',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkMetaBottomUp',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkInstancesTopDown',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkInstancesBottomUp',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{});
ADataDoc.type$.af$('root',73728,'xetoc::AData?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xetoc::XetoCompiler',false),new sys.Param('loc','util::FileLoc',false)]),{}).am$('nodeType',271360,'xetoc::ANodeType',xp,{}).am$('asm',271360,'sys::Obj',xp,{}).am$('walkBottomUp',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkTopDown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkMetaTopDown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkMetaBottomUp',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkInstancesTopDown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkInstancesBottomUp',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('dump',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true),new sys.Param('indent','sys::Str',true)]),{});
ASys.type$.af$('obj',73728,'xetoc::ASpecRef',{}).af$('none',73728,'xetoc::ASpecRef',{}).af$('marker',73728,'xetoc::ASpecRef',{}).af$('str',73728,'xetoc::ASpecRef',{}).af$('ref',73728,'xetoc::ASpecRef',{}).af$('dict',73728,'xetoc::ASpecRef',{}).af$('list',73728,'xetoc::ASpecRef',{}).af$('and',73728,'xetoc::ASpecRef',{}).af$('or',73728,'xetoc::ASpecRef',{}).af$('lib',73728,'xetoc::ASpecRef',{}).af$('spec',73728,'xetoc::ASpecRef',{}).af$('query',73728,'xetoc::ASpecRef',{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ASpecRef->sys::Void|',false)]),{}).am$('init',34818,'xetoc::ASpecRef',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('markerScalar',8192,'xetoc::AScalar',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false)]),{}).am$('make',139268,'sys::Void',xp,{});
AName.type$.af$('lib',73730,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','sys::Str?',false)]),{}).am$('isQualified',8192,'sys::Bool',xp,{}).am$('isPath',270337,'sys::Bool',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('size',270337,'sys::Int',xp,{}).am$('nameAt',270337,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{});
ASimpleName.type$.af$('name',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','sys::Str?',false),new sys.Param('name','sys::Str',false)]),{}).am$('isPath',271360,'sys::Bool',xp,{}).am$('size',271360,'sys::Int',xp,{}).am$('nameAt',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
APathName.type$.af$('path',73730,'sys::Str[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','sys::Str?',false),new sys.Param('path','sys::Str[]',false)]),{}).am$('isPath',271360,'sys::Bool',xp,{}).am$('name',271360,'sys::Str',xp,{}).am$('size',271360,'sys::Int',xp,{}).am$('nameAt',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
AData.type$.af$('typeRef',73728,'xetoc::ASpecRef?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('type','xetoc::ASpecRef?',false)]),{}).am$('ctype',8192,'xetoEnv::CSpec',xp,{}).am$('isAsm',270337,'sys::Bool',xp,{}).am$('isNone',270336,'sys::Bool',xp,{});
ARef.type$.af$('name',73730,'xetoc::AName',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('name','xetoc::AName',false)]),{}).am$('isAsm',9216,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('what',270337,'sys::Str',xp,{}).am$('isResolved',270337,'sys::Bool',xp,{}).am$('resolve',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','xetoEnv::CNode',false)]),{}).am$('walkBottomUp',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkTopDown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{});
ASpecRef.type$.af$('of',73728,'xetoEnv::CSpec?',{}).af$('resolvedRef',67584,'xetoEnv::CSpec?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('name','xetoc::AName',false)]),{}).am$('makeResolved',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('spec','xetoEnv::CSpec',false)]),{}).am$('nodeType',271360,'xetoc::ANodeType',xp,{}).am$('what',271360,'sys::Str',xp,{}).am$('isResolved',271360,'sys::Bool',xp,{}).am$('asm',271360,'xeto::Spec',xp,{}).am$('resolve',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::CNode',false)]),{}).am$('deref',8192,'xetoEnv::CSpec',xp,{});
ADataRef.type$.af$('dis',73730,'sys::Str?',{}).af$('resolvedRef',67584,'xetoc::CInstance?',{}).af$('asmRef',73728,'xeto::Ref?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('name','xetoc::AName',false),new sys.Param('dis','sys::Str?',false)]),{}).am$('nodeType',271360,'xetoc::ANodeType',xp,{}).am$('what',271360,'sys::Str',xp,{}).am$('asm',271360,'xeto::Ref',xp,{}).am$('isResolved',271360,'sys::Bool',xp,{}).am$('resolve',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::CNode',false)]),{}).am$('deref',8192,'xetoc::CInstance',xp,{});
ADepends.type$.af$('compiler',73728,'xetoc::XetoCompiler',{}).af$('list',73728,'xetoEnv::MLibDepend[]?',{}).af$('libs',73728,'[sys::Str:xetoEnv::XetoLib]?',{}).af$('globals',67584,'[sys::Str:xetoEnv::CSpec?]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('compiler','xetoc::XetoCompiler',false)]),{});
ALib.type$.af$('nameCode',73730,'sys::Int',{}).af$('name',73730,'sys::Str',{}).af$('isSys',73730,'sys::Bool',{}).af$('asm',336898,'xetoEnv::XetoLib',{}).af$('files',73728,'xeto::LibFiles?',{}).af$('meta',73728,'xetoc::ADict?',{}).af$('flags',73728,'sys::Int',{}).af$('version',73728,'sys::Version?',{}).af$('tops',73728,'[sys::Str:xetoc::ASpec]',{}).af$('typesRef',73728,'xetoc::ASpec[]?',{}).af$('autoNameCount',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xetoc::XetoCompiler',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('name','sys::Str',false)]),{}).am$('nodeType',271360,'xetoc::ANodeType',xp,{}).am$('top',8192,'xetoc::ASpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('types',8192,'xetoc::ASpec[]',xp,{}).am$('walkBottomUp',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkTopDown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkMetaBottomUp',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkMetaTopDown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkInstancesBottomUp',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkInstancesTopDown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('autoName',8192,'sys::Str',xp,{}).am$('dump',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true),new sys.Param('indent','sys::Str',true)]),{});
ANodeType.type$.af$('lib',106506,'xetoc::ANodeType',{}).af$('dataDoc',106506,'xetoc::ANodeType',{}).af$('spec',106506,'xetoc::ANodeType',{}).af$('scalar',106506,'xetoc::ANodeType',{}).af$('dict',106506,'xetoc::ANodeType',{}).af$('instance',106506,'xetoc::ANodeType',{}).af$('specRef',106506,'xetoc::ANodeType',{}).af$('dataRef',106506,'xetoc::ANodeType',{}).af$('vals',106498,'xetoc::ANodeType[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'xetoc::ANodeType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ANamespace.type$.af$('ns',73730,'xetoEnv::MNamespace?',{}).af$('compiler',73728,'xetoc::XetoCompiler',{}).af$('metaSpecs',73728,'[sys::Str:sys::Obj]',{}).af$('globals',73728,'[sys::Str:sys::Obj]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('step','xetoc::Init',false)]),{}).am$('metaSpec',8192,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('loc','util::FileLoc',false)]),{}).am$('global',8192,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('loc','util::FileLoc',false)]),{}).am$('top',2048,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false),new sys.Param('name','sys::Str',false),new sys.Param('flavor','xeto::SpecFlavor',false),new sys.Param('loc','util::FileLoc',false)]),{}).am$('findTop',2048,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('flavor','xeto::SpecFlavor',false),new sys.Param('loc','util::FileLoc',false)]),{}).am$('eachSubtype',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xetoEnv::CSpec',false),new sys.Param('f','|xetoEnv::CSpec->sys::Void|',false)]),{});
AScalar.type$.af$('asmRef',73728,'sys::Obj?',{}).af$('str',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('type','xetoc::ASpecRef?',false),new sys.Param('str','sys::Str',false),new sys.Param('asm','sys::Obj?',true)]),{}).am$('nodeType',271360,'xetoc::ANodeType',xp,{}).am$('isAsm',271360,'sys::Bool',xp,{}).am$('asm',271360,'sys::Obj',xp,{}).am$('isNone',271360,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('walkBottomUp',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkTopDown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{});
ADict.type$.af$('asmRef',73728,'sys::Obj?',{}).af$('isMeta',73730,'sys::Bool',{}).af$('metaParent',73728,'xetoc::ANode?',{}).af$('listOf',73728,'sys::Type?',{}).af$('map',73728,'[sys::Str:xetoc::AData]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('type','xetoc::ASpecRef?',false),new sys.Param('isMeta','sys::Bool',true)]),{}).am$('nodeType',271360,'xetoc::ANodeType',xp,{}).am$('isAsm',271360,'sys::Bool',xp,{}).am$('asm',271360,'sys::Obj',xp,{}).am$('isLibMeta',8192,'sys::Bool',xp,{}).am$('isSpecMeta',8192,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('has',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('get',8192,'xetoc::AData?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('getStr',8192,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('set',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','xetoc::AData',false)]),{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::AData,sys::Str->sys::Void|',false)]),{}).am$('walkBottomUp',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('walkTopDown',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoc::ANode->sys::Void|',false)]),{}).am$('dump',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true),new sys.Param('indent','sys::Str',true)]),{});
AInstance.type$.af$('name',73728,'xetoc::AName',{}).af$('isNested',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('type','xetoc::ASpecRef?',false),new sys.Param('name','xetoc::AName',false),new sys.Param('isNested','sys::Bool',false)]),{}).am$('nodeType',271360,'xetoc::ANodeType',xp,{}).am$('dump',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true),new sys.Param('indent','sys::Str',true)]),{}).am$('isAst',271360,'sys::Bool',xp,{}).am$('id',271360,'haystack::Ref',xp,{});
Tokenizer.type$.af$('tok',73728,'xetoc::Token',{}).af$('val',73728,'sys::Obj?',{}).af$('refDis',73728,'sys::Str?',{}).af$('line',73728,'sys::Int',{}).af$('col',73728,'sys::Int',{}).af$('keepComments',73728,'sys::Bool',{}).af$('buf',67584,'sys::Str',{}).af$('pos',67584,'sys::Int',{}).af$('cur',67584,'sys::Int',{}).af$('peek',67584,'sys::Int',{}).af$('peekLine',67584,'sys::Int',{}).af$('peekCol',67584,'sys::Int',{}).af$('curLine',67584,'sys::Int',{}).af$('curCol',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Str',false)]),{}).am$('next',8192,'xetoc::Token',xp,{}).am$('skipSpaces',2048,'sys::Void',xp,{}).am$('isSpace',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('lockLoc',2048,'sys::Void',xp,{}).am$('id',2048,'xetoc::Token',xp,{}).am$('str',2048,'xetoc::Token',xp,{}).am$('normTripleQuotedStr',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('lines','sys::Str[]',false)]),{}).am$('indention',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false)]),{}).am$('escape',2048,'sys::Int',xp,{}).am$('ref',2048,'xetoc::Token',xp,{}).am$('refName',2048,'xetoc::AName',xp,{}).am$('refSection',2048,'sys::Str',xp,{}).am$('isRefChar',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('cur','sys::Int',false),new sys.Param('peek','sys::Int',false)]),{}).am$('num',2048,'xetoc::Token',xp,{}).am$('isNum',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Int',false)]),{}).am$('operator',2048,'xetoc::Token',xp,{}).am$('heredoc',2048,'xetoc::Token',xp,{}).am$('isHeredocEnd',2048,'sys::Bool',xp,{}).am$('parseComment',2048,'xetoc::Token',xp,{}).am$('skipCommentSL',2048,'sys::Void',xp,{}).am$('skipCommentML',2048,'sys::Void',xp,{}).am$('err',8192,'sys::ParseErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('peekPeek',2048,'sys::Int',xp,{}).am$('consume',2048,'sys::Void',xp,{});
Parser.type$.af$('step',67584,'xetoc::Step',{}).af$('compiler',67584,'xetoc::XetoCompiler',{}).af$('sys',67584,'xetoc::ASys',{}).af$('fileLoc',67584,'util::FileLoc',{}).af$('tokenizer',67584,'xetoc::Tokenizer',{}).af$('autoNames',67584,'sys::Str[]?',{}).af$('doc',67584,'xetoc::ADoc',{}).af$('libRef',67584,'xetoc::ALib?',{}).af$('isDataFile',67584,'sys::Bool',{}).af$('cur',67584,'xetoc::Token',{}).af$('curVal',67584,'sys::Obj?',{}).af$('curLine',67584,'sys::Int',{}).af$('curCol',67584,'sys::Int',{}).af$('peek',67584,'xetoc::Token',{}).af$('peekVal',67584,'sys::Obj?',{}).af$('peekLine',67584,'sys::Int',{}).af$('peekCol',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('step','xetoc::Step',false),new sys.Param('fileLoc','util::FileLoc',false),new sys.Param('fileStr','sys::Str',false),new sys.Param('doc','xetoc::ADoc',false)]),{}).am$('parseFile',8192,'sys::Void',xp,{}).am$('parseDataFile',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','xetoc::ADataDoc',false)]),{}).am$('parseLibFile',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xetoc::ALib',false)]),{}).am$('lib',2048,'xetoc::ALib',xp,{}).am$('parseLibObj',2048,'sys::Bool',xp,{}).am$('parseLibSpec',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('doc','sys::Str?',false)]),{}).am$('parseLibData',2048,'sys::Bool',xp,{}).am$('parseLibObjEnd',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Str',false)]),{}).am$('parseNamedSpec',2048,'xetoc::ASpec',sys.List.make(sys.Param.type$,[new sys.Param('parent','xetoc::ASpec?',false),new sys.Param('doc','sys::Str?',false)]),{}).am$('parseSpec',2048,'xetoc::ASpec',sys.List.make(sys.Param.type$,[new sys.Param('parent','xetoc::ASpec?',false),new sys.Param('doc','sys::Str?',false),new sys.Param('name','sys::Str',false)]),{}).am$('parseDataSpec',2048,'xetoc::ASpecRef',sys.List.make(sys.Param.type$,[new sys.Param('typeRef','xetoc::ASpecRef',false)]),{}).am$('parseMarkerSpec',2048,'xetoc::ASpec',sys.List.make(sys.Param.type$,[new sys.Param('parent','xetoc::ASpec',false),new sys.Param('doc','sys::Str?',false)]),{}).am$('parseSpecType',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false),new sys.Param('typeRef','xetoc::ASpecRef?',true)]),{}).am$('parseCompoundType',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false),new sys.Param('compoundType','xetoc::ASpecRef',false)]),{}).am$('parseSpecMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('parseSpecBody',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('parseSpecSlots',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','xetoc::ASpec',false)]),{}).am$('isCurMarkerSpec',2048,'sys::Bool',xp,{}).am$('parseSpecHeredocs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoc::ASpec',false)]),{}).am$('parseTopData',2048,'xetoc::AData',xp,{}).am$('parseNamedData',2048,'xetoc::AInstance',sys.List.make(sys.Param.type$,[new sys.Param('isNested','sys::Bool',true)]),{}).am$('parseData',2048,'xetoc::AData',xp,{}).am$('parseDataRef',2048,'xetoc::ADataRef',xp,{}).am$('parseScalar',2048,'xetoc::AScalar',sys.List.make(sys.Param.type$,[new sys.Param('type','xetoc::ASpecRef?',false)]),{}).am$('parseDict',2048,'xetoc::ADict',sys.List.make(sys.Param.type$,[new sys.Param('type','xetoc::ASpecRef?',false),new sys.Param('openToken','xetoc::Token',false),new sys.Param('closeToken','xetoc::Token',false),new sys.Param('x','xetoc::ADict?',false)]),{}).am$('curIsDictSlotName',2048,'sys::Bool',xp,{}).am$('parseDictHeredocs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoc::ADict',false)]),{}).am$('parseTypeRef',2048,'xetoc::ASpecRef?',xp,{}).am$('parseTypeRefName',2048,'xetoc::AName',xp,{}).am$('parseCommaOrNewline',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('close','xetoc::Token',false)]),{}).am$('parseLeadingDoc',2048,'sys::Str?',xp,{}).am$('parseTrailingDoc',2048,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('doc','sys::Str?',false)]),{}).am$('addDataDict',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','xetoc::ADict',false),new sys.Param('data','xetoc::AData',false)]),{}).am$('add',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('what','sys::Str',false),new sys.Param('map','[sys::Str:xetoc::ANode]',false),new sys.Param('name','sys::Str',false),new sys.Param('val','xetoc::ANode',false)]),{}).am$('autoName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('skipComments',2048,'sys::Void',xp,{}).am$('skipNewlines',2048,'sys::Bool',xp,{}).am$('verify',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','xetoc::Token',false)]),{}).am$('curToLoc',2048,'util::FileLoc',xp,{}).am$('curToStr',2048,'sys::Str',xp,{}).am$('consumeName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('expecting','sys::Str',false)]),{}).am$('consumeVal',2048,'sys::Str',xp,{}).am$('consume',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','xetoc::Token?',true)]),{}).am$('doConsume',2048,'sys::Void',xp,{}).am$('err',2048,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',true)]),{});
Token.type$.af$('id',106506,'xetoc::Token',{}).af$('ref',106506,'xetoc::Token',{}).af$('scalar',106506,'xetoc::Token',{}).af$('dot',106506,'xetoc::Token',{}).af$('colon',106506,'xetoc::Token',{}).af$('doubleColon',106506,'xetoc::Token',{}).af$('comma',106506,'xetoc::Token',{}).af$('lt',106506,'xetoc::Token',{}).af$('gt',106506,'xetoc::Token',{}).af$('lbrace',106506,'xetoc::Token',{}).af$('rbrace',106506,'xetoc::Token',{}).af$('lparen',106506,'xetoc::Token',{}).af$('rparen',106506,'xetoc::Token',{}).af$('lbracket',106506,'xetoc::Token',{}).af$('rbracket',106506,'xetoc::Token',{}).af$('question',106506,'xetoc::Token',{}).af$('amp',106506,'xetoc::Token',{}).af$('pipe',106506,'xetoc::Token',{}).af$('heredoc',106506,'xetoc::Token',{}).af$('nl',106506,'xetoc::Token',{}).af$('comment',106506,'xetoc::Token',{}).af$('eof',106506,'xetoc::Token',{}).af$('vals',106498,'xetoc::Token[]',{}).af$('dis',73730,'sys::Str',{}).af$('symbol',73730,'sys::Str',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('dis','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('fromStr',40966,'xetoc::Token?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Heredoc.type$.af$('name',73730,'sys::Str',{}).af$('val',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('v','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "xetoc");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;util 1.0;xeto 3.1.11;haystack 3.1.11;xetoEnv 3.1.11");
m.set("pod.summary", "Xeto compiler and implementation");
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
  LocalNamespace,
  FileRepo,
  FileLibVersion,
  ANodeType,
};
