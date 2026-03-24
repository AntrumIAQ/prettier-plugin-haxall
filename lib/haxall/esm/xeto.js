// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as util from './util.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Comp {
  constructor() {
    const this$ = this;
  }

  typeof() { return Comp.type$; }

  id() {
    return this.spi().id();
  }

  dis() {
    return this.spi().dis();
  }

  spec() {
    return this.spi().spec();
  }

  toStr() {
    return sys.ObjUtil.toStr(this.spi());
  }

  get(name) {
    return this.spi().get(name);
  }

  has(name) {
    return this.spi().has(name);
  }

  missing(name) {
    return this.spi().missing(name);
  }

  each(f) {
    this.spi().each(f);
    return;
  }

  eachWhile(f) {
    return this.spi().eachWhile(f);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    if ((args == null || args.isEmpty())) {
      let val = this.spi().get(name);
      if (val != null) {
        return val;
      }
      ;
      throw sys.UnknownSlotErr.make(name);
    }
    ;
    if (sys.ObjUtil.equals(args.size(), 1)) {
      return this.set(name, args.get(0));
    }
    ;
    throw sys.ArgErr.make("Unsupported args to trap");
  }

  call(name,arg) {
    if (arg === undefined) arg = null;
    return this.spi().call(name, arg);
  }

  callAsync(name,arg,cb) {
    this.spi().callAsync(name, arg, cb);
    return;
  }

  set(name,val) {
    this.spi().set(name, val);
    return this;
  }

  add(val,name) {
    if (name === undefined) name = null;
    this.spi().add(val, name);
    return this;
  }

  remove(name) {
    this.spi().remove(name);
    return this;
  }

  onChange(name,cb) {
    this.spi().onChange(name, cb);
    return;
  }

  onCall(name,cb) {
    this.spi().onCall(name, cb);
    return;
  }

  onChangeRemove(name,cb) {
    this.spi().onChangeRemove(name, cb);
    return;
  }

  onCallRemove(name,cb) {
    this.spi().onCallRemove(name, cb);
    return;
  }

  onChangePre(name,newVal) {
    return;
  }

  onChangeThis(name,newVal) {
    return;
  }

  onCallThis(name,arg) {
    return;
  }

  onMount() {
    return;
  }

  onUnmount() {
    return;
  }

  onExecute(cx) {
    return;
  }

  onExecuteFreq() {
    return null;
  }

  isMounted() {
    return this.spi().isMounted();
  }

  parent() {
    return this.spi().parent();
  }

  name() {
    return this.spi().name();
  }

  isAbove(child) {
    return this.spi().isAbove(child);
  }

  isBelow(parent) {
    return parent.isAbove(this);
  }

  hasChild(name) {
    return this.spi().hasChild(name);
  }

  child(name,checked) {
    if (checked === undefined) checked = true;
    return this.spi().child(name, checked);
  }

  eachChild(f) {
    this.spi().eachChild(f);
    return;
  }

  links() {
    return this.spi().links();
  }

  dump(con,opts) {
    if (con === undefined) con = util.Console.cur();
    if (opts === undefined) opts = null;
    this.spi().dump(con, opts);
    return;
  }

}

class CompObj extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompObj.type$; }

  onCallRemove() { return Comp.prototype.onCallRemove.apply(this, arguments); }

  onMount() { return Comp.prototype.onMount.apply(this, arguments); }

  callAsync() { return Comp.prototype.callAsync.apply(this, arguments); }

  parent() { return Comp.prototype.parent.apply(this, arguments); }

  onExecuteFreq() { return Comp.prototype.onExecuteFreq.apply(this, arguments); }

  onUnmount() { return Comp.prototype.onUnmount.apply(this, arguments); }

  onCall() { return Comp.prototype.onCall.apply(this, arguments); }

  onCallThis() { return Comp.prototype.onCallThis.apply(this, arguments); }

  spec() { return Comp.prototype.spec.apply(this, arguments); }

  remove() { return Comp.prototype.remove.apply(this, arguments); }

  dis() { return Comp.prototype.dis.apply(this, arguments); }

  onChangePre() { return Comp.prototype.onChangePre.apply(this, arguments); }

  get() { return Comp.prototype.get.apply(this, arguments); }

  missing() { return Comp.prototype.missing.apply(this, arguments); }

  isBelow() { return Comp.prototype.isBelow.apply(this, arguments); }

  links() { return Comp.prototype.links.apply(this, arguments); }

  id() { return Comp.prototype.id.apply(this, arguments); }

  has() { return Comp.prototype.has.apply(this, arguments); }

  trap() { return Comp.prototype.trap.apply(this, arguments); }

  dump() { return Comp.prototype.dump.apply(this, arguments); }

  toStr() { return Comp.prototype.toStr.apply(this, arguments); }

  add() { return Comp.prototype.add.apply(this, arguments); }

  set() { return Comp.prototype.set.apply(this, arguments); }

  onChange() { return Comp.prototype.onChange.apply(this, arguments); }

  onChangeRemove() { return Comp.prototype.onChangeRemove.apply(this, arguments); }

  onChangeThis() { return Comp.prototype.onChangeThis.apply(this, arguments); }

  onExecute() { return Comp.prototype.onExecute.apply(this, arguments); }

  isMounted() { return Comp.prototype.isMounted.apply(this, arguments); }

  eachChild() { return Comp.prototype.eachChild.apply(this, arguments); }

  each() { return Comp.prototype.each.apply(this, arguments); }

  call() { return Comp.prototype.call.apply(this, arguments); }

  hasChild() { return Comp.prototype.hasChild.apply(this, arguments); }

  name() { return Comp.prototype.name.apply(this, arguments); }

  eachWhile() { return Comp.prototype.eachWhile.apply(this, arguments); }

  isAbove() { return Comp.prototype.isAbove.apply(this, arguments); }

  child() { return Comp.prototype.child.apply(this, arguments); }

  #spiRef = null;

  // private field reflection only
  __spiRef(it) { if (it === undefined) return this.#spiRef; else this.#spiRef = it; }

  static make() {
    const $self = new CompObj();
    CompObj.make$($self);
    return $self;
  }

  static make$($self) {
    $self.#spiRef = AbstractCompSpace.cur().initSpi($self, null);
    return;
  }

  static makeForSpec(spec) {
    return CompObj.doMakeForSpec(spec);
  }

  static doMakeForSpec(spec) {
    const $self = new CompObj();
    CompObj.doMakeForSpec$($self,spec);
    return $self;
  }

  static doMakeForSpec$($self,spec) {
    $self.#spiRef = AbstractCompSpace.cur().initSpi($self, spec);
    return;
  }

  spi() {
    return sys.ObjUtil.coerce(this.#spiRef, CompSpi.type$);
  }

}

class CompContext {
  constructor() {
    const this$ = this;
  }

  typeof() { return CompContext.type$; }

}

class AbstractCompSpace {
  constructor() {
    const this$ = this;
  }

  typeof() { return AbstractCompSpace.type$; }

  static #actorKey = undefined;

  static actorKey() {
    if (AbstractCompSpace.#actorKey === undefined) {
      AbstractCompSpace.static$init();
      if (AbstractCompSpace.#actorKey === undefined) AbstractCompSpace.#actorKey = null;
    }
    return AbstractCompSpace.#actorKey;
  }

  static cur() {
    return sys.ObjUtil.coerce(((this$) => { let $_u0 = concurrent.Actor.locals().get(AbstractCompSpace.actorKey()); if ($_u0 != null) return $_u0; throw sys.Err.make("No CompSpace active for current thread"); })(this), AbstractCompSpace.type$);
  }

  static static$init() {
    AbstractCompSpace.#actorKey = "xeto::cs";
    return;
  }

}

class CompSpi {
  constructor() {
    const this$ = this;
  }

  typeof() { return CompSpi.type$; }

}

class Dict {
  constructor() {
    const this$ = this;
  }

  typeof() { return Dict.type$; }

}

class CompLayout extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompLayout.type$; }

  #xRef = 0;

  // private field reflection only
  __xRef(it) { if (it === undefined) return this.#xRef; else this.#xRef = it; }

  #yRef = 0;

  // private field reflection only
  __yRef(it) { if (it === undefined) return this.#yRef; else this.#yRef = it; }

  #wRef = 0;

  // private field reflection only
  __wRef(it) { if (it === undefined) return this.#wRef; else this.#wRef = it; }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    let toks = sys.Str.split(s, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
    if (sys.ObjUtil.compareGE(toks.size(), 3)) {
      let x = sys.Str.toInt(toks.get(0), 10, false);
      let y = sys.Str.toInt(toks.get(1), 10, false);
      let w = sys.Str.toInt(toks.get(2), 10, false);
      if ((x != null && y != null && w != null)) {
        return CompLayout.make(sys.ObjUtil.coerce(x, sys.Int.type$), sys.ObjUtil.coerce(y, sys.Int.type$), sys.ObjUtil.coerce(w, sys.Int.type$));
      }
      ;
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid CompLayout: ", s));
    }
    ;
    return null;
  }

  static coerce(v) {
    return sys.ObjUtil.coerce(((this$) => { let $_u1 = sys.ObjUtil.as(v, CompLayout.type$); if ($_u1 != null) return $_u1; return CompLayout.fromStr(sys.ObjUtil.coerce(v, sys.Str.type$)); })(this), CompLayout.type$);
  }

  static make(x,y,w) {
    const $self = new CompLayout();
    CompLayout.make$($self,x,y,w);
    return $self;
  }

  static make$($self,x,y,w) {
    if (w === undefined) w = 8;
    $self.#xRef = x;
    $self.#yRef = y;
    $self.#wRef = w;
    return;
  }

  x() {
    return this.#xRef;
  }

  y() {
    return this.#yRef;
  }

  w() {
    return this.#wRef;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.x(), sys.Obj.type$.toNullable())), ","), sys.ObjUtil.coerce(this.y(), sys.Obj.type$.toNullable())), ","), sys.ObjUtil.coerce(this.w(), sys.Obj.type$.toNullable()));
  }

  hash() {
    return sys.Int.xor(sys.Int.xor(sys.Int.hash(this.x()), sys.Int.shiftl(sys.Int.hash(this.y()), 8)), sys.Int.shiftl(sys.Int.hash(this.w()), 16));
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, CompLayout.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.x(), that.x()) && sys.ObjUtil.equals(this.y(), that.y()) && sys.ObjUtil.equals(this.w(), that.w()));
  }

}

class XetoEnv extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoEnv.type$; }

  static #curRef = undefined;

  static curRef() {
    if (XetoEnv.#curRef === undefined) {
      XetoEnv.static$init();
      if (XetoEnv.#curRef === undefined) XetoEnv.#curRef = null;
    }
    return XetoEnv.#curRef;
  }

  #pathRef = null;

  // private field reflection only
  __pathRef(it) { if (it === undefined) return this.#pathRef; else this.#pathRef = it; }

  #mode = null;

  mode() { return this.#mode; }

  __mode(it) { if (it === undefined) return this.#mode; else this.#mode = it; }

  static cur() {
    let cur = sys.ObjUtil.as(XetoEnv.curRef().val(), XetoEnv.type$);
    if (cur != null) {
      return sys.ObjUtil.coerce(cur, XetoEnv.type$);
    }
    ;
    XetoEnv.curRef().compareAndSet(null, XetoEnv.init(null));
    return sys.ObjUtil.coerce(XetoEnv.curRef().val(), XetoEnv.type$);
  }

  static make(mode,path) {
    const $self = new XetoEnv();
    XetoEnv.make$($self,mode,path);
    return $self;
  }

  static make$($self,mode,path) {
    $self.#mode = mode;
    $self.#pathRef = sys.ObjUtil.coerce(((this$) => { let $_u2 = path; if ($_u2 == null) return null; return sys.ObjUtil.toImmutable(path); })($self), sys.Type.find("sys::File[]"));
    return;
  }

  homeDir() {
    return sys.ObjUtil.coerce(this.path().last(), sys.File.type$);
  }

  workDir() {
    return sys.ObjUtil.coerce(this.path().first(), sys.File.type$);
  }

  installDir() {
    return sys.ObjUtil.coerce(this.path().first(), sys.File.type$);
  }

  path() {
    return this.#pathRef;
  }

  debugProps() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.ordered(true);
    acc.set("xeto.version", sys.ObjUtil.typeof(this).pod().version().toStr());
    acc.set("xeto.mode", this.#mode);
    acc.set("xeto.workDir", sys.ObjUtil.coerce(this.workDir().osPath(), sys.Obj.type$));
    acc.set("xeto.homeDir", sys.ObjUtil.coerce(this.homeDir().osPath(), sys.Obj.type$));
    acc.set("xeto.installDir", sys.ObjUtil.coerce(this.installDir().osPath(), sys.Obj.type$));
    acc.set("xeto.path", this.path().map((f) => {
      return sys.ObjUtil.coerce(f.osPath(), sys.Str.type$);
    }, sys.Str.type$));
    return sys.ObjUtil.coerce(acc, sys.Type.find("[sys::Str:sys::Str]"));
  }

  dump(out) {
    if (out === undefined) out = sys.Env.cur().out();
    util.AbstractMain.printProps(this.debugProps(), sys.Map.__fromLiteral(["out"], [out], sys.Type.find("sys::Str"), sys.Type.find("sys::OutStream")));
    return;
  }

  static main() {
    sys.ObjUtil.echo();
    XetoEnv.cur().dump();
    sys.ObjUtil.echo();
    return;
  }

  static init(cwd) {
    if (cwd == null) {
      (cwd = sys.File.make(sys.Uri.fromStr("./")).normalize());
    }
    ;
    let homeDir = sys.Env.cur().homeDir();
    let workDir = XetoEnv.findWorkDir(sys.Uri.fromStr("xeto.props"));
    if (workDir != null) {
      return XetoEnv.initXetoProps(sys.ObjUtil.coerce(workDir, sys.File.type$));
    }
    ;
    (workDir = XetoEnv.findWorkDir(sys.Uri.fromStr("fan.props")));
    if (workDir != null) {
      return XetoEnv.initFanProps(sys.ObjUtil.coerce(workDir, sys.File.type$));
    }
    ;
    (workDir = XetoEnv.findWorkDir(sys.Uri.fromStr(".git")));
    if (workDir != null) {
      return XetoEnv.make("git", sys.List.make(sys.File.type$.toNullable(), [workDir, homeDir]));
    }
    ;
    return XetoEnv.make("install", sys.List.make(sys.File.type$, [homeDir]));
  }

  static initXetoProps(workDir) {
    const this$ = this;
    let path = sys.List.make(sys.File.type$);
    let file = workDir.plus(sys.Uri.fromStr("xeto.props"));
    try {
      let props = file.readProps();
      (path = util.PathEnv.parsePath(workDir, sys.ObjUtil.coerce(((this$) => { let $_u3 = props.get("path"); if ($_u3 != null) return $_u3; return ""; })(this), sys.Str.type$), (msg,err) => {
        util.Console.cur().warn(sys.Str.plus(sys.Str.plus(sys.Str.plus("Parsing ", file.osPath()), ": "), msg), err);
        return;
      }));
    }
    catch ($_u4) {
      $_u4 = sys.Err.make($_u4);
      if ($_u4 instanceof sys.Err) {
        let e = $_u4;
        ;
        util.Console.cur().warn(sys.Str.plus("Cannot parse props: ", file.osPath()), e);
        (path = sys.List.make(sys.File.type$, [workDir, sys.Env.cur().homeDir()]));
      }
      else {
        throw $_u4;
      }
    }
    ;
    return XetoEnv.make("xeto.props", path);
  }

  static initFanProps(workDir) {
    return XetoEnv.make("fan.props", sys.Env.cur().path());
  }

  static findWorkDir(name) {
    let dir = sys.File.make(sys.Uri.fromStr("./")).normalize();
    while (dir != null) {
      if (dir.plus(name, false).exists()) {
        return dir;
      }
      ;
      (dir = dir.parent());
    }
    ;
    return dir;
  }

  static static$init() {
    XetoEnv.#curRef = concurrent.AtomicRef.make();
    return;
  }

}

class Lib {
  constructor() {
    const this$ = this;
  }

  typeof() { return Lib.type$; }

}

class LibFiles {
  constructor() {
    const this$ = this;
  }

  typeof() { return LibFiles.type$; }

}

class LibRepo {
  constructor() {
    const this$ = this;
  }

  typeof() { return LibRepo.type$; }

  static #curRef = undefined;

  static curRef() {
    if (LibRepo.#curRef === undefined) {
      LibRepo.static$init();
      if (LibRepo.#curRef === undefined) LibRepo.#curRef = null;
    }
    return LibRepo.#curRef;
  }

  static cur() {
    let repo = sys.ObjUtil.as(LibRepo.curRef().val(), LibRepo.type$);
    if (repo != null) {
      return sys.ObjUtil.coerce(repo, LibRepo.type$);
    }
    ;
    try {
      LibRepo.curRef().compareAndSet(null, sys.Type.find("xetoc::FileRepo").make());
    }
    catch ($_u5) {
      throw sys.Err.make("LibRepo not available for runtime");
    }
    ;
    return sys.ObjUtil.coerce(LibRepo.curRef().val(), LibRepo.type$);
  }

  static install(repo) {
    LibRepo.curRef().compareAndSet(null, repo);
    return;
  }

  static static$init() {
    LibRepo.#curRef = concurrent.AtomicRef.make();
    return;
  }

}

class LibDepend {
  constructor() {
    const this$ = this;
  }

  typeof() { return LibDepend.type$; }

  static make(name,versions) {
    if (versions === undefined) versions = LibDependVersions.wildcard();
    return sys.ObjUtil.coerce(sys.Slot.findMethod("xetoEnv::MLibDepend.makeFields").call(name, versions, util.FileLoc.unknown()), LibDepend.type$.toNullable());
  }

}

class LibDependVersions {
  constructor() {
    const this$ = this;
  }

  typeof() { return LibDependVersions.type$; }

  static wildcard() {
    return MLibDependVersions.wildcardRef();
  }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    return MLibDependVersions.fromStr(s, checked);
  }

  static fromVersion(v) {
    return MLibDependVersions.makeWildcard(v.major(), sys.ObjUtil.coerce(v.minor(), sys.Int.type$), sys.ObjUtil.coerce(v.build(), sys.Int.type$));
  }

}

class MLibDependVersions extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MLibDependVersions.type$; }

  static #wildcardRef = undefined;

  static wildcardRef() {
    if (MLibDependVersions.#wildcardRef === undefined) {
      MLibDependVersions.static$init();
      if (MLibDependVersions.#wildcardRef === undefined) MLibDependVersions.#wildcardRef = null;
    }
    return MLibDependVersions.#wildcardRef;
  }

  #isRange = false;

  isRange() { return this.#isRange; }

  __isRange(it) { if (it === undefined) return this.#isRange; else this.#isRange = it; }

  #a0 = 0;

  a0() { return this.#a0; }

  __a0(it) { if (it === undefined) return this.#a0; else this.#a0 = it; }

  #a1 = 0;

  a1() { return this.#a1; }

  __a1(it) { if (it === undefined) return this.#a1; else this.#a1 = it; }

  #a2 = 0;

  a2() { return this.#a2; }

  __a2(it) { if (it === undefined) return this.#a2; else this.#a2 = it; }

  #b0 = 0;

  b0() { return this.#b0; }

  __b0(it) { if (it === undefined) return this.#b0; else this.#b0 = it; }

  #b1 = 0;

  b1() { return this.#b1; }

  __b1(it) { if (it === undefined) return this.#b1; else this.#b1 = it; }

  #b2 = 0;

  b2() { return this.#b2; }

  __b2(it) { if (it === undefined) return this.#b2; else this.#b2 = it; }

  static fromStr(s,checked) {
    if (checked === undefined) checked = true;
    try {
      let dash = sys.Str.index(s, "-");
      if (dash == null) {
        let a = sys.Str.split(s, sys.ObjUtil.coerce(46, sys.Int.type$.toNullable()), false);
        if (sys.ObjUtil.compareNE(a.size(), 3)) {
          throw sys.Err.make();
        }
        ;
        return MLibDependVersions.makeWildcard(MLibDependVersions.parseSeg(a.get(0)), MLibDependVersions.parseSeg(a.get(1)), MLibDependVersions.parseSeg(a.get(2)));
      }
      else {
        let a = sys.Str.split(sys.Str.trimEnd(sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(dash, sys.Int.type$), true))), sys.ObjUtil.coerce(46, sys.Int.type$.toNullable()), false);
        let b = sys.Str.split(sys.Str.trimStart(sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(dash, sys.Int.type$), 1), -1))), sys.ObjUtil.coerce(46, sys.Int.type$.toNullable()), false);
        if ((sys.ObjUtil.compareNE(a.size(), 3) || sys.ObjUtil.compareNE(b.size(), 3))) {
          throw sys.Err.make();
        }
        ;
        return MLibDependVersions.makeRange(MLibDependVersions.parseSeg(a.get(0)), MLibDependVersions.parseSeg(a.get(1)), MLibDependVersions.parseSeg(a.get(2)), MLibDependVersions.parseSeg(b.get(0)), MLibDependVersions.parseSeg(b.get(1)), MLibDependVersions.parseSeg(b.get(2)));
      }
      ;
    }
    catch ($_u6) {
      $_u6 = sys.Err.make($_u6);
      if ($_u6 instanceof sys.Err) {
        let e = $_u6;
        ;
        if (checked) {
          throw sys.ParseErr.make(s);
        }
        ;
        return null;
      }
      else {
        throw $_u6;
      }
    }
    ;
  }

  static parseSeg(s) {
    return sys.ObjUtil.coerce(((this$) => { if (sys.ObjUtil.equals(s, "x")) return sys.ObjUtil.coerce(-1, sys.Int.type$.toNullable()); return sys.Str.toInt(s, 10, true); })(this), sys.Int.type$);
  }

  static makeWildcard(a0,a1,a2) {
    const $self = new MLibDependVersions();
    MLibDependVersions.makeWildcard$($self,a0,a1,a2);
    return $self;
  }

  static makeWildcard$($self,a0,a1,a2) {
    $self.#isRange = false;
    $self.#a0 = a0;
    $self.#a1 = a1;
    $self.#a2 = a2;
    return;
  }

  static makeRange(a0,a1,a2,b0,b1,b2) {
    const $self = new MLibDependVersions();
    MLibDependVersions.makeRange$($self,a0,a1,a2,b0,b1,b2);
    return $self;
  }

  static makeRange$($self,a0,a1,a2,b0,b1,b2) {
    $self.#isRange = true;
    $self.#a0 = a0;
    $self.#a1 = a1;
    $self.#a2 = a2;
    $self.#b0 = b0;
    $self.#b1 = b1;
    $self.#b2 = b2;
    return;
  }

  contains(v) {
    let segs = v.segments();
    if (sys.ObjUtil.compareLT(segs.size(), 3)) {
      return false;
    }
    ;
    let v0 = segs.get(0);
    let v1 = segs.get(1);
    let v2 = segs.get(2);
    if (!this.#isRange) {
      return (MLibDependVersions.eq(v0, this.#a0) && MLibDependVersions.eq(v1, this.#a1) && MLibDependVersions.eq(v2, this.#a2));
    }
    ;
    if (MLibDependVersions.lt(v0, this.#a0)) {
      return false;
    }
    ;
    if (MLibDependVersions.eq(v0, this.#a0)) {
      if (MLibDependVersions.lt(v1, this.#a1)) {
        return false;
      }
      ;
      if (MLibDependVersions.eq(v1, this.#a1)) {
        if (MLibDependVersions.lt(v2, this.#a2)) {
          return false;
        }
        ;
      }
      ;
    }
    ;
    if (MLibDependVersions.gt(v0, this.#b0)) {
      return false;
    }
    ;
    if (MLibDependVersions.eq(v0, this.#b0)) {
      if (MLibDependVersions.gt(v1, this.#b1)) {
        return false;
      }
      ;
      if (MLibDependVersions.eq(v1, this.#b1)) {
        if (MLibDependVersions.gt(v2, this.#b2)) {
          return false;
        }
        ;
      }
      ;
    }
    ;
    return true;
  }

  static eq(actual,constraint) {
    if (sys.ObjUtil.compareLT(constraint, 0)) {
      return true;
    }
    ;
    return sys.ObjUtil.equals(actual, constraint);
  }

  static gt(actual,constraint) {
    if (sys.ObjUtil.compareLT(constraint, 0)) {
      return false;
    }
    ;
    return sys.ObjUtil.compareGT(actual, constraint);
  }

  static lt(actual,constraint) {
    if (sys.ObjUtil.compareLT(constraint, 0)) {
      return false;
    }
    ;
    return sys.ObjUtil.compareLT(actual, constraint);
  }

  hash() {
    return sys.Str.hash(this.toStr());
  }

  equals(that) {
    return (sys.ObjUtil.is(that, MLibDependVersions.type$) && sys.ObjUtil.equals(this.toStr(), sys.ObjUtil.toStr(that)));
  }

  toStr() {
    let s = sys.StrBuf.make().add(((this$) => { if (sys.ObjUtil.compareLT(this$.#a0, 0)) return "x"; return sys.Int.toStr(this$.#a0); })(this)).addChar(46).add(((this$) => { if (sys.ObjUtil.compareLT(this$.#a1, 0)) return "x"; return sys.Int.toStr(this$.#a1); })(this)).addChar(46).add(((this$) => { if (sys.ObjUtil.compareLT(this$.#a2, 0)) return "x"; return sys.Int.toStr(this$.#a2); })(this));
    if (!this.#isRange) {
      return s.toStr();
    }
    ;
    s.add("-").add(((this$) => { if (sys.ObjUtil.compareLT(this$.#b0, 0)) return "x"; return sys.Int.toStr(this$.#b0); })(this)).addChar(46).add(((this$) => { if (sys.ObjUtil.compareLT(this$.#b1, 0)) return "x"; return sys.Int.toStr(this$.#b1); })(this)).addChar(46).add(((this$) => { if (sys.ObjUtil.compareLT(this$.#b2, 0)) return "x"; return sys.Int.toStr(this$.#b2); })(this));
    return s.toStr();
  }

  static static$init() {
    MLibDependVersions.#wildcardRef = MLibDependVersions.makeWildcard(-1, -1, -1);
    return;
  }

}

class Scalar extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Scalar.type$; }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(qname,val) {
    const $self = new Scalar();
    Scalar.make$($self,qname,val);
    return $self;
  }

  static make$($self,qname,val) {
    $self.#qname = qname;
    $self.#val = val;
    return;
  }

  hash() {
    return sys.Str.hash(this.#val);
  }

  equals(obj) {
    let that = sys.ObjUtil.as(obj, Scalar.type$);
    if (that == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#qname, that.#qname) && sys.ObjUtil.equals(this.#val, that.#val));
  }

  toStr() {
    return this.#val;
  }

}

class SpecSlots {
  constructor() {
    const this$ = this;
  }

  typeof() { return SpecSlots.type$; }

}

class Ref extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Ref.type$; }

  static make() {
    const $self = new Ref();
    Ref.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class XetoContext {
  constructor() {
    const this$ = this;
  }

  typeof() { return XetoContext.type$; }

}

class NilXetoContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NilXetoContext.type$; }

  static #val = undefined;

  static val() {
    if (NilXetoContext.#val === undefined) {
      NilXetoContext.static$init();
      if (NilXetoContext.#val === undefined) NilXetoContext.#val = null;
    }
    return NilXetoContext.#val;
  }

  xetoReadById(id) {
    return null;
  }

  xetoReadAllEachWhile(filter,f) {
    return null;
  }

  xetoIsSpec(spec,rec) {
    return false;
  }

  static make() {
    const $self = new NilXetoContext();
    NilXetoContext.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    NilXetoContext.#val = NilXetoContext.make();
    return;
  }

}

class UnitQuantity extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnitQuantity.type$; }

  static dimensionless() { return UnitQuantity.vals().get(0); }

  static currency() { return UnitQuantity.vals().get(1); }

  static acceleration() { return UnitQuantity.vals().get(2); }

  static angularAcceleration() { return UnitQuantity.vals().get(3); }

  static angularMomentum() { return UnitQuantity.vals().get(4); }

  static angularVelocity() { return UnitQuantity.vals().get(5); }

  static area() { return UnitQuantity.vals().get(6); }

  static capacitance() { return UnitQuantity.vals().get(7); }

  static coolingEfficiency() { return UnitQuantity.vals().get(8); }

  static density() { return UnitQuantity.vals().get(9); }

  static electricCharge() { return UnitQuantity.vals().get(10); }

  static electricConductance() { return UnitQuantity.vals().get(11); }

  static electricCurrent() { return UnitQuantity.vals().get(12); }

  static electromagneticMoment() { return UnitQuantity.vals().get(13); }

  static electricCurrentDensity() { return UnitQuantity.vals().get(14); }

  static electricFieldStrength() { return UnitQuantity.vals().get(15); }

  static electricPotential() { return UnitQuantity.vals().get(16); }

  static electricResistance() { return UnitQuantity.vals().get(17); }

  static electricalConductivity() { return UnitQuantity.vals().get(18); }

  static electricalResistivity() { return UnitQuantity.vals().get(19); }

  static energy() { return UnitQuantity.vals().get(20); }

  static apparentEnergy() { return UnitQuantity.vals().get(21); }

  static reactiveEnergy() { return UnitQuantity.vals().get(22); }

  static energyByArea() { return UnitQuantity.vals().get(23); }

  static energyByVolume() { return UnitQuantity.vals().get(24); }

  static enthalpy() { return UnitQuantity.vals().get(25); }

  static entropy() { return UnitQuantity.vals().get(26); }

  static force() { return UnitQuantity.vals().get(27); }

  static frequency() { return UnitQuantity.vals().get(28); }

  static grammage() { return UnitQuantity.vals().get(29); }

  static heatingRate() { return UnitQuantity.vals().get(30); }

  static illuminance() { return UnitQuantity.vals().get(31); }

  static inductance() { return UnitQuantity.vals().get(32); }

  static irradiance() { return UnitQuantity.vals().get(33); }

  static length() { return UnitQuantity.vals().get(34); }

  static luminance() { return UnitQuantity.vals().get(35); }

  static luminousFlux() { return UnitQuantity.vals().get(36); }

  static luminousIntensity() { return UnitQuantity.vals().get(37); }

  static magneticFieldStrength() { return UnitQuantity.vals().get(38); }

  static magneticFlux() { return UnitQuantity.vals().get(39); }

  static magneticFluxDensity() { return UnitQuantity.vals().get(40); }

  static mass() { return UnitQuantity.vals().get(41); }

  static massFlow() { return UnitQuantity.vals().get(42); }

  static momentum() { return UnitQuantity.vals().get(43); }

  static power() { return UnitQuantity.vals().get(44); }

  static powerByArea() { return UnitQuantity.vals().get(45); }

  static powerByVolumetricFlow() { return UnitQuantity.vals().get(46); }

  static apparentPower() { return UnitQuantity.vals().get(47); }

  static reactivePower() { return UnitQuantity.vals().get(48); }

  static pressure() { return UnitQuantity.vals().get(49); }

  static specificEntropy() { return UnitQuantity.vals().get(50); }

  static surfaceTension() { return UnitQuantity.vals().get(51); }

  static temperature() { return UnitQuantity.vals().get(52); }

  static temperatureDifferential() { return UnitQuantity.vals().get(53); }

  static thermalConductivity() { return UnitQuantity.vals().get(54); }

  static time() { return UnitQuantity.vals().get(55); }

  static velocity() { return UnitQuantity.vals().get(56); }

  static volume() { return UnitQuantity.vals().get(57); }

  static volumetricFlow() { return UnitQuantity.vals().get(58); }

  static bytes() { return UnitQuantity.vals().get(59); }

  static #vals = undefined;

  static #unitToQuantity$Store = undefined;

  static unitToQuantity$Store(it) { if (it === undefined) return UnitQuantity.#unitToQuantity$Store; else UnitQuantity.#unitToQuantity$Store = it; }

  static unitToQuantity() {
    if (UnitQuantity.unitToQuantity$Store() === undefined) {
      UnitQuantity.unitToQuantity$Store(UnitQuantity.unitToQuantity$Once());
    }
    ;
    return sys.ObjUtil.coerce(UnitQuantity.unitToQuantity$Store(), sys.Type.find("[sys::Unit:xeto::UnitQuantity]"));
  }

  static make($ordinal,$name) {
    const $self = new UnitQuantity();
    UnitQuantity.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(UnitQuantity.type$, UnitQuantity.vals(), name$, checked);
  }

  static unitToQuantity$Once() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Unit"), sys.Type.find("xeto::UnitQuantity"));
    sys.Unit.quantities().each((qn) => {
      let q = UnitQuantity.fromStr(sys.Str.fromDisplayName(qn), false);
      if (q == null) {
        sys.ObjUtil.echo(sys.Str.plus("WARN: UnitQuantity not mapped by enum: ", qn));
      }
      else {
        sys.Unit.quantity(qn).each((u) => {
          acc.set(u, sys.ObjUtil.coerce(q, UnitQuantity.type$));
          return;
        });
      }
      ;
      return;
    });
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("[sys::Unit:xeto::UnitQuantity]"));
  }

  static vals() {
    if (UnitQuantity.#vals == null) {
      UnitQuantity.#vals = sys.List.make(UnitQuantity.type$, [
        UnitQuantity.make(0, "dimensionless", ),
        UnitQuantity.make(1, "currency", ),
        UnitQuantity.make(2, "acceleration", ),
        UnitQuantity.make(3, "angularAcceleration", ),
        UnitQuantity.make(4, "angularMomentum", ),
        UnitQuantity.make(5, "angularVelocity", ),
        UnitQuantity.make(6, "area", ),
        UnitQuantity.make(7, "capacitance", ),
        UnitQuantity.make(8, "coolingEfficiency", ),
        UnitQuantity.make(9, "density", ),
        UnitQuantity.make(10, "electricCharge", ),
        UnitQuantity.make(11, "electricConductance", ),
        UnitQuantity.make(12, "electricCurrent", ),
        UnitQuantity.make(13, "electromagneticMoment", ),
        UnitQuantity.make(14, "electricCurrentDensity", ),
        UnitQuantity.make(15, "electricFieldStrength", ),
        UnitQuantity.make(16, "electricPotential", ),
        UnitQuantity.make(17, "electricResistance", ),
        UnitQuantity.make(18, "electricalConductivity", ),
        UnitQuantity.make(19, "electricalResistivity", ),
        UnitQuantity.make(20, "energy", ),
        UnitQuantity.make(21, "apparentEnergy", ),
        UnitQuantity.make(22, "reactiveEnergy", ),
        UnitQuantity.make(23, "energyByArea", ),
        UnitQuantity.make(24, "energyByVolume", ),
        UnitQuantity.make(25, "enthalpy", ),
        UnitQuantity.make(26, "entropy", ),
        UnitQuantity.make(27, "force", ),
        UnitQuantity.make(28, "frequency", ),
        UnitQuantity.make(29, "grammage", ),
        UnitQuantity.make(30, "heatingRate", ),
        UnitQuantity.make(31, "illuminance", ),
        UnitQuantity.make(32, "inductance", ),
        UnitQuantity.make(33, "irradiance", ),
        UnitQuantity.make(34, "length", ),
        UnitQuantity.make(35, "luminance", ),
        UnitQuantity.make(36, "luminousFlux", ),
        UnitQuantity.make(37, "luminousIntensity", ),
        UnitQuantity.make(38, "magneticFieldStrength", ),
        UnitQuantity.make(39, "magneticFlux", ),
        UnitQuantity.make(40, "magneticFluxDensity", ),
        UnitQuantity.make(41, "mass", ),
        UnitQuantity.make(42, "massFlow", ),
        UnitQuantity.make(43, "momentum", ),
        UnitQuantity.make(44, "power", ),
        UnitQuantity.make(45, "powerByArea", ),
        UnitQuantity.make(46, "powerByVolumetricFlow", ),
        UnitQuantity.make(47, "apparentPower", ),
        UnitQuantity.make(48, "reactivePower", ),
        UnitQuantity.make(49, "pressure", ),
        UnitQuantity.make(50, "specificEntropy", ),
        UnitQuantity.make(51, "surfaceTension", ),
        UnitQuantity.make(52, "temperature", ),
        UnitQuantity.make(53, "temperatureDifferential", ),
        UnitQuantity.make(54, "thermalConductivity", ),
        UnitQuantity.make(55, "time", ),
        UnitQuantity.make(56, "velocity", ),
        UnitQuantity.make(57, "volume", ),
        UnitQuantity.make(58, "volumetricFlow", ),
        UnitQuantity.make(59, "bytes", ),
      ]).toImmutable();
    }
    return UnitQuantity.#vals;
  }

  static static$init() {
    const $_u14 = UnitQuantity.vals();
    if (true) {
    }
    ;
    UnitQuantity.#unitToQuantity$Store = "_once_";
    return;
  }

}

class Link {
  constructor() {
    const this$ = this;
  }

  typeof() { return Link.type$; }

}

class Links {
  constructor() {
    const this$ = this;
  }

  typeof() { return Links.type$; }

}

class SpecFlavor extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SpecFlavor.type$; }

  static type() { return SpecFlavor.vals().get(0); }

  static global() { return SpecFlavor.vals().get(1); }

  static meta() { return SpecFlavor.vals().get(2); }

  static slot() { return SpecFlavor.vals().get(3); }

  static #vals = undefined;

  isType() {
    return this === SpecFlavor.type();
  }

  isGlobal() {
    return this === SpecFlavor.global();
  }

  isMeta() {
    return this === SpecFlavor.meta();
  }

  isSlot() {
    return this === SpecFlavor.slot();
  }

  isTop() {
    return this !== SpecFlavor.slot();
  }

  static make($ordinal,$name) {
    const $self = new SpecFlavor();
    SpecFlavor.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(SpecFlavor.type$, SpecFlavor.vals(), name$, checked);
  }

  static vals() {
    if (SpecFlavor.#vals == null) {
      SpecFlavor.#vals = sys.List.make(SpecFlavor.type$, [
        SpecFlavor.make(0, "type", ),
        SpecFlavor.make(1, "global", ),
        SpecFlavor.make(2, "meta", ),
        SpecFlavor.make(3, "slot", ),
      ]).toImmutable();
    }
    return SpecFlavor.#vals;
  }

  static static$init() {
    const $_u15 = SpecFlavor.vals();
    if (true) {
    }
    ;
    return;
  }

}

class SpecChoice {
  constructor() {
    const this$ = this;
  }

  typeof() { return SpecChoice.type$; }

}

class SpecBinding extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SpecBinding.type$; }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.spec()), " | "), this.type());
  }

  static make() {
    const $self = new SpecBinding();
    SpecBinding.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class SpecEnum {
  constructor() {
    const this$ = this;
  }

  typeof() { return SpecEnum.type$; }

}

class LibVersion {
  constructor() {
    const this$ = this;
  }

  typeof() { return LibVersion.type$; }

  compare(that) {
    let a = this;
    let b = sys.ObjUtil.coerce(that, LibVersion.type$);
    let cmp = sys.ObjUtil.compare(a.name(), b.name());
    if (sys.ObjUtil.compareNE(cmp, 0)) {
      return cmp;
    }
    ;
    return sys.ObjUtil.compare(a.version(), b.version());
  }

  asDepend() {
    return sys.ObjUtil.coerce(LibDepend.make(this.name(), sys.ObjUtil.coerce(LibDependVersions.fromVersion(this.version()), LibDependVersions.type$)), LibDepend.type$);
  }

  static orderByDepends(libs) {
    const this$ = this;
    let byName = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::LibVersion"));
    libs.each((x) => {
      byName.add(x.name(), x);
      return;
    });
    libs.each((x) => {
      x.depends().each((d) => {
        let m = byName.get(d.name());
        if ((m == null || !d.versions().contains(m.version()))) {
          throw LibVersion.makeDependErr(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", x), " dependency: "), d), " ["), m), "]"));
        }
        ;
        return;
      });
      return;
    });
    let left = libs.dup().sort();
    let ordered = sys.List.make(LibVersion.type$);
    ordered.capacity(libs.size());
    while (!left.isEmpty()) {
      let i = left.findIndex((x) => {
        return LibVersion.noDependsInLeft(left, x);
      });
      if (i == null) {
        throw LibVersion.makeDependErr("Circular depends");
      }
      ;
      ordered.add(left.removeAt(sys.ObjUtil.coerce(i, sys.Int.type$)));
    }
    ;
    return ordered;
  }

  static makeDependErr(msg) {
    return sys.ObjUtil.coerce(sys.Type.find("haystack::DependErr").make(sys.List.make(sys.Str.type$, [msg])), sys.Err.type$);
  }

  static noDependsInLeft(left,x) {
    const this$ = this;
    return x.depends().all((d) => {
      return left.all((q) => {
        return sys.ObjUtil.compareNE(q.name(), d.name());
      });
    });
  }

}

class Function {
  constructor() {
    const this$ = this;
  }

  typeof() { return Function.type$; }

}

class MethodFunction extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MethodFunction.type$; }

  #method = null;

  // private field reflection only
  __method(it) { if (it === undefined) return this.#method; else this.#method = it; }

  static make(method) {
    const $self = new MethodFunction();
    MethodFunction.make$($self,method);
    return $self;
  }

  static make$($self,method) {
    $self.#method = method;
    return;
  }

  isAsync() {
    return false;
  }

  call(self$,arg) {
    return this.#method.callOn(self$, sys.List.make(sys.Obj.type$.toNullable(), [arg]));
  }

  callAsync(self$,arg,cb) {
    try {
      sys.Func.call(cb, null, this.call(self$, arg));
    }
    catch ($_u16) {
      $_u16 = sys.Err.make($_u16);
      if ($_u16 instanceof sys.Err) {
        let e = $_u16;
        ;
        sys.Func.call(cb, e, null);
      }
      else {
        throw $_u16;
      }
    }
    ;
    return;
  }

}

class SyncFunction extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SyncFunction.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  static make(func) {
    const $self = new SyncFunction();
    SyncFunction.make$($self,func);
    return $self;
  }

  static make$($self,func) {
    $self.#func = func;
    return;
  }

  isAsync() {
    return false;
  }

  call(comp,arg) {
    return sys.Func.call(this.#func, comp, arg);
  }

  callAsync(self$,arg,cb) {
    try {
      sys.Func.call(cb, null, this.call(self$, arg));
    }
    catch ($_u17) {
      $_u17 = sys.Err.make($_u17);
      if ($_u17 instanceof sys.Err) {
        let e = $_u17;
        ;
        sys.Func.call(cb, e, null);
      }
      else {
        throw $_u17;
      }
    }
    ;
    return;
  }

}

class AsyncFunction extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsyncFunction.type$; }

  #func = null;

  // private field reflection only
  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  static make(func) {
    const $self = new AsyncFunction();
    AsyncFunction.make$($self,func);
    return $self;
  }

  static make$($self,func) {
    $self.#func = func;
    return;
  }

  isAsync() {
    return true;
  }

  call(comp,arg) {
    throw sys.Err.make("Must use callAsync");
  }

  callAsync(self$,arg,cb) {
    sys.Func.call(this.#func, self$, arg, cb);
    return;
  }

}

class XetoLogRec {
  constructor() {
    const this$ = this;
  }

  typeof() { return XetoLogRec.type$; }

  static make(level,id,msg,loc,err) {
    return MXetoLogRec.make(level, id, msg, loc, err);
  }

}

class MXetoLogRec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MXetoLogRec.type$; }

  #level = null;

  level() { return this.#level; }

  __level(it) { if (it === undefined) return this.#level; else this.#level = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #msg = null;

  msg() { return this.#msg; }

  __msg(it) { if (it === undefined) return this.#msg; else this.#msg = it; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #err = null;

  err() { return this.#err; }

  __err(it) { if (it === undefined) return this.#err; else this.#err = it; }

  static make(level,id,msg,loc,err) {
    const $self = new MXetoLogRec();
    MXetoLogRec.make$($self,level,id,msg,loc,err);
    return $self;
  }

  static make$($self,level,id,msg,loc,err) {
    $self.#level = level;
    $self.#id = id;
    $self.#msg = msg;
    $self.#loc = loc;
    $self.#err = err;
    return;
  }

  toStr() {
    let s = sys.StrBuf.make();
    if (this.#id != null) {
      s.add("@").add(this.#id).add(" ");
    }
    ;
    s.add(sys.Str.upper(this.#level.name())).add(": ").add(this.#msg);
    if (!this.#loc.isUnknown()) {
      s.add(" [").add(this.#loc).add("]");
    }
    ;
    return s.toStr();
  }

}

class LibNamespace {
  constructor() {
    const this$ = this;
  }

  typeof() { return LibNamespace.type$; }

  static #systemRef = undefined;

  static systemRef() {
    if (LibNamespace.#systemRef === undefined) {
      LibNamespace.static$init();
      if (LibNamespace.#systemRef === undefined) LibNamespace.#systemRef = null;
    }
    return LibNamespace.#systemRef;
  }

  static system() {
    let ns = LibNamespace.systemRef().val();
    if (ns == null) {
      LibNamespace.systemRef().val((ns = LibNamespace.createSystem()));
    }
    ;
    return sys.ObjUtil.coerce(ns, LibNamespace.type$);
  }

  static installSystem(ns) {
    return LibNamespace.systemRef().compareAndSet(null, ns);
  }

  static createSystem() {
    const this$ = this;
    let repo = LibRepo.cur();
    let libs = LibNamespace.defaultSystemLibNames();
    let vers = sys.List.make(LibVersion.type$);
    libs.each((libName) => {
      vers.addNotNull(repo.latest(libName, false));
      return;
    });
    return repo.createNamespace(vers);
  }

  static defaultSystemLibNames() {
    return sys.List.make(sys.Str.type$, ["sys", "sys.comp", "axon", "ion", "ion.actions", "ion.events", "ion.icons", "ion.inputs", "ion.form", "ion.styles", "ion.misc", "ion.table", "ion.ux"]);
  }

  static createSystemOverlay(usings,log) {
    const this$ = this;
    let repo = LibRepo.cur();
    let system = LibNamespace.system();
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::LibVersion"));
    usings.each((rec) => {
      let name = sys.ObjUtil.as(rec.get("using"), sys.Str.type$);
      if (name == null) {
        return;
      }
      ;
      if (system.hasLib(sys.ObjUtil.coerce(name, sys.Str.type$))) {
        return;
      }
      ;
      if (acc.get(sys.ObjUtil.coerce(name, sys.Str.type$)) != null) {
        log.warn(sys.Str.plus(sys.Str.plus("Duplicate using [", name), "]"));
      }
      else {
        acc.addNotNull(sys.ObjUtil.coerce(name, sys.Str.type$), repo.latest(sys.ObjUtil.coerce(name, sys.Str.type$), false));
      }
      ;
      return;
    });
    return repo.createOverlayNamespace(system, acc.vals());
  }

  static static$init() {
    LibNamespace.#systemRef = concurrent.AtomicRef.make();
    return;
  }

}

class LibStatus extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LibStatus.type$; }

  static notLoaded() { return LibStatus.vals().get(0); }

  static ok() { return LibStatus.vals().get(1); }

  static err() { return LibStatus.vals().get(2); }

  static #vals = undefined;

  isOk() {
    return this === LibStatus.ok();
  }

  isErr() {
    return this === LibStatus.err();
  }

  isNotLoaded() {
    return this === LibStatus.notLoaded();
  }

  isLoaded() {
    return this !== LibStatus.notLoaded();
  }

  static make($ordinal,$name) {
    const $self = new LibStatus();
    LibStatus.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(LibStatus.type$, LibStatus.vals(), name$, checked);
  }

  static vals() {
    if (LibStatus.#vals == null) {
      LibStatus.#vals = sys.List.make(LibStatus.type$, [
        LibStatus.make(0, "notLoaded", ),
        LibStatus.make(1, "ok", ),
        LibStatus.make(2, "err", ),
      ]).toImmutable();
    }
    return LibStatus.#vals;
  }

  static static$init() {
    const $_u18 = LibStatus.vals();
    if (true) {
    }
    ;
    return;
  }

}

class Spec {
  constructor() {
    const this$ = this;
  }

  typeof() { return Spec.type$; }

}



class NameDict extends sys.Obj
{
  constructor(table, spec, ...entries) {
    super();
    this.#table = table ?? NameTable.makeEmpty();
    this.#spec = spec;
    this.#entries = sys.Map.make(sys.Int.type$, sys.Obj.type$);
    this.#entries.ordered(true);
    let i = 0;
    while (i < entries.length) {
      const code = table.add(entries[i]);
      const val  = entries[i+1];
      this.#entries.add(code, sys.ObjUtil.toImmutable(val));
      i += 2;
    }
  }

  static #empty;
  static empty() {
    if (!NameDict.#empty) NameDict.#empty = new NameDict(null, null);
    return NameDict.#empty;
  }

  static #refType;
  static __refType() {
    if (!NameDict.#refType) NameDict.#refType = sys.Type.find("haystack::Ref");
    return NameDict.#refType;
  }

  #table;
  __table() { return this.#table; }
  #spec;
  #entries;

  typeof() { return NameDict.type$; }

  spec() { return this.#spec ?? XetoEnv.cur().dictSpec(); }

  id() {
    const val = this.#get(this.#table.idCode())
    if (val != null) return sys.ObjUtil.as(val, NameDict.__refType());
    throw sys.UnresolvedErr.make("id");
  }

  isEmpty() { return this.#entries.isEmpty(); }

  size() { return this.#entries.size(); }

  fixedSize() {
    const size = this.size();
    if (size < 9) return size;
    return -1;
  }

  has(name) { return this.get(name) != null; }

  missing(name) { return this.get(name) == null; }

  get(name, def=null) {
    return this.#get(this.#table.toCode(name), def);
  }

  getByCode(code) { return this.#get(code); }

  #get(code, def=null) {
    return this.#entries.get(code) ?? def;
  }

  each(f) { this.#entries.each((v, n) => f(v, this.#table.toName(n))); }

  eachWhile(f) {
    return this.#entries.eachWhile((v, n) => { return f(v, this.#table.toName(n)); });
  }

  map(f) {
    const newEntries = [];
    for (const [key, value] of this.#entries) {
      const name = this.#table.toName(key);
      const newVal = f(value, name);
      newEntries.push(name, newVal);
    }
    return new NameDict(this.#table, this.#spec, ...newEntries);
  }

  trap(name, args=null) {
    const val = this.get(name);
    if (val != null) return val;
    throw sys.UnresolvedErr.make(name);
  }

  nameAt(i) { return this.#entries.keys().get(i); }

  valAt(i) { return this.#entries.vals().get(i); }

  // if we do toStr() probably should be str name instead of int code for key
  // toStr() { return this.#entries.toStr(); }
}

class NameDictReader {
  constructor() {
    const this$ = this;
  }

  typeof() { return NameDictReader.type$; }

}



class NameTable extends sys.Obj
{


  constructor(empty=false) {
    super();
    this.#byCode = [];
    this.#map = new js.Map();
    if (!empty) {
      this.#emptyCode = this.#put("");
      this.#idCode    = this.#put("id");
    }
  }

  static initSize() { return 2; }

  static #maxSize = 1_000_000;

  #byCode;
  #map;
  #emptyCode;
  #idCode;
  #isSparse = false;

  static make() { return new NameTable(); }
  static makeEmpty() { return new NameTable(true); }


  typeof() { return NameTable.type$; }

  toStr() { return "NameTable"; }

  isSparse() { return this.#isSparse; }

  size() { return this.#map.size; }

  maxCode() { return this.#map.size; }

  toCode(name) { return this.#code(name); }

  toName(code) { return this.#name(code); }

  add(name) { return this.#put(name); }

  set(code, name) {
    // if already set, then ignore (we don't actually check name though)
    if (this.#byCode[code]) return;

    // add to lookup table
    this.#doPut(code, name);
  }


  emptyCode() { return this.#emptyCode; }
  idCode() { return this.#idCode; }

  #name(code) {
    const name = this.#byCode[code];
    if (name == undefined) throw sys.Err.make(`Invalid name code: ${code}`);
    return name;
  }

  #code(name) {
    return this.#map.get(name) ?? 0;
  }

  #put(name) {
    const code = this.#code(name);
    if (code > 0) return code;

    // add to lookup table
    return this.#doPut(-1, name);
  }

  #doPut(code, name) {
    // allocate code unless this is a set
    if (code < 0) {
      if (this.#isSparse) throw sys.Err.make("Cannot call add once set has been called");
      code = this.size() + 1;
    } else {
      this.#isSparse = true;
    }

    if (this.size() > NameTable.#maxSize) throw Err.make(`Max names exceeded: ${NameTable.#maxSize}`);

    this.#byCode[code] = name;
    this.#map.set(name, code);

    return code;
  }

  dump(out) {
    out.printLine(`=== NameTable [${this.size()}] ===`);
    for (let i = 0; i <=this.size(); ++i) {
      out.printLine(`${i.toString().padStart(6)}: ${this.#byCode[i]}`)
    }
    out.printLine();
  }


  dict1(n0, v0, spec=null) {
    return new NameDict(this, spec, n0, v0);
  }

  dict2(n0, v0, n1, v1, spec=null) {
    return new NameDict(this, spec, n0, v0, n1, v1);
  }

  dict3(n0, v0, n1, v1, n2, v2, spec=null) {
    return new NameDict(this, spec, n0, v0, n1, v1, n2, v2);
  }

  dict4(n0, v0, n1, v1, n2, v2, n3, v3, spec=null) {
    return new NameDict(this, spec, n0, v0, n1, v1, n2, v2, n3, v3);
  }

  dict5(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, spec=null) {
    return new NameDict(this, spec, n0, v0, n1, v1, n2, v2, n3, v3, n4, v4);
  }

  dict6(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5, spec=null) {
    return new NameDict(this, spec, n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5);
  }

  dict7(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5, n6, v6, spec=null) {
    return new NameDict(this, spec, n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5, n6, v6);
  }

  dict8(n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5, n6, v6, n7, v7, spec=null) {
    return new NameDict(this, spec, n0, v0, n1, v1, n2, v2, n3, v3, n4, v4, n5, v5, n6, v6, n7, v7);
  }

  dictMap(map, spec=null) {
    if (map.isEmpty()) return NameDict.empty();

    const entries = [];
    map.each((v, k) => { entries.push(k, v); });
    return new NameDict(this, spec, ...entries);
  }

  dictDict(dict, spec=null) {
    if (dict.isEmpty()) return NameDict.empty();

    if (dict instanceof NameDict) {
      if (dict.__table() == this) return dict;
    }

    const entries = [];
    dict.each((v, k) => { entries.push(k, v); });
    return new NameDict(this, spec, ...entries);
  }

  readDict(size, r, spec) {
    if (size == 0) return NameDict.empty();
    const entries = [];
    for (let i=0; i < size; ++i) {
      entries.push(this.#name(r.readName()), r.readVal());
    }
    return new NameDict(this, spec, ...entries);
  }

}

const p = sys.Pod.add$('xeto');
const xp = sys.Param.noParams$();
let m;
Comp.type$ = p.am$('Comp','sys::Obj',[],{'sys::Js':""},8449,Comp);
CompObj.type$ = p.at$('CompObj','sys::Obj',['xeto::Comp'],{'sys::Js':""},8192,CompObj);
CompContext.type$ = p.am$('CompContext','sys::Obj',[],{'sys::Js':""},8449,CompContext);
AbstractCompSpace.type$ = p.am$('AbstractCompSpace','sys::Obj',[],{'sys::Js':"",'sys::NoDoc':""},8449,AbstractCompSpace);
CompSpi.type$ = p.am$('CompSpi','sys::Obj',[],{'sys::Js':"",'sys::NoDoc':""},8449,CompSpi);
Dict.type$ = p.am$('Dict','sys::Obj',[],{'sys::Js':""},8451,Dict);
CompLayout.type$ = p.at$('CompLayout','sys::Obj',[],{'sys::Js':""},8226,CompLayout);
XetoEnv.type$ = p.at$('XetoEnv','sys::Obj',[],{},8194,XetoEnv);
Lib.type$ = p.am$('Lib','sys::Obj',['xeto::Dict'],{'sys::Js':""},8451,Lib);
LibFiles.type$ = p.am$('LibFiles','sys::Obj',[],{'sys::Js':""},8451,LibFiles);
LibRepo.type$ = p.am$('LibRepo','sys::Obj',[],{'sys::Js':""},8451,LibRepo);
LibDepend.type$ = p.am$('LibDepend','sys::Obj',['xeto::Dict'],{'sys::Js':""},8451,LibDepend);
LibDependVersions.type$ = p.am$('LibDependVersions','sys::Obj',[],{'sys::Js':""},8451,LibDependVersions);
MLibDependVersions.type$ = p.at$('MLibDependVersions','sys::Obj',['xeto::LibDependVersions'],{'sys::Js':""},130,MLibDependVersions);
Scalar.type$ = p.at$('Scalar','sys::Obj',[],{'sys::Js':""},8226,Scalar);
SpecSlots.type$ = p.am$('SpecSlots','sys::Obj',[],{'sys::Js':""},8451,SpecSlots);
Ref.type$ = p.at$('Ref','sys::Obj',[],{'sys::Js':""},8195,Ref);
XetoContext.type$ = p.am$('XetoContext','sys::Obj',[],{'sys::Js':""},8449,XetoContext);
NilXetoContext.type$ = p.at$('NilXetoContext','sys::Obj',['xeto::XetoContext'],{'sys::NoDoc':"",'sys::Js':""},8194,NilXetoContext);
UnitQuantity.type$ = p.at$('UnitQuantity','sys::Enum',[],{'sys::NoDoc':"",'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,UnitQuantity);
Link.type$ = p.am$('Link','sys::Obj',['xeto::Dict'],{'sys::Js':""},8451,Link);
Links.type$ = p.am$('Links','sys::Obj',['xeto::Dict'],{'sys::Js':""},8451,Links);
SpecFlavor.type$ = p.at$('SpecFlavor','sys::Enum',[],{'sys::NoDoc':"",'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,SpecFlavor);
SpecChoice.type$ = p.am$('SpecChoice','sys::Obj',[],{'sys::Js':""},8451,SpecChoice);
SpecBinding.type$ = p.at$('SpecBinding','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8195,SpecBinding);
SpecEnum.type$ = p.am$('SpecEnum','sys::Obj',[],{'sys::Js':""},8451,SpecEnum);
LibVersion.type$ = p.am$('LibVersion','sys::Obj',[],{'sys::Js':""},8451,LibVersion);
Function.type$ = p.am$('Function','sys::Obj',[],{'sys::Js':""},8449,Function);
MethodFunction.type$ = p.at$('MethodFunction','sys::Obj',['xeto::Function'],{'sys::NoDoc':"",'sys::Js':""},8194,MethodFunction);
SyncFunction.type$ = p.at$('SyncFunction','sys::Obj',['xeto::Function'],{'sys::NoDoc':"",'sys::Js':""},8192,SyncFunction);
AsyncFunction.type$ = p.at$('AsyncFunction','sys::Obj',['xeto::Function'],{'sys::NoDoc':"",'sys::Js':""},8192,AsyncFunction);
XetoLogRec.type$ = p.am$('XetoLogRec','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8451,XetoLogRec);
MXetoLogRec.type$ = p.at$('MXetoLogRec','sys::Obj',['xeto::XetoLogRec'],{'sys::Js':""},8194,MXetoLogRec);
LibNamespace.type$ = p.am$('LibNamespace','sys::Obj',[],{'sys::Js':""},8451,LibNamespace);
LibStatus.type$ = p.at$('LibStatus','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,LibStatus);
Spec.type$ = p.am$('Spec','sys::Obj',['xeto::Dict'],{'sys::Js':""},8451,Spec);
NameDict.type$ = p.at$('NameDict','sys::Obj',['xeto::Dict'],{'sys::NoDoc':"",'sys::Js':""},8738,NameDict);
NameDictReader.type$ = p.am$('NameDictReader','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8449,NameDictReader);
NameTable.type$ = p.at$('NameTable','sys::Obj',[],{'sys::NoDoc':"",'sys::Js':""},8738,NameTable);
Comp.type$.am$('id',8192,'xeto::Ref',xp,{}).am$('dis',8192,'sys::Str',xp,{}).am$('spec',8192,'xeto::Spec',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('spi',270337,'xeto::CompSpi',xp,{'sys::NoDoc':""}).am$('get',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{'sys::Operator':""}).am$('has',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('call',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('arg','sys::Obj?',true)]),{}).am$('callAsync',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('arg','sys::Obj?',false),new sys.Param('cb','|sys::Err?,sys::Obj?->sys::Void|',false)]),{}).am$('set',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'sys::Operator':""}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('name','sys::Str?',true)]),{'sys::Operator':""}).am$('remove',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('onChange',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','|sys::This,sys::Obj?->sys::Void|',false)]),{}).am$('onCall',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','|sys::This,sys::Obj?->sys::Void|',false)]),{}).am$('onChangeRemove',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','sys::Func',false)]),{}).am$('onCallRemove',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','sys::Func',false)]),{}).am$('onChangePre',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('newVal','sys::Obj?',false)]),{'sys::NoDoc':""}).am$('onChangeThis',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('newVal','sys::Obj?',false)]),{}).am$('onCallThis',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('onMount',270336,'sys::Void',xp,{'sys::NoDoc':""}).am$('onUnmount',270336,'sys::Void',xp,{'sys::NoDoc':""}).am$('onExecute',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','xeto::CompContext',false)]),{}).am$('onExecuteFreq',270336,'sys::Duration?',xp,{}).am$('isMounted',8192,'sys::Bool',xp,{}).am$('parent',270336,'xeto::Comp?',xp,{}).am$('name',8192,'sys::Str',xp,{}).am$('isAbove',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('child','xeto::Comp',false)]),{}).am$('isBelow',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('parent','xeto::Comp',false)]),{}).am$('hasChild',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('child',270336,'xeto::Comp?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachChild',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Comp,sys::Str->sys::Void|',false)]),{}).am$('links',8192,'xeto::Links',xp,{}).am$('dump',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('con','util::Console',true),new sys.Param('opts','sys::Obj?',true)]),{'sys::NoDoc':""});
CompObj.type$.af$('spiRef',67584,'xeto::CompSpi?',{}).am$('make',8196,'sys::Void',xp,{}).am$('makeForSpec',40966,'xeto::CompObj?',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('doMakeForSpec',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('spi',271360,'xeto::CompSpi',xp,{'sys::NoDoc':""});
CompContext.type$.am$('now',270337,'sys::DateTime',xp,{});
AbstractCompSpace.type$.af$('actorKey',106498,'sys::Str',{}).am$('cur',32898,'xeto::AbstractCompSpace',xp,{}).am$('initSpi',270337,'xeto::CompSpi',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::CompObj',false),new sys.Param('spec','xeto::Spec?',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
CompSpi.type$.am$('id',270337,'xeto::Ref',xp,{}).am$('dis',270337,'sys::Str',xp,{}).am$('spec',270337,'xeto::Spec',xp,{}).am$('ver',270337,'sys::Int',xp,{}).am$('get',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('has',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('each',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('call',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('callAsync',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('arg','sys::Obj?',false),new sys.Param('cb','|sys::Err?,sys::Obj?->sys::Void|',false)]),{}).am$('links',270337,'xeto::Links',xp,{}).am$('set',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('add',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('name','sys::Str?',false)]),{}).am$('remove',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('isMounted',270337,'sys::Bool',xp,{}).am$('parent',270337,'xeto::Comp?',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('isAbove',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('child','xeto::Comp',false)]),{}).am$('isBelow',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('parent','xeto::Comp',false)]),{}).am$('hasChild',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('child',270337,'xeto::Comp?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',false)]),{}).am$('eachChild',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Comp,sys::Str->sys::Void|',false)]),{}).am$('onChange',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','|xeto::Comp,sys::Obj?->sys::Void|',false)]),{}).am$('onCall',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','|xeto::Comp,sys::Obj?->sys::Void|',false)]),{}).am$('onChangeRemove',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','sys::Func',false)]),{}).am$('onCallRemove',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','sys::Func',false)]),{}).am$('dump',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('con','util::Console',false),new sys.Param('opts','sys::Obj?',false)]),{});
Dict.type$.am$('_id',270337,'xeto::Ref',xp,{}).am$('isEmpty',270337,'sys::Bool',xp,{}).am$('get',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('has',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('each',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',271361,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('map',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj|',false)]),{});
CompLayout.type$.af$('xRef',67586,'sys::Int',{}).af$('yRef',67586,'sys::Int',{}).af$('wRef',67586,'sys::Int',{}).am$('fromStr',40966,'xeto::CompLayout?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('coerce',40962,'xeto::CompLayout',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj',false)]),{'sys::NoDoc':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Int',false),new sys.Param('y','sys::Int',false),new sys.Param('w','sys::Int',true)]),{}).am$('x',8192,'sys::Int',xp,{}).am$('y',8192,'sys::Int',xp,{}).am$('w',8192,'sys::Int',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{});
XetoEnv.type$.af$('curRef',100354,'concurrent::AtomicRef',{}).af$('pathRef',67586,'sys::File[]',{}).af$('mode',73730,'sys::Str',{'sys::NoDoc':""}).am$('cur',40962,'xeto::XetoEnv',xp,{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mode','sys::Str',false),new sys.Param('path','sys::File[]',false)]),{'sys::NoDoc':""}).am$('homeDir',270336,'sys::File',xp,{}).am$('workDir',270336,'sys::File',xp,{}).am$('installDir',270336,'sys::File',xp,{}).am$('path',8192,'sys::File[]',xp,{}).am$('debugProps',8192,'[sys::Str:sys::Str]',xp,{'sys::NoDoc':""}).am$('dump',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{'sys::NoDoc':""}).am$('main',40962,'sys::Void',xp,{'sys::NoDoc':""}).am$('init',40962,'xeto::XetoEnv',sys.List.make(sys.Param.type$,[new sys.Param('cwd','sys::File?',false)]),{'sys::NoDoc':""}).am$('initXetoProps',34818,'xeto::XetoEnv',sys.List.make(sys.Param.type$,[new sys.Param('workDir','sys::File',false)]),{}).am$('initFanProps',34818,'xeto::XetoEnv',sys.List.make(sys.Param.type$,[new sys.Param('workDir','sys::File',false)]),{}).am$('findWorkDir',34818,'sys::File?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Uri',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Lib.type$.am$('_id',271361,'xeto::Ref',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('meta',270337,'xeto::Dict',xp,{}).am$('version',270337,'sys::Version',xp,{}).am$('depends',270337,'xeto::LibDepend[]',xp,{}).am$('specs',270337,'xeto::Spec[]',xp,{}).am$('spec',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('types',270337,'xeto::Spec[]',xp,{}).am$('type',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('globals',270337,'xeto::Spec[]',xp,{}).am$('global',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('metaSpecs',270337,'xeto::Spec[]',xp,{}).am$('metaSpec',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('instances',270337,'xeto::Dict[]',xp,{}).am$('instance',270337,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachInstance',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Dict->sys::Void|',false)]),{'sys::NoDoc':""}).am$('isSys',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('hasXMeta',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('hasMarkdown',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('loc',270337,'util::FileLoc',xp,{'sys::NoDoc':""}).am$('files',270337,'xeto::LibFiles',xp,{});
LibFiles.type$.am$('isSupported',270337,'sys::Bool',xp,{}).am$('list',270337,'sys::Uri[]',xp,{}).am$('read',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('f','|sys::Err?,sys::InStream?->sys::Void|',false)]),{}).am$('readBuf',270337,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('readStr',270337,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{});
LibRepo.type$.af$('curRef',100354,'concurrent::AtomicRef',{}).am$('cur',40962,'xeto::LibRepo',xp,{}).am$('install',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false)]),{'sys::NoDoc':""}).am$('libs',270337,'sys::Str[]',xp,{}).am$('versions',270337,'xeto::LibVersion[]?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('version',270337,'xeto::LibVersion?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('version','sys::Version',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('latest',270337,'xeto::LibVersion?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('latestMatch',270337,'xeto::LibVersion?',sys.List.make(sys.Param.type$,[new sys.Param('depend','xeto::LibDepend',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('solveDepends',270337,'xeto::LibVersion[]',sys.List.make(sys.Param.type$,[new sys.Param('libs','xeto::LibDepend[]',false)]),{}).am$('createNamespace',270337,'xeto::LibNamespace',sys.List.make(sys.Param.type$,[new sys.Param('libs','xeto::LibVersion[]',false)]),{}).am$('createOverlayNamespace',270337,'xeto::LibNamespace',sys.List.make(sys.Param.type$,[new sys.Param('base','xeto::LibNamespace',false),new sys.Param('libs','xeto::LibVersion[]',false)]),{}).am$('build',270337,'xeto::LibNamespace',sys.List.make(sys.Param.type$,[new sys.Param('libs','xeto::LibVersion[]',false)]),{'sys::NoDoc':""}).am$('rescan',270337,'sys::This',xp,{'sys::NoDoc':""}).am$('createFromData',270337,'xeto::LibNamespace',sys.List.make(sys.Param.type$,[new sys.Param('recs','xeto::Dict[]',false)]),{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
LibDepend.type$.am$('make',40966,'xeto::LibDepend?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('versions','xeto::LibDependVersions',true)]),{}).am$('name',270337,'sys::Str',xp,{}).am$('versions',270337,'xeto::LibDependVersions',xp,{}).am$('toStr',271361,'sys::Str',xp,{});
LibDependVersions.type$.am$('wildcard',40962,'xeto::LibDependVersions',xp,{}).am$('fromStr',40966,'xeto::LibDependVersions?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('fromVersion',40966,'xeto::LibDependVersions?',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Version',false)]),{}).am$('contains',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('version','sys::Version',false)]),{});
MLibDependVersions.type$.af$('wildcardRef',106498,'xeto::MLibDependVersions',{}).af$('isRange',73730,'sys::Bool',{}).af$('a0',73730,'sys::Int',{}).af$('a1',73730,'sys::Int',{}).af$('a2',73730,'sys::Int',{}).af$('b0',73730,'sys::Int',{}).af$('b1',73730,'sys::Int',{}).af$('b2',73730,'sys::Int',{}).am$('fromStr',40966,'xeto::MLibDependVersions?',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('parseSeg',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('makeWildcard',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a0','sys::Int',false),new sys.Param('a1','sys::Int',false),new sys.Param('a2','sys::Int',false)]),{}).am$('makeRange',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a0','sys::Int',false),new sys.Param('a1','sys::Int',false),new sys.Param('a2','sys::Int',false),new sys.Param('b0','sys::Int',false),new sys.Param('b1','sys::Int',false),new sys.Param('b2','sys::Int',false)]),{}).am$('contains',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Version',false)]),{}).am$('eq',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('actual','sys::Int',false),new sys.Param('constraint','sys::Int',false)]),{}).am$('gt',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('actual','sys::Int',false),new sys.Param('constraint','sys::Int',false)]),{}).am$('lt',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('actual','sys::Int',false),new sys.Param('constraint','sys::Int',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Scalar.type$.af$('qname',73730,'sys::Str',{}).af$('val',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('val','sys::Str',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
SpecSlots.type$.am$('isEmpty',270337,'sys::Bool',xp,{}).am$('has',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('get',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('names',270337,'sys::Str[]',xp,{}).am$('each',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Spec->sys::Void|',false)]),{}).am$('eachWhile',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Spec->sys::Obj?|',false)]),{}).am$('toDict',270337,'xeto::Dict',xp,{'sys::NoDoc':""});
Ref.type$.am$('id',270337,'sys::Str',xp,{}).am$('dis',270337,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
XetoContext.type$.am$('xetoReadById',270337,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false)]),{'sys::NoDoc':""}).am$('xetoReadAllEachWhile',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false),new sys.Param('f','|xeto::Dict->sys::Obj?|',false)]),{'sys::NoDoc':""}).am$('xetoIsSpec',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','sys::Str',false),new sys.Param('rec','xeto::Dict',false)]),{'sys::NoDoc':""});
NilXetoContext.type$.af$('val',106498,'xeto::NilXetoContext',{}).am$('xetoReadById',271360,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false)]),{}).am$('xetoReadAllEachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false),new sys.Param('f','|xeto::Dict->sys::Obj?|',false)]),{}).am$('xetoIsSpec',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','sys::Str',false),new sys.Param('rec','xeto::Dict',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
UnitQuantity.type$.af$('dimensionless',106506,'xeto::UnitQuantity',{}).af$('currency',106506,'xeto::UnitQuantity',{}).af$('acceleration',106506,'xeto::UnitQuantity',{}).af$('angularAcceleration',106506,'xeto::UnitQuantity',{}).af$('angularMomentum',106506,'xeto::UnitQuantity',{}).af$('angularVelocity',106506,'xeto::UnitQuantity',{}).af$('area',106506,'xeto::UnitQuantity',{}).af$('capacitance',106506,'xeto::UnitQuantity',{}).af$('coolingEfficiency',106506,'xeto::UnitQuantity',{}).af$('density',106506,'xeto::UnitQuantity',{}).af$('electricCharge',106506,'xeto::UnitQuantity',{}).af$('electricConductance',106506,'xeto::UnitQuantity',{}).af$('electricCurrent',106506,'xeto::UnitQuantity',{}).af$('electromagneticMoment',106506,'xeto::UnitQuantity',{}).af$('electricCurrentDensity',106506,'xeto::UnitQuantity',{}).af$('electricFieldStrength',106506,'xeto::UnitQuantity',{}).af$('electricPotential',106506,'xeto::UnitQuantity',{}).af$('electricResistance',106506,'xeto::UnitQuantity',{}).af$('electricalConductivity',106506,'xeto::UnitQuantity',{}).af$('electricalResistivity',106506,'xeto::UnitQuantity',{}).af$('energy',106506,'xeto::UnitQuantity',{}).af$('apparentEnergy',106506,'xeto::UnitQuantity',{}).af$('reactiveEnergy',106506,'xeto::UnitQuantity',{}).af$('energyByArea',106506,'xeto::UnitQuantity',{}).af$('energyByVolume',106506,'xeto::UnitQuantity',{}).af$('enthalpy',106506,'xeto::UnitQuantity',{}).af$('entropy',106506,'xeto::UnitQuantity',{}).af$('force',106506,'xeto::UnitQuantity',{}).af$('frequency',106506,'xeto::UnitQuantity',{}).af$('grammage',106506,'xeto::UnitQuantity',{}).af$('heatingRate',106506,'xeto::UnitQuantity',{}).af$('illuminance',106506,'xeto::UnitQuantity',{}).af$('inductance',106506,'xeto::UnitQuantity',{}).af$('irradiance',106506,'xeto::UnitQuantity',{}).af$('length',106506,'xeto::UnitQuantity',{}).af$('luminance',106506,'xeto::UnitQuantity',{}).af$('luminousFlux',106506,'xeto::UnitQuantity',{}).af$('luminousIntensity',106506,'xeto::UnitQuantity',{}).af$('magneticFieldStrength',106506,'xeto::UnitQuantity',{}).af$('magneticFlux',106506,'xeto::UnitQuantity',{}).af$('magneticFluxDensity',106506,'xeto::UnitQuantity',{}).af$('mass',106506,'xeto::UnitQuantity',{}).af$('massFlow',106506,'xeto::UnitQuantity',{}).af$('momentum',106506,'xeto::UnitQuantity',{}).af$('power',106506,'xeto::UnitQuantity',{}).af$('powerByArea',106506,'xeto::UnitQuantity',{}).af$('powerByVolumetricFlow',106506,'xeto::UnitQuantity',{}).af$('apparentPower',106506,'xeto::UnitQuantity',{}).af$('reactivePower',106506,'xeto::UnitQuantity',{}).af$('pressure',106506,'xeto::UnitQuantity',{}).af$('specificEntropy',106506,'xeto::UnitQuantity',{}).af$('surfaceTension',106506,'xeto::UnitQuantity',{}).af$('temperature',106506,'xeto::UnitQuantity',{}).af$('temperatureDifferential',106506,'xeto::UnitQuantity',{}).af$('thermalConductivity',106506,'xeto::UnitQuantity',{}).af$('time',106506,'xeto::UnitQuantity',{}).af$('velocity',106506,'xeto::UnitQuantity',{}).af$('volume',106506,'xeto::UnitQuantity',{}).af$('volumetricFlow',106506,'xeto::UnitQuantity',{}).af$('bytes',106506,'xeto::UnitQuantity',{}).af$('vals',106498,'xeto::UnitQuantity[]',{}).af$('unitToQuantity$Store',755712,'sys::Obj?',{}).am$('unitToQuantity',565250,'[sys::Unit:xeto::UnitQuantity]',xp,{'sys::NoDoc':""}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'xeto::UnitQuantity?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('unitToQuantity$Once',165890,'[sys::Unit:xeto::UnitQuantity]',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
Link.type$.am$('fromRef',270337,'xeto::Ref',xp,{}).am$('fromSlot',270337,'sys::Str',xp,{});
Links.type$.am$('isLinked',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('toSlot','sys::Str',false)]),{}).am$('eachLink',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Str,xeto::Link->sys::Void|',false)]),{}).am$('listOn',270337,'xeto::Link[]',sys.List.make(sys.Param.type$,[new sys.Param('toSlot','sys::Str',false)]),{}).am$('add',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('toSlot','sys::Str',false),new sys.Param('link','xeto::Link',false)]),{}).am$('remove',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('toSlot','sys::Str',false),new sys.Param('link','xeto::Link',false)]),{});
SpecFlavor.type$.af$('type',106506,'xeto::SpecFlavor',{}).af$('global',106506,'xeto::SpecFlavor',{}).af$('meta',106506,'xeto::SpecFlavor',{}).af$('slot',106506,'xeto::SpecFlavor',{}).af$('vals',106498,'xeto::SpecFlavor[]',{}).am$('isType',8192,'sys::Bool',xp,{}).am$('isGlobal',8192,'sys::Bool',xp,{}).am$('isMeta',8192,'sys::Bool',xp,{}).am$('isSlot',8192,'sys::Bool',xp,{}).am$('isTop',8192,'sys::Bool',xp,{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'xeto::SpecFlavor?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
SpecChoice.type$.am$('spec',270337,'xeto::Spec',xp,{}).am$('type',270337,'xeto::Spec',xp,{}).am$('isMaybe',270337,'sys::Bool',xp,{}).am$('isMultiChoice',270337,'sys::Bool',xp,{}).am$('selections',270337,'xeto::Spec[]',sys.List.make(sys.Param.type$,[new sys.Param('instance','xeto::Dict',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('selection',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('instance','xeto::Dict',false),new sys.Param('checked','sys::Bool',true)]),{});
SpecBinding.type$.am$('spec',270337,'sys::Str',xp,{}).am$('type',270337,'sys::Type',xp,{}).am$('isScalar',270337,'sys::Bool',xp,{}).am$('isDict',270337,'sys::Bool',xp,{}).am$('decodeDict',270337,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('xeto','xeto::Dict',false)]),{}).am$('decodeScalar',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('xeto','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('encodeScalar',270337,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('isInheritable',270337,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
SpecEnum.type$.am$('spec',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('keys',270337,'sys::Str[]',xp,{}).am$('each',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Spec,sys::Str->sys::Void|',false)]),{}).am$('xmeta',270337,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str?',true),new sys.Param('checked','sys::Bool',true)]),{});
LibVersion.type$.am$('name',270337,'sys::Str',xp,{}).am$('version',270337,'sys::Version',xp,{}).am$('depends',270337,'xeto::LibDepend[]',xp,{}).am$('doc',270337,'sys::Str',xp,{}).am$('compare',9216,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj',false)]),{}).am$('asDepend',8192,'xeto::LibDepend',xp,{'sys::NoDoc':""}).am$('file',270337,'sys::File?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('isSrc',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('orderByDepends',40962,'xeto::LibVersion[]',sys.List.make(sys.Param.type$,[new sys.Param('libs','xeto::LibVersion[]',false)]),{}).am$('makeDependErr',34818,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('noDependsInLeft',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('left','xeto::LibVersion[]',false),new sys.Param('x','xeto::LibVersion',false)]),{});
Function.type$.am$('isAsync',270337,'sys::Bool',xp,{}).am$('call',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('self','xeto::Comp',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('callAsync',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('self','xeto::Comp',false),new sys.Param('arg','sys::Obj?',false),new sys.Param('cb','|sys::Err?,sys::Obj?->sys::Void|',false)]),{});
MethodFunction.type$.af$('method',67586,'sys::Method',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Method',false)]),{}).am$('isAsync',271360,'sys::Bool',xp,{}).am$('call',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('self','xeto::Comp',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('callAsync',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('self','xeto::Comp',false),new sys.Param('arg','sys::Obj?',false),new sys.Param('cb','|sys::Err?,sys::Obj?->sys::Void|',false)]),{});
SyncFunction.type$.af$('func',67584,'|xeto::Comp,sys::Obj?->sys::Obj?|',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('func','|xeto::Comp,sys::Obj?->sys::Obj?|',false)]),{}).am$('isAsync',271360,'sys::Bool',xp,{}).am$('call',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('comp','xeto::Comp',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('callAsync',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('self','xeto::Comp',false),new sys.Param('arg','sys::Obj?',false),new sys.Param('cb','|sys::Err?,sys::Obj?->sys::Void|',false)]),{});
AsyncFunction.type$.af$('func',67584,'|xeto::Comp,sys::Obj?,|sys::Err?,sys::Obj?->sys::Void|->sys::Void|',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('func','|xeto::Comp,sys::Obj?,|sys::Err?,sys::Obj?->sys::Void|->sys::Void|',false)]),{}).am$('isAsync',271360,'sys::Bool',xp,{}).am$('call',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('comp','xeto::Comp',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('callAsync',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('self','xeto::Comp',false),new sys.Param('arg','sys::Obj?',false),new sys.Param('cb','|sys::Err?,sys::Obj?->sys::Void|',false)]),{});
XetoLogRec.type$.am$('make',40966,'xeto::XetoLogRec?',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::LogLevel',false),new sys.Param('id','xeto::Ref?',false),new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('err','sys::Err?',false)]),{}).am$('id',270337,'xeto::Ref?',xp,{}).am$('level',270337,'sys::LogLevel',xp,{}).am$('msg',270337,'sys::Str',xp,{}).am$('loc',270337,'util::FileLoc',xp,{}).am$('err',270337,'sys::Err?',xp,{});
MXetoLogRec.type$.af$('level',336898,'sys::LogLevel',{}).af$('id',336898,'xeto::Ref?',{}).af$('msg',336898,'sys::Str',{}).af$('loc',336898,'util::FileLoc',{}).af$('err',336898,'sys::Err?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::LogLevel',false),new sys.Param('id','xeto::Ref?',false),new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('err','sys::Err?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
LibNamespace.type$.af$('systemRef',100354,'concurrent::AtomicRef',{}).am$('system',40962,'xeto::LibNamespace',xp,{'sys::NoDoc':""}).am$('installSystem',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false)]),{'sys::NoDoc':""}).am$('createSystem',34818,'xeto::LibNamespace',xp,{}).am$('defaultSystemLibNames',40962,'sys::Str[]',xp,{'sys::NoDoc':""}).am$('createSystemOverlay',40962,'xeto::LibNamespace',sys.List.make(sys.Param.type$,[new sys.Param('usings','xeto::Dict[]',false),new sys.Param('log','sys::Log',false)]),{'sys::NoDoc':""}).am$('names',270337,'xeto::NameTable',xp,{'sys::NoDoc':""}).am$('isRemote',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('base',270337,'xeto::LibNamespace?',xp,{}).am$('isOverlay',270337,'sys::Bool',xp,{}).am$('digest',270337,'sys::Str',xp,{}).am$('versions',270337,'xeto::LibVersion[]',xp,{}).am$('version',270337,'xeto::LibVersion?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('hasLib',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('libStatus',270337,'xeto::LibStatus?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('libErr',270337,'sys::Err?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('isAllLoaded',270337,'sys::Bool',xp,{}).am$('lib',270337,'xeto::Lib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('libs',270337,'xeto::Lib[]',xp,{}).am$('libsAllAsync',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Err?,xeto::Lib[]?->sys::Void|',false)]),{}).am$('libAsync',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('f','|sys::Err?,xeto::Lib?->sys::Void|',false)]),{}).am$('libListAsync',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('names','sys::Str[]',false),new sys.Param('f','|sys::Err?,xeto::Lib[]?->sys::Void|',false)]),{}).am$('sysLib',270337,'xeto::Lib',xp,{'sys::NoDoc':""}).am$('type',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('spec',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('instance',270337,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('unqualifiedType',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('global',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('xmeta',270337,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('xmetaEnum',270337,'xeto::SpecEnum?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachType',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Spec->sys::Void|',false)]),{}).am$('eachInstance',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Dict->sys::Void|',false)]),{}).am$('eachInstanceThatIs',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false),new sys.Param('f','|xeto::Dict,xeto::Spec->sys::Void|',false)]),{'sys::NoDoc':""}).am$('specOf',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('fits',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('cx','xeto::XetoContext',false),new sys.Param('val','sys::Obj?',false),new sys.Param('spec','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('specFits',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','xeto::Spec',false),new sys.Param('b','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',true)]),{'sys::NoDoc':""}).am$('queryWhile',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','xeto::XetoContext',false),new sys.Param('subject','xeto::Dict',false),new sys.Param('query','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',false),new sys.Param('f','|xeto::Dict->sys::Obj?|',false)]),{'sys::NoDoc':""}).am$('instantiate',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('choice',270337,'xeto::SpecChoice',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('interfaceMethod',270337,'sys::Method?',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('methodName','sys::Str',false)]),{'sys::NoDoc':""}).am$('interfaceMethodOn',270337,'sys::Method?',sys.List.make(sys.Param.type$,[new sys.Param('target','sys::Obj',false),new sys.Param('methodName','sys::Str',false)]),{'sys::NoDoc':""}).am$('compileLib',270337,'xeto::Lib',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('compileData',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('compileDicts',270337,'xeto::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('writeData',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('val','sys::Obj',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('print',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('out','sys::OutStream',true),new sys.Param('opts','xeto::Dict?',true)]),{'sys::NoDoc':""}).am$('dump',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
LibStatus.type$.af$('notLoaded',106506,'xeto::LibStatus',{}).af$('ok',106506,'xeto::LibStatus',{}).af$('err',106506,'xeto::LibStatus',{}).af$('vals',106498,'xeto::LibStatus[]',{}).am$('isOk',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isErr',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isNotLoaded',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isLoaded',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'xeto::LibStatus?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
Spec.type$.am$('lib',270337,'xeto::Lib',xp,{}).am$('_id',271361,'xeto::Ref',xp,{}).am$('parent',270337,'xeto::Spec?',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('qname',270337,'sys::Str',xp,{}).am$('type',270337,'xeto::Spec',xp,{}).am$('base',270337,'xeto::Spec?',xp,{}).am$('meta',270337,'xeto::Dict',xp,{}).am$('metaOwn',270337,'xeto::Dict',xp,{}).am$('slotsOwn',270337,'xeto::SpecSlots',xp,{}).am$('slots',270337,'xeto::SpecSlots',xp,{}).am$('slot',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('slotOwn',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isa',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','xeto::Spec',false)]),{}).am$('isMaybe',270337,'sys::Bool',xp,{}).am$('isEnum',270337,'sys::Bool',xp,{}).am$('enum',270337,'xeto::SpecEnum',xp,{}).am$('isChoice',270337,'sys::Bool',xp,{}).am$('flavor',270337,'xeto::SpecFlavor',xp,{'sys::NoDoc':""}).am$('isType',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isGlobal',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isMeta',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isSlot',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('loc',270337,'util::FileLoc',xp,{'sys::NoDoc':""}).am$('binding',270337,'xeto::SpecBinding',xp,{'sys::NoDoc':""}).am$('fantomType',270337,'sys::Type',xp,{'sys::NoDoc':""}).am$('isNone',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isSelf',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('of',270337,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('ofs',270337,'xeto::Spec[]?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('isScalar',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isMarker',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isRef',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isMultiRef',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isDict',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isList',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isQuery',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isFunc',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isInterface',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isComp',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isAnd',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isOr',270337,'sys::Bool',xp,{'sys::NoDoc':""}).am$('isCompound',270337,'sys::Bool',xp,{'sys::NoDoc':""});
NameDict.type$.am$('empty',40962,'xeto::NameDict',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('fixedSize',8192,'sys::Int',xp,{'sys::NoDoc':""}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('_id',271360,'xeto::Ref',xp,{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('map',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj|',false)]),{}).am$('getByCode',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false)]),{'sys::NoDoc':""}).am$('nameAt',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{'sys::NoDoc':""}).am$('valAt',8192,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('index','sys::Int',false)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{});
NameDictReader.type$.am$('readName',270337,'sys::Int',xp,{}).am$('readVal',270337,'sys::Obj?',xp,{});
NameTable.type$.am$('isSparse',8192,'sys::Bool',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('initSize',40962,'sys::Int',xp,{}).am$('maxCode',8192,'sys::Int',xp,{}).am$('toCode',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('toName',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false)]),{}).am$('add',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('set',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Int',false),new sys.Param('name','sys::Str',false)]),{}).am$('dump',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('dict1',8192,'xeto::NameDict',sys.List.make(sys.Param.type$,[new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj',false),new sys.Param('spec','xeto::Spec?',true)]),{}).am$('dict2',8192,'xeto::NameDict',sys.List.make(sys.Param.type$,[new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj',false),new sys.Param('n1','sys::Str',false),new sys.Param('v1','sys::Obj',false),new sys.Param('spec','xeto::Spec?',true)]),{}).am$('dict3',8192,'xeto::NameDict',sys.List.make(sys.Param.type$,[new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj',false),new sys.Param('n1','sys::Str',false),new sys.Param('v1','sys::Obj',false),new sys.Param('n2','sys::Str',false),new sys.Param('v2','sys::Obj',false)]),{}).am$('dict4',8192,'xeto::NameDict',sys.List.make(sys.Param.type$,[new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj',false),new sys.Param('n1','sys::Str',false),new sys.Param('v1','sys::Obj',false),new sys.Param('n2','sys::Str',false),new sys.Param('v2','sys::Obj',false),new sys.Param('n3','sys::Str',false),new sys.Param('v3','sys::Obj',false)]),{}).am$('dict5',8192,'xeto::NameDict',sys.List.make(sys.Param.type$,[new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj',false),new sys.Param('n1','sys::Str',false),new sys.Param('v1','sys::Obj',false),new sys.Param('n2','sys::Str',false),new sys.Param('v2','sys::Obj',false),new sys.Param('n3','sys::Str',false),new sys.Param('v3','sys::Obj',false),new sys.Param('n4','sys::Str',false),new sys.Param('v4','sys::Obj',false)]),{}).am$('dict6',8192,'xeto::NameDict',sys.List.make(sys.Param.type$,[new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj',false),new sys.Param('n1','sys::Str',false),new sys.Param('v1','sys::Obj',false),new sys.Param('n2','sys::Str',false),new sys.Param('v2','sys::Obj',false),new sys.Param('n3','sys::Str',false),new sys.Param('v3','sys::Obj',false),new sys.Param('n4','sys::Str',false),new sys.Param('v4','sys::Obj',false),new sys.Param('n5','sys::Str',false),new sys.Param('v5','sys::Obj',false)]),{}).am$('dict7',8192,'xeto::NameDict',sys.List.make(sys.Param.type$,[new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj',false),new sys.Param('n1','sys::Str',false),new sys.Param('v1','sys::Obj',false),new sys.Param('n2','sys::Str',false),new sys.Param('v2','sys::Obj',false),new sys.Param('n3','sys::Str',false),new sys.Param('v3','sys::Obj',false),new sys.Param('n4','sys::Str',false),new sys.Param('v4','sys::Obj',false),new sys.Param('n5','sys::Str',false),new sys.Param('v5','sys::Obj',false),new sys.Param('n6','sys::Str',false),new sys.Param('v6','sys::Obj',false)]),{}).am$('dict8',8192,'xeto::NameDict',sys.List.make(sys.Param.type$,[new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj',false),new sys.Param('n1','sys::Str',false),new sys.Param('v1','sys::Obj',false),new sys.Param('n2','sys::Str',false),new sys.Param('v2','sys::Obj',false),new sys.Param('n3','sys::Str',false),new sys.Param('v3','sys::Obj',false),new sys.Param('n4','sys::Str',false),new sys.Param('v4','sys::Obj',false),new sys.Param('n5','sys::Str',false),new sys.Param('v5','sys::Obj',false),new sys.Param('n6','sys::Str',false),new sys.Param('v6','sys::Obj',false),new sys.Param('n7','sys::Str',false),new sys.Param('v7','sys::Obj',false)]),{}).am$('dictMap',8192,'xeto::NameDict',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:sys::Obj]',false)]),{}).am$('dictDict',8192,'xeto::NameDict',sys.List.make(sys.Param.type$,[new sys.Param('dictl','xeto::Dict',false)]),{}).am$('readDict',8192,'xeto::NameDict',sys.List.make(sys.Param.type$,[new sys.Param('size','sys::Int',false),new sys.Param('r','xeto::NameDictReader',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "xeto");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;util 1.0");
m.set("pod.summary", "Xeto data and spec APIs");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:24-05:00 New_York");
m.set("build.tsKey", "241210143124");
m.set("build.compiler", "1.0.81");
m.set("build.platform", "macosx-aarch64");
m.set("pod.docSrc", "false");
m.set("hx.docFantom", "true");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "SkyFoundry");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Haxall");
m.set("proj.uri", "https://haxall.io/");
m.set("pod.docApi", "true");
m.set("org.uri", "https://skyfoundry.com/");
m.set("pod.native.java", "true");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "true");
p.__meta(m);



// cjs exports begin
export {
  Comp,
  CompObj,
  CompContext,
  AbstractCompSpace,
  CompSpi,
  Dict,
  CompLayout,
  XetoEnv,
  Lib,
  LibFiles,
  LibRepo,
  LibDepend,
  LibDependVersions,
  Scalar,
  SpecSlots,
  Ref,
  XetoContext,
  NilXetoContext,
  UnitQuantity,
  Link,
  Links,
  SpecFlavor,
  SpecChoice,
  SpecBinding,
  SpecEnum,
  LibVersion,
  Function,
  MethodFunction,
  SyncFunction,
  AsyncFunction,
  XetoLogRec,
  MXetoLogRec,
  LibNamespace,
  LibStatus,
  Spec,
  NameDict,
  NameDictReader,
  NameTable,
};
