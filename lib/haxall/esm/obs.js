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
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class Observable extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#subscriptionsRef = concurrent.AtomicRef.make(Subscription.type$.emptyList());
    return;
  }

  typeof() { return Observable.type$; }

  #subscriptionsRef = null;

  // private field reflection only
  __subscriptionsRef(it) { if (it === undefined) return this.#subscriptionsRef; else this.#subscriptionsRef = it; }

  hasSubscriptions() {
    return !this.subscriptions().isEmpty();
  }

  subscriptions() {
    return sys.ObjUtil.coerce(this.#subscriptionsRef.val(), sys.Type.find("obs::Subscription[]"));
  }

  subscribe(observer,config) {
    let s = this.onSubscribe(observer, config);
    while (true) {
      let oldList = this.subscriptions();
      let newList = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(oldList.dup().add(s)), sys.Type.find("obs::Subscription[]"));
      if (this.#subscriptionsRef.compareAndSet(oldList, newList)) {
        break;
      }
      ;
    }
    ;
    s.activeRef().val(true);
    return s;
  }

  unsubscribe(s) {
    while (true) {
      let oldList = this.subscriptions();
      let i = ((this$) => { let $_u0 = oldList.indexSame(s); if ($_u0 != null) return $_u0; throw UnknownSubscriptionErr.make("Not my subscription"); })(this);
      let newList = oldList.dup();
      newList.removeAt(sys.ObjUtil.coerce(i, sys.Int.type$));
      (newList = sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(newList), sys.Type.find("obs::Subscription[]")));
      if (this.#subscriptionsRef.compareAndSet(oldList, newList)) {
        break;
      }
      ;
    }
    ;
    s.activeRef().val(false);
    this.onUnsubscribe(s);
    return;
  }

  unsubscribeAll() {
    const this$ = this;
    this.subscriptions().each((s) => {
      s.activeRef().val(false);
      return;
    });
    this.#subscriptionsRef.val(Subscription.type$.emptyList());
    return;
  }

  onSubscribe(observer,config) {
    return Subscription.make(this, observer, config);
  }

  onUnsubscribe(s) {
    return;
  }

  makeObservation(ts,more) {
    if (ts === undefined) ts = sys.DateTime.now();
    if (more === undefined) more = haystack.Etc.emptyDict();
    return MObservation.make(this, ts, more);
  }

  static make() {
    const $self = new Observable();
    Observable.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class UnknownObservableErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownObservableErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownObservableErr();
    UnknownObservableErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class UnknownSubscriptionErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnknownSubscriptionErr.type$; }

  static make(msg,cause) {
    const $self = new UnknownSubscriptionErr();
    UnknownSubscriptionErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class Observer {
  constructor() {
    const this$ = this;
  }

  typeof() { return Observer.type$; }

  toActorMsg(obs) {
    return obs;
  }

  toSyncMsg() {
    return null;
  }

}

class Observation {
  constructor() {
    const this$ = this;
  }

  typeof() { return Observation.type$; }

  toStr() { return haystack.Dict.prototype.toStr.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

}

class HisWriteObservation extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return HisWriteObservation.type$; }

  toStr() { return haystack.Dict.prototype.toStr.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #rec = null;

  rec() { return this.#rec; }

  __rec(it) { if (it === undefined) return this.#rec; else this.#rec = it; }

  #count = null;

  count() { return this.#count; }

  __count(it) { if (it === undefined) return this.#count; else this.#count = it; }

  #span = null;

  span() { return this.#span; }

  __span(it) { if (it === undefined) return this.#span; else this.#span = it; }

  #user = null;

  user() { return this.#user; }

  __user(it) { if (it === undefined) return this.#user; else this.#user = it; }

  static make(observable,ts,id,rec,count,span,user) {
    const $self = new HisWriteObservation();
    HisWriteObservation.make$($self,observable,ts,id,rec,count,span,user);
    return $self;
  }

  static make$($self,observable,ts,id,rec,count,span,user) {
    $self.#type = observable.name();
    $self.#ts = ts;
    $self.#id = id;
    $self.#rec = rec;
    $self.#count = count;
    $self.#span = span;
    $self.#user = user;
    return;
  }

  subType() {
    return null;
  }

  isEmpty() {
    return false;
  }

  get(name,def) {
    if (def === undefined) def = null;
    let $_u1 = name;
    if (sys.ObjUtil.equals($_u1, "type")) {
      return this.#type;
    }
    else if (sys.ObjUtil.equals($_u1, "ts")) {
      return this.#ts;
    }
    else if (sys.ObjUtil.equals($_u1, "id")) {
      return this.#id;
    }
    else if (sys.ObjUtil.equals($_u1, "rec")) {
      return this.#rec;
    }
    else if (sys.ObjUtil.equals($_u1, "count")) {
      return this.#count;
    }
    else if (sys.ObjUtil.equals($_u1, "span")) {
      return this.#span;
    }
    else if (sys.ObjUtil.equals($_u1, "user")) {
      return ((this$) => { let $_u2 = this$.#user; if ($_u2 != null) return $_u2; return def; })(this);
    }
    else {
      return def;
    }
    ;
  }

  has(name) {
    return this.get(name) != null;
  }

  missing(name) {
    return !this.has(name);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    return ((this$) => { let $_u3 = this$.get(name, null); if ($_u3 != null) return $_u3; throw haystack.UnknownNameErr.make(name); })(this);
  }

  each(f) {
    const this$ = this;
    this.eachWhile((v,n) => {
      sys.Func.call(f, v, n);
      return null;
    });
    return;
  }

  eachWhile(f) {
    let r = null;
    (r = sys.Func.call(f, this.#type, "type"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#ts, "ts"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#id, "id"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#rec, "rec"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#count, "count"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#span, "span"));
    if (r != null) {
      return r;
    }
    ;
    if (this.#user != null) {
      (r = sys.Func.call(f, sys.ObjUtil.coerce(this.#user, sys.Obj.type$), "user"));
    }
    ;
    if (r != null) {
      return r;
    }
    ;
    return null;
  }

}

class MObservation extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MObservation.type$; }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  #more = null;

  more() { return this.#more; }

  __more(it) { if (it === undefined) return this.#more; else this.#more = it; }

  static make(observable,ts,more) {
    const $self = new MObservation();
    MObservation.make$($self,observable,ts,more);
    return $self;
  }

  static make$($self,observable,ts,more) {
    if (more === undefined) more = haystack.Etc.emptyDict();
    $self.#type = observable.name();
    $self.#ts = ts;
    $self.#more = more;
    return;
  }

  subType() {
    return sys.ObjUtil.coerce(this.#more.get("subType"), sys.Str.type$.toNullable());
  }

  compare(that) {
    return sys.ObjUtil.compare(this.#ts, sys.ObjUtil.coerce(that, haystack.Dict.type$).get("ts"));
  }

  isEmpty() {
    return false;
  }

  get(name,def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(name, "type")) {
      return this.#type;
    }
    ;
    if (sys.ObjUtil.equals(name, "ts")) {
      return this.#ts;
    }
    ;
    return this.#more.get(name, def);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    return ((this$) => { let $_u4 = this$.get(name); if ($_u4 != null) return $_u4; throw haystack.UnknownNameErr.make(name); })(this);
  }

  has(name) {
    return (sys.ObjUtil.equals(name, "ts") || sys.ObjUtil.equals(name, "type") || this.#more.has(name));
  }

  missing(name) {
    return !this.has(name);
  }

  each(f) {
    sys.Func.call(f, this.#ts, "ts");
    sys.Func.call(f, this.#type, "type");
    this.#more.each(f);
    return;
  }

  eachWhile(f) {
    let r = null;
    (r = sys.Func.call(f, this.#type, "type"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#ts, "ts"));
    if (r != null) {
      return r;
    }
    ;
    return this.#more.eachWhile(f);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.toStr(this.#type), " @ "), this.#ts.toLocale("hh:mm:ss"));
  }

}

class Subscription extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#activeRef = concurrent.AtomicBool.make(false);
    return;
  }

  typeof() { return Subscription.type$; }

  #observable = null;

  observable() { return this.#observable; }

  __observable(it) { if (it === undefined) return this.#observable; else this.#observable = it; }

  #observer = null;

  observer() { return this.#observer; }

  __observer(it) { if (it === undefined) return this.#observer; else this.#observer = it; }

  #config = null;

  config() { return this.#config; }

  __config(it) { if (it === undefined) return this.#config; else this.#config = it; }

  #activeRef = null;

  activeRef() { return this.#activeRef; }

  __activeRef(it) { if (it === undefined) return this.#activeRef; else this.#activeRef = it; }

  static make(observable,observer,config) {
    const $self = new Subscription();
    Subscription.make$($self,observable,observer,config);
    return $self;
  }

  static make$($self,observable,observer,config) {
    ;
    $self.#observable = observable;
    $self.#observer = observer;
    $self.#config = config;
    return;
  }

  configDebug() {
    const this$ = this;
    let s = sys.StrBuf.make().add("{");
    haystack.Etc.dictNames(this.#config).each((n) => {
      if ((!sys.Str.startsWith(n, "obs") || sys.ObjUtil.equals(n, this$.#observable.name()))) {
        return;
      }
      ;
      let v = this$.#config.get(n);
      if (sys.ObjUtil.compareGT(s.size(), 1)) {
        s.add(", ");
      }
      ;
      s.add(n);
      if (sys.ObjUtil.equals(v, haystack.Marker.val())) {
        return;
      }
      ;
      s.addChar(58).add(haystack.Etc.valToDis(v));
      return;
    });
    s.add("}");
    return s.toStr();
  }

  isSubscribed() {
    return this.#activeRef.val();
  }

  isUnsubscribed() {
    return !this.#activeRef.val();
  }

  unsubscribe() {
    this.#observable.unsubscribe(this);
    return;
  }

  send(msg) {
    return this.#observer.actor().send(this.#observer.toActorMsg(msg));
  }

  sync() {
    return this.#observer.actor().send(this.#observer.toSyncMsg());
  }

  toStr() {
    let s = this.#observable.name();
    if (this.isUnsubscribed()) {
      s = sys.Str.plus(s, " (UNSUBSCRIBED)");
    }
    ;
    return s;
  }

}

class CommitObservation extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommitObservation.type$; }

  toStr() { return haystack.Dict.prototype.toStr.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #subType = null;

  subType() { return this.#subType; }

  __subType(it) { if (it === undefined) return this.#subType; else this.#subType = it; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #action = null;

  action() { return this.#action; }

  __action(it) { if (it === undefined) return this.#action; else this.#action = it; }

  #newRec = null;

  newRec() { return this.#newRec; }

  __newRec(it) { if (it === undefined) return this.#newRec; else this.#newRec = it; }

  #oldRec = null;

  oldRec() { return this.#oldRec; }

  __oldRec(it) { if (it === undefined) return this.#oldRec; else this.#oldRec = it; }

  #user = null;

  user() { return this.#user; }

  __user(it) { if (it === undefined) return this.#user; else this.#user = it; }

  static make(observable,action,ts,id,oldRec,newRec,user) {
    const $self = new CommitObservation();
    CommitObservation.make$($self,observable,action,ts,id,oldRec,newRec,user);
    return $self;
  }

  static make$($self,observable,action,ts,id,oldRec,newRec,user) {
    $self.#type = observable.name();
    $self.#subType = action.name();
    $self.#ts = ts;
    $self.#action = action;
    $self.#id = id;
    $self.#oldRec = oldRec;
    $self.#newRec = newRec;
    $self.#user = user;
    return;
  }

  isAdded() {
    return this.#action === CommitObservationAction.added();
  }

  isUpdated() {
    return this.#action === CommitObservationAction.updated();
  }

  isRemoved() {
    return this.#action === CommitObservationAction.removed();
  }

  recHas(tag) {
    return (this.#oldRec.has(tag) || this.#newRec.has(tag));
  }

  tagUpdated(tag) {
    return sys.ObjUtil.compareNE(this.#oldRec.get(tag), this.#newRec.get(tag));
  }

  isEmpty() {
    return false;
  }

  get(name,def) {
    if (def === undefined) def = null;
    let $_u5 = name;
    if (sys.ObjUtil.equals($_u5, "type")) {
      return this.#type;
    }
    else if (sys.ObjUtil.equals($_u5, "subType")) {
      return this.#subType;
    }
    else if (sys.ObjUtil.equals($_u5, "ts")) {
      return this.#ts;
    }
    else if (sys.ObjUtil.equals($_u5, "id")) {
      return this.#id;
    }
    else if (sys.ObjUtil.equals($_u5, "newRec")) {
      return this.#newRec;
    }
    else if (sys.ObjUtil.equals($_u5, "oldRec")) {
      return this.#oldRec;
    }
    else if (sys.ObjUtil.equals($_u5, "user")) {
      return ((this$) => { let $_u6 = this$.#user; if ($_u6 != null) return $_u6; return def; })(this);
    }
    else {
      return def;
    }
    ;
  }

  has(name) {
    return this.get(name) != null;
  }

  missing(name) {
    return !this.has(name);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    return ((this$) => { let $_u7 = this$.get(name, null); if ($_u7 != null) return $_u7; throw haystack.UnknownNameErr.make(name); })(this);
  }

  each(f) {
    const this$ = this;
    this.eachWhile((v,n) => {
      sys.Func.call(f, v, n);
      return null;
    });
    return;
  }

  eachWhile(f) {
    let r = null;
    (r = sys.Func.call(f, this.#type, "type"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, sys.ObjUtil.coerce(this.#subType, sys.Obj.type$), "subType"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#ts, "ts"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#id, "id"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#newRec, "newRec"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#oldRec, "oldRec"));
    if (r != null) {
      return r;
    }
    ;
    if (this.#user != null) {
      (r = sys.Func.call(f, sys.ObjUtil.coerce(this.#user, sys.Obj.type$), "user"));
    }
    ;
    if (r != null) {
      return r;
    }
    ;
    return null;
  }

}

class CommitObservationAction extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CommitObservationAction.type$; }

  static added() { return CommitObservationAction.vals().get(0); }

  static updated() { return CommitObservationAction.vals().get(1); }

  static removed() { return CommitObservationAction.vals().get(2); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new CommitObservationAction();
    CommitObservationAction.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(CommitObservationAction.type$, CommitObservationAction.vals(), name$, checked);
  }

  static vals() {
    if (CommitObservationAction.#vals == null) {
      CommitObservationAction.#vals = sys.List.make(CommitObservationAction.type$, [
        CommitObservationAction.make(0, "added", ),
        CommitObservationAction.make(1, "updated", ),
        CommitObservationAction.make(2, "removed", ),
      ]).toImmutable();
    }
    return CommitObservationAction.#vals;
  }

  static static$init() {
    const $_u8 = CommitObservationAction.vals();
    if (true) {
    }
    ;
    return;
  }

}

class ScheduleObservable extends Observable {
  constructor() {
    super();
    const this$ = this;
    this.#nowRef = concurrent.AtomicRef.make(sys.DateTime.now());
    return;
  }

  typeof() { return ScheduleObservable.type$; }

  #nowRef = null;

  // private field reflection only
  __nowRef(it) { if (it === undefined) return this.#nowRef; else this.#nowRef = it; }

  name() {
    return "obsSchedule";
  }

  now() {
    return sys.ObjUtil.coerce(this.#nowRef.val(), sys.DateTime.type$);
  }

  onSubscribe(observer,config) {
    return ScheduleSubscription.make(this, observer, config);
  }

  check(nowTime) {
    const this$ = this;
    this.#nowRef.val(nowTime);
    let subs = this.subscriptions();
    if (subs.isEmpty()) {
      return;
    }
    ;
    let nowTicks = sys.Duration.nowTicks();
    let msg = MObservation.make(this, nowTime, haystack.Etc.emptyDict());
    subs.each((sub) => {
      this$.checkSubscription(sys.ObjUtil.coerce(sub, ScheduleSubscription.type$), nowTime, nowTicks, msg);
      return;
    });
    return;
  }

  checkSubscription(sub,nowTime,nowTicks,msg) {
    const this$ = this;
    if (!sub.isActive(nowTime)) {
      return;
    }
    ;
    if (sys.ObjUtil.compareGT(sub.observer().actor().queueSize(), 0)) {
      return;
    }
    ;
    if (sub.freq() != null) {
      let elapsed = sys.Int.minus(nowTicks, sub.lastTicks().val());
      if (sys.ObjUtil.compareGE(elapsed, sub.freq().ticks())) {
        this.fire(sub, nowTime, nowTicks, msg);
      }
      ;
      return;
    }
    ;
    if (sub.times() != null) {
      let lastTime = this.toLastTime(sub, nowTime);
      let nowTimeTime = nowTime.time();
      let ready = sub.times().find((t) => {
        return (sys.ObjUtil.compareLE(lastTime, t) && sys.ObjUtil.compareLE(t, nowTimeTime));
      });
      if (ready != null) {
        this.fire(sub, nowTime, nowTicks, msg);
      }
      ;
      return;
    }
    ;
    return;
  }

  toLastTime(sub,nowTime) {
    let last = sys.ObjUtil.as(sub.lastTime().val(), sys.DateTime.type$);
    if (last == null) {
      sub.lastTime().val((last = nowTime.minus(sys.Duration.fromStr("10min"))));
    }
    ;
    if (sys.ObjUtil.compareNE(nowTime.date(), last.date())) {
      return sys.Time.defVal();
    }
    ;
    return last.time();
  }

  fire(sub,nowTime,nowTicks,msg) {
    sub.lastTime().val(nowTime);
    sub.lastTicks().val(nowTicks);
    sub.send(msg);
    return;
  }

  static make() {
    const $self = new ScheduleObservable();
    ScheduleObservable.make$($self);
    return $self;
  }

  static make$($self) {
    Observable.make$($self);
    ;
    return;
  }

}

class ScheduleSubscription extends Subscription {
  constructor() {
    super();
    const this$ = this;
    this.#lastTime = concurrent.AtomicRef.make();
    this.#lastTicks = concurrent.AtomicInt.make();
    return;
  }

  typeof() { return ScheduleSubscription.type$; }

  #lastTime = null;

  lastTime() { return this.#lastTime; }

  __lastTime(it) { if (it === undefined) return this.#lastTime; else this.#lastTime = it; }

  #lastTicks = null;

  lastTicks() { return this.#lastTicks; }

  __lastTicks(it) { if (it === undefined) return this.#lastTicks; else this.#lastTicks = it; }

  #freq = null;

  freq() { return this.#freq; }

  __freq(it) { if (it === undefined) return this.#freq; else this.#freq = it; }

  #times = null;

  times() { return this.#times; }

  __times(it) { if (it === undefined) return this.#times; else this.#times = it; }

  #timesFired = null;

  timesFired() { return this.#timesFired; }

  __timesFired(it) { if (it === undefined) return this.#timesFired; else this.#timesFired = it; }

  #span = null;

  span() { return this.#span; }

  __span(it) { if (it === undefined) return this.#span; else this.#span = it; }

  #daysOfMonth = null;

  daysOfMonth() { return this.#daysOfMonth; }

  __daysOfMonth(it) { if (it === undefined) return this.#daysOfMonth; else this.#daysOfMonth = it; }

  #daysOfWeek = null;

  daysOfWeek() { return this.#daysOfWeek; }

  __daysOfWeek(it) { if (it === undefined) return this.#daysOfWeek; else this.#daysOfWeek = it; }

  static make(observable,observer,config) {
    const $self = new ScheduleSubscription();
    ScheduleSubscription.make$($self,observable,observer,config);
    return $self;
  }

  static make$($self,observable,observer,config) {
    Subscription.make$($self, observable, observer, config);
    ;
    $self.#freq = ScheduleSubscription.parseFreq(config);
    $self.#times = sys.ObjUtil.coerce(((this$) => { let $_u9 = ScheduleSubscription.parseTimes(config); if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(ScheduleSubscription.parseTimes(config)); })($self), sys.Type.find("sys::Time[]?"));
    $self.#span = ScheduleSubscription.parseSpan(config);
    $self.#daysOfWeek = sys.ObjUtil.coerce(((this$) => { let $_u10 = ScheduleSubscription.parseDaysOfWeek(config); if ($_u10 == null) return null; return sys.ObjUtil.toImmutable(ScheduleSubscription.parseDaysOfWeek(config)); })($self), sys.Type.find("sys::Weekday[]?"));
    $self.#daysOfMonth = sys.ObjUtil.coerce(((this$) => { let $_u11 = ScheduleSubscription.parseDaysOfMonth(config); if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(ScheduleSubscription.parseDaysOfMonth(config)); })($self), sys.Type.find("sys::Int[]?"));
    if (($self.#freq == null && $self.#times == null)) {
      throw sys.Err.make("Must define either obsScheduleFreq or obsScheduleTimes");
    }
    ;
    if (($self.#freq != null && $self.#times != null)) {
      throw sys.Err.make("Cannot define both obsScheduleFreq and obsScheduleTimes");
    }
    ;
    return;
  }

  static parseFreq(config) {
    let val = config.get("obsScheduleFreq");
    if (val == null) {
      return null;
    }
    ;
    let dur = ((this$) => { let $_u12 = ((this$) => { let $_u13 = sys.ObjUtil.as(val, haystack.Number.type$); if ($_u13 == null) return null; return sys.ObjUtil.as(val, haystack.Number.type$).toDuration(false); })(this$); if ($_u12 != null) return $_u12; throw sys.Err.make("obsScheduleFreq must be duration"); })(this);
    if (sys.ObjUtil.compareLT(dur, sys.Duration.fromStr("1sec"))) {
      throw sys.Err.make("obsScheduleFreq cannot be less than 1sec");
    }
    ;
    return dur;
  }

  static parseTimes(config) {
    const this$ = this;
    let val = config.get("obsScheduleTimes");
    if (val == null) {
      return null;
    }
    ;
    let times = null;
    try {
      (times = sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).map((item) => {
        return sys.ObjUtil.coerce(item, sys.Time.type$);
      }, sys.Time.type$).sort(), sys.Type.find("sys::Time[]?")));
    }
    catch ($_u14) {
      $_u14 = sys.Err.make($_u14);
      if ($_u14 instanceof sys.Err) {
        let e = $_u14;
        ;
        throw sys.Err.make("obsScheduleTimes must be list of times");
      }
      else {
        throw $_u14;
      }
    }
    ;
    if (times.isEmpty()) {
      return null;
    }
    ;
    return times;
  }

  static parseSpan(config) {
    let val = config.get("obsScheduleSpan");
    if (val == null) {
      return null;
    }
    ;
    return ((this$) => { let $_u15 = sys.ObjUtil.as(val, haystack.Span.type$); if ($_u15 != null) return $_u15; throw sys.Err.make("obsScheduleSpan must be Span"); })(this);
  }

  static parseDaysOfWeek(config) {
    const this$ = this;
    let val = config.get("obsScheduleDaysOfWeek");
    if ((val == null || sys.Str.isEmpty(sys.ObjUtil.toStr(val)))) {
      return null;
    }
    ;
    let weekdays = null;
    try {
      (weekdays = sys.ObjUtil.coerce(sys.Str.split(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).map((s) => {
        return sys.ObjUtil.coerce(sys.Weekday.fromStr(s), sys.Weekday.type$);
      }, sys.Weekday.type$), sys.Type.find("sys::Weekday[]?")));
    }
    catch ($_u16) {
      $_u16 = sys.Err.make($_u16);
      if ($_u16 instanceof sys.Err) {
        let e = $_u16;
        ;
        throw sys.Err.make("obsScheduleDaysOfWeek must be comma separated list of weekdays");
      }
      else {
        throw $_u16;
      }
    }
    ;
    if (weekdays.isEmpty()) {
      return null;
    }
    ;
    weekdays.sort();
    return weekdays;
  }

  static parseDaysOfMonth(config) {
    const this$ = this;
    let val = config.get("obsScheduleDaysOfMonth");
    if ((val == null || sys.Str.isEmpty(sys.ObjUtil.toStr(val)))) {
      return null;
    }
    ;
    let days = null;
    try {
      (days = sys.ObjUtil.coerce(sys.Str.split(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).map((s) => {
        return sys.ObjUtil.coerce(sys.Int.fromStr(s), sys.Int.type$);
      }, sys.Int.type$), sys.Type.find("sys::Int[]?")));
    }
    catch ($_u17) {
      $_u17 = sys.Err.make($_u17);
      if ($_u17 instanceof sys.Err) {
        let e = $_u17;
        ;
        throw sys.Err.make("obsScheduleDaysOfMonth must be comma separated list of integers");
      }
      else {
        throw $_u17;
      }
    }
    ;
    if (days.isEmpty()) {
      return null;
    }
    ;
    days.each((d) => {
      if ((sys.ObjUtil.compareGT(d, 31) || sys.ObjUtil.compareLT(d, -31) || sys.ObjUtil.equals(d, 0))) {
        throw sys.Err.make(sys.Str.plus("obsScheduleDaysOfMonth invalid day: ", sys.ObjUtil.coerce(d, sys.Obj.type$.toNullable())));
      }
      ;
      return;
    });
    days.sort();
    return days;
  }

  isActive(ts) {
    return (this.isActiveSpan(ts) && this.isActiveDaysOfWeek(ts) && this.isActiveDaysOfMonth(ts));
  }

  isActiveSpan(ts) {
    if (this.#span == null) {
      return true;
    }
    ;
    return this.#span.contains(ts);
  }

  isActiveDaysOfWeek(ts) {
    const this$ = this;
    if (this.#daysOfWeek == null) {
      return true;
    }
    ;
    return this.#daysOfWeek.any((weekday) => {
      return ts.weekday() === weekday;
    });
  }

  isActiveDaysOfMonth(ts) {
    const this$ = this;
    if (this.#daysOfMonth == null) {
      return true;
    }
    ;
    return this.#daysOfMonth.any((day) => {
      return ((this$) => { if (sys.ObjUtil.compareGT(day, 0)) return sys.ObjUtil.equals(ts.day(), day); return sys.ObjUtil.equals(ts.day(), sys.Int.plus(sys.Int.plus(ts.month().numDays(ts.year()), day), 1)); })(this$);
    });
  }

}

class RecSubscription extends Subscription {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RecSubscription.type$; }

  #filter = null;

  filter() { return this.#filter; }

  __filter(it) { if (it === undefined) return this.#filter; else this.#filter = it; }

  static make(observable,observer,config) {
    const $self = new RecSubscription();
    RecSubscription.make$($self,observable,observer,config);
    return $self;
  }

  static make$($self,observable,observer,config) {
    Subscription.make$($self, observable, observer, config);
    $self.#filter = RecSubscription.parseFilter(config.get("obsFilter"));
    return;
  }

  static parseFilter(val) {
    if (val == null) {
      return null;
    }
    ;
    if (!sys.ObjUtil.is(val, sys.Str.type$)) {
      if (sys.ObjUtil.is(val, haystack.Filter.type$)) {
        return sys.ObjUtil.coerce(val, haystack.Filter.type$.toNullable());
      }
      ;
      throw sys.Err.make("obsFilter must be filter string");
    }
    ;
    try {
      return haystack.Filter.fromStr(sys.ObjUtil.coerce(val, sys.Str.type$));
    }
    catch ($_u19) {
      $_u19 = sys.Err.make($_u19);
      if ($_u19 instanceof sys.Err) {
        let e = $_u19;
        ;
        throw sys.Err.make(sys.Str.plus("obsFilter invalid: ", e));
      }
      else {
        throw $_u19;
      }
    }
    ;
  }

  include(rec) {
    if (rec.isEmpty()) {
      return false;
    }
    ;
    if (this.#filter == null) {
      return true;
    }
    ;
    return this.#filter.matches(rec);
  }

}

const p = sys.Pod.add$('obs');
const xp = sys.Param.noParams$();
let m;
Observable.type$ = p.at$('Observable','sys::Obj',[],{},8195,Observable);
UnknownObservableErr.type$ = p.at$('UnknownObservableErr','sys::Err',[],{'sys::NoDoc':""},8194,UnknownObservableErr);
UnknownSubscriptionErr.type$ = p.at$('UnknownSubscriptionErr','sys::Err',[],{'sys::NoDoc':""},8194,UnknownSubscriptionErr);
Observer.type$ = p.am$('Observer','sys::Obj',[],{},8451,Observer);
Observation.type$ = p.am$('Observation','sys::Obj',['haystack::Dict'],{},8451,Observation);
HisWriteObservation.type$ = p.at$('HisWriteObservation','sys::Obj',['obs::Observation'],{'sys::NoDoc':""},8194,HisWriteObservation);
MObservation.type$ = p.at$('MObservation','sys::Obj',['obs::Observation'],{},130,MObservation);
Subscription.type$ = p.at$('Subscription','sys::Obj',[],{},8194,Subscription);
CommitObservation.type$ = p.at$('CommitObservation','sys::Obj',['obs::Observation'],{'sys::NoDoc':""},8194,CommitObservation);
CommitObservationAction.type$ = p.at$('CommitObservationAction','sys::Enum',[],{'sys::NoDoc':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,CommitObservationAction);
ScheduleObservable.type$ = p.at$('ScheduleObservable','obs::Observable',[],{'sys::NoDoc':""},8194,ScheduleObservable);
ScheduleSubscription.type$ = p.at$('ScheduleSubscription','obs::Subscription',[],{'sys::NoDoc':""},8194,ScheduleSubscription);
RecSubscription.type$ = p.at$('RecSubscription','obs::Subscription',[],{},8194,RecSubscription);
Observable.type$.af$('subscriptionsRef',67586,'concurrent::AtomicRef',{}).am$('name',270337,'sys::Str',xp,{}).am$('hasSubscriptions',8192,'sys::Bool',xp,{}).am$('subscriptions',8192,'obs::Subscription[]',xp,{}).am$('subscribe',8192,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('unsubscribe',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','obs::Subscription',false)]),{}).am$('unsubscribeAll',8192,'sys::Void',xp,{}).am$('onSubscribe',266240,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('onUnsubscribe',266240,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','obs::Subscription',false)]),{}).am$('makeObservation',8192,'obs::Observation',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',true),new sys.Param('more','haystack::Dict',true)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{});
UnknownObservableErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
UnknownSubscriptionErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('cause','sys::Err?',true)]),{});
Observer.type$.am$('meta',270337,'haystack::Dict',xp,{}).am$('actor',270337,'concurrent::Actor',xp,{}).am$('toActorMsg',270336,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('obs','obs::Observation',false)]),{'sys::NoDoc':""}).am$('toSyncMsg',270336,'sys::Obj?',xp,{'sys::NoDoc':""});
Observation.type$.am$('type',270337,'sys::Str',xp,{}).am$('subType',270337,'sys::Str?',xp,{}).am$('ts',270337,'sys::DateTime',xp,{});
HisWriteObservation.type$.af$('type',336898,'sys::Str',{}).af$('ts',336898,'sys::DateTime',{}).af$('id',336898,'haystack::Ref',{}).af$('rec',73730,'haystack::Dict',{}).af$('count',73730,'haystack::Number',{}).af$('span',73730,'haystack::Span',{}).af$('user',73730,'haystack::Dict?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','obs::Observable',false),new sys.Param('ts','sys::DateTime',false),new sys.Param('id','haystack::Ref',false),new sys.Param('rec','haystack::Dict',false),new sys.Param('count','haystack::Number',false),new sys.Param('span','haystack::Span',false),new sys.Param('user','haystack::Dict?',false)]),{}).am$('subType',271360,'sys::Str?',xp,{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{});
MObservation.type$.af$('type',336898,'sys::Str',{}).af$('ts',336898,'sys::DateTime',{}).af$('more',73730,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','obs::Observable',false),new sys.Param('ts','sys::DateTime',false),new sys.Param('more','haystack::Dict',true)]),{}).am$('subType',271360,'sys::Str?',xp,{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj',false)]),{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
Subscription.type$.af$('observable',73730,'obs::Observable',{}).af$('observer',73730,'obs::Observer',{}).af$('config',73730,'haystack::Dict',{}).af$('activeRef',65666,'concurrent::AtomicBool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','obs::Observable',false),new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('configDebug',8192,'sys::Str',xp,{'sys::NoDoc':""}).am$('isSubscribed',8192,'sys::Bool',xp,{}).am$('isUnsubscribed',8192,'sys::Bool',xp,{}).am$('unsubscribe',8192,'sys::Void',xp,{}).am$('send',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('msg','obs::Observation',false)]),{}).am$('sync',8192,'concurrent::Future',xp,{}).am$('toStr',9216,'sys::Str',xp,{});
CommitObservation.type$.af$('type',336898,'sys::Str',{}).af$('subType',336898,'sys::Str?',{}).af$('ts',336898,'sys::DateTime',{}).af$('id',336898,'haystack::Ref',{}).af$('action',73730,'obs::CommitObservationAction',{}).af$('newRec',73730,'haystack::Dict',{}).af$('oldRec',73730,'haystack::Dict',{}).af$('user',73730,'haystack::Dict?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','obs::Observable',false),new sys.Param('action','obs::CommitObservationAction',false),new sys.Param('ts','sys::DateTime',false),new sys.Param('id','haystack::Ref',false),new sys.Param('oldRec','haystack::Dict',false),new sys.Param('newRec','haystack::Dict',false),new sys.Param('user','haystack::Dict?',false)]),{}).am$('isAdded',8192,'sys::Bool',xp,{}).am$('isUpdated',8192,'sys::Bool',xp,{}).am$('isRemoved',8192,'sys::Bool',xp,{}).am$('recHas',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false)]),{}).am$('tagUpdated',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('tag','sys::Str',false)]),{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{});
CommitObservationAction.type$.af$('added',106506,'obs::CommitObservationAction',{}).af$('updated',106506,'obs::CommitObservationAction',{}).af$('removed',106506,'obs::CommitObservationAction',{}).af$('vals',106498,'obs::CommitObservationAction[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'obs::CommitObservationAction?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ScheduleObservable.type$.af$('nowRef',67586,'concurrent::AtomicRef',{}).am$('name',271360,'sys::Str',xp,{}).am$('now',8192,'sys::DateTime',xp,{}).am$('onSubscribe',271360,'obs::Subscription',sys.List.make(sys.Param.type$,[new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('check',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('nowTime','sys::DateTime',false)]),{}).am$('checkSubscription',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sub','obs::ScheduleSubscription',false),new sys.Param('nowTime','sys::DateTime',false),new sys.Param('nowTicks','sys::Int',false),new sys.Param('msg','obs::Observation',false)]),{}).am$('toLastTime',2048,'sys::Time',sys.List.make(sys.Param.type$,[new sys.Param('sub','obs::ScheduleSubscription',false),new sys.Param('nowTime','sys::DateTime',false)]),{}).am$('fire',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('sub','obs::ScheduleSubscription',false),new sys.Param('nowTime','sys::DateTime',false),new sys.Param('nowTicks','sys::Int',false),new sys.Param('msg','obs::Observation',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ScheduleSubscription.type$.af$('lastTime',73730,'concurrent::AtomicRef',{}).af$('lastTicks',73730,'concurrent::AtomicInt',{}).af$('freq',73730,'sys::Duration?',{}).af$('times',73730,'sys::Time[]?',{}).af$('timesFired',73730,'concurrent::AtomicBool[]?',{}).af$('span',73730,'haystack::Span?',{}).af$('daysOfMonth',73730,'sys::Int[]?',{}).af$('daysOfWeek',73730,'sys::Weekday[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','obs::ScheduleObservable',false),new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('parseFreq',40962,'sys::Duration?',sys.List.make(sys.Param.type$,[new sys.Param('config','haystack::Dict',false)]),{}).am$('parseTimes',40962,'sys::Time[]?',sys.List.make(sys.Param.type$,[new sys.Param('config','haystack::Dict',false)]),{}).am$('parseSpan',40962,'haystack::Span?',sys.List.make(sys.Param.type$,[new sys.Param('config','haystack::Dict',false)]),{}).am$('parseDaysOfWeek',40962,'sys::Weekday[]?',sys.List.make(sys.Param.type$,[new sys.Param('config','haystack::Dict',false)]),{}).am$('parseDaysOfMonth',40962,'sys::Int[]?',sys.List.make(sys.Param.type$,[new sys.Param('config','haystack::Dict',false)]),{}).am$('isActive',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{}).am$('isActiveSpan',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{}).am$('isActiveDaysOfWeek',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{}).am$('isActiveDaysOfMonth',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{});
RecSubscription.type$.af$('filter',73730,'haystack::Filter?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('observable','obs::Observable',false),new sys.Param('observer','obs::Observer',false),new sys.Param('config','haystack::Dict',false)]),{}).am$('parseFilter',34818,'haystack::Filter?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('include',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "obs");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;util 1.0;web 1.0;haystack 3.1.11");
m.set("pod.summary", "Observable data stream framework");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:26-05:00 New_York");
m.set("build.tsKey", "241210143126");
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
  Observable,
  UnknownObservableErr,
  UnknownSubscriptionErr,
  Observer,
  Observation,
  HisWriteObservation,
  Subscription,
  CommitObservation,
  CommitObservationAction,
  ScheduleObservable,
  ScheduleSubscription,
  RecSubscription,
};
