// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as compiler from './compiler.js'
import * as compilerEs from './compilerEs.js'
import * as concurrent from './concurrent.js'
import * as fandoc from './fandoc.js'
import * as util from './util.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Main extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Main.type$; }

  static main(args) {
    if (args.isEmpty()) {
      (args = sys.List.make(sys.Str.type$, ["help"]));
    }
    ;
    let name = args.first();
    let cmd = NodeJsCmd.find(sys.ObjUtil.coerce(name, sys.Str.type$));
    if (cmd == null) {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("ERROR: unknown nodeJs command '", name), "'"));
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

class NodeJsCmd extends util.AbstractMain {
  constructor() {
    super();
    const this$ = this;
    this.#dir = sys.Env.cur().tempDir().plus(sys.Uri.fromStr("nodeJs/"));
    this.#cjs = false;
    return;
  }

  typeof() { return NodeJsCmd.type$; }

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

  #cjs = false;

  cjs(it) {
    if (it === undefined) {
      return this.#cjs;
    }
    else {
      this.#cjs = it;
      return;
    }
  }

  #ms$Store = undefined;

  // private field reflection only
  __ms$Store(it) { if (it === undefined) return this.#ms$Store; else this.#ms$Store = it; }

  #emit$Store = undefined;

  // private field reflection only
  __emit$Store(it) { if (it === undefined) return this.#emit$Store; else this.#emit$Store = it; }

  static find(name) {
    const this$ = this;
    return NodeJsCmd.list().find((t) => {
      return (sys.ObjUtil.equals(t.name(), name) || t.aliases().contains(name));
    });
  }

  static list() {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(NodeJsCmd.type$.pod().types().mapNotNull((t) => {
      if ((t.isAbstract() || !t.fits(NodeJsCmd.type$))) {
        return null;
      }
      ;
      return sys.ObjUtil.coerce(t.make(), NodeJsCmd.type$.toNullable());
    }, NodeJsCmd.type$.toNullable()), sys.Type.find("nodeJs::NodeJsCmd[]"));
    acc.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    return acc;
  }

  appName() {
    return sys.Str.plus("nodeJs ", this.name());
  }

  log() {
    return sys.Log.get("nodeJs");
  }

  aliases() {
    return sys.List.make(sys.Str.type$);
  }

  checkForNode() {
    const this$ = this;
    let cmd = sys.List.make(sys.Str.type$, ["which", "-s", "node"]);
    if (sys.ObjUtil.equals("win32", sys.Env.cur().os())) {
      (cmd = sys.List.make(sys.Str.type$, ["where", "node"]));
    }
    ;
    if (sys.ObjUtil.compareNE(sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Process.make(cmd), (it) => {
      it.out(null);
      return;
    }), sys.Process.type$).run().join(), 0)) {
      this.err("Node not found");
      this.printLine("Please ensure Node.js is installed and available in your PATH");
      return false;
    }
    ;
    return true;
  }

  ms() {
    if (this.#ms$Store === undefined) {
      this.#ms$Store = this.ms$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#ms$Store, compilerEs.ModuleSystem.type$);
  }

  emit() {
    if (this.#emit$Store === undefined) {
      this.#emit$Store = this.emit$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#emit$Store, EmitUtil.type$);
  }

  printLine(line) {
    if (line === undefined) line = "";
    sys.Env.cur().out().printLine(line);
    return;
  }

  err(msg) {
    this.printLine(sys.Str.plus("ERROR: ", msg));
    return 1;
  }

  static make() {
    const $self = new NodeJsCmd();
    NodeJsCmd.make$($self);
    return $self;
  }

  static make$($self) {
    util.AbstractMain.make$($self);
    ;
    return;
  }

  ms$Once() {
    return ((this$) => { if (this$.#cjs) return compilerEs.CommonJs.make(this$.dir()); return compilerEs.Esm.make(this$.dir()); })(this);
  }

  emit$Once() {
    return EmitUtil.make(this);
  }

}

class EmitUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#depends = sys.List.make(sys.Pod.type$, [sys.ObjUtil.coerce(sys.Pod.find("sys"), sys.Pod.type$)]);
    this.#scriptJs = null;
    return;
  }

  typeof() { return EmitUtil.type$; }

  #cmd = null;

  // private field reflection only
  __cmd(it) { if (it === undefined) return this.#cmd; else this.#cmd = it; }

  #depends = null;

  // private field reflection only
  __depends(it) { if (it === undefined) return this.#depends; else this.#depends = it; }

  #scriptJs = null;

  // private field reflection only
  __scriptJs(it) { if (it === undefined) return this.#scriptJs; else this.#scriptJs = it; }

  static make(cmd) {
    const $self = new EmitUtil();
    EmitUtil.make$($self,cmd);
    return $self;
  }

  static make$($self,cmd) {
    ;
    $self.#cmd = cmd;
    return;
  }

  ms() {
    return this.#cmd.ms();
  }

  isCjs() {
    return sys.ObjUtil.equals(this.ms().moduleType(), "cjs");
  }

  withDepends(pods) {
    const this$ = this;
    this.#depends = sys.Pod.orderByDepends(sys.Pod.flattenDepends(pods)).findAll((it) => {
      return (sys.ObjUtil.equals(it.name(), "sys") || sys.ObjUtil.equals(it.meta().get("pod.js"), "true"));
    });
    return this;
  }

  withScript(scriptJs) {
    this.#scriptJs = scriptJs;
    return this;
  }

  podJsFile(pod,name) {
    if (name === undefined) name = pod.name();
    let ext = ((this$) => { if (this$.isCjs()) return "js"; return "mjs"; })(this);
    let script = sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), "."), ext);
    return pod.file(sys.Str.toUri(sys.Str.plus("/js/", script)), false);
  }

  writePackageJson(json) {
    if (json === undefined) json = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj?]"));
    if (json.get("name") == null) {
      json.set("name", "@fantom/fan");
    }
    ;
    if (json.get("version") == null) {
      json.set("version", sys.Pod.find("sys").version().toStr());
    }
    ;
    this.ms().writePackageJson(json);
    return;
  }

  writeNodeModules() {
    this.writeFanJs();
    this.writeNode();
    this.writeDepends();
    this.writeScriptJs();
    this.writeMimeJs();
    this.writeUnitsJs();
    this.writeIndexedPropsJs();
    return;
  }

  writeFanJs() {
    let out = this.ms().file("fan").out();
    this.podJsFile(sys.ObjUtil.coerce(sys.Pod.find("sys"), sys.Pod.type$), "fan").in().pipe(out);
    out.flush().close();
    return;
  }

  writeNode() {
    const this$ = this;
    let modules = sys.List.make(sys.Str.type$, ["os", "path", "fs", "crypto", "url", "zlib"]);
    let out = this.ms().file("node").out();
    this.ms().writeBeginModule(out);
    modules.each((m,i) => {
      this$.ms().writeInclude(out, m);
      return;
    });
    this.ms().writeExports(out, modules);
    this.ms().writeEndModule(out).flush().close();
    return;
  }

  writeDepends() {
    const this$ = this;
    let copyOpts = sys.Map.__fromLiteral(["overwrite"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool"));
    this.#depends.each((pod) => {
      let file = this$.podJsFile(pod);
      let target = this$.ms().file(pod.name());
      if (file != null) {
        file.copyTo(target, copyOpts);
      }
      ;
      return;
    });
    return;
  }

  writeScriptJs() {
    if (this.#scriptJs == null) {
      return;
    }
    ;
    let out = this.ms().file(this.#scriptJs.basename()).out();
    try {
      this.#scriptJs.in().pipe(out);
    }
    finally {
      out.flush().close();
    }
    ;
    return;
  }

  writeMimeJs() {
    let out = this.ms().file("fan_mime").out();
    compilerEs.JsExtToMime.make(this.ms()).write(out);
    out.flush().close();
    return;
  }

  writeUnitsJs() {
    let out = this.ms().file("fan_units").out();
    compilerEs.JsUnitDatabase.make(this.ms()).write(out);
    out.flush().close();
    return;
  }

  writeIndexedPropsJs() {
    let out = this.ms().file("fan_indexed_props").out();
    compilerEs.JsIndexedProps.make(this.ms()).write(out);
    out.flush().close();
    return;
  }

  includeStatements() {
    const this$ = this;
    let baseDir = sys.Str.plus(sys.Str.plus("./", this.ms().moduleDir().name()), "/");
    let buf = sys.Buf.make();
    this.#depends.each((pod) => {
      if (sys.ObjUtil.equals("sys", pod.name())) {
        this$.ms().writeInclude(buf.out(), "sys.ext", baseDir);
        this$.ms().writeInclude(buf.out(), "fan_mime.ext", baseDir);
        this$.ms().writeInclude(buf.out(), "fan_indexed_props.ext", baseDir);
        this$.ms().writeInclude(buf.out(), "fan_units.ext", baseDir);
      }
      else {
        this$.ms().writeInclude(buf.out(), sys.Str.plus(sys.Str.plus("", pod.name()), ".ext"), baseDir);
      }
      ;
      return;
    });
    if (this.#scriptJs != null) {
      this.ms().writeInclude(buf.out(), sys.Str.plus(sys.Str.plus("", this.#scriptJs.basename()), ".ext"), baseDir);
    }
    ;
    return sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllStr();
  }

  envDirs() {
    let buf = sys.StrBuf.make();
    buf.add(sys.Str.plus(sys.Str.plus("  sys.Env.cur().__homeDir = sys.File.os(", sys.Str.toCode(sys.Env.cur().homeDir().pathStr())), ");\n"));
    buf.add(sys.Str.plus(sys.Str.plus("  sys.Env.cur().__workDir = sys.File.os(", sys.Str.toCode(sys.Env.cur().workDir().pathStr())), ");\n"));
    buf.add(sys.Str.plus(sys.Str.plus("  sys.Env.cur().__tempDir = sys.File.os(", sys.Str.toCode(sys.Env.cur().tempDir().pathStr())), ");\n"));
    return buf.toStr();
  }

}

class ExtractCmd extends NodeJsCmd {
  constructor() {
    super();
    const this$ = this;
    this.dir(sys.Env.cur().tempDir().plus(sys.Uri.fromStr("extract/")));
    this.#clean = false;
    this.#pods = sys.List.make(sys.Str.type$);
    return;
  }

  typeof() { return ExtractCmd.type$; }

  #dir = null;

  dir(it) {
    if (it === undefined) {
      return NodeJsCmd.prototype.dir.call(this);
    }
    else {
      NodeJsCmd.prototype.dir.call(this, it);
      return;
    }
  }

  #clean = false;

  clean(it) {
    if (it === undefined) {
      return this.#clean;
    }
    else {
      this.#clean = it;
      return;
    }
  }

  #pods = null;

  pods(it) {
    if (it === undefined) {
      return this.#pods;
    }
    else {
      this.#pods = it;
      return;
    }
  }

  name() {
    return "extract";
  }

  summary() {
    return "Extract JavaScript files from pods";
  }

  run() {
    const this$ = this;
    if (this.#clean) {
      this.dir().delete();
    }
    ;
    let todo = sys.Pod.list();
    if (!this.#pods.isEmpty()) {
      (todo = sys.ObjUtil.coerce(this.#pods.map((name) => {
        return sys.ObjUtil.coerce(sys.Pod.find(name), sys.Pod.type$);
      }, sys.Pod.type$), sys.Type.find("sys::Pod[]")));
    }
    ;
    todo.each((pod) => {
      let f = pod.file(sys.Str.toUri(sys.Str.plus(sys.Str.plus("/js/", pod.name()), ".js")), false);
      if (f == null) {
        return;
      }
      ;
      this$.log().info(sys.Str.plus(sys.Str.plus("Extract ", pod.name()), ".js"));
      let out = this$.dir().plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", pod.name()), ".js"))).out();
      f.in().pipe(out);
      out.flush().close();
      return;
    });
    this.log().info(sys.Str.plus("Extracted JavaScript to ", this.dir()));
    return 0;
  }

  static make() {
    const $self = new ExtractCmd();
    ExtractCmd.make$($self);
    return $self;
  }

  static make$($self) {
    NodeJsCmd.make$($self);
    ;
    return;
  }

}

class HelpCmd extends NodeJsCmd {
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
      let cmd = NodeJsCmd.find(cmdName);
      if (cmd == null) {
        return this.err(sys.Str.plus(sys.Str.plus("Unknown help command '", cmdName), "'"));
      }
      ;
      this.printLine();
      this.printLine(cmd.summary());
      this.printLine();
      if (!cmd.aliases().isEmpty()) {
        this.printLine("Aliases:");
        this.printLine(sys.Str.plus("  ", cmd.aliases().join(" ")));
      }
      ;
      let ret = cmd.usage();
      this.printLine();
      return ret;
    }
    ;
    let cmds = NodeJsCmd.list();
    let maxName = 4;
    cmds.each((cmd) => {
      (maxName = sys.Int.max(maxName, sys.Str.size(cmd.name())));
      return;
    });
    this.printLine();
    this.printLine("nodeJs commands:");
    this.printLine();
    NodeJsCmd.list().each((cmd) => {
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
    NodeJsCmd.make$($self);
    ;
    return;
  }

}

class RunCmd extends NodeJsCmd {
  constructor() {
    super();
    const this$ = this;
    this.#tempPod = sys.Str.plus("temp", sys.ObjUtil.coerce(sys.Duration.now().toMillis(), sys.Obj.type$.toNullable()));
    return;
  }

  typeof() { return RunCmd.type$; }

  #keep = false;

  keep(it) {
    if (it === undefined) {
      return this.#keep;
    }
    else {
      this.#keep = it;
      return;
    }
  }

  #script = null;

  script(it) {
    if (it === undefined) {
      return this.#script;
    }
    else {
      this.#script = it;
      return;
    }
  }

  #tempPod = null;

  tempPod() { return this.#tempPod; }

  __tempPod(it) { if (it === undefined) return this.#tempPod; else this.#tempPod = it; }

  name() {
    return "run";
  }

  summary() {
    return "Run a Fantom script in Node.js";
  }

  run() {
    if (!this.#script.exists()) {
      return this.err(sys.Str.plus(sys.Str.plus("", this.#script), " not found"));
    }
    ;
    this.emit().withScript(this.compile());
    this.emit().writePackageJson(sys.Map.__fromLiteral(["name","main"], ["scriptRunner","scriptRunner.js"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.emit().writeNodeModules();
    let template = sys.ObjUtil.typeof(this).pod().file(sys.Uri.fromStr("/res/scriptRunnerTemplate.js")).readAllStr();
    (template = sys.Str.replace(template, "//{{include}}", this.emit().includeStatements()));
    (template = sys.Str.replace(template, "{{tempPod}}", this.#tempPod));
    (template = sys.Str.replace(template, "//{{envDirs}}", this.emit().envDirs()));
    let f = this.dir().plus(sys.Uri.fromStr("scriptRunner.js"));
    f.out().writeChars(template).flush().close();
    sys.Process.make(sys.List.make(sys.Str.type$, ["node", sys.Str.plus("", f.normalize().osPath())])).run().join();
    if (!this.#keep) {
      this.dir().delete();
    }
    ;
    return 0;
  }

  compile() {
    const this$ = this;
    let input = compiler.CompilerInput.make();
    input.podName(this.#tempPod);
    input.summary("");
    input.version(sys.Version.fromStr("0"));
    input.log().level(sys.LogLevel.silent());
    input.isScript(true);
    input.baseDir(this.#script.parent());
    input.srcStr(this.#script.in().readAllStr());
    input.srcStrLoc(compiler.Loc.make(""));
    input.mode(compiler.CompilerInputMode.str());
    input.output(compiler.CompilerOutputMode.transientPod());
    let $compiler = compiler.Compiler.make(input);
    let co = null;
    try {
      (co = $compiler.compile());
    }
    catch ($_u2) {
      $_u2 = sys.Err.make($_u2);
      if ($_u2 instanceof sys.Err) {
        let err = $_u2;
        ;
        throw err;
      }
      else {
        throw $_u2;
      }
    }
    ;
    if (co == null) {
      let buf = sys.StrBuf.make();
      $compiler.errs().each((err) => {
        buf.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(err.line(), sys.Obj.type$.toNullable())), ":"), sys.ObjUtil.coerce(err.col(), sys.Obj.type$.toNullable())), ":"), err.msg()), "\n"));
        return;
      });
      throw sys.Err.make(buf.toStr());
    }
    ;
    this.emit().withDepends(sys.ObjUtil.coerce($compiler.depends().map((it) => {
      return sys.Pod.find(it.name());
    }, sys.Obj.type$.toNullable()), sys.Type.find("sys::Pod[]")));
    return ((this$) => { if (this$.cjs()) return sys.Str.toBuf($compiler.cjs()).toFile(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", this$.#tempPod), ".js"))); return sys.Str.toBuf($compiler.esm()).toFile(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", this$.#tempPod), ".js"))); })(this);
  }

  static make() {
    const $self = new RunCmd();
    RunCmd.make$($self);
    return $self;
  }

  static make$($self) {
    NodeJsCmd.make$($self);
    ;
    return;
  }

}

class TestCmd extends NodeJsCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TestCmd.type$; }

  #keep = false;

  keep(it) {
    if (it === undefined) {
      return this.#keep;
    }
    else {
      this.#keep = it;
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

  name() {
    return "test";
  }

  summary() {
    return "Run tests in Node.js";
  }

  run() {
    if (!this.checkForNode()) {
      return 1;
    }
    ;
    if (this.#targets == null) {
      return this.usage();
    }
    ;
    this.emit().withDepends(this.targetPods());
    this.emit().writePackageJson(sys.Map.__fromLiteral(["name","main"], ["testRunner","testRunner.js"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.emit().writeNodeModules();
    this.testRunner();
    if (!this.#keep) {
      this.dir().delete();
    }
    ;
    return 0;
  }

  targetPods() {
    const this$ = this;
    let pods = this.#targets.map((spec) => {
      let name = spec;
      if (sys.Str.contains(spec, "::")) {
        let i = sys.Str.index(spec, "::");
        (name = sys.Str.getRange(spec, sys.Range.make(0, sys.Int.minus(sys.ObjUtil.coerce(i, sys.Int.type$), 1))));
      }
      ;
      return sys.ObjUtil.coerce(sys.Pod.find(name), sys.Pod.type$);
    }, sys.Pod.type$);
    return sys.ObjUtil.coerce(pods.add(sys.Pod.find("util")).unique(), sys.Type.find("sys::Pod[]"));
  }

  testRunner() {
    let template = sys.ObjUtil.typeof(this).pod().file(sys.Uri.fromStr("/res/testRunnerTemplate.js")).readAllStr();
    (template = sys.Str.replace(template, "//{{include}}", this.emit().includeStatements()));
    (template = sys.Str.replace(template, "//{{targets}}", this.fanTargets()));
    (template = sys.Str.replace(template, "//{{envDirs}}", this.emit().envDirs()));
    let f = this.dir().plus(sys.Uri.fromStr("testRunner.js"));
    f.out().writeChars(template).flush().close();
    sys.Process.make(sys.List.make(sys.Str.type$, ["node", sys.Str.plus("", f.normalize().osPath())])).run().join();
    return;
  }

  fanTargets() {
    const this$ = this;
    let s = sys.StrBuf.make();
    s.add("const targets = sys.List.make(sys.Type.find(\"sys::Str\"),[");
    this.#targets.each((spec,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        s.add(",");
      }
      ;
      s.add(sys.Str.toCode(spec));
      return;
    });
    return s.add("]);\n").toStr();
  }

  static make() {
    const $self = new TestCmd();
    TestCmd.make$($self);
    return $self;
  }

  static make$($self) {
    NodeJsCmd.make$($self);
    return;
  }

}

class InitCmd extends NodeJsCmd {
  constructor() {
    super();
    const this$ = this;
    this.dir(sys.Env.cur().homeDir().plus(sys.Uri.fromStr("lib/es/")));
    return;
  }

  typeof() { return InitCmd.type$; }

  #dir = null;

  dir(it) {
    if (it === undefined) {
      return NodeJsCmd.prototype.dir.call(this);
    }
    else {
      NodeJsCmd.prototype.dir.call(this, it);
      return;
    }
  }

  name() {
    return "init";
  }

  summary() {
    return "Initialize Node.js environment for running Fantom modules";
  }

  run() {
    this.emit().writePackageJson();
    this.emit().writeNodeModules();
    this.writeFantomJs();
    this.writeTsDecl();
    this.log().info(sys.Str.plus("Initialized Node.js in: ", this.dir()));
    return 0;
  }

  writeFantomJs() {
    const this$ = this;
    let out = this.ms().file("fantom").out();
    this.ms().writeBeginModule(out);
    sys.List.make(sys.Str.type$, ["sys", "fan_indexed_props", "fan_mime", "fan_units"]).each((m) => {
      this$.ms().writeInclude(out, sys.Str.plus(sys.Str.plus("", m), ".ext"));
      return;
    });
    sys.List.make(sys.Str.type$, ["os", "path", "fs", "url"]).each((m) => {
      this$.ms().writeInclude(out, sys.Str.plus("", m));
      return;
    });
    let template = sys.ObjUtil.typeof(this).pod().file(sys.Uri.fromStr("/res/fantomTemplate.js")).readAllStr();
    out.writeChars(template);
    this.ms().writeExports(out, sys.List.make(sys.Str.type$, ["sys", "boot"]));
    this.ms().writeEndModule(out).flush().close();
    return;
  }

  writeTsDecl() {
    let sysDecl = this.ms().moduleDir().plus(sys.Uri.fromStr("sys.d.ts"));
    let out = sysDecl.out();
    GenTsDecl.genForPod(sys.ObjUtil.coerce(sys.Pod.find("sys"), sys.Pod.type$), out, sys.Map.__fromLiteral(["allTypes"], [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Bool")));
    out.flush().close();
    return;
  }

  static make() {
    const $self = new InitCmd();
    InitCmd.make$($self);
    return $self;
  }

  static make$($self) {
    NodeJsCmd.make$($self);
    ;
    return;
  }

}

class GenTsDecl extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#deps = null;
    this.#pmap = sys.ObjUtil.coerce(((this$) => { let $_u4 = sys.Map.__fromLiteral(["sys::Bool","sys::Decimal","sys::Float","sys::Int","sys::Num","sys::Str","sys::Void","sys::Func"], ["boolean","number","number","number","number","string","void","(...args: any[]) => R"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")); if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["sys::Bool","sys::Decimal","sys::Float","sys::Int","sys::Num","sys::Str","sys::Void","sys::Func"], ["boolean","number","number","number","number","string","void","(...args: any[]) => R"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))); })(this), sys.Type.find("[sys::Str:sys::Str]"));
    return;
  }

  typeof() { return GenTsDecl.type$; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  #pod = null;

  // private field reflection only
  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  #opts = null;

  // private field reflection only
  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #docWriter = null;

  // private field reflection only
  __docWriter(it) { if (it === undefined) return this.#docWriter; else this.#docWriter = it; }

  #deps = null;

  // private field reflection only
  __deps(it) { if (it === undefined) return this.#deps; else this.#deps = it; }

  #pmap = null;

  // private field reflection only
  __pmap(it) { if (it === undefined) return this.#pmap; else this.#pmap = it; }

  static genForPod(pod,out,opts) {
    if (opts === undefined) opts = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj?]"));
    const this$ = this;
    let ns = compiler.ReflectNamespace.make();
    let c = compiler.Compiler.make(sys.ObjUtil.coerce(sys.ObjUtil.with(compiler.CompilerInput.make(), (it) => {
      it.podName("dummy");
      return;
    }), compiler.CompilerInput.type$));
    c.ns(ns);
    sys.ObjUtil.trap(ns,"c", sys.List.make(sys.Obj.type$.toNullable(), [c]));
    GenTsDecl.make(out, compiler.ReflectPod.make(ns, pod), opts).run();
    return;
  }

  static make(out,pod,opts) {
    const $self = new GenTsDecl();
    GenTsDecl.make$($self,out,pod,opts);
    return $self;
  }

  static make$($self,out,pod,opts) {
    ;
    $self.#out = out;
    $self.#pod = pod;
    $self.#opts = opts;
    $self.#docWriter = TsDocWriter.make(out);
    return;
  }

  allTypes() {
    return sys.ObjUtil.equals(this.#opts.get("allTypes"), true);
  }

  genNoDoc() {
    return sys.ObjUtil.equals(this.#opts.get("genNoDoc"), true);
  }

  isNoDoc(node) {
    return (node.isNoDoc() && !this.genNoDoc());
  }

  run() {
    const this$ = this;
    let genTypes = this.#pod.types().findAll((type) => {
      if ((type.isSynthetic() || type.isInternal() || this$.isNoDoc(type))) {
        return false;
      }
      ;
      if ((!this$.allTypes() && !type.hasFacet("sys::Js"))) {
        return false;
      }
      ;
      return true;
    });
    if (genTypes.isEmpty()) {
      return;
    }
    ;
    this.#deps = sys.ObjUtil.coerce(this.#pod.depends().map((dep) => {
      return dep.name();
    }, sys.Str.type$), sys.Type.find("sys::Str[]?"));
    this.#deps.each((dep) => {
      this$.#out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("import * as ", dep), " from './"), dep), ".js';\n"));
      return;
    });
    if (sys.ObjUtil.equals(this.#pod.name(), "sys")) {
      this.printJsObj();
    }
    ;
    this.#out.writeChar(10);
    genTypes.each((type) => {
      this$.genType(type);
      return;
    });
    if (sys.ObjUtil.equals(this.#pod.name(), "sys")) {
      this.printObjUtil();
    }
    ;
    return;
  }

  genType(type) {
    const this$ = this;
    let isList = false;
    let isMap = false;
    this.setupDoc(this.#pod.name(), type.name());
    let classParams = "";
    if (sys.ObjUtil.equals(type.signature(), "sys::List")) {
      (classParams = "<V = unknown>");
      (isList = true);
    }
    ;
    if (sys.ObjUtil.equals(type.signature(), "sys::Map")) {
      (classParams = "<K = unknown, V = unknown>");
      (isMap = true);
    }
    ;
    let abstr = ((this$) => { if (type.isMixin()) return "abstract "; return ""; })(this);
    let extends$ = "";
    if (type.base() != null) {
      (extends$ = sys.Str.plus(sys.Str.plus("extends ", this.getNamespacedType(type.base().name(), type.base().pod().name())), " "));
    }
    ;
    if (!type.mixins().isEmpty()) {
      let implement = type.mixins().map((it) => {
        return this$.getNamespacedType(it.name(), it.pod().name());
      }, sys.Obj.type$.toNullable()).join(", ");
      extends$ = sys.Str.plus(extends$, sys.Str.plus(sys.Str.plus("implements ", implement), " "));
    }
    else {
      if (isList) {
        extends$ = sys.Str.plus(extends$, "implements Iterable<V> ");
      }
      ;
    }
    ;
    this.printDoc(type, 0);
    this.#out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("export ", abstr), "class "), type.name()), ""), classParams), " "), extends$), "{\n"));
    let hasItBlockCtor = type.ctors().any((m) => {
      return m.params().any((p) => {
        return p.paramType().isFunc();
      });
    });
    let writtenSlots = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Str[]"));
    if (true) {
      let t = this.getNamespacedType("Type", "sys");
      this.#out.print(sys.Str.plus(sys.Str.plus("  static type\$: ", t), "\n"));
    }
    ;
    type.fields().each((field) => {
      if (!this$.includeSlot(type, field)) {
        return;
      }
      ;
      this$.writeField(type, field, hasItBlockCtor);
      writtenSlots.add(field.name());
      return;
    });
    if (isList) {
      this.#out.print("  /** List Iterator */\n  [Symbol.iterator](): Iterator<V>;\n  /** Constructor for of[] with optional initial values */\n  static make(of\$: Type, ...args: unknown[]): List;\n");
    }
    ;
    type.methods().each((method) => {
      if (!this$.includeSlot(type, method)) {
        return;
      }
      ;
      this$.writeMethod(type, method);
      writtenSlots.add(method.name());
      return;
    });
    type.mixins().each((ref) => {
      ref.slots().each((slot) => {
        if (writtenSlots.contains(slot.name())) {
          return;
        }
        ;
        if (!slot.parent().isMixin()) {
          return;
        }
        ;
        if (this$.isNoDoc(slot)) {
          return;
        }
        ;
        if (slot.isStatic()) {
          return;
        }
        ;
        if (sys.ObjUtil.is(slot, compiler.CField.type$)) {
          this$.writeField(ref, sys.ObjUtil.coerce(slot, compiler.CField.type$), hasItBlockCtor);
        }
        else {
          if (sys.ObjUtil.is(slot, compiler.CMethod.type$)) {
            this$.writeMethod(ref, sys.ObjUtil.coerce(slot, compiler.CMethod.type$));
          }
          ;
        }
        ;
        writtenSlots.add(slot.name());
        return;
      });
      return;
    });
    this.#out.print("}\n\n");
    return;
  }

  includeSlot(type,slot) {
    if (sys.ObjUtil.compareNE(slot.parent(), type)) {
      return false;
    }
    ;
    if (this.isNoDoc(slot)) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(slot.qname(), "sys::List.make")) {
      return false;
    }
    ;
    return slot.isPublic();
  }

  writeField(parent,field,hasItBlockCtor) {
    let name = compilerEs.JsNode.methodToJs(field.name());
    let staticStr = ((this$) => { if (field.isStatic()) return "static "; return ""; })(this);
    let typeStr = this.getJsType(field.fieldType(), ((this$) => { if (field.isStatic()) return parent; return null; })(this));
    this.printDoc(field, 2);
    this.#out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", staticStr), ""), name), "(): "), typeStr), ";\n"));
    if (!field.isConst()) {
      this.#out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", staticStr), ""), name), "(it: "), typeStr), "): void;\n"));
    }
    else {
      if (hasItBlockCtor) {
        this.#out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", staticStr), "__"), name), "(it: "), typeStr), "): void;\n"));
      }
      ;
    }
    ;
    return;
  }

  writeMethod(parent,method) {
    const this$ = this;
    let isStatic = (method.isStatic() || method.isCtor() || this.#pmap.containsKey(parent.signature()));
    let staticStr = ((this$) => { if (isStatic) return "static "; return ""; })(this);
    let name = compilerEs.JsNode.methodToJs(method.name());
    if (sys.ObjUtil.equals(parent.signature(), "sys::Func")) {
      name = sys.Str.plus(name, "<R>");
    }
    ;
    let inputList = method.params().map((p) => {
      return this$.toMethodParam(parent, method, isStatic, p);
    }, sys.Str.type$);
    if ((!method.isStatic() && !method.isCtor() && this.#pmap.containsKey(parent.signature()))) {
      inputList.insert(0, sys.Str.plus("self: ", this.#pmap.get(parent.signature())));
    }
    ;
    if (method.isCtor()) {
      inputList.add("...args: unknown[]");
    }
    ;
    let inputs = inputList.join(", ");
    let output = this.toMethodReturn(parent, method);
    this.printDoc(method, 2);
    this.#out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", staticStr), ""), name), "("), inputs), "): "), output), ";\n"));
    return;
  }

  toMethodParam(parent,method,isStatic,p) {
    let paramName = compilerEs.JsNode.pickleName(p.name(), this.#deps);
    if (p.hasDefault()) {
      paramName = sys.Str.plus(paramName, "?");
    }
    ;
    let paramType = this.toMethodSigType(method, p.paramType(), ((this$) => { if (isStatic) return parent; return null; })(this));
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", paramName), ": "), paramType);
  }

  toMethodReturn(type,method) {
    let output = ((this$) => { if (method.isCtor()) return type.name(); return this$.toMethodSigType(method, method.returnType(), ((this$) => { if (this$.#pmap.containsKey(type.signature())) return type; return null; })(this$)); })(this);
    if ((sys.ObjUtil.equals(method.qname(), "sys::Obj.toImmutable") || sys.ObjUtil.equals(method.qname(), "sys::List.ro") || sys.ObjUtil.equals(method.qname(), "sys::Map.ro"))) {
      (output = sys.Str.plus(sys.Str.plus("Readonly<", output), ">"));
    }
    ;
    return output;
  }

  toMethodSigType(method,sigType,self$) {
    let ts = this.getJsType(sigType, self$);
    if ((sys.ObjUtil.equals(ts, "sys.JsObj") && method.hasFacet("sys::Js"))) {
      return "any";
    }
    ;
    return ts;
  }

  getJsType(type,thisType) {
    if (thisType === undefined) thisType = null;
    const this$ = this;
    if ((this.#pmap.containsKey(type.signature()) && !type.isFunc())) {
      return sys.ObjUtil.coerce(this.#pmap.get(type.signature()), sys.Str.type$);
    }
    ;
    if (type.isNullable()) {
      return sys.Str.plus(this.getJsType(type.toNonNullable(), thisType), " | null");
    }
    ;
    if (type.isThis()) {
      return ((this$) => { if (thisType == null) return "this"; return thisType.name(); })(this);
    }
    ;
    if (type.isGenericParameter()) {
      let $_u13 = type.name();
      if (sys.ObjUtil.equals($_u13, "L")) {
        return "List<V>";
      }
      else if (sys.ObjUtil.equals($_u13, "M")) {
        return "Map<K,V>";
      }
      else if (sys.ObjUtil.equals($_u13, "R")) {
        return "R";
      }
      else {
        return "unknown";
      }
      ;
    }
    ;
    if ((type.isList() || type.isMap())) {
      if (sys.ObjUtil.is(type, compiler.TypeRef.type$)) {
        (type = type.deref());
      }
      ;
      let res = this.getNamespacedType(type.name(), "sys");
      if (!type.isGeneric()) {
        let k = ((this$) => { if (sys.ObjUtil.is(type, compiler.MapType.type$)) return sys.Str.plus(this$.getJsType(sys.ObjUtil.coerce(sys.ObjUtil.trap(type,"k", sys.List.make(sys.Obj.type$.toNullable(), [])), compiler.CType.type$), thisType), ", "); return ""; })(this);
        let v = this.getJsType(sys.ObjUtil.coerce(sys.ObjUtil.trap(type,"v", sys.List.make(sys.Obj.type$.toNullable(), [])), compiler.CType.type$), thisType);
        res = sys.Str.plus(res, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<", k), ""), v), ">"));
      }
      ;
      return res;
    }
    ;
    if (type.isFunc()) {
      if (sys.ObjUtil.is(type, compiler.TypeRef.type$)) {
        (type = type.deref());
      }
      ;
      if (!sys.ObjUtil.is(type, compiler.FuncType.type$)) {
        return "Function";
      }
      ;
      let args = sys.ObjUtil.coerce(sys.ObjUtil.trap(sys.ObjUtil.trap(type,"params", sys.List.make(sys.Obj.type$.toNullable(), [])),"dup", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Type.find("compiler::CType[]"));
      let inputs = args.map((t,i) => {
        return sys.Str.plus(sys.Str.plus(sys.Str.plus("arg", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), ": "), this$.getJsType(t, thisType));
      }, sys.Str.type$).join(", ");
      let output = this.getJsType(sys.ObjUtil.coerce(sys.ObjUtil.trap(type,"ret", sys.List.make(sys.Obj.type$.toNullable(), [])), compiler.CType.type$), thisType);
      return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("((", inputs), ") => "), output), ")");
    }
    ;
    if (sys.ObjUtil.equals(type.signature(), "sys::Obj")) {
      return this.getNamespacedType("JsObj", "sys");
    }
    ;
    return this.getNamespacedType(type.name(), type.pod().name());
  }

  getNamespacedType(typeName,typePod) {
    if (sys.ObjUtil.equals(typePod, this.#pod.name())) {
      return typeName;
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", typePod), "."), typeName);
  }

  setupDoc(pod,type) {
    this.#docWriter.pod(pod);
    this.#docWriter.type(type);
    return;
  }

  printDoc(node,indent) {
    let doc = node.doc();
    let text = ((this$) => { let $_u15 = ((this$) => { let $_u16 = doc; if ($_u16 == null) return null; return doc.text(); })(this$); if ($_u15 == null) return null; return sys.Str.trimToNull(((this$) => { let $_u17 = doc; if ($_u17 == null) return null; return doc.text(); })(this$)); })(this);
    if (node.isNoDoc()) {
      if (!this.genNoDoc()) {
        return;
      }
      ;
      let insert = "NODOC API\n";
      (text = ((this$) => { if (text == null) return insert; return sys.Str.plus(sys.Str.plus(sys.Str.plus("", insert), "\n"), text); })(this));
    }
    ;
    if (text == null) {
      return;
    }
    ;
    let parser = fandoc.FandocParser.make();
    parser.silent(true);
    let $fandoc = parser.parse(sys.ObjUtil.toStr(node), sys.Str.in(text));
    this.#docWriter.indent(indent);
    $fandoc.write(this.#docWriter);
    return;
  }

  printJsObj() {
    this.#out.print("export type JsObj = Obj | number | string | boolean | Function\n");
    return;
  }

  printObjUtil() {
    this.#out.print("export class ObjUtil {\n  static hash(obj: any): number\n  static equals(a: any, b: JsObj | null): boolean\n  static compare(a: any, b: JsObj | null, op?: boolean): number\n  static compareNE(a: any, b: JsObj | null): boolean\n  static compareLT(a: any, b: JsObj | null): boolean\n  static compareLE(a: any, b: JsObj | null): boolean\n  static compareGE(a: any, b: JsObj | null): boolean\n  static compareGT(a: any, b: JsObj | null): boolean\n  static is(obj: any, type: Type): boolean\n  static as(obj: any, type: Type): any\n  static coerce(obj: any, type: Type): any\n  static typeof(obj: any): Type\n  static trap(obj: any, name: string, args: List<JsObj | null> | null): JsObj | null\n  static doTrap(obj: any, name: string, args: List<JsObj | null> | null, type: Type): JsObj | null\n  static isImmutable(obj: any): boolean\n  static toImmutable(obj: any): JsObj | null\n  static with<T>(self: T, f: ((it: T) => void)): T\n  static toStr(obj: any): string\n  static echo(obj: any): void\n}\n");
    return;
  }

}

class TsDocWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#indent = 0;
    this.#ind = "";
    this.#pod = "";
    this.#type = "";
    this.#listIndexes = sys.List.make(ListIndex.type$);
    this.#lineWidth = 0;
    this.#maxWidth = 60;
    return;
  }

  typeof() { return TsDocWriter.type$; }

  #indent = 0;

  indent(it) {
    if (it === undefined) {
      return this.#indent;
    }
    else {
      this.#ind = sys.Str.mult(" ", it);
      this.#indent = it;
      return;
    }
  }

  #ind = null;

  // private field reflection only
  __ind(it) { if (it === undefined) return this.#ind; else this.#ind = it; }

  #pod = null;

  pod(it) {
    if (it === undefined) {
      return this.#pod;
    }
    else {
      this.#pod = it;
      return;
    }
  }

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

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  #started = false;

  // private field reflection only
  __started(it) { if (it === undefined) return this.#started; else this.#started = it; }

  #listIndexes = null;

  // private field reflection only
  __listIndexes(it) { if (it === undefined) return this.#listIndexes; else this.#listIndexes = it; }

  #inPre = false;

  // private field reflection only
  __inPre(it) { if (it === undefined) return this.#inPre; else this.#inPre = it; }

  #inBlockquote = false;

  // private field reflection only
  __inBlockquote(it) { if (it === undefined) return this.#inBlockquote; else this.#inBlockquote = it; }

  #lineWidth = 0;

  // private field reflection only
  __lineWidth(it) { if (it === undefined) return this.#lineWidth; else this.#lineWidth = it; }

  #maxWidth = 0;

  // private field reflection only
  __maxWidth(it) { if (it === undefined) return this.#maxWidth; else this.#maxWidth = it; }

  static make(out) {
    const $self = new TsDocWriter();
    TsDocWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    ;
    $self.#out = out;
    return;
  }

  docStart(doc) {
    this.#out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#ind), "/**\n"), this.#ind), " * "));
    this.#started = false;
    return;
  }

  docEnd(doc) {
    this.#out.print(sys.Str.plus(sys.Str.plus("\n", this.#ind), " */\n"));
    return;
  }

  elemStart(elem) {
    let $_u19 = elem.id();
    if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.doc())) {
      return;
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.emphasis())) {
      this.#out.writeChar(42);
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.strong())) {
      this.#out.print("**");
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.code())) {
      this.#out.writeChar(96);
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.link())) {
      let link = sys.ObjUtil.coerce(elem, fandoc.Link.type$);
      this.onLink(link);
      if (link.isCode()) {
        this.#out.print(sys.Str.plus(sys.Str.plus("{@link ", link.uri()), " | "));
      }
      else {
        this.#out.writeChar(91);
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.image())) {
      let img = sys.ObjUtil.coerce(elem, fandoc.Image.type$);
      let str = sys.Str.plus("![", img.alt());
      this.#lineWidth = sys.Int.plus(this.#lineWidth, sys.Str.size(str));
      this.#out.print(str);
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.heading())) {
      let head = sys.ObjUtil.coerce(elem, fandoc.Heading.type$);
      this.printLine();
      this.printLine();
      this.#out.print(sys.Str.padl(sys.Str.defVal(), head.level(), 35)).writeChar(32);
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.para())) {
      let para = sys.ObjUtil.coerce(elem, fandoc.Para.type$);
      if (!this.#listIndexes.isEmpty()) {
        let indent = sys.Int.mult(this.#listIndexes.size(), 2);
        this.printLine();
        this.printLine();
        this.#out.print(sys.Str.padl(sys.Str.defVal(), indent));
      }
      else {
        if (this.#started) {
          this.printLine();
          this.printLine();
        }
        ;
      }
      ;
      if (this.#inBlockquote) {
        this.#out.print("> ");
      }
      ;
      if (para.admonition() != null) {
        this.#out.print(sys.Str.plus(sys.Str.plus("", para.admonition()), ": "));
      }
      ;
      this.#lineWidth = 0;
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.pre())) {
      this.printLine();
      this.#out.print("```");
      this.printLine();
      this.#inPre = true;
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.blockQuote())) {
      this.#inBlockquote = true;
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.unorderedList())) {
      this.#listIndexes.push(ListIndex.make());
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.orderedList())) {
      let ol = sys.ObjUtil.coerce(elem, fandoc.OrderedList.type$);
      this.#listIndexes.push(ListIndex.make(ol.style()));
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.listItem())) {
      this.printLine();
      let indent = sys.Int.mult(sys.Int.minus(this.#listIndexes.size(), 1), 2);
      this.#out.print(sys.Str.padl(sys.Str.defVal(), indent));
      this.#out.print(this.#listIndexes.peek());
      this.#listIndexes.peek().increment();
      this.#lineWidth = 0;
    }
    else if (sys.ObjUtil.equals($_u19, fandoc.DocNodeId.hr())) {
      this.printLine();
      this.printLine();
      this.#out.print("---");
    }
    ;
    this.#started = true;
    return;
  }

  elemEnd(elem) {
    let $_u20 = elem.id();
    if (sys.ObjUtil.equals($_u20, fandoc.DocNodeId.emphasis())) {
      this.#out.writeChar(42);
    }
    else if (sys.ObjUtil.equals($_u20, fandoc.DocNodeId.strong())) {
      this.#out.print("**");
    }
    else if (sys.ObjUtil.equals($_u20, fandoc.DocNodeId.code())) {
      this.#out.writeChar(96);
    }
    else if (sys.ObjUtil.equals($_u20, fandoc.DocNodeId.link())) {
      let link = sys.ObjUtil.coerce(elem, fandoc.Link.type$);
      if (link.isCode()) {
        this.#lineWidth = sys.Int.plus(this.#lineWidth, sys.Str.size(sys.Str.plus(sys.Str.plus("{@link ", link.uri()), " | ")));
        this.#out.writeChar(125);
      }
      else {
        let str = sys.Str.plus(sys.Str.plus("](", link.uri()), ")");
        this.#lineWidth = sys.Int.plus(this.#lineWidth, sys.Str.size(str));
        this.#out.print(str);
      }
      ;
    }
    else if (sys.ObjUtil.equals($_u20, fandoc.DocNodeId.image())) {
      let img = sys.ObjUtil.coerce(elem, fandoc.Image.type$);
      let str = sys.Str.plus(sys.Str.plus("](", img.uri()), ")");
      this.#lineWidth = sys.Int.plus(this.#lineWidth, sys.Str.size(str));
      this.#out.print(str);
    }
    else if (sys.ObjUtil.equals($_u20, fandoc.DocNodeId.pre())) {
      this.printLine();
      this.#out.print("```");
      this.#inPre = false;
    }
    else if (sys.ObjUtil.equals($_u20, fandoc.DocNodeId.blockQuote())) {
      this.#inBlockquote = false;
    }
    else if (sys.ObjUtil.equals($_u20, fandoc.DocNodeId.unorderedList()) || sys.ObjUtil.equals($_u20, fandoc.DocNodeId.orderedList())) {
      this.#listIndexes.pop();
    }
    ;
    return;
  }

  text(text) {
    const this$ = this;
    if (this.#inPre) {
      return this.#out.print(sys.Str.replace(sys.Str.replace(text.toStr(), "\n", sys.Str.plus(sys.Str.plus("\n", this.#ind), " * ")), "*/", "*\\/"));
    }
    ;
    let innerInd = "";
    if (!this.#listIndexes.isEmpty()) {
      (innerInd = sys.Str.mult(" ", sys.Int.mult(this.#listIndexes.size(), 2)));
    }
    ;
    let str = sys.Str.replace(sys.Str.replace(sys.ObjUtil.as(sys.Str.split(text.toStr(), sys.ObjUtil.coerce(32, sys.Int.type$.toNullable())).reduce(sys.List.make(sys.Str.type$), sys.ObjUtil.coerce((acc,s,i) => {
      if (sys.ObjUtil.equals(i, 0)) {
        this$.#lineWidth = sys.Int.plus(this$.#lineWidth, sys.Str.size(s));
        acc.add(s);
      }
      else {
        if (sys.ObjUtil.compareGE(sys.Int.plus(this$.#lineWidth, sys.Str.size(s)), this$.#maxWidth)) {
          this$.#lineWidth = sys.Str.size(s);
          acc.add(s);
        }
        else {
          let newStr = ((this$) => { if ((sys.ObjUtil.compareGT(acc.size(), 1) && sys.ObjUtil.equals(acc.get(-1), ""))) return s; return sys.Str.plus(" ", s); })(this$);
          this$.#lineWidth = sys.Int.plus(this$.#lineWidth, sys.Str.size(newStr));
          ((this$) => { let $_u24 = acc; let $_u25 = -1; let $_u22 = sys.Str.plus(acc.get(-1), newStr); $_u24.set($_u25,$_u22);  return $_u22; })(this$);
        }
        ;
      }
      ;
      return acc;
    }, sys.Type.find("|sys::Obj?,sys::Str,sys::Int->sys::Obj?|"))), sys.Type.find("sys::Str[]")).join("\n"), "\n", sys.Str.plus(sys.Str.plus(sys.Str.plus("\n", this.#ind), " * "), innerInd)), "*/", "*\\/");
    this.#out.print(str);
    return;
  }

  printLine(line) {
    if (line === undefined) line = "";
    this.#out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", line), "\n"), this.#ind), " * "));
    return;
  }

  onLink(link) {
    let slotMatcher = sys.Regex.fromStr("(((.+)::)?(.+)\\.)?(.+)", "g").matcher(link.uri());
    let typeMatcher = sys.Regex.fromStr("((.+)::)?(.+)", "g").matcher(link.uri());
    let docMatcher = sys.Regex.fromStr("(doc.+)::(.+)", "g").matcher(link.uri());
    if (slotMatcher.matches()) {
      let p = ((this$) => { let $_u26 = slotMatcher.group(3); if ($_u26 != null) return $_u26; return this$.#pod; })(this);
      let t = ((this$) => { let $_u27 = slotMatcher.group(4); if ($_u27 != null) return $_u27; return this$.#type; })(this);
      let s = slotMatcher.group(5);
      if (sys.Slot.find(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", p), "::"), t), "."), s), false) != null) {
        (s = compilerEs.JsNode.methodToJs(sys.ObjUtil.coerce(s, sys.Str.type$)));
        if (sys.ObjUtil.compareNE(p, this.#pod)) {
          link.uri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", p), "."), t), "."), s));
        }
        else {
          if (sys.ObjUtil.compareNE(t, this.#type)) {
            link.uri(sys.Str.plus(sys.Str.plus(sys.Str.plus("", t), "."), s));
          }
          else {
            link.uri(sys.ObjUtil.coerce(s, sys.Str.type$));
          }
          ;
        }
        ;
        link.isCode(true);
        return;
      }
      ;
    }
    ;
    if (typeMatcher.matches()) {
      let p = ((this$) => { let $_u28 = typeMatcher.group(2); if ($_u28 != null) return $_u28; return this$.#pod; })(this);
      let t = typeMatcher.group(3);
      if (sys.Type.find(sys.Str.plus(sys.Str.plus(sys.Str.plus("", p), "::"), t), false) != null) {
        if (sys.ObjUtil.compareNE(p, this.#pod)) {
          link.uri(sys.Str.plus(sys.Str.plus(sys.Str.plus("", p), "."), t));
        }
        else {
          link.uri(sys.ObjUtil.coerce(t, sys.Str.type$));
        }
        ;
        link.isCode(true);
        return;
      }
      ;
    }
    ;
    if (docMatcher.matches()) {
      link.uri(sys.Str.plus(sys.Str.plus(sys.Str.plus("https://fantom.org/doc/", docMatcher.group(1)), "/"), docMatcher.group(2)));
    }
    ;
    return;
  }

}

class ListIndex extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#index = 1;
    return;
  }

  typeof() { return ListIndex.type$; }

  static #romans = undefined;

  static romans() {
    if (ListIndex.#romans === undefined) {
      ListIndex.static$init();
      if (ListIndex.#romans === undefined) ListIndex.#romans = null;
    }
    return ListIndex.#romans;
  }

  #style = null;

  style(it) {
    if (it === undefined) {
      return this.#style;
    }
    else {
      this.#style = it;
      return;
    }
  }

  #index = 0;

  index(it) {
    if (it === undefined) {
      return this.#index;
    }
    else {
      this.#index = it;
      return;
    }
  }

  static make(style) {
    const $self = new ListIndex();
    ListIndex.make$($self,style);
    return $self;
  }

  static make$($self,style) {
    if (style === undefined) style = null;
    ;
    $self.#style = style;
    return;
  }

  increment() {
    ((this$) => { let $_u29 = this$.#index;this$.#index = sys.Int.increment(this$.#index); return $_u29; })(this);
    return this;
  }

  toStr() {
    let $_u30 = this.#style;
    if (sys.ObjUtil.equals($_u30, null)) {
      return "- ";
    }
    else if (sys.ObjUtil.equals($_u30, fandoc.OrderedListStyle.number())) {
      return sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.#index, sys.Obj.type$.toNullable())), ". ");
    }
    else if (sys.ObjUtil.equals($_u30, fandoc.OrderedListStyle.lowerAlpha())) {
      return sys.Str.plus(sys.Str.plus("", sys.Str.lower(ListIndex.toB26(this.#index))), ". ");
    }
    else if (sys.ObjUtil.equals($_u30, fandoc.OrderedListStyle.upperAlpha())) {
      return sys.Str.plus(sys.Str.plus("", sys.Str.upper(ListIndex.toB26(this.#index))), ". ");
    }
    else if (sys.ObjUtil.equals($_u30, fandoc.OrderedListStyle.lowerRoman())) {
      return sys.Str.plus(sys.Str.plus("", sys.Str.lower(ListIndex.toRoman(this.#index))), ". ");
    }
    else if (sys.ObjUtil.equals($_u30, fandoc.OrderedListStyle.upperRoman())) {
      return sys.Str.plus(sys.Str.plus("", sys.Str.upper(ListIndex.toRoman(this.#index))), ". ");
    }
    ;
    throw sys.Err.make(sys.Str.plus("Unsupported List Style: ", this.#style));
  }

  static toB26(int) {
    ((this$) => { let $_u31 = int;int = sys.Int.decrement(int); return $_u31; })(this);
    let dig = sys.Int.toChar(sys.Int.plus(65, sys.Int.mod(int, 26)));
    return ((this$) => { if (sys.ObjUtil.compareGE(int, 26)) return sys.Str.plus(ListIndex.toB26(sys.Int.div(int, 26)), dig); return dig; })(this);
  }

  static toRoman(int) {
    const this$ = this;
    let l = ListIndex.romans().keys().find((it) => {
      return sys.ObjUtil.compareLE(it, int);
    });
    return sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.compareGT(int, l)) return sys.Str.plus(ListIndex.romans().get(sys.ObjUtil.coerce(sys.ObjUtil.coerce(l, sys.Int.type$), sys.Obj.type$.toNullable())), ListIndex.toRoman(sys.Int.minus(int, sys.ObjUtil.coerce(l, sys.Int.type$)))); return ListIndex.romans().get(sys.ObjUtil.coerce(sys.ObjUtil.coerce(l, sys.Int.type$), sys.Obj.type$.toNullable())); })(this), sys.Str.type$);
  }

  static sortr(unordered) {
    const this$ = this;
    let sorted = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Obj:sys::Obj?]"));
    unordered.keys().sortr().each((it) => {
      sorted.set(sys.ObjUtil.coerce(it, sys.Obj.type$), unordered.get(sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable())));
      return;
    });
    return sys.ObjUtil.coerce(sorted, sys.Type.find("[sys::Int:sys::Str]"));
  }

  static static$init() {
    ListIndex.#romans = sys.ObjUtil.coerce(((this$) => { let $_u34 = ListIndex.sortr(sys.Map.__fromLiteral([sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(900, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(90, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(40, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(9, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())], ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"], sys.Type.find("sys::Int"), sys.Type.find("sys::Str"))); if ($_u34 == null) return null; return sys.ObjUtil.toImmutable(ListIndex.sortr(sys.Map.__fromLiteral([sys.ObjUtil.coerce(1000, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(900, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(500, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(400, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(90, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(40, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(9, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()),sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())], ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"], sys.Type.find("sys::Int"), sys.Type.find("sys::Str")))); })(this), sys.Type.find("[sys::Int:sys::Str]"));
    return;
  }

}

const p = sys.Pod.add$('nodeJs');
const xp = sys.Param.noParams$();
let m;
Main.type$ = p.at$('Main','sys::Obj',[],{},8192,Main);
NodeJsCmd.type$ = p.at$('NodeJsCmd','util::AbstractMain',[],{},8193,NodeJsCmd);
EmitUtil.type$ = p.at$('EmitUtil','sys::Obj',[],{},128,EmitUtil);
ExtractCmd.type$ = p.at$('ExtractCmd','nodeJs::NodeJsCmd',[],{},128,ExtractCmd);
HelpCmd.type$ = p.at$('HelpCmd','nodeJs::NodeJsCmd',[],{},128,HelpCmd);
RunCmd.type$ = p.at$('RunCmd','nodeJs::NodeJsCmd',[],{},128,RunCmd);
TestCmd.type$ = p.at$('TestCmd','nodeJs::NodeJsCmd',[],{},128,TestCmd);
InitCmd.type$ = p.at$('InitCmd','nodeJs::NodeJsCmd',[],{},128,InitCmd);
GenTsDecl.type$ = p.at$('GenTsDecl','sys::Obj',[],{},8192,GenTsDecl);
TsDocWriter.type$ = p.at$('TsDocWriter','sys::Obj',['fandoc::DocWriter'],{},8192,TsDocWriter);
ListIndex.type$ = p.at$('ListIndex','sys::Obj',[],{},128,ListIndex);
Main.type$.am$('main',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
NodeJsCmd.type$.af$('verbose',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Verbose debug output\";aliases=[\"v\"];}"}).af$('dir',335872,'sys::File',{'util::Opt':"util::Opt{help=\"Root directory for staging Node.js environment\";aliases=[\"d\"];}"}).af$('cjs',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Emit CommonJs\";}"}).af$('ms$Store',722944,'sys::Obj?',{}).af$('emit$Store',722944,'sys::Obj?',{}).am$('find',40962,'nodeJs::NodeJsCmd?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('list',40962,'nodeJs::NodeJsCmd[]',xp,{}).am$('appName',9216,'sys::Str',xp,{}).am$('log',271360,'sys::Log',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('aliases',270336,'sys::Str[]',xp,{}).am$('run',271361,'sys::Int',xp,{}).am$('summary',270337,'sys::Str',xp,{}).am$('checkForNode',4096,'sys::Bool',xp,{}).am$('ms',532480,'compilerEs::ModuleSystem',xp,{}).am$('emit',524416,'nodeJs::EmitUtil',xp,{}).am$('printLine',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',true)]),{}).am$('err',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('ms$Once',133120,'compilerEs::ModuleSystem',xp,{}).am$('emit$Once',133120,'nodeJs::EmitUtil',xp,{});
EmitUtil.type$.af$('cmd',67584,'nodeJs::NodeJsCmd',{}).af$('depends',67584,'sys::Pod[]',{}).af$('scriptJs',67584,'sys::File?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cmd','nodeJs::NodeJsCmd',false)]),{}).am$('ms',2048,'compilerEs::ModuleSystem',xp,{}).am$('isCjs',2048,'sys::Bool',xp,{}).am$('withDepends',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('pods','sys::Pod[]',false)]),{}).am$('withScript',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('scriptJs','sys::File',false)]),{}).am$('podJsFile',2048,'sys::File?',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Pod',false),new sys.Param('name','sys::Str',true)]),{}).am$('writePackageJson',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('json','[sys::Str:sys::Obj?]',true)]),{}).am$('writeNodeModules',8192,'sys::Void',xp,{}).am$('writeFanJs',8192,'sys::Void',xp,{}).am$('writeNode',8192,'sys::Void',xp,{}).am$('writeDepends',8192,'sys::Void',xp,{}).am$('writeScriptJs',8192,'sys::Void',xp,{}).am$('writeMimeJs',8192,'sys::Void',xp,{}).am$('writeUnitsJs',8192,'sys::Void',xp,{}).am$('writeIndexedPropsJs',8192,'sys::Void',xp,{}).am$('includeStatements',8192,'sys::Str',xp,{}).am$('envDirs',8192,'sys::Str',xp,{});
ExtractCmd.type$.af$('dir',271360,'sys::File',{'util::Opt':"util::Opt{help=\"Directory to extract files into\";}"}).af$('clean',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Clean target directory before extracting files\";}"}).af$('pods',73728,'sys::Str[]',{'util::Arg':"util::Arg{help=\"If specified, only extract for these pods. Otherwise, extract for all pods\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
HelpCmd.type$.af$('commandName',73728,'sys::Str[]',{'util::Arg':""}).am$('name',271360,'sys::Str',xp,{}).am$('aliases',271360,'sys::Str[]',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
RunCmd.type$.af$('keep',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Don't delete Node.js environment when done\";}"}).af$('script',73728,'sys::File?',{'util::Arg':"util::Arg{help=\"Fantom script\";}"}).af$('tempPod',73730,'sys::Str',{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('compile',2048,'sys::File',xp,{}).am$('make',139268,'sys::Void',xp,{});
TestCmd.type$.af$('keep',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Don't delete Node.js environment when done\";}"}).af$('targets',73728,'sys::Str[]?',{'util::Arg':"util::Arg{help=\"<pod>[::<test>[.<method>]]\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('targetPods',2048,'sys::Pod[]',xp,{}).am$('testRunner',2048,'sys::Void',xp,{}).am$('fanTargets',2048,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
InitCmd.type$.af$('dir',271360,'sys::File',{'util::Opt':"util::Opt{help=\"Root directory for staging Node.js environment\";aliases=[\"-d\"];}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('writeFantomJs',2048,'sys::Void',xp,{}).am$('writeTsDecl',2048,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
GenTsDecl.type$.af$('out',67584,'sys::OutStream',{}).af$('pod',67584,'compiler::CPod',{}).af$('opts',67584,'[sys::Str:sys::Obj?]',{}).af$('docWriter',67584,'nodeJs::TsDocWriter',{}).af$('deps',67584,'sys::Str[]?',{}).af$('pmap',67586,'[sys::Str:sys::Str]',{}).am$('genForPod',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Pod',false),new sys.Param('out','sys::OutStream',false),new sys.Param('opts','[sys::Str:sys::Obj?]',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('pod','compiler::CPod',false),new sys.Param('opts','[sys::Str:sys::Obj?]',false)]),{}).am$('allTypes',2048,'sys::Bool',xp,{}).am$('genNoDoc',2048,'sys::Bool',xp,{}).am$('isNoDoc',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('node','compiler::CNode',false)]),{}).am$('run',8192,'sys::Void',xp,{}).am$('genType',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','compiler::CType',false)]),{}).am$('includeSlot',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('type','compiler::CType',false),new sys.Param('slot','compiler::CSlot',false)]),{}).am$('writeField',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','compiler::CType',false),new sys.Param('field','compiler::CField',false),new sys.Param('hasItBlockCtor','sys::Bool',false)]),{}).am$('writeMethod',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('parent','compiler::CType',false),new sys.Param('method','compiler::CMethod',false)]),{}).am$('toMethodParam',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('parent','compiler::CType',false),new sys.Param('method','compiler::CMethod',false),new sys.Param('isStatic','sys::Bool',false),new sys.Param('p','compiler::CParam',false)]),{}).am$('toMethodReturn',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('type','compiler::CType',false),new sys.Param('method','compiler::CMethod',false)]),{}).am$('toMethodSigType',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('method','compiler::CMethod',false),new sys.Param('sigType','compiler::CType',false),new sys.Param('self','compiler::CType?',false)]),{}).am$('getJsType',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('type','compiler::CType',false),new sys.Param('thisType','compiler::CType?',true)]),{}).am$('getNamespacedType',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('typeName','sys::Str',false),new sys.Param('typePod','sys::Str',false)]),{}).am$('setupDoc',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Str',false),new sys.Param('type','sys::Str',false)]),{}).am$('printDoc',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('node','compiler::CNode',false),new sys.Param('indent','sys::Int',false)]),{}).am$('printJsObj',2048,'sys::Void',xp,{}).am$('printObjUtil',2048,'sys::Void',xp,{});
TsDocWriter.type$.af$('indent',73728,'sys::Int',{}).af$('ind',67584,'sys::Str',{}).af$('pod',73728,'sys::Str',{}).af$('type',73728,'sys::Str',{}).af$('out',67584,'sys::OutStream',{}).af$('started',67584,'sys::Bool',{}).af$('listIndexes',67584,'nodeJs::ListIndex[]',{}).af$('inPre',67584,'sys::Bool',{}).af$('inBlockquote',67584,'sys::Bool',{}).af$('lineWidth',67584,'sys::Int',{}).af$('maxWidth',67586,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('docStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('docEnd',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('doc','fandoc::Doc',false)]),{}).am$('elemStart',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('elemEnd',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('elem','fandoc::DocElem',false)]),{}).am$('text',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('text','fandoc::DocText',false)]),{}).am$('printLine',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',true)]),{}).am$('onLink',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('link','fandoc::Link',false)]),{});
ListIndex.type$.af$('romans',100354,'[sys::Int:sys::Str]',{}).af$('style',73728,'fandoc::OrderedListStyle?',{}).af$('index',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('style','fandoc::OrderedListStyle?',true)]),{}).am$('increment',8192,'sys::This',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('toB26',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('int','sys::Int',false)]),{}).am$('toRoman',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('int','sys::Int',false)]),{}).am$('sortr',34818,'[sys::Int:sys::Str]',sys.List.make(sys.Param.type$,[new sys.Param('unordered','[sys::Int:sys::Str]',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "nodeJs");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;compiler 1.0;compilerEs 1.0;fandoc 1.0;util 1.0");
m.set("pod.summary", "Utilities for running Fantom in Node JS");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:21-05:00 New_York");
m.set("build.tsKey", "241210143121");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "Fantom");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Fantom Core");
m.set("proj.uri", "https://fantom.org/");
m.set("pod.docApi", "false");
m.set("org.uri", "https://fantom.org/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  Main,
  NodeJsCmd,
  GenTsDecl,
  TsDocWriter,
};
