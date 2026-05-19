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
class CNamespace {
  constructor() {
    const this$ = this;
  }

  typeof() { return CNamespace.type$; }

}

class CNode {
  constructor() {
    const this$ = this;
  }

  typeof() { return CNode.type$; }

}

class CSpec {
  constructor() {
    const this$ = this;
  }

  typeof() { return CSpec.type$; }

  isCompound() {
    return ((this.isAnd() || this.isOr()) && this.cofs() != null);
  }

}

class CompFactory extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return CompFactory.type$; }

  #ns = null;

  // private field reflection only
  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #cs = null;

  // private field reflection only
  __cs(it) { if (it === undefined) return this.#cs; else this.#cs = it; }

  #curCompInit = null;

  // private field reflection only
  __curCompInit(it) { if (it === undefined) return this.#curCompInit; else this.#curCompInit = it; }

  #swizzleMap = null;

  // private field reflection only
  __swizzleMap(it) { if (it === undefined) return this.#swizzleMap; else this.#swizzleMap = it; }

  #compSpec$Store = undefined;

  // private field reflection only
  __compSpec$Store(it) { if (it === undefined) return this.#compSpec$Store; else this.#compSpec$Store = it; }

  static create(cs,dicts) {
    const this$ = this;
    return sys.ObjUtil.coerce(CompFactory.process(cs, false, (cf) => {
      return cf.doCreate(dicts);
    }), sys.Type.find("xeto::Comp[]"));
  }

  static initSpi(cs,c,spec) {
    const this$ = this;
    return sys.ObjUtil.coerce(CompFactory.process(cs, true, (cf) => {
      return cf.doInitSpi(c, spec);
    }), xeto.CompSpi.type$);
  }

  static process(cs,reentrant,f) {
    let actorKey = "xetoEnv::cf";
    let cur = concurrent.Actor.locals().get(actorKey);
    if (cur != null) {
      if (reentrant) {
        return sys.Func.call(f, sys.ObjUtil.coerce(cur, CompFactory.type$));
      }
      ;
      throw sys.Err.make("CompSpace.create is not reentrant; cannot call in from ctor");
    }
    ;
    (cur = CompFactory.make(cs));
    concurrent.Actor.locals().set(actorKey, cur);
    let res = null;
    try {
      (res = sys.Func.call(f, sys.ObjUtil.coerce(cur, CompFactory.type$)));
    }
    finally {
      concurrent.Actor.locals().remove(actorKey);
    }
    ;
    return res;
  }

  static make(cs) {
    const $self = new CompFactory();
    CompFactory.make$($self,cs);
    return $self;
  }

  static make$($self,cs) {
    ;
    $self.#cs = cs;
    $self.#ns = cs.ns();
    return;
  }

  doCreate(dicts) {
    const this$ = this;
    dicts.each((dict) => {
      this$.swizzleInit(dict);
      return;
    });
    return sys.ObjUtil.coerce(dicts.map((dict) => {
      let spec = this$.#cs.ns().spec(sys.ObjUtil.toStr(dict.trap("spec", sys.List.make(sys.Obj.type$.toNullable(), []))));
      return this$.reifyComp(sys.ObjUtil.coerce(spec, xeto.Spec.type$), dict);
    }, xeto.Comp.type$), sys.Type.find("xeto::Comp[]"));
  }

  doInitSpi(c,spec) {
    const this$ = this;
    let init = this.#curCompInit;
    this.#curCompInit = null;
    if (init != null) {
      (spec = init.spec());
    }
    ;
    if (spec == null) {
      (spec = this.#ns.specOf(c));
    }
    ;
    let children = null;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.ordered(true);
    acc.set("id", this.newId(((this$) => { let $_u0=init; return ($_u0==null) ? null : $_u0.slots(); })(this)));
    (children = this.initSlots(sys.ObjUtil.coerce(spec, xeto.Spec.type$), acc, children, sys.ObjUtil.coerce(this.#ns.instantiate(sys.ObjUtil.coerce(spec, xeto.Spec.type$)), haystack.Dict.type$)));
    if (init != null) {
      (children = this.initSlots(sys.ObjUtil.coerce(spec, xeto.Spec.type$), acc, children, init.slots()));
    }
    ;
    spec.slots().each((slot) => {
      let name = slot.name();
      if ((!slot.isFunc() || acc.get(name) != null)) {
        return;
      }
      ;
      let method = CompUtil.toHandlerMethod(c, slot);
      if (method != null) {
        acc.set(name, xeto.MethodFunction.make(sys.ObjUtil.coerce(method, sys.Method.type$)));
      }
      ;
      return;
    });
    let spi = MCompSpi.make(this.#cs, c, sys.ObjUtil.coerce(spec, xeto.Spec.type$), acc);
    if (children != null) {
      children.each((kid,name) => {
        spi.addChild(name, kid);
        return;
      });
    }
    ;
    return spi;
  }

  initSlots(spec,acc,children,slots) {
    const this$ = this;
    slots.each((v,n) => {
      if ((sys.ObjUtil.equals(n, "id") || sys.ObjUtil.equals(n, "compName"))) {
        return;
      }
      ;
      let slot = spec.slot(n, false);
      (v = this$.reify(slot, v));
      if (sys.ObjUtil.is(v, xeto.Comp.type$)) {
        if (children == null) {
          (children = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Comp")));
        }
        ;
        children.set(n, sys.ObjUtil.coerce(v, xeto.Comp.type$));
      }
      ;
      acc.set(n, v);
      return;
    });
    return children;
  }

  swizzleInit(dict) {
    const this$ = this;
    let oldId = sys.ObjUtil.as(dict.get("id"), haystack.Ref.type$);
    if (oldId == null) {
      return;
    }
    ;
    if (this.#swizzleMap == null) {
      this.#swizzleMap = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Ref"));
    }
    ;
    let newId = this.genId();
    this.#swizzleMap.set(sys.ObjUtil.coerce(oldId, haystack.Ref.type$), newId);
    dict.each((v,n) => {
      if (sys.ObjUtil.is(v, haystack.Dict.type$)) {
        this$.swizzleInit(sys.ObjUtil.coerce(v, haystack.Dict.type$));
      }
      ;
      return;
    });
    return;
  }

  newId(dict) {
    if ((this.#swizzleMap != null && dict != null)) {
      let oldId = sys.ObjUtil.as(dict.get("id"), haystack.Ref.type$);
      if (oldId != null) {
        let newId = this.#swizzleMap.get(sys.ObjUtil.coerce(oldId, haystack.Ref.type$));
        if (newId != null) {
          return sys.ObjUtil.coerce(newId, haystack.Ref.type$);
        }
        ;
      }
      ;
    }
    ;
    return this.genId();
  }

  swizzleRef(ref) {
    return sys.ObjUtil.coerce(((this$) => { let $_u1 = ((this$) => { let $_u2 = this$.#swizzleMap; if ($_u2 == null) return null; return this$.#swizzleMap.get(ref); })(this$); if ($_u1 != null) return $_u1; return ref; })(this), haystack.Ref.type$);
  }

  genId() {
    return this.#cs.genId();
  }

  reify(slot,v) {
    if (sys.ObjUtil.is(v, haystack.Ref.type$)) {
      return this.swizzleRef(sys.ObjUtil.coerce(v, haystack.Ref.type$));
    }
    ;
    if (sys.ObjUtil.is(v, haystack.Dict.type$)) {
      return this.reifyDict(sys.ObjUtil.coerce(v, haystack.Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(v, sys.Type.find("sys::List"))) {
      return this.reifyList(sys.ObjUtil.coerce(v, sys.Type.find("sys::List")));
    }
    ;
    return v;
  }

  reifyDict(v) {
    const this$ = this;
    let spec = this.dictToSpec(v);
    if ((spec != null && spec.isa(this.compSpec()))) {
      return this.reifyComp(sys.ObjUtil.coerce(spec, xeto.Spec.type$), v);
    }
    ;
    (v = sys.ObjUtil.coerce(v.map((kid) => {
      return this$.reify(null, kid);
    }, sys.Obj.type$), haystack.Dict.type$));
    if ((spec != null && spec.binding().isDict())) {
      return spec.binding().decodeDict(v);
    }
    ;
    return v;
  }

  reifyComp(spec,slots) {
    this.#curCompInit = CompSpiInit.make(spec, slots);
    let comp = this.toCompFantomType(spec).make();
    return sys.ObjUtil.coerce(comp, xeto.Comp.type$);
  }

  reifyList(v) {
    const this$ = this;
    let acc = sys.List.make(v.of(), v.capacity());
    v.each((kid) => {
      acc.add(this$.reify(null, sys.ObjUtil.coerce(kid, sys.Obj.type$)));
      return;
    });
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("sys::List"));
  }

  dictToSpec(dict) {
    let specRef = sys.ObjUtil.as(dict.get("spec"), haystack.Ref.type$);
    if (specRef == null) {
      return null;
    }
    ;
    return this.#ns.spec(specRef.id(), false);
  }

  toCompFantomType(spec) {
    let t = spec.fantomType();
    if (sys.ObjUtil.equals(t, xeto.Dict.type$)) {
      return this.toCompFantomType(sys.ObjUtil.coerce(spec.base(), xeto.Spec.type$));
    }
    ;
    if (t.isMixin()) {
      return sys.ObjUtil.coerce(t.pod().type(sys.Str.plus(t.name(), "Obj")), sys.Type.type$);
    }
    ;
    return t;
  }

  compSpec() {
    if (this.#compSpec$Store === undefined) {
      this.#compSpec$Store = this.compSpec$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#compSpec$Store, xeto.Spec.type$);
  }

  compSpec$Once() {
    return sys.ObjUtil.coerce(this.#cs.ns().lib("sys.comp").spec("Comp"), xeto.Spec.type$);
  }

}

class CompSpiInit extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompSpiInit.type$; }

  #spec = null;

  spec() { return this.#spec; }

  __spec(it) { if (it === undefined) return this.#spec; else this.#spec = it; }

  #slots = null;

  slots() { return this.#slots; }

  __slots(it) { if (it === undefined) return this.#slots; else this.#slots = it; }

  static make(spec,slots) {
    const $self = new CompSpiInit();
    CompSpiInit.make$($self,spec,slots);
    return $self;
  }

  static make$($self,spec,slots) {
    $self.#spec = spec;
    $self.#slots = slots;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus("CompSpiInit { ", this.#spec), " }");
  }

}

class MCompSpi extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#nameRef = "";
    return;
  }

  typeof() { return MCompSpi.type$; }

  #cs = null;

  cs() {
    return this.#cs;
  }

  #comp = null;

  comp() {
    return this.#comp;
  }

  #specRef = null;

  specRef(it) {
    if (it === undefined) {
      return this.#specRef;
    }
    else {
      this.#specRef = it;
      return;
    }
  }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #ver = 0;

  ver(it) {
    if (it === undefined) {
      return this.#ver;
    }
    else {
      this.#ver = it;
      return;
    }
  }

  #parentRef = null;

  parentRef(it) {
    if (it === undefined) {
      return this.#parentRef;
    }
    else {
      this.#parentRef = it;
      return;
    }
  }

  #nameRef = null;

  nameRef(it) {
    if (it === undefined) {
      return this.#nameRef;
    }
    else {
      this.#nameRef = it;
      return;
    }
  }

  #needsExecute = false;

  needsExecute(it) {
    if (it === undefined) {
      return this.#needsExecute;
    }
    else {
      this.#needsExecute = it;
      return;
    }
  }

  #slots = null;

  // private field reflection only
  __slots(it) { if (it === undefined) return this.#slots; else this.#slots = it; }

  #listeners = null;

  // private field reflection only
  __listeners(it) { if (it === undefined) return this.#listeners; else this.#listeners = it; }

  #lastOnTimer = 0;

  // private field reflection only
  __lastOnTimer(it) { if (it === undefined) return this.#lastOnTimer; else this.#lastOnTimer = it; }

  static make(cs,comp,spec,slots) {
    const $self = new MCompSpi();
    MCompSpi.make$($self,cs,comp,spec,slots);
    return $self;
  }

  static make$($self,cs,comp,spec,slots) {
    ;
    $self.#cs = cs;
    $self.#comp = comp;
    $self.#specRef = spec;
    $self.#slots = slots;
    $self.#id = sys.ObjUtil.coerce(slots.getChecked("id"), haystack.Ref.type$);
    return;
  }

  spec() {
    return sys.ObjUtil.coerce(this.#specRef, xeto.Spec.type$);
  }

  dis() {
    return sys.ObjUtil.coerce(((this$) => { let $_u3 = this$.get("dis"); if ($_u3 != null) return $_u3; return this$.toStr(); })(this), sys.Str.type$);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.name()), " @"), this.#id), " ["), this.spec().qname()), "]");
  }

  get(name) {
    return this.#slots.get(name);
  }

  has(name) {
    return this.get(name) != null;
  }

  missing(name) {
    return this.get(name) == null;
  }

  each(f) {
    this.#slots.each(f);
    return;
  }

  eachWhile(f) {
    return this.#slots.eachWhile(f);
  }

  call(name,arg) {
    let val = this.get(name);
    if (val == null) {
      return null;
    }
    ;
    let func = ((this$) => { let $_u4 = sys.ObjUtil.as(val, xeto.Function.type$); if ($_u4 != null) return $_u4; throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Slot ", sys.Str.toCode(name)), " is not Function ["), sys.ObjUtil.typeof(val)), "]")); })(this);
    let r = func.call(this.#comp, arg);
    this.called(name, arg);
    return r;
  }

  callAsync(name,arg,cb) {
    let val = this.get(name);
    if (val == null) {
      sys.Func.call(cb, null, null);
      return;
    }
    ;
    let func = ((this$) => { let $_u5 = sys.ObjUtil.as(val, xeto.Function.type$); if ($_u5 != null) return $_u5; throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Slot ", sys.Str.toCode(name)), " is not Function ["), sys.ObjUtil.typeof(val)), "]")); })(this);
    func.callAsync(this.#comp, arg, cb);
    this.called(name, arg);
    return;
  }

  set(name,val) {
    if (val == null) {
      this.remove(name);
    }
    else {
      MCompSpi.checkName(name);
      this.checkSet(name, sys.ObjUtil.coerce(val, sys.Obj.type$));
      this.doSet(name, this.get(name), sys.ObjUtil.coerce(val, sys.Obj.type$));
    }
    ;
    return;
  }

  add(val,name) {
    if (name != null) {
      if (this.has(sys.ObjUtil.coerce(name, sys.Str.type$))) {
        throw haystack.DuplicateNameErr.make(sys.ObjUtil.coerce(name, sys.Str.type$));
      }
      ;
      MCompSpi.checkName(sys.ObjUtil.coerce(name, sys.Str.type$));
    }
    else {
      (name = this.autoName());
    }
    ;
    this.checkSet(sys.ObjUtil.coerce(name, sys.Str.type$), val);
    this.doSet(sys.ObjUtil.coerce(name, sys.Str.type$), null, val);
    return;
  }

  checkSet(name,val) {
    if (CompUtil.isReservedSlot(name)) {
      throw haystack.InvalidChangeErr.make(sys.Str.plus(sys.Str.plus("'", name), "' may not be modified"));
    }
    ;
    let slot = this.spec().slot(name, false);
    if (slot == null) {
      return null;
    }
    ;
    return;
  }

  static isValidSlotVal(slot,val,valSpec) {
    let slotType = slot.type();
    if (valSpec.isa(slotType)) {
      return true;
    }
    ;
    return sys.ObjUtil.typeof(val) === slotType.fantomType();
  }

  static checkName(name) {
    if (!haystack.Etc.isTagName(name)) {
      throw haystack.InvalidNameErr.make(name);
    }
    ;
    return;
  }

  autoName() {
    for (let i = 0; sys.ObjUtil.compareLT(i, 10000); i = sys.Int.increment(i)) {
      let name = sys.Str.plus("_", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      if (this.missing(name)) {
        return name;
      }
      ;
    }
    ;
    throw sys.Err.make("Too many names!");
  }

  remove(name) {
    if (CompUtil.isReservedSlot(name)) {
      throw haystack.InvalidChangeErr.make(sys.Str.plus(sys.Str.plus("'", name), "' may not be modified"));
    }
    ;
    let slot = this.spec().slot(name, false);
    if ((slot != null && !slot.isMaybe())) {
      if (slot.isFunc()) {
        let method = CompUtil.toHandlerMethod(this.#comp, sys.ObjUtil.coerce(slot, xeto.Spec.type$));
        if (method != null) {
          this.doSet(name, null, xeto.MethodFunction.make(sys.ObjUtil.coerce(method, sys.Method.type$)));
          return;
        }
        ;
      }
      ;
      throw haystack.InvalidChangeErr.make(sys.Str.plus(sys.Str.plus("", slot.qname()), " is required"));
    }
    ;
    this.doRemove(name);
    return;
  }

  doSet(name,oldVal,newVal) {
    if (sys.ObjUtil.is(oldVal, xeto.Comp.type$)) {
      this.removeChild(sys.ObjUtil.coerce(oldVal, xeto.Comp.type$));
    }
    ;
    if (sys.ObjUtil.is(newVal, xeto.Comp.type$)) {
      this.addChild(name, sys.ObjUtil.coerce(newVal, xeto.Comp.type$));
    }
    else {
      if (!sys.ObjUtil.is(newVal, xeto.Function.type$)) {
        (newVal = sys.ObjUtil.toImmutable(newVal));
      }
      ;
    }
    ;
    this.#slots.set(name, newVal);
    this.changed(name, newVal);
    return;
  }

  doRemove(name) {
    let val = this.#slots.remove(name);
    if (sys.ObjUtil.is(val, xeto.Comp.type$)) {
      this.removeChild(sys.ObjUtil.coerce(val, xeto.Comp.type$));
    }
    ;
    this.changed(name, null);
    return;
  }

  addChild(name,child) {
    if (child.spi().parent() != null) {
      throw haystack.AlreadyParentedErr.make(sys.ObjUtil.typeof(child).qname());
    }
    ;
    let childSpi = sys.ObjUtil.coerce(child.spi(), MCompSpi.type$);
    childSpi.#nameRef = name;
    childSpi.#parentRef = this.#comp;
    if (this.isMounted()) {
      this.#cs.mount(child);
    }
    ;
    return;
  }

  removeChild(child) {
    let childSpi = sys.ObjUtil.coerce(child.spi(), MCompSpi.type$);
    childSpi.#nameRef = "";
    childSpi.#parentRef = null;
    if (this.isMounted()) {
      this.#cs.unmount(child);
    }
    ;
    return;
  }

  onChange(name,cb) {
    if (this.#listeners == null) {
      this.#listeners = CompListeners.make();
    }
    ;
    this.#listeners.onChangeAdd(name, cb);
    return;
  }

  onCall(name,cb) {
    if (this.#listeners == null) {
      this.#listeners = CompListeners.make();
    }
    ;
    this.#listeners.onCallAdd(name, cb);
    return;
  }

  onChangeRemove(name,cb) {
    if (this.#listeners == null) {
      return;
    }
    ;
    this.#listeners.onChangeRemove(name, cb);
    return;
  }

  onCallRemove(name,cb) {
    if (this.#listeners == null) {
      return;
    }
    ;
    this.#listeners.onCallRemove(name, cb);
    return;
  }

  called(name,arg) {
    try {
      this.#comp.onCallThis(name, arg);
      if (this.#listeners != null) {
        this.#listeners.fireOnCall(this.#comp, name, arg);
      }
      ;
    }
    catch ($_u6) {
      $_u6 = sys.Err.make($_u6);
      if ($_u6 instanceof sys.Err) {
        let e = $_u6;
        ;
        sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("ERROR: ", this), " onCall"));
        e.trace();
      }
      else {
        throw $_u6;
      }
    }
    ;
    return;
  }

  changed(name,newVal) {
    try {
      this.#comp.onChangePre(name, newVal);
      this.#comp.onChangeThis(name, newVal);
      if (this.isMounted()) {
        this.#cs.change(this, name, newVal);
      }
      ;
      if (this.#listeners != null) {
        this.#listeners.fireOnChange(this.#comp, name, newVal);
      }
      ;
    }
    catch ($_u7) {
      $_u7 = sys.Err.make($_u7);
      if ($_u7 instanceof sys.Err) {
        let e = $_u7;
        ;
        sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("ERROR: ", this), " onChange"));
        e.trace();
      }
      else {
        throw $_u7;
      }
    }
    ;
    return;
  }

  isMounted() {
    return this.#cs.readById(this.#id, false) === this.#comp;
  }

  parent() {
    return this.#parentRef;
  }

  name() {
    return this.#nameRef;
  }

  isBelow(parent) {
    return parent.isAbove(this.#comp);
  }

  isAbove(child) {
    let p = child;
    while (p != null) {
      if (p === this.#comp) {
        return true;
      }
      ;
      (p = p.parent());
    }
    ;
    return false;
  }

  hasChild(name) {
    return sys.ObjUtil.is(this.get(name), xeto.CompObj.type$);
  }

  child(name,checked) {
    let x = sys.ObjUtil.as(this.get(name), xeto.CompObj.type$);
    if (x != null) {
      return x;
    }
    ;
    if (checked) {
      throw haystack.UnknownNameErr.make(name);
    }
    ;
    return null;
  }

  eachChild(f) {
    const this$ = this;
    this.each((v,n) => {
      if (sys.ObjUtil.is(v, xeto.CompObj.type$)) {
        sys.Func.call(f, sys.ObjUtil.coerce(v, xeto.Comp.type$), n);
      }
      ;
      return;
    });
    return;
  }

  links() {
    return sys.ObjUtil.coerce(((this$) => { let $_u8 = this$.get("links"); if ($_u8 != null) return $_u8; return haystack.Etc.links(null); })(this), xeto.Links.type$);
  }

  checkTimer(now) {
    let freq = this.#comp.onExecuteFreq();
    if (freq == null) {
      return;
    }
    ;
    let ticks = now.ticks();
    if (sys.ObjUtil.compareLE(this.#lastOnTimer, 0)) {
      this.#lastOnTimer = ticks;
      return;
    }
    ;
    let elapsed = sys.Int.minus(ticks, this.#lastOnTimer);
    if (sys.ObjUtil.compareLT(elapsed, freq.ticks())) {
      return;
    }
    ;
    this.#lastOnTimer = ticks;
    this.#needsExecute = true;
    return;
  }

  checkExecute(cx) {
    if (!this.#needsExecute) {
      return;
    }
    ;
    this.#needsExecute = false;
    this.pullLinks();
    try {
      this.#comp.onExecute(cx);
    }
    catch ($_u9) {
      $_u9 = sys.Err.make($_u9);
      if ($_u9 instanceof sys.Err) {
        let e = $_u9;
        ;
        sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("ERROR: ", sys.ObjUtil.typeof(this.#comp).name()), ".onExecute"));
        e.trace();
      }
      else {
        throw $_u9;
      }
    }
    ;
    return;
  }

  pullLinks() {
    const this$ = this;
    this.links().eachLink((toSlot,link) => {
      this$.pullLink(toSlot, link);
      return;
    });
    return;
  }

  pullLink(toSlot,link) {
    let fromComp = this.#cs.readById(sys.ObjUtil.coerce(link.fromRef(), haystack.Ref.type$), false);
    if (fromComp == null) {
      return;
    }
    ;
    let val = fromComp.get(link.fromSlot());
    if (val == null) {
      return val;
    }
    ;
    this.set(toSlot, val);
    return;
  }

  dump(con,opts) {
    MCompSpi.doDump(con, this.#comp, null, haystack.Etc.makeDict(opts));
    return;
  }

  static doDump(con,c,name,opts) {
    const this$ = this;
    let s = sys.StrBuf.make();
    if (name != null) {
      s.add(name).add(": ");
    }
    ;
    s.add(c.spec().name()).add(" @ ").add(c.id()).add(" {");
    con.group(s.toStr());
    c.each((v,n) => {
      if ((sys.ObjUtil.equals(n, "id") || sys.ObjUtil.equals(n, "spec") || sys.ObjUtil.equals(n, "dis"))) {
        return;
      }
      ;
      if (MCompSpi.isDefault(c, n, v)) {
        return;
      }
      ;
      if (sys.ObjUtil.is(v, xeto.Comp.type$)) {
        return MCompSpi.doDump(con, sys.ObjUtil.coerce(v, xeto.Comp.type$), n, opts);
      }
      ;
      s.clear().add(n);
      if (v !== haystack.Marker.val()) {
        s.add(": ").add(MCompSpi.dumpValToStr(v));
      }
      ;
      con.info(s.toStr());
      return;
    });
    con.groupEnd().info("}");
    return;
  }

  static isDefault(c,name,val) {
    let slot = c.spec().slot(name, false);
    if (slot == null) {
      return false;
    }
    ;
    let def = slot.meta().get("val");
    if (slot.isList()) {
      return (sys.ObjUtil.is(val, sys.Type.find("sys::List")) && sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).isEmpty());
    }
    ;
    return sys.ObjUtil.equals(def, val);
  }

  static dumpValToStr(val) {
    let s = sys.ObjUtil.toStr(val);
    if (sys.ObjUtil.compareGT(sys.Str.size(s), 80)) {
      (s = sys.Str.getRange(s, sys.Range.make(0, 80)));
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", s), " ["), sys.ObjUtil.typeof(val)), "]");
  }

}

class CompSpaceActor extends concurrent.Actor {
  constructor() {
    super();
    const this$ = this;
    this.#nsRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return CompSpaceActor.type$; }

  #nsRef = null;

  // private field reflection only
  __nsRef(it) { if (it === undefined) return this.#nsRef; else this.#nsRef = it; }

  static make(pool) {
    const $self = new CompSpaceActor();
    CompSpaceActor.make$($self,pool);
    return $self;
  }

  static make$($self,pool) {
    concurrent.Actor.make$($self, pool);
    ;
    return;
  }

  ns() {
    return sys.ObjUtil.coerce(((this$) => { let $_u10 = this$.#nsRef.val(); if ($_u10 != null) return $_u10; throw sys.Err.make("Must call init first"); })(this), xeto.LibNamespace.type$);
  }

  init(csType,args) {
    return this.send(concurrent.ActorMsg.make2("init", csType, args));
  }

  load($xeto) {
    return this.send(concurrent.ActorMsg.make1("load", $xeto));
  }

  save() {
    return this.send(concurrent.ActorMsg.make0("save"));
  }

  execute(now) {
    if (now === undefined) now = sys.DateTime.now(null);
    return this.send(concurrent.ActorMsg.make1("execute", now));
  }

  feedSubscribe(cookie,gridMeta) {
    return this.send(concurrent.ActorMsg.make2("feedSubscribe", cookie, gridMeta));
  }

  feedPoll(cookie) {
    return this.send(concurrent.ActorMsg.make1("feedPoll", cookie));
  }

  feedUnsubscribe(cookie) {
    return this.send(concurrent.ActorMsg.make1("feedUnsubscribe", cookie));
  }

  feedCall(req) {
    return this.send(concurrent.ActorMsg.make1("feedCall", req));
  }

  receive(msgObj) {
    let msg = sys.ObjUtil.coerce(msgObj, concurrent.ActorMsg.type$);
    let state = sys.ObjUtil.as(concurrent.Actor.locals().get("csas"), CompSpaceActorState.type$);
    if (state == null) {
      if (sys.ObjUtil.compareNE(msg.id(), "init")) {
        throw sys.Err.make("Must call init first");
      }
      ;
      (state = this.onInit(sys.ObjUtil.coerce(msg.a(), sys.Type.type$), sys.ObjUtil.coerce(msg.b(), sys.Type.find("sys::Obj?[]"))));
      concurrent.Actor.locals().set("csas", state);
      return this;
    }
    ;
    let cs = state.cs();
    concurrent.Actor.locals().set(CompSpace.actorKey(), cs);
    let $_u11 = msg.id();
    if (sys.ObjUtil.equals($_u11, "execute")) {
      return this.onExecute(sys.ObjUtil.coerce(state, CompSpaceActorState.type$), sys.ObjUtil.coerce(msg.a(), sys.DateTime.type$));
    }
    else if (sys.ObjUtil.equals($_u11, "feedPoll")) {
      return this.onFeedPoll(sys.ObjUtil.coerce(state, CompSpaceActorState.type$), sys.ObjUtil.coerce(msg.a(), sys.Str.type$));
    }
    else if (sys.ObjUtil.equals($_u11, "feedSubscribe")) {
      return this.onFeedSubscribe(sys.ObjUtil.coerce(state, CompSpaceActorState.type$), sys.ObjUtil.coerce(msg.a(), sys.Str.type$), sys.ObjUtil.coerce(msg.b(), haystack.Dict.type$));
    }
    else if (sys.ObjUtil.equals($_u11, "feedUnsubscribe")) {
      return this.onFeedUnsubscribe(sys.ObjUtil.coerce(state, CompSpaceActorState.type$), sys.ObjUtil.coerce(msg.a(), sys.Str.type$));
    }
    else if (sys.ObjUtil.equals($_u11, "feedCall")) {
      return this.onFeedCall(sys.ObjUtil.coerce(state, CompSpaceActorState.type$), sys.ObjUtil.coerce(msg.a(), haystack.Dict.type$));
    }
    else if (sys.ObjUtil.equals($_u11, "load")) {
      return this.onLoad(cs, sys.ObjUtil.coerce(msg.a(), sys.Str.type$));
    }
    else if (sys.ObjUtil.equals($_u11, "save")) {
      return cs.save();
    }
    ;
    return this.onDispatch(msg, cs);
  }

  onDispatch(msg,cs) {
    throw sys.Err.make(sys.Str.plus("Unknown msg id: ", msg));
  }

  onInit(csType,args) {
    let cs = sys.ObjUtil.coerce(csType.make(args), CompSpace.type$);
    this.#nsRef.val(cs.ns());
    let state = CompSpaceActorState.make(cs);
    cs.actorState(state);
    return state;
  }

  onLoad(cs,$xeto) {
    cs.load($xeto);
    return this;
  }

  onExecute(state,now) {
    state.cs().execute(now);
    this.checkHouseKeeping(state, now);
    return this;
  }

  checkHouseKeeping(state,now) {
    if (sys.ObjUtil.compareGT(sys.Int.minus(now.ticks(), state.lastHouseKeeping().ticks()), 5000000000)) {
      state.lastHouseKeeping(now);
      this.onHouseKeeping(state);
    }
    ;
    return;
  }

  onHouseKeeping(state) {
    this.expireFeeds(state);
    return;
  }

  onFeedSubscribe(state,cookie,gridMeta) {
    const this$ = this;
    let cs = state.cs();
    let feed = CompSpaceFeed.make(cookie, cs.ver());
    state.feeds().add(cookie, feed);
    let dicts = sys.List.make(haystack.Dict.type$);
    this.feedEachChild(cs, (comp) => {
      dicts.add(CompUtil.compToDict(comp));
      return;
    });
    return CompUtil.toFeedGrid(gridMeta, cookie, dicts, null);
  }

  onFeedUnsubscribe(state,cookie) {
    state.feeds().remove(cookie);
    return null;
  }

  onFeedPoll(state,cookie) {
    const this$ = this;
    let cs = state.cs();
    let feed = ((this$) => { let $_u12 = state.feeds().get(cookie); if ($_u12 != null) return $_u12; throw sys.Err.make(sys.Str.plus("Unknown feed: ", cookie)); })(this);
    let lastVer = feed.lastPollVer();
    feed.lastPollVer(cs.ver());
    feed.touch();
    let dicts = sys.List.make(haystack.Dict.type$);
    this.feedEachChild(cs, (comp) => {
      if (sys.ObjUtil.compareGT(comp.spi().ver(), lastVer)) {
        dicts.add(CompUtil.compToDict(comp));
      }
      ;
      return;
    });
    let deleted = feed.deleted();
    feed.deleted(null);
    if ((dicts.isEmpty() && deleted == null)) {
      return null;
    }
    ;
    return CompUtil.toFeedGrid(haystack.Etc.dict0(), cookie, dicts, deleted);
  }

  feedEachChild(cs,f) {
    cs.root().eachChild(f);
    return;
  }

  expireFeeds(state) {
    const this$ = this;
    if (state.feeds().isEmpty()) {
      return;
    }
    ;
    let now = sys.Duration.nowTicks();
    let cookies = null;
    state.feeds().each((feed) => {
      let age = sys.Int.minus(now, feed.touched());
      if (sys.ObjUtil.compareLT(age, 60000000000)) {
        return;
      }
      ;
      if (cookies == null) {
        (cookies = sys.List.make(sys.Str.type$));
      }
      ;
      cookies.add(feed.cookie());
      return;
    });
    if (cookies.isEmpty()) {
      return;
    }
    ;
    cookies.each((cookie) => {
      this$.onFeedUnsubscribe(state, cookie);
      return;
    });
    return;
  }

  onFeedCall(state,req) {
    let $_u13 = req.trap("type", sys.List.make(sys.Obj.type$.toNullable(), []));
    if (sys.ObjUtil.equals($_u13, "create")) {
      return this.onFeedCreate(state.cs(), sys.ObjUtil.coerce(req.trap("compSpec", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$), sys.ObjUtil.coerce(req.trap("x", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$), sys.ObjUtil.coerce(req.trap("y", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$));
    }
    else if (sys.ObjUtil.equals($_u13, "layout")) {
      return this.onFeedLayout(state.cs(), sys.ObjUtil.coerce(req.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$), sys.ObjUtil.coerce(req.trap("x", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$), sys.ObjUtil.coerce(req.trap("y", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$), sys.ObjUtil.coerce(req.trap("w", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Number.type$));
    }
    else if (sys.ObjUtil.equals($_u13, "link")) {
      return this.onFeedLink(state.cs(), sys.ObjUtil.coerce(req.trap("fromRef", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$), sys.ObjUtil.coerce(req.trap("fromSlot", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$), sys.ObjUtil.coerce(req.trap("toRef", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$), sys.ObjUtil.coerce(req.trap("toSlot", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$));
    }
    else if (sys.ObjUtil.equals($_u13, "unlink")) {
      return this.onFeedUnlink(state.cs(), sys.ObjUtil.coerce(req.trap("links", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Grid.type$));
    }
    else if (sys.ObjUtil.equals($_u13, "duplicate")) {
      return this.onFeedDuplicate(state.cs(), sys.ObjUtil.coerce(req.trap("ids", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Type.find("haystack::Ref[]")));
    }
    else if (sys.ObjUtil.equals($_u13, "delete")) {
      return this.onFeedDelete(state.cs(), sys.ObjUtil.coerce(req.trap("ids", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Type.find("haystack::Ref[]")));
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unknown feedCall: ", req));
    }
    ;
  }

  onFeedCreate(cs,specRef,x,y) {
    let spec = cs.ns().spec(specRef.id());
    let comp = cs.createSpec(sys.ObjUtil.coerce(spec, xeto.Spec.type$));
    comp.set("compLayout", xeto.CompLayout.make(x.toInt(), y.toInt()));
    cs.root().add(comp);
    return CompUtil.compToBrio(comp);
  }

  onFeedLayout(cs,compId,x,y,w) {
    let comp = cs.readById(compId);
    comp.set("compLayout", xeto.CompLayout.make(x.toInt(), y.toInt(), w.toInt()));
    return null;
  }

  onFeedLink(cs,fromRef,fromSlot,toRef,toSlot) {
    let comp = cs.readById(toRef);
    comp.set("links", comp.links().add(toSlot, haystack.Etc.link(fromRef, fromSlot)));
    return null;
  }

  onFeedUnlink(cs,links) {
    const this$ = this;
    links.each((link) => {
      let comp = cs.readById(sys.ObjUtil.coerce(link.trap("toRef", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$));
      comp.set("links", comp.links().remove(sys.ObjUtil.coerce(link.trap("toSlot", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$), haystack.Etc.link(sys.ObjUtil.coerce(link.trap("fromRef", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$), sys.ObjUtil.coerce(link.trap("fromSlot", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$))));
      return;
    });
    return null;
  }

  onFeedDuplicate(cs,ids) {
    sys.ObjUtil.echo(sys.Str.plus("Duplicate comps: ", ids));
    throw sys.Err.make("TODO");
  }

  onFeedDelete(cs,ids) {
    const this$ = this;
    ids.each((id) => {
      let comp = cs.readById(id, false);
      if (comp == null) {
        return;
      }
      ;
      if (comp.parent() == null) {
        throw sys.Err.make("Cannot delete root");
      }
      ;
      comp.parent().remove(comp.name());
      return;
    });
    return null;
  }

}

class CompSpaceActorState extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#feeds = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::CompSpaceFeed"));
    this.#lastHouseKeeping = sys.DateTime.now();
    return;
  }

  typeof() { return CompSpaceActorState.type$; }

  #cs = null;

  cs(it) {
    if (it === undefined) {
      return this.#cs;
    }
    else {
      this.#cs = it;
      return;
    }
  }

  #feeds = null;

  feeds(it) {
    if (it === undefined) {
      return this.#feeds;
    }
    else {
      this.#feeds = it;
      return;
    }
  }

  #lastHouseKeeping = null;

  lastHouseKeeping(it) {
    if (it === undefined) {
      return this.#lastHouseKeeping;
    }
    else {
      this.#lastHouseKeeping = it;
      return;
    }
  }

  static make(cs) {
    const $self = new CompSpaceActorState();
    CompSpaceActorState.make$($self,cs);
    return $self;
  }

  static make$($self,cs) {
    ;
    $self.#cs = cs;
    return;
  }

  onUnmount(comp) {
    const this$ = this;
    this.#feeds.each((feed) => {
      let map = feed.deleted();
      if (map == null) {
        feed.deleted((map = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Ref"))));
      }
      ;
      map.set(sys.ObjUtil.coerce(comp.id(), haystack.Ref.type$), sys.ObjUtil.coerce(comp.id(), haystack.Ref.type$));
      return;
    });
    return;
  }

}

class CompSpaceFeed extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompSpaceFeed.type$; }

  #cookie = null;

  cookie() { return this.#cookie; }

  __cookie(it) { if (it === undefined) return this.#cookie; else this.#cookie = it; }

  #touchedRef = null;

  // private field reflection only
  __touchedRef(it) { if (it === undefined) return this.#touchedRef; else this.#touchedRef = it; }

  #lastPollVer = 0;

  lastPollVer(it) {
    if (it === undefined) {
      return this.#lastPollVer;
    }
    else {
      this.#lastPollVer = it;
      return;
    }
  }

  #deleted = null;

  deleted(it) {
    if (it === undefined) {
      return this.#deleted;
    }
    else {
      this.#deleted = it;
      return;
    }
  }

  static make(cookie,lastPollVer) {
    const $self = new CompSpaceFeed();
    CompSpaceFeed.make$($self,cookie,lastPollVer);
    return $self;
  }

  static make$($self,cookie,lastPollVer) {
    $self.#cookie = cookie;
    $self.#touchedRef = concurrent.AtomicInt.make(sys.Duration.nowTicks());
    $self.#lastPollVer = lastPollVer;
    return;
  }

  touched() {
    return this.#touchedRef.val();
  }

  touch() {
    this.#touchedRef.val(sys.Duration.nowTicks());
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#cookie), " lastPollVer="), sys.ObjUtil.coerce(this.#lastPollVer, sys.Obj.type$.toNullable()));
  }

}

class CompSpace extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#byId = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("xeto::Comp"));
    this.#timed = sys.ObjUtil.coerce(MCompSpi.type$.emptyList(), sys.Type.find("xetoEnv::MCompSpi[]"));
    this.#compCounter = 0;
    return;
  }

  typeof() { return CompSpace.type$; }

  static actorKey() { return xeto.AbstractCompSpace.actorKey(); }

  #nsRef = null;

  // private field reflection only
  __nsRef(it) { if (it === undefined) return this.#nsRef; else this.#nsRef = it; }

  #actorState = null;

  actorState(it) {
    if (it === undefined) {
      return this.#actorState;
    }
    else {
      this.#actorState = it;
      return;
    }
  }

  #isRunningRef = false;

  // private field reflection only
  __isRunningRef(it) { if (it === undefined) return this.#isRunningRef; else this.#isRunningRef = it; }

  #rootRef = null;

  // private field reflection only
  __rootRef(it) { if (it === undefined) return this.#rootRef; else this.#rootRef = it; }

  #byId = null;

  // private field reflection only
  __byId(it) { if (it === undefined) return this.#byId; else this.#byId = it; }

  #timersNeedUpdate = false;

  // private field reflection only
  __timersNeedUpdate(it) { if (it === undefined) return this.#timersNeedUpdate; else this.#timersNeedUpdate = it; }

  #timed = null;

  // private field reflection only
  __timed(it) { if (it === undefined) return this.#timed; else this.#timed = it; }

  #compCounter = 0;

  // private field reflection only
  __compCounter(it) { if (it === undefined) return this.#compCounter; else this.#compCounter = it; }

  #curVer = 0;

  // private field reflection only
  __curVer(it) { if (it === undefined) return this.#curVer; else this.#curVer = it; }

  static make(ns) {
    const $self = new CompSpace();
    CompSpace.make$($self,ns);
    return $self;
  }

  static make$($self,ns) {
    ;
    $self.#nsRef = ns;
    return;
  }

  initRoot(f) {
    if (this.#rootRef != null) {
      throw sys.Err.make("Root already initialized");
    }
    ;
    concurrent.Actor.locals().set(xeto.AbstractCompSpace.actorKey(), this);
    try {
      this.#rootRef = sys.Func.call(f, this);
    }
    finally {
      concurrent.Actor.locals().remove(xeto.AbstractCompSpace.actorKey());
    }
    ;
    this.mount(this.root());
    return this;
  }

  ver() {
    return this.#curVer;
  }

  isRunning() {
    return this.#isRunningRef;
  }

  start() {
    this.#isRunningRef = true;
    this.#timersNeedUpdate = true;
    this.onStart();
    return;
  }

  stop() {
    this.#isRunningRef = false;
    this.onStop();
    return;
  }

  onStart() {
    return;
  }

  onStop() {
    return;
  }

  ns() {
    return this.#nsRef;
  }

  root() {
    return sys.ObjUtil.coerce(((this$) => { let $_u14 = this$.#rootRef; if ($_u14 != null) return $_u14; throw sys.Err.make("Must call initRoot"); })(this), xeto.Comp.type$);
  }

  checkLoad($xeto) {
    this.parse($xeto);
    return this;
  }

  load($xeto) {
    const this$ = this;
    let root = this.parse($xeto);
    this.initRoot((self$) => {
      return this$.create(root);
    });
    return this;
  }

  save() {
    let rootDict = CompUtil.compSave(this.root());
    let buf = sys.StrBuf.make();
    this.ns().writeData(buf.out(), rootDict);
    return buf.toStr();
  }

  parse($xeto) {
    return sys.ObjUtil.coerce(((this$) => { let $_u15 = sys.ObjUtil.as(this$.ns().compileData($xeto), haystack.Dict.type$); if ($_u15 != null) return $_u15; throw sys.Err.make("Expecting one dict root"); })(this), haystack.Dict.type$);
  }

  createSpec(spec) {
    return this.create(haystack.Etc.makeDict1("spec", spec._id()));
  }

  create(dict) {
    return sys.ObjUtil.coerce(CompFactory.create(this, sys.List.make(haystack.Dict.type$, [dict])).first(), xeto.Comp.type$);
  }

  createAll(dicts) {
    return CompFactory.create(this, dicts);
  }

  initSpi(c,spec) {
    return CompFactory.initSpi(this, c, spec);
  }

  readById(id,checked) {
    if (checked === undefined) checked = true;
    let c = this.#byId.get(id);
    if (c != null) {
      return c;
    }
    ;
    if (checked) {
      throw haystack.UnknownRecErr.make(id.toStr());
    }
    ;
    return null;
  }

  each(f) {
    this.#byId.each(f);
    return;
  }

  change(spi,name,val) {
    this.updateVer(spi);
    try {
      this.onChange(spi.comp(), name, val);
    }
    catch ($_u16) {
      $_u16 = sys.Err.make($_u16);
      if ($_u16 instanceof sys.Err) {
        let e = $_u16;
        ;
        this.err("CompSpace.onChange", e);
      }
      else {
        throw $_u16;
      }
    }
    ;
    return;
  }

  mount(c) {
    const this$ = this;
    this.updateVer(sys.ObjUtil.coerce(c.spi(), MCompSpi.type$));
    this.#byId.add(sys.ObjUtil.coerce(c.id(), haystack.Ref.type$), c);
    try {
      this.onMount(c);
    }
    catch ($_u17) {
      $_u17 = sys.Err.make($_u17);
      if ($_u17 instanceof sys.Err) {
        let e = $_u17;
        ;
        this.err("CompSpace.onMount", e);
      }
      else {
        throw $_u17;
      }
    }
    ;
    try {
      c.onMount();
    }
    catch ($_u18) {
      $_u18 = sys.Err.make($_u18);
      if ($_u18 instanceof sys.Err) {
        let e = $_u18;
        ;
        this.err(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(c)), ".onMount"), e);
      }
      else {
        throw $_u18;
      }
    }
    ;
    c.eachChild((kid) => {
      this$.mount(kid);
      return;
    });
    this.#timersNeedUpdate = true;
    return;
  }

  unmount(c) {
    const this$ = this;
    this.updateVer(sys.ObjUtil.coerce(c.spi(), MCompSpi.type$));
    c.eachChild((kid) => {
      this$.unmount(kid);
      return;
    });
    try {
      c.onUnmount();
    }
    catch ($_u19) {
      $_u19 = sys.Err.make($_u19);
      if ($_u19 instanceof sys.Err) {
        let e = $_u19;
        ;
        this.err(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.typeof(c)), ".onUnmount"), e);
      }
      else {
        throw $_u19;
      }
    }
    ;
    try {
      this.onUnmount(c);
    }
    catch ($_u20) {
      $_u20 = sys.Err.make($_u20);
      if ($_u20 instanceof sys.Err) {
        let e = $_u20;
        ;
        this.err("CompSpace.onUnmount", e);
      }
      else {
        throw $_u20;
      }
    }
    ;
    if (this.#actorState != null) {
      this.#actorState.onUnmount(c);
    }
    ;
    this.#byId.remove(sys.ObjUtil.coerce(c.id(), haystack.Ref.type$));
    this.#timersNeedUpdate = true;
    return;
  }

  updateVer(spi) {
    this.#curVer = sys.Int.increment(this.#curVer);
    spi.ver(this.#curVer);
    return;
  }

  onMount(c) {
    return;
  }

  onUnmount(c) {
    return;
  }

  onChange(comp,name,val) {
    return;
  }

  updateNamespace(ns) {
    this.updateCompSpec(this.root(), ns, false);
    this.updateCompSpec(this.root(), ns, true);
    this.#nsRef = ns;
    return;
  }

  updateCompSpec(c,ns,commit) {
    const this$ = this;
    let newSpec = ns.spec(c.spec().qname());
    if (commit) {
      sys.ObjUtil.coerce(c.spi(), MCompSpi.type$).specRef(newSpec);
    }
    ;
    c.eachChild((kid) => {
      this$.updateCompSpec(kid, ns, commit);
      return;
    });
    return;
  }

  execute(now) {
    if (now === undefined) now = sys.DateTime.now(null);
    const this$ = this;
    if (this.#timersNeedUpdate) {
      this.#timersNeedUpdate = false;
      this.rebuildTimers();
    }
    ;
    this.each((comp) => {
      if (comp.onExecuteFreq() == null) {
        sys.ObjUtil.coerce(comp.spi(), MCompSpi.type$).needsExecute(true);
      }
      ;
      return;
    });
    this.#timed.each((spi) => {
      spi.checkTimer(now);
      return;
    });
    let cx = MCompContext.make(now);
    this.each((comp) => {
      sys.ObjUtil.coerce(comp.spi(), MCompSpi.type$).checkExecute(cx);
      return;
    });
    return;
  }

  rebuildTimers() {
    let acc = sys.List.make(MCompSpi.type$);
    acc.capacity(this.#timed.size());
    CompSpace.doRebuildTimers(acc, sys.ObjUtil.coerce(this.#rootRef, xeto.Comp.type$));
    this.#timed = sys.ObjUtil.coerce(((this$) => { if (acc.isEmpty()) return MCompSpi.type$.emptyList(); return acc; })(this), sys.Type.find("xetoEnv::MCompSpi[]"));
    return;
  }

  static doRebuildTimers(acc,c) {
    const this$ = this;
    let freq = c.onExecuteFreq();
    if (freq != null) {
      acc.add(sys.ObjUtil.coerce(c.spi(), MCompSpi.type$));
    }
    ;
    c.eachChild((kid) => {
      CompSpace.doRebuildTimers(acc, kid);
      return;
    });
    return;
  }

  genId() {
    ((this$) => { let $_u22 = this$.#compCounter;this$.#compCounter = sys.Int.increment(this$.#compCounter); return $_u22; })(this);
    return sys.ObjUtil.coerce(haystack.Ref.fromStr(sys.Str.plus("", sys.ObjUtil.coerce(this.#compCounter, sys.Obj.type$.toNullable()))), haystack.Ref.type$);
  }

  err(msg,err) {
    if (err === undefined) err = null;
    util.Console.cur().err(msg);
    if (err != null) {
      util.Console.cur().err(err.traceToStr());
    }
    ;
    return;
  }

}

class MCompContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MCompContext.type$; }

  #now = null;

  now() { return this.#now; }

  __now(it) { if (it === undefined) return this.#now; else this.#now = it; }

  static make(now) {
    const $self = new MCompContext();
    MCompContext.make$($self,now);
    return $self;
  }

  static make$($self,now) {
    $self.#now = now;
    return;
  }

}

class CompListeners extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#bySlot = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::CompSlotListener"));
    return;
  }

  typeof() { return CompListeners.type$; }

  #bySlot = null;

  // private field reflection only
  __bySlot(it) { if (it === undefined) return this.#bySlot; else this.#bySlot = it; }

  onChangeAdd(name,cb) {
    this.add(name, CompOnChangeListener.make(cb));
    return;
  }

  onCallAdd(name,cb) {
    this.add(name, CompOnCallListener.make(cb));
    return;
  }

  onChangeRemove(name,cb) {
    this.remove(name, cb);
    return;
  }

  onCallRemove(name,cb) {
    this.remove(name, cb);
    return;
  }

  add(name,x) {
    let p = this.#bySlot.get(name);
    if (p == null) {
      this.#bySlot.set(name, x);
    }
    else {
      while (p.next() != null) {
        (p = p.next());
      }
      ;
      p.next(x);
    }
    ;
    return;
  }

  remove(name,cb) {
    let p = this.#bySlot.get(name);
    if (p == null) {
      return;
    }
    ;
    if (p.cb() === cb) {
      if (p.next() == null) {
        this.#bySlot.remove(name);
      }
      else {
        this.#bySlot.set(name, sys.ObjUtil.coerce(p.next(), CompSlotListener.type$));
      }
      ;
    }
    else {
      while (p.next() != null) {
        if (p.next().cb() === cb) {
          p.next(p.next().next());
          break;
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  fireOnChange(c,name,newVal) {
    let p = this.#bySlot.get(name);
    while (p != null) {
      p.fireOnChange(c, newVal);
      (p = p.next());
    }
    ;
    return;
  }

  fireOnCall(c,name,arg) {
    let p = this.#bySlot.get(name);
    while (p != null) {
      p.fireOnCall(c, arg);
      (p = p.next());
    }
    ;
    return;
  }

  static make() {
    const $self = new CompListeners();
    CompListeners.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

}

class CompSlotListener extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompSlotListener.type$; }

  #next = null;

  next(it) {
    if (it === undefined) {
      return this.#next;
    }
    else {
      this.#next = it;
      return;
    }
  }

  #cb = null;

  cb(it) {
    if (it === undefined) {
      return this.#cb;
    }
    else {
      this.#cb = it;
      return;
    }
  }

  static make(cb) {
    const $self = new CompSlotListener();
    CompSlotListener.make$($self,cb);
    return $self;
  }

  static make$($self,cb) {
    $self.#cb = cb;
    return;
  }

  fireOnChange(c,v) {
    return;
  }

  fireOnCall(c,v) {
    return;
  }

}

class CompOnChangeListener extends CompSlotListener {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompOnChangeListener.type$; }

  static make(cb) {
    const $self = new CompOnChangeListener();
    CompOnChangeListener.make$($self,cb);
    return $self;
  }

  static make$($self,cb) {
    CompSlotListener.make$($self, cb);
    return;
  }

  fireOnChange(c,v) {
    sys.Func.call(this.cb(), c, v);
    return;
  }

}

class CompOnCallListener extends CompSlotListener {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompOnCallListener.type$; }

  static make(cb) {
    const $self = new CompOnCallListener();
    CompOnCallListener.make$($self,cb);
    return $self;
  }

  static make$($self,cb) {
    CompSlotListener.make$($self, cb);
    return;
  }

  fireOnCall(c,v) {
    sys.Func.call(this.cb(), c, v);
    return;
  }

}

class CompUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompUtil.type$; }

  static isReservedSlot(name) {
    return (sys.ObjUtil.equals(name, "id") || sys.ObjUtil.equals(name, "spec"));
  }

  static toHandlerMethod(c,slot) {
    return sys.ObjUtil.typeof(c).method(CompUtil.toHandlerMethodName(slot.name()), false);
  }

  static toHandlerMethodName(name) {
    return sys.StrBuf.make(sys.Int.plus(sys.Str.size(name), 1)).add("on").addChar(sys.Int.upper(sys.Str.get(name, 0))).addRange(name, sys.Range.make(1, -1)).toStr();
  }

  static compSave(comp) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let spec = comp.spec();
    let links = comp.links();
    comp.each((v,n) => {
      if (sys.ObjUtil.equals(n, "spec")) {
        acc.set(n, v);
        return;
      }
      ;
      let slot = spec.slot(n, false);
      if ((slot != null && slot.meta().has("transient"))) {
        return;
      }
      ;
      if ((slot != null && !slot.isMaybe() && sys.ObjUtil.equals(v, slot.meta().get("val")))) {
        return;
      }
      ;
      if (links.isLinked(n)) {
        return;
      }
      ;
      if (sys.ObjUtil.is(v, xeto.Comp.type$)) {
        (v = CompUtil.compSave(sys.ObjUtil.coerce(v, xeto.Comp.type$)));
      }
      ;
      acc.set(n, v);
      return;
    });
    return haystack.Etc.dictFromMap(acc);
  }

  static compToDict(comp) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    comp.each((v,n) => {
      if (sys.ObjUtil.is(v, xeto.Comp.type$)) {
        return;
      }
      ;
      let kind = haystack.Kind.fromVal(v, false);
      if (kind == null) {
        (v = sys.ObjUtil.toStr(v));
      }
      ;
      acc.set(n, v);
      return;
    });
    return haystack.Etc.dictFromMap(acc);
  }

  static compToBrio(comp) {
    return CompUtil.dictToBrio(CompUtil.compToDict(comp));
  }

  static dictToBrio(dict) {
    let buf = sys.Buf.make();
    haystack.BrioWriter.make(buf.out()).writeDict(dict);
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(buf), sys.Buf.type$.toNullable()), sys.Buf.type$);
  }

  static toFeedGrid(gridMeta,cookie,dicts,deleted) {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.capacity(sys.Int.plus(dicts.size(), ((this$) => { if (deleted == null) return 0; return deleted.size(); })(this)));
    if (gridMeta.isEmpty()) {
      gb.setMeta(haystack.Etc.dict1("cookie", cookie));
    }
    else {
      gb.setMeta(haystack.Etc.dictSet(gridMeta, "cookie", cookie));
    }
    ;
    gb.addCol("id").addCol("comp");
    dicts.each((dict) => {
      gb.addRow2(dict.id(), CompUtil.dictToBrio(dict));
      return;
    });
    if (deleted != null) {
      deleted.each((id) => {
        gb.addRow2(id, null);
        return;
      });
    }
    ;
    return gb.toGrid();
  }

  static make() {
    const $self = new CompUtil();
    CompUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class Exporter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#specRef = sys.ObjUtil.coerce(haystack.Ref.fromStr("sys::Spec"), haystack.Ref.type$);
    return;
  }

  typeof() { return Exporter.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #isEffective = false;

  isEffective() { return this.#isEffective; }

  __isEffective(it) { if (it === undefined) return this.#isEffective; else this.#isEffective = it; }

  #specRef = null;

  specRef() { return this.#specRef; }

  __specRef(it) { if (it === undefined) return this.#specRef; else this.#specRef = it; }

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

  #indentation = 0;

  indentation(it) {
    if (it === undefined) {
      return this.#indentation;
    }
    else {
      this.#indentation = it;
      return;
    }
  }

  static make(ns,out,opts) {
    const $self = new Exporter();
    Exporter.make$($self,ns,out,opts);
    return $self;
  }

  static make$($self,ns,out,opts) {
    ;
    $self.#ns = ns;
    $self.#out = out;
    $self.#opts = opts;
    $self.#indentation = XetoUtil.optInt(opts, "indent", 0);
    $self.#isEffective = XetoUtil.optBool(opts, "effective", false);
    return;
  }

  nonNestedInstances(lib) {
    const this$ = this;
    let instances = lib.instances();
    if (instances.isEmpty()) {
      return sys.ObjUtil.coerce(instances, sys.Type.find("haystack::Dict[]"));
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Dict"));
    instances.each((x) => {
      acc.set(sys.ObjUtil.coerce(x.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])), haystack.Ref.type$), sys.ObjUtil.coerce(x, haystack.Dict.type$));
      return;
    });
    instances.each((x) => {
      Exporter.removeNested(acc, sys.ObjUtil.coerce(x, haystack.Dict.type$), 0);
      return;
    });
    return acc.vals();
  }

  static removeNested(acc,x,level) {
    const this$ = this;
    if (sys.ObjUtil.compareGT(level, 0)) {
      let id = sys.ObjUtil.as(x.get("id"), haystack.Ref.type$);
      if (id != null) {
        acc.remove(sys.ObjUtil.coerce(id, haystack.Ref.type$));
      }
      ;
    }
    ;
    x.each((v) => {
      if (sys.ObjUtil.is(v, haystack.Dict.type$)) {
        Exporter.removeNested(acc, sys.ObjUtil.coerce(v, haystack.Dict.type$), sys.Int.plus(level, 1));
      }
      ;
      return;
    });
    return;
  }

  w(obj) {
    let str = sys.ObjUtil.toStr(obj);
    this.#out.print(str);
    return this;
  }

  wc(char) {
    this.#out.writeChar(char);
    return this;
  }

  nl() {
    this.#out.printLine();
    return this;
  }

  sp() {
    return this.wc(32);
  }

  indent() {
    return this.w(sys.Str.spaces(sys.Int.mult(this.#indentation, 2)));
  }

  flush() {
    this.#out.flush();
    return this;
  }

}

class JsonExporter extends Exporter {
  constructor() {
    super();
    const this$ = this;
    this.#firsts = sys.List.make(sys.Bool.type$, [sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable())]);
    return;
  }

  typeof() { return JsonExporter.type$; }

  #firsts = null;

  // private field reflection only
  __firsts(it) { if (it === undefined) return this.#firsts; else this.#firsts = it; }

  #lastWasEnd = false;

  // private field reflection only
  __lastWasEnd(it) { if (it === undefined) return this.#lastWasEnd; else this.#lastWasEnd = it; }

  static make(ns,out,opts) {
    const $self = new JsonExporter();
    JsonExporter.make$($self,ns,out,opts);
    return $self;
  }

  static make$($self,ns,out,opts) {
    Exporter.make$($self, ns, out, opts);
    ;
    return;
  }

  start() {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.w("{"), JsonExporter.type$).nl(), JsonExporter.type$);
  }

  end() {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.nl(), JsonExporter.type$).w("}"), JsonExporter.type$).nl(), JsonExporter.type$);
  }

  lib(lib) {
    const this$ = this;
    this.prop(lib.name()).obj();
    this.libPragma(lib);
    lib.specs().each((x) => {
      this$.doSpec(x.name(), x, 0);
      return;
    });
    this.nonNestedInstances(lib).each((x) => {
      this$.instance(x);
      return;
    });
    this.objEnd().propEnd();
    return this;
  }

  spec(spec) {
    this.doSpec(spec.qname(), spec, 0);
    return this;
  }

  instance(instance) {
    const this$ = this;
    let relId = XetoUtil.qnameToName(instance.id().id());
    this.prop(sys.ObjUtil.coerce(relId, sys.Str.type$)).obj();
    let spec = instance.get("spec");
    if (spec != null) {
      this.dictPair("spec", sys.ObjUtil.coerce(spec, sys.Obj.type$));
    }
    ;
    instance.each((v,n) => {
      if (sys.ObjUtil.equals(n, "spec")) {
        return;
      }
      ;
      this$.dictPair(n, v);
      return;
    });
    this.objEnd().propEnd();
    return this;
  }

  libPragma(lib) {
    this.prop("pragma").obj();
    this.meta(sys.ObjUtil.coerce(lib.meta(), haystack.Dict.type$));
    this.objEnd().propEnd();
    return this;
  }

  doSpec(name,spec,depth) {
    this.prop(name).obj();
    this.prop("id").val(spec._id()).propEnd();
    this.prop("spec").val(this.specRef()).propEnd();
    if (spec.isType()) {
      this.specBase(spec);
    }
    else {
      this.specType(spec);
    }
    ;
    let effective = (this.isEffective() && sys.ObjUtil.compareLE(depth, 1));
    this.meta(sys.ObjUtil.coerce(((this$) => { if (effective) return spec.meta(); return spec.metaOwn(); })(this), haystack.Dict.type$));
    this.slots(((this$) => { if (effective) return spec.slots(); return spec.slotsOwn(); })(this), depth);
    this.objEnd().propEnd();
    return this;
  }

  specType(spec) {
    return this.prop("type").str(spec.type().qname()).propEnd();
  }

  specBase(spec) {
    if (spec.base() == null) {
      return this;
    }
    ;
    return this.prop("base").str(spec.base().qname()).propEnd();
  }

  slots(slots,depth) {
    const this$ = this;
    if (slots.isEmpty()) {
      return this;
    }
    ;
    this.prop("slots").obj();
    slots.each((slot) => {
      this$.doSpec(slot.name(), slot, sys.Int.plus(depth, 1));
      return;
    });
    this.objEnd().propEnd();
    return this;
  }

  meta(meta) {
    const this$ = this;
    let tags = haystack.Etc.dictNames(meta);
    tags.moveTo("version", 0);
    tags.each((n) => {
      this$.dictPair(n, sys.ObjUtil.coerce(meta.get(n), sys.Obj.type$));
      return;
    });
    return this;
  }

  val(x) {
    if (sys.ObjUtil.is(x, haystack.Dict.type$)) {
      return this.dict(sys.ObjUtil.coerce(x, haystack.Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(x, sys.Type.find("sys::List"))) {
      return this.list(sys.ObjUtil.coerce(x, sys.Type.find("sys::Obj[]")));
    }
    ;
    if (x === haystack.Marker.val()) {
      return this.str("\u2713");
    }
    ;
    if (sys.ObjUtil.is(x, sys.Float.type$)) {
      return this.str(haystack.Number.make(sys.ObjUtil.coerce(x, sys.Float.type$)).toStr());
    }
    ;
    return this.str(sys.ObjUtil.toStr(x));
  }

  dict(x) {
    const this$ = this;
    this.obj();
    x.each((v,n) => {
      this$.dictPair(n, v);
      return;
    });
    this.objEnd();
    return this;
  }

  dictPair(n,v) {
    return this.prop(n).val(v).propEnd();
  }

  list(x) {
    const this$ = this;
    this.obj("[");
    x.each((item) => {
      sys.ObjUtil.coerce(this$.open().indent(), JsonExporter.type$).val(item).close();
      return;
    });
    this.objEnd("]");
    return this;
  }

  open() {
    if (sys.ObjUtil.coerce(this.#firsts.peek(), sys.Bool.type$)) {
      this.#firsts.set(-1, sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()));
    }
    else {
      sys.ObjUtil.coerce(this.w(","), JsonExporter.type$).nl();
    }
    ;
    this.#firsts.push(sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()));
    this.#lastWasEnd = false;
    return this;
  }

  close() {
    if (this.#lastWasEnd) {
      this.nl();
    }
    ;
    this.#firsts.pop();
    this.#lastWasEnd = true;
    return this;
  }

  prop(name) {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.open().indent(), JsonExporter.type$).str(name).w(": "), JsonExporter.type$);
  }

  propEnd() {
    return this.close();
  }

  obj(bracket) {
    if (bracket === undefined) bracket = "{";
    sys.ObjUtil.coerce(this.w(bracket), JsonExporter.type$).nl();
    ((this$) => { let $_u26 = this$.indentation();this$.indentation(sys.Int.increment(this$.indentation())); return $_u26; })(this);
    return this;
  }

  objEnd(bracket) {
    if (bracket === undefined) bracket = "}";
    if (this.#lastWasEnd) {
      this.nl();
    }
    ;
    this.#lastWasEnd = false;
    ((this$) => { let $_u27 = this$.indentation();this$.indentation(sys.Int.decrement(this$.indentation())); return $_u27; })(this);
    sys.ObjUtil.coerce(this.indent(), JsonExporter.type$).w(bracket);
    return this;
  }

  str(s) {
    const this$ = this;
    this.wc(34);
    sys.Str.each(s, (char) => {
      let $_u28 = char;
      if (sys.ObjUtil.equals($_u28, 8)) {
        sys.ObjUtil.coerce(this$.wc(92), JsonExporter.type$).wc(98);
      }
      else if (sys.ObjUtil.equals($_u28, 12)) {
        sys.ObjUtil.coerce(this$.wc(92), JsonExporter.type$).wc(102);
      }
      else if (sys.ObjUtil.equals($_u28, 10)) {
        sys.ObjUtil.coerce(this$.wc(92), JsonExporter.type$).wc(110);
      }
      else if (sys.ObjUtil.equals($_u28, 13)) {
        sys.ObjUtil.coerce(this$.wc(92), JsonExporter.type$).wc(114);
      }
      else if (sys.ObjUtil.equals($_u28, 9)) {
        sys.ObjUtil.coerce(this$.wc(92), JsonExporter.type$).wc(116);
      }
      else if (sys.ObjUtil.equals($_u28, 92)) {
        sys.ObjUtil.coerce(this$.wc(92), JsonExporter.type$).wc(92);
      }
      else if (sys.ObjUtil.equals($_u28, 34)) {
        sys.ObjUtil.coerce(this$.wc(92), JsonExporter.type$).wc(34);
      }
      else {
        if (sys.ObjUtil.compareLT(char, 32)) {
          sys.ObjUtil.coerce(sys.ObjUtil.coerce(this$.wc(92), JsonExporter.type$).wc(117), JsonExporter.type$).w(sys.Int.toHex(char, sys.ObjUtil.coerce(4, sys.Int.type$.toNullable())));
        }
        else {
          this$.wc(char);
        }
        ;
      }
      ;
      return;
    });
    this.wc(34);
    return this;
  }

}

class RdfExporter extends Exporter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RdfExporter.type$; }

  #refSpec = null;

  refSpec() { return this.#refSpec; }

  __refSpec(it) { if (it === undefined) return this.#refSpec; else this.#refSpec = it; }

  static make(ns,out,opts) {
    const $self = new RdfExporter();
    RdfExporter.make$($self,ns,out,opts);
    return $self;
  }

  static make$($self,ns,out,opts) {
    Exporter.make$($self, ns, out, opts);
    $self.#refSpec = sys.ObjUtil.coerce(ns.spec("sys::Ref"), xeto.Spec.type$);
    return;
  }

  start() {
    return this;
  }

  end() {
    return this;
  }

  lib(lib) {
    const this$ = this;
    this.prefixDefs(lib);
    this.ontologyDef(lib);
    lib.types().each((x) => {
      if (!XetoUtil.isAutoName(x.name())) {
        this$.cls(x);
      }
      ;
      return;
    });
    lib.globals().each((x) => {
      this$.global(x);
      return;
    });
    if (sys.ObjUtil.equals(lib.name(), "sys")) {
      this.sysDefs();
    }
    ;
    return this;
  }

  spec(spec) {
    if (spec.isType()) {
      return this.cls(spec);
    }
    ;
    if (spec.isGlobal()) {
      return this.global(spec);
    }
    ;
    throw sys.Err.make(spec.name());
  }

  instance(instance) {
    return this;
  }

  cls(x) {
    if (x.isEnum()) {
      return this.enum(x);
    }
    ;
    this.qname(x.qname()).nl();
    sys.ObjUtil.coerce(this.w("  a owl:Class ;"), RdfExporter.type$).nl();
    this.labelAndDoc(x);
    if (x.base() != null) {
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.w("  rdfs:subClassOf "), RdfExporter.type$).qname(x.base().qname()).w(" ;"), RdfExporter.type$).nl();
    }
    ;
    sys.ObjUtil.coerce(this.w("."), RdfExporter.type$).nl();
    return this;
  }

  enum(x) {
    const this$ = this;
    this.qname(x.qname()).nl();
    sys.ObjUtil.coerce(this.w("  a rdfs:Datatype ;"), RdfExporter.type$).nl();
    this.labelAndDoc(x);
    sys.ObjUtil.coerce(this.w("  owl:oneOf ("), RdfExporter.type$).nl();
    x.enum().each((spec,key) => {
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(this$.w("    "), RdfExporter.type$).literal(key).w("^^rdf:PlainLiteral"), RdfExporter.type$).nl();
      return;
    });
    sys.ObjUtil.coerce(this.w("  )"), RdfExporter.type$).nl();
    sys.ObjUtil.coerce(this.w("."), RdfExporter.type$).nl();
    return this;
  }

  global(x) {
    if (x.isMarker()) {
      return this.globalMarker(x);
    }
    ;
    if (x.isa(this.#refSpec)) {
      return this.globalRef(x);
    }
    ;
    return this.globalProp(x);
  }

  globalMarker(x) {
    this.qname(x.qname()).nl();
    sys.ObjUtil.coerce(this.w("  a sys:Marker ;"), RdfExporter.type$).nl();
    this.labelAndDoc(x);
    sys.ObjUtil.coerce(this.w("."), RdfExporter.type$).nl();
    return this;
  }

  globalRef(x) {
    let of$ = ((this$) => { let $_u29 = ((this$) => { let $_u30 = x.of(false); if ($_u30 == null) return null; return x.of(false).qname(); })(this$); if ($_u29 != null) return $_u29; return "sys::Dict"; })(this);
    this.qname(x.qname()).nl();
    sys.ObjUtil.coerce(this.w("  a owl:ObjectProperty ;"), RdfExporter.type$).nl();
    this.labelAndDoc(x);
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.w("  rdfs:range "), RdfExporter.type$).qname(sys.ObjUtil.coerce(of$, sys.Str.type$)).w(" ;"), RdfExporter.type$).nl();
    sys.ObjUtil.coerce(this.w("."), RdfExporter.type$).nl();
    return this;
  }

  globalProp(x) {
    return this;
  }

  labelAndDoc(x) {
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.w("  rdfs:label \""), RdfExporter.type$).w(x.name()), RdfExporter.type$).w("\"@en ;"), RdfExporter.type$).nl();
    let doc = sys.ObjUtil.as(x.metaOwn().get("doc"), sys.Str.type$);
    if ((doc != null && !sys.Str.isEmpty(doc))) {
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.w("  rdfs:comment "), RdfExporter.type$).literal(sys.ObjUtil.coerce(doc, sys.Str.type$)).w("@en ;"), RdfExporter.type$).nl();
    }
    ;
    return this;
  }

  sysDefs() {
    return sys.ObjUtil.coerce(this.w("sys:hasMarker\n  a owl:ObjectProperty ;\n  rdfs:label \"Has Marker\"@en ;\n  rdfs:range sys:Marker ;\n.\n"), RdfExporter.type$);
  }

  prefixDefs(lib) {
    const this$ = this;
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.w("# baseURI: "), RdfExporter.type$).w(this.libUri(lib)), RdfExporter.type$).nl();
    this.nl();
    sys.ObjUtil.coerce(this.w("@prefix owl: <http://www.w3.org/2002/07/owl#> ."), RdfExporter.type$).nl();
    sys.ObjUtil.coerce(this.w("@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ."), RdfExporter.type$).nl();
    sys.ObjUtil.coerce(this.w("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> ."), RdfExporter.type$).nl();
    sys.ObjUtil.coerce(this.w("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> ."), RdfExporter.type$).nl();
    lib.depends().each((x) => {
      this$.prefixDef(sys.ObjUtil.coerce(this$.ns().lib(x.name()), xeto.Lib.type$));
      return;
    });
    this.prefixDef(lib);
    this.nl();
    return;
  }

  prefixDef(lib) {
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.w("@prefix "), RdfExporter.type$).prefix(lib.name()).w(": <"), RdfExporter.type$).w(this.libUri(lib)), RdfExporter.type$).w("#> ."), RdfExporter.type$).nl();
    return;
  }

  ontologyDef(lib) {
    const this$ = this;
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.w("<"), RdfExporter.type$).w(this.libUri(lib)), RdfExporter.type$).w("> a owl:Ontology ;"), RdfExporter.type$).nl();
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.w("rdfs:label \""), RdfExporter.type$).w(lib.name()), RdfExporter.type$).w(" Ontology\"@en ;");
    if (!lib.depends().isEmpty()) {
      sys.ObjUtil.coerce(this.nl(), RdfExporter.type$).w("owl:imports ");
      lib.depends().each((x,i) => {
        if (sys.ObjUtil.compareGT(i, 0)) {
          sys.ObjUtil.coerce(sys.ObjUtil.coerce(this$.w(","), RdfExporter.type$).nl(), RdfExporter.type$).w(sys.Str.spaces(12));
        }
        ;
        sys.ObjUtil.coerce(sys.ObjUtil.coerce(this$.w("<"), RdfExporter.type$).w(this$.libUri(sys.ObjUtil.coerce(this$.ns().lib(x.name()), xeto.Lib.type$))), RdfExporter.type$).w(">");
        return;
      });
    }
    ;
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.nl(), RdfExporter.type$).w("."), RdfExporter.type$).nl();
    this.nl();
    return;
  }

  libUri(lib) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("http://xeto.dev/rdf/", lib.name()), "-"), lib.version());
  }

  prefix(libName) {
    return sys.ObjUtil.coerce(this.w(libName), RdfExporter.type$);
  }

  qname(qname) {
    return sys.ObjUtil.coerce(this.w(sys.Str.replace(qname, "::", ":")), RdfExporter.type$);
  }

  literal(s) {
    return sys.ObjUtil.coerce(this.w(sys.Str.replace(sys.Str.toCode(s), "\\\$", "\$")), RdfExporter.type$);
  }

}

class GridExporter extends Exporter {
  constructor() {
    super();
    const this$ = this;
    this.#dicts = sys.List.make(haystack.Dict.type$);
    return;
  }

  typeof() { return GridExporter.type$; }

  #filetype = null;

  // private field reflection only
  __filetype(it) { if (it === undefined) return this.#filetype; else this.#filetype = it; }

  #meta = null;

  // private field reflection only
  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #dicts = null;

  // private field reflection only
  __dicts(it) { if (it === undefined) return this.#dicts; else this.#dicts = it; }

  static make(ns,out,opts,filetype) {
    const $self = new GridExporter();
    GridExporter.make$($self,ns,out,opts,filetype);
    return $self;
  }

  static make$($self,ns,out,opts,filetype) {
    Exporter.make$($self, ns, out, opts);
    ;
    $self.#filetype = filetype;
    return;
  }

  start() {
    return this;
  }

  end() {
    let grid = this.toGrid();
    this.#filetype.writer(this.out(), this.opts()).writeGrid(grid);
    return this;
  }

  lib(lib) {
    const this$ = this;
    this.add(this.libMeta(lib));
    lib.specs().each((x) => {
      this$.spec(x);
      return;
    });
    this.nonNestedInstances(lib).each((x) => {
      this$.instance(x);
      return;
    });
    return this;
  }

  libMeta(lib) {
    let dict = sys.ObjUtil.coerce(lib, haystack.Dict.type$);
    return haystack.Etc.dictRemove(dict, "loaded");
  }

  spec(spec) {
    this.add(this.specToDict(spec, 0));
    return this;
  }

  specToDict(x,depth) {
    const this$ = this;
    let effective = (this.isEffective() && sys.ObjUtil.compareLE(depth, 1));
    let meta = ((this$) => { if (effective) return x.meta(); return x.metaOwn(); })(this);
    let slots = ((this$) => { if (effective) return x.slots(); return x.slotsOwn(); })(this);
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.ordered(true);
    acc.set("id", x._id());
    if (x.isType()) {
      acc.addNotNull("base", ((this$) => { let $_u33 = x.base(); if ($_u33 == null) return null; return x.base()._id(); })(this));
    }
    else {
      acc.set("type", x.type()._id());
    }
    ;
    acc.set("spec", this.specRef());
    meta.each((v,n) => {
      acc.set(n, v);
      return;
    });
    if (!slots.isEmpty()) {
      let slotsAcc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
      slotsAcc.ordered(true);
      slots.each((slot) => {
        slotsAcc.set(slot.name(), this$.specToDict(slot, sys.Int.plus(depth, 1)));
        return;
      });
      acc.set("slots", haystack.Etc.dictFromMap(slotsAcc));
    }
    ;
    return haystack.Etc.makeDict(acc);
  }

  instance(instance) {
    this.add(instance);
    return this;
  }

  add(x) {
    this.#dicts.add(haystack.Etc.dictToHaystack(x));
    return;
  }

  toGrid() {
    return haystack.Etc.makeDictsGrid(this.#meta, this.#dicts);
  }

}

class MDictMerge1 extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MDictMerge1.type$; }

  toStr() { return haystack.Dict.prototype.toStr.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #wrapped = null;

  wrapped() { return this.#wrapped; }

  __wrapped(it) { if (it === undefined) return this.#wrapped; else this.#wrapped = it; }

  #n0 = null;

  n0() { return this.#n0; }

  __n0(it) { if (it === undefined) return this.#n0; else this.#n0 = it; }

  #v0 = null;

  v0() { return this.#v0; }

  __v0(it) { if (it === undefined) return this.#v0; else this.#v0 = it; }

  static make(wrapped,n0,v0) {
    const $self = new MDictMerge1();
    MDictMerge1.make$($self,wrapped,n0,v0);
    return $self;
  }

  static make$($self,wrapped,n0,v0) {
    $self.#wrapped = wrapped;
    $self.#n0 = n0;
    $self.#v0 = ((this$) => { let $_u34 = v0; if ($_u34 == null) return null; return sys.ObjUtil.toImmutable(v0); })($self);
    return;
  }

  get(n,def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(n, this.#n0)) {
      return this.#v0;
    }
    ;
    return this.#wrapped.get(n, def);
  }

  isEmpty() {
    return false;
  }

  has(n) {
    return (sys.ObjUtil.equals(n, this.#n0) || this.#wrapped.has(n));
  }

  missing(n) {
    return (sys.ObjUtil.compareNE(n, this.#n0) && this.#wrapped.missing(n));
  }

  each(f) {
    sys.Func.call(f, this.#v0, this.#n0);
    this.#wrapped.each(f);
    return;
  }

  eachWhile(f) {
    let r = sys.Func.call(f, this.#v0, this.#n0);
    if (r != null) {
      return r;
    }
    ;
    return this.#wrapped.eachWhile(f);
  }

  trap(n,a) {
    if (a === undefined) a = null;
    if (sys.ObjUtil.equals(n, this.#n0)) {
      return this.#v0;
    }
    ;
    return this.#wrapped.trap(n, a);
  }

}

class MSpec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MSpec.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #nameCode = 0;

  nameCode() { return this.#nameCode; }

  __nameCode(it) { if (it === undefined) return this.#nameCode; else this.#nameCode = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #parent = null;

  parent() { return this.#parent; }

  __parent(it) { if (it === undefined) return this.#parent; else this.#parent = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #base = null;

  base() { return this.#base; }

  __base(it) { if (it === undefined) return this.#base; else this.#base = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #metaOwn = null;

  metaOwn() { return this.#metaOwn; }

  __metaOwn(it) { if (it === undefined) return this.#metaOwn; else this.#metaOwn = it; }

  #slots = null;

  slots() { return this.#slots; }

  __slots(it) { if (it === undefined) return this.#slots; else this.#slots = it; }

  #slotsOwn = null;

  slotsOwn() { return this.#slotsOwn; }

  __slotsOwn(it) { if (it === undefined) return this.#slotsOwn; else this.#slotsOwn = it; }

  #args = null;

  args() { return this.#args; }

  __args(it) { if (it === undefined) return this.#args; else this.#args = it; }

  static #specSpecRef = undefined;

  static specSpecRef() {
    if (MSpec.#specSpecRef === undefined) {
      MSpec.static$init();
      if (MSpec.#specSpecRef === undefined) MSpec.#specSpecRef = null;
    }
    return MSpec.#specSpecRef;
  }

  #flags = 0;

  flags() { return this.#flags; }

  __flags(it) { if (it === undefined) return this.#flags; else this.#flags = it; }

  static make(loc,parent,nameCode,name,base,type,meta,metaOwn,slots,slotsOwn,flags,args) {
    const $self = new MSpec();
    MSpec.make$($self,loc,parent,nameCode,name,base,type,meta,metaOwn,slots,slotsOwn,flags,args);
    return $self;
  }

  static make$($self,loc,parent,nameCode,name,base,type,meta,metaOwn,slots,slotsOwn,flags,args) {
    $self.#loc = loc;
    $self.#nameCode = nameCode;
    $self.#name = name;
    $self.#parent = parent;
    $self.#base = base;
    $self.#type = type;
    $self.#meta = meta;
    $self.#metaOwn = metaOwn;
    $self.#slots = slots;
    $self.#slotsOwn = slotsOwn;
    $self.#flags = flags;
    $self.#args = args;
    return;
  }

  lib() {
    return sys.ObjUtil.coerce(this.#parent.lib(), XetoLib.type$);
  }

  id() {
    return sys.ObjUtil.coerce(haystack.Ref.fromStr(this.qname()), haystack.Ref.type$);
  }

  qname() {
    return sys.Str.plus(sys.Str.plus(this.#parent.qname(), "."), this.#name);
  }

  hasSlots() {
    return !this.#slots.isEmpty();
  }

  slot(name,checked) {
    if (checked === undefined) checked = true;
    return this.#slots.get(name, checked);
  }

  slotOwn(name,checked) {
    if (checked === undefined) checked = true;
    return this.#slotsOwn.get(name, checked);
  }

  toStr() {
    return this.qname();
  }

  binding() {
    return this.#type.binding();
  }

  enum() {
    throw sys.UnsupportedErr.make(sys.Str.plus("Spec is not enum: ", this.qname()));
  }

  get(name,def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(name, "id")) {
      return this.id();
    }
    ;
    if (sys.ObjUtil.equals(name, "spec")) {
      return MSpec.specSpecRef();
    }
    ;
    if (this.isType()) {
      if (sys.ObjUtil.equals(name, "base")) {
        return ((this$) => { let $_u35 = ((this$) => { let $_u36 = this$.#base; if ($_u36 == null) return null; return this$.#base.id(); })(this$); if ($_u35 != null) return $_u35; return def; })(this);
      }
      ;
    }
    else {
      if (sys.ObjUtil.equals(name, "type")) {
        return this.#type.id();
      }
      ;
    }
    ;
    return this.#meta.get(name, def);
  }

  has(name) {
    if (sys.ObjUtil.equals(name, "id")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(name, "spec")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(name, "base")) {
      return (this.isType() && this.#base != null);
    }
    ;
    if (sys.ObjUtil.equals(name, "type")) {
      return !this.isType();
    }
    ;
    return this.#meta.has(name);
  }

  missing(name) {
    if (sys.ObjUtil.equals(name, "id")) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(name, "spec")) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(name, "base")) {
      return (!this.isType() || this.#base == null);
    }
    ;
    if (sys.ObjUtil.equals(name, "type")) {
      return this.isType();
    }
    ;
    return this.#meta.missing(name);
  }

  each(f) {
    sys.Func.call(f, this.id(), "id");
    sys.Func.call(f, MSpec.specSpecRef(), "spec");
    if (this.isType()) {
      if (this.#base != null) {
        sys.Func.call(f, this.#base.id(), "base");
      }
      ;
    }
    else {
      sys.Func.call(f, this.#type.id(), "type");
    }
    ;
    this.#meta.each(f);
    return;
  }

  eachWhile(f) {
    let r = sys.Func.call(f, this.id(), "id");
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, MSpec.specSpecRef(), "spec"));
    if (r != null) {
      return r;
    }
    ;
    if (this.isType()) {
      if (this.#base != null) {
        (r = sys.Func.call(f, this.#base.id(), "base"));
        if (r != null) {
          return r;
        }
        ;
      }
      ;
    }
    else {
      (r = sys.Func.call(f, this.#type.id(), "type"));
      if (r != null) {
        return r;
      }
      ;
    }
    ;
    return this.#meta.eachWhile(f);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    let val = this.get(name, null);
    if (val != null) {
      return val;
    }
    ;
    return this.#meta.trap(name, args);
  }

  flavor() {
    return xeto.SpecFlavor.slot();
  }

  isType() {
    return this.flavor().isType();
  }

  hasFlag(flag) {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, flag), 0);
  }

  fantomType() {
    return this.binding().type();
  }

  static static$init() {
    MSpec.#specSpecRef = sys.ObjUtil.coerce(haystack.Ref.fromStr("sys::Spec"), xeto.Ref.type$);
    return;
  }

}

class MGlobal extends MSpec {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MGlobal.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  static make(loc,lib,qname,nameCode,name,base,self$,meta,metaOwn,slots,slotsOwn,flags,args) {
    const $self = new MGlobal();
    MGlobal.make$($self,loc,lib,qname,nameCode,name,base,self$,meta,metaOwn,slots,slotsOwn,flags,args);
    return $self;
  }

  static make$($self,loc,lib,qname,nameCode,name,base,self$,meta,metaOwn,slots,slotsOwn,flags,args) {
    MSpec.make$($self, loc, null, nameCode, name, base, self$, meta, metaOwn, slots, slotsOwn, flags, args);
    $self.#lib = lib;
    $self.#qname = qname;
    $self.#id = sys.ObjUtil.coerce(haystack.Ref.make(qname, null), haystack.Ref.type$);
    $self.__type(self$);
    return;
  }

  flavor() {
    return xeto.SpecFlavor.global();
  }

  toStr() {
    return this.#qname;
  }

}

class MSlots extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MSlots.type$; }

  static #empty = undefined;

  static empty() {
    if (MSlots.#empty === undefined) {
      MSlots.static$init();
      if (MSlots.#empty === undefined) MSlots.#empty = null;
    }
    return MSlots.#empty;
  }

  #map = null;

  map() { return this.#map; }

  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  static make(map) {
    const $self = new MSlots();
    MSlots.make$($self,map);
    return $self;
  }

  static make$($self,map) {
    $self.#map = map;
    return;
  }

  size() {
    return this.#map.size();
  }

  isEmpty() {
    return this.#map.isEmpty();
  }

  has(name) {
    return this.#map.has(name);
  }

  missing(name) {
    return this.#map.missing(name);
  }

  get(name,checked) {
    if (checked === undefined) checked = true;
    let kid = this.#map.get(name);
    if (kid != null) {
      return sys.ObjUtil.coerce(kid, XetoSpec.type$.toNullable());
    }
    ;
    if (!checked) {
      return null;
    }
    ;
    throw haystack.UnknownNameErr.make(name);
  }

  names() {
    const this$ = this;
    let acc = sys.List.make(sys.Str.type$);
    acc.capacity(this.#map.size());
    this.#map.each((v,n) => {
      acc.add(n);
      return;
    });
    return acc;
  }

  each(f) {
    this.#map.each(sys.ObjUtil.coerce(f, sys.Type.find("|sys::Obj,sys::Str->sys::Void|")));
    return;
  }

  eachWhile(f) {
    return this.#map.eachWhile(sys.ObjUtil.coerce(f, sys.Type.find("|sys::Obj,sys::Str->sys::Obj?|")));
  }

  toStr() {
    const this$ = this;
    let s = sys.StrBuf.make();
    s.add("{");
    this.each((slot) => {
      if (sys.ObjUtil.compareGT(s.size(), 1)) {
        s.add(", ");
      }
      ;
      s.add(slot.name());
      return;
    });
    return s.add("}").toStr();
  }

  toDict() {
    return MSlotsDict.make(this);
  }

  static static$init() {
    MSlots.#empty = MSlots.make(xeto.NameDict.empty());
    return;
  }

}

class MSlotsDict extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MSlotsDict.type$; }

  toStr() { return haystack.Dict.prototype.toStr.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #slots = null;

  slots() { return this.#slots; }

  __slots(it) { if (it === undefined) return this.#slots; else this.#slots = it; }

  static make(slots) {
    const $self = new MSlotsDict();
    MSlotsDict.make$($self,slots);
    return $self;
  }

  static make$($self,slots) {
    $self.#slots = slots;
    return;
  }

  get(n,def) {
    if (def === undefined) def = null;
    return ((this$) => { let $_u37 = this$.#slots.get(n, false); if ($_u37 != null) return $_u37; return def; })(this);
  }

  isEmpty() {
    return this.#slots.isEmpty();
  }

  has(n) {
    return this.#slots.get(n, false) != null;
  }

  missing(n) {
    return this.#slots.get(n, false) == null;
  }

  each(f) {
    this.#slots.map().each(f);
    return;
  }

  eachWhile(f) {
    return this.#slots.map().eachWhile(f);
  }

  trap(n,a) {
    if (a === undefined) a = null;
    return this.#slots.get(n, true);
  }

}

class MSpecFlags extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MSpecFlags.type$; }

  static #maybe = undefined;

  static maybe() {
    if (MSpecFlags.#maybe === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#maybe === undefined) MSpecFlags.#maybe = 0;
    }
    return MSpecFlags.#maybe;
  }

  static #marker = undefined;

  static marker() {
    if (MSpecFlags.#marker === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#marker === undefined) MSpecFlags.#marker = 0;
    }
    return MSpecFlags.#marker;
  }

  static #scalar = undefined;

  static scalar() {
    if (MSpecFlags.#scalar === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#scalar === undefined) MSpecFlags.#scalar = 0;
    }
    return MSpecFlags.#scalar;
  }

  static #ref = undefined;

  static ref() {
    if (MSpecFlags.#ref === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#ref === undefined) MSpecFlags.#ref = 0;
    }
    return MSpecFlags.#ref;
  }

  static #multiRef = undefined;

  static multiRef() {
    if (MSpecFlags.#multiRef === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#multiRef === undefined) MSpecFlags.#multiRef = 0;
    }
    return MSpecFlags.#multiRef;
  }

  static #choice = undefined;

  static choice() {
    if (MSpecFlags.#choice === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#choice === undefined) MSpecFlags.#choice = 0;
    }
    return MSpecFlags.#choice;
  }

  static #dict = undefined;

  static dict() {
    if (MSpecFlags.#dict === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#dict === undefined) MSpecFlags.#dict = 0;
    }
    return MSpecFlags.#dict;
  }

  static #list = undefined;

  static list() {
    if (MSpecFlags.#list === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#list === undefined) MSpecFlags.#list = 0;
    }
    return MSpecFlags.#list;
  }

  static #query = undefined;

  static query() {
    if (MSpecFlags.#query === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#query === undefined) MSpecFlags.#query = 0;
    }
    return MSpecFlags.#query;
  }

  static #func = undefined;

  static func() {
    if (MSpecFlags.#func === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#func === undefined) MSpecFlags.#func = 0;
    }
    return MSpecFlags.#func;
  }

  static #interface = undefined;

  static interface() {
    if (MSpecFlags.#interface === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#interface === undefined) MSpecFlags.#interface = 0;
    }
    return MSpecFlags.#interface;
  }

  static #comp = undefined;

  static comp() {
    if (MSpecFlags.#comp === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#comp === undefined) MSpecFlags.#comp = 0;
    }
    return MSpecFlags.#comp;
  }

  static #inheritMask = undefined;

  static inheritMask() {
    if (MSpecFlags.#inheritMask === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#inheritMask === undefined) MSpecFlags.#inheritMask = 0;
    }
    return MSpecFlags.#inheritMask;
  }

  static #self = undefined;

  static self() {
    if (MSpecFlags.#self === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#self === undefined) MSpecFlags.#self = 0;
    }
    return MSpecFlags.#self;
  }

  static #none = undefined;

  static none() {
    if (MSpecFlags.#none === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#none === undefined) MSpecFlags.#none = 0;
    }
    return MSpecFlags.#none;
  }

  static #enum = undefined;

  static enum() {
    if (MSpecFlags.#enum === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#enum === undefined) MSpecFlags.#enum = 0;
    }
    return MSpecFlags.#enum;
  }

  static #and = undefined;

  static and() {
    if (MSpecFlags.#and === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#and === undefined) MSpecFlags.#and = 0;
    }
    return MSpecFlags.#and;
  }

  static #or = undefined;

  static or() {
    if (MSpecFlags.#or === undefined) {
      MSpecFlags.static$init();
      if (MSpecFlags.#or === undefined) MSpecFlags.#or = 0;
    }
    return MSpecFlags.#or;
  }

  static flagsToStr(flags) {
    const this$ = this;
    let s = sys.StrBuf.make();
    MSpecFlags.type$.fields().each((f) => {
      if ((f.isStatic() && sys.ObjUtil.equals(f.type(), sys.Int.type$) && !sys.Str.endsWith(f.name(), "Mask"))) {
        let has = sys.ObjUtil.compareNE(sys.Int.and(flags, sys.ObjUtil.coerce(f.get(null), sys.Int.type$)), 0);
        if (has) {
          s.join(f.name(), ",");
        }
        ;
      }
      ;
      return;
    });
    return sys.Str.plus(sys.Str.plus("{", s.toStr()), "}");
  }

  static make() {
    const $self = new MSpecFlags();
    MSpecFlags.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    MSpecFlags.#maybe = 1;
    MSpecFlags.#marker = 2;
    MSpecFlags.#scalar = 4;
    MSpecFlags.#ref = 8;
    MSpecFlags.#multiRef = 16;
    MSpecFlags.#choice = 32;
    MSpecFlags.#dict = 64;
    MSpecFlags.#list = 128;
    MSpecFlags.#query = 256;
    MSpecFlags.#func = 512;
    MSpecFlags.#interface = 1024;
    MSpecFlags.#comp = 2048;
    MSpecFlags.#inheritMask = 65535;
    MSpecFlags.#self = 65536;
    MSpecFlags.#none = 131072;
    MSpecFlags.#enum = 262144;
    MSpecFlags.#and = 524288;
    MSpecFlags.#or = 1048576;
    return;
  }

}

class MMetaSpec extends MSpec {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MMetaSpec.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  static make(loc,lib,qname,nameCode,name,base,self$,meta,metaOwn,slots,slotsOwn,flags,args) {
    const $self = new MMetaSpec();
    MMetaSpec.make$($self,loc,lib,qname,nameCode,name,base,self$,meta,metaOwn,slots,slotsOwn,flags,args);
    return $self;
  }

  static make$($self,loc,lib,qname,nameCode,name,base,self$,meta,metaOwn,slots,slotsOwn,flags,args) {
    MSpec.make$($self, loc, null, nameCode, name, base, self$, meta, metaOwn, slots, slotsOwn, flags, args);
    $self.#lib = lib;
    $self.#qname = qname;
    $self.#id = sys.ObjUtil.coerce(haystack.Ref.make(qname, null), haystack.Ref.type$);
    $self.__type(self$);
    return;
  }

  flavor() {
    return xeto.SpecFlavor.meta();
  }

  toStr() {
    return this.#qname;
  }

}

class MSys extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MSys.type$; }

  #obj = null;

  obj() { return this.#obj; }

  __obj(it) { if (it === undefined) return this.#obj; else this.#obj = it; }

  #none = null;

  none() { return this.#none; }

  __none(it) { if (it === undefined) return this.#none; else this.#none = it; }

  #self = null;

  self() { return this.#self; }

  __self(it) { if (it === undefined) return this.#self; else this.#self = it; }

  #seq = null;

  seq() { return this.#seq; }

  __seq(it) { if (it === undefined) return this.#seq; else this.#seq = it; }

  #dict = null;

  dict() { return this.#dict; }

  __dict(it) { if (it === undefined) return this.#dict; else this.#dict = it; }

  #list = null;

  list() { return this.#list; }

  __list(it) { if (it === undefined) return this.#list; else this.#list = it; }

  #func = null;

  func() { return this.#func; }

  __func(it) { if (it === undefined) return this.#func; else this.#func = it; }

  #grid = null;

  grid() { return this.#grid; }

  __grid(it) { if (it === undefined) return this.#grid; else this.#grid = it; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #spec = null;

  spec() { return this.#spec; }

  __spec(it) { if (it === undefined) return this.#spec; else this.#spec = it; }

  #scalar = null;

  scalar() { return this.#scalar; }

  __scalar(it) { if (it === undefined) return this.#scalar; else this.#scalar = it; }

  #marker = null;

  marker() { return this.#marker; }

  __marker(it) { if (it === undefined) return this.#marker; else this.#marker = it; }

  #bool = null;

  bool() { return this.#bool; }

  __bool(it) { if (it === undefined) return this.#bool; else this.#bool = it; }

  #str = null;

  str() { return this.#str; }

  __str(it) { if (it === undefined) return this.#str; else this.#str = it; }

  #uri = null;

  uri() { return this.#uri; }

  __uri(it) { if (it === undefined) return this.#uri; else this.#uri = it; }

  #number = null;

  number() { return this.#number; }

  __number(it) { if (it === undefined) return this.#number; else this.#number = it; }

  #int = null;

  int() { return this.#int; }

  __int(it) { if (it === undefined) return this.#int; else this.#int = it; }

  #duration = null;

  duration() { return this.#duration; }

  __duration(it) { if (it === undefined) return this.#duration; else this.#duration = it; }

  #date = null;

  date() { return this.#date; }

  __date(it) { if (it === undefined) return this.#date; else this.#date = it; }

  #time = null;

  time() { return this.#time; }

  __time(it) { if (it === undefined) return this.#time; else this.#time = it; }

  #dateTime = null;

  dateTime() { return this.#dateTime; }

  __dateTime(it) { if (it === undefined) return this.#dateTime; else this.#dateTime = it; }

  #ref = null;

  ref() { return this.#ref; }

  __ref(it) { if (it === undefined) return this.#ref; else this.#ref = it; }

  #enum = null;

  enum() { return this.#enum; }

  __enum(it) { if (it === undefined) return this.#enum; else this.#enum = it; }

  #and = null;

  and() { return this.#and; }

  __and(it) { if (it === undefined) return this.#and; else this.#and = it; }

  #or = null;

  or() { return this.#or; }

  __or(it) { if (it === undefined) return this.#or; else this.#or = it; }

  #query = null;

  query() { return this.#query; }

  __query(it) { if (it === undefined) return this.#query; else this.#query = it; }

  static make(lib) {
    const $self = new MSys();
    MSys.make$($self,lib);
    return $self;
  }

  static make$($self,lib) {
    let x = lib.m().specsMap();
    $self.#obj = sys.ObjUtil.coerce(x.get("Obj"), XetoSpec.type$);
    $self.#none = sys.ObjUtil.coerce(x.get("None"), XetoSpec.type$);
    $self.#self = sys.ObjUtil.coerce(x.get("Self"), XetoSpec.type$);
    $self.#seq = sys.ObjUtil.coerce(x.get("Seq"), XetoSpec.type$);
    $self.#dict = sys.ObjUtil.coerce(x.get("Dict"), XetoSpec.type$);
    $self.#list = sys.ObjUtil.coerce(x.get("List"), XetoSpec.type$);
    $self.#func = sys.ObjUtil.coerce(x.get("Func"), XetoSpec.type$);
    $self.#grid = sys.ObjUtil.coerce(x.get("Grid"), XetoSpec.type$);
    $self.#lib = sys.ObjUtil.coerce(x.get("Lib"), XetoSpec.type$);
    $self.#spec = sys.ObjUtil.coerce(x.get("Spec"), XetoSpec.type$);
    $self.#scalar = sys.ObjUtil.coerce(x.get("Scalar"), XetoSpec.type$);
    $self.#marker = sys.ObjUtil.coerce(x.get("Marker"), XetoSpec.type$);
    $self.#bool = sys.ObjUtil.coerce(x.get("Bool"), XetoSpec.type$);
    $self.#str = sys.ObjUtil.coerce(x.get("Str"), XetoSpec.type$);
    $self.#uri = sys.ObjUtil.coerce(x.get("Uri"), XetoSpec.type$);
    $self.#number = sys.ObjUtil.coerce(x.get("Number"), XetoSpec.type$);
    $self.#int = sys.ObjUtil.coerce(x.get("Int"), XetoSpec.type$);
    $self.#duration = sys.ObjUtil.coerce(x.get("Duration"), XetoSpec.type$);
    $self.#date = sys.ObjUtil.coerce(x.get("Date"), XetoSpec.type$);
    $self.#time = sys.ObjUtil.coerce(x.get("Time"), XetoSpec.type$);
    $self.#dateTime = sys.ObjUtil.coerce(x.get("DateTime"), XetoSpec.type$);
    $self.#ref = sys.ObjUtil.coerce(x.get("Ref"), XetoSpec.type$);
    $self.#enum = sys.ObjUtil.coerce(x.get("Enum"), XetoSpec.type$);
    $self.#and = sys.ObjUtil.coerce(x.get("And"), XetoSpec.type$);
    $self.#or = sys.ObjUtil.coerce(x.get("Or"), XetoSpec.type$);
    $self.#query = sys.ObjUtil.coerce(x.get("Query"), XetoSpec.type$);
    return;
  }

}

class MNameDict extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MNameDict.type$; }

  toStr() { return haystack.Dict.prototype.toStr.apply(this, arguments); }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  static #empty = undefined;

  static empty() {
    if (MNameDict.#empty === undefined) {
      MNameDict.static$init();
      if (MNameDict.#empty === undefined) MNameDict.#empty = null;
    }
    return MNameDict.#empty;
  }

  #wrapped = null;

  wrapped() { return this.#wrapped; }

  __wrapped(it) { if (it === undefined) return this.#wrapped; else this.#wrapped = it; }

  static wrap(wrapped) {
    if (wrapped.isEmpty()) {
      return MNameDict.empty();
    }
    ;
    return MNameDict.make(wrapped);
  }

  static make(wrapped) {
    const $self = new MNameDict();
    MNameDict.make$($self,wrapped);
    return $self;
  }

  static make$($self,wrapped) {
    $self.#wrapped = wrapped;
    return;
  }

  isEmpty() {
    return this.#wrapped.isEmpty();
  }

  has(n) {
    return this.#wrapped.has(n);
  }

  missing(n) {
    return this.#wrapped.missing(n);
  }

  get(n,def) {
    if (def === undefined) def = null;
    return this.#wrapped.get(n, def);
  }

  each(f) {
    this.#wrapped.each(f);
    return;
  }

  eachWhile(f) {
    return this.#wrapped.eachWhile(f);
  }

  trap(n,a) {
    if (a === undefined) a = null;
    return this.#wrapped.trap(n, a);
  }

  static static$init() {
    MNameDict.#empty = MNameDict.make(xeto.NameDict.empty());
    return;
  }

}

class MSpecArgs extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MSpecArgs.type$; }

  static #nil = undefined;

  static nil() {
    if (MSpecArgs.#nil === undefined) {
      MSpecArgs.static$init();
      if (MSpecArgs.#nil === undefined) MSpecArgs.#nil = null;
    }
    return MSpecArgs.#nil;
  }

  of(checked) {
    if (checked) {
      throw haystack.UnknownNameErr.make("Missing 'of' meta");
    }
    ;
    return null;
  }

  ofs(checked) {
    if (checked) {
      throw haystack.UnknownNameErr.make("Missing 'ofs' meta");
    }
    ;
    return null;
  }

  static make() {
    const $self = new MSpecArgs();
    MSpecArgs.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    MSpecArgs.#nil = MSpecArgs.make();
    return;
  }

}

class MSpecArgsOf extends MSpecArgs {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MSpecArgsOf.type$; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(val) {
    const $self = new MSpecArgsOf();
    MSpecArgsOf.make$($self,val);
    return $self;
  }

  static make$($self,val) {
    MSpecArgs.make$($self);
    $self.#val = val;
    return;
  }

  of(checked) {
    return this.#val;
  }

}

class MSpecArgsOfs extends MSpecArgs {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MSpecArgsOfs.type$; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(val) {
    const $self = new MSpecArgsOfs();
    MSpecArgsOfs.make$($self,val);
    return $self;
  }

  static make$($self,val) {
    MSpecArgs.make$($self);
    $self.#val = sys.ObjUtil.coerce(((this$) => { let $_u38 = val; if ($_u38 == null) return null; return sys.ObjUtil.toImmutable(val); })($self), sys.Type.find("xetoEnv::XetoSpec[]"));
    return;
  }

  ofs(checked) {
    return this.#val;
  }

}

class MChoice extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MChoice.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #spec = null;

  spec() { return this.#spec; }

  __spec(it) { if (it === undefined) return this.#spec; else this.#spec = it; }

  static make(ns,spec) {
    const $self = new MChoice();
    MChoice.make$($self,ns,spec);
    return $self;
  }

  static make$($self,ns,spec) {
    if (!spec.isChoice()) {
      throw sys.UnsupportedErr.make(sys.Str.plus("Spec is not choice: ", spec.qname()));
    }
    ;
    $self.#ns = sys.ObjUtil.coerce(ns, MNamespace.type$);
    $self.#spec = spec;
    return;
  }

  type() {
    return this.#spec.type();
  }

  isMaybe() {
    return MChoice.maybe(this.#spec);
  }

  isMultiChoice() {
    return MChoice.multiChoice(this.#spec);
  }

  selections(instance,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let selections = sys.List.make(xeto.Spec.type$);
    MChoice.findSelections(this.#ns, this.#spec, instance, selections);
    if (checked) {
      MChoice.validate(this.#spec, sys.ObjUtil.coerce(sys.ObjUtil.coerce(selections, sys.Obj.type$), sys.Type.find("xetoEnv::CSpec[]")), (err) => {
        throw sys.Err.make(err);
      });
    }
    ;
    return selections;
  }

  selection(instance,checked) {
    if (checked === undefined) checked = true;
    return this.selections(instance, checked).first();
  }

  static check(ns,spec,instance,onErr) {
    let selections = sys.List.make(CSpec.type$);
    MChoice.findSelections(ns, spec, instance, selections);
    MChoice.validate(spec, selections, onErr);
    return;
  }

  static findSelections(ns,spec,instance,acc) {
    const this$ = this;
    ns.eachSubtype(spec.ctype(), (x) => {
      if (!x.isChoice()) {
        return;
      }
      ;
      if (!x.hasSlots()) {
        return;
      }
      ;
      if (MChoice.xhasChoiceMarkers(instance, x)) {
        acc.add(x);
      }
      ;
      return;
    });
    if (sys.ObjUtil.compareLE(acc.size(), 1)) {
      return;
    }
    ;
    let temp = XetoUtil.excludeSupertypes(sys.ObjUtil.coerce(acc, sys.Type.find("xetoEnv::CSpec[]")));
    acc.clear().addAll(temp);
    return;
  }

  static validate(spec,selections,onErr) {
    const this$ = this;
    if (sys.ObjUtil.equals(selections.size(), 1)) {
      return;
    }
    ;
    if (sys.ObjUtil.equals(selections.size(), 0)) {
      if (MChoice.maybe(spec)) {
        return;
      }
      ;
      sys.Func.call(onErr, sys.Str.plus(sys.Str.plus("Missing required choice '", spec.ctype()), "'"));
      return;
    }
    ;
    if (MChoice.multiChoice(spec)) {
      return;
    }
    ;
    sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus("Conflicting choice '", spec.ctype()), "': "), selections.join(", ", (it) => {
      return it.name();
    })));
    return;
  }

  static xhasChoiceMarkers(instance,choice) {
    const this$ = this;
    let r = choice.cslotsWhile((slot) => {
      return ((this$) => { if (instance.has(slot.name())) return null; return "break"; })(this$);
    });
    return r == null;
  }

  static maybe(spec) {
    return spec.isMaybe();
  }

  static multiChoice(spec) {
    return spec.cmeta().has("multiChoice");
  }

}

class MType extends MSpec {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MType.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #qname = null;

  qname() { return this.#qname; }

  __qname(it) { if (it === undefined) return this.#qname; else this.#qname = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #binding = null;

  binding() { return this.#binding; }

  __binding(it) { if (it === undefined) return this.#binding; else this.#binding = it; }

  #enumRef = null;

  // private field reflection only
  __enumRef(it) { if (it === undefined) return this.#enumRef; else this.#enumRef = it; }

  static make(loc,lib,qname,nameCode,name,base,self$,meta,metaOwn,slots,slotsOwn,flags,args,binding) {
    const $self = new MType();
    MType.make$($self,loc,lib,qname,nameCode,name,base,self$,meta,metaOwn,slots,slotsOwn,flags,args,binding);
    return $self;
  }

  static make$($self,loc,lib,qname,nameCode,name,base,self$,meta,metaOwn,slots,slotsOwn,flags,args,binding) {
    MSpec.make$($self, loc, null, nameCode, name, base, self$, meta, metaOwn, slots, slotsOwn, flags, args);
    $self.#lib = lib;
    $self.#qname = qname;
    $self.#id = sys.ObjUtil.coerce(haystack.Ref.make(qname, null), haystack.Ref.type$);
    $self.__type(self$);
    $self.#binding = binding;
    return;
  }

  flavor() {
    return xeto.SpecFlavor.type();
  }

  enum() {
    if (this.#enumRef != null) {
      return sys.ObjUtil.coerce(this.#enumRef, MEnum.type$);
    }
    ;
    if (!this.hasFlag(MSpecFlags.enum())) {
      return MSpec.prototype.enum.call(this);
    }
    ;
    sys.ObjUtil.trap(MType.type$.slot("enumRef"),"setConst", sys.List.make(sys.Obj.type$.toNullable(), [this, MEnum.init(this)]));
    return sys.ObjUtil.coerce(this.#enumRef, MEnum.type$);
  }

  toStr() {
    return this.#qname;
  }

}

class MLib extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return MLib.type$; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #id = null;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #nameCode = 0;

  nameCode() { return this.#nameCode; }

  __nameCode(it) { if (it === undefined) return this.#nameCode; else this.#nameCode = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #isSys = false;

  isSys() { return this.#isSys; }

  __isSys(it) { if (it === undefined) return this.#isSys; else this.#isSys = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #depends = null;

  depends() { return this.#depends; }

  __depends(it) { if (it === undefined) return this.#depends; else this.#depends = it; }

  #specsMap = null;

  specsMap() { return this.#specsMap; }

  __specsMap(it) { if (it === undefined) return this.#specsMap; else this.#specsMap = it; }

  #instancesMap = null;

  instancesMap() { return this.#instancesMap; }

  __instancesMap(it) { if (it === undefined) return this.#instancesMap; else this.#instancesMap = it; }

  #files = null;

  files() { return this.#files; }

  __files(it) { if (it === undefined) return this.#files; else this.#files = it; }

  static #libSpecRef = undefined;

  static libSpecRef() {
    if (MLib.#libSpecRef === undefined) {
      MLib.static$init();
      if (MLib.#libSpecRef === undefined) MLib.#libSpecRef = null;
    }
    return MLib.#libSpecRef;
  }

  #flags = 0;

  flags() { return this.#flags; }

  __flags(it) { if (it === undefined) return this.#flags; else this.#flags = it; }

  #specs$Store = undefined;

  // private field reflection only
  __specs$Store(it) { if (it === undefined) return this.#specs$Store; else this.#specs$Store = it; }

  #types$Store = undefined;

  // private field reflection only
  __types$Store(it) { if (it === undefined) return this.#types$Store; else this.#types$Store = it; }

  #globals$Store = undefined;

  // private field reflection only
  __globals$Store(it) { if (it === undefined) return this.#globals$Store; else this.#globals$Store = it; }

  #metaSpecs$Store = undefined;

  // private field reflection only
  __metaSpecs$Store(it) { if (it === undefined) return this.#metaSpecs$Store; else this.#metaSpecs$Store = it; }

  #instances$Store = undefined;

  // private field reflection only
  __instances$Store(it) { if (it === undefined) return this.#instances$Store; else this.#instances$Store = it; }

  static make(loc,nameCode,name,meta,flags,version,depends,specsMap,instancesMap,files) {
    const $self = new MLib();
    MLib.make$($self,loc,nameCode,name,meta,flags,version,depends,specsMap,instancesMap,files);
    return $self;
  }

  static make$($self,loc,nameCode,name,meta,flags,version,depends,specsMap,instancesMap,files) {
    ;
    $self.#loc = loc;
    $self.#nameCode = nameCode;
    $self.#name = name;
    $self.#id = sys.ObjUtil.coerce(haystack.Ref.make(sys.StrBuf.make(sys.Int.plus(4, sys.Str.size(name))).add("lib:").add(name).toStr(), null), xeto.Ref.type$);
    $self.#isSys = sys.ObjUtil.equals(name, "sys");
    $self.#meta = meta;
    $self.#flags = flags;
    $self.#version = version;
    $self.#depends = sys.ObjUtil.coerce(((this$) => { let $_u40 = depends; if ($_u40 == null) return null; return sys.ObjUtil.toImmutable(depends); })($self), sys.Type.find("xeto::LibDepend[]"));
    $self.#specsMap = sys.ObjUtil.coerce(((this$) => { let $_u41 = specsMap; if ($_u41 == null) return null; return sys.ObjUtil.toImmutable(specsMap); })($self), sys.Type.find("[sys::Str:xeto::Spec]"));
    $self.#instancesMap = sys.ObjUtil.coerce(((this$) => { let $_u42 = instancesMap; if ($_u42 == null) return null; return sys.ObjUtil.toImmutable(instancesMap); })($self), sys.Type.find("[sys::Str:xeto::Dict]"));
    $self.#files = files;
    return;
  }

  specs() {
    if (this.#specs$Store === undefined) {
      this.#specs$Store = this.specs$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#specs$Store, sys.Type.find("xeto::Spec[]"));
  }

  spec(name,checked) {
    if (checked === undefined) checked = true;
    let x = this.#specsMap.get(name);
    if (x != null) {
      return x;
    }
    ;
    if (checked) {
      throw haystack.UnknownSpecErr.make(sys.Str.plus(sys.Str.plus(this.#name, "::"), name));
    }
    ;
    return null;
  }

  types() {
    if (this.#types$Store === undefined) {
      this.#types$Store = this.types$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#types$Store, sys.Type.find("xeto::Spec[]"));
  }

  type(name,checked) {
    if (checked === undefined) checked = true;
    let top = this.spec(name, checked);
    if ((top != null && top.isType())) {
      return top;
    }
    ;
    if (checked) {
      throw haystack.UnknownSpecErr.make(sys.Str.plus(sys.Str.plus(this.#name, "::"), name));
    }
    ;
    return null;
  }

  globals() {
    if (this.#globals$Store === undefined) {
      this.#globals$Store = this.globals$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#globals$Store, sys.Type.find("xeto::Spec[]"));
  }

  global(name,checked) {
    if (checked === undefined) checked = true;
    let top = this.spec(name, checked);
    if ((top != null && top.isGlobal())) {
      return top;
    }
    ;
    if (checked) {
      throw haystack.UnknownSpecErr.make(sys.Str.plus(sys.Str.plus(this.#name, "::"), name));
    }
    ;
    return null;
  }

  metaSpecs() {
    if (this.#metaSpecs$Store === undefined) {
      this.#metaSpecs$Store = this.metaSpecs$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#metaSpecs$Store, sys.Type.find("xeto::Spec[]"));
  }

  metaSpec(name,checked) {
    if (checked === undefined) checked = true;
    let top = this.spec(name, checked);
    if ((top != null && top.isMeta())) {
      return top;
    }
    ;
    if (checked) {
      throw haystack.UnknownSpecErr.make(sys.Str.plus(sys.Str.plus(this.#name, "::"), name));
    }
    ;
    return null;
  }

  instances() {
    if (this.#instances$Store === undefined) {
      this.#instances$Store = this.instances$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#instances$Store, sys.Type.find("xeto::Dict[]"));
  }

  instance(name,checked) {
    if (checked === undefined) checked = true;
    let instance = this.#instancesMap.get(name);
    if (instance != null) {
      return instance;
    }
    ;
    if (checked) {
      throw haystack.UnknownRecErr.make(sys.Str.plus(sys.Str.plus(this.#name, "::"), name));
    }
    ;
    return null;
  }

  eachInstance(f) {
    this.#instancesMap.each(f);
    return;
  }

  toStr() {
    return this.#name;
  }

  get(name,def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(name, "id")) {
      return this.#id;
    }
    ;
    if (sys.ObjUtil.equals(name, "spec")) {
      return MLib.libSpecRef();
    }
    ;
    if (sys.ObjUtil.equals(name, "loaded")) {
      return haystack.Marker.val();
    }
    ;
    return this.#meta.get(name, def);
  }

  has(name) {
    if (sys.ObjUtil.equals(name, "id")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(name, "spec")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(name, "loaded")) {
      return true;
    }
    ;
    return this.#meta.has(name);
  }

  missing(name) {
    if (sys.ObjUtil.equals(name, "id")) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(name, "spec")) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(name, "loaded")) {
      return false;
    }
    ;
    return this.#meta.missing(name);
  }

  each(f) {
    sys.Func.call(f, this.#id, "id");
    sys.Func.call(f, MLib.libSpecRef(), "spec");
    sys.Func.call(f, haystack.Marker.val(), "loaded");
    this.#meta.each(f);
    return;
  }

  eachWhile(f) {
    let r = sys.Func.call(f, this.#id, "id");
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, MLib.libSpecRef(), "spec"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, haystack.Marker.val(), "loaded"));
    if (r != null) {
      return r;
    }
    ;
    return this.#meta.eachWhile(f);
  }

  trap(name,args) {
    if (args === undefined) args = null;
    let val = this.get(name, null);
    if (val != null) {
      return val;
    }
    ;
    return this.#meta.trap(name, args);
  }

  hasFlag(flag) {
    return sys.ObjUtil.compareNE(sys.Int.and(this.#flags, flag), 0);
  }

  specs$Once() {
    const this$ = this;
    if (this.#specsMap.isEmpty()) {
      return sys.ObjUtil.coerce(xeto.Spec.type$.emptyList(), sys.Type.find("xeto::Spec[]"));
    }
    else {
      return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.#specsMap.vals().sort((a,b) => {
        return sys.ObjUtil.compare(a.name(), b.name());
      })), sys.Type.find("xeto::Spec[]"));
    }
    ;
  }

  types$Once() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.specs().findAll((x) => {
      return x.isType();
    })), sys.Type.find("xeto::Spec[]"));
  }

  globals$Once() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.specs().findAll((x) => {
      return x.isGlobal();
    })), sys.Type.find("xeto::Spec[]"));
  }

  metaSpecs$Once() {
    const this$ = this;
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.specs().findAll((x) => {
      return x.isMeta();
    })), sys.Type.find("xeto::Spec[]"));
  }

  instances$Once() {
    const this$ = this;
    if (this.#instancesMap.isEmpty()) {
      return sys.ObjUtil.coerce(xeto.Dict.type$.emptyList(), sys.Type.find("xeto::Dict[]"));
    }
    else {
      return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.#instancesMap.vals().sort((a,b) => {
        return sys.ObjUtil.compare(a.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])), b.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])));
      })), sys.Type.find("xeto::Dict[]"));
    }
    ;
  }

  static static$init() {
    MLib.#libSpecRef = sys.ObjUtil.coerce(haystack.Ref.fromStr("sys::Lib"), xeto.Ref.type$);
    return;
  }

}

class MLibFlags extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MLibFlags.type$; }

  static #hasXMeta = undefined;

  static hasXMeta() {
    if (MLibFlags.#hasXMeta === undefined) {
      MLibFlags.static$init();
      if (MLibFlags.#hasXMeta === undefined) MLibFlags.#hasXMeta = 0;
    }
    return MLibFlags.#hasXMeta;
  }

  static #hasMarkdown = undefined;

  static hasMarkdown() {
    if (MLibFlags.#hasMarkdown === undefined) {
      MLibFlags.static$init();
      if (MLibFlags.#hasMarkdown === undefined) MLibFlags.#hasMarkdown = 0;
    }
    return MLibFlags.#hasMarkdown;
  }

  static flagsToStr(flags) {
    const this$ = this;
    let s = sys.StrBuf.make();
    MLibFlags.type$.fields().each((f) => {
      if ((f.isStatic() && sys.ObjUtil.equals(f.type(), sys.Int.type$))) {
        let has = sys.ObjUtil.compareNE(sys.Int.and(flags, sys.ObjUtil.coerce(f.get(null), sys.Int.type$)), 0);
        if (has) {
          s.join(f.name(), ",");
        }
        ;
      }
      ;
      return;
    });
    return sys.Str.plus(sys.Str.plus("{", s.toStr()), "}");
  }

  static make() {
    const $self = new MLibFlags();
    MLibFlags.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    MLibFlags.#hasXMeta = 1;
    MLibFlags.#hasMarkdown = 2;
    return;
  }

}

class XetoLib extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoLib.type$; }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #m = null;

  m() { return this.#m; }

  __m(it) { if (it === undefined) return this.#m; else this.#m = it; }

  loc() {
    return this.#m.loc();
  }

  id() {
    return sys.ObjUtil.coerce(this.#m.id(), haystack.Ref.type$);
  }

  _id() {
    return sys.ObjUtil.coerce(this.#m.id(), haystack.Ref.type$);
  }

  name() {
    return this.#m.name();
  }

  meta() {
    return this.#m.meta();
  }

  version() {
    return this.#m.version();
  }

  depends() {
    return this.#m.depends();
  }

  specs() {
    return this.#m.specs();
  }

  spec(name,checked) {
    if (checked === undefined) checked = true;
    return this.#m.spec(name, checked);
  }

  types() {
    return this.#m.types();
  }

  type(name,checked) {
    if (checked === undefined) checked = true;
    return this.#m.type(name, checked);
  }

  globals() {
    return this.#m.globals();
  }

  global(name,checked) {
    if (checked === undefined) checked = true;
    return this.#m.global(name, checked);
  }

  metaSpecs() {
    return this.#m.metaSpecs();
  }

  metaSpec(name,checked) {
    if (checked === undefined) checked = true;
    return this.#m.metaSpec(name, checked);
  }

  instances() {
    return this.#m.instances();
  }

  instance(name,checked) {
    if (checked === undefined) checked = true;
    return this.#m.instance(name, checked);
  }

  eachInstance(f) {
    this.#m.eachInstance(f);
    return;
  }

  isSys() {
    return this.#m.isSys();
  }

  hasXMeta() {
    return this.#m.hasFlag(MLibFlags.hasXMeta());
  }

  hasMarkdown() {
    return this.#m.hasFlag(MLibFlags.hasMarkdown());
  }

  files() {
    return this.#m.files();
  }

  isEmpty() {
    return false;
  }

  get(n,d) {
    if (d === undefined) d = null;
    return this.#m.get(n, d);
  }

  has(n) {
    return this.#m.has(n);
  }

  missing(n) {
    return this.#m.missing(n);
  }

  each(f) {
    this.#m.each(f);
    return;
  }

  eachWhile(f) {
    return this.#m.eachWhile(f);
  }

  trap(n,a) {
    if (a === undefined) a = null;
    return this.#m.trap(n, a);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.name()), "-"), this.version());
  }

  static make() {
    const $self = new XetoLib();
    XetoLib.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class MLibFiles extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MLibFiles.type$; }

  readBuf(uri) {
    const this$ = this;
    let val = null;
    this.read(uri, (err,in$) => {
      if (err != null) {
        throw sys.ObjUtil.coerce(err, sys.Err.type$);
      }
      ;
      (val = in$.readAllBuf());
      return;
    });
    return sys.ObjUtil.coerce(val, sys.Buf.type$);
  }

  readStr(uri) {
    const this$ = this;
    let val = null;
    this.read(uri, (err,in$) => {
      if (err != null) {
        throw sys.ObjUtil.coerce(err, sys.Err.type$);
      }
      ;
      (val = in$.readAllStr());
      return;
    });
    return sys.ObjUtil.coerce(val, sys.Str.type$);
  }

  static make() {
    const $self = new MLibFiles();
    MLibFiles.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class UnsupportedLibFiles extends MLibFiles {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnsupportedLibFiles.type$; }

  static #val = undefined;

  static val() {
    if (UnsupportedLibFiles.#val === undefined) {
      UnsupportedLibFiles.static$init();
      if (UnsupportedLibFiles.#val === undefined) UnsupportedLibFiles.#val = null;
    }
    return UnsupportedLibFiles.#val;
  }

  static make() {
    const $self = new UnsupportedLibFiles();
    UnsupportedLibFiles.make$($self);
    return $self;
  }

  static make$($self) {
    MLibFiles.make$($self);
    return;
  }

  isSupported() {
    return false;
  }

  list() {
    throw sys.UnsupportedErr.make();
  }

  read(uri,f) {
    throw sys.UnsupportedErr.make();
  }

  static static$init() {
    UnsupportedLibFiles.#val = UnsupportedLibFiles.make();
    return;
  }

}

class EmptyLibFiles extends MLibFiles {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EmptyLibFiles.type$; }

  static #val = undefined;

  static val() {
    if (EmptyLibFiles.#val === undefined) {
      EmptyLibFiles.static$init();
      if (EmptyLibFiles.#val === undefined) EmptyLibFiles.#val = null;
    }
    return EmptyLibFiles.#val;
  }

  static make() {
    const $self = new EmptyLibFiles();
    EmptyLibFiles.make$($self);
    return $self;
  }

  static make$($self) {
    MLibFiles.make$($self);
    return;
  }

  isSupported() {
    return true;
  }

  list() {
    return sys.ObjUtil.coerce(sys.Uri.type$.emptyList(), sys.Type.find("sys::Uri[]"));
  }

  read(uri,f) {
    sys.Func.call(f, sys.UnresolvedErr.make(uri.toStr()), null);
    return;
  }

  static static$init() {
    EmptyLibFiles.#val = EmptyLibFiles.make();
    return;
  }

}

class DirLibFiles extends MLibFiles {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return DirLibFiles.type$; }

  #dir = null;

  dir() { return this.#dir; }

  __dir(it) { if (it === undefined) return this.#dir; else this.#dir = it; }

  #list$Store = undefined;

  // private field reflection only
  __list$Store(it) { if (it === undefined) return this.#list$Store; else this.#list$Store = it; }

  static make(dir) {
    const $self = new DirLibFiles();
    DirLibFiles.make$($self,dir);
    return $self;
  }

  static make$($self,dir) {
    MLibFiles.make$($self);
    ;
    $self.#dir = dir;
    return;
  }

  isSupported() {
    return true;
  }

  list() {
    if (this.#list$Store === undefined) {
      this.#list$Store = this.list$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#list$Store, sys.Type.find("sys::Uri[]"));
  }

  read(uri,f) {
    if (this.list().contains(uri)) {
      let file = this.#dir.plus(uri.relTo(sys.Uri.fromStr("/")));
      if (file.exists()) {
        this.doRead(file, f);
        return;
      }
      ;
    }
    ;
    sys.Func.call(f, sys.UnresolvedErr.make(uri.toStr()), null);
    return;
  }

  doRead(file,f) {
    let in$ = null;
    try {
      try {
        sys.Func.call(f, null, (in$ = file.in()));
      }
      catch ($_u43) {
        $_u43 = sys.Err.make($_u43);
        if ($_u43 instanceof sys.Err) {
          let e = $_u43;
          ;
          sys.Func.call(f, e, null);
        }
        else {
          throw $_u43;
        }
      }
      ;
    }
    catch ($_u44) {
      $_u44 = sys.Err.make($_u44);
      if ($_u44 instanceof sys.Err) {
        let e = $_u44;
        ;
      }
      else {
        throw $_u44;
      }
    }
    finally {
      ((this$) => { let $_u45 = in$; if ($_u45 == null) return null; return in$.close(); })(this);
    }
    ;
    return;
  }

  list$Once() {
    const this$ = this;
    let acc = sys.List.make(sys.Uri.type$);
    this.#dir.walk((f) => {
      if (f.isDir()) {
        return;
      }
      ;
      if (sys.ObjUtil.equals(f.ext(), "xeto")) {
        return;
      }
      ;
      if (sys.Str.startsWith(f.name(), ".")) {
        return;
      }
      ;
      let rel = sys.Str.toUri(sys.Str.getRange(f.uri().toStr(), sys.Range.make(sys.Int.minus(sys.Str.size(this$.#dir.toStr()), 1), -1)));
      acc.add(rel);
      return;
    });
    acc.sort();
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("sys::Uri[]"));
  }

}

class ZipLibFiles extends MLibFiles {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ZipLibFiles.type$; }

  #zipFile = null;

  zipFile() { return this.#zipFile; }

  __zipFile(it) { if (it === undefined) return this.#zipFile; else this.#zipFile = it; }

  #list = null;

  list() { return this.#list; }

  __list(it) { if (it === undefined) return this.#list; else this.#list = it; }

  static make(zipFile,list) {
    const $self = new ZipLibFiles();
    ZipLibFiles.make$($self,zipFile,list);
    return $self;
  }

  static make$($self,zipFile,list) {
    MLibFiles.make$($self);
    $self.#zipFile = zipFile;
    $self.#list = sys.ObjUtil.coerce(((this$) => { let $_u46 = list; if ($_u46 == null) return null; return sys.ObjUtil.toImmutable(list); })($self), sys.Type.find("sys::Uri[]"));
    return;
  }

  isSupported() {
    return true;
  }

  read(uri,f) {
    if (this.#list.contains(uri)) {
      this.doRead(uri, f);
    }
    else {
      sys.Func.call(f, sys.UnresolvedErr.make(uri.toStr()), null);
    }
    ;
    return;
  }

  doRead(uri,f) {
    let zip = null;
    try {
      let in$ = null;
      try {
        (zip = sys.Zip.open(this.#zipFile));
        (in$ = zip.contents().getChecked(uri).in());
      }
      catch ($_u47) {
        $_u47 = sys.Err.make($_u47);
        if ($_u47 instanceof sys.Err) {
          let e = $_u47;
          ;
          sys.Func.call(f, e, null);
          return;
        }
        else {
          throw $_u47;
        }
      }
      ;
      sys.Func.call(f, null, in$);
    }
    finally {
      ((this$) => { let $_u48 = zip; if ($_u48 == null) return null; return zip.close(); })(this);
    }
    ;
    return;
  }

}

class XetoSpec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoSpec.type$; }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  isCompound() { return CSpec.prototype.isCompound.apply(this, arguments); }

  #m = null;

  m() { return this.#m; }

  __m(it) { if (it === undefined) return this.#m; else this.#m = it; }

  static make() {
    const $self = new XetoSpec();
    XetoSpec.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static makem(m) {
    const $self = new XetoSpec();
    XetoSpec.makem$($self,m);
    return $self;
  }

  static makem$($self,m) {
    $self.#m = m;
    return;
  }

  lib() {
    return this.#m.lib();
  }

  parent() {
    return this.#m.parent();
  }

  id() {
    return this.#m.id();
  }

  _id() {
    return this.#m.id();
  }

  name() {
    return this.#m.name();
  }

  qname() {
    return this.#m.qname();
  }

  type() {
    return this.#m.type();
  }

  base() {
    return this.#m.base();
  }

  meta() {
    return this.#m.meta();
  }

  metaOwn() {
    return this.#m.metaOwn();
  }

  hasSlots() {
    return this.#m.hasSlots();
  }

  slotsOwn() {
    return this.#m.slotsOwn();
  }

  slots() {
    return this.#m.slots();
  }

  slot(n,c) {
    if (c === undefined) c = true;
    return this.#m.slot(n, c);
  }

  slotOwn(n,c) {
    if (c === undefined) c = true;
    return this.#m.slotOwn(n, c);
  }

  isa(x) {
    return XetoUtil.isa(this, sys.ObjUtil.coerce(x, CSpec.type$));
  }

  cisa(x) {
    return XetoUtil.isa(this, x);
  }

  loc() {
    return this.#m.loc();
  }

  binding() {
    return this.#m.binding();
  }

  isEmpty() {
    return false;
  }

  get(n,d) {
    if (d === undefined) d = null;
    return this.#m.get(n, d);
  }

  has(n) {
    return this.#m.has(n);
  }

  missing(n) {
    return this.#m.missing(n);
  }

  each(f) {
    this.#m.each(f);
    return;
  }

  eachWhile(f) {
    return this.#m.eachWhile(f);
  }

  trap(n,a) {
    if (a === undefined) a = null;
    return this.#m.trap(n, a);
  }

  toStr() {
    return sys.ObjUtil.coerce(((this$) => { let $_u49 = ((this$) => { let $_u50 = this$.#m; if ($_u50 == null) return null; return this$.#m.toStr(); })(this$); if ($_u49 != null) return $_u49; return sys.ObjUtil.toStr(sys.Obj.prototype); })(this), sys.Str.type$);
  }

  args() {
    return this.#m.args();
  }

  of(checked) {
    if (checked === undefined) checked = true;
    return this.#m.args().of(checked);
  }

  ofs(checked) {
    if (checked === undefined) checked = true;
    return this.#m.args().ofs(checked);
  }

  isSys() {
    return this.lib().isSys();
  }

  enum() {
    return this.#m.enum();
  }

  cenum(key,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.as(this.#m.enum().spec(key, checked), CSpec.type$);
  }

  flavor() {
    return this.#m.flavor();
  }

  isType() {
    return this.flavor().isType();
  }

  isGlobal() {
    return this.flavor().isGlobal();
  }

  isMeta() {
    return this.flavor().isMeta();
  }

  isSlot() {
    return this.flavor().isSlot();
  }

  isNone() {
    return this.#m.hasFlag(MSpecFlags.none());
  }

  isSelf() {
    return this.#m.hasFlag(MSpecFlags.self());
  }

  isMaybe() {
    return this.#m.hasFlag(MSpecFlags.maybe());
  }

  isScalar() {
    return this.#m.hasFlag(MSpecFlags.scalar());
  }

  isMarker() {
    return this.#m.hasFlag(MSpecFlags.marker());
  }

  isRef() {
    return this.#m.hasFlag(MSpecFlags.ref());
  }

  isMultiRef() {
    return this.#m.hasFlag(MSpecFlags.multiRef());
  }

  isChoice() {
    return this.#m.hasFlag(MSpecFlags.choice());
  }

  isDict() {
    return this.#m.hasFlag(MSpecFlags.dict());
  }

  isList() {
    return this.#m.hasFlag(MSpecFlags.list());
  }

  isQuery() {
    return this.#m.hasFlag(MSpecFlags.query());
  }

  isFunc() {
    return this.#m.hasFlag(MSpecFlags.func());
  }

  isInterface() {
    return this.#m.hasFlag(MSpecFlags.interface());
  }

  isComp() {
    return this.#m.hasFlag(MSpecFlags.comp());
  }

  isEnum() {
    return this.#m.hasFlag(MSpecFlags.enum());
  }

  isAnd() {
    return this.#m.hasFlag(MSpecFlags.and());
  }

  isOr() {
    return this.#m.hasFlag(MSpecFlags.or());
  }

  isAst() {
    return false;
  }

  asm() {
    return this;
  }

  flags() {
    return this.#m.flags();
  }

  cbase() {
    return this.#m.base();
  }

  ctype() {
    return this.#m.type();
  }

  cparent() {
    return this.#m.parent();
  }

  cmeta() {
    return this.#m.meta();
  }

  cmetaHas(name) {
    return this.#m.meta().has(name);
  }

  cslot(n,c) {
    if (c === undefined) c = true;
    return this.#m.slot(n, c);
  }

  cslots(f) {
    this.#m.slots().map().each(sys.ObjUtil.coerce(f, sys.Type.find("|sys::Obj,sys::Str->sys::Void|")));
    return;
  }

  cslotsWhile(f) {
    return this.#m.slots().map().eachWhile(sys.ObjUtil.coerce(f, sys.Type.find("|sys::Obj,sys::Str->sys::Obj?|")));
  }

  cof() {
    return sys.ObjUtil.coerce(this.of(false), XetoSpec.type$.toNullable());
  }

  cofs() {
    return sys.ObjUtil.coerce(this.ofs(false), sys.Type.find("xetoEnv::XetoSpec[]?"));
  }

  fantomType() {
    return this.#m.fantomType();
  }

}

class MEnum extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MEnum.type$; }

  #map = null;

  map() { return this.#map; }

  __map(it) { if (it === undefined) return this.#map; else this.#map = it; }

  #defKey = null;

  defKey() { return this.#defKey; }

  __defKey(it) { if (it === undefined) return this.#defKey; else this.#defKey = it; }

  static init(enum$) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::Spec"));
    acc.ordered(true);
    let defKey = null;
    enum$.slots().each((x) => {
      let key = ((this$) => { let $_u51 = sys.ObjUtil.as(x.meta().get("key"), sys.Str.type$); if ($_u51 != null) return $_u51; return x.name(); })(this$);
      if (defKey == null) {
        (defKey = key);
      }
      ;
      acc.add(sys.ObjUtil.coerce(key, sys.Str.type$), x);
      return;
    });
    return MEnum.make(acc, sys.ObjUtil.coerce(defKey, sys.Str.type$));
  }

  static make(map,defKey) {
    const $self = new MEnum();
    MEnum.make$($self,map,defKey);
    return $self;
  }

  static make$($self,map,defKey) {
    $self.#map = sys.ObjUtil.coerce(((this$) => { let $_u52 = map; if ($_u52 == null) return null; return sys.ObjUtil.toImmutable(map); })($self), sys.Type.find("[sys::Str:xeto::Spec]"));
    $self.#defKey = defKey;
    return;
  }

  spec(key,checked) {
    if (checked === undefined) checked = true;
    let spec = this.#map.get(key);
    if (spec != null) {
      return spec;
    }
    ;
    if (checked) {
      throw haystack.UnknownNameErr.make(sys.Str.plus(sys.Str.plus("Unknown enum key '", key), "'"));
    }
    ;
    return null;
  }

  keys() {
    return this.#map.keys();
  }

  each(f) {
    this.#map.each(f);
    return;
  }

  xmeta(key,checked) {
    if (key === undefined) key = null;
    if (checked === undefined) checked = true;
    throw sys.UnsupportedErr.make("Must call LibNamespace.xmetaEnum");
  }

}

class MEnumXMeta extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MEnumXMeta.type$; }

  #enum = null;

  enum() { return this.#enum; }

  __enum(it) { if (it === undefined) return this.#enum; else this.#enum = it; }

  #xmetaSelf = null;

  xmetaSelf() { return this.#xmetaSelf; }

  __xmetaSelf(it) { if (it === undefined) return this.#xmetaSelf; else this.#xmetaSelf = it; }

  #xmetaByKey = null;

  xmetaByKey() { return this.#xmetaByKey; }

  __xmetaByKey(it) { if (it === undefined) return this.#xmetaByKey; else this.#xmetaByKey = it; }

  static make(enum$,xmetaSelf,xmetaByKey) {
    const $self = new MEnumXMeta();
    MEnumXMeta.make$($self,enum$,xmetaSelf,xmetaByKey);
    return $self;
  }

  static make$($self,enum$,xmetaSelf,xmetaByKey) {
    $self.#enum = enum$;
    $self.#xmetaSelf = xmetaSelf;
    $self.#xmetaByKey = sys.ObjUtil.coerce(((this$) => { let $_u53 = xmetaByKey; if ($_u53 == null) return null; return sys.ObjUtil.toImmutable(xmetaByKey); })($self), sys.Type.find("[sys::Str:xeto::Dict]"));
    return;
  }

  spec(key,checked) {
    if (checked === undefined) checked = true;
    return this.#enum.spec(key, checked);
  }

  keys() {
    return this.#enum.keys();
  }

  each(f) {
    this.#enum.each(f);
    return;
  }

  xmeta(key,checked) {
    if (key === undefined) key = null;
    if (checked === undefined) checked = true;
    if (key == null) {
      return this.#xmetaSelf;
    }
    ;
    let x = this.#xmetaByKey.get(sys.ObjUtil.coerce(key, sys.Str.type$));
    if (x != null) {
      return x;
    }
    ;
    if (checked) {
      throw haystack.UnknownNameErr.make(sys.Str.plus(sys.Str.plus("Unknown enum key '", key), "'"));
    }
    ;
    return null;
  }

}

class XetoBinaryConst {
  constructor() {
    const this$ = this;
  }

  typeof() { return XetoBinaryConst.type$; }

  static #magic = undefined;

  static magic() {
    if (XetoBinaryConst.#magic === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#magic === undefined) XetoBinaryConst.#magic = 0;
    }
    return XetoBinaryConst.#magic;
  }

  static #magicOverlay = undefined;

  static magicOverlay() {
    if (XetoBinaryConst.#magicOverlay === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#magicOverlay === undefined) XetoBinaryConst.#magicOverlay = 0;
    }
    return XetoBinaryConst.#magicOverlay;
  }

  static #magicEnd = undefined;

  static magicEnd() {
    if (XetoBinaryConst.#magicEnd === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#magicEnd === undefined) XetoBinaryConst.#magicEnd = 0;
    }
    return XetoBinaryConst.#magicEnd;
  }

  static #version = undefined;

  static version() {
    if (XetoBinaryConst.#version === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#version === undefined) XetoBinaryConst.#version = 0;
    }
    return XetoBinaryConst.#version;
  }

  static #magicLib = undefined;

  static magicLib() {
    if (XetoBinaryConst.#magicLib === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#magicLib === undefined) XetoBinaryConst.#magicLib = 0;
    }
    return XetoBinaryConst.#magicLib;
  }

  static #magicLibEnd = undefined;

  static magicLibEnd() {
    if (XetoBinaryConst.#magicLibEnd === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#magicLibEnd === undefined) XetoBinaryConst.#magicLibEnd = 0;
    }
    return XetoBinaryConst.#magicLibEnd;
  }

  static #magicLibVer = undefined;

  static magicLibVer() {
    if (XetoBinaryConst.#magicLibVer === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#magicLibVer === undefined) XetoBinaryConst.#magicLibVer = 0;
    }
    return XetoBinaryConst.#magicLibVer;
  }

  static #specOwnOnly = undefined;

  static specOwnOnly() {
    if (XetoBinaryConst.#specOwnOnly === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#specOwnOnly === undefined) XetoBinaryConst.#specOwnOnly = 0;
    }
    return XetoBinaryConst.#specOwnOnly;
  }

  static #specInherited = undefined;

  static specInherited() {
    if (XetoBinaryConst.#specInherited === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#specInherited === undefined) XetoBinaryConst.#specInherited = 0;
    }
    return XetoBinaryConst.#specInherited;
  }

  static #ctrlNull = undefined;

  static ctrlNull() {
    if (XetoBinaryConst.#ctrlNull === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlNull === undefined) XetoBinaryConst.#ctrlNull = 0;
    }
    return XetoBinaryConst.#ctrlNull;
  }

  static #ctrlMarker = undefined;

  static ctrlMarker() {
    if (XetoBinaryConst.#ctrlMarker === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlMarker === undefined) XetoBinaryConst.#ctrlMarker = 0;
    }
    return XetoBinaryConst.#ctrlMarker;
  }

  static #ctrlNA = undefined;

  static ctrlNA() {
    if (XetoBinaryConst.#ctrlNA === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlNA === undefined) XetoBinaryConst.#ctrlNA = 0;
    }
    return XetoBinaryConst.#ctrlNA;
  }

  static #ctrlRemove = undefined;

  static ctrlRemove() {
    if (XetoBinaryConst.#ctrlRemove === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlRemove === undefined) XetoBinaryConst.#ctrlRemove = 0;
    }
    return XetoBinaryConst.#ctrlRemove;
  }

  static #ctrlTrue = undefined;

  static ctrlTrue() {
    if (XetoBinaryConst.#ctrlTrue === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlTrue === undefined) XetoBinaryConst.#ctrlTrue = 0;
    }
    return XetoBinaryConst.#ctrlTrue;
  }

  static #ctrlFalse = undefined;

  static ctrlFalse() {
    if (XetoBinaryConst.#ctrlFalse === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlFalse === undefined) XetoBinaryConst.#ctrlFalse = 0;
    }
    return XetoBinaryConst.#ctrlFalse;
  }

  static #ctrlName = undefined;

  static ctrlName() {
    if (XetoBinaryConst.#ctrlName === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlName === undefined) XetoBinaryConst.#ctrlName = 0;
    }
    return XetoBinaryConst.#ctrlName;
  }

  static #ctrlStr = undefined;

  static ctrlStr() {
    if (XetoBinaryConst.#ctrlStr === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlStr === undefined) XetoBinaryConst.#ctrlStr = 0;
    }
    return XetoBinaryConst.#ctrlStr;
  }

  static #ctrlNumberNoUnit = undefined;

  static ctrlNumberNoUnit() {
    if (XetoBinaryConst.#ctrlNumberNoUnit === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlNumberNoUnit === undefined) XetoBinaryConst.#ctrlNumberNoUnit = 0;
    }
    return XetoBinaryConst.#ctrlNumberNoUnit;
  }

  static #ctrlNumberUnit = undefined;

  static ctrlNumberUnit() {
    if (XetoBinaryConst.#ctrlNumberUnit === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlNumberUnit === undefined) XetoBinaryConst.#ctrlNumberUnit = 0;
    }
    return XetoBinaryConst.#ctrlNumberUnit;
  }

  static #ctrlInt2 = undefined;

  static ctrlInt2() {
    if (XetoBinaryConst.#ctrlInt2 === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlInt2 === undefined) XetoBinaryConst.#ctrlInt2 = 0;
    }
    return XetoBinaryConst.#ctrlInt2;
  }

  static #ctrlInt8 = undefined;

  static ctrlInt8() {
    if (XetoBinaryConst.#ctrlInt8 === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlInt8 === undefined) XetoBinaryConst.#ctrlInt8 = 0;
    }
    return XetoBinaryConst.#ctrlInt8;
  }

  static #ctrlFloat8 = undefined;

  static ctrlFloat8() {
    if (XetoBinaryConst.#ctrlFloat8 === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlFloat8 === undefined) XetoBinaryConst.#ctrlFloat8 = 0;
    }
    return XetoBinaryConst.#ctrlFloat8;
  }

  static #ctrlDuration = undefined;

  static ctrlDuration() {
    if (XetoBinaryConst.#ctrlDuration === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlDuration === undefined) XetoBinaryConst.#ctrlDuration = 0;
    }
    return XetoBinaryConst.#ctrlDuration;
  }

  static #ctrlRef = undefined;

  static ctrlRef() {
    if (XetoBinaryConst.#ctrlRef === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlRef === undefined) XetoBinaryConst.#ctrlRef = 0;
    }
    return XetoBinaryConst.#ctrlRef;
  }

  static #ctrlUri = undefined;

  static ctrlUri() {
    if (XetoBinaryConst.#ctrlUri === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlUri === undefined) XetoBinaryConst.#ctrlUri = 0;
    }
    return XetoBinaryConst.#ctrlUri;
  }

  static #ctrlDate = undefined;

  static ctrlDate() {
    if (XetoBinaryConst.#ctrlDate === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlDate === undefined) XetoBinaryConst.#ctrlDate = 0;
    }
    return XetoBinaryConst.#ctrlDate;
  }

  static #ctrlTime = undefined;

  static ctrlTime() {
    if (XetoBinaryConst.#ctrlTime === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlTime === undefined) XetoBinaryConst.#ctrlTime = 0;
    }
    return XetoBinaryConst.#ctrlTime;
  }

  static #ctrlDateTime = undefined;

  static ctrlDateTime() {
    if (XetoBinaryConst.#ctrlDateTime === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlDateTime === undefined) XetoBinaryConst.#ctrlDateTime = 0;
    }
    return XetoBinaryConst.#ctrlDateTime;
  }

  static #ctrlBuf = undefined;

  static ctrlBuf() {
    if (XetoBinaryConst.#ctrlBuf === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlBuf === undefined) XetoBinaryConst.#ctrlBuf = 0;
    }
    return XetoBinaryConst.#ctrlBuf;
  }

  static #ctrlGenericScalar = undefined;

  static ctrlGenericScalar() {
    if (XetoBinaryConst.#ctrlGenericScalar === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlGenericScalar === undefined) XetoBinaryConst.#ctrlGenericScalar = 0;
    }
    return XetoBinaryConst.#ctrlGenericScalar;
  }

  static #ctrlTypedScalar = undefined;

  static ctrlTypedScalar() {
    if (XetoBinaryConst.#ctrlTypedScalar === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlTypedScalar === undefined) XetoBinaryConst.#ctrlTypedScalar = 0;
    }
    return XetoBinaryConst.#ctrlTypedScalar;
  }

  static #ctrlEmptyDict = undefined;

  static ctrlEmptyDict() {
    if (XetoBinaryConst.#ctrlEmptyDict === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlEmptyDict === undefined) XetoBinaryConst.#ctrlEmptyDict = 0;
    }
    return XetoBinaryConst.#ctrlEmptyDict;
  }

  static #ctrlNameDict = undefined;

  static ctrlNameDict() {
    if (XetoBinaryConst.#ctrlNameDict === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlNameDict === undefined) XetoBinaryConst.#ctrlNameDict = 0;
    }
    return XetoBinaryConst.#ctrlNameDict;
  }

  static #ctrlGenericDict = undefined;

  static ctrlGenericDict() {
    if (XetoBinaryConst.#ctrlGenericDict === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlGenericDict === undefined) XetoBinaryConst.#ctrlGenericDict = 0;
    }
    return XetoBinaryConst.#ctrlGenericDict;
  }

  static #ctrlTypedDict = undefined;

  static ctrlTypedDict() {
    if (XetoBinaryConst.#ctrlTypedDict === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlTypedDict === undefined) XetoBinaryConst.#ctrlTypedDict = 0;
    }
    return XetoBinaryConst.#ctrlTypedDict;
  }

  static #ctrlSpecRef = undefined;

  static ctrlSpecRef() {
    if (XetoBinaryConst.#ctrlSpecRef === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlSpecRef === undefined) XetoBinaryConst.#ctrlSpecRef = 0;
    }
    return XetoBinaryConst.#ctrlSpecRef;
  }

  static #ctrlList = undefined;

  static ctrlList() {
    if (XetoBinaryConst.#ctrlList === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlList === undefined) XetoBinaryConst.#ctrlList = 0;
    }
    return XetoBinaryConst.#ctrlList;
  }

  static #ctrlGrid = undefined;

  static ctrlGrid() {
    if (XetoBinaryConst.#ctrlGrid === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlGrid === undefined) XetoBinaryConst.#ctrlGrid = 0;
    }
    return XetoBinaryConst.#ctrlGrid;
  }

  static #ctrlSpan = undefined;

  static ctrlSpan() {
    if (XetoBinaryConst.#ctrlSpan === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlSpan === undefined) XetoBinaryConst.#ctrlSpan = 0;
    }
    return XetoBinaryConst.#ctrlSpan;
  }

  static #ctrlVersion = undefined;

  static ctrlVersion() {
    if (XetoBinaryConst.#ctrlVersion === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlVersion === undefined) XetoBinaryConst.#ctrlVersion = 0;
    }
    return XetoBinaryConst.#ctrlVersion;
  }

  static #ctrlCoord = undefined;

  static ctrlCoord() {
    if (XetoBinaryConst.#ctrlCoord === undefined) {
      XetoBinaryConst.static$init();
      if (XetoBinaryConst.#ctrlCoord === undefined) XetoBinaryConst.#ctrlCoord = 0;
    }
    return XetoBinaryConst.#ctrlCoord;
  }

  static static$init() {
    XetoBinaryConst.#magic = 2019701299;
    XetoBinaryConst.#magicOverlay = 2019716982;
    XetoBinaryConst.#magicEnd = 2019701299;
    XetoBinaryConst.#version = 2106120;
    XetoBinaryConst.#magicLib = 1818845819;
    XetoBinaryConst.#magicLibEnd = 2104256866;
    XetoBinaryConst.#magicLibVer = 1919248186;
    XetoBinaryConst.#specOwnOnly = 59;
    XetoBinaryConst.#specInherited = 43;
    XetoBinaryConst.#ctrlNull = 1;
    XetoBinaryConst.#ctrlMarker = 2;
    XetoBinaryConst.#ctrlNA = 3;
    XetoBinaryConst.#ctrlRemove = 4;
    XetoBinaryConst.#ctrlTrue = 5;
    XetoBinaryConst.#ctrlFalse = 6;
    XetoBinaryConst.#ctrlName = 7;
    XetoBinaryConst.#ctrlStr = 8;
    XetoBinaryConst.#ctrlNumberNoUnit = 9;
    XetoBinaryConst.#ctrlNumberUnit = 10;
    XetoBinaryConst.#ctrlInt2 = 11;
    XetoBinaryConst.#ctrlInt8 = 12;
    XetoBinaryConst.#ctrlFloat8 = 13;
    XetoBinaryConst.#ctrlDuration = 14;
    XetoBinaryConst.#ctrlRef = 15;
    XetoBinaryConst.#ctrlUri = 16;
    XetoBinaryConst.#ctrlDate = 17;
    XetoBinaryConst.#ctrlTime = 18;
    XetoBinaryConst.#ctrlDateTime = 19;
    XetoBinaryConst.#ctrlBuf = 20;
    XetoBinaryConst.#ctrlGenericScalar = 21;
    XetoBinaryConst.#ctrlTypedScalar = 22;
    XetoBinaryConst.#ctrlEmptyDict = 23;
    XetoBinaryConst.#ctrlNameDict = 24;
    XetoBinaryConst.#ctrlGenericDict = 25;
    XetoBinaryConst.#ctrlTypedDict = 26;
    XetoBinaryConst.#ctrlSpecRef = 27;
    XetoBinaryConst.#ctrlList = 28;
    XetoBinaryConst.#ctrlGrid = 29;
    XetoBinaryConst.#ctrlSpan = 30;
    XetoBinaryConst.#ctrlVersion = 31;
    XetoBinaryConst.#ctrlCoord = 32;
    return;
  }

}

class XetoBinaryReader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoBinaryReader.type$; }

  static magic() { return XetoBinaryConst.magic(); }

  static ctrlTypedDict() { return XetoBinaryConst.ctrlTypedDict(); }

  static ctrlNameDict() { return XetoBinaryConst.ctrlNameDict(); }

  static specInherited() { return XetoBinaryConst.specInherited(); }

  static ctrlTrue() { return XetoBinaryConst.ctrlTrue(); }

  static ctrlName() { return XetoBinaryConst.ctrlName(); }

  static ctrlNull() { return XetoBinaryConst.ctrlNull(); }

  static ctrlNumberUnit() { return XetoBinaryConst.ctrlNumberUnit(); }

  static ctrlDuration() { return XetoBinaryConst.ctrlDuration(); }

  static ctrlFalse() { return XetoBinaryConst.ctrlFalse(); }

  static ctrlNumberNoUnit() { return XetoBinaryConst.ctrlNumberNoUnit(); }

  static ctrlGenericScalar() { return XetoBinaryConst.ctrlGenericScalar(); }

  static ctrlInt2() { return XetoBinaryConst.ctrlInt2(); }

  static ctrlList() { return XetoBinaryConst.ctrlList(); }

  static version() { return XetoBinaryConst.version(); }

  static magicLibVer() { return XetoBinaryConst.magicLibVer(); }

  static ctrlRemove() { return XetoBinaryConst.ctrlRemove(); }

  static ctrlInt8() { return XetoBinaryConst.ctrlInt8(); }

  static ctrlVersion() { return XetoBinaryConst.ctrlVersion(); }

  static ctrlStr() { return XetoBinaryConst.ctrlStr(); }

  static ctrlDate() { return XetoBinaryConst.ctrlDate(); }

  static ctrlDateTime() { return XetoBinaryConst.ctrlDateTime(); }

  static magicEnd() { return XetoBinaryConst.magicEnd(); }

  static ctrlEmptyDict() { return XetoBinaryConst.ctrlEmptyDict(); }

  static ctrlMarker() { return XetoBinaryConst.ctrlMarker(); }

  static magicOverlay() { return XetoBinaryConst.magicOverlay(); }

  static magicLib() { return XetoBinaryConst.magicLib(); }

  static ctrlFloat8() { return XetoBinaryConst.ctrlFloat8(); }

  static ctrlTime() { return XetoBinaryConst.ctrlTime(); }

  static ctrlGenericDict() { return XetoBinaryConst.ctrlGenericDict(); }

  static ctrlGrid() { return XetoBinaryConst.ctrlGrid(); }

  static specOwnOnly() { return XetoBinaryConst.specOwnOnly(); }

  static ctrlTypedScalar() { return XetoBinaryConst.ctrlTypedScalar(); }

  static ctrlNA() { return XetoBinaryConst.ctrlNA(); }

  static ctrlRef() { return XetoBinaryConst.ctrlRef(); }

  static ctrlSpan() { return XetoBinaryConst.ctrlSpan(); }

  static ctrlSpecRef() { return XetoBinaryConst.ctrlSpecRef(); }

  static magicLibEnd() { return XetoBinaryConst.magicLibEnd(); }

  static ctrlUri() { return XetoBinaryConst.ctrlUri(); }

  static ctrlBuf() { return XetoBinaryConst.ctrlBuf(); }

  static ctrlCoord() { return XetoBinaryConst.ctrlCoord(); }

  #io = null;

  // private field reflection only
  __io(it) { if (it === undefined) return this.#io; else this.#io = it; }

  #names = null;

  // private field reflection only
  __names(it) { if (it === undefined) return this.#names; else this.#names = it; }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  static make(io,in$) {
    const $self = new XetoBinaryReader();
    XetoBinaryReader.make$($self,io,in$);
    return $self;
  }

  static make$($self,io,in$) {
    $self.#io = io;
    $self.#names = io.names();
    $self.#in = in$;
    return;
  }

  readBootBase(libLoader) {
    const this$ = this;
    this.verifyU4(XetoBinaryConst.magic(), "magic");
    this.verifyU4(XetoBinaryConst.version(), "version");
    let maxNameCode = this.readNameTable();
    let libVersions = this.readLibVersions();
    let numNonSysLibs = sys.Int.minus(this.readVarInt(), 1);
    let ns = RemoteNamespace.make(XetoBinaryIO.makeClientEnd(this.#io.names(), maxNameCode), null, this.#names, libVersions, libLoader, (ns) => {
      return this$.readLib(ns);
    });
    if (sys.ObjUtil.compareGT(numNonSysLibs, 0)) {
      sys.Int.times(numNonSysLibs, () => {
        let lib = this$.readLib(ns);
        ns.entry(lib.name()).setOk(lib);
        return;
      });
      ns.checkAllLoaded();
    }
    ;
    this.verifyU4(XetoBinaryConst.magicEnd(), "magicEnd");
    return ns;
  }

  readBootOverlay(base,libLoader) {
    const this$ = this;
    if (!base.isAllLoaded()) {
      throw sys.Err.make("Base must be fully loaded");
    }
    ;
    this.verifyU4(XetoBinaryConst.magicOverlay(), "magic");
    this.verifyU4(XetoBinaryConst.version(), "version");
    let libVersions = this.readLibVersions();
    let ns = RemoteNamespace.make(this.#io, base, this.#names, libVersions, libLoader, (ns) => {
      return sys.ObjUtil.coerce(base.sysLib(), XetoLib.type$);
    });
    return ns;
  }

  readNameTable() {
    let max = this.readVarInt();
    for (let i = sys.Int.plus(xeto.NameTable.initSize(), 1); sys.ObjUtil.compareLE(i, max); i = sys.Int.increment(i)) {
      this.#names.add(this.#in.readUtf());
    }
    ;
    return max;
  }

  readLibVersions() {
    const this$ = this;
    let num = this.readVarInt();
    let acc = sys.List.make(xeto.LibVersion.type$);
    acc.capacity(num);
    sys.Int.times(num, (it) => {
      acc.add(this$.readLibVersion());
      return;
    });
    return acc;
  }

  readLibVersion() {
    const this$ = this;
    this.verifyU4(XetoBinaryConst.magicLibVer(), "magic lib version");
    let name = this.#names.toName(this.readName());
    let version = sys.ObjUtil.coerce(this.readVal(), sys.Version.type$);
    let dependsSize = this.readVarInt();
    let depends = sys.List.make(xeto.LibDepend.type$);
    depends.capacity(dependsSize);
    sys.Int.times(dependsSize, (it) => {
      depends.add(MLibDepend.makeFields(this$.#names.toName(this$.readName())));
      return;
    });
    return RemoteLibVersion.make(name, version, depends);
  }

  readLib(ns) {
    let lib = XetoLib.make();
    this.verifyU4(XetoBinaryConst.magicLib(), "magicLib");
    let nameCode = this.readName();
    let meta = this.readMeta();
    let flags = this.readVarInt();
    let loader = RemoteLoader.make(ns, nameCode, sys.ObjUtil.coerce(meta, MNameDict.type$), flags);
    this.readTops(loader);
    this.readInstances(loader);
    this.verifyU4(XetoBinaryConst.magicLibEnd(), "magicLibEnd");
    return loader.loadLib();
  }

  readTops(loader) {
    while (true) {
      let nameCode = this.readName();
      if (sys.ObjUtil.compareLT(nameCode, 0)) {
        break;
      }
      ;
      let x = loader.addTop(nameCode);
      this.readSpec(loader, x);
    }
    ;
    return;
  }

  readSpec(loader,x) {
    x.flavor(xeto.SpecFlavor.vals().get(this.read()));
    x.baseIn(this.readSpecRef());
    x.typeIn(this.readSpecRef());
    x.metaOwnIn(sys.ObjUtil.coerce(this.readMeta(), MNameDict.type$).wrapped());
    x.metaInheritedIn(this.readInheritedMetaNames(loader, x));
    x.slotsOwnIn(this.readOwnSlots(loader, x));
    x.flags(this.readVarInt());
    if (sys.ObjUtil.equals(this.read(), XetoBinaryConst.specInherited())) {
      x.metaIn(sys.ObjUtil.coerce(this.readMeta(), MNameDict.type$).wrapped());
      x.slotsInheritedIn(this.readInheritedSlotRefs());
    }
    ;
    return;
  }

  readInheritedMetaNames(loader,x) {
    let acc = sys.List.make(sys.Str.type$);
    while (true) {
      let n = sys.ObjUtil.toStr(this.readVal());
      if (sys.Str.isEmpty(n)) {
        break;
      }
      ;
      acc.add(n);
    }
    ;
    return acc;
  }

  readOwnSlots(loader,parent) {
    const this$ = this;
    let size = this.readVarInt();
    if (sys.ObjUtil.equals(size, 0)) {
      return null;
    }
    ;
    let acc = sys.List.make(RSpec.type$);
    acc.capacity(size);
    sys.Int.times(size, (it) => {
      let name = this$.readName();
      let x = loader.makeSlot(parent, name);
      this$.readSpec(loader, x);
      acc.add(x);
      return;
    });
    return acc;
  }

  readInheritedSlotRefs() {
    let acc = sys.List.make(RSpecRef.type$);
    while (true) {
      let ref = this.readSpecRef();
      if (ref == null) {
        break;
      }
      ;
      acc.add(sys.ObjUtil.coerce(ref, RSpecRef.type$));
    }
    ;
    return acc;
  }

  readSpecRef() {
    const this$ = this;
    let depth = this.read();
    if (sys.ObjUtil.equals(depth, 0)) {
      return null;
    }
    ;
    let lib = this.readName();
    let type = this.readName();
    let slot = 0;
    let more = null;
    if (sys.ObjUtil.compareGT(depth, 1)) {
      (slot = this.readName());
      if (sys.ObjUtil.compareGT(depth, 2)) {
        let moreSize = sys.Int.minus(depth, 3);
        (more = sys.List.make(sys.Int.type$));
        more.capacity(moreSize);
        sys.Int.times(moreSize, (it) => {
          more.add(sys.ObjUtil.coerce(this$.readName(), sys.Obj.type$.toNullable()));
          return;
        });
      }
      ;
    }
    ;
    return RSpecRef.make(lib, type, slot, more);
  }

  readInstances(loader) {
    while (true) {
      let ctrl = this.read();
      if (sys.ObjUtil.equals(ctrl, 0)) {
        break;
      }
      ;
      let x = sys.ObjUtil.coerce(this.doReadVal(ctrl), haystack.Dict.type$);
      loader.addInstance(x);
    }
    ;
    return;
  }

  readDict() {
    let val = this.readVal();
    if (sys.ObjUtil.is(val, haystack.Dict.type$)) {
      return sys.ObjUtil.coerce(val, haystack.Dict.type$);
    }
    ;
    throw sys.IOErr.make(sys.Str.plus("Expecting dict, not ", sys.ObjUtil.typeof(val)));
  }

  readVal() {
    return this.doReadVal(this.#in.readU1());
  }

  doReadVal(ctrl) {
    let $_u54 = ctrl;
    if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlNull())) {
      return null;
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlMarker())) {
      return haystack.Marker.val();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlNA())) {
      return haystack.NA.val();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlRemove())) {
      return haystack.Remove.val();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlTrue())) {
      return sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlFalse())) {
      return sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlName())) {
      return this.#names.toName(this.readName());
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlStr())) {
      return this.readUtf();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlNumberNoUnit())) {
      return this.readNumberNoUnit();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlNumberUnit())) {
      return this.readNumberUnit();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlInt2())) {
      return sys.ObjUtil.coerce(this.#in.readS2(), sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlInt8())) {
      return sys.ObjUtil.coerce(this.#in.readS8(), sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlFloat8())) {
      return sys.ObjUtil.coerce(this.readF8(), sys.Obj.type$.toNullable());
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlDuration())) {
      return sys.Duration.make(this.#in.readS8());
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlUri())) {
      return this.readUri();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlRef())) {
      return this.readRef();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlDate())) {
      return this.readDate();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlTime())) {
      return this.readTime();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlDateTime())) {
      return this.readDateTime();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlBuf())) {
      return this.readBuf();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlGenericScalar())) {
      return this.readGenericScalar();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlTypedScalar())) {
      return this.readTypedScalar();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlEmptyDict())) {
      return haystack.Etc.dict0();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlNameDict())) {
      return this.readNameDict();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlGenericDict())) {
      return this.readGenericDict();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlTypedDict())) {
      return this.readTypedDict();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlSpecRef())) {
      return this.readSpecRef();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlList())) {
      return this.readList();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlGrid())) {
      return this.readGrid();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlSpan())) {
      return this.readSpan();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlVersion())) {
      return this.readVersion();
    }
    else if (sys.ObjUtil.equals($_u54, XetoBinaryConst.ctrlCoord())) {
      return this.readCoord();
    }
    else {
      throw sys.IOErr.make(sys.Str.plus("obj ctrl 0x", sys.Int.toHex(ctrl)));
    }
    ;
  }

  readNumberNoUnit() {
    return haystack.Number.make(this.readF8(), null);
  }

  readNumberUnit() {
    return haystack.Number.make(this.readF8(), haystack.Number.loadUnit(this.readUtf()));
  }

  readUri() {
    return sys.ObjUtil.coerce(sys.Uri.fromStr(this.readUtf()), sys.Uri.type$);
  }

  readRef() {
    return sys.ObjUtil.coerce(haystack.Ref.make(this.readUtf(), sys.Str.trimToNull(this.readUtf())), haystack.Ref.type$);
  }

  readDate() {
    return sys.ObjUtil.coerce(sys.Date.make(this.#in.readU2(), sys.Month.vals().get(sys.Int.minus(sys.ObjUtil.coerce(this.#in.read(), sys.Int.type$), 1)), sys.ObjUtil.coerce(this.#in.read(), sys.Int.type$)), sys.Date.type$);
  }

  readTime() {
    return sys.Time.fromDuration(sys.ObjUtil.coerce(sys.Duration.make(sys.Int.mult(this.#in.readU4(), 1000000)), sys.Duration.type$));
  }

  readDateTime() {
    let year = this.#in.readU2();
    let month = sys.Month.vals().get(sys.Int.minus(sys.ObjUtil.coerce(this.#in.read(), sys.Int.type$), 1));
    let day = this.#in.read();
    let hour = this.#in.read();
    let min = this.#in.read();
    let sec = this.#in.read();
    let nanos = sys.Int.mult(this.#in.readU2(), 1000000);
    let tz = sys.TimeZone.fromStr(sys.ObjUtil.coerce(this.readVal(), sys.Str.type$));
    let val = sys.DateTime.make(year, month, sys.ObjUtil.coerce(day, sys.Int.type$), sys.ObjUtil.coerce(hour, sys.Int.type$), sys.ObjUtil.coerce(min, sys.Int.type$), sys.ObjUtil.coerce(sec, sys.Int.type$), nanos, sys.ObjUtil.coerce(tz, sys.TimeZone.type$));
    return sys.ObjUtil.coerce(val, sys.DateTime.type$);
  }

  readBuf() {
    let size = this.readVarInt();
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(this.#in.readBufFully(null, size)), sys.Buf.type$);
  }

  readCoord() {
    return sys.ObjUtil.coerce(haystack.Coord.fromStr(this.readUtf()), haystack.Coord.type$);
  }

  readGenericScalar() {
    let qname = this.readUtf();
    let val = this.readUtf();
    return xeto.Scalar.make(qname, val);
  }

  readTypedScalar() {
    let qname = this.readUtf();
    let str = this.readUtf();
    let type = sys.Type.find(qname);
    let fromStr = this.toTypedScalarDecoder(sys.ObjUtil.coerce(type, sys.Type.type$));
    return sys.ObjUtil.coerce(fromStr.call(str), sys.Obj.type$);
  }

  toTypedScalarDecoder(type) {
    for (let x = type; x != null; (x = x.base())) {
      let fromStr = x.method("fromStr", false);
      if (fromStr != null) {
        return sys.ObjUtil.coerce(fromStr, sys.Method.type$);
      }
      ;
    }
    ;
    throw sys.Err.make(sys.Str.plus("Scalar type missing fromStr method: ", type.qname()));
  }

  readNameDict() {
    let size = this.readVarInt();
    return sys.ObjUtil.coerce(MNameDict.wrap(this.#names.readDict(size, this)), MNameDict.type$);
  }

  readGenericDict() {
    return this.readDictTags();
  }

  readTypedDict() {
    let qname = this.readUtf();
    let tags = this.readDictTags();
    let type = sys.Type.find(qname);
    return sys.ObjUtil.coerce(type.make(sys.List.make(haystack.Dict.type$, [tags])), haystack.Dict.type$);
  }

  readDictTags() {
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    while (true) {
      let name = sys.ObjUtil.toStr(this.readVal());
      if (sys.Str.isEmpty(name)) {
        break;
      }
      ;
      acc.set(name, sys.ObjUtil.coerce(this.readVal(), sys.Obj.type$));
    }
    ;
    return haystack.Etc.dictFromMap(acc);
  }

  readList() {
    const this$ = this;
    let size = this.readVarInt();
    let acc = sys.List.make(sys.Obj.type$.toNullable());
    acc.capacity(size);
    sys.Int.times(size, (i) => {
      acc.add(this$.readVal());
      return;
    });
    return acc;
  }

  readGrid() {
    let numCols = this.readVarInt();
    let numRows = this.readVarInt();
    let gb = haystack.GridBuilder.make();
    gb.capacity(numRows);
    gb.setMeta(this.readDict());
    for (let c = 0; sys.ObjUtil.compareLT(c, numCols); c = sys.Int.increment(c)) {
      gb.addCol(sys.ObjUtil.coerce(this.readVal(), sys.Str.type$), this.readDict());
    }
    ;
    for (let r = 0; sys.ObjUtil.compareLT(r, numRows); r = sys.Int.increment(r)) {
      let cells = sys.List.make(sys.Obj.type$.toNullable());
      cells.size(numCols);
      for (let c = 0; sys.ObjUtil.compareLT(c, numCols); c = sys.Int.increment(c)) {
        cells.set(c, this.readVal());
      }
      ;
      gb.addRow(cells);
    }
    ;
    return gb.toGrid();
  }

  readSpan() {
    return sys.ObjUtil.coerce(haystack.Span.fromStr(this.readUtf()), haystack.Span.type$);
  }

  readVersion() {
    let size = this.readVarInt();
    let segs = sys.List.make(sys.Int.type$);
    segs.capacity(size);
    for (let i = 0; sys.ObjUtil.compareLT(i, size); i = sys.Int.increment(i)) {
      segs.add(sys.ObjUtil.coerce(this.readVarInt(), sys.Obj.type$.toNullable()));
    }
    ;
    return sys.ObjUtil.coerce(sys.Version.make(segs), sys.Version.type$);
  }

  readName() {
    let code = this.readVarInt();
    if (sys.ObjUtil.compareNE(code, 0)) {
      return code;
    }
    ;
    (code = this.readVarInt());
    let name = this.readUtf();
    this.#names.set(code, name);
    return code;
  }

  read() {
    return this.#in.readU1();
  }

  readU4() {
    return this.#in.readU4();
  }

  readS8() {
    return this.#in.readS8();
  }

  readF8() {
    return this.#in.readF8();
  }

  readUtf() {
    return this.#in.readUtf();
  }

  readRawRefList() {
    const this$ = this;
    let size = this.readVarInt();
    let acc = sys.List.make(haystack.Ref.type$);
    acc.capacity(size);
    sys.Int.times(size, (it) => {
      acc.add(sys.ObjUtil.coerce(haystack.Ref.fromStr(this$.readUtf()), haystack.Ref.type$));
      return;
    });
    return acc;
  }

  readRawDictList() {
    const this$ = this;
    let size = this.readVarInt();
    let acc = sys.List.make(haystack.Dict.type$);
    acc.capacity(size);
    sys.Int.times(size, (it) => {
      acc.add(this$.readDict());
      return;
    });
    return acc;
  }

  readMeta() {
    this.verifyU1(XetoBinaryConst.ctrlNameDict(), "ctrlNameDict for meta");
    return this.readNameDict();
  }

  verifyU1(expect,msg) {
    let actual = this.#in.readU1();
    if (sys.ObjUtil.compareNE(actual, expect)) {
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid ", msg), ": 0x"), sys.Int.toHex(actual)), " != 0x"), sys.Int.toHex(expect)));
    }
    ;
    return;
  }

  verifyU4(expect,msg) {
    let actual = this.readU4();
    if (sys.ObjUtil.compareNE(actual, expect)) {
      throw sys.IOErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid ", msg), ": 0x"), sys.Int.toHex(actual)), " != 0x"), sys.Int.toHex(expect)));
    }
    ;
    return;
  }

  readVarInt() {
    let v = this.#in.readU1();
    if (sys.ObjUtil.equals(v, 255)) {
      return -1;
    }
    ;
    if (sys.ObjUtil.equals(sys.Int.and(v, 128), 0)) {
      return v;
    }
    ;
    if (sys.ObjUtil.equals(sys.Int.and(v, 192), 128)) {
      return sys.Int.or(sys.Int.shiftl(sys.Int.and(v, 63), 8), this.#in.readU1());
    }
    ;
    if (sys.ObjUtil.equals(sys.Int.and(v, 224), 192)) {
      return sys.Int.or(sys.Int.shiftl(sys.Int.or(sys.Int.shiftl(sys.Int.and(v, 31), 8), this.#in.readU1()), 16), this.#in.readU2());
    }
    ;
    return this.#in.readS8();
  }

}

class XetoBinaryIO extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoBinaryIO.type$; }

  #names = null;

  names() { return this.#names; }

  __names(it) { if (it === undefined) return this.#names; else this.#names = it; }

  #maxNameCode = 0;

  maxNameCode() { return this.#maxNameCode; }

  __maxNameCode(it) { if (it === undefined) return this.#maxNameCode; else this.#maxNameCode = it; }

  static makeServer(ns,maxNameCode) {
    const $self = new XetoBinaryIO();
    XetoBinaryIO.makeServer$($self,ns,maxNameCode);
    return $self;
  }

  static makeServer$($self,ns,maxNameCode) {
    if (maxNameCode === undefined) maxNameCode = ns.names().maxCode();
    $self.#names = ns.names();
    $self.#maxNameCode = maxNameCode;
    return;
  }

  static makeClientStart() {
    const $self = new XetoBinaryIO();
    XetoBinaryIO.makeClientStart$($self);
    return $self;
  }

  static makeClientStart$($self) {
    $self.#names = xeto.NameTable.make();
    $self.#maxNameCode = sys.Int.maxVal();
    return;
  }

  static makeClientEnd(names,maxNameCoce) {
    const $self = new XetoBinaryIO();
    XetoBinaryIO.makeClientEnd$($self,names,maxNameCoce);
    return $self;
  }

  static makeClientEnd$($self,names,maxNameCoce) {
    $self.#names = names;
    $self.#maxNameCode = maxNameCoce;
    return;
  }

  writer(out) {
    return XetoBinaryWriter.make(this, out);
  }

  reader(in$) {
    return XetoBinaryReader.make(this, in$);
  }

}

class XetoBinaryWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoBinaryWriter.type$; }

  static magic() { return XetoBinaryConst.magic(); }

  static ctrlTypedDict() { return XetoBinaryConst.ctrlTypedDict(); }

  static ctrlNameDict() { return XetoBinaryConst.ctrlNameDict(); }

  static specInherited() { return XetoBinaryConst.specInherited(); }

  static ctrlTrue() { return XetoBinaryConst.ctrlTrue(); }

  static ctrlName() { return XetoBinaryConst.ctrlName(); }

  static ctrlNull() { return XetoBinaryConst.ctrlNull(); }

  static ctrlNumberUnit() { return XetoBinaryConst.ctrlNumberUnit(); }

  static ctrlDuration() { return XetoBinaryConst.ctrlDuration(); }

  static ctrlFalse() { return XetoBinaryConst.ctrlFalse(); }

  static ctrlNumberNoUnit() { return XetoBinaryConst.ctrlNumberNoUnit(); }

  static ctrlGenericScalar() { return XetoBinaryConst.ctrlGenericScalar(); }

  static ctrlInt2() { return XetoBinaryConst.ctrlInt2(); }

  static ctrlList() { return XetoBinaryConst.ctrlList(); }

  static version() { return XetoBinaryConst.version(); }

  static magicLibVer() { return XetoBinaryConst.magicLibVer(); }

  static ctrlRemove() { return XetoBinaryConst.ctrlRemove(); }

  static ctrlInt8() { return XetoBinaryConst.ctrlInt8(); }

  static ctrlVersion() { return XetoBinaryConst.ctrlVersion(); }

  static ctrlStr() { return XetoBinaryConst.ctrlStr(); }

  static ctrlDate() { return XetoBinaryConst.ctrlDate(); }

  static ctrlDateTime() { return XetoBinaryConst.ctrlDateTime(); }

  static magicEnd() { return XetoBinaryConst.magicEnd(); }

  static ctrlEmptyDict() { return XetoBinaryConst.ctrlEmptyDict(); }

  static ctrlMarker() { return XetoBinaryConst.ctrlMarker(); }

  static magicOverlay() { return XetoBinaryConst.magicOverlay(); }

  static magicLib() { return XetoBinaryConst.magicLib(); }

  static ctrlFloat8() { return XetoBinaryConst.ctrlFloat8(); }

  static ctrlTime() { return XetoBinaryConst.ctrlTime(); }

  static ctrlGenericDict() { return XetoBinaryConst.ctrlGenericDict(); }

  static ctrlGrid() { return XetoBinaryConst.ctrlGrid(); }

  static specOwnOnly() { return XetoBinaryConst.specOwnOnly(); }

  static ctrlTypedScalar() { return XetoBinaryConst.ctrlTypedScalar(); }

  static ctrlNA() { return XetoBinaryConst.ctrlNA(); }

  static ctrlRef() { return XetoBinaryConst.ctrlRef(); }

  static ctrlSpan() { return XetoBinaryConst.ctrlSpan(); }

  static ctrlSpecRef() { return XetoBinaryConst.ctrlSpecRef(); }

  static magicLibEnd() { return XetoBinaryConst.magicLibEnd(); }

  static ctrlUri() { return XetoBinaryConst.ctrlUri(); }

  static ctrlBuf() { return XetoBinaryConst.ctrlBuf(); }

  static ctrlCoord() { return XetoBinaryConst.ctrlCoord(); }

  #names = null;

  // private field reflection only
  __names(it) { if (it === undefined) return this.#names; else this.#names = it; }

  #maxNameCode = 0;

  // private field reflection only
  __maxNameCode(it) { if (it === undefined) return this.#maxNameCode; else this.#maxNameCode = it; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  static make(io,out) {
    const $self = new XetoBinaryWriter();
    XetoBinaryWriter.make$($self,io,out);
    return $self;
  }

  static make$($self,io,out) {
    $self.#names = io.names();
    $self.#maxNameCode = io.maxNameCode();
    $self.#out = out;
    return;
  }

  writeBoot(ns,bootLibs) {
    if (bootLibs === undefined) bootLibs = null;
    this.writeI4(XetoBinaryConst.magic());
    this.writeI4(XetoBinaryConst.version());
    this.writeNameTable();
    this.writeLibVersions(ns.versions());
    this.writeBootLibs(ns, sys.ObjUtil.coerce(((this$) => { let $_u55 = bootLibs; if ($_u55 != null) return $_u55; return sys.List.make(sys.Str.type$); })(this), sys.Type.find("sys::Str[]")));
    this.#out.writeI4(XetoBinaryConst.magicEnd());
    return this;
  }

  writeBootOverlay(ns) {
    const this$ = this;
    if (!ns.isOverlay()) {
      throw sys.Err.make("not an overlay ns");
    }
    ;
    let base = ns.base();
    this.writeI4(XetoBinaryConst.magicOverlay());
    this.writeI4(XetoBinaryConst.version());
    this.writeLibVersions(ns.versions().findAll((x) => {
      return !base.hasLib(x.name());
    }));
    this.#out.writeI4(XetoBinaryConst.magicEnd());
    return;
  }

  writeNameTable() {
    let max = this.#maxNameCode;
    this.writeVarInt(max);
    for (let i = sys.Int.plus(xeto.NameTable.initSize(), 1); sys.ObjUtil.compareLE(i, max); i = sys.Int.increment(i)) {
      this.#out.writeUtf(this.#names.toName(i));
    }
    ;
    return;
  }

  writeLibVersions(vers) {
    const this$ = this;
    this.writeVarInt(vers.size());
    vers.each((ver) => {
      this$.writeLibVersion(ver);
      return;
    });
    return;
  }

  writeLibVersion(v) {
    const this$ = this;
    this.writeI4(XetoBinaryConst.magicLibVer());
    this.writeName(this.#names.toCode(v.name()));
    this.writeVersion(v.version());
    this.writeVarInt(v.depends().size());
    v.depends().each((d) => {
      this$.writeName(this$.#names.toCode(d.name()));
      return;
    });
    return;
  }

  writeBootLibs(ns,list) {
    const this$ = this;
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).addList(list);
    map.set("sys", "sys");
    this.writeVarInt(map.size());
    ns.versions().each((v) => {
      if (map.get(v.name()) != null) {
        this$.writeLib(sys.ObjUtil.coerce(ns.lib(v.name()), XetoLib.type$));
      }
      ;
      return;
    });
    return;
  }

  writeLib(lib) {
    this.writeI4(XetoBinaryConst.magicLib());
    this.writeName(lib.m().nameCode());
    this.writeNameDict(lib.m().meta().wrapped());
    this.writeVarInt(lib.m().flags());
    this.writeSpecs(lib);
    this.writeInstances(lib);
    this.writeI4(XetoBinaryConst.magicLibEnd());
    return;
  }

  writeSpecs(lib) {
    const this$ = this;
    lib.specs().each((x) => {
      this$.writeSpec(sys.ObjUtil.coerce(x, XetoSpec.type$));
      return;
    });
    this.writeVarInt(-1);
    return;
  }

  writeSpec(x) {
    let m = x.m();
    this.writeName(m.nameCode());
    this.write(m.flavor().ordinal());
    this.writeSpecRef(m.base());
    this.writeSpecRef(((this$) => { if (m.isType()) return null; return m.type(); })(this));
    this.writeNameDict(m.metaOwn().wrapped());
    this.writeInheritedMetaNames(x);
    this.writeOwnSlots(x);
    this.writeVarInt(m.flags());
    if ((!x.isCompound() && !x.isNone())) {
      this.write(XetoBinaryConst.specOwnOnly());
    }
    else {
      this.write(XetoBinaryConst.specInherited());
      this.writeNameDict(m.meta().wrapped());
      this.writeInheritedSlotRefs(x);
    }
    ;
    return;
  }

  writeInheritedMetaNames(x) {
    const this$ = this;
    let own = x.metaOwn();
    x.meta().each((v,n) => {
      if (own.missing(n)) {
        this$.writeStr(n);
      }
      ;
      return;
    });
    this.writeStr("");
    return;
  }

  writeOwnSlots(x) {
    let map = x.m().slotsOwn().map();
    let size = map.size();
    this.writeVarInt(size);
    for (let i = 0; sys.ObjUtil.compareLT(i, size); i = sys.Int.increment(i)) {
      this.writeSpec(sys.ObjUtil.coerce(map.valAt(i), XetoSpec.type$));
    }
    ;
    return;
  }

  writeInheritedSlotRefs(x) {
    const this$ = this;
    x.slots().each((slot) => {
      if (x.slotOwn(slot.name(), false) != null) {
        return;
      }
      ;
      this$.writeSpecRef(sys.ObjUtil.coerce(slot, XetoSpec.type$.toNullable()));
      return;
    });
    this.writeSpecRef(null);
    return;
  }

  writeSpecRef(spec) {
    const this$ = this;
    if (spec == null) {
      this.write(0);
      return;
    }
    ;
    if (spec.parent() == null) {
      this.write(1);
      this.writeName(spec.m().lib().m().nameCode());
      this.writeName(spec.m().nameCode());
    }
    else {
      if (spec.parent().parent() == null) {
        this.write(2);
        this.writeName(spec.m().lib().m().nameCode());
        this.writeName(spec.m().parent().m().nameCode());
        this.writeName(spec.m().nameCode());
      }
      else {
        let path = sys.List.make(sys.Str.type$);
        for (let x = spec; x != null; (x = x.parent())) {
          path.add(x.name());
        }
        ;
        path.reverse();
        this.write(sys.Int.plus(path.size(), 1));
        this.writeName(spec.m().lib().m().nameCode());
        path.each((n) => {
          this$.writeName(this$.#names.toCode(n));
          return;
        });
      }
      ;
    }
    ;
    return;
  }

  writeInstances(lib) {
    const this$ = this;
    lib.m().instancesMap().each((x) => {
      this$.writeDict(x);
      return;
    });
    this.write(0);
    return;
  }

  writeVal(val) {
    if (val == null) {
      return this.writeNull();
    }
    ;
    if (val === haystack.Marker.val()) {
      return this.writeMarker();
    }
    ;
    if (val === haystack.NA.val()) {
      return this.writeNA();
    }
    ;
    if (val === haystack.Remove.val()) {
      return this.writeRemove();
    }
    ;
    let type = sys.ObjUtil.typeof(val);
    if (type === sys.Str.type$) {
      return this.writeStr(sys.ObjUtil.coerce(val, sys.Str.type$));
    }
    ;
    if (type === haystack.Number.type$) {
      return this.writeNumber(sys.ObjUtil.coerce(val, haystack.Number.type$));
    }
    ;
    if (type === haystack.Ref.type$) {
      return this.writeRef(sys.ObjUtil.coerce(val, haystack.Ref.type$));
    }
    ;
    if (type === sys.DateTime.type$) {
      return this.writeDateTime(sys.ObjUtil.coerce(val, sys.DateTime.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Buf.type$)) {
      return this.writeBuf(sys.ObjUtil.coerce(val, sys.Buf.type$));
    }
    ;
    if (sys.ObjUtil.is(val, xeto.Dict.type$)) {
      return this.writeDict(sys.ObjUtil.coerce(val, xeto.Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return this.writeList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")));
    }
    ;
    if (type === sys.Bool.type$) {
      return this.writeBool(sys.ObjUtil.coerce(val, sys.Bool.type$));
    }
    ;
    if (type === sys.Date.type$) {
      return this.writeDate(sys.ObjUtil.coerce(val, sys.Date.type$));
    }
    ;
    if (type === sys.Time.type$) {
      return this.writeTime(sys.ObjUtil.coerce(val, sys.Time.type$));
    }
    ;
    if (type === sys.Uri.type$) {
      return this.writeUri(sys.ObjUtil.coerce(val, sys.Uri.type$));
    }
    ;
    if (type === haystack.Coord.type$) {
      return this.writeCoord(sys.ObjUtil.coerce(val, haystack.Coord.type$));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return this.writeGrid(sys.ObjUtil.coerce(val, haystack.Grid.type$));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Span.type$)) {
      return this.writeSpan(sys.ObjUtil.coerce(val, haystack.Span.type$));
    }
    ;
    if (type === xeto.Scalar.type$) {
      return this.writeGenericScalar(sys.ObjUtil.coerce(val, xeto.Scalar.type$));
    }
    ;
    if (type === sys.Int.type$) {
      return this.writeInt(sys.ObjUtil.coerce(val, sys.Int.type$));
    }
    ;
    if (type === sys.Float.type$) {
      return this.writeFloat(sys.ObjUtil.coerce(val, sys.Float.type$));
    }
    ;
    if (type === sys.Duration.type$) {
      return this.writeDuration(sys.ObjUtil.coerce(val, sys.Duration.type$));
    }
    ;
    if (type === sys.Version.type$) {
      return this.writeVersion(sys.ObjUtil.coerce(val, sys.Version.type$));
    }
    ;
    this.writeTypedScalar(sys.ObjUtil.coerce(val, sys.Obj.type$));
    return;
  }

  writeNull() {
    this.write(XetoBinaryConst.ctrlNull());
    return;
  }

  writeMarker() {
    this.write(XetoBinaryConst.ctrlMarker());
    return;
  }

  writeNA() {
    this.write(XetoBinaryConst.ctrlNA());
    return;
  }

  writeRemove() {
    this.write(XetoBinaryConst.ctrlRemove());
    return;
  }

  writeBool(val) {
    this.write(((this$) => { if (val) return XetoBinaryConst.ctrlTrue(); return XetoBinaryConst.ctrlFalse(); })(this));
    return;
  }

  writeStr(s) {
    let nameCode = this.#names.toCode(s);
    if ((sys.ObjUtil.compareGT(nameCode, 0) && sys.ObjUtil.compareLE(nameCode, this.#maxNameCode))) {
      this.write(XetoBinaryConst.ctrlName());
      this.writeVarInt(nameCode);
    }
    else {
      this.write(XetoBinaryConst.ctrlStr());
      this.writeUtf(s);
    }
    ;
    return;
  }

  writeNumber(val) {
    let unit = ((this$) => { let $_u58 = val.unit(); if ($_u58 == null) return null; return val.unit().symbol(); })(this);
    if (unit == null) {
      this.write(XetoBinaryConst.ctrlNumberNoUnit());
      this.writeF8(val.toFloat());
    }
    else {
      this.write(XetoBinaryConst.ctrlNumberUnit());
      this.writeF8(val.toFloat());
      this.writeUtf(sys.ObjUtil.coerce(unit, sys.Str.type$));
    }
    ;
    return this;
  }

  writeInt(val) {
    if ((sys.ObjUtil.compareLE(-32767, val) && sys.ObjUtil.compareLE(val, 32767))) {
      this.write(XetoBinaryConst.ctrlInt2());
      this.writeI2(val);
    }
    else {
      this.write(XetoBinaryConst.ctrlInt8());
      this.writeI8(val);
    }
    ;
    return;
  }

  writeFloat(val) {
    this.write(XetoBinaryConst.ctrlFloat8());
    this.writeF8(val);
    return;
  }

  writeDuration(val) {
    this.write(XetoBinaryConst.ctrlDuration());
    this.writeI8(val.ticks());
    return;
  }

  writeUri(uri) {
    this.write(XetoBinaryConst.ctrlUri());
    this.writeUtf(uri.toStr());
    return;
  }

  writeRef(ref) {
    this.write(XetoBinaryConst.ctrlRef());
    this.writeUtf(ref.id());
    this.writeUtf(sys.ObjUtil.coerce(((this$) => { let $_u59 = ref.disVal(); if ($_u59 != null) return $_u59; return ""; })(this), sys.Str.type$));
    return;
  }

  writeDate(val) {
    this.write(XetoBinaryConst.ctrlDate());
    this.#out.writeI2(val.year()).write(sys.Int.plus(val.month().ordinal(), 1)).write(val.day());
    return this;
  }

  writeTime(val) {
    this.write(XetoBinaryConst.ctrlTime());
    this.writeI4(sys.Int.div(val.toDuration().ticks(), 1000000));
    return this;
  }

  writeDateTime(val) {
    this.write(XetoBinaryConst.ctrlDateTime());
    this.#out.writeI2(val.year()).write(sys.Int.plus(val.month().ordinal(), 1)).write(val.day());
    this.#out.write(val.hour()).write(val.min()).write(val.sec()).writeI2(sys.Int.div(val.nanoSec(), 1000000));
    this.writeStr(val.tz().name());
    return this;
  }

  writeBuf(buf) {
    this.write(XetoBinaryConst.ctrlBuf());
    this.writeVarInt(buf.size());
    this.#out.writeBuf(buf.seek(0));
    return this;
  }

  writeSpan(span) {
    this.#out.write(XetoBinaryConst.ctrlSpan());
    this.#out.writeUtf(span.toStr());
    return this;
  }

  writeVersion(val) {
    this.write(XetoBinaryConst.ctrlVersion());
    let segs = val.segments();
    this.writeVarInt(segs.size());
    for (let i = 0; sys.ObjUtil.compareLT(i, segs.size()); i = sys.Int.increment(i)) {
      this.writeVarInt(segs.get(i));
    }
    ;
    return this;
  }

  writeCoord(val) {
    this.write(XetoBinaryConst.ctrlCoord());
    this.writeUtf(val.toStr());
    return this;
  }

  writeGenericScalar(val) {
    this.#out.write(XetoBinaryConst.ctrlGenericScalar());
    this.#out.writeUtf(val.qname());
    this.#out.writeUtf(val.val());
    return this;
  }

  writeTypedScalar(val) {
    this.#out.write(XetoBinaryConst.ctrlTypedScalar());
    this.#out.writeUtf(sys.ObjUtil.typeof(val).qname());
    this.#out.writeUtf(sys.ObjUtil.toStr(val));
    return this;
  }

  writeDict(d) {
    if (d.isEmpty()) {
      return this.write(XetoBinaryConst.ctrlEmptyDict());
    }
    ;
    if (sys.ObjUtil.is(d, xeto.NameDict.type$)) {
      return this.writeNameDict(sys.ObjUtil.coerce(d, xeto.NameDict.type$));
    }
    ;
    if (sys.ObjUtil.is(d, MNameDict.type$)) {
      return this.writeNameDict(sys.ObjUtil.coerce(d, MNameDict.type$).wrapped());
    }
    ;
    if (sys.ObjUtil.is(d, XetoSpec.type$)) {
      return this.writeSpecRefVal(sys.ObjUtil.coerce(d, XetoSpec.type$));
    }
    ;
    if (this.isGenericDict(d)) {
      return this.writeGenericDict(d);
    }
    ;
    return this.writeTypedDict(d);
  }

  isGenericDict(d) {
    let podName = sys.ObjUtil.typeof(d).pod().name();
    if (sys.ObjUtil.equals(podName, "haystack")) {
      return true;
    }
    ;
    return false;
  }

  writeSpecRefVal(spec) {
    this.write(XetoBinaryConst.ctrlSpecRef());
    this.writeSpecRef(spec);
    return;
  }

  writeNameDict(dict) {
    this.write(XetoBinaryConst.ctrlNameDict());
    let size = dict.size();
    this.writeVarInt(size);
    for (let i = 0; sys.ObjUtil.compareLT(i, size); i = sys.Int.increment(i)) {
      this.writeName(dict.nameAt(i));
      this.writeVal(dict.valAt(i));
    }
    ;
    return;
  }

  writeGenericDict(dict) {
    this.write(XetoBinaryConst.ctrlGenericDict());
    this.writeDictTags(dict);
    return;
  }

  writeTypedDict(dict) {
    this.write(XetoBinaryConst.ctrlTypedDict());
    this.#out.writeUtf(sys.ObjUtil.typeof(dict).qname());
    this.writeDictTags(dict);
    return;
  }

  writeDictTags(dict) {
    const this$ = this;
    dict.each((v,n) => {
      this$.writeStr(n);
      this$.writeVal(v);
      return;
    });
    this.writeStr("");
    return;
  }

  writeList(list) {
    const this$ = this;
    this.write(XetoBinaryConst.ctrlList());
    this.writeVarInt(list.size());
    list.each((x) => {
      this$.writeVal(x);
      return;
    });
    return;
  }

  writeGrid(grid) {
    const this$ = this;
    this.write(XetoBinaryConst.ctrlGrid());
    let cols = grid.cols();
    this.writeVarInt(cols.size());
    this.writeVarInt(grid.size());
    this.writeDict(grid.meta());
    cols.each((col) => {
      this$.writeStr(col.name());
      this$.writeDict(col.meta());
      return;
    });
    grid.each((row) => {
      cols.each((c) => {
        this$.writeVal(row.val(c));
        return;
      });
      return;
    });
    return;
  }

  writeName(nameCode) {
    if (sys.ObjUtil.compareLE(nameCode, this.#maxNameCode)) {
      this.writeVarInt(nameCode);
    }
    else {
      this.#out.write(0);
      this.writeVarInt(nameCode);
      this.#out.writeUtf(this.#names.toName(nameCode));
    }
    ;
    return;
  }

  write(byte) {
    this.#out.write(byte);
    return;
  }

  writeI2(i) {
    this.#out.writeI2(i);
    return;
  }

  writeI4(i) {
    this.#out.writeI4(i);
    return;
  }

  writeI8(i) {
    this.#out.writeI8(i);
    return;
  }

  writeF8(f) {
    this.#out.writeF8(f);
    return;
  }

  writeUtf(s) {
    this.#out.writeUtf(s);
    return;
  }

  writeRawRefList(ids) {
    const this$ = this;
    this.writeVarInt(ids.size());
    ids.each((id) => {
      this$.writeUtf(id.id());
      return;
    });
    return;
  }

  writeRawDictList(dicts) {
    const this$ = this;
    this.writeVarInt(dicts.size());
    dicts.each((d) => {
      this$.writeDict(d);
      return;
    });
    return;
  }

  writeVarInt(val) {
    if (sys.ObjUtil.compareLT(val, 0)) {
      return this.#out.write(255);
    }
    ;
    if (sys.ObjUtil.compareLE(val, 127)) {
      return this.#out.write(val);
    }
    ;
    if (sys.ObjUtil.compareLE(val, 16383)) {
      return this.#out.writeI2(sys.Int.or(val, 32768));
    }
    ;
    if (sys.ObjUtil.compareLE(val, 536870911)) {
      return this.#out.writeI4(sys.Int.or(val, 3221225472));
    }
    ;
    return this.#out.write(224).writeI8(val);
  }

}

class MInterfaces extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#cache = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return MInterfaces.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #cache = null;

  // private field reflection only
  __cache(it) { if (it === undefined) return this.#cache; else this.#cache = it; }

  static make(ns) {
    const $self = new MInterfaces();
    MInterfaces.make$($self,ns);
    return $self;
  }

  static make$($self,ns) {
    ;
    $self.#ns = ns;
    return;
  }

  method(spec,name) {
    if (!spec.isInterface()) {
      return null;
    }
    ;
    let slot = spec.slot(name, false);
    if ((slot == null && !sys.Str.startsWith(name, "axonMake"))) {
      return null;
    }
    ;
    return spec.fantomType().method(name);
  }

  methodOn(target,name) {
    let type = sys.ObjUtil.typeof(target);
    let im = sys.ObjUtil.as(this.#cache.get(InterfaceMethod.make(type, name, null)), InterfaceMethod.type$);
    if (im == null) {
      let method = this.resolveMethod(type, name);
      (im = InterfaceMethod.make(type, name, method));
      this.#cache.set(sys.ObjUtil.coerce(im, sys.Obj.type$), sys.ObjUtil.coerce(im, sys.Obj.type$));
    }
    ;
    return im.method();
  }

  resolveMethod(type,name) {
    let spec = this.#ns.specOf(type, false);
    if (spec == null) {
      return null;
    }
    ;
    return this.method(sys.ObjUtil.coerce(spec, xeto.Spec.type$), name);
  }

}

class InterfaceMethod extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InterfaceMethod.type$; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #method = null;

  method() { return this.#method; }

  __method(it) { if (it === undefined) return this.#method; else this.#method = it; }

  static make(type,name,method) {
    const $self = new InterfaceMethod();
    InterfaceMethod.make$($self,type,name,method);
    return $self;
  }

  static make$($self,type,name,method) {
    $self.#type = type;
    $self.#name = name;
    $self.#method = method;
    return;
  }

  hash() {
    return sys.Int.xor(sys.Str.hash(this.#type.qname()), sys.Str.hash(this.#name));
  }

  equals(that) {
    let x = sys.ObjUtil.coerce(that, InterfaceMethod.type$);
    return (this.#type === x.#type && sys.ObjUtil.equals(this.#name, x.#name));
  }

}

class MNamespace extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#libsRef = concurrent.AtomicRef.make();
    this.#interfaces = MInterfaces.make(this);
    return;
  }

  typeof() { return MNamespace.type$; }

  #names = null;

  names() { return this.#names; }

  __names(it) { if (it === undefined) return this.#names; else this.#names = it; }

  #base = null;

  base() { return this.#base; }

  __base(it) { if (it === undefined) return this.#base; else this.#base = it; }

  #sysLib = null;

  sysLib() { return this.#sysLib; }

  __sysLib(it) { if (it === undefined) return this.#sysLib; else this.#sysLib = it; }

  #sys = null;

  sys() { return this.#sys; }

  __sys(it) { if (it === undefined) return this.#sys; else this.#sys = it; }

  #entriesList = null;

  entriesList() { return this.#entriesList; }

  __entriesList(it) { if (it === undefined) return this.#entriesList; else this.#entriesList = it; }

  #entriesMap = null;

  // private field reflection only
  __entriesMap(it) { if (it === undefined) return this.#entriesMap; else this.#entriesMap = it; }

  #libsRef = null;

  // private field reflection only
  __libsRef(it) { if (it === undefined) return this.#libsRef; else this.#libsRef = it; }

  #interfaces = null;

  // private field reflection only
  __interfaces(it) { if (it === undefined) return this.#interfaces; else this.#interfaces = it; }

  #digest$Store = undefined;

  // private field reflection only
  __digest$Store(it) { if (it === undefined) return this.#digest$Store; else this.#digest$Store = it; }

  static make(base,names,versions,loadSys) {
    const $self = new MNamespace();
    MNamespace.make$($self,base,names,versions,loadSys);
    return $self;
  }

  static make$($self,base,names,versions,loadSys) {
    const this$ = $self;
    ;
    $self.#base = base;
    if (base != null) {
      if (base.#names !== names) {
        throw sys.Err.make("base.names != names");
      }
      ;
      let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::LibVersion"));
      base.versions().each((v) => {
        acc.set(v.name(), v);
        return;
      });
      versions.each((v) => {
        if (acc.get(v.name()) != null) {
          throw sys.Err.make(sys.Str.plus("Base already defines ", v));
        }
        ;
        acc.set(v.name(), v);
        return;
      });
      (versions = acc.vals());
      base.loadAllSync();
    }
    ;
    (versions = xeto.LibVersion.orderByDepends(versions));
    let list = sys.List.make(MLibEntry.type$);
    list.capacity(versions.size());
    let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::MLibEntry"));
    versions.each((x) => {
      let entry = ((this$) => { let $_u60 = ((this$) => { let $_u61 = ((this$) => { let $_u62=base; return ($_u62==null) ? null : $_u62.#entriesMap; })(this$); if ($_u61 == null) return null; return ((this$) => { let $_u63=base; return ($_u63==null) ? null : $_u63.#entriesMap; })(this$).get(x.name()); })(this$); if ($_u60 != null) return $_u60; return MLibEntry.make(x); })(this$);
      list.add(sys.ObjUtil.coerce(entry, MLibEntry.type$));
      map.add(x.name(), sys.ObjUtil.coerce(entry, MLibEntry.type$));
      return;
    });
    $self.#names = names;
    $self.#entriesList = sys.ObjUtil.coerce(((this$) => { let $_u64 = list; if ($_u64 == null) return null; return sys.ObjUtil.toImmutable(list); })($self), sys.Type.find("xetoEnv::MLibEntry[]"));
    $self.#entriesMap = sys.ObjUtil.coerce(((this$) => { let $_u65 = map; if ($_u65 == null) return null; return sys.ObjUtil.toImmutable(map); })($self), sys.Type.find("[sys::Str:xetoEnv::MLibEntry]"));
    if (loadSys == null) {
      $self.#sysLib = sys.ObjUtil.coerce($self.lib("sys"), xeto.Lib.type$);
    }
    else {
      $self.#sysLib = sys.Func.call(loadSys, $self);
      $self.entry("sys").setOk(sys.ObjUtil.coerce($self.#sysLib, XetoLib.type$));
    }
    ;
    $self.checkAllLoaded();
    $self.#sys = sys.ObjUtil.coerce(((this$) => { let $_u66 = ((this$) => { let $_u67=base; return ($_u67==null) ? null : $_u67.#sys; })(this$); if ($_u66 != null) return $_u66; return MSys.make(sys.ObjUtil.coerce(this$.#sysLib, XetoLib.type$)); })($self), MSys.type$);
    return;
  }

  isOverlay() {
    return this.#base != null;
  }

  digest() {
    if (this.#digest$Store === undefined) {
      this.#digest$Store = this.digest$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#digest$Store, sys.Str.type$);
  }

  versions() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.#entriesList.map((x) => {
      return x.version();
    }, xeto.LibVersion.type$), sys.Type.find("xeto::LibVersion[]"));
  }

  version(name,checked) {
    if (checked === undefined) checked = true;
    return ((this$) => { let $_u68=this$.entry(name, checked); return ($_u68==null) ? null : $_u68.version(); })(this);
  }

  hasLib(name) {
    return this.entry(name, false) != null;
  }

  libStatus(name,checked) {
    if (checked === undefined) checked = true;
    return ((this$) => { let $_u69 = this$.entry(name, checked); if ($_u69 == null) return null; return this$.entry(name, checked).status(); })(this);
  }

  libErr(name) {
    return this.entry(name).err();
  }

  isAllLoaded() {
    return this.#libsRef.val() != null;
  }

  lib(name,checked) {
    if (checked === undefined) checked = true;
    let e = this.entry(name, false);
    if (e == null) {
      if (checked) {
        throw haystack.UnknownLibErr.make(name);
      }
      ;
      return null;
    }
    ;
    if (e.status().isNotLoaded()) {
      this.loadSyncWithDepends(sys.ObjUtil.coerce(e, MLibEntry.type$));
    }
    ;
    if (e.status().isOk()) {
      return e.get();
    }
    ;
    throw sys.ObjUtil.coerce(((this$) => { let $_u70 = e.err(); if ($_u70 != null) return $_u70; return sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), " ["), e.status()), "]")); })(this), sys.Err.type$);
  }

  libs() {
    let libs = sys.ObjUtil.as(this.#libsRef.val(), sys.Type.find("xeto::Lib[]"));
    if (libs != null) {
      return sys.ObjUtil.coerce(libs, sys.Type.find("xeto::Lib[]"));
    }
    ;
    this.loadAllSync();
    return sys.ObjUtil.coerce(this.#libsRef.val(), sys.Type.find("xeto::Lib[]"));
  }

  libsAllAsync(f) {
    let libs = sys.ObjUtil.as(this.#libsRef.val(), sys.Type.find("xeto::Lib[]"));
    if (libs != null) {
      sys.Func.call(f, null, libs);
      return;
    }
    ;
    this.loadAllAsync(f);
    return;
  }

  libAsync(name,f) {
    const this$ = this;
    let e = this.entry(name, false);
    if (e == null) {
      sys.Func.call(f, haystack.UnknownLibErr.make(name), null);
      return;
    }
    ;
    if (e.status().isOk()) {
      sys.Func.call(f, null, e.get());
      return;
    }
    ;
    if (e.status().isErr()) {
      sys.Func.call(f, e.err(), null);
      return;
    }
    ;
    let toLoadWithDepends = this.flattenUnloadedDepends(sys.List.make(MLibEntry.type$.toNullable(), [e]));
    this.loadListAsync(toLoadWithDepends, (err) => {
      if (err != null) {
        return sys.Func.call(f, err, null);
      }
      ;
      if (e.status().isErr()) {
        sys.Func.call(f, e.err(), null);
      }
      else {
        sys.Func.call(f, null, e.get());
      }
      ;
      return;
    });
    return;
  }

  libListAsync(names,f) {
    const this$ = this;
    let loaded = sys.List.make(xeto.Lib.type$);
    let toLoad = sys.List.make(MLibEntry.type$);
    for (let i = 0; sys.ObjUtil.compareLT(i, names.size()); i = sys.Int.increment(i)) {
      let name = names.get(i);
      let e = this.entry(name, false);
      if (e == null) {
        sys.Func.call(f, haystack.UnknownLibErr.make(name), null);
        return;
      }
      ;
      if (e.status().isNotLoaded()) {
        toLoad.add(sys.ObjUtil.coerce(e, MLibEntry.type$));
      }
      else {
        if (e.status().isOk()) {
          loaded.add(e.get());
        }
        ;
      }
      ;
    }
    ;
    if (toLoad.isEmpty()) {
      return sys.Func.call(f, null, loaded);
    }
    ;
    let toLoadWithDepends = this.flattenUnloadedDepends(toLoad);
    this.loadListAsync(toLoadWithDepends, (err) => {
      if (err != null) {
        return sys.Func.call(f, err, null);
      }
      ;
      let result = sys.List.make(xeto.Lib.type$);
      names.each((name) => {
        let e = this$.entry(name, false);
        if ((e != null && e.status().isOk())) {
          result.add(e.get());
        }
        ;
        return;
      });
      sys.Func.call(f, null, result);
      return;
    });
    return;
  }

  entry(name,checked) {
    if (checked === undefined) checked = true;
    let entry = sys.ObjUtil.as(this.#entriesMap.get(name), MLibEntry.type$);
    if (entry != null) {
      return entry;
    }
    ;
    if (checked) {
      throw haystack.UnknownLibErr.make(name);
    }
    ;
    return null;
  }

  flattenUnloadedDepends(entries) {
    const this$ = this;
    let toLoad = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::MLibEntry"));
    entries.each((entry) => {
      this$.doFlattenUnloadedDepends(toLoad, entry);
      return;
    });
    return this.#entriesList.findAll((e) => {
      return toLoad.containsKey(e.name());
    });
  }

  doFlattenUnloadedDepends(acc,e) {
    const this$ = this;
    if (e.status().isNotLoaded()) {
      acc.set(e.name(), e);
    }
    ;
    e.version().depends().each((depend) => {
      this$.doFlattenUnloadedDepends(acc, sys.ObjUtil.coerce(this$.entry(depend.name()), MLibEntry.type$));
      return;
    });
    return;
  }

  loadAllSync() {
    const this$ = this;
    if (this.isAllLoaded()) {
      return;
    }
    ;
    this.#entriesList.each((entry) => {
      this$.loadSync(entry);
      return;
    });
    this.checkAllLoaded();
    return;
  }

  loadSyncWithDepends(entry) {
    const this$ = this;
    entry.version().depends().each((depend) => {
      if (entry.status().isNotLoaded()) {
        this$.loadSync(sys.ObjUtil.coerce(this$.entry(depend.name()), MLibEntry.type$));
      }
      ;
      return;
    });
    this.loadSync(entry);
    this.checkAllLoaded();
    return;
  }

  loadSync(entry) {
    try {
      let lib = this.doLoadSync(entry.version());
      entry.setOk(lib);
    }
    catch ($_u71) {
      $_u71 = sys.Err.make($_u71);
      if ($_u71 instanceof sys.Err) {
        let e = $_u71;
        ;
        entry.setErr(e);
      }
      else {
        throw $_u71;
      }
    }
    ;
    return;
  }

  checkAllLoaded() {
    const this$ = this;
    let allLoaded = this.#entriesList.all((e) => {
      return e.status().isLoaded();
    });
    if (!allLoaded) {
      return;
    }
    ;
    let acc = sys.List.make(xeto.Lib.type$);
    acc.capacity(this.#entriesList.size());
    this.#entriesList.each((e) => {
      if (e.status().isOk()) {
        acc.add(e.get());
      }
      ;
      return;
    });
    this.#libsRef.val(sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("xeto::Lib[]")));
    return;
  }

  loadAllAsync(f) {
    const this$ = this;
    if (this.isAllLoaded()) {
      sys.Func.call(f, null, this.libs());
      return;
    }
    ;
    let toLoad = this.#entriesList.findAll((e) => {
      return e.status().isNotLoaded();
    });
    this.loadListAsync(toLoad, (err) => {
      if (err != null) {
        sys.Func.call(f, err, null);
      }
      else {
        sys.Func.call(f, null, sys.ObjUtil.coerce(this$.#libsRef.val(), sys.Type.find("xeto::Lib[]?")));
      }
      ;
      return;
    });
    return;
  }

  loadListAsync(toLoad,f) {
    this.doLoadListAsync(toLoad, 0, f);
    return;
  }

  doLoadListAsync(toLoad,index,f) {
    const this$ = this;
    this.doLoadAsync(toLoad.get(index).version(), (err,libOrErr) => {
      if (err != null) {
        sys.Func.call(f, err);
        return;
      }
      ;
      let e = toLoad.get(index);
      let lib = sys.ObjUtil.as(libOrErr, XetoLib.type$);
      if (lib != null) {
        e.setOk(sys.ObjUtil.coerce(lib, XetoLib.type$));
      }
      else {
        e.setErr(sys.ObjUtil.coerce(libOrErr, sys.Err.type$));
      }
      ;
      ((this$) => { let $_u72 = index;index = sys.Int.increment(index); return $_u72; })(this$);
      if (sys.ObjUtil.compareLT(index, toLoad.size())) {
        return this$.doLoadListAsync(toLoad, index, f);
      }
      ;
      this$.checkAllLoaded();
      try {
        sys.Func.call(f, null);
      }
      catch ($_u73) {
        $_u73 = sys.Err.make($_u73);
        if ($_u73 instanceof sys.Err) {
          let e2 = $_u73;
          ;
          e2.trace();
        }
        else {
          throw $_u73;
        }
      }
      ;
      return;
    });
    return;
  }

  type(qname,checked) {
    if (checked === undefined) checked = true;
    let colon = ((this$) => { let $_u74 = sys.Str.index(qname, "::"); if ($_u74 != null) return $_u74; throw sys.ArgErr.make(sys.Str.plus("Invalid qname: ", qname)); })(this);
    let libName = sys.Str.getRange(qname, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true));
    let typeName = sys.Str.getRange(qname, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 2), -1));
    let type = ((this$) => { let $_u75 = this$.lib(libName, false); if ($_u75 == null) return null; return this$.lib(libName, false).type(typeName, false); })(this);
    if (type != null) {
      return sys.ObjUtil.coerce(type, XetoSpec.type$.toNullable());
    }
    ;
    if (checked) {
      throw haystack.UnknownSpecErr.make(sys.Str.plus("Unknown data type: ", qname));
    }
    ;
    return null;
  }

  spec(qname,checked) {
    if (checked === undefined) checked = true;
    let colon = ((this$) => { let $_u76 = sys.Str.index(qname, "::"); if ($_u76 != null) return $_u76; throw sys.ArgErr.make(sys.Str.plus("Invalid qname: ", qname)); })(this);
    let libName = sys.Str.getRange(qname, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true));
    let names = sys.Str.split(sys.Str.getRange(qname, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 2), -1)), sys.ObjUtil.coerce(46, sys.Int.type$.toNullable()), false);
    let spec = ((this$) => { let $_u77 = this$.lib(libName, false); if ($_u77 == null) return null; return this$.lib(libName, false).spec(sys.ObjUtil.coerce(names.first(), sys.Str.type$), false); })(this);
    for (let i = 1; (spec != null && sys.ObjUtil.compareLT(i, names.size())); i = sys.Int.increment(i)) {
      (spec = spec.slot(names.get(i), false));
    }
    ;
    if (spec != null) {
      return sys.ObjUtil.coerce(spec, XetoSpec.type$.toNullable());
    }
    ;
    if (checked) {
      throw haystack.UnknownSpecErr.make(qname);
    }
    ;
    return null;
  }

  instance(qname,checked) {
    if (checked === undefined) checked = true;
    let colon = ((this$) => { let $_u78 = sys.Str.index(qname, "::"); if ($_u78 != null) return $_u78; throw sys.ArgErr.make(sys.Str.plus("Invalid qname: ", qname)); })(this);
    let libName = sys.Str.getRange(qname, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true));
    let name = sys.Str.getRange(qname, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 2), -1));
    let instance = ((this$) => { let $_u79 = this$.lib(libName, false); if ($_u79 == null) return null; return this$.lib(libName, false).instance(name, false); })(this);
    if (instance != null) {
      return instance;
    }
    ;
    if (checked) {
      throw haystack.UnknownRecErr.make(qname);
    }
    ;
    return null;
  }

  unqualifiedType(name,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let acc = sys.List.make(xeto.Spec.type$);
    this.libs().each((lib) => {
      acc.addNotNull(lib.type(name, false));
      return;
    });
    if (sys.ObjUtil.equals(acc.size(), 1)) {
      return acc.get(0);
    }
    ;
    if (sys.ObjUtil.compareGT(acc.size(), 1)) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Ambiguous types for '", name), "' "), acc));
    }
    ;
    if (checked) {
      throw sys.UnknownTypeErr.make(name);
    }
    ;
    return null;
  }

  global(name,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let match = this.#entriesList.eachWhile((entry) => {
      return ((this$) => { if (entry.status().isOk()) return entry.get().global(name, false); return null; })(this$);
    });
    if (match != null) {
      return sys.ObjUtil.coerce(match, xeto.Spec.type$.toNullable());
    }
    ;
    if (checked) {
      throw haystack.UnknownSpecErr.make(name);
    }
    ;
    return null;
  }

  xmeta(qname,checked) {
    if (checked === undefined) checked = true;
    return XMeta.make(this).xmeta(qname, checked);
  }

  xmetaEnum(qname,checked) {
    if (checked === undefined) checked = true;
    return XMeta.make(this).xmetaEnum(qname, checked);
  }

  eachType(f) {
    const this$ = this;
    this.eachLibForIter((lib) => {
      lib.types().each((type) => {
        sys.Func.call(f, type);
        return;
      });
      return;
    });
    return;
  }

  eachInstance(f) {
    const this$ = this;
    this.eachLibForIter((lib) => {
      lib.eachInstance(f);
      return;
    });
    return;
  }

  eachInstanceThatIs(type,f) {
    const this$ = this;
    this.eachInstance((x) => {
      let xSpecRef = sys.ObjUtil.as(x.get("spec"), xeto.Ref.type$);
      if (xSpecRef == null) {
        return;
      }
      ;
      let xSpec = this$.spec(xSpecRef.id(), false);
      if (xSpec == null) {
        return;
      }
      ;
      if (xSpec.isa(type)) {
        sys.Func.call(f, x, sys.ObjUtil.coerce(xSpec, xeto.Spec.type$));
      }
      ;
      return;
    });
    return;
  }

  eachLibForIter(f) {
    const this$ = this;
    if (!this.isRemote()) {
      this.libs().each(f);
    }
    else {
      this.#entriesList.each((entry) => {
        if (entry.status().isOk()) {
          sys.Func.call(f, entry.get());
        }
        ;
        return;
      });
    }
    ;
    return;
  }

  specOf(val,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    if (val == null) {
      return this.#sys.none();
    }
    ;
    let dict = sys.ObjUtil.as(val, xeto.Dict.type$);
    if (dict != null) {
      let specRef = sys.ObjUtil.as(dict.get("spec"), xeto.Ref.type$);
      if (specRef == null) {
        return this.#sys.dict();
      }
      ;
      return this.spec(specRef.id(), checked);
    }
    ;
    let type = ((this$) => { let $_u81 = sys.ObjUtil.as(val, sys.Type.type$); if ($_u81 != null) return $_u81; return sys.ObjUtil.typeof(val); })(this);
    let bindings = SpecBindings.cur();
    for (let p = type; p.base() != null; (p = p.base())) {
      let spec = bindings.forTypeToSpec(this, sys.ObjUtil.coerce(p, sys.Type.type$));
      if (spec != null) {
        return spec;
      }
      ;
      (spec = sys.ObjUtil.coerce(p.mixins().eachWhile((m) => {
        return bindings.forTypeToSpec(this$, m);
      }), xeto.Spec.type$.toNullable()));
      if (spec != null) {
        return spec;
      }
      ;
    }
    ;
    if (sys.ObjUtil.is(val, xeto.Scalar.type$)) {
      return this.spec(sys.ObjUtil.coerce(val, xeto.Scalar.type$).qname(), checked);
    }
    ;
    if (type.fits(sys.Type.find("sys::List"))) {
      return this.#sys.list();
    }
    ;
    if (type.fits(haystack.Grid.type$)) {
      return this.#sys.grid();
    }
    ;
    if (type.fits(xeto.Function.type$)) {
      return this.#sys.func();
    }
    ;
    if ((!this.isAllLoaded() && !this.isRemote())) {
      this.loadAllSync();
      if (this.isAllLoaded()) {
        return this.specOf(val, checked);
      }
      ;
    }
    ;
    if (checked) {
      throw haystack.UnknownSpecErr.make(sys.Str.plus(sys.Str.plus("No spec mapped for '", type), "'"));
    }
    ;
    return null;
  }

  fits(cx,val,spec,opts) {
    if (opts === undefined) opts = null;
    if (opts == null) {
      (opts = haystack.Etc.dict0());
    }
    ;
    let explain = XetoUtil.optLog(opts, "explain");
    if (explain == null) {
      return Fitter.make(this, cx, sys.ObjUtil.coerce(opts, haystack.Dict.type$)).valFits(val, spec);
    }
    else {
      return ExplainFitter.make(this, cx, sys.ObjUtil.coerce(opts, haystack.Dict.type$), sys.ObjUtil.coerce(explain, sys.Type.find("|xeto::XetoLogRec->sys::Void|"))).valFits(val, spec);
    }
    ;
  }

  specFits(a,b,opts) {
    if (opts === undefined) opts = null;
    if (opts == null) {
      (opts = haystack.Etc.dict0());
    }
    ;
    let explain = XetoUtil.optLog(opts, "explain");
    let cx = xeto.NilXetoContext.val();
    if (explain == null) {
      return Fitter.make(this, cx, sys.ObjUtil.coerce(opts, haystack.Dict.type$)).specFits(a, b);
    }
    else {
      return ExplainFitter.make(this, cx, sys.ObjUtil.coerce(opts, haystack.Dict.type$), sys.ObjUtil.coerce(explain, sys.Type.find("|xeto::XetoLogRec->sys::Void|"))).specFits(a, b);
    }
    ;
  }

  queryWhile(cx,subject,query,opts,f) {
    return Query.make(this, cx, sys.ObjUtil.coerce(opts, xeto.Dict.type$)).query(subject, query).eachWhile(f);
  }

  instantiate(spec,opts) {
    if (opts === undefined) opts = null;
    return XetoUtil.instantiate(this, sys.ObjUtil.coerce(spec, XetoSpec.type$), sys.ObjUtil.coerce(((this$) => { let $_u82 = opts; if ($_u82 != null) return $_u82; return haystack.Etc.dict0(); })(this), xeto.Dict.type$));
  }

  choice(spec) {
    return MChoice.make(this, sys.ObjUtil.coerce(spec, XetoSpec.type$));
  }

  interfaceMethod(spec,methodName) {
    return this.#interfaces.method(spec, methodName);
  }

  interfaceMethodOn(target,methodName) {
    return this.#interfaces.methodOn(target, methodName);
  }

  compileDicts(src,opts) {
    if (opts === undefined) opts = null;
    const this$ = this;
    let val = this.compileData(src, opts);
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).map((x) => {
        return sys.ObjUtil.coerce(((this$) => { let $_u83 = sys.ObjUtil.as(x, xeto.Dict.type$); if ($_u83 != null) return $_u83; throw sys.IOErr.make(sys.Str.plus("Expecting Xeto list of dicts, not ", ((this$) => { let $_u84 = x; if ($_u84 == null) return null; return sys.ObjUtil.typeof(x); })(this$))); })(this$), xeto.Dict.type$);
      }, xeto.Dict.type$), sys.Type.find("xeto::Dict[]"));
    }
    ;
    if (sys.ObjUtil.is(val, xeto.Dict.type$)) {
      return sys.List.make(xeto.Dict.type$, [sys.ObjUtil.coerce(val, xeto.Dict.type$)]);
    }
    ;
    throw sys.IOErr.make(sys.Str.plus("Expecting Xeto dict data, not ", ((this$) => { let $_u85 = val; if ($_u85 == null) return null; return sys.ObjUtil.typeof(val); })(this)));
  }

  writeData(out,val,opts) {
    if (opts === undefined) opts = null;
    Printer.make(this, out, sys.ObjUtil.coerce(((this$) => { let $_u86 = opts; if ($_u86 != null) return $_u86; return haystack.Etc.dict0(); })(this), xeto.Dict.type$)).xetoTop(val);
    return;
  }

  print(val,out,opts) {
    if (out === undefined) out = sys.Env.cur().out();
    if (opts === undefined) opts = null;
    Printer.make(this, out, sys.ObjUtil.coerce(((this$) => { let $_u87 = opts; if ($_u87 != null) return $_u87; return haystack.Etc.dict0(); })(this), xeto.Dict.type$)).print(val);
    return;
  }

  eachSubtype(ctype,f) {
    const this$ = this;
    let type = sys.ObjUtil.coerce(ctype, xeto.Spec.type$);
    this.eachType((x) => {
      if (x.isa(type)) {
        sys.Func.call(f, sys.ObjUtil.coerce(x, XetoSpec.type$));
      }
      ;
      return;
    });
    return;
  }

  dump(out) {
    if (out === undefined) out = sys.Env.cur().out();
    const this$ = this;
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("--- ", sys.ObjUtil.typeof(this)), " ["), sys.ObjUtil.coerce(this.versions().size(), sys.Obj.type$.toNullable())), " libs, allLoaded="), sys.ObjUtil.coerce(this.isAllLoaded(), sys.Obj.type$.toNullable())), "] ---"));
    this.versions().each((v) => {
      out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", v), " ["), this$.libStatus(v.name())), "]"));
      return;
    });
    return;
  }

  digest$Once() {
    const this$ = this;
    let buf = sys.Buf.make();
    let keys = this.versions().dup().sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    keys.each((v) => {
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(buf.print(v.name()), sys.Buf.type$.toNullable()).print(" "), sys.Buf.type$.toNullable()).print(v.version().toStr()), sys.Buf.type$.toNullable()).print("\n");
      return;
    });
    return buf.toDigest("SHA-1").toBase64Uri();
  }

}

class MLibEntry extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#statusRef = concurrent.AtomicRef.make(xeto.LibStatus.notLoaded());
    this.#loadRef = concurrent.AtomicRef.make();
    return;
  }

  typeof() { return MLibEntry.type$; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #statusRef = null;

  // private field reflection only
  __statusRef(it) { if (it === undefined) return this.#statusRef; else this.#statusRef = it; }

  #loadRef = null;

  // private field reflection only
  __loadRef(it) { if (it === undefined) return this.#loadRef; else this.#loadRef = it; }

  static make(version) {
    const $self = new MLibEntry();
    MLibEntry.make$($self,version);
    return $self;
  }

  static make$($self,version) {
    ;
    $self.#version = version;
    return;
  }

  name() {
    return this.#version.name();
  }

  compare(that) {
    return sys.ObjUtil.compare(this.name(), sys.ObjUtil.coerce(that, MLibEntry.type$).name());
  }

  status() {
    return sys.ObjUtil.coerce(this.#statusRef.val(), xeto.LibStatus.type$);
  }

  err() {
    return sys.ObjUtil.as(this.#loadRef.val(), sys.Err.type$);
  }

  get() {
    return sys.ObjUtil.coerce(((this$) => { let $_u88 = sys.ObjUtil.as(this$.#loadRef.val(), XetoLib.type$); if ($_u88 != null) return $_u88; throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Not loaded: ", this$.name()), " ["), this$.status()), "]")); })(this), XetoLib.type$);
  }

  setOk(lib) {
    this.#loadRef.compareAndSet(null, lib);
    this.#statusRef.val(xeto.LibStatus.ok());
    return;
  }

  setErr(err) {
    this.#loadRef.compareAndSet(null, err);
    this.#statusRef.val(xeto.LibStatus.err());
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("MLibEntry ", this.name()), " ["), this.status()), "] "), this.err());
  }

}

class RemoteNamespace extends MNamespace {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RemoteNamespace.type$; }

  #io = null;

  io() { return this.#io; }

  __io(it) { if (it === undefined) return this.#io; else this.#io = it; }

  #libLoader = null;

  libLoader() { return this.#libLoader; }

  __libLoader(it) { if (it === undefined) return this.#libLoader; else this.#libLoader = it; }

  static boot(in$,base,libLoader) {
    if (base == null) {
      return XetoBinaryIO.makeClientStart().reader(in$).readBootBase(libLoader);
    }
    else {
      return XetoBinaryIO.makeServer(sys.ObjUtil.coerce(base, MNamespace.type$)).reader(in$).readBootOverlay(sys.ObjUtil.coerce(base, MNamespace.type$), libLoader);
    }
    ;
  }

  static make(io,base,names,versions,libLoader,loadSys) {
    const $self = new RemoteNamespace();
    RemoteNamespace.make$($self,io,base,names,versions,libLoader,loadSys);
    return $self;
  }

  static make$($self,io,base,names,versions,libLoader,loadSys) {
    MNamespace.make$($self, base, names, versions, sys.ObjUtil.coerce(loadSys, sys.Type.find("|xetoEnv::MNamespace->xetoEnv::XetoLib|?")));
    $self.#io = io;
    $self.#libLoader = libLoader;
    return;
  }

  isRemote() {
    return true;
  }

  compileLib(src,opts) {
    if (opts === undefined) opts = null;
    throw sys.UnsupportedErr.make();
  }

  compileData(src,opts) {
    if (opts === undefined) opts = null;
    throw sys.UnsupportedErr.make();
  }

  doLoadSync(v) {
    throw sys.UnsupportedErr.make(sys.Str.plus(sys.Str.plus("Must use libAsync [", v), "]"));
  }

  doLoadAsync(v,f) {
    if (this.#libLoader == null) {
      throw sys.UnsupportedErr.make("No RemoteLibLoader installed");
    }
    ;
    this.#libLoader.loadLib(v.name(), f);
    return;
  }

}

class RemoteLibLoader {
  constructor() {
    const this$ = this;
  }

  typeof() { return RemoteLibLoader.type$; }

}

class RemoteLibVersion extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RemoteLibVersion.type$; }

  compare() { return xeto.LibVersion.prototype.compare.apply(this, arguments); }

  asDepend() { return xeto.LibVersion.prototype.asDepend.apply(this, arguments); }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #version = null;

  version() { return this.#version; }

  __version(it) { if (it === undefined) return this.#version; else this.#version = it; }

  #depends = null;

  depends() { return this.#depends; }

  __depends(it) { if (it === undefined) return this.#depends; else this.#depends = it; }

  static make(name,version,depends) {
    const $self = new RemoteLibVersion();
    RemoteLibVersion.make$($self,name,version,depends);
    return $self;
  }

  static make$($self,name,version,depends) {
    $self.#name = name;
    $self.#version = version;
    $self.#depends = sys.ObjUtil.coerce(((this$) => { let $_u89 = depends; if ($_u89 == null) return null; return sys.ObjUtil.toImmutable(depends); })($self), sys.Type.find("xeto::LibDepend[]"));
    return;
  }

  doc() {
    return "";
  }

  file(checked) {
    if (checked === undefined) checked = true;
    if (checked) {
      throw sys.UnsupportedErr.make();
    }
    ;
    return null;
  }

  isSrc() {
    return false;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), "-"), this.#version);
  }

}

class RSpec extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#flavor = xeto.SpecFlavor.slot();
    this.#args = MSpecArgs.nil();
    return;
  }

  typeof() { return RSpec.type$; }

  isCompound() { return CSpec.prototype.isCompound.apply(this, arguments); }

  #libName = null;

  libName() { return this.#libName; }

  __libName(it) { if (it === undefined) return this.#libName; else this.#libName = it; }

  #asm = null;

  asm() { return this.#asm; }

  __asm(it) { if (it === undefined) return this.#asm; else this.#asm = it; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #nameCode = 0;

  nameCode() { return this.#nameCode; }

  __nameCode(it) { if (it === undefined) return this.#nameCode; else this.#nameCode = it; }

  #parent = null;

  parent() {
    return this.#parent;
  }

  #flavor = null;

  flavor(it) {
    if (it === undefined) {
      return this.#flavor;
    }
    else {
      this.#flavor = it;
      return;
    }
  }

  #baseIn = null;

  baseIn(it) {
    if (it === undefined) {
      return this.#baseIn;
    }
    else {
      this.#baseIn = it;
      return;
    }
  }

  #typeIn = null;

  typeIn(it) {
    if (it === undefined) {
      return this.#typeIn;
    }
    else {
      this.#typeIn = it;
      return;
    }
  }

  #metaOwnIn = null;

  metaOwnIn(it) {
    if (it === undefined) {
      return this.#metaOwnIn;
    }
    else {
      this.#metaOwnIn = it;
      return;
    }
  }

  #metaIn = null;

  metaIn(it) {
    if (it === undefined) {
      return this.#metaIn;
    }
    else {
      this.#metaIn = it;
      return;
    }
  }

  #metaInheritedIn = null;

  metaInheritedIn(it) {
    if (it === undefined) {
      return this.#metaInheritedIn;
    }
    else {
      this.#metaInheritedIn = it;
      return;
    }
  }

  #slotsOwnIn = null;

  slotsOwnIn(it) {
    if (it === undefined) {
      return this.#slotsOwnIn;
    }
    else {
      this.#slotsOwnIn = it;
      return;
    }
  }

  #slotsInheritedIn = null;

  slotsInheritedIn(it) {
    if (it === undefined) {
      return this.#slotsInheritedIn;
    }
    else {
      this.#slotsInheritedIn = it;
      return;
    }
  }

  #isLoaded = false;

  isLoaded(it) {
    if (it === undefined) {
      return this.#isLoaded;
    }
    else {
      this.#isLoaded = it;
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

  #base = null;

  base(it) {
    if (it === undefined) {
      return this.#base;
    }
    else {
      this.#base = it;
      return;
    }
  }

  #metaOwn = null;

  metaOwn(it) {
    if (it === undefined) {
      return this.#metaOwn;
    }
    else {
      this.#metaOwn = it;
      return;
    }
  }

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

  #slotsOwn = null;

  slotsOwn(it) {
    if (it === undefined) {
      return this.#slotsOwn;
    }
    else {
      this.#slotsOwn = it;
      return;
    }
  }

  #slots = null;

  slots(it) {
    if (it === undefined) {
      return this.#slots;
    }
    else {
      this.#slots = it;
      return;
    }
  }

  #bindingRef = null;

  bindingRef(it) {
    if (it === undefined) {
      return this.#bindingRef;
    }
    else {
      this.#bindingRef = it;
      return;
    }
  }

  #cof = null;

  cof(it) {
    if (it === undefined) {
      return this.#cof;
    }
    else {
      this.#cof = it;
      return;
    }
  }

  #cofs = null;

  cofs(it) {
    if (it === undefined) {
      return this.#cofs;
    }
    else {
      this.#cofs = it;
      return;
    }
  }

  #args = null;

  args(it) {
    if (it === undefined) {
      return this.#args;
    }
    else {
      this.#args = it;
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

  #readIndex = 0;

  // private field reflection only
  __readIndex(it) { if (it === undefined) return this.#readIndex; else this.#readIndex = it; }

  static make(libName,parent,nameCode,name) {
    const $self = new RSpec();
    RSpec.make$($self,libName,parent,nameCode,name);
    return $self;
  }

  static make$($self,libName,parent,nameCode,name) {
    ;
    $self.#libName = libName;
    $self.#asm = XetoSpec.make();
    $self.#parent = parent;
    $self.#name = name;
    $self.#nameCode = nameCode;
    return;
  }

  hasSlots() {
    return !this.#slots.isEmpty();
  }

  isAst() {
    return true;
  }

  qname() {
    if (this.#parent != null) {
      return sys.Str.plus(sys.Str.plus(this.#parent.qname(), "."), this.#name);
    }
    ;
    return sys.Str.plus(sys.Str.plus(this.#libName, "::"), this.#name);
  }

  id() {
    throw sys.UnsupportedErr.make();
  }

  binding() {
    return sys.ObjUtil.coerce(((this$) => { let $_u90 = this$.#bindingRef; if ($_u90 != null) return $_u90; throw sys.Err.make("Binding not assigned"); })(this), xeto.SpecBinding.type$);
  }

  ctype() {
    return sys.ObjUtil.coerce(this.#type, CSpec.type$);
  }

  cbase() {
    return this.#base;
  }

  cparent() {
    return this.#parent;
  }

  cmeta() {
    return sys.ObjUtil.coerce(((this$) => { let $_u91 = this$.#meta; if ($_u91 != null) return $_u91; throw sys.Err.make(this$.#name); })(this), MNameDict.type$);
  }

  cmetaHas(name) {
    return this.cmeta().has(name);
  }

  cslot(name,checked) {
    if (checked === undefined) checked = true;
    throw sys.UnsupportedErr.make();
  }

  cslots(f) {
    const this$ = this;
    this.#slots.each((s) => {
      sys.Func.call(f, sys.ObjUtil.coerce(s, CSpec.type$), s.name());
      return;
    });
    return;
  }

  cslotsWhile(f) {
    const this$ = this;
    return this.#slots.eachWhile((s) => {
      return sys.Func.call(f, sys.ObjUtil.coerce(s, CSpec.type$), s.name());
    });
  }

  cenum(key,checked) {
    if (checked === undefined) checked = true;
    throw sys.UnsupportedErr.make();
  }

  cisa(x) {
    return XetoUtil.isa(this, x);
  }

  toStr() {
    return this.#name;
  }

  isSys() {
    return sys.ObjUtil.equals(this.#libName, "sys");
  }

  isScalar() {
    return this.hasFlag(MSpecFlags.scalar());
  }

  isMarker() {
    return this.hasFlag(MSpecFlags.marker());
  }

  isRef() {
    return this.hasFlag(MSpecFlags.ref());
  }

  isMultiRef() {
    return this.hasFlag(MSpecFlags.multiRef());
  }

  isChoice() {
    return this.hasFlag(MSpecFlags.choice());
  }

  isDict() {
    return this.hasFlag(MSpecFlags.dict());
  }

  isList() {
    return this.hasFlag(MSpecFlags.list());
  }

  isMaybe() {
    return this.hasFlag(MSpecFlags.maybe());
  }

  isQuery() {
    return this.hasFlag(MSpecFlags.query());
  }

  isFunc() {
    return this.hasFlag(MSpecFlags.func());
  }

  isInterface() {
    return this.hasFlag(MSpecFlags.interface());
  }

  isComp() {
    return this.hasFlag(MSpecFlags.comp());
  }

  isNone() {
    return this.hasFlag(MSpecFlags.none());
  }

  isSelf() {
    return this.hasFlag(MSpecFlags.self());
  }

  isEnum() {
    return this.hasFlag(MSpecFlags.enum());
  }

  isAnd() {
    return this.hasFlag(MSpecFlags.and());
  }

  isOr() {
    return this.hasFlag(MSpecFlags.or());
  }

  hasFlag(mask) {
    return sys.ObjUtil.compareNE(sys.Int.and(this.flags(), mask), 0);
  }

  readName() {
    return this.#slotsOwnIn.get(this.#readIndex).#nameCode;
  }

  readVal() {
    return this.#slotsOwnIn.get(((this$) => { let $_u92 = this$.#readIndex;this$.#readIndex = sys.Int.increment(this$.#readIndex); return $_u92; })(this)).#asm;
  }

}

class RSpecRef extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RSpecRef.type$; }

  #lib = 0;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #type = 0;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  #slot = 0;

  slot() { return this.#slot; }

  __slot(it) { if (it === undefined) return this.#slot; else this.#slot = it; }

  #more = null;

  more() { return this.#more; }

  __more(it) { if (it === undefined) return this.#more; else this.#more = it; }

  static make(lib,type,slot,more) {
    const $self = new RSpecRef();
    RSpecRef.make$($self,lib,type,slot,more);
    return $self;
  }

  static make$($self,lib,type,slot,more) {
    $self.#lib = lib;
    $self.#type = type;
    $self.#slot = slot;
    $self.#more = sys.ObjUtil.coerce(((this$) => { let $_u93 = more; if ($_u93 == null) return null; return sys.ObjUtil.toImmutable(more); })($self), sys.Type.find("sys::Int[]?"));
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(this.#lib, sys.Obj.type$.toNullable())), " "), sys.ObjUtil.coerce(this.#type, sys.Obj.type$.toNullable())), " "), sys.ObjUtil.coerce(this.#slot, sys.Obj.type$.toNullable())), " "), this.#more);
  }

}

class RemoteLoader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#loc = util.FileLoc.make("remote");
    this.#lib = XetoLib.make();
    this.#tops = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::RSpec"));
    this.#instances = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("haystack::Dict"));
    this.#bindings = SpecBindings.cur();
    return;
  }

  typeof() { return RemoteLoader.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #names = null;

  names() { return this.#names; }

  __names(it) { if (it === undefined) return this.#names; else this.#names = it; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #libName = null;

  libName() { return this.#libName; }

  __libName(it) { if (it === undefined) return this.#libName; else this.#libName = it; }

  #libNameCode = 0;

  libNameCode() { return this.#libNameCode; }

  __libNameCode(it) { if (it === undefined) return this.#libNameCode; else this.#libNameCode = it; }

  #libMeta = null;

  libMeta() { return this.#libMeta; }

  __libMeta(it) { if (it === undefined) return this.#libMeta; else this.#libMeta = it; }

  #libVersion = null;

  libVersion() { return this.#libVersion; }

  __libVersion(it) { if (it === undefined) return this.#libVersion; else this.#libVersion = it; }

  #flags = 0;

  flags() { return this.#flags; }

  __flags(it) { if (it === undefined) return this.#flags; else this.#flags = it; }

  #tops = null;

  // private field reflection only
  __tops(it) { if (it === undefined) return this.#tops; else this.#tops = it; }

  #instances = null;

  // private field reflection only
  __instances(it) { if (it === undefined) return this.#instances; else this.#instances = it; }

  #bindings = null;

  // private field reflection only
  __bindings(it) { if (it === undefined) return this.#bindings; else this.#bindings = it; }

  #bindingLoader = null;

  // private field reflection only
  __bindingLoader(it) { if (it === undefined) return this.#bindingLoader; else this.#bindingLoader = it; }

  static make(ns,libNameCode,libMeta,flags) {
    const $self = new RemoteLoader();
    RemoteLoader.make$($self,ns,libNameCode,libMeta,flags);
    return $self;
  }

  static make$($self,ns,libNameCode,libMeta,flags) {
    ;
    $self.#ns = ns;
    $self.#names = ns.names();
    $self.#libName = $self.#names.toName(libNameCode);
    $self.#libNameCode = libNameCode;
    $self.#libMeta = libMeta;
    $self.#libVersion = sys.ObjUtil.coerce(libMeta.trap("version", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Version.type$);
    $self.#flags = flags;
    return;
  }

  loadLib() {
    this.loadBindings();
    let depends = ((this$) => { let $_u94 = this$.#libMeta.get("depends"); if ($_u94 != null) return $_u94; return MLibDepend.type$.emptyList(); })(this);
    let tops = this.loadTops();
    let m = MLib.make(this.#loc, this.#libNameCode, this.#libName, this.#libMeta, this.#flags, this.#libVersion, sys.ObjUtil.coerce(depends, sys.Type.find("xetoEnv::MLibDepend[]")), tops, this.#instances, UnsupportedLibFiles.val());
    sys.ObjUtil.trap(XetoLib.type$.slot("m"),"setConst", sys.List.make(sys.Obj.type$.toNullable(), [this.#lib, m]));
    return this.#lib;
  }

  addTop(nameCode) {
    let name = this.#names.toName(nameCode);
    let x = RSpec.make(this.#libName, null, nameCode, name);
    this.#tops.add(name, x);
    return x;
  }

  makeSlot(parent,nameCode) {
    let name = this.#names.toName(nameCode);
    let x = RSpec.make(this.#libName, parent, nameCode, name);
    return x;
  }

  addInstance(x) {
    let id = x.id().id();
    let name = sys.Str.getRange(id, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(sys.Str.index(id, ":"), sys.Int.type$), 2), -1));
    this.#instances.add(name, x);
    return;
  }

  loadBindings() {
    if (this.#bindings.needsLoad(this.#libName, this.#libVersion)) {
      this.#bindingLoader = this.#bindings.load(this.#libName, this.#libVersion);
    }
    ;
    return;
  }

  assignBinding(x) {
    let b = this.#bindings.forSpec(x.qname());
    if (b != null) {
      return sys.ObjUtil.coerce(b, xeto.SpecBinding.type$);
    }
    ;
    if (this.#bindingLoader != null) {
      (b = this.#bindingLoader.loadSpec(this.#bindings, x));
      if (b != null) {
        return sys.ObjUtil.coerce(b, xeto.SpecBinding.type$);
      }
      ;
    }
    ;
    let isScalar = sys.ObjUtil.compareNE(sys.Int.and(MSpecFlags.scalar(), x.flags()), 0);
    return ((this$) => { if (isScalar) return GenericScalarBinding.make(x.qname()); return this$.#bindings.dict(); })(this);
  }

  loadTops() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.#tops.map((x) => {
      return this$.loadSpec(x).asm();
    }, XetoSpec.type$), sys.Type.find("[sys::Str:xetoEnv::XetoSpec]"));
  }

  loadSpec(x) {
    if (x.isLoaded()) {
      return x;
    }
    ;
    x.isLoaded(true);
    x.base(this.resolve(x.baseIn()));
    x.metaOwn(this.resolveMeta(sys.ObjUtil.coerce(x.metaOwnIn(), xeto.NameDict.type$)));
    if (x.base() == null) {
      x.meta(x.metaOwn());
      x.slotsOwn(this.loadSlotsOwn(x));
      x.slots(x.slotsOwn());
    }
    else {
      if (x.base().isAst()) {
        this.loadSpec(sys.ObjUtil.coerce(x.base(), RSpec.type$));
      }
      ;
      x.meta(this.inheritMeta(x));
      x.slotsOwn(this.loadSlotsOwn(x));
      x.slots(this.inheritSlots(x));
      x.args(this.loadArgs(x));
    }
    ;
    let m = null;
    if (x.flavor().isType()) {
      x.bindingRef(this.assignBinding(x));
      (m = MType.make(this.#loc, this.#lib, this.qname(x), x.nameCode(), x.name(), ((this$) => { let $_u96 = x.base(); if ($_u96 == null) return null; return x.base().asm(); })(this), x.asm(), sys.ObjUtil.coerce(x.meta(), MNameDict.type$), sys.ObjUtil.coerce(x.metaOwn(), MNameDict.type$), sys.ObjUtil.coerce(x.slots(), MSlots.type$), sys.ObjUtil.coerce(x.slotsOwn(), MSlots.type$), x.flags(), x.args(), x.binding()));
    }
    else {
      if (x.flavor().isGlobal()) {
        (m = MGlobal.make(this.#loc, this.#lib, this.qname(x), x.nameCode(), x.name(), x.base().asm(), x.base().asm(), sys.ObjUtil.coerce(x.meta(), MNameDict.type$), sys.ObjUtil.coerce(x.metaOwn(), MNameDict.type$), sys.ObjUtil.coerce(x.slots(), MSlots.type$), sys.ObjUtil.coerce(x.slotsOwn(), MSlots.type$), x.flags(), x.args()));
      }
      else {
        if (x.flavor().isMeta()) {
          (m = MMetaSpec.make(this.#loc, this.#lib, this.qname(x), x.nameCode(), x.name(), x.base().asm(), x.base().asm(), sys.ObjUtil.coerce(x.meta(), MNameDict.type$), sys.ObjUtil.coerce(x.metaOwn(), MNameDict.type$), sys.ObjUtil.coerce(x.slots(), MSlots.type$), sys.ObjUtil.coerce(x.slotsOwn(), MSlots.type$), x.flags(), x.args()));
        }
        else {
          x.type(this.resolve(x.typeIn()).asm());
          (m = MSpec.make(this.#loc, x.parent().asm(), x.nameCode(), x.name(), x.base().asm(), sys.ObjUtil.coerce(x.type(), XetoSpec.type$), sys.ObjUtil.coerce(x.meta(), MNameDict.type$), sys.ObjUtil.coerce(x.metaOwn(), MNameDict.type$), sys.ObjUtil.coerce(x.slots(), MSlots.type$), sys.ObjUtil.coerce(x.slotsOwn(), MSlots.type$), x.flags(), x.args()));
        }
        ;
      }
      ;
    }
    ;
    sys.ObjUtil.trap(XetoSpec.type$.slot("m"),"setConst", sys.List.make(sys.Obj.type$.toNullable(), [x.asm(), m]));
    return x;
  }

  qname(x) {
    return sys.StrBuf.make(sys.Int.plus(sys.Int.plus(sys.Str.size(this.#libName), 2), sys.Str.size(x.name()))).add(this.#libName).addChar(58).addChar(58).add(x.name()).toStr();
  }

  resolveMeta(m) {
    const this$ = this;
    if (m.isEmpty()) {
      return MNameDict.empty();
    }
    ;
    (m = sys.ObjUtil.coerce(m.map((v,n) => {
      return ((this$) => { if (sys.ObjUtil.is(v, RSpecRef.type$)) return this$.resolve(sys.ObjUtil.coerce(v, RSpecRef.type$.toNullable())).asm(); return v; })(this$);
    }, sys.Obj.type$), xeto.NameDict.type$));
    return sys.ObjUtil.coerce(MNameDict.wrap(m), MNameDict.type$);
  }

  loadSlotsOwn(x) {
    const this$ = this;
    let slots = x.slotsOwnIn();
    if ((slots == null || slots.isEmpty())) {
      return MSlots.empty();
    }
    ;
    slots.each((slot) => {
      this$.loadSpec(slot);
      return;
    });
    let dict = this.#names.readDict(slots.size(), x);
    return MSlots.make(dict);
  }

  inheritMeta(x) {
    const this$ = this;
    if (x.metaIn() != null) {
      return this.resolveMeta(sys.ObjUtil.coerce(x.metaIn(), xeto.NameDict.type$));
    }
    ;
    let own = x.metaOwn();
    let base = x.base().cmeta();
    let inherit = x.metaInheritedIn();
    if (own.isEmpty()) {
      let baseSize = 0;
      base.each((v) => {
        ((this$) => { let $_u98 = baseSize;baseSize = sys.Int.increment(baseSize); return $_u98; })(this$);
        return;
      });
      if (sys.ObjUtil.equals(baseSize, inherit.size())) {
        return base;
      }
      ;
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    inherit.each((n) => {
      acc.set(n, sys.ObjUtil.coerce(base.trap(n), sys.Obj.type$));
      return;
    });
    XetoUtil.addOwnMeta(acc, sys.ObjUtil.coerce(own, xeto.Dict.type$));
    return sys.ObjUtil.coerce(MNameDict.wrap(this.#names.dictMap(acc)), MNameDict.type$);
  }

  inheritSlots(x) {
    const this$ = this;
    if (x.slotsInheritedIn() != null) {
      return this.inheritSlotsFromRefs(x);
    }
    ;
    let base = x.base();
    if (x.slotsOwn().isEmpty()) {
      if (base.isAst()) {
        return sys.ObjUtil.coerce(((this$) => { let $_u99 = sys.ObjUtil.coerce(base, RSpec.type$).slots(); if ($_u99 != null) return $_u99; return MSlots.empty(); })(this), MSlots.type$);
      }
      else {
        return sys.ObjUtil.coerce(base, XetoSpec.type$).m().slots();
      }
      ;
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::XetoSpec"));
    acc.ordered(true);
    x.base().cslots((slot) => {
      if (acc.get(slot.name()) == null) {
        acc.set(slot.name(), slot.asm());
      }
      ;
      return;
    });
    x.slotsOwn().each((slot) => {
      acc.set(slot.name(), sys.ObjUtil.coerce(slot, XetoSpec.type$));
      return;
    });
    return MSlots.make(this.#names.dictMap(acc));
  }

  inheritSlotsFromRefs(x) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xetoEnv::XetoSpec"));
    acc.ordered(true);
    x.slotsInheritedIn().each((ref) => {
      let slot = this$.resolve(ref);
      if (slot.isAst()) {
        this$.loadSpec(sys.ObjUtil.coerce(slot, RSpec.type$));
      }
      ;
      if (acc.get(slot.name()) == null) {
        acc.set(slot.name(), slot.asm());
      }
      ;
      return;
    });
    x.slotsOwn().each((slot) => {
      acc.set(slot.name(), sys.ObjUtil.coerce(slot, XetoSpec.type$));
      return;
    });
    return MSlots.make(this.#names.dictMap(acc));
  }

  loadArgs(x) {
    const this$ = this;
    let of$ = sys.ObjUtil.as(x.metaOwn().get("of"), xeto.Ref.type$);
    if (of$ != null) {
      return MSpecArgsOf.make(sys.ObjUtil.coerce(this.resolveRef(sys.ObjUtil.coerce(of$, xeto.Ref.type$)), XetoSpec.type$));
    }
    ;
    let ofs = sys.ObjUtil.as(x.metaOwn().get("ofs"), sys.Type.find("xeto::Ref[]"));
    if (ofs != null) {
      return MSpecArgsOfs.make(sys.ObjUtil.coerce(ofs.map((ref) => {
        return this$.resolveRef(ref);
      }, xeto.Spec.type$), sys.Type.find("xetoEnv::XetoSpec[]")));
    }
    ;
    return x.base().args();
  }

  resolveRef(ref) {
    let colons = sys.Str.index(ref.id(), "::");
    let libName = sys.Str.getRange(ref.id(), sys.Range.make(0, sys.ObjUtil.coerce(colons, sys.Int.type$), true));
    let specName = sys.Str.getRange(ref.id(), sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colons, sys.Int.type$), 2), -1));
    let rref = RSpecRef.make(this.#names.toCode(libName), this.#names.toCode(specName), 0, null);
    return this.resolve(rref).asm();
  }

  resolveStr(qname,checked) {
    if (checked === undefined) checked = true;
    if ((sys.Str.startsWith(qname, this.#libName) && sys.ObjUtil.equals(sys.Str.get(qname, sys.Str.size(this.#libName)), 58))) {
      return this.#tops.getChecked(sys.Str.getRange(qname, sys.Range.make(sys.Int.plus(sys.Str.size(this.#libName), 2), -1)), checked);
    }
    else {
      return this.#ns.spec(qname, checked);
    }
    ;
  }

  resolve(ref) {
    if (ref == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.equals(ref.lib(), this.#libNameCode)) {
      return this.resolveInternal(sys.ObjUtil.coerce(ref, RSpecRef.type$));
    }
    else {
      return this.resolveExternal(sys.ObjUtil.coerce(ref, RSpecRef.type$));
    }
    ;
  }

  resolveInternal(ref) {
    const this$ = this;
    let type = this.#tops.getChecked(this.#names.toName(ref.type()));
    if (sys.ObjUtil.equals(ref.slot(), 0)) {
      return sys.ObjUtil.coerce(type, CSpec.type$);
    }
    ;
    let slot = ((this$) => { let $_u100 = type.slotsOwnIn().find((s) => {
      return sys.ObjUtil.equals(s.nameCode(), ref.slot());
    }); if ($_u100 != null) return $_u100; throw sys.UnresolvedErr.make(ref.toStr()); })(this);
    if (ref.more() == null) {
      return sys.ObjUtil.coerce(slot, CSpec.type$);
    }
    ;
    let x = slot;
    ref.more().each((moreCode) => {
      (x = ((this$) => { let $_u101 = x.slotsOwnIn().find((s) => {
        return sys.ObjUtil.equals(s.nameCode(), moreCode);
      }); if ($_u101 != null) return $_u101; throw sys.UnresolvedErr.make(ref.toStr()); })(this$));
      return;
    });
    return sys.ObjUtil.coerce(x, CSpec.type$);
  }

  resolveExternal(ref) {
    let lib = this.#ns.lib(this.#names.toName(ref.lib()));
    let type = sys.ObjUtil.coerce(lib.spec(this.#names.toName(ref.type())), XetoSpec.type$);
    if (sys.ObjUtil.equals(ref.slot(), 0)) {
      return type;
    }
    ;
    let slot = ((this$) => { let $_u102 = type.m().slots().map().getByCode(ref.slot()); if ($_u102 != null) return $_u102; throw sys.UnresolvedErr.make(ref.toStr()); })(this);
    if (ref.more() == null) {
      return sys.ObjUtil.coerce(slot, XetoSpec.type$);
    }
    ;
    throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("TODO: ", type), " "), ref));
  }

}

class CheckVal extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CheckVal.type$; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #fidelity = null;

  fidelity() { return this.#fidelity; }

  __fidelity(it) { if (it === undefined) return this.#fidelity; else this.#fidelity = it; }

  static make(opts) {
    const $self = new CheckVal();
    CheckVal.make$($self,opts);
    return $self;
  }

  static make$($self,opts) {
    $self.#opts = opts;
    $self.#fidelity = XetoUtil.optFidelity(opts);
    return;
  }

  check(spec,x,onErr) {
    this.checkFixed(spec, x, onErr);
    if (spec.isScalar()) {
      return this.checkScalar(spec, x, onErr);
    }
    ;
    if (spec.isList()) {
      return CheckVal.checkList(spec, x, onErr);
    }
    ;
    return;
  }

  checkFixed(spec,x,onErr) {
    if (spec.cmeta().missing("fixed")) {
      return;
    }
    ;
    let expect = spec.cmeta().get("val");
    if (haystack.Etc.eq(expect, x)) {
      return;
    }
    ;
    let narrow = this.#fidelity.coerce(expect);
    if (narrow !== expect) {
      if (haystack.Etc.eq(narrow, x)) {
        return;
      }
      ;
    }
    ;
    sys.Func.call(onErr, sys.Str.plus(sys.Str.plus("Must have fixed value '", expect), "'"));
    return;
  }

  static checkList(spec,obj,onErr) {
    let x = sys.ObjUtil.as(obj, sys.Type.find("sys::List"));
    if (x == null) {
      sys.Func.call(onErr, sys.Str.plus("Not list type: ", sys.ObjUtil.typeof(obj)));
      return;
    }
    ;
    let nonEmpty = spec.cmeta().get("nonEmpty");
    if ((nonEmpty != null && x.isEmpty())) {
      sys.Func.call(onErr, "List must be non-empty");
    }
    ;
    let minSize = CheckVal.toInt(spec.cmeta().get("minSize"));
    if ((minSize != null && sys.ObjUtil.compareLT(x.size(), minSize))) {
      sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus("List size ", sys.ObjUtil.coerce(x.size(), sys.Obj.type$.toNullable())), " < minSize "), sys.ObjUtil.coerce(minSize, sys.Obj.type$.toNullable())));
    }
    ;
    let maxSize = CheckVal.toInt(spec.cmeta().get("maxSize"));
    if ((maxSize != null && sys.ObjUtil.compareGT(x.size(), maxSize))) {
      sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus("List size ", sys.ObjUtil.coerce(x.size(), sys.Obj.type$.toNullable())), " > maxSize "), sys.ObjUtil.coerce(maxSize, sys.Obj.type$.toNullable())));
    }
    ;
    return;
  }

  checkScalar(spec,x,onErr) {
    if (sys.ObjUtil.is(x, haystack.Number.type$)) {
      return CheckVal.checkNumber(spec, sys.ObjUtil.coerce(x, haystack.Number.type$), onErr);
    }
    ;
    if (spec.ctype().isEnum()) {
      return this.checkEnum(spec, x, onErr);
    }
    ;
    if ((sys.ObjUtil.is(x, sys.Str.type$) || sys.ObjUtil.is(x, xeto.Scalar.type$))) {
      return CheckVal.checkStr(spec, sys.ObjUtil.toStr(x), onErr);
    }
    ;
    return;
  }

  static checkNumber(spec,x,onErr) {
    let meta = spec.cmeta();
    let unit = x.unit();
    let min = sys.ObjUtil.as(meta.get("minVal"), haystack.Number.type$);
    let minUnitErr = false;
    if (min != null) {
      if ((min.unit() != null && sys.ObjUtil.compareNE(min.unit(), unit))) {
        sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Number ", x), " has invalid unit, minVal requires '"), min.unit()), "'"));
        (minUnitErr = true);
      }
      else {
        if (sys.ObjUtil.compareLT(x, min)) {
          sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus("Number ", x), " < minVal "), min));
        }
        ;
      }
      ;
    }
    ;
    let max = sys.ObjUtil.as(meta.get("maxVal"), haystack.Number.type$);
    if (max != null) {
      if ((max.unit() != null && sys.ObjUtil.compareNE(max.unit(), unit))) {
        if (!minUnitErr) {
          sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Number ", x), " has invalid unit, maxVal requires '"), max.unit()), "'"));
        }
        ;
      }
      else {
        if (sys.ObjUtil.compareGT(x, max)) {
          sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus("Number ", x), " > maxVal "), max));
        }
        ;
      }
      ;
    }
    ;
    let reqUnit = sys.ObjUtil.as(meta.get("unit"), sys.Unit.type$);
    if (reqUnit != null) {
      if (sys.ObjUtil.compareNE(reqUnit, unit)) {
        sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Number ", x), " must have unit of '"), reqUnit), "'"));
      }
      ;
    }
    ;
    let quantity = meta.get("quantity");
    if (quantity != null) {
      if (unit == null) {
        sys.Func.call(onErr, sys.Str.plus(sys.Str.plus("Number must be '", quantity), "' unit; no unit specified"));
      }
      else {
        let q = xeto.UnitQuantity.unitToQuantity().get(sys.ObjUtil.coerce(unit, sys.Unit.type$));
        if (q == null) {
          sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Number must be '", quantity), "' unit; '"), unit), "' has no quantity"));
        }
        else {
          if (sys.ObjUtil.compareNE(q, quantity)) {
            sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Number must be '", quantity), "' unit; '"), unit), "' has quantity of '"), q), "'"));
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  checkEnum(spec,x,onErr) {
    let key = sys.ObjUtil.as(x, sys.Str.type$);
    if (key == null) {
      (key = ((this$) => { let $_u103=sys.ObjUtil.as(x, xeto.Scalar.type$); return ($_u103==null) ? null : $_u103.val(); })(this));
    }
    ;
    if (key == null) {
      (key = ((this$) => { let $_u104 = sys.ObjUtil.as(x, sys.Enum.type$); if ($_u104 == null) return null; return sys.ObjUtil.as(x, sys.Enum.type$).name(); })(this));
    }
    ;
    if (key == null) {
      (key = ((this$) => { let $_u105 = sys.ObjUtil.as(x, sys.Unit.type$); if ($_u105 == null) return null; return sys.ObjUtil.as(x, sys.Unit.type$).symbol(); })(this));
    }
    ;
    if (key == null) {
      (key = ((this$) => { let $_u106 = sys.ObjUtil.as(x, sys.TimeZone.type$); if ($_u106 == null) return null; return sys.ObjUtil.as(x, sys.TimeZone.type$).name(); })(this));
    }
    ;
    if (key == null) {
      return sys.Func.call(onErr, sys.Str.plus(sys.Str.plus("Invalid enum value type, ", sys.ObjUtil.typeof(x)), " not Str"));
    }
    ;
    let enum$ = spec.ctype();
    let item = enum$.cenum(sys.ObjUtil.coerce(key, sys.Str.type$), false);
    if (item == null) {
      return sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid key '", key), "' for enum type '"), enum$.qname()), "'"));
    }
    ;
    if (sys.ObjUtil.equals(enum$.qname(), "sys::Unit")) {
      let q = spec.cmeta().get("quantity");
      if (q != null) {
        let unitQuantity = item.cmeta().get("quantity");
        if (sys.ObjUtil.compareNE(q, unitQuantity)) {
          sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unit '", key), "' must be '"), q), "' not '"), unitQuantity), "'"));
        }
        ;
      }
      ;
    }
    ;
    return;
  }

  static checkStr(spec,x,onErr) {
    if (!spec.isScalar()) {
      return;
    }
    ;
    let pattern = sys.ObjUtil.as(spec.cmeta().get("pattern"), sys.Str.type$);
    if (pattern != null) {
      if (!sys.Regex.fromStr(sys.ObjUtil.coerce(pattern, sys.Str.type$)).matches(x)) {
        let errType = CheckVal.errTypeForMeta(spec, "pattern", sys.ObjUtil.coerce(pattern, sys.Obj.type$));
        sys.Func.call(onErr, sys.Str.plus(sys.Str.plus("String encoding does not match pattern for '", errType), "'"));
      }
      ;
    }
    ;
    let nonEmpty = spec.cmeta().get("nonEmpty");
    if ((nonEmpty != null && sys.Str.isEmpty(sys.Str.trim(x)))) {
      let errType = CheckVal.errTypeForMeta(spec, "nonEmpty", sys.ObjUtil.coerce(nonEmpty, sys.Obj.type$));
      sys.Func.call(onErr, "String must be non-empty");
    }
    ;
    let minSize = CheckVal.toInt(spec.cmeta().get("minSize"));
    if ((minSize != null && sys.ObjUtil.compareLT(sys.Str.size(x), minSize))) {
      sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus("String size ", sys.ObjUtil.coerce(sys.Str.size(x), sys.Obj.type$.toNullable())), " < minSize "), sys.ObjUtil.coerce(minSize, sys.Obj.type$.toNullable())));
    }
    ;
    let maxSize = CheckVal.toInt(spec.cmeta().get("maxSize"));
    if ((maxSize != null && sys.ObjUtil.compareGT(sys.Str.size(x), maxSize))) {
      sys.Func.call(onErr, sys.Str.plus(sys.Str.plus(sys.Str.plus("String size ", sys.ObjUtil.coerce(sys.Str.size(x), sys.Obj.type$.toNullable())), " > maxSize "), sys.ObjUtil.coerce(maxSize, sys.Obj.type$.toNullable())));
    }
    ;
    return;
  }

  static toInt(v) {
    if (sys.ObjUtil.is(v, sys.Int.type$)) {
      return sys.ObjUtil.coerce(v, sys.Int.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(v, haystack.Number.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(v, haystack.Number.type$).toInt(), sys.Int.type$.toNullable());
    }
    ;
    return null;
  }

  static errTypeForMeta(spec,key,val) {
    if (sys.ObjUtil.equals(spec.ctype().cmeta().get(key), val)) {
      return spec.ctype().qname();
    }
    else {
      return spec.qname();
    }
    ;
  }

}

class Fitter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#slotStack = sys.List.make(sys.Str.type$);
    return;
  }

  typeof() { return Fitter.type$; }

  #curId = null;

  curId(it) {
    if (it === undefined) {
      return this.#curId;
    }
    else {
      this.#curId = it;
      return;
    }
  }

  #ns = null;

  // private field reflection only
  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #failFast = false;

  // private field reflection only
  __failFast(it) { if (it === undefined) return this.#failFast; else this.#failFast = it; }

  #opts = null;

  // private field reflection only
  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #isGraph = false;

  // private field reflection only
  __isGraph(it) { if (it === undefined) return this.#isGraph; else this.#isGraph = it; }

  #ignoreRefs = false;

  // private field reflection only
  __ignoreRefs(it) { if (it === undefined) return this.#ignoreRefs; else this.#ignoreRefs = it; }

  #checkVal = null;

  // private field reflection only
  __checkVal(it) { if (it === undefined) return this.#checkVal; else this.#checkVal = it; }

  #cx = null;

  // private field reflection only
  __cx(it) { if (it === undefined) return this.#cx; else this.#cx = it; }

  #slotStack = null;

  // private field reflection only
  __slotStack(it) { if (it === undefined) return this.#slotStack; else this.#slotStack = it; }

  static make(ns,cx,opts,failFast) {
    const $self = new Fitter();
    Fitter.make$($self,ns,cx,opts,failFast);
    return $self;
  }

  static make$($self,ns,cx,opts,failFast) {
    if (failFast === undefined) failFast = true;
    ;
    $self.#ns = ns;
    $self.#failFast = failFast;
    $self.#opts = opts;
    $self.#isGraph = opts.has("graph");
    $self.#ignoreRefs = opts.has("ignoreRefs");
    $self.#checkVal = CheckVal.make(opts);
    $self.#cx = cx;
    return;
  }

  specFits(a,b) {
    if (a.isa(b)) {
      return true;
    }
    ;
    if (a.isScalar()) {
      return a.type().isa(b.type());
    }
    ;
    if (b.isDict()) {
      if (!a.isDict()) {
        return false;
      }
      ;
      return this.specFitsStruct(a, b);
    }
    ;
    return this.explainInvalidType(b, a);
  }

  specFitsStruct(a,b) {
    const this$ = this;
    let r = b.slots().eachWhile((bslot) => {
      let aslot = a.slot(bslot.name(), false);
      if (aslot == null) {
        return "nofit";
      }
      ;
      return ((this$) => { if (this$.specFits(sys.ObjUtil.coerce(aslot, xeto.Spec.type$), bslot)) return null; return "nofit"; })(this$);
    });
    return r == null;
  }

  valFits(val,spec) {
    const this$ = this;
    let valType = this.#ns.specOf(val, false);
    if (valType == null) {
      return this.explainNoType(val);
    }
    ;
    if ((sys.ObjUtil.is(val, haystack.Dict.type$) && spec.isa(this.#ns.sys().dict()))) {
      this.#curId = sys.ObjUtil.as(sys.ObjUtil.coerce(val, haystack.Dict.type$).get("id"), xeto.Ref.type$);
      return this.fitsStruct(sys.ObjUtil.coerce(val, haystack.Dict.type$), spec);
    }
    ;
    if ((sys.ObjUtil.is(val, sys.Type.find("sys::List")) && spec.isa(this.#ns.sys().list()))) {
      return this.fitsList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")), spec);
    }
    ;
    if (!this.valTypeFits(spec.type(), sys.ObjUtil.coerce(valType, xeto.Spec.type$), sys.ObjUtil.coerce(val, sys.Obj.type$))) {
      return this.explainInvalidType(spec, sys.ObjUtil.coerce(valType, xeto.Spec.type$));
    }
    ;
    let fits = true;
    this.#checkVal.check(sys.ObjUtil.coerce(spec, CSpec.type$), sys.ObjUtil.coerce(val, sys.Obj.type$), (msg) => {
      (fits = this$.explainValErr(spec, msg));
      return;
    });
    if (!fits) {
      return false;
    }
    ;
    if ((spec.isRef() || spec.isMultiRef() || sys.ObjUtil.is(val, xeto.Ref.type$))) {
      if (!this.checkRefTarget(spec, sys.ObjUtil.coerce(val, sys.Obj.type$))) {
        return false;
      }
      ;
    }
    ;
    return true;
  }

  valTypeFits(type,valType,val) {
    const this$ = this;
    if (valType.isa(type)) {
      return true;
    }
    ;
    if ((type.isScalar() && sys.ObjUtil.equals(valType.qname(), "sys::Str") && this.allowStrScalar(type))) {
      return true;
    }
    ;
    if (type.isMultiRef()) {
      if (sys.ObjUtil.is(val, xeto.Ref.type$)) {
        return true;
      }
      ;
      if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
        return sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).all((x) => {
          return sys.ObjUtil.is(x, xeto.Ref.type$);
        });
      }
      ;
    }
    ;
    return false;
  }

  allowStrScalar(type) {
    if (type.lib().isSys()) {
      if ((sys.ObjUtil.equals(type.name(), "Unit") || sys.ObjUtil.equals(type.name(), "TimeZone") || sys.ObjUtil.equals(type.name(), "Filter"))) {
        return true;
      }
      ;
      return false;
    }
    ;
    return true;
  }

  fitsStruct(dict,type) {
    const this$ = this;
    let slots = type.slots();
    if ((type.isChoice() && slots.isEmpty())) {
      return false;
    }
    ;
    let matchFail = false;
    let matchSucc = false;
    slots.each((slot) => {
      let match = this$.fitsSlot(dict, slot);
      if (match == null) {
        return;
      }
      ;
      if (sys.ObjUtil.coerce(match, sys.Bool.type$)) {
        (matchSucc = true);
      }
      else {
        (matchFail = true);
      }
      ;
      if ((this$.#failFast && matchFail)) {
        return false;
      }
      ;
      return;
    });
    dict.each((v,n) => {
      if (slots.has(n)) {
        return;
      }
      ;
      this$.push(n);
      try {
        if (!this$.checkSlotAgainstGlobals(type, n, v)) {
          (matchFail = true);
        }
        ;
        if (!this$.checkNonSlotVal(type, n, v)) {
          (matchFail = true);
        }
        ;
      }
      finally {
        this$.pop();
      }
      ;
      return;
    });
    if (matchFail) {
      return false;
    }
    ;
    return (matchSucc || type === this.#ns.sys().dict());
  }

  fitsSlot(dict,slot) {
    this.push(slot.name());
    try {
      let slotType = slot.type();
      if (slotType.isChoice()) {
        return this.fitsChoice(dict, slot);
      }
      ;
      if (slotType.isQuery()) {
        return this.fitsQuery(dict, slot);
      }
      ;
      let val = dict.get(slot.name(), null);
      if (val == null) {
        if (slot.isMaybe()) {
          return null;
        }
        ;
        return sys.ObjUtil.coerce(this.explainMissingSlot(slot), sys.Bool.type$.toNullable());
      }
      ;
      return sys.ObjUtil.coerce(this.valFits(val, slot), sys.Bool.type$.toNullable());
    }
    finally {
      this.pop();
    }
    ;
  }

  fitsList(list,spec) {
    const this$ = this;
    let fits = true;
    this.#checkVal.check(sys.ObjUtil.coerce(spec, CSpec.type$), list, (err) => {
      (fits = this$.explainValErr(spec, err));
      return;
    });
    let of$ = spec.of(false);
    while ((of$ != null && XetoUtil.isAutoName(of$.name()))) {
      (of$ = ((this$) => { let $_u108 = of$; if ($_u108 == null) return null; return of$.base(); })(this));
    }
    ;
    if (of$ == null) {
      return fits;
    }
    ;
    list.each((v) => {
      if (v == null) {
        if (!of$.isMaybe()) {
          (fits = this$.explainValErr(spec, "List type cannot contain nulls"));
        }
        ;
      }
      else {
        let valType = this$.#ns.specOf(v, false);
        if (valType == null) {
          (fits = this$.explainValErr(spec, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("List item type is '", of$), "', item type is unknown ["), sys.ObjUtil.typeof(v)), "]")));
        }
        else {
          if (!valType.isa(sys.ObjUtil.coerce(of$, xeto.Spec.type$))) {
            (fits = this$.explainValErr(spec, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("List item type is '", of$), "', item type is '"), valType), "'")));
          }
          ;
        }
        ;
      }
      ;
      return;
    });
    return fits;
  }

  checkSlotAgainstGlobals(spec,name,val) {
    let global = this.#ns.global(name, false);
    if (global == null) {
      return true;
    }
    ;
    return this.valFits(val, sys.ObjUtil.coerce(global, xeto.Spec.type$));
  }

  checkNonSlotVal(spec,name,val) {
    if ((sys.ObjUtil.is(val, xeto.Ref.type$) && sys.ObjUtil.compareNE(name, "id") && sys.ObjUtil.compareNE(name, "spec"))) {
      return this.doCheckRefTarget(spec, null, sys.ObjUtil.coerce(val, xeto.Ref.type$));
    }
    ;
    return true;
  }

  fitsChoice(dict,slot) {
    const this$ = this;
    let selection = sys.List.make(XetoSpec.type$);
    let cslot = sys.ObjUtil.coerce(slot, CSpec.type$);
    MChoice.findSelections(this.#ns, cslot, dict, selection);
    let err = null;
    MChoice.validate(cslot, selection, (msg) => {
      (err = msg);
      return;
    });
    if (err == null) {
      return sys.ObjUtil.coerce(true, sys.Bool.type$.toNullable());
    }
    ;
    return sys.ObjUtil.coerce(this.explainChoiceErr(slot, sys.ObjUtil.coerce(err, sys.Str.type$)), sys.Bool.type$.toNullable());
  }

  fitsQuery(dict,query) {
    const this$ = this;
    if (!this.#isGraph) {
      return null;
    }
    ;
    if (query.slots().isEmpty()) {
      return null;
    }
    ;
    let extent = Query.make(this.#ns, this.#cx, this.#opts).query(dict, query);
    let ofDis = ((this$) => { let $_u109 = ((this$) => { let $_u110 = query.of(false); if ($_u110 == null) return null; return query.of(false).name(); })(this$); if ($_u109 != null) return $_u109; return query.name(); })(this);
    let match = true;
    query.slots().eachWhile((constraint) => {
      (match = (this$.fitQueryConstraint(dict, sys.ObjUtil.coerce(ofDis, sys.Str.type$), sys.ObjUtil.coerce(extent, sys.Type.find("haystack::Dict[]")), constraint) && match));
      if ((this$.#failFast && !match)) {
        return "break";
      }
      ;
      return null;
    });
    return sys.ObjUtil.coerce(match, sys.Bool.type$.toNullable());
  }

  fitQueryConstraint(rec,ofDis,extent,constraint) {
    const this$ = this;
    let matches = sys.List.make(haystack.Dict.type$);
    extent.each((x) => {
      if (Fitter.make(this$.#ns, this$.#cx, this$.#opts).valFits(x, constraint)) {
        matches.add(x);
      }
      ;
      return;
    });
    if (sys.ObjUtil.equals(matches.size(), 1)) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(matches.size(), 0)) {
      if (constraint.isMaybe()) {
        return true;
      }
      ;
      return this.explainMissingQueryConstraint(ofDis, constraint);
    }
    ;
    return this.explainAmbiguousQueryConstraint(ofDis, constraint, matches);
  }

  checkRefTarget(spec,val) {
    const this$ = this;
    if (this.#ignoreRefs) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(spec.name(), "id")) {
      return true;
    }
    ;
    let of$ = spec.of(false);
    if (sys.ObjUtil.is(val, xeto.Ref.type$)) {
      return this.doCheckRefTarget(spec, of$, sys.ObjUtil.coerce(val, xeto.Ref.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      let result = true;
      sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).each((x) => {
        let ref = sys.ObjUtil.as(x, xeto.Ref.type$);
        if (ref == null) {
          this$.explainValErr(spec, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expect Ref in List<of:Ref>: ", x), " ["), sys.ObjUtil.typeof(x)), "]"));
          (result = false);
        }
        else {
          let xok = this$.doCheckRefTarget(spec, of$, sys.ObjUtil.coerce(ref, xeto.Ref.type$));
          if (!xok) {
            (result = false);
          }
          ;
        }
        ;
        return;
      });
      return result;
    }
    ;
    return this.explainValErr(spec, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting Ref or List<of:Ref>: ", val), " ["), sys.ObjUtil.typeof(val)), "]"));
  }

  doCheckRefTarget(spec,of$,ref) {
    let target = null;
    if (sys.Str.contains(ref.id(), "::")) {
      (target = this.#ns.spec(ref.id(), false));
      if (target == null) {
        (target = sys.ObjUtil.coerce(this.#ns.instance(ref.id(), false), haystack.Dict.type$.toNullable()));
      }
      ;
    }
    else {
      (target = sys.ObjUtil.coerce(this.#cx.xetoReadById(ref), haystack.Dict.type$.toNullable()));
    }
    ;
    if (target == null) {
      if (this.#ignoreRefs) {
        return true;
      }
      ;
      return this.explainValErr(spec, sys.Str.plus("Unresolved ref @", ref.id()));
    }
    ;
    if (of$ != null) {
      let targetSpecRef = sys.ObjUtil.as(target.get("spec"), xeto.Ref.type$);
      if (targetSpecRef == null) {
        return this.explainValErr(spec, sys.Str.plus("Ref target missing spec tag: @", ref.id()));
      }
      ;
      if (sys.ObjUtil.equals(targetSpecRef.id(), of$.qname())) {
        return true;
      }
      ;
      let targetSpec = this.#ns.spec(targetSpecRef.id(), false);
      if ((targetSpec == null && !sys.Str.startsWith(targetSpecRef.id(), "temp"))) {
        return this.explainValErr(spec, sys.Str.plus(sys.Str.plus("Ref target spec not found: '", targetSpecRef), "'"));
      }
      ;
      if ((targetSpec == null || !targetSpec.isa(sys.ObjUtil.coerce(of$, xeto.Spec.type$)))) {
        return this.explainValErr(spec, sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Ref target must be '", of$.qname()), "', target is '"), targetSpecRef), "'"));
      }
      ;
    }
    ;
    return true;
  }

  inSlot() {
    return !this.#slotStack.isEmpty();
  }

  slotName() {
    return this.#slotStack.peek();
  }

  push(slotName) {
    this.#slotStack.push(slotName);
    return;
  }

  pop() {
    this.#slotStack.pop();
    return;
  }

  explainNoType(val) {
    return false;
  }

  explainInvalidType(spec,valType) {
    return false;
  }

  explainMissingSlot(slot) {
    return false;
  }

  explainMissingQueryConstraint(ofDis,constraint) {
    return false;
  }

  explainAmbiguousQueryConstraint(ofDis,constraint,matches) {
    return false;
  }

  explainValErr(slot,msg) {
    return false;
  }

  explainChoiceErr(slot,msg) {
    return false;
  }

}

class ExplainFitter extends Fitter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExplainFitter.type$; }

  #cb = null;

  // private field reflection only
  __cb(it) { if (it === undefined) return this.#cb; else this.#cb = it; }

  static make(ns,cx,opts,cb) {
    const $self = new ExplainFitter();
    ExplainFitter.make$($self,ns,cx,opts,cb);
    return $self;
  }

  static make$($self,ns,cx,opts,cb) {
    Fitter.make$($self, ns, cx, opts, false);
    $self.#cb = cb;
    return;
  }

  explainNoType(val) {
    return this.log(sys.Str.plus(sys.Str.plus("Value not mapped to data type [", ((this$) => { let $_u111 = val; if ($_u111 == null) return null; return sys.ObjUtil.typeof(val); })(this)), "]"));
  }

  explainInvalidType(spec,valType) {
    let type = spec.type();
    if (spec.isGlobal()) {
      this.log(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Global slot type is '", type), "', value type is '"), valType), "'"));
    }
    else {
      if (this.inSlot()) {
        this.log(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Slot type is '", type), "', value type is '"), valType), "'"));
      }
      else {
        this.log(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Type '", valType), "' does not fit '"), type), "'"));
      }
      ;
    }
    ;
    return false;
  }

  explainMissingSlot(slot) {
    if (slot.type().isMarker()) {
      return this.log("Missing required marker");
    }
    else {
      return this.log("Missing required slot");
    }
    ;
  }

  explainMissingQueryConstraint(ofDis,constraint) {
    return this.log(sys.Str.plus(sys.Str.plus(sys.Str.plus("Missing required ", ofDis), ": "), this.constraintToDis(constraint)));
  }

  explainAmbiguousQueryConstraint(ofDis,constraint,matches) {
    return this.log(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Ambiguous match for ", ofDis), ": "), this.constraintToDis(constraint)), " ["), this.recsToDis(matches)), "]"));
  }

  explainValErr(slot,msg) {
    return this.log(msg);
  }

  explainChoiceErr(slot,msg) {
    return this.log(msg);
  }

  log(msg) {
    if (this.inSlot()) {
      (msg = sys.Str.plus(sys.Str.plus(sys.Str.plus("Slot '", this.slotName()), "': "), msg));
    }
    ;
    sys.Func.call(this.#cb, sys.ObjUtil.coerce(xeto.XetoLogRec.make(sys.LogLevel.err(), this.curId(), msg, util.FileLoc.unknown(), null), xeto.XetoLogRec.type$));
    return false;
  }

  constraintToDis(constraint) {
    let n = constraint.name();
    if (XetoUtil.isAutoName(n)) {
      return constraint.type().qname();
    }
    ;
    return n;
  }

  recsToDis(recs) {
    const this$ = this;
    let s = sys.StrBuf.make();
    recs.sort((a,b) => {
      return sys.ObjUtil.compare(a.get("id"), b.get("id"));
    });
    for (let i = 0; sys.ObjUtil.compareLT(i, recs.size()); i = sys.Int.increment(i)) {
      let rec = recs.get(i);
      let str = sys.Str.plus("@", rec.trap("id", sys.List.make(sys.Obj.type$.toNullable(), [])));
      let dis = sys.ObjUtil.coerce(rec, haystack.Dict.type$).dis();
      if (dis != null) {
        str = sys.Str.plus(str, sys.Str.plus(" ", sys.Str.toCode(dis)));
      }
      ;
      s.join(str, ", ");
      if ((sys.ObjUtil.compareGT(s.size(), 50) && sys.ObjUtil.compareLT(sys.Int.plus(i, 1), recs.size()))) {
        return s.add(sys.Str.plus(sys.Str.plus(", ", sys.ObjUtil.coerce(sys.Int.minus(sys.Int.minus(recs.size(), i), 1), sys.Obj.type$.toNullable())), " more ...")).toStr();
      }
      ;
    }
    ;
    return s.toStr();
  }

}

class XetoCompilerErr extends util.FileLocErr {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoCompilerErr.type$; }

  static make(msg,loc,cause) {
    const $self = new XetoCompilerErr();
    XetoCompilerErr.make$($self,msg,loc,cause);
    return $self;
  }

  static make$($self,msg,loc,cause) {
    if (cause === undefined) cause = null;
    util.FileLocErr.make$($self, msg, loc, cause);
    return;
  }

}

class NotReadyErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NotReadyErr.type$; }

  static make(msg) {
    const $self = new NotReadyErr();
    NotReadyErr.make$($self,msg);
    return $self;
  }

  static make$($self,msg) {
    if (msg === undefined) msg = "";
    sys.Err.make$($self, msg);
    return;
  }

}

class Printer extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Printer.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #isStdout = false;

  isStdout() { return this.#isStdout; }

  __isStdout(it) { if (it === undefined) return this.#isStdout; else this.#isStdout = it; }

  #opts = null;

  opts() { return this.#opts; }

  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #escUnicode = false;

  escUnicode() { return this.#escUnicode; }

  __escUnicode(it) { if (it === undefined) return this.#escUnicode; else this.#escUnicode = it; }

  #specMode = null;

  specMode() { return this.#specMode; }

  __specMode(it) { if (it === undefined) return this.#specMode; else this.#specMode = it; }

  #showdoc = false;

  showdoc() { return this.#showdoc; }

  __showdoc(it) { if (it === undefined) return this.#showdoc; else this.#showdoc = it; }

  #width = 0;

  width() { return this.#width; }

  __width(it) { if (it === undefined) return this.#width; else this.#width = it; }

  #height = 0;

  height() { return this.#height; }

  __height(it) { if (it === undefined) return this.#height; else this.#height = it; }

  #theme = null;

  theme() { return this.#theme; }

  __theme(it) { if (it === undefined) return this.#theme; else this.#theme = it; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  #indentation = 0;

  // private field reflection only
  __indentation(it) { if (it === undefined) return this.#indentation; else this.#indentation = it; }

  #lastnl = false;

  // private field reflection only
  __lastnl(it) { if (it === undefined) return this.#lastnl; else this.#lastnl = it; }

  #inMeta = false;

  // private field reflection only
  __inMeta(it) { if (it === undefined) return this.#inMeta; else this.#inMeta = it; }

  static make(ns,out,opts) {
    const $self = new Printer();
    Printer.make$($self,ns,out,opts);
    return $self;
  }

  static make$($self,ns,out,opts) {
    $self.#ns = ns;
    $self.#out = out;
    $self.#opts = opts;
    $self.#escUnicode = $self.optBool("escapeUnicode", false);
    $self.#showdoc = $self.optBool("doc", false);
    $self.#specMode = $self.optSpecMode();
    $self.#indentation = $self.optInt("indent", 0);
    $self.#width = $self.optInt("width", $self.terminalWidth());
    $self.#height = $self.optInt("height", $self.terminalHeight());
    $self.#isStdout = out === sys.Env.cur().out();
    $self.#theme = ((this$) => { if (this$.#isStdout) return PrinterTheme.configured(); return PrinterTheme.none(); })($self);
    return;
  }

  print(v) {
    if (this.#opts.has("json")) {
      return this.json(v).nl();
    }
    ;
    if (this.#opts.has("text")) {
      return this.w(sys.ObjUtil.coerce(((this$) => { let $_u113 = ((this$) => { let $_u114 = v; if ($_u114 == null) return null; return sys.ObjUtil.toStr(v); })(this$); if ($_u113 != null) return $_u113; return ""; })(this), sys.Obj.type$));
    }
    ;
    let dict = sys.ObjUtil.as(v, haystack.Dict.type$);
    if ((dict != null && dict.has("id"))) {
      this.comment(sys.Str.plus("// ", dict.id().toZinc())).nl();
    }
    ;
    this.val(v);
    if (!this.#lastnl) {
      this.nl();
    }
    ;
    return this;
  }

  val(val) {
    if (val == null) {
      return this.w("null");
    }
    ;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      return this.quoted(sys.ObjUtil.toStr(val));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Grid.type$)) {
      return this.grid(sys.ObjUtil.coerce(val, haystack.Grid.type$));
    }
    ;
    if (sys.ObjUtil.is(val, xeto.Spec.type$)) {
      return this.specTop(sys.ObjUtil.coerce(val, xeto.Spec.type$));
    }
    ;
    if (sys.ObjUtil.is(val, xeto.Dict.type$)) {
      return this.dict(sys.ObjUtil.coerce(val, xeto.Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return this.list(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")));
    }
    ;
    if (sys.ObjUtil.is(val, xeto.Lib.type$)) {
      return this.lib(sys.ObjUtil.coerce(val, xeto.Lib.type$));
    }
    ;
    if (this.#inMeta) {
      return this.quoted(sys.ObjUtil.toStr(val));
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
      return this.ref(sys.ObjUtil.coerce(val, haystack.Ref.type$));
    }
    ;
    return this.w(sys.ObjUtil.coerce(val, sys.Obj.type$));
  }

  list(list) {
    const this$ = this;
    this.bracket("[");
    list.each((v,i) => {
      if (sys.ObjUtil.compareGT(i, 0)) {
        this$.w(", ");
      }
      ;
      this$.val(v);
      return;
    });
    this.bracket("]");
    return this;
  }

  dict(dict) {
    return this.bracket("{").pairs(dict).bracket("}");
  }

  pairs(dict,skip) {
    if (skip === undefined) skip = null;
    const this$ = this;
    let first = true;
    dict.each((v,n) => {
      if ((skip != null && skip.contains(n))) {
        return;
      }
      ;
      if (first) {
        (first = false);
      }
      else {
        this$.w(", ");
      }
      ;
      this$.w(n);
      if (this$.isMarker(v)) {
        return;
      }
      ;
      this$.colon();
      if (this$.#inMeta) {
        if (this$.isNone(v)) {
          return this$.w("None \"none\"");
        }
        ;
        if (this$.isNA(v)) {
          return this$.w("NA \"na\"");
        }
        ;
        if (sys.ObjUtil.is(v, sys.Str.type$)) {
          return this$.quoted(sys.ObjUtil.coerce(v, sys.Str.type$));
        }
        ;
        let t = this$.specOf(v);
        if (t.isScalar()) {
          return this$.w(t.qname()).sp().quoted(sys.ObjUtil.toStr(v));
        }
        ;
      }
      ;
      if (sys.ObjUtil.is(v, xeto.Spec.type$)) {
        return this$.w(sys.ObjUtil.toStr(v));
      }
      ;
      this$.val(v);
      return;
    });
    return this;
  }

  ref(ref) {
    this.w("@").w(ref.id());
    if (ref.disVal() != null) {
      this.sp().quoted(ref.dis());
    }
    ;
    return this;
  }

  grid(grid) {
    const this$ = this;
    let cols = grid.cols().dup();
    let id = cols.find((it) => {
      return sys.ObjUtil.equals(it.name(), "id");
    });
    let dis = cols.find((it) => {
      return sys.ObjUtil.equals(it.name(), "dis");
    });
    cols.moveTo(id, 0);
    cols.moveTo(dis, -1);
    let table = sys.List.make(sys.Type.find("sys::Str[]"));
    table.add(sys.ObjUtil.coerce(cols.map((c) => {
      return c.dis();
    }, sys.Str.type$), sys.Type.find("sys::Str[]")));
    grid.each((row) => {
      let cells = sys.List.make(sys.Str.type$);
      cells.capacity(cols.size());
      cols.each((c) => {
        let val = row.val(c);
        if (sys.ObjUtil.is(val, sys.Str.type$)) {
          cells.add(sys.ObjUtil.coerce(val, sys.Str.type$));
        }
        else {
          if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
            let ref = sys.ObjUtil.coerce(val, haystack.Ref.type$);
            let s = sys.Str.plus("@", ref.id());
            if (ref.disVal() != null) {
              s = sys.Str.plus(s, sys.Str.plus(" ", sys.Str.toCode(ref.disVal())));
            }
            ;
            cells.add(s);
          }
          else {
            cells.add(sys.ObjUtil.coerce(row.dis(c.name()), sys.Str.type$));
          }
          ;
        }
        ;
        return;
      });
      table.add(cells);
      return;
    });
    return this.table(table);
  }

  table(cells) {
    const this$ = this;
    if (cells.isEmpty()) {
      return this;
    }
    ;
    let numCols = cells.get(0).size();
    let colWidths = sys.List.make(sys.Int.type$).fill(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), numCols);
    cells.each((row) => {
      row.each((cell,col) => {
        colWidths.set(col, sys.ObjUtil.coerce(sys.Int.max(colWidths.get(col), sys.Str.size(cell)), sys.Obj.type$.toNullable()));
        return;
      });
      return;
    });
    while (true) {
      let total = 0;
      colWidths.each((w) => {
        total = sys.Int.plus(total, sys.Int.plus(w, 2));
        return;
      });
      if (sys.ObjUtil.compareLE(total, this.#width)) {
        break;
      }
      ;
      let maxi = sys.Int.minus(colWidths.size(), 1);
      colWidths.eachRange(sys.Range.make(2, -1), (w,i) => {
        if (sys.ObjUtil.compareGT(w, colWidths.get(maxi))) {
          (maxi = i);
        }
        ;
        return;
      });
      if (sys.ObjUtil.compareLT(colWidths.get(maxi), 16)) {
        break;
      }
      ;
      colWidths.set(maxi, sys.ObjUtil.coerce(sys.Int.minus(colWidths.get(maxi), 1), sys.Obj.type$.toNullable()));
    }
    ;
    let lastCol = numCols;
    let total = 0;
    for (let i = 0; sys.ObjUtil.compareLT(i, numCols); i = sys.Int.increment(i)) {
      total = sys.Int.plus(total, sys.Int.plus(colWidths.get(i), 2));
      if (sys.ObjUtil.compareGT(total, this.#width)) {
        break;
      }
      ;
      (lastCol = i);
    }
    ;
    let numRows = cells.size();
    let maxRows = numRows;
    cells.each((row,rowIndex) => {
      if (sys.ObjUtil.compareGE(rowIndex, maxRows)) {
        return;
      }
      ;
      let isHeader = sys.ObjUtil.equals(rowIndex, 0);
      if (isHeader) {
        this$.color(this$.#theme.comment());
      }
      ;
      row.each((cell,col) => {
        if (sys.ObjUtil.compareGT(col, lastCol)) {
          return;
        }
        ;
        let str = sys.Str.replace(cell, "\n", " ");
        let colw = colWidths.get(col);
        if (sys.ObjUtil.compareGT(sys.Str.size(str), colw)) {
          (str = sys.Str.plus(sys.Str.getRange(str, sys.Range.make(0, sys.Int.minus(colw, 2), true)), ".."));
        }
        ;
        this$.w(str).w(sys.Str.spaces(sys.Int.plus(sys.Int.minus(colw, sys.Str.size(str)), 2)));
        return;
      });
      this$.nl();
      if (isHeader) {
        sys.Int.times(numCols, (col) => {
          if (sys.ObjUtil.compareGT(col, lastCol)) {
            return;
          }
          ;
          let colw = colWidths.get(col);
          sys.Int.times(colw, (it) => {
            this$.wc(45);
            return;
          });
          this$.w("  ");
          return;
        });
        this$.nl();
        this$.colorEnd(this$.#theme.comment());
      }
      ;
      return;
    });
    if (sys.ObjUtil.compareLT(maxRows, numRows)) {
      this.warn(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sys.Int.minus(numRows, maxRows), sys.Obj.type$.toNullable())), " more rows; use {showall} to see all rows"));
    }
    ;
    return this;
  }

  lib(lib) {
    const this$ = this;
    this.print(lib.name());
    this.bracket(" {").nl();
    ((this$) => { let $_u115 = this$.#indentation;this$.#indentation = sys.Int.increment(this$.#indentation); return $_u115; })(this);
    lib.specs().each((t) => {
      this$.specTop(t).nl().nl();
      return;
    });
    ((this$) => { let $_u116 = this$.#indentation;this$.#indentation = sys.Int.decrement(this$.#indentation); return $_u116; })(this);
    this.bracket("}").nl();
    return this;
  }

  specTop(spec) {
    let mode = this.#specMode;
    if (mode === PrinterSpecMode.qname()) {
      return this.w(spec.qname());
    }
    else {
      return this.doc(spec, mode).w(spec.qname()).colon().spec(spec, mode);
    }
    ;
  }

  spec(spec,mode) {
    let $_u117 = mode;
    if (sys.ObjUtil.equals($_u117, PrinterSpecMode.qname())) {
      this.w(spec.qname());
    }
    else if (sys.ObjUtil.equals($_u117, PrinterSpecMode.effective())) {
      this.specEffective(spec);
    }
    else {
      this.specOwn(spec);
    }
    ;
    return this;
  }

  specOwn(spec) {
    return this.base(spec).meta(spec.metaOwn()).slots(spec, spec.slotsOwn(), PrinterSpecMode.own());
  }

  specEffective(spec) {
    return this.base(spec).meta(spec.metaOwn()).slots(spec, spec.slots(), PrinterSpecMode.effective());
  }

  base(spec) {
    const this$ = this;
    if (spec.isCompound()) {
      let symbol = ((this$) => { if (sys.ObjUtil.equals(spec.base().name(), "And")) return "&"; return "|"; })(this);
      spec.ofs().each((x,i) => {
        if (sys.ObjUtil.compareGT(i, 0)) {
          this$.sp().bracket(symbol).sp();
        }
        ;
        this$.w(x.qname());
        return;
      });
    }
    else {
      if (spec.base() != null) {
        if (spec.isType()) {
          this.w(spec.base().qname());
        }
        else {
          this.w(spec.type().qname());
        }
        ;
        if (spec.isMaybe()) {
          this.bracket("?");
        }
        ;
      }
      ;
    }
    ;
    return this;
  }

  meta(dict) {
    const this$ = this;
    let skip = sys.List.make(sys.Str.type$, ["doc", "ofs", "maybe"]);
    let show = dict.eachWhile((v,n) => {
      if (skip.contains(n)) {
        return null;
      }
      ;
      return "show";
    });
    if (show == null) {
      return this;
    }
    ;
    this.#inMeta = true;
    this.sp().bracket("<").pairs(dict, skip).bracket(">");
    this.#inMeta = false;
    return this;
  }

  slots(parent,slots,mode) {
    const this$ = this;
    if (slots.isEmpty()) {
      return this;
    }
    ;
    this.bracket(" {").nl();
    ((this$) => { let $_u119 = this$.#indentation;this$.#indentation = sys.Int.increment(this$.#indentation); return $_u119; })(this);
    slots.each((slot) => {
      this$.doc(slot, mode);
      let showName = !XetoUtil.isAutoName(slot.name());
      this$.indent();
      if (showName) {
        this$.w(slot.name());
      }
      ;
      if (parent.isEnum()) {
        this$.meta(slot.metaOwn());
      }
      else {
        if ((!this$.isMarker(slot.get("val")) && slot.base() != null)) {
          if (showName) {
            this$.w(": ");
          }
          ;
          if (((((this$) => { let $_u120 = slot.base(); if ($_u120 == null) return null; return slot.base().type(); })(this$) === slot.base() && !slot.isType()) || slot.type().isEnum())) {
            this$.base(slot);
            this$.meta(slot.metaOwn());
          }
          else {
            this$.spec(slot, mode);
          }
          ;
        }
        ;
      }
      ;
      this$.nl();
      return;
    });
    ((this$) => { let $_u121 = this$.#indentation;this$.#indentation = sys.Int.decrement(this$.#indentation); return $_u121; })(this);
    this.indent().bracket("}");
    return this;
  }

  doc(spec,mode) {
    const this$ = this;
    let meta = ((this$) => { if (mode === PrinterSpecMode.own()) return spec.metaOwn(); return spec.meta(); })(this);
    let doc = ((this$) => { let $_u123 = sys.ObjUtil.as(meta.get("doc"), sys.Str.type$); if ($_u123 == null) return null; return sys.Str.trimToNull(sys.ObjUtil.as(meta.get("doc"), sys.Str.type$)); })(this);
    if ((doc == null || !this.#showdoc)) {
      return this;
    }
    ;
    sys.Str.splitLines(doc).each((line,i) => {
      this$.indent().comment(sys.Str.plus("// ", line)).nl();
      return;
    });
    return this;
  }

  xetoTop(x) {
    const this$ = this;
    if (sys.ObjUtil.is(x, haystack.Grid.type$)) {
      sys.ObjUtil.coerce(x, haystack.Grid.type$).each((dict) => {
        this$.xeto(dict, true).nl().nl();
        return;
      });
    }
    else {
      if (Printer.isDictList(x)) {
        sys.ObjUtil.coerce(x, sys.Type.find("xeto::Dict[]")).each((dict) => {
          this$.xeto(dict, true).nl().nl();
          return;
        });
      }
      else {
        this.xeto(x, true);
      }
      ;
    }
    ;
    return this;
  }

  static isDictList(x) {
    const this$ = this;
    let list = sys.ObjUtil.as(x, sys.Type.find("sys::List"));
    if ((list == null || list.isEmpty())) {
      return false;
    }
    ;
    if (list.of().fits(xeto.Dict.type$)) {
      return true;
    }
    ;
    return list.all((it) => {
      return sys.ObjUtil.is(it, xeto.Dict.type$);
    });
  }

  xeto(x,topIds) {
    if (topIds === undefined) topIds = false;
    let spec = this.specOf(x);
    if (spec.isScalar()) {
      return this.xetoScalar(spec, x);
    }
    ;
    if (sys.ObjUtil.is(x, xeto.Dict.type$)) {
      return this.xetoDict(spec, sys.ObjUtil.coerce(x, xeto.Dict.type$), topIds);
    }
    ;
    if (sys.ObjUtil.is(x, sys.Type.find("sys::List"))) {
      return this.xetoList(spec, sys.ObjUtil.coerce(x, sys.Type.find("sys::Obj[]")));
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Not xeto type: ", sys.ObjUtil.typeof(x)));
  }

  xetoScalar(spec,x) {
    let ref = sys.ObjUtil.as(x, haystack.Ref.type$);
    if (ref != null) {
      this.w("@").w(ref.id());
      if (ref.disVal() != null) {
        this.sp().w(sys.Str.toCode(ref.disVal()));
      }
      ;
      return this;
    }
    ;
    if (!sys.ObjUtil.is(x, sys.Str.type$)) {
      this.qname(spec).sp();
    }
    ;
    return this.w(sys.Str.toCode(spec.binding().encodeScalar(x)));
  }

  xetoDict(spec,x,topIds) {
    const this$ = this;
    let id = sys.ObjUtil.as(x.get("id"), haystack.Ref.type$);
    if (topIds) {
      if (id != null) {
        this.w("@").w(id.id()).colon();
      }
      ;
    }
    ;
    this.qname(spec).sp();
    if (x.isEmpty()) {
      return this.bracket("{}");
    }
    ;
    this.bracket("{").nl();
    ((this$) => { let $_u124 = this$.#indentation;this$.#indentation = sys.Int.increment(this$.#indentation); return $_u124; })(this);
    x.each((v,n) => {
      if ((sys.ObjUtil.equals(n, "id") || sys.ObjUtil.equals(n, "spec"))) {
        return;
      }
      ;
      let autoName = XetoUtil.isAutoName(n);
      let subId = sys.ObjUtil.as(((this$) => { let $_u125 = sys.ObjUtil.as(v, xeto.Dict.type$); if ($_u125 == null) return null; return sys.ObjUtil.as(v, xeto.Dict.type$).get("id"); })(this$), haystack.Ref.type$);
      let needColon = (!autoName || subId != null);
      this$.indent();
      if (!autoName) {
        this$.w(n);
      }
      ;
      if (this$.isMarker(v)) {
        return this$.nl();
      }
      ;
      if (subId != null) {
        if (!autoName) {
          this$.w(" ");
        }
        ;
        this$.w(" @").w(sys.ObjUtil.coerce(subId, sys.Obj.type$));
      }
      ;
      if (needColon) {
        this$.colon();
      }
      ;
      this$.xeto(v).nl();
      return;
    });
    ((this$) => { let $_u126 = this$.#indentation;this$.#indentation = sys.Int.decrement(this$.#indentation); return $_u126; })(this);
    this.indent().bracket("}");
    return this;
  }

  xetoList(spec,x) {
    const this$ = this;
    if (x.isEmpty()) {
      return this.w("List").sp().bracket("{}");
    }
    ;
    this.w("List").sp().bracket("{").nl();
    ((this$) => { let $_u127 = this$.#indentation;this$.#indentation = sys.Int.increment(this$.#indentation); return $_u127; })(this);
    x.each((v,i) => {
      this$.indent();
      this$.xeto(v, true).nl();
      return;
    });
    ((this$) => { let $_u128 = this$.#indentation;this$.#indentation = sys.Int.decrement(this$.#indentation); return $_u128; })(this);
    this.indent().bracket("}");
    return this;
  }

  json(val) {
    if (sys.ObjUtil.is(val, xeto.Dict.type$)) {
      return this.jsonDict(sys.ObjUtil.coerce(val, xeto.Dict.type$));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Type.find("sys::List"))) {
      return this.jsonList(sys.ObjUtil.coerce(val, sys.Type.find("sys::Obj?[]")));
    }
    ;
    return this.jsonScalar(val);
  }

  jsonDict(dict) {
    const this$ = this;
    this.bracket("{").nl();
    ((this$) => { let $_u129 = this$.#indentation;this$.#indentation = sys.Int.increment(this$.#indentation); return $_u129; })(this);
    let first = true;
    dict.each((x,n) => {
      if (first) {
        (first = false);
      }
      else {
        this$.comma().nl();
      }
      ;
      this$.indent().quoted(n).colon().json(x);
      return;
    });
    ((this$) => { let $_u130 = this$.#indentation;this$.#indentation = sys.Int.decrement(this$.#indentation); return $_u130; })(this);
    this.nl().indent().bracket("}");
    return this;
  }

  jsonList(list) {
    const this$ = this;
    this.bracket("[").nl();
    ((this$) => { let $_u131 = this$.#indentation;this$.#indentation = sys.Int.increment(this$.#indentation); return $_u131; })(this);
    list.each((x,i) => {
      this$.indent().json(x);
      if (sys.ObjUtil.compareLT(sys.Int.plus(i, 1), list.size())) {
        this$.comma();
      }
      ;
      this$.nl();
      return;
    });
    ((this$) => { let $_u132 = this$.#indentation;this$.#indentation = sys.Int.decrement(this$.#indentation); return $_u132; })(this);
    this.indent().bracket("]");
    return this;
  }

  jsonScalar(val) {
    if (val == null) {
      return this.w("null");
    }
    ;
    if (sys.ObjUtil.is(val, sys.Bool.type$)) {
      return this.w(sys.ObjUtil.toStr(val));
    }
    ;
    return this.quoted(sys.ObjUtil.toStr(val));
  }

  color(color) {
    if (color != null) {
      this.w(sys.ObjUtil.coerce(color, sys.Obj.type$)).flush();
    }
    ;
    return this;
  }

  colorEnd(color) {
    if (color != null) {
      this.w(PrinterTheme.reset()).flush();
    }
    ;
    return this;
  }

  quoted(str,quote) {
    if (quote === undefined) quote = "\"";
    const this$ = this;
    this.color(this.#theme.str());
    this.w(quote);
    sys.Str.each(str, (char) => {
      if ((sys.ObjUtil.compareLE(char, 127) || !this$.#escUnicode)) {
        let $_u133 = char;
        if (sys.ObjUtil.equals($_u133, 8)) {
          this$.wc(92).wc(98);
        }
        else if (sys.ObjUtil.equals($_u133, 12)) {
          this$.wc(92).wc(102);
        }
        else if (sys.ObjUtil.equals($_u133, 10)) {
          this$.wc(92).wc(110);
        }
        else if (sys.ObjUtil.equals($_u133, 13)) {
          this$.wc(92).wc(114);
        }
        else if (sys.ObjUtil.equals($_u133, 9)) {
          this$.wc(92).wc(116);
        }
        else if (sys.ObjUtil.equals($_u133, 92)) {
          this$.wc(92).wc(92);
        }
        else if (sys.ObjUtil.equals($_u133, 34)) {
          this$.wc(92).wc(34);
        }
        else {
          this$.wc(char);
        }
        ;
      }
      else {
        this$.wc(92).wc(117).w(sys.Int.toHex(char, sys.ObjUtil.coerce(4, sys.Int.type$.toNullable())));
      }
      ;
      return;
    });
    this.w(quote);
    this.colorEnd(this.#theme.str());
    return this;
  }

  bracket(symbol) {
    return this.color(this.#theme.bracket()).w(symbol).colorEnd(this.#theme.bracket());
  }

  colon() {
    return this.bracket(":").sp();
  }

  comma() {
    return this.bracket(",");
  }

  comment(str) {
    return this.color(this.#theme.comment()).w(str).colorEnd(this.#theme.comment());
  }

  warn(str) {
    return this.color(this.#theme.warn()).w(str).colorEnd(this.#theme.warn());
  }

  qname(spec) {
    return ((this$) => { if (spec.lib().isSys()) return this$.w(spec.name()); return this$.w(spec.qname()); })(this);
  }

  w(obj) {
    let str = sys.ObjUtil.toStr(obj);
    this.#lastnl = sys.Str.endsWith(str, "\n");
    this.#out.print(str);
    return this;
  }

  wc(char) {
    this.#lastnl = false;
    this.#out.writeChar(char);
    return this;
  }

  nl() {
    this.#lastnl = true;
    this.#out.printLine();
    return this;
  }

  sp() {
    return this.wc(32);
  }

  indent() {
    return this.w(sys.Str.spaces(sys.Int.mult(this.#indentation, 2)));
  }

  flush() {
    this.#out.flush();
    return this;
  }

  specOf(val) {
    return sys.ObjUtil.coerce(this.#ns.specOf(val), xeto.Spec.type$);
  }

  isMarker(val) {
    return val === haystack.Marker.val();
  }

  isNA(val) {
    return val === haystack.NA.val();
  }

  isNone(val) {
    return val === haystack.Remove.val();
  }

  opt(name,def) {
    if (def === undefined) def = null;
    return this.#opts.get(name, def);
  }

  optBool(name,def) {
    return XetoUtil.optBool(this.#opts, name, def);
  }

  optInt(name,def) {
    return XetoUtil.optInt(this.#opts, name, def);
  }

  optSpecMode() {
    const this$ = this;
    let v = this.opt("spec", null);
    if (v != null) {
      return sys.ObjUtil.coerce(PrinterSpecMode.fromStr(sys.ObjUtil.coerce(v, sys.Str.type$)), PrinterSpecMode.type$);
    }
    ;
    (v = this.#opts.eachWhile((ignore,n) => {
      return PrinterSpecMode.fromStr(n, false);
    }));
    if (v != null) {
      return sys.ObjUtil.coerce(v, PrinterSpecMode.type$);
    }
    ;
    return PrinterSpecMode.auto();
  }

  terminalWidth() {
    if (this.#isStdout) {
      return 100000;
    }
    ;
    try {
      let jline = sys.Type.find("[java]jline::TerminalFactory", false);
      if (jline != null) {
        return sys.ObjUtil.coerce(sys.ObjUtil.trap(jline.method("get").call(),"getWidth", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$);
      }
      ;
    }
    catch ($_u135) {
      $_u135 = sys.Err.make($_u135);
      if ($_u135 instanceof sys.Err) {
        let e = $_u135;
        ;
      }
      else {
        throw $_u135;
      }
    }
    ;
    return 80;
  }

  terminalHeight() {
    if (this.#isStdout) {
      return 100000;
    }
    ;
    try {
      let jline = sys.Type.find("[java]jline::TerminalFactory", false);
      if (jline != null) {
        return sys.ObjUtil.coerce(sys.ObjUtil.trap(jline.method("get").call(),"getHeight", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Int.type$);
      }
      ;
    }
    catch ($_u136) {
      $_u136 = sys.Err.make($_u136);
      if ($_u136 instanceof sys.Err) {
        let e = $_u136;
        ;
      }
      else {
        throw $_u136;
      }
    }
    ;
    return 50;
  }

}

class PrinterSpecMode extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PrinterSpecMode.type$; }

  static auto() { return PrinterSpecMode.vals().get(0); }

  static qname() { return PrinterSpecMode.vals().get(1); }

  static own() { return PrinterSpecMode.vals().get(2); }

  static effective() { return PrinterSpecMode.vals().get(3); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new PrinterSpecMode();
    PrinterSpecMode.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(PrinterSpecMode.type$, PrinterSpecMode.vals(), name$, checked);
  }

  static vals() {
    if (PrinterSpecMode.#vals == null) {
      PrinterSpecMode.#vals = sys.List.make(PrinterSpecMode.type$, [
        PrinterSpecMode.make(0, "auto", ),
        PrinterSpecMode.make(1, "qname", ),
        PrinterSpecMode.make(2, "own", ),
        PrinterSpecMode.make(3, "effective", ),
      ]).toImmutable();
    }
    return PrinterSpecMode.#vals;
  }

  static static$init() {
    const $_u137 = PrinterSpecMode.vals();
    if (true) {
    }
    ;
    return;
  }

}

class PrinterTheme extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PrinterTheme.type$; }

  static #reset = undefined;

  static reset() {
    if (PrinterTheme.#reset === undefined) {
      PrinterTheme.static$init();
      if (PrinterTheme.#reset === undefined) PrinterTheme.#reset = null;
    }
    return PrinterTheme.#reset;
  }

  static #black = undefined;

  static black() {
    if (PrinterTheme.#black === undefined) {
      PrinterTheme.static$init();
      if (PrinterTheme.#black === undefined) PrinterTheme.#black = null;
    }
    return PrinterTheme.#black;
  }

  static #red = undefined;

  static red() {
    if (PrinterTheme.#red === undefined) {
      PrinterTheme.static$init();
      if (PrinterTheme.#red === undefined) PrinterTheme.#red = null;
    }
    return PrinterTheme.#red;
  }

  static #green = undefined;

  static green() {
    if (PrinterTheme.#green === undefined) {
      PrinterTheme.static$init();
      if (PrinterTheme.#green === undefined) PrinterTheme.#green = null;
    }
    return PrinterTheme.#green;
  }

  static #yellow = undefined;

  static yellow() {
    if (PrinterTheme.#yellow === undefined) {
      PrinterTheme.static$init();
      if (PrinterTheme.#yellow === undefined) PrinterTheme.#yellow = null;
    }
    return PrinterTheme.#yellow;
  }

  static #blue = undefined;

  static blue() {
    if (PrinterTheme.#blue === undefined) {
      PrinterTheme.static$init();
      if (PrinterTheme.#blue === undefined) PrinterTheme.#blue = null;
    }
    return PrinterTheme.#blue;
  }

  static #purple = undefined;

  static purple() {
    if (PrinterTheme.#purple === undefined) {
      PrinterTheme.static$init();
      if (PrinterTheme.#purple === undefined) PrinterTheme.#purple = null;
    }
    return PrinterTheme.#purple;
  }

  static #cyan = undefined;

  static cyan() {
    if (PrinterTheme.#cyan === undefined) {
      PrinterTheme.static$init();
      if (PrinterTheme.#cyan === undefined) PrinterTheme.#cyan = null;
    }
    return PrinterTheme.#cyan;
  }

  static #white = undefined;

  static white() {
    if (PrinterTheme.#white === undefined) {
      PrinterTheme.static$init();
      if (PrinterTheme.#white === undefined) PrinterTheme.#white = null;
    }
    return PrinterTheme.#white;
  }

  static #none = undefined;

  static none() {
    if (PrinterTheme.#none === undefined) {
      PrinterTheme.static$init();
      if (PrinterTheme.#none === undefined) PrinterTheme.#none = null;
    }
    return PrinterTheme.#none;
  }

  static #configuredRef = undefined;

  static configuredRef() {
    if (PrinterTheme.#configuredRef === undefined) {
      PrinterTheme.static$init();
      if (PrinterTheme.#configuredRef === undefined) PrinterTheme.#configuredRef = null;
    }
    return PrinterTheme.#configuredRef;
  }

  #bracket = null;

  bracket() { return this.#bracket; }

  __bracket(it) { if (it === undefined) return this.#bracket; else this.#bracket = it; }

  #str = null;

  str() { return this.#str; }

  __str(it) { if (it === undefined) return this.#str; else this.#str = it; }

  #comment = null;

  comment() { return this.#comment; }

  __comment(it) { if (it === undefined) return this.#comment; else this.#comment = it; }

  #warn = null;

  warn() { return this.#warn; }

  __warn(it) { if (it === undefined) return this.#warn; else this.#warn = it; }

  static configured() {
    let theme = sys.ObjUtil.as(PrinterTheme.configuredRef().val(), PrinterTheme.type$);
    if (theme == null) {
      PrinterTheme.configuredRef().val((theme = PrinterTheme.loadConfigured()));
    }
    ;
    return sys.ObjUtil.coerce(theme, PrinterTheme.type$);
  }

  static loadConfigured() {
    const this$ = this;
    try {
      let var$ = sys.Env.cur().vars().get("DATA_PRINT_THEME");
      if (var$ == null) {
        return PrinterTheme.none();
      }
      ;
      let toks = sys.Str.split(var$, sys.ObjUtil.coerce(44, sys.Int.type$.toNullable()));
      let map = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
      toks.each((tok) => {
        let pair = sys.Str.split(tok, sys.ObjUtil.coerce(58, sys.Int.type$.toNullable()));
        if (sys.ObjUtil.compareNE(pair.size(), 2)) {
          return;
        }
        ;
        let key = pair.get(0);
        let color = ((this$) => { let $_u138 = PrinterTheme.type$.field(pair.get(1), false); if ($_u138 == null) return null; return PrinterTheme.type$.field(pair.get(1), false).get(null); })(this$);
        map.addNotNull(key, sys.ObjUtil.coerce(color, sys.Str.type$.toNullable()));
        return;
      });
      return PrinterTheme.make((it) => {
        it.#bracket = map.get("bracket");
        it.#str = map.get("str");
        it.#comment = map.get("comment");
        it.#warn = map.get("warn");
        return;
      });
    }
    catch ($_u139) {
      $_u139 = sys.Err.make($_u139);
      if ($_u139 instanceof sys.Err) {
        let e = $_u139;
        ;
        sys.ObjUtil.echo("ERROR: Cannot load pog theme");
        e.trace();
        return PrinterTheme.none();
      }
      else {
        throw $_u139;
      }
    }
    ;
  }

  static make(f) {
    const $self = new PrinterTheme();
    PrinterTheme.make$($self,f);
    return $self;
  }

  static make$($self,f) {
    sys.Func.call(f, $self);
    return;
  }

  static static$init() {
    const this$ = this;
    PrinterTheme.#reset = "\u001b[0m";
    PrinterTheme.#black = "\u001b[30m";
    PrinterTheme.#red = "\u001b[31m";
    PrinterTheme.#green = "\u001b[32m";
    PrinterTheme.#yellow = "\u001b[33m";
    PrinterTheme.#blue = "\u001b[34m";
    PrinterTheme.#purple = "\u001b[35m";
    PrinterTheme.#cyan = "\u001b[36m";
    PrinterTheme.#white = "\u001b[37m";
    PrinterTheme.#none = PrinterTheme.make((it) => {
      return;
    });
    PrinterTheme.#configuredRef = concurrent.AtomicRef.make();
    return;
  }

}

class DependSolver extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::LibVersion"));
    return;
  }

  typeof() { return DependSolver.type$; }

  #repo = null;

  repo() { return this.#repo; }

  __repo(it) { if (it === undefined) return this.#repo; else this.#repo = it; }

  #targets = null;

  // private field reflection only
  __targets(it) { if (it === undefined) return this.#targets; else this.#targets = it; }

  #acc = null;

  // private field reflection only
  __acc(it) { if (it === undefined) return this.#acc; else this.#acc = it; }

  static make(repo,targets) {
    const $self = new DependSolver();
    DependSolver.make$($self,repo,targets);
    return $self;
  }

  static make$($self,repo,targets) {
    ;
    $self.#repo = repo;
    $self.#targets = targets;
    return;
  }

  solve() {
    const this$ = this;
    this.#targets.each((target) => {
      this$.solveDepend("Target", target);
      return;
    });
    return this.#acc.vals();
  }

  solveDepend(who,d) {
    const this$ = this;
    let x = this.#acc.get(d.name());
    if (x == null) {
      (x = ((this$) => { let $_u140 = this$.#repo.latestMatch(d, false); if ($_u140 != null) return $_u140; throw haystack.DependErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", who), " dependency: "), d.toStr()), " [not found]")); })(this));
      this.#acc.set(x.name(), sys.ObjUtil.coerce(x, xeto.LibVersion.type$));
    }
    else {
      if (!d.versions().contains(x.version())) {
        throw haystack.DependErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", who), " dependency: "), d.toStr()), " ["), x), "]"));
      }
      ;
    }
    ;
    x.depends().each((sub) => {
      this$.solveDepend(x.name(), sub);
      return;
    });
    return;
  }

}

class Query extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Query.type$; }

  #ns = null;

  // private field reflection only
  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #opts = null;

  // private field reflection only
  __opts(it) { if (it === undefined) return this.#opts; else this.#opts = it; }

  #cx = null;

  // private field reflection only
  __cx(it) { if (it === undefined) return this.#cx; else this.#cx = it; }

  #fitter = null;

  // private field reflection only
  __fitter(it) { if (it === undefined) return this.#fitter; else this.#fitter = it; }

  static make(ns,cx,opts) {
    const $self = new Query();
    Query.make$($self,ns,cx,opts);
    return $self;
  }

  static make$($self,ns,cx,opts) {
    $self.#ns = ns;
    $self.#cx = cx;
    $self.#opts = opts;
    $self.#fitter = Fitter.make(ns, cx, sys.ObjUtil.coerce(opts, haystack.Dict.type$));
    return;
  }

  query(subject,query) {
    if (!query.isQuery()) {
      throw sys.ArgErr.make(sys.Str.plus("Spec is not Query type: ", query.qname()));
    }
    ;
    let of$ = ((this$) => { let $_u141 = query.of(false); if ($_u141 != null) return $_u141; throw sys.Err.make(sys.Str.plus("No 'of' type specified: ", query.qname())); })(this);
    let via = sys.ObjUtil.as(query.get("via"), sys.Str.type$);
    if (via != null) {
      return this.queryVia(subject, sys.ObjUtil.coerce(of$, xeto.Spec.type$), query, sys.ObjUtil.coerce(via, sys.Str.type$));
    }
    ;
    let inverse = sys.ObjUtil.as(query.get("inverse"), sys.Str.type$);
    if (inverse != null) {
      return this.queryInverse(subject, sys.ObjUtil.coerce(of$, xeto.Spec.type$), query, sys.ObjUtil.coerce(inverse, sys.Str.type$));
    }
    ;
    throw sys.Err.make(sys.Str.plus("Query missing via or inverse meta: ", query.qname()));
  }

  queryVia(subject,of$,query,via) {
    let multiHop = false;
    if (sys.Str.endsWith(via, "+")) {
      (multiHop = true);
      (via = sys.Str.getRange(via, sys.Range.make(0, -2)));
    }
    ;
    let acc = sys.List.make(xeto.Dict.type$);
    let cur = sys.ObjUtil.as(subject, xeto.Dict.type$);
    while (true) {
      (cur = this.traverseVia(sys.ObjUtil.coerce(cur, xeto.Dict.type$), of$, via));
      if (cur == null) {
        break;
      }
      ;
      if (this.fits(cur, of$)) {
        acc.add(sys.ObjUtil.coerce(cur, xeto.Dict.type$));
      }
      ;
      if (!multiHop) {
        break;
      }
      ;
    }
    ;
    return acc;
  }

  traverseVia(subject,of$,via) {
    let ref = subject.get(via, null);
    if (ref == null) {
      return null;
    }
    ;
    let rec = this.#cx.xetoReadById(sys.ObjUtil.coerce(ref, sys.Obj.type$));
    if (rec == null) {
      return rec;
    }
    ;
    return rec;
  }

  queryInverse(subject,of$,query,inverseName) {
    const this$ = this;
    let inverse = this.#ns.spec(inverseName, false);
    if (inverse == null) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Inverse of query '", query.qname()), "' not found: "), inverseName));
    }
    ;
    let via = sys.ObjUtil.as(inverse.get("via"), sys.Str.type$);
    if (via == null) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Inverse of query '", query.qname()), "' must be via: '"), inverse.qname()), "'"));
    }
    ;
    let multiHop = false;
    if (sys.Str.endsWith(via, "+")) {
      (multiHop = true);
      (via = sys.Str.getRange(via, sys.Range.make(0, -2)));
    }
    ;
    let subjectId = subject.trap("id", null);
    let acc = sys.List.make(xeto.Dict.type$);
    this.#cx.xetoReadAllEachWhile(sys.ObjUtil.coerce(via, sys.Str.type$), (rec) => {
      let match = (this$.matchInverse(sys.ObjUtil.coerce(subjectId, sys.Obj.type$), rec, sys.ObjUtil.coerce(via, sys.Str.type$), multiHop) && this$.fits(rec, of$));
      if (match) {
        acc.add(rec);
      }
      ;
      return null;
    });
    return acc;
  }

  matchInverse(subjectId,rec,via,multiHop) {
    let ref = rec.get(via);
    if (ref == null) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(ref, subjectId)) {
      return true;
    }
    ;
    if (!multiHop) {
      return false;
    }
    ;
    let x = this.#cx.xetoReadById(sys.ObjUtil.coerce(ref, sys.Obj.type$));
    if (x == null) {
      return false;
    }
    ;
    return this.matchInverse(subjectId, sys.ObjUtil.coerce(x, xeto.Dict.type$), via, multiHop);
  }

  fits(val,spec) {
    return this.#fitter.valFits(val, spec);
  }

}

class SpecBindings extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#dict = DictBinding.make("sys::Dict");
    this.#loaders = concurrent.ConcurrentMap.make();
    this.#loaded = concurrent.ConcurrentMap.make();
    this.#specMap = concurrent.ConcurrentMap.make();
    this.#typeMap = concurrent.ConcurrentMap.make();
    return;
  }

  typeof() { return SpecBindings.type$; }

  static #curRef = undefined;

  static curRef() {
    if (SpecBindings.#curRef === undefined) {
      SpecBindings.static$init();
      if (SpecBindings.#curRef === undefined) SpecBindings.#curRef = null;
    }
    return SpecBindings.#curRef;
  }

  #dict = null;

  dict() { return this.#dict; }

  __dict(it) { if (it === undefined) return this.#dict; else this.#dict = it; }

  #loaders = null;

  // private field reflection only
  __loaders(it) { if (it === undefined) return this.#loaders; else this.#loaders = it; }

  #loaded = null;

  // private field reflection only
  __loaded(it) { if (it === undefined) return this.#loaded; else this.#loaded = it; }

  #specMap = null;

  // private field reflection only
  __specMap(it) { if (it === undefined) return this.#specMap; else this.#specMap = it; }

  #typeMap = null;

  // private field reflection only
  __typeMap(it) { if (it === undefined) return this.#typeMap; else this.#typeMap = it; }

  static cur() {
    let cur = sys.ObjUtil.as(SpecBindings.curRef().val(), SpecBindings.type$);
    if (cur != null) {
      return sys.ObjUtil.coerce(cur, SpecBindings.type$);
    }
    ;
    SpecBindings.curRef().compareAndSet(null, SpecBindings.make());
    return sys.ObjUtil.coerce(SpecBindings.curRef().val(), SpecBindings.type$);
  }

  static make() {
    const $self = new SpecBindings();
    SpecBindings.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    $self.initLoaders();
    $self.initBindings();
    return;
  }

  initLoaders() {
    const this$ = this;
    try {
      sys.Env.cur().index("xeto.bindings").each((str) => {
        try {
          let toks = sys.Str.split(str);
          let libName = toks.get(0);
          let loaderType = toks.get(1);
          this$.#loaders.set(libName, loaderType);
        }
        catch ($_u142) {
          $_u142 = sys.Err.make($_u142);
          if ($_u142 instanceof sys.Err) {
            let e = $_u142;
            ;
            sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("ERR: Cannot init BindingLoader: ", str), "\n  "), e));
          }
          else {
            throw $_u142;
          }
        }
        ;
        return;
      });
    }
    catch ($_u143) {
      $_u143 = sys.Err.make($_u143);
      if ($_u143 instanceof sys.Err) {
        let e = $_u143;
        ;
        sys.ObjUtil.echo(sys.Str.plus("WARN: Cannot read Env.cur.index: ", e));
      }
      else {
        throw $_u143;
      }
    }
    ;
    return;
  }

  initBindings() {
    let $sys = sys.Pod.find("sys");
    let $xeto = sys.Pod.find("xeto");
    let hay = sys.Pod.find("haystack");
    this.add(ObjBinding.make(sys.ObjUtil.coerce($sys.type("Obj"), sys.Type.type$)));
    this.add(BoolBinding.make(sys.ObjUtil.coerce($sys.type("Bool"), sys.Type.type$)));
    this.add(BufBinding.make(sys.ObjUtil.coerce($sys.type("Buf"), sys.Type.type$)));
    this.add(FloatBinding.make(sys.ObjUtil.coerce($sys.type("Float"), sys.Type.type$)));
    this.add(DateBinding.make(sys.ObjUtil.coerce($sys.type("Date"), sys.Type.type$)));
    this.add(DateTimeBinding.make(sys.ObjUtil.coerce($sys.type("DateTime"), sys.Type.type$)));
    this.add(DurationBinding.make(sys.ObjUtil.coerce($sys.type("Duration"), sys.Type.type$)));
    this.add(IntBinding.make(sys.ObjUtil.coerce($sys.type("Int"), sys.Type.type$)));
    this.add(StrBinding.make(sys.ObjUtil.coerce($sys.type("Str"), sys.Type.type$)));
    this.add(TimeBinding.make(sys.ObjUtil.coerce($sys.type("Time"), sys.Type.type$)));
    this.add(TimeZoneBinding.make(sys.ObjUtil.coerce($sys.type("TimeZone"), sys.Type.type$)));
    this.add(UnitBinding.make(sys.ObjUtil.coerce($sys.type("Unit"), sys.Type.type$)));
    this.add(UriBinding.make(sys.ObjUtil.coerce($sys.type("Uri"), sys.Type.type$)));
    this.add(VersionBinding.make(sys.ObjUtil.coerce($sys.type("Version"), sys.Type.type$)));
    this.add(CompLayoutBinding.make(sys.ObjUtil.coerce($xeto.type("CompLayout"), sys.Type.type$)));
    this.add(LibDependBinding.make(sys.ObjUtil.coerce($xeto.type("LibDepend"), sys.Type.type$)));
    this.add(LibDependVersionsBinding.make(sys.ObjUtil.coerce($xeto.type("LibDependVersions"), sys.Type.type$)));
    this.add(LinkBinding.make(sys.ObjUtil.coerce($xeto.type("Link"), sys.Type.type$)));
    this.add(LinksBinding.make(sys.ObjUtil.coerce($xeto.type("Links"), sys.Type.type$)));
    this.add(SpecDictBinding.make(sys.ObjUtil.coerce($xeto.type("Spec"), sys.Type.type$)));
    this.add(UnitQuantityBinding.make(sys.ObjUtil.coerce($xeto.type("UnitQuantity"), sys.Type.type$)));
    this.add(CoordBinding.make(sys.ObjUtil.coerce(hay.type("Coord"), sys.Type.type$)));
    this.add(FilterBinding.make(sys.ObjUtil.coerce(hay.type("Filter"), sys.Type.type$)));
    this.add(MarkerBinding.make(sys.ObjUtil.coerce(hay.type("Marker"), sys.Type.type$)));
    this.add(NoneBinding.make(sys.ObjUtil.coerce(hay.type("Remove"), sys.Type.type$)));
    this.add(NABinding.make(sys.ObjUtil.coerce(hay.type("NA"), sys.Type.type$)));
    this.add(NumberBinding.make(sys.ObjUtil.coerce(hay.type("Number"), sys.Type.type$)));
    this.add(RefBinding.make(sys.ObjUtil.coerce(hay.type("Ref"), sys.Type.type$)));
    this.add(SpanBinding.make(sys.ObjUtil.coerce(hay.type("Span"), sys.Type.type$)));
    this.add(SpanModeBinding.make(sys.ObjUtil.coerce(hay.type("SpanMode"), sys.Type.type$)));
    this.add(SymbolBinding.make(sys.ObjUtil.coerce(hay.type("Symbol"), sys.Type.type$)));
    this.add(CompBinding.make("sys.comp::Comp", sys.ObjUtil.coerce($xeto.type("Comp"), sys.Type.type$)));
    this.add(this.#dict);
    return;
  }

  list() {
    return sys.ObjUtil.coerce(this.#specMap.vals(xeto.SpecBinding.type$), sys.Type.find("xeto::SpecBinding[]"));
  }

  forSpec(qname) {
    return sys.ObjUtil.coerce(this.#specMap.get(qname), xeto.SpecBinding.type$.toNullable());
  }

  forType(type) {
    return sys.ObjUtil.coerce(this.#typeMap.get(type.qname()), xeto.SpecBinding.type$.toNullable());
  }

  forTypeToSpec(ns,type) {
    let binding = this.forType(type);
    if (binding == null) {
      return null;
    }
    ;
    return ns.spec(binding.spec(), false);
  }

  add(b) {
    (b = sys.ObjUtil.coerce(this.#specMap.getOrAdd(b.spec(), b), xeto.SpecBinding.type$));
    (b = sys.ObjUtil.coerce(this.#typeMap.getOrAdd(b.type().qname(), b), xeto.SpecBinding.type$));
    return b;
  }

  needsLoad(libName,version) {
    return (this.#loaders.containsKey(libName) && !this.#loaded.containsKey(this.loadKey(libName, version)));
  }

  load(libName,version) {
    let loaderType = sys.ObjUtil.as(this.#loaders.get(libName), sys.Str.type$);
    if (loaderType == null) {
      return SpecBindingLoader.make();
    }
    ;
    let loadKey = this.loadKey(libName, version);
    this.#loaded.set(loadKey, loadKey);
    let loader = null;
    if (sys.Str.contains(loaderType, "::")) {
      (loader = sys.ObjUtil.coerce(sys.Type.find(sys.ObjUtil.coerce(loaderType, sys.Str.type$)).make(), SpecBindingLoader.type$.toNullable()));
    }
    else {
      (loader = PodBindingLoader.make(sys.ObjUtil.coerce(sys.Pod.find(sys.ObjUtil.coerce(loaderType, sys.Str.type$)), sys.Pod.type$)));
    }
    ;
    loader.loadLib(this, libName);
    return sys.ObjUtil.coerce(loader, SpecBindingLoader.type$);
  }

  loadKey(libName,version) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", libName), " "), version);
  }

  static static$init() {
    SpecBindings.#curRef = concurrent.AtomicRef.make();
    return;
  }

}

class SpecBindingLoader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SpecBindingLoader.type$; }

  loadLib(acc,libName) {
    return;
  }

  loadSpec(acc,spec) {
    return null;
  }

  loadSpecReflect(acc,pod,spec) {
    let type = pod.type(spec.name(), false);
    if (type == null) {
      return null;
    }
    ;
    let compBase = sys.ObjUtil.as(spec.cbase().binding(), CompBinding.type$);
    if (compBase != null) {
      return acc.add(sys.ObjUtil.coerce(sys.ObjUtil.coerce(compBase.clone(spec.qname(), sys.ObjUtil.coerce(type, sys.Type.type$)), CompBinding.type$.toNullable()), xeto.SpecBinding.type$));
    }
    ;
    if (type.fits(xeto.Dict.type$)) {
      return acc.add(ImplDictBinding.make(spec.qname(), sys.ObjUtil.coerce(type, sys.Type.type$)));
    }
    ;
    if (type.fits(sys.Enum.type$)) {
      return acc.add(ScalarBinding.make(spec.qname(), sys.ObjUtil.coerce(type, sys.Type.type$)));
    }
    ;
    return null;
  }

  static make() {
    const $self = new SpecBindingLoader();
    SpecBindingLoader.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class PodBindingLoader extends SpecBindingLoader {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return PodBindingLoader.type$; }

  #pod = null;

  pod() { return this.#pod; }

  __pod(it) { if (it === undefined) return this.#pod; else this.#pod = it; }

  static make(pod) {
    const $self = new PodBindingLoader();
    PodBindingLoader.make$($self,pod);
    return $self;
  }

  static make$($self,pod) {
    SpecBindingLoader.make$($self);
    $self.#pod = pod;
    return;
  }

  loadSpec(acc,spec) {
    return this.loadSpecReflect(acc, this.#pod, spec);
  }

}

class ObjBinding extends xeto.SpecBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ObjBinding.type$; }

  #spec = null;

  spec() { return this.#spec; }

  __spec(it) { if (it === undefined) return this.#spec; else this.#spec = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make(type) {
    const $self = new ObjBinding();
    ObjBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    xeto.SpecBinding.make$($self);
    $self.#spec = type.qname();
    $self.#type = type;
    return;
  }

  isScalar() {
    return false;
  }

  isDict() {
    return false;
  }

  decodeDict($xeto) {
    throw sys.UnsupportedErr.make("Obj");
  }

  decodeScalar($xeto,checked) {
    if (checked === undefined) checked = true;
    throw sys.UnsupportedErr.make("Obj");
  }

  encodeScalar(val) {
    throw sys.UnsupportedErr.make("Obj");
  }

  isInheritable() {
    return false;
  }

}

class DictBinding extends xeto.SpecBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DictBinding.type$; }

  #spec = null;

  spec() { return this.#spec; }

  __spec(it) { if (it === undefined) return this.#spec; else this.#spec = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make(spec,type) {
    const $self = new DictBinding();
    DictBinding.make$($self,spec,type);
    return $self;
  }

  static make$($self,spec,type) {
    if (type === undefined) type = xeto.Dict.type$;
    xeto.SpecBinding.make$($self);
    $self.#spec = spec;
    $self.#type = type;
    return;
  }

  isScalar() {
    return false;
  }

  isDict() {
    return true;
  }

  decodeDict($xeto) {
    return $xeto;
  }

  decodeScalar($xeto,checked) {
    if (checked === undefined) checked = true;
    throw sys.UnsupportedErr.make(this.#spec);
  }

  encodeScalar(val) {
    throw sys.UnsupportedErr.make(this.#spec);
  }

  isInheritable() {
    return true;
  }

}

class ScalarBinding extends xeto.SpecBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ScalarBinding.type$; }

  #spec = null;

  spec() { return this.#spec; }

  __spec(it) { if (it === undefined) return this.#spec; else this.#spec = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make(spec,type) {
    const $self = new ScalarBinding();
    ScalarBinding.make$($self,spec,type);
    return $self;
  }

  static make$($self,spec,type) {
    xeto.SpecBinding.make$($self);
    $self.#spec = spec;
    $self.#type = type;
    return;
  }

  isScalar() {
    return true;
  }

  isDict() {
    return false;
  }

  decodeDict($xeto) {
    throw sys.UnsupportedErr.make(this.#spec);
  }

  decodeScalar($xeto,checked) {
    if (checked === undefined) checked = true;
    return ((this$) => { let $_u144 = this$.#type.method("fromStr", checked); if ($_u144 == null) return null; return this$.#type.method("fromStr", checked).call($xeto, sys.ObjUtil.coerce(checked, sys.Obj.type$.toNullable())); })(this);
  }

  encodeScalar(val) {
    return sys.ObjUtil.toStr(val);
  }

  isInheritable() {
    return false;
  }

}

class CompBinding extends DictBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompBinding.type$; }

  static make(spec,type) {
    const $self = new CompBinding();
    CompBinding.make$($self,spec,type);
    return $self;
  }

  static make$($self,spec,type) {
    DictBinding.make$($self, spec, type);
    return;
  }

  clone(spec,type) {
    return CompBinding.make(spec, type);
  }

}

class ImplDictBinding extends DictBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ImplDictBinding.type$; }

  #impl = null;

  impl() { return this.#impl; }

  __impl(it) { if (it === undefined) return this.#impl; else this.#impl = it; }

  static make(spec,type) {
    const $self = new ImplDictBinding();
    ImplDictBinding.make$($self,spec,type);
    return $self;
  }

  static make$($self,spec,type) {
    DictBinding.make$($self, spec, type);
    $self.#impl = sys.ObjUtil.coerce(type.pod().type(sys.Str.plus("M", type.name())), sys.Type.type$);
    return;
  }

  decodeDict($xeto) {
    return sys.ObjUtil.coerce(this.#impl.make(sys.List.make(xeto.Dict.type$, [$xeto])), xeto.Dict.type$);
  }

}

class SingletonBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SingletonBinding.type$; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  #altStr = null;

  altStr() { return this.#altStr; }

  __altStr(it) { if (it === undefined) return this.#altStr; else this.#altStr = it; }

  static make(spec,type,val,altStr) {
    const $self = new SingletonBinding();
    SingletonBinding.make$($self,spec,type,val,altStr);
    return $self;
  }

  static make$($self,spec,type,val,altStr) {
    if (altStr === undefined) altStr = null;
    ScalarBinding.make$($self, spec, type);
    $self.#val = ((this$) => { let $_u145 = val; if ($_u145 == null) return null; return sys.ObjUtil.toImmutable(val); })($self);
    $self.#altStr = altStr;
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    if (sys.ObjUtil.equals(str, sys.ObjUtil.toStr(this.#val))) {
      return this.#val;
    }
    ;
    if (sys.ObjUtil.equals(str, this.#altStr)) {
      return this.#val;
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(str);
    }
    ;
    return null;
  }

}

class GenericScalarBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GenericScalarBinding.type$; }

  static make(spec) {
    const $self = new GenericScalarBinding();
    GenericScalarBinding.make$($self,spec);
    return $self;
  }

  static make$($self,spec) {
    ScalarBinding.make$($self, spec, xeto.Scalar.type$);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return xeto.Scalar.make(this.spec(), str);
  }

}

class BoolBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BoolBinding.type$; }

  static make(type) {
    const $self = new BoolBinding();
    BoolBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(sys.Bool.fromStr(str, checked), sys.Obj.type$.toNullable());
  }

}

class BufBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BufBinding.type$; }

  static make(type) {
    const $self = new BufBinding();
    BufBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return sys.Buf.fromBase64(str);
  }

  encodeScalar(v) {
    return sys.ObjUtil.coerce(v, sys.Buf.type$).toBase64Uri();
  }

}

class CompLayoutBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CompLayoutBinding.type$; }

  static make(type) {
    const $self = new CompLayoutBinding();
    CompLayoutBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, "sys.comp::CompLayout", type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return xeto.CompLayout.fromStr(str, checked);
  }

}

class CoordBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CoordBinding.type$; }

  static make(type) {
    const $self = new CoordBinding();
    CoordBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, "ph::Coord", type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return haystack.Coord.fromStr(str, checked);
  }

}

class DateBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DateBinding.type$; }

  static make(type) {
    const $self = new DateBinding();
    DateBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return sys.Date.fromStr(str, checked);
  }

}

class DateTimeBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DateTimeBinding.type$; }

  static make(type) {
    const $self = new DateTimeBinding();
    DateTimeBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    if (sys.Str.endsWith(str, "Z")) {
      str = sys.Str.plus(str, " UTC");
    }
    ;
    return sys.DateTime.fromStr(str, checked);
  }

}

class DurationBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DurationBinding.type$; }

  static make(type) {
    const $self = new DurationBinding();
    DurationBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return sys.Duration.fromStr(str, checked);
  }

}

class FilterBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FilterBinding.type$; }

  static make(type) {
    const $self = new FilterBinding();
    FilterBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, "sys::Filter", type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return haystack.Filter.fromStr(str, checked);
  }

}

class FloatBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FloatBinding.type$; }

  static make(type) {
    const $self = new FloatBinding();
    FloatBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(sys.Float.fromStr(str, checked), sys.Obj.type$.toNullable());
  }

}

class IntBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return IntBinding.type$; }

  static make(type) {
    const $self = new IntBinding();
    IntBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return sys.ObjUtil.coerce(sys.Int.fromStr(str, 10, checked), sys.Obj.type$.toNullable());
  }

}

class LibDependVersionsBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LibDependVersionsBinding.type$; }

  static make(type) {
    const $self = new LibDependVersionsBinding();
    LibDependVersionsBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, "sys::LibDependVersions", type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return xeto.LibDependVersions.fromStr(str, checked);
  }

}

class MarkerBinding extends SingletonBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MarkerBinding.type$; }

  static make(type) {
    const $self = new MarkerBinding();
    MarkerBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    SingletonBinding.make$($self, "sys::Marker", type, haystack.Marker.val());
    return;
  }

}

class NABinding extends SingletonBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NABinding.type$; }

  static make(type) {
    const $self = new NABinding();
    NABinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    SingletonBinding.make$($self, "sys::NA", type, haystack.NA.val(), "na");
    return;
  }

}

class NoneBinding extends SingletonBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NoneBinding.type$; }

  static make(type) {
    const $self = new NoneBinding();
    NoneBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    SingletonBinding.make$($self, "sys::None", type, haystack.Remove.val(), "none");
    return;
  }

}

class NumberBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return NumberBinding.type$; }

  static make(type) {
    const $self = new NumberBinding();
    NumberBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, "sys::Number", type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return haystack.Number.fromStrStrictUnit(str, checked);
  }

}

class RefBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RefBinding.type$; }

  static make(type) {
    const $self = new RefBinding();
    RefBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, "sys::Ref", type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return haystack.Ref.fromStr(str, checked);
  }

}

class SpanBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SpanBinding.type$; }

  static make(type) {
    const $self = new SpanBinding();
    SpanBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, "sys::Span", type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return haystack.Span.fromStr(str, sys.TimeZone.cur(), checked);
  }

}

class SpanModeBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SpanModeBinding.type$; }

  static make(type) {
    const $self = new SpanModeBinding();
    SpanModeBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, "sys::SpanMode", type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return haystack.SpanMode.fromStr(str, checked);
  }

}

class StrBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StrBinding.type$; }

  static make(type) {
    const $self = new StrBinding();
    StrBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return str;
  }

}

class SymbolBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SymbolBinding.type$; }

  static make(type) {
    const $self = new SymbolBinding();
    SymbolBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, "ph::Symbol", type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return haystack.Symbol.fromStr(str);
  }

}

class TimeBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TimeBinding.type$; }

  static make(type) {
    const $self = new TimeBinding();
    TimeBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return sys.Time.fromStr(str, checked);
  }

}

class TimeZoneBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return TimeZoneBinding.type$; }

  static make(type) {
    const $self = new TimeZoneBinding();
    TimeZoneBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return sys.TimeZone.fromStr(str, checked);
  }

}

class UnitBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnitBinding.type$; }

  static make(type) {
    const $self = new UnitBinding();
    UnitBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    let unit = sys.Unit.fromStr(str, false);
    if ((unit != null && sys.ObjUtil.compareNE(unit.symbol(), str))) {
      (unit = null);
    }
    ;
    if (unit != null) {
      return unit;
    }
    ;
    if (checked) {
      throw sys.ParseErr.make(sys.Str.plus("Invalid unit symbol: ", str));
    }
    ;
    return null;
  }

}

class UnitQuantityBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UnitQuantityBinding.type$; }

  static make(type) {
    const $self = new UnitQuantityBinding();
    UnitQuantityBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, "sys::UnitQuantity", type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return xeto.UnitQuantity.fromStr(str, checked);
  }

}

class UriBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return UriBinding.type$; }

  static make(type) {
    const $self = new UriBinding();
    UriBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return sys.Uri.fromStr(str, checked);
  }

}

class VersionBinding extends ScalarBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return VersionBinding.type$; }

  static make(type) {
    const $self = new VersionBinding();
    VersionBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    ScalarBinding.make$($self, type.qname(), type);
    return;
  }

  decodeScalar(str,checked) {
    if (checked === undefined) checked = true;
    return sys.Version.fromStr(str, checked);
  }

}

class LibDependBinding extends DictBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LibDependBinding.type$; }

  static make(type) {
    const $self = new LibDependBinding();
    LibDependBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    DictBinding.make$($self, "sys::LibDepend", type);
    return;
  }

  decodeDict($xeto) {
    return MLibDepend.make(sys.ObjUtil.coerce($xeto, haystack.Dict.type$));
  }

}

class LinkBinding extends DictBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LinkBinding.type$; }

  static make(type) {
    const $self = new LinkBinding();
    LinkBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    DictBinding.make$($self, "sys.comp::Link", type);
    return;
  }

  decodeDict($xeto) {
    return haystack.Etc.linkWrap(sys.ObjUtil.coerce($xeto, haystack.Dict.type$));
  }

}

class LinksBinding extends DictBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return LinksBinding.type$; }

  static make(type) {
    const $self = new LinksBinding();
    LinksBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    DictBinding.make$($self, "sys.comp::Links", type);
    return;
  }

  decodeDict($xeto) {
    return haystack.Etc.links($xeto);
  }

}

class SpecDictBinding extends DictBinding {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SpecDictBinding.type$; }

  static make(type) {
    const $self = new SpecDictBinding();
    SpecDictBinding.make$($self,type);
    return $self;
  }

  static make$($self,type) {
    DictBinding.make$($self, "sys::Spec", type);
    return;
  }

  decodeDict($xeto) {
    return $xeto;
  }

}

class MLibDepend extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return MLibDepend.type$; }

  dis() { return haystack.Dict.prototype.dis.apply(this, arguments); }

  _id() { return haystack.Dict.prototype._id.apply(this, arguments); }

  id() { return haystack.Dict.prototype.id.apply(this, arguments); }

  map() { return haystack.Dict.prototype.map.apply(this, arguments); }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #versions = null;

  versions() { return this.#versions; }

  __versions(it) { if (it === undefined) return this.#versions; else this.#versions = it; }

  #loc = null;

  loc() { return this.#loc; }

  __loc(it) { if (it === undefined) return this.#loc; else this.#loc = it; }

  static #specRef$Store = undefined;

  static specRef$Store(it) { if (it === undefined) return MLibDepend.#specRef$Store; else MLibDepend.#specRef$Store = it; }

  static makeFields(name,versions,loc) {
    const $self = new MLibDepend();
    MLibDepend.makeFields$($self,name,versions,loc);
    return $self;
  }

  static makeFields$($self,name,versions,loc) {
    if (versions === undefined) versions = xeto.LibDependVersions.wildcard();
    if (loc === undefined) loc = util.FileLoc.synthetic();
    $self.#name = name;
    $self.#versions = versions;
    $self.#loc = loc;
    return;
  }

  static make(dict) {
    const $self = new MLibDepend();
    MLibDepend.make$($self,dict);
    return $self;
  }

  static make$($self,dict) {
    $self.#name = sys.ObjUtil.coerce(dict.trap("lib", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
    $self.#versions = sys.ObjUtil.coerce(((this$) => { let $_u146 = dict.get("versions"); if ($_u146 != null) return $_u146; return xeto.LibDependVersions.wildcard(); })($self), xeto.LibDependVersions.type$);
    $self.#loc = util.FileLoc.synthetic();
    return;
  }

  static specRef() {
    if (MLibDepend.specRef$Store() === undefined) {
      MLibDepend.specRef$Store(MLibDepend.specRef$Once());
    }
    ;
    return sys.ObjUtil.coerce(MLibDepend.specRef$Store(), haystack.Ref.type$);
  }

  isEmpty() {
    return false;
  }

  get(n,def) {
    if (def === undefined) def = null;
    if (sys.ObjUtil.equals(n, "lib")) {
      return this.#name;
    }
    ;
    if (sys.ObjUtil.equals(n, "versions")) {
      return this.#versions;
    }
    ;
    if (sys.ObjUtil.equals(n, "spec")) {
      return MLibDepend.specRef();
    }
    ;
    return def;
  }

  has(n) {
    return (sys.ObjUtil.equals(n, "lib") || sys.ObjUtil.equals(n, "versions") || sys.ObjUtil.equals(n, "spec"));
  }

  missing(n) {
    return !this.has(n);
  }

  trap(n,a) {
    if (a === undefined) a = null;
    let v = this.get(n);
    if (v != null) {
      return v;
    }
    ;
    throw sys.Err.make(n);
  }

  each(f) {
    sys.Func.call(f, this.#name, "lib");
    sys.Func.call(f, this.#versions, "versions");
    sys.Func.call(f, MLibDepend.specRef(), "spec");
    return;
  }

  eachWhile(f) {
    let r = sys.Func.call(f, this.#name, "lib");
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, this.#versions, "versions"));
    if (r != null) {
      return r;
    }
    ;
    (r = sys.Func.call(f, MLibDepend.specRef(), "spec"));
    if (r != null) {
      return r;
    }
    ;
    return null;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), " "), this.#versions);
  }

  static specRef$Once() {
    return sys.ObjUtil.coerce(haystack.Ref.fromStr("sys::LibDepend"), haystack.Ref.type$);
  }

  static static$init() {
    return;
  }

}

class XetoLog extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoLog.type$; }

  static makeOutStream(out) {
    if (out === undefined) out = sys.Env.cur().out();
    return XetoOutStreamLog.make(out);
  }

  static makeLog(log) {
    return XetoWrapperLog.make(log);
  }

  info(msg) {
    this.log(sys.LogLevel.info(), null, msg, util.FileLoc.unknown(), null);
    return;
  }

  warn(msg,loc,err) {
    if (err === undefined) err = null;
    this.log(sys.LogLevel.warn(), null, msg, loc, err);
    return;
  }

  err(msg,loc,err) {
    if (err === undefined) err = null;
    this.log(sys.LogLevel.err(), null, msg, loc, err);
    return;
  }

  static make() {
    const $self = new XetoLog();
    XetoLog.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class XetoOutStreamLog extends XetoLog {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoOutStreamLog.type$; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  static make(out) {
    const $self = new XetoOutStreamLog();
    XetoOutStreamLog.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    XetoLog.make$($self);
    $self.#out = out;
    return;
  }

  log(level,id,msg,loc,err) {
    if (loc !== util.FileLoc.unknown()) {
      this.#out.print(loc).print(": ");
    }
    ;
    if (sys.ObjUtil.equals(level, sys.LogLevel.warn())) {
      this.#out.print("WARN ");
    }
    ;
    this.#out.printLine(msg);
    if (err != null) {
      err.trace(this.#out);
    }
    ;
    return;
  }

}

class XetoWrapperLog extends XetoLog {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoWrapperLog.type$; }

  #wrap = null;

  wrap() { return this.#wrap; }

  __wrap(it) { if (it === undefined) return this.#wrap; else this.#wrap = it; }

  static make(wrap) {
    const $self = new XetoWrapperLog();
    XetoWrapperLog.make$($self,wrap);
    return $self;
  }

  static make$($self,wrap) {
    XetoLog.make$($self);
    $self.#wrap = wrap;
    return;
  }

  log(level,id,msg,loc,err) {
    this.#wrap.log(sys.LogRec.make(sys.DateTime.now(), level, this.#wrap.name(), msg, err));
    return;
  }

}

class XetoCallbackLog extends XetoLog {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoCallbackLog.type$; }

  #cb = null;

  // private field reflection only
  __cb(it) { if (it === undefined) return this.#cb; else this.#cb = it; }

  static make(cb) {
    const $self = new XetoCallbackLog();
    XetoCallbackLog.make$($self,cb);
    return $self;
  }

  static make$($self,cb) {
    XetoLog.make$($self);
    $self.#cb = cb;
    return;
  }

  log(level,id,msg,loc,err) {
    sys.Func.call(this.#cb, sys.ObjUtil.coerce(xeto.XetoLogRec.make(level, id, msg, loc, err), xeto.XetoLogRec.type$));
    return;
  }

}

class XMeta extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return XMeta.type$; }

  #ns = null;

  ns() { return this.#ns; }

  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #libs$Store = undefined;

  // private field reflection only
  __libs$Store(it) { if (it === undefined) return this.#libs$Store; else this.#libs$Store = it; }

  static make(ns) {
    const $self = new XMeta();
    XMeta.make$($self,ns);
    return $self;
  }

  static make$($self,ns) {
    ;
    $self.#ns = ns;
    return;
  }

  libs() {
    if (this.#libs$Store === undefined) {
      this.#libs$Store = this.libs$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#libs$Store, sys.Type.find("xeto::Lib[]"));
  }

  xmeta(qname,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let spec = this.#ns.spec(qname, checked);
    if (spec == null) {
      return null;
    }
    ;
    let acc = haystack.Etc.dictToMap(sys.ObjUtil.coerce(spec.meta(), haystack.Dict.type$.toNullable()));
    let instanceNames = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    instanceNames.ordered(true);
    this.addInheritanceInstanceNames(instanceNames, sys.ObjUtil.coerce(spec, xeto.Spec.type$));
    instanceNames.each((instanceName) => {
      this$.libs().each((lib) => {
        this$.merge(acc, lib.instance(instanceName, false));
        return;
      });
      return;
    });
    return haystack.Etc.dictFromMap(acc);
  }

  xmetaEnum(qname,checked) {
    if (checked === undefined) checked = true;
    const this$ = this;
    let spec = this.#ns.spec(qname, checked);
    if ((spec == null || !spec.isEnum())) {
      return null;
    }
    ;
    let self$ = this.xmeta(qname);
    let accByKey = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Map"));
    let nameToKey = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    spec.enum().each((item,key) => {
      nameToKey.set(item.name(), key);
      accByKey.set(key, haystack.Etc.dictToMap(sys.ObjUtil.coerce(item.meta(), haystack.Dict.type$.toNullable())));
      return;
    });
    let enumInstanceName = sys.Str.plus(this.instanceName(sys.ObjUtil.coerce(spec, xeto.Spec.type$)), "-enum");
    this.libs().each((lib) => {
      let xmeta = lib.instance(enumInstanceName, false);
      if (xmeta == null) {
        return;
      }
      ;
      xmeta.each((v,n) => {
        let key = nameToKey.get(n);
        if (key == null) {
          return;
        }
        ;
        let acc = accByKey.get(sys.ObjUtil.coerce(key, sys.Str.type$));
        if (acc == null) {
          return;
        }
        ;
        this$.merge(sys.ObjUtil.coerce(acc, sys.Type.find("[sys::Str:sys::Obj]")), sys.ObjUtil.as(v, xeto.Dict.type$));
        return;
      });
      return;
    });
    let byKey = accByKey.map((map) => {
      return haystack.Etc.dictFromMap(sys.ObjUtil.coerce(map, sys.Type.find("[sys::Str:sys::Obj]")));
    }, xeto.Dict.type$);
    return MEnumXMeta.make(sys.ObjUtil.coerce(spec.enum(), MEnum.type$), sys.ObjUtil.coerce(self$, xeto.Dict.type$), sys.ObjUtil.coerce(byKey, sys.Type.find("[sys::Str:xeto::Dict]")));
  }

  addInheritanceInstanceNames(acc,x) {
    const this$ = this;
    let name = this.instanceName(x);
    acc.set(name, name);
    if ((x.isCompound() && x.isAnd())) {
      x.ofs().each((of$) => {
        this$.addInheritanceInstanceNames(acc, of$);
        return;
      });
    }
    else {
      if (x.base() != null) {
        this.addInheritanceInstanceNames(acc, sys.ObjUtil.coerce(x.base(), xeto.Spec.type$));
      }
      ;
    }
    ;
    return;
  }

  instanceName(spec) {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("xmeta-", spec.lib().name()), "-"), spec.name());
  }

  merge(acc,xmeta) {
    const this$ = this;
    if (xmeta == null) {
      return;
    }
    ;
    xmeta.each((v,n) => {
      if ((acc.get(n) == null && sys.ObjUtil.compareNE(n, "id") && sys.ObjUtil.compareNE(n, "spec"))) {
        acc.set(n, v);
      }
      ;
      return;
    });
    return;
  }

  libs$Once() {
    const this$ = this;
    let acc = sys.List.make(xeto.Lib.type$);
    this.#ns.entriesList().each((entry) => {
      if (!entry.status().isLoaded()) {
        return;
      }
      ;
      let lib = entry.get();
      if (!lib.hasXMeta()) {
        return;
      }
      ;
      acc.add(lib);
      return;
    });
    return acc;
  }

}

class XetoUtil extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoUtil.type$; }

  static #reservedLibMetaNames$Store = undefined;

  static reservedLibMetaNames$Store(it) { if (it === undefined) return XetoUtil.#reservedLibMetaNames$Store; else XetoUtil.#reservedLibMetaNames$Store = it; }

  static #reservedSpecMetaNames$Store = undefined;

  static reservedSpecMetaNames$Store(it) { if (it === undefined) return XetoUtil.#reservedSpecMetaNames$Store; else XetoUtil.#reservedSpecMetaNames$Store = it; }

  static isLibName(n) {
    return XetoUtil.libNameErr(n) == null;
  }

  static libNameErr(n) {
    if (sys.Str.isEmpty(n)) {
      return "Lib name cannot be the empty string";
    }
    ;
    if (!sys.Int.isLower(sys.Str.get(n, 0))) {
      return "Lib name must start with lowercase letter";
    }
    ;
    if ((!sys.Int.isLower(sys.Str.get(n, -1)) && !sys.Int.isDigit(sys.Str.get(n, -1)))) {
      return "Lib name must end with lowercase letter or digit";
    }
    ;
    for (let i = 0; sys.ObjUtil.compareLT(i, sys.Str.size(n)); i = sys.Int.increment(i)) {
      let ch = sys.Str.get(n, i);
      let prev = ((this$) => { if (sys.ObjUtil.equals(i, 0)) return 0; return sys.Str.get(n, sys.Int.minus(i, 1)); })(this);
      if (sys.Int.isUpper(ch)) {
        return "Lib name must be all lowercase";
      }
      ;
      if ((sys.ObjUtil.equals(prev, 46) && !sys.Int.isLower(ch))) {
        return "Lib dotted name sections must begin with lowercase letter";
      }
      ;
      if ((sys.Int.isLower(ch) || sys.Int.isDigit(ch))) {
        continue;
      }
      ;
      if ((sys.ObjUtil.equals(ch, 95) || sys.ObjUtil.equals(ch, 46))) {
        if ((sys.Int.isLower(prev) || sys.Int.isDigit(prev))) {
          continue;
        }
        ;
        return sys.Str.plus("Invalid adjacent chars at pos ", sys.ObjUtil.coerce(i, sys.Obj.type$.toNullable()));
      }
      ;
      if (sys.ObjUtil.equals(ch, 32)) {
        return "Lib name cannot contain spaces";
      }
      ;
      return sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid lib name char '", sys.Int.toChar(ch)), "' 0x"), sys.Int.toHex(ch));
    }
    ;
    return null;
  }

  static isSpecName(n) {
    const this$ = this;
    if (sys.Str.isEmpty(n)) {
      return false;
    }
    ;
    let ch = sys.Str.get(n, 0);
    if (sys.ObjUtil.equals(ch, 95)) {
      return sys.Str.all(n, (c,i) => {
        return (sys.ObjUtil.equals(i, 0) || sys.Int.isDigit(c));
      });
    }
    ;
    if (!sys.Int.isAlpha(ch)) {
      return false;
    }
    ;
    return sys.Str.all(n, (c) => {
      return (sys.Int.isAlphaNum(c) || sys.ObjUtil.equals(c, 95));
    });
  }

  static isAutoName(n) {
    if ((sys.ObjUtil.compareLT(sys.Str.size(n), 2) || sys.ObjUtil.compareNE(sys.Str.get(n, 0), 95) || !sys.Int.isDigit(sys.Str.get(n, 1)))) {
      return false;
    }
    ;
    for (let i = 2; sys.ObjUtil.compareLT(i, sys.Str.size(n)); i = sys.Int.increment(i)) {
      if (!sys.Int.isDigit(sys.Str.get(n, i))) {
        return false;
      }
      ;
    }
    ;
    return true;
  }

  static camelToDotted(name,dot) {
    if (dot === undefined) dot = 46;
    const this$ = this;
    let s = sys.StrBuf.make(sys.Int.plus(sys.Str.size(name), 4));
    sys.Str.each(name, (char) => {
      if (sys.Int.isUpper(char)) {
        if (!s.isEmpty()) {
          s.addChar(dot);
        }
        ;
        s.addChar(sys.Int.lower(char));
      }
      else {
        s.addChar(char);
      }
      ;
      return;
    });
    return s.toStr();
  }

  static camelToDashed(name) {
    return XetoUtil.camelToDotted(name, 45);
  }

  static dottedToCamel(name,dot) {
    if (dot === undefined) dot = 46;
    const this$ = this;
    let s = sys.StrBuf.make(sys.Str.size(name));
    let capitalize = false;
    sys.Str.each(name, (char) => {
      if (sys.ObjUtil.equals(char, dot)) {
        (capitalize = true);
      }
      else {
        if (capitalize) {
          s.addChar(sys.Int.upper(char));
          (capitalize = false);
        }
        else {
          s.addChar(char);
        }
        ;
      }
      ;
      return;
    });
    return s.toStr();
  }

  static dashedToCamel(name) {
    return XetoUtil.dottedToCamel(name, 45);
  }

  static qnameToName(qname) {
    let s = sys.ObjUtil.toStr(qname);
    let colon = sys.Str.index(s, ":");
    if ((colon == null || sys.ObjUtil.compareLT(colon, 1) || sys.ObjUtil.compareGE(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 2), sys.Str.size(s)) || sys.ObjUtil.compareNE(sys.Str.get(s, sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1)), 58))) {
      return null;
    }
    ;
    return sys.Str.getRange(s, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 2), -1));
  }

  static qnameToLib(qname) {
    let s = sys.ObjUtil.toStr(qname);
    let colon = sys.Str.index(s, ":");
    if ((colon == null || sys.ObjUtil.compareLT(colon, 1) || sys.ObjUtil.compareGE(sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 2), sys.Str.size(s)) || sys.ObjUtil.compareNE(sys.Str.get(s, sys.Int.plus(sys.ObjUtil.coerce(colon, sys.Int.type$), 1)), 58))) {
      return null;
    }
    ;
    return sys.Str.getRange(s, sys.Range.make(0, sys.ObjUtil.coerce(colon, sys.Int.type$), true));
  }

  static qnamesToLibs(qnames) {
    const this$ = this;
    if (qnames.isEmpty()) {
      return sys.ObjUtil.coerce(sys.Str.type$.emptyList(), sys.Type.find("sys::Str[]"));
    }
    ;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    qnames.each((qname) => {
      let lib = XetoUtil.qnameToLib(qname);
      if (lib != null) {
        acc.set(sys.ObjUtil.coerce(lib, sys.Str.type$), sys.ObjUtil.coerce(lib, sys.Str.type$));
      }
      ;
      return;
    });
    return acc.vals();
  }

  static dataToLibs(recs) {
    const this$ = this;
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str"));
    recs.each((row) => {
      let spec = sys.ObjUtil.as(row.get("spec"), haystack.Ref.type$);
      if (spec == null) {
        return;
      }
      ;
      let libName = XetoUtil.qnameToLib(spec.toStr());
      if (libName == null) {
        return;
      }
      ;
      acc.set(sys.ObjUtil.coerce(libName, sys.Str.type$), sys.ObjUtil.coerce(libName, sys.Str.type$));
      return;
    });
    return acc.keys();
  }

  static isReservedSpecName(n) {
    if (sys.ObjUtil.equals(n, "pragma")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "index")) {
      return true;
    }
    ;
    return false;
  }

  static isReservedInstanceName(n) {
    if (sys.ObjUtil.equals(n, "pragma")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "index")) {
      return true;
    }
    ;
    if (sys.Str.startsWith(n, "doc-")) {
      return true;
    }
    ;
    if (sys.Str.startsWith(n, "_")) {
      return true;
    }
    ;
    if (sys.Str.startsWith(n, "~")) {
      return true;
    }
    ;
    return false;
  }

  static isReservedLibMetaName(n) {
    return (XetoUtil.reservedLibMetaNames().containsKey(n) || sys.Str.startsWith(n, "xeto"));
  }

  static isReservedSpecMetaName(n) {
    return (XetoUtil.reservedSpecMetaNames().containsKey(n) || sys.Str.startsWith(n, "xeto"));
  }

  static isReservedMetaName(n) {
    return (XetoUtil.isReservedSpecMetaName(n) || XetoUtil.isReservedLibMetaName(n) || sys.Str.startsWith(n, "xeto"));
  }

  static reservedLibMetaNames() {
    if (XetoUtil.reservedLibMetaNames$Store() === undefined) {
      XetoUtil.reservedLibMetaNames$Store(XetoUtil.reservedLibMetaNames$Once());
    }
    ;
    return sys.ObjUtil.coerce(XetoUtil.reservedLibMetaNames$Store(), sys.Type.find("[sys::Str:sys::Str]"));
  }

  static reservedSpecMetaNames() {
    if (XetoUtil.reservedSpecMetaNames$Store() === undefined) {
      XetoUtil.reservedSpecMetaNames$Store(XetoUtil.reservedSpecMetaNames$Once());
    }
    ;
    return sys.ObjUtil.coerce(XetoUtil.reservedSpecMetaNames$Store(), sys.Type.find("[sys::Str:sys::Str]"));
  }

  static srcToWorkDir(v) {
    let srcPath = v.file().path();
    if ((sys.ObjUtil.compareLT(srcPath.size(), 4) || sys.ObjUtil.compareNE(srcPath.get(-3), "src") || sys.ObjUtil.compareNE(srcPath.get(-2), "xeto") || sys.ObjUtil.compareNE(srcPath.get(-1), v.name()))) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Non-standard src dir: ", v), " ["), v.file()), "]"));
    }
    ;
    return v.file().plus(sys.Uri.fromStr("../../../")).normalize();
  }

  static srcToLibDir(v) {
    return XetoUtil.srcToWorkDir(v).plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("lib/xeto/", v.name()), "/")));
  }

  static srcToLibZip(v) {
    return XetoUtil.srcToWorkDir(v).plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("lib/xeto/", v.name()), "/"), v.name()), "-"), v.version()), ".xetolib")));
  }

  static toFloat(x) {
    if (x == null) {
      return sys.ObjUtil.coerce(x, sys.Float.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(x, haystack.Number.type$)) {
      return sys.ObjUtil.coerce(sys.ObjUtil.coerce(x, haystack.Number.type$).toFloat(), sys.Float.type$.toNullable());
    }
    ;
    if (sys.ObjUtil.is(x, sys.Num.type$)) {
      return sys.ObjUtil.coerce(sys.Num.toFloat(sys.ObjUtil.coerce(x, sys.Num.type$)), sys.Float.type$.toNullable());
    }
    ;
    return null;
  }

  static optBool(opts,name,def) {
    let v = ((this$) => { let $_u148 = opts; if ($_u148 == null) return null; return opts.get(name); })(this);
    if (v === haystack.Marker.val()) {
      return true;
    }
    ;
    if (sys.ObjUtil.is(v, sys.Bool.type$)) {
      return sys.ObjUtil.coerce(v, sys.Bool.type$);
    }
    ;
    return def;
  }

  static optInt(opts,name,def) {
    let v = ((this$) => { let $_u149 = opts; if ($_u149 == null) return null; return opts.get(name); })(this);
    if (sys.ObjUtil.is(v, sys.Int.type$)) {
      return sys.ObjUtil.coerce(v, sys.Int.type$);
    }
    ;
    if (sys.ObjUtil.is(v, haystack.Number.type$)) {
      return sys.ObjUtil.coerce(v, haystack.Number.type$).toInt();
    }
    ;
    return def;
  }

  static optLog(opts,name) {
    if (opts == null) {
      return null;
    }
    ;
    let x = opts.get(name, null);
    if (x == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(x, sys.Unsafe.type$)) {
      (x = sys.ObjUtil.coerce(x, sys.Unsafe.type$).val());
    }
    ;
    if (sys.ObjUtil.is(x, sys.Type.find("sys::Func"))) {
      return sys.ObjUtil.coerce(x, sys.Type.find("|xeto::XetoLogRec->sys::Void|?"));
    }
    ;
    throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Expecting |XetoLogRec| func for ", sys.Str.toCode(name)), " ["), sys.ObjUtil.typeof(x)), "]"));
  }

  static optFidelity(opts) {
    if (XetoUtil.optBool(opts, "haystack", false)) {
      return XetoFidelity.haystack();
    }
    ;
    return XetoFidelity.full();
  }

  static addOwnMeta(acc,own) {
    const this$ = this;
    if (own.isEmpty()) {
      return;
    }
    ;
    own.each((v,n) => {
      if (v === haystack.Remove.val()) {
        acc.remove(n);
      }
      else {
        acc.set(n, v);
      }
      ;
      return;
    });
    return;
  }

  static isa(a,b,isTop) {
    if (isTop === undefined) isTop = true;
    const this$ = this;
    if (a === b) {
      return true;
    }
    ;
    if ((b.isNone() && a.isMaybe() && isTop)) {
      return true;
    }
    ;
    if (a.isAnd()) {
      let ofs = a.cofs();
      if ((ofs != null && ofs.any((x) => {
        return x.cisa(b);
      }))) {
        return true;
      }
      ;
    }
    ;
    if (a.isOr()) {
      let ofs = a.cofs();
      if ((ofs != null && ofs.all((x) => {
        return x.cisa(b);
      }))) {
        return true;
      }
      ;
    }
    ;
    if (b.isOr()) {
      let ofs = b.cofs();
      if ((ofs != null && ofs.any((x) => {
        return a.cisa(x);
      }))) {
        return true;
      }
      ;
    }
    ;
    if (a.cbase() != null) {
      return XetoUtil.isa(sys.ObjUtil.coerce(a.cbase(), CSpec.type$), b, false);
    }
    ;
    return false;
  }

  static excludeSupertypes(list) {
    const this$ = this;
    if (sys.ObjUtil.compareLE(list.size(), 1)) {
      return list.dup();
    }
    ;
    let acc = sys.List.make(list.of(), list.size());
    list.each((spec) => {
      let hasSubtypes = list.any((x) => {
        return (x !== spec && x.cisa(spec));
      });
      if (!hasSubtypes) {
        acc.add(spec);
      }
      ;
      return;
    });
    return sys.ObjUtil.coerce(acc, sys.Type.find("xetoEnv::CSpec[]"));
  }

  static commonSupertype(specs) {
    const this$ = this;
    if (specs.isEmpty()) {
      throw sys.ArgErr.make("Must pass at least one spec");
    }
    ;
    if (sys.ObjUtil.equals(specs.size(), 1)) {
      return specs.get(0);
    }
    ;
    let best = specs.first();
    specs.eachRange(sys.Range.make(1, -1), (spec) => {
      (best = XetoUtil.commonSupertypeBetween(sys.ObjUtil.coerce(best, xeto.Spec.type$), spec));
      return;
    });
    return sys.ObjUtil.coerce(best, xeto.Spec.type$);
  }

  static commonSupertypeBetween(a,b) {
    if (a === b) {
      return a;
    }
    ;
    if (a.isa(b)) {
      return b;
    }
    ;
    if (b.isa(a)) {
      return a;
    }
    ;
    if (a.base() == null) {
      return a;
    }
    ;
    if (b.base() == null) {
      return b;
    }
    ;
    let abase = ((this$) => { if (a.isCompound()) return a.ofs().first(); return a.base(); })(this);
    let bbase = ((this$) => { if (b.isCompound()) return b.ofs().first(); return b.base(); })(this);
    return XetoUtil.commonSupertypeBetween(sys.ObjUtil.coerce(abase, xeto.Spec.type$), sys.ObjUtil.coerce(bbase, xeto.Spec.type$));
  }

  static toHaystack(x) {
    if (x == null) {
      return x;
    }
    ;
    let kind = haystack.Kind.fromVal(x, false);
    if (kind != null) {
      if (kind.isDict()) {
        return XetoUtil.toHaystackDict(sys.ObjUtil.coerce(x, xeto.Dict.type$));
      }
      ;
      if (kind.isList()) {
        return XetoUtil.toHaystackList(sys.ObjUtil.coerce(x, sys.Type.find("sys::List")));
      }
      ;
      return x;
    }
    ;
    if (sys.ObjUtil.is(x, sys.Num.type$)) {
      return haystack.Number.makeNum(sys.ObjUtil.coerce(x, sys.Num.type$));
    }
    ;
    return sys.ObjUtil.toStr(x);
  }

  static toHaystackDict(x) {
    const this$ = this;
    return x.map((v,n) => {
      return sys.ObjUtil.coerce(XetoUtil.toHaystack(v), sys.Obj.type$);
    }, sys.Obj.type$);
  }

  static toHaystackList(x) {
    const this$ = this;
    let of$ = sys.Obj.type$;
    if (x.of().isNullable()) {
      (of$ = of$.toNullable());
    }
    ;
    let acc = sys.List.make(of$, x.size());
    x.each((v) => {
      acc.add(sys.ObjUtil.coerce(XetoUtil.toHaystack(v), sys.Obj.type$));
      return;
    });
    return acc;
  }

  static instantiate(ns,spec,opts) {
    const this$ = this;
    let meta = spec.m().meta();
    if ((meta.has("abstract") && opts.missing("abstract"))) {
      throw sys.Err.make(sys.Str.plus("Spec is abstract: ", spec.qname()));
    }
    ;
    if (spec.isNone()) {
      return null;
    }
    ;
    if (spec.type().isScalar()) {
      return XetoUtil.instantiateScalar(ns, spec, opts);
    }
    ;
    if (spec === ns.sys().dict()) {
      return haystack.Etc.dict0();
    }
    ;
    if (spec.isList()) {
      return XetoUtil.instantiateList(ns, spec, opts);
    }
    ;
    let isGraph = opts.has("graph");
    let acc = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    acc.ordered(true);
    let id = opts.get("id");
    if ((id == null && isGraph)) {
      (id = haystack.Ref.gen());
    }
    ;
    if (id != null) {
      acc.set("id", sys.ObjUtil.coerce(id, sys.Obj.type$));
    }
    ;
    acc.set("spec", spec.type()._id());
    let isSlot = (spec.parent() != null && !spec.parent().isQuery());
    if (!isSlot) {
      acc.set("dis", ((this$) => { if (XetoUtil.isAutoName(spec.name())) return spec.base().name(); return spec.name(); })(this));
    }
    ;
    spec.slots().each((slot) => {
      if (slot.isMaybe()) {
        return;
      }
      ;
      if (slot.isQuery()) {
        return;
      }
      ;
      if (slot.isFunc()) {
        return;
      }
      ;
      if ((slot.type() === ns.sys().ref() && sys.ObjUtil.compareNE(slot.name(), "enum"))) {
        return;
      }
      ;
      if (sys.ObjUtil.equals(slot.name(), "enum")) {
        return acc.setNotNull("enum", XetoUtil.instantiateEnumDefault(sys.ObjUtil.coerce(slot, XetoSpec.type$)));
      }
      ;
      acc.set(slot.name(), sys.ObjUtil.coerce(XetoUtil.instantiate(ns, sys.ObjUtil.coerce(slot, XetoSpec.type$), opts), sys.Obj.type$));
      return;
    });
    let parent = sys.ObjUtil.as(opts.get("parent"), xeto.Dict.type$);
    if ((parent != null && sys.ObjUtil.is(parent.get("id"), haystack.Ref.type$))) {
      let parentId = sys.ObjUtil.coerce(parent.get("id"), haystack.Ref.type$);
      if (parent.has("equip")) {
        acc.set("equipRef", parentId);
      }
      ;
      if (parent.has("site")) {
        acc.set("siteRef", parentId);
      }
      ;
      if (parent.has("siteRef")) {
        acc.set("siteRef", sys.ObjUtil.coerce(parent.get("siteRef"), sys.Obj.type$));
      }
      ;
    }
    ;
    let dict = haystack.Etc.dictFromMap(acc);
    if (spec.binding().isDict()) {
      (dict = sys.ObjUtil.coerce(spec.binding().decodeDict(dict), haystack.Dict.type$));
    }
    ;
    if (opts.has("graph")) {
      return XetoUtil.instantiateGraph(ns, spec, opts, dict);
    }
    else {
      return dict;
    }
    ;
  }

  static instantiateEnumDefault(slot) {
    let val = slot.get("val");
    if (val == null) {
      return null;
    }
    ;
    if (sys.ObjUtil.is(val, haystack.Ref.type$)) {
      return val;
    }
    ;
    let s = sys.ObjUtil.toStr(val);
    if (!sys.Str.isEmpty(s)) {
      return s;
    }
    ;
    return null;
  }

  static instantiateList(ns,spec,opts) {
    const this$ = this;
    let of$ = spec.of(false);
    let listOf = ((this$) => { if (of$ == null) return sys.Obj.type$; return of$.fantomType(); })(this);
    if ((of$ != null && of$.isMaybe())) {
      (listOf = of$.base().fantomType().toNullable());
    }
    ;
    let acc = sys.List.make(listOf, 0);
    let val = sys.ObjUtil.as(spec.meta().get("val"), sys.Type.find("sys::List"));
    if (val != null) {
      let fidelity = XetoUtil.optFidelity(opts);
      acc.capacity(val.size());
      val.each((v) => {
        acc.add(sys.ObjUtil.coerce(fidelity.coerce(v), sys.Obj.type$));
        return;
      });
    }
    ;
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(acc), sys.Type.find("sys::List"));
  }

  static instantiateScalar(ns,spec,opts) {
    let hay = XetoUtil.optBool(opts, "haystack", false);
    let x = ((this$) => { let $_u154 = spec.meta().get("val"); if ($_u154 != null) return $_u154; return spec.type().meta().get("val"); })(this);
    if (x == null) {
      (x = "");
    }
    ;
    if (hay) {
      (x = XetoUtil.toHaystack(x));
    }
    ;
    return sys.ObjUtil.coerce(x, sys.Obj.type$);
  }

  static instantiateGraph(ns,spec,opts,dict) {
    const this$ = this;
    (opts = haystack.Etc.dictSet(sys.ObjUtil.coerce(opts, haystack.Dict.type$.toNullable()), "parent", dict));
    let graph = sys.List.make(xeto.Dict.type$);
    graph.add(dict);
    spec.slots().each((slot) => {
      if (!slot.isQuery()) {
        return;
      }
      ;
      if (slot.slots().isEmpty()) {
        return;
      }
      ;
      slot.slots().each((x) => {
        let kids = XetoUtil.instantiate(ns, sys.ObjUtil.coerce(x, XetoSpec.type$), opts);
        if (!sys.ObjUtil.is(kids, sys.Type.find("sys::List"))) {
          return;
        }
        ;
        graph.addAll(sys.ObjUtil.coerce(kids, sys.Type.find("xeto::Dict[]")));
        return;
      });
      return;
    });
    return graph;
  }

  static make() {
    const $self = new XetoUtil();
    XetoUtil.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static reservedLibMetaNames$Once() {
    return sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).setList(sys.List.make(sys.Str.type$, ["id", "spec", "loaded", "data", "instances", "name", "lib", "loc", "slots", "specs", "types", "xeto"]));
  }

  static reservedSpecMetaNames$Once() {
    return sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Str")).setList(sys.List.make(sys.Str.type$, ["id", "base", "type", "spec", "slot", "slots", "class", "def", "is", "lib", "loc", "name", "parent", "qname", "super", "supers", "xeto"]));
  }

  static static$init() {
    return;
  }

}

class XetoFidelity extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoFidelity.type$; }

  static full() { return XetoFidelity.vals().get(0); }

  static haystack() { return XetoFidelity.vals().get(1); }

  static json() { return XetoFidelity.vals().get(2); }

  static #vals = undefined;

  coerce(x) {
    if (this === XetoFidelity.haystack()) {
      return XetoUtil.toHaystack(x);
    }
    ;
    if (this === XetoFidelity.json()) {
      throw sys.Err.make("JSON fidelity not used yet");
    }
    ;
    return x;
  }

  static make($ordinal,$name) {
    const $self = new XetoFidelity();
    XetoFidelity.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(XetoFidelity.type$, XetoFidelity.vals(), name$, checked);
  }

  static vals() {
    if (XetoFidelity.#vals == null) {
      XetoFidelity.#vals = sys.List.make(XetoFidelity.type$, [
        XetoFidelity.make(0, "full", ),
        XetoFidelity.make(1, "haystack", ),
        XetoFidelity.make(2, "json", ),
      ]).toImmutable();
    }
    return XetoFidelity.#vals;
  }

  static static$init() {
    const $_u155 = XetoFidelity.vals();
    if (true) {
    }
    ;
    return;
  }

}

const p = sys.Pod.add$('xetoEnv');
const xp = sys.Param.noParams$();
let m;
CNamespace.type$ = p.am$('CNamespace','sys::Obj',[],{'sys::Js':""},8449,CNamespace);
CNode.type$ = p.am$('CNode','sys::Obj',[],{'sys::Js':""},8449,CNode);
CSpec.type$ = p.am$('CSpec','sys::Obj',['xetoEnv::CNode'],{'sys::Js':""},8449,CSpec);
CompFactory.type$ = p.at$('CompFactory','sys::Obj',[],{'sys::Js':""},128,CompFactory);
CompSpiInit.type$ = p.at$('CompSpiInit','sys::Obj',[],{'sys::Js':""},130,CompSpiInit);
MCompSpi.type$ = p.at$('MCompSpi','sys::Obj',['xeto::CompSpi'],{'sys::Js':""},8192,MCompSpi);
CompSpaceActor.type$ = p.at$('CompSpaceActor','concurrent::Actor',[],{},8194,CompSpaceActor);
CompSpaceActorState.type$ = p.at$('CompSpaceActorState','sys::Obj',[],{'sys::Js':""},128,CompSpaceActorState);
CompSpaceFeed.type$ = p.at$('CompSpaceFeed','sys::Obj',[],{'sys::Js':""},128,CompSpaceFeed);
CompSpace.type$ = p.at$('CompSpace','sys::Obj',['xeto::AbstractCompSpace'],{'sys::Js':""},8192,CompSpace);
MCompContext.type$ = p.at$('MCompContext','sys::Obj',['xeto::CompContext'],{'sys::Js':""},128,MCompContext);
CompListeners.type$ = p.at$('CompListeners','sys::Obj',[],{'sys::Js':""},128,CompListeners);
CompSlotListener.type$ = p.at$('CompSlotListener','sys::Obj',[],{'sys::Js':""},129,CompSlotListener);
CompOnChangeListener.type$ = p.at$('CompOnChangeListener','xetoEnv::CompSlotListener',[],{'sys::Js':""},160,CompOnChangeListener);
CompOnCallListener.type$ = p.at$('CompOnCallListener','xetoEnv::CompSlotListener',[],{'sys::Js':""},160,CompOnCallListener);
CompUtil.type$ = p.at$('CompUtil','sys::Obj',[],{'sys::Js':""},8192,CompUtil);
Exporter.type$ = p.at$('Exporter','sys::Obj',[],{'sys::Js':""},8193,Exporter);
JsonExporter.type$ = p.at$('JsonExporter','xetoEnv::Exporter',[],{'sys::Js':""},8192,JsonExporter);
RdfExporter.type$ = p.at$('RdfExporter','xetoEnv::Exporter',[],{'sys::Js':""},8192,RdfExporter);
GridExporter.type$ = p.at$('GridExporter','xetoEnv::Exporter',[],{'sys::Js':""},8192,GridExporter);
MDictMerge1.type$ = p.at$('MDictMerge1','sys::Obj',['haystack::Dict'],{'sys::NoDoc':"",'sys::Js':""},8194,MDictMerge1);
MSpec.type$ = p.at$('MSpec','sys::Obj',[],{'sys::Js':""},8194,MSpec);
MGlobal.type$ = p.at$('MGlobal','xetoEnv::MSpec',[],{'sys::Js':""},8226,MGlobal);
MSlots.type$ = p.at$('MSlots','sys::Obj',['xeto::SpecSlots'],{'sys::Js':""},8226,MSlots);
MSlotsDict.type$ = p.at$('MSlotsDict','sys::Obj',['haystack::Dict'],{'sys::Js':""},130,MSlotsDict);
MSpecFlags.type$ = p.at$('MSpecFlags','sys::Obj',[],{'sys::Js':""},8194,MSpecFlags);
MMetaSpec.type$ = p.at$('MMetaSpec','xetoEnv::MSpec',[],{'sys::Js':""},8226,MMetaSpec);
MSys.type$ = p.at$('MSys','sys::Obj',[],{'sys::Js':""},8194,MSys);
MNameDict.type$ = p.at$('MNameDict','sys::Obj',['haystack::Dict'],{'sys::Js':""},8194,MNameDict);
MSpecArgs.type$ = p.at$('MSpecArgs','sys::Obj',[],{'sys::Js':""},8194,MSpecArgs);
MSpecArgsOf.type$ = p.at$('MSpecArgsOf','xetoEnv::MSpecArgs',[],{'sys::Js':""},8194,MSpecArgsOf);
MSpecArgsOfs.type$ = p.at$('MSpecArgsOfs','xetoEnv::MSpecArgs',[],{'sys::Js':""},8194,MSpecArgsOfs);
MChoice.type$ = p.at$('MChoice','sys::Obj',['xeto::SpecChoice'],{'sys::Js':""},8226,MChoice);
MType.type$ = p.at$('MType','xetoEnv::MSpec',[],{'sys::Js':""},8226,MType);
MLib.type$ = p.at$('MLib','sys::Obj',[],{'sys::Js':""},8226,MLib);
MLibFlags.type$ = p.at$('MLibFlags','sys::Obj',[],{'sys::Js':""},8194,MLibFlags);
XetoLib.type$ = p.at$('XetoLib','sys::Obj',['xeto::Lib','haystack::Dict'],{'sys::Js':""},8226,XetoLib);
MLibFiles.type$ = p.at$('MLibFiles','sys::Obj',['xeto::LibFiles'],{'sys::Js':""},8195,MLibFiles);
UnsupportedLibFiles.type$ = p.at$('UnsupportedLibFiles','xetoEnv::MLibFiles',[],{'sys::Js':""},8194,UnsupportedLibFiles);
EmptyLibFiles.type$ = p.at$('EmptyLibFiles','xetoEnv::MLibFiles',[],{'sys::Js':""},8194,EmptyLibFiles);
DirLibFiles.type$ = p.at$('DirLibFiles','xetoEnv::MLibFiles',[],{'sys::Js':""},8194,DirLibFiles);
ZipLibFiles.type$ = p.at$('ZipLibFiles','xetoEnv::MLibFiles',[],{'sys::Js':""},8194,ZipLibFiles);
XetoSpec.type$ = p.at$('XetoSpec','sys::Obj',['xeto::Spec','haystack::Dict','xetoEnv::CSpec'],{'sys::Js':""},8194,XetoSpec);
MEnum.type$ = p.at$('MEnum','sys::Obj',['xeto::SpecEnum'],{'sys::Js':""},8226,MEnum);
MEnumXMeta.type$ = p.at$('MEnumXMeta','sys::Obj',['xeto::SpecEnum'],{'sys::Js':""},8226,MEnumXMeta);
XetoBinaryConst.type$ = p.am$('XetoBinaryConst','sys::Obj',[],{'sys::Js':""},8449,XetoBinaryConst);
XetoBinaryReader.type$ = p.at$('XetoBinaryReader','sys::Obj',['xetoEnv::XetoBinaryConst','xeto::NameDictReader'],{'sys::Js':""},8192,XetoBinaryReader);
XetoBinaryIO.type$ = p.at$('XetoBinaryIO','sys::Obj',[],{'sys::Js':""},8194,XetoBinaryIO);
XetoBinaryWriter.type$ = p.at$('XetoBinaryWriter','sys::Obj',['xetoEnv::XetoBinaryConst'],{'sys::Js':""},8192,XetoBinaryWriter);
MInterfaces.type$ = p.at$('MInterfaces','sys::Obj',[],{'sys::Js':""},130,MInterfaces);
InterfaceMethod.type$ = p.at$('InterfaceMethod','sys::Obj',[],{'sys::Js':""},130,InterfaceMethod);
MNamespace.type$ = p.at$('MNamespace','sys::Obj',['xeto::LibNamespace','xetoEnv::CNamespace'],{'sys::Js':""},8195,MNamespace);
MLibEntry.type$ = p.at$('MLibEntry','sys::Obj',[],{'sys::Js':""},130,MLibEntry);
RemoteNamespace.type$ = p.at$('RemoteNamespace','xetoEnv::MNamespace',[],{'sys::Js':""},8194,RemoteNamespace);
RemoteLibLoader.type$ = p.am$('RemoteLibLoader','sys::Obj',[],{'sys::Js':""},8451,RemoteLibLoader);
RemoteLibVersion.type$ = p.at$('RemoteLibVersion','sys::Obj',['xeto::LibVersion'],{'sys::Js':""},130,RemoteLibVersion);
RSpec.type$ = p.at$('RSpec','sys::Obj',['xetoEnv::CSpec','xeto::NameDictReader'],{'sys::Js':""},128,RSpec);
RSpecRef.type$ = p.at$('RSpecRef','sys::Obj',[],{'sys::Js':""},130,RSpecRef);
RemoteLoader.type$ = p.at$('RemoteLoader','sys::Obj',[],{'sys::Js':""},128,RemoteLoader);
CheckVal.type$ = p.at$('CheckVal','sys::Obj',[],{'sys::Js':""},8194,CheckVal);
Fitter.type$ = p.at$('Fitter','sys::Obj',[],{'sys::Js':""},128,Fitter);
ExplainFitter.type$ = p.at$('ExplainFitter','xetoEnv::Fitter',[],{'sys::Js':""},128,ExplainFitter);
XetoCompilerErr.type$ = p.at$('XetoCompilerErr','util::FileLocErr',[],{'sys::Js':""},8194,XetoCompilerErr);
NotReadyErr.type$ = p.at$('NotReadyErr','sys::Err',[],{'sys::Js':""},8194,NotReadyErr);
Printer.type$ = p.at$('Printer','sys::Obj',[],{'sys::Js':""},8192,Printer);
PrinterSpecMode.type$ = p.at$('PrinterSpecMode','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,PrinterSpecMode);
PrinterTheme.type$ = p.at$('PrinterTheme','sys::Obj',[],{'sys::Js':""},8194,PrinterTheme);
DependSolver.type$ = p.at$('DependSolver','sys::Obj',[],{},8192,DependSolver);
Query.type$ = p.at$('Query','sys::Obj',[],{'sys::Js':""},128,Query);
SpecBindings.type$ = p.at$('SpecBindings','sys::Obj',[],{'sys::Js':""},8194,SpecBindings);
SpecBindingLoader.type$ = p.at$('SpecBindingLoader','sys::Obj',[],{'sys::Js':""},8194,SpecBindingLoader);
PodBindingLoader.type$ = p.at$('PodBindingLoader','xetoEnv::SpecBindingLoader',[],{'sys::Js':""},8194,PodBindingLoader);
ObjBinding.type$ = p.at$('ObjBinding','xeto::SpecBinding',[],{'sys::Js':""},130,ObjBinding);
DictBinding.type$ = p.at$('DictBinding','xeto::SpecBinding',[],{'sys::Js':""},8194,DictBinding);
ScalarBinding.type$ = p.at$('ScalarBinding','xeto::SpecBinding',[],{'sys::Js':""},8194,ScalarBinding);
CompBinding.type$ = p.at$('CompBinding','xetoEnv::DictBinding',[],{'sys::Js':""},8194,CompBinding);
ImplDictBinding.type$ = p.at$('ImplDictBinding','xetoEnv::DictBinding',[],{'sys::Js':""},8194,ImplDictBinding);
SingletonBinding.type$ = p.at$('SingletonBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,SingletonBinding);
GenericScalarBinding.type$ = p.at$('GenericScalarBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},8194,GenericScalarBinding);
BoolBinding.type$ = p.at$('BoolBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,BoolBinding);
BufBinding.type$ = p.at$('BufBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,BufBinding);
CompLayoutBinding.type$ = p.at$('CompLayoutBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,CompLayoutBinding);
CoordBinding.type$ = p.at$('CoordBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,CoordBinding);
DateBinding.type$ = p.at$('DateBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,DateBinding);
DateTimeBinding.type$ = p.at$('DateTimeBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,DateTimeBinding);
DurationBinding.type$ = p.at$('DurationBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,DurationBinding);
FilterBinding.type$ = p.at$('FilterBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,FilterBinding);
FloatBinding.type$ = p.at$('FloatBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,FloatBinding);
IntBinding.type$ = p.at$('IntBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,IntBinding);
LibDependVersionsBinding.type$ = p.at$('LibDependVersionsBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,LibDependVersionsBinding);
MarkerBinding.type$ = p.at$('MarkerBinding','xetoEnv::SingletonBinding',[],{'sys::Js':""},130,MarkerBinding);
NABinding.type$ = p.at$('NABinding','xetoEnv::SingletonBinding',[],{'sys::Js':""},130,NABinding);
NoneBinding.type$ = p.at$('NoneBinding','xetoEnv::SingletonBinding',[],{'sys::Js':""},130,NoneBinding);
NumberBinding.type$ = p.at$('NumberBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,NumberBinding);
RefBinding.type$ = p.at$('RefBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,RefBinding);
SpanBinding.type$ = p.at$('SpanBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,SpanBinding);
SpanModeBinding.type$ = p.at$('SpanModeBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,SpanModeBinding);
StrBinding.type$ = p.at$('StrBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,StrBinding);
SymbolBinding.type$ = p.at$('SymbolBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,SymbolBinding);
TimeBinding.type$ = p.at$('TimeBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,TimeBinding);
TimeZoneBinding.type$ = p.at$('TimeZoneBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,TimeZoneBinding);
UnitBinding.type$ = p.at$('UnitBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,UnitBinding);
UnitQuantityBinding.type$ = p.at$('UnitQuantityBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,UnitQuantityBinding);
UriBinding.type$ = p.at$('UriBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,UriBinding);
VersionBinding.type$ = p.at$('VersionBinding','xetoEnv::ScalarBinding',[],{'sys::Js':""},130,VersionBinding);
LibDependBinding.type$ = p.at$('LibDependBinding','xetoEnv::DictBinding',[],{'sys::Js':""},130,LibDependBinding);
LinkBinding.type$ = p.at$('LinkBinding','xetoEnv::DictBinding',[],{'sys::Js':""},130,LinkBinding);
LinksBinding.type$ = p.at$('LinksBinding','xetoEnv::DictBinding',[],{'sys::Js':""},130,LinksBinding);
SpecDictBinding.type$ = p.at$('SpecDictBinding','xetoEnv::DictBinding',[],{'sys::Js':""},130,SpecDictBinding);
MLibDepend.type$ = p.at$('MLibDepend','sys::Obj',['haystack::Dict','xeto::LibDepend'],{'sys::NoDoc':"",'sys::Js':""},8194,MLibDepend);
XetoLog.type$ = p.at$('XetoLog','sys::Obj',[],{'sys::Js':""},8193,XetoLog);
XetoOutStreamLog.type$ = p.at$('XetoOutStreamLog','xetoEnv::XetoLog',[],{'sys::Js':""},8192,XetoOutStreamLog);
XetoWrapperLog.type$ = p.at$('XetoWrapperLog','xetoEnv::XetoLog',[],{'sys::Js':""},8192,XetoWrapperLog);
XetoCallbackLog.type$ = p.at$('XetoCallbackLog','xetoEnv::XetoLog',[],{'sys::Js':""},8192,XetoCallbackLog);
XMeta.type$ = p.at$('XMeta','sys::Obj',[],{'sys::Js':""},128,XMeta);
XetoUtil.type$ = p.at$('XetoUtil','sys::Obj',[],{'sys::Js':""},8194,XetoUtil);
XetoFidelity.type$ = p.at$('XetoFidelity','sys::Enum',[],{'sys::Js':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,XetoFidelity);
CNamespace.type$.am$('eachSubtype',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xetoEnv::CSpec',false),new sys.Param('f','|xetoEnv::CSpec->sys::Void|',false)]),{});
CNode.type$.am$('asm',270337,'sys::Obj',xp,{}).am$('id',270337,'haystack::Ref',xp,{});
CSpec.type$.am$('isAst',270337,'sys::Bool',xp,{}).am$('asm',271361,'xetoEnv::XetoSpec',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('qname',270337,'sys::Str',xp,{}).am$('cparent',270337,'xetoEnv::CSpec?',xp,{}).am$('id',271361,'haystack::Ref',xp,{}).am$('binding',270337,'xeto::SpecBinding',xp,{}).am$('ctype',270337,'xetoEnv::CSpec',xp,{}).am$('cbase',270337,'xetoEnv::CSpec?',xp,{}).am$('cmeta',270337,'xetoEnv::MNameDict',xp,{}).am$('cmetaHas',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('hasSlots',270337,'sys::Bool',xp,{}).am$('cslot',270337,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('cslots',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoEnv::CSpec,sys::Str->sys::Void|',false)]),{}).am$('cslotsWhile',270337,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoEnv::CSpec,sys::Str->sys::Obj?|',false)]),{}).am$('cof',270337,'xetoEnv::CSpec?',xp,{}).am$('cofs',270337,'xetoEnv::CSpec[]?',xp,{}).am$('cisa',270337,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','xetoEnv::CSpec',false)]),{}).am$('flags',270337,'sys::Int',xp,{}).am$('args',270337,'xetoEnv::MSpecArgs',xp,{}).am$('isSys',270337,'sys::Bool',xp,{}).am$('flavor',270337,'xeto::SpecFlavor',xp,{}).am$('isNone',270337,'sys::Bool',xp,{}).am$('isSelf',270337,'sys::Bool',xp,{}).am$('isEnum',270337,'sys::Bool',xp,{}).am$('cenum',270337,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('isAnd',270337,'sys::Bool',xp,{}).am$('isOr',270337,'sys::Bool',xp,{}).am$('isCompound',8192,'sys::Bool',xp,{}).am$('isMaybe',270337,'sys::Bool',xp,{}).am$('isScalar',270337,'sys::Bool',xp,{}).am$('isMarker',270337,'sys::Bool',xp,{}).am$('isRef',270337,'sys::Bool',xp,{}).am$('isMultiRef',270337,'sys::Bool',xp,{}).am$('isChoice',270337,'sys::Bool',xp,{}).am$('isDict',270337,'sys::Bool',xp,{}).am$('isList',270337,'sys::Bool',xp,{}).am$('isQuery',270337,'sys::Bool',xp,{}).am$('isFunc',270337,'sys::Bool',xp,{}).am$('isInterface',270337,'sys::Bool',xp,{}).am$('isComp',270337,'sys::Bool',xp,{});
CompFactory.type$.af$('ns',67586,'xeto::LibNamespace',{}).af$('cs',67584,'xetoEnv::CompSpace',{}).af$('curCompInit',67584,'xetoEnv::CompSpiInit?',{}).af$('swizzleMap',67584,'[haystack::Ref:haystack::Ref]?',{}).af$('compSpec$Store',722944,'sys::Obj?',{}).am$('create',40962,'xeto::Comp[]',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('dicts','haystack::Dict[]',false)]),{}).am$('initSpi',40962,'xeto::CompSpi',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('c','xeto::CompObj',false),new sys.Param('spec','xeto::Spec?',false)]),{}).am$('process',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('reentrant','sys::Bool',false),new sys.Param('f','|sys::This->sys::Obj?|',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false)]),{}).am$('doCreate',2048,'xeto::Comp[]',sys.List.make(sys.Param.type$,[new sys.Param('dicts','haystack::Dict[]',false)]),{}).am$('doInitSpi',2048,'xeto::CompSpi',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::CompObj',false),new sys.Param('spec','xeto::Spec?',false)]),{}).am$('initSlots',2048,'[sys::Str:xeto::Comp]?',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('acc','[sys::Str:sys::Obj]',false),new sys.Param('children','[sys::Str:xeto::Comp]?',false),new sys.Param('slots','haystack::Dict',false)]),{}).am$('swizzleInit',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('newId',2048,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict?',false)]),{}).am$('swizzleRef',2048,'haystack::Ref',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false)]),{}).am$('genId',2048,'haystack::Ref',xp,{}).am$('reify',2048,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec?',false),new sys.Param('v','sys::Obj',false)]),{}).am$('reifyDict',2048,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('v','haystack::Dict',false)]),{}).am$('reifyComp',2048,'xeto::Comp',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('slots','haystack::Dict',false)]),{}).am$('reifyList',2048,'sys::List',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::List',false)]),{}).am$('dictToSpec',2048,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('toCompFantomType',2048,'sys::Type',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('compSpec',526336,'xeto::Spec',xp,{}).am$('compSpec$Once',133120,'xeto::Spec',xp,{});
CompSpiInit.type$.af$('spec',73730,'xeto::Spec',{}).af$('slots',73730,'haystack::Dict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('slots','haystack::Dict',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
MCompSpi.type$.af$('cs',73728,'xetoEnv::CompSpace',{}).af$('comp',73728,'xeto::Comp',{}).af$('specRef',65664,'xeto::Spec?',{}).af$('id',336898,'haystack::Ref',{}).af$('ver',336896,'sys::Int',{}).af$('parentRef',65664,'xeto::Comp?',{}).af$('nameRef',65664,'sys::Str',{}).af$('needsExecute',65664,'sys::Bool',{}).af$('slots',67584,'[sys::Str:sys::Obj]',{}).af$('listeners',67584,'xetoEnv::CompListeners?',{}).af$('lastOnTimer',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('comp','xeto::CompObj',false),new sys.Param('spec','xeto::Spec',false),new sys.Param('slots','[sys::Str:sys::Obj]',false)]),{}).am$('spec',271360,'xeto::Spec',xp,{}).am$('dis',271360,'sys::Str',xp,{}).am$('toStr',271360,'sys::Str',xp,{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('call',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('callAsync',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('arg','sys::Obj?',false),new sys.Param('cb','|sys::Err?,sys::Obj?->sys::Void|',false)]),{}).am$('set',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('add',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('name','sys::Str?',false)]),{}).am$('checkSet',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj',false)]),{}).am$('isValidSlotVal',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false),new sys.Param('val','sys::Obj',false),new sys.Param('valSpec','xeto::Spec',false)]),{}).am$('checkName',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('autoName',2048,'sys::Str',xp,{}).am$('remove',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('doSet',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('oldVal','sys::Obj?',false),new sys.Param('newVal','sys::Obj',false)]),{}).am$('doRemove',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('addChild',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('child','xeto::Comp',false)]),{}).am$('removeChild',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('child','xeto::Comp',false)]),{}).am$('onChange',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','|xeto::Comp,sys::Obj?->sys::Void|',false)]),{}).am$('onCall',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','|xeto::Comp,sys::Obj?->sys::Void|',false)]),{}).am$('onChangeRemove',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','sys::Func',false)]),{}).am$('onCallRemove',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','sys::Func',false)]),{}).am$('called',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('changed',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('newVal','sys::Obj?',false)]),{}).am$('isMounted',271360,'sys::Bool',xp,{}).am$('parent',271360,'xeto::Comp?',xp,{}).am$('name',271360,'sys::Str',xp,{}).am$('isBelow',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('parent','xeto::Comp',false)]),{}).am$('isAbove',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('child','xeto::Comp',false)]),{}).am$('hasChild',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('child',271360,'xeto::Comp?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',false)]),{}).am$('eachChild',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Comp,sys::Str->sys::Void|',false)]),{}).am$('links',271360,'xeto::Links',xp,{}).am$('checkTimer',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('now','sys::DateTime',false)]),{}).am$('checkExecute',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cx','xetoEnv::MCompContext',false)]),{}).am$('pullLinks',2048,'sys::Void',xp,{}).am$('pullLink',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('toSlot','sys::Str',false),new sys.Param('link','xeto::Link',false)]),{}).am$('dump',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('con','util::Console',false),new sys.Param('opts','sys::Obj?',false)]),{}).am$('doDump',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('con','util::Console',false),new sys.Param('c','xeto::Comp',false),new sys.Param('name','sys::Str?',false),new sys.Param('opts','haystack::Dict',false)]),{}).am$('isDefault',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj',false)]),{}).am$('dumpValToStr',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{});
CompSpaceActor.type$.af$('nsRef',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pool','concurrent::ActorPool',false)]),{}).am$('ns',8192,'xeto::LibNamespace',xp,{}).am$('init',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('csType','sys::Type',false),new sys.Param('args','sys::Obj?[]',false)]),{}).am$('load',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('xeto','sys::Str',false)]),{}).am$('save',8192,'concurrent::Future',xp,{}).am$('execute',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('now','sys::DateTime',true)]),{}).am$('feedSubscribe',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('cookie','sys::Str',false),new sys.Param('gridMeta','haystack::Dict',false)]),{}).am$('feedPoll',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('cookie','sys::Str',false)]),{}).am$('feedUnsubscribe',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('cookie','sys::Str',false)]),{}).am$('feedCall',8192,'concurrent::Future',sys.List.make(sys.Param.type$,[new sys.Param('req','haystack::Dict',false)]),{}).am$('receive',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msgObj','sys::Obj?',false)]),{}).am$('onDispatch',266240,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('msg','concurrent::ActorMsg',false),new sys.Param('cs','xetoEnv::CompSpace',false)]),{}).am$('onInit',2048,'xetoEnv::CompSpaceActorState',sys.List.make(sys.Param.type$,[new sys.Param('csType','sys::Type',false),new sys.Param('args','sys::Obj?[]',false)]),{}).am$('onLoad',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('xeto','sys::Str',false)]),{}).am$('onExecute',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('state','xetoEnv::CompSpaceActorState',false),new sys.Param('now','sys::DateTime',false)]),{}).am$('checkHouseKeeping',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('state','xetoEnv::CompSpaceActorState',false),new sys.Param('now','sys::DateTime',false)]),{}).am$('onHouseKeeping',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('state','xetoEnv::CompSpaceActorState',false)]),{}).am$('onFeedSubscribe',2048,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('state','xetoEnv::CompSpaceActorState',false),new sys.Param('cookie','sys::Str',false),new sys.Param('gridMeta','haystack::Dict',false)]),{}).am$('onFeedUnsubscribe',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('state','xetoEnv::CompSpaceActorState',false),new sys.Param('cookie','sys::Str',false)]),{}).am$('onFeedPoll',2048,'haystack::Grid?',sys.List.make(sys.Param.type$,[new sys.Param('state','xetoEnv::CompSpaceActorState',false),new sys.Param('cookie','sys::Str',false)]),{}).am$('feedEachChild',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('f','|xeto::Comp->sys::Void|',false)]),{}).am$('expireFeeds',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('state','xetoEnv::CompSpaceActorState',false)]),{}).am$('onFeedCall',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('state','xetoEnv::CompSpaceActorState',false),new sys.Param('req','haystack::Dict',false)]),{}).am$('onFeedCreate',2048,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('specRef','haystack::Ref',false),new sys.Param('x','haystack::Number',false),new sys.Param('y','haystack::Number',false)]),{}).am$('onFeedLayout',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('compId','haystack::Ref',false),new sys.Param('x','haystack::Number',false),new sys.Param('y','haystack::Number',false),new sys.Param('w','haystack::Number',false)]),{}).am$('onFeedLink',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('fromRef','haystack::Ref',false),new sys.Param('fromSlot','sys::Str',false),new sys.Param('toRef','haystack::Ref',false),new sys.Param('toSlot','sys::Str',false)]),{}).am$('onFeedUnlink',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('links','haystack::Grid',false)]),{}).am$('onFeedDuplicate',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('ids','haystack::Ref[]',false)]),{}).am$('onFeedDelete',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false),new sys.Param('ids','haystack::Ref[]',false)]),{});
CompSpaceActorState.type$.af$('cs',73728,'xetoEnv::CompSpace',{}).af$('feeds',73728,'[sys::Str:xetoEnv::CompSpaceFeed]',{}).af$('lastHouseKeeping',73728,'sys::DateTime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cs','xetoEnv::CompSpace',false)]),{}).am$('onUnmount',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('comp','xeto::Comp',false)]),{});
CompSpaceFeed.type$.af$('cookie',73730,'sys::Str',{}).af$('touchedRef',67586,'concurrent::AtomicInt',{}).af$('lastPollVer',73728,'sys::Int',{}).af$('deleted',73728,'[haystack::Ref:haystack::Ref]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cookie','sys::Str',false),new sys.Param('lastPollVer','sys::Int',false)]),{}).am$('touched',8192,'sys::Int',xp,{}).am$('touch',8192,'sys::Void',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
CompSpace.type$.af$('nsRef',67584,'xeto::LibNamespace',{}).af$('actorState',65664,'xetoEnv::CompSpaceActorState?',{}).af$('isRunningRef',67584,'sys::Bool',{}).af$('rootRef',67584,'xeto::Comp?',{}).af$('byId',67584,'[haystack::Ref:xeto::Comp]',{}).af$('timersNeedUpdate',67584,'sys::Bool',{}).af$('timed',67584,'xetoEnv::MCompSpi[]',{}).af$('compCounter',67584,'sys::Int',{}).af$('curVer',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false)]),{}).am$('initRoot',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->xeto::Comp|',false)]),{}).am$('ver',8192,'sys::Int',xp,{}).am$('isRunning',8192,'sys::Bool',xp,{}).am$('start',8192,'sys::Void',xp,{}).am$('stop',8192,'sys::Void',xp,{}).am$('onStart',270336,'sys::Void',xp,{}).am$('onStop',270336,'sys::Void',xp,{}).am$('ns',8192,'xeto::LibNamespace',xp,{}).am$('root',270336,'xeto::Comp',xp,{}).am$('checkLoad',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('xeto','sys::Str',false)]),{}).am$('load',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('xeto','sys::Str',false)]),{}).am$('save',8192,'sys::Str',xp,{}).am$('parse',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('xeto','sys::Str',false)]),{}).am$('createSpec',8192,'xeto::Comp',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('create',8192,'xeto::Comp',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('createAll',8192,'xeto::Comp[]',sys.List.make(sys.Param.type$,[new sys.Param('dicts','haystack::Dict[]',false)]),{}).am$('initSpi',271360,'xeto::CompSpi',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::CompObj',false),new sys.Param('spec','xeto::Spec?',false)]),{}).am$('readById',8192,'xeto::Comp?',sys.List.make(sys.Param.type$,[new sys.Param('id','haystack::Ref',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Comp->sys::Void|',false)]),{}).am$('change',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spi','xetoEnv::MCompSpi',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('mount',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false)]),{}).am$('unmount',128,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false)]),{}).am$('updateVer',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spi','xetoEnv::MCompSpi',false)]),{}).am$('onMount',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false)]),{}).am$('onUnmount',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false)]),{}).am$('onChange',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('comp','xeto::Comp',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('updateNamespace',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false)]),{}).am$('updateCompSpec',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false),new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('commit','sys::Bool',false)]),{}).am$('execute',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('now','sys::DateTime',true)]),{}).am$('rebuildTimers',2048,'sys::Void',xp,{}).am$('doRebuildTimers',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','xetoEnv::MCompSpi[]',false),new sys.Param('c','xeto::Comp',false)]),{}).am$('genId',128,'haystack::Ref',xp,{}).am$('err',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('err','sys::Err?',true)]),{});
MCompContext.type$.af$('now',336898,'sys::DateTime',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('now','sys::DateTime',false)]),{});
CompListeners.type$.af$('bySlot',67584,'[sys::Str:xetoEnv::CompSlotListener]',{}).am$('onChangeAdd',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','|xeto::Comp,sys::Obj?->sys::Void|',false)]),{}).am$('onCallAdd',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','|xeto::Comp,sys::Obj?->sys::Void|',false)]),{}).am$('onChangeRemove',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','sys::Func',false)]),{}).am$('onCallRemove',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','sys::Func',false)]),{}).am$('add',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('x','xetoEnv::CompSlotListener',false)]),{}).am$('remove',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('cb','sys::Func',false)]),{}).am$('fireOnChange',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false),new sys.Param('name','sys::Str',false),new sys.Param('newVal','sys::Obj?',false)]),{}).am$('fireOnCall',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false),new sys.Param('name','sys::Str',false),new sys.Param('arg','sys::Obj?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CompSlotListener.type$.af$('next',73728,'xetoEnv::CompSlotListener?',{}).af$('cb',73728,'|xeto::Comp,sys::Obj?->sys::Void|',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cb','|xeto::Comp,sys::Obj?->sys::Void|',false)]),{}).am$('fireOnChange',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false),new sys.Param('v','sys::Obj?',false)]),{}).am$('fireOnCall',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false),new sys.Param('v','sys::Obj?',false)]),{});
CompOnChangeListener.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cb','|xeto::Comp,sys::Obj?->sys::Void|',false)]),{}).am$('fireOnChange',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false),new sys.Param('v','sys::Obj?',false)]),{});
CompOnCallListener.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cb','|xeto::Comp,sys::Obj?->sys::Void|',false)]),{}).am$('fireOnCall',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false),new sys.Param('v','sys::Obj?',false)]),{});
CompUtil.type$.am$('isReservedSlot',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('toHandlerMethod',40962,'sys::Method?',sys.List.make(sys.Param.type$,[new sys.Param('c','xeto::Comp',false),new sys.Param('slot','xeto::Spec',false)]),{}).am$('toHandlerMethodName',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('compSave',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('comp','xeto::Comp',false)]),{}).am$('compToDict',40962,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('comp','xeto::Comp',false)]),{}).am$('compToBrio',40962,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('comp','xeto::Comp',false)]),{}).am$('dictToBrio',40962,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('toFeedGrid',40962,'haystack::Grid',sys.List.make(sys.Param.type$,[new sys.Param('gridMeta','haystack::Dict',false),new sys.Param('cookie','sys::Str',false),new sys.Param('dicts','haystack::Dict[]',false),new sys.Param('deleted','[haystack::Ref:haystack::Ref]?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
Exporter.type$.af$('ns',73730,'xetoEnv::MNamespace',{}).af$('opts',73730,'haystack::Dict',{}).af$('isEffective',73730,'sys::Bool',{}).af$('specRef',73730,'haystack::Ref',{}).af$('out',69632,'sys::OutStream',{}).af$('indentation',73728,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('out','sys::OutStream',false),new sys.Param('opts','haystack::Dict',false)]),{}).am$('start',270337,'sys::This',xp,{}).am$('end',270337,'sys::This',xp,{}).am$('lib',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('spec',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('instance',270337,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('instance','haystack::Dict',false)]),{}).am$('nonNestedInstances',128,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('removeNested',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[haystack::Ref:haystack::Dict]',false),new sys.Param('x','haystack::Dict',false),new sys.Param('level','sys::Int',false)]),{}).am$('w',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('wc',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('char','sys::Int',false)]),{}).am$('nl',8192,'sys::This',xp,{}).am$('sp',8192,'sys::This',xp,{}).am$('indent',8192,'sys::This',xp,{}).am$('flush',8192,'sys::This',xp,{});
JsonExporter.type$.af$('firsts',67584,'sys::Bool[]',{}).af$('lastWasEnd',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('out','sys::OutStream',false),new sys.Param('opts','haystack::Dict',false)]),{}).am$('start',271360,'sys::This',xp,{}).am$('end',271360,'sys::This',xp,{}).am$('lib',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('spec',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('instance',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('instance','haystack::Dict',false)]),{}).am$('libPragma',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('doSpec',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('spec','xeto::Spec',false),new sys.Param('depth','sys::Int',false)]),{}).am$('specType',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('specBase',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('slots',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('slots','xeto::SpecSlots',false),new sys.Param('depth','sys::Int',false)]),{}).am$('meta',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('meta','haystack::Dict',false)]),{}).am$('val',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false)]),{}).am$('dict',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','haystack::Dict',false)]),{}).am$('dictPair',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('v','sys::Obj',false)]),{}).am$('list',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj[]',false)]),{}).am$('open',2048,'sys::This',xp,{}).am$('close',2048,'sys::This',xp,{}).am$('prop',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('propEnd',2048,'sys::This',xp,{}).am$('obj',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('bracket','sys::Str',true)]),{}).am$('objEnd',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('bracket','sys::Str',true)]),{}).am$('str',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{});
RdfExporter.type$.af$('refSpec',73730,'xeto::Spec',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('out','sys::OutStream',false),new sys.Param('opts','haystack::Dict',false)]),{}).am$('start',271360,'sys::This',xp,{}).am$('end',271360,'sys::This',xp,{}).am$('lib',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('spec',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('instance',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('instance','haystack::Dict',false)]),{}).am$('cls',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('enum',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('global',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('globalMarker',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('globalRef',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('globalProp',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('labelAndDoc',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('sysDefs',2048,'sys::This',xp,{}).am$('prefixDefs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('prefixDef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('ontologyDef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('libUri',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('prefix',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('libName','sys::Str',false)]),{}).am$('qname',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false)]),{}).am$('literal',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{});
GridExporter.type$.af$('filetype',67586,'haystack::Filetype',{}).af$('meta',67584,'haystack::Dict?',{}).af$('dicts',67584,'haystack::Dict[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('out','sys::OutStream',false),new sys.Param('opts','haystack::Dict',false),new sys.Param('filetype','haystack::Filetype',false)]),{}).am$('start',271360,'sys::This',xp,{}).am$('end',271360,'sys::This',xp,{}).am$('lib',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('libMeta',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('spec',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('specToDict',2048,'haystack::Dict',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false),new sys.Param('depth','sys::Int',false)]),{}).am$('instance',271360,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('instance','haystack::Dict',false)]),{}).am$('add',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','haystack::Dict',false)]),{}).am$('toGrid',8192,'haystack::Grid',xp,{});
MDictMerge1.type$.af$('wrapped',73730,'xeto::Dict',{}).af$('n0',73730,'sys::Str',{}).af$('v0',73730,'sys::Obj',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('wrapped','xeto::Dict',false),new sys.Param('n0','sys::Str',false),new sys.Param('v0','sys::Obj',false)]),{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('a','sys::Obj?[]?',true)]),{});
MSpec.type$.af$('loc',73730,'util::FileLoc',{}).af$('nameCode',73730,'sys::Int',{}).af$('name',73730,'sys::Str',{}).af$('parent',73730,'xetoEnv::XetoSpec?',{}).af$('type',73730,'xetoEnv::XetoSpec',{}).af$('base',73730,'xetoEnv::XetoSpec?',{}).af$('meta',73730,'xetoEnv::MNameDict',{}).af$('metaOwn',73730,'xetoEnv::MNameDict',{}).af$('slots',73730,'xetoEnv::MSlots',{}).af$('slotsOwn',73730,'xetoEnv::MSlots',{}).af$('args',73730,'xetoEnv::MSpecArgs',{}).af$('specSpecRef',106498,'xeto::Ref',{}).af$('flags',73730,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('parent','xetoEnv::XetoSpec?',false),new sys.Param('nameCode','sys::Int',false),new sys.Param('name','sys::Str',false),new sys.Param('base','xetoEnv::XetoSpec?',false),new sys.Param('type','xetoEnv::XetoSpec',false),new sys.Param('meta','xetoEnv::MNameDict',false),new sys.Param('metaOwn','xetoEnv::MNameDict',false),new sys.Param('slots','xetoEnv::MSlots',false),new sys.Param('slotsOwn','xetoEnv::MSlots',false),new sys.Param('flags','sys::Int',false),new sys.Param('args','xetoEnv::MSpecArgs',false)]),{}).am$('lib',270336,'xetoEnv::XetoLib',xp,{}).am$('id',270336,'haystack::Ref',xp,{}).am$('qname',270336,'sys::Str',xp,{}).am$('hasSlots',8192,'sys::Bool',xp,{}).am$('slot',8192,'xetoEnv::XetoSpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('slotOwn',8192,'xetoEnv::XetoSpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('binding',270336,'xeto::SpecBinding',xp,{}).am$('enum',270336,'xetoEnv::MEnum',xp,{}).am$('get',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{}).am$('has',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('flavor',270336,'xeto::SpecFlavor',xp,{}).am$('isType',8192,'sys::Bool',xp,{}).am$('hasFlag',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flag','sys::Int',false)]),{}).am$('fantomType',8192,'sys::Type',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
MGlobal.type$.af$('lib',336898,'xetoEnv::XetoLib',{}).af$('qname',336898,'sys::Str',{}).af$('id',336898,'haystack::Ref',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('lib','xetoEnv::XetoLib',false),new sys.Param('qname','sys::Str',false),new sys.Param('nameCode','sys::Int',false),new sys.Param('name','sys::Str',false),new sys.Param('base','xetoEnv::XetoSpec?',false),new sys.Param('self','xetoEnv::XetoSpec',false),new sys.Param('meta','xetoEnv::MNameDict',false),new sys.Param('metaOwn','xetoEnv::MNameDict',false),new sys.Param('slots','xetoEnv::MSlots',false),new sys.Param('slotsOwn','xetoEnv::MSlots',false),new sys.Param('flags','sys::Int',false),new sys.Param('args','xetoEnv::MSpecArgs',false)]),{}).am$('flavor',271360,'xeto::SpecFlavor',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
MSlots.type$.af$('empty',106498,'xetoEnv::MSlots',{}).af$('map',73730,'xeto::NameDict',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('map','xeto::NameDict',false)]),{}).am$('size',8192,'sys::Int',xp,{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('get',271360,'xetoEnv::XetoSpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('names',271360,'sys::Str[]',xp,{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Spec->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Spec->sys::Obj?|',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('toDict',271360,'haystack::Dict',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
MSlotsDict.type$.af$('slots',73730,'xetoEnv::MSlots',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slots','xetoEnv::MSlots',false)]),{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('a','sys::Obj?[]?',true)]),{});
MSpecFlags.type$.af$('maybe',106498,'sys::Int',{}).af$('marker',106498,'sys::Int',{}).af$('scalar',106498,'sys::Int',{}).af$('ref',106498,'sys::Int',{}).af$('multiRef',106498,'sys::Int',{}).af$('choice',106498,'sys::Int',{}).af$('dict',106498,'sys::Int',{}).af$('list',106498,'sys::Int',{}).af$('query',106498,'sys::Int',{}).af$('func',106498,'sys::Int',{}).af$('interface',106498,'sys::Int',{}).af$('comp',106498,'sys::Int',{}).af$('inheritMask',106498,'sys::Int',{}).af$('self',106498,'sys::Int',{}).af$('none',106498,'sys::Int',{}).af$('enum',106498,'sys::Int',{}).af$('and',106498,'sys::Int',{}).af$('or',106498,'sys::Int',{}).am$('flagsToStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
MMetaSpec.type$.af$('lib',336898,'xetoEnv::XetoLib',{}).af$('qname',336898,'sys::Str',{}).af$('id',336898,'haystack::Ref',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('lib','xetoEnv::XetoLib',false),new sys.Param('qname','sys::Str',false),new sys.Param('nameCode','sys::Int',false),new sys.Param('name','sys::Str',false),new sys.Param('base','xetoEnv::XetoSpec?',false),new sys.Param('self','xetoEnv::XetoSpec',false),new sys.Param('meta','xetoEnv::MNameDict',false),new sys.Param('metaOwn','xetoEnv::MNameDict',false),new sys.Param('slots','xetoEnv::MSlots',false),new sys.Param('slotsOwn','xetoEnv::MSlots',false),new sys.Param('flags','sys::Int',false),new sys.Param('args','xetoEnv::MSpecArgs',false)]),{}).am$('flavor',271360,'xeto::SpecFlavor',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
MSys.type$.af$('obj',73730,'xetoEnv::XetoSpec',{}).af$('none',73730,'xetoEnv::XetoSpec',{}).af$('self',73730,'xetoEnv::XetoSpec',{}).af$('seq',73730,'xetoEnv::XetoSpec',{}).af$('dict',73730,'xetoEnv::XetoSpec',{}).af$('list',73730,'xetoEnv::XetoSpec',{}).af$('func',73730,'xetoEnv::XetoSpec',{}).af$('grid',73730,'xetoEnv::XetoSpec',{}).af$('lib',73730,'xetoEnv::XetoSpec',{}).af$('spec',73730,'xetoEnv::XetoSpec',{}).af$('scalar',73730,'xetoEnv::XetoSpec',{}).af$('marker',73730,'xetoEnv::XetoSpec',{}).af$('bool',73730,'xetoEnv::XetoSpec',{}).af$('str',73730,'xetoEnv::XetoSpec',{}).af$('uri',73730,'xetoEnv::XetoSpec',{}).af$('number',73730,'xetoEnv::XetoSpec',{}).af$('int',73730,'xetoEnv::XetoSpec',{}).af$('duration',73730,'xetoEnv::XetoSpec',{}).af$('date',73730,'xetoEnv::XetoSpec',{}).af$('time',73730,'xetoEnv::XetoSpec',{}).af$('dateTime',73730,'xetoEnv::XetoSpec',{}).af$('ref',73730,'xetoEnv::XetoSpec',{}).af$('enum',73730,'xetoEnv::XetoSpec',{}).af$('and',73730,'xetoEnv::XetoSpec',{}).af$('or',73730,'xetoEnv::XetoSpec',{}).af$('query',73730,'xetoEnv::XetoSpec',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xetoEnv::XetoLib',false)]),{});
MNameDict.type$.af$('empty',106498,'xetoEnv::MNameDict',{}).af$('wrapped',73730,'xeto::NameDict',{}).am$('wrap',40966,'xetoEnv::MNameDict?',sys.List.make(sys.Param.type$,[new sys.Param('wrapped','xeto::NameDict',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('wrapped','xeto::NameDict',false)]),{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('a','sys::Obj?[]?',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
MSpecArgs.type$.af$('nil',106498,'xetoEnv::MSpecArgs',{}).am$('of',270336,'xetoEnv::XetoSpec?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',false)]),{}).am$('ofs',270336,'xetoEnv::XetoSpec[]?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
MSpecArgsOf.type$.af$('val',73730,'xetoEnv::XetoSpec',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','xetoEnv::XetoSpec',false)]),{}).am$('of',271360,'xetoEnv::XetoSpec?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',false)]),{});
MSpecArgsOfs.type$.af$('val',73730,'xetoEnv::XetoSpec[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','xetoEnv::XetoSpec[]',false)]),{}).am$('ofs',271360,'xetoEnv::XetoSpec[]?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',false)]),{});
MChoice.type$.af$('ns',73730,'xetoEnv::MNamespace',{}).af$('spec',336898,'xetoEnv::XetoSpec',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('spec','xetoEnv::XetoSpec',false)]),{}).am$('type',271360,'xeto::Spec',xp,{}).am$('isMaybe',271360,'sys::Bool',xp,{}).am$('isMultiChoice',271360,'sys::Bool',xp,{}).am$('selections',271360,'xeto::Spec[]',sys.List.make(sys.Param.type$,[new sys.Param('instance','xeto::Dict',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('selection',271360,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('instance','xeto::Dict',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('check',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::CNamespace',false),new sys.Param('spec','xetoEnv::CSpec',false),new sys.Param('instance','xeto::Dict',false),new sys.Param('onErr','|sys::Str->sys::Void|',false)]),{}).am$('findSelections',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::CNamespace',false),new sys.Param('spec','xetoEnv::CSpec',false),new sys.Param('instance','xeto::Dict',false),new sys.Param('acc','sys::Obj[]',false)]),{}).am$('validate',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::CSpec',false),new sys.Param('selections','xetoEnv::CSpec[]',false),new sys.Param('onErr','|sys::Str->sys::Void|',false)]),{}).am$('xhasChoiceMarkers',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('instance','xeto::Dict',false),new sys.Param('choice','xetoEnv::CSpec',false)]),{}).am$('maybe',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::CSpec',false)]),{}).am$('multiChoice',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::CSpec',false)]),{});
MType.type$.af$('lib',336898,'xetoEnv::XetoLib',{}).af$('qname',336898,'sys::Str',{}).af$('id',336898,'haystack::Ref',{}).af$('binding',336898,'xeto::SpecBinding',{}).af$('enumRef',67586,'xetoEnv::MEnum?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('lib','xetoEnv::XetoLib',false),new sys.Param('qname','sys::Str',false),new sys.Param('nameCode','sys::Int',false),new sys.Param('name','sys::Str',false),new sys.Param('base','xetoEnv::XetoSpec?',false),new sys.Param('self','xetoEnv::XetoSpec',false),new sys.Param('meta','xetoEnv::MNameDict',false),new sys.Param('metaOwn','xetoEnv::MNameDict',false),new sys.Param('slots','xetoEnv::MSlots',false),new sys.Param('slotsOwn','xetoEnv::MSlots',false),new sys.Param('flags','sys::Int',false),new sys.Param('args','xetoEnv::MSpecArgs',false),new sys.Param('binding','xeto::SpecBinding',false)]),{}).am$('flavor',271360,'xeto::SpecFlavor',xp,{}).am$('enum',271360,'xetoEnv::MEnum',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
MLib.type$.af$('loc',73730,'util::FileLoc',{}).af$('id',73730,'xeto::Ref',{}).af$('nameCode',73730,'sys::Int',{}).af$('name',73730,'sys::Str',{}).af$('isSys',73730,'sys::Bool',{}).af$('meta',73730,'xetoEnv::MNameDict',{}).af$('version',73730,'sys::Version',{}).af$('depends',73730,'xeto::LibDepend[]',{}).af$('specsMap',73730,'[sys::Str:xeto::Spec]',{}).af$('instancesMap',73730,'[sys::Str:xeto::Dict]',{}).af$('files',73730,'xetoEnv::MLibFiles',{}).af$('libSpecRef',106498,'xeto::Ref',{}).af$('flags',73730,'sys::Int',{}).af$('specs$Store',722944,'sys::Obj?',{}).af$('types$Store',722944,'sys::Obj?',{}).af$('globals$Store',722944,'sys::Obj?',{}).af$('metaSpecs$Store',722944,'sys::Obj?',{}).af$('instances$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loc','util::FileLoc',false),new sys.Param('nameCode','sys::Int',false),new sys.Param('name','sys::Str',false),new sys.Param('meta','xetoEnv::MNameDict',false),new sys.Param('flags','sys::Int',false),new sys.Param('version','sys::Version',false),new sys.Param('depends','xetoEnv::MLibDepend[]',false),new sys.Param('specsMap','[sys::Str:xeto::Spec]',false),new sys.Param('instancesMap','[sys::Str:xeto::Dict]',false),new sys.Param('files','xetoEnv::MLibFiles',false)]),{}).am$('specs',532480,'xeto::Spec[]',xp,{}).am$('spec',8192,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('types',532480,'xeto::Spec[]',xp,{}).am$('type',8192,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('globals',532480,'xeto::Spec[]',xp,{}).am$('global',8192,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('metaSpecs',532480,'xeto::Spec[]',xp,{}).am$('metaSpec',8192,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('instances',532480,'xeto::Dict[]',xp,{}).am$('instance',8192,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachInstance',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Dict->sys::Void|',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('get',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{}).am$('has',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('missing',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('each',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('args','sys::Obj?[]?',true)]),{}).am$('hasFlag',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('flag','sys::Int',false)]),{}).am$('specs$Once',133120,'xeto::Spec[]',xp,{}).am$('types$Once',133120,'xeto::Spec[]',xp,{}).am$('globals$Once',133120,'xeto::Spec[]',xp,{}).am$('metaSpecs$Once',133120,'xeto::Spec[]',xp,{}).am$('instances$Once',133120,'xeto::Dict[]',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
MLibFlags.type$.af$('hasXMeta',106498,'sys::Int',{}).af$('hasMarkdown',106498,'sys::Int',{}).am$('flagsToStr',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('flags','sys::Int',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
XetoLib.type$.af$('m',73730,'xetoEnv::MLib?',{}).am$('loc',271360,'util::FileLoc',xp,{}).am$('id',271360,'haystack::Ref',xp,{}).am$('_id',271360,'haystack::Ref',xp,{}).am$('name',271360,'sys::Str',xp,{}).am$('meta',271360,'xeto::Dict',xp,{}).am$('version',271360,'sys::Version',xp,{}).am$('depends',271360,'xeto::LibDepend[]',xp,{}).am$('specs',271360,'xeto::Spec[]',xp,{}).am$('spec',271360,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('types',271360,'xeto::Spec[]',xp,{}).am$('type',271360,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('globals',271360,'xeto::Spec[]',xp,{}).am$('global',271360,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('metaSpecs',271360,'xeto::Spec[]',xp,{}).am$('metaSpec',271360,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('instances',271360,'xeto::Dict[]',xp,{}).am$('instance',271360,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachInstance',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Dict->sys::Void|',false)]),{}).am$('isSys',271360,'sys::Bool',xp,{}).am$('hasXMeta',271360,'sys::Bool',xp,{}).am$('hasMarkdown',271360,'sys::Bool',xp,{}).am$('files',271360,'xeto::LibFiles',xp,{}).am$('isEmpty',9216,'sys::Bool',xp,{}).am$('get',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('d','sys::Obj?',true)]),{'sys::Operator':""}).am$('has',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('missing',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('each',9216,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('a','sys::Obj?[]?',true)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('make',139268,'sys::Void',xp,{});
MLibFiles.type$.am$('readBuf',271360,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('readStr',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('make',139268,'sys::Void',xp,{});
UnsupportedLibFiles.type$.af$('val',106498,'xetoEnv::UnsupportedLibFiles',{}).am$('make',2052,'sys::Void',xp,{}).am$('isSupported',271360,'sys::Bool',xp,{}).am$('list',271360,'sys::Uri[]',xp,{}).am$('read',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('f','|sys::Err?,sys::InStream?->sys::Void|',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
EmptyLibFiles.type$.af$('val',106498,'xetoEnv::EmptyLibFiles',{}).am$('make',2052,'sys::Void',xp,{}).am$('isSupported',271360,'sys::Bool',xp,{}).am$('list',271360,'sys::Uri[]',xp,{}).am$('read',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('f','|sys::Err?,sys::InStream?->sys::Void|',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DirLibFiles.type$.af$('dir',73730,'sys::File',{}).af$('list$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dir','sys::File',false)]),{}).am$('isSupported',271360,'sys::Bool',xp,{}).am$('list',795648,'sys::Uri[]',xp,{}).am$('read',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('f','|sys::Err?,sys::InStream?->sys::Void|',false)]),{}).am$('doRead',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('f','|sys::Err?,sys::InStream?->sys::Void|',false)]),{}).am$('list$Once',133120,'sys::Uri[]',xp,{});
ZipLibFiles.type$.af$('zipFile',73730,'sys::File',{}).af$('list',336898,'sys::Uri[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('zipFile','sys::File',false),new sys.Param('list','sys::Uri[]',false)]),{}).am$('isSupported',271360,'sys::Bool',xp,{}).am$('read',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('f','|sys::Err?,sys::InStream?->sys::Void|',false)]),{}).am$('doRead',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('f','|sys::Err?,sys::InStream?->sys::Void|',false)]),{});
XetoSpec.type$.af$('m',73730,'xetoEnv::MSpec?',{}).am$('make',8196,'sys::Void',xp,{}).am$('makem',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('m','xetoEnv::MSpec',false)]),{}).am$('lib',271360,'xeto::Lib',xp,{}).am$('parent',9216,'xeto::Spec?',xp,{}).am$('id',9216,'haystack::Ref',xp,{}).am$('_id',9216,'haystack::Ref',xp,{}).am$('name',9216,'sys::Str',xp,{}).am$('qname',9216,'sys::Str',xp,{}).am$('type',9216,'xeto::Spec',xp,{}).am$('base',9216,'xeto::Spec?',xp,{}).am$('meta',9216,'xeto::Dict',xp,{}).am$('metaOwn',9216,'xeto::Dict',xp,{}).am$('hasSlots',9216,'sys::Bool',xp,{}).am$('slotsOwn',9216,'xeto::SpecSlots',xp,{}).am$('slots',9216,'xeto::SpecSlots',xp,{}).am$('slot',9216,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('c','sys::Bool',true)]),{}).am$('slotOwn',9216,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('c','sys::Bool',true)]),{}).am$('isa',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Spec',false)]),{}).am$('cisa',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::CSpec',false)]),{}).am$('loc',9216,'util::FileLoc',xp,{}).am$('binding',9216,'xeto::SpecBinding',xp,{}).am$('isEmpty',9216,'sys::Bool',xp,{}).am$('get',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('d','sys::Obj?',true)]),{'sys::Operator':""}).am$('has',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('missing',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('each',9216,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('trap',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('a','sys::Obj?[]?',true)]),{}).am$('toStr',9216,'sys::Str',xp,{}).am$('args',9216,'xetoEnv::MSpecArgs',xp,{}).am$('of',9216,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('ofs',9216,'xeto::Spec[]?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('isSys',9216,'sys::Bool',xp,{}).am$('enum',9216,'xeto::SpecEnum',xp,{}).am$('cenum',9216,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('flavor',9216,'xeto::SpecFlavor',xp,{}).am$('isType',9216,'sys::Bool',xp,{}).am$('isGlobal',9216,'sys::Bool',xp,{}).am$('isMeta',9216,'sys::Bool',xp,{}).am$('isSlot',9216,'sys::Bool',xp,{}).am$('isNone',9216,'sys::Bool',xp,{}).am$('isSelf',9216,'sys::Bool',xp,{}).am$('isMaybe',9216,'sys::Bool',xp,{}).am$('isScalar',9216,'sys::Bool',xp,{}).am$('isMarker',9216,'sys::Bool',xp,{}).am$('isRef',9216,'sys::Bool',xp,{}).am$('isMultiRef',9216,'sys::Bool',xp,{}).am$('isChoice',9216,'sys::Bool',xp,{}).am$('isDict',9216,'sys::Bool',xp,{}).am$('isList',9216,'sys::Bool',xp,{}).am$('isQuery',9216,'sys::Bool',xp,{}).am$('isFunc',9216,'sys::Bool',xp,{}).am$('isInterface',9216,'sys::Bool',xp,{}).am$('isComp',9216,'sys::Bool',xp,{}).am$('isEnum',9216,'sys::Bool',xp,{}).am$('isAnd',9216,'sys::Bool',xp,{}).am$('isOr',9216,'sys::Bool',xp,{}).am$('isAst',9216,'sys::Bool',xp,{}).am$('asm',9216,'xetoEnv::XetoSpec',xp,{}).am$('flags',9216,'sys::Int',xp,{}).am$('cbase',9216,'xetoEnv::CSpec?',xp,{}).am$('ctype',9216,'xetoEnv::CSpec',xp,{}).am$('cparent',9216,'xetoEnv::CSpec?',xp,{}).am$('cmeta',9216,'xetoEnv::MNameDict',xp,{}).am$('cmetaHas',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('cslot',9216,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('c','sys::Bool',true)]),{}).am$('cslots',9216,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoEnv::CSpec,sys::Str->sys::Void|',false)]),{}).am$('cslotsWhile',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoEnv::CSpec,sys::Str->sys::Obj?|',false)]),{}).am$('cof',9216,'xetoEnv::XetoSpec?',xp,{}).am$('cofs',9216,'xetoEnv::XetoSpec[]?',xp,{}).am$('fantomType',9216,'sys::Type',xp,{});
MEnum.type$.af$('map',73730,'[sys::Str:xeto::Spec]',{}).af$('defKey',73730,'sys::Str',{}).am$('init',40962,'xetoEnv::MEnum',sys.List.make(sys.Param.type$,[new sys.Param('enum','xetoEnv::MType',false)]),{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('map','[sys::Str:xeto::Spec]',false),new sys.Param('defKey','sys::Str',false)]),{}).am$('spec',271360,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('keys',271360,'sys::Str[]',xp,{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Spec,sys::Str->sys::Void|',false)]),{}).am$('xmeta',271360,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str?',true),new sys.Param('checked','sys::Bool',true)]),{});
MEnumXMeta.type$.af$('enum',73730,'xetoEnv::MEnum',{}).af$('xmetaSelf',73730,'xeto::Dict',{}).af$('xmetaByKey',73730,'[sys::Str:xeto::Dict]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('enum','xetoEnv::MEnum',false),new sys.Param('xmetaSelf','xeto::Dict',false),new sys.Param('xmetaByKey','[sys::Str:xeto::Dict]',false)]),{}).am$('spec',271360,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('keys',271360,'sys::Str[]',xp,{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Spec,sys::Str->sys::Void|',false)]),{}).am$('xmeta',271360,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str?',true),new sys.Param('checked','sys::Bool',true)]),{});
XetoBinaryConst.type$.af$('magic',106498,'sys::Int',{}).af$('magicOverlay',106498,'sys::Int',{}).af$('magicEnd',106498,'sys::Int',{}).af$('version',106498,'sys::Int',{}).af$('magicLib',106498,'sys::Int',{}).af$('magicLibEnd',106498,'sys::Int',{}).af$('magicLibVer',106498,'sys::Int',{}).af$('specOwnOnly',106498,'sys::Int',{}).af$('specInherited',106498,'sys::Int',{}).af$('ctrlNull',106498,'sys::Int',{}).af$('ctrlMarker',106498,'sys::Int',{}).af$('ctrlNA',106498,'sys::Int',{}).af$('ctrlRemove',106498,'sys::Int',{}).af$('ctrlTrue',106498,'sys::Int',{}).af$('ctrlFalse',106498,'sys::Int',{}).af$('ctrlName',106498,'sys::Int',{}).af$('ctrlStr',106498,'sys::Int',{}).af$('ctrlNumberNoUnit',106498,'sys::Int',{}).af$('ctrlNumberUnit',106498,'sys::Int',{}).af$('ctrlInt2',106498,'sys::Int',{}).af$('ctrlInt8',106498,'sys::Int',{}).af$('ctrlFloat8',106498,'sys::Int',{}).af$('ctrlDuration',106498,'sys::Int',{}).af$('ctrlRef',106498,'sys::Int',{}).af$('ctrlUri',106498,'sys::Int',{}).af$('ctrlDate',106498,'sys::Int',{}).af$('ctrlTime',106498,'sys::Int',{}).af$('ctrlDateTime',106498,'sys::Int',{}).af$('ctrlBuf',106498,'sys::Int',{}).af$('ctrlGenericScalar',106498,'sys::Int',{}).af$('ctrlTypedScalar',106498,'sys::Int',{}).af$('ctrlEmptyDict',106498,'sys::Int',{}).af$('ctrlNameDict',106498,'sys::Int',{}).af$('ctrlGenericDict',106498,'sys::Int',{}).af$('ctrlTypedDict',106498,'sys::Int',{}).af$('ctrlSpecRef',106498,'sys::Int',{}).af$('ctrlList',106498,'sys::Int',{}).af$('ctrlGrid',106498,'sys::Int',{}).af$('ctrlSpan',106498,'sys::Int',{}).af$('ctrlVersion',106498,'sys::Int',{}).af$('ctrlCoord',106498,'sys::Int',{}).am$('static$init',165890,'sys::Void',xp,{});
XetoBinaryReader.type$.af$('io',67586,'xetoEnv::XetoBinaryIO',{}).af$('names',67586,'xeto::NameTable',{}).af$('in',67584,'sys::InStream',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('io','xetoEnv::XetoBinaryIO',false),new sys.Param('in','sys::InStream',false)]),{}).am$('readBootBase',128,'xetoEnv::RemoteNamespace',sys.List.make(sys.Param.type$,[new sys.Param('libLoader','xetoEnv::RemoteLibLoader?',false)]),{}).am$('readBootOverlay',128,'xetoEnv::RemoteNamespace',sys.List.make(sys.Param.type$,[new sys.Param('base','xetoEnv::MNamespace',false),new sys.Param('libLoader','xetoEnv::RemoteLibLoader?',false)]),{}).am$('readNameTable',2048,'sys::Int',xp,{}).am$('readLibVersions',2048,'xeto::LibVersion[]',xp,{}).am$('readLibVersion',2048,'xeto::LibVersion',xp,{}).am$('readLib',8192,'xetoEnv::XetoLib',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false)]),{}).am$('readTops',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loader','xetoEnv::RemoteLoader',false)]),{}).am$('readSpec',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loader','xetoEnv::RemoteLoader',false),new sys.Param('x','xetoEnv::RSpec',false)]),{}).am$('readInheritedMetaNames',2048,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('loader','xetoEnv::RemoteLoader',false),new sys.Param('x','xetoEnv::RSpec',false)]),{}).am$('readOwnSlots',2048,'xetoEnv::RSpec[]?',sys.List.make(sys.Param.type$,[new sys.Param('loader','xetoEnv::RemoteLoader',false),new sys.Param('parent','xetoEnv::RSpec',false)]),{}).am$('readInheritedSlotRefs',2048,'xetoEnv::RSpecRef[]',xp,{}).am$('readSpecRef',2048,'xetoEnv::RSpecRef?',xp,{}).am$('readInstances',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('loader','xetoEnv::RemoteLoader',false)]),{}).am$('readDict',8192,'haystack::Dict',xp,{}).am$('readVal',271360,'sys::Obj?',xp,{}).am$('doReadVal',2048,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('ctrl','sys::Int',false)]),{}).am$('readNumberNoUnit',2048,'haystack::Number',xp,{}).am$('readNumberUnit',2048,'haystack::Number',xp,{}).am$('readUri',2048,'sys::Uri',xp,{}).am$('readRef',2048,'haystack::Ref',xp,{}).am$('readDate',2048,'sys::Date',xp,{}).am$('readTime',2048,'sys::Time',xp,{}).am$('readDateTime',2048,'sys::DateTime',xp,{}).am$('readBuf',2048,'sys::Buf',xp,{}).am$('readCoord',2048,'haystack::Coord',xp,{}).am$('readGenericScalar',2048,'xeto::Scalar',xp,{}).am$('readTypedScalar',2048,'sys::Obj',xp,{}).am$('toTypedScalarDecoder',2048,'sys::Method',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('readNameDict',2048,'xetoEnv::MNameDict',xp,{}).am$('readGenericDict',2048,'haystack::Dict',xp,{}).am$('readTypedDict',2048,'haystack::Dict',xp,{}).am$('readDictTags',2048,'haystack::Dict',xp,{}).am$('readList',2048,'sys::Obj?[]',xp,{}).am$('readGrid',2048,'haystack::Grid',xp,{}).am$('readSpan',2048,'haystack::Span',xp,{}).am$('readVersion',2048,'sys::Version',xp,{}).am$('readName',271360,'sys::Int',xp,{}).am$('read',8192,'sys::Int',xp,{}).am$('readU4',8192,'sys::Int',xp,{}).am$('readS8',8192,'sys::Int',xp,{}).am$('readF8',8192,'sys::Float',xp,{}).am$('readUtf',8192,'sys::Str',xp,{}).am$('readRawRefList',8192,'haystack::Ref[]',xp,{}).am$('readRawDictList',8192,'haystack::Dict[]',xp,{}).am$('readMeta',2048,'haystack::Dict',xp,{}).am$('verifyU1',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expect','sys::Int',false),new sys.Param('msg','sys::Str',false)]),{}).am$('verifyU4',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expect','sys::Int',false),new sys.Param('msg','sys::Str',false)]),{}).am$('readVarInt',8192,'sys::Int',xp,{});
XetoBinaryIO.type$.af$('names',73730,'xeto::NameTable',{}).af$('maxNameCode',73730,'sys::Int',{}).am$('makeServer',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('maxNameCode','sys::Int',true)]),{}).am$('makeClientStart',132,'sys::Void',xp,{}).am$('makeClientEnd',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('names','xeto::NameTable',false),new sys.Param('maxNameCoce','sys::Int',false)]),{}).am$('writer',8192,'xetoEnv::XetoBinaryWriter',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('reader',8192,'xetoEnv::XetoBinaryReader',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{});
XetoBinaryWriter.type$.af$('names',67586,'xeto::NameTable',{}).af$('maxNameCode',67586,'sys::Int',{}).af$('out',67584,'sys::OutStream',{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('io','xetoEnv::XetoBinaryIO',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('writeBoot',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('bootLibs','sys::Str[]?',true)]),{}).am$('writeBootOverlay',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false)]),{}).am$('writeNameTable',2048,'sys::Void',xp,{}).am$('writeLibVersions',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('vers','xeto::LibVersion[]',false)]),{}).am$('writeLibVersion',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false)]),{}).am$('writeBootLibs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('list','sys::Str[]',false)]),{}).am$('writeLib',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xetoEnv::XetoLib',false)]),{}).am$('writeSpecs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xetoEnv::XetoLib',false)]),{}).am$('writeSpec',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::XetoSpec',false)]),{}).am$('writeInheritedMetaNames',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::XetoSpec',false)]),{}).am$('writeOwnSlots',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::XetoSpec',false)]),{}).am$('writeInheritedSlotRefs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::XetoSpec',false)]),{}).am$('writeSpecRef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::XetoSpec?',false)]),{}).am$('writeInstances',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xetoEnv::XetoLib',false)]),{}).am$('writeVal',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('writeNull',2048,'sys::Void',xp,{}).am$('writeMarker',2048,'sys::Void',xp,{}).am$('writeNA',2048,'sys::Void',xp,{}).am$('writeRemove',2048,'sys::Void',xp,{}).am$('writeBool',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',false)]),{}).am$('writeStr',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('writeNumber',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Number',false)]),{}).am$('writeInt',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',false)]),{}).am$('writeFloat',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Float',false)]),{}).am$('writeDuration',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Duration',false)]),{}).am$('writeUri',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false)]),{}).am$('writeRef',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false)]),{}).am$('writeDate',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Date',false)]),{}).am$('writeTime',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Time',false)]),{}).am$('writeDateTime',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::DateTime',false)]),{}).am$('writeBuf',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false)]),{}).am$('writeSpan',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('span','haystack::Span',false)]),{}).am$('writeVersion',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Version',false)]),{}).am$('writeCoord',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','haystack::Coord',false)]),{}).am$('writeGenericScalar',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','xeto::Scalar',false)]),{}).am$('writeTypedScalar',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('writeDict',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('d','xeto::Dict',false)]),{}).am$('isGenericDict',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('d','xeto::Dict',false)]),{}).am$('writeSpecRefVal',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::XetoSpec',false)]),{}).am$('writeNameDict',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','xeto::NameDict',false)]),{}).am$('writeGenericDict',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','xeto::Dict',false)]),{}).am$('writeTypedDict',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','xeto::Dict',false)]),{}).am$('writeDictTags',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','xeto::Dict',false)]),{}).am$('writeList',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj?[]',false)]),{}).am$('writeGrid',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('writeName',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('nameCode','sys::Int',false)]),{}).am$('write',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('byte','sys::Int',false)]),{}).am$('writeI2',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('writeI4',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('writeI8',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('i','sys::Int',false)]),{}).am$('writeF8',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','sys::Float',false)]),{}).am$('writeUtf',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('s','sys::Str',false)]),{}).am$('writeRawRefList',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ids','haystack::Ref[]',false)]),{}).am$('writeRawDictList',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dicts','xeto::Dict[]',false)]),{}).am$('writeVarInt',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',false)]),{});
MInterfaces.type$.af$('ns',73730,'xetoEnv::MNamespace',{}).af$('cache',67586,'concurrent::ConcurrentMap',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false)]),{}).am$('method',8192,'sys::Method?',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('name','sys::Str',false)]),{}).am$('methodOn',8192,'sys::Method?',sys.List.make(sys.Param.type$,[new sys.Param('target','sys::Obj',false),new sys.Param('name','sys::Str',false)]),{}).am$('resolveMethod',2048,'sys::Method?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('name','sys::Str',false)]),{});
InterfaceMethod.type$.af$('type',73730,'sys::Type',{}).af$('name',73730,'sys::Str',{}).af$('method',73730,'sys::Method?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false),new sys.Param('name','sys::Str',false),new sys.Param('method','sys::Method?',false)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj?',false)]),{});
MNamespace.type$.af$('names',336898,'xeto::NameTable',{}).af$('base',336898,'xetoEnv::MNamespace?',{}).af$('sysLib',336898,'xeto::Lib',{}).af$('sys',73730,'xetoEnv::MSys',{}).af$('entriesList',65666,'xetoEnv::MLibEntry[]',{}).af$('entriesMap',67586,'[sys::Str:xetoEnv::MLibEntry]',{}).af$('libsRef',67586,'concurrent::AtomicRef',{}).af$('interfaces',67586,'xetoEnv::MInterfaces',{}).af$('digest$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('base','xetoEnv::MNamespace?',false),new sys.Param('names','xeto::NameTable',false),new sys.Param('versions','xeto::LibVersion[]',false),new sys.Param('loadSys','|sys::This->xetoEnv::XetoLib|?',false)]),{}).am$('isOverlay',271360,'sys::Bool',xp,{}).am$('digest',795648,'sys::Str',xp,{}).am$('versions',271360,'xeto::LibVersion[]',xp,{}).am$('version',271360,'xeto::LibVersion?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('hasLib',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('libStatus',271360,'xeto::LibStatus?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('libErr',271360,'sys::Err?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('isAllLoaded',271360,'sys::Bool',xp,{}).am$('lib',271360,'xeto::Lib?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('libs',271360,'xeto::Lib[]',xp,{}).am$('libsAllAsync',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Err?,xeto::Lib[]?->sys::Void|',false)]),{}).am$('libAsync',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('f','|sys::Err?,xeto::Lib?->sys::Void|',false)]),{}).am$('libListAsync',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('names','sys::Str[]',false),new sys.Param('f','|sys::Err?,xeto::Lib[]?->sys::Void|',false)]),{}).am$('entry',128,'xetoEnv::MLibEntry?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('flattenUnloadedDepends',2048,'xetoEnv::MLibEntry[]',sys.List.make(sys.Param.type$,[new sys.Param('entries','xetoEnv::MLibEntry[]',false)]),{}).am$('doFlattenUnloadedDepends',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:xetoEnv::MLibEntry]',false),new sys.Param('e','xetoEnv::MLibEntry',false)]),{}).am$('loadAllSync',2048,'sys::Void',xp,{}).am$('loadSyncWithDepends',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoEnv::MLibEntry',false)]),{}).am$('loadSync',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('entry','xetoEnv::MLibEntry',false)]),{}).am$('checkAllLoaded',128,'sys::Void',xp,{}).am$('loadAllAsync',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Err?,xeto::Lib[]?->sys::Void|',false)]),{}).am$('loadListAsync',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('toLoad','xetoEnv::MLibEntry[]',false),new sys.Param('f','|sys::Err?->sys::Void|',false)]),{}).am$('doLoadListAsync',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('toLoad','xetoEnv::MLibEntry[]',false),new sys.Param('index','sys::Int',false),new sys.Param('f','|sys::Err?->sys::Void|',false)]),{}).am$('doLoadSync',270337,'xetoEnv::XetoLib',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false)]),{}).am$('doLoadAsync',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false),new sys.Param('f','|sys::Err?,sys::Obj?->sys::Void|',false)]),{}).am$('type',271360,'xetoEnv::XetoSpec?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('spec',271360,'xetoEnv::XetoSpec?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('instance',271360,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('unqualifiedType',271360,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('global',271360,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('xmeta',271360,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('xmetaEnum',271360,'xeto::SpecEnum?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('eachType',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Spec->sys::Void|',false)]),{}).am$('eachInstance',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Dict->sys::Void|',false)]),{}).am$('eachInstanceThatIs',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false),new sys.Param('f','|xeto::Dict,xeto::Spec->sys::Void|',false)]),{}).am$('eachLibForIter',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xeto::Lib->sys::Void|',false)]),{}).am$('specOf',271360,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('fits',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('cx','xeto::XetoContext',false),new sys.Param('val','sys::Obj?',false),new sys.Param('spec','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('specFits',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','xeto::Spec',false),new sys.Param('b','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('queryWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('cx','xeto::XetoContext',false),new sys.Param('subject','xeto::Dict',false),new sys.Param('query','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',false),new sys.Param('f','|xeto::Dict->sys::Obj?|',false)]),{}).am$('instantiate',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('choice',271360,'xeto::SpecChoice',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('interfaceMethod',271360,'sys::Method?',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('methodName','sys::Str',false)]),{}).am$('interfaceMethodOn',271360,'sys::Method?',sys.List.make(sys.Param.type$,[new sys.Param('target','sys::Obj',false),new sys.Param('methodName','sys::Str',false)]),{}).am$('compileDicts',271360,'xeto::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('writeData',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('val','sys::Obj',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('print',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('out','sys::OutStream',true),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('eachSubtype',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ctype','xetoEnv::CSpec',false),new sys.Param('f','|xetoEnv::CSpec->sys::Void|',false)]),{}).am$('dump',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('digest$Once',133120,'sys::Str',xp,{});
MLibEntry.type$.af$('version',73730,'xeto::LibVersion',{}).af$('statusRef',67586,'concurrent::AtomicRef',{}).af$('loadRef',67586,'concurrent::AtomicRef',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('version','xeto::LibVersion',false)]),{}).am$('name',8192,'sys::Str',xp,{}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj',false)]),{}).am$('status',8192,'xeto::LibStatus',xp,{}).am$('err',8192,'sys::Err?',xp,{}).am$('get',8192,'xetoEnv::XetoLib',xp,{}).am$('setOk',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xetoEnv::XetoLib',false)]),{}).am$('setErr',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('err','sys::Err',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
RemoteNamespace.type$.af$('io',73730,'xetoEnv::XetoBinaryIO',{}).af$('libLoader',73730,'xetoEnv::RemoteLibLoader?',{}).am$('boot',40962,'xetoEnv::RemoteNamespace',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('base','xetoEnv::MNamespace?',false),new sys.Param('libLoader','xetoEnv::RemoteLibLoader?',false)]),{}).am$('make',132,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('io','xetoEnv::XetoBinaryIO',false),new sys.Param('base','xetoEnv::MNamespace?',false),new sys.Param('names','xeto::NameTable',false),new sys.Param('versions','xeto::LibVersion[]',false),new sys.Param('libLoader','xetoEnv::RemoteLibLoader?',false),new sys.Param('loadSys','|sys::This->xetoEnv::XetoLib|',false)]),{}).am$('isRemote',271360,'sys::Bool',xp,{}).am$('compileLib',271360,'xeto::Lib',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('compileData',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('src','sys::Str',false),new sys.Param('opts','xeto::Dict?',true)]),{}).am$('doLoadSync',271360,'xetoEnv::XetoLib',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false)]),{}).am$('doLoadAsync',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false),new sys.Param('f','|sys::Err?,sys::Obj?->sys::Void|',false)]),{});
RemoteLibLoader.type$.am$('loadLib',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('f','|sys::Err?,sys::Obj?->sys::Void|',false)]),{});
RemoteLibVersion.type$.af$('name',336898,'sys::Str',{}).af$('version',336898,'sys::Version',{}).af$('depends',336898,'xeto::LibDepend[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('version','sys::Version',false),new sys.Param('depends','xeto::LibDepend[]',false)]),{}).am$('doc',271360,'sys::Str',xp,{}).am$('file',271360,'sys::File?',sys.List.make(sys.Param.type$,[new sys.Param('checked','sys::Bool',true)]),{}).am$('isSrc',271360,'sys::Bool',xp,{}).am$('toStr',271360,'sys::Str',xp,{});
RSpec.type$.af$('libName',73730,'sys::Str',{}).af$('asm',336898,'xetoEnv::XetoSpec',{}).af$('name',336898,'sys::Str',{}).af$('nameCode',73730,'sys::Int',{}).af$('parent',73728,'xetoEnv::RSpec?',{}).af$('flavor',336896,'xeto::SpecFlavor',{}).af$('baseIn',73728,'xetoEnv::RSpecRef?',{}).af$('typeIn',73728,'xetoEnv::RSpecRef?',{}).af$('metaOwnIn',73728,'xeto::NameDict?',{}).af$('metaIn',73728,'xeto::NameDict?',{}).af$('metaInheritedIn',73728,'sys::Str[]?',{}).af$('slotsOwnIn',73728,'xetoEnv::RSpec[]?',{}).af$('slotsInheritedIn',73728,'xetoEnv::RSpecRef[]?',{}).af$('isLoaded',73728,'sys::Bool',{}).af$('type',73728,'xetoEnv::CSpec?',{}).af$('base',73728,'xetoEnv::CSpec?',{}).af$('metaOwn',73728,'xetoEnv::MNameDict?',{}).af$('meta',73728,'xetoEnv::MNameDict?',{}).af$('slotsOwn',73728,'xetoEnv::MSlots?',{}).af$('slots',73728,'xetoEnv::MSlots?',{}).af$('bindingRef',73728,'xeto::SpecBinding?',{}).af$('cof',336896,'xetoEnv::CSpec?',{}).af$('cofs',336896,'xetoEnv::CSpec[]?',{}).af$('args',336896,'xetoEnv::MSpecArgs',{}).af$('flags',336896,'sys::Int',{}).af$('readIndex',67584,'sys::Int',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('libName','sys::Str',false),new sys.Param('parent','xetoEnv::RSpec?',false),new sys.Param('nameCode','sys::Int',false),new sys.Param('name','sys::Str',false)]),{}).am$('hasSlots',271360,'sys::Bool',xp,{}).am$('isAst',271360,'sys::Bool',xp,{}).am$('qname',271360,'sys::Str',xp,{}).am$('id',271360,'haystack::Ref',xp,{}).am$('binding',271360,'xeto::SpecBinding',xp,{}).am$('ctype',271360,'xetoEnv::CSpec',xp,{}).am$('cbase',271360,'xetoEnv::CSpec?',xp,{}).am$('cparent',271360,'xetoEnv::CSpec?',xp,{}).am$('cmeta',271360,'xetoEnv::MNameDict',xp,{}).am$('cmetaHas',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('cslot',271360,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('cslots',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoEnv::CSpec,sys::Str->sys::Void|',false)]),{}).am$('cslotsWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|xetoEnv::CSpec,sys::Str->sys::Obj?|',false)]),{}).am$('cenum',271360,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('cisa',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::CSpec',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('isSys',9216,'sys::Bool',xp,{}).am$('isScalar',271360,'sys::Bool',xp,{}).am$('isMarker',271360,'sys::Bool',xp,{}).am$('isRef',271360,'sys::Bool',xp,{}).am$('isMultiRef',271360,'sys::Bool',xp,{}).am$('isChoice',271360,'sys::Bool',xp,{}).am$('isDict',271360,'sys::Bool',xp,{}).am$('isList',271360,'sys::Bool',xp,{}).am$('isMaybe',271360,'sys::Bool',xp,{}).am$('isQuery',271360,'sys::Bool',xp,{}).am$('isFunc',271360,'sys::Bool',xp,{}).am$('isInterface',271360,'sys::Bool',xp,{}).am$('isComp',271360,'sys::Bool',xp,{}).am$('isNone',271360,'sys::Bool',xp,{}).am$('isSelf',271360,'sys::Bool',xp,{}).am$('isEnum',271360,'sys::Bool',xp,{}).am$('isAnd',271360,'sys::Bool',xp,{}).am$('isOr',271360,'sys::Bool',xp,{}).am$('hasFlag',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('mask','sys::Int',false)]),{}).am$('readName',271360,'sys::Int',xp,{}).am$('readVal',271360,'sys::Obj?',xp,{});
RSpecRef.type$.af$('lib',73730,'sys::Int',{}).af$('type',73730,'sys::Int',{}).af$('slot',73730,'sys::Int',{}).af$('more',73730,'sys::Int[]?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','sys::Int',false),new sys.Param('type','sys::Int',false),new sys.Param('slot','sys::Int',false),new sys.Param('more','sys::Int[]?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
RemoteLoader.type$.af$('ns',73730,'xetoEnv::MNamespace',{}).af$('names',73730,'xeto::NameTable',{}).af$('loc',73730,'util::FileLoc',{}).af$('lib',73730,'xetoEnv::XetoLib',{}).af$('libName',73730,'sys::Str',{}).af$('libNameCode',73730,'sys::Int',{}).af$('libMeta',73730,'xetoEnv::MNameDict',{}).af$('libVersion',73730,'sys::Version',{}).af$('flags',73730,'sys::Int',{}).af$('tops',67584,'[sys::Str:xetoEnv::RSpec]',{}).af$('instances',67584,'[sys::Str:haystack::Dict]',{}).af$('bindings',67586,'xetoEnv::SpecBindings',{}).af$('bindingLoader',67584,'xetoEnv::SpecBindingLoader?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('libNameCode','sys::Int',false),new sys.Param('libMeta','xetoEnv::MNameDict',false),new sys.Param('flags','sys::Int',false)]),{}).am$('loadLib',8192,'xetoEnv::XetoLib',xp,{}).am$('addTop',8192,'xetoEnv::RSpec',sys.List.make(sys.Param.type$,[new sys.Param('nameCode','sys::Int',false)]),{}).am$('makeSlot',8192,'xetoEnv::RSpec',sys.List.make(sys.Param.type$,[new sys.Param('parent','xetoEnv::RSpec',false),new sys.Param('nameCode','sys::Int',false)]),{}).am$('addInstance',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','haystack::Dict',false)]),{}).am$('loadBindings',2048,'sys::Void',xp,{}).am$('assignBinding',2048,'xeto::SpecBinding',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::RSpec',false)]),{}).am$('loadTops',2048,'[sys::Str:xetoEnv::XetoSpec]',xp,{}).am$('loadSpec',2048,'xetoEnv::RSpec',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::RSpec',false)]),{}).am$('qname',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::RSpec',false)]),{}).am$('resolveMeta',2048,'xetoEnv::MNameDict',sys.List.make(sys.Param.type$,[new sys.Param('m','xeto::NameDict',false)]),{}).am$('loadSlotsOwn',2048,'xetoEnv::MSlots',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::RSpec',false)]),{}).am$('inheritMeta',2048,'xetoEnv::MNameDict',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::RSpec',false)]),{}).am$('inheritSlots',2048,'xetoEnv::MSlots',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::RSpec',false)]),{}).am$('inheritSlotsFromRefs',2048,'xetoEnv::MSlots',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::RSpec',false)]),{}).am$('loadArgs',2048,'xetoEnv::MSpecArgs',sys.List.make(sys.Param.type$,[new sys.Param('x','xetoEnv::RSpec',false)]),{}).am$('resolveRef',2048,'xeto::Spec',sys.List.make(sys.Param.type$,[new sys.Param('ref','xeto::Ref',false)]),{}).am$('resolveStr',2048,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('resolve',2048,'xetoEnv::CSpec?',sys.List.make(sys.Param.type$,[new sys.Param('ref','xetoEnv::RSpecRef?',false)]),{}).am$('resolveInternal',2048,'xetoEnv::CSpec',sys.List.make(sys.Param.type$,[new sys.Param('ref','xetoEnv::RSpecRef',false)]),{}).am$('resolveExternal',2048,'xetoEnv::XetoSpec',sys.List.make(sys.Param.type$,[new sys.Param('ref','xetoEnv::RSpecRef',false)]),{});
CheckVal.type$.af$('opts',73730,'xeto::Dict',{}).af$('fidelity',73730,'xetoEnv::XetoFidelity',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('opts','xeto::Dict',false)]),{}).am$('check',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::CSpec',false),new sys.Param('x','sys::Obj',false),new sys.Param('onErr','|sys::Str->sys::Void|',false)]),{}).am$('checkFixed',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::CSpec',false),new sys.Param('x','sys::Obj',false),new sys.Param('onErr','|sys::Str->sys::Void|',false)]),{}).am$('checkList',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::CSpec',false),new sys.Param('obj','sys::Obj',false),new sys.Param('onErr','|sys::Str->sys::Void|',false)]),{}).am$('checkScalar',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::CSpec',false),new sys.Param('x','sys::Obj',false),new sys.Param('onErr','|sys::Str->sys::Void|',false)]),{}).am$('checkNumber',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::CSpec',false),new sys.Param('x','haystack::Number',false),new sys.Param('onErr','|sys::Str->sys::Void|',false)]),{}).am$('checkEnum',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::CSpec',false),new sys.Param('x','sys::Obj',false),new sys.Param('onErr','|sys::Str->sys::Void|',false)]),{}).am$('checkStr',34818,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::CSpec',false),new sys.Param('x','sys::Str',false),new sys.Param('onErr','|sys::Str->sys::Void|',false)]),{}).am$('toInt',40962,'sys::Int?',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj?',false)]),{}).am$('errTypeForMeta',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('spec','xetoEnv::CSpec',false),new sys.Param('key','sys::Str',false),new sys.Param('val','sys::Obj',false)]),{});
Fitter.type$.af$('curId',73728,'xeto::Ref?',{}).af$('ns',67586,'xetoEnv::MNamespace',{}).af$('failFast',67586,'sys::Bool',{}).af$('opts',67586,'haystack::Dict',{}).af$('isGraph',67586,'sys::Bool',{}).af$('ignoreRefs',67586,'sys::Bool',{}).af$('checkVal',67586,'xetoEnv::CheckVal',{}).af$('cx',67584,'xeto::XetoContext',{}).af$('slotStack',67584,'sys::Str[]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('cx','xeto::XetoContext',false),new sys.Param('opts','haystack::Dict',false),new sys.Param('failFast','sys::Bool',true)]),{}).am$('specFits',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','xeto::Spec',false),new sys.Param('b','xeto::Spec',false)]),{}).am$('specFitsStruct',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','xeto::Spec',false),new sys.Param('b','xeto::Spec',false)]),{}).am$('valFits',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('spec','xeto::Spec',false)]),{}).am$('valTypeFits',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false),new sys.Param('valType','xeto::Spec',false),new sys.Param('val','sys::Obj',false)]),{}).am$('allowStrScalar',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('type','xeto::Spec',false)]),{}).am$('fitsStruct',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false),new sys.Param('type','xeto::Spec',false)]),{}).am$('fitsSlot',2048,'sys::Bool?',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false),new sys.Param('slot','xeto::Spec',false)]),{}).am$('fitsList',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj?[]',false),new sys.Param('spec','xeto::Spec',false)]),{}).am$('checkSlotAgainstGlobals',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj',false)]),{}).am$('checkNonSlotVal',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('name','sys::Str',false),new sys.Param('val','sys::Obj',false)]),{}).am$('fitsChoice',2048,'sys::Bool?',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false),new sys.Param('slot','xeto::Spec',false)]),{}).am$('fitsQuery',2048,'sys::Bool?',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false),new sys.Param('query','xeto::Spec',false)]),{}).am$('fitQueryConstraint',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('rec','haystack::Dict',false),new sys.Param('ofDis','sys::Str',false),new sys.Param('extent','haystack::Dict[]',false),new sys.Param('constraint','xeto::Spec',false)]),{}).am$('checkRefTarget',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('val','sys::Obj',false)]),{}).am$('doCheckRefTarget',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('of','xeto::Spec?',false),new sys.Param('ref','xeto::Ref',false)]),{}).am$('inSlot',8192,'sys::Bool',xp,{}).am$('slotName',8192,'sys::Str?',xp,{}).am$('push',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('slotName','sys::Str',false)]),{}).am$('pop',8192,'sys::Void',xp,{}).am$('explainNoType',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('explainInvalidType',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('valType','xeto::Spec',false)]),{}).am$('explainMissingSlot',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false)]),{}).am$('explainMissingQueryConstraint',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ofDis','sys::Str',false),new sys.Param('constraint','xeto::Spec',false)]),{}).am$('explainAmbiguousQueryConstraint',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ofDis','sys::Str',false),new sys.Param('constraint','xeto::Spec',false),new sys.Param('matches','haystack::Dict[]',false)]),{}).am$('explainValErr',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false),new sys.Param('msg','sys::Str',false)]),{}).am$('explainChoiceErr',270336,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false),new sys.Param('msg','sys::Str',false)]),{});
ExplainFitter.type$.af$('cb',67584,'|xeto::XetoLogRec->sys::Void|',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('cx','xeto::XetoContext',false),new sys.Param('opts','haystack::Dict',false),new sys.Param('cb','|xeto::XetoLogRec->sys::Void|',false)]),{}).am$('explainNoType',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('explainInvalidType',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('valType','xeto::Spec',false)]),{}).am$('explainMissingSlot',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false)]),{}).am$('explainMissingQueryConstraint',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ofDis','sys::Str',false),new sys.Param('constraint','xeto::Spec',false)]),{}).am$('explainAmbiguousQueryConstraint',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('ofDis','sys::Str',false),new sys.Param('constraint','xeto::Spec',false),new sys.Param('matches','haystack::Dict[]',false)]),{}).am$('explainValErr',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false),new sys.Param('msg','sys::Str',false)]),{}).am$('explainChoiceErr',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('slot','xeto::Spec',false),new sys.Param('msg','sys::Str',false)]),{}).am$('log',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('constraintToDis',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('constraint','xeto::Spec',false)]),{}).am$('recsToDis',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('recs','haystack::Dict[]',false)]),{});
XetoCompilerErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('cause','sys::Err?',true)]),{});
NotReadyErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true)]),{});
Printer.type$.af$('ns',73730,'xetoEnv::MNamespace',{}).af$('isStdout',73730,'sys::Bool',{}).af$('opts',73730,'xeto::Dict',{}).af$('escUnicode',73730,'sys::Bool',{}).af$('specMode',73730,'xetoEnv::PrinterSpecMode',{}).af$('showdoc',73730,'sys::Bool',{}).af$('width',73730,'sys::Int',{}).af$('height',73730,'sys::Int',{}).af$('theme',73730,'xetoEnv::PrinterTheme',{}).af$('out',67584,'sys::OutStream',{}).af$('indentation',67584,'sys::Int',{}).af$('lastnl',67584,'sys::Bool',{}).af$('inMeta',67584,'sys::Bool',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('out','sys::OutStream',false),new sys.Param('opts','xeto::Dict',false)]),{}).am$('print',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj?',false)]),{}).am$('val',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('list',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj?[]',false)]),{}).am$('dict',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('dict','xeto::Dict',false)]),{}).am$('pairs',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('dict','xeto::Dict',false),new sys.Param('skip','sys::Str[]?',true)]),{}).am$('ref',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('ref','haystack::Ref',false)]),{}).am$('grid',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('grid','haystack::Grid',false)]),{}).am$('table',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('cells','sys::Str[][]',false)]),{}).am$('lib',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::Lib',false)]),{}).am$('specTop',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('spec',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('mode','xetoEnv::PrinterSpecMode',false)]),{}).am$('specOwn',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('specEffective',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('base',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('meta',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('dict','xeto::Dict',false)]),{}).am$('slots',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('parent','xeto::Spec',false),new sys.Param('slots','xeto::SpecSlots',false),new sys.Param('mode','xetoEnv::PrinterSpecMode',false)]),{}).am$('doc',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('mode','xetoEnv::PrinterSpecMode',false)]),{}).am$('xetoTop',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false)]),{}).am$('isDictList',34818,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false)]),{}).am$('xeto',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false),new sys.Param('topIds','sys::Bool',true)]),{}).am$('xetoScalar',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('x','sys::Obj',false)]),{}).am$('xetoDict',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('x','xeto::Dict',false),new sys.Param('topIds','sys::Bool',false)]),{}).am$('xetoList',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false),new sys.Param('x','sys::Obj[]',false)]),{}).am$('json',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('jsonDict',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('dict','xeto::Dict',false)]),{}).am$('jsonList',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('list','sys::Obj?[]',false)]),{}).am$('jsonScalar',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('color',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('color','sys::Str?',false)]),{}).am$('colorEnd',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('color','sys::Str?',false)]),{}).am$('quoted',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('quote','sys::Str',true)]),{}).am$('bracket',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('symbol','sys::Str',false)]),{}).am$('colon',8192,'sys::This',xp,{}).am$('comma',8192,'sys::This',xp,{}).am$('comment',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('warn',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false)]),{}).am$('qname',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('w',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj',false)]),{}).am$('wc',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('char','sys::Int',false)]),{}).am$('nl',8192,'sys::This',xp,{}).am$('sp',8192,'sys::This',xp,{}).am$('indent',8192,'sys::This',xp,{}).am$('flush',8192,'sys::This',xp,{}).am$('specOf',2048,'xeto::Spec',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('isMarker',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('isNA',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('isNone',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false)]),{}).am$('opt',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{}).am$('optBool',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Bool',false)]),{}).am$('optInt',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Int',false)]),{}).am$('optSpecMode',8192,'xetoEnv::PrinterSpecMode',xp,{}).am$('terminalWidth',8192,'sys::Int',xp,{}).am$('terminalHeight',8192,'sys::Int',xp,{});
PrinterSpecMode.type$.af$('auto',106506,'xetoEnv::PrinterSpecMode',{}).af$('qname',106506,'xetoEnv::PrinterSpecMode',{}).af$('own',106506,'xetoEnv::PrinterSpecMode',{}).af$('effective',106506,'xetoEnv::PrinterSpecMode',{}).af$('vals',106498,'xetoEnv::PrinterSpecMode[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'xetoEnv::PrinterSpecMode?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
PrinterTheme.type$.af$('reset',106498,'sys::Str',{}).af$('black',106498,'sys::Str',{}).af$('red',106498,'sys::Str',{}).af$('green',106498,'sys::Str',{}).af$('yellow',106498,'sys::Str',{}).af$('blue',106498,'sys::Str',{}).af$('purple',106498,'sys::Str',{}).af$('cyan',106498,'sys::Str',{}).af$('white',106498,'sys::Str',{}).af$('none',106498,'xetoEnv::PrinterTheme',{}).af$('configuredRef',106498,'concurrent::AtomicRef',{}).af$('bracket',73730,'sys::Str?',{}).af$('str',73730,'sys::Str?',{}).af$('comment',73730,'sys::Str?',{}).af$('warn',73730,'sys::Str?',{}).am$('configured',40962,'xetoEnv::PrinterTheme',xp,{}).am$('loadConfigured',34818,'xetoEnv::PrinterTheme',xp,{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::This->sys::Void|',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
DependSolver.type$.af$('repo',73730,'xeto::LibRepo',{}).af$('targets',67584,'xeto::LibDepend[]',{}).af$('acc',67584,'[sys::Str:xeto::LibVersion]',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('targets','xeto::LibDepend[]',false)]),{}).am$('solve',8192,'xeto::LibVersion[]',xp,{}).am$('solveDepend',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('who','sys::Str',false),new sys.Param('d','xeto::LibDepend',false)]),{});
Query.type$.af$('ns',67586,'xetoEnv::MNamespace',{}).af$('opts',67586,'xeto::Dict',{}).af$('cx',67584,'xeto::XetoContext',{}).af$('fitter',67584,'xetoEnv::Fitter',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('cx','xeto::XetoContext',false),new sys.Param('opts','xeto::Dict',false)]),{}).am$('query',8192,'xeto::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('subject','xeto::Dict',false),new sys.Param('query','xeto::Spec',false)]),{}).am$('queryVia',2048,'xeto::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('subject','xeto::Dict',false),new sys.Param('of','xeto::Spec',false),new sys.Param('query','xeto::Spec',false),new sys.Param('via','sys::Str',false)]),{}).am$('traverseVia',2048,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('subject','xeto::Dict',false),new sys.Param('of','xeto::Spec',false),new sys.Param('via','sys::Str',false)]),{}).am$('queryInverse',2048,'xeto::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('subject','xeto::Dict',false),new sys.Param('of','xeto::Spec',false),new sys.Param('query','xeto::Spec',false),new sys.Param('inverseName','sys::Str',false)]),{}).am$('matchInverse',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('subjectId','sys::Obj',false),new sys.Param('rec','xeto::Dict',false),new sys.Param('via','sys::Str',false),new sys.Param('multiHop','sys::Bool',false)]),{}).am$('fits',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj?',false),new sys.Param('spec','xeto::Spec',false)]),{});
SpecBindings.type$.af$('curRef',100354,'concurrent::AtomicRef',{}).af$('dict',73730,'xetoEnv::DictBinding',{}).af$('loaders',67586,'concurrent::ConcurrentMap',{}).af$('loaded',67586,'concurrent::ConcurrentMap',{}).af$('specMap',67586,'concurrent::ConcurrentMap',{}).af$('typeMap',67586,'concurrent::ConcurrentMap',{}).am$('cur',40962,'xetoEnv::SpecBindings',xp,{}).am$('make',8196,'sys::Void',xp,{}).am$('initLoaders',2048,'sys::Void',xp,{}).am$('initBindings',2048,'sys::Void',xp,{}).am$('list',8192,'xeto::SpecBinding[]',xp,{}).am$('forSpec',8192,'xeto::SpecBinding?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false)]),{}).am$('forType',8192,'xeto::SpecBinding?',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('forTypeToSpec',8192,'xeto::Spec?',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('type','sys::Type',false)]),{}).am$('add',8192,'xeto::SpecBinding',sys.List.make(sys.Param.type$,[new sys.Param('b','xeto::SpecBinding',false)]),{}).am$('needsLoad',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('libName','sys::Str',false),new sys.Param('version','sys::Version',false)]),{}).am$('load',8192,'xetoEnv::SpecBindingLoader',sys.List.make(sys.Param.type$,[new sys.Param('libName','sys::Str',false),new sys.Param('version','sys::Version',false)]),{}).am$('loadKey',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('libName','sys::Str',false),new sys.Param('version','sys::Version',false)]),{}).am$('static$init',165890,'sys::Void',xp,{});
SpecBindingLoader.type$.am$('loadLib',270336,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','xetoEnv::SpecBindings',false),new sys.Param('libName','sys::Str',false)]),{}).am$('loadSpec',270336,'xeto::SpecBinding?',sys.List.make(sys.Param.type$,[new sys.Param('acc','xetoEnv::SpecBindings',false),new sys.Param('spec','xetoEnv::CSpec',false)]),{}).am$('loadSpecReflect',8192,'xeto::SpecBinding?',sys.List.make(sys.Param.type$,[new sys.Param('acc','xetoEnv::SpecBindings',false),new sys.Param('pod','sys::Pod',false),new sys.Param('spec','xetoEnv::CSpec',false)]),{}).am$('make',139268,'sys::Void',xp,{});
PodBindingLoader.type$.af$('pod',73730,'sys::Pod',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Pod',false)]),{}).am$('loadSpec',271360,'xeto::SpecBinding?',sys.List.make(sys.Param.type$,[new sys.Param('acc','xetoEnv::SpecBindings',false),new sys.Param('spec','xetoEnv::CSpec',false)]),{});
ObjBinding.type$.af$('spec',336898,'sys::Str',{}).af$('type',336898,'sys::Type',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('isScalar',271360,'sys::Bool',xp,{}).am$('isDict',271360,'sys::Bool',xp,{}).am$('decodeDict',271360,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('xeto','xeto::Dict',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('xeto','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('encodeScalar',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('isInheritable',271360,'sys::Bool',xp,{});
DictBinding.type$.af$('spec',336898,'sys::Str',{}).af$('type',336898,'sys::Type',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','sys::Str',false),new sys.Param('type','sys::Type',true)]),{}).am$('isScalar',271360,'sys::Bool',xp,{}).am$('isDict',271360,'sys::Bool',xp,{}).am$('decodeDict',271360,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('xeto','xeto::Dict',false)]),{}).am$('decodeScalar',9216,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('xeto','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('encodeScalar',9216,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('isInheritable',271360,'sys::Bool',xp,{});
ScalarBinding.type$.af$('spec',336898,'sys::Str',{}).af$('type',336898,'sys::Type',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','sys::Str',false),new sys.Param('type','sys::Type',false)]),{}).am$('isScalar',271360,'sys::Bool',xp,{}).am$('isDict',271360,'sys::Bool',xp,{}).am$('decodeDict',9216,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('xeto','xeto::Dict',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('xeto','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('encodeScalar',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('isInheritable',271360,'sys::Bool',xp,{});
CompBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','sys::Str',false),new sys.Param('type','sys::Type',false)]),{}).am$('clone',270336,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('spec','sys::Str',false),new sys.Param('type','sys::Type',false)]),{});
ImplDictBinding.type$.af$('impl',73730,'sys::Type',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','sys::Str',false),new sys.Param('type','sys::Type',false)]),{}).am$('decodeDict',271360,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('xeto','xeto::Dict',false)]),{});
SingletonBinding.type$.af$('val',73730,'sys::Obj',{}).af$('altStr',73730,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','sys::Str',false),new sys.Param('type','sys::Type',false),new sys.Param('val','sys::Obj',false),new sys.Param('altStr','sys::Str?',true)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
GenericScalarBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('spec','sys::Str',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
BoolBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
BufBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('encodeScalar',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('v','sys::Obj',false)]),{});
CompLayoutBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
CoordBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
DateBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
DateTimeBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
DurationBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
FilterBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
FloatBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
IntBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
LibDependVersionsBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
MarkerBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{});
NABinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{});
NoneBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{});
NumberBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
RefBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
SpanBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
SpanModeBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
StrBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
SymbolBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
TimeBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
TimeZoneBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
UnitBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
UnitQuantityBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
UriBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
VersionBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeScalar',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{});
LibDependBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeDict',271360,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('xeto','xeto::Dict',false)]),{});
LinkBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeDict',271360,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('xeto','xeto::Dict',false)]),{});
LinksBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeDict',271360,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('xeto','xeto::Dict',false)]),{});
SpecDictBinding.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('decodeDict',271360,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('xeto','xeto::Dict',false)]),{});
MLibDepend.type$.af$('name',336898,'sys::Str',{}).af$('versions',336898,'xeto::LibDependVersions',{}).af$('loc',73730,'util::FileLoc',{}).af$('specRef$Store',755712,'sys::Obj?',{}).am$('makeFields',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('versions','xeto::LibDependVersions',true),new sys.Param('loc','util::FileLoc',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('dict','haystack::Dict',false)]),{}).am$('specRef',565250,'haystack::Ref',xp,{}).am$('isEmpty',271360,'sys::Bool',xp,{}).am$('get',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('def','sys::Obj?',true)]),{'sys::Operator':""}).am$('has',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('missing',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('trap',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false),new sys.Param('a','sys::Obj?[]?',true)]),{}).am$('each',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Void|',false)]),{}).am$('eachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('f','|sys::Obj,sys::Str->sys::Obj?|',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('specRef$Once',165890,'haystack::Ref',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
XetoLog.type$.am$('makeOutStream',40966,'xetoEnv::XetoLog?',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('makeLog',40966,'xetoEnv::XetoLog?',sys.List.make(sys.Param.type$,[new sys.Param('log','sys::Log',false)]),{}).am$('info',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('warn',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('err','sys::Err?',true)]),{}).am$('err',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('err','sys::Err?',true)]),{}).am$('log',270337,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::LogLevel',false),new sys.Param('id','xeto::Ref?',false),new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('cause','sys::Err?',false)]),{}).am$('make',139268,'sys::Void',xp,{});
XetoOutStreamLog.type$.af$('out',67584,'sys::OutStream',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('log',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::LogLevel',false),new sys.Param('id','xeto::Ref?',false),new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('err','sys::Err?',false)]),{});
XetoWrapperLog.type$.af$('wrap',73730,'sys::Log',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('wrap','sys::Log',false)]),{}).am$('log',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::LogLevel',false),new sys.Param('id','xeto::Ref?',false),new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('err','sys::Err?',false)]),{});
XetoCallbackLog.type$.af$('cb',67584,'|xeto::XetoLogRec->sys::Void|',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cb','|xeto::XetoLogRec->sys::Void|',false)]),{}).am$('log',271360,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('level','sys::LogLevel',false),new sys.Param('id','xeto::Ref?',false),new sys.Param('msg','sys::Str',false),new sys.Param('loc','util::FileLoc',false),new sys.Param('err','sys::Err?',false)]),{});
XMeta.type$.af$('ns',73730,'xetoEnv::MNamespace',{}).af$('libs$Store',722944,'sys::Obj?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false)]),{}).am$('libs',532480,'xeto::Lib[]',xp,{}).am$('xmeta',8192,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('xmetaEnum',8192,'xeto::SpecEnum?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('addInheritanceInstanceNames',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Str]',false),new sys.Param('x','xeto::Spec',false)]),{}).am$('instanceName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('spec','xeto::Spec',false)]),{}).am$('merge',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false),new sys.Param('xmeta','xeto::Dict?',false)]),{}).am$('libs$Once',133120,'xeto::Lib[]',xp,{});
XetoUtil.type$.af$('reservedLibMetaNames$Store',755712,'sys::Obj?',{}).af$('reservedSpecMetaNames$Store',755712,'sys::Obj?',{}).am$('isLibName',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('libNameErr',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('isSpecName',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('isAutoName',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('camelToDotted',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('dot','sys::Int',true)]),{}).am$('camelToDashed',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('dottedToCamel',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('dot','sys::Int',true)]),{}).am$('dashedToCamel',40962,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('qnameToName',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Obj',false)]),{}).am$('qnameToLib',40962,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('qname','sys::Obj',false)]),{}).am$('qnamesToLibs',40962,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('qnames','sys::Obj[]',false)]),{}).am$('dataToLibs',40962,'sys::Str[]',sys.List.make(sys.Param.type$,[new sys.Param('recs','xeto::Dict[]',false)]),{}).am$('isReservedSpecName',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('isReservedInstanceName',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('isReservedLibMetaName',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('isReservedSpecMetaName',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('isReservedMetaName',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('n','sys::Str',false)]),{}).am$('reservedLibMetaNames',559106,'[sys::Str:sys::Str]',xp,{}).am$('reservedSpecMetaNames',559106,'[sys::Str:sys::Str]',xp,{}).am$('srcToWorkDir',40962,'sys::File?',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false)]),{}).am$('srcToLibDir',40962,'sys::File?',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false)]),{}).am$('srcToLibZip',40962,'sys::File?',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false)]),{}).am$('toFloat',40962,'sys::Float?',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{}).am$('optBool',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('opts','xeto::Dict?',false),new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Bool',false)]),{}).am$('optInt',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('opts','xeto::Dict?',false),new sys.Param('name','sys::Str',false),new sys.Param('def','sys::Int',false)]),{}).am$('optLog',40962,'|xeto::XetoLogRec->sys::Void|?',sys.List.make(sys.Param.type$,[new sys.Param('opts','xeto::Dict?',false),new sys.Param('name','sys::Str',false)]),{}).am$('optFidelity',40962,'xetoEnv::XetoFidelity',sys.List.make(sys.Param.type$,[new sys.Param('opts','xeto::Dict?',false)]),{}).am$('addOwnMeta',40962,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false),new sys.Param('own','xeto::Dict',false)]),{}).am$('isa',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','xetoEnv::CSpec',false),new sys.Param('b','xetoEnv::CSpec',false),new sys.Param('isTop','sys::Bool',true)]),{}).am$('excludeSupertypes',40962,'xetoEnv::CSpec[]',sys.List.make(sys.Param.type$,[new sys.Param('list','xetoEnv::CSpec[]',false)]),{}).am$('commonSupertype',40962,'xeto::Spec',sys.List.make(sys.Param.type$,[new sys.Param('specs','xeto::Spec[]',false)]),{}).am$('commonSupertypeBetween',40962,'xeto::Spec',sys.List.make(sys.Param.type$,[new sys.Param('a','xeto::Spec',false),new sys.Param('b','xeto::Spec',false)]),{}).am$('toHaystack',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{}).am$('toHaystackDict',40962,'xeto::Dict',sys.List.make(sys.Param.type$,[new sys.Param('x','xeto::Dict',false)]),{}).am$('toHaystackList',40962,'sys::List',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::List',false)]),{}).am$('instantiate',40962,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('spec','xetoEnv::XetoSpec',false),new sys.Param('opts','xeto::Dict',false)]),{}).am$('instantiateEnumDefault',34818,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('slot','xetoEnv::XetoSpec',false)]),{}).am$('instantiateList',34818,'sys::List',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('spec','xetoEnv::XetoSpec',false),new sys.Param('opts','xeto::Dict',false)]),{}).am$('instantiateScalar',34818,'sys::Obj',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('spec','xetoEnv::XetoSpec',false),new sys.Param('opts','xeto::Dict',false)]),{}).am$('instantiateGraph',34818,'xeto::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('ns','xetoEnv::MNamespace',false),new sys.Param('spec','xetoEnv::XetoSpec',false),new sys.Param('opts','xeto::Dict',false),new sys.Param('dict','xeto::Dict',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('reservedLibMetaNames$Once',165890,'[sys::Str:sys::Str]',xp,{}).am$('reservedSpecMetaNames$Once',165890,'[sys::Str:sys::Str]',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
XetoFidelity.type$.af$('full',106506,'xetoEnv::XetoFidelity',{}).af$('haystack',106506,'xetoEnv::XetoFidelity',{}).af$('json',106506,'xetoEnv::XetoFidelity',{}).af$('vals',106498,'xetoEnv::XetoFidelity[]',{}).am$('coerce',8192,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'xetoEnv::XetoFidelity?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "xetoEnv");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;util 1.0;xeto 3.1.11;haystack 3.1.11");
m.set("pod.summary", "Xeto environment implementation");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "brian");
m.set("build.user", "brian");
m.set("build.ts", "2024-12-10T14:31:25-05:00 New_York");
m.set("build.tsKey", "241210143125");
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
  CNamespace,
  CNode,
  CSpec,
  MCompSpi,
  CompSpaceActor,
  CompSpace,
  CompUtil,
  Exporter,
  JsonExporter,
  RdfExporter,
  GridExporter,
  MDictMerge1,
  MSpec,
  MGlobal,
  MSlots,
  MSpecFlags,
  MMetaSpec,
  MSys,
  MNameDict,
  MSpecArgs,
  MSpecArgsOf,
  MSpecArgsOfs,
  MChoice,
  MType,
  MLib,
  MLibFlags,
  XetoLib,
  MLibFiles,
  UnsupportedLibFiles,
  EmptyLibFiles,
  DirLibFiles,
  ZipLibFiles,
  XetoSpec,
  MEnum,
  MEnumXMeta,
  XetoBinaryConst,
  XetoBinaryReader,
  XetoBinaryIO,
  XetoBinaryWriter,
  MNamespace,
  RemoteNamespace,
  RemoteLibLoader,
  CheckVal,
  XetoCompilerErr,
  NotReadyErr,
  Printer,
  PrinterSpecMode,
  PrinterTheme,
  DependSolver,
  SpecBindings,
  SpecBindingLoader,
  PodBindingLoader,
  DictBinding,
  ScalarBinding,
  CompBinding,
  ImplDictBinding,
  GenericScalarBinding,
  MLibDepend,
  XetoLog,
  XetoOutStreamLog,
  XetoWrapperLog,
  XetoCallbackLog,
  XetoUtil,
  XetoFidelity,
};
