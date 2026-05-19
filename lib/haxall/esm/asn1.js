// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as math from './math.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class AsnObj extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnObj.type$; }

  #tags = null;

  tags() { return this.#tags; }

  __tags(it) { if (it === undefined) return this.#tags; else this.#tags = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(tags,val) {
    const $self = new AsnObj();
    AsnObj.make$($self,tags,val);
    return $self;
  }

  static make$($self,tags,val) {
    const this$ = $self;
    let idx = tags.findIndex((tag) => {
      return tag.cls().isUniv();
    });
    if (idx == null) {
      throw sys.ArgErr.make("No UNIVERSAL tag specified");
    }
    ;
    if (sys.ObjUtil.compareNE(idx, sys.Int.minus(tags.size(), 1))) {
      throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("UNIVERSAL tag must be last: ", sys.ObjUtil.coerce(idx, sys.Obj.type$.toNullable())), " != "), sys.ObjUtil.coerce(sys.Int.minus(tags.size(), 1), sys.Obj.type$.toNullable())));
    }
    ;
    $self.#tags = sys.ObjUtil.coerce(((this$) => { let $_u0 = tags; if ($_u0 == null) return null; return sys.ObjUtil.toImmutable(tags); })($self), sys.Type.find("asn1::AsnTag[]"));
    $self.#val = ((this$) => { let $_u1 = val; if ($_u1 == null) return null; return sys.ObjUtil.toImmutable(val); })($self);
    return;
  }

  bool() {
    return sys.ObjUtil.coerce(this.#val, sys.Bool.type$);
  }

  isBool() {
    return sys.ObjUtil.equals(this.univTag(), AsnTag.univBool());
  }

  int() {
    if (sys.ObjUtil.is(this.#val, math.BigInt.type$)) {
      return sys.ObjUtil.coerce(this.#val, math.BigInt.type$).toInt();
    }
    ;
    return sys.ObjUtil.coerce(this.#val, sys.Int.type$);
  }

  isInt() {
    return sys.ObjUtil.equals(this.univTag(), AsnTag.univInt());
  }

  bigInt() {
    if (sys.ObjUtil.is(this.#val, sys.Int.type$)) {
      return math.BigInt.makeInt(sys.ObjUtil.coerce(this.#val, sys.Int.type$));
    }
    ;
    return sys.ObjUtil.coerce(this.#val, math.BigInt.type$);
  }

  buf() {
    throw AsnErr.make(sys.Str.plus("Not a binary type: ", sys.ObjUtil.typeof(this)));
  }

  isOcts() {
    return sys.ObjUtil.equals(this.univTag(), AsnTag.univOcts());
  }

  isNull() {
    return (this.#val == null && sys.ObjUtil.equals(this.univTag(), AsnTag.univNull()));
  }

  oid() {
    return sys.ObjUtil.coerce(this, AsnOid.type$);
  }

  isOid() {
    return sys.ObjUtil.equals(this.univTag(), AsnTag.univOid());
  }

  str() {
    return sys.ObjUtil.coerce(this.#val, sys.Str.type$);
  }

  ts() {
    return sys.ObjUtil.coerce(this.#val, sys.DateTime.type$);
  }

  coll() {
    return sys.ObjUtil.coerce(this, AsnColl.type$);
  }

  seq() {
    return sys.ObjUtil.coerce(this, AsnSeq.type$);
  }

  isAny() {
    return false;
  }

  push(tag) {
    return sys.ObjUtil.coerce(sys.ObjUtil.typeof(this).method("make").call(sys.List.make(AsnTag.type$, [tag]).addAll(this.#tags), this.#val), AsnObj.type$);
  }

  effectiveTags() {
    const this$ = this;
    let acc = sys.List.make(AsnTag.type$);
    let prev = null;
    this.#tags.each((tag) => {
      if (prev == null) {
        acc.add(tag);
      }
      else {
        if (prev.mode() === AsnTagMode.explicit()) {
          acc.add(tag);
        }
        ;
      }
      ;
      (prev = tag);
      return;
    });
    return acc;
  }

  tag() {
    let etags = this.effectiveTags();
    if (sys.ObjUtil.compareGT(etags.size(), 1)) {
      throw AsnErr.make(sys.Str.plus("Multiple effective tags: ", etags));
    }
    ;
    return sys.ObjUtil.coerce(etags.first(), AsnTag.type$);
  }

  univTag() {
    return sys.ObjUtil.coerce(this.#tags.last(), AsnTag.type$);
  }

  isPrimitive() {
    let $_u2 = this.univTag();
    if (sys.ObjUtil.equals($_u2, AsnTag.univSeq()) || sys.ObjUtil.equals($_u2, AsnTag.univSet())) {
      return false;
    }
    else {
      return true;
    }
    ;
  }

  hash() {
    let res = sys.Int.plus(31, this.#tags.hash());
    (res = sys.Int.plus(sys.Int.mult(res, 31), this.valHash()));
    return res;
  }

  valHash() {
    return sys.ObjUtil.coerce(((this$) => { let $_u3 = ((this$) => { let $_u4 = this$.#val; if ($_u4 == null) return null; return sys.ObjUtil.hash(this$.#val); })(this$); if ($_u3 != null) return $_u3; return sys.ObjUtil.coerce(0, sys.Int.type$.toNullable()); })(this), sys.Int.type$);
  }

  equals(obj) {
    const this$ = this;
    if (this === obj) {
      return true;
    }
    ;
    let that = sys.ObjUtil.as(obj, AsnObj.type$);
    if (that == null) {
      return false;
    }
    ;
    let these = this.#tags;
    let those = that.#tags;
    if (sys.ObjUtil.compareNE(these.size(), those.size())) {
      return false;
    }
    ;
    let eq = these.all((t,i) => {
      return t.strictEquals(those.get(i));
    });
    if (!eq) {
      return false;
    }
    ;
    return this.valEquals(sys.ObjUtil.coerce(that, AsnObj.type$));
  }

  valEquals(that) {
    return sys.ObjUtil.equals(this.#val, that.#val);
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#tags), " "), this.valStr());
  }

  valStr() {
    return sys.Str.plus("", this.#val);
  }

}

class AsnTag extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnTag.type$; }

  #cls = null;

  cls() { return this.#cls; }

  __cls(it) { if (it === undefined) return this.#cls; else this.#cls = it; }

  #id = 0;

  id() { return this.#id; }

  __id(it) { if (it === undefined) return this.#id; else this.#id = it; }

  #mode = null;

  mode() { return this.#mode; }

  __mode(it) { if (it === undefined) return this.#mode; else this.#mode = it; }

  static #univAny = undefined;

  static univAny() {
    if (AsnTag.#univAny === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univAny === undefined) AsnTag.#univAny = null;
    }
    return AsnTag.#univAny;
  }

  static #univBool = undefined;

  static univBool() {
    if (AsnTag.#univBool === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univBool === undefined) AsnTag.#univBool = null;
    }
    return AsnTag.#univBool;
  }

  static #univInt = undefined;

  static univInt() {
    if (AsnTag.#univInt === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univInt === undefined) AsnTag.#univInt = null;
    }
    return AsnTag.#univInt;
  }

  static #univBits = undefined;

  static univBits() {
    if (AsnTag.#univBits === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univBits === undefined) AsnTag.#univBits = null;
    }
    return AsnTag.#univBits;
  }

  static #univOcts = undefined;

  static univOcts() {
    if (AsnTag.#univOcts === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univOcts === undefined) AsnTag.#univOcts = null;
    }
    return AsnTag.#univOcts;
  }

  static #univNull = undefined;

  static univNull() {
    if (AsnTag.#univNull === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univNull === undefined) AsnTag.#univNull = null;
    }
    return AsnTag.#univNull;
  }

  static #univOid = undefined;

  static univOid() {
    if (AsnTag.#univOid === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univOid === undefined) AsnTag.#univOid = null;
    }
    return AsnTag.#univOid;
  }

  static #univReal = undefined;

  static univReal() {
    if (AsnTag.#univReal === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univReal === undefined) AsnTag.#univReal = null;
    }
    return AsnTag.#univReal;
  }

  static #univEnum = undefined;

  static univEnum() {
    if (AsnTag.#univEnum === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univEnum === undefined) AsnTag.#univEnum = null;
    }
    return AsnTag.#univEnum;
  }

  static #univUtf8 = undefined;

  static univUtf8() {
    if (AsnTag.#univUtf8 === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univUtf8 === undefined) AsnTag.#univUtf8 = null;
    }
    return AsnTag.#univUtf8;
  }

  static #univSeq = undefined;

  static univSeq() {
    if (AsnTag.#univSeq === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univSeq === undefined) AsnTag.#univSeq = null;
    }
    return AsnTag.#univSeq;
  }

  static #univSet = undefined;

  static univSet() {
    if (AsnTag.#univSet === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univSet === undefined) AsnTag.#univSet = null;
    }
    return AsnTag.#univSet;
  }

  static #univPrintStr = undefined;

  static univPrintStr() {
    if (AsnTag.#univPrintStr === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univPrintStr === undefined) AsnTag.#univPrintStr = null;
    }
    return AsnTag.#univPrintStr;
  }

  static #univIa5Str = undefined;

  static univIa5Str() {
    if (AsnTag.#univIa5Str === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univIa5Str === undefined) AsnTag.#univIa5Str = null;
    }
    return AsnTag.#univIa5Str;
  }

  static #univUtcTime = undefined;

  static univUtcTime() {
    if (AsnTag.#univUtcTime === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univUtcTime === undefined) AsnTag.#univUtcTime = null;
    }
    return AsnTag.#univUtcTime;
  }

  static #univGenTime = undefined;

  static univGenTime() {
    if (AsnTag.#univGenTime === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univGenTime === undefined) AsnTag.#univGenTime = null;
    }
    return AsnTag.#univGenTime;
  }

  static #univGraphStr = undefined;

  static univGraphStr() {
    if (AsnTag.#univGraphStr === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univGraphStr === undefined) AsnTag.#univGraphStr = null;
    }
    return AsnTag.#univGraphStr;
  }

  static #univVisStr = undefined;

  static univVisStr() {
    if (AsnTag.#univVisStr === undefined) {
      AsnTag.static$init();
      if (AsnTag.#univVisStr === undefined) AsnTag.#univVisStr = null;
    }
    return AsnTag.#univVisStr;
  }

  static univ(id) {
    return AsnTagBuilder.make().univ().id(id);
  }

  static context(id) {
    return AsnTagBuilder.make().context().id(id);
  }

  static app(id) {
    return AsnTagBuilder.make().app().id(id);
  }

  static priv(id) {
    return AsnTagBuilder.make().priv().id(id);
  }

  static make(cls,id,mode) {
    const $self = new AsnTag();
    AsnTag.make$($self,cls,id,mode);
    return $self;
  }

  static make$($self,cls,id,mode) {
    $self.#cls = cls;
    $self.#id = id;
    $self.#mode = mode;
    return;
  }

  toCls(newCls) {
    return AsnTag.make(newCls, this.#id, this.#mode);
  }

  toId(newId) {
    return AsnTag.make(this.#cls, newId, this.#mode);
  }

  hash() {
    let res = sys.Int.plus(31, sys.ObjUtil.hash(this.#cls));
    (res = sys.Int.plus(sys.Int.mult(31, res), this.#id));
    return res;
  }

  equals(obj) {
    if (this === obj) {
      return true;
    }
    ;
    let that = sys.ObjUtil.as(obj, AsnTag.type$);
    if (that == null) {
      return false;
    }
    ;
    if (this.#cls !== that.#cls) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(this.#id, that.#id)) {
      return false;
    }
    ;
    return true;
  }

  strictEquals(obj) {
    if (this === obj) {
      return true;
    }
    ;
    let that = sys.ObjUtil.as(obj, AsnTag.type$);
    if (that == null) {
      return false;
    }
    ;
    if (this.#cls !== that.#cls) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(this.#id, that.#id)) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(this.#mode, that.#mode)) {
      return false;
    }
    ;
    return true;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("<", this.#cls), ", "), sys.ObjUtil.coerce(this.#id, sys.Obj.type$.toNullable())), ", "), this.#mode), ">");
  }

  static static$init() {
    AsnTag.#univAny = AsnTag.univ(-1).explicit();
    AsnTag.#univBool = AsnTag.univ(1).explicit();
    AsnTag.#univInt = AsnTag.univ(2).explicit();
    AsnTag.#univBits = AsnTag.univ(3).explicit();
    AsnTag.#univOcts = AsnTag.univ(4).explicit();
    AsnTag.#univNull = AsnTag.univ(5).explicit();
    AsnTag.#univOid = AsnTag.univ(6).explicit();
    AsnTag.#univReal = AsnTag.univ(9).explicit();
    AsnTag.#univEnum = AsnTag.univ(10).explicit();
    AsnTag.#univUtf8 = AsnTag.univ(12).explicit();
    AsnTag.#univSeq = AsnTag.univ(16).explicit();
    AsnTag.#univSet = AsnTag.univ(17).explicit();
    AsnTag.#univPrintStr = AsnTag.univ(19).explicit();
    AsnTag.#univIa5Str = AsnTag.univ(22).explicit();
    AsnTag.#univUtcTime = AsnTag.univ(23).explicit();
    AsnTag.#univGenTime = AsnTag.univ(24).explicit();
    AsnTag.#univGraphStr = AsnTag.univ(25).explicit();
    AsnTag.#univVisStr = AsnTag.univ(26).explicit();
    return;
  }

}

class AsnTagClass extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnTagClass.type$; }

  static univ() { return AsnTagClass.vals().get(0); }

  static app() { return AsnTagClass.vals().get(1); }

  static context() { return AsnTagClass.vals().get(2); }

  static priv() { return AsnTagClass.vals().get(3); }

  static #vals = undefined;

  #mask = 0;

  mask() { return this.#mask; }

  __mask(it) { if (it === undefined) return this.#mask; else this.#mask = it; }

  static make($ordinal,$name,mask) {
    const $self = new AsnTagClass();
    AsnTagClass.make$($self,$ordinal,$name,mask);
    return $self;
  }

  static make$($self,$ordinal,$name,mask) {
    sys.Enum.make$($self, $ordinal, $name);
    $self.#mask = mask;
    return;
  }

  isUniv() {
    return this === AsnTagClass.univ();
  }

  isApp() {
    return this === AsnTagClass.app();
  }

  isContext() {
    return this === AsnTagClass.context();
  }

  isPriv() {
    return this === AsnTagClass.priv();
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(AsnTagClass.type$, AsnTagClass.vals(), name$, checked);
  }

  static vals() {
    if (AsnTagClass.#vals == null) {
      AsnTagClass.#vals = sys.List.make(AsnTagClass.type$, [
        AsnTagClass.make(0, "univ", 0),
        AsnTagClass.make(1, "app", 64),
        AsnTagClass.make(2, "context", 128),
        AsnTagClass.make(3, "priv", 192),
      ]).toImmutable();
    }
    return AsnTagClass.#vals;
  }

  static static$init() {
    const $_u5 = AsnTagClass.vals();
    if (true) {
    }
    ;
    return;
  }

}

class AsnTagMode extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnTagMode.type$; }

  static explicit() { return AsnTagMode.vals().get(0); }

  static implicit() { return AsnTagMode.vals().get(1); }

  static #vals = undefined;

  static make($ordinal,$name) {
    const $self = new AsnTagMode();
    AsnTagMode.make$($self,$ordinal,$name);
    return $self;
  }

  static make$($self,$ordinal,$name) {
    sys.Enum.make$($self, $ordinal, $name);
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(AsnTagMode.type$, AsnTagMode.vals(), name$, checked);
  }

  static vals() {
    if (AsnTagMode.#vals == null) {
      AsnTagMode.#vals = sys.List.make(AsnTagMode.type$, [
        AsnTagMode.make(0, "explicit", ),
        AsnTagMode.make(1, "implicit", ),
      ]).toImmutable();
    }
    return AsnTagMode.#vals;
  }

  static static$init() {
    const $_u6 = AsnTagMode.vals();
    if (true) {
    }
    ;
    return;
  }

}

class AsnTagBuilder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnTagBuilder.type$; }

  #cls = null;

  // private field reflection only
  __cls(it) { if (it === undefined) return this.#cls; else this.#cls = it; }

  #identifier = null;

  // private field reflection only
  __identifier(it) { if (it === undefined) return this.#identifier; else this.#identifier = it; }

  static make() {
    const $self = new AsnTagBuilder();
    AsnTagBuilder.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  univ() {
    this.#cls = AsnTagClass.univ();
    return this;
  }

  context() {
    this.#cls = AsnTagClass.context();
    return this;
  }

  app() {
    this.#cls = AsnTagClass.app();
    return this;
  }

  priv() {
    this.#cls = AsnTagClass.priv();
    return this;
  }

  id(id) {
    this.#identifier = sys.ObjUtil.coerce(id, sys.Int.type$.toNullable());
    return this;
  }

  explicit() {
    this.check();
    return AsnTag.make(sys.ObjUtil.coerce(this.#cls, AsnTagClass.type$), sys.ObjUtil.coerce(this.#identifier, sys.Int.type$), AsnTagMode.explicit());
  }

  implicit() {
    this.check();
    return AsnTag.make(sys.ObjUtil.coerce(this.#cls, AsnTagClass.type$), sys.ObjUtil.coerce(this.#identifier, sys.Int.type$), AsnTagMode.implicit());
  }

  check() {
    if (this.#cls == null) {
      throw AsnErr.make("Tag class is not configured");
    }
    ;
    if (this.#identifier == null) {
      throw AsnErr.make("Tag identifier not configured");
    }
    ;
    return;
  }

}

class Asn extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Asn.type$; }

  static #Null = undefined;

  static Null() {
    if (Asn.#Null === undefined) {
      Asn.static$init();
      if (Asn.#Null === undefined) Asn.#Null = null;
    }
    return Asn.#Null;
  }

  static builder() {
    return AsnObjBuilder.make();
  }

  static tag(tag) {
    return Asn.builder().tag(tag);
  }

  static bool(val) {
    return Asn.builder().bool(val);
  }

  static int(val) {
    return Asn.builder().int(val);
  }

  static bits(bits) {
    return Asn.builder().bits(bits);
  }

  static octets(val) {
    return Asn.builder().octets(val);
  }

  static oid(val) {
    return Asn.builder().oid(val);
  }

  static asnEnum(val) {
    return Asn.builder().asnEnum(val);
  }

  static utf8(val) {
    return Asn.builder().utf8(val);
  }

  static str(val,univ) {
    return Asn.builder().str(val, univ);
  }

  static utc(ts) {
    return Asn.builder().utc(ts);
  }

  static genTime(ts) {
    return Asn.builder().genTime(ts);
  }

  static seq(items) {
    return Asn.builder().seq(items);
  }

  static set(items) {
    return Asn.builder().set(items);
  }

  static any(raw) {
    return AsnBin.make(sys.List.make(AsnTag.type$, [AsnTag.univAny()]), raw);
  }

  static make() {
    const $self = new Asn();
    Asn.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

  static static$init() {
    Asn.#Null = AsnObj.make(sys.List.make(AsnTag.type$, [AsnTag.univNull()]), null);
    return;
  }

}

class AsnObjBuilder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnObjBuilder.type$; }

  #tags = null;

  // private field reflection only
  __tags(it) { if (it === undefined) return this.#tags; else this.#tags = it; }

  static make() {
    const $self = new AsnObjBuilder();
    AsnObjBuilder.make$($self);
    return $self;
  }

  static make$($self) {
    $self.#tags = sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("asn1::AsnTag[]"));
    return;
  }

  tag(tag) {
    if (tag != null) {
      this.#tags.add(sys.ObjUtil.coerce(tag, AsnTag.type$));
    }
    ;
    return this;
  }

  bool(val) {
    return this.finish(AsnObj.make(this.etags(AsnTag.univBool()), sys.ObjUtil.coerce(val, sys.Obj.type$.toNullable())));
  }

  int(val) {
    if (sys.ObjUtil.is(val, sys.Int.type$)) {
      (val = math.BigInt.makeInt(sys.ObjUtil.coerce(val, sys.Int.type$)));
    }
    ;
    if (sys.ObjUtil.is(val, math.BigInt.type$)) {
      return this.finish(AsnObj.make(this.etags(AsnTag.univInt()), val));
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot create INTEGER from ", val), " ("), sys.ObjUtil.typeof(val)), ")"));
  }

  bits(bits) {
    return this.finish(AsnBin.make(this.etags(AsnTag.univBits()), bits));
  }

  octets(val) {
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      (val = sys.Str.toBuf(sys.ObjUtil.coerce(val, sys.Str.type$)));
    }
    ;
    if (sys.ObjUtil.is(val, sys.Buf.type$)) {
      return this.finish(AsnBin.make(this.etags(AsnTag.univOcts()), sys.ObjUtil.coerce(val, sys.Buf.type$)));
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot create OCTET STRING from ", val), " ("), sys.ObjUtil.typeof(val)), ")"));
  }

  asnNull() {
    return ((this$) => { if (this$.#tags.isEmpty()) return Asn.Null(); return this$.finish(AsnObj.make(this$.etags(AsnTag.univNull()), null)); })(this);
  }

  oid(val) {
    const this$ = this;
    if (sys.ObjUtil.is(val, sys.Str.type$)) {
      (val = sys.Str.split(sys.ObjUtil.coerce(val, sys.Str.type$), sys.ObjUtil.coerce(46, sys.Int.type$.toNullable())).map((s) => {
        return sys.ObjUtil.coerce(sys.Str.toInt(s), sys.Int.type$);
      }, sys.Int.type$));
    }
    ;
    if ((sys.ObjUtil.is(val, sys.Type.find("sys::List")) && (sys.ObjUtil.equals(sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).of(), sys.Int.type$) || sys.ObjUtil.coerce(val, sys.Type.find("sys::List")).isEmpty()))) {
      return sys.ObjUtil.coerce(this.finish(AsnOid.make(this.etags(AsnTag.univOid()), sys.ObjUtil.coerce(val, sys.Type.find("sys::Int[]")))), AsnOid.type$);
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Cannot create OID from ", val), " ("), sys.ObjUtil.typeof(val)), ")"));
  }

  asnEnum(val) {
    return this.finish(AsnObj.make(this.etags(AsnTag.univEnum()), math.BigInt.makeInt(val)));
  }

  utf8(val) {
    return this.finish(AsnObj.make(this.etags(AsnTag.univUtf8()), val));
  }

  str(val,univ) {
    let $_u8 = univ;
    if (sys.ObjUtil.equals($_u8, AsnTag.univUtf8()) || sys.ObjUtil.equals($_u8, AsnTag.univPrintStr()) || sys.ObjUtil.equals($_u8, AsnTag.univIa5Str()) || sys.ObjUtil.equals($_u8, AsnTag.univVisStr())) {
      return this.finish(AsnObj.make(this.etags(univ), val));
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("Unsupported universal type for ASN.1 string: ", univ));
  }

  utc(ts) {
    return this.finish(AsnObj.make(this.etags(AsnTag.univUtcTime()), ts));
  }

  genTime(ts) {
    return this.finish(AsnObj.make(this.etags(AsnTag.univGenTime()), ts));
  }

  seq(items) {
    return sys.ObjUtil.coerce(this.finish(AsnSeq.make(this.etags(AsnTag.univSeq()), items)), AsnSeq.type$);
  }

  set(items) {
    return sys.ObjUtil.coerce(this.finish(AsnSet.make(this.etags(AsnTag.univSet()), items)), AsnSet.type$);
  }

  any(raw) {
    if (!this.#tags.isEmpty()) {
      throw AsnErr.make(sys.Str.plus("Should not specify tags for ANY: ", this.#tags));
    }
    ;
    return this.finish(AsnBin.make(this.etags(AsnTag.univAny()), raw));
  }

  finish(obj) {
    this.#tags.clear();
    return obj;
  }

  etags(univ) {
    return this.#tags.dup().add(univ);
  }

}

class AsnErr extends sys.Err {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnErr.type$; }

  static make(msg,cause) {
    const $self = new AsnErr();
    AsnErr.make$($self,msg,cause);
    return $self;
  }

  static make$($self,msg,cause) {
    if (msg === undefined) msg = "";
    if (cause === undefined) cause = null;
    sys.Err.make$($self, msg, cause);
    return;
  }

}

class BerWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BerWriter.type$; }

  #out = null;

  // private field reflection only
  __out(it) { if (it === undefined) return this.#out; else this.#out = it; }

  static toBuf(obj,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    BerWriter.make(buf.out()).write(obj);
    return buf.flip();
  }

  static make(out) {
    const $self = new BerWriter();
    BerWriter.make$($self,out);
    return $self;
  }

  static make$($self,out) {
    $self.#out = out;
    return;
  }

  close() {
    return this.#out.close();
  }

  write(obj) {
    return this.doWrite(obj, this.#out);
  }

  doWrite(obj,out) {
    const this$ = this;
    let tlv = this.writeVal(obj);
    if (obj.isAny()) {
      out.writeBuf(tlv.seek(0));
      return this;
    }
    ;
    let format = ((this$) => { if (obj.isPrimitive()) return Format.primitive(); return Format.constructed(); })(this);
    obj.effectiveTags().reverse().each((tag,i) => {
      let temp = sys.Buf.make(sys.Int.plus(tlv.size(), 4));
      if (sys.ObjUtil.compareNE(i, 0)) {
        (format = Format.constructed());
      }
      ;
      this$.writeTag(tag, format, temp.out()).writeLen(tlv.size(), temp.out());
      temp.writeBuf(tlv.seek(0));
      (tlv = sys.ObjUtil.coerce(temp, sys.Buf.type$));
      return;
    });
    out.writeBuf(tlv.seek(0));
    return this;
  }

  writeTag(tag,format,out) {
    let v = sys.Int.or(tag.cls().mask(), format.mask());
    if (sys.ObjUtil.compareLT(tag.id(), 31)) {
      (v = sys.Int.or(v, tag.id()));
      out.write(v);
    }
    else {
      throw sys.UnsupportedErr.make(sys.Str.plus(sys.Str.plus("Tag id '", sys.ObjUtil.coerce(tag.id(), sys.Obj.type$.toNullable())), "' is not supported"));
    }
    ;
    return this;
  }

  writeLen(len,out) {
    const this$ = this;
    if (sys.ObjUtil.compareLT(len, 0)) {
      throw AsnErr.make(sys.Str.plus("Length cannot be negative: ", sys.ObjUtil.coerce(len, sys.Obj.type$.toNullable())));
    }
    ;
    if (sys.ObjUtil.compareLT(len, 128)) {
      out.write(len);
    }
    else {
      let octets = sys.List.make(sys.Int.type$);
      while (sys.ObjUtil.compareNE(len, 0)) {
        octets.add(sys.ObjUtil.coerce(sys.Int.and(len, 255), sys.Obj.type$.toNullable()));
        (len = sys.Int.shiftr(len, 8));
      }
      ;
      let numOctets = octets.size();
      if (sys.ObjUtil.compareGT(numOctets, 127)) {
        throw AsnErr.make(sys.Str.plus("Too many octets for encoding length: ", sys.ObjUtil.coerce(len, sys.Obj.type$.toNullable())));
      }
      ;
      out.write(sys.Int.or(numOctets, 128));
      octets.eachr((octet) => {
        out.write(octet);
        return;
      });
    }
    ;
    return this;
  }

  writeVal(obj,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(64), sys.Buf.type$);
    let $_u10 = obj.univTag();
    if (sys.ObjUtil.equals($_u10, AsnTag.univSeq()) || sys.ObjUtil.equals($_u10, AsnTag.univSet())) {
      return this.writeColl(sys.ObjUtil.coerce(obj, AsnColl.type$), buf);
    }
    else if (sys.ObjUtil.equals($_u10, AsnTag.univBool())) {
      return this.writeBool(obj.bool(), buf);
    }
    else if (sys.ObjUtil.equals($_u10, AsnTag.univInt())) {
      return this.writeInt(obj.bigInt(), buf);
    }
    else if (sys.ObjUtil.equals($_u10, AsnTag.univBits())) {
      return this.writeBits(sys.ObjUtil.coerce(obj, AsnBin.type$), buf);
    }
    else if (sys.ObjUtil.equals($_u10, AsnTag.univOcts())) {
      return this.writeOcts(sys.ObjUtil.coerce(obj, AsnBin.type$), buf);
    }
    else if (sys.ObjUtil.equals($_u10, AsnTag.univNull())) {
      return this.writeNull(buf);
    }
    else if (sys.ObjUtil.equals($_u10, AsnTag.univOid())) {
      return this.writeOid(obj.oid(), buf);
    }
    else if (sys.ObjUtil.equals($_u10, AsnTag.univEnum())) {
      return this.writeInt(obj.bigInt(), buf);
    }
    else if (sys.ObjUtil.equals($_u10, AsnTag.univUtf8()) || sys.ObjUtil.equals($_u10, AsnTag.univPrintStr()) || sys.ObjUtil.equals($_u10, AsnTag.univIa5Str()) || sys.ObjUtil.equals($_u10, AsnTag.univVisStr())) {
      return this.writeUtf8(obj.str(), buf);
    }
    else if (sys.ObjUtil.equals($_u10, AsnTag.univUtcTime())) {
      return this.writeUtcTime(obj.ts(), buf);
    }
    else if (sys.ObjUtil.equals($_u10, AsnTag.univGenTime())) {
      return this.writeGenTime(obj.ts(), buf);
    }
    else if (sys.ObjUtil.equals($_u10, AsnTag.univAny())) {
      return this.writeAny(sys.ObjUtil.coerce(obj, AsnBin.type$), buf);
    }
    else {
      throw AsnErr.make(sys.Str.plus("No writer for ", obj));
    }
    ;
    return buf;
  }

  writeAny(any,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(any.size()), sys.Buf.type$);
    return buf.writeBuf(any.forRead());
  }

  writeBool(val,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(1), sys.Buf.type$);
    return ((this$) => { if (val) return buf.write(255); return buf.write(0); })(this);
  }

  writeInt(val,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    if (sys.ObjUtil.is(val, sys.Int.type$)) {
      (val = math.BigInt.makeInt(sys.ObjUtil.coerce(val, sys.Int.type$)));
    }
    ;
    let int = ((this$) => { let $_u12 = sys.ObjUtil.as(val, math.BigInt.type$); if ($_u12 != null) return $_u12; throw sys.ArgErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Not an int: ", val), " ("), sys.ObjUtil.typeof(val)), ")")); })(this);
    if (sys.ObjUtil.equals(int, math.BigInt.zero())) {
      return buf.write(0);
    }
    ;
    return buf.writeBuf(int.toBuf());
  }

  writeBits(bits,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(sys.Int.plus(bits.size(), 1)), sys.Buf.type$);
    const this$ = this;
    let raw = bits.buf();
    buf.write(0);
    let allZero = sys.Str.all(raw.toHex(), (c) => {
      return sys.ObjUtil.equals(c, 48);
    });
    return ((this$) => { if (allZero) return buf; return buf.writeBuf(raw); })(this);
  }

  writeOcts(octets,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(octets.size()), sys.Buf.type$);
    return buf.writeBuf(octets.buf());
  }

  writeNull(buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(0), sys.Buf.type$);
    return buf;
  }

  writeOid(oid,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(64), sys.Buf.type$);
    const this$ = this;
    let ids = oid.ids();
    if (sys.ObjUtil.compareLT(ids.size(), 2)) {
      throw AsnErr.make(sys.Str.plus("Oid must have at least two arcs: ", ids));
    }
    ;
    if ((sys.ObjUtil.compareGT(ids.get(0), 2) || (sys.ObjUtil.equals(ids.get(0), 0) && sys.ObjUtil.compareGT(ids.get(1), 39)) || (sys.ObjUtil.equals(ids.get(0), 1) && sys.ObjUtil.compareGT(ids.get(1), 39)))) {
      throw AsnErr.make(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid initial arc ", sys.ObjUtil.coerce(ids.get(0), sys.Obj.type$.toNullable())), "."), sys.ObjUtil.coerce(ids.get(1), sys.Obj.type$.toNullable())), ": "));
    }
    ;
    let first = sys.Int.plus(sys.Int.mult(ids.get(0), 40), ids.get(1));
    sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(first, sys.Obj.type$.toNullable())]).addAll(ids.getRange(sys.Range.make(2, -1))).each((subId) => {
      if (sys.ObjUtil.compareLT(subId, 0)) {
        throw AsnErr.make(sys.Str.plus("Negative sub-id: ", sys.ObjUtil.coerce(subId, sys.Obj.type$.toNullable())));
      }
      ;
      if (sys.ObjUtil.compareLT(subId, 128)) {
        buf.write(sys.Int.and(subId, 127));
      }
      else {
        let octets = sys.List.make(sys.Int.type$);
        octets.add(sys.ObjUtil.coerce(sys.Int.and(subId, 127), sys.Obj.type$.toNullable()));
        (subId = sys.Int.shiftr(subId, 7));
        while (sys.ObjUtil.compareNE(subId, 0)) {
          octets.add(sys.ObjUtil.coerce(sys.Int.or(sys.Int.and(subId, 127), 128), sys.Obj.type$.toNullable()));
          (subId = sys.Int.shiftr(subId, 7));
        }
        ;
        octets.reverse().each((it) => {
          buf.write(it);
          return;
        });
      }
      ;
      return;
    });
    return buf;
  }

  writeUtf8(str,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(sys.Str.chars(str).size()), sys.Buf.type$);
    return buf.writeBuf(sys.Str.toBuf(str, sys.Charset.utf8()));
  }

  writeUtcTime(ts,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(30), sys.Buf.type$);
    return this.writeTimestamp(ts, buf, false);
  }

  writeGenTime(ts,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(30), sys.Buf.type$);
    return this.writeTimestamp(ts, buf, true);
  }

  writeTimestamp(ts,buf,isGenTime) {
    let dt = ts.toTimeZone(sys.TimeZone.utc());
    let millis = sys.Int.toDuration(dt.nanoSec()).toMillis();
    let pattern = sys.StrBuf.make();
    pattern.add("YY");
    if (isGenTime) {
      pattern.add("YY");
    }
    ;
    pattern.add("MM").add("DD");
    pattern.add("hh").add("mm");
    if (sys.ObjUtil.compareNE(dt.sec(), 0)) {
      pattern.add("ss");
    }
    ;
    if (sys.ObjUtil.compareNE(millis, 0)) {
      pattern.add(".FFF");
    }
    ;
    pattern.add("z");
    let enc = dt.toLocale(pattern.toStr(), sys.Locale.en());
    return buf.writeChars(enc);
  }

  writeColl(coll,buf) {
    if (buf === undefined) buf = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    const this$ = this;
    coll.vals().each((val) => {
      this$.doWrite(val, buf.out());
      return;
    });
    return buf;
  }

}

class Format extends sys.Enum {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Format.type$; }

  static primitive() { return Format.vals().get(0); }

  static constructed() { return Format.vals().get(1); }

  static #vals = undefined;

  #mask = 0;

  mask() { return this.#mask; }

  __mask(it) { if (it === undefined) return this.#mask; else this.#mask = it; }

  static make($ordinal,$name,mask) {
    const $self = new Format();
    Format.make$($self,$ordinal,$name,mask);
    return $self;
  }

  static make$($self,$ordinal,$name,mask) {
    sys.Enum.make$($self, $ordinal, $name);
    $self.#mask = mask;
    return;
  }

  static fromStr(name$, checked=true) {
    return sys.Enum.doFromStr(Format.type$, Format.vals(), name$, checked);
  }

  static vals() {
    if (Format.#vals == null) {
      Format.#vals = sys.List.make(Format.type$, [
        Format.make(0, "primitive", 0),
        Format.make(1, "constructed", 32),
      ]).toImmutable();
    }
    return Format.#vals;
  }

  static static$init() {
    const $_u14 = Format.vals();
    if (true) {
    }
    ;
    return;
  }

}

class BerReader extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BerReader.type$; }

  #in = null;

  // private field reflection only
  __in(it) { if (it === undefined) return this.#in; else this.#in = it; }

  static make(in$) {
    const $self = new BerReader();
    BerReader.make$($self,in$);
    return $self;
  }

  static make$($self,in$) {
    $self.#in = in$;
    return;
  }

  close() {
    return this.#in.close();
  }

  readObj(spec) {
    if (spec === undefined) spec = null;
    return this.doReadObj(this.#in, spec);
  }

  doReadObj(in$,spec) {
    let tag = this.readTag(in$);
    let len = this.readLen(in$);
    let val = in$.readBufFully(null, len);
    return sys.ObjUtil.coerce(((this$) => { let $_u15 = this$.tryUniversal(tag, val); if ($_u15 != null) return $_u15; return AsnBin.make(sys.List.make(AsnTag.type$, [tag, AsnTag.univAny()]), val).decode(spec); })(this), AsnObj.type$);
  }

  readTag(in$) {
    if (in$ === undefined) in$ = this.#in;
    const this$ = this;
    let octet = in$.read();
    let classMask = sys.Int.and(sys.ObjUtil.coerce(octet, sys.Int.type$), 192);
    let cls = AsnTagClass.vals().find((it) => {
      return sys.ObjUtil.equals(it.mask(), classMask);
    });
    let id = sys.Int.and(sys.ObjUtil.coerce(octet, sys.Int.type$), 31);
    if (sys.ObjUtil.compareGE(id, 31)) {
      throw sys.UnsupportedErr.make(sys.Str.plus("only simple ids supported: ", sys.ObjUtil.coerce(id, sys.Obj.type$.toNullable())));
    }
    ;
    return AsnTag.make(sys.ObjUtil.coerce(cls, AsnTagClass.type$), id, ((this$) => { if (cls.isUniv()) return AsnTagMode.explicit(); return AsnTagMode.implicit(); })(this));
  }

  readLen(in$) {
    if (in$ === undefined) in$ = this.#in;
    let octet = in$.read();
    if (sys.ObjUtil.equals(sys.Int.and(sys.ObjUtil.coerce(octet, sys.Int.type$), 128), 0)) {
      return sys.ObjUtil.coerce(octet, sys.Int.type$);
    }
    else {
      let numOctets = sys.Int.and(sys.ObjUtil.coerce(octet, sys.Int.type$), 127);
      let len = 0;
      while (sys.ObjUtil.compareGT(numOctets, 0)) {
        (len = sys.Int.or(sys.Int.shiftl(len, 8), sys.ObjUtil.coerce(in$.read(), sys.Int.type$)));
        numOctets = sys.Int.decrement(numOctets);
      }
      ;
      return len;
    }
    ;
  }

  tryUniversal(tag,val) {
    if (!tag.cls().isUniv()) {
      return null;
    }
    ;
    if (sys.ObjUtil.equals(tag, AsnTag.univAny())) {
      return null;
    }
    ;
    let in$ = val.in();
    let $_u17 = tag;
    if (sys.ObjUtil.equals($_u17, AsnTag.univSeq())) {
      return Asn.seq(this.readItems(in$));
    }
    else if (sys.ObjUtil.equals($_u17, AsnTag.univBool())) {
      return Asn.bool(this.readBool(in$));
    }
    else if (sys.ObjUtil.equals($_u17, AsnTag.univInt())) {
      return Asn.int(this.readInt(in$));
    }
    else if (sys.ObjUtil.equals($_u17, AsnTag.univBits())) {
      return Asn.bits(this.readBits(in$));
    }
    else if (sys.ObjUtil.equals($_u17, AsnTag.univOcts())) {
      return Asn.octets(this.readOcts(in$));
    }
    else if (sys.ObjUtil.equals($_u17, AsnTag.univNull())) {
      return Asn.Null();
    }
    else if (sys.ObjUtil.equals($_u17, AsnTag.univOid())) {
      return Asn.oid(this.readOid(in$));
    }
    else if (sys.ObjUtil.equals($_u17, AsnTag.univEnum())) {
      return Asn.asnEnum(this.readInt(in$).toInt());
    }
    else if (sys.ObjUtil.equals($_u17, AsnTag.univUtf8()) || sys.ObjUtil.equals($_u17, AsnTag.univPrintStr()) || sys.ObjUtil.equals($_u17, AsnTag.univIa5Str()) || sys.ObjUtil.equals($_u17, AsnTag.univVisStr())) {
      return Asn.str(this.readUtf8(in$), tag);
    }
    else if (sys.ObjUtil.equals($_u17, AsnTag.univUtcTime())) {
      return Asn.utc(this.readUtcTime(in$));
    }
    else if (sys.ObjUtil.equals($_u17, AsnTag.univGenTime())) {
      return Asn.genTime(this.readGenTime(in$));
    }
    else if (sys.ObjUtil.equals($_u17, AsnTag.univSet())) {
      return Asn.set(this.readItems(in$));
    }
    ;
    throw AsnErr.make(sys.Str.plus("No reader for universal tag: ", tag));
  }

  readBool(in$) {
    if (in$ === undefined) in$ = this.#in;
    return sys.ObjUtil.compareNE(in$.read(), 0);
  }

  readInt(in$) {
    if (in$ === undefined) in$ = this.#in;
    let bytes = sys.Buf.make();
    let octet = in$.read();
    if (octet == null) {
      return math.BigInt.zero();
    }
    ;
    while (octet != null) {
      bytes.write(sys.ObjUtil.coerce(octet, sys.Int.type$));
      (octet = in$.read());
    }
    ;
    return math.BigInt.makeBuf(sys.ObjUtil.coerce(sys.ObjUtil.coerce(bytes.seek(0), sys.Buf.type$.toNullable()), sys.Buf.type$));
  }

  readBits(in$) {
    if (in$ === undefined) in$ = this.#in;
    let unused = in$.read();
    return in$.readAllBuf();
  }

  readOcts(in$) {
    if (in$ === undefined) in$ = this.#in;
    return in$.readAllBuf();
  }

  readOid(in$) {
    if (in$ === undefined) in$ = this.#in;
    let ids = sys.List.make(sys.Int.type$);
    let octet = in$.read();
    if (octet == null) {
      throw AsnErr.make("Object Identifier must have at least one octet.");
    }
    ;
    while (octet != null) {
      let id = 0;
      if (sys.ObjUtil.compareLT(octet, 128)) {
        (id = sys.ObjUtil.coerce(octet, sys.Int.type$));
      }
      else {
        while (true) {
          (id = sys.Int.or(sys.Int.shiftl(id, 7), sys.Int.and(sys.ObjUtil.coerce(octet, sys.Int.type$), 127)));
          if (sys.ObjUtil.equals(sys.Int.and(sys.ObjUtil.coerce(octet, sys.Int.type$), 128), 0)) {
            break;
          }
          ;
          (octet = in$.read());
          if (octet == null) {
            throw AsnErr.make(sys.Str.plus("Unexpected end of oid: ", ids));
          }
          ;
        }
        ;
      }
      ;
      if (ids.isEmpty()) {
        if ((sys.ObjUtil.compareLE(0, id) && sys.ObjUtil.compareLE(id, 39))) {
          ids.add(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()));
        }
        else {
          if ((sys.ObjUtil.compareLE(40, id) && sys.ObjUtil.compareLE(id, 79))) {
            ids.add(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
            id = sys.Int.minus(id, 40);
          }
          else {
            ids.add(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
            id = sys.Int.minus(id, 80);
          }
          ;
        }
        ;
      }
      ;
      ids.add(sys.ObjUtil.coerce(id, sys.Obj.type$.toNullable()));
      (octet = in$.read());
    }
    ;
    return ids;
  }

  readUtf8(in$) {
    if (in$ === undefined) in$ = this.#in;
    return BerReader.bufToStr(this.readOcts(in$), sys.Charset.utf8());
  }

  static bufToStr(buf,charset) {
    buf.charset(charset);
    return buf.readAllStr(false);
  }

  readUtcTime(in$) {
    if (in$ === undefined) in$ = this.#in;
    let enc = in$.readAllStr();
    return sys.ObjUtil.coerce(sys.DateTime.fromLocale(enc, BerReader.timePattern(enc, false)), sys.DateTime.type$);
  }

  readGenTime(in$) {
    if (in$ === undefined) in$ = this.#in;
    let enc = in$.readAllStr();
    return sys.ObjUtil.coerce(sys.DateTime.fromLocale(enc, BerReader.timePattern(enc, true)), sys.DateTime.type$);
  }

  static timePattern(enc,forGenTime) {
    let pattern = sys.StrBuf.make();
    pattern.add(((this$) => { if (forGenTime) return "YYYY"; return "YY"; })(this));
    pattern.add("MMDDhhmm");
    if (sys.ObjUtil.equals(pattern.size(), sys.Str.size(enc))) {
      return pattern.toStr();
    }
    ;
    let pos = pattern.size();
    if (sys.Int.isDigit(sys.Str.get(enc, pos))) {
      pattern.add("ss");
      pos = sys.Int.plus(pos, 2);
    }
    ;
    if (sys.ObjUtil.equals(sys.Str.getSafe(enc, pos), 46)) {
      pattern.add(".FFF");
      pos = sys.Int.plus(pos, 4);
    }
    ;
    let $_u19 = sys.Str.get(enc, -1);
    if (sys.ObjUtil.equals($_u19, 90) || sys.ObjUtil.equals($_u19, 43) || sys.ObjUtil.equals($_u19, 45)) {
      pattern.add("z");
    }
    ;
    return pattern.toStr();
  }

  readItems(in$) {
    if (in$ === undefined) in$ = this.#in;
    let acc = sys.List.make(AsnItem.type$);
    while (in$.peek() != null) {
      let val = this.doReadObj(in$, null);
      acc.add(AsnItem.make(val));
    }
    ;
    return acc;
  }

}

class AsnColl extends AsnObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnColl.type$; }

  static make(tags,val) {
    const $self = new AsnColl();
    AsnColl.make$($self,tags,val);
    return $self;
  }

  static make$($self,tags,val) {
    AsnObj.make$($self, tags, AsnColl.toItems(val));
    return;
  }

  static toItems(val) {
    const this$ = this;
    let items = sys.List.make(AsnItem.type$);
    if (sys.ObjUtil.is(val, sys.Type.find("sys::Map"))) {
      let m = sys.ObjUtil.coerce(val, sys.Type.find("[sys::Str:asn1::AsnObj]"));
      m.each((v,k) => {
        items.add(AsnItem.make(v, k));
        return;
      });
    }
    else {
      let arr = sys.ObjUtil.coerce(val, sys.Type.find("sys::List"));
      if (arr.of().fits(AsnItem.type$)) {
        (items = sys.ObjUtil.coerce(val, sys.Type.find("asn1::AsnItem[]")));
      }
      else {
        arr.each((it) => {
          items.add(AsnItem.make(sys.ObjUtil.coerce(it, AsnObj.type$)));
          return;
        });
      }
      ;
    }
    ;
    return items;
  }

  static builder() {
    return AsnCollBuilder.make();
  }

  isSeq() {
    return sys.ObjUtil.equals(this.univTag(), AsnTag.univSeq());
  }

  isSet() {
    return sys.ObjUtil.equals(this.univTag(), AsnTag.univSet());
  }

  vals() {
    const this$ = this;
    return sys.ObjUtil.coerce(this.items().map((it) => {
      return it.val();
    }, sys.Obj.type$.toNullable()), sys.Type.find("asn1::AsnObj[]"));
  }

  items() {
    return sys.ObjUtil.coerce(this.val(), sys.Type.find("asn1::AsnItem[]"));
  }

  size() {
    return this.items().size();
  }

  isEmpty() {
    return this.items().isEmpty();
  }

  get(key) {
    const this$ = this;
    if (sys.ObjUtil.is(key, sys.Int.type$)) {
      return ((this$) => { let $_u20=this$.items().getSafe(sys.ObjUtil.coerce(key, sys.Int.type$)); return ($_u20==null) ? null : $_u20.val(); })(this);
    }
    else {
      if (sys.ObjUtil.is(key, sys.Str.type$)) {
        return ((this$) => { let $_u21=this$.items().find((it) => {
          return sys.ObjUtil.equals(it.name(), it.name());
        }); return ($_u21==null) ? null : $_u21.val(); })(this);
      }
      ;
    }
    ;
    throw sys.ArgErr.make(sys.Str.plus("invalid key type: ", sys.ObjUtil.typeof(key)));
  }

  valStr() {
    const this$ = this;
    let buf = sys.StrBuf.make().add("{\n");
    let indent = 2;
    this.items().each((item) => {
      buf.add(sys.Str.padl("", indent));
      if (item.name() != null) {
        buf.add(sys.Str.plus(sys.Str.plus("", item.name()), ": "));
      }
      ;
      if (sys.ObjUtil.is(item.val(), AsnColl.type$)) {
        let collStr = item.val().toStr();
        sys.Str.splitLines(collStr).each((line,i) => {
          if (sys.ObjUtil.equals(i, 0)) {
            buf.add(line);
          }
          else {
            buf.add(sys.Str.padl("", indent)).add(line);
          }
          ;
          buf.add("\n");
          return;
        });
      }
      else {
        buf.add(item.val().toStr()).add("\n");
      }
      ;
      return;
    });
    buf.add("}");
    return buf.toStr();
  }

}

class AsnItem extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnItem.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #val = null;

  val() { return this.#val; }

  __val(it) { if (it === undefined) return this.#val; else this.#val = it; }

  static make(val,name) {
    const $self = new AsnItem();
    AsnItem.make$($self,val,name);
    return $self;
  }

  static make$($self,val,name) {
    if (name === undefined) name = null;
    $self.#name = name;
    $self.#val = val;
    return;
  }

  hash() {
    return this.#val.hash();
  }

  equals(obj) {
    if (obj == null) {
      return false;
    }
    ;
    let that = sys.ObjUtil.as(obj, AsnItem.type$);
    if (that == null) {
      return false;
    }
    ;
    return sys.ObjUtil.equals(this.#val, that.#val);
  }

}

class AsnSeq extends AsnColl {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnSeq.type$; }

  static makeUniv(val) {
    const $self = new AsnSeq();
    AsnSeq.makeUniv$($self,val);
    return $self;
  }

  static makeUniv$($self,val) {
    AsnSeq.make$($self, sys.List.make(AsnTag.type$, [AsnTag.univSeq()]), val);
    return;
  }

  static make(tags,val) {
    const $self = new AsnSeq();
    AsnSeq.make$($self,tags,val);
    return $self;
  }

  static make$($self,tags,val) {
    AsnColl.make$($self, tags, AsnColl.toItems(val));
    if (sys.ObjUtil.compareNE($self.univTag(), AsnTag.univSeq())) {
      throw sys.ArgErr.make(sys.Str.plus("Not a sequence: ", tags));
    }
    ;
    return;
  }

}

class AsnSet extends AsnColl {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnSet.type$; }

  static makeUniv(val) {
    const $self = new AsnSet();
    AsnSet.makeUniv$($self,val);
    return $self;
  }

  static makeUniv$($self,val) {
    AsnSet.make$($self, sys.List.make(AsnTag.type$, [AsnTag.univSet()]), val);
    if (sys.ObjUtil.compareNE($self.univTag(), AsnTag.univSet())) {
      throw sys.ArgErr.make(sys.Str.plus("Not a set: ", $self.tags()));
    }
    ;
    return;
  }

  static make(tags,val) {
    const $self = new AsnSet();
    AsnSet.make$($self,tags,val);
    return $self;
  }

  static make$($self,tags,val) {
    AsnColl.make$($self, tags, AsnColl.toItems(val));
    return;
  }

}

class AsnCollBuilder extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#items = sys.List.make(AsnItem.type$);
    return;
  }

  typeof() { return AsnCollBuilder.type$; }

  #items = null;

  // private field reflection only
  __items(it) { if (it === undefined) return this.#items; else this.#items = it; }

  static make() {
    const $self = new AsnCollBuilder();
    AsnCollBuilder.make$($self);
    return $self;
  }

  static make$($self) {
    ;
    return;
  }

  add(val,name) {
    if (name === undefined) name = null;
    return this.item(AsnItem.make(val, name));
  }

  item(item) {
    this.#items.add(item);
    return this;
  }

  toSeq(tag) {
    if (tag === undefined) tag = null;
    return Asn.tag(tag).seq(this.#items);
  }

  toSet(tag) {
    if (tag === undefined) tag = null;
    return Asn.tag(tag).set(this.#items);
  }

}

class AsnBin extends AsnObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnBin.type$; }

  static make(tags,buf) {
    const $self = new AsnBin();
    AsnBin.make$($self,tags,buf);
    return $self;
  }

  static make$($self,tags,buf) {
    AsnObj.make$($self, tags, sys.Unsafe.make(buf.dup()));
    return;
  }

  isAny() {
    return sys.ObjUtil.equals(this.univTag(), AsnTag.univAny());
  }

  size() {
    return this.unsafeBuf().size();
  }

  readAllStr() {
    return this.forRead().readAllStr(false);
  }

  buf() {
    return this.unsafeBuf().dup();
  }

  forRead() {
    return this.unsafeBuf().seek(0);
  }

  unsafeBuf() {
    return sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.val(), sys.Unsafe.type$).val(), sys.Buf.type$);
  }

  decode(spec) {
    if (spec === undefined) spec = null;
    if (spec == null) {
      return this;
    }
    ;
    let r = BerReader.make(this.unsafeBuf().in());
    let t = this.tags().getRange(sys.Range.make(0, -1, true)).add(spec.univTag());
    let $_u22 = spec.univTag();
    if (sys.ObjUtil.equals($_u22, AsnTag.univSeq())) {
      return AsnSeq.make(t, r.readItems());
    }
    else if (sys.ObjUtil.equals($_u22, AsnTag.univBool())) {
      return AsnObj.make(t, sys.ObjUtil.coerce(r.readBool(), sys.Obj.type$.toNullable()));
    }
    else if (sys.ObjUtil.equals($_u22, AsnTag.univInt())) {
      return AsnObj.make(t, r.readInt());
    }
    else if (sys.ObjUtil.equals($_u22, AsnTag.univBits())) {
      return AsnBin.make(t, r.readBits());
    }
    else if (sys.ObjUtil.equals($_u22, AsnTag.univOcts())) {
      return AsnBin.make(t, r.readOcts());
    }
    else if (sys.ObjUtil.equals($_u22, AsnTag.univNull())) {
      return AsnObj.make(t, null);
    }
    else if (sys.ObjUtil.equals($_u22, AsnTag.univOid())) {
      return AsnOid.make(t, r.readOid());
    }
    else if (sys.ObjUtil.equals($_u22, AsnTag.univEnum())) {
      return AsnObj.make(t, r.readInt());
    }
    else if (sys.ObjUtil.equals($_u22, AsnTag.univUtf8()) || sys.ObjUtil.equals($_u22, AsnTag.univPrintStr()) || sys.ObjUtil.equals($_u22, AsnTag.univIa5Str()) || sys.ObjUtil.equals($_u22, AsnTag.univVisStr())) {
      return AsnObj.make(t, r.readUtf8());
    }
    else if (sys.ObjUtil.equals($_u22, AsnTag.univUtcTime())) {
      return AsnObj.make(t, r.readUtcTime());
    }
    else if (sys.ObjUtil.equals($_u22, AsnTag.univGenTime())) {
      return AsnObj.make(t, r.readGenTime());
    }
    else if (sys.ObjUtil.equals($_u22, AsnTag.univSet())) {
      return AsnSet.make(t, r.readItems());
    }
    ;
    throw AsnErr.make(sys.Str.plus("No reader for type: ", spec));
  }

  push(tag) {
    return AsnBin.make(sys.List.make(AsnTag.type$, [tag]).addAll(this.tags()), this.forRead());
  }

  valHash() {
    return sys.Str.hash(this.unsafeBuf().toHex());
  }

  valEquals(obj) {
    let that = sys.ObjUtil.as(obj, AsnBin.type$);
    if (that == null) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(this.size(), that.size())) {
      return false;
    }
    ;
    if (sys.ObjUtil.compareNE(this.unsafeBuf().toHex(), that.unsafeBuf().toHex())) {
      return false;
    }
    ;
    return true;
  }

}

class AsnOid extends AsnObj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnOid.type$; }

  static make(tags,val) {
    const $self = new AsnOid();
    AsnOid.make$($self,tags,val);
    return $self;
  }

  static make$($self,tags,val) {
    AsnObj.make$($self, tags, val);
    if (sys.ObjUtil.compareNE($self.univTag(), AsnTag.univOid())) {
      throw sys.ArgErr.make(sys.Str.plus("Invalid tags for OID: ", tags));
    }
    ;
    return;
  }

  ids() {
    return sys.ObjUtil.coerce(this.val(), sys.Type.find("sys::Int[]"));
  }

  oidStr() {
    return this.ids().join(".");
  }

  getRange(range) {
    return Asn.oid(this.ids().getRange(range));
  }

  compare(that) {
    let thatOid = sys.ObjUtil.coerce(that, AsnOid.type$);
    if (sys.ObjUtil.equals(this.ids(), thatOid.ids())) {
      return 0;
    }
    ;
    let i = 0;
    let cmp = sys.ObjUtil.compare(this.ids().get(i), thatOid.ids().get(i));
    while (sys.ObjUtil.equals(cmp, 0)) {
      i = sys.Int.increment(i);
      if (sys.ObjUtil.compareGE(i, this.ids().size())) {
        return -1;
      }
      else {
        if (sys.ObjUtil.compareGE(i, thatOid.ids().size())) {
          return 1;
        }
        ;
      }
      ;
      (cmp = sys.ObjUtil.compare(this.ids().get(i), thatOid.ids().get(i)));
    }
    ;
    return cmp;
  }

  valStr() {
    return this.oidStr();
  }

}

class AsnTagTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnTagTest.type$; }

  testEquality() {
    let e = AsnTag.univ(0).explicit();
    this.verifyEq(e, AsnTag.univ(0).explicit());
    this.verifyNotEq(e, AsnTag.univ(1).explicit());
    let c = AsnTag.context(0).implicit();
    this.verifyEq(c, AsnTag.context(0).implicit());
    this.verifyNotEq(c, AsnTag.context(1).implicit());
    return;
  }

  testEffectiveTags() {
    let o1 = Asn.bool(true).push(AsnTag.context(0).explicit()).push(AsnTag.context(1).implicit());
    this.verifyEq(o1.effectiveTags(), sys.List.make(AsnTag.type$, [AsnTag.context(1).explicit(), AsnTag.univBool()]));
    let o2 = Asn.bool(true).push(AsnTag.context(0).implicit()).push(AsnTag.context(1).explicit());
    this.verifyEq(o2.effectiveTags(), sys.List.make(AsnTag.type$, [AsnTag.context(1).explicit(), AsnTag.context(0).explicit()]));
    return;
  }

  static make() {
    const $self = new AsnTagTest();
    AsnTagTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class AsnObjTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return AsnObjTest.type$; }

  static #cx1 = undefined;

  static cx1() {
    if (AsnObjTest.#cx1 === undefined) {
      AsnObjTest.static$init();
      if (AsnObjTest.#cx1 === undefined) AsnObjTest.#cx1 = null;
    }
    return AsnObjTest.#cx1;
  }

  static #cx2 = undefined;

  static cx2() {
    if (AsnObjTest.#cx2 === undefined) {
      AsnObjTest.static$init();
      if (AsnObjTest.#cx2 === undefined) AsnObjTest.#cx2 = null;
    }
    return AsnObjTest.#cx2;
  }

  testBoolean() {
    this.verifyEq(sys.ObjUtil.coerce(AsnTag.univBool().id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()));
    this.verifyEq(Asn.bool(true), Asn.bool(true));
    this.verifyEq(Asn.bool(false), Asn.bool(false));
    this.verifyNotEq(Asn.bool(true), Asn.bool(false));
    this.verifyNotEq(Asn.bool(true), Asn.tag(AsnObjTest.cx1()).bool(true));
    return;
  }

  testInteger() {
    this.verifyEq(sys.ObjUtil.coerce(AsnTag.univInt().id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()));
    let t = AsnTag.univInt();
    this.verifyEq(Asn.int(sys.ObjUtil.coerce(0, sys.Obj.type$)), Asn.int(sys.ObjUtil.coerce(0, sys.Obj.type$)));
    this.verifyEq(Asn.tag(AsnObjTest.cx2()).int(sys.ObjUtil.coerce(0, sys.Obj.type$)), Asn.tag(AsnObjTest.cx2()).int(sys.ObjUtil.coerce(0, sys.Obj.type$)));
    this.verifyEq(Asn.int(sys.ObjUtil.coerce(123, sys.Obj.type$)), Asn.int(sys.ObjUtil.coerce(math.BigInt.fromStr("123"), sys.Obj.type$)));
    this.verifyNotEq(Asn.int(sys.ObjUtil.coerce(0, sys.Obj.type$)), Asn.int(sys.ObjUtil.coerce(1, sys.Obj.type$)));
    this.verifyNotEq(Asn.int(sys.ObjUtil.coerce(0, sys.Obj.type$)), Asn.tag(AsnObjTest.cx2()).int(sys.ObjUtil.coerce(0, sys.Obj.type$)));
    this.verifyNotEq(Asn.int(sys.ObjUtil.coerce(0, sys.Obj.type$)).push(AsnTag.context(2).explicit()), Asn.int(sys.ObjUtil.coerce(0, sys.Obj.type$)).push(AsnObjTest.cx2()));
    return;
  }

  testOctetString() {
    this.verifyEq(sys.ObjUtil.coerce(AsnTag.univOcts().id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4, sys.Obj.type$.toNullable()));
    let a = Asn.octets(sys.Str.toBuf("foo"));
    this.verifyEq(a, a);
    let b = Asn.octets(sys.Str.toBuf("foo"));
    this.verifyEq(a, b);
    this.verifyNotEq(a, Asn.octets(sys.Str.toBuf("fooo")));
    this.verifyNotEq(a, a.push(AsnTag.context(4).implicit()));
    return;
  }

  testBitString() {
    this.verifyEq(sys.ObjUtil.coerce(AsnTag.univBits().id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()));
    let a = Asn.bits(sys.Buf.fromHex("cafe_babe"));
    this.verifyEq(a, a);
    let b = Asn.bits(sys.Buf.fromHex("cafe_babe"));
    this.verifyEq(a, b);
    this.verifyNotEq(a, Asn.bits(sys.Buf.fromHex("dead_beef")));
    this.verifyNotEq(a, a.push(AsnTag.context(3).implicit()));
    return;
  }

  testOid() {
    this.verifyEq(sys.ObjUtil.coerce(AsnTag.univOid().id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()));
    let ctag = AsnTag.context(0).implicit();
    let a = Asn.oid("0.1");
    this.verifyEq(a, a);
    this.verifyNotEq(a, a.push(ctag));
    let b = Asn.oid("0.1");
    this.verifyEq(a, b);
    this.verifyEq(Asn.oid(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable())])), Asn.oid("0.1"));
    this.verifyNotEq(a, Asn.oid("1.1"));
    this.verifyNotEq(Asn.oid("2.100"), Asn.oid("2.100").push(ctag));
    return;
  }

  testOidCompare() {
    let a = Asn.oid("0");
    let b = Asn.oid("0");
    this.verify(sys.ObjUtil.equals(sys.ObjUtil.compare(a, b), 0));
    (b = Asn.oid("0.1"));
    this.verify(sys.ObjUtil.compareLT(sys.ObjUtil.compare(a, b), 0));
    this.verify(sys.ObjUtil.compareGT(sys.ObjUtil.compare(b, a), 0));
    (a = Asn.oid("1.2.3.4"));
    (b = Asn.oid("1.200.3"));
    this.verify(sys.ObjUtil.compareLT(sys.ObjUtil.compare(a, b), 0));
    this.verify(sys.ObjUtil.compareGT(sys.ObjUtil.compare(b, a), 0));
    return;
  }

  testOidGetRange() {
    const this$ = this;
    let a = Asn.oid("1");
    this.verifyEq(a, a.getRange(sys.Range.make(0, -1)));
    this.verifyErr(sys.IndexErr.type$, (it) => {
      let b = a.getRange(sys.Range.make(0, 1));
      return;
    });
    (a = Asn.oid("1.2.3.4.5"));
    this.verifyEq(a, a.getRange(sys.Range.make(0, -1)));
    this.verifyEq(Asn.oid("1.2.3"), a.getRange(sys.Range.make(0, 3, true)));
    this.verifyEq(Asn.oid("2.3.4"), a.getRange(sys.Range.make(1, 4, true)));
    return;
  }

  testNull() {
    this.verifyEq(sys.ObjUtil.coerce(AsnTag.univNull().id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(5, sys.Obj.type$.toNullable()));
    this.verifyEq(Asn.Null(), Asn.Null());
    this.verifyNotEq(Asn.Null(), Asn.Null().push(AsnTag.context(5).implicit()));
    return;
  }

  testIA5Str() {
    this.verifyEq(sys.ObjUtil.coerce(AsnTag.univIa5Str().id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(22, sys.Obj.type$.toNullable()));
    let a = Asn.str("foo", AsnTag.univIa5Str());
    let b = Asn.str("foo", AsnTag.univIa5Str());
    this.verifyEq(a, b);
    this.verifyNotEq(a, Asn.str("bar", AsnTag.univIa5Str()));
    this.verifyNotEq(a, b.push(AsnTag.context(22).implicit()));
    return;
  }

  testPrintableStr() {
    let t = AsnTag.univPrintStr();
    this.verifyEq(sys.ObjUtil.coerce(t.id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(19, sys.Obj.type$.toNullable()));
    let a = Asn.str("foo", t);
    let b = Asn.str("foo", t);
    this.verifyEq(a, b);
    this.verifyNotEq(a, Asn.str("bar", t));
    this.verifyNotEq(a, b.push(AsnTag.context(19).implicit()));
    return;
  }

  testUtf8Str() {
    this.verifyEq(sys.ObjUtil.coerce(AsnTag.univUtf8().id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(12, sys.Obj.type$.toNullable()));
    let a = Asn.utf8("\u03b1\u03b3\u03b1\u03c0\u03b7");
    let b = Asn.utf8("\u03b1\u03b3\u03b1\u03c0\u03b7");
    this.verifyEq(a, b);
    this.verifyNotEq(a, Asn.utf8("\u03c6\u03b9\u03bb\u03bf\u03c2"));
    this.verifyNotEq(a, b.push(AsnTag.context(12).implicit()));
    return;
  }

  testVisibleStr() {
    let t = AsnTag.univVisStr();
    this.verifyEq(sys.ObjUtil.coerce(t.id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(26, sys.Obj.type$.toNullable()));
    let a = Asn.str("foo", t);
    let b = Asn.str("foo", t);
    this.verifyEq(a, b);
    this.verifyNotEq(a, Asn.str("bar", t));
    this.verifyNotEq(a, b.push(AsnTag.context(t.id()).implicit()));
    return;
  }

  testUtcTime() {
    this.verifyEq(sys.ObjUtil.coerce(AsnTag.univUtcTime().id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(23, sys.Obj.type$.toNullable()));
    let ts1 = sys.Date.fromStr("2015-03-24").midnight();
    let ts2 = ts1.minus(sys.Duration.fromStr("1day"));
    this.verifyEq(Asn.utc(ts1), Asn.utc(ts1));
    this.verifyNotEq(Asn.utc(ts1), Asn.utc(ts2));
    this.verifyNotEq(Asn.utc(ts1), Asn.utc(ts1).push(AsnTag.context(23).implicit()));
    return;
  }

  testGenTime() {
    this.verifyEq(sys.ObjUtil.coerce(AsnTag.univGenTime().id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(24, sys.Obj.type$.toNullable()));
    let ts1 = sys.Date.fromStr("2015-03-24").midnight();
    let ts2 = ts1.minus(sys.Duration.fromStr("1day"));
    this.verifyEq(Asn.genTime(ts1), Asn.genTime(ts1));
    this.verifyNotEq(Asn.genTime(ts1), Asn.genTime(ts2));
    this.verifyNotEq(Asn.genTime(ts1), Asn.genTime(ts1).push(AsnTag.context(24).implicit()));
    return;
  }

  testSequence() {
    this.verifyEq(sys.ObjUtil.coerce(AsnTag.univSeq().id(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(16, sys.Obj.type$.toNullable()));
    let ctag = AsnTag.context(16).implicit();
    let a = Asn.seq(sys.List.make(sys.Obj.type$.toNullable()));
    this.verifyEq(a, a);
    let b = Asn.seq(sys.List.make(sys.Obj.type$.toNullable()));
    this.verifyEq(a, b);
    this.verifyEq(Asn.seq(sys.List.make(AsnObj.type$, [Asn.int(sys.ObjUtil.coerce(1, sys.Obj.type$))])), Asn.seq(sys.List.make(AsnObj.type$, [Asn.int(sys.ObjUtil.coerce(1, sys.Obj.type$))])));
    let i = Asn.int(sys.ObjUtil.coerce(1, sys.Obj.type$));
    let s = Asn.octets(sys.Str.toBuf("octets"));
    let o = Asn.oid("1.2.3.4.5");
    let seq = Asn.seq(sys.List.make(AsnObj.type$, [o, s, i]));
    this.verifyEq(seq, seq);
    this.verifyNotEq(seq, Asn.tag(ctag).seq(sys.List.make(AsnObj.type$, [o, s, i])));
    this.verifyEq(Asn.seq(sys.List.make(AsnObj.type$, [i, s, o])), Asn.seq(sys.List.make(AsnObj.type$, [i, s, o])));
    this.verifyEq(Asn.seq(sys.List.make(AsnSeq.type$, [seq])), Asn.seq(sys.List.make(AsnSeq.type$, [Asn.seq(sys.List.make(AsnObj.type$, [o, s, i]))])));
    this.verifyEq(Asn.seq(sys.List.make(AsnObj.type$, [Asn.Null(), seq])), Asn.seq(sys.List.make(AsnObj.type$, [Asn.Null(), seq])));
    this.verifyNotEq(Asn.seq(sys.List.make(sys.Obj.type$.toNullable())), Asn.seq(sys.List.make(AsnObj.type$, [i])));
    this.verifyNotEq(Asn.seq(sys.List.make(AsnObj.type$, [i, s, o])), seq);
    let s1 = Asn.seq(sys.List.make(AsnSeq.type$, [Asn.seq(sys.List.make(AsnObj.type$, [Asn.int(sys.ObjUtil.coerce(1, sys.Obj.type$))]))]));
    let s2 = Asn.seq(sys.List.make(AsnSeq.type$, [Asn.seq(sys.List.make(AsnObj.type$, [Asn.int(sys.ObjUtil.coerce(1, sys.Obj.type$))]))]));
    let s3 = Asn.seq(sys.List.make(AsnSeq.type$, [Asn.seq(sys.List.make(AsnObj.type$, [Asn.int(sys.ObjUtil.coerce(1, sys.Obj.type$)), Asn.int(sys.ObjUtil.coerce(2, sys.Obj.type$))]))]));
    this.verifyEq(s1, s2);
    this.verifyNotEq(s1, s3);
    return;
  }

  static make() {
    const $self = new AsnObjTest();
    AsnObjTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

  static static$init() {
    AsnObjTest.#cx1 = AsnTag.context(1).implicit();
    AsnObjTest.#cx2 = AsnTag.context(2).implicit();
    return;
  }

}

class BerTest extends sys.Test {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BerTest.type$; }

  octets(bytes) {
    const this$ = this;
    let buf = sys.Buf.make();
    bytes.each((it) => {
      buf.write(it);
      return;
    });
    return sys.ObjUtil.coerce(buf, sys.Buf.type$);
  }

  octIn(bytes) {
    return this.octets(bytes).flip().in();
  }

  enc(obj) {
    return BerWriter.toBuf(obj);
  }

  encIn(obj) {
    return BerWriter.toBuf(obj).in();
  }

  verifyBufEq(expected,actual) {
    if (!this.bufEq(expected, actual)) {
      sys.Env.cur().out().printLine(sys.Str.plus("Expected: ", expected.toHex()));
      sys.Env.cur().out().printLine(sys.Str.plus("  Actual: ", actual.toHex()));
      this.verify(false);
    }
    ;
    this.verify(true);
    return;
  }

  bufEq(a,b) {
    if (sys.ObjUtil.compareNE(a.size(), b.size())) {
      return false;
    }
    ;
    for (let i = 0; sys.ObjUtil.compareLT(i, a.size()); i = sys.Int.increment(i)) {
      if (sys.ObjUtil.compareNE(a.get(i), b.get(i))) {
        return false;
      }
      ;
    }
    ;
    return true;
  }

  static make() {
    const $self = new BerTest();
    BerTest.make$($self);
    return $self;
  }

  static make$($self) {
    sys.Test.make$($self);
    return;
  }

}

class BerReaderTest extends BerTest {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BerReaderTest.type$; }

  ber(bytes) {
    if (bytes === undefined) bytes = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    return BerReader.make(bytes.in());
  }

  testReadLen() {
    this.verifyEq(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])).flip()).readLen(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(127, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(127, sys.Obj.type$.toNullable())])).flip()).readLen(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(129, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable())])).flip()).readLen(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(129, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())])).flip()).readLen(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(256, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(130, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])).flip()).readLen(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(65535, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(130, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())])).flip()).readLen(), sys.Obj.type$.toNullable()));
    return;
  }

  testReadBoolean() {
    const this$ = this;
    this.verifyEq(sys.ObjUtil.coerce(false, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber().readBool(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]))), sys.Obj.type$.toNullable()));
    sys.Range.make(1, 255).each((it) => {
      this$.verifyEq(sys.ObjUtil.coerce(true, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this$.ber().readBool(this$.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(it, sys.Obj.type$.toNullable())]))), sys.Obj.type$.toNullable()));
      return;
    });
    return;
  }

  testReadBooleanType() {
    this.verifyEq(Asn.bool(true), this.ber(this.enc(Asn.bool(true))).readObj());
    this.verifyEq(Asn.bool(false), this.ber(this.enc(Asn.bool(false))).readObj());
    let b = Asn.tag(AsnTag.context(1).implicit()).bool(true);
    this.verify(this.ber(this.enc(b)).readObj().isAny());
    this.verifyEq(b, this.ber(this.enc(b)).readObj(b));
    return;
  }

  testReadInteger() {
    this.verifyEq(sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber().readInt(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]))).toInt(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(-1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber().readInt(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())]))).toInt(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(-431, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber().readInt(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(254, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(81, sys.Obj.type$.toNullable())]))).toInt(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.Int.maxVal(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber().readInt(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(127, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable())]))).toInt(), sys.Obj.type$.toNullable()));
    this.verifyEq(sys.ObjUtil.coerce(sys.Int.minVal(), sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(this.ber().readInt(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]))).toInt(), sys.Obj.type$.toNullable()));
    this.verifyEq(math.BigInt.makeInt(sys.Int.maxVal()).increment(), this.ber().readInt(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]))));
    return;
  }

  testReadIntegerType() {
    let i = Asn.int(sys.ObjUtil.coerce(12345, sys.Obj.type$));
    this.verifyEq(i, this.ber(this.enc(i)).readObj());
    (i = Asn.int(sys.ObjUtil.coerce(-12345, sys.Obj.type$)).push(AsnTag.context(0).implicit()));
    this.verify(this.ber(this.enc(i)).readObj().isAny());
    this.verifyEq(i, this.ber(this.enc(i)).readObj(i));
    return;
  }

  testReadBitString() {
    this.verifyBufEq(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$), this.ber().readBits(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]))));
    this.verifyBufEq(sys.Buf.fromHex("cafe_babe"), this.ber().readBits(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(202, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(254, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(186, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(190, sys.Obj.type$.toNullable())]))));
    return;
  }

  testReadBitStringType() {
    let hex = sys.Buf.fromHex("dead_beef");
    let bits = Asn.bits(hex);
    this.verifyEq(bits, this.ber(this.enc(bits)).readObj());
    (bits = bits.push(AsnTag.context(0).implicit()));
    this.verify(this.ber(this.enc(bits)).readObj().isAny());
    this.verifyEq(bits, this.ber(this.enc(bits)).readObj(bits));
    return;
  }

  testReadOctetString() {
    this.verifyBufEq(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$), this.ber().readOcts(this.octIn(sys.ObjUtil.coerce(sys.List.make(sys.Obj.type$.toNullable()), sys.Type.find("sys::Int[]")))));
    this.verifyBufEq(sys.Str.toBuf("Hello"), this.ber().readOcts(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(72, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(101, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(108, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(108, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(111, sys.Obj.type$.toNullable())]))));
    return;
  }

  testReadOctetStringType() {
    let text = "An octet string is not a string of chars, it's a string of bytes.";
    let s = Asn.octets(sys.Str.toBuf(text));
    this.verifyEq(s, this.ber(this.enc(s)).readObj());
    (s = s.push(AsnTag.context(0).implicit()));
    this.verify(this.ber(this.enc(s)).readObj().isAny());
    this.verifyEq(s, this.ber(this.enc(s)).readObj(s));
    return;
  }

  testReadNullType() {
    let nil = Asn.Null();
    this.verifyEq(Asn.Null(), this.ber(this.enc(nil)).readObj());
    (nil = Asn.Null().push(AsnTag.context(0).implicit()));
    this.verify(this.ber(this.enc(nil)).readObj().isAny());
    let dec = this.ber(this.enc(nil)).readObj(nil);
    this.verify(dec.isNull());
    this.verifyEq(nil, dec);
    return;
  }

  testReadOid() {
    this.verifyEq(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1048574, sys.Obj.type$.toNullable())]), this.ber().readOid(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(43, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(191, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(126, sys.Obj.type$.toNullable())]))));
    this.verifyEq(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(39, sys.Obj.type$.toNullable())]), this.ber().readOid(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(39, sys.Obj.type$.toNullable())]))));
    this.verifyEq(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(39, sys.Obj.type$.toNullable())]), this.ber().readOid(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(79, sys.Obj.type$.toNullable())]))));
    this.verifyEq(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(40, sys.Obj.type$.toNullable())]), this.ber().readOid(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(120, sys.Obj.type$.toNullable())]))));
    this.verifyEq(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4294967295, sys.Obj.type$.toNullable())]), this.ber().readOid(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(144, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(79, sys.Obj.type$.toNullable())]))));
    this.verifyEq(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(47, sys.Obj.type$.toNullable())]), this.ber().readOid(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(127, sys.Obj.type$.toNullable())]))));
    this.verifyEq(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(48, sys.Obj.type$.toNullable())]), this.ber().readOid(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(129, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]))));
    this.verifyEq(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(100, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())]), this.ber().readOid(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(129, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(52, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())]))));
    this.verifyEq(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(560, sys.Obj.type$.toNullable())]), this.ber().readOid(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(133, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())]))));
    this.verifyEq(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(16843570, sys.Obj.type$.toNullable())]), this.ber().readOid(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(136, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(132, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(135, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())]))));
    return;
  }

  testReadOidType() {
    let o = Asn.oid("1.2.1024");
    this.verifyEq(o, this.ber(this.enc(o)).readObj());
    (o = sys.ObjUtil.coerce(Asn.oid("2.3.2048").push(AsnTag.context(0).implicit()), AsnOid.type$));
    this.verify(this.ber(this.enc(o)).readObj().isAny());
    this.verifyEq(o, this.ber(this.enc(o)).readObj(o));
    return;
  }

  testStrings() {
    this.doStringTest(AsnTag.univUtf8());
    this.doStringTest(AsnTag.univPrintStr());
    this.doStringTest(AsnTag.univIa5Str());
    this.doStringTest(AsnTag.univVisStr());
    return;
  }

  doStringTest(univ) {
    let str = Asn.str("", univ);
    this.verifyEq(str, this.ber(this.enc(str)).readObj());
    (str = Asn.str("So many string types. Why?", univ));
    this.verifyEq(str, this.ber(this.enc(str)).readObj());
    (str = str.push(AsnTag.context(0).implicit()));
    this.verify(this.ber(this.enc(str)).readObj().isAny());
    this.verifyEq(str, this.ber(this.enc(str)).readObj(str));
    return;
  }

  testReadUtcTime() {
    this.verifyEq(sys.DateTime.make(2015, sys.Month.jul(), 13, 12, 1, 34, 0, sys.TimeZone.utc()), this.ber().readUtcTime(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(49, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(53, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(48, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(55, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(51, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(48, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(51, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(52, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(90, sys.Obj.type$.toNullable())]))));
    this.verifyEq(sys.DateTime.make(1980, sys.Month.feb(), 28, 23, 59, 0, 0, sys.TimeZone.utc()), this.ber().readUtcTime(sys.Str.toBuf("8002282359Z").in()));
    this.verifyEq(sys.DateTime.make(2000, sys.Month.feb(), 28, 23, 59, 59, 0, sys.TimeZone.utc()), this.ber().readUtcTime(sys.Str.toBuf("000228235959Z").in()));
    this.verifyEq(sys.DateTime.make(2000, sys.Month.jan(), 31, 23, 59, 59, 9000000, sys.TimeZone.utc()), this.ber().readUtcTime(sys.Str.toBuf("000131235959.009Z").in()));
    this.verifyEq(sys.DateTime.make(2000, sys.Month.feb(), 28, 23, 59, 59, 90000000, sys.TimeZone.utc()), this.ber().readUtcTime(sys.Str.toBuf("000228235959.09Z").in()));
    this.verifyEq(sys.DateTime.make(2000, sys.Month.dec(), 31, 23, 59, 59, 900000000, sys.TimeZone.utc()), this.ber().readUtcTime(sys.Str.toBuf("001231235959.9Z").in()));
    return;
  }

  testReadUtcTimeType() {
    let now = Asn.utc(sys.DateTime.now().toUtc());
    this.verifyEq(now, this.ber(this.enc(now)).readObj());
    (now = now.push(AsnTag.context(0).implicit()));
    this.verify(this.ber(this.enc(now)).readObj().isAny());
    this.verifyEq(now, this.ber(this.enc(now)).readObj(now));
    return;
  }

  testReadGenTime() {
    this.verifyEq(sys.DateTime.make(2015, sys.Month.jul(), 13, 12, 1, 34, 0, sys.TimeZone.utc()), this.ber().readGenTime(this.octIn(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(48, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(53, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(48, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(55, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(51, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(50, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(48, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(49, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(51, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(52, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(90, sys.Obj.type$.toNullable())]))));
    this.verifyEq(sys.DateTime.make(1980, sys.Month.feb(), 28, 23, 59, 0, 0, sys.TimeZone.utc()), this.ber().readGenTime(sys.Str.toBuf("198002282359Z").in()));
    this.verifyEq(sys.DateTime.make(2000, sys.Month.feb(), 28, 23, 59, 59, 0, sys.TimeZone.utc()), this.ber().readGenTime(sys.Str.toBuf("20000228235959Z").in()));
    this.verifyEq(sys.DateTime.make(2000, sys.Month.jan(), 31, 23, 59, 59, 9000000, sys.TimeZone.utc()), this.ber().readGenTime(sys.Str.toBuf("20000131235959.009Z").in()));
    this.verifyEq(sys.DateTime.make(2000, sys.Month.feb(), 28, 23, 59, 59, 90000000, sys.TimeZone.utc()), this.ber().readGenTime(sys.Str.toBuf("20000228235959.09Z").in()));
    this.verifyEq(sys.DateTime.make(2000, sys.Month.dec(), 31, 23, 59, 59, 900000000, sys.TimeZone.utc()), this.ber().readGenTime(sys.Str.toBuf("20001231235959.9Z").in()));
    return;
  }

  testReadGenTimeType() {
    let now = Asn.genTime(sys.DateTime.now());
    this.verifyEq(now, this.ber(this.enc(now)).readObj());
    (now = now.push(AsnTag.context(0).implicit()));
    this.verify(this.ber(this.enc(now)).readObj().isAny());
    this.verifyEq(now, this.ber(this.enc(now)).readObj(now));
    return;
  }

  testReadSequenceType() {
    let seq = Asn.seq(sys.List.make(sys.Obj.type$.toNullable()));
    let seq2 = Asn.seq(sys.List.make(sys.Obj.type$.toNullable()));
    this.verify(this.ber(this.enc(seq)).readObj().coll().isEmpty());
    let one = Asn.int(sys.ObjUtil.coerce(1, sys.Obj.type$));
    (seq = Asn.seq(sys.List.make(AsnObj.type$, [one])));
    (seq2 = sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.ber(this.enc(seq)).readObj(), AsnColl.type$), AsnSeq.type$));
    this.verifyEq(sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(seq2.size(), sys.Obj.type$.toNullable()));
    this.verifyEq(one, seq2.get(sys.ObjUtil.coerce(0, sys.Obj.type$)));
    (seq = Asn.seq(sys.List.make(AsnObj.type$, [Asn.int(sys.ObjUtil.coerce(1, sys.Obj.type$)), Asn.octets(sys.Str.toBuf("two"))])));
    let b = BerWriter.toBuf(seq);
    (seq2 = sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.ber(this.enc(seq)).readObj(), AsnColl.type$), AsnSeq.type$));
    this.verifyEq(sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(seq2.size(), sys.Obj.type$.toNullable()));
    let oid = Asn.oid("1.2.3");
    (seq = Asn.seq(sys.List.make(AsnSeq.type$, [Asn.seq(sys.List.make(AsnOid.type$, [oid]))])));
    (seq2 = sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.ber(this.enc(seq)).readObj(), AsnColl.type$), AsnSeq.type$));
    let nested = sys.ObjUtil.coerce(seq2.vals().first(), AsnColl.type$);
    this.verifyEq(oid, nested.vals().first());
    (seq = sys.ObjUtil.coerce(Asn.seq(sys.List.make(AsnObj.type$, [Asn.int(sys.ObjUtil.coerce(1, sys.Obj.type$))])).push(AsnTag.context(0).implicit()), AsnSeq.type$));
    this.verify(this.ber(this.enc(seq)).readObj().isAny());
    this.verifyEq(seq, this.ber(this.enc(seq)).readObj(seq));
    return;
  }

  static make() {
    const $self = new BerReaderTest();
    BerReaderTest.make$($self);
    return $self;
  }

  static make$($self) {
    BerTest.make$($self);
    return;
  }

}

class BerWriterTest extends BerTest {
  constructor() {
    super();
    const this$ = this;
    this.#dummy = sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$);
    this.#ber = BerWriter.make(this.#dummy.out());
    return;
  }

  typeof() { return BerWriterTest.type$; }

  #dummy = null;

  // private field reflection only
  __dummy(it) { if (it === undefined) return this.#dummy; else this.#dummy = it; }

  #ber = null;

  // private field reflection only
  __ber(it) { if (it === undefined) return this.#ber; else this.#ber = it; }

  testLength() {
    let e = sys.ObjUtil.coerce(sys.Buf.make().write(0), sys.Buf.type$.toNullable());
    let b = sys.Buf.make();
    this.#ber.writeLen(0, b.out());
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), sys.ObjUtil.coerce(b, sys.Buf.type$));
    sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(127);
    this.#ber.writeLen(127, sys.ObjUtil.coerce(b.clear(), sys.Buf.type$.toNullable()).out());
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), sys.ObjUtil.coerce(b, sys.Buf.type$));
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(129), sys.Buf.type$.toNullable()).write(128);
    this.#ber.writeLen(128, sys.ObjUtil.coerce(b.clear(), sys.Buf.type$.toNullable()).out());
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), sys.ObjUtil.coerce(b, sys.Buf.type$));
    return;
  }

  testNegativeLengthFails() {
    const this$ = this;
    let b = sys.Buf.make();
    this.verifyErr(AsnErr.type$, (it) => {
      this$.#ber.writeLen(-1, b.out());
      return;
    });
    return;
  }

  testBooleanEncoding() {
    let e = sys.Buf.make();
    this.verifyBufEq(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(255), sys.Buf.type$.toNullable()), sys.Buf.type$), this.#ber.writeBool(true));
    this.verifyBufEq(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()), sys.Buf.type$), this.#ber.writeBool(false));
    return;
  }

  testUnivBooleanTag() {
    let e = sys.ObjUtil.coerce(sys.Buf.make().write(1), sys.Buf.type$.toNullable());
    let b = sys.Buf.make();
    this.#ber.writeTag(AsnTag.univBool(), Format.primitive(), b.out());
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), sys.ObjUtil.coerce(b, sys.Buf.type$));
    return;
  }

  testIntegerEncoding() {
    let e = sys.Buf.make();
    e.write(0);
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), this.#ber.writeInt(sys.ObjUtil.coerce(0, sys.Obj.type$)));
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(127), sys.Buf.type$.toNullable()).write(255), sys.Buf.type$.toNullable()).write(255), sys.Buf.type$.toNullable()).write(255), sys.Buf.type$.toNullable()).write(255), sys.Buf.type$.toNullable()).write(255), sys.Buf.type$.toNullable()).write(255), sys.Buf.type$.toNullable()).write(255);
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), this.#ber.writeInt(sys.ObjUtil.coerce(sys.Int.maxVal(), sys.Obj.type$)));
    sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(255);
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), this.#ber.writeInt(sys.ObjUtil.coerce(-1, sys.Obj.type$)));
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(254), sys.Buf.type$.toNullable()).write(81);
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), this.#ber.writeInt(sys.ObjUtil.coerce(-431, sys.Obj.type$)));
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(128), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0);
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), this.#ber.writeInt(sys.ObjUtil.coerce(sys.Int.minVal(), sys.Obj.type$)));
    let i = math.BigInt.makeInt(sys.Int.maxVal()).increment();
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(128), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).write(0);
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), this.#ber.writeInt(i));
    return;
  }

  testUnivIntegerTag() {
    let e = sys.ObjUtil.coerce(sys.Buf.make().write(2), sys.Buf.type$.toNullable());
    let b = sys.Buf.make();
    this.#ber.writeTag(AsnTag.univInt(), Format.primitive(), b.out());
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), sys.ObjUtil.coerce(b, sys.Buf.type$));
    return;
  }

  testBitStringEncoding() {
    let hex = "cafe_babe";
    let b = sys.Buf.fromHex(hex);
    let bits = Asn.bits(sys.Buf.fromHex(hex));
    let e = sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.Buf.make().write(0), sys.Buf.type$.toNullable()).writeBuf(b), sys.Buf.type$.toNullable());
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), this.#ber.writeBits(sys.ObjUtil.coerce(bits, AsnBin.type$)));
    (bits = Asn.bits(sys.ObjUtil.coerce(sys.Buf.make(), sys.Buf.type$)));
    this.verifyBufEq(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()), sys.Buf.type$), this.#ber.writeBits(sys.ObjUtil.coerce(bits, AsnBin.type$)));
    (bits = Asn.bits(sys.Buf.fromHex("0000_0000_0000_0000_0000")));
    this.verifyBufEq(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()), sys.Buf.type$), this.#ber.writeBits(sys.ObjUtil.coerce(bits, AsnBin.type$)));
    (b = sys.Buf.fromHex("0000_0000_0000_0000_0001"));
    this.verifyBufEq(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(0), sys.Buf.type$.toNullable()).writeBuf(b), sys.Buf.type$.toNullable()), sys.Buf.type$), this.#ber.writeBits(sys.ObjUtil.coerce(Asn.bits(b.dup()), AsnBin.type$)));
    return;
  }

  testUnivBitStringTag() {
    let e = sys.ObjUtil.coerce(sys.Buf.make().write(3), sys.Buf.type$.toNullable());
    let b = sys.Buf.make();
    this.#ber.writeTag(AsnTag.univBits(), Format.primitive(), b.out());
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), sys.ObjUtil.coerce(b, sys.Buf.type$));
    return;
  }

  testOctetStringEncoding() {
    let text = "Octet String";
    let e = sys.Str.toBuf(text);
    let os = Asn.octets(sys.Str.toBuf(text));
    this.verifyBufEq(e, this.#ber.writeOcts(sys.ObjUtil.coerce(os, AsnBin.type$)));
    (os = Asn.octets(sys.Str.toBuf("")));
    e.clear();
    this.verifyBufEq(e, this.#ber.writeOcts(sys.ObjUtil.coerce(os, AsnBin.type$)));
    return;
  }

  testUnivOctetStringTag() {
    let e = sys.ObjUtil.coerce(sys.Buf.make().write(4), sys.Buf.type$.toNullable());
    let b = sys.Buf.make();
    this.#ber.writeTag(AsnTag.univOcts(), Format.primitive(), b.out());
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), sys.ObjUtil.coerce(b, sys.Buf.type$));
    return;
  }

  testNullEncoding() {
    let b = this.#ber.writeNull();
    this.verify(b.isEmpty());
    return;
  }

  testUnivNullTag() {
    let e = sys.ObjUtil.coerce(sys.Buf.make().write(5), sys.Buf.type$.toNullable());
    let b = sys.Buf.make();
    this.#ber.writeTag(AsnTag.univNull(), Format.primitive(), b.out());
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), sys.ObjUtil.coerce(b, sys.Buf.type$));
    return;
  }

  testOidEncoding() {
    let oid = Asn.oid(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(1, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(1048574, sys.Obj.type$.toNullable())]));
    this.verifyBufEq(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(43, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(6, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(191, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(255, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(126, sys.Obj.type$.toNullable())])), this.#ber.writeOid(oid));
    (oid = Asn.oid("0.39"));
    this.verifyBufEq(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(39, sys.Obj.type$.toNullable())])), this.#ber.writeOid(oid));
    (oid = Asn.oid("1.39"));
    this.verifyBufEq(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(79, sys.Obj.type$.toNullable())])), this.#ber.writeOid(oid));
    (oid = Asn.oid("2.40"));
    this.verifyBufEq(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(120, sys.Obj.type$.toNullable())])), this.#ber.writeOid(oid));
    (oid = Asn.oid(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(4294967295, sys.Obj.type$.toNullable())])));
    this.verifyBufEq(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(144, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(128, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(79, sys.Obj.type$.toNullable())])), this.#ber.writeOid(oid));
    (oid = Asn.oid("2.47"));
    this.verifyBufEq(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(127, sys.Obj.type$.toNullable())])), this.#ber.writeOid(oid));
    (oid = Asn.oid("2.48"));
    this.verifyBufEq(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(129, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])), this.#ber.writeOid(oid));
    (oid = Asn.oid("2.100.3"));
    this.verifyBufEq(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(129, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(52, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(3, sys.Obj.type$.toNullable())])), this.#ber.writeOid(oid));
    (oid = Asn.oid("2.560"));
    this.verifyBufEq(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(133, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(0, sys.Obj.type$.toNullable())])), this.#ber.writeOid(oid));
    (oid = Asn.oid("2.16843570"));
    this.verifyBufEq(this.octets(sys.List.make(sys.Int.type$, [sys.ObjUtil.coerce(136, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(132, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(135, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(2, sys.Obj.type$.toNullable())])), this.#ber.writeOid(oid));
    return;
  }

  testBadOids() {
    const this$ = this;
    let oid = Asn.oid("0");
    this.verifyErr(AsnErr.type$, (it) => {
      this$.#ber.writeOid(oid);
      return;
    });
    (oid = Asn.oid("3.1.2"));
    this.verifyErr(AsnErr.type$, (it) => {
      this$.#ber.writeOid(oid);
      return;
    });
    (oid = Asn.oid("1.3.-1"));
    this.verifyErr(AsnErr.type$, (it) => {
      this$.#ber.writeOid(oid);
      return;
    });
    return;
  }

  testUnivOidTag() {
    let e = sys.ObjUtil.coerce(sys.Buf.make().write(6), sys.Buf.type$.toNullable());
    let b = sys.Buf.make();
    this.#ber.writeTag(AsnTag.univOid(), Format.primitive(), b.out());
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), sys.ObjUtil.coerce(b, sys.Buf.type$));
    return;
  }

  testStrings() {
    const this$ = this;
    sys.List.make(sys.Str.type$, ["", "foo"]).each((s) => {
      let e = sys.Str.toBuf(s);
      this$.verifyBufEq(e, this$.#ber.writeUtf8(sys.ObjUtil.coerce(Asn.utf8(s).val(), sys.Str.type$)));
      this$.verifyBufEq(e, this$.#ber.writeUtf8(sys.ObjUtil.coerce(Asn.str(s, AsnTag.univPrintStr()).val(), sys.Str.type$)));
      this$.verifyBufEq(e, this$.#ber.writeUtf8(sys.ObjUtil.coerce(Asn.str(s, AsnTag.univIa5Str()).val(), sys.Str.type$)));
      this$.verifyBufEq(e, this$.#ber.writeUtf8(sys.ObjUtil.coerce(Asn.str(s, AsnTag.univVisStr()).val(), sys.Str.type$)));
      return;
    });
    return;
  }

  testUnivStringTags() {
    let b = sys.Buf.make();
    this.#ber.writeTag(AsnTag.univUtf8(), Format.primitive(), b.out());
    this.verifyEq(sys.ObjUtil.coerce(12, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(b.flip(), sys.Buf.type$.toNullable()).read(), sys.Obj.type$.toNullable()));
    this.#ber.writeTag(AsnTag.univPrintStr(), Format.primitive(), sys.ObjUtil.coerce(b.clear(), sys.Buf.type$.toNullable()).out());
    this.verifyEq(sys.ObjUtil.coerce(19, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(b.flip(), sys.Buf.type$.toNullable()).read(), sys.Obj.type$.toNullable()));
    this.#ber.writeTag(AsnTag.univIa5Str(), Format.primitive(), sys.ObjUtil.coerce(b.clear(), sys.Buf.type$.toNullable()).out());
    this.verifyEq(sys.ObjUtil.coerce(22, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(b.flip(), sys.Buf.type$.toNullable()).read(), sys.Obj.type$.toNullable()));
    this.#ber.writeTag(AsnTag.univVisStr(), Format.primitive(), sys.ObjUtil.coerce(b.clear(), sys.Buf.type$.toNullable()).out());
    this.verifyEq(sys.ObjUtil.coerce(26, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(b.flip(), sys.Buf.type$.toNullable()).read(), sys.Obj.type$.toNullable()));
    return;
  }

  testUtcTime() {
    let ts = sys.Date.fromStr("2015-03-24").midnight(sys.TimeZone.utc());
    this.verifyBufEq(sys.Str.toBuf("1503240000Z"), this.#ber.writeUtcTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(1980, sys.Month.mar(), 24, 23, 59, 59, 0, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("800324235959Z"), this.#ber.writeUtcTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(2000, sys.Month.mar(), 24, 23, 59, 59, 1, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("000324235959Z"), this.#ber.writeUtcTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(2000, sys.Month.mar(), 24, 23, 59, 59, 900000, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("000324235959Z"), this.#ber.writeUtcTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(2000, sys.Month.mar(), 24, 23, 59, 59, 1000000, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("000324235959.001Z"), this.#ber.writeUtcTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(2000, sys.Month.mar(), 24, 23, 59, 59, 10000000, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("000324235959.01Z"), this.#ber.writeUtcTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(2000, sys.Month.mar(), 24, 23, 59, 59, 100000000, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("000324235959.1Z"), this.#ber.writeUtcTime(ts));
    return;
  }

  testUnivUtcTimeTag() {
    let b = sys.Buf.make();
    this.#ber.writeTag(AsnTag.univUtcTime(), Format.primitive(), b.out());
    this.verifyEq(sys.ObjUtil.coerce(23, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(b.flip(), sys.Buf.type$.toNullable()).read(), sys.Obj.type$.toNullable()));
    return;
  }

  testGenTime() {
    let ts = sys.Date.fromStr("2015-03-24").midnight(sys.TimeZone.utc());
    this.verifyBufEq(sys.Str.toBuf("201503240000Z"), this.#ber.writeGenTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(1980, sys.Month.mar(), 24, 23, 59, 59, 0, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("19800324235959Z"), this.#ber.writeGenTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(2000, sys.Month.mar(), 24, 23, 59, 59, 1, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("20000324235959Z"), this.#ber.writeGenTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(2000, sys.Month.mar(), 24, 23, 59, 59, 900000, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("20000324235959Z"), this.#ber.writeGenTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(2000, sys.Month.mar(), 24, 23, 59, 59, 1000000, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("20000324235959.001Z"), this.#ber.writeGenTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(2000, sys.Month.mar(), 24, 23, 59, 59, 10000000, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("20000324235959.01Z"), this.#ber.writeGenTime(ts));
    (ts = sys.ObjUtil.coerce(sys.DateTime.make(2000, sys.Month.mar(), 24, 23, 59, 59, 100000000, sys.TimeZone.utc()), sys.DateTime.type$));
    this.verifyBufEq(sys.Str.toBuf("20000324235959.1Z"), this.#ber.writeGenTime(ts));
    return;
  }

  testUnivGenTimeTag() {
    let b = sys.Buf.make();
    this.#ber.writeTag(AsnTag.univGenTime(), Format.primitive(), b.out());
    this.verifyEq(sys.ObjUtil.coerce(24, sys.Obj.type$.toNullable()), sys.ObjUtil.coerce(sys.ObjUtil.coerce(b.flip(), sys.Buf.type$.toNullable()).read(), sys.Obj.type$.toNullable()));
    return;
  }

  testSequenceEncoding() {
    let e = sys.Buf.make();
    let seq = Asn.seq(sys.List.make(sys.Obj.type$.toNullable()));
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), this.#ber.writeColl(seq));
    (seq = Asn.seq(sys.List.make(AsnObj.type$, [Asn.int(sys.ObjUtil.coerce(15, sys.Obj.type$))])));
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(2), sys.Buf.type$.toNullable()).write(1), sys.Buf.type$.toNullable()).write(15);
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), this.#ber.writeColl(seq));
    (seq = Asn.seq(sys.List.make(AsnObj.type$, [Asn.int(sys.ObjUtil.coerce(15, sys.Obj.type$)), Asn.Null()])));
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(e.clear(), sys.Buf.type$.toNullable()).write(2), sys.Buf.type$.toNullable()).write(1), sys.Buf.type$.toNullable()).write(15), sys.Buf.type$.toNullable()).write(5), sys.Buf.type$.toNullable()).write(0);
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), this.#ber.writeColl(seq));
    return;
  }

  testUnivSequenceTag() {
    let e = sys.ObjUtil.coerce(sys.Buf.make().write(48), sys.Buf.type$.toNullable());
    let b = sys.Buf.make();
    this.#ber.writeTag(AsnTag.univSeq(), Format.constructed(), b.out());
    this.verifyBufEq(sys.ObjUtil.coerce(e, sys.Buf.type$), sys.ObjUtil.coerce(b, sys.Buf.type$));
    return;
  }

  static make() {
    const $self = new BerWriterTest();
    BerWriterTest.make$($self);
    return $self;
  }

  static make$($self) {
    BerTest.make$($self);
    ;
    return;
  }

}

const p = sys.Pod.add$('asn1');
const xp = sys.Param.noParams$();
let m;
AsnObj.type$ = p.at$('AsnObj','sys::Obj',[],{},8194,AsnObj);
AsnTag.type$ = p.at$('AsnTag','sys::Obj',[],{},8226,AsnTag);
AsnTagClass.type$ = p.at$('AsnTagClass','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,AsnTagClass);
AsnTagMode.type$ = p.at$('AsnTagMode','sys::Enum',[],{'sys::Serializable':"sys::Serializable{simple=true;}"},8234,AsnTagMode);
AsnTagBuilder.type$ = p.at$('AsnTagBuilder','sys::Obj',[],{},8192,AsnTagBuilder);
Asn.type$ = p.at$('Asn','sys::Obj',[],{},8226,Asn);
AsnObjBuilder.type$ = p.at$('AsnObjBuilder','sys::Obj',[],{},8192,AsnObjBuilder);
AsnErr.type$ = p.at$('AsnErr','sys::Err',[],{},8194,AsnErr);
BerWriter.type$ = p.at$('BerWriter','sys::Obj',[],{},8192,BerWriter);
Format.type$ = p.at$('Format','sys::Enum',[],{'sys::NoDoc':"",'sys::Serializable':"sys::Serializable{simple=true;}"},8234,Format);
BerReader.type$ = p.at$('BerReader','sys::Obj',[],{},8192,BerReader);
AsnColl.type$ = p.at$('AsnColl','asn1::AsnObj',[],{},8195,AsnColl);
AsnItem.type$ = p.at$('AsnItem','sys::Obj',[],{},8226,AsnItem);
AsnSeq.type$ = p.at$('AsnSeq','asn1::AsnColl',[],{},8194,AsnSeq);
AsnSet.type$ = p.at$('AsnSet','asn1::AsnColl',[],{},8194,AsnSet);
AsnCollBuilder.type$ = p.at$('AsnCollBuilder','sys::Obj',[],{},8192,AsnCollBuilder);
AsnBin.type$ = p.at$('AsnBin','asn1::AsnObj',[],{'sys::NoDoc':""},8194,AsnBin);
AsnOid.type$ = p.at$('AsnOid','asn1::AsnObj',[],{},8226,AsnOid);
AsnTagTest.type$ = p.at$('AsnTagTest','sys::Test',[],{},8192,AsnTagTest);
AsnObjTest.type$ = p.at$('AsnObjTest','sys::Test',[],{},8192,AsnObjTest);
BerTest.type$ = p.at$('BerTest','sys::Test',[],{'sys::NoDoc':""},8193,BerTest);
BerReaderTest.type$ = p.at$('BerReaderTest','asn1::BerTest',[],{},8192,BerReaderTest);
BerWriterTest.type$ = p.at$('BerWriterTest','asn1::BerTest',[],{},8192,BerWriterTest);
AsnObj.type$.af$('tags',73730,'asn1::AsnTag[]',{}).af$('val',73730,'sys::Obj?',{}).am$('make',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tags','asn1::AsnTag[]',false),new sys.Param('val','sys::Obj?',false)]),{}).am$('bool',8192,'sys::Bool',xp,{}).am$('isBool',8192,'sys::Bool',xp,{}).am$('int',8192,'sys::Int',xp,{}).am$('isInt',8192,'sys::Bool',xp,{}).am$('bigInt',8192,'math::BigInt',xp,{}).am$('buf',270336,'sys::Buf',xp,{}).am$('isOcts',8192,'sys::Bool',xp,{}).am$('isNull',8192,'sys::Bool',xp,{}).am$('oid',8192,'asn1::AsnOid',xp,{}).am$('isOid',8192,'sys::Bool',xp,{}).am$('str',8192,'sys::Str',xp,{}).am$('ts',8192,'sys::DateTime',xp,{}).am$('coll',8192,'asn1::AsnColl',xp,{}).am$('seq',8192,'asn1::AsnSeq',xp,{}).am$('isAny',270336,'sys::Bool',xp,{'sys::NoDoc':""}).am$('push',270336,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('tag','asn1::AsnTag',false)]),{}).am$('effectiveTags',8192,'asn1::AsnTag[]',xp,{}).am$('tag',8192,'asn1::AsnTag',xp,{}).am$('univTag',8192,'asn1::AsnTag',xp,{}).am$('isPrimitive',8192,'sys::Bool',xp,{}).am$('hash',9216,'sys::Int',xp,{}).am$('valHash',266240,'sys::Int',xp,{}).am$('equals',9216,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('valEquals',266240,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('that','asn1::AsnObj',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('valStr',266240,'sys::Str',xp,{});
AsnTag.type$.af$('cls',73730,'asn1::AsnTagClass',{}).af$('id',73730,'sys::Int',{}).af$('mode',73730,'asn1::AsnTagMode',{}).af$('univAny',106498,'asn1::AsnTag',{'sys::NoDoc':""}).af$('univBool',106498,'asn1::AsnTag',{}).af$('univInt',106498,'asn1::AsnTag',{}).af$('univBits',106498,'asn1::AsnTag',{}).af$('univOcts',106498,'asn1::AsnTag',{}).af$('univNull',106498,'asn1::AsnTag',{}).af$('univOid',106498,'asn1::AsnTag',{}).af$('univReal',106498,'asn1::AsnTag',{}).af$('univEnum',106498,'asn1::AsnTag',{}).af$('univUtf8',106498,'asn1::AsnTag',{}).af$('univSeq',106498,'asn1::AsnTag',{}).af$('univSet',106498,'asn1::AsnTag',{}).af$('univPrintStr',106498,'asn1::AsnTag',{}).af$('univIa5Str',106498,'asn1::AsnTag',{}).af$('univUtcTime',106498,'asn1::AsnTag',{}).af$('univGenTime',106498,'asn1::AsnTag',{}).af$('univGraphStr',106498,'asn1::AsnTag',{}).af$('univVisStr',106498,'asn1::AsnTag',{}).am$('univ',40962,'asn1::AsnTagBuilder',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Int',false)]),{}).am$('context',40962,'asn1::AsnTagBuilder',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Int',false)]),{}).am$('app',40962,'asn1::AsnTagBuilder',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Int',false)]),{}).am$('priv',40962,'asn1::AsnTagBuilder',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Int',false)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cls','asn1::AsnTagClass',false),new sys.Param('id','sys::Int',false),new sys.Param('mode','asn1::AsnTagMode',false)]),{}).am$('toCls',8192,'asn1::AsnTag',sys.List.make(sys.Param.type$,[new sys.Param('newCls','asn1::AsnTagClass',false)]),{'sys::NoDoc':""}).am$('toId',8192,'asn1::AsnTag',sys.List.make(sys.Param.type$,[new sys.Param('newId','sys::Int',false)]),{'sys::NoDoc':""}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('strictEquals',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
AsnTagClass.type$.af$('univ',106506,'asn1::AsnTagClass',{}).af$('app',106506,'asn1::AsnTagClass',{}).af$('context',106506,'asn1::AsnTagClass',{}).af$('priv',106506,'asn1::AsnTagClass',{}).af$('vals',106498,'asn1::AsnTagClass[]',{}).af$('mask',73730,'sys::Int',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('mask','sys::Int',false)]),{}).am$('isUniv',8192,'sys::Bool',xp,{}).am$('isApp',8192,'sys::Bool',xp,{}).am$('isContext',8192,'sys::Bool',xp,{}).am$('isPriv',8192,'sys::Bool',xp,{}).am$('fromStr',40966,'asn1::AsnTagClass?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
AsnTagMode.type$.af$('explicit',106506,'asn1::AsnTagMode',{}).af$('implicit',106506,'asn1::AsnTagMode',{}).af$('vals',106498,'asn1::AsnTagMode[]',{}).am$('make',133124,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false)]),{}).am$('fromStr',40966,'asn1::AsnTagMode?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
AsnTagBuilder.type$.af$('cls',67584,'asn1::AsnTagClass?',{}).af$('identifier',67584,'sys::Int?',{}).am$('make',8196,'sys::Void',xp,{}).am$('univ',8192,'sys::This',xp,{}).am$('context',8192,'sys::This',xp,{}).am$('app',8192,'sys::This',xp,{}).am$('priv',8192,'sys::This',xp,{}).am$('id',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Int',false)]),{}).am$('explicit',8192,'asn1::AsnTag',xp,{}).am$('implicit',8192,'asn1::AsnTag',xp,{}).am$('check',2048,'sys::Void',xp,{});
Asn.type$.af$('Null',106498,'asn1::AsnObj',{}).am$('builder',34818,'asn1::AsnObjBuilder',xp,{}).am$('tag',40962,'asn1::AsnObjBuilder',sys.List.make(sys.Param.type$,[new sys.Param('tag','asn1::AsnTag?',false)]),{}).am$('bool',40962,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',false)]),{}).am$('int',40962,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('bits',40962,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('bits','sys::Buf',false)]),{}).am$('octets',40962,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('oid',40962,'asn1::AsnOid',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('asnEnum',40962,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',false)]),{}).am$('utf8',40962,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{}).am$('str',40962,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('univ','asn1::AsnTag',false)]),{}).am$('utc',40962,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{}).am$('genTime',40962,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{}).am$('seq',40962,'asn1::AsnSeq',sys.List.make(sys.Param.type$,[new sys.Param('items','sys::Obj',false)]),{}).am$('set',40962,'asn1::AsnSet',sys.List.make(sys.Param.type$,[new sys.Param('items','sys::Obj',false)]),{}).am$('any',40962,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('raw','sys::Buf',false)]),{'sys::NoDoc':""}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
AsnObjBuilder.type$.af$('tags',67584,'asn1::AsnTag[]',{}).am$('make',8196,'sys::Void',xp,{}).am$('tag',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('tag','asn1::AsnTag?',false)]),{}).am$('bool',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',false)]),{}).am$('int',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('bits',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('bits','sys::Buf',false)]),{}).am$('octets',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('asnNull',8192,'asn1::AsnObj',xp,{}).am$('oid',8192,'asn1::AsnOid',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('asnEnum',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Int',false)]),{}).am$('utf8',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false)]),{}).am$('str',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Str',false),new sys.Param('univ','asn1::AsnTag',false)]),{}).am$('utc',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{}).am$('genTime',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false)]),{}).am$('seq',8192,'asn1::AsnSeq',sys.List.make(sys.Param.type$,[new sys.Param('items','sys::Obj',false)]),{}).am$('set',8192,'asn1::AsnSet',sys.List.make(sys.Param.type$,[new sys.Param('items','sys::Obj',false)]),{}).am$('any',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('raw','sys::Buf',false)]),{'sys::NoDoc':""}).am$('finish',2048,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('obj','asn1::AsnObj',false)]),{}).am$('etags',2048,'asn1::AsnTag[]',sys.List.make(sys.Param.type$,[new sys.Param('univ','asn1::AsnTag',false)]),{});
AsnErr.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',true),new sys.Param('cause','sys::Err?',true)]),{});
BerWriter.type$.af$('out',67584,'sys::OutStream',{}).am$('toBuf',40962,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('obj','asn1::AsnObj',false),new sys.Param('buf','sys::Buf',true)]),{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false)]),{}).am$('close',8192,'sys::Bool',xp,{}).am$('write',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('obj','asn1::AsnObj',false)]),{}).am$('doWrite',2048,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('obj','asn1::AsnObj',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('writeTag',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('tag','asn1::AsnTag',false),new sys.Param('format','asn1::Format',false),new sys.Param('out','sys::OutStream',false)]),{'sys::NoDoc':""}).am$('writeLen',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('len','sys::Int',false),new sys.Param('out','sys::OutStream',false)]),{'sys::NoDoc':""}).am$('writeVal',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('obj','asn1::AsnObj',false),new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""}).am$('writeAny',270336,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('any','asn1::AsnBin',false),new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""}).am$('writeBool',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Bool',false),new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""}).am$('writeInt',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false),new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""}).am$('writeBits',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('bits','asn1::AsnBin',false),new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""}).am$('writeOcts',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('octets','asn1::AsnBin',false),new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""}).am$('writeNull',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""}).am$('writeOid',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('oid','asn1::AsnOid',false),new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""}).am$('writeUtf8',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('str','sys::Str',false),new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""}).am$('writeUtcTime',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false),new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""}).am$('writeGenTime',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false),new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""}).am$('writeTimestamp',2048,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('ts','sys::DateTime',false),new sys.Param('buf','sys::Buf',false),new sys.Param('isGenTime','sys::Bool',false)]),{}).am$('writeColl',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('coll','asn1::AsnColl',false),new sys.Param('buf','sys::Buf',true)]),{'sys::NoDoc':""});
Format.type$.af$('primitive',106506,'asn1::Format',{}).af$('constructed',106506,'asn1::Format',{}).af$('vals',106498,'asn1::Format[]',{}).af$('mask',73730,'sys::Int',{}).am$('make',2052,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('$ordinal','sys::Int',false),new sys.Param('$name','sys::Str',false),new sys.Param('mask','sys::Int',false)]),{}).am$('fromStr',40966,'asn1::Format?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('checked','sys::Bool',true)]),{}).am$('static$init',165890,'sys::Void',xp,{});
BerReader.type$.af$('in',67584,'sys::InStream',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false)]),{}).am$('close',8192,'sys::Bool',xp,{}).am$('readObj',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('spec','asn1::AsnObj?',true)]),{}).am$('doReadObj',2048,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',false),new sys.Param('spec','asn1::AsnObj?',false)]),{}).am$('readTag',8192,'asn1::AsnTag',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',true)]),{'sys::NoDoc':""}).am$('readLen',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',true)]),{'sys::NoDoc':""}).am$('tryUniversal',2048,'asn1::AsnObj?',sys.List.make(sys.Param.type$,[new sys.Param('tag','asn1::AsnTag',false),new sys.Param('val','sys::Buf',false)]),{}).am$('readBool',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',true)]),{'sys::NoDoc':""}).am$('readInt',8192,'math::BigInt',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',true)]),{'sys::NoDoc':""}).am$('readBits',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',true)]),{'sys::NoDoc':""}).am$('readOcts',8192,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',true)]),{'sys::NoDoc':""}).am$('readOid',8192,'sys::Int[]',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',true)]),{'sys::NoDoc':""}).am$('readUtf8',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',true)]),{'sys::NoDoc':""}).am$('bufToStr',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('buf','sys::Buf',false),new sys.Param('charset','sys::Charset',false)]),{}).am$('readUtcTime',8192,'sys::DateTime',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',true)]),{'sys::NoDoc':""}).am$('readGenTime',8192,'sys::DateTime',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',true)]),{'sys::NoDoc':""}).am$('timePattern',34818,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('enc','sys::Str',false),new sys.Param('forGenTime','sys::Bool',false)]),{}).am$('readItems',8192,'asn1::AsnItem[]',sys.List.make(sys.Param.type$,[new sys.Param('in','sys::InStream',true)]),{'sys::NoDoc':""});
AsnColl.type$.am$('make',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tags','asn1::AsnTag[]',false),new sys.Param('val','sys::Obj',false)]),{}).am$('toItems',40962,'asn1::AsnItem[]',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{'sys::NoDoc':""}).am$('builder',40962,'asn1::AsnCollBuilder',xp,{}).am$('isSeq',8192,'sys::Bool',xp,{}).am$('isSet',8192,'sys::Bool',xp,{}).am$('vals',8192,'asn1::AsnObj[]',xp,{}).am$('items',8192,'asn1::AsnItem[]',xp,{'sys::NoDoc':""}).am$('size',8192,'sys::Int',xp,{}).am$('isEmpty',8192,'sys::Bool',xp,{}).am$('get',8192,'asn1::AsnObj?',sys.List.make(sys.Param.type$,[new sys.Param('key','sys::Obj',false)]),{}).am$('valStr',267264,'sys::Str',xp,{});
AsnItem.type$.af$('name',73730,'sys::Str?',{}).af$('val',73730,'asn1::AsnObj',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','asn1::AsnObj',false),new sys.Param('name','sys::Str?',true)]),{}).am$('hash',271360,'sys::Int',xp,{}).am$('equals',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','sys::Obj?',false)]),{});
AsnSeq.type$.am$('makeUniv',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('make',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tags','asn1::AsnTag[]',false),new sys.Param('val','sys::Obj',false)]),{});
AsnSet.type$.am$('makeUniv',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('val','sys::Obj',false)]),{}).am$('make',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tags','asn1::AsnTag[]',false),new sys.Param('val','sys::Obj',false)]),{});
AsnCollBuilder.type$.af$('items',67584,'asn1::AsnItem[]',{}).am$('make',8196,'sys::Void',xp,{}).am$('add',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('val','asn1::AsnObj',false),new sys.Param('name','sys::Str?',true)]),{}).am$('item',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('item','asn1::AsnItem',false)]),{}).am$('toSeq',8192,'asn1::AsnColl',sys.List.make(sys.Param.type$,[new sys.Param('tag','asn1::AsnTag?',true)]),{}).am$('toSet',8192,'asn1::AsnColl',sys.List.make(sys.Param.type$,[new sys.Param('tag','asn1::AsnTag?',true)]),{});
AsnBin.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tags','asn1::AsnTag[]',false),new sys.Param('buf','sys::Buf',false)]),{}).am$('isAny',271360,'sys::Bool',xp,{}).am$('size',8192,'sys::Int',xp,{}).am$('readAllStr',8192,'sys::Str',xp,{}).am$('buf',271360,'sys::Buf',xp,{}).am$('forRead',128,'sys::Buf',xp,{}).am$('unsafeBuf',2048,'sys::Buf',xp,{}).am$('decode',8192,'asn1::AsnObj',sys.List.make(sys.Param.type$,[new sys.Param('spec','asn1::AsnObj?',true)]),{}).am$('push',271360,'asn1::AsnBin',sys.List.make(sys.Param.type$,[new sys.Param('tag','asn1::AsnTag',false)]),{}).am$('valHash',267264,'sys::Int',xp,{}).am$('valEquals',267264,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('obj','asn1::AsnObj',false)]),{});
AsnOid.type$.am$('make',4100,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('tags','asn1::AsnTag[]',false),new sys.Param('val','sys::Int[]',false)]),{}).am$('ids',8192,'sys::Int[]',xp,{}).am$('oidStr',8192,'sys::Str',xp,{}).am$('getRange',8192,'asn1::AsnOid',sys.List.make(sys.Param.type$,[new sys.Param('range','sys::Range',false)]),{'sys::Operator':""}).am$('compare',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('that','sys::Obj',false)]),{}).am$('valStr',271360,'sys::Str',xp,{});
AsnTagTest.type$.am$('testEquality',8192,'sys::Void',xp,{}).am$('testEffectiveTags',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
AsnObjTest.type$.af$('cx1',100354,'asn1::AsnTag',{}).af$('cx2',100354,'asn1::AsnTag',{}).am$('testBoolean',8192,'sys::Void',xp,{}).am$('testInteger',8192,'sys::Void',xp,{}).am$('testOctetString',8192,'sys::Void',xp,{}).am$('testBitString',8192,'sys::Void',xp,{}).am$('testOid',8192,'sys::Void',xp,{}).am$('testOidCompare',8192,'sys::Void',xp,{}).am$('testOidGetRange',8192,'sys::Void',xp,{}).am$('testNull',8192,'sys::Void',xp,{}).am$('testIA5Str',8192,'sys::Void',xp,{}).am$('testPrintableStr',8192,'sys::Void',xp,{}).am$('testUtf8Str',8192,'sys::Void',xp,{}).am$('testVisibleStr',8192,'sys::Void',xp,{}).am$('testUtcTime',8192,'sys::Void',xp,{}).am$('testGenTime',8192,'sys::Void',xp,{}).am$('testSequence',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{}).am$('static$init',165890,'sys::Void',xp,{});
BerTest.type$.am$('octets',4096,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('bytes','sys::Int[]',false)]),{}).am$('octIn',4096,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('bytes','sys::Int[]',false)]),{}).am$('enc',4096,'sys::Buf',sys.List.make(sys.Param.type$,[new sys.Param('obj','asn1::AsnObj',false)]),{}).am$('encIn',4096,'sys::InStream',sys.List.make(sys.Param.type$,[new sys.Param('obj','asn1::AsnObj',false)]),{}).am$('verifyBufEq',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('expected','sys::Buf',false),new sys.Param('actual','sys::Buf',false)]),{}).am$('bufEq',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('a','sys::Buf',false),new sys.Param('b','sys::Buf',false)]),{}).am$('make',139268,'sys::Void',xp,{});
BerReaderTest.type$.am$('ber',4096,'asn1::BerReader',sys.List.make(sys.Param.type$,[new sys.Param('bytes','sys::Buf',true)]),{}).am$('testReadLen',8192,'sys::Void',xp,{}).am$('testReadBoolean',8192,'sys::Void',xp,{}).am$('testReadBooleanType',8192,'sys::Void',xp,{}).am$('testReadInteger',8192,'sys::Void',xp,{}).am$('testReadIntegerType',8192,'sys::Void',xp,{}).am$('testReadBitString',8192,'sys::Void',xp,{}).am$('testReadBitStringType',8192,'sys::Void',xp,{}).am$('testReadOctetString',8192,'sys::Void',xp,{}).am$('testReadOctetStringType',8192,'sys::Void',xp,{}).am$('testReadNullType',8192,'sys::Void',xp,{}).am$('testReadOid',8192,'sys::Void',xp,{}).am$('testReadOidType',8192,'sys::Void',xp,{}).am$('testStrings',8192,'sys::Void',xp,{}).am$('doStringTest',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('univ','asn1::AsnTag',false)]),{}).am$('testReadUtcTime',8192,'sys::Void',xp,{}).am$('testReadUtcTimeType',8192,'sys::Void',xp,{}).am$('testReadGenTime',8192,'sys::Void',xp,{}).am$('testReadGenTimeType',8192,'sys::Void',xp,{}).am$('testReadSequenceType',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
BerWriterTest.type$.af$('dummy',67584,'sys::Buf',{}).af$('ber',67584,'asn1::BerWriter',{}).am$('testLength',8192,'sys::Void',xp,{}).am$('testNegativeLengthFails',8192,'sys::Void',xp,{}).am$('testBooleanEncoding',8192,'sys::Void',xp,{}).am$('testUnivBooleanTag',8192,'sys::Void',xp,{}).am$('testIntegerEncoding',8192,'sys::Void',xp,{}).am$('testUnivIntegerTag',8192,'sys::Void',xp,{}).am$('testBitStringEncoding',8192,'sys::Void',xp,{}).am$('testUnivBitStringTag',8192,'sys::Void',xp,{}).am$('testOctetStringEncoding',8192,'sys::Void',xp,{}).am$('testUnivOctetStringTag',8192,'sys::Void',xp,{}).am$('testNullEncoding',8192,'sys::Void',xp,{}).am$('testUnivNullTag',8192,'sys::Void',xp,{}).am$('testOidEncoding',8192,'sys::Void',xp,{}).am$('testBadOids',8192,'sys::Void',xp,{}).am$('testUnivOidTag',8192,'sys::Void',xp,{}).am$('testStrings',8192,'sys::Void',xp,{}).am$('testUnivStringTags',8192,'sys::Void',xp,{}).am$('testUtcTime',8192,'sys::Void',xp,{}).am$('testUnivUtcTimeTag',8192,'sys::Void',xp,{}).am$('testGenTime',8192,'sys::Void',xp,{}).am$('testUnivGenTimeTag',8192,'sys::Void',xp,{}).am$('testSequenceEncoding',8192,'sys::Void',xp,{}).am$('testUnivSequenceTag',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "asn1");
m.set("pod.version", "1.0.81");
m.set("pod.depends", "sys 1.0;math 1.0");
m.set("pod.summary", "ASN.1 Data Model");
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
  AsnObj,
  AsnTag,
  AsnTagClass,
  AsnTagMode,
  AsnTagBuilder,
  Asn,
  AsnObjBuilder,
  AsnErr,
  BerWriter,
  Format,
  BerReader,
  AsnColl,
  AsnItem,
  AsnSeq,
  AsnSet,
  AsnCollBuilder,
  AsnBin,
  AsnOid,
  AsnTagTest,
  AsnObjTest,
  BerTest,
  BerReaderTest,
  BerWriterTest,
};
