// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class AtomicInt extends sys.Obj {
  constructor() {
    super();
    this.peer = new AtomicIntPeer(this);
    const this$ = this;
  }

  typeof() { return AtomicInt.type$; }

  val(it) {
    if (it === undefined) return this.peer.val(this);
    this.peer.val(this, it);
  }

  static make(val) {
    const $self = new AtomicInt();
    AtomicInt.make$($self,val);
    return $self;
  }

  static make$($self,val) {
    if (val === undefined) val = 0;
    $self.val(val);
    return;
  }

  getAndSet(val) {
    return this.peer.getAndSet(this,val);
  }

  compareAndSet(expect,update) {
    return this.peer.compareAndSet(this,expect,update);
  }

  getAndIncrement() {
    return this.peer.getAndIncrement(this);
  }

  getAndDecrement() {
    return this.peer.getAndDecrement(this);
  }

  getAndAdd(delta) {
    return this.peer.getAndAdd(this,delta);
  }

  incrementAndGet() {
    return this.peer.incrementAndGet(this);
  }

  decrementAndGet() {
    return this.peer.decrementAndGet(this);
  }

  addAndGet(delta) {
    return this.peer.addAndGet(this,delta);
  }

  increment() {
    return this.peer.increment(this);
  }

  decrement() {
    return this.peer.decrement(this);
  }

  add(delta) {
    return this.peer.add(this,delta);
  }

  toStr() {
    return sys.Int.toStr(this.val());
  }

}


class AtomicIntPeer extends sys.Obj {
  constructor() { super(); }

  #val = 0;
  val(self, it) {
    if (it === undefined) return this.#val;
    this.#val = it;
  }

  getAndSet(self, val) {
    const old = this.#val;
    this.#val = val;
    return old;
  }

  compareAndSet(self, expect, update) {
    if (this.#val == expect) {
      this.#val = update;
      return true;
    }
    return false;
  }

  getAndIncrement(self) { return this.getAndAdd(self, 1); }

  getAndDecrement(self) { return this.getAndAdd(self, -1); }

  getAndAdd(self, delta) {
    const old = this.#val;
    this.#val = old + delta;
    return old;
  }

  incrementAndGet(self) { return this.addAndGet(self, 1); }

  decrementAndGet(self) { return this.addAndGet(self, -1); }

  addAndGet(self, delta) {
    this.#val = this.#val + delta;
    return this.#val;
  }

  increment(self) { this.add(self, 1); }

  decrement(self) { this.add(self, -1); }

  add(self, delta) { this.#val = this.#val + delta; }
}

class QueueOverflowErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return QueueOverflowErr.type$; }

  static make(msg,cause) {
    const $self = new QueueOverflowErr();
    QueueOverflowErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (msg === undefined) msg = "";
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class NotCompleteErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NotCompleteErr.type$; }

  static make(msg,cause) {
    const $self = new NotCompleteErr();
    NotCompleteErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (msg === undefined) msg = "";
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}



class Actor extends sys.Obj {
  constructor() { super(); }

  typeof() { return Actor.type$; }

  static #locals;

  static locals() {
    if (!Actor.#locals) {
      const k = sys.Str.type$;
      const v = sys.Obj.type$.toNonNullable();
      Actor.#locals = sys.Map.make(k, v);
    }
    return Actor.#locals;
  }
}

class ActorMsg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ActorMsg.type$; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #a = null;

  a() { return this.#a; }

  __a(it) { if (it === undefined) return this.#a; else this.#a = it; }

  #b = null;

  b() { return this.#b; }

  __b(it) { if (it === undefined) return this.#b; else this.#b = it; }

  #c = null;

  c() { return this.#c; }

  __c(it) { if (it === undefined) return this.#c; else this.#c = it; }

  #d = null;

  d() { return this.#d; }

  __d(it) { if (it === undefined) return this.#d; else this.#d = it; }

  #e = null;

  e() { return this.#e; }

  __e(it) { if (it === undefined) return this.#e; else this.#e = it; }

  static make0(id) {
    const $self = new ActorMsg();
    ActorMsg.make0$($self,id);
    return $self;
  }

  static make0$($self,id) {
    $self.#id = sys.ObjUtil.toImmutable(id);
    return;
  }

  static make1(id,a) {
    const $self = new ActorMsg();
    ActorMsg.make1$($self,id,a);
    return $self;
  }

  static make1$($self,id,a) {
    $self.#id = sys.ObjUtil.toImmutable(id);
    $self.#a = ((this$) => { let $_u0 = a; if ($_u0 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    return;
  }

  static make2(id,a,b) {
    const $self = new ActorMsg();
    ActorMsg.make2$($self,id,a,b);
    return $self;
  }

  static make2$($self,id,a,b) {
    $self.#id = sys.ObjUtil.toImmutable(id);
    $self.#a = ((this$) => { let $_u1 = a; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u2 = b; if ($_u2 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    return;
  }

  static make3(id,a,b,c) {
    const $self = new ActorMsg();
    ActorMsg.make3$($self,id,a,b,c);
    return $self;
  }

  static make3$($self,id,a,b,c) {
    $self.#id = sys.ObjUtil.toImmutable(id);
    $self.#a = ((this$) => { let $_u3 = a; if ($_u3 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u4 = b; if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    $self.#c = ((this$) => { let $_u5 = c; if ($_u5 == null) return null; return sys.ObjUtil.toImmutable(c); })($self);
    return;
  }

  static make4(id,a,b,c,d) {
    const $self = new ActorMsg();
    ActorMsg.make4$($self,id,a,b,c,d);
    return $self;
  }

  static make4$($self,id,a,b,c,d) {
    $self.#id = sys.ObjUtil.toImmutable(id);
    $self.#a = ((this$) => { let $_u6 = a; if ($_u6 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u7 = b; if ($_u7 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    $self.#c = ((this$) => { let $_u8 = c; if ($_u8 == null) return null; return sys.ObjUtil.toImmutable(c); })($self);
    $self.#d = ((this$) => { let $_u9 = d; if ($_u9 == null) return null; return sys.ObjUtil.toImmutable(d); })($self);
    return;
  }

  static make5(id,a,b,c,d,e) {
    const $self = new ActorMsg();
    ActorMsg.make5$($self,id,a,b,c,d,e);
    return $self;
  }

  static make5$($self,id,a,b,c,d,e) {
    $self.#id = sys.ObjUtil.toImmutable(id);
    $self.#a = ((this$) => { let $_u10 = a; if ($_u10 == null) return null; return sys.ObjUtil.toImmutable(a); })($self);
    $self.#b = ((this$) => { let $_u11 = b; if ($_u11 == null) return null; return sys.ObjUtil.toImmutable(b); })($self);
    $self.#c = ((this$) => { let $_u12 = c; if ($_u12 == null) return null; return sys.ObjUtil.toImmutable(c); })($self);
    $self.#d = ((this$) => { let $_u13 = d; if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(d); })($self);
    $self.#e = ((this$) => { let $_u14 = e; if ($_u14 == null) return null; return sys.ObjUtil.toImmutable(e); })($self);
    return;
  }

  hash() {
    let hash = sys.ObjUtil.hash(this.#id);
    if (this.#a != null) {
      (hash = sys.Int.xor(hash, sys.ObjUtil.hash(this.#a)));
    }
    ;
    if (this.#b != null) {
      (hash = sys.Int.xor(hash, sys.ObjUtil.hash(this.#b)));
    }
    ;
    if (this.#c != null) {
      (hash = sys.Int.xor(hash, sys.ObjUtil.hash(this.#c)));
    }
    ;
    if (this.#d != null) {
      (hash = sys.Int.xor(hash, sys.ObjUtil.hash(this.#d)));
    }
    ;
    if (this.#e != null) {
      (hash = sys.Int.xor(hash, sys.ObjUtil.hash(this.#e)));
    }
    ;
    return hash;
  }

  equals(that) {
    let m = sys.ObjUtil.as(that, ActorMsg.type$);
    if (m == null) {
      return false;
    }
    ;
    return (sys.ObjUtil.equals(this.#id, m.#id) && sys.ObjUtil.equals(this.#a, m.#a) && sys.ObjUtil.equals(this.#b, m.#b) && sys.ObjUtil.equals(this.#c, m.#c) && sys.ObjUtil.equals(this.#d, m.#d) && sys.ObjUtil.equals(this.#e, m.#e));
  }

  toStr() {
    return ActorMsg.toDebugStr("ActorMsg", this.#id, this.#a, this.#b, this.#c, this.#d, this.#e);
  }

  static toDebugStr(type,id,a,b,c,d,e) {
    if (b === undefined) b = null;
    if (c === undefined) c = null;
    if (d === undefined) d = null;
    if (e === undefined) e = null;
    let s = sys.StrBuf.make();
    s.add(type).add("(").add(id);
    ActorMsg.toDebugArg(s, "a", a);
    ActorMsg.toDebugArg(s, "b", b);
    ActorMsg.toDebugArg(s, "c", c);
    ActorMsg.toDebugArg(s, "d", d);
    ActorMsg.toDebugArg(s, "e", e);
    return s.add(")").toStr();
  }

  static toDebugArg(b,name,arg) {
    if (arg == null) {
      return;
    }
    ;
    b.addChar(32).add(name).addChar(61);
    try {
      let s = sys.ObjUtil.toStr(arg);
      if (sys.ObjUtil.compareLE(sys.Str.size(s), 64)) {
        b.add(s);
      }
      else {
        b.add(sys.Str.getRange(s, sys.Range.make(0, 64))).add("...");
      }
      ;
    }
    catch ($_u15) {
      $_u15 = sys.Err.make($_u15);
      if ($_u15 instanceof sys.Err) {
        let e = $_u15;
        ;
        b.add(e.toStr());
      }
      else {
        throw $_u15;
      }
    }
    ;
    return;
  }

}



class ActorPool extends sys.Obj {
  constructor() {
    super();
  }

  #name = "ActorPool";
  name() { return this.#name; }
  __name(it) { this.#name = it; }

  #maxThreads = 100;
  maxThreads() { return this.#maxThreads; }
  __maxThreads(it) { this.#maxThreads = it; }

  typeof() { return ActorPool.type$; }

  static make(f) {
    const self = new ActorPool();
    ActorPool.make$(self, f);
    return self;
  }

  static make$(self, f) {
    if (f) f(self);
  }
}

class AtomicRef extends sys.Obj {
  constructor() {
    super();
    this.peer = new AtomicRefPeer(this);
    const this$ = this;
  }

  typeof() { return AtomicRef.type$; }

  val(it) {
    if (it === undefined) return this.peer.val(this);
    this.peer.val(this, it);
  }

  static make(val) {
    const $self = new AtomicRef();
    AtomicRef.make$($self,val);
    return $self;
  }

  static make$($self,val) {
    if (val === undefined) val = null;
    $self.val(val);
    return;
  }

  getAndSet(val) {
    return this.peer.getAndSet(this,val);
  }

  compareAndSet(expect,update) {
    return this.peer.compareAndSet(this,expect,update);
  }

  toStr() {
    return sys.ObjUtil.coerce(((this$) => { let $_u16 = ((this$) => { let $_u17 = this$.val(); if ($_u17 == null) return null; return sys.ObjUtil.toStr(this$.val()); })(this$); if ($_u16 != null) return $_u16; return "null"; })(this), sys.Str.type$);
  }

}


class AtomicRefPeer extends sys.Obj {
  constructor() { super(); }

  #val = null;
  val(self, it) {
    if (it === undefined) return this.#val;
    if (!sys.ObjUtil.isImmutable(it)) throw sys.NotImmutableErr.make();
    this.#val = it;
  }

  getAndSet(self, val) {
    if (!sys.ObjUtil.isImmutable(val)) throw sys.NotImmutableErr.make();
    const old = this.#val;
    this.#val = val;
    return old;
  }

  compareAndSet(self, expect, update) {
    if (!sys.ObjUtil.isImmutable(update)) throw sys.NotImmutableErr.make();
    if (this.#val != expect) return false;
    this.#val = update;
    return true;
  }
}



class Lock extends sys.Obj {

  constructor() { super(); }

  typeof() { return Lock.type$; }

  static makeReentrant() { return new Lock(); }

  lock() { }

  unlock() { }

  tryLock(timeout=null) { return true; }

}



class Future extends sys.Obj {

  constructor() { super(); }

  static make$(self, w) {
    self.#wraps = w;
  }

  static makeCompletable() {
    const x = Promise.withResolvers();
    const f = new Future();
    f.#status  = FutureStatus.pending();
    f.#promise = x.promise;
    f.#resolve = x.resolve;
    f.#reject  = x.reject;
    return f;
  }

  static makePromise(promise) {
    const f = new Future();
    f.#status  = FutureStatus.pending();
    f.#promise = promise;
    promise.then(
      (r) => { f.#res = r; f.#status = FutureStatus.ok();  },
      (e) => { f.#err = e; f.#status = FutureStatus.err(); }
    );
    return f;
  }

  typeof() {
    return Future.type$;
  }

  status() {
    if (this.#wraps) return this.#wraps.status();

    if (!this.#status) throw sys.Err.make("Not completable future")
    return this.#status;
  }

  get(timeout) {
    if (this.#wraps) return this.#wraps.get(timeout);

    if (this.#status != FutureStatus.ok()) throw sys.Err.make("Future status not ok: " + this.#status);
    return this.#res
  }

  err() {
    if (this.#wraps) return this.#wraps.err();

    return this.#err
  }

  complete(val) {
    if (this.#wraps) { this.#wraps.complete(val); return this; }

    if (!this.#resolve) throw sys.Err.make("Not completable future")
    this.#status = FutureStatus.ok();
    this.#resolve(val);
    return this;
  }

  completeErr(err) {
    if (this.#wraps) { this.#wraps.completeErr(err); return this; }

    if (!this.#reject) throw sys.Err.make("Not completable future")
    this.#status = FutureStatus.err();
    this.#reject(err);
    return this;
  }

  cancel() {
    throw sys.UnsupportedErr.make("Cancel not supported in JS")
  }

  then(onOk, onErr) {
    return this.wrap(Future.makePromise(this.promise().then(onOk, onErr)));
  }

  promise() {
    if (this.#wraps) { return this.#wraps.promise(); }

    if (!this.#promise) throw sys.Err.make("Future not backed by Promise");
    return this.#promise;
  }

  wraps() {
    return this.#wraps;
  }

  wrap(future) {
    return future;
  }

  #status  = null;
  #promise = null;
  #resolve = null;
  #reject  = null;
  #res     = null;
  #err     = null;
  #wraps   = null;

}




class ActorFuture extends Future {
  constructor() { super(); }

  typeof() { return ActorFuture.type$; }
}

class FutureStatus extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FutureStatus.type$; }

  static pending() { return FutureStatus.vals().get(0); }

  static ok() { return FutureStatus.vals().get(1); }

  static err() { return FutureStatus.vals().get(2); }

  static cancelled() { return FutureStatus.vals().get(3); }

  static #vals = undefined;

  isPending() {
    return this === FutureStatus.pending();
  }

  isComplete() {
    return this !== FutureStatus.pending();
  }

  isOk() {
    return this === FutureStatus.ok();
  }

  isErr() {
    return this === FutureStatus.err();
  }

  isCancelled() {
    return this === FutureStatus.cancelled();
  }

  static make($ordinal,$name) {
    const $self = new FutureStatus();
    FutureStatus.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(FutureStatus.type$, FutureStatus.vals(), name$, checked);
  }

  static vals() {
    if (FutureStatus.#vals == null) {
      FutureStatus.#vals = sys.List.make(FutureStatus.type$, [
        FutureStatus.make(0, "pending", ),
        FutureStatus.make(1, "ok", ),
        FutureStatus.make(2, "err", ),
        FutureStatus.make(3, "cancelled", ),
      ]).toImmutable();
    }
    return FutureStatus.#vals;
  }

  static static$init() {
    const $_u18 = FutureStatus.vals();
    if (true) {
    }
    ;
    return;
  }

}

class ActorContext {
  constructor() {
    const this$ = this;
  }

  typeof() { return ActorContext.type$; }

  static #actorLocalsKey = undefined;

  static actorLocalsKey() {
    if (ActorContext.#actorLocalsKey === undefined) {
      ActorContext.static$init();
      if (ActorContext.#actorLocalsKey === undefined) ActorContext.#actorLocalsKey = null;
    }
    return ActorContext.#actorLocalsKey;
  }

  static curx(checked) {
    if (checked === undefined) checked = true;
    let cx = Actor.locals().get(ActorContext.actorLocalsKey(), null);
    if (cx != null) {
      return sys.ObjUtil.coerce(cx, ActorContext.type$.toNullable());
    }
    ;
    if (checked) {
      throw ContextUnavailableErr.make();
    }
    ;
    return null;
  }

  static static$init() {
    ActorContext.#actorLocalsKey = "cx";
    return;
  }

}

class ContextUnavailableErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ContextUnavailableErr.type$; }

  static make(msg,cause) {
    const $self = new ContextUnavailableErr();
    ContextUnavailableErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (msg === undefined) msg = "";
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class AtomicBool extends sys.Obj {
  constructor() {
    super();
    this.peer = new AtomicBoolPeer(this);
    const this$ = this;
  }

  typeof() { return AtomicBool.type$; }

  val(it) {
    if (it === undefined) return this.peer.val(this);
    this.peer.val(this, it);
  }

  static make(val) {
    const $self = new AtomicBool();
    AtomicBool.make$($self,val);
    return $self;
  }

  static make$($self,val) {
    if (val === undefined) val = false;
    $self.val(val);
    return;
  }

  getAndSet(val) {
    return this.peer.getAndSet(this,val);
  }

  compareAndSet(expect,update) {
    return this.peer.compareAndSet(this,expect,update);
  }

  toStr() {
    return sys.Bool.toStr(this.val());
  }

}


class AtomicBoolPeer extends sys.Obj {
  constructor() { super(); }

  #val = false;
  val(self, it) {
    if (it === undefined) return this.#val;
    this.#val = it;
  }

  getAndSet(self, val) {
    const old = this.#val;
    this.#val = val;
    return old;
  }

  compareAndSet(self, expect, update) {
    if (this.#val == expect) {
      this.#val = update;
      return true;
    }
    return false;
  }
}



class ConcurrentMap extends sys.Obj {
  constructor() {
    super();
    this.#map = sys.Map.make(sys.Obj.type$, sys.Obj.type$);
  }

  #map;

  static make(capacity) {
    const self = new ConcurrentMap();
    return self;
  }

  typeof() { return ConcurrentMap.type$; }

  isEmpty() { return this.#map.isEmpty(); }

  size() { return this.#map.size(); }

  get(key) { return this.#map.get(key); }

  set(key, val) { this.#map.set(key, this.#checkImmutable(val)); }

  getAndSet(key, val) {
    const old = this.get(key);
    this.set(key, val);
    return old;
  }

  add(key, val) {
    if (this.containsKey(key)) throw sys.Err(`Key already mapped: ${key}`);
    this.#map.add(key, this.#checkImmutable(val));
  }

  getOrAdd(key, defVal) {
    let val = this.get(key);
    if (val == null) this.add(key, val = defVal);
    return val;
  }

  setAll(m) {
    if (m.isImmutable()) this.#map.setAll(m);
    else {
      const vals = m.vals();
      for (let i=0; i<vals.size(); ++i) { this.#checkImmutable(vals.get(i)); }
      this.#map.setAll(m);
    }
    return this;
  }

  remove(key) { return this.#map.remove(key); }

  clear() { this.#map.clear(); }

  each(f) { this.#map.each(f); }

  eachWhile(f) { return this.#map.eachWhile(f); }

  containsKey(key) { return this.#map.containsKey(key); }

  keys(of) {
    const array = [];
    this.#map.keys().each((key) => { array.push(key); });
    return sys.List.make(of, array);
  }

  vals(of) {
    const array = [];
    this.#map.vals().each((val) => { array.push(val); });
    return sys.List.make(of, array);
  }

  #checkImmutable(val) {
    if (sys.ObjUtil.isImmutable(val)) return val;
    throw sys.NotImmutableErr.make();
  }
}

class ConcurrentMapTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ConcurrentMapTest.type$; }

  test() {
    const this$ = this;
    let m = ConcurrentMap.make();
    this.verifyConcurrentMap(m, sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
    m.set("a", sys.ObjUtil.coerce(10, sys.Obj.type$));
    this.verifyConcurrentMap(m, sys.Map.__fromLiteral(["a"], [sys.ObjUtil.coerce(10, sys.Int.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
    m.set("b", sys.ObjUtil.coerce(20, sys.Obj.type$));
    this.verifyConcurrentMap(m, sys.Map.__fromLiteral(["a","b"], [sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(20, sys.Int.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
    m.set("b", sys.ObjUtil.coerce(30, sys.Obj.type$));
    this.verifyConcurrentMap(m, sys.Map.__fromLiteral(["a","b"], [sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(30, sys.Int.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
    m.set("c", sys.ObjUtil.coerce(40, sys.Obj.type$));
    this.verifyConcurrentMap(m, sys.Map.__fromLiteral(["a","b","c"], [sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(30, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(40, sys.Int.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
    let count = 0;
    let r = m.eachWhile((x) => {
      count = sys.Int.increment(count);
      return ((this$) => { if (sys.ObjUtil.compareGE(count, 2)) return "break"; return null; })(this$);
    });
    this.verifyEq(r, "break");
    this.verifyEq(sys.ObjUtil.coerce(count, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.Err.type$, (it) => {
      m.add("c", sys.ObjUtil.coerce(50, sys.Obj.type$));
      return;
    });
    this.verifyConcurrentMap(m, sys.Map.__fromLiteral(["a","b","c"], [sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(30, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(40, sys.Int.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
    this.verifyEq(m.remove("notThere"), null);
    this.verifyEq(m.remove("b"), sys.ObjUtil.coerce(30, sys.Obj.type$.toNullable()));
    this.verifyConcurrentMap(m, sys.Map.__fromLiteral(["a","c"], [sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(40, sys.Int.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
    m.clear();
    this.verifyEq(sys.ObjUtil.coerce(m.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyConcurrentMap(m, sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
    this.verifyEq(m.getOrAdd("a", sys.ObjUtil.coerce(10, sys.Obj.type$)), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()));
    this.verifyEq(m.getOrAdd("a", sys.ObjUtil.coerce(20, sys.Obj.type$)), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()));
    this.verifyEq(m.getAndSet("a", sys.ObjUtil.coerce(30, sys.Obj.type$)), sys.ObjUtil.coerce(10, sys.Obj.type$.toNullable()));
    this.verifyEq(m.getAndSet("a", sys.ObjUtil.coerce(40, sys.Obj.type$)), sys.ObjUtil.coerce(30, sys.Obj.type$.toNullable()));
    this.verifyEq(m.getAndSet("b", sys.ObjUtil.coerce(50, sys.Obj.type$)), null);
    m.setAll(sys.Map.__fromLiteral(["a","b","c"], [sys.ObjUtil.coerce(5, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(15, sys.Int.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
    this.verifyConcurrentMap(m, sys.Map.__fromLiteral(["a","b","c"], [sys.ObjUtil.coerce(5, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(15, sys.Int.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
    m.setAll(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.Map.__fromLiteral(["a","b","c"], [sys.ObjUtil.coerce(5, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(15, sys.Int.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int"))), sys.Type.find("[sys::Str:sys::Int]")));
    this.verifyConcurrentMap(m, sys.Map.__fromLiteral(["a","b","c"], [sys.ObjUtil.coerce(5, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(10, sys.Int.type$.toNullable()),sys.ObjUtil.coerce(15, sys.Int.type$.toNullable())], sys.Type.find("sys::Str"), sys.Type.find("sys::Int")));
    let mut = ConcurrentMap.make();
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      mut.set("foo", this$);
      return;
    });
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      mut.add("foo", sys.ObjUtil.coerce(sys.Buf.make(), sys.Obj.type$));
      return;
    });
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      mut.set("foo", sys.List.make(sys.Str.type$));
      return;
    });
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      mut.add("foo", sys.List.make(sys.Str.type$));
      return;
    });
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      mut.getAndSet("foo", sys.List.make(sys.Str.type$));
      return;
    });
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      mut.getOrAdd("foo", sys.List.make(sys.Str.type$));
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(mut.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    return;
  }

  verifyConcurrentMap(m,expected) {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(m.isEmpty(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.isEmpty(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(m.size(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(expected.size(), sys.Obj.type$.toNullable()));
    expected.each((v,k) => {
      this$.verifyEq(m.get(k), v);
      this$.verify(m.containsKey(k));
      return;
    });
    this.verify(!m.containsKey("DNE"));
    let x = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Int"));
    m.each((v,k) => {
      x.set(sys.ObjUtil.coerce(k, sys.Str.type$), sys.ObjUtil.coerce(sys.ObjUtil.coerce(v, sys.Int.type$), sys.Int.type$.toNullable()));
      return;
    });
    this.verifyEq(x, expected);
    let keys = m.keys(sys.Str.type$);
    this.verifyEq(sys.ObjUtil.typeof(keys), sys.Type.find("sys::Str[]"));
    this.verifyEq(keys.sort(), expected.keys().sort());
    let vals = m.vals(sys.Int.type$);
    this.verifyEq(sys.ObjUtil.typeof(vals), sys.Type.find("sys::Int[]"));
    this.verifyEq(vals.sort(), expected.vals().sort());
    return;
  }

  static make() {
    const $self = new ConcurrentMapTest();
    ConcurrentMapTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class AtomicTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AtomicTest.type$; }

  testBool() {
    this.verifyEq(sys.ObjUtil.coerce(AtomicBool.make().val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(AtomicBool.make(true).val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    let a = AtomicBool.make();
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    a.val(true);
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.getAndSet(false), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.compareAndSet(true, true), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.compareAndSet(false, true), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(AtomicBool.make(true).toStr(), "true");
    return;
  }

  testInt() {
    this.verifyEq(sys.ObjUtil.coerce(AtomicInt.make().val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(AtomicInt.make(-55).val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(-55, sys.Obj.type$.toNullable()));
    let a = AtomicInt.make();
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    a.val(3022351611780590);
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3022351611780590, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.getAndSet(1972), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3022351611780590, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1972, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.compareAndSet(1973, 3), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1972, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.compareAndSet(1972, 3), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.getAndIncrement(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.incrementAndGet(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.addAndGet(3), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.getAndAdd(-3), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.decrementAndGet(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.getAndDecrement(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    a.increment();
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    a.increment();
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    a.add(4);
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(9, sys.Obj.type$.toNullable()));
    a.decrement();
    this.verifyEq(sys.ObjUtil.coerce(a.val(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(8, sys.Obj.type$.toNullable()));
    this.verifyEq(AtomicInt.make(-1234).toStr(), "-1234");
    return;
  }

  testRef() {
    const this$ = this;
    this.verifyEq(AtomicRef.make().val(), null);
    this.verifySame(AtomicRef.make("foo").val(), "foo");
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      let x = AtomicRef.make(this$);
      return;
    });
    let a = AtomicRef.make("foo");
    this.verifySame(a.val(), "foo");
    let dt = sys.DateTime.now();
    a.val(dt);
    this.verifySame(a.val(), dt);
    a.val(null);
    this.verifyEq(a.val(), null);
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      a.val(sys.Env.cur().out());
      return;
    });
    this.verifyEq(a.val(), null);
    this.verifyEq(a.getAndSet(dt), null);
    let ver = sys.Version.fromStr("2.0");
    this.verifySame(a.getAndSet(ver), dt);
    this.verifySame(a.val(), ver);
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      a.getAndSet(this$);
      return;
    });
    this.verifySame(a.val(), ver);
    let num = 99;
    this.verifyEq(sys.ObjUtil.coerce(a.compareAndSet(sys.ObjUtil.coerce(num, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(num, sys.Obj.type$.toNullable())), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifySame(a.val(), ver);
    this.verifyEq(sys.ObjUtil.coerce(a.compareAndSet(ver, sys.ObjUtil.coerce(num, sys.Obj.type$.toNullable())), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifySame(a.val(), sys.ObjUtil.coerce(num, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.compareAndSet(null, null), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      a.compareAndSet(sys.ObjUtil.coerce(num, sys.Obj.type$.toNullable()), this$);
      return;
    });
    this.verifySame(a.val(), sys.ObjUtil.coerce(num, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.compareAndSet(sys.ObjUtil.coerce(num, sys.Obj.type$.toNullable()), null), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(a.val(), null);
    this.verifyEq(sys.ObjUtil.coerce(a.compareAndSet("x", "x"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(a.val(), null);
    this.verifyEq(sys.ObjUtil.coerce(a.compareAndSet(null, "x"), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifySame(a.val(), "x");
    this.verifyEq(AtomicRef.make("foo").toStr(), "foo");
    return;
  }

  static make() {
    const $self = new AtomicTest();
    AtomicTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class FutureTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#pool = ActorPool.make();
    return;
  }

  typeof() { return FutureTest.type$; }

  #pool = null;

  pool(it) {
    if (it === undefined) {
      return this.#pool;
    }
    else {
      this.#pool = it;
      return;
    }
  }

  teardown() {
    this.#pool.kill();
    return;
  }

  testCompletable() {
    const this$ = this;
    let f = Future.makeCompletable();
    this.verifyEq(f.status(), FutureStatus.pending());
    this.verifySame(sys.ObjUtil.typeof(f), ActorFuture.type$);
    this.verifySame(sys.ObjUtil.typeof(f).base(), Future.type$);
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      f.complete(this$);
      return;
    });
    this.verifySame(f.status(), FutureStatus.pending());
    this.verifyErr(NotCompleteErr.type$, (it) => {
      f.err();
      return;
    });
    f.complete("done!");
    this.verifySame(f.status(), FutureStatus.ok());
    this.verifyEq(f.get(), "done!");
    this.verifyEq(f.err(), null);
    this.verifyErr(sys.Err.type$, (it) => {
      f.complete("no!");
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      f.completeErr(sys.Err.make());
      return;
    });
    this.verifySame(f.status(), FutureStatus.ok());
    this.verifyEq(f.get(), "done!");
    this.verifyEq(f.err(), null);
    (f = Future.makeCompletable());
    this.verifyEq(f.status(), FutureStatus.pending());
    let err = sys.CastErr.make();
    f.completeErr(err);
    this.verifySame(f.status(), FutureStatus.err());
    this.verifyErr(sys.CastErr.type$, (it) => {
      f.get();
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      f.complete("no!");
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      f.completeErr(sys.Err.make());
      return;
    });
    this.verifySame(f.status(), FutureStatus.err());
    this.verifyErr(sys.CastErr.type$, (it) => {
      f.get();
      return;
    });
    this.verifyEq(sys.ObjUtil.typeof(f.err()), sys.CastErr.type$);
    (f = Future.makeCompletable());
    f.cancel();
    this.verifySame(f.status(), FutureStatus.cancelled());
    this.verifyErr(sys.CancelledErr.type$, (it) => {
      f.get();
      return;
    });
    f.complete("no!");
    f.completeErr(sys.IOErr.make());
    this.verifySame(f.status(), FutureStatus.cancelled());
    this.verifyErr(sys.CancelledErr.type$, (it) => {
      f.get();
      return;
    });
    this.verifyEq(sys.ObjUtil.typeof(f.err()), sys.CancelledErr.type$);
    if (sys.ObjUtil.compareNE(sys.Env.cur().runtime(), "js")) {
      this.verifyErr(sys.UnsupportedErr.type$, (it) => {
        f.promise();
        return;
      });
    }
    else {
      this.verifyNotNull(f.promise());
    }
    ;
    return;
  }

  testThen() {
    const this$ = this;
    let f = Future.makeCompletable();
    this.verifySame(f.status(), FutureStatus.pending());
    let res = null;
    let err = null;
    this.completeLaterOk(f, "okay");
    let f2 = f.then((r) => {
      (res = r);
      return "done!";
    });
    this.verifyEq(f.status(), FutureStatus.ok());
    this.verifyEq(res, "okay");
    this.verifyEq(err, err);
    this.verifyEq(f2.status(), FutureStatus.ok());
    this.verifyEq(f2.get(), "done!");
    this.verifyEq(f2.err(), null);
    (res = (err = null));
    let f3 = f.then((r) => {
      (res = r);
      return "done 3!";
    });
    this.verifyEq(res, "okay");
    this.verifyEq(err, err);
    this.verifyEq(f3.get(), "done 3!");
    (f = Future.makeCompletable());
    this.verifySame(f.status(), FutureStatus.pending());
    (res = (err = null));
    this.completeLaterErr(f, sys.IOErr.make("foo"));
    let f4 = f.then((r) => {
      (res = r);
      return "nope";
    }, (e) => {
      (err = e);
      return "done 4!";
    });
    this.verifyEq(f.status(), FutureStatus.err());
    this.verifyEq(res, null);
    this.verifyEq(((this$) => { let $_u20 = err; if ($_u20 == null) return null; return sys.ObjUtil.toStr(err); })(this), "sys::IOErr: foo");
    this.verifyEq(f4.status(), FutureStatus.ok());
    this.verifyEq(f4.get(), "done 4!");
    this.verifyEq(f4.err(), null);
    (res = (err = null));
    let f5 = f.then((r) => {
      (res = r);
      return "nope";
    }, (e) => {
      (err = e);
      throw sys.Err.make("bad");
    });
    this.verifyEq(f.status(), FutureStatus.err());
    this.verifyEq(res, null);
    this.verifyEq(((this$) => { let $_u21 = err; if ($_u21 == null) return null; return sys.ObjUtil.toStr(err); })(this), "sys::IOErr: foo");
    this.verifyEq(f5.status(), FutureStatus.err());
    this.verifyErr(sys.Err.type$, (it) => {
      f5.get();
      return;
    });
    this.verifyEq(((this$) => { let $_u22 = f5.err(); if ($_u22 == null) return null; return f5.err().toStr(); })(this), "sys::Err: bad");
    (f = Future.makeCompletable());
    this.verifySame(f.status(), FutureStatus.pending());
    (res = (err = null));
    this.completeLaterCancel(f);
    let f6 = f.then((r) => {
      (res = r);
      return "nope";
    }, (e) => {
      (err = e);
      return "done 6!";
    });
    this.verifyEq(f.status(), FutureStatus.cancelled());
    this.verifyEq(res, null);
    this.verifyEq(((this$) => { let $_u23 = err; if ($_u23 == null) return null; return sys.ObjUtil.toStr(err); })(this), "sys::CancelledErr: Future cancelled");
    this.verifyEq(f6.status(), FutureStatus.ok());
    this.verifyEq(f6.get(), "done 6!");
    this.verifyEq(f6.err(), null);
    (f = Future.makeCompletable());
    this.verifySame(f.status(), FutureStatus.pending());
    let acc = sys.List.make(sys.Obj.type$.toNullable());
    this.completeLaterOk(f, "a");
    let f7 = f.then((x) => {
      return sys.Str.plus(sys.ObjUtil.toStr(x), "b");
    }).then((x) => {
      return sys.Str.plus(sys.ObjUtil.toStr(x), "c");
    }).then((x) => {
      return sys.Str.plus(sys.ObjUtil.toStr(x), "d");
    });
    this.verifyEq(f7.get(), "abcd");
    return;
  }

  testSubclass() {
    const this$ = this;
    let w = Future.makeCompletable();
    this.verifyEq(w.wraps(), null);
    this.verifyErr(sys.Err.type$, (it) => {
      w.wrap(w);
      return;
    });
    let f = TestFuture.make(w);
    this.verifySame(sys.ObjUtil.typeof(f), TestFuture.type$);
    this.verifySame(f.wraps(), w);
    this.verifyWrap(f, w);
    this.verifySame(sys.ObjUtil.coerce(f.complete("!"), TestFuture.type$), f);
    this.verifyWrap(f, w);
    this.verifyEq(f.status(), FutureStatus.ok());
    this.verifyEq(f.get(), "!");
    let res = null;
    let f2 = sys.ObjUtil.coerce(f.then((r) => {
      (res = r);
      return "then res";
    }), TestFuture.type$);
    this.verifySame(sys.ObjUtil.typeof(f2), TestFuture.type$);
    this.verifyEq(res, "!");
    this.verifyEq(f2.status(), FutureStatus.ok());
    this.verifyEq(f2.get(), "then res");
    (w = Future.makeCompletable());
    (f = TestFuture.make(w));
    this.verifyWrap(f, w);
    this.verifyEq(f.status(), FutureStatus.pending());
    w.completeErr(sys.IOErr.make("bad"));
    this.verifyWrap(f, w);
    this.verifyEq(f.status(), FutureStatus.err());
    this.verifyEq(((this$) => { let $_u24 = f.err(); if ($_u24 == null) return null; return f.err().toStr(); })(this), "sys::IOErr: bad");
    return;
  }

  verifyWrap(f,w) {
    this.verifySame(f.wraps(), w);
    this.verifyEq(f.status(), w.status());
    if (f.status().isComplete()) {
      this.verifyEq(f.err(), w.err());
      if (f.status().isOk()) {
        this.verifyEq(f.get(), w.get());
      }
      ;
    }
    ;
    return;
  }

  completeLaterOk(f,val) {
    const this$ = this;
    this.callLater((it) => {
      f.complete(val);
      return;
    });
    return;
  }

  completeLaterErr(f,err) {
    const this$ = this;
    this.callLater((it) => {
      f.completeErr(err);
      return;
    });
    return;
  }

  completeLaterCancel(f) {
    const this$ = this;
    this.callLater((it) => {
      f.cancel();
      return;
    });
    return;
  }

  callLater(f) {
    const this$ = this;
    let a = Actor.make(this.#pool, (msg) => {
      sys.Func.call(f, sys.ObjUtil.coerce(msg, sys.Obj.type$));
      return null;
    });
    let fut = a.sendLater(sys.Duration.fromStr("10ms"), "x");
    return;
  }

  static make() {
    const $self = new FutureTest();
    FutureTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

}

class TestFuture extends Future {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TestFuture.type$; }

  static make(wrap) {
    const $self = new TestFuture();
    TestFuture.make$($self,wrap);
    return $self;
  }

  static make$($self,wrap) {
    Future.make$($self, wrap);
    return;
  }

  wrap(wrap) {
    return TestFuture.make(wrap);
  }

}

class ActorTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
    this.#pool = ActorPool.make();
    return;
  }

  typeof() { return ActorTest.type$; }

  #pool = null;

  pool(it) {
    if (it === undefined) {
      return this.#pool;
    }
    else {
      this.#pool = it;
      return;
    }
  }

  static #constObj = undefined;

  static constObj() {
    if (ActorTest.#constObj === undefined) {
      ActorTest.static$init();
      if (ActorTest.#constObj === undefined) ActorTest.#constObj = null;
    }
    return ActorTest.#constObj;
  }

  teardown() {
    this.#pool.kill();
    return;
  }

  testMake() {
    const this$ = this;
    let mutable = (msg) => {
      this$.fail();
      return null;
    };
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = Actor.make(this$.#pool);
      return;
    });
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      let x = Actor.make(this$.#pool, mutable);
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(ActorPool.make().maxThreads(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(ActorPool.make((it) => {
      it.__maxThreads(2);
      return;
    }).maxThreads(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = ActorPool.make((it) => {
        it.__maxThreads(0);
        return;
      });
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = ActorPool.make((it) => {
        it.__maxQueue(0);
        return;
      });
      return;
    });
    this.verifyErr(sys.ArgErr.type$, (it) => {
      let x = ActorPool.make((it) => {
        it.__maxQueue(4294967295);
        return;
      });
      return;
    });
    this.verifyErr(sys.ConstErr.type$, (it) => {
      let x = ActorPool.make();
      sys.ObjUtil.with(x, (it) => {
        it.__maxThreads(0);
        return;
      });
      return;
    });
    return;
  }

  testBasics() {
    const this$ = this;
    let g = ActorPool.make();
    let a = Actor.make(this.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("incr").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")));
    this.verifyType(g, ActorPool.type$);
    this.verifyType(a, Actor.type$);
    this.verifySame(a.pool(), this.#pool);
    this.verifyEq(sys.ObjUtil.coerce(g.isStopped(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(g.isDone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    let futures = sys.List.make(Future.type$);
    sys.Int.times(100, (i) => {
      futures.add(a.send(sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())));
      return;
    });
    futures.each((f,i) => {
      this$.verifyType(f, ActorFuture.type$);
      this$.verifyEq(sys.ObjUtil.typeof(f).base(), Future.type$);
      this$.verifyEq(f.get(), sys.ObjUtil.coerce(sys.Int.plus(i, 1), sys.Obj.type$.toNullable()));
      this$.verifyEq(f.err(), null);
      this$.verifySame(f.status(), FutureStatus.ok());
      this$.verifyEq(f.get(), sys.ObjUtil.coerce(sys.Int.plus(i, 1), sys.Obj.type$.toNullable()));
      this$.verifyEq(f.err(), null);
      return;
    });
    return;
  }

  static incr(msg) {
    return sys.Int.plus(msg, 1);
  }

  testOrdering() {
    const this$ = this;
    let actors = sys.List.make(Actor.type$);
    sys.Int.times(200, (it) => {
      actors.add(Actor.make(this$.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("order").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?"))));
      return;
    });
    sys.Int.times(100000, (i) => {
      actors.get(sys.Int.random(sys.Range.make(0, actors.size(), true))).send(sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      return;
    });
    let futures = sys.List.make(Future.type$);
    actors.each((a,i) => {
      futures.add(a.send(sys.Str.plus("result-", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()))));
      return;
    });
    futures.each((f,i) => {
      let r = sys.ObjUtil.coerce(f.get(), sys.Type.find("sys::Int[]"));
      r.each((v,j) => {
        if (sys.ObjUtil.compareGT(j, 0)) {
          this$.verify(sys.ObjUtil.compareGT(v, r.get(sys.Int.minus(j, 1))));
        }
        ;
        return;
      });
      return;
    });
    return;
  }

  static order(msg) {
    let r = sys.ObjUtil.coerce(Actor.locals().get("foo"), sys.Type.find("sys::Int[]?"));
    if (r == null) {
      Actor.locals().set("foo", (r = sys.List.make(sys.Int.type$)));
    }
    ;
    if (sys.Str.startsWith(sys.ObjUtil.toStr(msg), "result")) {
      return r;
    }
    ;
    r.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(msg, sys.Int.type$), sys.Int.type$.toNullable()));
    return null;
  }

  testMessaging() {
    const this$ = this;
    let a = Actor.make(this.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("messaging").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")));
    let f = a.send("const");
    this.verifySame(f.get(), ActorTest.constObj());
    this.verifySame(f.get(), ActorTest.constObj());
    this.verifySame(f.status(), FutureStatus.ok());
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      a.send(this$);
      return;
    });
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      a.send(sys.ObjUtil.coerce(sys.ObjUtil.with(SerMsg.make(), (it) => {
        it.i(123);
        return;
      }), SerMsg.type$));
      return;
    });
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      a.send("serial").get();
      return;
    });
    this.verifyErr(sys.NotImmutableErr.type$, (it) => {
      a.send("mutable").get();
      return;
    });
    (f = a.send("throw"));
    this.verifyErr(sys.UnknownServiceErr.type$, (it) => {
      f.get();
      return;
    });
    this.verifyErr(sys.UnknownServiceErr.type$, (it) => {
      f.get();
      return;
    });
    this.verifySame(f.status(), FutureStatus.err());
    return;
  }

  static messaging(msg) {
    const this$ = this;
    let $_u25 = msg;
    if (sys.ObjUtil.equals($_u25, "const")) {
      return ActorTest.constObj();
    }
    else if (sys.ObjUtil.equals($_u25, "serial")) {
      return sys.ObjUtil.coerce(sys.ObjUtil.with(SerMsg.make(), (it) => {
        it.i(123);
        return;
      }), SerMsg.type$);
    }
    else if (sys.ObjUtil.equals($_u25, "throw")) {
      throw sys.UnknownServiceErr.make();
    }
    else if (sys.ObjUtil.equals($_u25, "mutable")) {
      return sys.StrBuf.make();
    }
    else {
      return "?";
    }
    ;
  }

  testTimeoutCancel() {
    const this$ = this;
    let a = Actor.make(this.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("sleep").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")));
    let f = a.send(sys.Duration.fromStr("1sec"));
    let t1 = sys.Duration.now();
    this.verifyErr(sys.TimeoutErr.type$, (it) => {
      f.get(sys.Duration.fromStr("50ms"));
      return;
    });
    let t2 = sys.Duration.now();
    this.verify(sys.ObjUtil.compareLT(t2.minus(t1), sys.Duration.fromStr("70ms")), t2.minus(t1).toLocale());
    Actor.make(this.#pool, (msg) => {
      return ActorTest.cancel(sys.ObjUtil.coerce(msg, Future.type$));
    }).send(f);
    this.verifyErr(sys.CancelledErr.type$, (it) => {
      f.get();
      return;
    });
    this.verifyErr(sys.CancelledErr.type$, (it) => {
      f.get();
      return;
    });
    this.verifySame(f.status(), FutureStatus.cancelled());
    return;
  }

  static sleep(msg) {
    if (sys.ObjUtil.is(msg, sys.Duration.type$)) {
      Actor.sleep(sys.ObjUtil.coerce(msg, sys.Duration.type$));
    }
    ;
    return msg;
  }

  static cancel(f) {
    Actor.sleep(sys.Duration.fromStr("20ms"));
    f.cancel();
    return f;
  }

  testStop() {
    const this$ = this;
    let actors = sys.List.make(Actor.type$);
    let durs = sys.List.make(sys.Duration.type$);
    let futures = sys.List.make(Future.type$);
    let scheduled = sys.List.make(Future.type$);
    sys.Int.times(20, (i) => {
      let actor = Actor.make(this$.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("sleep").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")));
      actors.add(actor);
      sys.Int.times(sys.Int.random(sys.Range.make(100, 1000, true)), (j) => {
        actor.send(sys.ObjUtil.coerce(j, sys.Obj.type$.toNullable()));
        return;
      });
      let dur = sys.Duration.fromStr("1ms").multFloat(sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.random(sys.Range.make(0, 300, true)), sys.Num.type$)));
      if (sys.ObjUtil.equals(i, 0)) {
        (dur = sys.Duration.fromStr("300ms"));
      }
      ;
      durs.add(dur);
      futures.add(actor.send(dur));
      sys.Int.times(3, (j) => {
        scheduled.add(actor.sendLater(sys.Duration.fromStr("10sec").plus(sys.Duration.fromStr("1sec").multFloat(sys.Num.toFloat(sys.ObjUtil.coerce(j, sys.Num.type$)))), sys.ObjUtil.coerce(j, sys.Obj.type$.toNullable())));
        return;
      });
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(this.#pool.isStopped(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.#pool.isDone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.Err.type$, (it) => {
      this$.#pool.join();
      return;
    });
    this.verifyErr(sys.Err.type$, (it) => {
      this$.#pool.join(sys.Duration.fromStr("5sec"));
      return;
    });
    let t1 = sys.Duration.now();
    this.verifyErr(sys.TimeoutErr.type$, (it) => {
      this$.#pool.stop().join(sys.Duration.fromStr("100ms"));
      return;
    });
    let t2 = sys.Duration.now();
    this.verify(sys.ObjUtil.compareLE(t2.minus(t1), sys.Duration.fromStr("140ms")));
    this.verifyEq(sys.ObjUtil.coerce(this.#pool.isStopped(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.#pool.isDone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    actors.each((a) => {
      this$.verifyErr(sys.Err.type$, (it) => {
        a.send(sys.Duration.fromStr("10sec"));
        return;
      });
      this$.verifyErr(sys.Err.type$, (it) => {
        a.sendLater(sys.Duration.fromStr("1sec"), sys.Duration.fromStr("1sec"));
        return;
      });
      return;
    });
    this.#pool.stop().join();
    (t2 = sys.Duration.now());
    this.verify(sys.ObjUtil.compareLE(t2.minus(t1), sys.Duration.fromStr("340ms")), t2.minus(t1).toLocale());
    this.verifyEq(sys.ObjUtil.coerce(this.#pool.isStopped(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.#pool.isDone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    futures.each((f) => {
      this$.verify(f.status().isComplete());
      return;
    });
    futures.each((f,i) => {
      this$.verifyEq(f.get(), durs.get(i));
      return;
    });
    this.verifyAllCancelled(scheduled);
    return;
  }

  verifyAllCancelled(futures) {
    const this$ = this;
    futures.each((f) => {
      this$.verifySame(f.status(), FutureStatus.cancelled());
      this$.verifyErr(sys.CancelledErr.type$, (it) => {
        f.get();
        return;
      });
      this$.verifyErr(sys.CancelledErr.type$, (it) => {
        f.get(sys.Duration.fromStr("200ms"));
        return;
      });
      return;
    });
    return;
  }

  testKill() {
    const this$ = this;
    let futures = sys.List.make(Future.type$);
    let durs = sys.List.make(sys.Duration.type$);
    let scheduled = sys.List.make(Future.type$);
    sys.Int.times(200, () => {
      let actor = Actor.make(this$.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("sleep").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")));
      sys.Int.times(6, (i) => {
        let dur = sys.Duration.fromStr("1ms").multFloat(sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.random(sys.Range.make(0, 50, true)), sys.Num.type$)));
        futures.add(actor.send(dur));
        durs.add(dur);
        return;
      });
      scheduled.add(actor.sendLater(sys.Duration.fromStr("3sec"), actor));
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(this.#pool.isStopped(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.#pool.isDone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    let t1 = sys.Duration.now();
    this.#pool.kill();
    this.verifyEq(sys.ObjUtil.coerce(this.#pool.isStopped(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyErr(sys.Err.type$, (it) => {
      Actor.make(this$.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("sleep").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?"))).send(sys.Duration.fromStr("10sec"));
      return;
    });
    this.#pool.join();
    let t2 = sys.Duration.now();
    this.verify(sys.ObjUtil.compareLT(t2.minus(t1), sys.Duration.fromStr("50ms")), t2.minus(t1).toLocale());
    this.verifyEq(sys.ObjUtil.coerce(this.#pool.isStopped(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(this.#pool.isDone(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    futures.each((f,i) => {
      this$.verify(f.status().isComplete(), sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " "), durs.get(i)));
      return;
    });
    futures.each((f,i) => {
      if (sys.ObjUtil.equals(f.status(), FutureStatus.cancelled())) {
        this$.verifyErr(sys.CancelledErr.type$, (it) => {
          f.get();
          return;
        });
      }
      else {
        try {
          this$.verifyEq(f.get(), durs.get(i));
        }
        catch ($_u26) {
          $_u26 = sys.Err.make($_u26);
          if ($_u26 instanceof sys.InterruptedErr) {
            let e = $_u26;
            ;
            this$.verifyErr(sys.InterruptedErr.type$, (it) => {
              f.get();
              return;
            });
          }
          else {
            throw $_u26;
          }
        }
        ;
      }
      ;
      return;
    });
    this.verifyAllCancelled(scheduled);
    return;
  }

  testLater() {
    const this$ = this;
    let receive = (msg) => {
      return ActorTest.returnNow(msg);
    };
    sys.Int.times(5, (it) => {
      Actor.make(this$.#pool, receive).sendLater(sys.Duration.fromStr("10ms"), "dummy");
      return;
    });
    let start = sys.Duration.now();
    let x100 = Actor.make(this.#pool, receive).sendLater(sys.Duration.fromStr("100ms"), null);
    let x150 = Actor.make(this.#pool, receive).sendLater(sys.Duration.fromStr("150ms"), null);
    let x200 = Actor.make(this.#pool, receive).sendLater(sys.Duration.fromStr("200ms"), null);
    let x250 = Actor.make(this.#pool, receive).sendLater(sys.Duration.fromStr("250ms"), null);
    let x300 = Actor.make(this.#pool, receive).sendLater(sys.Duration.fromStr("300ms"), null);
    this.verifyLater(start, x100, sys.Duration.fromStr("100ms"));
    this.verifyLater(start, x150, sys.Duration.fromStr("150ms"));
    this.verifyLater(start, x200, sys.Duration.fromStr("200ms"));
    this.verifyLater(start, x250, sys.Duration.fromStr("250ms"));
    this.verifyLater(start, x300, sys.Duration.fromStr("300ms"));
    (start = sys.Duration.now());
    (x100 = Actor.make(this.#pool, (msg) => {
      return ActorTest.returnNow(msg);
    }).sendLater(sys.Duration.fromStr("100ms"), null));
    this.verifyLater(start, x100, sys.Duration.fromStr("100ms"));
    (start = sys.Duration.now());
    (x300 = Actor.make(this.#pool, receive).sendLater(sys.Duration.fromStr("300ms"), null));
    (x200 = Actor.make(this.#pool, receive).sendLater(sys.Duration.fromStr("200ms"), null));
    (x100 = Actor.make(this.#pool, receive).sendLater(sys.Duration.fromStr("100ms"), null));
    (x150 = Actor.make(this.#pool, receive).sendLater(sys.Duration.fromStr("150ms"), null));
    (x250 = Actor.make(this.#pool, receive).sendLater(sys.Duration.fromStr("250ms"), null));
    this.verifyLater(start, x100, sys.Duration.fromStr("100ms"));
    this.verifyLater(start, x150, sys.Duration.fromStr("150ms"));
    this.verifyLater(start, x200, sys.Duration.fromStr("200ms"));
    this.verifyLater(start, x250, sys.Duration.fromStr("250ms"));
    this.verifyLater(start, x300, sys.Duration.fromStr("300ms"));
    return;
  }

  testLaterRand() {
    const this$ = this;
    sys.Int.times(5, (it) => {
      Actor.make(this$.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("returnNow").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?"))).sendLater(sys.Duration.fromStr("10ms"), "dummy");
      return;
    });
    let start = sys.Duration.now();
    let actors = sys.List.make(Actor.type$);
    let futures = sys.List.make(Future.type$);
    let durs = sys.List.make(sys.Duration.type$.toNullable());
    sys.Int.times(5, () => {
      let a = Actor.make(this$.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("returnNow").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")));
      sys.Int.times(10, () => {
        let dur = sys.Duration.fromStr("1ms").multFloat(sys.Num.toFloat(sys.ObjUtil.coerce(sys.Int.random(sys.Range.make(0, 1000, true)), sys.Num.type$)));
        let f = a.sendLater(sys.ObjUtil.coerce(dur, sys.Duration.type$), dur);
        if (sys.ObjUtil.compareGT(dur, sys.Duration.fromStr("500ms"))) {
          f.cancel();
          (dur = null);
        }
        ;
        durs.add(dur);
        futures.add(f);
        return;
      });
      return;
    });
    futures.each((f,i) => {
      this$.verifyLater(start, f, durs.get(i), sys.Duration.fromStr("100ms"));
      return;
    });
    return;
  }

  verifyLater(start,f,expected,tolerance) {
    if (tolerance === undefined) tolerance = sys.Duration.fromStr("20ms");
    const this$ = this;
    if (expected == null) {
      this.verifySame(f.status(), FutureStatus.cancelled());
      this.verifyErr(sys.CancelledErr.type$, (it) => {
        f.get();
        return;
      });
    }
    else {
      let actual = sys.ObjUtil.coerce(f.get(sys.Duration.fromStr("3sec")), sys.Duration.type$).minus(start);
      let diff = expected.minus(actual).abs();
      this.verify(sys.ObjUtil.compareLT(diff, tolerance), sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", expected.toLocale()), " != "), actual.toLocale()), " ("), diff.toLocale()), ")"));
    }
    ;
    return;
  }

  static returnNow(msg) {
    return sys.Duration.now();
  }

  testWhenComplete() {
    const this$ = this;
    let a = Actor.make(this.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("whenCompleteA").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")));
    let b = Actor.make(this.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("whenCompleteB").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")));
    let c = Actor.make(this.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("whenCompleteB").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")));
    a.send(sys.Duration.fromStr("50ms"));
    let a0 = a.send("start");
    let a1 = a.send("throw");
    let a2 = a.send("cancel");
    a2.cancel();
    this.verifyEq(a0.get(), "start");
    this.verifyErr(sys.IndexErr.type$, (it) => {
      a1.get();
      return;
    });
    this.verifyErr(sys.CancelledErr.type$, (it) => {
      a2.get();
      return;
    });
    let b0 = b.sendWhenComplete(a0, a0);
    let c0 = c.sendWhenComplete(a0, a0);
    let b1 = b.sendWhenComplete(a1, a1);
    let c1 = c.sendWhenComplete(a1, a1);
    let b2 = b.sendWhenComplete(a2, a2);
    let c2 = c.sendWhenComplete(a2, a2);
    a.send(sys.Duration.fromStr("50ms"));
    let a3 = a.send("foo");
    let a4 = a.send("bar");
    let a5 = a.send("throw");
    let ax = a.send("cancel again");
    let a6 = a.send("baz");
    let b3 = b.sendWhenComplete(a3, a3);
    let c3 = c.sendWhenComplete(a3, a3);
    let b4 = b.sendWhenComplete(a4, a4);
    let c4 = c.sendWhenComplete(a4, a4);
    let b5 = b.sendWhenComplete(a5, a5);
    let c5 = c.sendWhenComplete(a5, a5);
    let bx = b.sendWhenComplete(ax, ax);
    let cx = c.sendWhenComplete(ax, ax);
    let b6 = b.sendWhenComplete(a6, a6);
    let c6 = c.sendWhenComplete(a6, a6);
    ax.cancel();
    this.verifyWhenComplete(b0, c0, "start");
    this.verifyWhenComplete(b1, c1, "start,IndexErr");
    this.verifyWhenComplete(b2, c2, "start,IndexErr,CancelledErr");
    this.verifyWhenComplete(bx, cx, "start,IndexErr,CancelledErr,CancelledErr");
    this.verifyWhenComplete(b3, c3, "start,IndexErr,CancelledErr,CancelledErr,foo");
    this.verifyWhenComplete(b4, c4, "start,IndexErr,CancelledErr,CancelledErr,foo,bar");
    this.verifyWhenComplete(b5, c5, "start,IndexErr,CancelledErr,CancelledErr,foo,bar,IndexErr");
    this.verifyWhenComplete(b6, c6, "start,IndexErr,CancelledErr,CancelledErr,foo,bar,IndexErr,baz");
    return;
  }

  verifyWhenComplete(b,c,expected) {
    this.verifyEq(b.get(sys.Duration.fromStr("2sec")), expected);
    this.verifyEq(c.get(sys.Duration.fromStr("2sec")), expected);
    return;
  }

  static whenCompleteA(msg) {
    if (sys.ObjUtil.equals(msg, "throw")) {
      throw sys.IndexErr.make();
    }
    ;
    if (sys.ObjUtil.is(msg, sys.Duration.type$)) {
      Actor.sleep(sys.ObjUtil.coerce(msg, sys.Duration.type$));
    }
    ;
    return msg;
  }

  static whenCompleteB(msg) {
    let x = sys.ObjUtil.coerce(Actor.locals().get("x", ""), sys.Str.type$);
    if (!sys.Str.isEmpty(x)) {
      x = sys.Str.plus(x, ",");
    }
    ;
    if (!msg.status().isComplete()) {
      throw sys.Err.make("not done yet!");
    }
    ;
    try {
      x = sys.Str.plus(x, sys.ObjUtil.toStr(msg.get()));
    }
    catch ($_u27) {
      $_u27 = sys.Err.make($_u27);
      if ($_u27 instanceof sys.Err) {
        let e = $_u27;
        ;
        x = sys.Str.plus(x, sys.Type.of(e).name());
      }
      else {
        throw $_u27;
      }
    }
    ;
    Actor.locals().set("x", x);
    return x;
  }

  testCoalescing() {
    const this$ = this;
    let a = Actor.makeCoalescing(this.#pool, null, null, sys.ObjUtil.coerce(ActorTest.type$.slot("coalesce").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")));
    let fstart = a.send(sys.Duration.fromStr("100ms"));
    let f1s = sys.List.make(Future.type$);
    let f2s = sys.List.make(Future.type$);
    let f3s = sys.List.make(Future.type$);
    let f4s = sys.List.make(Future.type$);
    let ferr = sys.List.make(Future.type$);
    let fcancel = sys.List.make(Future.type$);
    f1s.add(a.send("one"));
    fcancel.add(a.send("cancel"));
    f2s.add(a.send("two"));
    f1s.add(a.send("one"));
    f2s.add(a.send("two"));
    f3s.add(a.send("three"));
    ferr.add(a.send("throw"));
    f4s.add(a.send("four"));
    fcancel.add(a.send("cancel"));
    f1s.add(a.send("one"));
    ferr.add(a.send("throw"));
    f4s.add(a.send("four"));
    fcancel.add(a.send("cancel"));
    fcancel.add(a.send("cancel"));
    f3s.add(a.send("three"));
    ferr.add(a.send("throw"));
    ferr.add(a.send("throw"));
    fcancel.first().cancel();
    a.send(sys.Duration.fromStr("10ms")).get(sys.Duration.fromStr("2sec"));
    this.verifyAllSame(f1s);
    this.verifyAllSame(f2s);
    this.verifyAllSame(f3s);
    this.verifyAllSame(f4s);
    this.verifyAllSame(ferr);
    this.verifyAllSame(fcancel);
    f1s.each((f) => {
      this$.verify(f.status().isComplete());
      this$.verifyEq(f.get(), sys.List.make(sys.Str.type$, ["one"]));
      return;
    });
    f2s.each((f) => {
      this$.verify(f.status().isComplete());
      this$.verifyEq(f.get(), sys.List.make(sys.Str.type$, ["one", "two"]));
      return;
    });
    f3s.each((f) => {
      this$.verify(f.status().isComplete());
      this$.verifyEq(f.get(), sys.List.make(sys.Str.type$, ["one", "two", "three"]));
      return;
    });
    f4s.each((f) => {
      this$.verify(f.status().isComplete());
      this$.verifyEq(f.get(), sys.List.make(sys.Str.type$, ["one", "two", "three", "four"]));
      return;
    });
    ferr.each((f) => {
      this$.verify(f.status().isComplete());
      this$.verifyErr(sys.IndexErr.type$, (it) => {
        f.get();
        return;
      });
      return;
    });
    this.verifyAllCancelled(fcancel);
    return;
  }

  static coalesce(msg) {
    if (sys.ObjUtil.is(msg, sys.Duration.type$)) {
      Actor.sleep(sys.ObjUtil.coerce(msg, sys.Duration.type$));
      Actor.locals().set("msgs", sys.List.make(sys.Str.type$));
      return msg;
    }
    ;
    if (sys.ObjUtil.equals(msg, "throw")) {
      throw sys.IndexErr.make("foo bar");
    }
    ;
    let msgs = sys.ObjUtil.coerce(Actor.locals().get("msgs"), sys.Type.find("sys::Str[]"));
    msgs.add(sys.ObjUtil.coerce(msg, sys.Str.type$));
    return msgs;
  }

  verifyAllSame(list) {
    const this$ = this;
    let x = list.first();
    list.each((y) => {
      this$.verifySame(x, y);
      return;
    });
    return;
  }

  testCoalescingFunc() {
    const this$ = this;
    let a = Actor.makeCoalescing(this.#pool, sys.ObjUtil.coerce(ActorTest.type$.slot("coalesceKey").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")), sys.ObjUtil.coerce(ActorTest.type$.slot("coalesceCoalesce").func(), sys.Type.find("|sys::Obj?,sys::Obj?->sys::Obj?|?")), sys.ObjUtil.coerce(ActorTest.type$.slot("coalesceReceive").func(), sys.Type.find("|sys::Obj?->sys::Obj?|?")));
    let fstart = a.send(sys.Duration.fromStr("100ms"));
    let f1s = sys.List.make(Future.type$);
    let f2s = sys.List.make(Future.type$);
    let f3s = sys.List.make(Future.type$);
    let ferr = sys.List.make(Future.type$);
    let fcancel = sys.List.make(Future.type$);
    ferr.add(a.send(sys.List.make(sys.Str.type$, ["throw"])));
    f1s.add(a.send(sys.List.make(sys.Obj.type$, ["1", sys.ObjUtil.coerce(1, sys.Obj.type$)])));
    f2s.add(a.send(sys.List.make(sys.Obj.type$, ["2", sys.ObjUtil.coerce(10, sys.Obj.type$)])));
    f2s.add(a.send(sys.List.make(sys.Obj.type$, ["2", sys.ObjUtil.coerce(20, sys.Obj.type$)])));
    ferr.add(a.send(sys.List.make(sys.Str.type$, ["throw"])));
    f2s.add(a.send(sys.List.make(sys.Obj.type$, ["2", sys.ObjUtil.coerce(30, sys.Obj.type$)])));
    fcancel.add(a.send(sys.List.make(sys.Str.type$, ["cancel"])));
    fcancel.add(a.send(sys.List.make(sys.Str.type$, ["cancel"])));
    f3s.add(a.send(sys.List.make(sys.Obj.type$, ["3", sys.ObjUtil.coerce(100, sys.Obj.type$)])));
    f1s.add(a.send(sys.List.make(sys.Obj.type$, ["1", sys.ObjUtil.coerce(2, sys.Obj.type$)])));
    f3s.add(a.send(sys.List.make(sys.Obj.type$, ["3", sys.ObjUtil.coerce(200, sys.Obj.type$)])));
    fcancel.add(a.send(sys.List.make(sys.Str.type$, ["cancel"])));
    ferr.add(a.send(sys.List.make(sys.Str.type$, ["throw"])));
    fcancel.first().cancel();
    a.send(sys.Duration.fromStr("10ms")).get(sys.Duration.fromStr("2sec"));
    this.verifyAllSame(f1s);
    this.verifyAllSame(f2s);
    this.verifyAllSame(f3s);
    this.verifyAllSame(ferr);
    this.verifyAllSame(fcancel);
    f1s.each((f) => {
      this$.verify(f.status().isComplete());
      this$.verifyEq(f.get(), sys.List.make(sys.Obj.type$, ["1", sys.ObjUtil.coerce(1, sys.Obj.type$), sys.ObjUtil.coerce(2, sys.Obj.type$)]));
      return;
    });
    f2s.each((f) => {
      this$.verify(f.status().isComplete());
      this$.verifyEq(f.get(), sys.List.make(sys.Obj.type$, ["2", sys.ObjUtil.coerce(10, sys.Obj.type$), sys.ObjUtil.coerce(20, sys.Obj.type$), sys.ObjUtil.coerce(30, sys.Obj.type$)]));
      return;
    });
    f3s.each((f) => {
      this$.verify(f.status().isComplete());
      this$.verifyEq(f.get(), sys.List.make(sys.Obj.type$, ["3", sys.ObjUtil.coerce(100, sys.Obj.type$), sys.ObjUtil.coerce(200, sys.Obj.type$)]));
      return;
    });
    ferr.each((f) => {
      this$.verify(f.status().isComplete());
      this$.verifyErr(sys.IndexErr.type$, (it) => {
        f.get();
        return;
      });
      return;
    });
    this.verifyAllCancelled(fcancel);
    return;
  }

  static coalesceKey(msg) {
    return ((this$) => { if (sys.ObjUtil.is(msg, sys.Type.find("sys::List"))) return sys.ObjUtil.trap(msg,"get", sys.List.make(sys.Obj.type$.toNullable(), [sys.ObjUtil.coerce(0, sys.Int.type$.toNullable())])); return null; })(this);
  }

  static coalesceCoalesce(a,b) {
    return sys.List.make(sys.Obj.type$).add(a.get(0)).addAll(a.getRange(sys.Range.make(1, -1))).addAll(b.getRange(sys.Range.make(1, -1)));
  }

  static coalesceReceive(msg) {
    if (sys.ObjUtil.is(msg, sys.Duration.type$)) {
      Actor.sleep(sys.ObjUtil.coerce(msg, sys.Duration.type$));
      return msg;
    }
    ;
    if (sys.ObjUtil.equals(sys.ObjUtil.trap(msg,"first", sys.List.make(sys.Obj.type$.toNullable(), [])), "throw")) {
      throw sys.IndexErr.make("foo bar");
    }
    ;
    return msg;
  }

  testLocals() {
    const this$ = this;
    let actors = sys.List.make(Actor.type$);
    let locales = sys.List.make(sys.Locale.type$);
    let localesPool = sys.List.make(sys.Locale.type$.toNullable(), [sys.Locale.fromStr("en-US"), sys.Locale.fromStr("en-UK"), sys.Locale.fromStr("fr"), sys.Locale.fromStr("ja")]);
    sys.Int.times(300, (i) => {
      let locale = localesPool.get(sys.Int.random(sys.Range.make(0, localesPool.size(), true)));
      actors.add(Actor.make(this$.#pool, (msg) => {
        return ActorTest.locals(i, sys.ObjUtil.coerce(locale, sys.Locale.type$), msg);
      }));
      locales.add(sys.ObjUtil.coerce(locale, sys.Locale.type$));
      actors.last().send("bar");
      return;
    });
    actors.each((a,i) => {
      this$.verifyEq(a.send("foo").get(), sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " "), locales.get(i)));
      return;
    });
    return;
  }

  static locals(num,locale,msg) {
    if (Actor.locals().get("testLocal") == null) {
      Actor.locals().set("testLocal", sys.ObjUtil.coerce(num, sys.Obj.type$.toNullable()));
      sys.Locale.setCur(locale);
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.ObjUtil.toStr(Actor.locals().get("testLocal")), " "), sys.Locale.cur());
  }

  testFutureWaitFor() {
    const this$ = this;
    let pool = ActorPool.make();
    let a = this.spawnSleeper(pool);
    let f = a.send(sys.Duration.fromStr("100ms"));
    this.verifySame(f.status(), FutureStatus.pending());
    f.waitFor();
    this.verifySame(f.status(), FutureStatus.ok());
    this.verifyEq(f.get(), sys.Duration.fromStr("100ms"));
    f.waitFor();
    f.waitFor(sys.Duration.fromStr("1min"));
    (f = a.send(sys.Duration.fromStr("66ms")));
    this.verifySame(f.status(), FutureStatus.pending());
    f.waitFor(sys.Duration.fromStr("1min"));
    this.verifySame(f.status(), FutureStatus.err());
    this.verifyErr(sys.UnsupportedErr.type$, (it) => {
      f.get();
      return;
    });
    (f = a.send(sys.Duration.fromStr("3min")));
    this.verifySame(f.status(), FutureStatus.pending());
    f.cancel();
    f.waitFor();
    this.verifySame(f.status(), FutureStatus.cancelled());
    this.verifyErr(sys.CancelledErr.type$, (it) => {
      f.get();
      return;
    });
    (f = a.send(sys.Duration.fromStr("1min")));
    this.verifyErr(sys.TimeoutErr.type$, (it) => {
      f.waitFor(sys.Duration.fromStr("100ms"));
      return;
    });
    this.verifySame(f.status(), FutureStatus.pending());
    let t1 = sys.Duration.now();
    let f1 = this.spawnSleeper(pool).send(sys.Duration.fromStr("200ms"));
    let f2 = this.spawnSleeper(pool).send(sys.Duration.fromStr("300ms"));
    let f3 = this.spawnSleeper(pool).send(sys.Duration.fromStr("100ms"));
    let f4 = this.spawnSleeper(pool).send(sys.Duration.fromStr("50ms"));
    Future.waitForAll(sys.List.make(Future.type$, [f1, f2, f3, f4]));
    let t2 = sys.Duration.now();
    let dur = t2.minus(t1);
    let fudge = sys.Duration.fromStr("15ms");
    this.verify((sys.ObjUtil.compareLE(sys.Duration.fromStr("300ms"), dur) && sys.ObjUtil.compareLE(dur, sys.Duration.fromStr("300ms").plus(fudge))));
    (t1 = sys.Duration.now());
    (f1 = this.spawnSleeper(pool).send(sys.Duration.fromStr("200ms")));
    (f2 = this.spawnSleeper(pool).send(sys.Duration.fromStr("50ms")));
    (f3 = this.spawnSleeper(pool).send(sys.Duration.fromStr("300ms")));
    (f4 = this.spawnSleeper(pool).send(sys.Duration.fromStr("100ms")));
    this.verifyErr(sys.TimeoutErr.type$, (it) => {
      Future.waitForAll(sys.List.make(Future.type$, [f1, f2, f3, f4]), sys.Duration.fromStr("250ms"));
      return;
    });
    (t2 = sys.Duration.now());
    (dur = t2.minus(t1));
    this.verify((sys.ObjUtil.compareLE(sys.Duration.fromStr("250ms"), dur) && sys.ObjUtil.compareLE(dur, sys.Duration.fromStr("250ms").plus(fudge))));
    return;
  }

  spawnSleeper(pool) {
    const this$ = this;
    return Actor.make(pool, (msg) => {
      Actor.sleep(sys.ObjUtil.coerce(msg, sys.Duration.type$));
      if (sys.ObjUtil.equals(msg, sys.Duration.fromStr("66ms"))) {
        throw sys.UnsupportedErr.make("bad!");
      }
      ;
      return msg;
    });
  }

  testYields() {
    const this$ = this;
    let pool = ActorPool.make((it) => {
      it.__maxThreads(1);
      it.__maxTimeBeforeYield(sys.Duration.fromStr("100ms"));
      return;
    });
    let a = Actor.make(pool, (msg) => {
      Actor.sleep(sys.Duration.fromStr("50ms"));
      return msg;
    });
    this.verifyEq(a.threadState(), "idle");
    sys.Int.times(5, (i) => {
      a.send(null);
      return;
    });
    let b = Actor.make(pool, (msg) => {
      return sys.Str.plus("ret: ", msg);
    });
    let t1 = sys.Duration.now();
    let f = b.send("x");
    this.verifyEq(a.threadState(), "running");
    this.verifyEq(b.threadState(), "pending");
    this.verifyEq(f.get(), "ret: x");
    let t2 = sys.Duration.now();
    this.verify(sys.ObjUtil.compareLT(t2.minus(t1), sys.Duration.fromStr("120ms")));
    return;
  }

  testBalance() {
    const this$ = this;
    let pool = ActorPool.make((it) => {
      return;
    });
    let a = Actor.make(pool, (msg) => {
      if (sys.ObjUtil.compareNE(msg, "start")) {
        Actor.sleep(sys.Duration.fromStr("100ms"));
      }
      ;
      return msg;
    });
    let b = Actor.make(pool, (msg) => {
      if (sys.ObjUtil.compareNE(msg, "start")) {
        Actor.sleep(sys.Duration.fromStr("100ms"));
      }
      ;
      return msg;
    });
    let c = Actor.make(pool, (msg) => {
      if (sys.ObjUtil.compareNE(msg, "start")) {
        Actor.sleep(sys.Duration.fromStr("100ms"));
      }
      ;
      return msg;
    });
    let d = Actor.make(pool, (msg) => {
      if (sys.ObjUtil.compareNE(msg, "start")) {
        Actor.sleep(sys.Duration.fromStr("100ms"));
      }
      ;
      return msg;
    });
    let e = Actor.make(pool, (msg) => {
      return msg;
    });
    a.send("start").get();
    sys.Int.times(4, (x) => {
      a.send(sys.ObjUtil.coerce(x, sys.Obj.type$.toNullable()));
      return;
    });
    b.send("start").get();
    sys.Int.times(3, (x) => {
      b.send(sys.ObjUtil.coerce(x, sys.Obj.type$.toNullable()));
      return;
    });
    c.send("start").get();
    sys.Int.times(5, (x) => {
      c.send(sys.ObjUtil.coerce(x, sys.Obj.type$.toNullable()));
      return;
    });
    d.send("start").get();
    sys.Int.times(3, (x) => {
      d.send(sys.ObjUtil.coerce(x, sys.Obj.type$.toNullable()));
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(a.queueSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(b.queueSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(c.queueSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(d.queueSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(e.queueSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifySame(pool.balance(sys.List.make(Actor.type$, [a])), a);
    this.verifySame(pool.balance(sys.List.make(Actor.type$, [e])), e);
    this.verifySame(pool.balance(sys.List.make(Actor.type$, [a, b])), b);
    this.verifySame(pool.balance(sys.List.make(Actor.type$, [a, b, c])), b);
    this.verifySame(pool.balance(sys.List.make(Actor.type$, [c, a, b])), b);
    this.verifySame(pool.balance(sys.List.make(Actor.type$, [c, d, a, b])), d);
    this.verifySame(pool.balance(sys.List.make(Actor.type$, [a, b, c, d])), b);
    this.verifySame(pool.balance(sys.List.make(Actor.type$, [d, c, b, a])), d);
    this.verifySame(pool.balance(sys.List.make(Actor.type$, [e, d, c, b, a])), e);
    this.verifySame(pool.balance(sys.List.make(Actor.type$, [a, b, c, d, e])), e);
    this.verifySame(pool.balance(sys.List.make(Actor.type$, [a, b, e, c, d])), e);
    this.verifyErr(sys.IndexErr.type$, (it) => {
      pool.balance(sys.List.make(Actor.type$));
      return;
    });
    return;
  }

  testQueueOverflow() {
    const this$ = this;
    let waitTime = sys.Duration.fromStr("10ms");
    let pool = ActorPool.make((it) => {
      return;
    });
    this.verifyEq(sys.ObjUtil.coerce(pool.maxQueue(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(100000000, sys.Obj.type$.toNullable()));
    (pool = ActorPool.make((it) => {
      it.__maxQueue(4);
      return;
    }));
    this.verifyEq(sys.ObjUtil.coerce(pool.maxQueue(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    let actor = Actor.make(pool, (msg) => {
      Actor.sleep(sys.Duration.fromStr("100ms"));
      return sys.Str.plus("ok ", msg);
    });
    this.verifyEq(sys.ObjUtil.coerce(actor.queueSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(actor.isQueueFull(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    let f0 = actor.send("a");
    let f1 = actor.send("b");
    let f2 = actor.send("c");
    let f3 = actor.send("d");
    while (sys.ObjUtil.equals(actor.queueSize(), 4)) {
      Actor.sleep(waitTime);
    }
    ;
    let f4 = actor.send("e");
    this.verifyEq(sys.ObjUtil.coerce(actor.queueSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(actor.isQueueFull(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    let f5 = actor.send("f");
    this.verifyEq(sys.ObjUtil.coerce(actor.queueSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(actor.isQueueFull(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(f5.status(), FutureStatus.err());
    this.verifyErr(QueueOverflowErr.type$, (it) => {
      f5.get();
      return;
    });
    let f6 = actor.sendWhenComplete(Future.makeCompletable().complete("foo"), "f");
    this.verifyEq(sys.ObjUtil.coerce(actor.queueSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(actor.isQueueFull(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(f6.status(), FutureStatus.err());
    this.verifyErr(QueueOverflowErr.type$, (it) => {
      f6.get();
      return;
    });
    let f7 = actor.sendLater(sys.Duration.fromStr("10ms"), "h");
    while (sys.ObjUtil.equals(actor.queueSize(), 4)) {
      Actor.sleep(waitTime);
    }
    ;
    this.verifyEq(sys.ObjUtil.coerce(actor.queueSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(actor.isQueueFull(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.verifyEq(f7.get(), "ok h");
    return;
  }

  testDiagnostics() {
    const this$ = this;
    let pool = ActorPool.make((it) => {
      return;
    });
    let a = Actor.make(pool, (msg) => {
      Actor.sleep(sys.ObjUtil.coerce(msg, sys.Duration.type$));
      return msg;
    });
    this.verifyDiagnostics(a, 0, 0, 0, sys.Duration.fromStr("0ns"));
    a.send(sys.Duration.fromStr("100ms"));
    a.send(sys.Duration.fromStr("100ms"));
    Actor.sleep(sys.Duration.fromStr("10ms"));
    this.verifyDiagnostics(a, 1, 2, 1, sys.Duration.fromStr("0ns"));
    Actor.sleep(sys.Duration.fromStr("200ms"));
    this.verifyDiagnostics(a, 0, 2, 2, sys.Duration.fromStr("200ms"));
    return;
  }

  verifyDiagnostics(a,queueSize,queuePeak,receiveCount,receiveTicks) {
    this.verifyEq(sys.ObjUtil.coerce(a.queueSize(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(queueSize, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.queuePeak(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(queuePeak, sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(a.receiveCount(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(receiveCount, sys.Obj.type$.toNullable()));
    let diff = sys.Duration.make(sys.Int.abs(sys.Int.minus(receiveTicks.ticks(), a.receiveTicks())));
    this.verify(sys.ObjUtil.compareLT(diff, sys.Duration.fromStr("50ms")));
    return;
  }

  testMsg() {
    this.verifyMsg(ActorMsg.make0("foo"), 0, null, null, null, null, null);
    this.verifyMsg(ActorMsg.make1("foo", "a"), 1, "a", null, null, null, null);
    this.verifyMsg(ActorMsg.make2("foo", "a", "b"), 2, "a", "b", null, null, null);
    this.verifyMsg(ActorMsg.make3("foo", "a", "b", "c"), 3, "a", "b", "c", null, null);
    this.verifyMsg(ActorMsg.make4("foo", "a", "b", "c", "d"), 4, "a", "b", "c", "d", null);
    this.verifyMsg(ActorMsg.make5("foo", "a", "b", "c", "d", "e"), 5, "a", "b", "c", "d", "e");
    this.verifyMsg(ActorMsg.make5("foo", "a", "b", null, "d", "e"), 5, "a", "b", null, "d", "e");
    let m = ActorMsg.make1(sys.ObjUtil.coerce(123, sys.Obj.type$), "alpha");
    this.verifyEq(m.id(), sys.ObjUtil.coerce(123, sys.Obj.type$.toNullable()));
    this.verifyEq(m.a(), "alpha");
    return;
  }

  verifyMsg(m,count,a,b,c,d,e) {
    this.verifyEq(m, ActorMsg.make5("foo", a, b, c, d, e));
    this.verifyEq(m.a(), a);
    this.verifyEq(m.b(), b);
    this.verifyEq(m.c(), c);
    this.verifyEq(m.d(), d);
    this.verifyEq(m.e(), e);
    return;
  }

  static make() {
    const $self = new ActorTest();
    ActorTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    ;
    return;
  }

  static static$init() {
    ActorTest.#constObj = sys.ObjUtil.toImmutable(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Int.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Int.type$.toNullable())]));
    return;
  }

}

class SerMsg extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#i = 7;
    return;
  }

  typeof() { return SerMsg.type$; }

  #i = 0;

  i(it) {
    if (it === undefined) {
      return this.#i;
    }
    else {
      this.#i = it;
      return;
    }
  }

  hash() {
    return this.#i;
  }

  equals(that) {
    return (sys.ObjUtil.is(that, SerMsg.type$) && sys.ObjUtil.equals(this.#i, sys.ObjUtil.trap(that,"i", sys.List.make(sys.Obj.type$.toNullable(), []))));
  }

  static make() {
    const $self = new SerMsg();
    SerMsg.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class LockTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LockTest.type$; }

  test() {
    let pool = ActorPool.make();
    let lock = Lock.makeReentrant();
    let a = LockTestActor.make(pool, "A", lock);
    let b = LockTestActor.make(pool, "B", lock);
    let buf = sys.StrBuf.make();
    let fa = a.send(sys.Unsafe.make(buf));
    let fb = b.send(sys.Unsafe.make(buf));
    Future.waitForAll(sys.List.make(Future.type$, [fa, fb]));
    let actual = buf.toStr();
    this.verify((sys.ObjUtil.equals(actual, "A0 A1 A2 B0 B1 B2") || sys.ObjUtil.equals(actual, "B0 B1 B2 A0 A1 A2")));
    (fa = a.send("tryLock and sleep"));
    (fb = b.send(null));
    this.verify(sys.ObjUtil.compareLT(fb.get(), sys.Duration.fromStr("1ms")));
    (fb = b.send(sys.Duration.fromStr("10ms")));
    this.verify((sys.ObjUtil.compareGT(fb.get(), sys.Duration.fromStr("10ms")) && sys.ObjUtil.compareLT(fb.get(), sys.Duration.fromStr("20ms"))));
    return;
  }

  static make() {
    const $self = new LockTest();
    LockTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class LockTestActor extends Actor {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LockTestActor.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #lock = null;

  lock() { return this.#lock; }

  __lock(it) { if (it === undefined) return this.#lock; else this.#lock = it; }

  static make(pool,name,lock) {
    const $self = new LockTestActor();
    LockTestActor.make$($self,pool,name,lock);
    return $self;
  }

  static make$($self,pool,name,lock) {
    Actor.make$($self, pool);
    $self.#name = name;
    $self.#lock = lock;
    return;
  }

  receive(msg) {
    const this$ = this;
    if (sys.ObjUtil.is(msg, sys.Unsafe.type$)) {
      let buf = sys.ObjUtil.coerce(sys.ObjUtil.coerce(msg, sys.Unsafe.type$).val(), sys.StrBuf.type$);
      this.#lock.lock();
      sys.Int.times(3, (i) => {
        buf.join(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#name), ""), sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable())), " ");
        Actor.sleep(sys.Duration.fromStr("50ms"));
        return;
      });
      this.#lock.unlock();
      return null;
    }
    ;
    if (sys.ObjUtil.equals(msg, "tryLock and sleep")) {
      if (sys.ObjUtil.compareNE(this.#lock.tryLock(), true)) {
        throw sys.Err.make("boom!");
      }
      ;
      Actor.sleep(sys.Duration.fromStr("100ms"));
      this.#lock.unlock();
      return null;
    }
    ;
    let dur = sys.ObjUtil.as(msg, sys.Duration.type$);
    let t1 = sys.Duration.now();
    if (sys.ObjUtil.compareNE(this.#lock.tryLock(dur), false)) {
      throw sys.Err.make("boom!");
    }
    ;
    let t2 = sys.Duration.now();
    return t2.minus(t1);
  }

}

const p = sys.Pod.add$('concurrent');
const xp = sys.Param.noParams$();
let m;
AtomicInt.type$ = p.at$('AtomicInt','sys::Obj',[],{'sys::Js':""},8226,AtomicInt);
QueueOverflowErr.type$ = p.at$('QueueOverflowErr','sys::Err',[],{},8194,QueueOverflowErr);
NotCompleteErr.type$ = p.at$('NotCompleteErr','sys::Err',[],{},8194,NotCompleteErr);
Actor.type$ = p.at$('Actor','sys::Obj',[],{'sys::Js':""},8706,Actor);
ActorMsg.type$ = p.at$('ActorMsg','sys::Obj',[],{'sys::Js':""},8194,ActorMsg);
ActorPool.type$ = p.at$('ActorPool','sys::Obj',[],{'sys::Js':""},8706,ActorPool);
AtomicRef.type$ = p.at$('AtomicRef','sys::Obj',[],{'sys::Js':""},8226,AtomicRef);
Lock.type$ = p.at$('Lock','sys::Obj',[],{'sys::Js':""},8706,Lock);
Future.type$ = p.at$('Future','sys::Obj',[],{'sys::Js':""},8707,Future);
ActorFuture.type$ = p.at$('ActorFuture','concurrent::Future',[],{},674,ActorFuture);
FutureStatus.type$ = p.at$('FutureStatus','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,FutureStatus);
ActorContext.type$ = p.am$('ActorContext','sys::Obj',[],{'sys::Js':""},8449,ActorContext);
ContextUnavailableErr.type$ = p.at$('ContextUnavailableErr','sys::Err',[],{'sys::Js':"",'sys::NoDoc':""},8194,ContextUnavailableErr);
AtomicBool.type$ = p.at$('AtomicBool','sys::Obj',[],{'sys::Js':""},8226,AtomicBool);
ConcurrentMap.type$ = p.at$('ConcurrentMap','sys::Obj',[],{'sys::Js':""},8738,ConcurrentMap);
ConcurrentMapTest.type$ = p.at$('ConcurrentMapTest','sys::Test',[],{'sys::Js':""},8192,ConcurrentMapTest);
AtomicTest.type$ = p.at$('AtomicTest','sys::Test',[],{'sys::Js':""},8192,AtomicTest);
FutureTest.type$ = p.at$('FutureTest','sys::Test',[],{},8192,FutureTest);
TestFuture.type$ = p.at$('TestFuture','concurrent::Future',[],{},130,TestFuture);
ActorTest.type$ = p.at$('ActorTest','sys::Test',[],{},8192,ActorTest);
SerMsg.type$ = p.at$('SerMsg','sys::Obj',[],{'sys::Serializable':""},128,SerMsg);
LockTest.type$ = p.at$('LockTest','sys::Test',[],{},8192,LockTest);
LockTestActor.type$ = p.at$('LockTestActor','concurrent::Actor',[],{},130,LockTestActor);
AtomicInt.type$.af$('val',8704,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',true)]),{}).am$('getAndSet',8704,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',false)]),{}).am$('compareAndSet',8704,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('expect','sys::Int',false),new sys.Param('update','sys::Int',false)]),{}).am$('getAndIncrement',8704,'sys::Int',xp,{}).am$('getAndDecrement',8704,'sys::Int',xp,{}).am$('getAndAdd',8704,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('delta','sys::Int',false)]),{}).am$('incrementAndGet',8704,'sys::Int',xp,{}).am$('decrementAndGet',8704,'sys::Int',xp,{}).am$('addAndGet',8704,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('delta','sys::Int',false)]),{}).am$('increment',8704,'sys::Void',xp,{}).am$('decrement',8704,'sys::Void',xp,{}).am$('add',8704,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('delta','sys::Int',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
QueueOverflowErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true),new sys.Param('cause','sys::Err?',true)]),{});
NotCompleteErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true),new sys.Param('cause','sys::Err?',true)]),{});
Actor.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pool','concurrent::ActorPool',false),new sys.Param('receive','|sys::Obj?->sys::Obj?|?',true)]),{}).am$('makeCoalescing',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pool','concurrent::ActorPool',false),new sys.Param('toKey','|sys::Obj?->sys::Obj?|?',false),new sys.Param('coalesce','|sys::Obj?,sys::Obj?->sys::Obj?|?',false),new sys.Param('receive','|sys::Obj?->sys::Obj?|?',true)]),{}).am$('pool',8192,'concurrent::ActorPool',xp,{}).am$('send',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('sendLater',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('d','sys::Duration',false),new sys.Param('msg','sys::Obj?',false)]),{}).am$('sendWhenComplete',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('f','concurrent::Future',false),new sys.Param('msg','sys::Obj?',false)]),{}).am$('sendWhenDone',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('f','concurrent::Future',false),new sys.Param('msg','sys::Obj?',false)]),{'sys::NoDoc':"",'sys::Deprecated':"sys::Deprecated{msg=\"Use sendWhenComplete\";}"}).am$('receive',266240,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('threadState',8192,'sys::Str',xp,{'sys::NoDoc':""}).am$('isQueueFull',8192,'sys::Bool',xp,{'sys::NoDoc':""}).am$('queueSize',8192,'sys::Int',xp,{'sys::NoDoc':""}).am$('queuePeak',8192,'sys::Int',xp,{'sys::NoDoc':""}).am$('receiveCount',8192,'sys::Int',xp,{'sys::NoDoc':""}).am$('receiveTicks',8192,'sys::Int',xp,{'sys::NoDoc':""}).am$('sleep',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('duration','sys::Duration',false)]),{}).am$('locals',40962,'[sys::Str:sys::Obj?]',xp,{});
ActorMsg.type$.af$('id',73730,'sys::Obj',{}).af$('a',73730,'sys::Obj?',{}).af$('b',73730,'sys::Obj?',{}).af$('c',73730,'sys::Obj?',{}).af$('d',73730,'sys::Obj?',{}).af$('e',73730,'sys::Obj?',{}).am$('make0',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false)]),{}).am$('make1',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false),new sys.Param('a','sys::Obj?',false)]),{}).am$('make2',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false)]),{}).am$('make3',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false),new sys.Param('c','sys::Obj?',false)]),{}).am$('make4',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false),new sys.Param('c','sys::Obj?',false),new sys.Param('d','sys::Obj?',false)]),{}).am$('make5',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false),new sys.Param('c','sys::Obj?',false),new sys.Param('d','sys::Obj?',false),new sys.Param('e','sys::Obj?',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('toDebugStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Str',false),new sys.Param('id','sys::Obj?',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',true),new sys.Param('c','sys::Obj?',true),new sys.Param('d','sys::Obj?',true),new sys.Param('e','sys::Obj?',true)]),{'sys::NoDoc':""}).am$('toDebugArg',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','sys::StrBuf',false),new sys.Param('name','sys::Str',false),new sys.Param('arg','sys::Obj?',false)]),{});
ActorPool.type$.af$('name',73730,'sys::Str',{}).af$('maxThreads',73730,'sys::Int',{}).af$('maxQueue',73730,'sys::Int',{}).af$('maxTimeBeforeYield',73730,'sys::Duration',{'sys::NoDoc':""}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|?',true)]),{}).am$('isStopped',8192,'sys::Bool',xp,{}).am$('isDone',8192,'sys::Bool',xp,{}).am$('stop',8192,'sys::This',xp,{}).am$('kill',8192,'sys::This',xp,{}).am$('join',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('balance',270336,'concurrent::Actor',sys.List.make(sys.Param.type$,[new sys.Param('actors','concurrent::Actor[]',false)]),{'sys::NoDoc':""});
AtomicRef.type$.af$('val',8704,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',true)]),{}).am$('getAndSet',8704,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('compareAndSet',8704,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('expect','sys::Obj?',false),new sys.Param('update','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
Lock.type$.am$('makeReentrant',40962,'concurrent::Lock',xp,{}).am$('make',2052,'sys::Void',xp,{}).am$('lock',8192,'sys::Void',xp,{}).am$('unlock',8192,'sys::Void',xp,{}).am$('tryLock',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{});
Future.type$.am$('makeCompletable',40962,'concurrent::Future',xp,{}).am$('make',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('wrap','concurrent::Future',false)]),{'sys::NoDoc':""}).am$('wraps',8192,'concurrent::Future?',xp,{'sys::NoDoc':""}).am$('wrap',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('wrap','concurrent::Future',false)]),{'sys::NoDoc':""}).am$('get',270336,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('err',8192,'sys::Err?',xp,{}).am$('status',8192,'concurrent::FutureStatus',xp,{}).am$('cancel',8192,'sys::Void',xp,{}).am$('complete',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('completeErr',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err',false)]),{}).am$('then',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('onOk','|sys::Obj?->sys::Obj?|',false),new sys.Param('onErr','|sys::Err->sys::Obj?|?',true)]),{}).am$('promise',8192,'sys::Obj',xp,{}).am$('waitFor',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('timeout','sys::Duration?',true)]),{}).am$('waitForAll',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('futures','concurrent::Future[]',false),new sys.Param('timeout','sys::Duration?',true)]),{});
ActorFuture.type$.am$('wrap',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('wrap','concurrent::Future',false)]),{}).am$('make',139268,'sys::Void',xp,{});
FutureStatus.type$.af$('pending',106506,'concurrent::FutureStatus',{}).af$('ok',106506,'concurrent::FutureStatus',{}).af$('err',106506,'concurrent::FutureStatus',{}).af$('cancelled',106506,'concurrent::FutureStatus',{}).af$('vals',106498,'concurrent::FutureStatus[]',{}).am$('isPending',8192,'sys::Bool',xp,{}).am$('isComplete',8192,'sys::Bool',xp,{}).am$('isOk',8192,'sys::Bool',xp,{}).am$('isErr',8192,'sys::Bool',xp,{}).am$('isCancelled',8192,'sys::Bool',xp,{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'concurrent::FutureStatus?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
ActorContext.type$.af$('actorLocalsKey',106498,'sys::Str',{}).am$('curx',40962,'concurrent::ActorContext?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{'sys::NoDoc':""}).am$('static$init',165890,'sys::Void',xp,{});
ContextUnavailableErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true),new sys.Param('cause','sys::Err?',true)]),{});
AtomicBool.type$.af$('val',8704,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',true)]),{}).am$('getAndSet',8704,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',false)]),{}).am$('compareAndSet',8704,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('expect','sys::Bool',false),new sys.Param('update','sys::Bool',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
ConcurrentMap.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('initialCapacity','sys::Int',true)]),{}).am$('isEmpty',8192,'sys::Bool',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('get',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false)]),{'sys::Operator':""}).am$('set',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false),new sys.Param('val','sys::Obj',false)]),{'sys::Operator':""}).am$('getAndSet',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false),new sys.Param('val','sys::Obj',false)]),{}).am$('add',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false),new sys.Param('val','sys::Obj',false)]),{}).am$('getOrAdd',8192,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false),new sys.Param('defVal','sys::Obj',false)]),{}).am$('setAll',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('m','sys::Map',false)]),{}).am$('remove',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false)]),{}).am$('clear',8192,'sys::Void',xp,{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Obj->sys::Void|',false)]),{}).am$('eachWhile',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Obj->sys::Obj?|',false)]),{}).am$('containsKey',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false)]),{}).am$('keys',8192,'sys::Obj[]',sys.List.make(sys.Param.type$,[new sys.Param('of','sys::Type',false)]),{}).am$('vals',8192,'sys::Obj[]',sys.List.make(sys.Param.type$,[new sys.Param('of','sys::Type',false)]),{});
ConcurrentMapTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('verifyConcurrentMap',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('m','concurrent::ConcurrentMap',false),new sys.Param('expected','[sys::Str:sys::Obj]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
AtomicTest.type$.am$('testBool',8192,'sys::Void',xp,{}).am$('testInt',8192,'sys::Void',xp,{}).am$('testRef',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
FutureTest.type$.af$('pool',73728,'concurrent::ActorPool',{}).am$('teardown',271360,'sys::Void',xp,{}).am$('testCompletable',8192,'sys::Void',xp,{}).am$('testThen',8192,'sys::Void',xp,{}).am$('testSubclass',8192,'sys::Void',xp,{}).am$('verifyWrap',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','concurrent::Future',false),new sys.Param('w','concurrent::Future',false)]),{}).am$('completeLaterOk',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','concurrent::Future',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('completeLaterErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','concurrent::Future',false),new sys.Param('err','sys::Err',false)]),{}).am$('completeLaterCancel',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','concurrent::Future',false)]),{}).am$('callLater',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj->sys::Void|',false)]),{}).am$('make',139268,'sys::Void',xp,{});
TestFuture.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('wrap','concurrent::Future',false)]),{}).am$('wrap',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('wrap','concurrent::Future',false)]),{});
ActorTest.type$.af$('pool',73728,'concurrent::ActorPool',{}).af$('constObj',106498,'sys::Obj',{}).am$('teardown',271360,'sys::Void',xp,{}).am$('testMake',8192,'sys::Void',xp,{}).am$('testBasics',8192,'sys::Void',xp,{}).am$('incr',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Int',false)]),{}).am$('testOrdering',8192,'sys::Void',xp,{}).am$('order',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj',false)]),{}).am$('testMessaging',8192,'sys::Void',xp,{}).am$('messaging',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('testTimeoutCancel',8192,'sys::Void',xp,{}).am$('sleep',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('cancel',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','concurrent::Future',false)]),{}).am$('testStop',8192,'sys::Void',xp,{}).am$('verifyAllCancelled',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('futures','concurrent::Future[]',false)]),{}).am$('testKill',8192,'sys::Void',xp,{}).am$('testLater',8192,'sys::Void',xp,{}).am$('testLaterRand',8192,'sys::Void',xp,{}).am$('verifyLater',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('start','sys::Duration',false),new sys.Param('f','concurrent::Future',false),new sys.Param('expected','sys::Duration?',false),new sys.Param('tolerance','sys::Duration',true)]),{}).am$('returnNow',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('testWhenComplete',8192,'sys::Void',xp,{}).am$('verifyWhenComplete',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('b','concurrent::Future',false),new sys.Param('c','concurrent::Future',false),new sys.Param('expected','sys::Str',false)]),{}).am$('whenCompleteA',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('whenCompleteB',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','concurrent::Future',false)]),{}).am$('testCoalescing',8192,'sys::Void',xp,{}).am$('coalesce',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('verifyAllSame',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj[]',false)]),{}).am$('testCoalescingFunc',8192,'sys::Void',xp,{}).am$('coalesceKey',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('coalesceCoalesce',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Obj[]',false),new sys.Param('b','sys::Obj[]',false)]),{}).am$('coalesceReceive',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{}).am$('testLocals',8192,'sys::Void',xp,{}).am$('locals',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('num','sys::Int',false),new sys.Param('locale','sys::Locale',false),new sys.Param('msg','sys::Obj?',false)]),{}).am$('testFutureWaitFor',8192,'sys::Void',xp,{}).am$('spawnSleeper',8192,'concurrent::Actor',sys.List.make(sys.Param.type$,[new sys.Param('pool','concurrent::ActorPool',false)]),{}).am$('testYields',8192,'sys::Void',xp,{}).am$('testBalance',8192,'sys::Void',xp,{}).am$('testQueueOverflow',8192,'sys::Void',xp,{}).am$('testDiagnostics',8192,'sys::Void',xp,{}).am$('verifyDiagnostics',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('a','concurrent::Actor',false),new sys.Param('queueSize','sys::Int',false),new sys.Param('queuePeak','sys::Int',false),new sys.Param('receiveCount','sys::Int',false),new sys.Param('receiveTicks','sys::Duration',false)]),{}).am$('testMsg',8192,'sys::Void',xp,{}).am$('verifyMsg',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('m','concurrent::ActorMsg',false),new sys.Param('count','sys::Int',false),new sys.Param('a','sys::Obj?',false),new sys.Param('b','sys::Obj?',false),new sys.Param('c','sys::Obj?',false),new sys.Param('d','sys::Obj?',false),new sys.Param('e','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
SerMsg.type$.af$('i',73728,'sys::Int',{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
LockTest.type$.am$('test',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
LockTestActor.type$.af$('name',73730,'sys::Str',{}).af$('lock',73730,'concurrent::Lock',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pool','concurrent::ActorPool',false),new sys.Param('name','sys::Str',false),new sys.Param('lock','concurrent::Lock',false)]),{}).am$('receive',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Obj?',false)]),{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "concurrent");
m.set("pod.version", "1.0.83");
m.set("pod.depends", "sys 1.0");
m.set("pod.summary", "Utilities for concurrent programming");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "");
m.set("build.user", "");
m.set("build.ts", "");
m.set("build.tsKey", "");
m.set("build.compiler", "1.0.83");
m.set("build.platform", "");
m.set("pod.docSrc", "true");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "Fantom");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Fantom Core");
m.set("proj.uri", "https://fantom.org/");
m.set("pod.docApi", "true");
m.set("org.uri", "https://fantom.org/");
m.set("pod.native.java", "true");
m.set("vcs.uri", "https://github.com/fantom-lang/fantom");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "true");
p.__meta(m);



// cjs exports begin
export {
  AtomicInt,
  AtomicIntPeer,
  QueueOverflowErr,
  NotCompleteErr,
  Actor,
  ActorMsg,
  ActorPool,
  AtomicRef,
  AtomicRefPeer,
  Lock,
  Future,
  FutureStatus,
  ActorContext,
  ContextUnavailableErr,
  AtomicBool,
  AtomicBoolPeer,
  ConcurrentMap,
  ConcurrentMapTest,
  AtomicTest,
  FutureTest,
  ActorTest,
  LockTest,
};
