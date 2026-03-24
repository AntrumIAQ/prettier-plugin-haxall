// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as compiler from './compiler.js'
import * as concurrent from './concurrent.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Evaluator extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Evaluator.type$; }

  #shell = null;

  // private field reflection only
  __shell(it) { if (it === undefined) return this.#shell; else this.#shell = it; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  #compiler = null;

  // private field reflection only
  __compiler(it) { if (it === undefined) return this.#compiler; else this.#compiler = it; }

  #pod = null;

  // private field reflection only
  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  static make(shell) {
    const $self = new Evaluator();
    Evaluator.make$($self,shell);
    return $self;
  }

  static make$($self,shell) {
    if (shell != null) {
      $self.#shell = shell;
      $self.#out = shell.out();
    }
    ;
    return;
  }

  eval(line) {
    const this$ = this;
    let s = sys.StrBuf.make();
    this.#shell.usings().each((u) => {
      s.add("using ").add(u.target()).add("\n");
      return;
    });
    s.add("class FanshEval\n{\n  new make(Str:Obj s) { _scope = s }\n  Str:Obj? _scope\n  Obj? _eval()\n  {\n");
    let scopeMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    if (this.#shell != null) {
      this.#shell.scope().each((v) => {
        let sig = this$.typeSig(v.of());
        s.add(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("    ", sig), " "), v.name()), " := _scope[\""), v.name()), "\"];\n"));
        scopeMap.set(sys.ObjUtil.coerce(v.name(), sys.Str.type$), v.val());
        return;
      });
    }
    ;
    let srcPrefix = s.toStr();
    let ctrl = this.isCtrl(line);
    let local = null;
    if ((sys.Str.contains(line, ":=") && !ctrl)) {
      (local = Var.make());
      local.name(sys.Str.split(sys.Str.trim(sys.Str.getRange(line, sys.Range.make(0, sys.Int.minus(sys.ObjUtil.coerce(sys.Str.index(line, ":="), sys.Int.type$), 1))))).last());
      this.compile(sys.Str.plus(srcPrefix, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("    ", line), ";\n    return "), local.name()), "\n  }\n}")));
      if (this.#pod != null) {
        local.of(sys.ObjUtil.coerce(this.localDefType(), sys.Type.type$));
      }
      ;
    }
    else {
      if ((sys.Str.contains(line, "=") && !ctrl)) {
        let eq = sys.Str.index(line, "=");
        let name = sys.Str.trim(sys.Str.getRange(line, sys.Range.make(0, sys.Int.minus(sys.ObjUtil.coerce(eq, sys.Int.type$), 1))));
        let expr = sys.Str.trim(sys.Str.getRange(line, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(eq, sys.Int.type$), 1), -1)));
        if (!sys.Str.startsWith(expr, "=")) {
          (local = this.#shell.findInScope(name));
          if (local != null) {
            this.compile(sys.Str.plus(srcPrefix, sys.Str.plus(sys.Str.plus("    ", expr), "\n  }\n}")));
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    if (this.#pod == null) {
      this.compile(sys.Str.plus(srcPrefix, sys.Str.plus(sys.Str.plus("    return ", line), "\n  }\n}")));
    }
    ;
    if (this.#pod == null) {
      this.compile(sys.Str.plus(srcPrefix, sys.Str.plus(sys.Str.plus("    ", line), ";\n    return \"__void__\"\n  }\n}")));
    }
    ;
    if (this.#shell == null) {
      return false;
    }
    ;
    if (this.#pod == null) {
      this.reportCompilerErrs();
      return false;
    }
    ;
    let t = this.#pod.types().first();
    let method = t.method("_eval");
    let result = null;
    try {
      let instance = t.make(sys.List.make(sys.Type.find("[sys::Str:sys::Obj?]"), [scopeMap]));
      (result = method.callOn(instance, sys.List.make(sys.Obj.type$.toNullable())));
    }
    catch ($_u0) {
      $_u0 = sys.Err.make($_u0);
      if ($_u0 instanceof sys.Err) {
        let e = $_u0;
        ;
        this.reportEvalErr(e);
        return false;
      }
      else {
        throw $_u0;
      }
    }
    ;
    if (sys.ObjUtil.compareNE(result, "__void__")) {
      this.#out.printLine(result);
    }
    ;
    if (local != null) {
      local.val(result);
      this.#shell.scope().set(sys.ObjUtil.coerce(local.name(), sys.Str.type$), sys.ObjUtil.coerce(local, Var.type$));
    }
    ;
    return true;
  }

  typeSig(t) {
    const this$ = this;
    if (t.pod() == null) {
      let a = this.#shell.usings().find((u) => {
        return u.matchAs(t);
      });
      if (a != null) {
        return sys.Str.plus(a.asTo(), ((this$) => { if (t.isNullable()) return "?"; return ""; })(this));
      }
      ;
      return sys.Str.plus(sys.Str.plus("", t.name()), ((this$) => { if (t.isNullable()) return "?"; return ""; })(this));
    }
    ;
    return t.signature();
  }

  compile(source) {
    const this$ = this;
    let ci = sys.ObjUtil.coerce(sys.ObjUtil.with(compiler.CompilerInput.make(), (it) => {
      it.podName(((this$) => { if (this$.#shell == null) return "shWarmup"; return sys.Str.plus("sh", sys.ObjUtil.coerce(((this$) => { let $_u4 = this$.#shell.evalCount();this$.#shell.evalCount(sys.Int.increment(this$.#shell.evalCount())); return $_u4; })(this$), sys.Obj.type$.toNullable())); })(this$));
      it.summary("eval");
      it.isScript(true);
      it.version(sys.Version.defVal());
      it.log().level(sys.LogLevel.silent());
      it.output(compiler.CompilerOutputMode.transientPod());
      it.mode(compiler.CompilerInputMode.str());
      it.srcStr(source);
      it.srcStrLoc(compiler.Loc.make("fansh"));
      return;
    }), compiler.CompilerInput.type$);
    this.#compiler = compiler.Compiler.make(ci);
    try {
      this.#pod = this.#compiler.compile().transientPod();
    }
    catch ($_u5) {
      $_u5 = sys.Err.make($_u5);
      if ($_u5 instanceof compiler.CompilerErr) {
        let e = $_u5;
        ;
        this.#pod = null;
      }
      else {
        throw $_u5;
      }
    }
    ;
    return;
  }

  isCtrl(line) {
    try {
      return ((sys.Str.startsWith(line, "for") && !sys.Int.isAlpha(sys.Str.get(line, 4))) || (sys.Str.startsWith(line, "if") && !sys.Int.isAlpha(sys.Str.get(line, 3))) || (sys.Str.startsWith(line, "while") && !sys.Int.isAlpha(sys.Str.get(line, 5))) || (sys.Str.startsWith(line, "switch") && !sys.Int.isAlpha(sys.Str.get(line, 6))) || (sys.Str.startsWith(line, "try") && !sys.Int.isAlpha(sys.Str.get(line, 4))));
    }
    catch ($_u6) {
      return false;
    }
    ;
  }

  localDefType() {
    if (this.#pod == null) {
      return null;
    }
    ;
    let stmt = sys.ObjUtil.coerce(this.#compiler.pod().typeDefs().get("FanshEval").methodDef("_eval").code().stmts().get(-2), compiler.LocalDefStmt.type$);
    return sys.Type.find(stmt.ctype().signature());
  }

  reportCompilerErrs() {
    const this$ = this;
    this.#compiler.errs().each((e) => {
      this$.#out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("ERROR(", sys.ObjUtil.coerce(e.col(), sys.Obj.type$.toNullable())), "): "), e.msg()));
      return;
    });
    return;
  }

  reportEvalErr(e) {
    const this$ = this;
    let buf = sys.Buf.make();
    e.trace(buf.out());
    let lines = sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()).readAllLines();
    let br = lines.find((line) => {
      return sys.Str.contains(line, "FanshEval");
    });
    if (br != null) {
      (lines = lines.getRange(sys.Range.make(0, sys.Int.minus(sys.ObjUtil.coerce(lines.index(sys.ObjUtil.coerce(br, sys.Str.type$)), sys.Int.type$), 1))));
    }
    ;
    lines.each((line) => {
      this$.#out.printLine(line);
      return;
    });
    return;
  }

}

class Shell extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#out = sys.Env.cur().out();
    this.#in = sys.Env.cur().in();
    this.#isAlive = true;
    this.#evalCount = 0;
    this.#scope = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("fansh::Var"));
    this.#usings = sys.List.make(Use.type$);
    return;
  }

  typeof() { return Shell.type$; }

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

  #in = null;

  in(it) {
    if (it === undefined) {
      return this.#in;
    }
    else {
      this.#in = it;
      return;
    }
  }

  #isAlive = false;

  isAlive(it) {
    if (it === undefined) {
      return this.#isAlive;
    }
    else {
      this.#isAlive = it;
      return;
    }
  }

  #evalCount = 0;

  evalCount(it) {
    if (it === undefined) {
      return this.#evalCount;
    }
    else {
      this.#evalCount = it;
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

  #usings = null;

  usings(it) {
    if (it === undefined) {
      return this.#usings;
    }
    else {
      this.#usings = it;
      return;
    }
  }

  run() {
    this.warmup();
    this.#out.printLine(sys.Str.plus(sys.Str.plus("Fantom Shell v", sys.Pod.of(this).version()), " ('?' for help)"));
    while (this.#isAlive) {
      let line = ((this$) => { let $_u7 = sys.Env.cur().prompt("fansh> "); if ($_u7 != null) return $_u7; return "quit"; })(this);
      (line = sys.Str.trim(line));
      if (sys.ObjUtil.equals(sys.Str.size(line), 0)) {
        continue;
      }
      ;
      if (this.command(sys.ObjUtil.coerce(line, sys.Str.type$))) {
        continue;
      }
      ;
      Evaluator.make(this).eval(sys.ObjUtil.coerce(line, sys.Str.type$));
    }
    ;
    return;
  }

  warmup() {
    const this$ = this;
    let f = () => {
      Evaluator.make(null).eval("0");
      return;
    };
    concurrent.Actor.make(concurrent.ActorPool.make(), f).send(null);
    return;
  }

  command(line) {
    let $_u8 = line;
    if (sys.ObjUtil.equals($_u8, "bye") || sys.ObjUtil.equals($_u8, "exit") || sys.ObjUtil.equals($_u8, "quit")) {
      this.quit();
      return true;
    }
    else if (sys.ObjUtil.equals($_u8, "help") || sys.ObjUtil.equals($_u8, "usage") || sys.ObjUtil.equals($_u8, "?")) {
      this.help();
      return true;
    }
    else if (sys.ObjUtil.equals($_u8, "clear")) {
      this.clear();
      return true;
    }
    else if (sys.ObjUtil.equals($_u8, "scope")) {
      this.dumpScope();
      return true;
    }
    ;
    if (sys.Str.startsWith(line, "using ")) {
      this.addUsing(line);
      return true;
    }
    ;
    return false;
  }

  quit() {
    this.#isAlive = false;
    return;
  }

  help() {
    this.#out.printLine();
    this.#out.printLine(sys.Str.plus("Fantom Shell v", sys.Pod.of(this).version()));
    this.#out.printLine("Commands:");
    this.#out.printLine("  quit, exit, bye   exit shell");
    this.#out.printLine("  ?, help, usage    help summary");
    this.#out.printLine("  clear             clear the using imports and local variables");
    this.#out.printLine("  scope             dump the using imports and local variables");
    this.#out.printLine("  using x           import pod x into namespace (any valid using stmt allowed)");
    this.#out.printLine();
    return;
  }

  clear() {
    this.#usings.clear();
    this.#scope.clear();
    return;
  }

  dumpScope() {
    const this$ = this;
    this.#out.printLine();
    this.#out.printLine("Current Usings:");
    this.#usings.each((u) => {
      this$.#out.printLine(sys.Str.plus("  ", u.target()));
      return;
    });
    this.#out.printLine();
    this.#out.printLine("Current Scope:");
    this.#scope.vals().sort().each((v) => {
      this$.#out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", v.of()), " "), v.name()), " = "), v.val()));
      return;
    });
    this.#out.printLine();
    return;
  }

  addUsing(line) {
    let s = sys.Str.trim(sys.Str.getRange(line, sys.Range.make(6, -1)));
    let u = Use.make(s);
    this.#usings.add(u);
    let ok = Evaluator.make(this).eval(sys.Str.toCode(sys.Str.plus("Add using: ", line)));
    if (!ok) {
      this.#usings.remove(u);
    }
    ;
    return;
  }

  findInScope(name) {
    const this$ = this;
    return this.#scope.find((v) => {
      return sys.ObjUtil.equals(v.name(), name);
    });
  }

  static make() {
    const $self = new Shell();
    Shell.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Var extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#of = sys.Obj.type$;
    return;
  }

  typeof() { return Var.type$; }

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

  compare(obj) {
    return sys.ObjUtil.compare(sys.ObjUtil.coerce(obj, Var.type$).#name, this.#name);
  }

  static make() {
    const $self = new Var();
    Var.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class Use extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Use.type$; }

  #target = null;

  target() { return this.#target; }

  __target(it) { if (it === undefined) return this.#target; else this.#target = it; }

  #asFrom = null;

  asFrom() { return this.#asFrom; }

  __asFrom(it) { if (it === undefined) return this.#asFrom; else this.#asFrom = it; }

  #asTo = null;

  asTo() { return this.#asTo; }

  __asTo(it) { if (it === undefined) return this.#asTo; else this.#asTo = it; }

  static make(target) {
    const $self = new Use();
    Use.make$($self,target);
    return $self;
  }

  static make$($self,target) {
    $self.#target = target;
    if (sys.Str.contains(target, " as ")) {
      $self.#asFrom = sys.Str.replace(sys.Str.trim(sys.Str.getRange(target, sys.Range.make(0, sys.ObjUtil.coerce(sys.Str.index(target, " as "), sys.Int.type$)))), " ", "");
      $self.#asTo = sys.Str.trim(sys.Str.getRange(target, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(target, " as "), sys.Int.type$), 4), -1)));
    }
    ;
    return;
  }

  matchAs(t) {
    let sig = t.toNonNullable().signature();
    return sys.ObjUtil.equals(this.#asFrom, sig);
  }

}

class Main extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Main.type$; }

  static main() {
    Shell.make().run();
    return;
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

const p = sys.Pod.add$('fansh');
const xp = sys.Param.noParams$();
let m;
Evaluator.type$ = p.at$('Evaluator','sys::Obj',[],{},8192,Evaluator);
Shell.type$ = p.at$('Shell','sys::Obj',[],{},8192,Shell);
Var.type$ = p.at$('Var','sys::Obj',[],{},128,Var);
Use.type$ = p.at$('Use','sys::Obj',[],{},128,Use);
Main.type$ = p.at$('Main','sys::Obj',[],{},8192,Main);
Evaluator.type$.af$('shell',67584,'fansh::Shell?',{}).af$('out',67584,'sys::OutStream?',{}).af$('compiler',67584,'compiler::Compiler?',{}).af$('pod',67584,'sys::Pod?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('shell','fansh::Shell?',false)]),{}).am$('eval',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false)]),{}).am$('typeSig',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Type',false)]),{}).am$('compile',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('source','sys::Str',false)]),{}).am$('isCtrl',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false)]),{}).am$('localDefType',2048,'sys::Type?',xp,{}).am$('reportCompilerErrs',2048,'sys::Void',xp,{}).am$('reportEvalErr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','sys::Err',false)]),{});
Shell.type$.af$('out',73728,'sys::OutStream',{}).af$('in',73728,'sys::InStream',{}).af$('isAlive',65664,'sys::Bool',{}).af$('evalCount',65664,'sys::Int',{}).af$('scope',65664,'[sys::Str:fansh::Var]',{}).af$('usings',65664,'fansh::Use[]',{}).am$('run',8192,'sys::Void',xp,{}).am$('warmup',2048,'sys::Void',xp,{}).am$('command',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false)]),{}).am$('quit',8192,'sys::Void',xp,{}).am$('help',8192,'sys::Void',xp,{}).am$('clear',8192,'sys::Void',xp,{}).am$('dumpScope',8192,'sys::Void',xp,{}).am$('addUsing',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',false)]),{}).am$('findInScope',128,'fansh::Var?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Var.type$.af$('of',73728,'sys::Type',{}).af$('name',73728,'sys::Str?',{}).af$('val',73728,'sys::Obj?',{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Use.type$.af$('target',73730,'sys::Str',{}).af$('asFrom',73730,'sys::Str?',{}).af$('asTo',73730,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('target','sys::Str',false)]),{}).am$('matchAs',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Type',false)]),{});
Main.type$.am$('main',40962,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "fansh");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;compiler 1.0;concurrent 1.0");
m.set("pod.summary", "Interactive Fantom Shell");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:21-05:00 New_York");
m.set("build.tsKey", "241210143121");
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
  Evaluator,
  Shell,
  Main,
};
