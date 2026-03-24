// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as inet from './inet.js'
import * as math from './math.js'
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
import * as hxMath from './hxMath.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class PyMgr extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#sessions = concurrent.ConcurrentMap.make();
    this.#running = concurrent.AtomicBool.make(true);
    return;
  }

  typeof() { return PyMgr.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #sessions = null;

  // private field reflection only
  __sessions(it) { if (it === undefined) return this.#sessions; else this.#sessions = it; }

  #running = null;

  // private field reflection only
  __running(it) { if (it === undefined) return this.#running; else this.#running = it; }

  static #timeout = undefined;

  static timeout() {
    if (PyMgr.#timeout === undefined) {
      PyMgr.static$init();
      if (PyMgr.#timeout === undefined) PyMgr.#timeout = null;
    }
    return PyMgr.#timeout;
  }

  static make(lib,f) {
    const $self = new PyMgr();
    PyMgr.make$($self,lib,f);
    return $self;
  }

  static make$($self,lib,f) {
    if (f === undefined) f = null;
    concurrent.Actor.make$($self, lib.rt().libs().actorPool());
    ;
    ((this$) => { let $_u0 = f; if ($_u0 == null) return null; return sys.Func.call(f, this$); })($self);
    $self.#lib = lib;
    return;
  }

  log() {
    return this.#lib.log();
  }

  lookup(id) {
    return sys.ObjUtil.coerce(((this$) => { let $_u1 = sys.ObjUtil.coerce(this$.#sessions.get(id), sys.Unsafe.type$.toNullable()); if ($_u1 == null) return null; return sys.ObjUtil.coerce(this$.#sessions.get(id), sys.Unsafe.type$.toNullable()).val(); })(this), PyDockerSession.type$.toNullable());
  }

  openSession(opts) {
    if (opts === undefined) opts = null;
    return sys.ObjUtil.coerce(((this$) => { let $_u2 = this$.taskSession(opts); if ($_u2 != null) return $_u2; return this$.createSession(opts); })(this), PySession.type$);
  }

  shutdown(timeout) {
    if (timeout === undefined) timeout = PyMgr.timeout();
    this.send(hx.HxMsg.make0("shutdown")).get(timeout);
    return;
  }

  taskSession(opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    try {
      let tasks = sys.ObjUtil.coerce(this.#lib.rt().services().get(hx.HxTaskService.type$), hx.HxTaskService.type$.toNullable());
      return sys.ObjUtil.coerce(tasks.adjunct(() => {
        return this$.createSession(opts);
      }), PyMgrSession.type$.toNullable());
    }
    catch ($_u3) {
      $_u3 = sys.Err.make($_u3);
      if ($_u3 instanceof sys.Err) {
        let err = $_u3;
        ;
        return null;
      }
      else {
        throw $_u3;
      }
    }
    ;
  }

  createSession(opts) {
    return sys.ObjUtil.coerce(this.send(hx.HxMsg.make1("open", PyMgrSession.make(this, sys.ObjUtil.coerce(((this$) => { let $_u4 = opts; if ($_u4 != null) return $_u4; return haystack.Etc.emptyDict(); })(this), haystack.Dict.type$)).open())).get(PyMgr.timeout()), PyMgrSession.type$);
  }

  receive(obj) {
    let msg = sys.ObjUtil.coerce(obj, hx.HxMsg.type$);
    let $_u5 = msg.id();
    if (sys.ObjUtil.equals($_u5, "open")) {
      return this.onOpen(sys.ObjUtil.coerce(msg.a(), PyMgrSession.type$));
    }
    else if (sys.ObjUtil.equals($_u5, "shutdown")) {
      return this.onShutdown();
    }
    ;
    throw sys.UnsupportedErr.make(sys.Str.plus("", msg));
  }

  onOpen(session) {
    if (!this.#running.val()) {
      throw sys.Err.make("Not running");
    }
    ;
    this.#sessions.add(session.id(), session);
    return session;
  }

  removeSession(session) {
    this.#sessions.remove(session.id());
    return;
  }

  onShutdown() {
    const this$ = this;
    this.#running.val(false);
    this.#sessions.each(sys.ObjUtil.coerce((session,id) => {
      this$.log().info(sys.Str.plus("Killing python session: ", id));
      session.onKill();
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    return null;
  }

  static static$init() {
    PyMgr.#timeout = sys.Duration.fromStr("10sec");
    return;
  }

}

class PySession {
  constructor() {
    const this$ = this;
  }

  typeof() { return PySession.type$; }

  close() {
    return this;
  }

  kill() {
    return this;
  }

}

class PyMgrSession extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#sessionRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return PyMgrSession.type$; }

  kill() { return PySession.prototype.kill.apply(this, arguments); }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #mgr = null;

  mgr() { return this.#mgr; }

  __mgr(it) { if (it === undefined) return this.#mgr; else this.#mgr = it; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #sessionRef = null;

  // private field reflection only
  __sessionRef(it) { if (it === undefined) return this.#sessionRef; else this.#sessionRef = it; }

  static make(mgr,opts) {
    const $self = new PyMgrSession();
    PyMgrSession.make$($self,mgr,opts);
    return $self;
  }

  static make$($self,mgr,opts) {
    ;
    $self.#id = sys.ObjUtil.coerce(sys.Uuid.make(), sys.Uuid.type$);
    $self.#mgr = mgr;
    $self.#opts = opts;
    return;
  }

  session() {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.#sessionRef.val(), sys.Unsafe.type$).val(), PySession.type$);
  }

  log() {
    return this.#mgr.lib().log();
  }

  isClosed() {
    return this.#sessionRef.val() == null;
  }

  open() {
    if (!this.isClosed()) {
      throw sys.Err.make("Already open");
    }
    ;
    let docker = this.#mgr.lib().rt().services().get(hx.HxDockerService.type$);
    let s = PyDockerSession.make(sys.ObjUtil.coerce(docker, hx.HxDockerService.type$), this.#opts);
    this.#sessionRef.val(sys.Unsafe.make(s));
    return this;
  }

  init(fn) {
    this.session().init(fn);
    return this;
  }

  define(name,val) {
    this.session().define(name, val);
    return this;
  }

  exec(code) {
    this.session().exec(code);
    return this;
  }

  timeout(dur) {
    this.session().timeout(dur);
    return this;
  }

  eval(code) {
    try {
      return this.session().eval(code);
    }
    catch ($_u6) {
      $_u6 = sys.Err.make($_u6);
      if ($_u6 instanceof sys.TimeoutErr) {
        let err = $_u6;
        ;
        this.close();
        if (this.inTask()) {
          this.restart();
        }
        ;
        throw err;
      }
      else if ($_u6 instanceof sys.Err) {
        let err = $_u6;
        ;
        if (this.inTask()) {
          this.restart();
        }
        ;
        throw err;
      }
      else {
        throw $_u6;
      }
    }
    ;
  }

  close() {
    if (!this.inTask()) {
      this.onKill();
    }
    ;
    return this;
  }

  restart() {
    if (!this.inTask()) {
      return;
    }
    ;
    try {
      this.onClose();
      this.open();
    }
    catch ($_u7) {
      $_u7 = sys.Err.make($_u7);
      if ($_u7 instanceof sys.Err) {
        let err = $_u7;
        ;
        this.onRemoveSession();
        this.log().err("Could not restart persistent session. Killing it.", err);
        throw err;
      }
      else {
        throw $_u7;
      }
    }
    ;
    return;
  }

  onClose() {
    if (this.isClosed()) {
      return;
    }
    ;
    try {
      this.session().close();
    }
    catch ($_u8) {
      $_u8 = sys.Err.make($_u8);
      if ($_u8 instanceof sys.Err) {
        let err = $_u8;
        ;
        this.log().err("Failed to close session", err);
      }
      else {
        throw $_u8;
      }
    }
    ;
    this.#sessionRef.val(null);
    return;
  }

  onRemoveSession() {
    this.#mgr.removeSession(this);
    return;
  }

  onKill() {
    this.session().kill();
    this.onClose();
    this.onRemoveSession();
    return;
  }

  inTask() {
    return this.#mgr.taskSession() != null;
  }

}

class PyDockerSession extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#isInitialized = false;
    this.#container = null;
    return;
  }

  typeof() { return PyDockerSession.type$; }

  kill() { return PySession.prototype.kill.apply(this, arguments); }

  #dockerService = null;

  // private field reflection only
  __dockerService(it) { if (it === undefined) return this.#dockerService; else this.#dockerService = it; }

  #opts = null;

  // private field reflection only
  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #session = null;

  // private field reflection only
  __session(it) { if (it === undefined) return this.#session; else this.#session = it; }

  #isInitialized = false;

  // private field reflection only
  __isInitialized(it) { if (it === undefined) return this.#isInitialized; else this.#isInitialized = it; }

  #container = null;

  container(it) {
    if (it === undefined) {
      return this.#container;
    }
    else {
      this.#container = it;
      return;
    }
  }

  static make(dockerService,opts) {
    const $self = new PyDockerSession();
    PyDockerSession.make$($self,dockerService,opts);
    return $self;
  }

  static make$($self,dockerService,opts) {
    ;
    $self.#dockerService = dockerService;
    $self.#opts = opts;
    $self.#session = HxpySession.make();
    let t = sys.ObjUtil.as(opts.get("timeout"), haystack.Number.type$);
    if (t != null) {
      $self.#session.timeout(t.toDuration());
    }
    ;
    return;
  }

  openSession() {
    const this$ = this;
    if (this.#session.isConnected()) {
      return this.#session;
    }
    ;
    let key = sys.Uuid.make();
    let level = sys.Str.upper(sys.ObjUtil.coerce(this.#opts.get("logLevel", "WARN"), sys.Str.type$));
    let net = this.#opts.get("network");
    let port = ((this$) => { let $_u9 = ((this$) => { let $_u10 = sys.ObjUtil.as(this$.#opts.get("port"), haystack.Number.type$); if ($_u10 == null) return null; return sys.ObjUtil.as(this$.#opts.get("port"), haystack.Number.type$).toInt(); })(this$); if ($_u9 != null) return $_u9; return sys.ObjUtil.coerce(PyDockerSession.findOpenPort(), sys.Int.type$.toNullable()); })(this);
    let hostConfig = sys.Map.__fromLiteral(["portBindings","networkMode"], [sys.Map.__fromLiteral([sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable())), "/tcp")], [sys.List.make(sys.Type.find("[sys::Str:sys::Str]"), [sys.Map.__fromLiteral(["hostPort"], [sys.Str.plus("", sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))])], sys.Type.find("sys::Str"), sys.Type.find("[sys::Str:sys::Str][]")),net], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    let config = sys.Map.__fromLiteral(["cmd","exposedPorts","hostConfig"], [sys.List.make(sys.Str.type$, ["-m", "hxpy", "--key", sys.Str.plus("", key), "--port", sys.Str.plus("", sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable())), "--level", level]),sys.Map.__fromLiteral([sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable())), "/tcp")], [sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?"))], sys.Type.find("sys::Str"), sys.Type.find("[sys::Obj:sys::Obj?]")),hostConfig], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    let errs = sys.List.make(sys.Err.type$);
    this.#container = sys.ObjUtil.coerce(PyDockerSession.priorityImageNames(this.#opts).eachWhile((image) => {
      try {
        return this$.#dockerService.run(image, config);
      }
      catch ($_u11) {
        $_u11 = sys.Err.make($_u11);
        if ($_u11 instanceof sys.Err) {
          let err = $_u11;
          ;
          errs.add(err);
          return null;
        }
        else {
          throw $_u11;
        }
      }
      ;
    }), hx.HxDockerContainer.type$.toNullable());
    if (this.#container == null) {
      errs.each((it) => {
        it.trace();
        return;
      });
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("Could not run any of these docker images: ", PyDockerSession.priorityImageNames(this.#opts)), ".\nSee the stack trace above for reasons."));
    }
    ;
    let host = "localhost";
    if (net != null) {
      (host = this.#container.network(sys.ObjUtil.coerce(net, sys.Str.type$)).ip().toStr());
    }
    ;
    let retry = ((this$) => { let $_u12 = ((this$) => { let $_u13 = sys.ObjUtil.as(this$.#opts.get("maxRetry"), haystack.Number.type$); if ($_u13 == null) return null; return sys.ObjUtil.as(this$.#opts.get("maxRetry"), haystack.Number.type$).toInt(); })(this$); if ($_u12 != null) return $_u12; return sys.ObjUtil.coerce(5, sys.Int.type$.toNullable()); })(this);
    let uri = sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("tcp://", host), ":"), sys.ObjUtil.coerce(port, sys.Obj.type$.toNullable())), "?key="), key));
    while (true) {
      try {
        this.#session.connect(uri);
        break;
      }
      catch ($_u14) {
        $_u14 = sys.Err.make($_u14);
        if ($_u14 instanceof sys.Err) {
          let err = $_u14;
          ;
          if (sys.ObjUtil.compareLT(retry = sys.Int.decrement(sys.ObjUtil.coerce(retry, sys.Int.type$)), 0)) {
            this.close();
            throw sys.IOErr.make(sys.Str.plus("Failed to connect to ", uri), err);
          }
          ;
        }
        else {
          throw $_u14;
        }
      }
      ;
      concurrent.Actor.sleep(sys.Duration.fromStr("1sec"));
    }
    ;
    return this.#session;
  }

  static priorityImageNames(opts) {
    let x = sys.ObjUtil.as(opts.get("image"), sys.Str.type$);
    if (x != null) {
      return sys.List.make(sys.Str.type$.toNullable(), [x]);
    }
    ;
    let ver = PyMgr.type$.pod().version();
    return sys.List.make(sys.Str.type$, [sys.Str.plus("ghcr.io/haxall/hxpy:", ver), "ghcr.io/haxall/hxpy:latest", "ghcr.io/haxall/hxpy:main"]);
  }

  static findOpenPort(range) {
    if (range === undefined) range = sys.Range.makeInclusive(10000, 30000);
    let attempts = 100;
    let i = 1;
    let r = util.Random.makeSecure();
    let port = r.next(range);
    while (sys.ObjUtil.compareLE(i, attempts)) {
      let s = inet.TcpSocket.make();
      try {
        s.bind(inet.IpAddr.make("localhost"), sys.ObjUtil.coerce(port, sys.Int.type$.toNullable()));
        return port;
      }
      catch ($_u15) {
        $_u15 = sys.Err.make($_u15);
        if ($_u15 instanceof sys.Err) {
          let ignore = $_u15;
          ;
        }
        else {
          throw $_u15;
        }
      }
      finally {
        s.close();
      }
      ;
      i = sys.Int.increment(i);
    }
    ;
    throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot find free port in ", range), " after "), sys.ObjUtil.coerce(attempts, sys.Obj.type$.toNullable())), " attempts"));
  }

  init(fn) {
    const this$ = this;
    if (!this.#isInitialized) {
      this.#session.init((it) => {
        sys.Func.call(fn, this$);
        this$.#isInitialized = true;
        return;
      });
    }
    ;
    return this;
  }

  define(name,val) {
    this.#session.define(name, val);
    return this;
  }

  exec(code) {
    this.#session.exec(code);
    return this;
  }

  timeout(dur) {
    this.#session.timeout(dur);
    return this;
  }

  eval(code) {
    try {
      return this.openSession().eval(code);
    }
    catch ($_u16) {
      $_u16 = sys.Err.make($_u16);
      if ($_u16 instanceof sys.TimeoutErr) {
        let err = $_u16;
        ;
        this.close();
        throw err;
      }
      else {
        throw $_u16;
      }
    }
    ;
  }

  close() {
    try {
      if (this.#container != null) {
        this.#dockerService.deleteContainer(this.#container.id());
        this.#container = null;
      }
      ;
    }
    catch ($_u17) {
      $_u17 = sys.Err.make($_u17);
      if ($_u17 instanceof sys.Err) {
        let ignore = $_u17;
        ;
      }
      else {
        throw $_u17;
      }
    }
    ;
    this.#session.close();
    return this;
  }

}

class PyFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PyFuncs.type$; }

  static lib() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx().rt().lib("py"), PyLib.type$);
  }

  static py(opts) {
    if (opts === undefined) opts = null;
    return PyFuncs.lib().openSession(opts);
  }

  static pyTimeout(py,val) {
    return py.timeout(((this$) => { let $_u18 = val; if ($_u18 == null) return null; return val.toDuration(); })(this));
  }

  static pyInit(py,fn) {
    return py.init(sys.ObjUtil.coerce(fn.toFunc(), sys.Type.find("|hxPy::PySession->sys::Void|")));
  }

  static pyDefine(py,name,val) {
    return py.define(name, val);
  }

  static pyExec(py,code) {
    return py.exec(code);
  }

  static pyEval(py,stmt) {
    try {
      return py.eval(stmt);
    }
    finally {
      try {
        py.close();
      }
      catch ($_u19) {
        $_u19 = sys.Err.make($_u19);
        if ($_u19 instanceof sys.Err) {
          let ignore = $_u19;
          ;
          PyFuncs.lib().log().debug("Failed to close python session", ignore);
        }
        else {
          throw $_u19;
        }
      }
      ;
    }
    ;
  }

  static make() {
    const $self = new PyFuncs();
    PyFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Instr extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Instr.type$; }

  static make() {
    const $self = new Instr();
    Instr.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class DefineInstr extends Instr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DefineInstr.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(name,val) {
    const $self = new DefineInstr();
    DefineInstr.make$($self,name,val);
    return $self;
  }

  static make$($self,name,val) {
    Instr.make$($self);
    $self.#name = name;
    $self.#val = ((this$) => { let $_u20 = DefineInstr.toVal(val); if ($_u20 == null) return null; return sys.ObjUtil.toImmutable(DefineInstr.toVal(val)); })($self);
    return;
  }

  encode() {
    return haystack.Etc.makeDict2("def", this.#name, "v", DefineInstr.toVal(this.#val));
  }

  static toVal(val) {
    return ((this$) => { if (sys.ObjUtil.is(val, hxMath.MatrixGrid.type$)) return NDArray.encode(sys.ObjUtil.coerce(val, hxMath.MatrixGrid.type$)); return val; })(this);
  }

}

class ExecInstr extends Instr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExecInstr.type$; }

  #code = null;

  code() { return this.#code; }

  __code(it) { if (it === undefined) return this.#code; else this.#code = it; }

  static make(code) {
    const $self = new ExecInstr();
    ExecInstr.make$($self,code);
    return $self;
  }

  static make$($self,code) {
    Instr.make$($self);
    $self.#code = code;
    return;
  }

  encode() {
    return haystack.Etc.makeDict1("exec", this.#code);
  }

}

class EvalInstr extends Instr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EvalInstr.type$; }

  #expr = null;

  expr() { return this.#expr; }

  __expr(it) { if (it === undefined) return this.#expr; else this.#expr = it; }

  static make(expr) {
    const $self = new EvalInstr();
    EvalInstr.make$($self,expr);
    return $self;
  }

  static make$($self,expr) {
    Instr.make$($self);
    $self.#expr = expr;
    return;
  }

  encode() {
    return haystack.Etc.makeDict1("eval", this.#expr);
  }

}

class NDArray extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NDArray.type$; }

  static encode(g) {
    let rows = g.size();
    let cols = g.cols().size();
    let nd = sys.Map.__fromLiteral(["ndarray","r","c"], [haystack.Marker.val(),haystack.Number.makeInt(rows),haystack.Number.makeInt(cols)], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    let f = null;
    let buf = sys.Buf.make(sys.Int.mult(sys.Int.mult(rows, cols), 8));
    for (let i = 0; sys.ObjUtil.compareLT(i, g.numRows()); i = sys.Int.increment(i)) {
      for (let j = 0; sys.ObjUtil.compareLT(j, g.numCols()); j = sys.Int.increment(j)) {
        buf.writeF8(g.float(i, j));
      }
      ;
    }
    ;
    nd.set("bytes", sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()));
    return haystack.Etc.makeDict(nd);
  }

  static decode(spec) {
    const this$ = this;
    let rows = sys.ObjUtil.coerce(spec.get("r"), haystack.Number.type$).toInt();
    let cols = sys.ObjUtil.coerce(spec.get("c"), haystack.Number.type$).toInt();
    let buf = sys.ObjUtil.coerce(spec.get("bytes"), sys.Buf.type$);
    let in$ = buf.in();
    let matrix = math.MMatrix.make(rows, cols);
    sys.Int.times(rows, (i) => {
      sys.Int.times(cols, (j) => {
        matrix.set(i, j, in$.readF8());
        return;
      });
      return;
    });
    return sys.ObjUtil.coerce(sys.Type.find("hxMath::MatrixGrid").method("makeMatrix").call(haystack.Etc.emptyDict(), matrix), hxMath.MatrixGrid.type$);
  }

  static make() {
    const $self = new NDArray();
    NDArray.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HxpySession extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#socketConfig = inet.SocketConfig.cur().copy((it) => {
      it.__receiveTimeout(null);
      return;
    });
    this.#log = sys.Log.get("py");
    this.#instrs = sys.List.make(Instr.type$);
    this.#evalTimeout = sys.Duration.fromStr("5min");
    this.#isInitialized = false;
    return;
  }

  typeof() { return HxpySession.type$; }

  #serverUri = null;

  serverUri() {
    return this.#serverUri;
  }

  #socketConfig = null;

  socketConfig() { return this.#socketConfig; }

  __socketConfig(it) { if (it === undefined) return this.#socketConfig; else this.#socketConfig = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #evalPool = null;

  evalPool() { return this.#evalPool; }

  __evalPool(it) { if (it === undefined) return this.#evalPool; else this.#evalPool = it; }

  #instrs = null;

  // private field reflection only
  __instrs(it) { if (it === undefined) return this.#instrs; else this.#instrs = it; }

  #socket = null;

  // private field reflection only
  __socket(it) { if (it === undefined) return this.#socket; else this.#socket = it; }

  #evalTimeout = null;

  // private field reflection only
  __evalTimeout(it) { if (it === undefined) return this.#evalTimeout; else this.#evalTimeout = it; }

  #isInitialized = false;

  isInitialized(it) {
    if (it === undefined) {
      return this.#isInitialized;
    }
    else {
      this.#isInitialized = it;
      return;
    }
  }

  static #maxPacketSize = undefined;

  static maxPacketSize() {
    if (HxpySession.#maxPacketSize === undefined) {
      HxpySession.static$init();
      if (HxpySession.#maxPacketSize === undefined) HxpySession.#maxPacketSize = 0;
    }
    return HxpySession.#maxPacketSize;
  }

  static make(f) {
    const $self = new HxpySession();
    HxpySession.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    if (f === undefined) f = null;
    HxpySession.make_priv$($self, null, f);
    return;
  }

  static open(serverUri,f) {
    const $self = new HxpySession();
    HxpySession.open$($self,serverUri,f);
    return $self;
  }

  static open$($self,serverUri,f) {
    if (f === undefined) f = null;
    HxpySession.make_priv$($self, serverUri, f);
    return;
  }

  static make_priv(serverUri,f) {
    const $self = new HxpySession();
    HxpySession.make_priv$($self,serverUri,f);
    return $self;
  }

  static make_priv$($self,serverUri,f) {
    if (f === undefined) f = null;
    const this$ = $self;
    ;
    ((this$) => { let $_u22 = f; if ($_u22 == null) return null; return sys.Func.call(f, this$); })($self);
    if ($self.#evalPool == null) {
      $self.#evalPool = concurrent.ActorPool.make((it) => {
        it.__name("DefHxpySessionEvalPool");
        return;
      });
    }
    ;
    if (serverUri != null) {
      $self.connect(sys.ObjUtil.coerce(serverUri, sys.Uri.type$));
    }
    ;
    return;
  }

  connect(serverUri) {
    if (this.isConnected()) {
      throw sys.IOErr.make(sys.Str.plus("Already connected to ", this.#serverUri));
    }
    ;
    if (sys.ObjUtil.compareNE("tcp", serverUri.scheme())) {
      throw sys.ArgErr.make(sys.Str.plus("Invalid scheme: ", serverUri));
    }
    ;
    if (serverUri.query().get("key") == null) {
      throw sys.ArgErr.make(sys.Str.plus("Missing key: ", serverUri));
    }
    ;
    this.#serverUri = serverUri;
    try {
      this.#socket = inet.TcpSocket.make(this.#socketConfig);
      this.#socket.connect(sys.ObjUtil.coerce(inet.IpAddr.make(sys.ObjUtil.coerce(serverUri.host(), sys.Str.type$)), inet.IpAddr.type$), sys.ObjUtil.coerce(((this$) => { let $_u23 = serverUri.port(); if ($_u23 != null) return $_u23; return sys.ObjUtil.coerce(8888, sys.Int.type$.toNullable()); })(this), sys.Int.type$));
      let key = serverUri.query().get("key");
      let auth = haystack.Etc.makeDict(sys.Map.__fromLiteral(["key","ver"], [key,"0"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str?")));
      let resp = sys.ObjUtil.coerce(this.sendBrio(auth), haystack.Dict.type$);
      if (resp.has("err")) {
        throw sys.IOErr.make(sys.Str.plus("Auth failed: ", resp.trap("errMsg", sys.List.make(sys.Obj.type$.toNullable(), []))));
      }
      ;
    }
    catch ($_u24) {
      $_u24 = sys.Err.make($_u24);
      if ($_u24 instanceof sys.Err) {
        let err = $_u24;
        ;
        this.close();
        throw err;
      }
      else {
        throw $_u24;
      }
    }
    ;
    return this;
  }

  isConnected() {
    return (this.#socket != null && !this.#socket.isClosed());
  }

  init(fn) {
    if (!this.#isInitialized) {
      sys.Func.call(fn, this);
      this.#isInitialized = true;
    }
    ;
    return this;
  }

  define(name,val) {
    this.#instrs.add(DefineInstr.make(name, val));
    return this;
  }

  exec(code) {
    this.#instrs.add(ExecInstr.make(code));
    return this;
  }

  timeout(dur) {
    this.#evalTimeout = dur;
    return this;
  }

  eval(expr) {
    this.checkClosed();
    let toEval = this.#instrs.add(EvalInstr.make(expr));
    this.#instrs = sys.List.make(Instr.type$);
    return EvalActor.make(this, this.#evalPool).send(toEval).get(this.#evalTimeout);
  }

  close() {
    ((this$) => { let $_u25 = this$.#socket; if ($_u25 == null) return null; return this$.#socket.close(); })(this);
    this.#socket = null;
    this.#isInitialized = false;
    return this;
  }

  kill() {
    this.close();
    this.#evalPool.kill();
    return this;
  }

  checkClosed() {
    if (!this.isConnected()) {
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this).name()), " is closed"));
    }
    ;
    return;
  }

  sendBrio(obj) {
    const this$ = this;
    let buf = sys.Buf.make();
    let brio = sys.ObjUtil.coerce(sys.ObjUtil.with(haystack.BrioWriter.make(buf.out()), (it) => {
      it.maxStrCode(-1);
      return;
    }), haystack.BrioWriter.type$);
    brio.writeVal(obj).close();
    let val = this.sendFrame(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.flip(), sys.Buf.type$.toNullable()), sys.Buf.type$)).recvVal();
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      let g = sys.ObjUtil.coerce(val, haystack.Grid.type$);
      if (g.meta().has("err")) {
        throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Python failed: ", g.meta().trap("errMsg", sys.List.make(sys.Obj.type$.toNullable(), []))), "\n"), g.meta().trap("errTrace", sys.List.make(sys.Obj.type$.toNullable(), []))));
      }
      ;
    }
    ;
    if ((sys.ObjUtil.is(val, haystack.Dict.type$) && sys.ObjUtil.coerce(val, haystack.Dict.type$).has("ndarray"))) {
      (val = NDArray.decode(sys.ObjUtil.coerce(val, haystack.Dict.type$)));
    }
    ;
    return val;
  }

  sendFrame(buf) {
    if (sys.ObjUtil.compareGT(buf.size(), HxpySession.maxPacketSize())) {
      throw sys.ArgErr.make(sys.Str.plus("Packet too big: ", sys.ObjUtil.coerce(buf.size(), sys.Obj.type$.toNullable())));
    }
    ;
    this.#socket.out().writeI4(buf.size()).writeBuf(buf).flush();
    return this;
  }

  recvVal() {
    try {
      return haystack.BrioReader.make(this.#socket.in()).readVal();
    }
    catch ($_u26) {
      $_u26 = sys.Err.make($_u26);
      if ($_u26 instanceof sys.IOErr) {
        let err = $_u26;
        ;
        throw sys.IOErr.make("Unable to read from hxpy server. It is probably not running anymore", err);
      }
      else {
        throw $_u26;
      }
    }
    ;
  }

  static static$init() {
    HxpySession.#maxPacketSize = 2147483647;
    return;
  }

}

class EvalActor extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EvalActor.type$; }

  #sessionRef = null;

  // private field reflection only
  __sessionRef(it) { if (it === undefined) return this.#sessionRef; else this.#sessionRef = it; }

  static make(session,pool) {
    const $self = new EvalActor();
    EvalActor.make$($self,session,pool);
    return $self;
  }

  static make$($self,session,pool) {
    concurrent.Actor.make$($self, pool);
    $self.#sessionRef = sys.Unsafe.make(session);
    return;
  }

  session() {
    return sys.ObjUtil.coerce(this.#sessionRef.val(), HxpySession.type$);
  }

  receive(obj) {
    const this$ = this;
    let instrs = sys.ObjUtil.coerce(obj, sys.Type.find("hxPy::Instr[]"));
    return this.session().sendBrio(instrs.map((instr) => {
      return instr.encode();
    }, haystack.Dict.type$));
  }

}

class PyLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PyLib.type$; }

  #mgr = null;

  mgr() { return this.#mgr; }

  __mgr(it) { if (it === undefined) return this.#mgr; else this.#mgr = it; }

  static make() {
    const $self = new PyLib();
    PyLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    $self.#mgr = PyMgr.make($self);
    return;
  }

  static cur(checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(hx.HxContext.curHx().rt().lib("py", checked), PyLib.type$.toNullable());
  }

  openSession(opts) {
    if (opts === undefined) opts = null;
    return this.#mgr.openSession(opts);
  }

  onStop() {
    this.#mgr.shutdown();
    return;
  }

}

const p = sys.Pod.add$('hxPy');
const xp = sys.Param.noParams$();
let m;
PyMgr.type$ = p.at$('PyMgr','concurrent::Actor',[],{},130,PyMgr);
PySession.type$ = p.am$('PySession','sys::Obj',[],{},8449,PySession);
PyMgrSession.type$ = p.at$('PyMgrSession','sys::Obj',['hxPy::PySession','hx::HxTaskAdjunct'],{},130,PyMgrSession);
PyDockerSession.type$ = p.at$('PyDockerSession','sys::Obj',['hxPy::PySession'],{},128,PyDockerSession);
PyFuncs.type$ = p.at$('PyFuncs','sys::Obj',[],{},8194,PyFuncs);
Instr.type$ = p.at$('Instr','sys::Obj',[],{},131,Instr);
DefineInstr.type$ = p.at$('DefineInstr','hxPy::Instr',[],{},130,DefineInstr);
ExecInstr.type$ = p.at$('ExecInstr','hxPy::Instr',[],{},130,ExecInstr);
EvalInstr.type$ = p.at$('EvalInstr','hxPy::Instr',[],{},130,EvalInstr);
NDArray.type$ = p.at$('NDArray','sys::Obj',[],{'sys::NoDoc':""},8192,NDArray);
HxpySession.type$ = p.at$('HxpySession','sys::Obj',['hxPy::PySession'],{'sys::NoDoc':""},8192,HxpySession);
EvalActor.type$ = p.at$('EvalActor','concurrent::Actor',[],{},130,EvalActor);
PyLib.type$ = p.at$('PyLib','hx::HxLib',[],{},8194,PyLib);
PyMgr.type$.af$('lib',65666,'hxPy::PyLib',{}).af$('sessions',67586,'concurrent::ConcurrentMap',{}).af$('running',67586,'concurrent::AtomicBool',{}).af$('timeout',100354,'sys::Duration',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxPy::PyLib',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('log',2048,'sys::Log',xp,{}).am$('lookup',2048,'hxPy::PyDockerSession?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false)]),{}).am$('openSession',8192,'hxPy::PySession',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict?',true)]),{}).am$('shutdown',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('taskSession',128,'hxPy::PyMgrSession?',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict?',true)]),{}).am$('createSession',2048,'hxPy::PyMgrSession',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict?',false)]),{}).am$('receive',267264,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('onOpen',2048,'hxPy::PyMgrSession',sys.List.make(sys.Param.type$,[new sys.Param('session','hxPy::PyMgrSession',false)]),{}).am$('removeSession',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('session','hxPy::PyMgrSession',false)]),{}).am$('onShutdown',2048,'sys::Obj?',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
PySession.type$.am$('define',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('init',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('fn','|hxPy::PySession->sys::Void|',false)]),{}).am$('exec',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Str',false)]),{}).am$('timeout',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('dur','sys::Duration?',false)]),{}).am$('eval',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false)]),{}).am$('close',270336,'sys::This',xp,{}).am$('kill',270336,'sys::This',xp,{});
PyMgrSession.type$.af$('id',73730,'sys::Uuid',{}).af$('mgr',73730,'hxPy::PyMgr',{}).af$('opts',73730,'haystack::Dict',{}).af$('sessionRef',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('mgr','hxPy::PyMgr',false),new sys.Param('opts','haystack::Dict',false)]),{}).am$('session',8192,'hxPy::PySession',xp,{}).am$('log',2048,'sys::Log',xp,{}).am$('isClosed',2048,'sys::Bool',xp,{}).am$('open',8192,'sys::This',xp,{}).am$('init',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('fn','|hxPy::PySession->sys::Void|',false)]),{}).am$('define',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('exec',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Str',false)]),{}).am$('timeout',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('dur','sys::Duration?',false)]),{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Str',false)]),{}).am$('close',271360,'sys::This',xp,{}).am$('restart',2048,'sys::Void',xp,{}).am$('onClose',2048,'sys::Void',xp,{}).am$('onRemoveSession',2048,'sys::Void',xp,{}).am$('onKill',271360,'sys::Void',xp,{}).am$('inTask',2048,'sys::Bool',xp,{});
PyDockerSession.type$.af$('dockerService',67586,'hx::HxDockerService',{}).af$('opts',67586,'haystack::Dict',{}).af$('session',67584,'hxPy::HxpySession',{}).af$('isInitialized',67584,'sys::Bool',{}).af$('container',65664,'hx::HxDockerContainer?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dockerService','hx::HxDockerService',false),new sys.Param('opts','haystack::Dict',false)]),{}).am$('openSession',2048,'hxPy::HxpySession',xp,{}).am$('priorityImageNames',34818,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict',false)]),{}).am$('findOpenPort',34818,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('range','sys::Range',true)]),{}).am$('init',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('fn','|hxPy::PySession->sys::Void|',false)]),{}).am$('define',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('exec',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Str',false)]),{}).am$('timeout',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('dur','sys::Duration?',false)]),{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Str',false)]),{}).am$('close',271360,'sys::This',xp,{});
PyFuncs.type$.am$('lib',34818,'hxPy::PyLib',xp,{}).am$('py',40962,'hxPy::PySession',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('pyTimeout',40962,'hxPy::PySession',sys.List.make(sys.Param.type$,[new sys.Param('py','hxPy::PySession',false),new sys.Param('val','haystack::Number?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('pyInit',40962,'hxPy::PySession',sys.List.make(sys.Param.type$,[new sys.Param('py','hxPy::PySession',false),new sys.Param('fn','axon::Fn',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('pyDefine',40962,'hxPy::PySession',sys.List.make(sys.Param.type$,[new sys.Param('py','hxPy::PySession',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('pyExec',40962,'hxPy::PySession',sys.List.make(sys.Param.type$,[new sys.Param('py','hxPy::PySession',false),new sys.Param('code','sys::Str',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('pyEval',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('py','hxPy::PySession',false),new sys.Param('stmt','sys::Str',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('make',139268,'sys::Void',xp,{});
Instr.type$.am$('encode',270337,'haystack::Dict',xp,{}).am$('make',139268,'sys::Void',xp,{});
DefineInstr.type$.af$('name',73730,'sys::Str',{}).af$('val',73730,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('encode',271360,'haystack::Dict',xp,{}).am$('toVal',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{});
ExecInstr.type$.af$('code',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Str',false)]),{}).am$('encode',271360,'haystack::Dict',xp,{});
EvalInstr.type$.af$('expr',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false)]),{}).am$('encode',271360,'haystack::Dict',xp,{});
NDArray.type$.am$('encode',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('g','hxMath::MatrixGrid',false)]),{}).am$('decode',40962,'hxMath::MatrixGrid',sys.List.make(sys.Param.type$,[new sys.Param('spec','haystack::Dict',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxpySession.type$.af$('serverUri',73728,'sys::Uri?',{}).af$('socketConfig',73730,'inet::SocketConfig',{}).af$('log',73730,'sys::Log',{}).af$('evalPool',73730,'concurrent::ActorPool',{}).af$('instrs',67584,'hxPy::Instr[]',{}).af$('socket',67584,'inet::TcpSocket?',{}).af$('evalTimeout',67584,'sys::Duration?',{}).af$('isInitialized',73728,'sys::Bool',{}).af$('maxPacketSize',100354,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('open',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('serverUri','sys::Uri',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('make_priv',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('serverUri','sys::Uri?',false),new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('connect',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('serverUri','sys::Uri',false)]),{}).am$('isConnected',8192,'sys::Bool',xp,{}).am$('init',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('fn','|hxPy::PySession->sys::Void|',false)]),{}).am$('define',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('exec',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('code','sys::Str',false)]),{}).am$('timeout',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('dur','sys::Duration?',false)]),{}).am$('eval',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('expr','sys::Str',false)]),{}).am$('close',271360,'sys::This',xp,{}).am$('kill',271360,'sys::This',xp,{}).am$('checkClosed',2048,'sys::Void',xp,{}).am$('sendBrio',128,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('sendFrame',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('recvVal',2048,'sys::Obj?',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
EvalActor.type$.af$('sessionRef',67586,'sys::Unsafe',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('session','hxPy::HxpySession',false),new sys.Param('pool','concurrent::ActorPool',false)]),{}).am$('session',2048,'hxPy::HxpySession',xp,{}).am$('receive',267264,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{});
PyLib.type$.af$('mgr',65666,'hxPy::PyMgr',{}).am$('make',8196,'sys::Void',xp,{}).am$('cur',40962,'hxPy::PyLib?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('openSession',8192,'hxPy::PySession',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict?',true)]),{'sys::NoDoc':""}).am$('onStop',271360,'sys::Void',xp,{'sys::NoDoc':""});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxPy");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;math 1.0;inet 1.0;util 1.0;haystack 3.1.11;axon 3.1.11;hx 3.1.11;hxMath 3.1.11");
m.set("pod.summary", "Python IPC");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:27-05:00 New_York");
m.set("build.tsKey", "241210143127");
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
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  PySession,
  PyFuncs,
  NDArray,
  HxpySession,
  PyLib,
};
