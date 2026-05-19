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
class UnknownTaskErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownTaskErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownTaskErr();
    UnknownTaskErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class NotTaskContextErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NotTaskContextErr.type$; }

  static make(msg,cause) {
    const $self = new NotTaskContextErr();
    NotTaskContextErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class TaskFaultErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TaskFaultErr.type$; }

  static make(msg,cause) {
    const $self = new TaskFaultErr();
    TaskFaultErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class TaskDisabledErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TaskDisabledErr.type$; }

  static make(msg,cause) {
    const $self = new TaskDisabledErr();
    TaskDisabledErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class TaskEphemeralErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TaskEphemeralErr.type$; }

  static make(msg,cause) {
    const $self = new TaskEphemeralErr();
    TaskEphemeralErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class TaskKilledErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TaskKilledErr.type$; }

  static make(msg,cause) {
    const $self = new TaskKilledErr();
    TaskKilledErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class TaskLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
    this.#userRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return TaskLib.type$; }

  #userRef = null;

  // private field reflection only
  __userRef(it) { if (it === undefined) return this.#userRef; else this.#userRef = it; }

  #pool = null;

  pool() { return this.#pool; }

  __pool(it) { if (it === undefined) return this.#pool; else this.#pool = it; }

  #tasksById = null;

  // private field reflection only
  __tasksById(it) { if (it === undefined) return this.#tasksById; else this.#tasksById = it; }

  #userFallback$Store = undefined;

  // private field reflection only
  __userFallback$Store(it) { if (it === undefined) return this.#userFallback$Store; else this.#userFallback$Store = it; }

  static make() {
    const $self = new TaskLib();
    TaskLib.make$($self);
    return $self;
  }

  static make$($self) {
    const this$ = $self;
    hx.HxLib.make$($self);
    ;
    $self.#pool = concurrent.ActorPool.make((it) => {
      it.__name(sys.Str.plus(sys.Str.plus("", this$.rt().name()), "-Task"));
      it.__maxThreads(this$.rec().maxThreads());
      return;
    });
    $self.#tasksById = concurrent.ConcurrentMap.make();
    return;
  }

  services() {
    return sys.List.make(TaskLib.type$, [this]);
  }

  rec() {
    return sys.ObjUtil.coerce(hx.HxLib.prototype.rec.call(this), TaskSettings.type$);
  }

  task(id,checked) {
    if (checked === undefined) checked = true;
    let task = this.#tasksById.get(id);
    if (task != null) {
      return sys.ObjUtil.coerce(task, Task.type$.toNullable());
    }
    ;
    if (checked) {
      throw UnknownTaskErr.make(sys.Str.plus("Task not found: ", id.toCode()));
    }
    ;
    return null;
  }

  tasks() {
    return sys.ObjUtil.coerce(this.#tasksById.vals(Task.type$), sys.Type.find("hxTask::Task[]"));
  }

  cur(checked) {
    if (checked === undefined) checked = true;
    let t = Task.cur();
    if (t != null) {
      return t;
    }
    ;
    if (checked) {
      throw NotTaskContextErr.make("Not running in task context");
    }
    ;
    return null;
  }

  run(expr,msg) {
    if (msg === undefined) msg = null;
    return this.spawnEphemeral(expr).send(msg);
  }

  progress(progress) {
    ((this$) => { let $_u0 = Task.cur(); if ($_u0 == null) return null; return Task.cur().progressUpdate(progress); })(this);
    return;
  }

  adjunct(onInit) {
    let task = ((this$) => { let $_u1 = Task.cur(); if ($_u1 != null) return $_u1; throw NotTaskContextErr.make("Not running in task context"); })(this);
    return task.adjunct(onInit);
  }

  onStart() {
    this.refreshUser();
    this.observe("obsCommits", haystack.Etc.makeDict(sys.Map.__fromLiteral(["obsAdds","obsUpdates","obsRemoves","obsAddOnInit","syncable","obsFilter"], [haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),haystack.Marker.val(),"task"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"))), TaskLib.type$.slot("onTaskEvent"));
    return;
  }

  onSteadyState() {
    const this$ = this;
    this.tasks().each((task) => {
      task.subscribe();
      return;
    });
    return;
  }

  onStop() {
    const this$ = this;
    this.tasks().each((t) => {
      this$.kill(t);
      return;
    });
    this.#pool.kill();
    return;
  }

  onTaskEvent(e) {
    if ((e.isUpdated() || e.isRemoved())) {
      let oldTask = this.task(e.id(), false);
      if (oldTask != null) {
        this.kill(sys.ObjUtil.coerce(oldTask, Task.type$));
      }
      ;
    }
    ;
    if ((e.isAdded() || e.isUpdated())) {
      let newTask = Task.makeRec(this, e.newRec());
      this.spawn(sys.ObjUtil.coerce(newTask, Task.type$));
    }
    ;
    return;
  }

  restart(task) {
    if (!task.type().isRec()) {
      throw sys.Err.make(sys.Str.plus("Cannot restart non-rec task: ", task));
    }
    ;
    this.kill(task);
    return this.spawn(sys.ObjUtil.coerce(Task.makeRec(this, task.rec()), Task.type$));
  }

  spawn(task) {
    this.#tasksById.add(task.id(), task);
    if (this.rt().isSteadyState()) {
      task.subscribe();
    }
    ;
    return task;
  }

  spawnEphemeral(expr) {
    let task = Task.makeEphemeral(this, expr);
    this.#tasksById.add(task.id(), task);
    return task;
  }

  kill(task) {
    task.kill();
    task.unsubscribe();
    task.adjunctOnKill();
    this.#tasksById.remove(task.id());
    return;
  }

  user() {
    return sys.ObjUtil.coerce(this.#userRef.val(), hx.HxUser.type$);
  }

  houseKeepingFreq() {
    return sys.Duration.fromStr("17sec");
  }

  onHouseKeeping() {
    this.refreshUser();
    this.cleanupEphemerals();
    return;
  }

  refreshUser() {
    let user = this.rt().user().read(sys.Str.plus("task-", this.rt().name()), false);
    if (user == null) {
      (user = this.rt().user().read("task", false));
    }
    ;
    if (user == null) {
      (user = this.userFallback());
    }
    ;
    if (user.isSu()) {
      this.log().err("Task user must not be su");
      (user = this.userFallback());
    }
    ;
    this.#userRef.val(user);
    return;
  }

  userFallback() {
    if (this.#userFallback$Store === undefined) {
      this.#userFallback$Store = this.userFallback$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#userFallback$Store, hx.HxUser.type$);
  }

  cleanupEphemerals() {
    const this$ = this;
    let now = sys.Duration.nowTicks();
    let linger = this.rec().ephemeralLinger().ticks();
    this.tasks().each((task) => {
      if ((task.isEphemeralDone() && sys.ObjUtil.compareGT(sys.Int.minus(now, task.evalLastTime()), linger))) {
        this$.kill(task);
      }
      ;
      return;
    });
    return;
  }

  userFallback$Once() {
    return this.rt().user().makeSyntheticUser("task", sys.Map.__fromLiteral(["projAccessFilter"], [sys.Str.plus("name==", sys.Str.toCode(this.rt().name()))], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

}

class TaskSettings extends haystack.TypedDict {
  constructor() {
    super();
    const this$ = this;
    this.#maxThreads = 50;
    this.#ephemeralLinger = sys.Duration.fromStr("10min");
    return;
  }

  typeof() { return TaskSettings.type$; }

  #maxThreads = 0;

  maxThreads() { return this.#maxThreads; }

  __maxThreads(it) { if (it === undefined) return this.#maxThreads; else this.#maxThreads = it; }

  #ephemeralLinger = null;

  ephemeralLinger() { return this.#ephemeralLinger; }

  __ephemeralLinger(it) { if (it === undefined) return this.#ephemeralLinger; else this.#ephemeralLinger = it; }

  static make(d,f) {
    const $self = new TaskSettings();
    TaskSettings.make$($self,d,f);
    return $self;
  }

  static make$($self,d,f) {
    haystack.TypedDict.make$($self, d);
    ;
    sys.Func.call(f, $self);
    return;
  }

}

class TaskFuncs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TaskFuncs.type$; }

  static task(id,checked) {
    if (checked === undefined) checked = true;
    if (sys.ObjUtil.is(id, Task.type$)) {
      return sys.ObjUtil.coerce(id, Task.type$);
    }
    ;
    return TaskFuncs.lib(TaskFuncs.curContext()).task(haystack.Etc.toId(id), checked);
  }

  static tasks(opts) {
    if (opts === undefined) opts = null;
    if (opts == null) {
      (opts = haystack.Etc.emptyDict());
    }
    ;
    let cx = TaskFuncs.curContext();
    let lib = TaskFuncs.lib(cx);
    let meta = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    let search = haystack.Filter.searchFromOpts(opts);
    if (cx.feedIsEnabled()) {
      cx.feedAdd(TasksFeed.make(cx, lib, search), meta);
    }
    ;
    let grid = TaskFuncs.tasksGrid(lib, meta, 0);
    if (search != null) {
      (grid = grid.filter(sys.ObjUtil.coerce(search, haystack.Filter.type$), cx));
    }
    ;
    (grid = grid.sortDis());
    return grid;
  }

  static tasksGrid(lib,meta,ticks) {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.setMeta(meta);
    gb.addCol("id").addCol("type").addCol("taskStatus").addCol("subscription").addCol("progress").addCol("errNum").addCol("queueSize").addCol("queuePeak").addCol("evalNum").addCol("evalTotalTime").addCol("evalAvgTime").addCol("evalLastTime").addCol("fault");
    lib.tasks().each((t) => {
      if (sys.ObjUtil.compareLT(t.ticks(), ticks)) {
        return;
      }
      ;
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [t.id(), t.type().name(), t.status().name(), t.subscriptionDebug(), t.progress(), haystack.Number.makeInt(t.errNum()), haystack.Number.makeInt(t.queueSize()), haystack.Number.makeInt(t.queuePeak()), haystack.Number.makeInt(t.evalNum()), haystack.Number.makeDuration(sys.ObjUtil.coerce(sys.Duration.make(t.evalTotalTicks()), sys.Duration.type$)), haystack.Number.makeDuration(sys.ObjUtil.coerce(sys.Duration.make(t.evalAvgTicks()), sys.Duration.type$)), ((this$) => { if (sys.ObjUtil.equals(t.evalNum(), 0)) return null; return sys.DateTime.now(null).minus(sys.ObjUtil.coerce(sys.Duration.make(sys.Int.minus(sys.Duration.nowTicks(), t.evalLastTime())), sys.Duration.type$)); })(this$), t.fault()]));
      return;
    });
    return gb.toGrid();
  }

  static taskIsRunning() {
    return Task.cur() != null;
  }

  static taskCur(checked) {
    if (checked === undefined) checked = true;
    let task = Task.cur();
    if (task != null) {
      return task;
    }
    ;
    if (checked) {
      throw NotTaskContextErr.make("Not running in task context");
    }
    ;
    return null;
  }

  static taskRun(expr,msg) {
    if (msg === undefined) msg = axon.Literal.nullVal();
    let cx = TaskFuncs.curContext();
    return TaskFuncs.lib(cx).run(expr, msg.eval(cx));
  }

  static taskRestart(task) {
    return TaskFuncs.lib(TaskFuncs.curContext()).restart(TaskFuncs.toTask(task));
  }

  static taskCancel(task) {
    TaskFuncs.toTask(task).cancel();
    return;
  }

  static taskProgress(progress) {
    return sys.ObjUtil.coerce(((this$) => { let $_u3 = TaskFuncs.taskCur(false); if ($_u3 == null) return null; return TaskFuncs.taskCur(false).progressUpdate(haystack.Etc.makeDict(progress)); })(this), Task.type$.toNullable());
  }

  static taskBalance(tasks) {
    return sys.ObjUtil.coerce(TaskFuncs.lib(TaskFuncs.curContext()).pool().balance(TaskFuncs.toTasks(tasks)), Task.type$);
  }

  static taskSend(task,msg) {
    return TaskFuncs.toTask(task).checkAlive().send(msg);
  }

  static taskSendLater(task,dur,msg) {
    return TaskFuncs.toTask(task).checkAlive().sendLater(sys.ObjUtil.coerce(dur.toDuration(), sys.Duration.type$), msg);
  }

  static taskSendWhenComplete(task,future,msg) {
    if (msg === undefined) msg = future;
    return TaskFuncs.toTask(task).checkAlive().sendWhenComplete(future, msg);
  }

  static taskLocalGet(name,def) {
    if (def === undefined) def = null;
    TaskFuncs.checkTaskIsRunning();
    return concurrent.Actor.locals().get(name, def);
  }

  static taskLocalSet(name,val) {
    TaskFuncs.checkTaskIsRunning();
    if (!haystack.Etc.isTagName(name)) {
      throw sys.Err.make(sys.Str.plus("Task local name not valid tag name: ", name));
    }
    ;
    concurrent.Actor.locals().set(name, val);
    return val;
  }

  static taskLocalRemove(name) {
    TaskFuncs.checkTaskIsRunning();
    return concurrent.Actor.locals().remove(name);
  }

  static futureGet(future,timeout) {
    if (timeout === undefined) timeout = null;
    return future.get(((this$) => { let $_u4 = timeout; if ($_u4 == null) return null; return timeout.toDuration(); })(this));
  }

  static futureCancel(future) {
    future.cancel();
    return future;
  }

  static futureState(future) {
    return future.status().name();
  }

  static futureIsComplete(future) {
    return future.status().isComplete();
  }

  static futureWaitFor(future,timeout) {
    if (timeout === undefined) timeout = null;
    return future.waitFor(((this$) => { let $_u5 = timeout; if ($_u5 == null) return null; return timeout.toDuration(); })(this));
  }

  static futureWaitForAll(futures,timeout) {
    if (timeout === undefined) timeout = null;
    concurrent.Future.waitForAll(futures, ((this$) => { let $_u6 = timeout; if ($_u6 == null) return null; return timeout.toDuration(); })(this));
    return futures;
  }

  static taskSleep(dur) {
    if (TaskFuncs.taskIsRunning()) {
      concurrent.Actor.sleep(sys.ObjUtil.coerce(dur.toDuration(), sys.Duration.type$));
    }
    ;
    return dur;
  }

  static taskRunAction(taskIds) {
    const this$ = this;
    let tasks = sys.ObjUtil.coerce(haystack.Etc.toIds(taskIds).map((id) => {
      return TaskFuncs.toTask(id);
    }, Task.type$), sys.Type.find("hxTask::Task[]"));
    let futures = sys.ObjUtil.coerce(tasks.map((task) => {
      return TaskFuncs.taskSend(task, haystack.Etc.dict0());
    }, sys.Obj.type$.toNullable()), sys.Type.find("concurrent::Future[]"));
    return sys.Str.plus(sys.Str.plus("Sent to ", sys.ObjUtil.coerce(tasks.size(), sys.Obj.type$.toNullable())), " tasks");
  }

  static taskCancelAction(taskIds) {
    const this$ = this;
    let tasks = sys.ObjUtil.coerce(haystack.Etc.toIds(taskIds).map((id) => {
      return TaskFuncs.toTask(id);
    }, Task.type$), sys.Type.find("hxTask::Task[]"));
    tasks.each((task) => {
      TaskFuncs.taskCancel(task);
      return;
    });
    return sys.Str.plus(sys.Str.plus("Cancelled ", sys.ObjUtil.coerce(tasks.size(), sys.Obj.type$.toNullable())), " tasks");
  }

  static taskDoSendAction(taskIds,msg) {
    const this$ = this;
    let msgDict = ((this$) => { let $_u7 = haystack.TrioReader.make(sys.Str.in(msg)).readDict(false); if ($_u7 != null) return $_u7; return haystack.Etc.emptyDict(); })(this);
    let tasks = sys.ObjUtil.coerce(haystack.Etc.toIds(taskIds).map((id) => {
      return TaskFuncs.toTask(id);
    }, Task.type$), sys.Type.find("hxTask::Task[]"));
    let futures = sys.ObjUtil.coerce(tasks.map((task) => {
      return TaskFuncs.taskSend(task, msgDict);
    }, sys.Obj.type$.toNullable()), sys.Type.find("concurrent::Future[]"));
    return sys.Str.plus(sys.Str.plus("Sent to ", sys.ObjUtil.coerce(tasks.size(), sys.Obj.type$.toNullable())), " tasks");
  }

  static taskDebugDetails(task) {
    return haystack.Etc.makeMapGrid(sys.Map.__fromLiteral(["view"], ["text"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["val"], [TaskFuncs.toTask(task).details()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

  static taskDebugPool() {
    const this$ = this;
    let lib = TaskFuncs.lib(TaskFuncs.curContext());
    let buf = sys.StrBuf.make();
    let user = lib.user();
    buf.add("User:\n");
    let names = haystack.Etc.dictNames(user.meta()).dup().sort();
    names.moveTo("dis", 0).moveTo("username", 0).moveTo("id", 0).moveTo("mod", -1);
    names.each((n) => {
      buf.add("  ").add(n).add(": ").add(haystack.Etc.valToDis(user.meta().get(n))).add("\n");
      return;
    });
    buf.add("\n");
    sys.ObjUtil.trap(lib.pool(),"dump", sys.List.make(sys.Obj.type$.toNullable(), [buf.out()]));
    return haystack.Etc.makeMapGrid(sys.Map.__fromLiteral(["view"], ["text"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")), sys.Map.__fromLiteral(["val"], [buf.toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
  }

  static taskRefreshUser() {
    TaskFuncs.lib(TaskFuncs.curContext()).refreshUser();
    return;
  }

  static taskTestAdjunct() {
    const this$ = this;
    let a = sys.ObjUtil.coerce(TaskFuncs.curContext().rt().task().adjunct(() => {
      return TestTaskAdjunct.make();
    }), TestTaskAdjunct.type$);
    a.counter().increment();
    return sys.ObjUtil.coerce(haystack.Number.makeInt(a.counter().val()), haystack.Number.type$);
  }

  static checkTaskIsRunning() {
    if (!TaskFuncs.taskIsRunning()) {
      throw sys.Err.make("Not running in task context");
    }
    ;
    return;
  }

  static toTask(t) {
    return sys.ObjUtil.coerce(TaskFuncs.task(t, true), Task.type$);
  }

  static toTasks(t) {
    const this$ = this;
    if (sys.ObjUtil.is(t, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(t, sys.Type.find("sys::List")).map((x) => {
        return TaskFuncs.toTask(sys.ObjUtil.coerce(x, sys.Obj.type$));
      }, Task.type$), sys.Type.find("hxTask::Task[]"));
    }
    ;
    return sys.List.make(Task.type$, [TaskFuncs.toTask(t)]);
  }

  static curContext() {
    return sys.ObjUtil.coerce(hx.HxContext.curHx(), hx.HxContext.type$);
  }

  static lib(cx) {
    return sys.ObjUtil.coerce(cx.rt().lib("task"), TaskLib.type$);
  }

  static make() {
    const $self = new TaskFuncs();
    TaskFuncs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class TestTaskAdjunct extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#onKillFlag = concurrent.AtomicBool.make();
    this.#counter = concurrent.AtomicInt.make();
    return;
  }

  typeof() { return TestTaskAdjunct.type$; }

  #onKillFlag = null;

  onKillFlag() { return this.#onKillFlag; }

  __onKillFlag(it) { if (it === undefined) return this.#onKillFlag; else this.#onKillFlag = it; }

  #counter = null;

  counter() { return this.#counter; }

  __counter(it) { if (it === undefined) return this.#counter; else this.#counter = it; }

  onKill() {
    this.#onKillFlag.val(true);
    return;
  }

  static make() {
    const $self = new TestTaskAdjunct();
    TestTaskAdjunct.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class TasksFeed extends hx.HxFeed {
  constructor() {
    super();
    const this$ = this;
    this.#lastPollTicks = concurrent.AtomicInt.make(sys.Duration.nowTicks());
    return;
  }

  typeof() { return TasksFeed.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #search = null;

  search() { return this.#search; }

  __search(it) { if (it === undefined) return this.#search; else this.#search = it; }

  #lastPollTicks = null;

  lastPollTicks() { return this.#lastPollTicks; }

  __lastPollTicks(it) { if (it === undefined) return this.#lastPollTicks; else this.#lastPollTicks = it; }

  static make(cx,lib,search) {
    const $self = new TasksFeed();
    TasksFeed.make$($self,cx,lib,search);
    return $self;
  }

  static make$($self,cx,lib,search) {
    hx.HxFeed.make$($self, cx);
    ;
    $self.#lib = lib;
    $self.#search = search;
    return;
  }

  poll(cx) {
    let grid = TaskFuncs.tasksGrid(this.#lib, null, this.#lastPollTicks.val());
    if (this.#search != null) {
      (grid = grid.filter(sys.ObjUtil.coerce(this.#search, haystack.Filter.type$), cx));
    }
    ;
    this.#lastPollTicks.val(sys.Duration.nowTicks());
    return grid;
  }

}

class Task extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#isKilled = concurrent.AtomicBool.make();
    this.#isCancelled = concurrent.AtomicBool.make();
    this.#ticksRef = concurrent.AtomicInt.make(sys.Duration.nowTicks());
    this.#evalLastTimeRef = concurrent.AtomicInt.make();
    this.#evalTotalTicksRef = concurrent.AtomicInt.make();
    this.#threadIdRef = concurrent.AtomicInt.make(-1);
    this.#errNumRef = concurrent.AtomicInt.make();
    this.#errLastRef = concurrent.AtomicRef.make();
    this.#subscriptionRef = concurrent.AtomicRef.make();
    this.#adjunctRef = concurrent.AtomicRef.make();
    this.#progressRef = concurrent.AtomicRef.make(haystack.Etc.emptyDict());
    return;
  }

  typeof() { return Task.type$; }

  toActorMsg() { return obs.Observer.prototype.toActorMsg.apply(this, arguments); }

  toSyncMsg() { return obs.Observer.prototype.toSyncMsg.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  static #ephemeralCounter = undefined;

  static ephemeralCounter() {
    if (Task.#ephemeralCounter === undefined) {
      Task.static$init();
      if (Task.#ephemeralCounter === undefined) Task.#ephemeralCounter = null;
    }
    return Task.#ephemeralCounter;
  }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #fault = null;

  fault() { return this.#fault; }

  __fault(it) { if (it === undefined) return this.#fault; else this.#fault = it; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  #expr = null;

  expr() { return this.#expr; }

  __expr(it) { if (it === undefined) return this.#expr; else this.#expr = it; }

  #isKilled = null;

  // private field reflection only
  __isKilled(it) { if (it === undefined) return this.#isKilled; else this.#isKilled = it; }

  #isCancelled = null;

  // private field reflection only
  __isCancelled(it) { if (it === undefined) return this.#isCancelled; else this.#isCancelled = it; }

  #ticksRef = null;

  // private field reflection only
  __ticksRef(it) { if (it === undefined) return this.#ticksRef; else this.#ticksRef = it; }

  #evalLastTimeRef = null;

  // private field reflection only
  __evalLastTimeRef(it) { if (it === undefined) return this.#evalLastTimeRef; else this.#evalLastTimeRef = it; }

  #evalTotalTicksRef = null;

  // private field reflection only
  __evalTotalTicksRef(it) { if (it === undefined) return this.#evalTotalTicksRef; else this.#evalTotalTicksRef = it; }

  #threadIdRef = null;

  // private field reflection only
  __threadIdRef(it) { if (it === undefined) return this.#threadIdRef; else this.#threadIdRef = it; }

  #errNumRef = null;

  // private field reflection only
  __errNumRef(it) { if (it === undefined) return this.#errNumRef; else this.#errNumRef = it; }

  #errLastRef = null;

  // private field reflection only
  __errLastRef(it) { if (it === undefined) return this.#errLastRef; else this.#errLastRef = it; }

  #subscriptionRef = null;

  // private field reflection only
  __subscriptionRef(it) { if (it === undefined) return this.#subscriptionRef; else this.#subscriptionRef = it; }

  #adjunctRef = null;

  // private field reflection only
  __adjunctRef(it) { if (it === undefined) return this.#adjunctRef; else this.#adjunctRef = it; }

  #progressRef = null;

  // private field reflection only
  __progressRef(it) { if (it === undefined) return this.#progressRef; else this.#progressRef = it; }

  static cur() {
    return sys.ObjUtil.coerce(concurrent.Actor.locals().get("task.cur"), Task.type$.toNullable());
  }

  static makeRec(lib,rec) {
    try {
      if (rec.missing("task")) {
        return Task.makeFault(lib, rec, "Missing 'task' tag");
      }
      ;
      if (rec.has("disabled")) {
        return Task.makeFault(lib, rec, "Task is disabled", TaskType.disabled());
      }
      ;
      let exprVal = rec.get("taskExpr");
      if (exprVal == null) {
        return Task.makeFault(lib, rec, "Missing 'taskExpr' tag");
      }
      ;
      if (!sys.ObjUtil.is(exprVal, sys.Str.type$)) {
        return Task.makeFault(lib, rec, "Invalid type 'taskExpr' tag, must be Str");
      }
      ;
      let expr = null;
      try {
        (expr = axon.Parser.make(axon.Loc.make("taskExpr"), sys.Str.in(sys.ObjUtil.toStr(exprVal))).parse());
      }
      catch ($_u8) {
        $_u8 = sys.Err.make($_u8);
        if ($_u8 instanceof sys.Err) {
          let e = $_u8;
          ;
          return Task.makeFault(lib, rec, sys.Str.plus("Invalid expr: ", e));
        }
        else {
          throw $_u8;
        }
      }
      ;
      return Task.makeOk(lib, rec, sys.ObjUtil.coerce(expr, axon.Expr.type$));
    }
    catch ($_u9) {
      $_u9 = sys.Err.make($_u9);
      if ($_u9 instanceof sys.Err) {
        let e = $_u9;
        ;
        return Task.makeFault(lib, rec, sys.Str.plus("Internal error: ", e));
      }
      else {
        throw $_u9;
      }
    }
    ;
  }

  static makeOk(lib,rec,expr) {
    const $self = new Task();
    Task.makeOk$($self,lib,rec,expr);
    return $self;
  }

  static makeOk$($self,lib,rec,expr) {
    concurrent.Actor.make$($self, lib.pool());
    ;
    $self.#lib = lib;
    $self.#id = rec.id();
    $self.#rec = rec;
    $self.#type = TaskType.rec();
    $self.#expr = expr;
    return;
  }

  static makeFault(lib,rec,fault,type) {
    const $self = new Task();
    Task.makeFault$($self,lib,rec,fault,type);
    return $self;
  }

  static makeFault$($self,lib,rec,fault,type) {
    if (type === undefined) type = TaskType.fault();
    concurrent.Actor.make$($self, lib.pool());
    ;
    $self.#lib = lib;
    $self.#id = rec.id();
    $self.#rec = rec;
    $self.#type = type;
    $self.#fault = fault;
    $self.#expr = axon.Literal.nullVal();
    $self.#isKilled.val(true);
    return;
  }

  static makeEphemeral(lib,expr) {
    const $self = new Task();
    Task.makeEphemeral$($self,lib,expr);
    return $self;
  }

  static makeEphemeral$($self,lib,expr) {
    concurrent.Actor.make$($self, lib.pool());
    ;
    $self.#lib = lib;
    $self.#id = sys.ObjUtil.coerce(haystack.Ref.make(sys.Str.plus("ephemeral-", sys.ObjUtil.coerce(Task.ephemeralCounter().getAndIncrement(), sys.Obj.type$.toNullable())), expr.toStr()), haystack.Ref.type$);
    $self.#rec = haystack.Etc.emptyDict();
    $self.#type = TaskType.ephemeral();
    $self.#expr = expr;
    return;
  }

  meta() {
    return haystack.Etc.emptyDict();
  }

  actor() {
    return this;
  }

  isEmpty() {
    return this.#rec.isEmpty();
  }

  get(name,def) {
    if (def === undefined) def = null;
    return this.#rec.get(name, def);
  }

  has(name) {
    return this.#rec.has(name);
  }

  missing(name) {
    return this.#rec.missing(name);
  }

  each(f) {
    this.#rec.each(f);
    return;
  }

  eachWhile(f) {
    return this.#rec.eachWhile(f);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    if (sys.ObjUtil.equals(name, "dump")) {
      return sys.ObjUtil.trap(concurrent.Actor.prototype, name, args);
    }
    ;
    return this.#rec.trap(name, args);
  }

  isAlive() {
    return !this.#isKilled.val();
  }

  checkAlive() {
    if (this.#type.isEphemeral()) {
      throw TaskEphemeralErr.make(sys.Str.plus("Cannot send additional messages to ephemeral task: ", this));
    }
    ;
    if (this.isAlive()) {
      return this;
    }
    ;
    if (this.#type === TaskType.fault()) {
      throw TaskFaultErr.make(sys.Str.plus("Task is in fault: ", this));
    }
    ;
    if (this.#type === TaskType.disabled()) {
      throw TaskDisabledErr.make(sys.Str.plus("Task is disabled: ", this));
    }
    ;
    throw TaskKilledErr.make(sys.Str.plus("Task is killed: ", this));
  }

  cancel() {
    this.#isCancelled.val(true);
    return;
  }

  kill() {
    this.#isKilled.val(true);
    return;
  }

  status() {
    if (this.#type === TaskType.fault()) {
      return TaskStatus.fault();
    }
    ;
    if (this.#type === TaskType.disabled()) {
      return TaskStatus.disabled();
    }
    ;
    if (this.isEphemeralDone()) {
      return ((this$) => { if (this$.errLast() != null) return TaskStatus.doneErr(); return TaskStatus.doneOk(); })(this);
    }
    ;
    if (this.#isKilled.val()) {
      return TaskStatus.killed();
    }
    ;
    return sys.ObjUtil.coerce(TaskStatus.fromStr(this.threadState()), TaskStatus.type$);
  }

  ticks() {
    return this.#ticksRef.val();
  }

  evalNum() {
    return this.receiveCount();
  }

  isEphemeralDone() {
    return (this.#type.isEphemeral() && sys.ObjUtil.compareGT(this.evalLastTime(), 0));
  }

  evalLastTime() {
    return this.#evalLastTimeRef.val();
  }

  evalTotalTicks() {
    return this.#evalTotalTicksRef.val();
  }

  evalAvgTicks() {
    let num = this.evalNum();
    return ((this$) => { if (sys.ObjUtil.compareLE(num, 0)) return 0; return sys.Int.div(this$.#evalTotalTicksRef.val(), num); })(this);
  }

  errNum() {
    return this.#errNumRef.val();
  }

  errLast() {
    return sys.ObjUtil.coerce(this.#errLastRef.val(), sys.Err.type$.toNullable());
  }

  progress() {
    return sys.ObjUtil.coerce(this.#progressRef.val(), haystack.Dict.type$);
  }

  progressUpdate(d) {
    this.#progressRef.val(d);
    this.#ticksRef.val(sys.Duration.nowTicks());
    return this;
  }

  toStr() {
    let s = sys.StrBuf.make().add("Task @").add(this.#id.toProjRel());
    if (this.#id.disVal() != null) {
      s.add(" ").add(this.#id.disVal());
    }
    ;
    return s.toStr();
  }

  details() {
    let buf = sys.StrBuf.make();
    buf.add("id:           ").add(this.#id.id()).add("\n");
    buf.add("dis:          ").add(this.dis()).add("\n");
    buf.add("type:         ").add(this.#type).add("\n");
    buf.add("status:       ").add(this.status()).add("\n");
    buf.add("fault:        ").add(this.#fault).add("\n");
    buf.add("updated:      ").add(haystack.Etc.debugDur(sys.ObjUtil.coerce(this.ticks(), sys.Obj.type$.toNullable()))).add("\n");
    buf.add("evalNum:      ").add(sys.ObjUtil.coerce(this.evalNum(), sys.Obj.type$.toNullable())).add("\n");
    buf.add("evalLastTime: ").add(haystack.Etc.debugDur(sys.ObjUtil.coerce(this.evalLastTime(), sys.Obj.type$.toNullable()))).add("\n");
    buf.add("evalTotal:    ").add(sys.Duration.make(this.evalTotalTicks()).toLocale()).add("\n");
    buf.add("evalAvg:      ").add(sys.Duration.make(this.evalAvgTicks()).toLocale()).add("\n");
    if (this.subscriptionErr() != null) {
      buf.add("subscripton:  ").add(haystack.Etc.debugErr(this.subscriptionErr(), "x<")).add("\n");
    }
    else {
      buf.add("subscripton:  ").add(this.subscriptionDebug()).add("\n");
    }
    ;
    buf.add("errNum:       ").add(sys.ObjUtil.coerce(this.errNum(), sys.Obj.type$.toNullable())).add("\n");
    buf.add("errLast:      ").add(haystack.Etc.debugErr(this.errLast(), "x<")).add("\n");
    buf.add("progress:     ").add(this.progressDebug()).add("\n");
    buf.add("\n");
    buf.add("expr:\n").add(haystack.Etc.indent(this.#expr.toStr())).add("\n");
    this.trap("dump", sys.List.make(sys.Obj.type$.toNullable(), [buf.out()]));
    let threadId = this.#threadIdRef.val();
    if (sys.ObjUtil.compareNE(threadId, -1)) {
      buf.add("\nThread\n");
      let trace = hx.HxUtil.threadDump(threadId);
      buf.add(trace);
      while (sys.ObjUtil.equals(buf.get(-1), 10)) {
        buf.remove(-1);
      }
      ;
      buf.add("\n");
    }
    ;
    return buf.toStr();
  }

  progressDebug() {
    const this$ = this;
    let p = this.progress();
    let str = p.toStr();
    if (sys.ObjUtil.compareLT(sys.Str.size(str), 60)) {
      return str;
    }
    ;
    let buf = sys.StrBuf.make().add("\n");
    p.each((v,n) => {
      buf.add("  ").add(n);
      if (sys.ObjUtil.compareNE(v, haystack.Marker.val())) {
        buf.add(": ").add(v).add("\n");
      }
      ;
      return;
    });
    return buf.toStr();
  }

  receive(msg) {
    if (this.#isKilled.val()) {
      throw TaskKilledErr.make("Task killed");
    }
    ;
    concurrent.Actor.locals().set("task.cur", this);
    let start = sys.Duration.nowTicks();
    this.#ticksRef.val(start);
    this.#threadIdRef.val(hx.HxUtil.threadId());
    let err = null;
    let result = null;
    try {
      (result = this.eval(this.#expr, msg));
    }
    catch ($_u12) {
      $_u12 = sys.Err.make($_u12);
      if ($_u12 instanceof sys.Err) {
        let e = $_u12;
        ;
        (err = e);
      }
      else {
        throw $_u12;
      }
    }
    ;
    let end = sys.Duration.nowTicks();
    this.#ticksRef.val(end);
    this.#evalLastTimeRef.val(end);
    this.#evalTotalTicksRef.add(sys.Int.minus(end, start));
    this.#threadIdRef.val(-1);
    if (err != null) {
      this.#errNumRef.increment();
      this.#errLastRef.val(err);
      throw sys.ObjUtil.coerce(err, sys.Err.type$);
    }
    ;
    return result;
  }

  eval(expr,msg) {
    const this$ = this;
    this.#isCancelled.val(false);
    let cx = this.#lib.rt().context().create(this.#lib.user());
    cx.heartbeatFunc(() => {
      if ((this$.#isCancelled.val() || this$.#isKilled.val())) {
        throw sys.CancelledErr.make();
      }
      ;
      return;
    });
    concurrent.Actor.locals().set(haystack.Etc.cxActorLocalsKey(), cx);
    try {
      return this.doEval(expr, cx, msg);
    }
    finally {
      concurrent.Actor.locals().remove(haystack.Etc.cxActorLocalsKey());
    }
    ;
  }

  doEval(expr,cx,msg) {
    if (expr.type() === axon.ExprType.var()) {
      (expr = sys.ObjUtil.coerce(cx.findTop(expr.toStr()), axon.Expr.type$));
    }
    ;
    if (sys.ObjUtil.is(expr, axon.Fn.type$)) {
      return sys.ObjUtil.coerce(expr, axon.Fn.type$).call(cx, sys.List.make(sys.Obj.type$.toNullable(), [msg]));
    }
    ;
    return expr.eval(cx);
  }

  subscriptionErr() {
    return sys.ObjUtil.as(this.#subscriptionRef.val(), sys.Err.type$);
  }

  subscription() {
    return sys.ObjUtil.as(this.#subscriptionRef.val(), obs.Subscription.type$);
  }

  subscriptionDebug() {
    return ((this$) => { let $_u13 = this$.#subscriptionRef.val(); if ($_u13 == null) return null; return sys.ObjUtil.toStr(this$.#subscriptionRef.val()); })(this);
  }

  subscribe() {
    const this$ = this;
    try {
      if (!this.#type.isRec()) {
        return;
      }
      ;
      let observable = this.#lib.rt().obs().list().find((o) => {
        return this$.#rec.has(o.name());
      });
      if (observable == null) {
        return;
      }
      ;
      let s = observable.subscribe(this, this.#rec);
      this.#subscriptionRef.compareAndSet(null, s);
    }
    catch ($_u14) {
      $_u14 = sys.Err.make($_u14);
      if ($_u14 instanceof sys.Err) {
        let e = $_u14;
        ;
        this.#subscriptionRef.val(e);
      }
      else {
        throw $_u14;
      }
    }
    ;
    this.#ticksRef.val(sys.Duration.nowTicks());
    return;
  }

  unsubscribe() {
    let s = this.subscription();
    if (s == null) {
      return;
    }
    ;
    try {
      s.unsubscribe();
    }
    catch ($_u15) {
      $_u15 = sys.Err.make($_u15);
      if ($_u15 instanceof sys.Err) {
        let e = $_u15;
        ;
        this.#lib.log().err(sys.Str.plus("Task.unsubscribe: ", this.dis()), e);
      }
      else {
        throw $_u15;
      }
    }
    ;
    return;
  }

  adjunct(onInit) {
    let adjunct = this.#adjunctRef.val();
    if (adjunct == null) {
      this.#adjunctRef.val((adjunct = sys.Func.call(onInit)));
    }
    ;
    return sys.ObjUtil.coerce(adjunct, hx.HxTaskAdjunct.type$);
  }

  adjunctOnKill() {
    let adjunct = sys.ObjUtil.as(this.#adjunctRef.val(), hx.HxTaskAdjunct.type$);
    if (adjunct == null) {
      return;
    }
    ;
    try {
      adjunct.onKill();
    }
    catch ($_u16) {
      $_u16 = sys.Err.make($_u16);
      if ($_u16 instanceof sys.Err) {
        let e = $_u16;
        ;
        this.#lib.log().err(sys.Str.plus("Task.adjunctOnKill: ", this.dis()), e);
      }
      else {
        throw $_u16;
      }
    }
    ;
    return;
  }

  static static$init() {
    Task.#ephemeralCounter = concurrent.AtomicInt.make();
    return;
  }

}

class TaskType extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TaskType.type$; }

  static fault() { return TaskType.vals().get(0); }

  static disabled() { return TaskType.vals().get(1); }

  static rec() { return TaskType.vals().get(2); }

  static ephemeral() { return TaskType.vals().get(3); }

  static #vals = undefined;

  isRec() {
    return this === this;
  }

  isEphemeral() {
    return this === TaskType.ephemeral();
  }

  static make($ordinal,$name) {
    const $self = new TaskType();
    TaskType.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(TaskType.type$, TaskType.vals(), name$, checked);
  }

  static vals() {
    if (TaskType.#vals == null) {
      TaskType.#vals = sys.List.make(TaskType.type$, [
        TaskType.make(0, "fault", ),
        TaskType.make(1, "disabled", ),
        TaskType.make(2, "rec", ),
        TaskType.make(3, "ephemeral", ),
      ]).toImmutable();
    }
    return TaskType.#vals;
  }

  static static$init() {
    const $_u17 = TaskType.vals();
    if (true) {
    }
    ;
    return;
  }

}

class TaskStatus extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TaskStatus.type$; }

  static fault() { return TaskStatus.vals().get(0); }

  static disabled() { return TaskStatus.vals().get(1); }

  static idle() { return TaskStatus.vals().get(2); }

  static pending() { return TaskStatus.vals().get(3); }

  static running() { return TaskStatus.vals().get(4); }

  static killed() { return TaskStatus.vals().get(5); }

  static doneOk() { return TaskStatus.vals().get(6); }

  static doneErr() { return TaskStatus.vals().get(7); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new TaskStatus();
    TaskStatus.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(TaskStatus.type$, TaskStatus.vals(), name$, checked);
  }

  static vals() {
    if (TaskStatus.#vals == null) {
      TaskStatus.#vals = sys.List.make(TaskStatus.type$, [
        TaskStatus.make(0, "fault", ),
        TaskStatus.make(1, "disabled", ),
        TaskStatus.make(2, "idle", ),
        TaskStatus.make(3, "pending", ),
        TaskStatus.make(4, "running", ),
        TaskStatus.make(5, "killed", ),
        TaskStatus.make(6, "doneOk", ),
        TaskStatus.make(7, "doneErr", ),
      ]).toImmutable();
    }
    return TaskStatus.#vals;
  }

  static static$init() {
    const $_u18 = TaskStatus.vals();
    if (true) {
    }
    ;
    return;
  }

}

class TaskTest extends hx.HxTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TaskTest.type$; }

  testSettings() {
    let lib = sys.ObjUtil.coerce(this.addLib("task"), TaskLib.type$);
    this.verifyEq(sys.ObjUtil.typeof(lib.rec()).qname(), "hxTask::TaskSettings");
    this.verifyEq(sys.ObjUtil.coerce(lib.rec().maxThreads(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()));
    this.verifyEq(lib.rec().get("maxThreads"), null);
    this.rt().libs().remove("task");
    (lib = sys.ObjUtil.coerce(this.rt().libs().add("task", haystack.Etc.makeDict1("maxThreads", haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())))), TaskLib.type$));
    this.verifyEq(sys.ObjUtil.typeof(lib.rec()).qname(), "hxTask::TaskSettings");
    this.verifyEq(sys.ObjUtil.coerce(lib.rec().maxThreads(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(123, sys.Obj.type$.toNullable()));
    this.verifyEq(lib.rec().trap("maxThreads", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())));
    this.commit(lib.rec(), sys.Map.__fromLiteral(["maxThreads"], [haystack.HaystackTest.n(sys.ObjUtil.coerce(987, sys.Num.type$.toNullable()))], sys.Type.find("sys::Str"), sys.Type.find("haystack::Number?")));
    this.rt().sync();
    this.verifyEq(sys.ObjUtil.typeof(lib.rec()).qname(), "hxTask::TaskSettings");
    this.verifyEq(sys.ObjUtil.coerce(lib.rec().maxThreads(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(987, sys.Obj.type$.toNullable()));
    this.verifyEq(lib.rec().trap("maxThreads", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.HaystackTest.n(sys.ObjUtil.coerce(987, sys.Num.type$.toNullable())));
    lib.log().level(sys.LogLevel.err());
    this.commit(lib.rec(), sys.Map.__fromLiteral(["maxThreads"], ["bad"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    this.rt().sync();
    this.verifyEq(sys.ObjUtil.typeof(lib.rec()).qname(), "hxTask::TaskSettings");
    this.verifyEq(sys.ObjUtil.coerce(lib.rec().maxThreads(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()));
    this.verifyEq(lib.rec().trap("maxThreads", sys.List.make(sys.Obj.type$.toNullable(), [])), "bad");
    return;
  }

  testBasics() {
    const this$ = this;
    let lib = sys.ObjUtil.coerce(this.addLib("task"), TaskLib.type$);
    this.sync();
    lib.spi().sync();
    let func = this.addFuncRec("topFunc", "(msg) => \"top \" + msg");
    let a = this.addTaskRec("A", "topFunc");
    let b = this.addTaskRec("B", "(msg) => msg.upper");
    let c = this.addTaskRec("C", "123");
    let d = this.addTaskRec("D", "(msg) => taskSleep(msg)");
    let e = this.addTaskRec("E", "(msg) => nowTicks()");
    let f = this.addTaskRec("F", "(msg) => logErr(\"test\", \"fail if you see this!!!!!\")");
    let bad1 = this.addRec(sys.Map.__fromLiteral(["dis","task","taskExpr","disabled"], ["Disabled",haystack.HaystackTest.m(),"123",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let bad2 = this.addRec(sys.Map.__fromLiteral(["dis","task"], ["No taskExpr",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let bad3 = this.addRec(sys.Map.__fromLiteral(["dis","task","taskExpr"], ["Bas taskExpr",haystack.HaystackTest.m(),"#"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    this.sync();
    let aTask = this.verifyTask(sys.ObjUtil.coerce(lib.task(a.id()), Task.type$), "rec", "idle");
    let bTask = this.verifyTask(sys.ObjUtil.coerce(lib.task(b.id()), Task.type$), "rec", "idle");
    let cTask = this.verifyTask(sys.ObjUtil.coerce(lib.task(c.id()), Task.type$), "rec", "idle");
    let dTask = this.verifyTask(sys.ObjUtil.coerce(lib.task(d.id()), Task.type$), "rec", "idle");
    let eTask = this.verifyTask(sys.ObjUtil.coerce(lib.task(e.id()), Task.type$), "rec", "idle");
    let fTask = this.verifyTask(sys.ObjUtil.coerce(lib.task(f.id()), Task.type$), "rec", "idle");
    let bad1Task = this.verifyTask(sys.ObjUtil.coerce(lib.task(bad1.id()), Task.type$), "disabled", "disabled", "Task is disabled");
    let bad2Task = this.verifyTask(sys.ObjUtil.coerce(lib.task(bad2.id()), Task.type$), "fault", "fault", "Missing 'taskExpr' tag");
    let bad3Task = this.verifyTask(sys.ObjUtil.coerce(lib.task(bad3.id()), Task.type$), "fault", "fault", "Invalid expr: axon::SyntaxErr: Unexpected symbol: # (0x23) [taskExpr:1]");
    this.forceSteadyState();
    this.verifyEq(sys.ObjUtil.coerce(this.rt().isSteadyState(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.sync();
    let sched = this.rt().obs().get("obsSchedule");
    this.verifyEq(sys.ObjUtil.coerce(sched.subscriptions().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()));
    this.verifySubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), aTask);
    this.verifySubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), bTask);
    this.verifySubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), cTask);
    this.verifySubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), dTask);
    this.verifySubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), eTask);
    this.verifySubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), fTask);
    let aOld = lib.task(a.id());
    (a = sys.ObjUtil.coerce(this.commit(a, sys.Map.__fromLiteral(["foo"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker"))), haystack.Dict.type$));
    this.sync();
    (aTask = sys.ObjUtil.coerce(lib.task(a.id()), Task.type$));
    this.verifyNotSame(aTask, aOld);
    this.verifyEq(sys.ObjUtil.coerce(sys.ObjUtil.compareLT(aOld.ticks(), aTask.ticks()), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyKilled(sys.ObjUtil.coerce(aOld, Task.type$));
    this.verifyTask(aTask, "rec", "idle");
    this.verifyUnsubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), sys.ObjUtil.coerce(aOld, Task.type$));
    this.verifySubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), aTask);
    this.verifyEq(sys.ObjUtil.coerce(sched.subscriptions().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(fTask.isAlive(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.commit(f, null, folio.Diff.remove());
    this.sync();
    this.verifyEq(lib.task(f.id(), false), null);
    this.verifyKilled(fTask);
    sys.Int.times(20, (it) => {
      fTask.send("never");
      return;
    });
    this.verifyUnsubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), fTask);
    this.verifyEq(sys.ObjUtil.coerce(sched.subscriptions().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifySame(this.eval(sys.Str.plus(sys.Str.plus("task(", a.id().toCode()), ")")), lib.task(a.id()));
    this.verifySame(this.eval(sys.Str.plus(sys.Str.plus("task(", f.id().toCode()), ", false)")), null);
    this.verifyEq(sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", a.id().toCode()), ", \"hello\")")), concurrent.Future.type$).get(), "top hello");
    this.verifyEq(sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", b.id().toCode()), ", \"hello\")")), concurrent.Future.type$).get(), "HELLO");
    this.verifyEq(sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", c.id().toCode()), ", \"hello\")")), concurrent.Future.type$).get(), haystack.HaystackTest.n(sys.ObjUtil.coerce(123, sys.Num.type$.toNullable())));
    let startTicks = sys.DateTime.nowTicks();
    let fut = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSendLater(", e.id().toCode()), ", 50ms, \"ignore\")")), concurrent.Future.type$);
    this.verifyEq(sys.ObjUtil.coerce(fut.status().isComplete(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    concurrent.Actor.sleep(sys.Duration.fromStr("100ms"));
    this.verifyEq(sys.ObjUtil.coerce(fut.status().isComplete(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    let diff = sys.Int.minus(sys.ObjUtil.coerce(fut.get(), haystack.Number.type$).toInt(), startTicks);
    this.verify(sys.ObjUtil.compareGT(diff, 45000000));
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("taskSendWhenComplete(", b.id().toCode()), ", taskSend("), a.id().toCode()), ", \"ignore\"), \"chain\").futureGet")), "CHAIN");
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", b.id().toCode()), ", \"get\").futureGet")), "GET");
    this.verifyErr(axon.EvalErr.type$, (it) => {
      this$.eval(sys.Str.plus(sys.Str.plus("taskSend(", d.id().toCode()), ", 100ms).futureGet(0ms)"));
      return;
    });
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", d.id().toCode()), ", 100ms).futureState")), "pending");
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", d.id().toCode()), ", 100ms).futureIsComplete")), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", d.id().toCode()), ", 100ms).futureCancel.futureState")), "cancelled");
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", d.id().toCode()), ", 100ms).futureCancel.futureIsComplete")), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(this.eval("taskRun(x=>x, \"test\").futureGet"), "test");
    this.verifyDictEq(sys.ObjUtil.coerce(this.eval("taskRun(x=>x, {foo}).futureGet"), haystack.Dict.type$), sys.Map.__fromLiteral(["foo"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    this.verifyEq(this.rt().task().run(axon.Parser.make(axon.Loc.eval(), sys.Str.in("(msg)=>msg+100")).parse(), haystack.HaystackTest.n(sys.ObjUtil.coerce(7, sys.Num.type$.toNullable()))).get(), haystack.HaystackTest.n(sys.ObjUtil.coerce(107, sys.Num.type$.toNullable())));
    this.verifyEq(this.rt().task().cur(false), null);
    this.verifyErr(NotTaskContextErr.type$, (it) => {
      this$.rt().task().cur(true);
      return;
    });
    this.rt().libs().remove("task");
    this.rt().sync();
    this.verifyEq(sys.ObjUtil.coerce(lib.pool().isStopped(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyKilled(aTask);
    this.verifyUnsubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), aTask);
    this.verifyKilled(bTask);
    this.verifyUnsubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), bTask);
    this.verifyKilled(cTask);
    this.verifyUnsubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), cTask);
    this.verifyKilled(dTask);
    this.verifyUnsubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), dTask);
    this.verifyKilled(eTask);
    this.verifyUnsubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), eTask);
    this.verifyKilled(fTask);
    this.verifyUnsubscribed(sys.ObjUtil.coerce(sched, obs.Observable.type$), fTask);
    this.verifyKilled(bad1Task);
    this.verifyKilled(bad2Task);
    this.verifyKilled(bad3Task);
    this.verifyEq(sys.ObjUtil.coerce(sched.subscriptions().size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.UnknownServiceErr.type$, (it) => {
      this$.rt().task();
      return;
    });
    return;
  }

  testLocals() {
    const this$ = this;
    let lib = sys.ObjUtil.coerce(this.addLib("task"), TaskLib.type$);
    let t = this.addTaskRec("T", " (msg) => do\n   toks: msg.split(\" \")\n   action: toks[0]\n   name: toks[1]\n   val: toks[2]\n   if (action == \"get\") return taskLocalGet(name, val)\n   if (action == \"set\") return taskLocalSet(name, val)\n   if (action == \"remove\") return taskLocalRemove(name)\n   throw action\n end\n ");
    this.sync();
    this.verifySend(t, "get foo ???", "???");
    this.verifySend(t, "set foo one", "one");
    this.verifySend(t, "get foo ???", "one");
    this.verifySend(t, "remove foo ignore", "one");
    this.verifySend(t, "get foo ???", "???");
    this.verifyErr(axon.EvalErr.type$, (it) => {
      this$.verifySend(t, "set bad-name two", "fail");
      return;
    });
    return;
  }

  testCancel() {
    let lib = sys.ObjUtil.coerce(this.addLib("task"), TaskLib.type$);
    this.addFuncRec("testIt", "(msg) => do\n  100.times(() => do\n     taskSleep(100ms)\n  end)\nend\n");
    let t = this.addRec(sys.Map.__fromLiteral(["dis","task","taskExpr"], ["Cancel Test",haystack.HaystackTest.m(),"testIt"], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let future = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", t.id().toCode()), ", \"kick it off!\")")), concurrent.Future.type$);
    concurrent.Actor.sleep(sys.Duration.fromStr("50ms"));
    this.eval(sys.Str.plus(sys.Str.plus("taskCancel(", t.id().toCode()), ")"));
    while (!future.status().isComplete()) {
      concurrent.Actor.sleep(sys.Duration.fromStr("100ms"));
    }
    ;
    this.verifyEq(future.status(), concurrent.FutureStatus.err());
    try {
      future.get();
      this.fail();
    }
    catch ($_u19) {
      $_u19 = sys.Err.make($_u19);
      if ($_u19 instanceof axon.EvalErr) {
        let e = $_u19;
        ;
        this.verifyEq(sys.ObjUtil.typeof(e.cause()), sys.CancelledErr.type$);
      }
      else {
        throw $_u19;
      }
    }
    ;
    let debug = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskDebugDetails(", t.id().toCode()), ")[0]->val")), sys.Str.type$);
    this.verifyEq(sys.ObjUtil.coerce(sys.Str.contains(debug, "sys::CancelledErr"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return;
  }

  testAdjuncts() {
    const this$ = this;
    let lib = sys.ObjUtil.coerce(this.addLib("task"), TaskLib.type$);
    let t = this.addTaskRec("T1", " (msg) => do\n   taskTestAdjunct()\n end\n ");
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", t.id().toCode()), ", null).futureGet")), haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())));
    let a = sys.ObjUtil.coerce(lib.task(t.id()).adjunct(() => {
      throw sys.Err.make();
    }), TestTaskAdjunct.type$);
    this.verifyEq(sys.ObjUtil.coerce(a.counter().val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.onKillFlag().val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", t.id().toCode()), ", null).futureGet")), haystack.HaystackTest.n(sys.ObjUtil.coerce(2, sys.Num.type$.toNullable())));
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", t.id().toCode()), ", null).futureGet")), haystack.HaystackTest.n(sys.ObjUtil.coerce(3, sys.Num.type$.toNullable())));
    this.verifySame(a, lib.task(t.id()).adjunct(() => {
      throw sys.Err.make();
    }));
    this.verifyEq(sys.ObjUtil.coerce(a.counter().val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.onKillFlag().val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.commit(t, sys.Map.__fromLiteral(["foo"], [haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("haystack::Marker")));
    this.sync();
    this.verifyEq(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", t.id().toCode()), ", null).futureGet")), haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable())));
    this.verifyNotSame(a, lib.task(t.id()).adjunct(() => {
      throw sys.Err.make();
    }));
    this.verifyEq(sys.ObjUtil.coerce(a.counter().val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.onKillFlag().val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    return;
  }

  testUser() {
    if (!this.rt().platform().isSkySpark()) {
      sys.ObjUtil.echo("   ##");
      sys.ObjUtil.echo("   ## Skip until hxd supports access filters");
      sys.ObjUtil.echo("   ##");
      return;
    }
    ;
    let lib = sys.ObjUtil.coerce(this.addLib("task"), TaskLib.type$);
    let a = this.addRec(sys.Map.__fromLiteral(["dis","site","foo"], ["A",haystack.HaystackTest.m(),haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let b = this.addRec(sys.Map.__fromLiteral(["dis","site"], ["B",haystack.HaystackTest.m()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
    let t1 = this.addTaskRec("T1", " (msg) => do\n   readAll(site)\n end\n ");
    let id1 = sys.ObjUtil.coerce(t1.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$);
    let t2 = this.addTaskRec("T2", " (msg) => do\n   xq().xqReadAll(site).xqExecute\n end\n ");
    let id2 = sys.ObjUtil.coerce(t2.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$);
    this.sync();
    this.verifySame(lib.user(), lib.userFallback());
    this.verifyEq(lib.user().meta().get("projAccessFilter"), sys.Str.plus("name==", sys.Str.toCode(this.rt().name())));
    let sites = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", id1.toCode()), ", {}).futureWaitFor.futureGet.sortDis")), haystack.Grid.type$);
    this.verifyEq(sys.ObjUtil.coerce(sites.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyDictEq(sites.get(0), a);
    this.verifyDictEq(sites.get(1), b);
    (sites = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", id2.toCode()), ", {}).futureWaitFor.futureGet")), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(sites.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    let u = this.addUser("task", "pass", sys.Map.__fromLiteral(["siteAccessFilter"], ["foo"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    lib.refreshUser();
    this.verifyEq(lib.user().id(), u.id());
    (sites = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", id1.toCode()), ", {}).futureWaitFor.futureGet.sortDis")), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(sites.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyDictEq(sites.get(0), a);
    (sites = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", id2.toCode()), ", {}).futureWaitFor.futureGet")), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(sites.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyDictEq(sites.get(0), a);
    let u2 = this.addUser(sys.Str.plus("task-", this.rt().name()), "pass", sys.Map.__fromLiteral(["userRole"], ["admin"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")));
    lib.refreshUser();
    this.verifyEq(lib.user().id(), u2.id());
    (sites = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", id1.toCode()), ", {}).futureWaitFor.futureGet.sortDis")), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(sites.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyDictEq(sites.get(0), a);
    this.verifyDictEq(sites.get(1), b);
    if (this.rt().platform().isSkySpark()) {
      (sites = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", id2.toCode()), ", {}).futureWaitFor.futureGet.sortDis")), haystack.Grid.type$));
      this.verifyEq(sys.ObjUtil.coerce(sites.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
      this.verifyDictEq(sites.get(0), a);
      this.verifyDictEq(sites.get(1), b);
    }
    ;
    (u2 = this.addUser(sys.Str.plus("task-", this.rt().name()), "pass", sys.Map.__fromLiteral(["userRole"], ["su"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    lib.refreshUser();
    this.verifySame(lib.user(), lib.userFallback());
    (sites = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", id1.toCode()), ", {}).futureWaitFor.futureGet.sortDis")), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(sites.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyDictEq(sites.get(0), a);
    this.verifyDictEq(sites.get(1), b);
    (sites = sys.ObjUtil.coerce(this.eval(sys.Str.plus(sys.Str.plus("taskSend(", id2.toCode()), ", {}).futureWaitFor.futureGet")), haystack.Grid.type$));
    this.verifyEq(sys.ObjUtil.coerce(sites.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    return;
  }

  sync() {
    this.rt().sync();
    return;
  }

  addFuncRec(name,src,tags) {
    if (tags === undefined) tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    tags.set("def", haystack.Symbol.fromStr(sys.Str.plus("func:", name)));
    tags.set("src", src);
    let r = this.addRec(tags);
    this.rt().sync();
    return r;
  }

  addTaskRec(dis,expr) {
    return this.addRec(sys.Map.__fromLiteral(["dis","task","taskExpr","obsSchedule","obsScheduleFreq"], ["Top Func",haystack.HaystackTest.m(),expr,haystack.HaystackTest.m(),haystack.HaystackTest.n(sys.ObjUtil.coerce(1, sys.Num.type$.toNullable()), "day")], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")));
  }

  verifyTask(task,type,status,fault) {
    if (fault === undefined) fault = null;
    let lib = sys.ObjUtil.coerce(this.rt().lib("task"), TaskLib.type$);
    this.verifySame(lib.task(task.id()), task);
    this.verifyEq(task.type().name(), type);
    this.verifyEq(task.status().name(), status);
    this.verifyEq(task.fault(), fault);
    this.verifyEq(sys.ObjUtil.coerce(task.isAlive(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(fault == null, sys.Obj.type$.toNullable()));
    return task;
  }

  verifyKilled(task) {
    this.verifyEq(sys.ObjUtil.coerce(task.isAlive(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    if ((sys.ObjUtil.compareNE(task.type(), TaskType.disabled()) && sys.ObjUtil.compareNE(task.type(), TaskType.fault()))) {
      this.verifyEq(task.status(), TaskStatus.killed());
    }
    ;
    if (task.subscription() != null) {
      this.verifyEq(sys.ObjUtil.coerce(task.subscription().isUnsubscribed(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    }
    ;
    return;
  }

  verifySubscribed(o,t) {
    const this$ = this;
    let s = o.subscriptions().find((x) => {
      return x.observer() === t;
    });
    this.verifyNotNull(s);
    return;
  }

  verifyUnsubscribed(o,t) {
    const this$ = this;
    let s = o.subscriptions().find((x) => {
      return x.observer() === t;
    });
    this.verifyNull(s);
    return;
  }

  verifySend(task,msg,expected) {
    let id = sys.ObjUtil.coerce(sys.ObjUtil.trap(task,"id", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$);
    let msgCode = haystack.Etc.toAxon(msg);
    let actual = this.eval(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("taskSend(", id.toCode()), ", "), msgCode), ").futureWaitFor.futureGet"));
    this.verifyEq(actual, expected);
    return;
  }

  static make() {
    const $self = new TaskTest();
    TaskTest.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxTest.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxTask');
const xp = sys.Param.noParams$();
let m;
UnknownTaskErr.type$ = p.at$('UnknownTaskErr','sys::Err',[],{'sys::NoDoc':""},8194,UnknownTaskErr);
NotTaskContextErr.type$ = p.at$('NotTaskContextErr','sys::Err',[],{'sys::NoDoc':""},8194,NotTaskContextErr);
TaskFaultErr.type$ = p.at$('TaskFaultErr','sys::Err',[],{'sys::NoDoc':""},8194,TaskFaultErr);
TaskDisabledErr.type$ = p.at$('TaskDisabledErr','sys::Err',[],{'sys::NoDoc':""},8194,TaskDisabledErr);
TaskEphemeralErr.type$ = p.at$('TaskEphemeralErr','sys::Err',[],{'sys::NoDoc':""},8194,TaskEphemeralErr);
TaskKilledErr.type$ = p.at$('TaskKilledErr','sys::Err',[],{'sys::NoDoc':""},8194,TaskKilledErr);
TaskLib.type$ = p.at$('TaskLib','hx::HxLib',['hx::HxTaskService'],{},8194,TaskLib);
TaskSettings.type$ = p.at$('TaskSettings','haystack::TypedDict',[],{},8194,TaskSettings);
TaskFuncs.type$ = p.at$('TaskFuncs','sys::Obj',[],{},8194,TaskFuncs);
TestTaskAdjunct.type$ = p.at$('TestTaskAdjunct','sys::Obj',['hx::HxTaskAdjunct'],{},130,TestTaskAdjunct);
TasksFeed.type$ = p.at$('TasksFeed','hx::HxFeed',[],{'sys::NoDoc':""},8194,TasksFeed);
Task.type$ = p.at$('Task','concurrent::Actor',['obs::Observer','hx::HxTask'],{},8194,Task);
TaskType.type$ = p.at$('TaskType','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,TaskType);
TaskStatus.type$ = p.at$('TaskStatus','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},170,TaskStatus);
TaskTest.type$ = p.at$('TaskTest','hx::HxTest',[],{},8192,TaskTest);
UnknownTaskErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
NotTaskContextErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
TaskFaultErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
TaskDisabledErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
TaskEphemeralErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
TaskKilledErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
TaskLib.type$.af$('userRef',67586,'concurrent::AtomicRef',{}).af$('pool',73730,'concurrent::ActorPool',{}).af$('tasksById',67586,'concurrent::ConcurrentMap',{}).af$('userFallback$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',xp,{}).am$('services',271360,'hx::HxService[]',xp,{}).am$('rec',271360,'hxTask::TaskSettings',xp,{}).am$('task',128,'hxTask::Task?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('tasks',128,'hxTask::Task[]',xp,{}).am$('cur',271360,'hx::HxTask?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('run',271360,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false),new sys.Param('msg','sys::Obj?',true)]),{}).am$('progress',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('progress','haystack::Dict',false)]),{}).am$('adjunct',271360,'hx::HxTaskAdjunct',sys.List.make(sys.Param.type$,[new sys.Param('onInit','|->hx::HxTaskAdjunct|',false)]),{}).am$('onStart',271360,'sys::Void',xp,{}).am$('onSteadyState',271360,'sys::Void',xp,{}).am$('onStop',271360,'sys::Void',xp,{}).am$('onTaskEvent',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','obs::CommitObservation',false)]),{}).am$('restart',128,'hxTask::Task',sys.List.make(sys.Param.type$,[new sys.Param('task','hxTask::Task',false)]),{}).am$('spawn',2048,'hxTask::Task',sys.List.make(sys.Param.type$,[new sys.Param('task','hxTask::Task',false)]),{}).am$('spawnEphemeral',128,'hxTask::Task',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false)]),{}).am$('kill',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('task','hxTask::Task',false)]),{}).am$('user',8192,'hx::HxUser',xp,{}).am$('houseKeepingFreq',271360,'sys::Duration?',xp,{}).am$('onHouseKeeping',271360,'sys::Void',xp,{}).am$('refreshUser',128,'sys::Void',xp,{}).am$('userFallback',532480,'hx::HxUser',xp,{}).am$('cleanupEphemerals',2048,'sys::Void',xp,{}).am$('userFallback$Once',133120,'hx::HxUser',xp,{});
TaskSettings.type$.af$('maxThreads',73730,'sys::Int',{'haystack::TypedTag':"haystack::TypedTag{restart=true;}"}).af$('ephemeralLinger',73730,'sys::Duration',{'haystack::TypedTag':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Dict',false),new sys.Param('f','|sys::This->sys::Void|',false)]),{});
TaskFuncs.type$.am$('task',40962,'hxTask::Task?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj?',false),new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('tasks',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('opts','haystack::Dict?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('tasksGrid',32898,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxTask::TaskLib',false),new sys.Param('meta','sys::Obj?',false),new sys.Param('ticks','sys::Int',false)]),{}).am$('taskIsRunning',40962,'sys::Bool',xp,{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskCur',40962,'hxTask::Task?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskRun',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false),new sys.Param('msg','axon::Expr',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskRestart',40962,'hxTask::Task',sys.List.make(sys.Param.type$,[new sys.Param('task','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskCancel',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('task','sys::Obj',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskProgress',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('progress','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskBalance',40962,'hxTask::Task',sys.List.make(sys.Param.type$,[new sys.Param('tasks','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskSend',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('task','sys::Obj',false),new sys.Param('msg','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskSendLater',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('task','sys::Obj',false),new sys.Param('dur','haystack::Number',false),new sys.Param('msg','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskSendWhenComplete',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('task','sys::Obj',false),new sys.Param('future','concurrent::Future',false),new sys.Param('msg','sys::Obj?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskLocalGet',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskLocalSet',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskLocalRemove',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('futureGet',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('future','concurrent::Future',false),new sys.Param('timeout','haystack::Number?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('futureCancel',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('future','concurrent::Future',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('futureState',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('future','concurrent::Future',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('futureIsComplete',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('future','concurrent::Future',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('futureWaitFor',40962,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('future','concurrent::Future',false),new sys.Param('timeout','haystack::Number?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('futureWaitForAll',40962,'concurrent::Future[]',sys.List.make(sys.Param.type$,[new sys.Param('futures','concurrent::Future[]',false),new sys.Param('timeout','haystack::Number?',true)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskSleep',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dur','haystack::Number',false)]),{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskRunAction',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('taskIds','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskCancelAction',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('taskIds','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskDoSendAction',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('taskIds','sys::Obj',false),new sys.Param('msg','sys::Str',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskDebugDetails',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('task','sys::Obj',false)]),{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskDebugPool',40962,'haystack::Grid',xp,{'sys::NoDoc':"",'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskRefreshUser',40962,'sys::Void',xp,{'axon::Axon':"axon::Axon{admin=true;}"}).am$('taskTestAdjunct',40962,'haystack::Number',xp,{'sys::NoDoc':"",'axon::Axon':""}).am$('checkTaskIsRunning',34818,'sys::Void',xp,{}).am$('toTask',34818,'hxTask::Task',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Obj',false)]),{}).am$('toTasks',34818,'hxTask::Task[]',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Obj',false)]),{}).am$('curContext',34818,'hx::HxContext',xp,{}).am$('lib',34818,'hxTask::TaskLib',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TestTaskAdjunct.type$.af$('onKillFlag',73730,'concurrent::AtomicBool',{}).af$('counter',73730,'concurrent::AtomicInt',{}).am$('onKill',271360,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
TasksFeed.type$.af$('lib',73730,'hxTask::TaskLib',{}).af$('search',73730,'haystack::Filter?',{}).af$('lastPollTicks',73730,'concurrent::AtomicInt',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false),new sys.Param('lib','hxTask::TaskLib',false),new sys.Param('search','haystack::Filter?',false)]),{}).am$('poll',271360,'haystack::Grid?',sys.List.make(sys.Param.type$,[new sys.Param('cx','hx::HxContext',false)]),{});
Task.type$.af$('ephemeralCounter',100354,'concurrent::AtomicInt',{}).af$('lib',73730,'hxTask::TaskLib',{}).af$('id',336898,'haystack::Ref',{}).af$('type',65666,'hxTask::TaskType',{}).af$('fault',65666,'sys::Str?',{}).af$('rec',65666,'haystack::Dict',{}).af$('expr',65666,'axon::Expr',{}).af$('isKilled',67586,'concurrent::AtomicBool',{}).af$('isCancelled',67586,'concurrent::AtomicBool',{}).af$('ticksRef',67586,'concurrent::AtomicInt',{}).af$('evalLastTimeRef',67586,'concurrent::AtomicInt',{}).af$('evalTotalTicksRef',67586,'concurrent::AtomicInt',{}).af$('threadIdRef',67586,'concurrent::AtomicInt',{}).af$('errNumRef',67586,'concurrent::AtomicInt',{}).af$('errLastRef',67586,'concurrent::AtomicRef',{}).af$('subscriptionRef',67586,'concurrent::AtomicRef',{}).af$('adjunctRef',67586,'concurrent::AtomicRef',{}).af$('progressRef',67586,'concurrent::AtomicRef',{}).am$('cur',40962,'hxTask::Task?',xp,{}).am$('makeRec',40966,'hxTask::Task?',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxTask::TaskLib',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('makeOk',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxTask::TaskLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('expr','axon::Expr',false)]),{}).am$('makeFault',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxTask::TaskLib',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('fault','sys::Str',false),new sys.Param('type','hxTask::TaskType',true)]),{}).am$('makeEphemeral',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hxTask::TaskLib',false),new sys.Param('expr','axon::Expr',false)]),{}).am$('meta',271360,'haystack::Dict',xp,{}).am$('actor',271360,'concurrent::Actor',xp,{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('isAlive',8192,'sys::Bool',xp,{}).am$('checkAlive',128,'sys::This',xp,{}).am$('cancel',128,'sys::Void',xp,{}).am$('kill',128,'sys::Void',xp,{}).am$('status',128,'hxTask::TaskStatus',xp,{}).am$('ticks',128,'sys::Int',xp,{}).am$('evalNum',128,'sys::Int',xp,{}).am$('isEphemeralDone',128,'sys::Bool',xp,{}).am$('evalLastTime',128,'sys::Int',xp,{}).am$('evalTotalTicks',128,'sys::Int',xp,{}).am$('evalAvgTicks',128,'sys::Int',xp,{}).am$('errNum',128,'sys::Int',xp,{}).am$('errLast',128,'sys::Err?',xp,{}).am$('progress',128,'haystack::Dict',xp,{}).am$('progressUpdate',128,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('d','haystack::Dict',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('details',128,'sys::Str',xp,{}).am$('progressDebug',2048,'sys::Str',xp,{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('eval',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false),new sys.Param('msg','sys::Obj?',false)]),{}).am$('doEval',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('expr','axon::Expr',false),new sys.Param('cx','hx::HxContext',false),new sys.Param('msg','sys::Obj?',false)]),{}).am$('subscriptionErr',8192,'sys::Err?',xp,{}).am$('subscription',8192,'obs::Subscription?',xp,{}).am$('subscriptionDebug',128,'sys::Str?',xp,{}).am$('subscribe',8192,'sys::Void',xp,{}).am$('unsubscribe',128,'sys::Void',xp,{}).am$('adjunct',128,'hx::HxTaskAdjunct',sys.List.make(sys.Param.type$,[new sys.Param('onInit','|->hx::HxTaskAdjunct|',false)]),{}).am$('adjunctOnKill',128,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
TaskType.type$.af$('fault',106506,'hxTask::TaskType',{}).af$('disabled',106506,'hxTask::TaskType',{}).af$('rec',106506,'hxTask::TaskType',{}).af$('ephemeral',106506,'hxTask::TaskType',{}).af$('vals',106498,'hxTask::TaskType[]',{}).am$('isRec',8192,'sys::Bool',xp,{}).am$('isEphemeral',8192,'sys::Bool',xp,{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'hxTask::TaskType?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
TaskStatus.type$.af$('fault',106506,'hxTask::TaskStatus',{}).af$('disabled',106506,'hxTask::TaskStatus',{}).af$('idle',106506,'hxTask::TaskStatus',{}).af$('pending',106506,'hxTask::TaskStatus',{}).af$('running',106506,'hxTask::TaskStatus',{}).af$('killed',106506,'hxTask::TaskStatus',{}).af$('doneOk',106506,'hxTask::TaskStatus',{}).af$('doneErr',106506,'hxTask::TaskStatus',{}).af$('vals',106498,'hxTask::TaskStatus[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'hxTask::TaskStatus?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
TaskTest.type$.am$('testSettings',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('testBasics',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('testLocals',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('testCancel',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('testAdjuncts',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('testUser',8192,'sys::Void',xp,{'hx::HxRuntimeTest':""}).am$('sync',8192,'sys::Void',xp,{}).am$('addFuncRec',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('src','sys::Str',false),new sys.Param('tags','[sys::Str:sys::Obj?]',true)]),{}).am$('addTaskRec',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('dis','sys::Str',false),new sys.Param('expr','sys::Str',false)]),{}).am$('verifyTask',8192,'hxTask::Task',sys.List.make(sys.Param.type$,[new sys.Param('task','hxTask::Task',false),new sys.Param('type','sys::Str',false),new sys.Param('status','sys::Str',false),new sys.Param('fault','sys::Str?',true)]),{}).am$('verifyKilled',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('task','hxTask::Task',false)]),{}).am$('verifySubscribed',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('o','obs::Observable',false),new sys.Param('t','hxTask::Task',false)]),{}).am$('verifyUnsubscribed',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('o','obs::Observable',false),new sys.Param('t','hxTask::Task',false)]),{}).am$('verifySend',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('task','sys::Obj',false),new sys.Param('msg','sys::Obj',false),new sys.Param('expected','sys::Obj',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxTask");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;haystack 3.1.11;obs 3.1.11;axon 3.1.11;folio 3.1.11;hx 3.1.11");
m.set("pod.summary", "Async task engine");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:27-05:00 New_York");
m.set("build.tsKey", "241210143127");
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
  UnknownTaskErr,
  NotTaskContextErr,
  TaskFaultErr,
  TaskDisabledErr,
  TaskEphemeralErr,
  TaskKilledErr,
  TaskLib,
  TaskSettings,
  TaskFuncs,
  TasksFeed,
  Task,
  TaskTest,
};
