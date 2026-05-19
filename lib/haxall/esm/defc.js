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
import * as def from './def.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class DefCompilerStep extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefCompilerStep.type$; }

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

  static make(compiler) {
    const $self = new DefCompilerStep();
    DefCompilerStep.make$($self,compiler);
    return $self;
  }

  static make$($self,compiler) {
    $self.#compiler = compiler;
    return;
  }

  index() {
    return sys.ObjUtil.coerce(this.#compiler.index(), CIndex.type$);
  }

  etc() {
    return this.#compiler.index().etc();
  }

  ns() {
    return sys.ObjUtil.coerce(this.#compiler.ns(), haystack.Namespace.type$);
  }

  docEnv() {
    return sys.ObjUtil.coerce(this.#compiler.docEnv(), DefDocEnv.type$);
  }

  eachLib(f) {
    this.#compiler.libs().each(f);
    return;
  }

  eachDef(f) {
    this.#compiler.index().defs().each(f);
    return;
  }

  parseSymbol(tagName,val,loc) {
    if (val == null) {
      this.err(sys.Str.plus(sys.Str.plus("Missing '", tagName), "' tag"), loc);
      return null;
    }
    ;
    if (!sys.ObjUtil.is(val, haystack.Symbol.type$)) {
      this.err(sys.Str.plus(sys.Str.plus("Expecting Symbol value for '", tagName), "' tag"), loc);
      return null;
    }
    ;
    try {
      return this.#compiler.symbols().parse(sys.ObjUtil.toStr(val));
    }
    catch ($_u0) {
      $_u0 = sys.Err.make($_u0);
      if ($_u0 instanceof sys.Err) {
        let e = $_u0;
        ;
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid symbol for '", tagName), "' tag: "), val), loc);
        return null;
      }
      else {
        throw $_u0;
      }
    }
    ;
  }

  addDef(loc,lib,symbol,dict) {
    let dup = lib.defs().get(symbol);
    if (dup != null) {
      this.err2(sys.Str.plus("Duplicate defs: ", symbol), loc, dup.loc());
      return null;
    }
    ;
    let $def = CDef.make(loc, lib, symbol, dict);
    lib.defs().add(symbol, $def);
    return $def;
  }

  info(msg) {
    this.#compiler.info(msg);
    return;
  }

  err(msg,loc,err) {
    if (err === undefined) err = null;
    return this.#compiler.err(msg, loc, err);
  }

  err2(msg,loc1,loc2,err) {
    if (err === undefined) err = null;
    return this.#compiler.err2(msg, loc1, loc2, err);
  }

}

class CompilerErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompilerErr.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  static make(msg,loc,cause) {
    const $self = new CompilerErr();
    CompilerErr.make$($self,msg,loc,cause);
    return $self;
  }

  static make$($self,msg,loc,cause) {
    sys.Err.make$($self, msg, cause);
    $self.#loc = loc;
    return;
  }

}

class UnresolvedDocLinkErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnresolvedDocLinkErr.type$; }

  static make(link) {
    const $self = new UnresolvedDocLinkErr();
    UnresolvedDocLinkErr.make$($self,link);
    return $self;
  }

  static make$($self,link) {
    sys.Err.make$($self, link, $self.cause());
    return;
  }

}

class DefCompiler extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#log = sys.Log.get("defc");
    this.#includeInDocs = ($def) => {
      return !$def.isNoDoc();
    };
    this.#inputs = CompilerInput.makeDefaults();
    this.#factory = def.DefFactory.make();
    this.#errs = sys.List.make(CompilerErr.type$);
    this.#libs = sys.Map.__fromLiteral([], [], sys.Type.find("defc::CSymbol"), sys.Type.find("defc::CLib"));
    this.#manuals = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::DocPod"));
    return;
  }

  typeof() { return DefCompiler.type$; }

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

  #onDocFile = null;

  onDocFile(it) {
    if (it === undefined) {
      return this.#onDocFile;
    }
    else {
      this.#onDocFile = it;
      return;
    }
  }

  #includeInDocs = null;

  includeInDocs(it) {
    if (it === undefined) {
      return this.#includeInDocs;
    }
    else {
      this.#includeInDocs = it;
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

  #factory = null;

  factory(it) {
    if (it === undefined) {
      return this.#factory;
    }
    else {
      this.#factory = it;
      return;
    }
  }

  #docEnvFactory = null;

  docEnvFactory(it) {
    if (it === undefined) {
      return this.#docEnvFactory;
    }
    else {
      this.#docEnvFactory = it;
      return;
    }
  }

  #includeSpecs = false;

  includeSpecs(it) {
    if (it === undefined) {
      return this.#includeSpecs;
    }
    else {
      this.#includeSpecs = it;
      return;
    }
  }

  #intern = null;

  intern(it) {
    if (it === undefined) {
      return this.#intern;
    }
    else {
      this.#intern = it;
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

  #genDocEnv = false;

  genDocEnv(it) {
    if (it === undefined) {
      return this.#genDocEnv;
    }
    else {
      this.#genDocEnv = it;
      return;
    }
  }

  #genProtos = false;

  genProtos(it) {
    if (it === undefined) {
      return this.#genProtos;
    }
    else {
      this.#genProtos = it;
      return;
    }
  }

  #symbols = null;

  symbols(it) {
    if (it === undefined) {
      return this.#symbols;
    }
    else {
      this.#symbols = it;
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

  #manuals = null;

  manuals(it) {
    if (it === undefined) {
      return this.#manuals;
    }
    else {
      this.#manuals = it;
      return;
    }
  }

  #index = null;

  index(it) {
    if (it === undefined) {
      return this.#index;
    }
    else {
      this.#index = it;
      return;
    }
  }

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

  #docEnv = null;

  docEnv(it) {
    if (it === undefined) {
      return this.#docEnv;
    }
    else {
      this.#docEnv = it;
      return;
    }
  }

  #defsGrid = null;

  defsGrid(it) {
    if (it === undefined) {
      return this.#defsGrid;
    }
    else {
      this.#defsGrid = it;
      return;
    }
  }

  #protosGrid = null;

  protosGrid(it) {
    if (it === undefined) {
      return this.#protosGrid;
    }
    else {
      this.#protosGrid = it;
      return;
    }
  }

  #initOutDir$Store = undefined;

  // private field reflection only
  __initOutDir$Store(it) { if (it === undefined) return this.#initOutDir$Store; else this.#initOutDir$Store = it; }

  static make() {
    const $self = new DefCompiler();
    DefCompiler.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    $self.#intern = InternFactory.make();
    $self.#symbols = CSymbolFactory.make($self.#intern);
    return;
  }

  compileIndex() {
    return sys.ObjUtil.coerce(this.runBackend(sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("defc::DefCompilerStep[]"))).#index, CIndex.type$);
  }

  compileNamespace() {
    return sys.ObjUtil.coerce(this.runBackend(sys.List.make(DefCompilerStep.type$)).#ns, haystack.Namespace.type$);
  }

  compileDocEnv() {
    return sys.ObjUtil.coerce(this.runBackend(sys.List.make(GenDocEnv.type$, [GenDocEnv.make(this)])).#docEnv, DefDocEnv.type$);
  }

  compileDocs() {
    return this.runBackend(sys.List.make(DefCompilerStep.type$, [GenDocEnv.make(this), GenDocs.make(this)]));
  }

  compileMain(formats,protos) {
    const this$ = this;
    if (formats.contains("dist")) {
      return this.compileDist();
    }
    ;
    let backend = sys.List.make(DefCompilerStep.type$);
    formats.each((format) => {
      if (sys.ObjUtil.equals(format, "html")) {
        backend.add(GenDocEnv.make(this$)).add(GenDocs.make(this$));
      }
      else {
        backend.add(GenDefsGrid.make(this$, format));
        if (protos) {
          backend.add(GenProtosGrid.make(this$, format));
        }
        ;
      }
      ;
      return;
    });
    return this.runBackend(backend);
  }

  compileAll() {
    let backend = this.backendAll();
    return this.runBackend(backend);
  }

  compileDist() {
    let backend = this.backendAll();
    backend.add(GenDist.make(this));
    return this.runBackend(backend);
  }

  frontend() {
    return sys.List.make(DefCompilerStep.type$, [Scan.make(this), Parse.make(this), Reflect.make(this), Index.make(this), Resolve.make(this), Taxonify.make(this), ApplyX.make(this), Normalize.make(this), Inherit.make(this), Validate.make(this), GenNamespace.make(this), GenProtos.make(this)]);
  }

  backendAll() {
    const this$ = this;
    let acc = sys.List.make(DefCompilerStep.type$);
    acc.add(GenDocEnv.make(this));
    acc.add(GenDocs.make(this));
    GenGrid.formats().each((format) => {
      acc.add(GenDefsGrid.make(this$, format));
      acc.add(GenProtosGrid.make(this$, format));
      return;
    });
    return acc;
  }

  runBackend(backend) {
    return this.run(this.frontend().addAll(backend));
  }

  run(steps) {
    const this$ = this;
    try {
      let t1 = sys.Duration.now();
      this.#genDocEnv = steps.any((step) => {
        return sys.ObjUtil.is(step, GenDocEnv.type$);
      });
      this.#genProtos = (this.#genDocEnv || steps.any((step) => {
        return sys.ObjUtil.is(step, GenProtosGrid.type$);
      }));
      steps.each((step) => {
        step.run();
        return;
      });
      let t2 = sys.Duration.now();
      this.info(sys.Str.plus(sys.Str.plus("Compiled defs [", this.stats(t2.minus(t1))), "]"));
      return this;
    }
    catch ($_u1) {
      $_u1 = sys.Err.make($_u1);
      if ($_u1 instanceof CompilerErr) {
        let e = $_u1;
        ;
        throw e;
      }
      else if ($_u1 instanceof sys.Err) {
        let e = $_u1;
        ;
        throw this.err("Internal compiler error", CLoc.none(), e);
      }
      else {
        throw $_u1;
      }
    }
    ;
  }

  stats(dur) {
    let s = sys.StrBuf.make();
    s.add(sys.ObjUtil.coerce(this.#libs.size(), sys.Obj.type$.toNullable())).add(" libs, ");
    if (this.#index != null) {
      s.add(sys.ObjUtil.coerce(this.#index.defs().size(), sys.Obj.type$.toNullable())).add(" defs, ");
    }
    ;
    if ((this.#index != null && this.#index.hasProtos())) {
      s.add(sys.ObjUtil.coerce(this.#index.protos().size(), sys.Obj.type$.toNullable())).add(" protos, ");
    }
    ;
    s.add(dur.toLocale());
    return s.toStr();
  }

  info(msg) {
    this.#log.info(msg);
    return;
  }

  warn(msg,loc,cause) {
    if (cause === undefined) cause = null;
    this.#log.warn(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " ["), loc), "]"), cause);
    return;
  }

  err(msg,loc,cause) {
    if (cause === undefined) cause = null;
    let err = CompilerErr.make(msg, loc, cause);
    this.#errs.add(err);
    this.#log.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " ["), loc), "]"), cause);
    return err;
  }

  err2(msg,loc1,loc2,cause) {
    if (cause === undefined) cause = null;
    let err = CompilerErr.make(msg, loc1, cause);
    this.#errs.add(err);
    this.#log.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " ["), loc1), ", "), loc2), "]"), cause);
    return err;
  }

  initOutDir() {
    if (this.#initOutDir$Store === undefined) {
      this.#initOutDir$Store = this.initOutDir$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#initOutDir$Store, sys.File.type$);
  }

  undefine($def) {
    return false;
  }

  initOutDir$Once() {
    let dir = this.#outDir;
    if (dir == null) {
      throw this.err("DefCompiler.outDir not configured", CLoc.inputs());
    }
    ;
    if (!dir.isDir()) {
      throw this.err(sys.Str.plus("DefCompiler.outDir is not dir: ", dir), CLoc.inputs());
    }
    ;
    dir.delete();
    dir.create();
    return sys.ObjUtil.coerce(dir, sys.File.type$);
  }

}

class CompilerInput extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompilerInput.type$; }

  static makeDefaults() {
    return sys.List.make(CompilerInput.type$.toNullable(), [CompilerInput.makePodName("ph"), CompilerInput.makePodName("phScience", false), CompilerInput.makePodName("phIoT", false), CompilerInput.makePodName("phIct", false), CompilerInput.makePodName("docHaystack", false)]).findNotNull();
  }

  static makePodName(podName,checked) {
    if (checked === undefined) checked = true;
    let pod = sys.Pod.find(podName, false);
    if (pod == null) {
      return null;
    }
    ;
    return CompilerInput.makePod(sys.ObjUtil.coerce(pod, sys.Pod.type$));
  }

  static makePod(pod) {
    let toc = pod.file(sys.Uri.fromStr("/doc/index.fog"), false);
    return ((this$) => { if (toc == null) return PodLibInput.make(pod); return ManualInput.make(pod); })(this);
  }

  static makeDir(dir) {
    return DirLibInput.make(dir);
  }

  static scanDir(dir) {
    let acc = sys.List.make(CompilerInput.type$);
    CompilerInput.doScanDir(acc, dir);
    return acc;
  }

  static doScanDir(acc,dir) {
    const this$ = this;
    if (dir.plus(sys.Uri.fromStr("lib.trio")).exists()) {
      acc.add(sys.ObjUtil.coerce(CompilerInput.makeDir(dir), CompilerInput.type$));
    }
    ;
    dir.listDirs().each((subDir) => {
      CompilerInput.doScanDir(acc, subDir);
      return;
    });
    return;
  }

  static parseLibMetaFile(c,file) {
    let loc = CLoc.makeFile(file);
    if (!file.exists()) {
      return c.err("Lib meta not found", sys.ObjUtil.coerce(loc, CLoc.type$));
    }
    ;
    let dicts = sys.List.make(haystack.Dict.type$);
    try {
      let reader = haystack.TrioReader.make(file.in());
      reader.factory(c.intern());
      (dicts = reader.readAllDicts());
    }
    catch ($_u3) {
      $_u3 = sys.Err.make($_u3);
      if ($_u3 instanceof sys.Err) {
        let e = $_u3;
        ;
        return c.err("Cannot parse file", sys.ObjUtil.coerce(loc, CLoc.type$), e);
      }
      else {
        throw $_u3;
      }
    }
    ;
    if (sys.ObjUtil.compareNE(dicts.size(), 1)) {
      return c.err("Must define exactly one lib dict", sys.ObjUtil.coerce(loc, CLoc.type$));
    }
    ;
    return sys.ObjUtil.coerce(dicts.first(), sys.Obj.type$);
  }

  static parseEachDict(c,file,f) {
    const this$ = this;
    let loc = CLoc.makeFile(file);
    let reader = haystack.TrioReader.make(file.in());
    if (c != null) {
      reader.factory(c.intern());
    }
    ;
    reader.eachDict((dict) => {
      sys.Func.call(f, dict, CLoc.make(loc.file(), reader.recLineNum()));
      return;
    });
    return;
  }

  static make() {
    const $self = new CompilerInput();
    CompilerInput.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class CompilerInputType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompilerInputType.type$; }

  static lib() { return CompilerInputType.vals().get(0); }

  static manual() { return CompilerInputType.vals().get(1); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new CompilerInputType();
    CompilerInputType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(CompilerInputType.type$, CompilerInputType.vals(), name$, checked);
  }

  static vals() {
    if (CompilerInputType.#vals == null) {
      CompilerInputType.#vals = sys.List.make(CompilerInputType.type$, [
        CompilerInputType.make(0, "lib", ),
        CompilerInputType.make(1, "manual", ),
      ]).toImmutable();
    }
    return CompilerInputType.#vals;
  }

  static static$init() {
    const $_u4 = CompilerInputType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class LibInput extends CompilerInput {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LibInput.type$; }

  inputType() {
    return CompilerInputType.lib();
  }

  scanFiles(c) {
    return sys.ObjUtil.coerce(sys.File.type$.emptyList(), sys.Type.find("sys::File[]"));
  }

  scanReflects(c) {
    return sys.ObjUtil.coerce(ReflectInput.type$.emptyList(), sys.Type.find("defc::ReflectInput[]"));
  }

  scanExtra(c) {
    return sys.ObjUtil.coerce(haystack.Dict.type$.emptyList(), sys.Type.find("haystack::Dict[]"));
  }

  adapt(c,dict,loc) {
    return null;
  }

  static make() {
    const $self = new LibInput();
    LibInput.make$($self);
    return $self;
  }

  static make$($self) {
    CompilerInput.make$($self);
    return;
  }

}

class ReflectInput extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ReflectInput.type$; }

  typeFacet() {
    return null;
  }

  fieldFacet() {
    return null;
  }

  methodFacet() {
    return null;
  }

  addMeta(symbol,acc) {
    return;
  }

  onDef(slot,$def) {
    return;
  }

  static make() {
    const $self = new ReflectInput();
    ReflectInput.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DirLibInput extends LibInput {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DirLibInput.type$; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  static make(dir) {
    const $self = new DirLibInput();
    DirLibInput.make$($self,dir);
    return $self;
  }

  static make$($self,dir) {
    LibInput.make$($self);
    if (!dir.isDir()) {
      throw sys.ArgErr.make(sys.Str.plus("Not dir: ", dir));
    }
    ;
    $self.#dir = dir;
    $self.#loc = sys.ObjUtil.coerce(CLoc.makeFile(dir), CLoc.type$);
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("DirLibInput [", this.#dir.osPath()), "]");
  }

  scanMeta(c) {
    let meta = CompilerInput.parseLibMetaFile(c, this.#dir.plus(sys.Uri.fromStr("lib.trio")));
    if ((sys.ObjUtil.is(meta, haystack.Dict.type$) && sys.ObjUtil.coerce(meta, haystack.Dict.type$).missing("version"))) {
      (meta = haystack.Etc.dictSet(sys.ObjUtil.coerce(meta, haystack.Dict.type$.toNullable()), "version", this.tryVersionFromEtc()));
    }
    ;
    return meta;
  }

  tryVersionFromEtc() {
    for (let dir = this.#dir.parent(); dir != null; (dir = dir.parent())) {
      let config = dir.plus(sys.Uri.fromStr("etc/build/config.props"));
      if (config.exists()) {
        return sys.ObjUtil.coerce(((this$) => { let $_u5 = config.readProps().get("buildVersion"); if ($_u5 != null) return $_u5; return "0.0"; })(this), sys.Str.type$);
      }
      ;
    }
    ;
    return "0.0";
  }

  scanFiles(c) {
    const this$ = this;
    return this.#dir.listFiles().findAll((file) => {
      return (sys.ObjUtil.equals(file.ext(), "trio") && sys.ObjUtil.compareNE(file.name(), "lib.trio"));
    });
  }

}

class PodLibInput extends LibInput {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PodLibInput.type$; }

  #pod = null;

  pod() { return this.#pod; }

  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  static make(p) {
    const $self = new PodLibInput();
    PodLibInput.make$($self,p);
    return $self;
  }

  static make$($self,p) {
    LibInput.make$($self);
    $self.#pod = p;
    $self.#loc = CLoc.make(sys.Str.plus(sys.Str.plus("", $self.#pod), "::/lib/lib.trio"));
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("PodLibInput [", this.#pod), "]");
  }

  scanMeta(c) {
    let libFile = this.#pod.file(sys.Uri.fromStr("/lib/lib.trio"), false);
    if (libFile == null) {
      return c.err("No lib.trio found", CLoc.make(this.#pod.name()));
    }
    ;
    let meta = sys.ObjUtil.as(CompilerInput.parseLibMetaFile(c, sys.ObjUtil.coerce(libFile, sys.File.type$)), haystack.Dict.type$);
    if (meta != null) {
      if (meta.missing("version")) {
        (meta = haystack.Etc.dictSet(meta, "version", this.#pod.version().toStr()));
      }
      ;
      if (meta.missing("baseUri")) {
        (meta = haystack.Etc.dictSet(meta, "baseUri", sys.Str.toUri(sys.Str.plus("/def/", meta.trap("def", sys.List.make(sys.Obj.type$.toNullable(), []))))));
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(meta, sys.Obj.type$);
  }

  scanFiles(c) {
    const this$ = this;
    let libDir = "/lib/";
    return this.#pod.files().findAll((file) => {
      return (sys.ObjUtil.equals(file.ext(), "trio") && sys.ObjUtil.compareNE(file.name(), "lib.trio") && sys.Str.startsWith(file.pathStr(), libDir));
    });
  }

}

class ManualInput extends CompilerInput {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ManualInput.type$; }

  #pod = null;

  pod() { return this.#pod; }

  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  static make(p) {
    const $self = new ManualInput();
    ManualInput.make$($self,p);
    return $self;
  }

  static make$($self,p) {
    CompilerInput.make$($self);
    $self.#pod = p;
    return;
  }

  inputType() {
    return CompilerInputType.manual();
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("ManualInput [", this.#pod), "]");
  }

}

class Main extends util.AbstractMain {
  constructor() {
    super();
    const this$ = this;
    this.#outDir = sys.Env.cur().workDir().plus(sys.Uri.fromStr("doc-def/"));
    this.#output = "html";
    return;
  }

  typeof() { return Main.type$; }

  #version = false;

  version(it) {
    if (it === undefined) {
      return this.#version;
    }
    else {
      this.#version = it;
      return;
    }
  }

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

  #protos = false;

  protos(it) {
    if (it === undefined) {
      return this.#protos;
    }
    else {
      this.#protos = it;
      return;
    }
  }

  #specs = false;

  specs(it) {
    if (it === undefined) {
      return this.#specs;
    }
    else {
      this.#specs = it;
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

  run() {
    const this$ = this;
    if (this.#version) {
      return this.printVersion(sys.Env.cur().out());
    }
    ;
    let c = DefCompiler.make();
    c.outDir(this.#outDir);
    c.includeSpecs(this.#specs);
    if (this.#inputs != null) {
      c.inputs(sys.ObjUtil.coerce(this.#inputs.flatMap((x) => {
        let pod = sys.Pod.find(x, false);
        if (pod != null) {
          return sys.List.make(CompilerInput.type$.toNullable(), [CompilerInput.makePodName(x)]);
        }
        ;
        let dir = sys.File.make(sys.Str.toUri(x), false);
        if (dir.exists()) {
          return CompilerInput.scanDir(sys.ObjUtil.coerce(dir, sys.File.type$));
        }
        ;
        throw sys.Err.make(sys.Str.plus("Unknown input pod or dir: ", x));
      }, sys.Type.find("defc::CompilerInput[]")), sys.Type.find("defc::CompilerInput[]")));
    }
    ;
    if (sys.Str.isEmpty(this.#output)) {
      this.#output = "html";
    }
    ;
    try {
      c.compileMain(sys.Str.split(this.#output, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())), this.#protos);
      return 0;
    }
    catch ($_u6) {
      $_u6 = sys.Err.make($_u6);
      if ($_u6 instanceof CompilerErr) {
        let e = $_u6;
        ;
        c.log().err(sys.Str.plus(sys.Str.plus("Compile failed [", sys.ObjUtil.coerce(c.errs().size(), sys.Obj.type$.toNullable())), " errors]"));
        return 1;
      }
      else {
        throw $_u6;
      }
    }
    ;
  }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    let r = util.AbstractMain.prototype.usage.call(this, out);
    out.printLine("Examples:");
    out.printLine("  defc                           // generate html from ph pods");
    out.printLine("  defc -output turtle            // generate defs.ttl from ph pods");
    out.printLine("  defc -output turtle,zinc       // generate defs.ttl + defs.zinc from ph pods");
    out.printLine("  defc -output turtle,html       // generate defs.ttl + HTML docs from ph pods");
    out.printLine("  defc -output turtle /src-dir   // generate defs.ttl from source directory");
    return r;
  }

  printVersion(out) {
    out.printLine();
    out.printLine("Project Haystack Def Compiler");
    out.printLine("Copyright (c) 2018-2021, SkyFoundry LLC");
    out.printLine("Licensed under the Academic Free License version 3.0");
    out.printLine();
    out.printLine(sys.Str.plus("defc.version:     ", sys.ObjUtil.typeof(this).pod().version()));
    out.printLine(sys.Str.plus("java.version:     ", sys.Env.cur().vars().get("java.version")));
    out.printLine(sys.Str.plus("java.vm.name:     ", sys.Env.cur().vars().get("java.vm.name")));
    out.printLine(sys.Str.plus("java.home:        ", sys.Env.cur().vars().get("java.home")));
    out.printLine(sys.Str.plus("fan.version:      ", sys.Pod.find("sys").version()));
    out.printLine(sys.Str.plus("fan.platform:     ", sys.Env.cur().platform()));
    out.printLine(sys.Str.plus("fan.homeDir:      ", sys.Env.cur().homeDir().osPath()));
    out.printLine(sys.Str.plus("fan.workDir:      ", sys.Env.cur().workDir().osPath()));
    out.printLine();
    out.flush();
    return 1;
  }

  static make() {
    const $self = new Main();
    Main.make$($self);
    return $self;
  }

  static make$($self) {
    util.AbstractMain.make$($self);
    ;
    return;
  }

}

class CSymbol extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CSymbol.type$; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  #parts = null;

  parts() { return this.#parts; }

  __parts(it) { if (it === undefined) return this.#parts; else this.#parts = it; }

  static make(val,parts) {
    const $self = new CSymbol();
    CSymbol.make$($self,val,parts);
    return $self;
  }

  static make$($self,val,parts) {
    $self.#val = val;
    $self.#parts = sys.ObjUtil.coerce(((this$) => { let $_u7 = parts; if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(parts); })($self), sys.Type.find("defc::CSymbol[]"));
    return;
  }

  type() {
    return this.#val.type();
  }

  name() {
    return this.#val.name();
  }

  hash() {
    return sys.Str.hash(this.toStr());
  }

  equals(that) {
    return (sys.ObjUtil.is(that, CSymbol.type$) && sys.ObjUtil.equals(this.toStr(), sys.ObjUtil.toStr(that)));
  }

  toStr() {
    return this.#val.toStr();
  }

}

class CSymbolFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#cache = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::CSymbol"));
    return;
  }

  typeof() { return CSymbolFactory.type$; }

  #intern = null;

  // private field reflection only
  __intern(it) { if (it === undefined) return this.#intern; else this.#intern = it; }

  #cache = null;

  // private field reflection only
  __cache(it) { if (it === undefined) return this.#cache; else this.#cache = it; }

  static make(intern) {
    const $self = new CSymbolFactory();
    CSymbolFactory.make$($self,intern);
    return $self;
  }

  static make$($self,intern) {
    ;
    $self.#intern = intern;
    return;
  }

  parse(str) {
    let symbol = this.#cache.get(str);
    if (symbol != null) {
      return sys.ObjUtil.coerce(symbol, CSymbol.type$);
    }
    ;
    this.#cache.set(str, sys.ObjUtil.coerce((symbol = this.norm(sys.ObjUtil.coerce(haystack.Symbol.fromStr(this.#intern.makeId(str)), haystack.Symbol.type$))), CSymbol.type$));
    return sys.ObjUtil.coerce(symbol, CSymbol.type$);
  }

  norm(val) {
    let symbol = this.#cache.get(val.toStr());
    if (symbol != null) {
      return sys.ObjUtil.coerce(symbol, CSymbol.type$);
    }
    ;
    this.#cache.set(val.toStr(), sys.ObjUtil.coerce((symbol = this.doNorm(val)), CSymbol.type$));
    return sys.ObjUtil.coerce(symbol, CSymbol.type$);
  }

  doNorm(val) {
    let $_u8 = val.type();
    if (sys.ObjUtil.equals($_u8, haystack.SymbolType.tag())) {
      return CSymbol.make(val, sys.ObjUtil.coerce(CSymbol.type$.emptyList(), sys.Type.find("defc::CSymbol[]")));
    }
    else if (sys.ObjUtil.equals($_u8, haystack.SymbolType.conjunct())) {
      return this.parseConjunct(val);
    }
    else if (sys.ObjUtil.equals($_u8, haystack.SymbolType.key())) {
      return this.parseKey(val);
    }
    else {
      throw sys.ParseErr.make(val.toStr());
    }
    ;
  }

  parseKey(val) {
    return CSymbol.make(val, sys.List.make(CSymbol.type$, [this.parseName(val.part(0)), this.parseName(val.part(1))]));
  }

  parseTerm(val) {
    let symbol = this.parse(sys.Str.toStr(val));
    if (symbol.type().isTerm()) {
      return symbol;
    }
    ;
    throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid term ", sys.Str.toCode(sys.Str.toStr(val))), " within symbol"));
  }

  parseConjunct(val) {
    let parts = sys.List.make(CSymbol.type$);
    parts.capacity(val.size());
    for (let i = 0; sys.ObjUtil.compareLT(i, val.size()); i = sys.Int.increment(i)) {
      parts.add(this.parseName(val.part(i)));
    }
    ;
    return CSymbol.make(val, parts);
  }

  parseName(str) {
    if (!haystack.Etc.isTagName(str)) {
      throw sys.ParseErr.make(sys.Str.plus(sys.Str.plus("Invalid name ", sys.Str.toCode(str)), " within symbol"));
    }
    ;
    return this.parse(str);
  }

}

class CDef extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#fandoc = CFandoc.none();
    return;
  }

  typeof() { return CDef.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

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

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  #parts = null;

  parts(it) {
    if (it === undefined) {
      return this.#parts;
    }
    else {
      this.#parts = it;
      return;
    }
  }

  #fault = false;

  fault(it) {
    if (it === undefined) {
      return this.#fault;
    }
    else {
      this.#fault = it;
      return;
    }
  }

  #aux = null;

  aux(it) {
    if (it === undefined) {
      return this.#aux;
    }
    else {
      this.#aux = it;
      return;
    }
  }

  #declared = null;

  declared() { return this.#declared; }

  __declared(it) { if (it === undefined) return this.#declared; else this.#declared = it; }

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

  #supertypes = null;

  supertypes(it) {
    if (it === undefined) {
      return this.#supertypes;
    }
    else {
      this.#supertypes = it;
      return;
    }
  }

  #inheritance = null;

  inheritance(it) {
    if (it === undefined) {
      return this.#inheritance;
    }
    else {
      this.#inheritance = it;
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

  #fandoc = null;

  fandoc(it) {
    if (it === undefined) {
      return this.#fandoc;
    }
    else {
      this.#fandoc = it;
      return;
    }
  }

  #children = null;

  children(it) {
    if (it === undefined) {
      return this.#children;
    }
    else {
      this.#children = it;
      return;
    }
  }

  #isInherited = false;

  isInherited(it) {
    if (it === undefined) {
      return this.#isInherited;
    }
    else {
      this.#isInherited = it;
      return;
    }
  }

  #actualRef = null;

  actualRef(it) {
    if (it === undefined) {
      return this.#actualRef;
    }
    else {
      this.#actualRef = it;
      return;
    }
  }

  #doc = null;

  doc(it) {
    if (it === undefined) {
      return this.#doc;
    }
    else {
      this.#doc = it;
      return;
    }
  }

  static make(loc,lib,symbol,declared) {
    const $self = new CDef();
    CDef.make$($self,loc,lib,symbol,declared);
    return $self;
  }

  static make$($self,loc,lib,symbol,declared) {
    ;
    $self.#loc = loc;
    $self.#lib = lib;
    $self.#symbol = symbol;
    $self.#declared = declared;
    return;
  }

  static makeLib(loc,symbol,declared) {
    const $self = new CDef();
    CDef.makeLib$($self,loc,symbol,declared);
    return $self;
  }

  static makeLib$($self,loc,symbol,declared) {
    ;
    $self.#loc = loc;
    $self.#lib = sys.ObjUtil.coerce($self, CLib.type$);
    $self.#symbol = symbol;
    $self.#declared = declared;
    return;
  }

  isLib() {
    return this === this.#lib;
  }

  name() {
    return this.#symbol.name();
  }

  type() {
    return this.#symbol.type();
  }

  isKey() {
    return this.type().isKey();
  }

  key() {
    return this.#parts.key();
  }

  conjunct() {
    return this.#parts.conjunct();
  }

  has(name) {
    return this.#meta.get(name) != null;
  }

  get(name) {
    return ((this$) => { let $_u9=this$.#meta.get(name); return ($_u9==null) ? null : $_u9.val(); })(this);
  }

  set(tag,val) {
    this.#meta.set(tag.name(), CPair.make(tag.name(), tag, val));
    return;
  }

  isAssociation() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, CDefFlags.association()), 0);
  }

  isChoice() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, CDefFlags.choice()), 0);
  }

  isEntity() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, CDefFlags.entity()), 0);
  }

  isFeature() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, CDefFlags.feature()), 0);
  }

  isList() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, CDefFlags.list()), 0);
  }

  isMarker() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, CDefFlags.marker()), 0);
  }

  isRef() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, CDefFlags.ref()), 0);
  }

  isRelationship() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, CDefFlags.relationship()), 0);
  }

  isVal() {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, CDefFlags.val()), 0);
  }

  fits(that) {
    return this.#inheritance.contains(that);
  }

  compare(that) {
    return sys.ObjUtil.compare(this.toStr(), sys.ObjUtil.toStr(that));
  }

  toStr() {
    return this.#symbol.toStr();
  }

  dis() {
    return this.#symbol.toStr();
  }

  isNoDoc() {
    return this.has("nodoc");
  }

  actual(ns) {
    if (this.#actualRef == null) {
      this.#actualRef = ns.def(this.#symbol.toStr());
    }
    ;
    return sys.ObjUtil.coerce(this.#actualRef, haystack.Def.type$);
  }

}

class CDefFlags extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CDefFlags.type$; }

  static #association = undefined;

  static association() {
    if (CDefFlags.#association === undefined) {
      CDefFlags.static$init();
      if (CDefFlags.#association === undefined) CDefFlags.#association = 0;
    }
    return CDefFlags.#association;
  }

  static #choice = undefined;

  static choice() {
    if (CDefFlags.#choice === undefined) {
      CDefFlags.static$init();
      if (CDefFlags.#choice === undefined) CDefFlags.#choice = 0;
    }
    return CDefFlags.#choice;
  }

  static #entity = undefined;

  static entity() {
    if (CDefFlags.#entity === undefined) {
      CDefFlags.static$init();
      if (CDefFlags.#entity === undefined) CDefFlags.#entity = 0;
    }
    return CDefFlags.#entity;
  }

  static #feature = undefined;

  static feature() {
    if (CDefFlags.#feature === undefined) {
      CDefFlags.static$init();
      if (CDefFlags.#feature === undefined) CDefFlags.#feature = 0;
    }
    return CDefFlags.#feature;
  }

  static #list = undefined;

  static list() {
    if (CDefFlags.#list === undefined) {
      CDefFlags.static$init();
      if (CDefFlags.#list === undefined) CDefFlags.#list = 0;
    }
    return CDefFlags.#list;
  }

  static #marker = undefined;

  static marker() {
    if (CDefFlags.#marker === undefined) {
      CDefFlags.static$init();
      if (CDefFlags.#marker === undefined) CDefFlags.#marker = 0;
    }
    return CDefFlags.#marker;
  }

  static #ref = undefined;

  static ref() {
    if (CDefFlags.#ref === undefined) {
      CDefFlags.static$init();
      if (CDefFlags.#ref === undefined) CDefFlags.#ref = 0;
    }
    return CDefFlags.#ref;
  }

  static #relationship = undefined;

  static relationship() {
    if (CDefFlags.#relationship === undefined) {
      CDefFlags.static$init();
      if (CDefFlags.#relationship === undefined) CDefFlags.#relationship = 0;
    }
    return CDefFlags.#relationship;
  }

  static #val = undefined;

  static val() {
    if (CDefFlags.#val === undefined) {
      CDefFlags.static$init();
      if (CDefFlags.#val === undefined) CDefFlags.#val = 0;
    }
    return CDefFlags.#val;
  }

  static compute($def) {
    const this$ = this;
    let mask = 0;
    $def.inheritance().each((base) => {
      let $_u10 = base.name();
      if (sys.ObjUtil.equals($_u10, "association")) {
        (mask = sys.Int.or(mask, CDefFlags.association()));
      }
      else if (sys.ObjUtil.equals($_u10, "choice")) {
        (mask = sys.Int.or(mask, CDefFlags.choice()));
      }
      else if (sys.ObjUtil.equals($_u10, "entity")) {
        (mask = sys.Int.or(mask, CDefFlags.entity()));
      }
      else if (sys.ObjUtil.equals($_u10, "feature")) {
        (mask = sys.Int.or(mask, CDefFlags.feature()));
      }
      else if (sys.ObjUtil.equals($_u10, "list")) {
        (mask = sys.Int.or(mask, CDefFlags.list()));
      }
      else if (sys.ObjUtil.equals($_u10, "marker")) {
        (mask = sys.Int.or(mask, CDefFlags.marker()));
      }
      else if (sys.ObjUtil.equals($_u10, "ref")) {
        (mask = sys.Int.or(mask, CDefFlags.ref()));
      }
      else if (sys.ObjUtil.equals($_u10, "relationship")) {
        (mask = sys.Int.or(mask, CDefFlags.relationship()));
      }
      else if (sys.ObjUtil.equals($_u10, "val")) {
        (mask = sys.Int.or(mask, CDefFlags.val()));
      }
      ;
      return;
    });
    return mask;
  }

  static flagsToStr(flags) {
    const this$ = this;
    let s = sys.StrBuf.make();
    CDefFlags.type$.fields().each((f) => {
      if ((f.isStatic() && sys.ObjUtil.equals(f.type(), sys.Int.type$) && sys.ObjUtil.compareNE(sys.Int.and(flags, sys.ObjUtil.coerce(f.get(null), sys.Int.type$)), 0))) {
        s.join(f.name(), ",");
      }
      ;
      return;
    });
    return sys.Str.plus(sys.Str.plus(s.toStr(), " 0x"), sys.Int.toHex(flags));
  }

  static make() {
    const $self = new CDefFlags();
    CDefFlags.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    CDefFlags.#association = 1;
    CDefFlags.#choice = 2;
    CDefFlags.#entity = 4;
    CDefFlags.#feature = 8;
    CDefFlags.#list = 16;
    CDefFlags.#marker = 32;
    CDefFlags.#ref = 64;
    CDefFlags.#relationship = 128;
    CDefFlags.#val = 256;
    return;
  }

}

class CPair extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CPair.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

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

  #tag = null;

  tag(it) {
    if (it === undefined) {
      return this.#tag;
    }
    else {
      this.#tag = it;
      return;
    }
  }

  static make(name,tag,val) {
    const $self = new CPair();
    CPair.make$($self,name,tag,val);
    return $self;
  }

  static make$($self,name,tag,val) {
    $self.#name = name;
    $self.#tag = tag;
    $self.#val = val;
    return;
  }

  isInherited() {
    return (this.#tag != null && this.#tag.declared().missing("notInherited"));
  }

  isAccumulate() {
    return (this.#tag != null && this.#tag.declared().has("accumulate"));
  }

  accumulate(that) {
    if (this.#tag !== that.#tag) {
      throw sys.Err.make(this.#name);
    }
    ;
    if (!this.#tag.isList()) {
      throw sys.Err.make(sys.Str.plus("Cannot accumulate non-list tag: ", this.#tag));
    }
    ;
    return CPair.make(this.#name, this.#tag, def.DefUtil.accumulate(this.#val, that.#val));
  }

  tagOrName() {
    return sys.ObjUtil.coerce(((this$) => { let $_u11 = this$.#tag; if ($_u11 != null) return $_u11; return this$.#name; })(this), sys.Obj.type$);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), ": "), this.#val);
  }

}

class CDefX extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CDefX.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

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

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  #declared = null;

  declared() { return this.#declared; }

  __declared(it) { if (it === undefined) return this.#declared; else this.#declared = it; }

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

  static make(loc,lib,symbol,declared) {
    const $self = new CDefX();
    CDefX.make$($self,loc,lib,symbol,declared);
    return $self;
  }

  static make$($self,loc,lib,symbol,declared) {
    $self.#loc = loc;
    $self.#lib = lib;
    $self.#symbol = symbol;
    $self.#declared = declared;
    return;
  }

}

class CProto extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CProto.type$; }

  #dict = null;

  dict() { return this.#dict; }

  __dict(it) { if (it === undefined) return this.#dict; else this.#dict = it; }

  #hashKey = null;

  hashKey() { return this.#hashKey; }

  __hashKey(it) { if (it === undefined) return this.#hashKey; else this.#hashKey = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #loc = null;

  loc(it) {
    if (it === undefined) {
      return this.#loc;
    }
    else {
      this.#loc = it;
      return;
    }
  }

  #implements = null;

  implements(it) {
    if (it === undefined) {
      return this.#implements;
    }
    else {
      this.#implements = it;
      return;
    }
  }

  #children = null;

  children(it) {
    if (it === undefined) {
      return this.#children;
    }
    else {
      this.#children = it;
      return;
    }
  }

  #docName = null;

  docName() { return this.#docName; }

  __docName(it) { if (it === undefined) return this.#docName; else this.#docName = it; }

  #doc = null;

  doc(it) {
    if (it === undefined) {
      return this.#doc;
    }
    else {
      this.#doc = it;
      return;
    }
  }

  static make(hashKey,dict,implements$) {
    const $self = new CProto();
    CProto.make$($self,hashKey,dict,implements$);
    return $self;
  }

  static make$($self,hashKey,dict,implements$) {
    $self.#hashKey = hashKey;
    $self.#dict = dict;
    $self.#dis = CProto.encode(dict, false);
    $self.#docName = CProto.toDocName(dict);
    $self.#implements = implements$;
    return;
  }

  static toHashKey(d) {
    return CProto.encode(d, true);
  }

  static encode(d,sort) {
    const this$ = this;
    let s = sys.StrBuf.make();
    let names = sys.List.make(sys.Str.type$);
    d.each((v,n) => {
      names.add(n);
      return;
    });
    if (sort) {
      names.sort();
    }
    ;
    names.each((n) => {
      let v = d.get(n);
      if (v == null) {
        return;
      }
      ;
      if (!s.isEmpty()) {
        s.addChar(32);
      }
      ;
      s.add(n);
      if (sys.ObjUtil.compareNE(v, haystack.Marker.val())) {
        s.addChar(58).add(haystack.ZincWriter.valToStr(v));
      }
      ;
      return;
    });
    return s.toStr();
  }

  static toDocName(d) {
    const this$ = this;
    let s = sys.StrBuf.make();
    let first = true;
    d.each((v,n) => {
      if (first) {
        (first = false);
      }
      else {
        s.addChar(45);
      }
      ;
      s.add(n);
      if (sys.ObjUtil.compareNE(v, haystack.Marker.val())) {
        s.addChar(126).add(sys.Str.toBuf(haystack.ZincWriter.valToStr(v)).toHex());
      }
      ;
      return;
    });
    return s.toStr();
  }

  toStr() {
    return this.#dis;
  }

  setLoc(x) {
    if (x != null) {
      this.#loc = x;
    }
    ;
    return this;
  }

}

class CUnit extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#files = sys.List.make(sys.File.type$);
    return;
  }

  typeof() { return CUnit.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

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

  #includesList = null;

  // private field reflection only
  __includesList(it) { if (it === undefined) return this.#includesList; else this.#includesList = it; }

  static make(name) {
    const $self = new CUnit();
    CUnit.make$($self,name);
    return $self;
  }

  static make$($self,name) {
    ;
    $self.#name = name;
    return;
  }

  includes() {
    if (this.#includesList == null) {
      throw sys.Err.make("Resolve.resolveDepends step not run");
    }
    ;
    return sys.ObjUtil.coerce(this.#includesList, sys.Type.find("defc::CUnit[]"));
  }

  resolveDepends(includes) {
    this.#includesList = includes;
    return;
  }

}

class CDefRef extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CDefRef.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #symbol = null;

  symbol() { return this.#symbol; }

  __symbol(it) { if (it === undefined) return this.#symbol; else this.#symbol = it; }

  #resolved = null;

  // private field reflection only
  __resolved(it) { if (it === undefined) return this.#resolved; else this.#resolved = it; }

  static makeResolved(loc,symbol,$def) {
    const $self = new CDefRef();
    CDefRef.makeResolved$($self,loc,symbol,$def);
    return $self;
  }

  static makeResolved$($self,loc,symbol,$def) {
    $self.#loc = loc;
    $self.#symbol = symbol;
    $self.#resolved = $def;
    return;
  }

  deref() {
    return sys.ObjUtil.coerce(((this$) => { let $_u12 = this$.#resolved; if ($_u12 != null) return $_u12; throw sys.Err.make(sys.Str.plus("Not resolved yet: ", this$.toStr())); })(this), CDef.type$);
  }

  toStr() {
    return this.#symbol.toStr();
  }

}

class CDefParts extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CDefParts.type$; }

  #def = null;

  def(it) {
    if (it === undefined) {
      return this.#def;
    }
    else {
      this.#def = it;
      return;
    }
  }

  static make($def) {
    const $self = new CDefParts();
    CDefParts.make$($self,$def);
    return $self;
  }

  static make$($self,$def) {
    $self.#def = $def;
    return;
  }

  key() {
    throw sys.Err.make(sys.Str.plus("Not key: ", this.#def));
  }

  conjunct() {
    throw sys.Err.make(sys.Str.plus("Not conjunct: ", this.#def));
  }

}

class CKeyParts extends CDefParts {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CKeyParts.type$; }

  #feature = null;

  feature(it) {
    if (it === undefined) {
      return this.#feature;
    }
    else {
      this.#feature = it;
      return;
    }
  }

  static make($def,feature) {
    const $self = new CKeyParts();
    CKeyParts.make$($self,$def,feature);
    return $self;
  }

  static make$($self,$def,feature) {
    CDefParts.make$($self, $def);
    $self.#feature = feature;
    return;
  }

  key() {
    return this;
  }

}

class CConjunctParts extends CDefParts {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CConjunctParts.type$; }

  #tags = null;

  tags(it) {
    if (it === undefined) {
      return this.#tags;
    }
    else {
      this.#tags = it;
      return;
    }
  }

  static make($def,tags) {
    const $self = new CConjunctParts();
    CConjunctParts.make$($self,$def,tags);
    return $self;
  }

  static make$($self,$def,tags) {
    CDefParts.make$($self, $def);
    $self.#tags = tags;
    return;
  }

  conjunct() {
    return this;
  }

}

class CFandoc extends compilerDoc.DocFandoc {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CFandoc.type$; }

  static #none = undefined;

  static none() {
    if (CFandoc.#none === undefined) {
      CFandoc.static$init();
      if (CFandoc.#none === undefined) CFandoc.#none = null;
    }
    return CFandoc.#none;
  }

  static make(loc,text) {
    const $self = new CFandoc();
    CFandoc.make$($self,loc,text);
    return $self;
  }

  static make$($self,loc,text) {
    compilerDoc.DocFandoc.make$($self, loc, text);
    return;
  }

  static wrap(d) {
    const $self = new CFandoc();
    CFandoc.wrap$($self,d);
    return $self;
  }

  static wrap$($self,d) {
    compilerDoc.DocFandoc.make$($self, CLoc.make(d.loc().file(), d.loc().line()), d.text());
    return;
  }

  isEmpty() {
    return sys.Str.isEmpty(this.text());
  }

  toStr() {
    return this.text();
  }

  toSummary() {
    return CFandoc.make(sys.ObjUtil.coerce(this.loc(), CLoc.type$), this.summary());
  }

  summary() {
    let t = this.text();
    if (sys.Str.isEmpty(t)) {
      return "";
    }
    ;
    let semicolon = sys.Str.index(t, ";");
    if (semicolon != null) {
      (t = sys.Str.getRange(t, sys.Range.make(0, sys.ObjUtil.coerce(semicolon, sys.Int.type$), true)));
    }
    ;
    let colon = sys.Str.index(t, ":");
    while ((colon != null && sys.ObjUtil.compareLT(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1), sys.Str.size(t)) && !sys.Int.isSpace(sys.Str.get(t, sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1))))) {
      (colon = sys.Str.index(t, ":", sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1)));
    }
    ;
    if (colon != null) {
      (t = sys.Str.getRange(t, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true)));
    }
    ;
    let period = sys.Str.index(t, ".");
    while ((period != null && sys.ObjUtil.compareLT(sys.Int.plus(sys.ObjUtil.coerce(period, sys.Int.type$), 1), sys.Str.size(t)) && !sys.Int.isSpace(sys.Str.get(t, sys.Int.plus(sys.ObjUtil.coerce(period, sys.Int.type$), 1))))) {
      (period = sys.Str.index(t, ".", sys.Int.plus(sys.ObjUtil.coerce(period, sys.Int.type$), 1)));
    }
    ;
    if (period != null) {
      (t = sys.Str.getRange(t, sys.Range.make(0, sys.ObjUtil.coerce(period, sys.Int.type$), true)));
    }
    ;
    return t;
  }

  static static$init() {
    CFandoc.#none = CFandoc.make(CLoc.none(), "");
    return;
  }

}

class CIndex extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#etc = CIndexEtc.make(this);
    return;
  }

  typeof() { return CIndex.type$; }

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

  #defs = null;

  defs(it) {
    if (it === undefined) {
      return this.#defs;
    }
    else {
      this.#defs = it;
      return;
    }
  }

  #etc = null;

  etc(it) {
    if (it === undefined) {
      return this.#etc;
    }
    else {
      this.#etc = it;
      return;
    }
  }

  #defsMap = null;

  defsMap(it) {
    if (it === undefined) {
      return this.#defsMap;
    }
    else {
      this.#defsMap = it;
      return;
    }
  }

  #protosRef = null;

  protosRef(it) {
    if (it === undefined) {
      return this.#protosRef;
    }
    else {
      this.#protosRef = it;
      return;
    }
  }

  #nsRef = null;

  nsRef(it) {
    if (it === undefined) {
      return this.#nsRef;
    }
    else {
      this.#nsRef = it;
      return;
    }
  }

  #features$Store = undefined;

  // private field reflection only
  __features$Store(it) { if (it === undefined) return this.#features$Store; else this.#features$Store = it; }

  static make(f) {
    const $self = new CIndex();
    CIndex.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    ;
    sys.Func.call(f, $self);
    return;
  }

  features() {
    if (this.#features$Store === undefined) {
      this.#features$Store = this.features$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#features$Store, sys.Type.find("defc::CDef[]"));
  }

  def(symbol,checked) {
    if (checked === undefined) checked = true;
    let $def = this.#defsMap.get(symbol);
    if ($def != null) {
      return $def;
    }
    ;
    if (checked) {
      throw haystack.UnknownDefErr.make(symbol);
    }
    ;
    return null;
  }

  subtypes($def) {
    const this$ = this;
    if (!$def.type().isTerm()) {
      return sys.ObjUtil.coerce(CDef.type$.emptyList(), sys.Type.find("defc::CDef[]"));
    }
    ;
    return this.#defs.findAll((x) => {
      if (x.type().isKey()) {
        return false;
      }
      ;
      return x.supertypes().contains($def);
    });
  }

  implements($def) {
    const this$ = this;
    if (!$def.isEntity()) {
      return null;
    }
    ;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::CDef")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:defc::CDef]"));
    $def.inheritance().each((x) => {
      if ((x === $def || x.has("mandatory"))) {
        if (x.type().isConjunct()) {
          x.conjunct().tags().each((p) => {
            acc.set(p.symbol().toStr(), p);
            return;
          });
        }
        else {
          acc.set(x.symbol().toStr(), x);
        }
        ;
      }
      ;
      return;
    });
    return acc.vals();
  }

  associationOn($def) {
    const this$ = this;
    if (!$def.isAssociation()) {
      return sys.ObjUtil.coerce(CDef.type$.emptyList(), sys.Type.find("defc::CDef[]"));
    }
    ;
    return this.#defs.findAll((x) => {
      return x.declared().get($def.name()) != null;
    });
  }

  hasProtos() {
    return this.#protosRef != null;
  }

  protos() {
    return sys.ObjUtil.coerce(((this$) => { let $_u13 = this$.#protosRef; if ($_u13 != null) return $_u13; throw sys.Err.make("Protos not avail"); })(this), sys.Type.find("defc::CProto[]"));
  }

  ns() {
    return sys.ObjUtil.coerce(((this$) => { let $_u14 = this$.#nsRef; if ($_u14 != null) return $_u14; throw sys.Err.make("Namespace not avail"); })(this), haystack.Namespace.type$);
  }

  nsMap(list) {
    const this$ = this;
    if (list.isEmpty()) {
      return sys.ObjUtil.coerce(CDef.type$.emptyList(), sys.Type.find("defc::CDef[]"));
    }
    ;
    return sys.ObjUtil.coerce(list.map((d) => {
      return sys.ObjUtil.coerce(this$.def(d.symbol().toStr()), CDef.type$);
    }, CDef.type$), sys.Type.find("defc::CDef[]"));
  }

  features$Once() {
    const this$ = this;
    return this.#defs.findAll(($def) => {
      return ($def.type().isTag() && $def.isFeature() && $def !== this$.#etc.feature());
    }).ro();
  }

}

class CIndexEtc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return CIndexEtc.type$; }

  #index = null;

  // private field reflection only
  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #association$Store = undefined;

  // private field reflection only
  __association$Store(it) { if (it === undefined) return this.#association$Store; else this.#association$Store = it; }

  #baseUri$Store = undefined;

  // private field reflection only
  __baseUri$Store(it) { if (it === undefined) return this.#baseUri$Store; else this.#baseUri$Store = it; }

  #choice$Store = undefined;

  // private field reflection only
  __choice$Store(it) { if (it === undefined) return this.#choice$Store; else this.#choice$Store = it; }

  #entity$Store = undefined;

  // private field reflection only
  __entity$Store(it) { if (it === undefined) return this.#entity$Store; else this.#entity$Store = it; }

  #enum$Store = undefined;

  // private field reflection only
  __enum$Store(it) { if (it === undefined) return this.#enum$Store; else this.#enum$Store = it; }

  #equip$Store = undefined;

  // private field reflection only
  __equip$Store(it) { if (it === undefined) return this.#equip$Store; else this.#equip$Store = it; }

  #feature$Store = undefined;

  // private field reflection only
  __feature$Store(it) { if (it === undefined) return this.#feature$Store; else this.#feature$Store = it; }

  #isDef$Store = undefined;

  // private field reflection only
  __isDef$Store(it) { if (it === undefined) return this.#isDef$Store; else this.#isDef$Store = it; }

  #lib$Store = undefined;

  // private field reflection only
  __lib$Store(it) { if (it === undefined) return this.#lib$Store; else this.#lib$Store = it; }

  #marker$Store = undefined;

  // private field reflection only
  __marker$Store(it) { if (it === undefined) return this.#marker$Store; else this.#marker$Store = it; }

  #quantity$Store = undefined;

  // private field reflection only
  __quantity$Store(it) { if (it === undefined) return this.#quantity$Store; else this.#quantity$Store = it; }

  #phenomenon$Store = undefined;

  // private field reflection only
  __phenomenon$Store(it) { if (it === undefined) return this.#phenomenon$Store; else this.#phenomenon$Store = it; }

  #point$Store = undefined;

  // private field reflection only
  __point$Store(it) { if (it === undefined) return this.#point$Store; else this.#point$Store = it; }

  #process$Store = undefined;

  // private field reflection only
  __process$Store(it) { if (it === undefined) return this.#process$Store; else this.#process$Store = it; }

  #relationship$Store = undefined;

  // private field reflection only
  __relationship$Store(it) { if (it === undefined) return this.#relationship$Store; else this.#relationship$Store = it; }

  #ref$Store = undefined;

  // private field reflection only
  __ref$Store(it) { if (it === undefined) return this.#ref$Store; else this.#ref$Store = it; }

  #space$Store = undefined;

  // private field reflection only
  __space$Store(it) { if (it === undefined) return this.#space$Store; else this.#space$Store = it; }

  #tags$Store = undefined;

  // private field reflection only
  __tags$Store(it) { if (it === undefined) return this.#tags$Store; else this.#tags$Store = it; }

  #val$Store = undefined;

  // private field reflection only
  __val$Store(it) { if (it === undefined) return this.#val$Store; else this.#val$Store = it; }

  #version$Store = undefined;

  // private field reflection only
  __version$Store(it) { if (it === undefined) return this.#version$Store; else this.#version$Store = it; }

  static make(index) {
    const $self = new CIndexEtc();
    CIndexEtc.make$($self,index);
    return $self;
  }

  static make$($self,index) {
    ;
    $self.#index = index;
    return;
  }

  association() {
    if (this.#association$Store === undefined) {
      this.#association$Store = this.association$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#association$Store, CDef.type$);
  }

  baseUri() {
    if (this.#baseUri$Store === undefined) {
      this.#baseUri$Store = this.baseUri$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#baseUri$Store, CDef.type$);
  }

  choice() {
    if (this.#choice$Store === undefined) {
      this.#choice$Store = this.choice$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#choice$Store, CDef.type$);
  }

  entity() {
    if (this.#entity$Store === undefined) {
      this.#entity$Store = this.entity$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#entity$Store, CDef.type$);
  }

  enum() {
    if (this.#enum$Store === undefined) {
      this.#enum$Store = this.enum$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#enum$Store, CDef.type$);
  }

  equip() {
    if (this.#equip$Store === undefined) {
      this.#equip$Store = this.equip$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#equip$Store, CDef.type$);
  }

  feature() {
    if (this.#feature$Store === undefined) {
      this.#feature$Store = this.feature$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#feature$Store, CDef.type$);
  }

  isDef() {
    if (this.#isDef$Store === undefined) {
      this.#isDef$Store = this.isDef$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#isDef$Store, CDef.type$);
  }

  lib() {
    if (this.#lib$Store === undefined) {
      this.#lib$Store = this.lib$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#lib$Store, CDef.type$);
  }

  marker() {
    if (this.#marker$Store === undefined) {
      this.#marker$Store = this.marker$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#marker$Store, CDef.type$);
  }

  quantity() {
    if (this.#quantity$Store === undefined) {
      this.#quantity$Store = this.quantity$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#quantity$Store, CDef.type$);
  }

  phenomenon() {
    if (this.#phenomenon$Store === undefined) {
      this.#phenomenon$Store = this.phenomenon$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#phenomenon$Store, CDef.type$);
  }

  point() {
    if (this.#point$Store === undefined) {
      this.#point$Store = this.point$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#point$Store, CDef.type$);
  }

  process() {
    if (this.#process$Store === undefined) {
      this.#process$Store = this.process$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#process$Store, CDef.type$);
  }

  relationship() {
    if (this.#relationship$Store === undefined) {
      this.#relationship$Store = this.relationship$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#relationship$Store, CDef.type$);
  }

  ref() {
    if (this.#ref$Store === undefined) {
      this.#ref$Store = this.ref$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#ref$Store, CDef.type$);
  }

  space() {
    if (this.#space$Store === undefined) {
      this.#space$Store = this.space$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#space$Store, CDef.type$);
  }

  tags() {
    if (this.#tags$Store === undefined) {
      this.#tags$Store = this.tags$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#tags$Store, CDef.type$);
  }

  val() {
    if (this.#val$Store === undefined) {
      this.#val$Store = this.val$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#val$Store, CDef.type$);
  }

  version() {
    if (this.#version$Store === undefined) {
      this.#version$Store = this.version$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#version$Store, CDef.type$);
  }

  association$Once() {
    return sys.ObjUtil.coerce(this.#index.def("association"), CDef.type$);
  }

  baseUri$Once() {
    return sys.ObjUtil.coerce(this.#index.def("baseUri"), CDef.type$);
  }

  choice$Once() {
    return sys.ObjUtil.coerce(this.#index.def("choice"), CDef.type$);
  }

  entity$Once() {
    return sys.ObjUtil.coerce(this.#index.def("entity"), CDef.type$);
  }

  enum$Once() {
    return sys.ObjUtil.coerce(this.#index.def("enum"), CDef.type$);
  }

  equip$Once() {
    return sys.ObjUtil.coerce(this.#index.def("equip"), CDef.type$);
  }

  feature$Once() {
    return sys.ObjUtil.coerce(this.#index.def("feature"), CDef.type$);
  }

  isDef$Once() {
    return sys.ObjUtil.coerce(this.#index.def("is"), CDef.type$);
  }

  lib$Once() {
    return sys.ObjUtil.coerce(this.#index.def("lib"), CDef.type$);
  }

  marker$Once() {
    return sys.ObjUtil.coerce(this.#index.def("marker"), CDef.type$);
  }

  quantity$Once() {
    return sys.ObjUtil.coerce(this.#index.def("quantity"), CDef.type$);
  }

  phenomenon$Once() {
    return sys.ObjUtil.coerce(this.#index.def("phenomenon"), CDef.type$);
  }

  point$Once() {
    return sys.ObjUtil.coerce(this.#index.def("point"), CDef.type$);
  }

  process$Once() {
    return sys.ObjUtil.coerce(this.#index.def("process"), CDef.type$);
  }

  relationship$Once() {
    return sys.ObjUtil.coerce(this.#index.def("relationship"), CDef.type$);
  }

  ref$Once() {
    return sys.ObjUtil.coerce(this.#index.def("ref"), CDef.type$);
  }

  space$Once() {
    return sys.ObjUtil.coerce(this.#index.def("space"), CDef.type$);
  }

  tags$Once() {
    return sys.ObjUtil.coerce(this.#index.def("tags"), CDef.type$);
  }

  val$Once() {
    return sys.ObjUtil.coerce(this.#index.def("val"), CDef.type$);
  }

  version$Once() {
    return sys.ObjUtil.coerce(this.#index.def("version"), CDef.type$);
  }

}

class CLoc extends compilerDoc.DocLoc {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CLoc.type$; }

  static #none = undefined;

  static none() {
    if (CLoc.#none === undefined) {
      CLoc.static$init();
      if (CLoc.#none === undefined) CLoc.#none = null;
    }
    return CLoc.#none;
  }

  static #inputs = undefined;

  static inputs() {
    if (CLoc.#inputs === undefined) {
      CLoc.static$init();
      if (CLoc.#inputs === undefined) CLoc.#inputs = null;
    }
    return CLoc.#inputs;
  }

  static makeFile(file) {
    let uri = file.uri();
    let name = ((this$) => { if (sys.ObjUtil.equals(uri.scheme(), "fan")) return sys.Str.plus(sys.Str.plus(sys.Str.plus("", uri.host()), "::"), uri.pathStr()); return file.osPath(); })(this);
    return CLoc.make(sys.ObjUtil.coerce(name, sys.Str.type$));
  }

  static makeFileLoc(loc) {
    return CLoc.make(loc.file(), loc.line());
  }

  static make(file,line) {
    const $self = new CLoc();
    CLoc.make$($self,file,line);
    return $self;
  }

  static make$($self,file,line) {
    if (line === undefined) line = 0;
    compilerDoc.DocLoc.make$($self, file, line);
    return;
  }

  static static$init() {
    CLoc.#none = CLoc.make("unknown", 0);
    CLoc.#inputs = CLoc.make("inputs", 0);
    return;
  }

}

class CLib extends CDef {
  constructor() {
    super();
    const this$ = this;
    this.#defs = sys.Map.__fromLiteral([], [], sys.Type.find("defc::CSymbol"), sys.Type.find("defc::CDef"));
    this.#defXs = sys.List.make(CDefX.type$);
    return;
  }

  typeof() { return CLib.type$; }

  #input = null;

  input() { return this.#input; }

  __input(it) { if (it === undefined) return this.#input; else this.#input = it; }

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

  #defs = null;

  defs(it) {
    if (it === undefined) {
      return this.#defs;
    }
    else {
      this.#defs = it;
      return;
    }
  }

  #defXs = null;

  defXs(it) {
    if (it === undefined) {
      return this.#defXs;
    }
    else {
      this.#defXs = it;
      return;
    }
  }

  #scope = null;

  scope(it) {
    if (it === undefined) {
      return this.#scope;
    }
    else {
      this.#scope = it;
      return;
    }
  }

  static make(loc,symbol,declared,input,depends) {
    const $self = new CLib();
    CLib.make$($self,loc,symbol,declared,input,depends);
    return $self;
  }

  static make$($self,loc,symbol,declared,input,depends) {
    CDef.make$($self, loc, $self, symbol, declared);
    ;
    $self.#input = input;
    $self.#depends = depends;
    $self.#defs.add(symbol, $self);
    return;
  }

  dis() {
    return this.name();
  }

}

class DefDocEnv extends compilerDoc.DocEnv {
  constructor() {
    super();
    const this$ = this;
    this.#docSectionsRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return DefDocEnv.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  #spacesMap = null;

  spacesMap() { return this.#spacesMap; }

  __spacesMap(it) { if (it === undefined) return this.#spacesMap; else this.#spacesMap = it; }

  #libs = null;

  libs() { return this.#libs; }

  __libs(it) { if (it === undefined) return this.#libs; else this.#libs = it; }

  #libsMap = null;

  libsMap() { return this.#libsMap; }

  __libsMap(it) { if (it === undefined) return this.#libsMap; else this.#libsMap = it; }

  #defsMap = null;

  defsMap() { return this.#defsMap; }

  __defsMap(it) { if (it === undefined) return this.#defsMap; else this.#defsMap = it; }

  #docSectionsRef = null;

  // private field reflection only
  __docSectionsRef(it) { if (it === undefined) return this.#docSectionsRef; else this.#docSectionsRef = it; }

  static make(init) {
    const $self = new DefDocEnv();
    DefDocEnv.make$($self,init);
    return $self;
  }

  static make$($self,init) {
    const this$ = $self;
    compilerDoc.DocEnv.make$($self);
    ;
    $self.#ns = init.ns();
    $self.#spacesMap = sys.ObjUtil.coerce(((this$) => { let $_u16 = init.spacesMap(); if ($_u16 == null) return null; return sys.ObjUtil.toImmutable(init.spacesMap()); })($self), sys.Type.find("[sys::Str:compilerDoc::DocSpace]"));
    $self.#defsMap = sys.ObjUtil.coerce(((this$) => { let $_u17 = init.defsMap(); if ($_u17 == null) return null; return sys.ObjUtil.toImmutable(init.defsMap()); })($self), sys.Type.find("[sys::Str:defc::DocDef]"));
    $self.#ts = sys.DateTime.now();
    $self.#libs = sys.ObjUtil.coerce(((this$) => { let $_u18 = sys.ObjUtil.coerce(this$.#spacesMap.vals().findAll((s) => {
      return sys.ObjUtil.is(s, DocLib.type$);
    }).sort(), sys.Type.find("defc::DocLib[]")); if ($_u18 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(this$.#spacesMap.vals().findAll((s) => {
      return sys.ObjUtil.is(s, DocLib.type$);
    }).sort(), sys.Type.find("defc::DocLib[]"))); })($self), sys.Type.find("defc::DocLib[]"));
    $self.#libsMap = sys.ObjUtil.coerce(((this$) => { let $_u19 = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::DocLib")).addList(this$.#libs, (it) => {
      return it.name();
    }); if ($_u19 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::DocLib")).addList(this$.#libs, (it) => {
      return it.name();
    })); })($self), sys.Type.find("[sys::Str:defc::DocLib]"));
    return;
  }

  topIndex() {
    const this$ = this;
    return compilerDoc.DocTopIndex.make((it) => {
      it.__renderer(DefTopIndexRenderer.type$);
      return;
    });
  }

  space(name,checked) {
    if (checked === undefined) checked = true;
    let space = this.#spacesMap.get(name);
    if (space != null) {
      return space;
    }
    ;
    if (checked) {
      throw compilerDoc.UnknownDocErr.make(sys.Str.plus("space not found: ", name));
    }
    ;
    return null;
  }

  manual(name,checked) {
    if (checked === undefined) checked = true;
    let x = sys.ObjUtil.as(this.space(name, false), compilerDoc.DocPod.type$);
    if ((x != null && x.isManual())) {
      return x;
    }
    ;
    if (checked) {
      throw compilerDoc.UnknownDocErr.make(sys.Str.plus("manual not found: ", name));
    }
    ;
    return null;
  }

  lib(name,checked) {
    if (checked === undefined) checked = true;
    let lib = this.#libsMap.get(name);
    if (lib != null) {
      return lib;
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus("Unknown lib: ", name));
    }
    ;
    return null;
  }

  def(symbol,checked) {
    if (checked === undefined) checked = true;
    let $def = this.#defsMap.get(symbol);
    if ($def != null) {
      return $def;
    }
    ;
    if (checked) {
      throw sys.Err.make(sys.Str.plus("Unknown def: ", symbol));
    }
    ;
    return null;
  }

  findDefs(f) {
    const this$ = this;
    let acc = sys.List.make(DocDef.type$);
    this.#defsMap.each((d) => {
      if (sys.Func.call(f, d)) {
        acc.add(d);
      }
      ;
      return;
    });
    return acc.sort();
  }

  resolve(d) {
    return this.def(d.symbol().toStr(), false);
  }

  resolveList(list,sort) {
    const this$ = this;
    if (list.isEmpty()) {
      return sys.ObjUtil.coerce(DocDef.type$.emptyList(), sys.Type.find("defc::DocDef[]"));
    }
    ;
    let acc = sys.List.make(DocDef.type$);
    acc.capacity(list.size());
    list.each((d) => {
      let doc = this$.resolve(d);
      if (doc != null) {
        acc.add(sys.ObjUtil.coerce(doc, DocDef.type$));
      }
      ;
      return;
    });
    if (sort) {
      acc.sort();
    }
    ;
    return acc;
  }

  theme() {
    return DefDocTheme.make();
  }

  render(out,doc) {
    let o = sys.ObjUtil.coerce(out, DocOutStream.type$);
    o.env(this);
    o.doc(doc);
    o.renderer(sys.ObjUtil.coerce(this.renderer(doc).make(sys.List.make(sys.Obj.type$, [this, out, doc])), compilerDoc.DocRenderer.type$.toNullable()));
    o.renderer().writeDoc();
    return;
  }

  renderer(doc) {
    if (sys.ObjUtil.is(doc, compilerDoc.DocChapter.type$)) {
      return DefChapterRenderer.type$;
    }
    ;
    if (sys.ObjUtil.is(doc, compilerDoc.DocPodIndex.type$)) {
      return DefPodIndexRenderer.type$;
    }
    ;
    return doc.renderer();
  }

  initFandocHtmlWriter(out) {
    return DocFandocWriter.make(out);
  }

  genFullHtml() {
    return true;
  }

  cssFilename() {
    return "style.css";
  }

  siteDis() {
    return "Project Haystack";
  }

  footer() {
    return sys.Str.plus("Generated ", this.#ts.toLocale("DD-MMM-YYYY hh:mm zzz"));
  }

  includeTagInMetaSection(base,tag) {
    return true;
  }

  supertypes($def) {
    return this.resolveList(this.#ns.supertypes($def.def()), false);
  }

  supertypeTree($def) {
    let root = DocDefTree.make(null, $def);
    this.doSupertypeTree(root);
    return root.invert();
  }

  doSupertypeTree(node) {
    const this$ = this;
    this.supertypes(node.def()).each((s) => {
      this$.doSupertypeTree(node.add(s));
      return;
    });
    return;
  }

  subtypes($def) {
    if (!$def.type().isTerm()) {
      return sys.ObjUtil.coerce(DocDef.type$.emptyList(), sys.Type.find("defc::DocDef[]"));
    }
    ;
    return this.resolveList(this.#ns.subtypes($def.def()), false);
  }

  subtypeTree($def) {
    let root = DocDefTree.make(null, $def);
    this.doSubtypeTree(root);
    return root;
  }

  doSubtypeTree(node) {
    const this$ = this;
    let subtypes = this.subtypes(node.def());
    if (subtypes.isEmpty()) {
      return;
    }
    ;
    subtypes.each((s) => {
      this$.doSubtypeTree(node.add(s));
      return;
    });
    return;
  }

  docAssociations() {
    const this$ = this;
    if (this.#docSectionsRef.val() == null) {
      let acc = this.findDefs(($def) => {
        return $def.has("docAssociations");
      });
      acc.moveTo(this.def("tags"), 0);
      this.#docSectionsRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("defc::DocDef[]")));
    }
    ;
    return sys.ObjUtil.coerce(this.#docSectionsRef.val(), sys.Type.find("defc::DocDef[]"));
  }

  associations(parent,association) {
    return this.resolveList(this.#ns.associations(parent.def(), association.def()), true);
  }

  link(from$,link,checked) {
    if (checked === undefined) checked = true;
    if (sys.ObjUtil.is(from$, compilerDoc.DocType.type$)) {
      let slot = sys.ObjUtil.coerce(from$, compilerDoc.DocType.type$).slot(link, false);
      if (slot != null) {
        return compilerDoc.DocLink.make(from$, from$, link, link);
      }
      ;
    }
    ;
    let $def = this.def(link, false);
    if ($def != null) {
      return compilerDoc.DocLink.make(from$, sys.ObjUtil.coerce($def, compilerDoc.Doc.type$), link);
    }
    ;
    if (sys.Str.startsWith(link, "lib:")) {
      let libName = sys.Str.getRange(link, sys.Range.make(4, -1));
      let lib = this.#libsMap.get(libName);
      if (lib != null) {
        return compilerDoc.DocLink.make(from$, lib.index(), link);
      }
      ;
    }
    ;
    if ((sys.Str.startsWith(link, "docHaystack::") && this.space("docHaystack", false) == null)) {
      return compilerDoc.DocLink.makeAbsUri(from$, sys.Uri.fromStr("https://project-haystack.dev/doc/").plus(sys.Str.toUri(sys.Str.replace(link, "::", "/"))), "online");
    }
    ;
    return compilerDoc.DocEnv.prototype.link.call(this, from$, link, checked);
  }

  linkSectionTitle(from$,title) {
    if (sys.Str.isEmpty(title)) {
      return null;
    }
    ;
    let $_u20 = title;
    if (sys.ObjUtil.equals($_u20, "manual")) {
      (title = "manuals");
    }
    else if (sys.ObjUtil.equals($_u20, "chapters")) {
      (title = "manuals");
    }
    else if (sys.ObjUtil.equals($_u20, "lib")) {
      (title = "def");
    }
    ;
    let chapter = ((this$) => { let $_u21 = this$.manual("docHaystack", false); if ($_u21 == null) return null; return this$.manual("docHaystack", false).chapter("Docs", false); })(this);
    if ((chapter != null && chapter.heading(title, false) != null)) {
      return this.linkUri(compilerDoc.DocLink.make(from$, sys.ObjUtil.coerce(chapter, compilerDoc.Doc.type$), title, title));
    }
    ;
    return null;
  }

  imageLink(from$,link,loc) {
    let pod = sys.ObjUtil.as(from$.space(), compilerDoc.DocPod.type$);
    if (pod != null) {
      let res = pod.res(link, false);
      if (res != null) {
        let file = sys.Pod.find(pod.name()).file(sys.Str.toUri(sys.Str.plus("/doc/", link)));
        return DocResFile.make(from$.space().spaceName(), link, sys.ObjUtil.coerce(file, sys.File.type$));
      }
      ;
    }
    ;
    throw compilerDoc.DocErr.make(sys.Str.plus("Unresolved image link: ", link), loc);
  }

  walkChapterToc(from$,target,f) {
    const this$ = this;
    let chapter = ((this$) => { if (sys.ObjUtil.is(target, DocLibManual.type$)) return sys.ObjUtil.coerce(target, DocLibManual.type$).chapter(); return sys.ObjUtil.coerce(target, compilerDoc.DocChapter.type$); })(this);
    chapter.headings().each((h,i) => {
      this$.doWalkChapterToc(from$, target, h, true, f);
      return;
    });
    return this;
  }

  walkChapterTocTopOnly(from$,target,f) {
    const this$ = this;
    let chapter = ((this$) => { if (sys.ObjUtil.is(target, DocLibManual.type$)) return sys.ObjUtil.coerce(target, DocLibManual.type$).chapter(); return sys.ObjUtil.coerce(target, compilerDoc.DocChapter.type$); })(this);
    chapter.headings().each((h,i) => {
      this$.doWalkChapterToc(from$, target, h, false, f);
      return;
    });
    return this;
  }

  doWalkChapterToc(from$,target,h,walkKids,f) {
    const this$ = this;
    let uri = ((this$) => { if (from$ === target) return sys.Str.toUri(sys.Str.plus("#", h.anchorId())); return this$.linkUri(compilerDoc.DocLink.make(from$, target, h.title(), h.anchorId())); })(this);
    sys.Func.call(f, h, uri);
    if (walkKids) {
      h.children().each((kid) => {
        this$.doWalkChapterToc(from$, target, kid, walkKids, f);
        return;
      });
    }
    ;
    return;
  }

}

class DefDocEnvInit extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefDocEnvInit.type$; }

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

  #spacesMap = null;

  spacesMap(it) {
    if (it === undefined) {
      return this.#spacesMap;
    }
    else {
      this.#spacesMap = it;
      return;
    }
  }

  #defsMap = null;

  defsMap(it) {
    if (it === undefined) {
      return this.#defsMap;
    }
    else {
      this.#defsMap = it;
      return;
    }
  }

  static make(f) {
    const $self = new DefDocEnvInit();
    DefDocEnvInit.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    sys.Func.call(f, $self);
    return;
  }

}

class DocDef extends compilerDoc.Doc {
  constructor() {
    super();
    const this$ = this;
    this.#subtitleRef = concurrent.AtomicRef.make();
    this.#rendererRef = concurrent.AtomicRef.make(StdDocDefRenderer.type$);
    this.#childrenRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return DocDef.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #def = null;

  def() { return this.#def; }

  __def(it) { if (it === undefined) return this.#def; else this.#def = it; }

  #docNameRef = null;

  // private field reflection only
  __docNameRef(it) { if (it === undefined) return this.#docNameRef; else this.#docNameRef = it; }

  #docSummary = null;

  docSummary() { return this.#docSummary; }

  __docSummary(it) { if (it === undefined) return this.#docSummary; else this.#docSummary = it; }

  #docFull = null;

  docFull() { return this.#docFull; }

  __docFull(it) { if (it === undefined) return this.#docFull; else this.#docFull = it; }

  #subtitleRef = null;

  subtitleRef() { return this.#subtitleRef; }

  __subtitleRef(it) { if (it === undefined) return this.#subtitleRef; else this.#subtitleRef = it; }

  #rendererRef = null;

  rendererRef() { return this.#rendererRef; }

  __rendererRef(it) { if (it === undefined) return this.#rendererRef; else this.#rendererRef = it; }

  #childrenRef = null;

  childrenRef() { return this.#childrenRef; }

  __childrenRef(it) { if (it === undefined) return this.#childrenRef; else this.#childrenRef = it; }

  static make(lib,loc,$def) {
    const $self = new DocDef();
    DocDef.make$($self,lib,loc,$def);
    return $self;
  }

  static make$($self,lib,loc,$def) {
    compilerDoc.Doc.make$($self);
    ;
    $self.#lib = lib;
    $self.#loc = loc;
    $self.#def = $def;
    $self.#docNameRef = sys.Str.replace($def.symbol().toStr(), ":", "~");
    $self.#docFull = CFandoc.make(loc, sys.ObjUtil.coerce(((this$) => { let $_u25 = $def.get("doc"); if ($_u25 != null) return $_u25; return ""; })($self), sys.Str.type$));
    $self.#docSummary = $self.#docFull.toSummary();
    return;
  }

  name() {
    return this.#def.name();
  }

  dis() {
    return this.toStr();
  }

  symbol() {
    return this.#def.symbol();
  }

  type() {
    return this.#def.symbol().type();
  }

  has(name) {
    return this.#def.has(name);
  }

  missing(name) {
    return this.#def.missing(name);
  }

  docName() {
    return this.#docNameRef;
  }

  space() {
    return this.#lib;
  }

  isCode() {
    return true;
  }

  breadcrumb() {
    return this.title();
  }

  title() {
    return this.dis();
  }

  subtitle() {
    return sys.ObjUtil.coerce(this.#subtitleRef.val(), sys.Str.type$.toNullable());
  }

  renderer() {
    return sys.ObjUtil.coerce(this.#rendererRef.val(), sys.Type.type$);
  }

  toStr() {
    return this.#def.symbol().toStr();
  }

  compare(that) {
    return sys.ObjUtil.compare(this.toStr(), sys.ObjUtil.toStr(that));
  }

  children() {
    return sys.ObjUtil.coerce(((this$) => { let $_u26 = this$.#childrenRef.val(); if ($_u26 != null) return $_u26; return DocProto.type$.emptyList(); })(this), sys.Type.find("defc::DocProto[]"));
  }

}

class DefDocRenderer extends compilerDoc.DocRenderer {
  constructor() {
    super();
    const this$ = this;
    this.#navData = DocNavData.make();
    return;
  }

  typeof() { return DefDocRenderer.type$; }

  #navData = null;

  navData() {
    return this.#navData;
  }

  static make(env,out,doc) {
    const $self = new DefDocRenderer();
    DefDocRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    compilerDoc.DocRenderer.make$($self, env, out, doc);
    ;
    return;
  }

  env() {
    return sys.ObjUtil.coerce(compilerDoc.DocRenderer.prototype.env.call(this), DefDocEnv.type$);
  }

  out() {
    return sys.ObjUtil.coerce(compilerDoc.DocRenderer.prototype.out.call(this), DocOutStream.type$);
  }

  writeDoc() {
    this.theme().writeStart(this);
    this.theme().writeBreadcrumb(this);
    this.writePrevNext();
    sys.ObjUtil.coerce(this.out().div("class='defc-main'"), DocOutStream.type$).nl();
    this.writeContent();
    this.out().divEnd();
    this.writeNavData();
    this.theme().writeEnd(this);
    return;
  }

  writePrevNext() {
    return;
  }

  writeNavData() {
    this.buildNavData();
    if (this.#navData.isEmpty()) {
      return;
    }
    ;
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().nl(), DocOutStream.type$).w("<!-- defc-navData"), DocOutStream.type$).nl(), DocOutStream.type$).w(this.#navData.encode()), DocOutStream.type$).w("-->"), DocOutStream.type$).nl();
    return;
  }

  buildNavData() {
    return;
  }

  writeDefHeader(name,title,subtitle,doc) {
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().defSection(name).h1(), DocOutStream.type$).esc(title), DocOutStream.type$).h1End();
    if (subtitle != null) {
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().h2(), DocOutStream.type$).esc(subtitle), DocOutStream.type$).h2End();
    }
    ;
    this.out().fandoc(doc).defSectionEnd();
    return;
  }

  writeMetaSection(meta) {
    const this$ = this;
    let names = haystack.Etc.dictNames(meta).sort();
    this.out().defSection("meta").props();
    names.each((name) => {
      let val = meta.get(name);
      let $_u27 = name;
      if (sys.ObjUtil.equals($_u27, "doc")) {
        (val = ((this$) => { if (sys.Str.isEmpty(sys.ObjUtil.toStr(val))) return "\u2014"; return "See above"; })(this$));
      }
      else if (sys.ObjUtil.equals($_u27, "children")) {
        (val = "See below");
      }
      else if (sys.ObjUtil.equals($_u27, "enum")) {
        (val = "See below");
      }
      ;
      let tag = this$.env().def(name, false);
      if ((tag != null && this$.env().includeTagInMetaSection(meta, sys.ObjUtil.coerce(tag, DocDef.type$)))) {
        this$.out().prop(sys.ObjUtil.coerce(tag, sys.Obj.type$), val);
      }
      ;
      return;
    });
    this.out().propsEnd().defSectionEnd();
    return;
  }

  writeListSection(name,defs,justName) {
    if (justName === undefined) justName = false;
    const this$ = this;
    if (defs.isEmpty()) {
      return;
    }
    ;
    this.out().defSection(name).props();
    defs.each(($def) => {
      this$.out().propDef($def, ((this$) => { if (justName) return $def.name(); return $def.dis(); })(this$));
      return;
    });
    this.out().propsEnd().defSectionEnd();
    return;
  }

  writeProtosSection(protos) {
    const this$ = this;
    if (protos.isEmpty()) {
      return;
    }
    ;
    let nonSimple = protos.findAll((p) => {
      return !p.isSimple();
    });
    if (!nonSimple.isEmpty()) {
      (protos = nonSimple);
    }
    ;
    this.out().defSection("children").props();
    protos.each((proto) => {
      this$.out().propProto(proto);
      return;
    });
    this.out().propsEnd().defSectionEnd();
    return;
  }

  writeChapterTocSection(name,target) {
    if (target == null) {
      return;
    }
    ;
    this.out().defSection(name);
    this.writeChapterTocLinks(sys.ObjUtil.coerce(target, compilerDoc.Doc.type$));
    this.out().defSectionEnd();
    return;
  }

  writeChapterTocLinks(target) {
    const this$ = this;
    let first = true;
    this.env().walkChapterTocTopOnly(this.doc(), target, (h,uri) => {
      if (first) {
        (uri = this$.env().linkUri(compilerDoc.DocLink.make(this$.doc(), target, h.title(), null)));
        (first = false);
      }
      else {
        this$.out().w(" \u2022 ");
      }
      ;
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(this$.out().a(uri), DocOutStream.type$).esc(h.title()), DocOutStream.type$).aEnd();
      return;
    });
    return;
  }

  onFandocImage(elem,loc) {
    try {
      if ((sys.Str.startsWith(elem.uri(), "http:") || sys.Str.startsWith(elem.uri(), "https:"))) {
        return;
      }
      ;
      let res = this.env().imageLink(this.doc(), elem.uri(), loc);
      if (res != null) {
        this.out().resFiles().set(res.qname(), sys.ObjUtil.coerce(res, DocResFile.type$));
      }
      ;
    }
    catch ($_u30) {
      $_u30 = sys.Err.make($_u30);
      if ($_u30 instanceof sys.Err) {
        let e = $_u30;
        ;
        this.onFandocErr(e, loc);
      }
      else {
        throw $_u30;
      }
    }
    ;
    return;
  }

  onFandocErr(e,loc) {
    let msg = ((this$) => { if ((sys.ObjUtil.equals(sys.ObjUtil.typeof(e), sys.Err.type$) || sys.ObjUtil.equals(sys.ObjUtil.typeof(e), compilerDoc.DocErr.type$))) return e.msg(); return e.toStr(); })(this);
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("ERROR: ", loc), ": "), msg));
    return;
  }

}

class StdDocDefRenderer extends DefDocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StdDocDefRenderer.type$; }

  static make(env,out,doc) {
    const $self = new StdDocDefRenderer();
    StdDocDefRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DefDocRenderer.make$($self, sys.ObjUtil.coerce(env, DefDocEnv.type$), sys.ObjUtil.coerce(out, DocOutStream.type$), doc);
    return;
  }

  doc() {
    return sys.ObjUtil.coerce(DefDocRenderer.prototype.doc.call(this), DocDef.type$);
  }

  writeContent() {
    this.writeDefHeader("def", this.doc().symbol().toStr(), this.doc().subtitle(), this.doc().docFull());
    this.writeConjunct();
    this.writeMetaSection(this.doc().def());
    this.writeUsageSection();
    this.writeEnumSection();
    this.writeTreeSection("supertypes", this.env().supertypeTree(this.doc()));
    this.writeTreeSection("subtypes", this.env().subtypeTree(this.doc()));
    this.writeAssociationSections();
    this.writeProtosSection(this.doc().children());
    return;
  }

  writeConjunct() {
    const this$ = this;
    if (!this.doc().type().isConjunct()) {
      return;
    }
    ;
    this.out().defSection("conjunct").props();
    this.doc().symbol().eachPart((tagName) => {
      let tag = this$.env().def(tagName, false);
      if (tag == null) {
        this$.out().esc(tagName);
      }
      else {
        this$.out().propDef(sys.ObjUtil.coerce(tag, DocDef.type$));
      }
      ;
      return;
    });
    this.out().propsEnd().defSectionEnd();
    return;
  }

  writeUsageSection() {
    const this$ = this;
    let usage = this.env().ns().implement(this.doc().def());
    if (sys.ObjUtil.compareLE(usage.size(), 1)) {
      return;
    }
    ;
    sys.ObjUtil.coerce(this.out().defSection("usage").props().tr(), DocOutStream.type$).th();
    usage.each((u,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        this$.out().w("&nbsp;&nbsp;");
      }
      ;
      this$.out().linkDef(u);
      return;
    });
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().thEnd(), DocOutStream.type$).trEnd(), DocOutStream.type$).propsEnd().defSectionEnd();
    return;
  }

  writeEnumSection() {
    const this$ = this;
    let enumVal = this.doc().def().get("enum");
    if (enumVal == null) {
      return;
    }
    ;
    let enum$ = def.DefUtil.parseEnum(enumVal);
    this.out().defSection("enum").props();
    enum$.each((dict,name) => {
      let enumDoc = ((this$) => { let $_u32 = dict.get("doc"); if ($_u32 != null) return $_u32; return ""; })(this$);
      this$.out().prop(name, CFandoc.make(this$.doc().loc(), sys.ObjUtil.coerce(enumDoc, sys.Str.type$)));
      return;
    });
    this.out().propsEnd().defSectionEnd();
    return;
  }

  writeTreeSection(name,tree) {
    const this$ = this;
    if (tree.isEmpty()) {
      return;
    }
    ;
    this.out().defSection(name).props();
    tree.each((indent,term) => {
      this$.out().propDef(term, term.dis(), indent);
      return;
    });
    this.out().propsEnd().defSectionEnd();
    return;
  }

  writeAssociationSections() {
    const this$ = this;
    this.env().docAssociations().each((assoc) => {
      this$.writeListSection(assoc.name(), this$.env().associations(this$.doc(), assoc));
      return;
    });
    return;
  }

}

class DocProtoSpace extends compilerDoc.DocSpace {
  constructor() {
    super();
    const this$ = this;
    this.#index = DocProtoIndex.make(this);
    return;
  }

  typeof() { return DocProtoSpace.type$; }

  #index = null;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #protos = null;

  protos() { return this.#protos; }

  __protos(it) { if (it === undefined) return this.#protos; else this.#protos = it; }

  static make(protos) {
    const $self = new DocProtoSpace();
    DocProtoSpace.make$($self,protos);
    return $self;
  }

  static make$($self,protos) {
    const this$ = $self;
    compilerDoc.DocSpace.make$($self);
    ;
    $self.#protos = sys.ObjUtil.coerce(((this$) => { let $_u33 = protos.sort(); if ($_u33 == null) return null; return sys.ObjUtil.toImmutable(protos.sort()); })($self), sys.Type.find("defc::DocProto[]"));
    $self.#protos.each((doc) => {
      doc.spaceRef().val(this$);
      return;
    });
    return;
  }

  spaceName() {
    return "proto";
  }

  doc(docName,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    if (sys.ObjUtil.equals(docName, this.#index.docName())) {
      return this.#index;
    }
    ;
    let doc = this.#protos.find((doc) => {
      return sys.ObjUtil.equals(doc.docName(), docName);
    });
    if (doc != null) {
      return doc;
    }
    ;
    if (checked) {
      throw compilerDoc.UnknownDocErr.make(docName);
    }
    ;
    return null;
  }

  eachDoc(f) {
    sys.Func.call(f, this.#index);
    this.#protos.each(f);
    return;
  }

}

class DocProto extends compilerDoc.Doc {
  constructor() {
    super();
    const this$ = this;
    this.#spaceRef = concurrent.AtomicRef.make();
    this.#childrenRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return DocProto.type$; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #spaceRef = null;

  spaceRef() { return this.#spaceRef; }

  __spaceRef(it) { if (it === undefined) return this.#spaceRef; else this.#spaceRef = it; }

  #docName = null;

  docName() { return this.#docName; }

  __docName(it) { if (it === undefined) return this.#docName; else this.#docName = it; }

  #implements = null;

  implements() { return this.#implements; }

  __implements(it) { if (it === undefined) return this.#implements; else this.#implements = it; }

  #childrenRef = null;

  childrenRef() { return this.#childrenRef; }

  __childrenRef(it) { if (it === undefined) return this.#childrenRef; else this.#childrenRef = it; }

  static make(f) {
    const $self = new DocProto();
    DocProto.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    compilerDoc.Doc.make$($self);
    ;
    sys.Func.call(f, $self);
    return;
  }

  space() {
    return sys.ObjUtil.coerce(this.#spaceRef.val(), DocProtoSpace.type$);
  }

  title() {
    return this.#dis;
  }

  isSimple() {
    return sys.ObjUtil.compareLE(this.#implements.size(), 1);
  }

  children() {
    return sys.ObjUtil.coerce(this.#childrenRef.val(), sys.Type.find("defc::DocProto[]"));
  }

  renderer() {
    return DocProtoRenderer.type$;
  }

}

class DocProtoRenderer extends DefDocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocProtoRenderer.type$; }

  static make(env,out,doc) {
    const $self = new DocProtoRenderer();
    DocProtoRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DefDocRenderer.make$($self, env, out, doc);
    return;
  }

  writeContent() {
    let proto = sys.ObjUtil.coerce(this.doc(), DocProto.type$);
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().defSection("proto").h1(), DocOutStream.type$).esc(proto.dis()), DocOutStream.type$).h1End(), DocOutStream.type$).defSectionEnd();
    this.writeListSection("implements", proto.implements());
    this.writeProtosSection(proto.children());
    return;
  }

}

class DocProtoIndex extends compilerDoc.Doc {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocProtoIndex.type$; }

  #space = null;

  space() { return this.#space; }

  __space(it) { if (it === undefined) return this.#space; else this.#space = it; }

  static make(space) {
    const $self = new DocProtoIndex();
    DocProtoIndex.make$($self,space);
    return $self;
  }

  static make$($self,space) {
    compilerDoc.Doc.make$($self);
    $self.#space = space;
    return;
  }

  isSpaceIndex() {
    return true;
  }

  title() {
    return "Prototypes";
  }

  docName() {
    return "index";
  }

  renderer() {
    return DocProtoIndexRenderer.type$;
  }

}

class DocProtoIndexRenderer extends DefDocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocProtoIndexRenderer.type$; }

  static make(env,out,doc) {
    const $self = new DocProtoIndexRenderer();
    DocProtoIndexRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DefDocRenderer.make$($self, env, out, doc);
    return;
  }

  writeContent() {
    const this$ = this;
    let doc = sys.ObjUtil.coerce(this.doc(), DocProtoIndex.type$);
    let protos = doc.space().protos();
    this.out().defSection("").props();
    protos.each((x) => {
      this$.out().propProto(x);
      return;
    });
    this.out().propsEnd().defSectionEnd();
    return;
  }

}

class DocAppendixSpace extends compilerDoc.DocSpace {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocAppendixSpace.type$; }

  #docs = null;

  docs() { return this.#docs; }

  __docs(it) { if (it === undefined) return this.#docs; else this.#docs = it; }

  #docsMap = null;

  // private field reflection only
  __docsMap(it) { if (it === undefined) return this.#docsMap; else this.#docsMap = it; }

  static make(docs) {
    const $self = new DocAppendixSpace();
    DocAppendixSpace.make$($self,docs);
    return $self;
  }

  static make$($self,docs) {
    const this$ = $self;
    compilerDoc.DocSpace.make$($self);
    $self.#docs = sys.ObjUtil.coerce(((this$) => { let $_u34 = docs.sort(); if ($_u34 == null) return null; return sys.ObjUtil.toImmutable(docs.sort()); })($self), sys.Type.find("defc::DocAppendix[]"));
    $self.#docsMap = sys.ObjUtil.coerce(((this$) => { let $_u35 = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::Doc")).addList(docs, (it) => {
      return it.docName();
    }), sys.Type.find("[sys::Str:defc::DocAppendix]")); if ($_u35 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::Doc")).addList(docs, (it) => {
      return it.docName();
    }), sys.Type.find("[sys::Str:defc::DocAppendix]"))); })($self), sys.Type.find("[sys::Str:defc::DocAppendix]"));
    $self.#docs.each((doc) => {
      doc.spaceRef().val(this$);
      return;
    });
    return;
  }

  spaceName() {
    return "appendix";
  }

  doc(docName,checked) {
    if (checked === undefined) checked = true;
    let doc = this.#docsMap.get(docName);
    if (doc != null) {
      return doc;
    }
    ;
    if (checked) {
      throw compilerDoc.UnknownDocErr.make(docName);
    }
    ;
    return null;
  }

  eachDoc(f) {
    this.#docs.each(f);
    return;
  }

}

class DocAppendix extends compilerDoc.Doc {
  constructor() {
    super();
    const this$ = this;
    this.#spaceRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return DocAppendix.type$; }

  #spaceRef = null;

  spaceRef() { return this.#spaceRef; }

  __spaceRef(it) { if (it === undefined) return this.#spaceRef; else this.#spaceRef = it; }

  space() {
    return sys.ObjUtil.coerce(this.#spaceRef.val(), DocAppendixSpace.type$);
  }

  title() {
    return this.docName();
  }

  static make() {
    const $self = new DocAppendix();
    DocAppendix.make$($self);
    return $self;
  }

  static make$($self) {
    compilerDoc.Doc.make$($self);
    ;
    return;
  }

}

class DocAppendixIndex extends DocAppendix {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocAppendixIndex.type$; }

  isSpaceIndex() {
    return true;
  }

  title() {
    return "Appendix";
  }

  summary() {
    return "Index of all appendex documents";
  }

  docName() {
    return "index";
  }

  group() {
    return "index";
  }

  renderer() {
    return DocAppendixIndexRenderer.type$;
  }

  static make() {
    const $self = new DocAppendixIndex();
    DocAppendixIndex.make$($self);
    return $self;
  }

  static make$($self) {
    DocAppendix.make$($self);
    return;
  }

}

class DocAppendixIndexRenderer extends DefDocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocAppendixIndexRenderer.type$; }

  static make(env,out,doc) {
    const $self = new DocAppendixIndexRenderer();
    DocAppendixIndexRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DefDocRenderer.make$($self, env, out, doc);
    return;
  }

  writeContent() {
    DocAppendixIndexRenderer.doWriteContent(this.out(), sys.ObjUtil.coerce(this.doc().space(), DocAppendixSpace.type$));
    return;
  }

  static doWriteContent(out,space) {
    const this$ = this;
    out.trackToNavData(true);
    let docs = space.docs();
    let groups = sys.List.make(sys.Str.type$);
    docs.each((x) => {
      if (!groups.contains(x.group())) {
        groups.add(x.group());
      }
      ;
      return;
    });
    groups.remove("index");
    groups.moveTo("quick", 0);
    groups.each((group) => {
      out.defSection(group).props();
      docs.each((x) => {
        if (sys.ObjUtil.equals(x.group(), group)) {
          out.prop(x, x.summary());
        }
        ;
        return;
      });
      out.propsEnd().defSectionEnd();
      return;
    });
    return;
  }

}

class DocTaxonomyAppendix extends DocAppendix {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTaxonomyAppendix.type$; }

  #def = null;

  def() { return this.#def; }

  __def(it) { if (it === undefined) return this.#def; else this.#def = it; }

  static make($def) {
    const $self = new DocTaxonomyAppendix();
    DocTaxonomyAppendix.make$($self,$def);
    return $self;
  }

  static make$($self,$def) {
    DocAppendix.make$($self);
    $self.#def = $def;
    return;
  }

  docName() {
    return this.#def.docName();
  }

  renderer() {
    return DocTaxonomyAppendixRenderer.type$;
  }

  group() {
    return "taxonomies";
  }

  summary() {
    return this.#def.docSummary();
  }

}

class DocTaxonomyAppendixRenderer extends DefDocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTaxonomyAppendixRenderer.type$; }

  static make(env,out,doc) {
    const $self = new DocTaxonomyAppendixRenderer();
    DocTaxonomyAppendixRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DefDocRenderer.make$($self, env, out, doc);
    return;
  }

  writeContent() {
    const this$ = this;
    this.out().trackToNavData(true);
    let env = sys.ObjUtil.coerce(this.env(), DefDocEnv.type$);
    let doc = sys.ObjUtil.coerce(this.doc(), DocTaxonomyAppendix.type$);
    let $def = doc.def();
    this.out().defSection("").props().propDef($def, $def.dis(), 0);
    let tree = env.subtypeTree($def);
    tree.each((indent,term) => {
      this$.out().propDef(term, term.dis(), sys.Int.plus(indent, 1));
      return;
    });
    this.out().propsEnd().defSectionEnd();
    return;
  }

}

class DocListAppendix extends DocAppendix {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocListAppendix.type$; }

  group() {
    return "listings";
  }

  renderer() {
    return DocListAppendixRenderer.type$;
  }

  collect(env) {
    const this$ = this;
    return env.findDefs((d) => {
      return this$.include(d);
    });
  }

  static make() {
    const $self = new DocListAppendix();
    DocListAppendix.make$($self);
    return $self;
  }

  static make$($self) {
    DocAppendix.make$($self);
    return;
  }

}

class DocListAppendixRenderer extends DefDocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocListAppendixRenderer.type$; }

  static make(env,out,doc) {
    const $self = new DocListAppendixRenderer();
    DocListAppendixRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DefDocRenderer.make$($self, env, out, doc);
    return;
  }

  writeContent() {
    const this$ = this;
    this.out().trackToNavData(true);
    let doc = sys.ObjUtil.coerce(this.doc(), DocListAppendix.type$);
    let list = doc.collect(this.env());
    this.out().defSection("").fandoc(CFandoc.make(CLoc.none(), sys.ObjUtil.coerce(doc.summary(), sys.Str.type$))).props();
    list.each(($def) => {
      this$.out().propDef($def, $def.name());
      return;
    });
    this.out().propsEnd().defSectionEnd();
    return;
  }

}

class DocTagAppendix extends DocListAppendix {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocTagAppendix.type$; }

  docName() {
    return "tags";
  }

  include($def) {
    return $def.type().isTag();
  }

  summary() {
    return "All tags listed alphabetically";
  }

  static make() {
    const $self = new DocTagAppendix();
    DocTagAppendix.make$($self);
    return $self;
  }

  static make$($self) {
    DocListAppendix.make$($self);
    return;
  }

}

class DocConjunctAppendix extends DocListAppendix {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocConjunctAppendix.type$; }

  docName() {
    return "conjuncts";
  }

  include($def) {
    return $def.type().isConjunct();
  }

  summary() {
    return "All tag conjuncts listed alphabetically";
  }

  static make() {
    const $self = new DocConjunctAppendix();
    DocConjunctAppendix.make$($self);
    return $self;
  }

  static make$($self) {
    DocListAppendix.make$($self);
    return;
  }

}

class DocLibAppendix extends DocListAppendix {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocLibAppendix.type$; }

  docName() {
    return "libs";
  }

  summary() {
    return "All libs listed alphabetically";
  }

  include(d) {
    throw sys.UnsupportedErr.make();
  }

  collect(env) {
    const this$ = this;
    return sys.ObjUtil.coerce(env.libs().map((lib) => {
      return lib.index();
    }, DocDef.type$), sys.Type.find("defc::DocDef[]"));
  }

  static make() {
    const $self = new DocLibAppendix();
    DocLibAppendix.make$($self);
    return $self;
  }

  static make$($self) {
    DocListAppendix.make$($self);
    return;
  }

}

class DocFeatureAppendix extends DocListAppendix {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocFeatureAppendix.type$; }

  #feature = null;

  feature() { return this.#feature; }

  __feature(it) { if (it === undefined) return this.#feature; else this.#feature = it; }

  #docName = null;

  docName() { return this.#docName; }

  __docName(it) { if (it === undefined) return this.#docName; else this.#docName = it; }

  static make(f) {
    const $self = new DocFeatureAppendix();
    DocFeatureAppendix.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    DocListAppendix.make$($self);
    $self.#feature = f;
    $self.#docName = sys.Str.plus(f.name(), "s");
    return;
  }

  include($def) {
    return ($def.type().isKey() && sys.ObjUtil.equals($def.symbol().part(0), this.#feature.name()));
  }

  summary() {
    return sys.Str.plus(sys.Str.plus("All ", this.#docName), " listed alphabetically");
  }

}

class DocFandocWriter extends fandoc.HtmlDocWriter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocFandocWriter.type$; }

  #inPreZinc = false;

  // private field reflection only
  __inPreZinc(it) { if (it === undefined) return this.#inPreZinc; else this.#inPreZinc = it; }

  static make(out) {
    const $self = new DocFandocWriter();
    DocFandocWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    fandoc.HtmlDocWriter.make$($self, out);
    return;
  }

  elemStart(elem) {
    if (elem.id() === fandoc.DocNodeId.pre()) {
      let text = elem.toText();
      if (sys.Str.startsWith(text, "ver:\"")) {
        try {
          if (this.writePreZinc(text)) {
            return;
          }
          ;
        }
        catch ($_u36) {
          $_u36 = sys.Err.make($_u36);
          if ($_u36 instanceof sys.Err) {
            let e = $_u36;
            ;
            sys.ObjUtil.echo();
            sys.ObjUtil.echo("ERROR: cannot parse zinc");
            sys.ObjUtil.echo(sys.Str.plus("  ", e));
            sys.ObjUtil.echo(text);
          }
          else {
            throw $_u36;
          }
        }
        ;
      }
      ;
    }
    ;
    fandoc.HtmlDocWriter.prototype.elemStart.call(this, elem);
    return;
  }

  writePreZinc(zinc) {
    const this$ = this;
    if (!sys.Str.endsWith(zinc, "\n")) {
      (zinc = sys.Str.plus(zinc, "\n"));
    }
    ;
    let grid = haystack.ZincReader.make(sys.Str.in(zinc)).readGrid();
    let json = sys.Str.splitLines(haystack.JsonWriter.valToStr(grid)).map((x) => {
      return ((this$) => { if ((sys.Str.startsWith(x, "{") && sys.ObjUtil.compareGT(sys.Str.size(x), 2))) return sys.Str.plus("  ", x); return x; })(this$);
    }, sys.Obj.type$.toNullable()).join("\n");
    let id = haystack.Ref.gen();
    let idZinc = sys.Str.plus(sys.Str.plus("", id), "-zinc");
    let idJson = sys.Str.plus(sys.Str.plus("", id), "-json");
    this.out().printLine(sys.Str.plus(sys.Str.plus("<div class='defc-preToggle' id='", idZinc), "'>"));
    this.out().printLine("  <div class='defc-preToggle-bar'>");
    this.out().printLine("  <span class='defc-preToggle-sel'>Zinc</span>");
    this.out().printLine(sys.Str.plus(sys.Str.plus("  <span onclick='", this.clickJs(idJson, idZinc)), "'>JSON</span>"));
    this.out().printLine("  </div>");
    this.out().printLine("  <pre>");
    this.safeText(zinc);
    this.out().printLine("  </pre>");
    this.out().printLine("</div>");
    this.out().printLine(sys.Str.plus(sys.Str.plus("<div class='defc-preToggle' id='", idJson), "' style='display:none;'>"));
    this.out().printLine("  <div class='defc-preToggle-bar'>");
    this.out().printLine(sys.Str.plus(sys.Str.plus("  <span onclick='", this.clickJs(idZinc, idJson)), "'>Zinc</span>"));
    this.out().printLine("  <span class='defc-preToggle-sel'>JSON</span>");
    this.out().printLine("  </div>");
    this.out().printLine("  <pre>");
    this.safeText(json);
    this.out().printLine("  </pre>");
    this.out().printLine("</div>");
    this.#inPreZinc = true;
    return true;
  }

  text(text) {
    if (!this.#inPreZinc) {
      fandoc.HtmlDocWriter.prototype.text.call(this, text);
    }
    ;
    return;
  }

  elemEnd(elem) {
    if (!this.#inPreZinc) {
      fandoc.HtmlDocWriter.prototype.elemEnd.call(this, elem);
    }
    ;
    this.#inPreZinc = false;
    return;
  }

  clickJs(show,hide) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("document.getElementById(", sys.Str.toCode(show)), ").style.display=\"block\"; "), sys.Str.plus(sys.Str.plus("document.getElementById(", sys.Str.toCode(hide)), ").style.display=\"none\";"));
  }

}

class DocOutStream extends web.WebOutStream {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return DocOutStream.type$; }

  #trackToNavData = false;

  trackToNavData(it) {
    if (it === undefined) {
      return this.#trackToNavData;
    }
    else {
      this.#trackToNavData = it;
      return;
    }
  }

  #resFiles = null;

  resFiles() {
    return this.#resFiles;
  }

  #doc = null;

  doc(it) {
    if (it === undefined) {
      return this.#doc;
    }
    else {
      this.#doc = it;
      return;
    }
  }

  #env = null;

  env(it) {
    if (it === undefined) {
      return this.#env;
    }
    else {
      this.#env = it;
      return;
    }
  }

  #renderer = null;

  renderer(it) {
    if (it === undefined) {
      return this.#renderer;
    }
    else {
      this.#renderer = it;
      return;
    }
  }

  #navData$Store = undefined;

  // private field reflection only
  __navData$Store(it) { if (it === undefined) return this.#navData$Store; else this.#navData$Store = it; }

  static make(out,resFiles) {
    const $self = new DocOutStream();
    DocOutStream.make$($self,out,resFiles);
    return $self;
  }

  static make$($self,out,resFiles) {
    web.WebOutStream.make$($self, out);
    ;
    $self.#resFiles = resFiles;
    return;
  }

  defSection(title,id) {
    if (id === undefined) id = title;
    if ((this.#trackToNavData && !sys.Str.isEmpty(title))) {
      let navUri = ((this$) => { if (this$.#doc.isTopIndex()) return sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#doc.docName()), "#"), id)); return sys.Str.toUri(sys.Str.plus("#", id)); })(this);
      this.navData().add(navUri, title, 0);
    }
    ;
    let uri = ((this$) => { if (this$.#doc != null) return this$.#env.linkSectionTitle(sys.ObjUtil.coerce(this$.#doc, compilerDoc.Doc.type$), id); return null; })(this);
    this.h2(sys.Str.plus(sys.Str.plus("class='defc-main-heading' id='", sys.Str.toXml(id)), "'"));
    if (uri != null) {
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.a(sys.ObjUtil.coerce(uri, sys.Uri.type$)), DocOutStream.type$).esc(title), DocOutStream.type$).aEnd();
    }
    else {
      this.esc(title);
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.h2End(), DocOutStream.type$).div("class='defc-main-section'"), DocOutStream.type$);
  }

  defSectionEnd() {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.nl(), DocOutStream.type$).divEnd(), DocOutStream.type$).nl(), DocOutStream.type$);
  }

  props() {
    return sys.ObjUtil.coerce(this.table("class='defc-props'"), DocOutStream.type$);
  }

  propsEnd() {
    return sys.ObjUtil.coerce(this.tableEnd(), DocOutStream.type$);
  }

  prop(name,val) {
    if (val == null) {
      return this;
    }
    ;
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.tr(), DocOutStream.type$).th(), DocOutStream.type$).propName(name).thEnd(), DocOutStream.type$).td(), DocOutStream.type$).propVal(val).tdEnd(), DocOutStream.type$).trEnd();
    return this;
  }

  propName(name) {
    if (sys.ObjUtil.is(name, compilerDoc.Doc.type$)) {
      (name = this.docToLink(sys.ObjUtil.coerce(name, compilerDoc.Doc.type$)));
    }
    ;
    if (sys.ObjUtil.is(name, compilerDoc.DocLink.type$)) {
      let link = sys.ObjUtil.coerce(name, compilerDoc.DocLink.type$);
      let uri = this.#env.linkUri(link);
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.a(uri), DocOutStream.type$).esc(link.dis()), DocOutStream.type$).aEnd();
      if (this.#trackToNavData) {
        this.navData().add(uri, link.dis(), 1);
      }
      ;
    }
    else {
      this.esc(name);
    }
    ;
    return this;
  }

  propVal(val) {
    if (sys.ObjUtil.is(val, haystack.Symbol.type$)) {
      return this.symbolVal(sys.ObjUtil.coerce(val, haystack.Symbol.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Uri.type$)) {
      return this.uriVal(sys.ObjUtil.coerce(val, sys.Uri.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return this.listVal(sys.ObjUtil.coerce(val, sys.Type.find("sys::List")));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return this.dictVal(sys.ObjUtil.coerce(val, haystack.Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(val, compilerDoc.DocFandoc.type$)) {
      return this.fandoc(sys.ObjUtil.coerce(val, compilerDoc.DocFandoc.type$));
    }
    ;
    if (sys.ObjUtil.is(val, compilerDoc.DocLink.type$)) {
      return this.linkTo(sys.ObjUtil.coerce(val, compilerDoc.DocLink.type$));
    }
    ;
    return sys.ObjUtil.coerce(this.esc(haystack.Etc.valToDis(val)), DocOutStream.type$);
  }

  listVal(val) {
    const this$ = this;
    val.each((v,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        this$.w(", ");
      }
      ;
      this$.propVal(v);
      return;
    });
    return this;
  }

  dictVal(val) {
    const this$ = this;
    this.w("{");
    let i = 0;
    val.each((v,n) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        this$.w(", ");
      }
      ;
      this$.w(n);
      if (sys.ObjUtil.compareNE(v, haystack.Marker.val())) {
        this$.w(":");
        this$.propVal(v);
      }
      ;
      ((this$) => { let $_u40 = i;i = sys.Int.increment(i); return $_u40; })(this$);
      return;
    });
    return sys.ObjUtil.coerce(this.w("}"), DocOutStream.type$);
  }

  symbolVal(symbol) {
    let $def = this.#env.def(symbol.toStr(), false);
    if ($def != null) {
      return this.link(sys.ObjUtil.coerce($def, compilerDoc.Doc.type$));
    }
    ;
    if ((sys.ObjUtil.equals(symbol.size(), 2) && sys.ObjUtil.equals(symbol.part(0), "lib"))) {
      let lib = this.#env.lib(symbol.part(1), false);
      if (lib != null) {
        return this.link(lib.index(), symbol.toStr());
      }
      ;
    }
    ;
    return sys.ObjUtil.coerce(this.esc(symbol.toStr()), DocOutStream.type$);
  }

  uriVal(uri) {
    return ((this$) => { if (uri.isAbs()) return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this$.a(uri), DocOutStream.type$).esc(uri), DocOutStream.type$).aEnd(), DocOutStream.type$); return sys.ObjUtil.coerce(this$.esc(uri.toStr()), DocOutStream.type$); })(this);
  }

  propDef($def,dis,indentation) {
    if (dis === undefined) dis = $def.dis();
    if (indentation === undefined) indentation = 0;
    let uri = this.#env.linkUri(this.docToLink($def));
    if (this.#trackToNavData) {
      this.navData().add(uri, dis, sys.Int.plus(indentation, 1));
    }
    ;
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.tr(), DocOutStream.type$).th(), DocOutStream.type$).indent(indentation).a(uri), DocOutStream.type$).esc(dis), DocOutStream.type$).aEnd(), DocOutStream.type$).thEnd(), DocOutStream.type$).td(), DocOutStream.type$).docSummary($def).tdEnd(), DocOutStream.type$).trEnd();
    return this;
  }

  propLib(lib,frag) {
    if (frag === undefined) frag = null;
    return this.prop(compilerDoc.DocLink.make(sys.ObjUtil.coerce(this.#doc, compilerDoc.Doc.type$), lib.index(), lib.name(), frag), lib.docSummary());
  }

  propPod(pod) {
    return this.prop(compilerDoc.DocLink.make(sys.ObjUtil.coerce(this.#doc, compilerDoc.Doc.type$), pod.index(), pod.name()), pod.summary());
  }

  propProto(proto) {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.tr(), DocOutStream.type$).th("colspan='2'"), DocOutStream.type$).link(proto).thEnd(), DocOutStream.type$).tr(), DocOutStream.type$);
  }

  propQuick(path,summary,dis) {
    if (dis === undefined) dis = null;
    let toks = sys.Str.split(path, sys.ObjUtil.coerce(47, sys.Int.type$.toNullable()));
    let space = this.#env.space(toks.get(0));
    let doc = space.doc(toks.get(1));
    if (dis == null) {
      (dis = sys.Str.decapitalize(doc.docName()));
    }
    ;
    this.prop(compilerDoc.DocLink.make(sys.ObjUtil.coerce(this.#doc, compilerDoc.Doc.type$), sys.ObjUtil.coerce(doc, compilerDoc.Doc.type$), sys.ObjUtil.coerce(dis, sys.Str.type$)), summary);
    return this;
  }

  propTitle(title) {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.tr(), DocOutStream.type$).th("class='defc-prop-title' colspan='2'"), DocOutStream.type$).esc(title), DocOutStream.type$).thEnd(), DocOutStream.type$).trEnd(), DocOutStream.type$);
  }

  indent(indentation) {
    const this$ = this;
    sys.Int.times(indentation, (it) => {
      this$.w("&nbsp;&nbsp;&nbsp;&nbsp;");
      return;
    });
    return this;
  }

  navData() {
    if (this.#navData$Store === undefined) {
      this.#navData$Store = this.navData$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#navData$Store, DocNavData.type$);
  }

  linkTo(link) {
    let uri = this.#env.linkUri(link);
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.a(uri), DocOutStream.type$).esc(link.dis()), DocOutStream.type$).aEnd();
    return this;
  }

  linkDef(target,dis) {
    if (dis === undefined) dis = target.symbol().toStr();
    return this.link(sys.ObjUtil.coerce(this.#env.resolve(target), compilerDoc.Doc.type$), dis);
  }

  link(target,dis) {
    if (dis === undefined) dis = target.title();
    return this.linkTo(this.docToLink(target, dis));
  }

  docToLink(target,dis) {
    if (dis === undefined) dis = target.title();
    return compilerDoc.DocLink.make(sys.ObjUtil.coerce(this.#doc, compilerDoc.Doc.type$), target, dis);
  }

  docFull($def) {
    return this.fandoc($def.docFull());
  }

  docSummary($def) {
    return this.fandoc($def.docSummary());
  }

  fandoc(doc) {
    this.#renderer.writeFandoc(doc);
    return this;
  }

  navData$Once() {
    return sys.ObjUtil.coerce(this.#renderer, DefDocRenderer.type$).navData();
  }

}

class DefDocTheme extends compilerDoc.DocTheme {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefDocTheme.type$; }

  writeStart(r) {
    let env = sys.ObjUtil.coerce(r.env(), DefDocEnv.type$);
    let out = sys.ObjUtil.coerce(r.out(), DocOutStream.type$);
    if (env.genFullHtml()) {
      out.docType();
      out.html();
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.head(), DocOutStream.type$).w("<meta charset='UTF-8'/>"), DocOutStream.type$).title(), DocOutStream.type$).w(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.Str.toXml(r.doc().title())), " &ndash; "), sys.Str.toXml(env.siteDis()))), DocOutStream.type$).titleEnd(), DocOutStream.type$).includeCss(((this$) => { if (r.doc().isTopIndex()) return sys.Str.toUri(sys.Str.plus("", env.cssFilename())); return sys.Str.toUri(sys.Str.plus("../", env.cssFilename())); })(this)), DocOutStream.type$).headEnd(), DocOutStream.type$).body("style='padding:0; background:#fff; margin:1em 4em 3em 6em;'");
    }
    ;
    sys.ObjUtil.coerce(out.div("class='defc'"), DocOutStream.type$).nl();
    return;
  }

  writeBreadcrumb(r) {
    let env = r.env();
    let doc = r.doc();
    let out = sys.ObjUtil.coerce(r.out(), DocOutStream.type$);
    let nav = DocNavData.make();
    sys.ObjUtil.coerce(out.div("class='defc-nav'"), DocOutStream.type$).ul();
    this.writeBreadcrumbItem(r, env.topIndex(), "Index", nav);
    if (!doc.isTopIndex()) {
      this.writeBreadcrumbSep(r);
      this.writeBreadcrumbItem(r, sys.ObjUtil.coerce(doc.space().doc("index"), compilerDoc.Doc.type$), doc.space().breadcrumb(), nav);
      if (!doc.isSpaceIndex()) {
        if (sys.ObjUtil.is(doc, compilerDoc.DocSrc.type$)) {
          let src = sys.ObjUtil.coerce(doc, compilerDoc.DocSrc.type$);
          let type = src.pod().type(src.uri().basename(), false);
          if (type != null) {
            this.writeBreadcrumbSep(r);
            this.writeBreadcrumbItem(r, sys.ObjUtil.coerce(type, compilerDoc.Doc.type$), type.breadcrumb(), nav);
          }
          ;
        }
        ;
        this.writeBreadcrumbSep(r);
        this.writeBreadcrumbItem(r, doc, doc.breadcrumb(), nav);
      }
      ;
    }
    ;
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.ulEnd(), DocOutStream.type$).divEnd(), DocOutStream.type$).hr(), DocOutStream.type$).nl();
    sys.ObjUtil.coerce(out.w("<!-- defc-breadcrumb"), DocOutStream.type$).nl();
    out.w(nav.encode());
    sys.ObjUtil.coerce(out.w("-->"), DocOutStream.type$).nl();
    return;
  }

  writeBreadcrumbSep(r) {
    r.out().li().w(" \u00bb ").liEnd();
    return;
  }

  writeBreadcrumbItem(r,doc,dis,nav) {
    let uri = r.env().linkUri(compilerDoc.DocLink.make(r.doc(), doc, dis));
    r.out().li().a(uri).esc(dis).aEnd().liEnd();
    nav.add(uri, dis, 0);
    return;
  }

  writeEnd(r) {
    let env = sys.ObjUtil.coerce(r.env(), DefDocEnv.type$);
    let out = sys.ObjUtil.coerce(r.out(), DocOutStream.type$);
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.defSection("").p("class='defc-footer-ts'"), DocOutStream.type$).esc(env.footer()), DocOutStream.type$).pEnd(), DocOutStream.type$).defSectionEnd().divEnd();
    if (env.genFullHtml()) {
      sys.ObjUtil.coerce(out.bodyEnd(), DocOutStream.type$).htmlEnd();
    }
    ;
    return;
  }

  static make() {
    const $self = new DefDocTheme();
    DefDocTheme.make$($self);
    return $self;
  }

  static make$($self) {
    compilerDoc.DocTheme.make$($self);
    return;
  }

}

class DefTopIndexRenderer extends DefDocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefTopIndexRenderer.type$; }

  static make(env,out,doc) {
    const $self = new DefTopIndexRenderer();
    DefTopIndexRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DefDocRenderer.make$($self, sys.ObjUtil.coerce(env, DefDocEnv.type$), out, doc);
    return;
  }

  writeContent() {
    const this$ = this;
    this.out().defSection("manuals").props();
    this.env().spacesMap().vals().findType(compilerDoc.DocPod.type$).sort().each(sys.ObjUtil.coerce((x) => {
      this$.out().propPod(x);
      return;
    }, sys.Type.find("|compilerDoc::DocSpace,sys::Int->sys::Void|")));
    this.out().propsEnd().defSectionEnd();
    DocAppendixIndexRenderer.doWriteContent(this.out(), sys.ObjUtil.coerce(this.env().space("appendix"), DocAppendixSpace.type$));
    this.out().defSection("protos").props();
    this.out().propQuick("proto/index", "Listing of all prototypes", "protos");
    this.out().propsEnd().defSectionEnd();
    return;
  }

}

class DefPodIndexRenderer extends DefDocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefPodIndexRenderer.type$; }

  static make(env,out,doc) {
    const $self = new DefPodIndexRenderer();
    DefPodIndexRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DefDocRenderer.make$($self, sys.ObjUtil.coerce(env, DefDocEnv.type$), out, doc);
    return;
  }

  writeContent() {
    let doc = sys.ObjUtil.coerce(this.doc(), compilerDoc.DocPodIndex.type$);
    let isManual = doc.pod().isManual();
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().defSection(((this$) => { if (isManual) return "manual"; return "pod"; })(this)).h1(), DocOutStream.type$).esc(doc.pod().name()), DocOutStream.type$).h1End(), DocOutStream.type$).p(), DocOutStream.type$).esc(doc.pod().summary()), DocOutStream.type$).pEnd(), DocOutStream.type$).defSectionEnd();
    if (isManual) {
      this.writeManual(doc);
    }
    else {
      this.writeApi(doc);
    }
    ;
    return;
  }

  writeManual(doc) {
    const this$ = this;
    this.out().defSection("chapters").props();
    doc.toc().each((obj) => {
      if (sys.ObjUtil.is(obj, sys.Str.type$)) {
        this$.out().propTitle(sys.ObjUtil.coerce(obj, sys.Str.type$));
        return;
      }
      ;
      let chapter = sys.ObjUtil.coerce(obj, compilerDoc.DocChapter.type$);
      this$.out().prop(chapter, chapter.summary());
      return;
    });
    this.out().propsEnd().defSectionEnd();
    return;
  }

  writeApi(doc) {
    const this$ = this;
    if (doc.toc().isEmpty()) {
      return;
    }
    ;
    if (!sys.ObjUtil.is(doc.toc().first(), sys.Str.type$)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Internal toc error: ", doc.pod().name()), " | "), doc.toc()));
    }
    ;
    doc.toc().each((obj,i) => {
      if (sys.ObjUtil.is(obj, sys.Str.type$)) {
        if (sys.ObjUtil.compareGT(i, 0)) {
          this$.out().propsEnd().defSectionEnd();
        }
        ;
        this$.out().defSection(sys.Str.decapitalize(sys.ObjUtil.toStr(obj))).props();
      }
      else {
        let type = sys.ObjUtil.coerce(obj, compilerDoc.DocType.type$);
        this$.out().prop(compilerDoc.DocLink.make(doc, type, type.name()), type.doc().firstSentence());
      }
      ;
      return;
    });
    this.out().propsEnd().defSectionEnd();
    if (doc.pod().podDoc() != null) {
      this.writeApiPodDoc(sys.ObjUtil.coerce(doc.pod().podDoc(), compilerDoc.DocChapter.type$));
    }
    ;
    return;
  }

  writeApiPodDoc(chapter) {
    this.out().defSection("docs");
    DefChapterRenderer.make(this.env(), this.out(), chapter).writeFandoc(chapter.doc());
    this.out().defSectionEnd();
    return;
  }

  buildNavData() {
    let doc = sys.ObjUtil.coerce(this.doc(), compilerDoc.DocPodIndex.type$);
    if (doc.pod().isManual()) {
      this.buildNavDataManual(doc);
    }
    else {
      this.buildNavDataApi(doc);
    }
    ;
    return;
  }

  buildNavDataManual(doc) {
    const this$ = this;
    doc.toc().each((obj) => {
      if (sys.ObjUtil.is(obj, sys.Str.type$)) {
        return;
      }
      ;
      let chapter = sys.ObjUtil.coerce(obj, compilerDoc.DocChapter.type$);
      this$.navData().add(sys.Str.toUri(sys.Str.plus("", chapter.docName())), chapter.title());
      return;
    });
    return;
  }

  buildNavDataApi(doc) {
    const this$ = this;
    doc.pod().types().each((t) => {
      this$.navData().add(sys.Str.toUri(sys.Str.plus("", t.name())), t.name(), 0);
      return;
    });
    let chapter = doc.pod().podDoc();
    if (chapter != null) {
      this.navData().add(sys.Str.toUri(sys.Str.plus("#", chapter.headings().first().anchorId())), "Docs", 0);
      this.env().walkChapterToc(doc, sys.ObjUtil.coerce(chapter, compilerDoc.Doc.type$), (h,uri) => {
        this$.navData().add(uri, h.title(), sys.Int.max(sys.Int.minus(h.level(), 1), 1));
        return;
      });
    }
    ;
    return;
  }

}

class DefChapterRenderer extends DefDocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefChapterRenderer.type$; }

  static make(env,out,doc) {
    const $self = new DefChapterRenderer();
    DefChapterRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DefDocRenderer.make$($self, sys.ObjUtil.coerce(env, DefDocEnv.type$), out, doc);
    return;
  }

  writePrevNext() {
    let cur = sys.ObjUtil.coerce(this.doc(), compilerDoc.DocChapter.type$);
    let prev = cur.prev();
    let next = cur.next();
    if ((prev != null || next != null)) {
      sys.ObjUtil.coerce(this.out().div("class='defc-nav'"), DocOutStream.type$).ul();
      if (prev != null) {
        sys.ObjUtil.coerce(this.out().li("class='prev'"), DocOutStream.type$).link(sys.ObjUtil.coerce(prev, compilerDoc.Doc.type$), sys.Str.plus("\u00ab ", prev.title())).liEnd();
      }
      else {
        sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().li(), DocOutStream.type$).w("&nbsp;"), DocOutStream.type$).liEnd();
      }
      ;
      if (next != null) {
        sys.ObjUtil.coerce(this.out().li("class='next'"), DocOutStream.type$).link(sys.ObjUtil.coerce(next, compilerDoc.Doc.type$), sys.Str.plus(sys.Str.plus("", next.title()), " \u00bb")).liEnd();
      }
      ;
      sys.ObjUtil.coerce(this.out().ulEnd(), DocOutStream.type$).divEnd();
    }
    ;
    return this;
  }

  writeContent() {
    let chapter = sys.ObjUtil.coerce(this.doc(), compilerDoc.DocChapter.type$);
    sys.ObjUtil.coerce(this.out().divEnd(), DocOutStream.type$).div("class='defc-manual'");
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().h1("class='defc-chapter-title'"), DocOutStream.type$).esc(chapter.title()), DocOutStream.type$).h1End();
    this.out().div();
    this.writeChapterTocLinks(this.doc());
    this.out().divEnd();
    this.writeVideo(chapter);
    if (sys.ObjUtil.equals(chapter.meta().get("layout"), "slide")) {
      this.writeSlide(chapter);
    }
    else {
      this.out().fandoc(chapter.doc());
    }
    ;
    return;
  }

  writeVideo(chapter) {
    let vimeo = chapter.meta().get("vimeo");
    if (vimeo == null) {
      return;
    }
    ;
    if (!sys.Str.startsWith(vimeo, "https")) {
      (vimeo = sys.Str.plus("https://player.vimeo.com/video/", vimeo));
    }
    ;
    let uri = sys.Str.toUri(vimeo).plusQuery(sys.Map.__fromLiteral(["title","byline","portrait"], ["0","0","0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().w("<iframe style='border:1px solid #9f9f9f; margin: 1em 0;' src='"), DocOutStream.type$).w(uri.toStr()), DocOutStream.type$).w("'"), DocOutStream.type$).w(" width='960' height='540' frameborder='0'"), DocOutStream.type$).w(" webkitAllowFullScreen mozallowfullscreen allowFullScreen>"), DocOutStream.type$).w("</iframe>\n");
    return;
  }

  writeSlide(chapter) {
    this.out().div("class='defc-slide'");
    this.out().fandoc(chapter.doc());
    this.out().divEnd();
    return;
  }

  buildNavData() {
    const this$ = this;
    this.env().walkChapterToc(this.doc(), this.doc(), (h,uri) => {
      this$.navData().add(uri, h.title(), sys.Int.max(sys.Int.minus(h.level(), 2), 0));
      return;
    });
    return;
  }

}

class DocDefTree extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#kids = sys.List.make(DocDefTree.type$);
    return;
  }

  typeof() { return DocDefTree.type$; }

  #parent = null;

  parent(it) {
    if (it === undefined) {
      return this.#parent;
    }
    else {
      this.#parent = it;
      return;
    }
  }

  #def = null;

  def(it) {
    if (it === undefined) {
      return this.#def;
    }
    else {
      this.#def = it;
      return;
    }
  }

  #kids = null;

  // private field reflection only
  __kids(it) { if (it === undefined) return this.#kids; else this.#kids = it; }

  static make(parent,$def) {
    const $self = new DocDefTree();
    DocDefTree.make$($self,parent,$def);
    return $self;
  }

  static make$($self,parent,$def) {
    ;
    $self.#parent = parent;
    $self.#def = $def;
    return;
  }

  isEmpty() {
    return this.#kids.isEmpty();
  }

  compare(that) {
    return sys.ObjUtil.compare(this.#def, sys.ObjUtil.coerce(that, DocDefTree.type$).#def);
  }

  add($def) {
    let kid = DocDefTree.make(this, $def);
    this.#kids.add(kid);
    return kid;
  }

  each(f) {
    this.doEach(-1, f);
    return;
  }

  doEach(indent,f) {
    const this$ = this;
    if (sys.ObjUtil.compareGE(indent, 0)) {
      sys.Func.call(f, sys.ObjUtil.coerce(indent, sys.Obj.type$.toNullable()), this.#def);
    }
    ;
    this.#kids.dup().sort().each((kid) => {
      kid.doEach(sys.Int.plus(indent, 1), f);
      return;
    });
    return;
  }

  invert() {
    const this$ = this;
    let leafs = sys.List.make(DocDefTree.type$);
    this.findLeafs(leafs);
    let root = DocDefTree.make(null, this.#def);
    let nodes = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::DocDefTree"));
    leafs.each((leaf) => {
      this$.addPath(nodes, root, leaf);
      return;
    });
    return root;
  }

  findLeafs(acc) {
    const this$ = this;
    if (this.#kids.isEmpty()) {
      acc.add(this);
    }
    else {
      this.#kids.each((kid) => {
        kid.findLeafs(acc);
        return;
      });
    }
    ;
    return;
  }

  addPath(nodes,parent,x) {
    if (x.#parent == null) {
      return;
    }
    ;
    let node = nodes.get(x.#def.name());
    if (node == null) {
      (node = parent.add(x.#def));
      nodes.set(x.#def.name(), sys.ObjUtil.coerce(node, DocDefTree.type$));
    }
    ;
    if (x.#parent != null) {
      this.addPath(nodes, sys.ObjUtil.coerce(node, DocDefTree.type$), sys.ObjUtil.coerce(x.#parent, DocDefTree.type$));
    }
    ;
    return;
  }

}

class DocLib extends compilerDoc.DocSpace {
  constructor() {
    super();
    const this$ = this;
    this.#manualRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return DocLib.type$; }

  #def = null;

  def() { return this.#def; }

  __def(it) { if (it === undefined) return this.#def; else this.#def = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #index = null;

  index() { return this.#index; }

  __index(it) { if (it === undefined) return this.#index; else this.#index = it; }

  #manualRef = null;

  manualRef() { return this.#manualRef; }

  __manualRef(it) { if (it === undefined) return this.#manualRef; else this.#manualRef = it; }

  #defs = null;

  defs() { return this.#defs; }

  __defs(it) { if (it === undefined) return this.#defs; else this.#defs = it; }

  #docSummary = null;

  docSummary() { return this.#docSummary; }

  __docSummary(it) { if (it === undefined) return this.#docSummary; else this.#docSummary = it; }

  #docFull = null;

  docFull() { return this.#docFull; }

  __docFull(it) { if (it === undefined) return this.#docFull; else this.#docFull = it; }

  static make(f) {
    const $self = new DocLib();
    DocLib.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    compilerDoc.DocSpace.make$($self);
    ;
    sys.Func.call(f, $self);
    return;
  }

  spaceName() {
    return sys.Str.plus("lib-", this.#name);
  }

  breadcrumb() {
    return this.#name;
  }

  manual() {
    return sys.ObjUtil.coerce(this.#manualRef.val(), DocLibManual.type$.toNullable());
  }

  doc(docName,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    if (sys.ObjUtil.equals(docName, this.#index.docName())) {
      return this.#index;
    }
    ;
    if (sys.ObjUtil.equals(docName, ((this$) => { let $_u44 = this$.manual(); if ($_u44 == null) return null; return this$.manual().docName(); })(this))) {
      return this.manual();
    }
    ;
    let doc = this.#defs.find((doc) => {
      return sys.ObjUtil.equals(doc.docName(), docName);
    });
    if (doc != null) {
      return doc;
    }
    ;
    if (checked) {
      throw compilerDoc.UnknownDocErr.make(docName);
    }
    ;
    return null;
  }

  eachDoc(f) {
    sys.Func.call(f, this.#index);
    if (this.manual() != null) {
      sys.Func.call(f, sys.ObjUtil.coerce(this.manual(), compilerDoc.Doc.type$));
    }
    ;
    this.#defs.each(f);
    return;
  }

}

class DocLibIndex extends DocDef {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocLibIndex.type$; }

  static make(lib) {
    const $self = new DocLibIndex();
    DocLibIndex.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    DocDef.make$($self, lib, CLoc.none(), lib.def());
    return;
  }

  docName() {
    return "index";
  }

  title() {
    return this.lib().name();
  }

  isSpaceIndex() {
    return true;
  }

  renderer() {
    return DocLibIndexRenderer.type$;
  }

}

class DocLibManual extends compilerDoc.Doc {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocLibManual.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #chapter = null;

  chapter() { return this.#chapter; }

  __chapter(it) { if (it === undefined) return this.#chapter; else this.#chapter = it; }

  static make(lib,chapter) {
    const $self = new DocLibManual();
    DocLibManual.make$($self,lib,chapter);
    return $self;
  }

  static make$($self,lib,chapter) {
    compilerDoc.Doc.make$($self);
    $self.#lib = lib;
    $self.#chapter = chapter;
    return;
  }

  space() {
    return this.#lib;
  }

  docName() {
    return "doc";
  }

  title() {
    return this.#lib.name();
  }

  renderer() {
    return DocLibManualRenderer.type$;
  }

  heading(id,checked) {
    if (checked === undefined) checked = true;
    return this.#chapter.heading(id, checked);
  }

}

class DocLibIndexRenderer extends DefDocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocLibIndexRenderer.type$; }

  static make(env,out,doc) {
    const $self = new DocLibIndexRenderer();
    DocLibIndexRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DefDocRenderer.make$($self, sys.ObjUtil.coerce(env, DefDocEnv.type$), sys.ObjUtil.coerce(out, DocOutStream.type$), doc);
    return;
  }

  writeContent() {
    const this$ = this;
    let lib = sys.ObjUtil.coerce(this.doc(), DocLibIndex.type$).lib();
    this.writeDefHeader("lib", lib.def().symbol().toStr(), null, lib.docFull());
    this.writeMetaSection(lib.def());
    this.writeChapterTocSection("docs", lib.manual());
    this.out().trackToNavData(true);
    let terms = lib.defs().findAll((it) => {
      return it.type().isTerm();
    });
    if (!terms.isEmpty()) {
      this.out().defSection("tags", "tags-index").props();
      terms.each((term) => {
        this$.out().propDef(term);
        return;
      });
      this.out().propsEnd().defSectionEnd();
    }
    ;
    this.env().ns().features().each((feature) => {
      let keys = lib.defs().findAll((x) => {
        return (x.type().isKey() && sys.ObjUtil.equals(x.symbol().part(0), feature.name()));
      });
      this$.writeListSection(sys.Str.plus(feature.name(), "s"), keys, true);
      return;
    });
    return;
  }

}

class DocLibManualRenderer extends DefDocRenderer {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocLibManualRenderer.type$; }

  static make(env,out,doc) {
    const $self = new DocLibManualRenderer();
    DocLibManualRenderer.make$($self,env,out,doc);
    return $self;
  }

  static make$($self,env,out,doc) {
    DefDocRenderer.make$($self, sys.ObjUtil.coerce(env, DefDocEnv.type$), sys.ObjUtil.coerce(out, DocOutStream.type$), doc);
    return;
  }

  writeContent() {
    let lib = sys.ObjUtil.coerce(this.doc(), DocLibManual.type$).lib();
    let chapter = lib.manual().chapter();
    sys.ObjUtil.coerce(this.out().divEnd(), DocOutStream.type$).div("class='defc-manual'");
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.out().h1("class='defc-chapter-title'"), DocOutStream.type$).esc(sys.Str.plus("lib ", lib.name())), DocOutStream.type$).h1End();
    this.out().div();
    this.writeChapterTocLinks(this.doc());
    this.out().divEnd();
    this.out().fandoc(chapter.doc());
    return;
  }

  buildNavData() {
    const this$ = this;
    this.env().walkChapterToc(this.doc(), this.doc(), (h,uri) => {
      this$.navData().add(uri, h.title(), sys.Int.max(sys.Int.minus(h.level(), 2), 0));
      return;
    });
    return;
  }

}

class DocNavData extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#buf = sys.StrBuf.make();
    return;
  }

  typeof() { return DocNavData.type$; }

  #buf = null;

  // private field reflection only
  __buf(it) { if (it === undefined) return this.#buf; else this.#buf = it; }

  add(uri,title,level) {
    if (level === undefined) level = 1;
    this.#buf.add(sys.Str.spaces(level));
    this.#buf.add(sys.Str.replace(uri.encode(), ".html", "")).addChar(32);
    this.addSafe(title);
    this.#buf.addChar(10);
    return this;
  }

  addSafe(s) {
    const this$ = this;
    if ((sys.Str.isEmpty(s) || sys.ObjUtil.equals(sys.Str.get(s, 0), 32))) {
      throw sys.ArgErr.make(s);
    }
    ;
    sys.Str.each(s, (c) => {
      if ((sys.ObjUtil.compareLT(c, 32) || sys.ObjUtil.equals(c, 62))) {
        return;
      }
      ;
      this$.#buf.addChar(c);
      return;
    });
    return;
  }

  isEmpty() {
    return this.#buf.isEmpty();
  }

  encode() {
    return this.#buf.toStr();
  }

  static make() {
    const $self = new DocNavData();
    DocNavData.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Validate extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Validate.type$; }

  static make(c) {
    const $self = new Validate();
    Validate.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    return;
  }

  run() {
    const this$ = this;
    this.eachLib((lib) => {
      this$.validateLib(lib);
      return;
    });
    this.eachDef(($def) => {
      this$.validateDef($def);
      return;
    });
    return;
  }

  validateLib(lib) {
    if (lib.meta().get("baseUri") == null) {
      this.err(sys.Str.plus("Lib must define baseUri: ", lib), lib.loc());
    }
    ;
    return;
  }

  validateDef($def) {
    const this$ = this;
    if (sys.ObjUtil.equals($def.toStr(), "index")) {
      this.err("The name 'index' is reserved for documentation", $def.loc());
    }
    ;
    if ((!this.fitsRoot($def) && !$def.type().isKey())) {
      this.err(sys.Str.plus("Def must derive from one of the core base types: ", $def), $def.loc());
    }
    ;
    let $_u45 = $def.type();
    if (sys.ObjUtil.equals($_u45, haystack.SymbolType.conjunct())) {
      this.validateConjuct($def);
    }
    ;
    $def.meta().each((pair) => {
      this$.validateDefTag($def, pair);
      return;
    });
    return;
  }

  validateConjuct($def) {
    const this$ = this;
    $def.conjunct().tags().each((tag) => {
      if (!tag.isMarker()) {
        this$.err(sys.Str.plus("Conjunct terms must be all be markers: ", tag.symbol()), $def.loc());
      }
      ;
      return;
    });
    return;
  }

  validateDefTag($def,pair) {
    let tag = pair.tag();
    if (tag == null) {
      return;
    }
    ;
    let name = tag.name();
    if ((tag.has("computedFromReciprocal") && !this.isComputedException($def, pair))) {
      this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot declare computedFromReciprocal tag '", pair.name()), "' on '"), $def), "'"), $def.loc());
    }
    ;
    if ((sys.ObjUtil.equals(name, "tagOn") && !$def.type().isTag())) {
      this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot use tagOn on ", $def.symbol().type()), " '"), $def), "'"), $def.loc());
    }
    ;
    if ((sys.ObjUtil.equals(name, "children") && !$def.isEntity())) {
      this.err(sys.Str.plus(sys.Str.plus("Cannot use children tag on non-entity '", $def), "'"), $def.loc());
    }
    ;
    if (sys.ObjUtil.equals(name, "of")) {
      this.verifyOfTag($def, pair);
    }
    ;
    if ((tag.isChoice() && pair.val() !== haystack.Marker.val())) {
      this.err(sys.Str.plus(sys.Str.plus("Choice tag '", name), "' must use tagOn"), $def.loc());
    }
    ;
    if ((tag.isRelationship() && !$def.isRef())) {
      this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot apply relationship tag '", name), "' to non-ref '"), $def), "'"), $def.loc());
    }
    ;
    return;
  }

  verifyOfTag($def,pair) {
    if ($def.isChoice()) {
      let val = sys.ObjUtil.as(pair.val(), CDef.type$);
      if ((val != null && !val.isMarker())) {
        this.err(sys.Str.plus(sys.Str.plus("Choice 'of' value must be marker '", $def), "'"), $def.loc());
      }
      ;
    }
    ;
    return;
  }

  fitsRoot($def) {
    return ($def.isMarker() || $def.isVal() || $def.isFeature());
  }

  isComputedException($def,pair) {
    if ((sys.ObjUtil.equals(pair.name(), "tags") && $def.has("template"))) {
      return true;
    }
    ;
    return false;
  }

}

class GenGrid extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GenGrid.type$; }

  #format = null;

  format() { return this.#format; }

  __format(it) { if (it === undefined) return this.#format; else this.#format = it; }

  static make(c,format) {
    const $self = new GenGrid();
    GenGrid.make$($self,c,format);
    return $self;
  }

  static make$($self,c,format) {
    DefCompilerStep.make$($self, c);
    $self.#format = format;
    return;
  }

  run() {
    let c = this.compiler();
    let grid = this.toGrid(c);
    let filetype = c.ns().filetype(this.#format);
    let uri = sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.baseName()), "."), filetype.fileExt()));
    let onFile = this.compiler().onDocFile();
    let opts = haystack.Etc.makeDict1("ns", c.ns());
    if (onFile != null) {
      this.info(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Generating ", filetype.dis()), " "), sys.Str.capitalize(this.baseName())), " in-memory"));
      let buf = sys.Buf.make();
      this.writeGrid(grid, sys.ObjUtil.coerce(filetype, haystack.Filetype.type$), buf.out());
      sys.Func.call(onFile, DocFile.make(uri, sys.ObjUtil.coerce(filetype.dis(), sys.Str.type$), sys.ObjUtil.coerce(buf, sys.Buf.type$)));
    }
    else {
      let file = c.initOutDir().plus(uri);
      this.info(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Generating ", filetype.dis()), " "), sys.Str.capitalize(this.baseName())), " ["), file.osPath()), "]"));
      this.writeGrid(grid, sys.ObjUtil.coerce(filetype, haystack.Filetype.type$), file.out());
    }
    ;
    return;
  }

  static formats() {
    return sys.List.make(sys.Str.type$, ["zinc", "trio", "json", "turtle", "jsonld", "csv"]);
  }

  writeGrid(grid,filetype,out) {
    let c = this.compiler();
    let opts = filetype.ioOpts(sys.ObjUtil.coerce(c.ns(), haystack.Namespace.type$), null, haystack.Etc.emptyDict(), haystack.Etc.emptyDict());
    let writer = filetype.writer(out, opts);
    writer.writeGrid(grid);
    out.close();
    return;
  }

}

class GenDefsGrid extends GenGrid {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GenDefsGrid.type$; }

  static make(c,format) {
    const $self = new GenDefsGrid();
    GenDefsGrid.make$($self,c,format);
    return $self;
  }

  static make$($self,c,format) {
    GenGrid.make$($self, c, format);
    return;
  }

  baseName() {
    return "defs";
  }

  toGrid(c) {
    if (c.defsGrid() == null) {
      c.defsGrid(c.ns().toGrid());
    }
    ;
    return sys.ObjUtil.coerce(c.defsGrid(), haystack.Grid.type$);
  }

}

class GenProtosGrid extends GenGrid {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GenProtosGrid.type$; }

  static make(c,format) {
    const $self = new GenProtosGrid();
    GenProtosGrid.make$($self,c,format);
    return $self;
  }

  static make$($self,c,format) {
    GenGrid.make$($self, c, format);
    return;
  }

  baseName() {
    return "protos";
  }

  toGrid(c) {
    if (c.protosGrid() == null) {
      c.protosGrid(this.buildProtosGrid(c));
    }
    ;
    return sys.ObjUtil.coerce(c.protosGrid(), haystack.Grid.type$);
  }

  buildProtosGrid(c) {
    const this$ = this;
    let allTags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    c.index().protos().each((proto) => {
      proto.dict().each((v,n) => {
        allTags.set(n, n);
        return;
      });
      return;
    });
    if (allTags.containsKey("proto")) {
      throw sys.Err.make("There are protos with the 'proto' tag");
    }
    ;
    let gb = haystack.GridBuilder.make();
    gb.addCol("proto");
    allTags.keys().sort().each((n) => {
      gb.addCol(n);
      return;
    });
    c.index().protos().each((proto) => {
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.size(gb.numCols());
      cells.set(0, proto.dis());
      proto.dict().each((v,n) => {
        cells.set(gb.colNameToIndex(n), v);
        return;
      });
      gb.addRow(cells);
      return;
    });
    return gb.toGrid();
  }

}

class Normalize extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Normalize.type$; }

  static make(c) {
    const $self = new Normalize();
    Normalize.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    return;
  }

  run() {
    const this$ = this;
    this.eachLib((lib) => {
      this$.normalizeLib(lib);
      return;
    });
    this.eachDef(($def) => {
      this$.normalize($def);
      return;
    });
    return;
  }

  normalizeLib(lib) {
    if (lib.meta().get("version") == null) {
      this.err(sys.Str.plus("Lib must define version: ", lib), lib.loc());
      lib.set(this.etc().version(), "0.0");
    }
    ;
    return;
  }

  normalize($def) {
    if (sys.ObjUtil.equals($def.symbol().toStr(), "tz")) {
      $def.set(this.etc().enum(), sys.TimeZone.listNames().join("\n"));
    }
    ;
    if (sys.ObjUtil.equals($def.symbol().toStr(), "unit")) {
      $def.set(this.etc().enum(), this.unitEnumStr());
    }
    ;
    if ($def.meta().get("lib") != null) {
      this.err(sys.Str.plus("Def cannot declare lib tag: ", $def), $def.loc());
    }
    else {
      $def.set($def.lib().key().feature(), $def.lib());
    }
    ;
    this.normalizeListVals($def);
    let doc = $def.meta().get("doc");
    if (doc != null) {
      $def.fandoc(CFandoc.make($def.loc(), sys.ObjUtil.toStr(doc.val())));
    }
    ;
    return;
  }

  normalizeListVals($def) {
    const this$ = this;
    $def.meta().each((pair) => {
      if (pair.tag() == null) {
        return;
      }
      ;
      if (!pair.tag().isList()) {
        return;
      }
      ;
      if (pair.tag().has("computedFromReciprocal")) {
        return;
      }
      ;
      if (sys.ObjUtil.is(pair.val(), sys.Type.find("sys::List"))) {
        return;
      }
      ;
      pair.val(sys.List.make(sys.Obj.type$, [pair.val()]));
      return;
    });
    return;
  }

  unitEnumStr() {
    const this$ = this;
    let s = sys.StrBuf.make(16384);
    sys.Unit.quantities().each((q) => {
      sys.Unit.quantity(q).each((u) => {
        s.add("- ").add(u.symbol()).add(": ").add(u.name()).add(" (").add(q).add(")\n");
        return;
      });
      return;
    });
    return s.toStr();
  }

}

class Scan extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Scan.type$; }

  static make(c) {
    const $self = new Scan();
    Scan.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    return;
  }

  run() {
    const this$ = this;
    let inputs = this.compiler().inputs();
    inputs.each((input) => {
      this$.scanInput(input);
      return;
    });
    if (this.compiler().libs().isEmpty()) {
      this.err("No libs found", CLoc.none());
    }
    ;
    return;
  }

  scanInput(input) {
    let $_u46 = input.inputType();
    if (sys.ObjUtil.equals($_u46, CompilerInputType.lib())) {
      return this.scanLibInput(sys.ObjUtil.coerce(input, LibInput.type$));
    }
    else if (sys.ObjUtil.equals($_u46, CompilerInputType.manual())) {
      return this.scanManualInput(sys.ObjUtil.coerce(input, ManualInput.type$));
    }
    else {
      throw sys.Err.make(input.inputType().toStr());
    }
    ;
  }

  scanLibInput(input) {
    let loc = input.loc();
    let dict = sys.ObjUtil.as(input.scanMeta(this.compiler()), haystack.Dict.type$);
    if (dict == null) {
      return;
    }
    ;
    let files = input.scanFiles(this.compiler());
    let symbol = this.parseLibSymbol("def", dict.get("def"), loc);
    if (symbol == null) {
      return;
    }
    ;
    if ((dict.missing("depends") && sys.ObjUtil.compareNE(symbol.name(), "ph"))) {
      return this.err("Lib missing 'depends' tag", loc);
    }
    ;
    let depends = this.parseDepends(dict.get("depends"), loc);
    let dup = this.compiler().libs().get(sys.ObjUtil.coerce(symbol, CSymbol.type$));
    if (dup != null) {
      return this.err2(sys.Str.plus("Duplicate libs: ", symbol), dup.loc(), loc);
    }
    ;
    let lib = CLib.make(loc, sys.ObjUtil.coerce(symbol, CSymbol.type$), sys.ObjUtil.coerce(dict, haystack.Dict.type$), input, depends);
    this.compiler().libs().add(sys.ObjUtil.coerce(symbol, CSymbol.type$), lib);
    return;
  }

  parseDepends(val,loc) {
    const this$ = this;
    if (val == null) {
      return sys.ObjUtil.coerce(CSymbol.type$.emptyList(), sys.Type.find("defc::CSymbol[]"));
    }
    ;
    if (!sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      this.err("Expecting lib 'depends' tag be list", loc);
      return sys.ObjUtil.coerce(CSymbol.type$.emptyList(), sys.Type.find("defc::CSymbol[]"));
    }
    ;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::CSymbol")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:defc::CSymbol]"));
    sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).each((x) => {
      let symbol = this$.parseLibSymbol("depends", x, loc);
      if (symbol == null) {
        return;
      }
      ;
      if (acc.get(symbol.val().toStr()) != null) {
        this$.err(sys.Str.plus("Duplicate depends: ", symbol), loc);
        return;
      }
      ;
      acc.set(symbol.val().toStr(), sys.ObjUtil.coerce(symbol, CSymbol.type$));
      return;
    });
    return acc.vals();
  }

  parseLibSymbol(tagName,val,loc) {
    let symbol = this.parseSymbol(tagName, val, loc);
    if (symbol == null) {
      return null;
    }
    ;
    if ((!symbol.type().isKey() || sys.ObjUtil.compareNE(symbol.parts().get(0).toStr(), "lib"))) {
      this.err(sys.Str.plus("Lib symbol must be 'lib:name': ", symbol), loc);
      return null;
    }
    ;
    return symbol;
  }

  scanManualInput(input) {
    if (!this.compiler().genDocEnv()) {
      return;
    }
    ;
    let pod = input.pod();
    let name = input.pod().name();
    let loc = CLoc.make(name);
    let docPod = compilerDoc.DocPod.load(null, sys.ObjUtil.coerce(sys.ObjUtil.trap(pod,"loadFile", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.File.type$));
    let index = this.readManualIndex(pod);
    if (index == null) {
      return;
    }
    ;
    let dup = this.compiler().manuals().get(name);
    if (dup != null) {
      return this.err(sys.Str.plus("Duplicate manuals: ", name), loc);
    }
    ;
    this.compiler().manuals().add(name, docPod);
    return;
  }

  readManualIndex(pod) {
    let uri = sys.Uri.fromStr("/doc/index.fog");
    try {
      return sys.ObjUtil.coerce(pod.file(uri).readObj(), sys.Type.find("sys::Obj[]?"));
    }
    catch ($_u47) {
      $_u47 = sys.Err.make($_u47);
      if ($_u47 instanceof sys.Err) {
        let e = $_u47;
        ;
        this.err("Cannot read manual index", CLoc.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", pod.name()), "::"), uri)), e);
        return null;
      }
      else {
        throw $_u47;
      }
    }
    ;
  }

}

class GenNamespace extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GenNamespace.type$; }

  static make(c) {
    const $self = new GenNamespace();
    GenNamespace.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    return;
  }

  run() {
    const this$ = this;
    let db = def.DefBuilder.make();
    db.factory(this.compiler().factory());
    this.eachDef((c) => {
      db.addDef(this$.genMeta(c), c.aux());
      return;
    });
    this.compiler().ns(db.build());
    this.index().nsRef(this.compiler().ns());
    return;
  }

  genMeta(c) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    c.meta().each((pair,n) => {
      let v = this$.genVal(pair.val());
      if ((sys.ObjUtil.equals(n, "doc") && this$.stripDoc(c))) {
        return;
      }
      ;
      acc.set(n, sys.ObjUtil.coerce(v, sys.Obj.type$));
      return;
    });
    return haystack.Etc.makeDict(acc);
  }

  stripDoc(c) {
    if (c.meta().get("nodoc") == null) {
      return false;
    }
    ;
    if (c.isLib()) {
      return false;
    }
    ;
    return true;
  }

  genVal(c) {
    const this$ = this;
    if (sys.ObjUtil.is(c, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(c, sys.Type.find("sys::List")).map((v) => {
        return this$.genVal(v);
      }, sys.Obj.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(c, CDef.type$)) {
      return sys.ObjUtil.coerce(c, CDef.type$).symbol().val();
    }
    ;
    return c;
  }

}

class Parse extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Parse.type$; }

  static make(c) {
    const $self = new Parse();
    Parse.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    return;
  }

  run() {
    const this$ = this;
    this.eachLib((lib) => {
      this$.parseLib(lib);
      return;
    });
    return;
  }

  parseLib(lib) {
    const this$ = this;
    lib.input().scanFiles(this.compiler()).each((file) => {
      this$.parseFile(lib, file);
      return;
    });
    lib.input().scanExtra(this.compiler()).each((dict) => {
      this$.parseRec(lib, dict, lib.loc());
      return;
    });
    return;
  }

  parseFile(lib,file) {
    const this$ = this;
    try {
      CompilerInput.parseEachDict(this.compiler(), file, (dict,loc) => {
        this$.parseRec(lib, dict, loc);
        return;
      });
    }
    catch ($_u48) {
      $_u48 = sys.Err.make($_u48);
      if ($_u48 instanceof sys.Err) {
        let e = $_u48;
        ;
        this.err("Cannot parse Trio file", sys.ObjUtil.coerce(CLoc.makeFile(file), CLoc.type$), e);
      }
      else {
        throw $_u48;
      }
    }
    ;
    return;
  }

  parseRec(lib,dict,loc) {
    if (dict.has("def")) {
      return this.parseDef(lib, dict, loc);
    }
    ;
    if (dict.has("defx")) {
      return this.parseDefX(lib, dict, loc);
    }
    ;
    let a = lib.input().adapt(this.compiler(), dict, loc);
    if (a == null) {
      return;
    }
    ;
    return this.parseDef(lib, sys.ObjUtil.coerce(a, haystack.Dict.type$), loc);
    this.err("Rec missing 'def' and 'defx'", loc);
    return;
  }

  parseDef(lib,dict,loc) {
    let symbol = this.parseSymbol("def", dict.get("def"), loc);
    if (symbol == null) {
      return;
    }
    ;
    if (this.compiler().undefine(dict)) {
      return;
    }
    ;
    this.addDef(loc, lib, sys.ObjUtil.coerce(symbol, CSymbol.type$), dict);
    return;
  }

  parseDefX(lib,dict,loc) {
    let symbol = this.parseSymbol("defx", dict.get("defx"), loc);
    if (symbol == null) {
      return;
    }
    ;
    let defx = CDefX.make(loc, lib, sys.ObjUtil.coerce(symbol, CSymbol.type$), dict);
    lib.defXs().add(defx);
    return;
  }

}

class Reflect extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
    this.#intSymbol = sys.ObjUtil.coerce(haystack.Symbol.fromStr("int"), haystack.Symbol.type$);
    this.#durationSymbol = sys.ObjUtil.coerce(haystack.Symbol.fromStr("duration"), haystack.Symbol.type$);
    return;
  }

  typeof() { return Reflect.type$; }

  #intSymbol = null;

  // private field reflection only
  __intSymbol(it) { if (it === undefined) return this.#intSymbol; else this.#intSymbol = it; }

  #durationSymbol = null;

  // private field reflection only
  __durationSymbol(it) { if (it === undefined) return this.#durationSymbol; else this.#durationSymbol = it; }

  static make(c) {
    const $self = new Reflect();
    Reflect.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    ;
    return;
  }

  run() {
    const this$ = this;
    this.eachLib((lib) => {
      try {
        this$.reflectLib(lib);
      }
      catch ($_u49) {
        $_u49 = sys.Err.make($_u49);
        if ($_u49 instanceof sys.Err) {
          let e = $_u49;
          ;
          this$.err(sys.Str.plus("Cannot reflect lib: ", lib.name()), lib.loc(), e);
        }
        else {
          throw $_u49;
        }
      }
      ;
      return;
    });
    return;
  }

  reflectLib(lib) {
    const this$ = this;
    lib.input().scanReflects(this.compiler()).each((ri) => {
      this$.reflectInput(lib, ri);
      return;
    });
    return;
  }

  reflectInput(lib,ri) {
    try {
      sys.ObjUtil.trap(ri.type(),"finish", sys.List.make(sys.Obj.type$.toNullable(), []));
    }
    catch ($_u50) {
      $_u50 = sys.Err.make($_u50);
      if ($_u50 instanceof sys.Err) {
        let e = $_u50;
        ;
        e.trace();
      }
      else {
        throw $_u50;
      }
    }
    ;
    this.reflectType(lib, ri);
    this.reflectFields(lib, ri);
    this.reflectMethods(lib, ri);
    return;
  }

  reflectType(lib,ri) {
    let facetType = ri.typeFacet();
    if (facetType == null) {
      return;
    }
    ;
    let type = ri.type();
    let facet = sys.ObjUtil.as(type.facet(sys.ObjUtil.coerce(facetType, sys.Type.type$), false), haystack.Define.type$);
    if (facet == null) {
      return null;
    }
    ;
    let loc = CLoc.make(type.qname());
    let symbol = ri.toSymbol(null);
    let csymbol = this.parseSymbol("def", symbol, loc);
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.set("def", symbol);
    let dict = this.typeToMeta(acc, symbol, ri, sys.ObjUtil.coerce(facet, haystack.Define.type$));
    let $def = this.addDef(loc, lib, sys.ObjUtil.coerce(csymbol, CSymbol.type$), dict);
    if ($def != null) {
      ri.onDef(null, sys.ObjUtil.coerce($def, CDef.type$));
    }
    ;
    return;
  }

  reflectFields(lib,ri) {
    const this$ = this;
    let facetType = ri.fieldFacet();
    if (facetType == null) {
      return;
    }
    ;
    ri.type().fields().each((field) => {
      if (field.parent() !== ri.type()) {
        return;
      }
      ;
      let facet = field.facet(sys.ObjUtil.coerce(facetType, sys.Type.type$), false);
      if (facet != null) {
        this$.reflectField(lib, ri, field, sys.ObjUtil.coerce(facet, haystack.Define.type$));
      }
      ;
      return;
    });
    return;
  }

  reflectField(lib,ri,field,facet) {
    let loc = CLoc.make(field.qname());
    let symbol = ri.toSymbol(field);
    let csymbol = this.parseSymbol("def", symbol, loc);
    let type = this.typeToDef(field.type());
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.set("def", symbol);
    acc.set("is", type);
    let dict = this.slotToMeta(acc, symbol, ri, field, facet);
    let $def = this.addDef(loc, lib, sys.ObjUtil.coerce(csymbol, CSymbol.type$), dict);
    if ($def != null) {
      ri.onDef(field, sys.ObjUtil.coerce($def, CDef.type$));
    }
    ;
    return;
  }

  reflectMethods(lib,ri) {
    const this$ = this;
    let facetType = ri.methodFacet();
    if (facetType == null) {
      return;
    }
    ;
    ri.type().methods().each((method) => {
      if (method.parent() !== ri.type()) {
        return;
      }
      ;
      let facet = method.facet(sys.ObjUtil.coerce(facetType, sys.Type.type$), false);
      if (facet != null) {
        this$.reflectMethod(lib, ri, method, sys.ObjUtil.coerce(facet, haystack.Define.type$));
      }
      ;
      return;
    });
    return;
  }

  reflectMethod(lib,ri,method,facet) {
    let loc = CLoc.make(method.qname());
    let symbol = ri.toSymbol(method);
    let csymbol = this.parseSymbol("def", symbol, loc);
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.set("def", symbol);
    let dict = this.slotToMeta(acc, symbol, ri, method, facet);
    let $def = this.addDef(loc, lib, sys.ObjUtil.coerce(csymbol, CSymbol.type$), dict);
    if ($def != null) {
      ri.onDef(method, sys.ObjUtil.coerce($def, CDef.type$));
    }
    ;
    return;
  }

  typeToMeta(acc,symbol,ri,facet) {
    let type = ri.type();
    if (type.hasFacet(sys.Deprecated.type$)) {
      acc.set("deprecated", haystack.Marker.val());
    }
    ;
    if (type.hasFacet(sys.NoDoc.type$)) {
      acc.set("nodoc", haystack.Marker.val());
    }
    ;
    if (type.doc() != null) {
      acc.set("doc", sys.ObjUtil.coerce(type.doc(), sys.Obj.type$));
    }
    ;
    this.facetToMeta(acc, facet);
    ri.addMeta(symbol, acc);
    return haystack.Etc.makeDict(acc);
  }

  slotToMeta(acc,symbol,ri,slot,facet) {
    if (slot.hasFacet(sys.Deprecated.type$)) {
      acc.set("deprecated", haystack.Marker.val());
    }
    ;
    if (slot.hasFacet(sys.NoDoc.type$)) {
      acc.set("nodoc", haystack.Marker.val());
    }
    ;
    if (slot.doc() != null) {
      acc.set("doc", sys.ObjUtil.coerce(slot.doc(), sys.Obj.type$));
    }
    ;
    this.facetToMeta(acc, facet);
    ri.addMeta(symbol, acc);
    return haystack.Etc.makeDict(acc);
  }

  facetToMeta(acc,facet) {
    const this$ = this;
    facet.decode((n,v) => {
      if (acc.get(n) == null) {
        acc.set(n, v);
      }
      ;
      return;
    });
    return;
  }

  typeToDef(type) {
    if (type === sys.Int.type$) {
      return this.#intSymbol;
    }
    ;
    if (sys.ObjUtil.equals(type, sys.Duration.type$)) {
      return this.#durationSymbol;
    }
    ;
    return haystack.Kind.fromType(type).defSymbol();
  }

}

class Inherit extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Inherit.type$; }

  static make(c) {
    const $self = new Inherit();
    Inherit.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    return;
  }

  run() {
    const this$ = this;
    this.eachDef(($def) => {
      this$.inherit($def);
      return;
    });
    return;
  }

  inherit($def) {
    const this$ = this;
    if ($def.isInherited()) {
      return;
    }
    ;
    $def.inheritance().each((base) => {
      if (sys.ObjUtil.equals(base, $def)) {
        return;
      }
      ;
      this$.inherit(base);
      base.meta().each((pair) => {
        if (!pair.isInherited()) {
          return;
        }
        ;
        let cur = $def.meta().get(pair.name());
        if (cur == null) {
          $def.meta().set(pair.name(), pair);
          return;
        }
        ;
        if (cur.isAccumulate()) {
          $def.meta().set(pair.name(), cur.accumulate(pair));
        }
        ;
        return;
      });
      return;
    });
    return;
  }

}

class GenProtos extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
    this.#acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::CProto"));
    this.#reflects = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Reflection"));
    return;
  }

  typeof() { return GenProtos.type$; }

  #acc = null;

  // private field reflection only
  __acc(it) { if (it === undefined) return this.#acc; else this.#acc = it; }

  #reflects = null;

  // private field reflection only
  __reflects(it) { if (it === undefined) return this.#reflects; else this.#reflects = it; }

  #entities = null;

  // private field reflection only
  __entities(it) { if (it === undefined) return this.#entities; else this.#entities = it; }

  static make(c) {
    const $self = new GenProtos();
    GenProtos.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    ;
    return;
  }

  run() {
    const this$ = this;
    if (!this.compiler().genProtos()) {
      return;
    }
    ;
    this.#entities = this.index().subtypes(this.index().etc().entity());
    this.eachDef(($def) => {
      this$.processDef($def);
      return;
    });
    this.#acc.each((proto) => {
      if (proto.loc() != null) {
        this$.validate(proto);
      }
      ;
      return;
    });
    this.compiler().index().protosRef(this.#acc.vals().sort());
    return;
  }

  processDef($def) {
    const this$ = this;
    let pair = $def.meta().get("children");
    if (pair == null) {
      return;
    }
    ;
    try {
      let dicts = sys.List.make(haystack.Dict.type$);
      sys.ObjUtil.coerce(pair.val(), sys.Type.find("sys::List")).each((item) => {
        if (sys.ObjUtil.is(item, haystack.Dict.type$)) {
          dicts.add(sys.ObjUtil.coerce(item, haystack.Dict.type$));
        }
        else {
          this$.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid children proto type: ", $def), " ["), sys.ObjUtil.typeof(item)), "]"), $def.loc());
        }
        ;
        return;
      });
      this.processDefChildren($def, dicts);
    }
    catch ($_u51) {
      $_u51 = sys.Err.make($_u51);
      if ($_u51 instanceof sys.Err) {
        let e = $_u51;
        ;
        this.err(sys.Str.plus("Cannot process children: ", $def), $def.loc(), e);
      }
      else {
        throw $_u51;
      }
    }
    ;
    return;
  }

  processDefChildren($def,dicts) {
    if ($def.children() != null) {
      throw sys.Err.make();
    }
    ;
    let parent = this.defToProto($def);
    $def.children(this.computeChildren(parent, dicts, $def.loc()));
    return;
  }

  defToProto($def) {
    const this$ = this;
    let usage = ((this$) => { let $_u52 = this$.index().implements($def); if ($_u52 != null) return $_u52; return sys.List.make(CDef.type$, [$def]); })(this);
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    usage.each((x) => {
      acc.set(x.name(), haystack.Marker.val());
      return;
    });
    return haystack.Etc.makeDict(acc);
  }

  computeChildren(parent,list,loc) {
    const this$ = this;
    let acc = sys.List.make(CProto.type$);
    list.each((item) => {
      let dict = sys.ObjUtil.as(item, haystack.Dict.type$);
      if (dict == null) {
        return;
      }
      ;
      let cproto = this$.addProto(this$.index().ns().proto(parent, sys.ObjUtil.coerce(dict, haystack.Dict.type$)), loc);
      acc.add(cproto);
      return;
    });
    return acc;
  }

  addProto(dict,loc) {
    const this$ = this;
    let hashKey = CProto.toHashKey(dict);
    let dup = this.#acc.get(hashKey);
    if (dup != null) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(dup.setLoc(loc), CProto.type$.toNullable()), CProto.type$);
    }
    ;
    let reflect = this.index().ns().reflect(dict);
    let implements$ = this.index().nsMap(reflect.defs());
    let proto = CProto.make(hashKey, dict, implements$).setLoc(loc);
    this.#acc.add(hashKey, proto);
    this.#reflects.add(hashKey, reflect);
    let children = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::CProto")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:defc::CProto]"));
    implements$.each(($def) => {
      let pair = $def.meta().get("children");
      if (pair == null) {
        return;
      }
      ;
      this$.computeChildren(dict, sys.ObjUtil.coerce(pair.val(), sys.Type.find("sys::Obj?[]")), null).each((x) => {
        children.set(x.hashKey(), x);
        return;
      });
      return;
    });
    proto.children(children.vals());
    return proto;
  }

  validate(proto) {
    const this$ = this;
    let loc = proto.loc();
    if (loc == null) {
      return;
    }
    ;
    let reflect = this.#reflects.getChecked(proto.hashKey());
    let entity = this.#entities.find((e) => {
      return proto.dict().has(e.name());
    });
    if (entity == null) {
      this.err(sys.Str.plus("Missing entity base tag: ", proto), sys.ObjUtil.coerce(loc, CLoc.type$));
    }
    ;
    proto.dict().each((v,n) => {
      if (reflect.def(n, false) == null) {
        this$.err(sys.Str.plus(sys.Str.plus("Invalid proto tag '", n), "'"), sys.ObjUtil.coerce(loc, CLoc.type$));
      }
      ;
      return;
    });
    return;
  }

}

class GenDist extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GenDist.type$; }

  static make(c) {
    const $self = new GenDist();
    GenDist.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    return;
  }

  run() {
    let version = sys.Pod.find("ph").version().toStr();
    let file = this.compiler().outDir().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("haystack-defs-", version), ".zip")));
    let zip = sys.Zip.write(file.out());
    this.writeDocs(zip);
    this.writeSrc(zip);
    zip.close();
    this.info(sys.Str.plus(sys.Str.plus("Dist [", file), "]"));
    return;
  }

  writeDocs(zip) {
    const this$ = this;
    this.compiler().outDir().list().each((file) => {
      if (sys.ObjUtil.equals(file.ext(), "zip")) {
        return;
      }
      ;
      let dir = "doc";
      if ((sys.ObjUtil.equals(file.basename(), "defs") || sys.ObjUtil.equals(file.basename(), "protos"))) {
        (dir = file.basename());
      }
      ;
      this$.addToZip(zip, dir, file);
      return;
    });
    return;
  }

  writeSrc(zip) {
    const this$ = this;
    let srcDir = this.findSrcDir();
    srcDir.list().each((file) => {
      this$.addToZip(zip, "src", file);
      return;
    });
    return;
  }

  findSrcDir() {
    const this$ = this;
    let envDir = sys.ObjUtil.coerce(sys.Env.cur(), util.PathEnv.type$).path().find((dir) => {
      return dir.plus(sys.Uri.fromStr("src/ph/")).exists();
    });
    return envDir.plus(sys.Uri.fromStr("src/"));
  }

  addToZip(zip,path,file) {
    const this$ = this;
    let uri = sys.Str.plus(sys.Str.plus(sys.Str.plus("", path), "/"), file.name());
    if (file.isDir()) {
      this.info(sys.Str.plus(sys.Str.plus("  Zipping [", uri), "]"));
      file.list().each((kid) => {
        this$.addToZip(zip, uri, kid);
        return;
      });
    }
    else {
      let o = zip.writeNext(sys.Str.toUri(uri), sys.ObjUtil.coerce(file.modified(), sys.DateTime.type$));
      file.in().pipe(o);
      o.close();
    }
    ;
    return;
  }

}

class Resolve extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Resolve.type$; }

  static make(c) {
    const $self = new Resolve();
    Resolve.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    return;
  }

  run() {
    const this$ = this;
    this.eachLib((lib) => {
      this$.resolveLib(lib);
      return;
    });
    return;
  }

  resolveLib(lib) {
    const this$ = this;
    let includes = this.resolveDepends(lib);
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::CDef"));
    includes.each((include) => {
      this$.resolveScope(lib, acc, include);
      return;
    });
    this.resolveScope(lib, acc, lib);
    let scope = ResolveScope.make(lib, acc);
    lib.defs().each(($def) => {
      this$.resolveDef(scope, $def);
      return;
    });
    lib.defXs().each((defx) => {
      this$.resolveDefX(scope, defx);
      return;
    });
    lib.scope(scope);
    return;
  }

  resolveDepends(lib) {
    const this$ = this;
    let acc = sys.List.make(CLib.type$);
    lib.depends().each((symbol) => {
      let depend = this$.compiler().libs().get(symbol);
      if (depend == null) {
        this$.err(sys.Str.plus("Depend not found: ", symbol), lib.loc());
      }
      else {
        acc.add(sys.ObjUtil.coerce(depend, CLib.type$));
      }
      ;
      return;
    });
    return acc;
  }

  resolveScope(lib,scope,include) {
    const this$ = this;
    include.defs().each(($def) => {
      let symbol = $def.symbol().toStr();
      let dup = scope.get(symbol);
      if (dup != null) {
        this$.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Duplicate symbols in lib scope: ", symbol), " ["), dup.lib().name()), ", "), include.name()), "]"), lib.loc());
      }
      ;
      scope.set(symbol, $def);
      return;
    });
    return;
  }

  resolveDef(scope,$def) {
    this.resolveSymbolParts(scope, $def);
    $def.meta(this.resolveDeclaredToMeta(scope, $def.declared(), $def.loc()));
    return;
  }

  resolveDefX(scope,defx) {
    defx.meta(this.resolveDeclaredToMeta(scope, defx.declared(), defx.loc()));
    return;
  }

  resolveSymbolParts(scope,$def) {
    let $_u53 = $def.symbol().type();
    if (sys.ObjUtil.equals($_u53, haystack.SymbolType.tag())) {
      return;
    }
    else if (sys.ObjUtil.equals($_u53, haystack.SymbolType.key())) {
      this.resolveKeyParts(scope, $def);
    }
    else if (sys.ObjUtil.equals($_u53, haystack.SymbolType.conjunct())) {
      this.resolveConjunctParts(scope, $def);
    }
    ;
    if ($def.parts() == null) {
      $def.fault(true);
    }
    ;
    return;
  }

  resolveKeyParts(scope,$def) {
    let featureSymbol = $def.symbol().parts().first();
    let feature = scope.get(sys.ObjUtil.coerce(featureSymbol, CSymbol.type$));
    if (feature == null) {
      return this.err(sys.Str.plus("Unresolved feature key part: ", featureSymbol), $def.loc());
    }
    ;
    $def.parts(CKeyParts.make($def, sys.ObjUtil.coerce(feature, CDef.type$)));
    return;
  }

  resolveConjunctParts(scope,$def) {
    const this$ = this;
    let tags = sys.List.make(CDef.type$);
    tags.capacity($def.symbol().parts().size());
    $def.symbol().parts().each((tagSymbol) => {
      let tag = scope.get(tagSymbol);
      if (tag == null) {
        return this$.err(sys.Str.plus("Unresolved conjunct part: ", tagSymbol), $def.loc());
      }
      ;
      tags.add(sys.ObjUtil.coerce(tag, CDef.type$));
      return;
    });
    $def.parts(CConjunctParts.make($def, tags));
    return;
  }

  resolveDeclaredToMeta(scope,declared,loc) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::CPair"));
    declared.each((v,n) => {
      let tag = this$.resolveTag(scope, n, loc);
      let val = ((this$) => { let $_u54 = this$.resolveVal(scope, n, v, loc); if ($_u54 != null) return $_u54; return v; })(this$);
      acc.set(n, CPair.make(n, tag, sys.ObjUtil.coerce(val, sys.Obj.type$)));
      return;
    });
    return acc;
  }

  resolveTag(scope,name,loc) {
    try {
      let symbol = this.compiler().symbols().parse(name);
      let $def = scope.get(symbol);
      if ($def != null) {
        return $def;
      }
      ;
      if (this.reportUnresolvedTag(name)) {
        this.err(sys.Str.plus("Unresolved tag symbol: ", name), loc);
      }
      ;
      return null;
    }
    catch ($_u55) {
      $_u55 = sys.Err.make($_u55);
      if ($_u55 instanceof sys.Err) {
        let e = $_u55;
        ;
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid tag ", name), ": "), e.msg()), loc);
        return null;
      }
      else {
        throw $_u55;
      }
    }
    ;
  }

  reportUnresolvedTag(name) {
    if (sys.Str.contains(name, "_")) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(name, "icon")) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(name, "sysMod")) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(name, "defVal")) {
      return false;
    }
    ;
    return true;
  }

  resolveVal(scope,name,val,loc) {
    if (val == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.equals(name, "is")) {
      return this.resolveIsVal(scope, sys.ObjUtil.coerce(val, sys.Obj.type$), loc);
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return this.resolveListVal(scope, name, sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")), loc);
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Symbol.type$)) {
      return this.resolveSymbolVal(scope, name, sys.ObjUtil.coerce(val, haystack.Symbol.type$), loc);
    }
    ;
    return val;
  }

  resolveListVal(scope,name,list,loc) {
    const this$ = this;
    if (sys.ObjUtil.equals(name, "depends")) {
      return list;
    }
    ;
    let acc = sys.List.make(sys.Obj.type$.toNullable());
    acc.capacity(list.size());
    list.each((v) => {
      (v = this$.resolveVal(scope, name, v, loc));
      if (v != null) {
        acc.add(v);
      }
      ;
      return;
    });
    return acc;
  }

  resolveIsVal(scope,val,loc) {
    const this$ = this;
    let list = sys.ObjUtil.coerce(((this$) => { let $_u56 = sys.ObjUtil.as(val, sys.Type.find("sys::List")); if ($_u56 != null) return $_u56; return sys.List.make(sys.Obj.type$, [val]); })(this), sys.Type.find("sys::List"));
    let acc = sys.List.make(CDef.type$);
    acc.capacity(list.size());
    list.each((item) => {
      if (!sys.ObjUtil.is(item, haystack.Symbol.type$)) {
        return this$.err(sys.Str.plus("Expecting symbol for 'is' tag: ", item), loc);
      }
      ;
      let $def = this$.resolveSymbolVal(scope, "is", sys.ObjUtil.coerce(item, haystack.Symbol.type$), loc);
      if ($def != null) {
        acc.add(sys.ObjUtil.coerce($def, CDef.type$));
      }
      ;
      return;
    });
    return acc;
  }

  resolveSymbolVal(scope,name,val,loc) {
    try {
      let symbol = this.compiler().symbols().parse(val.toStr());
      let $def = scope.get(symbol);
      if ($def != null) {
        return $def;
      }
      ;
      this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unresolved symbol ", name), "="), symbol), loc);
      return null;
    }
    catch ($_u57) {
      $_u57 = sys.Err.make($_u57);
      if ($_u57 instanceof sys.Err) {
        let e = $_u57;
        ;
        this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid symbol ", name), "="), val), ": "), e.msg()), loc);
        return null;
      }
      else {
        throw $_u57;
      }
    }
    ;
  }

}

class ResolveScope extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#refTerms = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::CDef[]"));
    return;
  }

  typeof() { return ResolveScope.type$; }

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

  #map = null;

  map(it) {
    if (it === undefined) {
      return this.#map;
    }
    else {
      this.#map = it;
      return;
    }
  }

  #refTerms = null;

  refTerms(it) {
    if (it === undefined) {
      return this.#refTerms;
    }
    else {
      this.#refTerms = it;
      return;
    }
  }

  static make(lib,map) {
    const $self = new ResolveScope();
    ResolveScope.make$($self,lib,map);
    return $self;
  }

  static make$($self,lib,map) {
    ;
    $self.#lib = lib;
    $self.#map = map;
    return;
  }

  get(symbol) {
    return this.#map.get(symbol.toStr());
  }

}

class Index extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Index.type$; }

  static make(c) {
    const $self = new Index();
    Index.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    return;
  }

  run() {
    const this$ = this;
    let libs = this.compiler().libs().vals().sort();
    let defs = sys.List.make(CDef.type$);
    let defsMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::CDef"));
    this.eachLib((lib) => {
      lib.defs(lib.defs().findAll(($def) => {
        return !$def.fault();
      }));
      lib.defs().each(($def) => {
        let symbol = $def.symbol();
        let dup = defsMap.get(symbol.toStr());
        if (dup != null) {
          this$.err2(sys.Str.plus("Duplicate symbol: ", symbol), dup.loc(), $def.loc());
          return;
        }
        ;
        defsMap.set(symbol.toStr(), $def);
        defs.add($def);
        return;
      });
      return;
    });
    defs.sort();
    this.compiler().index(CIndex.make((it) => {
      it.libs(libs);
      it.defs(defs);
      it.defsMap(defsMap);
      return;
    }));
    return;
  }

}

class GenDocEnv extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
    this.#spacesMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("compilerDoc::DocSpace"));
    this.#defsMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::DocDef"));
    return;
  }

  typeof() { return GenDocEnv.type$; }

  #spacesMap = null;

  // private field reflection only
  __spacesMap(it) { if (it === undefined) return this.#spacesMap; else this.#spacesMap = it; }

  #defsMap = null;

  // private field reflection only
  __defsMap(it) { if (it === undefined) return this.#defsMap; else this.#defsMap = it; }

  static make(c) {
    const $self = new GenDocEnv();
    GenDocEnv.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    ;
    return;
  }

  run() {
    const this$ = this;
    this.compiler().index().libs().each((lib) => {
      if (this$.includeLib(lib)) {
        this$.addSpace(this$.genLib(lib));
      }
      ;
      return;
    });
    this.addSpace(this.genProtos());
    this.addSpace(this.genAppendix());
    this.compiler().manuals().each((manual) => {
      this$.addSpace(manual);
      return;
    });
    let init = DefDocEnvInit.make((it) => {
      it.ns(this$.ns());
      it.spacesMap(this$.#spacesMap);
      it.defsMap(this$.#defsMap);
      return;
    });
    let factory = ((this$) => { let $_u58 = this$.compiler().docEnvFactory(); if ($_u58 != null) return $_u58; return (x) => {
      return DefDocEnv.make(x);
    }; })(this);
    this.compiler().docEnv(sys.Func.call(factory, init));
    return;
  }

  genLib(lib) {
    const this$ = this;
    return DocLib.make((it) => {
      it.__name(lib.name());
      it.__def(sys.ObjUtil.coerce(lib.actual(sys.ObjUtil.coerce(this$.compiler().ns(), haystack.Namespace.type$)), haystack.Lib.type$));
      it.__index(DocLibIndex.make(it));
      it.__defs(sys.ObjUtil.coerce(((this$) => { let $_u59 = this$.genDefs(it, lib.defs().vals()).sort(); if ($_u59 == null) return null; return sys.ObjUtil.toImmutable(this$.genDefs(it, lib.defs().vals()).sort()); })(this$), sys.Type.find("defc::DocDef[]")));
      it.__docFull(CFandoc.make(lib.loc(), sys.ObjUtil.coerce(((this$) => { let $_u60 = sys.ObjUtil.as(it.def().get("doc"), sys.Str.type$); if ($_u60 != null) return $_u60; return ""; })(this$), sys.Str.type$)));
      it.__docSummary(it.docFull().toSummary());
      return;
    });
  }

  genDefs(lib,defs) {
    const this$ = this;
    (defs = defs.findAll(($def) => {
      return this$.includeDef($def);
    }));
    return sys.ObjUtil.coerce(defs.map(($def) => {
      return sys.ObjUtil.coerce(((this$) => { let $_u61 = this$.addDefDoc(this$.genDef(lib, $def)); $def.doc($_u61); return $_u61; })(this$), DocDef.type$);
    }, DocDef.type$), sys.Type.find("defc::DocDef[]"));
  }

  genDef(lib,$def) {
    return DocDef.make(lib, $def.loc(), $def.actual(sys.ObjUtil.coerce(this.compiler().ns(), haystack.Namespace.type$)));
  }

  genProtos() {
    const this$ = this;
    let acc = this.index().protos().map((c) => {
      return sys.ObjUtil.coerce(((this$) => { let $_u62 = DocProto.make((it) => {
        it.__dis(c.dis());
        it.__docName(c.docName());
        it.__implements(sys.ObjUtil.coerce(((this$) => { let $_u63 = this$.mapDefs(c.implements()); if ($_u63 == null) return null; return sys.ObjUtil.toImmutable(this$.mapDefs(c.implements())); })(this$), sys.Type.find("defc::DocDef[]")));
        return;
      }); c.doc($_u62); return $_u62; })(this$), DocProto.type$);
    }, DocProto.type$);
    this.index().protos().each((c) => {
      c.doc().childrenRef().val(this$.mapProtos(c.children()));
      return;
    });
    this.index().defs().each((c) => {
      if (c.doc() != null) {
        c.doc().childrenRef().val(this$.mapProtos(c.children()));
      }
      ;
      return;
    });
    return DocProtoSpace.make(sys.ObjUtil.coerce(acc, sys.Type.find("defc::DocProto[]")));
  }

  mapDefs(list) {
    const this$ = this;
    if (list.isEmpty()) {
      return sys.ObjUtil.coerce(DocDef.type$.emptyList(), sys.Type.find("defc::DocDef[]"));
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(list.map((x) => {
      return x.doc();
    }, DocDef.type$.toNullable()).findNotNull()), sys.Type.find("sys::Obj?[]")), sys.Type.find("defc::DocDef[]"));
  }

  mapProtos(list) {
    const this$ = this;
    if ((list == null || list.isEmpty())) {
      return sys.ObjUtil.coerce(DocProto.type$.emptyList(), sys.Type.find("defc::DocProto[]"));
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(list.map((x) => {
      return sys.ObjUtil.coerce(x.doc(), DocProto.type$);
    }, DocProto.type$)), sys.Type.find("sys::Obj?[]")), sys.Type.find("defc::DocProto[]"));
  }

  genAppendix() {
    const this$ = this;
    let acc = sys.List.make(DocAppendix.type$);
    acc.add(DocAppendixIndex.make());
    acc.add(DocTagAppendix.make());
    acc.add(DocConjunctAppendix.make());
    acc.add(DocLibAppendix.make());
    this.compiler().ns().features().each((f) => {
      if (sys.ObjUtil.equals(f.name(), "lib")) {
        return;
      }
      ;
      let doc = this$.#defsMap.get(f.name());
      if (doc != null) {
        acc.add(DocFeatureAppendix.make(sys.ObjUtil.coerce(doc, DocDef.type$)));
      }
      ;
      return;
    });
    this.#defsMap.each(($def) => {
      if ($def.has("docTaxonomy")) {
        acc.add(DocTaxonomyAppendix.make($def));
      }
      ;
      return;
    });
    return DocAppendixSpace.make(acc);
  }

  includeLib(lib) {
    return sys.Func.call(this.compiler().includeInDocs(), lib);
  }

  includeDef($def) {
    return (sys.Func.call(this.compiler().includeInDocs(), $def) && !$def.isLib());
  }

  addSpace(space) {
    this.#spacesMap.add(space.spaceName(), space);
    return;
  }

  addDefDoc($def) {
    this.#defsMap.set($def.symbol().toStr(), $def);
    return $def;
  }

}

class GenDocs extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
    this.#resFiles = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("defc::DocResFile"));
    return;
  }

  typeof() { return GenDocs.type$; }

  #genFullHtml = false;

  genFullHtml(it) {
    if (it === undefined) {
      return this.#genFullHtml;
    }
    else {
      this.#genFullHtml = it;
      return;
    }
  }

  #resFiles = null;

  resFiles(it) {
    if (it === undefined) {
      return this.#resFiles;
    }
    else {
      this.#resFiles = it;
      return;
    }
  }

  static make(c) {
    const $self = new GenDocs();
    GenDocs.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    ;
    return;
  }

  run() {
    const this$ = this;
    let numFiles = 0;
    let onFile = this.compiler().onDocFile();
    if (onFile != null) {
      this.info("Generating in-memory");
      this.#genFullHtml = false;
    }
    else {
      let dir = this.compiler().initOutDir();
      this.info(sys.Str.plus(sys.Str.plus("Generating docs [", dir.osPath()), "]"));
      this.#genFullHtml = true;
      (onFile = (f) => {
        ((this$) => { let $_u64 = numFiles;numFiles = sys.Int.increment(numFiles); return $_u64; })(this$);
        let local = dir.plus(f.uri());
        let out = local.out().writeBuf(f.content()).close();
        return;
      });
    }
    ;
    this.render(this.docEnv().topIndex(), sys.ObjUtil.coerce(onFile, sys.Type.find("|defc::DocFile->sys::Void|")));
    this.copy(sys.ObjUtil.coerce(sys.ObjUtil.typeof(this).pod().file(sys.Uri.fromStr("/res/css/style.css")), sys.File.type$), sys.Uri.fromStr("style.css"), sys.ObjUtil.coerce(onFile, sys.Type.find("|defc::DocFile->sys::Void|")));
    this.docEnv().spacesMap().each((space) => {
      space.eachDoc((doc) => {
        this$.render(doc, sys.ObjUtil.coerce(onFile, sys.Type.find("|defc::DocFile->sys::Void|")));
        return;
      });
      return;
    });
    this.#resFiles.each((res) => {
      this$.copyResFile(res, sys.ObjUtil.coerce(onFile, sys.Type.find("|defc::DocFile->sys::Void|")));
      return;
    });
    this.info(sys.Str.plus(sys.Str.plus("Generated docs [", sys.ObjUtil.coerce(numFiles, sys.Obj.type$.toNullable())), " files]"));
    return;
  }

  render(doc,onFile) {
    if (sys.ObjUtil.is(doc, compilerDoc.DocRes.type$)) {
      return;
    }
    ;
    let s = sys.StrBuf.make();
    if (doc.isTopIndex()) {
      s.add("index");
    }
    else {
      s.add(doc.space().spaceName()).addChar(47).add(doc.docName());
    }
    ;
    if (this.docEnv().linkUriExt() != null) {
      s.add(this.docEnv().linkUriExt());
    }
    ;
    let uri = sys.Str.toUri(s.toStr());
    let buf = sys.Buf.make(1024);
    let out = DocOutStream.make(buf.out(), this.#resFiles);
    this.docEnv().render(out, doc);
    sys.Func.call(onFile, DocFile.make(uri, doc.title(), sys.ObjUtil.coerce(buf, sys.Buf.type$)));
    return;
  }

  copyResFile(res,onFile) {
    let uri = sys.Str.toUri(sys.Str.plus(sys.Str.plus(res.spaceName(), "/"), res.docName()));
    sys.Func.call(onFile, DocFile.make(uri, uri.name(), res.file().readAllBuf()));
    return;
  }

  copy(src,uri,onFile) {
    let buf = src.readAllBuf();
    sys.Func.call(onFile, DocFile.make(uri, uri.name(), buf));
    return;
  }

}

class DocFile extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocFile.type$; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #title = null;

  title() { return this.#title; }

  __title(it) { if (it === undefined) return this.#title; else this.#title = it; }

  #content = null;

  content() { return this.#content; }

  __content(it) { if (it === undefined) return this.#content; else this.#content = it; }

  static make(uri,title,content) {
    const $self = new DocFile();
    DocFile.make$($self,uri,title,content);
    return $self;
  }

  static make$($self,uri,title,content) {
    $self.#uri = uri;
    $self.#title = title;
    $self.#content = sys.ObjUtil.coerce(((this$) => { let $_u65 = content; if ($_u65 == null) return null; return sys.ObjUtil.toImmutable(content); })($self), sys.Buf.type$);
    return;
  }

}

class DocResFile extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocResFile.type$; }

  #spaceName = null;

  spaceName() { return this.#spaceName; }

  __spaceName(it) { if (it === undefined) return this.#spaceName; else this.#spaceName = it; }

  #docName = null;

  docName() { return this.#docName; }

  __docName(it) { if (it === undefined) return this.#docName; else this.#docName = it; }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  static make(spaceName,docName,file) {
    const $self = new DocResFile();
    DocResFile.make$($self,spaceName,docName,file);
    return $self;
  }

  static make$($self,spaceName,docName,file) {
    $self.#spaceName = spaceName;
    $self.#docName = docName;
    $self.#file = file;
    $self.#qname = sys.Str.plus(sys.Str.plus(spaceName, "::"), docName);
    return;
  }

  toStr() {
    return this.#qname;
  }

}

class ApplyX extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ApplyX.type$; }

  static make(c) {
    const $self = new ApplyX();
    ApplyX.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    return;
  }

  run() {
    const this$ = this;
    this.compiler().libs().each((lib) => {
      this$.applyLib(lib);
      return;
    });
    return;
  }

  applyLib(lib) {
    const this$ = this;
    lib.defXs().each((defx) => {
      this$.applyDefX(defx);
      return;
    });
    return;
  }

  applyDefX(defx) {
    const this$ = this;
    let symbol = defx.symbol();
    let loc = defx.loc();
    let $def = this.index().def(symbol.toStr(), false);
    if ($def == null) {
      return this.err(sys.Str.plus("Unresolved symbol for defx: ", symbol), loc);
    }
    ;
    defx.meta().each((pair) => {
      let name = pair.name();
      let tag = pair.tag();
      let val = pair.val();
      if (sys.ObjUtil.equals(name, "defx")) {
        return;
      }
      ;
      let curPair = $def.meta().get(name);
      if (curPair != null) {
        if (!curPair.isAccumulate()) {
          return this$.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Tag ", sys.Str.toCode(name)), " already defined in defx: "), symbol), loc);
        }
        else {
          (pair = curPair.accumulate(pair));
        }
        ;
      }
      ;
      $def.meta().set(name, pair);
      return;
    });
    return;
  }

}

class Taxonify extends DefCompilerStep {
  constructor() {
    super();
    const this$ = this;
    this.#stack = sys.List.make(CDef.type$);
    return;
  }

  typeof() { return Taxonify.type$; }

  #stack = null;

  stack(it) {
    if (it === undefined) {
      return this.#stack;
    }
    else {
      this.#stack = it;
      return;
    }
  }

  static make(c) {
    const $self = new Taxonify();
    Taxonify.make$($self,c);
    return $self;
  }

  static make$($self,c) {
    DefCompilerStep.make$($self, c);
    ;
    return;
  }

  run() {
    const this$ = this;
    this.eachDef(($def) => {
      this$.taxonify($def);
      return;
    });
    return;
  }

  taxonify($def) {
    if ($def.inheritance() != null) {
      return;
    }
    ;
    if (this.#stack.contains($def)) {
      throw this.err(sys.Str.plus("Circular dependency: ", this.#stack.join(", ")), $def.loc());
    }
    ;
    this.#stack.push($def);
    try {
      this.impliedIs($def);
      this.computeInheritance($def);
    }
    catch ($_u66) {
      $_u66 = sys.Err.make($_u66);
      if ($_u66 instanceof CompilerErr) {
        let e = $_u66;
        ;
        $def.fault(true);
      }
      else if ($_u66 instanceof sys.Err) {
        let e = $_u66;
        ;
        this.err(sys.Str.plus("Cannot taxonify def: ", $def), $def.loc(), e);
        $def.fault(true);
      }
      else {
        throw $_u66;
      }
    }
    ;
    if ($def.fault()) {
      $def.supertypes(sys.ObjUtil.coerce(CDef.type$.emptyList(), sys.Type.find("defc::CDef[]?")));
      $def.inheritance(sys.List.make(CDef.type$, [$def]));
      $def.flags(CDefFlags.compute($def));
    }
    ;
    this.#stack.pop();
    return;
  }

  impliedIs($def) {
    if ($def.type().isKey()) {
      return this.impliedKeyIs($def);
    }
    ;
    return;
  }

  impliedKeyIs($def) {
    let feature = $def.key().feature();
    this.taxonify(feature);
    let declaredList = this.declaredIs($def);
    if (declaredList.isEmpty()) {
      $def.set(this.etc().isDef(), sys.List.make(CDef.type$, [feature]));
      return;
    }
    ;
    if (sys.ObjUtil.compareNE(declaredList.size(), 1)) {
      return this.err(sys.Str.plus("Declared 'is' must be one symbol: ", $def), $def.loc());
    }
    ;
    let declared = declaredList.first();
    this.taxonify(sys.ObjUtil.coerce(declared, CDef.type$));
    if (!declared.isFeature()) {
      this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Declared 'is' is does not fit feature ", feature), ": "), $def), $def.loc());
    }
    ;
    return;
  }

  declaredIs($def) {
    return sys.ObjUtil.coerce(((this$) => { let $_u67 = sys.ObjUtil.as(((this$) => { let $_u68=$def.meta().get("is"); return ($_u68==null) ? null : $_u68.val(); })(this$), sys.Type.find("defc::CDef[]")); if ($_u67 != null) return $_u67; return CDef.type$.emptyList(); })(this), sys.Type.find("defc::CDef[]"));
  }

  computeInheritance($def) {
    const this$ = this;
    let declared = this.declaredIs($def);
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("defc::CSymbol"), sys.Type.find("defc::CDef"));
    acc.ordered(true);
    if ($def.type().isTerm()) {
      acc.add($def.symbol(), $def);
    }
    ;
    declared.each((base) => {
      acc.add(base.symbol(), base);
      return;
    });
    this.computeInherited(acc, $def);
    $def.supertypes(declared);
    $def.inheritance(acc.vals());
    $def.flags(CDefFlags.compute($def));
    return;
  }

  computeInherited(acc,$def) {
    const this$ = this;
    if ($def.type().isKey()) {
      return;
    }
    ;
    acc.dup().each((base) => {
      if (sys.ObjUtil.equals(base, $def)) {
        return;
      }
      ;
      this$.doComputeIsInherit(acc, base);
      return;
    });
    return;
  }

  doComputeIsInherit(acc,base) {
    const this$ = this;
    this.taxonify(base);
    base.inheritance().each((x) => {
      if (acc.get(x.symbol()) == null) {
        acc.set(x.symbol(), x);
      }
      ;
      return;
    });
    return;
  }

}

class InternFactory extends haystack.HaystackFactory {
  constructor() {
    super();
    const this$ = this;
    this.#strs = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    return;
  }

  typeof() { return InternFactory.type$; }

  #strs = null;

  // private field reflection only
  __strs(it) { if (it === undefined) return this.#strs; else this.#strs = it; }

  makeId(s) {
    let x = this.#strs.get(s);
    if (x == null) {
      (x = haystack.BrioConsts.cur().intern(s));
      this.#strs.set(sys.ObjUtil.coerce(x, sys.Str.type$), sys.ObjUtil.coerce(x, sys.Str.type$));
    }
    ;
    return sys.ObjUtil.coerce(x, sys.Str.type$);
  }

  static make() {
    const $self = new InternFactory();
    InternFactory.make$($self);
    return $self;
  }

  static make$($self) {
    haystack.HaystackFactory.make$($self);
    ;
    return;
  }

}

class SymbolTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SymbolTest.type$; }

  #factory = null;

  factory(it) {
    if (it === undefined) {
      return this.#factory;
    }
    else {
      this.#factory = it;
      return;
    }
  }

  test() {
    let err = null;
    let f = CSymbolFactory.make(InternFactory.make());
    this.#factory = f;
    let foo = f.parse("foo");
    this.verifyName(foo, "foo");
    let bar = f.parse("bar");
    this.verifyName(bar, "bar");
    let fooBar = f.parse("foo-bar");
    this.verifyConjunct(fooBar, "foo-bar", sys.List.make(CSymbol.type$, [foo, bar]));
    let fooBarBaz = this.parse("foo-bar-baz");
    let baz = this.parse("baz");
    this.verifyName(baz, "baz");
    this.verifyConjunct(fooBarBaz, "foo-bar-baz", sys.List.make(CSymbol.type$, [foo, bar, baz]));
    let funcNow = this.parse("func:now");
    let func = this.parse("func");
    let now = this.parse("now");
    this.verifyName(func, "func");
    this.verifyName(now, "now");
    this.verifyKey(funcNow, "func:now", sys.List.make(CSymbol.type$, [func, now]));
    let elec = this.parse("elec");
    let meter = this.parse("meter");
    let import$ = this.parse("import");
    let elecMeter = this.parse("elec-meter");
    this.verifyName(elec, "elec");
    this.verifyName(meter, "meter");
    this.verifyName(import$, "import");
    this.verifyConjunct(elecMeter, "elec-meter", sys.List.make(CSymbol.type$, [elec, meter]));
    this.verifySymbolErr("foo ");
    this.verifySymbolErr("foo-bar:baz");
    this.verifySymbolErr("foo:bar-baz");
    this.verifySymbolErr("foo.bar.baz");
    this.verifySymbolErr("foo-bar%-baz");
    return;
  }

  verifyName(symbol,str) {
    this.verifySymbol(symbol, haystack.SymbolType.tag(), str, sys.List.make(CSymbol.type$));
    return;
  }

  verifyConjunct(symbol,str,parts) {
    this.verifySymbol(symbol, haystack.SymbolType.conjunct(), str, parts);
    return;
  }

  verifyKey(symbol,str,parts) {
    this.verifySymbol(symbol, haystack.SymbolType.key(), str, parts);
    return;
  }

  verifySymbol(symbol,type,str,parts) {
    const this$ = this;
    this.verifyEq(symbol.toStr(), str);
    this.verifySame(symbol.type(), type);
    this.verifySame(this.#factory.parse(str), symbol);
    this.verifyEq(sys.ObjUtil.coerce(symbol.parts().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(parts.size(), sys.Obj.type$.toNullable()));
    symbol.parts().each((p,i) => {
      this$.verifySame(p, parts.get(i));
      return;
    });
    return;
  }

  verifySymbolErr(s) {
    const this$ = this;
    this.verifyErr(sys.ParseErr.type$, (it) => {
      this$.#factory.parse(s);
      return;
    });
    return;
  }

  parse(s) {
    return this.#factory.parse(s);
  }

  static make() {
    const $self = new SymbolTest();
    SymbolTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

const p = sys.Pod.add$('defc');
const xp = sys.Param.noParams$();
let m;
DefCompilerStep.type$ = p.at$('DefCompilerStep','sys::Obj',[],{},8193,DefCompilerStep);
CompilerErr.type$ = p.at$('CompilerErr','sys::Err',[],{'sys::NoDoc':""},8194,CompilerErr);
UnresolvedDocLinkErr.type$ = p.at$('UnresolvedDocLinkErr','sys::Err',[],{'sys::NoDoc':""},8194,UnresolvedDocLinkErr);
DefCompiler.type$ = p.at$('DefCompiler','sys::Obj',[],{},8192,DefCompiler);
CompilerInput.type$ = p.at$('CompilerInput','sys::Obj',[],{},8195,CompilerInput);
CompilerInputType.type$ = p.at$('CompilerInputType','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,CompilerInputType);
LibInput.type$ = p.at$('LibInput','defc::CompilerInput',[],{},8195,LibInput);
ReflectInput.type$ = p.at$('ReflectInput','sys::Obj',[],{},8195,ReflectInput);
DirLibInput.type$ = p.at$('DirLibInput','defc::LibInput',[],{},130,DirLibInput);
PodLibInput.type$ = p.at$('PodLibInput','defc::LibInput',[],{},130,PodLibInput);
ManualInput.type$ = p.at$('ManualInput','defc::CompilerInput',[],{},8194,ManualInput);
Main.type$ = p.at$('Main','util::AbstractMain',[],{},8192,Main);
CSymbol.type$ = p.at$('CSymbol','sys::Obj',[],{},8194,CSymbol);
CSymbolFactory.type$ = p.at$('CSymbolFactory','sys::Obj',[],{},128,CSymbolFactory);
CDef.type$ = p.at$('CDef','sys::Obj',[],{},8192,CDef);
CDefFlags.type$ = p.at$('CDefFlags','sys::Obj',[],{},8194,CDefFlags);
CPair.type$ = p.at$('CPair','sys::Obj',[],{},8192,CPair);
CDefX.type$ = p.at$('CDefX','sys::Obj',[],{},8192,CDefX);
CProto.type$ = p.at$('CProto','sys::Obj',[],{},8192,CProto);
CUnit.type$ = p.at$('CUnit','sys::Obj',[],{},8192,CUnit);
CDefRef.type$ = p.at$('CDefRef','sys::Obj',[],{},8192,CDefRef);
CDefParts.type$ = p.at$('CDefParts','sys::Obj',[],{},8193,CDefParts);
CKeyParts.type$ = p.at$('CKeyParts','defc::CDefParts',[],{},8192,CKeyParts);
CConjunctParts.type$ = p.at$('CConjunctParts','defc::CDefParts',[],{},8192,CConjunctParts);
CFandoc.type$ = p.at$('CFandoc','compilerDoc::DocFandoc',[],{},8194,CFandoc);
CIndex.type$ = p.at$('CIndex','sys::Obj',[],{},8192,CIndex);
CIndexEtc.type$ = p.at$('CIndexEtc','sys::Obj',[],{},8192,CIndexEtc);
CLoc.type$ = p.at$('CLoc','compilerDoc::DocLoc',[],{},8194,CLoc);
CLib.type$ = p.at$('CLib','defc::CDef',[],{},8192,CLib);
DefDocEnv.type$ = p.at$('DefDocEnv','compilerDoc::DocEnv',[],{},8194,DefDocEnv);
DefDocEnvInit.type$ = p.at$('DefDocEnvInit','sys::Obj',[],{},8192,DefDocEnvInit);
DocDef.type$ = p.at$('DocDef','compilerDoc::Doc',[],{},8194,DocDef);
DefDocRenderer.type$ = p.at$('DefDocRenderer','compilerDoc::DocRenderer',[],{},8193,DefDocRenderer);
StdDocDefRenderer.type$ = p.at$('StdDocDefRenderer','defc::DefDocRenderer',[],{},8192,StdDocDefRenderer);
DocProtoSpace.type$ = p.at$('DocProtoSpace','compilerDoc::DocSpace',[],{},8194,DocProtoSpace);
DocProto.type$ = p.at$('DocProto','compilerDoc::Doc',[],{},8194,DocProto);
DocProtoRenderer.type$ = p.at$('DocProtoRenderer','defc::DefDocRenderer',[],{},8192,DocProtoRenderer);
DocProtoIndex.type$ = p.at$('DocProtoIndex','compilerDoc::Doc',[],{},8194,DocProtoIndex);
DocProtoIndexRenderer.type$ = p.at$('DocProtoIndexRenderer','defc::DefDocRenderer',[],{},8192,DocProtoIndexRenderer);
DocAppendixSpace.type$ = p.at$('DocAppendixSpace','compilerDoc::DocSpace',[],{},8194,DocAppendixSpace);
DocAppendix.type$ = p.at$('DocAppendix','compilerDoc::Doc',[],{},8195,DocAppendix);
DocAppendixIndex.type$ = p.at$('DocAppendixIndex','defc::DocAppendix',[],{},8194,DocAppendixIndex);
DocAppendixIndexRenderer.type$ = p.at$('DocAppendixIndexRenderer','defc::DefDocRenderer',[],{},8192,DocAppendixIndexRenderer);
DocTaxonomyAppendix.type$ = p.at$('DocTaxonomyAppendix','defc::DocAppendix',[],{},8194,DocTaxonomyAppendix);
DocTaxonomyAppendixRenderer.type$ = p.at$('DocTaxonomyAppendixRenderer','defc::DefDocRenderer',[],{},8192,DocTaxonomyAppendixRenderer);
DocListAppendix.type$ = p.at$('DocListAppendix','defc::DocAppendix',[],{},8195,DocListAppendix);
DocListAppendixRenderer.type$ = p.at$('DocListAppendixRenderer','defc::DefDocRenderer',[],{},8192,DocListAppendixRenderer);
DocTagAppendix.type$ = p.at$('DocTagAppendix','defc::DocListAppendix',[],{},130,DocTagAppendix);
DocConjunctAppendix.type$ = p.at$('DocConjunctAppendix','defc::DocListAppendix',[],{},130,DocConjunctAppendix);
DocLibAppendix.type$ = p.at$('DocLibAppendix','defc::DocListAppendix',[],{},130,DocLibAppendix);
DocFeatureAppendix.type$ = p.at$('DocFeatureAppendix','defc::DocListAppendix',[],{},130,DocFeatureAppendix);
DocFandocWriter.type$ = p.at$('DocFandocWriter','fandoc::HtmlDocWriter',[],{},128,DocFandocWriter);
DocOutStream.type$ = p.at$('DocOutStream','web::WebOutStream',[],{},8192,DocOutStream);
DefDocTheme.type$ = p.at$('DefDocTheme','compilerDoc::DocTheme',[],{},8194,DefDocTheme);
DefTopIndexRenderer.type$ = p.at$('DefTopIndexRenderer','defc::DefDocRenderer',[],{},8192,DefTopIndexRenderer);
DefPodIndexRenderer.type$ = p.at$('DefPodIndexRenderer','defc::DefDocRenderer',[],{},8192,DefPodIndexRenderer);
DefChapterRenderer.type$ = p.at$('DefChapterRenderer','defc::DefDocRenderer',[],{},8192,DefChapterRenderer);
DocDefTree.type$ = p.at$('DocDefTree','sys::Obj',[],{},8192,DocDefTree);
DocLib.type$ = p.at$('DocLib','compilerDoc::DocSpace',[],{},8194,DocLib);
DocLibIndex.type$ = p.at$('DocLibIndex','defc::DocDef',[],{},8194,DocLibIndex);
DocLibManual.type$ = p.at$('DocLibManual','compilerDoc::Doc',[],{},8194,DocLibManual);
DocLibIndexRenderer.type$ = p.at$('DocLibIndexRenderer','defc::DefDocRenderer',[],{},128,DocLibIndexRenderer);
DocLibManualRenderer.type$ = p.at$('DocLibManualRenderer','defc::DefDocRenderer',[],{},128,DocLibManualRenderer);
DocNavData.type$ = p.at$('DocNavData','sys::Obj',[],{},8192,DocNavData);
Validate.type$ = p.at$('Validate','defc::DefCompilerStep',[],{},128,Validate);
GenGrid.type$ = p.at$('GenGrid','defc::DefCompilerStep',[],{},129,GenGrid);
GenDefsGrid.type$ = p.at$('GenDefsGrid','defc::GenGrid',[],{},128,GenDefsGrid);
GenProtosGrid.type$ = p.at$('GenProtosGrid','defc::GenGrid',[],{},128,GenProtosGrid);
Normalize.type$ = p.at$('Normalize','defc::DefCompilerStep',[],{},128,Normalize);
Scan.type$ = p.at$('Scan','defc::DefCompilerStep',[],{},128,Scan);
GenNamespace.type$ = p.at$('GenNamespace','defc::DefCompilerStep',[],{},128,GenNamespace);
Parse.type$ = p.at$('Parse','defc::DefCompilerStep',[],{},128,Parse);
Reflect.type$ = p.at$('Reflect','defc::DefCompilerStep',[],{},128,Reflect);
Inherit.type$ = p.at$('Inherit','defc::DefCompilerStep',[],{},128,Inherit);
GenProtos.type$ = p.at$('GenProtos','defc::DefCompilerStep',[],{},128,GenProtos);
GenDist.type$ = p.at$('GenDist','defc::DefCompilerStep',[],{},128,GenDist);
Resolve.type$ = p.at$('Resolve','defc::DefCompilerStep',[],{},128,Resolve);
ResolveScope.type$ = p.at$('ResolveScope','sys::Obj',[],{},128,ResolveScope);
Index.type$ = p.at$('Index','defc::DefCompilerStep',[],{},128,Index);
GenDocEnv.type$ = p.at$('GenDocEnv','defc::DefCompilerStep',[],{},128,GenDocEnv);
GenDocs.type$ = p.at$('GenDocs','defc::DefCompilerStep',[],{},128,GenDocs);
DocFile.type$ = p.at$('DocFile','sys::Obj',[],{},8194,DocFile);
DocResFile.type$ = p.at$('DocResFile','sys::Obj',[],{},8194,DocResFile);
ApplyX.type$ = p.at$('ApplyX','defc::DefCompilerStep',[],{},128,ApplyX);
Taxonify.type$ = p.at$('Taxonify','defc::DefCompilerStep',[],{},128,Taxonify);
InternFactory.type$ = p.at$('InternFactory','haystack::HaystackFactory',[],{},128,InternFactory);
SymbolTest.type$ = p.at$('SymbolTest','sys::Test',[],{},8192,SymbolTest);
DefCompilerStep.type$.af$('compiler',73728,'defc::DefCompiler',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('compiler','defc::DefCompiler',false)]),{}).am$('run',270337,'sys::Void',xp,{}).am$('index',8192,'defc::CIndex',xp,{}).am$('etc',8192,'defc::CIndexEtc',xp,{}).am$('ns',8192,'haystack::Namespace',xp,{}).am$('docEnv',8192,'defc::DefDocEnv',xp,{}).am$('eachLib',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|defc::CLib->sys::Void|',false)]),{}).am$('eachDef',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|defc::CDef->sys::Void|',false)]),{}).am$('parseSymbol',8192,'defc::CSymbol?',sys.List.make(sys.Param.type$,[new sys.Param('tagName','sys::Str',false),new sys.Param('val','sys::Obj?',false),new sys.Param('loc','defc::CLoc',false)]),{}).am$('addDef',8192,'defc::CDef?',sys.List.make(sys.Param.type$,[new sys.Param('loc','defc::CLoc',false),new sys.Param('lib','defc::CLib',false),new sys.Param('symbol','defc::CSymbol',false),new sys.Param('dict','haystack::Dict',false)]),{}).am$('info',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('err',8192,'defc::CompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','defc::CLoc',false),new sys.Param('err','sys::Err?',true)]),{}).am$('err2',8192,'defc::CompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc1','defc::CLoc',false),new sys.Param('loc2','defc::CLoc',false),new sys.Param('err','sys::Err?',true)]),{});
CompilerErr.type$.af$('loc',73730,'defc::CLoc',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','defc::CLoc',false),new sys.Param('cause','sys::Err?',false)]),{});
UnresolvedDocLinkErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('link','sys::Str',false)]),{});
DefCompiler.type$.af$('log',73728,'sys::Log',{}).af$('outDir',73728,'sys::File?',{}).af$('onDocFile',73728,'|defc::DocFile->sys::Void|?',{}).af$('includeInDocs',73728,'|defc::CDef->sys::Bool|',{}).af$('inputs',73728,'defc::CompilerInput[]',{}).af$('factory',73728,'def::DefFactory',{}).af$('docEnvFactory',73728,'|defc::DefDocEnvInit->defc::DefDocEnv|?',{}).af$('includeSpecs',73728,'sys::Bool',{}).af$('intern',65664,'defc::InternFactory',{}).af$('errs',65664,'defc::CompilerErr[]',{}).af$('genDocEnv',65664,'sys::Bool',{}).af$('genProtos',65664,'sys::Bool',{}).af$('symbols',65664,'defc::CSymbolFactory',{}).af$('libs',65664,'[defc::CSymbol:defc::CLib]',{}).af$('manuals',65664,'[sys::Str:compilerDoc::DocPod]',{}).af$('index',65664,'defc::CIndex?',{}).af$('ns',73728,'haystack::Namespace?',{}).af$('docEnv',73728,'defc::DefDocEnv?',{}).af$('defsGrid',65664,'haystack::Grid?',{}).af$('protosGrid',65664,'haystack::Grid?',{}).af$('initOutDir$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',xp,{}).am$('compileIndex',8192,'defc::CIndex',xp,{}).am$('compileNamespace',8192,'haystack::Namespace',xp,{}).am$('compileDocEnv',8192,'defc::DefDocEnv',xp,{}).am$('compileDocs',8192,'sys::This',xp,{}).am$('compileMain',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('formats','sys::Str[]',false),new sys.Param('protos','sys::Bool',false)]),{}).am$('compileAll',8192,'sys::This',xp,{}).am$('compileDist',8192,'sys::This',xp,{}).am$('frontend',270336,'defc::DefCompilerStep[]',xp,{}).am$('backendAll',2048,'defc::DefCompilerStep[]',xp,{}).am$('runBackend',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('backend','defc::DefCompilerStep[]',false)]),{}).am$('run',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('steps','defc::DefCompilerStep[]',false)]),{}).am$('stats',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('dur','sys::Duration',false)]),{}).am$('info',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('warn',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','defc::CLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('err',8192,'defc::CompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','defc::CLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('err2',8192,'defc::CompilerErr',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc1','defc::CLoc',false),new sys.Param('loc2','defc::CLoc',false),new sys.Param('cause','sys::Err?',true)]),{}).am$('initOutDir',532480,'sys::File',xp,{}).am$('undefine',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Dict',false)]),{}).am$('initOutDir$Once',133120,'sys::File',xp,{});
CompilerInput.type$.am$('makeDefaults',40962,'defc::CompilerInput[]',xp,{'sys::NoDoc':""}).am$('makePodName',40966,'defc::CompilerInput?',sys.List.make(sys.Param.type$,[new sys.Param('podName','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('makePod',40966,'defc::CompilerInput?',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Pod',false)]),{}).am$('makeDir',40966,'defc::CompilerInput?',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false)]),{}).am$('scanDir',40962,'defc::CompilerInput[]',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false)]),{}).am$('doScanDir',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','defc::CompilerInput[]',false),new sys.Param('dir','sys::File',false)]),{}).am$('inputType',270337,'defc::CompilerInputType',xp,{}).am$('parseLibMetaFile',40962,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false),new sys.Param('file','sys::File',false)]),{}).am$('parseEachDict',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler?',false),new sys.Param('file','sys::File',false),new sys.Param('f','|haystack::Dict,defc::CLoc->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CompilerInputType.type$.af$('lib',106506,'defc::CompilerInputType',{}).af$('manual',106506,'defc::CompilerInputType',{}).af$('vals',106498,'defc::CompilerInputType[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'defc::CompilerInputType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
LibInput.type$.am$('inputType',271360,'defc::CompilerInputType',xp,{}).am$('loc',270337,'defc::CLoc',xp,{}).am$('scanMeta',270337,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('scanFiles',270336,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('scanReflects',270336,'defc::ReflectInput[]',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('scanExtra',270336,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('adapt',270336,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false),new sys.Param('dict','haystack::Dict',false),new sys.Param('loc','defc::CLoc',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ReflectInput.type$.am$('type',270337,'sys::Type',xp,{}).am$('typeFacet',270336,'sys::Type?',xp,{}).am$('fieldFacet',270336,'sys::Type?',xp,{}).am$('methodFacet',270336,'sys::Type?',xp,{}).am$('toSymbol',270337,'haystack::Symbol',sys.List.make(sys.Param.type$,[new sys.Param('slot','sys::Slot?',false)]),{}).am$('addMeta',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('symbol','haystack::Symbol',false),new sys.Param('acc','[sys::Str:sys::Obj]',false)]),{}).am$('onDef',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','sys::Slot?',false),new sys.Param('def','defc::CDef',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DirLibInput.type$.af$('dir',73730,'sys::File',{}).af$('loc',336898,'defc::CLoc',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('scanMeta',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('tryVersionFromEtc',2048,'sys::Str',xp,{}).am$('scanFiles',271360,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{});
PodLibInput.type$.af$('pod',73730,'sys::Pod',{}).af$('loc',336898,'defc::CLoc',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','sys::Pod',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('scanMeta',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('scanFiles',271360,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{});
ManualInput.type$.af$('pod',73730,'sys::Pod',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('p','sys::Pod',false)]),{}).am$('inputType',271360,'defc::CompilerInputType',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
Main.type$.af$('version',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Print version info\";aliases=[\"v\"];}"}).af$('outDir',73728,'sys::File',{'util::Opt':"util::Opt{help=\"Output directory\";}"}).af$('output',73728,'sys::Str',{'util::Opt':"util::Opt{help=\"Comma separated outputs: html, csv, zinc, trio, json, turtle, dist\";}"}).af$('protos',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Generate protos output file in addition to defs file\";}"}).af$('specs',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Include data spec libs\";}"}).af$('inputs',73728,'sys::Str[]?',{'util::Arg':"util::Arg{help=\"List of input pod names or directories (defaults to ph pods)\";}"}).am$('run',271360,'sys::Int',xp,{}).am$('usage',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('printVersion',2048,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CSymbol.type$.af$('val',73730,'haystack::Symbol',{}).af$('parts',73730,'defc::CSymbol[]',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Symbol',false),new sys.Param('parts','defc::CSymbol[]',false)]),{}).am$('type',8192,'haystack::SymbolType',xp,{}).am$('name',8192,'sys::Str',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
CSymbolFactory.type$.af$('intern',67584,'defc::InternFactory',{}).af$('cache',67584,'[sys::Str:defc::CSymbol]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('intern','defc::InternFactory',false)]),{}).am$('parse',8192,'defc::CSymbol',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('norm',8192,'defc::CSymbol',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Symbol',false)]),{}).am$('doNorm',2048,'defc::CSymbol',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Symbol',false)]),{}).am$('parseKey',2048,'defc::CSymbol',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Symbol',false)]),{}).am$('parseTerm',2048,'defc::CSymbol',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{}).am$('parseConjunct',2048,'defc::CSymbol',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Symbol',false)]),{}).am$('parseName',2048,'defc::CSymbol',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{});
CDef.type$.af$('loc',73730,'defc::CLoc',{}).af$('lib',73728,'defc::CLib',{}).af$('symbol',73730,'defc::CSymbol',{}).af$('parts',73728,'defc::CDefParts?',{}).af$('fault',73728,'sys::Bool',{}).af$('aux',73728,'sys::Obj?',{}).af$('declared',73730,'haystack::Dict',{}).af$('meta',73728,'[sys::Str:defc::CPair]?',{}).af$('supertypes',73728,'defc::CDef[]?',{}).af$('inheritance',73728,'defc::CDef[]?',{}).af$('flags',73728,'sys::Int',{}).af$('fandoc',73728,'defc::CFandoc',{}).af$('children',73728,'defc::CProto[]?',{}).af$('isInherited',65664,'sys::Bool',{}).af$('actualRef',65664,'haystack::Def?',{}).af$('doc',73728,'defc::DocDef?',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','defc::CLoc',false),new sys.Param('lib','defc::CLib',false),new sys.Param('symbol','defc::CSymbol',false),new sys.Param('declared','haystack::Dict',false)]),{}).am$('makeLib',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','defc::CLoc',false),new sys.Param('symbol','defc::CSymbol',false),new sys.Param('declared','haystack::Dict',false)]),{}).am$('isLib',8192,'sys::Bool',xp,{}).am$('name',8192,'sys::Str',xp,{}).am$('type',8192,'haystack::SymbolType',xp,{}).am$('isKey',8192,'sys::Bool',xp,{}).am$('key',8192,'defc::CKeyParts',xp,{}).am$('conjunct',8192,'defc::CConjunctParts',xp,{}).am$('has',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('get',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('set',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tag','defc::CDef',false),new sys.Param('val','sys::Obj',false)]),{}).am$('isAssociation',8192,'sys::Bool',xp,{}).am$('isChoice',8192,'sys::Bool',xp,{}).am$('isEntity',8192,'sys::Bool',xp,{}).am$('isFeature',8192,'sys::Bool',xp,{}).am$('isList',8192,'sys::Bool',xp,{}).am$('isMarker',8192,'sys::Bool',xp,{}).am$('isRef',8192,'sys::Bool',xp,{}).am$('isRelationship',8192,'sys::Bool',xp,{}).am$('isVal',8192,'sys::Bool',xp,{}).am$('fits',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','defc::CDef',false)]),{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('dis',270336,'sys::Str',xp,{}).am$('isNoDoc',8192,'sys::Bool',xp,{}).am$('actual',8192,'haystack::Def',sys.List.make(sys.Param.type$,[new sys.Param('ns','haystack::Namespace',false)]),{});
CDefFlags.type$.af$('association',98434,'sys::Int',{}).af$('choice',98434,'sys::Int',{}).af$('entity',98434,'sys::Int',{}).af$('feature',98434,'sys::Int',{}).af$('list',98434,'sys::Int',{}).af$('marker',98434,'sys::Int',{}).af$('ref',98434,'sys::Int',{}).af$('relationship',98434,'sys::Int',{}).af$('val',98434,'sys::Int',{}).am$('compute',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('flagsToStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
CPair.type$.af$('name',73730,'sys::Str',{}).af$('val',73728,'sys::Obj',{}).af$('tag',73728,'defc::CDef?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('tag','defc::CDef?',false),new sys.Param('val','sys::Obj',false)]),{}).am$('isInherited',8192,'sys::Bool',xp,{}).am$('isAccumulate',8192,'sys::Bool',xp,{}).am$('accumulate',8192,'defc::CPair',sys.List.make(sys.Param.type$,[new sys.Param('that','defc::CPair',false)]),{}).am$('tagOrName',8192,'sys::Obj',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
CDefX.type$.af$('loc',73730,'defc::CLoc',{}).af$('lib',73728,'defc::CLib',{}).af$('symbol',73730,'defc::CSymbol',{}).af$('declared',73730,'haystack::Dict',{}).af$('meta',73728,'[sys::Str:defc::CPair]?',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','defc::CLoc',false),new sys.Param('lib','defc::CLib',false),new sys.Param('symbol','defc::CSymbol',false),new sys.Param('declared','haystack::Dict',false)]),{});
CProto.type$.af$('dict',73730,'haystack::Dict',{}).af$('hashKey',73730,'sys::Str',{}).af$('dis',73730,'sys::Str',{}).af$('loc',73728,'defc::CLoc?',{}).af$('implements',73728,'defc::CDef[]',{}).af$('children',73728,'defc::CProto[]?',{}).af$('docName',73730,'sys::Str',{}).af$('doc',73728,'defc::DocProto?',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('hashKey','sys::Str',false),new sys.Param('dict','haystack::Dict',false),new sys.Param('implements','defc::CDef[]',false)]),{}).am$('toHashKey',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Dict',false)]),{}).am$('encode',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Dict',false),new sys.Param('sort','sys::Bool',false)]),{}).am$('toDocName',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Dict',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('setLoc',128,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','defc::CLoc?',false)]),{});
CUnit.type$.af$('name',73730,'sys::Str',{}).af$('files',73728,'sys::File[]',{}).af$('includesList',67584,'defc::CUnit[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('includes',8192,'defc::CUnit[]',xp,{}).am$('resolveDepends',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('includes','defc::CUnit[]',false)]),{});
CDefRef.type$.af$('loc',73730,'defc::CLoc',{}).af$('symbol',73730,'defc::CSymbol',{}).af$('resolved',67584,'defc::CDef?',{}).am$('makeResolved',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','defc::CLoc',false),new sys.Param('symbol','defc::CSymbol',false),new sys.Param('def','defc::CDef',false)]),{}).am$('deref',8192,'defc::CDef',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
CDefParts.type$.af$('def',73728,'defc::CDef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('key',270336,'defc::CKeyParts',xp,{}).am$('conjunct',270336,'defc::CConjunctParts',xp,{});
CKeyParts.type$.af$('feature',73728,'defc::CDef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false),new sys.Param('feature','defc::CDef',false)]),{}).am$('key',271360,'defc::CKeyParts',xp,{});
CConjunctParts.type$.af$('tags',73728,'defc::CDef[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false),new sys.Param('tags','defc::CDef[]',false)]),{}).am$('conjunct',271360,'defc::CConjunctParts',xp,{});
CFandoc.type$.af$('none',106498,'defc::CFandoc',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','defc::CLoc',false),new sys.Param('text','sys::Str',false)]),{}).am$('wrap',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('d','compilerDoc::DocFandoc',false)]),{}).am$('isEmpty',8192,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('toSummary',8192,'defc::CFandoc',xp,{}).am$('summary',8192,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
CIndex.type$.af$('libs',73728,'defc::CLib[]',{}).af$('defs',73728,'defc::CDef[]',{}).af$('etc',73728,'defc::CIndexEtc',{}).af$('defsMap',73728,'[sys::Str:defc::CDef]',{}).af$('protosRef',65664,'defc::CProto[]?',{}).af$('nsRef',65664,'haystack::Namespace?',{}).af$('features$Store',722944,'sys::Obj?',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('features',532480,'defc::CDef[]',xp,{}).am$('def',8192,'defc::CDef?',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('subtypes',8192,'defc::CDef[]',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('implements',8192,'defc::CDef[]?',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('associationOn',8192,'defc::CDef[]',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('hasProtos',8192,'sys::Bool',xp,{}).am$('protos',8192,'defc::CProto[]',xp,{}).am$('ns',8192,'haystack::Namespace',xp,{}).am$('nsMap',8192,'defc::CDef[]',sys.List.make(sys.Param.type$,[new sys.Param('list','haystack::Def[]',false)]),{}).am$('features$Once',133120,'defc::CDef[]',xp,{});
CIndexEtc.type$.af$('index',67584,'defc::CIndex',{}).af$('association$Store',722944,'sys::Obj?',{}).af$('baseUri$Store',722944,'sys::Obj?',{}).af$('choice$Store',722944,'sys::Obj?',{}).af$('entity$Store',722944,'sys::Obj?',{}).af$('enum$Store',722944,'sys::Obj?',{}).af$('equip$Store',722944,'sys::Obj?',{}).af$('feature$Store',722944,'sys::Obj?',{}).af$('isDef$Store',722944,'sys::Obj?',{}).af$('lib$Store',722944,'sys::Obj?',{}).af$('marker$Store',722944,'sys::Obj?',{}).af$('quantity$Store',722944,'sys::Obj?',{}).af$('phenomenon$Store',722944,'sys::Obj?',{}).af$('point$Store',722944,'sys::Obj?',{}).af$('process$Store',722944,'sys::Obj?',{}).af$('relationship$Store',722944,'sys::Obj?',{}).af$('ref$Store',722944,'sys::Obj?',{}).af$('space$Store',722944,'sys::Obj?',{}).af$('tags$Store',722944,'sys::Obj?',{}).af$('val$Store',722944,'sys::Obj?',{}).af$('version$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('index','defc::CIndex',false)]),{}).am$('association',532480,'defc::CDef',xp,{}).am$('baseUri',532480,'defc::CDef',xp,{}).am$('choice',532480,'defc::CDef',xp,{}).am$('entity',532480,'defc::CDef',xp,{}).am$('enum',532480,'defc::CDef',xp,{}).am$('equip',532480,'defc::CDef',xp,{}).am$('feature',532480,'defc::CDef',xp,{}).am$('isDef',532480,'defc::CDef',xp,{}).am$('lib',532480,'defc::CDef',xp,{}).am$('marker',532480,'defc::CDef',xp,{}).am$('quantity',532480,'defc::CDef',xp,{}).am$('phenomenon',532480,'defc::CDef',xp,{}).am$('point',532480,'defc::CDef',xp,{}).am$('process',532480,'defc::CDef',xp,{}).am$('relationship',532480,'defc::CDef',xp,{}).am$('ref',532480,'defc::CDef',xp,{}).am$('space',532480,'defc::CDef',xp,{}).am$('tags',532480,'defc::CDef',xp,{}).am$('val',532480,'defc::CDef',xp,{}).am$('version',532480,'defc::CDef',xp,{}).am$('association$Once',133120,'defc::CDef',xp,{}).am$('baseUri$Once',133120,'defc::CDef',xp,{}).am$('choice$Once',133120,'defc::CDef',xp,{}).am$('entity$Once',133120,'defc::CDef',xp,{}).am$('enum$Once',133120,'defc::CDef',xp,{}).am$('equip$Once',133120,'defc::CDef',xp,{}).am$('feature$Once',133120,'defc::CDef',xp,{}).am$('isDef$Once',133120,'defc::CDef',xp,{}).am$('lib$Once',133120,'defc::CDef',xp,{}).am$('marker$Once',133120,'defc::CDef',xp,{}).am$('quantity$Once',133120,'defc::CDef',xp,{}).am$('phenomenon$Once',133120,'defc::CDef',xp,{}).am$('point$Once',133120,'defc::CDef',xp,{}).am$('process$Once',133120,'defc::CDef',xp,{}).am$('relationship$Once',133120,'defc::CDef',xp,{}).am$('ref$Once',133120,'defc::CDef',xp,{}).am$('space$Once',133120,'defc::CDef',xp,{}).am$('tags$Once',133120,'defc::CDef',xp,{}).am$('val$Once',133120,'defc::CDef',xp,{}).am$('version$Once',133120,'defc::CDef',xp,{});
CLoc.type$.af$('none',106498,'defc::CLoc',{}).af$('inputs',106498,'defc::CLoc',{}).am$('makeFile',40966,'defc::CLoc?',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('makeFileLoc',40966,'defc::CLoc?',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::Str',false),new sys.Param('line','sys::Int',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
CLib.type$.af$('input',73730,'defc::LibInput',{}).af$('depends',73728,'defc::CSymbol[]',{}).af$('defs',73728,'[defc::CSymbol:defc::CDef]',{}).af$('defXs',73728,'defc::CDefX[]',{}).af$('scope',65664,'defc::ResolveScope?',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','defc::CLoc',false),new sys.Param('symbol','defc::CSymbol',false),new sys.Param('declared','haystack::Dict',false),new sys.Param('input','defc::LibInput',false),new sys.Param('depends','defc::CSymbol[]',false)]),{}).am$('dis',271360,'sys::Str',xp,{});
DefDocEnv.type$.af$('ns',73730,'haystack::Namespace',{}).af$('ts',73730,'sys::DateTime',{}).af$('spacesMap',73730,'[sys::Str:compilerDoc::DocSpace]',{}).af$('libs',73730,'defc::DocLib[]',{}).af$('libsMap',73730,'[sys::Str:defc::DocLib]',{}).af$('defsMap',73730,'[sys::Str:defc::DocDef]',{}).af$('docSectionsRef',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('init','defc::DefDocEnvInit',false)]),{}).am$('topIndex',271360,'compilerDoc::DocTopIndex',xp,{}).am$('space',271360,'compilerDoc::DocSpace?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('manual',8192,'compilerDoc::DocPod?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('lib',8192,'defc::DocLib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('def',8192,'defc::DocDef?',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('findDefs',8192,'defc::DocDef[]',sys.List.make(sys.Param.type$,[new sys.Param('f','|defc::DocDef->sys::Bool|',false)]),{}).am$('resolve',8192,'defc::DocDef?',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Def',false)]),{}).am$('resolveList',8192,'defc::DocDef[]',sys.List.make(sys.Param.type$,[new sys.Param('list','haystack::Def[]',false),new sys.Param('sort','sys::Bool',false)]),{}).am$('theme',271360,'compilerDoc::DocTheme',xp,{}).am$('render',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','web::WebOutStream',false),new sys.Param('doc','compilerDoc::Doc',false)]),{}).am$('renderer',270336,'sys::Type',sys.List.make(sys.Param.type$,[new sys.Param('doc','compilerDoc::Doc',false)]),{}).am$('initFandocHtmlWriter',271360,'fandoc::HtmlDocWriter',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('genFullHtml',270336,'sys::Bool',xp,{}).am$('cssFilename',270336,'sys::Str',xp,{}).am$('siteDis',270336,'sys::Str',xp,{}).am$('footer',270336,'sys::Str',xp,{}).am$('includeTagInMetaSection',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('base','haystack::Def',false),new sys.Param('tag','defc::DocDef',false)]),{}).am$('supertypes',8192,'defc::DocDef[]',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{}).am$('supertypeTree',8192,'defc::DocDefTree',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{}).am$('doSupertypeTree',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','defc::DocDefTree',false)]),{}).am$('subtypes',8192,'defc::DocDef[]',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{}).am$('subtypeTree',8192,'defc::DocDefTree',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{}).am$('doSubtypeTree',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','defc::DocDefTree',false)]),{}).am$('docAssociations',8192,'defc::DocDef[]',xp,{}).am$('associations',8192,'defc::DocDef[]',sys.List.make(sys.Param.type$,[new sys.Param('parent','defc::DocDef',false),new sys.Param('association','defc::DocDef',false)]),{}).am$('link',271360,'compilerDoc::DocLink?',sys.List.make(sys.Param.type$,[new sys.Param('from','compilerDoc::Doc',false),new sys.Param('link','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('linkSectionTitle',270336,'sys::Uri?',sys.List.make(sys.Param.type$,[new sys.Param('from','compilerDoc::Doc',false),new sys.Param('title','sys::Str',false)]),{}).am$('imageLink',270336,'defc::DocResFile?',sys.List.make(sys.Param.type$,[new sys.Param('from','compilerDoc::Doc',false),new sys.Param('link','sys::Str',false),new sys.Param('loc','compilerDoc::DocLoc',false)]),{}).am$('walkChapterToc',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('from','compilerDoc::Doc',false),new sys.Param('target','compilerDoc::Doc',false),new sys.Param('f','|compilerDoc::DocHeading,sys::Uri->sys::Void|',false)]),{}).am$('walkChapterTocTopOnly',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('from','compilerDoc::Doc',false),new sys.Param('target','compilerDoc::Doc',false),new sys.Param('f','|compilerDoc::DocHeading,sys::Uri->sys::Void|',false)]),{}).am$('doWalkChapterToc',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('from','compilerDoc::Doc',false),new sys.Param('target','compilerDoc::Doc',false),new sys.Param('h','compilerDoc::DocHeading',false),new sys.Param('walkKids','sys::Bool',false),new sys.Param('f','|compilerDoc::DocHeading,sys::Uri->sys::Void|',false)]),{});
DefDocEnvInit.type$.af$('ns',73728,'haystack::Namespace',{}).af$('spacesMap',73728,'[sys::Str:compilerDoc::DocSpace]',{}).af$('defsMap',73728,'[sys::Str:defc::DocDef]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{});
DocDef.type$.af$('lib',73730,'defc::DocLib',{}).af$('loc',73730,'defc::CLoc',{}).af$('def',73730,'haystack::Def',{}).af$('docNameRef',67586,'sys::Str',{}).af$('docSummary',73730,'defc::CFandoc',{}).af$('docFull',73730,'defc::CFandoc',{}).af$('subtitleRef',73730,'concurrent::AtomicRef',{}).af$('rendererRef',73730,'concurrent::AtomicRef',{}).af$('childrenRef',65666,'concurrent::AtomicRef',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::DocLib',false),new sys.Param('loc','defc::CLoc',false),new sys.Param('def','haystack::Def',false)]),{}).am$('name',8192,'sys::Str',xp,{}).am$('dis',8192,'sys::Str',xp,{}).am$('symbol',8192,'haystack::Symbol',xp,{}).am$('type',8192,'haystack::SymbolType',xp,{}).am$('has',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('docName',271360,'sys::Str',xp,{}).am$('space',271360,'compilerDoc::DocSpace',xp,{}).am$('isCode',271360,'sys::Bool',xp,{}).am$('breadcrumb',271360,'sys::Str',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('subtitle',8192,'sys::Str?',xp,{}).am$('renderer',271360,'sys::Type',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj',false)]),{}).am$('children',8192,'defc::DocProto[]',xp,{});
DefDocRenderer.type$.af$('navData',73728,'defc::DocNavData',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','defc::DefDocEnv',false),new sys.Param('out','defc::DocOutStream',false),new sys.Param('doc','compilerDoc::Doc',false)]),{}).am$('env',271360,'defc::DefDocEnv',xp,{}).am$('out',271360,'defc::DocOutStream',xp,{}).am$('writeDoc',271360,'sys::Void',xp,{}).am$('writePrevNext',270336,'sys::Void',xp,{}).am$('writeNavData',8192,'sys::Void',xp,{}).am$('buildNavData',270336,'sys::Void',xp,{}).am$('writeDefHeader',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('title','sys::Str',false),new sys.Param('subtitle','sys::Str?',false),new sys.Param('doc','defc::CFandoc',false)]),{}).am$('writeMetaSection',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Def',false)]),{}).am$('writeListSection',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('defs','defc::DocDef[]',false),new sys.Param('justName','sys::Bool',true)]),{}).am$('writeProtosSection',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('protos','defc::DocProto[]',false)]),{}).am$('writeChapterTocSection',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('target','compilerDoc::Doc?',false)]),{}).am$('writeChapterTocLinks',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('target','compilerDoc::Doc',false)]),{}).am$('onFandocImage',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::Image',false),new sys.Param('loc','compilerDoc::DocLoc',false)]),{}).am$('onFandocErr',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','sys::Err',false),new sys.Param('loc','compilerDoc::DocLoc',false)]),{});
StdDocDefRenderer.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','web::WebOutStream',false),new sys.Param('doc','defc::DocDef',false)]),{}).am$('doc',271360,'defc::DocDef',xp,{}).am$('writeContent',271360,'sys::Void',xp,{}).am$('writeConjunct',270336,'sys::Void',xp,{}).am$('writeUsageSection',270336,'sys::Void',xp,{}).am$('writeEnumSection',270336,'sys::Void',xp,{}).am$('writeTreeSection',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('tree','defc::DocDefTree',false)]),{}).am$('writeAssociationSections',270336,'sys::Void',xp,{});
DocProtoSpace.type$.af$('index',73730,'defc::DocProtoIndex',{}).af$('protos',73730,'defc::DocProto[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('protos','defc::DocProto[]',false)]),{}).am$('spaceName',271360,'sys::Str',xp,{}).am$('doc',271360,'compilerDoc::Doc?',sys.List.make(sys.Param.type$,[new sys.Param('docName','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachDoc',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|compilerDoc::Doc->sys::Void|',false)]),{});
DocProto.type$.af$('dis',73730,'sys::Str',{}).af$('spaceRef',65666,'concurrent::AtomicRef',{}).af$('docName',336898,'sys::Str',{}).af$('implements',73730,'defc::DocDef[]',{}).af$('childrenRef',65666,'concurrent::AtomicRef',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('space',271360,'defc::DocProtoSpace',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('isSimple',8192,'sys::Bool',xp,{}).am$('children',8192,'defc::DocProto[]',xp,{}).am$('renderer',271360,'sys::Type',xp,{});
DocProtoRenderer.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','defc::DefDocEnv',false),new sys.Param('out','defc::DocOutStream',false),new sys.Param('doc','defc::DocProto',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{});
DocProtoIndex.type$.af$('space',336898,'defc::DocProtoSpace',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('space','defc::DocProtoSpace',false)]),{}).am$('isSpaceIndex',271360,'sys::Bool',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('docName',271360,'sys::Str',xp,{}).am$('renderer',271360,'sys::Type',xp,{});
DocProtoIndexRenderer.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','defc::DefDocEnv',false),new sys.Param('out','defc::DocOutStream',false),new sys.Param('doc','defc::DocProtoIndex',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{});
DocAppendixSpace.type$.af$('docs',73730,'defc::DocAppendix[]',{}).af$('docsMap',67586,'[sys::Str:defc::DocAppendix]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('docs','defc::DocAppendix[]',false)]),{}).am$('spaceName',271360,'sys::Str',xp,{}).am$('doc',271360,'compilerDoc::Doc?',sys.List.make(sys.Param.type$,[new sys.Param('docName','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachDoc',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|compilerDoc::Doc->sys::Void|',false)]),{});
DocAppendix.type$.af$('spaceRef',65666,'concurrent::AtomicRef',{}).am$('space',271360,'defc::DocAppendixSpace',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('group',270337,'sys::Str',xp,{}).am$('summary',270337,'sys::Obj',xp,{}).am$('make',139268,'sys::Void',xp,{});
DocAppendixIndex.type$.am$('isSpaceIndex',271360,'sys::Bool',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('docName',271360,'sys::Str',xp,{}).am$('group',271360,'sys::Str',xp,{}).am$('renderer',271360,'sys::Type',xp,{}).am$('make',139268,'sys::Void',xp,{});
DocAppendixIndexRenderer.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','defc::DefDocEnv',false),new sys.Param('out','defc::DocOutStream',false),new sys.Param('doc','defc::DocAppendixIndex',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{}).am$('doWriteContent',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','defc::DocOutStream',false),new sys.Param('space','defc::DocAppendixSpace',false)]),{});
DocTaxonomyAppendix.type$.af$('def',73730,'defc::DocDef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{}).am$('docName',271360,'sys::Str',xp,{}).am$('renderer',271360,'sys::Type',xp,{}).am$('group',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Obj',xp,{});
DocTaxonomyAppendixRenderer.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','defc::DefDocEnv',false),new sys.Param('out','defc::DocOutStream',false),new sys.Param('doc','defc::DocTaxonomyAppendix',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{});
DocListAppendix.type$.am$('group',271360,'sys::Str',xp,{}).am$('renderer',271360,'sys::Type',xp,{}).am$('include',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('d','defc::DocDef',false)]),{}).am$('collect',270336,'defc::DocDef[]',sys.List.make(sys.Param.type$,[new sys.Param('env','defc::DefDocEnv',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DocListAppendixRenderer.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','defc::DefDocEnv',false),new sys.Param('out','defc::DocOutStream',false),new sys.Param('doc','defc::DocListAppendix',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{});
DocTagAppendix.type$.am$('docName',271360,'sys::Str',xp,{}).am$('include',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{}).am$('summary',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
DocConjunctAppendix.type$.am$('docName',271360,'sys::Str',xp,{}).am$('include',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{}).am$('summary',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
DocLibAppendix.type$.am$('docName',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('include',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('d','defc::DocDef',false)]),{}).am$('collect',271360,'defc::DocDef[]',sys.List.make(sys.Param.type$,[new sys.Param('env','defc::DefDocEnv',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DocFeatureAppendix.type$.af$('feature',73730,'defc::DocDef',{}).af$('docName',336898,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','defc::DocDef',false)]),{}).am$('include',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{}).am$('summary',271360,'sys::Str',xp,{});
DocFandocWriter.type$.af$('inPreZinc',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('elemStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('writePreZinc',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('zinc','sys::Str',false)]),{}).am$('text',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','fandoc::DocText',false)]),{}).am$('elemEnd',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('clickJs',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('show','sys::Str',false),new sys.Param('hide','sys::Str',false)]),{});
DocOutStream.type$.af$('trackToNavData',73728,'sys::Bool',{}).af$('resFiles',65664,'[sys::Str:defc::DocResFile]',{}).af$('doc',65664,'compilerDoc::Doc?',{}).af$('env',65664,'defc::DefDocEnv?',{}).af$('renderer',65664,'compilerDoc::DocRenderer?',{}).af$('navData$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('resFiles','[sys::Str:defc::DocResFile]',false)]),{}).am$('defSection',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('title','sys::Str',false),new sys.Param('id','sys::Str',true)]),{}).am$('defSectionEnd',8192,'sys::This',xp,{}).am$('props',8192,'sys::This',xp,{}).am$('propsEnd',8192,'sys::This',xp,{}).am$('prop',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Obj',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('propName',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Obj',false)]),{}).am$('propVal',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('listVal',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::List',false)]),{}).am$('dictVal',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Dict',false)]),{}).am$('symbolVal',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('symbol','haystack::Symbol',false)]),{}).am$('uriVal',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('propDef',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false),new sys.Param('dis','sys::Str',true),new sys.Param('indentation','sys::Int',true)]),{}).am$('propLib',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::DocLib',false),new sys.Param('frag','sys::Str?',true)]),{}).am$('propPod',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('pod','compilerDoc::DocPod',false)]),{}).am$('propProto',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('proto','defc::DocProto',false)]),{}).am$('propQuick',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('path','sys::Str',false),new sys.Param('summary','sys::Str',false),new sys.Param('dis','sys::Str?',true)]),{}).am$('propTitle',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('title','sys::Str',false)]),{}).am$('indent',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('indentation','sys::Int',false)]),{}).am$('navData',526336,'defc::DocNavData',xp,{}).am$('linkTo',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('link','compilerDoc::DocLink',false)]),{}).am$('linkDef',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('target','haystack::Def',false),new sys.Param('dis','sys::Str',true)]),{}).am$('link',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('target','compilerDoc::Doc',false),new sys.Param('dis','sys::Str',true)]),{}).am$('docToLink',8192,'compilerDoc::DocLink',sys.List.make(sys.Param.type$,[new sys.Param('target','compilerDoc::Doc',false),new sys.Param('dis','sys::Str',true)]),{}).am$('docFull',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{}).am$('docSummary',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{}).am$('fandoc',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('doc','compilerDoc::DocFandoc',false)]),{}).am$('navData$Once',133120,'defc::DocNavData',xp,{});
DefDocTheme.type$.am$('writeStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','compilerDoc::DocRenderer',false)]),{}).am$('writeBreadcrumb',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','compilerDoc::DocRenderer',false)]),{}).am$('writeBreadcrumbSep',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','compilerDoc::DocRenderer',false)]),{}).am$('writeBreadcrumbItem',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','compilerDoc::DocRenderer',false),new sys.Param('doc','compilerDoc::Doc',false),new sys.Param('dis','sys::Str',false),new sys.Param('nav','defc::DocNavData',false)]),{}).am$('writeEnd',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('r','compilerDoc::DocRenderer',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DefTopIndexRenderer.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','defc::DocOutStream',false),new sys.Param('doc','compilerDoc::DocTopIndex',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{});
DefPodIndexRenderer.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','defc::DocOutStream',false),new sys.Param('doc','compilerDoc::DocPodIndex',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{}).am$('writeManual',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','compilerDoc::DocPodIndex',false)]),{}).am$('writeApi',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','compilerDoc::DocPodIndex',false)]),{}).am$('writeApiPodDoc',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('chapter','compilerDoc::DocChapter',false)]),{}).am$('buildNavData',271360,'sys::Void',xp,{}).am$('buildNavDataManual',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','compilerDoc::DocPodIndex',false)]),{}).am$('buildNavDataApi',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','compilerDoc::DocPodIndex',false)]),{});
DefChapterRenderer.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','defc::DocOutStream',false),new sys.Param('doc','compilerDoc::DocChapter',false)]),{}).am$('writePrevNext',271360,'sys::Void',xp,{}).am$('writeContent',271360,'sys::Void',xp,{}).am$('writeVideo',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('chapter','compilerDoc::DocChapter',false)]),{}).am$('writeSlide',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('chapter','compilerDoc::DocChapter',false)]),{}).am$('buildNavData',271360,'sys::Void',xp,{});
DocDefTree.type$.af$('parent',73728,'defc::DocDefTree?',{}).af$('def',73728,'defc::DocDef',{}).af$('kids',67584,'defc::DocDefTree[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','defc::DocDefTree?',false),new sys.Param('def','defc::DocDef',false)]),{}).am$('isEmpty',8192,'sys::Bool',xp,{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj',false)]),{}).am$('add',8192,'defc::DocDefTree',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Int,defc::DocDef->sys::Void|',false)]),{}).am$('doEach',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('indent','sys::Int',false),new sys.Param('f','|sys::Int,defc::DocDef->sys::Void|',false)]),{}).am$('invert',8192,'defc::DocDefTree',xp,{}).am$('findLeafs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','defc::DocDefTree[]',false)]),{}).am$('addPath',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('nodes','[sys::Str:defc::DocDefTree]',false),new sys.Param('parent','defc::DocDefTree',false),new sys.Param('x','defc::DocDefTree',false)]),{});
DocLib.type$.af$('def',73730,'haystack::Lib',{}).af$('name',73730,'sys::Str',{}).af$('index',73730,'defc::DocLibIndex',{}).af$('manualRef',73730,'concurrent::AtomicRef',{}).af$('defs',73730,'defc::DocDef[]',{}).af$('docSummary',73730,'defc::CFandoc',{}).af$('docFull',73730,'defc::CFandoc',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('spaceName',271360,'sys::Str',xp,{}).am$('breadcrumb',271360,'sys::Str',xp,{}).am$('manual',8192,'defc::DocLibManual?',xp,{}).am$('doc',271360,'compilerDoc::Doc?',sys.List.make(sys.Param.type$,[new sys.Param('docName','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachDoc',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|compilerDoc::Doc->sys::Void|',false)]),{});
DocLibIndex.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::DocLib',false)]),{}).am$('docName',271360,'sys::Str',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('isSpaceIndex',271360,'sys::Bool',xp,{}).am$('renderer',271360,'sys::Type',xp,{});
DocLibManual.type$.af$('lib',73730,'defc::DocLib',{}).af$('chapter',73730,'compilerDoc::DocChapter',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::DocLib',false),new sys.Param('chapter','compilerDoc::DocChapter',false)]),{}).am$('space',271360,'compilerDoc::DocSpace',xp,{}).am$('docName',271360,'sys::Str',xp,{}).am$('title',271360,'sys::Str',xp,{}).am$('renderer',271360,'sys::Type',xp,{}).am$('heading',271360,'compilerDoc::DocHeading?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
DocLibIndexRenderer.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','web::WebOutStream',false),new sys.Param('doc','defc::DocLibIndex',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{});
DocLibManualRenderer.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('env','compilerDoc::DocEnv',false),new sys.Param('out','web::WebOutStream',false),new sys.Param('doc','defc::DocLibManual',false)]),{}).am$('writeContent',271360,'sys::Void',xp,{}).am$('buildNavData',271360,'sys::Void',xp,{});
DocNavData.type$.af$('buf',67584,'sys::StrBuf',{}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('title','sys::Str',false),new sys.Param('level','sys::Int',true)]),{}).am$('addSafe',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('isEmpty',8192,'sys::Bool',xp,{}).am$('encode',8192,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
Validate.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('validateLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false)]),{}).am$('validateDef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('validateConjuct',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('validateDefTag',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false),new sys.Param('pair','defc::CPair',false)]),{}).am$('verifyOfTag',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false),new sys.Param('pair','defc::CPair',false)]),{}).am$('fitsRoot',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('isComputedException',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false),new sys.Param('pair','defc::CPair',false)]),{});
GenGrid.type$.af$('format',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false),new sys.Param('format','sys::Str',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('baseName',270337,'sys::Str',xp,{}).am$('toGrid',270337,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('formats',40962,'sys::Str[]',xp,{}).am$('writeGrid',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false),new sys.Param('filetype','haystack::Filetype',false),new sys.Param('out','sys::OutStream',false)]),{});
GenDefsGrid.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false),new sys.Param('format','sys::Str',false)]),{}).am$('baseName',271360,'sys::Str',xp,{}).am$('toGrid',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{});
GenProtosGrid.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false),new sys.Param('format','sys::Str',false)]),{}).am$('baseName',271360,'sys::Str',xp,{}).am$('toGrid',271360,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('buildProtosGrid',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{});
Normalize.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('normalizeLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false)]),{}).am$('normalize',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('normalizeListVals',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('unitEnumStr',2048,'sys::Str',xp,{});
Scan.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('scanInput',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','defc::CompilerInput',false)]),{}).am$('scanLibInput',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','defc::LibInput',false)]),{}).am$('parseDepends',2048,'defc::CSymbol[]',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('loc','defc::CLoc',false)]),{}).am$('parseLibSymbol',2048,'defc::CSymbol?',sys.List.make(sys.Param.type$,[new sys.Param('tagName','sys::Str',false),new sys.Param('val','sys::Obj?',false),new sys.Param('loc','defc::CLoc',false)]),{}).am$('scanManualInput',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('input','defc::ManualInput',false)]),{}).am$('readManualIndex',2048,'sys::Obj[]?',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Pod',false)]),{});
GenNamespace.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('genMeta',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::CDef',false)]),{}).am$('stripDoc',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::CDef',false)]),{}).am$('genVal',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('c','sys::Obj?',false)]),{});
Parse.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('parseLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false)]),{}).am$('parseFile',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('file','sys::File',false)]),{}).am$('parseRec',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('dict','haystack::Dict',false),new sys.Param('loc','defc::CLoc',false)]),{}).am$('parseDef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('dict','haystack::Dict',false),new sys.Param('loc','defc::CLoc',false)]),{}).am$('parseDefX',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('dict','haystack::Dict',false),new sys.Param('loc','defc::CLoc',false)]),{});
Reflect.type$.af$('intSymbol',67586,'haystack::Symbol',{}).af$('durationSymbol',67586,'haystack::Symbol',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('reflectLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false)]),{}).am$('reflectInput',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('ri','defc::ReflectInput',false)]),{}).am$('reflectType',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('ri','defc::ReflectInput',false)]),{}).am$('reflectFields',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('ri','defc::ReflectInput',false)]),{}).am$('reflectField',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('ri','defc::ReflectInput',false),new sys.Param('field','sys::Field',false),new sys.Param('facet','haystack::Define',false)]),{}).am$('reflectMethods',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('ri','defc::ReflectInput',false)]),{}).am$('reflectMethod',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('ri','defc::ReflectInput',false),new sys.Param('method','sys::Method',false),new sys.Param('facet','haystack::Define',false)]),{}).am$('typeToMeta',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false),new sys.Param('symbol','haystack::Symbol',false),new sys.Param('ri','defc::ReflectInput',false),new sys.Param('facet','haystack::Define',false)]),{}).am$('slotToMeta',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false),new sys.Param('symbol','haystack::Symbol',false),new sys.Param('ri','defc::ReflectInput',false),new sys.Param('slot','sys::Slot',false),new sys.Param('facet','haystack::Define',false)]),{}).am$('facetToMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false),new sys.Param('facet','haystack::Define',false)]),{}).am$('typeToDef',2048,'haystack::Symbol',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{});
Inherit.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('inherit',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{});
GenProtos.type$.af$('acc',67584,'[sys::Str:defc::CProto]',{}).af$('reflects',67584,'[sys::Str:haystack::Reflection]',{}).af$('entities',67584,'defc::CDef[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('processDef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('processDefChildren',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false),new sys.Param('dicts','haystack::Dict[]',false)]),{}).am$('defToProto',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('computeChildren',2048,'defc::CProto[]',sys.List.make(sys.Param.type$,[new sys.Param('parent','haystack::Dict',false),new sys.Param('list','sys::Obj?[]',false),new sys.Param('loc','defc::CLoc?',false)]),{}).am$('addProto',2048,'defc::CProto',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false),new sys.Param('loc','defc::CLoc?',false)]),{}).am$('validate',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('proto','defc::CProto',false)]),{});
GenDist.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('writeDocs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('zip','sys::Zip',false)]),{}).am$('writeSrc',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('zip','sys::Zip',false)]),{}).am$('findSrcDir',2048,'sys::File',xp,{}).am$('addToZip',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('zip','sys::Zip',false),new sys.Param('path','sys::Str',false),new sys.Param('file','sys::File',false)]),{});
Resolve.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('resolveLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false)]),{}).am$('resolveDepends',2048,'defc::CLib[]',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false)]),{}).am$('resolveScope',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('scope','[sys::Str:defc::CDef]',false),new sys.Param('include','defc::CLib',false)]),{}).am$('resolveDef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('scope','defc::ResolveScope',false),new sys.Param('def','defc::CDef',false)]),{}).am$('resolveDefX',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('scope','defc::ResolveScope',false),new sys.Param('defx','defc::CDefX',false)]),{}).am$('resolveSymbolParts',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('scope','defc::ResolveScope',false),new sys.Param('def','defc::CDef',false)]),{}).am$('resolveKeyParts',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('scope','defc::ResolveScope',false),new sys.Param('def','defc::CDef',false)]),{}).am$('resolveConjunctParts',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('scope','defc::ResolveScope',false),new sys.Param('def','defc::CDef',false)]),{}).am$('resolveDeclaredToMeta',128,'[sys::Str:defc::CPair]',sys.List.make(sys.Param.type$,[new sys.Param('scope','defc::ResolveScope',false),new sys.Param('declared','haystack::Dict',false),new sys.Param('loc','defc::CLoc',false)]),{}).am$('resolveTag',2048,'defc::CDef?',sys.List.make(sys.Param.type$,[new sys.Param('scope','defc::ResolveScope',false),new sys.Param('name','sys::Str',false),new sys.Param('loc','defc::CLoc',false)]),{}).am$('reportUnresolvedTag',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('resolveVal',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('scope','defc::ResolveScope',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false),new sys.Param('loc','defc::CLoc',false)]),{}).am$('resolveListVal',2048,'sys::Obj?[]',sys.List.make(sys.Param.type$,[new sys.Param('scope','defc::ResolveScope',false),new sys.Param('name','sys::Str',false),new sys.Param('list','sys::Obj?[]',false),new sys.Param('loc','defc::CLoc',false)]),{}).am$('resolveIsVal',2048,'defc::CDef[]',sys.List.make(sys.Param.type$,[new sys.Param('scope','defc::ResolveScope',false),new sys.Param('val','sys::Obj',false),new sys.Param('loc','defc::CLoc',false)]),{}).am$('resolveSymbolVal',2048,'defc::CDef?',sys.List.make(sys.Param.type$,[new sys.Param('scope','defc::ResolveScope',false),new sys.Param('name','sys::Str',false),new sys.Param('val','haystack::Symbol',false),new sys.Param('loc','defc::CLoc',false)]),{});
ResolveScope.type$.af$('lib',73728,'defc::CLib',{}).af$('map',73728,'[sys::Str:defc::CDef]',{}).af$('refTerms',73728,'[sys::Str:defc::CDef[]]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false),new sys.Param('map','[sys::Str:defc::CDef]',false)]),{}).am$('get',8192,'defc::CDef?',sys.List.make(sys.Param.type$,[new sys.Param('symbol','defc::CSymbol',false)]),{'sys::Operator':""});
Index.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{});
GenDocEnv.type$.af$('spacesMap',67584,'[sys::Str:compilerDoc::DocSpace]',{}).af$('defsMap',67584,'[sys::Str:defc::DocDef]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('genLib',2048,'defc::DocLib',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false)]),{}).am$('genDefs',2048,'defc::DocDef[]',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::DocLib',false),new sys.Param('defs','defc::CDef[]',false)]),{}).am$('genDef',2048,'defc::DocDef',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::DocLib',false),new sys.Param('def','defc::CDef',false)]),{}).am$('genProtos',2048,'defc::DocProtoSpace',xp,{}).am$('mapDefs',2048,'defc::DocDef[]',sys.List.make(sys.Param.type$,[new sys.Param('list','defc::CDef[]',false)]),{}).am$('mapProtos',2048,'defc::DocProto[]',sys.List.make(sys.Param.type$,[new sys.Param('list','defc::CProto[]?',false)]),{}).am$('genAppendix',2048,'defc::DocAppendixSpace',xp,{}).am$('includeLib',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false)]),{}).am$('includeDef',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('addSpace',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('space','compilerDoc::DocSpace',false)]),{}).am$('addDefDoc',2048,'defc::DocDef',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::DocDef',false)]),{});
GenDocs.type$.af$('genFullHtml',73728,'sys::Bool',{}).af$('resFiles',73728,'[sys::Str:defc::DocResFile]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('render',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','compilerDoc::Doc',false),new sys.Param('onFile','|defc::DocFile->sys::Void|',false)]),{}).am$('copyResFile',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('res','defc::DocResFile',false),new sys.Param('onFile','|defc::DocFile->sys::Void|',false)]),{}).am$('copy',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::File',false),new sys.Param('uri','sys::Uri',false),new sys.Param('onFile','|defc::DocFile->sys::Void|',false)]),{});
DocFile.type$.af$('uri',73730,'sys::Uri',{}).af$('title',73730,'sys::Str',{}).af$('content',73730,'sys::Buf',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('title','sys::Str',false),new sys.Param('content','sys::Buf',false)]),{});
DocResFile.type$.af$('spaceName',73730,'sys::Str',{}).af$('docName',73730,'sys::Str',{}).af$('qname',73730,'sys::Str',{}).af$('file',73730,'sys::File',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spaceName','sys::Str',false),new sys.Param('docName','sys::Str',false),new sys.Param('file','sys::File',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
ApplyX.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('applyLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','defc::CLib',false)]),{}).am$('applyDefX',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('defx','defc::CDefX',false)]),{});
Taxonify.type$.af$('stack',73728,'defc::CDef[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('run',271360,'sys::Void',xp,{}).am$('taxonify',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('impliedIs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('impliedKeyIs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('declaredIs',2048,'defc::CDef[]',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('computeInheritance',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','defc::CDef',false)]),{}).am$('computeInherited',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[defc::CSymbol:defc::CDef]',false),new sys.Param('def','defc::CDef',false)]),{}).am$('doComputeIsInherit',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[defc::CSymbol:defc::CDef]',false),new sys.Param('base','defc::CDef',false)]),{});
InternFactory.type$.af$('strs',67584,'[sys::Str:sys::Str]',{}).am$('makeId',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
SymbolTest.type$.af$('factory',65664,'defc::CSymbolFactory?',{}).am$('test',8192,'sys::Void',xp,{}).am$('verifyName',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('symbol','defc::CSymbol',false),new sys.Param('str','sys::Str',false)]),{}).am$('verifyConjunct',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('symbol','defc::CSymbol',false),new sys.Param('str','sys::Str',false),new sys.Param('parts','defc::CSymbol[]',false)]),{}).am$('verifyKey',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('symbol','defc::CSymbol',false),new sys.Param('str','sys::Str',false),new sys.Param('parts','defc::CSymbol[]',false)]),{}).am$('verifySymbol',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('symbol','defc::CSymbol',false),new sys.Param('type','haystack::SymbolType',false),new sys.Param('str','sys::Str',false),new sys.Param('parts','defc::CSymbol[]',false)]),{}).am$('verifySymbolErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('parse',8192,'defc::CSymbol',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "defc");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;fandoc 1.0;compilerDoc 1.0;web 1.0;util 1.0;xeto 3.1.11;haystack 3.1.11;def 3.1.11");
m.set("pod.summary", "Haystack def compiler");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:26-05:00 New_York");
m.set("build.tsKey", "241210143126");
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
  DefCompilerStep,
  CompilerErr,
  UnresolvedDocLinkErr,
  DefCompiler,
  CompilerInput,
  CompilerInputType,
  LibInput,
  ReflectInput,
  ManualInput,
  Main,
  CSymbol,
  CDef,
  CDefFlags,
  CPair,
  CDefX,
  CProto,
  CUnit,
  CDefRef,
  CDefParts,
  CKeyParts,
  CConjunctParts,
  CFandoc,
  CIndex,
  CIndexEtc,
  CLoc,
  CLib,
  DefDocEnv,
  DefDocEnvInit,
  DocDef,
  DefDocRenderer,
  StdDocDefRenderer,
  DocProtoSpace,
  DocProto,
  DocProtoRenderer,
  DocProtoIndex,
  DocProtoIndexRenderer,
  DocAppendixSpace,
  DocAppendix,
  DocAppendixIndex,
  DocAppendixIndexRenderer,
  DocTaxonomyAppendix,
  DocTaxonomyAppendixRenderer,
  DocListAppendix,
  DocListAppendixRenderer,
  DocOutStream,
  DefDocTheme,
  DefTopIndexRenderer,
  DefPodIndexRenderer,
  DefChapterRenderer,
  DocDefTree,
  DocLib,
  DocLibIndex,
  DocLibManual,
  DocNavData,
  DocFile,
  DocResFile,
  SymbolTest,
};
