// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as fandoc from './fandoc.js'
import * as inet from './inet.js'
import * as markdown from './markdown.js'
import * as rdf from './rdf.js'
import * as syntax from './syntax.js'
import * as util from './util.js'
import * as web from './web.js'
import * as compilerDoc from './compilerDoc.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as def from './def.js'
import * as defc from './defc.js'
import * as xetoEnv from './xetoEnv.js'
import * as xetoDoc from './xetoDoc.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class XetoCmd extends util.AbstractMain {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoCmd.type$; }

  static find(name) {
    const this$ = this;
    return XetoCmd.list().find((cmd) => {
      return (sys.ObjUtil.equals(cmd.name(), name) || cmd.aliases().contains(name));
    });
  }

  static list() {
    const this$ = this;
    let acc = sys.List.make(XetoCmd.type$);
    XetoCmd.type$.pod().types().each((t) => {
      if ((t.fits(XetoCmd.type$) && !t.isAbstract())) {
        acc.add(sys.ObjUtil.coerce(t.make(), XetoCmd.type$));
      }
      ;
      return;
    });
    sys.Env.cur().index("xeto.cmd").each((qname) => {
      try {
        let type = sys.Type.find(qname);
        let cmd = sys.ObjUtil.coerce(type.make(), XetoCmd.type$);
        acc.add(cmd);
      }
      catch ($_u0) {
        $_u0 = sys.Err.make($_u0);
        if ($_u0 instanceof sys.Err) {
          let e = $_u0;
          ;
          sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("ERROR: invalid xeto.cmd ", qname), "\n  "), e));
        }
        else {
          throw $_u0;
        }
      }
      ;
      return;
    });
    acc.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    return acc;
  }

  appName() {
    return sys.Str.plus("xeto ", this.name());
  }

  log() {
    return sys.Log.get("xeto");
  }

  aliases() {
    return sys.List.make(sys.Str.type$);
  }

  readInputFile(file) {
    if ((file == null || !file.exists())) {
      throw sys.Err.make(sys.Str.plus("Input file does not exist: ", file));
    }
    ;
    let $_u1 = file.ext();
    if (sys.ObjUtil.equals($_u1, "trio")) {
      return haystack.TrioReader.make(file.in()).readAllDicts();
    }
    else if (sys.ObjUtil.equals($_u1, "zinc")) {
      return haystack.Etc.toRecs(haystack.ZincReader.make(file.in()).readVal());
    }
    else if (sys.ObjUtil.equals($_u1, "json")) {
      return haystack.Etc.toRecs(haystack.JsonReader.make(file.in()).readVal());
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unsupported input file extension: ", file));
    }
    ;
  }

  writeOutputFile(file,grid) {
    let buf = sys.StrBuf.make();
    let out = buf.out();
    let $_u2 = file.ext();
    if (sys.ObjUtil.equals($_u2, "trio")) {
      sys.ObjUtil.coerce(haystack.TrioWriter.make(out).writeGrid(grid), haystack.TrioWriter.type$).close();
    }
    else if (sys.ObjUtil.equals($_u2, "zinc")) {
      sys.ObjUtil.coerce(haystack.ZincWriter.make(out).writeGrid(grid), haystack.ZincWriter.type$).close();
    }
    else if (sys.ObjUtil.equals($_u2, "json")) {
      sys.ObjUtil.coerce(haystack.JsonWriter.make(out).writeGrid(grid), haystack.JsonWriter.type$).close();
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unsupported input file extension: ", file));
    }
    ;
    let str = buf.toStr();
    file.out().print(str).close();
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Wrote Output [", file.osPath()), "]"));
    return;
  }

  printLine(line) {
    if (line === undefined) line = "";
    sys.ObjUtil.echo(line);
    return;
  }

  err(msg) {
    this.printLine(sys.Str.plus("ERROR: ", msg));
    return 1;
  }

  withOut(arg,f) {
    if (arg == null) {
      sys.Func.call(f, sys.Env.cur().out());
    }
    else {
      this.printLine(sys.Str.plus(sys.Str.plus("Write [", arg.osPath()), "]"));
      let out = arg.out();
      try {
        sys.Func.call(f, out);
      }
      finally {
        out.close();
      }
      ;
    }
    ;
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

  static make() {
    const $self = new XetoCmd();
    XetoCmd.make$($self);
    return $self;
  }

  static make$($self) {
    util.AbstractMain.make$($self);
    return;
  }

}

class GenFantom extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GenFantom.type$; }

  #buildFile = null;

  buildFile(it) {
    if (it === undefined) {
      return this.#buildFile;
    }
    else {
      this.#buildFile = it;
      return;
    }
  }

  #outDir = null;

  // private field reflection only
  __outDir(it) { if (it === undefined) return this.#outDir; else this.#outDir = it; }

  #build = null;

  // private field reflection only
  __build(it) { if (it === undefined) return this.#build; else this.#build = it; }

  #genSetters = false;

  // private field reflection only
  __genSetters(it) { if (it === undefined) return this.#genSetters; else this.#genSetters = it; }

  #genDicts = false;

  // private field reflection only
  __genDicts(it) { if (it === undefined) return this.#genDicts; else this.#genDicts = it; }

  #genAsyncMethods = false;

  // private field reflection only
  __genAsyncMethods(it) { if (it === undefined) return this.#genAsyncMethods; else this.#genAsyncMethods = it; }

  #types = null;

  // private field reflection only
  __types(it) { if (it === undefined) return this.#types; else this.#types = it; }

  #nameToDir = null;

  // private field reflection only
  __nameToDir(it) { if (it === undefined) return this.#nameToDir; else this.#nameToDir = it; }

  #buf = null;

  // private field reflection only
  __buf(it) { if (it === undefined) return this.#buf; else this.#buf = it; }

  #numRewrote = 0;

  // private field reflection only
  __numRewrote(it) { if (it === undefined) return this.#numRewrote; else this.#numRewrote = it; }

  name() {
    return "gen-fantom";
  }

  summary() {
    return "Compile xeto specs into Fantom source code";
  }

  run() {
    this.init();
    this.mapNameToDir();
    this.parseBuildFile();
    this.readInputs();
    this.genTypes();
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Rewrote ", sys.ObjUtil.coerce(this.#numRewrote, sys.Obj.type$.toNullable())), " files"));
    return 0;
  }

  init() {
    if ((this.#buildFile == null || !this.#buildFile.exists())) {
      throw sys.Err.make(sys.Str.plus("Build file not found: ", this.#buildFile));
    }
    ;
    let srcDir = this.#buildFile.parent();
    if (!srcDir.plus(sys.Uri.fromStr("build.fan")).exists()) {
      throw sys.Err.make(sys.Str.plus("Expecting build.fan in ", srcDir));
    }
    ;
    this.#outDir = srcDir.plus(sys.Uri.fromStr("fan/"));
    return;
  }

  mapNameToDir() {
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::File"));
    this.doMapNameToDir(acc, sys.ObjUtil.coerce(this.#outDir, sys.File.type$));
    this.#nameToDir = acc;
    return;
  }

  doMapNameToDir(acc,dir) {
    const this$ = this;
    dir.list().each((kid) => {
      if (kid.isDir()) {
        this$.doMapNameToDir(acc, kid);
      }
      else {
        if (sys.ObjUtil.equals(kid.ext(), "fan")) {
          acc.set(kid.basename(), dir);
        }
        ;
      }
      ;
      return;
    });
    return;
  }

  dirForType(spec) {
    if (spec == null) {
      return sys.ObjUtil.coerce(this.#outDir, sys.File.type$);
    }
    ;
    let dir = this.#nameToDir.get(spec.name());
    if (dir != null) {
      return sys.ObjUtil.coerce(dir, sys.File.type$);
    }
    ;
    return this.dirForType(spec.base());
  }

  parseBuildFile() {
    this.#build = sys.ObjUtil.as(xeto.LibNamespace.system().compileData(this.#buildFile.readAllStr()), haystack.Dict.type$);
    if (this.#build == null) {
      throw sys.Err.make("Root of build file must be a dict");
    }
    ;
    this.#genSetters = sys.ObjUtil.coerce(((this$) => { let $_u3 = sys.ObjUtil.as(this$.#build.get("setters"), sys.Bool.type$); if ($_u3 != null) return $_u3; return sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()); })(this), sys.Bool.type$);
    this.#genDicts = sys.ObjUtil.coerce(((this$) => { let $_u4 = sys.ObjUtil.as(this$.#build.get("dicts"), sys.Bool.type$); if ($_u4 != null) return $_u4; return sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()); })(this), sys.Bool.type$);
    this.#genAsyncMethods = sys.ObjUtil.coerce(((this$) => { let $_u5 = sys.ObjUtil.as(this$.#build.get("asyncMethods"), sys.Bool.type$); if ($_u5 != null) return $_u5; return sys.ObjUtil.coerce(false, sys.Bool.type$.toNullable()); })(this), sys.Bool.type$);
    return;
  }

  readInputs() {
    const this$ = this;
    let repo = xeto.LibRepo.cur();
    let libNames = ((this$) => { let $_u6 = sys.ObjUtil.as(this$.#build.get("libs"), sys.Type.find("sys::List")); if ($_u6 != null) return $_u6; throw sys.Err.make("Must define 'libs' as list of lib names"); })(this);
    let depends = libNames.map((n) => {
      return sys.ObjUtil.coerce(xeto.LibDepend.make(sys.ObjUtil.coerce(n, sys.Str.type$)), xeto.LibDepend.type$);
    }, xeto.LibDepend.type$);
    let versions = repo.solveDepends(sys.ObjUtil.coerce(depends, sys.Type.find("xeto::LibDepend[]")));
    let ns = repo.createNamespace(versions);
    let types = sys.List.make(xeto.Spec.type$);
    libNames.each((libName) => {
      let lib = ns.lib(sys.ObjUtil.coerce(libName, sys.Str.type$));
      lib.types().each((type) => {
        if (this$.includeType(type)) {
          types.add(type);
        }
        ;
        return;
      });
      return;
    });
    this.#types = types.sort();
    return;
  }

  includeType(type) {
    if (sys.Str.startsWith(type.name(), "_")) {
      return false;
    }
    ;
    return true;
  }

  genTypes() {
    const this$ = this;
    this.#types.each((type) => {
      this$.genType(type);
      return;
    });
    return;
  }

  genType(type) {
    if (type.metaOwn().has("nogen")) {
      return;
    }
    ;
    let name = type.name();
    let file = this.dirForType(type).plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", name), ".fan")));
    this.genOpen();
    this.genTypeBody(type);
    this.genClose(file);
    return;
  }

  genTypeBody(type) {
    if (type.isEnum()) {
      return this.genTypeEnum(type);
    }
    ;
    this.genTypeMixin(type);
    this.genTypeDict(type);
    return;
  }

  hasDict(type) {
    return (this.#genDicts && type.missing("abstract"));
  }

  genTypeHeader(type) {
    this.w("**").nl();
    this.fandoc(type, 0);
    this.w("**").nl();
    if (type.meta().has("nodoc")) {
      this.w("@NoDoc ");
    }
    ;
    this.w("@Js").nl();
    return;
  }

  genTypeEnum(type) {
    const this$ = this;
    this.genTypeHeader(type);
    this.w("enum class ").w(type.name()).nl();
    this.w("{").nl();
    let first = true;
    type.slotsOwn().each((slot) => {
      if (first) {
        (first = false);
      }
      else {
        this$.w(",").nl().nl();
      }
      ;
      this$.fandoc(slot, 2);
      this$.w("  ").w(slot.name());
      return;
    });
    this.nl().w("}").nl();
    return;
  }

  genTypeMixin(type) {
    const this$ = this;
    let name = type.name();
    let baseName = type.base().name();
    let isConst = type.meta().missing("genNonConst");
    this.genTypeHeader(type);
    if (isConst) {
      this.w("const ");
    }
    ;
    this.w("mixin ").w(name).w(" : ").w(baseName).nl();
    this.w("{").nl();
    this.nl();
    if (this.hasDict(type)) {
      this.w("  ** Constructor to wrap dict data").nl();
      this.w("  static new makeDict(Dict dict)").nl();
      this.w("  {").nl();
      this.w("    ").w(name).w("Dict(dict)").nl();
      this.w("  }").nl();
      this.nl();
    }
    ;
    type.slotsOwn().each((slot) => {
      if (this$.includeSlot(slot)) {
        this$.genSlot(slot);
      }
      ;
      return;
    });
    this.w("}").nl();
    return;
  }

  genTypeDict(type) {
    if (!this.hasDict(type)) {
      return;
    }
    ;
    let name = type.name();
    this.section(sys.Str.plus(sys.Str.plus("", name), "Dict"), 42);
    this.w("**").nl();
    this.w(sys.Str.plus("** Dict implementation for ", name)).nl();
    this.w("**").nl();
    this.w("@NoDoc @Js").nl();
    this.w("const class ").w(name).w("Dict").w(": WrapDict, ").w(name).nl();
    this.w("{").nl();
    this.w("  new make(Dict dict) : super(dict) {}").nl();
    this.w("}").nl();
    return;
  }

  includeSlot(slot) {
    if (slot.type().isMarker()) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(slot.name(), "id")) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(slot.name(), "dis")) {
      return false;
    }
    ;
    return true;
  }

  genSlot(slot) {
    this.fandoc(slot, 2);
    if (slot.type().isFunc()) {
      this.genMethod(slot);
    }
    else {
      if ((this.#genSetters && slot.missing("readonly"))) {
        this.genField(slot);
      }
      else {
        this.genGetter(slot);
      }
      ;
    }
    ;
    this.nl();
    return;
  }

  genField(slot) {
    this.w("  ").slotFacets(slot).w("virtual ").slotTypeSig(slot).sp().w(slot.name()).nl();
    this.w("  {").nl();
    this.w("    get { get(\"").w(slot.name()).w("\") }").nl();
    this.w("    set { set(\"").w(slot.name()).w("\", it) }").nl();
    this.w("  }").nl();
    return;
  }

  genGetter(slot) {
    this.w("  ").slotFacets(slot).w("virtual ").slotTypeSig(slot).sp().w(slot.name()).w("()").nl();
    this.w("  {").nl();
    this.w("    get(\"").w(slot.name()).w("\")").nl();
    this.w("  }").nl();
    return;
  }

  genMethod(slot) {
    const this$ = this;
    let isAsync = this.#genAsyncMethods;
    let returns = slot.slot("returns");
    this.w("  ").slotFacets(slot).w("virtual ");
    if (isAsync) {
      this.w("Void");
    }
    else {
      this.slotTypeSig(sys.ObjUtil.coerce(returns, xeto.Spec.type$));
    }
    ;
    this.sp().w(slot.name());
    this.w("(");
    let paramNames = sys.List.make(sys.Str.type$);
    this.eachParam(slot, (param,i) => {
      paramNames.add(param.name());
      this$.comma().slotTypeSig(param).w(" ").w(param.name());
      return;
    });
    if (isAsync) {
      this.comma().w("|Err?, ").slotTypeSig(sys.ObjUtil.coerce(returns, xeto.Spec.type$), true).w("| cb");
    }
    ;
    this.w(")").nl();
    let callName = ((this$) => { if (isAsync) return "callAsync"; return "call"; })(this);
    let args = ((this$) => { if (paramNames.isEmpty()) return ","; return paramNames.join(", "); })(this);
    let cbArg = ((this$) => { if (isAsync) return ", cb"; return ""; })(this);
    this.w("  {").nl();
    this.w("    ").w(callName).w("(\"").w(slot.name()).w("\", [").w(args).w("]").w(cbArg).w(")").nl();
    this.w("  }").nl();
    return;
  }

  eachParam(slot,f) {
    const this$ = this;
    let i = 0;
    slot.slots().each((x) => {
      if (sys.ObjUtil.compareNE(x.name(), "returns")) {
        sys.Func.call(f, x, sys.ObjUtil.coerce(((this$) => { let $_u10 = i;i = sys.Int.increment(i); return $_u10; })(this$), sys.Obj.type$.toNullable()));
      }
      ;
      return;
    });
    return;
  }

  slotFacets(slot) {
    if (slot.has("nodoc")) {
      this.w("@NoDoc ");
    }
    ;
    return this;
  }

  slotTypeSig(slot,forceMaybe) {
    if (forceMaybe === undefined) forceMaybe = false;
    if (slot.type().isList()) {
      let of$ = slot.of();
      if (sys.Str.startsWith(of$.name(), "_")) {
        (of$ = slot.lib().type(of$.name()).base());
      }
      ;
      this.slotTypeSig(sys.ObjUtil.coerce(of$, xeto.Spec.type$)).w("[]");
    }
    else {
      this.w(slot.type().name());
    }
    ;
    if ((slot.isMaybe() || forceMaybe)) {
      this.w("?");
    }
    ;
    return this;
  }

  fandoc(spec,indent) {
    const this$ = this;
    let doc = sys.ObjUtil.as(spec.get("doc"), sys.Str.type$);
    if (doc == null) {
      return this;
    }
    ;
    let lines = sys.Str.splitLines(doc);
    lines.each((line) => {
      this$.w(sys.Str.spaces(indent)).w("** ").w(line).nl();
      return;
    });
    return this;
  }

  section(title,char) {
    const this$ = this;
    this.nl();
    sys.Int.times(75, (it) => {
      this$.#buf.addChar(char);
      return;
    });
    this.nl();
    this.w("** ").w(title).nl();
    sys.Int.times(75, (it) => {
      this$.#buf.addChar(char);
      return;
    });
    this.nl();
    this.nl();
    return this;
  }

  w(x) {
    this.#buf.add(x);
    return this;
  }

  sp() {
    this.#buf.addChar(32);
    return this;
  }

  nl() {
    this.#buf.addChar(10);
    return this;
  }

  comma() {
    if (sys.ObjUtil.compareNE(this.#buf.get(-1), 40)) {
      this.#buf.add(", ");
    }
    ;
    return this;
  }

  genOpen() {
    this.#buf = sys.StrBuf.make();
    this.w("using haystack").nl();
    this.nl();
    return;
  }

  genClose(file) {
    let newBody = this.#buf.toStr();
    if (!this.isChanged(file, newBody)) {
      return;
    }
    ;
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Gen [", file.osPath()), "]"));
    ((this$) => { let $_u11 = this$.#numRewrote;this$.#numRewrote = sys.Int.increment(this$.#numRewrote); return $_u11; })(this);
    let out = file.out();
    out.printLine(sys.Str.plus("// Auto generated ", sys.Date.today().toLocale()));
    out.printLine();
    out.print(newBody);
    out.close();
    return;
  }

  isChanged(file,newBody) {
    if (!file.exists()) {
      return true;
    }
    ;
    let lines = file.readAllLines();
    if (sys.ObjUtil.compareLT(lines.size(), 4)) {
      return true;
    }
    ;
    if (!sys.Str.isEmpty(sys.Str.trim(lines.get(1)))) {
      return true;
    }
    ;
    let oldBody = lines.getRange(sys.Range.make(2, -1)).join("\n");
    return sys.ObjUtil.compareNE(sys.Str.trim(oldBody), sys.Str.trim(newBody));
  }

  static make() {
    const $self = new GenFantom();
    GenFantom.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class AbstractGenCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
    this.#ts = sys.DateTime.now().toLocale("DD-MMM-YYYY");
    return;
  }

  typeof() { return AbstractGenCmd.type$; }

  #ts = null;

  // private field reflection only
  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  write(uri,cb) {
    let buf = sys.StrBuf.make();
    let out = buf.out();
    out.printLine("//");
    out.printLine("// Copyright (c) 2011-2024, Project-Haystack");
    out.printLine("// Licensed under the Academic Free License version 3.0");
    out.printLine(sys.Str.plus("// Auto-generated ", this.#ts));
    out.printLine("//");
    out.printLine();
    sys.Func.call(cb, out);
    let contents = buf.toStr();
    let file = this.outDir().plus(uri);
    if (AbstractGenCmd.isFileChanged(file, contents)) {
      this.info(sys.Str.plus(sys.Str.plus("write [", file.osPath()), "]"));
      file.out().print(contents).close();
    }
    else {
      this.info(sys.Str.plus(sys.Str.plus(" skip [", file.osPath()), "]"));
    }
    ;
    return;
  }

  static isFileChanged(file,newContents) {
    if (!file.exists()) {
      return true;
    }
    ;
    let oldContents = file.readAllStr();
    let tsLine = 3;
    let newLines = sys.Str.splitLines(sys.Str.trim(newContents));
    let oldLines = sys.Str.splitLines(sys.Str.trim(oldContents));
    if (!sys.Str.contains(newLines.get(tsLine), "Auto-generated")) {
      throw sys.Err.make();
    }
    ;
    newLines.removeRange(sys.Range.make(0, tsLine));
    oldLines.removeRange(sys.Range.make(0, tsLine));
    return sys.ObjUtil.compareNE(newLines, oldLines);
  }

  writeDoc(out,$def) {
    const this$ = this;
    let doc = ((this$) => { let $_u12 = sys.ObjUtil.as($def.get("doc"), sys.Str.type$); if ($_u12 != null) return $_u12; return $def.name(); })(this);
    sys.Str.splitLines(doc).each((line) => {
      out.printLine(sys.Str.trimEnd(sys.Str.plus("// ", line)));
      return;
    });
    return;
  }

  info(msg) {
    sys.ObjUtil.echo(msg);
    return;
  }

  normEnumName(name) {
    if ((sys.Str.startsWith(name, "L") && sys.Int.isDigit(sys.Str.get(name, 1)))) {
      (name = sys.Str.plus("p", name));
    }
    ;
    (name = sys.Str.replace(name, "-", " "));
    (name = sys.Str.replace(name, "/", " "));
    return haystack.Etc.toTagName(name);
  }

  static make() {
    const $self = new AbstractGenCmd();
    AbstractGenCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    ;
    return;
  }

}

class GenPH extends AbstractGenCmd {
  constructor() {
    super();
    const this$ = this;
    this.#outDir = sys.Env.cur().workDir().plus(sys.Uri.fromStr("../xeto/src/xeto/ph/")).normalize();
    this.#defSymbol = sys.ObjUtil.coerce(haystack.Symbol.fromStr("def"), haystack.Symbol.type$);
    return;
  }

  typeof() { return GenPH.type$; }

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

  #defSymbol = null;

  // private field reflection only
  __defSymbol(it) { if (it === undefined) return this.#defSymbol; else this.#defSymbol = it; }

  #ns = null;

  // private field reflection only
  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #ph = null;

  // private field reflection only
  __ph(it) { if (it === undefined) return this.#ph; else this.#ph = it; }

  #multiRefs$Store = undefined;

  // private field reflection only
  __multiRefs$Store(it) { if (it === undefined) return this.#multiRefs$Store; else this.#multiRefs$Store = it; }

  name() {
    return "gen-ph";
  }

  summary() {
    return "Compile haystack defs into xeto ph lib";
  }

  run() {
    this.checkInputs();
    this.compileNamespace();
    this.writeLib();
    this.writeTags();
    this.writeEntities();
    this.writeEnums();
    this.writeChoices();
    this.writeFeatureDefs();
    return 0;
  }

  checkInputs() {
    if (!this.outDir().plus(sys.Uri.fromStr("kinds.xeto")).exists()) {
      throw sys.Err.make(sys.Str.plus("Invalid outDir: ", this.outDir()));
    }
    ;
    return;
  }

  compileNamespace() {
    this.#ns = defc.DefCompiler.make().compileNamespace();
    this.#ph = this.#ns.lib("ph");
    return;
  }

  writeLib() {
    const this$ = this;
    this.write(sys.Uri.fromStr("lib.xeto"), (out) => {
      out.printLine("pragma: Lib <\n  doc: \"Project haystack core library\"\n  version: \"0.1.1\"\n  depends: {\n    { lib: \"sys\", versions: \"0.1.x\" }\n  }\n  org: {\n   dis: \"Project Haystack\"\n   uri: \"https://project-haystack.org/\"\n  }\n>");
      return;
    });
    return;
  }

  writeTags() {
    const this$ = this;
    let tags = sys.List.make(haystack.Def.type$);
    this.#ns.eachDef(($def) => {
      if ($def.symbol().type().isTag()) {
        tags.add($def);
      }
      ;
      return;
    });
    tags.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    this.write(sys.Uri.fromStr("tags.xeto"), (out) => {
      tags.each(($def) => {
        let name = $def.name();
        let kind = this$.#ns.defToKind($def);
        let type = this$.toTagType($def);
        let meta = this$.toTagMeta($def, kind);
        if (this$.excludeTag($def, kind)) {
          return;
        }
        ;
        this$.writeDoc(out, $def);
        out.printLine(sys.Str.trim(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), ": "), type), " "), meta)));
        out.printLine();
        return;
      });
      return;
    });
    return;
  }

  excludeTag($def,kind) {
    let n = $def.name();
    if (sys.ObjUtil.equals(n, sys.Str.decapitalize(kind.name()))) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "doc")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "is")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "mandatory")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "notInherited")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "tagOn")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "transient")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "depends")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "relationship")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "inputs")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "outputs")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "contains")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "containedBy")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "association")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "quantities")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "quantityOf")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "tagOn")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "tags")) {
      return true;
    }
    ;
    if (this.isAbstract($def.name())) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(((this$) => { let $_u13 = this$.#ns.supertypes($def).first(); if ($_u13 == null) return null; return this$.#ns.supertypes($def).first().name(); })(this), "choice")) {
      return true;
    }
    ;
    return false;
  }

  toTagType(tag) {
    if ((tag.has("enum") && this.#ns.fits(tag, sys.ObjUtil.coerce(this.#ns.def("str"), haystack.Def.type$)))) {
      return this.toEnumTypeName(tag);
    }
    ;
    if ((sys.Str.endsWith(tag.name(), "Ref") && this.multiRefs().contains(tag.name()))) {
      return "MultiRef";
    }
    ;
    if (sys.ObjUtil.equals(tag.name(), "version")) {
      return "Version";
    }
    ;
    return this.#ns.defToKind(tag).name();
  }

  multiRefs() {
    if (this.#multiRefs$Store === undefined) {
      this.#multiRefs$Store = this.multiRefs$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#multiRefs$Store, sys.Type.find("sys::Str[]"));
  }

  toEnumTypeName(tag) {
    if (sys.ObjUtil.equals(tag.name(), "tz")) {
      return "TimeZone";
    }
    ;
    if (sys.ObjUtil.equals(tag.name(), "weatherCond")) {
      return "WeatherCondEnum";
    }
    ;
    if (sys.ObjUtil.equals(tag.name(), "daytime")) {
      return "WeatherDaytimeEnum";
    }
    ;
    return sys.Str.capitalize(tag.name());
  }

  toChoiceTypeName($def) {
    return sys.Str.capitalize(xetoEnv.XetoUtil.dottedToCamel($def.name(), 45));
  }

  toTagMeta($def,kind) {
    if (kind.isList()) {
      let of$ = $def.get("of");
      if (of$ != null) {
        let ofName = sys.Str.capitalize(sys.ObjUtil.toStr(of$));
        if (sys.ObjUtil.equals(ofName, "Unit")) {
          (ofName = "Str");
        }
        ;
        if (sys.ObjUtil.equals(ofName, "Phenomenon")) {
          return "";
        }
        ;
        if (sys.ObjUtil.equals(ofName, "MlVarRef")) {
          (ofName = "Ref<of:MlVar>");
        }
        ;
        return sys.Str.plus(sys.Str.plus("<of:", ofName), ">");
      }
      ;
    }
    ;
    if (sys.ObjUtil.equals($def.name(), "area")) {
      return "<quantity:\"area\">";
    }
    ;
    if (kind.isRef()) {
      let of$ = ((this$) => { let $_u14 = $def.get("of"); if ($_u14 == null) return null; return sys.ObjUtil.toStr($def.get("of")); })(this);
      if ((of$ != null && !sys.Str.endsWith(of$, "-output"))) {
        return sys.Str.plus(sys.Str.plus("<of:", sys.Str.capitalize(xetoEnv.XetoUtil.dottedToCamel(sys.Str.toStr(of$), 45))), ">");
      }
      ;
    }
    ;
    return "";
  }

  writeEntities() {
    const this$ = this;
    let entityDef = this.#ns.def("entity");
    let entities = this.#ns.findDefs(($def) => {
      return this$.#ns.fits($def, sys.ObjUtil.coerce(entityDef, haystack.Def.type$));
    });
    entities.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    entities.removeSame(sys.ObjUtil.coerce(entityDef, haystack.Def.type$));
    this.write(sys.Uri.fromStr("entities.xeto"), (out) => {
      entities.each(($def) => {
        if (this$.excludeEntity($def)) {
          return;
        }
        ;
        this$.writeDoc(out, $def);
        let name = this$.toEntityName($def);
        let type = this$.toEntityType($def);
        out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), ": "), type));
        this$.writeEntityMeta(out, $def);
        out.printLine(" {");
        this$.writeEntityUsage(out, $def);
        this$.writeEntitySlots(out, $def);
        out.printLine("}");
        out.printLine();
        return;
      });
      return;
    });
    return;
  }

  toEntityName($def) {
    const this$ = this;
    let symbol = $def.symbol();
    if (symbol.type().isTag()) {
      return sys.Str.capitalize($def.name());
    }
    ;
    let s = sys.StrBuf.make();
    $def.symbol().eachPart((n) => {
      s.add(sys.Str.capitalize(n));
      return;
    });
    return s.toStr();
  }

  toEntityType($def) {
    if (sys.ObjUtil.equals($def.name(), "entity")) {
      return "Dict";
    }
    ;
    let supers = sys.ObjUtil.as($def.get("is"), sys.Type.find("haystack::Symbol[]"));
    return this.toEntityName(sys.ObjUtil.coerce(this.#ns.def(supers.first().toStr()), haystack.Def.type$));
  }

  writeEntityMeta(out,entity) {
    let symbol = entity.symbol();
    let name = symbol.name();
    let special = (sys.ObjUtil.equals(name, "space") || sys.ObjUtil.equals(name, "equip") || sys.ObjUtil.equals(name, "point") || sys.Str.endsWith(name, "-point"));
    if ((!this.isAbstract(name) && !special)) {
      return;
    }
    ;
    out.print(" <abstract>");
    return;
  }

  writeEntityUsage(out,entity) {
    const this$ = this;
    let symbol = entity.symbol();
    let name = symbol.name();
    if (this.isAbstract(name)) {
      return;
    }
    ;
    if (symbol.type().isTag()) {
      out.printLine(sys.Str.plus("  ", symbol));
      return;
    }
    else {
      let bases = this.#ns.supertypes(entity).findAll((x) => {
        return this$.#ns.fits(x, sys.ObjUtil.coerce(this$.#ns.def("entity"), haystack.Def.type$));
      });
      symbol.eachPart((part) => {
        if (bases.any((it) => {
          return it.symbol().hasTermName(part);
        })) {
          return;
        }
        ;
        out.printLine(sys.Str.plus("  ", part));
        return;
      });
    }
    ;
    return;
  }

  excludeEntity($def) {
    return (sys.ObjUtil.equals($def.name(), "pointGroup") || sys.ObjUtil.equals(this.#ns.supertypes($def).first().name(), "pointGroup"));
  }

  isAbstract(name) {
    return (sys.ObjUtil.equals(name, "airHandlingEquip") || sys.ObjUtil.equals(name, "airTerminalUnit") || sys.ObjUtil.equals(name, "conduit") || sys.ObjUtil.equals(name, "coil") || sys.ObjUtil.equals(name, "entity") || sys.ObjUtil.equals(name, "radiantEquip") || sys.ObjUtil.equals(name, "verticalTransport") || sys.ObjUtil.equals(name, "pointGroup") || sys.ObjUtil.equals(name, "hvacZonePoints") || sys.ObjUtil.equals(name, "lightingZonePoints") || sys.ObjUtil.equals(name, "airQualityZonePoints") || sys.ObjUtil.equals(name, "phenomenon") || sys.ObjUtil.equals(name, "substance") || sys.ObjUtil.equals(name, "fluid") || sys.ObjUtil.equals(name, "liquid") || sys.ObjUtil.equals(name, "gas") || sys.ObjUtil.equals(name, "airQuality"));
  }

  writeEntitySlots(out,entity) {
    const this$ = this;
    let tags = sys.List.make(haystack.Def.type$);
    let maxNameSize = 2;
    if (sys.ObjUtil.equals(entity.name(), "equip")) {
      (maxNameSize = 12);
    }
    ;
    this.#ns.tags(entity).each((tag) => {
      if (this$.isInherited(entity, tag)) {
        return;
      }
      ;
      tags.add(tag);
      (maxNameSize = sys.Int.max(maxNameSize, sys.Str.size(tag.name())));
      return;
    });
    tags.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    tags.each((tag) => {
      this$.writeEntitySlot(out, tag.name(), maxNameSize, this$.toSlotType(entity, tag));
      return;
    });
    if (sys.ObjUtil.equals(entity.name(), "equip")) {
      this.writeEntitySlot(out, "parentEquips", maxNameSize, "Query<of:Point, via:\"equipRef+\">                  // Parent equips that contain this point");
    }
    ;
    if (sys.ObjUtil.equals(entity.name(), "equip")) {
      this.writeEntitySlot(out, "childEquips", maxNameSize, "Query<of:Point, inverse:\"ph::Equip.parentEquips\"> // Sub-equips contained by this equip");
    }
    ;
    if (sys.ObjUtil.equals(entity.name(), "equip")) {
      this.writeEntitySlot(out, "points", maxNameSize, "Query<of:Point, inverse:\"ph::Point.equips\">       // Points contained by this equip");
    }
    ;
    if (sys.ObjUtil.equals(entity.name(), "point")) {
      this.writeEntitySlot(out, "equips", maxNameSize, "Query<of:Equip, via:\"equipRef+\">  // Parent equips that contain this point");
    }
    ;
    return;
  }

  toSlotType(entity,tag) {
    let type = this.toTagType(tag);
    if (this.#ns.fitsChoice(tag)) {
      (type = this.toChoiceTypeName(tag));
    }
    ;
    if (this.isOptional(entity, tag)) {
      type = sys.Str.plus(type, "?");
    }
    ;
    if (sys.ObjUtil.equals(entity.name(), "airHandlingEquip")) {
      if ((sys.ObjUtil.equals(tag.name(), "heatingProcess") || sys.ObjUtil.equals(tag.name(), "coolingProcess"))) {
        type = sys.Str.plus(type, " <multiChoice>");
      }
      ;
    }
    ;
    return type;
  }

  writeEntitySlot(out,name,maxNameSize,sig) {
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", name), ": "), sys.Str.spaces(sys.Int.minus(maxNameSize, sys.Str.size(sys.Str.toStr(name))))), sig));
    return;
  }

  isOptional(entity,tag) {
    if (sys.ObjUtil.equals(tag.name(), "id")) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(entity.name(), "point")) {
      if (sys.ObjUtil.equals(tag.name(), "kind")) {
        return false;
      }
      ;
      return true;
    }
    ;
    if (sys.ObjUtil.equals(tag.name(), "siteRef")) {
      return false;
    }
    ;
    return true;
  }

  isInherited(entity,tag) {
    let on = sys.ObjUtil.as(tag.get("tagOn"), sys.Type.find("haystack::Symbol[]"));
    return !on.contains(entity.symbol());
  }

  writeEnums() {
    const this$ = this;
    let enums = sys.List.make(haystack.Def.type$);
    this.#ns.eachDef(($def) => {
      if ($def.missing("enum")) {
        return;
      }
      ;
      if ((sys.ObjUtil.equals($def.name(), "tz") || sys.ObjUtil.equals($def.name(), "unit"))) {
        return;
      }
      ;
      if (!$def.symbol().type().isTag()) {
        return;
      }
      ;
      enums.add($def);
      return;
    });
    enums.sort((a,b) => {
      return sys.ObjUtil.compare(this$.toEnumTypeName(a), this$.toEnumTypeName(b));
    });
    this.write(sys.Uri.fromStr("enums.xeto"), (out) => {
      enums.each(($def) => {
        this$.writeEnum(out, $def);
        return;
      });
      return;
    });
    return;
  }

  writeEnum(out,$def) {
    const this$ = this;
    let docAbove = false;
    let nameAndMetas = sys.List.make(sys.Str.type$);
    let docs = sys.List.make(sys.Str.type$);
    let maxNameAndMetaSize = 2;
    def.DefUtil.parseEnum($def.get("enum")).each((item) => {
      let name = sys.ObjUtil.coerce(item.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
      let nameAndMeta = name;
      if (!haystack.Etc.isTagName(name)) {
        (nameAndMeta = sys.Str.plus(this$.normEnumName(name), sys.Str.plus(sys.Str.plus(" <key:", sys.Str.toCode(name)), ">")));
      }
      ;
      let doc = ((this$) => { let $_u15 = sys.ObjUtil.as(item.get("doc"), sys.Str.type$); if ($_u15 != null) return $_u15; return ""; })(this$);
      if (sys.Str.contains(doc, "\n")) {
        (docAbove = true);
      }
      ;
      nameAndMetas.add(nameAndMeta);
      docs.add(sys.ObjUtil.coerce(doc, sys.Str.type$));
      (maxNameAndMetaSize = sys.Int.max(maxNameAndMetaSize, sys.Str.size(nameAndMeta)));
      return;
    });
    this.writeDoc(out, $def);
    let name = this.toEnumTypeName($def);
    out.printLine(sys.Str.plus(sys.Str.plus("", name), ": Enum {"));
    nameAndMetas.each((nameAndMeta,i) => {
      let doc = docs.get(i);
      if ((!sys.Str.isEmpty(doc) && docAbove)) {
        sys.Str.splitLines(doc).each((line) => {
          out.printLine(sys.Str.trimEnd(sys.Str.plus("  // ", line)));
          return;
        });
      }
      ;
      out.print(sys.Str.plus("  ", nameAndMeta));
      if ((!sys.Str.isEmpty(doc) && !docAbove)) {
        out.print(sys.Str.spaces(sys.Int.minus(maxNameAndMetaSize, sys.Str.size(sys.Str.toStr(nameAndMeta))))).print("  // ").print(doc);
      }
      ;
      out.printLine();
      if ((docAbove && sys.ObjUtil.compareLT(sys.Int.plus(i, 1), nameAndMetas.size()))) {
        out.printLine();
      }
      ;
      return;
    });
    out.printLine("}");
    out.printLine();
    return;
  }

  writeChoices() {
    const this$ = this;
    let choices = this.#ns.subtypes(sys.ObjUtil.coerce(this.#ns.def("choice"), haystack.Def.type$));
    choices.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    this.write(sys.Uri.fromStr("choices.xeto"), (out) => {
      choices.each(($def) => {
        this$.writeChoice(out, $def);
        return;
      });
      return;
    });
    this.writeChoiceTaxonomy(sys.ObjUtil.coerce(this.#ns.def("phenomenon"), haystack.Def.type$));
    this.writeChoiceTaxonomy(sys.ObjUtil.coerce(this.#ns.def("quantity"), haystack.Def.type$));
    return;
  }

  writeChoice(out,$def) {
    const this$ = this;
    let specName = this.toChoiceTypeName($def);
    let baseName = "Choice";
    let suffix = "";
    let $_u16 = specName;
    if (sys.ObjUtil.equals($_u16, "AhuZoneDelivery")) {
      (suffix = "Ahu");
    }
    else if (sys.ObjUtil.equals($_u16, "ChillerMechanism")) {
      (suffix = "Chiller");
    }
    else if (sys.ObjUtil.equals($_u16, "DuctSection")) {
      (suffix = "Duct");
    }
    else if (sys.ObjUtil.equals($_u16, "PipeSection")) {
      (suffix = "Pipe");
    }
    else if (sys.ObjUtil.equals($_u16, "VavAirCircuit")) {
      (suffix = "Vav");
    }
    else if (sys.ObjUtil.equals($_u16, "VavModulation")) {
      (suffix = "Vav");
    }
    ;
    let section = "//////////////////////////////////////////////////////////////////////////";
    out.printLine(section);
    out.printLine(sys.Str.plus("// ", specName));
    out.printLine(section);
    out.printLine();
    let of$ = $def.get("of");
    if (of$ != null) {
      (baseName = this.toChoiceTypeName(sys.ObjUtil.coerce(this.#ns.def(sys.ObjUtil.toStr(of$)), haystack.Def.type$)));
    }
    ;
    this.writeDoc(out, $def);
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("", specName), ": "), baseName));
    out.printLine();
    if (of$ != null) {
      return;
    }
    ;
    this.#ns.subtypes($def).each((sub) => {
      let tag = ((this$) => { if (sub.symbol().type().isConjunct()) return sub.symbol().part(1); return sub.name(); })(this$);
      let subName = sys.Str.plus(sys.Str.capitalize(tag), suffix);
      this$.writeDoc(out, sub);
      out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", subName), ": "), specName), " { "), tag), " }"));
      out.printLine();
      return;
    });
    return;
  }

  writeChoiceTaxonomy($def) {
    const this$ = this;
    this.write(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", $def.name()), ".xeto")), (out) => {
      this$.writeChoiceTaxonomyLevel(out, $def, "Choice");
      return;
    });
    return;
  }

  writeChoiceTaxonomyLevel(out,$def,baseName) {
    const this$ = this;
    let specName = this.toChoiceTypeName($def);
    let tags = this.toChoiceTaxonomyTags($def);
    this.writeDoc(out, $def);
    out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus("", specName), ": "), baseName));
    if (tags != null) {
      out.print(sys.Str.plus(sys.Str.plus(" { ", tags), " }"));
    }
    ;
    out.printLine();
    out.printLine();
    let subtypes = this.#ns.subtypes($def);
    subtypes.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    subtypes.each((sub) => {
      this$.writeChoiceTaxonomyLevel(out, sub, specName);
      return;
    });
    return;
  }

  toChoiceTaxonomyTags($def) {
    let sym = $def.symbol();
    if (sym.type().isTag()) {
      let name = sym.name();
      if (this.isAbstract(name)) {
        return null;
      }
      ;
      return name;
    }
    ;
    let part1 = $def.symbol().part(0);
    let part2 = $def.symbol().part(1);
    let supertype = this.#ns.supertypes($def).first();
    if (this.#ns.fits(sys.ObjUtil.coerce(supertype, haystack.Def.type$), sys.ObjUtil.coerce(this.#ns.def(part1), haystack.Def.type$))) {
      return part2;
    }
    ;
    if (this.#ns.fits(sys.ObjUtil.coerce(supertype, haystack.Def.type$), sys.ObjUtil.coerce(this.#ns.def(part2), haystack.Def.type$))) {
      return part1;
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", part1), ", "), part2);
  }

  writeFeatureDefs() {
    const this$ = this;
    this.write(sys.Uri.fromStr("filetypes.xeto"), (out) => {
      out.printLine("// File format type definition\nFiletype: Feature {\n  filetype         // Filetype marker\n  fileExt:   Str?  // Filename extension such as \"csv\"\n  mime:      Str?  // Mime type formatted as \"type/subtype\"\n  wikipedia: Uri?  // Wikipedia link\n}\n");
      this$.#ns.filetypes().each((x) => {
        this$.writeFeatureInstance(out, x);
        return;
      });
      return;
    });
    this.write(sys.Uri.fromStr("ops.xeto"), (out) => {
      out.printLine("// Operation for HTTP API.  See `docHaystack::Ops` chapter.\nOp: Feature {\n  // Op marker\n  op\n\n  // Marks a function or operation as having no side effects.  The function\n  // may or may not be *pure* in that calling it multiple times with the\n  // same arguments always evaluates to the same result.\n  noSideEffects: Marker?\n}\n");
      this$.#ns.feature("op").defs().sort().each((x) => {
        this$.writeFeatureInstance(out, x);
        return;
      });
      return;
    });
    return;
  }

  writeFeatureType(out,$def) {
    let type = sys.Str.capitalize($def.name());
    let tags = this.#ns.tags($def);
    this.writeDoc(out, $def);
    out.printLine(sys.Str.plus(sys.Str.plus("", type), ": Feature {"));
    this.writeEntitySlots(out, $def);
    out.printLine("}");
    out.printLine();
    return;
  }

  writeFeatureInstance(out,$def) {
    const this$ = this;
    let type = sys.Str.capitalize($def.symbol().part(0));
    this.writeDoc(out, $def);
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("@", $def.symbol()), " : "), type), " {"));
    let names = haystack.Etc.dictNames($def);
    names.removeAll(sys.List.make(sys.Str.type$, ["def", "lib", "is", "doc"]));
    names.sort();
    names.each((n) => {
      let v = $def.get(n);
      if (v === haystack.Marker.val()) {
        out.printLine(sys.Str.plus("  ", n));
      }
      else {
        out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", n), ": "), sys.Str.toCode(sys.ObjUtil.toStr(v))));
      }
      ;
      return;
    });
    out.printLine("}");
    out.printLine();
    return;
  }

  static make() {
    const $self = new GenPH();
    GenPH.make$($self);
    return $self;
  }

  static make$($self) {
    AbstractGenCmd.make$($self);
    ;
    return;
  }

  multiRefs$Once() {
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["systemRef"])), sys.Type.find("sys::Str[]"));
  }

}

class HelpCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
    this.#commandName = sys.List.make(sys.Str.type$);
    return;
  }

  typeof() { return HelpCmd.type$; }

  #commandName = null;

  commandName(it) {
    if (it === undefined) {
      return this.#commandName;
    }
    else {
      this.#commandName = it;
      return;
    }
  }

  name() {
    return "help";
  }

  aliases() {
    return sys.List.make(sys.Str.type$, ["-h", "-?"]);
  }

  summary() {
    return "Print listing of available commands";
  }

  run() {
    const this$ = this;
    if (sys.ObjUtil.compareGT(this.#commandName.size(), 0)) {
      let cmdName = this.#commandName.get(0);
      let cmd = XetoCmd.find(cmdName);
      if (cmd == null) {
        return this.err(sys.Str.plus(sys.Str.plus("Unknown help command '", cmdName), "'"));
      }
      ;
      this.printLine();
      let ret = cmd.usage();
      this.printLine();
      return ret;
    }
    ;
    let cmds = XetoCmd.list();
    let maxName = 4;
    cmds.each((cmd) => {
      (maxName = sys.Int.max(maxName, sys.Str.size(cmd.name())));
      return;
    });
    this.printLine();
    this.printLine("Xeto CLI Tools:");
    this.printLine();
    XetoCmd.list().each((cmd) => {
      this$.printLine(sys.Str.plus(sys.Str.plus(sys.Str.padr(cmd.name(), maxName), "  "), cmd.summary()));
      return;
    });
    this.printLine();
    return 0;
  }

  static make() {
    const $self = new HelpCmd();
    HelpCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    ;
    return;
  }

}

class EnvCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EnvCmd.type$; }

  name() {
    return "env";
  }

  summary() {
    return "Print environment and lib path info";
  }

  run() {
    let out = sys.Env.cur().out();
    out.printLine();
    util.AbstractMain.printProps(xeto.XetoEnv.cur().debugProps(), sys.Map.__fromLiteral(["out"], [out], sys.Type.find("sys::Str"), sys.Type.find("sys::OutStream")));
    out.printLine();
    return 0;
  }

  static make() {
    const $self = new EnvCmd();
    EnvCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class VersionCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return VersionCmd.type$; }

  name() {
    return "version";
  }

  aliases() {
    return sys.List.make(sys.Str.type$, ["-v"]);
  }

  summary() {
    return "Print version info";
  }

  run() {
    const this$ = this;
    let props = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj]"));
    util.AbstractMain.runtimeProps(props);
    let out = sys.Env.cur().out();
    out.printLine();
    out.printLine("Xeto CLI Tools");
    out.printLine(sys.Str.plus(sys.Str.plus("Copyright (c) 2022-", sys.ObjUtil.coerce(sys.Date.today().year(), sys.Obj.type$.toNullable())), ", SkyFoundry LLC"));
    out.printLine("Licensed under the Academic Free License version 3.0");
    out.printLine();
    util.AbstractMain.printProps(props, sys.Map.__fromLiteral(["out"], [out], sys.Type.find("sys::Str"), sys.Type.find("sys::OutStream")));
    out.printLine();
    util.AbstractMain.printProps(xeto.XetoEnv.cur().debugProps(), sys.Map.__fromLiteral(["out"], [out], sys.Type.find("sys::Str"), sys.Type.find("sys::OutStream")));
    out.printLine();
    return 0;
  }

  static make() {
    const $self = new VersionCmd();
    VersionCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class SrcLibCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SrcLibCmd.type$; }

  #all = false;

  all(it) {
    if (it === undefined) {
      return this.#all;
    }
    else {
      this.#all = it;
      return;
    }
  }

  #allIn = null;

  allIn(it) {
    if (it === undefined) {
      return this.#allIn;
    }
    else {
      this.#allIn = it;
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

  name() {
    return "build";
  }

  summary() {
    return "Compile xeto source to xetolib";
  }

  run() {
    const this$ = this;
    let repo = xeto.LibRepo.cur();
    if ((this.#libs == null && this.#allIn == null)) {
      this.#all = true;
    }
    ;
    if (this.#all) {
      this.#allIn = sys.Env.cur().workDir();
    }
    ;
    if (this.#allIn != null) {
      let vers = sys.List.make(xeto.LibVersion.type$);
      let inOsPath = this.#allIn.normalize().pathStr();
      repo.libs().each((libName) => {
        let ver = repo.latest(libName, false);
        if (ver == null) {
          return ver;
        }
        ;
        let f = ver.file(false);
        if ((f != null && ver.isSrc() && sys.Str.startsWith(f.normalize().pathStr(), inOsPath))) {
          vers.add(sys.ObjUtil.coerce(ver, xeto.LibVersion.type$));
        }
        ;
        return;
      });
      if (vers.isEmpty()) {
        this.printLine(sys.Str.plus(sys.Str.plus("ERROR: no libs found [", this.#allIn.osPath()), "]"));
        return 0;
      }
      ;
      return this.process(repo, vers);
    }
    ;
    if ((this.#libs == null || this.#libs.isEmpty())) {
      this.printLine("ERROR: no libs specified");
      return 1;
    }
    ;
    let vers = this.#libs.map((x) => {
      let ver = repo.latest(x, false);
      if ((ver == null || !ver.isSrc())) {
        throw sys.Err.make(sys.Str.plus("Lib src not available: ", x));
      }
      ;
      return sys.ObjUtil.coerce(ver, xeto.LibVersion.type$);
    }, xeto.LibVersion.type$);
    return this.process(repo, sys.ObjUtil.coerce(vers, sys.Type.find("xeto::LibVersion[]")));
  }

  static make() {
    const $self = new SrcLibCmd();
    SrcLibCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class BuildCmd extends SrcLibCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BuildCmd.type$; }

  name() {
    return "build";
  }

  summary() {
    return "Compile xeto source to xetolib";
  }

  process(repo,vers) {
    repo.build(vers);
    return 0;
  }

  static make() {
    const $self = new BuildCmd();
    BuildCmd.make$($self);
    return $self;
  }

  static make$($self) {
    SrcLibCmd.make$($self);
    return;
  }

}

class CleanCmd extends SrcLibCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CleanCmd.type$; }

  name() {
    return "clean";
  }

  summary() {
    return "Delete all xetolib versions for source libs";
  }

  process(repo,vers) {
    const this$ = this;
    vers.each((ver) => {
      this$.clean(ver);
      return;
    });
    return 0;
  }

  clean(v) {
    let libDir = xetoEnv.XetoUtil.srcToLibDir(v);
    this.printLine(sys.Str.plus(sys.Str.plus("Delete [", libDir.osPath()), "]"));
    libDir.delete();
    return 0;
  }

  static make() {
    const $self = new CleanCmd();
    CleanCmd.make$($self);
    return $self;
  }

  static make$($self) {
    SrcLibCmd.make$($self);
    return;
  }

}

class DocCmd extends SrcLibCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocCmd.type$; }

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

  name() {
    return "doc";
  }

  summary() {
    return "Compile libs to JSON doc AST files";
  }

  process(repo,vers) {
    const this$ = this;
    let depends = vers.map((x) => {
      return x.asDepend();
    }, xeto.LibDepend.type$);
    let flatten = repo.solveDepends(sys.ObjUtil.coerce(depends, sys.Type.find("xeto::LibDepend[]")));
    let ns = repo.createNamespace(flatten);
    let libs = vers.map((v) => {
      return sys.ObjUtil.coerce(ns.lib(v.name()), xeto.Lib.type$);
    }, xeto.Lib.type$);
    let outDir = ((this$) => { let $_u18 = this$.#outDir; if ($_u18 != null) return $_u18; return sys.Env.cur().workDir().plus(sys.Uri.fromStr("doc-xeto/")); })(this);
    let c = xetoDoc.DocCompiler.make((it) => {
      it.__ns(ns);
      it.__libs(sys.ObjUtil.coerce(((this$) => { let $_u19 = sys.ObjUtil.coerce(libs, sys.Type.find("xeto::Lib[]")); if ($_u19 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(libs, sys.Type.find("xeto::Lib[]"))); })(this$), sys.Type.find("xeto::Lib[]")));
      it.__outDir(outDir);
      return;
    });
    c.compile();
    return 0;
  }

  static make() {
    const $self = new DocCmd();
    DocCmd.make$($self);
    return $self;
  }

  static make$($self) {
    SrcLibCmd.make$($self);
    return;
  }

}

class InitCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InitCmd.type$; }

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

  #noconfirm = false;

  noconfirm(it) {
    if (it === undefined) {
      return this.#noconfirm;
    }
    else {
      this.#noconfirm = it;
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

  name() {
    return "init";
  }

  summary() {
    return "Stub out new xeto lib source dir";
  }

  run() {
    let err = xetoEnv.XetoUtil.libNameErr(sys.ObjUtil.coerce(this.#libName, sys.Str.type$));
    if (err != null) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid lib name ", sys.Str.toCode(this.#libName)), ": "), err));
    }
    ;
    let rootDir = this.toRootDir();
    let libDir = rootDir.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", this.#libName), "/")));
    let meta = libDir.plus(sys.Uri.fromStr("lib.xeto"));
    let specs = libDir.plus(sys.Uri.fromStr("specs.xeto"));
    if (meta.exists()) {
      throw sys.Err.make(sys.Str.plus("File already exists: ", meta.osPath()));
    }
    ;
    if (specs.exists()) {
      throw sys.Err.make(sys.Str.plus("File already exists: ", specs.osPath()));
    }
    ;
    sys.ObjUtil.echo();
    sys.ObjUtil.echo("Generate:");
    sys.ObjUtil.echo(sys.Str.plus("  dir:        ", libDir.osPath()));
    sys.ObjUtil.echo(sys.Str.plus("  lib.xeto:   ", meta.osPath()));
    sys.ObjUtil.echo(sys.Str.plus("  specs.xeto: ", specs.osPath()));
    sys.ObjUtil.echo();
    if (!this.#noconfirm) {
      if (!this.promptConfirm("Generate?")) {
        return 1;
      }
      ;
    }
    ;
    this.genMeta(meta);
    this.genSpecs(specs);
    sys.ObjUtil.echo("Complete");
    return 0;
  }

  toRootDir() {
    if (this.#dir != null) {
      return sys.ObjUtil.coerce(this.#dir, sys.File.type$);
    }
    ;
    return sys.Env.cur().workDir().plus(sys.Uri.fromStr("src/xeto/"));
  }

  genMeta(file) {
    let sysVer = xeto.LibNamespace.system().sysLib().version();
    let sysDepend = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sysVer.major(), sys.Obj.type$.toNullable())), "."), sys.ObjUtil.coerce(sysVer.minor(), sys.Obj.type$.toNullable())), ".x");
    file.out().print(sys.Str.plus(sys.Str.plus("pragma: Lib <\n  doc: \"TODO\"\n  version: \"0.0.1\"\n  depends: {\n    { lib: \"sys\", versions: \"", sysDepend), "\" }\n  }\n  org: {\n    dis: \"TODO\"\n    uri: \"TODO\"\n  }\n>\n ")).close();
    return;
  }

  genSpecs(file) {
    file.out().print("// My spec documentation\nMySpec : Dict {\n}\n").close();
    return;
  }

  static make() {
    const $self = new InitCmd();
    InitCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class GenTz extends AbstractGenCmd {
  constructor() {
    super();
    const this$ = this;
    this.#outDir = sys.Env.cur().workDir().plus(sys.Uri.fromStr("../xeto/src/xeto/sys/")).normalize();
    return;
  }

  typeof() { return GenTz.type$; }

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

  name() {
    return "gen-tz";
  }

  summary() {
    return "Compile timezone db into sys::TimeZone";
  }

  run() {
    const this$ = this;
    if (!this.outDir().plus(sys.Uri.fromStr("types.xeto")).exists()) {
      throw sys.Err.make(sys.Str.plus("Invalid outDir: ", this.outDir()));
    }
    ;
    this.write(sys.Uri.fromStr("timezones.xeto"), (out) => {
      out.printLine("// TimeZone names for standardized database");
      out.printLine("TimeZone: Enum {");
      let names = sys.TimeZone.listNames().dup();
      names.moveTo("UTC", 0);
      names.each((name) => {
        let key = name;
        if (sys.Str.startsWith(key, "GMT-")) {
          (name = sys.Str.plus("gmtMinus", sys.Str.getRange(key, sys.Range.make(4, -1))));
        }
        else {
          if (sys.Str.startsWith(key, "GMT+")) {
            (name = sys.Str.plus("gmtPlus", sys.Str.getRange(key, sys.Range.make(4, -1))));
          }
          else {
            (name = this$.normEnumName(name));
          }
          ;
        }
        ;
        out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", name), " <key:"), sys.Str.toCode(key)), ">"));
        return;
      });
      out.printLine("}");
      return;
    });
    return 0;
  }

  static make() {
    const $self = new GenTz();
    GenTz.make$($self);
    return $self;
  }

  static make$($self) {
    AbstractGenCmd.make$($self);
    ;
    return;
  }

}

class GenUnits extends AbstractGenCmd {
  constructor() {
    super();
    const this$ = this;
    this.#outDir = sys.Env.cur().workDir().plus(sys.Uri.fromStr("../xeto/src/xeto/sys/")).normalize();
    return;
  }

  typeof() { return GenUnits.type$; }

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

  name() {
    return "gen-units";
  }

  summary() {
    return "Compile unit db into sys::Unit";
  }

  run() {
    const this$ = this;
    if (!this.outDir().plus(sys.Uri.fromStr("types.xeto")).exists()) {
      throw sys.Err.make(sys.Str.plus("Invalid outDir: ", this.outDir()));
    }
    ;
    let quantities = sys.List.make(sys.Str.type$);
    this.write(sys.Uri.fromStr("units.xeto"), (out) => {
      out.printLine("// Unit symbols for standardized database");
      out.printLine("Unit: Enum {");
      sys.Unit.quantities().each((q) => {
        let quantityMeta = null;
        if (sys.ObjUtil.compareNE(q, "dimensionless")) {
          let quantityName = this$.normEnumName(q);
          quantities.add(quantityName);
          (quantityMeta = sys.Str.plus(", quantity:", sys.Str.toCode(quantityName)));
        }
        ;
        sys.Unit.quantity(q).each((u) => {
          out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", u.name()), " <key:"), sys.Str.toCode(u.symbol())));
          if (quantityMeta != null) {
            out.print(quantityMeta);
          }
          ;
          out.printLine(">");
          return;
        });
        out.printLine();
        return;
      });
      out.printLine("}");
      out.printLine();
      out.printLine("// Unit quantity types for standardized database");
      out.printLine("UnitQuantity: Enum {");
      quantities.each((q) => {
        out.printLine(sys.Str.plus("  ", q));
        return;
      });
      out.printLine("}");
      return;
    });
    return 0;
  }

  static make() {
    const $self = new GenUnits();
    GenUnits.make$($self);
    return $self;
  }

  static make$($self) {
    AbstractGenCmd.make$($self);
    ;
    return;
  }

}

class ExportCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportCmd.type$; }

  #all = false;

  all(it) {
    if (it === undefined) {
      return this.#all;
    }
    else {
      this.#all = it;
      return;
    }
  }

  #verbose = false;

  verbose(it) {
    if (it === undefined) {
      return this.#verbose;
    }
    else {
      this.#verbose = it;
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

  #outFile = null;

  outFile(it) {
    if (it === undefined) {
      return this.#outFile;
    }
    else {
      this.#outFile = it;
      return;
    }
  }

  #targets = null;

  targets(it) {
    if (it === undefined) {
      return this.#targets;
    }
    else {
      this.#targets = it;
      return;
    }
  }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    XetoCmd.prototype.usage.call(this, out);
    out.printLine("Targets:");
    out.printLine("  ph.points                   // latest version of lib");
    out.printLine("  ph.points-1.0.43            // specific version of lib");
    out.printLine("  ph.points::RunCmd           // latest version of spec");
    out.printLine("  ph.points-1.0.43::RunCmd    // specific version of spec");
    out.printLine("  ion.icons::apple            // instance in a lib");
    out.printLine("Examples:");
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " sys                   // latest version of lib"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " sys-1.0.3             // specific lib version"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " sys ph ph.points      // multiple libs"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " ph::Rtu               // one spec"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " ph -outFile foo.xeto  // output to file"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " sys ph -outDir myDir  // output each target to file in dir"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " -all -outDir myDir    // output every lib to file in dir"));
    return 1;
  }

  run() {
    const this$ = this;
    if (!this.checkArgs()) {
      return 1;
    }
    ;
    let repo = xeto.LibRepo.cur();
    let targets = this.findTargets(repo);
    if (this.#verbose) {
      this.printLine("\nFind Targets:");
      targets.each((x) => {
        this$.printLine(sys.Str.plus("  ", x));
        return;
      });
    }
    ;
    let ns = this.createNamespace(repo, targets);
    if (this.#verbose) {
      this.printLine("\nCreate Namespace:");
      ns.versions().each((x) => {
        this$.printLine(sys.Str.plus("  ", x));
        return;
      });
    }
    ;
    this.exportTargets(ns, targets);
    return 0;
  }

  checkArgs() {
    if ((this.#outDir != null && this.#outFile != null)) {
      this.err("Cannot specify both outDir and outFile");
      return false;
    }
    ;
    if ((this.#targets == null && !this.#all)) {
      this.err("No targets specified");
      return false;
    }
    ;
    return true;
  }

  findTargets(repo) {
    const this$ = this;
    if (this.#all) {
      return this.findAllTargets(repo);
    }
    ;
    if (this.#targets == null) {
      return sys.List.make(ExportTarget.type$);
    }
    ;
    return sys.ObjUtil.coerce(this.#targets.map((name) => {
      return this$.findTarget(repo, name);
    }, ExportTarget.type$), sys.Type.find("xetoTools::ExportTarget[]"));
  }

  findAllTargets(repo) {
    const this$ = this;
    return sys.ObjUtil.coerce(repo.libs().map((libName) => {
      return this$.findTarget(repo, libName);
    }, ExportTarget.type$), sys.Type.find("xetoTools::ExportTarget[]"));
  }

  findTarget(repo,name) {
    let libName = name;
    let version = null;
    let specName = null;
    if (sys.Str.contains(name, "::")) {
      (libName = sys.ObjUtil.coerce(xetoEnv.XetoUtil.qnameToLib(name), sys.Str.type$));
      (specName = xetoEnv.XetoUtil.qnameToName(name));
    }
    ;
    if (sys.Str.contains(libName, "-")) {
      let dash = sys.Str.index(libName, "-");
      (version = sys.Version.fromStr(sys.Str.getRange(libName, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(dash, sys.Int.type$), 1), -1))));
      (libName = sys.Str.getRange(libName, sys.Range.make(0, sys.ObjUtil.coerce(dash, sys.Int.type$), true)));
    }
    ;
    let lib = ((this$) => { if (version == null) return repo.latest(libName); return repo.version(libName, sys.ObjUtil.coerce(version, sys.Version.type$)); })(this);
    return ExportTarget.make(sys.ObjUtil.coerce(lib, xeto.LibVersion.type$), sys.ObjUtil.coerce(specName, sys.Str.type$.toNullable()));
  }

  createNamespace(repo,targets) {
    const this$ = this;
    let depends = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::LibDepend"));
    targets.each((t) => {
      depends.set(t.lib().name(), t.depend());
      return;
    });
    let versions = repo.solveDepends(depends.vals());
    return repo.createNamespace(versions);
  }

  exportTargets(ns,targets) {
    if (this.#outDir != null) {
      this.exportToDir(ns, targets);
    }
    else {
      this.exportToFile(ns, targets);
    }
    ;
    return;
  }

  exportToDir(ns,targets) {
    const this$ = this;
    targets.each((t) => {
      let name = sys.Str.replace(this$.toFileName(t), "::", "_");
      let file = this$.#outDir.uri().plusSlash().plusName(name).toFile();
      this$.withOut(file, (out) => {
        let ex = this$.initExporter(ns, out);
        ex.start();
        this$.exportTarget(ns, ex, t);
        ex.end();
        return;
      });
      return;
    });
    return;
  }

  exportToFile(ns,targets) {
    const this$ = this;
    this.withOut(this.#outFile, (out) => {
      let ex = this$.initExporter(ns, out);
      ex.start();
      targets.each((t) => {
        this$.exportTarget(ns, ex, t);
        return;
      });
      ex.end();
      return;
    });
    return;
  }

  exportTarget(ns,ex,t) {
    let lib = ns.lib(t.lib().name());
    if (t.specName() == null) {
      ex.lib(sys.ObjUtil.coerce(lib, xeto.Lib.type$));
      return;
    }
    ;
    let spec = lib.spec(sys.ObjUtil.coerce(t.specName(), sys.Str.type$), false);
    if (spec != null) {
      ex.spec(sys.ObjUtil.coerce(spec, xeto.Spec.type$));
      return;
    }
    ;
    let instance = lib.instance(sys.ObjUtil.coerce(t.specName(), sys.Str.type$), false);
    if (instance != null) {
      ex.instance(sys.ObjUtil.coerce(instance, haystack.Dict.type$));
      return;
    }
    ;
    throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unknown spec/instance ", lib.name()), "::"), t.specName()));
  }

  static make() {
    const $self = new ExportCmd();
    ExportCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class ExportJson extends ExportCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportJson.type$; }

  #effective = false;

  effective(it) {
    if (it === undefined) {
      return this.#effective;
    }
    else {
      this.#effective = it;
      return;
    }
  }

  name() {
    return "export-json";
  }

  summary() {
    return "Export Xeto to JSON";
  }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    ExportCmd.prototype.usage.call(this, out);
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " ph::Rtu -effective    // output effective meta and slots"));
    return 1;
  }

  initExporter(ns,out) {
    let opts = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    if (this.#effective) {
      opts.set("effective", haystack.Marker.val());
    }
    ;
    return xetoEnv.JsonExporter.make(sys.ObjUtil.coerce(ns, xetoEnv.MNamespace.type$), out, haystack.Etc.makeDict(opts));
  }

  toFileName(t) {
    return sys.Str.plus(t.toStr(), ".json");
  }

  static make() {
    const $self = new ExportJson();
    ExportJson.make$($self);
    return $self;
  }

  static make$($self) {
    ExportCmd.make$($self);
    return;
  }

}

class RepoCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RepoCmd.type$; }

  #versions = false;

  versions(it) {
    if (it === undefined) {
      return this.#versions;
    }
    else {
      this.#versions = it;
      return;
    }
  }

  #full = false;

  full(it) {
    if (it === undefined) {
      return this.#full;
    }
    else {
      this.#full = it;
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

  name() {
    return "repo";
  }

  summary() {
    return "List locally installed libs";
  }

  run() {
    const this$ = this;
    let repo = xeto.LibRepo.cur();
    let libNames = ((this$) => { let $_u21 = this$.#libs; if ($_u21 != null) return $_u21; return repo.libs(); })(this);
    sys.ObjUtil.echo();
    libNames.each((libName) => {
      this$.listLib(repo, libName);
      return;
    });
    sys.ObjUtil.echo();
    return 0;
  }

  listLib(repo,name) {
    const this$ = this;
    if (!this.#versions) {
      let latest = repo.latest(name);
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), " ["), latest.version()), "]"));
      if (this.#full) {
        this.listFull(sys.ObjUtil.coerce(latest, xeto.LibVersion.type$), sys.Str.spaces(2));
      }
      ;
      return;
    }
    ;
    let versions = repo.versions(name);
    sys.ObjUtil.echo();
    sys.ObjUtil.echo(sys.Str.plus("", name));
    versions.each((v) => {
      sys.ObjUtil.echo(sys.Str.plus("  ", v.version()));
      if (this$.#full) {
        this$.listFull(v, sys.Str.spaces(4));
      }
      ;
      return;
    });
    return;
  }

  listFull(v,indent) {
    const this$ = this;
    sys.ObjUtil.echo(sys.Str.plus(indent, sys.Str.plus("File:   ", v.file().osPath())));
    sys.ObjUtil.echo(sys.Str.plus(indent, sys.Str.plus("Doc:    ", v.doc())));
    v.depends().each((d) => {
      sys.ObjUtil.echo(sys.Str.plus(indent, sys.Str.plus("Depend: ", d)));
      return;
    });
    return;
  }

  static make() {
    const $self = new RepoCmd();
    RepoCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class Main extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Main.type$; }

  static main(args) {
    if ((args.isEmpty() || sys.ObjUtil.equals(args.first(), "-?") || sys.ObjUtil.equals(args.first(), "-help") || sys.ObjUtil.equals(args.first(), "--help"))) {
      (args = sys.List.make(sys.Str.type$, ["help"]));
    }
    ;
    let cmdName = args.first();
    let cmd = XetoCmd.find(sys.ObjUtil.coerce(cmdName, sys.Str.type$));
    if (cmd == null) {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("ERROR: unknown xeto command '", cmdName), "'"));
      return 1;
    }
    ;
    return cmd.main(args.dup().getRange(sys.Range.make(1, -1)));
  }

  static make() {
    const $self = new Main();
    Main.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class ExportHaystack extends ExportCmd {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return ExportHaystack.type$; }

  #effective = false;

  effective(it) {
    if (it === undefined) {
      return this.#effective;
    }
    else {
      this.#effective = it;
      return;
    }
  }

  #defns$Store = undefined;

  // private field reflection only
  __defns$Store(it) { if (it === undefined) return this.#defns$Store; else this.#defns$Store = it; }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    ExportCmd.prototype.usage.call(this, out);
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " ph::Rtu -effective    // output effective meta and slots"));
    return 1;
  }

  initExporter(ns,out) {
    let opts = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    if (this.#effective) {
      opts.set("effective", haystack.Marker.val());
    }
    ;
    return xetoEnv.GridExporter.make(sys.ObjUtil.coerce(ns, xetoEnv.MNamespace.type$), out, haystack.Etc.makeDict(opts), this.filetype());
  }

  toFileName(t) {
    return sys.Str.plus(t.toStr(), sys.Str.plus(".", this.filetype().fileExt()));
  }

  defns() {
    if (this.#defns$Store === undefined) {
      this.#defns$Store = this.defns$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#defns$Store, haystack.Namespace.type$);
  }

  static make() {
    const $self = new ExportHaystack();
    ExportHaystack.make$($self);
    return $self;
  }

  static make$($self) {
    ExportCmd.make$($self);
    ;
    return;
  }

  defns$Once() {
    return defc.DefCompiler.make().compileNamespace();
  }

}

class ExportTrio extends ExportHaystack {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportTrio.type$; }

  name() {
    return "export-trio";
  }

  summary() {
    return "Export Xeto to Trio";
  }

  filetype() {
    return sys.ObjUtil.coerce(this.defns().filetype("trio"), haystack.Filetype.type$);
  }

  static make() {
    const $self = new ExportTrio();
    ExportTrio.make$($self);
    return $self;
  }

  static make$($self) {
    ExportHaystack.make$($self);
    return;
  }

}

class ExportZinc extends ExportHaystack {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportZinc.type$; }

  name() {
    return "export-zinc";
  }

  summary() {
    return "Export Xeto to Zinc";
  }

  filetype() {
    return sys.ObjUtil.coerce(this.defns().filetype("zinc"), haystack.Filetype.type$);
  }

  static make() {
    const $self = new ExportZinc();
    ExportZinc.make$($self);
    return $self;
  }

  static make$($self) {
    ExportHaystack.make$($self);
    return;
  }

}

class ExportHayson extends ExportHaystack {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportHayson.type$; }

  name() {
    return "export-hayson";
  }

  summary() {
    return "Export Xeto to Haystack JSON";
  }

  filetype() {
    return sys.ObjUtil.coerce(this.defns().filetype("json"), haystack.Filetype.type$);
  }

  static make() {
    const $self = new ExportHayson();
    ExportHayson.make$($self);
    return $self;
  }

  static make$($self) {
    ExportHaystack.make$($self);
    return;
  }

}

class ExportRdf extends ExportCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportRdf.type$; }

  name() {
    return "export-rdf";
  }

  summary() {
    return "Export Xeto to RDF";
  }

  initExporter(ns,out) {
    let opts = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    return xetoEnv.RdfExporter.make(sys.ObjUtil.coerce(ns, xetoEnv.MNamespace.type$), out, haystack.Etc.makeDict(opts));
  }

  toFileName(t) {
    return sys.Str.plus(t.toStr(), ".ttl");
  }

  static make() {
    const $self = new ExportRdf();
    ExportRdf.make$($self);
    return $self;
  }

  static make$($self) {
    ExportCmd.make$($self);
    return;
  }

}

class ExportTarget extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportTarget.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #specName = null;

  specName() { return this.#specName; }

  __specName(it) { if (it === undefined) return this.#specName; else this.#specName = it; }

  #depend = null;

  depend() { return this.#depend; }

  __depend(it) { if (it === undefined) return this.#depend; else this.#depend = it; }

  static make(lib,specName) {
    const $self = new ExportTarget();
    ExportTarget.make$($self,lib,specName);
    return $self;
  }

  static make$($self,lib,specName) {
    $self.#lib = lib;
    $self.#specName = specName;
    $self.#depend = sys.ObjUtil.coerce(xeto.LibDepend.make(lib.name(), sys.ObjUtil.coerce(xeto.LibDependVersions.fromVersion(lib.version()), xeto.LibDependVersions.type$)), xeto.LibDepend.type$);
    return;
  }

  toStr() {
    return ((this$) => { if (this$.#specName == null) return sys.ObjUtil.toStr(this$.#lib); return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#lib), "::"), this$.#specName); })(this);
  }

}

class FitsCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FitsCmd.type$; }

  #graph = false;

  graph(it) {
    if (it === undefined) {
      return this.#graph;
    }
    else {
      this.#graph = it;
      return;
    }
  }

  #ignoreRefs = false;

  ignoreRefs(it) {
    if (it === undefined) {
      return this.#ignoreRefs;
    }
    else {
      this.#ignoreRefs = it;
      return;
    }
  }

  #outFile = null;

  outFile(it) {
    if (it === undefined) {
      return this.#outFile;
    }
    else {
      this.#outFile = it;
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

  #recs = null;

  recs(it) {
    if (it === undefined) {
      return this.#recs;
    }
    else {
      this.#recs = it;
      return;
    }
  }

  #recsById = null;

  recsById(it) {
    if (it === undefined) {
      return this.#recsById;
    }
    else {
      this.#recsById = it;
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

  #hits = null;

  hits(it) {
    if (it === undefined) {
      return this.#hits;
    }
    else {
      this.#hits = it;
      return;
    }
  }

  #numOk = 0;

  // private field reflection only
  __numOk(it) { if (it === undefined) return this.#numOk; else this.#numOk = it; }

  #numErr = 0;

  // private field reflection only
  __numErr(it) { if (it === undefined) return this.#numErr; else this.#numErr = it; }

  name() {
    return "fits";
  }

  summary() {
    return "Validate input data against configured specs";
  }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    XetoCmd.prototype.usage.call(this, out);
    out.printLine("Examples:");
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " recs.zinc            // Validate Zinc input file"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " recs.json            // Validate Hayson input file"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " recs.trio            // Validate Trio input file"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " recs.trio -graph     // Validate graph queries"));
    return 1;
  }

  run() {
    this.readInput();
    this.loadNamespace();
    this.runFits();
    this.writeOutput();
    return 0;
  }

  readInput() {
    const this$ = this;
    this.#recs = this.readInputFile(this.#input);
    this.#recsById = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Dict"));
    this.#recs.each((rec) => {
      let id = sys.ObjUtil.as(rec.get("id"), haystack.Ref.type$);
      if (id == null) {
        sys.ObjUtil.echo(sys.Str.plus("WARN: input rec missing id: ", rec));
      }
      else {
        this$.#recsById.add(sys.ObjUtil.coerce(id, haystack.Ref.type$), rec);
      }
      ;
      return;
    });
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Read Inputs [", sys.ObjUtil.coerce(this.#recs.size(), sys.Obj.type$.toNullable())), " recs]"));
    return;
  }

  loadNamespace() {
    this.#ns = xeto.LibRepo.cur().createFromData(sys.ObjUtil.coerce(this.#recs, sys.Type.find("xeto::Dict[]")));
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Load Namesapce [", sys.ObjUtil.coerce(this.#ns.libs().size(), sys.Obj.type$.toNullable())), " libs]"));
    return;
  }

  runFits() {
    const this$ = this;
    this.#hits = sys.List.make(xeto.XetoLogRec.type$);
    let logger = (rec) => {
      this$.#hits.add(rec);
      return;
    };
    let optsMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    optsMap.set("explain", sys.Unsafe.make(logger));
    optsMap.set("haystack", haystack.Marker.val());
    if (this.#graph) {
      optsMap.set("graph", haystack.Marker.val());
    }
    ;
    if (this.#ignoreRefs) {
      optsMap.set("ignoreRefs", haystack.Marker.val());
    }
    ;
    let opts = haystack.Etc.makeDict(optsMap);
    this.#recs.each((rec) => {
      let id = rec._id();
      let startSize = this$.#hits.size();
      let specTag = sys.ObjUtil.as(rec.get("spec"), haystack.Ref.type$);
      if (specTag == null) {
        sys.Func.call(logger, sys.ObjUtil.coerce(xeto.XetoLogRec.make(sys.LogLevel.err(), id, "Missing 'spec' ref tag", util.FileLoc.unknown(), null), xeto.XetoLogRec.type$));
        ((this$) => { let $_u23 = this$.#numErr;this$.#numErr = sys.Int.increment(this$.#numErr); return $_u23; })(this$);
        return;
      }
      ;
      let spec = this$.#ns.spec(specTag.id(), false);
      if (spec == null) {
        sys.Func.call(logger, sys.ObjUtil.coerce(xeto.XetoLogRec.make(sys.LogLevel.err(), id, sys.Str.plus("Unknown 'spec' ref: ", specTag), util.FileLoc.unknown(), null), xeto.XetoLogRec.type$));
        ((this$) => { let $_u24 = this$.#numErr;this$.#numErr = sys.Int.increment(this$.#numErr); return $_u24; })(this$);
        return;
      }
      ;
      this$.#ns.fits(FitsCmdContext.make(this$), rec, sys.ObjUtil.coerce(spec, xeto.Spec.type$), opts);
      if (sys.ObjUtil.equals(this$.#hits.size(), startSize)) {
        ((this$) => { let $_u25 = this$.#numOk;this$.#numOk = sys.Int.increment(this$.#numOk); return $_u25; })(this$);
      }
      else {
        ((this$) => { let $_u26 = this$.#numErr;this$.#numErr = sys.Int.increment(this$.#numErr); return $_u26; })(this$);
      }
      ;
      return;
    });
    return;
  }

  writeOutput() {
    if (this.#outFile == null) {
      this.writeConsole(util.Console.cur());
    }
    else {
      this.writeFile();
    }
    ;
    return;
  }

  writeConsole(con) {
    const this$ = this;
    let table = sys.List.make(sys.Type.find("sys::Obj[]"));
    table.add(sys.List.make(sys.Str.type$, ["id", "dis", "msg"]));
    this.#hits.each((hit) => {
      table.add(sys.List.make(sys.Str.type$, [hit.id().id(), hit.id().dis(), hit.msg()]));
      return;
    });
    con.info("");
    con.table(table);
    con.info("");
    con.info(sys.Str.plus("Num recs ok:  ", sys.ObjUtil.coerce(this.#numOk, sys.Obj.type$.toNullable())));
    con.info(sys.Str.plus("Num recs err: ", sys.ObjUtil.coerce(this.#numErr, sys.Obj.type$.toNullable())));
    con.info("");
    return;
  }

  writeFile() {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.addCol("id").addCol("msg");
    this.#hits.each((hit) => {
      gb.addRow2(hit.id(), hit.msg());
      return;
    });
    this.writeOutputFile(sys.ObjUtil.coerce(this.#outFile, sys.File.type$), gb.toGrid());
    return;
  }

  static make() {
    const $self = new FitsCmd();
    FitsCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class FitsCmdContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FitsCmdContext.type$; }

  #cmd = null;

  cmd(it) {
    if (it === undefined) {
      return this.#cmd;
    }
    else {
      this.#cmd = it;
      return;
    }
  }

  static make(cmd) {
    const $self = new FitsCmdContext();
    FitsCmdContext.make$($self,cmd);
    return $self;
  }

  static make$($self,cmd) {
    $self.#cmd = cmd;
    return;
  }

  xetoReadById(id) {
    return this.#cmd.recsById().get(sys.ObjUtil.coerce(id, haystack.Ref.type$));
  }

  xetoReadAllEachWhile(filter,f) {
    throw sys.Err.make();
  }

  xetoIsSpec(spec,rec) {
    throw sys.Err.make();
  }

}

const p = sys.Pod.add$('xetoTools');
const xp = sys.Param.noParams$();
let m;
XetoCmd.type$ = p.at$('XetoCmd','util::AbstractMain',[],{},8193,XetoCmd);
GenFantom.type$ = p.at$('GenFantom','xetoTools::XetoCmd',[],{},128,GenFantom);
AbstractGenCmd.type$ = p.at$('AbstractGenCmd','xetoTools::XetoCmd',[],{},129,AbstractGenCmd);
GenPH.type$ = p.at$('GenPH','xetoTools::AbstractGenCmd',[],{},128,GenPH);
HelpCmd.type$ = p.at$('HelpCmd','xetoTools::XetoCmd',[],{},128,HelpCmd);
EnvCmd.type$ = p.at$('EnvCmd','xetoTools::XetoCmd',[],{},128,EnvCmd);
VersionCmd.type$ = p.at$('VersionCmd','xetoTools::XetoCmd',[],{},128,VersionCmd);
SrcLibCmd.type$ = p.at$('SrcLibCmd','xetoTools::XetoCmd',[],{},129,SrcLibCmd);
BuildCmd.type$ = p.at$('BuildCmd','xetoTools::SrcLibCmd',[],{},128,BuildCmd);
CleanCmd.type$ = p.at$('CleanCmd','xetoTools::SrcLibCmd',[],{},128,CleanCmd);
DocCmd.type$ = p.at$('DocCmd','xetoTools::SrcLibCmd',[],{},128,DocCmd);
InitCmd.type$ = p.at$('InitCmd','xetoTools::XetoCmd',[],{},128,InitCmd);
GenTz.type$ = p.at$('GenTz','xetoTools::AbstractGenCmd',[],{},128,GenTz);
GenUnits.type$ = p.at$('GenUnits','xetoTools::AbstractGenCmd',[],{},128,GenUnits);
ExportCmd.type$ = p.at$('ExportCmd','xetoTools::XetoCmd',[],{},129,ExportCmd);
ExportJson.type$ = p.at$('ExportJson','xetoTools::ExportCmd',[],{},128,ExportJson);
RepoCmd.type$ = p.at$('RepoCmd','xetoTools::XetoCmd',[],{},128,RepoCmd);
Main.type$ = p.at$('Main','sys::Obj',[],{},8192,Main);
ExportHaystack.type$ = p.at$('ExportHaystack','xetoTools::ExportCmd',[],{},129,ExportHaystack);
ExportTrio.type$ = p.at$('ExportTrio','xetoTools::ExportHaystack',[],{},128,ExportTrio);
ExportZinc.type$ = p.at$('ExportZinc','xetoTools::ExportHaystack',[],{},128,ExportZinc);
ExportHayson.type$ = p.at$('ExportHayson','xetoTools::ExportHaystack',[],{},128,ExportHayson);
ExportRdf.type$ = p.at$('ExportRdf','xetoTools::ExportCmd',[],{},128,ExportRdf);
ExportTarget.type$ = p.at$('ExportTarget','sys::Obj',[],{},130,ExportTarget);
FitsCmd.type$ = p.at$('FitsCmd','xetoTools::XetoCmd',[],{},128,FitsCmd);
FitsCmdContext.type$ = p.at$('FitsCmdContext','sys::Obj',['xeto::XetoContext'],{},128,FitsCmdContext);
XetoCmd.type$.am$('find',40962,'xetoTools::XetoCmd?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('list',40962,'xetoTools::XetoCmd[]',xp,{}).am$('appName',9216,'sys::Str',xp,{}).am$('log',271360,'sys::Log',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('aliases',270336,'sys::Str[]',xp,{}).am$('run',271361,'sys::Int',xp,{}).am$('summary',270337,'sys::Str',xp,{}).am$('readInputFile',8192,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File?',false)]),{}).am$('writeOutputFile',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('grid','haystack::Grid',false)]),{}).am$('printLine',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',true)]),{}).am$('err',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('withOut',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::File?',false),new sys.Param('f','|sys::OutStream->sys::Void|',false)]),{}).am$('promptConfirm',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
GenFantom.type$.af$('buildFile',73728,'sys::File?',{'util::Arg':"util::Arg{help=\"File path to build.xeto\";}"}).af$('outDir',67584,'sys::File?',{}).af$('build',67584,'haystack::Dict?',{}).af$('genSetters',67584,'sys::Bool',{}).af$('genDicts',67584,'sys::Bool',{}).af$('genAsyncMethods',67584,'sys::Bool',{}).af$('types',67584,'xeto::Spec[]?',{}).af$('nameToDir',67584,'[sys::Str:sys::File]?',{}).af$('buf',67584,'sys::StrBuf?',{}).af$('numRewrote',67584,'sys::Int',{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('init',2048,'sys::Void',xp,{}).am$('mapNameToDir',2048,'sys::Void',xp,{}).am$('doMapNameToDir',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::File]',false),new sys.Param('dir','sys::File',false)]),{}).am$('dirForType',8192,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec?',false)]),{}).am$('parseBuildFile',2048,'sys::Void',xp,{}).am$('readInputs',2048,'sys::Void',xp,{}).am$('includeType',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false)]),{}).am$('genTypes',2048,'sys::Void',xp,{}).am$('genType',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false)]),{}).am$('genTypeBody',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false)]),{}).am$('hasDict',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false)]),{}).am$('genTypeHeader',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false)]),{}).am$('genTypeEnum',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false)]),{}).am$('genTypeMixin',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false)]),{}).am$('genTypeDict',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false)]),{}).am$('includeSlot',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false)]),{}).am$('genSlot',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false)]),{}).am$('genField',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false)]),{}).am$('genGetter',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false)]),{}).am$('genMethod',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false)]),{}).am$('eachParam',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false),new sys.Param('f','|xeto::Spec,sys::Int->sys::Void|',false)]),{}).am$('slotFacets',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false)]),{}).am$('slotTypeSig',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false),new sys.Param('forceMaybe','sys::Bool',true)]),{}).am$('fandoc',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('indent','sys::Int',false)]),{}).am$('section',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('title','sys::Str',false),new sys.Param('char','sys::Int',false)]),{}).am$('w',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false)]),{}).am$('sp',2048,'sys::This',xp,{}).am$('nl',2048,'sys::This',xp,{}).am$('comma',2048,'sys::This',xp,{}).am$('genOpen',2048,'sys::Void',xp,{}).am$('genClose',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('isChanged',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('newBody','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
AbstractGenCmd.type$.af$('ts',67586,'sys::Str',{}).am$('outDir',270337,'sys::File',xp,{}).am$('write',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('cb','|sys::OutStream->sys::Void|',false)]),{}).am$('isFileChanged',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('newContents','sys::Str',false)]),{}).am$('writeDoc',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false)]),{}).am$('info',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('normEnumName',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
GenPH.type$.af$('outDir',336896,'sys::File',{'util::Opt':"util::Opt{help=\"Directory to output\";}"}).af$('defSymbol',67586,'haystack::Symbol',{}).af$('ns',67584,'haystack::Namespace?',{}).af$('ph',67584,'haystack::Lib?',{}).af$('multiRefs$Store',722944,'sys::Obj?',{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('checkInputs',2048,'sys::Void',xp,{}).am$('compileNamespace',2048,'sys::Void',xp,{}).am$('writeLib',2048,'sys::Void',xp,{}).am$('writeTags',2048,'sys::Void',xp,{}).am$('excludeTag',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false),new sys.Param('kind','haystack::Kind',false)]),{}).am$('toTagType',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('tag','haystack::Def',false)]),{}).am$('multiRefs',526336,'sys::Str[]',xp,{}).am$('toEnumTypeName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('tag','haystack::Def',false)]),{}).am$('toChoiceTypeName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('toTagMeta',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false),new sys.Param('kind','haystack::Kind',false)]),{}).am$('writeEntities',2048,'sys::Void',xp,{}).am$('toEntityName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('toEntityType',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('writeEntityMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('entity','haystack::Def',false)]),{}).am$('writeEntityUsage',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('entity','haystack::Def',false)]),{}).am$('excludeEntity',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('isAbstract',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('writeEntitySlots',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('entity','haystack::Def',false)]),{}).am$('toSlotType',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('entity','haystack::Def',false),new sys.Param('tag','haystack::Def',false)]),{}).am$('writeEntitySlot',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('name','sys::Str',false),new sys.Param('maxNameSize','sys::Int',false),new sys.Param('sig','sys::Str',false)]),{}).am$('isOptional',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('entity','haystack::Def',false),new sys.Param('tag','haystack::Def',false)]),{}).am$('isInherited',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('entity','haystack::Def',false),new sys.Param('tag','haystack::Def',false)]),{}).am$('writeEnums',2048,'sys::Void',xp,{}).am$('writeEnum',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false)]),{}).am$('writeChoices',2048,'sys::Void',xp,{}).am$('writeChoice',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false)]),{}).am$('writeChoiceTaxonomy',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('writeChoiceTaxonomyLevel',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false),new sys.Param('baseName','sys::Str',false)]),{}).am$('toChoiceTaxonomyTags',2048,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('writeFeatureDefs',2048,'sys::Void',xp,{}).am$('writeFeatureType',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false)]),{}).am$('writeFeatureInstance',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('multiRefs$Once',133120,'sys::Str[]',xp,{});
HelpCmd.type$.af$('commandName',73728,'sys::Str[]',{'util::Arg':""}).am$('name',271360,'sys::Str',xp,{}).am$('aliases',271360,'sys::Str[]',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
EnvCmd.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
VersionCmd.type$.am$('name',271360,'sys::Str',xp,{}).am$('aliases',271360,'sys::Str[]',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
SrcLibCmd.type$.af$('all',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"All source libs in working dir\";}"}).af$('allIn',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"All source libs under given directory\";}"}).af$('libs',73728,'sys::Str[]?',{'util::Arg':"util::Arg{help=\"List of lib names for any source lib in path\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('process',270337,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('vers','xeto::LibVersion[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
BuildCmd.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('process',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('vers','xeto::LibVersion[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CleanCmd.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('process',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('vers','xeto::LibVersion[]',false)]),{}).am$('clean',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DocCmd.type$.af$('outDir',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"Output directory\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('process',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('vers','xeto::LibVersion[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
InitCmd.type$.af$('dir',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"Output directory for new lib source dir\";}"}).af$('noconfirm',73728,'sys::Bool',{'util::Opt':"util::Opt{aliases=[\"y\"];help=\"Skip confirmation\";}"}).af$('libName',73728,'sys::Str?',{'util::Arg':"util::Arg{help=\"Dotted name of the new lib\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('toRootDir',2048,'sys::File',xp,{}).am$('genMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('genSpecs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('make',139268,'sys::Void',xp,{});
GenTz.type$.af$('outDir',336896,'sys::File',{'util::Opt':"util::Opt{help=\"Directory to output\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
GenUnits.type$.af$('outDir',336896,'sys::File',{'util::Opt':"util::Opt{help=\"Directory to output\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
ExportCmd.type$.af$('all',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"All libs installed in repo\";}"}).af$('verbose',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Dump debug info as processing\";}"}).af$('outDir',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"Output directory (generates one file per target)\";}"}).af$('outFile',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"Output file (combine all targets in one file, default to stdout)\";}"}).af$('targets',73728,'sys::Str[]?',{'util::Arg':"util::Arg{help=\"Libs, specs, and instances to export\";}"}).am$('usage',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('run',271360,'sys::Int',xp,{}).am$('checkArgs',2048,'sys::Bool',xp,{}).am$('findTargets',2048,'xetoTools::ExportTarget[]',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false)]),{}).am$('findAllTargets',2048,'xetoTools::ExportTarget[]',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false)]),{}).am$('findTarget',2048,'xetoTools::ExportTarget',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('name','sys::Str',false)]),{}).am$('createNamespace',2048,'xeto::LibNamespace',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('targets','xetoTools::ExportTarget[]',false)]),{}).am$('exportTargets',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('targets','xetoTools::ExportTarget[]',false)]),{}).am$('exportToDir',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('targets','xetoTools::ExportTarget[]',false)]),{}).am$('exportToFile',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('targets','xetoTools::ExportTarget[]',false)]),{}).am$('exportTarget',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('ex','xetoEnv::Exporter',false),new sys.Param('t','xetoTools::ExportTarget',false)]),{}).am$('initExporter',270337,'xetoEnv::Exporter',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('toFileName',270337,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('t','xetoTools::ExportTarget',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ExportJson.type$.af$('effective',73728,'sys::Bool',{'util::Opt':"util::Opt{aliases=[\"e\"];help=\"Generate inherited effective meta/slots (default is own)\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('usage',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('initExporter',271360,'xetoEnv::Exporter',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('toFileName',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('t','xetoTools::ExportTarget',false)]),{}).am$('make',139268,'sys::Void',xp,{});
RepoCmd.type$.af$('versions',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"List all the installed versions\";aliases=[\"v\"];}"}).af$('full',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Full listing including file and dependencies\";aliases=[\"f\"];}"}).af$('libs',73728,'sys::Str[]?',{'util::Arg':"util::Arg{help=\"Specific lib name or names to dump\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('listLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('name','sys::Str',false)]),{}).am$('listFull',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false),new sys.Param('indent','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Main.type$.am$('main',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ExportHaystack.type$.af$('effective',73728,'sys::Bool',{'util::Opt':"util::Opt{aliases=[\"e\"];help=\"Generate inherited effective meta/slots (default is own)\";}"}).af$('defns$Store',722944,'sys::Obj?',{}).am$('usage',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('initExporter',271360,'xetoEnv::Exporter',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('toFileName',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('t','xetoTools::ExportTarget',false)]),{}).am$('defns',532480,'haystack::Namespace',xp,{}).am$('filetype',270337,'haystack::Filetype',xp,{}).am$('make',139268,'sys::Void',xp,{}).am$('defns$Once',133120,'haystack::Namespace',xp,{});
ExportTrio.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('filetype',271360,'haystack::Filetype',xp,{}).am$('make',139268,'sys::Void',xp,{});
ExportZinc.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('filetype',271360,'haystack::Filetype',xp,{}).am$('make',139268,'sys::Void',xp,{});
ExportHayson.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('filetype',271360,'haystack::Filetype',xp,{}).am$('make',139268,'sys::Void',xp,{});
ExportRdf.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('initExporter',271360,'xetoEnv::Exporter',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('toFileName',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('t','xetoTools::ExportTarget',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ExportTarget.type$.af$('lib',73730,'xeto::LibVersion',{}).af$('specName',73730,'sys::Str?',{}).af$('depend',73730,'xeto::LibDepend',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::LibVersion',false),new sys.Param('specName','sys::Str?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
FitsCmd.type$.af$('graph',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Check graph of query references such as required points\";}"}).af$('ignoreRefs',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Ignore if refs resolve to valid target in input data set\";}"}).af$('outFile',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"Output file or if stdout if omitted (must have zinc, trio, json extension)\";}"}).af$('input',73728,'sys::File?',{'util::Arg':"util::Arg{help=\"Input file (must have zinc, trio, json extension)\";}"}).af$('recs',65664,'haystack::Dict[]?',{}).af$('recsById',65664,'[haystack::Ref:haystack::Dict]?',{}).af$('ns',65664,'xeto::LibNamespace?',{}).af$('hits',65664,'xeto::XetoLogRec[]?',{}).af$('numOk',67584,'sys::Int',{}).af$('numErr',67584,'sys::Int',{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('usage',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('run',271360,'sys::Int',xp,{}).am$('readInput',2048,'sys::Void',xp,{}).am$('loadNamespace',2048,'sys::Void',xp,{}).am$('runFits',2048,'sys::Void',xp,{}).am$('writeOutput',2048,'sys::Void',xp,{}).am$('writeConsole',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('con','util::Console',false)]),{}).am$('writeFile',2048,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
FitsCmdContext.type$.af$('cmd',73728,'xetoTools::FitsCmd',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cmd','xetoTools::FitsCmd',false)]),{}).am$('xetoReadById',271360,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false)]),{}).am$('xetoReadAllEachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false),new sys.Param('f','|xeto::Dict->sys::Obj?|',false)]),{}).am$('xetoIsSpec',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','sys::Str',false),new sys.Param('rec','xeto::Dict',false)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "xetoTools");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;util 1.0;web 1.0;xeto 3.1.11;xetoEnv 3.1.11;xetoDoc 3.1.11;haystack 3.1.11;def 3.1.11;defc 3.1.11");
m.set("pod.summary", "Xeto CLI tools");
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
  XetoCmd,
  Main,
};
