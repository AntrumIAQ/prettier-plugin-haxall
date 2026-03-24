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
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class HxdContextService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdContextService.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  static make(rt) {
    const $self = new HxdContextService();
    HxdContextService.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    $self.#rt = rt;
    return;
  }

  create(user) {
    return HxdContext.make(this.#rt, user, null);
  }

  createSession(session) {
    return HxdContext.make(this.#rt, session.user(), session);
  }

  xetoReload() {
    this.#rt.nsBaseRecompile();
    return;
  }

}

class HxdContext extends hx.HxContext {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return HxdContext.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #user = null;

  user() { return this.#user; }

  __user(it) { if (it === undefined) return this.#user; else this.#user = it; }

  #sessionRef = null;

  sessionRef() { return this.#sessionRef; }

  __sessionRef(it) { if (it === undefined) return this.#sessionRef; else this.#sessionRef = it; }

  #inference$Store = undefined;

  // private field reflection only
  __inference$Store(it) { if (it === undefined) return this.#inference$Store; else this.#inference$Store = it; }

  static cur(checked) {
    if (checked === undefined) checked = true;
    let cx = concurrent.Actor.locals().get(haystack.Etc.cxActorLocalsKey());
    if (cx != null) {
      return sys.ObjUtil.coerce(cx, HxdContext.type$.toNullable());
    }
    ;
    if (checked) {
      throw hx.ContextUnavailableErr.make("No HxContext available");
    }
    ;
    return null;
  }

  static make(rt,user,session) {
    const $self = new HxdContext();
    HxdContext.make$($self,rt,user,session);
    return $self;
  }

  static make$($self,rt,user,session) {
    hx.HxContext.make$($self);
    ;
    $self.#rt = rt;
    $self.#user = user;
    $self.#sessionRef = session;
    return;
  }

  ns() {
    return this.#rt.ns();
  }

  db() {
    return this.#rt.db();
  }

  session(checked) {
    if (checked === undefined) checked = true;
    if (this.#sessionRef != null) {
      return this.#sessionRef;
    }
    ;
    if (checked) {
      throw hx.SessionUnavailableErr.make("Context not associated with a session");
    }
    ;
    return null;
  }

  about() {
    const this$ = this;
    let tags = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj?]"));
    tags.set("haystackVersion", this.ns().lib("ph").version().toStr());
    tags.set("serverName", sys.Env.cur().host());
    tags.set("serverBootTime", sys.DateTime.boot());
    tags.set("serverTime", sys.DateTime.now());
    tags.set("productName", this.#rt.platform().productName());
    tags.set("productUri", this.#rt.platform().productUri());
    tags.set("productVersion", this.#rt.platform().productVersion());
    tags.set("tz", sys.TimeZone.cur().name());
    tags.set("vendorName", this.#rt.platform().vendorName());
    tags.set("vendorUri", this.#rt.platform().vendorUri());
    tags.set("whoami", this.#user.username());
    return haystack.Etc.makeDict(tags);
  }

  xetoReadById(id) {
    return this.db().readById(sys.ObjUtil.coerce(id, haystack.Ref.type$.toNullable()), false);
  }

  xetoReadAllEachWhile(filter,f) {
    return this.db().readAllEachWhile(sys.ObjUtil.coerce(haystack.Filter.fromStr(filter), haystack.Filter.type$), haystack.Etc.dict0(), f);
  }

  deref(id) {
    return this.db().readById(id, false);
  }

  inference() {
    if (this.#inference$Store === undefined) {
      this.#inference$Store = this.inference$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#inference$Store, haystack.FilterInference.type$);
  }

  toDict() {
    let tags = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    tags.set("locale", sys.Locale.cur().toStr());
    tags.set("username", this.#user.username());
    tags.set("userRef", this.#user.id());
    if (this.timeout() != null) {
      tags.set("timeout", haystack.Number.makeDuration(sys.ObjUtil.coerce(this.timeout(), sys.Duration.type$), haystack.Number.mins()));
    }
    ;
    return haystack.Etc.dictMerge(hx.HxContext.prototype.toDict.call(this), tags);
  }

  canRead(rec) {
    return true;
  }

  canWrite(rec) {
    return (this.#user.isAdmin() && this.canRead(rec));
  }

  commitInfo() {
    return this.#user;
  }

  findTop(name,checked) {
    if (checked === undefined) checked = true;
    let $def = this.ns().def(sys.Str.plus("func:", name), false);
    if ($def == null) {
      if (checked) {
        throw haystack.UnknownFuncErr.make(name);
      }
      ;
      return null;
    }
    ;
    return sys.ObjUtil.coerce($def, FuncDef.type$).expr();
  }

  trapRef(id,checked) {
    if (checked === undefined) checked = true;
    return this.db().readById(id, checked);
  }

  evalOrReadAll(src) {
    let expr = this.parse(src);
    let filter = expr.evalToFilter(this, false);
    if (filter != null) {
      return this.#rt.db().readAll(sys.ObjUtil.coerce(filter, haystack.Filter.type$));
    }
    ;
    return expr.eval(this);
  }

  inference$Once() {
    return def.MFilterInference.make(this.ns());
  }

}

class HxdObsService extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdObsService.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #schedule = null;

  schedule() { return this.#schedule; }

  __schedule(it) { if (it === undefined) return this.#schedule; else this.#schedule = it; }

  #commits = null;

  commits() { return this.#commits; }

  __commits(it) { if (it === undefined) return this.#commits; else this.#commits = it; }

  #watches = null;

  watches() { return this.#watches; }

  __watches(it) { if (it === undefined) return this.#watches; else this.#watches = it; }

  #curVals = null;

  curVals() { return this.#curVals; }

  __curVals(it) { if (it === undefined) return this.#curVals; else this.#curVals = it; }

  #hisWrites = null;

  hisWrites() { return this.#hisWrites; }

  __hisWrites(it) { if (it === undefined) return this.#hisWrites; else this.#hisWrites = it; }

  #listRef = null;

  // private field reflection only
  __listRef(it) { if (it === undefined) return this.#listRef; else this.#listRef = it; }

  #byName = null;

  // private field reflection only
  __byName(it) { if (it === undefined) return this.#byName; else this.#byName = it; }

  static make(rt) {
    const $self = new HxdObsService();
    HxdObsService.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    concurrent.Actor.make$($self, rt.hxdActorPool());
    $self.#rt = rt;
    $self.#log = rt.db().log();
    $self.#byName = concurrent.ConcurrentMap.make();
    $self.#listRef = concurrent.AtomicRef.make(null);
    $self.#schedule = obs.ScheduleObservable.make();
    $self.#byName.add($self.#schedule.name(), $self.#schedule);
    $self.#commits = CommitsObservable.make(rt);
    $self.#byName.add($self.#commits.name(), $self.#commits);
    $self.#watches = WatchesObservable.make(rt);
    $self.#byName.add($self.#watches.name(), $self.#watches);
    $self.#curVals = CurValsObservable.make();
    $self.#byName.add($self.#curVals.name(), $self.#curVals);
    $self.#hisWrites = HisWritesObservable.make();
    $self.#byName.add($self.#hisWrites.name(), $self.#hisWrites);
    $self.#listRef.val(obs.Observable.type$.emptyList());
    $self.updateList();
    return;
  }

  init() {
    const this$ = this;
    this.#rt.libs().list().each((lib) => {
      this$.addLib(lib);
      return;
    });
    return;
  }

  list() {
    return sys.ObjUtil.coerce(this.#listRef.val(), sys.Type.find("obs::Observable[]"));
  }

  get(name,checked) {
    if (checked === undefined) checked = true;
    let o = this.#byName.get(name);
    if (o != null) {
      return sys.ObjUtil.coerce(o, obs.Observable.type$.toNullable());
    }
    ;
    if (checked) {
      throw obs.UnknownObservableErr.make(name);
    }
    ;
    return null;
  }

  addLib(lib) {
    const this$ = this;
    try {
      let list = lib.observables();
      if (list.isEmpty()) {
        return;
      }
      ;
      if (sys.ObjUtil.is(sys.ObjUtil.typeof(lib).slot("observables"), sys.Method.type$)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(lib)), ".observables must be const field"));
      }
      ;
      list.each((o) => {
        this$.#byName.add(o.name(), o);
        return;
      });
      this.updateList();
    }
    catch ($_u0) {
      $_u0 = sys.Err.make($_u0);
      if ($_u0 instanceof sys.Err) {
        let e = $_u0;
        ;
        this.#log.err(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(lib)), ".observables"), e);
      }
      else {
        throw $_u0;
      }
    }
    ;
    return;
  }

  removeLib(lib) {
    const this$ = this;
    try {
      lib.observables().each((o) => {
        o.unsubscribeAll();
        this$.#byName.remove(o.name());
        return;
      });
      this.updateList();
    }
    catch ($_u1) {
      $_u1 = sys.Err.make($_u1);
      if ($_u1 instanceof sys.Err) {
        let e = $_u1;
        ;
        this.#log.err(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(lib)), ".observables"), e);
      }
      else {
        throw $_u1;
      }
    }
    ;
    return;
  }

  updateList() {
    const this$ = this;
    if (this.#listRef.val() == null) {
      return;
    }
    ;
    let list = sys.ObjUtil.coerce(this.#byName.vals(obs.Observable.type$), sys.Type.find("obs::Observable[]"));
    list.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    list.moveTo(sys.ObjUtil.coerce(this.#byName.get("observeSchedule"), obs.Observable.type$.toNullable()), 0);
    this.#listRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(list), sys.Type.find("obs::Observable[]")));
    return;
  }

  sync(timeout) {
    let futures = sys.ObjUtil.coerce(this.send(hx.HxMsg.make0("sync")).get(timeout), sys.Type.find("concurrent::Future[]"));
    concurrent.Future.waitForAll(futures, timeout);
    return;
  }

  commit(diff,user) {
    if (this.#commits.hasSubscriptions()) {
      this.send(hx.HxMsg.make2("commit", diff, user));
    }
    ;
    return;
  }

  curVal(diff) {
    if (this.#curVals.hasSubscriptions()) {
      this.send(hx.HxMsg.make1("curVal", diff));
    }
    ;
    return;
  }

  hisWrite(rec,result,user) {
    if (this.#hisWrites.hasSubscriptions()) {
      this.send(hx.HxMsg.make3("hisWrite", rec, result, user));
    }
    ;
    return;
  }

  receive(msgObj) {
    try {
      let msg = sys.ObjUtil.coerce(msgObj, hx.HxMsg.type$);
      let $_u2 = msg.id();
      if (sys.ObjUtil.equals($_u2, "commit")) {
        return this.onCommit(sys.ObjUtil.coerce(msg.a(), folio.Diff.type$), sys.ObjUtil.coerce(msg.b(), hx.HxUser.type$.toNullable()));
      }
      else if (sys.ObjUtil.equals($_u2, "curVal")) {
        return this.onCurVal(sys.ObjUtil.coerce(msg.a(), folio.Diff.type$));
      }
      else if (sys.ObjUtil.equals($_u2, "hisWrite")) {
        return this.onHisWrite(sys.ObjUtil.coerce(msg.a(), haystack.Dict.type$), sys.ObjUtil.coerce(msg.b(), haystack.Dict.type$), sys.ObjUtil.coerce(msg.c(), hx.HxUser.type$.toNullable()));
      }
      else if (sys.ObjUtil.equals($_u2, "sync")) {
        return this.onSync();
      }
      else {
        return null;
      }
      ;
    }
    catch ($_u3) {
      $_u3 = sys.Err.make($_u3);
      if ($_u3 instanceof sys.Err) {
        let e = $_u3;
        ;
        this.#log.err("ObserveMgr", e);
        throw e;
      }
      else {
        throw $_u3;
      }
    }
    ;
  }

  onCommit(diff,user) {
    const this$ = this;
    let oldRec = HxdObsService.toDiffRec(diff.oldRec());
    let newRec = HxdObsService.toDiffRec(diff.newRec());
    this.#commits.subscriptions().each(sys.ObjUtil.coerce((sub) => {
      let oldMatch = sub.include(oldRec);
      let newMatch = sub.include(newRec);
      if (oldMatch) {
        if (newMatch) {
          this$.sendUpdated(sub, diff, oldRec, newRec, user);
        }
        else {
          this$.sendRemoved(sub, diff, oldRec, newRec, user);
        }
        ;
      }
      else {
        if (newMatch) {
          this$.sendAdded(sub, diff, oldRec, newRec, user);
        }
        ;
      }
      ;
      return;
    }, sys.Type.find("|obs::Subscription,sys::Int->sys::Void|")));
    return null;
  }

  static toDiffRec(r) {
    if ((r == null || r.has("trash"))) {
      return haystack.Etc.emptyDict();
    }
    else {
      return sys.ObjUtil.coerce(r, haystack.Dict.type$);
    }
    ;
  }

  sendAdded(sub,diff,oldRec,newRec,user) {
    if (sub.adds()) {
      sub.send(this.toObservation(obs.CommitObservationAction.added(), diff, oldRec, newRec, user));
    }
    ;
    return;
  }

  sendUpdated(sub,diff,oldRec,newRec,user) {
    if (sub.updates()) {
      sub.send(this.toObservation(obs.CommitObservationAction.updated(), diff, oldRec, newRec, user));
    }
    ;
    return;
  }

  sendRemoved(sub,diff,oldRec,newRec,user) {
    if (sub.removes()) {
      sub.send(this.toObservation(obs.CommitObservationAction.removed(), diff, oldRec, newRec, user));
    }
    ;
    return;
  }

  toObservation(action,diff,oldRec,newRec,user) {
    return obs.CommitObservation.make(this.#commits, action, this.#rt.now(), diff.id(), oldRec, newRec, ((this$) => { let $_u4 = user; if ($_u4 == null) return null; return user.meta(); })(this));
  }

  sendAddOnInit(sub) {
    const this$ = this;
    this.#rt.db().readAllEach(sys.ObjUtil.coerce(sub.filter(), haystack.Filter.type$), haystack.Etc.emptyDict(), (rec) => {
      let event = obs.CommitObservation.make(this$.#commits, obs.CommitObservationAction.added(), this$.#rt.now(), rec.id(), haystack.Etc.emptyDict(), rec, null);
      sub.send(event);
      return;
    });
    return;
  }

  onCurVal(diff) {
    const this$ = this;
    let oldRec = HxdObsService.toDiffRec(diff.oldRec());
    let newRec = HxdObsService.toDiffRec(diff.newRec());
    let event = obs.CommitObservation.make(this.#curVals, obs.CommitObservationAction.updated(), this.#rt.now(), diff.id(), oldRec, newRec, null);
    this.#curVals.subscriptions().each(sys.ObjUtil.coerce((sub) => {
      if (sub.include(newRec)) {
        sub.send(event);
      }
      ;
      return;
    }, sys.Type.find("|obs::Subscription,sys::Int->sys::Void|")));
    return null;
  }

  onHisWrite(rec,result,user) {
    const this$ = this;
    let count = sys.ObjUtil.as(result.get("count"), haystack.Number.type$);
    let span = sys.ObjUtil.as(result.get("span"), haystack.Span.type$);
    if ((count == null || span == null)) {
      this.#log.warn(sys.Str.plus("HxdObsService.onHisWrite invalid result: ", result));
      return null;
    }
    ;
    let event = obs.HisWriteObservation.make(this.#hisWrites, this.#rt.now(), rec.id(), rec, sys.ObjUtil.coerce(count, haystack.Number.type$), sys.ObjUtil.coerce(span, haystack.Span.type$), ((this$) => { let $_u5 = user; if ($_u5 == null) return null; return user.meta(); })(this));
    this.#hisWrites.subscriptions().each(sys.ObjUtil.coerce((sub) => {
      if (sub.include(rec)) {
        sub.send(event);
      }
      ;
      return;
    }, sys.Type.find("|obs::Subscription,sys::Int->sys::Void|")));
    return null;
  }

  onSync() {
    const this$ = this;
    let syncables = sys.ObjUtil.coerce(this.list().flatMap(($obs) => {
      return $obs.subscriptions().findAll((sub) => {
        return sub.config().has("syncable");
      });
    }, sys.Type.find("obs::Subscription[]")), sys.Type.find("obs::Subscription[]"));
    if (syncables.isEmpty()) {
      return concurrent.Future.type$.emptyList();
    }
    ;
    return syncables.map((sub) => {
      return sub.sync();
    }, concurrent.Future.type$);
  }

}

class CommitsObservable extends obs.Observable {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommitsObservable.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  static make(rt) {
    const $self = new CommitsObservable();
    CommitsObservable.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    obs.Observable.make$($self);
    $self.#rt = rt;
    return;
  }

  name() {
    return "obsCommits";
  }

  onSubscribe(observer,config) {
    let sub = CommitsSubscription.make(this, observer, config);
    if (sub.addOnInit()) {
      this.#rt.obs().sendAddOnInit(sub);
    }
    ;
    return sub;
  }

}

class CommitsSubscription extends obs.RecSubscription {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommitsSubscription.type$; }

  #adds = false;

  adds() { return this.#adds; }

  __adds(it) { if (it === undefined) return this.#adds; else this.#adds = it; }

  #updates = false;

  updates() { return this.#updates; }

  __updates(it) { if (it === undefined) return this.#updates; else this.#updates = it; }

  #removes = false;

  removes() { return this.#removes; }

  __removes(it) { if (it === undefined) return this.#removes; else this.#removes = it; }

  #addOnInit = false;

  addOnInit() { return this.#addOnInit; }

  __addOnInit(it) { if (it === undefined) return this.#addOnInit; else this.#addOnInit = it; }

  static make(observable,observer,config) {
    const $self = new CommitsSubscription();
    CommitsSubscription.make$($self,observable,observer,config);
    return $self;
  }

  static make$($self,observable,observer,config) {
    obs.RecSubscription.make$($self, observable, observer, config);
    $self.#adds = config.has("obsAdds");
    $self.#updates = config.has("obsUpdates");
    $self.#removes = config.has("obsRemoves");
    $self.#addOnInit = config.has("obsAddOnInit");
    if ((!$self.#adds && !$self.#updates && !$self.#removes)) {
      throw sys.Err.make("Must must define at least one: obsAdds, obsUpdates, or obsRemoves");
    }
    ;
    if (($self.#addOnInit && $self.filter() == null)) {
      throw sys.Err.make("Must define obsFilter if using obsAddOnInit");
    }
    ;
    return;
  }

}

class WatchesObservable extends obs.Observable {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WatchesObservable.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  static make(rt) {
    const $self = new WatchesObservable();
    WatchesObservable.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    obs.Observable.make$($self);
    $self.#rt = rt;
    return;
  }

  name() {
    return "obsWatches";
  }

  onSubscribe(observer,config) {
    const this$ = this;
    let sub = WatchesSubscription.make(this, observer, config);
    if (sub.filter() != null) {
      let recs = this.#rt.db().readAllList(sys.ObjUtil.coerce(sub.filter(), haystack.Filter.type$)).findAll((rec) => {
        return this$.#rt.watch().isWatched(rec.id());
      });
      if (!recs.isEmpty()) {
        sub.send(this.makeObservation(sys.DateTime.now(), haystack.Etc.makeDict2("subType", "watch", "recs", recs)));
      }
      ;
    }
    ;
    return sub;
  }

  fireWatch(recs) {
    this.fire("watch", recs);
    return;
  }

  fireUnwatch(recs) {
    this.fire("unwatch", recs);
    return;
  }

  fire(subType,recs) {
    const this$ = this;
    let ts = sys.DateTime.now();
    this.subscriptions().each(sys.ObjUtil.coerce((sub) => {
      let matches = ((this$) => { if (sub.filter() == null) return recs; return recs.findAll((rec) => {
        return sub.include(rec);
      }); })(this$);
      if (matches.isEmpty()) {
        return;
      }
      ;
      let $obs = this$.makeObservation(ts, haystack.Etc.makeDict2("subType", subType, "recs", matches));
      sub.send($obs);
      return;
    }, sys.Type.find("|obs::Subscription,sys::Int->sys::Void|")));
    return null;
  }

}

class WatchesSubscription extends obs.RecSubscription {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return WatchesSubscription.type$; }

  static make(observable,observer,config) {
    const $self = new WatchesSubscription();
    WatchesSubscription.make$($self,observable,observer,config);
    return $self;
  }

  static make$($self,observable,observer,config) {
    obs.RecSubscription.make$($self, observable, observer, config);
    return;
  }

}

class CurValsObservable extends obs.Observable {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CurValsObservable.type$; }

  name() {
    return "obsCurVals";
  }

  onSubscribe(observer,config) {
    return CurValsSubscription.make(this, observer, config);
  }

  static make() {
    const $self = new CurValsObservable();
    CurValsObservable.make$($self);
    return $self;
  }

  static make$($self) {
    obs.Observable.make$($self);
    return;
  }

}

class CurValsSubscription extends obs.RecSubscription {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CurValsSubscription.type$; }

  static make(observable,observer,config) {
    const $self = new CurValsSubscription();
    CurValsSubscription.make$($self,observable,observer,config);
    return $self;
  }

  static make$($self,observable,observer,config) {
    obs.RecSubscription.make$($self, observable, observer, config);
    return;
  }

}

class HisWritesObservable extends obs.Observable {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisWritesObservable.type$; }

  name() {
    return "obsHisWrites";
  }

  onSubscribe(observer,config) {
    return HisWritesSubscription.make(this, observer, config);
  }

  static make() {
    const $self = new HisWritesObservable();
    HisWritesObservable.make$($self);
    return $self;
  }

  static make$($self) {
    obs.Observable.make$($self);
    return;
  }

}

class HisWritesSubscription extends obs.RecSubscription {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisWritesSubscription.type$; }

  static make(observable,observer,config) {
    const $self = new HisWritesSubscription();
    HisWritesSubscription.make$($self,observable,observer,config);
    return $self;
  }

  static make$($self,observable,observer,config) {
    obs.RecSubscription.make$($self, observable, observer, config);
    return;
  }

}

class HxdFileService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdFileService.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  static make(rt) {
    const $self = new HxdFileService();
    HxdFileService.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    $self.#rt = rt;
    return;
  }

  resolve(uri) {
    if (sys.Str.contains(uri.toStr(), "..")) {
      throw sys.UnsupportedErr.make(sys.Str.plus("Uri must not contain '..' path: ", uri));
    }
    ;
    if (!sys.Str.startsWith(uri.toStr(), "io/")) {
      throw sys.UnsupportedErr.make("Only io/ paths supportted");
    }
    ;
    let file = this.#rt.dir().plus(uri);
    if (!sys.Str.startsWith(file.normalize().pathStr(), this.#rt.dir().normalize().pathStr())) {
      throw sys.UnsupportedErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Uri not under ", this.#rt.dir()), " dir: "), uri));
    }
    ;
    return HxdFile.makeNew(this, uri, file);
  }

}

class HxdFile extends sys.File {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdFile.type$; }

  #service = null;

  service() { return this.#service; }

  __service(it) { if (it === undefined) return this.#service; else this.#service = it; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #modified = null;

  modified(it) {
    if (it === undefined) {
      return this.#file.modified();
    }
    else {
      this.#file.modified(it);
      return;
    }
  }

  static makeNew(service,uri,file) {
    const $self = new HxdFile();
    HxdFile.makeNew$($self,service,uri,file);
    return $self;
  }

  static makeNew$($self,service,uri,file) {
    sys.File.makeNew$($self, uri);
    $self.#service = service;
    $self.#file = file;
    return;
  }

  exists() {
    return this.#file.exists();
  }

  size() {
    return this.#file.size();
  }

  isEmpty() {
    return this.#file.isEmpty();
  }

  isHidden() {
    return this.#file.isHidden();
  }

  isReadable() {
    return this.#file.isReadable();
  }

  isWritable() {
    return this.#file.isWritable();
  }

  isExecutable() {
    return this.#file.isExecutable();
  }

  osPath() {
    return null;
  }

  normalize() {
    return this;
  }

  parent() {
    try {
      let parentUri = this.uri().parent();
      if (parentUri != null) {
        return this.#service.resolve(sys.ObjUtil.coerce(parentUri, sys.Uri.type$));
      }
      ;
    }
    catch ($_u7) {
      $_u7 = sys.Err.make($_u7);
      if ($_u7 instanceof sys.Err) {
        let e = $_u7;
        ;
      }
      else {
        throw $_u7;
      }
    }
    ;
    return null;
  }

  list(pattern) {
    if (pattern === undefined) pattern = null;
    const this$ = this;
    if (!this.uri().isDir()) {
      return sys.List.make(sys.File.type$);
    }
    ;
    return sys.ObjUtil.coerce(this.#file.list(pattern).mapNotNull((kid) => {
      let kidUri = this$.uri().plusName(kid.name());
      if (kid.isDir()) {
        (kidUri = kidUri.plusSlash());
      }
      ;
      let kidWrap = this$.#service.resolve(kidUri);
      return ((this$) => { if (kidWrap.exists()) return kidWrap; return null; })(this$);
    }, sys.File.type$.toNullable()), sys.Type.find("sys::File[]"));
  }

  plus(path,checkSlash) {
    if (checkSlash === undefined) checkSlash = true;
    return this.#service.resolve(this.uri().plus(path));
  }

  toLocal() {
    if (sys.ObjUtil.equals(sys.ObjUtil.typeof(this.#file).name(), "LocalFile")) {
      return this.#file;
    }
    ;
    throw sys.Err.make(sys.Str.plus("Not a local file: ", this.uri()));
  }

  create() {
    return this.#file.create();
  }

  moveTo(to) {
    return this.#file.moveTo(sys.ObjUtil.coerce(((this$) => { let $_u9 = ((this$) => { let $_u10 = sys.ObjUtil.as(to, HxdFile.type$); if ($_u10 == null) return null; return sys.ObjUtil.as(to, HxdFile.type$).toLocal(); })(this$); if ($_u9 != null) return $_u9; return to; })(this), sys.File.type$));
  }

  delete() {
    if (!this.exists()) {
      return;
    }
    ;
    this.#file.delete();
    return;
  }

  deleteOnExit() {
    throw sys.IOErr.make("Unsupported");
  }

  open(mode) {
    if (mode === undefined) mode = "rw";
    throw sys.UnsupportedErr.make();
  }

  mmap(mode,pos,size) {
    if (mode === undefined) mode = "rw";
    if (pos === undefined) pos = 0;
    if (size === undefined) size = null;
    throw sys.UnsupportedErr.make();
  }

  in(bufferSize) {
    if (bufferSize === undefined) bufferSize = sys.ObjUtil.coerce(4096, sys.Int.type$.toNullable());
    return this.#file.in(bufferSize);
  }

  out(append,bufferSize) {
    if (append === undefined) append = false;
    if (bufferSize === undefined) bufferSize = sys.ObjUtil.coerce(4096, sys.Int.type$.toNullable());
    return this.#file.out(append, bufferSize);
  }

}

class HxdWatchService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdWatchService.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #db = null;

  db() { return this.#db; }

  __db(it) { if (it === undefined) return this.#db; else this.#db = it; }

  #byId = null;

  byId() { return this.#byId; }

  __byId(it) { if (it === undefined) return this.#byId; else this.#byId = it; }

  static make(rt) {
    const $self = new HxdWatchService();
    HxdWatchService.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    $self.#rt = rt;
    $self.#db = sys.ObjUtil.coerce(rt.db(), hxFolio.HxFolio.type$);
    $self.#byId = concurrent.ConcurrentMap.make();
    return;
  }

  list() {
    return sys.ObjUtil.coerce(this.#byId.vals(HxdWatch.type$), sys.Type.find("hxd::HxdWatch[]"));
  }

  listOn(id) {
    const this$ = this;
    let acc = sys.List.make(HxdWatch.type$);
    this.#byId.each(sys.ObjUtil.coerce((w) => {
      if (w.refs().get(id) != null) {
        acc.add(w);
      }
      ;
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    return acc;
  }

  get(id,checked) {
    if (checked === undefined) checked = true;
    let w = this.#byId.get(id);
    if (w != null) {
      return sys.ObjUtil.coerce(w, HxdWatch.type$.toNullable());
    }
    ;
    if (checked) {
      throw hx.UnknownWatchErr.make(id);
    }
    ;
    return null;
  }

  open(dis) {
    let w = HxdWatch.make(this, dis);
    this.#byId.add(w.id(), w);
    return w;
  }

  isWatched(id) {
    let rec = this.#db.rec(id, false);
    return (rec != null && sys.ObjUtil.compareGT(rec.numWatches().val(), 0));
  }

  checkExpires() {
    const this$ = this;
    let toExpire = sys.List.make(HxdWatch.type$);
    let now = sys.Duration.now();
    this.#byId.each(sys.ObjUtil.coerce((w) => {
      if (sys.ObjUtil.compareLT(w.lastRenew().plus(w.lease()), now)) {
        toExpire.add(w);
      }
      ;
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    toExpire.each((w) => {
      w.close();
      return;
    });
    return;
  }

  debugGrid() {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.addCol("id").addCol("dis").addCol("age").addCol("lastRenew").addCol("lastPoll").addCol("size");
    let watches = this.list();
    watches.sort((a,b) => {
      return sys.ObjUtil.compare(a.created(), b.created());
    });
    watches.each((watch) => {
      gb.addRow(sys.List.make(sys.Obj.type$.toNullable(), [haystack.Ref.fromStr(watch.id()), watch.dis(), haystack.Etc.debugDur(sys.ObjUtil.coerce(watch.created(), sys.Obj.type$.toNullable())), haystack.Etc.debugDur(sys.ObjUtil.coerce(watch.lastRenew().ticks(), sys.Obj.type$.toNullable())), haystack.Etc.debugDur(sys.ObjUtil.coerce(watch.lastPoll().ticks(), sys.Obj.type$.toNullable())), haystack.Number.makeInt(watch.refs().size())]));
      return;
    });
    return gb.toGrid();
  }

}

class HxdWatch extends hx.HxWatch {
  constructor() {
    super();
    const this$ = this;
    this.#lastPollRef = concurrent.AtomicRef.make(sys.Duration.defVal());
    this.#lastRenewRef = concurrent.AtomicRef.make(sys.Duration.now());
    this.#leaseRef = concurrent.AtomicRef.make(sys.Duration.fromStr("1min"));
    this.#closedRef = concurrent.AtomicBool.make(false);
    return;
  }

  typeof() { return HxdWatch.type$; }

  #service = null;

  service() { return this.#service; }

  __service(it) { if (it === undefined) return this.#service; else this.#service = it; }

  #dis = null;

  dis() { return this.#dis; }

  __dis(it) { if (it === undefined) return this.#dis; else this.#dis = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #created = 0;

  created() { return this.#created; }

  __created(it) { if (it === undefined) return this.#created; else this.#created = it; }

  #refs = null;

  refs() { return this.#refs; }

  __refs(it) { if (it === undefined) return this.#refs; else this.#refs = it; }

  #lastPollRef = null;

  // private field reflection only
  __lastPollRef(it) { if (it === undefined) return this.#lastPollRef; else this.#lastPollRef = it; }

  #lastRenewRef = null;

  // private field reflection only
  __lastRenewRef(it) { if (it === undefined) return this.#lastRenewRef; else this.#lastRenewRef = it; }

  #lease = null;

  lease(it) {
    if (it === undefined) {
      return sys.ObjUtil.coerce(this.#leaseRef.val(), sys.Duration.type$);
    }
    else {
      this.#leaseRef.val(it.min(sys.Duration.fromStr("1hr")));
      return;
    }
  }

  #leaseRef = null;

  // private field reflection only
  __leaseRef(it) { if (it === undefined) return this.#leaseRef; else this.#leaseRef = it; }

  #closedRef = null;

  // private field reflection only
  __closedRef(it) { if (it === undefined) return this.#closedRef; else this.#closedRef = it; }

  static make(service,dis) {
    const $self = new HxdWatch();
    HxdWatch.make$($self,service,dis);
    return $self;
  }

  static make$($self,service,dis) {
    hx.HxWatch.make$($self);
    ;
    $self.#service = service;
    $self.#dis = dis;
    $self.#id = sys.Str.plus("w-", haystack.Ref.gen().id());
    $self.#created = sys.Duration.nowTicks();
    $self.#refs = concurrent.ConcurrentMap.make();
    return;
  }

  rt() {
    return this.#service.rt();
  }

  list() {
    this.checkOpen();
    return sys.ObjUtil.coerce(this.#refs.keys(haystack.Ref.type$), sys.Type.find("haystack::Ref[]"));
  }

  isEmpty() {
    return this.#refs.isEmpty();
  }

  lastPoll() {
    return sys.ObjUtil.coerce(this.#lastPollRef.val(), sys.Duration.type$);
  }

  lastRenew() {
    return sys.ObjUtil.coerce(this.#lastRenewRef.val(), sys.Duration.type$);
  }

  poll(t) {
    if (t === undefined) t = this.lastPoll();
    const this$ = this;
    this.checkOpen();
    let now = sys.Duration.now();
    this.#lastPollRef.val(now);
    this.#lastRenewRef.val(now);
    let acc = sys.List.make(haystack.Dict.type$);
    this.#refs.each(sys.ObjUtil.coerce((r) => {
      if (!r.ok()) {
        return;
      }
      ;
      let rec = this$.#service.db().rec(r.id(), false);
      if ((rec != null && sys.ObjUtil.compareGT(rec.ticks(), t.ticks()))) {
        acc.add(rec.dict());
      }
      ;
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    return acc;
  }

  renew() {
    this.checkOpen();
    this.#lastRenewRef.val(sys.Duration.now());
    return;
  }

  addAll(ids) {
    const this$ = this;
    this.renew();
    let cx = folio.FolioContext.curFolio(false);
    let firstRecs = null;
    ids.each((id) => {
      if (this$.#refs.get(id) != null) {
        return;
      }
      ;
      let rec = this$.#service.db().rec(id, false);
      let ok = (rec != null && (cx == null || cx.canRead(rec.dict())));
      this$.#refs.set(id, HxdWatchRef.make(id, ok));
      if (ok) {
        let firstWatch = sys.ObjUtil.equals(rec.numWatches().getAndIncrement(), 0);
        if (firstWatch) {
          if (firstRecs == null) {
            (firstRecs = sys.List.make(haystack.Dict.type$));
          }
          ;
          firstRecs.add(rec.dict());
        }
        ;
      }
      ;
      return;
    });
    if (firstRecs != null) {
      this.rt().obs().watches().fireWatch(sys.ObjUtil.coerce(firstRecs, sys.Type.find("haystack::Dict[]")));
    }
    ;
    return;
  }

  removeAll(ids) {
    const this$ = this;
    this.renew();
    let lastRecs = null;
    ids.each((id) => {
      let wr = sys.ObjUtil.as(this$.#refs.remove(id), HxdWatchRef.type$);
      if ((wr == null || !wr.ok())) {
        return;
      }
      ;
      let rec = this$.#service.db().rec(id, false);
      if (rec != null) {
        let lastWatch = sys.ObjUtil.equals(rec.numWatches().decrementAndGet(), 0);
        if (lastWatch) {
          if (lastRecs == null) {
            (lastRecs = sys.List.make(haystack.Dict.type$));
          }
          ;
          lastRecs.add(rec.dict());
        }
        ;
      }
      ;
      return;
    });
    if (lastRecs != null) {
      this.rt().obs().watches().fireUnwatch(sys.ObjUtil.coerce(lastRecs, sys.Type.find("haystack::Dict[]")));
    }
    ;
    return;
  }

  set(ids) {
    const this$ = this;
    let toAdd = sys.List.make(haystack.Ref.type$);
    let toRemove = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Ref"));
    this.#refs.each(sys.ObjUtil.coerce((val,id) => {
      toRemove.set(id, id);
      return;
    }, sys.Type.find("|sys::Obj,sys::Obj->sys::Void|")));
    ids.each((id) => {
      if (this$.#refs.get(id) != null) {
        toRemove.remove(id);
      }
      else {
        toAdd.add(id);
      }
      ;
      return;
    });
    this.addAll(toAdd);
    this.removeAll(toRemove.vals());
    return;
  }

  isClosed() {
    return this.#closedRef.val();
  }

  checkOpen() {
    if (this.isClosed()) {
      throw hx.WatchClosedErr.make(this.#id);
    }
    ;
    return;
  }

  close() {
    this.removeAll(this.list());
    this.#closedRef.val(true);
    this.#service.byId().remove(this.#id);
    return;
  }

}

class HxdWatchRef extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdWatchRef.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #ok = false;

  ok() { return this.#ok; }

  __ok(it) { if (it === undefined) return this.#ok; else this.#ok = it; }

  static make(id,ok) {
    const $self = new HxdWatchRef();
    HxdWatchRef.make$($self,id,ok);
    return $self;
  }

  static make$($self,id,ok) {
    $self.#id = id;
    $self.#ok = ok;
    return;
  }

}

class HxdTestSpi extends hx.HxTestSpi {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdTestSpi.type$; }

  static make(test) {
    const $self = new HxdTestSpi();
    HxdTestSpi.make$($self,test);
    return $self;
  }

  static make$($self,test) {
    hx.HxTestSpi.make$($self, test);
    return;
  }

  static boot(dir,projMeta) {
    if (projMeta === undefined) projMeta = haystack.Etc.emptyDict();
    const this$ = this;
    let boot = sys.ObjUtil.coerce(sys.ObjUtil.with(HxdBoot.make(), (it) => {
      it.dir(dir);
      it.projMeta(projMeta);
      it.create(true);
      it.config().set("test", haystack.Marker.val());
      it.config().set("platformSerialSpi", "hxPlatformSerial::TestSerialSpi");
      it.requiredLibs().remove("http");
      it.log().level(sys.LogLevel.warn());
      return;
    }), HxdBoot.type$);
    return boot.init().start();
  }

  start(projMeta) {
    return HxdTestSpi.boot(this.test().tempDir(), projMeta);
  }

  stop(rt) {
    sys.ObjUtil.coerce(rt, HxdRuntime.type$).stop();
    return;
  }

  addLib(libName,tags) {
    const this$ = this;
    let rt = sys.ObjUtil.coerce(this.test().rt(), HxdRuntime.type$);
    if (rt.lib(libName, false) != null) {
      return sys.ObjUtil.coerce(rt.lib(libName), hx.HxLib.type$);
    }
    ;
    let lib = rt.installed().lib(libName);
    lib.depends().each((d) => {
      this$.addLib(d, sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")));
      return;
    });
    return rt.libs().add(libName, haystack.Etc.makeDict(tags));
  }

  addUser(user,pass,tags) {
    return sys.ObjUtil.coerce(sys.Slot.findMethod("hxUser::HxUserUtil.addUser").call(this.test().rt().db(), user, pass, tags), hx.HxUser.type$);
  }

  makeContext(user) {
    if (user == null) {
      (user = this.test().rt().user().makeSyntheticUser("test", sys.Map.__fromLiteral(["userRole"], ["su"], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"))));
    }
    ;
    return HxdContext.make(sys.ObjUtil.coerce(this.test().rt(), HxdRuntime.type$), sys.ObjUtil.coerce(user, hx.HxUser.type$), null);
  }

  forceSteadyState(rt) {
    sys.ObjUtil.coerce(this.test().rt(), HxdRuntime.type$).backgroundMgr().forceSteadyState();
    return;
  }

}

class HxdBackgroundMgr extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#checkMsg = hx.HxMsg.make0("check");
    this.#forceSteadyStateMsg = hx.HxMsg.make0("forceSteadyState");
    this.#freq = sys.Duration.fromStr("100ms");
    this.#startTicks = concurrent.AtomicInt.make(0);
    return;
  }

  typeof() { return HxdBackgroundMgr.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #checkMsg = null;

  checkMsg() { return this.#checkMsg; }

  __checkMsg(it) { if (it === undefined) return this.#checkMsg; else this.#checkMsg = it; }

  #forceSteadyStateMsg = null;

  forceSteadyStateMsg() { return this.#forceSteadyStateMsg; }

  __forceSteadyStateMsg(it) { if (it === undefined) return this.#forceSteadyStateMsg; else this.#forceSteadyStateMsg = it; }

  #freq = null;

  freq() { return this.#freq; }

  __freq(it) { if (it === undefined) return this.#freq; else this.#freq = it; }

  #startTicks = null;

  startTicks() { return this.#startTicks; }

  __startTicks(it) { if (it === undefined) return this.#startTicks; else this.#startTicks = it; }

  static make(rt) {
    const $self = new HxdBackgroundMgr();
    HxdBackgroundMgr.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    concurrent.Actor.make$($self, rt.hxdActorPool());
    ;
    $self.#rt = rt;
    return;
  }

  start() {
    this.#startTicks.val(sys.Duration.nowTicks());
    this.send(this.#checkMsg);
    return;
  }

  forceSteadyState() {
    this.send(this.#forceSteadyStateMsg).get(sys.Duration.fromStr("1sec"));
    return;
  }

  receive(msg) {
    if (!this.#rt.isRunning()) {
      return null;
    }
    ;
    if (msg === this.#checkMsg) {
      return this.onCheck();
    }
    ;
    if (msg === this.#forceSteadyStateMsg) {
      return this.onForceSteadyState();
    }
    ;
    throw sys.Err.make(sys.Str.plus("Unknown msg: ", msg));
  }

  onCheck() {
    this.sendLater(this.#freq, this.#checkMsg);
    this.checkSteadyState();
    let now = sys.DateTime.now(null);
    this.#rt.nowRef().val(now);
    this.#rt.obs().schedule().check(now);
    this.#rt.watch().checkExpires();
    return null;
  }

  onForceSteadyState() {
    this.transitionToSteadyState();
    return null;
  }

  checkSteadyState() {
    if (this.#rt.isSteadyState()) {
      return;
    }
    ;
    let config = this.steadyStateConfig();
    let elapsed = sys.Int.minus(sys.Duration.nowTicks(), this.#startTicks.val());
    if (sys.ObjUtil.compareGE(elapsed, config.ticks())) {
      this.transitionToSteadyState();
    }
    ;
    return;
  }

  transitionToSteadyState() {
    const this$ = this;
    this.#rt.log().info("Steady state");
    this.#rt.stateStateRef().val(true);
    this.#rt.libs().list().each((lib) => {
      sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$).steadyState();
      return;
    });
    return;
  }

  steadyStateConfig() {
    let x = null;
    try {
      (x = ((this$) => { let $_u11 = sys.ObjUtil.as(this$.#rt.meta().get("steadyState"), haystack.Number.type$); if ($_u11 == null) return null; return sys.ObjUtil.as(this$.#rt.meta().get("steadyState"), haystack.Number.type$).toDuration(); })(this));
    }
    catch ($_u12) {
      $_u12 = sys.Err.make($_u12);
      if ($_u12 instanceof sys.Err) {
        let e = $_u12;
        ;
      }
      else {
        throw $_u12;
      }
    }
    ;
    if (x == null) {
      (x = sys.Duration.fromStr("10sec"));
    }
    ;
    if (sys.ObjUtil.compareGT(x, sys.Duration.fromStr("1hr"))) {
      (x = sys.Duration.fromStr("1hr"));
    }
    ;
    return sys.ObjUtil.coerce(x, sys.Duration.type$);
  }

}

class HxdRuntimeLibs extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#listRef = concurrent.AtomicRef.make(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.List.make(hx.HxLib.type$)), sys.Type.find("hx::HxLib[]")));
    this.#mapRef = concurrent.AtomicRef.make(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hx::HxLib"))), sys.Type.find("[sys::Str:hx::HxLib]")));
    return;
  }

  typeof() { return HxdRuntimeLibs.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #actorPool = null;

  actorPool() { return this.#actorPool; }

  __actorPool(it) { if (it === undefined) return this.#actorPool; else this.#actorPool = it; }

  #required = null;

  required() { return this.#required; }

  __required(it) { if (it === undefined) return this.#required; else this.#required = it; }

  #listRef = null;

  // private field reflection only
  __listRef(it) { if (it === undefined) return this.#listRef; else this.#listRef = it; }

  #mapRef = null;

  // private field reflection only
  __mapRef(it) { if (it === undefined) return this.#mapRef; else this.#mapRef = it; }

  static make(rt,required) {
    const $self = new HxdRuntimeLibs();
    HxdRuntimeLibs.make$($self,rt,required);
    return $self;
  }

  static make$($self,rt,required) {
    concurrent.Actor.make$($self, rt.libsActorPool());
    ;
    $self.#rt = rt;
    $self.#required = sys.ObjUtil.coerce(((this$) => { let $_u13 = required; if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(required); })($self), sys.Type.find("sys::Str[]"));
    $self.#actorPool = $self.pool();
    return;
  }

  init(removeUnknown) {
    const this$ = this;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hx::HxLib"));
    let installed = this.#rt.installed();
    this.#rt.db().readAllList(haystack.Filter.has("ext")).each((rec) => {
      try {
        let name = sys.ObjUtil.coerce(rec.trap("ext", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
        let install = installed.lib(name);
        let lib = HxdLibSpi.instantiate(this$.#rt, sys.ObjUtil.coerce(install, HxdInstalledLib.type$), rec);
        map.add(name, lib);
      }
      catch ($_u14) {
        $_u14 = sys.Err.make($_u14);
        if ($_u14 instanceof haystack.UnknownLibErr) {
          let e = $_u14;
          ;
          if (removeUnknown) {
            this$.#rt.log().err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Removing unknown lib: ", rec.id().toCode()), " ["), rec.trap("ext", sys.List.make(sys.Obj.type$.toNullable(), []))), "]"));
            try {
              this$.#rt.db().commit(folio.Diff.make(rec, null, sys.Int.or(folio.Diff.remove(), folio.Diff.bypassRestricted())));
            }
            catch ($_u15) {
              $_u15 = sys.Err.make($_u15);
              if ($_u15 instanceof sys.Err) {
                let e2 = $_u15;
                ;
                this$.#rt.log().err("Remove failed", e);
              }
              else {
                throw $_u15;
              }
            }
            ;
          }
          else {
            this$.#rt.log().err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Lib not installed: ", rec.id().toCode()), " ["), rec.trap("ext", sys.List.make(sys.Obj.type$.toNullable(), []))), "]"));
          }
          ;
        }
        else if ($_u14 instanceof sys.Err) {
          let e = $_u14;
          ;
          this$.#rt.log().err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot init lib: ", rec.id().toCode()), " ["), rec.trap("ext", sys.List.make(sys.Obj.type$.toNullable(), []))), "]"), e);
        }
        else {
          throw $_u14;
        }
      }
      ;
      return;
    });
    map.dup().each((lib) => {
      try {
        let install = sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$).install();
        let unmet = install.depends().findAll((d) => {
          return !map.containsKey(d);
        });
        if (unmet.isEmpty()) {
          return;
        }
        ;
        let err = haystack.DependErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.Str.toCode(lib.name())), " unmet depends: "), unmet));
        this$.#rt.log().info(sys.Str.plus("Disabling lib with unmet depends: ", lib.name()), err);
        map.remove(lib.name());
      }
      catch ($_u16) {
        $_u16 = sys.Err.make($_u16);
        if ($_u16 instanceof sys.Err) {
          let e = $_u16;
          ;
          this$.#rt.log().err(sys.Str.plus("Depend check failed: ", lib.name()), e);
        }
        else {
          throw $_u16;
        }
      }
      ;
      return;
    });
    let list = sys.List.make(hx.HxLib.type$);
    map.each((lib) => {
      list.add(lib);
      return;
    });
    list.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    this.#listRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(list), sys.Type.find("hx::HxLib[]")));
    this.#mapRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(map), sys.Type.find("[sys::Str:hx::HxLib]")));
    this.#rt.servicesRebuild();
    return;
  }

  list() {
    return sys.ObjUtil.coerce(this.#listRef.val(), sys.Type.find("hx::HxLib[]"));
  }

  has(name) {
    return this.map().containsKey(name);
  }

  get(name,checked) {
    if (checked === undefined) checked = true;
    let lib = this.map().get(name);
    if (lib != null) {
      return lib;
    }
    ;
    if (checked) {
      throw haystack.UnknownLibErr.make(name);
    }
    ;
    return null;
  }

  map() {
    return sys.ObjUtil.coerce(this.#mapRef.val(), sys.Type.find("[sys::Str:hx::HxLib]"));
  }

  getType(type,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let lib = this.list().find((lib) => {
      return sys.ObjUtil.typeof(lib).fits(type);
    });
    if (lib != null) {
      return lib;
    }
    ;
    if (checked) {
      throw haystack.UnknownLibErr.make(type.qname());
    }
    ;
    return null;
  }

  add(name,tags) {
    if (tags === undefined) tags = haystack.Etc.emptyDict();
    let install = this.#rt.installed().lib(name);
    if (tags.missing("dis")) {
      (tags = haystack.Etc.dictSet(tags, "dis", sys.Str.plus("lib:", name)));
    }
    ;
    return sys.ObjUtil.coerce(this.send(hx.HxMsg.make2("add", install, tags)).get(null), hx.HxLib.type$);
  }

  remove(arg) {
    let lib = null;
    if (sys.ObjUtil.is(arg, hx.HxLib.type$)) {
      (lib = sys.ObjUtil.coerce(arg, hx.HxLib.type$.toNullable()));
      if (lib.rt() !== this.#rt) {
        throw sys.ArgErr.make("HxLib has different rt");
      }
      ;
    }
    else {
      if (sys.ObjUtil.is(arg, haystack.Lib.type$)) {
        (lib = this.get(sys.ObjUtil.coerce(arg, haystack.Lib.type$).name()));
      }
      else {
        if (sys.ObjUtil.is(arg, sys.Str.type$)) {
          (lib = this.get(sys.ObjUtil.coerce(arg, sys.Str.type$), false));
          if (lib == null) {
            let rec = this.#rt.db().read(haystack.Filter.eq("ext", sys.ObjUtil.toStr(arg)), false);
            if (rec == null) {
              throw haystack.UnknownLibErr.make(sys.ObjUtil.toStr(arg));
            }
            ;
            this.#rt.db().commit(folio.Diff.make(rec, null, sys.Int.or(folio.Diff.remove(), folio.Diff.bypassRestricted())));
            return;
          }
          ;
        }
        else {
          throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid arg type for libRemove: ", arg), " ("), sys.ObjUtil.typeof(arg)), ")"));
        }
        ;
      }
      ;
    }
    ;
    this.send(hx.HxMsg.make1("remove", lib.name())).get(null);
    return;
  }

  status() {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.addCol("name").addCol("libStatus").addCol("statusMsg");
    this.list().each((lib) => {
      let spi = sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$);
      gb.addRow(sys.List.make(sys.Str.type$.toNullable(), [lib.name(), spi.status(), spi.statusMsg()]));
      return;
    });
    return gb.toGrid();
  }

  receive(arg) {
    let msg = sys.ObjUtil.coerce(arg, hx.HxMsg.type$);
    let $_u17 = msg.id();
    if (sys.ObjUtil.equals($_u17, "add")) {
      return this.onAdd(sys.ObjUtil.coerce(msg.a(), HxdInstalledLib.type$), sys.ObjUtil.coerce(msg.b(), haystack.Dict.type$));
    }
    else if (sys.ObjUtil.equals($_u17, "remove")) {
      return this.onRemove(sys.ObjUtil.coerce(msg.a(), sys.Str.type$));
    }
    else {
      throw sys.ArgErr.make(sys.Str.plus("Unsupported msg: ", msg));
    }
    ;
  }

  onAdd(install,extraTags) {
    const this$ = this;
    let name = install.name();
    let dup = this.get(name, false);
    if (dup != null) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus("HxLib ", sys.Str.toCode(name)), " already exists"));
    }
    ;
    install.depends().each((d) => {
      if (this$.get(d, false) == null) {
        throw haystack.DependErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("HxLib ", sys.Str.toCode(name)), " missing dependency on "), sys.Str.toCode(d)));
      }
      ;
      return;
    });
    this.#rt.log().info(sys.Str.plus("Add lib: ", name));
    let tags = haystack.Etc.dictToMap(extraTags);
    tags.set("ext", name);
    let rec = this.#rt.db().commit(folio.Diff.make(null, tags, sys.Int.or(folio.Diff.add(), folio.Diff.bypassRestricted()))).newRec();
    let lib = HxdLibSpi.instantiate(this.#rt, install, sys.ObjUtil.coerce(rec, haystack.Dict.type$));
    this.#listRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.list().dup().add(lib).sort((x,y) => {
      return sys.ObjUtil.compare(x.name(), y.name());
    })), sys.Type.find("hx::HxLib[]")));
    this.#mapRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.map().dup().add(name, lib)), sys.Type.find("[sys::Str:hx::HxLib]")));
    this.onModified();
    this.#rt.obs().addLib(lib);
    let spi = sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$);
    spi.start();
    spi.ready();
    if (this.#rt.isSteadyState()) {
      spi.steadyState();
    }
    ;
    return lib;
  }

  onRemove(name) {
    const this$ = this;
    let lib = this.get(name);
    let $def = lib.def();
    this.list().each((x) => {
      if (x.def().depends().any((symbol) => {
        return sys.ObjUtil.equals(symbol.name(), name);
      })) {
        throw haystack.DependErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("HxLib ", sys.Str.toCode(x.name())), " has dependency on "), sys.Str.toCode(name)));
      }
      ;
      return;
    });
    this.#rt.obs().removeLib(sys.ObjUtil.coerce(lib, hx.HxLib.type$));
    let spi = sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$);
    spi.unready();
    spi.stop();
    this.#rt.log().info(sys.Str.plus("Remove lib: ", name));
    this.#rt.db().commit(folio.Diff.make(lib.rec(), null, sys.Int.or(folio.Diff.remove(), folio.Diff.bypassRestricted())));
    this.#listRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.ObjUtil.with(this.list().dup(), (it) => {
      it.removeSame(sys.ObjUtil.coerce(lib, hx.HxLib.type$));
      return;
    }), sys.Type.find("hx::HxLib[]"))), sys.Type.find("hx::HxLib[]")));
    this.#mapRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(sys.ObjUtil.with(this.map().dup(), (it) => {
      it.remove(name);
      return;
    }), sys.Type.find("[sys::Str:hx::HxLib]"))), sys.Type.find("[sys::Str:hx::HxLib]")));
    this.onModified();
    return sys.Str.plus("removed: ", name);
  }

  onModified() {
    this.#rt.nsBaseRecompile();
    this.#rt.servicesRebuild();
    return;
  }

}

class HxdRuntime extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nsBaseRef = concurrent.AtomicRef.make();
    this.#nsOverlayRef = concurrent.AtomicRef.make();
    this.#servicesRef = concurrent.AtomicRef.make(null);
    this.#stateStateRef = concurrent.AtomicBool.make(false);
    this.#nowRef = concurrent.AtomicRef.make(sys.DateTime.now());
    this.#shutdownHook = sys.ObjUtil.coerce(((this$) => { let $_u18 = () => {
      this$.stop();
      return;
    }; if ($_u18 == null) return null; return sys.ObjUtil.toImmutable(() => {
      this$.stop();
      return;
    }); })(this), sys.Type.find("|->sys::Void|"));
    this.#isRunningRef = concurrent.AtomicBool.make();
    this.#isStarted = concurrent.AtomicBool.make();
    this.#isStopped = concurrent.AtomicBool.make();
    return;
  }

  typeof() { return HxdRuntime.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #platform = null;

  platform() { return this.#platform; }

  __platform(it) { if (it === undefined) return this.#platform; else this.#platform = it; }

  #config = null;

  config() { return this.#config; }

  __config(it) { if (it === undefined) return this.#config; else this.#config = it; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #nsBaseRef = null;

  // private field reflection only
  __nsBaseRef(it) { if (it === undefined) return this.#nsBaseRef; else this.#nsBaseRef = it; }

  #nsOverlayRef = null;

  // private field reflection only
  __nsOverlayRef(it) { if (it === undefined) return this.#nsOverlayRef; else this.#nsOverlayRef = it; }

  #db = null;

  db() { return this.#db; }

  __db(it) { if (it === undefined) return this.#db; else this.#db = it; }

  #metaRef = null;

  metaRef() { return this.#metaRef; }

  __metaRef(it) { if (it === undefined) return this.#metaRef; else this.#metaRef = it; }

  #servicesRef = null;

  // private field reflection only
  __servicesRef(it) { if (it === undefined) return this.#servicesRef; else this.#servicesRef = it; }

  #context = null;

  context() { return this.#context; }

  __context(it) { if (it === undefined) return this.#context; else this.#context = it; }

  #obs = null;

  obs() { return this.#obs; }

  __obs(it) { if (it === undefined) return this.#obs; else this.#obs = it; }

  #watch = null;

  watch() { return this.#watch; }

  __watch(it) { if (it === undefined) return this.#watch; else this.#watch = it; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #his = null;

  his() { return this.#his; }

  __his(it) { if (it === undefined) return this.#his; else this.#his = it; }

  #libs = null;

  libs() { return this.#libs; }

  __libs(it) { if (it === undefined) return this.#libs; else this.#libs = it; }

  #stateStateRef = null;

  stateStateRef() { return this.#stateStateRef; }

  __stateStateRef(it) { if (it === undefined) return this.#stateStateRef; else this.#stateStateRef = it; }

  #libsActorPool = null;

  libsActorPool() { return this.#libsActorPool; }

  __libsActorPool(it) { if (it === undefined) return this.#libsActorPool; else this.#libsActorPool = it; }

  #hxdActorPool = null;

  hxdActorPool() { return this.#hxdActorPool; }

  __hxdActorPool(it) { if (it === undefined) return this.#hxdActorPool; else this.#hxdActorPool = it; }

  #backgroundMgr = null;

  backgroundMgr() { return this.#backgroundMgr; }

  __backgroundMgr(it) { if (it === undefined) return this.#backgroundMgr; else this.#backgroundMgr = it; }

  #installedRef = null;

  // private field reflection only
  __installedRef(it) { if (it === undefined) return this.#installedRef; else this.#installedRef = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #nowRef = null;

  nowRef() { return this.#nowRef; }

  __nowRef(it) { if (it === undefined) return this.#nowRef; else this.#nowRef = it; }

  #shutdownHook = null;

  shutdownHook() { return this.#shutdownHook; }

  __shutdownHook(it) { if (it === undefined) return this.#shutdownHook; else this.#shutdownHook = it; }

  #isRunningRef = null;

  // private field reflection only
  __isRunningRef(it) { if (it === undefined) return this.#isRunningRef; else this.#isRunningRef = it; }

  #isStarted = null;

  // private field reflection only
  __isStarted(it) { if (it === undefined) return this.#isStarted; else this.#isStarted = it; }

  #isStopped = null;

  // private field reflection only
  __isStopped(it) { if (it === undefined) return this.#isStopped; else this.#isStopped = it; }

  static make(boot) {
    const $self = new HxdRuntime();
    HxdRuntime.make$($self,boot);
    return $self;
  }

  static make$($self,boot) {
    const this$ = $self;
    ;
    $self.#name = haystack.Etc.toTagName(sys.ObjUtil.coerce(((this$) => { let $_u19 = boot.name(); if ($_u19 != null) return $_u19; return boot.dir().name(); })($self), sys.Str.type$));
    $self.#version = boot.version();
    $self.#platform = sys.ObjUtil.coerce(boot.platformRef(), hx.HxPlatform.type$);
    $self.#config = hx.HxConfig.make(haystack.Etc.makeDict(boot.config()));
    $self.#dir = sys.ObjUtil.coerce(boot.dir(), sys.File.type$);
    $self.#db = sys.ObjUtil.coerce(boot.db(), folio.Folio.type$);
    $self.#db.hooks(HxdFolioHooks.make($self));
    $self.#log = boot.log();
    $self.#metaRef = concurrent.AtomicRef.make(boot.projMeta());
    $self.#installedRef = concurrent.AtomicRef.make(HxdInstalled.build());
    $self.#libsActorPool = concurrent.ActorPool.make((it) => {
      it.__name("Hxd-Lib");
      return;
    });
    $self.#hxdActorPool = concurrent.ActorPool.make((it) => {
      it.__name("Hxd-Runtime");
      return;
    });
    $self.#libs = HxdRuntimeLibs.make($self, boot.requiredLibs());
    $self.#backgroundMgr = HxdBackgroundMgr.make($self);
    $self.#context = HxdContextService.make($self);
    $self.#watch = HxdWatchService.make($self);
    $self.#obs = HxdObsService.make($self);
    $self.#file = HxdFileService.make($self);
    $self.#his = HxdHisService.make($self);
    return;
  }

  init(boot) {
    this.#libs.init(boot.removeUnknownLibs());
    this.#obs.init();
    return this;
  }

  dis() {
    return sys.ObjUtil.coerce(((this$) => { let $_u20 = this$.meta().get("dis"); if ($_u20 != null) return $_u20; return this$.#name; })(this), sys.Str.type$);
  }

  ns() {
    let overlay = sys.ObjUtil.as(this.#nsOverlayRef.val(), haystack.Namespace.type$);
    if (overlay == null) {
      let base = sys.ObjUtil.as(this.#nsBaseRef.val(), haystack.Namespace.type$);
      if (base == null) {
        this.#nsBaseRef.val((base = HxdDefCompiler.make(this).compileNamespace()));
      }
      ;
      this.#nsOverlayRef.val((overlay = HxdOverlayCompiler.make(this, sys.ObjUtil.coerce(base, haystack.Namespace.type$)).compileNamespace()));
    }
    ;
    return sys.ObjUtil.coerce(overlay, haystack.Namespace.type$);
  }

  nsBaseRecompile() {
    this.#nsBaseRef.val(null);
    this.#nsOverlayRef.val(null);
    return;
  }

  nsOverlayRecompile() {
    this.#nsOverlayRef.val(null);
    return;
  }

  meta() {
    return sys.ObjUtil.coerce(this.#metaRef.val(), haystack.Dict.type$);
  }

  services() {
    return sys.ObjUtil.coerce(((this$) => { let $_u21 = this$.#servicesRef.val(); if ($_u21 != null) return $_u21; throw sys.Err.make("Services not avail yet"); })(this), HxdServiceRegistry.type$);
  }

  servicesRebuild() {
    this.#servicesRef.val(HxdServiceRegistry.make(this, this.#libs.list()));
    return;
  }

  crypto() {
    return this.services().crypto();
  }

  http() {
    return this.services().http();
  }

  user() {
    return this.services().user();
  }

  io() {
    return this.services().io();
  }

  task() {
    return this.services().task();
  }

  pointWrite() {
    return this.services().pointWrite();
  }

  conn() {
    return this.services().conn();
  }

  lib(name,checked) {
    if (checked === undefined) checked = true;
    return this.#libs.get(name, checked);
  }

  isSteadyState() {
    return this.#stateStateRef.val();
  }

  sync(timeout) {
    if (timeout === undefined) timeout = sys.Duration.fromStr("30sec");
    this.#db.sync(timeout);
    this.#obs.sync(timeout);
    return this;
  }

  installed() {
    return sys.ObjUtil.coerce(this.#installedRef.val(), HxdInstalled.type$);
  }

  now() {
    return sys.ObjUtil.coerce(this.#nowRef.val(), sys.DateTime.type$);
  }

  isRunning() {
    return this.#isRunningRef.val();
  }

  start() {
    const this$ = this;
    if (this.#isStarted.getAndSet(true)) {
      return this;
    }
    ;
    this.#isRunningRef.val(true);
    let futures = this.#libs.list().map((lib) => {
      return sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$).start();
    }, concurrent.Future.type$);
    concurrent.Future.waitForAll(sys.ObjUtil.coerce(futures, sys.Type.find("concurrent::Future[]")));
    (futures = this.#libs.list().map((lib) => {
      return sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$).ready();
    }, concurrent.Future.type$));
    concurrent.Future.waitForAll(sys.ObjUtil.coerce(futures, sys.Type.find("concurrent::Future[]")));
    this.#backgroundMgr.start();
    return this;
  }

  stop() {
    const this$ = this;
    if (this.#isStopped.getAndSet(true)) {
      return this;
    }
    ;
    this.#isRunningRef.val(false);
    let futures = this.#libs.list().map((lib) => {
      return sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$).unready();
    }, concurrent.Future.type$);
    concurrent.Future.waitForAll(sys.ObjUtil.coerce(futures, sys.Type.find("concurrent::Future[]")));
    (futures = this.#libs.list().map((lib) => {
      return sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$).stop();
    }, concurrent.Future.type$));
    concurrent.Future.waitForAll(sys.ObjUtil.coerce(futures, sys.Type.find("concurrent::Future[]")));
    this.#libsActorPool.kill();
    this.#hxdActorPool.kill();
    return;
  }

}

class HxdServiceRegistry extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdServiceRegistry.type$; }

  #list = null;

  list() { return this.#list; }

  __list(it) { if (it === undefined) return this.#list; else this.#list = it; }

  #context = null;

  context() { return this.#context; }

  __context(it) { if (it === undefined) return this.#context; else this.#context = it; }

  #obs = null;

  obs() { return this.#obs; }

  __obs(it) { if (it === undefined) return this.#obs; else this.#obs = it; }

  #watch = null;

  watch() { return this.#watch; }

  __watch(it) { if (it === undefined) return this.#watch; else this.#watch = it; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #his = null;

  his() { return this.#his; }

  __his(it) { if (it === undefined) return this.#his; else this.#his = it; }

  #crypto = null;

  crypto() { return this.#crypto; }

  __crypto(it) { if (it === undefined) return this.#crypto; else this.#crypto = it; }

  #httpRef = null;

  // private field reflection only
  __httpRef(it) { if (it === undefined) return this.#httpRef; else this.#httpRef = it; }

  #user = null;

  user() { return this.#user; }

  __user(it) { if (it === undefined) return this.#user; else this.#user = it; }

  #ioRef = null;

  // private field reflection only
  __ioRef(it) { if (it === undefined) return this.#ioRef; else this.#ioRef = it; }

  #taskRef = null;

  // private field reflection only
  __taskRef(it) { if (it === undefined) return this.#taskRef; else this.#taskRef = it; }

  #pointWrite = null;

  pointWrite() { return this.#pointWrite; }

  __pointWrite(it) { if (it === undefined) return this.#pointWrite; else this.#pointWrite = it; }

  #conn = null;

  conn() { return this.#conn; }

  __conn(it) { if (it === undefined) return this.#conn; else this.#conn = it; }

  #map = null;

  // private field reflection only
  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  static make(rt,libs) {
    const $self = new HxdServiceRegistry();
    HxdServiceRegistry.make$($self,rt,libs);
    return $self;
  }

  static make$($self,rt,libs) {
    const this$ = $self;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Type"), sys.Type.find("hx::HxService[]"));
    let serviceType = hx.HxService.type$;
    libs.each((lib) => {
      lib.services().each((service) => {
        sys.ObjUtil.typeof(service).inheritance().each((t) => {
          if (t.mixins().containsSame(serviceType)) {
            let bucket = map.get(t);
            if (bucket == null) {
              map.set(t, sys.ObjUtil.coerce((bucket = sys.List.make(hx.HxService.type$)), sys.Type.find("hx::HxService[]")));
            }
            ;
            bucket.add(service);
          }
          ;
          return;
        });
        return;
      });
      return;
    });
    map.set(hx.HxContextService.type$, sys.List.make(hx.HxService.type$, [rt.context()]));
    map.set(hx.HxObsService.type$, sys.List.make(hx.HxService.type$, [rt.obs()]));
    map.set(hx.HxWatchService.type$, sys.List.make(hx.HxService.type$, [rt.watch()]));
    map.set(hx.HxFileService.type$, sys.List.make(hx.HxService.type$, [rt.file()]));
    map.set(hx.HxHisService.type$, sys.List.make(hx.HxService.type$, [rt.his()]));
    if (map.get(hx.HxHttpService.type$) == null) {
      map.set(hx.HxHttpService.type$, sys.List.make(hx.HxService.type$, [hx.NilHttpService.make()]));
    }
    ;
    if (map.get(hx.HxPointWriteService.type$) == null) {
      map.set(hx.HxPointWriteService.type$, sys.List.make(hx.HxService.type$, [hx.NilPointWriteService.make()]));
    }
    ;
    if (map.get(hx.HxConnService.type$) == null) {
      map.set(hx.HxConnService.type$, sys.List.make(hx.HxService.type$, [hx.NilConnService.make()]));
    }
    ;
    $self.#list = sys.ObjUtil.coerce(((this$) => { let $_u22 = map.keys().sort(); if ($_u22 == null) return null; return sys.ObjUtil.toImmutable(map.keys().sort()); })($self), sys.Type.find("sys::Type[]"));
    $self.#map = sys.ObjUtil.coerce(((this$) => { let $_u23 = map; if ($_u23 == null) return null; return sys.ObjUtil.toImmutable(map); })($self), sys.Type.find("[sys::Type:hx::HxService[]]"));
    $self.#context = sys.ObjUtil.coerce($self.get(hx.HxContextService.type$), HxdContextService.type$);
    $self.#obs = sys.ObjUtil.coerce($self.get(hx.HxObsService.type$), HxdObsService.type$);
    $self.#watch = sys.ObjUtil.coerce($self.get(hx.HxWatchService.type$), hx.HxWatchService.type$);
    $self.#crypto = sys.ObjUtil.coerce($self.get(hx.HxCryptoService.type$), hx.HxCryptoService.type$);
    $self.#httpRef = sys.ObjUtil.coerce($self.get(hx.HxHttpService.type$, false), hx.HxHttpService.type$.toNullable());
    $self.#user = sys.ObjUtil.coerce($self.get(hx.HxUserService.type$), hx.HxUserService.type$);
    $self.#ioRef = sys.ObjUtil.coerce($self.get(hx.HxIOService.type$, false), hx.HxIOService.type$.toNullable());
    $self.#file = sys.ObjUtil.coerce($self.get(hx.HxFileService.type$), hx.HxFileService.type$);
    $self.#taskRef = sys.ObjUtil.coerce($self.get(hx.HxTaskService.type$, false), hx.HxTaskService.type$.toNullable());
    $self.#his = sys.ObjUtil.coerce($self.get(hx.HxHisService.type$), hx.HxHisService.type$);
    $self.#pointWrite = sys.ObjUtil.coerce($self.get(hx.HxPointWriteService.type$), hx.HxPointWriteService.type$);
    $self.#conn = sys.ObjUtil.coerce($self.get(hx.HxConnService.type$), hx.HxConnService.type$);
    return;
  }

  http() {
    return sys.ObjUtil.coerce(((this$) => { let $_u24 = this$.#httpRef; if ($_u24 != null) return $_u24; throw sys.UnknownServiceErr.make("HxHttpService"); })(this), hx.HxHttpService.type$);
  }

  io() {
    return sys.ObjUtil.coerce(((this$) => { let $_u25 = this$.#ioRef; if ($_u25 != null) return $_u25; throw sys.UnknownServiceErr.make("HxIOService"); })(this), hx.HxIOService.type$);
  }

  task() {
    return sys.ObjUtil.coerce(((this$) => { let $_u26 = this$.#taskRef; if ($_u26 != null) return $_u26; throw sys.UnknownServiceErr.make("HxTaskService"); })(this), hx.HxTaskService.type$);
  }

  get(type,checked) {
    if (checked === undefined) checked = true;
    let x = this.#map.get(type);
    if (x != null) {
      return x.first();
    }
    ;
    if (checked) {
      throw sys.UnknownServiceErr.make(type.qname());
    }
    ;
    return null;
  }

  getAll(type) {
    return sys.ObjUtil.coerce(((this$) => { let $_u27 = this$.#map.get(type); if ($_u27 != null) return $_u27; return hx.HxService.type$.emptyList(); })(this), sys.Type.find("hx::HxService[]"));
  }

}

class HxdHisService extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdHisService.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  static make(rt) {
    const $self = new HxdHisService();
    HxdHisService.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    $self.#rt = rt;
    return;
  }

  read(pt,span,opts,f) {
    this.#rt.db().his().read(pt.id(), span, opts, f);
    return;
  }

  write(pt,items,opts) {
    if (opts === undefined) opts = null;
    return this.#rt.db().his().write(pt.id(), items, opts);
  }

}

class HxdDefCompiler extends defc.DefCompiler {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdDefCompiler.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  static make(rt) {
    const $self = new HxdDefCompiler();
    HxdDefCompiler.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    const this$ = $self;
    defc.DefCompiler.make$($self);
    $self.#rt = rt;
    $self.log(rt.log());
    $self.factory(HxdDefFactory.make());
    $self.inputs(sys.ObjUtil.coerce(rt.libs().list().map((lib) => {
      return HxdLibInput.make(lib);
    }, HxdLibInput.type$), sys.Type.find("defc::CompilerInput[]")));
    return;
  }

}

class HxdDefFactory extends def.DefFactory {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdDefFactory.type$; }

  createFeature(b) {
    let $_u28 = b.name();
    if (sys.ObjUtil.equals($_u28, "func")) {
      return FuncFeature.make(b);
    }
    else {
      return def.DefFactory.prototype.createFeature.call(this, b);
    }
    ;
  }

  static make() {
    const $self = new HxdDefFactory();
    HxdDefFactory.make$($self);
    return $self;
  }

  static make$($self) {
    def.DefFactory.make$($self);
    return;
  }

}

class FuncFeature extends def.MFeature {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FuncFeature.type$; }

  static make(b) {
    const $self = new FuncFeature();
    FuncFeature.make$($self,b);
    return $self;
  }

  static make$($self,b) {
    def.MFeature.make$($self, b);
    return;
  }

  defType() {
    return FuncDef.type$;
  }

  createDef(b) {
    let src = sys.ObjUtil.as(b.meta().get("src"), sys.Str.type$);
    if ((src != null && b.meta().has("nosrc"))) {
      (b = def.BDef.make(b.symbol(), b.libRef(), haystack.Etc.dictRemove(b.meta(), "src"), b.aux()));
    }
    ;
    return FuncDef.make(b, src);
  }

  createUnknownErr(name) {
    return haystack.UnknownFuncErr.make(name);
  }

}

class FuncDef extends def.MDef {
  constructor() {
    super();
    const this$ = this;
    this.#exprRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return FuncDef.type$; }

  #src = null;

  // private field reflection only
  __src(it) { if (it === undefined) return this.#src; else this.#src = it; }

  #exprRef = null;

  // private field reflection only
  __exprRef(it) { if (it === undefined) return this.#exprRef; else this.#exprRef = it; }

  static make(b,src) {
    const $self = new FuncDef();
    FuncDef.make$($self,b,src);
    return $self;
  }

  static make$($self,b,src) {
    def.MDef.make$($self, b);
    ;
    $self.#src = src;
    $self.#exprRef.val(b.aux());
    return;
  }

  expr() {
    let fn = this.#exprRef.val();
    if (fn == null) {
      this.#exprRef.val((fn = this.parseExpr()));
    }
    ;
    return sys.ObjUtil.coerce(fn, axon.Fn.type$);
  }

  parseExpr() {
    if (this.#src == null) {
      throw sys.Err.make(sys.Str.plus("Func missing src: ", this));
    }
    ;
    return axon.Parser.make(axon.Loc.make(sys.Str.plus(sys.Str.plus(this.lib().name(), "::"), this.name())), sys.Str.in(this.#src)).parseTop(this.name(), this);
  }

}

class HxdLibInput extends defc.LibInput {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdLibInput.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #spi = null;

  spi() { return this.#spi; }

  __spi(it) { if (it === undefined) return this.#spi; else this.#spi = it; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #install = null;

  install() { return this.#install; }

  __install(it) { if (it === undefined) return this.#install; else this.#install = it; }

  #metaFile = null;

  metaFile() { return this.#metaFile; }

  __metaFile(it) { if (it === undefined) return this.#metaFile; else this.#metaFile = it; }

  static make(lib) {
    const $self = new HxdLibInput();
    HxdLibInput.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    defc.LibInput.make$($self);
    $self.#name = lib.name();
    $self.#lib = lib;
    $self.#spi = sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$);
    $self.#install = $self.#spi.install();
    $self.#metaFile = $self.#install.metaFile();
    $self.#loc = sys.ObjUtil.coerce(defc.CLoc.makeFile($self.#spi.install().metaFile()), defc.CLoc.type$);
    return;
  }

  pod() {
    return this.#install.pod();
  }

  scanMeta(c) {
    return this.#install.meta();
  }

  scanFiles(c) {
    const this$ = this;
    return this.pod().files().findAll((file) => {
      if (sys.ObjUtil.compareNE(file.ext(), "trio")) {
        return false;
      }
      ;
      if (sys.ObjUtil.equals(file.name(), "lib.trio")) {
        return false;
      }
      ;
      if (!this$.isUnderLibDir(file)) {
        return false;
      }
      ;
      if ((sys.ObjUtil.equals(file.name(), "skyarc.trio") && sys.ObjUtil.compareNE(this$.#name, "hx"))) {
        return false;
      }
      ;
      return true;
    });
  }

  isUnderLibDir(file) {
    let path = file.uri().path();
    if ((sys.ObjUtil.compareNE(path.size(), 2) && sys.ObjUtil.compareNE(path.size(), 3))) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(path.get(0), "lib")) {
      return false;
    }
    ;
    if ((sys.ObjUtil.equals(path.size(), 3) && sys.ObjUtil.compareNE(path.get(1), this.#name))) {
      return false;
    }
    ;
    return true;
  }

  scanReflects(c) {
    let typeName = sys.ObjUtil.as(this.#install.meta().get("typeName"), sys.Str.type$);
    if (typeName != null) {
      let funcsType = sys.Type.find(sys.Str.plus(sys.Str.getRange(typeName, sys.Range.make(0, -4)), "Funcs"), false);
      if (funcsType != null) {
        return sys.List.make(FuncMethodsReflectInput.type$, [FuncMethodsReflectInput.make(sys.ObjUtil.coerce(funcsType, sys.Type.type$), null)]);
      }
      ;
    }
    ;
    if (sys.ObjUtil.equals(this.#name, "axon")) {
      return sys.List.make(FuncMethodsReflectInput.type$, [FuncMethodsReflectInput.make(axon.CoreLib.type$, null)]);
    }
    ;
    if (sys.ObjUtil.equals(this.#name, "hx")) {
      return sys.List.make(FuncMethodsReflectInput.type$, [FuncMethodsReflectInput.make(hx.HxCoreFuncs.type$, null)]);
    }
    ;
    return sys.ObjUtil.coerce(defc.ReflectInput.type$.emptyList(), sys.Type.find("defc::ReflectInput[]"));
  }

}

class FuncReflectInput extends defc.ReflectInput {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FuncReflectInput.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #instanceRef = null;

  instanceRef() { return this.#instanceRef; }

  __instanceRef(it) { if (it === undefined) return this.#instanceRef; else this.#instanceRef = it; }

  static make(type,instanceRef) {
    const $self = new FuncReflectInput();
    FuncReflectInput.make$($self,type,instanceRef);
    return $self;
  }

  static make$($self,type,instanceRef) {
    defc.ReflectInput.make$($self);
    $self.#type = type;
    $self.#instanceRef = instanceRef;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this)), " "), this.#type);
  }

  addMeta(symbol,acc) {
    acc.set("func", haystack.Marker.val());
    acc.set("name", symbol.name());
    return;
  }

}

class FuncMethodsReflectInput extends FuncReflectInput {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FuncMethodsReflectInput.type$; }

  static make(type,instanceRef) {
    const $self = new FuncMethodsReflectInput();
    FuncMethodsReflectInput.make$($self,type,instanceRef);
    return $self;
  }

  static make$($self,type,instanceRef) {
    FuncReflectInput.make$($self, type, instanceRef);
    return;
  }

  methodFacet() {
    return axon.Axon.type$;
  }

  toSymbol(slot) {
    return sys.ObjUtil.coerce(haystack.Symbol.fromStr(sys.Str.plus("func:", axon.FantomFn.toName(sys.ObjUtil.coerce(slot, sys.Method.type$)))), haystack.Symbol.type$);
  }

  onDef(slot,$def) {
    $def.aux(axon.FantomFn.reflectMethod(sys.ObjUtil.coerce(slot, sys.Method.type$), $def.name(), $def.declared(), this.instanceRef()));
    return;
  }

}

class HxdOverlayCompiler extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdOverlayCompiler.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #base = null;

  base() { return this.#base; }

  __base(it) { if (it === undefined) return this.#base; else this.#base = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #libSymbol = null;

  libSymbol() { return this.#libSymbol; }

  __libSymbol(it) { if (it === undefined) return this.#libSymbol; else this.#libSymbol = it; }

  static make(rt,base) {
    const $self = new HxdOverlayCompiler();
    HxdOverlayCompiler.make$($self,rt,base);
    return $self;
  }

  static make$($self,rt,base) {
    $self.#rt = rt;
    $self.#base = base;
    $self.#log = rt.log();
    $self.#libSymbol = sys.ObjUtil.coerce(haystack.Symbol.fromStr("lib:hx_db"), haystack.Symbol.type$);
    return;
  }

  compileNamespace() {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.set("def", this.#libSymbol);
    acc.set("baseUri", this.#rt.http().siteUri().plus(sys.Uri.fromStr("def/hx_db/")));
    acc.set("version", this.#rt.version().toStr());
    let meta = haystack.Etc.makeDict(acc);
    let b = def.BOverlayLib.make(this.#base, meta);
    this.#rt.db().readAll(haystack.Filter.has("def")).each((rec) => {
      this$.addRecDef(b, rec);
      return;
    });
    return def.MOverlayNamespace.make(this.#base, def.MOverlayLib.make(b), HxdXetoGetter.make(this.#rt), (lib) => {
      return true;
    });
  }

  addRecDef(b,rec) {
    const this$ = this;
    let symbol = sys.ObjUtil.as(rec.get("def"), haystack.Symbol.type$);
    if (symbol == null) {
      return this.err(sys.Str.plus(sys.Str.plus("Invalid def symbol '", rec.trap("def", sys.List.make(sys.Obj.type$.toNullable(), []))), "'"), rec);
    }
    ;
    try {
      if (b.isDup(symbol.toStr())) {
        return this.err(sys.Str.plus(sys.Str.plus("Duplicate defs '", symbol.toCode()), "'"), rec);
      }
      ;
      let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
      rec.each((v,n) => {
        acc.set(n, v);
        return;
      });
      acc.set("def", symbol);
      acc.set("lib", this.#libSymbol);
      let norm = haystack.Etc.makeDict(acc);
      if (this.checkOverrideErr(symbol.toStr(), rec)) {
        return;
      }
      ;
      b.addDef(norm);
    }
    catch ($_u29) {
      $_u29 = sys.Err.make($_u29);
      if ($_u29 instanceof sys.Err) {
        let e = $_u29;
        ;
        this.err(sys.Str.plus(sys.Str.plus("Invalid proj rec def '", symbol), "'"), rec, e);
      }
      else {
        throw $_u29;
      }
    }
    ;
    return;
  }

  checkOverrideErr(symbol,rec) {
    let x = this.#base.def(symbol, false);
    if (x == null) {
      return false;
    }
    ;
    if (x.has("overridable")) {
      return false;
    }
    ;
    this.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot override ", symbol), " from "), x.lib()), rec);
    return true;
  }

  err(msg,rec,err) {
    if (err === undefined) err = null;
    this.#log.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", msg), " ["), rec.id().toCode()), "]"), err);
    return;
  }

}

class HxdXetoGetter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return HxdXetoGetter.type$; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #get$Store = undefined;

  // private field reflection only
  __get$Store(it) { if (it === undefined) return this.#get$Store; else this.#get$Store = it; }

  static make(rt) {
    const $self = new HxdXetoGetter();
    HxdXetoGetter.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    ;
    $self.#rt = rt;
    return;
  }

  get() {
    if (this.#get$Store === undefined) {
      this.#get$Store = this.get$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#get$Store, xeto.LibNamespace.type$);
  }

  get$Once() {
    let usings = this.#rt.db().readAllList(haystack.Filter.has("using"));
    return xeto.LibNamespace.createSystemOverlay(usings, this.#rt.log());
  }

}

class HxdInstalled extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdInstalled.type$; }

  #map = null;

  // private field reflection only
  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  static build() {
    return HxdInstalled.make(HxdInstalledBuilder.make().build());
  }

  static make(b) {
    const $self = new HxdInstalled();
    HxdInstalled.make$($self,b);
    return $self;
  }

  static make$($self,b) {
    $self.#map = sys.ObjUtil.coerce(((this$) => { let $_u30 = b.map(); if ($_u30 == null) return null; return sys.ObjUtil.toImmutable(b.map()); })($self), sys.Type.find("[sys::Str:hxd::HxdInstalledLib]"));
    return;
  }

  lib(name,checked) {
    if (checked === undefined) checked = true;
    let lib = this.#map.get(name);
    if (lib != null) {
      return lib;
    }
    ;
    if (checked) {
      throw haystack.UnknownLibErr.make(sys.Str.plus("Lib not installed: ", name));
    }
    ;
    return null;
  }

  static main() {
    const this$ = this;
    let list = HxdInstalled.build().#map.vals().sort();
    list.each((x) => {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", x), " ["), x.pod()), "] depends:"), x.depends()));
      return;
    });
    return;
  }

}

class HxdInstalledLib extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdInstalledLib.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #pod = null;

  pod() { return this.#pod; }

  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  static make(name,pod,meta) {
    const $self = new HxdInstalledLib();
    HxdInstalledLib.make$($self,name,pod,meta);
    return $self;
  }

  static make$($self,name,pod,meta) {
    $self.#name = name;
    $self.#pod = pod;
    $self.#meta = meta;
    return;
  }

  type() {
    let typeName = sys.ObjUtil.as(this.#meta.get("typeName"), sys.Str.type$);
    if (typeName == null) {
      return null;
    }
    ;
    return sys.Type.find(sys.ObjUtil.coerce(typeName, sys.Str.type$));
  }

  depends() {
    const this$ = this;
    return sys.ObjUtil.coerce(haystack.Symbol.toList(this.#meta.get("depends")).map((x) => {
      if (!sys.Str.startsWith(x.toStr(), "lib:")) {
        throw sys.Err.make(sys.Str.plus("Invalid depend: ", x));
      }
      ;
      return x.name();
    }, sys.Str.type$), sys.Type.find("sys::Str[]"));
  }

  metaFile() {
    return sys.ObjUtil.coerce(this.#pod.file(sys.Uri.fromStr("/lib/lib.trio")), sys.File.type$);
  }

  toStr() {
    return this.#name;
  }

}

class HxdInstalledBuilder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#log = sys.Log.get("hxd");
    this.#map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("hxd::HxdInstalledLib"));
    return;
  }

  typeof() { return HxdInstalledBuilder.type$; }

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

  build() {
    let t1 = sys.Duration.now();
    this.mapPods();
    let t2 = sys.Duration.now();
    return this;
  }

  mapPods() {
    const this$ = this;
    sys.Env.cur().indexPodNames("ph.lib").each((podName) => {
      try {
        this$.mapPod(podName);
      }
      catch ($_u31) {
        $_u31 = sys.Err.make($_u31);
        if ($_u31 instanceof sys.Err) {
          let e = $_u31;
          ;
          this$.#log.err(sys.Str.plus(sys.Str.plus("Invalid pod ph.lib index [", podName), "]"), e);
        }
        else {
          throw $_u31;
        }
      }
      ;
      return;
    });
    return;
  }

  mapPod(podName) {
    const this$ = this;
    let pod = sys.Pod.find(podName);
    let index = pod.file(sys.Uri.fromStr("/index.props")).in().readPropsListVals();
    let libNames = index.get("ph.lib");
    libNames.each((libName) => {
      let dup = this$.#map.get(libName);
      if (dup != null) {
        this$.#log.err(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Duplicate ph.lib index for ", sys.Str.toCode(libName)), " ["), dup.pod().name()), ", "), pod.name()), "]"));
        return;
      }
      ;
      try {
        this$.#map.set(libName, this$.mapLib(libName, sys.ObjUtil.coerce(pod, sys.Pod.type$)));
      }
      catch ($_u32) {
        $_u32 = sys.Err.make($_u32);
        if ($_u32 instanceof sys.Err) {
          let e = $_u32;
          ;
          this$.#log.err(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot load installed lib ", sys.Str.toCode(libName)), " from pod "), sys.Str.toCode(podName)), e);
        }
        else {
          throw $_u32;
        }
      }
      ;
      return;
    });
    return;
  }

  mapLib(name,pod) {
    const this$ = this;
    let file = this.toMetaFile(name, pod);
    let dicts = haystack.TrioReader.make(file.in()).readAllDicts();
    if (sys.ObjUtil.compareNE(dicts.size(), 1)) {
      let defSymStr = sys.Str.plus("lib:", name);
      (dicts = dicts.findAll((m) => {
        return sys.ObjUtil.equals(((this$) => { let $_u33 = m.get("def"); if ($_u33 == null) return null; return sys.ObjUtil.toStr(m.get("def")); })(this$), defSymStr);
      }));
      if (sys.ObjUtil.compareNE(dicts.size(), 1)) {
        throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Lib meta '", defSymStr), "' not found ["), file), "]"));
      }
      ;
    }
    ;
    let meta = dicts.get(0);
    let symbol = ((this$) => { let $_u34 = sys.ObjUtil.as(meta.get("def"), haystack.Symbol.type$); if ($_u34 != null) return $_u34; throw sys.Err.make(sys.Str.plus(sys.Str.plus("Missing 'def' symbol [", file), "]")); })(this);
    if (sys.ObjUtil.compareNE(symbol.toStr(), sys.Str.plus("lib:", name))) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Mismatched 'def' symbol: '", symbol), "' != 'lib:"), name), "' ["), file), "]"));
    }
    ;
    (meta = this.normMeta(name, pod, meta));
    return HxdInstalledLib.make(name, pod, meta);
  }

  normMeta(name,pod,meta) {
    let acc = haystack.Etc.dictToMap(meta);
    if (acc.get("version") == null) {
      acc.set("version", pod.version().toStr());
    }
    ;
    if (acc.get("baseUri") == null) {
      let domain = pod.meta().get("proj.uri");
      if (domain == null) {
        (domain = pod.meta().get("org.uri"));
      }
      ;
      if (domain == null) {
        (domain = "http://localhost/");
      }
      ;
      acc.set("baseUri", sys.Str.toUri(domain).plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("/def/", name), "/"))));
    }
    ;
    if (sys.ObjUtil.is(acc.get("depends"), sys.Type.find("sys::List"))) {
      acc.set("depends", this.normDepends(sys.ObjUtil.coerce(acc.get("depends"), sys.Type.find("sys::Obj[]"))));
    }
    ;
    return haystack.Etc.makeDict(acc);
  }

  toMetaFile(name,pod) {
    return sys.ObjUtil.coerce(((this$) => { let $_u35 = pod.file(sys.Uri.fromStr("/lib/lib.trio"), false); if ($_u35 != null) return $_u35; throw sys.Err.make("Pod missing /lib/lib.trio"); })(this), sys.File.type$);
  }

  normDepends(depends) {
    const this$ = this;
    return depends.findAll((d) => {
      return sys.ObjUtil.compareNE(sys.ObjUtil.toStr(d), "lib:skyarc");
    });
  }

  static make() {
    const $self = new HxdInstalledBuilder();
    HxdInstalledBuilder.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class HxdFolioHooks extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdFolioHooks.type$; }

  xeto() { return folio.FolioHooks.prototype.xeto.apply(this, arguments); }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #db = null;

  db() { return this.#db; }

  __db(it) { if (it === undefined) return this.#db; else this.#db = it; }

  static make(rt) {
    const $self = new HxdFolioHooks();
    HxdFolioHooks.make$($self,rt);
    return $self;
  }

  static make$($self,rt) {
    $self.#rt = rt;
    $self.#db = rt.db();
    return;
  }

  ns(checked) {
    if (checked === undefined) checked = true;
    return this.#rt.ns();
  }

  preCommit(e) {
    let diff = e.diff();
    if (diff.isUpdate()) {
      if ((sys.ObjUtil.equals(diff.id(), this.#rt.meta().id()) && diff.changes().has("trash"))) {
        throw folio.CommitErr.make("Cannot trash projMeta rec");
      }
      ;
    }
    else {
      if (diff.isRemove()) {
        let rec = ((this$) => { let $_u36 = this$.#db.readById(diff.id(), false); if ($_u36 != null) return $_u36; return haystack.Etc.emptyDict(); })(this);
        if ((rec.has("ext") && !diff.isBypassRestricted())) {
          throw folio.CommitErr.make("Must use libRemove to remove lib rec");
        }
        ;
        if (sys.ObjUtil.equals(diff.id(), this.#rt.meta().id())) {
          throw folio.CommitErr.make("Cannot remove projMeta rec");
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  postCommit(e) {
    let diff = e.diff();
    if (diff.isTransient()) {
      if (diff.isCurVal()) {
        this.#rt.obs().curVal(diff);
      }
      ;
      return;
    }
    ;
    let user = sys.ObjUtil.as(e.cxInfo(), hx.HxUser.type$);
    if (diff.isUpdate()) {
      let newRec = diff.newRec();
      let libName = sys.ObjUtil.as(newRec.get("ext"), sys.Str.type$);
      if (libName != null) {
        let lib = this.#rt.libs().get(sys.ObjUtil.coerce(libName, sys.Str.type$), false);
        if (lib != null) {
          sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$).update(sys.ObjUtil.coerce(newRec, haystack.Dict.type$));
        }
        ;
      }
      ;
      if (sys.ObjUtil.equals(diff.id(), this.#rt.meta().id())) {
        this.#rt.metaRef().val(diff.newRec());
      }
      ;
    }
    ;
    if ((diff.getOld("def") != null || diff.getNew("def") != null)) {
      this.#rt.nsOverlayRecompile();
    }
    ;
    if ((diff.getOld("using") != null || diff.getNew("using") != null)) {
      this.#rt.nsBaseRecompile();
    }
    ;
    this.#rt.obs().commit(diff, user);
    return;
  }

  postHisWrite(e) {
    this.#rt.obs().hisWrite(e.rec(), e.result(), sys.ObjUtil.as(e.cxInfo(), hx.HxUser.type$));
    return;
  }

}

class HxdLibSpi extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#libRef = concurrent.AtomicRef.make();
    this.#statusRef = concurrent.AtomicRef.make("ok");
    this.#statusMsgRef = concurrent.AtomicRef.make(null);
    this.#subscriptionsRef = concurrent.AtomicRef.make(obs.Subscription.type$.emptyList());
    this.#isRunningRef = concurrent.AtomicBool.make(false);
    return;
  }

  typeof() { return HxdLibSpi.type$; }

  #libRef = null;

  // private field reflection only
  __libRef(it) { if (it === undefined) return this.#libRef; else this.#libRef = it; }

  #rt = null;

  rt() { return this.#rt; }

  __rt(it) { if (it === undefined) return this.#rt; else this.#rt = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #install = null;

  install() { return this.#install; }

  __install(it) { if (it === undefined) return this.#install; else this.#install = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #recRef = null;

  // private field reflection only
  __recRef(it) { if (it === undefined) return this.#recRef; else this.#recRef = it; }

  #log = null;

  log() { return this.#log; }

  __log(it) { if (it === undefined) return this.#log; else this.#log = it; }

  #webUri = null;

  webUri() { return this.#webUri; }

  __webUri(it) { if (it === undefined) return this.#webUri; else this.#webUri = it; }

  #statusRef = null;

  // private field reflection only
  __statusRef(it) { if (it === undefined) return this.#statusRef; else this.#statusRef = it; }

  #statusMsgRef = null;

  // private field reflection only
  __statusMsgRef(it) { if (it === undefined) return this.#statusMsgRef; else this.#statusMsgRef = it; }

  #subscriptionsRef = null;

  // private field reflection only
  __subscriptionsRef(it) { if (it === undefined) return this.#subscriptionsRef; else this.#subscriptionsRef = it; }

  #isRunningRef = null;

  // private field reflection only
  __isRunningRef(it) { if (it === undefined) return this.#isRunningRef; else this.#isRunningRef = it; }

  static #houseKeepingMsg = undefined;

  static houseKeepingMsg() {
    if (HxdLibSpi.#houseKeepingMsg === undefined) {
      HxdLibSpi.static$init();
      if (HxdLibSpi.#houseKeepingMsg === undefined) HxdLibSpi.#houseKeepingMsg = null;
    }
    return HxdLibSpi.#houseKeepingMsg;
  }

  static instantiate(rt,install,rec) {
    let spi = HxdLibSpi.make(rt, install, rec);
    concurrent.Actor.locals().set("hx.spi", spi);
    try {
      let lib = HxdLibSpi.doInstantiate(spi);
      spi.#libRef.val(lib);
      return lib;
    }
    finally {
      concurrent.Actor.locals().remove("hx.spi");
    }
    ;
  }

  static doInstantiate(spi) {
    return sys.ObjUtil.coerce(((this$) => { if (spi.#type == null) return ResHxLib.make(); return spi.#type.make(); })(this), hx.HxLib.type$);
  }

  static make(rt,install,rec) {
    const $self = new HxdLibSpi();
    HxdLibSpi.make$($self,rt,install,rec);
    return $self;
  }

  static make$($self,rt,install,rec) {
    concurrent.Actor.make$($self, rt.libsActorPool());
    ;
    $self.#rt = rt;
    $self.#name = install.name();
    $self.#install = install;
    $self.#type = install.type();
    $self.#log = sys.Log.get($self.#name);
    $self.#recRef = concurrent.AtomicRef.make($self.typedRec(rec));
    $self.#webUri = sys.Str.toUri(sys.Str.plus(sys.Str.plus("/", ((this$) => { if (sys.Str.startsWith(this$.#name, "hx")) return sys.Str.decapitalize(sys.Str.getRange(this$.#name, sys.Range.make(2, -1))); return this$.#name; })($self)), "/"));
    return;
  }

  lib() {
    return sys.ObjUtil.coerce(this.#libRef.val(), hx.HxLib.type$);
  }

  def() {
    return sys.ObjUtil.coerce(this.#rt.ns().lib(this.#name), haystack.Lib.type$);
  }

  rec() {
    return sys.ObjUtil.coerce(this.#recRef.val(), haystack.Dict.type$);
  }

  actor() {
    return this;
  }

  isFault() {
    return sys.ObjUtil.equals(this.status(), "fault");
  }

  toStatus(status,msg) {
    if (sys.ObjUtil.compareNE(status, "fault")) {
      throw sys.ArgErr.make("unsupported status");
    }
    ;
    this.#statusRef.val("fault");
    this.#statusMsgRef.val(msg);
    return;
  }

  status() {
    return sys.ObjUtil.coerce(this.#statusRef.val(), sys.Str.type$);
  }

  statusMsg() {
    return sys.ObjUtil.coerce(this.#statusMsgRef.val(), sys.Str.type$.toNullable());
  }

  subscriptions() {
    return sys.ObjUtil.coerce(this.#subscriptionsRef.val(), sys.Type.find("obs::Subscription[]"));
  }

  observe(name,config,callback) {
    let observer = ((this$) => { if (sys.ObjUtil.is(callback, concurrent.Actor.type$)) return HxdLibActorObserver.make(this$.lib(), sys.ObjUtil.coerce(callback, concurrent.Actor.type$)); return HxdLibMethodObserver.make(this$.lib(), sys.ObjUtil.coerce(callback, sys.Method.type$)); })(this);
    let sub = this.#rt.obs().get(name).subscribe(sys.ObjUtil.coerce(observer, obs.Observer.type$), config);
    this.#subscriptionsRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.subscriptions().dup().add(sub)), sys.Type.find("obs::Subscription[]")));
    return sub;
  }

  start() {
    return this.send(hx.HxMsg.make0("start"));
  }

  ready() {
    return this.send(hx.HxMsg.make0("ready"));
  }

  steadyState() {
    return this.send(hx.HxMsg.make0("steadyState"));
  }

  unready() {
    return this.send(hx.HxMsg.make0("unready"));
  }

  stop() {
    return this.send(hx.HxMsg.make0("stop"));
  }

  sync(timeout) {
    if (timeout === undefined) timeout = sys.Duration.fromStr("30sec");
    this.send(hx.HxMsg.make0("sync")).get(timeout);
    return;
  }

  update(rec) {
    this.#recRef.val(this.typedRec(rec));
    this.send(hx.HxMsg.make1("recUpdate", null));
    return;
  }

  typedRec(dict) {
    const this$ = this;
    if (this.#type == null) {
      return dict;
    }
    ;
    let recType = this.#type.method("rec").returns();
    if (sys.ObjUtil.equals(recType.name(), "Dict")) {
      return dict;
    }
    ;
    return haystack.TypedDict.create(recType, dict, (warn) => {
      this$.#log.warn(warn);
      return;
    });
  }

  receive(msgObj) {
    if (msgObj === HxdLibSpi.houseKeepingMsg()) {
      if (!this.isRunning()) {
        return null;
      }
      ;
      try {
        this.lib().onHouseKeeping();
      }
      catch ($_u40) {
        $_u40 = sys.Err.make($_u40);
        if ($_u40 instanceof sys.Err) {
          let e = $_u40;
          ;
          this.#log.err("HxLib.onHouseKeeping", e);
        }
        else {
          throw $_u40;
        }
      }
      ;
      this.scheduleHouseKeeping();
      return null;
    }
    ;
    let msg = ((this$) => { let $_u41 = sys.ObjUtil.as(msgObj, hx.HxMsg.type$); if ($_u41 != null) return $_u41; throw sys.ArgErr.make(sys.Str.plus("Invalid msg type: ", ((this$) => { let $_u42 = msgObj; if ($_u42 == null) return null; return sys.ObjUtil.typeof(msgObj); })(this$))); })(this);
    try {
      if (msg.id() === "obs") {
        return this.onObs(sys.ObjUtil.coerce(msg, hx.HxMsg.type$));
      }
      ;
      if (msg.id() === "sync") {
        return "synced";
      }
      ;
      if (msg.id() === "recUpdate") {
        return this.onRecUpdate();
      }
      ;
      if (msg.id() === "start") {
        return this.onStart();
      }
      ;
      if (msg.id() === "ready") {
        return this.onReady();
      }
      ;
      if (msg.id() === "steadyState") {
        return this.onSteadyState();
      }
      ;
      if (msg.id() === "unready") {
        return this.onUnready();
      }
      ;
      if (msg.id() === "stop") {
        return this.onStop();
      }
      ;
    }
    catch ($_u43) {
      $_u43 = sys.Err.make($_u43);
      if ($_u43 instanceof sys.Err) {
        let e = $_u43;
        ;
        this.#log.err("HxLib callback", e);
        throw e;
      }
      else {
        throw $_u43;
      }
    }
    ;
    return this.lib().onReceive(sys.ObjUtil.coerce(msg, hx.HxMsg.type$));
  }

  onStart() {
    this.#isRunningRef.val(true);
    try {
      this.lib().onStart();
    }
    catch ($_u44) {
      $_u44 = sys.Err.make($_u44);
      if ($_u44 instanceof sys.Err) {
        let e = $_u44;
        ;
        this.#log.err("HxLib.onStart", e);
        this.toStatus("fault", e.toStr());
      }
      else {
        throw $_u44;
      }
    }
    ;
    return null;
  }

  onReady() {
    this.scheduleHouseKeeping();
    this.lib().onReady();
    return null;
  }

  onSteadyState() {
    this.lib().onSteadyState();
    return null;
  }

  onUnready() {
    this.#isRunningRef.val(false);
    this.lib().onUnready();
    return null;
  }

  onStop() {
    this.lib().onStop();
    return null;
  }

  onRecUpdate() {
    this.lib().onRecUpdate();
    return null;
  }

  onObs(msg) {
    return sys.ObjUtil.coerce(msg.a(), HxdLibMethodObserver.type$).call(msg.b());
  }

  isRunning() {
    return this.#isRunningRef.val();
  }

  scheduleHouseKeeping() {
    let freq = this.lib().houseKeepingFreq();
    if (freq != null) {
      this.sendLater(sys.ObjUtil.coerce(freq, sys.Duration.type$), HxdLibSpi.houseKeepingMsg());
    }
    ;
    return;
  }

  static static$init() {
    HxdLibSpi.#houseKeepingMsg = hx.HxMsg.make0("houseKeeping");
    return;
  }

}

class ResHxLib extends hx.HxLib {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ResHxLib.type$; }

  static make() {
    const $self = new ResHxLib();
    ResHxLib.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxLib.make$($self);
    return;
  }

}

class HxdLibActorObserver extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdLibActorObserver.type$; }

  toActorMsg() { return obs.Observer.prototype.toActorMsg.apply(this, arguments); }

  toSyncMsg() { return obs.Observer.prototype.toSyncMsg.apply(this, arguments); }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #actor = null;

  actor() { return this.#actor; }

  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  static make(lib,actor) {
    const $self = new HxdLibActorObserver();
    HxdLibActorObserver.make$($self,lib,actor);
    return $self;
  }

  static make$($self,lib,actor) {
    $self.#lib = lib;
    $self.#actor = actor;
    $self.#meta = haystack.Etc.emptyDict();
    return;
  }

  toStr() {
    return sys.Str.plus("HxLib ", this.#lib.name());
  }

}

class HxdLibMethodObserver extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HxdLibMethodObserver.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #method = null;

  method() { return this.#method; }

  __method(it) { if (it === undefined) return this.#method; else this.#method = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #actor = null;

  actor() { return this.#actor; }

  __actor(it) { if (it === undefined) return this.#actor; else this.#actor = it; }

  static make(lib,method) {
    const $self = new HxdLibMethodObserver();
    HxdLibMethodObserver.make$($self,lib,method);
    return $self;
  }

  static make$($self,lib,method) {
    $self.#lib = lib;
    $self.#actor = sys.ObjUtil.coerce(lib.spi(), HxdLibSpi.type$);
    $self.#method = method;
    $self.#meta = haystack.Etc.emptyDict();
    return;
  }

  toActorMsg(msg) {
    return hx.HxMsg.make2("obs", this, msg);
  }

  toSyncMsg() {
    return hx.HxMsg.make0("sync");
  }

  toStr() {
    return sys.Str.plus("HxLib ", this.#lib.name());
  }

  call(msg) {
    try {
      this.#method.callOn(this.#lib, sys.List.make(sys.Obj.type$.toNullable(), [msg]));
    }
    catch ($_u45) {
      $_u45 = sys.Err.make($_u45);
      if ($_u45 instanceof sys.Err) {
        let e = $_u45;
        ;
        this.#lib.log().err(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(this.#lib)), ".observe"), e);
      }
      else {
        throw $_u45;
      }
    }
    ;
    return null;
  }

}

class HxdBoot extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#version = sys.ObjUtil.typeof(this).pod().version();
    this.#create = false;
    this.#log = sys.Log.get("hxd");
    this.#platform = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    this.#config = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj?"));
    this.#projMeta = haystack.Etc.emptyDict();
    this.#requiredLibs = sys.List.make(sys.Str.type$, ["ph", "phScience", "phIoT", "phIct", "hx", "obs", "axon", "xeto", "crypto", "http", "hxApi", "hxShell", "hxUser", "io", "task", "point"]);
    this.#removeUnknownLibs = false;
    return;
  }

  typeof() { return HxdBoot.type$; }

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

  #create = false;

  create(it) {
    if (it === undefined) {
      return this.#create;
    }
    else {
      this.#create = it;
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

  #platform = null;

  platform(it) {
    if (it === undefined) {
      return this.#platform;
    }
    else {
      this.#platform = it;
      return;
    }
  }

  #config = null;

  config(it) {
    if (it === undefined) {
      return this.#config;
    }
    else {
      this.#config = it;
      return;
    }
  }

  #projMeta = null;

  projMeta(it) {
    if (it === undefined) {
      return this.#projMeta;
    }
    else {
      this.#projMeta = it;
      return;
    }
  }

  #requiredLibs = null;

  requiredLibs(it) {
    if (it === undefined) {
      return this.#requiredLibs;
    }
    else {
      this.#requiredLibs = it;
      return;
    }
  }

  #removeUnknownLibs = false;

  removeUnknownLibs(it) {
    if (it === undefined) {
      return this.#removeUnknownLibs;
    }
    else {
      this.#removeUnknownLibs = it;
      return;
    }
  }

  #db = null;

  db(it) {
    if (it === undefined) {
      return this.#db;
    }
    else {
      this.#db = it;
      return;
    }
  }

  #rt = null;

  rt(it) {
    if (it === undefined) {
      return this.#rt;
    }
    else {
      this.#rt = it;
      return;
    }
  }

  #platformRef = null;

  platformRef(it) {
    if (it === undefined) {
      return this.#platformRef;
    }
    else {
      this.#platformRef = it;
      return;
    }
  }

  init() {
    if (this.#rt != null) {
      return sys.ObjUtil.coerce(this.#rt, HxdRuntime.type$);
    }
    ;
    this.initArgs();
    this.initWebMode();
    this.initPlatform();
    this.initLic();
    this.openDatabase();
    this.initMeta();
    this.initLibs();
    this.#rt = this.initRuntime();
    return sys.ObjUtil.coerce(this.#rt, HxdRuntime.type$);
  }

  run() {
    this.init();
    sys.Env.cur().addShutdownHook(this.#rt.shutdownHook());
    this.#rt.start();
    concurrent.Actor.sleep(sys.Duration.maxVal());
    return 0;
  }

  initArgs() {
    if (this.#dir == null) {
      throw sys.ArgErr.make("Must set 'dir' field");
    }
    ;
    if (!this.#dir.isDir()) {
      this.#dir = this.#dir.uri().plusSlash().toFile();
    }
    ;
    this.#dir = this.#dir.normalize();
    if (!this.#create) {
      if (!this.#dir.exists()) {
        throw sys.ArgErr.make(sys.Str.plus("Dir does not exist: ", this.#dir));
      }
      ;
      if (!this.#dir.plus(sys.Uri.fromStr("db/folio.index")).exists()) {
        throw sys.ArgErr.make(sys.Str.plus("Dir missing database files: ", this.#dir));
      }
      ;
    }
    ;
    if (this.#config.containsKey("noAuth")) {
      sys.ObjUtil.echo("##");
      sys.ObjUtil.echo("## NO AUTH - authentication is disabled!!!!");
      sys.ObjUtil.echo("##");
    }
    ;
    return;
  }

  initWebMode() {
    web.WebJsMode.setCur(web.WebJsMode.es());
    return;
  }

  initPlatform() {
    this.#platformRef = hx.HxPlatform.make(haystack.Etc.makeDict(this.#platform.findNotNull()));
    return;
  }

  initLic() {
    const this$ = this;
    if (this.#config.get("hxLic") != null) {
      return;
    }
    ;
    let file = this.#dir.plus(sys.Uri.fromStr("lic/")).listFiles().find((x) => {
      return sys.ObjUtil.equals(x.ext(), "trio");
    });
    if (file != null) {
      this.#config.set("hxLic", file.readAllStr());
    }
    ;
    return;
  }

  openDatabase() {
    const this$ = this;
    let config = folio.FolioConfig.make((it) => {
      it.__name("haxall");
      it.__dir(this$.#dir.plus(sys.Uri.fromStr("db/")));
      it.__pool(concurrent.ActorPool.make((it) => {
        it.__name("Hxd-Folio");
        return;
      }));
      return;
    });
    this.#db = hxFolio.HxFolio.open(config);
    return;
  }

  initMeta() {
    const this$ = this;
    let tags = sys.Map.__fromLiteral(["projMeta","version"], [haystack.Marker.val(),this.#version.toStr()], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    this.#projMeta.each((v,n) => {
      tags.set(n, v);
      return;
    });
    this.#projMeta = this.initRec("projMeta", this.#db.read(haystack.Filter.has("projMeta"), false), tags);
    return;
  }

  initLibs() {
    const this$ = this;
    this.#requiredLibs.each((libName) => {
      this$.initLib(libName);
      return;
    });
    return;
  }

  initLib(name) {
    let tags = sys.Map.__fromLiteral(["ext","dis"], [name,sys.Str.plus("lib:", name)], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    this.initRec(sys.Str.plus(sys.Str.plus("lib [", name), "]"), this.#db.read(haystack.Filter.eq("ext", name), false), tags);
    return;
  }

  initRec(summary,rec,changes) {
    if (changes === undefined) changes = sys.ObjUtil.coerce(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Obj"), sys.Type.find("sys::Obj?")), sys.Type.find("[sys::Str:sys::Obj]"));
    const this$ = this;
    if (rec == null) {
      this.#log.info(sys.Str.plus("Create ", summary));
      return sys.ObjUtil.coerce(this.#db.commit(folio.Diff.make(null, changes, sys.Int.or(folio.Diff.add(), folio.Diff.bypassRestricted()))).newRec(), haystack.Dict.type$);
    }
    else {
      (changes = changes.findAll((v,n) => {
        return sys.ObjUtil.compareNE(rec.get(n), v);
      }));
      if (changes.isEmpty()) {
        return sys.ObjUtil.coerce(rec, haystack.Dict.type$);
      }
      ;
      this.#log.info(sys.Str.plus("Update ", summary));
      return sys.ObjUtil.coerce(this.#db.commit(folio.Diff.make(rec, changes)).newRec(), haystack.Dict.type$);
    }
    ;
  }

  initRuntime() {
    return HxdRuntime.make(this).init(this);
  }

  static make() {
    const $self = new HxdBoot();
    HxdBoot.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class RunCli extends hx.HxCli {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RunCli.type$; }

  #noAuth = false;

  noAuth(it) {
    if (it === undefined) {
      return this.#noAuth;
    }
    else {
      this.#noAuth = it;
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

  name() {
    return "run";
  }

  summary() {
    return "Run the daemon server";
  }

  run() {
    const this$ = this;
    let boot = sys.ObjUtil.coerce(sys.ObjUtil.with(HxdBoot.make(), (it) => {
      it.dir(this$.#dir);
      return;
    }), HxdBoot.type$);
    if (this.#noAuth) {
      boot.config().set("noAuth", haystack.Marker.val());
    }
    ;
    return boot.run();
  }

  static make() {
    const $self = new RunCli();
    RunCli.make$($self);
    return $self;
  }

  static make$($self) {
    hx.HxCli.make$($self);
    return;
  }

}

const p = sys.Pod.add$('hxd');
const xp = sys.Param.noParams$();
let m;
HxdContextService.type$ = p.at$('HxdContextService','sys::Obj',['hx::HxContextService'],{},8194,HxdContextService);
HxdContext.type$ = p.at$('HxdContext','hx::HxContext',[],{},8192,HxdContext);
HxdObsService.type$ = p.at$('HxdObsService','concurrent::Actor',['hx::HxObsService'],{},8194,HxdObsService);
CommitsObservable.type$ = p.at$('CommitsObservable','obs::Observable',[],{},130,CommitsObservable);
CommitsSubscription.type$ = p.at$('CommitsSubscription','obs::RecSubscription',[],{},130,CommitsSubscription);
WatchesObservable.type$ = p.at$('WatchesObservable','obs::Observable',[],{},130,WatchesObservable);
WatchesSubscription.type$ = p.at$('WatchesSubscription','obs::RecSubscription',[],{},130,WatchesSubscription);
CurValsObservable.type$ = p.at$('CurValsObservable','obs::Observable',[],{},130,CurValsObservable);
CurValsSubscription.type$ = p.at$('CurValsSubscription','obs::RecSubscription',[],{},130,CurValsSubscription);
HisWritesObservable.type$ = p.at$('HisWritesObservable','obs::Observable',[],{},130,HisWritesObservable);
HisWritesSubscription.type$ = p.at$('HisWritesSubscription','obs::RecSubscription',[],{},130,HisWritesSubscription);
HxdFileService.type$ = p.at$('HxdFileService','sys::Obj',['hx::HxFileService'],{},130,HxdFileService);
HxdFile.type$ = p.at$('HxdFile','sys::File',[],{},130,HxdFile);
HxdWatchService.type$ = p.at$('HxdWatchService','sys::Obj',['hx::HxWatchService'],{},130,HxdWatchService);
HxdWatch.type$ = p.at$('HxdWatch','hx::HxWatch',[],{},130,HxdWatch);
HxdWatchRef.type$ = p.at$('HxdWatchRef','sys::Obj',[],{},130,HxdWatchRef);
HxdTestSpi.type$ = p.at$('HxdTestSpi','hx::HxTestSpi',[],{},8192,HxdTestSpi);
HxdBackgroundMgr.type$ = p.at$('HxdBackgroundMgr','concurrent::Actor',[],{},130,HxdBackgroundMgr);
HxdRuntimeLibs.type$ = p.at$('HxdRuntimeLibs','concurrent::Actor',['hx::HxRuntimeLibs'],{},8194,HxdRuntimeLibs);
HxdRuntime.type$ = p.at$('HxdRuntime','sys::Obj',['hx::HxRuntime'],{},8194,HxdRuntime);
HxdServiceRegistry.type$ = p.at$('HxdServiceRegistry','sys::Obj',['hx::HxServiceRegistry'],{},8194,HxdServiceRegistry);
HxdHisService.type$ = p.at$('HxdHisService','sys::Obj',['hx::HxHisService'],{},130,HxdHisService);
HxdDefCompiler.type$ = p.at$('HxdDefCompiler','defc::DefCompiler',[],{},8192,HxdDefCompiler);
HxdDefFactory.type$ = p.at$('HxdDefFactory','def::DefFactory',[],{},130,HxdDefFactory);
FuncFeature.type$ = p.at$('FuncFeature','def::MFeature',[],{},130,FuncFeature);
FuncDef.type$ = p.at$('FuncDef','def::MDef',[],{},8194,FuncDef);
HxdLibInput.type$ = p.at$('HxdLibInput','defc::LibInput',[],{},130,HxdLibInput);
FuncReflectInput.type$ = p.at$('FuncReflectInput','defc::ReflectInput',[],{},131,FuncReflectInput);
FuncMethodsReflectInput.type$ = p.at$('FuncMethodsReflectInput','hxd::FuncReflectInput',[],{},130,FuncMethodsReflectInput);
HxdOverlayCompiler.type$ = p.at$('HxdOverlayCompiler','sys::Obj',[],{},8194,HxdOverlayCompiler);
HxdXetoGetter.type$ = p.at$('HxdXetoGetter','sys::Obj',['def::XetoGetter'],{},130,HxdXetoGetter);
HxdInstalled.type$ = p.at$('HxdInstalled','sys::Obj',[],{},8194,HxdInstalled);
HxdInstalledLib.type$ = p.at$('HxdInstalledLib','sys::Obj',[],{},8194,HxdInstalledLib);
HxdInstalledBuilder.type$ = p.at$('HxdInstalledBuilder','sys::Obj',[],{},128,HxdInstalledBuilder);
HxdFolioHooks.type$ = p.at$('HxdFolioHooks','sys::Obj',['folio::FolioHooks'],{},8194,HxdFolioHooks);
HxdLibSpi.type$ = p.at$('HxdLibSpi','concurrent::Actor',['hx::HxLibSpi'],{},8194,HxdLibSpi);
ResHxLib.type$ = p.at$('ResHxLib','hx::HxLib',[],{},8194,ResHxLib);
HxdLibActorObserver.type$ = p.at$('HxdLibActorObserver','sys::Obj',['obs::Observer'],{},130,HxdLibActorObserver);
HxdLibMethodObserver.type$ = p.at$('HxdLibMethodObserver','sys::Obj',['obs::Observer'],{},130,HxdLibMethodObserver);
HxdBoot.type$ = p.at$('HxdBoot','sys::Obj',[],{},8192,HxdBoot);
RunCli.type$ = p.at$('RunCli','hx::HxCli',[],{},128,RunCli);
HxdContextService.type$.af$('rt',73730,'hxd::HxdRuntime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('create',271360,'hx::HxContext',sys.List.make(sys.Param.type$,[new sys.Param('user','hx::HxUser',false)]),{}).am$('createSession',271360,'hx::HxContext',sys.List.make(sys.Param.type$,[new sys.Param('session','hx::HxSession',false)]),{}).am$('xetoReload',271360,'sys::Void',xp,{});
HxdContext.type$.af$('rt',336898,'hxd::HxdRuntime',{}).af$('user',336898,'hx::HxUser',{}).af$('sessionRef',73730,'hx::HxSession?',{}).af$('inference$Store',722944,'sys::Obj?',{}).am$('cur',40962,'hxd::HxdContext?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false),new sys.Param('user','hx::HxUser',false),new sys.Param('session','hx::HxSession?',false)]),{'sys::NoDoc':""}).am$('ns',271360,'haystack::Namespace',xp,{}).am$('db',271360,'folio::Folio',xp,{}).am$('session',271360,'hx::HxSession?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('about',271360,'haystack::Dict',xp,{}).am$('xetoReadById',271360,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false)]),{'sys::NoDoc':""}).am$('xetoReadAllEachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false),new sys.Param('f','|xeto::Dict->sys::Obj?|',false)]),{'sys::NoDoc':""}).am$('deref',271360,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{'sys::NoDoc':""}).am$('inference',795648,'haystack::FilterInference',xp,{'sys::NoDoc':""}).am$('toDict',271360,'haystack::Dict',xp,{'sys::NoDoc':""}).am$('canRead',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{'sys::NoDoc':""}).am$('canWrite',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{'sys::NoDoc':""}).am$('commitInfo',271360,'sys::Obj?',xp,{'sys::NoDoc':""}).am$('findTop',271360,'axon::Fn?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('trapRef',271360,'haystack::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('evalOrReadAll',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false)]),{'sys::NoDoc':""}).am$('inference$Once',133120,'haystack::FilterInference',xp,{});
HxdObsService.type$.af$('rt',73730,'hxd::HxdRuntime',{}).af$('log',73730,'sys::Log',{}).af$('schedule',336898,'obs::ScheduleObservable',{}).af$('commits',65666,'hxd::CommitsObservable',{}).af$('watches',65666,'hxd::WatchesObservable',{}).af$('curVals',65666,'hxd::CurValsObservable',{}).af$('hisWrites',65666,'hxd::HisWritesObservable',{}).af$('listRef',67586,'concurrent::AtomicRef',{}).af$('byName',67586,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('init',128,'sys::Void',xp,{}).am$('list',271360,'obs::Observable[]',xp,{}).am$('get',271360,'obs::Observable?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('addLib',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxLib',false)]),{}).am$('removeLib',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxLib',false)]),{}).am$('updateList',2048,'sys::Void',xp,{}).am$('sync',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',false)]),{}).am$('commit',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false),new sys.Param('user','hx::HxUser?',false)]),{}).am$('curVal',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false)]),{}).am$('hisWrite',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('result','haystack::Dict',false),new sys.Param('user','hx::HxUser?',false)]),{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msgObj','sys::Obj?',false)]),{}).am$('onCommit',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false),new sys.Param('user','hx::HxUser?',false)]),{}).am$('toDiffRec',34818,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('r','haystack::Dict?',false)]),{}).am$('sendAdded',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sub','hxd::CommitsSubscription',false),new sys.Param('diff','folio::Diff',false),new sys.Param('oldRec','haystack::Dict',false),new sys.Param('newRec','haystack::Dict',false),new sys.Param('user','hx::HxUser?',false)]),{}).am$('sendUpdated',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sub','hxd::CommitsSubscription',false),new sys.Param('diff','folio::Diff',false),new sys.Param('oldRec','haystack::Dict',false),new sys.Param('newRec','haystack::Dict',false),new sys.Param('user','hx::HxUser?',false)]),{}).am$('sendRemoved',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sub','hxd::CommitsSubscription',false),new sys.Param('diff','folio::Diff',false),new sys.Param('oldRec','haystack::Dict',false),new sys.Param('newRec','haystack::Dict',false),new sys.Param('user','hx::HxUser?',false)]),{}).am$('toObservation',2048,'obs::Observation',sys.List.make(sys.Param.type$,[new sys.Param('action','obs::CommitObservationAction',false),new sys.Param('diff','folio::Diff',false),new sys.Param('oldRec','haystack::Dict',false),new sys.Param('newRec','haystack::Dict',false),new sys.Param('user','hx::HxUser?',false)]),{}).am$('sendAddOnInit',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sub','hxd::CommitsSubscription',false)]),{}).am$('onCurVal',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('diff','folio::Diff',false)]),{}).am$('onHisWrite',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('result','haystack::Dict',false),new sys.Param('user','hx::HxUser?',false)]),{}).am$('onSync',2048,'sys::Obj?',xp,{});
CommitsObservable.type$.af$('rt',73730,'hxd::HxdRuntime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('name',271360,'sys::Str',xp,{}).am$('onSubscribe',271360,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{});
CommitsSubscription.type$.af$('adds',73730,'sys::Bool',{}).af$('updates',73730,'sys::Bool',{}).af$('removes',73730,'sys::Bool',{}).af$('addOnInit',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','hxd::CommitsObservable',false),new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{});
WatchesObservable.type$.af$('rt',73730,'hxd::HxdRuntime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('name',271360,'sys::Str',xp,{}).am$('onSubscribe',271360,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('fireWatch',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('recs','haystack::Dict[]',false)]),{}).am$('fireUnwatch',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('recs','haystack::Dict[]',false)]),{}).am$('fire',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('subType','sys::Str',false),new sys.Param('recs','haystack::Dict[]',false)]),{});
WatchesSubscription.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','hxd::WatchesObservable',false),new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{});
CurValsObservable.type$.am$('name',271360,'sys::Str',xp,{}).am$('onSubscribe',271360,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CurValsSubscription.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','hxd::CurValsObservable',false),new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{});
HisWritesObservable.type$.am$('name',271360,'sys::Str',xp,{}).am$('onSubscribe',271360,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HisWritesSubscription.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','hxd::HisWritesObservable',false),new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{});
HxdFileService.type$.af$('rt',73730,'hxd::HxdRuntime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('resolve',271360,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{});
HxdFile.type$.af$('service',73730,'hxd::HxdFileService',{}).af$('file',73730,'sys::File',{}).af$('modified',271360,'sys::DateTime?',{}).am$('makeNew',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('service','hxd::HxdFileService',false),new sys.Param('uri','sys::Uri',false),new sys.Param('file','sys::File',false)]),{}).am$('exists',271360,'sys::Bool',xp,{}).am$('size',271360,'sys::Int?',xp,{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('isHidden',271360,'sys::Bool',xp,{}).am$('isReadable',271360,'sys::Bool',xp,{}).am$('isWritable',271360,'sys::Bool',xp,{}).am$('isExecutable',271360,'sys::Bool',xp,{}).am$('osPath',271360,'sys::Str?',xp,{}).am$('normalize',271360,'sys::File',xp,{}).am$('parent',271360,'sys::File?',xp,{}).am$('list',271360,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('pattern','sys::Regex?',true)]),{}).am$('plus',271360,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('path','sys::Uri',false),new sys.Param('checkSlash','sys::Bool',true)]),{'sys::Operator':""}).am$('toLocal',8192,'sys::File',xp,{}).am$('create',271360,'sys::File',xp,{}).am$('moveTo',271360,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('to','sys::File',false)]),{}).am$('delete',271360,'sys::Void',xp,{}).am$('deleteOnExit',271360,'sys::File',xp,{}).am$('open',271360,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('mode','sys::Str',true)]),{}).am$('mmap',271360,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('mode','sys::Str',true),new sys.Param('pos','sys::Int',true),new sys.Param('size','sys::Int?',true)]),{}).am$('in',271360,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('bufferSize','sys::Int?',true)]),{}).am$('out',271360,'sys::OutStream',sys.List.make(sys.Param.type$,[new sys.Param('append','sys::Bool',true),new sys.Param('bufferSize','sys::Int?',true)]),{});
HxdWatchService.type$.af$('rt',73730,'hxd::HxdRuntime',{}).af$('db',73730,'hxFolio::HxFolio',{}).af$('byId',73730,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('list',271360,'hxd::HxdWatch[]',xp,{}).am$('listOn',271360,'hxd::HxdWatch[]',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('get',271360,'hxd::HxdWatch?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('open',271360,'hxd::HxdWatch',sys.List.make(sys.Param.type$,[new sys.Param('dis','sys::Str',false)]),{}).am$('isWatched',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false)]),{}).am$('checkExpires',271360,'sys::Void',xp,{}).am$('debugGrid',271360,'haystack::Grid',xp,{});
HxdWatch.type$.af$('service',73730,'hxd::HxdWatchService',{}).af$('dis',336898,'sys::Str',{}).af$('id',336898,'sys::Str',{}).af$('created',73730,'sys::Int',{}).af$('refs',73730,'concurrent::ConcurrentMap',{}).af$('lastPollRef',67586,'concurrent::AtomicRef',{}).af$('lastRenewRef',67586,'concurrent::AtomicRef',{}).af$('lease',271360,'sys::Duration',{}).af$('leaseRef',67586,'concurrent::AtomicRef',{}).af$('closedRef',67586,'concurrent::AtomicBool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('service','hxd::HxdWatchService',false),new sys.Param('dis','sys::Str',false)]),{}).am$('rt',271360,'hxd::HxdRuntime',xp,{}).am$('list',271360,'haystack::Ref[]',xp,{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('lastPoll',271360,'sys::Duration',xp,{}).am$('lastRenew',271360,'sys::Duration',xp,{}).am$('poll',271360,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Duration',true)]),{}).am$('renew',271360,'sys::Void',xp,{}).am$('addAll',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{}).am$('removeAll',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{}).am$('set',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{}).am$('isClosed',271360,'sys::Bool',xp,{}).am$('checkOpen',2048,'sys::Void',xp,{}).am$('close',271360,'sys::Void',xp,{});
HxdWatchRef.type$.af$('id',73730,'haystack::Ref',{}).af$('ok',73730,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('ok','sys::Bool',false)]),{});
HxdTestSpi.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('test','hx::HxTest',false)]),{}).am$('boot',40962,'hx::HxRuntime',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false),new sys.Param('projMeta','haystack::Dict',true)]),{}).am$('start',271360,'hx::HxRuntime',sys.List.make(sys.Param.type$,[new sys.Param('projMeta','haystack::Dict',false)]),{}).am$('stop',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false)]),{}).am$('addLib',271360,'hx::HxLib',sys.List.make(sys.Param.type$,[new sys.Param('libName','sys::Str',false),new sys.Param('tags','[sys::Str:sys::Obj?]',false)]),{}).am$('addUser',271360,'hx::HxUser',sys.List.make(sys.Param.type$,[new sys.Param('user','sys::Str',false),new sys.Param('pass','sys::Str',false),new sys.Param('tags','[sys::Str:sys::Obj?]',false)]),{}).am$('makeContext',271360,'hx::HxContext',sys.List.make(sys.Param.type$,[new sys.Param('user','hx::HxUser?',false)]),{}).am$('forceSteadyState',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hx::HxRuntime',false)]),{});
HxdBackgroundMgr.type$.af$('rt',73730,'hxd::HxdRuntime',{}).af$('checkMsg',73730,'hx::HxMsg',{}).af$('forceSteadyStateMsg',73730,'hx::HxMsg',{}).af$('freq',73730,'sys::Duration',{}).af$('startTicks',73730,'concurrent::AtomicInt',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('start',8192,'sys::Void',xp,{}).am$('forceSteadyState',8192,'sys::Void',xp,{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('onCheck',2048,'sys::Obj?',xp,{}).am$('onForceSteadyState',2048,'sys::Obj?',xp,{}).am$('checkSteadyState',2048,'sys::Void',xp,{}).am$('transitionToSteadyState',2048,'sys::Void',xp,{}).am$('steadyStateConfig',2048,'sys::Duration',xp,{});
HxdRuntimeLibs.type$.af$('rt',73730,'hxd::HxdRuntime',{}).af$('actorPool',336898,'concurrent::ActorPool',{}).af$('required',73730,'sys::Str[]',{}).af$('listRef',67586,'concurrent::AtomicRef',{}).af$('mapRef',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false),new sys.Param('required','sys::Str[]',false)]),{}).am$('init',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('removeUnknown','sys::Bool',false)]),{}).am$('list',271360,'hx::HxLib[]',xp,{}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('get',271360,'hx::HxLib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('map',128,'[sys::Str:hx::HxLib]',xp,{}).am$('getType',8192,'hx::HxLib?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('add',271360,'hx::HxLib',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('tags','haystack::Dict',true)]),{}).am$('remove',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj',false)]),{}).am$('status',271360,'haystack::Grid',xp,{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::Obj?',false)]),{}).am$('onAdd',2048,'hx::HxLib',sys.List.make(sys.Param.type$,[new sys.Param('install','hxd::HxdInstalledLib',false),new sys.Param('extraTags','haystack::Dict',false)]),{}).am$('onRemove',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('onModified',2048,'sys::Void',xp,{});
HxdRuntime.type$.af$('name',336898,'sys::Str',{}).af$('version',336898,'sys::Version',{}).af$('platform',336898,'hx::HxPlatform',{}).af$('config',336898,'hx::HxConfig',{}).af$('dir',336898,'sys::File',{}).af$('nsBaseRef',67586,'concurrent::AtomicRef',{}).af$('nsOverlayRef',67586,'concurrent::AtomicRef',{}).af$('db',336898,'folio::Folio',{}).af$('metaRef',65666,'concurrent::AtomicRef',{}).af$('servicesRef',67586,'concurrent::AtomicRef',{}).af$('context',336898,'hxd::HxdContextService',{}).af$('obs',336898,'hxd::HxdObsService',{}).af$('watch',336898,'hx::HxWatchService',{}).af$('file',336898,'hx::HxFileService',{}).af$('his',336898,'hx::HxHisService',{}).af$('libs',336898,'hxd::HxdRuntimeLibs',{}).af$('stateStateRef',65666,'concurrent::AtomicBool',{}).af$('libsActorPool',73730,'concurrent::ActorPool',{}).af$('hxdActorPool',73730,'concurrent::ActorPool',{}).af$('backgroundMgr',65666,'hxd::HxdBackgroundMgr',{}).af$('installedRef',67586,'concurrent::AtomicRef',{}).af$('log',73730,'sys::Log',{}).af$('nowRef',65666,'concurrent::AtomicRef',{}).af$('shutdownHook',73730,'|->sys::Void|',{}).af$('isRunningRef',67586,'concurrent::AtomicBool',{}).af$('isStarted',67586,'concurrent::AtomicBool',{}).af$('isStopped',67586,'concurrent::AtomicBool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('boot','hxd::HxdBoot',false)]),{}).am$('init',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('boot','hxd::HxdBoot',false)]),{}).am$('dis',271360,'sys::Str',xp,{}).am$('ns',271360,'haystack::Namespace',xp,{}).am$('nsBaseRecompile',128,'sys::Void',xp,{}).am$('nsOverlayRecompile',128,'sys::Void',xp,{}).am$('meta',271360,'haystack::Dict',xp,{}).am$('services',271360,'hxd::HxdServiceRegistry',xp,{}).am$('servicesRebuild',128,'sys::Void',xp,{}).am$('crypto',271360,'hx::HxCryptoService',xp,{}).am$('http',271360,'hx::HxHttpService',xp,{}).am$('user',271360,'hx::HxUserService',xp,{}).am$('io',271360,'hx::HxIOService',xp,{}).am$('task',271360,'hx::HxTaskService',xp,{}).am$('pointWrite',271360,'hx::HxPointWriteService',xp,{}).am$('conn',271360,'hx::HxConnService',xp,{}).am$('lib',271360,'hx::HxLib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isSteadyState',271360,'sys::Bool',xp,{}).am$('sync',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('installed',8192,'hxd::HxdInstalled',xp,{}).am$('now',8192,'sys::DateTime',xp,{}).am$('isRunning',271360,'sys::Bool',xp,{}).am$('start',8192,'sys::This',xp,{}).am$('stop',8192,'sys::Void',xp,{});
HxdServiceRegistry.type$.af$('list',336898,'sys::Type[]',{}).af$('context',336898,'hxd::HxdContextService',{}).af$('obs',336898,'hxd::HxdObsService',{}).af$('watch',336898,'hx::HxWatchService',{}).af$('file',336898,'hx::HxFileService',{}).af$('his',336898,'hx::HxHisService',{}).af$('crypto',336898,'hx::HxCryptoService',{}).af$('httpRef',67586,'hx::HxHttpService?',{}).af$('user',336898,'hx::HxUserService',{}).af$('ioRef',67586,'hx::HxIOService?',{}).af$('taskRef',67586,'hx::HxTaskService?',{}).af$('pointWrite',336898,'hx::HxPointWriteService',{}).af$('conn',336898,'hx::HxConnService',{}).af$('map',67586,'[sys::Type:hx::HxService[]]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false),new sys.Param('libs','hx::HxLib[]',false)]),{}).am$('http',271360,'hx::HxHttpService',xp,{}).am$('io',271360,'hx::HxIOService',xp,{}).am$('task',271360,'hx::HxTaskService',xp,{}).am$('get',271360,'hx::HxService?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('getAll',271360,'hx::HxService[]',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{});
HxdHisService.type$.af$('rt',73730,'hxd::HxdRuntime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('read',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pt','haystack::Dict',false),new sys.Param('span','haystack::Span?',false),new sys.Param('opts','haystack::Dict?',false),new sys.Param('f','|haystack::HisItem->sys::Void|',false)]),{}).am$('write',271360,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('pt','haystack::Dict',false),new sys.Param('items','haystack::HisItem[]',false),new sys.Param('opts','haystack::Dict?',true)]),{});
HxdDefCompiler.type$.af$('rt',73730,'hxd::HxdRuntime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{});
HxdDefFactory.type$.am$('createFeature',271360,'def::MFeature',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BFeature',false)]),{}).am$('make',139268,'sys::Void',xp,{});
FuncFeature.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BFeature',false)]),{}).am$('defType',271360,'sys::Type',xp,{}).am$('createDef',271360,'def::MDef',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false)]),{}).am$('createUnknownErr',271360,'sys::Err',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{});
FuncDef.type$.af$('src',67586,'sys::Str?',{}).af$('exprRef',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BDef',false),new sys.Param('src','sys::Str?',false)]),{}).am$('expr',8192,'axon::Fn',xp,{}).am$('parseExpr',2048,'axon::Fn',xp,{});
HxdLibInput.type$.af$('name',73730,'sys::Str',{}).af$('lib',73730,'hx::HxLib',{}).af$('spi',73730,'hxd::HxdLibSpi',{}).af$('loc',336898,'defc::CLoc',{}).af$('install',73730,'hxd::HxdInstalledLib',{}).af$('metaFile',73730,'sys::File',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxLib',false)]),{}).am$('pod',8192,'sys::Pod',xp,{}).am$('scanMeta',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('scanFiles',271360,'sys::File[]',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{}).am$('isUnderLibDir',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('scanReflects',271360,'defc::ReflectInput[]',sys.List.make(sys.Param.type$,[new sys.Param('c','defc::DefCompiler',false)]),{});
FuncReflectInput.type$.af$('type',336898,'sys::Type',{}).af$('instanceRef',73730,'concurrent::AtomicRef?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('instanceRef','concurrent::AtomicRef?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('addMeta',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('symbol','haystack::Symbol',false),new sys.Param('acc','[sys::Str:sys::Obj]',false)]),{});
FuncMethodsReflectInput.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('instanceRef','concurrent::AtomicRef?',false)]),{}).am$('methodFacet',271360,'sys::Type?',xp,{}).am$('toSymbol',271360,'haystack::Symbol',sys.List.make(sys.Param.type$,[new sys.Param('slot','sys::Slot?',false)]),{}).am$('onDef',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slot','sys::Slot?',false),new sys.Param('def','defc::CDef',false)]),{});
HxdOverlayCompiler.type$.af$('rt',73730,'hxd::HxdRuntime',{}).af$('base',73730,'haystack::Namespace',{}).af$('log',73730,'sys::Log',{}).af$('libSymbol',73730,'haystack::Symbol',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false),new sys.Param('base','haystack::Namespace',false)]),{}).am$('compileNamespace',8192,'haystack::Namespace',xp,{}).am$('addRecDef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','def::BOverlayLib',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('checkOverrideErr',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('err',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('err','sys::Err?',true)]),{});
HxdXetoGetter.type$.af$('rt',73730,'hxd::HxdRuntime',{}).af$('get$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('get',795648,'xeto::LibNamespace',xp,{}).am$('get$Once',133120,'xeto::LibNamespace',xp,{});
HxdInstalled.type$.af$('map',67586,'[sys::Str:hxd::HxdInstalledLib]',{}).am$('build',40962,'hxd::HxdInstalled',xp,{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','hxd::HxdInstalledBuilder',false)]),{}).am$('lib',8192,'hxd::HxdInstalledLib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('main',40962,'sys::Void',xp,{});
HxdInstalledLib.type$.af$('name',73730,'sys::Str',{}).af$('pod',73730,'sys::Pod',{}).af$('meta',73730,'haystack::Dict',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('pod','sys::Pod',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('type',8192,'sys::Type?',xp,{}).am$('depends',8192,'sys::Str[]',xp,{}).am$('metaFile',8192,'sys::File',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
HxdInstalledBuilder.type$.af$('log',73728,'sys::Log',{}).af$('map',73728,'[sys::Str:hxd::HxdInstalledLib]',{}).am$('build',8192,'sys::This',xp,{}).am$('mapPods',2048,'sys::Void',xp,{}).am$('mapPod',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('podName','sys::Str',false)]),{}).am$('mapLib',2048,'hxd::HxdInstalledLib',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('pod','sys::Pod',false)]),{}).am$('normMeta',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('pod','sys::Pod',false),new sys.Param('meta','haystack::Dict',false)]),{}).am$('toMetaFile',2048,'sys::File',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('pod','sys::Pod',false)]),{}).am$('normDepends',2048,'sys::Obj[]',sys.List.make(sys.Param.type$,[new sys.Param('depends','sys::Obj[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HxdFolioHooks.type$.af$('rt',73730,'hxd::HxdRuntime',{}).af$('db',73730,'folio::Folio',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false)]),{}).am$('ns',271360,'haystack::Namespace?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('preCommit',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','folio::FolioCommitEvent',false)]),{}).am$('postCommit',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','folio::FolioCommitEvent',false)]),{}).am$('postHisWrite',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('e','folio::FolioHisEvent',false)]),{});
HxdLibSpi.type$.af$('libRef',67586,'concurrent::AtomicRef',{}).af$('rt',336898,'hx::HxRuntime',{}).af$('name',336898,'sys::Str',{}).af$('install',73730,'hxd::HxdInstalledLib',{}).af$('type',73730,'sys::Type?',{}).af$('recRef',67586,'concurrent::AtomicRef',{}).af$('log',336898,'sys::Log',{}).af$('webUri',336898,'sys::Uri',{}).af$('statusRef',67586,'concurrent::AtomicRef',{}).af$('statusMsgRef',67586,'concurrent::AtomicRef',{}).af$('subscriptionsRef',67586,'concurrent::AtomicRef',{}).af$('isRunningRef',67586,'concurrent::AtomicBool',{}).af$('houseKeepingMsg',100354,'hx::HxMsg',{}).am$('instantiate',40962,'hx::HxLib',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false),new sys.Param('install','hxd::HxdInstalledLib',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('doInstantiate',34818,'hx::HxLib',sys.List.make(sys.Param.type$,[new sys.Param('spi','hxd::HxdLibSpi',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rt','hxd::HxdRuntime',false),new sys.Param('install','hxd::HxdInstalledLib',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('lib',8192,'hx::HxLib',xp,{}).am$('def',271360,'haystack::Lib',xp,{}).am$('rec',271360,'haystack::Dict',xp,{}).am$('actor',271360,'concurrent::Actor',xp,{}).am$('isFault',271360,'sys::Bool',xp,{}).am$('toStatus',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('status','sys::Str',false),new sys.Param('msg','sys::Str',false)]),{}).am$('status',8192,'sys::Str',xp,{}).am$('statusMsg',8192,'sys::Str?',xp,{}).am$('subscriptions',271360,'obs::Subscription[]',xp,{}).am$('observe',271360,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('config','haystack::Dict',false),new sys.Param('callback','sys::Obj',false)]),{}).am$('start',8192,'concurrent::Future',xp,{}).am$('ready',8192,'concurrent::Future',xp,{}).am$('steadyState',8192,'concurrent::Future',xp,{}).am$('unready',8192,'concurrent::Future',xp,{}).am$('stop',8192,'concurrent::Future',xp,{}).am$('sync',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('update',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{}).am$('typedRec',8192,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msgObj','sys::Obj?',false)]),{}).am$('onStart',2048,'sys::Obj?',xp,{}).am$('onReady',2048,'sys::Obj?',xp,{}).am$('onSteadyState',2048,'sys::Obj?',xp,{}).am$('onUnready',2048,'sys::Obj?',xp,{}).am$('onStop',2048,'sys::Obj?',xp,{}).am$('onRecUpdate',2048,'sys::Obj?',xp,{}).am$('onObs',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','hx::HxMsg',false)]),{}).am$('isRunning',271360,'sys::Bool',xp,{}).am$('scheduleHouseKeeping',2048,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
ResHxLib.type$.am$('make',139268,'sys::Void',xp,{});
HxdLibActorObserver.type$.af$('lib',73730,'hx::HxLib',{}).af$('meta',336898,'haystack::Dict',{}).af$('actor',336898,'concurrent::Actor',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxLib',false),new sys.Param('actor','concurrent::Actor',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
HxdLibMethodObserver.type$.af$('lib',73730,'hx::HxLib',{}).af$('method',73730,'sys::Method',{}).af$('meta',336898,'haystack::Dict',{}).af$('actor',336898,'concurrent::Actor',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','hx::HxLib',false),new sys.Param('method','sys::Method',false)]),{}).am$('toActorMsg',271360,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('msg','obs::Observation',false)]),{}).am$('toSyncMsg',271360,'sys::Obj?',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('call',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{});
HxdBoot.type$.af$('version',73728,'sys::Version',{}).af$('name',73728,'sys::Str?',{}).af$('dir',73728,'sys::File?',{}).af$('create',73728,'sys::Bool',{}).af$('log',73728,'sys::Log',{}).af$('platform',73728,'[sys::Str:sys::Obj?]',{}).af$('config',73728,'[sys::Str:sys::Obj?]',{}).af$('projMeta',73728,'haystack::Dict',{}).af$('requiredLibs',73728,'sys::Str[]',{}).af$('removeUnknownLibs',73728,'sys::Bool',{}).af$('db',65664,'folio::Folio?',{}).af$('rt',65664,'hxd::HxdRuntime?',{}).af$('platformRef',65664,'hx::HxPlatform?',{}).am$('init',8192,'hxd::HxdRuntime',xp,{}).am$('run',8192,'sys::Int',xp,{}).am$('initArgs',2048,'sys::Void',xp,{}).am$('initWebMode',2048,'sys::Void',xp,{}).am$('initPlatform',2048,'sys::Void',xp,{}).am$('initLic',2048,'sys::Void',xp,{}).am$('openDatabase',2048,'sys::Void',xp,{}).am$('initMeta',2048,'sys::Void',xp,{}).am$('initLibs',2048,'sys::Void',xp,{}).am$('initLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('initRec',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('summary','sys::Str',false),new sys.Param('rec','haystack::Dict?',false),new sys.Param('changes','[sys::Str:sys::Obj]',true)]),{}).am$('initRuntime',270336,'hxd::HxdRuntime',xp,{}).am$('make',139268,'sys::Void',xp,{});
RunCli.type$.af$('noAuth',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Disable authentication and use superuser for all access\";}"}).af$('dir',73728,'sys::File?',{'util::Arg':"util::Arg{help=\"Runtime database directory\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "hxd");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;inet 1.0;util 1.0;web 1.0;wisp 1.0;xeto 3.1.11;haystack 3.1.11;auth 3.1.11;def 3.1.11;defc 3.1.11;axon 3.1.11;obs 3.1.11;folio 3.1.11;hx 3.1.11;hxFolio 3.1.11");
m.set("pod.summary", "Haxall runtime daemon");
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
m.set("pod.docApi", "false");
m.set("org.uri", "https://skyfoundry.com/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  HxdContextService,
  HxdContext,
  HxdObsService,
  HxdTestSpi,
  HxdRuntimeLibs,
  HxdRuntime,
  HxdServiceRegistry,
  HxdDefCompiler,
  FuncDef,
  HxdOverlayCompiler,
  HxdInstalled,
  HxdInstalledLib,
  HxdFolioHooks,
  HxdLibSpi,
  ResHxLib,
  HxdBoot,
};
